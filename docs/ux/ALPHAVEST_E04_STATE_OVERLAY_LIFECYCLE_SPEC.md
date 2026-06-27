# AlphaVest Deprecated E04 State, Modal, Drawer And Overlay Lifecycle Normalization Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E04-1` |
| Parent epic | `E04 State, Modal, Drawer and Overlay Lifecycle Normalization` |
| Source analysis | `docs/v3/proof/e04_state_overlay_lifecycle_analysis.md` |
| Spec status | `SUPERSEDED_BY_E04_UPLOAD_LIFECYCLE_SPEC` |
| Implementation status | `IMPLEMENTED_CURRENT_REPO_TRUTH_ELSEWHERE` |
| Replacement spec | `docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md` |
| QA proof | `docs/v3/proof/e04_upload_epic_execution_closure_2026-06-27.md` |

This historical specification defined the target lifecycle/state system for E04. The current operative E04 spec is `docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md`, and the implementation is complete by current repo proof.

## Target State

AlphaVest must have one canonical typed lifecycle/state contract that decides how base states, overlays, modals, drawers, confirmations, validation states, success/error states and capture variants are named, rendered and reviewed.

The contract must answer these questions for every relevant state or overlay:

1. Is this base page state or overlay state?
2. Is this modal, drawer, confirmation, blocked, validation, loading, empty, permission, error, success or capture/review state?
3. Which close/cancel/submit semantics apply?
4. Which focus-return and accessibility expectations apply?
5. Which no-overclaim boundary applies?
6. Which data attributes and capture labels must be emitted?
7. Which tests prove the decision?

## Canonical Source Decision

Recommended decision: add a narrow code-backed canonical contract in `lib/ux-lifecycle-state-contract.ts`, then make `Modal`, `Drawer`, `StatePanel`, capture/review naming and focused tests project from it.

Allowed fallback if the user rejects a new file: extend the current primitives directly with typed constants. This is less clean because state taxonomy, overlay lifecycle and capture naming would remain coupled to component implementation details.

Rejected approach: keep adding literal `data-ux-*` strings screen by screen. That preserves the exact debt E04 is meant to remove.

## Lifecycle Kinds

Implementation must support lifecycle kinds equivalent to:

```ts
export type UxLifecycleKind =
  | "base"
  | "modal"
  | "drawer"
  | "confirmation"
  | "capture_review";
```

Required semantics:

- `base`: default page or component state without overlay context.
- `modal`: blocking overlay with `role="dialog"`, controlled open/close, focus trap, focus return and explicit cancel semantics.
- `drawer`: secondary-context overlay with owner-controlled open/close, focus return and no implicit mutation.
- `confirmation`: typed or explicit confirmation state owned by the workflow, never by the primitive alone.
- `capture_review`: screenshot/contact-sheet/review state that distinguishes base, modal, drawer and confirmation variants without becoming product UI.

## State Families

Implementation must classify states equivalent to:

```ts
export type UxStateFamily =
  | "loading"
  | "empty"
  | "error"
  | "validation"
  | "permission_denied"
  | "blocked"
  | "restricted"
  | "success"
  | "hidden"
  | "reference"
  | "deferred"
  | "audit_unavailable"
  | "export_pending"
  | "export_redaction"
  | "export_failed";
```

Exact export names may vary during implementation, but the semantics must not weaken.

Required classification:

- `loading`, `empty`, `error`, `validation`, `permission_denied`, `blocked`, `restricted`, `success` are reusable app state families.
- `hidden`, `reference`, `deferred`, `audit_unavailable`, `export_pending`, `export_redaction`, `export_failed` are safety/domain-specialized families that still project to the same reusable metadata shape.
- `success` must not imply downstream completion, audit persistence, export delivery, client release or client acceptance unless current product proof separately exists.
- `blocked`, `restricted`, `permission_denied` and `audit_unavailable` must remain fail-closed and must not suggest bypass paths.

## Modal Rules

- Modal open state is owner-controlled.
- Modal close is safe through Escape, backdrop and close button only when the owner passes `onClose`.
- Modal close may be blocked while submitting by omitting `onClose`.
- Cancel means no submit and no mutation.
- Submit semantics are owned by the workflow, not the primitive.
- Modal must expose accessible title/description, focus trap, focus return and live status guidance.
- Modal must expose lifecycle metadata from the canonical contract, not duplicated literal strings.

## Drawer Rules

- Drawer open state is owner-controlled.
- Drawer close is safe through Escape, backdrop and close button only when the owner passes `onClose`.
- Drawer close may be blocked while submitting by omitting `onClose`.
- Drawer is secondary context; it cannot approve, release, export, delete, mutate payload visibility or complete downstream gates by itself.
- Drawer must expose accessible title/description, focus trap, focus return and live status guidance.
- Drawer must expose lifecycle metadata from the canonical contract, not duplicated literal strings.

## Confirmation Rules

- Confirmation requires explicit owner workflow state.
- Typed confirmation text, acknowledgement, validation, submitting, success and error states remain owner-owned.
- The primitive may host confirmation UI but must not claim the business command completed.
- Confirmation state must be capture-distinguishable from both base page state and generic modal/drawer state.

## StatePanel Rules

- `StatePanel` must project every current `ComponentState` into a canonical state-family record.
- `StatePanel` must expose state family, severity and lifecycle placement metadata.
- Existing visible copy should not be churned unless it violates no-overclaim/client/internal rules.
- State severity must be stable enough for tests and capture review.
- Domain-specialized state names may remain as compatibility inputs only if they project to canonical state families.

## Capture Variant Rules

- Capture/review outputs must distinguish base, modal, drawer and confirmation states mechanically.
- Screenshot filenames and capture metadata must continue to avoid route/screen overclaim.
- Capture labels may include state kind and overlay kind, but capture metadata must not become visible product UI.
- Capture must remain conservative: screenshot presence is proof of rendered state, not proof of backend persistence or completed product capability.

## Implementation Boundaries

Allowed after approval:

- Add `lib/ux-lifecycle-state-contract.ts` or approved fallback.
- Make `Modal` and `Drawer` lifecycle attributes project from the canonical contract.
- Make `StatePanel` project canonical state-family, severity and lifecycle placement metadata.
- Add capture variant helpers or tests that prove base/modal/drawer/confirmation naming.
- Update focused lifecycle/state tests to assert the canonical contract.
- Add implementation reports and QA proof artifacts.

Forbidden:

- No route reclassification.
- No new routes.
- No screen/image/state-screen generation.
- No full WCAG claim.
- No backend validation logic.
- No schema, migration, API, RBAC, audit persistence, permission, release, export or client visibility policy change.
- No screen-by-screen overlay redesign.
- No hiding of operational blockers or validation states that affect task completion.
- No claim that modal/drawer/confirmation UI proves backend mutation.

## Relationship To Existing Contracts

- E01 `ux-operating-model` remains the source for operating mode, audience and proof posture.
- E02 `ux-page-template-system` remains the source for page family and proof/audit placement.
- E03 `ux-proof-reviewer-mode` remains the source for proof/reviewer/client-mode visibility.
- E04 owns lifecycle/state naming, primitive lifecycle metadata and capture state variants.

## Acceptance Criteria

- Every approved lifecycle kind resolves to an accessible runtime/capture contract.
- Every current `ComponentState` resolves to a canonical state family and severity.
- Modal and drawer primitives no longer own duplicate free-form lifecycle strings as primary truth.
- Modal and drawer still preserve owner-controlled open/close, blocked close while submitting, focus trap and focus return.
- Confirmation state remains owner-owned and no-overclaim safe.
- Capture/review can distinguish base, modal, drawer and confirmation variants.
- Existing lifecycle tests stay green or are migrated to the canonical contract.
- No route, schema, API, permission, audit persistence, release, export or client visibility policy is changed.

## Review And Test Design

Minimum validation after implementation:

- `./node_modules/.bin/tsx scripts/source-target-guard.ts`
- `./node_modules/.bin/tsc --noEmit`
- Focused lifecycle contract test, recommended: `tests/ux-lifecycle-state-contract.spec.ts`
- Modal proof: `tests/modal-lifecycle-hardening.spec.ts`
- Drawer proof: `tests/drawer-lifecycle-hardening.spec.ts`
- State proof: `tests/ui-state-boundaries.spec.ts` or a new source-level state projection test
- Capture proof: `tests/capture-routes-and-modals-contract.spec.ts`

Screenshots are required only if implementation changes visible UI. Contract projection, metadata and tests alone should report that no screenshot was warranted.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `IMPL-E04-1` | Superseded by replacement E04 chain; complete in current repo truth | Add canonical lifecycle contract and project modal/drawer primitive metadata from it. |
| `IMPL-E04-2` | Superseded by replacement E04 chain; complete in current repo truth | Add canonical state-family contract and project `StatePanel` metadata from it. |
| `IMPL-E04-3` | Superseded by replacement E04 chain; complete in current repo truth | Normalize base/modal/drawer/confirmation capture variant labels against the canonical lifecycle contract. |
| `QA-E04-1` | Superseded by replacement E04 chain; complete in current repo truth | Validate lifecycle, state and capture variant adoption against this specification. |

## Current Operative Result

Use `docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md` plus `lib/ux-lifecycle-state-contract.ts` as the operative E04 truth. `E04-A1`, `E04-S1`, `E04-I1`, `E04-I2`, `E04-I3` and `E04-Q1` are complete by current repo implementation, validation and screenshot/capture evidence.
