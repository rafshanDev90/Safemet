import type { UserRole } from '../../../models/user.model.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface VerifyMfaDTO {
  tempToken: string;
  otp: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
