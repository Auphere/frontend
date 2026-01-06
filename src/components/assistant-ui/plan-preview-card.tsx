"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/types";
import {
  MapPin,
  Clock,
  Euro,
  Users,
  ChevronRight,
  Loader2,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { useCreatePlanMutation } from "@/api-queries/queries/plans";
import { useAuth } from "@/lib/hooks/use-auth";

// Agent plan uses camelCase, backend uses snake_case
// This interface handles both
interface AgentPlan {
  planId?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  vibes?: string[];
  tags?: string[];
  execution?: {
    date?: string;
    startTime?: string;
    start_time?: string;
    durationHours?: number;
    duration_hours?: number;
    city?: string;
    zones?: string[];
    groupSize?: number;
    group_size?: number;
    groupComposition?: string;
    group_composition?: string;
  };
  stops?: AgentPlanStop[];
  summary?: {
    totalDuration?: string;
    total_duration?: string;
    totalDistanceKm?: number;
    total_distance_km?: number;
    budget?: {
      total?: number;
      perPerson?: number;
      per_person?: number;
      withinBudget?: boolean;
      within_budget?: boolean;
    };
  };
  finalRecommendations?: string[];
  final_recommendations?: string[];
}

interface AgentPlanStop {
  stopNumber?: number;
  stop_number?: number;
  localId?: string;
  local_id?: string;
  name?: string;
  category?: string;
  typeLabel?: string;
  type_label?: string;
  timing?: {
    recommendedStart?: string;
    recommended_start?: string;
    suggestedDurationMinutes?: number;
    suggested_duration_minutes?: number;
    estimatedEnd?: string;
    estimated_end?: string;
  };
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
    travelTimeFromPreviousMinutes?: number;
    travel_time_from_previous_minutes?: number;
  };
  details?: {
    vibes?: string[];
    averageSpendPerPerson?: number;
    average_spend_per_person?: number;
  };
  selectionReasons?: string[];
  selection_reasons?: string[];
  personalTips?: string[];
  personal_tips?: string[];
}

// Extended agent plan interface to handle stopsDetailed from backend
interface AgentPlanExtended extends AgentPlan {
  stopsDetailed?: AgentPlanStop[];
  totalDuration?: number; // Minutes as number from backend
  totalDistance?: number; // Km as number from backend
}

interface PlanPreviewCardProps {
  plan: AgentPlanExtended | Plan;
  onSaveSuccess?: (savedPlan: Plan) => void;
}

// Helper to normalize plan data from agent (camelCase) to frontend (snake_case)
function normalizePlan(plan: AgentPlanExtended): Plan {
  // Use stopsDetailed if available (from backend normalization), fallback to stops
  const rawStops = plan.stopsDetailed || plan.stops || [];
  
  const stops = rawStops.map((stop: any, idx) => {
    // Handle simple stop format from backend: { place: { name, ... }, duration, startTime, activity }
    const isSimpleFormat = stop.place && typeof stop.place === 'object';
    
    // Extract name from different possible locations
    const name = isSimpleFormat 
      ? stop.place.name 
      : (stop.name || "Sin nombre");
    
    // Extract location from different possible locations  
    const locationObj = isSimpleFormat
      ? stop.place.location || stop.place
      : stop.location;
    
    return {
      stop_number: stop.stopNumber ?? stop.stop_number ?? idx + 1,
      local_id: stop.localId ?? stop.local_id ?? (isSimpleFormat ? stop.place.id : null) ?? `stop-${idx}`,
      name,
      category: stop.category || stop.activity || "place",
      type_label: stop.typeLabel ?? stop.type_label ?? stop.activity,
      timing: {
        recommended_start: stop.timing?.recommendedStart ?? stop.timing?.recommended_start ?? stop.startTime ?? "",
        suggested_duration_minutes: stop.timing?.suggestedDurationMinutes ?? stop.timing?.suggested_duration_minutes ?? stop.duration ?? 60,
        estimated_end: stop.timing?.estimatedEnd ?? stop.timing?.estimated_end ?? "",
      },
      location: {
        address: locationObj?.address || (isSimpleFormat ? stop.place.address : "") || "",
        lat: locationObj?.lat || 0,
        lng: locationObj?.lng || locationObj?.lon || 0,
        travel_time_from_previous_minutes: stop.location?.travelTimeFromPreviousMinutes ?? stop.location?.travel_time_from_previous_minutes,
      },
      details: {
        vibes: stop.details?.vibes || [],
        average_spend_per_person: stop.details?.averageSpendPerPerson ?? stop.details?.average_spend_per_person,
      },
      selection_reasons: stop.selectionReasons ?? stop.selection_reasons ?? [],
      personal_tips: stop.personalTips ?? stop.personal_tips,
    };
  });

  // Handle totalDuration - can be string "3h 30m" or number (minutes)
  let totalDurationStr = "~3h";
  if (plan.summary?.totalDuration) {
    totalDurationStr = plan.summary.totalDuration;
  } else if (plan.summary?.total_duration) {
    totalDurationStr = plan.summary.total_duration;
  } else if (typeof plan.totalDuration === 'number' && plan.totalDuration > 0) {
    const hours = Math.floor(plan.totalDuration / 60);
    const mins = plan.totalDuration % 60;
    totalDurationStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  return {
    id: plan.planId ?? plan.id ?? "",
    user_id: "",
    title: plan.title ?? plan.name ?? "Plan sin título",
    name: plan.name ?? plan.title,
    description: plan.description || "",
    category: plan.category,
    vibes: plan.vibes || [],
    tags: plan.tags || [],
    execution: {
      date: plan.execution?.date,
      start_time: plan.execution?.startTime ?? plan.execution?.start_time,
      duration_hours: plan.execution?.durationHours ?? plan.execution?.duration_hours,
      city: plan.execution?.city,
      zones: plan.execution?.zones,
      group_size: plan.execution?.groupSize ?? plan.execution?.group_size,
      group_composition: plan.execution?.groupComposition ?? plan.execution?.group_composition,
    },
    stops,
    summary: {
      total_duration: totalDurationStr,
      total_distance_km: plan.summary?.totalDistanceKm ?? plan.summary?.total_distance_km ?? plan.totalDistance,
      budget: {
        total: plan.summary?.budget?.total ?? 0,
        per_person: plan.summary?.budget?.perPerson ?? plan.summary?.budget?.per_person ?? 0,
        within_budget: plan.summary?.budget?.withinBudget ?? plan.summary?.budget?.within_budget ?? true,
      },
    },
    final_recommendations: plan.finalRecommendations ?? plan.final_recommendations,
    state: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function PlanPreviewCard({ plan: rawPlan, onSaveSuccess }: PlanPreviewCardProps) {
  const router = useRouter();
  const { getAccessToken, isAuthenticated } = useAuth();
  const { mutate: createPlan, isPending, isSuccess } = useCreatePlanMutation();
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  // Normalize the plan data
  const plan = normalizePlan(rawPlan as AgentPlanExtended);

  const handleSave = async () => {
    if (!isAuthenticated) {
      // TODO: Show login prompt
      return;
    }

    const token = await getAccessToken();
    if (!token) return;

    createPlan(
      {
        plan: {
          name: plan.title,
          description: plan.description,
          category: plan.category,
          vibes: plan.vibes || [],
          tags: plan.tags || [],
          execution: plan.execution,
          stops: plan.stops,
          summary: plan.summary,
          final_recommendations: plan.final_recommendations,
          state: "saved",
        },
        token,
      },
      {
        onSuccess: (savedPlan) => {
          setSavedPlanId(savedPlan.id);
          onSaveSuccess?.(savedPlan);
        },
      }
    );
  };

  const handleViewDetails = () => {
    if (savedPlanId) {
      router.push(`/plans/${savedPlanId}`);
    }
  };

  // Get summary info
  const totalStops = plan.stops?.length || 0;
  const totalDuration = plan.summary?.total_duration || "~3h";
  const budgetPerPerson = plan.summary?.budget?.per_person;
  const groupSize = plan.execution?.group_size;
  
  // Don't show "TBD" as city - it's a placeholder from the agent
  const rawCity = plan.execution?.city;
  const city = rawCity && rawCity !== "TBD" ? rawCity : null;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-purple" />
          <span className="text-sm font-medium text-gray-700">
            Plan generado
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {plan.title}
        </h3>

        {plan.description && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {plan.description}
          </p>
        )}

        {/* Quick stats */}
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
          {city && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              {city}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            {totalDuration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
            📍 {totalStops} paradas
          </span>
          {budgetPerPerson && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
              <Euro className="h-3.5 w-3.5 text-gray-500" />~{budgetPerPerson}€/persona
            </span>
          )}
          {groupSize && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              {groupSize} personas
            </span>
          )}
        </div>

        {/* Preview of stops */}
        {plan.stops && plan.stops.length > 0 && (
          <div className="mb-4 space-y-2">
            {plan.stops.slice(0, 3).map((stop, idx) => (
              <StopPreviewItem 
                key={`stop-${stop.stop_number ?? idx}-${stop.local_id}`} 
                stop={stop} 
                index={idx} 
              />
            ))}
            {plan.stops.length > 3 && (
              <p className="text-center text-xs text-gray-500">
                +{plan.stops.length - 3} más
              </p>
            )}
          </div>
        )}

        {/* Vibes */}
        {plan.vibes && plan.vibes.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {plan.vibes.slice(0, 4).map((vibe) => (
              <span
                key={vibe}
                className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
              >
                {vibe}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isSuccess ? (
            <>
              <Button
                onClick={handleViewDetails}
                className="flex-1 bg-purple hover:bg-purple/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Ver plan guardado
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-purple hover:bg-purple/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "💾 Guardar Plan"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface NormalizedStop {
  stop_number: number;
  local_id: string;
  name: string;
  category: string;
  type_label?: string;
  timing: {
    recommended_start: string;
    suggested_duration_minutes: number;
    estimated_end: string;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
    travel_time_from_previous_minutes?: number;
  };
  details: {
    vibes: string[];
    average_spend_per_person?: number;
  };
  selection_reasons: string[];
  personal_tips?: string[];
}

function StopPreviewItem({ stop, index }: { stop: NormalizedStop; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple text-xs font-bold text-white">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{stop.name}</p>
        <p className="text-xs text-gray-500">
          {stop.timing?.recommended_start && `${stop.timing.recommended_start} · `}
          {stop.type_label || stop.category}
        </p>
      </div>
      {stop.details?.average_spend_per_person && (
        <span className="text-xs text-gray-500">
          ~{stop.details.average_spend_per_person}€
        </span>
      )}
    </div>
  );
}

