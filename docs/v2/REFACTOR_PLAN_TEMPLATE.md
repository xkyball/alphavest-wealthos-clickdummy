# Refactor Plan Template v2

Create this file as `docs/v2/REFACTOR_PLAN_V2.md` during Phase 4.

## Objective

Align existing Phase 1–3 implementation with v2 UX/source-of-truth without building Phase 5 features.

## Constraints

- Preserve useful infrastructure.
- Do not delete working code blindly.
- Do not use visual images as static UI backgrounds.
- Do not render spec annotations as product UI.
- Do centralise permission, state, evidence and visibility logic.

## Refactor steps

| Step | Area | Action | Files | Tests | Risk | Status |
|---|---|---|---|---|---|---|
| 1 | Source of truth | Confirm docs/assets available | docs/v2, public/reference | n/a | Missing assets | Planned |
| 2 | App shell | Align nav/routes with v2 route inventory | app/, components | route smoke | Medium | Planned |
| 3 | Design tokens | Ensure AlphaVest tokens/chips/badges | components/ui | visual smoke | Low | Planned |
| 4 | Permissions | Create/adjust central permission helper | lib/permissions | unit tests | High | Planned |
| 5 | State machines | Create/adjust workflow state helpers | lib/state | unit tests | High | Planned |
| 6 | Evidence/audit | Create/adjust audit event model | lib/evidence | unit tests | High | Planned |
| 7 | P0 route states | Add missing blocked/error/loading states | app/* | Playwright | High | Planned |
| 8 | QA | Build/lint/test and report | n/a | all | Medium | Planned |

## Phase 4 exit criteria

- Audit exists.
- Delta analysis exists.
- Refactor plan exists.
- P0 routes map to screen specs.
- Visual interpretation rules applied.
- Permission helper exists or refactor plan states exact next step.
- No-unapproved-advice helper/gate exists or refactor plan states exact next step.
- Build/lint/tests run or failures documented.
- Phase 4 QA report exists.
