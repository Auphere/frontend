/**
 * Query keys for chats API
 */
import { QueryKey } from "@tanstack/react-query";

export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (limit?: number, offset?: number) =>
    [...chatKeys.lists(), limit, offset] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  history: (id: string) => [...chatKeys.detail(id), "history"] as const,
};

