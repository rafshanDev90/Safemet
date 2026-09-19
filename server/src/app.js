import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import authRoutes from './apps/auth/routes/auth.routes.js';
import userRoutes from './apps/admin/routes/user.routes.js';
import productRoutes from './apps/admin/routes/product.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { requestLogger } from './middleware/request-logger.js';
import publicProductRoutes from './apps/public/routes/public-product.routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || 'uploads');
const CLIENT_DIST_DIR = path.resolve(process.env.CLIENT_DIST_DIR || path.resolve(__dirname, '../../client/dist'));
const ADMIN_DIST_DIR = path.resolve(process.env.ADMIN_DIST_DIR || path.resolve(__dirname, '../../admin/dist'));
const ADMIN_HOSTS = (process.env.ADMIN_HOSTS || '')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

function isAdminHost(host) {
  const hostname = (host || '').toLowerCase().split(':')[0];
  if (ADMIN_HOSTS.length > 0) return ADMIN_HOSTS.includes(hostname);
  return hostname.startsWith('admin.');
}

function serveSpa(distDir) {
  const indexHtml = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    return (_req, _res, next) => next();
  }
  const staticHandler = express.static(distDir);
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    staticHandler(req, res, () => res.sendFile(indexHtml));
  };
}

app.use(express.static(UPLOADS_DIR));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Real-time request logging for debugging
app.use(requestLogger);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Public auth routes (register, login, verify MFA, refresh)
app.use('/api/auth', authRoutes);

// Public read-only product catalog (for the consumer website)
app.use('/api/products', publicProductRoutes);

// Admin endpoints
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/products', productRoutes);

// Static SPA serving (public site on main domain, admin panel on subdomain)
app.use((req, res, next) => {
  const distDir = isAdminHost(req.headers.host || '') ? ADMIN_DIST_DIR : CLIENT_DIST_DIR;
  return serveSpa(distDir)(req, res, next);
});

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
      console.log(`[Server] Health:      http://localhost:${PORT}/api/health`);
      console.log(`[Server] Auth:        http://localhost:${PORT}/api/auth`);
      console.log(`[Server] Admin Users: http://localhost:${PORT}/api/admin/users`);
      console.log(`[Server] Products:    http://localhost:${PORT}/api/admin/products`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();

export default app;