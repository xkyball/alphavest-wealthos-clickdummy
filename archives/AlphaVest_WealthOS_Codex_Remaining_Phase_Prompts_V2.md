# AlphaVest WealthOS — Codex Remaining Phase Prompts V2

This file contains copy-paste-ready Codex prompts for the remaining AlphaVest WealthOS implementation phases after **Phase 4 — UX Model Refactor and Visual Alignment**.

Use these prompts only after the v2 handoff pack has been copied into the repository and Phase 4 has produced at least:

```text
docs/v2/EXISTING_PHASE_1_3_AUDIT.md
docs/v2/DELTA_ANALYSIS_V2.md
docs/v2/REFACTOR_PLAN_V2.md
docs/v2/PHASE_4_QA_REPORT.md
```

## Important operating rule

Do not skip Phase 4 QA. Phase 5 starts only after Phase 4 confirms that the repository is aligned to the v2 UX model, v2 visual interpretation rules, v2 screen/state inventory, v2 permissions, v2 state machines, and v2 evidence/audit mapping.

## Visual interpretation rule for all phases

The v2 visuals are not 1:1 UI screenshots. Many include annotations, legends, dev notes, metadata, backstage workflows, state examples, audit hints, permission notes, and implementation references. Codex must interpret them as follows:

```text
Only the actual app screen area, drawer, modal, table, mobile frame, kanban board, form, graph, or user-facing / internal-facing interface region should become HTML/CSS/React UI.

Annotations, legends, dev notes, metadata, backend workflow notes, evidence/audit notes, state explanations, permission hints, and test hints must be translated into:
- implementation logic,
- central helpers,
- route state handling,
- tests,
- documentation,
- API/mock-data contracts,
- state machines,
- permission rules,
- evidence/audit mapping.

Do not blindly recreate the entire visual board as the application UI.
Some images are reference-only and should become docs/dev reference pages or implementation logic, not end-user product screens.
```

---

# Phase 5 Prompt — Client Experience Rebuild

Copy the full prompt below into Codex after Phase 4 has passed QA.

```markdown
Read AGENTS.md first.

PHASE_TO_RUN: 5
PHASE_NAME: Client Experience Rebuild

You are working in the existing AlphaVest WealthOS repository.
Phase 1–3 were already implemented.
Phase 4 — UX Model Refactor and Visual Alignment must already be complete.
The project phase model has changed. Do not continue the old phase plan.

## 1. Required pre-flight reading

Before making changes, read:

- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
- docs/v2/PAGE_VISUAL_INVENTORY_V2.md
- docs/v2/VISUAL_ASSET_MANIFEST_V2.md
- docs/v2/SCREEN_SPECS_V2.md
- docs/v2/SCREEN_STATE_INVENTORY_V2.md
- docs/v2/PERMISSION_MATRIX_V2.md
- docs/v2/STATE_MACHINES_V2.md
- docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/PHASE_MODEL_V2.md
- docs/v2/EXISTING_PHASE_1_3_AUDIT.md
- docs/v2/DELTA_ANALYSIS_V2.md
- docs/v2/REFACTOR_PLAN_V2.md
- docs/v2/PHASE_4_QA_REPORT.md

Inspect these visual folders:

- public/reference/visuals_v2/client/
- public/reference/wireframes_v2_boards/
- public/reference/wireframes_v1/ if present

Important: visual boards include annotations and implementation notes. Do not recreate the entire board as UI. Implement only the screen/drawer/modal/page portion. Translate notes into logic, states, tests and documentation.

## 2. Phase 5 objective

Rebuild and align the client-facing experience to v2 screen specs and visuals.

Phase 5 routes:

- /mobile
- /mobile/upload
- /portal
- /wealth-map
- /actions
- /decisions
- /evidence

Core principle:

No unapproved advice reaches the client.

Client-facing pages must never show advice-like recommendation content unless the central visibility gate confirms:

- advisor approval exists,
- compliance release exists,
- evidence record exists,
- permission check passes.

## 3. Visual source references for Phase 5

Use these images as visual and state references:

```text
V2-001 client/V2-001-mobile-home-default.png
V2-002 client/V2-002-mobile-home-recommendation-blocked.png
V2-003 client/V2-003-mobile-home-empty.png
V2-004 client/V2-004-mobile-upload-select-type.png
V2-005 client/V2-005-mobile-upload-extraction-review.png
V2-006 client/V2-006-mobile-upload-low-confidence-blocked.png
V2-007 client/V2-007-mobile-upload-verification-pending.png
V2-008 client/V2-008-mobile-upload-error-retry.png
V2-009 client/V2-009-mobile-decision-notification.png
V2-010 client/V2-010-client-dashboard-default.png
V2-011 client/V2-011-client-dashboard-states.png
V2-012 client/V2-012-dashboard-to-wealth-map-click-path.png
V2-013 client/V2-013-wealth-map-default-graph.png
V2-014 client/V2-014-wealth-map-trust-detail-drawer.png
V2-015 client/V2-015-wealth-map-permission-restricted-node.png
V2-016 client/V2-016-wealth-map-trustee-beneficiary-escalation.png
V2-017 client/V2-017-action-board-default-kanban.png
V2-018 client/V2-018-action-board-detail-drawer.png
V2-019 client/V2-019-action-board-blocked-missing-evidence.png
V2-020 client/V2-020-decision-room-ready-to-decide.png
V2-021 client/V2-021-decision-room-missing-permission-blocked.png
V2-022 client/V2-022-decision-room-evidence-created.png
V2-023 client/V2-023-evidence-vault-default-preview-drawer.png
V2-024 client/V2-024-evidence-vault-permission-restricted.png
V2-025 client/V2-025-evidence-vault-missing-evidence-escalation.png
```

If some images are missing or are placeholders, continue from SCREEN_SPECS_V2 and SCREEN_STATE_INVENTORY_V2, but record the gap in docs/v2/PHASE_5_QA_REPORT.md.

## 4. Required work

### 4.1 Mobile Home / Next Step Today

Implement or refactor /mobile to support:

- default priority action state,
- recommendation blocked state,
- empty / all-caught-up state,
- decision notification entry state,
- role badge,
- permission note,
- backstage status badges,
- bottom navigation,
- links to upload, decisions, governance and evidence.

The recommendation blocked state must clearly show that client visibility is blocked until compliance release is complete.

### 4.2 Mobile Document Upload

Implement or refactor /mobile/upload to support:

- select document type,
- upload source selection,
- extraction review,
- low confidence blocked state,
- verification pending state,
- upload error / retry state,
- AI-DRAFT label for extraction,
- analyst review route,
- evidence placeholder,
- audit event model.

### 4.3 Client Web Dashboard

Implement or refactor /portal to support:

- readiness score,
- open actions,
- pending decisions,
- missing documents,
- upcoming reviews,
- advisor messages,
- trigger feed,
- evidence status,
- governance status,
- states for loading, error and permission blocked,
- click path from readiness score to /wealth-map with focused gaps.

Include the note: Visibility score is not advice.

### 4.4 Live Wealth Map

Implement or refactor /wealth-map to support:

- graph-like entity / asset / document / decision structure,
- filters,
- relationship legend,
- Trust X detail drawer,
- permission-restricted node state,
- trustee / beneficiary escalation state,
- evidence links,
- audit event when sensitive nodes are opened.

A complex graph library is optional. A clear CSS/SVG/TikZ-like layout in React is acceptable if robust.

### 4.5 Action Board

Implement or refactor /actions to support:

- kanban or table/kanban hybrid,
- columns and statuses from v2 state inventory,
- action detail drawer,
- blocked / missing evidence state,
- owner, due date, related object, evidence status,
- call/F2F triggers,
- mini workflow per action.

### 4.6 Digital Decision Room

Implement or refactor /decisions to support:

- ready-to-decide state,
- missing permission blocked state,
- decision submitted / evidence created success state,
- Accept / Defer / Reject actions,
- evidence link,
- audit event,
- review date,
- family approvals.

Do not show unreleased advice-like content if gates are incomplete.

### 4.7 Evidence Vault

Implement or refactor /evidence to support:

- evidence list,
- filters,
- preview drawer,
- permission restricted state,
- missing evidence escalation state,
- audit trail preview,
- client-visible vs internal-only markers.

## 5. Implementation rules

- Preserve Phase 4 infrastructure and helpers.
- Use central route definitions where available.
- Use central permission helper, not scattered conditionals only.
- Use central state helpers/state machines where possible.
- Use central evidence/audit helpers where possible.
- Do not implement internal workflow screens beyond minimal links/stubs required for Phase 5.
- Do not build Phase 6, 7, 8 or 9 features yet.
- Do not connect real APIs.
- Use mock/demo data only.

## 6. Required documentation outputs

Create or update:

- docs/v2/PHASE_5_IMPLEMENTATION_PLAN.md
- docs/v2/PHASE_5_QA_REPORT.md
- docs/v2/CLIENT_EXPERIENCE_ROUTE_MAP_V2.md
- docs/v2/CLIENT_EXPERIENCE_STATE_COVERAGE_V2.md

In PHASE_5_QA_REPORT.md include:

- routes implemented,
- visuals used,
- missing visuals/placeholders,
- state coverage,
- permission checks,
- evidence/audit events,
- tests run,
- known limitations,
- readiness for Phase 6.

## 7. Required tests

Add or update tests for:

- /mobile default loads,
- /mobile recommendation blocked state does not reveal hidden recommendation details,
- /mobile/upload supports select → extraction review → verification pending,
- low confidence upload blocks submission or routes to analyst review,
- /portal readiness score routes to /wealth-map focused gaps,
- /wealth-map opens Trust X drawer,
- /wealth-map permission-restricted node hides sensitive fields,
- /actions opens action detail drawer,
- /actions blocked/missing evidence state is visible,
- /decisions blocks if permission missing,
- /decisions submitted state creates visible evidence/audit result,
- /evidence opens preview drawer,
- /evidence restricted state hides sensitive content.

## 8. Acceptance criteria

Phase 5 is complete when:

- all Phase 5 routes exist and are usable,
- client-facing UX follows v2 visuals and specs,
- key states are implemented,
- no-unapproved-advice gate is respected,
- permission restrictions appear correctly,
- evidence/audit outputs are visible in relevant flows,
- tests pass or failures are documented,
- docs/v2/PHASE_5_QA_REPORT.md is complete.

## 9. Commands

Run available checks, adapting to the repo:

```bash
npm run build
npm run lint
npm run test:e2e
```

If package manager differs, use the repo's package manager and document commands.

## 10. Commit

Commit only Phase 5 changes with:

```text
Phase 5: rebuild client experience from v2 visuals and specs
```

Return:

1. Summary of implemented routes.
2. Files changed.
3. Tests run and results.
4. Known limitations.
5. Whether Phase 6 can start.
```

---

# Phase 6 Prompt — Internal Workflow Rebuild

Copy the full prompt below into Codex after Phase 5 has passed QA.

```markdown
Read AGENTS.md first.

PHASE_TO_RUN: 6
PHASE_NAME: Internal Workflow Rebuild

You are working in the existing AlphaVest WealthOS repository.
Phase 1–3 were already implemented.
Phase 4 — UX Model Refactor and Visual Alignment is complete.
Phase 5 — Client Experience Rebuild is complete or has a signed-off QA report.
The project phase model has changed. Do not continue the old phase plan.

## 1. Required pre-flight reading

Before making changes, read:

- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
- docs/v2/PAGE_VISUAL_INVENTORY_V2.md
- docs/v2/VISUAL_ASSET_MANIFEST_V2.md
- docs/v2/SCREEN_SPECS_V2.md
- docs/v2/SCREEN_STATE_INVENTORY_V2.md
- docs/v2/PERMISSION_MATRIX_V2.md
- docs/v2/SERVICE_BLUEPRINT_V2.md
- docs/v2/STATE_MACHINES_V2.md
- docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/PHASE_MODEL_V2.md
- docs/v2/PHASE_4_QA_REPORT.md
- docs/v2/PHASE_5_QA_REPORT.md

Inspect:

- public/reference/visuals_v2/internal/
- public/reference/visuals_v2/states/
- public/reference/visuals_v2/client/ where cross-route evidence or decision state is relevant

Important: visual boards include annotations and implementation notes. Do not recreate the whole board as UI. Implement only the actual screen/drawer/modal/table areas. Translate annotations into logic, docs and tests.

## 2. Phase 6 objective

Rebuild AlphaVest internal workflow screens:

- /signals
- /workbench
- /advisor-approval
- /compliance

The purpose is to make the human-backed operating model visible and clickable:

Signal / Trigger → AI or Rules Draft → Analyst Review → Advisor Approval → Compliance Gate → Client Visibility → Decision Record → Evidence Vault → Review Rhythm.

Hard rule:

No unapproved advice reaches the client.

## 3. Visual source references for Phase 6

Use these images:

```text
V2-026 internal/V2-026-trigger-review-internal-default.png
V2-027 internal/V2-027-trigger-review-low-confidence-escalated.png
V2-028 internal/V2-028-workbench-default-queue-overview.png
V2-029 internal/V2-029-workbench-publish-readiness-disabled.png
V2-030 internal/V2-030-workbench-trigger-detail-analyst-notes.png
V2-031 internal/V2-031-advisor-approval-default-review.png
V2-032 internal/V2-032-advisor-approval-escalate-to-call.png
V2-033 internal/V2-033-advisor-approval-compliance-pending.png
V2-034 internal/V2-034-compliance-console-default-queue.png
V2-035 internal/V2-035-compliance-console-release-to-client.png
V2-036 internal/V2-036-compliance-console-block-release-request-evidence.png
V2-037 internal/V2-037-compliance-console-audit-exception-log.png
```

## 4. Required work

### 4.1 Signal / Trigger Review

Implement or refactor /signals to support:

- signal queue and filters,
- internal default signal review,
- signal review context,
- AI/rules draft summary marked internal-only,
- decision/routing options,
- low confidence / escalated state,
- Request Data / Defer / Dismiss / Route to Advisor,
- trigger is review point, not advice,
- no client visibility at this stage,
- evidence/audit event for classification and routing.

### 4.2 Consultant Workbench

Implement or refactor /workbench to support:

- default queue overview,
- data quality score,
- trigger queue,
- draft recommendations,
- missing info,
- advisor approval queue,
- compliance checklist,
- evidence generator,
- SLA status,
- call queue,
- publish readiness disabled state,
- trigger detail / analyst notes drawer.

Publish/release controls must remain disabled unless all required gates are complete.

### 4.3 Advisor Approval

Implement or refactor /advisor-approval to support:

- default advisor review,
- client/case summary,
- recommendation package,
- documents reviewed,
- AI draft recommendation,
- analyst notes,
- risks and alternatives,
- suggested client wording,
- Approve / Revise / Request More Data / Escalate to Call,
- Escalate to Call state,
- Advisor Approved but Compliance Pending state.

Advisor approval must never directly publish to client. It routes to compliance.

### 4.4 Compliance Console

Implement or refactor /compliance to support:

- compliance queue default,
- output classification,
- advisor sign-off status,
- evidence record status,
- publish permission status,
- ROA status,
- KYC/FICA status,
- POPIA status,
- Release to Client state,
- Block Release / Request Evidence state,
- Audit Trail / Exception Log panel.

Release to client is only possible when all gates pass.

## 5. Implementation rules

- Internal workflow screens are not client-visible unless explicitly stated.
- Use central permission helper.
- Use central workflow/state helper.
- Use central evidence/audit helper.
- Keep client-facing pages from Phase 5 working.
- Do not build Phase 7 governance features except helper integration required for internal workflows.
- Do not build Phase 8 communication/service blueprint pages except links/stubs.
- Use mock/demo data only.

## 6. Required documentation outputs

Create or update:

- docs/v2/PHASE_6_IMPLEMENTATION_PLAN.md
- docs/v2/PHASE_6_QA_REPORT.md
- docs/v2/INTERNAL_WORKFLOW_ROUTE_MAP_V2.md
- docs/v2/INTERNAL_WORKFLOW_STATE_COVERAGE_V2.md

Include:

- routes implemented,
- visuals used,
- internal-only boundaries,
- workflow states,
- advisor/compliance transitions,
- evidence/audit events,
- tests run,
- known limitations,
- readiness for Phase 7.

## 7. Required tests

Add or update tests for:

- /signals loads default internal review,
- low-confidence signal cannot auto-promote,
- signal routing creates an audit/evidence placeholder,
- /workbench loads queue overview,
- publish readiness button remains disabled until gates complete,
- trigger detail drawer opens,
- analyst note can be added in demo state,
- /advisor-approval approve routes item to compliance pending,
- advisor approval does not make item client-visible,
- escalate to call creates call-required state,
- /compliance queue loads,
- release to client only works when all gates pass,
- block/request evidence creates blocked state and audit event,
- compliance audit/exception panel is visible.

## 8. Acceptance criteria

Phase 6 is complete when:

- all internal workflow routes work,
- advisor/compliance workflow states are visible,
- no-unapproved-advice gate holds,
- evidence/audit events are reflected,
- tests pass or failures are documented,
- docs/v2/PHASE_6_QA_REPORT.md is complete,
- Phase 7 can start.

## 9. Commands

Run available checks:

```bash
npm run build
npm run lint
npm run test:e2e
```

Adapt to repo scripts and document what ran.

## 10. Commit

Commit only Phase 6 changes with:

```text
Phase 6: rebuild internal workflow screens from v2 visuals and specs
```

Return:

1. Summary of implemented internal workflows.
2. Files changed.
3. Tests run and results.
4. Known limitations.
5. Whether Phase 7 can start.
```

---

# Phase 7 Prompt — Governance / Permissions / State / Evidence

Copy the full prompt below into Codex after Phase 6 has passed QA.

```markdown
Read AGENTS.md first.

PHASE_TO_RUN: 7
PHASE_NAME: Governance / Permissions / State / Evidence

You are working in the existing AlphaVest WealthOS repository.
Phase 1–3 were already implemented.
Phase 4 refactor is complete.
Phase 5 client experience is complete.
Phase 6 internal workflow rebuild is complete.
The project phase model has changed. Do not continue the old phase plan.

## 1. Required pre-flight reading

Read:

- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
- docs/v2/PERMISSION_MATRIX_V2.md
- docs/v2/STATE_MACHINES_V2.md
- docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md
- docs/v2/SCREEN_STATE_INVENTORY_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/PHASE_5_QA_REPORT.md
- docs/v2/PHASE_6_QA_REPORT.md

Inspect:

- public/reference/visuals_v2/governance/
- public/reference/visuals_v2/states/
- public/reference/visuals_v2/client/
- public/reference/visuals_v2/internal/

Important: some visuals in /states are reference-only. Do not recreate reference boards as normal product UI unless an internal dev/reference route already exists or is explicitly useful. Translate reference content into helpers, tests and documentation.

## 2. Phase 7 objective

Implement and centralise the platform logic that protects WealthOS:

- role / permission management,
- permission states,
- second confirmation,
- state machines,
- evidence events,
- audit events,
- no-unapproved-advice gate,
- client-visible vs internal-only rules.

Primary route:

- /governance

Optional internal/reference routes if useful and consistent:

- /permissions/reference
- /states
- /evidence/audit-map

## 3. Visual source references for Phase 7

Use:

```text
V2-038 governance/V2-038-role-permission-matrix-view.png
V2-039 governance/V2-039-role-detail-drawer.png
V2-040 governance/V2-040-second-confirmation-required.png
V2-041 governance/V2-041-permission-blocked-state.png
V2-042 governance/V2-042-audit-access-history.png
V2-043 states/V2-043-permission-matrix-reference.png
V2-054 states/V2-054-global-state-chip-workflow-badge-reference.png
V2-055 states/V2-055-state-machine-reference.png
V2-056 states/V2-056-evidence-audit-mapping-reference.png
```

## 4. Required work

### 4.1 Central permission model

Create or refactor a central permission model. Suggested files, adapt to repo conventions:

```text
lib/permissions.ts
lib/roles.ts
lib/visibility.ts
lib/access-control.ts
```

The model must support:

- role,
- object type,
- object scope,
- action,
- sensitivity,
- client-visible vs internal-only,
- second confirmation requirement,
- compliance review requirement,
- blocked reason.

Do not rely on client-side hiding alone. Even in the click-dummy, use central helper functions to model access-control decisions.

### 4.2 Governance route

Implement or refactor /governance to support:

- role / permission matrix view,
- role detail drawer,
- second confirmation modal,
- permission blocked state,
- audit access history panel,
- clear role examples,
- permission notes,
- evidence created and audit event output.

### 4.3 State machines

Create or refactor central state machines for:

- recommendation,
- document,
- action,
- permission/access request,
- communication,
- evidence record,
- decision record,
- call escalation.

Suggested files:

```text
lib/state-machines.ts
lib/workflow-status.ts
lib/status-labels.ts
```

### 4.4 Evidence / audit model

Create or refactor central evidence/audit helpers. Suggested files:

```text
lib/evidence.ts
lib/audit.ts
lib/demo-events.ts
```

The model must support:

- document upload event,
- extraction confirmed event,
- analyst note event,
- advisor approval event,
- compliance release/block event,
- client decision event,
- communication sent event,
- access changed event,
- call scheduled/completed event.

### 4.5 No-unapproved-advice gate

Create or refactor a single central function for client visibility of advice-like content.

Suggested helper:

```text
canShowClientAdviceLikeOutput({ advisorApproval, complianceRelease, evidenceRecord, permissionCheck, outputClassification })
```

The gate must return false if any required condition is missing.

## 5. Implementation rules

- Preserve existing route components unless they conflict with the central model.
- Retrofit Phase 5 and Phase 6 screens to use central permission/state/evidence helpers where feasible.
- Do not build Phase 8 communication/service pages yet except helper support.
- Do not connect real identity, KYC, CRM or document APIs.
- Use mock/demo data only.

## 6. Required documentation outputs

Create or update:

- docs/v2/PHASE_7_IMPLEMENTATION_PLAN.md
- docs/v2/PHASE_7_QA_REPORT.md
- docs/v2/CENTRAL_PERMISSION_MODEL_V2.md
- docs/v2/CENTRAL_STATE_MACHINE_MODEL_V2.md
- docs/v2/EVIDENCE_AUDIT_EVENT_MODEL_V2.md
- docs/v2/NO_UNAPPROVED_ADVICE_GATE_V2.md

## 7. Required tests

Add or update tests for:

- permission helper allows and denies based on role/object/action,
- second confirmation required for sensitive changes,
- permission blocked state displays in /governance,
- access history displays audit event,
- advisor approval alone cannot unlock client visibility,
- compliance release without evidence cannot unlock client visibility,
- permission denied blocks decision view,
- evidence event created for decision submission,
- audit event created for permission change,
- central state machine transitions reject invalid transitions.

## 8. Acceptance criteria

Phase 7 is complete when:

- central permission model exists,
- central state machines exist,
- evidence/audit helpers exist,
- no-unapproved-advice gate exists and is used by relevant screens,
- /governance supports matrix, detail drawer, confirmation, blocked and audit states,
- tests pass or failures are documented,
- docs/v2/PHASE_7_QA_REPORT.md is complete,
- Phase 8 can start.

## 9. Commands

Run:

```bash
npm run build
npm run lint
npm run test:e2e
```

Adapt to repository scripts and document command results.

## 10. Commit

Commit only Phase 7 changes with:

```text
Phase 7: centralize governance permissions states and evidence gates
```

Return:

1. Summary of central models implemented.
2. Routes updated.
3. Files changed.
4. Tests run and results.
5. Known limitations.
6. Whether Phase 8 can start.
```

---

# Phase 8 Prompt — Communication, Service Blueprint and Planning

Copy the full prompt below into Codex after Phase 7 has passed QA.

```markdown
Read AGENTS.md first.

PHASE_TO_RUN: 8
PHASE_NAME: Communication, Service Blueprint and Planning

You are working in the existing AlphaVest WealthOS repository.
Phase 4 refactor is complete.
Phase 5 client experience is complete.
Phase 6 internal workflows are complete.
Phase 7 governance, permissions, state and evidence models are complete.
The project phase model has changed. Do not continue the old phase plan.

## 1. Required pre-flight reading

Read:

- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
- docs/v2/SERVICE_BLUEPRINT_V2.md
- docs/v2/STATE_MACHINES_V2.md
- docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md
- docs/v2/PERMISSION_MATRIX_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/PHASE_7_QA_REPORT.md

Inspect:

- public/reference/visuals_v2/communication/
- public/reference/visuals_v2/service-blueprint/
- public/reference/visuals_v2/planning/
- public/reference/visuals_v2/states/

Important: service blueprint and planning visuals are partly reference information. Do not blindly implement them as user-facing screens. Determine what should be a product screen, internal reference screen, documentation page or logic/test requirement.

## 2. Phase 8 objective

Implement or refactor the communication, service blueprint and planning views:

- /communication
- /service-blueprint or /journey
- /roadmap

The goal is to make the product demo explain:

- when digital-only is enough,
- when a call is required,
- when F2F is required,
- how communication creates evidence,
- how the end-to-end service works,
- what is MVP vs future scope,
- how dependencies and blocked features are handled.

## 3. Visual source references for Phase 8

Use:

```text
V2-044 communication/V2-044-communication-decision-tree.png
V2-045 communication/V2-045-call-trigger-matrix.png
V2-046 communication/V2-046-client-visible-message-preview.png
V2-047 communication/V2-047-evidence-communication-log.png
V2-048 service-blueprint/V2-048-full-swimlane-view.png
V2-049 service-blueprint/V2-049-evidence-chain-view.png
V2-050 service-blueprint/V2-050-escalation-returns-view.png
V2-051 planning/V2-051-mvp-future-roadmap-board.png
V2-052 planning/V2-052-blocked-not-mvp-ready-features.png
V2-053 planning/V2-053-mvp-future-dependency-flow.png
V2-054 states/V2-054-global-state-chip-workflow-badge-reference.png
V2-055 states/V2-055-state-machine-reference.png
V2-056 states/V2-056-evidence-audit-mapping-reference.png
```

## 4. Required work

### 4.1 Communication route

Implement or refactor /communication to support:

- communication decision tree,
- call trigger matrix,
- client-visible message preview,
- evidence and communication log,
- decision between digital-only, request data, schedule call, F2F workshop, external specialist,
- advisor/client success/client role views,
- blocked send state when approval/release missing,
- evidence/audit events for communication lifecycle.

No client-facing communication that contains advice-like content may be sent without the gate from Phase 7.

### 4.2 Service blueprint route

Implement or refactor /service-blueprint or /journey as an internal/reference/presentation view.

It should show:

- full swimlane service blueprint,
- customer actions,
- frontstage digital UI,
- backstage AlphaVest actions,
- support processes,
- evidence,
- line of visibility,
- evidence chain,
- escalation/return loops.

This is not necessarily an end-user product screen. It may be an internal demo/reference screen.

### 4.3 Roadmap route

Implement or refactor /roadmap to support:

- MVP vs Phase 2 vs Future scope,
- blocked/not-MVP-ready features,
- dependency flow,
- gates and human-review boundary,
- planning chips,
- links to implementation phases or docs if useful.

This is a product planning/reference screen, not a client wealth screen.

## 5. Implementation rules

- Use central permission, state, evidence and audit helpers from Phase 7.
- Preserve client and internal workflows from prior phases.
- Keep reference screens clearly labelled as internal/reference where appropriate.
- Avoid presenting planning visuals as client-facing product UI.
- Do not implement future features shown on roadmap; show them as planning/deferred only.
- Use mock/demo data only.

## 6. Required documentation outputs

Create or update:

- docs/v2/PHASE_8_IMPLEMENTATION_PLAN.md
- docs/v2/PHASE_8_QA_REPORT.md
- docs/v2/COMMUNICATION_FLOW_MODEL_V2.md
- docs/v2/SERVICE_BLUEPRINT_IMPLEMENTATION_NOTES_V2.md
- docs/v2/ROADMAP_SCOPE_MODEL_V2.md

## 7. Required tests

Add or update tests for:

- /communication loads decision tree,
- selecting a trigger path updates recommendation route,
- message preview remains blocked until required approvals complete,
- communication evidence log displays event history,
- call trigger matrix is visible,
- /service-blueprint loads swimlane view,
- /service-blueprint shows evidence chain and escalation/returns view or tabs,
- /roadmap loads MVP/Phase 2/Future columns,
- blocked/not-MVP-ready feature list is visible,
- roadmap dependency flow is visible,
- reference screens are marked internal/reference.

## 8. Acceptance criteria

Phase 8 is complete when:

- communication flow is usable,
- service blueprint is visible and understandable,
- roadmap and blocked future feature views exist,
- reference screens are not confused with client-facing UI,
- no-unapproved-advice gate applies to communication send/release,
- tests pass or failures are documented,
- docs/v2/PHASE_8_QA_REPORT.md is complete,
- Phase 9 can start.

## 9. Commands

Run:

```bash
npm run build
npm run lint
npm run test:e2e
```

Adapt to repository scripts and document command results.

## 10. Commit

Commit only Phase 8 changes with:

```text
Phase 8: implement communication service blueprint and planning views
```

Return:

1. Summary of routes implemented.
2. Reference vs product-screen decisions.
3. Files changed.
4. Tests run and results.
5. Known limitations.
6. Whether Phase 9 can start.
```

---

# Phase 9 Prompt — QA, Tests, Documentation and Demo Handoff

Copy the full prompt below into Codex after Phase 8 has passed QA.

```markdown
Read AGENTS.md first.

PHASE_TO_RUN: 9
PHASE_NAME: QA, Tests, Documentation and Demo Handoff

You are working in the existing AlphaVest WealthOS repository.
Phase 4 refactor is complete.
Phase 5 client experience is complete.
Phase 6 internal workflow rebuild is complete.
Phase 7 governance/permissions/state/evidence is complete.
Phase 8 communication/service blueprint/planning is complete.
The project phase model has changed. This is the final QA and demo handoff phase for v2.

## 1. Required pre-flight reading

Read:

- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
- docs/v2/VISUAL_ASSET_MANIFEST_V2.md
- docs/v2/SCREEN_SPECS_V2.md
- docs/v2/SCREEN_STATE_INVENTORY_V2.md
- docs/v2/PERMISSION_MATRIX_V2.md
- docs/v2/STATE_MACHINES_V2.md
- docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/PHASE_4_QA_REPORT.md
- docs/v2/PHASE_5_QA_REPORT.md
- docs/v2/PHASE_6_QA_REPORT.md
- docs/v2/PHASE_7_QA_REPORT.md
- docs/v2/PHASE_8_QA_REPORT.md

Inspect all visual assets:

- public/reference/visuals_v2/client/
- public/reference/visuals_v2/internal/
- public/reference/visuals_v2/governance/
- public/reference/visuals_v2/communication/
- public/reference/visuals_v2/service-blueprint/
- public/reference/visuals_v2/planning/
- public/reference/visuals_v2/states/

## 2. Phase 9 objective

Bring the v2 click-dummy / prototype to demo-handoff quality.

This phase is not for major new features. It is for:

- route coverage,
- visual-reference coverage,
- state coverage,
- permission tests,
- no-unapproved-advice tests,
- evidence/audit tests,
- documentation,
- README,
- demo script,
- final QA report,
- known limitations,
- next implementation recommendations.

## 3. Required QA scope

Verify all routes:

```text
/mobile
/mobile/upload
/portal
/wealth-map
/actions
/signals
/decisions
/evidence
/workbench
/advisor-approval
/compliance
/governance
/communication
/service-blueprint or /journey
/roadmap
```

Verify optional/reference routes if implemented:

```text
/states
/permissions/reference
/evidence/audit-map
```

## 4. Required quality gates

### UX gates

- every route maps to v2 screen spec,
- every primary state has visual reference or documented placeholder,
- every sensitive action has blocked/error/loading state,
- every advice-like flow includes backstage workflow,
- every decision links to evidence and audit,
- no product-board-only implementation remains as primary UI.

### Permission gates

- central permission helper exists,
- role/object/action model exists,
- second-confirmation state exists,
- permission blocked states exist,
- client-side hiding is not the only access-control mechanism,
- tests cover role access.

### No-unapproved-advice gates

- AI draft cannot be client-visible,
- analyst review alone cannot be client-visible,
- advisor approval alone cannot be client-visible,
- compliance release is required,
- evidence record is required,
- permission check is required,
- communication send/release respects the gate.

### Evidence / audit gates

- document uploads create events,
- advisor actions create sign-off events,
- compliance release/block creates events,
- client decisions link to evidence records,
- permission changes create audit events,
- communication send/call creates audit/evidence events.

### Technical gates

- build passes,
- lint passes if configured,
- tests pass or failures are documented,
- route smoke tests updated,
- README updated,
- demo script included,
- final v2 implementation report generated.

## 5. Required tests

Create or update Playwright / e2e tests where the repo supports them.

Minimum test list:

### Route smoke tests

- all v2 routes load without crashing,
- navigation between core routes works.

### Client experience tests

- /mobile recommendation blocked does not reveal hidden content,
- /mobile/upload progresses through states,
- /portal readiness score routes to /wealth-map,
- /wealth-map Trust X drawer opens,
- /actions action detail drawer opens,
- /decisions permission blocked state appears,
- /decisions success/evidence state appears,
- /evidence preview drawer opens,
- /evidence restricted state appears.

### Internal workflow tests

- /signals low-confidence cannot auto-promote,
- /workbench publish readiness remains disabled if gates incomplete,
- /advisor-approval approval routes to compliance pending,
- /compliance release requires all gates,
- /compliance block/request evidence creates blocked state.

### Governance/state/evidence tests

- permission helper allows and denies as expected,
- second confirmation is required for sensitive changes,
- permission blocked state appears,
- state machine invalid transitions are rejected,
- no-unapproved-advice gate returns false when any requirement is missing,
- evidence/audit events are created in demo state.

### Communication/planning tests

- /communication decision tree loads,
- communication send is blocked without approvals,
- call trigger matrix loads,
- /service-blueprint loads swimlanes,
- /roadmap loads MVP / Phase 2 / Future views.

## 6. Required documentation outputs

Create or update:

```text
docs/v2/PHASE_9_QA_REPORT.md
docs/v2/V2_IMPLEMENTATION_SUMMARY.md
docs/v2/V2_ROUTE_COVERAGE_REPORT.md
docs/v2/V2_STATE_COVERAGE_REPORT.md
docs/v2/V2_PERMISSION_TEST_REPORT.md
docs/v2/V2_NO_UNAPPROVED_ADVICE_TEST_REPORT.md
docs/v2/V2_EVIDENCE_AUDIT_TEST_REPORT.md
docs/v2/V2_VISUAL_REFERENCE_COVERAGE_REPORT.md
docs/v2/V2_DEMO_SCRIPT.md
docs/v2/V2_KNOWN_LIMITATIONS.md
README.md
```

README.md must include:

- setup instructions,
- run commands,
- route list,
- demo path,
- what is mocked,
- what is not production-ready,
- product safety notes,
- no-unapproved-advice explanation,
- visual reference interpretation note.

## 7. Demo path

Create a demo script that walks through:

1. Mobile Home.
2. Upload document.
3. Client dashboard.
4. Wealth Map and Trust drawer.
5. Action Board and blocked evidence.
6. Decision Room and permission block.
7. Decision submitted / evidence created.
8. Evidence Vault.
9. Consultant Workbench.
10. Advisor Approval.
11. Compliance Release / Block.
12. Governance / Permissions.
13. Communication / Call Trigger.
14. Service Blueprint.
15. Roadmap.

## 8. Commands

Run available checks:

```bash
npm run build
npm run lint
npm run test:e2e
```

If commands differ, inspect package.json and use the correct equivalents. Document any failures with exact command, error summary and recommended fix.

## 9. Acceptance criteria

Phase 9 is complete when:

- final build passes or failure is clearly documented,
- all critical route smoke tests pass,
- permission/no-unapproved-advice/evidence tests exist,
- README is updated,
- demo script is ready,
- implementation summary is complete,
- known limitations are clear,
- the app can be presented as a v2 click-dummy / prototype.

## 10. Commit

Commit only Phase 9 changes with:

```text
Phase 9: finalize v2 QA documentation and demo handoff
```

Return:

1. Final implementation summary.
2. Tests run and results.
3. Remaining known limitations.
4. Demo path.
5. Files changed.
6. Whether the v2 prototype is ready for review.
```

---

# Optional All-Remaining-Phases Control Prompt

Use this only if you want Codex to plan the remaining phases before running them one by one. Do not use it to let Codex implement all phases in one go.

```markdown
Read AGENTS.md first.

You are working in the existing AlphaVest WealthOS repository.
The project phase model has changed.
Phase 4 is UX Model Refactor and Visual Alignment.
Remaining phases are currently defined as:

- Phase 5 — Client Experience Rebuild
- Phase 6 — Internal Workflow Rebuild
- Phase 7 — Governance / Permissions / State / Evidence
- Phase 8 — Communication, Service Blueprint and Planning
- Phase 9 — QA, Tests, Documentation and Demo Handoff

Do not implement anything yet.

Review:
- AGENTS.md
- CODEX_TASK_MASTER_V2.md
- docs/v2/PHASE_MODEL_V2.md
- docs/v2/QUALITY_GATES_V2.md
- docs/v2/TEST_PLAN_V2.md
- docs/v2/VISUAL_ASSET_MANIFEST_V2.md
- docs/v2/PHASE_4_QA_REPORT.md if it exists

Then produce:
- docs/v2/REMAINING_PHASES_EXECUTION_PLAN.md

The execution plan must confirm:
- preconditions for each phase,
- required visual assets for each phase,
- routes affected,
- tests required,
- docs to create/update,
- risks,
- go/no-go criteria.

Do not code.
Do not change app files.
Only create or update the execution plan.
```
