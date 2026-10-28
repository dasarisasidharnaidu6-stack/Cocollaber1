# CoCollaber Phase 4: API Contract & Routing Map

This document defines the formal contract mapping between the Next.js frontend pages/components, the TypeScript SDK (`packages/api-client`), and the backend REST API endpoints (`apps/api`).

---

## 1. Authentication & Session Module (`/api/v1/auth`)

| Method | Endpoint | Frontend Page / Hook | Auth Required | CSRF Checked | Request Body / Params | Expected Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | `/register` | No | No (Public) | `RegisterRequest`: `{email, username, password, display_name}` | `AccountResponse`: `{id, email, username, display_name, roles}` + Set-Cookie (`cocol_session`, `cocol_csrf_token`) | `400 E-AUTH-001`, `422 Validation` |
| `POST` | `/api/v1/auth/login` | `/login` | No | No (Public) | `LoginRequest`: `{email, password}` | `AccountResponse`: `{id, email, username, display_name, roles}` + Set-Cookie (`cocol_session`, `cocol_csrf_token`) | `401 E-AUTH-002`, `429 E-RATE-001` |
| `POST` | `/api/v1/auth/logout` | Global Header / Navigation | Yes (`cocol_session`) | Yes (`X-CSRF-Token`) | None | `{status: "logged_out"}` + Clear-Cookie | `401 E-AUTH-003`, `403 E-CSRF-001` |
| `GET` | `/api/v1/auth/me` | Auth Provider / Layout | Yes (`cocol_session`) | No (Safe GET) | None | `AccountResponse` | `401 E-AUTH-003` |

---

## 2. Members & Profiles Module (`/api/v1/members`)

| Method | Endpoint | Frontend Page / Component | Auth Required | CSRF Checked | Description & Contract |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/members/me` | `/profile` | Yes | No | Retrieves current member's profile, including their registered offers and seeks. |
| `PUT` | `/api/v1/members/me` | `/profile` edit form | Yes | Yes | Updates member headline, bio, location, and visibility flags. |
| `POST` | `/api/v1/members/me/offers` | `/profile` Offer Manager | Yes | Yes | Adds a new capability or offering to the member's profile. |
| `DELETE`| `/api/v1/members/me/offers/{id}` | `/profile` Offer Manager | Yes | Yes | Deletes an offer owned by the current member (`403` if unowned). |
| `POST` | `/api/v1/members/me/seeks` | `/profile` Seek Manager | Yes | Yes | Adds a new collaboration aspiration or seek to the member's profile. |
| `DELETE`| `/api/v1/members/me/seeks/{id}` | `/profile` Seek Manager | Yes | Yes | Deletes a seek owned by the current member (`403` if unowned). |
| `GET` | `/api/v1/members/{id}` | Public profile modal | Public / Optional | No | Retrieves public details, active offers, and active seeks. |

---

## 3. Opportunities Module (`/api/v1/opportunities`)

| Method | Endpoint | Frontend Route / Component | Auth Required | CSRF Checked | Contract & Access Control |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/opportunities` | `/opportunities/new` | Yes | Yes | Creates an opportunity. Requires title, description, domain_id, and compensation details. |
| `GET` | `/api/v1/opportunities/{id}` | `/opportunities/[id]` | Public / Optional | No | Retrieves full opportunity details, compensation transparency badges, and owner info. |
| `PUT` | `/api/v1/opportunities/{id}` | `/opportunities/[id]/edit` | Yes (Owner only) | Yes | Updates opportunity fields. Enforces ABAC `assert_opportunity_creator`. Returns `403` if caller is not the owner. |
| `DELETE`| `/api/v1/opportunities/{id}` | `/opportunities/[id]` | Yes (Owner only) | Yes | Marks or removes opportunity. Enforces ABAC `assert_opportunity_creator`. Returns `403` if unauthorized. |

---

## 4. Discovery Module (`/api/v1/discovery`)

| Method | Endpoint | Frontend Route | Auth Required | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/discovery/search` | `/discover` | Public | `q`, `domain_id`, `compensation_status`, `page`, `page_size` | Returns paginated opportunity cards with search matching across titles, descriptions, and tags. |
| `GET` | `/api/v1/discovery/domains` | Filter Bar / Category Grid | Public | None | Returns list of platform taxonomy domains. |
| `GET` | `/api/v1/discovery/tags` | Filter Bar / Autocomplete | Public | `domain_id`, `limit` | Returns top popular tags for filtering. |

---

## 5. Interactions & Messaging Module (`/api/v1/interactions` & `/api/v1/messages`)

| Method | Endpoint | Frontend Component | Auth Required | Security Check | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/interactions` | `/opportunities/[id]` "Express Interest" | Yes | CSRF | Member signals interest in an opportunity with an optional intro message. |
| `GET` | `/api/v1/interactions/my` | `/profile` (Activity Tab) | Yes | Own records only | Lists all outbound and inbound expressions of interest for the member. |
| `GET` | `/api/v1/messages/connections` | `/messages` (Sidebar) | Yes | Own records only | Lists active bilateral connections. |
| `GET` | `/api/v1/messages/connections/{id}/messages` | `/messages` (Thread) | Yes | `assert_connection_participant` | Retrieves chronological message history. Returns `403` if caller is not a participant. |
| `POST` | `/api/v1/messages/connections/{id}/messages` | `/messages` (Composer) | Yes | CSRF + `assert_connection_participant` | Sends a message into the thread. |

---

## 6. Moderation Module (`/api/v1/moderation`)

| Method | Endpoint | Frontend Component | Auth Required | RBAC Level | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/moderation/reports` | Modal Report Dialog | Yes | Any Member (CSRF) | Submits abuse, spam, or misconduct report against an opportunity or member. |
| `GET` | `/api/v1/moderation/reports` | `/moderation` (Admin Queue) | Yes | `require_roles("admin", "moderator")` | Returns pending reports queue for review. |
| `POST` | `/api/v1/moderation/reports/{id}/resolve`| `/moderation` (Action Dialog) | Yes | `require_roles("admin", "moderator")` | Updates report resolution status and action notes. |
