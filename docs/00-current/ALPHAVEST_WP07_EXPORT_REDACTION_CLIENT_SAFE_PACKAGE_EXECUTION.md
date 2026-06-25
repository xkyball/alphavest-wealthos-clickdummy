# AlphaVest WP07 Export / Redaction / Client-Safe Package Execution

Generated: 2026-06-25

Status: COMPLETE_FOR_APPROVED_OPTION_A_ZERO_DELTA_PRODUCT_CODE

This report executes the uploaded WP07 blueprint as a strict process chain:

Blueprint task -> executed analysis result -> refined specification -> derived implementation task -> implementation or zero-delta implementation -> QA/proof -> report.

No product-code change was made in this WP07 run. After the human approved WP07 Option A, all implementation tasks were executed as zero-delta product-code revalidation. The current repository already contains the approved first-wave export safety implementation: MVP export routes `054-058`, existing `/api/export-workflow`, no new API, no schema migration, metadata-only redacted package manifest proof, Share as audited state/action after controlled download, mandatory forbidden-payload negative tests, and `/api/demo-workflow` export actions as compatibility/demo only.

## Source Scope Used

- Uploaded blueprint: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP07_EXPORT_REDACTION_CLIENT_SAFE_PACKAGE_BOC_TICKET_STRUCTURE.md`
- Current repository source code, tests, route tree, config and git state.
- Current and earlier generated process artefacts:
  - `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`
- Explicit human decisions from this refactor chain:
  - WP05 Option A approved: canonical Journey command path, demo workflow compatibility only, fail-closed audit before mutation, no new API, no schema migration in first wave.
  - WP06 Option A approved: full route/action/object plus payload/API/service enforcement, admin non-bypass fail-closed, denied sensitive attempts audited before mutation, no new API, no schema migration, demo workflow compatibility only.
  - WP07 Option A approved: MVP export routes `054-058` only, existing `/api/export-workflow` only, no new API, no schema migration, metadata-only redacted package manifest proof for first wave, Share as audited state/action after controlled download, forbidden payload negative tests mandatory, `/api/demo-workflow` export actions compatibility/demo only.

Excluded as specification authority: unrelated legacy planning docs, broad handoff docs, source refs, old KB/source artefacts and prior assumptions unless revalidated against current repo evidence.

## Baseline

- Branch: `full-workflow`
- Latest commit at start: `1e6616e test: rerun wp06 rbac non-bypass proof`
- Working tree at start: clean
- Source guard preflight: PASS
- Prisma schema validation: PASS
- TypeScript validation: PASS

## Extracted Blueprint Tasks

### Epic: WP-07 Export / Redaction / Client-Safe Package

Detailed description: harden export as a client-safe projection, not a raw data dump. Export packages may contain only scoped, released, redacted, approved and audited content. Preview is not approval. Approval is not download/share. Download/share is not client acceptance. AI drafts, internal rationale, compliance notes, unreleased recommendations, unreleased evidence, hidden fields and unredacted payloads must not reach client exports.

Scope:

- Export routes `054-058`
- Export scope selection
- Redaction review
- Export preview
- Export approval
- Export download/share
- Forbidden internal payload exclusion
- Export audit requirements
- Export P0 positive and negative acceptance

Out of scope:

- New screen generation
- New state-screen image generation
- New visual assets
- New route creation unless explicitly approved later
- Blind schema replacement
- P1 communication export expansion
- HOLD route export inclusion
- Real banking/custody integrations
- Client acceptance/client execution semantics

Completion criteria:

- Analysis documents export routes, services, payloads, tests and gaps.
- Specification defines lifecycle and redaction contracts.
- Human approval for MVP export scope and enforcement depth exists.
- Scope/redaction prevent forbidden payload export.
- Preview, approval, download and share are technically and semantically separated.
- Audit events exist for critical export actions or fail closed.
- P0 positive and negative tests prove no-redaction, no-approval, wrong-tenant and admin-bypass export cases fail safely.

### ANALYSIS-WP07-1: Export Route, Service, Payload and Test Reality Audit

Detailed description: audit existing export routes, services, payloads, tests and audit hooks before implementation.

Dependencies: WP00, WP03, WP04, WP05, WP06 and source hierarchy lock. Enables `SPEC-WP07-1` and `DECISION-WP07-1`.

DoD:

- Relevant export files, services, tests and UI flows identified.
- Current lifecycle and redaction findings documented.
- Forbidden payload risks visible.
- Audit/approval/download gaps documented.
- Task split and CTES assessment provided.
- Open decisions named.

### SPEC-WP07-1: Client-Safe Export Lifecycle, Redaction and Approval Contract

Detailed description: specify lifecycle states, forbidden payload taxonomy, redaction rules, approval/download/share preconditions, UI feedback, role/action/object/payload rules, audit requirements and positive/negative P0 acceptance.

Dependencies: `ANALYSIS-WP07-1`. Enables `DECISION-WP07-1`, implementation tasks and QA.

Subtasks:

- Forbidden payload and redaction taxonomy.
- Export lifecycle acceptance criteria and P0 negative cases.

DoD:

- Target state is unambiguous.
- Scope and out of scope are clear.
- Forbidden payload taxonomy is testable.
- Acceptance criteria cover positive and negative cases.
- Test/review logic is defined.
- Downstream implementation tasks can be derived.

### DECISION-WP07-1: Human Approval of MVP Export Enforcement Scope

Detailed description: obtain human approval for export scope and enforcement depth before implementation. This prevents Codex from widening export scope, adding P1/HOLD/reference content or inventing a new API surface.

Dependencies: `SPEC-WP07-1`. Enables all implementation tasks.

Required decision notes:

- `WP07_MVP_EXPORT_SCOPE_APPROVED`
- `NO_NEW_EXPORT_API_UNLESS_EXPLICITLY_REQUIRED`
- `FORBIDDEN_PAYLOAD_NEGATIVE_TESTS_REQUIRED`

DoD:

- Human confirms or corrects scope and enforcement depth.
- Implementation tasks are no longer decision-blocked.

### IMPL-WP07-1: Implement Scoped Export Projection and Redaction Enforcement

Detailed description: harden existing export projection/package logic so only scoped, released, redacted and client-safe payloads enter preview/package.

Subtasks:

- Scope and object selection guard.
- Forbidden internal payload redaction.

Dependencies: `ANALYSIS-WP07-1`, `SPEC-WP07-1`, `DECISION-WP07-1`.

DoD:

- Export projection includes only allowed fields.
- Forbidden internal payloads are excluded/redacted.
- Wrong tenant/object data cannot enter export package.
- Tests prove positive and negative redaction cases.

### IMPL-WP07-2: Implement Export Approval/Download/Share Separation

Detailed description: enforce preview, approval, package generation, download and share as separate gated states.

Subtasks:

- Preview-not-approval enforcement.
- Download/share precondition enforcement.

Dependencies: `SPEC-WP07-1`, `DECISION-WP07-1`, partially `IMPL-WP07-1`.

DoD:

- Preview cannot approve/download/share.
- Approval cannot happen before scope/redaction preconditions.
- Download/share cannot happen before approval and audit requirements.
- Tests cover no-approval and no-redaction cases.

### IMPL-WP07-3: Implement Export Feedback States and Audit Events

Detailed description: implement fail-closed UI feedback and audit event persistence for export scope, redaction, approval, download and share.

Subtasks:

- UI feedback and fail-closed states.
- Audit event persistence for export gates.

Dependencies: `SPEC-WP07-1`, `DECISION-WP07-1`, `IMPL-WP07-1/2` as needed.

DoD:

- Feedback messages do not overclaim gates.
- Missing preconditions show blocked/denied states.
- Critical export actions have audit mapping.
- Tests cover selected feedback/audit paths.

### QA-WP07-1: P0 Export/Redaction Validation and Regression Proof

Detailed description: validate the integrated export/redaction implementation with positive and negative P0 checks.

Dependencies: `SPEC-WP07-1`, all implementation tasks.

Validation checklist:

- Positive approved released decision/evidence summary can be exported as redacted client-safe package.
- Negative AI draft/internal rationale absent.
- Negative compliance notes absent.
- Negative unreleased recommendation blocked.
- Negative uploaded-but-insufficient evidence does not export.
- Negative preview cannot download/share.
- Negative missing approval blocks download/share.
- Negative wrong tenant/object denied.
- Negative admin cannot force redaction bypass or export approval.
- Negative audit missing/unavailable blocks or records failure according to contract.

## Executed Analysis Result

Task: `ANALYSIS-WP07-1`

Status: COMPLETE

### Route Reality

- Route `054` `/export/new` exists in `lib/route-registry.ts` as an export creation route.
- Route `055` `/export/:id/scope` exists with `objectType: EXPORT_REQUEST`.
- Route `056` `/export/:id/redaction` exists and is client-visibility-sensitive.
- Route `057` exists as `/export/:id/approval` with title `Export Preview`. This is a naming drift against the blueprint's `/export/:id/preview`, but product semantics keep preview/approval separate.
- Route `058` `/export/:id/download` exists with `permissionAction: EXPORT` and `clientVisibilitySensitive: true`.

### Service and API Reality

- `lib/export-service.ts` defines the core export safety checks:
  - forbidden classifications: `AI_DRAFT`, `INTERNAL_RATIONALE`, `COMPLIANCE_NOTES`, `UNRELEASED_EVIDENCE`, `UNRELEASED_RECOMMENDATION`, `HIDDEN_FIELD`.
  - payload inspection maps forbidden fields such as `aiDraft`, `internalRationale`, `complianceNotes`, `evidenceRecordId`, `storageKey`.
  - export scope evaluation blocks restricted/not-permitted items and forbidden payload classifications.
  - export step separation models preview, approval, generation, download and share as different stages.
  - generation requires permission, redaction profile, approval, target export request, audit persistence and no forbidden payload.
- `lib/export-package-service.ts` builds a metadata-only package manifest:
  - `manifestVersion: "2026.06.first-build-phase7"`
  - `realBinaryGenerated: false`
  - approval, audit persistence, external share, payload classification, selected object count and watermark controls are captured.
- `lib/control-layer/export-safety.ts` wraps export service and package manifest checks under WCL-09.
- `lib/export-workflow-command-service.ts` provides command-level scope/redaction/preview/approval/generate/download/share flow:
  - command IDs: `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD`, `SHARE`.
  - operational roles limited to principal, family CFO and compliance officer.
  - unsafe roles fail closed before mutation.
  - forbidden payloads fail before preview/approval.
  - high severity data quality blocks approval with audit.
  - download requires `GENERATED`.
  - share requires `DOWNLOADED` and explicit `externalShare: true`.
  - successful commands write `export.workflow.*` audit events.
- `app/api/export-workflow/route.ts` exposes existing GET/POST API:
  - GET returns DB read-model snapshot.
  - POST parses and executes command requests.
  - invalid scope and command failures use fail-closed envelopes.
  - No new API is required for Option A first wave.
- `/api/demo-workflow` still contains export demo actions. It is a compatibility/demo surface, not the clean canonical export command path.

### UI Reality

- `components/communication-export-ops-screen.tsx` contains export lifecycle and payload boundary UI.
- It explicitly says export is a client-safe projection, not a raw data dump.
- It lists allowed payloads as released client-safe summaries, released evidence summaries and approved/redacted manifest metadata.
- It lists blocked payloads as AI draft, internal rationale, analyst notes, compliance notes, unreleased evidence, unreleased recommendations and hidden fields.
- UI copy states admin access/advisor approval do not expand export payload permission and that service checks/audit are required.

### Test Reality

Existing tests cover much of WP07 already:

- `tests/export-safety.spec.ts`: WCL export safety, forbidden internal payload blocking, missing redaction profile blocking.
- `tests/file-export-realism.spec.ts`: metadata-only export package manifest, approval requirement, forbidden payload classifications, preview separation, object-scoped request requirement, audit persistence failure, data quality gate, export scope filtering, stage separation and external share controls.
- `tests/export-workflow-api.spec.ts`: full existing export workflow API lifecycle, forbidden payload denial, high-severity data quality block and external advisor denial.
- `tests/phase8-export-workflow-api.spec.ts`: fail-closed invalid scope, DB read-model truth, audit persistence failure, share before/after download.
- `tests/true-ux-export-scope-redaction-approval.spec.ts`: UI boundary copy and service-level separation.

### Gaps and Decision-Relevant Findings

- Product code is strong enough that Option A is likely a zero-delta product-code implementation for the first wave.
- A hard decision is still required before claiming implementation complete, because the blueprint explicitly asks whether MVP export should produce a real downloadable artefact or whether a redacted metadata-only package proof is enough.
- Current package proof is metadata-only: `realBinaryGenerated: false`. Turning this into a real ZIP/binary is a product decision with larger safety and QA blast radius.
- Current canonical export API path already exists as `/api/export-workflow`; it was likely added in an earlier wave. No new API should be added for WP07 first wave.
- Route `057` is `/export/:id/approval` with title `Export Preview`, not literal `/export/:id/preview`. This is acceptable for current Option A if the product keeps preview/approval semantics separated; renaming the route would be route evolution and is not needed for the first-wave safety contract.

## Refined Specification

Task: `SPEC-WP07-1`

Status: COMPLETE

Generated artefacts used as inputs or overrides:

- WP03 generated spec/report: client-safe projection boundary must be canonical and forbidden internal payloads must not render to clients.
- WP04 generated spec/report: upload is not sufficiency and evidence cannot unlock export unless reviewed, linked, scoped, current and client-safe.
- WP05 generated spec/report and explicit approval: advisor approval is not release; compliance release is the client-safe gate; no new API/schema in first wave.
- WP06 generated spec/report and explicit approval: admin cannot bypass route/action/object/payload/audit gates; no new API/schema in first wave.

### WP07 First-Wave Contract

The first wave should harden/revalidate only MVP export routes `054-058` and the existing export workflow surfaces:

- UI: `components/communication-export-ops-screen.tsx`
- Safety service: `lib/export-service.ts`
- Package manifest: `lib/export-package-service.ts`
- WCL wrapper: `lib/control-layer/export-safety.ts`
- Command service: `lib/export-workflow-command-service.ts`
- Read model/API: `lib/export-workflow-readmodel-service.ts`, `app/api/export-workflow/route.ts`
- Compatibility/demo actions: `/api/demo-workflow`, proof-only unless explicitly routed through the canonical export command service later.

No new API, route or schema migration is part of first-wave WP07 unless the human rejects Option A.

### Forbidden Payload Taxonomy

Allowed in client export:

- `CLIENT_SAFE_SUMMARY`
- `RELEASED_EVIDENCE_SUMMARY`
- approved/redacted package manifest metadata

Forbidden in client export:

- `AI_DRAFT`
- `INTERNAL_RATIONALE`
- `COMPLIANCE_NOTES`
- `UNRELEASED_EVIDENCE`
- `UNRELEASED_RECOMMENDATION`
- `HIDDEN_FIELD`
- cross-tenant object data
- raw storage keys, checksums or internal file paths in client-facing read models
- internal audit metadata beyond approved audit proof references

### Lifecycle Contract

- Scope selection does not equal redaction.
- Redaction validation does not equal preview.
- Preview does not equal approval.
- Approval does not equal generation/download/share.
- Download/share does not equal client acceptance.
- Share requires an explicit external share flag and a previously downloaded package state.
- Missing audit persistence, missing redaction profile, missing approval, blocked data quality, wrong object scope, wrong tenant or forbidden payload must fail closed.

### Acceptance Criteria

- Given a safe scope and safe payload, when redaction, preview, approval, generation, download and share are performed in order, then each state transition is separate and audited.
- Given preview exists without approval, when generate/download/share is attempted, then it fails closed.
- Given a payload contains AI draft, internal rationale or compliance notes, when preview/approval/package generation is attempted, then it fails closed and no mutation occurs.
- Given high-severity data quality is active, when approval is attempted, then it fails closed and audit records the blocked state.
- Given external advisor or admin-like non-export role tries to scope/approve/export, then action fails closed and no export scope is created.
- Given invalid tenant/role scope is requested, then API returns fail-closed envelope and no hidden rows leak.
- Given package manifest is created in the current first-wave contract, then it is metadata-only and must not overclaim a real binary.

## Decision Gate

Task: `DECISION-WP07-1`

Status: COMPLETE

The human approved WP07 Option A:

`I approve WP07 Option A: MVP export routes 054-058 only, existing /api/export-workflow only, no new API, no schema migration, metadata-only redacted package manifest proof for first wave, Share as audited state/action after controlled download, forbidden payload negative tests mandatory, /api/demo-workflow export actions compatibility/demo only, and revalidate as likely zero-delta product-code implementation before any new code.`

### Options

Approved Option A - aggressive clean solution:

Approve WP07 first wave as MVP export routes `054-058` only, existing `/api/export-workflow` only, no new API, no schema migration, metadata-only redacted package manifest proof, Share as an audited state/action after controlled download, forbidden payload negative tests mandatory, `/api/demo-workflow` export actions compatibility/demo only.

Why this is cleanest now:

- It preserves the same clean policy shape already approved in WP05 and WP06.
- It avoids widening export scope into P1/HOLD/reference contexts.
- It treats the current strong implementation as a likely zero-delta product-code first wave after approval.
- It removes debt by making `/api/export-workflow` the canonical WP07 path and demoting `/api/demo-workflow` export actions to compatibility/demo status.
- It avoids pretending a metadata manifest is a real downloadable ZIP.

Rejected Option B:

Approve a real downloadable ZIP/binary export artefact in WP07 first wave. This requires a larger implementation slice, deeper file content QA, explicit storage/retention semantics, stricter redacted payload fixture review and likely new proof artefacts. It is cleaner long term but too broad for the current first-wave safety gate unless commercial demo value requires it now.

Rejected Option C:

Expand WP07 to P1 communication/ops export contexts now. Not recommended. It widens blast radius, conflicts with the MVP route scope lock and risks importing unrevalidated planning assumptions.

## Derived Implementation Tasks

Implementation status: ZERO-DELTA PRODUCT CODE for approved Option A.

- `IMPL-WP07-1` ZERO-DELTA PRODUCT CODE: current `exportService`, command parser and package manifest already enforce object scope, forbidden classifications, redaction profile, selected export request and safe payload inspection. Code proof: `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/export-workflow-command-service.ts`.
- `IMPL-WP07-2` ZERO-DELTA PRODUCT CODE: current command service and tests already separate `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD` and `SHARE`; download requires generated state, share requires downloaded state and explicit external-share flag. Code proof: `lib/export-workflow-command-service.ts`.
- `IMPL-WP07-3` ZERO-DELTA PRODUCT CODE: current API/command service persists export workflow audit events, read model declares `/api/export-workflow` as DB read-model truth, and UI explains fail-closed/no-overclaim states. Code proof: `app/api/export-workflow/route.ts`, `lib/export-workflow-readmodel-service.ts`, `components/communication-export-ops-screen.tsx`.

Product-code delta: none. This is not a new implementation claim; it is an approved zero-delta implementation based on current repo evidence and final focused QA.

## QA / Proof

Task: final `QA-WP07-1` revalidation for approved Option A.

The final focused proof command was:

```text
pnpm guard:source
pnpm exec tsc --noEmit --pretty false
pnpm db:validate
pnpm exec playwright test tests/export-safety.spec.ts tests/file-export-realism.spec.ts tests/export-workflow-api.spec.ts tests/phase8-export-workflow-api.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1 --reporter=line
```

Result:

- Source target guard: PASS, 0 violations.
- TypeScript: PASS.
- Prisma schema validation: PASS.
- Focused export/redaction/API-truth tests: PASS, 31/31.

Positive proof:

- Safe export lifecycle can progress through scope, redaction, preview, approval, generate, download and share with separate audit events.
- Metadata-only manifest proof is valid under current contract.
- DB read model declares `/api/export-workflow` truth and does not expose raw storage/checksum/internal payload fields.

Negative proof:

- Forbidden payload fields are rejected before preview/approval.
- AI draft, internal rationale, compliance notes, unreleased evidence/recommendations and hidden fields are forbidden by service/package tests.
- Generate before approval is denied.
- Share before download is denied.
- Data quality blockers deny approval.
- Invalid tenant/role scope fails closed.
- External advisor export scope is denied.
- Missing redaction profile, audit persistence or selected export request blocks generation.

## Product-Code Changes

None.

## Generated Artefact Updates

- Added this WP07 execution report.
- Updated this report after WP07 Option A approval with zero-delta implementation and final QA proof.

## Residual Risks

- Current export package is metadata-only by approved Option A. This must not be overclaimed as a real binary/ZIP export.
- `/api/demo-workflow` still has export compatibility actions. They are acceptable as demo compatibility but should not be treated as the canonical WP07 export command spine.
- Route `057` uses `/export/:id/approval` while the upload references `/export/:id/preview`. Current semantics pass, but literal route naming should not be changed without route-evolution approval.

## Completion Recommendation

Keep WP07 closed for approved Option A as `ZERO-DELTA PRODUCT CODE / COMPLETE_FOR_APPROVED_FIRST_WAVE`.

Next aggressive cleanup should be a narrow follow-up outside WP07 Option A: consolidate `/api/demo-workflow` export compatibility actions behind the canonical `/api/export-workflow` command service, or explicitly mark them as demo-only in tests and reports. Do not add real ZIP/binary export until a separate decision approves storage, retention, content-inspection and download semantics.
