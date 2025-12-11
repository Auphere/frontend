import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login",
      },
  });
  };

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          Sign in or create an account to continue
        </p>
      </div>

      <Button
        onClick={handleLogin}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <Button
        onClick={handleSignUp}
        variant="outline"
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        Create Account
      </Button>
    </div>
  );
};
