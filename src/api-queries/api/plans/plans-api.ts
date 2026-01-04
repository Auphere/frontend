import axios from "axios";
import type { Plan } from "@/lib/types";
import type {
  GetPlansParams,
  GetPlanParams,
  CreatePlanParams,
  UpdatePlanParams,
  DeletePlanParams,
} from "./plans-api.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Mock data for development
const MOCK_PLANS: Plan[] = [
  {
    id: "plan-1",
    user_id: "user-1",
    title: "Noche en el Casco Viejo",
    description: "Ruta de tapas y copas por el centro histórico",
    city: "Zaragoza",
    cover_image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    days: [
      {
        day_number: 1,
        date: "2025-01-10",
        events: [
          {
            id: "event-1",
            order: 1,
            place_id: "place-1",
            place_name: "El Plata",
            place_type: "bar",
            start_time: "20:00",
            duration_minutes: 60,
            activity_type: "drinks",
            transport_to_next: {
              type: "walk",
              duration_minutes: 5,
              distance_km: 0.3,
            },
          },
          {
            id: "event-2",
            order: 2,
            place_id: "place-2",
            place_name: "La Miguería",
            place_type: "restaurant",
            start_time: "21:00",
            duration_minutes: 90,
            activity_type: "dinner",
          },
        ],
      },
    ],
    created_at: "2025-01-02T10:00:00Z",
    updated_at: "2025-01-02T10:00:00Z",
    is_public: false,
    total_duration_minutes: 150,
  },
];

export const plansAPI = {
  getPlans: async ({ userId }: GetPlansParams): Promise<Plan[]> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PLANS.filter((plan) => plan.user_id === userId);
  },

  getPlan: async ({ planId }: GetPlanParams): Promise<Plan | null> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PLANS.find((plan) => plan.id === planId) || null;
  },

  createPlan: async (params: CreatePlanParams): Promise<Plan> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      user_id: params.userId,
      title: params.title,
      description: params.description,
      city: params.city,
      days: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      total_duration_minutes: 0,
    };
    return newPlan;
  },

  updatePlan: async ({ planId, updates }: UpdatePlanParams): Promise<Plan> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    const plan = MOCK_PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");
    return { ...plan, ...updates, updated_at: new Date().toISOString() };
  },

  deletePlan: async ({ planId }: DeletePlanParams): Promise<void> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

