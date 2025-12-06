/**
 * Chat types for API communication
 */

export interface Chat {
  id: string;
  userId: string;
  sessionId: string;
  title: string;
  mode?: "explore" | "plan" | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  chats: Chat[];
  total: number;
}

export interface ChatCreateRequest {
  userId?: string; // Will be set by backend from auth
  sessionId?: string; // Optional, will be generated if not provided
  title?: string; // Optional, will be auto-generated if not provided
  mode?: "explore" | "plan";
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
  places?: any[];
  plan?: any;
}

export interface ChatHistoryResponse {
  chatId: string;
  sessionId: string;
  messages: ChatHistoryMessage[];
}

export interface ChatUpdateRequest {
  title?: string;
  mode?: "explore" | "plan";
}

