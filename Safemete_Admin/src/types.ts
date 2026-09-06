export type UserRole = 'super_admin' | 'editor' | 'support_staff';

export type ProductCategorySlug =
  | 'fire-protection-system'
  | 'fire-detection-alarm-system'
  | 'fire-suppression-system'
  | 'fire-extinguisher'
  | 'ms-seamless-pipe';

export interface ProductSpecification {
  label: string;
  value: string;
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface MfaPendingResponse {
  requiresMfa: true;
  tempToken: string;
  message: string;
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

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetType: 'product' | 'user' | 'auth' | 'session' | 'system';
  targetName: string;
  timestamp: string;
  details?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'maintenance';
  uptimePercentage: number;
  dbLatencyMs: number;
  activeSessionsCount: number;
  lastBackupAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeUsers: number;
  recentActivityCount: number;
  systemHealth: SystemHealth;
  categoryDistribution: { category: string; label: string; count: number }[];
  recentProducts: Product[];
  recentActivities: ActivityLog[];
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategorySlug, string> = {
  'fire-protection-system': 'Fire Protection System',
  'fire-detection-alarm-system': 'Fire Detection & Alarm System',
  'fire-suppression-system': 'Fire Suppression System',
  'fire-extinguisher': 'Fire Extinguisher',
  'ms-seamless-pipe': 'MS Seamless Pipe',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  support_staff: 'Support Staff',
};
