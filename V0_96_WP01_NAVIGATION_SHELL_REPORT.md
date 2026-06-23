# V0.96 WP-01 Navigation Shell Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `/Users/chris/Downloads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`

Status: `ACCEPTED_WITH_PROOF`

Date: 2026-06-23

## Scope

WP-01 asked for role-aware guided navigation, decisive page context, protected P1/reference/hold route handling and proof that the V0.96 journey is navigable without exposing unauthorized payload.

This slice did not create routes, promote held routes, weaken permissions, change schema or redesign the full app shell.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ALREADY_PRESENT_WITH_TARGETED_HARDENING`

Reason: the repo already had `navigationGroupsForRole`, product guidance, route context chips, guarded global search, page header context and route-smoke coverage. WP-01 only needed a small IA order hardening and explicit V0.96 role-aware navigation proof.

## Changed Files

| File | Change |
| --- | --- |
| `lib/navigation.ts` | Moved `Decisions` before `Governance` so the V0.96 core journey reads Evidence -> Advisory -> Compliance -> Decisions -> Governance -> Export. |
| `tests/navigation-shell.spec.ts` | Added assertions for V0.96 journey ordering, protected route exclusion and client-role locked internal workspace behavior. |
| `V0_96_WP01_NAVIGATION_SHELL_REPORT.md` | Added this execution report. |

## Inspected Files

- `components/app-shell.tsx`
- `components/sidebar.tsx`
- `components/top-bar.tsx`
- `components/page-header.tsx`
- `components/route-context-chip.tsx`
- `components/product-guidance-panel.tsx`
- `components/global-search-box.tsx`
- `lib/navigation.ts`
- `lib/route-registry.ts`
- `lib/ux-page-contract.ts`
- `lib/ux-route-policy.ts`
- `tests/navigation-shell.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`

Note: `tests/true-ux-flow-navigation.spec.ts` is not present in this checkout; current coverage lives in `tests/route-smoke.spec.ts`, `tests/navigation-shell.spec.ts` and the UI clickflow specs.

## Acceptance Results

| Criterion | Result |
| --- | --- |
| User can navigate V0.96 from evidence to export without an undifferentiated route list | `PASS` |
| Page headers expose page job, current state and next action | `PASS_EXISTING` through `PageHeader`, `ProductGuidancePanel` and route-smoke assertions |
| P1/hold/reference routes are not promoted to core nav priority | `PASS` |
| Navigation does not expose unauthorized payload by label, count or preview | `PASS` |
| Role-aware client navigation shows locked internal workspaces rather than internal payload | `PASS` |
| No new route/scope decision required | `PASS` |

## Proof

Focused proof for this slice:

- `pnpm exec playwright test tests/navigation-shell.spec.ts`
- `pnpm exec playwright test tests/ui-clickflow-phase01-05.spec.ts tests/ui-clickflow-phase06-10.spec.ts`
- `pnpm test:route-smoke`

Static safety proof:

- `pnpm typecheck`
- `pnpm lint`

## Screenshots

No screenshot was required for WP-01 because the change is an IA ordering and contract-test hardening. UI-touching later WPs should capture authenticated screenshots when the touched screen content changes visibly.

## Deviations

- The V0.96 task references `tests/true-ux-flow-navigation.spec.ts`; this file is absent. I used the existing navigation shell, route-smoke and UI clickflow specs instead.
- Existing build/lint warnings about broad Turbopack file tracing and unused variables are pre-existing and not introduced by WP-01.

## Next Recommended Work Package

Proceed to `WP-02 — Page-Type + Density System`.
