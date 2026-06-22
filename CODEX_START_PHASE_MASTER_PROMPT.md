# CODEX_START_PHASE_MASTER_PROMPT

Read `AGENTS.md` first.

TRUE_UX_PHASE_OR_TASK_ID: <SET_TRUE_UX_PHASE_OR_TASK_ID_HERE>

You are working in the existing linked AlphaVest WealthOS repository on branch
`full-workflow`. Use the current repository files as target code reality after
the Moving Baseline Preflight. Do not derive implementation scope from `main`,
source snapshots, media packages, previous prompt packs or previous handoffs.

## Required Source Routing

1. Read `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.
2. Run and report the Moving Baseline Preflight required by that handoff.
3. Read only the support artefacts the handoff names for the selected phase or
   task.
4. Implement only the selected handoff-authorized phase/task.

## General Rules

- Preserve all True-UX safety, route-evolution, screen-split, no-generation,
  client-visibility, RBAC, evidence, audit and export boundaries.
- Do not implement real authentication unless the True-UX handoff or a later
  user-approved successor explicitly authorizes it.
- Use demo data and role/tenant switchers for early testability.
- Do not copy filenames, prompt metadata, route labels, dev notes or annotation
  content into app UI.
- Keep the product rule: No unapproved advice reaches the client.

After implementation, run the validation commands required by the selected
True-UX phase/task and update the required proof/reporting artefacts.
