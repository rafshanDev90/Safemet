import { AuthService, AuthError } from '../services/auth.service.js';

export class AuthController {
  static async register(req, res) {
    try {
      const input = req.validatedBody;
      const existing = await AuthService.findByEmail(input.email);
      if (existing) {
        res.status(409).json({
          success: false,
          message: 'A user with this email already exists',
        });
        return;
      }

      const user = await AuthService.register(input);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: AuthService.sanitizeUser(user),
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async login(req, res) {
    try {
      const input = req.validatedBody;
      const result = await AuthService.login(input, req);

      if (result.mfaRequired) {
        res.json({
          success: true,
          message: 'MFA verification required. Check your email for the OTP.',
          data: {
            mfaRequired: true,
            tempToken: result.tempToken,
            expiresIn: '5m',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          mfaRequired: false,
          tokens: result.tokens,
          user: AuthService.sanitizeUser(result.user),
        },
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async verifyMfa(req, res) {
    try {
      const input = req.validatedBody;
      const tokens = await AuthService.verifyMfa(input, req);

      res.json({
        success: true,
        message: 'MFA verified successfully',
        data: { tokens },
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.validatedBody;
      const result = await AuthService.refresh(refreshToken);

      if (!result.success) {
        const messages = {
          invalid: 'Invalid refresh token',
          revoked: 'Refresh token reuse detected. All sessions have been revoked. Please log in again.',
          expired: 'Refresh token has expired. Please log in again.',
        };
        res.status(result.status).json({
          success: false,
          message: messages[result.error || 'invalid'],
        });
        return;
      }

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: result.tokens,
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.validatedBody;
      await AuthService.logout(refreshToken, req.user?.id);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async logoutAll(req, res) {
    try {
      const count = await AuthService.logoutAll(req.user.id);
      res.json({
        success: true,
        message: `Logged out from all devices (${count} sessions revoked)`,
      });
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async me(req, res) {
    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: req.user,
    });
  }

  static handleError(err, res) {
    if (err instanceof AuthError) {
      res.status(err.status).json({
        success: false,
        message: err.message,
      });
      return;
    }

    if (err instanceof Error && err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Temporary token has expired. Please restart the login process.',
      });
      return;
    }

    if (err instanceof Error && err.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid or malformed token.',
      });
      return;
    }

    console.error('[AUTH] Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}