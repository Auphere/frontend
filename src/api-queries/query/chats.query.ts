/**
 * React Query hooks for chats
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserChats,
  getChat,
  getChatHistory,
  createChat,
  updateChat,
  deleteChat,
} from "../api/chats.api";
import { chatKeys } from "../keys/chats.keys";
import type {
  ChatCreateRequest,
  ChatUpdateRequest,
  ChatHistoryResponse,
} from "../types/chats.types";

/**
 * Get all chats for the current user
 */
export function useChats(
  limit: number = 50,
  offset: number = 0,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: chatKeys.list(limit, offset),
    queryFn: () => getUserChats(limit, offset),
    enabled: options?.enabled ?? true, // Only fetch if enabled (user is authenticated and sidebar is open)
    staleTime: 30000, // 30 seconds - avoid unnecessary refetches
    refetchOnWindowFocus: false, // Don't auto-refetch on window focus
    retry: 1, // Only retry once on failure
    // No refetchInterval - only invalidate when needed (on create/update)
  });
}

/**
 * Get a specific chat by ID
 */
export function useChat(chatId: string | null) {
  return useQuery({
    queryKey: chatKeys.detail(chatId || ""),
    queryFn: () => getChat(chatId!),
    enabled: !!chatId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Get chat history (messages)
 */
export function useChatHistory(chatId: string | null, limit: number = 50) {
  return useQuery<ChatHistoryResponse>({
    queryKey: chatKeys.history(chatId || ""),
    queryFn: () => getChatHistory(chatId!, limit),
    enabled: !!chatId,
    staleTime: 0, // Always fresh
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

/**
 * Create a new chat
 */
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ChatCreateRequest) => createChat(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      toast.success("Chat creado");
    },
    onError: (error: any) => {
      toast.error(
        "Error al crear el chat: " + (error.message || "Error desconocido")
      );
    },
  });
}

/**
 * Update a chat
 */
export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      request,
    }: {
      chatId: string;
      request: ChatUpdateRequest;
    }) => updateChat(chatId, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(data.id) });
      toast.success("Chat actualizado");
    },
    onError: (error: any) => {
      toast.error(
        "Error al actualizar el chat: " + (error.message || "Error desconocido")
      );
    },
  });
}

/**
 * Delete a chat
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      toast.success("Chat eliminado");
    },
    onError: (error: any) => {
      toast.error(
        "Error al eliminar el chat: " + (error.message || "Error desconocido")
      );
    },
  });
}
