# CoCollaber — Product Requirements & Source Synthesis

**Document Stage:** Phase 0 Foundation  
**Status:** Approved for Baseline Reference  
**Sources of Truth:**  
- `Idea Document v1.0` (`Idea Document v1.pdf`)
- `Product Requirements Document (PRD) v1.0` (`PRD v1 .pdf`)
- `Software Requirements Specification (SRS) v1.0` (`SRS v1 .pdf`)

---

## 1. Product Overview

CoCollaber is an open, global, domain-agnostic opportunity and collaboration ecosystem. It connects people from every domain—including technology, sports, arts, music, research, business, social impact, skilled trades, hobbies, and beyond—with opportunities, people, projects, and experiences.

**The Central Question:**
> *"What opportunity are you looking for, and what opportunity can you offer?"*

Unlike existing platforms that divide human endeavor into rigid silos (employment, freelance gigs, social status feeds, or specialized hobby forums), CoCollaber provides a single structured environment where anyone can discover possibilities, showcase what they can offer, and create opportunities for others.

---

## 2. Core Problem Being Addressed

1. **Fragmentation & Invisibility:** Opportunities are scattered across disparate job boards, social media feeds, private messaging groups (WhatsApp/Telegram), pinboards, and word-of-mouth networks.
2. **Access Gatekeeping:** Access currently hinges on *who you already know* rather than *what you can do or want to do*.
3. **Neglected Participation Modes:** Innumerable non-corporate and informal collaborations (a band needing a drummer, a local team needing a goalkeeper, a researcher needing undergraduate field assistance, a grassroots community clean-up drive) have no natural, structured home online.
4. **Identity Splintering:** Individuals with diverse skills and interests are forced to fragment their identities across different single-purpose platforms.
5. **Creator Reach Limits:** Individuals and small organizations offering opportunities struggle to reach relevant participants outside their personal or immediate geographic networks.

---

## 3. Intended Users and Audiences

The platform is designed to serve anyone with a legitimate goal or something to offer (`CONFIRMED`). Illustrative categories include:
- **Students & Academics:** Seeking research experience, study partners, or mentorship.
- **Athletes & Sports Teams:** Seeking local players, clubs, or tournament entries.
- **Artists & Designers:** Seeking exhibitions, open calls, and co-creators.
- **Musicians & Performers:** Seeking band members, gigs, and audio collaborators.
- **Digital Creators:** Seeking editors, thumbnail designers, and co-hosts.
- **Founders & Innovators:** Seeking technical co-founders, early advisors, and pilot testers.
- **Small Businesses & Cafés:** Seeking short-term photographers, local event help, or freelance services.
- **Communities & Volunteers:** Seeking participants, organizers, and social contributors.
- **Multi-Hyphenates:** Individuals with diverse, concurrent pursuits (e.g., software engineer who shoots weddings, plays football, and volunteers).

---

## 4. User Roles and Multiple Identities

- **Fluid, Resource-Level Roles (`CONFIRMED`):** A member is never locked into a "creator-only" or "seeker-only" persona. The same individual can be a creator of an opportunity in the morning and a seeker of an unrelated opportunity in the evening.
- **Multi-Identity Architecture (`CONFIRMED`):** Users maintain a single profile that expresses multiple interests across unrelated domains without being coerced into choosing a single "primary" professional category.
- **Entity Representation (`ASSUMPTION` / `OPEN`):** For MVP, all actors register as individual members (`CONFIRMED`). Representatives of businesses or communities post through their personal accounts (`CONFIRMED`). Formal organization/community accounts are deferred to P1 (`OUT OF V1`).

---

## 5. People ↔ Opportunities ↔ People Model

The core relational architecture of CoCollaber is:
```text
Person (Seeker) ──► Opportunity ◄── Person (Creator)
      ▲                                   │
      └────────── Connection, Collaboration, Growth ──┘
```
- People create opportunities.
- People discover and express interest in opportunities.
- Opportunities serve as the bridge connecting people to one another.
- Collaborations produce real-world outcomes (projects, teams, events, learning) that catalyze further opportunities.

---

## 6. Core Product Loop

The self-reinforcing six-step product loop:
1. **Express:** A member declares what they seek and what they can offer.
2. **Discover:** The member discovers relevant opportunities and people via search, filters, and interest matching.
3. **Connect:** The member sends an expression of interest with an introductory message; the creator reviews and accepts.
4. **Collaborate:** Accepted parties communicate directly and participate in the activity, team, or project.
5. **Grow:** Both parties confirm participation, building a verifiable record on their public profiles.
6. **Create:** Inspired and empowered, the member posts new opportunities for others, restarting the cycle.

---

## 7. Confirmed Product Principles

1. **Open & Inclusive:** Access over gatekeeping; background and credential pedigree do not dictate participation.
2. **Domain-Agnostic by Design:** Technology, sports, arts, trades, and hobbies are treated as first-class citizens.
3. **Opportunity-First:** The unit of value is the opportunity and the connection it creates, not follower counts or engagement feeds.
4. **Fluid Roles:** Every user can both seek and offer; roles are contextual to each specific opportunity.
5. **Foundational Trust & Safety:** Trust is proactive and built into the core workflows, not treated as an afterthought.
6. **Simplicity over Feature Accumulation:** Focus strictly on facilitating discovery, connection, and collaboration.
7. **Absolute Transparency:** The nature, terms, and compensation of every opportunity must be clearly stated upfront.

---

## 8. Confirmed MVP Scope (P0)

As ratified in PRD v1.0 §21 and SRS v1.0 §4:
- **Authentication & Onboarding:** Email/password registration, email verification (single-use token, 24h expiry), age validation (≥18), interest onboarding (skippable).
- **Profiles:** Display name, bio, location, interest tags, offers (≤10), and seeks (≤10).
- **Opportunity Lifecycle:** Creation, editing, closing, marking filled/in-progress, deleting; explicit compensation declaration (paid, unpaid, stipend, credit, or unspecified).
- **Discovery & Search:** Keyword search, multi-faceted filtering (domain, type, compensation, location/remote, recency), and interest-matched home feed.
- **People Discovery:** Browsing and filtering member profiles by skill and domain.
- **Interest & Connection:** Express interest with message (10–1,000 chars), withdraw interest, creator accept/decline.
- **Direct Messaging:** 1-to-1 secure in-app messaging strictly between accepted parties for a specific opportunity.
- **Participation Confirmation:** Dual confirmation of start by both creator and seeker, recording verified participation.
- **Trust, Safety & Moderation:** Report content/members, block members, internal admin moderation queue (review reports, remove content, suspend accounts), community guidelines.
- **System Communications:** In-app and email event notifications.

---

## 9. Explicitly Excluded or Future Functionality (Out of V1)

The following items are explicitly out of scope for MVP:
- **Reputation Scoring & Badges (`OUT OF V1` - P1/P2):** Complex endorsement algorithms, public star ratings, or trust scores.
- **AI-Based / Algorithmic Smart Matching (`OUT OF V1` - P2):** Embedding-based recommendations or autonomous agent matchmakers.
- **Organization & Community Hubs (`OUT OF V1` - P1):** Sub-organizations, company multi-seat accounts, community pages.
- **On-Platform Payments & Escrow (`OUT OF V1` - P2):** Financial transactions, escrow contracts, or in-platform invoicing.
- **Event & Competition Tooling (`OUT OF V1` - P2):** Bracket management, ticketing, or complex tournament operations.
- **Pre-Acceptance Cold Messaging (`OUT OF V1`):** Direct messaging strangers without an accepted opportunity interest (prohibited to prevent spam).
- **Native Mobile Apps (`OUT OF V1` - P1/P2):** iOS/Android native builds; responsive web is the sole target.
- **Minor / Under-18 Participation (`OUT OF V1`):** Requires specialized legal consent frameworks.

---

## 10. Functional Requirements Summary

Supported directly by PRD §20 and SRS §7:
- **AUTH-001–008:** Account registration, email verification, login/logout, password reset, account deletion.
- **ONB-001–003:** Interest selection, declaring offers & seeks, onboarding completion.
- **PROF-001–009:** Profile view/edit, interest/offer/seek management, privacy visibility controls.
- **OPP-001–008:** Create, view, edit, close, fill, remove opportunities; status validation.
- **DISC-001–005:** Opportunity browsing, full-text search, multi-criteria filtering, interest feed matching.
- **PEOP-001–003:** People search, filtering by skills and domains.
- **INT-001–006:** Express interest, view applicants, accept, decline, withdraw.
- **MSG-001–007:** 1-to-1 messaging thread tied to accepted interest, real-time message exchange, caution banner.
- **PART-001–005:** Dual start confirmation, recording participation record on profile.
- **NOTIF-001–004:** Notification delivery for key lifecycle events (interest, acceptance, message).
- **MOD-001–007:** Reporting mechanism, user blocking, admin moderation console, suspension cascade.
- **ADM-001–007:** Admin user management, domain management, audit trail logging.

---

## 11. Non-Functional Requirements Summary

Supported by PRD §20.9 and SRS §11:
- **Performance:** 
  - Standard page/endpoint API responses: `< 500 ms` at p95 under standard load.
  - Search queries: `< 800 ms` at p95.
  - Messaging delivery: `< 1,000 ms`.
- **Availability:** 99.5% uptime target during pilot operating hours.
- **Device Support:** Fully responsive across mobile (360px+ viewport), tablet, and desktop browsers (Chrome, Safari, Firefox, Edge).
- **Data Protection:** Zero plain-text passwords (Argon2id/bcrypt), HTTPS enforcement, secure HTTP-only session cookies or JWT storage, role-based access control.
- **Rate Limiting:** Protect registration, login, search, and message posting endpoints from abuse.

---

## 12. Trust, Safety, Privacy, Security & Abuse Prevention

- **Prohibited Opportunities:** Clear terms prohibiting fraud, pyramid schemes, upfront fee requirements, sexual exploitation, harassment, and unsafe labour.
- **Compensation Transparency:** Mandatory disclosure of whether an opportunity is paid, unpaid, stipend-based, or credit-based.
- **Abuse Containment:** Unaccepted users cannot initiate unsolicited messages. Blocked members are instantly hidden across searches, threads, and opportunity lists.
- **Auditability:** Admin actions (suspensions, removals) are logged with non-repudiable audit records.
- **Privacy Controls:** Email addresses and private phone numbers are never exposed publicly. Users can request account deletion, wiping or anonymizing personal identifiers per privacy regulations.

---

## 13. Integration Requirements & Status

- **Email Delivery Service:** Required for transaction emails (verification tokens, password resets, activity notices). Specific provider (SendGrid / Postmark / SES) deferred to Phase 1/Phase 2 (`OPEN`).
- **Analytics Sink:** Product event capture required per PRD §29. Implementation tooling deferred (`OPEN`).
- **Payment Gateways:** **NONE CONFIRMED.** Explicitly confirmed that no payment gateway is integrated in v1 (`CONFIRMED`).
- **OAuth / Social Login:** Evaluated in SRS-OD-01; default is Email + Password only for MVP (`ASSUMPTION`).

---

## 14. Scalability Considerations

- **Domain Expansion:** Adding a new domain (e.g., Robotics, Woodworking) requires zero database migrations or UI redesign; domains are data records, not code structures.
- **Stateless Application Tier:** The backend API is designed as a stateless REST service, allowing horizontal scaling behind a reverse proxy or load balancer.
- **Search Scale:** Search queries utilize PostgreSQL full-text search initially, isolated behind a repository/service boundary so Elasticsearch or Meilisearch can be introduced if search volume increases.

---

## 15. Risks Translated into Product Requirements

| Identified Risk | Source Document | Product Requirement / Mitigation |
|---|---|---|
| **Cold Start / Sparse Platform** | PRD §30, Idea Doc §28 | Seed focused domain cohorts at launch; streamline opportunity posting to `< 3 minutes`. |
| **Scams & Labor Exploitation** | PRD §25, SRS §12 | Mandatory compensation disclosure; prominent reporting buttons; proactive caution banner on messaging. |
| **Spam / Cold Outreach** | PRD §20.6, SRS §7.6 | Strict firewall: messaging unlocked only *after* mutual acceptance of an expression of interest. |
| **Irrelevant Search Results** | PRD §20.4, SRS §7.4 | Multi-criteria faceted search (domain, remote, type, compensation) rather than unconstrained keyword search. |
| **Follow-Through Breakdown** | PRD §12 (UP7), SRS §7.8 | Explicit "Confirm Participation" dual handshake to record completion of connection phase. |

---

## 16. Dependencies on Unresolved Decisions

- **Launch Focus (OD-01):** The initial pilot geography and 3–5 launch domains dictate seed data scripts and sample content.
- **Location Model (SRS-OD-04):** Whether location is stored as simple country/city text or geocoded lat/long affects database column types in Phase 1.
- **Data Retention & Legal Jurisdictions (OD-09 / SRS-OD-09):** Retention periods for deleted accounts and moderation logs depend on regulatory review.

---

## 17. Known Limitations and Source Document Gaps

1. **Source Document Filename Variances:** The approved PDFs are named `Idea Document v1.pdf`, `PRD v1 .pdf`, and `SRS v1 .pdf` (containing spaces). They have been preserved and referenced accordingly.
2. **Logo Asset Absence:** No digital vector or raster logo file was provided in the repository root. A brand placeholder reference is established, noting that official vector assets must be supplied prior to Phase 3.
3. **No Prior Codebase:** The repository was initialized without prior frontend or backend code, allowing a clean implementation of the target architecture.

---

## 18. Requirements Traceability Matrix

| Requirement Area | Status | Source Document & Section | Notes / Scope |
|---|---|---|---|
| Central Question & Definition | `CONFIRMED` | Idea Doc §2, §7, §30 | Core identity of CoCollaber |
| People ↔ Opportunities ↔ People | `CONFIRMED` | Idea Doc §13; PRD §15 | Foundational relationship model |
| 6-Step Product Loop | `CONFIRMED` | Idea Doc §14; PRD §18 | Express → Discover → Connect → Collaborate → Grow → Create |
| Fluid Roles & Multi-Identity | `CONFIRMED` | Idea Doc §12; PRD §20.2 | One profile, multiple domain interests |
| Mandatory Compensation Transparency | `CONFIRMED` | Idea Doc §11; PRD §20.3; SRS §7.3 | Paid, unpaid, stipend, or credit disclosed |
| Email + Password Auth & Verify | `CONFIRMED` | PRD §20.1; SRS §7.1 | Verification token required before active status |
| Profile Offers & Seeks (≤10 each) | `CONFIRMED` | PRD §20.2; SRS §7.2 | Structured self-expression |
| Opportunity CRUD & Status Flow | `CONFIRMED` | PRD §16, §20.3; SRS §7.3, §17.2 | Draft → Open → In Progress/Filled → Closed |
| Faceted Search & Browse | `CONFIRMED` | PRD §20.4; SRS §7.4 | Domain, type, compensation, location |
| Express Interest (10–1000 chars) | `CONFIRMED` | PRD §20.5; SRS §7.5 | Single submission per member per opportunity |
| Controlled 1-to-1 Messaging | `CONFIRMED` | PRD §20.6; SRS §7.6 | Thread created upon acceptance only |
| Dual Participation Confirmation | `CONFIRMED` | PRD §20.5; SRS §7.8 | Both parties confirm start of collaboration |
| Reporting & User Blocking | `CONFIRMED` | PRD §20.7; SRS §7.10 | Content and profile reports; bidirectional block |
| Admin Moderation Queue | `CONFIRMED` | PRD §20.8; SRS §7.11 | Review reports, take punitive actions |
| 18+ Minimum Age Restriction | `ASSUMPTION` | PRD OD-06; SRS GV-11 | Self-declared date of birth check |
| Post-Publication Moderation | `ASSUMPTION` | PRD OD-04; SRS §20.1 | Published immediately, moderated upon report |
| Hybrid Taxonomy (Curated + Tags)| `ASSUMPTION` | PRD OD-02; SRS §20.1 | Fixed domains, user-generated tags |
| Responsive Web Only | `ASSUMPTION` | PRD OD-08; SRS §20.1 | Next.js App Router responsive layout |
| Organization / Community Accounts | `OUT OF V1` | PRD OD-11, §21; SRS §4 | P1 capability |
| AI Matching & Smart Recommendations| `OUT OF V1` | PRD §6, §21; SRS §4 | P2 capability |
| On-Platform Payments & Billing | `OUT OF V1` | PRD §6, §27; SRS §4 | P2 capability |
