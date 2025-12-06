/**
 * Example: How to use the Places API hooks
 * This demonstrates infinite scroll, geolocation, and filtering
 */

import {
  useInfinitePlaces,
  useGeolocation,
} from "@/api-queries/query/places.query";
import { CategoryEnum, VibeEnum } from "@/api-queries/types/places.types";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";

export function ExplorePageExample() {
  // Get user's location
  const { coordinates, loading: locationLoading } = useGeolocation();

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<CategoryEnum[]>(
    []
  );
  const [selectedVibes, setSelectedVibes] = useState<VibeEnum[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Infinite query for places
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePlaces({
    query: searchQuery,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    vibes: selectedVibes.length > 0 ? selectedVibes : undefined,
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
    radius: 5000,
    perPage: 20,
    city: config.defaultCity,
  });

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView();

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array
  const allPlaces = data?.pages.flatMap((page) => page.places) ?? [];

  if (locationLoading) {
    return <div>Getting your location...</div>;
  }

  if (isLoading) {
    return <div>Loading places...</div>;
  }

  if (isError) {
    return <div>Error loading places</div>;
  }

  return (
    <div className="container mx-auto">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search places..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 border rounded-lg"
      />

      {/* Filters */}
      <div className="my-4 space-y-4">
        {/* Category Filters */}
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.values(CategoryEnum).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategories((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  );
                }}
                className={
                  selectedCategories.includes(category)
                    ? "bg-blue-500 text-white px-4 py-2 rounded-full"
                    : "bg-gray-200 px-4 py-2 rounded-full"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Filters */}
        <div>
          <h3 className="font-semibold mb-2">Vibe</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.values(VibeEnum).map((vibe) => (
              <button
                key={vibe}
                onClick={() => {
                  setSelectedVibes((prev) =>
                    prev.includes(vibe)
                      ? prev.filter((v) => v !== vibe)
                      : [...prev, vibe]
                  );
                }}
                className={
                  selectedVibes.includes(vibe)
                    ? "bg-purple-500 text-white px-4 py-2 rounded-full"
                    : "bg-gray-200 px-4 py-2 rounded-full"
                }
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="my-4">
        <p className="text-gray-600">
          {data?.pages[0]?.total || 0} places found
        </p>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPlaces.map((place) => (
          <div key={place.placeId} className="border rounded-lg p-4">
            <h3 className="font-bold text-lg">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.vicinity}</p>

            {place.rating && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">★</span>
                <span>{place.rating}</span>
                {place.userRatingsTotal && (
                  <span className="text-sm text-gray-500">
                    ({place.userRatingsTotal})
                  </span>
                )}
              </div>
            )}

            {place.distanceKm && (
              <p className="text-sm text-gray-500 mt-1">
                {place.distanceKm}km away
              </p>
            )}

            {place.types.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {place.types.slice(0, 3).map((type) => (
                  <span
                    key={type}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage && <p>Loading more...</p>}
        {!hasNextPage && allPlaces.length > 0 && (
          <p className="text-gray-500">No more places to load</p>
        )}
      </div>
    </div>
  );
}
