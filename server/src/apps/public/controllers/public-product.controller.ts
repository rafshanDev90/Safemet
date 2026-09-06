import type { Request, Response } from 'express';
import { ProductService } from '../../admin/services/product.service.js';
import type { ApiResponse } from '../../../types/index.js';

export class PublicProductController {
  static list(req: Request, res: Response): void {
    const { category, limit = '100' } = req.query as { category?: string; limit?: string };
    const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);

    let items = ProductService.findAll();

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category);
    }

    items = [...items].sort((a, b) => a.order - b.order).slice(0, parsedLimit);

    const response: ApiResponse = {
      success: true,
      message: 'Products retrieved successfully',
      data: items,
    };
    res.json(response);
  }

  static getBySlug(req: Request<{ slug: string }>, res: Response): void {
    const { slug } = req.params;
    const product = ProductService.findBySlug(slug);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        message: `Product with slug "${slug}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
    res.json(response);
  }
}
