# EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Artefact status:** `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**Evidence / audit / export gate status:** `EVIDENCE_AUDIT_EXPORT_GATE_CONTRACTED_NOT_IMPLEMENTED`

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact locks the AlphaVest WealthOS safety contract for evidence sufficiency, audit persistence and client-safe export. It is a **contract artefact only**. It does not implement, change APIs, change Prisma, create migrations, write tests, generate screens, generate state-screen images, create visual assets, create Codex tasks or prepare a final Codex handoff.

The core decision is strict: **upload success is not evidence sufficiency; audit display is not audit persistence; export preview is not export approval; export approval is not export download/share; export download/share is not client acceptance; admin authority is not a bypass of evidence, audit, visibility, redaction or release gates.**

The contract inherits the prior RBAC, client visibility and advice-boundary rule: no unapproved advice, AI Draft, internal rationale, compliance notes, unreleased evidence or unredacted export content may reach a client. Route access is not action permission; action permission is not payload visibility; payload visibility is derived, scoped and fail-closed.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
|---|---|---|
| Artefact | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | PASS |
| Position | 9 of 15 | PASS |
| Required predecessor 1 | `MVP_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 2 | `ROUTE_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 3 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | PASS — exists and used |
| Required predecessor 4 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | PASS — exists and used |
| Required predecessor 5 | `STATE_SCREEN_SPEC.md` | PASS — exists and used |
| Required predecessor 6 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | PASS — exists and used |
| Required predecessor 7 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | PASS — exists and used |
| Required predecessor 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | PASS — exists and used |
| Direct predecessor | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | PASS |
| Direct successor | `API_CONTRACT_MATRIX.md` | PREPARED_ONLY |
| Codex status | `CODEX_HANDOFF_NOT_READY` | BLOCKED |
| Implementation status | No implementation | BLOCKED |
| Screen / state-screen / image generation | No generation | BLOCKED |

## 3. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Sequence, dependencies, stop rules, readiness gates | Bypassing sequence or starting Codex |
| 2 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Binding direct predecessor | RBAC, payload visibility, fail-closed client visibility, AI Draft internal-only, advice boundary, admin non-bypass | Re-deciding or weakening safety scope |
| 3 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding predecessor | Upload-only success, no-overclaim feedback, validation/error/blocked states | Treating feedback as implementation proof |
| 4 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Binding predecessor | Interaction lifecycle contracts and proof limits | Treating visible drawers/modals/actions as safety proof |
| 5 | `STATE_SCREEN_SPEC.md` | Binding predecessor | Route-level states, blocked/permission/error/release/evidence/export states | Reclassifying state scope |
| 6 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Binding predecessor | State-screen workset, P1/reference/hold exclusions | Authorizing generation |
| 7 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Binding predecessor | Route/component/visual status and visual proof limits | Treating PNGs as behaviour/safety proof |
| 8 | `ROUTE_SCOPE_LOCK.md` | Binding predecessor | Locked scope labels for all 71 routes | Reclassifying route scope |
| 9 | `MVP_SCOPE_LOCK.md` | Binding predecessor | MVP boundary, non-goals and P0 safety scope | Inventing conflicting MVP scope |
| 10 | `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB layer | Full-workflow schema baseline and patch/control-spec mapping | Treating schema gate as passed or replacing schema |
| 11 | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction reality layer | Implemented/partial/deterministic/static distinction | Treating component presence as lifecycle proof |
| 12 | `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual/state layer | 71-route baseline, 63 PNG baseline, unresolved `064–071` | Generating screens or assuming 63 PNGs cover 71 routes |
| 13 | `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness layer | `CODEX_HANDOFF_NOT_READY`, open gates | Overclaiming readiness |
| 14 | `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap cleanup | Blocks `main` absence claims | Deriving target gaps/tasks from `main` |
| 15 | `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Validated inventory | 405 files, 71 routes, 4 APIs, 42 Prisma models, 10 specs, 63 PNGs | Treating inventory as MVP safety proof |
| 16 | `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | Recovery/versioning protocol | Source hierarchy and version discipline | Letting v0.1 override newer layers |
| 17 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP Control Spec | Evidence, audit, export, advice boundary, RBAC, visibility, workflow and acceptance-gate concepts | Replacing full-workflow code/schema |
| 18 | `local repository checkout / pull of target branch full-workflow` | Primary target codebase | Target routes, files, components, APIs, Prisma, tests, services and assets | Assuming all present code is ready |
| 19 | `main branch as false-gap / historical only; never target truth` | False-gap source only | Historical comparison only | Any target truth or Codex task |

## 4. Binding Predecessor Decisions

### 4.1 MVP Scope

AlphaVest MVP is a controlled, digital, human-backed, evidence-backed Family Office workflow platform. MVP core includes internal draft preparation, analyst/advisor review, advisor approval, compliance review/release/block, client visibility, decision records, document/evidence intake, audit trail, RBAC/governance baseline and a safe export/redaction subset.

Excluded from MVP and from this contract as implementation scope: autonomous advice, client-visible AI Draft, manual client visibility override, admin bypass, upload-to-release shortcut, blind schema replacement, production banking/custody integration, real client pilot and implementation from `main`.

### 4.2 Locked Route Worksets

| Scope Label | Count | Route IDs |
|---|---:|---|
| `MVP` | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 |
| `MVP_SUPPORT` | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 |
| `P1_AFTER_MVP` | 5 | 052, 053, 059, 060, 068 |
| `REFERENCE_ONLY` | 3 | 061, 062, 063 |
| `HOLD_PENDING_DECISION` | 7 | 064, 065, 066, 067, 069, 070, 071 |
| `FUTURE_STATE` | 0 | — |
| `DEMO_ONLY` | 0 | — |
| `OUT_OF_SCOPE` | 0 | — |

### 4.3 Visual, State, Interaction and Feedback Limits

* Routes `001–063` have matched public clean PNGs, but visual coverage is not behaviour or safety proof.
* Routes `061–063` are reference-only.
* Route `068` is P1 after MVP.
* Routes `064–067` and `069–071` remain hold-blocked.
* Routes `064–071` are registered routes with missing/non-public visual references.
* `STATE_SCREEN_SPEC.md` requires full state specification for MVP routes and conditional state specification for flow-relevant MVP_SUPPORT routes.
* `DRAWER_MODAL_INTERACTION_CONTRACT.md` and `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` remain partial/not-passed gates.
* Upload success is upload-only.
* Advisor approval is not compliance release.
* Compliance release is not client acceptance.
* A button is not a mutation.
* A status chip is not a gate.
* A visible audit timeline is not audit persistence proof.
* A visible export preview is not export approval or client-safe export proof.

### 4.4 RBAC / Client Visibility / Advice Boundary Inheritance

This contract inherits and does not overwrite the prior safety contract:

* route access is not action permission
* action permission is not payload visibility
* object scope is tenant / engagement / document / decision / evidence / export scoped
* client-facing payloads must be `CLIENT_SAFE_RELEASED_ONLY`
* AI Draft is `AI_DRAFT_INTERNAL_ONLY`
* internal rationale, analyst notes and compliance notes are not client payloads
* advisor approval is not compliance release
* compliance release is required before client visibility
* admin cannot bypass advice, compliance, evidence, audit, visibility or export gates

## 5. Evidence / Audit / Export Contract Method

| Step | Method |
|---:|---|
| 1 | Validate roadmap position and predecessor availability. |
| 2 | Preserve `full-workflow` as target code reality and `main` as false-gap source only. |
| 3 | Separate product/control intent from code presence and from behaviour proof. |
| 4 | Contract evidence sufficiency without treating upload, document rows or visual evidence cards as sufficiency proof. |
| 5 | Contract audit persistence without treating visual audit timelines as persistence proof. |
| 6 | Contract export safety without treating preview, approval or download as interchangeable. |
| 7 | Apply fail-closed behaviour for evidence, audit and export when proof is incomplete. |
| 8 | Route unresolved API behaviour to `API_CONTRACT_MATRIX.md`. |
| 9 | Route unresolved schema/field gaps to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`. |
| 10 | Route proof expectations and negative cases to `P0_TEST_ACCEPTANCE_MATRIX.md`. |
| 11 | Keep Codex blocked. |

### Map-vs-Reality Separation

| Layer | Can Prove | Cannot Prove | Contract Treatment |
|---|---|---|---|
| Product / MVP control rule | Desired evidence/audit/export safety | Current implementation | Use as safety intent only |
| Full-workflow file/model/API presence | A file/model/API exists | MVP-grade behaviour | Treat as baseline, not proof |
| Upload interaction on route `028` | File transfer mechanics are present | Evidence sufficiency, release, export | `UPLOAD_ONLY_NOT_SUFFICIENCY` |
| Audit timeline component | Audit items can be displayed | Persistence / immutability | `AUDIT_DISPLAY_ONLY_NOT_PROOF` |
| Export routes `054–058` | Export journey surfaces exist | Redaction / approval / safe payload | `EXPORT_CONTRACT_REQUIRED` |
| Existing tests | Some proof slices exist | Full P0 safety | Route to P0 test matrix |

## 6. Safety Vocabulary

### Evidence Labels

| Label | Meaning |
|---|---|
| `EVIDENCE_SUFFICIENT` | Evidence is linked, relevant, reviewed, scoped, current enough and accepted for the specific gate. |
| `EVIDENCE_INSUFFICIENT` | Evidence is absent, incomplete, stale, unreviewed, unlinked or not relevant to the gate. |
| `EVIDENCE_REVIEW_PENDING` | Evidence exists but human review or extraction review is not complete. |
| `EVIDENCE_VERIFICATION_PENDING` | Evidence review is not final; verification must finish before sufficiency can be claimed. |
| `EVIDENCE_LINK_REQUIRED` | Evidence must be linked to target object, recommendation, decision, compliance review or export scope. |
| `UPLOAD_ONLY_NOT_SUFFICIENCY` | File upload succeeded but no sufficiency or release condition is met by upload alone. |
| `NEEDS_EVIDENCE` | Workflow requires additional evidence or review. |
| `EVIDENCE_CLIENT_SAFE_SUMMARY_ONLY` | Client may receive only a released/redacted summary, not internal raw evidence. |
| `EVIDENCE_INTERNAL_ONLY` | Evidence or evidence detail remains internal-only. |
| `EVIDENCE_VISIBILITY_FAIL_CLOSED` | Evidence is hidden/redacted when visibility proof is incomplete. |

### Audit Labels

| Label | Meaning |
|---|---|
| `AUDIT_REQUIRED` | Action requires an audit event. |
| `AUDIT_PERSISTENCE_REQUIRED` | The audit event must be stored, not merely shown visually. |
| `AUDIT_DISPLAY_ONLY_NOT_PROOF` | Visual audit rows do not prove persistence or immutability. |
| `AUDIT_UNAVAILABLE_FAIL_CLOSED` | If required audit cannot be written or confirmed, the action must fail closed or remain pending. |
| `AUDIT_EVENT_MINIMUM_FIELDS_REQUIRED` | Actor, role, tenant, target, action, result, previous state, next state, timestamp and reason/context are required where applicable. |
| `AUDIT_IMMUTABILITY_EXPECTED` | Audit records are append-only from a product-control perspective. |
| `AUDIT_NEGATIVE_TEST_EXPECTED` | P0 tests must prove forbidden audit bypass or missing audit behaviour fails. |

### Export Labels

| Label | Meaning |
|---|---|
| `EXPORT_SCOPE_REQUIRED` | Export content must be deliberately scoped before preview, approval or generation. |
| `EXPORT_REDACTION_REQUIRED` | Client-safe export requires redaction before approval/download. |
| `EXPORT_APPROVAL_REQUIRED` | Export package needs approval when client-facing or sensitive. |
| `EXPORT_PREVIEW_NOT_APPROVAL` | Previewing an export does not approve it. |
| `EXPORT_DOWNLOAD_NOT_CLIENT_ACCEPTANCE` | Download/share success does not mean client acceptance, understanding or execution. |
| `CLIENT_SAFE_EXPORT_ONLY` | Client export may include only released, redacted, approved and scoped content. |
| `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` | AI Draft, internal rationale, compliance notes, unreleased recommendations and hidden fields are forbidden. |
| `EXPORT_FAIL_CLOSED` | Export blocks when scope, redaction, approval, audit or visibility proof is incomplete. |
| `EXPORT_NEGATIVE_TEST_EXPECTED` | P0 tests must prove leakage, bypass and no-redaction cases fail. |

### Routing Labels

| Label | Meaning |
|---|---|
| `API_CONTRACT_REQUIRED` | Behaviour must be specified in `API_CONTRACT_MATRIX.md`. |
| `SCHEMA_FIELD_RECONCILIATION_REQUIRED` | Field or relation mapping must be resolved in `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`. |
| `P0_TEST_REQUIRED` | Acceptance or negative proof must be mapped in `P0_TEST_ACCEPTANCE_MATRIX.md`. |
| `CONTRACT_ONLY_NOT_IMPLEMENTED` | Contract exists; no implementation is performed here. |
| `NOT_READY_FOR_CODEX` | Codex remains blocked. |
| `HOLD_BLOCKED_NO_FINAL_CONTRACT` | Held route cannot receive final safety contract. |
| `P1_DEFERRED` | P1 route is deferred from MVP. |
| `REFERENCE_ONLY_NO_PRODUCT_CONTRACT` | Reference route does not carry product safety contract. |

## 7. Cross-Cutting Evidence / Audit / Export Rules

| Rule ID | Rule | Required Contract Behaviour |
|---|---|---|
| EAE-RULE-001 | Upload success confirms file transfer only. | Upload success must never unlock evidence sufficiency, advisor approval, compliance release or export. |
| EAE-RULE-002 | Evidence sufficiency requires reviewable, linked, relevant, scoped and accepted evidence. | A document row, upload event or visual evidence card is not enough. |
| EAE-RULE-003 | Evidence insufficiency blocks release and export where evidence is required. | Use `NEEDS_EVIDENCE`, `EVIDENCE_REVIEW_PENDING` or `EVIDENCE_INSUFFICIENT`. |
| EAE-RULE-004 | Evidence review must not expose unreleased internal data to client-facing routes. | Client payloads receive only released/redacted summaries. |
| EAE-RULE-005 | Evidence visibility inherits fail-closed client visibility. | Default is hidden/redacted if visibility proof is incomplete. |
| EAE-RULE-006 | Critical gate actions require audit events. | Advisor approval, compliance release/block, evidence request and export actions require audit mapping. |
| EAE-RULE-007 | Audit display is not audit persistence proof. | Audit UI rows must not be treated as stored events. |
| EAE-RULE-008 | If required audit persistence is unavailable, safety actions fail closed or remain pending. | No silent release, export, permission change or evidence sufficiency update. |
| EAE-RULE-009 | Advisor approval, compliance release, block, evidence request and export approval require audit coverage. | Route to API/schema/P0 matrices where proof is missing. |
| EAE-RULE-010 | Export scope cannot exceed actor permission, object scope or client visibility. | Export payload cannot expand what route/API visibility allows. |
| EAE-RULE-011 | Export preview is not export approval. | Preview may show redaction state but cannot authorize download/share. |
| EAE-RULE-012 | Export approval is not export download/share. | Download/share still requires audit, redaction and final payload check. |
| EAE-RULE-013 | Export download/share must include redaction and audit expectations. | Download/share without redaction/audit is blocked. |
| EAE-RULE-014 | Export must not contain AI Draft, internal rationale, compliance notes, unreleased recommendations, unreleased evidence or hidden payload fields. | Such content is `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD`. |
| EAE-RULE-015 | Admin cannot force evidence sufficiency, suppress audit, bypass redaction or force export release. | Admin non-bypass applies to evidence, audit and export paths. |
| EAE-RULE-016 | Client-safe export content must be released, redacted, approved and evidence/audit safe. | Export payload is a projection, not raw internal data. |
| EAE-RULE-017 | Export success must not imply client acceptance, decision execution or investment action. | Success wording and state must be limited to package/download/share completion. |
| EAE-RULE-018 | Demo workflow actions are not production persistence proof. | Demo action feedback must remain limited until API/schema/test proof exists. |
| EAE-RULE-019 | Existing tests are proof slices only. | Missing negative tests route to `P0_TEST_ACCEPTANCE_MATRIX.md`. |
| EAE-RULE-020 | Codex remains blocked. | This contract prepares later artefacts; it does not authorize implementation. |

## 8. Evidence Sufficiency Contract

### 8.1 Evidence Lifecycle

| Stage | Contract Status | Rule |
|---|---|---|
| Upload selected | `UPLOAD_ONLY_NOT_SUFFICIENCY` | File is selected locally; nothing is sufficient. |
| Upload in progress | `UPLOAD_ONLY_NOT_SUFFICIENCY` | Action may show progress; release/export remains blocked. |
| Upload success | `UPLOAD_ONLY_NOT_SUFFICIENCY` | File transfer succeeded only. |
| Document row exists | `EVIDENCE_REVIEW_PENDING` | A record exists but does not prove review or relevance. |
| Extraction review | `EVIDENCE_REVIEW_PENDING` | Extracted fields must be reviewed; low-confidence data must not unlock gates. |
| Verification pending | `EVIDENCE_VERIFICATION_PENDING` | Evidence cannot be treated as sufficient until review/verification conditions pass. |
| Evidence linked | `EVIDENCE_LINK_REQUIRED` / `EVIDENCE_REVIEW_PENDING` | Link must target correct recommendation, decision, compliance review or export scope. |
| Evidence accepted | `EVIDENCE_SUFFICIENT` only for scoped gate | Sufficiency is contextual, not global. |
| Evidence stale / wrong scope | `EVIDENCE_INSUFFICIENT` | Gate remains blocked. |
| Client evidence summary | `EVIDENCE_CLIENT_SAFE_SUMMARY_ONLY` | Client sees only released/redacted summary. |

### 8.2 Evidence Sufficiency Criteria Table

| Evidence Object / Source | Required Condition | What It Proves | What It Does Not Prove | Release Impact | Export Impact | Audit Requirement | Downstream Routing |
|---|---|---|---|---|---|---|---|
| `Document` upload | File received, tenant/object scoped, permitted type/size | Upload mechanics / document intake | Evidence sufficiency, review, release readiness | No release unlock | No export unlock | Upload event should be auditable if connected to evidence | `API_CONTRACT_REQUIRED`; `P0_TEST_REQUIRED` |
| `DocumentVersion` | Version stored with storage key/checksum where available | Version traceability | Content correctness or sufficiency | No release unlock alone | Export may reference only approved version | Version creation audit expectation | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` if checksum/version semantics unclear |
| `DocumentExtraction` | Extraction reviewed, confidence issues addressed | Extracted metadata can support review | Human acceptance or compliance release | May support evidence review only | Export only if redacted and client-safe | Extraction review action audit | `API_CONTRACT_REQUIRED`; `P0_TEST_REQUIRED` |
| `DocumentReview` | Reviewer, status, notes/summary and review timestamp present | Human review occurred | Compliance release or client visibility | May move evidence toward sufficiency | Export allowed only via client-safe summary | Review audit required | `SCHEMA_FIELD_RECONCILIATION_REQUIRED`; `P0_TEST_REQUIRED` |
| `DocumentLink` | Correct target type and target ID link | Evidence is associated to object/decision/recommendation | Relevance or sufficiency by itself | Gate may still require review | Export scope must respect link | Link/create/update audit where gate-relevant | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `EvidenceRecord` | Related object, status, visibility status, summary and retention policy assessed | Evidence container exists and can be evaluated | Sufficiency without review/context | Required for release if evidence-dependent | Export only if approved/redacted | Evidence status changes require audit | `API_CONTRACT_REQUIRED`; `P0_TEST_REQUIRED` |
| `EvidenceItem` | Source object and visibility status set | Evidence item can be referenced | Client visibility or sufficiency alone | Must inherit record status | Export only if item is client-safe | Item link/visibility audit expected | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `ComplianceReview` evidence request | Block/request-evidence reason is captured | Compliance requested more evidence | Future approval or release | Release blocked | Export blocked or limited | Audit required | `API_CONTRACT_REQUIRED`; `P0_TEST_REQUIRED` |
| Client-uploaded evidence | User-supplied document is received | Client provided input | Internal review or sufficiency | Release blocked until review | Export blocked until reviewed/redacted | Upload and review audit expected | `P0_TEST_REQUIRED` |
| Evidence shown on client route | Released/redacted summary only | Client-safe evidence communication | Internal source detail | No gate effect | Client-safe export only | Visibility decision audit where relevant | `RBAC visibility inherited`; `P0_TEST_REQUIRED` |

### 8.3 Evidence-to-Release Boundary

A release or export path may reference evidence only when the evidence is:

1. tenant/object scoped,
2. linked to the correct decision/recommendation/compliance review/export request,
3. reviewed by an authorized actor,
4. sufficient for the specific gate,
5. not stale or contradictory,
6. visibility-classified, and
7. audit-covered for status-changing actions.

If any condition is unproven, the state is `EVIDENCE_INSUFFICIENT`, `NEEDS_EVIDENCE`, `EVIDENCE_REVIEW_PENDING` or `EVIDENCE_VERIFICATION_PENDING`, and release/export remains blocked or pending.

### 8.4 Evidence Negative Test Expectations

| Negative Case | Expected Result | Routed To |
|---|---|---|
| Upload succeeds and user attempts release immediately | Release blocked; feedback says upload is not sufficiency | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Document exists but is unreviewed | Release/export blocked | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Evidence belongs to another tenant/object | Access denied / hidden / excluded | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Client tries to view internal evidence detail | Payload hidden/redacted | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Admin tries to mark evidence sufficient without required review | Denied or pending second confirmation / policy block | `P0_TEST_ACCEPTANCE_MATRIX.md` |

## 9. Audit Persistence Contract

### 9.1 Audit Principles

Audit is a safety spine. It is not a visual decoration. An audit timeline or status row is accepted only as display; it does not prove persistence unless the action is mapped to an `AuditEvent` creation path, an API/service contract and later P0 proof.

Audit events are required for safety-sensitive action classes:

* role, permission and access changes
* second confirmation actions
* document upload / version creation where gate-relevant
* evidence link/review/status changes
* advisor approval / escalation / revision request
* compliance release / block / request evidence
* decision submission / decision confirmation
* export create / scope / redaction / preview / approval / generation / download / share
* client visibility release or visibility-relevant payload decision
* admin attempts to override gates

### 9.2 Minimum Audit Event Content

| Field | Required Meaning |
|---|---|
| Actor | User or service account initiating action |
| Actor role | Role context used for permission decision |
| Platform / client tenant | Tenant scope |
| Target type | Object type affected |
| Target ID | Object identifier |
| Event type | Action category |
| Previous state | Prior workflow / evidence / export / permission state when applicable |
| Next state | Resulting state when applicable |
| Result | Allowed, denied, failed, pending, blocked |
| Reason / context | User reason, validation failure, policy reason or gate condition |
| Timestamp | Event time |
| Correlation / request context | Required later if API contract supports it |

If the target schema lacks a required field or relation, mark: `SCHEMA_FIELD_RECONCILIATION_REQUIRED`.

### 9.3 Audit Event Coverage Table

| Action / Event | Route(s) | Actor / Role | Target Object | Required Audit Fields | Required Result Semantics | Fail-Closed Requirement | Test Expectation |
|---|---|---|---|---|---|---|---|
| Policy / advice-boundary review or change | 008 | Platform admin / compliance / governance | `PolicyDefinition` | actor, role, tenant, policy key/version, previous/next status, result | allowed/denied/failed | No silent policy enforcement change without audit | Admin bypass negative test |
| Role / permission change | 009, 048, 049, 050 | Governance admin / tenant admin | `Role`, `Permission`, `UserRole`, `AccessRequest` | actor, role, object, action, requester/reviewer, previous/next | allowed/denied/pending | No permission expansion without audit | Role expansion leakage test |
| Security / second confirmation action | 010, 049 | Security/governance admin | `SecondConfirmation`, policy or role target | actor, phrase/result, target, expiry, result | confirmed/denied/expired | Sensitive change blocked if confirmation/audit unavailable | Missing confirmation test |
| Document upload | 028 | Client / family CFO / external advisor / internal actor | `Document`, `DocumentVersion` | actor, tenant, document ID, version, status, result | uploaded/failed/rejected | Upload must not unlock release | Upload-does-not-release test |
| Extraction review finalize | 029 | Analyst | `DocumentExtraction`, `DocumentReview` | actor, document, extraction status, review result | reviewed/failed/pending | Low-confidence data cannot silently become sufficient | Low-confidence negative test |
| Verification pending update | 030 | Analyst / compliance | `DocumentReview`, `EvidenceRecord` | actor, target, previous/next status | pending/verified/rejected | Release blocked while pending | Pending verification release-block test |
| Advisor approval | 036, 037 | Senior wealth advisor | `Recommendation`, `Approval` | actor, role, recommendation, previous/next status, notes/reason | approved/escalated/denied | Approval does not release to client | Advisor-not-release test |
| Compliance review | 038, 039 | Compliance officer | `ComplianceReview`, `Recommendation` | actor, reviewer role, target, classification, previous/next | review_pending/blocked/released | Release blocked unless all preconditions pass | Compliance precondition negative test |
| Compliance release | 040 | Compliance officer | `ComplianceReview`, `Decision`, `Recommendation` | actor, target, evidence status, visibility state, previous/next | released/denied/failed | If audit write unavailable, release remains pending/blocked | Audit-failure release test |
| Compliance block / request evidence | 041 | Compliance officer | `ComplianceReview`, `EvidenceRecord` | actor, reason, requested evidence, previous/next | blocked/needs_evidence | Client visibility remains hidden | Request-evidence audit test |
| Audit log viewing | 042, 051 | Compliance / governance | `AuditEvent` | actor, route, filter/scope context | viewed/denied | Viewing is not persistence proof | Unauthorized audit access test |
| Decision submission | 044, 045 | Advisor / decision participant | `Decision` | actor, decision, action, reason, previous/next | submitted/failed/pending | Does not imply compliance release unless gate says so | Decision-not-release test |
| Evidence record status change | 046, 047 | Advisor / analyst / compliance | `EvidenceRecord`, `EvidenceItem` | actor, evidence ID, status, visibility, previous/next | sufficient/insufficient/pending | Missing evidence blocks dependent release/export | Evidence sufficiency negative test |
| Export creation | 054 | Advisor / compliance | `ExportRequest` | actor, export type, scope, approvalRequired, result | created/failed | No export package without scope | Export scope test |
| Export scope selection | 055 | Advisor / compliance | `ExportRequest` | actor, scopeJson, previous/next scope | scoped/failed | Scope cannot exceed role/object/client visibility | Overscope negative test |
| Export redaction | 056 | Advisor / compliance / privacy | `ExportRequest`, generated document | actor, redaction profile, hidden fields, result | redacted/failed | Export blocks if redaction incomplete | Redaction missing test |
| Export preview | 057 | Advisor / compliance | `ExportRequest` | actor, preview version, redaction status | previewed/failed | Preview is not approval/download | Preview-not-approval test |
| Export approval / download / share | 057, 058 | Compliance / authorized advisor | `ExportRequest`, generated `Document` | actor, approval, download/share result, redaction state | approved/downloaded/shared/failed | No download/share without approval, redaction and audit | Export leakage and bypass tests |

## 10. Export Safety Contract

### 10.1 Export Lifecycle

| Stage | Status | Contract Rule |
|---|---|---|
| Export create | `EXPORT_SCOPE_REQUIRED` | Export request may exist, but no safe package exists yet. |
| Scope selection | `EXPORT_SCOPE_REQUIRED` | Scope must be actor/object/client-visibility constrained. |
| Redaction | `EXPORT_REDACTION_REQUIRED` | Internal-only and unreleased content must be removed or replaced with safe placeholders. |
| Preview | `EXPORT_PREVIEW_NOT_APPROVAL` | Preview validates scope/redaction appearance only. |
| Approval | `EXPORT_APPROVAL_REQUIRED` | Approval allows generation/download only if all preconditions pass. |
| Download/share | `EXPORT_DOWNLOAD_NOT_CLIENT_ACCEPTANCE` | Download/share is an operational action, not advice execution or client acceptance. |
| Failure | `EXPORT_FAIL_CLOSED` | Any missing scope/redaction/approval/audit/visibility proof blocks export. |

### 10.2 Export Payload Classification Table

| Payload Category | Client Export Allowed? | Internal Export Allowed? | Redaction Required? | Approval Required? | Audit Required? | Forbidden Leakage Risk | Rule |
|---|---|---|---|---|---|---|---|
| Released decision summary | YES, if scoped and redacted | YES | Conditional | YES for client export | YES | Overstating advice execution | `CLIENT_SAFE_EXPORT_ONLY` |
| Client-safe evidence summary | YES, if released and redacted | YES | YES | YES | YES | Raw evidence leakage | `EVIDENCE_CLIENT_SAFE_SUMMARY_ONLY` |
| Raw uploaded document | NO by default for client export unless explicitly approved/redacted | YES, scoped | YES | YES | YES | Sensitive raw data leakage | `EXPORT_REDACTION_REQUIRED` |
| Document extraction fields | Only reviewed client-safe fields | YES | YES | YES | YES | Low-confidence/internal extracted data leakage | `EXPORT_REDACTION_REQUIRED` |
| AI Draft / rules draft | NO | YES, internal only | Not enough; must be excluded | N/A for client export | YES if attempted | Unapproved advice leakage | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| Internal rationale / analyst notes | NO | YES, internal only | Exclude from client export | N/A for client export | YES if attempted | Internal reasoning leakage | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| Compliance notes | NO | YES, compliance/internal only | Exclude from client export | N/A for client export | YES if attempted | Compliance work-product leakage | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| Unreleased recommendation | NO | YES, internal only | Exclude from client export | N/A for client export | YES if attempted | Unapproved advice leakage | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| Advisor approval record | Client-safe status only, not internal notes | YES | YES | YES | YES | Advisor approval mistaken for release | `ADVISOR_APPROVAL_NOT_RELEASE` |
| Compliance release record | YES, released status and safe explanation only | YES | YES | YES | YES | Compliance notes leakage | `COMPLIANCE_RELEASE_REQUIRED` |
| Audit timeline | Client-safe audit summary only if approved | YES | YES | YES | YES | Internal audit metadata leakage | `AUDIT_DISPLAY_ONLY_NOT_PROOF` |
| Governance / RBAC data | NO for client export | YES, governance scoped | YES | YES if exported | YES | Permission model leakage | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| KYC / AML / source-of-wealth held routes | NO in MVP | Internal only if later unlocked | YES | YES | YES | Held-route leakage | `HOLD_BLOCKED_NO_FINAL_CONTRACT` |
| Committee review content held routes | NO in MVP | Internal only if later unlocked | YES | YES | YES | Unresolved approval-chain leakage | `HOLD_BLOCKED_NO_FINAL_CONTRACT` |

### 10.3 Export Negative Test Expectations

| Negative Case | Expected Result | Routed To |
|---|---|---|
| Export includes AI Draft | Export blocked; payload excluded | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Export includes compliance notes | Export blocked or redacted out | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Export scope includes unrelated tenant/object | Export denied | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Export preview is treated as approval | Denied; preview remains preview-only | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Export download without approval | Download/share blocked | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Export redaction unavailable | Export fails closed | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Admin forces export bypass | Denied / audited / negative proof required | `P0_TEST_ACCEPTANCE_MATRIX.md` |

## 11. Full 71-Route Evidence / Audit / Export Relevance Matrix

| Route ID | Path | Scope Label | Component | Evidence Relevance | Audit Relevance | Export Relevance | Client-Safe Boundary | Required Contract Decision | Downstream API / Schema / Test Routing | Codex Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | `/login` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 002 | `/mfa` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 003 | `/onboarding/invite` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 004 | `/onboarding/identity` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 005 | `/onboarding/consent` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 006 | `/onboarding/role-confirmation` | `MVP_SUPPORT` | `AuthOnboardingScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 007 | `/admin/platform` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 008 | `/admin/policies/advice-boundary` | `MVP` | `AdminTenantSetupScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 009 | `/admin/roles` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 010 | `/admin/security` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 011 | `/admin/evidence-templates` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | EVIDENCE_CONTEXT_ONLY | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 012 | `/admin/export-templates` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | EXPORT_CRITICAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 013 | `/admin/tenants` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 014 | `/tenants/new` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 015 | `/tenants/:id/setup` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 016 | `/tenants/:id/team` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 017 | `/tenants/:id/policies` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 018 | `/tenants/:id/users` | `MVP_SUPPORT` | `AdminTenantSetupScreen` | MVP_SUPPORT_CONDITIONAL | AUDIT_CRITICAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 019 | `/portal` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CONTEXT_ONLY | CLIENT_SAFE_EXPORT_SURFACE | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Client-facing surface must fail closed to released/redacted/client-safe payload only. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 020 | `/mobile` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CONTEXT_ONLY | CLIENT_SAFE_EXPORT_SURFACE | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Client-facing surface must fail closed to released/redacted/client-safe payload only. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 021 | `/client/profile` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 022 | `/client/family-members` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 023 | `/relationships` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 024 | `/entities` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 025 | `/entities/new` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 026 | `/entities/:id` | `MVP_SUPPORT` | `ClientIntakeScreen` | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | P0_TEST_ACCEPTANCE_MATRIX.md if flow-relevant | `NOT_READY_FOR_CODEX` |
| 027 | `/documents` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CRITICAL | AUDIT_CONTEXT_ONLY | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 028 | `/documents/upload` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Upload mechanics recognized; upload-only success must not unlock sufficiency, release or export. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 029 | `/documents/extraction-review` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CRITICAL | AUDIT_CONTEXT_ONLY | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 030 | `/documents/verification-pending` | `MVP` | `ClientIntakeScreen` | EVIDENCE_CRITICAL | AUDIT_CONTEXT_ONLY | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 031 | `/wealth-map` | `MVP_SUPPORT` | `WealthActionsScreen` | EVIDENCE_CONTEXT_ONLY | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 032 | `/actions` | `MVP_SUPPORT` | `WealthActionsScreen` | EVIDENCE_CONTEXT_ONLY | MVP_SUPPORT_CONDITIONAL | MVP_SUPPORT_CONDITIONAL | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 033 | `/signals` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 034 | `/workbench` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CONTEXT_ONLY | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 035 | `/workbench/triggers/:id` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 036 | `/advisor-approval` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 037 | `/advisor-approval/:id` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 038 | `/compliance` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 039 | `/compliance/:id/review` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 040 | `/compliance/:id/release` | `MVP` | `InternalWorkflowScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Compliance gate action must require evidence state, audit mapping and fail-closed release/block semantics. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 041 | `/compliance/:id/block` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Compliance gate action must require evidence state, audit mapping and fail-closed release/block semantics. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 042 | `/compliance/:id/audit` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Compliance gate action must require evidence state, audit mapping and fail-closed release/block semantics. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 043 | `/decisions` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 044 | `/decisions/:id` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 045 | `/decisions/:id/success` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Contract-only safety routing; no implementation and no readiness overclaim. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 046 | `/evidence` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Evidence surface must distinguish internal evidence, client-safe summaries and sufficiency status. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 047 | `/evidence/:id` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CRITICAL | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Evidence surface must distinguish internal evidence, client-safe summaries and sufficiency status. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 048 | `/governance/users` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Governance action or audit history must not become admin bypass; audit expectations required. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 049 | `/governance/roles` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Governance action or audit history must not become admin bypass; audit expectations required. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 050 | `/governance/access-requests` | `MVP` | `DecisionsGovernanceScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CONTEXT_ONLY | NO_CLIENT_EXPORT_BY_DEFAULT | Governance action or audit history must not become admin bypass; audit expectations required. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 051 | `/governance/audit-history` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | NO_CLIENT_EXPORT_BY_DEFAULT | Governance action or audit history must not become admin bypass; audit expectations required. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 052 | `/communication` | `P1_AFTER_MVP` | `CommunicationExportOpsScreen` | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1 deferred; carry safety implications forward, no MVP implementation contract. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 053 | `/communication/call-trigger` | `P1_AFTER_MVP` | `CommunicationExportOpsScreen` | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1 deferred; carry safety implications forward, no MVP implementation contract. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 054 | `/export/new` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Export path must be scoped, approved, redacted, audited and client-safe. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 055 | `/export/:id/scope` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Export path must be scoped, approved, redacted, audited and client-safe. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 056 | `/export/:id/redaction` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Export path must be scoped, approved, redacted, audited and client-safe. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 057 | `/export/:id/preview` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Export path must be scoped, approved, redacted, audited and client-safe. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 058 | `/export/:id/download` | `MVP` | `CommunicationExportOpsScreen` | EVIDENCE_CONTEXT_ONLY | AUDIT_CRITICAL | EXPORT_CRITICAL | CLIENT_SAFE_RELEASED_ONLY; FAIL_CLOSED_HIDDEN | Export path must be scoped, approved, redacted, audited and client-safe. | API_CONTRACT_MATRIX.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; P0_TEST_ACCEPTANCE_MATRIX.md | `NOT_READY_FOR_CODEX` |
| 059 | `/ops/queues` | `P1_AFTER_MVP` | `CommunicationExportOpsScreen` | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1 deferred; carry safety implications forward, no MVP implementation contract. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 060 | `/ops/sla` | `P1_AFTER_MVP` | `CommunicationExportOpsScreen` | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1 deferred; carry safety implications forward, no MVP implementation contract. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 061 | `/service-blueprint` | `REFERENCE_ONLY` | `CommunicationExportOpsScreen` | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | Reference page only; no product evidence/audit/export contract finalization. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 062 | `/roadmap` | `REFERENCE_ONLY` | `CommunicationExportOpsScreen` | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | Reference page only; no product evidence/audit/export contract finalization. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 063 | `/states` | `REFERENCE_ONLY` | `CommunicationExportOpsScreen` | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | REFERENCE_ONLY_NO_PRODUCT_CONTRACT | Reference page only; no product evidence/audit/export contract finalization. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 064 | `/kyc/:id/review` | `HOLD_PENDING_DECISION` | `KycAmlWorkflowScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 065 | `/kyc/:id/source-of-wealth` | `HOLD_PENDING_DECISION` | `KycAmlWorkflowScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 066 | `/suitability/:tenantId/profile` | `HOLD_PENDING_DECISION` | `SuitabilityIpsScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 067 | `/ips/:tenantId` | `HOLD_PENDING_DECISION` | `SuitabilityIpsScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 068 | `/reviews/calendar` | `P1_AFTER_MVP` | `ReviewMonitoringScreen` | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1_DEFERRED | P1 deferred; carry safety implications forward, no MVP implementation contract. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 069 | `/monitoring/rebalance` | `HOLD_PENDING_DECISION` | `ReviewMonitoringScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 070 | `/committee/reviews` | `HOLD_PENDING_DECISION` | `CommitteeReviewScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |
| 071 | `/committee/reviews/:id` | `HOLD_PENDING_DECISION` | `CommitteeReviewScreen` | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | HOLD_BLOCKED_NO_FINAL_CONTRACT | Hold-blocked; no final evidence/audit/export contract until scope/visual/safety unlock. | Carry as blocker/deferred/exclusion | `NOT_READY_FOR_CODEX` |

## 12. Critical Flow Contract Matrix

| Flow | Route(s) | Current Reality | Evidence Contract | Audit Contract | Export Contract | Downstream Routing | Codex Status |
|---|---|---|---|---|---|---|---|
| Document upload | 028 | Upload mechanics are implemented, but safety proof remains open | `UPLOAD_ONLY_NOT_SUFFICIENCY`; no release/export unlock | Upload and version creation should be audit-mapped | No export unlock | API, schema and P0 tests | `NOT_READY_FOR_CODEX` |
| Document review / extraction review | 029 | Partial demo action / review surface | `EVIDENCE_REVIEW_PENDING` until accepted | Review/finalize requires audit mapping | Only reviewed/redacted fields may later export | API, schema and P0 tests | `NOT_READY_FOR_CODEX` |
| Verification pending | 030 | Deterministic visual/status state | `EVIDENCE_VERIFICATION_PENDING` | State changes require audit | Export blocked while pending | API and P0 tests | `NOT_READY_FOR_CODEX` |
| Advisor approval with evidence dependency | 036, 037 | Partial actions; approval does not release | Evidence must support recommendation but may still be insufficient for release | Approval/escalation audit required | No client export merely from advisor approval | API/schema/P0; RBAC inherited | `NOT_READY_FOR_CODEX` |
| Compliance review | 038, 039 | Static/partial review actions | Evidence sufficiency must be checked before release | Review/block/request evidence audit required | Export remains blocked unless release/redaction path passes | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Compliance release | 040 | Release confirmation visual/partial action | Release blocked if evidence insufficient | Release audit persistence required; audit unavailable fails closed | Enables client visibility/export only after redaction/scope rules | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Compliance block / request evidence | 041 | Block/request evidence flow | Sets `NEEDS_EVIDENCE`; release/export blocked | Block/request audit required | Export blocked or limited | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Compliance audit view | 042 | Audit surface | Evidence/audit context only | Display is not persistence proof | No export by itself | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Decision record | 043, 044, 045 | Decision route surfaces exist; submission not release by itself | Decision must link evidence if evidence-dependent | Decision action audit required | Export only after client-safe release/redaction | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Evidence vault / detail | 046, 047 | Evidence surfaces exist | Evidence sufficiency contextual and status-driven | Status/link/view audit required where gate-relevant | Client-safe summaries only | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Governance audit history | 051 | Audit history surface exists | Evidence context only | Audit display not persistence proof; RBAC required | No client export by default | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Export create | 054 | Export route exists | Evidence must be scoped if included | Export request creation audit required | `EXPORT_SCOPE_REQUIRED` | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Export scope | 055 | Scope route exists | Evidence links define allowable scope | Scope change audit required | Scope cannot exceed visibility/permission | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Export redaction | 056 | Redaction route exists | Evidence summaries only if redacted | Redaction audit required | `EXPORT_REDACTION_REQUIRED`; forbidden payload excluded | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Export preview | 057 | Preview route exists | Preview may show redacted package | Preview audit may be required | `EXPORT_PREVIEW_NOT_APPROVAL` | API/schema/P0 | `NOT_READY_FOR_CODEX` |
| Export approval / download / share | 057, 058 | Download/share surface exists | Export requires evidence-safe package | Approval/download/share audit required | `CLIENT_SAFE_EXPORT_ONLY`; no client acceptance implication | API/schema/P0 | `NOT_READY_FOR_CODEX` |

## 13. Data / Schema Reconciliation Routing

The full-workflow schema remains the baseline. This artefact uses schema concepts for contract language only and does not change schema.

### 13.1 Current Schema Concepts Used

| Schema Concept | Contract Use | Open Reconciliation Question | Routing |
|---|---|---|---|
| `Document` | Uploaded document and export-generated document source | Whether status fields fully represent review/sufficiency states | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `DocumentVersion` | Version traceability and export version selection | Whether checksum/storage/version constraints are sufficient | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `DocumentExtraction` | Extracted fields and confidence review | Which fields are client-visible and redacted | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `DocumentReview` | Human document review | Whether review type/status maps to evidence sufficiency | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `DocumentLink` | Links document to target object | Relation completeness for decision/recommendation/export scope | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `EvidenceRecord` | Evidence container and sufficiency candidate | Sufficiency as status vs separate evaluation model | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `EvidenceItem` | Evidence item/source link | Visibility inheritance and client-safe summary fields | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `AuditEvent` | Audit persistence model | Minimum fields, immutability and failure semantics | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `ExportRequest` | Export scope/status/redaction/approval | Approval, generated document and redaction profile completeness | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `Decision` | Decision record / released state | Relationship to compliance release and exportable client-safe payload | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `Recommendation` | Draft/advice object | AI Draft/internal summary/client summary separation | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `Approval` | Advisor/participant/committee approval | Advisor approval versus compliance release separation | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `ComplianceReview` | Release/block/evidence request gate | Required preconditions and audit mapping | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |
| `AccessRequest`, `SecondConfirmation`, `PolicyDefinition` | Admin/governance non-bypass and policy controls | Sensitive admin actions and audit/confirmation requirements | `SCHEMA_FIELD_RECONCILIATION_REQUIRED` |

### 13.2 No Blind Schema Replacement

The MVP patch/control spec may define evidence sufficiency, audit and export concepts, but it does not replace the full-workflow schema. Any mismatch is a reconciliation item, not a schema edit in this artefact.

## 14. API Contract Routing

The current target codebase has four API routes:

* `/api/demo-workflow`
* `/api/documents`
* `/api/documents/upload`
* `/api/review-monitoring`

This artefact does not create or modify APIs. It routes expected behaviour to `API_CONTRACT_MATRIX.md`.

| API Route | Current Use in Contract | Required Future Contract | Open Risk |
|---|---|---|---|
| `/api/documents/upload` | Upload mechanics, document/document-version creation, upload success/error | Validate permission, file type/size, tenant/object scope, audit expectation and upload-only success | Upload might be mistaken for sufficiency |
| `/api/documents` | Document listing / retrieval | Enforce tenant/object RBAC, visibility, redaction and evidence state filtering | Row visibility leakage |
| `/api/demo-workflow` | Demo workflow transitions | Distinguish demo mutation from production persistence; map audit/evidence/export expectations | Demo action overclaim |
| `/api/review-monitoring` | Review rhythm / monitoring support | Keep P1/hold status unless elevated; avoid advice execution implications | Advice execution leakage |

If export safety requires runtime API behaviour that is not represented by these existing routes, mark it as `API_CONTRACT_REQUIRED`; do not invent implementation here.

## 15. P0 Test Implications

### 15.1 Positive Proof Expectations

| Proof Area | Required Positive Proof Later |
|---|---|
| Upload | Valid upload stores permitted file and reports upload-only success. |
| Evidence review | Reviewed evidence can be marked sufficient only for correct scoped gate. |
| Compliance release | Release succeeds only after advisor approval, evidence requirements, compliance preconditions, visibility and audit expectations pass. |
| Audit | Critical actions create audit events with actor, role, target, result and state transition fields. |
| Export scope | Export contains only selected, authorized and scoped objects. |
| Export redaction | Internal-only fields are excluded or redacted. |
| Export approval/download | Approved export can be downloaded/shared only after scope, redaction and audit pass. |

### 15.2 Negative Proof Expectations

| Negative Proof | Expected Result | Rule |
|---|---|---|
| Upload then release without review | Release blocked | `UPLOAD_ONLY_NOT_SUFFICIENCY` |
| Unreviewed evidence included in export | Export blocked or evidence excluded | `EVIDENCE_REVIEW_PENDING` |
| Client sees AI Draft | Payload hidden / test fails if exposed | `AI_DRAFT_INTERNAL_ONLY` inherited |
| Client export contains internal rationale | Export blocked / field excluded | `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` |
| Admin marks evidence sufficient without gate | Denied / audited / pending | `ADMIN_NON_BYPASS_REQUIRED` inherited |
| Audit write unavailable during release | Release pending/blocked | `AUDIT_UNAVAILABLE_FAIL_CLOSED` |
| Export preview treated as approval | Download blocked | `EXPORT_PREVIEW_NOT_APPROVAL` |
| Export without redaction | Export blocked | `EXPORT_REDACTION_REQUIRED` |
| Export without approval | Download/share blocked | `EXPORT_APPROVAL_REQUIRED` |
| Cross-tenant document/evidence/export access | Denied/hidden | `RBAC_OBJECT_SCOPED` inherited |

All proof expectations route to `P0_TEST_ACCEPTANCE_MATRIX.md`. No tests are written here.

## 16. Blockers and Downstream Dependencies

| Dependency | Why It Remains Open | Required Downstream Artefact |
|---|---|---|
| API request/response/validation/permission/audit/redaction contracts | Existing API route presence does not prove safety behaviour | `API_CONTRACT_MATRIX.md` |
| Field-level evidence/audit/export schema semantics | Full schema exists, but sufficiency/redaction/evaluation details require field-level mapping | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` |
| P0 positive/negative proof | Existing tests are proof slices only | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Hold routes 064–067 and 069–071 | Scope/visual/safety still unresolved | Later scope/safety unlock only |
| P1 route 068 | Review calendar is P1 after MVP | No MVP implementation contract here |
| Codex implementation tasks | Contracts and tests not complete | `FINAL_CODEX_TASK_MASTER.md` later |
| Final implementation handoff | Codex would still need to infer API/schema/test decisions | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` only at position 15 |

## 17. Stop Rules

* No implementation.
* No code changes.
* No API changes.
* No API invention.
* No Prisma changes.
* No schema replacement.
* No migrations.
* No tests written.
* No Codex tasks.
* No final Codex handoff.
* No screen generation.
* No state-screen generation.
* No image generation.
* No target truth from `main`.
* No upload-to-release shortcut.
* No treating audit display as audit persistence.
* No treating export preview as approval.
* No treating export approval as download/share.
* No client-visible AI Draft, internal rationale, compliance notes or unreleased evidence.
* No admin bypass of evidence, audit, export, visibility, advice or release gates.
* No Codex start.

## 18. Acceptance Criteria

| Criterion | Status |
|---|---|
| Roadmap position 9 validated | PASS |
| All eight predecessor artefacts listed and used | PASS |
| `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` inherited, not overwritten | PASS |
| All 71 routes appear exactly once in the route matrix | PASS |
| Evidence sufficiency separated from upload success | PASS |
| Audit display separated from audit persistence | PASS |
| Export preview, approval and download/share separated | PASS |
| Client-safe export payload rules explicit | PASS |
| Forbidden export payloads explicit | PASS |
| Admin non-bypass preserved | PASS |
| API gaps routed to `API_CONTRACT_MATRIX.md` | PASS |
| Schema field gaps routed to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | PASS |
| Test implications routed to `P0_TEST_ACCEPTANCE_MATRIX.md` | PASS |
| No implementation or Codex task created | PASS |
| Codex readiness remains `CODEX_HANDOFF_NOT_READY` | PASS |
| ENGINE proof included | PASS |

## 19. ENGINE Proof

### ENGINE_v3 Standard — Phase Proof

| Phase | Proof |
|---|---|
| Charter | Target artefact locked as `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md`, position 9 of 15. |
| Evidence | Applied roadmap v0.8, KB layers v0.7–v0.2, Control Spec, full-workflow baseline and all predecessor artefacts through position 8. |
| Framing | Framed artefact as contract-only safety layer between RBAC/client-visibility/advice-boundary and API/schema/test artefacts. |
| Divergence | Considered evidence, audit and export as separate domains, then combined them around fail-closed safety. |
| Contradictions | Preserved contradictions: upload exists but sufficiency unproven; audit UI exists but persistence unproven; export routes exist but safe redaction unproven. |
| Branch Build | Built evidence lifecycle, audit coverage, export payload, 71-route relevance and downstream routing branches. |
| Debate | Rejected readiness overclaims from files, schemas, routes, tests, visual states, status chips and demo actions. |
| Adversarial | Added explicit forbidden assumptions for upload-to-release, audit-display overclaim, export leakage, admin bypass, schema replacement and `main` contamination. |
| Convergence | Converged on a contract artefact with safety vocabulary, required matrices, stop rules and acceptance criteria. |
| Proof | Included route-complete matrix and downstream routing to API/schema/P0 artefacts. |
| Learning | Preserved later sequencing: API contract, schema field reconciliation and P0 test matrix must follow before Codex. |

### ENGINE_v2 Proof

| Method | Application |
|---|---|
| Map-vs-Reality | Separated product/control intent, code presence, visual proof, interaction proof and test proof. |
| Reframing | Reframed evidence/audit/export from “features exist” into “safety contracts are required before implementation.” |
| Psycho-Logic | Protected trust-critical investor/client expectations: no fake evidence proof, no hidden audit gap, no unsafe export, no admin bypass. |
| Dependency Thinking | Locked predecessor dependencies and routed unresolved work to API, schema and P0 test artefacts. |
| Decision Logic | Classified all 71 routes without re-opening MVP or route scope. |

### ENGINE_v2-B Implementation Handoff Discipline Proof

| Discipline | Proof |
|---|---|
| File specificity | Exact target, predecessor and successor artefacts named. |
| Codebase discipline | `full-workflow` remains target; `main` remains false-gap only. |
| Boundary discipline | No implementation, code, API, Prisma, tests, screen generation, Codex tasks or final handoff. |
| Future Codex compatibility | Contract matrices prepare later API/schema/test/task artefacts without turning into tasks. |
| Safety carry-forward | RBAC/client visibility/advice boundary inherited and extended into evidence/audit/export. |

### ENGINE_v2 Compression / Operational Layer Proof

| Compression Rule | Proof |
|---|---|
| Portable artefact | The artefact is a standalone Markdown contract. |
| No leakage into later tasks | API, schema and tests are routed but not solved early. |
| Compact completeness | Required rules, matrices, vocabulary, blockers and acceptance criteria are included. |
| Sequence safe | Position 9 is validated and Codex remains blocked. |
