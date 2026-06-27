# AlphaVest E07 Client/Internal UI Separation Audit

Date: 2026-06-27

## Source

Uploaded architecture epic: `E07 - Client-Safe Visibility and Internal/External UI Separation`.

E07 is the current client-safe visibility epic. Historical `E07` data-surface artefacts are superseded by the current uploaded `E06` data-surface chain.

## Ticket Order

| Order | Ticket | Status |
| --- | --- | --- |
| 1 | `E07-A1` Analyse client-facing vs internal UI surfaces | Complete |
| 2 | `E07-S1` Specify UI-level client/internal separation rules | Complete |
| 3 | `E07-I1` Implement client-facing shell/template variant | Complete |
| 4 | `E07-I2a` Suppress client portal/mobile proof/internal UI | Complete |
| 5 | `E07-I2b` Suppress export/client-package proof/internal UI | Complete |
| 6 | `E07-I3` Apply client-safe state/message primitives | Complete |
| 7 | `E07-Q1` Validate client/internal UI separation | Complete |

## Repo Reality

Existing foundations:

- `lib/ux-operating-model.ts` already classifies `client_workspace` routes as `OPERATIONAL_CLIENT_SAFE` / `client_safe`.
- `lib/ux-page-template-system.ts` already has `client_summary` and `client_safe_summary_only`.
- `lib/ux-proof-reviewer-mode.ts` already suppresses proof/reviewer content classes in client mode.
- `components/proof-reviewer-mode-slot.tsx` suppresses explicit reviewer mode on client-safe routes.
- `components/ui/page-template.tsx` emits client-mode suppression metadata.
- `components/client-intake-screen.tsx` already uses projection-backed safe summaries and fail-closed state panels.

Gaps found:

- The old `docs/ux/ALPHAVEST_E07_DATA_SURFACE_MASTER_DETAIL_SPEC.md` remains historical and must not be used as current E07 truth.
- Client-facing pages still render visible phase/proof panels such as `Phase7ClientProjectionPanel` and `Phase5DetailSplitPanel`.
- `ClientTopBar` still renders a route-context proof chip in the client shell.
- Client-facing visible copy still names forbidden internal categories such as AI draft and compliance notes in proof panels.
- Export download renders a client-projection proof panel instead of a reusable client-package projection boundary.
- Fail-closed state primitives exist, but there is no reusable E07 UI boundary that owns allowed visible classes, suppressed internal classes and state primitives.

## Decision

Implement a dedicated E07 contract and boundary:

- `lib/ux-client-safe-ui-boundary.ts`
- `components/ui/client-safe-ui-boundary.tsx`

E03 remains proof/reviewer mode. E07 owns product-facing client-safe UI projection and explicit suppression of route IDs, task IDs, proof scaffolding, reviewer scaffolding, debug metadata, AI draft, internal rationale, compliance notes, audit-history summaries and storage/checksum detail.

This is UI separation only. It does not claim backend payload filtering, RBAC enforcement or a new visibility engine.
