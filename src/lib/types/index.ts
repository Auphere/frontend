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
// PLAN TYPES (aligned with agent PlanJson model)
// ============================================================================

export interface PlanLocation {
  address: string;
  zone?: string;
  lat: number;
  lng: number;
  travel_time_from_previous_minutes?: number;
  travel_mode?: 'walk' | 'car' | 'public';
}

export interface PlanTiming {
  recommended_start: string;
  suggested_duration_minutes: number;
  estimated_end: string;
  expected_occupancy?: string;
  occupancy_recommendation?: string;
}

export interface PlanDetails {
  vibes: string[];
  target_audience?: string[];
  music?: string;
  noise_level?: 'low' | 'medium' | 'high';
  average_spend_per_person?: number;
}

export interface PlanActions {
  can_reserve: boolean;
  reservation_url?: string;
  google_maps_url?: string;
  phone?: string;
}

export interface PlanAlternative {
  name: string;
  reason_not_selected: string;
  link?: string;
}

export interface PlanStop {
  stop_number: number;
  local_id: string;
  name: string;
  category: string;
  type_label?: string;
  timing: PlanTiming;
  location: PlanLocation;
  details: PlanDetails;
  selection_reasons: string[];
  actions?: PlanActions;
  alternatives?: PlanAlternative[];
  personal_tips?: string[];
}

export interface BudgetBreakdown {
  total: number;
  per_person: number;
  within_budget: boolean;
  breakdown?: Record<string, number>;
}

export interface PlanMetrics {
  vibe_match_percent?: number;
  average_venue_rating?: number;
  success_probability_label?: string;
}

export interface PlanSummary {
  total_duration: string;
  total_distance_km?: number;
  budget: BudgetBreakdown;
  metrics?: PlanMetrics;
}

export interface PlanExecution {
  date?: string;
  start_time?: string;
  duration_hours?: number;
  city?: string;
  zones?: string[];
  group_size?: number;
  group_composition?: string;
}

export interface Plan {
  // Identification
  id: string;
  plan_id?: string; // From agent
  user_id: string;
  
  // Basic info (aligned with agent)
  title: string;
  name?: string; // Backend uses 'name', agent uses 'title'
  description: string;
  category?: string;
  vibes: string[];
  tags: string[];
  
  // Execution context
  execution: PlanExecution;
  
  // Stops (main content)
  stops: PlanStop[];
  
  // Summary
  summary: PlanSummary;
  final_recommendations?: string[];
  
  // State management
  state: 'draft' | 'saved' | 'completed';
  created_at: string;
  updated_at: string;
  
  // Legacy fields for backwards compatibility
  city?: string;
  cover_image_url?: string;
  is_public?: boolean;
  share_code?: string;
  estimated_cost?: number;
  total_duration_minutes?: number;
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

export type ChatMode = 'explore' | 'plan';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];

  city_context: string;
  created_at: string;
  updated_at: string;

  mode: ChatMode;
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

