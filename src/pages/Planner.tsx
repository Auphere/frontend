import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight,
  Calendar,
  Users,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BetaBadge } from "@/components/BetaBadge";
import { SharePlanDialog } from "@/components/SharePlanDialog";
import { usePlans, useDeletePlan } from "@/api-queries/query/plans.query";
import { useAuth } from "@/contexts/AuthContext";
import { PlanPreviewCard } from "@/components/chat/PlanPreviewCard";
import { toast } from "sonner";

type PlanState = "all" | "saved" | "draft" | "completed";

const Planner = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;
  
  const [activeTab, setActiveTab] = useState<PlanState>("all");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Fetch plans based on active tab
  const filterState = activeTab === "all" ? undefined : activeTab;
  const { data: plans = [], isLoading } = usePlans(userId, filterState);
  const { mutateAsync: deletePlan } = useDeletePlan(userId);
  
  useEffect(() => {
    if (!plans.length) {
      setSelectedPlanId(null);
      return;
    }
    setSelectedPlanId((prev) => {
      if (prev && plans.some((plan) => plan.id === prev)) {
        return prev;
      }
      return plans[0].id;
    });
  }, [plans]);
  
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );
  
  const hasPlans = plans.length > 0;

  const handleEdit = (planId: string) => {
    // Navigate to chat with plan context for editing
    navigate(`/chat?editPlan=${planId}`);
  };

  const handleDelete = async (planId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este plan?")) {
      try {
        await deletePlan(planId);
        toast.success("Plan eliminado exitosamente");
        if (selectedPlanId === planId) {
          setSelectedPlanId(null);
        }
      } catch (error) {
        toast.error("Error al eliminar el plan");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-14 sm:pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 bg-gradient-to-b from-background to-card/30">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold">
                  My <span className="gradient-text">Plans</span>
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Create, save, and share your perfect evening plans with friends
              </p>
            </div>

            {/* Tabs for filtering */}
            <div className="max-w-4xl mx-auto">
              {authLoading || isLoading ? (
                <Card className="p-8 sm:p-12 text-center bg-card/50 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">Cargando tus planes...</p>
                </Card>
              ) : (
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as PlanState)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="saved">Guardados</TabsTrigger>
                    <TabsTrigger value="draft">Borradores</TabsTrigger>
                    <TabsTrigger value="completed">Completados</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0">
                    {hasPlans ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {plans.map((plan) => (
                          <Card
                            key={plan.id}
                            className={`p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedPlanId === plan.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedPlanId(plan.id)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-space-grotesk font-bold text-base sm:text-lg flex-1">
                                {plan.name}
                              </h3>
                              {plan.state && (
                                <Badge
                                  variant={
                                    plan.state === "completed"
                                      ? "default"
                                      : plan.state === "draft"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs shrink-0"
                                >
                                  {plan.state}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                              {plan.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {plan.summary?.totalDuration ||
                                    (plan.totalDuration
                                      ? `${Math.floor(plan.totalDuration / 60)}h ${plan.totalDuration % 60}m`
                                      : "—")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{plan.stops.length} paradas</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(plan.id);
                                }}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(plan.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 sm:p-12 text-center bg-card/50 backdrop-blur-sm">
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-space-grotesk font-bold mb-3">
                            {activeTab === "all"
                              ? "No Plans Yet"
                              : activeTab === "draft"
                              ? "No Drafts"
                              : activeTab === "completed"
                              ? "No Completed Plans"
                              : "No Saved Plans"}
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground mb-6">
                            {activeTab === "all"
                              ? "You haven't created any plans yet. Start by chatting with our AI to create your first personalized evening plan."
                              : `You don't have any ${activeTab} plans yet.`}
                          </p>
                          <Link to="/chat">
                            <Button size="lg" className="px-6 sm:px-8">
                              <Sparkles className="w-5 h-5 mr-2" />
                              Create Your First Plan
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </section>

        {/* Selected Plan Details - Only show if there are plans */}
        {hasPlans && selectedPlan && (
        <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
          <div className="container mx-auto max-w-4xl">
            <PlanPreviewCard
              plan={selectedPlan}
              isDraft={selectedPlan.state === "draft"}
              onEdit={(plan) => handleEdit(plan.id)}
            />
          </div>
        </section>
        )}
      </main>

      <Footer />
      <BetaBadge />
      
      <SharePlanDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        planName={selectedPlan?.name || "Plan"}
        planId={selectedPlan?.id || ""}
      />
    </div>
  );
};

export default Planner;
