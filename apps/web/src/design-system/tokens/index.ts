import { BRAND_COLORS } from './colors';
import { TYPOGRAPHY } from './typography';

export const SPACING = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

export const SHADOWS = {
  sm: '0 1px 2px rgba(59, 30, 8, 0.05)',
  base: '0 2px 4px rgba(59, 30, 8, 0.06), 0 1px 2px rgba(59, 30, 8, 0.04)',
  md: '0 4px 12px rgba(59, 30, 8, 0.08), 0 2px 4px rgba(59, 30, 8, 0.04)',
  lg: '0 10px 24px rgba(59, 30, 8, 0.1), 0 4px 8px rgba(59, 30, 8, 0.05)',
  focus: '0 0 0 3px rgba(221, 170, 102, 0.45)',
} as const;

export const RADII = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px',
} as const;

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export { BRAND_COLORS, TYPOGRAPHY };
