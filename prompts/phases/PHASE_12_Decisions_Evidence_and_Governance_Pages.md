# CODEX_START_PHASE_MASTER_PROMPT

Read AGENTS.md first.

PHASE_TO_RUN: 12

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


# Phase 12 — Decisions, Evidence and Governance Pages

Goal: Implement pages 041–050.

Screens in this phase:

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 041 | /compliance/:id/block | Block / request evidence | BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE | public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png |
| 042 | /compliance/:id/audit | Audit / exception log | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png |
| 043 | /decisions | Decision list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png |
| 044 | /decisions/:id | Digital decision room | PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION | public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png |
| 045 | /decisions/:id/success | Decision submitted | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png |
| 046 | /evidence | Evidence vault | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png |
| 047 | /evidence/:id | Evidence record detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png |
| 048 | /governance/users | Governance users | PAGE_WITH_USER_DRAWER_OR_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png |
| 049 | /governance/roles | Role management | PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png |
| 050 | /governance/access-requests | Access requests | PAGE_WITH_APPROVAL_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png |
