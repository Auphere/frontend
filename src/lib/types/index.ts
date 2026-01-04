// ============================================================================
// PLACE TYPES
// ============================================================================

export interface Place {
  id: string;
  place_id?: string; // Google Place ID
  name: string;
  category: 'bar' | 'restaurant' | 'club' | 'cafe' | 'lounge' | 'activity' | 'place' | 'other';
  description?: string;
  
  // Attributes
  vibe?: string[]; // romantic, casual, energetic, chill, sophisticated, fun
  crowdLevel?: 'empty' | 'quiet' | 'moderate' | 'busy' | 'packed';
  musicType?: 'live' | 'dj' | 'ambient' | 'none' | 'jazz' | 'electronic' | 'latin' | 'pop';
  priceLevel?: number; // 1-4
  
  // Ratings
  rating?: number;
  reviewCount?: number;
  
  // Location
  address?: string;
  neighborhood?: string;
  distance?: number;
  location?: {
    lat: number;
    lon: number;
    lng?: number; // Alias for lon
  };
  
  // Status
  openNow?: boolean;
  currentStatus?: string;
  
  // Media
  images?: string[];
  
  // Contact
  phone?: string;
  website?: string;
  email?: string;
  
  // Hours
  openingHours?: any;
  weeklyHours?: any;
  
  // Features
  amenities?: string[];
  features?: string[];
  reviews?: any[];
  socialMedia?: any;
  
  // UI state
  isFavorite?: boolean;
  is_saved?: boolean;
}

export interface PlaceFilters {
  search_query?: string;
  types?: Place['category'][];
  min_rating?: number;
  price_range?: number[];
  distance_km?: number;
  is_open_now?: boolean;
  vibe?: string[];
  sort_by?: 'rating' | 'distance' | 'popular' | 'reviews';
}

// ============================================================================
// PLAN TYPES
// ============================================================================

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  city: string;
  cover_image_url?: string;

  days: PlanDay[];
  created_at: string;
  updated_at: string;

  is_public: boolean;
  share_code?: string;

  estimated_cost?: number;
  total_duration_minutes: number;
}

export interface PlanDay {
  day_number: number;
  date?: string;
  events: PlanEvent[];
}

export interface PlanEvent {
  id: string;
  order: number;
  place_id: string;
  place_name: string;
  place_type: Place['type'];
  place_image?: string;

  start_time: string;
  duration_minutes: number;

  activity_type: 'dinner' | 'drinks' | 'club' | 'activity' | 'other';
  notes?: string;

  transport_to_next?: {
    type: 'walk' | 'taxi' | 'car' | 'public_transport';
    duration_minutes: number;
    distance_km?: number;
  };
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;

  preferred_city: string;
  language: 'es' | 'en' | 'ca';

  preferences: {
    dietary_restrictions?: string[];
    budget_range?: '€' | '€€' | '€€€' | '€€€€';
    interests?: string[];
    notification_enabled: boolean;
  };

  created_at: string;
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;

  agent_step?: 'thought' | 'action' | 'result';
  tool_used?: string;
  places_referenced?: Place[];
  plan_referenced?: Plan;

  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];

  city_context: string;
  created_at: string;
  updated_at: string;

  mode: 'chat' | 'planner';
  plan_draft?: Partial<Plan>;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface AgentResponse {
  step: 'thought' | 'action' | 'result';
  content: string;
  tool?: string;
  places?: Place[];
  plan?: Plan;
}

