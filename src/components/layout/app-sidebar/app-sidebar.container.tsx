"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store";
import { AppSidebar } from "./app-sidebar";
import type { ChatSessionItem, ChatGroup } from "./app-sidebar.interface";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  useUserChats,
  useDeleteChat,
} from "@/api-queries/queries/chats.queries";

/**
 * Group chats by time periods like ChatGPT:
 * - Today
 * - Yesterday
 * - Previous 7 Days
 * - Previous 30 Days
 * - [Month Name] (for older chats)
 */
function groupChatsByDate(chats: ChatSessionItem[]): ChatGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups: Record<string, ChatSessionItem[]> = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
  };

  const monthGroups: Record<string, ChatSessionItem[]> = {};

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt);
    const chatDay = new Date(
      chatDate.getFullYear(),
      chatDate.getMonth(),
      chatDate.getDate()
    );

    if (chatDay.getTime() === today.getTime()) {
      groups.today.push(chat);
    } else if (chatDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(chat);
    } else if (chatDate >= sevenDaysAgo) {
      groups.previous7Days.push(chat);
    } else if (chatDate >= thirtyDaysAgo) {
      groups.previous30Days.push(chat);
    } else {
      // Group by month
      const monthKey = chatDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      });
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(chat);
    }
  });

  const result: ChatGroup[] = [];

  if (groups.today.length > 0) {
    result.push({ label: "Hoy", chats: groups.today });
  }
  if (groups.yesterday.length > 0) {
    result.push({ label: "Ayer", chats: groups.yesterday });
  }
  if (groups.previous7Days.length > 0) {
    result.push({ label: "Últimos 7 días", chats: groups.previous7Days });
  }
  if (groups.previous30Days.length > 0) {
    result.push({ label: "Últimos 30 días", chats: groups.previous30Days });
  }

  // Add month groups (sorted by most recent first)
  Object.keys(monthGroups)
    .sort((a, b) => {
      const dateA = new Date(monthGroups[a][0].updatedAt);
      const dateB = new Date(monthGroups[b][0].updatedAt);
      return dateB.getTime() - dateA.getTime();
    })
    .forEach((monthKey) => {
      result.push({
        label: monthKey.charAt(0).toUpperCase() + monthKey.slice(1),
        chats: monthGroups[monthKey],
      });
    });

  return result;
}

export function AppSidebarContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isSidebarOpen,
    isSidebarCollapsed,
    closeSidebar,
    toggleSidebarCollapse,
  } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Get active chat ID from URL query params
  const activeChatId = searchParams.get("session");

  // Fetch user chats
  const { data: chatsData, isLoading: isLoadingChats } = useUserChats();
  const deleteChat = useDeleteChat();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleChatSelect = (chatId: string) => {
    // Clear localStorage to ensure fresh load
    localStorage.removeItem("auphere-agent-session-id");
    // Navigate to chat with session param
    router.push(`/chat?session=${chatId}`);
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleNewChat = () => {
    // Clear the session ID from localStorage
    localStorage.removeItem("auphere-agent-session-id");
    // Navigate to chat without a session param (new chat)
    router.push("/chat");
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleNewPlan = () => {
    // Clear the session ID from localStorage
    localStorage.removeItem("auphere-agent-session-id");
    // Navigate to chat with plan mode
    router.push("/chat?mode=plan");
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleChatDelete = async (chatId: string) => {
    // Confirm before deleting
    if (!confirm("¿Estás seguro de que quieres eliminar este chat?")) {
      return;
    }

    try {
      await deleteChat.mutateAsync(chatId);
      // If the deleted chat is the active one, navigate to new chat
      if (activeChatId === chatId) {
        localStorage.removeItem("auphere-agent-session-id");
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Error al eliminar el chat. Por favor, intenta de nuevo.");
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleLogoutClick = () => {
    logout();
    if (isMobile) {
      closeSidebar();
    }
  };

  // Transform and group chats
  const chatSessions: ChatSessionItem[] =
    chatsData?.chats?.map((chat) => ({
      id: chat.id,
      title: chat.title,
      updatedAt: chat.updated_at,
    })) || [];

  const chatGroups = groupChatsByDate(chatSessions);

  const userInfo =
    isAuthenticated && user?.name && user?.email
      ? {
          name: user.name,
          email: user.email,
          avatarUrl: user.picture,
        }
      : {
          name: "Usuario Demo",
          email: "demo@auphere.com",
          avatarUrl: "/assets/default-avatar.png",
        };

  return (
    <AppSidebar
      currentPath={pathname || ""}
      activeChatId={activeChatId}
      isOpen={isSidebarOpen}
      isCollapsed={isSidebarCollapsed}
      isMobile={isMobile}
      userInfo={userInfo}
      chatGroups={chatGroups}
      isLoadingChats={isLoadingChats}
      onNavigate={handleNavigate}
      onChatSelect={handleChatSelect}
      onChatDelete={handleChatDelete}
      onClose={closeSidebar}
      onToggleCollapse={toggleSidebarCollapse}
      onProfileClick={handleProfileClick}
      onLogoutClick={handleLogoutClick}
      onNewChat={handleNewChat}
      onNewPlan={handleNewPlan}
    />
  );
}
