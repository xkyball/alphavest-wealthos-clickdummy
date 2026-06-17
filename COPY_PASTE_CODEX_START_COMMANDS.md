# Copy-Paste Codex Start Commands

## Generic phase start

Replace `<PHASE>` with `00`–`19`.

```text
Read AGENTS.md first.

PHASE_TO_RUN: <PHASE>

Follow CODEX_MASTER_TASK.md and docs/v3/CODEX_TASKS_DETAILED_V3.md.
Implement only the selected phase.
```

## Codex cloud CLI variant

```bash
codex cloud exec --env <ENV_ID> "$(cat CODEX_START_PHASE_MASTER_PROMPT.md | sed 's/<SET_PHASE_NUMBER_HERE>/00/g')"
```

## Recommended first run for empty repo

Use Phase 00, then continue phase-by-phase.

```text
PHASE_TO_RUN: 00
```

## Recommended first run for existing repo

Start with Phase 00 as repo intake, but instruct Codex not to overwrite existing code. It should produce `docs/v3/REPO_INTAKE_REPORT.md` first.
