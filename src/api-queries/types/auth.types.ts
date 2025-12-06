/**
 * TypeScript types for auth API responses and requests
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
  user: AuthUser;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface MessageResponse {
  message: string;
}

