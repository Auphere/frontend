/**
 * PostHog Analytics Client for Auphere Frontend
 * 
 * Environment modes:
 * - Development: Console logging only (no PostHog)
 * - Production: PostHog Cloud tracking
 * 
 * Handles:
 * - PostHog initialization
 * - User identification
 * - Event tracking
 * - Feature flag checking
 * 
 * Usage:
 *   import { analytics, trackEvent } from '@/lib/analytics/posthog';
 *   trackEvent('plan_saved', { plan_id: '123', city: 'Madrid' });
 */

import posthog from 'posthog-js';

// Environment variables
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Check if PostHog is configured for production
const isPostHogEnabled = (): boolean => {
  return typeof window !== 'undefined' && IS_PRODUCTION && !!POSTHOG_API_KEY;
};

// Check if we're in development mode
const isDevelopment = (): boolean => {
  return typeof window !== 'undefined' && !IS_PRODUCTION;
};

// Track if PostHog has been initialized
let isInitialized = false;

/**
 * Log event to console in development mode
 */
function logEventLocal(eventName: string, properties?: Record<string, unknown>): void {
  if (isDevelopment()) {
    console.log(`[Analytics Event] ${eventName}`, properties || {});
  }
}

/**
 * Initialize PostHog client
 * Call this in your app's root component
 */
export function initPostHog(): void {
  if (isDevelopment()) {
    console.log('[Analytics] Development mode - console logging enabled');
    isInitialized = true;
    return;
  }

  if (!isPostHogEnabled()) {
    console.warn('[Analytics] PostHog not configured - NEXT_PUBLIC_POSTHOG_API_KEY missing');
    return;
  }

  if (isInitialized) {
    return;
  }

  posthog.init(POSTHOG_API_KEY!, {
    api_host: POSTHOG_HOST,
    // Capture pageviews automatically
    capture_pageview: true,
    // Capture pageleaves for session tracking
    capture_pageleave: true,
    // Autocapture clicks, form submissions, etc.
    autocapture: true,
    // Session recording (optional - disable for privacy)
    disable_session_recording: false,
    // Persistence
    persistence: 'localStorage+cookie',
    // Bootstrap (for faster initial load)
    bootstrap: {
      distinctID: undefined,
      isIdentifiedID: false,
    },
    // Loaded callback
    loaded: (posthog) => {
      console.log('[Analytics] PostHog loaded', posthog.get_distinct_id());
    },
  });

  isInitialized = true;
}

/**
 * Identify a user (call after login)
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (isDevelopment()) {
    console.log(`[Analytics Identify] user=${userId}`, properties || {});
    return;
  }

  if (!isPostHogEnabled()) return;
  posthog.identify(userId, properties);
}

/**
 * Reset user identity (call on logout)
 */
export function resetUser(): void {
  if (isDevelopment()) {
    console.log('[Analytics] User reset');
    return;
  }

  if (!isPostHogEnabled()) return;
  posthog.reset();
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (isDevelopment()) {
    console.log('[Analytics Set Props]', properties);
    return;
  }

  if (!isPostHogEnabled()) return;
  posthog.people.set(properties);
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  // Development: console logging
  if (isDevelopment()) {
    logEventLocal(eventName, properties);
    return;
  }

  // Production: PostHog Cloud
  if (!isPostHogEnabled()) return;
  posthog.capture(eventName, properties);
}

/**
 * Track page view (usually automatic, but can be manual for SPAs)
 */
export function trackPageView(path?: string): void {
  const currentUrl = path || (typeof window !== 'undefined' ? window.location.href : '');
  
  if (isDevelopment()) {
    console.log(`[Analytics PageView] ${currentUrl}`);
    return;
  }

  if (!isPostHogEnabled()) return;
  posthog.capture('$pageview', {
    $current_url: currentUrl,
  });
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (!isPostHogEnabled()) return false;
  return posthog.isFeatureEnabled(flagKey) ?? false;
}

/**
 * Get feature flag value
 */
export function getFeatureFlag<T = unknown>(flagKey: string): T | undefined {
  if (!isPostHogEnabled()) return undefined;
  return posthog.getFeatureFlag(flagKey) as T | undefined;
}

// =============================================================================
// Auphere-Specific Event Tracking
// =============================================================================

/**
 * Track chat message sent
 */
export function trackChatMessage(properties: {
  sessionId: string;
  messageLength: number;
  chatMode: 'explore' | 'plan';
}): void {
  trackEvent('chat_message_sent', properties);
}

/**
 * Track plan viewed
 */
export function trackPlanViewed(properties: {
  planId: string;
  source: 'search' | 'saved' | 'shared';
}): void {
  trackEvent('plan_viewed', properties);
}

/**
 * Track plan saved
 */
export function trackPlanSaved(properties: {
  planId: string;
  stopsCount: number;
  city: string;
  vibes?: string[];
}): void {
  trackEvent('plan_saved', properties);
}

/**
 * Track plan shared
 */
export function trackPlanShared(properties: {
  planId: string;
  shareMethod: 'link' | 'whatsapp' | 'email' | 'copy';
}): void {
  trackEvent('plan_shared', properties);
}

/**
 * Track stop expanded (user clicked to see details)
 */
export function trackStopExpanded(properties: {
  planId: string;
  stopIndex: number;
  placeId: string;
}): void {
  trackEvent('stop_expanded', properties);
}

/**
 * Track maps clicked (user wants to navigate)
 */
export function trackMapsClicked(properties: {
  placeId: string;
  context: 'plan' | 'search' | 'detail';
}): void {
  trackEvent('maps_clicked', properties);
}

/**
 * Track stop removed (negative feedback)
 */
export function trackStopRemoved(properties: {
  planId: string;
  stopIndex: number;
  reason?: string;
}): void {
  trackEvent('stop_removed', properties);
}

/**
 * Track stop replaced
 */
export function trackStopReplaced(properties: {
  planId: string;
  stopIndex: number;
  oldPlaceId: string;
  newPlaceId: string;
}): void {
  trackEvent('stop_replaced', properties);
}

/**
 * Track language detected
 */
export function trackLanguageDetected(properties: {
  detectedLang: string;
  isSupported: boolean;
}): void {
  trackEvent('language_detected', properties);
}

// Export PostHog instance for advanced usage
export { posthog };

// Export default analytics object
export const analytics = {
  init: initPostHog,
  identify: identifyUser,
  reset: resetUser,
  setUserProperties,
  track: trackEvent,
  trackPageView,
  isFeatureEnabled,
  getFeatureFlag,
  // Auphere-specific
  trackChatMessage,
  trackPlanViewed,
  trackPlanSaved,
  trackPlanShared,
  trackStopExpanded,
  trackMapsClicked,
  trackStopRemoved,
  trackStopReplaced,
  trackLanguageDetected,
};

export default analytics;
