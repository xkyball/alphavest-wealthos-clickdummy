# ALPHAVEST_V0_96_WP06_COMPLIANCE_DECISION_ROOM_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 07 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-06 — Compliance Decision Room`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP06_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_COMPLIANCE_DECISION_ROOM_AFTER_WP00_REBASE`

`WP-06` turns compliance from a visible workflow stage into the real V0.96 release-control room. Compliance must become the central place where a compliance officer can review the release package, inspect advisor approval, evidence sufficiency, audit readiness, permission state and client-visibility consequences, then release, block or request evidence through real lifecycles.

This is a Codex task-description artefact only. It does **not** implement code, change routes, change schema, create screens, generate images, write tests or create new Codex tickets. It specifies how Codex must later implement/harden the compliance decision room against current `full-workflow` reality.

The core product rule for this WP is:

```text
Compliance release is the only client-visibility release gate. Advisor approval, upload success, evidence existence, status chips, admin authority and visible release buttons are not release proof. Release requires advisor approval, sufficient linked evidence, compliance authority, audit persistence and safe client projection.
```

`WP-06` is P0 because AlphaVest V0.96 cannot credibly claim “human reviewed, evidence backed, client-safe” unless compliance release/block/request-evidence is real, role-scoped, audit-backed, fail-closed and visually impossible to confuse with advisor approval or upload success.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-06 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect actual routes, files, components, APIs, services, schema and tests before edits | Do not infer missing work from old KB counts or from `main` |
| 2 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and implemented WP-00 output | Mandatory predecessor | Moving baseline, current compliance implementation classification, UX/IA delta register | Starting implementation before current repo is classified |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | UX/IA evidence register | Known UI/UX/layout/IA problem families and WP-to-problem mapping | Inventing unsupported UX problems |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-06 goal, likely files, tests, stop rules and UI refactor scope | Treating the task pack as implementation proof |
| 5 | `ALPHAVEST_V0_96_WP01...` and `ALPHAVEST_V0_96_WP02...` | IA and density predecessors | Journey-first navigation, page job/header model, page-type/density rules | Rebuilding global IA/density from scratch inside WP-06 |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Route/scope/state controls | Routes `038–042` are compliance MVP routes; state requirements bind UI | Elevating P1/HOLD/reference-only routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback contracts | Release/block/request-evidence lifecycle and no-overclaim feedback | Treating visible modals/buttons/status chips as behaviour proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Core safety contract | Route/action/object/payload separation; compliance release required before client visibility; admin non-bypass | Admin release, manual client visibility, or client-visible internal advice |
| 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Evidence sufficiency, audit persistence, release/block evidence request audit and fail-closed behaviour | Release without reviewed linked sufficient evidence or audit proof |
| 10 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | Existing API hardening, schema usage alignment and P0 positive/negative obligations | Claiming existing APIs/schema/tests already prove WP-06 |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey priority source | `MJ-001`, `MJ-002`, `MJ-006` release/control proof | Pulling committee/KYC/suitability/IPS into this WP |
| 12 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | False-gap warning only | Identify stale assumptions | Any target task, absence claim or implementation basis |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-06 Task Implication |
|---|---|---|---|---|---|
| Compliance release is the client-visibility gate. | MVP Scope Lock; RBAC/Visibility/Advice Boundary Contract | `WP-06`, routes `038–042`, compliance service/action path | P0 safety / release boundary | Critical | Release may only happen after advisor approval, evidence sufficiency, permission and audit preconditions pass. |
| Advisor approval is not release. | Feedback Contract; Advisor WP; P0 Matrix | Routes `036–040` | Gate separation | Critical | Compliance UI must explicitly show advisor approval as a prerequisite, not a completed release. |
| Upload success is not evidence sufficiency. | Evidence/Audit/Export Safety Contract; Evidence WP | Routes `027–030`, `038–041` | Evidence lifecycle / overclaim | Critical | Compliance release must block if evidence is merely uploaded but not reviewed, linked, relevant and sufficient. |
| Release/block/request-evidence modals are visual modes unless lifecycle is proven. | Interaction Reality Audit; Drawer/Modal Contract | Routes `040–041`, `Modal`, `StatePanel` | Visual-only interaction risk | Critical | Codex must implement trigger/open/validate/confirm/loading/error/success/cancel/focus lifecycle, not just modal visibility. |
| Compliance screen must not be a long generic page. | Prompt 00 Evidence Register; Page-Type + Density System | `InternalWorkflowScreen`, compliance review detail | Layout / IA / decision-room structure | High | Refactor into summary-first decision room: status, blockers, evidence, advisor approval, audit, client visibility consequence and one primary action. |
| Compliance actions require one primary CTA per current state. | UX/IA Evidence Register; CTA rules | Release/block/request evidence surfaces | CTA hierarchy | High | The primary action changes by gate state: Request Evidence, Release to Client, Keep Blocked, Retry audit, or Return to Queue. |
| Audit display is not audit persistence proof. | Interaction Reality Audit; Evidence/Audit/Export Safety Contract | Route `042`, AuditTimeline, `audit-service` | Audit truth | Critical | Release/block/request evidence must write/route persisted audit; audit-unavailable must block or keep pending. |
| Client visibility is fail-closed and derived. | RBAC/Visibility Contract; Decision/Client Projection WP | Routes `019–020`, `039–040`, visibility engine | Client-safe projection | Critical | Release success may create released/client-safe state, but never client acceptance or raw internal projection. |
| Admin cannot bypass compliance release. | Governance/Admin Non-Bypass Contract | Governance/admin routes and compliance release action | Admin non-bypass | Critical | Admin/security roles must not release, force visibility, mark evidence sufficient or suppress audit outside compliance authority. |
| Existing full-workflow snapshot contains compliance-specific routes, APIs, services and tests. | Current repo snapshot; WP-00 rebase requirement | Route registry, `demo-workflow`, `workflow-gate`, tests | Moving baseline | High | WP-06 is likely hardening/refactor, not blind creation. Classify current code as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` before edits. |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must begin WP-06 only after WP-00 has produced the moving-baseline and UX/IA delta register. The current snapshot indicates that compliance routes, action types and tests already exist, so WP-06 must rebase first and then harden/refactor.

### 4.1 Snapshot evidence to re-check, not blindly trust

| Area | Observed Snapshot Evidence | WP-06 Treatment |
|---|---|---|
| Route registry | Routes `038 /compliance/reviews`, `039 /compliance/reviews/:id/decision-room`, `040 /compliance/reviews/:id/release`, `041 /compliance/reviews/:id/block`, `042 /compliance/reviews/:id/audit` exist in the current snapshot. Older route names like `/compliance/:id/review` may be stale. | Use current route registry as code truth. Do not create duplicate compliance routes. Preserve route smoke compatibility. |
| Visual assets | `PAGE-038-compliance.png` through `PAGE-042-compliance-id-audit.png` exist as visual references. | Treat as visual references only, not lifecycle/safety proof. No generation. |
| Main component | `components/internal-workflow-screen.tsx` is the primary advisory/compliance workflow component; `components/decisions-governance-screen.tsx` may cover block/audit surfaces. | Reuse and harden. Split only where WP-00 proves maintainability or density requires it. |
| Interaction primitives | `components/ui/modal.tsx`, `components/ui/state-panel.tsx`, `components/ui/guarded-action-button.tsx`, `components/ux-cta-cluster.tsx` may exist. | Prefer reuse. Release/block/request-evidence lifecycle must be real and accessible. |
| API action path | `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts` include `compliance_release` and `compliance_block` action families in current snapshot. | Harden existing workflow API/action path first. Do not add new API unless WP-00 proves no safe existing route. |
| Services | `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `lib/audit-service.ts`, visibility/export services exist in snapshot. | Use service truth for UI state; do not let UI chips/buttons drive state. |
| Tests | `workflow-gate.spec.ts`, `confirmation-lifecycle.spec.ts`, `audit-fail-closed.spec.ts`, `p0-acceptance.spec.ts`, `demo-workflow-api.spec.ts`, `permission-engine.spec.ts`, `client-visibility-projection.spec.ts` and true-UX specs exist in snapshot. | Extend/align tests. Do not overclaim existing test coverage. |
| Schema | `ComplianceReview`, `Approval`, `Decision`, `Recommendation`, `EvidenceRecord`, `AuditEvent`, `Role`, `Permission`, `UserRole` are safety-relevant schema areas. | Use existing fields first. No blind Prisma replacement. |

---

## 5. WP Problem Statement

The compliance flow is the point where AlphaVest either proves trust or collapses into a visual demo. If compliance release can be triggered from a button without advisor/evidence/audit/permission proof, the product violates the central no-unapproved-advice rule. If the UI uses release-looking language before all gates pass, it creates a dangerous overclaim. If block/request-evidence is merely a visual modal state, the journey cannot prove recovery from incomplete evidence. If audit is only shown as static history, there is no governance proof.

`WP-06` therefore must make compliance a decision room, not a generic page or route state. The user must immediately understand:

1. What is being reviewed.
2. Whether advisor approval exists.
3. Whether evidence is sufficient, linked and scoped.
4. Whether the actor may release/block/request evidence.
5. Whether audit is available and required.
6. What the current blocker is.
7. What one primary next action is safe right now.
8. What client-visible consequence will happen only after release.

---

## 6. V0.96 Journey Role

| Journey | WP-06 Role |
|---|---|
| `MJ-001 — New Family Office onboarding to first client-safe decision` | Compliance is the final internal gate before client-safe release. |
| `MJ-002 — Evidence missing to client upload to release` | Compliance can block/request evidence or release only after evidence sufficiency is proven. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Compliance release/action must be tenant/object scoped and audited; wrong actors fail closed. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Admin/governance cannot force release, visibility or evidence sufficiency. |
| `MJ-005 — Export package with forbidden internal payload redaction` | Later export relies on compliance release/client-safe projection; WP-06 must produce trusted release state. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-06 Surface | Required Refactor |
|---|---|---|
| Route-catalog navigation | Compliance routes `038–042` | Compliance appears under journey-first advisory/release path, not as isolated route list. |
| Weak page job/header | Queue/detail/release/block/audit pages | Header must show page job, current gate, blocker, and next safe action. |
| Long-page sprawl | Compliance review detail / decision room | Summary-first layout, decision panel, progressive disclosure for secondary evidence/audit/context. |
| Sparse or decorative pages | Release/block modal states, audit pages | Replace blank/visual-only states with truthful preconditions, blockers, audit state and recovery. |
| Too many equal CTAs | Release/block/request evidence actions | One primary CTA per state. Secondary actions are demoted or grouped. |
| Visual-only modal state | Release and block/request-evidence visual modes | Full lifecycle: trigger/open/validation/confirm/loading/error/success/cancel/focus. |
| Status chips pretending to be gates | Compliance/advisor/evidence/audit status chips | Chips must be derived from service/workflow state and never be the proof itself. |
| No-overclaim feedback | Release/block/request evidence feedback | Success names only the completed gate: release creates client-safe availability, not client acceptance. |
| Client-visible internal risk | Release outcome / portal/mobile / export | Compliance notes, internal rationale, AI Draft and raw evidence remain hidden. |
| Audit display vs persistence confusion | Route `042`, audit timeline | UI must distinguish persisted audit event, audit pending, and audit unavailable/fail-closed. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes now

| Area | Refactor / Implementation Scope |
|---|---|
| Compliance queue | Show release-ready, blocked, evidence-needed, audit-unavailable and permission-denied states with clear next action. |
| Compliance decision room | Summary-first review detail with precondition checklist: advisor approval, evidence sufficiency, audit readiness, permission, client-safe projection consequence. |
| Release modal | Real lifecycle with validation, confirmation, loading, denied/error, success and focus/cancel behaviour. |
| Block/request-evidence modal | Real lifecycle requiring reason/evidence request details and audit expectation. |
| Guarded actions | Release/block/request evidence use role/action/object/workflow gates. |
| UI truth | UI state is driven by service/API/schema state where available, not static chips or query-driven visual modes. |
| Microcopy | Replace ambiguous “approved/released/ready” copy with gate-specific wording. |
| Audit | Persist or require audit events for release/block/request-evidence. |
| Tests | Positive release path plus negative missing evidence, missing advisor approval, wrong role, admin bypass and audit failure. |

### 8.2 Stays out

| Out of Scope | Reason |
|---|---|
| Committee review / routes `070–071` | HOLD/P2; no V0.96 elevation. |
| KYC/SoW/Suitability/IPS `064–067` | HOLD/P2; high-risk advice/suitability semantics not unlocked. |
| Full production advice automation | Non-goal; human compliance release remains mandatory. |
| New visual/screen generation | Explicitly not authorized. Existing visual references are enough. |
| Broad app redesign | Only touched V0.96 compliance surfaces are refactored. |
| Blind Prisma schema replacement | Use full-workflow schema first; migrations only after WP-14 protocol. |
| Manual client visibility override | Explicitly forbidden. Visibility is derived/fail-closed. |
| Export implementation beyond release-state dependency | Export is WP-10; WP-06 only supplies trusted release state. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP06-T01-REBASE-COMPLIANCE-REALITY` | Classify current compliance implementation before edits. | Current snapshot already has compliance routes/actions/tests; avoid duplicate build. | `lib/route-registry.ts`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `app/api/demo-workflow/route.ts`, `lib/demo-workflow-*`, `tests/*compliance*`, `tests/workflow-gate.spec.ts` | Inspect route IDs `038–042`, component render paths, action names, service functions and tests. Mark each area `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`. Update or reference WP-00 delta register. | Compliance target files and current gaps are known before implementation. No duplicate route/API/component is created. | Source reality check, route smoke, test inventory. | Yes: classify UI/IA/density/CTA delta for compliance surfaces. | Stop if route registry or component ownership contradicts task assumptions. |
| `WP06-T02-COMPLIANCE-QUEUE-TRIAGE` | Harden compliance queue as triage hub. | Queue must direct compliance officer to release-ready, evidence-needed, blocked and audit-risk items. | `components/internal-workflow-screen.tsx`, `components/ui/data-table.tsx`, `components/ui/state-panel.tsx`, `lib/internal-workflow-demo-data.ts`, service/read-model if present | Add/verify queue columns or cards for package, advisor status, evidence status, release blocker, audit status, priority, primary next action. Add loading/empty/error/permission states. | Queue shows why each item is releasable or blocked. Row action opens decision room. | `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts`, route smoke. | Yes: dense workbench layout, one row primary action, useful empty states. | Do not let queue show client-visible content or raw internal details to unauthorized roles. |
| `WP06-T03-DECISION-ROOM-LAYOUT` | Refactor compliance review detail into decision room. | Compliance detail is the central release decision surface. | `components/internal-workflow-screen.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-cta-cluster.tsx`, `components/ui/state-panel.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx` | Structure page as: header/job/gate/blocker/next step; release package summary; precondition checklist; evidence summary; advisor approval proof; client-safe outcome preview; decision actions; audit/context secondary panel. | Above fold answers: can release? why/why not? what action is safe? | `tests/true-ux-density.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: long-page reduction, decision-room hierarchy. | Do not hide blockers in collapsed-only content. |
| `WP06-T04-PRECONDITION-CHECKLIST` | Bind release readiness to real preconditions. | Release requires advisor approval, sufficient evidence, permission and audit readiness. | `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `lib/audit-service.ts`, `components/internal-workflow-screen.tsx` | Create/reuse a release readiness view model. Show pass/fail/unknown for advisor approval, evidence sufficiency/link/relevance/scope, compliance permission, audit availability, client-safe projection readiness. | Release button is enabled only when all required preconditions pass. Unknown states fail closed. | `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: checklist, blocker labels, recovery guidance. | Stop if UI enables release on uploaded-only evidence, advisor-missing or audit-unknown. |
| `WP06-T05-GUARDED-RELEASE-ACTION` | Implement/harden compliance release as guarded action. | Compliance release is the only release gate to client-safe visibility. | `components/ui/guarded-action-button.tsx`, `components/ux-cta-cluster.tsx`, `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts`, `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts`, `lib/visibility-engine.ts` | Use existing `compliance_release` action if present. Validate actor role, tenant/object scope, advisor approval, evidence sufficiency, audit write/availability and safe projection. On success set compliance released/client-safe availability through existing state path. | Release succeeds only for authorized compliance actor with all preconditions. Client-safe projection is available after release, but client acceptance is not implied. | `tests/demo-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/permission-engine.spec.ts`, `tests/client-visibility-projection.spec.ts`. | Yes: guarded CTA + release outcome feedback. | Stop if release can be triggered by admin/advisor/client or without evidence/advisor/audit. |
| `WP06-T06-RELEASE-MODAL-LIFECYCLE` | Turn release visual mode into real confirmation lifecycle. | Route `040` has release confirmation visual mode; visual mode is not behaviour. | `components/ui/modal.tsx`, `components/internal-workflow-screen.tsx`, `tests/confirmation-lifecycle.spec.ts`, `components/ui/a11y-status.tsx` | Implement trigger/open, labelled modal, focus management, cancel, confirmation phrase/checkbox if required, loading, permission denied, validation error, API error, success state and close behaviour. | Modal can be operated by keyboard; invalid/denied/error states do not advance release. | `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-a11y.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: modal lifecycle, focus/a11y, no-overclaim copy. | Stop if modal is query/static-only or if close/cancel mutates state. |
| `WP06-T07-BLOCK-REQUEST-EVIDENCE-LIFECYCLE` | Implement/harden block/request-evidence path. | Compliance must be able to block release or request missing evidence with reason. | `components/ui/modal.tsx`, `components/ui/drawer.tsx` if used, `components/internal-workflow-screen.tsx`, `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/evidence-service.ts`, `lib/audit-service.ts` | Use existing `compliance_block` or create/reuse request-evidence action if current code supports it. Require reason and missing evidence description. Preserve client-hidden state. Write audit. Show blocked/needs evidence feedback. | Block/request-evidence is auditable, role-scoped and keeps item unreleased. | `tests/demo-workflow-api.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/audit-fail-closed.spec.ts`. | Yes: modal/drawer form lifecycle, reason validation, recovery next step. | Do not allow block without reason if reason is contract-required. Do not release while requesting evidence. |
| `WP06-T08-AUDIT-PERSISTENCE-AND-FAIL-CLOSED` | Ensure compliance actions write audit or fail closed. | Audit display is not persistence proof. | `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts` if present, `components/ui/audit-timeline.tsx`, `app/api/audit-events/route.ts`, `tests/audit-fail-closed.spec.ts` | For release/block/request evidence, require audit event with actor, role, tenant, target, action, result, previous/next state, reason and timestamp/correlation where available. If audit write fails where required, action stays blocked/pending. | Audit reference exists for successful compliance action. Audit failure blocks critical state advancement. | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: audit unavailable state, persisted reference labels. | Stop if action completes but audit write failed or UI shows static audit proof. |
| `WP06-T09-CLIENT-VISIBILITY-BOUNDARY` | Ensure release creates safe projection only, not internal leakage or client acceptance. | Compliance release enables client-safe visibility; it does not send raw internal payload. | `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts`, `components/client-intake-screen.tsx`, `components/internal-workflow-screen.tsx`, `lib/export-service.ts`, tests | On release, ensure client projection excludes AI Draft, internal rationale, analyst/advisor/compliance notes, raw/unreleased evidence and internal audit. Show release success as “client-safe summary available”, not “client accepted”. | Portal/mobile show only released safe summary after release; before release they show no released content. | `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: release consequence copy, client-safe preview label. | Stop if compliance notes/internal rationale appear in client/API/export payload. |
| `WP06-T10-COMPLIANCE-COPY-NO-OVERCLAIM` | Harden microcopy for compliance states. | Copy is a safety boundary. | `components/internal-workflow-screen.tsx`, shared copy constants, `components/ui/state-panel.tsx`, `product-guidance` if used | Replace ambiguous language: “ready/released/approved” with gate-specific wording. Required terms: “Advisor approved — compliance release required”; “Evidence insufficient”; “Release blocked”; “Client-safe summary available after release”; “Release does not mean client acceptance”. | No touched compliance copy implies release without compliance or client acceptance after release. | Text assertions in `tests/true-ux-p0-safety.spec.ts`, `tests/demo-session-panel-copy.spec.ts` if relevant. | Yes: no-overclaim microcopy. | Stop if copy collapses advisor approval, compliance release and client acceptance. |
| `WP06-T11-PERMISSION-ADMIN-BYPASS-NEGATIVES` | Prove unauthorized roles and admins cannot release. | Admin and route access are not release authority. | `lib/permission-engine.ts`, `app/api/demo-workflow/route.ts`, compliance components, governance components, tests | Add/extend negative cases: admin/security/advisor/analyst/client cannot trigger compliance release unless role is compliance officer and object scope/preconditions pass. UI shows denied/disabled with explanation. | Unauthorized actors cannot release or see forbidden payload; denied attempts audit where required. | `tests/permission-engine.spec.ts`, `tests/demo-workflow-api.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: permission-denied and disabled states. | Stop if admin can force release, evidence sufficiency, visibility or audit suppression. |
| `WP06-T12-P0-COMPLIANCE-RELEASE-PROOF` | Add explicit V0.96 P0 compliance proof. | WP-06 complete only with positive and negative proof. | `tests/p0-acceptance.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/audit-fail-closed.spec.ts` | Positive: evidence sufficient + advisor approved + compliance officer + audit available => release => client-safe projection. Negative: missing evidence, missing advisor approval, wrong role, admin bypass, audit failure, internal payload leakage. | Release path is test-backed and fail-closed. | Named tests in section 16. | Yes: UI state and copy assertions included. | Do not mark WP-06 done without missing-evidence, advisor-not-release, admin-bypass and audit-failure negatives. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Current Route | Scope | WP-06 Treatment |
|---|---|---|---|
| `038` | `/compliance/reviews` | `MVP` | Compliance queue and triage hub. |
| `039` | `/compliance/reviews/:id/decision-room` | `MVP` | Compliance review detail / decision room. |
| `040` | `/compliance/reviews/:id/release` | `MVP` | Release confirmation modal state / action path. |
| `041` | `/compliance/reviews/:id/block` | `MVP` | Block or request evidence modal/action path. |
| `042` | `/compliance/reviews/:id/audit` | `MVP` | Audit and exception log tied to persisted events. |
| `036–037` | Advisor queue/detail | `MVP` predecessor | Required precondition source; do not reimplement advisor WP here. |
| `027–030`, `046–047` | Documents/evidence | `MVP` predecessor/context | Evidence sufficiency source; do not turn upload into release. |
| `019–020` | Portal/mobile | `MVP` downstream | Must fail closed before release and show safe projection only after release. |
| `048–051` | Governance/admin | `MVP` non-bypass context | Negative proof: admin cannot force compliance release. |
| `054–058` | Export | `MVP` later output | Must not receive internal/released state until compliance release and redaction rules allow it. |

### 10.2 Components

| Component | Use in WP-06 |
|---|---|
| `components/internal-workflow-screen.tsx` | Primary compliance queue/review/release/block surface. |
| `components/decisions-governance-screen.tsx` | Compliance block/audit/evidence/decision support if current ownership uses it. |
| `components/page-header.tsx` | Page job/current gate/blocker/next-step if global pattern exists. |
| `components/ux-detail-standard-panel.tsx` | Decision-room summary/detail structure if available. |
| `components/ux-dense-operations-panel.tsx` | Compliance queue/workbench density if available. |
| `components/ux-cta-cluster.tsx` | One-primary-CTA action cluster. |
| `components/ui/guarded-action-button.tsx` | Permission/precondition-aware release/block actions. |
| `components/ui/modal.tsx`, `components/ui/drawer.tsx` | Release/block/request-evidence lifecycle. |
| `components/ui/state-panel.tsx` | Blocked/pending/success/error/permission states. |
| `components/ui/evidence-list.tsx` | Evidence readiness summary. |
| `components/ui/audit-timeline.tsx` | Persisted audit event display / audit unavailable state. |
| `components/ui/a11y-status.tsx` | Live region feedback for modal/action lifecycle if present. |

### 10.3 APIs / Services

| API / Service | Use in WP-06 |
|---|---|
| `app/api/demo-workflow/route.ts` | Existing action transport for compliance release/block/request evidence if current code uses it. |
| `app/api/audit-events/route.ts` | Audit lookup/proof if available. |
| `app/api/documents/review/route.ts` | Evidence review/sufficiency dependency if current code uses it. |
| `lib/demo-workflow-mutation.ts` | Compliance workflow mutations. |
| `lib/demo-workflow-validation.ts` | Action/request validation. |
| `lib/workflow-gate.ts` | Precondition enforcement: advisor approval, evidence sufficiency, release state. |
| `lib/permission-engine.ts` | Role/action/object/tenant authorization and admin non-bypass. |
| `lib/evidence-service.ts`, `lib/evidence-review-service.ts` | Evidence sufficiency/relevance/link/scope state. |
| `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts` | Audit persistence/fail-closed behaviour where available. |
| `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts` | Client-safe projection after release. |
| `lib/export-service.ts`, `lib/export-package-service.ts` | Negative proof that release/external projection excludes internal payload. |

### 10.4 Schema Areas

| Model / Concept | WP-06 Use |
|---|---|
| `ComplianceReview` | Release/block/request evidence status, release notes, evidence complete, timestamps. |
| `Approval` | Advisor approval prerequisite. |
| `Recommendation` | Target of compliance review and advice-boundary status. |
| `Decision` | Released decision/client-safe state after compliance. |
| `EvidenceRecord`, `EvidenceItem`, `DocumentReview`, `DocumentLink` | Evidence sufficiency and linkage prerequisite. |
| `AuditEvent` | Persisted gate-action proof. |
| `Role`, `Permission`, `UserRole`, `AccessRequest`, `SecondConfirmation` | Compliance authority and admin non-bypass. |
| `ExportRequest` | Downstream export must not proceed without release/redaction. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Lifecycle |
|---|---|
| Open compliance decision room | Route load -> permission check -> data load -> show summary/preconditions -> loading/error/empty/permission states. |
| Release action | Trigger -> precondition check -> open modal -> validate confirmation -> submit -> loading -> success/failure -> audit proof -> client-safe release state. |
| Cancel release | Open modal -> cancel/escape/backdrop rules -> no mutation -> preserve previous state. |
| Block release | Trigger -> open modal/drawer -> reason validation -> submit -> loading -> success/failure -> audit proof -> blocked state. |
| Request evidence | Trigger -> specify missing evidence/reason -> submit -> loading -> success/failure -> audit proof -> needs-evidence state. |
| Denied release | Trigger or disabled button -> show denied/blocked reason -> no API state advancement -> optional audit of denied attempt where required. |
| Audit unavailable | Action attempts critical state -> audit unavailable -> fail closed or remain pending -> visible recovery state. |
| Client-safe projection after release | Release success -> derive projection -> show safe availability internally -> client surfaces show only released safe summary. |

---

## 12. State / Feedback / Microcopy Requirements

| State | UI Requirement | Microcopy Rule |
|---|---|---|
| `COMPLIANCE_PENDING` | Show current package waiting for compliance decision. | “Compliance review pending.” |
| `ADVISOR_APPROVAL_MISSING` | Release action disabled/blocked. | “Advisor approval is required before compliance release.” |
| `EVIDENCE_INSUFFICIENT` | Primary action becomes Request Evidence or Keep Blocked. | “Evidence is not sufficient for release.” |
| `EVIDENCE_REVIEW_PENDING` | Release disabled, show review link. | “Evidence exists, but review is not complete.” |
| `AUDIT_UNAVAILABLE` | Critical action blocked/pending. | “Required audit event cannot be confirmed; release remains blocked.” |
| `PERMISSION_DENIED` | Hide/disable release and show denied state. | “Your role cannot release this recommendation.” |
| `RELEASE_READY` | Primary CTA may be Release to Client. | “All release preconditions are satisfied. Confirm compliance release.” |
| `RELEASE_LOADING` | Disable actions and show pending. | “Releasing client-safe summary…” |
| `RELEASE_SUCCESS` | Show release outcome and next step. | “Compliance released the client-safe summary. Client acceptance is not implied.” |
| `COMPLIANCE_BLOCKED` | Show block reason and recovery. | “Release is blocked. Evidence or remediation is required.” |
| `REQUEST_EVIDENCE_SUCCESS` | Show evidence request status. | “Evidence request recorded. Release remains blocked.” |
| `CLIENT_SAFE_AVAILABLE` | Internal UI shows release consequence, client UI receives safe content only. | “Client-safe content is available after compliance release.” |

Forbidden copy examples:

- “Advisor approved, released.”
- “Upload complete, evidence complete.”
- “Export ready” before redaction/approval.
- “Client accepted” after compliance release.
- “Admin override release.”

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-06 Requirement |
|---|---|
| RBAC | Only compliance officer or explicitly permitted compliance role may release/block/request evidence. Route access does not grant action authority. |
| Tenant/object scope | Compliance action must be scoped to the correct tenant/recommendation/decision/evidence object. |
| Advice boundary | No client-visible advice until compliance release and safe projection. |
| AI Draft | AI/rules drafts and internal rationale must remain hidden from client and export payloads. |
| Evidence | Sufficient evidence requires review, link, relevance, scope and acceptance; upload alone is insufficient. |
| Audit | Release/block/request-evidence requires persisted audit or fail-closed pending/blocked behaviour. |
| Client visibility | Derived and fail-closed. No manual visibility toggle. |
| Admin non-bypass | Admin may configure but cannot release, force visibility, mark evidence sufficient or suppress audit. |
| Export | Export is downstream and must not treat compliance page/preview as export approval. |
| API safety | API errors must not advance workflow or leak internal payload. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| `WP06-POS-001` | Compliance queue shows release-ready, blocked/evidence-needed and permission/audit states with one primary next action per item. |
| `WP06-POS-002` | Compliance decision room shows package summary, advisor approval status, evidence sufficiency, audit readiness, permission state, client-safe consequence and primary action. |
| `WP06-POS-003` | Authorized compliance officer can release only when advisor approval, evidence sufficiency, permission and audit preconditions pass. |
| `WP06-POS-004` | Release modal lifecycle includes open, validate, confirm, loading, success/error, cancel and focus/keyboard behaviour. |
| `WP06-POS-005` | Compliance can block or request evidence with reason/evidence need and persisted audit. |
| `WP06-POS-006` | Successful compliance release creates released/client-safe state but does not imply client acceptance or export approval. |
| `WP06-POS-007` | Audit event or audit reference is visible internally after release/block/request evidence. |
| `WP06-POS-008` | Client portal/mobile remain hidden before release and show only safe summary after release. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criteria |
|---|---|
| `WP06-NEG-001` | Upload-only evidence cannot release. |
| `WP06-NEG-002` | Evidence review pending or insufficient blocks release. |
| `WP06-NEG-003` | Missing advisor approval blocks release. |
| `WP06-NEG-004` | Advisor approval alone does not create client visibility. |
| `WP06-NEG-005` | Admin/security/advisor/analyst/client roles cannot release unless explicitly compliance-authorized. |
| `WP06-NEG-006` | Cross-tenant or wrong-object compliance action is denied and does not leak payload. |
| `WP06-NEG-007` | Audit write failure prevents or holds release/block/request evidence. |
| `WP06-NEG-008` | Compliance notes, internal rationale, AI Draft, analyst/advisor notes and raw evidence do not appear in client portal/mobile/export/API payloads. |
| `WP06-NEG-009` | Release modal cancel/escape/backdrop does not mutate release state. |
| `WP06-NEG-010` | UI text never says or implies “client accepted” after compliance release. |

---

## 16. Required Tests and Test Names

Codex must adapt names to current test conventions after WP-00. Suggested names:

| Test File | Required Test |
|---|---|
| `tests/workflow-gate.spec.ts` | `compliance release requires advisor approval and sufficient evidence` |
| `tests/workflow-gate.spec.ts` | `upload-only evidence keeps compliance release blocked` |
| `tests/demo-workflow-api.spec.ts` | `compliance_release returns blocked when preconditions fail` |
| `tests/demo-workflow-api.spec.ts` | `compliance_block records reason and keeps client visibility false` |
| `tests/permission-engine.spec.ts` | `admin cannot bypass compliance release` |
| `tests/permission-engine.spec.ts` | `wrong tenant compliance release is denied without payload leak` |
| `tests/confirmation-lifecycle.spec.ts` | `release modal validates confirm cancel loading error and success states` |
| `tests/confirmation-lifecycle.spec.ts` | `block request evidence modal requires reason and preserves unreleased state` |
| `tests/audit-fail-closed.spec.ts` | `compliance release fails closed when audit cannot persist` |
| `tests/client-visibility-projection.spec.ts` | `client sees safe projection only after compliance release` |
| `tests/true-ux-p0-safety.spec.ts` | `compliance UI does not overclaim advisor approval upload or release` |
| `tests/true-ux-cta-state.spec.ts` | `compliance decision room exposes one primary CTA per gate state` |
| `tests/true-ux-a11y.spec.ts` | `compliance release and block modals have labelled focus-safe lifecycle` |

---

## 17. Validation Commands

Codex must confirm `package.json` scripts before running commands. Suggested commands:

```bash
pnpm typecheck
pnpm lint
pnpm test -- --grep "compliance|workflow-gate|permission|visibility|audit|confirmation|p0|true-ux"
pnpm playwright test tests/confirmation-lifecycle.spec.ts tests/true-ux-p0-safety.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-a11y.spec.ts
```

If project scripts differ, Codex must use the current repo scripts and document the mapping in the WP implementation report.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| No `main` target use | `main` is false-gap only. |
| No duplicate compliance routes | Use current route registry; do not create stale `/compliance/:id/...` duplicates if current routes are `/compliance/reviews/...`. |
| No screen/image generation | Existing assets are references only; no new images/screens. |
| No broad redesign | Refactor only V0.96 compliance surfaces. |
| No upload-to-release shortcut | Upload success never satisfies release. |
| No advisor approval equals release | Advisor approval is only a prerequisite. |
| No release without evidence sufficiency | Evidence must be reviewed, linked, relevant, scoped and accepted. |
| No release without audit where required | Audit failure blocks or holds safety action. |
| No admin bypass | Admin cannot release, force visibility, mark evidence sufficient or suppress audit. |
| No client-visible internals | Compliance notes/internal rationale/AI Draft/raw evidence remain hidden. |
| No manual visibility override | Client visibility is derived and fail-closed. |
| No P1/HOLD elevation | Committee, KYC, suitability and IPS remain out. |
| No blind schema replacement | Use current full-workflow schema first. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Required Handling |
|---|---|
| Does current code already implement `compliance_release` fully? | WP-00/WP06-T01 must classify as `ALREADY_PRESENT`, `PARTIAL` or `CONFLICTING`; harden only gaps. |
| Is audit fail-closed already implemented through `audit-guard`? | Reuse if present; otherwise specify minimal blocking path through existing audit service. |
| Are release/block modals component-state driven or route/query visual states? | Convert to lifecycle only where current code requires; preserve route smoke. |
| Is evidence sufficiency stored in `EvidenceRecord`, `ComplianceReview`, `DocumentReview` or derived service? | Use existing schema/service truth; route schema alignment to WP-14 if insufficient. |
| Is client-safe projection generated in `visibility-engine` or a newer control-layer service? | Use current service; do not create manual client visibility toggle. |
| Does release require second confirmation phrase? | If existing policy says yes, implement; otherwise do not invent destructive phrase requirement without source. |

---

## 20. Codex Execution Notes

1. Start only after WP-00 moving baseline exists.
2. Re-check current route names. Prefer current registry paths over stale prompt examples.
3. Reuse existing UX helpers and shared primitives before adding components.
4. Keep compliance as a decision room, not a new route family.
5. Make blockers visible in the header/summary, not buried in secondary panels.
6. One primary CTA per state. If release is blocked, the primary CTA is not release.
7. Release/block/request-evidence are safety actions and must be audited.
8. Client-safe projection must be tested after release and before release.
9. Write negative tests first where possible: missing evidence, advisor missing, admin bypass, audit failure.
10. If schema is insufficient, stop and route to WP-14 rather than creating unapproved models.

---

## 21. QA Matrix

| QA Check | Required | Pass Criteria |
|---|---|---|
| Source hierarchy preserved | Yes | `full-workflow` current repo/snapshot is target; `main` not used. |
| WP-00 predecessor respected | Yes | Current compliance delta known before edits. |
| Route registry current | Yes | Routes `038–042` checked and no stale duplicates created. |
| Compliance release gate safe | Yes | Release only after advisor/evidence/permission/audit preconditions. |
| UI/UX/IA refactor embedded | Yes | Decision-room layout, page job, blocker, CTA, modal lifecycle, honest copy. |
| No visual-only proof | Yes | Buttons/chips/modals not treated as behaviour proof. |
| Modal lifecycle complete | Yes | Trigger/open/validate/confirm/loading/error/success/cancel/focus. |
| Audit persistence addressed | Yes | Persisted audit event or fail-closed blocker. |
| Client leakage prevented | Yes | Internal notes/AI Draft/compliance notes/raw evidence absent from client/export. |
| Admin non-bypass proven | Yes | Admin cannot release/force visibility/suppress audit. |
| Positive tests included | Yes | Authorized release path passes. |
| Negative tests included | Yes | Missing evidence/advisor/wrong role/admin/audit failure/internal leakage fail safely. |
| No generation / broad redesign | Yes | No screens/images/new visual assets. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB / UX discovery | Identified compliance as release decision-room problem, not just route surface. | Locked relevant artefacts, route IDs, safety gates and stop rules. | Selected compliance release/block/request-evidence as the concrete WP scope. |
| Contradiction control | Separated visual modal modes from true lifecycle and release copy from release proof. | Converted contradictions into negative acceptance criteria and stop rules. | Required release modal lifecycle and fail-closed tests. |
| IA / layout reasoning | Mapped long-page/CTA/page-job issues into decision-room layout. | Operationalized summary-first layout, precondition checklist and one primary CTA. | Produced concrete component and route implementation tasks. |
| Safety reasoning | Preserved no-upload-to-release, advisor-not-release, admin-non-bypass and client-safe visibility. | Mapped each safety rule to files, tests and acceptance criteria. | Forced missing-evidence/advisor/admin/audit-failure negatives. |
| Task decomposition | Identified surface, service, API, schema and test dependencies. | Built task table with files, steps, acceptance, tests and stop rules. | Removed broad alternatives and produced implementable WP instructions. |
| QA | Checked for no generation, no broad redesign, no schema replacement, no P1/HOLD elevation. | Built QA matrix and validation commands. | Marked the artefact ready for Codex after WP-00 rebase only. |
