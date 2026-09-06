import type { Request, Response } from 'express';
import { AuthService, AuthError } from '../services/auth.service.js';
import type { ApiResponse } from '../../../types/index.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const input = req.validatedBody;
      const existing = await AuthService.findByEmail(input.email);
      if (existing) {
        const response: ApiResponse = {
          success: false,
          message: 'A user with this email already exists',
        };
        res.status(409).json(response);
        return;
      }

      const user = await AuthService.register(input);
      const response: ApiResponse = {
        success: true,
        message: 'Account created successfully',
        data: AuthService.sanitizeUser(user),
      };
      res.status(201).json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const input = req.validatedBody;
      const result = await AuthService.login(input, req);

      if (result.mfaRequired) {
        const response: ApiResponse = {
          success: true,
          message: 'MFA verification required. Check your email for the OTP.',
          data: {
            mfaRequired: true,
            tempToken: result.tempToken,
            expiresIn: '5m',
          },
        };
        res.json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          mfaRequired: false,
          tokens: result.tokens,
          user: AuthService.sanitizeUser(result.user),
        },
      };
      res.json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async verifyMfa(req: Request, res: Response): Promise<void> {
    try {
      const input = req.validatedBody;
      const tokens = await AuthService.verifyMfa(input, req);

      const response: ApiResponse = {
        success: true,
        message: 'MFA verified successfully',
        data: { tokens },
      };
      res.json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.validatedBody;
      const result = await AuthService.refresh(refreshToken);

      if (!result.success) {
        const messages: Record<string, string> = {
          invalid: 'Invalid refresh token',
          revoked: 'Refresh token reuse detected. All sessions have been revoked. Please log in again.',
          expired: 'Refresh token has expired. Please log in again.',
        };
        const response: ApiResponse = {
          success: false,
          message: messages[result.error || 'invalid'],
        };
        res.status(result.status).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Tokens refreshed successfully',
        data: result.tokens,
      };
      res.json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.validatedBody;
      await AuthService.logout(refreshToken, req.user?.id);

      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      res.json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async logoutAll(req: Request, res: Response): Promise<void> {
    try {
      const count = await AuthService.logoutAll(req.user!.id);
      const response: ApiResponse = {
        success: true,
        message: `Logged out from all devices (${count} sessions revoked)`,
      };
      res.json(response);
    } catch (err) {
      AuthController.handleError(err, res);
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    const response: ApiResponse = {
      success: true,
      message: 'User profile retrieved successfully',
      data: req.user,
    };
    res.json(response);
  }

  private static handleError(err: unknown, res: Response): void {
    if (err instanceof AuthError) {
      const response: ApiResponse = {
        success: false,
        message: err.message,
      };
      res.status(err.status).json(response);
      return;
    }

    if (err instanceof Error && err.name === 'TokenExpiredError') {
      const response: ApiResponse = {
        success: false,
        message: 'Temporary token has expired. Please restart the login process.',
      };
      res.status(401).json(response);
      return;
    }

    if (err instanceof Error && err.name === 'JsonWebTokenError') {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid or malformed token.',
      };
      res.status(401).json(response);
      return;
    }

    console.error('[AUTH] Unexpected error:', err);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
}
