export type PlaceCategory =
  | "restaurant"
  | "bar"
  | "club"
  | "cafe"
  | "activity"
  | "lounge";

export type PlaceVibe =
  | "romantic"
  | "casual"
  | "energetic"
  | "chill"
  | "sophisticated"
  | "fun";

export type CrowdLevel = "empty" | "quiet" | "moderate" | "busy" | "packed";

export type MusicType =
  | "live"
  | "dj"
  | "ambient"
  | "none"
  | "jazz"
  | "electronic"
  | "latin"
  | "pop";

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export interface Place {
  // Core fields (always present after normalization)
  id: string;
  place_id?: string; // Alias for id
  name: string;
  category: PlaceCategory;

  // Optional descriptive fields
  description?: string;
  vibe?: PlaceVibe[];
  crowdLevel?: CrowdLevel;
  musicType?: MusicType;

  // Pricing and ratings
  priceLevel: 1 | 2 | 3 | 4;
  rating?: number;
  reviewCount?: number;

  // Location info
  address?: string;
  neighborhood?: string;
  distance?: number;
  location?: {
    lat: number;
    lon: number;
    lng?: number; // Alias for lon
  };

  // Availability
  openNow?: boolean;
  currentStatus?: string;

  // Media
  images: string[];

  // Extended fields (for detail page)
  features?: string[];
  popularTimes?: { [key: string]: number };
  reviews?: Review[];
  phone?: string;
  website?: string;
  email?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  amenities?: string[];
  weeklyHours?: {
    [key: string]: string;
  };
  parkingInfo?: string;
  publicTransport?: string;

  // Legacy fields (for backwards compatibility, will be removed)
  types?: string[];
  formatted_address?: string;
  open_now?: boolean;
  openingHours?: string;
  opening_hours?: unknown;
  photo_url?: string;
  photos?: unknown[];
  business_status?: string;
  price_level?: number;
  user_ratings_total?: number;
  googleRating?: number;
  googleReviewCount?: number;
  trustpilotRating?: number;
  trustpilotReviewCount?: number;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
}

export interface EveningPlan {
  id: string;
  name: string;
  description: string;
  stops: PlanStop[];
  totalDuration: number;
  totalDistance: number;
  vibe: PlaceVibe;
}

export interface PlanStop {
  place: Place;
  duration: number;
  startTime: string;
  activity: string;
}
