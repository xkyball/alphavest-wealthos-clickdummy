# ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-22  
**Mode:** Flow refactoring plan only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine finalen Codex-Tasks. Keine automatische Screen-/State-Screen-/Image-Generation.  
**Target project:** AlphaVest WealthOS  
**Target branch:** `full-workflow`  
**Direct predecessor:** `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md`  
**Next artefact:** `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`

## 1. Executive Decision

| Decision Area | Decision | Meaning |
|---|---|---|
| Artefact status | `TRUE_UX_FLOW_REFACTORING_PLAN_ACCEPTED_WITH_TASK_PACK_DEPENDENCY` | Flow-level target architecture is defined, but no Codex task execution is authorized. |
| Level shift | `ROUTE_LEVEL_TO_FLOW_LEVEL_SHIFT_COMPLETE` | The plan translates route evolution into end-to-end actor journeys. |
| Route evolution policy intake | `ROUTE_EVOLUTION_POLICY_MATRIX_APPLIED` | The new route-evolution policy supersedes the old restrictive route policy where blocking true UX evolution. |
| P1/Hold integration | `FORMER_P1_AND_HOLD_ACTIVELY_PLANNED_IN_MVP_FLOWS_WITH_SAFETY_RECHECK` | Former P1/Hold routes are not parked; they are assigned MVP flow roles with recheck obligations. |
| Screen split policy | `FLOW_LEVEL_SPLIT_DECISIONS_REQUIRED_AND_APPLIED` | Monster flows receive chosen split directions and alternatives considered. |
| Codex tasks | `NOT_CREATED_IN_THIS_ARTEFACT` | This is not a task pack, not an implementation handoff. |
| Moving baseline | `CURRENT_BASELINE_RECHECK_REQUIRED_BEFORE_TASK_PACK` | Parallel refactoring means all route/component/test facts must be rechecked before tasks. |
| Next artefact | `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md` | The next artefact may translate this flow plan into detailed Codex tasks. |

**Practical decision:** AlphaVest should be refactored around guided operating flows, not around the old route catalogue. The target model is: role-aware hub → work queue → workbench/detail → decision room where needed → client-safe projection where relevant → explicit blocked/recovery/success states.

## 2. Source-of-Truth Applied

| Rank | Source | Applied Use | Limit |
|---:|---|---|---|
| 1 | Current Product Owner approvals | P1/Hold→MVP, UX auto-approval, route/screen evolution allowed | Does not override safety |
| 2 | Current `full-workflow` / latest local snapshot | Moving baseline context | Must be rechecked before task pack because parallel refactoring is underway |
| 3 | `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md` | Route-evolution policy, former P1/Hold register, monster-flow register, route records | Policy only, not tasks |
| 4 | `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md` | Decision governance and auto-approval rules | No implementation authority |
| 5 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md` | True UX doctrine and target UX architecture | No task pack |
| 6 | UX Decision Brief / old UX route policy / old task master | Historical rebase input | No-route/no-split constraints are superseded where blocking UX evolution |
| 7 | MVP/Route/Safety/Schema/Test artefacts | Safety and proof constraints | Route scope may evolve; safety may not |
| 8 | `main` branch / main ZIP | False-gap warning only | Never target truth |

## 3. Moving Baseline Requirements

Before `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`, the current branch or latest ZIP must be re-inventoried. Any drift must rebase this plan before tasks become executable.

| Check ID | Question | Required Evidence | If Missing | Flow Impact |
|---|---|---|---|---|
| MB-001 | Does current route still exist? | Route registry / app route smoke list | `BASELINE_RECHECK_REQUIRED` | No task may finalize for that route. |
| MB-002 | Does current component still exist? | Components inventory / grep by screen component | `COMPONENT_RECHECK_REQUIRED` | Surface remains planning candidate only. |
| MB-003 | Has route changed due to parallel refactoring? | Git diff, route registry diff or ZIP inventory | `BASELINE_DRIFT` | Rebase affected flow before task pack. |
| MB-004 | Has navigation changed? | App shell/sidebar/topbar/page-header check | `NAV_DRIFT` | Update target IA plan before tasking. |
| MB-005 | Have tests changed? | Tests inventory and package scripts | `TEST_BASELINE_RECHECK_REQUIRED` | Proof matrix must be updated. |
| MB-006 | Are new UX files already present? | Docs/components/prompts inventory | `PARALLEL_UX_WORK_DETECTED` | Avoid duplicate tasks; convert to finish/harden tasks. |
| MB-007 | Current branch/commit/snapshot confirmed? | `git branch`, `git log -1`, ZIP timestamp or repo status | `BASELINE_UNCONFIRMED` | Stop before task pack. |

## 4. Route Evolution Policy Matrix Intake

| Input Area | What Must Be Used | Flow Planning Implication |
|---|---|---|
| Full Route Evolution Policy Matrix | Route-by-route evolution policy for all known routes | Target flows may propose new hubs, queues, details, decision rooms and client projections. |
| Former P1/Hold Elevation Register | Routes `052`, `053`, `059`, `060`, `068`, `064–067`, `069–071` | These routes are actively integrated into MVP target flows with safety recheck. |
| Monster Flow Register | Workbench, Evidence, Compliance, Decision, Export, Governance, Client, KYC, Committee, Review Monitoring, Communication, Ops | These become the priority flow set below. |
| Route Evolution Candidate Records | Strategy candidates from the policy matrix | Referenced and planning-finalized in Section 11. |
| Screen Split Candidate Register | Monster-screen split candidates | Applied per flow in Sections 8 and 10. |
| Old vs New Policy Separation | Old policy historical; new evolution policy active | Old no-new-route/no-split blockers must not re-enter the task pack. |

## 5. Flow Refactoring Principles

| Principle | Meaning | Application |
|---|---|---|
| Flow first, route second | User goal controls route architecture. | Route creation/splitting is allowed when it improves the flow. |
| One page job per surface | Each surface has one primary job. | Monster screens split into hub/queue/workbench/detail/decision surfaces. |
| Hub orients, Workbench acts, Detail explains, Decision Room decides | Page types have distinct jobs. | Every flow maps to clear surface roles. |
| Client Projection is separate | Client-safe view is a dedicated projection layer. | Never reuse internal workbench as client UI with hidden fields only. |
| Safety Gates are steps, not footnotes | Gate reasons must be visible and actionable. | Blocked/recovery states are designed inside the flow. |
| Back/Cancel/Recovery must exist | Users need control and safe exit. | Critical flows specify cancel/retry/save/back semantics. |
| Simple Split before Multiple Split when sufficient | Do not over-fragment. | Choose the least split that solves page job clarity. |
| Multiple plus Merge when flows duplicate work | Consolidate duplicated adjacent flows. | Governance, workbench, export and evidence clusters may merge or share context. |
| No task without flow proof | Codex needs flow-level rationale. | Task pack must cite flow decisions and proof requirements. |

## 6. Priority Flow Set

| Flow ID | Flow Name | Required? | Notes |
|---|---|---:|---|
| FLOW-001 | New Family Office onboarding to first client-safe decision | Yes | Route cluster: `001-020, 027-045, 048-051`; actor: Platform Admin → Analyst → Advisor → Compliance → Client |
| FLOW-002 | Evidence missing → client upload → review → release | Yes | Route cluster: `027-030, 038-041, 046-047, 019-020`; actor: Compliance → Client → Analyst → Compliance |
| FLOW-003 | AI draft rejected and rebuilt with evidence | Yes | Route cluster: `033-037, 027-030, 046-047`; actor: Analyst / Consultant |
| FLOW-004 | Advisor approval → compliance release | Yes | Route cluster: `036-042, 043-045, 019-020`; actor: Advisor → Compliance Officer |
| FLOW-005 | Export package with forbidden internal payload redaction | Yes | Route cluster: `054-058`; actor: Advisor / Compliance / Client Service |
| FLOW-006 | Governance / RBAC / admin non-bypass | Yes | Route cluster: `007-012, 048-051, 009-010`; actor: Security / Governance Admin |
| FLOW-007 | KYC / Source-of-Wealth / Suitability / IPS | Yes | Route cluster: `064-067`; actor: Analyst → Advisor → Compliance |
| FLOW-008 | Committee Review | Yes | Route cluster: `070-071`; actor: Committee Member / Chair / Compliance |
| FLOW-009 | Review Monitoring / Rebalance | Yes | Route cluster: `068-069`; actor: Operations / Analyst / Advisor |
| FLOW-010 | Client Portal / Client Projection | Yes | Route cluster: `019-020, 027-028, 043-045, 054-058`; actor: Client / Principal / Family Office User |
| FLOW-011 | Communication / Call Trigger | Yes | Route cluster: `052-053`; actor: Advisor / Client Success / Analyst |
| FLOW-012 | Operations Queues / SLA | Yes | Route cluster: `059-060`; actor: Operations / Client Success |

## 7. Target Flow Architecture Overview

| Flow ID | Start | Hub | Queue | Workbench | Detail | Decision Room | Client Projection | Success |
|---|---|---|---|---|---|---|---|---|
| FLOW-001 | /login or /onboarding/invite | /family-office or /workspace hub | /advisory/review-queue | /advisory/workbench | /workbench/triggers/:id + /decisions/:id | /compliance/:id/release + /decisions/:id/decision-room | /client/releases or /client/decisions/:id | Client sees released, redacted decision summary only. |
| FLOW-002 | /compliance/:id/block | /evidence or /documents hub | /documents/verification-pending | /documents/extraction-review | /evidence/:id/review | /compliance/:id/decision-room | /client/evidence-requests and /client/releases | Evidence is reviewed, linked, sufficient for the gate, audited and then release can proceed. |
| FLOW-003 | /signals | /advisory hub | /advisory/review-queue | /advisory/workbench | /workbench/triggers/:id | /advisor-approval/:id after rebuild | None until compliance release | Unsupported draft is rejected or rebuilt with linked evidence and passed to advisor as internal-only recommendation. |
| FLOW-004 | /advisor-approval | /advisory or /approval hub | /advisor-approval queue | /advisor-approval/:id | /decisions/:id | /compliance/:id/release or /compliance/:id/block decision room | /client/decisions/:id after release | Advisor approval moves to compliance pending; compliance release creates client-safe projection only after gates pass. |
| FLOW-005 | /export/new | /export hub | /export requests queue | /export/:id/scope | /export/:id/redaction and /export/:id/preview | /export/:id/approval | /export/:id/download or client-safe package handoff | Approved export package includes only scoped, redacted, released content and writes audit proof. |
| FLOW-006 | /governance/users or /admin/roles | /governance hub | /governance/access-requests | /governance/access-requests/:id | /governance/audit/:id and /governance/roles/:id | Second confirmation / access approval decision | None client-facing | Access or role changes are governed, audited and do not expand advice/release/payload authority. |
| FLOW-007 | /kyc/:id/review | /kyc or /suitability hub | /kyc/reviews | /kyc/:id/review | /kyc/:id/source-of-wealth + /suitability/:tenantId/profile | /ips/:tenantId/decision-room | Client-safe request/summary only if released | KYC/SoW/suitability/IPS constraints are reviewed and block/release advisory flow safely. |
| FLOW-008 | /committee/reviews | /committee hub | /committee/reviews | /committee/reviews/:id | /committee/reviews/:id/evidence | /committee/reviews/:id/decision-room or /vote | None until compliance release | Committee recommendation/vote/dissent becomes internal governance evidence; it does not bypass advisor/compliance gates. |
| FLOW-009 | /reviews/calendar or /monitoring/rebalance | /reviews hub | /reviews/calendar due queue | /monitoring/rebalance | /monitoring/rebalance/:id/review | Internal review decision room only if needed | None unless later released through advisory/compliance flow | Monitoring produces internal review work, not automatic rebalance advice. |
| FLOW-010 | /portal or /mobile | /client home | /client/evidence-requests | Evidence upload or released decision review | /client/decisions/:id or /client/releases/:id | Client does not make internal approval decisions | /client/releases + /client/evidence-requests | Client can view released summaries and fulfill evidence requests without internal leakage. |
| FLOW-011 | /communication | /communication hub | /communication/call-trigger | /communication/:id/context | Message/call context drawer or route | No advice/release decision inside communication | Potential client-safe message only after release rules | Communication creates context or task; it does not become unapproved advice. |
| FLOW-012 | /ops/queues | /ops hub | /ops/queues | /ops/sla/:id | SLA/escalation detail | Operational escalation, not advisory release | None client-facing by default | Ops users manage workload and escalations without touching advice/release gates. |

## 8. Flow-by-Flow Refactoring Plans

### FLOW-001 — New Family Office onboarding to first client-safe decision

| Field | Required Content |
|---|---|
| Primary Actor | Platform Admin → Analyst → Advisor → Compliance → Client |
| Current Flow Problem | The current route set demonstrates the whole product spine but feels like a route catalogue: auth, tenant setup, client context, evidence, workbench, advisor approval, compliance and client visibility are present as pages, not as one guided operating journey. |
| Current Route Cluster | `001-020, 027-045, 048-051` |
| Target Route / Surface Architecture | Start: `/login or /onboarding/invite` → Hub: `/family-office or /workspace hub` → Queue: `/advisory/review-queue` → Workbench: `/advisory/workbench` → Detail: `/workbench/triggers/:id + /decisions/:id` → Decision Room: `/compliance/:id/release + /decisions/:id/decision-room` → Client Projection: `/client/releases or /client/decisions/:id` |
| Route Evolution Needed | MULTIPLE_SPLIT_PLUS_MERGE across onboarding, tenant setup, advisory, compliance, decisions and client projection. |
| Screen Split Decision | `MULTIPLE_SPLIT_PLUS_MERGE` |
| Safety Gates | AI Draft internal-only; advisor approval not release; compliance release required; client projection fail-closed. |
| Tests / Proof Required | route-smoke, full journey Playwright, permission-engine, workflow-gate, client no-leakage negative tests |
| Task-Pack Readiness | `READY_AFTER_BASELINE_RECHECK` |

**Target Flow Narrative:**

1. Admin starts from a setup hub and creates or selects a tenant context.
2. Analyst lands in a role-aware workspace showing the first client-safe-decision journey status.
3. Analyst opens the review queue, selects the trigger, checks evidence and prepares/rejects the internal draft.
4. Advisor enters the advisor review surface and approves the recommendation as advisor-approved only.
5. Compliance enters a decision room with evidence, audit, redaction and release gates.
6. Client sees only the released/redacted projection after compliance release.

### FLOW-002 — Evidence missing → client upload → review → release

| Field | Required Content |
|---|---|
| Primary Actor | Compliance → Client → Analyst → Compliance |
| Current Flow Problem | Upload, document list, extraction review, verification pending and evidence sufficiency are too easy to confuse. Upload success currently risks being read as evidence sufficiency if the flow is not staged. |
| Current Route Cluster | `027-030, 038-041, 046-047, 019-020` |
| Target Route / Surface Architecture | Start: `/compliance/:id/block` → Hub: `/evidence or /documents hub` → Queue: `/documents/verification-pending` → Workbench: `/documents/extraction-review` → Detail: `/evidence/:id/review` → Decision Room: `/compliance/:id/decision-room` → Client Projection: `/client/evidence-requests and /client/releases` |
| Route Evolution Needed | MULTIPLE_SPLIT: documents hub, upload surface, extraction workbench, evidence detail/review, compliance decision room, client evidence-request projection. |
| Screen Split Decision | `MULTIPLE_SPLIT` |
| Safety Gates | Upload success is not evidence sufficiency; raw evidence/internal notes hidden from client; audit required for request/review/release. |
| Tests / Proof Required | document-upload-api, document-upload-flow, evidence negative, workflow-gate, client no-leakage |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Compliance blocks release and requests evidence with a clear reason.
2. Client sees an evidence request projection, not internal compliance notes.
3. Client uploads a document and receives upload-only success.
4. Analyst reviews extraction, verifies the document and links it to the decision/compliance gate.
5. Compliance sees evidence sufficiency state in the decision room and can release only when audit and visibility conditions are met.

### FLOW-003 — AI draft rejected and rebuilt with evidence

| Field | Required Content |
|---|---|
| Primary Actor | Analyst / Consultant |
| Current Flow Problem | AI/rules draft, analyst review, evidence linkage and advisor handoff are currently spread across signal/workbench/approval surfaces without enough journey status clarity. |
| Current Route Cluster | `033-037, 027-030, 046-047` |
| Target Route / Surface Architecture | Start: `/signals` → Hub: `/advisory hub` → Queue: `/advisory/review-queue` → Workbench: `/advisory/workbench` → Detail: `/workbench/triggers/:id` → Decision Room: `/advisor-approval/:id after rebuild` → Client Projection: `None until compliance release` |
| Route Evolution Needed | MULTIPLE_SPLIT_PLUS_MERGE for /signals, /workbench, /workbench/triggers/:id and advisor approval detail; create advisory hub/review queue and trigger review detail. |
| Screen Split Decision | `MULTIPLE_SPLIT_PLUS_MERGE` |
| Safety Gates | AI Draft internal-only; unsupported claims cannot move to client projection; no unapproved advice. |
| Tests / Proof Required | workflow-gate, no-unapproved-advice, AI draft redaction negative, route-smoke |
| Task-Pack Readiness | `READY_AFTER_BASELINE_RECHECK` |

**Target Flow Narrative:**

1. Analyst starts from advisory queue and opens a signal.
2. System clearly labels AI/rules draft as internal-only.
3. Analyst sees unsupported claims and either rejects the draft or attaches/requires evidence.
4. Analyst rebuilds the draft with evidence links and passes it to advisor review.
5. Advisor sees a human-reviewed recommendation, not an autonomous client-ready answer.

### FLOW-004 — Advisor approval → compliance release

| Field | Required Content |
|---|---|
| Primary Actor | Advisor → Compliance Officer |
| Current Flow Problem | Advisor approval and compliance release are separate safety gates but can appear as one linear approval if CTA copy and page structure are weak. |
| Current Route Cluster | `036-042, 043-045, 019-020` |
| Target Route / Surface Architecture | Start: `/advisor-approval` → Hub: `/advisory or /approval hub` → Queue: `/advisor-approval queue` → Workbench: `/advisor-approval/:id` → Detail: `/decisions/:id` → Decision Room: `/compliance/:id/release or /compliance/:id/block decision room` → Client Projection: `/client/decisions/:id after release` |
| Route Evolution Needed | SIMPLE_SPLIT to MULTIPLE_SPLIT: advisor review queue/detail remains separate from compliance decision room and client projection. |
| Screen Split Decision | `SIMPLE_SPLIT with Decision Room for release/block` |
| Safety Gates | Advisor approval != compliance release; compliance release != client acceptance; audit required. |
| Tests / Proof Required | workflow-gate, permission-engine, advisor-not-release negative, compliance release positive/negative |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Advisor reviews recommendation and evidence context.
2. Advisor approves only the advisor review step; feedback says “Sent to compliance”, not “Released”.
3. Compliance opens a release/block decision room.
4. Compliance either releases, blocks or requests evidence with audit reason.
5. Client projection appears only after compliance release.

### FLOW-005 — Export package with forbidden internal payload redaction

| Field | Required Content |
|---|---|
| Primary Actor | Advisor / Compliance / Client Service |
| Current Flow Problem | Export scope, redaction, preview, approval and download/share are semantically distinct but can be misunderstood as one export action. |
| Current Route Cluster | `054-058` |
| Target Route / Surface Architecture | Start: `/export/new` → Hub: `/export hub` → Queue: `/export requests queue` → Workbench: `/export/:id/scope` → Detail: `/export/:id/redaction and /export/:id/preview` → Decision Room: `/export/:id/approval` → Client Projection: `/export/:id/download or client-safe package handoff` |
| Route Evolution Needed | MULTIPLE_SPLIT: preserve staged export route sequence and add explicit approval decision room. |
| Screen Split Decision | `MULTIPLE_SPLIT` |
| Safety Gates | Export preview not approval; export approval not download/share; AI draft/internal rationale/compliance notes forbidden. |
| Tests / Proof Required | file-export-realism, export forbidden-payload negative, route-smoke, audit proof |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Advisor creates export request from released decision/evidence context.
2. User scopes content and sees forbidden internal payload warnings.
3. Redaction surface shows what will be hidden.
4. Preview remains preview-only and cannot download.
5. Approval decision room verifies scope, redaction, release and audit.
6. Download/share happens only after approval.

### FLOW-006 — Governance / RBAC / admin non-bypass

| Field | Required Content |
|---|---|
| Primary Actor | Security / Governance Admin |
| Current Flow Problem | Governance/admin surfaces risk looking like broad power panels unless navigation and page jobs distinguish configuration, access request, audit and non-bypass constraints. |
| Current Route Cluster | `007-012, 048-051, 009-010` |
| Target Route / Surface Architecture | Start: `/governance/users or /admin/roles` → Hub: `/governance hub` → Queue: `/governance/access-requests` → Workbench: `/governance/access-requests/:id` → Detail: `/governance/audit/:id and /governance/roles/:id` → Decision Room: `Second confirmation / access approval decision` → Client Projection: `None client-facing` |
| Route Evolution Needed | MULTIPLE_SPLIT_PLUS_MERGE: consolidate governance context from admin roles/security and governance/audit routes into one safety-first workflow. |
| Screen Split Decision | `MULTIPLE_SPLIT_PLUS_MERGE` |
| Safety Gates | Admin cannot bypass advice, evidence, compliance release, visibility or export gates; route access != payload visibility. |
| Tests / Proof Required | permission-engine, denied audit, admin non-bypass negative, route-smoke |
| Task-Pack Readiness | `READY_AFTER_BASELINE_RECHECK` |

**Target Flow Narrative:**

1. Security admin enters governance hub with pending access/risk states.
2. Admin opens access request queue and details.
3. System explains what access can and cannot change.
4. Admin approves/denies scoped governance action with second confirmation where needed.
5. Audit proves denial or approval; safety gates remain unchanged.

### FLOW-007 — KYC / Source-of-Wealth / Suitability / IPS

| Field | Required Content |
|---|---|
| Primary Actor | Analyst → Advisor → Compliance |
| Current Flow Problem | Former hold routes are now MVP-approved but highly safety-sensitive. They cannot simply appear as extra pages; they need a coherent review-to-mandate flow with clear gates. |
| Current Route Cluster | `064-067` |
| Target Route / Surface Architecture | Start: `/kyc/:id/review` → Hub: `/kyc or /suitability hub` → Queue: `/kyc/reviews` → Workbench: `/kyc/:id/review` → Detail: `/kyc/:id/source-of-wealth + /suitability/:tenantId/profile` → Decision Room: `/ips/:tenantId/decision-room` → Client Projection: `Client-safe request/summary only if released` |
| Route Evolution Needed | MULTIPLE_SPLIT: KYC review queue, KYC detail, SoW review detail, suitability profile, IPS decision room. |
| Screen Split Decision | `MULTIPLE_SPLIT` |
| Safety Gates | Advice boundary, suitability, client visibility and evidence safety critical; no client leak of internal risk notes. |
| Tests / Proof Required | RBAC, no-leakage, workflow-gate, evidence sufficiency, route-smoke for elevated routes |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Analyst opens KYC review queue and sees blocked/sufficiency states.
2. Analyst reviews KYC/AML evidence and SoW concerns.
3. Advisor reviews suitability profile and IPS/mandate context.
4. Decision room determines whether advisory workflow may proceed or remains blocked.
5. Client sees only safe requests or released summaries, never internal risk rationale unless released/redacted.

### FLOW-008 — Committee Review

| Field | Required Content |
|---|---|
| Primary Actor | Committee Member / Chair / Compliance |
| Current Flow Problem | Committee queue/detail/vote/dissent/evidence are separate mental jobs. A simple page cannot safely carry vote, dissent, evidence and release implications. |
| Current Route Cluster | `070-071` |
| Target Route / Surface Architecture | Start: `/committee/reviews` → Hub: `/committee hub` → Queue: `/committee/reviews` → Workbench: `/committee/reviews/:id` → Detail: `/committee/reviews/:id/evidence` → Decision Room: `/committee/reviews/:id/decision-room or /vote` → Client Projection: `None until compliance release` |
| Route Evolution Needed | MULTIPLE_SPLIT: committee queue, detail/decision room, evidence/dissent/vote surfaces. |
| Screen Split Decision | `MULTIPLE_SPLIT` |
| Safety Gates | Committee cannot bypass advisor approval, compliance release, evidence sufficiency or audit. |
| Tests / Proof Required | committee route tests, audit persistence, workflow-gate, no-client-release negative |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Committee member opens queue of recommendations needing committee review.
2. Member opens detail/decision room with evidence, risk, dissent history and decision consequences.
3. Vote/dissent is recorded as internal governance action.
4. Compliance later uses committee outcome as one input, not an automatic release.

### FLOW-009 — Review Monitoring / Rebalance

| Field | Required Content |
|---|---|
| Primary Actor | Operations / Analyst / Advisor |
| Current Flow Problem | Review calendar and rebalance monitoring were P1/Hold but are now MVP-approved. They must be integrated without implying automated advice execution. |
| Current Route Cluster | `068-069` |
| Target Route / Surface Architecture | Start: `/reviews/calendar or /monitoring/rebalance` → Hub: `/reviews hub` → Queue: `/reviews/calendar due queue` → Workbench: `/monitoring/rebalance` → Detail: `/monitoring/rebalance/:id/review` → Decision Room: `Internal review decision room only if needed` → Client Projection: `None unless later released through advisory/compliance flow` |
| Route Evolution Needed | ROUTE_CREATE_HUB + ROUTE_CREATE_DECISION_ROOM for internal review; keep client release outside monitoring flow. |
| Screen Split Decision | `SIMPLE_SPLIT to MULTIPLE_SPLIT depending on baseline` |
| Safety Gates | Monitoring is not advice execution; no automatic client release. |
| Tests / Proof Required | review-monitoring-service, noClientRelease negative, route-smoke |
| Task-Pack Readiness | `READY_AFTER_BASELINE_RECHECK_AND_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Operations/Analyst enters review rhythm hub.
2. Due/overdue reviews are queued.
3. Analyst opens rebalance monitoring review and creates/updates internal trigger.
4. If advice is needed, flow moves into advisory review, not client advice.

### FLOW-010 — Client Portal / Client Projection

| Field | Required Content |
|---|---|
| Primary Actor | Client / Principal / Family Office User |
| Current Flow Problem | Client-facing and internal context risk mixing if portal/mobile reuse internal work surfaces. The target UX needs explicit client-safe projection surfaces. |
| Current Route Cluster | `019-020, 027-028, 043-045, 054-058` |
| Target Route / Surface Architecture | Start: `/portal or /mobile` → Hub: `/client home` → Queue: `/client/evidence-requests` → Workbench: `Evidence upload or released decision review` → Detail: `/client/decisions/:id or /client/releases/:id` → Decision Room: `Client does not make internal approval decisions` → Client Projection: `/client/releases + /client/evidence-requests` |
| Route Evolution Needed | CREATE_CLIENT_PROJECTION_CANDIDATE: separate client releases, evidence requests, decision summary and uploaded evidence status surfaces. |
| Screen Split Decision | `MULTIPLE_SPLIT with client projection separation` |
| Safety Gates | Client-safe released/redacted only; fail-closed hidden state when no released content exists. |
| Tests / Proof Required | client no-leakage, RBAC, document upload, route-smoke |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Client enters client-safe home and sees released items or evidence requests only.
2. Client opens an evidence request and uploads document with upload-only confirmation.
3. Client opens released decision summary after compliance release.
4. Client never sees AI draft, internal rationale, compliance notes or unreleased evidence.

### FLOW-011 — Communication / Call Trigger

| Field | Required Content |
|---|---|
| Primary Actor | Advisor / Client Success / Analyst |
| Current Flow Problem | Communication and call trigger can be valuable MVP context but must not become uncontrolled advice or duplicate advisory workflow. |
| Current Route Cluster | `052-053` |
| Target Route / Surface Architecture | Start: `/communication` → Hub: `/communication hub` → Queue: `/communication/call-trigger` → Workbench: `/communication/:id/context` → Detail: `Message/call context drawer or route` → Decision Room: `No advice/release decision inside communication` → Client Projection: `Potential client-safe message only after release rules` |
| Route Evolution Needed | ROUTE_CREATE_HUB with communication context detail; deprecate from main nav unless role-flow relevant. |
| Screen Split Decision | `SIMPLE_SPLIT plus drawer extraction` |
| Safety Gates | No unapproved advice through communication; client-visible copy release-controlled. |
| Tests / Proof Required | RBAC, no-unapproved-advice, route-smoke |
| Task-Pack Readiness | `READY_AFTER_SAFETY_RECHECK` |

**Target Flow Narrative:**

1. Advisor/client success sees communication hub with calls/messages needing context.
2. User opens call trigger matrix and creates/links internal context.
3. If a recommendation/advice action is needed, flow routes to advisory review.
4. Client-visible output requires normal release/redaction path.

### FLOW-012 — Operations Queues / SLA

| Field | Required Content |
|---|---|
| Primary Actor | Operations / Client Success |
| Current Flow Problem | Ops/SLA was P1 and needs MVP integration only as workflow recovery/support, not as a parallel authority to release or approve advice. |
| Current Route Cluster | `059-060` |
| Target Route / Surface Architecture | Start: `/ops/queues` → Hub: `/ops hub` → Queue: `/ops/queues` → Workbench: `/ops/sla/:id` → Detail: `SLA/escalation detail` → Decision Room: `Operational escalation, not advisory release` → Client Projection: `None client-facing by default` |
| Route Evolution Needed | ROUTE_CREATE_QUEUE + detail; possible merge with data-quality/review rhythm context if duplication exists. |
| Screen Split Decision | `SIMPLE_SPLIT or MULTIPLE_SPLIT_PLUS_MERGE if ops/review/data-quality duplicate work` |
| Safety Gates | Ops cannot bypass advice/compliance/evidence/export gates. |
| Tests / Proof Required | route-smoke, permission-engine, workflow state tests |
| Task-Pack Readiness | `READY_AFTER_BASELINE_RECHECK` |

**Target Flow Narrative:**

1. Ops user enters operations hub.
2. Queue shows blocked, overdue or handoff items.
3. Ops opens SLA/escalation detail and routes work to the responsible actor.
4. Advisory/compliance gates remain owned by advisor/compliance.

## 9. P1 / Hold Integration into MVP Flows

| Route ID | Path | Former Scope | Integrated Flow(s) | New MVP Role | Required Safety Recheck | Target Surface Type | Flow Decision |
|---|---|---|---|---|---|---|---|
| 052 | /communication | P1_AFTER_MVP | FLOW-011, FLOW-001 | Communication context hub for client/advisor interactions | No unapproved advice; RBAC message visibility | Hub / context workbench | Elevate as MVP-supporting communication context, not advice surface. |
| 053 | /communication/call-trigger | P1_AFTER_MVP | FLOW-011 | Call trigger matrix for workflow context | No advice/release from call trigger | Queue / workbench | Elevate as controlled trigger context. |
| 059 | /ops/queues | P1_AFTER_MVP | FLOW-012 | Operations recovery and escalation queue | Ops non-bypass | Ops queue | Elevate as support flow for blocked work and recovery. |
| 060 | /ops/sla | P1_AFTER_MVP | FLOW-012 | SLA/escalation detail | Ops cannot release/approve advice | Detail / escalation workbench | Elevate as operational detail. |
| 068 | /reviews/calendar | P1_AFTER_MVP | FLOW-009 | Review rhythm hub/calendar | Monitoring not advice execution | Review hub / queue | Elevate as internal review rhythm. |
| 064 | /kyc/:id/review | HOLD_PENDING_DECISION | FLOW-007 | KYC/AML review workbench | KYC evidence/client visibility/RBAC | KYC detail/workbench | Elevate after safety recheck. |
| 065 | /kyc/:id/source-of-wealth | HOLD_PENDING_DECISION | FLOW-007 | Source-of-wealth review decision input | Sensitive risk notes internal unless released | SoW detail / decision input | Elevate after safety recheck. |
| 066 | /suitability/:tenantId/profile | HOLD_PENDING_DECISION | FLOW-007 | Suitability review surface | Advice boundary critical | Suitability detail | Elevate after advice-boundary recheck. |
| 067 | /ips/:tenantId | HOLD_PENDING_DECISION | FLOW-007 | IPS/mandate decision room | Advice mandate and release safety | Decision room | Elevate after safety recheck. |
| 069 | /monitoring/rebalance | HOLD_PENDING_DECISION | FLOW-009 | Internal rebalance monitoring review | No automatic advice or client release | Internal review workbench | Elevate as internal review flow. |
| 070 | /committee/reviews | HOLD_PENDING_DECISION | FLOW-008 | Committee review queue | Committee non-bypass | Committee queue | Elevate as governed review queue. |
| 071 | /committee/reviews/:id | HOLD_PENDING_DECISION | FLOW-008 | Committee detail/decision room | Vote/dissent audit; no release bypass | Decision room/detail | Elevate after committee safety proof. |

## 10. Screen Split Decisions by Flow

| Flow / Area | Source Route(s) | Alternatives Considered | Chosen Split Option | Reason | New Surfaces | Merge Candidate? | Safety Caveat | Proof Required |
|---|---|---|---|---|---|---|---|---|
| New Family Office onboarding to first client-safe decision | `001-020, 027-045, 048-051` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT_PLUS_MERGE` | The current route set demonstrates the whole product spine but feels like a route catalogue: auth, tenant setup, client context, evidence, workbench, advisor approval, compliance and client visibility are present as pages, not as one guided operating journey. | /family-office or /workspace hub; /advisory/review-queue; /advisory/workbench; /workbench/triggers/:id + /decisions/:id; /compliance/:id/release + /decisions/:id/decision-room; /client/releases or /client/decisions/:id | Yes | AI Draft internal-only; advisor approval not release; compliance release required; client projection fail-closed. | route-smoke, full journey Playwright, permission-engine, workflow-gate, client no-leakage negative tests |
| Evidence missing → client upload → review → release | `027-030, 038-041, 046-047, 019-020` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT` | Upload, document list, extraction review, verification pending and evidence sufficiency are too easy to confuse. Upload success currently risks being read as evidence sufficiency if the flow is not staged. | /evidence or /documents hub; /documents/verification-pending; /documents/extraction-review; /evidence/:id/review; /compliance/:id/decision-room; /client/evidence-requests and /client/releases | Conditional | Upload success is not evidence sufficiency; raw evidence/internal notes hidden from client; audit required for request/review/release. | document-upload-api, document-upload-flow, evidence negative, workflow-gate, client no-leakage |
| AI draft rejected and rebuilt with evidence | `033-037, 027-030, 046-047` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT_PLUS_MERGE` | AI/rules draft, analyst review, evidence linkage and advisor handoff are currently spread across signal/workbench/approval surfaces without enough journey status clarity. | /advisory hub; /advisory/review-queue; /advisory/workbench; /workbench/triggers/:id; /advisor-approval/:id after rebuild; None until compliance release | Yes | AI Draft internal-only; unsupported claims cannot move to client projection; no unapproved advice. | workflow-gate, no-unapproved-advice, AI draft redaction negative, route-smoke |
| Advisor approval → compliance release | `036-042, 043-045, 019-020` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `SIMPLE_SPLIT with Decision Room for release/block` | Advisor approval and compliance release are separate safety gates but can appear as one linear approval if CTA copy and page structure are weak. | /advisory or /approval hub; /advisor-approval queue; /advisor-approval/:id; /decisions/:id; /compliance/:id/release or /compliance/:id/block decision room; /client/decisions/:id after release | Conditional | Advisor approval != compliance release; compliance release != client acceptance; audit required. | workflow-gate, permission-engine, advisor-not-release negative, compliance release positive/negative |
| Export package with forbidden internal payload redaction | `054-058` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT` | Export scope, redaction, preview, approval and download/share are semantically distinct but can be misunderstood as one export action. | /export hub; /export requests queue; /export/:id/scope; /export/:id/redaction and /export/:id/preview; /export/:id/approval; /export/:id/download or client-safe package handoff | Conditional | Export preview not approval; export approval not download/share; AI draft/internal rationale/compliance notes forbidden. | file-export-realism, export forbidden-payload negative, route-smoke, audit proof |
| Governance / RBAC / admin non-bypass | `007-012, 048-051, 009-010` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT_PLUS_MERGE` | Governance/admin surfaces risk looking like broad power panels unless navigation and page jobs distinguish configuration, access request, audit and non-bypass constraints. | /governance hub; /governance/access-requests; /governance/access-requests/:id; /governance/audit/:id and /governance/roles/:id; Second confirmation / access approval decision; None client-facing | Yes | Admin cannot bypass advice, evidence, compliance release, visibility or export gates; route access != payload visibility. | permission-engine, denied audit, admin non-bypass negative, route-smoke |
| KYC / Source-of-Wealth / Suitability / IPS | `064-067` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT` | Former hold routes are now MVP-approved but highly safety-sensitive. They cannot simply appear as extra pages; they need a coherent review-to-mandate flow with clear gates. | /kyc or /suitability hub; /kyc/reviews; /kyc/:id/review; /kyc/:id/source-of-wealth + /suitability/:tenantId/profile; /ips/:tenantId/decision-room; Client-safe request/summary only if released | Conditional | Advice boundary, suitability, client visibility and evidence safety critical; no client leak of internal risk notes. | RBAC, no-leakage, workflow-gate, evidence sufficiency, route-smoke for elevated routes |
| Committee Review | `070-071` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT` | Committee queue/detail/vote/dissent/evidence are separate mental jobs. A simple page cannot safely carry vote, dissent, evidence and release implications. | /committee hub; /committee/reviews; /committee/reviews/:id; /committee/reviews/:id/evidence; /committee/reviews/:id/decision-room or /vote; None until compliance release | Conditional | Committee cannot bypass advisor approval, compliance release, evidence sufficiency or audit. | committee route tests, audit persistence, workflow-gate, no-client-release negative |
| Review Monitoring / Rebalance | `068-069` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `SIMPLE_SPLIT to MULTIPLE_SPLIT depending on baseline` | Review calendar and rebalance monitoring were P1/Hold but are now MVP-approved. They must be integrated without implying automated advice execution. | /reviews hub; /reviews/calendar due queue; /monitoring/rebalance; /monitoring/rebalance/:id/review; Internal review decision room only if needed; None unless later released through advisory/compliance flow | Conditional | Monitoring is not advice execution; no automatic client release. | review-monitoring-service, noClientRelease negative, route-smoke |
| Client Portal / Client Projection | `019-020, 027-028, 043-045, 054-058` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `MULTIPLE_SPLIT with client projection separation` | Client-facing and internal context risk mixing if portal/mobile reuse internal work surfaces. The target UX needs explicit client-safe projection surfaces. | /client home; /client/evidence-requests; Evidence upload or released decision review; /client/decisions/:id or /client/releases/:id; Client does not make internal approval decisions; /client/releases + /client/evidence-requests | Conditional | Client-safe released/redacted only; fail-closed hidden state when no released content exists. | client no-leakage, RBAC, document upload, route-smoke |
| Communication / Call Trigger | `052-053` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `SIMPLE_SPLIT plus drawer extraction` | Communication and call trigger can be valuable MVP context but must not become uncontrolled advice or duplicate advisory workflow. | /communication hub; /communication/call-trigger; /communication/:id/context; Message/call context drawer or route; No advice/release decision inside communication; Potential client-safe message only after release rules | Conditional | No unapproved advice through communication; client-visible copy release-controlled. | RBAC, no-unapproved-advice, route-smoke |
| Operations Queues / SLA | `059-060` | NO_SPLIT_REFINE_IN_PLACE; SIMPLE_SPLIT; MULTIPLE_SPLIT; MULTIPLE_SPLIT_PLUS_MERGE; DRAWER_EXTRACTION; DRAWER_TO_ROUTE_PROMOTION; ROUTE_TO_DRAWER_DEMOTION | `SIMPLE_SPLIT or MULTIPLE_SPLIT_PLUS_MERGE if ops/review/data-quality duplicate work` | Ops/SLA was P1 and needs MVP integration only as workflow recovery/support, not as a parallel authority to release or approve advice. | /ops hub; /ops/queues; /ops/sla/:id; SLA/escalation detail; Operational escalation, not advisory release; None client-facing by default | Yes | Ops cannot bypass advice/compliance/evidence/export gates. | route-smoke, permission-engine, workflow state tests |

## 11. Route Evolution Records Referenced / Finalized for Planning

| Route Evolution ID | Flow ID | Current Route(s) | Proposed Route(s) / Surface(s) | Evolution Type | UX Reason | Safety Caveat | Tests Required | Task-Pack Readiness |
|---|---|---|---|---|---|---|---|---|
| UX-ROUTE-EVO-001 | FLOW-003 | /signals; /workbench; /workbench/triggers/:id | /advisory; /advisory/review-queue; /advisory/triggers/:id/review | MULTIPLE_SPLIT_PLUS_MERGE | Turns signal/workbench into a guided analyst review journey. | AI draft internal-only; no client release. | route-smoke; workflow-gate; no-unapproved-advice | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-002 | FLOW-004 | /advisor-approval; /advisor-approval/:id | /advisor/reviews; /advisor/reviews/:id | ROUTE_CREATE_QUEUE + DETAIL | Separates queue from advisor decision context. | Advisor approval is not compliance release. | workflow-gate; advisor-not-release negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-003 | FLOW-004 | /compliance; /compliance/:id/review; /compliance/:id/release; /compliance/:id/block | /compliance; /compliance/reviews/:id; /compliance/reviews/:id/decision-room | ROUTE_CREATE_DECISION_ROOM | Creates safety-focused compliance release/block surface. | Release/block require evidence and audit. | workflow-gate; audit; compliance negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-004 | FLOW-002 | /documents; /documents/upload; /documents/extraction-review; /documents/verification-pending | /documents; /documents/upload; /documents/review-queue; /documents/:id/review | MULTIPLE_SPLIT | Clarifies upload vs review vs verification. | Upload-only, not sufficiency. | document-upload-api; document-upload-flow; evidence negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-005 | FLOW-002 | /evidence; /evidence/:id | /evidence; /evidence/:id/review; /evidence/:id/links | ROUTE_CREATE_DETAIL | Gives evidence sufficiency and linkage a page job. | Evidence visibility fail-closed. | evidence; RBAC; no-leakage | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-006 | FLOW-010 | /portal; /mobile | /client/home; /client/releases; /client/evidence-requests; /client/decisions/:id | ROUTE_CREATE_CLIENT_PROJECTION | Separates client-safe projection from internal surfaces. | Client-safe released/redacted only. | client no-leakage; RBAC negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-007 | FLOW-005 | /export/new; /export/:id/scope; /export/:id/redaction; /export/:id/preview; /export/:id/download | /export; /export/:id/scope; /export/:id/redaction; /export/:id/preview; /export/:id/approval; /export/:id/download | MULTIPLE_SPLIT | Adds explicit approval step to export journey. | Preview not approval/download. | file-export-realism; export negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-008 | FLOW-006 | /governance/users; /governance/roles; /governance/access-requests; /governance/audit-history | /governance; /governance/access-requests/:id; /governance/roles/:id; /governance/audit/:id | MULTIPLE_SPLIT_PLUS_MERGE | Unifies governance into safety-first hub/detail. | Admin non-bypass. | permission-engine; denied audit | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-009 | FLOW-006 | /admin/platform; /admin/policies/advice-boundary; /admin/roles; /admin/security | /platform; /platform/policies; /platform/security | ROUTE_CREATE_HUB | Separates platform policy/security setup from advisory gates. | Policy display not enforcement proof. | permission-engine; audit | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-010 | FLOW-001 | /admin/tenants; /tenants/new; /tenants/:id/setup; /tenants/:id/team; /tenants/:id/users; /tenants/:id/policies | /tenants; /tenants/:id/setup; /tenants/:id/team; /tenants/:id/users; /tenants/:id/policies | SIMPLE_SPLIT_TO_MULTIPLE | Makes tenant setup a guided support flow. | Tenant/object scope required. | route-smoke; RBAC tenant scope | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-011 | FLOW-007 | /kyc/:id/review; /kyc/:id/source-of-wealth | /kyc/reviews; /kyc/:id/review; /kyc/:id/source-of-wealth/decision-room | MULTIPLE_SPLIT | Elevates KYC/SoW into governed MVP review flow. | KYC risk notes client-hidden unless released. | RBAC; no-leakage; evidence proof | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-012 | FLOW-007 | /suitability/:tenantId/profile; /ips/:tenantId | /suitability/:tenantId/review; /ips/:tenantId/decision-room | ROUTE_CREATE_DECISION_ROOM | Makes suitability/IPS a safety-critical decision surface. | Advice boundary critical. | workflow-gate; no-unapproved-advice | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-013 | FLOW-008 | /committee/reviews; /committee/reviews/:id | /committee/reviews; /committee/reviews/:id/decision-room; /committee/reviews/:id/vote | MULTIPLE_SPLIT | Separates queue/detail/vote/dissent/evidence. | Committee cannot bypass compliance. | committee tests; audit; workflow-gate | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-014 | FLOW-009 | /reviews/calendar | /reviews; /reviews/calendar; /reviews/:id | ROUTE_CREATE_HUB | Review calendar becomes internal review rhythm hub. | Monitoring not advice. | review-monitoring; route-smoke | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-015 | FLOW-009 | /monitoring/rebalance | /monitoring/rebalance; /monitoring/rebalance/:id/review | ROUTE_CREATE_DECISION_ROOM | Rebalance monitoring gets internal review detail, not automatic action. | No auto advice/client release. | review-monitoring; noClientRelease negative | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-016 | FLOW-011 | /communication; /communication/call-trigger | /communication; /communication/call-trigger; /communication/:id/context | ROUTE_CREATE_HUB | Communication becomes context intake, not advice route. | No unapproved advice. | RBAC; no-advice leakage | READY_AFTER_SAFETY_RECHECK |
| UX-ROUTE-EVO-017 | FLOW-012 | /ops/queues; /ops/sla | /ops; /ops/queues; /ops/sla/:id | ROUTE_CREATE_QUEUE | Ops becomes recovery/support queue with escalation detail. | Ops non-bypass. | permission-engine; workflow state | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-018 | FLOW-001 | /client/profile; /client/family-members; /relationships; /entities; /entities/:id | /client/context; /family-members/:id; /entities/:id; /relationships | ROUTE_CREATE_DETAIL | Object context supports family/entity decisions without overloading portal. | Tenant and object-scoped visibility. | RBAC/object visibility | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-019 | FLOW-001 | /wealth-map; /actions | /wealth; /actions; /actions/:id | SIMPLE_SPLIT | Separates wealth context from action queue. | No implied advice execution. | workflow state; RBAC | READY_AFTER_BASELINE_RECHECK |
| UX-ROUTE-EVO-020 | FLOW-006 | /governance/audit-history; /compliance/:id/audit | /audit; /audit/:id; contextual audit drawers | MULTIPLE_SPLIT_PLUS_MERGE | Audit should be shared proof spine with context-specific entry points. | Audit display not persistence proof. | audit persistence; route-smoke | READY_AFTER_SAFETY_RECHECK |

## 12. Safety Gates by Flow

| Flow ID | Safety Gate | Where It Appears In Flow | User-Facing Meaning | Required Guardrail | Required Test |
|---|---|---|---|---|---|
| FLOW-001 | AI Draft internal-only | Analyst/advisory workbench | Draft is an internal preparation state only. | Hide/redact AI draft from client/export. | AI draft no-leakage negative |
| FLOW-001 | Client-safe released/redacted only | Client projection surfaces | Client sees only released client-safe content. | Fail closed when release/redaction proof incomplete. | client visibility no-leakage |
| FLOW-001 | Advisor approval != Compliance Release | Advisor review and compliance decision room | Advisor sends to compliance; does not release. | Separate statuses and CTA copy. | advisor-not-release negative |
| FLOW-001 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-002 | Client-safe released/redacted only | Client projection surfaces | Client sees only released client-safe content. | Fail closed when release/redaction proof incomplete. | client visibility no-leakage |
| FLOW-002 | Upload success != Evidence Sufficiency | Client upload and evidence review | Upload confirms transfer only. | Evidence review/link/scope required. | upload-not-sufficiency negative |
| FLOW-002 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-003 | AI Draft internal-only | Analyst/advisory workbench | Draft is an internal preparation state only. | Hide/redact AI draft from client/export. | AI draft no-leakage negative |
| FLOW-003 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-004 | Advisor approval != Compliance Release | Advisor review and compliance decision room | Advisor sends to compliance; does not release. | Separate statuses and CTA copy. | advisor-not-release negative |
| FLOW-004 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-005 | Export preview != Approval/Download | Export preview/approval/download sequence | Preview does not authorize package. | Approval and redaction required before download. | export preview negative |
| FLOW-005 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-006 | Admin/Ops non-bypass | Governance/ops actions | Admin/ops cannot force gates. | Deny bypass and audit attempt. | permission-engine negative |
| FLOW-006 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-007 | No automatic client advice/release | KYC/committee/rebalance review | Review produces internal control input, not client advice. | Route into advisory/compliance gates. | workflow no-client-release negative |
| FLOW-007 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-008 | No automatic client advice/release | KYC/committee/rebalance review | Review produces internal control input, not client advice. | Route into advisory/compliance gates. | workflow no-client-release negative |
| FLOW-008 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-009 | No automatic client advice/release | KYC/committee/rebalance review | Review produces internal control input, not client advice. | Route into advisory/compliance gates. | workflow no-client-release negative |
| FLOW-009 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-010 | Client-safe released/redacted only | Client projection surfaces | Client sees only released client-safe content. | Fail closed when release/redaction proof incomplete. | client visibility no-leakage |
| FLOW-010 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-011 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |
| FLOW-012 | Admin/Ops non-bypass | Governance/ops actions | Admin/ops cannot force gates. | Deny bypass and audit attempt. | permission-engine negative |
| FLOW-012 | Audit required for gate actions | Decision, release, block, approval, export and access actions | Critical gate action is traceable. | Audit persistence or fail-closed state. | audit persistence / failure tests |

## 13. State / Blocker / Recovery Model by Flow

| Flow ID | State / Blocker | Cause | User Sees | Recovery / Next Step | Safety Caveat |
|---|---|---|---|---|---|
| FLOW-001 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-001 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-001 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-001 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-001 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-001 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-001 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-001 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-001 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-001 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-001 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-001 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-001 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-001 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-002 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-002 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-002 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-002 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-002 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-002 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-002 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-002 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-002 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-002 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-002 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-002 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-002 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-002 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-003 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-003 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-003 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-003 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-003 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-003 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-003 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-003 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-003 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-003 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-003 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-003 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-003 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-003 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-004 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-004 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-004 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-004 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-004 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-004 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-004 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-004 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-004 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-004 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-004 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-004 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-004 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-004 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-005 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-005 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-005 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-005 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-005 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-005 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-005 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-005 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-005 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-005 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-005 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-005 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-005 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-005 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-006 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-006 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-006 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-006 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-006 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-006 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-006 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-006 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-006 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-006 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-006 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-006 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-006 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-006 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-007 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-007 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-007 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-007 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-007 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-007 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-007 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-007 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-007 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-007 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-007 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-007 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-007 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-007 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-008 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-008 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-008 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-008 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-008 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-008 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-008 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-008 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-008 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-008 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-008 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-008 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-008 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-008 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-009 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-009 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-009 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-009 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-009 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-009 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-009 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-009 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-009 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-009 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-009 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-009 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-009 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-009 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-010 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-010 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-010 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-010 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-010 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-010 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-010 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-010 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-010 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-010 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-010 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-010 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-010 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-010 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-011 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-011 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-011 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-011 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-011 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-011 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-011 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-011 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-011 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-011 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-011 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-011 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-011 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-011 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |
| FLOW-012 | loading | Data or action pending | Progress state with no premature success | Wait / cancel where safe | No silent state advancement |
| FLOW-012 | empty | No queue/item/released content | Empty state with next best action | Create/request/retry/open relevant hub | Client empty state hides internal content |
| FLOW-012 | permission denied | Actor lacks role/object/payload permission | Denied state with reason category | Request access or switch context | Route access != payload visibility |
| FLOW-012 | evidence missing | Evidence required for gate | Needs evidence explanation | Request/upload/link evidence | Upload not sufficiency |
| FLOW-012 | evidence review pending | Evidence uploaded but not reviewed | Pending review state | Review extraction/link evidence | No release until sufficiency |
| FLOW-012 | advisor approval pending | Advisor gate not done | Pending advisor review | Open advisor review or notify owner | Advisor approval not release |
| FLOW-012 | compliance blocked | Compliance blocked release | Block reason + evidence/request path | Request evidence or correct issue | Client release fail-closed |
| FLOW-012 | release pending | Release conditions not complete | Pending gate state | Complete evidence/advisor/compliance/audit | No client projection yet |
| FLOW-012 | export redaction pending | Export redaction/scope incomplete | Redaction required state | Review redaction/scope | Preview not approval |
| FLOW-012 | audit unavailable | Audit write/read unavailable | Fail-closed / action pending | Retry or escalate | No silent gate completion |
| FLOW-012 | client visibility hidden | No released client-safe payload | No released content available | Complete release process | No internal leakage |
| FLOW-012 | upload failed | File/API validation failure | Failure + retry/reselect | Retry upload / fix file | No evidence status change |
| FLOW-012 | validation failed | Required fields/preconditions missing | Inline errors and blocked CTA | Correct fields/preconditions | No downstream gate success |
| FLOW-012 | success without overclaim | Action completed, not downstream gates | Specific success message | Move to next gate | No false release/sufficiency/acceptance |

## 14. CTA / Next-Step Model by Flow

| Flow ID | Step | Surface Type | User Question | Primary CTA | Secondary CTA | Disabled / Blocked CTA | Next Step | Success Feedback | Error / Recovery | Safety Caveat |
|---|---|---|---|---|---|---|---|---|---|---|
| FLOW-001 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-001 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-001 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-001 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-001 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-002 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-002 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-002 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-002 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-002 | Projection | Client Projection | What can the client safely see/do? | Upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-003 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-003 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-003 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-003 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-003 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-004 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-004 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-004 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-004 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-004 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-005 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-005 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-005 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-005 | Decision | Decision Room | Can this safely proceed? | Approve export package | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-005 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-006 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-006 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-006 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-006 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-006 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-007 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-007 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-007 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-007 | Decision | Decision Room | Can this safely proceed? | Mark KYC/Suitability gate reviewed or block advisory progression | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-007 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-008 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-008 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-008 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-008 | Decision | Decision Room | Can this safely proceed? | Record committee vote / dissent | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-008 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-009 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-009 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-009 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-009 | Decision | Decision Room | Can this safely proceed? | Create internal review trigger | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-009 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-010 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-010 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-010 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-010 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-010 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-011 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-011 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-011 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-011 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-011 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |
| FLOW-012 | Entry | Hub | Where should I start? | Open priority queue | View context / switch tenant | Disabled when no scoped work | Queue | Workspace loaded | Retry / refresh | Role-aware visibility |
| FLOW-012 | Select work | Queue | What needs attention first? | Open item | Filter / assign | Blocked if no permission | Workbench/detail | Item opened | Return to queue | Object scope required |
| FLOW-012 | Work item | Workbench/Detail | What must I decide or fix? | Continue required review | Attach evidence / view audit | Blocked until required evidence/role exists | Decision room or next gate | Review completed | Save draft / cancel / retry | Safety gate visible |
| FLOW-012 | Decision | Decision Room | Can this safely proceed? | Approve / Release / Block according to role | Request evidence / cancel | Disabled if gate preconditions fail | Next gate or client projection | Specific action complete only | Show reason and recovery | No overclaim |
| FLOW-012 | Projection | Client Projection | What can the client safely see/do? | View released summary or upload requested evidence | Download released item / contact advisor | Hidden if no release | Success or return home | Client-safe action complete | Fail closed to hidden/empty | Released/redacted only |

## 15. Target Route / Surface Architecture Map

| Target Surface | Surface Type | New / Existing / Split / Merged | Supports Flow(s) | Source Route(s) | Proposed Path / Identifier | Safety Level | Navigation Placement | Task-Pack Candidate? |
|---|---|---|---|---|---|---|---|---|
| /family-office | Hub | New | FLOW-001 | access/tenant/advisory/client | Family office operating hub | Medium | Primary role-aware landing | Yes |
| /advisory | Hub | New | FLOW-001,FLOW-003 | 033-037 | Advisory hub | High | Sidebar primary internal | Yes |
| /advisory/review-queue | Queue | New | FLOW-003 | 033,034 | Analyst review queue | High | Advisory hub drilldown | Yes |
| /advisory/triggers/:id/review | Workbench/Detail | Split | FLOW-003 | 035 | Trigger review workbench | High | Queue item detail | Yes |
| /advisor/reviews | Queue | New/Split | FLOW-004 | 036 | Advisor approval queue | High | Advisor workspace | Yes |
| /advisor/reviews/:id | Detail | Split | FLOW-004 | 037 | Advisor review detail | High | Advisor queue detail | Yes |
| /compliance/reviews/:id/decision-room | Decision Room | New/Split | FLOW-002,FLOW-004 | 038-041 | Compliance release/block decision room | Critical | Compliance workspace | Yes |
| /documents/review-queue | Queue | Split | FLOW-002 | 029-030 | Document review queue | High | Evidence hub | Yes |
| /documents/:id/review | Workbench/Detail | New/Split | FLOW-002 | 029 | Document extraction/review detail | High | Document queue detail | Yes |
| /evidence/:id/review | Detail | New | FLOW-002 | 046-047 | Evidence sufficiency review | High | Evidence vault detail | Yes |
| /client/releases | Client Projection | New | FLOW-001,FLOW-010 | 019-020,043-045 | Released client-safe summaries | Critical | Client portal | Yes |
| /client/evidence-requests | Client Projection/Queue | New | FLOW-002,FLOW-010 | 019-020,027-028 | Client evidence requests | Critical | Client portal | Yes |
| /client/decisions/:id | Client Projection Detail | New | FLOW-001,FLOW-010 | 043-045 | Client-safe decision detail | Critical | Client portal | Yes |
| /export/:id/approval | Decision Room | New | FLOW-005 | 054-058 | Export approval decision room | Critical | Export flow | Yes |
| /governance | Hub | New/Merged | FLOW-006 | 048-051,009-010 | Governance safety hub | High | Governance navigation | Yes |
| /kyc/reviews | Queue | New | FLOW-007 | 064-065 | KYC/SoW review queue | Critical | KYC/Suitability workspace | Yes |
| /ips/:tenantId/decision-room | Decision Room | New | FLOW-007 | 066-067 | IPS/suitability decision room | Critical | KYC/Suitability workspace | Yes |
| /committee/reviews/:id/decision-room | Decision Room | New/Split | FLOW-008 | 070-071 | Committee decision room | Critical | Committee workspace | Yes |
| /reviews | Hub | New | FLOW-009 | 068-069 | Review rhythm hub | High | Operations/advisory | Yes |
| /communication/:id/context | Detail/Drawer candidate | New | FLOW-011 | 052-053 | Communication context detail | Medium | Communication hub | Yes |
| /ops | Hub | New | FLOW-012 | 059-060 | Operations hub | Medium | Operations nav | Yes |

## 16. Current vs Target Architecture Delta

| Flow ID | Current Flow Problem | Target Flow Architecture | Route Evolution Needed | Screen Split Needed | Safety Gates | Tests Needed | Task-Pack Readiness |
|---|---|---|---|---|---|---|---|
| FLOW-001 | The current route set demonstrates the whole product spine but feels like a route catalogue: auth, tenant setup, client context, evidence, workbench, advisor approval, compliance and client visibility are present as pages, not as one guided operating journey. | /family-office or /workspace hub → /advisory/review-queue → /advisory/workbench → /workbench/triggers/:id + /decisions/:id → /compliance/:id/release + /decisions/:id/decision-room → /client/releases or /client/decisions/:id | MULTIPLE_SPLIT_PLUS_MERGE across onboarding, tenant setup, advisory, compliance, decisions and client projection. | MULTIPLE_SPLIT_PLUS_MERGE | AI Draft internal-only; advisor approval not release; compliance release required; client projection fail-closed. | route-smoke, full journey Playwright, permission-engine, workflow-gate, client no-leakage negative tests | READY_AFTER_BASELINE_RECHECK |
| FLOW-002 | Upload, document list, extraction review, verification pending and evidence sufficiency are too easy to confuse. Upload success currently risks being read as evidence sufficiency if the flow is not staged. | /evidence or /documents hub → /documents/verification-pending → /documents/extraction-review → /evidence/:id/review → /compliance/:id/decision-room → /client/evidence-requests and /client/releases | MULTIPLE_SPLIT: documents hub, upload surface, extraction workbench, evidence detail/review, compliance decision room, client evidence-request projection. | MULTIPLE_SPLIT | Upload success is not evidence sufficiency; raw evidence/internal notes hidden from client; audit required for request/review/release. | document-upload-api, document-upload-flow, evidence negative, workflow-gate, client no-leakage | READY_AFTER_SAFETY_RECHECK |
| FLOW-003 | AI/rules draft, analyst review, evidence linkage and advisor handoff are currently spread across signal/workbench/approval surfaces without enough journey status clarity. | /advisory hub → /advisory/review-queue → /advisory/workbench → /workbench/triggers/:id → /advisor-approval/:id after rebuild → None until compliance release | MULTIPLE_SPLIT_PLUS_MERGE for /signals, /workbench, /workbench/triggers/:id and advisor approval detail; create advisory hub/review queue and trigger review detail. | MULTIPLE_SPLIT_PLUS_MERGE | AI Draft internal-only; unsupported claims cannot move to client projection; no unapproved advice. | workflow-gate, no-unapproved-advice, AI draft redaction negative, route-smoke | READY_AFTER_BASELINE_RECHECK |
| FLOW-004 | Advisor approval and compliance release are separate safety gates but can appear as one linear approval if CTA copy and page structure are weak. | /advisory or /approval hub → /advisor-approval queue → /advisor-approval/:id → /decisions/:id → /compliance/:id/release or /compliance/:id/block decision room → /client/decisions/:id after release | SIMPLE_SPLIT to MULTIPLE_SPLIT: advisor review queue/detail remains separate from compliance decision room and client projection. | SIMPLE_SPLIT with Decision Room for release/block | Advisor approval != compliance release; compliance release != client acceptance; audit required. | workflow-gate, permission-engine, advisor-not-release negative, compliance release positive/negative | READY_AFTER_SAFETY_RECHECK |
| FLOW-005 | Export scope, redaction, preview, approval and download/share are semantically distinct but can be misunderstood as one export action. | /export hub → /export requests queue → /export/:id/scope → /export/:id/redaction and /export/:id/preview → /export/:id/approval → /export/:id/download or client-safe package handoff | MULTIPLE_SPLIT: preserve staged export route sequence and add explicit approval decision room. | MULTIPLE_SPLIT | Export preview not approval; export approval not download/share; AI draft/internal rationale/compliance notes forbidden. | file-export-realism, export forbidden-payload negative, route-smoke, audit proof | READY_AFTER_SAFETY_RECHECK |
| FLOW-006 | Governance/admin surfaces risk looking like broad power panels unless navigation and page jobs distinguish configuration, access request, audit and non-bypass constraints. | /governance hub → /governance/access-requests → /governance/access-requests/:id → /governance/audit/:id and /governance/roles/:id → Second confirmation / access approval decision → None client-facing | MULTIPLE_SPLIT_PLUS_MERGE: consolidate governance context from admin roles/security and governance/audit routes into one safety-first workflow. | MULTIPLE_SPLIT_PLUS_MERGE | Admin cannot bypass advice, evidence, compliance release, visibility or export gates; route access != payload visibility. | permission-engine, denied audit, admin non-bypass negative, route-smoke | READY_AFTER_BASELINE_RECHECK |
| FLOW-007 | Former hold routes are now MVP-approved but highly safety-sensitive. They cannot simply appear as extra pages; they need a coherent review-to-mandate flow with clear gates. | /kyc or /suitability hub → /kyc/reviews → /kyc/:id/review → /kyc/:id/source-of-wealth + /suitability/:tenantId/profile → /ips/:tenantId/decision-room → Client-safe request/summary only if released | MULTIPLE_SPLIT: KYC review queue, KYC detail, SoW review detail, suitability profile, IPS decision room. | MULTIPLE_SPLIT | Advice boundary, suitability, client visibility and evidence safety critical; no client leak of internal risk notes. | RBAC, no-leakage, workflow-gate, evidence sufficiency, route-smoke for elevated routes | READY_AFTER_SAFETY_RECHECK |
| FLOW-008 | Committee queue/detail/vote/dissent/evidence are separate mental jobs. A simple page cannot safely carry vote, dissent, evidence and release implications. | /committee hub → /committee/reviews → /committee/reviews/:id → /committee/reviews/:id/evidence → /committee/reviews/:id/decision-room or /vote → None until compliance release | MULTIPLE_SPLIT: committee queue, detail/decision room, evidence/dissent/vote surfaces. | MULTIPLE_SPLIT | Committee cannot bypass advisor approval, compliance release, evidence sufficiency or audit. | committee route tests, audit persistence, workflow-gate, no-client-release negative | READY_AFTER_SAFETY_RECHECK |
| FLOW-009 | Review calendar and rebalance monitoring were P1/Hold but are now MVP-approved. They must be integrated without implying automated advice execution. | /reviews hub → /reviews/calendar due queue → /monitoring/rebalance → /monitoring/rebalance/:id/review → Internal review decision room only if needed → None unless later released through advisory/compliance flow | ROUTE_CREATE_HUB + ROUTE_CREATE_DECISION_ROOM for internal review; keep client release outside monitoring flow. | SIMPLE_SPLIT to MULTIPLE_SPLIT depending on baseline | Monitoring is not advice execution; no automatic client release. | review-monitoring-service, noClientRelease negative, route-smoke | READY_AFTER_BASELINE_RECHECK_AND_SAFETY_RECHECK |
| FLOW-010 | Client-facing and internal context risk mixing if portal/mobile reuse internal work surfaces. The target UX needs explicit client-safe projection surfaces. | /client home → /client/evidence-requests → Evidence upload or released decision review → /client/decisions/:id or /client/releases/:id → Client does not make internal approval decisions → /client/releases + /client/evidence-requests | CREATE_CLIENT_PROJECTION_CANDIDATE: separate client releases, evidence requests, decision summary and uploaded evidence status surfaces. | MULTIPLE_SPLIT with client projection separation | Client-safe released/redacted only; fail-closed hidden state when no released content exists. | client no-leakage, RBAC, document upload, route-smoke | READY_AFTER_SAFETY_RECHECK |
| FLOW-011 | Communication and call trigger can be valuable MVP context but must not become uncontrolled advice or duplicate advisory workflow. | /communication hub → /communication/call-trigger → /communication/:id/context → Message/call context drawer or route → No advice/release decision inside communication → Potential client-safe message only after release rules | ROUTE_CREATE_HUB with communication context detail; deprecate from main nav unless role-flow relevant. | SIMPLE_SPLIT plus drawer extraction | No unapproved advice through communication; client-visible copy release-controlled. | RBAC, no-unapproved-advice, route-smoke | READY_AFTER_SAFETY_RECHECK |
| FLOW-012 | Ops/SLA was P1 and needs MVP integration only as workflow recovery/support, not as a parallel authority to release or approve advice. | /ops hub → /ops/queues → /ops/sla/:id → SLA/escalation detail → Operational escalation, not advisory release → None client-facing by default | ROUTE_CREATE_QUEUE + detail; possible merge with data-quality/review rhythm context if duplication exists. | SIMPLE_SPLIT or MULTIPLE_SPLIT_PLUS_MERGE if ops/review/data-quality duplicate work | Ops cannot bypass advice/compliance/evidence/export gates. | route-smoke, permission-engine, workflow state tests | READY_AFTER_BASELINE_RECHECK |

## 17. Task-Pack Readiness Assessment

| Flow ID | Ready for Task Pack? | Missing Before Task Pack | Required Baseline Recheck | Required Safety Recheck | Required Decision Record | Notes |
|---|---:|---|---|---|---|---|
| FLOW-001 | Yes, conditional | current route/component/nav/test baseline | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-010, UX-ROUTE-EVO-018, UX-ROUTE-EVO-019 | Status: `READY_AFTER_BASELINE_RECHECK` |
| FLOW-002 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-004, UX-ROUTE-EVO-005 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-003 | Yes, conditional | current route/component/nav/test baseline | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-001 | Status: `READY_AFTER_BASELINE_RECHECK` |
| FLOW-004 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-002, UX-ROUTE-EVO-003 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-005 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-007 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-006 | Yes, conditional | current route/component/nav/test baseline | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-008, UX-ROUTE-EVO-009, UX-ROUTE-EVO-020 | Status: `READY_AFTER_BASELINE_RECHECK` |
| FLOW-007 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-011, UX-ROUTE-EVO-012 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-008 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-013 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-009 | Yes, conditional | current route/component/nav/test baseline, safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-014, UX-ROUTE-EVO-015 | Status: `READY_AFTER_BASELINE_RECHECK_AND_SAFETY_RECHECK` |
| FLOW-010 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-006 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-011 | Yes, conditional | safety/no-leakage/P0 mapping | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-016 | Status: `READY_AFTER_SAFETY_RECHECK` |
| FLOW-012 | Yes, conditional | current route/component/nav/test baseline | Required | Required for safety-relevant surfaces | UX-ROUTE-EVO-017 | Status: `READY_AFTER_BASELINE_RECHECK` |

## 18. Validation / Proof Requirements

| Proof Type | Purpose | Required For | Example Validation |
|---|---|---|---|
| route-smoke | All existing/new routes resolve | Route evolution and elevated P1/Hold surfaces | Playwright route smoke including new proposed paths after task pack |
| navigation proof | Main nav reflects journey-first IA | Hubs/sidebar/topbar/page header | Screenshot + click path across hub → queue → workbench |
| flow proof | User completes target journey | Priority flows FLOW-001 through FLOW-012 | Playwright E2E flow by actor/role |
| state proof | Loading/error/empty/blocked/success appear | Critical states and decision rooms | State tests / story-like route state assertions |
| RBAC/no-leakage proof | Forbidden payload hidden | Client/internal split, KYC, committee, export | Negative tests for client/guest/admin |
| CTA proof | One primary CTA per state | Hubs, queues, workbenches, decision rooms | Screenshot and text assertions |
| accessibility proof | Focus/keyboard/status semantics | Drawers, modals, forms, decision rooms | Keyboard/ARIA/axe checks where available |
| density proof | Hierarchy and above-the-fold | Page types and critical flows | Screenshot review at target viewport |

Recommended commands, to verify against `package.json`:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm playwright test
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/permission-engine.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
```

If scripts differ, mark `VALIDATION_COMMANDS_REQUIRE_PACKAGE_JSON_CONFIRMATION`.

## 19. Stop Rules

- Stop before task pack if the current `full-workflow` baseline cannot be verified.
- Stop if a new route would expose internal, unreleased, AI-draft, compliance-note or unredacted evidence payloads to the client.
- Stop if a flow treats advisor approval as release, compliance release as client acceptance, upload as evidence sufficiency, or export preview as approval/download.
- Stop if admin/governance/ops flow can bypass advice, evidence, compliance, audit, export or visibility gates.
- Stop if a split removes required evidence/audit/compliance context from a safety-critical decision.
- Stop if former P1/Hold elevation is used without baseline and safety recheck.
- Do not stop merely because the flow needs a new hub, subroute, detail, queue, decision room, client projection, route split, or merge. Those are allowed when recorded and tested.
- Do not create Codex tasks or modify files from this artefact.

## 20. Decision Summary for the User

This plan converts the route-evolution policy into actual user journeys. The target AlphaVest UX is not a prettier route list. It is a guided operating system: users enter through role-aware hubs, select prioritized work in queues, act in workbenches/details, make safety-critical decisions in decision rooms, and clients see only fail-closed, released, redacted projections. Former P1/Hold areas are actively included as MVP flows, but every such elevation still requires moving-baseline and safety recheck before a task pack. The next artefact may create `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`; this artefact itself creates no tasks and authorizes no implementation.

## 21. ENGINE Proof / QA

### 21.1 ENGINE_v3 Phase Proof

| Phase | Applied Here | Proof |
|---|---|---|
| Charter | Sections 1 and 4 define flow-plan mission and no-task boundary. | The artefact shifts from route policy to end-to-end UX flow planning. |
| Evidence | Sections 2–4 use product-owner approvals, moving baseline, route policy matrix and safety artefacts. | Inputs are ordered and constrained. |
| Framing | Sections 5–7 frame flows as actor journey architecture. | The plan does not remain a route list. |
| Divergence | Sections 8–10 apply multiple surface and split options. | Simple, multiple and merge options remain available. |
| Contradictions | Sections 12 and 19 balance route freedom with safety. | New routes are allowed; safety bypass is not. |
| Branch Build | Sections 8–16 build full flow branches, route records and target surfaces. | Each flow has start, work, decision, projection and proof. |
| Debate | Screen split alternatives and readiness statuses require reasons. | No blind maximal split. |
| Adversarial | Stop rules guard against leakage, overclaim, admin bypass and stale baseline. | Common failure modes are blocked. |
| Convergence | Sections 15–17 summarize target architecture and task-pack readiness. | The output leads to a task pack. |
| Proof | Section 18 defines validation model. | Route-smoke, flow, state, RBAC/no-leakage and accessibility proof are required. |
| Learning | Readiness and missing checks capture what must be learned before tasks. | Parallel refactoring is handled as moving baseline. |

### 21.2 ENGINE_v2 Method Proof

| Method | Applied Where | Result |
|---|---|---|
| Psycho-Logic | Flow narratives, state/recovery, CTA model | Users get orientation, status, control and recovery instead of menu ambiguity. |
| Double Diamond | Route policy → flow plan → future task pack | The work converges from governance to concrete journeys before implementation. |
| Reframing Matrix | Route-level decisions are reframed as user paths | A route split is justified by page job and journey continuity, not by aesthetics. |
| TRIZ | Stop/do-not-stop rules | The contradiction between real UX change and safety is resolved. |
| SIT / Closed World | Moving baseline as starting point | Existing routes/components remain base reality, not a prison. |
| Morphological Analysis | Flow surface maps and split options | Hub/queue/workbench/detail/decision/client projection are separable dimensions. |
| SCAMPER | Split, merge, promote, demote, extract route/screen strategies | Monster screens can become coherent journeys. |
| Harvard / Principled Negotiation | UX freedom vs hard safety gates | Negotiable architecture is separated from non-negotiable controls. |
| MESOs | Alternative target architectures per flow | Flows can choose simple split, multiple split, or multiple plus merge. |
| Measurement Plan | Validation and proof matrix | Task pack must be testable before implementation. |
| Ethics & Fairness | Client projection and no-leakage gates | Clients and internal actors see only what they are allowed to see. |

### 21.3 Final QA

| QA Check | Result |
|---|---|
| Target artefact created | PASS |
| Route-level to flow-level shift completed | PASS |
| No Codex tasks created | PASS |
| No implementation authorized | PASS |
| Moving baseline required before task pack | PASS |
| Route Evolution Records referenced/planning-finalized | PASS |
| Former P1/Hold actively integrated into MVP flows | PASS |
| Screen split alternatives applied per flow | PASS |
| Safety gates embedded in flows | PASS |
| Target route/surface architecture mapped | PASS |
| Task-pack readiness assessed | PASS |
| Validation/proof model defined | PASS |