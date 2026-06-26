# AlphaVest UX Operating Model

Date: 2026-06-26

## Status

| Field | Value |
| --- | --- |
| Origin ticket | `IMPL-E01-1` |
| Source specification | `docs/ux/ALPHAVEST_E01_UX_OPERATING_MODEL_SPEC.md` |
| Canonical code contract | `lib/ux-operating-model.ts` |
| Scope | Design-system and planning rule for route, page, capture and UX review posture |

This document is the durable design-system entry for AlphaVest UX operating modes. Future UX work should cite the operating-model field it satisfies instead of inventing local screen labels.

## Canonical Rule

The code-backed contract in `lib/ux-operating-model.ts` is the canonical source for operating mode, audience, proof posture, productive eligibility, allowed treatment, forbidden treatment and no-overclaim obligation.

Other surfaces are projections:

- `lib/ux-page-contract.ts` projects the operating model into page contracts.
- `lib/capture-screen-model-context.ts` projects the operating model into screenshot/capture metadata.
- UI data attributes and visible labels are rendered outcomes, not independent policy.
- `VisualMode` selects visual state or chrome only. It is not operating authority.

## Operating Modes

| Mode | Meaning | Productive CTA Allowed |
| --- | --- | --- |
| `OPERATIONAL_INTERNAL` | Internal MVP or MVP-support work surface with a real lifecycle. | Yes, when route policy allows it |
| `OPERATIONAL_CLIENT_SAFE` | Client-safe released/redacted projection or client-facing workspace posture. | Yes, client-safe only |
| `INTERNAL_PREVIEW` | Internal preview/review state before release, export, download or client gate. | Yes, but never as final release/acceptance |
| `PROOF_REVIEWER` | Evidence, screenshot, capture or QA review posture. | No product mutation by itself |
| `REFERENCE_ONLY` | Internal reference/catalogue/state documentation route. | No |
| `DEFERRED_P1` | Registered route reserved for later work. | No |
| `HOLD_PENDING_DECISION` | Explicitly blocked route awaiting scope or safety decision. | No |

## Non-Productive Modes

`REFERENCE_ONLY`, `DEFERRED_P1` and `HOLD_PENDING_DECISION` are non-productive by construction. They may explain why a route exists, but they must not expose product CTAs, route unlocks, client payloads, final safety states or hidden productive controls.

## Proof Posture

| Proof Posture | Meaning |
| --- | --- |
| `product_runtime` | Current runtime can support product proof only when paired with relevant UI/API/service/DB/guard evidence. |
| `client_projection` | Client-safe projection posture; internal drafts and unreleased evidence remain forbidden. |
| `internal_preview` | Internal review or preview state; preview is not approval, download, release or acceptance. |
| `visual_reference` | Visual/context reference only; not product workflow proof. |
| `partial_capture` | Capture/reviewer metadata only; completion requires current-run evidence. |
| `blocked_scope` | Deferred or held route; no product capability claim. |

Screenshots and contact sheets prove what rendered. They do not prove complete product capability unless the relevant runtime and safety tests also pass.

## Ticket Discipline

Future UX tasks must:

- Cite the operating mode or proof posture being changed.
- Keep route scope and proof posture explicit.
- Use the canonical contract instead of local screen labels.
- Treat protected routes as non-productive unless a later approved route-scope decision unlocks them.
- Keep `VisualMode` limited to visual-state selection.
- Preserve no-overclaim rules for advice, release, export, evidence sufficiency, admin actions and client visibility.

## Forbidden Shortcuts

- Do not close UX tasks with docs-only labels when code or capture metadata still uses separate authority.
- Do not turn screenshot proof into product proof without current-run evidence.
- Do not make route-scope changes through operating-model work.
- Do not introduce screen/image/state-screen generation.
- Do not treat internal preview as approval, release, download or client acceptance.
