/**
 * Places API functions
 * All HTTP requests to the places endpoints
 */
import { apiClient } from "@/lib/axios";
import { transformKeysToCamel, transformKeysToSnake } from "@/lib/transform";
import type {
  PlaceSearchRequest,
  PlaceSearchResponse,
  Place,
} from "../types/places.types";

/**
 * Search places with filters and pagination
 */
export async function searchPlaces(
  request: PlaceSearchRequest
): Promise<PlaceSearchResponse> {
  const response = await apiClient.post(
    "/places/search",
    transformKeysToSnake(request)
  );

  return transformKeysToCamel<PlaceSearchResponse>(response.data);
}

/**
 * Get place details by placeId
 */
export async function getPlaceDetails(placeId: string): Promise<Place> {
  const response = await apiClient.get(`/places/${placeId}`);
  return transformKeysToCamel<Place>(response.data);
}
