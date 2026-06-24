# V0.96 WP-10 Export Scope / Redaction / Approval UX Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**WP:** `WP-10 — Export Scope / Redaction / Approval UX`  
**Status:** `ACCEPTED_WITH_EXPORT_SCOPE_REDACTION_APPROVAL_UX_HARDENING_AND_CURRENT_PROOF`

## Scope

WP-10 hardens export as the late-stage trust output of the core journey:

- Export is a client-safe projection, not a raw data dump.
- Scope is not redaction.
- Redaction is not preview.
- Preview is not approval.
- Approval is not download/share.
- Download/share is not client acceptance.
- Admin access and advisor approval do not expand export payload permission.

No new route, schema migration, external delivery platform, binary export infrastructure or visual asset generation was introduced.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short` | Dirty working tree with prior WP08/WP09 tracked changes, V0.96 upload files and reports; preserved as in-progress work. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| `git diff --stat` | Existing WP08/WP09 tracked changes present before WP10; WP10 adds export UI boundary, report, register update and focused test. |
| `package.json` | Scripts available for `typecheck`, `lint`, route smoke, export safety and focused Playwright specs. |

## Reality Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| Export UI | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | Existing export pages already separated Create/Scope/Redaction/Preview/Download and contained modal lifecycle copy. WP10 adds visible lifecycle and forbidden-payload boundaries. |
| Export API | `ALREADY_PRESENT_WITH_SAFE_READMODEL` | `app/api/export-workflow/route.ts` returns scoped readmodel snapshots and safe error envelopes. |
| Export services | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `lib/export-service.ts` and `lib/export-package-service.ts` already gate scope, redaction, approval, audit, generation, download and share. |
| Client-safe projection | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Export projection checks allow only released/client-safe summaries and block internal payload fields/classifications. |
| Export audit | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Existing workflow mutation/API tests block audit-unavailable approval and share-before-download. |
| Schema | `SUFFICIENT_NO_MIGRATION_AUTHORIZED` | Existing `ExportRequest`, `Document`, `AuditEvent`, decision/evidence and visibility fields support current metadata-only proof. |
| Tests | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | New WP10 test covers UI boundary markers and service step separation; existing export/file/API tests remain service proof. |

## Changed Files

| File | Change |
| --- | --- |
| `components/communication-export-ops-screen.tsx` | Added `ExportStageBoundary` and `ExportPayloadBoundary`; rendered lifecycle boundary across export route path and payload boundary on scope/redaction surfaces. |
| `tests/true-ux-export-scope-redaction-approval.spec.ts` | Added focused WP10 tests for UI lifecycle boundary, forbidden-payload boundary, service step separation and payload/package blocking. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updated export-stage delta and WP10 classification with current implementation proof. |
| `V0_96_WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX_REPORT.md` | Added this execution report. |

## Inspected Files

| File | Why inspected |
| --- | --- |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative authority, preflight and safety boundaries. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX_DEEP_TASK_DESCRIPTION.md` | WP10 task contract. |
| `components/communication-export-ops-screen.tsx` | Export route UI surfaces and modal lifecycles. |
| `app/api/export-workflow/route.ts` | Export readmodel API safety envelope. |
| `lib/export-service.ts` | Scope, projection, payload and lifecycle gate truth. |
| `lib/export-package-service.ts` | Manifest/package stage truth. |
| `tests/export-safety.spec.ts` | Existing export P0 safety proof. |
| `tests/file-export-realism.spec.ts` | Existing package/manifest/lifecycle proof. |
| `tests/phase8-export-workflow-api.spec.ts` | Existing export workflow API proof. |
| `tests/route-smoke.spec.ts` | Export no-overclaim route guard. |

## Refactor-First Proof

This was an implementation slice, not a planning-only report:

- Added a real shared export lifecycle boundary inside the export UI component.
- Added a real forbidden payload boundary inside export scope/redaction path.
- Kept mutation truth in existing services/API instead of adding duplicate endpoints.
- Kept the package proof metadata-only because WP10 does not authorize a production binary-export platform.

## Acceptance Results

| Acceptance | Result |
| --- | --- |
| Scope, redaction, preview, approval, download/share and client acceptance are visibly separated | `ACCEPTED` |
| Forbidden payload classes are explicitly blocked in UI and services | `ACCEPTED` |
| Preview does not imply approval | `ACCEPTED` |
| Approval does not imply download/share | `ACCEPTED` |
| Download/share does not imply client acceptance | `ACCEPTED` |
| Admin/advisor power does not expand export payload permission | `ACCEPTED` |
| No route/schema/API sprawl introduced | `ACCEPTED` |
| Full production binary export / external delivery automation | `OUT_OF_SCOPE_NOT_IMPLEMENTED` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3046 pnpm playwright test tests/true-ux-export-scope-redaction-approval.spec.ts tests/export-safety.spec.ts tests/file-export-realism.spec.ts --workers=1` | `PASS` — 21 passed |
| `PLAYWRIGHT_PORT=3047 pnpm playwright test tests/phase8-export-workflow-api.spec.ts --workers=1` | `PASS` — 2 passed |
| `PLAYWRIGHT_PORT=3050 pnpm playwright test tests/route-smoke.spec.ts --grep "UX-CTA export lifecycle separation" --workers=1` | `PASS` — 7 passed |
| `PLAYWRIGHT_PORT=3051 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_WARNINGS` — 0 errors, 29 pre-existing unused-code warnings |

Note: an initial parallel attempt to run route-smoke and delta-register specs while the export API spec owned the Next dev server failed with `Another next dev server is already running`; both specs passed when rerun sequentially.

## Deferred Boundaries

- External file-sharing infrastructure remains out of WP10.
- Real binary export package generation remains out of WP10.
- Full primitive consolidation remains WP11.
- Broader no-overclaim copy sweep remains WP12.
- API/service integration truth across all UI surfaces remains WP13.
- Schema usage reconciliation across the journey remains WP14.
- Final P0/True-UX aggregation remains WP15.

## Next Recommended Work Package

Proceed to `WP-11 — Shared Interaction Primitives / Modal / Drawer / Table / Form / CTA / A11y`.
