# PP-004 Extracted Ticket Register

Generated: 2026-06-26

Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Execution mode: one ticket at a time, in source order. The implementation tickets remain blocked until `DECISION-1.3` approves the release policy and implementation boundary.

## Critical Path

1. `DECISION-1.0` PP-001 / PP-002 / PP-003 Dependency Acceptance for PP-004.
2. `ANALYSIS-1.1` PP-004 Advisor/Compliance/Release Readiness & Dependency Preflight.
3. `SPEC-1.2` PP-004 Advisor Approval, Compliance Release and Client Visibility Contract.
4. `DECISION-1.3` PP-004 Release Policy and Execution Boundary Approval.
5. `IMPL-1.4` Advisor Approval Is Not Release Guard & Tests.
6. `IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence Guard & Tests.
7. `IMPL-1.6` Released Decision Record and Client Visibility Projection Guard & Tests.
8. `IMPL-1.7` Audit Persistence for Approval, Block, Evidence Request and Release.
9. `IMPL-1.8` UX Safety Wording and Action Hierarchy Overlay.
10. `IMPL-1.9` Demo Workflow / API Directness Boundary for Release Actions.
11. `QA-1.10` PP-004 Integrated P0 Release Boundary Validation.
12. `DECISION-1.11` PP-005 Readiness Gate after PP-004.

## Epic

### `EPIC-PP004` PP-004 Advisor/Compliance/Release Boundary Proof Pack

Type: Epic

Purpose: Make AlphaVest's advisor, compliance and release gate provable as a P0 proof pack.

Goal: Advisor Approval, Compliance Block, Request Evidence, Compliance Release, Decision Record and Client Visibility are technically and semantically distinct. A released client-safe state may emerge only when PP-001 actor/scope/payload, PP-002 evidence sufficiency, PP-003 advice boundary, compliance preconditions and audit proof pass.

Scope: Advisor Approval Queue and Detail; Compliance Queue, Review, Release, Block and Request Evidence; Decision Record and Decision Submitted state; Client Portal / Mobile released-client-safe projection; release precondition checks; gate-specific audit persistence; positive and negative P0 tests; UX safety wording and action hierarchy.

Out of scope: autonomous advice or auto-release logic; PP-005 export package implementation; KYC/Suitability/Committee/Hold route MVP elevation; full redesign sprint; blind schema replacement; implementation from `main`.

Completion criteria: dependencies accepted or explicitly blocking; transitions specified; release preconditions defined; implementation tasks completed or blocked with evidence; positive and negative P0 release-boundary tests pass or produce findings; QA validates against the specification.

## Tasks And Subtasks

### `DECISION-1.0` PP-001 / PP-002 / PP-003 Dependency Acceptance for PP-004

Work type: Decision / Approval

Readiness: Needs human confirmation in the upload; completed in this execution from repo-local accepted predecessor records.

Goal: Classify PP-001, PP-002 and PP-003 as accepted, accepted with limitations, or blocking before PP-004 analysis/specification proceeds.

Scope: Review PP-001 actor/tenant/role/object/payload baseline; PP-002 evidence sufficiency baseline; PP-003 forbidden internal payload and AI Draft internal-only baseline; document accept / accept with limitations / block.

Expected output: Dependency acceptance note with blocker or limitation list.

Definition of done: Each dependency is classified; limitations are documented; PP-004 analysis/spec can either proceed or is blocked.

### `ANALYSIS-1.1` PP-004 Advisor/Compliance/Release Readiness & Dependency Preflight

Work type: Analysis / Research / Spike

Goal: Identify the current files, routes, APIs, services, Prisma models, tests and UI states that PP-004 actually touches.

Questions: Which routes/components implement advisor approval, compliance review, release, block and request evidence? Which API/action paths are productive, demo-bus-based or mixed? Which services check release preconditions? Which status fields control advisor-approved, compliance-pending, blocked, released and client-visible states? Which audit events are written? Which tests cover positive and negative cases? Which projections fail closed? Which labels could confuse advisor approval with release or client visibility?

Scope: Routes 036-041, 042-045, 019-020 and downstream 054-058 references; internal workflow and decisions governance components; `/api/demo-workflow`; typed/service-backed release actions; Recommendation, Approval, ComplianceReview, Decision, EvidenceRecord, AuditEvent; workflow gate, permission engine, demo workflow and client visibility tests.

Expected output: Findings report; affected files/routes/APIs/services/models/tests list; release-state taxonomy candidate; gap list; implementation split with CTES; open risks and decisions.

Definition of done: Relevant files/flows/artifacts identified; main findings documented; specification need clear; task split proposed; open questions and risks named; implementation readiness classified.

### `SPEC-1.2` PP-004 Advisor Approval, Compliance Release and Client Visibility Contract

Work type: Specification / Design / Acceptance Criteria

Goal: Describe the target state precisely enough that Codex can later implement and test without inventing release semantics.

Scope: Advisor approval transition; compliance review states; release/block/request evidence actions; release preconditions; decision record rules; client visibility projection; audit event requirements; UI wording/action hierarchy; test/review design.

Target state: Advisor approval moves only to compliance-pending/internal state. Compliance release requires actor/scope/evidence/advice-boundary/audit/redaction preconditions. Block/request evidence keeps client visibility hidden and produces auditable internal state. Client projections show only released, redacted, client-safe decision content. Missing preconditions fail closed with no silent state advancement.

Acceptance criteria: Advisor approval does not set client visibility or release timestamp; release without advisor approval is denied; release without evidence sufficiency is denied; release with forbidden internal payload is denied or redacted; compliance block/request evidence produces internal state and audit event; client portal/mobile receives only released client-safe payload; admin bypass is denied and audited; success wording does not overclaim downstream gates.

Definition of done: Target state, scope, acceptance criteria, test/review logic, dependencies, CTES-derived implementation split and open human decisions are explicit.

### `DECISION-1.3` PP-004 Release Policy and Execution Boundary Approval

Work type: Decision / Approval

Readiness: Blocked until `SPEC-1.2` is complete.

Goal: Approve the release precondition list, allowed transitions and implementation boundary before safety-critical implementation begins.

Expected output: Approved / approved with limitations / rejected decision with explicit blockers.

Definition of done: Policy decision is recorded and implementation boundary is accepted or blocked.

### `IMPL-1.4` Advisor Approval Is Not Release Guard & Tests

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 13/20, Split

Goal: Ensure advisor approval is a human review gate, not compliance release, client visibility, released timestamp or client-safe projection.

Scope: Advisor approval state transition; negative client visibility test; role/action permission that advisor cannot compliance-release; audit for advisor approval where specified.

Expected output: Advisor approval guard, positive and negative tests, audit expectation if required by spec.

Definition of done: Advisor approval does not create client visibility; advisor cannot compliance-release; tests prove positive transition and negative no-release boundary; audit behaviour is proven or documented as blocker.

#### `SUBTASK-1.4.1` Advisor Approval State Transition Guard

CTES: 8/20, Ideal Codex Task

Task: Implement or harden the state transition that moves advisor approval only to compliance-pending/internal status.

Definition of done: Advisor approval does not set release/client-visible fields.

#### `SUBTASK-1.4.2` Advisor Approval Negative Client Visibility Tests

CTES: 7/20, Ideal Codex Task

Task: Add negative tests proving advisor approval does not expose client-visible content.

Definition of done: Tests cover advisor approval no-release and no-client-visibility behaviour.

### `IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence Guard & Tests

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 14/20, Split

Goal: Compliance release can occur only when all required preconditions pass; block and request-evidence states remain internal and audited.

Scope: Precondition evaluator for advisor approval, evidence sufficiency, advice-boundary/internal payload safety, role/action permission and audit availability; release allowed/denied paths; block/reject/request-evidence state paths; positive and negative P0 tests.

Expected output: Release precondition guard; block/request-evidence guard; positive and negative tests.

Definition of done: Release succeeds only when all preconditions pass; release fails closed when any precondition is missing; block/request-evidence are internal and audited; tests prove positive and negative cases.

#### `SUBTASK-1.5.1` Release Precondition Evaluator

CTES: 12/20, Plan-first

Task: Implement/harden the compliance release precondition evaluator.

Definition of done: All specified preconditions are enforced.

#### `SUBTASK-1.5.2` Block And Request-Evidence State Guard

CTES: 9/20, Ideal Codex Task

Task: Harden block/request-evidence states so they never create client visibility.

Definition of done: Block/request-evidence produce internal, auditable, non-release states.

#### `SUBTASK-1.5.3` Missing-Precondition Negative Tests

CTES: 8/20, Ideal Codex Task

Task: Add negative tests for release attempts with missing preconditions.

Definition of done: Missing advisor approval, missing evidence, forbidden payload, wrong role and audit-unavailable cases are covered where supported.

### `IMPL-1.6` Released Decision Record and Client Visibility Projection Guard & Tests

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 14/20, Split

Goal: Ensure compliance release is the only allowed bridge from internal workflow to client-safe visibility.

Scope: Decision record release state; Client Portal/Mobile projection; fail-closed hidden/redacted state before release; no internal notes, AI draft, compliance notes or unreleased evidence in client payload.

Expected output: Client-safe projection guard; positive and negative client visibility tests.

Definition of done: Client sees released safe summary only after compliance release; client sees hidden/redacted/empty state otherwise; internal payloads are absent.

#### `SUBTASK-1.6.1` Released Decision Projection Contract

CTES: 12/20, Plan-first

Task: Implement/harden released decision projection according to PP-004 contract.

Definition of done: Projection includes only approved client-safe fields.

#### `SUBTASK-1.6.2` Client Portal/Mobile Fail-Closed Tests

CTES: 9/20, Ideal Codex Task

Task: Add tests proving client surfaces fail closed before valid compliance release.

Definition of done: Tests cover advisor-approved-only, compliance-pending, blocked, evidence-needed and released states.

### `IMPL-1.7` Audit Persistence for Approval, Block, Evidence Request and Release

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 12/20, Plan-first

Goal: Every critical PP-004 gate action has traceable actor, role, tenant, target, action, previous state, next state, result and reason/context where required.

Scope: Advisor approval audit; compliance release audit; compliance block audit; request evidence audit; denied release attempt audit where specified.

Definition of done: Critical actions write required audit events; denied attempts are audited where specified; tests prove events or document blockers.

### `IMPL-1.8` UX Safety Wording and Action Hierarchy Overlay

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 8/20, Ideal Codex Task

Goal: Prevent UI copy/action hierarchy from conflating Advisor Approval, Compliance Release, Block, Request Evidence and Client Visibility.

Scope: Button labels; success/error/warning messages; state chips; disabled/gated reasons; next safe actions; distinction between approve for compliance, release to client, block and request evidence.

Definition of done: Advisor labels do not imply release; compliance labels do not imply client acceptance; block/request evidence explains next safe action; disabled actions show reason where required.

### `IMPL-1.9` Demo Workflow / API Directness Boundary for Release Actions

Work type: Implementation / Execution

Readiness: Planned / Blocked

CTES: 13/20, Split or analysis/spec-dependent implementation

Goal: Ensure `/api/demo-workflow` or demo action success cannot be mistaken for production-grade release proof unless explicitly hardened and tested.

Scope: Identify release action IDs; mark demo-only vs domain-backed actions; add tests or guard language where demo success is limited; harden approved action path if specified.

Definition of done: PP-004 tests do not rely on demo-only success as product proof; release-related demo actions are classified; any proof path has state/payload assertions.

### `QA-1.10` PP-004 Integrated P0 Release Boundary Validation

Work type: QA / Validation / Review

Readiness: Blocked until implementation tasks complete or are explicitly out of scope.

Goal: Validate Advisor Approval, Compliance Release, Block, Request Evidence, Decision Projection and Client Visibility against the PP-004 specification and P0 safety goals.

Validation scope: Advisor positive path; advisor-not-release negative path; compliance release happy path; missing-precondition release denial; block/request evidence non-release; client portal/mobile fail-closed; audit persistence; UX wording no-overclaim; demo/API directness claim control.

Definition of done: Relevant checks are run, results documented, deviations classified, regression risk documented and PP-005 readiness can be decided.

### `DECISION-1.11` PP-005 Readiness Gate after PP-004

Work type: Decision / Approval

Readiness: Blocked

Goal: Decide whether PP-005 Export / Redaction / Forbidden Payload may use PP-004 outputs.

Expected output: PP-005 readiness decision; list of PP-004 outputs PP-005 may use; carry-forward blockers.

Definition of done: Go/no-go is documented; blockers explicit; PP-005 can be prepared without inventing release semantics.
