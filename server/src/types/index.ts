import type { UserRole } from '../models/user.model.js';

export type { UserRole };

export interface ProductSpecification {
  label: string;
  value: string;
}

export type ProductCategorySlug =
  | 'fire-protection-system'
  | 'fire-detection-alarm-system'
  | 'fire-suppression-system'
  | 'fire-extinguisher'
  | 'ms-seamless-pipe';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategorySlug;
  image?: string;
  order: number;
  graphicType?: string;
  specs?: ProductSpecification[];
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  category: ProductCategorySlug;
  image?: string;
  order?: number;
  graphicType?: string;
  specs?: ProductSpecification[];
  description?: string;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  category?: ProductCategorySlug;
  image?: string;
  order?: number;
  graphicType?: string;
  specs?: ProductSpecification[];
  description?: string;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  category?: ProductCategorySlug | 'all';
  sortBy?: 'name' | 'order' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtAccessPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  type: 'access';
}

export interface JwtMfaPendingPayload {
  sub: string;
  scope: 'mfa_pending';
  type: 'mfa_pending';
}

export type JwtPayload = JwtAccessPayload | JwtMfaPendingPayload;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
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
