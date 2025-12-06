export const plansKeys = {
  all: ["plans"] as const,
  list: (userId: string) => [...plansKeys.all, "list", userId] as const,
  create: () => [...plansKeys.all, "create"] as const,
};

