'use client';

/**
 * React Hooks for Analytics Tracking
 * 
 * Provides convenient hooks for tracking user interactions in Auphere.
 * 
 * Usage:
 *   const { trackPlanSaved, trackStopRemoved } = useAnalytics();
 *   
 *   // Track when user saves a plan
 *   trackPlanSaved({ planId, stopsCount, city });
 */

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  identifyUser,
  resetUser,
  trackEvent,
  trackChatMessage,
  trackPlanViewed,
  trackPlanSaved,
  trackPlanShared,
  trackStopExpanded,
  trackMapsClicked,
  trackStopRemoved,
  trackStopReplaced,
  trackLanguageDetected,
} from './posthog';

/**
 * Hook for analytics tracking
 */
export function useAnalytics() {
  const { user, isAuthenticated } = useAuth0();

  // Identify user when authenticated
  const identify = useCallback(() => {
    if (isAuthenticated && user?.sub) {
      identifyUser(user.sub, {
        email: user.email,
        name: user.name,
        picture: user.picture,
      });
    }
  }, [isAuthenticated, user]);

  // Reset on logout
  const reset = useCallback(() => {
    resetUser();
  }, []);

  return {
    // Core
    identify,
    reset,
    trackEvent,
    
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
}

/**
 * Hook for tracking plan interactions
 */
export function usePlanAnalytics(planId: string) {
  const trackViewed = useCallback(
    (source: 'search' | 'saved' | 'shared') => {
      trackPlanViewed({ planId, source });
    },
    [planId]
  );

  const trackSaved = useCallback(
    (stopsCount: number, city: string, vibes?: string[]) => {
      trackPlanSaved({ planId, stopsCount, city, vibes });
    },
    [planId]
  );

  const trackShared = useCallback(
    (shareMethod: 'link' | 'whatsapp' | 'email' | 'copy') => {
      trackPlanShared({ planId, shareMethod });
    },
    [planId]
  );

  const trackStopExpandedInPlan = useCallback(
    (stopIndex: number, placeId: string) => {
      trackStopExpanded({ planId, stopIndex, placeId });
    },
    [planId]
  );

  const trackStopRemovedFromPlan = useCallback(
    (stopIndex: number, reason?: string) => {
      trackStopRemoved({ planId, stopIndex, reason });
    },
    [planId]
  );

  const trackStopReplacedInPlan = useCallback(
    (stopIndex: number, oldPlaceId: string, newPlaceId: string) => {
      trackStopReplaced({ planId, stopIndex, oldPlaceId, newPlaceId });
    },
    [planId]
  );

  return {
    trackViewed,
    trackSaved,
    trackShared,
    trackStopExpanded: trackStopExpandedInPlan,
    trackStopRemoved: trackStopRemovedFromPlan,
    trackStopReplaced: trackStopReplacedInPlan,
  };
}

/**
 * Hook for tracking chat interactions
 */
export function useChatAnalytics(sessionId: string) {
  const trackMessage = useCallback(
    (messageLength: number, chatMode: 'explore' | 'plan') => {
      trackChatMessage({ sessionId, messageLength, chatMode });
    },
    [sessionId]
  );

  return {
    trackMessage,
  };
}

/**
 * Hook for tracking place interactions
 */
export function usePlaceAnalytics() {
  const trackMaps = useCallback(
    (placeId: string, context: 'plan' | 'search' | 'detail') => {
      trackMapsClicked({ placeId, context });
    },
    []
  );

  return {
    trackMapsClicked: trackMaps,
  };
}

export default useAnalytics;

