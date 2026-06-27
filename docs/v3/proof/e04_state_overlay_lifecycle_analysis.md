# E04 State, Modal, Drawer and Overlay Lifecycle Analysis

Date: 2026-06-27

## Ticket

`ANALYSIS-E04-1: Analyse current app-wide pattern reality`

## Source Extracted

Upload source: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`

E04 title: `State, Modal, Drawer and Overlay Lifecycle Normalization`

Execution chain:

1. `ANALYSIS-E04-1`
2. `SPEC-E04-1`
3. Human approval after `SPEC-E04-1`
4. `IMPL-E04-1: Harden shared modal and drawer primitives`
5. `IMPL-E04-2: Implement shared state pattern components`
6. `IMPL-E04-3: Normalize base-vs-overlay capture variants in UI states`
7. `QA-E04-1`

## Current Pattern Reality

The repo already contains reusable modal and drawer primitives:

- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/state-panel.tsx`

The modal and drawer primitives already expose lifecycle data attributes for open, close, cancel, submit, status, focus return and no-overclaim. Focus trap and Escape handling are implemented directly in both primitives.

State handling exists through `StatePanel`, but its state taxonomy mixes generic state names (`loading`, `empty`, `error`, `success`) with domain/safety states (`export-redaction`, `audit-unavailable`, `p1-deferred`, `hold-blocked`, `internal-only`). This works locally but does not yet separate base state, overlay state, confirmation state and capture state as a canonical contract.

Capture/review behavior exists in `scripts/capture-routes-and-modals.ts`. It distinguishes screen, modal and drawer screenshot names and has an overlay plan, but this is script-local knowledge rather than a shared lifecycle model projected from the UI primitives.

Focused regression coverage already exists:

- `tests/modal-lifecycle-hardening.spec.ts`
- `tests/drawer-lifecycle-hardening.spec.ts`
- `tests/consent-policy-modal-lifecycle.spec.ts`
- `tests/invite-user-drawer-lifecycle.spec.ts`
- `tests/evidence-drawer-lifecycle.spec.ts`
- `tests/access-request-drawer-lifecycle.spec.ts`
- `tests/role-drawer-confirmation-lifecycle.spec.ts`
- `tests/governance-user-drawer-lifecycle.spec.ts`
- `tests/admin-confirmation-modal-lifecycle.spec.ts`
- `tests/export-download-confirmation-lifecycle.spec.ts`
- `tests/decision-confirmation-lifecycle.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/capture-routes-and-modals-contract.spec.ts`

## Affected Reusable Pattern Families

- Overlay primitives: `Modal`, `Drawer`.
- State primitive: `StatePanel`.
- Owner workflows that pass close/submission state into overlays.
- Capture/review script and screenshot file naming.
- Runtime tests asserting modal/drawer lifecycle and no-overclaim boundaries.
- E01/E02/E03 contracts that already define operating mode, page template and proof/reviewer/client visibility semantics.

## Systemic UX Problems

- Lifecycle vocabulary is encoded as repeated string attributes, not as a typed operating contract.
- Modal and drawer share very similar focus/close semantics, but the rules are duplicated inside each primitive.
- `StatePanel` has one flat state union, making it hard to prove whether a state is a base state, overlay validation state, permission state, blocked state or capture/review state.
- Capture overlay knowledge lives mostly in `scripts/capture-routes-and-modals.ts`, so UI and capture can drift.
- Existing tests validate representative surfaces but do not yet prove full taxonomy consistency.

## Screen-Specific Work Excluded

E04 should not redesign individual modal contents, rewrite route screens, add new modal flows, generate state images, or move business logic into overlay primitives.

## Recommended Specification Cut

The bold cleanup path is:

`APPROVE_E04_CANONICAL_LIFECYCLE_STATE_CONTRACT`

This path adds a typed canonical lifecycle/state contract and makes `Modal`, `Drawer`, `StatePanel`, capture naming and tests project from it. It should retire scattered lifecycle string conventions as the primary truth.

Less bold alternatives:

- `APPROVE_E04_DOCS_AND_TESTS_ONLY`: documents the current conventions without removing the duplicate vocabulary. Not recommended.
- `APPROVE_E04_PRIMITIVE_ATTR_PATCH_ONLY`: adds more attributes to the existing primitives but leaves state/capture taxonomy scattered. Not recommended.
- `REJECT_E04_IMPLEMENTATION`: keeps current behavior unchanged after analysis/spec. Not recommended because E04 exists to remove ambiguity.

## Implementation Task Cut

`IMPL-E04-1` should add the canonical lifecycle contract and project modal/drawer attributes from it.

`IMPL-E04-2` should add a canonical state-pattern contract and project `StatePanel` metadata from it without changing business behavior.

`IMPL-E04-3` should project capture variant metadata from the same lifecycle/state contract so base, modal, drawer and confirmation captures are mechanically distinguishable.

## Acceptance-Criteria Inputs

- Every lifecycle kind has a typed record: base, modal, drawer, confirmation and capture/review.
- Modal and drawer attributes come from a shared lifecycle contract, not duplicated free-form strings.
- `StatePanel` exposes canonical state family, severity and lifecycle placement.
- Capture script/source tests can prove screenshot/capture state variants are aligned with the canonical lifecycle contract.
- No route reclassification, no screen generation, no backend validation claim and no WCAG completion claim.

## Risks

- Over-hardening overlays could accidentally break existing owner-managed submitting/close behavior.
- Treating confirmation as a backend safety guarantee would overclaim; E04 may only standardize the UX-visible lifecycle.
- Renaming visible state copy would create unnecessary UI churn; E04 should focus first on typed contracts and reusable metadata.

## Open Decisions

- Whether to approve the recommended canonical contract path: `APPROVE_E04_CANONICAL_LIFECYCLE_STATE_CONTRACT`.
- Whether E04 should retire old ad hoc lifecycle attribute names immediately or keep temporary compatibility attributes while tests migrate.

## Definition of Done Result

`ANALYSIS-E04-1` is complete. The current reusable pattern families, risks, dependencies, task cut and specification inputs are identified.
