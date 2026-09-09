import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { validate } from '../../../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  verifyMfaSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post(
  '/register',
  validate({ body: registerSchema }),
  AuthController.register
);

router.post(
  '/login',
  validate({ body: loginSchema }),
  AuthController.login
);

router.post(
  '/verify-mfa',
  validate({ body: verifyMfaSchema }),
  AuthController.verifyMfa
);

router.post(
  '/refresh',
  validate({ body: refreshTokenSchema }),
  AuthController.refresh
);

router.post(
  '/logout',
  authenticate,
  validate({ body: refreshTokenSchema }),
  AuthController.logout
);

router.post(
  '/logout-all',
  authenticate,
  AuthController.logoutAll
);

router.get(
  '/me',
  authenticate,
  AuthController.me
);

export default router;