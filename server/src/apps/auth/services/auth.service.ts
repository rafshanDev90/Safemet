import bcrypt from 'bcrypt';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import crypto from 'node:crypto';
import type { Request } from 'express';
import { User, type IUser, type UserRole } from '../../../models/user.model.js';
import { RefreshToken } from '../../../models/refresh-token.model.js';
import { MfaOtp } from '../../../models/mfa-otp.model.js';
import { sendOtpEmail } from '../../../utils/email.js';
import type {
  RegisterDTO,
  LoginDTO,
  VerifyMfaDTO,
  AuthenticatedUser,
} from '../types/auth.types.js';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRY || '15m') as SignOptions['expiresIn'];
const REFRESH_EXPIRY_DAYS = 7;
const MFA_TEMP_EXPIRY = (process.env.JWT_MFA_TEMP_EXPIRY || '5m') as SignOptions['expiresIn'];
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface TokenRefreshResult {
  success: boolean;
  tokens?: AuthTokens;
  error?: 'invalid' | 'revoked' | 'expired';
  status: number;
}

export class AuthService {
  static hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
  }

  static verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  static signAccessToken(user: IUser): string {
    const payload: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    };
    return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, {
      expiresIn: ACCESS_EXPIRY,
    });
  }

  static signMfaPendingToken(userId: string): string {
    const payload = {
      sub: userId,
      scope: 'mfa_pending',
      type: 'mfa_pending',
    };
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: MFA_TEMP_EXPIRY,
    });
  }

  static getExpiryDate(): Date {
    return new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, isDeleted: false });
  }

  static async register(input: RegisterDTO): Promise<IUser> {
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
  static async login(input: LoginDTO, req: Request): Promise<
    { mfaRequired: true; tempToken: string } | { mfaRequired: false; tokens: AuthTokens; user: IUser }
  > {
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

  private static async initiateMfa(user: IUser): Promise<{ mfaRequired: true; tempToken: string }> {
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
  static async verifyMfa(input: VerifyMfaDTO, req: Request): Promise<AuthTokens> {
    const decoded = jwt.verify(input.tempToken, JWT_SECRET) as {
      sub?: string;
      scope?: string;
      type?: string;
    };

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

  static async createTokenPair(user: IUser, req: Request): Promise<AuthTokens> {
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

  private static isTokenExpired(err: { name?: string }): boolean {
    return err?.name === 'TokenExpiredError';
  }

  /**
   * Refresh token rotation with a security countermeasure:
   *
   * If a request presents a token hash whose record is ALREADY marked as
   * revoked (i.e. the token was used before → replay/possible theft), we
   * immediately invalidate ALL active refresh tokens for that userId. This
   * forces both the legitimate user and any attacker to re-authenticate fully.
   */
  static async refresh(rawRefreshToken: string): Promise<TokenRefreshResult> {
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
    } as unknown as Request);

    return { success: true, tokens, status: 200 };
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
  }

  static async logout(refreshToken: string, userId?: string): Promise<boolean> {
    const tokenHash = this.hashToken(refreshToken);
    const record = await RefreshToken.findOne({ tokenHash });

    if (!record) return false;
    if (userId && record.userId.toString() !== userId) return false;

    await record.updateOne({ isRevoked: true });
    return true;
  }

  static async logoutAll(userId: string): Promise<number> {
    const result = await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
    return result.modifiedCount || 0;
  }

  static sanitizeUser(user: IUser) {
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
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }
}
