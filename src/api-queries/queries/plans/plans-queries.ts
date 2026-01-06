import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansAPI } from "@/api-queries/api/plans";
import { plansKeys } from "@/api-queries/keys/plans";
import type { Plan } from "@/lib/types";
import { useAuth } from "@/lib/hooks/use-auth";

// ============================================================================
// QUERIES
// ============================================================================

export function usePlansQuery(options?: { state?: "draft" | "saved" | "completed" }) {
  const { getAccessToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: plansKeys.list(options?.state || "all"),
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      return plansAPI.getPlans({ token, state: options?.state });
    },
    enabled: isAuthenticated,
  });
}

export function usePlanQuery(planId: string) {
  const { getAccessToken, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: plansKeys.detail(planId),
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      return plansAPI.getPlan({ planId, token });
    },
    enabled: !!planId && isAuthenticated,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.createPlan,
    onSuccess: (newPlan) => {
      // Invalidate all plans lists
      queryClient.invalidateQueries({
        queryKey: plansKeys.lists(),
      });
    },
  });
}

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.updatePlan,
    onSuccess: (updatedPlan) => {
      // Update the specific plan in cache
      queryClient.setQueryData<Plan>(
        plansKeys.detail(updatedPlan.id),
        updatedPlan
      );
      // Invalidate plans lists
      queryClient.invalidateQueries({
        queryKey: plansKeys.lists(),
      });
    },
  });
}

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.deletePlan,
    onSuccess: () => {
      // Invalidate all plans queries
      queryClient.invalidateQueries({
        queryKey: plansKeys.all,
      });
    },
  });
}

