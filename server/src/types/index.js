export const ROLE_PERMISSIONS = {
  super_admin: [
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'users:read',
    'users:update',
    'users:delete',
    'users:assign_role',
  ],
  editor: [
    'products:create',
    'products:read',
    'products:update',
  ],
  support_staff: [
    'products:read',
  ],
};