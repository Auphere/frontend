import { EveningPlan } from "@/types/place";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Share2, Edit, MapPin, Clock, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SharePlanDialog } from "@/components/SharePlanDialog";
import { toast } from "sonner";

interface PlanPreviewProps {
  plan: EveningPlan;
}

export const PlanPreview = ({ plan }: PlanPreviewProps) => {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleSavePlan = () => {
    // In real app, save to backend
    toast.success("Plan guardado exitosamente");
    setTimeout(() => navigate("/planner"), 500);
  };

  const handleModifyPlan = () => {
    toast.info("Función de edición próximamente");
  };

  return (
    <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-space-grotesk font-bold text-base sm:text-lg mb-1">
            {plan.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {plan.description}
          </p>
        </div>
        <Badge className="capitalize">{plan.vibe}</Badge>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{plan.totalDuration} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{plan.totalDistance} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{plan.stops.length} paradas</span>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="space-y-3 mb-4">
        {plan.stops.map((stop, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{idx + 1}</span>
              </div>
              {idx < plan.stops.length - 1 && (
                <div className="w-0.5 h-full bg-border my-1" />
              )}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  {stop.startTime}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{stop.duration} min</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-sm mb-0.5">
                {stop.place.name}
              </h4>
              <p className="text-xs text-muted-foreground">{stop.activity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSavePlan} className="flex-1 gap-2 h-9 text-xs sm:text-sm">
          <Save className="w-4 h-4" />
          Guardar Plan
        </Button>
        <Button
          variant="outline"
          onClick={() => setShareDialogOpen(true)}
          className="gap-2 h-9 text-xs sm:text-sm"
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>
        <Button
          variant="outline"
          onClick={handleModifyPlan}
          className="gap-2 h-9 text-xs sm:text-sm"
        >
          <Edit className="w-4 h-4" />
          Modificar
        </Button>
      </div>

      <SharePlanDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        planName={plan.name}
        planId={plan.id}
      />
    </Card>
  );
};
