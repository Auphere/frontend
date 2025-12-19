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
  // Map frontend params to backend query params
  const params: Record<string, any> = {};

  if (request.query) params.q = request.query;
  if (request.city) params.city = request.city;
  if (request.minRating) params.min_rating = request.minRating;
  if (request.latitude) params.lat = request.latitude;
  if (request.longitude) params.lon = request.longitude;
  if (request.radius) params.radius_km = request.radius;
  if (request.page) params.page = request.page;
  if (request.perPage) params.limit = request.perPage;

  // Handle categories - backend expects 'type' field
  if (request.categories && request.categories.length > 0) {
    params.type = request.categories[0]; // Backend only supports single type filter
  }

  const response = await apiClient.get("/places/search", { params });

  // Backend returns: { places: [...], total, page, per_page, total_pages }
  const backendData = response.data;
  const places = backendData.places || [];

  const mapped = places.map((place: any) => ({
    placeId: place.place_id,
    name: place.name,
    formattedAddress: place.formatted_address,
    vicinity: place.vicinity,
    latitude: place.latitude,
    longitude: place.longitude,
    types: place.types || [],
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    phoneNumber: place.phone_number,
    website: place.website,
    openingHours: place.opening_hours,
    isOpen: place.is_open,
    distanceKm: place.distance_km,
    customAttributes: place.custom_attributes || {},
  }));

  return {
    places: mapped,
    total: backendData.total || 0,
    page: backendData.page || 1,
    perPage: backendData.per_page || 20,
    totalPages: backendData.total_pages || 1,
  };
}

/**
 * Get place details by placeId
 */
export async function getPlaceDetails(placeId: string): Promise<Place> {
  const response = await apiClient.get(`/places/${placeId}`);
  const place = response.data;

  // Backend returns PlaceResponse directly
  return {
    placeId: place.place_id,
    name: place.name,
    formattedAddress: place.formatted_address,
    vicinity: place.vicinity,
    latitude: place.latitude,
    longitude: place.longitude,
    types: place.types || [],
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    phoneNumber: place.phone_number,
    website: place.website,
    openingHours: place.opening_hours,
    isOpen: place.is_open,
    distanceKm: place.distance_km,
    customAttributes: place.custom_attributes || {},
  };
}
