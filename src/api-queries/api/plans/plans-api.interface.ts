import type { Plan, PlanStop, PlanExecution, PlanSummary } from "@/lib/types";

export interface GetPlansParams {
  token: string;
  state?: "draft" | "saved" | "completed";
}

export interface GetPlanParams {
  planId: string;
  token: string;
}

export interface PlanCreatePayload {
  name: string;
  description?: string;
  category?: string;
  vibes?: string[];
  tags?: string[];
  execution?: PlanExecution;
  stops: PlanStop[];
  summary?: PlanSummary;
  final_recommendations?: string[];
  state?: "draft" | "saved" | "completed";
  metadata?: Record<string, unknown>;
}

export interface CreatePlanParams {
  plan: PlanCreatePayload;
  token: string;
}

export interface UpdatePlanParams {
  planId: string;
  updates: Partial<PlanCreatePayload>;
  token: string;
}

export interface DeletePlanParams {
  planId: string;
  token: string;
}

