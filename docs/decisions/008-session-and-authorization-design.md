# ADR-008: Session and Token-Based Authorization Design

## Status
Accepted

## Context
CoCollaber requires secure authentication across mobile and desktop browsers, supporting stateless API verification and instant session revocation upon password change or account compromise.

## Decision
Implement a hybrid approach:
- Short-lived signed **JWT Bearer Tokens** (1 hour) for low-overhead stateless API verification.
- Server-side **Session Records (`sessions`)** in the database for tracking active devices, refresh tokens, and global session revocation.

## Alternatives Considered
- **Pure Stateless JWT Only:** Rejected because individual compromised tokens cannot be revoked before expiration without a blacklist.
- **Database-Only Sessions:** Rejected because every API request would require a database hit.

## Benefits
- Immediate session revocation capabilities for security operations.
- Fast token validation for high-frequency API requests.

## Trade-offs
- Slightly higher database writes during initial login and token refresh.

## Security Implications
- Mitigates token replay risks and enables immediate account lockout upon suspected compromise.

## Migration Implications
- Fully standard OAuth2 Bearer compliant.

## Open Questions
None.\n