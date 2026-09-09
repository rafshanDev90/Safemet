import { ProductService } from '../services/product.service.js';

export class ProductController {
  static list(req, res) {
    const result = ProductService.findPaginated(req.validatedQuery);
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const product = ProductService.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
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

  static create(req, res) {
    const input = req.validatedBody;

    if (ProductService.slugExists(input.slug)) {
      res.status(409).json({
        success: false,
        message: `A product with slug "${input.slug}" already exists`,
      });
      return;
    }

    const product = ProductService.create(input);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const input = req.validatedBody;
    const existing = ProductService.findById(id);

    if (input.slug && (!existing || input.slug !== existing.slug) && ProductService.slugExists(input.slug, id)) {
      res.status(409).json({
        success: false,
        message: `A product with slug "${input.slug}" already exists`,
      });
      return;
    }

    const product = ProductService.update(id, input);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  }

  static delete(req, res) {
    const { id } = req.params;
    const deleted = ProductService.softDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }

  static uploadImage(req, res) {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
      return;
    }
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl },
    });
  }
}