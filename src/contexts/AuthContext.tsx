import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuth0TokenGetter } from "@/lib/axios";
import type { AuthUser } from "@/api-queries/types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user: auth0User,
    isLoading,
    isAuthenticated: auth0IsAuthenticated,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Set up Auth0 token getter for axios
  useEffect(() => {
    if (getAccessTokenSilently) {
      setAuth0TokenGetter(getAccessTokenSilently, auth0IsAuthenticated);
    }
  }, [getAccessTokenSilently, auth0IsAuthenticated]);

  // Transform Auth0 user to match AuthUser type
  const user: AuthUser | null = useMemo(() => {
    if (!auth0User) return null;

    return {
      id: auth0User.sub || "",
      email: auth0User.email || "",
      name: auth0User.name || auth0User.nickname || "",
      picture: auth0User.picture || undefined,
      emailVerified: auth0User.email_verified || false,
      createdAt: auth0User.created_at || new Date().toISOString(),
      updatedAt: auth0User.updated_at || new Date().toISOString(),
    };
  }, [auth0User]);

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  // Note: Profile updates should be handled through your backend API
  // Auth0 user metadata can be updated via Auth0 Management API or your backend
  const updateProfile = async (updates: Partial<AuthUser>) => {
    // TODO: Implement profile update through backend API
    // For now, this is a placeholder that would need to call your backend
    // Example: await apiClient.patch('/auth/profile', updates);
    throw new Error(
      "Profile updates should be implemented through your backend API"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        signOut: handleSignOut,
        isAuthenticated: auth0IsAuthenticated,
        updateProfile,
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
