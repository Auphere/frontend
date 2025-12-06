import { createContext, useContext, ReactNode } from "react";
import { useCurrentUser, useLogout } from "@/api-queries/query/auth.query";
import type { AuthUser } from "@/api-queries/types/auth.types";
import type { UseMutationResult } from "@tanstack/react-query";
import type { MessageResponse } from "@/api-queries/types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: UseMutationResult<MessageResponse, Error, void, unknown>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use the current user query
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  const isAuthenticated = !!user && !!localStorage.getItem("auth_token");

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading: isLoading,
        signOut: logoutMutation,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
