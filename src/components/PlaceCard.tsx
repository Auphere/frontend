import { Place } from "@/types/place";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Music, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceCardProps {
  place: Place;
}

const crowdLevelColors = {
  empty: "bg-success/20 text-success",
  quiet: "bg-success/30 text-success",
  moderate: "bg-warning/20 text-warning",
  busy: "bg-warning/30 text-warning",
  packed: "bg-destructive/20 text-destructive",
};

const priceLevelText = (level: number) => "€".repeat(level);
const IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

export const PlaceCard = ({ place }: PlaceCardProps) => {
  const heroImage = place.images?.[0] || IMAGE_PLACEHOLDER;
  return (
    <Link to={`/place/${place.id}`}>
      <Card className="group h-full overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer bg-card/80 backdrop-blur-sm">
        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={heroImage}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          {/* Status Badge */}
          {place.currentStatus && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs text-foreground/90 line-clamp-2">
                {place.currentStatus}
              </div>
            </div>
          )}

          {/* Category Badge */}
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground capitalize text-xs">
            {place.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 flex flex-col">
          {/* Header */}
          <div className="mb-2">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-space-grotesk font-bold text-base sm:text-xl group-hover:text-primary transition-colors line-clamp-2 flex-1 break-words">
                {place.name}
              </h3>
              <div className="flex items-center gap-0.5 sm:gap-1 bg-muted/50 px-1.5 sm:px-2 py-1 rounded-lg flex-shrink-0">
                <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-primary text-primary flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  {place.rating}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  ({place.reviewCount})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
              <span className="truncate">{place.neighborhood}</span>
              {place.distance && (
                <>
                  <span>•</span>
                  <span>{place.distance}km</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 break-words">
            {place.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {place.vibe.slice(0, 2).map((v) => (
              <Badge
                key={v}
                variant="outline"
                className="text-[10px] sm:text-xs capitalize"
              >
                {v}
              </Badge>
            ))}
          </div>

          {/* Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0 text-muted-foreground" />
                <span
                  className={`font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs capitalize ${
                    crowdLevelColors[place.crowdLevel]
                  }`}
                >
                  {place.crowdLevel}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0 text-muted-foreground" />
                <span className="capitalize text-muted-foreground truncate">
                  {place.musicType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-primary">
                {priceLevelText(place.priceLevel)}
              </span>
              {place.openNow && (
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-xs text-success border-success/30"
                >
                  Open
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
