/**
 * Places query hooks
 * React Query hooks for places operations with infinite scroll
 */
import {
  useInfiniteQuery,
  useQuery,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import * as placesApi from "../api/places.api";
import { placesKeys } from "../keys/places.keys";
import type {
  PlaceSearchRequest,
  PlaceSearchResponse,
  GeolocationCoordinates,
} from "../types/places.types";
import { config } from "@/lib/config";

/**
 * Hook: Get user's geolocation
 * Fetches browser geolocation and returns coordinates
 */
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  }, []);

  return { coordinates, error, loading };
}

// Default coordinates for Madrid, Spain
const MADRID_COORDINATES = {
  latitude: 40.4168,
  longitude: -3.7038,
};

/**
 * Infinite Query: Search places with pagination
 * Uses React Query's infinite query for scroll-to-load functionality
 */
export function useInfinitePlaces(filters: PlaceSearchRequest) {
  const normalizedFilters = useMemo(() => {
    // Default to Madrid if no city provided AND no coordinates
    const city = filters.city || config.defaultCity || "Madrid";

    // Only use coordinates if explicitly provided
    // Don't default to Madrid coordinates - let the backend handle city-based search
    const latitude = filters.latitude;
    const longitude = filters.longitude;

    return {
      ...filters,
      city: latitude && longitude ? undefined : city, // Only use city if no coordinates
      latitude,
      longitude,
      perPage: filters.perPage ?? 20,
    };
  }, [filters]);

  return useInfiniteQuery({
    queryKey: placesKeys.list(normalizedFilters),
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const response = await placesApi.searchPlaces({
        ...normalizedFilters,
        page: pageParam as number,
      });
      return response;
    },
    getNextPageParam: (lastPage: PlaceSearchResponse) => {
      // Return next page number if there are more pages
      const hasMore = lastPage.page < lastPage.totalPages;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes - data is fresh for 10 min
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache for 30 min
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts (use cache)
    // Enable query if we have either city OR coordinates
    enabled: Boolean(
      normalizedFilters.city ||
        (normalizedFilters.latitude && normalizedFilters.longitude)
    ),
  });
}

/**
 * Query: Get place details
 * Fetches detailed information about a specific place
 */
export function usePlaceDetails(placeId: string | null) {
  return useQuery({
    queryKey: placesKeys.detail(placeId || ""),
    queryFn: () => placesApi.getPlaceDetails(placeId!),
    enabled: !!placeId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
