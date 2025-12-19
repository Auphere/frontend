/**
 * TypeScript types for Places API responses and requests
 */

// Category constants
export const CategoryEnum = {
  RESTAURANT: "restaurant",
  BAR: "bar",
  CLUB: "night_club",
  CAFE: "cafe",
  LOUNGE: "lounge",
  ACTIVITY: "activity",
} as const;

// Vibe constants
export const VibeEnum = {
  ROMANTIC: "romantic",
  CASUAL: "casual",
  ENERGETIC: "energetic",
  CHILL: "chill",
  SOPHISTICATED: "sophisticated",
  FUN: "fun",
} as const;

// Request types
export interface PlaceSearchRequest {
  query?: string;
  city?: string;
  minRating?: number;
  categories?: string[];
  vibes?: string[];
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  perPage?: number;
}

export interface PlacePhotoResponse {
  id?: string;
  photoUrl?: string;
  thumbnailUrl?: string;
  // Support both camelCase and snake_case formats
  photo_url?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  attribution?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface PlaceReviewResponse {
  id?: string;
  author?: string;
  author_name?: string;
  rating?: number;
  text?: string;
  comment?: string;
  postedAt?: string;
  posted_at?: string;
  relative_time_description?: string;
  source?: string;
  sourceId?: string;
}

// Response types
export interface Place {
  placeId: string;
  name: string;
  formattedAddress?: string;
  vicinity?: string;
  latitude?: number;
  longitude?: number;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: any;
  customAttributes?: {
    city?: string;
    district?: string;
    vibes?: string[];
    occupancy?: "low" | "moderate" | "high";
    liveMusic?: boolean;
    outdoorSeating?: boolean;
    mainCategories?: string[];
    tags?: Record<string, any>;
    vibeDescriptor?: any;
    primaryPhotoUrl?: string;
    primaryPhotoThumbnailUrl?: string;
    googlePlaceId?: string;
    photos?: PlacePhotoResponse[];
    reviews?: PlaceReviewResponse[];
    [key: string]: any;
  };
  distanceKm?: number;
  isOpen?: boolean;
}

export interface PlaceSearchResponse {
  places: Place[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Geolocation types
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}
