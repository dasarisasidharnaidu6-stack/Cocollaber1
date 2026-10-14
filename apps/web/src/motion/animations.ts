'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user has requested reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

/**
 * Editorial motion presets respecting prefers-reduced-motion
 */
export const MOTION_PRESETS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.4, ease: 'power2.out' },
  },
  slideUp: {
    from: { opacity: 0, y: 16 },
    to: { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
  },
  staggerCards: {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
  },
};
