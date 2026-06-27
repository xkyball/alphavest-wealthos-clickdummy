# AlphaVest E05 Action Hierarchy And No-Overclaim Feedback Implementation Spec

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Epic | `E05 Action Hierarchy and No-Overclaim Feedback Implementation` |
| Source | Uploaded overarching UX BOC implementation architecture |
| Implementation status | `AUTHORIZED_BY_USER_FOR_THIS_RUN` |
| Dependencies | `E01`, `E02`, `E04` |
| Audit | `docs/ux/ALPHAVEST_E05_ACTION_FEEDBACK_AUDIT.md` |

## Required Rules

Action hierarchy:

- One action group may expose at most one enabled primary action.
- Secondary actions must not look like the next decisive workflow step.
- Recovery actions must unblock or return to a safe state and must not imply completion.
- Destructive actions must be visually and semantically distinct from approval, release and download.
- Blocked actions must expose a reason and must not behave like fake enabled controls.
- Sticky or rail actions must declare `sticky_rail` or `action_rail` placement metadata.

Action meaning separation:

- `approve` is not `release`.
- `release` is not export approval, download, share, client acceptance or advice finality.
- `request_evidence` is not evidence sufficiency.
- `block` is a protective/destructive stop, not workflow success.
- `export_approval` is not export generation, download, share or client acceptance.
- `download` is not share or client acceptance.
- `share` is not client acceptance.
- `client_acceptance` cannot be implied by any internal workflow action.

No-overclaim feedback:

- Success copy must name only the completed action.
- Upload success must remain upload-only and must not imply evidence sufficiency, release, export, client visibility or client acceptance.
- Advisor approval must not imply compliance release.
- Compliance release must not imply client acceptance.
- Export preview must not imply approval.
- Export approval must not imply generation, download or share.
- Download/share feedback must not imply client acceptance.
- Validation, blocked, retry and fail-closed messages must preserve the gate that is still missing.

## Implementation Plan

1. Add `components/ui/action-zone.tsx`.
2. Export it from `components/ui/index.ts`.
3. Keep `lib/ux-action-hierarchy-contract.ts` as canonical action semantics.
4. Keep `lib/ux-feedback-message-contract.ts` as canonical no-overclaim feedback semantics.
5. Apply the primitives to representative route-family surfaces:
   - document/evidence upload actions,
   - compliance decision action rail,
   - export approval/download/share controls.
6. Add focused tests proving the route-family adoption and no-overclaim metadata.

## Acceptance Criteria

- Shared action variants exist for primary, secondary, recovery, destructive and blocked controls.
- Disabled or blocked controls expose accessible reasons.
- No business permission logic is hard-coded in the primitive.
- Upload action feedback remains upload-only.
- Advisor/compliance/release/block/request-evidence actions are distinct.
- Export preview, approval, download and share actions are distinct.
- Route-family surfaces use the shared primitives where E05 scope applies.
- Focused CTA/action/feedback/no-overclaim tests pass.
