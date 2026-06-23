# V0.96 Refactor-First Compliance Audit WP01-WP05

Execution mode: `max`

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Status: `CATCH_UP_COMPLETE_BEFORE_WP06`

Date: 2026-06-23

## Mission

This addendum catches up WP01 through WP05 against the current refactor-first anti-shortcut rule before WP06 continues.

The audit does not promote V0.96 uploads into operative authority. The uploads remain companion task sources under the True-UX handoff. This audit also does not authorize route creation, schema migration, generated screens/images, client-visible internal payloads, advisor-approval-as-release or admin bypass.

## Moving Baseline Preflight

| Check | Current result |
| --- | --- |
| Branch | `full-workflow` |
| Latest commit | `e8f1f76 docs(v0.96): record WP00-WP02 execution proofs` |
| Working tree | Dirty with active V0.96 docs/proof/UI/test changes plus user/new AGENTS/Handoff edits; no conflicting route/schema migration detected for this catch-up |
| Scripts | `pnpm` project with `typecheck`, `lint`, `db:validate`, `build`, `phase:check`, `test:route-smoke`, workflow, permission, projection, export and density scripts |
| Route registry | `lib/route-registry.ts` exists and remains the current route truth |
| Target components | Shell, navigation, density, evidence/workflow and advisor components exist |
| Test inventory | Focused True-UX/V0.96 tests exist; some older prompt-named specs are absent and covered by current route-smoke/targeted specs |

## Refactor-First Matrix

| WP | Real implementation path inspected | Implementation decision | Shortcut/substitute status | Follow-up owner |
| --- | --- | --- | --- | --- |
| WP01 Journey-first IA / shell | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `components/global-search-box.tsx`, `lib/navigation.ts`, `lib/route-registry.ts`, `lib/ux-route-policy.ts`, `tests/route-smoke.spec.ts` | No new refactor required. The shell is already componentized, route-registry driven, role-aware and protected-route aware. Current report-only acceptance is valid because the real component path was inspected and proof exists. | No shortcut. Missing old spec names are test-name drift, not product substitution. | WP12 may re-check copy/state wording when later touched routes change. |
| WP02 Page-type / density | `lib/ux-density.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts`, `lib/v0-96-ux-density-contract.ts`, `components/product-guidance-panel.tsx`, `components/ux-hub-page.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-dense-operations-panel.tsx`, `tests/true-ux-density.spec.ts`, `tests/route-smoke.spec.ts` | No new refactor required. D1-D4 density, page-type aliases and above-fold guidance already exist in shared modules/components. | No shortcut. V0.96 labels are compatibility aliases; route truth stays in registry. | Later WPs must prove touched decision-room/export/governance routes against the same density model. |
| WP03 Evidence workbench | `app/api/documents/*`, `app/api/documents/review/route.ts`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `lib/permission-engine.ts`, `lib/visibility-engine.ts`, `lib/audit-service.ts`, evidence/document tests and route-smoke | No new refactor required. Upload, review, link, insufficiency, recovery, audit and no-release behavior already exist in services/API/UI tests. | No shortcut. Screenshot artifact is existing proof only; acceptance is backed by services and tests, not by screenshot alone. | WP08 must prove persisted audit surface; WP12 must re-check later touched evidence copy. |
| WP04 Analyst workbench / AI draft internal review | `components/internal-workflow-screen.tsx`, `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts`, `lib/workflow-gate.ts`, `lib/visibility-engine.ts`, `lib/export-service.ts`, workflow/API/projection/export tests | No new refactor required. Typed analyst actions, unsupported-claim rejection, evidence-scoped rebuild, request-evidence state, audit writes and no-leakage gates already exist. | No shortcut for WP04 acceptance. Visible rebuild affordance remains held where the UI does not own the analyst rebuild form, and that boundary is explicit. | WP11 may supply richer shared reason-modal lifecycle if later authorized; WP12 re-checks no-overclaim copy. |
| WP05 Advisor queue / approval detail | `components/internal-workflow-screen.tsx`, `app/api/demo-workflow/route.ts`, `lib/demo-workflow-validation.ts`, `lib/demo-workflow-mutation.ts`, `lib/workflow-gate.ts`, `lib/permission-engine.ts`, `lib/visibility-engine.ts`, `tests/demo-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/route-smoke.spec.ts` | Real implementation was preferred and applied. Advisor approval copy was already hardened; this catch-up further changes the advisor detail button from a misleading reject label to a real advisor escalation label, and clarifies that rebuild is analyst-owned while evidence request is compliance-owned. | Partial only for advisor-specific reject/request-change lifecycle. It is not counted as fulfilled in WP05 because current state-machine ownership makes reject analyst-only and request-evidence compliance-only. | WP06 owns compliance request-evidence/block/release UI. WP11 may add shared reason-modal primitives. WP12 owns final no-overclaim copy sweep. |

## WP05 Boundary Decision

The stronger option, adding advisor-owned `reject_unsupported_claim` or `request_evidence` buttons, was rejected. It would have been a shortcut because the current state machine defines:

- `reject_unsupported_claim` as analyst-owned with `requiredRole: analyst`.
- `request_evidence` as compliance-owned with `requiredRole: compliance_officer`.
- `advisor_approve` as the advisor-owned action with `requiredRole: senior_wealth_advisor`.

The implemented WP05 correction is therefore:

- keep `Approve as advisor` as the real advisor approval action,
- keep approval client-safe and compliance-pending,
- relabel advisor escalation as `Escalate advisor review call`,
- label rebuild as analyst-owned,
- label evidence request as compliance-owned,
- mark broader reject/request-change lifecycle as deferred to the owning WPs instead of accepted by copy.

## Adversarial QA

| Risk | Audit result |
| --- | --- |
| Report-only acceptance hides a feasible refactor | Rejected for WP05 by making a small real UI/test hardening change. WP01-WP04 remain accepted only because current shared components/services were inspected. |
| Advisor approval becomes release by implication | Rejected. Copy and tests keep compliance release required. |
| Advisor reject/request-change is overclaimed | Corrected. WP05 no longer treats those paths as fulfilled advisor actions. |
| V0.96 route labels replace route registry truth | Rejected. Compatibility aliases remain documentation/proof only. |
| Passing tests alone becomes acceptance | Rejected. This addendum records implementation paths, ownership boundaries and follow-up owners. |

## Catch-Up Proof

Focused validation run after this addendum:

| Command | Result |
| --- | --- |
| `pnpm playwright test tests/route-smoke.spec.ts --grep "advisor detail exposes escalation"` | `PASS` 1/1 |
| `pnpm playwright test tests/button-cta-lifecycle-pruning.spec.ts` | `PASS` 4/4 |
| `pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts` | `PASS` 3/3 |
| `pnpm typecheck` | `PASS` |
| `pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` 0 errors, 30 warnings |

Notes:

- Two initial parallel Playwright runs failed with `EADDRINUSE` on `127.0.0.1:3020`; reruns were serial and passed.
- One initial grep for `Draft rebuild` matched no test title; the full file rerun passed after updating the stale WP05 label expectation.

WP06 must then start with a fresh real-refactor checkpoint against compliance decision-room routes and may not use report-only acceptance if a feasible release/block/request-evidence UI refactor remains.
