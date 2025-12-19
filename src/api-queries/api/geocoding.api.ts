/**
 * Geocoding API functions
 * All HTTP requests to the geocoding endpoints
 */
import { apiClient } from "@/lib/axios";
import type {
  AutocompleteResponse,
  PlaceDetailsResponse,
  ReverseGeocodeResponse,
  Location,
} from "../types/geocoding.types";

/**
 * Get autocomplete predictions for place search
 */
export async function getAutocompletePredictions(
  input: string,
  types: string = "(cities)",
  components: string = "country:es"
): Promise<AutocompleteResponse> {
  const response = await apiClient.get("/geocoding/autocomplete", {
    params: {
      input,
      types,
      components,
    },
  });

  return response.data;
}

/**
 * Get place details by place ID
 */
export async function getPlaceDetails(
  placeId: string,
  fields: string = "name,geometry,formatted_address,photos"
): Promise<PlaceDetailsResponse> {
  const response = await apiClient.get(`/geocoding/place-details/${placeId}`, {
    params: {
      fields,
    },
  });

  return response.data;
}

/**
 * Reverse geocode coordinates to get address/city
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResponse> {
  const response = await apiClient.get("/geocoding/reverse-geocode", {
    params: {
      lat,
      lng,
    },
  });

  return response.data;
}

/**
 * Get photo URL from backend proxy
 */
export function getPhotoProxyUrl(
  photoReference: string,
  maxwidth: number = 200
): string {
  const baseUrl = apiClient.defaults.baseURL || "";
  return `${baseUrl}/geocoding/photo-proxy?photo_reference=${encodeURIComponent(
    photoReference
  )}&maxwidth=${maxwidth}`;
}
