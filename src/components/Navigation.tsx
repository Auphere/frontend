import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/explore"
              className="font-inter font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore
            </a>
            <a
              href="/chat"
              className="font-inter font-medium text-foreground hover:text-primary transition-colors"
            >
              AI Chat
            </a>
            <a
              href="/planner"
              className="font-inter font-medium text-foreground hover:text-primary transition-colors"
            >
              My Plans
            </a>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-inter font-semibold rounded-lg"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="/auth">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold rounded-lg">
                  Sign In
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 sm:py-4 space-y-1 border-t border-border">
            <a
              href="/explore"
              className="block font-inter font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-colors py-2.5 px-3 rounded-lg text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </a>
            <a
              href="/chat"
              className="block font-inter font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-colors py-2.5 px-3 rounded-lg text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Chat
            </a>
            <a
              href="/planner"
              className="block font-inter font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-colors py-2.5 px-3 rounded-lg text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              My Plans
            </a>

            {user ? (
              <div className="pt-2 space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  {user.name}
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/settings");
                    setIsMenuOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <a href="/auth" className="block mt-2">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold rounded-lg h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
