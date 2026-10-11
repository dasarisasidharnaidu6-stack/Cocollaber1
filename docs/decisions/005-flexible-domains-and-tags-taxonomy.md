# ADR-005: Hybrid Domain and Tag Taxonomy

## Status
Accepted

## Context
An open platform requires broad domain coverage without descending into chaotic, unsearchable tag spam or rigid, exclusionary corporate categories.

## Decision
Implement a **hybrid taxonomy**:
1. **Curated Domains (`domains`):** Admin-managed top-level areas (Technology, Sports, Creative Arts, Music, etc.).
2. **Flexible Tags (`tags`):** User-generated skill and interest labels (≤40 chars) normalized case-insensitively.

## Alternatives Considered
- **Rigid Predefined Taxonomy Only:** Rejected because emerging creative pursuits would be excluded.
- **Pure Free-Form Folksonomy (Tags Only):** Rejected because search quality and discovery degraded into synonym clutter.

## Benefits
- Reliable top-level faceted filtering with unlimited bottom-up expressiveness.
- Adding new curated domains requires zero code changes or database migrations.

## Trade-offs
- Requires administrative curation of official domain names.

## Security Implications
- Tags must be sanitized and length-limited (GV-8) to prevent visual defacement or abuse.

## Migration Implications
- Fully backward-compatible.

## Open Questions
- Seed domain confirmation for launch cohort (OD-02).\n