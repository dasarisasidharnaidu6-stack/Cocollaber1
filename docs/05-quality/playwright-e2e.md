# CoCollaber Playwright End-to-End Testing Guide

## 1. Architecture & Setup

Playwright is configured in `apps/web/playwright.config.ts` to test the full Next.js 14 application in headless browser environments:
- **Test Directory**: `apps/web/tests/e2e`
- **Port & Target**: Defaults to `http://localhost:3000`
- **Web Server Integration**: Automatically boots Next.js standalone server (`node .next/standalone/server.js`) in 236ms before running test runs.
- **Reporters**: Compact list reporter in terminal and HTML report generation in `playwright-report/`.
- **Media Policies**: Video recording is disabled by default to eliminate heavy binary dependencies (`ffmpeg`); screenshots are captured strictly on unexpected failure.

---

## 2. Supported Journeys & Coverage

### Journey 1: Public Pages & Editorial Navigation (`01-navigation-and-public.spec.ts`)
- **Home View**: Verifies the central brand question *"What opportunity are you looking for, and what opportunity can you offer?"*, the foundational model pill (*People ↔ Opportunities ↔ People*), the product loop showcase (*Express → Discover → Connect → Collaborate → Grow → Create*), and hero action buttons.
- **Discover View**: Verifies discovery header, topic/keyword search input, and filter controls.
- **Login View**: Verifies credentials form inputs and action buttons.
- **Register View**: Verifies onboarding input fields and alias/email labels.

### Journey 2: Auth Lifecycle & Protected Boundaries (`02-auth-flows.spec.ts`)
- **Credential Submission**: Tests login form interaction and transition handling.
- **Field Validation**: Verifies that client-side validation prevents empty submissions.
- **Protected Views**: Verifies that unauthenticated visitors accessing `/profile` or `/opportunities/new` are handled gracefully without application crashes.

### Journey 3: Opportunities & Compensation Transparency (`03-opportunity-and-profile.spec.ts`)
- **Compensation Visibility**: Asserts that every visible opportunity card displays an unambiguous compensation status badge (*Paid*, *Unpaid*, *Stipend*, *Attribution*).
- **Keyword Filtering**: Tests dynamic filtering when the visitor types into the search box.
- **Filter Reset**: Tests that clicking *"Reset Filters"* clears user input and resets active filters.

### Journey 4: Accessibility, Semantic Structure & Reduced Motion (`04-accessibility-and-motion.spec.ts`)
- **Semantic Structure**: Asserts that landmark HTML elements (`<main>`, `<nav>`, `<footer>`) are rendered.
- **Motion Accessibility**: Tests rendering under `prefers-reduced-motion: reduce`. Verifies animations gracefully deactivate without blocking layout or user interaction.
- **Keyboard Navigation**: Verifies that interactive inputs accept focus and keyboard input natively.

---

## 3. Local Execution Commands

```bash
# Navigate to web application
cd apps/web

# Build standalone production bundle (required once before testing)
npm run build

# Run all Playwright E2E suites
npx playwright test

# Run a specific suite
npx playwright test tests/e2e/01-navigation-and-public.spec.ts

# View HTML test report
npx playwright show-report
```
