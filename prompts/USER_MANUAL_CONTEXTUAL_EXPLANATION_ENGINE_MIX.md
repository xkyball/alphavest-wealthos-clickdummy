Max

# AlphaVest User Manual Contextual Explanation Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Create a context-enrichment layer for the AlphaVest WealthOS user manual.

The current manual already explains what users can do, which roles are involved, which screenshots orient them, which data is required, and which gates or blocked states exist. What is still missing is the continuous product-context narrative:

- why a user is doing something at this point,
- what AlphaVest is trying to achieve with this part of the workflow,
- why the entered or reviewed data matters,
- what risk, ambiguity, or operational gap the step reduces,
- what evidence, audit, visibility, role, tenant, compliance, or governance state is affected,
- what becomes possible later because this step was completed correctly,
- what remains demo-only, partial, future-facing, or not yet production-complete.

This task does not produce the final PDF. It produces the enriched contextual source package that the next state-of-art manual generation and PDF production prompts can consume.

Write all generated user-facing content in English.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Operating Principle

The manual must teach the user's mental model, not only the user's click sequence.

Each major task, screenshot, step, input field, status, and blocked state should answer:

1. What is happening here?
2. Why is it happening here?
3. What does this protect or enable?
4. What decision or handoff depends on it later?
5. What proof, audit, compliance, visibility, or governance state changes?
6. What should the user not assume yet because the current app is demo/prototype scoped?

Do not add generic "context" paragraphs that could fit any SaaS product. Every explanation must be grounded in AlphaVest WealthOS: demo-data-first wealth operations, family-office/advisory workflows, human review, evidence-backed decisions, role/tenant isolation, redaction, audit, and compliance-controlled client visibility.

## Mandatory Source Reading

Follow `AGENTS.md`. Repository-specific instructions are authoritative.

Read these source-of-truth files before creating any artifact:

1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
6. `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
7. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
8. `docs/v3/DATA_MODEL_V3.md`
9. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`

Read the existing manual pipeline:

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

Read the generated manual and PDF package:

1. `docs/v3/user-manual/README.md`
2. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
3. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
4. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_TRACEABILITY_V3.md`
5. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_QA_REPORT_V3.md`
6. `docs/v3/user-manual-pdf/README.md`
7. `docs/v3/user-manual-pdf/ALPHAVEST_USER_MANUAL_PDF_QA_REPORT_V3.md`

Inspect implementation reality only where source claims need checking:

- `app/`
- `components/`
- `lib/route-registry.ts`
- `lib/demo-session.ts`
- `lib/permission-engine.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `app/api/demo-workflow/route.ts`
- `prisma/schema.prisma`
- `tests/`
- `package.json`

## Documentation Baseline

Use the online documentation principles already captured in the prior manual-generation prompts:

- organize around user goals and tasks,
- explain expected results,
- separate procedures from reference material,
- use screenshots to clarify state and sequence,
- avoid route-path-led instructions,
- keep steps concise,
- include recovery and blocked-state guidance,
- preserve accessibility through meaningful captions and alt text,
- keep help searchable and task-oriented.

Add one stronger rule for this prompt:

Context must be embedded near the relevant action. Do not hide all rationale in an introductory chapter. A user should understand why they are taking a step at the point where they take it.

## Product Context To Preserve

The enriched manual must repeatedly reinforce these AlphaVest product principles:

- Digital first.
- Human reviewed.
- Evidence backed.
- Demo-data-first only.
- No real client data.
- No final financial, legal, or tax advice.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions where the app claims completion.
- Sensitive actions create audit events where the app claims completion.
- Role, tenant, object scope, workflow state, sensitivity, and ownership affect what the user can see or do.
- Blocked states are product controls, not generic errors.
- Exports must be scoped, redacted, permission-checked, and audited.

Do not weaken these principles to make the manual feel smoother.

## Context Model

Build the contextual layer around the following reusable explanation lenses.

### 1. Product Purpose Lens

Explain how the task contributes to AlphaVest's larger goal:

- safer wealth operations,
- lower ambiguity in family-office work,
- controlled transition from internal review to client visibility,
- evidence-backed decisions,
- role-safe collaboration,
- audit-ready workflow lineage.

### 2. User Motivation Lens

Explain why the current role cares:

- Platform/Admin roles care about readiness, policy consistency, and avoiding unsafe defaults.
- Client Success roles care about tenant activation and smooth onboarding.
- Principals and Family CFOs care about trust, clarity, access, and decision readiness.
- Analysts care about turning ambiguous signals and documents into reviewable work.
- Advisors care about human judgment without accidental client release.
- Compliance and Privacy roles care about release control, evidence completeness, redaction, and defensibility.
- Ops/Product/QA roles care about bottlenecks, state language, and service quality.

### 3. Data-To-Decision Lens

For every required input, explain:

- what the data represents,
- why it is required or optional,
- which downstream workflow uses it,
- what can go wrong if it is missing, stale, incorrectly scoped, or too sensitive,
- whether it affects evidence, audit, release, redaction, permission, or client visibility.

### 4. Gate And Control Lens

For every gate, blocked state, role limitation, second confirmation, release decision, or export restriction, explain:

- what the control protects,
- which unsafe shortcut it prevents,
- what the user can do next,
- what the user cannot bypass,
- what proof or condition would unblock the workflow.

### 5. Future Enablement Lens

For every task, explain what completing it correctly enables later:

- cleaner onboarding,
- safer recommendations,
- faster evidence review,
- better wealth-structure analysis,
- audit-ready exports,
- clearer family decisions,
- future automation,
- production governance,
- reporting, SLA, or monitoring improvements.

Do not invent future roadmap features as facts. Phrase future-facing value as "this prepares the workflow for..." or "this makes it possible to..." only when the current source package supports the dependency.

### 6. Demo Boundary Lens

For every task, explain what the user should not over-assume:

- demo session is not production authentication,
- visible UI does not always mean full persistence,
- screenshots orient the user but may not prove all transactions,
- file extraction/export/share behavior may be demonstrational unless verified,
- compliance, audit, evidence, or release claims must match source evidence.

## Required Context Coverage

Cover all 14 manual tasks:

- MT-001 Configure the platform policy baseline
- MT-002 Create and prepare a client tenant
- MT-003 Accept an invitation and complete onboarding
- MT-004 Submit client profile and family context
- MT-005 Create an entity and review wealth structure
- MT-006 Upload and verify a document
- MT-007 Process a signal and route internal work
- MT-008 Review an advisor approval package
- MT-009 Release, block, or request evidence for advice-like content
- MT-010 Review and submit a released client decision
- MT-011 Review evidence and create a controlled export
- MT-012 Manage governance users, roles, and access requests
- MT-013 Choose a communication or escalation path
- MT-014 Monitor operations, SLA, and reference state

For each task, create:

1. `why_this_task_exists`
   - the operational, client, compliance, and workflow reason for the task.
2. `why_now`
   - why this task appears at this point in the broader workflow sequence.
3. `what_the_user_is_trying_to_achieve`
   - a plain-English user goal that is richer than the task title.
4. `what_this_prevents`
   - ambiguity, unsafe release, missing evidence, wrong tenant/role, unredacted export, incomplete onboarding, silent access change, etc.
5. `what_this_enables_next`
   - concrete downstream workflows that become possible or cleaner.
6. `context_before_steps`
   - a short paragraph that should appear before the procedure.
7. `step_context`
   - one short rationale per major step or step group.
8. `field_context`
   - explanation of why each required field matters.
9. `gate_context`
   - explanation of relevant evidence, audit, release, permission, second confirmation, redaction, or tenant gates.
10. `blocked_state_context`
    - explanation of blocked states as protective controls, plus the next legitimate action.
11. `future_readiness_note`
    - what this task prepares the product/workflow to do later.
12. `demo_boundary_note`
    - exact wording that prevents overclaiming current implementation.
13. `reader_takeaway`
    - one sentence the user should remember.

## Output Artifacts

Create a new context package:

1. `docs/v3/user-manual-context/README.md`
   - purpose of the context package,
   - source inputs,
   - how it feeds the next manual and PDF generation steps.

2. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.md`
   - polished English contextual narrative, organized by manual section and task.
   - This is not the final manual; it is the approved narrative layer.

3. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
   - machine-readable context package keyed by task ID, workflow ID, field ID, reference ID, and screenshot ID where available.

4. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXT_INTEGRATION_BRIEF_V3.md`
   - instructions for the next manual-generation prompt:
     - where to insert contextual paragraphs,
     - which callout types to use,
     - how much context belongs on PDF pages,
     - what should remain in appendices,
     - how to avoid bloating procedures.

5. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXT_QA_REPORT_V3.md`
   - evidence intake summary,
   - task coverage table,
   - source traceability,
   - overclaim checks,
   - unresolved assumptions,
   - method compliance,
   - next-step recommendation for regenerating the state-of-art manual and PDF.

Do not overwrite the existing manual or PDF in this task unless explicitly asked. This is a source-enrichment stage.

## Suggested JSON Shape

Use this shape, adjusting only if the current source package clearly requires it:

```json
{
  "metadata": {
    "title": "AlphaVest WealthOS User Manual Contextual Narrative V3",
    "language": "en",
    "generatedAt": "ISO-8601 timestamp",
    "sourcePackage": "docs/v3/user-manual-source/user-manual-source.v3.json",
    "boundary": "demo-data-first contextual enrichment; not a product implementation claim"
  },
  "globalContext": {
    "productPurpose": [],
    "manualEditorialRule": [],
    "demoBoundaries": [],
    "safetyPrinciples": []
  },
  "tasks": [
    {
      "taskId": "MT-001",
      "workflowId": "UF-01",
      "pageflowId": "PF-A",
      "title": "",
      "roleContext": "",
      "whyThisTaskExists": "",
      "whyNow": "",
      "whatTheUserIsTryingToAchieve": "",
      "whatThisPrevents": [],
      "whatThisEnablesNext": [],
      "contextBeforeSteps": "",
      "stepContext": [
        {
          "stepRef": "MT-001-S1",
          "userAction": "",
          "whyItMatters": "",
          "affectedState": [],
          "downstreamDependency": []
        }
      ],
      "fieldContext": [
        {
          "fieldRef": "F-001",
          "fieldLabel": "",
          "whyItMatters": "",
          "downstreamUse": "",
          "riskIfWrongOrMissing": "",
          "sensitivityOrGate": ""
        }
      ],
      "gateContext": [],
      "blockedStateContext": [],
      "futureReadinessNote": "",
      "demoBoundaryNote": "",
      "readerTakeaway": "",
      "sourceTrace": []
    }
  ],
  "referenceContext": {
    "evidence": [],
    "audit": [],
    "visibility": [],
    "redaction": [],
    "secondConfirmation": [],
    "statuses": []
  },
  "qa": {
    "coverage": {},
    "overclaimRisks": [],
    "assumptions": [],
    "rejectedWeakBranches": []
  }
}
```

## Editorial Rules

Write in calm, precise, helpful English.

Prefer this pattern:

```text
You do this because...
This matters because...
Completing this step makes it possible to...
The application blocks this when...
In the current demo, this proves/shows... It does not yet prove...
```

Avoid:

- marketing hype,
- vague "platform enables transformation" language,
- route-path instructions as user guidance,
- developer jargon,
- legal or financial advice,
- claims of production completeness,
- claims of real authentication,
- claims of complete file extraction/export/persistence unless verified,
- invented roadmap commitments.

When explaining future value, use cautious dependency language:

- "This prepares..."
- "This supports..."
- "This gives later reviewers..."
- "This creates the context needed for..."
- "When production persistence is implemented, this pattern can support..."

Do not write:

- "This will automatically..."
- "This guarantees..."
- "This is compliant..."
- "The client can rely on this as advice..."

## Context Placement Design

The next manual/PDF should use these content modules. Produce them now:

- `Context note`: 2-4 sentences before a procedure.
- `Why this matters`: 1-3 sentences near a screenshot or task card.
- `What this unlocks`: 2-4 bullets after the expected result.
- `Control rationale`: 1-3 sentences for compliance, evidence, audit, redaction, second confirmation, or permission gates.
- `Demo boundary`: 1-2 sentences where current implementation is partial.
- `Reader takeaway`: one compact sentence at the end of a task.

Use these modules consistently so the PDF can later lay them out as callouts without becoming bloated.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof/QA wrapper:

- P0 Mission Card
- P1 Evidence Intake
- P2 Context Problem Architecture
- P3 Narrative Architecture
- P4 Requirements/Gate Architecture
- P5 Execution Plan
- P6 Context Package Draft
- P7 Structural Integration Pass
- P8 Verification Against Sources
- P9 Adversarial QA
- P10 Revision/Hardening
- P11 Final Assembly
- P12 Final Proof

Use ENGINE_v2 as the narrative design and legitimacy stack:

- Double Diamond
- Psycho-Logic + Map/Model
- Reframing Matrix
- TRIZ
- SIT Closed World
- Morphological Analysis / Zwicky Box + CCA
- SCAMPER
- Harvard / Principled Negotiation + BATNA
- MESOs
- Measurement Plan
- Ethics & Fairness

Keep internal Engine method artifacts in the QA report. Do not put them into user-facing manual text unless they produce directly useful context language.

## V2 Method Application Requirements

Create visible method artifacts in the QA report:

1. Psycho-Logic + Map/Model
   - Explain user trust needs, role anxieties, control needs, map traps, and legitimacy risks.
2. Reframing Matrix
   - Compare at least four frames, for example:
     - "click guide" vs "operational reasoning guide",
     - "feature documentation" vs "workflow control manual",
     - "client convenience" vs "client visibility governance",
     - "demo prototype" vs "future production pattern".
3. TRIZ
   - Resolve the contradiction: add rich context without bloating the manual or overclaiming implementation.
4. SIT Closed World
   - Use only existing source assets: current manual, source package, screenshots, workflow maps, data model, evidence/audit references, QA reports.
5. Morphological Analysis / CCA
   - Generate alternative context module combinations and reject incoherent ones.
6. SCAMPER
   - Improve the existing manual structure by substituting, combining, adapting, modifying, putting to another use, eliminating, and rearranging contextual modules.
7. Harvard / BATNA
   - Balance reader comprehension, compliance conservatism, and product ambition with objective criteria.
8. MESOs
   - Provide three equivalent integration strategies for the next manual/PDF step:
     - dense task chapters,
     - layered callouts,
     - appendix-backed concise task pages.
9. Measurement Plan
   - Define cheap checks for whether the enriched manual actually improves understanding.
10. Ethics & Fairness
    - Verify the context language is helpful, not manipulative, not overclaiming, and not hiding limitations.

## V3 Proof Requirements

The QA report must include:

- Evidence Pack:
  - which source files were read,
  - which implementation files were inspected,
  - which claims are facts,
  - which statements are assumptions,
  - which future statements are dependency-framed.
- Coverage Matrix:
  - all 14 tasks,
  - all 19 field references,
  - all key evidence/audit/visibility references,
  - all blocked-state families.
- Adversarial QA:
  - where the new context could become marketing fluff,
  - where it could overstate implementation,
  - where it could confuse demo behavior with production behavior,
  - where it could make the PDF too long.
- Rejected Weak Branches:
  - reject at least three bad strategies, such as "add one generic intro chapter only", "turn every step into long prose", or "claim future automation as implemented".
- Proof Path:
  - commands/checks used,
  - files created,
  - validation results.
- Learning Log:
  - what the next manual/PDF generation prompt must do differently because of this context layer.

## Acceptance Criteria

The task is complete only if:

- all required output artifacts exist under `docs/v3/user-manual-context/`,
- all 14 manual tasks have contextual explanations,
- all 19 field references have field-level rationale,
- every task has at least one future-readiness note and one demo-boundary note,
- blocked states are explained as controls, not generic errors,
- no route path appears as user-facing navigation guidance,
- no production authentication, real client data, financial/legal/tax advice, full persistence, full export generation, or PDF/UA-like claim is introduced,
- generated JSON parses successfully,
- generated Markdown has no unresolved placeholders such as `TBD`, `TODO`, `FIXME`, or fake citations,
- source claims are traceable,
- `pnpm typecheck` and `pnpm lint` are run if the repository environment supports them,
- the final response lists changed files, checks run, unresolved risks, and the recommended next prompt to execute.

## Recommended Next Step After This Prompt

After this context package exists, run or update the state-of-art manual generation prompt so it consumes:

- `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.md`
- `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
- `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXT_INTEGRATION_BRIEF_V3.md`

Then regenerate the PDF package with `prompts/USER_MANUAL_PDF_PRODUCTION_ENGINE_MIX.md`.

