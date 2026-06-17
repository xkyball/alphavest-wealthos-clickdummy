# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 13

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


# Phase 13 — Communication, Export, Ops and Reference Pages

Goal: Implement pages 051–063.

Screens in this phase:

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 051 | /governance/audit-history | Access audit history | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png |
| 052 | /communication | Communication centre | PREVIEW_PAGE_OR_PANEL | public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png |
| 053 | /communication/call-trigger | Call trigger matrix | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png |
| 054 | /export/new | Create export | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png |
| 055 | /export/:id/scope | Export scope selection | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png |
| 056 | /export/:id/redaction | Export redaction | PREVIEW_PAGE_OR_PANEL | public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png |
| 057 | /export/:id/preview | Export preview | PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png |
| 058 | /export/:id/download | Export download/share | DOWNLOAD_CONFIRMATION_STATE | public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png |
| 059 | /ops/queues | Ops queues | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png |
| 060 | /ops/sla | SLA and escalation | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png |
| 061 | /service-blueprint | Service blueprint | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png |
| 062 | /roadmap | MVP vs future scope | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png |
| 063 | /states | State and badge reference | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-063-states.png |
