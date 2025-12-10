import { EveningPlan, PlanStop, PlanStopDetailed } from "@/types/place";

export interface PlanDTO {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  state: string;
  vibes: string[];
  tags: string[];
  execution?: Record<string, any>;
  stops: any[];
  summary?: Record<string, any>;
  final_recommendations?: string[];
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  executed?: boolean;
  execution_date?: string;
  rating_post_execution?: number;
  feedback?: string;
  
  // Legacy fields
  vibe?: string;
  total_duration?: number;
  total_distance?: number;
}

export interface PlanStopDTO {
  activity?: string;
  duration?: number;
  start_time?: string;
  place?: Record<string, any>;
  
  // Extended fields
  stop_number?: number;
  local_id?: string;
  name?: string;
  category?: string;
  type_label?: string;
  timing?: any;
  location?: any;
  details?: any;
  selection_reasons?: string[];
  actions?: any;
  alternatives?: any[];
  personal_tips?: string[];
}

export interface PlanCreateRequest {
  name: string;
  description?: string;
  category?: string;
  state?: "draft" | "saved" | "completed";
  vibes?: string[];
  tags?: string[];
  execution?: Record<string, any>;
  stops: PlanStopDTO[];
  summary?: Record<string, any>;
  final_recommendations?: string[];
  metadata?: Record<string, any>;
  
  // Legacy fields
  vibe?: string;
  total_duration?: number;
  total_distance?: number;
}

export interface PlanUpdateRequest {
  name?: string;
  description?: string;
  category?: string;
  state?: "draft" | "saved" | "completed";
  vibes?: string[];
  tags?: string[];
  execution?: Record<string, any>;
  stops?: PlanStopDTO[];
  summary?: Record<string, any>;
  final_recommendations?: string[];
  metadata?: Record<string, any>;
}

export type PlansResponse = PlanDTO[];

export const mapPlanDtoToEveningPlan = (plan: PlanDTO): EveningPlan => {
  // Map stops - handle both legacy and new format
  const stops: PlanStop[] = plan.stops.map((stop) => {
    // Legacy format
    if (stop.activity && stop.place) {
      return {
        activity: stop.activity,
        duration: stop.duration || 0,
        startTime: stop.start_time || "",
        place: stop.place as any,
      };
    }
    
    // New format - create a compatible legacy stop
    return {
      activity: stop.name || stop.activity || "",
      duration: stop.timing?.suggested_duration_minutes || stop.duration || 0,
      startTime: stop.timing?.recommended_start || stop.start_time || "",
      place: {
        id: stop.local_id || "",
        name: stop.name || "",
        category: stop.category || "restaurant",
        address: stop.location?.address || "",
        images: [],
        priceLevel: stop.details?.average_spend_per_person ? Math.ceil(stop.details.average_spend_per_person / 20) as 1 | 2 | 3 | 4 : 2,
      } as any,
    };
  });
  
  // Map detailed stops if available
  const stopsDetailed: PlanStopDetailed[] | undefined = plan.stops.some(s => s.stop_number !== undefined)
    ? plan.stops.map((stop) => ({
        stopNumber: stop.stop_number || 0,
        localId: stop.local_id || "",
        name: stop.name || "",
        category: stop.category || "",
        typeLabel: stop.type_label,
        timing: stop.timing || {
          recommendedStart: "",
          suggestedDurationMinutes: 0,
          estimatedEnd: "",
        },
        location: stop.location || {
          address: "",
          lat: 0,
          lng: 0,
        },
        details: stop.details || {
          vibes: [],
        },
        selectionReasons: stop.selection_reasons || [],
        actions: stop.actions || {
          canReserve: false,
        },
        alternatives: stop.alternatives,
        personalTips: stop.personal_tips,
      }))
    : undefined;
  
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description ?? "",
    category: plan.category,
    vibes: plan.vibes || (plan.vibe ? [plan.vibe] : []),
    tags: plan.tags || [],
    execution: plan.execution,
    stops,
    stopsDetailed,
    summary: plan.summary,
    finalRecommendations: plan.final_recommendations,
    state: plan.state as any,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
    executed: plan.executed,
    executionDate: plan.execution_date,
    ratingPostExecution: plan.rating_post_execution,
    feedback: plan.feedback,
    // Legacy fields
    vibe: (plan.vibe as any) || "casual",
    totalDuration: plan.total_duration,
    totalDistance: plan.total_distance,
  };
};

