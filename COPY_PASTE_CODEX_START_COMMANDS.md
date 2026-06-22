# Copy-Paste Codex Start Commands

## True-UX phase/task start

Replace `<TRUE_UX_PHASE_OR_TASK_ID>` with a phase or task authorized by
`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.

```text
Read AGENTS.md first.

TRUE_UX_PHASE_OR_TASK_ID: <TRUE_UX_PHASE_OR_TASK_ID>

Use ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md as the only operative source of truth.
Run and report the Moving Baseline Preflight before code changes.
Read only the support artefacts named by the True-UX handoff for this phase/task.
Implement only the selected handoff-authorized scope and preserve all safety, route-evolution, screen-split, no-generation, RBAC, evidence, audit, export and client-visibility boundaries.
Do not use main, source snapshots, media packages, previous prompt packs or previous handoffs as target truth.
```

## Codex cloud CLI variant

```bash
codex cloud exec --env <ENV_ID> "$(cat CODEX_START_PHASE_MASTER_PROMPT.md | sed 's/<SET_TRUE_UX_PHASE_OR_TASK_ID_HERE>/<TRUE_UX_PHASE_OR_TASK_ID>/g')"
```
