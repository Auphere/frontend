import apiClient from "@/lib/axios";
import {
  PlanCreateRequest,
  PlanDTO,
  PlansResponse,
} from "../types/plans.types";

const BASE_PATH = "/plans";

export async function getPlans(): Promise<PlansResponse> {
  const { data } = await apiClient.get<PlansResponse>(BASE_PATH);
  return data;
}

export async function createPlan(payload: PlanCreateRequest): Promise<PlanDTO> {
  const { data } = await apiClient.post<PlanDTO>(BASE_PATH, payload);
  return data;
}

