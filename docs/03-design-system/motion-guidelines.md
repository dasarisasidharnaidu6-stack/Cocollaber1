# CoCollaber Motion & Micro-Interaction Guidelines

## 1. Principles of Motion

Motion in CoCollaber reflects paper-like fluidity and organic editorial rhythm:

1. **Subtle & Purposeful**: Animations should clarify context or acknowledge user input, never distract or delay.
2. **Warm Easing**: Natural physical decelerations (`cubic-bezier(0.16, 1, 0.3, 1)` or `power3.out`).
3. **Strict Accessibility Compliance**: Always respect user system preferences for reduced motion (`prefers-reduced-motion: reduce`).

---

## 2. Timing Standards

- **Fast (150ms)**: Micro-interactions, button active states, tooltip fade-in.
- **Base (250ms)**: Card hover elevation, dropdown reveals, input focus borders.
- **Slow (400ms)**: Modal window entrances, page section reveals, sheet slide-outs.

---

## 3. Reduced Motion Policy

All CSS transitions and animations must collapse to zero duration or subtle opacity crossfades when reduced motion is preferred:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The React hook `usePrefersReducedMotion()` in `apps/web/src/motion/animations.ts` enables programmatic checks before invoking GSAP or complex timeline sequences.
