import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { UserInfo } from "../../app-sidebar.interface";
import { getUserInitials } from "../../utils";
import { useMounted } from "@/lib/hooks/use-mounted";

export interface AppSidebarFooterProps {
  isCollapsed?: boolean;
  userInfo: UserInfo;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

export const AppSidebarFooter = ({
  isCollapsed = false,
  userInfo,
  onProfileClick,
  onLogoutClick,
}: AppSidebarFooterProps) => {
  const mounted = useMounted();

  return (
    <div className="border-t border-gray-200 p-2">
      {mounted && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2 py-2 h-12 hover:bg-gray-100 text-gray-900"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
                <AvatarFallback className="text-xs font-semibold text-white bg-gradient-primary">
                  {getUserInitials(userInfo.name)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex min-w-0 flex-1 flex-col items-start">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {userInfo.name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {userInfo.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side={isCollapsed ? "right" : "top"}
            className="w-56 border-white/10 bg-white text-gray-900"
          >
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
              onClick={onProfileClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 hover:bg-gray-100 hover:text-red-600 focus:hover:bg-gray-100 focus:text-red-600"
              onClick={onLogoutClick}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
