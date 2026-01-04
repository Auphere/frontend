/**
 * React Query hooks for chats
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatsApi } from '../api/chats.api';
import { chatsKeys } from '../keys/chats.keys';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Hook to get user's chat sessions
 */
export function useUserChats() {
  const { user, getAccessToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: chatsKeys.list(user?.sub || 'demo'),
    queryFn: async () => {
      const userId = user?.sub || 'demo-user-auphere';
      const token = isAuthenticated ? await getAccessToken() : null;
      return await chatsApi.getUserChats(userId, token);
    },
    enabled: !!user?.sub || !isAuthenticated, // Enable for demo mode too
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get chat history
 */
export function useChatHistory(chatId: string | null) {
  const { getAccessToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: chatsKeys.history(chatId || ''),
    queryFn: async () => {
      if (!chatId) return null;
      const token = isAuthenticated ? await getAccessToken() : null;
      return await chatsApi.getChatHistory(chatId, token);
    },
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to delete a chat
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { user, getAccessToken, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const userId = user?.sub || 'demo-user-auphere';
      const token = isAuthenticated ? await getAccessToken() : null;
      await chatsApi.deleteChat(chatId, userId, token);
    },
    onSuccess: () => {
      // Invalidate the chats list to refetch
      queryClient.invalidateQueries({ queryKey: chatsKeys.lists() });
    },
  });
}

