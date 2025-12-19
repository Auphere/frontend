/**
 * Application Constants
 * Centralized constants for magic numbers, API limits, and configuration
 */

// API & Pagination
export const API_LIMITS = {
  PLACES_PER_PAGE: 20,
  CHATS_PER_PAGE: 50,
  PLANS_PER_PAGE: 50,
  PHOTOS_MAX: 5,
  RECENT_LOCATIONS_MAX: 5,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// UI & Animation
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  DRAWER_MAX_HEIGHT_MOBILE: "90vh",
  DRAWER_MAX_HEIGHT_DESKTOP: "100vh",
  LOCATION_SELECTOR_MAX_HEIGHT: "85vh",
  DRAWER_WIDTH_DESKTOP: "50%",
  CHAT_SIDEBAR_HEIGHT: "80vh",
  ANIMATION_DURATION: {
    FAST: 300,
    NORMAL: 500,
    SLOW: 700,
  },
} as const;

// Default Coordinates
export const DEFAULT_COORDINATES = {
  MADRID: {
    latitude: 40.4168,
    longitude: -3.7038,
  },
} as const;

// Brand Colors (Auphere Gradient)
export const BRAND_COLORS = {
  MAGENTA: "#D511FD",
  PURPLE: "#8A43E1",
  ORANGE: "#EF7B16",
  RED: "#FF2F2F",
} as const;

// Image Fallbacks
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";

// Storage Keys
export const STORAGE_KEYS = {
  RECENT_LOCATIONS: "auphere_recent_locations",
  USER_PREFERENCES: "auphere_user_preferences",
  LANGUAGE: "auphere_language",
} as const;

// Search & Filter
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 3,
  RADIUS_KM: 5000,
  INTERSECTION_THRESHOLD: 0,
  INTERSECTION_ROOT_MARGIN: "200px",
} as const;
