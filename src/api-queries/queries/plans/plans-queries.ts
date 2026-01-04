import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansAPI } from "@/api-queries/api/plans";
import { plansKeys } from "@/api-queries/keys/plans";
import type { Plan } from "@/lib/types";

// ============================================================================
// QUERIES
// ============================================================================

export function usePlansQuery(userId: string) {
  return useQuery({
    queryKey: plansKeys.list(userId),
    queryFn: () => plansAPI.getPlans({ userId }),
    enabled: !!userId,
  });
}

export function usePlanQuery(planId: string) {
  return useQuery({
    queryKey: plansKeys.detail(planId),
    queryFn: () => plansAPI.getPlan({ planId }),
    enabled: !!planId,
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
      // Invalidate plans list for this user
      queryClient.invalidateQueries({
        queryKey: plansKeys.list(newPlan.user_id),
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
      // Invalidate plans list
      queryClient.invalidateQueries({
        queryKey: plansKeys.list(updatedPlan.user_id),
      });
    },
  });
}

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.deletePlan,
    onSuccess: (_, variables) => {
      // Invalidate all plans queries
      queryClient.invalidateQueries({
        queryKey: plansKeys.all,
      });
    },
  });
}

