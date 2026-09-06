import type { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS } from '../types/index.js';
import type { ApiResponse, UserRole } from '../types/index.js';

export function authorize(...allowedPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required.',
      };
      res.status(401).json(response);
      return;
    }

    const userRole = req.user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = allowedPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      const response: ApiResponse = {
        success: false,
        message: `Access denied. Required permissions: ${allowedPermissions.join(', ')}`,
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
}
