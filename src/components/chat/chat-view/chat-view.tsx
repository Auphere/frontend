import { ChatRuntimeProvider } from "../chat-runtime-provider";
import { Thread } from "@/components/assistant-ui/thread";
import type { ChatHistoryResponse } from "@/api-queries/types/chats.types";

export interface ChatViewProps {
  sessionId: string | null;
  chatHistory: ChatHistoryResponse | null | undefined;
  isLoading: boolean;
}

export function ChatView({ sessionId, chatHistory, isLoading }: ChatViewProps) {
  if (isLoading && sessionId && !chatHistory) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F6F5F4]">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent" />
          <p className="text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatRuntimeProvider sessionId={sessionId} initialHistory={chatHistory}>
      <div className="h-full bg-[#F6F5F4]">
        <Thread />
      </div>
    </ChatRuntimeProvider>
  );
}
