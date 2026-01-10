"use client";

import { Suspense } from "react";
import { ChatView } from "./chat-view";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatHistory } from "@/api-queries/queries/chats.queries";
import { useUIStore } from "@/lib/store/ui-store";
import type { ChatMode } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

/**
 * Inner component that uses useSearchParams - must be wrapped in Suspense
 */
function ChatViewContainerInner() {
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
      trackEvent("chat_history_loaded", {
        sessionId: sessionId,
        chatHistory: chatHistory.messages,
      });
    }
  }, [chatHistory]);

  return (
    <ChatView
      sessionId={sessionId}
      chatHistory={chatHistory}
      isLoading={isLoading}
    />
  );
}

/**
 * Loading fallback for the chat view
 */
function ChatViewLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
        <p className="text-gray-500">Cargando chat...</p>
      </div>
    </div>
  );
}

/**
 * Chat View Container with Suspense boundary for useSearchParams
 */
export function ChatViewContainer() {
  return (
    <Suspense fallback={<ChatViewLoading />}>
      <ChatViewContainerInner />
    </Suspense>
  );
}
