import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  Navigation,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Star,
  Euro,
  TrendingUp,
  Phone,
  ExternalLink,
} from "lucide-react";
import { EveningPlan, PlanStop } from "@/types/place";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";

const IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";

interface PlanDrawerProps {
  plan: EveningPlan | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: "push" | "overlay";
}

export const PlanDrawer = ({
  plan,
  isOpen,
  onClose,
  variant = "overlay",
}: PlanDrawerProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [selectedStop, setSelectedStop] = useState<number>(0);

  // Prevent body scroll when drawer is open (only on mobile)
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!plan) return null;

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return "€€";
    return "€".repeat(level);
  };

  const getPlaceImage = (stop: PlanStop) => {
    if (stop.place?.images && stop.place.images.length > 0) {
      return stop.place.images[0];
    }
    return IMAGE_PLACEHOLDER;
  };

  return (
    <>
      {/* Backdrop - for mobile or overlay variant */}
      {(isMobile || variant === "overlay") && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-500 ease-out",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
          style={{ zIndex: Z_INDEX.DRAWER_BACKDROP }}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed bg-background overflow-y-auto shadow-2xl",
          // Mobile: bottom drawer
          isMobile && [
            "inset-x-0 bottom-0 rounded-t-2xl",
            "transition-transform duration-500 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full",
          ],
          // Desktop: right drawer (50% width)
          !isMobile && [
            "top-0 right-0 h-full w-1/2",
            "transition-transform duration-700",
            isOpen ? "translate-x-0" : "translate-x-full",
          ]
        )}
        style={{
          maxHeight: isMobile ? "90vh" : "100vh",
          transitionTimingFunction: !isMobile
            ? "cubic-bezier(0.32, 0.72, 0, 1)"
            : undefined,
          zIndex: Z_INDEX.DRAWER,
        }}
      >
        {/* Mobile Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header with close button */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              {!isMobile && <span>{t("common.back")}</span>}
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Download className="w-5 h-5" />
              </Button>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Header */}
        <div className="px-4 py-6 border-b bg-gradient-to-br from-primary/5 to-secondary/5">
          <h1 className="text-2xl font-bold mb-4">
            {plan.name || t("plan.yourItinerary")}
          </h1>

          {/* Plan Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("plan.duration")}
                </p>
                <p className="font-semibold">
                  {formatDuration(plan.totalDuration)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("plan.distance")}
                </p>
                <p className="font-semibold">
                  {plan.totalDistance
                    ? `${plan.totalDistance.toFixed(1)} km`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("plan.budget")}
                </p>
                <p className="font-semibold">
                  {plan.estimatedCost ? `€${plan.estimatedCost}` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("plan.stops")}
                </p>
                <p className="font-semibold">{plan.stops?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline - Itinerary Stops */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("plan.yourDayPlan")}
          </h2>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {plan.stops?.map((stop, index) => (
                <div key={index} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute left-3.5 top-0 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center font-bold text-xs",
                      index === selectedStop
                        ? "bg-primary text-primary-foreground scale-125"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Stop Card */}
                  <div
                    className={cn(
                      "bg-card border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg",
                      index === selectedStop && "ring-2 ring-primary shadow-xl"
                    )}
                    onClick={() => setSelectedStop(index)}
                  >
                    {/* Place Image */}
                    {stop.place && (
                      <div className="relative h-40 bg-muted overflow-hidden">
                        <img
                          src={getPlaceImage(stop)}
                          alt={stop.place.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay badges */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          {stop.place.rating && (
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-semibold text-white">
                                {stop.place.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {stop.place.priceLevel && (
                            <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                              <span className="text-xs font-semibold text-white">
                                {getPriceLevel(stop.place.priceLevel)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {stop.time || "TBD"}
                        </span>
                        {stop.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(stop.duration)}</span>
                          </>
                        )}
                      </div>

                      {/* Place Name */}
                      <h3 className="font-bold text-lg mb-2">
                        {stop.place?.name || stop.placeName || "Stop"}
                      </h3>

                      {/* Tags/Categories */}
                      {stop.place && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {stop.place.category && (
                            <Badge
                              variant="secondary"
                              className="capitalize text-xs"
                            >
                              {stop.place.category}
                            </Badge>
                          )}
                          {stop.place.vibe?.slice(0, 2).map((vibe) => (
                            <Badge
                              key={vibe}
                              variant="outline"
                              className="capitalize text-xs"
                            >
                              {vibe}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      {stop.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {stop.description}
                        </p>
                      )}

                      {/* Location */}
                      {(stop.place?.address || stop.place?.neighborhood) && (
                        <div className="flex items-start gap-2 text-sm mb-3">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span className="text-muted-foreground">
                            {stop.place?.address || stop.place?.neighborhood}
                          </span>
                        </div>
                      )}

                      {/* Additional Info Row */}
                      {stop.place && (
                        <div className="flex items-center gap-4 pt-3 border-t text-xs text-muted-foreground">
                          {stop.place.reviewCount && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>
                                {stop.place.reviewCount} {t("place.reviews")}
                              </span>
                            </div>
                          )}
                          {stop.place.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{t("place.bookable")}</span>
                            </div>
                          )}
                          {stop.place.openNow !== undefined && (
                            <div className="flex items-center gap-1">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  stop.place.openNow
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                )}
                              />
                              <span>
                                {stop.place.openNow
                                  ? t("place.open")
                                  : t("place.closed")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Actions */}
                      {stop.place && (
                        <div className="flex gap-2 mt-3">
                          {stop.place.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              asChild
                            >
                              <a
                                href={stop.place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {t("place.website")}
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {t("place.directions")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {plan.recommendations && plan.recommendations.length > 0 && (
          <div className="px-4 py-6 border-t bg-muted/30">
            <h3 className="font-semibold mb-3">
              💡 {t("plan.recommendations")}
            </h3>
            <ul className="space-y-2">
              {plan.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="sticky bottom-0 bg-background border-t px-4 py-4">
          <Button className="w-full gradient-auphere text-white font-medium">
            {t("plan.savePlan")}
          </Button>
        </div>
      </div>
    </>
  );
};
