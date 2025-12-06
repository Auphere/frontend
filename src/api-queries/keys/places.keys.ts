/**
 * Query keys for places module
 * These keys are used to identify and cache queries in TanStack Query
 */

import type { PlaceSearchRequest } from "../types/places.types";

export const placesKeys = {
  all: ["places"] as const,
  lists: () => [...placesKeys.all, "list"] as const,
  list: (filters: PlaceSearchRequest) =>
    [...placesKeys.lists(), filters] as const,
  details: () => [...placesKeys.all, "detail"] as const,
  detail: (placeId: string) => [...placesKeys.details(), placeId] as const,
} as const;
