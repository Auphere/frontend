import axios from "axios";
import type { Place } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE || "http://localhost:8000";

type BackendPlaceResponse = {
  place_id: string;
  name: string;
  formatted_address?: string | null;
  vicinity?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  types?: string[];
  rating?: number | null;
  user_ratings_total?: number | null;
  price_level?: number | null;
  phone_number?: string | null;
  website?: string | null;
  opening_hours?: any;
  is_open?: boolean | null;
  custom_attributes?: Record<string, any>;
  distance_km?: number | null;
};

function toPlace(back: BackendPlaceResponse): Place {
  const attrs = back.custom_attributes || {};

  const photos: any[] = Array.isArray(attrs.photos) ? attrs.photos : [];
  const photoUrls = photos
    .map((p) => (typeof p === "string" ? p : p?.url || p?.photo_url))
    .filter((u): u is string => typeof u === "string" && u.startsWith("http"));

  const images =
    photoUrls.length > 0
      ? photoUrls.slice(0, 10)
      : (attrs.primary_photo_url
          ? [attrs.primary_photo_url]
          : attrs.primary_photo_thumbnail_url
            ? [attrs.primary_photo_thumbnail_url]
            : undefined);

  return {
    id: back.place_id,
    place_id:
      attrs.google_place_id || attrs.place_id || attrs.googlePlaceId || back.place_id,
    name: back.name,
    category: "place",
    description: attrs.ai_summary || attrs.summary || undefined,
    rating: back.rating ?? undefined,
    reviewCount: back.user_ratings_total ?? undefined,
    priceLevel: back.price_level ?? undefined,
    address: back.formatted_address || attrs.city || undefined,
    neighborhood: back.vicinity || attrs.district || undefined,
    location:
      back.latitude != null && back.longitude != null
        ? {
            lat: back.latitude,
            lon: back.longitude,
            lng: back.longitude,
          }
        : undefined,
    openNow: back.is_open ?? undefined,
    images,
    phone: back.phone_number ?? undefined,
    website: back.website ?? undefined,
    openingHours: back.opening_hours,
    reviews: Array.isArray(attrs.reviews) ? attrs.reviews : [],
    ...(Array.isArray(attrs.tips) ? ({ tips: attrs.tips } as any) : {}),
  };
}

export const placesAPI = {
  getPlaceDetail: async (placeIdOrGoogleId: string): Promise<Place> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/api/v1/places/${placeIdOrGoogleId}`,
      { headers: { Accept: "application/json" } }
    );
    return toPlace(data as BackendPlaceResponse);
  },
};


