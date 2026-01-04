"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function LoginView() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/chat");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async () => {
    await login("/chat");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F4]">
        <div className="text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary">
            <Image
              src="/assets/icono-auphere.png"
              alt="Auphere"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F5F4] px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-primary shadow-lg">
          <Image
            src="/assets/icono-auphere.png"
            alt="Auphere"
            width={64}
            height={64}
            className="rounded-xl"
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            Bienvenido a Auphere
          </h1>
          <p className="text-lg text-gray-600">
            Tu asistente inteligente para descubrir lugares increíbles y
            planificar tus salidas nocturnas perfectas.
          </p>
        </div>

        {/* Login Button */}
        <div className="space-y-4 pt-8">
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full text-white hover:opacity-90 transition-opacity shadow-md"
          >
            Iniciar sesión
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 pt-12 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-2 text-2xl">🔍</div>
            <h3 className="mb-1 font-semibold text-gray-900">Descubre</h3>
            <p className="text-xs text-gray-600">Bares, clubs y restaurantes</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-2 text-2xl">📅</div>
            <h3 className="mb-1 font-semibold text-gray-900">Planifica</h3>
            <p className="text-xs text-gray-600">Itinerarios personalizados</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-2 text-2xl">🤖</div>
            <h3 className="mb-1 font-semibold text-gray-900">IA Avanzada</h3>
            <p className="text-xs text-gray-600">
              Recomendaciones inteligentes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
