import apiClient from "@/lib/axios";
import {
  PlanCreateRequest,
  PlanUpdateRequest,
  PlanDTO,
  PlansResponse,
} from "../types/plans.types";

const BASE_PATH = "/plans";

export async function getPlans(state?: string): Promise<PlansResponse> {
  const params = state ? { state } : {};
  const { data } = await apiClient.get<PlansResponse>(BASE_PATH, { params });
  return data;
}

export async function getPlan(planId: string): Promise<PlanDTO> {
  const { data } = await apiClient.get<PlanDTO>(`${BASE_PATH}/${planId}`);
  return data;
}

export async function createPlan(payload: PlanCreateRequest): Promise<PlanDTO> {
  const { data } = await apiClient.post<PlanDTO>(BASE_PATH, payload);
  return data;
}

export async function updatePlan(
  planId: string,
  payload: PlanCreateRequest
): Promise<PlanDTO> {
  const { data } = await apiClient.put<PlanDTO>(
    `${BASE_PATH}/${planId}`,
    payload
  );
  return data;
}

export async function patchPlan(
  planId: string,
  payload: PlanUpdateRequest
): Promise<PlanDTO> {
  const { data } = await apiClient.patch<PlanDTO>(
    `${BASE_PATH}/${planId}`,
    payload
  );
  return data;
}

export async function deletePlan(planId: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${planId}`);
}

