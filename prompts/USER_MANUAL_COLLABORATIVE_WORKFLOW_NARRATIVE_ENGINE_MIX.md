# AlphaVest Collaborative Workflow User Manual Prompt

Max

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Transform the existing AlphaVest WealthOS user manual material into a workflow-native, collaboration-centered user manual source package in English.

The current manual is too table-and-screenshot driven. It explains screens, fields, and controls, but it does not yet make the central product idea emotionally and operationally clear:

AlphaVest WealthOS creates visibility, consistency, accountability, and safe client-facing outcomes inside a complex wealth-operations environment where many roles touch the same data, decisions, evidence, and release gates.

The next manual must therefore explain the application as a collaborative operating system, not as a route catalogue and not as a static screenshot appendix.

## Repository

Work in:

```text
/Users/chris/projects/alphavest-wealthos-clickdummy
```

Do not change application behavior. This is a manual-content and manual-architecture task.

## Required Reading

Read and use these as source of truth:

```text
AGENTS.md
CODEX_MASTER_TASK.md
docs/v3/CODEX_TASKS_DETAILED_V3.md
docs/v3/SCREEN_CATALOGUE_V3.md
docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md
docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md
docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md
docs/v3/DATA_MODEL_V3.md
docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md
docs/v3/user-manual-source/user-manual-source.v3.json
docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json
docs/v3/user-manual-pdf/source/contextual-manual-pdf-data.json
```

Also inspect the current PDF production artifacts only to understand what must be improved:

```text
prompts/USER_MANUAL_CONTEXTUAL_PDF_PRODUCTION_ENGINE_MIX.md
docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.html
docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.css
output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf
output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-contact-sheet.png
```

## Core Problem To Solve

The manual must explain how collaboration actually works.

Do not merely list:

- pages,
- routes,
- fields,
- screenshots,
- buttons,
- tables.

Instead, explain:

- which role acts first,
- what data or decision object is changed,
- which state changes,
- what the next role sees because of that change,
- what remains hidden or blocked,
- what evidence or audit trail is created,
- how client visibility is controlled,
- how the system turns data chaos into a consistent shared operating picture.

## Manual Narrative Thesis

Use this as the manual's narrative spine:

```text
AlphaVest WealthOS is a collaborative workflow system for complex family-office and advisory operations. It does not simply store data. It turns fragmented inputs, documents, signals, recommendations, approvals, decisions, communications, and exports into a controlled shared state. Each role sees the right slice of the truth at the right time, and sensitive outcomes only become client-visible after the required human review, evidence, permission, and compliance gates.
```

## Non-Negotiable Product Rules

Reflect these rules throughout the manual:

- Digital first.
- Human reviewed.
- Evidence backed.
- Tenant scoped.
- Role scoped.
- Workflow-state aware.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions.
- Sensitive actions create audit events.
- Blocked states are protective workflow controls, not generic errors.
- Demo-data-first means no real client data and no production-certification claims.

## Required Output Files

Create a new collaboration-focused manual source package:

```text
docs/v3/user-manual-collaboration/README.md
docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.md
docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json
docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_QA_REPORT_V3.md
```

Do not produce the final PDF in this step unless explicitly asked later. This prompt creates the content and structure that a later PDF prompt can render.

## Required Manual Architecture

The manual must be organized around collaboration and workflow handoffs.

### 1. Executive Workflow Orientation

Explain the system in plain English:

- what problem AlphaVest solves,
- why ordinary data repositories fail in this domain,
- why role-aware workflow state matters,
- how client visibility differs from internal progress,
- why evidence and audit are part of normal work,
- how the product creates one shared operating picture.

### 2. Collaboration Model

Create a chapter that explains the collaboration pattern:

```text
Input -> normalization -> review -> gate -> visibility -> decision -> evidence -> audit -> monitoring
```

For each stage, explain:

- responsible role(s),
- incoming data or object,
- state transition,
- UI surface where the work appears,
- what other roles see next,
- what is not visible yet,
- evidence/audit implication,
- common blocked condition.

### 3. Role Relay Model

Create a role-to-role relay narrative. At minimum include:

- Platform Admin -> Compliance -> Security
- Ops Admin -> Client Success -> Compliance -> Invited User
- Principal / Family CFO -> Analyst -> Advisor
- Client / External Advisor -> Analyst -> Evidence
- System signal -> Analyst -> Advisor -> Compliance
- Compliance -> Principal / Family Council / Trustee
- Principal / Admin -> Compliance / Security for governance changes
- Advisor / Client Success / Client for communication escalation
- Advisor / Compliance / Privacy Officer for export and redaction
- Ops / Product / QA for monitoring and quality feedback

For each relay, describe:

- why the first role acts,
- what object they create or update,
- what changes in workflow state,
- what the next role receives,
- what context the UI should show to the next role,
- what the next role can do,
- what the next role cannot do,
- what evidence or audit trail is created.

### 4. End-To-End Workflow Stories

Create narrative workflow stories, not only task cards.

Each story must follow a real multi-role chain:

1. Tenant becomes operational.
2. Client profile becomes a usable shared family context.
3. Document chaos becomes verified evidence.
4. Signal becomes reviewed recommendation candidate.
5. Advisor-approved package becomes compliance-controlled client visibility.
6. Client decision becomes evidence and review cadence.
7. Governance change becomes permission-safe access.
8. Communication escalation becomes recorded service context.
9. Export request becomes redacted, approved, auditable package.
10. Ops monitoring turns workflow friction into service/product improvement.

For each story include:

- story title,
- problem before AlphaVest,
- actors and roles,
- source screens,
- data objects involved,
- state sequence,
- handoff sequence,
- visibility sequence,
- evidence/audit sequence,
- what the user should understand,
- what the next role sees,
- what the system prevents,
- demo/prototype boundary.

### 5. Cross-Role Visibility Matrix

Create a matrix, but only after the narrative has been written.

Rows should be workflow states or objects, not pages:

- tenant,
- profile,
- entity,
- document,
- extraction,
- trigger,
- recommendation,
- approval,
- compliance review,
- decision,
- evidence record,
- export request,
- message thread,
- access request,
- queue item,
- data quality issue.

Columns should be roles:

- Platform Admin,
- Ops Admin,
- Client Success,
- Principal,
- Family CFO,
- Analyst,
- Advisor,
- Compliance,
- Privacy Officer,
- Security,
- External Advisor,
- Product / QA.

Each cell should describe one of:

- can create,
- can review,
- can approve,
- can release,
- can see summary only,
- can see redacted version,
- internal only,
- blocked until gate,
- audit-only.

### 6. State Transition Atlas

Extract the important state transitions from the data model and workflows.

Include at least:

- TenantStatus,
- DocumentStatus,
- WorkflowStatus,
- RecommendationStatus,
- ComplianceStatus,
- DecisionStatus,
- EvidenceStatus,
- ExportStatus.

For each state group:

- describe the business meaning,
- identify who can move the state forward,
- describe what other roles see after the transition,
- identify evidence/audit implications,
- identify client-visibility implications.

### 7. Screen Usage As Evidence, Not Structure

Screenshots should support the workflow story, not define the manual structure.

For each workflow story, identify:

- primary screenshot(s),
- secondary screenshot(s),
- why each screenshot matters,
- which role viewpoint it represents,
- which handoff or state transition it makes visible.

Do not write route-led instructions like "go to /path". Use UI names and role context.

### 8. Collaboration Diagrams

Create diagram specifications for later PDF production. Use Mermaid or structured JSON.

At minimum include:

- global workflow lifecycle diagram,
- role relay swimlane for trigger -> recommendation -> compliance -> client decision,
- document intake handoff diagram,
- tenant onboarding relay diagram,
- evidence/audit lineage diagram,
- visibility gate diagram.

Diagrams must be source-grounded and must not invent unimplemented backend behavior.

### 9. Manual Chapter Redesign Recommendation

Provide a proposed table of contents for a future PDF that would feel like a serious enterprise workflow manual.

The proposed structure should emphasize:

- collaboration,
- workflow stories,
- role relays,
- visibility,
- evidence,
- decisions,
- governance,
- operational learning.

It should de-emphasize:

- long field tables,
- page-by-page route lists,
- isolated screenshots,
- generic UI explanations.

## Required JSON Schema

The JSON output must be machine-readable and include:

```json
{
  "metadata": {},
  "manualThesis": "",
  "collaborationModel": [],
  "roleRelays": [],
  "workflowStories": [],
  "visibilityMatrix": [],
  "stateTransitionAtlas": [],
  "screenshotUsagePlan": [],
  "diagramSpecs": [],
  "pdfTocRecommendation": [],
  "sourceTrace": [],
  "qa": {}
}
```

Each `workflowStories[]` item must include:

```json
{
  "storyId": "",
  "title": "",
  "problemBeforeAlphaVest": "",
  "actors": [],
  "sourceScreens": [],
  "dataObjects": [],
  "stateSequence": [],
  "handoffSequence": [],
  "visibilitySequence": [],
  "evidenceAuditSequence": [],
  "readerTakeaway": "",
  "systemPrevents": [],
  "demoBoundary": "",
  "sourceTrace": []
}
```

Each `roleRelays[]` item must include:

```json
{
  "relayId": "",
  "fromRole": "",
  "toRole": "",
  "objectOrState": "",
  "whyFirstRoleActs": "",
  "stateChange": "",
  "whatNextRoleSees": "",
  "whatNextRoleCanDo": [],
  "whatNextRoleCannotDo": [],
  "evidenceOrAudit": "",
  "clientVisibilityImpact": "",
  "sourceTrace": []
}
```

## Method Requirements

Use the mixed Engine visibly.

### V3 Proof Wrapper

Produce:

- Mission Card,
- Evidence Intake,
- Problem Architecture,
- Proof Path,
- Adversarial QA,
- Learning Log.

### V2 Method Artifacts

Apply the methods to the manual problem:

- Psycho-Logic + Map/Model:
  - explain why users need to understand role handoffs, not just buttons.
- Reframing Matrix:
  - page manual vs workflow manual,
  - individual task manual vs collaboration manual.
- TRIZ:
  - preserve detail without burying the collaboration logic.
- SIT Closed World:
  - use existing routes, roles, states, screenshots, source JSON, and data model.
- Morphological Analysis:
  - combine chapter types, diagram types, role views, state views, and screenshot usage patterns.
- SCAMPER:
  - mutate the current manual from table/screenshot artifact into workflow operating manual.
- Harvard / BATNA:
  - define legitimate criteria for a "good manual" and the fallback if the manual cannot prove some workflow behavior.
- MESOs:
  - propose three equivalent future PDF structures:
    1. Story-first,
    2. Role-first,
    3. State-machine-first.
- Measurement Plan:
  - define how to test whether a reader understands collaboration after reading the manual.
- Ethics & Fairness:
  - no false production claims, no invented behavior, no hiding demo limitations.

## Quality Gates

The output passes only if:

- It explains collaboration as the core product value.
- It shows how one role's action changes what another role sees.
- It distinguishes internal progress from client-visible release.
- It explains how data chaos becomes consistent shared state.
- It treats evidence, audit, and gates as workflow mechanics, not appendix decoration.
- It avoids route-led instructions.
- It avoids overclaiming persistence or production readiness.
- It provides enough structure for a later PDF production prompt to build a much better manual.

## Final Response Requirements

When execution is complete, report:

- files created,
- core narrative change,
- number of role relays,
- number of workflow stories,
- number of state groups,
- diagram specs produced,
- QA checks performed,
- remaining limitations.
