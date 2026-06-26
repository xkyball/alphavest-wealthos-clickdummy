# ALPHAVEST V0.96 — WP-13 API/Service Integration for UI Truth — Deep Task Description

**Work Package:** `WP-13 — API/Service Integration for UI Truth`  
**Release:** `V0.96 Core Journey + UX/IA Refactor`  
**Mode:** Codex-ready task description only. No implementation in this artefact.  
**ENGINE Combination:** ENGINE_v3 for KB / UX / IA discovery and contradiction control; ENGINE_v2 for operational task decomposition, acceptance criteria, negative tests and stop rules; Codex-Spark-like convergence for implementation-ready specificity.

---

## 1. Executive Task Decision

**Task decision:** `WP13_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_EXECUTION_AFTER_WP00_REBASE`

WP-13 exists to make the AlphaVest UI truthful. Every visible state, status chip, disabled action, CTA, client-safe projection, evidence state, advisor/compliance gate, audit reference and export/redaction status must be driven by real service/API/read-model truth rather than static JSX, demo-only visual metadata, hardcoded chips or optimistic local state.

The task is not to create a broad new API architecture. The task is to inspect and reuse the current `full-workflow` implementation first. The current snapshot already contains materially more API routes, services and tests than older KB artefacts assumed, so Codex must begin by reconciling the current code reality before editing.

**Current snapshot reality to preserve:**

- API route files observed in current snapshot: **15**.
- Top-level `lib` modules observed in current snapshot: **60**.
- Test specs observed in current snapshot: **50**.
- Relevant API/service surfaces already exist for dummy auth, admin tenants, documents, document review, audit events, export workflow, typed workflow, dashboard metrics, global search, entities, family members, profile, ops SLA and review monitoring.

**Core implementation intent:**

> Bind V0.96 user-facing UI states to API/service truth so the interface cannot overclaim safety gates, cannot show client-visible internal content, cannot treat status chips as gate proof and cannot advance workflow state after failed API responses.

**Codex status:** `READY_FOR_CODEX_AFTER_WP00_REBASE_AND_CURRENT_CODE_CONFIRMATION`

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-13 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect actual API routes, services, UI components, tests and schema before editing | Do not implement from old counts or stale assumptions |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | KB-derived UX/IA evidence register and WP index | Use UI/UX/IA problem families and WP mapping | Do not treat it as code proof |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary V0.96 WP source | Use WP-13 goal, target files, tests, stop rules | Do not skip current repo rebase |
| 4 | `API_CONTRACT_MATRIX.md` | API safety contract | Preserve existing API baseline, validation, error, payload, permission and redaction rules | Do not treat API presence as safety proof |
| 5 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Route/action/object/payload visibility rules | Enforce route access ≠ action permission ≠ payload visibility | Do not allow admin bypass or client-visible AI Draft |
| 6 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Preserve upload-not-sufficiency, audit persistence, export redaction rules | Do not treat upload/export/audit UI as proof |
| 7 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | No-overclaim feedback | Ensure API success/error states do not overclaim downstream gates | Do not let success messages imply release/sufficiency/approval |
| 8 | `STATE_SCREEN_SPEC.md` and `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Required UI states and interaction lifecycle | Drive loading/error/empty/permission/blocked/success states from API/service truth | Do not leave modal/drawer actions visual-only |
| 9 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Schema usage baseline | Align to existing full-workflow schema and field semantics | No blind patch-schema replacement |
| 10 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Positive/negative acceptance obligations | Map missing P0 tests and true-UX tests to API/service integration | Do not claim existing tests prove full P0 coverage |
| 11 | `ALPHAVEST_FULL_WORKFLOW_* v0.2–v0.7` KB layers | Historical route/API/schema/test and interaction reality | Use for recovery logic and proof limits | Do not override newer current snapshot facts |
| 12 | `main` repo / zip | False-gap history only | Explain legacy contamination if needed | Never derive target tasks from `main` |

**Binding rule:** current `full-workflow` code reality wins for implementation targets. KB artefacts provide controls, constraints, safety rules and known problem families.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-13 Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| UI states must not be static chips or visual metadata | Interaction Reality Audit; Prompt 00 Evidence Register | All V0.96 surfaces | Visual-only / static state | Critical | Bind UI state to service/API/read-model results | Yes |
| API route presence is not API safety proof | API Contract Matrix | `/api/**` | API safety | Critical | Harden validation, permissions, redaction and error envelopes | Yes |
| Upload success is upload-only | Evidence/Audit/Export Contract; Feedback Contract | Documents / Evidence / Upload | Evidence semantics | Critical | API and UI must return/display upload-only success, not sufficiency | Yes |
| Advisor approval is not compliance release | Feedback Contract; RBAC/Advice Contract | Advisor / Compliance / Decision | Gate semantics | Critical | API/UI state must separate advisor-approved from released | Yes |
| Client-facing views must fail closed | State Spec; RBAC/Visibility Contract | Portal / Mobile / Decision / Evidence | Client visibility | Critical | Client API/read-model must return only released/redacted payload or empty/hidden state | Yes |
| Audit display is not persistence proof | Interaction Audit; Evidence/Audit Contract | Audit timelines / compliance / export / governance | Audit proof | Critical | UI must load persisted audit refs, and safety actions fail/hold if audit cannot persist | Yes |
| Export preview ≠ approval ≠ download | Evidence/Audit/Export Contract; API Matrix | Export flow | Export safety | Critical | API response states must distinguish scope, preview, approval, generated/downloadable | Yes |
| Tables/forms/buttons must reflect permission and service state | Interaction Audit; Shared primitive contracts | Data tables / forms / CTAs | True UX | High | Disable/hide/deny via API/service permission state, not UI guesswork | Yes |
| Existing current snapshot has more APIs/tests than older KB | WP-13 source; current snapshot check | API/service layer | Moving baseline | High | Rebase before writing tasks; reuse current routes instead of inventing APIs | Yes |
| No new broad API architecture | Final Handoff / Task Master rules | API layer | Scope control | High | Only create new endpoint if WP-00 proves no existing route/service can support locked V0.96 need | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must perform this recheck before implementation because counts have moved beyond older KB layers.

### API routes to inspect first

| API Route | Reason to inspect | Expected WP-13 decision |
|---|---|---|
| `app/api/auth/dummy/route.ts` | Providerless but mapped user / tenant / role context | Must supply/validate actor context without anonymous payload expansion |
| `app/api/admin-tenants/route.ts` | Admin/tenant setup and governance context | Must not allow admin bypass of safety gates |
| `deleted generic workflow route` | Existing demo action transport | Reuse/harden; do not treat demo success as production persistence proof |
| `app/api/documents/route.ts` | Document/evidence list read model | Must apply tenant/object/visibility filters |
| `app/api/documents/upload/route.ts` | Upload mechanics | Must keep upload-only success and safe validation |
| `app/api/documents/review/route.ts` | Evidence review/sufficiency state | Must enforce review/link/relevance/acceptance preconditions |
| `app/api/audit-events/route.ts` | Audit read model / event access | Must expose scoped persisted audit refs only |
| `app/api/export-workflow/route.ts` | Export scope/redaction/approval/download states | Must separate preview/approval/download and exclude forbidden payloads |
| `app/api/review-monitoring/route.ts` | P1/review monitoring | Must not imply automatic advice or MVP promotion |
| `app/api/dashboard-metrics/route.ts` | Dashboard state/metrics | Must avoid leaking internal/advice data to client contexts |
| `app/api/global-search/route.ts` | Search payload risk | Must enforce tenant/object/payload visibility |
| `app/api/entities/route.ts` | Client/context entity read model | Must apply tenant/object scope and role visibility |
| `app/api/family-members/route.ts` | Family context read model | Must apply tenant/object/person visibility |
| `app/api/profile/route.ts` | Current user/profile context | Must not expose unrelated tenant or role escalation |
| `app/api/ops-sla/route.ts` | Ops/P1 data | Must not become MVP advice execution path |

### Services/modules to inspect first

| Module | WP-13 role |
|---|---|
| `lib/permission-engine.ts` | Route/action/object permission checks |
| `lib/visibility-engine.ts` | Client-safe payload projection and fail-closed visibility |
| `lib/workflow-gate.ts` | Advisor/compliance/release gate transitions |
| `lib/recommendation-review-workflow-validation.ts` | Request validation for typed workflow actions |
| `lib/typed-workflow-command-bus.ts` | Mutation result/audit/state transition proof limits |
| `lib/document-upload-service.ts` | Upload validation and persisted upload-only state |
| `lib/evidence-review-service.ts` | Evidence review/sufficiency/linking state |
| `lib/evidence-service.ts` | Evidence records and read-model state |
| `lib/audit-service.ts` | Persisted audit events and fail-closed action support |
| `lib/export-workflow-readmodel-service.ts` | Export UI read-model and workflow state |
| `lib/export-service.ts` / `lib/export-package-service.ts` | Export redaction/manifest/package safety |
| `lib/admin-tenant-readmodel-service.ts` | Admin/tenant UI truth without bypass |
| `lib/product-guidance.ts` | Page guidance; must not be decorative or stale |
| `lib/ux-page-contract.ts`, `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts` | UI truth and density integration points |

### UI components to inspect first

| Component | WP-13 role |
|---|---|
| `components/client-intake-screen.tsx` | Client portal/mobile/documents must reflect service truth and fail closed |
| `components/internal-workflow-screen.tsx` | Signals/workbench/advisor/compliance state must be API/service-driven |
| `components/decisions-governance-screen.tsx` | Decisions/evidence/governance/audit state must be backed by services |
| `components/communication-export-ops-screen.tsx` | Export and ops UI must distinguish preview/approval/download and P1 boundaries |
| `components/admin-tenant-setup-screen.tsx` | Admin UI must not imply bypass authority |
| `components/demo-session-panel.tsx` | Demo session role/tenant preview must not be treated as production RBAC proof |
| `components/ui/state-panel.tsx` | Should render service-derived state, not invent state |
| `components/ui/data-table.tsx` | Loading/empty/error/permission state and row actions must be wired to data truth |
| `components/ui/evidence-list.tsx` | Evidence rows must show review/sufficiency/link state from service truth |
| `components/ui/audit-timeline.tsx` | Rows must reference persisted audit source where safety-relevant |
| `components/ui/modal.tsx`, `components/ui/drawer.tsx` | Actions inside primitives must call real lifecycle handlers and render safe API state |

### Tests to inspect first

Use current tests where present before creating new ones:

- `tests/p0-api-contract.spec.ts`
- `tests/fail-closed-error-envelope.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/document-upload-api.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/interaction-lifecycle.spec.ts`

---

## 5. WP Problem Statement

The current application contains many UI surfaces, status labels, actions, typed workflows and tests, but WP-13 must prevent a specific failure mode:

> The UI looks like a workflow operating system, while some states are still static, query-driven, demo-derived, chip-only or unbound from the actual service/API/safety state.

For V0.96 this is dangerous because the release promise depends on trust proof:

- Evidence must not look sufficient unless it is reviewed, linked, relevant and accepted.
- Advisor approval must not look like client release.
- Compliance release must not be shown unless gate preconditions passed and audit persisted.
- Client portal/mobile must show released client-safe content only.
- Audit timeline must not look like proof unless persisted audit events exist.
- Export preview must not look approved/downloadable unless scope, redaction, approval and audit are satisfied.
- Admin/governance surfaces must not look like superuser bypass surfaces.

WP-13 therefore binds UI truth to API/service truth.

---

## 6. V0.96 Journey Role

| Journey / Proof Spine | WP-13 role |
|---|---|
| `MJ-001` New family-office onboarding to first client-safe decision | Ensures current user, tenant, role and object scope drive UI and API payloads |
| `MJ-002` Evidence missing → upload → release | Ensures upload, review, sufficiency, evidence request and release blockers come from service truth |
| `MJ-003` AI draft rejected/rebuilt with evidence | Ensures AI/internal draft fields are internal-only and never returned to client/export payloads |
| `MJ-010` Admin role change cannot bypass compliance release | Ensures admin actions are permission-checked and cannot mutate release/visibility/evidence/export gates |
| `MJ-006` Cross-tenant access denied with audit proof | Ensures APIs apply tenant/object scope and UI fails closed on denial |
| `MJ-005` Export package with forbidden internal payload redaction | Ensures export UI state comes from export workflow service and forbidden fields are excluded |

---

## 7. UI / UX / Layout / IA Problem Mapping

| UI/UX/IA Problem | API/Service Integration Requirement | Affected Surfaces |
|---|---|---|
| Route catalogue feels complete even where behaviour is partial | Navigation/page headers must reflect workflow state from services, not route presence | App shell, page header, workbench hubs |
| Status chips pretend to be gates | Chips must map to service-derived state and show blocker/recovery action when unproven | Evidence, advisor, compliance, export, audit |
| Buttons visible even when gates fail | Button state must derive from permission + workflow gate + precondition service result | All action surfaces |
| Long pages contain mixed state, action and detail content | Use read models that split summary/gate/action/detail state | Workbench, compliance, export, evidence |
| Sparse pages do not explain current state | Fill empty state from safe read model: next step, blocker, related object, no released content | Client portal/mobile, queues, lists |
| Upload success overclaims sufficiency | Upload API response and UI copy must expose upload-only state | Upload, documents, evidence |
| Advisor approved overclaims release | Advisor API/service result must set `advisor_approved`/`compliance_pending`, not released | Advisor, compliance, decision |
| Audit display overclaims persistence | Audit UI must render persisted event IDs/source or show audit unavailable/fail-closed | Audit timeline/history, gate modals |
| Export preview overclaims approval/download | Export read model must separate `scope`, `redaction`, `preview`, `approval`, `download/share` | Export routes |
| Client-safe visibility depends on projection | Client UI must consume client-safe projection/read model only | Portal, mobile, client evidence/decision |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes now

- Map every V0.96 UI action/state to an existing API/service/read-model or explicitly mark it `READMODEL_ONLY`, `DEMO_ONLY`, `BLOCKED`, or `REQUIRES_WP14`.
- Harden existing API routes for request validation, actor/tenant/object scope, action permission, safe errors and fail-closed response shape.
- Add service-derived state to UI props where currently static chips/copy/buttons are used.
- Add safe error envelope handling in touched UI surfaces.
- Ensure failed API responses cannot advance UI state or show success messages.
- Ensure client/export payloads are redacted/fail-closed.
- Add/extend API and True-UX tests for positive and negative cases.

### Stays out

- No broad new API architecture.
- No GraphQL/API gateway rewrite.
- No production auth provider replacement.
- No blind Prisma schema replacement.
- No new screen generation or visual asset creation.
- No P1/HOLD route promotion.
- No automatic banking/custody integration.
- No autonomous advice engine.
- No client-visible AI Draft.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP13-T01 | Build API/service-to-UI state map | UI must not be driven by fake local state | `app/api/**/route.ts`, `lib/*service.ts`, `components/**/*.tsx`, `lib/route-registry.ts` | Inventory V0.96 UI states/actions; map each to API/service/read model; classify as `EXISTING`, `PARTIAL`, `STATIC`, `DEMO_ONLY`, `MISSING`, `BLOCKED`; create/update implementation report section | Every V0.96 surface has a declared state source and proof limit | `tests/source-reality-gate.spec.ts`, `tests/p0-api-contract.spec.ts` | Yes — prevents static chips/buttons | Stop if route/surface cannot be mapped without product decision |
| WP13-T02 | Standardize safe API response envelope | UI needs consistent success/error/pending/denied handling | All touched API routes; validation modules | Define or reuse response envelope with `ok`, `state`, `actionResult`, `visibility`, `errors`, `auditRef`, `nextStep`, `blockedReason`; avoid leaking internals | UI can distinguish success, validation error, permission denied, blocked and fail-closed hidden | `tests/fail-closed-error-envelope.spec.ts`, API route tests | Yes — maps errors to truthful UI states | Stop if envelope requires broad rewrite across unrelated P1 routes |
| WP13-T03 | Apply actor/tenant/object context before action and payload | User/tenant/role foundation must drive UI truth | `app/api/auth/dummy/route.ts`, `lib/demo-session.ts`, `lib/permission-engine.ts`, all touched APIs | Resolve current actor; require tenant/object scope; deny unknown/wrong tenant; ensure payload visibility is separate from route/action permission | Wrong tenant/role gets denied/hidden with no sensitive payload | `tests/providerless-scope.spec.ts`, `tests/control-layer-actor-scope.spec.ts`, `tests/permission-engine.spec.ts` | Yes — denied/hidden states are rendered from API truth | Stop if current auth context is unknown before WP-00 rebase |
| WP13-T04 | Bind Evidence UI to document/evidence services | Upload/review/sufficiency must not be static | `app/api/documents/*`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx` | Ensure APIs return upload-only, extraction pending, review pending, insufficient, rejected, sufficient, linked states; UI consumes these states | Upload success never marks evidence sufficient; sufficiency requires review/link/relevance/acceptance | `tests/document-upload-api.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Yes — Evidence Workbench states/CTA depend on service truth | Stop if evidence status needs schema change not covered by WP-14 |
| WP13-T05 | Bind Analyst/Advisor/Compliance gate UI to workflow services | Gate semantics must be real | `deleted generic workflow route`, `lib/workflow-gate.ts`, `lib/recommendation-review-workflow-validation.ts`, `lib/typed-workflow-command-bus.ts`, `components/internal-workflow-screen.tsx` | Ensure service/API result separates analyst reviewed, advisor approved, compliance pending/blocked/released; block invalid transitions; expose blocker/nextStep | Advisor approval never releases client visibility; compliance release requires preconditions | `tests/workflow-gate.spec.ts`, `tests/recommendation-review-workflow-api.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Yes — queue/detail/decision room states become truthful | Stop if mutation advances state on failed precondition |
| WP13-T06 | Bind client portal/mobile to client-safe projection only | Client UI must fail closed | `lib/visibility-engine.ts`, `app/api/documents/route.ts`, `components/client-intake-screen.tsx`, decision projection services/components | Ensure client-facing payloads use `CLIENT_SAFE_RELEASED_ONLY`; no AI Draft/internal notes/compliance notes/raw evidence; hidden/empty state if not released | Client sees only released safe summary or no released content | `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Yes — client UI is calm/fail-closed | Stop if UI needs internal fields to render client state |
| WP13-T07 | Bind audit surfaces and gate actions to persisted audit refs | Audit display must be proof-aware | `app/api/audit-events/route.ts`, `lib/audit-service.ts`, `components/ui/audit-timeline.tsx`, gate action APIs | Return scoped persisted audit events; gate action responses include audit reference where required; render audit unavailable/fail-closed if missing | Critical gate actions have audit refs or remain blocked/pending | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts` | Yes — audit UI shows source proof/absence | Stop if audit failure can still show success |
| WP13-T08 | Bind export UI to export workflow read model | Export must distinguish scope/redaction/approval/download | `app/api/export-workflow/route.ts`, `lib/export-workflow-readmodel-service.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `components/communication-export-ops-screen.tsx` | Return export workflow state; exclude forbidden payload; expose blockers; keep preview/approval/download distinct | Export UI cannot show ready/downloadable until preconditions pass | `tests/phase8-export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` | Yes — export UI becomes a staged process | Stop if internal payload is needed for export preview |
| WP13-T09 | Map API error states to UI recovery states | Errors must not advance workflow | All touched APIs and components with actions/modals/drawers | Wire loading/pending/error/permission/blocked/retry states; preserve form input where safe; disable primary CTA during pending | Failed API response never shows success, never advances gate, gives safe recovery | `tests/fail-closed-error-envelope.spec.ts`, `tests/interaction-lifecycle.spec.ts`, `tests/confirmation-lifecycle.spec.ts` | Yes — improves true interaction lifecycle | Stop if error response exposes stack/internal data |
| WP13-T10 | Prevent API/service integration from creating route/scope expansion | Scope discipline | `lib/route-registry.ts`, route scope docs, API route mapping | Mark P1/HOLD/reference-only routes as deferred; do not wire V0.96 actions into them unless locked | No held/P1 route becomes MVP through API wiring | `tests/source-reality-gate.spec.ts`, `tests/route-smoke.spec.ts` | Indirect — avoids route-catalog expansion | Stop if task requires 064–071 visual/scope unlock |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### Routes / surfaces

| Surface family | Route IDs / Paths | WP-13 treatment |
|---|---|---|
| Access/current-user context | `001–006`, `/login`, `/mfa`, onboarding routes | API/service context must resolve mapped actor/tenant/roles or fail closed |
| Documents/Evidence | `027–030`, `/documents`, `/documents/upload`, extraction/review routes | Upload/review/sufficiency/link states from documents/evidence APIs |
| Advisory workflow | `033–037`, `/signals`, `/workbench`, `/advisor-approval` | AI/analyst/advisor states from workflow service; internal-only payload rules |
| Compliance | `038–042`, `/compliance/**` | Precondition, block, request evidence, release, audit states from workflow/audit services |
| Decisions/Evidence/Governance | `043–051`, `/decisions`, `/evidence`, `/governance/**` | Decision record, evidence, audit and admin non-bypass states from services |
| Export | `054–058`, `/export/**` | Export scope/redaction/approval/download state from export workflow service |
| Client-facing | `019–020`, `/portal`, `/mobile` | Client-safe projection only, fail-closed hidden/empty state |

### Schema areas to use, not blindly replace

- `User`, `UserRole`, `Role`, `Permission`, `RolePermission`
- `ClientTenant`, tenant/object scoping fields
- `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`
- `EvidenceRecord`, `EvidenceItem`
- `Trigger`, `Recommendation`, `Approval`, `ComplianceReview`, `Decision`
- `AuditEvent`
- `ExportRequest`

---

## 11. Interaction Lifecycle Requirements

All API-backed actions touched in WP-13 must expose or support these lifecycle states:

| Lifecycle Stage | Required behaviour |
|---|---|
| Idle | UI shows state from latest service/read-model; primary CTA depends on allowed next step |
| Precondition check | Permission, tenant/object scope, evidence/gate requirements evaluated before mutation |
| Pending/loading | UI disables primary action, preserves safe context, announces pending state |
| Validation failed | API returns field/form/precondition errors without state advancement |
| Permission denied | API returns safe denied state; UI shows denied/hidden/blocked as appropriate |
| Blocked | API returns blocker + next step; UI does not pretend action is available |
| Success | Success names only the completed action; downstream gates remain pending unless actually passed |
| Audit required | Safety action returns persisted audit reference or fails/holds closed |
| Retry/recovery | UI offers retry/cancel/back to queue where safe |

---

## 12. State / Feedback / Microcopy Requirements

WP-13 must supply service/API truth for the microcopy implemented in WP-12. Required examples:

| Situation | API/service truth | UI copy constraint |
|---|---|---|
| Upload completed | `uploaded`, `reviewPending`, no sufficiency | “Upload complete. Evidence still requires review.” |
| Evidence insufficient | `evidenceStatus=insufficient`, blocker/reason | “Evidence is insufficient for release. Request or link additional evidence.” |
| Advisor approved | `advisorApproved`, `compliancePending` | “Advisor approved. Waiting for compliance release.” |
| Compliance blocked | `complianceBlocked`, reason, next step | “Release blocked. Evidence or policy condition must be resolved.” |
| Client before release | no released projection | “No released content is available yet.” |
| Audit unavailable | audit persistence missing/failed | “Action cannot complete because audit proof is unavailable.” |
| Export preview generated | `previewReady`, not approved/downloadable | “Preview ready. Approval is still required before download/share.” |
| Permission denied | `denied`, no sensitive details | “You do not have permission to perform this action.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety area | WP-13 implication |
|---|---|
| RBAC | Every action request must validate actor, role, action, tenant and object scope before payload generation. |
| Payload visibility | Response payload must be shaped by actor/context; route access cannot expand payload fields. |
| Advice boundary | AI Draft/internal rationale cannot be returned to client/export APIs. |
| Evidence | Upload API cannot mark evidence sufficient; review/link/relevance/acceptance must drive sufficiency state. |
| Advisor/Compliance | Advisor API result cannot set client-visible release; compliance release must remain separate. |
| Audit | Critical gate API responses must include persisted audit references or fail/hold closed. |
| Export | Export API/read-model must exclude forbidden internal payload and distinguish preview/approval/download. |
| Client visibility | Client-facing APIs return released/redacted projection only or fail-closed hidden/empty state. |
| Admin non-bypass | Admin APIs cannot mutate release/evidence sufficiency/client visibility/export approval outside gates. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| WP13-POS-001 | Every V0.96 UI state/action in touched surfaces has a documented API/service/read-model source. |
| WP13-POS-002 | Existing API routes are reused/hardened before any new API route is considered. |
| WP13-POS-003 | API responses use a safe success/error/blocked/denied/pending envelope or equivalent existing pattern. |
| WP13-POS-004 | Documents/evidence APIs expose upload-only, review, insufficiency, sufficiency and link states without overclaim. |
| WP13-POS-005 | Workflow APIs/services separate analyst, advisor, compliance and client release states. |
| WP13-POS-006 | Client-facing APIs/components consume only client-safe projection/read-model. |
| WP13-POS-007 | Export workflow API/read-model separates scope, redaction, preview, approval and download/share. |
| WP13-POS-008 | Critical safety actions return audit references or a blocked/fail-closed state. |
| WP13-POS-009 | UI loading/error/empty/permission/blocked/success states are driven by API/service result, not static hardcoded chips. |
| WP13-POS-010 | Current P0/API/True-UX tests pass after changes. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criteria |
|---|---|
| WP13-NEG-001 | Failed API response must not advance UI or workflow state. |
| WP13-NEG-002 | Wrong tenant/object scope must not receive sensitive payload or success response. |
| WP13-NEG-003 | Route access must not imply action permission or payload visibility. |
| WP13-NEG-004 | Upload success must not mark evidence sufficient, compliance released or client-visible. |
| WP13-NEG-005 | Advisor approval must not release content to client-facing APIs/UI. |
| WP13-NEG-006 | AI Draft/internal rationale/analyst notes/compliance notes must not appear in client/export payloads. |
| WP13-NEG-007 | Missing audit persistence must not show action success for safety-critical gates. |
| WP13-NEG-008 | Export preview must not allow download/share without approval/redaction/audit preconditions. |
| WP13-NEG-009 | Admin action must not bypass evidence, compliance, visibility, audit or export gates. |
| WP13-NEG-010 | API error envelope must not expose stack traces, Prisma internals, hidden field names or cross-tenant object details. |
| WP13-NEG-011 | P1/HOLD routes must not become V0.96 MVP implementation scope through API wiring. |

---

## 16. Required Tests and Test Names

Codex must inspect existing tests first and extend rather than duplicate where practical.

| Test File | Required purpose |
|---|---|
| `tests/p0-api-contract.spec.ts` | Main WP-13 positive/negative API contract tests across V0.96 surfaces |
| `tests/fail-closed-error-envelope.spec.ts` | Safe error envelope, no state advancement, no sensitive error leakage |
| `tests/evidence-review-api.spec.ts` | Evidence review/sufficiency/linking API truth |
| `tests/document-upload-api.spec.ts` | Upload-only success, file validation, denied role/audit proof |
| `tests/client-visibility-projection.spec.ts` | Client-safe projection and fail-closed hidden state |
| `tests/phase8-export-workflow-api.spec.ts` | Export scope/redaction/approval/download state separation |
| `tests/export-safety.spec.ts` | Forbidden export payload exclusion |
| `tests/audit-fail-closed.spec.ts` | Audit persistence or action block/fail-closed proof |
| `tests/governance-non-bypass.spec.ts` | Admin cannot bypass release/evidence/export/visibility gates |
| `tests/true-ux-p0-safety.spec.ts` | UI states/copy reflect API/service truth and no-overclaim semantics |
| `tests/ui-state-boundaries.spec.ts` | Loading/error/empty/permission/blocked/success states are service-driven |
| `tests/interaction-lifecycle.spec.ts` | Modal/action lifecycle uses API pending/success/error/blocked result |

Potential new test names only if existing files are missing or insufficient:

- `tests/api-ui-truth-map.spec.ts`
- `tests/client-export-payload-redaction.spec.ts`
- `tests/api-no-state-advance-on-error.spec.ts`

---

## 17. Validation Commands

Codex must inspect `package.json` scripts first. Use the equivalent available commands.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm playwright test tests/p0-api-contract.spec.ts
pnpm playwright test tests/fail-closed-error-envelope.spec.ts
pnpm playwright test tests/evidence-review-api.spec.ts
pnpm playwright test tests/client-visibility-projection.spec.ts
pnpm playwright test tests/phase8-export-workflow-api.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/ui-state-boundaries.spec.ts
```

If scripts differ, record the actual commands used in the implementation evidence report.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Reason |
|---|---|
| Do not create a broad new API architecture | WP-13 is hardening/reuse, not platform rewrite |
| Do not create new API routes unless WP-00 proves no existing route/service can support a locked need | Prevents parallel API sprawl |
| Do not expose internal payload for UI convenience | Violates client visibility/advice boundary/export safety |
| Do not let API failure show success or advance state | Violates no-overclaim and fail-closed rules |
| Do not mark upload as evidence sufficient | Violates evidence sufficiency contract |
| Do not treat advisor approval as release | Violates workflow gate contract |
| Do not treat audit display as persistence | Violates audit proof contract |
| Do not treat export preview as approval/download | Violates export safety contract |
| Do not use `main` as target truth | False-gap source only |
| Do not elevate P1/HOLD/reference routes | Scope locked elsewhere |
| Do not perform blind Prisma schema replacement | WP-14 governs schema alignment |
| Do not generate screens, images or new visual assets | Not authorized for V0.96 |

---

## 19. Open Questions / Blockers

| Question / Blocker | Required Handling |
|---|---|
| Current API envelope pattern may already exist | Reuse existing pattern if present; do not create duplicate abstraction |
| Some routes/services may already be fully implemented | Mark `ALREADY_PRESENT` after WP-00 and avoid duplicate work |
| Some UI surfaces may still use demo-only state | Classify as `PARTIAL` and bind to read model/API where V0.96 scope requires it |
| Some status fields may be string/JSON and not enum-safe | Route to WP-14; do not blindly migrate schema in WP-13 |
| Audit failure simulation may require test hooks/mocks | Implement only if supported by existing test architecture; otherwise document blocker for WP-15 |
| Client-safe projection may be split across services/components | Prefer central projection/read-model contract; avoid repeated component-local filtering |

---

## 20. Codex Execution Notes

1. Run WP-00 first and read `V0_96_UX_IA_DELTA_REGISTER.md` if it exists.
2. Treat this task as a service/API truth layer for UI work, not a visual redesign.
3. Start with inventory and mapping before edits.
4. Prefer reusing existing APIs/services and extending their contracts.
5. Keep UI/components thin: business safety rules should live in services/engines/read models where possible.
6. Any UI copy/state changed in this WP must align with WP-12 no-overclaim microcopy.
7. Any schema need discovered must be routed to WP-14 before migration.
8. Add negative tests first for safety-sensitive areas to prevent accidental leakage/overclaim.
9. Preserve existing tests unless they are demonstrably wrong; update expectations only with clear evidence.
10. Final implementation report must include API/state map and before/after proof for each touched surface.

---

## 21. QA Matrix

| QA Check | Expected Result |
|---|---|
| Source hierarchy preserved | PASS — current full-workflow reality used; `main` blocked |
| Existing API routes inspected before new route creation | PASS required |
| UI states tied to service/API/read-model truth | PASS required |
| Safe error envelope or equivalent used | PASS required |
| Permission/tenant/object scope enforced before payload | PASS required |
| Client/export payload redaction proven | PASS required |
| Upload-only success preserved | PASS required |
| Advisor/compliance/release separation preserved | PASS required |
| Audit persistence/fail-closed handled | PASS required |
| Export preview/approval/download separation preserved | PASS required |
| No P1/HOLD scope elevation | PASS required |
| No schema replacement | PASS required |
| Positive and negative tests mapped | PASS required |
| No screen/image generation | PASS required |

---

## 22. ENGINE Execution Proof

| Phase | Engine | Applied To | Output |
|---|---|---|---|
| KB / UX / IA Discovery | ENGINE_v3 | Extracted WP-13-relevant evidence: visual-only states, no-overclaim risk, route-catalog risk, service truth requirement, client-safe projection and export/audit confusion | KB Evidence Intake + UI/UX/IA Problem Mapping |
| Contradiction Control | ENGINE_v3 | Reconciled older API count assumptions with current snapshot showing 15 API routes and 50 specs | Current Code / Route / Component Reality to Recheck |
| Source Discipline | ENGINE_v2 | Locked `full-workflow` as implementation baseline, `main` as false-gap only and Markdown as control evidence | Source-of-Truth Lock |
| Operational Decomposition | ENGINE_v2 | Converted WP-13 into concrete subtasks with files/modules, steps, acceptance criteria, tests and stop rules | Detailed Implementation Task Breakdown |
| Safety / P0 Discipline | ENGINE_v2 | Mapped RBAC, visibility, advice boundary, evidence, audit, export and API negative tests | Positive/Negative Acceptance Criteria + Required Tests |
| Codex-Spark-like Convergence | Codex-Spark-like | Avoided broad API strategy alternatives and converged into implementable instructions | Codex Execution Notes + QA Matrix |

