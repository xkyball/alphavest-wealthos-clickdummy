# AlphaVest E00-E06 Truth Reconciliation

Date: 2026-06-27

## Purpose

This file reconciles the E00-E06 UX/spec/audit artefacts against current repo truth after the implementation-first epic runs. It exists because several older specs were left in decision-ready or blocked language after later implementation and QA reports had already closed the same chain.

This reconciliation does not authorize new product scope. It removes stale parallel truth.

## Canonical Status Matrix

| Epic / Area | Current Truth | Operative Artefact | Proof / Closure | Reconciliation Result |
| --- | --- | --- | --- | --- |
| `E00` implementation-first rules and proof-mode decision | Complete governance chain | `docs/ux/ALPHAVEST_E00_IMPLEMENTATION_FIRST_RULES.md` | `docs/v3/proof/e00_proof_mode_visibility_decision.md`, `docs/v3/proof/e00_implementation_first_architecture_qa_report.md` | Option A is applied; no pending E00 decision remains. |
| `E01` design-system foundation | Implemented current repo truth | `docs/ux/ALPHAVEST_E01_DESIGN_SYSTEM_FOUNDATION_SPEC.md` | `docs/v3/proof/e01_upload_epic_execution_closure_2026-06-27.md` | Complete. |
| `E01` operating model | Implemented current repo truth | `docs/ux/ALPHAVEST_E01_UX_OPERATING_MODEL_SPEC.md` | `docs/v3/proof/e01_ux_operating_model_qa_report.md` | Earlier blocked wording is stale and superseded by implementation proof. |
| `E02` page template system | Implemented current repo truth | `docs/ux/ALPHAVEST_E02_PAGE_TEMPLATE_SYSTEM_SPEC.md` | `docs/v3/proof/e02_upload_epic_execution_closure_2026-06-27.md` | Complete. |
| `E03` proof/reviewer separation | Implemented current repo truth | `docs/ux/ALPHAVEST_E03_OPERATIONAL_PROOF_SEPARATION_SPEC.md` | `docs/v3/proof/e03_upload_epic_execution_closure_2026-06-27.md` | Complete; default proof/debug UI remains retired. |
| `E04` state/modal/drawer lifecycle | Implemented current repo truth | `docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md` | `docs/v3/proof/e04_upload_epic_execution_closure_2026-06-27.md` | Complete; older overlay-lifecycle spec is historical. |
| `E05` action hierarchy / no-overclaim feedback | Implemented current repo truth for representative validated surfaces | `docs/ux/ALPHAVEST_E05_ACTION_FEEDBACK_IMPLEMENTATION_SPEC.md` | `docs/v3/proof/e05_qa_validation_report.md` | Complete for E05 scope; broad remaining local button-class usage is future migration debt, not E05 acceptance truth. |
| Historical `E06` feedback messaging | Implemented historical feedback subsystem, but no longer operative as current E06 number | `docs/ux/ALPHAVEST_E06_FEEDBACK_MESSAGING_SPEC.md` | `docs/v3/proof/e06_qa_validation_report.md` | Closed as historical feedback-message chain; current uploaded E06 is data surface/master-detail. |
| Current uploaded `E06` data surface/master-detail | Implemented current repo truth | `docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md` | commit `c41f518`, focused E06 tests, route-smoke/density/browser validation | Complete; backend filtering/pagination/sorting remain explicitly out of scope. |

## Residual Debt Register

| Debt | Current Status | Why It Is Not Hidden |
| --- | --- | --- |
| Historical docs still mention `ProductGuidancePanel` | Retired from default operational UI; historical reports still mention it as past context | E03 explicitly forbids restoring it as default proof scaffolding. |
| Local `primaryButtonClass` / `secondaryButtonClass` / `staticButtonClass` usages remain in large route-family files | Future migration debt | E05 validated canonical primitives and representative high-risk adoption; remaining local usage must be migrated or exception-marked by later route-family cleanup. |
| Local disabled filter buttons and not-wired filters remain outside the representative E06 queues | Future migration debt | E06 now exposes the canonical `FilterBar` and data-surface contract; remaining local filters must stay honest as disabled/static until backend filtering is implemented or explicitly scoped. |
| `components/ui/kanban.tsx` still exposes not-wired item creation | Deferred board capability | E06 did not authorize drag/drop persistence, creation, backend board mutation or per-screen board redesign. |
| Backend filtering, pagination, sorting and URL state | Explicitly out of scope for E06 | The UI may project active/disabled filter states, but must not claim backend filtering where it does not exist. |
| Seed-backed validation blocked by pnpm approve-builds during historical feedback-message QA | Environment limitation, not current product acceptance | The E06 feedback QA report records the blocker and the seed-free validation that passed. |

## Rules Going Forward

- Treat `docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md` as the current operative E06 spec.
- Treat `docs/ux/ALPHAVEST_E06_FEEDBACK_MESSAGING_SPEC.md` as historical feedback-message documentation, not the current E06 epic number.
- Treat `docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_SPEC.md` as the current operative E07 spec; old E07 data-surface material remains superseded by current E06.
- Do not resurrect visible proof/debug scaffolding in default operational UI.
- Do not treat disabled/static filter controls as backend filtering.
- Do not count broad route-family local button/filter cleanup as complete unless the file is migrated to a canonical primitive or explicitly exception-marked.
