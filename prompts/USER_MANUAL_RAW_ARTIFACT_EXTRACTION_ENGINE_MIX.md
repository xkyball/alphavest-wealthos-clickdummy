Max

# AlphaVest User Manual Raw Artifact Extraction Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Extract the raw source package for an AlphaVest WealthOS Benutzerhandbuch from this repository.

Do not design, typeset, polish or finalize the user manual yet. This run must create the structured raw artifacts that a later documentation/design pass can turn into a finished manual:

- role-based task inventory,
- user flows,
- workflows,
- pageflows,
- clickflows,
- screenshots and screenshot references,
- step-by-step procedure material,
- input data requirements,
- allowed/blocked actions,
- field-level rules,
- state, evidence, audit and permission explanations,
- source references,
- implementation-status warnings,
- JSON metadata for later generation.

The manual source must be UI-led, not path-led. Routes, files and code paths are evidence metadata only. The user-facing structure must answer:

- What can this user achieve?
- Where in the UI do they start?
- What do they see?
- What do they select, enter, confirm or review?
- Which data is required, optional, allowed or blocked?
- What happens next?
- Why is the step necessary?
- Which role, tenant, state, permission, evidence, audit or compliance gate matters?
- What result proves the task is done?

## Online Documentation Baseline

Use these external documentation principles as the manual extraction standard. Do not over-quote; use them as operating rules.

Sources checked:

- Microsoft Style Guide, Procedures and instructions: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/
- Microsoft Style Guide, Writing step-by-step instructions: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
- Microsoft Style Guide, Describing interactions with UI: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/describing-interactions-with-ui
- Microsoft Style Guide, Lists: https://learn.microsoft.com/en-us/style-guide/scannable-content/lists
- Google Developer Documentation Style Guide, UI elements and interaction: https://developers.google.com/style/ui-elements
- Nielsen Norman Group, Help and Documentation: https://www.nngroup.com/articles/help-and-documentation/
- Nielsen Norman Group, Task Analysis: https://www.nngroup.com/articles/task-analysis/
- TechScribe, How to write user documentation: https://www.techscribe.co.uk/ta/how-to-write-user-documentation.htm
- ScreenSteps, 10 Examples of Great End-User Documentation: https://blog.screensteps.com/10-examples-of-great-end-user-documentation

Derived rules for this extraction:

1. Organize by user goals, roles and tasks, not by technical route lists.
2. Keep procedures concrete, searchable and focused on one user outcome.
3. Separate procedural "how do I..." material from reference "what is this field/status/button..." material.
4. For multi-step tasks, produce numbered steps; one meaningful action per step unless adjacent short actions happen in the same UI area.
5. Use UI labels, screen names and task names as the user-facing anchors. Keep raw route paths in source-proof columns.
6. Use screenshots when they reduce confusion, prove UI state, or locate a difficult UI element. Do not use screenshots as a substitute for explaining the action.
7. Each screenshot must have a stable ID, caption, role/tenant/state context, viewport, source route, related workflow and nearby step references.
8. The manual must include end results: what the user should see after a task, which state changes, and what evidence/audit/export artifact is created or expected.
9. The right detail level is enough for the intended role to complete the job without logical jumps, but not a full encyclopedia inside each procedure.
10. Large or complex workflows need variants, blocked states and "if this, then that" branches.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof wrapper:

- Mission Card
- Evidence Intake
- Problem Architecture
- Branch preservation
- Adversarial QA
- Proof Paths
- Learning Log

Use ENGINE_v2 as the structured extraction and handoff stack:

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

Keep method artifacts concise but visible. Do not name-drop methods without producing their artifact.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Non-Negotiable Product Constraints

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
- Treat visual references as design direction, composition and screen-state evidence, not pixel-perfect manual screenshots.
- Do not turn spec panels, route labels, filenames, annotation rails, dev notes, callout legends or explanatory documentation into application UI.
- If current behavior is static, demo-only, fake, route-hop-based, no-op or non-persistent, say so directly in the raw artifact.
- Do not count a workflow as user-manual-ready merely because a planned route, visual asset, static card, disabled button or dummy label exists.

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
- `docs/v3/journeys.screencast.p0.v3.json`
- `docs/v3/journeys.screencast.p1.v3.json`
- `docs/v3/journeys.screencast.p2.v3.json`
- `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
- `docs/v3/SCREENCAST_RUNBOOK_V3.md`
- `docs/v3/WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md`
- `docs/v3/INPUT_MASK_REQUIREMENTS_V3.md`
- `docs/v3/DATA_MODEL_IMPLEMENTATION_RECONCILIATION_V3.md`
- `docs/v3/IMPLEMENTATION_GAP_BACKLOG_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.json`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- prompt files under `prompts/` that affect workflow, journey, screenshot or screencast scope

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
- `tests/`
- `public/reference/page_ui_v3/clean_pages/`

## Suggested Discovery Commands

Use `rg` / `rg --files` first.

Recommended commands:

```bash
pwd
git status --short
rg --files AGENTS.md CODEX_MASTER_TASK.md docs/v3 app components lib prisma scripts tests prompts public/reference/page_ui_v3/clean_pages package.json
rg -n "route|pageflow|userflow|workflow|journey|step|interaction|click|target|testId|inputData|field|form|submit|save|draft|upload|review|approve|release|block|export|evidence|audit|permission|visibility|role|tenant|state|status" docs/v3 app components lib scripts tests prompts
rg -n "aria-label|title=|data-testid|button|input|select|textarea|form|onClick|href|router|redirect|useSearchParams|queryParams" app components lib scripts tests
rg -n "model |enum |@@|@id|@relation" prisma/schema.prisma prisma_reference/schema.prisma
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm visual:contract
pnpm build
pnpm screencast:dry-run
pnpm test:route-smoke
pnpm test:workflow-api
```

If a command fails, keep going where possible and record exact failure, likely cause and impact on confidence.

## Manual Source Architecture

The finished raw source package must support two later manual layers:

1. User guide layer: task-based articles, grouped by role and user goal.
2. Reference layer: screens, fields, statuses, roles, permissions, evidence, audit, exports, data objects and troubleshooting.

Do not create a route-by-route manual as the primary structure. Route paths may appear only as implementation proof, screenshot provenance or QA metadata.

Recommended information architecture:

- Getting started with the demo session
- Role and tenant context
- Client-facing tasks
- Advisor and analyst tasks
- Compliance tasks
- Platform and tenant admin tasks
- Governance and access tasks
- Evidence and export tasks
- Operations and reference tasks
- Troubleshooting blocked, restricted, missing-evidence and no-advice states
- Field, status and data reference

## Evidence Levels

Classify every workflow, task, screenshot and procedure claim with one of these evidence levels:

- `E0 planned only`: only exists in docs/spec/reference.
- `E1 visual reference`: visible in reference PNG or visual manifest, but not implemented.
- `E2 static UI`: route/component renders static representation without executable workflow.
- `E3 navigable UI`: user can move through route/page/modal states, but no meaningful data mutation/persistence.
- `E4 demo-state executable`: workflow changes demo-local state or query state and is visible/reproducible.
- `E5 persisted executable`: workflow writes/reads Prisma-backed data and can be verified after reload or DB query.
- `E6 governed executable`: persisted workflow also enforces role/tenant/permission, evidence, audit and client-visibility/compliance semantics.

Do not use `E5` or `E6` without code evidence and a verification path.

## Extraction Dimensions

### 1. Role And Goal Inventory

Build a manual-first inventory of all user goals grouped by role, not by route.

Output:

| Manual Task ID | Role | User Goal | Business Outcome | Frequency | Criticality | Supported Workflow(s) | UI Entry Point | Completion Result | Evidence Level | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Use task titles such as "Release a recommendation to a client" or "Upload a document for review", not route titles such as "/documents/upload".
- Include client, advisor, analyst, compliance, platform admin, tenant admin, governance, privacy/export and ops roles.
- Include tasks that are blocked or planned, but mark them honestly.

### 2. Workflow, Pageflow And Clickflow Crosswalk

For every planned workflow and user journey, map:

- user-facing goal,
- actor/role,
- tenant context,
- workflow ID,
- pageflow ID,
- involved screens,
- clickflow sequence,
- required data,
- states before/after,
- evidence/audit events,
- client-visibility/compliance implications,
- implementation status.

Output:

| Manual Task ID | Workflow | Pageflow | Clickflow Summary | Screen Sequence | Required Data | State Before | State After | Evidence/Audit | Client Visibility Rule | Current Status | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 3. Procedure Source Cards

For each manual task, create a procedure source card with this exact structure:

```md
## [Manual Task ID] [Task Title]

Audience:
Business goal:
When to use:
Prerequisites:
Role and tenant context:
UI start point:
Screenshots:
Required data:
Optional data:
Allowed values:
Validation and blocked inputs:
Step-by-step source:
Expected result:
Evidence created or referenced:
Audit created or expected:
Client visibility / compliance rule:
Variants and branches:
Troubleshooting / blocked states:
Current implementation status:
Source proof:
Open questions:
```

Step rows must use this schema:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |

For manual prose, prefer input-neutral verbs such as "open", "select", "enter", "choose", "review", "confirm" and "submit". For the raw clickflow artifact, also record exact click target details such as label, role, `data-testid`, selector or route.

### 4. Screenshot Shotlist And Register

Create a shotlist before capture:

| Screenshot ID | Manual Task ID | Role | Tenant | Screen/State | Viewport | Purpose | Must Show | Should Hide | Capture Method | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Then capture or register screenshots:

- Capture live UI screenshots through the app whenever possible.
- Use the role switcher and tenant switcher where they are part of the workflow.
- Capture the actual UI state required by the task, not only the route default.
- Include reference PNG path as design context, but do not substitute reference PNGs for live screenshots unless the app state is not implemented.
- Crop or annotate only in the raw artifact if it clarifies the step; preserve an unmodified original screenshot too.
- Do not include spec panels, filename labels, annotation rails or prompt artifacts as user-manual screenshots.

Screenshot register schema:

| Screenshot ID | File Path | Related Reference Asset | Captured Live? | Route Metadata | User-Facing Screen Name | Role/Tenant | State | Viewport | Related Step(s) | Caption Draft | Notes / Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Store screenshots under a timestamped artifact directory such as:

```text
artifacts/user-manual-source/YYYYMMDD-HHMMSS/screenshots/
```

If image files should not be committed, still create the register with absolute or repo-relative artifact paths and explain that the image files are proof artifacts.

### 5. Field And Input Reference

For every task where a user enters, selects, uploads, confirms or rejects data, extract field-level requirements.

Output:

| Field Reference ID | Manual Task ID | Screen | Field Label | User Meaning | Required? | Type | Allowed Values | Example Demo Value | Validation | Error/Blocked State | Data Model Mapping | Sensitivity | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Include:

- text inputs,
- selects,
- checkboxes,
- radio/segmented controls,
- upload controls,
- notes/comment fields,
- search/filter controls,
- confirmation modals,
- accept/defer/reject decisions,
- release/block reasons,
- redaction/export settings.

For every field, explain what the user is allowed to enter, what they must not enter, and why the field exists in the workflow.

### 6. Data, State, Evidence And Audit Reference

Create a user-facing reference source for:

- demo tenants,
- demo roles,
- common object types,
- status values,
- workflow statuses,
- document statuses,
- compliance statuses,
- decision statuses,
- evidence statuses,
- export statuses,
- advice classifications,
- visibility statuses,
- permission actions,
- audit outcomes.

Output:

| Reference ID | Term | User-Facing Meaning | Internal Source | Where Users See It | What It Allows | What It Blocks | Related Workflow(s) | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Do not expose backend implementation details as user-facing explanation unless they help the user understand a visible state or blocked action.

### 7. Branches, Variants And Troubleshooting

For every complex flow, document:

- happy path,
- blocked path,
- missing evidence path,
- permission restricted path,
- compliance hold path,
- draft/save/cancel path,
- error or empty state,
- role mismatch,
- tenant mismatch,
- export/redaction exception,
- advisor approved but not client-visible state.

Output:

| Manual Task ID | Branch ID | Condition | What User Sees | What User Can Do | What User Cannot Do | Required Next Step | Screenshot ID | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 8. Current UI Reality Check

Use browser/DOM inspection if the app can run. For each manual task, distinguish:

- UI text that is actually visible,
- controls that are clickable,
- controls that are disabled,
- controls that are no-op/static,
- route changes,
- query-param/modal/drawer states,
- local/demo state changes,
- persisted data changes,
- evidence/audit/export artifacts.

Output:

| Manual Task ID | UI Surface | Visible Text | Active Controls | Disabled/Blocked Controls | Actual Result | Claimed Result In Docs | Mismatch | Evidence Level | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 9. Raw Manual JSON

Create a machine-readable artifact:

`docs/v3/user-manual-source/user-manual-source.v3.json`

Minimum schema:

```json
{
  "generatedAt": "ISO-8601 timestamp",
  "engineMode": "ENGINE_MIX_V2_CODEX_V3_PROOF",
  "repository": "/Users/chris/projects/alphavest-wealthos-clickdummy",
  "sourceFiles": [],
  "externalDocumentationSources": [],
  "manualInformationArchitecture": [],
  "roles": [],
  "manualTasks": [],
  "workflowCrosswalk": [],
  "procedureCards": [],
  "steps": [],
  "screenshots": [],
  "fields": [],
  "referenceTerms": [],
  "branches": [],
  "implementationStatus": [],
  "gaps": [],
  "blockedChecks": [],
  "proofPaths": [],
  "limitations": []
}
```

## Required Deliverables

Create this directory:

```text
docs/v3/user-manual-source/
```

Create or update these raw artifacts:

1. `docs/v3/user-manual-source/README.md`
2. `docs/v3/user-manual-source/MANUAL_INFORMATION_ARCHITECTURE_V3.md`
3. `docs/v3/user-manual-source/ROLE_TASK_INVENTORY_V3.md`
4. `docs/v3/user-manual-source/WORKFLOW_PAGEFLOW_CLICKFLOW_CROSSWALK_V3.md`
5. `docs/v3/user-manual-source/PROCEDURE_SOURCE_CARDS_V3.md`
6. `docs/v3/user-manual-source/SCREENSHOT_SHOTLIST_V3.md`
7. `docs/v3/user-manual-source/SCREENSHOT_REGISTER_V3.md`
8. `docs/v3/user-manual-source/FIELD_INPUT_REFERENCE_V3.md`
9. `docs/v3/user-manual-source/DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`
10. `docs/v3/user-manual-source/BRANCHES_AND_TROUBLESHOOTING_V3.md`
11. `docs/v3/user-manual-source/UI_REALITY_CHECK_V3.md`
12. `docs/v3/user-manual-source/user-manual-source.v3.json`

If screenshots are captured, create:

```text
artifacts/user-manual-source/YYYYMMDD-HHMMSS/screenshots/
artifacts/user-manual-source/YYYYMMDD-HHMMSS/capture-log.json
```

Update these reporting files only if the repository convention requires documentation-run reporting:

- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Do not update them just to pad the run. If updated, state that this was a documentation source extraction run, not a product implementation phase.

## Acceptance Criteria

The extraction is successful only if:

- all mandatory source files are read or explicitly marked missing,
- the output is organized by roles, goals and tasks, not routes,
- all planned user flows, workflows, pageflows and clickflows are represented,
- every important task includes who does it, why it exists, what data is required, what UI is used, what result is expected and what gate applies,
- every screen used by a task has a screenshot ID or an explicit reason why no live screenshot exists,
- screenshots are referenced near the relevant steps,
- field/input requirements include required/optional status, allowed values, example demo data, validation and source proof,
- current static/no-op/demo-only behavior is not overclaimed,
- client visibility, compliance release, evidence and audit semantics are explained for every relevant task,
- blocked and restricted states are documented, not hidden,
- route paths and code files appear as proof metadata, not as the primary manual structure,
- JSON output is valid and machine-readable,
- commands run and failures are reported,
- no product code behavior is changed.

## Final Response Contract

In the final response, report:

- created/updated files,
- screenshot artifact directory, if created,
- commands run,
- commands that failed and why,
- number of roles, manual tasks, workflows, pageflows, clickflows, screenshots and fields extracted,
- top implementation-status warnings,
- whether any source files were missing,
- whether any claims remain low-confidence,
- recommended next prompt for turning raw artifacts into a polished Benutzerhandbuch.

Do not present the final manual text as completed. This run ends at raw manual source extraction.

