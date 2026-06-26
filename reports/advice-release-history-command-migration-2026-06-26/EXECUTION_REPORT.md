# Advice / Release-History Command Migration Execution Report

Ticket: `BOUNDARY-1`  
Status: `DONE`  
Date: `2026-06-26`  
Branch: `full-workflow`

## Scope

Create a clean typed Advice/Release-History command boundary before migrating the remaining product-like J02/J03 calls away from `/api/demo-workflow` and `runScreencastDemoAction`.

## Implementation

- Added `/api/advice-release-history/actions` as the canonical typed command endpoint for J02 compliance release/history and J03 released decision/evidence actions.
- Added `lib/advice-release-history-action-contract.ts`, `lib/advice-release-history-workflow-actions.ts`, and `lib/advice-release-history-command-client.ts`.
- Moved J02/J03 persisted mutations out of `app/api/demo-workflow/route.ts`; the legacy route now executes only explicit J01 demo compatibility actions for this family.
- Added `j02.exportControlled` as a typed controlled-export audit command instead of leaving it as a phantom screencast action.
- Rewired `components/decisions-governance-screen.tsx` from `runScreencastDemoAction` to `runAdviceReleaseHistoryCommand`.
- Updated demo-workflow registry, capture model context, capability drift gate, inventory and capability reports to make `/api/advice-release-history/actions` report truth.

## Safety Result

- `/api/demo-workflow` now returns `410` for J02/J03 advice/release-history action IDs with canonical route `/api/advice-release-history/actions`.
- Typed Advice/Release-History commands return a safety envelope with no advice execution, hidden-row disclosure blocked, scoped command execution, and client release only when release gate output is client-visible.
- Audit persistence outage remains fail-closed for release/decision actions.

## Validation

- `pnpm guard:source` PASS.
- `pnpm typecheck` PASS.
- Focused Playwright proof pack PASS: 43 tests.
  - `tests/demo-workflow-action-registry.spec.ts`
  - `tests/demo-workflow-api.spec.ts`
  - `tests/advice-release-history-command-client-source.spec.ts`
  - `tests/capture-screen-model-context.spec.ts`
  - `tests/capability-report-drift-gate.spec.ts`
  - `tests/phase6-audit-persistence.spec.ts`
  - `tests/phase9-support-hardening.spec.ts`

## Screenshot Proof

- `artifacts/screenshots/advice-release-history-command-migration-2026-06-26/evidence-detail-typed-download-command.png`

Decision-room and governance/audit routes were also probed. The local smoke renderer kept those specific routes in workspace-loading or routed `/governance` to the duplicate governance users entry, so those captures were not used as visual proof. API/source tests cover those command paths.

## Remaining Risk

- J01 remains as explicit demo-only compatibility in `/api/demo-workflow`. Recommended next cut: move J01 analyst/advisor choreography behind a typed intake/review command surface or quarantine it as pure screencast seed support.
