import { AuthError } from '../apps/auth/services/auth.service.js';

function redact(body) {
  if (!body) return '';
  const copy = { ...body };
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

export function errorHandler(err, req, res, _next) {
  console.error('\n============================================================');
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(`[ERROR] Status: ${err.status || 500} | Message: ${err.message}`);
  if (req.body && Object.keys(req.body).length) {
    console.error(`[ERROR] Body: ${redact(req.body)}`);
  }
  console.error('[ERROR] Stack:');
  console.error(err?.stack || '(no stack)');
  console.error('============================================================\n');

  if (err instanceof AuthError) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === 'SyntaxError' && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}