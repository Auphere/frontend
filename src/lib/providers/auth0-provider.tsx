"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface Auth0ProviderWrapperProps {
  children: ReactNode;
}

export function Auth0ProviderWrapper({
  children,
}: Auth0ProviderWrapperProps) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
  const redirectUri =
    process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/callback`;

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    router.push(appState?.returnTo || "/chat");
  };

  // If Auth0 is not configured, render children without auth
  if (!domain || !clientId) {
    console.warn(
      "Auth0 not configured. Set NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID in .env.local"
    );
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

