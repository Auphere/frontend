/**
 * Geocoding query hooks
 * React Query hooks for geocoding operations
 */
import { useQuery } from "@tanstack/react-query";
import * as geocodingApi from "../api/geocoding.api";
import { geocodingKeys } from "../keys/geocoding.keys";
import type { Location } from "../types/geocoding.types";

/**
 * Hook: Get autocomplete predictions
 * Fetches place predictions based on user input
 */
export function useAutocompletePredictions(
  input: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: geocodingKeys.autocomplete(input),
    queryFn: () => geocodingApi.getAutocompletePredictions(input),
    enabled: enabled && input.length >= 2, // Only fetch if input has at least 2 chars
    staleTime: 5 * 60 * 1000, // 5 minutes - predictions don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    retry: 1, // Only retry once on failure
  });
}

/**
 * Hook: Get place details
 * Fetches detailed information about a specific place
 */
export function usePlaceDetailsGeocode(placeId: string | null) {
  return useQuery({
    queryKey: geocodingKeys.placeDetails(placeId || ""),
    queryFn: () => geocodingApi.getPlaceDetails(placeId!),
    enabled: !!placeId,
    staleTime: 30 * 60 * 1000, // 30 minutes - place details are relatively static
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache
  });
}

/**
 * Hook: Reverse geocode coordinates
 * Converts lat/lng to address/city name
 */
export function useReverseGeocode(
  lat: number | null,
  lng: number | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: geocodingKeys.reverseGeocode(lat || 0, lng || 0),
    queryFn: () => geocodingApi.reverseGeocode(lat!, lng!),
    enabled: enabled && lat !== null && lng !== null,
    staleTime: 60 * 60 * 1000, // 1 hour - coordinates don't change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache
    retry: 1, // Only retry once on failure
  });
}

/**
 * Helper: Transform prediction to Location
 */
export function transformPredictionToLocation(
  prediction: any,
  placeDetails: any
): Location {
  const place = placeDetails?.result;

  return {
    id: prediction.place_id,
    name: place?.name || prediction.structured_formatting.main_text,
    subtitle:
      prediction.description || prediction.structured_formatting.secondary_text,
    coordinates: place?.geometry?.location
      ? {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        }
      : undefined,
    image: place?.photos?.[0]
      ? geocodingApi.getPhotoProxyUrl(place.photos[0].photo_reference, 200)
      : undefined,
  };
}

/**
 * Helper: Extract city name from geocoding results
 */
export function extractCityFromGeocodingResults(results: any[]): string | null {
  if (!results || results.length === 0) return null;

  for (const result of results) {
    const cityComponent = result.address_components?.find(
      (component: any) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_2")
    );

    if (cityComponent) {
      return cityComponent.long_name;
    }
  }

  return null;
}
