"use client";

import Image from "next/image";
import {
  MessageSquare,
  Compass,
  Calendar,
  PanelLeft,
  Trash2,
  MoreHorizontal,
  CalendarPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AppSidebarProps } from "./app-sidebar.interface";
import { useMounted } from "@/lib/hooks/use-mounted";
import { AppSidebarFooter } from "./components";

const navItems = [
  {
    path: "/chat",
    label: "Nuevo chat",
    icon: MessageSquare,
    action: "newChat" as const,
  },
  {
    path: "/chat?mode=plan",
    label: "Nuevo Plan",
    icon: CalendarPlus,
    action: "newPlan" as const,
  },
  {
    path: "/explore",
    label: "Explorar",
    icon: Compass,
  },
  {
    path: "/plans",
    label: "Mis Planes",
    icon: Calendar,
  },
];

function SidebarContent({
  isMobile,
  currentPath,
  activeChatId,
  isCollapsed,
  userInfo,
  chatGroups,
  isLoadingChats,
  onNavigate,
  onChatSelect,
  onChatDelete,
  onToggleCollapse,
  onProfileClick,
  onLogoutClick,
  onNewChat,
  onNewPlan,
}: Omit<AppSidebarProps, "isOpen">) {
  // Collapsed sidebar (only icons)
  if (isCollapsed) {
    return (
      <div className="flex h-full flex-col items-center bg-[#F6F5F4] py-2">
        {/* Logo - hoverable to expand */}
        <button
          onClick={onToggleCollapse}
          className="group mb-2 flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Image
            src="/assets/perfil-auphere.png"
            alt="Auphere"
            width={28}
            height={28}
            className="rounded-lg group-hover:hidden"
          />
          <PanelLeft className="h-5 w-5 text-gray-700 hidden group-hover:block" />
        </button>

        {/* Navigation icons */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              currentPath?.startsWith(item.path + "/");

            const handleClick = () => {
              if (item.action === "newChat") {
                onNewChat();
              } else if (item.action === "newPlan") {
                onNewPlan();
              } else {
                onNavigate(item.path);
              }
            };

            return (
              <button
                key={item.path}
                onClick={handleClick}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* User avatar at bottom */}
        <div className="mt-auto">
          <AppSidebarFooter
            isCollapsed={isCollapsed}
            userInfo={userInfo}
            onProfileClick={onProfileClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </div>
    );
  }

  // Expanded sidebar
  return (
    <div className="flex h-full w-full flex-col bg-[#F6F5F4] text-gray-900 min-w-0 overflow-hidden">
      {/* Logo and toggle */}
      <div className="flex items-center justify-between px-3 py-3">
        <button
          onClick={() => onNavigate("/chat")}
          className="flex items-center gap-2"
        >
          <Image
            src="/assets/perfil-auphere.png"
            alt="Auphere"
            width={30}
            height={30}
            className="rounded-lg"
          />
        </button>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
          >
            <PanelLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>

      <Separator className="bg-gray-200" />

      {/* Navigation */}
      <div className="px-2 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            currentPath?.startsWith(item.path + "/");

          const handleClick = () => {
            if (item.action === "newChat") {
              onNewChat();
            } else if (item.action === "newPlan") {
              onNewPlan();
            } else {
              onNavigate(item.path);
            }
          };

          return (
            <button
              key={item.path}
              onClick={handleClick}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <Separator className="bg-gray-200" />

      {/* Chat History with Accordion */}
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="px-2 py-3">
          <h3 className="px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Mis chats
          </h3>
        </div>

        <ScrollArea className="h-full px-2 pb-4 min-w-0">
          {isLoadingChats ? (
            <div className="space-y-2 pb-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : chatGroups.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No hay chats aún
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={chatGroups.map((_, i) => `group-${i}`)}
              className="space-y-1 w-full overflow-hidden"
            >
              {chatGroups.map((group, groupIndex) => (
                <AccordionItem
                  key={`group-${groupIndex}`}
                  value={`group-${groupIndex}`}
                  className="border-none overflow-hidden"
                >
                  <AccordionTrigger className="py-1.5 px-2 hover:no-underline hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-500">
                    {group.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-1 overflow-hidden">
                    <div className="space-y-0.5 overflow-hidden">
                      {group.chats.map((chat) => {
                        const isActive = activeChatId === chat.id;
                        return (
                          <div
                            key={chat.id}
                            className={cn(
                              "sidebar-chat-item group/item rounded-lg transition-colors",
                              isActive ? "bg-gray-100" : "hover:bg-gray-200"
                            )}
                          >
                            <button
                              onClick={() => onChatSelect(chat.id)}
                              className={cn(
                                "chat-title py-2 pl-2 pr-1 text-left text-sm",
                                isActive
                                  ? "font-medium text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              {chat.title}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className={cn(
                                    "shrink-0 w-8 h-8 rounded p-1 hover:bg-gray-300 transition-all duration-200 flex items-center justify-center",
                                    isMobile
                                      ? "opacity-100"
                                      : "opacity-0 group-hover/item:opacity-100"
                                  )}
                                  aria-label="Opciones del chat"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-gray-600 shrink-0" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onChatDelete(chat.id);
                                  }}
                                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Eliminar chat</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </div>

      {/* User footer */}
      <AppSidebarFooter
        userInfo={userInfo}
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
      />
    </div>
  );
}

export function AppSidebar(props: AppSidebarProps) {
  const { isOpen, isMobile, onClose } = props;

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0 bg-[#F6F5F4]!">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <SidebarContent {...props} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-gray-200 bg-[#F6F5F4] transition-all duration-400",
        props.isCollapsed ? "w-[60px]" : "w-64"
      )}
    >
      <SidebarContent {...props} />
    </aside>
  );
}
