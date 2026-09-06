import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { uploadProductImage } from '../../../middleware/upload.js';
import {
  createProductSchema,
  updateProductSchema,
  paginationSchema,
} from '../validators/product.validator.js';

const router = Router();

router.use(authenticate);

router.post('/upload', authorize('products:create'), uploadProductImage, ProductController.uploadImage);

router.get(
  '/',
  authorize('products:read'),
  validate({ query: paginationSchema }),
  ProductController.list
);

router.get(
  '/slug/:slug',
  authorize('products:read'),
  ProductController.getBySlug
);

router.get(
  '/:id',
  authorize('products:read'),
  ProductController.getById
);

router.post(
  '/',
  authorize('products:create'),
  validate({ body: createProductSchema }),
  ProductController.create
);

router.patch(
  '/:id',
  authorize('products:update'),
  validate({ body: updateProductSchema }),
  ProductController.update
);

router.delete(
  '/:id',
  authorize('products:delete'),
  ProductController.delete
);

export default router;
