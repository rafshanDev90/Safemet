import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { AuthController } from '../../auth/controllers/auth.controller.js';
import {
  listUsersSchema,
  updateUserSchema,
  resetPasswordSchema,
} from '../validators/user.validator.js';
import { changePasswordSchema } from '../../auth/validators/auth.validator.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize('users:read'),
  validate({ query: listUsersSchema }),
  UserController.list
);

router.get(
  '/:id',
  authorize('users:read'),
  UserController.getById
);

router.patch(
  '/:id',
  authorize('users:update'),
  validate({ body: updateUserSchema }),
  UserController.update
);

router.delete(
  '/:id',
  authorize('users:delete'),
  UserController.delete
);

router.post(
  '/:id/reset-password',
  authorize('users:update'),
  validate({ body: resetPasswordSchema }),
  UserController.resetPassword
);

router.post(
  '/change-password',
  validate({ body: changePasswordSchema }),
  UserController.changePassword
);

router.post(
  '/logout-all',
  AuthController.logoutAll
);

export default router;
