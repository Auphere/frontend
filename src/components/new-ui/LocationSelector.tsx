import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";
import { STORAGE_KEYS, API_LIMITS } from "@/lib/constants";

// Google Places Autocomplete
declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

interface Location {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (
    location: string,
    coordinates?: { lat: number; lng: number }
  ) => void;
  onUseCurrentLocation?: () => void;
}

const STORAGE_KEY = STORAGE_KEYS.RECENT_LOCATIONS;

// Default locations
const DEFAULT_LOCATIONS: Location[] = [
  {
    id: "madrid",
    name: "Madrid",
    subtitle: "Madrid, Spain",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop",
    coordinates: { lat: 40.4168, lng: -3.7038 },
  },
  {
    id: "zaragoza-sanjose",
    name: "San José",
    subtitle: "Zaragoza, Aragon, Spain",
    image:
      "https://images.unsplash.com/photo-1558642891-54be180ea339?w=200&h=200&fit=crop",
    coordinates: { lat: 41.6488, lng: -0.8891 },
  },
  {
    id: "zaragoza-elgancho",
    name: "El Gancho",
    subtitle: "Zaragoza, Aragon, Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&h=200&fit=crop",
    coordinates: { lat: 41.6561, lng: -0.8773 },
  },
];

// Load recent locations from localStorage
const loadRecentLocations = (): Location[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_LOCATIONS;
    }
  } catch (error) {
    console.error("Error loading recent locations:", error);
  }
  return DEFAULT_LOCATIONS;
};

// Save location to localStorage
const saveRecentLocation = (location: Location) => {
  try {
    const recent = loadRecentLocations();
    // Remove if already exists
    const filtered = recent.filter((loc) => loc.id !== location.id);
    // Add to beginning
    const updated = [location, ...filtered].slice(
      0,
      API_LIMITS.RECENT_LOCATIONS_MAX
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recent location:", error);
  }
};

export const LocationSelector = ({
  currentLocation,
  onLocationChange,
  onUseCurrentLocation,
}: LocationSelectorProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const geocoder = useRef<any>(null);

  // Load recent locations on mount
  useEffect(() => {
    setRecentLocations(loadRecentLocations());
  }, []);

  // Initialize Google Places API
  useEffect(() => {
    const initGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        // Create a dummy div for PlacesService (required by API)
        const dummyDiv = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );
        // Initialize Geocoder for reverse geocoding
        geocoder.current = new window.google.maps.Geocoder();
      }
    };

    // Load Google Places API script
    const loadGooglePlacesScript = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        console.warn("Google Places API key not found");
        return;
      }

      if (window.google && window.google.maps) {
        initGooglePlaces();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initGooglePlaces;
      document.head.appendChild(script);
    };

    loadGooglePlacesScript();
  }, []);

  // Fetch predictions when search query changes
  useEffect(() => {
    if (
      !searchQuery ||
      searchQuery.length < API_LIMITS.SEARCH_DEBOUNCE_MS / 100
    ) {
      setPredictions([]);
      return;
    }

    if (!autocompleteService.current) {
      return;
    }

    const fetchPredictions = async () => {
      try {
        autocompleteService.current.getPlacePredictions(
          {
            input: searchQuery,
            types: ["(cities)"],
            // Limit to Spain
            componentRestrictions: { country: "es" },
          },
          (predictions: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(predictions || []);
            } else {
              setPredictions([]);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      }
    };

    const timeoutId = setTimeout(
      fetchPredictions,
      API_LIMITS.SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location.name, location.coordinates);
    saveRecentLocation(location);
    setRecentLocations(loadRecentLocations());
    setIsOpen(false);
    setSearchQuery("");
    setPredictions([]);
  };

  // Handle Google Places prediction selection
  const handlePredictionSelect = (prediction: any) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["name", "geometry", "formatted_address", "photos"],
      },
      (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location: Location = {
            id: prediction.place_id,
            name: place.name || prediction.structured_formatting.main_text,
            subtitle:
              prediction.description ||
              prediction.structured_formatting.secondary_text,
            coordinates: place.geometry?.location
              ? {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
              : undefined,
            image: place.photos?.[0]?.getUrl({ maxWidth: 200, maxHeight: 200 }),
          };

          handleLocationSelect(location);
        }
      }
    );
  };

  const handleUseCurrentLocation = () => {
    setIsLoadingGeo(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get city name
          if (geocoder.current) {
            try {
              geocoder.current.geocode(
                {
                  location: { lat: latitude, lng: longitude },
                },
                (results: any, status: any) => {
                  if (status === "OK" && results && results.length > 0) {
                    // Find the city name from the results
                    let cityName = "your location";

                    for (const result of results) {
                      // Look for locality (city) in address components
                      const cityComponent = result.address_components.find(
                        (component: any) =>
                          component.types.includes("locality") ||
                          component.types.includes(
                            "administrative_area_level_2"
                          )
                      );

                      if (cityComponent) {
                        cityName = cityComponent.long_name;
                        break;
                      }
                    }

                    // Call the parent handler if provided
                    if (onUseCurrentLocation) {
                      onUseCurrentLocation();
                    }

                    onLocationChange(cityName, {
                      lat: latitude,
                      lng: longitude,
                    });
                  } else {
                    // Fallback if geocoding fails
                    if (onUseCurrentLocation) {
                      onUseCurrentLocation();
                    }
                    onLocationChange("your location", {
                      lat: latitude,
                      lng: longitude,
                    });
                  }

                  setIsOpen(false);
                  setSearchQuery("");
                  setPredictions([]);
                  setIsLoadingGeo(false);
                }
              );
            } catch (error) {
              console.error("Reverse geocoding error:", error);
              // Fallback
              if (onUseCurrentLocation) {
                onUseCurrentLocation();
              }
              onLocationChange("your location", {
                lat: latitude,
                lng: longitude,
              });
              setIsOpen(false);
              setSearchQuery("");
              setPredictions([]);
              setIsLoadingGeo(false);
            }
          } else {
            // Geocoder not available, use coordinates only
            if (onUseCurrentLocation) {
              onUseCurrentLocation();
            }
            onLocationChange("your location", {
              lat: latitude,
              lng: longitude,
            });
            setIsOpen(false);
            setSearchQuery("");
            setPredictions([]);
            setIsLoadingGeo(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(t("location.locationError"));
          setIsLoadingGeo(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert(t("location.geolocationNotSupported"));
      setIsLoadingGeo(false);
    }
  };

  // Show Google predictions if searching, otherwise show recent/default locations
  const showPredictions =
    searchQuery.length >= API_LIMITS.SEARCH_DEBOUNCE_MS / 100 &&
    predictions.length > 0;

  const allLocations = [...recentLocations, ...DEFAULT_LOCATIONS];
  const uniqueLocations = allLocations.filter(
    (loc, index, self) => index === self.findIndex((l) => l.id === loc.id)
  );

  const filteredLocations =
    searchQuery && !showPredictions
      ? uniqueLocations.filter(
          (loc) =>
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : uniqueLocations;

  return (
    <>
      {/* Location Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <span className="font-semibold text-lg">{currentLocation}</span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: Z_INDEX.LOCATION_SELECTOR_BACKDROP }}
        />
      )}

      {/* Location Modal/Drawer */}
      <div
        className={cn(
          "fixed bg-background transition-all duration-300 ease-out shadow-2xl",
          !isOpen && "pointer-events-none",
          // Mobile: bottom drawer
          isMobile && [
            "inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh]",
            isOpen ? "translate-y-0" : "translate-y-full",
            !isOpen && "invisible", // Hide completely when closed on mobile
          ],
          // Desktop: dropdown below button (like in the image)
          !isMobile && [
            "top-16 left-4 rounded-2xl",
            "w-full max-w-md",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ]
        )}
        style={{ zIndex: Z_INDEX.LOCATION_SELECTOR }}
      >
        {/* Mobile Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-2rem)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{currentLocation}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("location.searchLocation")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-4 pr-12 rounded-full border-2 text-base"
            />
            {searchQuery ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery("");
                  setPredictions([]);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            ) : null}
          </div>

          {/* Use Current Location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGeo}
            className="w-full flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-colors mb-6 disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
              {isLoadingGeo ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <MapPin className="w-6 h-6" />
              )}
            </div>
            <span className="font-medium text-base">
              {isLoadingGeo
                ? t("location.gettingLocation")
                : t("location.useCurrentLocation")}
            </span>
          </button>

          {/* Google Predictions (when searching) */}
          {showPredictions && (
            <div className="space-y-2 mb-6">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  onClick={() => handlePredictionSelect(prediction)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-muted rounded-xl transition-colors"
                >
                  <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Locations */}
          {!showPredictions && !searchQuery && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {t("location.recentLocations")}
              </h3>
            </div>
          )}

          {/* Locations List (when not searching with predictions) */}
          {!showPredictions && (
            <div className="space-y-2">
              {filteredLocations.slice(0, 8).map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-muted rounded-xl transition-colors"
                >
                  {location.image && (
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base">
                      {location.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {location.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {searchQuery &&
            !showPredictions &&
            filteredLocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("location.noLocationResults", { query: searchQuery })}</p>
              </div>
            )}
        </div>
      </div>
    </>
  );
};
