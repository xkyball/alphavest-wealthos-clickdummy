# ALPHAVEST_V0_96_WP03_EVIDENCE_WORKBENCH_SUFFICIENCY_UX_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 04 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-03 — Evidence Workbench + Sufficiency UX`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP03_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_EVIDENCE_WORKBENCH_AND_SUFFICIENCY_UX_IMPLEMENTATION_AFTER_WP00_REBASE`

`WP-03` converts AlphaVest evidence handling from a document/upload surface into a **true Evidence Workbench** for the V0.96 proof spine. The purpose is not merely to show uploaded documents. The purpose is to make evidence usable, reviewable, scoped, linked, accepted or rejected, and truthfully represented in UI, APIs, services, audit events and tests.

This work package must preserve the strict product rule:

```text
Upload success is upload success only. It is not evidence sufficiency, not advisor approval, not compliance release, not client visibility and not export readiness.
```

The V0.96 Evidence Workbench must therefore support the following minimum lifecycle:

```text
Evidence requested → upload received → extraction/review pending → reviewed/linkable → insufficient/rejected/needs more evidence OR sufficient for a scoped gate → compliance can use it as release precondition later.
```

**Core implementation decision:**

```text
Use existing full-workflow evidence/document/upload/review services, APIs and components first. Harden them into an honest, state-driven evidence workbench with no-overclaim UI, route/action/object/payload checks, audit references, and P0 positive/negative tests. Do not create new screens, do not generate visuals, and do not bypass WP-00 moving-baseline findings.
```

**Codex result expected from this WP:**

```text
A V0.96 evidence experience where documents can be uploaded, reviewed, linked, marked insufficient/rejected/sufficient for a scoped gate, shown in truthful workbench states, blocked when insufficient, and proven by tests to never unlock release/client visibility/export by upload alone.
```

---

## 2. Source-of-Truth Lock

| Rank | Source / Artefact | Role in WP-03 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current live `full-workflow` repo checkout, if available | Highest implementation reality | Current routes, services, components, APIs, tests, package scripts | Assuming older KB/ZIP counts are current code truth |
| 2 | Current `alphavest-wealthos-clickdummy-full-workflow.zip` snapshot | Snapshot implementation evidence | Identify existing document/evidence APIs, services, UI files and tests | Treating snapshot as newer than live repo without inspection |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Prompt 00 evidence register | UI/UX/IA problem families and WP-to-problem mapping | Treating evidence register as code proof |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-03 goal, target files, acceptance criteria, stop rules | Implementing without current repo rebase |
| 5 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and WP-00 output when implemented | Mandatory predecessor | Current repo delta and exact file/test classification | Starting implementation when WP-00 has not run |
| 6 | `ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md` | IA predecessor | Journey-first nav/page header contract | Rebuilding navigation inside WP-03 |
| 7 | `ALPHAVEST_V0_96_WP02_PAGE_TYPE_DENSITY_SYSTEM_DEEP_TASK_DESCRIPTION.md` | Layout/density predecessor | Workbench/detail density patterns and page-type rules | Inventing separate evidence layout system |
| 8 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md`, `STATE_SCREEN_SPEC.md` | Route/scope/state controls | V0.96 route workset, MVP/P1/HOLD/reference decisions, state requirements | Pulling P1/HOLD/reference routes into V0.96 |
| 9 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback controls | Modal/drawer lifecycle, no-overclaim copy, validation/error states | Treating visual modal/table/status presence as behaviour proof |
| 10 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Safety contract | Route/action/object/payload separation, fail-closed client visibility | Client-visible raw/internal/unreleased evidence |
| 11 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Binding evidence/audit/export contract | Upload-not-sufficiency, evidence sufficiency criteria, audit expectations | Upload-to-release shortcut, evidence display as sufficiency proof |
| 12 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | API hardening, schema field alignment, positive/negative proof | Claiming API/schema/test presence already proves WP-03 |
| 13 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey proof spine | `MJ-002` evidence-missing-to-release and `MJ-001` umbrella journey | Flattening all future evidence/KYC/suitability scope into V0.96 |
| 14 | `main` branch / old main ZIP | False-gap warning only | Contamination detection | Any target implementation task or absence claim |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-03 Task Implication |
|---|---|---|---|---|---|
| Upload interaction is currently one of the strongest implemented interactions, but only proves file transfer mechanics. | Interaction Reality Audit; Prompt 00 evidence register | `/documents/upload`, `ClientIntakeScreen`, WP-03 | Interaction truth / proof limit | Critical | Reuse upload mechanics, but wrap success with review-required state and no release/client/export effect. |
| Upload success is not evidence sufficiency. | Evidence/Audit/Export Safety Contract; Feedback Contract; Prompt 00 | WP-03, WP-12, WP-15 | Evidence semantics / no-overclaim | Critical | Every UI/API/test must distinguish upload received from sufficient evidence. |
| Evidence sufficiency requires linked, relevant, reviewed, scoped, current and accepted evidence. | Evidence/Audit/Export Contract; MVP Journey Requirements Matrix | Evidence workbench, compliance preconditions | Evidence lifecycle | Critical | Add explicit states and checks for review, link, relevance, scope, currency and acceptance. |
| Evidence insufficiency blocks release/export where evidence is required. | Evidence/Audit/Export Contract | WP-03 → WP-06/WP-10 dependency | Release/export blocker | Critical | Surface `needs evidence`, `review pending`, `insufficient`, `rejected`, `sufficient for scoped gate`; downstream release/export remains blocked. |
| Client visibility inherits fail-closed evidence visibility. | RBAC/Visibility Contract; Evidence/Audit/Export Contract | `/portal`, `/mobile`, evidence summaries | Client-safe visibility | Critical | Raw/internal/unreleased evidence must not leak to client routes or client-safe projections. |
| Document/evidence routes are V0.96 core or support routes. | Route Scope Lock; Route Screen Visual Matrix | Routes 027–030, 046–047 | Route workset | High | WP-03 focuses on documents/upload/extraction/verification/evidence vault/detail; P1/HOLD routes stay out. |
| `/documents` was listed among long/complex pages needing structure. | Prompt 00 register; V0.96 UX/IA source | Route 027 `/documents` | Layout / scroll depth | High | Convert documents list into evidence workbench with summary-first, blockers, next work and queue/detail clarity. |
| Evidence detail needs summary-first layout and secondary metadata in drawer/tabs. | V0.96 source; WP-02 density system | Routes 046–047 | Layout / density / progressive disclosure | High | Keep sufficiency/blocker visible; move raw metadata to progressive disclosure. |
| Status chips are labels, not gates. | Feedback Contract; Prompt 00 register | Evidence rows/status chips | Gate-proof semantics | Critical | Evidence chips must be derived from service state and tested, not hardcoded visual claims. |
| Table/filter/kanban components are often visual support only. | Interaction Reality Audit; Prompt 00 register | Document/evidence tables | Interaction lifecycle | High | Add real empty/loading/error/permission states and avoid unimplemented sort/filter claims. |
| Audit display is not persistence proof. | Interaction Audit; Evidence/Audit/Export Contract | Evidence review/acceptance audit references | Audit truth | Critical | Evidence review/sufficiency decisions need persisted audit IDs or fail/blocked states. |
| No-overclaim copy must name only the completed action. | Feedback Contract | Upload/review/sufficiency feedback | Microcopy | High | Copy examples must say “Upload received — review required” and “Evidence accepted for scoped gate — no client release occurred.” |
| Existing tests are proof slices only. | P0 Test Matrix | `document-upload-*`, `evidence-review-api`, UI-state tests | Acceptance proof | Critical | Add/update negative and UI state tests; do not rely on route/API presence. |

---

## 4. Current Code / Route / Component Reality to Recheck

WP-03 must begin only after WP-00 has produced the moving baseline. If WP-00 output is absent, Codex must stop and run WP-00 first.

### 4.1 Snapshot reality observed in the available `full-workflow` ZIP

The currently available ZIP snapshot already contains evidence-related implementation surfaces that older KB documents may not fully reflect:

| Area | Snapshot Evidence | Treatment in WP-03 |
|---|---|---|
| Document APIs | `app/api/documents/route.ts`, `app/api/documents/upload/route.ts`, `app/api/documents/review/route.ts` | Treat as existing baseline to inspect/harden; do not create duplicate APIs. |
| Evidence services | `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts` | Treat as existing service baseline; verify current behaviour before adding logic. |
| Evidence UI | `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/ui/evidence-list.tsx`, `components/ui/state-panel.tsx` | Refactor existing surfaces rather than generating screens. |
| Tests | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/fixtures/e2e-evidence.ts` | Existing proof slices; extend with V0.96 negative and true-UX coverage. |
| Evidence sufficiency support | `evidenceService.evaluateEvidenceSufficiency`, `evaluateEvidenceLifecycle`, `EvidenceReviewAction`, review route error handling | Reuse if still present in live repo; do not replace blindly. |

### 4.2 Files / modules to inspect before edits

| Area | Files / Modules | Recheck Purpose |
|---|---|---|
| Route registry / scope | `lib/route-registry.ts`, `lib/navigation.ts`, `lib/ux-route-policy.ts` | Confirm document/evidence routes and page-type/density assignment from WP-01/WP-02. |
| Evidence UI surfaces | `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/ui/evidence-list.tsx`, `components/ui/state-panel.tsx`, `components/ui/data-table.tsx` | Determine current document/evidence layout, states, chips, actions and data binding. |
| Shared UX helpers | `components/ux-hub-page.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-cta-cluster.tsx`, `components/ux-secondary-context-tabs.tsx`, `components/product-guidance-panel.tsx`, `components/ui/guarded-action-button.tsx` | Reuse existing layout/CTA/state helpers. |
| Upload / review APIs | `app/api/documents/route.ts`, `app/api/documents/upload/route.ts`, `app/api/documents/review/route.ts` | Verify validation, role/tenant inputs, error envelope, noClientRelease, audit IDs and response shape. |
| Evidence services | `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `lib/permission-engine.ts`, `lib/visibility-engine.ts`, `lib/audit-service.ts` | Verify sufficiency, permission, client visibility, audit and release/export blockers. |
| Schema | `prisma/schema.prisma` | Confirm `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` fields and enums. |
| Tests | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-density.spec.ts`, `tests/route-smoke.spec.ts` | Reuse/extend existing positive/negative evidence proof. |

### 4.3 Current reality labels Codex must assign before implementation

For each file/API/service/test above, Codex must classify current state as:

| Label | Meaning |
|---|---|
| `ALREADY_PRESENT` | Fully satisfies WP-03 requirement and has tests. |
| `PARTIAL` | Exists but lacks lifecycle, state, UI, safety or tests. |
| `MISSING` | Needed implementation not present in target repo. |
| `CONFLICTING` | Current behaviour contradicts V0.96 rules. |
| `BLOCKED` | Cannot proceed without WP-00, schema/API decision or scope unlock. |

---

## 5. WP Problem Statement

The current AlphaVest evidence flow risks three product failures:

1. **Upload overclaim:** A successful upload may be misunderstood as evidence accepted, sufficient, release-ready or client-visible.
2. **Document list sprawl:** Documents, evidence records, review states and blockers can appear as isolated rows/cards instead of a coherent workbench with next work and gate impact.
3. **Missing lifecycle truth:** Evidence must move through review, linkage, relevance, scope and acceptance before it can support compliance release or export. Visual chips or document rows do not prove that lifecycle.

WP-03 must turn the evidence surfaces into a **journey-first Evidence Workbench** that supports `MJ-002` and the `MJ-001` proof spine without creating new product scope.

---

## 6. V0.96 Journey Role

| Journey | WP-03 Role | Product Meaning |
|---|---|---|
| `MJ-002 — Evidence missing to client upload to release` | Primary | The core proof that requested evidence can be uploaded, reviewed, linked and accepted without shortcutting release. |
| `MJ-001 — New Family Office onboarding to first client-safe decision` | Foundational | Evidence must support the first client-safe decision path. |
| `MJ-003 — AI draft rejected/rebuilt with evidence` | Dependency | Analyst review must reference evidence sufficiency, but AI Draft stays WP-04. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Safety dependency | Evidence review actions must deny wrong tenant/object/role and write/return safe audit evidence. |
| `MJ-005 — Export package with forbidden payload redaction` | Downstream dependency | Export cannot include raw/internal/unreleased evidence and cannot proceed without scoped evidence rules. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Downstream governance | Admin cannot force evidence sufficiency or release through UI/API. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-03 Evidence Surface | Required Refactor |
|---|---|---|
| Route-catalogue navigation | Documents/evidence routes can feel like separate menu items. | Present them as one Evidence Workbench journey segment: request → upload → review → link → sufficiency. |
| Long page / scroll sprawl | `/documents` and evidence detail can accumulate upload, list, extraction, review, metadata and history. | Use summary-first layout, queue/detail split, tabs/drawers for secondary metadata, visible blocker/next action. |
| Sparse page / decorative whitespace | Empty document/evidence states can look like unused space. | Show truthful next work: evidence requested, no documents uploaded, review pending, or no evidence required. No filler panels. |
| Weak page job/header | Evidence pages may not say what job they perform. | Header must state evidence job, current gate, blocker, next step and primary CTA. |
| Too many equal CTAs | Upload, review, request, link, accept, reject can compete. | One primary CTA per state; secondary actions demoted/grouped; disabled reasons shown. |
| Visual-only chips | Evidence status chips can imply gate proof. | Status chips must derive from service state and have tests. |
| No-overclaim copy | Upload/review/sufficient messages can imply release. | Copy must explicitly limit action result: upload-only, review-only, sufficient-for-scoped-gate, no client release. |
| Permission/tenant ambiguity | Evidence rows/actions may appear to wrong actors. | Guard route/action/object/payload; denied states show recovery without leaking data. |
| Client-visible evidence risk | Raw/internal evidence could leak into client summaries. | Client-safe evidence is summary-only, redacted and released only by downstream visibility projection. |
| Table/filter static behaviour | Document/evidence tables may show controls that do not actually filter/sort. | Do not add or claim table behaviours unless implemented/test-backed. Provide honest loading/empty/error/permission states. |
| Audit display vs persistence | Review UI may show timeline without persisted audit. | Evidence decisions must reference persisted audit event or block/fail. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes included in WP-03

- Refactor documents/evidence surfaces into a coherent Evidence Workbench.
- Preserve existing upload UI but harden copy, state and downstream impact.
- Add or confirm evidence lifecycle taxonomy in code usage and UI:
  - `NEEDS_EVIDENCE`
  - `UPLOAD_RECEIVED`
  - `EXTRACTION_PENDING`
  - `REVIEW_PENDING`
  - `LINKED_NOT_SUFFICIENT`
  - `INSUFFICIENT`
  - `REJECTED`
  - `SUFFICIENT_FOR_SCOPED_GATE`
- Bind Evidence UI rows/chips/actions to real service/API state, not static labels.
- Implement or harden evidence review actions:
  - mark reviewed / link
  - request clarification / reject / insufficient
  - accept sufficiency for scoped gate
- Enforce role/tenant/object permissions for review/sufficiency actions.
- Persist or return audit references for review/blocked/sufficiency decisions where current architecture supports it.
- Add honest UI states: loading, upload in progress, upload failed, upload received, review pending, insufficient, rejected, sufficient, permission denied, empty, error, retry.
- Add tests for upload-not-release, wrong-role denial, wrong-scope denial, client visibility fail-closed and UI states.

### 8.2 Changes explicitly out of scope

- No screen/image/state-screen generation.
- No broad visual redesign.
- No new visual assets.
- No new route creation solely for evidence detail.
- No P1/HOLD/KYC/suitability evidence expansion.
- No client-visible raw evidence.
- No evidence sufficiency by upload alone.
- No compliance release inside WP-03; release belongs to WP-06.
- No export package approval inside WP-03; export belongs to WP-10.
- No blind Prisma schema replacement.
- No new API proliferation if existing `/api/documents/*` routes can be hardened.
- No fake table/filter/sort interaction.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP03-T01 | Consume WP-00 evidence delta and classify current evidence implementation | WP-03 must not duplicate APIs/services already present in the repo. | WP-00 output, `app/api/documents/**`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, existing tests | Read WP-00 register; classify upload/list/review/service/UI/tests as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`; record exact delta before edits. | A current evidence delta exists before implementation; stale assumptions are not used as tasks. | No new tests required; validation report required. | Yes — determines refactor depth. | Stop if WP-00 output is missing or repo target is not `full-workflow`. |
| WP03-T02 | Define/confirm evidence lifecycle taxonomy for UI and services | Evidence UI needs consistent lifecycle stages. | `lib/evidence-service.ts`, `lib/domain-types.ts`, `prisma/schema.prisma`, `components/ui/evidence-list.tsx`, `components/ui/status-chip.tsx` | Reuse existing enums/derived stages where present; normalize UI-facing labels; ensure lifecycle separates uploaded, reviewed, linked, insufficient/rejected, sufficient-for-scoped-gate. | Lifecycle taxonomy exists in one canonical place or clearly derived; UI chips map to it; no new schema unless WP-14 approves. | Unit tests if service function exists; typecheck. | Yes — status truth. | Do not create schema enum blindly; do not label upload as sufficient. |
| WP03-T03 | Refactor `/documents` into Evidence Workbench entry surface | `/documents` is a long/complex V0.96 route and should not remain a generic document list. | `components/client-intake-screen.tsx`, `components/ux-hub-page.tsx`, `components/ux-dense-operations-panel.tsx`, `components/page-header.tsx`, `lib/route-registry.ts` | Add summary-first workbench structure: evidence demand summary, review queue, uploaded candidates, blockers, next action; use WP-01 page header and WP-02 density rules; keep secondary metadata below. | `/documents` communicates page job, current evidence state, primary CTA and blockers above fold; no filler content. | `tests/ui-state-boundaries.spec.ts`; true-UX density/CTA tests if present; route smoke. | Yes — major evidence workbench layout. | Stop if refactor requires new screen asset or new route. |
| WP03-T04 | Harden upload UI and copy to upload-only success | Upload is strong existing interaction but must not overclaim. | `components/client-intake-screen.tsx`, `app/api/documents/upload/route.ts`, `lib/document-upload-service.ts`, `tests/document-upload-flow.spec.ts`, `tests/document-upload-api.spec.ts` | Ensure upload in-progress, failed, retry, success states; success copy says upload received/review required; returned state does not unlock release/client/export. | Upload success UI/API explicitly shows `uploadOnly`/review-required/no-client-release semantics. | Existing upload API/flow tests plus negative upload-not-release assertion. | Yes — microcopy/state. | Stop if success copy says evidence complete, released, client-visible or export-ready. |
| WP03-T05 | Implement/harden evidence review action path | Review actions must be real lifecycle steps, not static buttons. | `app/api/documents/review/route.ts`, `lib/evidence-review-service.ts`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/ui/guarded-action-button.tsx` | Support/verify actions: mark reviewed/link, request clarification, reject/insufficient, accept sufficiency; add loading, validation, permission denied, success, error; include audit references in result where supported. | Review actions mutate only with valid role/tenant/object; UI shows truthful state and audit/result. | `tests/evidence-review-api.spec.ts`; UI test for review pending/insufficient/sufficient. | Yes — action lifecycle. | Stop if review action mutates without permission or audit expectation. |
| WP03-T06 | Add evidence linkage and scoped gate indicators | Evidence must be linked/relevant/scoped before sufficiency. | `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `prisma/schema.prisma`, `components/ui/evidence-list.tsx`, `components/decisions-governance-screen.tsx` | Show target object/recommendation/compliance/decision link status; indicate missing relevance/scope/current/client-safe acceptance; prevent sufficiency when scope mismatches. | Evidence status explains what it supports and what is missing; wrong-scope evidence blocks sufficiency. | Wrong-scope sufficiency test; service/unit tests. | Yes — linked status and blocker clarity. | Do not use a global “sufficient” label without scoped target. |
| WP03-T07 | Add insufficient/rejected/needs-more-evidence recovery flow | Users need recovery when evidence is not enough. | `components/client-intake-screen.tsx`, `components/ui/state-panel.tsx`, `components/ui/evidence-list.tsx`, review API/service | Add UI states and actions for insufficient, rejected, request clarification, needs more evidence; expose recovery CTA; preserve input/document context. | Evidence failures are actionable and do not silently advance gates. | UI state tests for insufficient/rejected/needs evidence. | Yes — state/recovery UX. | Do not hide failure reason or show generic error only. |
| WP03-T08 | Enforce evidence permission, tenant and payload visibility | Evidence review is safety-critical. | `lib/permission-engine.ts`, `lib/visibility-engine.ts`, review API, documents API, evidence UI | Ensure route/action/object/payload checks; wrong-role/wrong-tenant denied; denied response does not leak sensitive fields; UI hides/disables action with reason. | Wrong actor cannot review/accept or see sensitive evidence payload; denied audit or safe denial exists. | Negative tests for wrong role, cross-tenant, wrong object. | Yes — permission denied states. | Stop if route access grants action/payload visibility. |
| WP03-T09 | Bind Evidence Workbench rows/chips to real API/service state | Visual chips cannot be gate proof. | `components/ui/evidence-list.tsx`, `components/ui/status-chip.tsx`, documents/review APIs, evidence service | Replace hardcoded/demo-only labels on touched surfaces with computed lifecycle state; mark demo-only where still demo; avoid unsupported filters/sorts. | Chips/rows reflect service response; no visual-only sufficiency claims. | UI and API tests compare state response to rendered label. | Yes — truthful UI state. | Stop if state is inferred from visual metadata only. |
| WP03-T10 | Add client-safe evidence summary boundaries | Client pages must not see raw/internal evidence. | `lib/visibility-engine.ts`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, client projection tests | Ensure evidence summaries exposed to client are released/redacted/summary-only; raw uploads, extraction fields, internal notes and review notes remain hidden. | Client-facing routes show no raw/internal/unreleased evidence before downstream release. | Client visibility negative tests; true-UX client projection test if present. | Yes, where client evidence state appears. | Stop if raw/internal evidence appears on `/portal` or `/mobile`. |
| WP03-T11 | Persist/show audit references for evidence actions | Evidence decisions need audit proof, not audit theatre. | `lib/audit-service.ts`, `lib/evidence-review-service.ts`, `components/ui/audit-timeline.tsx`, evidence UI | Confirm audit event written for review/link/clarification/sufficiency/blocked/denied; show reference in internal UI where useful; add audit unavailable state if required audit missing. | Gate-relevant evidence actions include persisted audit event or block/fail. | API/service tests assert audit rows and IDs; UI test for audit reference/unavailable. | Yes — audit surface truth. | Stop if action succeeds without required audit and no fail-closed behaviour. |
| WP03-T12 | Add/extend P0 and True-UX tests | WP-03 is not done without positive and negative proof. | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Add positive path and negatives: upload-only, unreviewed blocks, wrong-role denied, wrong-scope blocked, client sees nothing raw/unreleased, evidence status renders correctly. | Tests prove evidence lifecycle and no-overclaim UI; route-smoke/typecheck pass. | See Section 16. | Yes — tests cover UI truth. | Do not mark complete if negative tests are absent or skipped without blocker. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Path | Scope | WP-03 Treatment |
|---|---|---|---|
| 027 | `/documents` | `MVP` | Main Evidence Workbench entry: list, request/upload context, review queue, blockers, next action. |
| 028 | `/documents/upload` | `MVP` | Upload mechanics and upload-only feedback; in-progress/failed/success states. |
| 029 | `/documents/extraction-review` | `MVP` | Extraction/review pending and reviewer action state; no sufficiency by extraction alone. |
| 030 | `/documents/verification-pending` | `MVP` | Verification/review pending state and recovery; no release/client visibility. |
| 046 | `/evidence` | `MVP` | Evidence vault/list as lifecycle-aware evidence surface. |
| 047 | `/evidence/:id` | `MVP` | Evidence detail: summary-first, scoped status, links, audit reference and secondary metadata. |
| 038–041 | `/compliance...` | `MVP` | Dependency only: WP-03 provides evidence sufficiency state for WP-06 release/block/request evidence. |
| 019–020 | `/portal`, `/mobile` | `MVP` | Dependency only: client-safe evidence summary must remain hidden/redacted unless released downstream. |

### 10.2 Components

| Component / File | Required WP-03 Role |
|---|---|
| `components/client-intake-screen.tsx` | Documents/upload/client-facing surface refactor and state wiring. |
| `components/decisions-governance-screen.tsx` | Evidence vault/detail/decision evidence context. |
| `components/ui/evidence-list.tsx` | Lifecycle-aware evidence rows/chips/actions. |
| `components/ui/state-panel.tsx` | Loading/empty/error/permission/needs-evidence states. |
| `components/ui/data-table.tsx` | Tables with honest states; no fake filters/sorts. |
| `components/ui/guarded-action-button.tsx` | Review/accept/reject actions with disabled/denied reasons. |
| `components/page-header.tsx` | Page job/gate/blocker/next action for evidence surfaces. |
| `components/ux-cta-cluster.tsx` | One primary CTA per evidence state. |
| `components/ux-detail-standard-panel.tsx`, `components/ux-secondary-context-tabs.tsx` | Summary-first detail and progressive disclosure. |

### 10.3 APIs / Services

| API / Service | Required WP-03 Role |
|---|---|
| `app/api/documents/route.ts` | Evidence/document listing with safe scoped payload and honest status. |
| `app/api/documents/upload/route.ts` | Upload-only success, validation, safe errors, no release/client/export unlock. |
| `app/api/documents/review/route.ts` | Evidence review/sufficiency action path with validation, permission, safe errors, audit reference. |
| `lib/document-upload-service.ts` | File validation, document/version/extraction/evidence candidate creation. |
| `lib/evidence-review-service.ts` | Review/link/clarification/sufficiency actions and audit. |
| `lib/evidence-service.ts` | Sufficiency/lifecycle decision source. |
| `lib/permission-engine.ts` | Review/sufficiency role/action/object gate. |
| `lib/visibility-engine.ts` | Client-safe evidence projection and fail-closed behaviour. |
| `lib/audit-service.ts` | Audit persistence or explicit fail-closed expectations. |

### 10.4 Schema areas

| Model / Enum Area | Required WP-03 Use |
|---|---|
| `Document` | Upload/review status, client visibility boundary, document type/title/file metadata. |
| `DocumentVersion` | Upload version proof and storage/checksum evidence. |
| `DocumentExtraction` | Extraction/review state; client-visible false by default. |
| `DocumentReview` | Review status, review type, reviewer and notes/client-safe summary boundary. |
| `DocumentLink` | Link document/evidence to target object/gate. |
| `EvidenceRecord` | Evidence status, related object, visibility, summary. |
| `EvidenceItem` | Review/link items backing evidence record. |
| `AuditEvent` | Review/denied/blocked/sufficiency audit proof. |
| `EvidenceStatus`, `DocumentStatus`, `ReviewStatus`, `VisibilityStatus` | Do not replace blindly; map to UI lifecycle carefully. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Trigger | Preconditions | Loading State | Success State | Failure / Retry | Permission / Safety |
|---|---|---|---|---|---|---|
| Upload file | File select / drag-drop / upload CTA | Valid tenant, allowed role, accepted file type/size, document context | Upload in progress; button disabled | `Upload received. Evidence review required.` | Show file validation/API error; preserve retry/reselect | Upload never unlocks release/client/export. |
| Mark reviewed / link evidence | Review CTA | Reviewer role, scoped document, evidence record exists | Review pending | Evidence linked/reviewed, sufficiency still pending unless accepted | Validation/error state; preserve context | Wrong role/tenant denied; no data leak. |
| Request clarification | Request clarification CTA/modal | Reviewer role and document context | Submitting request | Clarification requested; gate still blocked | Validation error for missing reason; retry/cancel | Audit required; no release. |
| Reject / mark insufficient | Reject/insufficient CTA | Reviewer role, reason/context | Submitting | Evidence insufficient/rejected; recovery next step shown | Preserve state and allow request/reupload | Blocks release/export/client visibility. |
| Accept sufficiency for scoped gate | Accept sufficiency CTA | Required review, link, relevance, current, scope and client-safe acceptance; authorized role | Checking sufficiency | Evidence sufficient for scoped gate; no client release occurred | Blocked with missing reasons if checks fail | Must not unlock client release; audit required. |
| Open evidence detail | Row/card select | Route/object visibility allowed | Detail loading | Summary-first detail with status, blocker, links, audit ref | Error/permission denied state | Do not reveal raw/internal evidence to unauthorized actor. |

---

## 12. State / Feedback / Microcopy Requirements

### 12.1 Required states

| State | Required Meaning | UI Treatment |
|---|---|---|
| `NEEDS_EVIDENCE` | Evidence is required but no acceptable source exists. | Empty/blocked state with primary CTA `Request Evidence` or `Upload Evidence` depending role. |
| `UPLOAD_IN_PROGRESS` | File transfer active. | Disable upload CTA; show progress/working state; no optimistic sufficiency. |
| `UPLOAD_FAILED` | Upload failed validation/API/service. | Show safe error, retry/reselect, no state advancement. |
| `UPLOAD_RECEIVED` | File transfer succeeded. | Copy: “Upload received. Evidence review is required before it can support a gate.” |
| `EXTRACTION_PENDING` | Extraction/review not complete. | Show pending state and review next step. |
| `REVIEW_PENDING` | Human review required. | Evidence cannot support release/export yet. |
| `LINKED_NOT_SUFFICIENT` | Evidence linked but missing criteria. | Show missing criteria: review, relevance, scope, current, client-safe acceptance. |
| `INSUFFICIENT` | Evidence cannot support the scoped gate. | Blocker and recovery CTA. |
| `REJECTED` | Reviewer rejected evidence. | Show reason if safe; request replacement or clarification. |
| `SUFFICIENT_FOR_SCOPED_GATE` | Reviewed, linked, relevant, scoped, current and accepted. | Copy must say sufficient for scoped gate only; no client release claim. |
| `PERMISSION_DENIED` | Actor lacks permission. | Hide/disable action with reason; no sensitive payload. |
| `AUDIT_UNAVAILABLE` | Required audit proof missing/failing. | Critical action blocked/pending; no silent success. |

### 12.2 No-overclaim copy examples

| Situation | Forbidden Copy | Required Copy Direction |
|---|---|---|
| Upload succeeds | “Evidence complete.” | “Upload received. Evidence review is required.” |
| Review links document | “Ready to release.” | “Document reviewed and linked. Sufficiency still depends on scoped acceptance.” |
| Evidence accepted | “Released to client.” | “Evidence accepted for this scoped gate. No client release occurred.” |
| Wrong-scope evidence | “Unable to save.” | “Evidence cannot support this gate because it is linked to a different object.” |
| Client before release | Internal pending details | “No released evidence summary is available yet.” |
| Audit unavailable | “Action successful.” | “Action cannot complete until audit is recorded.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-03 Requirement | Blocking Rule |
|---|---|---|
| RBAC | Evidence review/sufficiency actions require role/action/object permission. | Wrong role or tenant denied; no mutation. |
| Payload visibility | Route access does not expose raw/internal evidence. | Payload is hidden/redacted where actor lacks scope. |
| Client visibility | Client sees only released/redacted summaries downstream. | Raw/uploaded/internal/unreleased evidence never appears in client portal/mobile. |
| Advice boundary | Evidence cannot become advice or release by itself. | Upload/review/sufficiency cannot send recommendation to client. |
| Evidence sufficiency | Must be reviewed, linked, relevant, scoped, current and accepted. | Missing any criterion blocks sufficiency. |
| Audit | Review, denial, blocked sufficiency and accepted sufficiency require audit expectation. | If required audit cannot persist, safety action must fail/hold. |
| Export | Evidence sufficiency may support export later but does not approve export. | Export remains WP-10 and must redact forbidden payload. |
| Admin non-bypass | Admin cannot force sufficiency outside evidence review policy. | Admin bypass attempts denied and audited later in WP-09/WP-15. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criterion |
|---|---|
| WP03-POS-001 | A permitted actor can upload a valid document and receives upload-only success. |
| WP03-POS-002 | Uploaded document enters candidate/review-pending evidence state and can be listed in the Evidence Workbench. |
| WP03-POS-003 | A permitted reviewer can mark/link reviewed evidence without creating client visibility or release. |
| WP03-POS-004 | A permitted compliance/reviewer actor can accept evidence sufficiency only when review, relevance, scope, current and client-safe acceptance preconditions pass. |
| WP03-POS-005 | Evidence detail shows summary-first state, current blocker, linked object/gate, audit reference and primary next action. |
| WP03-POS-006 | Evidence sufficient state is labelled as sufficient for a scoped gate only, not globally sufficient. |
| WP03-POS-007 | Evidence Workbench page has page job, current gate/state, blocker and one primary CTA per state. |
| WP03-POS-008 | Existing upload/review/list tests pass after changes. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criterion |
|---|---|
| WP03-NEG-001 | Upload alone does not set evidence sufficient. |
| WP03-NEG-002 | Upload alone does not release to client. |
| WP03-NEG-003 | Upload alone does not unlock export. |
| WP03-NEG-004 | Unreviewed evidence cannot support compliance release. |
| WP03-NEG-005 | Linked but wrong-scope evidence cannot be sufficient for the target gate. |
| WP03-NEG-006 | Wrong-role actor cannot accept sufficiency. |
| WP03-NEG-007 | Wrong-tenant actor cannot see/review evidence. |
| WP03-NEG-008 | Client portal/mobile do not show raw, internal or unreleased evidence. |
| WP03-NEG-009 | Evidence review action without required audit cannot silently succeed. |
| WP03-NEG-010 | Status chip cannot claim sufficient when service decision is review pending/insufficient. |
| WP03-NEG-011 | UI must not show “released”, “client visible”, “export ready” or equivalent after upload/review alone. |
| WP03-NEG-012 | P1/HOLD routes are not elevated to solve evidence UX. |

---

## 16. Required Tests and Test Names

Codex must first inspect the existing test harness and script names. The following are target test names/patterns; adapt only to existing conventions while preserving intent.

| Test File | Test Name / Purpose | Type | Required? |
|---|---|---|---|
| `tests/document-upload-api.spec.ts` | `uploads valid document as candidate evidence only` | API positive | Yes |
| `tests/document-upload-api.spec.ts` | `rejects unsupported file without document/evidence mutation` | API negative | Yes |
| `tests/document-upload-api.spec.ts` | `upload success does not unlock release client visibility or export` | API negative | Yes |
| `tests/document-upload-flow.spec.ts` | `shows upload received review required feedback` | Browser/UI positive | Yes |
| `tests/document-upload-flow.spec.ts` | `shows upload failure retry without advancing evidence gate` | Browser/UI negative | Yes if harness supports failure injection; otherwise document blocker |
| `tests/evidence-review-api.spec.ts` | `links reviewed evidence without sufficiency or client release` | API positive | Yes |
| `tests/evidence-review-api.spec.ts` | `accepts sufficient scoped evidence without client release` | API positive | Yes |
| `tests/evidence-review-api.spec.ts` | `denies analyst or unauthorized role sufficiency acceptance` | API negative | Yes |
| `tests/evidence-review-api.spec.ts` | `blocks wrong-scope sufficiency acceptance without mutation` | API negative | Yes |
| `tests/ui-state-boundaries.spec.ts` | `renders evidence pending insufficient rejected sufficient states truthfully` | UI state | Yes |
| `tests/true-ux-p0-safety.spec.ts` | `client cannot see raw or unreleased evidence` | P0 negative | Yes if test suite exists; else add equivalent |
| `tests/true-ux-cta-state.spec.ts` | `evidence workbench has one primary CTA per state` | True-UX | Yes if suite exists; else add equivalent |
| `tests/route-smoke.spec.ts` | `documents and evidence routes remain routable` | Smoke | Yes |

---

## 17. Validation Commands

Codex must inspect `package.json` before running commands. Use only scripts that exist in the current repo.

Preferred validation sequence:

```bash
pnpm typecheck
pnpm lint
pnpm test -- tests/document-upload-api.spec.ts
pnpm test -- tests/evidence-review-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/ui-state-boundaries.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
```

If scripts differ, Codex must record the actual command used and the reason. If database-backed tests require `DATABASE_URL`, Codex must not fake pass results; it must report environment blocker or run with the configured test database.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `STOP_NO_WP00_BASELINE` | Do not implement WP-03 before WP-00 moving baseline is complete. |
| `STOP_WRONG_REPO` | Do not implement outside current `full-workflow` target. |
| `STOP_UPLOAD_TO_RELEASE` | Any implementation implying upload-to-sufficiency/release/client/export is invalid. |
| `STOP_CLIENT_RAW_EVIDENCE` | Raw/internal/unreleased evidence must not be client-visible. |
| `STOP_VISUAL_CHIP_AS_GATE` | Status chips/buttons/cards cannot be treated as gate proof. |
| `STOP_UNAUDITED_SAFETY_ACTION` | Safety action must not silently succeed when audit persistence is required and unavailable. |
| `STOP_NO_PERMISSION_CHECK` | Review/sufficiency actions cannot mutate without role/tenant/object checks. |
| `STOP_SCHEMA_REPLACEMENT` | Do not replace Prisma schema or create patch-only models by default. |
| `STOP_ROUTE_SCOPE_ELEVATION` | Do not pull P1/HOLD/reference-only routes into V0.96. |
| `STOP_SCREEN_GENERATION` | No screens/images/state-screen generation or asset replacement. |
| `STOP_NEW_API_BY_DEFAULT` | Do not create new APIs unless WP-00 proves existing API cannot support required flow and final handoff rules allow it. |
| `STOP_TESTLESS_COMPLETION` | Do not mark complete without positive and negative test proof or explicit blocker. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Decision Handling |
|---|---|
| Does the live repo already contain `/api/documents/review` and `evidence-review-service`? | WP-00/WP-03 must recheck; if present, harden/reuse. If absent, classify as missing and implement only if final handoff authorizes. |
| Are evidence statuses Prisma enums, domain-type unions or service-derived states in the current repo? | Do not change schema blindly. Use service-derived UI lifecycle if schema already supports enough state. Route schema gaps to WP-14. |
| Are true-UX tests already present? | Reuse/extend if present. If absent, create equivalent tests only under WP-15/test scope, or add WP-03-specific tests if authorized. |
| Does evidence sufficiency need to link to Recommendation/ComplianceReview/Decision in this WP? | WP-03 should expose link/scoped-gate indicators. Deep release use belongs to WP-06/WP-07. Schema gaps go to WP-14. |
| Does audit failure injection exist? | If not, add API/service negative proof where possible and route deeper audit failure mechanics to WP-08/WP-15. |
| Does current UI use static demo data? | If yes, WP-03 must either bind to service/API state or label demo-only and route to WP-13. |

---

## 20. Codex Execution Notes

1. Start from WP-00 output and current repo state; do not trust older counts blindly.
2. Prefer modifying existing evidence/document services and components over creating new abstractions.
3. Keep Evidence Workbench scoped to V0.96 routes and proof spine.
4. Make every evidence success message narrowly truthful.
5. Treat client-safe visibility as downstream fail-closed projection, not a document/evidence setting toggled by upload.
6. Preserve separation between:
   - upload
   - review
   - linkage
   - scoped sufficiency
   - advisor/compliance release
   - client-safe projection
   - export readiness
7. Do not overfit to demo data; if demo session is used, make the limitation explicit in comments/tests/reports.
8. Any UI refactor must preserve accessibility, keyboard access and visible recovery routes where possible.
9. If implementation requires schema/API decisions beyond current contracts, stop and route to WP-13/WP-14 rather than improvising.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| WP-00 baseline consumed | Yes |
| full-workflow target preserved | Yes |
| `main` blocked as target | Yes |
| Upload-only rule enforced | Yes |
| Evidence lifecycle state implemented or explicitly classified | Yes |
| Evidence sufficiency requires review/link/relevance/scope/current/client-safe acceptance | Yes |
| No client-visible raw/internal/unreleased evidence | Yes |
| No status chip as gate proof | Yes |
| Review/sufficiency actions guarded by role/tenant/object permission | Yes |
| Audit expectations covered for safety-relevant actions | Yes |
| No screen/image generation | Yes |
| No P1/HOLD route elevation | Yes |
| No blind schema replacement | Yes |
| One primary CTA per evidence state | Yes |
| Long/sparse evidence surfaces refactored only where touched | Yes |
| Positive and negative tests included | Yes |
| Stop rules preserved | Yes |

---

## 22. ENGINE Execution Proof

| Phase | Engine | Application in WP-03 | Output |
|---|---|---|---|
| KB/UI discovery | ENGINE_v3 | Extracted evidence-specific UX/IA problems: upload overclaim, evidence lifecycle truth, route/workbench structure, chips-not-gates, client-safe evidence boundaries. | KB Evidence Intake and Problem Mapping |
| Source hierarchy control | ENGINE_v2 | Preserved `full-workflow` target, `main` false-gap, Markdown as control evidence, code/snapshot as implementation reality. | Source-of-Truth Lock and Stop Rules |
| Contradiction control | ENGINE_v3 | Separated implemented upload mechanics from unproven sufficiency, release, client visibility and export readiness. | Executive Decision and Refactor Scope |
| Operational task decomposition | ENGINE_v2 | Converted WP-03 into atomic tasks with files, steps, acceptance criteria, tests and safety gates. | Detailed Implementation Task Breakdown |
| UX/IA integration | ENGINE_v3 + ENGINE_v2 | Embedded workbench layout, page job, density, CTA, state and microcopy refactor directly into evidence tasks. | UI/UX/Layout/IA sections and task flags |
| P0 discipline | ENGINE_v2 | Added positive/negative acceptance and test targets for upload-not-release, wrong-role/wrong-scope, client visibility and status truth. | Acceptance and Tests sections |
| Codex convergence | Codex-Spark-like | Avoided strategy alternatives and produced direct implementation instructions with do-not-do constraints. | Codex Execution Notes |
| QA | ENGINE_v2 | Ensured no code implementation in this artefact, no generation, no scope expansion and no false readiness claim. | QA Matrix |
