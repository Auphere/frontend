import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Send, Info, Loader2, Mic, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Message, ChatMode } from "@/types/chat";
import { Place, EveningPlan } from "@/types/place";
import { toast } from "sonner";
import { PlaceCard } from "@/components/new-ui/PlaceCard";
import { PlaceDrawer } from "@/components/new-ui/PlaceDrawer";
import { PlanDrawer } from "@/components/new-ui/PlanDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatHistory } from "@/api-queries/query/chats.query";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";

const Chat = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get("session");
  const modeFromUrl = searchParams.get("mode") as ChatMode | null;
  const isNewChat = searchParams.get("new") === "true";

  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<EveningPlan | null>(null);
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>(modeFromUrl || "explore");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { setCurrentSessionId } = useSidebar();

  // Use the chat hook with backend integration
  const {
    messages,
    sendMessage,
    status,
    isStreaming,
    error,
    sessionId,
    resetConversation,
    setSessionId,
  } = useChat(sessionIdFromUrl);

  // Use custom hook for auto-scroll (must be after messages is defined)
  const { ref: messagesEndRef } = useScrollToBottom([messages], "smooth");

  // Fetch history if sessionId changes
  const { data: historyData, isLoading: isLoadingHistory } = useChatHistory(
    sessionIdFromUrl || null
  );

  // Sync history to chat hook
  useEffect(() => {
    if (historyData && historyData.messages) {
      // Map history messages to Message type if needed, but assuming they match
      resetConversation(historyData.messages, historyData.sessionId);
    }
  }, [historyData, resetConversation]);

  // Sync session ID if URL param changes
  useEffect(() => {
    if (sessionIdFromUrl && sessionIdFromUrl !== sessionId) {
      setSessionId(sessionIdFromUrl);
    }
  }, [sessionIdFromUrl, sessionId, setSessionId]);

  // Actualizar el sessionId en el contexto global cuando cambie
  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId, setCurrentSessionId]);

  // Handle new chat creation from URL parameter
  useEffect(() => {
    if (isNewChat) {
      // Reset the conversation completely
      resetConversation([], "");
      setCurrentSessionId(null);

      // Set the mode if provided
      if (
        modeFromUrl &&
        (modeFromUrl === "explore" || modeFromUrl === "plan")
      ) {
        setMode(modeFromUrl);
        // Show success toast to confirm mode
        toast.success(
          modeFromUrl === "plan"
            ? t("chat.modes.planModeHelp")
            : t("chat.modes.exploreModeHelp")
        );
      }

      // Remove the 'new' and 't' parameters from URL to prevent repeated resets
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("new");
      newSearchParams.delete("t");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [
    isNewChat,
    modeFromUrl,
    resetConversation,
    setCurrentSessionId,
    searchParams,
    setSearchParams,
    t,
  ]);

  // Set mode from URL parameter (when not creating new chat)
  useEffect(() => {
    if (
      !isNewChat &&
      modeFromUrl &&
      (modeFromUrl === "explore" || modeFromUrl === "plan")
    ) {
      setMode(modeFromUrl);
    }
  }, [modeFromUrl, isNewChat]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    if (!user) {
      toast.error(t("auth.mustBeLoggedIn"));
      return;
    }

    const messageContent = input.trim();
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Send message through the backend
    await sendMessage(messageContent, mode);
  };

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    toast.success(
      newMode === "plan"
        ? t("chat.modes.planModeHelp")
        : t("chat.modes.exploreModeHelp")
    );
  };

  const handleNewChat = (newMode: ChatMode) => {
    // Reset conversation to clear current chat
    resetConversation([], "");
    // Set the mode for the new chat
    setMode(newMode);
    // Show success toast
    toast.success(
      newMode === "plan"
        ? t("chat.modes.planModeHelp")
        : t("chat.modes.exploreModeHelp")
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isEmptyChat = messages.length === 0;

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handlePlanClick = (plan: EveningPlan) => {
    setSelectedPlan(plan);
    setIsPlanDrawerOpen(true);
  };

  const handleClosePlanDrawer = () => {
    setIsPlanDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left - Magenta */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D511FD]/20 rounded-full blur-3xl animate-pulse" />

        {/* Top Right - Purple */}
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-[#8A43E1]/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Bottom Left - Orange */}
        <div className="absolute -bottom-40 left-20 w-[450px] h-[450px] bg-[#EF7B16]/20 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Bottom Right - Red */}
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-[#FF2F2F]/20 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Center - Purple/Orange Mix */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#8A43E1]/10 to-[#EF7B16]/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {isLoadingHistory ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              {t("chat.loadingConversation")}
            </p>
          </div>
        ) : isEmptyChat ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            <div className="max-w-2xl w-full text-center space-y-6">
              {/* Title with gradient */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-auphere-text">
                {t("chat.whereToToday")}
              </h1>

              {/* Description */}
              <p className="text-lg text-foreground/80 whitespace-pre-line">
                {t("chat.welcomeMessage")}
              </p>

              {/* Mode indicator */}
              {mode === "plan" && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
                  <span className="text-primary font-medium">
                    {t("chat.modes.planModeActive")}
                  </span>
                  <span className="text-muted-foreground">
                    - {t("chat.modes.planModeHelp")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Messages
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {messages.map((message, index) => (
              <div
                key={`${sessionId}-${index}`}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src="/assets/icono-auphere.png"
                      alt="Auphere"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "max-w-[70%] bg-primary text-primary-foreground"
                      : "max-w-[85%] bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>

                  {/* Show plan button if available */}
                  {message.plan && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base mb-1">
                            {message.plan.name ||
                              t("plan.personalizedItinerary")}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {message.plan.stops?.length || 0} {t("plan.stops")}{" "}
                            •{" "}
                            {message.plan.totalDuration
                              ? `${Math.floor(
                                  message.plan.totalDuration / 60
                                )}h ${message.plan.totalDuration % 60}m`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handlePlanClick(message.plan!)}
                        className="w-full gradient-auphere text-white font-medium"
                      >
                        {t("chat.viewItinerary")}
                      </Button>
                    </div>
                  )}

                  {/* Show places if available */}
                  {message.places && message.places.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-semibold text-foreground/80">
                        {t("chat.suggestedPlaces", {
                          count: message.places.length,
                        })}
                        :
                      </p>
                      {/* Horizontal scroll container */}
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        {message.places.map((place) => (
                          <div
                            key={place.id}
                            className="flex-shrink-0 w-[280px]"
                          >
                            <PlaceCard
                              place={place}
                              onClick={() => handlePlaceClick(place)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👤</span>
                  </div>
                )}
              </div>
            ))}

            {/* Streaming status */}
            {isStreaming && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="/assets/icono-auphere.png"
                    alt="Auphere"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  {status ? (
                    <p className="text-sm text-muted-foreground">{status}</p>
                  ) : (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="backdrop-blur-md relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            {/* Input Container with Gradient Border */}
            <div className="relative p-[2px] rounded-3xl gradient-auphere">
              <div className="bg-background rounded-3xl">
                {/* Textarea */}
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "plan"
                      ? t("chat.describeIdealDay")
                      : t("chat.askAnything")
                  }
                  disabled={isStreaming}
                  className="flex-1 min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-4 rounded-3xl disabled:opacity-50"
                  rows={1}
                />

                {/* Action Buttons - Bottom */}
                <div className="flex items-center justify-between px-4 pb-3">
                  {/* Left side - Plus button */}
                  <div className="flex items-center gap-2">
                    {/* Plus Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-9 w-9"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>
                          {t("chat.modes.explore")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleModeChange("explore")}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                🔍 {t("chat.modes.explore")}
                              </span>
                              {mode === "explore" && (
                                <span className="text-xs text-primary">
                                  Active
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {t("chat.modes.exploreDescription")}
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleModeChange("plan")}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                📅 {t("chat.modes.plan")}
                              </span>
                              {mode === "plan" && (
                                <span className="text-xs text-primary">
                                  Active
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {t("chat.modes.planDescription")}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Right side - Mic and Send buttons */}
                  <div className="flex items-center gap-2">
                    {/* Mic Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9"
                      onClick={() =>
                        toast.info(t("chat.voiceInputComingSoon"), {
                          description: t("chat.featureUnderDevelopment"),
                        })
                      }
                    >
                      <Mic className="h-5 w-5" />
                    </Button>

                    {/* Send Button */}
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isStreaming}
                      size="icon"
                      className="rounded-full h-10 w-10"
                      variant="ghost"
                    >
                      {isStreaming ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Send className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode indicator badge */}
            {mode === "plan" && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-primary font-medium">
                    {t("chat.modes.planModeActive")}
                  </span>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <Info className="h-3 w-3" />
              {t("chat.disclaimer")}
            </p>
          </div>
        </div>
      </div>

      {/* Place Drawer with overlay variant */}
      <PlaceDrawer
        place={selectedPlace}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        variant="overlay"
      />

      {/* Plan Drawer with overlay variant */}
      <PlanDrawer
        plan={selectedPlan}
        isOpen={isPlanDrawerOpen}
        onClose={handleClosePlanDrawer}
        variant="overlay"
      />
    </div>
  );
};

export default Chat;
