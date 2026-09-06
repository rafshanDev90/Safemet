import 'express';
import type { AuthenticatedUser } from './index.js';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      user?: AuthenticatedUser;
    }
  }
}
