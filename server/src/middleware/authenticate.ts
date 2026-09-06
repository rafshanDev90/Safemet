import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import type { JwtAccessPayload, JwtPayload } from '../types/index.js';
import type { ApiResponse } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication required. Provide a Bearer token.',
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded.type === 'mfa_pending') {
      const response: ApiResponse = {
        success: false,
        message: 'MFA verification required. This token cannot access protected resources.',
      };
      res.status(401).json(response);
      return;
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      const response: ApiResponse = {
        success: false,
        message: 'Token has expired. Please refresh your session.',
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: 'Invalid or malformed token.',
    };
    res.status(401).json(response);
  }
}
