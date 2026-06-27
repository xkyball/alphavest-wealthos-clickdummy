# AlphaVest E07 Client/Internal UI Separation Spec

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Epic | `E07 Client-Safe Visibility and Internal/External UI Separation` |
| Source | Uploaded overarching UX BOC implementation architecture |
| Implementation status | `IMPLEMENTED_AND_VALIDATED` |
| Dependencies | `E03`, `E04`, `E05` |
| Audit | `docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_AUDIT.md` |

## Rules

Client-safe visible classes:

- `client_safe_summary`
- `released_status`
- `redacted_metadata`
- `safe_next_step`
- `fail_closed_state`
- `source_upload_metadata`

Suppressed in client-safe UI:

- route context and route IDs
- UX task IDs and phase/proof badges
- proof/reviewer/debug scaffolding
- AI draft labels and draft payload copy
- internal rationale
- compliance notes
- audit-history summaries
- storage keys, checksums and raw internal identifiers

State primitives:

- empty
- hidden
- redacted
- permission denied
- source upload
- released

## Implementation Rules

- Client-safe routes must render through a reusable E07 boundary.
- Client shell chrome must not render route-context proof chips.
- Client-facing pages must not show proof panels, phase panels or task IDs as application UI.
- Export client-package projection must show only package availability and safe next steps, not the names of blocked internal payload classes.
- Internal export/reviewer routes may keep operational boundaries where they are internal-only and not presented as client package UI.
- UI suppression is not security. Backend payload filtering and RBAC remain out of E07 scope.

## Acceptance

- Client portal/mobile pages expose an E07 boundary and no visible proof/debug/reviewer scaffolding.
- Client documents route uses safe summary/state primitives instead of proof panels.
- Export download uses a client-package E07 projection boundary.
- Internal reviewer mode remains available only on internal routes.
- Focused client-projection, product-guidance, export-safety and route-smoke checks pass.
