# E01 UX Operating Model And Scope Discipline Analysis

Date: 2026-06-26

## Source And Boundary

- Requested source: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Extracted epic: `Epic E01: UX Operating Model and Scope Discipline Lock`
- Active ticket: `ANALYSIS-E01-1`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Target branch: `full-workflow`
- Baseline commit: `f27bd51 fix(capture): preserve visual-state overlays`
- Source guard: PASS via `pnpm guard:source`

The downloaded architecture is treated as the E01 task source, but implementation remains bounded by the repo-local True-UX handoff. This ticket is analysis-only. No route, UI, schema, API, screenshot asset or runtime behavior change is authorized here.

## Extracted E01 Chain

| Order | Ticket | Type | Status From Upload | Current Handling |
| --- | --- | --- | --- | --- |
| 1 | `ANALYSIS-E01-1` | Analysis / Research / Spike | Can start when input plan and artefacts are available | Executed in this report |
| 2 | `SPEC-E01-1` | Specification / Design / Acceptance Criteria | Depends on `ANALYSIS-E01-1` | May start after this analysis |
| 3 | `IMPL-E01-1` | Implementation | Blocked until `SPEC-E01-1` is complete and approved | Blocked |
| 4 | `IMPL-E01-2` | Implementation | Blocked until `SPEC-E01-1` is complete and approved | Blocked |
| 5 | `QA-E01-1` | QA / Validation / Review | Depends on spec and implementation tasks | Blocked |

Human approval is required after `SPEC-E01-1` before implementation starts.

## Moving Baseline Preflight

- `git status --short`: clean before edits
- `git branch --show-current`: `full-workflow`
- `git log -1 --oneline`: `f27bd51 fix(capture): preserve visual-state overlays`
- `git diff --stat`: no pre-existing diff before edits
- `package.json`: scripts verified, including `guard:source`, `lint`, `typecheck`, `build`, `test`, `test:route-smoke`, `test:permissions`, `test:workflow-gate`, `visual:capture-routes`, and `phase:check`
- Route registry inspected: `lib/route-registry.ts`
- Tests inventory inspected: `tests/`
- Related operating-mode seams inspected: `lib/visual-contract.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts`, `lib/capture-screen-model-context.ts`, `scripts/capture-routes-and-modals.ts`, `tests/capture-screen-model-context.spec.ts`, `tests/p1-hold-defensive-noninteractive.spec.ts`, `docs/ux/ALPHAVEST_UXP2_FAKE_AFFORDANCE_REGISTER.md`

## Current Pattern Reality

The app already has strong fragments of an operating model, but they are spread across several vocabularies:

- `lib/route-registry.ts` owns `VisualMode`, `RouteScopeLabel`, route worksets, route access decisions, `clientVisibilitySensitive`, and reference/hold/deferred registration.
- `lib/ux-route-policy.ts` maps routes into workspaces, page types, density tiers, primary CTA rules and safety reminders.
- `lib/ux-page-contract.ts` converts route scope and page type into allowed treatments, forbidden treatments, P0 obligations and productive-UX eligibility.
- `lib/capture-screen-model-context.ts` describes capture proof posture, capability status, model families, warnings and route scope metadata.
- `lib/visual-contract.ts` maps visual modes to visual states for capture/runtime state selection.
- UI and tests rely on data attributes such as `data-ux-route-scope`, `data-ux-productive-controls`, `data-ux-primary-cta`, `data-ux-interactive` and `data-ux-no-overclaim`.
- Existing QA registers already distinguish fake affordances, reference-only routes, P1/HOLD routes, disabled reasons and no-overclaim copy.

The good news: the repo has real seams. The risk: E01 can easily become one more taxonomy unless the spec explicitly decides which seam is canonical and which seams are projections.

## Systemic Findings

1. Operating mode is not one concept today. `VisualMode` answers "what state or chrome is visible"; `RouteScopeLabel` answers "whether this route is productive"; capture status answers "what kind of evidence a screenshot may claim"; page contracts answer "what UX treatment is allowed"; topbar/page header copy answers "what a user sees." These concepts overlap but are not the same.

2. Reference/P1/HOLD discipline is already encoded strongly enough to avoid a rewrite. `routeWorksetPageIds`, `routeImplementationAccessDecision`, `uxPageContractForRoute`, protected route skeleton attributes and defensive tests prove a reusable guard pattern exists.

3. Proof/reviewer mode is present but not named as a first-class UX mode. Capture metadata uses conservative proof posture and capability statuses, but the app-facing design-system language does not yet have a single `proof/reviewer` taxonomy that downstream tasks can cite.

4. Client-facing versus internal-preview discipline exists in safety copy and visibility tests, but it is scattered across components and services. The spec should bind it to the same operating model so "client-safe", "internal only", "preview" and "proof" cannot drift independently.

5. The capture workflow is already the right enforcement point for screenshot evidence discipline. `capture-screen-model-context` warns against complete-slice overclaim, marks reference-only routes as visual/context proof only and marks hold-pending routes as blocked from capability promotion.

6. The design-system documentation surface is thin compared with the code contract. Existing docs registers describe specific cleanup phases, but there is no durable design-system artifact that says every future page/component/capture must declare operating mode, scope treatment and proof posture.

7. The strongest cleanup is consolidation, not more labels. E01 should not add a parallel spreadsheet-style taxonomy. It should define one canonical operating model contract and make route policy, page contract, capture metadata, UI attributes and docs consume or mirror it.

## Reusable Pattern Families Affected

- Route workset and scope discipline: `MVP`, `MVP_SUPPORT`, `P1_AFTER_MVP`, `REFERENCE_ONLY`, `HOLD_PENDING_DECISION`.
- Page operating treatment: hub, workbench, detail, drawer, modal, reference, P1, hold.
- Visibility and audience posture: internal-only, client-safe, client-facing released, internal preview.
- Proof posture: visual reference, runtime capture proof, API/service-backed partial, strong vertical candidate, blocked safety state.
- CTA and affordance discipline: one primary CTA, static locked status, disabled reason, no fake product controls.
- Safety copy and no-overclaim: upload is not sufficiency, advisor approval is not release, preview is not approval/download, compliance release is not client acceptance.
- Capture QA: screenshot/contact-sheet review, route scope labels, model context warnings, no complete-slice claim without current evidence.

## Screen-Specific Items To Exclude

E01 should not produce a route-by-route redesign list. The following belong to later implementation epics unless a future spec explicitly pulls them in as examples:

- Rebuilding individual hubs, workbenches, decision rooms or client projection pages.
- Reclassifying any route scope or moving P1/HOLD/reference routes into MVP.
- Creating new screenshots, state-screen images, generated reference assets or visual media.
- Changing backend safety behavior, permission rules, release gates, export gates or schema.
- Rewording isolated screen copy without linking it to a shared operating-model rule.

## Specification Needs

`SPEC-E01-1` should lock these decisions before implementation:

1. Canonical vocabulary: define exactly one operating-mode model with fields for route scope, audience visibility, proof posture, productive eligibility, allowed treatment, forbidden treatment and no-overclaim obligation.

2. Ownership: choose a canonical source. Recommendation: make `lib/ux-page-contract.ts` or a new narrow `lib/ux-operating-model.ts` the code-backed canonical contract, and treat docs/capture/UI text as projections.

3. Mapping rules: define how existing `VisualMode`, `RouteScopeLabel`, `UxPageType`, `CaptureCapabilityStatus` and `clientVisibilitySensitive` map into the canonical operating model without pretending they are interchangeable.

4. Documentation target: define the design-system/planning artifact that downstream tickets must read before UI work. Recommendation: create or update one durable doc under `docs/ux/`, not multiple local registers.

5. Capture review target: define where screenshot/contact-sheet/capture outputs display or persist reference, hold and proof-mode labels.

6. Acceptance gates: require source-level tests proving all routes resolve to an operating model, protected routes cannot become productive, capture context cannot overclaim, and client/internal labels cannot contradict visibility sensitivity.

7. Human approval scope: clarify whether implementation may add or adjust code-backed taxonomy files. Recommendation: approve code-backed taxonomy, because docs-only rules will not remove legacy drift.

## Recommended Task Cut

| Proposed Ticket | CTES | Scope | Validation |
| --- | ---: | --- | --- |
| `SPEC-E01-1` | 5 | Write the canonical operating-model spec and approval checklist. | Source review only |
| `IMPL-E01-1` | 9 | Implement the approved taxonomy in the canonical code/doc surface and design-system planning artifact. | Typecheck plus focused contract tests |
| `IMPL-E01-2` | 6 | Wire approved labels into capture review metadata/checklists without generating screens. | Capture-context tests plus no-overclaim assertions |
| `QA-E01-1` | 5 | Validate adoption across route contracts, protected scopes, capture metadata and docs. | Focused tests and manual review checklist |

## Bold Cleanup Recommendation

Be aggressive about retiring soft compatibility debt:

- Do not preserve separate "mode" vocabularies as equal authorities. Keep `VisualMode` for visual state selection only, not UX operating authority.
- Promote route/page/capture discipline into a typed operating-model contract that fails fast when a route lacks a mode.
- Make protected route states mechanically non-productive through the contract, not through copy conventions.
- Treat screenshot proof as a projection of the operating model. A capture should never be able to call itself product proof if the route scope says reference/hold or the capability status says partial.
- Move future UX tickets away from local screen copy fixes. Every ticket should cite the operating model field it is satisfying.

## Risks

- A docs-only implementation would create another legacy layer and leave drift in route/capture/UI code.
- A route-scope change disguised as "taxonomy" would violate the True-UX boundary.
- A proof-mode label without capture test coverage would invite screenshot overclaim.
- Client-facing/internal-preview wording can become unsafe if it is implemented as copy only and not checked against visibility and route policy.
- Too broad a code rewrite could destabilize already-working protected-route and capture behavior.

## Open Decisions For SPEC-E01-1

1. May implementation introduce a new canonical typed contract file, such as `lib/ux-operating-model.ts`, or must it extend `lib/ux-page-contract.ts` only?
2. Should `docs/ux/` become the durable design-system documentation home for this taxonomy?
3. Should capture review artifacts show operating-mode labels in JSON/metadata only, or also in generated Markdown/contact-sheet summaries when present?
4. Should `VisualMode` be explicitly demoted to visual-state selection in docs, with operating mode owned elsewhere?
5. Which owner approves the post-spec implementation gate?

## Acceptance-Criteria Inputs For SPEC-E01-1

- Every registered route resolves to one canonical operating-mode record.
- Every operating-mode record includes route scope, audience posture, proof posture, productive eligibility, allowed treatment, forbidden treatment and no-overclaim obligation.
- Reference-only and hold-pending routes remain non-productive and cannot expose product CTAs.
- Capture metadata cannot promote reference/hold/partial screenshots into complete product proof.
- Client-facing labels cannot appear on internal-only or unreleased surfaces without an explicit client-safe/released projection.
- Visual assets and screenshots remain references/proof artifacts, not implementation authority.
- No route reclassification, new route, new screen generation, backend safety change, API change or schema change is introduced by E01 implementation.

## Ticket Result

`ANALYSIS-E01-1` is complete. It enables `SPEC-E01-1` and keeps `IMPL-E01-1`, `IMPL-E01-2` and `QA-E01-1` blocked until specification and human approval.
