import { useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlans, useDeletePlan } from "@/api-queries/query/plans.query";
import { EveningPlan } from "@/types/place";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PlanDrawer } from "@/components/new-ui/PlanDrawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PlanState = "all" | "saved" | "draft" | "completed";

const Plans = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState<PlanState>("all");
  const [selectedPlan, setSelectedPlan] = useState<EveningPlan | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch plans based on active tab
  const filterState = activeTab === "all" ? undefined : activeTab;
  const { data: plans = [], isLoading } = usePlans(userId, filterState);
  const { mutateAsync: deletePlan } = useDeletePlan(userId);

  const handlePlanClick = (plan: EveningPlan) => {
    setSelectedPlan(plan);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    navigate(`/chat?editPlan=${planId}`);
  };

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (confirm(t("plan.deleteConfirm"))) {
      try {
        await deletePlan(planId);
        toast.success(t("plan.deleted"));
      } catch (error) {
        toast.error(t("plan.deleteError"));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D511FD]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-[#8A43E1]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-20 w-[450px] h-[450px] bg-[#EF7B16]/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-auphere-text mb-4">
              {t("plan.myPlans")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("plan.description")}
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as PlanState)}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-4 md:flex h-11 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg">
                    {t("plan.all")}
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="rounded-lg">
                    {t("plan.saved")}
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="rounded-lg">
                    {t("plan.drafts")}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-lg">
                    {t("plan.done")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                onClick={() => navigate("/chat")}
                className="gradient-auphere text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("plan.createNewPlan")}
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[200px] rounded-2xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  onClick={() => handlePlanClick(plan)}
                  className="group relative bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <Badge
                        variant={
                          plan.state === "completed"
                            ? "default"
                            : plan.state === "draft"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {plan.state || "Saved"}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                      {plan.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {plan.summary?.totalDuration ||
                              (plan.totalDuration
                                ? `${Math.floor(plan.totalDuration / 60)}h ${
                                    plan.totalDuration % 60
                                  }m`
                                : "—")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{plan.stops?.length || 0} stops</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => handleEdit(e, plan.id)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => handleDelete(e, plan.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Sparkles className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("plan.noPlansFound")}
              </h3>
              <p className="text-muted-foreground max-w-sm mb-8">
                {activeTab === "all"
                  ? t("plan.noPlansYet")
                  : activeTab === "draft"
                  ? t("plan.noDraftPlans")
                  : activeTab === "saved"
                  ? t("plan.noSavedPlans")
                  : t("plan.noCompletedPlans")}
              </p>
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                className="gradient-auphere text-white rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t("plan.buildFirstPlan")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Plan Details Drawer */}
      <PlanDrawer
        plan={selectedPlan}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        variant="overlay"
      />
    </div>
  );
};

export default Plans;
