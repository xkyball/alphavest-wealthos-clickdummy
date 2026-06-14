# Refactor Plan v2

Date: 2026-06-14

## Objective

Align the existing Phase 1-3 repository with the v2 UX/source-of-truth model without building Phase 5 client feature expansion.

## Constraints

- Preserve working infrastructure and useful components.
- Do not delete code blindly.
- Do not use visual images as static product UI.
- Do not render spec annotations as product UI.
- Centralise permission, workflow state, evidence/audit, and no-unapproved-advice logic.
- Keep reference-only visuals as architecture/test/doc inputs.

## Implementation Steps

| Step | Area | Action | Files | Tests | Status |
|---|---|---|---|---|---|
| 1 | Source of truth | Read v2 docs and inspect visual/board inventories. | `docs/v2/*`, `public/reference/*` | n/a | Done |
| 2 | Audit docs | Write audit, delta, and refactor plan. | `docs/v2/EXISTING_PHASE_1_3_AUDIT.md`, `docs/v2/DELTA_ANALYSIS_V2.md`, `docs/v2/REFACTOR_PLAN_V2.md` | n/a | Done |
| 3 | Route model | Add central v2 route inventory with visual IDs, priorities, domains and route types. | `lib/v2-model.ts` | model test | Planned |
| 4 | Gates | Add central permission, release, state, evidence and audit helpers. | `lib/v2-model.ts` | model test | Planned |
| 5 | Shell | Replace legacy board navigation source with v2 route metadata and Phase 4 language. | `components/app-shell.tsx`, `app/layout.tsx` | route smoke/build | Planned |
| 6 | Internal P0 routes | Replace `BoardPage` placeholders with actual operational/gate UI foundations. | `/workbench`, `/advisor-approval`, `/compliance`, `/governance`, `/communication`, `/journey`, `/roadmap` | build/typecheck | Planned |
| 7 | Tests | Add lightweight tests for route mapping, permissions, no-unapproved-advice and evidence/audit helpers. | `tests/v2-model.test.mjs`, `package.json` | `npm test` | Planned |
| 8 | QA | Run typecheck, lint, tests, build; write report. | `docs/v2/PHASE_4_QA_REPORT.md` | all | Planned |
| 9 | Commit | Commit with requested message if checks allow. | git | n/a | Planned |

## Phase 4 Scope Boundary

Included now:

- v2 model centralisation.
- Internal route placeholders replaced with real Phase 4 foundation screens.
- Client-visibility gates represented in shared logic.
- Permission/evidence/audit helpers and tests.

Deferred to later phases:

- Full visual rebuild of P0 client routes (`/mobile` through `/evidence`).
- Full trigger-review rebuild for `/signals`.
- Persistence, real APIs, server-side auth, document storage and production audit log.
- Playwright suite unless test framework is added later.

## Exit Criteria

- Required first output docs exist.
- Phase 4 routes no longer depend on product-board placeholder UI.
- Central helpers exist for permissions, release gates, workflow states and evidence/audit.
- Tests cover central helpers.
- Typecheck, lint, tests and build are run or failures documented.
- `docs/v2/PHASE_4_QA_REPORT.md` exists.
