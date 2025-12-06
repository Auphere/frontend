import { useState, useRef, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Calendar, Trash2 } from "lucide-react";
import { BetaBadge } from "@/components/BetaBadge";
import { ModeSelector } from "@/components/chat/ModeSelector";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Message, ChatMode } from "@/types/chat";
import { EveningPlan, PlanStop } from "@/types/place";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";
import { useChat } from "@/hooks/useChat";
import { useCreatePlan } from "@/api-queries/query/plans.query";
import type { PlanCreateRequest } from "@/api-queries/types/plans.types";
import { useAuth } from "@/contexts/AuthContext";
import type { Chat } from "@/api-queries/types/chats.types";
import {
  useChats,
  useCreateChat,
  useChatHistory,
} from "@/api-queries/query/chats.query";
import { useQueryClient } from "@tanstack/react-query";

const Chat = () => {
  const [mode, setMode] = useState<ChatMode>("explore");
  const [input, setInput] = useState("");
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { planPlaces, clearPlan } = usePlan();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: createPlan, isPending: isSavingPlan } = useCreatePlan(
    user?.id
  );
  const createChatMutation = useCreateChat();
  const { data: chatHistory, isFetching: isFetchingHistory } = useChatHistory(
    currentChat?.id || null,
    50
  );
  const {
    messages,
    sendMessage,
    resetConversation,
    appendMessage,
    status,
    isStreaming,
    error,
    sessionId,
    setSessionId,
  } = useChat(currentChat?.sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initialAssistantMessage = useMemo<Message>(
    () => ({
      role: "assistant",
      content:
        mode === "explore"
          ? "¡Hola! Soy tu asistente AI de Auphere. Dime qué tipo de lugar buscas y te ayudaré a encontrar el sitio perfecto. Por ejemplo: 'Quiero un restaurante romántico con buena pasta' o '¿Dónde puedo ir a tomar algo con amigos esta noche?'"
          : "¡Perfecto! Voy a ayudarte a crear un plan increíble. Cuéntame: ¿Para cuántas personas? ¿Qué tipo de ambiente buscas? ¿Tienes alguna preferencia de horario o presupuesto?",
      suggestions:
        mode === "explore"
          ? ["Restaurante romántico", "Bar con amigos", "Café tranquilo"]
          : ["Plan para 2 personas", "Noche energética", "Plan económico"],
    }),
    [mode]
  );

  // Reset to initial message when switching to new chat or mode changes
  useEffect(() => {
    if (!currentChat) {
      resetConversation([initialAssistantMessage]);
      setInput("");
    }
  }, [initialAssistantMessage, resetConversation, currentChat]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Load chat history when selecting an existing chat
  useEffect(() => {
    if (chatHistory && currentChat) {
      // Map API messages to UI Message type
      const mappedMessages: Message[] = chatHistory.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
        places: msg.places,
        plan: msg.plan as EveningPlan | undefined,
      }));

      // Ensure there's at least the assistant greeting if empty
      const initialMessages =
        mappedMessages.length > 0 ? mappedMessages : [initialAssistantMessage];

      resetConversation(initialMessages, chatHistory.sessionId);
      setInput("");
    }
  }, [chatHistory, currentChat, initialAssistantMessage, resetConversation]);

  // Refresh chat list after streaming completes (in case a new chat was created)
  useEffect(() => {
    if (!isStreaming && sessionId && !currentChat && messages.length > 1) {
      setIsCreatingChat(true);

      // Force immediate refetch (bypassing staleTime)
      queryClient.invalidateQueries({
        queryKey: ["chats"],
        refetchType: "active", // Force active queries to refetch immediately
      });

      // Poll a few more times to ensure backend has finished saving
      const timer1 = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["chats"],
          refetchType: "active",
        });
      }, 500);

      const timer2 = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["chats"],
          refetchType: "active",
        });
      }, 1000);

      const timer3 = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["chats"],
          refetchType: "active",
        });
        setIsCreatingChat(false);
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isStreaming, sessionId, currentChat, messages.length, queryClient]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (isStreaming) {
      toast.info("Espera a que termine la respuesta actual.");
      return;
    }
    sendMessage(input, mode);
    setInput("");
  };

  const handleConvertToPlan = async () => {
    if (planPlaces.length === 0) {
      toast.error("Agrega algunos lugares primero");
      return;
    }
    if (!user?.id) {
      toast.error("Debes iniciar sesión para guardar planes.");
      return;
    }

    const mockPlan: EveningPlan = {
      id: `plan-${Date.now()}`,
      name: "Plan desde Chat",
      description: "Plan generado desde tu conversación",
      vibe: "casual",
      totalDuration: planPlaces.length * 60,
      totalDistance: planPlaces.length * 1.2,
      stops: planPlaces.map((place, idx) => ({
        place,
        duration: 60,
        startTime: `${19 + idx}:00`,
        activity:
          place.category === "restaurant"
            ? "Cena"
            : place.category === "bar"
            ? "Cócteles"
            : "Visita",
      })) as PlanStop[],
    };

    const payload: PlanCreateRequest = {
      name: mockPlan.name,
      description: mockPlan.description,
      vibe: mockPlan.vibe,
      total_duration: mockPlan.totalDuration,
      total_distance: mockPlan.totalDistance,
      stops: mockPlan.stops.map((stop) => ({
        activity: stop.activity,
        duration: stop.duration,
        start_time: stop.startTime,
        place: stop.place,
      })),
      metadata: { source: "chat" },
    };

    try {
      await createPlan(payload);
      appendMessage({
        role: "assistant",
        content:
          "¡Genial! Guardé el plan en tu biblioteca. Aquí tienes el itinerario:",
        plan: mockPlan,
      });
      toast.success("Plan guardado en tu sección de My Plans.");
      clearPlan();
    } catch (err) {
      console.error(err);
      toast.error("No pudimos guardar el plan. Intenta nuevamente.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isStreaming) {
      toast.info("Espera a que termine la respuesta actual.");
      return;
    }
    sendMessage(suggestion, mode);
  };

  const handlePromptClick = (prompt: string) => {
    if (isStreaming) {
      toast.info("Espera a que termine la respuesta actual.");
      return;
    }
    sendMessage(prompt, mode);
  };

  const handleClearChat = () => {
    setCurrentChat(null);
    setSessionId(null);
    resetConversation([initialAssistantMessage]);
    clearPlan();
    toast.success("Chat limpiado");
  };

  const handleNewChat = async () => {
    setCurrentChat(null);
    setSessionId(null);
    resetConversation([initialAssistantMessage]);
    clearPlan();
    setInput("");

    // Force immediate refetch of chats list to refresh sidebar
    queryClient.invalidateQueries({
      queryKey: ["chats"],
      refetchType: "active",
    });
  };

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    setSessionId(chat.sessionId);
    setMode((chat.mode as ChatMode) || "explore");
    // Clear current messages while history is fetched
    resetConversation([], chat.sessionId);
    setInput("");
  };

  const quickPrompts =
    mode === "explore"
      ? [
          "Restaurante romántico para esta noche",
          "Bar divertido para tomar algo con amigos",
          "Café tranquilo para trabajar",
          "Mejor lugar para bailar",
        ]
      : [
          "Plan romántico para 2 personas",
          "Noche energética con amigos",
          "Plan económico para cenar y beber",
          "Plan casual para el fin de semana",
        ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <SidebarProvider>
        <div className="flex flex-1">
          <ChatSidebar
            currentChatId={currentChat?.id || null}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            isCreatingChat={isCreatingChat}
          />

          <SidebarInset className="flex-1 flex flex-col pt-14 sm:pt-16 lg:pt-20">
            <main className="flex-1 flex flex-col pb-8">
              {/* Hero Section */}
              <section className="py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-b from-background to-card/30 border-b border-border">
                <div className="container mx-auto">
                  <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 relative">
                    {/* Sidebar Toggle Button - Absolute Position */}
                    <div className="absolute left-0 top-0">
                      <SidebarTrigger />
                    </div>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-space-grotesk font-bold">
                        {currentChat?.title || (
                          <>
                            Chat con{" "}
                            <span className="gradient-text">Auphere AI</span>
                          </>
                        )}
                      </h1>
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <ModeSelector mode={mode} onModeChange={setMode} />

                      {messages.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearChat}
                          disabled={isStreaming}
                          className="gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Limpiar</span>
                        </Button>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                      {mode === "explore"
                        ? "Dime qué buscas y encontraré el lugar perfecto"
                        : "Crea un plan completo con múltiples lugares"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Chat Container */}
              <section className="flex-1 py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
                <div className="container mx-auto max-w-4xl">
                  {/* Messages */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6 mb-4 sm:mb-6">
                    {messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        onSuggestionClick={handleSuggestionClick}
                      />
                    ))}

                    {/* Loading Indicator */}
                    {(isStreaming || status) && (
                      <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-start">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="p-3 sm:p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border">
                          <div className="flex gap-1.5 sm:gap-2 items-center">
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          {status && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {status}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Convert to Plan Button */}
                  {mode === "explore" && planPlaces.length > 0 && (
                    <div className="mb-4 sm:mb-6 flex justify-center">
                      <Button
                        onClick={handleConvertToPlan}
                        variant="outline"
                        className="gap-2"
                        disabled={isSavingPlan}
                      >
                        <Calendar className="w-4 h-4" />
                        {isSavingPlan
                          ? "Guardando plan..."
                          : `Convertir a Plan (${planPlaces.length} lugares)`}
                      </Button>
                    </div>
                  )}

                  {/* Quick Prompts */}
                  {messages.length === 1 && (
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 text-center">
                        Prueba preguntando:
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                        {quickPrompts.map((prompt) => (
                          <Button
                            key={prompt}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromptClick(prompt)}
                            className="text-[10px] sm:text-xs h-8 px-2 sm:px-3"
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="sticky bottom-3 sm:bottom-4 lg:bottom-6 bg-background/95 backdrop-blur-lg border border-border rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4">
                    <div className="flex gap-2 sm:gap-3">
                      <Textarea
                        placeholder="¿Qué estás buscando?"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isStreaming}
                        className="flex-1 bg-card border-border min-h-[40px] max-h-[120px] text-sm sm:text-base resize-none"
                        rows={1}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={isStreaming || !input.trim()}
                        size="icon"
                        className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <BetaBadge />
    </div>
  );
};

export default Chat;
