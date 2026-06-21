# Copy-Paste Codex Start Commands

## Generic First Build task start

Replace `<TASK_ID>` with an allowed task ID from
`ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md`.

```text
Read AGENTS.md first.

FIRST_BUILD_TASK_ID: <TASK_ID>

Follow ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md as the only source of truth.
Implement only the selected allowed task ID and its package boundaries.
```

## Codex cloud CLI variant

```bash
codex cloud exec --env <ENV_ID> "$(cat CODEX_START_PHASE_MASTER_PROMPT.md | sed 's/<SET_TASK_ID_HERE>/AV-FB-P0-BP00-T001/g')"
```

## Recommended first run for empty repo

Use the BP-00 source hierarchy task first, then continue through the handoff's
allowed task inventory.

```text
FIRST_BUILD_TASK_ID: AV-FB-P0-BP00-T001
```

## Recommended first run for existing repo

Start with `AV-FB-P0-BP00-T001` as the source hierarchy and target-codebase
baseline. Do not overwrite existing code unless the selected handoff task
explicitly authorizes the touched files.
