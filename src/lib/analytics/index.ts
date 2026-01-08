/**
 * Auphere Analytics Module
 * 
 * Centralized analytics tracking using PostHog.
 * 
 * Quick Start:
 * 
 * 1. Add to your root layout:
 *    import { AnalyticsProvider } from '@/lib/analytics';
 *    <AnalyticsProvider>{children}</AnalyticsProvider>
 * 
 * 2. Track events:
 *    import { useAnalytics } from '@/lib/analytics';
 *    const { trackPlanSaved } = useAnalytics();
 *    trackPlanSaved({ planId, stopsCount, city });
 * 
 * 3. Use plan-specific tracking:
 *    import { usePlanAnalytics } from '@/lib/analytics';
 *    const { trackViewed, trackSaved } = usePlanAnalytics(planId);
 */

// Provider
export { AnalyticsProvider } from './provider';

// Hooks
export {
  useAnalytics,
  usePlanAnalytics,
  useChatAnalytics,
  usePlaceAnalytics,
} from './use-analytics';

// Direct tracking functions
export {
  analytics,
  initPostHog,
  identifyUser,
  resetUser,
  setUserProperties,
  trackEvent,
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
} from './posthog';

// PostHog instance for advanced usage
export { posthog } from './posthog';

