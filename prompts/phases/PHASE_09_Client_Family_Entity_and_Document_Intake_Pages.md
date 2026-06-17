# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 09

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


# Phase 09 — Client, Family, Entity and Document Intake Pages

Goal: Implement pages 019–030.

Screens in this phase:

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 019 | /portal | Client web dashboard | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png |
| 020 | /mobile | Mobile home / next step today | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png |
| 021 | /client/profile | Client profile | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png |
| 022 | /client/family-members | Family members | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png |
| 023 | /relationships | Relationship map | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png |
| 024 | /entities | Entity list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png |
| 025 | /entities/new | Create entity | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png |
| 026 | /entities/:id | Entity detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png |
| 027 | /documents | Documents list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png |
| 028 | /documents/upload | Document upload | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png |
| 029 | /documents/extraction-review | Extraction review | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png |
| 030 | /documents/verification-pending | Verification pending | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png |
