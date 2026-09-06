import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

const MAX_BODY_LOG = 2000;

function isJsonRequest(req: Request): boolean {
  const ct = req.headers['content-type'] || '';
  return ct.includes('application/json');
}

function safeStringify(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (json && json.length > MAX_BODY_LOG) {
      return json.slice(0, MAX_BODY_LOG) + '... [truncated]';
    }
    return json || '';
  } catch {
    return '[Unserializable]';
  }
}

function redact(body: Record<string, unknown> | undefined): string {
  if (!body) return '';
  const copy: Record<string, unknown> = { ...body };
  if (copy.password) copy.password = '***';
  if (copy.otp) copy.otp = '***';
  if (copy.code) copy.code = '***';
  if (copy.tempToken) copy.tempToken = '***';
  if (copy.currentPassword) copy.currentPassword = '***';
  if (copy.newPassword) copy.newPassword = '***';
  if (copy.refreshToken) copy.refreshToken = '***';
  if (typeof copy.tokens === 'object' && copy.tokens) {
    copy.tokens = '[Tokens redacted]';
  }
  return safeStringify(copy);
}

function formatDuration(ms: number): string {
  return `${ms.toFixed(0)}ms`;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = crypto.randomBytes(4).toString('hex');
  const startTime = Date.now();
  const label = `[${new Date().toISOString()}] [REQ:${requestId}] ${req.method} ${req.originalUrl}`;

  console.log(`${label}`);
  console.log(`  └─ Origin:    ${req.headers.origin || '-'}`);
  console.log(`  └─ Auth:      ${req.headers.authorization ? 'Bearer <present>' : 'none'}`);
  console.log(`  └─ User-Agent: ${(req.headers['user-agent'] || '-').slice(0, 80)}`);

  if (isJsonRequest(req) && req.body && Object.keys(req.body).length > 0) {
    console.log(`  └─ Body:      ${redact(req.body as Record<string, unknown>)}`);
  }

  // Capture the JSON response body for later logging
  const originalJson = res.json.bind(res);
  (res as any).json = (payload: unknown) => {
    (res as any).__responseBody = payload;
    return originalJson(payload);
  };

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' : res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(
      `${label} → ${statusColor}${res.statusCode}${reset} [${formatDuration(duration)}]`
    );

    // Log the response body for error responses so bugs are visible in real time
    if (res.statusCode >= 400 && (res as any).__responseBody) {
      console.log(`  └─ Response:  ${safeStringify((res as any).__responseBody)}`);
    }
  });

  next();
}
