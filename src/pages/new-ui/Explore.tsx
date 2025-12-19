import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { PlaceCard } from "@/components/new-ui/PlaceCard";
import { PlaceDrawer } from "@/components/new-ui/PlaceDrawer";
import { LocationSelector } from "@/components/new-ui/LocationSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  DEFAULT_COORDINATES,
  SEARCH_CONFIG,
  FALLBACK_IMAGE,
} from "@/lib/constants";

// Fallback image is now imported from constants
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

  // Get photos from customAttributes.photos array (from Google Places API)
  const photos = Array.isArray(customAttributes.photos)
    ? (customAttributes.photos as PlacePhotoResponse[])
    : [];

  // Extract photo URLs from the photos array
  const fromList = photos
    .map((photo) => {
      // Handle both old format (photoUrl/thumbnailUrl) and new format (photo_url/thumbnail_url)
      return (
        photo.photoUrl ||
        (photo as any).photo_url ||
        photo.thumbnailUrl ||
        (photo as any).thumbnail_url
      );
    })
    .filter((url): url is string => Boolean(url));

  // Get primary photo URL (prefer primary_photo_url, fallback to primaryPhotoUrl)
  const primary =
    (customAttributes.primaryPhotoUrl as string | undefined) ||
    (customAttributes as any).primary_photo_url;

  // Combine: primary first, then rest of photos
  const combined = [primary, ...fromList].filter((url): url is string =>
    Boolean(url)
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
    .map((review) => {
      // Handle both old format and new format from Google Places API
      const text =
        review.text || (review as any).text || (review as any).comment || "";
      const author =
        review.author ||
        (review as any).author ||
        (review as any).author_name ||
        "Anonymous";
      const rating = review.rating || (review as any).rating || 0;
      const date =
        review.postedAt ||
        (review as any).posted_at ||
        (review as any).relative_time_description ||
        "";

      return {
        id: review.id || review.sourceId || generateReviewId(),
        author,
        rating: typeof rating === "number" ? rating : 0,
        comment: text,
        date,
      };
    })
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
    "Madrid";

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

// Google Places valid types
const getCategoriesConfig = (
  t: any
): { value: PlaceCategory; labelKey: string; icon?: string }[] => [
  {
    value: "restaurant",
    labelKey: "explore.categories.restaurants",
    icon: "🍽️",
  },
  { value: "cafe", labelKey: "explore.categories.cafes", icon: "☕" },
  { value: "bar", labelKey: "explore.categories.bars", icon: "🍺" },
  { value: "club", labelKey: "explore.categories.clubs", icon: "🎵" },
  { value: "lounge", labelKey: "explore.categories.lounges", icon: "🛋️" },
  { value: "activity", labelKey: "explore.categories.activities", icon: "🎯" },
];

const Explore = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  // Start with no category selected to show "For you"
  const [selectedCategory, setSelectedCategory] = useState<
    PlaceCategory | undefined
  >(undefined);
  const [selectedVibe, setSelectedVibe] = useState<PlaceVibe | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize with default city from config
  const defaultCity = config.defaultCity || "Madrid";
  const [locationName, setLocationName] = useState(defaultCity);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  }>(DEFAULT_COORDINATES.MADRID);
  const [isInitialized, setIsInitialized] = useState(false);

  const isMobile = useIsMobile();
  const CATEGORIES = getCategoriesConfig(t);

  // Ensure default city is set on mount
  useEffect(() => {
    if (!isInitialized) {
      setLocationName(defaultCity);
      setSelectedCity(defaultCity);
      setSelectedCoordinates(DEFAULT_COORDINATES.MADRID);
      setIsInitialized(true);
    }
  }, [isInitialized, defaultCity]);

  // Get user's geolocation
  const {
    coordinates: geoCoordinates,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Build filters for API
  const categoryEnum = mapCategoryToEnum(selectedCategory);
  const vibeEnum = mapVibeToEnum(selectedVibe);

  // Always use coordinates (either user's location, selected city coords, or Madrid default)
  const finalCoordinates =
    selectedCoordinates || geoCoordinates || DEFAULT_COORDINATES.MADRID;

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
    // Pass category only if selected (undefined = all categories, "For you")
    categories: categoryEnum ? [categoryEnum] : undefined,
    vibes: vibeEnum ? [vibeEnum] : undefined,
    // Always send coordinates (required by Rust service)
    latitude: finalCoordinates.latitude,
    longitude: finalCoordinates.longitude,
    radius: SEARCH_CONFIG.RADIUS_KM,
    // Send city name for reference
    city: selectedCity,
  });

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: SEARCH_CONFIG.INTERSECTION_THRESHOLD,
    rootMargin: SEARCH_CONFIG.INTERSECTION_ROOT_MARGIN,
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Transform all API places to frontend format
  const allPlaces: Place[] =
    data?.pages.flatMap((page) => page.places.map(transformAPIPlace)) ?? [];

  const totalCount = data?.pages[0]?.total || 0;

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing the place to allow animation to complete
    setTimeout(() => setSelectedPlace(null), 300);
  };

  const handleLocationChange = (
    newLocation: string,
    coords?: { lat: number; lng: number }
  ) => {
    setLocationName(newLocation);

    // Extract city name from location (e.g., "Madrid" from "Madrid, Spain")
    const cityName = newLocation.split(",")[0].trim();
    setSelectedCity(cityName);

    if (coords) {
      setSelectedCoordinates({
        latitude: coords.lat,
        longitude: coords.lng,
      });
    } else {
      // Use default Madrid coordinates if no coords provided
      setSelectedCoordinates(DEFAULT_COORDINATES.MADRID);
    }
  };

  const handleUseCurrentLocation = () => {
    // This is now handled by LocationSelector component
    // which does reverse geocoding to get the city name
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 border-b">
        <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col gap-4">
          {/* Top bar - Location */}
          <div className="flex items-center min-h-[40px]">
            {/* Indent content on mobile to avoid hamburger button (fixed top-3 left-4) */}
            <div className="w-14 md:hidden flex-shrink-0" />

            <div className="flex-1">
              <LocationSelector
                currentLocation={locationName}
                onLocationChange={handleLocationChange}
                onUseCurrentLocation={handleUseCurrentLocation}
              />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("explore.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-12 rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Badge
              variant={!selectedCategory ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-full px-4 py-2 transition-all hover:scale-105",
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
              )}
              onClick={() => setSelectedCategory(undefined)}
            >
              {t("explore.forYou")}
            </Badge>
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full px-4 py-2 transition-all hover:scale-105",
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                )}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.value ? undefined : cat.value
                  )
                }
              >
                {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                {t(cat.labelKey)}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          // Desktop: when drawer is open, reduce width
          !isMobile && isDrawerOpen && "mr-[50%]"
        )}
      >
        <div className="px-4 py-6">
          {/* Section header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              {selectedCategory ? (
                <>
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.icon}
                  {t(
                    CATEGORIES.find((c) => c.value === selectedCategory)
                      ?.labelKey || ""
                  )}
                </>
              ) : (
                t("explore.forYou")
              )}
            </h2>
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                {t(
                  `explore.placesCount_${totalCount === 1 ? "one" : "other"}`,
                  { count: totalCount }
                )}
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                {t("explore.loadingPlaces")}
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">
                {t("explore.errorLoading")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("explore.tryAgain")}
              </p>
            </div>
          )}

          {/* Places Flexbox Grid */}
          {!isLoading && !isError && allPlaces.length > 0 && (
            <>
              <div className="flex flex-wrap gap-4">
                {allPlaces.map((place) => (
                  <div
                    key={place.id}
                    className={cn(
                      "flex-shrink-0",
                      // Mobile: full width
                      "w-full",
                      // Tablet: 2 columns
                      "sm:w-[calc(50%-0.5rem)]",
                      // Desktop without drawer: 4 columns
                      !isDrawerOpen && "lg:w-[calc(25%-0.75rem)]",
                      // Desktop with drawer: 2 columns (because space is reduced)
                      isDrawerOpen && "lg:w-[calc(50%-0.5rem)]"
                    )}
                  >
                    <PlaceCard
                      place={place}
                      onClick={() => handlePlaceClick(place)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Trigger */}
              <div ref={ref} className="py-6 text-center">
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {t("explore.loadingMore")}
                    </span>
                  </div>
                )}
                {!isFetchingNextPage && hasNextPage && (
                  <Button
                    onClick={() => fetchNextPage()}
                    variant="outline"
                    className="mx-auto"
                  >
                    {t("common.loadMore")}
                  </Button>
                )}
                {!hasNextPage && allPlaces.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("explore.noMorePlaces")}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && allPlaces.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                {t("explore.noPlacesFound")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("explore.adjustFilters")}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Place Drawer */}
      <PlaceDrawer
        place={selectedPlace}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};

export default Explore;
