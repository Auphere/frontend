import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight,
  Calendar,
  Users,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";
import { BetaBadge } from "@/components/BetaBadge";
import { SharePlanDialog } from "@/components/SharePlanDialog";
import { usePlans } from "@/api-queries/query/plans.query";
import { useAuth } from "@/contexts/AuthContext";

const Planner = () => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;
  const { data: plans = [], isLoading } = usePlans(userId);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
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

            {/* Plan Type Selector or Empty State */}
            <div className="max-w-4xl mx-auto">
              {authLoading || isLoading ? (
                <Card className="p-8 sm:p-12 text-center bg-card/50 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">Cargando tus planes...</p>
                </Card>
              ) : hasPlans ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 active:scale-98 ${
                        selectedPlanId === plan.id
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      <h3 className="font-space-grotesk font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{Math.round(plan.totalDuration / 60)}h</span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{plan.totalDistance}km</span>
                        </div>
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
                      No Plans Yet
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                      You haven't created any plans yet. Start by chatting with our AI to create your first personalized evening plan.
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
            </div>
          </div>
        </section>

        {/* Selected Plan Details - Only show if there are plans */}
        {hasPlans && selectedPlan && (
        <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
          <div className="container mx-auto max-w-4xl">
            {/* Plan Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-space-grotesk font-bold mb-2">
                    {selectedPlan.name}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{selectedPlan.description}</p>
                </div>
                <Badge className="capitalize bg-primary text-primary-foreground text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2 w-fit">
                  {selectedPlan.vibe}
                </Badge>
              </div>

              {/* Plan Stats */}
              <div className="flex flex-wrap gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="text-xs sm:text-sm">
                    <strong>{Math.round(selectedPlan.totalDuration / 60)} hours</strong> total duration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="text-xs sm:text-sm">
                    <strong>{selectedPlan.totalDistance} km</strong> total distance
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="text-xs sm:text-sm">
                    <strong>{selectedPlan.stops.length} stops</strong> planned
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 sm:space-y-6">
              {selectedPlan.stops.map((stop, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < selectedPlan.stops.length - 1 && (
                    <div className="absolute left-6 sm:left-8 top-20 sm:top-24 bottom-0 w-0.5 bg-border" />
                  )}

                  <Card className="relative bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                    <div className="p-4 sm:p-6">
                      {/* Stop Number & Time */}
                      <div className="flex items-start gap-3 sm:gap-6 mb-4">
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-space-grotesk font-bold text-xl sm:text-2xl shadow-lg">
                            {index + 1}
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-xs sm:text-sm font-semibold">{stop.startTime}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">
                              {stop.duration} min
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Activity */}
                          <div className="mb-3">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {stop.activity}
                            </Badge>
                            <h3 className="text-lg sm:text-2xl font-space-grotesk font-bold break-words">
                              {stop.place.name}
                            </h3>
                          </div>

                          {/* Place Details */}
                          <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 mb-4">
                            <div>
                              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Category</div>
                              <Badge className="capitalize text-xs">{stop.place.category || "place"}</Badge>
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Vibe</div>
                              <div className="flex flex-wrap gap-1">
                                {(stop.place.vibe || ["casual"]).map((v: string) => (
                                  <Badge key={v} variant="outline" className="capitalize text-xs">
                                    {v}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{stop.place.address}</span>
                          </div>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 break-words">
                            {stop.place.description}
                          </p>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Link to={`/place/${stop.place.id}`} className="w-full sm:w-auto">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                                View Details
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Arrow between stops */}
                  {index < selectedPlan.stops.length - 1 && (
                    <div className="flex items-center justify-center py-3 sm:py-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {Math.round(
                            (((selectedPlan.stops[index + 1].place?.distance as number) || 0) + 
                            ((stop.place?.distance as number) || 0)) / 2
                          )} min walk
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 sm:px-8 w-full sm:w-auto"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Invite Friends
              </Button>
              <Button size="lg" variant="outline" className="px-6 sm:px-8 w-full sm:w-auto">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Generate New Plan
              </Button>
            </div>

            {/* Customization Note */}
            <Card className="mt-6 sm:mt-8 p-4 sm:p-6 bg-primary/10 border-primary/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Want a custom plan?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 break-words">
                    Chat with our AI to create a personalized evening plan based on your specific preferences, group size, and mood.
                  </p>
                  <Link to="/chat">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      Chat with AI
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
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
