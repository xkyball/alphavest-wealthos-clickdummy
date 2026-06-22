# ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-20
**Mode:** Journey-first requirements matrix. No implementation, no code change, no Codex tickets, no screen generation.
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`
**Target branch:** `full-workflow`

---

## 1. Executive Decision

**Artefact status:** `MVP_JOURNEY_REQUIREMENTS_MATRIX_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**Requirements gate status:** `JOURNEY_REQUIREMENTS_CONTRACTED_NOT_IMPLEMENTED`

**Codex status:** `CODEX_HANDOFF_NOT_READY`

This artefact translates the locked AlphaVest MVP mega-journey portfolio into product, functional, workflow, UI/state, API, schema, safety and acceptance requirements. It is a requirements matrix only. It does not implement code, create Codex tickets, authorize final handoff, generate screens, edit Prisma or migrate data.

| Category | Decision |
| --- | --- |
| MVP Core Mega-Journeys | `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010` |
| MVP Support / Parallel Hardening | `MJ-012`; `MJ-011` only after core user/object scope is stable or when object-scope proof explicitly requires it |
| P1 Journeys | `MJ-008`, `MJ-009`, `MJ-011` if external advisor access is not required for first proof |
| Hold / P2 / Future | `MJ-004`, `MJ-007` because they depend on held routes and unresolved KYC/suitability/committee scope |
| First Product Build Path | Use `MJ-001` as umbrella; prove it through slices from `MJ-002`, `MJ-003`, `MJ-010`, `MJ-006`, `MJ-005` |
| Decisive Product Proof | A real mapped user in a tenant moves an evidence-backed internal draft through analyst review, advisor approval and compliance release into client-safe visibility while bypasses fail and audit proof exists. |

## 2. Source-of-Truth Lock

`ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` is the controlling journey-priority source. The live GitHub branch root was reachable, but deep implementation facts are taken from the uploaded `full-workflow` snapshot and the existing AlphaVest source-of-truth artefacts. `main` remains false-gap only. The MVP patch remains Control Spec only and must not replace the full-workflow schema or code.

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` | Binding journey-priority source | Selected MVP/support/P1/hold journeys, first product build path, auth correction, next artefact purpose | Overriding selected portfolio without explicit contradiction |
| 2 | Live GitHub repo / branch `full-workflow` | Target branch reality | Confirm branch/repo visibility and top-level context where available | Treating repo presence as readiness proof |
| 3 | `local repository checkout / pull of target branch full-workflow` | Local target code snapshot | Route/API/schema/test/code reality when live traversal is insufficient | Assuming snapshot is newer than live branch when live branch is fully inspected |
| 4 | Current roadmap/safety artefacts | Safety/scope contract layer | Route scope, visual, state, feedback, RBAC, evidence/audit/export, API, schema and P0 guardrails | Creating final Codex handoff from this artefact |
| 5 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP Control Spec | Advice boundary, RBAC, client visibility, evidence, audit, workflow and acceptance concepts | Blind schema/code replacement |
| 6 | `main` branch / `main branch as false-gap / historical only; never target truth` | False-gap warning only | Block old absence claims | Target truth or task source |

## 3. Binding Decisions from Mega Journey Priority Lock

### 3.1 Selected MVP Journey Portfolio
| Journey | Priority | Role in MVP | Reason |
| --- | --- | --- | --- |
| MJ-001 | 1 | MVP Core / Umbrella | It forces the minimum product spine: providerless but real user mapping, tenant scope, role assignment, evidence, approval, release, audit and client visibility. |
| MJ-002 | 2 | MVP Core | Best client-value slice and strongest existing interaction leverage through document upload mechanics. |
| MJ-003 | 3 | MVP Core | AI governance is differentiating and must be safe from the first MVP proof. |
| MJ-010 | 4 | MVP Governance Spine | Providerless auth with real user semantics requires proof that admin power is governance-scoped, not a safety bypass. |
| MJ-006 | 5 | MVP Safety Spine | A Family Office OS is not credible unless tenant/object isolation is proven early. |
| MJ-005 | 6 | MVP Late First Path / Trust Output | Export/redaction is a core trust output once client-safe release semantics are stable. |

### 3.2 Support / Parallel Hardening Journeys
| Journey | Decision | Use |
| --- | --- | --- |
| MJ-012 | MVP_SUPPORT / parallel hardening | May support release-blocking data quality if it strengthens first path without becoming primary narrative. |
| MJ-011 | Conditional MVP_SUPPORT / P1 | Only after user/object scope is stable or if needed for guest/object-scope proof. |

### 3.3 P1 Journeys
| Journey | Decision | Reason |
| --- | --- | --- |
| MJ-008 | P1_AFTER_MVP | Review monitoring is useful but not first product proof and must not execute advice. |
| MJ-009 | P1_AFTER_MVP | Mobile/client communication layer is valuable after core release/visibility safety is stable. |
| MJ-011 | P1 unless object-scope proof requires it | External advisor scope compounds guest/tenant leakage risk. |

### 3.4 Hold / P2 Journeys
| Journey | Decision | Reason |
| --- | --- | --- |
| MJ-004 | HOLD / P2 | Committee review depends on held routes `070–071` and unresolved committee governance scope. |
| MJ-007 | HOLD / P2 | KYC/SoW/suitability/IPS depend on held routes `064–067` and high-risk advice/suitability semantics. |

### 3.5 Product Decision Register Inherited
| Decision ID | Decision | Status | Impact |
| --- | --- | --- | --- |
| PD-001 | Providerless Auth Stub with real mapped users/tenants/roles is target scope. | LOCKED | Define current-user/session/user-admin requirements before implementation. |
| PD-002 | MVP proof spine is a portfolio, not one mega-journey. | LOCKED | Requirements must structure work by selected portfolio. |
| PD-003 | Export remains MVP late-stage, not default P1. | LOCKED_WITH_SEQUENCE | Build after evidence/release semantics, before final MVP acceptance. |
| PD-004 | Committee review remains hold/P2. | LOCKED_FOR_NOW | No committee first-path tasks. |
| PD-005 | KYC/SoW/Suitability/IPS remain hold/P2. | LOCKED_FOR_NOW | Dedicated future policy/suitability artefact required. |
| PD-006 | Mobile/communication is P1 expansion. | LOCKED_FOR_NOW | First prove released client-safe projection. |
| PD-007 | Data quality is parallel support, not primary first narrative. | LOCKED_FOR_NOW | Use only as release-blocking acceptance layer if needed. |
| PD-008 | External advisor access is conditional P1/MVP support. | OPEN_CONDITIONAL | Pull only after user/object scope is stable. |

## 4. Requirement Taxonomy
| Label | Meaning |
| --- | --- |
| MVP_FOUNDATION_REQUIREMENT | Required before any journey can be trusted. |
| MVP_JOURNEY_REQUIREMENT | Required by a selected MVP mega-journey. |
| MVP_SUPPORT_REQUIREMENT | Supports MVP but is conditional or parallel. |
| P1_DEFERRED_REQUIREMENT | Valuable after MVP proof; not first-path scope. |
| HOLD_BLOCKED_REQUIREMENT | Blocked by held routes or unresolved safety/scope. |
| SAFETY_CRITICAL_REQUIREMENT | Affects RBAC, visibility, advice boundary, evidence, audit or export. |
| ACCEPTANCE_REQUIRED | Must have positive acceptance criteria. |
| NEGATIVE_ACCEPTANCE_REQUIRED | Must have bypass/leakage/fail-closed tests. |
| CODEX_LATER_CANDIDATE | Can later become implementation work after final handoff. |
| DO_NOT_CREATE_CODEX_TASK_NOW | Must not become a Codex task from this artefact. |

## 5. Cross-Journey P0 Foundation Requirements

These foundations are required before per-journey implementation can be trusted. They are requirements only and may later become work packages after a proper handoff.
| Requirement ID | Requirement Name | Source Journey(s) | Product Requirement | Functional Requirement | Safety Requirement | Route Touchpoints | API Touchpoints | Schema / Model Touchpoints | Acceptance Criteria | Negative Acceptance Criteria | Test Mapping | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FND-001 | Providerless Auth Stub with real mapped current user | MJ-001, MJ-006, MJ-010, MJ-011 | Provider may technically return true, but the app must resolve a deterministic user, tenant membership, roles and object scope. | Current-user/session mapping returns persisted/demo-seeded actor context. | Unknown/unmapped actor fails closed; no anonymous payload expansion. | 001-006, 013-018 | Candidate current-user; /api/demo-workflow where action transport exists | User, UserProfile, ClientTenant, UserRole | Mapped user can access only scoped journey surfaces. | Unknown user denied; wrong tenant hidden; no payload leak. | P0-POS-001, P0-NEG-010 | CODEX_LATER_CANDIDATE |
| FND-002 | Tenant membership and object scope | MJ-001, MJ-006, MJ-010, MJ-011 | All work happens inside tenant/object context. | Route/action/payload lookups require tenant/object scope. | Cross-tenant and wrong-object requests fail closed. | 001, 018, 027-030, 048-051, 054-058 | /api/documents, /api/documents/upload, /api/demo-workflow | ClientTenant, UserRole, Document, Decision, EvidenceRecord, ExportRequest | Scoped actor sees own object only. | Wrong tenant/object gets denial + audit + no payload. | permission-engine slice; add route/API negatives | CODEX_LATER_CANDIDATE |
| FND-003 | Role / permission / action / payload visibility separation | MJ-001, MJ-006, MJ-010, all MVP | Route visibility does not grant action or payload rights. | Separate checks for route shell, action, object and field visibility. | No role may infer payload visibility from route access alone. | 008-010, 048-051, 019-020, 054-058 | /api/demo-workflow, /api/documents | Role, Permission, RolePermission, UserRole, PolicyDefinition | Permitted role performs scoped action only. | Route access without action/payload returns hidden/redacted/denied. | P0_RBAC_ACTION_GATE, P0_PAYLOAD_VISIBILITY_GATE | CODEX_LATER_CANDIDATE |
| FND-004 | Admin non-bypass | MJ-010, MJ-006, MJ-001 | Admins can configure governance, not force advisory outcomes. | Admin mutations cannot set release, sufficiency, visibility or export approval outside gates. | Admin bypass attempts denied and audited. | 009,010,048-051,040,057 | /api/demo-workflow; future governance APIs only if locked later | Role, Permission, UserRole, AccessRequest, SecondConfirmation, AuditEvent | Admin role change succeeds only within governance policy. | Admin cannot force release/evidence/export/visibility. | P0-NEG-003 | CODEX_LATER_CANDIDATE |
| FND-005 | Evidence intake, review, link, relevance, scope and sufficiency | MJ-002, MJ-005 | Evidence has lifecycle; upload creates candidate evidence, not sufficiency. | Document upload/list/review/link/sufficiency states are explicit. | Unreviewed/unlinked/stale/wrong-scope evidence cannot release/export. | 027-030,038-041,046-047 | /api/documents/upload, /api/documents, /api/demo-workflow | Document, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview | Reviewed linked relevant evidence can unlock scoped gate. | Upload success alone cannot unlock anything. | P0-POS-003, P0-NEG-004, P0-NEG-005 | CODEX_LATER_CANDIDATE |
| FND-006 | AI/rules draft internal-only handling | MJ-003, MJ-001 | AI/rules may support internal preparation only. | Draft state/source/internal rationale separated from client-safe summary. | AI Draft/internal rationale never returned to client/API/export payloads. | 033-037,019-020,054-058 | /api/demo-workflow; future draft API only if locked later | Trigger, Recommendation, RecommendationOption, DocumentExtraction, AuditEvent | Draft rejected/rebuilt with evidence and remains internal. | Client/API/export never contains AI Draft/internal rationale. | P0-NEG-001 | CODEX_LATER_CANDIDATE |
| FND-007 | Analyst review and unsupported-claim rejection | MJ-003, MJ-001 | Unsupported claims must be challenged before advisor approval. | Analyst can flag/reject/rebuild draft with evidence links. | Unsupported claims cannot move to client-safe projection. | 033-035,027-030 | /api/demo-workflow | Trigger, Recommendation, DocumentExtraction, EvidenceRecord, AuditEvent | Unsupported claim rejected and evidence-linked rebuild created. | Unsupported claim cannot proceed to advisor/client release. | workflow-gate partial; add draft negatives | CODEX_LATER_CANDIDATE |
| FND-008 | Advisor approval separate from compliance release | MJ-001, MJ-003 | Advisor approval is human review, not release. | Advisor approval sets advisor-approved/compliance-pending state. | No client visibility is created by advisor approval alone. | 036-037,038-040,019-020 | /api/demo-workflow | Approval, Recommendation, ComplianceReview, Decision, AuditEvent | Advisor approval moves item to compliance pending. | advisor-approved does not set clientVisible/releasedToClientAt. | P0-POS-004, P0-NEG-002 | CODEX_LATER_CANDIDATE |
| FND-009 | Compliance block / request evidence / release | MJ-001, MJ-002 | Compliance is release control point. | Compliance can block, request evidence, or release only after preconditions. | Release without advisor/evidence/audit/preconditions is denied. | 038-042,019-020,043-045 | /api/demo-workflow | ComplianceReview, Approval, Decision, EvidenceRecord, AuditEvent | Compliant item releases client-safe projection. | Missing evidence/advisor approval blocks release. | P0-POS-005, P0_COMPLIANCE_RELEASE_GATE | CODEX_LATER_CANDIDATE |
| FND-010 | Fail-closed client visibility | MJ-001, MJ-002, MJ-006 | Client-facing surfaces show only released/redacted content. | Visibility projection derives from release/redaction rules. | Unknown/unreleased/internal payload is hidden/redacted/denied. | 019-020,043-045,046-047,054-058 | /api/documents, /api/demo-workflow | Decision, Recommendation, EvidenceRecord, ExportRequest, PolicyDefinition | Client sees released safe summary only. | Client does not see drafts/internal notes/compliance notes/unreleased evidence. | P0-POS-006, P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | CODEX_LATER_CANDIDATE |
| FND-011 | Decision record and audit persistence | MJ-001, MJ-002, MJ-006, MJ-010, MJ-005 | Every critical gate action must be traceable. | Audit events store actor, role, target, previous/next state, result and reason. | If required audit cannot persist, safety action stays pending/denied. | 042,043-045,048-051,054-058 | /api/demo-workflow, /api/documents/upload | Decision, AuditEvent, ComplianceReview, ExportRequest, EvidenceRecord | Critical actions write audit rows. | Audit failure does not silently complete action. | P0-POS-007, P0-NEG-009 | CODEX_LATER_CANDIDATE |
| FND-012 | Export scope, redaction, approval, download/share separation | MJ-005 | Export is client-safe projection, not raw data dump. | Export lifecycle separates scope, redaction, preview, approval, generation/download/share. | Forbidden internal payload never enters package. | 054-058 | /api/demo-workflow; future export endpoint only if locked later | ExportRequest, Decision, Document, EvidenceRecord, AuditEvent | Approved export contains scoped redacted content only. | Preview ≠ approval; approval ≠ download/share; forbidden payload absent. | P0-POS-008, P0-NEG-006, P0-NEG-007 | CODEX_LATER_CANDIDATE |
| FND-013 | P0 positive and negative proof | All MVP portfolio journeys | Every MVP claim needs positive and negative proof. | Acceptance covers happy path plus bypass/leakage/fail-closed cases. | No journey can be declared done from route/API/schema/test presence alone. | All MVP routes | All four existing APIs | All safety-critical models | P0 positives pass. | P0 negatives fail safely with audit/no leak. | P0-POS-001..009; P0-NEG-001..012 | CODEX_LATER_CANDIDATE |

## 6. MVP Journey Requirements Matrix

### 6.1 `MJ-001` — New Family Office onboarding to first client-safe decision

| Field | Value |
| --- | --- |
| Journey summary | A new deterministic tenant/user/role context moves through evidence-backed internal preparation, human review, advisor approval, compliance release and client-safe visibility. |
| Why it is MVP | It forces the minimum product spine: providerless but real user mapping, tenant scope, role assignment, evidence, approval, release, audit and client visibility. |
| Product proof | End-to-end proof that AlphaVest is digital first, human reviewed and evidence backed without becoming autonomous advice. |
| Safety proof | Real tenant/user/role mapping, compliance release, client fail-closed visibility, admin non-bypass and audit coverage. |
| Actor map | Principal, Family CFO, Platform/Tenant Admin, Analyst, Advisor, Compliance Officer, Client-facing user |
| Trigger | New tenant / new family office relationship is created or selected for MVP proof. |
| Outcome | One mapped user in a deterministic tenant sees only released client-safe output after all internal gates pass. |
| Route touchpoints | 001-020, 027-045 |
| API touchpoints | /api/demo-workflow; /api/documents |
| Schema/model touchpoints | ClientTenant, User, UserProfile, Role, Permission, UserRole, Document, Recommendation, Approval, ComplianceReview, Decision, AuditEvent |
| Existing test slices | route-smoke, permission-engine, workflow-gate, demo-workflow-api, document-upload-api/flow as slices |
| Missing positive acceptance | current-user mapping; scoped route access; complete advisor→compliance→client-safe happy path |
| Missing negative acceptance | unknown user fail-closed; wrong tenant hidden; advisor-not-release; admin non-bypass; client no-leakage |
| Non-goals / overbuild blockers | Do not implement every tenant/client/admin feature; prove a minimum deterministic path only. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ001-REQ-001 | MJ-001 | Actor context bootstrap | Platform/Admin | New tenant proof path starts | Providerless entry resolves a real mapped user/tenant/role. | Access/onboarding/admin routes show scoped context. | Candidate current-user context; /api/demo-workflow actions use actor context. | User/UserRole/ClientTenant mappings. | Loading/denied states for unknown or unmapped user. | No anonymous demo payload. | Audit user/tenant context resolution where safety relevant. | Mapped actor can proceed through proof path. | Unknown actor denied; wrong tenant hidden. | Demo session/user models; permission slices. | Current-user route/API proof missing. | CODEX_LATER_CANDIDATE |
| MJ001-REQ-002 | MJ-001 | First safe release path | Analyst/Advisor/Compliance | Evidence-backed recommendation reaches compliance | Internal draft, advisor approval and compliance release stay distinct. | 033-045 render states without implying client visibility. | /api/demo-workflow action families require state/gate contracts. | Recommendation, Approval, ComplianceReview, Decision. | Approval pending, release pending, blocked, success, hidden client states. | No unapproved advice, advisor-not-release, compliance release only. | Audit approve/release/block/request evidence. | Client sees released safe summary after compliance release. | Advisor-only approval does not create client visibility. | workflow-gate/demo slices. | End-to-end release projection missing. | CODEX_LATER_CANDIDATE |
| MJ001-REQ-003 | MJ-001 | Client-safe projection | Client | Release accepted | Client portal/mobile receives released projection only. | 019/020/043-045 fail closed when unreleased. | /api/documents and workflow payloads redact internal data. | Decision, Recommendation, EvidenceRecord visibility fields/logic. | Redacted/internal-only/empty states. | Client visibility fail-closed. | Audit release-to-client decision. | Client-safe summary visible only after release. | AI Draft/internal notes/compliance notes absent. | visibility/permission proof slices. | Payload no-leak test missing. | CODEX_LATER_CANDIDATE |

### 6.2 `MJ-002` — Evidence missing to client upload to release

| Field | Value |
| --- | --- |
| Journey summary | Compliance blocks release because evidence is missing; the client uploads evidence; staff reviews, links and accepts sufficiency before release. |
| Why it is MVP | Best client-value slice and strongest existing interaction leverage through document upload mechanics. |
| Product proof | Proves upload is upload only, evidence sufficiency is reviewed/linked/scoped, and release remains blocked until sufficiency is accepted. |
| Safety proof | Evidence insufficiency blocks advisor/compliance release and export. Upload success never unlocks client visibility. |
| Actor map | Client, Family CFO, Analyst, Advisor, Compliance Officer |
| Trigger | Compliance or analyst requests missing evidence. |
| Outcome | Evidence becomes sufficient only after scoped upload, review, linkage and acceptance; then compliance may release client-safe summary. |
| Route touchpoints | 027-030, 038-041, 019 |
| API touchpoints | /api/documents/upload; /api/documents; /api/demo-workflow |
| Schema/model touchpoints | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent |
| Existing test slices | document-upload-api, document-upload-flow, permission-engine, workflow-gate |
| Missing positive acceptance | upload→review→link→sufficiency→release positive path |
| Missing negative acceptance | invalid file UI; denied-role upload UI; upload-not-release; unreviewed/wrong-scope evidence cannot release; audit failure fail-closed |
| Non-goals / overbuild blockers | Do not equate document existence with evidence sufficiency or verification. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ002-REQ-001 | MJ-002 | Evidence request and upload | Compliance/Client | Missing evidence block | Evidence request drives client upload but does not unlock release. | 027-030 and 038-041 show evidence-needed/upload/review states. | /api/documents/upload validates scope/file/user; /api/documents lists scoped rows. | Document, DocumentVersion, DocumentReview, EvidenceRecord, AuditEvent. | Upload in progress, failed, upload-only success, needs evidence. | Upload success is not sufficiency. | Audit request/upload/denial/review. | Client can upload permitted evidence. | Upload cannot unlock release/export/client visibility. | document-upload-api/flow strong slice. | Sufficiency lifecycle missing. | CODEX_LATER_CANDIDATE |
| MJ002-REQ-002 | MJ-002 | Evidence sufficiency review | Analyst/Compliance | Uploaded evidence ready for review | Evidence must be linked, relevant, scoped, reviewed and accepted. | 029/030/046/047 reflect review/link/sufficiency states. | /api/demo-workflow or future evidence endpoint only after handoff. | DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview. | Needs evidence, review pending, verification pending, sufficient/insufficient. | Unreviewed, stale, wrong-scope evidence blocked. | Audit review and sufficiency decision. | Sufficient evidence can satisfy scoped gate. | Wrong-scope evidence cannot satisfy gate. | workflow-gate partial. | Reviewed-linked-sufficient test missing. | CODEX_LATER_CANDIDATE |
| MJ002-REQ-003 | MJ-002 | Evidence-to-release guard | Compliance | Evidence accepted | Compliance can release only after evidence sufficiency and advisor preconditions. | 038-041 and 019 show release/hidden states. | /api/demo-workflow release action must check evidence sufficiency. | ComplianceReview, Decision, EvidenceRecord, AuditEvent. | Release pending, compliance blocked, success. | No release without evidence/advisor/audit. | Audit block/release/request evidence. | Release creates client-safe summary. | Missing evidence keeps client hidden. | permission/workflow slices. | End-to-end evidence-to-release missing. | CODEX_LATER_CANDIDATE |

### 6.3 `MJ-003` — AI draft rejected and rebuilt with evidence

| Field | Value |
| --- | --- |
| Journey summary | An internal AI/rules draft is generated, found unsupported, rejected by analyst, rebuilt with evidence, then sent to advisor review. |
| Why it is MVP | AI governance is differentiating and must be safe from the first MVP proof. |
| Product proof | Proves AlphaVest can use AI/rules internally while preserving human review and no-unapproved-advice boundary. |
| Safety proof | AI/rules draft, internal rationale and unsupported claims are never client-visible or export-visible. |
| Actor map | System/AI producer, Analyst, Advisor, Compliance Officer |
| Trigger | Low-confidence or unsupported internal draft appears in workbench. |
| Outcome | Unsupported draft is rejected/rebuilt with evidence and routed to advisor approval without client exposure. |
| Route touchpoints | 033-037 |
| API touchpoints | /api/demo-workflow; candidate internal draft endpoint only after later handoff |
| Schema/model touchpoints | Trigger, Recommendation, RecommendationOption, DocumentExtraction, EvidenceRecord, AuditEvent |
| Existing test slices | demo-workflow-api and workflow-gate partial slices |
| Missing positive acceptance | internal draft rebuild with evidence and advisor-reviewed transition |
| Missing negative acceptance | client/API/export payload contains no AI Draft/internal rationale; unsupported claim cannot proceed as client-safe advice |
| Non-goals / overbuild blockers | Do not build production LLM integration; lock internal draft semantics and redaction first. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ003-REQ-001 | MJ-003 | Internal draft classification | System/AI, Analyst | Draft generated | AI/rules output is internal-only and source/evidence-linked. | 033-035 show internal workbench only; no client route projection. | /api/demo-workflow internal action families only. | Trigger, Recommendation, RecommendationOption, DocumentExtraction. | Internal-only, unsupported, needs evidence, rebuild states. | AI Draft hidden from client/API/export. | Audit draft rejection/rebuild. | Draft can be reviewed internally. | Client never receives draft/internal rationale. | demo/workflow partial. | Dedicated AI draft leakage missing. | CODEX_LATER_CANDIDATE |
| MJ003-REQ-002 | MJ-003 | Unsupported-claim rejection | Analyst | Low confidence claim found | Analyst can reject unsupported draft and require evidence. | 033-035 show reject/rebuild states. | /api/demo-workflow action must preserve noClientRelease. | Recommendation status, EvidenceRecord links, AuditEvent. | Validation failed, needs evidence, blocked. | Unsupported draft cannot advance as advice. | Audit rejection and evidence request. | Unsupported claim is blocked until rebuilt. | Unsupported claim cannot be approved/released. | workflow-gate partial. | Unsupported-claim negative missing. | CODEX_LATER_CANDIDATE |
| MJ003-REQ-003 | MJ-003 | Advisor review after rebuild | Advisor | Rebuilt draft ready | Advisor reviews evidence-backed draft without release authority. | 036-037 advisor routes show approve/request evidence. | /api/demo-workflow approval action separates advisor approval from compliance release. | Approval, Recommendation, ComplianceReview. | Approval pending/release pending. | Advisor approval is not release. | Audit advisor approve/reject. | Advisor approval moves to compliance pending. | ClientVisible remains false until compliance release. | workflow-gate partial. | Route/API/client advisor-not-release missing. | CODEX_LATER_CANDIDATE |

### 6.4 `MJ-010` — Admin role change cannot bypass compliance release

| Field | Value |
| --- | --- |
| Journey summary | An admin changes or grants a broad role, but that authority cannot force compliance release, evidence sufficiency, visibility or export. |
| Why it is MVP | Providerless auth with real user semantics requires proof that admin power is governance-scoped, not a safety bypass. |
| Product proof | Proves admin/user/role administration exists as product semantics without undermining advice, compliance or visibility gates. |
| Safety proof | Admin non-bypass, sensitive action audit, second confirmation and release denial remain mandatory. |
| Actor map | Platform Admin, Tenant Admin, Security/Governance Admin, Compliance Officer |
| Trigger | Admin grants/modifies role or tries broad privilege path. |
| Outcome | Role update may be recorded/audited, but release remains blocked unless advisor/compliance/evidence gates pass. |
| Route touchpoints | 009, 010, 048-051, 040 |
| API touchpoints | /api/demo-workflow; candidate governance APIs only after later handoff |
| Schema/model touchpoints | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation, AuditEvent, ComplianceReview |
| Existing test slices | permission-engine and demo-workflow-api partial slices |
| Missing positive acceptance | role assignment/change with governance process and audit |
| Missing negative acceptance | admin force-release; self-approval; stale/cached privilege; evidence/export/visibility bypass |
| Non-goals / overbuild blockers | Do not let admin UI imply unrestricted payload visibility or release authority. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ010-REQ-001 | MJ-010 | Sensitive role change | Admin/Security | Admin grants or modifies role | Role changes are scoped, reasoned and audited. | 009,010,048-051 show governance state and second confirmation where needed. | /api/demo-workflow governance actions until real API is locked. | Role, Permission, UserRole, AccessRequest, SecondConfirmation, AuditEvent. | Validation/confirmation/permission states. | Role change cannot expand payload visibility beyond policy. | Audit role change and denied actions. | Allowed role change persists/goes pending. | Self-approval and broad bypass denied. | permission-engine partial. | Sensitive action matrix missing. | CODEX_LATER_CANDIDATE |
| MJ010-REQ-002 | MJ-010 | Release bypass denial | Admin/Compliance | Admin attempts release or visibility bypass | Admin authority cannot force compliance release or client visibility. | 040 and governance routes show denied/blocked state. | /api/demo-workflow release action requires compliance role and preconditions. | ComplianceReview, Decision, AuditEvent, RolePermission. | Blocked, permission denied, audit unavailable. | Admin non-bypass. | Audit denied bypass attempt. | Compliance role can release with prerequisites. | Admin cannot release without gates. | permission-engine partial. | Dedicated admin bypass missing. | CODEX_LATER_CANDIDATE |
| MJ010-REQ-003 | MJ-010 | Privilege cache/staleness guard | System/Admin | Role changed | Changed role cannot leave stale privilege that bypasses gates. | Admin/governance routes and any action surfaces refresh effective scope. | Future access/current-user APIs if required. | UserRole, RolePermission, AccessRequest. | Stale/conflict state. | Fail closed on stale/unknown privileges. | Audit privilege evaluation where sensitive. | New role effective according to policy. | Stale privilege cannot release/export/visibility. | No direct proof found. | Stale/cached privilege negative missing. | CODEX_LATER_CANDIDATE |

### 6.5 `MJ-006` — Cross-tenant access denied with audit proof

| Field | Value |
| --- | --- |
| Journey summary | A user attempts to access unrelated tenant/object data and receives safe denial; no payload leaks and audit proof exists. |
| Why it is MVP | A Family Office OS is not credible unless tenant/object isolation is proven early. |
| Product proof | Proves route access, action permission, object scope and payload visibility are separate layers. |
| Safety proof | Wrong-tenant/wrong-object requests fail closed with safe feedback and audit event. |
| Actor map | External Advisor, Client/Family Office user, Security Admin, System |
| Trigger | Actor requests unrelated tenant/object/document/decision/export scope. |
| Outcome | Denied response, no sensitive payload, audit event and no state mutation. |
| Route touchpoints | 001, 018, 048-051 |
| API touchpoints | /api/demo-workflow; candidate current-user/access APIs after requirements lock |
| Schema/model touchpoints | User, UserRole, RolePermission, AccessRequest, AuditEvent |
| Existing test slices | permission-engine strong negative slice; route-smoke shell only |
| Missing positive acceptance | scoped user sees only permitted object |
| Missing negative acceptance | route shell denial; API no-leak; export/document/decision object-scope negatives |
| Non-goals / overbuild blockers | Do not treat route 200 or heading smoke as authorization proof. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ006-REQ-001 | MJ-006 | Cross-tenant denial | External Advisor/User | Wrong tenant/object request | Tenant/object isolation prevents leakage. | 001,018,048-051 and object routes return safe denial. | /api/demo-workflow and /api/documents enforce tenant/object filters. | UserRole, RolePermission, AccessRequest, AuditEvent. | Permission denied / hidden state. | Wrong tenant/object no payload. | Audit denied access. | Scoped object access allowed. | Wrong tenant denied and no payload. | permission-engine strong slice. | Route/API no-leak matrix missing. | CODEX_LATER_CANDIDATE |
| MJ006-REQ-002 | MJ-006 | Payload visibility denial | Actor with route shell only | Route visible or request made | Route access does not grant payload. | Client/governance/document/export surfaces filter fields by actor/state. | /api/documents and exports redact/hide fields. | PolicyDefinition, Permission, Document, Decision, ExportRequest. | Redacted/internal-only/hidden state. | No payload leakage. | Audit denied sensitive field/action where required. | Allowed actor sees allowed fields. | Disallowed actor receives empty/redacted/denied. | permission-engine partial. | Field-level redaction test missing. | CODEX_LATER_CANDIDATE |
| MJ006-REQ-003 | MJ-006 | Denied access audit | Security/Governance | Denied access occurs | Denied access is traceable without exposing data. | 048-051 audit history supports safe audit display. | /api/demo-workflow audit result; future audit API only if locked. | AuditEvent, AccessRequest. | Audit unavailable fail-closed. | If audit required cannot persist, action remains denied. | Audit denied access. | Denied event recorded. | Audit failure does not permit action. | permission-engine denied audit. | Audit failure simulation missing. | CODEX_LATER_CANDIDATE |

### 6.6 `MJ-005` — Export package with forbidden internal payload redaction

| Field | Value |
| --- | --- |
| Journey summary | After release/evidence semantics exist, an export package is scoped, redacted, approved and downloaded/shared without forbidden internal payload. |
| Why it is MVP | Export/redaction is a core trust output once client-safe release semantics are stable. |
| Product proof | Proves AlphaVest can produce a client-safe evidence/decision package without leaking internal working material. |
| Safety proof | Preview, approval, generation/download/share and client acceptance remain separate; forbidden internal fields are excluded. |
| Actor map | Advisor, Compliance Officer, Client/Principal, Privacy/Governance role |
| Trigger | Client-safe package requested after release. |
| Outcome | Scoped, redacted, approved package/manifest without AI Draft, internal rationale, compliance notes or unreleased evidence. |
| Route touchpoints | 054-058 |
| API touchpoints | /api/demo-workflow; future export API only after requirements lock |
| Schema/model touchpoints | ExportRequest, Decision, EvidenceRecord, Document, AuditEvent |
| Existing test slices | file-export-realism service slice; permission-engine partial |
| Missing positive acceptance | approved redacted export lifecycle and manifest |
| Missing negative acceptance | forbidden internal payload; no approval no download; missing redaction; audit failure blocks; preview not approval |
| Non-goals / overbuild blockers | Do not build real binary storage or production delivery first; metadata/package-manifest proof is acceptable for MVP. |
| Later Codex candidate status | `CODEX_LATER_CANDIDATE`; not executable from this artefact. |

| Requirement ID | Journey | Step | Actor | Trigger | Product Requirement | UI / Route Requirement | API Requirement | Schema / Data Requirement | State / Feedback Requirement | Safety Requirement | Audit Requirement | Acceptance Criteria | Negative Acceptance Criteria | Existing Proof Slice | Missing Proof | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ005-REQ-001 | MJ-005 | Export scope selection | Advisor/Compliance | Client-safe package requested | Export scope must be deliberate and constrained by visibility/object permissions. | 054-055 show scoped export creation/selection states. | /api/demo-workflow export actions; future export endpoint only after handoff. | ExportRequest, Decision, EvidenceRecord, Document. | Export pending, scope incomplete, validation failed. | Scope cannot include unreleased/internal objects. | Audit scope selection if sensitive. | Scoped export can proceed to redaction. | Unreleased/wrong-scope object blocked. | file-export-realism partial. | Route/API scope negative missing. | CODEX_LATER_CANDIDATE |
| MJ005-REQ-002 | MJ-005 | Redaction and approval separation | Compliance/Privacy | Export scope selected | Redaction, preview, approval and download/share are separate. | 056-058 show redaction/preview/download states. | Export actions cannot treat preview as approval. | ExportRequest redactionProfile, approvalRequired, approvedByUserId. | Export redaction pending, approval pending, download pending. | Preview is not approval; approval is not download/share. | Audit approval/download/share. | Approved export can be generated/shared. | No approval/no redaction blocks generation. | file-export-realism service slice. | Route/API lifecycle missing. | CODEX_LATER_CANDIDATE |
| MJ005-REQ-003 | MJ-005 | Forbidden internal payload exclusion | System/Export | Export package generated | Package contains only released, redacted, scoped content. | 054-058 export route family never shows internal payload. | Export payload/manifest excludes AI Draft/internal rationale/compliance notes. | ExportRequest, Decision, EvidenceRecord, Document, AuditEvent. | Success wording limited to package generation/download. | No internal rationale, AI Draft, compliance notes or unreleased evidence. | Audit generated package. | Client-safe manifest contains allowed content only. | Forbidden fields absent. | file-export-realism partial. | Forbidden payload negative missing. | CODEX_LATER_CANDIDATE |

## 7. MVP Support / Parallel Hardening Requirements
| Support Journey | Scope Decision | Requirement | Include Now? | Condition for Inclusion | Routes | APIs | Schema | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ-012 | MVP_SUPPORT / Parallel hardening | Data-quality issue blocks release until resolved | Conditional Yes | Include if high-severity data quality blocks are made explicit release blockers, not as primary product narrative. | 034, 038-040, 059-060 | /api/demo-workflow; service-level data-quality checks | DataQualityIssue, ComplianceReview, AuditEvent | High severity issue blocks readiness/release until resolved and audited. | Cannot release/export when high-severity issue remains open. | CODEX_LATER_CANDIDATE_AFTER_CORE_SCOPE |
| MJ-011 | MVP_SUPPORT / P1 conditional | External advisor receives scoped document access only | Conditional / Default P1 | Include only after current user, tenant and object-scope proof is stable or if guest-scope negative proof is required. | 003,018,027,028 | /api/documents; /api/documents/upload | User, UserRole, Document, AccessRequest, AuditEvent | Guest sees only invited object/document. | Guest cannot see tenant-wide/internal/advisory payloads. | P1_DEFERRED_UNLESS_SCOPE_PROOF_NEEDED |

## 8. P1 / Hold / Future Exclusion Matrix
| Journey | Decision | Why Not MVP First Path | What Must Be True Before Unlock | Risk If Pulled Too Early | Do-Not-Create Rule |
| --- | --- | --- | --- | --- | --- |
| MJ-008 | P1_AFTER_MVP | Review monitoring is valuable but not first client-safe decision proof. | Core workflow, no-auto-advice and internal monitoring boundary tests complete. | Could be mistaken as automatic rebalance/advice execution. | Do not create MVP task for review monitoring auto-advice or client-visible rebalance. |
| MJ-009 | P1_AFTER_MVP | Mobile request / communication is client-value layer after core release safety. | Client visibility and message visibility rules stable. | Can leak internal/advisory content too early. | Do not create first-path communication/mobile advisory workflow task. |
| MJ-011 | P1 or MVP_SUPPORT conditional | External advisor access adds guest/object-scope complexity. | Core user/object scope and guest denial matrix complete. | Guest access may become tenant-wide or bypass client/internal separation. | Do not include tenant-wide guest access; only scoped access after unlock. |
| MJ-004 | HOLD / P2 | Committee routes 070-071 and governance depth are unresolved. | Committee scope, vote/quorum/dissent/evidence model and visual/state/safety unlock. | Creates heavy governance before basic release and evidence semantics are stable. | Do not pull committee into MVP; no 070/071 implementation from this matrix. |
| MJ-007 | HOLD / P2 | KYC/SoW/suitability/IPS routes 064-067 are held and advice risk is high. | Dedicated KYC/suitability policy lock and evidence/suitability acceptance model. | May imply regulated suitability/advice logic too early. | Do not include KYC/SoW/Suitability/IPS in MVP first path. |

## 9. First Product Build Path Requirements
| Build Step | Journey Dependency | Requirement Bundle | Required Reality | Acceptance Signal | Blocking Dependency | Later Codex Package Candidate | Stop Rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | MJ-001, MJ-010, MJ-006 | Providerless current-user / tenant / role mapping | Mapped actor context derived from persisted/demo-seeded users; provider may stay stubbed. | Mapped user has deterministic tenant, role, object scope and payload visibility; unknown fails closed. | FND-001/FND-002 | WP-CAND-01 | Providerless must not mean anonymous demo mode. |
| 2 | MJ-001, MJ-010 | Tenant/user/role administration baseline | Tenant setup, user invite/assignment, role templates, sensitive changes and second confirmation are mapped. | Admin can manage users/roles without release/payload bypass. | FND-003/FND-004 | WP-CAND-01, WP-CAND-02 | No admin release bypass. |
| 3 | MJ-002 | Evidence missing → upload → verification path | Upload, document list, extraction/review, link and sufficiency semantics aligned. | Upload-only success; release blocked until evidence sufficient. | FND-005 | WP-CAND-03 | No upload-to-release shortcut. |
| 4 | MJ-003 | Internal draft / analyst review path | Internal draft state, unsupported claim rejection, source/evidence trace and rebuilt draft. | AI/rules draft never appears in client payload. | FND-006/FND-007 | WP-CAND-04 | No production AI model integration required now. |
| 5 | MJ-001, MJ-003 | Advisor approval path | Advisor approval and compliance release remain distinct. | Advisor approval sets compliance-pending, not client-visible. | FND-008 | WP-CAND-04 | Advisor approval is not release. |
| 6 | MJ-001, MJ-002 | Compliance block/release path | Compliance review, block, request evidence, release confirmation and audit. | Only compliance release after prerequisites creates client-safe projection. | FND-009 | WP-CAND-05 | No release without evidence/advisor/audit. |
| 7 | MJ-001, MJ-006 | Client visibility fail-closed path | Portal/mobile/client payloads derive from release/redaction rules. | Unreleased/internal content hidden/redacted; client sees only safe summary. | FND-010 | WP-CAND-05 | Manual visibility override not allowed. |
| 8 | MJ-001, MJ-010, MJ-006, MJ-002 | Decision record and audit trail path | Decision state and AuditEvent coverage for upload, review, approve, block, release, deny, export. | Critical actions write audit or action holds/denies. | FND-011 | WP-CAND-06 | No audit display-as-persistence overclaim. |
| 9 | MJ-005 | Export/redaction path | Metadata-only package/manifest first; scope/redaction/approval/download/share separated. | Forbidden internal payload absent; audit written. | FND-012 | WP-CAND-07 | No raw internal package. |
| 10 | All MVP portfolio | P0 positive/negative proof path | Positive and negative acceptance mapped to route/API/schema/test obligations. | P0 tests prove happy path plus no-leakage, non-bypass and fail-closed cases. | FND-013 | WP-CAND-08 | Existing tests are proof slices only. |

## 10. Journey-to-Route / API / Schema / Test Matrix

### 10.1 Journey-to-Route Matrix
| Journey | Route IDs | Route Paths | Route Scope | Required Behaviour | State/Feedback Requirement | Safety Dependency | Deferred/Hold Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MJ-001 | 001-020, 027-045 | access/onboarding, admin/tenant, portal/mobile, documents, workbench, advisor, compliance, decisions | MVP + MVP_SUPPORT | Real mapped user, tenant, evidence, draft, advisor, compliance, decision and client-safe projection. | Loading/denied/release pending/client hidden/success states. | RBAC, client visibility, advice boundary, evidence, audit. | No full tenant universe overbuild. |
| MJ-002 | 027-030, 038-041, 019 | documents, upload, extraction review, compliance block/release, portal | MVP | Evidence request/upload/review/link/sufficiency/release-safe summary. | Upload-only success, needs evidence, verification pending, compliance blocked. | Evidence sufficiency, audit, visibility, upload-not-release. | External advisor piece deferred unless object-scope proof needed. |
| MJ-003 | 033-037 | signals, workbench, trigger detail, advisor approval | MVP | Internal AI/rules draft rejection/rebuild and advisor review. | Internal-only, unsupported, needs evidence, approval pending. | AI Draft internal-only, no unapproved advice, advisor-not-release. | No production AI integration. |
| MJ-010 | 009,010,048-051,040 | roles, security, governance, access requests, audit history, release | MVP + MVP_SUPPORT | Role/admin changes cannot bypass compliance release. | Confirmation, validation, denied, audit unavailable. | Admin non-bypass, RBAC, audit, compliance release. | No unrestricted admin payload access. |
| MJ-006 | 001,018,048-051 plus object surfaces | login, tenant users, governance, audit | MVP safety spine + support | Cross-tenant/object access denied with audit and no payload leak. | Permission denied, redacted/hidden, audit state. | Tenant isolation, object scope, payload visibility. | Route 200 not authorization. |
| MJ-005 | 054-058 | export new, scope, redaction, preview, download/share | MVP late first path | Scoped redacted export package after release/evidence semantics. | Export pending, redaction pending, approval pending, download success/failure. | Export redaction, client visibility, audit, evidence. | No real binary storage first; no raw data package. |

### 10.2 Journey-to-API Matrix
| Journey | API | Existing or Candidate | Required Behaviour | Request Contract | Response Contract | Safety / Redaction Rule | Error / Fail-Closed Rule | Test Requirement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MJ-001 | /api/demo-workflow | Existing | Action transport for proof path, with actor/context/gate controls. | Action name, actor/session context, target object, preconditions. | No client release unless gates pass; safe result states. | No unapproved advice; client-safe only after release. | Invalid/precondition failure returns no mutation/no leak. | Release happy path + advisor-not-release negative. |
| MJ-001 | /api/documents | Existing | Scoped document list for evidence context. | tenant/user/object filter. | Redacted/scoped documents only. | Internal raw fields hidden. | Denied/empty/error fail closed. | List RBAC/tenant isolation tests. |
| MJ-002 | /api/documents/upload | Existing | Validate upload and create upload-only domain rows. | file, tenant, actor, type/size, target/link metadata. | Upload-only success; queued/review state. | Upload cannot release/export/client visibility. | Invalid/denied/audit failure no row/no unlock. | Upload-not-sufficiency positives and negatives. |
| MJ-002 | /api/documents | Existing | Reload/list uploaded evidence candidate. | tenant/user/object filtered query. | Scoped rows; no sufficiency overclaim. | Client-safe projection only if released/redacted. | Empty/denied/error fail closed. | Denied and redaction tests. |
| MJ-003 | /api/demo-workflow | Existing | Internal draft reject/rebuild/approval demo action transport. | action, draft/recommendation ID, actor role, reason/evidence link. | Internal-only state; noClientRelease true until release. | AI Draft/internal rationale hidden from client/export. | Invalid/unsupported action returns no mutation/no leak. | AI draft redaction and unsupported-claim negative. |
| MJ-010 | /api/demo-workflow | Existing | Governance/role/release action slices. | actor, role change target, reason/confirmation, target object. | Role change result or denial, never release bypass. | Admin cannot force visibility/release/export. | Denied bypass audited and no mutation. | Admin bypass suite. |
| MJ-006 | /api/demo-workflow | Existing | Access denial/action guard proof. | actor, tenant/object/action. | Denied safe payload and audit info where allowed. | No sensitive payload on wrong tenant/object. | Error/denial no mutation. | Cross-tenant/API no-leak tests. |
| MJ-005 | /api/demo-workflow | Existing | Export action family proof transport. | export scope/action/approval state. | Export status without forbidden payload. | Released/redacted/scoped content only. | No approval/redaction/audit fails closed. | Export lifecycle/forbidden payload tests. |
| MJ-008 | /api/review-monitoring | Existing but P1 | Internal review monitoring only. | asOf/filter/user scope if elevated later. | Internal snapshot, no client advice. | No auto-advice/client release. | Denied/error fail closed if elevated. | P1 no-auto-advice tests if unlocked. |
| MJ-001/MJ-006/MJ-010 | Candidate current-user/access API | Candidate only | Resolve mapped user/tenant/role/object scope. | session/provider stub context. | actor context or fail-closed denial. | No anonymous demo expansion. | Unknown/mismatched user denied. | Only after final handoff if accepted. |

### 10.3 Journey-to-Schema Matrix
| Journey | Models / Fields | Requirement | Full-Workflow Baseline | Gap / Mapping Need | Safety Relevance | Test Obligation | Schema Change Now? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MJ-001 | ClientTenant, User, UserProfile, Role, UserRole, Recommendation, Approval, ComplianceReview, Decision, AuditEvent | Real actor/context and release path. | Models exist in full-workflow baseline. | current-user/session and released projection semantics. | RBAC, visibility, advice boundary, audit. | end-to-end current-user/release/client projection. | No |
| MJ-002 | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent | Evidence lifecycle and sufficiency. | Upload/evidence models exist. | Sufficiency semantics and review/link states. | Evidence, audit, upload-not-sufficiency. | sufficiency positive/negative. | No |
| MJ-003 | Trigger, Recommendation, RecommendationOption, DocumentExtraction, EvidenceRecord, AuditEvent | Internal AI/rules draft and rejection/rebuild. | Recommendation/Trigger fields exist; AI draft may be semantic/merged. | Explicit internal draft/source/redaction mapping. | AI internal-only, no unapproved advice. | AI draft leakage negative. | No |
| MJ-010 | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation, AuditEvent, ComplianceReview | Governance and admin non-bypass. | RBAC/governance models exist. | Sensitive action list, second confirmation and bypass-denial mapping. | Admin non-bypass, audit. | admin bypass negative suite. | No |
| MJ-006 | User, UserRole, RolePermission, AccessRequest, AuditEvent, PolicyDefinition | Tenant/object isolation and payload visibility. | Permission engine and models exist. | Field-level redaction/visibility mapping. | Tenant isolation, payload visibility. | route/API no-leak negatives. | No |
| MJ-005 | ExportRequest, Decision, EvidenceRecord, Document, AuditEvent | Export scope/redaction/approval/package. | ExportRequest and service proof slices exist. | Forbidden payload and lifecycle mapping. | Export redaction, client visibility, audit. | forbidden payload/export lifecycle tests. | No |
| MJ-012 | DataQualityIssue, ComplianceReview, AuditEvent | High severity issue can block release if included. | DataQualityIssue/service exists. | Attach to release-blocking acceptance only if selected. | Release readiness, audit. | data-quality block/unblock test. | No |

### 10.4 Journey-to-Test Matrix
| Journey | Existing Test Slice | What It Proves | What It Does Not Prove | Missing Positive Test | Missing Negative Test | P0 Gate |
| --- | --- | --- | --- | --- | --- | --- |
| MJ-001 | route-smoke; permission-engine; workflow-gate; demo-workflow-api; document-upload slices | Route shell, permission/workflow slices, upload slices. | Real current-user mapping, client-safe release end-to-end. | Mapped user completes release path. | Unknown user / advisor-only / internal payload leakage denied. | P0_ROUTE_ACCESS, P0_CLIENT_VISIBILITY, P0_NO_UNAPPROVED_ADVICE |
| MJ-002 | document-upload-api; document-upload-flow | Upload mechanics, invalid file, denied role slice, row reload. | Evidence sufficiency and release lock. | Reviewed linked sufficient evidence unlocks scoped release. | Upload alone cannot release/export/client visibility. | P0_UPLOAD_NOT_SUFFICIENCY, P0_EVIDENCE_SUFFICIENCY |
| MJ-003 | demo-workflow-api; workflow-gate partial | Some internal noClientRelease/gate logic. | AI Draft redaction and unsupported-claim full lifecycle. | Unsupported draft rebuilt with evidence. | Client/API/export never sees AI Draft/internal rationale. | P0_AI_DRAFT_INTERNAL_ONLY, P0_NO_UNAPPROVED_ADVICE |
| MJ-010 | permission-engine; demo-workflow-api partial | Permission denial and some audit slices. | Admin non-bypass across release/evidence/export/visibility. | Governed role change audited. | Admin cannot force release/evidence/export/visibility. | P0_ADMIN_NON_BYPASS, P0_RBAC_ACTION |
| MJ-006 | permission-engine strong slice; route-smoke shell | Cross-tenant denial and denied audit slice. | Route/API/export/document payload no-leak matrix. | Scoped actor accesses own object only. | Wrong tenant/object no payload and audit. | P0_PAYLOAD_VISIBILITY, P0_CLIENT_VISIBILITY_FAIL_CLOSED |
| MJ-005 | file-export-realism; permission-engine partial | Manifest metadata controls and approval/redaction profile slice. | Forbidden payload redaction and route/API lifecycle. | Approved redacted export manifest/package. | No internal rationale/AI Draft/compliance notes; preview not approval. | P0_EXPORT_REDACTION, P0_EXPORT_APPROVAL |

## 11. Safety Gate Requirements Matrix
| Safety Gate | MVP Journey Coverage | P1/Future Dependency | Current Proof Slice | Missing Proof | Acceptance Requirement | Negative Acceptance Requirement |
| --- | --- | --- | --- | --- | --- | --- |
| Real current user / tenant / role mapping | MJ-001, MJ-006, MJ-010 | MJ-011, MJ-009 | Demo session/seed/user models exist | Current-user route/API proof missing | Mapped actor context or fail closed | Unknown user and wrong tenant denied |
| Tenant/object isolation | MJ-006, MJ-001 | MJ-011, MJ-009, integrations | permission-engine slice | Route/API/export/document no-leak matrix | Scoped actor sees own object | Wrong object safe denial + audit |
| RBAC route/action/object/payload separation | MJ-006, MJ-010 | All future access journeys | Permission models/services and slices | Full role/action/object/payload matrix | Allowed action only under scope | Route access cannot reveal payload |
| AI Draft internal-only | MJ-003 | MJ-008, future AI | Product contract; partial demo | Dedicated leakage tests missing | Draft can be rebuilt internally | Client/API/export never includes AI draft |
| No unapproved advice | MJ-001, MJ-003, MJ-002 | MJ-004, MJ-007, MJ-008, MJ-009 | workflow-gate/demo slices | End-to-end leakage proof missing | Only released summary visible | Internal recommendation hidden until gates pass |
| Advisor approval not release | MJ-001, MJ-003 | MJ-004, MJ-007 | workflow-gate slices | Route/API/client proof missing | Advisor approval sets pending compliance | No clientVisible from advisor-only state |
| Compliance release | MJ-001, MJ-002 | MJ-004, MJ-007, MJ-009 | Compliance routes/models exist | Release happy path and blocked negatives | Compliance release creates client-safe projection | Missing prereq blocks release |
| Upload not sufficiency | MJ-002 | MJ-011, MJ-009 | Strong upload tests | Release/export/client visibility negative missing | Upload success states upload-only | Upload cannot release/export/show client summary |
| Evidence sufficiency | MJ-002 | MJ-005, MJ-007 | Evidence models/services exist | Review/link/relevance/scope lifecycle missing | Sufficiency explicit and audited | Unreviewed/wrong-scope evidence blocked |
| Client visibility fail-closed | MJ-001, MJ-002, MJ-006 | all client/P1 journeys | Visibility engine/fields exist | Payload-level no-leakage missing | Released/redacted only visible | Unknown/unreleased/unsafe hidden |
| Admin non-bypass | MJ-010 | all governance/admin journeys | permission slices | Admin bypass suite missing | Admin can configure governance | Admin cannot force release/export/visibility/evidence |
| Audit persistence | MJ-002, MJ-006, MJ-010, MJ-005 | all journeys | Audit model/service and rows exist | Audit failure fail-closed missing | Critical action writes audit | Audit failure blocks/holds action |
| Export redaction | MJ-005 | MJ-009, MJ-011, integrations | file-export service slice | Route/API forbidden payload missing | Export released/redacted/scoped content | AI draft/internal rationale/compliance notes absent |
| Review monitoring not advice execution | none first-path; P1 MJ-008 | MJ-008 | review-monitoring service slice | P1 API/client boundary missing | Monitoring creates internal review only | No automatic client advice/rebalance |
| Hold route non-elevation | MJ-004, MJ-007 excluded | MJ-004, MJ-007 | route-smoke/committee partial only | Dedicated unlock artefact missing | Hold remains blocked | 064-067 and 069-071 not silently implemented |

## 12. Requirement Prioritization
| Priority | Requirement IDs | Why | Must Happen Before | Later Codex Package |
| --- | --- | --- | --- | --- |
| P0_MVP_FOUNDATION | FND-001, FND-002, FND-003, FND-004, FND-013 | All journeys depend on actor/scope/permission/proof spine. | Every journey requirement | WP-CAND-01, WP-CAND-02, WP-CAND-08 |
| P0_MVP_JOURNEY | MJ-001-REQ-*, MJ-002-REQ-*, MJ-003-REQ-*, MJ-005-REQ-*, MJ-006-REQ-*, MJ-010-REQ-* | Selected MVP journey portfolio. | Final task conversion | WP-CAND-03..07 |
| P0_MVP_SAFETY_NEGATIVE | FND-003, FND-004, FND-006, FND-008, FND-010, FND-012 | Bypass/leakage/fail-closed proof is decisive product proof. | Any client-facing release/export claim | WP-CAND-02, WP-CAND-05, WP-CAND-07, WP-CAND-08 |
| P0_MVP_TEST_ACCEPTANCE | FND-013 plus missing P0-POS/P0-NEG cases | Existing tests are proof slices only. | MVP acceptance/completion claim | WP-CAND-08 |
| MVP_SUPPORT_CONDITIONAL | MJ-012; MJ-011 if needed for object-scope proof | Support/hardening without destabilizing first path. | Core user/object scope stable | WP-CAND-01/02 conditional |
| P1_AFTER_MVP | MJ-008, MJ-009, default MJ-011 | Valuable expansion after core proof. | MVP P0 proof accepted | Future P1 package |
| HOLD_P2 | MJ-004, MJ-007 | Depends on held routes/scope/safety unlock. | Dedicated unlock artefact | No MVP package |
| DO_NOT_CREATE | Autonomous advice, client-visible AI Draft, admin bypass, upload-to-release, blind schema replacement, screen generation | Violates stop rules. | Never in current matrix | None |

## 13. Product Gap Register from Requirements
| Gap ID | Gap Type | Requirement Impact | Affected Journeys | Severity | Acceptance Blocker | Suggested Requirement Direction | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | Auth/User/Tenant Gap | Current-user/session/user-admin requirements not locked. | MJ-001, MJ-006, MJ-010, MJ-011 | P0 | Blocks route/action/payload decisions. | Define providerless auth and user-admin requirements first. | CODEX_LATER_CANDIDATE |
| GAP-002 | Role/RBAC Gap | Route/action/object/payload matrix not complete. | MJ-006, MJ-010, all MVP | P0 | Cannot safely implement visibility/export. | Map role, action, object and payload separation. | CODEX_LATER_CANDIDATE |
| GAP-003 | Evidence Gap | Upload mechanics strong; sufficiency lifecycle incomplete. | MJ-002, MJ-005 | P0 | Release/export could overclaim evidence. | Define review/link/relevance/scope/acceptance states. | CODEX_LATER_CANDIDATE |
| GAP-004 | AI/Internal Draft Gap | Draft/source/redaction semantics need lock. | MJ-003 | P0 | No-unapproved-advice proof incomplete. | Define internal draft projection and redaction rules. | CODEX_LATER_CANDIDATE |
| GAP-005 | Compliance Release Gap | Release happy path and blocked negatives incomplete. | MJ-001, MJ-002, MJ-003 | P0 | Client visibility cannot be trusted. | Define release preconditions and blocked states. | CODEX_LATER_CANDIDATE |
| GAP-006 | Client Visibility Gap | Client-safe payload projection not concrete enough. | MJ-001, MJ-002, MJ-005, MJ-006 | P0 | Portal/export cannot be declared safe. | Define payload allowlist/redaction/hidden states and tests. | CODEX_LATER_CANDIDATE |
| GAP-007 | Audit Gap | Failure semantics and complete critical coverage not locked. | MJ-002, MJ-006, MJ-010, MJ-005 | P0 | Safety actions may complete without proof. | Add audit persistence/fail-closed acceptance. | CODEX_LATER_CANDIDATE |
| GAP-008 | Export Gap | Route/API/client-safe export contract incomplete. | MJ-005 | P0 late | MVP trust output incomplete if omitted. | Define metadata-only package acceptance before object storage. | CODEX_LATER_CANDIDATE |
| GAP-009 | Hold Route Gap | Committee/KYC/suitability routes held/missing visual refs. | MJ-004, MJ-007 | HOLD | May pull unstable regulated/governance scope into MVP. | Defer to dedicated hold-unlock artefact. | HOLD_BLOCKED_REQUIREMENT |
| GAP-010 | Test Gap | Existing specs are proof slices, not full P0 acceptance. | All MVP journeys | P0 | No journey can be called done. | Map positive and negative tests by journey. | CODEX_LATER_CANDIDATE |
| GAP-011 | State/Interaction Gap | Many states/overlays are visual/partial. | MJ-001, MJ-002, MJ-005, MJ-010 | P0/P1 | User actions may look complete without being real. | Translate journeys into state/interaction acceptance. | CODEX_LATER_CANDIDATE |
| GAP-012 | Ops Gap | Data quality/review monitoring sequencing unclear. | MJ-008, MJ-012 | Medium | Could distract from first proof. | Keep support/P1 unless selected as release-blocking acceptance. | MVP_SUPPORT_CONDITIONAL/P1 |

## 14. Later Codex Work Package Candidate Map

This is not a Codex task list. It is a future grouping map only. No package is executable from this artefact.
| Candidate Package | Source Requirements | Allowed Later? | Preconditions | Must Not Include | Acceptance Proof Needed |
| --- | --- | --- | --- | --- | --- |
| WP-CAND-01 | FND-001, FND-002, MJ-001, MJ-010, MJ-006 | Yes, later only | Requirements matrix accepted and final handoff authorizes implementation. | Anonymous demo mode; production identity provider; unrelated auth rewrite. | Mapped current-user/tenant/role/object scope positive and negative tests. |
| WP-CAND-02 | FND-003, FND-004, MJ-006, MJ-010 | Yes, later only | Role/action/object/payload matrix accepted. | Admin bypass; route access as payload visibility. | RBAC positive plus cross-tenant/admin-bypass negatives. |
| WP-CAND-03 | FND-005, MJ-002 | Yes, later only | Evidence sufficiency lifecycle accepted. | Upload-to-release shortcut; real object storage overbuild. | Upload-only, review, sufficiency, blocked negatives. |
| WP-CAND-04 | FND-006, FND-007, FND-008, MJ-003 | Yes, later only | Draft/source/redaction semantics accepted. | Production AI integration; client-visible draft. | AI internal-only and advisor-not-release negatives. |
| WP-CAND-05 | FND-009, FND-010, MJ-001, MJ-002 | Yes, later only | Compliance release preconditions and client projection accepted. | Manual visibility override; compliance release as client acceptance. | Compliance release happy path and fail-closed client payload tests. |
| WP-CAND-06 | FND-011, MJ-006, MJ-010, MJ-002, MJ-005 | Yes, later only | Critical action audit matrix accepted. | Audit display-as-persistence; silent completion on audit failure. | Audit persisted for gate actions and failure blocks action. |
| WP-CAND-07 | FND-012, MJ-005 | Yes, late first path only | Release/evidence/client visibility semantics stable. | Forbidden internal payload; real binary storage first. | Redacted scoped export package and forbidden payload negatives. |
| WP-CAND-08 | FND-013, all MVP journeys | Yes, later only | All above requirements accepted. | Claim current tests prove all P0 gates. | P0 positive and negative test suite completion. |

## 15. QA Matrix
| QA Check | Pass / Fail | Evidence / Reason |
| --- | --- | --- |
| Selected MVP journeys preserved | PASS | MVP portfolio contains MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010. |
| Support/P1/hold journeys separated | PASS | MJ-012 and conditional MJ-011 kept as support; MJ-008/MJ-009 P1; MJ-004/MJ-007 hold/P2. |
| Auth correction preserved | PASS | Providerless Auth Stub is not anonymous demo; mapped user/tenant/role/object scope is foundation requirement. |
| `full-workflow` target preserved | PASS | Source lock and all matrices use full-workflow target baseline. |
| `main` blocked | PASS | main is false-gap only and no target requirements derive from main. |
| No implementation created | PASS | This file is documentation only. |
| No Codex tasks created | PASS | Work packages are candidate groupings only, not executable tickets. |
| No final Codex handoff created | PASS | Codex status remains CODEX_HANDOFF_NOT_READY. |
| No screen/image generation authorized | PASS | All visual references are treated as references only; no generation allowed. |
| Route/API/schema/test presence not overclaimed | PASS | All presence proof is classified as baseline or proof slice, not readiness. |
| Positive and negative acceptance criteria present | PASS | Each foundation and journey requirement includes acceptance and negative acceptance. |
| Providerless auth does not become anonymous demo mode | PASS | FND-001 and build step 1 require mapped actor context. |
| Upload success not treated as evidence sufficiency | PASS | FND-005, MJ-002 and P0 tests preserve upload-only semantics. |
| Advisor approval not treated as compliance release | PASS | FND-008 and MJ-003/MJ-001 requirements preserve separation. |
| Compliance release not treated as client acceptance | PASS | FND-009/FND-010 require client-safe projection only; release success is not acceptance. |
| AI Draft internal-only rule preserved | PASS | FND-006 and MJ-003 require no client/API/export leakage. |
| Admin non-bypass preserved | PASS | FND-004 and MJ-010 require bypass-denial tests. |
| P1/hold routes not pulled into MVP | PASS | MJ-008/MJ-009/MJ-011 P1/conditional; MJ-004/MJ-007 hold/P2. |

## 16. ENGINE Execution Proof
| Phase | Engine Combination | Applied Result |
| --- | --- | --- |
| Charter | ENGINE_v3 | Target artefact, purpose and stop rules locked as journey-first requirements matrix only. |
| Source Intake | ENGINE_v3 Rebase | Journey lock, full-workflow repo/branch, local snapshot and prior artefacts used in hierarchy; main blocked. |
| Evidence Mapping | ENGINE_v3 | Selected journeys, routes, APIs, schema, tests and gaps mapped without overclaiming readiness. |
| Requirement Synthesis | ENGINE_v2 | Journey priorities converted into product, functional, UI, API, schema, state, safety and acceptance requirements. |
| Contradiction Control | ENGINE_v3 | Providerless-vs-anonymous, upload-vs-sufficiency, advisor-vs-release, route-presence-vs-safety contradictions resolved. |
| Branch Build | ENGINE_v2 + ENGINE_v3 | Cross-journey foundation, per-journey, support, P1, hold, route/API/schema/test and safety branches separated. |
| Handoff Discipline | ENGINE_v2-B | Later Codex candidate packages grouped without creating executable Codex tasks. |
| Proof Architecture | ENGINE_v3 | Positive and negative acceptance criteria plus P0 proof obligations defined. |
| Compression / Operational Layer | ENGINE_v2 Compression | Output structured as directly reusable matrices rather than narrative-only analysis. |
| QA | ENGINE_v3 | Stop rules, no-overclaim checks, source hierarchy and MVP/P1/hold separation completed. |

---

## Stop Rules Confirmed

- No implementation.
- No code changes.
- No Codex tickets.
- No final Codex handoff.
- No screen generation, state-screen generation or image generation.
- No Prisma schema replacement and no migrations.
- No new API route creation from this artefact.
- No use of `main` as target truth.
- No client-visible AI Draft.
- No admin bypass.
- No upload-to-release shortcut.
- No `MJ-004` or `MJ-007` MVP pull-forward.
