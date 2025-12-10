import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Save,
  Edit,
  X,
  Check,
  Navigation,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { EveningPlan } from "@/types/place";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PlanPreviewCardProps {
  plan: EveningPlan;
  onSave?: (plan: EveningPlan) => void;
  onEdit?: (plan: EveningPlan) => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  isDraft?: boolean;
}

export const PlanPreviewCard = ({
  plan,
  onSave,
  onEdit,
  onDiscard,
  isSaving = false,
  isDraft = true,
}: PlanPreviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    if (onSave) {
      onSave(plan);
    } else {
      toast.success("Plan guardado exitosamente");
      setTimeout(() => navigate("/planner"), 500);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(plan);
    } else {
      toast.info("Función de edición próximamente");
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
  };

  // Extract summary data
  const totalDuration =
    plan.summary?.totalDuration ||
    (plan.totalDuration
      ? `${Math.floor(plan.totalDuration / 60)}h ${plan.totalDuration % 60}m`
      : "");
  const totalDistance =
    plan.summary?.totalDistanceKm || plan.totalDistance || 0;
  const budget = plan.summary?.budget;
  const groupSize = plan.execution?.groupSize;
  const vibes = plan.vibes || (plan.vibe ? [plan.vibe] : []);

  return (
    <Card
      className={cn(
        "p-4 sm:p-6 border-2 transition-all duration-300",
        isDraft
          ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30"
          : "bg-background border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-space-grotesk font-bold text-lg sm:text-xl">
              {plan.name}
            </h3>
            {isDraft && (
              <>
                <Badge variant="secondary" className="text-xs">
                  🤖 AI Draft
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-amber-500 text-amber-600 dark:text-amber-400"
                >
                  Review & Save
                </Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          {isDraft && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              ✨ I've created this personalized plan for you. Review it, ask me
              to make changes, or save it!
            </p>
          )}
        </div>
        {vibes.length > 0 && (
          <Badge className="capitalize shrink-0">{vibes[0]}</Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 pb-4 border-b border-border">
        {totalDuration && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">{totalDuration}</span>
          </div>
        )}
        {totalDistance > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">
              {totalDistance.toFixed(1)} km
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">
            {plan.stops.length} parada{plan.stops.length !== 1 ? "s" : ""}
          </span>
        </div>
        {groupSize && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">
              {groupSize} persona{groupSize !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {budget && budget.perPerson != null && (
          <div className="flex items-center gap-2 text-sm col-span-2">
            <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium">
              €{budget.perPerson.toFixed(0)}/persona
            </span>
            {budget.withinBudget != null &&
              (budget.withinBudget ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              ))}
          </div>
        )}
      </div>

      {/* Timeline Preview */}
      <div className="space-y-3 mb-4">
        {plan.stopsDetailed
          ? plan.stopsDetailed
              .slice(0, isExpanded ? undefined : 3)
              .map((stop, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {stop.stopNumber}
                    </div>
                    {idx <
                      (isExpanded
                        ? plan.stopsDetailed!.length - 1
                        : Math.min(2, plan.stopsDetailed!.length - 1)) && (
                      <div className="w-0.5 h-full bg-primary/20 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          {stop.name}
                        </p>
                        {stop.typeLabel && (
                          <p className="text-xs text-muted-foreground">
                            {stop.typeLabel}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {stop.timing.recommendedStart}
                          {stop.timing.estimatedEnd &&
                            ` - ${stop.timing.estimatedEnd}`}
                        </Badge>
                        {stop.timing.suggestedDurationMinutes && (
                          <span className="text-[10px] text-muted-foreground">
                            {stop.timing.suggestedDurationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    {stop.location.address && (
                      <p className="text-xs text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {stop.location.address}
                        {stop.location.travelTimeFromPreviousMinutes && (
                          <span className="ml-2 text-[10px]">
                            (+{stop.location.travelTimeFromPreviousMinutes} min
                            desde anterior)
                          </span>
                        )}
                      </p>
                    )}
                    {stop.details?.averageSpendPerPerson && (
                      <p className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">
                          €{stop.details.averageSpendPerPerson.toFixed(0)}
                        </span>
                        <span className="ml-1">por persona</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.isArray(stop.details.vibes) &&
                        stop.details.vibes.slice(0, 3).map((vibe, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {vibe}
                          </Badge>
                        ))}
                    </div>
                    {isExpanded && stop.selectionReasons.length > 0 && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <p className="font-semibold mb-1">
                          ¿Por qué este lugar?
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {stop.selectionReasons
                            .slice(0, 3)
                            .map((reason, i) => (
                              <li key={i} className="text-muted-foreground">
                                {reason}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
          : plan.stops.slice(0, isExpanded ? undefined : 3).map((stop, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {idx + 1}
                  </div>
                  {idx <
                    (isExpanded
                      ? plan.stops.length - 1
                      : Math.min(2, plan.stops.length - 1)) && (
                    <div className="w-0.5 h-full bg-primary/20 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {stop.place?.name || stop.name || "Unknown Place"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stop.activity || "Activity"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {stop.startTime || "Time"}
                    </Badge>
                  </div>
                  {(stop.place?.address || stop.location?.address) && (
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {stop.place?.address || stop.location?.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Expand/Collapse */}
      {(plan.stopsDetailed || plan.stops).length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mb-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver {(plan.stopsDetailed || plan.stops).length - 3} más
            </>
          )}
        </Button>
      )}

      {/* Final Recommendations */}
      {isExpanded &&
        plan.finalRecommendations &&
        plan.finalRecommendations.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded">
            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recomendaciones
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {plan.finalRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Actions */}
      {isDraft && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 shadow-md"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save to My Plans"}
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
            {onDiscard && (
              <Button
                onClick={handleDiscard}
                variant="ghost"
                size="lg"
                className="sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center px-2">
            💡 <span className="font-medium">Tip:</span> Don't like something?
            Just tell me what to change (e.g., "replace the second stop with a
            quieter bar")
          </div>
        </div>
      )}

      {/* Metrics */}
      {plan.summary?.metrics && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            {plan.summary.metrics.vibeMatchPercent && (
              <div>
                <p className="text-2xl font-bold text-primary">
                  {plan.summary.metrics.vibeMatchPercent}%
                </p>
                <p className="text-xs text-muted-foreground">Match de vibe</p>
              </div>
            )}
            {plan.summary.metrics.averageVenueRating && (
              <div>
                <p className="text-2xl font-bold text-primary">
                  {plan.summary.metrics.averageVenueRating.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Rating promedio</p>
              </div>
            )}
            {plan.summary.metrics.successProbabilityLabel && (
              <div>
                <p className="text-sm font-bold text-primary uppercase">
                  {plan.summary.metrics.successProbabilityLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  Probabilidad de éxito
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
