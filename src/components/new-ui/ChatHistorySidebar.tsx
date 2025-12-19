import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle, Calendar, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChats, useDeleteChat } from "@/api-queries/query/chats.query";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMode } from "@/types/chat";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Z_INDEX } from "@/lib/z-index";
import { API_LIMITS } from "@/lib/constants";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId?: string;
}

export const ChatHistorySidebar = ({
  isOpen,
  onClose,
  currentSessionId,
}: ChatHistorySidebarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Only fetch chats if the sidebar is open AND user is authenticated
  const { data: chatsData, isLoading } = useChats(
    API_LIMITS.CHATS_PER_PAGE,
    0,
    { enabled: isOpen && isAuthenticated }
  );
  const deleteChat = useDeleteChat();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewChat = (mode: ChatMode) => {
    // Navigate to chat page with mode parameter and new flag
    // The timestamp ensures the URL is always different, forcing a navigation event
    navigate(`/chat?mode=${mode}&new=true&t=${Date.now()}`);
    // Close sidebar
    onClose();
  };

  const handleChatClick = (sessionId: string) => {
    // Navigate to chat with this session
    navigate(`/chat?session=${sessionId}`);
    // Close sidebar
    onClose();
  };

  const handleDeleteChat = async (
    e: React.MouseEvent,
    chatId: string,
    sessionId: string
  ) => {
    e.stopPropagation();
    setDeletingId(chatId);
    try {
      await deleteChat.mutateAsync(chatId);
      // If we deleted the current chat, navigate to a new one
      if (sessionId === currentSessionId) {
        navigate("/chat?mode=explore");
        onClose();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const locale = i18n.language === "es" ? es : enUS;

    if (diffInHours < 24) {
      return format(date, "HH:mm", { locale });
    } else if (diffInHours < 48) {
      return i18n.language === "es" ? "Ayer" : "Yesterday";
    } else if (diffInHours < 168) {
      return format(date, "EEEE", { locale });
    } else {
      return format(date, "dd MMM", { locale });
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 md:bg-transparent"
          onClick={onClose}
          style={{ zIndex: Z_INDEX.CHAT_SIDEBAR_BACKDROP }}
        />
      )}

      {/* Sidebar / Bottom Sheet */}
      <div
        className={cn(
          "fixed bg-background border-border transition-transform duration-300 flex flex-col shadow-2xl",
          // Mobile: Bottom Sheet behavior
          "inset-x-0 bottom-0 h-[80vh] rounded-t-3xl border-t md:rounded-none md:border-t-0 md:border-r",
          // Desktop: Side Sidebar behavior
          "md:left-16 md:top-0 md:h-screen md:w-80 md:inset-x-auto",
          // Animations
          "translate-y-full md:translate-y-0 md:-translate-x-full",
          isOpen && "translate-y-0 md:translate-x-0"
        )}
        style={{ zIndex: Z_INDEX.CHAT_SIDEBAR }}
      >
        {/* Mobile Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("chat.chats")}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2 border-b">
          <Button
            onClick={() => handleNewChat("explore")}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {t("chat.newChat")}
          </Button>
          <Button
            onClick={() => handleNewChat("plan")}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t("chat.newPlan")}
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !chatsData || chatsData.chats.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("chat.noChatsYet")}
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("chat.chats")}
                </h3>
              </div>
              <div className="space-y-1 px-2">
                {chatsData.chats.map((chat) => {
                  const isActive = chat.sessionId === currentSessionId;
                  const isDeleting = deletingId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat.sessionId)}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                          isActive
                            ? "bg-primary/20"
                            : "bg-muted group-hover:bg-muted-foreground/10"
                        )}
                      >
                        {chat.mode === "plan" ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <MessageCircle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) =>
                          handleDeleteChat(e, chat.id, chat.sessionId)
                        }
                        disabled={isDeleting}
                        className={cn(
                          "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded",
                          isActive && "opacity-100"
                        )}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
