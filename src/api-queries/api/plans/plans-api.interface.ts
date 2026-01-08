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

export type PlanAiEdit = {
  operation: "replace_stop" | "remove_stop" | "add_stop" | "update_timing";
  instruction: string;
  stop_number?: number; // 1-based
  constraints?: Record<string, unknown>;
  language?: string;
};

export interface CreatePlanParams {
  plan: PlanCreatePayload;
  token: string;
}

export interface UpdatePlanParams {
  planId: string;
  updates: Partial<PlanCreatePayload> & { ai_edit?: PlanAiEdit };
  token: string;
}

export interface DeletePlanParams {
  planId: string;
  token: string;
}
