import axios from "axios";
import type { Plan } from "@/lib/types";
import type {
  GetPlansParams,
  GetPlanParams,
  CreatePlanParams,
  UpdatePlanParams,
  DeletePlanParams,
} from "./plans-api.interface";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE || "http://localhost:8000";

// Helper to create axios config with auth
function authConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

// Transform backend response to frontend Plan type
function transformBackendPlan(backendPlan: any): Plan {
  return {
    id: backendPlan.id,
    user_id: backendPlan.user_id,
    title: backendPlan.name, // Backend uses 'name'
    name: backendPlan.name,
    description: backendPlan.description || "",
    category: backendPlan.category,
    vibes: backendPlan.vibes || [],
    tags: backendPlan.tags || [],
    execution: backendPlan.execution || {},
    stops: backendPlan.stops || [],
    summary: backendPlan.summary || {
      total_duration: "0h",
      budget: { total: 0, per_person: 0, within_budget: true },
    },
    final_recommendations: backendPlan.final_recommendations || [],
    state: backendPlan.state || "saved",
    created_at: backendPlan.created_at,
    updated_at: backendPlan.updated_at,
    // Legacy fields
    city: backendPlan.execution?.city,
    estimated_cost: backendPlan.summary?.budget?.total,
    total_duration_minutes: backendPlan.total_duration,
  };
}

export const plansAPI = {
  getPlans: async ({ token, state }: GetPlansParams): Promise<Plan[]> => {
    const params = state ? { state } : {};
    const { data } = await axios.get(`${API_BASE_URL}/api/v1/plans`, {
      ...authConfig(token),
      params,
    });
    return data.map(transformBackendPlan);
  },

  getPlan: async ({ planId, token }: GetPlanParams): Promise<Plan | null> => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/plans/${planId}`,
        authConfig(token)
      );
      return transformBackendPlan(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createPlan: async ({ plan, token }: CreatePlanParams): Promise<Plan> => {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/plans`,
      plan,
      authConfig(token)
    );
    return transformBackendPlan(data);
  },

  updatePlan: async ({
    planId,
    updates,
    token,
  }: UpdatePlanParams): Promise<Plan> => {
    const { data } = await axios.patch(
      `${API_BASE_URL}/api/v1/plans/${planId}`,
      updates,
      authConfig(token)
    );
    return transformBackendPlan(data);
  },

  deletePlan: async ({ planId, token }: DeletePlanParams): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/api/v1/plans/${planId}`,
      authConfig(token)
    );
  },
};

