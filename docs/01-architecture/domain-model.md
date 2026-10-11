# CoCollaber — Domain Model Specification

**Document Stage:** Phase 1 Architecture Foundation  
**Status:** Approved Domain Model Baseline  
**Governing Rule:** Derived strictly from approved product specifications (PRD v1.0, SRS v1.0, and Phase 0 requirements synthesis).

---

## 1. Domain Entities & Specifications

### 1. Account (`accounts`)
* **Purpose:** Represents the core authentication and identity record for every registered member or staff user.
* **Fields:**
  * `id`: UUID (Primary Key, default `gen_random_uuid()`)
  * `email`: VARCHAR(254) (Required, Unique case-insensitively, indexed)
  * `hashed_password`: VARCHAR(255) (Required, hashed with Argon2id/bcrypt)
  * `account_type`: VARCHAR(32) (Required, default `'person'`; proposed extension points: `'organization'`, `'community'` per OD-11, tagged `ASSUMPTION`)
  * `role`: VARCHAR(32) (Required, default `'member'`; values: `'member'`, `'moderator'`, `'admin'`)
  * `status`: VARCHAR(32) (Required, default `'unverified'`; values: `'unverified'`, `'active'`, `'suspended'`, `'deleted'`)
  * `date_of_birth`: DATE (Required for age verification ≥18 per SRS GV-11 / OD-06, tagged `ASSUMPTION`)
  * `email_verified_at`: TIMESTAMPTZ (Nullable)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)
  * `deleted_at`: TIMESTAMPTZ (Nullable, for soft-deletion per SRS-OD-09)
* **Ownership & Access:** Owned solely by the account holder. Admin/moderator read-only access for trust & safety enforcement.

---

### 2. Profile (`profiles`)
* **Purpose:** The public and multi-identity persona of a member.
* **Fields:**
  * `id`: UUID (Primary Key)
  * `account_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE, Unique, indexed)
  * `display_name`: VARCHAR(60) (Required, 2–60 chars per GV-4; pseudonyms permitted per SRS-OD-14)
  * `headline`: VARCHAR(120) (Optional, short summary of fluid pursuits)
  * `bio`: TEXT (Optional, ≤500 chars per GV-4)
  * `location_text`: VARCHAR(100) (Optional, structured country/city text per SRS-OD-04, tagged `ASSUMPTION`)
  * `is_location_public`: BOOLEAN (Required, default `true`)
  * `avatar_url`: VARCHAR(2048) (Optional)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)
* **Ownership:** 1-to-1 relationship with `Account`. Mutable only by the account owner.

---

### 3. Member Offer (`member_offers`) & Member Seek (`member_seeks`)
* **Purpose:** Explicit statements of what a member can provide and what opportunities or collaborators they are actively seeking (core step 1: Express).
* **Fields (Both Tables):**
  * `id`: UUID (Primary Key)
  * `profile_id`: UUID (Foreign Key &rarr; `profiles.id` ON DELETE CASCADE, indexed)
  * `title`: VARCHAR(80) (Required, 3–80 chars per GV-9)
  * `description`: VARCHAR(300) (Optional, ≤300 chars per GV-9)
  * `display_order`: INTEGER (Required, default `0`)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)
* **Constraints:** Enforced limit of ≤10 offers and ≤10 seeks per profile (SRS GV-9).

---

### 4. Domain (`domains`) & Tag (`tags`)
* **Purpose:** Open, domain-agnostic taxonomy system.
* **`domains` Fields:**
  * `id`: UUID (Primary Key)
  * `name`: VARCHAR(60) (Required, Unique, indexed, e.g., "Technology", "Creative Arts", "Music", "Sports")
  * `slug`: VARCHAR(80) (Required, Unique, indexed)
  * `is_active`: BOOLEAN (Required, default `true`)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
* **`tags` Fields:**
  * `id`: UUID (Primary Key)
  * `name`: VARCHAR(40) (Required, Unique case-insensitively, indexed, ≤40 chars per GV-8)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
* **`member_interests` (Profile &harr; Domain Join):**
  * `profile_id`: UUID (FK &rarr; `profiles.id` ON DELETE CASCADE)
  * `domain_id`: UUID (FK &rarr; `domains.id` ON DELETE CASCADE)
  * Composite PK: `(profile_id, domain_id)`

---

### 5. Opportunity (`opportunities`)
* **Purpose:** The fundamental unit of collaboration and discovery on CoCollaber.
* **Fields:**
  * `id`: UUID (Primary Key)
  * `creator_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE RESTRICT, indexed)
  * `title`: VARCHAR(120) (Required, 5–120 chars per GV-5)
  * `description`: TEXT (Required, 20–5,000 chars per GV-5)
  * `opportunity_type`: VARCHAR(40) (Required, e.g., `'collaboration'`, `'team_membership'`, `'event_competition'`, `'volunteering'`, `'learning_research'`, `'paid_work'`, `'other'`)
  * `status`: VARCHAR(32) (Required, default `'open'`; values: `'draft'`, `'open'`, `'in_progress'`, `'filled'`, `'closed'`, `'removed'`)
  * `compensation_type`: VARCHAR(32) (Required, mandatory transparency: `'paid'`, `'unpaid'`, `'stipend'`, `'credit_recognition'`, `'unspecified'`)
  * `compensation_details`: VARCHAR(300) (Optional, ≤300 chars, details of compensation or benefits)
  * `is_remote`: BOOLEAN (Required, default `true`)
  * `location_text`: VARCHAR(100) (Optional, location if in-person or hybrid)
  * `deadline`: TIMESTAMPTZ (Optional; default expiry calculated per SRS-OD-05 at 90 days, tagged `ASSUMPTION`)
  * `attributes`: JSONB (Default `'{}'`, flexible extensible attributes without table bloat)
  * `tsv_search`: TSVECTOR (PostgreSQL full-text search vector indexed via GIN)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`, indexed for recency)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)
  * `deleted_at`: TIMESTAMPTZ (Nullable, for soft-deletion)
* **Relations:**
  * `opportunity_domains`: Mapping to 1–3 domains (SRS GV-8).
  * `opportunity_tags`: Mapping to ≤10 tags (SRS GV-8).

---

### 6. Interest (`interests`)
* **Purpose:** Expressed desire by a member to take part in an opportunity.
* **Fields:**
  * `id`: UUID (Primary Key)
  * `opportunity_id`: UUID (Foreign Key &rarr; `opportunities.id` ON DELETE CASCADE, indexed)
  * `seeker_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE, indexed)
  * `message`: TEXT (Required, 10–1,000 chars per GV-6)
  * `status`: VARCHAR(32) (Required, default `'pending'`; values: `'pending'`, `'accepted'`, `'declined'`, `'withdrawn'`)
  * `responded_at`: TIMESTAMPTZ (Nullable)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)
* **Constraints:** Unique index on `(opportunity_id, seeker_id)` — a member may submit only one active interest per opportunity.

---

### 7. Connection & Thread (`connections`, `threads`, `messages`)
* **Purpose:** Controlled, permissioned communication unlocked strictly upon mutual acceptance.
* **`connections` Fields:**
  * `id`: UUID (Primary Key)
  * `interest_id`: UUID (Foreign Key &rarr; `interests.id` ON DELETE CASCADE, Unique)
  * `opportunity_id`: UUID (Foreign Key &rarr; `opportunities.id` ON DELETE CASCADE)
  * `creator_id`: UUID (Foreign Key &rarr; `accounts.id`)
  * `seeker_id`: UUID (Foreign Key &rarr; `accounts.id`)
  * `status`: VARCHAR(32) (Required, default `'active'`; values: `'active'`, `'closed'`)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
* **`messages` Fields:**
  * `id`: UUID (Primary Key)
  * `connection_id`: UUID (Foreign Key &rarr; `connections.id` ON DELETE CASCADE, indexed)
  * `sender_id`: UUID (Foreign Key &rarr; `accounts.id`, indexed)
  * `content`: TEXT (Required, 1–2,000 chars per GV-7)
  * `is_read`: BOOLEAN (Required, default `false`)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`, indexed)

---

### 8. Participation (`participations`)
* **Purpose:** The "Grow" step — verifiable track record of collaboration confirmed by both parties.
* **Fields:**
  * `id`: UUID (Primary Key)
  * `opportunity_id`: UUID (Foreign Key &rarr; `opportunities.id` ON DELETE CASCADE)
  * `creator_id`: UUID (Foreign Key &rarr; `accounts.id`)
  * `seeker_id`: UUID (Foreign Key &rarr; `accounts.id`)
  * `creator_confirmed`: BOOLEAN (Required, default `false`)
  * `seeker_confirmed`: BOOLEAN (Required, default `false`)
  * `status`: VARCHAR(32) (Required, default `'proposed'`; values: `'proposed'`, `'confirmed'`, `'completed'`)
  * `confirmed_at`: TIMESTAMPTZ (Nullable)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * `updated_at`: TIMESTAMPTZ (Required, default `now()`)

---

### 9. Moderation (`reports`, `blocks`, `moderation_actions`)
* **Purpose:** Trust & safety foundation protecting the ecosystem against spam, scams, and abuse.
* **`reports` Fields:**
  * `id`: UUID (Primary Key)
  * `reporter_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE SET NULL, indexed)
  * `target_type`: VARCHAR(32) (Required; values: `'opportunity'`, `'profile'`, `'message'`)
  * `target_id`: UUID (Required, indexed)
  * `reason_code`: VARCHAR(50) (Required, e.g., `'spam'`, `'scam_fraud'`, `'harassment'`, `'uncompensated_labor'`, `'inappropriate'`)
  * `details`: VARCHAR(1000) (Optional, ≤1,000 chars per GV-10)
  * `status`: VARCHAR(32) (Required, default `'pending'`; values: `'pending'`, `'reviewed'`, `'resolved'`, `'dismissed'`)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
* **`blocks` Fields:**
  * `id`: UUID (Primary Key)
  * `blocker_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE)
  * `blocked_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
  * Unique constraint on `(blocker_id, blocked_id)`
* **`moderation_actions` Fields:**
  * `id`: UUID (Primary Key)
  * `report_id`: UUID (Foreign Key &rarr; `reports.id` ON DELETE SET NULL, Nullable)
  * `moderator_id`: UUID (Foreign Key &rarr; `accounts.id`)
  * `action_type`: VARCHAR(32) (Required; values: `'warn'`, `'remove_content'`, `'suspend_account'`, `'dismiss'`)
  * `notes`: TEXT (Required)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)

---

### 10. Session & Verification (`sessions`, `verification_tokens`)
* **Purpose:** Managing authenticated sessions and single-use email verification tokens.
* **`sessions` Fields:**
  * `id`: UUID (Primary Key)
  * `account_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE, indexed)
  * `session_token`: VARCHAR(128) (Required, Unique, indexed)
  * `expires_at`: TIMESTAMPTZ (Required, indexed)
  * `ip_address`: VARCHAR(45) (Optional)
  * `user_agent`: VARCHAR(500) (Optional)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)
* **`verification_tokens` Fields:**
  * `id`: UUID (Primary Key)
  * `account_id`: UUID (Foreign Key &rarr; `accounts.id` ON DELETE CASCADE)
  * `token`: VARCHAR(128) (Required, Unique, indexed)
  * `token_type`: VARCHAR(32) (Required; `'email_verification'`, `'password_reset'`)
  * `expires_at`: TIMESTAMPTZ (Required, 24h lifespan per AUTH-002)
  * `used_at`: TIMESTAMPTZ (Nullable)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`)

---

### 11. Audit Log (`audit_logs`)
* **Purpose:** Non-repudiable audit recording of all privileged actions, status changes, and data purges.
* **Fields:**
  * `id`: UUID (Primary Key)
  * `actor_id`: UUID (Nullable, Foreign Key &rarr; `accounts.id` ON DELETE SET NULL)
  * `action`: VARCHAR(64) (Required, e.g., `'account.suspended'`, `'opportunity.removed'`, `'data.deleted'`)
  * `entity_type`: VARCHAR(32) (Required)
  * `entity_id`: UUID (Required)
  * `payload`: JSONB (Default `'{}'`)
  * `ip_address`: VARCHAR(45) (Optional)
  * `created_at`: TIMESTAMPTZ (Required, default `now()`, indexed)
