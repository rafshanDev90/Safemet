import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/index.js';

export function notFoundHandler(_req: Request, res: Response): void {
  const response: ApiResponse = {
    success: false,
    message: 'Route not found',
  };
  res.status(404).json(response);
}
