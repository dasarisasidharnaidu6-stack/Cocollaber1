# ADR-003: Account and Multi-Identity Representation

## Status
Accepted (with working assumption for organization entities)

## Context
A central pillar of CoCollaber is that a person is not a single fixed corporate category. An individual may be a software developer who plays football, shoots weddings, and volunteers. Furthermore, organizations and communities will participate in the ecosystem.

## Decision
Separate the authentication entity (`Account`) from the public persona (`Profile`).
- `Account` handles login credentials, status, and legal age checks.
- `Profile` handles multi-faceted identity, bio, and fluid domain interests.
- In v1, organizations post through representative member accounts (SRS §6). Multi-seat organization accounts are deferred to P1 (`ASSUMPTION`).

## Alternatives Considered
- **Single monolithic User table:** Rejected because it couples auth security with public social presentation.
- **Multiple account types at launch:** Rejected to keep MVP data model simple and focused.

## Benefits
- Full alignment with the "Fluid Roles" product principle.
- Members can express up to 10 offers and 10 seeks across diverse domains without category coercion.

## Trade-offs
- Requires a 1-to-1 join between Account and Profile for authenticated user lookups.

## Security Implications
- Sensitive account data (email, password hash, DOB) is strictly isolated from public profile data.

## Migration Implications
- Organization accounts can be added in Phase 2/P1 by referencing `Account` or creating an `organizations` table without modifying `Profile`.

## Open Questions
- Finalization of multi-seat organization accounts in P1 (OD-11).\n