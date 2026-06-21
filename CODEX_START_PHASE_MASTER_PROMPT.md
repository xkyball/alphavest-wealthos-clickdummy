# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

FIRST_BUILD_TASK_ID: <SET_TASK_ID_HERE>

You are working in the existing linked AlphaVest WealthOS repository. The handoff pack has been copied into the repository root.

First read:

- AGENTS.md
- ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md

If the selected task explicitly includes screen implementation, inspect the corresponding images in:

```text
public/reference/page_ui_v3/clean_pages/
```

Important:

- Implement only the selected allowed task ID from the First Build handoff.
- Do not jump ahead or promote blocked, P1, hold or do-not-create items.
- Do not implement real authentication unless the selected handoff task explicitly authorizes it.
- Use demo data and role/tenant switchers for early testability.
- Follow the AlphaVest visual design strictly when the selected task permits UI work, but normalize layouts and spacing for consistency.
- Do not copy filenames, prompt metadata, route labels, dev notes or annotation content into the UI.
- Keep the product rule: No unapproved advice reaches the client.

Before changing code, summarise the task plan and files likely to change.

After implementation, run available build/lint/test commands and update:

```text
docs/v3/PHASE_EXECUTION_REPORT.md
docs/v3/IMPLEMENTATION_QA_REPORT.md
```
