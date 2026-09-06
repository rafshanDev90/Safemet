import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import type { ApiResponse } from '../../../types/index.js';

export class ProductController {
  static list(req: Request, res: Response): void {
    const result = ProductService.findPaginated(req.validatedQuery);
    const response: ApiResponse = {
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    };
    res.json(response);
  }

  static getById(req: Request<{ id: string }>, res: Response): void {
    const { id } = req.params;
    const product = ProductService.findById(id);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        message: `Product with id "${id}" not found`,
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

  static create(req: Request, res: Response): void {
    const input = req.validatedBody;

    if (ProductService.slugExists(input.slug)) {
      const response: ApiResponse = {
        success: false,
        message: `A product with slug "${input.slug}" already exists`,
      };
      res.status(409).json(response);
      return;
    }

    const product = ProductService.create(input);
    const response: ApiResponse = {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
    res.status(201).json(response);
  }

  static update(req: Request<{ id: string }>, res: Response): void {
    const { id } = req.params;
    const input = req.validatedBody;
    const existing = ProductService.findById(id);

    if (input.slug && (!existing || input.slug !== existing.slug) && ProductService.slugExists(input.slug, id)) {
      const response: ApiResponse = {
        success: false,
        message: `A product with slug "${input.slug}" already exists`,
      };
      res.status(409).json(response);
      return;
    }

    const product = ProductService.update(id, input);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        message: `Product with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
    res.json(response);
  }

  static delete(req: Request<{ id: string }>, res: Response): void {
    const { id } = req.params;
    const deleted = ProductService.softDelete(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        message: `Product with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully',
    };
    res.json(response);
  }

  static uploadImage(req: Request, res: Response): void {
    const file = req.file;
    if (!file) {
      const response: ApiResponse = {
        success: false,
        message: 'No image file provided',
      };
      res.status(400).json(response);
      return;
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
    const response: ApiResponse = {
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl },
    };
    res.status(201).json(response);
  }
}
