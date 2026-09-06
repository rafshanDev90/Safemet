import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/index.js';
import { AuthError } from '../apps/auth/services/auth.service.js';

function redact(body: Record<string, unknown> | undefined): string {
  if (!body) return '';
  const copy: Record<string, unknown> = { ...body };
  if (copy.password) copy.password = '***';
  if (copy.otp) copy.otp = '***';
  if (copy.code) copy.code = '***';
  if (copy.tempToken) copy.tempToken = '***';
  if (copy.refreshToken) copy.refreshToken = '***';
  try {
    return JSON.stringify(copy).slice(0, 2000);
  } catch {
    return '[Unserializable]';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('\n============================================================');
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(`[ERROR] Status: ${(err as any).status || 500} | Message: ${err.message}`);
  if (req.body && Object.keys(req.body).length) {
    console.error(`[ERROR] Body: ${redact(req.body as Record<string, unknown>)}`);
  }
  console.error('[ERROR] Stack:');
  console.error(err?.stack || '(no stack)');
  console.error('============================================================\n');

  if (err instanceof AuthError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
    };
    res.status(err.status).json(response);
    return;
  }

  if (err.name === 'SyntaxError' && 'body' in err) {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid JSON in request body',
    };
    res.status(400).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
    message: 'Internal server error',
  };
  res.status(500).json(response);
}
