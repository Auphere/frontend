import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PlaceCard } from "@/components/PlaceCard";
import { FilterBar } from "@/components/FilterBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import {
  PlaceCategory,
  PlaceVibe,
  Place,
  CrowdLevel,
  Review,
} from "@/types/place";
import {
  useInfinitePlaces,
  useGeolocation,
} from "@/api-queries/query/places.query";
import {
  CategoryEnum,
  VibeEnum,
  Place as APIPlace,
  PlacePhotoResponse,
  PlaceReviewResponse,
} from "@/api-queries/types/places.types";
import { config } from "@/lib/config";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
const VALID_VIBES: PlaceVibe[] = [
  "romantic",
  "casual",
  "energetic",
  "chill",
  "sophisticated",
  "fun",
];

const generateReviewId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Helper: Map API enums to frontend types
const mapCategoryToEnum = (category?: PlaceCategory): string | undefined => {
  if (!category) return undefined;
  const mapping: Record<PlaceCategory, string> = {
    restaurant: CategoryEnum.RESTAURANT,
    bar: CategoryEnum.BAR,
    club: CategoryEnum.CLUB,
    cafe: CategoryEnum.CAFE,
    lounge: CategoryEnum.LOUNGE,
    activity: CategoryEnum.ACTIVITY,
  };
  return mapping[category];
};

const mapVibeToEnum = (vibe?: PlaceVibe): string | undefined => {
  if (!vibe) return undefined;
  const mapping: Record<PlaceVibe, string> = {
    romantic: VibeEnum.ROMANTIC,
    casual: VibeEnum.CASUAL,
    energetic: VibeEnum.ENERGETIC,
    chill: VibeEnum.CHILL,
    sophisticated: VibeEnum.SOPHISTICATED,
    fun: VibeEnum.FUN,
  };
  return mapping[vibe];
};

const toArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : String(item)))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
};

const isPlaceVibe = (value: string): value is PlaceVibe =>
  VALID_VIBES.includes(value as PlaceVibe);

const mapTypesToCategory = (types: string[] = []): PlaceCategory => {
  const normalized = types.map((t) => t.toLowerCase());
  if (normalized.find((t) => t.includes("bar"))) return "bar";
  if (normalized.find((t) => t.includes("night") || t.includes("club")))
    return "club";
  if (normalized.find((t) => t.includes("cafe") || t.includes("coffee")))
    return "cafe";
  if (normalized.find((t) => t.includes("lounge"))) return "lounge";
  if (normalized.find((t) => t.includes("activity"))) return "activity";
  return "restaurant";
};

const mapOccupancyToCrowd = (value?: string): CrowdLevel => {
  if (!value) return "moderate";
  const normalized = value.toLowerCase();
  const mapping: Record<string, CrowdLevel> = {
    empty: "empty",
    quiet: "quiet",
    low: "quiet",
    moderate: "moderate",
    medium: "moderate",
    busy: "busy",
    high: "busy",
    packed: "packed",
    full: "packed",
  };
  return mapping[normalized] ?? "moderate";
};

const mapPhotos = (
  customAttributes?: APIPlace["customAttributes"]
): string[] => {
  if (!customAttributes) return [];

  const photos = Array.isArray(customAttributes.photos)
    ? (customAttributes.photos as PlacePhotoResponse[])
    : [];

  const fromList = photos
    .map((photo) => photo.photoUrl || photo.thumbnailUrl)
    .filter((url): url is string => Boolean(url));

  const primary = customAttributes.primaryPhotoUrl as string | undefined;
  const combined = [primary, ...fromList].filter(
    (url): url is string => Boolean(url)
  );

  return combined;
};

const mapReviews = (
  customAttributes?: APIPlace["customAttributes"]
): Review[] | undefined => {
  if (!customAttributes || !Array.isArray(customAttributes.reviews)) {
    return undefined;
  }

  const reviews = customAttributes.reviews as PlaceReviewResponse[];

  const normalized = reviews
    .map((review) => ({
      id: review.id || review.sourceId || generateReviewId(),
      author: review.author || "Anonymous",
      rating: review.rating || 0,
      comment: review.text || "",
      date: review.postedAt || "",
    }))
    .filter((review) => review.comment);

  return normalized.length ? normalized : undefined;
};

// Helper: Transform API Place to frontend Place
const transformAPIPlace = (apiPlace: APIPlace): Place => {
  const customAttributes = apiPlace.customAttributes ?? {};
  const vibeSources = [
    ...toArray(customAttributes.vibes),
    ...toArray(customAttributes?.tags?.vibes),
    ...toArray(customAttributes.vibeDescriptor),
  ];

  const vibes = vibeSources
    .map((v) => v.toLowerCase())
    .filter((v): v is PlaceVibe => isPlaceVibe(v));

  const images = mapPhotos(customAttributes);
  if (!images.length) {
    images.push(FALLBACK_IMAGE);
  }

  const neighborhood =
    customAttributes.district ||
    apiPlace.vicinity ||
    customAttributes.city ||
    "Zaragoza";

  const priceLevel = apiPlace.priceLevel
    ? (Math.max(1, Math.min(4, apiPlace.priceLevel)) as 1 | 2 | 3 | 4)
    : 2;

  return {
    id: apiPlace.placeId,
    name: apiPlace.name,
    category: mapTypesToCategory(apiPlace.types),
    description: apiPlace.formattedAddress || neighborhood || "",
    vibe: vibes.length ? vibes : ["casual"],
    crowdLevel: mapOccupancyToCrowd(
      customAttributes.occupancy as string | undefined
    ),
    musicType:
      (customAttributes.tags?.music as string | undefined) || "ambient",
    priceLevel,
    rating: apiPlace.rating || 0,
    reviewCount: apiPlace.userRatingsTotal || 0,
    address: apiPlace.formattedAddress || apiPlace.vicinity || neighborhood,
    neighborhood,
    distance: apiPlace.distanceKm,
    openNow: apiPlace.isOpen ?? true,
    openingHours: undefined,
    images,
    features: Array.isArray(customAttributes.tags?.features)
      ? (customAttributes.tags.features as string[])
      : [],
    currentStatus: customAttributes.city
      ? `${customAttributes.city}${
          customAttributes.district ? ` • ${customAttributes.district}` : ""
        }`
      : undefined,
    reviews: mapReviews(customAttributes),
    phone: apiPlace.phoneNumber,
    website: apiPlace.website,
  };
};

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    PlaceCategory | undefined
  >();
  const [selectedVibe, setSelectedVibe] = useState<PlaceVibe | undefined>();

  // Get user's geolocation
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Build filters for API
  const categoryEnum = mapCategoryToEnum(selectedCategory);
  const vibeEnum = mapVibeToEnum(selectedVibe);

  const defaultCity = config.defaultCity;

  // Fetch places with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePlaces({
    query: searchQuery || undefined,
    categories: categoryEnum ? [categoryEnum] : undefined,
    vibes: vibeEnum ? [vibeEnum] : undefined,
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
    radius: 5000,
    city: defaultCity,
  });

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Transform all API places to frontend format
  const allPlaces: Place[] =
    data?.pages.flatMap((page) => page.places.map(transformAPIPlace)) ?? [];

  const totalCount = data?.pages[0]?.total || 0;

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedVibe(undefined);
    setSearchQuery("");
  };

  // Get location name (city)
  const locationName = coordinates
    ? "your location"
    : defaultCity || "Zaragoza"; // TODO: Reverse geocode to get city name

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-14 sm:pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 bg-gradient-to-b from-background to-card/30">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold mb-2 sm:mb-3 lg:mb-4">
                Explore <span className="gradient-text">Places</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Discover the perfect place for any moment
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 pr-3 sm:pr-4 h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-4 sm:py-6 lg:py-12 px-3 sm:px-4 lg:px-6">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-16 sm:top-18 lg:top-24 bg-card/50 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                  <FilterBar
                    selectedCategory={selectedCategory}
                    selectedVibe={selectedVibe}
                    onCategoryChange={setSelectedCategory}
                    onVibeChange={setSelectedVibe}
                    onClearFilters={handleClearFilters}
                  />

                  {/* Location Info */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Near you</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {locationLoading ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Getting location...
                        </span>
                      ) : locationError ? (
                        "Location unavailable - showing all places"
                      ) : (
                        `Showing places near ${locationName}`
                      )}
                    </p>
                  </div>
                </div>
              </aside>

              {/* Places Grid */}
              <div className="lg:col-span-3">
                {/* Results Header */}
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-space-grotesk font-bold">
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <>
                        {totalCount} {totalCount === 1 ? "Place" : "Places"}{" "}
                        Found
                      </>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                    {selectedCategory || selectedVibe
                      ? "Filtered results"
                      : "All places"}
                  </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading places...</p>
                  </div>
                )}

                {/* Error State */}
                {isError && (
                  <div className="text-center py-12">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                      ⚠️
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-space-grotesk font-semibold mb-1 sm:mb-2">
                      Error loading places
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                      Please try again later
                    </p>
                  </div>
                )}

                {/* Places Grid */}
                {!isLoading && !isError && allPlaces.length > 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      {allPlaces.map((place) => (
                        <PlaceCard key={place.id} place={place} />
                      ))}
                    </div>

                    {/* Load More Trigger */}
                    <div ref={ref} className="py-4 sm:py-6 text-center">
                      {isFetchingNextPage && (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Loading more...
                          </span>
                        </div>
                      )}
                      {!hasNextPage && allPlaces.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          No more places to load
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!isLoading && !isError && allPlaces.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                      🔍
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-space-grotesk font-semibold mb-1 sm:mb-2">
                      No places found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                      Try adjusting your filters or search query
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="h-10 sm:h-11"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
