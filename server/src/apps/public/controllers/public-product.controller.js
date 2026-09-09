import { ProductService } from '../../admin/services/product.service.js';

export class PublicProductController {
  static list(req, res) {
    const { category, limit = '100' } = req.query;
    const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);

    let items = ProductService.findAll();

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category);
    }

    items = [...items].sort((a, b) => a.order - b.order).slice(0, parsedLimit);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: items,
    });
  }

  static getBySlug(req, res) {
    const { slug } = req.params;
    const product = ProductService.findBySlug(slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug "${slug}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  }
}