'use client';

/**
 * PostHog Analytics Provider for Next.js
 * 
 * Wrap your app with this provider to enable analytics tracking.
 * 
 * Usage in layout.tsx:
 *   import { AnalyticsProvider } from '@/lib/analytics/provider';
 *   
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           <AnalyticsProvider>
 *             {children}
 *           </AnalyticsProvider>
 *         </body>
 *       </html>
 *     );
 *   }
 */

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, trackPageView } from './posthog';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Inner component that uses useSearchParams - must be wrapped in Suspense
 */
function AnalyticsTracker({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize PostHog on mount
  useEffect(() => {
    analytics.init();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

/**
 * Analytics Provider with Suspense boundary for useSearchParams
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsTracker>{children}</AnalyticsTracker>
    </Suspense>
  );
}

export default AnalyticsProvider;
