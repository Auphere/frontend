import { Place } from "@/types/place";
import { Link } from "react-router-dom";
import { Star, MapPin, Heart, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

interface ChatPlaceCardProps {
  place: Place;
}

export const ChatPlaceCard = ({ place }: ChatPlaceCardProps) => {
  const { addPlaceToPlan, planPlaces } = usePlan();
  const isInPlan = planPlaces.some((p) => p.id === place.id);

  const handleAddToPlan = (e: React.MouseEvent) => {
    e.preventDefault();
    addPlaceToPlan(place);
    toast.success(`${place.name} agregado al plan`);
  };

  const handleSaveToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    // In real app, save to backend
    toast.success(`${place.name} guardado en favoritos`);
  };

  const crowdLevelColors = {
    empty: "bg-green-500/20 text-green-700 dark:text-green-300",
    quiet: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    moderate: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    busy: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    packed: "bg-red-500/20 text-red-700 dark:text-red-300",
  };

  // Safe access with defaults (all data is normalized from backend)
  const imageUrl =
    place.images?.[0] ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836";
  const priceLevel = place.priceLevel || 2;
  const priceLevelText = ["€", "€€", "€€€", "€€€€"][priceLevel - 1] || "€€";
  const rating = place.rating || 0;
  const reviewCount = place.reviewCount || 0;
  const category = place.category || "place";
  // Extract neighborhood from address if not provided
  const neighborhood =
    place.neighborhood ||
    place.address?.split(",")[place.address.split(",").length - 2]?.trim() ||
    "Madrid";
  const openNow = place.openNow ?? true;
  const crowdLevel = place.crowdLevel || "moderate";
  const description = place.description || "";

  return (
    <div className="group relative bg-card/80 backdrop-blur-sm rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all">
      <Link to={`/place/${place.id || place.place_id}`} className="block">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className={openNow ? "bg-green-500/90" : "bg-red-500/90"}>
              {openNow ? "Abierto" : "Cerrado"}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-space-grotesk font-bold text-sm sm:text-base truncate">
                {place.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{neighborhood}</span>
              </div>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-xs">
                  {rating.toFixed(1)}
                </span>
                {reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {description}
            </p>
          )}

          {/* Info Row */}
          <div className="flex items-center gap-2 text-xs">
            {crowdLevel && crowdLevelColors[crowdLevel] && (
              <>
                <Badge
                  variant="outline"
                  className={crowdLevelColors[crowdLevel]}
                >
                  {crowdLevel}
                </Badge>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <span className="font-semibold">{priceLevelText}</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-3 pb-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToPlan}
          disabled={isInPlan}
          className="flex-1 gap-2 h-8 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {isInPlan ? "En el Plan" : "Agregar a Plan"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveToFavorites}
          className="gap-2 h-8 text-xs"
        >
          <Heart className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 h-8 text-xs"
        >
          <Link to={`/place/${place.id || place.place_id}`}>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
