# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 11

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


# Phase 11 — Internal Workflow and Compliance Pages

Goal: Implement pages 033–040.

Screens in this phase:

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 033 | /signals | Signal / trigger review | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png |
| 034 | /workbench | Consultant workbench | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png |
| 035 | /workbench/triggers/:id | Trigger detail / analyst notes | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png |
| 036 | /advisor-approval | Advisor approval queue | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png |
| 037 | /advisor-approval/:id | Advisor approval detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png |
| 038 | /compliance | Compliance queue | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png |
| 039 | /compliance/:id/review | Compliance review detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png |
| 040 | /compliance/:id/release | Release to client | RELEASE_CONFIRMATION_MODAL_STATE | public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png |
