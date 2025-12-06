import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as plansApi from "../api/plans.api";
import { plansKeys } from "../keys/plans.keys";
import {
  PlanCreateRequest,
  mapPlanDtoToEveningPlan,
} from "../types/plans.types";

export function usePlans(userId?: string) {
  return useQuery({
    queryKey: plansKeys.list(userId || "anonymous"),
    queryFn: async () => {
      const data = await plansApi.getPlans();
      return data.map(mapPlanDtoToEveningPlan);
    },
    enabled: !!userId,
  });
}

export function useCreatePlan(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: plansKeys.create(),
    mutationFn: (payload: PlanCreateRequest) => plansApi.createPlan(payload),
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: plansKeys.list(userId) });
      }
    },
  });
}

