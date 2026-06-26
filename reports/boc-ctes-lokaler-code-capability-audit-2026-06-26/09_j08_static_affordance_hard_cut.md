# 09 J08 Static Affordance Hard Cut

Date: 2026-06-26
Branch: full-workflow
Ticket: remove old internal `runJ08*` helpers and hard-block remaining static fake affordances.

## Status

Completed for the requested scope.

## Changes

- Deleted the internal legacy export helper implementation path before the generic route was removed entirely.
- Removed `j08.*` from the retired generic action union and the typed-command action switch.
- Current boundary: J08 export commands execute through `/api/export-workflow`; the generic action-id route is deleted.
- Removed J08-only dead imports and constants from the typed-command route.
- Replaced remaining `data-ux-affordance="static-control-note"` markers in app components with explicit `data-ux-affordance="blocked-static-control"` markers and disabled reasons.
- Converted Phase 6 decision-room static confirm/cancel affordances into real disabled buttons with explicit blocked reasons.
- Updated the Phase 6 route smoke assertion from passive static-note detection to real disabled-control proof.

## Proof

- `pnpm guard:source` passed.
- `pnpm typecheck` passed.
- `pnpm lint` passed with existing warnings only.
- `git diff --check` passed.
- `rg "static-control-note" app components lib tests -n` returned no matches.
- `rg "runJ08|case \"j08|j08\\." app/api app components lib tests -n` is expected to find only typed export workflow references.
- Focused Runtime-Proof-Pack passed: 42/42.
  - `tests/recommendation-review-workflow-api.spec.ts`
  - `tests/export-workflow-api.spec.ts`
  - `tests/phase8-export-workflow-api.spec.ts`
  - `tests/export-approval-lifecycle.spec.ts`
  - `tests/export-download-confirmation-lifecycle.spec.ts`
  - `tests/button-cta-lifecycle-pruning.spec.ts`
  - `tests/status-badge-affordance-pruning.spec.ts`
  - `tests/reference-only-copy-cleanup.spec.ts`
  - `tests/route-smoke.spec.ts -g "UX-DECISION-ROOM phase 6 safety-critical decision rooms"`

## Screenshot Proof

- `artifacts/screenshots/boc-ctes-lokaler-code-capability-audit-2026-06-26/export-approval-blocked-static-controls.png`
- DOM probe result: `ux-phase6-confirm` is a disabled `BUTTON` with `data-ux-affordance="blocked-static-control"` and reason `Blocked until a typed workflow command is implemented.`

## Broad-Smoke Note

An attempted wider Playwright run was stopped after unrelated legacy broad-smoke failures appeared outside this ticket scope. The failures were missing `product-guidance`, workbench-triad or support-density surfaces on existing routes such as `/service-blueprint`, `/documents/review-queue` and `/entities/new`. Those components/routes were not modified by this ticket. The focused pack above was rerun after clearing the stale test webserver and passed.

## Recommendation

Do not reintroduce passive static-note affordances. The next aggressive cleanup should remove or retire stale broad-smoke expectations for product-guidance/support-density where the current route contract no longer renders those surfaces, then make the contract source authoritative instead of keeping compatibility assertions alive.
