# E02 Page Architecture And Template System Analysis

Date: 2026-06-27

## Source And Boundary

- Requested source: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Extracted epic: `Epic E02: Page Architecture and Template System`
- Active ticket: `ANALYSIS-E02-1`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Target branch: `full-workflow`
- Baseline commit: `8b26b2c docs: close e01 operating model qa`
- Source guard: PASS via direct repo script `./node_modules/.bin/tsx scripts/source-target-guard.ts`

The downloaded architecture is treated as the E02 task source, but implementation remains bounded by the repo-local True-UX handoff. This ticket is analysis-only. No route, UI, schema, API, screenshot asset or runtime behavior change is authorized here.

Note: `pnpm guard:source` was attempted first, but the Codex runtime wrapper invoked `pnpm@11.7.0`, recreated `node_modules`, and stopped during dependency setup on `pnpm approve-builds`. The underlying repo guard script then ran directly and returned `status: PASS` with `violations: 0`.

## Extracted E02 Chain

| Order | Ticket | Type | Status From Upload | Current Handling |
| --- | --- | --- | --- | --- |
| 1 | `ANALYSIS-E02-1` | Analysis / Research / Spike | Can start when input plan and artefacts are available | Executed in this report |
| 2 | `SPEC-E02-1` | Specification / Design / Acceptance Criteria | Depends on `ANALYSIS-E02-1` | May start after this analysis |
| 3 | `IMPL-E02-1` | Implementation | Blocked until `SPEC-E02-1` is complete and approved | Blocked |
| 4 | `IMPL-E02-2` | Implementation | Depends on `IMPL-E02-1`; blocked until spec approval | Blocked |
| 5 | `IMPL-E02-3` | Implementation | Blocked until `SPEC-E02-1` is complete and approved | Blocked |
| 6 | `QA-E02-1` | QA / Validation / Review | Depends on spec and implementation tasks | Blocked |

Human approval is required after `SPEC-E02-1` before implementation starts.

## E02 Epic Extraction

E02 exists to replace append-only page growth with a small set of reusable page templates and long-page structure rules.

In scope:

- Dashboard/list templates
- Detail and decision-room templates
- Workflow-stepper templates
- Master-detail templates
- Client-facing summary templates
- Reference and hold templates
- Long-page navigation
- Sticky summary and action rails

Out of scope:

- Pixel-perfect individual screens
- Route-by-route layout backlogs
- New screen generation
- Product-scope, route-scope, backend safety, API or schema changes

## Moving Baseline Preflight

- `git status --short`: clean before edits
- `git branch --show-current`: `full-workflow`
- `git log -1 --oneline`: `8b26b2c docs: close e01 operating model qa`
- `git diff --stat`: no pre-existing diff before edits
- `package.json`: scripts verified, including `guard:source`, `lint`, `typecheck`, `build`, `test`, `test:route-smoke`, `test:permissions`, `test:workflow-gate`, `visual:capture-routes`, and `phase:check`
- Route registry inspected: `lib/route-registry.ts`
- Test inventory inspected: `tests/`
- Related template/page seams inspected: `lib/ux-operating-model.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts`, `lib/ux-content-hierarchy.ts`, `lib/ux-density.ts`, `components/worksurface-shell.tsx`, `components/ux-hub-page.tsx`, `components/ux-detail-standard-panel.tsx`, `components/route-skeleton-page.tsx`, `tests/route-smoke.spec.ts`, `tests/true-ux-density.spec.ts`, and `tests/wp02-worksurface-shell.spec.ts`

## Current Pattern Reality

The app already contains serious pieces of a page architecture, but they are distributed across separate layers:

- `lib/ux-operating-model.ts` owns the E01 canonical operating posture and projects route scope, page type, audience, proof posture and no-overclaim rules.
- `lib/ux-page-contract.ts` projects the operating model with density tier, page job, workspace, P0 obligation and primary CTA rule.
- `lib/ux-route-policy.ts` assigns workspace, page type and density tier using page-id sets.
- `lib/ux-content-hierarchy.ts` defines must-see, secondary and tertiary content by `UxPageType`.
- `lib/ux-density.ts` defines D1-D4 density patterns, including calm executive, productive workbench, dense operations and focused detail.
- `components/worksurface-shell.tsx` centralizes a large amount of shell behavior with header, primary area, optional rail and safety boundary.
- `components/ux-hub-page.tsx` implements hub-specific page structure, density-specific variants and safe next-work panels.
- `components/ux-detail-standard-panel.tsx` implements focused detail structure with object header, evidence/timeline and gated action rail.
- `components/route-skeleton-page.tsx` renders protected/reference/deferred route structures with page header, scope guard and workflow context.
- Tests already assert pieces of this structure: content tiers, density tiers, worksurface shell adoption, one primary CTA, protected route controls and no-overclaim behavior.

The good news: E02 does not need to invent the entire design system. The problem: page template authority is still implicit. Page type, density, content hierarchy, worksurface layout and sticky rails are related but not represented as one canonical template contract.

## Systemic Findings

1. Page type is not yet a page template. `UxPageType` currently says `Hub`, `Workbench`, `Detail`, `Drawer`, `Modal`, `Reference`, `P1` or `Hold`, but it does not specify required zones, sticky behavior, long-page navigation, proof/audit placement or renderer responsibilities.

2. Density tiers partially describe templates but cannot own them. D1-D4 explain visual concentration and safety retention, yet they do not define whether a page needs a header zone, summary zone, primary content zone, secondary zone, action zone, state zone or proof/audit zone.

3. The strongest existing component is `WorksurfaceShell`, but it is still a renderer pattern rather than a typed contract. It provides a header block, primary content, secondary content, optional rail and safety boundary; E02 should decide whether it becomes one renderer under a broader page-template system or the root renderer for most productive templates.

4. Hub/detail/skeleton components already implement template-like zones locally. `UxHubPage` has orientation, priority cards, source summaries and next-step rails. `UxDetailStandardPanel` has object header, key facts, evidence/timeline and gated action rail. `RouteSkeletonPage` has scope guard, demo context and protected route status. These should be normalized instead of duplicated.

5. Long-page structure is currently solved by local sticky asides and content tier attributes. Examples include `2xl:sticky` rails in `WorksurfaceShell`, `internal-workflow-screen.tsx`, `wealth-actions-screen.tsx` and journey sticky actions. There is no single rule for when sticky rail, anchor navigation, tabs or split view is required.

6. E01 is the correct upstream dependency. A page-template contract must project from the canonical operating model, not create parallel authority. Protected, reference, deferred and client-safe routes must inherit productivity, audience and proof posture before template behavior is chosen.

7. QA currently proves important fragments but not app-wide template adoption. Existing tests can tell whether a route has a page type, density or worksurface shell. They do not yet prove that every registered route resolves to an approved template with required zones and long-page behavior.

8. The risk is not lack of UI code; it is legacy camouflage. A docs-only template taxonomy would preserve the old overlapping vocabulary. Screen-by-screen refactors would also miss the point. E02 should create one typed template contract and make page contracts/components/tests project from it.

## Reusable Template Families Affected

| Template Family | Current Evidence | E02 Need |
| --- | --- | --- |
| Dashboard/list | `Hub`, `Workbench`, D1/D2/D3 density, `UxHubPage`, workbench triads | Canonical `dashboard_list` or `workbench_list` template with summary, queue/list, secondary context and action zones |
| Detail/decision-room | `Detail`, D4 density, decision-room routes, `UxDetailStandardPanel` | Canonical focused detail template with object header, evidence/proof/audit and gated action rail |
| Workflow-stepper | `WIZARD_OR_STEP_PAGE`, `uxFlowStepsForPageId`, `PageHeader` steps, wizard stepper component | Template rule for step state, blocked reasons, recovery and no hidden advancement |
| Master-detail | Worksurface primary plus optional sticky rail; selected context patterns | Template rule for list/context/action split and rail behavior |
| Client-facing summary | Client workspace routes, D1 calm executive density, client-safe no-overclaim rules | Template rule that client-safe summaries suppress internal draft/proof/debug content |
| Reference/hold | `Reference`, `P1`, `Hold`, protected route skeleton | Template rule for non-productive state, no primary product CTA and no screen-generation elevation |
| Long page / sticky action zone | `2xl:sticky` rails, journey mobile sticky action, content tier attributes | One convention for anchors/tabs/split/sticky zones and representative screenshot review |

## Screen-Specific Items To Exclude

E02 should not become a route-by-route redesign list. These are explicitly excluded:

- Rebuilding individual pages because a screenshot looks dense.
- Creating a new page for every template example.
- Reclassifying route scope, page scope or MVP eligibility.
- Generating screen images, state screens or replacement visual assets.
- Introducing backend safety behavior, schema changes, API endpoints, audit persistence or permission-engine changes.
- Adding special-case CSS or one-off layout wrappers for individual routes when a template primitive can carry the behavior.

## Specification Needs

`SPEC-E02-1` should lock these decisions before implementation:

1. Canonical source: create a typed `UxPageTemplate` contract that consumes E01 operating-model records and page contracts.

2. Template families: define the approved finite set, including dashboard/list, detail/decision-room, workflow-stepper, master-detail, client-facing summary, reference and hold templates.

3. Required zones: define header, summary, primary content, secondary content, action zone, state zone and proof/audit zone for each template family.

4. Long-page rules: define when anchor navigation, tabs, split view, sticky summary rail or sticky action zone is required.

5. Renderer boundary: define whether `WorksurfaceShell`, `UxHubPage`, `UxDetailStandardPanel`, `RouteSkeletonPage`, `PageHeader` and `WizardStepper` are direct renderers, adapters or implementation candidates.

6. Safety and proof projection: require client/internal/proof posture to be inherited from the E01 operating model and forbid template-level safety overrides.

7. QA gates: require route-wide template coverage tests plus representative runtime checks for visible zones, sticky/long-page behavior and no-overclaim suppression.

8. Human approval scope: clarify that implementation may add a new typed template contract and refactor shared primitives. Recommendation: approve the canonical typed contract, because preserving implicit page-type/density behavior keeps the old debt alive.

## Recommended Task Cut

| Proposed Ticket | CTES | Scope | Validation |
| --- | ---: | --- | --- |
| `SPEC-E02-1` | 6 | Write the canonical page-template spec, approval checklist and implementation boundaries. | Source review only |
| `IMPL-E02-1` | 12 | Add the typed template contract and normalize shared primitives/renderers around approved zones. | Typecheck plus focused contract tests |
| `IMPL-E02-2` | 12 | Apply template mapping to eligible page families without route reclassification or screen-specific fixes. | Route-wide template coverage and representative Playwright checks |
| `IMPL-E02-3` | 10 | Add long-page navigation/sticky action-zone primitives and adoption rules. | Representative desktop/mobile runtime checks and screenshots |
| `QA-E02-1` | 6 | Validate template adoption, no-overclaim, long-page behavior and documentation/report evidence. | Focused tests, screenshot/contact-sheet review where UI changed |

## Bold Cleanup Recommendation

Take the direct cleanup path:

- Add a canonical typed page-template contract instead of expanding `UxPageType` with more meanings.
- Treat `UxPageType`, density, content hierarchy and worksurface shell as projections or renderers, not separate authorities.
- Force every route to resolve to exactly one approved page template.
- Make every template declare its required zones and long-page behavior.
- Make reference, P1 and hold templates mechanically non-productive through the inherited operating model.
- Stop adding route-local sticky rails unless they are instances of the approved action-zone pattern.
- Move future page-layout work away from screen fixes. Every layout change should cite a template family, required zone and acceptance rule.

## Risks

- A docs-only template matrix would preserve the current drift between page type, density, hierarchy and component behavior.
- A broad component rewrite before approval could destabilize many routes and violate the upload's spec-first gate.
- A route-by-route migration could create visual churn without removing systemic debt.
- Sticky action zones can become unsafe if they hide blockers, evidence requirements or release prerequisites.
- Client-facing summaries can overclaim if template behavior is not inherited from E01 operating mode and proof posture.
- `pnpm` wrapper/tooling state may obscure validation results unless the repo-pinned guard/test path is controlled.

## Open Decisions For SPEC-E02-1

1. May implementation introduce a new canonical typed template contract, such as `lib/ux-page-template-system.ts`, or must it extend the existing `lib/ux-page-contract.ts` only?
2. Should `WorksurfaceShell` become the root renderer for most productive templates, or should it remain a renderer underneath a new `PageTemplateFrame` adapter?
3. Which template families are approved for first implementation: all E02 families, or only productive MVP/MVP_SUPPORT routes first?
4. Should long-page navigation be anchor-based, tab-based, split-view based or template-dependent?
5. What is the required screenshot proof set for visible template changes: representative pages only or a contact sheet for every adopted family?
6. Which owner approves the post-spec implementation gate?

## Acceptance-Criteria Inputs For SPEC-E02-1

- Every registered route resolves to one approved page-template record.
- Every template record includes family, required zones, long-page behavior, action-zone behavior, proof/audit placement and renderer/adoption target.
- Template eligibility inherits route scope, audience, productive eligibility and proof posture from E01.
- Protected/reference/deferred/hold routes cannot receive productive templates or primary product action zones.
- Client-facing summary templates suppress internal draft, proof/debug and reviewer-only content by construction.
- Long content cannot depend on unstructured vertical stacking when the template requires anchors, tabs, split view or sticky zones.
- Tests prove route-wide template coverage and representative visible zone rendering.
- No route reclassification, new route, new screen generation, backend safety change, API change or schema change is introduced by E02 implementation.

## Ticket Result

`ANALYSIS-E02-1` is complete. It enables `SPEC-E02-1` and keeps `IMPL-E02-1`, `IMPL-E02-2`, `IMPL-E02-3` and `QA-E02-1` blocked until specification and human approval.
