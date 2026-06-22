# API_CONTRACT_MATRIX.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Artefact status:** `API_CONTRACT_MATRIX_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**API gate status:** `API_CONTRACT_GATE_CONTRACTED_NOT_IMPLEMENTED`

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact creates the AlphaVest WealthOS API contract matrix for the **existing** full-workflow API baseline. The target codebase contains four API routes and those routes must be treated as existing implementation surfaces, not as missing APIs:

1. `/api/demo-workflow`
2. `/api/documents`
3. `/api/documents/upload`
4. `/api/review-monitoring`

The core decision is strict: **API route presence is not API safety proof.** A successful API response is not downstream gate completion. Upload success is not evidence sufficiency. Demo workflow mutation is not production persistence proof. Review monitoring is not automated advice execution. Export preview or package generation is not client acceptance. Route access is not action permission. Action permission is not payload visibility. Admin authority is not a bypass of advice, compliance, evidence, audit, visibility, redaction or export gates.

This artefact is a **contract artefact only**. It does not implement API routes, change API code, create new handlers, change request/response code, change Prisma, create migrations, write tests, create screens, generate state-screen images, generate visual assets, create Codex tasks or prepare final Codex handoff.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
|---|---|---|
| Artefact | `API_CONTRACT_MATRIX.md` | PASS |
| Position | 10 of 15 | PASS |
| Direct predecessor | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | PASS — exists and used |
| Direct successor | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | PREPARED_ONLY |
| Required predecessor 1 | `MVP_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 2 | `ROUTE_SCOPE_LOCK.md` | PASS — exists and used |
| Required predecessor 3 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | PASS — exists and used |
| Required predecessor 4 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | PASS — exists and used |
| Required predecessor 5 | `STATE_SCREEN_SPEC.md` | PASS — exists and used |
| Required predecessor 6 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | PASS — exists and used |
| Required predecessor 7 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | PASS — exists and used |
| Required predecessor 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | PASS — exists and used |
| Required predecessor 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | PASS — exists and used |
| Codex status | `CODEX_HANDOFF_NOT_READY` | BLOCKED |
| Implementation status | No implementation | BLOCKED |
| API creation status | No new API routes | BLOCKED |
| Screen / state-screen / image generation | No generation | BLOCKED |

All required predecessor artefacts are present in the current project source set and are treated as binding inputs. No open predecessor decision is silently re-decided in this artefact.

## 3. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Sequence, readiness gates, stop rules, dependencies | Bypassing sequence or starting Codex |
| 2 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Binding direct predecessor | Evidence sufficiency, audit persistence, export safety, upload-is-not-sufficiency, export redaction rules | Weakening evidence/audit/export safety |
| 3 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Binding predecessor | RBAC, route/action/object/payload visibility, fail-closed visibility, AI Draft internal-only, no-unapproved-advice | Treating route access as payload permission |
| 4 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding predecessor | Feedback, validation, error, permission, blocked, upload-only success and no-overclaim rules | Treating feedback as implementation proof |
| 5 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Binding predecessor | Interaction lifecycles, upload, action and overlay contracts | Treating visible UI as API behaviour proof |
| 6 | `STATE_SCREEN_SPEC.md` | Binding predecessor | Required route/flow states and fail-closed states | Reclassifying state scope |
| 7 | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Binding predecessor | Missing screen/state-screen decisions, P1/reference/hold blockers | Authorizing generation |
| 8 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Binding predecessor | Route/component/visual status and proof limits | Treating PNGs as API or behaviour proof |
| 9 | `ROUTE_SCOPE_LOCK.md` | Binding predecessor | Locked scope labels for all 71 routes | Reclassifying route scope |
| 10 | `MVP_SCOPE_LOCK.md` | Binding predecessor | MVP boundary, non-goals and P0 safety scope | Inventing conflicting MVP scope |
| 11 | `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB layer | Full-workflow schema baseline and schema/domain/patch mapping | Blind schema replacement or treating schema gate as passed |
| 12 | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction reality layer | Implemented/partial/deterministic/static distinction | Treating component presence as lifecycle proof |
| 13 | `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual/state layer | 71 routes, 63 public PNGs, unresolved `064–071` | Generating screens or assuming 63 PNGs cover 71 routes |
| 14 | `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness layer | `CODEX_HANDOFF_NOT_READY`, open readiness gates | Overclaiming readiness |
| 15 | `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap cleanup | Blocks `main` absence claims | Deriving target gaps/tasks from `main` |
| 16 | `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Validated inventory | 405 files, 71 routes, 4 APIs, 42 Prisma models, 10 specs, 63 PNGs | Treating inventory as MVP safety proof |
| 17 | `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | Recovery/versioning protocol | Source hierarchy and version discipline | Letting v0.1 override newer layers |
| 18 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP Control Spec | Advice boundary, RBAC, client visibility, workflow, evidence, audit, export, acceptance-gate concepts | Replacing full-workflow code/schema |
| 19 | `local repository checkout / pull of target branch full-workflow` | Primary target codebase | Target APIs, routes, files, components, Prisma, tests, services, assets | Assuming all present code is ready |
| 20 | `main branch as false-gap / historical only; never target truth` | False-gap source only | Historical comparison only | Any target truth or Codex task |

`full-workflow` is the only target codebase. `main` is false-gap source only. The MVP patch is Control Spec only. The full-workflow schema remains the baseline and is not replaced in this artefact.

## 4. Binding Predecessor Decisions

### 4.1 MVP Boundary

AlphaVest MVP is locked as a controlled, digital, human-backed, evidence-backed Family Office workflow platform.

MVP core includes internal draft preparation, analyst/advisor review, advisor approval, compliance review/release/block, client visibility, decision records, document/evidence intake, audit trail, RBAC/governance baseline and safe export/redaction.

Excluded from MVP and from this artefact as implementation scope are autonomous advice, client-visible AI Draft, manual client-visibility override, admin bypass, upload-to-release shortcut, blind schema replacement, production banking/custody integration, real client pilot and implementation from `main`.

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

* Routes `001–063` have matched public clean PNGs, but visual coverage is not behaviour or API proof.
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

### 4.4 Safety Inheritance

This API matrix inherits the prior safety contract:

* Route access is not action permission.
* Action permission is not payload visibility.
* Object scope is tenant / engagement / document / decision / evidence / export scoped.
* Client-facing payloads must be `CLIENT_SAFE_RELEASED_ONLY`.
* AI Draft is `AI_DRAFT_INTERNAL_ONLY`.
* Internal rationale, analyst notes and compliance notes are not client payloads.
* Advisor approval is not compliance release.
* Compliance release is required before client visibility.
* Admin cannot bypass advice, compliance, evidence, audit, visibility or export gates.
* Upload success must not unlock evidence sufficiency, release, export or client visibility.

## 5. Existing API Baseline

| API Route | Source Evidence | Current Baseline | MVP Relevance | Safety Relevance | Contract Depth | Proof Limit | Codex Status |
|---|---|---|---|---|---|---|---|
| `/api/demo-workflow` | `app/api/demo-workflow/route.ts` | `API_EXISTS_BASELINE`; `POST` route observed | MVP / MVP_SUPPORT / P1 / HOLD depending on action family | Advice boundary, workflow, RBAC, audit, evidence, export, review monitoring, demo mutation proof limits | Full contract required for MVP action families; conditional/deferred for P1/HOLD action families | Demo workflow action success is not production persistence proof. `noClientRelease` flag is useful proof signal but not full P0 proof. | `NOT_READY_FOR_CODEX` |
| `/api/documents` | `app/api/documents/route.ts` | `API_EXISTS_BASELINE`; `GET` route observed | MVP for document/evidence list support | Evidence visibility, tenant scope, document row exposure, client visibility, empty/error state | Full contract required for MVP document/evidence route family | Listing uploaded documents does not prove evidence sufficiency or client-safe visibility. | `NOT_READY_FOR_CODEX` |
| `/api/documents/upload` | `app/api/documents/upload/route.ts` | `API_EXISTS_BASELINE`; `POST` multipart upload observed | MVP for document upload and evidence intake | Upload validation, role allowlist, object scope, audit event, evidence record, internal-only visibility | Full contract required | Upload persists document/version/extraction/evidence/audit rows but upload success remains `UPLOAD_ONLY_NOT_SUFFICIENCY`. | `NOT_READY_FOR_CODEX` |
| `/api/review-monitoring` | `app/api/review-monitoring/route.ts` | `API_EXISTS_BASELINE`; `GET` route observed | P1 by locked route scope default, with safety relevance if elevated | Review rhythm, rebalance monitoring, no-auto-advice, internal audit state | Deferred/conditional MVP contract; full P1 contract later | Monitoring snapshot does not imply advice execution, client release or rebalance action. | `NOT_READY_FOR_CODEX` |

## 6. API Contract Method

| Step | Method |
|---:|---|
| 1 | Validate roadmap position and predecessor availability. |
| 2 | Apply source hierarchy and block `main` as target truth. |
| 3 | Confirm the four full-workflow API route files as existing API baseline. |
| 4 | Separate API presence, API behaviour, API safety and P0 proof. |
| 5 | Specify request, response, validation, error, permission, audit, redaction and fail-closed behaviour for each API. |
| 6 | Preserve predecessor safety rules: upload-only success, no-unapproved-advice, fail-closed visibility, evidence sufficiency, audit persistence and export redaction. |
| 7 | Mark unproven body/status/payload semantics as contract requirements, not assumptions. |
| 8 | Route schema dependencies to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`. |
| 9 | Route proof expectations to `P0_TEST_ACCEPTANCE_MATRIX.md`. |
| 10 | Keep Codex blocked. |

## 7. API Contract Vocabulary

| Label | Meaning |
|---|---|
| `API_EXISTS_BASELINE` | API route exists in full-workflow target codebase. |
| `CONTRACT_REQUIRED` | Behaviour must be specified before implementation handoff. |
| `METHOD_VERIFIED` | HTTP method observed in target route file. |
| `METHOD_TO_VERIFY` | HTTP method must be verified from target route file if not directly evidenced. |
| `REQUEST_CONTRACT_REQUIRED` | Request payload/body/query/files need explicit contract. |
| `RESPONSE_CONTRACT_REQUIRED` | Response payload/status/error shape needs explicit contract. |
| `VALIDATION_REQUIRED` | Field, file, precondition or workflow validation required. |
| `RBAC_REQUIRED` | Role/action/object permission required. |
| `OBJECT_SCOPE_REQUIRED` | Tenant/object/engagement/document/decision/evidence/export scoping required. |
| `PAYLOAD_REDACTION_REQUIRED` | Payload must hide/redact internal or unreleased fields. |
| `CLIENT_SAFE_RELEASED_ONLY` | Client-facing response contains only released, redacted, approved content. |
| `AI_DRAFT_INTERNAL_ONLY` | AI/rules draft must not be returned to client-facing payloads. |
| `UPLOAD_ONLY_NOT_SUFFICIENCY` | Upload success does not prove evidence sufficiency or release readiness. |
| `AUDIT_REQUIRED` | Safety-relevant API action requires audit event expectation. |
| `AUDIT_PERSISTENCE_REQUIRED` | Audit must be persisted, not only displayed. |
| `FAIL_CLOSED_REQUIRED` | API must deny, hide, block or return safe error when proof/preconditions are incomplete. |
| `DEMO_ACTION_NOT_PRODUCTION_PROOF` | Demo workflow action cannot be treated as final production mutation. |
| `EXPORT_FORBIDDEN_INTERNAL_PAYLOAD` | Export/API response must not include AI Draft, internal rationale, compliance notes, unreleased evidence or hidden fields. |
| `NEGATIVE_TEST_EXPECTED` | Later P0 matrix must prove denial/leakage/bypass case. |
| `SCHEMA_FIELD_RECONCILIATION_REQUIRED` | Field/model relation must be mapped later. |
| `CONTRACT_ONLY_NOT_IMPLEMENTED` | Contract exists but no implementation occurs here. |
| `NOT_READY_FOR_CODEX` | Codex remains blocked. |

## 8. Cross-Cutting API Safety Rules

| Rule ID | Rule | Required API Behaviour |
|---|---|---|
| API-RULE-001 | API route existence is not safety proof. | Every API route is marked `API_EXISTS_BASELINE` and still requires contract/test proof. |
| API-RULE-002 | API success must not imply downstream gate completion. | Success response must name only the completed API action and must not imply approval, release, client acceptance, evidence sufficiency or export readiness unless separately proven. |
| API-RULE-003 | Upload success is upload-only. | `/api/documents/upload` may confirm document transfer/persistence, but must not unlock evidence sufficiency, release, export or client visibility. |
| API-RULE-004 | Demo workflow success is not production persistence proof. | `/api/demo-workflow` is demo workflow transport and must be labelled as limited until production contract, schema and P0 proof exist. |
| API-RULE-005 | Advisor approval API behaviour must not imply compliance release. | Advisor-related demo workflow results must keep `clientVisible=false` unless compliance release and visibility gates are proven. |
| API-RULE-006 | Compliance release API behaviour must not imply client acceptance. | Release may create client visibility only under strict contract; it never means client accepted or acted on advice. |
| API-RULE-007 | Client-facing API payloads must fail closed. | If release/redaction/visibility proof is incomplete, return hidden/redacted/empty/denied state, not internal data. |
| API-RULE-008 | AI Draft and internal rationale must not appear in client payloads. | Client, export and document-list payloads exclude AI Draft, internal rationale, analyst notes and compliance notes. |
| API-RULE-009 | Export payloads must be scoped, redacted, approved and audit-safe. | Export-related demo workflow actions must not expose unredacted internal content. |
| API-RULE-010 | Admin cannot bypass permission, evidence, audit, visibility, advice or export gates. | Admin or governance role may manage setup/policies, not force release, sufficiency, export or client visibility. |
| API-RULE-011 | API errors must preserve safe state and avoid silent advancement. | Error response must not mutate workflow to a more permissive state; retry/cancel must preserve data where safe. |
| API-RULE-012 | Required audit must be persisted, not merely displayed. | Audit-relevant action must route to persisted `AuditEvent` expectation and P0 proof. |
| API-RULE-013 | Unknown method/body/status-code details must be marked, not invented. | Use `METHOD_TO_VERIFY` or `RESPONSE_CONTRACT_REQUIRED` when code evidence is insufficient. |
| API-RULE-014 | Existing tests are proof slices only. | Document upload, permission, workflow, export and review monitoring specs support proof but do not close P0 safety alone. |
| API-RULE-015 | Codex remains blocked. | API contracts prepare downstream schema/test/task artefacts; they do not authorize implementation. |

## 9. API Route Contract Matrix

| API Route | File | Baseline Label | Primary Consumers | Scope Workset | Request Contract | Response Contract | Validation Contract | Permission Contract | Visibility Contract | Evidence / Audit / Export Contract | Fail-Closed Behaviour | Schema Dependencies | Test Dependencies | Gap Label | Codex Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/api/demo-workflow` | `app/api/demo-workflow/route.ts` | `API_EXISTS_BASELINE`; `METHOD_VERIFIED: POST` | Route action buttons across advisory workflow, compliance, decision, evidence, export, governance, review monitoring and held/P1 demo routes | Mixed: MVP actions, MVP_SUPPORT actions, P1 actions, HOLD actions | JSON object body with `actionId`; action ID must match demo workflow action pattern `jNN.actionName`; unknown valid-pattern action records generic demo audit only | JSON includes `actionId`, `noClientRelease`, `result`; invalid body returns error/issues; missing DB returns 503; failed action returns 409 | Validate object body and `actionId`; action-specific preconditions must remain explicit; no unsafe promotion from demo action to production mutation | `RBAC_REQUIRED`; action/role/object permission must be enforced by action family; route access alone not sufficient | `AI_DRAFT_INTERNAL_ONLY`; client release only if explicit gate result allows; default is `noClientRelease=true` | Audit expected for gate-relevant workflow actions; export actions require redaction/scope/approval boundaries; evidence actions cannot prove sufficiency without review | Invalid body 400; missing DB 503; action failure 409; default payload must not expose internal client data | `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `EvidenceRecord`, `AuditEvent`, `ExportRequest`, `ReviewSchedule`, `Trigger`, `ActionItem`, `User`, `Role`, `Permission`, `ClientTenant`; `SCHEMA_FIELD_RECONCILIATION_REQUIRED` | Positive and negative workflow, RBAC, release, export, evidence, review-monitoring and no-client-leakage tests required | `API_BEHAVIOUR_PARTIAL`; `DEMO_ACTION_NOT_PRODUCTION_PROOF` | `NOT_READY_FOR_CODEX` |
| `/api/documents` | `app/api/documents/route.ts` | `API_EXISTS_BASELINE`; `METHOD_VERIFIED: GET` | `/documents`; document/evidence list UI; upload return navigation | MVP document/evidence workset | Query-driven tenant slug currently inferred from URL search params; default tenant behaviour observed; request contract must define allowed tenant scope | JSON `{ documents }`; on failure JSON `{ documents: [], error }` with 500 | Validate tenant slug/object scope; do not allow cross-tenant query expansion; empty list is safe state | `RBAC_REQUIRED`; document list requires tenant/object scope and row-level visibility | Client-facing or external roles receive only client-safe/released/redacted rows; internal-only uploads stay hidden from client surfaces | Listing documents is not evidence sufficiency; audit not necessarily required for read unless sensitive access/export context applies | On error return empty array and safe error; no internal stack details; no fallback to unrelated tenant documents | `Document`, `EvidenceRecord`, `DocumentExtraction`, `ClientTenant`, `UserRole`, `Permission`; `SCHEMA_FIELD_RECONCILIATION_REQUIRED` for row-level visibility fields | Tests must cover allowed tenant list, denied cross-tenant list, empty state, internal-only redaction and client payload safety | `API_BEHAVIOUR_PARTIAL`; `PAYLOAD_REDACTION_REQUIRED` | `NOT_READY_FOR_CODEX` |
| `/api/documents/upload` | `app/api/documents/upload/route.ts` | `API_EXISTS_BASELINE`; `METHOD_VERIFIED: POST` | `/documents/upload`; upload state; evidence intake path | MVP document upload/evidence intake | Multipart form-data with `file` plus `documentType`, `linkedObjectLabel`, `notes`, `periodLabel`, `roleKey`, `sensitivity`, `subType`, `tenantSlug` | Success JSON `{ result }` including document, evidence/audit/version/extraction IDs; validation error 400; permission error 403 with `auditEventId` and reason; unknown failure 500 | Multipart required; file required; documentType required; positive size; max 50MB; safe filename; allowed mime/extension; role/sensitivity/tenant validated | Upload allowlist currently `principal`, `family_cfo`, `external_advisor`; permission engine must allow `UPLOAD` for tenant/object; denied upload writes denial audit | Created document/evidence default internal-only; `clientVisible=false`; response to client must not expose internal-only details beyond permitted upload confirmation | Creates `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`; success remains `UPLOAD_ONLY_NOT_SUFFICIENCY` | Invalid multipart/file/body returns 400; denied role returns 403 and audit; failure returns safe 500; evidence/release/export remain blocked | `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`, `ClientTenant`, `User`, `Permission`; storage metadata fields; `SCHEMA_FIELD_RECONCILIATION_REQUIRED` | Positive upload, invalid file, unsupported type, oversize, unsafe filename, denied role, cross-tenant/object leakage, upload-not-release negative tests required | `API_BEHAVIOUR_CONFIRMED_FOR_UPLOAD_MECHANICS`; `UPLOAD_ONLY_NOT_SUFFICIENCY` | `NOT_READY_FOR_CODEX` |
| `/api/review-monitoring` | `app/api/review-monitoring/route.ts` | `API_EXISTS_BASELINE`; `METHOD_VERIFIED: GET` | `/reviews/calendar`, `/monitoring/rebalance`; review monitoring screen; P1/default review rhythm | P1 default; safety-relevant if elevated | Optional `asOf` query parsed as date; invalid date falls back to default; request contract must define actor/tenant/role scope before MVP elevation | JSON review monitoring snapshot with review rows, rebalance rows, audit proof and internal monitoring state | Validate `asOf`, tenant/object scope and actor authorization; no mutation through GET | `RBAC_REQUIRED` if exposed beyond internal operations/advisor roles; monitoring visibility must be role/object scoped | Snapshot rows must keep `clientVisible=false` for internal rebalance triggers unless released under separate gates | Review escalation/schedule actions route through `/api/demo-workflow`; monitoring itself must not imply advice execution or release | Missing DB returns 503; invalid date falls back safely; any service error must fail safe without client release | `ReviewSchedule`, `Trigger`, `ActionItem`, `QueueItem`, `AuditEvent`, `ClientTenant`, `Recommendation`; `SCHEMA_FIELD_RECONCILIATION_REQUIRED` if elevated | Tests must prove snapshot shape, due/overdue states, clientVisible=false, review actions no client release and no-auto-advice boundary | `API_BEHAVIOUR_PARTIAL`; `P1_DEFERRED_BY_ROUTE_SCOPE` | `NOT_READY_FOR_CODEX` |

## 10. Request Contract Matrix

| API Route | Method | Required Request Shape | Allowed Inputs | Forbidden Inputs | Validation Required | Contract Notes |
|---|---|---|---|---|---|---|
| `/api/demo-workflow` | `POST` | JSON body object | `actionId` string matching `jNN.actionName`; recognized action families J01–J09, J12–J14, J16–J17; generic pattern action may record deterministic audit | Non-object body; array body; missing actionId; non-string actionId; invalid pattern; action attempting client release without gate proof | `parseDemoWorkflowRequestBody`; action-family preconditions; permission/object/safety checks by action | Request is demo-action transport. It must not be expanded into production mutation semantics without later task master and tests. |
| `/api/documents` | `GET` | URL query | Tenant slug query currently inferred; default tenant observed as `morgan` | Cross-tenant slug spoofing; client role requesting internal-only documents; arbitrary object expansion | Tenant slug whitelist; actor/tenant/object scope; row-level visibility | Request contract needs explicit actor context before production use. Current GET is useful demo/list baseline only. |
| `/api/documents/upload` | `POST` | Multipart form-data | `file`, `documentType`, `linkedObjectLabel`, `notes`, `periodLabel`, `roleKey`, `sensitivity`, `subType`, `tenantSlug` | Missing file; invalid multipart; unsafe filename; unsupported mime/extension; >50MB; zero byte file; unauthorized role; cross-tenant target | Multipart parse; file validation; role allowlist; permission engine; tenant scope; sensitivity | Supported mime/types: PDF, DOCX, XLSX, CSV, PNG, JPEG, TIFF. Supported extensions: `.pdf`, `.docx`, `.xlsx`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.tif`, `.tiff`. |
| `/api/review-monitoring` | `GET` | URL query | Optional `asOf` date | Query causing client-visible release, mutation or advice execution; unauthorized tenant/object access | Date parse; role/object/tenant scope before wider use | Invalid `asOf` falls back to default date in observed code. This must remain safe and not mutate state. |

## 11. Response Contract Matrix

| API Route | Success Response | Error Response | Allowed Fields | Forbidden Fields | Redaction / Safety Notes |
|---|---|---|---|---|---|
| `/api/demo-workflow` | `{ actionId, noClientRelease, result }` | 400 invalid request with `issues`; 503 missing DB; 409 action failure with safe message | Action ID, gate-safe result, row counts, audit IDs, target IDs where internal scope allows, `noClientRelease` | AI Draft client content, internal rationale to client, compliance notes to client, unreleased evidence, unredacted export payload | `noClientRelease` is mandatory safety signal. Any result with `clientVisible=true` requires separate compliance/visibility/export proof. |
| `/api/documents` | `{ documents }` | `{ documents: [], error }` with 500 | Document list item fields needed for UI: id, title, documentType, status, sensitivity, fileName, fileSizeBytes, mimeType, checksum, storageKey, uploadedAt, evidenceRecordId, extractionStatus — subject to actor scope | Other-tenant documents, raw internal notes, storage internals to client roles, unreleased evidence detail | Client-facing response must be projected/redacted. Internal-only document rows cannot be exposed by default to client views. |
| `/api/documents/upload` | `{ result }` with document, storageKey, versionId, extractionId, evidenceRecordId, evidence item IDs, auditEventId, uploadedAt | 400 validation, 403 permission denied with auditEventId/reason, 500 upload failure | Upload confirmation fields allowed to authorized uploader; upload audit ID; internal IDs only where scoped | Client-visible sufficiency claim, release status, export readiness, advisor/compliance approval, internal evidence details beyond scope | Success must say upload transfer/persistence only. It must not say evidence is sufficient. |
| `/api/review-monitoring` | Review monitoring snapshot: review rows, rebalance rows, audit proof, due/overdue states | 503 when DB missing; service error should become safe error contract | Internal monitoring states, due/overdue counts, review schedule rows, rebalance trigger rows, clientVisible flags | Automatic advice action, client release content, execution instruction, internal notes to client roles | Snapshot is monitoring only. It must not execute rebalance, release advice or create client-visible recommendation. |

## 12. Validation and Error Contract Matrix

| API Route | Validation Cases | Current / Required Error Behaviour | Required Recovery Behaviour | Safety Risk Controlled |
|---|---|---|---|---|
| `/api/demo-workflow` | Body must be object; `actionId` must be valid string pattern; action must be allowed for scope/actor/gate | 400 invalid body/action; 503 no DB; 409 action failed | Preserve prior workflow state unless transaction succeeds; no silent advancement; return safe message | Prevents malformed/demo actions from bypassing workflow gates. |
| `/api/documents` | Tenant slug valid; actor allowed to list tenant documents; row-level visibility; internal-only filtering | 500 returns empty list and safe error | UI shows empty/error state; no fallback to wrong tenant | Prevents cross-tenant or internal evidence leakage. |
| `/api/documents/upload` | Multipart required; file required; document type required; safe filename; allowed type/extension; positive and <=50MB; role allowlist; permission engine | 400 invalid multipart/file; 403 denied with audit; 500 safe failure | Preserve upload form where safe; allow retry/reselect; keep evidence/release/export gates locked | Prevents unsafe file handling, unauthorized upload and upload-to-release shortcut. |
| `/api/review-monitoring` | `asOf` date safe parse; internal monitoring actor; tenant/object scope | 503 no DB; invalid `asOf` defaults safely; service error contract required | Show monitoring unavailable/retry; no mutation or client release | Prevents monitoring view from becoming automated advice or release. |

## 13. RBAC / Permission / Object-Scope API Matrix

| API Route | Route Access Is Enough? | Required Actor / Role Contract | Required Object Scope | Admin Non-Bypass Rule | Negative Test Expectation |
|---|---|---|---|---|---|
| `/api/demo-workflow` | No | Action-specific role: analyst/advisor/compliance/client/admin/export/review roles depending on `actionId`; demo role is not production auth | Tenant, recommendation, decision, evidence, export, review schedule, trigger and action item scope | Admin cannot force advice release, evidence sufficiency, export generation, redaction bypass or client visibility | Denied role cannot release; advisor approval cannot release; admin cannot bypass; client cannot access internal workflow payload. |
| `/api/documents` | No | Document list allowed only for actor with tenant/object document visibility | `ClientTenant` + document source/object/evidence relationship scope | Admin listing does not expand client payload visibility | Cross-tenant list denied/empty; client cannot see internal-only documents. |
| `/api/documents/upload` | No | Upload allowlist observed: `principal`, `family_cfo`, `external_advisor`; permission engine must also allow `UPLOAD` | Tenant + document upload attempt + sensitivity + internal-only visibility | Admin cannot upload or mark evidence sufficient by bypass unless explicitly authorized by policy and tested | Unauthorized role denied with audit; upload to wrong tenant/object denied; upload does not release. |
| `/api/review-monitoring` | No | Internal operations, analyst, advisor or compliance roles only if scoped; P1 default unless elevated | Review schedule, trigger, action item, queue item, client tenant | Admin/ops cannot turn monitoring into advice execution | Client cannot see internal rebalance triggers; monitoring cannot auto-route client advice. |

## 14. Client Visibility / Redaction / Advice-Boundary API Matrix

| API Route | Client-Facing Risk | Required Redaction Rule | Advice Boundary Rule | Fail-Closed Projection |
|---|---|---|---|---|
| `/api/demo-workflow` | High for actions involving recommendations, decisions, compliance release, export and evidence | Hide AI Draft, internal rationale, compliance notes, unreleased evidence and unredacted export payload | No unapproved advice reaches client. Advisor approval remains internal until compliance release and visibility gates pass. | `noClientRelease=true` unless client-safe release is explicitly proven. |
| `/api/documents` | Medium/high for client document visibility | Return only actor-scoped, visibility-safe document rows; internal-only evidence details hidden from client roles | Document/evidence list cannot imply advice, recommendation or release | Empty/redacted/denied result if client-safe row projection is not proven. |
| `/api/documents/upload` | High because client/external actors may upload documents | Return upload confirmation only; document/evidence objects remain internal-only until reviewed/released | Upload cannot create advice or release state | Upload success remains `UPLOAD_ONLY_NOT_SUFFICIENCY`; client visibility stays false. |
| `/api/review-monitoring` | High if monitoring/rebalance is misunderstood as advice | Internal monitoring rows hidden from client-facing roles; rebalance triggers clientVisible=false unless separately released | Monitoring/rebalance cannot execute advice or trigger client action automatically | Snapshot defaults to internal monitoring; no client release or advice execution. |

## 15. Evidence / Audit / Export API Matrix

| API Route | Evidence Contract | Audit Contract | Export Contract | Contract Boundary |
|---|---|---|---|---|
| `/api/demo-workflow` | Evidence request/link/download/view actions are demo workflow events; evidence sufficiency still requires linked, reviewed, scoped and accepted evidence | Gate-relevant actions must create or expect persisted `AuditEvent`; audit display alone not enough | Export action families J08 require scope, redaction, approval, package generation/download/share separation | Demo action result cannot become production proof without schema/test mapping. |
| `/api/documents` | Listing document rows can support evidence review but does not prove sufficiency | Read audit conditional for sensitive access; no audit persistence assumed from list response | No export payload from document list unless later scoped/redacted | Document list is intake/review support only. |
| `/api/documents/upload` | Creates upload evidence record/item in observed service, but success remains upload-only | Upload success and denial both create audit events in observed service | Upload does not unlock export; exported document requires reviewed/redacted/client-safe projection later | Strongest implemented API interaction, still not a release gate. |
| `/api/review-monitoring` | Monitoring may identify review gaps but is not evidence sufficiency | Review/rebalance actions through demo workflow can persist internal audit state | No export from monitoring snapshot unless later scoped | Review rhythm is internal/P1 by default and cannot auto-advise. |

## 16. Fail-Closed and Negative Case Matrix

| Negative Case | API Route(s) | Expected Contract Result | Downstream Routing |
|---|---|---|---|
| Invalid demo workflow request body | `/api/demo-workflow` | 400 with issues; no state advancement | P0 test matrix |
| Advisor approves recommendation and expects client release | `/api/demo-workflow` | Advisor approval saved internally; compliance release still required; no client release | P0 test matrix; advice-boundary tests |
| Compliance or export action lacks evidence or redaction | `/api/demo-workflow` | Blocked/pending/fail-closed; no unredacted payload | Evidence/audit/export tests |
| Client role requests internal-only documents | `/api/documents` | Hidden/redacted/empty/denied response | P0 leakage tests |
| Cross-tenant document query attempted | `/api/documents` | Deny or empty safe result; no other-tenant rows | P0 object-scope tests |
| Upload missing file | `/api/documents/upload` | 400 `file_required`; no document/evidence/release created | Upload validation tests |
| Upload unsupported file or unsafe filename | `/api/documents/upload` | 400 with validation issues; no persistence | Upload validation tests |
| Upload role not allowed | `/api/documents/upload` | 403 with reason and auditEventId; no document/evidence release | Permission and audit tests |
| Upload succeeds then release is attempted immediately | `/api/documents/upload`; `/api/demo-workflow` | Release remains blocked until evidence sufficiency/review/compliance gates pass | Evidence sufficiency negative tests |
| Review monitoring returns rebalance trigger | `/api/review-monitoring` | Internal monitoring only; `clientVisible=false`; no execution or client advice | Review monitoring / no-auto-advice tests |
| Admin tries to force release/export/redaction bypass | `/api/demo-workflow`; export-related flows | Denied, blocked or pending; audit expected | Admin non-bypass tests |

## 17. API-to-Schema Dependency Matrix

| API Route | Primary Models / Fields | Dependency Status | Reconciliation Need |
|---|---|---|---|
| `/api/demo-workflow` | `Trigger`, `ActionItem`, `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`, `ExportRequest`, `ReviewSchedule`, `QueueItem`, `ClientTenant`, `User`, `Role`, `Permission`, `UserRole`, `PolicyDefinition` | Models exist in full-workflow schema; behaviour spans many domain concepts | Field-level mapping required for action ID to target object, workflow state transitions, clientVisible fields, audit event fields, export statuses and recommendation release states. |
| `/api/documents` | `Document`, `DocumentExtraction`, `EvidenceRecord`, `ClientTenant`, `User`, `UserRole`, `Permission` | Models exist; list projection observed through upload service | Reconcile which fields may be returned by actor type: checksum, storageKey, sensitivity, evidenceRecordId, extractionStatus and internal metadata need payload visibility decisions. |
| `/api/documents/upload` | `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`, `ClientTenant`, `User`, `Permission` | Models exist and are used by upload service | Reconcile field-level semantics for checksum, storageKey, clientVisible, visibilityStatus, extraction review, evidence status, audit metadata, retentionPolicy and upload actor. |
| `/api/review-monitoring` | `ReviewSchedule`, `Trigger`, `ActionItem`, `QueueItem`, `AuditEvent`, `ClientTenant`, `Recommendation` | Models exist and are used by service/test slices | Reconcile whether monitoring is P1/support/MVP safety input, and whether fields such as clientVisible, dueState, trigger status, queue state and auditProof are internal-only. |

No schema changes are authorized here. All schema/field uncertainty is routed to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`.

## 18. API-to-P0-Test Dependency Matrix

| API Route | Positive Proof Needed | Negative Proof Needed | Existing Proof Slice | Missing / Routed Proof |
|---|---|---|---|---|
| `/api/demo-workflow` | Valid action mutates expected seeded/demo state and writes audit where required; noClientRelease remains true for internal-only actions | Invalid action body rejected; unauthorized role blocked; advisor approval not release; admin bypass denied; export without redaction/approval blocked; AI Draft not leaked | Workflow, permission, review-monitoring and export-related tests provide slices | Full action-family P0 matrix; payload leakage tests; release/export/evidence audit failure tests |
| `/api/documents` | Authorized actor receives scoped document list and empty state behaves safely | Cross-tenant list denied/empty; client cannot see internal-only documents; storage/internal metadata not leaked | Document upload flow proves uploaded file visible after reload/list for demo path | Row-level RBAC/redaction tests; tenant-scope tests; client-safe projection tests |
| `/api/documents/upload` | Allowed role uploads valid file; document/version/extraction/evidence/audit created; UI shows upload-only success | Missing file, bad multipart, unsupported type, oversize, unsafe filename, denied role, cross-tenant spoof, upload-to-release shortcut | Document upload API and flow specs are strong proof slices | Negative role/scope/leakage tests; evidence insufficiency after upload; audit-unavailable fail-closed tests |
| `/api/review-monitoring` | Snapshot returns review/rebalance state; review actions persist internal audit state; rebalance rows remain clientVisible=false | Client cannot see internal monitoring; monitoring cannot auto-release advice or execute rebalance; invalid asOf safe | Review-monitoring service spec proves snapshot and no-client-release slices | RBAC/object-scope tests; P1 deferral/elevation tests; no-auto-advice tests |

## 19. API Behaviour Gap Register

| Gap ID | API Route | Gap Type | Current Evidence | What Is Not Proven | Downstream Routing | Codex Status |
|---|---|---|---|---|---|---|
| API-GAP-001 | `/api/demo-workflow` | Behaviour / production boundary | POST route, action validation and many action handlers exist | Demo mutation is not production persistence; action-level production auth and P0 coverage not complete | `P0_TEST_ACCEPTANCE_MATRIX.md`; `FINAL_CODEX_TASK_MASTER.md` later | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-002 | `/api/demo-workflow` | Payload / advice leakage | Response includes `noClientRelease` and result | Full guarantee that every result excludes AI Draft/internal rationale/client leakage is not proven for all action families | `P0_TEST_ACCEPTANCE_MATRIX.md`; payload audit later | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-003 | `/api/demo-workflow` | Audit | Several action handlers write audit events | Complete audit persistence for every critical gate action and audit-unavailable fail-closed behaviour not proven | `P0_TEST_ACCEPTANCE_MATRIX.md`; schema field mapping | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-004 | `/api/documents` | RBAC / visibility | GET returns uploaded documents for tenant slug | Actor context, row-level RBAC and client-safe projection not fully proven | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`; `P0_TEST_ACCEPTANCE_MATRIX.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-005 | `/api/documents` | Payload | List item contains checksum/storageKey/sensitivity fields | Which fields are safe for client/external roles is not fully decided | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-006 | `/api/documents/upload` | Evidence sufficiency | Upload creates document/version/extraction/evidence/audit records | Upload success cannot prove evidence sufficiency; downstream review/release gate proof remains open | `P0_TEST_ACCEPTANCE_MATRIX.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-007 | `/api/documents/upload` | Permission | Upload role allowlist and permission engine exist | Full production RBAC, tenant spoofing and object-scope denial paths remain to be mapped | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`; `P0_TEST_ACCEPTANCE_MATRIX.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-008 | `/api/review-monitoring` | Scope | GET snapshot exists and tests prove due/overdue/clientVisible=false slices | Locked route scope marks review calendar P1 by default; MVP elevation not decided here | `FINAL_CODEX_TASK_MASTER.md` later only if elevated | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-009 | `/api/review-monitoring` | Advice boundary | Rebalance rows can be internal and clientVisible=false | Monitoring cannot become automatic advice execution; full negative tests still needed | `P0_TEST_ACCEPTANCE_MATRIX.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-010 | All APIs | Error / fail-closed | Some safe errors observed | Uniform safe error schema and audit-unavailable fail-closed behaviour not complete | `P0_TEST_ACCEPTANCE_MATRIX.md`; later Task Master | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-011 | All APIs | Schema | Full schema exists with relevant models | Field-level parity, visibility fields and audit/export relations need reconciliation | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | `DO_NOT_PASS_TO_CODEX_YET` |
| API-GAP-012 | All APIs | Test | 10 specs exist as proof slices | Full P0 positive/negative coverage not proven | `P0_TEST_ACCEPTANCE_MATRIX.md` | `DO_NOT_PASS_TO_CODEX_YET` |

## 20. Stop Rules

* No implementation.
* No code changes.
* No API implementation.
* No new API route creation.
* No Prisma changes.
* No migrations.
* No tests written.
* No Codex tasks.
* No final Codex handoff.
* No screen generation.
* No state-screen generation.
* No image generation.
* No blind patch-schema replacement.
* No use of `main` as target codebase.
* No `main`-based target gaps.
* No assumption that API presence proves API safety.
* No assumption that successful API response proves downstream gate completion.
* No assumption that upload success proves evidence sufficiency.
* No assumption that demo workflow mutation proves production persistence.
* No assumption that route access proves action permission.
* No assumption that action permission proves payload visibility.
* No assumption that admin can bypass advice, evidence, audit, visibility or export gates.
* No assumption that existing tests prove P0 safety.
* No assumption that Codex may start.

## 21. Acceptance Criteria

| # | Acceptance Criterion | Status |
|---:|---|---|
| 1 | Roadmap position is correct: 10 of 15. | PASS |
| 2 | All required predecessors are listed and used. | PASS |
| 3 | Missing predecessors would be marked as blockers; none are missing in this run. | PASS |
| 4 | The 4 existing API routes are listed exactly. | PASS |
| 5 | No API is falsely marked absent. | PASS |
| 6 | Every API has a request contract. | PASS |
| 7 | Every API has a response contract. | PASS |
| 8 | Every API has validation and error behaviour. | PASS |
| 9 | Every API has RBAC/object-scope behaviour. | PASS |
| 10 | Every client-facing or export-relevant API has redaction/fail-closed behaviour. | PASS |
| 11 | Upload API explicitly says upload success is not evidence sufficiency. | PASS |
| 12 | Demo workflow API explicitly says demo action success is not production persistence proof. | PASS |
| 13 | Review monitoring API explicitly says monitoring does not imply automatic advice execution. | PASS |
| 14 | Audit expectations are routed to audit/persistence proof. | PASS |
| 15 | Schema dependencies are routed to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`. | PASS |
| 16 | Test dependencies are routed to `P0_TEST_ACCEPTANCE_MATRIX.md`. | PASS |
| 17 | Codex remains blocked. | PASS |
| 18 | No implementation, tests, migrations, screens or Codex tasks are produced. | PASS |
| 19 | Stop rules are present. | PASS |
| 20 | ENGINE proof is included. | PASS |

## 22. ENGINE Proof

| ENGINE Phase | Proof |
|---|---|
| Charter | Target artefact `API_CONTRACT_MATRIX.md` locked as roadmap position 10 of 15. Scope restricted to API contract matrix only. Non-scope blocks implementation, code, tests, schema changes, screens and Codex tasks. |
| Evidence | Applied roadmap v0.8, predecessor artefacts through position 9, KB v0.7–v0.2, Living KB protocol, MVP Control Spec, full-workflow target codebase and `main` false-gap rule. Verified the four API route files as existing baseline. |
| Framing | Separated API presence from API safety. Existing route files are accepted as implementation facts, not readiness proof. |
| Divergence | Considered request, response, validation, error, RBAC, object scope, client visibility, redaction, advice boundary, evidence sufficiency, audit persistence, export safety, schema dependencies and P0 tests. |
| Contradiction | Resolved the contradiction “APIs exist” versus “API readiness unproven” by treating APIs as baseline while still requiring contracts and tests. No false API-missing gap created. |
| Branch Build | Built per-API contracts for `/api/demo-workflow`, `/api/documents`, `/api/documents/upload` and `/api/review-monitoring`, plus schema/test/gap branches. |
| Debate | Challenged overclaim risks: upload-to-release, demo mutation as production proof, advisor approval as release, monitoring as advice execution, admin bypass and client payload leakage. |
| Adversarial | Tested conceptual negative cases for invalid requests, unauthorized roles, cross-tenant data, internal-only document leakage, no audit, no redaction, unsafe uploads and review-monitoring auto-advice. |
| Convergence | Produced a complete API contract matrix without implementation and preserved `CODEX_HANDOFF_NOT_READY`. |
| Proof | Acceptance criteria checked one by one; stop rules included. |
| Learning | Open items routed only to `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` and later final task artefacts. No Codex handoff or task creation allowed. |
