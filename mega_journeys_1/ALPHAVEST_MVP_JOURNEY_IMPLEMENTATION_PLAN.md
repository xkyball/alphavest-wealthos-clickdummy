# ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md

**Generated:** 2026-06-20
**Mode:** Journey-first phased implementation planning. No implementation, no code change, no tests executed, no Codex execution, no screen/state/image generation.
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`
**Target branch:** `full-workflow`
**Output of prompt:** `ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN_PROMPT_ENGINE_PROOF.md`

## 1. Executive Implementation Decision

**Artefact status:** `IMPLEMENTATION_PLAN_ACCEPTED_FOR_PHASED_DELIVERY_PREP`

**Codex execution status:** `CODEX_EXECUTION_REQUIRES_EXPLICIT_HANDOFF_OR_USER_CONFIRMATION`

**Implementation status:** `NO_IMPLEMENTATION_PERFORMED`

This artefact translates the locked AlphaVest MVP mega-journey portfolio into a concrete phased implementation plan with detailed task IDs, route/API/schema/test impact, acceptance criteria, negative proof obligations, blockers and Stop Rules. It is deliberately implementation-adjacent but not implementation itself.

What is now planable:

- a phased path from source verification through mapped user/tenant/role foundation, governance, evidence sufficiency, internal draft review, advisor/compliance gates, fail-closed visibility, audit, export/redaction, support hardening, P0 acceptance and handoff packaging;
- detailed later-Codex task candidates with stable IDs;
- positive and negative acceptance criteria per phase/task;
- P0 gate proof obligations and no-overclaim controls.

What is not implemented or authorized here: code changes, tests, migrations, new API routes, screen/state/image generation, schema replacement, Codex execution, P1/hold route elevation or direct final production handoff.

P0 gates that must close before MVP acceptance: providerless auth not anonymous, tenant/object isolation, RBAC route/action/payload separation, AI Draft internal-only, no unapproved advice, advisor approval not release, compliance release gate, upload not sufficiency, evidence sufficiency lifecycle, fail-closed client visibility, admin non-bypass, audit persistence/fail-closed, export redaction, review monitoring not automatic advice and hold routes not elevated silently.

Recommended phases:

| Phase | Name | Primary Output | Exit Gate |
| --- | --- | --- | --- |
| 0 | Repo / Source Reality Verification | Verify repository/source baseline and prevent main-contamination before planning turns into implementation. | Source hierarchy locked; full-workflow only; no route/API/schema/test presence overclaimed. |
| 1 | Providerless Real User / Tenant / Role Foundation | Keep providerless auth stub but require deterministic mapped actor, tenant, role, object and payload context. | Unknown/wrong-tenant actor fails closed; route access is separated from action/payload visibility. |
| 2 | Governance / Admin Non-Bypass Foundation | Allow admin/governance setup while blocking release/evidence/export/visibility bypass. | Admin release/export/evidence/visibility bypass denied and audited. |
| 3 | Evidence Intake / Review / Sufficiency | Make upload, document review, evidence linkage and sufficiency distinct lifecycle states. | Upload alone does not release; reviewed, linked, relevant, scoped evidence can support release only after acceptance. |
| 4 | Internal Draft / Analyst Review / AI Internal-Only | Represent AI/rules draft as internal preparation only and enforce analyst unsupported-claim rejection/rebuild with evidence. | No AI draft/internal rationale appears in client/API/export payloads. |
| 5 | Advisor Approval → Compliance Gate | Keep advisor approval, compliance block/request-evidence and compliance release as separate gates. | Advisor approval moves to compliance-pending, not client-visible; release requires compliance + preconditions. |
| 6 | Client Visibility Fail-Closed Projection | Derive client-safe projections from release/redaction rules and fail closed for unknown/unreleased/internal data. | Client sees only released/redacted content; no internal leakage through route/API/export. |
| 7 | Decision Record + Audit Persistence | Make critical gate actions traceable and fail closed when audit persistence is required but unavailable. | Audit failure blocks/holds safety actions; visual audit display is not mistaken for persistence. |
| 8 | Export / Redaction / Client-Safe Package | Produce scoped/redacted/approved client-safe export package or metadata manifest without forbidden internal payload. | Preview, approval, generation/download/share remain separate; forbidden payload absent. |
| 9 | Support Hardening | Strengthen data-quality and guest/object-scope only where they support the core proof without destabilizing MVP scope. | Core scope remains stable; support items are conditional or deferred; review monitoring not automatic advice. |
| 10 | P0 Positive / Negative Acceptance Suite | Close P0 acceptance gaps through positive and negative tests before MVP acceptance. | All P0 gates have mapped positive/negative proof or explicit blocker. |
| 11 | Delivery Readiness / Handoff Packaging | Package phase plan, tasks, dependencies, acceptance and proof so Codex can later execute without making decisions. | Final handoff package can be prepared with no open product/scope/safety/schema/test decisions delegated to Codex. |

## 2. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` | Binding journey-priority lock | Use selected MVP/support/P1/hold journeys, first product build path, providerless-auth correction and decisive product proof. | Do not override the locked journey portfolio or pull held journeys into MVP. |
| 2 | `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Binding requirements matrix | Use FND-001..FND-013, journey requirements, route/API/schema/test mapping and support/P1/hold exclusions. | Do not convert requirements directly into implementation without handoff and P0 proof. |
| 3 | Live GitHub repo `xkyball/alphavest-wealthos-clickdummy`, branch `full-workflow` | Live branch reality check | Use to verify branch visibility and top-level repository structure. | Do not assume live branch is fully inspected at deep code level from the web view alone. |
| 4 | `alphavest-wealthos-clickdummy-full-workflow.zip` / project snapshot | Deep target code snapshot | Use for route/API/schema/test/component/assets reality when live traversal is limited. | Do not assume snapshot presence equals MVP readiness. |
| 5 | Roadmap/safety/scope artefacts v0.2-v0.8 and artefacts 1-15 where relevant | Control and no-overclaim layer | Use route scope, visual/status constraints, safety contracts, API/schema/P0 gates and stop rules. | Do not contradict the two journey sources or use stale docs as code truth. |
| 6 | `alphavest_mvp_artifact_completion_patch.zip` | MVP Control Spec only | Use for advice boundary, RBAC, visibility, evidence, audit, workflow and acceptance concepts. | Do not blindly replace the full-workflow schema/code. |
| 7 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | False-gap / legacy warning only | Use only to prevent old absence claims re-entering the plan. | Never use as target truth, route truth, schema truth or task source. |

**Live branch verification note:** the GitHub branch page for `full-workflow` was reachable and showed the public repository plus the target folders/files (`app`, `components`, `docs/v3`, `lib`, `prisma`, `public/reference/page_ui_v3`, `scripts`, `tests`, config files and README). Deep implementation facts remain grounded in the local full-workflow snapshot and the existing AlphaVest artefact chain. Before final code execution, refresh the live branch and compare against this plan.

## 3. Implementation Planning Method

| Method Layer | Application in this plan |
| --- | --- |
| ENGINE_v3 Source Intake and Evidence Discipline | Locked the two journey artefacts first, verified live branch visibility, used full-workflow snapshot/artefacts for deep route/API/schema/test reality, blocked `main` as target truth. |
| ENGINE_v2 Journey-to-Phase Synthesis | Converted the MVP journey portfolio into a phased product build path: identity/scope → governance → evidence → internal draft → gates → visibility → audit → export → P0 proof. |
| ENGINE_v2-B Implementation Handoff Discipline | Created stable task IDs, work packages, dependencies, likely target areas, acceptance criteria, negative tests, stop rules and Codex-later statuses. |
| ENGINE_v3 Adversarial QA / No-Overclaim | Separated presence from readiness: route/API/schema/test/PNG existence is not behaviour, safety or P0 proof. |
| ENGINE_v2 Compression | Kept phases and tasks operationally usable without delegating product/safety/schema/test decisions to Codex. |

## 4. Phase Overview

| Phase | Name | Main Journey Coverage | Main Foundation Coverage | Goal | Exit Gate |
| --- | --- | --- | --- | --- | --- |
| 0 | Repo / Source Reality Verification | all MVP portfolio | FND-013 | Verify repository/source baseline and prevent main-contamination before planning turns into implementation. | Source hierarchy locked; full-workflow only; no route/API/schema/test presence overclaimed. |
| 1 | Providerless Real User / Tenant / Role Foundation | MJ-001, MJ-006, MJ-010; conditional MJ-011 | FND-001, FND-002, FND-003 | Keep providerless auth stub but require deterministic mapped actor, tenant, role, object and payload context. | Unknown/wrong-tenant actor fails closed; route access is separated from action/payload visibility. |
| 2 | Governance / Admin Non-Bypass Foundation | MJ-010, MJ-006, MJ-001 | FND-003, FND-004 | Allow admin/governance setup while blocking release/evidence/export/visibility bypass. | Admin release/export/evidence/visibility bypass denied and audited. |
| 3 | Evidence Intake / Review / Sufficiency | MJ-002; supports MJ-001 and MJ-005 | FND-005 | Make upload, document review, evidence linkage and sufficiency distinct lifecycle states. | Upload alone does not release; reviewed, linked, relevant, scoped evidence can support release only after acceptance. |
| 4 | Internal Draft / Analyst Review / AI Internal-Only | MJ-003; supports MJ-001 | FND-006, FND-007 | Represent AI/rules draft as internal preparation only and enforce analyst unsupported-claim rejection/rebuild with evidence. | No AI draft/internal rationale appears in client/API/export payloads. |
| 5 | Advisor Approval → Compliance Gate | MJ-001, MJ-002, MJ-003 | FND-008, FND-009 | Keep advisor approval, compliance block/request-evidence and compliance release as separate gates. | Advisor approval moves to compliance-pending, not client-visible; release requires compliance + preconditions. |
| 6 | Client Visibility Fail-Closed Projection | MJ-001, MJ-002, MJ-006 | FND-010 | Derive client-safe projections from release/redaction rules and fail closed for unknown/unreleased/internal data. | Client sees only released/redacted content; no internal leakage through route/API/export. |
| 7 | Decision Record + Audit Persistence | MJ-001, MJ-006, MJ-010, MJ-002, MJ-005 | FND-011 | Make critical gate actions traceable and fail closed when audit persistence is required but unavailable. | Audit failure blocks/holds safety actions; visual audit display is not mistaken for persistence. |
| 8 | Export / Redaction / Client-Safe Package | MJ-005 | FND-012 | Produce scoped/redacted/approved client-safe export package or metadata manifest without forbidden internal payload. | Preview, approval, generation/download/share remain separate; forbidden payload absent. |
| 9 | Support Hardening | MJ-012; conditional MJ-011; P1 guard MJ-008/MJ-009 | FND-002, FND-003, FND-013 | Strengthen data-quality and guest/object-scope only where they support the core proof without destabilizing MVP scope. | Core scope remains stable; support items are conditional or deferred; review monitoring not automatic advice. |
| 10 | P0 Positive / Negative Acceptance Suite | all MVP portfolio | FND-013 | Close P0 acceptance gaps through positive and negative tests before MVP acceptance. | All P0 gates have mapped positive/negative proof or explicit blocker. |
| 11 | Delivery Readiness / Handoff Packaging | all | all | Package phase plan, tasks, dependencies, acceptance and proof so Codex can later execute without making decisions. | Final handoff package can be prepared with no open product/scope/safety/schema/test decisions delegated to Codex. |

## 5. Journey-to-Phase Matrix

| Journey | Phase(s) | Why Here | Required Output | Acceptance Signal | Negative Proof |
| --- | --- | --- | --- | --- | --- |
| MJ-001 | 0-7, 10-11 | Umbrella proof spine: mapped user/tenant/role, evidence, internal draft, human review, advisor approval, compliance release, audit and client-safe view. | One deterministic tenant/user path reaches a released client-safe decision without autonomous advice. | Client-facing portal/mobile shows only released/redacted content after all gates pass. | Unknown user, wrong tenant, advisor-only approval, admin bypass and unreleased/internal payload all fail closed. |
| MJ-002 | 3, 5-7, 10 | Best client-value slice and strongest existing interaction leverage through document upload. | Evidence request, upload, review, link, sufficiency and compliance release sequence. | Reviewed/linked/relevant/scoped evidence can support release. | Upload success alone, unreviewed evidence, wrong-scope evidence and audit failure do not release. |
| MJ-003 | 4-6, 10 | Differentiating AI/rules governance proof while preserving human review. | Internal-only draft can be rejected/rebuilt with evidence and routed to advisor review. | Unsupported internal draft is rebuilt and remains internal until approved/released summary exists. | AI draft/internal rationale never appears in client/API/export payloads. |
| MJ-005 | 8, 10 | Trust output after release and visibility semantics are stable. | Scoped/redacted/approved export package or metadata manifest. | Approved export contains client-safe, released, scoped, redacted content. | No AI draft, internal rationale, compliance notes, unreleased evidence, no-approval download or missing redaction. |
| MJ-006 | 1-2, 6-7, 10 | Family Office OS credibility depends on tenant/object isolation. | Denied scoped access, no payload leak and audit proof. | Scoped actor sees only own tenant/object payload. | Wrong tenant/object actor gets denial, no sensitive payload and audit event. |
| MJ-010 | 1-2, 7, 10 | Providerless-real-user semantics require admin/governance without safety bypass. | Admin role changes are scoped/audited and cannot force release, sufficiency, visibility or export. | Admin can manage governance within policy. | Admin cannot force compliance release, evidence sufficiency, client visibility, export approval or audit suppression. |
| MJ-012 | 9, 10 conditional | Useful support if high-severity data-quality blocks are explicit release blockers. | Optional release-blocking data-quality acceptance layer. | Resolved data-quality issue can unblock readiness/release when in scope. | High-severity open issue cannot release/export if activated as blocker. |
| MJ-011 | 9 conditional / P1 | Guest scope is valuable but adds leakage risk; only after core user/object scope is stable. | Guest/object-scope requirements remain conditional. | Guest sees only invited document/object if unlocked. | Guest cannot see tenant-wide, internal or advisory payloads. |
| MJ-008 | 9 deferred / P1 | Valuable review rhythm, but not first client-safe decision proof. | P1 guard: monitoring remains internal and no-auto-advice. | Due/overdue monitoring can create internal review when later unlocked. | No automatic rebalance/advice execution or client-visible advice. |
| MJ-009 | P1 deferred | Communication/mobile layer follows core release/visibility safety. | P1 guard only. | Client request may become internal workflow only after visibility rules are stable. | No first-path client communication/advice workflow leakage. |
| MJ-004 | blocked | Committee routes 070-071 and governance depth are unresolved. | No MVP implementation task. | Unlock only through dedicated committee scope/safety/visual artefact. | No silent MVP elevation of routes 070-071. |
| MJ-007 | blocked | KYC/SoW/Suitability/IPS routes 064-067 are held and advice-risk depth is high. | No MVP implementation task. | Unlock only through dedicated KYC/suitability policy lock. | No regulated suitability/advice logic in first-path MVP. |

## 6. Foundation-to-Phase Matrix

| Foundation ID | Requirement Name | Phase | Task Group | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| FND-001 | Providerless Auth Stub with real mapped current user | 1 | WP-01 | Mapped user resolves deterministic tenant, role and object scope. | Unknown/unmapped actor denied; wrong tenant hidden; no payload leak. | P0-POS-001, P0-NEG-010; route/API negatives |
| FND-002 | Tenant membership and object scope | 1 | WP-01 | Scoped actor sees own object only. | Wrong tenant/object gets denial + audit + no payload. | permission-engine slice; add route/API negatives |
| FND-003 | Role / permission / action / payload visibility separation | 1 | WP-01/WP-02 | Permitted role performs scoped action only. | Route access without action/payload returns hidden/redacted/denied. | P0_RBAC_ACTION_GATE; P0_PAYLOAD_VISIBILITY_GATE |
| FND-004 | Admin non-bypass | 2 | WP-02 | Admin role change succeeds within governance policy. | Admin cannot force release/evidence/export/visibility. | P0-NEG-003 + admin bypass negatives |
| FND-005 | Evidence intake, review, link, relevance, scope and sufficiency | 3 | WP-03 | Reviewed linked relevant evidence can unlock scoped gate. | Upload success alone cannot unlock anything. | P0-POS-003, P0-NEG-004, P0-NEG-005 |
| FND-006 | AI/rules draft internal-only handling | 4 | WP-04 | Draft rejected/rebuilt with evidence and remains internal. | Client/API/export never contains AI Draft/internal rationale. | P0-NEG-001 |
| FND-007 | Analyst review and unsupported-claim rejection | 4 | WP-04 | Unsupported claim rejected and evidence-linked rebuild created. | Unsupported claim cannot proceed to advisor/client release. | workflow-gate partial; add draft negatives |
| FND-008 | Advisor approval separate from compliance release | 5 | WP-04/WP-05 | Advisor approval moves item to compliance pending. | Advisor-approved does not set clientVisible/releasedToClientAt. | P0-POS-004, P0-NEG-002 |
| FND-009 | Compliance block / request evidence / release | 5 | WP-05 | Compliant item releases client-safe projection. | Missing evidence/advisor approval blocks release. | P0-POS-005, P0_COMPLIANCE_RELEASE_GATE |
| FND-010 | Fail-closed client visibility | 6 | WP-05 | Client sees released safe summary only. | Client does not see drafts/internal notes/compliance notes/unreleased evidence. | P0-POS-006, P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE |
| FND-011 | Decision record and audit persistence | 7 | WP-06 | Critical actions write audit rows. | Audit failure does not silently complete action. | P0-POS-007, P0-NEG-009 |
| FND-012 | Export scope, redaction, approval, download/share separation | 8 | WP-07 | Approved export contains scoped redacted content only. | Preview ≠ approval; approval ≠ download/share; forbidden payload absent. | P0-POS-008, P0-NEG-006, P0-NEG-007 |
| FND-013 | P0 positive and negative proof | 0 | WP-08 | P0 positives pass. | P0 negatives fail safely with audit/no leak. | P0-POS-001..009; P0-NEG-001..012 |

## 7. Detailed Phase Plan

### Phase 0 — Repo / Source Reality Verification

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Verify repository/source baseline and prevent main-contamination before planning turns into implementation. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | all MVP portfolio |
| Foundation Coverage | FND-013 |
| Routes affected | all 71 route IDs for inventory only |
| APIs affected | all 4 existing APIs for inventory only |
| Schema/models affected | all 42 models inventory only |
| Services/components likely affected | route registry, app shell, docs/v3, tests inventory |
| Existing test slices | route-smoke.spec.ts; all tests inventoried only |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Source hierarchy locked; full-workflow only; no route/API/schema/test presence overclaimed. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P0-T001 | Verify live `full-workflow` branch visibility and top-level folders against local snapshot. | all 71 inventory | all 4 inventory | route-registry, repo root | Branch/snapshot baseline recorded. | No `main` fact accepted as target truth. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T002 | Freeze source hierarchy and conflict policy for implementation planning. | all | all | all SOT artefacts | Every source has allowed/forbidden use. | Stale docs and README status cannot override journey locks. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T003 | Create route/API/schema/test impact baseline from existing artefacts. | all route groups | all 4 APIs | 42 models / 10 specs baseline | Impact areas identified without overclaim. | Presence is not readiness proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T004 | Define P0 gate register and no-overclaim vocabulary for all later phases. | MVP routes and support routes | all APIs | safety-critical models | Each gate has positive/negative proof need. | No unresolved gate becomes implicit acceptance. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 1 — Providerless Real User / Tenant / Role Foundation

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Keep providerless auth stub but require deterministic mapped actor, tenant, role, object and payload context. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-001, MJ-006, MJ-010; conditional MJ-011 |
| Foundation Coverage | FND-001, FND-002, FND-003 |
| Routes affected | 001-006, 013-018, 019-020, 027-030, 048-051 |
| APIs affected | /api/demo-workflow; /api/documents; /api/documents/upload; candidate current-user/access API only if authorized |
| Schema/models affected | User, UserProfile, ClientTenant, Role, Permission, UserRole, RolePermission |
| Services/components likely affected | demo-session-provider, permission-engine, visibility-engine, route guards/session context |
| Existing test slices | permission-engine.spec.ts, route-smoke.spec.ts plus new current-user negatives |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Unknown/wrong-tenant actor fails closed; route access is separated from action/payload visibility. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P1-T001 | Define providerless current-user resolution semantics while keeping provider stub allowed. | 001-006,013-018 | candidate current-user; /api/demo-workflow | User, UserProfile, ClientTenant, UserRole | Mapped user resolves tenant/roles/object scope. | Unknown actor denied; no anonymous payload expansion. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T002 | Propagate tenant membership into route shell and action context. | 001,018,027-030,048-051 | /api/documents,/api/documents/upload,/api/demo-workflow | ClientTenant, UserRole, Document, Decision | Scoped actor sees own tenant data. | Wrong tenant hidden/denied and audited. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T003 | Separate route access from action permission and payload visibility. | 008-010,019-020,048-051,054-058 | /api/demo-workflow,/api/documents | Role, Permission, RolePermission, UserRole, PolicyDefinition | Allowed route/action/payload checks are independently evaluated. | Route shell visibility does not expose fields or actions. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T004 | Define object-scope lookup for documents, evidence, decisions and exports. | 027-030,043-047,054-058 | /api/documents,/api/documents/upload | Document, EvidenceRecord, Decision, ExportRequest | Object lookup requires actor tenant/object scope. | Wrong object no payload and audit/denial where safety relevant. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T005 | Add current-user and wrong-tenant acceptance tests to later P0 suite. | 001-006,019-020,027-030 | /api/documents,/api/demo-workflow | UserRole, Permission, AuditEvent | Positive mapped user path documented. | Unknown/wrong tenant denied with no leak. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 2 — Governance / Admin Non-Bypass Foundation

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Allow admin/governance setup while blocking release/evidence/export/visibility bypass. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-010, MJ-006, MJ-001 |
| Foundation Coverage | FND-003, FND-004 |
| Routes affected | 007-010, 017-018, 040, 048-051, 057 |
| APIs affected | /api/demo-workflow; future governance APIs only if final handoff authorizes |
| Schema/models affected | Role, Permission, RolePermission, UserRole, AccessRequest, SecondConfirmation, AuditEvent, PolicyDefinition |
| Services/components likely affected | permission-engine, audit-service, demo-workflow-mutation |
| Existing test slices | permission-engine.spec.ts, demo-workflow-api.spec.ts; add admin-bypass negatives |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Admin release/export/evidence/visibility bypass denied and audited. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P2-T001 | Lock governance role model and sensitive action classification. | 007-010,048-051 | /api/demo-workflow | Role, Permission, RolePermission, PolicyDefinition | Governance roles can manage allowed setup actions. | Governance role cannot infer advice/release/export authority. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T002 | Specify admin non-bypass checks for release, evidence sufficiency, visibility and export. | 009,010,040,057 | /api/demo-workflow | UserRole, AccessRequest, AuditEvent, ExportRequest | Admin action denied outside governance scope. | Admin cannot force release/evidence/export/visibility. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T003 | Define second-confirmation and audit expectations for sensitive governance mutations. | 007,009,010,048-051 | /api/demo-workflow | SecondConfirmation, AccessRequest, AuditEvent | Sensitive mutation requires confirmation/audit when configured. | Missing confirmation or audit blocks action. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T004 | Protect compliance release route against admin role escalation. | 040,048-051 | /api/demo-workflow | ComplianceReview, Approval, UserRole, AuditEvent | Compliance release requires compliance actor and gate preconditions. | Admin or broad role cannot bypass gate. | P1_DEFERRED |
| AV-MVP-P2-T005 | Map admin non-bypass tests into P0 acceptance suite. | 009-010,040,057 | /api/demo-workflow | Role, Permission, AuditEvent | Positive governance mutation remains possible. | Bypass attempts denied and audited. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 3 — Evidence Intake / Review / Sufficiency

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Make upload, document review, evidence linkage and sufficiency distinct lifecycle states. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-002; supports MJ-001 and MJ-005 |
| Foundation Coverage | FND-005 |
| Routes affected | 027-030, 038-041, 046-047, 019 |
| APIs affected | /api/documents/upload, /api/documents, /api/demo-workflow |
| Schema/models affected | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent |
| Services/components likely affected | document-upload-service, document-storage-adapter, evidence-service, audit-service |
| Existing test slices | document-upload-api.spec.ts, document-upload-flow.spec.ts, workflow-gate.spec.ts |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Upload alone does not release; reviewed, linked, relevant, scoped evidence can support release only after acceptance. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P3-T001 | Specify evidence request/block state before upload. | 038-041,027-030 | /api/demo-workflow,/api/documents | ComplianceReview, EvidenceRecord, Document | Compliance can request evidence and keep release blocked. | Missing evidence cannot release/export/client-visible. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T002 | Harden document upload contract as upload-only success. | 028 | /api/documents/upload | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent | Valid upload creates candidate document/evidence rows. | Invalid file/denied role/wrong tenant creates no sufficiency/release. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T003 | Define document review and extraction-review lifecycle. | 029-030 | /api/documents,/api/demo-workflow | DocumentReview, DocumentExtraction, DocumentLink | Reviewer can mark extraction/review state. | Unreviewed/low-confidence evidence cannot satisfy gate. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T004 | Define evidence linking, relevance and scope acceptance. | 046-047,038-041 | /api/demo-workflow | EvidenceRecord, EvidenceItem, DocumentLink, ComplianceReview | Linked relevant scoped evidence can support gate. | Wrong-scope/stale/unlinked evidence cannot release/export. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T005 | Specify evidence feedback and fail-closed states. | 027-030,038-041,019 | /api/documents,/api/demo-workflow | Document, EvidenceRecord | UI distinguishes upload-only success, needs evidence, review pending, sufficient. | No success text implies release or sufficiency from upload. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T006 | Map evidence tests and missing negatives. | 027-030,038-041 | /api/documents/upload,/api/documents | Document, EvidenceRecord, AuditEvent | Happy path covers upload → review → linked sufficiency. | Upload-only, wrong-scope and audit-failure negatives required. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 4 — Internal Draft / Analyst Review / AI Internal-Only

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Represent AI/rules draft as internal preparation only and enforce analyst unsupported-claim rejection/rebuild with evidence. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-003; supports MJ-001 |
| Foundation Coverage | FND-006, FND-007 |
| Routes affected | 033-037, 019-020, 054-058 |
| APIs affected | /api/demo-workflow; future internal draft API only if authorized |
| Schema/models affected | Trigger, Recommendation, RecommendationOption, DocumentExtraction, EvidenceRecord, AuditEvent |
| Services/components likely affected | workflow-gate, visibility-engine, demo-workflow-mutation, export-service |
| Existing test slices | workflow-gate.spec.ts, demo-workflow-api.spec.ts; add AI draft leakage negatives |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | No AI draft/internal rationale appears in client/API/export payloads. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P4-T001 | Define internal draft classification and data projection boundaries. | 033-037,019-020,054-058 | /api/demo-workflow | Trigger, Recommendation, RecommendationOption | Draft fields are internal-only and source/evidence-linked. | Client/API/export payload never includes draft/internal rationale. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T002 | Specify analyst unsupported-claim rejection lifecycle. | 033-035 | /api/demo-workflow | Recommendation, DocumentExtraction, EvidenceRecord, AuditEvent | Analyst can reject unsupported claim and require evidence. | Unsupported claim cannot move to advisor/client release. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T003 | Specify rebuild-with-evidence transition. | 033-037,027-030 | /api/demo-workflow | Recommendation, EvidenceRecord, DocumentLink | Rebuilt draft references accepted evidence. | Rebuild without evidence remains blocked/internal. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T004 | Define draft redaction across client and export surfaces. | 019-020,054-058 | /api/documents,/api/demo-workflow | Recommendation, Decision, ExportRequest | Released summary may be client-safe only after gates. | Draft/internal rationale absent from client/export. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T005 | Map AI draft internal-only negative tests. | 033-037,019-020,054-058 | /api/demo-workflow | Recommendation, AuditEvent, ExportRequest | Draft review positive path exists. | Leakage to client/API/export fails. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 5 — Advisor Approval → Compliance Gate

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Keep advisor approval, compliance block/request-evidence and compliance release as separate gates. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-001, MJ-002, MJ-003 |
| Foundation Coverage | FND-008, FND-009 |
| Routes affected | 036-042, 043-045, 019-020 |
| APIs affected | /api/demo-workflow |
| Schema/models affected | Approval, Recommendation, ComplianceReview, Decision, EvidenceRecord, AuditEvent |
| Services/components likely affected | workflow-gate, audit-service, visibility-engine |
| Existing test slices | workflow-gate.spec.ts, demo-workflow-api.spec.ts; add advisor-not-release negatives |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Advisor approval moves to compliance-pending, not client-visible; release requires compliance + preconditions. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P5-T001 | Specify advisor approval action as human approval only. | 036-037 | /api/demo-workflow | Approval, Recommendation, AuditEvent | Advisor approval sets compliance-pending state. | Advisor approval does not release or set client visibility. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T002 | Specify compliance review precondition matrix. | 038-040 | /api/demo-workflow | ComplianceReview, Approval, EvidenceRecord | Compliance release checks advisor approval, evidence sufficiency, audit and payload readiness. | Release without preconditions denied. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T003 | Specify compliance block/request evidence lifecycle. | 038-041,027-030 | /api/demo-workflow,/api/documents | ComplianceReview, EvidenceRecord, Document | Compliance can block or request evidence with visible state. | Blocked/requires-evidence item cannot client-release. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T004 | Specify decision creation after compliance release. | 040,043-045,019-020 | /api/demo-workflow | Decision, ComplianceReview, AuditEvent | Released decision creates client-safe projection and audit event. | Decision without release remains internal/hidden. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T005 | Map advisor/compliance positive and negative tests. | 036-045 | /api/demo-workflow | Approval, ComplianceReview, Decision, AuditEvent | Advisor→compliance→release path has positive proof. | Advisor-not-release, missing-evidence, admin-bypass negatives required. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 6 — Client Visibility Fail-Closed Projection

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Derive client-safe projections from release/redaction rules and fail closed for unknown/unreleased/internal data. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-001, MJ-002, MJ-006 |
| Foundation Coverage | FND-010 |
| Routes affected | 019-020, 043-047, 054-058 |
| APIs affected | /api/documents, /api/demo-workflow; export package services |
| Schema/models affected | Decision, Recommendation, EvidenceRecord, ExportRequest, Document, PolicyDefinition |
| Services/components likely affected | visibility-engine, permission-engine, export-service, evidence-service |
| Existing test slices | permission-engine.spec.ts, file-export-realism.spec.ts; add client payload redaction tests |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Client sees only released/redacted content; no internal leakage through route/API/export. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P6-T001 | Define client visibility projection allowlist. | 019-020,043-047 | /api/documents,/api/demo-workflow | Decision, Recommendation, EvidenceRecord, PolicyDefinition | Client-visible payload is released/redacted allowlist only. | Unreleased/internal fields hidden/redacted/denied. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T002 | Apply fail-closed states to portal and mobile surfaces. | 019-020 | /api/documents | Decision, EvidenceRecord, Document | Client sees no-available-content/redacted/permission state when proof incomplete. | No fallback to internal data. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T003 | Harden document/evidence client payload boundaries. | 027-030,046-047,019-020 | /api/documents | Document, EvidenceRecord, EvidenceItem | Client sees only released safe summaries where allowed. | Raw evidence/internal review hidden unless released/redacted. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T004 | Align export input projection with client visibility. | 054-058 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord | Export can select only actor-allowed released/client-safe objects. | Internal/unreleased objects cannot enter scope. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T005 | Map client leakage and payload tests. | 019-020,043-047,054-058 | /api/documents,/api/demo-workflow | Decision, EvidenceRecord, ExportRequest | Client-safe positive projection passes. | Draft/internal/compliance/unreleased payload leakage fails. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 7 — Decision Record + Audit Persistence

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Make critical gate actions traceable and fail closed when audit persistence is required but unavailable. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-001, MJ-006, MJ-010, MJ-002, MJ-005 |
| Foundation Coverage | FND-011 |
| Routes affected | 042-045, 048-051, 027-030, 036-041, 054-058 |
| APIs affected | /api/demo-workflow, /api/documents/upload |
| Schema/models affected | Decision, AuditEvent, ComplianceReview, ExportRequest, EvidenceRecord, Document, UserRole |
| Services/components likely affected | audit-service, demo-workflow-mutation, document-upload-service, export-package-service |
| Existing test slices | document-upload-api.spec.ts, permission-engine.spec.ts; add audit failure fail-closed tests |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Audit failure blocks/holds safety actions; visual audit display is not mistaken for persistence. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P7-T001 | Define audit event minimum fields for gate actions. | 042-045,048-051,027-030,054-058 | /api/demo-workflow,/api/documents/upload | AuditEvent, Decision, ComplianceReview, ExportRequest | Audit events include actor, role, tenant, target, previous/next state, result, reason. | Missing required audit blocks safety action. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T002 | Implement audit write expectations per critical action family. | 027-030,036-042,048-051,054-058 | /api/demo-workflow,/api/documents/upload | AuditEvent, EvidenceRecord, ComplianceReview, ExportRequest | Upload/review/approve/block/release/deny/export actions audit. | Action cannot complete silently if audit required and unavailable. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T003 | Specify decision record lifecycle and timeline projection. | 043-045,042 | /api/demo-workflow | Decision, DecisionParticipant, AuditEvent, EvidenceRecord | Decision record shows approved/released/evidence/audit state. | Unreleased/internal rationale hidden from client. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T004 | Protect denied access and admin bypass audit proof. | 048-051,009-010,040,057 | /api/demo-workflow | AccessRequest, UserRole, AuditEvent | Denied/bypass attempts produce denied result and no mutation. | Denied action cannot mutate target or leak payload. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T005 | Map audit persistence and failure tests. | all critical routes | /api/demo-workflow,/api/documents/upload | AuditEvent | Critical action audit rows can be asserted. | Audit failure blocks/holds action. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 8 — Export / Redaction / Client-Safe Package

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Produce scoped/redacted/approved client-safe export package or metadata manifest without forbidden internal payload. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-005 |
| Foundation Coverage | FND-012 |
| Routes affected | 054-058 |
| APIs affected | /api/demo-workflow; future export API only if final handoff authorizes |
| Schema/models affected | ExportRequest, Decision, Document, EvidenceRecord, AuditEvent, PolicyDefinition |
| Services/components likely affected | export-service, export-package-service, file-metadata-service, visibility-engine |
| Existing test slices | file-export-realism.spec.ts, permission-engine.spec.ts; add forbidden payload route/API tests |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Preview, approval, generation/download/share remain separate; forbidden payload absent. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P8-T001 | Define export scope selection contract. | 054-055 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord, Document | Export scope is deliberate and permission/visibility constrained. | Wrong-scope/unreleased/internal object blocked. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T002 | Define redaction profile and forbidden payload filtering. | 056-057 | /api/demo-workflow | ExportRequest, PolicyDefinition, Decision | Redaction excludes AI draft, internal rationale, compliance notes and unreleased evidence. | Missing redaction blocks approval/download. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T003 | Separate preview, approval, generation/download/share. | 056-058 | /api/demo-workflow | ExportRequest, AuditEvent, Document | Preview does not approve; approval does not imply download/share. | No approval → no download/share; download/share not client acceptance. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T004 | Specify export audit and expiration expectations. | 054-058 | /api/demo-workflow | ExportRequest, AuditEvent, Document | Export scope/redaction/approval/download events audited. | Audit failure blocks client-safe package action. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T005 | Map export positive and forbidden-payload tests. | 054-058 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord, AuditEvent | Approved redacted metadata/package manifest positive path. | Forbidden internal payload, no approval, no redaction, audit failure negatives. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 9 — Support Hardening

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Strengthen data-quality and guest/object-scope only where they support the core proof without destabilizing MVP scope. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | MJ-012; conditional MJ-011; P1 guard MJ-008/MJ-009 |
| Foundation Coverage | FND-002, FND-003, FND-013 |
| Routes affected | 034, 038-040, 059-060, 003, 018, 027-028, 068-069 as P1/guard |
| APIs affected | /api/demo-workflow, /api/documents, /api/review-monitoring |
| Schema/models affected | DataQualityIssue, ComplianceReview, AuditEvent, User, UserRole, Document, AccessRequest, ReviewSchedule |
| Services/components likely affected | data-quality-service, review-monitoring-service, permission-engine |
| Existing test slices | data-quality-service.spec.ts, review-monitoring-service.spec.ts; conditional guest-scope tests |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Core scope remains stable; support items are conditional or deferred; review monitoring not automatic advice. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P9-T001 | Conditionally define data-quality issue as release blocker. | 034,038-040,059-060 | /api/demo-workflow | DataQualityIssue, ComplianceReview, AuditEvent | High severity issue can block readiness/release if activated. | Open high-severity issue cannot release/export when active. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P9-T002 | Keep review monitoring/rebalance as P1 internal-only guard. | 068-069 | /api/review-monitoring,/api/demo-workflow | ReviewSchedule, Trigger, Recommendation, AuditEvent | Monitoring snapshot may create internal review later. | No automatic advice, rebalance execution or client release. | P1_DEFERRED |
| AV-MVP-P9-T003 | Conditionally specify external advisor scoped document access. | 003,018,027,028 | /api/documents,/api/documents/upload | User, UserRole, Document, AccessRequest, AuditEvent | Guest sees only explicitly invited document/object if unlocked. | Guest cannot see tenant-wide/internal/advisory payload. | P1_DEFERRED |
| AV-MVP-P9-T004 | Preserve mobile communication as P1 after client-visibility proof. | 020,052-053 | /api/demo-workflow | Message, MessageThread, Recommendation | Future mobile request can create internal workflow after unlock. | No first-path mobile advisory workflow leakage. | P1_DEFERRED |

### Phase 10 — P0 Positive / Negative Acceptance Suite

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Close P0 acceptance gaps through positive and negative tests before MVP acceptance. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | all MVP portfolio |
| Foundation Coverage | FND-013 |
| Routes affected | all MVP and flow-relevant MVP_SUPPORT routes |
| APIs affected | all 4 existing APIs; candidate APIs only if authorized |
| Schema/models affected | all safety-critical models |
| Services/components likely affected | permission-engine, visibility-engine, workflow-gate, evidence, audit, export, upload services |
| Existing test slices | all 10 existing specs plus required additions/extensions |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | All P0 gates have mapped positive/negative proof or explicit blocker. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P10-T001 | Build P0 positive acceptance map for every MVP journey. | all MVP routes | all 4 APIs | all safety-critical models | Each selected journey has at least one positive done path. | No positive path counted without corresponding negative. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T002 | Build P0 negative acceptance map for leakage, bypass and fail-closed. | all MVP/support safety routes | all 4 APIs | RBAC/visibility/evidence/audit/export models | Negative cases cover wrong tenant, unknown user, admin bypass, upload-only, draft leakage, export leakage. | No gate accepted without negative proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T003 | Extend API contract test obligations. | API consumers | /api/demo-workflow,/api/documents,/api/documents/upload,/api/review-monitoring | request/response models | Requests validate actor/scope/preconditions. | API errors do not advance workflow or expose data. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T004 | Extend route/UI state test obligations. | 001-063 MVP/support routes | browser/UI flows | state models | Loading/error/empty/permission/blocked/success states observable where relevant. | Denied/hidden states never render sensitive payload. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T005 | Define proof report acceptance and regression guard. | all | all | all | Proof report maps every gate to test evidence or blocker. | No existing test slice overclaimed as full P0 proof. | READY_FOR_LATER_CODEX_HANDOFF |

### Phase 11 — Delivery Readiness / Handoff Packaging

| Required Element | Phase Detail |
| --- | --- |
| Purpose | Package phase plan, tasks, dependencies, acceptance and proof so Codex can later execute without making decisions. |
| Source Inputs | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`; `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`; full-workflow repo/snapshot; roadmap/safety artefacts where non-conflicting. |
| Journey Coverage | all |
| Foundation Coverage | all |
| Routes affected | all worksets as locked |
| APIs affected | all API impacts documented |
| Schema/models affected | full-workflow schema baseline preserved |
| Services/components likely affected | task master / implementation handoff inputs |
| Existing test slices | P0 acceptance and regression proof map complete |
| Positive acceptance criteria | Phase goal is met with the named happy path and no downstream gate overclaim. |
| Negative acceptance criteria | Bypass, leakage, wrong-scope, missing precondition and fail-closed cases are mapped before acceptance. |
| Proof required | Route/API/schema/test impact evidence plus positive/negative P0 proof mapping. |
| Exit gate | Final handoff package can be prepared with no open product/scope/safety/schema/test decisions delegated to Codex. |
| Stop rules | No code change, no test execution, no schema migration, no screen/state/image generation, no Codex execution, no `main` target truth. |
| Blockers / dependencies | Prior phase exit gate and unresolved P1/hold/safety blockers must remain explicit. |

**Detailed tasks:**

| Task ID | Task Description | Routes | APIs | Models / Services | Acceptance | Negative Acceptance | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P11-T001 | Freeze implementation plan and task matrix for later handoff. | all worksets | all impacts | all | Plan contains phases, tasks, dependencies, stop rules and acceptance. | No open decision delegated to Codex. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T002 | Prepare later Codex handoff package index. | all target route groups | all APIs | all models/services | Handoff can reference task IDs and acceptance requirements. | P1/hold/reference/do-not-create items remain excluded. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T003 | Validate dependencies and phase order. | all | all | all | Every later task has upstream prerequisites. | No export/client visibility before release/evidence/RBAC. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T004 | Run stop-rule checklist as planning QA. | all | all | all | No screen/image/schema/API/test/code mutation authorized. | Any task violating stop rules marked DO_NOT_CREATE/BLOCKED. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T005 | Define final acceptance verdict. | all | all | all | Plan accepted for phased delivery preparation. | Codex execution still requires explicit handoff or user confirmation. | READY_FOR_LATER_CODEX_HANDOFF |

## 8. Detailed Task Matrix

| Task ID | Phase | Journey | Foundation / Requirement | Scope | Task Description | Target Routes | Target APIs | Target Models / Services | Likely Files / Areas | Acceptance | Negative Acceptance | Test Obligation | Dependencies | Stop Rule | Codex Later Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AV-MVP-P0-T001 | 0 | all | FND-013 | PREP | Verify live `full-workflow` branch visibility and top-level folders against local snapshot. | all 71 inventory | all 4 inventory | route-registry, repo root | README, AGENTS, package, app, components, lib, prisma, tests | Branch/snapshot baseline recorded. | No `main` fact accepted as target truth. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No commands that mutate code; record proof only. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T002 | 0 | all | FND-013 | PREP | Freeze source hierarchy and conflict policy for implementation planning. | all | all | all SOT artefacts | planning docs | Every source has allowed/forbidden use. | Stale docs and README status cannot override journey locks. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not create Codex execution commands. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T003 | 0 | all | FND-013 | PREP | Create route/API/schema/test impact baseline from existing artefacts. | all route groups | all 4 APIs | 42 models / 10 specs baseline | route registry, API handlers, prisma, tests | Impact areas identified without overclaim. | Presence is not readiness proof. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No tests executed. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P0-T004 | 0 | all | FND-013 | PREP | Define P0 gate register and no-overclaim vocabulary for all later phases. | MVP routes and support routes | all APIs | safety-critical models | contracts and matrices | Each gate has positive/negative proof need. | No unresolved gate becomes implicit acceptance. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not mark P0 passed yet. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T001 | 1 | MJ-001/MJ-006/MJ-010 | FND-001 | MVP | Define providerless current-user resolution semantics while keeping provider stub allowed. | 001-006,013-018 | candidate current-user; /api/demo-workflow | User, UserProfile, ClientTenant, UserRole | auth/session context, demo-session-provider | Mapped user resolves tenant/roles/object scope. | Unknown actor denied; no anonymous payload expansion. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Candidate API only if final handoff authorizes. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T002 | 1 | MJ-001/MJ-006 | FND-002 | MVP | Propagate tenant membership into route shell and action context. | 001,018,027-030,048-051 | /api/documents,/api/documents/upload,/api/demo-workflow | ClientTenant, UserRole, Document, Decision | permission-engine, route registry | Scoped actor sees own tenant data. | Wrong tenant hidden/denied and audited. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not use local demo switcher as safety proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T003 | 1 | MJ-001/MJ-006/MJ-010 | FND-003 | MVP | Separate route access from action permission and payload visibility. | 008-010,019-020,048-051,054-058 | /api/demo-workflow,/api/documents | Role, Permission, RolePermission, UserRole, PolicyDefinition | permission-engine, visibility-engine | Allowed route/action/payload checks are independently evaluated. | Route shell visibility does not expose fields or actions. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No broad admin allow-all rule. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T004 | 1 | MJ-006/MJ-001 | FND-002 | MVP | Define object-scope lookup for documents, evidence, decisions and exports. | 027-030,043-047,054-058 | /api/documents,/api/documents/upload | Document, EvidenceRecord, Decision, ExportRequest | document-upload-service, evidence-service, export-service | Object lookup requires actor tenant/object scope. | Wrong object no payload and audit/denial where safety relevant. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not expose raw IDs as authorization. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P1-T005 | 1 | MJ-006/MJ-010 | FND-001/FND-002/FND-003 | MVP | Add current-user and wrong-tenant acceptance tests to later P0 suite. | 001-006,019-020,027-030 | /api/documents,/api/demo-workflow | UserRole, Permission, AuditEvent | tests: permission-engine, route/API additions | Positive mapped user path documented. | Unknown/wrong tenant denied with no leak. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test writing in this artefact. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T001 | 2 | MJ-010/MJ-006 | FND-003/FND-004 | MVP | Lock governance role model and sensitive action classification. | 007-010,048-051 | /api/demo-workflow | Role, Permission, RolePermission, PolicyDefinition | permission-engine, policy definitions | Governance roles can manage allowed setup actions. | Governance role cannot infer advice/release/export authority. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No schema replacement. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T002 | 2 | MJ-010 | FND-004 | MVP | Specify admin non-bypass checks for release, evidence sufficiency, visibility and export. | 009,010,040,057 | /api/demo-workflow | UserRole, AccessRequest, AuditEvent, ExportRequest | permission-engine, workflow-gate | Admin action denied outside governance scope. | Admin cannot force release/evidence/export/visibility. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No manual visibility override. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T003 | 2 | MJ-010 | FND-004 | MVP | Define second-confirmation and audit expectations for sensitive governance mutations. | 007,009,010,048-051 | /api/demo-workflow | SecondConfirmation, AccessRequest, AuditEvent | audit-service, demo-workflow-mutation | Sensitive mutation requires confirmation/audit when configured. | Missing confirmation or audit blocks action. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No visual modal treated as lifecycle proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P2-T004 | 2 | MJ-010/MJ-001 | FND-004/FND-009 | MVP | Protect compliance release route against admin role escalation. | 040,048-051 | /api/demo-workflow | ComplianceReview, Approval, UserRole, AuditEvent | workflow-gate, permission-engine | Compliance release requires compliance actor and gate preconditions. | Admin or broad role cannot bypass gate. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No P1/hold route elevation. | P1_DEFERRED |
| AV-MVP-P2-T005 | 2 | MJ-010/MJ-006 | FND-004/FND-013 | MVP | Map admin non-bypass tests into P0 acceptance suite. | 009-010,040,057 | /api/demo-workflow | Role, Permission, AuditEvent | permission-engine.spec.ts extensions | Positive governance mutation remains possible. | Bypass attempts denied and audited. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test run now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T001 | 3 | MJ-002 | FND-005 | MVP | Specify evidence request/block state before upload. | 038-041,027-030 | /api/demo-workflow,/api/documents | ComplianceReview, EvidenceRecord, Document | workflow-gate, evidence-service | Compliance can request evidence and keep release blocked. | Missing evidence cannot release/export/client-visible. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No upload-to-release shortcut. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T002 | 3 | MJ-002 | FND-005 | MVP | Harden document upload contract as upload-only success. | 028 | /api/documents/upload | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent | document-upload-service | Valid upload creates candidate document/evidence rows. | Invalid file/denied role/wrong tenant creates no sufficiency/release. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not treat upload test as sufficiency proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T003 | 3 | MJ-002 | FND-005 | MVP | Define document review and extraction-review lifecycle. | 029-030 | /api/documents,/api/demo-workflow | DocumentReview, DocumentExtraction, DocumentLink | document services, evidence-service | Reviewer can mark extraction/review state. | Unreviewed/low-confidence evidence cannot satisfy gate. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No automated verification overclaim. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T004 | 3 | MJ-002/MJ-005 | FND-005 | MVP | Define evidence linking, relevance and scope acceptance. | 046-047,038-041 | /api/demo-workflow | EvidenceRecord, EvidenceItem, DocumentLink, ComplianceReview | evidence-service, workflow-gate | Linked relevant scoped evidence can support gate. | Wrong-scope/stale/unlinked evidence cannot release/export. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Evidence sufficiency must be explicit. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T005 | 3 | MJ-002 | FND-005 | MVP | Specify evidence feedback and fail-closed states. | 027-030,038-041,019 | /api/documents,/api/demo-workflow | Document, EvidenceRecord | state panels, feedback contracts | UI distinguishes upload-only success, needs evidence, review pending, sufficient. | No success text implies release or sufficiency from upload. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No screen generation. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P3-T006 | 3 | MJ-002 | FND-005/FND-013 | MVP | Map evidence tests and missing negatives. | 027-030,038-041 | /api/documents/upload,/api/documents | Document, EvidenceRecord, AuditEvent | document-upload-api/flow specs | Happy path covers upload → review → linked sufficiency. | Upload-only, wrong-scope and audit-failure negatives required. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No tests executed now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T001 | 4 | MJ-003 | FND-006 | MVP | Define internal draft classification and data projection boundaries. | 033-037,019-020,054-058 | /api/demo-workflow | Trigger, Recommendation, RecommendationOption | workflow-gate, visibility-engine | Draft fields are internal-only and source/evidence-linked. | Client/API/export payload never includes draft/internal rationale. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No production AI integration. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T002 | 4 | MJ-003 | FND-007 | MVP | Specify analyst unsupported-claim rejection lifecycle. | 033-035 | /api/demo-workflow | Recommendation, DocumentExtraction, EvidenceRecord, AuditEvent | demo-workflow-mutation, workflow-gate | Analyst can reject unsupported claim and require evidence. | Unsupported claim cannot move to advisor/client release. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No status chip as gate proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T003 | 4 | MJ-003 | FND-006/FND-007 | MVP | Specify rebuild-with-evidence transition. | 033-037,027-030 | /api/demo-workflow | Recommendation, EvidenceRecord, DocumentLink | evidence-service, workflow-gate | Rebuilt draft references accepted evidence. | Rebuild without evidence remains blocked/internal. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No autonomous advice. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T004 | 4 | MJ-003/MJ-005 | FND-006/FND-010/FND-012 | MVP | Define draft redaction across client and export surfaces. | 019-020,054-058 | /api/documents,/api/demo-workflow | Recommendation, Decision, ExportRequest | visibility-engine, export-service | Released summary may be client-safe only after gates. | Draft/internal rationale absent from client/export. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No manual visibility override. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P4-T005 | 4 | MJ-003 | FND-006/FND-013 | MVP | Map AI draft internal-only negative tests. | 033-037,019-020,054-058 | /api/demo-workflow | Recommendation, AuditEvent, ExportRequest | workflow-gate and export tests | Draft review positive path exists. | Leakage to client/API/export fails. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test writing now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T001 | 5 | MJ-001/MJ-003 | FND-008 | MVP | Specify advisor approval action as human approval only. | 036-037 | /api/demo-workflow | Approval, Recommendation, AuditEvent | workflow-gate, audit-service | Advisor approval sets compliance-pending state. | Advisor approval does not release or set client visibility. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No approval-as-release wording. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T002 | 5 | MJ-001/MJ-002 | FND-009 | MVP | Specify compliance review precondition matrix. | 038-040 | /api/demo-workflow | ComplianceReview, Approval, EvidenceRecord | workflow-gate | Compliance release checks advisor approval, evidence sufficiency, audit and payload readiness. | Release without preconditions denied. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No admin bypass. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T003 | 5 | MJ-002/MJ-001 | FND-009/FND-005 | MVP | Specify compliance block/request evidence lifecycle. | 038-041,027-030 | /api/demo-workflow,/api/documents | ComplianceReview, EvidenceRecord, Document | workflow-gate, evidence-service | Compliance can block or request evidence with visible state. | Blocked/requires-evidence item cannot client-release. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No silent state advancement. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T004 | 5 | MJ-001 | FND-009/FND-011 | MVP | Specify decision creation after compliance release. | 040,043-045,019-020 | /api/demo-workflow | Decision, ComplianceReview, AuditEvent | workflow-gate, visibility-engine | Released decision creates client-safe projection and audit event. | Decision without release remains internal/hidden. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No client acceptance overclaim. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P5-T005 | 5 | MJ-001/MJ-002/MJ-003 | FND-008/FND-009/FND-013 | MVP | Map advisor/compliance positive and negative tests. | 036-045 | /api/demo-workflow | Approval, ComplianceReview, Decision, AuditEvent | workflow-gate.spec.ts, demo-workflow-api.spec.ts | Advisor→compliance→release path has positive proof. | Advisor-not-release, missing-evidence, admin-bypass negatives required. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test execution now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T001 | 6 | MJ-001/MJ-002/MJ-006 | FND-010 | MVP | Define client visibility projection allowlist. | 019-020,043-047 | /api/documents,/api/demo-workflow | Decision, Recommendation, EvidenceRecord, PolicyDefinition | visibility-engine | Client-visible payload is released/redacted allowlist only. | Unreleased/internal fields hidden/redacted/denied. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No manual override. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T002 | 6 | MJ-001/MJ-006 | FND-010 | MVP | Apply fail-closed states to portal and mobile surfaces. | 019-020 | /api/documents | Decision, EvidenceRecord, Document | ClientIntakeScreen, state-panel | Client sees no-available-content/redacted/permission state when proof incomplete. | No fallback to internal data. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No screen generation. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T003 | 6 | MJ-002/MJ-006 | FND-010/FND-005 | MVP | Harden document/evidence client payload boundaries. | 027-030,046-047,019-020 | /api/documents | Document, EvidenceRecord, EvidenceItem | evidence-service, visibility-engine | Client sees only released safe summaries where allowed. | Raw evidence/internal review hidden unless released/redacted. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No upload-as-visibility. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T004 | 6 | MJ-005/MJ-006 | FND-010/FND-012 | MVP | Align export input projection with client visibility. | 054-058 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord | export-service, visibility-engine | Export can select only actor-allowed released/client-safe objects. | Internal/unreleased objects cannot enter scope. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No raw internal package. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P6-T005 | 6 | MJ-001/MJ-006/MJ-005 | FND-010/FND-013 | MVP | Map client leakage and payload tests. | 019-020,043-047,054-058 | /api/documents,/api/demo-workflow | Decision, EvidenceRecord, ExportRequest | permission-engine, file-export-realism, new API tests | Client-safe positive projection passes. | Draft/internal/compliance/unreleased payload leakage fails. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No P0 pass claim until tests exist. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T001 | 7 | MJ-001/MJ-006/MJ-010/MJ-002/MJ-005 | FND-011 | MVP | Define audit event minimum fields for gate actions. | 042-045,048-051,027-030,054-058 | /api/demo-workflow,/api/documents/upload | AuditEvent, Decision, ComplianceReview, ExportRequest | audit-service | Audit events include actor, role, tenant, target, previous/next state, result, reason. | Missing required audit blocks safety action. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No audit timeline as persistence proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T002 | 7 | MJ-001/MJ-002/MJ-010/MJ-005 | FND-011 | MVP | Implement audit write expectations per critical action family. | 027-030,036-042,048-051,054-058 | /api/demo-workflow,/api/documents/upload | AuditEvent, EvidenceRecord, ComplianceReview, ExportRequest | audit-service, demo-workflow-mutation | Upload/review/approve/block/release/deny/export actions audit. | Action cannot complete silently if audit required and unavailable. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No visual-only audit proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T003 | 7 | MJ-001 | FND-011 | MVP | Specify decision record lifecycle and timeline projection. | 043-045,042 | /api/demo-workflow | Decision, DecisionParticipant, AuditEvent, EvidenceRecord | DecisionsGovernanceScreen, audit-timeline | Decision record shows approved/released/evidence/audit state. | Unreleased/internal rationale hidden from client. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No state chip as gate proof. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T004 | 7 | MJ-006/MJ-010 | FND-011/FND-004 | MVP | Protect denied access and admin bypass audit proof. | 048-051,009-010,040,057 | /api/demo-workflow | AccessRequest, UserRole, AuditEvent | permission-engine, audit-service | Denied/bypass attempts produce denied result and no mutation. | Denied action cannot mutate target or leak payload. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No audit suppression. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P7-T005 | 7 | all MVP safety | FND-011/FND-013 | MVP | Map audit persistence and failure tests. | all critical routes | /api/demo-workflow,/api/documents/upload | AuditEvent | existing tests plus new fail-closed tests | Critical action audit rows can be asserted. | Audit failure blocks/holds action. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test run now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T001 | 8 | MJ-005 | FND-012 | MVP | Define export scope selection contract. | 054-055 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord, Document | export-service | Export scope is deliberate and permission/visibility constrained. | Wrong-scope/unreleased/internal object blocked. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No raw dump. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T002 | 8 | MJ-005/MJ-003 | FND-012/FND-006 | MVP | Define redaction profile and forbidden payload filtering. | 056-057 | /api/demo-workflow | ExportRequest, PolicyDefinition, Decision | export-service, visibility-engine | Redaction excludes AI draft, internal rationale, compliance notes and unreleased evidence. | Missing redaction blocks approval/download. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No client-visible AI draft. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T003 | 8 | MJ-005 | FND-012 | MVP | Separate preview, approval, generation/download/share. | 056-058 | /api/demo-workflow | ExportRequest, AuditEvent, Document | export-package-service | Preview does not approve; approval does not imply download/share. | No approval → no download/share; download/share not client acceptance. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No binary storage overbuild required. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T004 | 8 | MJ-005 | FND-012/FND-011 | MVP | Specify export audit and expiration expectations. | 054-058 | /api/demo-workflow | ExportRequest, AuditEvent, Document | audit-service, export-package-service | Export scope/redaction/approval/download events audited. | Audit failure blocks client-safe package action. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No audit display overclaim. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P8-T005 | 8 | MJ-005 | FND-012/FND-013 | MVP | Map export positive and forbidden-payload tests. | 054-058 | /api/demo-workflow | ExportRequest, Decision, EvidenceRecord, AuditEvent | file-export-realism.spec.ts, permission-engine.spec.ts | Approved redacted metadata/package manifest positive path. | Forbidden internal payload, no approval, no redaction, audit failure negatives. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No test execution now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P9-T001 | 9 | MJ-012 | FND-013 | MVP_SUPPORT_CONDITIONAL_OR_P1_GUARD | Conditionally define data-quality issue as release blocker. | 034,038-040,059-060 | /api/demo-workflow | DataQualityIssue, ComplianceReview, AuditEvent | data-quality-service | High severity issue can block readiness/release if activated. | Open high-severity issue cannot release/export when active. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Conditional support only; not primary narrative. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P9-T002 | 9 | MJ-008 | FND-013 | MVP_SUPPORT_CONDITIONAL_OR_P1_GUARD | Keep review monitoring/rebalance as P1 internal-only guard. | 068-069 | /api/review-monitoring,/api/demo-workflow | ReviewSchedule, Trigger, Recommendation, AuditEvent | review-monitoring-service | Monitoring snapshot may create internal review later. | No automatic advice, rebalance execution or client release. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | P1_DEFERRED. | P1_DEFERRED |
| AV-MVP-P9-T003 | 9 | MJ-011 | FND-001/FND-002/FND-003 | MVP_SUPPORT_CONDITIONAL_OR_P1_GUARD | Conditionally specify external advisor scoped document access. | 003,018,027,028 | /api/documents,/api/documents/upload | User, UserRole, Document, AccessRequest, AuditEvent | permission-engine, document services | Guest sees only explicitly invited document/object if unlocked. | Guest cannot see tenant-wide/internal/advisory payload. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Default P1 unless object-scope proof requires it. | P1_DEFERRED |
| AV-MVP-P9-T004 | 9 | MJ-009 | FND-010/FND-013 | MVP_SUPPORT_CONDITIONAL_OR_P1_GUARD | Preserve mobile communication as P1 after client-visibility proof. | 020,052-053 | /api/demo-workflow | Message, MessageThread, Recommendation | communication components/services | Future mobile request can create internal workflow after unlock. | No first-path mobile advisory workflow leakage. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | P1_DEFERRED. | P1_DEFERRED |
| AV-MVP-P10-T001 | 10 | all MVP | FND-013 | MVP | Build P0 positive acceptance map for every MVP journey. | all MVP routes | all 4 APIs | all safety-critical models | tests directory | Each selected journey has at least one positive done path. | No positive path counted without corresponding negative. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No tests written here. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T002 | 10 | all MVP safety | FND-013 | MVP | Build P0 negative acceptance map for leakage, bypass and fail-closed. | all MVP/support safety routes | all 4 APIs | RBAC/visibility/evidence/audit/export models | tests directory | Negative cases cover wrong tenant, unknown user, admin bypass, upload-only, draft leakage, export leakage. | No gate accepted without negative proof. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No P0 pass claim yet. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T003 | 10 | MJ-001/MJ-002/MJ-006/MJ-005 | FND-013 | MVP | Extend API contract test obligations. | API consumers | /api/demo-workflow,/api/documents,/api/documents/upload,/api/review-monitoring | request/response models | API specs | Requests validate actor/scope/preconditions. | API errors do not advance workflow or expose data. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No new API route unless authorized. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T004 | 10 | MJ-001/MJ-002/MJ-006 | FND-013 | MVP | Extend route/UI state test obligations. | 001-063 MVP/support routes | browser/UI flows | state models | Playwright specs | Loading/error/empty/permission/blocked/success states observable where relevant. | Denied/hidden states never render sensitive payload. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No screen generation. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P10-T005 | 10 | all | FND-013 | MVP | Define proof report acceptance and regression guard. | all | all | all | pnpm test:playwright, phase checks later | Proof report maps every gate to test evidence or blocker. | No existing test slice overclaimed as full P0 proof. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No execution now. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T001 | 11 | all | all | PREP | Freeze implementation plan and task matrix for later handoff. | all worksets | all impacts | all | this markdown artefact | Plan contains phases, tasks, dependencies, stop rules and acceptance. | No open decision delegated to Codex. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No implementation in this artefact. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T002 | 11 | all | all | PREP | Prepare later Codex handoff package index. | all target route groups | all APIs | all models/services | FINAL_CODEX_TASK_MASTER, final handoff inputs | Handoff can reference task IDs and acceptance requirements. | P1/hold/reference/do-not-create items remain excluded. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | Do not start Codex execution. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T003 | 11 | all | all | PREP | Validate dependencies and phase order. | all | all | all | dependency graph | Every later task has upstream prerequisites. | No export/client visibility before release/evidence/RBAC. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No route reclassification. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T004 | 11 | all | all | PREP | Run stop-rule checklist as planning QA. | all | all | all | QA section | No screen/image/schema/API/test/code mutation authorized. | Any task violating stop rules marked DO_NOT_CREATE/BLOCKED. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No tools/commands mutate repo. | READY_FOR_LATER_CODEX_HANDOFF |
| AV-MVP-P11-T005 | 11 | all | all | PREP | Define final acceptance verdict. | all | all | all | QA proof | Plan accepted for phased delivery preparation. | Codex execution still requires explicit handoff or user confirmation. | Add/extend P0 positive and negative tests; map to existing proof slices; no execution in this artefact. | Previous phase exit gate and source hierarchy lock. | No hidden implementation authorization. | READY_FOR_LATER_CODEX_HANDOFF |

## 9. Work Package Plan

| WP ID | Name | Phases | Journeys | Requirements | Primary Tasks | Dependencies | Acceptance | Negative Tests | Later Codex Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WP-01 | Providerless current-user / tenant / role / object scope | 0-1 | MJ-001, MJ-006, MJ-010; conditional MJ-011 | FND-001, FND-002, FND-003 | AV-MVP-P1-T001..T005 | Source lock; provider stub semantics accepted | Mapped actor context and scoped payload visibility | Unknown/wrong tenant no payload leak | READY_FOR_LATER_CODEX_HANDOFF |
| WP-02 | RBAC / Governance / Admin non-bypass | 1-2 | MJ-010, MJ-006, MJ-001 | FND-003, FND-004 | AV-MVP-P2-T001..T005 | WP-01 | Admin can govern within policy | Admin cannot bypass release/evidence/export/visibility/audit | READY_FOR_LATER_CODEX_HANDOFF |
| WP-03 | Evidence upload / review / sufficiency | 3 | MJ-002; supports MJ-005 | FND-005 | AV-MVP-P3-T001..T006 | WP-01/WP-02 | Reviewed/linked/scoped evidence can support gate | Upload-only, wrong-scope, unreviewed evidence cannot release | READY_FOR_LATER_CODEX_HANDOFF |
| WP-04 | Internal draft / analyst review / advisor approval separation | 4-5 | MJ-003, MJ-001 | FND-006, FND-007, FND-008 | AV-MVP-P4-T001..T005; AV-MVP-P5-T001 | WP-01/WP-03 | Draft internal review and advisor approval path exists | AI draft leakage; advisor approval as release fails | READY_FOR_LATER_CODEX_HANDOFF |
| WP-05 | Compliance release / client visibility projection | 5-6 | MJ-001, MJ-002, MJ-006 | FND-009, FND-010 | AV-MVP-P5-T002..T005; AV-MVP-P6-T001..T005 | WP-01-WP-04 | Compliance release creates safe projection | Missing preconditions, internal leakage, manual override fail | READY_FOR_LATER_CODEX_HANDOFF |
| WP-06 | Decision record / audit persistence | 7 | MJ-001, MJ-002, MJ-006, MJ-010, MJ-005 | FND-011 | AV-MVP-P7-T001..T005 | WP-01-WP-05 | Critical actions write audit and decision state | Audit failure does not complete safety action | READY_FOR_LATER_CODEX_HANDOFF |
| WP-07 | Export / redaction / client-safe package | 8 | MJ-005 | FND-012 | AV-MVP-P8-T001..T005 | WP-01-WP-06 | Scoped/redacted/approved manifest/package | Forbidden payload, no approval, no redaction fail | READY_FOR_LATER_CODEX_HANDOFF |
| WP-08 | P0 acceptance suite | 10 | all MVP portfolio | FND-013 | AV-MVP-P10-T001..T005 | WP-01-WP-07 | P0 positives and negatives mapped | No gate accepted from proof slice alone | READY_FOR_LATER_CODEX_HANDOFF |
| WP-09 | Conditional support: data quality / external advisor scope | 9 | MJ-012; conditional MJ-011; P1 guard MJ-008/MJ-009 | FND-002, FND-003, FND-013 | AV-MVP-P9-T001..T004 | Core scope stable | Support blockers strengthen core only | Guest/review/mobile leakage and P1 elevation blocked | MIXED: READY_CONDITIONAL / P1_DEFERRED |

## 10. Route / API / Schema / Test Implementation Impact

### 10.1 Route Impact
| Route / Route Group | Journey | Phase | Required Change / Verification | Risk | Test |
| --- | --- | --- | --- | --- | --- |
| 001-006 Access / onboarding | MJ-001, MJ-006, MJ-010; conditional MJ-011 | 1, 10 | Resolve mapped actor, tenant, role and denied states; support route shells only, not production IAM. | Providerless misread as anonymous demo. | Current-user/wrong-tenant route/API negatives. |
| 007-018 Admin / tenant / roles | MJ-010, MJ-001 | 1-2, 10 | Tenant/user/role setup and governance semantics; admin non-bypass. | Admin route access mistaken as release/export authority. | Admin bypass and role escalation negatives. |
| 019-020 Client portal/mobile | MJ-001, MJ-002, MJ-006 | 6, 10 | Fail-closed client-safe released projection. | Internal/unreleased payload leakage. | Client visibility hidden/redacted/denied tests. |
| 021-026 Client/entity context | MJ-001 support | 1, 10 conditional | Context support only; not full family-office graph scope. | Context route payload expansion. | Conditional object-scope tests if flow-relevant. |
| 027-030 Documents / upload / review | MJ-002 | 3, 6, 10 | Upload-only success, document review, evidence linkage and scoped list. | Upload treated as sufficiency or visibility. | Upload invalid/denied/wrong-scope tests. |
| 033-037 Workbench / advisor approval | MJ-003, MJ-001 | 4-5, 10 | Internal draft, analyst review, advisor approval separation. | AI draft leakage; advisor approval equals release. | AI internal-only and advisor-not-release tests. |
| 038-042 Compliance / block / audit | MJ-001, MJ-002 | 5, 7, 10 | Compliance block/request evidence/release and audit log. | Release without evidence/advisor/audit. | Compliance precondition and audit-fail tests. |
| 043-047 Decisions / evidence vault | MJ-001, MJ-002, MJ-006 | 6-7, 10 | Decision record, evidence visibility and audit traceability. | Visible evidence/decision as raw internal payload. | Decision client-safe projection tests. |
| 048-051 Governance/audit history | MJ-010, MJ-006 | 2, 7, 10 | Access requests, roles and audit history support. | Governance view as payload privilege. | Role/action/payload separation tests. |
| 052-053 Communication | MJ-009 | P1 deferred | Keep as P1; no first-path communication/advisory workflow. | Client message leaks internal advice. | Deferred until P1. |
| 054-058 Export | MJ-005 | 8, 10 | Scope/redaction/preview/approval/download separation. | Raw internal package; preview as approval. | Export forbidden payload/no approval/no redaction tests. |
| 059-060 Ops queues/SLA | MJ-012 support | 9 conditional | Data-quality or ops blockers only if release-blocking support. | Ops scope distracts from core proof. | Conditional data-quality blocker tests. |
| 061-063 Reference-only | reference | No product implementation | No product task; keep as reference pages. | Reference page treated as product behaviour. | No task. |
| 064-067 KYC/SoW/Suitability/IPS | MJ-007 | Hold/P2 | Blocked pending dedicated policy/safety unlock. | Regulated suitability pulled into MVP too early. | No MVP task. |
| 068-069 Review monitoring / rebalance | MJ-008 | P1 / hold guard | P1 internal monitoring; not automatic advice. | Monitoring mistaken as rebalance execution. | No-auto-advice guard tests when P1 unlocks. |
| 070-071 Committee review | MJ-004 | Hold/P2 | Blocked pending committee governance unlock. | Committee approval bypass or premature visual/scope work. | No MVP task. |

### 10.2 API Impact
| API | Journey | Phase | Required Contract / Hardening | Request/Response Impact | Negative Tests |
| --- | --- | --- | --- | --- | --- |
| /api/demo-workflow | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010 | 1-8,10 | Harden action family contracts: actor context, role/action/object/payload checks, gate preconditions, audit, no-overclaim responses. | Request carries actor/action/object context; response exposes only allowed state and no client release unless release path passes. | Malformed action, wrong tenant, admin bypass, advisor-not-release, AI draft leakage, no audit fail-closed. |
| /api/documents | MJ-002, MJ-006, MJ-001 | 1,3,6,10 | Scoped document list with role/object/payload visibility. | Request filters by tenant/actor; response hides internal/unreleased fields. | Wrong tenant, route access but no payload, raw evidence leakage. |
| /api/documents/upload | MJ-002, MJ-006 | 1,3,7,10 | Validate file, role, tenant, object, audit and upload-only semantics. | Multipart upload creates candidate rows only; no release/sufficiency. | Invalid file, forbidden role, wrong tenant/object, audit failure. |
| /api/review-monitoring | MJ-008, MJ-012 support | 9,10 conditional | P1/internal monitoring contract; no automatic advice execution or client release. | Read-only/snapshot response remains internal unless later P1 unlocks. | No-auto-advice, no clientVisible rebalance, wrong actor denied. |
| Candidate current-user/access API | MJ-001, MJ-006, MJ-010, MJ-011 | 1 | `CANDIDATE_IF_FINAL_HANDOFF_AUTHORIZES`; only if existing session/demo provider cannot safely express mapped actor context. | Would return deterministic actor/tenant/role/object scope. | Unknown/unmapped user fail-closed; no anonymous payload expansion. |

### 10.3 Schema / Model Impact
Full-workflow Prisma schema remains the baseline. The patch schema is Control Spec only. Schema changes are allowed only if explicitly authorized in a later final handoff and after field-level proof; no blind patch-schema replacement is allowed.

| Model / Concept | Journey | Phase | Required Semantic Alignment | Schema Change? | Test |
| --- | --- | --- | --- | --- | --- |
| User, UserProfile, ClientTenant, UserRole | MJ-001, MJ-006, MJ-010 | 1 | Support deterministic mapped current user, tenant membership, role and object scope. | No schema change now; align usage to full-workflow baseline. | Unknown/wrong tenant/user denied. |
| Role, Permission, RolePermission, PolicyDefinition | MJ-010, MJ-006 | 1-2 | Separate route/action/object/payload permissions and policy guardrails. | No blind replacement; use existing fields/policies. | Route access not payload/action authority. |
| AccessRequest, SecondConfirmation, AuditEvent | MJ-010 | 2,7 | Governance requests, sensitive confirmation and audit trace. | No schema change unless final handoff proves missing field. | Admin non-bypass, missing confirmation/audit. |
| Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink | MJ-002 | 3 | Upload/review/extraction/link lifecycle and upload-only semantics. | Full schema baseline; no patch replacement. | Upload not sufficiency; wrong-scope/invalid/denied. |
| EvidenceRecord, EvidenceItem | MJ-002, MJ-005 | 3,6,8 | Evidence sufficiency requires review, link, relevance, scope and acceptance. | No implicit sufficiency from row existence. | Unreviewed/unlinked/stale/wrong-scope evidence. |
| Trigger, Recommendation, RecommendationOption | MJ-003 | 4-6 | Internal draft, unsupported claim, advisor/compliance state, client-safe summary. | AI draft may be status/fields/service-derived; no new model by default. | AI draft/internal rationale leakage. |
| Approval, ComplianceReview, Decision, DecisionParticipant | MJ-001, MJ-002, MJ-003 | 5-7 | Advisor approval, compliance release/block, decision record, audit projection. | No schema change now; align gate semantics. | Advisor approval not release; release without preconditions denied. |
| ExportRequest | MJ-005 | 8 | Export scope/redaction/approval/generated package state. | Full schema baseline; metadata-only package acceptable first. | Forbidden internal payload/no approval/no redaction. |
| DataQualityIssue, ReviewSchedule, MessageThread, Message | MJ-012, MJ-008, MJ-009 | 9 / P1 | Support/conditional/P1 only. | No MVP expansion unless explicitly unlocked. | No automatic advice or mobile communication leakage. |

### 10.4 Test Impact
| Existing Test | Relevance | Must Keep | Must Extend | Missing Test |
| --- | --- | --- | --- | --- |
| tests/committee-review-routes.spec.ts | Held committee route proof slice for 070-071 only. | Keep as proof slice, not MVP unlock. | Do not extend for MVP unless MJ-004 unlocked. | Committee vote/dissent mutation, RBAC and payload proof deferred. |
| tests/data-quality-service.spec.ts | Data-quality support / MJ-012. | Keep. | Extend only if data quality becomes release blocker. | High-severity issue blocks release/export when active. |
| tests/demo-workflow-api.spec.ts | Central demo workflow action transport and validation proof slice. | Keep. | Extend for actor context, admin non-bypass, advisor-not-release, AI internal-only, compliance release, audit failure. | Wrong actor/object/action and no-client-release negatives. |
| tests/document-upload-api.spec.ts | Strong upload API proof slice. | Keep. | Extend for sufficiency lifecycle, tenant/object matrix, audit failure, size/metadata as needed. | Upload-not-sufficiency and wrong-scope evidence. |
| tests/document-upload-flow.spec.ts | Browser upload positive flow. | Keep. | Extend for invalid file, denied role, retry, upload-only warning. | UI negative upload states. |
| tests/file-export-realism.spec.ts | Export manifest/service proof slice. | Keep. | Extend for route/API scope, forbidden payload, audit and redaction profile. | No approval/no redaction/forbidden internal payload. |
| tests/permission-engine.spec.ts | Strong RBAC/denied audit proof slice. | Keep. | Extend route/action/payload matrix, admin non-bypass, client payloads, export/doc object scope. | Cross-tenant/wrong-object and route-access-not-payload negatives. |
| tests/review-monitoring-service.spec.ts | P1 review monitoring proof slice. | Keep. | Extend only if P1; add no-auto-advice guard. | Monitoring does not execute or client-release advice. |
| tests/route-smoke.spec.ts | Route shell and heading proof. | Keep. | Do not treat as authorization; add route denied states where relevant. | Route 200 does not imply access/payload permission. |
| tests/workflow-gate.spec.ts | Workflow gate proof slice. | Keep. | Extend advisor/compliance/evidence/release gate preconditions and failure cases. | Advisor-not-release, missing evidence, audit fail-closed. |

## 11. P0 Acceptance Plan
| P0 Gate | Covered By Phase(s) | Covered By Task(s) | Positive Acceptance | Negative Acceptance | Existing Proof Slice | Missing Proof | Done Criteria |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Providerless Auth Stub not anonymous demo | 1 | AV-MVP-P1-T001, P1-T005 | Mapped user resolves tenant/role/object scope. | Unknown/unmapped actor denied; no anonymous payload expansion. | Route/session/demo provider proof slices only. | Current-user API/route negative proof. | Mapped actor context tests pass. |
| Tenant/object isolation | 1,2,6,10 | P1-T002,T004; P2-T005; P6-T005 | Scoped actor sees only own object. | Wrong tenant/object no payload + audit. | permission-engine slice. | API/route object-scope matrix. | No cross-tenant leak. |
| RBAC route/action/payload separation | 1,2,10 | P1-T003; P2-T001; P10-T002 | Allowed role performs scoped action. | Route access alone cannot read/act. | permission-engine partial. | Route/API payload tests. | Route/action/payload all independent. |
| AI Draft internal-only | 4,6,8,10 | P4-T001,T004,T005; P8-T002 | Internal draft reviewed/rebuilt. | No AI draft/internal rationale in client/API/export. | demo-workflow/workflow slices. | Dedicated leakage tests. | Draft redaction proven. |
| No unapproved advice | 4,5,6,10 | P4-T002; P5-T001..T005; P6-T001 | Only released compliance-approved summary can client-project. | Unsupported/unapproved/advisor-only item hidden. | workflow-gate partial. | End-to-end leakage negatives. | No unapproved advice reaches client. |
| Advisor approval not release | 5,10 | P5-T001,T005 | Advisor approval sets compliance-pending. | No clientVisible/releasedToClientAt from advisor approval. | workflow-gate partial. | Advisor-not-release API/DB/UI tests. | Gate separation proven. |
| Compliance release gate | 5,10 | P5-T002,T003,T004,T005 | Compliance release after preconditions creates safe projection. | Missing advisor/evidence/audit denied. | demo-workflow/workflow partial. | Full positive/negative release tests. | Release gate enforced. |
| Upload not sufficiency | 3,10 | P3-T002,T005,T006 | Upload creates candidate document/evidence row. | Upload does not release/suffice/export. | document-upload tests. | Sufficiency lifecycle negatives. | Upload-only semantics proven. |
| Evidence sufficiency | 3,5,10 | P3-T003,T004,T006; P5-T002 | Reviewed linked relevant scoped evidence can support gate. | Unreviewed/unlinked/stale/wrong-scope evidence blocks. | document-upload proof slice. | Review/link/relevance/scope tests. | Sufficiency gate explicit. |
| Client visibility fail-closed | 6,10 | P6-T001..T005 | Client sees released safe summary only. | Draft/internal/compliance/unreleased evidence hidden/redacted. | visibility-engine presence only. | Payload redaction tests. | Fail-closed projection proven. |
| Admin non-bypass | 2,7,10 | P2-T001..T005; P7-T004 | Admin governance action allowed within scope. | Admin cannot force release/evidence/export/visibility/audit. | permission-engine partial. | Admin bypass matrix. | No admin bypass. |
| Audit persistence / fail-closed | 7,10 | P7-T001..T005 | Critical actions write audit rows. | Audit failure blocks/holds safety action. | audit rows in existing slices. | Audit-failure negative tests. | Audit persistence/fail-closed proven. |
| Export redaction | 8,10 | P8-T001..T005 | Approved export contains scoped redacted content. | Forbidden payload/no approval/no redaction/audit failure blocks. | file-export-realism partial. | Route/API forbidden payload tests. | Client-safe export proven. |
| Review monitoring not automatic advice | 9,10 | P9-T002 | Monitoring is internal/P1 snapshot. | No automatic rebalance/advice/client release. | review-monitoring-service slice. | No-auto-advice tests if unlocked. | P1 guard preserved. |
| Hold routes not elevated silently | 0,9,11 | P0-T002; P9-T002; P11-T002,T004 | Hold routes remain blocked. | 064-067,069-071 not implemented or generated. | route matrices. | Stop-rule checklist. | No hold/P2 implementation. |

## 12. Sequencing and Dependency Graph
| Dependency | Required Before | Reason | Blocking Level | Related Tasks |
| --- | --- | --- | --- | --- |
| Providerless Auth Stub | Real User Mapping | Provider can return true, but mapped actor context must be deterministic before anything can be trusted. | P0 blocker | AV-MVP-P1-T001 |
| Real User Mapping | Role / Tenant / Object Scope | RBAC cannot evaluate anonymous or tenantless actors. | P0 blocker | AV-MVP-P1-T002,T004 |
| Role / Tenant / Object Scope | RBAC / Payload Visibility | Route/action/payload checks depend on actor/object context. | P0 blocker | AV-MVP-P1-T003; P2-T001 |
| RBAC / Payload Visibility | Client Visibility / Export | Client/export surfaces must inherit actor/object/payload limits. | P0 blocker | AV-MVP-P6-T001..T005; P8-T001 |
| Evidence Intake | Evidence Review | Upload creates candidate evidence only; review must qualify it. | P0 blocker | AV-MVP-P3-T002,T003 |
| Evidence Review | Evidence Sufficiency | Sufficiency requires link, relevance, scope and acceptance. | P0 blocker | AV-MVP-P3-T004 |
| Internal Draft | Analyst Review | AI/rules draft is internal and unsupported claims require human review. | P0 blocker | AV-MVP-P4-T001,T002 |
| Analyst Review | Advisor Approval | Advisor should receive evidence-backed reviewed material, not unsupported draft. | P0 blocker | AV-MVP-P4-T003; P5-T001 |
| Advisor Approval | Compliance Release | Advisor approval is not release; compliance controls client visibility. | P0 blocker | AV-MVP-P5-T001,T002 |
| Compliance Release | Client Visibility | Client sees only after compliance release and redaction/visibility checks. | P0 blocker | AV-MVP-P5-T004; P6-T001 |
| Decision Record | Audit Trail | Critical state changes must be traceable. | P0 blocker | AV-MVP-P7-T001,T003 |
| Audit Trail | Export Safety | Export approval/download/share must be auditable. | P0 blocker | AV-MVP-P8-T004 |
| Core identity/object scope | External advisor access | Guest access is too risky before core object-scope proof. | Conditional/P1 | AV-MVP-P9-T003 |
| Core release/advice boundary | Committee/KYC/Suitability | Held high-risk journeys require dedicated unlock artefacts after core proof. | Hold/P2 | Blocked register |

## 13. Blocked / Deferred / Do-Not-Create Register
| Item | Status | Why Blocked / Deferred | Unlock Condition | Do-Not-Create Rule |
| --- | --- | --- | --- | --- |
| MJ-004 Committee Review | HOLD_BLOCKED | Depends on committee routes 070-071, quorum/vote/dissent/evidence model and unresolved governance depth. | Dedicated committee scope/safety/visual/state/P0 unlock artefact. | Do not create MVP task or implement routes 070-071. |
| MJ-007 KYC/SoW/Suitability/IPS | HOLD_BLOCKED | Routes 064-067 held; high advice/suitability risk. | Dedicated KYC/suitability policy lock and acceptance model. | Do not include KYC/SoW/Suitability/IPS in first path. |
| MJ-008 Review Monitoring / Rebalance | P1_DEFERRED | Valuable after core proof; could imply automatic advice/execution too early. | Core workflow and no-auto-advice tests complete. | Do not create MVP auto-advice/rebalance task. |
| MJ-009 Mobile Communication | P1_DEFERRED | Communication layer follows client visibility safety. | Client/message visibility stable. | Do not create first-path communication advisory workflow task. |
| MJ-011 External Advisor | CONDITIONAL/P1 | Guest/object-scope risk compounds leakage. | Core user/object scope stable or explicit object-scope proof need. | No tenant-wide guest access. |
| Routes 064-067, 069-071 | HOLD_BLOCKED | Registered but held/missing or unresolved visual/safety scope. | Dedicated unlock decisions. | No generation, implementation or MVP elevation. |
| Production AI advice | DO_NOT_CREATE | Contradicts human-reviewed, evidence-backed model. | Never in current MVP. | No autonomous advice task. |
| Client-visible AI draft | DO_NOT_CREATE | AI/rules draft is internal-only. | Never before transformed to released client-safe summary. | No AI draft in client/API/export payload. |
| Manual client visibility override | DO_NOT_CREATE | Client visibility must be derived and fail-closed. | No unlock. | No manual toggle that bypasses release/redaction. |
| Admin bypass | DO_NOT_CREATE | Admin authority is governance-scoped, not safety-gate authority. | Never. | No admin release/evidence/export/audit bypass. |
| Upload-to-release shortcut | DO_NOT_CREATE | Upload success is not evidence sufficiency. | Never. | No upload-only release/export/client visibility. |
| Blind schema replacement | DO_NOT_CREATE | Full-workflow schema remains baseline; patch is Control Spec. | Only explicit field-level handoff can authorize changes. | Do not replace Prisma schema with patch schema. |
| Screen/state/image generation | DO_NOT_CREATE_NOW | Current no-generation decision remains binding. | Only later explicit generation artefact and user authorization. | No visual generation from this plan. |

## 14. Execution Readiness Checklist
| Check | Required Before Codex Execution | Status | Evidence / Missing |
| --- | --- | --- | --- |
| Source hierarchy locked | Yes | PASS | Journey priority + requirements matrix are first; full-workflow target locked; main false-gap only. |
| Branch/repo verified | Yes | PARTIAL_PASS | Live branch page reachable and top-level folders visible; refresh before code execution. |
| Phase plan accepted | Yes | PASS_PENDING_USER_REVIEW | 12-phase plan defined here. |
| Task matrix accepted | Yes | PASS_PENDING_USER_REVIEW | 61 detailed later-Codex task candidates / deferred items defined. |
| P0 positives and negatives mapped | Yes | PARTIAL_PASS | P0 matrix complete as planning; tests still need implementation/execution later. |
| Target files / components / APIs identified | Yes | PARTIAL_PASS | Likely files/areas identified; exact file diffs must be produced during final handoff/execution. |
| No hold routes pulled into MVP | Yes | PASS | MJ-004/MJ-007 and routes 064-067/069-071 remain hold/P2. |
| Tests mapped | Yes | PASS | All 10 existing test files mapped to keep/extend/missing proof. |
| Stop rules included | Yes | PASS | No code/test/screen/schema/API/Codex execution authorized. |
| Final Codex handoff still required or explicitly authorized by user | Yes | PASS | This plan is not execution authority. |

## 15. Final QA / Proof
| Proof Area | Result |
| --- | --- |
| ENGINE_v3 Source-of-Truth Proof | The plan uses `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` and `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` as binding sources, with live `full-workflow` branch verification and local full-workflow snapshot as code reality support. `main` remains false-gap only. |
| ENGINE_v3 Evidence Mapping Proof | MVP journeys, FND-001..FND-013, route worksets, APIs, models/services, existing tests and P0 gates are mapped into phases, tasks, work packages and acceptance criteria. |
| ENGINE_v2 Journey-to-Phase Synthesis Proof | The locked first product build path becomes a delivery sequence: source proof → identity/scope → governance → evidence → internal draft → advisor/compliance → visibility → audit → export → support → P0 → handoff. |
| ENGINE_v2-B Task/Handoff Discipline Proof | Every later-Codex candidate has a stable `AV-MVP-P{phase}-T{number}` ID, target scope, acceptance, negative acceptance, test obligation, dependency, stop rule and status. |
| ENGINE_v3 Contradiction / False-Gap Proof | The plan blocks old `main` absence claims and prevents route/API/schema/test/visual presence from being treated as readiness. Providerless auth is not anonymous demo mode. |
| ENGINE_v3 Safety / Adversarial QA Proof | The plan attacks the main failure modes: AI draft leakage, upload-to-release, advisor-as-release, admin bypass, client payload leakage, audit display overclaim, export raw dump, review monitoring auto-advice and hold-route promotion. |
| ENGINE_v2 Compression / Operational Clarity Proof | Despite a large source universe, the output collapses work into 12 phases, 9 work packages, 61 task rows, clear impacts and one P0 acceptance matrix. |
| Stop-Rule Proof | No code, tests, screens, images, Prisma migrations, new API routes or Codex execution are created or authorized. Screen/state/image generation and hold/P1 elevation remain blocked. |
| Final Acceptance Verdict | `IMPLEMENTATION_PLAN_ACCEPTED_FOR_PHASED_DELIVERY_PREP`; `CODEX_EXECUTION_REQUIRES_EXPLICIT_HANDOFF_OR_USER_CONFIRMATION`; next suitable artefact is a final execution/handoff prompt or a Codex phase-pack derived from this plan. |

---

## Appendix A — Compact Task Count Summary

| Phase | Name | Task Count |
| --- | --- | --- |
| 0 | Repo / Source Reality Verification | 4 |
| 1 | Providerless Real User / Tenant / Role Foundation | 5 |
| 2 | Governance / Admin Non-Bypass Foundation | 5 |
| 3 | Evidence Intake / Review / Sufficiency | 6 |
| 4 | Internal Draft / Analyst Review / AI Internal-Only | 5 |
| 5 | Advisor Approval → Compliance Gate | 5 |
| 6 | Client Visibility Fail-Closed Projection | 5 |
| 7 | Decision Record + Audit Persistence | 5 |
| 8 | Export / Redaction / Client-Safe Package | 5 |
| 9 | Support Hardening | 4 |
| 10 | P0 Positive / Negative Acceptance Suite | 5 |
| 11 | Delivery Readiness / Handoff Packaging | 5 |

**Total later-Codex task candidates / deferred task rows:** 59
