import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { useChats, useDeleteChat } from "@/api-queries/query/chats.query";
import { Chat } from "@/api-queries/types/chats.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  currentChatId: string | null;
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  isCreatingChat?: boolean;
}

export function ChatSidebar({
  currentChatId,
  onChatSelect,
  onNewChat,
  isCreatingChat = false,
}: ChatSidebarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const { data, isLoading, refetch } = useChats();
  const deleteChat = useDeleteChat();

  const handleDeleteClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat.mutate(chatToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setChatToDelete(null);
          // If deleted chat was current, switch to new chat
          if (currentChatId === chatToDelete.id) {
            onNewChat();
          }
        },
      });
    }
  };

  return (
    <>
      <Sidebar className="border-r pt-14 sm:pt-16 lg:pt-20">
        <SidebarHeader className="p-4 pb-3 border-b">
          <h2 className="text-base font-semibold tracking-tight mb-3">
            Conversaciones
          </h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="w-full gap-2 h-9 font-medium"
            variant="default"
          >
            <Plus className="w-4 h-4" />
            Nuevo chat
          </Button>
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : data?.chats && data.chats.length > 0 ? (
                <SidebarMenu className="gap-1">
                  {/* Show creating placeholder if creating new chat */}
                  {isCreatingChat && !currentChatId && (
                    <SidebarMenuItem>
                      <SidebarMenuButton className="w-full h-auto py-2.5 px-3 opacity-60">
                        <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
                        <div className="flex-1 text-left min-w-0">
                          <div className="truncate text-sm leading-tight mb-1 italic">
                            Creando chat...
                          </div>
                          <div className="text-xs text-muted-foreground truncate leading-tight">
                            ahora mismo
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {data.chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        onClick={() => onChatSelect(chat)}
                        isActive={currentChatId === chat.id}
                        className="w-full h-auto py-2.5 px-3 data-[active=true]:bg-accent data-[active=true]:font-medium"
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 text-left min-w-0">
                          <div className="truncate text-sm leading-tight mb-1">
                            {chat.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate leading-tight">
                            {formatDistanceToNow(new Date(chat.updatedAt), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </div>
                        </div>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={(e) => handleDeleteClick(e, chat)}
                        showOnHover
                        className="mr-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Eliminar chat</span>
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 mt-8">
                  <div className="rounded-full bg-muted p-3">
                    <MessageSquare className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      No tienes chats
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Crea tu primer chat para comenzar una conversación
                    </p>
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              chat "{chatToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
