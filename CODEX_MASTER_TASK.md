# CODEX_MASTER_TASK

Read `AGENTS.md` first. `AGENTS.md` owns the current source-of-truth routing.

## Active Workstream Sources

- UX refactoring: `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md` and `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`.
- DB-backed tables/forms: `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`.
- E2E Journey Proof 25: `ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md`.
- Broad SCF work outside focused workstreams: `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md`, bounded by `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md` and `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`.

## UX Refactoring Lock

For UX navigation, page-type, density, CTA, interaction, safety or route-policy
work, read the UX matrix first and then the UX task master.

The repository-level override
`UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN` makes the UX route policy
matrix and UX task master sufficient for scoped UX execution. A later
`ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md` may still be derived, but
its absence is not a blocker.

Execute only a named UX task/workstream from the task master, cite the matching
route-policy rows, and preserve all route-scope, no-generation and P0 safety
proof rules.

## Historical Sources

Older First-Build, BP/AV-FB, MVP, minimum-path, V3 and previous handoff/task
files are supporting references only unless `AGENTS.md` or an active workstream
source explicitly elevates them.
