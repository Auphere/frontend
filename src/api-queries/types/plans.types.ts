import { EveningPlan, PlanStop } from "@/types/place";

export interface PlanDTO {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  vibe?: string;
  total_duration: number;
  total_distance: number;
  stops: PlanStopDTO[];
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface PlanStopDTO {
  activity: string;
  duration: number;
  start_time: string;
  place: Record<string, any>;
}

export interface PlanCreateRequest {
  name: string;
  description?: string;
  vibe?: string;
  total_duration: number;
  total_distance: number;
  stops: PlanStopDTO[];
  metadata?: Record<string, any>;
}

export type PlansResponse = PlanDTO[];

export const mapPlanDtoToEveningPlan = (plan: PlanDTO): EveningPlan => ({
  id: plan.id,
  name: plan.name,
  description: plan.description ?? "",
  vibe: (plan.vibe as any) || "casual",
  totalDuration: plan.total_duration,
  totalDistance: plan.total_distance,
  stops: plan.stops.map((stop) => ({
    activity: stop.activity,
    duration: stop.duration,
    startTime: stop.start_time,
    place: stop.place as any,
  })),
});

