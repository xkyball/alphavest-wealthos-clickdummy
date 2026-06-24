# V0.96 WP-13 API/Service Integration for UI Truth Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**WP:** `WP-13 — API/Service Integration for UI Truth`  
**Status:** `ACCEPTED_WITH_TARGETED_EXPORT_API_READMODEL_UI_TRUTH_HARDENING_AND_CURRENT_PROOF`

## Scope

WP-13 was executed as a targeted API/service truth slice. The implementation reuses existing APIs and read models, avoids schema changes, avoids new routes and avoids broad API architecture work.

The selected target is the export workflow because it is safety-critical in WP-13 and already had an API/read-model/consumer chain:

- `/api/export-workflow`
- `getExportWorkflowSnapshot`
- export scope, preview and download UI pages
- existing P0, export workflow and fail-closed tests

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short` | Dirty working tree with existing WP08-WP12 changes, reports, uploaded WP files and unrelated root notes; preserved. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| API route inventory | 15 current API route files under `app/api/**/route.ts`, matching WP-13 current-repo premise. |
| Test inventory | 97 spec files after current V0.96 WP08-WP13 proof additions. |
| `package.json` | `pnpm`, `typecheck`, `lint`, Playwright and focused API/P0 scripts available. |

## Reality Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| Existing API route reuse | `ACCEPTED` | Reused `/api/export-workflow`; no new API route created. |
| Fail-closed API envelope | `ACCEPTED_WITH_TARGETED_EXTENSION` | Invalid scope and service failure now use `failClosedJson`. |
| Export read-model truth | `ACCEPTED_WITH_TARGETED_REFACTOR` | Export snapshots now expose `uiTruth` metadata with API route, read-model source and `fallbackDemoData: false`. |
| UI no-demo-fallback proof | `ACCEPTED_WITH_TARGETED_REFACTOR` | Export UI renders API truth panels and does not use scope/timeline fallback data as proof while the API load state is `error`. |
| Export/client payload safety | `ACCEPTED_WITH_CURRENT_PROOF` | Existing export safety/client projection tests remain in force; WP13 adds export snapshot forbidden-field assertions. |
| Broad API architecture | `OUT_OF_SCOPE_NOT_IMPLEMENTED` | No gateway rewrite, new auth provider, route expansion, schema migration or P1/HOLD promotion. |

## API / Service / UI Truth Map

| UI state/action | Source after WP13 | Proof limit |
| --- | --- | --- |
| Export scope summary | `/api/export-workflow` -> `getExportWorkflowSnapshot` -> DB read model | API failure produces empty fail-closed UI state, not proof-like fallback rows. |
| Export preview/package timeline | `/api/export-workflow` snapshot timeline from persisted audit events | Demo timeline is not used while API load state is `error`. |
| Export API invalid scope | `failClosedJson` envelope | No mutation, no advice execution, no client release, no approval/download, no hidden rows disclosed. |
| Export snapshot source | `snapshot.uiTruth` | Declares `DB_READMODEL` source and `fallbackDemoData: false`; this is read-model proof, not downstream release/client acceptance proof. |

## Changed Files

| File | Change |
| --- | --- |
| `app/api/export-workflow/route.ts` | Uses `failClosedJson` for invalid scope and service failure, including no approval/download and no hidden row disclosure flags. |
| `lib/export-workflow-readmodel-service.ts` | Adds `uiTruth` metadata to export workflow snapshots. |
| `components/communication-export-ops-screen.tsx` | Adds API truth state handling and `ExportWorkflowTruthPanel`; API errors render fail-closed UI and suppress proof-like fallback data. |
| `tests/phase8-export-workflow-api.spec.ts` | Adds invalid-scope envelope and read-model truth metadata assertions. |
| `tests/p0-api-contract.spec.ts` | Adds P0 invalid export workflow scope fail-closed assertion. |
| `tests/true-ux-api-service-ui-truth.spec.ts` | Adds static regression proof for API fail-closed + no-demo-fallback UI contract. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Adds WP13 reality classification and updates WP13 status. |
| `V0_96_WP13_API_SERVICE_INTEGRATION_FOR_UI_TRUTH_REPORT.md` | Adds this report. |

## Inspected Files

| File | Why inspected |
| --- | --- |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative authority, preflight and safety boundaries. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP13_API_SERVICE_INTEGRATION_FOR_UI_TRUTH_DEEP_TASK_DESCRIPTION.md` | WP13 task contract. |
| `app/api/**/route.ts` | Current API route inventory and target selection. |
| `lib/control-layer/error-envelope.ts` | Existing safe envelope to reuse. |
| `app/api/export-workflow/route.ts` | Target API route. |
| `lib/export-workflow-readmodel-service.ts` | Target read-model service. |
| `components/communication-export-ops-screen.tsx` | Target UI consumer. |
| `tests/p0-api-contract.spec.ts` | P0 invalid API contract coverage. |
| `tests/fail-closed-error-envelope.spec.ts` | Existing envelope contract. |
| `tests/phase8-export-workflow-api.spec.ts` | Existing export API workflow coverage. |
| `tests/export-safety.spec.ts` | Existing forbidden export payload coverage. |
| `tests/client-visibility-projection.spec.ts` | Existing client-safe projection coverage. |

## Acceptance Results

| Acceptance | Result |
| --- | --- |
| Existing APIs reused before new APIs | `ACCEPTED` |
| Safe API envelope or equivalent used | `ACCEPTED` |
| Export UI state uses API/read-model truth | `ACCEPTED_FOR_TOUCHED_EXPORT_SURFACES` |
| API error cannot advance export UI to proof-like success | `ACCEPTED` |
| Export preview/approval/download separation preserved | `ACCEPTED` |
| Client/export forbidden payload safety preserved | `ACCEPTED` |
| Broad all-route API/UI truth rebinding | `NOT_CLAIMED` |
| Schema usage alignment | `DEFERRED_TO_WP14` |
| P0 acceptance aggregation | `DEFERRED_TO_WP15` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3068 pnpm playwright test tests/p0-api-contract.spec.ts tests/phase8-export-workflow-api.spec.ts --workers=1` | `PASS` — 10 passed |
| `PLAYWRIGHT_PORT=3069 pnpm playwright test tests/true-ux-api-service-ui-truth.spec.ts tests/fail-closed-error-envelope.spec.ts --workers=1` | `PASS` — 4 passed |
| `PLAYWRIGHT_PORT=3072 pnpm playwright test tests/route-smoke.spec.ts --grep "UX-CTA export lifecycle separation" --workers=1` | `PASS` — 7 passed |
| `PLAYWRIGHT_PORT=3073 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 29 pre-existing unused-symbol warnings. |

Validation note: two earlier Playwright attempts failed because parallel test commands tried to start competing Next dev servers. The affected suites were rerun sequentially and passed.

## Deferred Boundaries

- Full cross-route API/UI truth aggregation remains WP15 acceptance-suite work.
- Schema-field alignment remains WP14.
- This slice does not promote P1/HOLD routes or create new product flows.

## Next Recommended Work Package

Proceed to `WP-14 — Schema Usage Alignment for UI/Journey`.
