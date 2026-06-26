# Cleanup Execution Report

Scope: user-authorized follow-up after baseline acceptance.
Status: `COMPLETED_WITH_LIMITATIONS`

## Accepted Baseline

The `PASS_WITH_LIMITATIONS` baseline from `06_qa_validation.md` is accepted for this implementation slice. The acceptance does not upgrade any product capability to `COMPLETE_VERTICAL_SLICE`; it authorizes focused proof and cleanup work against the identified ambiguity.

## Implemented Cleanup Slice

| Work item | Result |
| --- | --- |
| Export UI directness | Export approval and download UI now call `/api/export-workflow` through a typed client helper instead of `runScreencastDemoAction("j08...")`. |
| Demo workflow split | Public `/api/demo-workflow` now fail-closes all `j08.*` export actions with `LEGACY_EXPORT_DEMO_ACTION_RETIRED` and points to `/api/export-workflow`. |
| Static fake action handling | Export scope `Clear all` no longer fires a demo action; it is disabled with an explicit blocked reason until a typed reset command exists. |
| Overclaim correction | Export approval copy no longer claims metadata generation in the approval step; generation remains separate from approval and download. |
| Proof update | Demo workflow, export approval/download lifecycle, Phase 8, Phase 9 and DBTF tests now assert legacy export actions are retired or use `/api/export-workflow` directly. |
| Admin tenant audit proof | Admin tenant readmodel now includes `screencast.tenant.details_saved` in its audit proof list so J06 mutation proof is visible in DB-backed snapshots. |

## Validation

| Check | Result |
| --- | --- |
| `pnpm typecheck` | Pass |
| `pnpm playwright test tests/dbtf-tables-api.spec.ts tests/phase9-support-hardening.spec.ts --workers=1` | Pass, 19/19 |
| `pnpm playwright test tests/export-workflow-api.spec.ts tests/demo-workflow-api.spec.ts tests/export-approval-lifecycle.spec.ts tests/export-download-confirmation-lifecycle.spec.ts tests/phase8-export-workflow-api.spec.ts tests/phase9-support-hardening.spec.ts tests/dbtf-tables-api.spec.ts tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/av27-client-context-closure.spec.ts tests/journey-api.spec.ts --workers=1` | Pass, 79/79 |

## Remaining Hard Cuts

| Remaining item | Reason |
| --- | --- |
| Physically deleting old `runJ08*` helper functions | Deferred to a narrower removal pass because this slice first locked the public API boundary and proof contract. Public API entry is already cut off with `410`. |
| Broad static-affordance purge across all screens | Deferred beyond this first slice; export fake action was hardened first because it was directly in the authorized export path. |
| Full app proof suite | Not run; the focused runtime pack above covers export, demo workflow, DBTF/readmodel, document upload, evidence review, AV27 client context and journey API. |
