import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as plansApi from "../api/plans.api";
import { plansKeys } from "../keys/plans.keys";
import {
  PlanCreateRequest,
  PlanUpdateRequest,
  mapPlanDtoToEveningPlan,
} from "../types/plans.types";

export function usePlans(userId?: string, state?: string) {
  return useQuery({
    queryKey: plansKeys.list(userId || "anonymous", state),
    queryFn: async () => {
      const data = await plansApi.getPlans(state);
      return data.map(mapPlanDtoToEveningPlan);
    },
    enabled: !!userId,
  });
}

export function usePlan(planId?: string) {
  return useQuery({
    queryKey: plansKeys.detail(planId || ""),
    queryFn: async () => {
      if (!planId) throw new Error("Plan ID required");
      const data = await plansApi.getPlan(planId);
      return mapPlanDtoToEveningPlan(data);
    },
    enabled: !!planId,
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

export function useUpdatePlan(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: PlanCreateRequest;
    }) => plansApi.updatePlan(planId, payload),
    onSuccess: (_, variables) => {
      if (userId) {
        qc.invalidateQueries({ queryKey: plansKeys.list(userId) });
      }
      qc.invalidateQueries({ queryKey: plansKeys.detail(variables.planId) });
    },
  });
}

export function usePatchPlan(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: PlanUpdateRequest;
    }) => plansApi.patchPlan(planId, payload),
    onSuccess: (_, variables) => {
      if (userId) {
        qc.invalidateQueries({ queryKey: plansKeys.list(userId) });
      }
      qc.invalidateQueries({ queryKey: plansKeys.detail(variables.planId) });
    },
  });
}

export function useDeletePlan(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => plansApi.deletePlan(planId),
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: plansKeys.list(userId) });
      }
    },
  });
}

