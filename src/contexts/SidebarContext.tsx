import { createContext, useContext, useState, ReactNode } from "react";
import { ChatMode } from "@/types/chat";

/**
 * Contexto global del Sidebar de la aplicación
 * Maneja el estado del sidebar de historial de chats y la sesión actual
 */
interface SidebarContextType {
  // Estado del sidebar de historial de chats
  isChatHistoryOpen: boolean;
  toggleChatHistory: () => void;
  openChatHistory: () => void;
  closeChatHistory: () => void;

  // Sesión de chat actual
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;

  // Modo de chat actual
  currentChatMode: ChatMode;
  setCurrentChatMode: (mode: ChatMode) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentChatMode, setCurrentChatMode] = useState<ChatMode>("explore");

  const toggleChatHistory = () => {
    setIsChatHistoryOpen((prev) => !prev);
  };

  const openChatHistory = () => {
    setIsChatHistoryOpen(true);
  };

  const closeChatHistory = () => {
    setIsChatHistoryOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isChatHistoryOpen,
        toggleChatHistory,
        openChatHistory,
        closeChatHistory,
        currentSessionId,
        setCurrentSessionId,
        currentChatMode,
        setCurrentChatMode,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
