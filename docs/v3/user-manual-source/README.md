# AlphaVest User Manual Source Package V3

Generated: 2026-06-16T23:25:11.459Z

Engine mode: `ENGINE_MIX_V2_CODEX_V3_PROOF`

## Verdict

This directory is a raw source package for a future AlphaVest WealthOS user manual. It is intentionally not the finished manual. The structure is UI-led and task-led: roles, user goals, visible screens, inputs, screenshots, states, evidence, audit, permissions and compliance gates come first; implementation paths appear only as proof metadata.

## What is included

- 14 role/task source cards covering UF-01 through UF-14 and W-01 through W-14.
- 10 pageflow streams covering PF-A through PF-J.
- 63 screenshot IDs covering all registered V3 screens and visual references.
- 19 field/input references for core user-entered or user-selected data.
- Reference terms for roles, demo state, evidence, audit, export, redaction and no-unapproved-advice controls.
- JSON metadata in `user-manual-source.v3.json` for later generation.

## Evidence stance

Current AlphaVest is a route-complete, data-model-rich demo workflow prototype with partial executable workflow behavior. J01 signal/advisor actions are framed as a canonical typed boundary (legacy compatibility bridge) while canonical typed journey governance is migrated. Most other workflows are navigable/static or route-state demos and must not be described as fully persisted or governed in a finished manual until the implementation gaps are closed.

## Mixed Engine artifacts

### V3 Mission Card

| Field | Decision |
| --- | --- |
| Mission | Extract raw artifacts for a future user manual. |
| Non-goal | Do not design or finalize the manual. |
| Source hierarchy | AGENTS and v3 docs; current route registry/components/services/tests; visual references. |
| Proof standard | Evidence levels E0-E6; no E5/E6 without code and verification path. |

### V2 Double Diamond

| Phase | Finding |
| --- | --- |
| Discover | Users need help organized around jobs: setup, onboarding, profile, documents, review, release, decisions, evidence, export, governance and ops. |
| Define | The manual must explain what to do, what to enter, what is blocked and why, and what proof/result completes the task. |
| Develop | A role/task architecture is safer than a route manual because many routes support one workflow and many workflows share gates. |
| Deliver | This package provides raw tables, source cards, screenshot registers and JSON for a later editorial/design pass. |

### Method artifacts

| Method | Artifact |
| --- | --- |
| Psycho-Logic + Map/Model | Trust depends on showing why an action is blocked, not hiding the gate. Maps used: route catalogue, workflow map, data model, journey playbook, current UI. Trap: turning a route into a user goal. |
| Reframing Matrix | Client-facing manual = what can I safely do now; internal manual = what must be reviewed before release; admin manual = what controls visibility; ops manual = what is blocked and why. |
| TRIZ | Improve speed without reducing compliance by documenting UI steps and blocked gates together. Improve transparency without leakage through screenshot IDs plus role/tenant context. |
| SIT Closed World | Existing assets used: 63 visuals, route registry, demo session, existing journeys, gap docs, Prisma schema, workflow API/tests. |
| Morphological Analysis / CCA | Dimensions: role, task, object, gate, UI state, proof. Rejected: route-only manual, screenshot-only manual, final polished manual in this pass. |
| SCAMPER | Substitute route list with task list; combine screenshot and step proof; adapt screencast JSON to manual steps; eliminate spec chrome. |
| Harvard / BATNA | Mutual gain: users get concrete help, engineering keeps honest implementation boundaries. BATNA: use existing journey playbook only, but it misses full manual-source reference layers. |
| MESOs | A: raw manual package now; B: screenshot capture pass next; C: polished manual after implementation gaps. Recommended sequence: A -> B -> C. |
| Measurement | Validate JSON, count tasks/screens/fields, run smoke/visual checks, and capture representative screenshots when server works. |
| Ethics | No fabricated implementation claims; blocked states remain visible; no compliance or advice semantics are weakened. |

## Files

- `MANUAL_INFORMATION_ARCHITECTURE_V3.md`
- `ROLE_TASK_INVENTORY_V3.md`
- `WORKFLOW_PAGEFLOW_CLICKFLOW_CROSSWALK_V3.md`
- `PROCEDURE_SOURCE_CARDS_V3.md`
- `SCREENSHOT_SHOTLIST_V3.md`
- `SCREENSHOT_REGISTER_V3.md`
- `FIELD_INPUT_REFERENCE_V3.md`
- `DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`
- `BRANCHES_AND_TROUBLESHOOTING_V3.md`
- `UI_REALITY_CHECK_V3.md`
- `user-manual-source.v3.json`

## Source files inspected or used

- AGENTS.md
- CODEX_MASTER_TASK.md
- docs/v3/CODEX_TASKS_DETAILED_V3.md
- docs/v3/SCREEN_CATALOGUE_V3.md
- docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md
- docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md
- docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md
- docs/v3/DATA_MODEL_V3.md
- docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md
- docs/v3/USERFLOW_DEFINITIONS_V3.md
- docs/v3/WORKFLOW_DEFINITIONS_V3.md
- docs/v3/PAGE_SPECS_V3.md
- docs/v3/SCREEN_TO_TASK_MATRIX_V3.md
- docs/v3/USER_JOURNEY_PLAYBOOK_V3.md
- docs/v3/journeys.screencast.v3.json
- docs/v3/WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md
- docs/v3/INPUT_MASK_REQUIREMENTS_V3.md
- docs/v3/DATA_MODEL_IMPLEMENTATION_RECONCILIATION_V3.md
- docs/v3/IMPLEMENTATION_GAP_BACKLOG_V3.md
- lib/route-registry.ts
- lib/demo-session.ts
- lib/permission-engine.ts
- lib/workflow-gate.ts
- app/[...segments]/page.tsx
- app/api/demo-workflow/route.ts
- components/*-screen.tsx
- prisma/schema.prisma
- tests/route-smoke.spec.ts
- tests/demo-workflow-api.spec.ts
- tests/permission-engine.spec.ts

## External documentation principles used

- Microsoft Style Guide - Procedures and instructions
- Microsoft Style Guide - Writing step-by-step instructions
- Microsoft Style Guide - Describing interactions with UI
- Microsoft Style Guide - Lists
- Google Developer Documentation Style Guide - UI elements and interaction
- Nielsen Norman Group - Help and Documentation
- Nielsen Norman Group - Task Analysis
- TechScribe - How to write user documentation
- ScreenSteps - 10 Examples of Great End-User Documentation
