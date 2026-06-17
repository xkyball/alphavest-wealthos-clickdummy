# AlphaVest User Manual Traceability V3

This file maps the user-facing manual to its source evidence. User-facing chapters avoid route-led instructions; route and code references remain traceability metadata.

## Core Sources

| Source | Used For |
| --- | --- |
| `AGENTS.md` | Product rules, demo-first boundary, no-unapproved-advice rule, compliance/evidence/audit requirements. |
| `CODEX_MASTER_TASK.md` | Repository mission and phase discipline. |
| `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md` | Pageflow and workflow architecture. |
| `docs/v3/DATA_MODEL_V3.md` | Status families, roles, object concepts, evidence/audit/release terminology. |
| `docs/v3/SCREEN_CATALOGUE_V3.md` | Screen names and visual reference assets. |
| `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md` | Product gates and verification expectations. |
| `docs/v3/user-manual-source/user-manual-source.v3.json` | Machine-readable manual backbone. |
| `docs/v3/user-manual-source/*.md` | Editorial source cards, fields, branches, screenshot register, UI reality check. |
| `artifacts/user-manual-source/20260616-232649Z/capture-log.json` | Successful live screenshot proof. |

## Manual Section Mapping

| Manual Section | Source Evidence |
| --- | --- |
| About AlphaVest WealthOS | `AGENTS.md`, `CODEX_MASTER_TASK.md`, `DATA_MODEL_V3.md` |
| Demo boundaries | `UI_REALITY_CHECK_V3.md`, `IMPLEMENTATION_GAP_BACKLOG_V3.md`, `QUALITY_GATES_AND_TEST_PLAN_V3.md` |
| Safety and compliance principles | `AGENTS.md`, `DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`, `lib/workflow-gate.ts`, `lib/permission-engine.ts` |
| Roles and responsibilities | `ROLE_TASK_INVENTORY_V3.md`, `user-manual-source.v3.json.roles` |
| Core concepts | `DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`, `DATA_MODEL_V3.md` |
| Getting started | `demo-session.ts`, `SCREEN_CATALOGUE_V3.md`, `UI_REALITY_CHECK_V3.md` |
| Task chapters MT-001 to MT-014 | `PROCEDURE_SOURCE_CARDS_V3.md`, `WORKFLOW_PAGEFLOW_CLICKFLOW_CROSSWALK_V3.md`, `FIELD_INPUT_REFERENCE_V3.md`, `BRANCHES_AND_TROUBLESHOOTING_V3.md` |
| Field reference | `FIELD_INPUT_REFERENCE_V3.md`, `DATA_MODEL_V3.md` |
| Troubleshooting | `BRANCHES_AND_TROUBLESHOOTING_V3.md`, `UI_REALITY_CHECK_V3.md` |
| Screenshot index | `SCREENSHOT_REGISTER_V3.md`, `capture-log.json`, `public/reference/page_ui_v3/clean_pages/` |

## Task Coverage

| Manual Task | User-Facing Chapter | Source Workflow | Evidence Level In Source Package |
| --- | --- | --- | --- |
| MT-001 | Configure the platform policy baseline | UF-01 / W-01 / PF-A | E3 navigable |
| MT-002 | Create and prepare a client tenant | UF-02 / W-02 / PF-B | E3 navigable |
| MT-003 | Accept an invitation and complete onboarding | UF-03 / W-03 / PF-B | E2/E3 visual and navigable |
| MT-004 | Submit client profile and family context | UF-04 / W-04 / PF-C | E3 navigable |
| MT-005 | Create an entity and review wealth structure | UF-05 / W-05 / PF-C | E3 navigable |
| MT-006 | Upload and verify a document | UF-06 / W-06 / PF-D | E3 navigable |
| MT-007 | Process a signal and route internal work | UF-07 / W-07 / PF-E | E4 demo-state executable for subset |
| MT-008 | Review an advisor approval package | UF-08 / W-08 / PF-E | E4 demo action subset |
| MT-009 | Release, block, or request evidence | UF-09 / W-09 / PF-F | E3/E4 mixed demo states |
| MT-010 | Review and submit a released client decision | UF-10 / W-10 / PF-F | E3 navigable with demo actions |
| MT-011 | Review evidence and create a controlled export | UF-11 / W-11 / PF-I | E3 visual/navigable |
| MT-012 | Manage governance users, roles, and access requests | UF-12 / W-12 / PF-G | E3/E4 demo actions visible |
| MT-013 | Choose a communication or escalation path | UF-13 / W-13 / PF-H | E2/E3 mostly static surfaces |
| MT-014 | Monitor operations, SLA, and reference state | UF-14 / W-14 / PF-J | E2/E3 reference/dashboard surfaces |
