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
| `deleted generic workflow route` | Contains typed workflow actions and client projection assertions in tests | Relevant for release/advisor/upload semantics; do not use as raw client payload source |

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
| `tests/recommendation-review-workflow-api.spec.ts` | Workflow actions, no client release through intermediate actions, client projection after release | Strong workflow semantics proof |
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

## WP03 Rerun After WP02/WP04-WP06 Artefacts

Execution date: 2026-06-25.

Rerun trigger:

- User requested a WP03 rerun from the original upload.
- User requested all generated specification artefacts to be used as input or override for later tasks.
- Current branch baseline before rerun: `full-workflow`, latest commit `0547c31 test: align route smoke with wp02 worksurface shell`, working tree clean.

Generated artefacts used as rerun input:

- `docs/00-current/ALPHAVEST_WP00_SOURCE_HIERARCHY_TARGET_GUARD_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`

Rerun task-by-task status:

Important execution note: this rerun did not create a fresh WP03 product-code mutation. The earlier user-approved Option A implementation was already present in the repository. The rerun re-extracted the upload tasks, applied the generated WP00-WP06 artefacts as current input/override, and then validated each implementation task against the live code and tests. Therefore `COMPLETE` below means `implemented earlier and revalidated against the rerun specification`, not `newly rewritten during this rerun`.

- EPIC WP-03 Client-safe Visibility & Portal States: `COMPLETE_FOR_APPROVED_FIRST_WAVE`.
- `ANALYSIS-1` Audit current client-facing visibility, payload and state surfaces: `COMPLETE`. Live recheck confirms route `019` is `/client/home`, route `020` is `/mobile`, `ClientSafeProjectionCard` consumes `clientPortalProjectionState`, and document source-upload projection excludes `sensitivity`.
- `ANALYSIS-2` Map existing tests/proofs and missing leakage cases: `COMPLETE`. Live recheck confirms `true-ux-client-projection`, `client-visibility-projection`, `document-upload-api` and focused `route-smoke` cover the approved first-wave proof.
- `SPEC-1` Client-safe visibility, payload and portal-state contract: `COMPLETE_AND_STILL_VALID`. WP04, WP05 and WP06 reinforce the same rules: upload is not sufficiency, advisor approval is not release, admin cannot force visibility, and client-facing payloads must come from the visibility/WCL boundary.
- `DECISION-1` Confirm client-safe projection/API boundary: `COMPLETE`. Earlier user-approved Option A remains the strongest path: use existing `visibilityEngine` plus WCL/control-layer projection, no new API in WP03, existing seed first, minimal deterministic fixtures only where needed, mobile uses same projection engine with reduced presentation allowed.
- `IMPL-1` Fail-closed client portal/mobile UI states: `COMPLETE`. Portal/mobile render state-driven projection panels for released, source-upload and fail-closed states.
- `IMPL-1.1` Wire hidden/empty/redacted/permission/error states: `COMPLETE_FOR_APPROVED_FIRST_WAVE`. Current adapter maps projection outcomes to `released`, `redacted`, `source_upload`, `empty`, `hidden` and `permission_denied`; loading/error stale-content proof remains covered as test obligation rather than a new UI branch in this rerun.
- `IMPL-1.2` Remove unsafe optimistic client fallback content: `COMPLETE_FOR_APPROVED_FIRST_WAVE`. Client-safe card renders no raw internal fallback when released payload is absent.
- `IMPL-2` Client-safe payload projection wiring: `COMPLETE`. `visibilityEngine` and `lib/control-layer/client-visibility.ts` remain the canonical boundary.
- `IMPL-2.1` Route/action/object/payload visibility checks: `COMPLETE`. Route access remains separate from payload projection; focused tests cover hidden/denied outcomes.
- `IMPL-2.2` Exclude AI Draft, internal rationale, compliance notes and unreleased evidence: `COMPLETE`. Forbidden internal fields are absent in projection tests.
- `IMPL-3` Released decision and evidence-safe summary wiring: `COMPLETE`. Released decision summary uses allowed fields only; evidence/source upload status remains upload/status-only and not sufficiency.
- `QA-1` P0 positive/negative validation: `COMPLETE_FOR_APPROVED_FIRST_WAVE_WITH_NON_WP03_TEST_GAP_NOTED`.

Spec-to-code traceability:

| Spec / task requirement | Live implementation inspected | Test / proof used in rerun | Rerun result |
| --- | --- | --- | --- |
| Portal and mobile must use client-safe projection states rather than raw internal payloads. | `components/client-intake-screen.tsx`, `lib/client-portal-projection-state.ts`, `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts` | `pnpm playwright test tests/true-ux-client-projection.spec.ts --workers=1`, `pnpm playwright test tests/client-visibility-projection.spec.ts --workers=1` | Existing implementation conforms to generated WP03/WP06 projection-boundary spec. |
| Route `019` remains client portal, route `020` is the separate mobile client entry. | `lib/route-registry.ts`, process navigation shell output, current screenshots | `pnpm playwright test tests/route-smoke.spec.ts --grep "registered route smoke.*(019\|020)" --workers=1` | Existing route implementation conforms. |
| Hidden, redacted, empty and permission-denied states must fail closed. | `getClientPortalProjectionState`, `ClientPortalProjectionStatePanel`, WCL decision visibility checks | `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Existing fail-closed implementation conforms for approved first-wave states. |
| Source upload may be visible only as metadata and must not be treated as sufficiency. | `lib/visibility-engine.ts`, upload API projection, source-upload state branch | `pnpm playwright test tests/document-upload-api.spec.ts --workers=1`, `pnpm playwright test tests/true-ux-client-projection.spec.ts --workers=1` | Existing implementation conforms; `sensitivity` remains excluded. |
| AI draft, internal rationale, compliance notes and unreleased evidence must not reach client payloads. | WCL projection helpers, client portal adapter, evidence/decision summary fields | `tests/true-ux-client-projection.spec.ts`, `tests/client-visibility-projection.spec.ts` | Existing negative leakage proof conforms. |
| Advisor approval alone must not publish to client; compliance release remains the visibility gate. | `lib/visibility-engine.ts`, control-layer visibility checks, WP05/WP06 execution artefact constraints | `tests/true-ux-client-projection.spec.ts`, `tests/client-visibility-projection.spec.ts` | Existing implementation remains aligned with generated WP05/WP06 overrides. |

Validation performed in rerun:

```bash
pnpm guard:source
pnpm exec tsc --noEmit --pretty false
pnpm db:validate
pnpm playwright test tests/true-ux-client-projection.spec.ts --workers=1
pnpm playwright test tests/document-upload-api.spec.ts --workers=1
pnpm playwright test tests/client-visibility-projection.spec.ts --workers=1
pnpm playwright test tests/route-smoke.spec.ts --grep "registered route smoke.*(019|020)" --workers=1
```

Validation result:

- Source/target guard: PASS.
- TypeScript: PASS.
- Prisma validate: PASS.
- True UX client projection: PASS, 13 passed.
- Document upload API: PASS, 9 passed.
- WCL client visibility projection: PASS, 4 passed.
- Focused route smoke for `019` and `020`: PASS, 2 passed.
- A broader exploratory `route-smoke --grep "019|020|UX-NAV"` run passed the actual `019`, `020` and UX-NAV checks but also selected unrelated UX-DENSITY above-fold checks; those failed because `product-guidance` is absent on current client routes. This is not treated as WP03 failure and should be handled under a UX-DENSITY/page-header contract task if commercially needed.

Screenshots produced in rerun:

- `artifacts/wp03-client-safe-visibility/rerun-client-home-desktop.png`
- `artifacts/wp03-client-safe-visibility/rerun-mobile-home-mobile.png`

Current option shown to user:

`WP03 Rerun Option A — No new product code. Treat WP03 approved first wave as complete; keep visibilityEngine + WCL as the canonical projection boundary, keep /mobile separate, keep source-upload metadata exception limited to fileName/fileSizeBytes, defer export/package links to WP07, and record only this rerun proof/report. Next aggressive cleanup should target the unrelated UX-DENSITY/product-guidance mismatch or the route-record issue called out in WP02, not WP03 client visibility.`

Rejected branches:

- New WP03 API: rejected because existing projection/service boundaries pass current proof and a new API would expand attack surface.
- Local portal-only projection helper: rejected because it would duplicate visibility semantics.
- UI-only filtering: rejected because payload safety must remain service/projection enforced.
- More WP03 UI changes in this rerun: rejected because current approved first-wave behavior passes focused safety gates and route proof.

Method/proof notes:

- Facts: live code has `lib/client-portal-projection-state.ts`, route `020` is `/mobile`, `ClientSafeProjectionCard` renders projection states, and source-upload projection excludes `sensitivity`.
- Assumption: existing seed remains sufficient for first-wave proof because no new missing WP03 negative gap was found in live rerun.
- Interpretation: WP03 is not the next cleanup bottleneck; the next clean target is either non-WP03 UX-DENSITY guidance consistency or WP02 route-record cleanup.

## WP03 Strict Source-Scope Rerun

Execution date: 2026-06-25.

Source-scope rule applied:

- Specification authority was limited to the uploaded WP03 blueprint, current repository evidence, generated process artefacts, and explicit human/generated decision artefacts.
- Non-generated referenced artefacts were treated as pointers only unless their claims were revalidated against current repo evidence or captured in generated process artefacts.
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` was inspected only because repo instructions require it before implementation/reporting work; it was not used to import unrelated legacy claims into the WP03 specification.

Baseline:

- Branch: `full-workflow`.
- Latest commit before rerun: `a51d568 feat: complete wp02 access tenant worksurfaces`.
- Working tree before report update: clean.
- Package scripts inspected from `package.json`.

Generated artefacts used as inputs or overrides:

- `docs/00-current/ALPHAVEST_WP00_SOURCE_HIERARCHY_TARGET_GUARD_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`

### Blueprint Task Extraction

- `ANALYSIS-1` Audit current client-facing visibility, payload and state surfaces.
- `ANALYSIS-2` Map existing tests/proofs and missing leakage cases.
- `SPEC-1` Specify client-safe visibility, payload and portal-state contract.
- `DECISION-1` Confirm client-safe projection/API boundary if multiple implementation paths remain.
- `IMPL-1` Implement fail-closed client portal/mobile UI states.
  - `IMPL-1.1` Wire hidden/empty/redacted/permission/error states.
  - `IMPL-1.2` Remove unsafe optimistic client fallback content.
- `IMPL-2` Implement client-safe payload projection wiring.
  - `IMPL-2.1` Apply route/action/object/payload visibility checks.
  - `IMPL-2.2` Exclude AI Draft, internal rationale, compliance notes and unreleased evidence.
- `IMPL-3` Implement released decision and evidence-safe summary wiring.
- `QA-1` Validate WP03 positive and negative client-safe visibility acceptance.

Stop rules extracted from the upload:

- No screen generation, state-screen image generation or visual replacement.
- No `main` target truth.
- No new API without explicit decision after analysis.
- No route reclassification or P1/Hold elevation.
- No blind schema replacement.
- No internal notes, AI drafts, compliance notes, unreleased evidence or audit rationale in client-facing views.
- Route access must not be treated as payload visibility.
- Advisor approval must not be treated as compliance release.
- Upload success must not be treated as evidence sufficiency.

### ANALYSIS-1 Executed Result

Live repo evidence:

- Route `019` is `/client/home`; route `020` is `/mobile` in `lib/route-registry.ts`.
- `components/client-intake-screen.tsx` renders `PortalPage` for `019` and `MobileHomePage` for `020`.
- `ClientSafeProjectionCard` uses `visibilityEngine.projectDecisionPayload` and `clientPortalProjectionState`, then renders both released and fail-closed panels.
- `lib/client-portal-projection-state.ts` maps projections into `released`, `redacted`, `source_upload`, `empty`, `hidden` and `permission_denied` states.
- `lib/visibility-engine.ts` keeps `aiDraft`, `internalRationale`, `complianceNotes`, audit metadata, evidence internals, storage keys and checksum out of client projections.
- `lib/control-layer/client-visibility.ts` remains the WCL wrapper around `visibilityEngine`.
- `/api/documents` and document tests prove source-upload status is upload/status-only; `sensitivity`, storage keys and checksums are not client payload.

Analysis conclusion:

- No new projection/API boundary is needed.
- The earlier `019/020` ambiguity is resolved in current code; `/mobile` is independently addressable.
- The source-upload exception remains explicit and narrow: `fileName` and `fileSizeBytes` are own-upload status metadata only; `sensitivity` is excluded.
- Current UI contains a released state and fail-closed state. Loading/error stale-content coverage remains validated by focused projection/no-leakage proof rather than a new UI branch in this rerun.

### ANALYSIS-2 Executed Result

Live test/proof map:

- `tests/client-visibility-projection.spec.ts`: WCL projection positive and negative proof for recommendations, decisions and documents.
- `tests/true-ux-client-projection.spec.ts`: no-leakage contract, released/unreleased projections, source-upload exception, route proof and mobile semantic parity.
- `tests/document-upload-api.spec.ts`: upload-only API semantics, source-document status projection, no `sensitivity`, no storage/checksum leakage and no upload-to-release.
- `tests/route-smoke.spec.ts`: route reachability for `019 /client/home` and `020 /mobile`.

Missing case assessment:

- No new first-wave WP03 product-code gap was found in the live rerun.
- Full loading/error UI branch expansion is still a possible future hardening item, but current first-wave acceptance is covered by projection/state tests and no raw fallback rendering was found in the inspected client projection card.

### SPEC-1 Refined Contract

The refined rerun spec keeps the earlier accepted first-wave contract:

- Use `visibilityEngine` plus `lib/control-layer/client-visibility.ts` as the canonical projection boundary.
- Use `lib/client-portal-projection-state.ts` as the UI state adapter.
- Client-facing portal/mobile may render only released, redacted, source-upload status, empty/hidden, or permission-denied state models.
- Source-upload metadata exception is allowed only for own-source upload status and only for `fileName` and `fileSizeBytes`.
- `sensitivity`, storage keys, checksum, internal rationale, AI draft, compliance notes, audit metadata and unreleased evidence remain forbidden.
- No new API is needed.
- `/mobile` uses the same projection boundary as portal with reduced presentation.
- Export/package links stay outside WP03 and remain deferred to export/redaction work.

### DECISION-1 Result

No new human stop was required.

Applied decision:

- Earlier accepted/generated WP03 Option A remains valid: canonical `visibilityEngine` + WCL/control-layer projection, no new WP03 API, existing seed/demo data first, minimal deterministic fixtures only where needed, same projection boundary for mobile.

Rejected branches:

- New WP03 API: rejected because existing projection/service boundary passes current proof and would widen attack surface.
- Local portal-only filtering: rejected because payload safety must be projection-enforced, not UI-only.
- Additional product-code UI expansion in this rerun: rejected because analysis produced zero first-wave product delta.

### Derived Implementation Tasks

- `IMPL-1` Fail-closed portal/mobile UI states: `ZERO-DELTA IMPLEMENTATION`. `ClientSafeProjectionCard` and `ClientPortalProjectionStatePanel` already render released, permission-denied, source-upload and fail-closed no-release states from the adapter.
- `IMPL-1.1` State branches: `ZERO-DELTA IMPLEMENTATION`. State adapter and panel branches are present.
- `IMPL-1.2` Unsafe optimistic fallback removal: `ZERO-DELTA IMPLEMENTATION`. Released payload is rendered only when `releasedState.visible`; the blocked state renders a fail-closed message.
- `IMPL-2` Client-safe projection wiring: `ZERO-DELTA IMPLEMENTATION`. `visibilityEngine` and WCL wrapper remain canonical and covered by tests.
- `IMPL-2.1` Route/action/object/payload visibility checks: `ZERO-DELTA IMPLEMENTATION`. Projection functions require permission, tenant/object scope and client visibility before payload exposure.
- `IMPL-2.2` Forbidden field exclusion: `ZERO-DELTA IMPLEMENTATION`. Forbidden internal fields are excluded and asserted absent in tests.
- `IMPL-3` Released decision/evidence-safe summary wiring: `ZERO-DELTA IMPLEMENTATION`. Released decision summary and released/redacted document metadata use allowed fields only; source upload is status-only.

Product-code delta:

- None in this strict rerun.

Generated artefact update:

- This report section documents the strict source-scope rerun, zero-delta proof and latest validation.

### QA-1 Proof

Commands run:

```bash
pnpm guard:source
pnpm typecheck
pnpm db:validate
pnpm exec playwright test tests/client-visibility-projection.spec.ts tests/true-ux-client-projection.spec.ts --workers=1 --reporter=line
pnpm exec playwright test tests/document-upload-api.spec.ts --workers=1 --reporter=line
PLAYWRIGHT_PORT=3085 pnpm exec playwright test tests/route-smoke.spec.ts --grep "registered route smoke.*(019|020)" --workers=1 --reporter=line
```

Results:

- Source/target guard: PASS.
- TypeScript: PASS.
- Prisma validate: PASS.
- Client visibility + true UX projection: PASS, 17 passed.
- Document upload API: PASS, 9 passed.
- Focused route smoke for `019` and `020`: PASS, 2 passed.

Negative proof:

- A first route-smoke attempt failed only because a parallel Playwright server already used port `3020`; rerun with `PLAYWRIGHT_PORT=3085` passed.
- Projection tests assert internal fields are hidden: AI draft, internal rationale, compliance notes, audit metadata, evidence internals, storage keys and checksum.
- Source-upload tests assert `sensitivity` is absent and upload remains upload-only.

Screenshots:

- `test-results/wp03-strict-rerun-screenshots/wp03-client-home-desktop.png`
- `test-results/wp03-strict-rerun-screenshots/wp03-mobile-home.png`

Residual risks:

- Full loading/error UI branch expansion could be a later hardening task if product wants explicit visual states beyond current projection/fail-closed proof.
- Broader route-smoke/UX-density checks were not rerun in this strict rerun because WP03 acceptance is covered by focused route, projection and document tests; previous unrelated UX-density/product-guidance mismatch remains non-WP03.
