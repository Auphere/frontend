"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

/**
 * Higher-order component to protect routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * 
 * IMPORTANTE: Este HOC crea un Client Component wrapper.
 * Se debe usar exportando como default en las páginas.
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  const ProtectedRoute = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Only redirect if we're sure the user is not authenticated
      // and we're not still loading the auth state
      if (!isLoading && !isAuthenticated) {
        // In production with Auth0 configured, redirect to login
        const isAuth0Configured =
          process.env.NEXT_PUBLIC_AUTH0_DOMAIN &&
          process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

        if (isAuth0Configured) {
          router.push("/login");
        }
        // If Auth0 is not configured, allow access (demo mode)
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F6F5F4]">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    }

    // Render the protected component
    return <Component {...props} />;
  };

  ProtectedRoute.displayName = `withAuth(${Component.displayName || Component.name || "Component"})`;

  return ProtectedRoute;
}


