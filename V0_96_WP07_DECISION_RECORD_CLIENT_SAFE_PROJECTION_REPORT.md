# V0.96 WP-07 Decision Record and Client-Safe Projection Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_WITH_CLIENT_SAFE_PROJECTION_REFACTOR_AND_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-07 turns the released AlphaVest decision into a traceable internal decision record and a fail-closed client-safe projection. Client visibility must be derived from compliance release and projection rules. Client-facing surfaces may show only released, allowlisted summaries and permitted metadata; AI Draft, internal rationale, analyst/advisor/compliance notes, raw evidence and internal audit details must not appear in the client projection.

This execution added real UI hardening on existing routes and refreshed projection proof. It did not create routes, APIs, schema fields or manual client-visibility overrides because the current repo already has a visibility engine, client-visibility control layer, fail-closed API envelopes and P0 projection tests.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ACCEPTED_WITH_CLIENT_SAFE_PROJECTION_REFACTOR_AND_CURRENT_PROOF`

Reason: the repo already had allowlisted projection helpers and negative tests, but the client route still relied mainly on proof/guidance panels. WP-07 needed a real projection-backed client summary surface and a clearer internal decision-record traceability surface.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Baseline commit | `e8f1f76 docs(v0.96): record WP00-WP02 execution proofs` |
| Dirty worktree before WP-07 | Present; prior WP03-WP06/catch-up artefacts preserved and not reverted |
| Source hierarchy read | `AGENTS.md`, `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, WP-07 companion prompt |
| Package scripts checked | `pnpm typecheck`, `pnpm lint`, projection/client/P0/route test scripts available |
| WP-07 treatment | Companion prompt under True-UX authority, not a replacement source of truth |

## Reality Classification

| Surface | Classification | Evidence |
| --- | --- | --- |
| `lib/visibility-engine.ts` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Decision, recommendation and document projections already fail closed for client roles and expose allowlisted payloads only. |
| `lib/control-layer/client-visibility.ts` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Existing WCL-04 wrapper normalizes safe projection vs hidden result. |
| `components/client-intake-screen.tsx` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_UI_REFACTOR` | Added projection-backed client-safe summary card and mobile-density parity content. |
| `components/decisions-governance-screen.tsx` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_UI_REFACTOR` | Added internal decision-record traceability card linking recommendation, evidence, advisor approval, compliance release, audit reference and visibility status. |
| Client API fail-closed envelope | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `tests/p0-api-contract.spec.ts` and `tests/fail-closed-error-envelope.spec.ts`. |
| Export dependency | `BOUNDARY_PROVEN_FOR_WP07` | Existing export tests allow export only from clean client-safe projections; full export UX remains WP-10. |
| Mobile route parity | `ACCEPTED_WITH_VIEWPORT_PROOF_AND_ROUTE_LIMITATION` | Route registry maps both portal/mobile reference IDs to `/client/home`; WP-07 verified the same projection semantics under mobile viewport without route evolution. |

## Changed Files

| File | Change |
| --- | --- |
| `components/client-intake-screen.tsx` | Added `ClientSafeProjectionCard`, `ClientProjectionField`, projection demo payloads using `visibilityEngine.projectDecisionPayload`, fail-closed client state, released safe summary, and mobile-density parity content. |
| `components/decisions-governance-screen.tsx` | Added `DecisionRecordTraceabilityCard` using `visibilityEngine.projectDecisionPayload` for internal projection and clean client projection proof. |
| `tests/true-ux-client-projection.spec.ts` | Added V0.96 WP-07 route tests for the real client-safe card, mobile viewport semantics and internal decision traceability. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updated WP-07 and client-safe fail-closed classification to current accepted proof status. |
| `V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_REPORT.md` | Added this WP-07 execution report. |

## Inspected Files

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_DEEP_TASK_DESCRIPTION.md`
- `V0_96_UX_IA_DELTA_REGISTER.md`
- `lib/route-registry.ts`
- `app/[...segments]/page.tsx`
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `lib/client-intake-demo-data.ts`
- `lib/decisions-governance-demo-data.ts`
- `lib/visibility-engine.ts`
- `lib/control-layer/client-visibility.ts`
- `lib/control-layer/visibility-projection.ts`
- `lib/permission-engine.ts`
- `lib/export-service.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/client-visibility-proof.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/scf-p07-p09-trust-ui.spec.ts`
- `tests/p0-api-contract.spec.ts`
- `tests/fail-closed-error-envelope.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/route-smoke.spec.ts`

## Refactor-First Proof

Real implementation was performed in the product UI:

- `/client/home` now has a real client-safe summary card backed by `visibilityEngine.projectDecisionPayload`.
- The card also shows the fail-closed no-release state from an unreleased decision payload.
- The client card does not render forbidden internal field names or internal audit details.
- `/decisions/demo` now has a real internal traceability card that makes the decision record chain visible without turning it into the client projection.

No new route/API/schema path was created because that would duplicate existing visibility-control infrastructure and risk a shortcut. No manual visibility override was introduced.

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Client portal exposes released client-safe summary only | `PASS` |
| Client route has fail-closed no-release state | `PASS` |
| Mobile viewport keeps the same projection semantics | `PASS_WITH_ROUTE_LIMITATION` |
| Internal decision detail shows traceability links | `PASS` |
| Client projection excludes AI Draft/internal rationale/compliance notes/raw evidence/internal audit | `PASS` |
| Advisor approval alone remains non-release | `PASS` |
| Upload-only evidence remains non-release | `PASS` |
| Wrong tenant/wrong role/error envelopes fail closed | `PASS` |
| Export consumes only clean client-safe projections | `PASS_BOUNDARY_ONLY`; full export UX remains WP-10 |
| No screen/image generation, blind schema or manual visibility override | `PASS` |

## Proof

Focused proof for this slice:

- `pnpm typecheck` -> `PASS`
- `pnpm playwright test tests/true-ux-client-projection.spec.ts --grep "V0.96 WP-07"` -> `PASS` 3/3
- `pnpm playwright test tests/client-visibility-projection.spec.ts tests/client-visibility-proof.spec.ts tests/true-ux-client-projection.spec.ts tests/scf-p07-p09-trust-ui.spec.ts tests/p0-api-contract.spec.ts tests/fail-closed-error-envelope.spec.ts tests/true-ux-density.spec.ts` -> `PASS` 44/44
- `pnpm playwright test tests/p0-acceptance.spec.ts tests/true-ux-p0-safety.spec.ts tests/route-smoke.spec.ts --grep "AV-SLICE-P0|UX-P0-SAFETY|client projection|decision|WP-07|045|044|019|UX-CLIENT|UX-PAGE-SPLIT-007"` -> `PASS` 55/55

Transient validation note:

- The first focused WP-07 test run failed because `InfoRow` was local to `components/decisions-governance-screen.tsx`; the client screen now uses its own `ClientProjectionField`. The rerun passed.

## Deferred Boundaries

- WP-08 still owns persisted audit surface UI acceptance.
- WP-10 still owns export scope/redaction/approval/download/share UX acceptance.
- WP-11 still owns shared interaction primitive consolidation beyond the touched route UI.
- WP-12 still owns the full no-overclaim copy/state sweep across all later touched surfaces.
- WP-14 still owns schema usage alignment if later evidence shows schema drift; WP-07 did not authorize blind schema changes.
- WP-15 still owns aggregate P0/True-UX acceptance.
- WP-16 still owns final release evidence and handoff update.

## Next Recommended Work Package

Proceed to `WP-08 - Audit Surface + Persistence UI`.
