# AlphaVest E05 Action Hierarchy And Workflow Control Normalization Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E05-1` |
| Parent epic | `E05 Action Hierarchy and Workflow Control Normalization` |
| Source analysis | `docs/v3/proof/e05_action_hierarchy_analysis.md` |
| Spec status | `DECISION_READY` |
| Implementation status | `BLOCKED_PENDING_HUMAN_APPROVAL` |
| Recommended approval | `APPROVE_E05_CANONICAL_ACTION_HIERARCHY_CONTRACT` |

This specification defines the target action hierarchy system for E05. It does not authorize implementation until the human approval gate is cleared.

## Target State

AlphaVest must have one canonical typed action hierarchy contract that decides how actions are prioritized, placed, disabled, blocked, separated and reviewed across app-wide workflow surfaces.

The contract must answer these questions for every relevant action:

1. What is the action priority: primary, secondary, tertiary, recovery, destructive or blocked?
2. What is the action meaning: approve, release, block, request evidence, export approval, download, share or another explicit lifecycle step?
3. Where may it appear: page header, inline cluster, adjacent rail, sticky rail, modal footer or table row?
4. Is it enabled, disabled, hidden, statically blocked, loading, success or error?
5. Which disabled or blocked reason is exposed?
6. Does it require permission, confirmation or audit?
7. Which no-overclaim rule prevents downstream gate collapse?

## Canonical Source Decision

Recommended decision: add a narrow code-backed canonical contract in `lib/ux-action-hierarchy-contract.ts`, then make `PageHeader`, `UxCtaCluster`, `GuardedActionButton`, action rail adapters and representative workflow action groups project from it.

Allowed fallback if the user rejects a new file: extend `lib/ux-page-template-system.ts` with action hierarchy fields. This is less clean because templates own zones and placement, not action semantics.

Rejected approach: keep local `primaryButtonClass` / `secondaryButtonClass` / `staticButtonClass` definitions and enforce behavior only through route-specific tests. That preserves the exact overlapping vocabulary E05 is meant to remove.

## Required Action Priorities

Implementation must support priorities equivalent to:

```ts
export type UxActionPriority =
  | "primary"
  | "secondary"
  | "tertiary"
  | "recovery"
  | "destructive"
  | "blocked";
```

Required semantics:

- `primary`: one currently safest executable next action in a productive action group.
- `secondary`: contextual supporting action that does not supersede the next step.
- `tertiary`: low-emphasis navigation or utility action.
- `recovery`: action that helps unblock or return to a safe state.
- `destructive`: action that blocks, rejects, deletes, cancels release, escalates risk or otherwise has high consequence.
- `blocked`: non-executable status/action placeholder with explicit reason and no product mutation.

Only one enabled `primary` action may appear in a single action group unless a future spec explicitly defines a multi-select/bulk action group. Protected, reference, hold and blocked groups must not render productive primary actions.

## Required Action Meanings

Implementation must classify action meanings equivalent to:

```ts
export type UxActionMeaning =
  | "navigate"
  | "save_draft"
  | "submit_review"
  | "approve"
  | "release"
  | "block"
  | "request_evidence"
  | "export_scope"
  | "export_redaction"
  | "export_approval"
  | "export_generate"
  | "download"
  | "share"
  | "client_acceptance";
```

Required separation:

- `approve` is not `release`.
- `release` is not export approval, download, share or client acceptance.
- `block` is destructive/high-risk and must not share primary success styling with release or approval.
- `request_evidence` is a recovery or safety action, not evidence sufficiency.
- `export_approval` is not export generation, download, share or client acceptance.
- `download` is not share, delivery, client acceptance or advice release.
- `client_acceptance` must not be implied by any internal workflow action.

## Required Placement Model

Implementation must support placements equivalent to:

```ts
export type UxActionPlacement =
  | "page_header"
  | "inline_cluster"
  | "adjacent_rail"
  | "sticky_rail"
  | "modal_footer"
  | "table_row";
```

Placement rules:

- `page_header`: only global next-step/navigation actions; no hidden release/export bypass.
- `inline_cluster`: local section action group with at most one primary action.
- `adjacent_rail`: workbench/detail action rail near current object or selected work item.
- `sticky_rail`: long/high-risk workflow action zone that remains visible on desktop when E02 template behavior requires it.
- `modal_footer`: confirmation/cancel/submit controls owned by the modal workflow.
- `table_row`: scoped row action only; must not create workflow-level authority by itself.

E02 `ux-page-template-system` remains the owner of template zones and long-page behavior. E05 owns action semantics inside those zones.

## Required Availability Model

Implementation must support availability states equivalent to:

```ts
export type UxActionAvailability =
  | "enabled"
  | "disabled"
  | "hidden"
  | "blocked_static"
  | "loading"
  | "success"
  | "error";
```

Availability rules:

- `enabled` requires a real href, handler or authorized command lifecycle.
- `disabled` must expose an accessible disabled reason.
- `hidden` must be used for unavailable actions that should not be presented to the current mode/audience.
- `blocked_static` must render as status, not as a fake executable button.
- `loading`, `success` and `error` must not imply downstream gate completion beyond the action's own meaning.
- Static blocked controls must not use primary visual treatment unless the contract marks them as the only safe next status and non-executable.

## Required Runtime Attributes

Every contract-projected action should be able to emit attributes equivalent to:

- `data-ux-action-priority`
- `data-ux-action-meaning`
- `data-ux-action-placement`
- `data-ux-action-availability`
- `data-ux-disabled-reason`
- `data-ux-disabled-message`
- `data-ux-requires-permission`
- `data-ux-requires-confirmation`
- `data-ux-requires-audit`
- `data-ux-no-overclaim`
- `data-ux-primary-cta` where applicable for existing tests during migration

Existing public test hooks may remain as compatibility projections during migration, but they must not remain independent sources of action truth.

## Primitive Projection Rules

Allowed implementation after approval:

- `components/page-header.tsx` may keep its public props but should project class names and action data attributes from the canonical contract.
- `components/ux-cta-cluster.tsx` should project primary/secondary/recovery/blocked actions from the canonical contract.
- `components/ui/guarded-action-button.tsx` should project permission/confirmation/audit and lifecycle metadata from the same contract.
- A new action rail primitive or adapter may wrap rail placement, safety note, blocked reason and action group semantics.
- Representative workflow surfaces may migrate to the new contract where they prove release/export/evidence/block separation.

Forbidden:

- Do not do a route-by-route redesign list.
- Do not create new routes.
- Do not reclassify route scope or page type.
- Do not generate screen/image/state-screen assets.
- Do not add backend commands, schemas, migrations, permission changes, audit persistence or API behavior.
- Do not weaken no-overclaim copy around approval, release, export, download, share or client acceptance.
- Do not use a wrapper component while leaving action semantics as local string/class decisions.

## Sticky Rail Rules

- Sticky or adjacent action rails are permitted only where the E02 template family and page behavior allow an action zone.
- Long/high-risk workflows should keep the current object, blocked reason, safety note and next action visible without burying the primary action below long content.
- Sticky rails must be responsive: desktop may use sticky side rail; mobile must render in normal flow without overlap.
- A sticky rail must not contain multiple competing primary actions.
- Destructive actions in a rail must be visually separated from release/approval/download actions.
- A rail may show blocked status if prerequisites are missing; blocked status is not an executable primary action.

## Safety And No-Overclaim Rules

- Action priority cannot change business authority.
- Visible approval cannot imply release.
- Visible release cannot imply export, download, share, client acceptance or advice finality.
- Visible export approval cannot imply export generation or delivery.
- Visible download cannot imply share, external recipient access or client acceptance.
- Visible request-evidence cannot imply evidence sufficiency.
- Visible block/destructive action cannot be styled as successful completion.
- Client-safe mode must not expose internal release/export/advisor/compliance action semantics unless already released/redacted and client-safe.

## Relationship To Existing Contracts

- E01 `ux-operating-model` remains the source for productive eligibility, audience and no-overclaim posture.
- E02 `ux-page-template-system` remains the source for page family, action zone and long-page behavior.
- E03 `ux-proof-reviewer-mode` remains the source for proof/reviewer/client-mode visibility.
- E04 `ux-lifecycle-state-contract` remains the source for modal, drawer, confirmation, state and capture lifecycle.
- E05 owns action hierarchy, action semantics, placement semantics and disabled/blocked action projection.

## Acceptance Criteria

- Every approved action priority resolves to runtime attributes and class treatment.
- Every approved action meaning resolves to a no-overclaim rule.
- Approval, release, block, request evidence, export approval, export generation, download, share and client acceptance remain distinct.
- `PageHeader`, `UxCtaCluster` and `GuardedActionButton` project action metadata from the canonical contract.
- Representative long/high-risk action rails project from the contract or approved rail adapter.
- Disabled and blocked actions expose accessible reasons without fake enabled controls.
- Destructive/blocking actions are visually and semantically separated from approval/release/download actions.
- Existing CTA/lifecycle/no-overclaim tests stay green or are migrated to assert the canonical contract.
- No route, schema, API, permission, audit persistence, release, export or client visibility policy is changed.

## Review And Test Design

Minimum validation after implementation:

- `./node_modules/.bin/tsx scripts/source-target-guard.ts`
- `./node_modules/.bin/tsc --noEmit`
- Focused action contract test, recommended: `tests/ux-action-hierarchy-contract.spec.ts`
- Primitive source/adoption proof for `PageHeader`, `UxCtaCluster` and `GuardedActionButton`
- Representative runtime checks:
  - `tests/true-ux-cta-state.spec.ts`
  - `tests/button-cta-lifecycle-pruning.spec.ts`
  - `tests/disabled-control-a11y-messaging.spec.ts`
  - release/export boundary tests such as `tests/ui-state-boundaries.spec.ts`, `tests/export-approval-lifecycle.spec.ts` or `tests/export-download-confirmation-lifecycle.spec.ts`

Screenshots are required for visible UI changes to action rails, button styling or workflow placement. Contract metadata-only changes may report that no screenshot was warranted.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `IMPL-E05-1` | Blocked pending approval | Add canonical action hierarchy contract and make `PageHeader`, `UxCtaCluster` and `GuardedActionButton` project action metadata/classes from it. |
| `IMPL-E05-2` | Blocked pending approval and `IMPL-E05-1` | Add or adapt a shared action rail pattern and migrate representative long/high-risk workflow rails without route-by-route redesign. |
| `IMPL-E05-3` | Blocked pending approval and `IMPL-E05-1` | Separate approval, release, block, evidence request, export approval/generation, download/share/client-acceptance meanings in representative compliance/export action groups. |
| `QA-E05-1` | Blocked pending implementation | Validate E05 contract adoption, representative runtime behavior and no-overclaim separation against this specification. |

## Post-Spec Approval Gate

Implementation must not start until the user approves one of these choices:

| Approval Choice | Recommendation | Consequence |
| --- | --- | --- |
| `APPROVE_E05_CANONICAL_ACTION_HIERARCHY_CONTRACT` | Recommended | Add a narrow typed action hierarchy contract and make primitives/rails/representative workflow actions project from it. Best path to remove local button-class and action-semantic debt. |
| `APPROVE_E05_PRIMITIVE_PATCH_ONLY` | Acceptable fallback | Patch `PageHeader`, `UxCtaCluster` and `GuardedActionButton` attributes, but action meanings and rail semantics remain partially scattered. |
| `REJECT_E05_IMPLEMENTATION` | Not recommended | Leaves E05 as analysis/spec only and preserves duplicated local action vocabulary. |

## Ticket Result

`SPEC-E05-1` is complete and decision-ready. `IMPL-E05-1`, `IMPL-E05-2`, `IMPL-E05-3` and `QA-E05-1` remain blocked until the post-spec approval gate is cleared.
