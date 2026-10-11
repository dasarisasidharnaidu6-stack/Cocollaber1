# ADR-006: Compensation Representation and Mandatory Transparency

## Status
Accepted

## Context
Opportunities on CoCollaber can be paid or unpaid. Compensation is never mandatory, but absolute transparency is a foundational product principle to prevent exploitation.

## Decision
Enforce mandatory compensation disclosure on every opportunity using an explicit enum column:
- `compensation_type`: `paid`, `unpaid`, `stipend`, `credit_recognition`, `unspecified`.
- Optional `compensation_details` string (≤300 chars) for descriptive terms.

## Alternatives Considered
- **Binary Paid/Unpaid Flag:** Rejected because it obscures stipends, expenses-covered, and creative credit agreements.
- **Optional Compensation Fields:** Strictly rejected because hidden compensation terms enable predatory unpaid labor.

## Benefits
- Transparent expectations for both creators and seekers.
- Clear search filtering by compensation type.

## Trade-offs
- Creators must take a conscious step to select compensation terms during opportunity creation.

## Security Implications
- Prevents misleading opportunities and fraudulent bait-and-switch postings.

## Migration Implications
- Enum can be expanded with additional compensation types if needed.

## Open Questions
None.\n