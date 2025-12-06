/**
 * Auth query hooks
 * React Query hooks for auth operations
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as authApi from "../api/auth.api";
import { authKeys } from "../keys/auth.keys";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

/**
 * Query: Get current user
 * Fetches the authenticated user's data
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getCurrentUser,
    retry: false,
    // Only run if we have a token
    enabled: !!localStorage.getItem("auth_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation: Login
 * Authenticates user with email and password
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.me(), data.user);

      toast.success("Login successful", {
        description: "Welcome back!",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Invalid email or password";

      toast.error("Login failed", {
        description: message,
      });
    },
  });
}

/**
 * Mutation: Register
 * Creates a new user account
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Set user data in cache if token is available
      if (data.accessToken) {
        queryClient.setQueryData(authKeys.me(), data.user);

        toast.success("Account created!", {
          description: "Welcome to Auphere!",
        });
      } else {
        // Email confirmation required
        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        "Registration failed. Please try again.";

      toast.error("Registration failed", {
        description: message,
      });
    },
  });
}

/**
 * Mutation: Forgot Password
 * Sends password reset email
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      toast.success("Email sent", {
        description: data.message,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        "Failed to send reset email. Please try again.";

      toast.error("Request failed", {
        description: message,
      });
    },
  });
}

/**
 * Mutation: Reset Password
 * Resets password with token
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      toast.success("Password reset successful", {
        description: "You can now login with your new password.",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        "Password reset failed. Please try again.";

      toast.error("Reset failed", {
        description: message,
      });
    },
  });
}

/**
 * Mutation: Logout
 * Logs out current user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      toast.success("Logged out successfully");
    },
    onError: () => {
      // Even if the API call fails, clear local data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auphere_mock_user");
      queryClient.clear();
    },
  });
}
