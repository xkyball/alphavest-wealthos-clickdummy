# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 08

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


# Phase 08 — Admin, Platform and Tenant Setup Pages

Goal: Implement pages 007–018.

Screens in this phase:

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 007 | /admin/platform | Platform settings | PAGE_WITH_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png |
| 008 | /admin/policies/advice-boundary | Advice boundary policy | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png |
| 009 | /admin/roles | Global role templates | PAGE_WITH_PERMISSION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png |
| 010 | /admin/security | Security configuration | PAGE_WITH_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png |
| 011 | /admin/evidence-templates | Evidence templates | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png |
| 012 | /admin/export-templates | Export templates and redaction | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png |
| 013 | /admin/tenants | Tenant list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png |
| 014 | /tenants/new | Create client tenant | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png |
| 015 | /tenants/:id/setup | Tenant setup dashboard | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png |
| 016 | /tenants/:id/team | Assign AlphaVest team | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png |
| 017 | /tenants/:id/policies | Tenant policies | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png |
| 018 | /tenants/:id/users | Tenant users | PAGE_WITH_INVITE_ROLE_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png |
