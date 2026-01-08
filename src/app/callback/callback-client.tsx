"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export function CallbackClient() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const returnTo = searchParams.get("returnTo") || "/chat";
        router.push(returnTo);
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F5F4]">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary animate-pulse">
          <Image
            src="/assets/icono-auphere.png"
            alt="Auphere"
            width={48}
            height={48}
            className="rounded-lg"
          />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Iniciando sesión...
        </h2>
        <p className="text-gray-600">
          Por favor espera mientras te redirigimos
        </p>
      </div>
    </div>
  );
}

