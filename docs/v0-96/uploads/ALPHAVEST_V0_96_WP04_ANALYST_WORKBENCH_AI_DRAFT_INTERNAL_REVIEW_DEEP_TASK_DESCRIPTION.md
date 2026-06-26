# ALPHAVEST_V0_96_WP04_ANALYST_WORKBENCH_AI_DRAFT_INTERNAL_REVIEW_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 05 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-04 — Analyst Workbench + AI Draft Internal Review`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP04_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_ANALYST_WORKBENCH_AI_DRAFT_INTERNAL_REVIEW_AFTER_WP00_REBASE`

`WP-04` turns the analyst workflow surface into a real internal review workbench for the AlphaVest V0.96 proof spine. The analyst must be able to inspect an internal AI/rules draft, identify unsupported claims, request evidence, reject or rebuild the draft, add internal-only notes and send a reviewed item toward advisor approval only when preconditions are satisfied.

This task does **not** implement autonomous advice. It does **not** make AI output client-visible. It does **not** release anything to the client. It does **not** generate new screens or visual assets. It specifies how Codex must implement or harden the existing `full-workflow` analyst/workbench surfaces while folding in the known UX/IA/layout problems from the Knowledge Base.

The core product rule for this WP is:

```text
AI/rules draft supports internal preparation only. Analyst review is a human-control gate. Analyst-reviewed is not advisor-approved. Advisor-approved is not compliance-released. Nothing from the AI draft, internal rationale or analyst notes may leak to client-facing views, exports or client-safe APIs.
```

This WP is P0 because AlphaVest’s V0.96 claim depends on proving that AI-assisted internal preparation is controlled by evidence and human review rather than exposed as automated financial advice.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-04 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect actual files, routes, APIs, components, tests and schema before edits | Do not infer missing work from old `main` or stale KB counts |
| 2 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and implemented WP-00 output | Mandatory predecessor | Current repo delta, existing analyst/AI/workflow/UX status classification | Starting implementation before WP-00 rebase |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | UX/IA evidence register | Known UI/UX/layout/IA problem families and WP mapping | Inventing unsupported UX problems |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-04 goal, target modules, acceptance, tests and stop rules | Treating the source task pack as implementation proof |
| 5 | `ALPHAVEST_V0_96_WP01...` and `ALPHAVEST_V0_96_WP02...` | IA and density predecessors | Journey-first app shell, page header, page type and density rules | Rebuilding global navigation/page-type system inside WP-04 |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Route/scope/state controls | V0.96 workset, route status, state requirements | Elevating P1/HOLD/reference-only routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback controls | Modal/drawer/action lifecycle, loading/error/success/cancel states, no-overclaim copy | Treating visible buttons/modals/status chips as behaviour proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Core safety contract | AI Draft internal-only, fail-closed client visibility, role/action/payload separation | Client-visible AI Draft, internal rationale or analyst notes |
| 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Evidence linkage and audit expectation for analyst actions | Draft rebuild/rejection with no evidence/audit route where required |
| 10 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | API hardening, schema field mapping and P0 positive/negative proof obligations | Claiming API/schema/test presence already proves WP-04 |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey priority source | `MJ-003` AI draft rejected/rebuilt with evidence and `MJ-001` umbrella first decision path | Pulling committee/KYC/suitability/IPS into this WP |
| 12 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | False-gap warning only | Detect stale assumptions | Any target implementation task or absence claim |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-04 Task Implication |
|---|---|---|---|---|---|
| AI/rules draft is allowed only as internal preparation. | MVP Scope Lock; RBAC/Visibility/Advice Boundary Contract; Journey Requirements Matrix | WP-04, `InternalWorkflowScreen` | Advice-boundary / safety | Critical | Every AI draft panel, API payload, client projection and export path must mark AI draft as internal-only and exclude it from client-safe surfaces. |
| `MJ-003` is a core V0.96 journey: AI draft rejected and rebuilt with evidence. | Mega Journey Priority Lock; MVP Journey Requirements Matrix | Analyst Workbench, Signal/Workbench routes | Journey proof | Critical | WP-04 must implement the reject/rebuild/needs-evidence path, not just show AI confidence or draft text. |
| Human review must separate analyst review from advisor approval and compliance release. | MVP Scope Lock; Workflow Gate/P0 Contracts | Workbench → Advisor → Compliance | Gate separation | Critical | Analyst actions can route to advisor but must not approve or release. |
| Internal rationale, analyst notes and AI Draft are not client payloads. | RBAC/Visibility Contract; Evidence/Audit/Export Contract | Client portal/mobile/export projection | Payload visibility | Critical | Negative tests must prove absence from portal/mobile/export responses and UI. |
| Existing workbench/signal/approval surfaces are spread and may lack journey status clarity. | V0.96 UX/IA Refactor Source; Prompt 00 Evidence Register | `/signals`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval` | IA / page job / workflow clarity | High | Refactor the touched analyst surfaces into queue/detail/workbench decision flow with current gate, blocker and next step. |
| Long pages and route-catalog feel must be corrected where surfaces are touched. | WP-01/WP-02; UX/IA Evidence Register | Internal workflow routes | Layout / navigation / density | High | Split or structure workbench content: summary first, queue/detail, secondary context in tabs/drawers, one primary CTA per state. |
| Status chips are labels, not gates. | Feedback Contract; Prompt 00 | Draft status chips, confidence labels | False proof / UX overclaim | Critical | Status indicators must be derived from workflow service/gate state and tested; chip text cannot imply gate completion. |
| No-overclaim microcopy is a safety surface. | Feedback Contract | AI draft/review success/error copy | Copy / safety | High | Copy must say “Draft rebuilt for advisor review” or “Evidence required”, never “Advice ready for client”. |
| Tables/filters/kanban and state panels are often visual support only. | Interaction Reality Audit | Workbench queue, Signal list, Action list | Interaction lifecycle | High | Implement real loading/empty/error/permission/blocked states and avoid unimplemented filter/kanban claims. |
| Modal/drawer primitives exist but lifecycle proof is partial. | Drawer/Modal Interaction Contract | Reject/rebuild/request evidence flows | Interaction lifecycle | High | Any modal/drawer used for analyst action needs open/cancel/submit/loading/error/success/focus semantics. |
| P0 tests are proof slices only. | P0 Test Acceptance Matrix | `workflow-gate`, `typed-workflow-api`, true-UX tests | Acceptance proof | Critical | Add/update targeted positive and negative tests for AI internal-only and analyst gate behaviour. |

---

## 4. Current Code / Route / Component Reality to Recheck

WP-04 must begin only after WP-00 has produced the moving-baseline register. Codex must not implement this WP if WP-00 has not classified the current analyst/workflow files and test coverage as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` or `BLOCKED`.

### 4.1 Snapshot reality observed from available `full-workflow` ZIP

The available snapshot already contains several WP-04-relevant surfaces. These must be inspected and reused before adding anything:

| Area | Snapshot Evidence | Treatment in WP-04 |
|---|---|---|
| Analyst/workflow UI | `components/internal-workflow-screen.tsx` exists and is large. | Treat as primary surface to refactor/harden; do not create parallel workbench unless WP-00 proves current structure cannot support V0.96. |
| UX helpers | `components/ux-detail-standard-panel.tsx`, `components/ux-cta-cluster.tsx`, `components/ui/state-panel.tsx`, `components/ui/guarded-action-button.tsx` exist. | Reuse for page job, density, CTA and state feedback rather than building one-off UI patterns. |
| Typed workflow API | `deleted generic workflow route` exists and is substantial. | Inspect current actions before adding/renaming actions; preserve API contract and safe error behaviour. |
| Workflow services | `lib/internal-workflow-demo-data.ts`, `lib/typed-workflow-command-bus.ts`, `lib/workflow-gate.ts`, `lib/visibility-engine.ts`, `lib/audit-service.ts` exist. | Reuse/harden existing workflow/gate/visibility/audit concepts; do not bypass them in UI state. |
| Tests | `tests/recommendation-review-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-client-projection.spec.ts` exist. | Extend existing proof slices with WP-04 positive and negative assertions. |

### 4.2 Files / modules to inspect before edits

| Area | Files / Modules | Recheck Purpose |
|---|---|---|
| Route and IA policy | `lib/route-registry.ts`, `lib/navigation.ts`, `lib/ux-route-policy.ts` | Confirm V0.96 analyst routes, nav grouping and journey-first labels from WP-01. |
| Analyst UI | `components/internal-workflow-screen.tsx` | Locate signal/workbench/trigger/advisor rendering branches, current draft panels, CTA clusters, state chips and queue/detail layout. |
| Detail/layout helpers | `components/ux-detail-standard-panel.tsx`, `components/ux-cta-cluster.tsx`, `components/ux-secondary-context-tabs.tsx`, `components/product-guidance-panel.tsx` | Reuse page-type and density system from WP-02. |
| State/action helpers | `components/ui/state-panel.tsx`, `components/ui/guarded-action-button.tsx`, `components/ui/modal.tsx`, `components/ui/drawer.tsx` | Implement honest states and guarded analyst actions without visual-only controls. |
| Workflow API | `deleted generic workflow route` | Confirm action names, validation, state transitions, no-client-release flags, audit IDs and safe error shapes. |
| Services/gates | `lib/internal-workflow-demo-data.ts`, `lib/typed-workflow-command-bus.ts`, `lib/recommendation-review-workflow-validation.ts`, `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/visibility-engine.ts`, `lib/audit-service.ts` | Confirm analyst action preconditions, role checks, AI draft visibility and audit path. |
| Client/export projection | `lib/visibility-engine.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `components/client-intake-screen.tsx`, `components/communication-export-ops-screen.tsx` | Verify AI Draft/internal rationale never appear in client/export surfaces after analyst actions. |
| Schema | `prisma/schema.prisma` | Confirm fields/enums for `Trigger`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `EvidenceRecord`, `AuditEvent`. |
| Tests | `tests/recommendation-review-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts` | Identify existing coverage and add missing positive/negative/UX tests. |

### 4.3 Current reality labels Codex must assign before implementation

| Label | Meaning |
|---|---|
| `ALREADY_PRESENT` | Fully satisfies WP-04 requirement and has tests. |
| `PARTIAL` | Exists but lacks lifecycle, state, UI, safety or tests. |
| `MISSING` | Required WP-04 behaviour not present. |
| `CONFLICTING` | Existing behaviour violates source-of-truth or safety rules. |
| `BLOCKED` | Cannot proceed without WP-00/WP-01/WP-02 output or approved schema/API decision. |

---

## 5. WP Problem Statement

The current app contains internal workflow screens and workflow services, but V0.96 cannot treat visible workflow cards, AI confidence labels, status chips or demo actions as proof that AI-assisted advisory preparation is controlled. The analyst workbench must show a clear, human-controlled flow:

```text
Signal / trigger → AI/rules draft internal-only → analyst review → unsupported claim / needs evidence / rebuild / reject → evidence-linked reviewed draft → send to advisor
```

The UI problem is not only “add fields”. The known UX/IA problems must be corrected while Codex touches the surface:

- signal/workbench routes must not feel like a route catalogue or static board;
- page header must say what the page is for, current gate, blocker and next step;
- workbench queue and detail must be separated or clearly structured;
- long internal pages must be made more usable through summary-first sections, density tiers and secondary context tabs/drawers;
- each workflow state must have one primary CTA;
- AI confidence must not be presented as advice quality or client-readiness;
- success copy must never imply autonomous advice, advisor approval or client release.

---

## 6. V0.96 Journey Role

| Journey / Spine | WP-04 Role |
|---|---|
| `MJ-003 — AI draft rejected and rebuilt with evidence` | Primary work package. This WP implements the internal AI Draft review, unsupported claim, evidence-needed, reject/rebuild and send-to-advisor path. |
| `MJ-001 — New Family Office onboarding to first client-safe decision` | Provides the analyst-review bridge between evidence intake and advisor approval. |
| `MJ-002 — Evidence missing to client upload to release` | Consumes evidence status and requests additional evidence when draft support is insufficient. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Analyst actions must be tenant/object/role scoped and denied/audited when unauthorized. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Admin must not be able to mark analyst-reviewed or client-visible by role override. |
| `MJ-005 — Export package with forbidden internal payload redaction` | WP-04 must ensure AI Draft/internal notes are excluded from later export package. |

WP-04 is **not** responsible for full advisor approval (WP-05), compliance release (WP-06), final client projection (WP-07) or export implementation (WP-10), but it must supply safe upstream state and data for those WPs.

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-04 Manifestation | Required Refactor in WP-04 | Must Refactor Now? |
|---|---|---|---|
| Route-catalog navigation vs journey-first IA | Signals, workbench and trigger detail may appear as independent pages instead of one analyst journey step. | Use WP-01 navigation/page header model: `Analyst Review` or `Draft Review` as journey context with current gate and next step. | Yes, where these routes are touched. |
| Long pages / excessive scroll | `internal-workflow-screen.tsx` may combine queue, detail, notes, evidence and actions. | Use summary-first layout; split queue/detail within page or route branch; place secondary context in tabs/drawers. | Yes. |
| Too much empty/unused space | Sparse workbench states may show decorative cards without action. | Add truthful zero state: no drafts pending, next work, blocked reason, evidence needed. No filler metrics. | Yes. |
| Weak page job / page header | Workbench may not explain whether analyst is reviewing, rebuilding or sending to advisor. | Header must show page job, current gate, blocker and next step. | Yes. |
| Too many equal CTAs | Multiple buttons can compete: reject, rebuild, request evidence, send to advisor. | One primary CTA per state; secondary actions demoted to CTA cluster/drawer. | Yes. |
| Visual-only AI state | AI confidence or draft card can appear as proof. | Use explicit internal-only badge and evidence-support status; no AI confidence theatre. | Yes. |
| Unsupported claim handling unclear | Unsupported claims may be shown as text without action path. | Render unsupported claims as blockers with recovery CTA: `Request evidence`, `Reject draft`, `Rebuild draft`. | Yes. |
| Status chips pretending to be gates | `reviewed`, `ready`, `approved` chips may overclaim. | Chips must derive from workflow gate state; copy must avoid client/advice readiness claims. | Yes. |
| Modal/drawer lifecycle missing | Reject/rebuild/request evidence may use partial visual overlays. | Any overlay must have open/cancel/submit/loading/error/success/focus path. | Yes if overlay is used. |
| Client-visible internal data risk | Internal draft/rationale/analyst notes may bleed into portal/export. | Explicit redaction boundaries and negative tests. | Critical. |
| No-overclaim microcopy | Success after rebuild could imply advice created. | Copy must say “Draft updated for advisor review” or “Evidence request created”; never “advice ready”. | Yes. |
| True UX / state proof missing | UI can display static states not backed by service/API/test. | Use service/API/state truth and add tests for states. | Yes. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes now

| Area | Included in WP-04 |
|---|---|
| Analyst workbench IA | Queue/detail/workbench structure for internal draft review surfaces. |
| Page header | Page job, current gate, blocker and next step for analyst review routes. |
| AI Draft panel | Explicit internal-only label, unsupported claim state, evidence-support state, redaction warning. |
| Analyst actions | Request evidence, reject draft, rebuild draft, send to advisor as guarded actions. |
| State model | `draft_review`, `needs_evidence`, `unsupported_claim`, `rebuild_required`, `rebuilt`, `ready_for_advisor`, `blocked`, `permission_denied`, `error`, `empty`. |
| Evidence linkage | Draft rebuild or readiness references linked evidence where available. |
| UI density | Internal workbench density: compact queue, detailed review pane, secondary context tabs/drawers. |
| Microcopy | Internal-only and no-overclaim wording across touched analyst UI. |
| Tests | Workflow gate, API, client projection, CTA state, true-UX density/visibility tests. |

### 8.2 Stays out

| Area | Reason |
|---|---|
| Full production AI integration | V0.96 only proves internal AI/rules draft control; no autonomous advice engine. |
| Client-visible AI explanation | Violates internal-only AI Draft boundary. |
| Advisor approval implementation | WP-05. WP-04 may route to advisor state only. |
| Compliance release/block implementation | WP-06. WP-04 must not release. |
| Client projection implementation | WP-07. WP-04 must protect inputs and redaction only. |
| Export implementation | WP-10. WP-04 must prevent later export leakage. |
| Committee review / KYC / Suitability / IPS | HOLD/P2 routes; do not elevate. |
| New visual/screenshot generation | Explicitly forbidden. |
| Blind schema replacement | Use existing full-workflow schema; schema changes require WP-14 decision protocol. |
| Broad redesign | Refactor only touched analyst surfaces with existing design system/UX helpers. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP04-T01-REBASE-CURRENT-ANALYST-REALITY` | Classify current analyst workflow implementation before edits. | Older KB may undercount current repo capabilities; WP-00 must be honoured. | `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`, `lib/typed-workflow-command-bus.ts`, `tests/*workflow*`, WP-00 delta output | Record current routes, workflow actions, draft fields, tests and UX components. Mark each WP-04 requirement `ALREADY_PRESENT/PARTIAL/MISSING/CONFLICTING/BLOCKED`. | No implementation begins until classification exists. | No new tests; produce/update delta register only. | Audit only. | If WP-00 not run, stop. |
| `WP04-T02-MAP-ANALYST-ROUTES-TO-JOURNEY-STEP` | Ensure analyst pages are treated as a journey step, not route catalogue. | Workbench/signal routes are part of `MJ-003`. | `lib/route-registry.ts`, `lib/navigation.ts`, `components/internal-workflow-screen.tsx`, WP-01 outputs | Map `/signals`, `/workbench`, `/workbench/triggers/:id` to `Analyst Review / Draft Review` context. Add/adjust metadata only if WP-01 pattern exists. | Analyst routes show journey context and do not promote P1/HOLD routes. | `tests/true-ux-navigation.spec.ts` if present; otherwise extend route smoke/UX nav test. | Yes. | Do not reclassify route scope. |
| `WP04-T03-REFORM-PAGE-HEADER-JOB-GATE-BLOCKER-NEXT` | Add useful page header semantics to analyst surfaces. | Page header must do work. | `components/internal-workflow-screen.tsx`, `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `components/ux-detail-standard-panel.tsx` | Show page job, current gate, blocker and next step. Use existing helpers from WP-01/WP-02. | Header explains whether draft is unsupported, needs evidence, under review, rebuilt or ready for advisor. | `tests/true-ux-state-feedback.spec.ts` or `tests/true-ux-p0-safety.spec.ts`. | Yes. | Do not add decorative header copy that is not state-driven. |
| `WP04-T04-SPLIT-QUEUE-DETAIL-STRUCTURE` | Reduce long/conflated workbench sprawl. | Internal workbench needs compact queue and detailed review area. | `components/internal-workflow-screen.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-secondary-context-tabs.tsx`, `components/ui/data-table.tsx` | Structure page into queue summary, selected draft detail, evidence support, internal notes, actions. Move secondary context to tabs/drawers. | Above-fold user can see item, gate, blocker and primary action. | `tests/true-ux-density.spec.ts`, `tests/route-smoke.spec.ts`. | Yes. | Do not create new screens/assets. |
| `WP04-T05-IMPLEMENT-INTERNAL-ONLY-AI-DRAFT-PANEL` | Make AI/rules draft visibly internal-only and not advice. | AI Draft cannot be client visible. | `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`, `lib/visibility-engine.ts` | Add internal-only label, rationale boundary, source/evidence support markers and no-client warning. Avoid “recommended to client” language. | UI states clearly mark AI/rules draft as internal preparation. | `tests/true-ux-p0-safety.spec.ts`, client projection negative test. | Yes. | Stop if copy implies autonomous/client advice. |
| `WP04-T06-UNSUPPORTED-CLAIM-BLOCKER-STATES` | Surface unsupported claims as blockers with recovery paths. | `MJ-003` requires rejected/rebuilt with evidence. | `components/internal-workflow-screen.tsx`, `lib/workflow-gate.ts`, `lib/internal-workflow-demo-data.ts`, `components/ui/state-panel.tsx` | Add states for unsupported claim, needs evidence, evidence insufficient. Show blocker reason and one primary recovery CTA. | Unsupported claims cannot be sent to advisor without recovery/evidence path. | `tests/workflow-gate.spec.ts`, UI state test. | Yes. | Do not let status chip alone unblock flow. |
| `WP04-T07-GUARDED-ANALYST-ACTIONS` | Implement analyst reject/rebuild/request-evidence/send-to-advisor as guarded actions. | Analyst actions are human-control steps, not release. | `components/ui/guarded-action-button.tsx`, `components/ux-cta-cluster.tsx`, `deleted generic workflow route`, `lib/typed-workflow-command-bus.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts` | Wire actions through existing API/service; include role/object preconditions, loading/error/success feedback and audit expectation where supported. | Wrong role/object denied; action changes only analyst/advisor-routing state, not client visibility. | `tests/recommendation-review-workflow-api.spec.ts`, `tests/permission-engine.spec.ts`, `tests/true-ux-cta-state.spec.ts`. | Yes. | Stop if action releases to client or skips advisor/compliance. |
| `WP04-T08-EVIDENCE-LINK-ON-REBUILD` | Link rebuilt draft to evidence references when available. | Rebuild must be evidence-backed, not AI confidence theatre. | `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `lib/typed-workflow-command-bus.ts`, `lib/workflow-gate.ts`, schema models for Recommendation/Evidence | Use existing evidence relation/service if present; show evidence link status. If missing, document dependency for WP-03/WP-14, do not invent schema blindly. | Rebuilt draft can identify supporting evidence or remains `needs_evidence`. | `tests/workflow-gate.spec.ts`, evidence/review tests if present. | Indirect UI. | Stop if schema change is required without decision. |
| `WP04-T09-ANALYST-NOTES-INTERNAL-ONLY` | Prevent analyst notes/internal rationale from entering client/export payloads. | Internal notes are safety-sensitive. | `components/internal-workflow-screen.tsx`, `lib/visibility-engine.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, client/export components | Tag internal notes; verify projection/export services exclude them. Add tests for absence. | Analyst notes visible only to authorized internal roles. | `tests/true-ux-client-projection.spec.ts`, `tests/export-safety.spec.ts` if present. | Yes, label and separation. | Stop if client/export receives analyst notes. |
| `WP04-T10-MODAL-DRAWER-LIFECYCLE-FOR-REJECT-REBUILD` | Harden overlays used by analyst actions. | Visible modal/drawer is not lifecycle proof. | `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/internal-workflow-screen.tsx`, `components/ux-cta-cluster.tsx` | If modal/drawer is used, implement open/cancel/submit/loading/validation/error/success and focus/escape expectations. | Overlay cannot silently mutate; cancel preserves state; submit validates reason/evidence where required. | `tests/interaction-lifecycle.spec.ts` if present; true-UX interaction test. | Yes. | Do not add overlay if inline action/state is clearer. |
| `WP04-T11-NO-OVERCLAIM-MICROCOPY` | Replace misleading analyst workflow copy. | Copy is a safety surface. | `components/internal-workflow-screen.tsx`, shared copy constants if any | Use copy such as “Internal draft”, “Evidence required”, “Draft rebuilt for advisor review”, “Ready for advisor review”. Avoid “advice ready”, “client ready”, “released”. | No touched copy implies client-visible advice before advisor/compliance gates. | Text assertions in true-UX/P0 tests. | Yes. | Stop if copy overclaims. |
| `WP04-T12-P0-AND-TRUE-UX-PROOF` | Add/extend required tests for WP-04. | Existing tests are proof slices only. | `tests/recommendation-review-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts` | Add positive and negative tests listed in sections 14–16. Ensure test names clearly map to WP-04. | All WP-04 positive/negative tests pass and fail for expected regressions. | Full WP-04 test set. | Yes, true-UX tests. | Do not mark WP complete without negative leakage tests. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route | Scope | WP-04 Treatment |
|---|---|---|
| `/signals` | V0.96 analyst workflow / requires scope confirmation from current route lock | Signal queue / draft intake context; avoid route-catalog feel. |
| `/workbench` | V0.96 analyst workbench | Primary analyst queue/workbench surface. |
| `/workbench/triggers/:id` | V0.96 analyst detail | Draft/detail surface with unsupported claim, evidence support and primary CTA. |
| `/advisor-approval` and `/advisor-approval/:id` | WP-05 | WP-04 may route to advisor pending; implementation of advisor review belongs to WP-05. |
| `/portal`, `/mobile` | WP-07 | Used only for negative projection tests: AI Draft/internal notes absent. |
| `/export/*` | WP-10 | Used only for negative export leakage tests. |

### 10.2 Components

| Component | Role |
|---|---|
| `components/internal-workflow-screen.tsx` | Primary workbench/detail implementation surface. |
| `components/ux-detail-standard-panel.tsx` | Detail layout for selected draft/review object. |
| `components/ux-cta-cluster.tsx` | One-primary-CTA and secondary action grouping. |
| `components/ux-secondary-context-tabs.tsx` | Move secondary context out of main vertical sprawl where available. |
| `components/product-guidance-panel.tsx` | Page job/current gate/blocker/next step guidance where available. |
| `components/ui/state-panel.tsx` | Loading/empty/error/permission/blocked/needs-evidence states. |
| `components/ui/guarded-action-button.tsx` | Role/gate-aware analyst actions. |
| `components/ui/modal.tsx`, `components/ui/drawer.tsx` | Optional reject/rebuild/request-evidence action lifecycles. |
| `components/client-intake-screen.tsx` | Negative projection verification only; no client-facing AI draft. |
| `components/communication-export-ops-screen.tsx` | Negative export verification only; no internal AI content. |

### 10.3 APIs / Services

| API / Service | WP-04 Use |
|---|---|
| `deleted generic workflow route` | Existing action transport for analyst/rebuild/request-evidence/send-to-advisor where available. |
| `lib/typed-workflow-command-bus.ts` | Workflow mutation baseline; must not bypass gates. |
| `lib/recommendation-review-workflow-validation.ts` | Request/action validation baseline. |
| `lib/internal-workflow-demo-data.ts` | Current data/readmodel for drafts/triggers/recommendations. |
| `lib/workflow-gate.ts` | Gate preconditions for analyst/advisor/compliance separation. |
| `lib/permission-engine.ts` | Role/action/object authorization. |
| `lib/visibility-engine.ts` | Redaction/client-safe projection boundary. |
| `lib/audit-service.ts` | Audit event persistence or audit expectation for analyst actions. |
| `lib/evidence-service.ts`, `lib/evidence-review-service.ts` | Evidence support/rebuild linkage if available. |
| `lib/export-service.ts`, `lib/export-package-service.ts` | Negative forbidden-payload exclusion verification. |

### 10.4 Schema areas

Do not replace schema. Recheck existing fields before any schema-related proposal.

| Model / Concept | WP-04 Need |
|---|---|
| `Trigger` | Source signal/draft trigger and status. |
| `Recommendation` | Internal summary, client draft summary, status, evidence support, advisor/compliance refs. |
| `RecommendationOption` | Internal options if used by draft detail. |
| `DocumentExtraction` / `EvidenceRecord` | Evidence support and confidence/source linkage. |
| `Approval` | Downstream advisor approval separation only. |
| `ComplianceReview` | Downstream release separation only. |
| `Decision` | Downstream decision record only. |
| `AuditEvent` | Analyst action events and denial events. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Trigger | Preconditions | Loading | Validation | Success | Error / Retry | Cancel / Close | Safety Rule |
|---|---|---|---|---|---|---|---|---|
| Request Evidence | Analyst clicks primary CTA when draft lacks support. | Analyst role; scoped trigger/recommendation; missing/insufficient evidence state. | Button/spinner and disabled duplicate submit. | Required reason and target evidence gap. | “Evidence request created. Draft remains internal.” | Preserve reason; retry allowed. | Cancel preserves draft state. | Does not release or send to client. |
| Reject Draft | Analyst rejects unsupported draft. | Analyst role; unsupported claim or unacceptable draft state. | Pending reject state. | Required rejection reason. | “Draft rejected. No client-visible advice created.” | Error leaves draft unchanged. | Cancel preserves state. | Audit expected where service supports it. |
| Rebuild Draft | Analyst initiates evidence-backed rebuild. | Analyst role; rebuild allowed by workflow gate; evidence reference or reason when no evidence. | Pending rebuild state. | Reason/evidence reference if required. | “Draft rebuilt for advisor review.” | Error keeps prior draft; retry allowed. | Cancel preserves state. | Rebuild stays internal. |
| Send to Advisor | Analyst sends reviewed draft to advisor queue. | Draft reviewed; unsupported claims resolved or evidence requested; workflow gate passes. | Pending send state. | Gate and permission checks. | “Sent to advisor review. Not released to client.” | Error leaves item in analyst review. | Not applicable after submit success. | No client visibility. |
| Open internal notes | Analyst views/adds notes. | Authorized internal role only. | Optional. | Required note body if saving. | “Internal note saved.” | Error preserves text. | Close without saving warns if dirty where pattern exists. | Notes never client/export visible. |

---

## 12. State / Feedback / Microcopy Requirements

### 12.1 Required states

| State | UI Intent | Required Copy Pattern |
|---|---|---|
| `draft_review` | Analyst is reviewing internal draft. | “Internal draft under analyst review.” |
| `unsupported_claim` | Draft contains unsupported claim. | “Unsupported claim blocks advisor review until evidence or rebuild is provided.” |
| `needs_evidence` | Evidence support is missing/insufficient. | “Evidence required before this draft can move forward.” |
| `evidence_linked` | Draft has linked evidence but still needs review. | “Evidence linked. Analyst review still required.” |
| `rebuilt` | Draft rebuilt internally. | “Draft rebuilt for advisor review. Not client-visible.” |
| `ready_for_advisor` | Analyst preconditions passed. | “Ready for advisor review. Compliance release still required later.” |
| `permission_denied` | Actor lacks analyst/action scope. | “You do not have permission to perform this analyst action.” |
| `blocked` | Workflow gate blocks progression. | “Blocked: resolve the listed preconditions before continuing.” |
| `empty` | No analyst review items. | “No drafts require analyst review right now.” |
| `error` | API/service failure. | “Action could not be completed. No workflow state was advanced.” |

### 12.2 Forbidden copy patterns

| Forbidden Copy | Reason | Safer Alternative |
|---|---|---|
| “AI advice ready” | Implies autonomous/client advice. | “Internal draft ready for analyst review.” |
| “Released to client” after analyst action | Analyst cannot release. | “Sent to advisor review.” |
| “Approved” for analyst review | Confuses with advisor/compliance gates. | “Analyst reviewed” or “Ready for advisor review.” |
| “Evidence complete” when only linked | Overclaims evidence sufficiency. | “Evidence linked; sufficiency review pending.” |
| “Client-ready summary generated” from AI draft | AI draft internal-only. | “Internal summary generated; client-safe projection requires compliance release.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-04 Requirement |
|---|---|
| RBAC | Analyst actions require role, tenant, object and workflow state permission. Route access alone is insufficient. |
| Client Visibility | AI Draft, internal rationale, analyst notes and unsupported claim details must not be included in client-facing routes or client-safe projections. |
| Advice Boundary | Analyst review is internal preparation. It cannot create client advice or release. |
| Evidence | Unsupported claims and rebuilds must show whether evidence is missing, linked, insufficient or sufficient for the analyst stage. Evidence sufficiency itself is WP-03/WP-06 dependent. |
| Audit | Reject/rebuild/request-evidence/send-to-advisor actions must write or route audit events where existing audit service supports it. If audit is required and unavailable, the action must not silently succeed. |
| Export | AI Draft/internal rationale/analyst notes must be excluded from export payloads and package manifest. |
| Admin Non-Bypass | Admin role must not mark analyst-reviewed or client-visible outside the workflow gate. |
| API Safety | Typed workflow actions must validate action payload, actor context, tenant/object scope and safe errors. |
| Schema | Use existing schema fields; do not create `AiDraft` patch model blindly. If field mapping is inadequate, document WP-14 blocker. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| `WP04-POS-01` | Analyst workbench route shows page job, current gate, blocker and next step for a draft under review. |
| `WP04-POS-02` | AI/rules draft is visibly marked `internal-only` with no client-release wording. |
| `WP04-POS-03` | Unsupported claim state blocks progression to advisor until evidence/rebuild/rejection path is taken. |
| `WP04-POS-04` | Analyst can request evidence from a needs-evidence state through a guarded action with loading/success/error feedback. |
| `WP04-POS-05` | Analyst can reject a draft with required reason, and the state remains internal. |
| `WP04-POS-06` | Analyst can rebuild a draft and link or reference evidence when evidence exists. |
| `WP04-POS-07` | Analyst can send a reviewed draft to advisor review only when workflow-gate preconditions pass. |
| `WP04-POS-08` | Successful send-to-advisor copy says advisor review is next and does not imply client release. |
| `WP04-POS-09` | Workbench layout follows compact internal page density with primary task visible above the fold. |
| `WP04-POS-10` | Secondary context is accessible without overwhelming the main decision area. |
| `WP04-POS-11` | Analyst action audit event or audit reference is persisted/routed where required by service contract. |
| `WP04-POS-12` | Existing V0.96 route scope is preserved; no P1/HOLD routes are promoted. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criteria |
|---|---|
| `WP04-NEG-01` | AI Draft text is not visible in `/portal` or `/mobile` before or after analyst action unless later client-safe projection explicitly excludes AI draft and uses released summary. |
| `WP04-NEG-02` | Internal rationale is absent from client-safe projection payloads. |
| `WP04-NEG-03` | Analyst notes are absent from client-facing UI and export payloads. |
| `WP04-NEG-04` | Analyst `send to advisor` does not create advisor approval, compliance release or client visibility. |
| `WP04-NEG-05` | Unsupported claim cannot be sent to advisor without resolving workflow preconditions. |
| `WP04-NEG-06` | Wrong role or wrong tenant cannot reject, rebuild, request evidence or send to advisor. |
| `WP04-NEG-07` | Admin role cannot bypass analyst review gate by direct action. |
| `WP04-NEG-08` | Failed analyst action does not advance workflow state. |
| `WP04-NEG-09` | Missing audit when audit is required blocks or fails the action, not silent success. |
| `WP04-NEG-10` | UI copy never says or implies autonomous advice, client release, or financial recommendation delivery from the AI draft. |
| `WP04-NEG-11` | Export preview/package excludes AI Draft, internal rationale and analyst notes. |
| `WP04-NEG-12` | Status chips alone do not unlock progression in tests; service/gate state is required. |

---

## 16. Required Tests and Test Names

Codex must reuse existing tests where possible and add/update only what is necessary. Suggested test names are explicit so Codex does not bury WP-04 proof inside generic smoke tests.

| Test File | Required Test Name / Assertion |
|---|---|
| `tests/workflow-gate.spec.ts` | `blocks advisor routing when analyst draft has unsupported claims` |
| `tests/workflow-gate.spec.ts` | `allows send to advisor only after analyst review preconditions pass` |
| `tests/recommendation-review-workflow-api.spec.ts` | `analyst reject draft keeps draft internal and writes audit expectation` |
| `tests/recommendation-review-workflow-api.spec.ts` | `analyst rebuild draft does not set clientVisible or releasedToClient` |
| `tests/recommendation-review-workflow-api.spec.ts` | `analyst request evidence does not release recommendation` |
| `tests/true-ux-p0-safety.spec.ts` | `analyst workbench labels ai draft as internal only and not advice` |
| `tests/true-ux-p0-safety.spec.ts` | `unsupported claim state shows blocker and recovery action` |
| `tests/true-ux-client-projection.spec.ts` | `client projection excludes ai draft internal rationale and analyst notes` |
| `tests/true-ux-client-projection.spec.ts` | `advisor pending item is absent from client safe released content` |
| `tests/true-ux-cta-state.spec.ts` | `analyst workbench exposes one primary cta per draft state` |
| `tests/true-ux-density.spec.ts` | `analyst workbench renders compact queue and focused detail layout` |
| `tests/export-safety.spec.ts` or equivalent | `export excludes ai draft internal rationale and analyst notes` |
| `tests/permission-engine.spec.ts` | `wrong tenant or unauthorized role cannot perform analyst draft actions` |

---

## 17. Validation Commands

Codex should run the commands that exist in the current repo. If a command does not exist, it must report the absence and use the closest available script without inventing scripts.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/true-ux-client-projection.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/true-ux-density.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
```

Fallback if project scripts differ:

```bash
pnpm exec playwright test tests/workflow-gate.spec.ts
pnpm exec playwright test tests/recommendation-review-workflow-api.spec.ts
pnpm exec playwright test tests/true-ux-p0-safety.spec.ts
pnpm exec playwright test tests/true-ux-client-projection.spec.ts
```

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Reason |
|---|---|
| Do not make AI Draft client-visible. | Violates P0 advice-boundary and AI internal-only rule. |
| Do not label AI Draft as advice. | Implies autonomous advice. |
| Do not let analyst action release to client. | Violates advisor/compliance gate separation. |
| Do not let analyst action create compliance release. | Compliance release belongs to WP-06. |
| Do not let analyst action create exportable client package. | Export belongs to WP-10 and must exclude internal payload. |
| Do not let admin bypass analyst review or release gates. | Violates admin non-bypass. |
| Do not use `main` for target implementation facts. | False-gap source only. |
| Do not generate screens/images/assets. | Explicit no-generation rule. |
| Do not create new routes unless WP-00 and route scope explicitly require it. | Prevents scope expansion. |
| Do not elevate committee/KYC/suitability/IPS/rebalance to V0.96. | HOLD/P1 routes stay out. |
| Do not replace Prisma schema with patch schema. | Full-workflow schema remains baseline. |
| Do not represent status chips as gate proof. | Service/gate/test proof required. |
| Do not leave error states ambiguous. | Failed action must not advance workflow. |
| Do not add decorative AI confidence theatre. | Evidence + human review, not AI scoring, is product proof. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Decision Handling |
|---|---|
| Does the current repo already have analyst reject/rebuild/request-evidence actions? | WP-00 must classify. Reuse if present; add only missing behaviour. |
| Are AI Draft and internal rationale persisted as explicit fields or represented by Recommendation fields/JSON? | Inspect schema/services. Do not add patch `AiDraft` model without WP-14 decision. |
| Does audit persistence exist for analyst actions? | If partial, implement route to audit service if pattern exists; otherwise mark blocker for WP-08/WP-13. |
| Do client/export projections currently include internal fields? | Add negative tests; fix projection service if leakage found. |
| Do current UI helpers support required page header/CTA/density layout? | Reuse existing helpers. If missing, coordinate with WP-01/WP-02/WP-11. |
| Does workflow gate distinguish analyst-reviewed from advisor-approved? | If missing, WP-04 may define analyst state but must coordinate with WP-05/WP-14. |
| Are tests currently Playwright-only or mixed unit/browser? | Use existing test framework and report unavailable scripts. |

---

## 20. Codex Execution Notes

1. **Start with WP-00 output.** Do not edit WP-04 files until moving baseline and UX/IA delta register exist.
2. **Inspect before changing.** The repo already contains many relevant files; assume partial implementation, not absence.
3. **Prefer reuse.** Use existing `ux-*`, `state-panel`, `guarded-action-button`, workflow, permission, visibility and audit modules.
4. **Work vertically.** A visual state is not complete unless its service/API/test truth exists or the task documents why it remains specified-only.
5. **Keep scope tight.** WP-04 covers analyst review and AI internal-only; downstream advisor/compliance/client/export tasks remain in later WPs.
6. **Add tests with every behaviour.** Especially leakage and no-overclaim tests.
7. **Preserve UX rules.** Page job, gate, blocker, next step; one primary CTA per state; compact internal workbench density; no AI confidence theatre.
8. **Report blockers.** If a schema/API change is required, do not improvise. Create a blocker entry routed to WP-13/WP-14.

---

## 21. QA Matrix

| QA Check | Required Result | Status for this Task Description |
|---|---|---|
| Source hierarchy preserved | `full-workflow` target; `main` false-gap only | PASS |
| WP-00 dependency explicit | Implementation blocked until rebase | PASS |
| UI/UX/IA evidence embedded | Journey IA, header, density, CTA, microcopy, state/lifecycle | PASS |
| Safety gates preserved | AI Draft internal-only, no release, no admin bypass | PASS |
| P1/HOLD routes not elevated | Committee/KYC/Suitability/IPS/rebalance out | PASS |
| No screen generation | Explicitly forbidden | PASS |
| No blind schema replacement | Field mapping only, WP-14 if needed | PASS |
| Positive acceptance defined | Analyst review path and UI states | PASS |
| Negative acceptance defined | Leakage, bypass, overclaim and state advancement failures | PASS |
| Test names specified | Workflow/API/true-UX/client-projection/export/permission tests | PASS |
| Codex can implement without product decisions | Specific files, steps, stop rules and blockers given | PASS |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence | Output in this Artefact |
|---|---|---|---|---|
| Problem framing | Identified WP-04 as AI governance + analyst workbench + UX/IA refactor, not generic AI feature work. | Locked P0 scope and safety boundaries. | Chose one clear implementation direction. | Executive Task Decision |
| KB discovery | Extracted AI internal-only, unsupported claims, journey-first IA, no-overclaim and true-UX evidence. | Converted evidence into tables and rules. | Avoided broad alternatives. | KB Evidence Intake |
| Source hierarchy | Detected current full-workflow snapshot may exceed older KB assumptions. | Preserved full-workflow > KB > patch > main hierarchy. | Required WP-00 rebase. | Source-of-Truth Lock / Reality Recheck |
| UX/IA integration | Mapped route-catalog, long page, weak header, CTA clutter, AI theatre and visual-only states to WP-04. | Operationalized refactor into concrete task rows. | Embedded UX into the actual surface tasks. | UI/UX/Layout/IA Mapping and Task Breakdown |
| Safety decomposition | Separated analyst review from advisor approval, compliance release, client projection and export. | Added positive/negative acceptance and stop rules. | Made leakage/bypass tests mandatory. | Safety, Acceptance, Tests |
| Final proof | Checked no implementation, no screen generation, no schema replacement, no scope elevation. | Produced QA matrix and validation commands. | Finalized a Codex-ready task description. | QA Matrix and Execution Notes |

