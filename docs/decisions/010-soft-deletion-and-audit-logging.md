# ADR-010: Soft Deletion, Data Retention and Audit Logging

## Status
Accepted

## Context
Privacy regulations (GDPR/CCPA) require honoring user deletion requests, while security and trust standards require preserving non-repudiable audit logs of abuse and moderation actions.

## Decision
1. **Soft Deletion (`SoftDeleteMixin`):** Apply `deleted_at` timestamps to `Account` and `Opportunity`.
   - On account deletion, personal identifiable information (name, bio, email) is anonymized immediately.
   - Associated opportunities are closed.
   - Records are permanently purged after 30 days (SRS-OD-09).
2. **Non-Repudiable Audit Logging (`audit_logs`):** Record all administrative, moderation, and data purge actions in an append-only table.

## Alternatives Considered
- **Hard Deletes Immediately:** Rejected because accidental user deletion cannot be recovered, and abusive users could delete accounts to erase moderation history.
- **Indefinite Data Retention:** Rejected due to privacy non-compliance.

## Benefits
- Compliance with user privacy rights and graceful recovery from accidental deletions.
- Full accountability for administrative actions.

## Trade-offs
- All application queries must filter `deleted_at IS NULL`.

## Security Implications
- Prevents bad actors from evading accountability through account self-deletion.

## Migration Implications
- Soft delete filters are standard and easily indexed using partial indexes.

## Open Questions
- Confirmation of legal retention window per jurisdiction (OD-09).\n