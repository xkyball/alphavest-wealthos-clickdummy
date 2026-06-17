Max

# AlphaVest Project Definition, Workflow, Pageflow, Code Reality And Input-Mask Gap Analysis

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Scan the AlphaVest WealthOS repository end to end and produce a detailed, evidence-backed gap analysis that reconciles:

- planned project definitions,
- user flows,
- page flows,
- click flows,
- screen definitions,
- task definitions,
- data model requirements,
- visual references,
- current code behavior,
- current demo data,
- current persistence, evidence, audit, permission, workflow and visibility logic.

The central question is:

What is already possible today from the planned workflows and page flows, what is only visually/staticly represented, what is missing, and which input masks/forms are required next to make the planned workflows executable against the data model?

This is an analysis-only run. Do not implement the missing input masks, routes, state transitions, mutations, backend actions, UI components, or data model changes unless the user explicitly asks for a follow-up implementation prompt.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof wrapper:

- Mission Card
- Evidence Intake
- Problem Architecture
- Branch preservation
- Debate
- Adversarial QA
- Proof Paths
- Learning Log

Use ENGINE_v2 as the structured analysis and handoff stack:

- Double Diamond
- Psycho-Logic + Map/Model
- Reframing
- TRIZ
- SIT Closed World
- Morphological Analysis / Zwicky Box + CCA
- SCAMPER
- Harvard / BATNA
- MESOs
- Measurement Plan
- Ethics & Fairness

Keep the method artifacts concise but visible. Do not name-drop methods without producing their artifact.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Non-Negotiable Constraints

- Follow `AGENTS.md`; repository-specific guidance is authoritative.
- Demo-data-first only.
- Do not introduce real authentication.
- Do not use real client data.
- Do not weaken role, tenant, permission, evidence, audit, advice-boundary or compliance-release semantics.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions where the app claims completion.
- Sensitive actions create audit events where the app claims completion.
- Treat visual references as design direction, composition and screen-state evidence, not pixel-perfect implementation contracts.
- Do not turn spec panels, route labels, filenames, annotation rails, dev notes, callout legends or explanatory documentation into application UI.
- If current behavior is static, demo-only, fake, route-hop-based or non-persistent, say so directly.
- Do not count a planned workflow as implemented merely because a screenshot, design reference, route name, static card, disabled/no-op button, or dummy data label exists.

## Mandatory Source Reading

Read these before analysis decisions:

1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
6. `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
7. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
8. `docs/v3/DATA_MODEL_V3.md`
9. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`

Also read if present:

- `docs/v3/USERFLOW_DEFINITIONS_V3.md`
- `docs/v3/WORKFLOW_DEFINITIONS_V3.md`
- `docs/v3/PAGE_SPECS_V3.md`
- `docs/v3/SCREEN_TO_TASK_MATRIX_V3.md`
- `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`
- `docs/v3/journeys.screencast.v3.json`
- `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
- `docs/v3/SCREENCAST_RUNBOOK_V3.md`
- `docs/v3/DESIGN_IMPLEMENTATION_GAP_ANALYSIS_V3.md`
- `docs/v3/PIXEL_ACCURACY_TASKS_V3_V2.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.json`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `README_CODEX_HANDOFF_V3.md`
- prompt files under `prompts/` that affect current implementation scope

Inspect visual references:

- `public/reference/page_ui_v3/clean_pages/`

Inspect implementation reality:

- `package.json`
- `app/`
- `components/`
- `components/ui/`
- `lib/`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma_reference/`, if still relevant
- `scripts/`
- existing tests, if present
- route, status, permission, workflow, evidence, audit, export, visibility, demo-session and demo-data helpers

## Suggested Discovery Commands

Use `rg` / `rg --files` first.

Recommended commands:

```bash
pwd
git status --short
rg --files AGENTS.md CODEX_MASTER_TASK.md docs/v3 app components lib prisma scripts prompts public/reference/page_ui_v3/clean_pages package.json
rg -n "TODO|FIXME|manualOrStatic|referenceOnly|disabled|no-op|placeholder|mock|demo|audit|evidence|permission|visibility|workflow|release|approval|compliance|advisor|clientVisibility|role|tenant|input|form|submit|save|draft|upload|review|approve|block|export" docs/v3 app components lib prisma scripts prompts
rg -n "model |enum |@@|@id|@relation" prisma/schema.prisma
rg -n "route|path|href|redirect|router|navigate|startRoute|endState|steps|interaction|navigation" docs/v3 app components lib scripts
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm visual:contract
pnpm build
```

If any command fails, keep going where possible and record exact failure, likely cause and impact on confidence.

## Definitions And Evidence Rules

Classify every claim with one of these evidence levels:

- `E0 planned only`: only exists in docs/spec/reference.
- `E1 visual reference`: visible in reference PNG or visual manifest, but not implemented.
- `E2 static UI`: route/component renders static representation without executable workflow.
- `E3 navigable UI`: user can move through route/page/modal states, but no meaningful data mutation/persistence.
- `E4 demo-state executable`: workflow changes demo-local state or query state and is visible/reproducible.
- `E5 persisted executable`: workflow writes/reads Prisma-backed data and can be verified after reload or DB query.
- `E6 governed executable`: persisted workflow also enforces role/tenant/permission, evidence, audit and client-visibility/compliance semantics.

Do not use `E5` or `E6` without code evidence and a verification path.

For every important statement, include file references. Prefer file paths plus line numbers where feasible. If line numbers are not feasible, name the file and the searched term or section.

## Analysis Dimensions

### 1. Definition Inventory

Build a complete inventory of planned assets:

- user flows,
- page flows,
- click flows,
- workflows,
- journeys,
- screens,
- routes,
- modals/drawers/popups,
- role/tenant contexts,
- workflow states,
- data entities,
- evidence expectations,
- audit expectations,
- visibility/compliance gates,
- implementation tasks and phase tasks.

Output a table:

| Definition ID | Source | Name | Actor/Role | Tenant Context | Planned Routes/Screens | Planned Data Entities | Planned Decisions/States | Evidence/Audit Expectation | Client Visibility Rule | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 2. Current Code Reality Inventory

Map what the code actually contains:

- routes in `app/`,
- dynamic/catch-all routing behavior,
- route registry entries,
- navigation links,
- screen components,
- UI primitives,
- role switcher and tenant switcher behavior,
- demo data,
- Prisma schema,
- seed data,
- permission engine,
- visibility engine,
- workflow gate,
- evidence service,
- audit service,
- export service,
- screencast journey definitions,
- smoke/contract scripts.

Output a table:

| Code Surface | File(s) | What Exists | Data Source | Interaction Type | Persistence | Role/Tenant Handling | Evidence/Audit Handling | Known Static/No-op Areas | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 3. Planned Workflow vs Current Capability Matrix

For every planned workflow and journey, classify what is possible today:

Status vocabulary:

- `complete-governed`
- `complete-demo-persisted`
- `complete-demo-local`
- `navigable-only`
- `static-only`
- `reference-only`
- `missing`
- `ambiguous`

Output a table:

| Workflow/Journey | Planned Goal | Required Actor | Required Screens | Required Click Flow | Required Data Mutations | Current Route/UI | Current Interaction Evidence | Current Data Evidence | Current Status | Missing To Reach Next Level | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Be strict: if a button exists but does not change route, state or data, classify it as static/no-op.

### 4. Pageflow And Clickflow Gap Analysis

For every planned route/screen:

- confirm whether route exists,
- confirm whether screen component exists,
- confirm whether visual reference exists,
- confirm whether user can reach it from the intended previous step,
- confirm whether primary CTAs work,
- confirm whether secondary CTAs work,
- confirm whether error/empty/loading/blocked states exist,
- confirm whether role/tenant context changes content or access,
- confirm whether the target workflow can proceed without direct URL jumps.

Output a table:

| Page/Screen | Planned Entry Point | Planned Exit(s) | Current Route | Reachable By Click? | Primary CTA Behavior | Secondary CTA Behavior | State Coverage | Role/Tenant Coverage | Gap | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 5. Input-Mask / Form Requirement Analysis

Do not build forms. Specify what each required input mask must achieve.

For every missing or incomplete input mask/form, define:

- form name,
- workflow served,
- actor and role,
- tenant context,
- entry route and exit route/state,
- business goal,
- data model entity/entities touched,
- fields required,
- field type,
- required/optional status,
- source of selectable values,
- validation rules,
- default values,
- draft/save/submit/cancel semantics,
- upload/document handling,
- sensitive-data handling,
- permission rule,
- workflow state transition,
- evidence event required,
- audit event required,
- client visibility impact,
- compliance release impact,
- error/empty/loading/blocked states,
- success confirmation,
- tests needed,
- open questions,
- source proof.

Output a table:

| Input Mask ID | Form/Mask Name | Workflow Goal | Actor/Role | Entry/Exit | Data Entities | Required Fields | Validation | Permission/Security | Workflow Transition | Evidence/Audit | Client Visibility | UX States | Acceptance Criteria | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Also output a field-level table:

| Input Mask ID | Field | Type | Required? | Prisma/Data Model Mapping | Source Of Options | Validation | Privacy/Sensitivity | Default | Error Message Requirement | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 6. Data Model Reconciliation

Compare planned `DATA_MODEL_V3.md` to `prisma/schema.prisma`, `prisma_reference/`, `prisma/seed.ts` and all demo-data files.

Output:

| Planned Entity | Planned Fields/Relations | Prisma Entity | Current Fields/Relations | Seed/Demo Availability | Workflow Consumers | Missing Fields | Missing Relations | Migration Risk | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Also identify:

- entities planned but not modeled,
- modeled entities not used by UI,
- UI/demo-data fields not represented in Prisma,
- workflow states not represented as enums/status fields,
- evidence/audit concepts not represented or not linked,
- client visibility/compliance-release fields missing or disconnected,
- tenant/role ownership fields missing or disconnected.

### 7. Task Definition Reconciliation

Compare planned implementation tasks to current files and behavior.

Output:

| Task/Phase | Source | Intended Outcome | Evidence Of Completion | Partial Evidence | Missing Work | Risk If Claimed Done | Recommended Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |

Do not infer completion from file names alone.

### 8. Role, Permission, Compliance And Safety Gap Analysis

For each relevant workflow, report:

- who can start it,
- who can edit it,
- who can approve it,
- who can release it,
- who can see it as client,
- what blocks unapproved advice,
- what records evidence,
- what records audit,
- what must be hidden until compliance release.

Output:

| Workflow | Role Needed | Permission Rule | Current Enforcement | Advice Boundary | Compliance Release Gate | Evidence Event | Audit Event | Gap | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 9. Prioritized Gap Backlog

Create a backlog but do not implement it.

Prioritize gaps by:

- workflow criticality,
- whether it blocks a documented pageflow/userflow,
- whether it blocks truthful demo screencasts,
- whether it creates compliance/advice-boundary risk,
- whether data model support exists already,
- implementation dependency order.

Use priorities:

- `P0`: blocks truthful execution of core planned workflow or safety rule.
- `P1`: needed for major workflow continuity or data completeness.
- `P2`: important polish, secondary state, or non-core workflow support.
- `P3`: optional enhancement or future hardening.

Output:

| Priority | Gap | Affected Workflow/Pageflow | Missing Input Mask? | Data Model Dependency | Permission/Evidence/Audit Dependency | Suggested Implementation Slice | Acceptance Criteria | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 10. Branches, Debate And Weak-Branch Kill List

Preserve at least three possible interpretation branches before converging:

- Branch A: current app is mainly a visual clickdummy with limited executable logic.
- Branch B: current app is a demo-state workflow prototype with partial executable logic.
- Branch C: current app is close to a governed workflow prototype with missing input masks.

Test each branch against evidence and explicitly kill or keep it.

Output:

| Branch | Evidence For | Evidence Against | Verdict | Why |
| --- | --- | --- | --- | --- |

## Required Deliverables

Create or update these analysis artifacts:

1. `docs/v3/WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md`
2. `docs/v3/INPUT_MASK_REQUIREMENTS_V3.md`
3. `docs/v3/DATA_MODEL_IMPLEMENTATION_RECONCILIATION_V3.md`
4. `docs/v3/IMPLEMENTATION_GAP_BACKLOG_V3.md`
5. `docs/v3/PROJECT_DEFINITION_SCAN_EVIDENCE_V3.md`
6. `docs/v3/gap-analysis.v3.json`

Update these reporting files if analysis artifacts are changed:

- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

The JSON artifact must be machine-readable and include at least:

```json
{
  "generatedAt": "ISO-8601 timestamp",
  "sourceFiles": [],
  "definitionInventory": [],
  "workflowCapabilityMatrix": [],
  "pageflowClickflowGaps": [],
  "inputMaskRequirements": [],
  "fieldRequirements": [],
  "dataModelReconciliation": [],
  "rolePermissionComplianceGaps": [],
  "prioritizedBacklog": [],
  "confidenceNotes": [],
  "blockedChecks": []
}
```

## Required Report Structure

Use this structure in `WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md`:

1. Executive Verdict
2. Evidence Standard
3. Facts, Assumptions, Interpretations
4. V3 Mission Card
5. Evidence Intake
6. Problem Architecture
7. Double Diamond Summary
8. Project Definition Inventory
9. Current Code Reality Inventory
10. Workflow Capability Matrix
11. Pageflow And Clickflow Gaps
12. Role, Permission, Evidence, Audit And Compliance Gaps
13. Input-Mask Requirement Summary
14. Data Model Reconciliation Summary
15. Task Definition Reconciliation
16. Prioritized Gap Backlog
17. Branch Debate And Weak-Branch Kill List
18. Proof Paths
19. Learning Log
20. Honest Limitations
21. Method Compliance Checklist

Use the dedicated companion files for deeper input-mask, data-model and backlog tables.

## Acceptance Criteria

The run is successful only if:

- all mandatory source files are read or explicitly marked missing,
- current implementation is inspected rather than assumed,
- every planned workflow has a status classification,
- every missing/incomplete input mask has a requirement specification,
- every input mask requirement maps to the data model or explicitly states the missing model gap,
- role/tenant, permission, evidence, audit and compliance-release implications are covered,
- click-flow gaps distinguish direct-route reachability from actual click-through reachability,
- static UI, no-op controls and route-hop demos are not overclaimed,
- output includes proof paths and line/file references where feasible,
- weak interpretations are killed explicitly,
- no product code is changed,
- commands run and failures are reported.

## Final Response Contract

In the final response, report:

- created/updated files,
- commands run,
- commands that failed and why,
- high-level verdict on what is already possible today,
- top 10 gaps,
- top 10 required input masks,
- whether any required source files were missing,
- whether any claims remain low-confidence,
- the next safest implementation prompt to run after this analysis.

Do not end with implementation code. This run ends at analysis, requirements and backlog.
