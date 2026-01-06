export const plansKeys = {
  all: ["plans"] as const,
  lists: () => [...plansKeys.all, "list"] as const,
  list: (filter?: string) => [...plansKeys.lists(), filter || "all"] as const,
  details: () => [...plansKeys.all, "detail"] as const,
  detail: (planId: string) => [...plansKeys.details(), planId] as const,
};

