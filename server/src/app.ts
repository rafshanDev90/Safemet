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

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('uploads'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
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

app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
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
