import { MapPin, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  asLink?: boolean;
}

export const Logo = ({ 
  variant = "full", 
  className = "", 
  iconClassName = "",
  textClassName = "",
  asLink = true
}: LogoProps) => {
  const iconMarkup = (
    <div className={cn(
      "relative flex items-center justify-center",
      variant === "icon" ? "w-10 h-10" : "w-8 h-8",
      iconClassName
    )}>
      <MapPin className="w-full h-full text-primary" strokeWidth={2.5} />
      <Radio 
        className="absolute w-3/5 h-3/5 text-secondary animate-pulse" 
        strokeWidth={2}
      />
    </div>
  );

  const content = variant === "icon" ? (
    <div className={className}>{iconMarkup}</div>
  ) : (
    <div className={cn("flex items-center gap-2", className)}>
      {iconMarkup}
      <span className={cn(
        "font-space-grotesk font-bold text-2xl tracking-tight",
        textClassName
      )}>
        Auphere
      </span>
    </div>
  );

  if (!asLink) {
    return content;
  }

  return (
    <Link 
      to="/" 
      className="inline-flex hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
    >
      {content}
    </Link>
  );
};
