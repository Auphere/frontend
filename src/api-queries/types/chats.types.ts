/**
 * Types for Chat/Session management
 * Matches backend structure from auphere-agent
 */

export interface ChatSession {
  id: string;
  user_id: string;
  session_id: string;
  title: string;
  mode?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionsResponse {
  chats: ChatSession[];
  total: number;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  places?: any[];
  plan?: any;
}

export interface ChatHistoryResponse {
  chat_id: string;
  session_id: string;
  messages: ChatHistoryMessage[];
}

