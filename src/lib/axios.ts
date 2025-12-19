/**
 * Axios instance configuration
 * Updated to work with Auth0 authentication
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Store Auth0 getAccessTokenSilently function and authentication state
let getAccessTokenSilently:
  | ((options?: { cacheMode?: "on" | "off" | "cache-only" }) => Promise<string>)
  | null = null;
let isAuthenticated: boolean = false;

/**
 * Set the Auth0 getAccessTokenSilently function
 * This should be called from a component that has access to useAuth0 hook
 */
export function setAuth0TokenGetter(
  tokenGetter: (options?: {
    cacheMode?: "on" | "off" | "cache-only";
  }) => Promise<string>,
  authenticated: boolean = true
) {
  getAccessTokenSilently = tokenGetter;
  isAuthenticated = authenticated;
}

// Request interceptor - Add Auth0 access token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Log request for debugging
    console.log(`[Axios] Making request to: ${config.url}`, {
      method: config.method,
      authenticated: isAuthenticated,
      hasTokenGetter: !!getAccessTokenSilently,
    });

    // Only add token if user is authenticated
    if (isAuthenticated && getAccessTokenSilently && config.headers) {
      try {
        // Force token refresh by using cacheMode option
        const token = await getAccessTokenSilently({
          cacheMode: "cache-only", // Try cache first, fallback to refresh
        });
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[Axios] Token added to request: ${config.url}`);
      } catch (error) {
        console.error(
          `[Axios] Failed to get Auth0 access token for ${config.url}:`,
          error
        );

        // If token getter fails, redirect to auth
        if (!window.location.pathname.includes("/auth")) {
          console.warn(
            "[Axios] Token expired or invalid - Redirecting to login"
          );
          window.location.href = "/auth";
        }

        return Promise.reject(new Error("Authentication required"));
      }
    } else if (isAuthenticated && !getAccessTokenSilently) {
      console.error("[Axios] User authenticated but no token getter available");
      return Promise.reject(new Error("Auth0 not properly initialized"));
    } else {
      console.log(
        `[Axios] No token added (public endpoint or not authenticated): ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Track if we're already refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
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

// Response interceptor - Handle errors globally with token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios] Success response from: ${response.config.url}`, {
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error details for debugging
    if (error.response) {
      console.error(
        `[Axios] API Error [${error.response.status}]:`,
        error.response.config?.url,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        `[Axios] Network Error - No response received:`,
        error.config?.method?.toUpperCase(),
        error.config?.url,
        "\nFull URL:",
        error.config?.baseURL + error.config?.url,
        "\nPossible causes: Backend not running, CORS issue, or network problem"
      );
      console.error("[Axios] Request details:", {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });
    } else {
      console.error("[Axios] Request setup error:", error.message);
    }

    // Handle 401 Unauthorized or 403 Forbidden with "Not authenticated" message
    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.status === 403 &&
        (error.response.data as any)?.detail === "Not authenticated");

    if (isAuthError && !originalRequest._retry && getAccessTokenSilently) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("[Axios] Attempting to refresh token...");

        // Force token refresh
        const newToken = await getAccessTokenSilently({
          cacheMode: "off", // Force refresh, bypass cache
        });

        console.log("[Axios] Token refreshed successfully");

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[Axios] Token refresh failed:", refreshError);
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        // Redirect to auth page
        if (!window.location.pathname.includes("/auth")) {
          console.warn("[Axios] Authentication failed - Redirecting to login");
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 400 Bad Request
    if (error.response?.status === 400) {
      console.warn(
        "[Axios] 400 Bad Request - Check if endpoint requires authentication or if request format is correct",
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
