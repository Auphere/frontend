"use client";

import { ChatView } from "./chat-view";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatHistory } from "@/api-queries/queries/chats.queries";
import { useUIStore } from "@/lib/store/ui-store";
import type { ChatMode } from "@/lib/types";

export function ChatViewContainer() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const modeParam = searchParams.get("mode");
  const { setChatMode } = useUIStore();

  // Load chat history if session ID is present
  const { data: chatHistory, isLoading } = useChatHistory(sessionId);

  // Set chat mode from URL parameter on mount
  useEffect(() => {
    if (modeParam === "plan" || modeParam === "explore") {
      setChatMode(modeParam as ChatMode);
    }
  }, [modeParam, setChatMode]);

  useEffect(() => {
    if (chatHistory && chatHistory.messages) {
      console.log("Loaded chat history:", chatHistory);
      // The history will be loaded into the runtime provider
    }
  }, [chatHistory]);

  return <ChatView sessionId={sessionId} chatHistory={chatHistory} isLoading={isLoading} />;
}

