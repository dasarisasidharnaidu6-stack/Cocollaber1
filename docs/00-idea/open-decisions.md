# CoCollaber — Open Decisions & Working Assumptions

**Document Stage:** Phase 0 Foundation  
**Status:** Working Baseline  
**Governing Rule:** Every unapproved proposal is recorded as `ASSUMPTION`. No assumption is promoted to `CONFIRMED` without explicit stakeholder ratification.

---

## 1. Foundational Strategic Decisions

| Decision | Proposed Default | Status | Rationale | Reversibility | Dependencies | Needs Your Confirmation? |
|---|---|---|---|---|---|---|
| **Launch Focus (OD-01)** | Global-ready architecture, English UI initially, pilot geography with 3–5 initial domains (e.g., Tech, Creative Arts, Sports) | `ASSUMPTION` | A platform for "everyone" risks a fragmented cold start. Seeding dense initial communities validates the core loop. | High. Geography and seed domains are configurable data items. | Marketing & launch strategy | **Yes** — Confirm launch country/city and initial seed domains. |
| **Domain Taxonomy (OD-02)** | Hybrid taxonomy: Curated top-level domains (admin-managed) plus flexible free-form tags | `ASSUMPTION` | Pure free-form tags degrade search quality; rigid trees choke emergent creative disciplines. | High. Tags and domains are mapped via database relations. | Search & schema design | **Yes** — Confirm hybrid approach is acceptable for MVP. |
| **Account Types (OD-11)** | Single "Member" account type for MVP. Business/organization representation handled via profile label (P1) | `ASSUMPTION` | Multi-user organization accounts, role-based access, and enterprise billing add heavy complexity premature for MVP. | High. Organization entities can be introduced in P1 without breaking Member schemas. | Data model design (Phase 1) | **Yes** — Confirm deferring multi-seat organization accounts to P1. |
| **Opportunity Model (OD-03)** | Single unified Opportunity entity with `type` enum and flexible shared attributes | `ASSUMPTION` | Domain-specific database tables (e.g. `SportsOpportunity` vs `TechOpportunity`) create architectural fragility. | High. Additional attributes can be stored in structured JSONB if needed. | Schema design (Phase 1) | **Yes** — Confirm unified Opportunity entity structure. |
| **Compensation Transparency** | Mandatory disclosure enum: `paid`, `unpaid`, `stipend`, `credit_recognition`, `unspecified` with details string | `ASSUMPTION` | Prevents disguised exploitation while honoring genuine unpaid creative/volunteer collaboration. | High. Enum options can be expanded. | Opportunity validation rules | **Yes** — Confirm compensation categories. |
| **Trust, Safety & Moderation (OD-04, OD-05)** | Post-publication moderation + user reporting queue + email verification. No upfront identity/ID verification | `ASSUMPTION` | Upfront ID verification introduces massive onboarding friction and privacy overhead for an early-stage product. | High. Verification badges and proactive scanning can be layered in later. | Admin console & moderation policies | **Yes** — Confirm post-publication moderation model. |
| **Minors Eligibility (OD-06)** | 18+ only at launch, verified via self-declared Date of Birth during registration | `ASSUMPTION` | Minors require complex parental consent mechanisms, COPPA/GDPR-K compliance, and specialized child-safety guardrails. | Medium. Lowering age later requires legal terms updates and safety features. | Legal terms & registration flow | **Yes** — Confirm 18+ eligibility policy for initial launch. |
| **Payments & Transactions** | Zero on-platform payments, billing, or escrow in v1 | `CONFIRMED` | Keeps platform scope focused strictly on discovery and connection; avoids financial regulatory licensing. | High. Payment rails can be integrated in later phases (P2). | None for MVP | No — Already confirmed outside v1. |
| **Discovery & Search Mechanism** | PostgreSQL full-text search with structured facet filters. No AI/embedding recommendations | `ASSUMPTION` | Fast, predictable, zero infrastructure cost, transparent to users, and easily containerized. | High. Search query layer is isolated behind a service interface. | Database selection & API design | **Yes** — Confirm PostgreSQL full-text search for MVP. |
| **Business Model & Monetization** | Pure open access for MVP; no monetization features, paywalls, or gated participation | `CONFIRMED` | Early priority is testing liquidity and participation rates without introducing artificial friction. | High. Freemium tiers can be added once critical mass is established. | Long-term strategy | No — Already confirmed outside v1. |

---

## 2. Technical & Specification Decisions (SRS Carryover)

| SRS Decision ID | Topic | Proposed Default / SRS Recommendation | Status | Rationale & Impact |
|---|---|---|---|---|
| **SRS-OD-01** | Sign-In Methods | Email + Password only for MVP | `ASSUMPTION` | Reduces external OAuth provider dependencies during early bootstrapping. Social login can follow in Phase 2. |
| **SRS-OD-02** | Visitor Opportunity Browsing | Allow unauthenticated visitors to browse opportunity listings and detail; require login for contact/profile views | `ASSUMPTION` | Maximizes viral sharing and search engine discoverability while protecting user contact privacy. |
| **SRS-OD-03** | Prohibited Content Detection | Flag high-risk keywords for immediate admin review while publishing | `ASSUMPTION` | Avoids blocking legitimate creators with false positives during early growth. |
| **SRS-OD-04** | Location Representation | Structured string: `city`, `region`, `country_code`, plus `is_remote` boolean flag. No GIS radius calculations | `ASSUMPTION` | Avoids PostGIS complexity in MVP while satisfying 99% of location filtering needs. |
| **SRS-OD-05** | Opportunity Expiry Lifetime | 90 days default expiration if no explicit deadline is set by creator | `ASSUMPTION` | Prevents stale, abandoned opportunities from cluttering search results. |
| **SRS-OD-07** | Pre-Acceptance Messaging | Strictly prohibited. Messaging unlocks only after mutual interest acceptance | `CONFIRMED` | Eliminates unsolicited spam, stalking, and cold-pitch abuse. |
| **SRS-OD-08** | Auto-Hiding on Multiple Reports | Disabled in P0; all reports route to admin queue for human review | `ASSUMPTION` | Prevents coordinated bad-faith reporting brigades from silencing legitimate creators. |
| **SRS-OD-09** | Data Retention & Privacy | Account deletion soft-deletes profile and anonymizes personal data immediately; hard purge after 30 days | `ASSUMPTION` | Meets GDPR/CCPA standard requirements while allowing short recovery window for accidental deletion. |
| **SRS-OD-14** | Display Name & Pseudonyms | Pseudonyms permitted; impersonation strictly prohibited | `ASSUMPTION` | Protects privacy of creative and amateur contributors who do not wish to publish real legal names. |

---

## 3. Top Blocking Clarifications for Subsequent Phases

While Phase 0 can proceed safely with documented defaults, the following five targeted questions should be reviewed by the product owner before Phase 1 and Phase 2 finalize:

1. **Pilot Geography:** Which specific city/country should be used as the default seed data and localization anchor for testing (e.g., India/Bengaluru, US/San Francisco, UK/London)?
2. **Initial Seed Domains:** Are the five recommended seed domains—*Technology, Creative Arts, Music, Sports, and Social Impact*—approved for initial seed fixtures?
3. **Visitor Browsing Access:** Do you approve allowing public (unauthenticated) visitors to browse open opportunities, or must the entire platform require registration to view anything?
4. **Location Model:** Is structured text (`city`, `region`, `country`) sufficient for v1, or is geocoded radius search strictly required?
5. **Brand Logo Asset:** When can the official vector/SVG logo file be provided to replace the temporary placeholder in `apps/web/public/brand/`?
