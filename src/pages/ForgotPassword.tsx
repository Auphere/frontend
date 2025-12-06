import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Reset Password Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Reset password
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
