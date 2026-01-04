"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  sub: string; // Auth0 subject (user ID)
}

export function useAuth() {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const user: AuthUser | null = auth0User
    ? {
        id: auth0User.sub!,
        email: auth0User.email!,
        name: auth0User.name || auth0User.email!,
        picture: auth0User.picture,
        sub: auth0User.sub!,
      }
    : null;

  const login = useCallback(
    async (returnTo?: string) => {
      await loginWithRedirect({
        appState: { returnTo: returnTo || "/chat" },
      });
    },
    [loginWithRedirect]
  );

  const logout = useCallback(() => {
    auth0Logout({
      logoutParams: {
        returnTo: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      },
    });
  }, [auth0Logout]);

  const getAccessToken = useCallback(async () => {
    if (!isAuthenticated) return null;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAccessToken,
  };
}

