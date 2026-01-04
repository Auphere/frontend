"use client";

import { ChatView } from "./chat-view";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatHistory } from "@/api-queries/queries/chats.queries";

export function ChatViewContainer() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  // Load chat history if session ID is present
  const { data: chatHistory, isLoading } = useChatHistory(sessionId);

  useEffect(() => {
    if (chatHistory && chatHistory.messages) {
      console.log("Loaded chat history:", chatHistory);
      // The history will be loaded into the runtime provider
    }
  }, [chatHistory]);

  return <ChatView sessionId={sessionId} chatHistory={chatHistory} isLoading={isLoading} />;
}

