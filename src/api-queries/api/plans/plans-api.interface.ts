import type { Plan } from "@/lib/types";

export interface GetPlansParams {
  userId: string;
}

export interface GetPlanParams {
  planId: string;
}

export interface CreatePlanParams {
  userId: string;
  title: string;
  description?: string;
  city: string;
}

export interface UpdatePlanParams {
  planId: string;
  updates: Partial<Plan>;
}

export interface DeletePlanParams {
  planId: string;
}

