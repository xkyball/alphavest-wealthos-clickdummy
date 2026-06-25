# AlphaVest WP08 API Hardening / Fail-Closed Contracts Execution

Generated: 2026-06-25

Status: STOPPED_AT_DECISION_WP08_1

This report executes the uploaded WP08 blueprint as a strict process chain:

Blueprint task -> executed analysis result -> refined specification -> derived implementation task -> implementation or zero-delta implementation -> QA/proof -> report.

No product-code change was made in this WP08 run. Implementation tasks are intentionally blocked until the human approves the API enforcement depth and first-wave boundary required by `DECISION-WP08-1`.

## Source Scope Used

- Uploaded blueprint: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP08_API_HARDENING_FAIL_CLOSED_CONTRACTS_BOC_TICKET_STRUCTURE.md`
- Current repository source code, tests, route tree, config and git state.
- Current and earlier generated process artefacts:
  - `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP07_EXPORT_REDACTION_CLIENT_SAFE_PACKAGE_EXECUTION.md`
- Explicit human decisions from this refactor chain:
  - WP05 Option A: canonical Journey command path, `/api/demo-workflow` compatibility only, fail-closed audit before mutation, no new API, no schema migration.
  - WP06 Option A: route/action/object plus payload/API/service-level enforcement, admin non-bypass fail-closed, denied sensitive attempts audited before mutation, no new API, no schema migration, demo workflow compatibility only.
  - WP07 Option A: MVP export routes `054-058` only, existing `/api/export-workflow` only, no new API, no schema migration, metadata-only redacted package manifest proof, forbidden payload negative tests mandatory, `/api/demo-workflow` export actions compatibility/demo only.

Excluded as specification authority: unrelated legacy planning docs, broad handoff docs, source refs, old KB/source artefacts and prior assumptions unless revalidated against current repo evidence.

## Moving Baseline Preflight

- Branch: `full-workflow`
- Remote state at start: `full-workflow...origin/full-workflow [ahead 46]`
- Latest commit at start: `ecd0ae2 docs: close wp07 option a zero delta`
- Working tree at start: clean
- Operative repo authority inspected before analysis: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Package scripts inspected: `guard:source`, `typecheck`, `db:validate`, focused Playwright API/service suites and `phase:check` are available.

## Extracted Blueprint Tasks

### Epic: WP-08 API Hardening / Fail-Closed Contracts

Detailed description: harden existing AlphaVest API surfaces against unsafe request handling, weak validation, RBAC bypass, object/tenant scope leakage, unsafe payloads, missing audit persistence, optimistic state changes and non-standard error responses. APIs must fail closed with no mutation, no advice execution and no client release.

Primary API surfaces:

- `/api/demo-workflow`
- `/api/documents`
- `/api/documents/upload`
- `/api/review-monitoring`

Out of scope unless explicitly approved later:

- New API route creation.
- Schema migration.
- New screen generation.
- State-screen image generation.
- Blind safety weakening.
- Client-visible internal payload expansion.
- Treating demo workflow compatibility as the new canonical MVP command API.

### ANALYSIS-WP08-1: Existing API Surface and Safety Gap Audit

Detailed description: inspect existing API routes, services, validation, RBAC, object/tenant scope, audit hooks, payload projection and tests. Classify each API as real, partial, demo-only, compatibility-only, static or unproven.

Dependencies: WP03, WP04, WP05, WP06, WP07 and source hierarchy lock. Enables `SPEC-WP08-1` and `DECISION-WP08-1`.

DoD:

- API route files and service seams identified.
- Validation, RBAC, scope, payload, audit and error behavior mapped.
- Positive and negative tests inventoried.
- Gaps and zero-delta candidates separated.
- Decision questions named before implementation.

### SPEC-WP08-1: API Hardening Contract and Acceptance Specification

Detailed description: define the fail-closed API contract for request validation, role/action/object checks, payload redaction, audit persistence, error envelope, no-mutation semantics and P0 positive/negative proof.

Dependencies: `ANALYSIS-WP08-1`. Enables `DECISION-WP08-1`, implementation derivation and QA.

DoD:

- First-wave API boundary is unambiguous.
- Shared helper strategy is explicit.
- Demo workflow compatibility versus canonical command API is explicit.
- Review monitoring internal-only behavior is explicit.
- Acceptance criteria cover positive and negative cases.

### DECISION-WP08-1: Approve Enforcement Depth and No-New-API Boundary

Detailed description: obtain human approval for first-wave API hardening depth, no-new-API default, shared helper strategy, review-monitoring MVP depth and `/api/demo-workflow` status.

Required decision notes from the blueprint:

- `LOCAL_ROUTE_HARDENING_ONLY`
- `SHARED_HELPERS_ALLOWED_WITH_LIMITS`
- `NEW_API_FORBIDDEN_EXCEPT_EXPLICIT_FOLLOWUP`
- `REVIEW_MONITORING_INTERNAL_ONLY_MVP_SLICE`

DoD:

- Human confirms or corrects the enforcement boundary.
- Implementation tasks are no longer decision-blocked.

### IMPL-WP08-1: Documents/Upload API Hardening

Detailed description: harden document listing and upload routes so invalid role, invalid tenant, malformed metadata, unsupported file types, unauthorized upload roles, wrong-scope access and audit-unavailable cases fail closed without sufficiency, release or export side effects.

Subtasks:

- Validate request and multipart metadata.
- Enforce role/tenant/object scope.
- Preserve upload-only semantics.
- Block sufficiency, release and export implication.
- Audit denied sensitive attempts where required.

Dependencies: `SPEC-WP08-1` and `DECISION-WP08-1`.

### IMPL-WP08-2: Demo Workflow Action Hardening

Detailed description: harden `/api/demo-workflow` as a compatibility/demo transport without treating it as the canonical MVP action API. Typed recommendation-review actions must validate role, target, evidence, confirmation, audit and release gates. Generic screencast actions must not overclaim production API safety.

Subtasks:

- Preserve malformed request fail-closed behavior.
- Keep recommendation-review actions role/gate/audit checked.
- Keep generic `jXX.*` action behavior classified as demo compatibility.
- Do not widen canonical command authority through demo workflow.

Dependencies: `SPEC-WP08-1` and `DECISION-WP08-1`.

### IMPL-WP08-3: Review Monitoring API Internal-Only Hardening

Detailed description: harden `/api/review-monitoring` as an internal monitoring/read-model API. It may produce internal review/rebalance snapshots but must not execute advice, advance state silently or release content to the client.

Subtasks:

- Validate query params.
- Fail closed on missing DB/config and invalid date input.
- Return monitoring guard semantics.
- Keep monitoring rows internal-only.

Dependencies: `SPEC-WP08-1` and `DECISION-WP08-1`.

### IMPL-WP08-4: Shared API Fail-Closed/Redaction/Audit Helper Alignment

Detailed description: align route-level errors and service-level failures on shared fail-closed helpers where this reduces duplication and strengthens safety without creating a new API or schema.

Subtasks:

- Standardize fail-closed error envelope.
- Prevent helper extras from overriding critical safety fields.
- Reuse existing control-layer helpers for monitoring, visibility, audit and export safety.

Dependencies: `SPEC-WP08-1` and `DECISION-WP08-1`.

### QA-WP08-1: P0 API Positive/Negative Validation

Detailed description: run focused API/service validation proving accepted actions still work and invalid requests, wrong roles, wrong tenants, forbidden payloads, audit failures and internal-only monitoring fail closed.

Dependencies: implementation tasks. Blocked until decision and implementation/zero-delta execution.

## ANALYSIS-WP08-1 Executed Result

Status: COMPLETE

### `/api/documents/upload`

Current implementation is strong and likely zero-delta for first wave:

- `app/api/documents/upload/route.ts` validates multipart form, metadata JSON, `roleKey`, `tenantSlug`, file and document type before calling the service.
- Invalid request, invalid multipart, invalid role/tenant, validation errors, permission errors and audit-unavailable errors use `failClosedJson`.
- Success response explicitly returns `safety.clientVisible: false`, `safety.sufficiency: false`, `safety.releaseUnlocked: false`, `safety.uploadOnly: true` and `evidenceStatus: "REVIEW_PENDING"`.
- `lib/document-upload-service.ts` enforces upload role allowlist, actor context, tenant/object scope and permission checks. Denied upload attempts write `document.upload.denied` audit where required. Audit-unavailable simulation blocks before successful document/evidence mutation.

Test evidence:

- `tests/document-upload-api.spec.ts` covers upload-only success, no export request, source/released projection redaction, tenant isolation, invalid tenant/role, unsupported file type, missing document type, unauthorized role denial and audit-unavailable fail-closed behavior.
- `tests/document-upload-lifecycle-hardening.spec.ts` and lifecycle tests cover upload not sufficiency and client/export boundaries.

### `/api/documents`

Current implementation is strong and likely zero-delta for first wave:

- `app/api/documents/route.ts` validates tenant and role; invalid queries return `documents: []`, `hiddenRowsDisclosed: false`, `releaseUnlocked: false`, `scoped: false`, `mutated: false`, `noAdviceExecution: true` and `noClientRelease: true`.
- Success path calls `listUploadedDocuments`, scoped by tenant, and returns safety metadata with `hiddenRowsDisclosed: false`, `releaseUnlocked: false`, role/tenant and returned row count.
- `lib/document-upload-service.ts` projects documents through `visibilityEngine.projectDocumentPayload`, not raw database rows.

Test evidence:

- `tests/document-upload-api.spec.ts` proves tenant isolation, source-upload metadata limits and blocked/released document projections without storage key/checksum leakage.
- `tests/p0-api-contract.spec.ts` proves invalid document scope fails closed with empty documents and no hidden row disclosure.

### `/api/review-monitoring`

Current implementation is strong and likely zero-delta if WP08 approves internal-only MVP scope:

- `app/api/review-monitoring/route.ts` fails closed on missing database configuration and invalid `asOf`.
- Success response marks `clientVisible: false`, `mutated: false`, `noAdviceExecution: true`, `noClientRelease: true` and returns `monitoringGuard`.
- `lib/control-layer/monitoring-guard.ts` explicitly returns `clientVisible: false`, `internalTriggerOnly: true`, `noAutomaticAdvice: true`, `noAdviceExecution: true` and `noClientRelease: true`.
- `lib/review-monitoring-service.ts` builds review/rebalance snapshots from existing demo read models. The API route wraps the snapshot with internal-only guard semantics.

Test evidence:

- `tests/review-monitoring-service.spec.ts` proves internal snapshot behavior, invalid `asOf` fail-closed behavior and J16/J17 monitoring actions with no client release.
- `tests/p0-api-contract.spec.ts` proves invalid monitoring query returns no advice and no release.

### `/api/demo-workflow`

Current implementation is mixed by design:

- `app/api/demo-workflow/route.ts` uses `failClosedJson` for missing DB, invalid JSON/body, validation issues, audit persistence failure and typed workflow errors.
- `lib/demo-workflow-validation.ts` validates typed `recommendation-review` requests with action, actor role, target UUID, evidence IDs, confirmation and audit simulation fields.
- `lib/demo-workflow-mutation.ts` enforces role, tenant/object scope, permission, evidence, payload, compliance release and audit gates for typed recommendation-review actions.
- The same endpoint also accepts any `jNN.actionToken` shape through `demoWorkflowActionPattern`. Unknown generic screencast actions fall through to a deterministic audit-only compatibility path in `app/api/demo-workflow/route.ts`.

That fallback is acceptable only if WP08 explicitly keeps `/api/demo-workflow` as demo compatibility transport. It must not be overclaimed as a controlled MVP action API. This aligns with the accepted WP05, WP06 and WP07 decisions.

Test evidence:

- `tests/demo-workflow-validation.spec.ts` proves the explicit compatibility marker `DEMO_WORKFLOW_COMPATIBILITY_ONLY` and typed advisor/compliance state transitions.
- `tests/demo-workflow-api.spec.ts` proves malformed action payloads and malformed JSON fail closed; typed advisor approval does not release; compliance release requires advisor approval, evidence, payload readiness, confirmation and audit persistence.
- `tests/p0-api-contract.spec.ts` proves invalid demo workflow requests fail closed with no mutation and no client release.

### Shared Error, Audit and Safety Helpers

Current implementation is strong and likely zero-delta for first wave:

- `lib/control-layer/error-envelope.ts` centralizes fail-closed responses with `ok: false`, `mutated: false`, `noAdviceExecution: true`, `noClientRelease: true`, `safety.failClosed: true` and `safety.silentStateAdvance: false`.
- `failClosedJson` prevents caller extras from overriding critical safety fields.
- Existing helpers in `lib/control-layer/*`, `lib/audit-service.ts`, `lib/visibility-engine.ts`, `lib/export-safety.ts` and `lib/control-layer/monitoring-guard.ts` already cover the seams WP08 wants to align.

Test evidence:

- `tests/fail-closed-error-envelope.spec.ts` proves shared envelope defaults, infra retry behavior and protection against overriding safety-critical fields.
- `tests/true-ux-api-service-ui-truth.spec.ts` verifies UI-facing core APIs use fail-closed semantics.
- `tests/audit-fail-closed.spec.ts` and `tests/phase6-audit-persistence.spec.ts` cover audit persistence fail-closed behavior.

## SPEC-WP08-1 Refined Specification

Status: COMPLETE

Inputs and overrides used:

- Uploaded WP08 blueprint.
- `ANALYSIS-WP08-1` executed result above.
- WP03 generated spec/report: canonical client-safe projection boundary and source-upload metadata exception.
- WP04 generated spec/report: upload is never sufficiency; release/export stay locked until review/linkage/sufficiency/compliance gates.
- WP05 generated spec/report and human Option A: canonical Journey command path, `/api/demo-workflow` compatibility only, fail-closed audit before mutation.
- WP06 generated spec/report and human Option A: admin non-bypass, route/action/object/payload/API/service enforcement, no new API/schema.
- WP07 generated spec/report and human Option A: existing export API only; `/api/demo-workflow` export actions compatibility/demo only.

### Contract

- WP08 first wave must harden only existing API routes.
- No new API route is allowed without a separate explicit follow-up decision.
- No schema migration is allowed in WP08 first wave.
- APIs must fail closed on invalid request, invalid tenant, invalid role, wrong object scope, forbidden payload, audit-unavailable critical action and missing required runtime configuration.
- Fail-closed means: `ok: false`, `mutated: false`, `noAdviceExecution: true`, `noClientRelease: true`, no silent state advance and no fallback demo-data success.
- Document upload success is upload-only. It never implies evidence sufficiency, advisor approval, compliance release, export readiness or client visibility.
- Document listing must return projected/safe rows only and must not disclose hidden rows, storage keys, checksums or internal evidence state.
- Review monitoring is internal-only. It may expose monitoring/rebalance snapshot data for the internal application, but cannot execute advice, release content, advance state silently or create client-visible outcomes.
- `/api/demo-workflow` remains compatibility/demo transport unless explicitly upgraded in a later work package. It may be used for screencast/demo actions and typed recommendation-review compatibility proof, but the canonical MVP command path remains the Journey command surface from WP05.
- Shared helpers are allowed where they already exist or where a narrowly scoped local alignment reduces duplicate unsafe behavior. They must not create a new public API, weaken safety, or hide route-specific semantics.

### Acceptance Criteria

Positive proof:

- Valid document upload stores document/evidence/audit rows and returns upload-only safety semantics.
- Valid document list returns only tenant-scoped safe projections.
- Valid typed recommendation-review advisor approval persists without client release.
- Valid typed recommendation-review compliance release succeeds only after advisor, evidence, payload, permission and audit gates pass.
- Valid review monitoring snapshot returns internal-only guard semantics.

Negative proof:

- Invalid demo workflow payload fails closed with no mutation and no client release.
- Malformed demo workflow JSON fails closed.
- Invalid document tenant/role fails closed and returns no hidden rows.
- Invalid upload metadata/file/type fails closed and creates no release/export side effect.
- Unauthorized upload role is denied and audited.
- Audit-unavailable critical upload/release/action fails closed before mutation.
- Invalid review monitoring query fails closed with no advice execution and no client release.
- Forbidden payload/export cases remain covered by WP07 export API tests, not by widening WP08 scope.

## DECISION-WP08-1

Status: HUMAN_DECISION_REQUIRED

No explicit WP08 approval exists yet in this thread or in generated WP08 decision artefacts. This is a true stop point because implementation behavior differs materially depending on whether `/api/demo-workflow` remains compatibility-only or is tightened into a controlled action API.

### Option A - Recommended: Existing Routes, Shared Helpers, Demo Compatibility Only

Approve first-wave hardening as zero-delta-first revalidation against the current implementation:

- Existing API routes only.
- No new API.
- No schema migration.
- Shared fail-closed/redaction/audit helpers allowed with limits.
- `/api/review-monitoring` remains internal-only MVP support.
- `/api/demo-workflow` remains demo/compatibility transport, not canonical MVP API.
- Canonical Journey command/export/document APIs remain the authority for MVP proof.
- Implementation starts by proving zero-delta where the repo already satisfies the refined spec; only real gaps get code changes.

Aggressive clean-solution recommendation: approve Option A. It preserves the clean architecture already established by WP05-WP07, avoids turning the large screencast endpoint into the product command spine, and lets WP08 remove debt safely by documenting the demo endpoint as compatibility-only while enforcing hard fail-closed contracts on the actual MVP API surfaces.

Approval text:

`I approve WP08 Option A: existing API routes only, no new API, no schema migration, shared fail-closed/redaction/audit helpers allowed with limits, /api/review-monitoring internal-only MVP support, /api/demo-workflow compatibility/demo transport only, canonical Journey/export/document APIs remain MVP authority, and implementation starts with zero-delta revalidation before new code.`

### Option B - Strict Demo Workflow Allowlist

Keep no new API/schema, but tighten `/api/demo-workflow` so unknown `jNN.*` actions fail closed instead of recording generic screencast audit events.

Benefit: stronger endpoint hardening.

Cost: higher screencast/demo compatibility risk and likely more fixture/test churn. This conflicts with the accepted WP05-WP07 posture that `/api/demo-workflow` is compatibility/demo only.

### Option C - New Controlled API

Create a new action API and migrate callers away from `/api/demo-workflow`.

Benefit: clean long-term command surface.

Cost: explicitly out of WP08 first-wave scope; requires new route/API decision, route records, likely tests and product integration work.

## Implementation Derivation Preview

Blocked until `DECISION-WP08-1` is approved.

If Option A is approved:

- `IMPL-WP08-1`: likely ZERO-DELTA product-code implementation for `/api/documents` and `/api/documents/upload`, followed by focused revalidation.
- `IMPL-WP08-2`: likely ZERO-DELTA product-code implementation for typed recommendation-review hardening, with explicit residual-risk note that generic `jNN.*` fallback remains demo compatibility.
- `IMPL-WP08-3`: likely ZERO-DELTA product-code implementation for internal-only review monitoring.
- `IMPL-WP08-4`: likely ZERO-DELTA product-code implementation for shared fail-closed helper alignment.
- `QA-WP08-1`: focused API/service test proof.

If Option B is approved:

- `IMPL-WP08-2` requires product-code changes to add a strict action allowlist or reject unknown generic `jNN.*` action IDs.
- Additional tests must prove unknown demo workflow actions fail closed without generic audit mutation.

## QA/Proof Status

Full `QA-WP08-1` is blocked until implementation or zero-delta implementation tasks are approved and executed.

Current pre-decision proof status:

- `pnpm guard:source`: PASS, 0 violations.
- `pnpm exec tsc --noEmit --pretty false`: PASS.
- `pnpm db:validate`: PASS.
- `pnpm exec playwright test tests/fail-closed-error-envelope.spec.ts tests/p0-api-contract.spec.ts tests/document-upload-api.spec.ts tests/demo-workflow-validation.spec.ts tests/review-monitoring-service.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1 --reporter=line`: PASS, 26 passed.
- Positive proof is available from current focused tests for document upload/list success, typed recommendation-review behavior, review monitoring and shared fail-closed helpers.
- Negative proof is available from current focused tests for malformed demo workflow payloads, invalid document scope, invalid upload metadata, invalid review monitoring query, invalid export workflow scope and fail-closed envelope behavior.
- Final WP08 QA has not been claimed because implementation/zero-delta implementation tasks are decision-blocked.

## Product-Code Changes

None.

## Generated Artefact Updates

- Added this WP08 execution, analysis, refined specification and decision report.

## Residual Risks

- `/api/demo-workflow` still accepts unknown `jNN.*` action IDs as demo compatibility and writes a deterministic audit event. This is acceptable only under Option A's explicit compatibility-only decision.
- Full WP08 QA is not executed as final acceptance until after the decision and implementation/zero-delta tasks.
- No screenshots are required for this WP08 stop because no UI changes were made.

## Method Compliance Checklist

- Double Diamond Discover: completed through blueprint extraction, repo analysis and prior generated artefact review.
- Double Diamond Define: completed through the refined API hardening contract.
- Double Diamond Develop: options A, B and C compared.
- Double Diamond Deliver: delivered a decision-ready WP08 artefact and stopped before unauthorized implementation.
- Psycho-Logic / Map: separated request validation, RBAC, object scope, payload projection, audit persistence and client release.
- TRIZ: resolved the contradiction between demo flexibility and API safety by keeping demo compatibility out of MVP authority.
- SIT Closed World: reused existing routes, services and helpers instead of adding new API surface.
- Harvard / Principled Negotiation: recommendation preserves user goals of aggressive cleanup while respecting explicit no-new-API/schema boundaries.
- Ethics & Fairness: fail-closed behavior protects clients from internal advice, hidden payloads and silent release.

## Honest Limitations

- This is not a final WP08 implementation report.
- No product-code zero-delta claim is final until the human decision is approved and the implementation tasks are executed in order.
- Test commands still need to be run as final QA after the decision path is selected.
