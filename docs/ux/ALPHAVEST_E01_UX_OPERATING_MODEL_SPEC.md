# AlphaVest E01 UX Operating Model And Scope Discipline Specification

Date: 2026-06-26

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E01-1` |
| Parent epic | `E01 UX Operating Model and Scope Discipline Lock` |
| Source analysis | `docs/v3/proof/e01_ux_operating_model_analysis.md` |
| Spec status | `DECISION_READY` |
| Implementation status | `BLOCKED_PENDING_HUMAN_APPROVAL` |
| Recommended approval | `APPROVE_E01_CANONICAL_TYPED_CONTRACT` |

This specification defines the target operating model for E01. It does not authorize implementation until the human approval gate is cleared.

## Target State

AlphaVest must have one canonical operating-model contract that every route, page pattern, capture artifact and UX review can reference without interpretation.

The operating model must answer seven questions for every registered surface:

1. What route scope owns this surface?
2. Is the surface productive or protected/non-productive?
3. Who is the audience: internal operator, internal reviewer, client-safe projection or reference reviewer?
4. What proof posture may screenshots or captures claim?
5. What treatment is allowed?
6. What treatment is forbidden?
7. What no-overclaim rule prevents safety or scope drift?

## Canonical Source Decision

Recommended decision: create a narrow code-backed canonical contract in `lib/ux-operating-model.ts`, then make `lib/ux-page-contract.ts`, `lib/capture-screen-model-context.ts`, UI attributes and `docs/ux/` documentation project from that contract.

Allowed fallback if the user rejects a new file: extend `lib/ux-page-contract.ts` as the canonical source. This is less clean because `ux-page-contract` already mixes policy projection with page contract output.

Rejected approach: docs-only taxonomy. It would not remove drift because route policy, capture proof and UI attributes would keep using separate interpretations.

## Operating Modes

| Mode | Purpose | Productive | Typical Source Inputs | Must Never Do |
| --- | --- | --- | --- | --- |
| `OPERATIONAL_INTERNAL` | Internal MVP/MVP_SUPPORT work surface with a real task lifecycle. | Yes | `MVP`, `MVP_SUPPORT`, internal workspace, non-client projection | Expose unreleased client advice, imply release, bypass audit or treat visible status as proof |
| `OPERATIONAL_CLIENT_SAFE` | Client-safe released or redacted projection. | Yes, client-safe only | `MVP_SUPPORT` or client workspace plus visibility-safe/released context | Render internal drafts, analyst notes, compliance notes, unreleased evidence or unsafe advice |
| `INTERNAL_PREVIEW` | Internal preview/review state before a release/export/client gate. | Yes, but not final | preview visual modes, compliance/advisor/export pre-release surfaces | Call preview approval, download, client acceptance or final release |
| `PROOF_REVIEWER` | Evidence, screenshot, capture or QA review posture. | No product mutation by itself | capture metadata, contact sheets, proof reports, reviewer workflows | Claim complete product capability without current UI/API/service/DB/guard proof |
| `REFERENCE_ONLY` | Internal reference/catalogue/state documentation. | No | `REFERENCE_ONLY` route scope | Expose product workflow, client payload, primary product CTA or route-scope elevation |
| `DEFERRED_P1` | Registered route reserved for later work. | No | `P1_AFTER_MVP` route scope | Add MVP action, primary navigation elevation, client-visible behavior or hidden unlock |
| `HOLD_PENDING_DECISION` | Explicitly blocked route awaiting scope or safety decision. | No | `HOLD_PENDING_DECISION` route scope | Implement MVP behavior, generate screens, finalize safety behavior or unlock scope |

## Mapping Rules

| Existing Concept | New Treatment |
| --- | --- |
| `RouteScopeLabel` | Remains the source for scope and productive eligibility. |
| `VisualMode` | Demoted to visual-state/chrome selection only. It must not define operating authority. |
| `UxPageType` | Remains the source for page job and treatment shape, then projects into the operating model. |
| `CaptureCapabilityStatus` | Remains capture proof evidence, then projects into proof posture. |
| `clientVisibilitySensitive` | Remains a safety signal that influences audience posture and no-overclaim obligations. |
| UI data attributes | Become rendered projections of the canonical operating model, not independent policy. |
| `docs/ux/*` registers | Remain historical/phase registers; the E01 operating model becomes the durable design-system rule. |

## Required Contract Shape

Implementation must expose a typed contract equivalent to:

```ts
export type UxOperatingMode =
  | "OPERATIONAL_INTERNAL"
  | "OPERATIONAL_CLIENT_SAFE"
  | "INTERNAL_PREVIEW"
  | "PROOF_REVIEWER"
  | "REFERENCE_ONLY"
  | "DEFERRED_P1"
  | "HOLD_PENDING_DECISION";

export type UxOperatingModelRecord = {
  allowedTreatment: string;
  audience: "internal" | "internal_reviewer" | "client_safe" | "reference_reviewer";
  forbiddenTreatment: string;
  mode: UxOperatingMode;
  noOverclaimRule: string;
  pageId: string;
  productiveUxEligible: boolean;
  proofPosture: "product_runtime" | "client_projection" | "internal_preview" | "visual_reference" | "partial_capture" | "blocked_scope";
  routeScope: RouteScopeLabel;
};
```

Exact names may change during implementation, but the semantics must not weaken.

## Implementation Boundaries

Allowed after approval:

- Add `lib/ux-operating-model.ts` or extend `lib/ux-page-contract.ts` if the fallback is chosen.
- Update `lib/ux-page-contract.ts` to consume the canonical operating model.
- Update `lib/capture-screen-model-context.ts` so capture metadata includes operating mode and proof posture.
- Add or update one durable design-system document under `docs/ux/`.
- Add focused tests that prove route coverage, protected-route non-productivity and capture no-overclaim.
- Update review/report wording where it is a projection of the approved contract.

Forbidden:

- No route reclassification.
- No new routes.
- No screen-specific redesign.
- No screen/image/state-screen generation.
- No schema or migration work.
- No API creation or backend safety-policy change.
- No permission, visibility, release, export or audit weakening.
- No docs-only completion claim if code/capture/test projections remain stale.

## Capture Review Rules

Capture metadata must include operating mode labels for every route.

Reference and hold behavior:

- `REFERENCE_ONLY` routes must be labeled as visual/context proof only.
- `HOLD_PENDING_DECISION` routes must be labeled as blocked scope and must not be promoted into product capability proof.
- `DEFERRED_P1` routes must be labeled as deferred and non-productive.

Proof/reviewer behavior:

- A screenshot, contact sheet or DOM/capture bundle is proof of what was rendered, not proof that the product workflow is complete.
- `PROOF_REVIEWER` posture may cite UI, API, service, DB and guard evidence only when current-run evidence exists.
- Capture output must not contain `COMPLETE_VERTICAL_SLICE` or equivalent completion language unless separately proven by the relevant runtime and safety tests.

## Design-System Documentation Rules

The durable E01 design-system doc must:

- Define all operating modes.
- State which mode families can have product CTAs.
- State which modes are non-productive by construction.
- State that route scope and proof posture are not optional.
- State that `VisualMode` is visual-state selection only.
- Tell future UX tickets to cite the operating-model field they satisfy.
- Link back to this specification and the implementation tests.

Recommended file: `docs/ux/ALPHAVEST_UX_OPERATING_MODEL.md`.

## Acceptance Criteria

- Every registered route resolves to one and only one canonical operating-model record.
- Operating-model integrity fails if a route is missing a mode.
- `REFERENCE_ONLY`, `DEFERRED_P1` and `HOLD_PENDING_DECISION` records are always `productiveUxEligible: false`.
- Protected routes cannot render primary product buttons/links through the existing route skeleton pattern.
- Capture metadata includes operating mode, audience and proof posture.
- Capture metadata for reference/hold/deferred routes cannot claim product capability completion.
- Client-sensitive or client projection records cannot expose internal/unreleased/advisor-draft/compliance-note posture as client-facing output.
- Existing `VisualMode` remains available for visual-state selection but is not accepted as operating authority.
- E01 documentation lives in one durable design-system artifact, not only in ticket reports.
- Tests cover the contract and prove no route scope, schema, API, permission, release or export behavior changed.

## Review And Test Design

Minimum validation after implementation:

- `pnpm guard:source`
- `pnpm typecheck`
- Focused operating-model contract test, recommended: `tests/ux-operating-model.spec.ts`
- Existing route contract proof: `pnpm test:route-smoke`
- Existing capture proof: `pnpm playwright test tests/capture-screen-model-context.spec.ts`
- Existing protected-route proof: `pnpm playwright test tests/p1-hold-defensive-noninteractive.spec.ts tests/reference-product-control-pruning.spec.ts`

Screenshots are not required for E01 unless implementation changes visible UI. Metadata/documentation/test-only work should report that no screenshot was warranted.

## Post-Spec Approval Gate

Implementation must not start until the user approves one of these choices:

| Approval Choice | Recommendation | Consequence |
| --- | --- | --- |
| `APPROVE_E01_CANONICAL_TYPED_CONTRACT` | Recommended | Add a narrow canonical typed contract and project docs/capture/page contracts from it. Best path to remove old drift. |
| `APPROVE_E01_EXTEND_UX_PAGE_CONTRACT_ONLY` | Acceptable fallback | Avoids a new file, but keeps more responsibility inside `ux-page-contract`. Less clean. |
| `REJECT_E01_IMPLEMENTATION` | Not recommended | Leaves E01 as analysis/spec only and keeps the current overlapping vocabularies. |

## Ticket Result

`SPEC-E01-1` is complete and decision-ready. `IMPL-E01-1`, `IMPL-E01-2` and `QA-E01-1` remain blocked until the post-spec approval gate is cleared.
