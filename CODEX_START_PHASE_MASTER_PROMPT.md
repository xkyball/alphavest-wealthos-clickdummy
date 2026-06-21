# CODEX_START_PHASE_MASTER_PROMPT

Read `AGENTS.md` first.

WORKSTREAM: <SET_WORKSTREAM_HERE>
TASK_OR_PHASE_ID: <SET_TASK_OR_PHASE_ID_HERE>

You are working in the existing linked AlphaVest WealthOS repository on branch
`full-workflow`. Use the current repository files as target code reality and do
not derive implementation scope from `main`.

## Required Source Routing

- For `UX_REFACTORING`, first read:
  - `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md`
  - `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`
- For `DBTF`, first read:
  - `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`
  - `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`
- For `E2E_JOURNEY_PROOF_25`, first read:
  - `ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md`
- For broad `SCF`, first read:
  - `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md`
  - `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`
  - `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`

## UX Override Rule

For `UX_REFACTORING`, the repository-level override
`UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN` means
`ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md` is not required before
task execution. Use the route policy matrix and UX task master as the operative
UX sources, and execute only the selected named UX task/workstream.

## General Rules

- Implement only the selected workstream and task/phase ID.
- Preserve route scope, P1/Reference/Hold treatment and no-generation rules.
- Do not implement real authentication unless the selected source explicitly authorizes it.
- Use demo data and role/tenant switchers for early testability.
- Do not copy filenames, prompt metadata, route labels, dev notes or annotation content into app UI.
- Keep the product rule: No unapproved advice reaches the client.

Before changing code, summarize the task plan and likely touched files. After
implementation, run available build/lint/test commands and update the reports
required by the selected workstream.
