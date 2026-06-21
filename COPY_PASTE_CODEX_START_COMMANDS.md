# Copy-Paste Codex Start Commands

## UX refactoring task start

Replace `<UX_TASK_ID>` with a named UX task/workstream from the task master.

```text
Read AGENTS.md first.

WORKSTREAM: UX_REFACTORING
TASK_OR_PHASE_ID: <UX_TASK_ID>

Use ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md and ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md as the active UX sources.
Apply repository override UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN: ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md is not required before execution.
Implement only the selected UX task/workstream and preserve route scope, P1/Reference/Hold treatment, no-generation rules and all P0 safety obligations.
```

## Optional UX handoff derivation

Use this only if you want a derived convenience handoff document before or
between implementation passes.

```text
Read AGENTS.md first.

WORKSTREAM: UX_REFACTORING
TASK_OR_PHASE_ID: HANDOFF_DERIVATION

Use ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md and ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md as the active UX sources.
Derive ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md as a convenience artefact only; its absence is not a blocker because UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN is active.
```

## DBTF task start

Replace `<DBTF_PHASE_ID>` with an authorized phase from the DBTF prompt pack.

```text
Read AGENTS.md first.

WORKSTREAM: DBTF
TASK_OR_PHASE_ID: <DBTF_PHASE_ID>

Follow ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md and ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md.
Implement only the selected DBTF phase and its task boundaries.
```

## E2E Journey Proof 25 task start

Replace `<E2E_TASK_ID>` with an authorized `E2E-CJ-*` or workstream task.

```text
Read AGENTS.md first.

WORKSTREAM: E2E_JOURNEY_PROOF_25
TASK_OR_PHASE_ID: <E2E_TASK_ID>

Follow ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md.
Verify target files and Control-Layer dependencies before editing.
```

## Broad SCF task start

Replace `<SCF_PHASE_OR_TASK_ID>` with an authorized SCF phase or task.

```text
Read AGENTS.md first.

WORKSTREAM: SCF
TASK_OR_PHASE_ID: <SCF_PHASE_OR_TASK_ID>

Follow ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md within the boundaries of ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md and ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md.
```

## Codex cloud CLI variant

```bash
codex cloud exec --env <ENV_ID> "$(cat CODEX_START_PHASE_MASTER_PROMPT.md | sed 's/<SET_WORKSTREAM_HERE>/UX_REFACTORING/g' | sed 's/<SET_TASK_OR_PHASE_ID_HERE>/<UX_TASK_ID>/g')"
```
