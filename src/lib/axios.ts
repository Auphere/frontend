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
let getAccessTokenSilently: (() => Promise<string>) | null = null;
let isAuthenticated: boolean = false;

/**
 * Set the Auth0 getAccessTokenSilently function
 * This should be called from a component that has access to useAuth0 hook
 */
export function setAuth0TokenGetter(
  tokenGetter: () => Promise<string>,
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
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[Axios] Token added to request: ${config.url}`);
      } catch (error) {
        // If getting token fails, log but continue without it
        // The API will return 401 if authentication is required
        console.warn(
          `[Axios] Failed to get Auth0 access token for ${config.url}:`,
          error
        );
        // Don't add token if we can't get it
      }
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

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios] Success response from: ${response.config.url}`, {
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    // Log error details for debugging
    if (error.response) {
      // Server responded with error status
      console.error(
        `[Axios] API Error [${error.response.status}]:`,
        error.response.config?.url,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response received
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
      // Something else happened
      console.error("[Axios] Request setup error:", error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // With Auth0, if we get a 401, the token might be expired
      // Auth0 SDK handles token refresh automatically, so we just redirect to login
      if (!window.location.pathname.includes("/auth")) {
        console.warn("[Axios] 401 Unauthorized - Redirecting to login");
        window.location.href = "/auth";
      }
    }

    // Handle 400 Bad Request - might be due to missing/invalid token
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
