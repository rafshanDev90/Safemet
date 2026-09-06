import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import type { ApiResponse } from '../types/index.js';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    const key = path || '_root';
    if (!formatted[key]) formatted[key] = [];
    formatted[key].push(issue.message);
  }
  return formatted;
}

export function validate(schemas: ValidateOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedBody = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedQuery = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedParams = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        errors,
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
}
