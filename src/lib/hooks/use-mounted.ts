"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if component has mounted on client-side.
 * Useful for avoiding hydration mismatches with dynamic content.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

