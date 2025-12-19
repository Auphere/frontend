import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, MessageCircle, Bookmark, User, X, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/SidebarContext";
import { Z_INDEX } from "@/lib/z-index";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const getNavItems = (t: any): NavItem[] => [
  {
    id: "explore",
    label: t("navigation.explore"),
    icon: Sparkles,
    path: "/new-explore",
  },
  {
    id: "chat",
    label: t("navigation.chat"),
    icon: MessageCircle,
    path: "/chat",
  },
  {
    id: "saved",
    label: t("navigation.saved"),
    icon: Bookmark,
    path: "/planner",
  },
];

export const AppSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isChatHistoryOpen, toggleChatHistory } = useSidebar();

  const navItems = getNavItems(t);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Toggle el sidebar de historial de chats
    toggleChatHistory();
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-4 md:hidden bg-background/80 backdrop-blur-sm border border-border shadow-sm"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{ zIndex: Z_INDEX.HAMBURGER_BUTTON }}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          style={{ zIndex: Z_INDEX.SIDEBAR_BACKDROP }}
        />
      )}

      {/* Sidebar */}
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "fixed left-0 top-0 h-screen bg-background border-r border-border transition-transform duration-300",
            "w-64 md:w-16 flex flex-col items-center py-6 shadow-xl md:shadow-none",
            // Mobile behavior
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          )}
          style={{ zIndex: Z_INDEX.SIDEBAR }}
        >
          {/* Logo/Brand */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/new-explore"
                className="mb-8 flex items-center justify-center group px-4 md:px-0 w-full"
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/icono-auphere.png"
                    alt="Auphere"
                    className="w-9 h-9 object-contain transition-transform group-hover:scale-110"
                  />
                  <span className="font-bold text-xl md:hidden">Auphere</span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="hidden md:block">
              <p>Auphere</p>
            </TooltipContent>
          </Tooltip>

          {/* Main Navigation */}
          <nav className="flex-1 flex flex-col gap-2 w-full px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrentRoute = isActive(item.path);
              const isChat = item.id === "chat";
              const isChatHistoryVisible = isChat && isChatHistoryOpen;

              // El fondo se resalta si es la ruta actual O si el historial de chat está abierto
              const showHighlight = isCurrentRoute || isChatHistoryVisible;
              // El indicador (barra naranja) SOLO se muestra para la ruta real actual
              const showIndicator = isCurrentRoute;

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {isChat ? (
                      <button
                        onClick={handleChatClick}
                        className={cn(
                          "flex items-center md:justify-center h-12 rounded-xl transition-all w-full px-4 md:px-0",
                          "hover:bg-muted group relative",
                          showHighlight && "bg-primary/10 text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "w-5 h-5 transition-colors",
                              showHighlight
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium md:hidden",
                              showHighlight
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        {showIndicator && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center md:justify-center h-12 rounded-xl transition-all w-full px-4 md:px-0",
                          "hover:bg-muted group relative",
                          showHighlight && "bg-primary/10 text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "w-5 h-5 transition-colors",
                              showHighlight
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium md:hidden",
                              showHighlight
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        {showIndicator && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden md:block">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* User Profile at Bottom */}
          <div className="w-full px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center md:justify-center h-14 rounded-xl transition-all hover:bg-muted group px-4 md:px-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm md:hidden text-muted-foreground group-hover:text-foreground">
                      {t("navigation.settings")}
                    </span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                <p>{t("navigation.profile")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </aside>
      </TooltipProvider>

      {/* Spacer for content (only on desktop) */}
      <div className="hidden md:block w-16" />
    </>
  );
};
