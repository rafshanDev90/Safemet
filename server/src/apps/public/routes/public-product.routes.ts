import { Router } from 'express';
import { PublicProductController } from '../controllers/public-product.controller.js';

const router = Router();

// Public read-only product catalog (no auth required)
router.get('/', PublicProductController.list);
router.get('/slug/:slug', PublicProductController.getBySlug);

export default router;
