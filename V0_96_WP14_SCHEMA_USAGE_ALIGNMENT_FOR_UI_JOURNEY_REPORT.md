# V0.96 WP-14 Schema Usage Alignment for UI/Journey Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**WP:** `WP-14 — Schema Usage Alignment for UI/Journey`  
**Status:** `ACCEPTED_WITH_TARGETED_EXPORT_STATUS_SCHEMA_TAXONOMY_AND_CURRENT_PROOF`

## Scope

WP-14 was executed as a targeted schema-usage alignment slice under the True-UX handoff. The implementation focuses on the export workflow because WP-13 just bound that UI path to `/api/export-workflow` and `getExportWorkflowSnapshot`, making the export status taxonomy the current highest-risk schema-to-journey seam.

This WP does not claim a full schema redesign, broad migration, cross-route entity remapping, production auth change, P1/HOLD route promotion or binary export infrastructure.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short --branch` | Dirty working tree with existing WP08-WP13 changes, uploaded WP files, reports and unrelated root notes; preserved. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| Prisma schema baseline | 42 models and 22 enums observed. |
| Migration decision | No migration required or authorized for this focused WP-14 slice. |
| Existing schema guard | `tests/schema-alignment.spec.ts` already blocks patch-only model drift and blind schema replacement. |

## Reality Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| Schema baseline | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Existing Prisma schema supports export requests, documents, audit events, decisions, evidence and workflow statuses. |
| Export status taxonomy | `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/domain-types.ts` now defines canonical UI truth for all `ExportStatus` enum values. |
| Export read-model alignment | `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/export-workflow-readmodel-service.ts` now derives export status label, lifecycle fallback, status controls and no-overclaim detail from the canonical taxonomy. |
| Unknown/conflicting status handling | `FAIL_CLOSED` | Unknown export status values classify as `UNKNOWN` / `CONFLICTING` and disable approve, generate and download controls. |
| Schema migration | `NOT_REQUIRED_NOT_IMPLEMENTED` | No Prisma schema, migration or seed rewrite was introduced. |
| Cross-domain schema aggregation | `NOT_CLAIMED` | Broader schema/read-model aggregation remains WP15 acceptance work or a later concrete mismatch fix. |

## Schema / UI Truth Map

| Schema source | UI/read-model output after WP14 | Boundary |
| --- | --- | --- |
| `ExportStatus.DRAFT` | Scope-stage label and only scope as the next action. | Does not imply preview, approval, generation or download. |
| `ExportStatus.APPROVAL_REQUIRED` | Approval-stage label with approve allowed. | Generate/download stay blocked. |
| `ExportStatus.APPROVED` | Generated-stage preparation with generation allowed. | Download is still a separate controlled event. |
| `ExportStatus.GENERATED` | Generated package metadata with download allowed. | Client acceptance and share are not implied. |
| `ExportStatus.DOWNLOADED` | Downloaded lifecycle state. | Share and client acceptance are not implied. |
| Unknown status | `Unknown export state`, `schemaUsage: CONFLICTING`. | Approve, generate and download all stay blocked. |

## Changed Files

| File | Change |
| --- | --- |
| `lib/domain-types.ts` | Adds canonical export status UI taxonomy, schema-usage classification and fail-closed unknown status helper. |
| `lib/export-workflow-readmodel-service.ts` | Uses canonical export status truth for status label, lifecycle fallback, schema status, controls and no-overclaim detail. |
| `tests/schema-alignment.spec.ts` | Adds schema enum to UI taxonomy proof for `ExportStatus`, including fail-closed unknown values. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Adds WP-14 reality classification and updates WP-14 acceptance status. |
| `V0_96_WP14_SCHEMA_USAGE_ALIGNMENT_FOR_UI_JOURNEY_REPORT.md` | Adds this report. |

## Inspected Files

| File | Why inspected |
| --- | --- |
| `AGENTS.md` | Repository authority and True-UX handoff obligation. |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative source of truth, moving baseline and safety boundaries. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP14_SCHEMA_USAGE_ALIGNMENT_FOR_UI_JOURNEY_DEEP_TASK_DESCRIPTION.md` | WP-14 task contract. |
| `prisma/schema.prisma` | Current model/enum inventory and `ExportStatus` source taxonomy. |
| `lib/domain-types.ts` | Existing domain type definitions and new canonical status taxonomy home. |
| `lib/export-workflow-readmodel-service.ts` | Export read-model consumer of schema status values. |
| `tests/schema-alignment.spec.ts` | Existing schema alignment guard extended for WP-14. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Moving baseline and WP classification record. |

## Acceptance Results

| Acceptance | Result |
| --- | --- |
| Current schema inspected before changes | `PASS` |
| Existing schema reused before adding models/enums | `PASS` |
| Export status UI truth maps to schema enum values | `PASS` |
| Unknown/conflicting status values fail closed | `PASS` |
| Export read-model exposes schema-derived controls and no-overclaim detail | `PASS` |
| No blind migration or schema replacement | `PASS` |
| Broad all-route schema/read-model aggregation | `NOT_CLAIMED` |
| P0 acceptance aggregation | `DEFERRED_TO_WP15` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3075 pnpm playwright test tests/phase8-export-workflow-api.spec.ts tests/export-safety.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1` | `PASS` — 8 passed |
| `PLAYWRIGHT_PORT=3076 pnpm playwright test tests/schema-alignment.spec.ts --workers=1` | `PASS` — 7 passed |
| `PLAYWRIGHT_PORT=3077 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `pnpm db:validate` | `PASS` |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 29 existing unused-symbol warnings |

Validation note: an earlier parallel Playwright attempt failed because competing commands tried to start the same Next dev server port. The affected schema suite was rerun sequentially and passed.

## Deferred Boundaries

- Full cross-domain schema/read-model acceptance remains WP15.
- No Prisma migration was introduced.
- No new route, API or role/security model was introduced.
- Binary export package infrastructure remains outside this focused WP-14 slice.

## Next Recommended Work Package

Proceed to `WP-15 — P0 True-UX Acceptance Suite`.
