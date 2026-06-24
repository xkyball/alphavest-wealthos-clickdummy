# V0.96 WP-15 P0 + True-UX Acceptance Suite Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**WP:** `WP-15 — P0 + True-UX Acceptance Suite`  
**Status:** `ACCEPTED_WITH_COVERAGE_MATRIX_AND_TARGETED_AGGREGATION_PROOF`

## Scope

WP-15 was executed as the V0.96 proof-orchestration layer. It does not add product scope, create routes, change Prisma schema, promote P1/HOLD routes, generate visual assets or claim production/GA readiness.

The implementation adds a central, testable acceptance matrix that aggregates existing WP01-WP14 P0 safety and True-UX proof slices, then verifies that every mandatory WP15 gate is covered or explicitly blocked outside V0.96 scope.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short --branch` | Dirty working tree with existing WP08-WP14 changes, reports, uploaded WP files and unrelated root notes; preserved. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| `git diff --stat` | Existing WP08-WP14 tracked diff observed before WP15 edits. |
| `package.json` | `pnpm`, Playwright, `typecheck`, `lint`, `db:validate`, `phase:check` and focused test scripts available. |
| Test inventory | Existing P0/True-UX files present for P0 acceptance, API, client projection, CTA, density, a11y, primitive lifecycle, governance, audit, export and navigation proof. |

## Reality Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| Current test inventory | `ACCEPTED_WITH_CURRENT_PROOF` | Existing suite contains `p0-acceptance`, `p0-api-contract`, `true-ux-*`, lifecycle, governance, audit, export and route-scope tests. |
| P0 safety matrix | `ACCEPTED_WITH_AGGREGATED_COVERAGE` | `lib/v0-96-p0-true-ux-acceptance.ts` maps mandatory safety gates to proof files and non-claims. |
| True-UX matrix | `ACCEPTED_WITH_AGGREGATED_COVERAGE` | Journey IA, page header, density, CTA, lifecycle, a11y and no-overclaim proof are mapped without pixel assertions. |
| Positive V0.96 journey spine | `ACCEPTED_WITH_DEMO_DATA_PROOF` | Existing canonical journey and P0 acceptance tests cover mapped actor, evidence, analyst, advisor, compliance, client, audit and export slices. |
| Negative release blockers | `ACCEPTED_WITH_NO_UNRESOLVED_RELEASE_BLOCKERS` | New aggregation test asserts zero `MISSING`, `CONFLICTING` or acceptance-blocking `PARTIAL/BLOCKED` entries. |
| P1/HOLD/reference scope | `ACCEPTED_AS_GUARDED_NON_PROMOTION` | Expected out-of-scope blockers remain recorded and are not treated as V0.96 acceptance gaps. |

## Changed Files

| File | Change |
| --- | --- |
| `lib/v0-96-p0-true-ux-acceptance.ts` | Adds WP15 acceptance matrix, required gate IDs, expected out-of-scope blockers, validation command set and summary/blocker helpers. |
| `tests/v0-96-p0-true-ux-acceptance.spec.ts` | Adds deterministic aggregation tests for matrix completeness, proof-file existence, route-scope blocker discipline, validation commands and package script registration. |
| `package.json` | Adds `test:v0-96-p0-true-ux` focused aggregation script. |
| `ALPHAVEST_V0_96_P0_TRUE_UX_ACCEPTANCE_EVIDENCE.md` | Adds WP15 evidence matrix for WP16 handoff. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Adds WP15 reality classification and updates WP15 status. |
| `V0_96_WP15_P0_TRUE_UX_ACCEPTANCE_SUITE_REPORT.md` | Adds this report. |

## Inspected Files

| File | Why inspected |
| --- | --- |
| `AGENTS.md` | Repository authority and mandatory True-UX handoff rules. |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative source of truth, preflight, phase/test/report obligations. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP15_P0_TRUE_UX_ACCEPTANCE_SUITE_DEEP_TASK_DESCRIPTION.md` | WP15 task contract and gate list. |
| `package.json` | Script inventory and new focused test script target. |
| `tests/**/*.spec.ts` | Current proof inventory. |
| `lib/p0-acceptance-proof.ts` | Existing P0 journey proof map and explicit blocker discipline. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Moving baseline and WP classification record. |

## Acceptance Results

| Acceptance | Result |
| --- | --- |
| Current test inventory inspected before new tests | `PASS` |
| Coverage matrix classifies mandatory WP15 gates | `PASS` |
| Every mandatory P0/True-UX gate has proof file(s) | `PASS` |
| Missing/conflicting acceptance blockers are zero | `PASS` |
| Expected P1/HOLD blockers remain explicit | `PASS` |
| No route/schema/API/product scope expansion | `PASS` |
| No generated screens/images or pixel-perfect assertions | `PASS` |
| WP16 handoff evidence prepared | `PASS` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3078 pnpm playwright test tests/v0-96-p0-true-ux-acceptance.spec.ts --workers=1` | `PASS` — 5 passed |
| `PLAYWRIGHT_PORT=3079 pnpm playwright test tests/p0-acceptance.spec.ts tests/true-ux-p0-safety.spec.ts --workers=1` | `PASS` — 24 passed |
| `PLAYWRIGHT_PORT=3080 pnpm playwright test tests/navigation-shell.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-density.spec.ts --workers=1` | `PASS` — 26 passed |
| `PLAYWRIGHT_PORT=3081 pnpm playwright test tests/true-ux-a11y.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts --workers=1` | `PASS` — 14 passed |
| `PLAYWRIGHT_PORT=3082 pnpm playwright test tests/governance-non-bypass.spec.ts tests/export-safety.spec.ts tests/audit-fail-closed.spec.ts --workers=1` | `PASS` — 9 passed |
| `PLAYWRIGHT_PORT=3083 pnpm playwright test tests/p0-api-contract.spec.ts tests/true-ux-client-projection.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1` | `PASS` — 19 passed |
| `PLAYWRIGHT_PORT=3084 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `pnpm db:validate` | `PASS` |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 29 existing unused-symbol warnings |

Validation note: an initial parallel Playwright run hit Next dev-server port contention. The affected suites were rerun sequentially. WP15 also exposed and fixed a real modal/drawer focus lifecycle issue; after the fix, the lifecycle/a11y suite passed.

## Deferred Boundaries

- Full production authentication, real external services and GA production readiness remain outside V0.96.
- Binary export delivery remains outside the current metadata-only export proof.
- P1/HOLD/reference routes remain guarded and are not promoted by WP15.
- WP16 owns final release evidence handoff update.

## Next Recommended Work Package

Proceed to `WP-16 — Release Evidence / Handoff Update` after WP15 validation is recorded.
