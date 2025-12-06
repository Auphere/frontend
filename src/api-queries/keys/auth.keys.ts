/**
 * Query keys for auth module
 * These keys are used to identify and cache queries in TanStack Query
 */

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
} as const;

