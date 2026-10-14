# CoCollaber Design System — Tokens Specification

## 1. Brand Color Palette (Strict 5-Color System)

The CoCollaber aesthetic is warm, editorial, and deeply human. It intentionally departs from sterile corporate blue tech palettes, using five approved color tokens derived from paper, coffee, and earth.

| Token | Hex Value | Semantic Role | WCAG Contrast |
| :--- | :--- | :--- | :--- |
| **Cream** | `#F8EFE3` | Primary page canvas, warm card surfaces, pill backgrounds | Base Background |
| **Dark Cocoa** | `#3B1E08` | Primary typography, high-priority buttons, dark badges | 11.5:1 against Cream (AAA) |
| **Medium Mocha** | `#8B5A36` | Secondary text, subtle borders, attribution badges | 4.8:1 against Cream (AA) |
| **Warm Sand** | `#DDAA66` | Component borders, input outlines, focus indicators | Accent Border / Rule |
| **Soft Caramel** | `#F1C888` | Secondary button fills, highlight callouts, avatar accents | Warm Accent |

> [!IMPORTANT]
> No extraneous accent colors (e.g., standard SaaS neon blues, purples, or synthetic greens) are permitted. All status indicators, compensation badges, and states are rendered using distinct combinations of these five tokens.

---

## 2. Semantic CSS Variables

Defined in `apps/web/src/app/globals.css`:

```css
:root {
  --c-cream: #F8EFE3;
  --c-dark-cocoa: #3B1E08;
  --c-medium-mocha: #8B5A36;
  --c-warm-sand: #DDAA66;
  --c-soft-caramel: #F1C888;

  --bg-page: var(--c-cream);
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #FDF9F4;
  --bg-surface-elevated: #FAF3EA;
  --bg-surface-warm: var(--c-soft-caramel);

  --text-main: var(--c-dark-cocoa);
  --text-muted: var(--c-medium-mocha);
  --text-inverse: var(--c-cream);

  --border-subtle: rgba(139, 90, 54, 0.18);
  --border-default: var(--c-warm-sand);
  --border-strong: var(--c-medium-mocha);

  --focus-ring: 0 0 0 3px rgba(221, 170, 102, 0.5);
}
```

---

## 3. Typography Scale

- **Display Serif**: `"Playfair Display", Georgia, "Times New Roman", serif`
  - Used for editorial headlines, brand wordmark, hero banners, and section titles.
- **Body Sans**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - High-legibility humanist system font stack for descriptions, forms, metadata, and buttons.
- **Sizes**:
  - `xs`: `0.75rem` (12px)
  - `sm`: `0.875rem` (14px)
  - `base`: `1.0rem` (16px)
  - `lg`: `1.125rem` (18px)
  - `xl`: `1.25rem` (20px)
  - `2xl`: `1.5rem` (24px)
  - `3xl`: `2.0rem` (32px)
  - `4xl`: `2.5rem` (40px)
  - `5xl`: `3.25rem` (52px)

---

## 4. Spacing & Elevation

- **Elevation**:
  - `flat`: `border: 1px solid var(--c-warm-sand)`
  - `subtle`: `box-shadow: 0 2px 8px rgba(59, 30, 8, 0.04)`
  - `elevated`: `box-shadow: 0 8px 24px rgba(59, 30, 8, 0.10)`
- **Radius**:
  - `sm`: `4px` (tags, buttons small)
  - `base`: `6px` (inputs, standard buttons)
  - `md`: `10px` (cards, modals)
  - `full`: `9999px` (pills, badges, avatars)
