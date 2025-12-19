import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { useSidebar } from "@/contexts/SidebarContext";

/**
 * Layout principal de la aplicación
 * Incluye el sidebar de navegación y el sidebar de historial de chats
 * Ambos sidebars están disponibles en todas las vistas
 */
export const Layout = () => {
  const { isChatHistoryOpen, closeChatHistory, currentSessionId } =
    useSidebar();

  return (
    <div className="h-[100dvh] bg-background flex overflow-hidden">
      {/* Sidebar Principal de Navegación */}
      <AppSidebar />

      {/* Sidebar de Historial de Chats - Accesible desde todas las vistas */}
      <ChatHistorySidebar
        isOpen={isChatHistoryOpen}
        onClose={closeChatHistory}
        currentSessionId={currentSessionId || undefined}
      />

      {/* Contenido Principal */}
      <div className="flex-1 h-full overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  );
};
