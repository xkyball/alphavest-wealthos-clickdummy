# ALPHAVEST WP-03 - Client-Safe Visibility & Portal States Execution

Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_BOC_TICKET_STRUCTURE.md`

Execution date: 2026-06-25.

Operative source of truth: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.

Baseline:

- Branch: `full-workflow`
- Baseline commit: `bcd7953 feat: add wp02 worksurface shell`
- Working tree before WP-03 edits: clean
- `pnpm guard:source`: PASS
- WP-00 technical guard: present and passing
- WP-01 / WP01.8 process navigation: present through `components/process-navigation.tsx`, `ProcessSidebar`, and `tests/navigation-shell.spec.ts`
- WP-02 worksurface shell: present through `components/worksurface-shell.tsx`

## Extracted Task Chain

The upload defines WP-03 as a delivery chain, not a single direct implementation task. Parent WP-03 is safety-critical and gross CTES 13-16, so direct whole-package implementation is explicitly not allowed before analysis, specification, and any required projection/API decision.

### EPIC: WP-03 - Client-Safe Visibility & Portal States

Detailed description: Convert the client-facing portal/mobile layer into a controlled client-safe projection. Client Portal and Mobile views must show only released, redacted, client-safe information. Every uncertain, unreleased, internal-only or unsafe state must fail closed.

Goal: Make Client Portal/Mobile a safe released projection, not a raw internal workflow or route-access view.

Scope: Routes `019`, `020`, relevant released decision surfaces `043-045`, evidence-safe summary/status surfaces from `027-030` and `046-047` where client-facing, payload visibility and redaction rules, P0 positive/negative client-visibility tests.

Out of scope: Screen generation, state-screen image generation, visual replacement, P1 communication routes, hold routes, KYC/suitability/committee routes, blind schema replacement, new API creation without explicit decision, client acceptance semantics.

Completion criteria: Current-state visibility analysis complete; proof/test inventory complete; client-safe payload/state specification complete; projection/API boundary decision documented where needed; implementation tasks unblocked only after those gates; P0 positive/negative checks defined and later proven.

### ANALYSIS-1 - Audit Current Client-Facing Visibility, Payload And State Surfaces

Detailed description: Inspect current client-facing routes, components, APIs, services, visibility helpers and tests that render or influence `/portal`, `/mobile`, released decisions, and evidence-safe summaries.

Subtasks from upload:

- Step 1, Client-facing route/component inventory: identify all code paths that render `/portal`, `/mobile`, released decisions and client-safe summaries.
- Step 2, Payload source and field exposure audit: verify which data fields are shown or returned to client-facing surfaces and classify visible, redacted, hidden and unknown fields.
- Step 3, Existing state behaviour audit: verify loading, error, empty, permission, hidden, redacted and blocked states in affected views.

Output expected by upload: current-state route/component/API/service/test map, payload exposure register, state coverage gap list, risks/blockers, recommendation for SPEC-1 and implementation split.

Execution result: Complete in this artefact.

### ANALYSIS-2 - Map Existing Tests/Proofs And Missing Leakage Cases

Detailed description: Classify existing tests and proof slices for WP-03 relevance and derive missing positive/negative P0 cases.

Subtasks from upload:

- Step 1, Existing proof classification: classify relevant tests as positive proof, negative proof, partial proof or not covered.
- Step 2, Missing negative cases derive: derive cases for AI Draft visible, unreleased recommendation visible, advisor-approved but not compliance-released visible, internal evidence visible, compliance notes visible and admin bypass visible.

Output expected by upload: WP-03 test/proof map, missing P0 positive cases, missing P0 negative leakage cases, recommendation for test extension.

Execution result: Complete in this artefact.

### SPEC-1 - Client-Safe Visibility, Payload And Portal-State Contract

Detailed description: Define the target state precisely enough that Codex can implement portal/mobile states, payload projection and tests without inventing product or safety semantics.

Subtasks from upload:

- Define route/state requirements for `/portal` and `/mobile`.
- Define payload visibility/redaction rules.
- Define acceptance and negative P0 cases.

Output expected by upload: target state, route states, payload rules, implementation boundaries, positive/negative acceptance criteria and QA design.

Execution result: Complete in this artefact, with `DECISION-WP03-01` as active stop gate before code implementation.

### DECISION-1 - Confirm Client-Safe Projection/API Boundary If Needed

Detailed description: Decide where client-safe projection should be enforced if analysis reveals multiple viable implementation paths.

Decision needed by upload:

- Existing API/service reuse versus helper/service extension.
- No new API by default.
- Decision record for allowed and forbidden implementation boundaries.

Execution result: Reached. This is the active stop gate before code implementation.

Aggressive recommendation: approve Option A, a single canonical projection boundary using the existing `lib/visibility-engine.ts` plus `lib/control-layer/client-visibility.ts`; add a small WP03-facing adapter/state model only if needed, and do not create a new API in WP03.

Reason: This removes duplicate visibility logic, keeps route access separate from payload visibility, preserves the existing test foundation and prevents the cleanest future solution from becoming a second projection stack.

### IMPL-1 - Implement Fail-Closed Client Portal And Mobile UI States

Detailed description: Implement hidden, empty, redacted, permission, error, loading and blocked states in Client Portal and Mobile views.

Subtask IMPL-1.1: Wire hidden/empty/redacted/permission/error states.

- Implement explicit safe branches for hidden, empty, redacted, permission denied, loading and error.
- Make each state triggerable through fixture, mock, demo state or projection result.
- Ensure no internal data renders in any branch.

Subtask IMPL-1.2: Remove unsafe optimistic client fallback content.

- Replace fallback content that could show unreleased/internal data with SPEC-1 compliant safe states.
- Prevent loading/error/missing-proof paths from rendering stale internal content.
- Avoid copy that leaks internal object existence.

Execution status: Blocked until `DECISION-WP03-01` is approved.

### IMPL-2 - Implement Client-Safe Payload Projection Wiring

Detailed description: Wire client-safe payload projection so client-facing UI/API receives only visible/redacted safe fields.

Subtask IMPL-2.1: Apply route/action/object/payload visibility checks.

- Enforce tenant, object, role and release-state visibility before client payload is returned or rendered.
- Keep route access, action permission and payload visibility separate.
- Wrong tenant/object/release cases must fail closed.

Subtask IMPL-2.2: Exclude AI Draft, internal rationale, compliance notes and unreleased evidence.

- Filter forbidden fields at the projection boundary, not only in UI.
- Ensure nested evidence/audit/internal fields cannot leak.
- Add negative assertions for forbidden field absence.

Execution status: Blocked until `DECISION-WP03-01` is approved.

### IMPL-3 - Implement Released Decision And Evidence-Safe Summary Wiring

Detailed description: Wire released decision summaries and evidence-safe summaries so client-facing views show only compliance-released, redacted and evidence-safe content.

Subtasks from upload:

- Gate decision summary by compliance release.
- Render evidence-safe requested/uploaded/review-pending status without implying sufficiency.

Execution status: Blocked until `DECISION-WP03-01` is approved.

### QA-1 - Validate WP-03 Client-Safe Visibility P0 Positives And Negatives

Detailed description: Validate that Client Portal/Mobile and related client-safe projections show only released/redacted/client-safe information and fail closed for negative leakage/bypass cases.

Required checks:

- Client with no release sees hidden/empty safe state.
- Client with released decision sees only client-safe summary.
- AI Draft/internal rationale/compliance notes are absent.
- Unreleased evidence is absent or redacted.
- Advisor-approved but not compliance-released content is hidden.
- Upload success does not show sufficiency or release.
- Wrong tenant/object scope is hidden/denied.
- Admin bypass does not force client visibility.
- Loading/error states do not show stale internal content.

Execution status: Blocked until IMPL-1, IMPL-2 and IMPL-3 are complete.

## ANALYSIS-1 Result

### Route And Component Inventory

| Surface | Current code path | Current status | WP-03 assessment |
| --- | --- | --- | --- |
| Route `019` `/client/home` | `app/[...segments]/page.tsx` -> `ClientIntakeScreen` -> `PortalPage` | Implemented; mounted in `WorksurfaceShell`; contains `ClientSafeProjectionCard` and Phase 7 proof panel | Partial positive basis; needs WP03 state model and no-leakage states beyond hard-coded demo examples |
| Route `020` `/client/home` | `lib/route-registry.ts` duplicates `/client/home`; `ClientIntakeScreen` has `MobileHomePage` for pageId `020` | Ambiguous route registry: page IDs `019` and `020` share the same path | Must be corrected/decided in implementation: route-level proof cannot reliably distinguish portal vs mobile while both use `/client/home` |
| Legacy docs/manual route | `docs/v3/user-manual-source/SCREENSHOT_SHOTLIST_V3.md` says `/portal` and `/mobile` | Historical docs differ from current route registry | Treat docs as stale reference; current route registry is code truth unless later route evolution approves alias/mapping |
| Decisions `043-045` | `components/decisions-governance-screen.tsx` | Implemented; `DecisionRoomPage` includes Phase 7 projection panel and decision traceability card | Partial; decision projection exists but client-facing released state must remain compliance-gated |
| Evidence `046-047` | `components/decisions-governance-screen.tsx` evidence pages | Implemented as evidence/governance surfaces | Relevant for safe summaries, not raw client payload exposure |
| Documents `027-030` | `components/client-intake-screen.tsx`, `/api/documents`, upload/review routes | Implemented; upload-only lifecycle states and document API projection exist | Important WP03 surface because upload status must not imply evidence sufficiency/client release |
| Journey client projection | `app/api/journeys/[id]/client-projection/route.ts`, `lib/journeys/journey-api-service.ts`, `components/journeys/journey-detail.tsx` | Implemented; data-quality blocker can force client projection to `BLOCKED` | Strong existing safe projection pattern; can be used as model, but not as new global API in WP03 |

### Payload Projection Inventory

| Code path | Current behavior | WP-03 assessment |
| --- | --- | --- |
| `lib/visibility-engine.ts` | Central decision/recommendation/document projection engine with fail-closed reason codes and forbidden field contract | Best current canonical boundary |
| `lib/control-layer/client-visibility.ts` | WCL-04 wrapper normalizing visibility-engine projections into allowed/hidden results | Best current implementation boundary for WP03 wiring |
| `visibilityEngine.projectDecisionPayload` | Client role sees only `id`, `title`, `decisionState`, optional `clientSummary`, `releasedAt` when `clientVisible`, `CLIENT_VISIBLE`, and `RELEASED` | Good positive basis |
| `visibilityEngine.projectRecommendationPayload` | Client role sees only `clientSummary` after released/accepted/deferred/rejected client-visible status | Good basis; must still test unreleased/internal negative cases |
| `visibilityEngine.projectDocumentPayload` released evidence path | Client role sees only `id`, `title`, `documentType`, `status`, `uploadedAt` for validated/released and client-visible/redacted evidence | Good positive basis |
| `visibilityEngine.projectDocumentPayload` source upload path | `family_cfo` can receive `fileName`, `fileSizeBytes`, `sensitivity`, `status` for own uploaded source documents | Conflict/decision required: this is intentional upload metadata behavior, but `fileName` and `fileSizeBytes` are globally forbidden in `trueUxClientProjectionNoLeakageContract` |
| `/api/documents` | Calls `listUploadedDocuments`, which projects each document through `visibilityEngine.projectDocumentPayload` | Good boundary reuse, but source-document metadata exception must be explicitly specified |
| `/api/journeys/[id]/client-projection` | Returns client journey projection and blocks on data-quality gate; response safety marks `internalPayloadReturned: false` | Strong existing route-level safe API pattern |
| `/api/demo-workflow` | Contains demo workflow actions and client projection assertions in tests | Relevant for release/advisor/upload semantics; do not use as raw client payload source |

### Field Exposure Findings

| Field group | Current client projection status | WP-03 classification |
| --- | --- | --- |
| `clientSummary`, `id`, `title`, `decisionState`, `releasedAt` | Allowed for released decision payloads | Visible when compliance release and client visibility pass |
| `documentType`, `status`, `uploadedAt` | Allowed for released/redacted evidence summary | Visible when release/redaction/evidence visibility pass |
| `aiDraft`, `internalRationale`, `complianceNotes`, `assumptionsJson` | Hidden by visibility engine | Forbidden |
| `evidenceRecordId`, `evidenceStatus`, `evidenceVisibilityStatus`, `extractionStatus`, `checksum`, `storageKey`, `mimeType` | Hidden by visibility engine for client projections | Forbidden |
| `fileName`, `fileSizeBytes` | Forbidden in global contract, but returned for `SOURCE_DOCUMENT_AVAILABLE` source upload path | Needs explicit WP03 rule: allowed only in source-upload status projection, never in released decision/evidence projection |
| `sensitivity` | Returned in source upload path, not in allowed global contract | Needs explicit WP03 rule or removal from source-upload client projection |

### State Coverage Audit

| Required state | Current coverage | Status |
| --- | --- | --- |
| Released/visible | `ClientSafeProjectionCard`, decision traceability card, document projection tests | Exists but demo-hardcoded in UI |
| Hidden/no released content | `ClientSafeProjectionCard` blocked sample and document API hidden results | Partial; needs canonical state renderer |
| Empty | Generic `StatePanel` and table empty states exist | Partial; not unified as client-safe no-release state |
| Redacted | Document projection supports redacted/released status | Partial; UI route-state proof not complete |
| Permission denied | Journey detail/action denial states and route shell context exist | Partial; portal/mobile client projection denial state not complete |
| Loading | Generic loading states exist across pages | Partial; no WP03-specific stale-content assertion |
| Error | Generic error/fail-closed states exist | Partial; no WP03-specific stale-content assertion |
| Blocked | Journey client projection data-quality blocker and workflow gate tests exist | Exists for journey detail/API; partial for portal/mobile |
| Source document available | Document API/source upload path supports it | Exists but conflicts with global forbidden field contract |

### ANALYSIS-1 Risks And Blockers

- Route `019` and `020` both map to `/client/home`; this weakens route-specific mobile proof and must be cleaned in WP03 implementation or explicitly deferred as route-evolution work.
- Source-upload metadata (`fileName`, `fileSizeBytes`, `sensitivity`) is currently a product exception to the global no-leakage contract. It needs an explicit spec rule.
- Current UI projection card proves the engine path but is not yet a complete client portal state machine.
- Existing UI often demonstrates both safe and blocked examples together. WP03 needs route/state-driven branches, not just side-by-side proof copy.

## ANALYSIS-2 Result

### Existing Test And Proof Map

| Test/proof | Current coverage | WP-03 classification |
| --- | --- | --- |
| `tests/true-ux-client-projection.spec.ts` | Visibility-engine no-leakage contract, released/blocked recommendation/decision/document, route Phase 7 panels, portal projection card and mobile density | Strong partial proof; not full WP03 state coverage |
| `tests/client-visibility-projection.spec.ts` | WCL wrapper for recommendation/decision/document projection | Strong service-boundary proof |
| `tests/client-visibility-proof.spec.ts` | Legacy/minimum projection and export checks | Partial regression proof |
| `tests/document-upload-api.spec.ts` | Upload-only semantics, source-document projection, blocked/released document API projection | Strong upload/API proof; exposes source metadata exception |
| `tests/demo-workflow-api.spec.ts` | Workflow actions, no client release through intermediate actions, client projection after release | Strong workflow semantics proof |
| `tests/journey-api.spec.ts` | Journey client projection, no internal leakage, advisor/compliance release flow | Strong API/journey proof |
| `tests/run2-safety-boundary.spec.ts` | Data-quality blocker turns client projection to blocked | Strong blocked-state API proof |
| `tests/permission-engine.spec.ts` | Role/permission/visibility restrictions | Partial; not full client portal payload proof |
| `tests/route-smoke.spec.ts` | Route reachability | Not payload visibility proof |
| `tests/navigation-shell.spec.ts` | Shell/nav scope | Not payload visibility proof |
| `tests/file-export-realism.spec.ts` | Export file metadata/safety realism | Relevant later for WP07; not WP03 client portal proof |

### Missing Positive Cases

- Dedicated portal state test for released decision only, using the canonical projection boundary instead of side-by-side demo card only.
- Dedicated mobile route/state proof that is not ambiguous with route `019`.
- Released/redacted evidence summary visible state that proves only allowed fields.
- Source-upload status visible state with explicit allowed metadata, if approved.

### Missing Negative Cases

- Portal/mobile must not show AI draft, internal rationale, compliance notes or assumptions when those fields exist in fixture payload.
- Advisor-approved but not compliance-released content must remain hidden in portal/mobile.
- Upload success must remain upload-only and not imply evidence sufficiency or release.
- Wrong tenant/object scope must fail closed at projection/API and UI state.
- Admin/security roles must not force client visibility.
- Loading/error states must not show stale internal or previously visible unsafe data.
- Source-upload metadata must not be treated as released evidence payload.

## SPEC-1 Result

### Canonical Target State

Client Portal and Mobile views consume a client-safe projection state. They do not read or render raw internal recommendation, decision, evidence or audit payloads. They render one of these states:

- `released`: compliance-released, tenant-scoped, client-visible payload with allowed fields only.
- `redacted`: released or validated evidence summary where only redacted safe metadata is available.
- `source_upload`: own-source document upload status for approved client upload roles, if DECISION-WP03-01 approves the metadata exception.
- `empty`: no released client-safe content exists.
- `hidden`: object exists or may exist internally, but no client-visible proof exists; do not reveal internal details.
- `permission_denied`: user/tenant/object scope is not allowed; do not reveal internal object existence.
- `blocked`: preconditions such as data-quality, evidence, compliance release or redaction are not satisfied.
- `loading`: no unsafe placeholder, cache or internal default content.
- `error`: fail closed, no stale unsafe content.

### Payload Rules

- Route access is never payload visibility.
- Action permission is never payload visibility.
- Advisor approval is never compliance release.
- Compliance release is never client acceptance.
- Upload success is never evidence sufficiency.
- Client-visible released decision payload fields: `id`, `title`, `decisionState`, optional `clientSummary`, `releasedAt`.
- Client-visible released/redacted document summary fields: `id`, `title`, `documentType`, `status`, `uploadedAt`.
- Client-visible recommendation payload: `clientSummary` only.
- Forbidden fields for released projections: `aiDraft`, `internalRationale`, `complianceNotes`, `assumptionsJson`, `evidenceRecordId`, `auditEventId`, `auditMetadata`, `checksum`, `storageKey`, `mimeType`, `evidenceStatus`, `evidenceVisibilityStatus`, `extractionStatus`, raw file metadata.
- Source-upload status may only expose `fileName` and `fileSizeBytes` if explicitly treated as own-upload status, not as released evidence content. Aggressive recommendation: remove `sensitivity` from client source-upload projection during implementation unless a separate product rule requires it.

### Implementation Boundary

Use `lib/visibility-engine.ts` as canonical projection logic and `lib/control-layer/client-visibility.ts` as canonical control-layer wrapper.

Allowed after approval:

- Add a small WP03 portal state adapter that converts visibility-engine/WCL results into UI state names.
- Extend tests around `visibilityEngine`, WCL wrapper, `/api/documents`, journey projection and portal/mobile UI states.
- Refactor `ClientSafeProjectionCard` into a state-driven renderer.

Forbidden in WP03:

- Creating a new API before proving existing routes/services cannot support the projection.
- Filtering only in UI while raw API returns unsafe fields.
- Duplicating projection rules in a second local helper.
- Reclassifying P1/Hold/Reference routes.
- Treating `/client/home` route duplication as proof that both web and mobile states are separately covered.

### Acceptance Criteria

- Given a client user with no released decision, `/client/home` shows a safe empty/hidden state and no internal recommendation, AI draft, evidence internals or compliance note.
- Given a client user with a compliance-released decision, `/client/home` shows only allowed released decision fields.
- Given advisor approval without compliance release, client-facing portal/mobile states stay hidden or blocked.
- Given uploaded evidence not reviewed/sufficient, client sees at most upload-only status and never evidence sufficiency or release readiness.
- Given wrong tenant/object scope, API/projection/UI fail closed and do not reveal cross-tenant content.
- Given admin/security role tries to force visibility, client visibility stays blocked unless release/redaction/evidence/audit preconditions pass.
- Given loading/error, no stale unsafe content is rendered.

## DECISION-WP03-01 Active Stop Gate

The upload asks for a human decision if multiple projection/API boundaries remain. Analysis found multiple possible paths:

1. Extend existing `visibilityEngine` and WCL wrapper.
2. Build a local portal-only projection helper.
3. Reuse journey client-projection API pattern broadly.
4. Create a new WP03 projection API.

Aggressive recommendation: approve Option A.

```text
Projection boundary preference = existing visibilityEngine + WCL wrapper; no new API in WP03
Canonical demo fixtures = existing seed first; add minimal deterministic fixture only for missing negative states
Mobile projection = same projection engine as portal; reduced presentation allowed
Export/package links in WP-03 = defer to WP-07; no client package/download link in WP03
Source-upload metadata = allowed only as own-upload status; remove sensitivity from client source-upload projection unless explicitly justified
Route cleanup = resolve 019/020 path duplication before claiming separate mobile route proof
```

Rationale:

- Cleanest afterwards means one projection authority, not four.
- Existing code already has the right center of gravity in `visibilityEngine`.
- WCL wrapper prevents UI components from inventing business visibility semantics.
- No new API avoids expanding attack surface and test burden.
- The route `019/020` duplication is legacy drift; cleaning it gives stronger proof than working around it.
- Deferring export links to WP07 preserves lifecycle boundaries and avoids a premature download/share promise.

Decision accepted by user on 2026-06-25.

Implementation status after approval:

- `IMPL-WP03-00` complete.
- `IMPL-WP03-01` complete.
- `IMPL-WP03-02` complete.
- `IMPL-WP03-03` complete.
- `IMPL-WP03-04` complete with one unrelated route-smoke blocker noted below.
- Route `020` is moved to `/mobile` in `lib/route-registry.ts` so portal and mobile route proof are unambiguous.
- Mobile semantic projection test now visits `/mobile` and asserts mobile parity.
- Client portal/mobile rendering uses `lib/client-portal-projection-state.ts` as a small state adapter over `visibilityEngine`.
- Source-upload projection no longer exposes `sensitivity`; `fileName` and `fileSizeBytes` are treated as own-upload status metadata only.

## Recommended Next Implementation Plan After Approval

1. `IMPL-WP03-00`: route/proof cleanup for `019/020`.
   - Status: implemented after approval.
   - Route `020` uses `/mobile`; route `019` remains `/client/home`.
   - Mobile projection proof uses `/mobile`.
2. `IMPL-WP03-01`: create `client-portal-projection-state` adapter from WCL/visibility results.
   - Status: implemented in `lib/client-portal-projection-state.ts`.
3. `IMPL-WP03-02`: refactor portal/mobile projection card into state-driven renderer.
   - Status: implemented in `components/client-intake-screen.tsx`.
4. `IMPL-WP03-03`: enforce source-upload metadata exception explicitly; remove `sensitivity` from client source-upload payload unless approved.
   - Status: implemented in `lib/visibility-engine.ts` and tested.
5. `IMPL-WP03-04`: add/extend tests for positive/negative portal, mobile, document source/released, wrong-tenant, advisor-not-release and stale loading/error states.
   - Status: implemented for projection states, mobile route proof and source-upload metadata.
6. `QA-WP03-01`: run focused unit/API/Playwright gates and capture screenshots for UI changes.
   - Status: focused gates and screenshots complete.

## Validation Performed

- Moving Baseline Preflight executed.
- `pnpm guard:source`: PASS.
- `pnpm typecheck`: PASS.
- `PLAYWRIGHT_PORT=3083 pnpm playwright test tests/true-ux-client-projection.spec.ts --workers=1`: PASS, 13/13.
- `PLAYWRIGHT_PORT=3083 pnpm playwright test tests/document-upload-api.spec.ts --workers=1`: PASS, 9/9.
- `PLAYWRIGHT_PORT=3083 pnpm playwright test tests/route-smoke.spec.ts --workers=1`: PARTIAL/BLOCKED by existing broad UX expectation timeouts outside WP03; registered route smoke reached `020 /mobile` and passed before the run was interrupted.
- Inspected `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.
- Inspected the full WP03 upload.
- Inspected current route registry, catch-all route, client portal/mobile component paths, decision/evidence components, visibility engine, WCL wrapper, document API/service, journey client projection API/service and relevant tests.

Screenshots:

- `artifacts/wp03-client-safe-visibility/client-home-desktop.png`
- `artifacts/wp03-client-safe-visibility/mobile-home-mobile.png`

## Method Artifacts

Facts:

- Current branch is `full-workflow`.
- `visibilityEngine` and WCL wrapper already exist.
- `/api/documents` already projects documents through `visibilityEngine`.
- `019` and `020` currently share `/client/home`.
- Existing tests prove important parts of no-leakage, but not the complete WP03 portal-state system.

Assumptions:

- Existing route registry remains code truth until route evolution changes it.
- Existing seed/demo data should be preferred unless deterministic negative cases require a small fixture.

Interpretation:

- WP03 is blocked from code implementation by a real safety boundary decision, not by lack of implementation path.
- The cleanest solution is consolidation around the existing projection engine, not adding another API/helper stack.

Proposed moves:

- Approve `DECISION-WP03-01` Option A.
- Resolve `019/020` route ambiguity before screenshots/proof.
- Implement source-upload metadata as an explicit exception or tighten it.

## Method Compliance Checklist

- Double Diamond Discover: completed through upload, handoff, code and test inspection.
- Double Diamond Define: completed through ANALYSIS-1, ANALYSIS-2 and SPEC-1 in this artefact.
- Double Diamond Develop: limited to recommended option portfolio because implementation is decision-blocked.
- Double Diamond Deliver: delivered repo-local execution/spec artefact and stop-gate recommendation.
- Psycho-Logic / Map: route access, payload visibility, release state and upload status are separated.
- TRIZ: remove contradiction between client usefulness and data leakage by centralizing projection and making source-upload metadata a named exception.
- SIT Closed World: reuse existing `visibilityEngine`, WCL wrapper, route registry and tests.
- Harvard / Principled Negotiation: separate product decision from coding; recommend the lowest-risk common standard.
- MESO: options compared implicitly; Option A recommended as strongest clean-solution route.
- Measurement Plan: focused unit/API/Playwright gates and screenshots after UI edits.
- Ethics & Fairness: client-facing visibility remains fail-closed and does not leak internal rationale or compliance information.

Limitations:

- No product code was changed because implementation is blocked by `DECISION-WP03-01`.
- No screenshots were produced because this execution changed documentation/specification only.
- Current analysis is source-grounded on the inspected `full-workflow` snapshot and may need refresh if later commits change projection or routes.
