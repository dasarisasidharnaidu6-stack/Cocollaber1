# CoCollaber Test Inventory & Coverage Matrix

## 1. Backend Pytest Suites (`apps/api/tests`)

| Suite File | Category | Behaviors Tested | Execution Command | Result |
| :--- | :--- | :--- | :--- | :---: |
| `unit/test_health.py` | Unit / System | `/health` endpoint status, root `/` metadata response | `pytest apps/api/tests/unit` | **PASSED** (2/2) |
| `integration/test_auth_security.py` | Integration / Security | Registration, password verification, 256-bit entropy session tokens, session expiration, logout invalidation, double-submit CSRF tokens, strict CORS, sliding window login throttling (429 E-RATE) | `pytest apps/api/tests/integration/test_auth_security.py` | **PASSED** (8/8) |
| `integration/test_authorization_ownership.py` | Integration / ABAC | Object-level authorization, private location redaction, non-owner opportunity modification denial (403), non-owner opportunity deletion denial (403), owner re-assignment rejection, bilateral message thread isolation | `pytest apps/api/tests/integration/test_authorization_ownership.py` | **PASSED** (6/6) |
| `integration/test_db_migrations.py` | Integration / DB | `get_db` session dependency, model metadata reflection (13 models), Alembic schema migration chain, relational cascades on account deletion, API persistence | `pytest apps/api/tests/integration/test_db_migrations.py` | **PASSED** (5/5) |
| `integration/test_domain_api_regression.py` | Integration / Regression | Opportunity compensation validation, opportunity full CRUD, fluid profile multiple offers and seeks management, taxonomy endpoints (`/domains`, `/tags`), keyword search matching, moderation reporting, staff review queue access (RBAC), self-blocking prohibition | `pytest apps/api/tests/integration/test_domain_api_regression.py` | **PASSED** (4/4) |
| **Backend Total** | — | **25 Total Test Cases** | `pytest apps/api/tests -v` | **25/25 PASSED** |

---

## 2. Playwright End-to-End Suites (`apps/web/tests/e2e`)

| Suite File | User Journey | Behaviors Verified | Execution Command | Result |
| :--- | :--- | :--- | :--- | :---: |
| `01-navigation-and-public.spec.ts` | Journey 1: Public Pages & Navigation | Home hero headline, People ↔ Opportunities ↔ People model badge, product loop, Discover page navigation, Login form navigation, Register form navigation | `npx playwright test 01-navigation` | **PASSED** (4/4) |
| `02-auth-flows.spec.ts` | Journey 2: Auth Lifecycle & Boundaries | Credential submission handling, client-side required field validation, protected `/profile` visitor handling, protected `/opportunities/new` visitor handling | `npx playwright test 02-auth-flows` | **PASSED** (4/4) |
| `03-opportunity-and-profile.spec.ts` | Journey 3: Opportunities & Transparency | Mandatory compensation badges on cards (Paid / Unpaid / Stipend), search filtering by topic/keyword, filter reset button | `npx playwright test 03-opportunity` | **PASSED** (3/3) |
| `04-accessibility-and-motion.spec.ts` | Journey 4: Accessibility & Motion | Semantic landmarks (`main`, `nav`, `footer`), `prefers-reduced-motion: reduce` compliance, keyboard navigation and input focus | `npx playwright test 04-accessibility` | **PASSED** (3/3) |
| **Playwright Total** | — | **14 End-to-End User Journeys** | `npm run test:e2e` | **14/14 PASSED** |

---

## 3. Frontend Static Analysis & Build Verification

| Verification Type | Target | Tool / Command | Result |
| :--- | :--- | :--- | :---: |
| **Static Type Safety** | `apps/web` + `@cocollaber/api-client` | `npm run typecheck` (`tsc --noEmit`) | **0 Errors (PASS)** |
| **Code Style & Linting** | `apps/web` Next.js codebase | `npm run lint` (`next lint`) | **0 Warnings / Errors (PASS)** |
| **Production Build** | 11 Static & Dynamic App Router Pages | `npm run build` (`next build`) | **11/11 Generated (PASS)** |
