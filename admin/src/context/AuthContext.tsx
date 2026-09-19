import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api, getStoredUser, setStoredUser, getRefreshToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tempMfaState: { tempToken: string; rememberMe: boolean } | null;
  login: (credentials: { email: string; password?: string; rememberMe?: boolean }) => Promise<{ requiresMfa: boolean }>;
  verifyMfa: (code: string) => Promise<void>;
  cancelMfa: () => void;
  logout: () => Promise<void>;
  updateCurrentUserProfile: (data: Partial<User>) => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission map matching backend ROLE_PERMISSIONS
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempMfaState, setTempMfaState] = useState<{ tempToken: string; rememberMe: boolean } | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredUser();
      const rt = getRefreshToken();

      if (stored && rt) {
        // Attempt to revalidate session via /me
        try {
          const freshUser = await api.auth.getMe();
          setUser(freshUser);
          setStoredUser(freshUser);
        } catch {
          // If /me fails, keep stored user for now; interceptor will redirect on 401
          setUser(stored);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password?: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(credentials);

      if ('requiresMfa' in response && response.requiresMfa) {
        setTempMfaState({
          tempToken: response.tempToken,
          rememberMe: !!credentials.rememberMe,
        });
        setIsLoading(false);
        return { requiresMfa: true };
      }

      if ('user' in response) {
        setUser(response.user);
      }
      setIsLoading(false);
      return { requiresMfa: false };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const verifyMfa = useCallback(async (code: string) => {
    if (!tempMfaState) throw new Error('No pending MFA challenge found');
    setIsLoading(true);
    try {
      const response = await api.auth.verifyMfa({
        tempToken: tempMfaState.tempToken,
        code,
        rememberMe: tempMfaState.rememberMe,
      });
      setUser(response.user);
      setTempMfaState(null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, [tempMfaState]);

  const cancelMfa = useCallback(() => {
    setTempMfaState(null);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setTempMfaState(null);
      setIsLoading(false);
    }
  }, []);

  const updateCurrentUserProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setStoredUser(updated);
      return updated;
    });
  }, []);

  const hasRole = useCallback((requiredRole: UserRole) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.role === requiredRole;
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role] || [];
    return perms.includes(permission);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        tempMfaState,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        updateCurrentUserProfile,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
