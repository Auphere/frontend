/**
 * Query keys for chats
 * Following TanStack Query best practices
 */

export const chatsKeys = {
  all: ['chats'] as const,
  lists: () => [...chatsKeys.all, 'list'] as const,
  list: (userId: string) => [...chatsKeys.lists(), userId] as const,
  details: () => [...chatsKeys.all, 'detail'] as const,
  detail: (chatId: string) => [...chatsKeys.details(), chatId] as const,
  history: (chatId: string) => [...chatsKeys.detail(chatId), 'history'] as const,
};

