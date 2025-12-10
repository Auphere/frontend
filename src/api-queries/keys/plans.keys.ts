export const plansKeys = {
  all: ["plans"] as const,
  list: (userId: string, state?: string) =>
    [...plansKeys.all, "list", userId, state] as const,
  detail: (planId: string) => [...plansKeys.all, "detail", planId] as const,
  create: () => [...plansKeys.all, "create"] as const,
};

