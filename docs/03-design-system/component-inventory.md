# CoCollaber Component Inventory

Comprehensive catalog of reusable frontend primitives and compound components implemented for Phase 3.

## 1. UI Primitives (`apps/web/src/components/ui/`)

### `Button`
- **Variants**:
  - `primary`: Background Dark Cocoa (`#3B1E08`), text Cream (`#F8EFE3`).
  - `secondary`: Background Soft Caramel (`#F1C888`), text Dark Cocoa (`#3B1E08`).
  - `outline`: Transparent background with Medium Mocha border (`#8B5A36`).
  - `ghost`: Transparent with subtle hover tint.
- **States**: default, hover, active, focus-visible (`var(--focus-ring)`), disabled, loading spinner.
- **Sizes**: `sm`, `md`, `lg`.

### `Badge`
- **Compensation Variants**:
  - `paid`: Solid Dark Cocoa background with Cream text.
  - `unpaid`: Cream background with Warm Sand border and Dark Cocoa text. (Honest & non-stigmatizing).
  - `stipend`: Soft Caramel background with Dark Cocoa text.
  - `credit_recognition`: Medium Mocha background with Cream text.
  - `unspecified`: Dashed Warm Sand outline.
- **Status Variants**: `status_open`, `status_closed`, `domain`.

### `Input`
- Label, error message, helper text, forwardRef support, WCAG AAA focus styling.

### `Textarea`
- Label, error message, helper text, dynamic character counting, vertical resize control.

### `Select`
- Styled native select dropdown adhering strictly to warm brand tokens.

### `Modal`
- Accessible dialog primitive (`role="dialog"`, `aria-modal="true"`).
- Dismiss on `Escape` key and backdrop click.
- Fixed header, scrollable content area, and action footer.

### `Card`
- Surface container supporting `flat`, `subtle`, and `elevated` shadow/border tiers. Optional interactive hover transform.

### `Skeleton`
- Accessible loading placeholder using gradient animation between Warm Sand and Soft Caramel.

### `EmptyState`
- Editorial illustration framing with title, description, and actionable recovery button.

---

## 2. Domain & Journey Components

### `OpportunityCard` (`apps/web/src/components/opportunities/OpportunityCard.tsx`)
- Displays title, domain tag, compensation badge, remote status, description snippet, and transparent terms.

### `OpportunityFilter` (`apps/web/src/components/opportunities/OpportunityFilter.tsx`)
- Faceted multi-criteria filtering: search keyword, compensation category, and remote toggle.

### `OpportunityForm` (`apps/web/src/components/opportunities/OpportunityForm.tsx`)
- Enforces mandatory compensation transparency (Principle #5), character limits, domain categorization, and location options.

### `OffersList` & `SeeksList` (`apps/web/src/components/members/`)
- Multi-identity management allowing members to maintain up to 10 declared offers and 10 declared seeks.

### `CautionBanner` (`apps/web/src/components/messaging/CautionBanner.tsx`)
- Persistent trust & safety notice warning against off-platform payments or unverified personal data transfer.

### `MessageThread` (`apps/web/src/components/messaging/MessageThread.tsx`)
- Conversational stream with bubble styling, timestamps, caution framing, and message composer.

### `InterestModal` & `ConfirmParticipationModal` (`apps/web/src/components/interactions/`)
- Modals for expressing collaborative interest and confirming mutual participation.

### `ReportModal` (`apps/web/src/components/interactions/ReportModal.tsx`)
- Direct user reporting modal covering compensation misrepresentation, scams, harassment, and spam.
