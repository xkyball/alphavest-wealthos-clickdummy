# PP-005 Export/Redaction Extracted Ticket Register

Generated: 2026-06-26

Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP005_EXPORT_REDACTION_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: `EXTRACTED_IN_SPECIFIED_ORDER`

## Source Status

The upload marks the architecture as:

`TICKET_STRUCTURE_READY__PP005_BLUEPRINT_READY__EXECUTION_BLOCKED_BY_PP001_PP002_PP003_PP004_AND_SPECIFICATION`

The operative sequence is not direct implementation. The uploaded order is:

1. DECISION-1.0 dependency acceptance.
2. ANALYSIS-1.1 export/redaction readiness and dependency preflight.
3. SPEC-1.2 export scope, redaction, approval and delivery contract.
4. DECISION-1.3 export policy and execution boundary approval.
5. IMPL-1.4 export scope selection guard and tests.
6. IMPL-1.5 redaction and forbidden payload enforcement and tests.
7. IMPL-1.6 preview, approval, generation, download/share lifecycle separation and tests.
8. IMPL-1.7 export audit persistence and fail-closed behaviour.
9. IMPL-1.8 client-safe export UX, feedback and wording overlay.
10. IMPL-1.9 demo workflow/API directness boundary for export actions.
11. QA-1.10 integrated P0 export/redaction validation.
12. DECISION-1.11 MVP proof chain closure / next tasking readiness.

## Epic

### EPIC: PP-005 Export/Redaction Boundary Proof Pack

Type: Epic

Purpose: bundle the work required to analyze, specify, implement and validate export/redaction as AlphaVest's final P0 safety boundary.

Goal: export may contain only released, redacted, client-safe, scoped and approved content. Preview, approval, generation, download/share and client acceptance must remain separate. Forbidden internal payloads must not reach preview, package or download/share.

Scope:

- Export scope selection.
- Redaction profile and forbidden payload exclusion.
- Preview, approval, generation and download/share lifecycle separation.
- Export audit persistence.
- Fail-closed behaviour for scope, redaction, approval, audit and visibility errors.
- Export UI/feedback wording as UX safety overlay.
- Existing export routes, services, API/action boundaries.
- Positive and negative P0 acceptance tests.

Out of scope:

- New production banking/custody integrations.
- New document management integration.
- New image/screen/state-screen generation.
- P1/future export types not explicitly approved for MVP.
- Committee/KYC/Suitability/IPS hold route elevation.
- Blind new API creation when existing services/APIs can be hardened.
- Replacing PP-001 to PP-004 decisions.

## Work Items

### 1. DECISION-1.0: PP-001 / PP-002 / PP-003 / PP-004 Dependency Acceptance for PP-005

Work type: Decision / Approval

Task: formally accept which PP-001 to PP-004 outputs may be used as binding PP-005 inputs.

Goal: prevent PP-005 from inventing actor/tenant/object/payload, evidence sufficiency, AI/internal-only payload or released client-safe state semantics.

Expected output: `PP005_DEPENDENCY_ACCEPTANCE_REGISTER` with accepted inputs, missing inputs and blocked assumptions.

Definition of done:

- Accepted dependency outputs are listed.
- Missing upstream outputs are explicitly marked.
- PP-005 start condition is clear.
- Unresolved dependency assumptions are not passed into implementation.

### 2. ANALYSIS-1.1: PP-005 Export/Redaction Readiness & Dependency Preflight

Work type: Analysis / Research / Spike

Task: inspect current export routes, services, APIs/actions, models, tests, fixtures, redaction profiles and payload filters against PP-001 to PP-004.

Questions to answer:

- Which export routes 054-058 are UI-only, service-backed, demo-action-backed or runtime-tested?
- Which export-service and file-metadata modules exist?
- Does export use typed/direct APIs, `/api/demo-workflow`, or both?
- Which models/fields govern lifecycle, scope, redaction, approval, package and audit?
- Which tests cover manifest, forbidden payload, redaction, approval blocking and file generation?
- Which PP-003 forbidden payloads must be excluded?
- Which PP-004 released client-safe state may be exported?
- Which gaps are runtime, API, redaction, audit, UX wording or demo-bus ambiguity?

Definition of done:

- Export files, flows, routes, services and tests are identified.
- Export lifecycle and current gaps are documented.
- Redaction/forbidden payload risk map exists.
- Specification need is clear.
- Implementation task split is proposed.
- Open risks and decisions are named.

### 3. SPEC-1.2: PP-005 Export Scope, Redaction, Approval and Delivery Contract

Work type: Specification / Design / Acceptance Criteria

Task: define the target export/redaction contract precisely enough that Codex can harden implementation without making product or safety policy.

Scope:

- Export lifecycle states.
- Scope selection and object/payload allowlist.
- Redaction profile and forbidden payload rules.
- Preview, approval, generation and download/share separation.
- Actor/role/action/object/payload preconditions.
- Evidence/release/client-safe content constraints.
- Audit requirements.
- Failure/blocked states.
- UX wording and feedback.
- Positive and negative acceptance cases.

Definition of done:

- Target state is unambiguous.
- Scope and out-of-scope are clear.
- Positive and negative acceptance criteria are testable.
- Test/review logic is defined.
- Implementation tasks with CTES and dependencies are derivable.
- Human approval over export policy is prepared.

### 4. DECISION-1.3: PP-005 Export Policy and Execution Boundary Approval

Work type: Decision / Approval

Task: approve or block the PP-005 export scope, redaction, approval and delivery specification as the implementation boundary.

Expected output: `PP005_EXPORT_POLICY_APPROVAL` or `PP005_EXPORT_POLICY_BLOCKED_WITH_DECISIONS_NEEDED`.

Definition of done:

- Approved/blocked status is documented.
- Unresolved policy decisions are listed.
- Implementation scope is authorized or remains blocked.

### 5. IMPL-1.4: Export Scope Selection Guard & Tests

Work type: Implementation / Execution

Readiness: blocked until SPEC-1.2 and DECISION-1.3 are complete.

Task: implement or harden export scope selection so only actor-authorized, tenant-scoped, object-scoped and client-safe content can enter export preview/package candidates.

CTES: 13/20, class `Split`.

Subtasks:

- 1.4.1 Scope request contract and object allowlist enforcement. CTES 10, plan-first.
- 1.4.2 Wrong-tenant / wrong-object export denial tests. CTES 8, ideal Codex task after dependency completion.

Definition of done:

- Scope checks align with PP-001 and PP-004 contracts.
- Wrong tenant/object/role/payload attempts are denied.
- No payload returns for denied attempts.
- Audit behaviour is implemented or routed to IMPL-1.7.

### 6. IMPL-1.5: Redaction and Forbidden Payload Enforcement & Tests

Work type: Implementation / Execution

Readiness: blocked until SPEC-1.2, DECISION-1.3 and PP-003 forbidden payload dictionary are complete.

Task: enforce redaction so forbidden internal payloads are excluded or redacted from export preview and package generation.

CTES: 13/20, class `Split`.

Subtasks:

- 1.5.1 Forbidden internal payload dictionary enforcement. CTES 12, plan-first.
- 1.5.2 Redaction leakage negative tests. CTES 9, ideal Codex task after dependency completion.

Definition of done:

- Forbidden internal payloads are excluded/redacted in preview and package data.
- Tests assert payload content, not only UI labels.
- Redaction failure blocks export.
- Success messages do not imply unverified redaction.

### 7. IMPL-1.6: Preview / Approval / Generation / Download-Share Lifecycle Separation & Tests

Work type: Implementation / Execution

Readiness: blocked until SPEC-1.2 and DECISION-1.3 are complete.

Task: harden lifecycle separation so preview, approval, generation and download/share remain distinct export states/actions.

CTES: 12/20, class `Plan-first`.

Definition of done:

- Preview, approval, generation and download/share are separate states/actions.
- Skipped-transition attempts fail closed.
- Success feedback names only the completed action.

### 8. IMPL-1.7: Export Audit Persistence and Fail-Closed Behaviour

Work type: Implementation / Execution

Readiness: blocked until SPEC-1.2 and DECISION-1.3 are complete.

Task: ensure export actions persist required audit events and fail closed when required audit persistence is unavailable.

CTES: 13/20, class `Split or plan-first`.

Definition of done:

- Required export actions write audit events.
- Denied export attempts are auditable where specified.
- Required audit failure does not silently complete export action.
- Tests or explicit limitation document audit failure behaviour.

### 9. IMPL-1.8: Client-safe Export UX / Feedback / Wording Overlay

Work type: Implementation / Execution

Readiness: blocked until SPEC-1.2 and DECISION-1.3 are complete.

Task: align export labels, statuses and feedback so UI does not overclaim preview, approval, generation, download/share or client acceptance.

CTES: 8/20, class `Ideal Codex Task`.

Definition of done:

- Preview is not labelled approval.
- Approval is not labelled delivery.
- Download/share success does not imply client acceptance.
- Blocked actions explain missing preconditions.
- Redaction status does not overclaim if proof is incomplete.

### 10. IMPL-1.9: Demo Workflow / API Directness Boundary for Export Actions

Work type: Implementation / Execution

Readiness: blocked until ANALYSIS-1.1, SPEC-1.2 and DECISION-1.3 are complete.

Task: classify and harden whether PP-005 export behaviour is direct API/service backed, demo-action-backed, or mixed; prevent demo workflow success from overclaiming production export safety.

CTES: 13/20, class `Split or plan-first`.

Definition of done:

- Export action directness is classified.
- Demo-backed export claims are bounded.
- Any new direct API need is routed to a separate decision/specification, not silently implemented.

### 11. QA-1.10: PP-005 Integrated P0 Export/Redaction Validation

Work type: QA / Validation / Review

Readiness: blocked until implementation tasks and SPEC-1.2 are complete or intentionally accepted as zero-delta.

Validation scope:

- Export scope allow/deny.
- Forbidden payload redaction/exclusion.
- Preview/approval/generation/download/share separation.
- Audit persistence and fail-closed behaviour.
- No-overclaim UX wording.
- Demo/API directness claim limits.
- Regression against PP-001 to PP-004 safety boundaries.

Definition of done:

- Relevant checks are executed.
- Deviations are documented.
- Regressions are excluded or captured as findings.
- Result is reviewed against SPEC-1.2 and PP-001 to PP-004.
- Pass/fail/limitations decision is documented.

### 12. DECISION-1.11: MVP Proof Chain Closure / Next Tasking Readiness

Work type: Decision / Approval

Readiness: blocked until QA-1.10 is complete.

Task: decide whether PP-001 to PP-005 are sufficient for the next Codex tasking, implementation handoff or hardening sprint.

Expected output: `PP005_CHAIN_CLOSURE_DECISION` with `READY_FOR_TASKING`, `READY_WITH_LIMITATIONS` or `NOT_READY_MORE_PROOF_REQUIRED`.

Definition of done:

- Final decision is recorded.
- Blockers and residual risks are documented.
- Next action is explicitly named.
- No unresolved critical safety issue is hidden.
