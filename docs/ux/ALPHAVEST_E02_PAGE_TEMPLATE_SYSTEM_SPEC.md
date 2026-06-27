# AlphaVest E02 Page Architecture And Template System Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E02-1` |
| Parent epic | `E02 Page Template and Long-Page Architecture Implementation` |
| Source analysis | `docs/v3/proof/e02_page_architecture_analysis.md` |
| Spec status | `IMPLEMENTED_CURRENT_REPO_TRUTH` |
| Implementation status | `E02_IMPLEMENTED_AND_VALIDATED` |
| Approved path | `APPROVE_E02_CANONICAL_TEMPLATE_CONTRACT` |

This specification defines the implemented page-template system for E02. The canonical-template path is current repo truth through `lib/ux-page-template-system.ts`, `components/ui/page-template.tsx`, shared renderer metadata, and focused E02 tests.

## Target State

AlphaVest must have one canonical page-template contract that every registered route can resolve to without screen-by-screen interpretation.

The template contract must answer these questions for every route:

1. Which approved template family owns this route?
2. Which operating model and page contract does it project from?
3. Which zones are required: header, summary, primary content, secondary content, action, state and proof/audit?
4. Which long-page behavior is required: none, anchors, tabs, split view, sticky summary rail or sticky action zone?
5. Which renderer or component family is allowed to implement the template?
6. Which safety/no-overclaim rule must remain visible?
7. Which proof or audit surface may be shown, suppressed or moved to a secondary surface?

## Canonical Source Decision

Recommended decision: add a narrow code-backed canonical contract in `lib/ux-page-template-system.ts`, then make `lib/ux-page-contract.ts`, shared template components, tests, capture/review docs and any future route reports project from that contract.

Allowed fallback if the user rejects a new file: extend `lib/ux-page-contract.ts` with template fields. This is less clean because `ux-page-contract` already projects operating model, route policy, density and CTA rules.

Rejected approach: docs-only page-template taxonomy. It would leave `UxPageType`, density, content hierarchy and component behavior as overlapping authorities.

## Approved Template Families

| Template Family | Purpose | Typical Current Inputs | Productive Eligibility |
| --- | --- | --- | --- |
| `dashboard_list` | Orient, summarize and route to the next eligible work or list item. | `Hub`, D1/D2/D3, `UxHubPage`, list/workbench routes | Productive only when E01 says productive |
| `workbench_master_detail` | Show a queue/list, selected context and action rail without becoming a card wall. | `Workbench`, D2/D3, `WorksurfaceShell`, selected context patterns | Productive only when E01 says productive |
| `detail_decision_room` | Focus one object, evidence/proof basis, audit timeline and gated action. | `Detail`, D4, decision-room/detail routes, `UxDetailStandardPanel` | Productive only when E01 says productive |
| `workflow_stepper` | Guide one workflow step with explicit current/upcoming/blocked states. | `WIZARD_OR_STEP_PAGE`, `PageHeader` steps, `WizardStepper` | Productive only when E01 says productive |
| `client_summary` | Present released/redacted client-safe status and next step without internal proof/debug content. | client workspace, D1, client-safe operating posture | Client-safe only |
| `reference_hold` | Render reference, deferred or held routes as non-productive context. | `Reference`, `P1`, `Hold`, `RouteSkeletonPage` | Never productive |

Exact export names may change during implementation, but the semantics must not weaken.

## Required Zone Model

Implementation must expose a typed zone model equivalent to:

```ts
export type UxPageTemplateZone =
  | "header"
  | "summary"
  | "primary_content"
  | "secondary_content"
  | "action_zone"
  | "state_zone"
  | "proof_audit_zone";

export type UxLongPageBehavior =
  | "none"
  | "anchor_navigation"
  | "tabs"
  | "split_view"
  | "sticky_summary_rail"
  | "sticky_action_zone";
```

Every template family must declare:

- Required zones
- Optional zones
- Forbidden zones
- Primary renderer or renderer family
- Long-page behavior
- Action-zone rule
- Proof/audit placement rule
- No-overclaim rule inherited from the E01 operating model

## Template Rules

### Dashboard/List

- Required zones: header, summary, primary content, action zone, state zone.
- Optional zones: secondary content, proof/audit zone.
- Primary content is a list, queue, dashboard summary or next-work set.
- The action zone must expose one primary next step and contextual secondary actions only.
- The template must not carry final release, export approval, client acceptance or hidden workflow completion.

### Workbench Master-Detail

- Required zones: header, primary content, secondary content, action zone, state zone.
- Primary content must contain queue/list or selected working context.
- Secondary content may be tabs, split view or supporting context.
- The action zone should be a rail or explicit adjacent region, not a scattered set of buttons.
- Long-page behavior must be `split_view`, `tabs`, `sticky_summary_rail` or `sticky_action_zone` when content exceeds one working viewport.

### Detail/Decision-Room

- Required zones: header, summary, primary content, action zone, state zone, proof/audit zone.
- Summary must identify the object, status and next action.
- Primary content must include key facts and decision context.
- Proof/audit zone must include evidence basis, audit timeline, release/proof status or equivalent current proof context.
- Action zone must be gated, visible and blocked when prerequisites are missing.
- The template must not treat visible status as release, evidence sufficiency or client acceptance.

### Workflow Stepper

- Required zones: header, summary, primary content, action zone, state zone.
- Step state must distinguish current, upcoming, complete and blocked.
- Blocked steps must show reason and recovery when available.
- The template must not advance downstream gates from display state alone.

### Client Summary

- Required zones: header, summary, primary content, action zone, state zone.
- Optional zones: proof/audit zone only if client-safe and released/redacted.
- Internal draft, proof/debug, reviewer-only, advisor rationale and compliance note content must be suppressed by construction.
- The action zone must use client-safe language and cannot imply final advice when release/redaction is absent.

### Reference/Hold

- Required zones: header, summary, state zone.
- Optional zones: secondary content.
- Forbidden zones: productive primary action zone, mutation controls, release/export/download/share controls.
- Reference, P1 and hold routes must remain non-productive and must not be upgraded by template selection.

## Implementation Boundaries

Implemented scope:

- Add `lib/ux-page-template-system.ts` or extend `lib/ux-page-contract.ts` if the fallback is chosen.
- Project template family and required zones from the E01 operating model and existing page contract.
- Update shared primitives such as `WorksurfaceShell`, `UxHubPage`, `UxDetailStandardPanel`, `RouteSkeletonPage`, `PageHeader` or stepper usage where the spec requires it.
- Add small reusable primitives for page zones, long-page anchors/tabs/split view, sticky summary rail or sticky action zone.
- Add focused tests proving route-wide template coverage and representative zone rendering.
- Add proof/report documentation for changed patterns and screenshot evidence when visible UI changes occur.

Forbidden:

- No route reclassification.
- No new routes.
- No screen-specific redesign list.
- No screen/image/state-screen generation.
- No schema or migration work.
- No API creation or backend safety-policy change.
- No permission, visibility, release, export or audit weakening.
- No docs-only completion claim if page contracts, components and tests remain stale.

## Renderer And Migration Rules

- `WorksurfaceShell` is the preferred root renderer candidate for productive dashboard/list, workbench/master-detail and detail/decision-room shells unless implementation proves a smaller adapter is safer.
- `UxHubPage` should become an implementation of `dashboard_list` or `client_summary`, not an independent template authority.
- `UxDetailStandardPanel` should become an implementation of `detail_decision_room`, not a one-off detail contract.
- `RouteSkeletonPage` should become the implementation of `reference_hold` for protected routes unless a future approved scope unlock changes route status.
- `PageHeader`, `WizardStepper` and `uxFlowStepsForPageId` should remain step-state renderers and feed the `workflow_stepper` template.
- Existing visual reference assets remain design direction only, not pixel-perfect or implementation authority.

## Long-Page And Sticky Action Rules

- Long content must not depend on unstructured vertical stacking when a page contains multiple competing work regions.
- Use tabs when secondary context would otherwise compete with the primary task.
- Use split view when list/context/action must remain visible together.
- Use sticky summary rails for persistent object/status/proof context on desktop layouts.
- Use sticky action zones only for gated next actions, blocked recovery or one safe next step.
- Sticky action zones must show blocked state or safety note when prerequisites are missing.
- Mobile sticky action zones require explicit responsive validation and screenshot proof when UI changes are made.

## Safety And Proof Projection Rules

- Template selection must inherit route scope, productive eligibility, audience and proof posture from `uxOperatingModelForRoute`.
- A template cannot make a protected route productive.
- A template cannot turn internal preview into client-safe output.
- A template cannot treat upload, evidence visibility, advisor approval, export preview, release preview or visible status as final proof.
- Proof/audit zones are UX surfaces only; E02 does not implement persistence, API behavior or backend safety logic.

## Acceptance Criteria

- Every registered route resolves to one and only one approved page-template record.
- Template integrity fails if a route lacks a template or required zone declaration.
- Every template record includes family, required zones, optional zones, forbidden zones, long-page behavior, action-zone rule, proof/audit placement and renderer target.
- Template records project from the E01 operating model and existing page contract rather than re-owning route scope or safety vocabulary.
- `reference_hold` routes are always non-productive and cannot expose product action zones.
- Client-summary routes suppress internal proof/debug/reviewer-only content by construction.
- Workbench/detail templates expose visible primary content, action zone and state zone on representative runtime checks.
- Long-page behavior is tested on representative desktop and mobile routes when visible UI changes occur.
- No route, schema, API, permission, release, export or audit behavior is changed by E02 unless a later approved ticket explicitly authorizes it.

## Review And Test Design

Minimum validation after implementation:

- `pnpm guard:source` or the repo-local guard script if the pnpm wrapper blocks before script execution
- `pnpm typecheck`
- Focused template contract test, recommended: `tests/ux-page-template-system.spec.ts`
- Existing E01 proof: `pnpm playwright test tests/ux-operating-model.spec.ts`
- Existing route/page proof: `pnpm test:route-smoke`
- Existing density proof: `pnpm playwright test tests/true-ux-density.spec.ts`
- Existing worksurface proof: `pnpm playwright test tests/wp02-worksurface-shell.spec.ts`
- Representative screenshot/contact-sheet review for visible UI changes in `IMPL-E02-2` or `IMPL-E02-3`

Screenshots are not required for this specification task because no UI changed.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `E02-I1` / `IMPL-E02-1` | Complete | Canonical typed template contract exists in `lib/ux-page-template-system.ts`; reusable `PageTemplateFrame`, `PageTemplateSectionNav` and `PageTemplateSummaryRail` primitives exist in `components/ui/page-template.tsx`. |
| `E02-I2` / `IMPL-E02-3` | Complete | Long-page anchors, template zones, section navigation, summary rail and sticky action-zone conventions exist on shared renderers. |
| `E02-I3` / `IMPL-E02-2` | Complete | Template mapping is projected into shared page-family renderers while preserving route scope, with `WorksurfaceShell` using the shared page-template primitives. |
| `E02-Q1` / `QA-E02-1` | Complete | Template adoption, representative runtime behavior and no-overclaim/safety boundaries are validated. |

## Approval / Cleanup Note

The approved and implemented path is the bold canonical-template contract. Do not re-open the fallback that extends only `ux-page-contract`, and do not restore docs-only or `product-guidance`-based template proof as an equal authority.

## Ticket Result

`E02-S1` / `SPEC-E02-1` is complete as current repo truth. `E02-I1`, `E02-I2`, `E02-I3` and `E02-Q1` are executable as validation/closure against the implemented canonical-template path.
