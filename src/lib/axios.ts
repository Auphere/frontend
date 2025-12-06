/**
 * Axios instance configuration
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Check if token is about to expire (within 5 minutes)
 */
function isTokenExpiringSoon(): boolean {
  const expiresAt = localStorage.getItem('token_expires_at');
  if (!expiresAt) return false;
  
  const expiresAtTime = parseInt(expiresAt, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  return (expiresAtTime - now) < fiveMinutes;
}

/**
 * Refresh access token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });
    
    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
    
    // Update tokens
    localStorage.setItem('auth_token', access_token);
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }
    if (expires_in) {
      const expiresAt = Date.now() + (expires_in * 1000);
      localStorage.setItem('token_expires_at', expiresAt.toString());
    }
    
    return access_token;
  } catch (error) {
    // Clear tokens if refresh fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    throw error;
  }
}

// Request interceptor - Add auth token and refresh if needed
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token refresh for auth endpoints
    if (config.url?.includes('/auth/')) {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
    
    // Check if token needs refresh
    if (isTokenExpiringSoon()) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }
      
      if (refreshPromise) {
        try {
          const newToken = await refreshPromise;
          if (config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } catch (error) {
          // If refresh fails, continue with old token (will likely get 401)
          const token = localStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } else {
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      // If we haven't tried to refresh yet and we have a refresh token
      if (originalRequest && !originalRequest.headers['X-Retry'] && localStorage.getItem('refresh_token')) {
        try {
          // Try to refresh the token
          const newToken = await refreshAccessToken();
          
          // Mark request as retried
          originalRequest.headers['X-Retry'] = 'true';
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_at');
          localStorage.removeItem('auphere_mock_user');
          
          if (!window.location.pathname.includes('/auth')) {
            window.location.href = '/auth';
          }
        }
      } else {
        // Already tried refresh or no refresh token, clear and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('auphere_mock_user');
        
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

