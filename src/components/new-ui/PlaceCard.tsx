import { Place } from "@/types/place";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

const priceLevelText = (level: number) => "€".repeat(level);
const IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

export const PlaceCard = ({ place, onClick }: PlaceCardProps) => {
  // Get the first image, or use primary photo from custom attributes, or fallback
  const heroImage =
    place.images?.[0] ||
    (place as any).customAttributes?.primaryPhotoUrl ||
    (place as any).customAttributes?.primary_photo_url ||
    IMAGE_PLACEHOLDER;

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 bg-card"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={heroImage}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Action buttons on image */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle save/favorite
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle add to plan
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Info button */}
        <button
          className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            // Could show quick info
          }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base line-clamp-1 flex-1">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-sm">{place.rating}</span>
            <span className="text-xs text-muted-foreground">
              (
              {place.reviewCount && place.reviewCount > 1000
                ? `${(place.reviewCount / 1000).toFixed(1)}k`
                : place.reviewCount}
              )
            </span>
          </div>
        </div>

        {/* Category and location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="capitalize">{place.category}</span>
          <span>•</span>
          <span className="truncate">{place.neighborhood}</span>
          <span>•</span>
          <span className="font-semibold text-primary">
            {priceLevelText(place.priceLevel)}
          </span>
          {place.distance && (
            <>
              <span>•</span>
              <span>{place.distance.toFixed(1)}km</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
