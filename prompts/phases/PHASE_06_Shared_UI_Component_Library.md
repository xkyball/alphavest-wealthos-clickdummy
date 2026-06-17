# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 06

You are working in the existing linked AlphaVest WealthOS repository. The handoff pack has been copied into the repository root.

First read:

- AGENTS.md
- CODEX_MASTER_TASK.md
- docs/v3/CODEX_TASKS_DETAILED_V3.md
- docs/v3/PHASE_MODEL_V3.md
- docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md
- docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md
- docs/v3/SCREEN_CATALOGUE_V3.md
- docs/v3/VISUAL_ASSET_MANIFEST_V3.md
- docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md

If PHASE_TO_RUN includes screen implementation, inspect the corresponding images in:

```text
public/reference/page_ui_v3/clean_pages/
```

Important:

- Implement only the selected phase.
- Do not jump ahead.
- Do not implement real authentication before the planned security phase.
- Use demo data and role/tenant switchers for early testability.
- Follow the AlphaVest visual design strictly but normalize layouts and spacing for consistency.
- Do not copy filenames, prompt metadata, route labels, dev notes or annotation content into the UI.
- Keep the product rule: No unapproved advice reaches the client.

Before changing code, summarise the phase plan and files likely to change.

After implementation, run available build/lint/test commands and update:

```text
docs/v3/PHASE_EXECUTION_REPORT.md
docs/v3/IMPLEMENTATION_QA_REPORT.md
```


# Phase 06 — Shared UI Component Library

Goal: Build normalized design system components.

