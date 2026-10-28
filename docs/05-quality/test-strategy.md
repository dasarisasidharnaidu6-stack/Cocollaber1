# CoCollaber Quality Strategy & Test Architecture

## 1. Overview and Core Philosophy

CoCollaber’s testing philosophy prioritizes deterministic behavioral testing and high-risk security boundaries over superficial line-coverage vanity metrics. Because CoCollaber is a domain-agnostic collaboration platform built on the model:
**People ↔ Opportunities ↔ People**
the test architecture rigorously guards identity boundaries, multi-tenant resource ownership, compensation transparency, and session security.

---

## 2. Multi-Layer Testing Pyramid

```
                ▲
               / \
              /   \
             / E2E \       Playwright Browser Tests (14 Journeys)
            /-------\      Next.js App Router, Visual & Reduced Motion
           /  Integ  \     Backend Integration Tests (23 Tests)
          /-----------\    Auth, Sessions, ABAC Ownership, Domain APIs
         /    Unit     \   Unit Tests & Contract Schemas (2 Tests)
        /---------------\  Health, Constants, Pydantic & TS Typechecking
```

### Layer 1: Unit & Schema Verification
- **Framework**: `pytest`, `pydantic`, `tsc --noEmit`
- **Scope**:
  - Request/response payload validation.
  - Type integrity between TypeScript SDK (`@cocollaber/api-client`) and backend schemas.
  - System health probes (`/health`, `/`).

### Layer 2: Domain API & Security Integration Tests
- **Framework**: `pytest` with `httpx` / FastAPI `TestClient`, SQLAlchemy 2.0 AsyncSession.
- **Scope**:
  - Argon2id password hashing and opaque session token entropy (>= 256 bits).
  - Server-side session invalidation upon logout and expiration enforcement.
  - Double-submit CSRF cookie protection (`cocol_csrf_token` + `X-CSRF-Token`).
  - Rate limiting (in-memory sliding window throttling 429 `E-RATE-001`).
  - Strict Cross-Origin Resource Sharing (CORS) with origin whitelisting.
  - Attribute-Based Access Control (ABAC): Non-owners cannot read private profile fields, alter opportunities, delete seeks/offers, or access bilateral connection threads.
  - Role-Based Access Control (RBAC): Trust & safety review queues are restricted to `"admin"` and `"moderator"` roles.
  - Database relational integrity, schema migrations (Alembic), and foreign-key cascades.

### Layer 3: End-to-End Browser Journeys
- **Framework**: `@playwright/test` running in headless Chromium.
- **Scope**:
  - Public editorial navigation and landing page hero rendering.
  - Discovery filtering, topic search, and reset functionality.
  - Mandatory compensation transparency badge visibility across cards.
  - Authentication lifecycle, input validation, and protected route boundaries.
  - Accessibility semantics (`main`, `nav`, `footer`) and `prefers-reduced-motion` compliance.

---

## 3. Database Isolation & Safety Guarantees

- **Zero-Docker Footprint**: Tests execute natively against a dedicated SQLite test database (`test_integration_gate.db`) using pure-Python async drivers (`aiosqlite`).
- **Data Protection**: Real developer databases and production stores are never touched, migrated, truncated, or dropped during test execution.
- **Deterministic Lifecycles**: Fixtures create isolated records per test case with unique UUIDs and teardown tables upon completion.
