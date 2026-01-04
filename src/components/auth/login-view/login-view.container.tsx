"use client";

import { useRouter } from "next/navigation";
import { LoginView } from "./login-view";

export function LoginViewContainer() {
  const router = useRouter();

  const handleLogin = () => {
    // Mock login - in production this would handle real auth
    router.push("/chat");
  };

  return <LoginView onLogin={handleLogin} />;
}

