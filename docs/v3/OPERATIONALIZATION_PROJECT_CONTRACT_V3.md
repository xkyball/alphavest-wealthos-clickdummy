# Operationalization Project Contract V3

Date: 2026-06-17
Phase: P0 - Foundations / Guardrails
Mode: Max / ENGINE_MIX_V2_CODEX_V3_PROOF
Scope: project contract only. No product features, UI routes, APIs, data model changes or demo journey mutations are implemented by this phase.

## 1. Contract Purpose

This contract turns the capability truth audit into the acceptance gate for every later implementation task. A later task may improve the UI, demo journey or workflow state only if it also states the operational capability level it is claiming and provides matching proof.

The core rule is:

```text
Visible UI + static seed data + actionId-only demo mutation is not an operational claim.
```

Operational claims require validated user payloads or file payloads, persistence, reload proof, permission checks, audit/evidence behavior where relevant, and tests.

## 2. Source Files Read For P0

P0 was created from the current repository contract and operational gap evidence:

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md`
- `docs/v3/CAPABILITY_GAP_BACKLOG_V3.md`
- `docs/v3/INPUT_MASK_REQUIREMENTS_V3.md`
- `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md`
- `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md`
- Human Visual Implementation Standard:
  - `README.md`
  - `visual-implementation-rules.md`
  - `design-feedback-patterns.md`
  - `human-visual-review-rubric.md`
  - `codex-start-prompt-human-visual-implementation.md`

## 3. Capability Levels E0-E7

These levels are the required vocabulary for all future task plans, PR notes, phase reports and QA reports.

| Level | Label | Meaning | Minimum proof allowed |
|---:|---|---|---|
| E0 | Not present | No meaningful UI, route, API, data model or workflow surface exists. | Source inspection only. No operational claim. |
| E1 | Visual only | Screen or component exists, but no meaningful interaction path is wired. | Route/screenshot proof only. Must be labelled visual-only. |
| E2 | Static interaction | UI has local state, navigation, disabled/enabled state, modal/drawer state or cosmetic feedback only. | Route/state proof. No persistence claim. |
| E3 | Generic audit | Action records generic proof/audit metadata but does not mutate the relevant domain object from user payload. | API/test proof of audit only. Domain mutation cannot be claimed. |
| E4 | Fixture mutation | Fixed seeded data mutates through a deterministic journey action. User payload is absent or ignored. | API/test proof for the fixture action. Must be labelled fixture-backed. |
| E5 | Partial domain mutation | Domain tables are updated for a bounded demo path, but not from a generalized validated payload or not fully reload-tested. | Service/API tests for bounded mutation plus explicit missing operational proof. |
| E6 | Gated workflow simulation | Fixture or bounded mutation is wrapped with permission, workflow gate, audit/evidence behavior and no-client-release controls. | Tests proving gate behavior, audit/evidence, and denied/no-release paths. |
| E7 | Operational demo capability | User input or file payload is validated, persisted, reloaded, permissioned, audited, and covered by success and rejection tests. | Payload/API/service tests, DB reload proof, permission denial proof, audit/evidence proof where relevant, and visual proof if UI changed. |

Default rule: if a task cannot produce the proof for a higher level, it must report the lower level honestly.

## 4. Operationalization Task Structure

Every future task that touches a workflow, route, form, upload, export, evidence, approval, governance, communication or ops surface must use this structure.

```text
Task ID:
Workflow / Pageflow:
Routes / screens / states:
Actor / role / tenant context:
Current capability level:
Target capability level:
Operational claim:
Non-claim boundary:
Input payload or file payload:
Domain service / API boundary:
Persistence target:
Permission / gate:
Audit / evidence behavior:
Reload proof:
Visual proof requirement:
Tests required:
Human Visual Acceptance Gate:
Report update:
```

### Task Structure Rules

1. `Current capability level` must cite the source: capability audit, workflow matrix, input mask doc, code inspection or test.
2. `Target capability level` must not exceed the proof the task will actually produce.
3. `Operational claim` must name the exact behavior, not a vague phrase like "real workflow".
4. `Non-claim boundary` must state what remains static, fixture-backed, metadata-only, demo-only or blocked.
5. `Input payload or file payload` must be explicit for any task claiming E5 or higher.
6. `Domain service / API boundary` must identify the module or route that owns validation and mutation.
7. `Persistence target` must name the Prisma model, storage adapter, manifest or database-backed state.
8. `Permission / gate` must identify the role/action/workflow gate involved, especially for client visibility.
9. `Audit / evidence behavior` is required for sensitive actions and important workflow transitions.
10. `Reload proof` is mandatory for E7 and strongly recommended for E5/E6.
11. `Visual proof requirement` follows the Human Visual Acceptance Gate if product UI changes.
12. `Report update` must update both phase and QA reports.

## 5. Definition Of Done

### 5.1 P0 Definition Of Done

P0 is done when:

- Operationalization task structure exists as a project contract.
- Capability levels E0-E7 are defined in one authoritative place.
- Later tasks are required to state current and target capability level.
- Static UI, generic audit actions, fixture mutation and `actionId`-only demos are explicitly blocked from being reported as operational.
- QA/proof matrix exists.
- Human Visual Acceptance Gates are linked to operational completion claims.
- Master task and quality gates reference this contract.
- Phase and QA reports record P0.
- Required checks have been run or failures documented.

### 5.2 Future Task Definition Of Done

A future task is done only when all applicable items are true:

- Scope stayed within the selected task or phase.
- Source-of-truth docs and this contract were read.
- Current and target capability levels were declared before implementation.
- The implementation did not silently invent backend, domain, security, permission or product behavior.
- Operational claims are backed by matching proof from the matrix below.
- All sensitive actions have permission checks and audit events, or are honestly labelled below E7.
- Advice-like client visibility remains blocked until advisor approval, compliance release, evidence, permission and visibility gates pass.
- UI changes have route/state mapping, screenshot proof, and a Human Visual Review Rubric result.
- Reports list changed files, commands run, tests run, capability level reached, known gaps and next step.

## 6. QA / Proof Matrix

| Claim Type | Minimum target level | Required proof | Not sufficient |
|---|---:|---|---|
| Screen exists | E1 | Route smoke or browser proof, screenshot if visual work | Static JSX alone |
| Interactive state exists | E2 | State-specific route/query/modal/drawer proof | A button label with no state path |
| Audit/proof event exists | E3 | Test/API output showing audit/proof row or metadata | Toast text or local UI copy |
| Fixture journey mutates | E4 | Test/API proof that seeded record changes | `triggerDemoWorkflow(actionId)` call without assertion |
| Partial domain save works | E5 | Validated payload reaches domain service and persists target row for bounded case | Hardcoded seed mutation |
| Gated demo workflow works | E6 | Permission/gate/audit/evidence tests including denied or no-client-release path | Advisor approval alone |
| Operational form/data maintenance works | E7 | User payload validation, persistence, reload from DB, rejection test, permission denial, audit/evidence where relevant | Static fields, read-only pills, fixture-only action |
| Operational file upload works | E7 | File input or drag/drop, multipart API, stored bytes/object metadata, document/version rows, scan/extraction status, audit/evidence, reload/download proof, rejection test | Metadata-only file record |
| Operational export works | E7 | Scope/redaction validation, generated binary artifact, manifest with `realBinaryGenerated: true`, authorized download, audit trail, rejection/denial tests | Manifest-only export |
| Client visibility release works | E6/E7 | Advisor approval + compliance release + evidence + permission + visibility gate tests | Advisor approval or UI release button only |
| Human visual acceptance | Visual gate | Screenshot proof, rubric result, state coverage, no spec/debug chrome | DOM success or route smoke alone |

## 7. Human Visual Acceptance Gates

Any task that changes product UI, visual references, screen states, overlays, modals, drawers or route composition must pass these gates:

1. Read the Human Visual Implementation Standard before UI edits.
2. Create an implementation map before editing:
   `route -> component -> state -> role/tenant/context -> reference source -> expected assertion/proof`.
3. Isolate the actual application surface; do not implement visual board chrome, filenames, page IDs, route labels, annotation rails, prompt metadata, QA notes or visible state toggles as product UI.
4. Preserve the reference interaction shape: modal remains modal, drawer remains drawer, overlay remains overlay.
5. Treat background, surface, frame and visual boundary fidelity as first-class criteria.
6. Capture screenshot proof or record a screenshot blocker with retries and fallback DOM evidence.
7. Complete the Human Visual Review Rubric with one of:
   `accepted`, `accepted with minor issues`, `needs visual refactor`, `blocked`, `not reviewed`.
8. Do not claim visual acceptance from Playwright, DOM or type checks alone.

## 8. Operational Claim Denial Rules

The following patterns must be rejected as operational claims:

- A button invokes only `triggerDemoWorkflow(actionId)` and no validated payload.
- The server reads only `request.json()` for a feature that claims file upload.
- A form uses static display components, read-only fields or seed constants as the only data path.
- An export manifest says `realBinaryGenerated: false`.
- A workflow creates only metadata while implying binary upload/download.
- A compliance/advice action lacks the full no-unapproved-advice gate.
- A visual route passes smoke tests but lacks screenshot proof and Human Visual Review.
- A seeded demo mutation is presented as arbitrary user data maintenance.

Allowed wording for those cases:

- "visual-only"
- "static interaction"
- "fixture-backed"
- "metadata-only"
- "gated demo simulation"
- "not operational"
- "blocked pending payloaded service"

## 9. P0 Engine Method Artifacts

### Discover

Facts: The capability audit found no E7 capability. The workflow matrix shows multiple workflows between E1 and E6. Input mask docs define the payloads needed to move toward operational data maintenance. The Human Visual Standard states that DOM success is not design acceptance.

Assumptions: Demo-data-first remains the correct near-term architecture. The goal is truthful operational demo capability, not production financial/legal/tax advice or real auth.

### Define

The root problem is overclaim risk: polished UI and fixture-backed demo actions can look operational unless tasks require explicit capability-level proof.

### Develop

Candidate guardrails considered:

- Add only backlog rows: rejected because backlogs do not prevent overclaims.
- Add only tests: rejected because some claims are documentation/reporting claims before code exists.
- Add a project contract plus quality/reporting anchors: selected because it shapes future task intake, QA and completion language.

### Deliver

P0 delivers this project contract, master/quality gate anchors and report updates. It does not deliver product features.

## 10. V2 Method Artifacts

### Psycho-Logic + Map/Model

Rational logic: A feature is operational only when payload, persistence, reload, permission, audit/evidence and tests match the claim.

Psycho-logic: A polished WealthOS screen creates stakeholder trust quickly. If the screen acts like a real product while the implementation is fixture-backed, trust can be lost later. Honest labels preserve legitimacy without reducing demo value.

Map trap: Route coverage and visual polish are maps of the product surface, not proof of operational capability.

Design move: Force every task to carry both a visual state label and a capability level label.

### Reframing Matrix

| Lens | Bad frame | Better frame |
|---|---|---|
| Product | "Does the demo look real?" | "Which capability level is truthfully proven?" |
| Engineering | "Did the action run?" | "Was a validated payload persisted and reloaded?" |
| Compliance | "Was it approved?" | "Did all release gates pass before client visibility?" |
| Visual QA | "Does the DOM render?" | "Would a human accept this as product-native and state-complete?" |

Best frame: operationalization is a claim-control system.

Wrong frame to avoid: static UI plus proof metadata equals operational software.

### TRIZ

Contradiction: The project needs stable demo journeys and truthful operational proof. Stable journeys favor seeded `actionId` flows; operational proof favors arbitrary validated payloads.

Derived move: Preserve seeded journey actions for screencasts, but require payloaded services and reload tests before E7 claims.

### SIT Closed World

Use existing project resources:

- Capability audit and workflow reality matrix become capability labels.
- Input mask docs become payload requirements.
- Workflow gates and permission engine become proof requirements.
- Human Visual Standard becomes visual acceptance gate.
- Phase and QA reports become claim ledger.

### Morphological Analysis / Zwicky Box

| Dimension | Option A | Option B | P0 selection |
|---|---|---|---|
| Contract form | Narrative report | Task acceptance contract | Task acceptance contract |
| Capability taxonomy | New labels | Reuse E0-E7 | Reuse E0-E7 |
| Proof target | UI proof only | Payload + persistence + gate + visual proof | Combined proof by claim type |
| Enforcement point | Future code only | Task intake, QA report, phase report | Task intake plus reports |
| Visual acceptance | Route smoke | Human visual rubric | Human visual rubric |

CCA rejects: a route-only contract cannot govern upload/export claims; a code-only contract cannot govern documentation overclaims.

### SCAMPER

- Substitute generic "done" with capability-level done.
- Combine visual acceptance with operational proof.
- Adapt input-mask requirements into task payload requirements.
- Modify phase reports to include P0 claim boundaries.
- Put audit findings to use as acceptance gates.
- Eliminate unqualified "real workflow" language.
- Reverse proof order: evidence before operational promise.

### Harvard / BATNA

Interests:

- Product needs an impressive, credible demo.
- Engineering needs narrow, testable tasks.
- Compliance needs no unapproved client-visible advice.
- Stakeholders need to know what is real and what is simulated.

BATNA if this contract is ignored: keep calling the system a clickdummy/workflow simulator and avoid operational claims.

Objective criteria: E0-E7 levels, proof matrix, no-unapproved-advice gate, Human Visual Review Rubric.

### MESOs

| Option | Equal value | Shape |
|---|---|---|
| A | Highest audit clarity | Require every future task to state E-level and proof path. |
| B | Fastest delivery | Allow E4/E6 demo simulations but force explicit fixture-backed labels. |
| C | Strongest operational path | Promote only E7 tasks for top input masks such as upload, export and governance. |

P0 selects all three as compatible guardrails: demo speed is allowed, but claim language is controlled.

### Measurement Plan

- Count future tasks with current and target E-level declared.
- Count future reports that distinguish visual-only, fixture-backed, metadata-only and operational.
- Count workflows upgraded to E7.
- Count E7 claims with reload proof and denial/rejection tests.
- Count UI changes with screenshot proof and Human Visual Review result.

### Ethics & Fairness

This contract prevents deceptive overclaiming. It keeps demo exits honest, preserves client-safety boundaries and blocks misleading claims about upload, export, advice release, evidence and governance behavior.

## 11. V3 Proof Architecture

### Branch Decisions

| Branch | Decision | Reason |
|---|---|---|
| Feature build in P0 | Killed | User explicitly requested no product features. |
| Single audit note only | Killed | Does not stop later overclaims. |
| Project contract anchored in master gates | Kept | Most durable for future phases. |
| Require E7 for all work | Killed | Too rigid; demo simulation remains valid when labelled honestly. |

### Proof Paths

1. P0 proof: contract file exists and master/quality gates reference it.
2. Future E7 proof: payload validation, persistence, reload, permission, audit/evidence and tests.
3. Future visual proof: implementation map, screenshot proof and Human Visual Review Rubric.
4. Future no-client-release proof: advisor, compliance, evidence, permission and visibility gates tested together.

### Learning Log

- AlphaVest is already strong in workflow semantics and visual proof discipline.
- The weak point is not only missing features; it is claim discipline around fixture-backed work.
- E0-E7 should become a required reporting vocabulary, not just an audit vocabulary.
- Human visual acceptance must stay separate from operational acceptance.

## 12. P0 Method Compliance Checklist

- Mixed Engine route selected because `Max` was used.
- V3 evidence/proof wrapper applied.
- V2 task-freeze, source reading, existing-state audit, delta plan, implementation and report update applied.
- Psycho-Logic, Map/Model, Reframing, TRIZ, SIT, Morphological Analysis, SCAMPER, Harvard/BATNA, MESOs, Measurement Plan and Ethics artifacts are included.
- Weak branches were killed explicitly.
- No product feature was implemented.
- Static UI and `actionId`-only demos are explicitly blocked from operational claims.
