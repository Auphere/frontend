import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export const LoadingScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // Add a minimum display time for better UX (500ms)
    const timer = setTimeout(() => {
      setInitialCheckDone(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    // Once auth is loaded and minimum display time has passed, redirect
    if (!isLoading && initialCheckDone) {
      if (isAuthenticated) {
        navigate("/new-explore", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [isLoading, initialCheckDone, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D511FD]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-[#8A43E1]/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-[#EF7B16]/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute -bottom-20 -right-40 w-80 h-80 bg-[#FF2F2F]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Logo Container with Animated Gradient Border */}
      <div className="relative z-10">
        {/* Animated gradient border container */}
        <div className="relative p-[3px] rounded-3xl overflow-hidden">
          {/* Rotating gradient border animation */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-full h-full gradient-auphere opacity-100" />
          </div>

          {/* Inner white/dark background */}
          <div className="relative bg-background rounded-3xl p-12 flex items-center justify-center">
            {/* Logo */}
            <img
              src="/assets/icono-auphere.png"
              alt="Auphere"
              className="w-24 h-24 object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    </div>
  );
};
