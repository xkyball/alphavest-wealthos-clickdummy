# AlphaVest E04 State / Modal / Drawer Lifecycle Audit

Date: 2026-06-27

## Source

- Upload epic: `E04 - State, Modal, Drawer and Overlay Lifecycle Implementation`
- Upload path: `/tmp/codex-remote-attachments/019f0884-6dd5-7652-a2e1-ffb8b2b20574/E4A37C8D-6C5E-4048-8A5B-520448641556/1-ALPHAVEST_OVERARCHING_UX_BOC_IMPLEMENTATION_TASK_ARCHITECTURE_CTES_v2.md`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Audited Surfaces

| Surface | Current Reality | E04 Gap |
| --- | --- | --- |
| `components/ui/modal.tsx` | Controlled `open`, owner `onClose`, Escape/backdrop/X handling, focus entry/trap/return, labelled `role="dialog"`, lifecycle attributes from `uxLifecycleAttributesForKind("modal")`. | No explicit capture variant marker beyond lifecycle attributes; cancel semantics depend on route-provided footer buttons. |
| `components/ui/drawer.tsx` | Controlled `open`, owner `onClose`, Escape/backdrop/X handling, focus entry/trap/return, labelled complementary panel, lifecycle attributes from `uxLifecycleAttributesForKind("drawer")`. | Backdrop is disabled when close is blocked, but capture variant metadata is not first-class in the primitive. |
| `components/ui/state-panel.tsx` | Canonical state taxonomy through `UxComponentState`, semantic icons, non-color styling, state attributes from `uxStateAttributesForComponentState`. | State copy is route-owned; no wrapper exists for grouped state boundaries or capture reviewer summaries. |
| `lib/ux-lifecycle-state-contract.ts` | Canonical lifecycle and state contracts exist, including base/modal/drawer/confirmation/capture-review and `uxCaptureVariantForFileKind`. | Capture identity is split between lifecycle attributes and capture script naming; no single marker helper for UI and capture metadata. |
| `scripts/capture-routes-and-modals.ts` | Generates base and overlay screenshots, names files with page, route, lifecycle kind and state slug, and writes capture variant metadata into index output. | Capture variant metadata is not formalized as reusable runtime attributes; strict visual capture still captures normal screens only. |
| `scripts/strict-visual-capture.ts` | Captures base route screenshots with model context and viewport checks. | Does not expose base/modal/drawer/state variant identity in metrics because it does not capture overlays. |

## Test Reality

| Test Surface | Current Coverage |
| --- | --- |
| `tests/modal-lifecycle-hardening.spec.ts` | Modal lifecycle attributes, Escape/cancel behaviour, no-overclaim copy and owner blocked-close delegation. |
| `tests/drawer-lifecycle-hardening.spec.ts` | Drawer lifecycle attributes, Escape/backdrop/cancel behaviour and focus return. |
| `tests/ui-state-boundaries.spec.ts` | Representative page states for client-safe, internal, upload, export and no-overclaim boundaries. |
| `tests/ux-lifecycle-state-contract.spec.ts` | Canonical lifecycle and state contract projections. |
| `tests/capture-routes-and-modals-contract.spec.ts` | Capture filenames and index metadata expose route/state/lifecycle kind. |

## E04-A1 Conclusion

The repo is not starting from visual-only overlays. Modal, drawer and state primitives already carry meaningful lifecycle behaviour and tests. E04 should therefore harden and centralize the existing seam instead of rebuilding it.

The bold cleanup path is:

1. Treat `lib/ux-lifecycle-state-contract.ts` as the canonical lifecycle/state/capture contract.
2. Add explicit capture variant runtime metadata at the shared primitive/helper level.
3. Keep route-specific mutation, submit and audit behaviour owner-owned.
4. Do not preserve compatibility with ambiguous screenshot names or visual-only state proof.

## Ticket Result

`E04-A1` is complete. It produced this audit and identified the implementation seam for `E04-S1`, `E04-I1`, `E04-I2` and `E04-I3`.
