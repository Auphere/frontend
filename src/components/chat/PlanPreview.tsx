import { EveningPlan } from "@/types/place";
import { PlanPreviewCard } from "./PlanPreviewCard";
import { useNavigate } from "react-router-dom";
import { useCreatePlan } from "@/api-queries/query/plans.query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PlanStopDTO } from "@/api-queries/types/plans.types";

interface PlanPreviewProps {
  plan: EveningPlan;
  planSavedId?: string; // ID of saved plan if already saved
  onPlanSaved?: (planId: string) => void; // Callback when plan is saved
}

// Helper to normalize noise level values (Spanish -> English)
const normalizeNoiseLevel = (
  noiseLevel?: string
): "low" | "medium" | "high" => {
  if (!noiseLevel) return "medium";

  const normalized = noiseLevel.toLowerCase();

  // Spanish to English mapping
  if (normalized === "bajo" || normalized === "low") return "low";
  if (normalized === "alto" || normalized === "high") return "high";

  // Default to medium for "moderado", "medio", "medium", or any other value
  return "medium";
};

export const PlanPreview = ({
  plan,
  planSavedId,
  onPlanSaved,
}: PlanPreviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: createPlan, isPending: isSaving } = useCreatePlan(
    user?.id
  );

  const handleSavePlan = async (planToSave: EveningPlan) => {
    try {
      // Convert EveningPlan to PlanCreateRequest format
      const stops: PlanStopDTO[] = planToSave.stopsDetailed
        ? planToSave.stopsDetailed.map((stop, index) => ({
            stop_number: stop.stopNumber || index + 1, // Use index if missing
            local_id: stop.localId || stop.name, // Fallback to name if no localId
            name: stop.name,
            category: stop.category,
            type_label: stop.typeLabel,
            timing: {
              recommended_start: stop.timing?.recommendedStart || "12:00",
              suggested_duration_minutes:
                stop.timing?.suggestedDurationMinutes || 60,
              estimated_end: stop.timing?.estimatedEnd || "13:00",
              expected_occupancy: stop.timing?.expectedOccupancy,
              occupancy_recommendation: stop.timing?.occupancyRecommendation,
            },
            location: {
              address: stop.location?.address || "",
              zone: stop.location?.zone,
              lat: stop.location?.lat || 0,
              lng: stop.location?.lng || 0,
              travel_time_from_previous_minutes:
                stop.location?.travelTimeFromPreviousMinutes,
              travel_mode: stop.location?.travelMode,
            },
            details: {
              vibes: stop.details?.vibes || [],
              target_audience: Array.isArray(stop.details?.targetAudience)
                ? stop.details.targetAudience
                : stop.details?.targetAudience
                ? [stop.details.targetAudience]
                : [],
              music: stop.details?.music,
              noise_level: normalizeNoiseLevel(stop.details?.noiseLevel),
              average_spend_per_person: stop.details?.averageSpendPerPerson,
            },
            selection_reasons: stop.selectionReasons || [],
            actions: {
              can_reserve: stop.actions?.canReserve || false,
              reservation_url: stop.actions?.reservationUrl,
              google_maps_url: stop.actions?.googleMapsUrl,
              phone: stop.actions?.phone,
            },
            alternatives: stop.alternatives?.map((alt) => ({
              name: alt.name,
              reason_not_selected: alt.reasonNotSelected,
              link: alt.link,
            })),
            personal_tips: stop.personalTips,
          }))
        : planToSave.stops.map((stop) => ({
            activity: stop.activity,
            duration: stop.duration,
            start_time: stop.startTime,
            place: stop.place,
          }));

      const savedPlan = await createPlan({
        name: planToSave.name,
        description: planToSave.description,
        category: planToSave.category,
        state: "saved",
        vibes: planToSave.vibes,
        tags: planToSave.tags,
        execution: planToSave.execution,
        stops,
        summary: planToSave.summary
          ? {
              total_duration: planToSave.summary.totalDuration,
              total_distance_km: planToSave.summary.totalDistanceKm,
              budget: {
                total: planToSave.summary.budget.total,
                per_person: planToSave.summary.budget.perPerson,
                within_budget: planToSave.summary.budget.withinBudget,
                breakdown: planToSave.summary.budget.breakdown,
              },
              metrics: planToSave.summary.metrics,
            }
          : undefined,
        final_recommendations: planToSave.finalRecommendations,
        metadata: {
          source: "ai-plan",
          created_from_chat: true,
        },
        // Legacy fields for backwards compatibility
        vibe: planToSave.vibe || (planToSave.vibes && planToSave.vibes[0]),
        total_duration: planToSave.totalDuration,
        total_distance: planToSave.totalDistance,
      });

      // Notify parent that plan was saved
      if (onPlanSaved && savedPlan?.id) {
        onPlanSaved(savedPlan.id);
      }

      toast.success("Plan guardado exitosamente");
      setTimeout(() => navigate("/planner"), 500);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Error al guardar el plan");
    }
  };

  const handleEditPlan = (planToEdit: EveningPlan) => {
    toast.info(
      "💬 Tell me what you'd like to change about the plan and I'll update it for you!",
      {
        duration: 5000,
      }
    );
  };

  return (
    <PlanPreviewCard
      plan={plan}
      onSave={planSavedId ? undefined : handleSavePlan} // Hide save button if already saved
      onEdit={handleEditPlan}
      isSaving={isSaving}
      isDraft={!planSavedId} // Not a draft if already saved
    />
  );
};
