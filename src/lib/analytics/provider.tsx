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

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, trackPageView } from './posthog';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
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

export default AnalyticsProvider;

