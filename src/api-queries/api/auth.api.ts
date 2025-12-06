/**
 * Auth API functions
 * All HTTP requests to the auth endpoints
 */
import { apiClient } from '@/lib/axios';
import { transformKeysToCamel, transformKeysToSnake } from '@/lib/transform';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  UserResponse,
  MessageResponse,
} from '../types/auth.types';

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post(
    '/auth/login',
    transformKeysToSnake(credentials)
  );
  
  const data = transformKeysToCamel<AuthResponse>(response.data);
  
  // Store tokens in localStorage
  localStorage.setItem('auth_token', data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  if (data.expiresIn) {
    const expiresAt = Date.now() + (data.expiresIn * 1000);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }
  
  return data;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post(
    '/auth/register',
    transformKeysToSnake(userData)
  );
  
  const data = transformKeysToCamel<AuthResponse>(response.data);
  
  // Store tokens in localStorage if available
  if (data.accessToken) {
    localStorage.setItem('auth_token', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  if (data.expiresIn) {
    const expiresAt = Date.now() + (data.expiresIn * 1000);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }
  
  return data;
}

/**
 * Request password reset email
 */
export async function forgotPassword(
  request: ForgotPasswordRequest
): Promise<MessageResponse> {
  const response = await apiClient.post(
    '/auth/forgot-password',
    transformKeysToSnake(request)
  );
  
  return transformKeysToCamel<MessageResponse>(response.data);
}

/**
 * Reset password with token
 */
export async function resetPassword(
  request: ResetPasswordRequest
): Promise<MessageResponse> {
  const response = await apiClient.post(
    '/auth/reset-password',
    transformKeysToSnake(request)
  );
  
  return transformKeysToCamel<MessageResponse>(response.data);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get('/auth/me');
  return transformKeysToCamel<UserResponse>(response.data);
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post(
    '/auth/refresh',
    { refresh_token: refreshToken }
  );
  
  const data = transformKeysToCamel<AuthResponse>(response.data);
  
  // Update tokens in localStorage
  localStorage.setItem('auth_token', data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  if (data.expiresIn) {
    const expiresAt = Date.now() + (data.expiresIn * 1000);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }
  
  return data;
}

/**
 * Logout current user
 */
export async function logout(): Promise<MessageResponse> {
  const response = await apiClient.post('/auth/logout');
  
  // Clear tokens from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('auphere_mock_user'); // Clean up mock data
  
  return transformKeysToCamel<MessageResponse>(response.data);
}

