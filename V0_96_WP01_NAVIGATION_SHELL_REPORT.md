# V0.96 WP-01 Navigation Shell Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-01 asked for role-aware guided navigation, decisive page context, protected P1/reference/hold route handling, mobile shell lifecycle proof and evidence that the V0.96 journey is navigable without exposing unauthorized payload.

This execution did not create routes, promote held routes, weaken permissions, change schema, create a parallel navigation model, generate screens/images or redesign the shell. Current repo inspection showed that the WP-01 implementation already exists in the live `full-workflow` baseline and only needed current proof plus report refresh.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ALREADY_PRESENT_WITH_CURRENT_PROOF`

Reason: the repo already has `navigationGroupsForRole`, workspace-first `lib/navigation.ts`, route policy/page contracts, product guidance, route context chips, guarded global search, page header context, client-role navigation lockouts, mobile sidebar lifecycle and route-smoke/page-header coverage. The current run validated those surfaces rather than moving code unnecessarily.

## Changed Files

| File | Change |
| --- | --- |
| `V0_96_WP01_NAVIGATION_SHELL_REPORT.md` | Refreshed this execution report against the current WP-00 baseline and current proof run. |

No app code, schema, route registry, test file or visual asset was changed for WP-01 in this run.

## Inspected Files

- `V0_96_UX_IA_DELTA_REGISTER.md`
- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md`
- `components/app-shell.tsx`
- `components/sidebar.tsx`
- `components/top-bar.tsx`
- `components/page-header.tsx`
- `components/route-context-chip.tsx`
- `components/product-guidance-panel.tsx`
- `components/global-search-box.tsx`
- `app/api/global-search/route.ts`
- `lib/navigation.ts`
- `lib/product-guidance.ts`
- `lib/route-registry.ts`
- `lib/ux-page-contract.ts`
- `lib/ux-route-policy.ts`
- `tests/navigation-shell.spec.ts`
- `tests/product-guidance-shell.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`
- `tests/route-smoke.spec.ts`

Note: `tests/true-ux-flow-navigation.spec.ts`, `tests/navigation-role-visibility.spec.ts` and `tests/page-header-contract.spec.ts` are not present in this checkout. Current equivalent coverage lives in `tests/navigation-shell.spec.ts`, `tests/product-guidance-shell.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/ui-clickflow-phase01-05.spec.ts`, `tests/ui-clickflow-phase06-10.spec.ts` and `tests/route-smoke.spec.ts`.

## Acceptance Results

| Criterion | Result |
| --- | --- |
| WP-00 predecessor checked and live repo baseline used | `PASS` |
| Existing navigation and UX policy modules reused | `PASS` |
| Primary navigation is journey/workspace-based, not a flat route catalogue | `PASS` |
| V0.96 internal workspaces are visible to internal roles in journey order | `PASS` |
| Client role receives client-safe navigation with internal workspaces locked and no internal payload preview | `PASS` |
| Representative routes expose product guidance, current gate, page job and next step | `PASS` |
| Representative states render one primary CTA or locked state, not multiple competing primaries | `PASS` |
| Evidence copy separates upload/intake from sufficiency/release | `PASS` |
| Advisor approval and compliance release remain distinct | `PASS` |
| Export scope, redaction, preview, approval and download/share remain distinct | `PASS` |
| P1, reference and hold routes remain outside implementation navigation | `PASS` |
| Mobile navigation opens, closes and closes after route navigation | `PASS` |
| No route/scope/schema/screen-generation change | `PASS` |

## Proof

Commands run:

| Command | Result |
| --- | --- |
| `pnpm playwright test tests/navigation-shell.spec.ts` | `PASS` — 9 passed |
| `pnpm playwright test tests/product-guidance-shell.spec.ts tests/true-ux-cta-state.spec.ts` | `PASS` — 16 passed |
| `pnpm playwright test tests/ui-clickflow-phase01-05.spec.ts tests/ui-clickflow-phase06-10.spec.ts` | `PASS` — 10 passed |
| `pnpm test:route-smoke` | `PASS` — 315 passed |
| `pnpm playwright test tests/global-search-affordance.spec.ts` | `PASS` — 2 passed |
| `pnpm typecheck` | `PASS` |
| `pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 30 warnings |

Runtime warnings observed during Playwright runs were non-blocking and pre-existing: Node reported `NO_COLOR` ignored because `FORCE_COLOR` is set, and Next reported that a custom Babel configuration can be removed.

The first lint attempt was run in parallel with Playwright and failed with `ENOENT` while ESLint scanned `test-results`. A solo rerun passed.

## Deviations

- The WP-01 prompt names `tests/true-ux-flow-navigation.spec.ts`, `tests/navigation-role-visibility.spec.ts` and `tests/page-header-contract.spec.ts`; these files are absent. Equivalent current coverage was used and recorded above.
- No screenshot was captured because this run did not change product UI. The user-visible shell was validated through Playwright selectors and route-smoke rather than screenshot comparison.

## Next Recommended Work Package

Proceed to `WP-02 — Page-Type + Density System` using the current WP-00 baseline and the existing `lib/ux-density.ts`, `lib/ux-page-contract.ts`, route-smoke density assertions and `V0_96_WP02_PAGE_TYPE_DENSITY_REPORT.md` as starting context.
