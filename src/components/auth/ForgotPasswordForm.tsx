import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useForgotPassword } from "@/api-queries/query/auth.query";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Check your email
        </h3>
        <p className="text-muted-foreground text-sm">
          We've sent you a password reset link. Please check your inbox and follow the instructions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {forgotPasswordMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {(forgotPasswordMutation.error as any)?.response?.data?.detail ||
              "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          disabled={forgotPasswordMutation.isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
};
