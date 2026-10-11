# CoCollaber — Access-Control Architecture Specification

**Document Stage:** Phase 1 Architecture Foundation  
**Status:** Approved Access-Control Baseline  
**Governing Rule:** Role-Based Access Control (RBAC) combined with strict Object-Level Attribute Authorization (ABAC). Security must be enforced on backend service and repository boundaries; client-side UI visibility is never treated as a security control.

---

## 1. Actor Roles & Security Personas

| Role ID | Persona | Description | Session Requirement |
|---|---|---|---|
| `ROLE_ANON` | **Anonymous Visitor** | Unauthenticated public visitor exploring the platform. | None |
| `ROLE_MEMBER` | **Account Owner** | Authenticated, email-verified, active individual member. | Valid Session / Token, Active Status |
| `CTX_CREATOR` | **Opportunity Creator** | Member who authored a specific opportunity resource (Contextual Role). | Resource Ownership (`account_id == opportunity.creator_id`) |
| `CTX_PARTICIPANT`| **Connection Participant** | Either the Creator or the Accepted Seeker bound to a specific Connection. | Resource Membership (`account_id IN (creator_id, seeker_id)`) |
| `ROLE_MODERATOR` | **Trust & Safety Moderator**| Staff user authorized to inspect reports, review flagged items, and act on abuse. | Valid Staff Session with Moderator Claim |
| `ROLE_ADMIN` | **System Administrator** | Staff user with complete administrative governance, domain management, and audit rights. | Valid Staff Session with Admin Claim (Least Privilege) |

---

## 2. Core Authorization Matrix

| Action / Operation | Anonymous Visitor | Authenticated Member | Opportunity Creator | Connection Participant | Moderator | Administrator |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Read Public Opportunities** | ✅ Permitted (SRS-OD-02 `ASSUMPTION`) | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted |
| **Create an Opportunity** | ❌ Denied (`E-AUTH`) | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted |
| **Edit/Close Own Opportunity** | ❌ Denied (`E-AUTH`) | ❌ Denied (Non-owner) | ✅ Permitted (`CTX_CREATOR`) | ❌ Denied | ⚠️ Conditional (Admin override via moderation action) | ⚠️ Conditional (Logged in audit trail) |
| **Edit Another's Opportunity** | ❌ Denied (`E-AUTH`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (Must use moderation action) | ❌ Denied (Must use moderation action) |
| **Express Interest in Opportunity**| ❌ Denied (`E-AUTH`) | ✅ Permitted | ❌ Denied (Cannot apply to own opp) | ❌ Denied (If already connected) | ✅ Permitted (As member persona) | ✅ Permitted (As member persona) |
| **View Private Connection & Chat**| ❌ Denied (`E-AUTH`) | ❌ Denied (`E-FORB`) | ⚠️ Conditional (`CTX_PARTICIPANT`) | ✅ Permitted (`CTX_PARTICIPANT`) | ⚠️ Conditional (Only when attached to active report) | ⚠️ Conditional (Audited investigation only) |
| **Submit Abuse Report** | ❌ Denied (Must login to report) | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted | ✅ Permitted |
| **Access Moderation Queue** | ❌ Denied (`E-AUTH`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ✅ Permitted | ✅ Permitted |
| **Execute Moderation Action** | ❌ Denied (`E-AUTH`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ✅ Permitted (Warn, Remove, Suspend) | ✅ Permitted (Full staff powers) |
| **Access System Audit Logs** | ❌ Denied (`E-AUTH`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ❌ Denied (`E-FORB`) | ✅ Permitted (Read-only, non-repudiable) |

---

## 3. Object-Level Authorization Rules (ABAC)

1. **Strict Ownership Invariant:**
   ```python
   def assert_can_modify_opportunity(account_id: UUID, opportunity: Opportunity):
       if opportunity.creator_id != account_id:
           raise ForbiddenError("You are not the authorized creator of this opportunity")
   ```
2. **Mutual Communication Firewall:**
   - No direct message may be posted or viewed unless a valid, active `Connection` exists where:
     `caller_id == connection.creator_id OR caller_id == connection.seeker_id`.
   - Direct unsolicited messages from members who have not been accepted are architecturally prohibited (`E-FORB`).
3. **Least Privilege Separation of Duties:**
   - Moderators can act on user reports and suspend abusive accounts, but cannot view system audit logs or alter core database taxonomy.
   - Administrators cannot directly modify user content without recording an auditable `ModerationAction` with mandatory justification notes.
4. **Data Redaction & Search Leakage Prevention:**
   - Account email addresses, dates of birth, and session tokens are strictly excluded from all public API response schemas and search vectors.
   - A member's private location is concealed if `is_location_public == False`.
   - Closed, draft, or removed opportunities are hard-filtered from all public discovery queries.
