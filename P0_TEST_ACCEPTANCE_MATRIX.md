# P0_TEST_ACCEPTANCE_MATRIX.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Artefact status:** `P0_TEST_ACCEPTANCE_MATRIX_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**P0 test acceptance gate status:** `P0_TEST_ACCEPTANCE_GATE_PARTIAL_NOT_PASSED`

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact maps the existing AlphaVest full-workflow test suite to the locked MVP, route, visual, state, interaction, feedback, RBAC, evidence/audit/export, API and schema contracts. It is a planning and proof matrix only. It does not write tests, execute tests, change code, change Prisma, generate screens, create Codex tasks or prepare the final Codex handoff.

The central decision is strict: the target codebase contains real tests and several strong proof slices, but the current test set does **not** prove full P0 MVP safety. Existing tests prove route presence, selected API validation, upload mechanics, selected RBAC denial, selected audit rows, selected workflow gate logic, metadata/export manifest controls, and selected no-client-release states. They do not yet prove full client payload redaction, AI Draft internal-only behaviour, admin non-bypass across gates, upload-not-sufficiency end-to-end, evidence sufficiency lifecycle, audit-failure fail-closed behaviour, export forbidden-payload redaction, or complete positive/negative release acceptance.

Downstream `SCREEN_GENERATION_BRIEF_IF_NEEDED.md` may proceed as a non-implementation preparation artefact. `FINAL_CODEX_TASK_MASTER.md` remains blocked until the missing P0 proof cases below are preserved as acceptance blockers and later converted into implementation/test tasks only at the correct roadmap stage.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
| --- | --- | --- |
| Artefact | P0_TEST_ACCEPTANCE_MATRIX.md | PASS |
| Position | 12 of 15 | PASS |
| Direct predecessor | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | PASS — exists and used |
| Direct successor | SCREEN_GENERATION_BRIEF_IF_NEEDED.md | PREPARED_ONLY |
| Required predecessors | MVP_SCOPE_LOCK.md through SCHEMA_FIELD_LEVEL_RECONCILIATION.md | PASS — all present |
| Codex status | CODEX_HANDOFF_NOT_READY | BLOCKED |
| Implementation status | No implementation / no test writing / no generation | BLOCKED |


### 2.1 Predecessor Availability

| # | Predecessor Artefact | Availability | Size Bytes |
| --- | --- | --- | --- |
| 1 | MVP_SCOPE_LOCK.md | PASS — exists and used | 31711 |
| 2 | ROUTE_SCOPE_LOCK.md | PASS — exists and used | 113204 |
| 3 | ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | PASS — exists and used | 89707 |
| 4 | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md | PASS — exists and used | 94368 |
| 5 | STATE_SCREEN_SPEC.md | PASS — exists and used | 69611 |
| 6 | DRAWER_MODAL_INTERACTION_CONTRACT.md | PASS — exists and used | 81531 |
| 7 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | PASS — exists and used | 95299 |
| 8 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | PASS — exists and used | 117107 |
| 9 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | PASS — exists and used | 76380 |
| 10 | API_CONTRACT_MATRIX.md | PASS — exists and used | 49888 |
| 11 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | PASS — exists and used | 81631 |


## 3. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md | Roadmap control | Sequence, dependencies, stop rules, readiness gates | Bypassing sequence or starting Codex |
| 2 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Binding direct predecessor | Schema/test obligations and field-level safety mapping | Treating schema contract as implemented proof |
| 3 | API_CONTRACT_MATRIX.md | Binding predecessor | Existing 4 API baseline and API test obligations | Treating API presence as safety proof |
| 4 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Binding predecessor | Evidence, audit, export, upload, redaction and persistence rules | Weakening safety or treating visual UI as proof |
| 5 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | Binding predecessor | RBAC, route/action/object/payload visibility, fail-closed visibility, AI Draft internal-only | Treating route access as payload permission |
| 6 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | Binding predecessor | Feedback, validation, no-overclaim success, upload-only success | Treating feedback as implementation proof |
| 7 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Binding predecessor | Interaction lifecycles and proof limits | Treating visible UI as lifecycle proof |
| 8 | STATE_SCREEN_SPEC.md | Binding predecessor | Route-level states and fail-closed state requirements | Reclassifying state scope |
| 9 | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md | Binding predecessor | Missing screen/state decisions and generation blockers | Authorizing screen generation |
| 10 | ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | Binding predecessor | Route/component/visual status and proof limits | Treating PNGs as behaviour proof |
| 11 | ROUTE_SCOPE_LOCK.md | Binding predecessor | Locked scope labels for all 71 routes | Reclassifying route scope |
| 12 | MVP_SCOPE_LOCK.md | Binding predecessor | MVP boundary, non-goals and P0 safety scope | Inventing conflicting MVP scope |
| 13 | ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md | Latest KB layer | Full-workflow schema baseline; patch as control spec | Blind schema replacement |
| 14 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Interaction reality layer | Implemented/partial/deterministic/static distinction | Treating component presence as behaviour proof |
| 15 | ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md | Route/visual/state layer | 71 routes, 63 PNGs, unresolved 064–071 | Generating screens or assuming 63 PNGs cover 71 routes |
| 16 | ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md | Readiness layer | CODEX_HANDOFF_NOT_READY and open gates | Overclaiming readiness |
| 17 | ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md | False-gap cleanup | Blocks main absence claims | Deriving target tasks from main |
| 18 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Inventory | 405 files, 71 routes, 4 APIs, 42 models, 10 specs, 63 PNGs | Treating inventory as MVP safety proof |
| 19 | ALPHAVEST_LIVING_KNOWLEDGE_BASE.md | Protocol | Source hierarchy and version discipline | Letting v0.1 override newer layers |
| 20 | control-spec concepts represented in bundled markdown artefacts; no patch archive included | MVP Control Spec | Control rules, domain concepts, acceptance gates | Replacing full-workflow code/schema |
| 21 | local repository checkout / pull of target branch full-workflow | Primary target codebase | Target tests, APIs, routes, schema, services | Assuming all present code is ready |
| 22 | main branch as false-gap / historical only; never target truth | False-gap source only | Historical comparison only | Any target truth or Codex task |


## 4. Binding Predecessor Decisions

The predecessor artefacts are treated as binding and are not re-decided here. The inherited route worksets are:


| Scope Label | Count | Route IDs |
| --- | --- | --- |
| MVP | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 |
| MVP_SUPPORT | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 |
| P1_AFTER_MVP | 5 | 052, 053, 059, 060, 068 |
| REFERENCE_ONLY | 3 | 061, 062, 063 |
| HOLD_PENDING_DECISION | 7 | 064, 065, 066, 067, 069, 070, 071 |
| FUTURE_STATE | 0 | — |
| DEMO_ONLY | 0 | — |
| OUT_OF_SCOPE | 0 | — |


Binding safety limits preserved: route access is not action permission; action permission is not payload visibility; upload success is not evidence sufficiency; advisor approval is not compliance release; compliance release is not client acceptance; a button/status chip/PNG is not gate proof; API presence is not API safety proof; schema presence is not P0 proof; existing tests are proof slices only.


## 5. Existing Test Baseline

The full-workflow target contains exactly the following 10 test/spec files in `tests/` and they are treated as existing evidence, not complete acceptance proof.


| # | Test File | Classification |
| --- | --- | --- |
| 1 | tests/committee-review-routes.spec.ts | Committee / route UI proof |
| 2 | tests/data-quality-service.spec.ts | Data quality service gate |
| 3 | tests/recommendation-review-workflow-api.spec.ts | Typed workflow API |
| 4 | tests/document-upload-api.spec.ts | Document upload API |
| 5 | tests/document-upload-flow.spec.ts | Browser upload flow |
| 6 | tests/file-export-realism.spec.ts | File metadata and export manifest |
| 7 | tests/permission-engine.spec.ts | Permission engine and denied audit |
| 8 | tests/review-monitoring-service.spec.ts | Review monitoring and rebalance |
| 9 | tests/route-smoke.spec.ts | Route smoke |
| 10 | tests/workflow-gate.spec.ts | Workflow gate unit proof |


## 6. P0 Gate Vocabulary

| P0 Gate | Meaning |
| --- | --- |
| P0_ROUTE_ACCESS_GATE | Route shell/access must not imply unauthorized access. |
| P0_RBAC_ACTION_GATE | Actions require role, object and workflow permission. |
| P0_PAYLOAD_VISIBILITY_GATE | Payload fields hidden/redacted/visible by actor/state. |
| P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | Client-facing surfaces fail closed if release/redaction incomplete. |
| P0_NO_UNAPPROVED_ADVICE_GATE | No unapproved advice reaches client. |
| P0_AI_DRAFT_INTERNAL_ONLY_GATE | AI/rules draft never client-visible before approved release. |
| P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval does not equal compliance release. |
| P0_COMPLIANCE_RELEASE_GATE | Compliance release/block/request-evidence enforced. |
| P0_ADMIN_NON_BYPASS_GATE | Admin cannot bypass gates. |
| P0_UPLOAD_NOT_SUFFICIENCY_GATE | Upload success does not unlock evidence sufficiency or release. |
| P0_EVIDENCE_SUFFICIENCY_GATE | Sufficiency requires reviewed, linked, relevant, scoped and accepted evidence. |
| P0_AUDIT_PERSISTENCE_GATE | Critical gate actions write audit events. |
| P0_AUDIT_FAIL_CLOSED_GATE | Safety actions fail/hold when audit cannot persist. |
| P0_EXPORT_REDACTION_GATE | Export prevents internal data leakage. |
| P0_EXPORT_APPROVAL_GATE | Preview, approval and download/share are separate. |
| P0_API_VALIDATION_GATE | APIs validate requests/files/preconditions. |
| P0_API_ERROR_FAIL_CLOSED_GATE | API errors do not advance workflow or expose data. |
| P0_SCHEMA_FIELD_SUPPORT_GATE | Schema fields support safety state/redaction/audit/evidence/export. |
| P0_STATE_FEEDBACK_GATE | UI states/feedback do not overclaim downstream gates. |
| P0_HOLD_ROUTE_BLOCK_GATE | Held routes do not silently become MVP implementation scope. |
| P0_MAIN_FALSE_GAP_BLOCK_GATE | No main-derived absence claim becomes target task. |


## 7. Test Proof Vocabulary

| Label | Meaning |
| --- | --- |
| EXISTING_TEST_FOUND | Test file exists in full-workflow. |
| ASSERTION_SCOPE_VERIFIED | Assertions were inspected and mapped. |
| TEST_EXISTS_ASSERTION_SCOPE_TO_VERIFY | File exists but assertion scope must still be confirmed before overclaiming. |
| POSITIVE_PROOF_SLICE | Happy-path or presence behaviour slice. |
| NEGATIVE_PROOF_SLICE | Denial, leakage, bypass or fail-closed slice. |
| PARTIAL_P0_PROOF | Supports a P0 gate but does not close it. |
| P0_GATE_NOT_COVERED | No sufficient test coverage found. |
| P0_NEGATIVE_TEST_MISSING | Negative safety case is missing. |
| P0_POSITIVE_TEST_MISSING | Required positive acceptance path is missing. |
| OVERCLAIM_RISK | Existing test could be misread as proving more than it does. |
| BLOCKER_BEFORE_CODEX_TASK_MASTER | Missing proof blocks safe task master generation. |
| DEFERRED_P1_TEST_SCOPE | P1 by locked route scope. |
| HOLD_BLOCKED_NO_TEST_FINALIZATION | Held route cannot receive final P0 test contract until unlocked. |
| CONTRACT_ONLY_NOT_IMPLEMENTED | Acceptance requirement specified only; no test written here. |
| NOT_READY_FOR_CODEX | Codex remains blocked. |


## 8. Existing Test Inventory Matrix

| Test File | Test Family | Related Routes | Related APIs / Services | Related P0 Gates | What It Proves | What It Does Not Prove | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| tests/committee-review-routes.spec.ts | Committee / route UI proof | 070, 071 | CommitteeReviewScreen | P0_HOLD_ROUTE_BLOCK_GATE; P0_NO_UNAPPROVED_ADVICE_GATE (supporting only) | Shows queue/detail headings, second-review label, client-visible count 0, committee vote/dissent/evidence labels. | No vote mutation, RBAC, persisted committee decision, payload redaction, or MVP scope unlock proof. | PARTIAL_PROOF_FOR_HELD_ROUTES |
| tests/data-quality-service.spec.ts | Data quality service gate | support/service | dataQualityService | P0_SCHEMA_FIELD_SUPPORT_GATE (supporting); readiness support | Blocks readiness when high-severity issues exist and passes when completed issues are filtered out. | Does not prove advice boundary, client visibility, RBAC payloads, export, audit persistence, or MVP route safety. | SUPPORTING_PROOF |
| tests/recommendation-review-workflow-api.spec.ts | Typed workflow API | many journey actions; includes KYC/suitability/IPS | deleted generic workflow route | P0_API_VALIDATION_GATE; P0_NO_UNAPPROVED_ADVICE_GATE; P0_AI_DRAFT_INTERNAL_ONLY_GATE (partial); P0_AUDIT_PERSISTENCE_GATE (partial) | Implemented demo actions return success; malformed action payloads return 400; KYC/suitability/IPS actions report noClientRelease, clientVisible=false, auditRows=1 and evidence IDs. | Demo action success is not production persistence proof; not complete RBAC/object-scope proof; not full client payload leakage proof; many actions are demo-only. | PARTIAL_P0_PROOF |
| tests/document-upload-api.spec.ts | Document upload API | 027, 028 | /api/documents/upload; /api/documents | P0_UPLOAD_NOT_SUFFICIENCY_GATE; P0_API_VALIDATION_GATE; P0_RBAC_ACTION_GATE; P0_AUDIT_PERSISTENCE_GATE; P0_EVIDENCE_SUFFICIENCY_GATE (negative boundary only) | Stores document/version/extraction/evidence/audit rows; reloads via /api/documents; rejects unsupported file type without row; denies forbidden role and writes denied audit. | Does not prove evidence sufficiency, release gating, full file size/tenant/object negative matrix, malware scanning, client payload redaction, or export readiness. | STRONG_PROOF_SLICE_BUT_PARTIAL |
| tests/document-upload-flow.spec.ts | Browser upload flow | 028, 027 | ClientIntakeScreen upload UI | P0_STATE_FEEDBACK_GATE; P0_UPLOAD_NOT_SUFFICIENCY_GATE (partial) | File picker upload succeeds, success message shown, uploaded document survives reload and appears in /documents. | No UI negative tests for invalid file, denied role, upload failure, retry, accessibility, or evidence sufficiency warning. | POSITIVE_PROOF_SLICE |
| tests/file-export-realism.spec.ts | File metadata and export manifest | 054-058 | fileMetadataService; exportPackageService | P0_EXPORT_REDACTION_GATE; P0_EXPORT_APPROVAL_GATE; P0_API_VALIDATION_GATE (service level) | Builds valid metadata-only export manifest; rejects unsafe metadata and blocks package generation without approval, zip, redaction profile, selected objects and watermark. | No route/API export test; no forbidden payload redaction assertion; no audit persistence; no client delivery boundary; realBinaryGenerated remains false. | PARTIAL_EXPORT_PROOF |
| tests/permission-engine.spec.ts | Permission engine and denied audit | global; esp. release/export/document | permissionEngine; runTypedWorkflowMutation | P0_RBAC_ACTION_GATE; P0_ADMIN_NON_BYPASS_GATE; P0_AUDIT_PERSISTENCE_GATE; P0_PAYLOAD_VISIBILITY_GATE (partial) | Denies cross-tenant access; denies principal release; permits compliance release decision; denies forbidden export and internal-only object access; denied release writes audit and skips mutation. | Not full route-access matrix; not all roles/actions/objects; admin non-bypass only partial; payload redaction not exhaustively tested. | STRONG_NEGATIVE_PROOF_SLICE |
| tests/review-monitoring-service.spec.ts | Review monitoring and rebalance | 068, 069 | /api/review-monitoring; deleted generic workflow route J16/J17 | P0_NO_UNAPPROVED_ADVICE_GATE (supporting); P0_AUDIT_PERSISTENCE_GATE (partial); P1 deferred/hold relevance | GET returns due/overdue rows with clientVisible=0/false; J16/J17 actions persist internal audit state and noClientRelease/clientVisible=false. | Review monitoring is P1/hold by scope; no client route proof, RBAC proof, or advice execution negative matrix. | DEFERRED_P1_OR_HOLD_SUPPORTING_PROOF |
| tests/route-smoke.spec.ts | Route smoke | 001-071 | route registry / app shell | P0_ROUTE_ACCESS_GATE (shell only); P0_HOLD_ROUTE_BLOCK_GATE (presence only) | Every registered route returns 200 and expected heading; unknown catalogue route shows hardened unavailable surface; selected mobile shell headings are visible. | Route 200/heading is not auth, permission, payload, workflow, audit, API, state or safety proof. | ROUTE_PRESENCE_ONLY |
| tests/workflow-gate.spec.ts | Workflow gate unit proof | 066, 067, 070, 071 concepts; advisory gates | workflow-gate | P0_NO_UNAPPROVED_ADVICE_GATE; P0_ADVISOR_NOT_RELEASE_GATE; P0_COMPLIANCE_RELEASE_GATE (logic-level partial) | Blocks suitability/IPS advice visibility when prerequisites incomplete; passes when prerequisites align; blocks high-risk committee when only advisor approval is complete; passes after committee approval/dissent/evidence/permission. | Logic-level proof only; routes 066/067/070/071 are hold/P1 sensitive; does not prove API payloads, UI states, RBAC, audit persistence or client leakage. | PARTIAL_LOGIC_PROOF |


## 9. Existing Test to P0 Gate Matrix

| P0 Gate | Required Behaviour | Existing Test Evidence | Positive Coverage | Negative / Missing Coverage | Blocker Status | Codex Impact |
| --- | --- | --- | --- | --- | --- | --- |
| P0_ROUTE_ACCESS_GATE | Route shell/access must not imply unauthorized access. | route-smoke.spec.ts | Positive route shell coverage only | Missing auth/role denial for route shells | PARTIAL_P0_PROOF | Codex blocked for route guard claims |
| P0_RBAC_ACTION_GATE | Actions require role, object and workflow permission. | permission-engine.spec.ts; document-upload-api.spec.ts | Strong negative slices for cross-tenant, principal release, forbidden upload/export/internal view | Missing full role/action/object matrix and admin bypass suite | PARTIAL_P0_PROOF | Codex blocked for complete RBAC implementation claim |
| P0_PAYLOAD_VISIBILITY_GATE | Payload fields hidden/redacted/visible by actor/state. | permission-engine.spec.ts partial | Internal object view denied for next_gen | Missing field-level payload redaction tests across client/API/export | P0_NEGATIVE_TEST_MISSING | Codex blocked for visibility payload claims |
| P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | Client-facing surfaces fail closed if release/redaction incomplete. | recommendation-review-workflow-api.spec.ts; review-monitoring-service.spec.ts; committee-review-routes.spec.ts | noClientRelease/clientVisible=false proof slices | Missing client portal/mobile API/UI leakage tests | P0_NEGATIVE_TEST_MISSING | Codex blocked for client-safe release claim |
| P0_NO_UNAPPROVED_ADVICE_GATE | No unapproved advice reaches client. | workflow-gate.spec.ts; recommendation-review-workflow-api.spec.ts; review-monitoring-service.spec.ts | Gate blocks suitability/IPS/committee and monitoring/review actions remain clientVisible=false | Missing full MVP advisor→compliance→client projection proof | PARTIAL_P0_PROOF | Codex blocked for end-to-end advice release |
| P0_AI_DRAFT_INTERNAL_ONLY_GATE | AI/rules draft never client-visible before approved release. | No direct dedicated test found | None explicit | Negative test for client/export/API containing AI Draft is missing | P0_GATE_NOT_COVERED | Hard blocker before client payload tasks |
| P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval does not equal compliance release. | workflow-gate.spec.ts; permission-engine.spec.ts | High-risk only-advisor approval blocked; principal cannot release | Missing standard advisor approval route/API state proof that clientVisible remains false | P0_NEGATIVE_TEST_MISSING | Codex blocked for advisor approval flow |
| P0_COMPLIANCE_RELEASE_GATE | Compliance release/block/request-evidence enforced. | permission-engine.spec.ts; recommendation-review-workflow-api.spec.ts | Compliance role can release decision at permission level; request/block demo actions succeed | Missing end-to-end compliance release with evidence and client-safe projection | PARTIAL_P0_PROOF | Codex blocked for production release |
| P0_ADMIN_NON_BYPASS_GATE | Admin cannot bypass gates. | No dedicated admin bypass test found; inherited permission tests partial | Some non-compliance role denial slices | Explicit admin force-release/evidence/export/visibility bypass tests missing | P0_NEGATIVE_TEST_MISSING | Hard blocker |
| P0_UPLOAD_NOT_SUFFICIENCY_GATE | Upload success does not unlock evidence sufficiency or release. | document-upload-api.spec.ts; document-upload-flow.spec.ts | Upload stores domain/audit rows and UI confirms queued for extraction review | Missing explicit assertion that release/export/visibility remains blocked after upload | P0_NEGATIVE_TEST_MISSING | Blocker for evidence sufficiency claim |
| P0_EVIDENCE_SUFFICIENCY_GATE | Sufficiency requires reviewed, linked, relevant, scoped and accepted evidence. | document-upload-api.spec.ts partial; workflow-gate.spec.ts logic partial | Evidence records/items created; gate requires evidence in suitability/committee scenarios | No reviewed-linked-sufficient lifecycle test for MVP release | P0_POSITIVE_TEST_MISSING | Blocker |
| P0_AUDIT_PERSISTENCE_GATE | Critical gate actions write audit events. | document-upload-api.spec.ts; permission-engine.spec.ts; recommendation-review-workflow-api.spec.ts; review-monitoring-service.spec.ts | Upload success/denial and denied release audit; demo actions auditRows=1 | Missing audit persistence proof for all critical MVP gates and export approval/download | PARTIAL_P0_PROOF | Blocker for complete audit claim |
| P0_AUDIT_FAIL_CLOSED_GATE | Safety actions fail/hold when audit cannot persist. | No direct test found | None | Simulated audit failure tests missing | P0_GATE_NOT_COVERED | Hard blocker |
| P0_EXPORT_REDACTION_GATE | Export prevents internal data leakage. | file-export-realism.spec.ts | Requires redaction profile and watermark for manifest | No forbidden-field redaction test; no route/API payload test | P0_NEGATIVE_TEST_MISSING | Blocker |
| P0_EXPORT_APPROVAL_GATE | Preview, approval and download/share are separate. | file-export-realism.spec.ts; recommendation-review-workflow-api.spec.ts partial | Manifest blocks without approval; demo export actions return success | No lifecycle test proving preview != approval != download/share with audit | PARTIAL_P0_PROOF | Blocker |
| P0_API_VALIDATION_GATE | APIs validate requests/files/preconditions. | recommendation-review-workflow-api.spec.ts; document-upload-api.spec.ts; file-export-realism.spec.ts service | Invalid action 400; invalid file type 400; unsafe metadata rejected | Missing validation matrix for documents GET, review-monitoring query and all workflow action preconditions | PARTIAL_P0_PROOF | Blocker for complete API claim |
| P0_API_ERROR_FAIL_CLOSED_GATE | API errors do not advance workflow or expose data. | document-upload-api.spec.ts; recommendation-review-workflow-api.spec.ts | Invalid upload does not create row; invalid action rejected | Missing generic API failure/simulated DB failure/visibility fail-closed tests | P0_NEGATIVE_TEST_MISSING | Blocker |
| P0_SCHEMA_FIELD_SUPPORT_GATE | Schema fields support safety state/redaction/audit/evidence/export. | document-upload-api.spec.ts; permission-engine.spec.ts; data-quality-service.spec.ts | Some Document, EvidenceRecord, AuditEvent and permission fields are exercised | Missing field-level acceptance for AI Draft, client visibility eval, release/redaction fields | PARTIAL_P0_PROOF | Blocker before schema tasks |
| P0_STATE_FEEDBACK_GATE | UI states/feedback do not overclaim downstream gates. | document-upload-flow.spec.ts | Upload message says queued for extraction review | Missing UI negative/blocked/error states for all MVP flows | P0_POSITIVE_AND_NEGATIVE_TEST_MISSING | Blocker |
| P0_HOLD_ROUTE_BLOCK_GATE | Held routes do not silently become MVP implementation scope. | committee-review-routes.spec.ts; workflow-gate.spec.ts; review-monitoring-service.spec.ts | Held/P1 route proof slices exist but do not unlock scope | Need acceptance register ensuring 064–067/069–071 remain hold unless explicitly unlocked | PARTIAL_SCOPE_PROOF | Task Master must not include held routes silently |
| P0_MAIN_FALSE_GAP_BLOCK_GATE | No main-derived absence claim becomes target task. | Predecessor artefacts, not tests | False-gap source is blocked in docs/contracts | No automated test expected; must remain artefact-level acceptance condition | CONTRACT_PROOF_ONLY | Codex task master must preserve |


## 10. Route to Test Coverage Matrix

| Route ID | Path | Title | Scope Label | Object | Action | Existing Test Evidence | Required P0 Acceptance | Missing Negative Test | Missing Positive Test | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | /login | Authentication Login | MVP_SUPPORT | USER | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 002 | /mfa | Multi-Factor Authentication | MVP_SUPPORT | USER | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 003 | /onboarding/invite | Invitation Acceptance | MVP_SUPPORT | USER | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 004 | /onboarding/identity | Identity Setup | MVP_SUPPORT | USER | EDIT | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 005 | /onboarding/consent | Consent and Privacy | MVP_SUPPORT | USER | APPROVE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 006 | /onboarding/role-confirmation | Role Confirmation | MVP_SUPPORT | ROLE | APPROVE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 007 | /admin/platform | Platform Settings | MVP_SUPPORT | PLATFORM | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 008 | /admin/policies/advice-boundary | Advice Boundary Policy | MVP | PERMISSION | MANAGE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 009 | /admin/roles | Global Role Templates | MVP_SUPPORT | ROLE | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 010 | /admin/security | Security Configuration | MVP_SUPPORT | PERMISSION | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 011 | /admin/evidence-templates | Evidence Templates | MVP_SUPPORT | EVIDENCE_RECORD | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 012 | /admin/export-templates | Export Templates and Redaction | MVP_SUPPORT | EXPORT_REQUEST | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 013 | /admin/tenants | Tenant List | MVP_SUPPORT | TENANT | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 014 | /tenants/new | Create Client Tenant | MVP_SUPPORT | TENANT | CREATE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 015 | /tenants/:id/setup | Tenant Setup Dashboard | MVP_SUPPORT | TENANT | EDIT | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 016 | /tenants/:id/team | Assign AlphaVest Team | MVP_SUPPORT | TENANT | ASSIGN | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 017 | /tenants/:id/policies | Tenant Policies | MVP_SUPPORT | PERMISSION | MANAGE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 018 | /tenants/:id/users | Tenant Users | MVP_SUPPORT | USER | INVITE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 019 | /portal | Client Web Dashboard | MVP | TENANT | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 020 | /mobile | Mobile Home | MVP | TENANT | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 021 | /client/profile | Client Profile | MVP_SUPPORT | TENANT | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 022 | /client/family-members | Family Members | MVP_SUPPORT | FAMILY_MEMBER | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 023 | /relationships | Relationship Map | MVP_SUPPORT | RELATIONSHIP | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 024 | /entities | Entity List | MVP_SUPPORT | ENTITY | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 025 | /entities/new | Create Entity | MVP_SUPPORT | ENTITY | CREATE | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 026 | /entities/:id | Entity Detail | MVP_SUPPORT | ENTITY | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 027 | /documents | Documents List | MVP | DOCUMENT | VIEW | route-smoke.spec.ts: 200 + expected heading; document-upload-api/flow or evidence contract slices | Document/evidence states, RBAC and upload-not-sufficiency | release/export/client visibility after upload/review | evidence review/sufficiency lifecycle | PARTIAL_P0_PROOF |
| 028 | /documents/upload | Document Upload | MVP | DOCUMENT | UPLOAD | route-smoke.spec.ts: 200 + expected heading; document-upload-api/flow or evidence contract slices | Document/evidence states, RBAC and upload-not-sufficiency | release/export/client visibility after upload/review | evidence review/sufficiency lifecycle | PARTIAL_P0_PROOF |
| 029 | /documents/extraction-review | Extraction Review | MVP | DOCUMENT | REVIEW | route-smoke.spec.ts: 200 + expected heading; document-upload-api/flow or evidence contract slices | Document/evidence states, RBAC and upload-not-sufficiency | release/export/client visibility after upload/review | evidence review/sufficiency lifecycle | PARTIAL_P0_PROOF |
| 030 | /documents/verification-pending | Verification Pending | MVP | DOCUMENT | REVIEW | route-smoke.spec.ts: 200 + expected heading; document-upload-api/flow or evidence contract slices | Document/evidence states, RBAC and upload-not-sufficiency | release/export/client visibility after upload/review | evidence review/sufficiency lifecycle | PARTIAL_P0_PROOF |
| 031 | /wealth-map | Live Wealth Map | MVP_SUPPORT | ENTITY | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 032 | /actions | Action Board | MVP_SUPPORT | ACTION_ITEM | VIEW | route-smoke.spec.ts: 200 + expected heading | Conditional access/setup/context state if flow-relevant | support route access must not expand action/payload authority | flow-relevant setup success where needed | SUPPORTING_PROOF_ONLY |
| 033 | /signals | Signal Review | MVP | TRIGGER | REVIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 034 | /workbench | Consultant Workbench | MVP | TRIGGER | REVIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 035 | /workbench/triggers/:id | Trigger Detail | MVP | TRIGGER | REVIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 036 | /advisor-approval | Advisor Approval Queue | MVP | RECOMMENDATION | APPROVE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 037 | /advisor-approval/:id | Advisor Approval Detail | MVP | RECOMMENDATION | APPROVE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 038 | /compliance | Compliance Queue | MVP | RECOMMENDATION | REVIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 039 | /compliance/:id/review | Compliance Review Detail | MVP | RECOMMENDATION | REVIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 040 | /compliance/:id/release | Release to Client | MVP | RECOMMENDATION | RELEASE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 041 | /compliance/:id/block | Block or Request Evidence | MVP | RECOMMENDATION | BLOCK | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 042 | /compliance/:id/audit | Audit and Exception Log | MVP | AUDIT_EVENT | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 043 | /decisions | Decision List | MVP | DECISION | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 044 | /decisions/:id | Digital Decision Room | MVP | DECISION | APPROVE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 045 | /decisions/:id/success | Decision Submitted | MVP | DECISION | APPROVE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 046 | /evidence | Evidence Vault | MVP | EVIDENCE_RECORD | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 047 | /evidence/:id | Evidence Record Detail | MVP | EVIDENCE_RECORD | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 048 | /governance/users | Governance Users | MVP | USER | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 049 | /governance/roles | Role Management | MVP | ROLE | MANAGE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 050 | /governance/access-requests | Access Requests | MVP | PERMISSION | APPROVE | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 051 | /governance/audit-history | Access Audit History | MVP | AUDIT_EVENT | VIEW | route-smoke.spec.ts: 200 + expected heading; permission/workflow/demo API proof slices depending on flow | RBAC, no-unapproved-advice, visibility, audit | client leakage/admin bypass/advisor-not-release | approved/released/redacted safe projection | PARTIAL_P0_PROOF |
| 052 | /communication | Communication Centre | P1_AFTER_MVP | MESSAGE | VIEW | route-smoke.spec.ts: 200 + expected heading | Deferred from MVP P0 unless elevated | No MVP negative required now | No MVP positive required now | DEFERRED_P1_TEST_SCOPE |
| 053 | /communication/call-trigger | Call Trigger Matrix | P1_AFTER_MVP | MESSAGE | SCHEDULE | route-smoke.spec.ts: 200 + expected heading | Deferred from MVP P0 unless elevated | No MVP negative required now | No MVP positive required now | DEFERRED_P1_TEST_SCOPE |
| 054 | /export/new | Create Export | MVP | EXPORT_REQUEST | CREATE | route-smoke.spec.ts: 200 + expected heading; file-export-realism service-level only | Export scope/redaction/approval/download separation | forbidden internal payload in export | approved redacted export lifecycle | PARTIAL_P0_PROOF |
| 055 | /export/:id/scope | Export Scope Selection | MVP | EXPORT_REQUEST | EDIT | route-smoke.spec.ts: 200 + expected heading; file-export-realism service-level only | Export scope/redaction/approval/download separation | forbidden internal payload in export | approved redacted export lifecycle | PARTIAL_P0_PROOF |
| 056 | /export/:id/redaction | Export Redaction | MVP | EXPORT_REQUEST | REVIEW | route-smoke.spec.ts: 200 + expected heading; file-export-realism service-level only | Export scope/redaction/approval/download separation | forbidden internal payload in export | approved redacted export lifecycle | PARTIAL_P0_PROOF |
| 057 | /export/:id/preview | Export Preview | MVP | EXPORT_REQUEST | APPROVE | route-smoke.spec.ts: 200 + expected heading; file-export-realism service-level only | Export scope/redaction/approval/download separation | forbidden internal payload in export | approved redacted export lifecycle | PARTIAL_P0_PROOF |
| 058 | /export/:id/download | Export Download and Share | MVP | EXPORT_REQUEST | EXPORT | route-smoke.spec.ts: 200 + expected heading; file-export-realism service-level only | Export scope/redaction/approval/download separation | forbidden internal payload in export | approved redacted export lifecycle | PARTIAL_P0_PROOF |
| 059 | /ops/queues | Ops Queues | P1_AFTER_MVP | ACTION_ITEM | VIEW | route-smoke.spec.ts: 200 + expected heading | Deferred from MVP P0 unless elevated | No MVP negative required now | No MVP positive required now | DEFERRED_P1_TEST_SCOPE |
| 060 | /ops/sla | SLA and Escalation | P1_AFTER_MVP | ACTION_ITEM | ESCALATE | route-smoke.spec.ts: 200 + expected heading | Deferred from MVP P0 unless elevated | No MVP negative required now | No MVP positive required now | DEFERRED_P1_TEST_SCOPE |
| 061 | /service-blueprint | Service Blueprint | REFERENCE_ONLY | PLATFORM | VIEW | route-smoke.spec.ts: 200 + expected heading | No product P0 test contract; route shell only | None for MVP | None for MVP | REFERENCE_ONLY_NO_PRODUCT_TEST |
| 062 | /roadmap | MVP vs Future Scope | REFERENCE_ONLY | PLATFORM | VIEW | route-smoke.spec.ts: 200 + expected heading | No product P0 test contract; route shell only | None for MVP | None for MVP | REFERENCE_ONLY_NO_PRODUCT_TEST |
| 063 | /states | State and Badge Reference | REFERENCE_ONLY | PLATFORM | VIEW | route-smoke.spec.ts: 200 + expected heading | No product P0 test contract; route shell only | None for MVP | None for MVP | REFERENCE_ONLY_NO_PRODUCT_TEST |
| 064 | /kyc/:id/review | KYC / AML Review | HOLD_PENDING_DECISION | DOCUMENT | REVIEW | route-smoke.spec.ts: 200 + expected heading; recommendation-review-workflow-api.spec.ts J12 partial | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 065 | /kyc/:id/source-of-wealth | Source-of-Wealth Review | HOLD_PENDING_DECISION | TRIGGER | REVIEW | route-smoke.spec.ts: 200 + expected heading; recommendation-review-workflow-api.spec.ts J12 partial | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 066 | /suitability/:tenantId/profile | Suitability Profile | HOLD_PENDING_DECISION | ENGAGEMENT | REVIEW | route-smoke.spec.ts: 200 + expected heading; workflow-gate.spec.ts logic only | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 067 | /ips/:tenantId | IPS / Mandate | HOLD_PENDING_DECISION | POLICY | REVIEW | route-smoke.spec.ts: 200 + expected heading; workflow-gate.spec.ts logic only | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 068 | /reviews/calendar | Review Calendar | P1_AFTER_MVP | REVIEW_SCHEDULE | SCHEDULE | route-smoke.spec.ts: 200 + expected heading; review-monitoring-service.spec.ts partial | Deferred from MVP P0 unless elevated | No MVP negative required now | No MVP positive required now | DEFERRED_P1_TEST_SCOPE |
| 069 | /monitoring/rebalance | Rebalance Monitoring | HOLD_PENDING_DECISION | TRIGGER | REVIEW | route-smoke.spec.ts: 200 + expected heading; review-monitoring-service.spec.ts partial | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 070 | /committee/reviews | Committee Review Queue | HOLD_PENDING_DECISION | RECOMMENDATION | REVIEW | route-smoke.spec.ts: 200 + expected heading; committee-review-routes.spec.ts; workflow-gate.spec.ts logic | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |
| 071 | /committee/reviews/:id | Committee Review Detail | HOLD_PENDING_DECISION | RECOMMENDATION | REVIEW | route-smoke.spec.ts: 200 + expected heading; committee-review-routes.spec.ts; workflow-gate.spec.ts logic | No final MVP P0 test until route/safety/screen unlock | silent MVP inclusion / client leakage if elevated | only after hold lifted | HOLD_BLOCKED_NO_TEST_FINALIZATION |


## 11. API to Test Acceptance Matrix

| API Route | Existing Test Evidence | Request Validation Proof | Response Safety Proof | RBAC/Object Scope Proof | Redaction Proof | Audit Proof | Error/Fail-Closed Proof | Missing Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| deleted generic workflow route | recommendation-review-workflow-api.spec.ts; review-monitoring-service.spec.ts J16/J17 | Invalid action payload 400 | noClientRelease/clientVisible=false for selected action families | Partial; not full actor/object matrix | Partial; clientVisible false, no forbidden field scan | auditRows=1 for selected actions | Malformed payload rejects; no DB failure simulation | Add action-family negative tests for release, advisor-not-release, admin non-bypass, forbidden payloads | PARTIAL_P0_PROOF |
| /api/documents | document-upload-api.spec.ts reload GET after upload | tenantSlug query exercised only via reload | Returns uploaded document row; no redaction scan | Not proven beyond upload context | Not proven for client/internal role contexts | No audit expectation for read/list | No empty/error/denied path proof | Add list RBAC, tenant isolation, empty state, hidden/redacted payload tests | P0_NEGATIVE_TEST_MISSING |
| /api/documents/upload | document-upload-api.spec.ts; document-upload-flow.spec.ts | Valid PDF accepted; unsupported type rejected; forbidden role denied | Stores document/version/extraction/evidence/audit; browser success message | Role allow/deny partial; object scope partial | No client redaction assertion; upload visibility not release proof | Success and denied audit proven | Invalid file no row; denied role audit; no size/missing tenant/DB failure proof | Add upload-does-not-unlock-release/export/client-visible tests; file size/missing metadata tests | STRONG_PROOF_SLICE_BUT_PARTIAL |
| /api/review-monitoring | review-monitoring-service.spec.ts | asOf query exercised | Internal due/overdue/rebalance state, clientVisible=false | No RBAC/object scope proof | clientVisible false in rows | auditProof latest event types via demo action | No denied/error/bad query fail-closed test | Route is P1/hold-sensitive; add no-auto-advice and access-denied tests if elevated | DEFERRED_P1_OR_HOLD_SUPPORTING_PROOF |


## 12. Schema / Field-Level Test Acceptance Matrix

| Schema Workset | Models / Fields | Required P0 Proof | Existing Test Evidence | Missing Acceptance Proof | Status |
| --- | --- | --- | --- | --- | --- |
| Identity / Tenant | PlatformTenant, ClientTenant, User, UserProfile | Tenant isolation and actor/session scope | permission-engine cross-tenant denial | Missing route/API payload tenant isolation matrix | P0_NEGATIVE_TEST_MISSING |
| RBAC / Permission | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation | Action/object permission, second confirmation, admin non-bypass | permission-engine.spec.ts partial | Missing full role/action/object matrix and second-confirmation tests | PARTIAL_P0_PROOF |
| Policy / Guardrail | PolicyDefinition, Permission flags | Advice boundary and policy enforcement | No direct policy persistence test | Missing admin policy save/enforcement/audit tests | P0_GATE_NOT_COVERED |
| Recommendation / Advice | Recommendation, RecommendationOption | AI Draft/internal summary/advice status/client visibility | workflow-gate.spec.ts logic partial | Missing AI Draft redaction and recommendation payload leakage tests | P0_NEGATIVE_TEST_MISSING |
| Approval / Compliance / Decision | Approval, ComplianceReview, Decision, DecisionParticipant | Advisor approval vs compliance release/client release | workflow-gate.spec.ts and permission-engine partial | Missing end-to-end state progression and released client projection test | PARTIAL_P0_PROOF |
| Documents / Extraction / Review | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink | Upload, extraction, review, linkage | document-upload-api.spec.ts strong upload slice | Missing review-to-sufficiency and release-block proof | STRONG_PROOF_SLICE_BUT_PARTIAL |
| Evidence | EvidenceRecord, EvidenceItem | Evidence sufficiency, visibility, link to object | document-upload-api.spec.ts creates rows | Missing sufficiency lifecycle and client-safe evidence summary tests | P0_POSITIVE_TEST_MISSING |
| Audit | AuditEvent | Persistence for gate actions and denied actions | document-upload-api.spec.ts; permission-engine.spec.ts; typed-workflow-api rows | Missing audit-failure fail-closed and all critical gates | PARTIAL_P0_PROOF |
| Export | ExportRequest, Document generated exports | Export scope/redaction/approval/download separation | file-export-realism.spec.ts service-level | Missing payload forbidden fields, route/API lifecycle and audit tests | P0_NEGATIVE_TEST_MISSING |
| Review / Ops / Communication | ReviewSchedule, QueueItem, MessageThread, Message | P1 review rhythm and communication visibility | review-monitoring-service.spec.ts partial | P1/deferred unless elevated; no MVP blocker except no-auto-advice if used | DEFERRED_P1 |


## 13. Safety Contract to Test Matrix

| Safety Contract | Existing Test Evidence | Current Proof | Missing Proof | Status |
| --- | --- | --- | --- | --- |
| RBAC / Client Visibility / Advice Boundary | permission-engine.spec.ts; workflow-gate.spec.ts; recommendation-review-workflow-api.spec.ts | Partial positive/negative slices | AI Draft redaction, client payload field leakage, admin non-bypass suite, route access vs payload visibility | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| Feedback / Validation / Error States | document-upload-flow.spec.ts; recommendation-review-workflow-api.spec.ts invalid payload | Upload success message and selected invalid payload response | UI error/retry/blocked/permission states across all MVP routes | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| Drawer / Modal / Interaction | No dedicated drawer/modal lifecycle test found | Upload interaction is implemented; selected demo actions post | Overlay open/close/cancel/submit/focus/escape/validation/audit tests where route-relevant | P0_NEGATIVE_AND_POSITIVE_TESTS_MISSING |
| State Screen Spec | route-smoke.spec.ts; document-upload-flow.spec.ts partial | Route rendering and upload success state | Permission denied, release pending, blocked, evidence-needed and redacted states across MVP routes | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| API Contract | recommendation-review-workflow-api.spec.ts; document-upload-api.spec.ts; review-monitoring-service.spec.ts | Selected validation and success/error slices | Complete API validation, fail-closed error and redaction suite | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| Schema Field-Level | document-upload-api.spec.ts; permission-engine.spec.ts; data-quality-service.spec.ts | Selected Prisma field/service usage | AI Draft, ClientVisibilityEvaluation-equivalent, release/redaction/export/evidence field acceptance | BLOCKER_BEFORE_CODEX_TASK_MASTER |


## 14. Evidence / Audit / Export Test Matrix

| Area | Existing Evidence | What Is Proven | Missing Proof | Status |
| --- | --- | --- | --- | --- |
| Upload mechanics | document-upload-api.spec.ts; document-upload-flow.spec.ts | Strong positive upload/API/UI proof; invalid file and denied role proof | Explicit downstream gate remains locked after upload | PARTIAL_P0_PROOF |
| Evidence sufficiency | document-upload-api.spec.ts creates EvidenceRecord/EvidenceItem | Evidence rows exist after upload | Reviewed/linked/relevant/scoped/accepted evidence sufficiency lifecycle | P0_POSITIVE_TEST_MISSING |
| Audit persistence | document-upload-api.spec.ts; permission-engine.spec.ts; recommendation-review-workflow-api.spec.ts | AuditEvent success/denied rows and auditRows=1 slices | Audit failure fail-closed and all critical gate action coverage | PARTIAL_P0_PROOF |
| Export metadata | file-export-realism.spec.ts | Metadata and manifest validation; blocks no approval/redaction/watermark | Client-safe payload redaction, forbidden internal fields, route/API lifecycle, audit | P0_NEGATIVE_TEST_MISSING |
| Export lifecycle | file-export-realism.spec.ts; recommendation-review-workflow-api.spec.ts j08 actions | Approval required before generation at service level; demo actions success | Preview != approval != download/share, plus no client acceptance overclaim | P0_NEGATIVE_TEST_MISSING |


## 15. Required Positive P0 Tests

| Missing Test ID | Target Gate | Target Route/API/Service | Required Scenario | Positive/Negative | Why Needed | Blocker Status | Later Codex Task Eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-POS-001 | P0_ROUTE_ACCESS_GATE | MVP route shell + authorized role | Permitted internal user can access scoped MVP route and sees only allowed shell/content. | Positive | Needed because route smoke is anonymous/shell only. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible only as later Codex test task after matrix acceptance |
| P0-POS-002 | P0_UPLOAD_NOT_SUFFICIENCY_GATE | /documents/upload and /api/documents/upload | Valid upload succeeds, persists rows, and UI/API states explicitly remain upload-only. | Positive | Closes upload happy path without overclaiming sufficiency. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-003 | P0_EVIDENCE_SUFFICIENCY_GATE | Evidence/document review services | Reviewed, linked, relevant evidence can become sufficient only for scoped gate. | Positive | Evidence creation currently does not prove sufficiency lifecycle. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-004 | P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval routes/API | Advisor approval creates advisor-approved, not client-released state. | Positive | Separates advisor and compliance gates. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-005 | P0_COMPLIANCE_RELEASE_GATE | Compliance release routes/API | Compliance release after prerequisites creates client-safe released projection. | Positive | Core MVP proof path. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-006 | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | /portal, /mobile, client payloads | Client receives only released/redacted content. | Positive | Client-safe product promise. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-007 | P0_AUDIT_PERSISTENCE_GATE | Critical gate actions | Advisor approve, compliance release/block, evidence request and export approval write audit events. | Positive | Audit proof spine. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-008 | P0_EXPORT_APPROVAL_GATE | Export routes/services | Export scope → redaction → approval → download/share lifecycle remains separated. | Positive | Prevents preview/download overclaim. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-009 | P0_API_ERROR_FAIL_CLOSED_GATE | All four APIs | Safe empty/hidden/denied state returned when no released content exists. | Positive | API fail-closed behaviour. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |


## 16. Required Negative P0 Tests

| Missing Test ID | Target Gate | Target Route/API/Service | Required Scenario | Positive/Negative | Why Needed | Blocker Status | Later Codex Task Eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-NEG-001 | P0_AI_DRAFT_INTERNAL_ONLY_GATE | Client portal/API/export | Client must not see AI Draft or internal rationale. | Negative | Core no-unapproved-advice leakage case. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-002 | P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval flow | Advisor approval alone must not set clientVisible or releasedToClientAt. | Negative | Avoids false release. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-003 | P0_ADMIN_NON_BYPASS_GATE | Admin/governance roles | Admin cannot force release, evidence sufficiency, visibility or export approval. | Negative | Admin non-bypass is explicit MVP rule. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-004 | P0_UPLOAD_NOT_SUFFICIENCY_GATE | Upload API/UI | Upload success must not unlock release/export/client visibility. | Negative | Existing upload test creates evidence rows but does not assert blocked downstream gates. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-005 | P0_EVIDENCE_SUFFICIENCY_GATE | Evidence service/gate | Unreviewed, stale, wrong-scope or unlinked evidence must not unlock release. | Negative | Sufficiency is contextual. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-006 | P0_EXPORT_REDACTION_GATE | Export package | Export must not contain internal rationale, compliance notes, AI Draft or unreleased evidence. | Negative | Current export test checks manifest controls, not forbidden payloads. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-007 | P0_EXPORT_APPROVAL_GATE | Export lifecycle | Preview must not equal approval; approval must not equal download/share. | Negative | Lifecycle separation required. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-008 | P0_API_ERROR_FAIL_CLOSED_GATE | All APIs | API error must not advance workflow or expose data. | Negative | Only invalid action/upload covered partially. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-009 | P0_AUDIT_FAIL_CLOSED_GATE | Audit service/API paths | If required audit cannot persist, safety action remains denied/pending. | Negative | No simulated audit failure proof found. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-010 | P0_PAYLOAD_VISIBILITY_GATE | Route/action/payload boundary | Route access must not grant payload visibility. | Negative | Payload-level tests are missing. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-011 | P0_HOLD_ROUTE_BLOCK_GATE | Routes 064–067 and 069–071 | Held routes must not enter MVP task scope silently. | Negative | Protects unresolved visual/safety scope. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Task-master acceptance rule |
| P0-NEG-012 | P0_MAIN_FALSE_GAP_BLOCK_GATE | Codex task inputs | main-derived absence claims must not become target gaps/tasks. | Negative | Protects rebase integrity. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Task-master acceptance rule |


## 17. Missing Test Backlog Without Implementation

The following backlog is acceptance planning only. No tests are written in this artefact. Each row may become a later Codex task only after the roadmap reaches `FINAL_CODEX_TASK_MASTER.md`.


| Missing Test ID | Test Type | Target Gate | Target Route/API/Service | Required Scenario | Why Needed | Blocker Status | Later Codex Task Eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-POS-001 | Positive | P0_ROUTE_ACCESS_GATE | MVP route shell + authorized role | Permitted internal user can access scoped MVP route and sees only allowed shell/content. | Needed because route smoke is anonymous/shell only. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible only as later Codex test task after matrix acceptance |
| P0-POS-002 | Positive | P0_UPLOAD_NOT_SUFFICIENCY_GATE | /documents/upload and /api/documents/upload | Valid upload succeeds, persists rows, and UI/API states explicitly remain upload-only. | Closes upload happy path without overclaiming sufficiency. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-003 | Positive | P0_EVIDENCE_SUFFICIENCY_GATE | Evidence/document review services | Reviewed, linked, relevant evidence can become sufficient only for scoped gate. | Evidence creation currently does not prove sufficiency lifecycle. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-004 | Positive | P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval routes/API | Advisor approval creates advisor-approved, not client-released state. | Separates advisor and compliance gates. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-005 | Positive | P0_COMPLIANCE_RELEASE_GATE | Compliance release routes/API | Compliance release after prerequisites creates client-safe released projection. | Core MVP proof path. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-006 | Positive | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | /portal, /mobile, client payloads | Client receives only released/redacted content. | Client-safe product promise. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-007 | Positive | P0_AUDIT_PERSISTENCE_GATE | Critical gate actions | Advisor approve, compliance release/block, evidence request and export approval write audit events. | Audit proof spine. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-008 | Positive | P0_EXPORT_APPROVAL_GATE | Export routes/services | Export scope → redaction → approval → download/share lifecycle remains separated. | Prevents preview/download overclaim. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-POS-009 | Positive | P0_API_ERROR_FAIL_CLOSED_GATE | All four APIs | Safe empty/hidden/denied state returned when no released content exists. | API fail-closed behaviour. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-001 | Negative | P0_AI_DRAFT_INTERNAL_ONLY_GATE | Client portal/API/export | Client must not see AI Draft or internal rationale. | Core no-unapproved-advice leakage case. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-002 | Negative | P0_ADVISOR_NOT_RELEASE_GATE | Advisor approval flow | Advisor approval alone must not set clientVisible or releasedToClientAt. | Avoids false release. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-003 | Negative | P0_ADMIN_NON_BYPASS_GATE | Admin/governance roles | Admin cannot force release, evidence sufficiency, visibility or export approval. | Admin non-bypass is explicit MVP rule. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-004 | Negative | P0_UPLOAD_NOT_SUFFICIENCY_GATE | Upload API/UI | Upload success must not unlock release/export/client visibility. | Existing upload test creates evidence rows but does not assert blocked downstream gates. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-005 | Negative | P0_EVIDENCE_SUFFICIENCY_GATE | Evidence service/gate | Unreviewed, stale, wrong-scope or unlinked evidence must not unlock release. | Sufficiency is contextual. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-006 | Negative | P0_EXPORT_REDACTION_GATE | Export package | Export must not contain internal rationale, compliance notes, AI Draft or unreleased evidence. | Current export test checks manifest controls, not forbidden payloads. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-007 | Negative | P0_EXPORT_APPROVAL_GATE | Export lifecycle | Preview must not equal approval; approval must not equal download/share. | Lifecycle separation required. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-008 | Negative | P0_API_ERROR_FAIL_CLOSED_GATE | All APIs | API error must not advance workflow or expose data. | Only invalid action/upload covered partially. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-009 | Negative | P0_AUDIT_FAIL_CLOSED_GATE | Audit service/API paths | If required audit cannot persist, safety action remains denied/pending. | No simulated audit failure proof found. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-010 | Negative | P0_PAYLOAD_VISIBILITY_GATE | Route/action/payload boundary | Route access must not grant payload visibility. | Payload-level tests are missing. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Eligible later |
| P0-NEG-011 | Negative | P0_HOLD_ROUTE_BLOCK_GATE | Routes 064–067 and 069–071 | Held routes must not enter MVP task scope silently. | Protects unresolved visual/safety scope. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Task-master acceptance rule |
| P0-NEG-012 | Negative | P0_MAIN_FALSE_GAP_BLOCK_GATE | Codex task inputs | main-derived absence claims must not become target gaps/tasks. | Protects rebase integrity. | BLOCKER_BEFORE_CODEX_TASK_MASTER | Task-master acceptance rule |


## 18. P0 Blocker Register

| Blocker ID | Blocker | Gate | Status |
| --- | --- | --- | --- |
| B-P0-001 | AI Draft internal-only has no dedicated negative leakage test. | P0_AI_DRAFT_INTERNAL_ONLY_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-002 | Client portal/mobile fail-closed payload redaction is not proven end-to-end. | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-003 | Admin non-bypass across release, evidence, visibility and export is not proven. | P0_ADMIN_NON_BYPASS_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-004 | Upload success is not explicitly tested against release/export/client-visibility lock. | P0_UPLOAD_NOT_SUFFICIENCY_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-005 | Evidence sufficiency lifecycle is missing. | P0_EVIDENCE_SUFFICIENCY_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-006 | Audit-failure fail-closed behaviour is missing. | P0_AUDIT_FAIL_CLOSED_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-007 | Export forbidden internal payload redaction is missing. | P0_EXPORT_REDACTION_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-008 | Export preview/approval/download/share separation is only partially proven. | P0_EXPORT_APPROVAL_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |
| B-P0-009 | Route smoke is not route safety or RBAC proof. | P0_ROUTE_ACCESS_GATE | OVERCLAIM_RISK |
| B-P0-010 | Held routes 064–067 and 069–071 must remain out of MVP tasks unless unlocked by later artefacts. | P0_HOLD_ROUTE_BLOCK_GATE | BLOCKER_BEFORE_CODEX_TASK_MASTER |


## 19. Codex Readiness Decision

| Decision Field | Value | Reason |
| --- | --- | --- |
| P0 Test Acceptance Gate | P0_TEST_ACCEPTANCE_GATE_PARTIAL_NOT_PASSED | Existing tests are meaningful proof slices, but missing P0 negative and positive tests remain. |
| Codex Readiness | CODEX_HANDOFF_NOT_READY | Codex would still need to infer or create safety proof obligations. |
| Task Master Readiness | BLOCKED | Missing P0 proof cases must be preserved and only later converted into tasks. |
| Final Handoff Readiness | BLOCKED | The final handoff must be implementation-only and cannot include unresolved P0 proof decisions. |
| Screen Brief Readiness | MAY_PROCEED_AS_PREPARATION_ONLY | The next roadmap artefact may decide whether screen generation is needed; it must not implement or bypass P0 blockers. |


## 20. Downstream Routing to SCREEN_GENERATION_BRIEF_IF_NEEDED.md

`SCREEN_GENERATION_BRIEF_IF_NEEDED.md` may proceed only as a non-implementation preparation artefact. It must inherit this matrix and must not use visual gaps, route smoke tests or existing UI states to imply behaviour/safety completeness. Routes `064–067` and `069–071` remain hold-blocked; route `068` remains P1; routes `061–063` remain reference-only. No Codex task may be produced from this artefact alone.


## 21. Acceptance Criteria

| # | Acceptance Criterion | Status |
| --- | --- | --- |
| 1 | Roadmap position 12 of 15 validated | PASS |
| 2 | All 11 predecessor artefacts checked and used | PASS |
| 3 | All 10 existing tests mapped | PASS |
| 4 | Positive proof separated from negative proof | PASS |
| 5 | Test presence separated from assertion proof | PASS |
| 6 | P0 gates mapped explicitly | PASS |
| 7 | 31 MVP routes and 25 conditional MVP_SUPPORT routes mapped | PASS |
| 8 | 4 APIs mapped to acceptance coverage | PASS |
| 9 | Schema-field safety concepts mapped to test obligations | PASS |
| 10 | Missing positive and negative P0 tests identified | PASS |
| 11 | Codex blocked where P0 proof is missing | PASS |
| 12 | full-workflow retained as target codebase | PASS |
| 13 | main retained as false-gap source only | PASS |
| 14 | No implementation, test writing, screen generation or Codex tasks performed | PASS |
| 15 | ENGINE proof included | PASS |


## 22. Stop Rules Confirmation

| Stop Rule | Status |
| --- | --- |
| No implementation | CONFIRMED |
| No test implementation | CONFIRMED |
| No test code | CONFIRMED |
| No code changes | CONFIRMED |
| No API changes | CONFIRMED |
| No Prisma changes | CONFIRMED |
| No migrations | CONFIRMED |
| No route changes | CONFIRMED |
| No UI changes | CONFIRMED |
| No screen generation | CONFIRMED |
| No state-screen generation | CONFIRMED |
| No image generation | CONFIRMED |
| No Codex tasks | CONFIRMED |
| No final Codex handoff | CONFIRMED |
| No use of main as target codebase | CONFIRMED |
| No main-based gaps as target gaps | CONFIRMED |
| No blind patch-schema replacement | CONFIRMED |
| No assumption that existing tests prove full P0 safety | CONFIRMED |
| No assumption that route smoke tests prove route safety | CONFIRMED |
| No assumption that upload tests prove evidence sufficiency | CONFIRMED |
| No assumption that permission tests prove payload visibility | CONFIRMED |
| No assumption that export tests prove redaction unless assertions prove it | CONFIRMED |
| No assumption that Codex may start | CONFIRMED |


## 23. ENGINE Proof

| Phase | What Was Checked | Evidence Used | Decision | Residual Risk |
| --- | --- | --- | --- | --- |
| ENGINE_v3 — Charter | Target artefact and roadmap position validated. | Roadmap v0.8; uploaded prompt | Position 12 / P0 matrix only | None |
| ENGINE_v3 — Evidence | Predecessors, tests and target codebase checked. | All predecessor `.md` files; `/tests/*.spec.ts`; route registry | All required inputs present | Assertion depth is mapped but not executed |
| ENGINE_v3 — Framing | Separated tests from implementation and proof from presence. | Test files and contracts | P0 gate partial/not passed | Future Codex must not overclaim |
| ENGINE_v3 — Divergence | Covered route, API, schema, feedback, safety, evidence, audit and export gates. | Predecessor contracts | All major P0 dimensions included | Some detailed assertions require later implementation tasks |
| ENGINE_v3 — Contradictions | Resolved overclaims: route smoke is not safety; upload is not sufficiency; API exists is not safe. | Existing test assertions | Overclaim risks made explicit | Needs later negative tests |
| ENGINE_v3 — Branch Build | Built existing-test, P0-gate, route, API, schema and backlog matrices. | Full-workflow tests and predecessor worksets | Structured acceptance matrix produced | None |
| ENGINE_v3 — Debate | Held routes and P1 routes not silently promoted. | Route scope lock | 064–067 and 069–071 remain hold; 068 P1 | Future unlock needs separate artefact |
| ENGINE_v3 — Adversarial | Negative tests identified for leakage, bypass, audit failure, export and false route inclusion. | Safety contracts | Missing negatives marked blockers | Codex remains blocked |
| ENGINE_v3 — Convergence | Final decision selected. | All matrices | P0_TEST_ACCEPTANCE_GATE_PARTIAL_NOT_PASSED | None |
| ENGINE_v3 — Proof | Stop rules and acceptance criteria confirmed. | This artefact | No implementation performed | None |
| ENGINE_v2 — Map vs Reality | Product/control rules separated from code and tests. | Contracts and test assertions | Proof slices only | Future implementation still needed |
| ENGINE_v2 — Dependency Logic | P0 matrix placed before screen brief and task master. | Roadmap v0.8 | Correct sequence preserved | Task Master blocked |
| ENGINE_v2-B | File/path-specific handoff discipline applied without tasks. | Exact test/API/route/schema names | Ready for later task conversion, not now | No Codex tasks created |
| ENGINE_v2 Compression | Output compressed into reusable matrices and blocker register. | All sources | Portable artefact | None |