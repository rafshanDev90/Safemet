import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  AuthTokens,
  User,
  Product,
  CreateProductInput,
  UpdateProductInput,
  PaginatedResult,
  Session,
  DashboardStats,
  ApiResponse,
} from '../types';

// In-Memory Token Storage (Stateless & Secure)
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

// Session storage backup for tab persistence across browser refresh
const STORAGE_KEY_REFRESH = 'safemete_rt_sess';
const STORAGE_KEY_USER = 'safemete_auth_user';

export function getStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null, remember = false) {
  if (!user) {
    sessionStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_USER);
  } else {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    if (remember) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }
}

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function setTokens(tokens: AuthTokens | null, remember = false) {
  if (!tokens) {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    sessionStorage.removeItem(STORAGE_KEY_REFRESH);
    localStorage.removeItem(STORAGE_KEY_REFRESH);
  } else {
    memoryAccessToken = tokens.accessToken;
    memoryRefreshToken = tokens.refreshToken;
    sessionStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken);
    if (remember) {
      localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken);
    }
  }
}

export function getRefreshToken(): string | null {
  if (memoryRefreshToken) return memoryRefreshToken;
  const stored = sessionStorage.getItem(STORAGE_KEY_REFRESH) || localStorage.getItem(STORAGE_KEY_REFRESH);
  if (stored) {
    memoryRefreshToken = stored;
  }
  return memoryRefreshToken;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token Refresh Queue state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: handle 401 & token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setTokens(null);
        setStoredUser(null);
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session_expired=1';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.auth.refreshToken(refreshToken);
        const newTokens = response.tokens;
        if (newTokens) {
          setTokens(newTokens);
          processQueue(null, newTokens.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('No tokens received from refresh');
        }
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        setTokens(null);
        setStoredUser(null);
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session_expired=1';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract data from ApiResponse
function extractData<T>(response: { data: ApiResponse<T> }): T {
  const res = response.data;
  if (!res.success) {
    throw new Error(res.message || 'Request failed');
  }
  return res.data as T;
}

// API Methods
export const api = {
  auth: {
    login: async (credentials: { email: string; password?: string; rememberMe?: boolean }): Promise<AuthResponse | { requiresMfa: true; tempToken: string }> => {
      const response = await apiClient.post<ApiResponse<{ mfaRequired: boolean; tempToken?: string; tokens?: AuthTokens; user?: User }>>(
        '/auth/login',
        { email: credentials.email, password: credentials.password }
      );
      const data = extractData(response);

      if (data.mfaRequired && data.tempToken) {
        return { requiresMfa: true, tempToken: data.tempToken };
      }

      if (data.tokens && data.user) {
        setTokens(data.tokens, credentials.rememberMe);
        setStoredUser(data.user, credentials.rememberMe);
        return { user: data.user, tokens: data.tokens };
      }

      throw new Error('Unexpected login response');
    },

    verifyMfa: async (data: { tempToken: string; code: string; rememberMe?: boolean }): Promise<AuthResponse> => {
      const response = await apiClient.post<ApiResponse<{ tokens: AuthTokens }>>(
        '/auth/verify-mfa',
        { tempToken: data.tempToken, otp: data.code }
      );
      const result = extractData(response);

      if (result.tokens) {
        setTokens(result.tokens, data.rememberMe);
        // Get user from /me endpoint
        const meResponse = await apiClient.get<ApiResponse<User>>('/auth/me');
        const user = extractData(meResponse);
        setStoredUser(user, data.rememberMe);
        return { user, tokens: result.tokens };
      }

      throw new Error('MFA verification failed');
    },

    refreshToken: async (token: string): Promise<{ tokens: AuthTokens }> => {
      if (!token) throw new Error('Invalid refresh token');
      const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken: token });
      const tokens = extractData(response);
      return { tokens };
    },

    logout: async (): Promise<void> => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          await apiClient.post('/auth/logout', { refreshToken });
        } catch {
          // Continue with local cleanup even if server call fails
        }
      }
      setTokens(null);
      setStoredUser(null);
    },

    getMe: async (): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      return extractData(response);
    },
  },

  products: {
    list: async (params: {
      search?: string;
      category?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }): Promise<PaginatedResult<Product>> => {
      const response = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/admin/products', { params });
      return extractData(response);
    },

    getById: async (id: string): Promise<Product> => {
      const response = await apiClient.get<ApiResponse<Product>>(`/admin/products/${id}`);
      return extractData(response);
    },

    create: async (productData: CreateProductInput): Promise<Product> => {
      const response = await apiClient.post<ApiResponse<Product>>('/admin/products', productData);
      return extractData(response);
    },

    update: async (id: string, updates: UpdateProductInput): Promise<Product> => {
      const response = await apiClient.patch<ApiResponse<Product>>(`/admin/products/${id}`, updates);
      return extractData(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
      extractData(response);
    },

    uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/admin/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return extractData(response);
    },
  },

  users: {
    list: async (params: { search?: string; role?: string; page?: number; limit?: number }): Promise<PaginatedResult<User>> => {
      const response = await apiClient.get<ApiResponse<PaginatedResult<User>>>('/admin/users', { params });
      return extractData(response);
    },

    getById: async (id: string): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>(`/admin/users/${id}`);
      return extractData(response);
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const response = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, updates);
      return extractData(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
      extractData(response);
    },

    resetPassword: async (userId: string): Promise<{ tempPassword: string; message: string }> => {
      const response = await apiClient.post<ApiResponse<{ tempPassword: string }>>(`/admin/users/${userId}/reset-password`);
      const data = extractData(response);
      return { tempPassword: data.tempPassword, message: 'Password reset successfully' };
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
      const response = await apiClient.post<ApiResponse<void>>('/admin/users/change-password', data);
      extractData(response);
    },
  },

  dashboard: {
    getStats: async (_role?: string): Promise<DashboardStats> => {
      // Backend doesn't have this endpoint yet - return placeholder
      return {
        totalProducts: 0,
        activeUsers: 0,
        recentActivityCount: 0,
        systemHealth: {
          status: 'healthy',
          uptimePercentage: 99.9,
          dbLatencyMs: 12,
          activeSessionsCount: 1,
          lastBackupAt: new Date().toISOString(),
        },
        categoryDistribution: [],
        recentProducts: [],
        recentActivities: [],
      };
    },
  },
};
