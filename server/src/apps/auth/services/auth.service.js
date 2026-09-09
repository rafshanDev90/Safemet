import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { User } from '../../../models/user.model.js';
import { RefreshToken } from '../../../models/refresh-token.model.js';
import { MfaOtp } from '../../../models/mfa-otp.model.js';
import { sendOtpEmail } from '../../../utils/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY_DAYS = 7;
const MFA_TEMP_EXPIRY = process.env.JWT_MFA_TEMP_EXPIRY || '5m';
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export class AuthService {
  static hashPassword(plain) {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
  }

  static verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }

  static signAccessToken(user) {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, {
      expiresIn: ACCESS_EXPIRY,
    });
  }

  static signMfaPendingToken(userId) {
    const payload = {
      sub: userId,
      scope: 'mfa_pending',
      type: 'mfa_pending',
    };
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: MFA_TEMP_EXPIRY,
    });
  }

  static getExpiryDate() {
    return new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  static async findByEmail(email) {
    return User.findOne({ email, isDeleted: false });
  }

  static async register(input) {
    const passwordHash = await this.hashPassword(input.password);
    return User.create({
      email: input.email,
      passwordHash,
      name: input.name,
      role: 'editor',
    });
  }

  /**
   * Step 1 of login: verify credentials. If MFA is enabled on the account,
   * issue a short-lived `mfa_pending` scoped token and email an OTP. Otherwise
   * issue the full access + refresh token pair.
   */
  static async login(input, req) {
    const user = await User.findOne({ email: input.email, isDeleted: false }).select('+passwordHash');

    if (!user) {
      throw new AuthError('Invalid email or password', 401, 'invalid_credentials');
    }

    const valid = await this.verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new AuthError('Invalid email or password', 401, 'invalid_credentials');
    }

    if (user.mfaEnabled) {
      return this.initiateMfa(user);
    }

    const tokens = await this.createTokenPair(user, req);
    return { mfaRequired: false, tokens, user };
  }

  static async initiateMfa(user) {
    const otp = this.generateOtp();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await MfaOtp.create({
      userId: user._id,
      otpHash,
      purpose: 'login',
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    await sendOtpEmail(user.email, otp);

    return {
      mfaRequired: true,
      tempToken: this.signMfaPendingToken(user._id.toString()),
    };
  }

  /**
   * Step 2 of login: verify the OTP against the mfa_pending temp token, then
   * issue the full access + refresh token pair.
   */
  static async verifyMfa(input, req) {
    const decoded = jwt.verify(input.tempToken, JWT_SECRET);

    if (decoded.scope !== 'mfa_pending' || decoded.type !== 'mfa_pending') {
      throw new AuthError('Invalid temporary token', 401, 'invalid_mfa_token');
    }

    const userId = decoded.sub;
    if (!userId) {
      throw new AuthError('Invalid temporary token', 401, 'invalid_mfa_token');
    }

    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new AuthError('User no longer exists', 401, 'invalid_mfa_token');
    }

    const otpHash = crypto.createHash('sha256').update(input.otp).digest('hex');

    // Find and consume the latest unused, unexpired OTP for this user.
    const otpRecord = await MfaOtp.findOne({
      userId: user._id,
      purpose: 'login',
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otpHash !== otpHash) {
      throw new AuthError('Invalid or expired OTP', 400, 'invalid_otp');
    }

    await MfaOtp.updateOne({ _id: otpRecord._id }, { isUsed: true });

    return this.createTokenPair(user, req);
  }

  static async createTokenPair(user, req) {
    const rawRefreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    await RefreshToken.create({
      tokenHash,
      userId: user._id,
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: req.ip || 'unknown',
      expiresAt: this.getExpiryDate(),
    });

    await User.updateOne({ _id: user._id }, { lastLoginAt: new Date().toISOString() });

    return {
      accessToken: this.signAccessToken(user),
      refreshToken: rawRefreshToken,
    };
  }

  /**
   * Refresh token rotation with a security countermeasure:
   *
   * If a request presents a token hash whose record is ALREADY marked as
   * revoked (i.e. the token was used before → replay/possible theft), we
   * immediately invalidate ALL active refresh tokens for that userId. This
   * forces both the legitimate user and any attacker to re-authenticate fully.
   */
  static async refresh(rawRefreshToken) {
    const tokenHash = this.hashToken(rawRefreshToken);
    const record = await RefreshToken.findOne({ tokenHash });

    if (!record) {
      return { success: false, error: 'invalid', status: 401 };
    }

    // --- Security countermeasure: reused / already-revoked token ---
    if (record.isRevoked) {
      await this.revokeAllUserTokens(record.userId.toString());
      return {
        success: false,
        error: 'revoked',
        status: 401,
      };
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await record.updateOne({ isRevoked: true });
      return { success: false, error: 'expired', status: 401 };
    }

    const user = await User.findOne({ _id: record.userId, isDeleted: false });
    if (!user) {
      await this.revokeAllUserTokens(record.userId.toString());
      return { success: false, error: 'invalid', status: 401 };
    }

    // Token is valid: rotate it by revoking the presented token.
    await record.updateOne({ isRevoked: true });

    const tokens = await this.createTokenPair(user, {
      headers: { 'user-agent': record.userAgent },
      ip: record.ip,
    });

    return { success: true, tokens, status: 200 };
  }

  static async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
  }

  static async logout(refreshToken, userId) {
    const tokenHash = this.hashToken(refreshToken);
    const record = await RefreshToken.findOne({ tokenHash });

    if (!record) return false;
    if (userId && record.userId.toString() !== userId) return false;

    await record.updateOne({ isRevoked: true });
    return true;
  }

  static async logoutAll(userId) {
    const result = await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
    return result.modifiedCount || 0;
  }

  static sanitizeUser(user) {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export class AuthError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }
}