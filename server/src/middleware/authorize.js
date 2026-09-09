import { ROLE_PERMISSIONS } from '../types/index.js';

export function authorize(...allowedPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

    const hasPermission = allowedPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required permissions: ${allowedPermissions.join(', ')}`,
      });
      return;
    }

    next();
  };
}