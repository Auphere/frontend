import { Place } from "@/types/place";
import { PlaceCard } from "@/components/PlaceCard";

interface RecommendedPlacesProps {
  places: Place[];
  currentPlaceId: string;
}

export const RecommendedPlaces = ({ places, currentPlaceId }: RecommendedPlacesProps) => {
  // Filter out current place and limit to 4
  const recommendations = places
    .filter(p => p.id !== currentPlaceId)
    .slice(0, 4);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-space-grotesk font-bold mb-4 sm:mb-6 px-3 sm:px-4 lg:px-6">
          You Might Also Like
        </h2>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 px-3 -mx-3 scrollbar-hide">
            {recommendations.map((place) => (
              <div key={place.id} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start first:ml-3 last:mr-3">
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-6">
          {recommendations.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
};
