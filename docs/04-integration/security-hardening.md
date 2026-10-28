# CoCollaber Phase 4: Security Hardening & Threat Mitigation

This document details the concrete security controls, cryptographic safeguards, and protocol-level hardening implemented in Phase 4.

---

## 1. Authentication & Session Architecture

### Cryptographic Password Hashing
- Password hashing is enforced exclusively using **Argon2id** via `passlib.context.CryptContext(schemes=["argon2"])`.
- Plaintext passwords never enter memory beyond the immediate verification step.
- Resistance to GPU/ASIC brute-forcing with strict memory and time cost factors.

### Opaque Session Identifiers
- Session identifiers are generated using cryptographically secure pseudorandom generators (`secrets.token_urlsafe(32)`), guaranteeing >= 256 bits of entropy.
- Sessions are stored server-side in the `sessions` table linked to the `accounts` record.
- Cookie configuration:
  - `cocol_session`: `HttpOnly=True`, `SameSite=Lax` (or `Strict` for sensitive sub-contexts), `Secure=True` in production.
  - Zero sensitive account information is serialized in client-accessible storage or JWTs without verification.
- **Session Expiration & Revocation**:
  - Expiration timestamp is validated upon every request via `get_current_account`. Expired sessions return `401 Unauthorized` (`E-AUTH-003`).
  - Logout completely deletes the session row from the database, rendering any subsequent attempts with the same cookie invalid (`401 Unauthorized`).

---

## 2. Double-Submit Cookie CSRF Mitigation

Cross-Site Request Forgery is strictly mitigated at the application gateway (`apps/api/app/middleware/csrf.py`):
1. **Cookie & Header Pairing**:
   - On successful authentication, the server emits a cryptographically random `cocol_csrf_token` cookie (`HttpOnly=False`, readable by client JavaScript).
   - For all mutating HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`), the client must echo this value in the `X-CSRF-Token` request header.
2. **Exemptions**:
   - Safe HTTP methods (`GET`, `HEAD`, `OPTIONS`) are exempt from CSRF checks.
   - Public unauthenticated onboarding endpoints (`/api/v1/auth/login`, `/api/v1/auth/register`, `/health`, `/`) do not require CSRF headers.
3. **Constant-Time Verification**:
   - Token comparison uses `hmac.compare_digest(cookie_token, header_token)` to prevent timing side-channel attacks.
   - Missing or mismatching tokens immediately abort the request with `403 Forbidden` (`E-CSRF-001`).

---

## 3. Strict CORS (Cross-Origin Resource Sharing)

- Configured via FastAPI's `CORSMiddleware`:
  - `allow_origins`: Explicitly whitelisted frontend origin (`http://localhost:3000` in dev, production domain in prod).
  - Wildcard `allow_origins=["*"]` is strictly prohibited when `allow_credentials=True`.
  - Disallowed origins attempting credentialed requests are rejected by browsers and middleware, verified empirically by `test_cors_rejects_arbitrary_origins_with_credentials`.

---

## 4. Rate Limiting & Throttling Defense

- Implemented via `apps/api/app/middleware/rate_limit.py`.
- Employs an in-memory sliding-window algorithm tracking IP addresses and target paths.
- **Login Throttling**:
  - Maximum of 5 attempts per 60-second window on `/api/v1/auth/login`.
  - Exceeding the threshold triggers immediate short-circuiting with `429 Too Many Requests` (`E-RATE-001`).
  - Protects against credential stuffing and automated dictionary attacks.

---

## 5. Authorization & Access Control (RBAC & ABAC)

### Object Ownership & Tenant Isolation (ABAC)
- **Opportunity Modification/Deletion**:
  - `assert_opportunity_creator` loads the target record and compares `opportunity.creator_member_id` with `current_member.id`.
  - Non-owners are denied with `403 Forbidden` (`E-PERM-001`).
  - Owner ID is immutable; attempts by malicious actors to reassign `creator_member_id` via payload injection are rejected or ignored.
- **Private Thread Isolation**:
  - `assert_connection_participant` verifies that the requesting member is either `member_a_id` or `member_b_id` of the connection.
  - Third parties attempting to read thread messages receive `403 Forbidden`.

### Role-Based Access Control (RBAC)
- Moderation review and resolution endpoints (`/api/v1/moderation/*`) require explicit role membership verified by `require_roles("admin", "moderator")`.
- Standard members attempting to access administrative moderation queues are rejected with `403 Forbidden`.
