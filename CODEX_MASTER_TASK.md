# CODEX_MASTER_TASK

Read `AGENTS.md` first.

## Sole Source Of Truth

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` is the only operative source of
truth for AlphaVest implementation, planning, validation, route evolution,
safety, reporting and prompt derivation.

## Required Read Order

1. `AGENTS.md`
2. `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
3. The support artefacts explicitly named by the handoff for the selected phase
   or task.

## Execution Rule

Run the Moving Baseline Preflight from the True-UX handoff before code changes.
Then run `pnpm guard:source` before downstream WP execution. Execute only
handoff-authorized phases/tasks. Do not use any previous handoff, prompt pack,
phase plan, source snapshot, media package or `main` branch state as target
truth.

If `pnpm guard:source` fails, stop and report the source-hierarchy or target
guard violation before editing product code, route metadata, schema, tests or
visual assets.
