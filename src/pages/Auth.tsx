import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate("/explore");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {activeTab === "login" 
                ? "Sign in to continue your journey" 
                : "Join Auphere to discover amazing places"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
