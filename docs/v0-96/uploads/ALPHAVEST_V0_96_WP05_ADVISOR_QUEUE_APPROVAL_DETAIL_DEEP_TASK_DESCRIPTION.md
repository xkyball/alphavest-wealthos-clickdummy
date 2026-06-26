# ALPHAVEST_V0_96_WP05_ADVISOR_QUEUE_APPROVAL_DETAIL_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 06 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-05 — Advisor Queue + Approval Detail`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP05_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_ADVISOR_QUEUE_APPROVAL_DETAIL_AFTER_WP00_REBASE`

`WP-05` turns the advisor approval surfaces into a precise human-review gate in the AlphaVest V0.96 proof spine. The advisor queue and advisor detail must help a senior wealth advisor review a recommendation package, inspect its evidence support and internal rationale, then approve, reject or request changes. The advisor action may move the item to `compliance_pending`, but it must never release content to a client, never create client visibility and never bypass evidence, audit, RBAC or compliance gates.

This is a Codex task-description artefact only. It does **not** implement code, change routes, change schema, create screens, generate images, write tests or create new Codex tickets. It specifies how Codex must later implement/harden the advisor queue/detail work against the current `full-workflow` reality.

The core product rule for this WP is:

```text
Advisor approval is a human review gate. It is not compliance release. It is not client visibility. It is not client acceptance. It is not export approval. After advisor approval, the honest state is: Waiting for compliance release.
```

`WP-05` is P0 because V0.96 cannot credibly claim “human reviewed” unless the advisor approval step is real, role-scoped, audit-backed and visually separated from compliance/client release.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-05 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect actual routes, files, components, APIs, services, schema and tests before edits | Do not infer missing work from old KB counts or from `main` |
| 2 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and implemented WP-00 output | Mandatory predecessor | Moving baseline, current advisor implementation classification, UX/IA delta register | Starting implementation before current repo is classified |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | UX/IA evidence register | Known UI/UX/layout/IA problem families and WP-to-problem mapping | Inventing unsupported UX problems |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-05 goal, likely files, tests, stop rules and UI refactor scope | Treating the task pack as implementation proof |
| 5 | `ALPHAVEST_V0_96_WP01...` and `ALPHAVEST_V0_96_WP02...` | IA and density predecessors | Journey-first navigation, page job/header model, page-type/density rules | Rebuilding global IA/density from scratch inside WP-05 |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Route/scope/state controls | Routes `036–037` are advisor approval MVP routes; state requirements bind UI | Elevating P1/HOLD/reference-only routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback contracts | Approval/reject/request-change lifecycle and no-overclaim feedback | Treating a visible button/modal/status chip as behaviour proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Core safety contract | Route/action/object/payload separation; no unapproved advice; advisor approval not release | Client-visible advice or visibility from advisor action |
| 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Advisor action must respect evidence sufficiency and audit expectations | Approval without evidence/audit where required |
| 10 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | Existing API hardening, schema usage alignment and P0 positive/negative obligations | Claiming existing APIs/schema/tests already prove WP-05 |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey priority source | `MJ-001` first client-safe decision path and `MJ-003` AI draft reviewed by humans | Pulling committee/KYC/suitability/IPS into this WP |
| 12 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | False-gap warning only | Identify stale assumptions | Any target task, absence claim or implementation basis |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-05 Task Implication |
|---|---|---|---|---|---|
| Advisor approval and compliance release must remain separate gates. | MVP Scope Lock; RBAC/Visibility/Advice Boundary Contract; Feedback Contract | `WP-05`, routes `036–037`, `InternalWorkflowScreen` | Gate separation / safety | Critical | Advisor approval can only move to compliance-pending. It must not set client visibility, release status or export readiness. |
| Advisor Approval can look like client release if copy/layout is weak. | Prompt 00 UX/IA Evidence Register; Feedback Contract | Advisor queue/detail; WP-05/WP-12/WP-15 | Microcopy / workflow semantics | Critical | Advisor UI must explicitly say “Waiting for compliance release” after approval and avoid “released”, “client-ready” or “published” language. |
| Long/complex pages include `/advisor-approval/:id` and advisor approval surfaces. | Prompt 00 UX/IA Evidence Register; V0.96 UX source | Advisor detail | Layout / scroll depth | High | Apply summary-first detail layout, decision support area, evidence summary and secondary context tabs/drawers. |
| Many screens have too many equal CTAs or unclear next actions. | UX/IA Evidence Register; CTA evidence | Advisor queue/detail | CTA hierarchy | High | One primary CTA per state: Approve as advisor, Request changes, or Return to queue depending on blocker. |
| Buttons/status chips are not gate proof. | Interaction Reality Audit; Feedback Contract | Advisor action buttons/status chips | Visual-only proof risk | Critical | Buttons must be guarded by permission/gate/service state; chips must be derived from workflow data. |
| Tables/filter/search can render without real interaction behaviour. | Interaction Reality Audit; Prompt 00 Evidence Register | Advisor queue table | Interaction lifecycle / data table | Medium/High | Implement or explicitly mark search/filter/row action semantics; avoid fake filters. Add empty/filtered-empty/loading/error/permission states. |
| Internal comments/rationale must remain internal-only. | RBAC/Visibility Contract; Evidence/Audit/Export Contract | Advisor detail, client projection, export | Payload visibility | Critical | Advisor comments may support compliance review but must not leak to portal/mobile/client-safe projection/export. |
| Advisor can assess suitability/recommendation wording but cannot publish. | V0.96 source; Journey Requirements Matrix | Advisor detail | Advice boundary | Critical | UI and actions must make advisor review internal and compliance-controlled. |
| Audit display is not audit persistence proof. | Interaction Reality Audit; Evidence/Audit/Export Contract | Advisor approval timeline/action result | Audit truth | High | Advisor approve/reject/request-change must write or route to persisted audit where service exists; UI may show audit unavailable/fail-closed state. |
| Existing current snapshot already contains advisor surfaces and tests. | Current `full-workflow` snapshot | `components/internal-workflow-screen.tsx`, route registry, tests | Moving baseline | High | WP-05 must classify existing code as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` or `BLOCKED` before changes. |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must begin WP-05 only after WP-00 has produced the moving-baseline and UX/IA delta register. The current snapshot strongly suggests advisor UI work already exists, so WP-05 must be a hardening/refactor task, not a blind new-build task.

### 4.1 Snapshot evidence to re-check, not blindly trust

| Area | Observed Snapshot Evidence | WP-05 Treatment |
|---|---|---|
| Route registry | Routes `036 /advisor/reviews` and `037 /advisor/reviews/:id` exist as Advisor Approval Queue/Detail in the current snapshot. Older route names such as `/advisor-approval` may be stale. | Use current route registry as code truth. Preserve route smoke compatibility. Do not create duplicate advisor routes. |
| Visual assets | `PAGE-036-advisor-approval.png` and `PAGE-037-advisor-approval-id.png` exist as visual references. | Treat as visual references only, not behaviour proof. No generation. |
| Main component | `components/internal-workflow-screen.tsx` contains `AdvisorQueuePage`, `AdvisorDetailPage`, advisor search, row action, advisor approve/escalate actions and no-release copy. | Reuse and harden. Do not fork unless WP-00 proves the component cannot support V0.96. |
| Existing UX helpers | `Phase5DetailSplitPanel`, `Phase4WorkbenchPanel`, `ScfP04P06FlowPanel`, `UxCtaCluster`, `ux-detail-standard-panel`, `ux-dense-operations-panel`, `guarded-action-button` may exist. | Prefer existing helpers and patterns established by WP-01/WP-02. |
| API/service path | `app/api/demo-workflow/route.ts`, `lib/typed-workflow-command-bus.ts`, `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts`, `lib/visibility-engine.ts` exist in snapshot. | Use/harden existing workflow action path. Do not add API unless WP-00 proves no safe existing route. |
| Tests | `workflow-gate.spec.ts`, `demo-workflow-api.spec.ts`, `permission-engine.spec.ts`, `p0-acceptance.spec.ts`, `true-ux-cta-state.spec.ts`, `true-ux-p0-safety.spec.ts`, `scf-p04-p06-flow-ui.spec.ts` exist in snapshot. | Extend existing tests where possible; add named tests only if current coverage lacks required negative/positive proof. |

### 4.2 Required reality classification

Before implementation, Codex must classify these WP-05 requirements:

| Requirement | Required Classification |
|---|---|
| Advisor queue renders current items and supports selection/open detail. | `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |
| Advisor detail shows evidence summary, internal rationale, risk/alternatives and current gate. | Same |
| Approve/reject/request changes actions exist and are guarded. | Same |
| Advisor approval moves to compliance-pending only. | Same |
| Advisor action writes/preserves audit expectation. | Same |
| Advisor comments remain internal-only. | Same |
| Client portal/mobile/export remains hidden/redacted after advisor approval. | Same |
| Advisor queue/detail obey one-primary-CTA and density/page-type rules. | Same |
| Tests prove advisor-not-release and wrong-role denial. | Same |

---

## 5. WP Problem Statement

The advisor approval step is the first senior human review gate after analyst preparation. The product needs this gate to be credible, but the UI/UX risk is severe: an “Approve” button in a financial-advisory context can easily be mistaken for release to client or advice publication. If the advisor queue/detail is a long, busy page with equal CTAs, decorative status chips and generic success text, it undermines the exact safety model AlphaVest is trying to prove.

`WP-05` therefore solves three connected problems:

1. **Workflow truth:** advisor approval must mutate only the advisor gate and route the case to compliance.
2. **UI truth:** the advisor surface must make the next gate obvious: compliance release is still required.
3. **Proof truth:** tests must prove advisor approval does not create client visibility, export readiness or release.

---

## 6. V0.96 Journey Role

| Journey | WP-05 Role |
|---|---|
| `MJ-001 — New Family Office onboarding to first client-safe decision` | Advisor approval is a required human review step before compliance release and client-safe decision visibility. |
| `MJ-003 — AI draft rejected and rebuilt with evidence` | Advisor receives analyst-reviewed, evidence-supported internal package; advisor action does not expose AI draft or internal rationale to client. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Wrong tenant/wrong role cannot approve advisor packages; denied actions require safe failure and audit where supported. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Admin or advisor authority cannot turn approval into release or visibility. |

WP-05 is positioned after WP-03/WP-04 evidence/analyst work and before WP-06 compliance release. It must not absorb compliance logic; it must hand off to it.

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-05 Manifestation | Refactor Obligation |
|---|---|---|
| Route catalogue → journey-first IA | Advisor route may appear as one of many screens rather than a journey gate. | Surface journey position: `Analyst reviewed → Advisor review → Compliance release → Client-safe view`. |
| Long page / complex detail | Advisor detail can become dense with metrics, draft, evidence, risk, audit, actions and guidance. | Use detail-standard layout: summary/top decision area first; evidence/rationale/audit in tabs/drawers/sections. |
| Too many equal CTAs | Approve, reject, escalate, view evidence, open audit can compete. | One primary CTA based on state; secondary actions demoted. |
| Advisor approval vs release confusion | Approval copy/action may imply client release. | Mandatory copy: `Advisor approved. Waiting for compliance release.` |
| Visual-only buttons/chips | Status chip “approved” or button click can be misread as gate proof. | Derive status from workflow state; test that client visibility remains false/hidden. |
| Queue table interaction gaps | Search/filter/row action may be partial/static. | Ensure search/empty/filtered-empty/row-open behaviour or explicitly disabled/deferred with honest UI. |
| Internal comments visibility | Advisor comments may accidentally enter client summary/export. | Mark comments internal-only; exclude from client-safe projection/export payloads. |
| Audit display confusion | Timeline may show static items rather than persisted audit. | Bind to audit event source where possible; show audit unavailable/pending state when not confirmed. |
| Density mismatch | Advisor is internal workbench/detail, not calm client page. | Use compact internal queue density and focused detail page density, not sparse client layout. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes now

| Area | Included in WP-05 |
|---|---|
| Advisor queue | Queue state counts, search/empty/filtered-empty, blocker/readiness summary, row-open detail action. |
| Advisor detail | Recommendation package, evidence summary, analyst review context, internal-only rationale, risks/alternatives, approval decision area. |
| Advisor actions | Approve, reject, request changes/escalate as guarded actions with loading/error/success/cancel states. |
| Gate state | Approved means `compliance_pending`, not released/client-visible. |
| UI copy | No-overclaim wording and explicit compliance-pending copy. |
| Layout | Queue/detail split, summary-first detail, secondary context organized into tabs/drawers/sections. |
| CTA hierarchy | One primary CTA per state. |
| Audit | Advisor action audit expectation, audit reference/pending/unavailable UI. |
| Tests | Positive advisor approval to compliance-pending; negative advisor approval does not release/client-visible/export. |

### 8.2 Stays out

| Area | Reason |
|---|---|
| Compliance release/block/request evidence | WP-06 owns release gate. WP-05 may only route to compliance-pending. |
| Client-safe projection implementation | WP-07 owns client projection. WP-05 must protect against leakage only. |
| Export implementation | WP-10 owns export. WP-05 must ensure advisor comments/internal rationale do not feed export. |
| Full production suitability/regulated-advice engine | Out of V0.96 scope; no autonomous advice or production financial advice. |
| Committee review | HOLD/P2. Do not elevate routes `070–071`. |
| KYC/SoW/Suitability/IPS | HOLD/P2. Do not pull routes `064–067`. |
| New visual assets/screens | Not authorized. |
| Broad redesign | Refactor only touched advisor surfaces and shared primitives already in use. |
| Blind schema replacement | Use current full-workflow schema; schema changes need WP-14 protocol. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP05-T01-REBASE-CURRENT-ADVISOR-REALITY` | Classify existing advisor queue/detail/API/test reality before edits. | Current snapshot already appears to include advisor queue/detail and no-release copy. | `lib/route-registry.ts`, `components/internal-workflow-screen.tsx`, `app/api/demo-workflow/route.ts`, `lib/typed-workflow-command-bus.ts`, `tests/*advisor*`, `tests/*workflow*`, WP-00 output | Record routes, components, actions, service path, current tests and UX state. Classify each WP-05 requirement as `ALREADY_PRESENT/PARTIAL/MISSING/CONFLICTING/BLOCKED`. | No implementation begins until classification exists. | No new tests; delta register update. | Audit/rebase only. | Stop if WP-00 was not run or current route names differ without update. |
| `WP05-T02-ALIGN-ROUTES-AND-JOURNEY-METADATA` | Ensure advisor routes are the authoritative V0.96 advisor gate. | Current route registry may use `/advisor/reviews` and `/advisor/reviews/:id` rather than older `/advisor-approval`. | `lib/route-registry.ts`, `lib/navigation.ts`, `lib/ux-route-policy.ts`, `components/sidebar.tsx`, `components/top-bar.tsx` | Reconcile route naming and nav labels. Preserve current route registry. Ensure advisor route group belongs to advisory workflow after analyst and before compliance. | Advisor nav label and page metadata communicate approval gate, not release. | `tests/route-smoke.spec.ts`, `tests/navigation-shell.spec.ts` if present. | Yes: journey-first IA. | Do not create duplicate advisor routes or reclassify P1/HOLD routes. |
| `WP05-T03-ADVISOR-QUEUE-WORKBENCH-HARDENING` | Harden advisor queue for readiness, blockers and selection. | Advisor queue should support internal advisor triage. | `components/internal-workflow-screen.tsx`, `components/ui/data-table.tsx`, `components/ux-dense-operations-panel.tsx`, `components/ux-cta-cluster.tsx` | Show queue summary counts: ready for advisor, blocked, changes requested, compliance pending. Add loading/empty/filtered-empty/error/permission states. Verify row action opens detail. Use compact D2 internal queue density. | Queue supports selecting an item and makes blockers visible. Search/filter are real or honestly disabled. | `tests/true-ux-density.spec.ts`, `tests/true-ux-cta-state.spec.ts`, route smoke. | Yes: table states, density, IA. | Do not show fake filters or row actions that do nothing. |
| `WP05-T04-ADVISOR-DETAIL-DECISION-LAYOUT` | Refactor advisor detail as a decision-support page. | Detail page must support one package review, not generic browsing. | `components/internal-workflow-screen.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-secondary-context-tabs.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx` | Structure detail: header with page job/gate/blocker/next step; package summary; evidence summary; analyst context; internal rationale; risk/alternatives; decision area; audit/reference. Move secondary content into tabs/drawers. | Above fold communicates selected package, advisor gate, blocker and primary action. | `tests/true-ux-density.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: long page reduction, summary-first layout. | Do not hide safety blockers in collapsed-only content. |
| `WP05-T05-GUARDED-APPROVE-ACTION` | Implement/harden advisor approve as guarded human review action. | Advisor approval must set only advisor gate/compliance-pending. | `components/ui/guarded-action-button.tsx`, `components/ux-cta-cluster.tsx`, `app/api/demo-workflow/route.ts`, `lib/typed-workflow-command-bus.ts`, `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts` | Use existing workflow API/action if present (`advisor_approve` or equivalent). Validate role/object/tenant/evidence/analyst preconditions. Add loading/error/success states. On success show compliance-pending. Ensure audit expectation. | Advisor approval persisted/routed as advisor-approved/compliance-pending only. Client visibility remains false/hidden. | `tests/demo-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/permission-engine.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: CTA/feedback. | Stop if approve sets release/clientVisible/exportReady. |
| `WP05-T06-REJECT-AND-REQUEST-CHANGES-LIFECYCLE` | Implement/harden reject/request changes/escalate path. | Advisor must not only approve; they can return work. | Same as T05 plus modal/drawer primitives if used | Add guarded action(s) for reject/request changes. Require reason where appropriate. Use modal/drawer lifecycle if confirmation is used. Route item back to analyst/changes-requested or compliance-pending only if explicitly correct. | Reject/request changes is auditable, role-scoped and preserves client-hidden state. | `tests/demo-workflow-api.spec.ts`, `tests/interaction-lifecycle.spec.ts` if present, true-UX state test. | Yes: modal/drawer/form lifecycle. | Do not silently mutate without reason/audit when required. |
| `WP05-T07-INTERNAL-COMMENT-AND-RATIONALE-BOUNDARY` | Ensure advisor comments/rationale are internal-only. | Advisor comments can support compliance, but not client projection/export. | `components/internal-workflow-screen.tsx`, `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts`, `lib/export-service.ts`, `lib/export-package-service.ts` | Mark internal comments/rationale visually. Ensure client projection/export payload excludes them. If current export/projection already excludes, add tests and keep code minimal. | Internal comments visible only to authorized internal roles and absent from client/export. | `tests/true-ux-client-projection.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/file-export-realism.spec.ts` or export safety tests. | Yes: internal-only labelling. | Stop if internal comments appear in portal/mobile/export. |
| `WP05-T08-ADVISOR-EVIDENCE-SUMMARY-READINESS` | Show advisor the evidence context without turning advisor into evidence sufficiency gate. | Advisor needs enough evidence context to approve/reject, but evidence sufficiency belongs to evidence/compliance rules. | `components/internal-workflow-screen.tsx`, `components/ui/evidence-list.tsx`, `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `lib/workflow-gate.ts` | Display linked evidence status, sufficiency summary, missing evidence blockers and source links. Disable advisor approve if evidence/workflow gate requires sufficiency and it is missing. | Advisor can see why approval is allowed/blocked. Evidence state is not overclaimed. | `tests/workflow-gate.spec.ts`, UI blocker test, evidence negative tests. | Yes: blocker/summary clarity. | Do not let advisor override evidence sufficiency. |
| `WP05-T09-NO-OVERCLAIM-ADVISOR-MICROCOPY` | Replace misleading advisor approval text. | Copy is part of safety boundary. | `components/internal-workflow-screen.tsx`, shared copy constants if any, `components/ui/state-panel.tsx` | Use explicit wording: “Approve as advisor”, “Advisor approved — waiting for compliance release”, “Client visibility remains blocked”, “Request changes”, “Return to analyst”. | No touched advisor copy says released/published/client-ready after advisor action. | Text assertions in `true-ux-p0-safety` or CTA-state tests. | Yes. | Stop if success copy implies client release. |
| `WP05-T10-AUDIT-REFERENCE-AND-FAIL-CLOSED-STATE` | Bind advisor actions to audit proof or audit-pending/unavailable UI. | Audit display alone is not proof. | `lib/audit-service.ts`, `components/ui/audit-timeline.tsx`, `components/internal-workflow-screen.tsx`, `app/api/audit-events/route.ts` if present | On advisor action, write/route audit where service supports it. Show audit reference, pending or unavailable state. If audit failure should block action per service contract, implement fail-closed. | Advisor action has auditable trace or explicit audit-unavailable blocker. | `tests/audit-events-api.spec.ts` if present, `tests/permission-engine.spec.ts`, P0 audit tests. | Yes: audit truth in UI. | Do not present static timeline as persisted proof. |
| `WP05-T11-ROLE-OBJECT-PAYLOAD-NEGATIVE-PROOF` | Prove wrong role/tenant/object cannot approve or see internal detail. | Advisor route access is not action/payload permission. | `lib/permission-engine.ts`, `app/api/demo-workflow/route.ts`, advisor components, tests | Add/extend tests for wrong role, cross-tenant, client principal, admin bypass, advisor without object scope. Ensure UI/API return denied/hidden and no mutation. | Unauthorized actors cannot approve or view internal advisor payload. | `tests/permission-engine.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: permission-denied states. | Stop if route visibility grants payload/action. |
| `WP05-T12-ADVISOR-NOT-RELEASE-P0-PROOF` | Add the explicit P0 proof for advisor approval not releasing. | This is the central WP-05 acceptance. | `tests/workflow-gate.spec.ts`, `tests/demo-workflow-api.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/p0-acceptance.spec.ts` | Add test that advisor approval produces compliance-pending and no client-visible projection. Assert portal/mobile/export do not show approved recommendation until compliance release. | Test fails if advisor approval sets client visibility or released content. | Named tests listed in section 16. | Yes: projection/UI copy assertions. | Do not mark WP-05 complete without this negative test. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Current Route | Scope | WP-05 Treatment |
|---|---|---|---|
| `036` | `/advisor/reviews` | `MVP` | Advisor approval queue: triage, blockers, row-open detail, no release actions. |
| `037` | `/advisor/reviews/:id` | `MVP` | Advisor package detail: approve/reject/request changes, evidence summary, internal notes, audit, compliance-pending state. |
| `033–035` | Signals / workbench / trigger detail | `MVP` predecessor context | Read-only dependency for analyst-reviewed/readiness source; do not implement analyst logic here. |
| `038–040` | Compliance queue/review/release | `MVP` successor context | Use as next gate target; do not implement release inside WP-05. |
| `019–020` | Portal/mobile | `MVP` client-safety check | Must remain hidden/no released content after advisor approval. |
| `054–058` | Export | `MVP` later trust output | Must not include advisor internal comments/rationale pre-release. |

### 10.2 Components

| Component | Use in WP-05 |
|---|---|
| `components/internal-workflow-screen.tsx` | Primary advisor queue/detail surface. |
| `components/page-header.tsx` | Page job/gate/blocker/next-step if global pattern exists. |
| `components/ux-detail-standard-panel.tsx` | Advisor detail structure. |
| `components/ux-dense-operations-panel.tsx` | Advisor queue/internal workbench density. |
| `components/ux-cta-cluster.tsx` | One-primary-CTA cluster. |
| `components/ui/data-table.tsx` | Advisor queue table/search/row action. |
| `components/ui/guarded-action-button.tsx` | Permission/precondition-aware advisor actions. |
| `components/ui/state-panel.tsx` | Blocked/pending/success/error/permission states. |
| `components/ui/modal.tsx`, `components/ui/drawer.tsx` | Only if reject/request-changes/approval confirmation needs overlay lifecycle. |
| `components/ui/evidence-list.tsx` | Evidence summary/readiness. |
| `components/ui/audit-timeline.tsx` | Persisted audit reference or audit-pending/unavailable state. |

### 10.3 APIs / services

| API / Service | Use in WP-05 |
|---|---|
| `app/api/demo-workflow/route.ts` | Existing action transport for advisor approve/reject/request changes if current code uses it. |
| `app/api/audit-events/route.ts` | Audit lookup/proof if available in current repo. |
| `lib/typed-workflow-command-bus.ts` | Workflow mutation implementation. |
| `lib/demo-workflow-validation.ts` | Request/action validation. |
| `lib/workflow-gate.ts` | Gate precondition checks: analyst/evidence/advisor/compliance separation. |
| `lib/permission-engine.ts` | Role/action/object/tenant authorization. |
| `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts` | Prove client visibility remains false/hidden. |
| `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts` | Audit event persistence/fail-closed. |
| `lib/evidence-service.ts`, `lib/evidence-review-service.ts` | Evidence summary/readiness. |
| `lib/export-service.ts`, `lib/export-package-service.ts` | Negative proof that advisor internal data is not exported. |

### 10.4 Schema areas

Codex must inspect current schema usage, but WP-05 does not authorize blind schema replacement.

| Model / Concept | WP-05 Use |
|---|---|
| `Recommendation` | Advisor review subject, clientVisible/release-status boundaries. |
| `Approval` | Advisor approval record/status if current schema uses it. |
| `ComplianceReview` | Successor gate; compliance-pending target state. |
| `Decision` | Later decision record dependency; do not release in WP-05. |
| `EvidenceRecord`, `EvidenceItem`, `DocumentReview`, `DocumentLink` | Evidence readiness summary and preconditions. |
| `AuditEvent` | Advisor approve/reject/request-change trace. |
| `Role`, `Permission`, `UserRole` | Advisor role/action/object scope. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Lifecycle | Required Guard |
|---|---|---|
| Open advisor queue row | Row action → navigate/detail load → loading/empty/error fallback | Route/object scope; hidden/denied if wrong tenant/object. |
| Approve as advisor | Click → validate preconditions → loading → service/API mutation → audit → success state `compliance_pending` → no client visibility | Advisor role, object scope, analyst/evidence readiness, audit expectation. |
| Reject / request changes | Click → require reason if modal/drawer → validate → loading → mutation → audit → success `changes_requested` or equivalent → no client visibility | Advisor role/object scope; reason if safety-critical. |
| Search/filter queue | Input/change → filter rows or disabled explanation → filtered-empty state | Must not expose unauthorized rows. |
| View evidence summary | Expand/open/detail → evidence status shown → missing evidence blocker if incomplete | Evidence visibility must be internal and scoped. |
| View audit reference | Load audit event/source → show event or pending/unavailable state | Do not show static timeline as persistence proof. |
| Cancel modal/drawer | Cancel/escape/backdrop if supported → no mutation → focus returns safely | No silent state change. |

---

## 12. State / Feedback / Microcopy Requirements

### 12.1 Required states

| State | Required UI Behaviour |
|---|---|
| `advisor_queue_loading` | Show loading state, no fake rows. |
| `advisor_queue_empty` | Explain no packages await advisor review and next work source. |
| `advisor_queue_filtered_empty` | Search/filter produced no rows; allow clear search. |
| `advisor_permission_denied` | Deny route/action/payload without exposing internal package. |
| `advisor_detail_loading` | Show selected package loading skeleton/state. |
| `advisor_detail_blocked_needs_evidence` | Disable approval; primary CTA may be “Request changes” or “View evidence blocker”. |
| `advisor_detail_ready` | Primary CTA: “Approve as advisor”. |
| `advisor_approving` | Disable actions and show save state. |
| `advisor_approved_compliance_pending` | Success copy: “Advisor approval saved. Waiting for compliance release.” |
| `advisor_rejected_or_changes_requested` | Show safe state and return path to analyst/queue. |
| `advisor_action_error` | Preserve input/state; show retry/cancel. |
| `audit_unavailable` | Show action blocked/pending if audit is required. |

### 12.2 Required copy rules

| Situation | Allowed Copy | Forbidden Copy |
|---|---|---|
| Primary approve CTA | `Approve as advisor` | `Release`, `Publish`, `Send to client` |
| Approval success | `Advisor approval saved. Waiting for compliance release.` | `Released`, `Client can view`, `Recommendation published` |
| Blocked evidence | `Evidence review is incomplete. Advisor approval is blocked.` | `Evidence accepted` without review proof |
| Internal comment | `Internal advisor comment. Not client-visible.` | `Client summary` unless actually client-safe projection |
| Compliance pending | `Compliance release is required before client visibility.` | `Ready for client` |
| Audit reference | `Audit event recorded` only when persisted event exists | `Audit complete` from static timeline |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-05 Requirement |
|---|---|
| RBAC | Only allowed advisor roles with object/tenant scope may approve/reject/request changes. Route shell access does not imply action or payload permission. |
| Client Visibility | Advisor approval does not set clientVisible, releasedToClient, exportReady or equivalent. Client portal/mobile stays hidden/fail-closed until compliance release. |
| Advice Boundary | Advisor approval is internal human review. It is not autonomous advice and not direct client advice. |
| AI Draft Boundary | If internal AI/rules draft appears in advisor detail, it remains internal-only and cannot be copied into client-safe summary/export. |
| Evidence | Advisor approval may require evidence readiness if workflow gate requires it; advisor cannot override evidence sufficiency. |
| Audit | Advisor actions require audit mapping. If audit is mandatory and cannot persist, safety action must fail closed or remain pending. |
| Export | Advisor comments/internal rationale/AI draft are forbidden export payloads. Export cannot be approved by advisor action. |
| Admin Non-Bypass | Admin role cannot act as advisor release/compliance gate or force client visibility. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| `WP05-POS-001` | Advisor queue route renders with correct V0.96 journey context and no route-catalogue framing. |
| `WP05-POS-002` | Advisor detail route shows package summary, evidence summary, analyst context, internal-only rationale/comments, current gate, blocker and next step. |
| `WP05-POS-003` | A scoped senior wealth advisor can approve an eligible package as advisor. |
| `WP05-POS-004` | Advisor approval moves the item to a compliance-pending state or equivalent successor state. |
| `WP05-POS-005` | Advisor approval writes or references an audit event where current audit service supports it. |
| `WP05-POS-006` | Advisor can reject/request changes with clear feedback and no client visibility. |
| `WP05-POS-007` | UI copy after advisor approval explicitly states compliance release remains required. |
| `WP05-POS-008` | Advisor queue/detail follow one-primary-CTA, density and page-header rules established by WP-01/WP-02. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Criteria |
|---|---|
| `WP05-NEG-001` | Advisor approval must not set `clientVisible`, `releasedToClientAt`, `released`, `exportApproved`, `downloadReady` or equivalent. |
| `WP05-NEG-002` | Client portal/mobile must not show advisor-approved content before compliance release. |
| `WP05-NEG-003` | Export package/manifest must not contain advisor internal comment, internal rationale or AI draft after advisor approval. |
| `WP05-NEG-004` | Wrong role, wrong tenant, unrelated object or client principal cannot approve advisor package. |
| `WP05-NEG-005` | Admin cannot force advisor approval into compliance release or client visibility. |
| `WP05-NEG-006` | Advisor cannot approve when evidence/analyst preconditions are blocked by workflow gate. |
| `WP05-NEG-007` | UI must not show copy that says or implies “released”, “published”, “client-ready” or “sent to client” after advisor approval. |
| `WP05-NEG-008` | Static status chip/timeline alone must not satisfy gate/audit proof. |

---

## 16. Required Tests and Test Names

Codex must inspect `package.json` and existing tests before adding new files. Prefer extending existing P0/true-UX/workflow tests unless WP-00 proves no suitable location exists.

| Test Name | Suggested File | Purpose |
|---|---|---|
| `advisorApprovalMovesToCompliancePendingOnly` | `tests/workflow-gate.spec.ts` or `tests/p0-acceptance.spec.ts` | Positive proof that advisor approval advances only to compliance-pending. |
| `advisorApprovalDoesNotCreateClientVisibility` | `tests/client-visibility-projection.spec.ts` or `tests/true-ux-client-projection.spec.ts` | Negative proof that portal/mobile remain hidden before compliance release. |
| `advisorApprovalDoesNotReleaseExportPayload` | `tests/file-export-realism.spec.ts` / export safety spec | Negative proof that export excludes advisor internal data and is not approved/download-ready. |
| `wrongRoleCannotApproveAdvisorPackage` | `tests/permission-engine.spec.ts` | RBAC/action/object negative. |
| `adminCannotBypassAdvisorToRelease` | `tests/p0-acceptance.spec.ts` | Admin non-bypass negative. |
| `advisorApprovalCopySaysComplianceReleaseRequired` | `tests/true-ux-p0-safety.spec.ts` or `tests/true-ux-cta-state.spec.ts` | UI copy no-overclaim proof. |
| `advisorDetailHasOnePrimaryCTAForCurrentState` | `tests/true-ux-cta-state.spec.ts` | CTA hierarchy proof. |
| `advisorQueueHasLoadingEmptyFilteredEmptyPermissionStates` | `tests/true-ux-density.spec.ts` or route UI test | Queue truth/state proof. |
| `advisorRejectRequestChangesRequiresReasonWhenConfigured` | `tests/interaction-lifecycle.spec.ts` if present | Modal/drawer/form lifecycle proof. |
| `advisorActionAuditRecordedOrBlocksIfRequired` | audit/P0 test | Audit proof/fail-closed. |

---

## 17. Validation Commands

Codex must inspect `package.json` first and use the actual available scripts. Candidate commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test -- --grep "advisor|approval|compliance pending|client visibility|p0|true-ux|permission|audit"
pnpm test -- tests/workflow-gate.spec.ts
pnpm test -- tests/permission-engine.spec.ts
pnpm test -- tests/p0-acceptance.spec.ts
pnpm test -- tests/true-ux-cta-state.spec.ts
pnpm test -- tests/true-ux-p0-safety.spec.ts
pnpm test -- tests/true-ux-client-projection.spec.ts
```

If scripts differ, use the repo’s actual scripts and document substitutions in the WP-16 release evidence handoff.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| No advisor release | Advisor approval must not release to client or create client visibility. |
| No client-visible internal notes | Advisor comments/rationale remain internal-only. |
| No AI draft leakage | AI/rules draft remains internal even when shown to advisor. |
| No admin bypass | Admin cannot force advisor approval into release/client visibility. |
| No evidence override | Advisor cannot mark evidence sufficient unless separately authorized by evidence workflow, which WP-05 does not own. |
| No compliance implementation in WP-05 | Compliance release/block/request evidence belongs to WP-06. |
| No export approval in WP-05 | Export approval/download belongs to WP-10. |
| No new advisor routes | Reuse current route registry unless WP-00 proves a conflict. |
| No screen/image generation | Existing visual refs only. |
| No broad redesign | Apply journey-first/density/CTA refactor only to advisor surfaces and reused primitives. |
| No status-chip proof | Status display must be backed by service/workflow state and tests. |
| No blind schema replacement | Schema changes require WP-14 migration decision protocol. |
| No P1/HOLD elevation | Committee, KYC, suitability, IPS remain out of this WP. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Handling |
|---|---|
| Current route names may differ from older KB labels. | WP-00 must resolve route registry truth; WP-05 must use current registry. |
| Existing advisor actions may already exist but be demo-only. | Classify as `PARTIAL`; harden only within V0.96 scope. |
| Audit service may not fail-closed yet. | Route to WP-08/WP-13 if global audit guard is required; WP-05 must not fake audit proof. |
| Schema may not have a clean advisor approval record mapping. | Use current schema if sufficient; route field gap to WP-14; do not invent patch model. |
| Current UI already includes no-release copy. | Preserve and strengthen with tests; do not rewrite unnecessarily. |
| Search/filter may be intentionally demo-static. | Either implement real semantics if V0.96 needs it or label as disabled with honest microcopy. |

---

## 20. Codex Execution Notes

1. Start with WP-00 output. Do not implement WP-05 against stale assumptions.
2. Inspect current route registry and do not rely on older path names.
3. Reuse `InternalWorkflowScreen` and existing UX helper components first.
4. Keep advisor queue/detail in the internal workbench density tier, not client calm-page density.
5. Implement the most important proof first: advisor approval → compliance pending only.
6. Add negative tests before polishing UI copy.
7. Make success copy precise and boring; safety copy beats persuasive copy.
8. Do not absorb compliance release into advisor detail. Link/navigate to compliance where appropriate, but keep the gate separate.
9. Avoid creating a second advisor workflow path if existing demo workflow can be hardened.
10. Preserve all existing route-smoke expectations unless WP-00 identifies a validated contradiction.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| WP-00 rebase used | Yes; current advisor route/component/API/test status classified. |
| `full-workflow` target preserved | Yes; no `main` task source. |
| Advisor approval separated from compliance release | Yes; positive and negative tests prove it. |
| Client visibility remains fail-closed | Yes; portal/mobile/export tests prove no leakage. |
| One primary CTA per advisor state | Yes; true-UX CTA test or equivalent. |
| Page job/gate/blocker/next step present | Yes on advisor queue/detail. |
| Advisor detail reduced from long-page sprawl | Yes; summary-first, secondary context organized. |
| Internal comments/rationale marked internal-only | Yes; excluded from client/export. |
| Wrong role / wrong object denied | Yes; permission tests. |
| Audit expectation handled truthfully | Yes; audit event or audit-unavailable/fail-closed state, not static timeline proof. |
| No screen/image generation | Yes. |
| No schema replacement | Yes. |
| No P1/HOLD scope elevation | Yes. |
| No overclaim copy | Yes; no “released/client-ready/published” after advisor approval. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB / UX discovery | Identified advisor approval vs release confusion, long detail page risk, CTA competition, internal-only advisor comments and route-catalog problem. | Converted evidence into WP-specific source hierarchy and task implications. | Selected the central implementation proof: advisor approval moves to compliance-pending only. |
| Contradiction control | Detected older path labels may differ from current route registry and that existing advisor UI may already be partial. | Required WP-00 classification before edits and preserved current `full-workflow` as target truth. | Avoided blind rebuild; instructed Codex to reuse/harden existing advisor surfaces. |
| Task decomposition | Mapped advisor queue/detail, evidence summary, internal comments, audit, RBAC and client visibility concerns. | Produced task table with concrete files, steps, tests, acceptance criteria and stop rules. | Prioritized P0 proof and no-overclaim UI over broad redesign. |
| Safety discipline | Preserved no unapproved advice, no client-visible AI Draft/internal notes, no admin bypass, no upload-to-release, no advisor-as-release. | Defined positive/negative acceptance and required tests. | Made “advisor approval is not release” the non-negotiable completion gate. |
| UX/IA integration | Embedded journey-first IA, summary-first detail, density tier, one primary CTA, table states and microcopy into surface tasks. | Bound UX changes to touched files/modules and validation commands. | Kept refactor focused: no new screens, no images, no P1/HOLD elevation. |
