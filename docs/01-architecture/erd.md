# CoCollaber — Entity Relationship Diagram (ERD)

**Document Stage:** Phase 1 Architecture Foundation  
**Status:** Approved ERD Baseline  
**Notation:** Crow's Foot Entity-Relationship Diagram (Mermaid)

---

## 1. High-Level Relational Architecture

```mermaid
erDiagram
    accounts ||--|| profiles : "has 1"
    accounts ||--o{ sessions : "maintains"
    accounts ||--o{ verification_tokens : "receives"
    accounts ||--o{ opportunities : "creates"
    accounts ||--o{ interests : "expresses"
    accounts ||--o{ reports : "files"
    accounts ||--o{ blocks : "initiates"

    profiles ||--o{ member_offers : "declares"
    profiles ||--o{ member_seeks : "declares"
    profiles ||--o{ member_interests : "selects"
    domains ||--o{ member_interests : "categorizes"

    opportunities ||--o{ opportunity_domains : "tagged with"
    domains ||--o{ opportunity_domains : "categorizes"
    opportunities ||--o{ opportunity_tags : "tagged with"
    tags ||--o{ opportunity_tags : "labels"

    opportunities ||--o{ interests : "receives"
    interests ||--o| connections : "unlocks"
    connections ||--o{ messages : "contains"
    connections ||--o| participations : "results in"
    opportunities ||--o{ participations : "records"
```

---

## 2. Detailed Entity Attributes & Constraints

```mermaid
erDiagram
    accounts {
        uuid id PK
        varchar email UK
        varchar hashed_password
        varchar account_type
        varchar role
        varchar status
        date date_of_birth
        timestamptz email_verified_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    profiles {
        uuid id PK
        uuid account_id FK,UK
        varchar display_name
        varchar headline
        text bio
        varchar location_text
        boolean is_location_public
        varchar avatar_url
        timestamptz created_at
        timestamptz updated_at
    }

    member_offers {
        uuid id PK
        uuid profile_id FK
        varchar title
        varchar description
        int display_order
        timestamptz created_at
    }

    member_seeks {
        uuid id PK
        uuid profile_id FK
        varchar title
        varchar description
        int display_order
        timestamptz created_at
    }

    domains {
        uuid id PK
        varchar name UK
        varchar slug UK
        boolean is_active
        timestamptz created_at
    }

    tags {
        uuid id PK
        varchar name UK
        timestamptz created_at
    }

    opportunities {
        uuid id PK
        uuid creator_id FK
        varchar title
        text description
        varchar opportunity_type
        varchar status
        varchar compensation_type
        varchar compensation_details
        boolean is_remote
        varchar location_text
        timestamptz deadline
        jsonb attributes
        tsvector tsv_search
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    interests {
        uuid id PK
        uuid opportunity_id FK
        uuid seeker_id FK
        text message
        varchar status
        timestamptz responded_at
        timestamptz created_at
    }

    connections {
        uuid id PK
        uuid interest_id FK,UK
        uuid opportunity_id FK
        uuid creator_id FK
        uuid seeker_id FK
        varchar status
        timestamptz created_at
    }

    messages {
        uuid id PK
        uuid connection_id FK
        uuid sender_id FK
        text content
        boolean is_read
        timestamptz created_at
    }

    participations {
        uuid id PK
        uuid opportunity_id FK
        uuid creator_id FK
        uuid seeker_id FK
        boolean creator_confirmed
        boolean seeker_confirmed
        varchar status
        timestamptz confirmed_at
        timestamptz created_at
    }

    reports {
        uuid id PK
        uuid reporter_id FK
        varchar target_type
        uuid target_id
        varchar reason_code
        varchar details
        varchar status
        timestamptz created_at
    }

    blocks {
        uuid id PK
        uuid blocker_id FK
        uuid blocked_id FK
        timestamptz created_at
    }

    audit_logs {
        uuid id PK
        uuid actor_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb payload
        varchar ip_address
        timestamptz created_at
    }

    accounts ||--|| profiles : "owns"
    profiles ||--o{ member_offers : "defines"
    profiles ||--o{ member_seeks : "defines"
    accounts ||--o{ opportunities : "creates"
    opportunities ||--o{ interests : "attracts"
    interests ||--o| connections : "authorizes"
    connections ||--o{ messages : "contains"
    opportunities ||--o{ participations : "tracks"
```
