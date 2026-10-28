# CoCollaber Phase 4: Integration Architecture Overview

## 1. System Integration Scope

CoCollaber integrates three core pillars into a cohesive, high-performance, and secure collaboration platform:
1. **Frontend (`apps/web`)**: Next.js 14 App Router application delivering responsive, accessible (WCAG AA), and motion-enhanced UI built on the warm editorial brand palette (`#F8EFE3`, `#3B1E08`, `#8B5A36`, `#DDAA66`, `#F1C888`).
2. **API Client (`packages/api-client`)**: Strongly typed TypeScript SDK communicating with the REST backend, managing cookie credentials, CSRF token headers, and domain response types.
3. **Backend (`apps/api`)**: FastAPI asynchronous web application running on Python 3.12, backed by SQLAlchemy 2.0 ORM, Alembic migrations, Argon2id security hashing, and in-memory rate limiting.

---

## 2. Full-Stack Request Flow & Lifecycle

```
[ Browser / Next.js Client ]
             │
             │ HTTPS (Cookie: cocol_session=...; X-CSRF-Token: ...)
             ▼
[ FastAPI Application (`apps/api/app/main.py`) ]
             │
   ┌─────────┴─────────────────────────────────────────────┐
   │ Middleware Pipeline:                                  │
   │ 1. CORSMiddleware (strict allow-origin, credentials)  │
   │ 2. RateLimitMiddleware (sliding window throttler)     │
   │ 3. CSRFMiddleware (double-submit verification)        │
   │ 4. Exception Handler (maps CoCollaberException -> SRS)│
   └─────────┬─────────────────────────────────────────────┘
             │
             ▼
[ Dependency Injection & Domain Routing ]
   - `get_db` (AsyncSession lifecycle)
   - `get_current_account` & `get_current_active_member` (Session lookup)
   - `assert_opportunity_creator` / `assert_connection_participant` (ABAC)
             │
             ▼
[ SQLAlchemy 2.0 ORM & Database Layer ]
   - Models: Accounts, Members, Opportunities, Interactions, Messages, Reports
   - Strict FK cascading, indices, and audit timestamps
             │
             ▼
[ JSON Serialization & Cookie Synchronization ]
   - Response validation via Pydantic V2 schemas
   - HttpOnly, SameSite=Lax/Strict session cookies + cocol_csrf_token
```

---

## 3. Core Integrated User Journeys

### Journey 1: Authentication & Identity Management
- **Registration**: Client sends email, username, display_name, password. Backend hashes password using Argon2id, generates Member profile, sets `cocol_session` and `cocol_csrf_token`.
- **Login**: Verifies credentials, invalidates or refreshes session records, writes secure cookies.
- **Throttling**: 5 failed login attempts per minute trigger `429 Too Many Requests` (`E-RATE-001`).
- **Logout**: Explicitly deletes the session record from the database and zeroes out browser cookies.

### Journey 2: Profile & Multi-Identity Management (Offers & Seeks)
- User profile exposes structured capabilities ("Offers") and collaboration aspirations ("Seeks").
- Full CRUD operations with ABAC ownership checks: members can only update or delete their own offers/seeks.

### Journey 3: Opportunity Lifecycle & Discovery
- **Creation**: Member publishes an opportunity with domain, tags, and transparent compensation metadata (status: paid / unpaid / expense-covered).
- **Discovery**: Public discovery endpoint `/api/v1/discovery/search` supports multi-attribute filtering (domain, compensation, search query, pagination) with instant UI updates.
- **Ownership**: Edit and delete routes are strictly protected (`403 Forbidden` / `404 Not Found` upon unauthorized attempt).

### Journey 4: Interactions, Connections & Messaging
- **Interactions**: Members express interest in published opportunities.
- **Connections & Messages**: Two members connect and exchange direct messages. Endpoints strictly enforce participant assertions (`assert_connection_participant`), preventing third-party snooping.

### Journey 5: Trust, Safety & Moderation
- **Reporting**: Authenticated members submit moderation reports on suspect opportunities or profiles with standardized categories and reason descriptions.
- **Resolution**: Administrative moderation endpoints require privileged roles (`require_roles("admin", "moderator")`).

---

## 4. Reduced-Motion & Visual Continuity

- All GSAP and ScrollTrigger animations honor the system setting `prefers-reduced-motion: reduce`.
- When reduced-motion is requested:
  - Animation durations drop to zero or subtle instantaneous cross-fades.
  - Layout calculations and DOM nodes remain fully mounted and functional.
  - Navigation, tab interactions, and modal popups operate smoothly without visual disorientation.
