# STATE_SCREEN_SPEC.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Artefact status:** `STATE_SCREEN_SPEC_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact specifies route-level and flow-level state-screen behaviour for AlphaVest WealthOS. It converts the predecessor `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` into a route-complete state specification while preserving the scope, route, visual, interaction and safety boundaries already locked in the roadmap sequence.

This is a specification artefact only. It does not implement, generate screens, generate state-screen images, create visual assets, change code, change routes, create tests, change APIs, change Prisma, create migrations, create Codex tasks or prepare a final Codex handoff.

**Core decision:** the 31 `MVP` routes receive explicit state-screen requirements; the 25 `MVP_SUPPORT` routes receive conditional state requirements only where flow-relevant; the 5 `P1_AFTER_MVP` routes are deferred; routes `061–063` remain `REFERENCE_ONLY`; routes `064–067` and `069–071` remain `HOLD_PENDING_DECISION`. Routes `064–071` are registered routes, not absent routes, and no state-screen generation is authorized here.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
|---|---|---|
| Artefact | `STATE_SCREEN_SPEC.md` | PASS |
| Position | 5 of 15 | PASS |
| Required predecessor 1 | `MVP_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 2 | `ROUTE_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 3 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | PASS — exists and used |
| Required predecessor 4 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | PASS — exists and used |
| Direct predecessor | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | PASS |
| Direct successor | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | PREPARED_ONLY |
| Codex status | `CODEX_HANDOFF_NOT_READY` | BLOCKED |
| Generation status | Screen/state-screen/image generation | BLOCKED |

## 3. Source-of-Truth Lock

| Rank | Source | Role | Use Allowed | Use Forbidden |
|---:|---|---|---|---|
| 1 | `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Sequence, gates, dependencies, stop rules, Codex readiness | Bypassing sequence or starting Codex |
| 2 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Binding direct predecessor | State-screen workset, P1 deferrals, reference exclusions, hold blockers | Reclassifying missing screens or authorizing generation |
| 3 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Binding predecessor | Route/screen/component/visual status | Treating visual asset as behaviour proof |
| 4 | `ROUTE_SCOPE_LOCK.md` | Binding predecessor | All 71 route scope labels | Inventing conflicting route scope |
| 5 | `MVP_SCOPE_LOCK.md` | Binding predecessor | MVP product boundary and P0 safety scope | Inventing conflicting MVP scope |
| 6 | `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB layer | Full-workflow schema baseline and patch/domain control input | Treating schema gate as passed or replacing schema |
| 7 | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction reality layer | Real/partial/deterministic/static interaction distinctions | Treating visible UI as lifecycle proof |
| 8 | `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual/state layer | 71 routes, 63 clean PNGs, unresolved `064–071` | Generating screens or assuming 63 PNGs cover 71 routes |
| 9 | `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness layer | Codex-not-ready and open readiness gates | Overclaiming file presence as readiness |
| 10 | `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap cleanup | Blocks `main` absence claims | Target gaps or tasks from `main` |
| 11 | `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Code inventory | 405 files, 71 routes, 4 APIs, 42 models, 10 specs, 63 PNGs | Treating inventory as MVP proof |
| 12 | `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | Recovery/versioning protocol | Versioning and source hierarchy | Letting v0.1 override newer layers |
| 13 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP Control Spec | Advice boundary, RBAC, visibility, workflow, acceptance gates | Replacing full-workflow code/schema |
| 14 | `local repository checkout / pull of target branch full-workflow` | Primary target codebase | Target file/route/component/API/Prisma/test/asset reality | Assuming all present code is ready |
| 15 | `main branch as false-gap / historical only; never target truth` | False-gap source only | Historical comparison only | Any target truth or Codex task |

## 4. Binding Predecessor Decisions

### 4.1 MVP Scope Lock

AlphaVest MVP is a controlled, human-backed, evidence-backed Family Office workflow platform. MVP core includes internal draft preparation, analyst/advisor review, advisor approval, compliance review/release/block, client visibility, decision records, evidence/document intake, audit trail, RBAC/governance baseline and safe export/redaction. Autonomous advice, client-visible AI draft, manual client-visibility override, admin bypass, upload-to-release shortcut, production banking/custody integration and real client pilot remain excluded.

### 4.2 Route Scope Lock

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

### 4.3 Missing Screen / State-Screen Decision Log

* Routes `001–063` are visually covered at full-screen level, but visual coverage is not behaviour proof.
* The 31 MVP routes require state-screen specification.
* The 25 MVP_SUPPORT routes require conditional state-screen consideration only where flow-relevant.
* P1 routes `052`, `053`, `059`, `060`, `068` are deferred from MVP state-screen generation.
* Reference-only routes `061`, `062`, `063` do not require product state screens.
* Hold routes `064`, `065`, `066`, `067`, `069`, `070`, `071` are blocked from state-screen generation and implementation decisions.
* Routes `064–071` are registered routes with missing/non-public visual references; they are not absent routes and are not generation-authorized routes.

## 5. State-Screen Specification Method

| Rule | Application |
|---|---|
| Route scope controls state depth | `MVP` routes receive full state specification; `MVP_SUPPORT` routes receive conditional state treatment; P1/reference/hold routes are deferred, excluded or blocked. |
| Visual coverage is not state proof | Matched PNGs for `001–063` remain visual references only. |
| Interaction proof is not inferred | Drawer/modal/button/status visibility is not treated as lifecycle, mutation, gate or persistence proof. |
| Safety states fail closed | Client-facing, advice, export, evidence and governance states default to hidden, denied, blocked or redacted when required proof is incomplete. |
| Upload success is limited | Upload success means file transfer succeeded only; it does not mean evidence sufficiency or release readiness. |
| Advisor approval is not release | Advisor approval states remain distinct from compliance release states. |
| No generation | State-screen requirements are specified, not visualized or implemented. |

## 6. State Taxonomy

| State Label | Meaning |
|---|---|
| `LOADING_STATE` | Data/action is in progress. |
| `ERROR_STATE` | Recoverable or blocking failure. |
| `EMPTY_STATE` | No records, no queue items, no data or zero-state. |
| `PERMISSION_DENIED_STATE` | User/role/action/payload access denied. |
| `BLOCKED_STATE` | Workflow cannot proceed because a gate is blocked. |
| `NEEDS_EVIDENCE_STATE` | More evidence or review is required. |
| `RELEASE_PENDING_STATE` | Release is waiting on approval/compliance/evidence conditions. |
| `APPROVAL_PENDING_STATE` | Advisor, compliance, participant or approval action pending. |
| `VALIDATION_FAILED_STATE` | User input, required field, confirmation phrase or precondition failed. |
| `SUCCESS_STATE` | Action completed successfully. |
| `RETRY_STATE` | User can retry after a failure. |
| `REDACTED_INTERNAL_ONLY_STATE` | Data is hidden, redacted or internal-only. |
| `CLIENT_VISIBILITY_HIDDEN_STATE` | Client-facing route has no released client-safe content. |
| `EXPORT_PENDING_STATE` | Export scope, approval, generation, download or redaction is pending. |
| `AUDIT_UNAVAILABLE_STATE` | Audit log or audit persistence cannot be displayed or confirmed. |
| `DISABLED_GATED_ACTION_STATE` | Action is visible but disabled because preconditions are missing. |
| `UPLOAD_IN_PROGRESS_STATE` | Upload is running. |
| `UPLOAD_FAILED_STATE` | Upload failed. |
| `UPLOAD_SUCCESS_STATE` | Upload succeeded, without proving evidence sufficiency. |
| `COMPLIANCE_BLOCKED_STATE` | Compliance blocks release or requests evidence. |
| `DECISION_SUBMITTED_STATE` | Decision submission completed or confirmation screen displayed. |
| `HOLD_BLOCKED_STATE` | Route is held and may not receive state generation or implementation decision. |
| `P1_DEFERRED_STATE` | Route is P1 and deferred from MVP state-screen work. |
| `REFERENCE_ONLY_NO_PRODUCT_STATE` | Route is reference-only and does not need product state screens. |

## 7. State-Screen Decision Summary

| Decision Category | Count | Route IDs | State-Screen Decision |
|---|---:|---|---|
| MVP routes with required state-screen spec | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 | Full route-level state specification required. |
| MVP_SUPPORT routes with conditional state-screen spec | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 | Conditional state specification only where flow-relevant. |
| P1 routes deferred | 5 | 052, 053, 059, 060, 068 | No MVP state-screen generation or implementation decision. |
| Reference-only routes excluded | 3 | 061, 062, 063 | No product state-screen requirement. |
| Hold routes blocked | 7 | 064, 065, 066, 067, 069, 070, 071 | State-screen decision blocked until scope/safety/visual unlock. |
| Registered routes with missing/non-public visual references | 8 | 064, 065, 066, 067, 068, 069, 070, 071 | Registered route remains; no generation authorized here. |
| Codex-ready routes | 0 | — | Codex remains blocked. |

## 8. MVP Route State-Screen Specification

| Route ID | Path | Component | MVP Reason | Required States | Safety Relevance | State Behaviour Intent | Recovery / Next Action | Downstream Contracts | Generation Decision |
|---|---|---|---|---|---|---|---|---|---|
| 008 | /admin/policies/advice-boundary | `AdminTenantSetupScreen` | Advice Boundary Policy is scoped `MVP` for Platform / Admin proof path. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | RBAC/AUDIT; CLIENT_VISIBILITY | Policy state must show whether advice-boundary rules are loaded, unavailable, permission-blocked or awaiting validation. It must never imply that policy display alone proves enforcement. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 019 | /portal | `ClientIntakeScreen` | Client Web Dashboard is scoped `MVP` for Client Workspace proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, RETRY_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | CLIENT_VISIBILITY | Client-facing state must fail closed: unreleased, internal-only or redacted data is hidden; the user sees only released client-safe content or a clear no-available-content state. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 020 | /mobile | `ClientIntakeScreen` | Mobile Home is scoped `MVP` for Client Workspace proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, RETRY_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | CLIENT_VISIBILITY | Client-facing state must fail closed: unreleased, internal-only or redacted data is hidden; the user sees only released client-safe content or a clear no-available-content state. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 027 | /documents | `ClientIntakeScreen` | Documents List is scoped `MVP` for Client Workspace proof path. | NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE | Document/evidence state must distinguish no documents, loading documents, review pending, needs evidence, denied access and unavailable evidence/audit context. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 028 | /documents/upload | `ClientIntakeScreen` | Document Upload is scoped `MVP` for Client Workspace proof path. | UPLOAD_IN_PROGRESS_STATE, UPLOAD_FAILED_STATE, UPLOAD_SUCCESS_STATE, NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE; AUDIT | Upload state must distinguish in-progress, failed and successful upload, while explicitly stating that upload success does not prove evidence sufficiency or unlock release. | Allow retry or reselect file after failure; show success as upload-only and route evidence sufficiency to later safety contract. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 029 | /documents/extraction-review | `ClientIntakeScreen` | Extraction Review is scoped `MVP` for Client Workspace proof path. | NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE | Document/evidence state must distinguish no documents, loading documents, review pending, needs evidence, denied access and unavailable evidence/audit context. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 030 | /documents/verification-pending | `ClientIntakeScreen` | Verification Pending is scoped `MVP` for Client Workspace proof path. | NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE | Document/evidence state must distinguish no documents, loading documents, review pending, needs evidence, denied access and unavailable evidence/audit context. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 033 | /signals | `InternalWorkflowScreen` | Signal Review is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY | Internal workflow state must keep draft/review content internal, show approval/release blockers and prevent any client-visible implication before gate completion. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 034 | /workbench | `InternalWorkflowScreen` | Consultant Workbench is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY | Internal workflow state must keep draft/review content internal, show approval/release blockers and prevent any client-visible implication before gate completion. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 035 | /workbench/triggers/:id | `InternalWorkflowScreen` | Trigger Detail is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY | Internal workflow state must keep draft/review content internal, show approval/release blockers and prevent any client-visible implication before gate completion. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 036 | /advisor-approval | `InternalWorkflowScreen` | Advisor Approval Queue is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; AUDIT | Advisor approval state must distinguish advisor pending/approved/revision blocked states from compliance release; advisor approval is not client release. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 037 | /advisor-approval/:id | `InternalWorkflowScreen` | Advisor Approval Detail is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | Advisor approval state must distinguish advisor pending/approved/revision blocked states from compliance release; advisor approval is not client release. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 038 | /compliance | `InternalWorkflowScreen` | Compliance Queue is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY | Compliance state must show review pending, release pending, blocked, needs-evidence and permission denied conditions before any client release can be represented. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 039 | /compliance/:id/review | `InternalWorkflowScreen` | Compliance Review Detail is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY | Compliance state must show review pending, release pending, blocked, needs-evidence and permission denied conditions before any client release can be represented. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 040 | /compliance/:id/release | `InternalWorkflowScreen` | Release to Client is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | Compliance state must show review pending, release pending, blocked, needs-evidence and permission denied conditions before any client release can be represented. | Allow cancel/back/request-evidence path; release must remain blocked until compliance and safety conditions pass. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 041 | /compliance/:id/block | `DecisionsGovernanceScreen` | Block or Request Evidence is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | Block/request-evidence state must make the blocked reason and evidence requirement visible without treating the request as release or approval. | Allow cancel/back/request-evidence path; release must remain blocked until compliance and safety conditions pass. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 042 | /compliance/:id/audit | `DecisionsGovernanceScreen` | Audit and Exception Log is scoped `MVP` for Advisory Workflow proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | AUDIT | Audit state must show audit loading, unavailable, denied or incomplete proof conditions; visible audit rows are not persistence proof. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 043 | /decisions | `DecisionsGovernanceScreen` | Decision List is scoped `MVP` for Decisions / Evidence / Governance proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY | Decision state must separate draft/internal decision data, participant action, approval state and released client-safe state. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 044 | /decisions/:id | `DecisionsGovernanceScreen` | Digital Decision Room is scoped `MVP` for Decisions / Evidence / Governance proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | Decision state must separate draft/internal decision data, participant action, approval state and released client-safe state. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 045 | /decisions/:id/success | `DecisionsGovernanceScreen` | Decision Submitted is scoped `MVP` for Decisions / Evidence / Governance proof path. | CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, RELEASE_PENDING_STATE, APPROVAL_PENDING_STATE, NEEDS_EVIDENCE_STATE, BLOCKED_STATE, PERMISSION_DENIED_STATE, SUCCESS_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, DECISION_SUBMITTED_STATE | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | Decision submitted state must confirm submission only; it must not overclaim release, audit persistence or evidence creation unless downstream proof exists. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 046 | /evidence | `DecisionsGovernanceScreen` | Evidence Vault is scoped `MVP` for Decisions / Evidence / Governance proof path. | NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE; CLIENT_VISIBILITY | Evidence state must show internal-only/redacted evidence, missing evidence, denied access and audit unavailable conditions. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 047 | /evidence/:id | `DecisionsGovernanceScreen` | Evidence Record Detail is scoped `MVP` for Decisions / Evidence / Governance proof path. | NEEDS_EVIDENCE_STATE, PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | EVIDENCE; CLIENT_VISIBILITY | Evidence state must show internal-only/redacted evidence, missing evidence, denied access and audit unavailable conditions. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 048 | /governance/users | `DecisionsGovernanceScreen` | Governance Users is scoped `MVP` for Decisions / Evidence / Governance proof path. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | RBAC/AUDIT | Governance/RBAC state must show denied access, disabled gated actions, second-confirmation dependency and audit unavailability without implying admin bypass. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 049 | /governance/roles | `DecisionsGovernanceScreen` | Role Management is scoped `MVP` for Decisions / Evidence / Governance proof path. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | RBAC/AUDIT | Governance/RBAC state must show denied access, disabled gated actions, second-confirmation dependency and audit unavailability without implying admin bypass. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 050 | /governance/access-requests | `DecisionsGovernanceScreen` | Access Requests is scoped `MVP` for Decisions / Evidence / Governance proof path. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | RBAC/AUDIT | Governance/RBAC state must show denied access, disabled gated actions, second-confirmation dependency and audit unavailability without implying admin bypass. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 051 | /governance/audit-history | `CommunicationExportOpsScreen` | Access Audit History is scoped `MVP` for Decisions / Evidence / Governance proof path. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | AUDIT | Governance/RBAC state must show denied access, disabled gated actions, second-confirmation dependency and audit unavailability without implying admin bypass. | Show blocked/denied/retry/empty/success path as applicable; do not silently advance gates. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 054 | /export/new | `CommunicationExportOpsScreen` | Create Export is scoped `MVP` for Export proof path. | REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, RETRY_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, EXPORT_PENDING_STATE | EXPORT; CLIENT_VISIBILITY | Export state must show scope selection, redaction pending, approval required, generation/download failure and client-safe package readiness only after release/redaction conditions. | Allow back/retry/review redaction/approval path; no download/share readiness before approval and redaction. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 055 | /export/:id/scope | `CommunicationExportOpsScreen` | Export Scope Selection is scoped `MVP` for Export proof path. | REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, SUCCESS_STATE, RETRY_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, EXPORT_PENDING_STATE | EXPORT; CLIENT_VISIBILITY | Export state must show scope selection, redaction pending, approval required, generation/download failure and client-safe package readiness only after release/redaction conditions. | Allow back/retry/review redaction/approval path; no download/share readiness before approval and redaction. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 056 | /export/:id/redaction | `CommunicationExportOpsScreen` | Export Redaction is scoped `MVP` for Export proof path. | REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, RETRY_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, EXPORT_PENDING_STATE | EXPORT; CLIENT_VISIBILITY | Export state must show scope selection, redaction pending, approval required, generation/download failure and client-safe package readiness only after release/redaction conditions. | Allow back/retry/review redaction/approval path; no download/share readiness before approval and redaction. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 057 | /export/:id/preview | `CommunicationExportOpsScreen` | Export Preview is scoped `MVP` for Export proof path. | REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, RETRY_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, EXPORT_PENDING_STATE | EXPORT; CLIENT_VISIBILITY; AUDIT | Export state must show scope selection, redaction pending, approval required, generation/download failure and client-safe package readiness only after release/redaction conditions. | Allow back/retry/review redaction/approval path; no download/share readiness before approval and redaction. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 058 | /export/:id/download | `CommunicationExportOpsScreen` | Export Download and Share is scoped `MVP` for Export proof path. | REDACTED_INTERNAL_ONLY_STATE, PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, RETRY_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE, EXPORT_PENDING_STATE | EXPORT; CLIENT_VISIBILITY; AUDIT | Export state must show scope selection, redaction pending, approval required, generation/download failure and client-safe package readiness only after release/redaction conditions. | Allow back/retry/review redaction/approval path; no download/share readiness before approval and redaction. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |

## 9. MVP_SUPPORT Conditional State-Screen Specification

| Route ID | Path | Component | Support Purpose | Conditional States | Inclusion Condition | Downstream Dependency | Generation Decision |
|---|---|---|---|---|---|---|---|
| 001 | /login | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 002 | /mfa | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 003 | /onboarding/invite | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 004 | /onboarding/identity | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 005 | /onboarding/consent | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 006 | /onboarding/role-confirmation | `AuthOnboardingScreen` | Access and onboarding support for controlled demo role/context entry; not production IAM proof. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only where access/onboarding state affects MVP role, tenant or permission context. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 007 | /admin/platform | `AdminTenantSetupScreen` | Platform/admin setup support with safety-relevant policy, role, security, evidence or export configuration context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where platform, role, security, tenant policy or invite state affects RBAC/audit/client-visibility safety. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 009 | /admin/roles | `AdminTenantSetupScreen` | Platform/admin setup support with safety-relevant policy, role, security, evidence or export configuration context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where platform, role, security, tenant policy or invite state affects RBAC/audit/client-visibility safety. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 010 | /admin/security | `AdminTenantSetupScreen` | Platform/admin setup support with safety-relevant policy, role, security, evidence or export configuration context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where platform, role, security, tenant policy or invite state affects RBAC/audit/client-visibility safety. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 011 | /admin/evidence-templates | `AdminTenantSetupScreen` | Platform/admin setup support with safety-relevant policy, role, security, evidence or export configuration context. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where evidence/export template state affects later evidence, audit, export or redaction contract. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 012 | /admin/export-templates | `AdminTenantSetupScreen` | Platform/admin setup support with safety-relevant policy, role, security, evidence or export configuration context. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where evidence/export template state affects later evidence, audit, export or redaction contract. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 013 | /admin/tenants | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where tenant setup state is necessary to understand MVP workflow readiness. | No downstream contract unless later elevated. | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 014 | /tenants/new | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where tenant setup state is necessary to understand MVP workflow readiness. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 015 | /tenants/:id/setup | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where tenant setup state is necessary to understand MVP workflow readiness. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 016 | /tenants/:id/team | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where tenant setup state is necessary to understand MVP workflow readiness. | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 017 | /tenants/:id/policies | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where platform, role, security, tenant policy or invite state affects RBAC/audit/client-visibility safety. | API_CONTRACT_MATRIX; P0_TEST_ACCEPTANCE_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 018 | /tenants/:id/users | `AdminTenantSetupScreen` | Tenant setup support for controlled AlphaVest workflow context. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, DISABLED_GATED_ACTION_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where platform, role, security, tenant policy or invite state affects RBAC/audit/client-visibility safety. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 021 | /client/profile | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | No downstream contract unless later elevated. | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 022 | /client/family-members | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | No downstream contract unless later elevated. | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 023 | /relationships | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 024 | /entities | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | No downstream contract unless later elevated. | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 025 | /entities/new | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 026 | /entities/:id | `ClientIntakeScreen` | Client/family/entity context support; not full family-office graph product scope. | PERMISSION_DENIED_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include only for MVP journey context, object access or client data availability; do not make it a product-proof route. | No downstream contract unless later elevated. | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 031 | /wealth-map | `WealthActionsScreen` | Wealth/action context support; not full live wealth engine or task-management implementation. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where drawer/detail/action state feeds later interaction or client visibility contracts. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |
| 032 | /actions | `WealthActionsScreen` | Wealth/action context support; not full live wealth engine or task-management implementation. | PERMISSION_DENIED_STATE, VALIDATION_FAILED_STATE, SUCCESS_STATE, LOADING_STATE, ERROR_STATE, EMPTY_STATE | Include where drawer/detail/action state feeds later interaction or client visibility contracts. | DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` |

## 10. P1 Deferred State Register

| Route ID | Path | Component | P1 Reason | State Decision | Generation Decision |
|---|---|---|---|---|---|
| 052 | /communication | `CommunicationExportOpsScreen` | P1 scope; useful after MVP but not required for first MVP proof. | `P1_DEFERRED_STATE`; no MVP state-screen specification beyond carry-forward note. | `DO_NOT_GENERATE_FOR_MVP` |
| 053 | /communication/call-trigger | `CommunicationExportOpsScreen` | P1 scope; useful after MVP but not required for first MVP proof. | `P1_DEFERRED_STATE`; no MVP state-screen specification beyond carry-forward note. | `DO_NOT_GENERATE_FOR_MVP` |
| 059 | /ops/queues | `CommunicationExportOpsScreen` | P1 scope; useful after MVP but not required for first MVP proof. | `P1_DEFERRED_STATE`; no MVP state-screen specification beyond carry-forward note. | `DO_NOT_GENERATE_FOR_MVP` |
| 060 | /ops/sla | `CommunicationExportOpsScreen` | P1 scope; useful after MVP but not required for first MVP proof. | `P1_DEFERRED_STATE`; no MVP state-screen specification beyond carry-forward note. | `DO_NOT_GENERATE_FOR_MVP` |
| 068 | /reviews/calendar | `ReviewMonitoringScreen` | Review rhythm route is P1 even though its visual reference is missing/non-public; do not treat it as hold or MVP. | `P1_DEFERRED_STATE`; no MVP state-screen specification beyond carry-forward note. | `DO_NOT_GENERATE_FOR_MVP` |

## 11. Reference-Only State Register

| Route ID | Path | Component | Reference Purpose | State Decision | Generation Decision |
|---|---|---|---|---|---|
| 061 | /service-blueprint | `CommunicationExportOpsScreen` | Reference/catalogue/state page; not product implementation proof. | `REFERENCE_ONLY_NO_PRODUCT_STATE`; no product state-screen requirement. | `DO_NOT_GENERATE` |
| 062 | /roadmap | `CommunicationExportOpsScreen` | Reference/catalogue/state page; not product implementation proof. | `REFERENCE_ONLY_NO_PRODUCT_STATE`; no product state-screen requirement. | `DO_NOT_GENERATE` |
| 063 | /states | `CommunicationExportOpsScreen` | Reference/catalogue/state page; not product implementation proof. | `REFERENCE_ONLY_NO_PRODUCT_STATE`; no product state-screen requirement. | `DO_NOT_GENERATE` |

## 12. Hold / Blocked Route State Register

| Route ID | Path | Component | Hold Reason | State Decision | Unlock Dependency | Generation Decision |
|---|---|---|---|---|---|---|
| 064 | /kyc/:id/review | `KycAmlWorkflowScreen` | Route is registered but visual asset, scope and/or safety treatment remain unresolved. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 065 | /kyc/:id/source-of-wealth | `KycAmlWorkflowScreen` | Route is registered but visual asset, scope and/or safety treatment remain unresolved. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 066 | /suitability/:tenantId/profile | `SuitabilityIpsScreen` | Route may be advice/client-visibility sensitive and has unresolved scope/safety/visual treatment. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 067 | /ips/:tenantId | `SuitabilityIpsScreen` | Route may be advice/client-visibility sensitive and has unresolved scope/safety/visual treatment. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 069 | /monitoring/rebalance | `ReviewMonitoringScreen` | Route may be advice/client-visibility sensitive and has unresolved scope/safety/visual treatment. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 070 | /committee/reviews | `CommitteeReviewScreen` | Route may be advice/client-visibility sensitive and has unresolved scope/safety/visual treatment. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |
| 071 | /committee/reviews/:id | `CommitteeReviewScreen` | Route may be advice/client-visibility sensitive and has unresolved scope/safety/visual treatment. | `HOLD_BLOCKED_STATE`; do not specify implementable MVP states yet. | Route scope, visual asset and safety contract unlock required before state-screen implementation. | `DO_NOT_GENERATE_YET` |

## 13. Safety-Critical State Matrix

| Safety Rule | Required State Treatment | Route Coverage |
|---|---|---|
| No unapproved advice reaches client | Client-facing routes must use `CLIENT_VISIBILITY_HIDDEN_STATE` and `REDACTED_INTERNAL_ONLY_STATE` when release proof is absent. | 019, 020, 033–045, 054–058 |
| AI Draft internal-only | Internal draft states must not become client-visible state copy. | 033, 034, 035, 036, 037, 038, 039, 040 |
| Fail-closed client visibility | Client portal/mobile/export/evidence states default to hidden or redacted when conditions are incomplete. | 019, 020, 046, 047, 054–058 |
| Advisor approval separate from compliance | Advisor-approved states must not equal release-ready states. | 036, 037, 038, 039, 040 |
| Compliance release required | `RELEASE_PENDING_STATE`, `COMPLIANCE_BLOCKED_STATE` and `NEEDS_EVIDENCE_STATE` must be explicit. | 038, 039, 040, 041, 042 |
| Upload does not equal evidence sufficiency | `UPLOAD_SUCCESS_STATE` means upload completed only; it cannot unlock advice or release by itself. | 028, 027, 029, 030, 046, 047 |
| Audit persistence required | `AUDIT_UNAVAILABLE_STATE` must appear where audit proof is expected but unavailable. | 042, 048, 049, 050, 051 |
| Export redaction required | Export states must include redaction pending, approval missing and failure/retry states. | 054, 055, 056, 057, 058 |
| Admin non-bypass | Admin/governance states must include denied, disabled and second-confirmation dependency where relevant. | 007, 009, 010, 048, 049, 050, 051 |

## 14. Interaction / Feedback Dependency Matrix

| Dependency Area | Affected Routes | State-Screen Implication | Routed To |
|---|---|---|---|
| Drawer/modal/confirmation visual modes | 002, 005, 007, 009, 010, 014, 015, 018, 025, 031, 032, 040, 041, 044, 046, 048, 049, 050, 051, 057 | State spec may require cancel/close/validation/loading/success/error states, but lifecycle is not specified here. | `DRAWER_MODAL_INTERACTION_CONTRACT.md` |
| Field validation / form failure | 002–006, 009, 010, 014, 015, 018, 025, 028, 040, 041, 044, 048–050, 054–058 | Validation failed states must be present where input or confirmation preconditions exist. | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` |
| Upload mechanics | 028 | Upload progress, failure and success states are required; sufficiency remains safety contract. | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md`; `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` |
| Static or deterministic visual states | 001, 003, 004, 006, 008, 011–013, 016, 017, 021–024, 026, 034, 036, 038, 043, 045, 052, 053, 059–063 | Visual/static state must not be treated as implemented interaction. | Later contracts only if route is MVP/MVP_SUPPORT flow-relevant |
| Partial typed workflow actions | 013, 014, 016, 018, 019, 021–025, 027–029, 033, 035, 037, 039–045, 047, 051, 054, 055, 057, 058 | State spec must not overclaim persistence, audit or API safety. | `API_CONTRACT_MATRIX.md`; `P0_TEST_ACCEPTANCE_MATRIX.md` |

## 15. API / Evidence / Audit / Export Dependency Matrix

| Dependency Area | Affected Routes | State Requirement | Routed To |
|---|---|---|---|
| API loading/error/retry | MVP routes with API-backed or demo-action behaviour | Loading, error and retry states must exist, but API contracts are not defined here. | `API_CONTRACT_MATRIX.md` |
| Evidence sufficiency | 027, 028, 029, 030, 041, 046, 047 | Needs-evidence, blocked and audit-unavailable states must preserve upload-does-not-unlock-release rule. | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` |
| Audit availability | 007–012, 016–018, 027–030, 036–042, 046–051, 054–058 | Audit unavailable / audit pending state must be explicit where gate proof is expected. | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` |
| Export redaction and approval | 054, 055, 056, 057, 058 | Export pending, redaction pending, approval required, failed generation and safe-download states are required. | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md`; `API_CONTRACT_MATRIX.md` |
| RBAC / payload denial | 001–012, 017–020, 032–051, 054–058 | Permission denied, redacted/internal-only and disabled/gated action states must fail closed. | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` |
| Schema field proof | All safety-critical routes | State semantics may depend on fields/statuses, but no field-level schema decision is made here. | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` |
| Test proof | All MVP and safety-critical support routes | State requirements must later map to existing or missing negative tests. | `P0_TEST_ACCEPTANCE_MATRIX.md` |

## 16. Generation Decision Register

| Route Set | Route IDs | Generation Decision | Reason |
|---|---|---|---|
| MVP | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` | State behaviour is specified; no visual asset creation is allowed. |
| MVP_SUPPORT | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 | `NO_STATE_SCREEN_GENERATION_IN_THIS_ARTEFACT` | Conditional support states only; no product-state image generation. |
| P1_AFTER_MVP | 052, 053, 059, 060, 068 | `DO_NOT_GENERATE_FOR_MVP` | Deferred to P1. |
| REFERENCE_ONLY | 061, 062, 063 | `DO_NOT_GENERATE` | Reference pages are not product state-screen work. |
| HOLD_PENDING_DECISION | 064, 065, 066, 067, 069, 070, 071 | `DO_NOT_GENERATE_YET` | Scope, visual and safety decisions are unresolved. |
| `064–071` visual-ref group | 064, 065, 066, 067, 068, 069, 070, 071 | `DO_NOT_GENERATE_YET` | Registered routes with missing/non-public refs; route `068` is P1, the rest are hold. |

## 17. Stop Rules

* No implementation.
* No code changes.
* No route changes.
* No component changes.
* No API changes.
* No Prisma changes.
* No migrations.
* No tests.
* No Codex tasks.
* No final Codex handoff.
* No screen generation.
* No state-screen generation.
* No image generation.
* No visual replacement.
* No asset creation.
* No use of `main` as target codebase.
* No `main`-based gaps as target gaps.
* No blind patch-schema replacement.
* No assumption that 63 PNGs cover 71 routes.
* No assumption that `064–071` are absent.
* No assumption that `064–071` should be generated.
* No assumption that a visual asset proves interaction.
* No assumption that a visible drawer/modal proves lifecycle.
* No assumption that a button proves mutation.
* No assumption that a status chip proves a gate.
* No assumption that upload mechanics prove evidence sufficiency.
* No assumption that route presence equals MVP implementation readiness.
* No assumption that Codex may start.

## 18. Open Blockers and Downstream Dependencies

| Blocker / Dependency | Status | Impact | Routed To |
|---|---|---|---|
| Drawer/modal lifecycles | Open | State requirements identify where lifecycle states are needed, but trigger/open/close/cancel/submit behaviour remains later work. | `DRAWER_MODAL_INTERACTION_CONTRACT.md` |
| Feedback, validation and error semantics | Open | State requirements list validation/error/success needs, but field/API copy and feedback behaviour remain later work. | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` |
| RBAC, client visibility and advice boundary | Open | Permission denied, redacted/internal-only, client hidden and release-pending states require safety proof. | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` |
| Evidence, audit and export safety | Open | Upload success, evidence sufficiency, audit unavailable and export redaction states require safety contracts. | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` |
| API request/response/failure contracts | Open | Loading/error/retry states require API contract mapping but are not implemented here. | `API_CONTRACT_MATRIX.md` |
| Schema field-level decisions | Open | State semantics may depend on status/visibility fields; no schema changes are authorized here. | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` |
| P0 test proof | Open | State requirements need later mapping to existing/missing tests. | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Routes `064–067`, `069–071` | Blocked | State-screen decisions remain held until scope/safety/visual unlock. | Route/safety/visual unlock before implementation |
| Route `068` | Deferred | P1 route with missing/non-public visual ref; no MVP state-screen work. | P1 backlog |
| Codex handoff | Blocked | Codex may not start from this artefact. | Later roadmap artefacts 6–15 |

## 19. Acceptance Criteria

| Criterion | Required Status |
|---|---|
| Roadmap position 5 of 15 confirmed | PASS |
| All four required predecessors checked | PASS |
| Source hierarchy preserved | PASS |
| `full-workflow` used as target codebase | PASS |
| `main` blocked as target source | PASS |
| MVP patch treated as Control Spec only | PASS |
| 31 MVP routes specified | PASS |
| 25 MVP_SUPPORT routes conditionally specified | PASS |
| 5 P1 routes deferred | PASS |
| 3 reference-only routes excluded | PASS |
| 7 hold routes blocked | PASS |
| `064–071` not treated as absent | PASS |
| `064–071` not generated | PASS |
| State taxonomy defined | PASS |
| Safety-critical states included | PASS |
| Upload success separated from evidence sufficiency | PASS |
| Advisor approval separated from compliance release | PASS |
| Client visibility hidden/redacted states included | PASS |
| Export redaction/pending states included | PASS |
| Audit unavailable states included | PASS |
| Interaction dependencies routed to later artefacts | PASS |
| API/schema/test dependencies routed to later artefacts | PASS |
| No implementation | PASS |
| No screen/state-screen/image generation | PASS |
| No Codex tasks | PASS |
| Codex handoff remains blocked | PASS |
| ENGINE Proof included | PASS |

## 20. Final Decision

`STATE_SCREEN_SPEC_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

Codex remains blocked. Downstream artefact `DRAWER_MODAL_INTERACTION_CONTRACT.md` may proceed, using this state-screen specification as input. No implementation or generation is authorized.

## 21. ENGINE Proof

### 21.1 ENGINE_v3 Standard — All Phases

| Phase | Proof |
|---|---|
| Charter | Target is limited to `STATE_SCREEN_SPEC.md`; output is a state specification only. |
| Evidence | Predecessor artefacts exist and their route/scope/visual/missing-state decisions are preserved. |
| Framing | State-screen work is framed as behaviour requirements, not images or implementation. |
| Divergence | MVP, MVP_SUPPORT, P1, REFERENCE_ONLY and HOLD route sets receive distinct treatments. |
| Contradictions | The artefact blocks both false completeness from PNGs and false absence/generation for `064–071`. |
| Branch Build | Separate matrices are built for MVP routes, conditional support routes, P1 deferrals, reference exclusions and hold blockers. |
| Debate | Safety-critical route states are included while downstream safety contracts remain open. |
| Adversarial | Explicit stop rules block common overclaims: visual equals behaviour, upload equals sufficiency, advisor approval equals release, status chip equals gate. |
| Convergence | All 71 routes are accounted for exactly once in the route-set decisions. |
| Proof | Acceptance criteria verify sequence, route coverage, safety states, no-generation and no-Codex status. |
| Learning | Unresolved behaviour, safety, API, schema and test proof are routed to later roadmap artefacts instead of being solved prematurely. |

### 21.2 ENGINE_v2

| Phase | Proof |
|---|---|
| Reframing | The artefact reframes state screens from visual assets into route/flow state obligations. |
| Map-vs-Reality separation | Visual coverage, route registration, interaction proof and safety proof remain separate layers. |
| Sequencing | The artefact respects the roadmap chain and prepares only the next interaction-contract step. |
| Psycho-Logic / stakeholder risk | Codex ambiguity is reduced by preventing silent product, visual, safety and implementation decisions. |
| Dependency logic | Each state class is routed to the correct downstream interaction, feedback, safety, API, schema or test artefact. |
| Decision clarity | Every route set receives a concrete state decision and generation status. |

### 21.3 ENGINE_v2-B Implementation Handoff Discipline

| Discipline Area | Proof |
|---|---|
| Route specificity | All 71 routes are preserved by scope set; MVP and support routes are specified in route tables. |
| Component specificity | State rows reference target screen components without editing them. |
| API discipline | API dependencies are identified but routed to `API_CONTRACT_MATRIX.md`. |
| Schema discipline | Full-workflow schema remains baseline; field-level mapping is routed downstream. |
| Test discipline | P0 proof is routed to `P0_TEST_ACCEPTANCE_MATRIX.md`; no tests are implemented. |
| Codex discipline | No Codex tasks or final handoff are created; Codex remains blocked. |
| Screen discipline | No screen, state-screen, visual asset or image generation is authorized. |

### 21.4 ENGINE_v2 Compression / Operational Layer

| Requirement | Proof |
|---|---|
| Portable | The artefact is self-contained and can be used as downstream input. |
| Route-complete | All route sets from the predecessor are preserved. |
| Operational | Tables define required states, dependencies, blockers and no-generation decisions. |
| Compact enough | The artefact avoids implementation detail while retaining enough precision for later contracts. |
| Safe | `full-workflow` remains the target, `main` remains false-gap only, MVP patch remains Control Spec only and Codex remains blocked. |

