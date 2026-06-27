# AlphaVest E04 State / Modal / Drawer Lifecycle Spec

Date: 2026-06-27

## Source

- Parent epic: `E04 - State, Modal, Drawer and Overlay Lifecycle Implementation`
- Audit predecessor: `docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_AUDIT.md`
- Canonical code contract: `lib/ux-lifecycle-state-contract.ts`

## Lifecycle Modes

| Mode | Meaning | Required Runtime Marker |
| --- | --- | --- |
| `base` | Normal page state without overlay. | `data-ux-lifecycle-capture-kind="base"` or `data-ux-state-capture-kind="base"` |
| `modal` | Dialog overlay controlled by owner state. | `data-ux-interaction-lifecycle="modal"` |
| `drawer` | Side panel overlay controlled by owner state. | `data-ux-interaction-lifecycle="drawer"` |
| `confirmation` | Modal confirmation with explicit owner-owned action. | Capture variant must resolve to `confirmation` even when file kind is modal. |
| `capture_review` | Reviewer/capture-only state. | Must not imply product action, mutation, release or acceptance. |

## Modal Rules

- `Modal` is a controlled primitive; `open` is owner state and close is `onClose`.
- Escape, backdrop and X close are safe only when `onClose` exists.
- When owner workflow is submitting, owner must omit `onClose` so primitive projects blocked close semantics.
- Focus must enter the dialog and return to the parent context after close where feasible.
- Cancel buttons are route-owned footer actions and must close without submit or mutation.
- Submit buttons are route-owned. The primitive must never claim business mutation, audit persistence, release, export, download, share or client acceptance.

## Drawer Rules

- `Drawer` is a controlled primitive; `open` is owner state and close is `onClose`.
- Escape, backdrop and X close are safe only when `onClose` exists.
- Backdrop interaction must be disabled when closing is blocked.
- Focus must enter the drawer and return to the trigger after close where feasible.
- Drawer content may carry object context, but drawer presence is not permission, release, audit, export or evidence proof.

## State Boundary Rules

- All reusable state panels must use `UxComponentState` from `lib/ux-lifecycle-state-contract.ts`.
- Required state families are loading, empty, error, validation, permission denied, blocked, restricted, success, hidden, reference, deferred, audit unavailable, export pending, export redaction and export failed.
- State components must expose semantic runtime metadata, not only color.
- State copy remains route-owned so it can name the real blocker, recovery path and no-overclaim boundary.
- Success state must be local to the stated action and cannot imply downstream completion.

## Capture Variant Rules

- Screenshot filenames and manifests must distinguish `base`, `modal`, `drawer` and `confirmation`.
- UI primitives and state helpers must project capture variant metadata so browser capture can verify what is visible.
- Base route captures must not be mistaken for overlay proof.
- Overlay captures must preserve route/page identity, lifecycle kind and state label.
- Capture metadata is proof identity only. It is not backend security or product readiness.

## Implementation Targets

| Ticket | Required Implementation |
| --- | --- |
| `E04-I1` | Keep modal/drawer behaviour in shared primitives; add missing capture/runtime markers without route-specific mutation logic. |
| `E04-I2` | Add reusable state boundary helpers/components around `StatePanel` so loading/empty/error/blocked/denied/success/internal-only states are grouped and self-describing. |
| `E04-I3` | Normalize capture marker helpers and script output so base/modal/drawer/confirmation variants share one contract. |

## Stop Conditions

- Stop if a route-specific business action is required to prove primitive lifecycle.
- Stop if a requested change weakens P0 safety, client visibility, evidence/audit separation or export/release boundaries.
- Stop if capture naming changes require an unapproved E09-wide screenshot QA policy rewrite.

## Ticket Result

`E04-S1` is complete. The implementation can proceed against the canonical lifecycle/state/capture contract without a human decision.
