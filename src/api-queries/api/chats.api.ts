/**
 * Chats API functions
 * All HTTP requests to the chat management endpoints
 */
import { apiClient } from "@/lib/axios";
import { transformKeysToCamel, transformKeysToSnake } from "@/lib/transform";
import type {
  Chat,
  ChatListResponse,
  ChatCreateRequest,
  ChatUpdateRequest,
  ChatHistoryResponse,
} from "../types/chats.types";

/**
 * Get all chats for the current user
 */
export async function getUserChats(
  limit: number = 50,
  offset: number = 0
): Promise<ChatListResponse> {
  const response = await apiClient.get("/chat/list", {
    params: { limit, offset },
  });
  return transformKeysToCamel<ChatListResponse>(response.data);
}

/**
 * Get a specific chat by ID
 */
export async function getChat(chatId: string): Promise<Chat> {
  const response = await apiClient.get(`/chat/info/${chatId}`);
  return transformKeysToCamel<Chat>(response.data);
}

/**
 * Create a new chat
 */
export async function createChat(
  request: ChatCreateRequest
): Promise<Chat> {
  const response = await apiClient.post(
    "/chat/create",
    transformKeysToSnake(request)
  );
  return transformKeysToCamel<Chat>(response.data);
}

/**
 * Update a chat (e.g., rename title)
 */
export async function updateChat(
  chatId: string,
  request: ChatUpdateRequest
): Promise<Chat> {
  const response = await apiClient.patch(
    `/chat/${chatId}`,
    transformKeysToSnake(request)
  );
  return transformKeysToCamel<Chat>(response.data);
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string): Promise<void> {
  await apiClient.delete(`/chat/${chatId}`);
}

/**
 * Get chat history (messages) by chat ID
 */
export async function getChatHistory(
  chatId: string,
  limit: number = 50
): Promise<ChatHistoryResponse> {
  const response = await apiClient.get(`/chat/${chatId}/history`, {
    params: { limit },
  });
  return transformKeysToCamel<ChatHistoryResponse>(response.data);
}

