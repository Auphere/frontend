import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to automatically scroll to bottom when content changes
 * @param dependencies - Array of dependencies that trigger scroll
 * @param behavior - Scroll behavior ('auto' | 'smooth')
 */
export function useScrollToBottom<T = HTMLDivElement>(
  dependencies: unknown[] = [],
  behavior: ScrollBehavior = "smooth"
) {
  const ref = useRef<T>(null);

  const scrollToBottom = useCallback(() => {
    if (ref.current && "scrollIntoView" in ref.current) {
      (ref.current as HTMLElement).scrollIntoView({ behavior });
    }
  }, [behavior]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ref, scrollToBottom };
}
