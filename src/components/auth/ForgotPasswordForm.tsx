import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ForgotPasswordForm = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handlePasswordReset = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "forgot_password",
      },
    });
  };

    return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          Click the button below to reset your password through Auth0
        </p>
      </div>

      <Button
        onClick={handlePasswordReset}
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
          "Reset Password"
        )}
      </Button>
    </div>
  );
};
