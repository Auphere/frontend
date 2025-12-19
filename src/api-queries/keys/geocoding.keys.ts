/**
 * Query keys for geocoding module
 * These keys are used to identify and cache queries in TanStack Query
 */

export const geocodingKeys = {
  all: ["geocoding"] as const,
  autocomplete: (input: string) =>
    [...geocodingKeys.all, "autocomplete", input] as const,
  placeDetails: (placeId: string) =>
    [...geocodingKeys.all, "placeDetails", placeId] as const,
  reverseGeocode: (lat: number, lng: number) =>
    [...geocodingKeys.all, "reverseGeocode", lat, lng] as const,
} as const;
