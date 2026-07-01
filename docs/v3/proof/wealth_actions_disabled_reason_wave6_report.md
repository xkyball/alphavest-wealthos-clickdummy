# Wealth Actions Disabled Reason Wave 6 Report

## Scope

- Wave: 6 - Wealth Actions action drawer harmonization.
- Product gap: the action drawer still used generic implementation blocker copy for static evidence and timeline affordances, and the screen retained internal `<a>` navigation for app routes.
- Active product route: `/actions?state=drawer`.
- Changed files:
  - `components/wealth-actions-screen.tsx`
  - `tests/row-timeline-affordance-pruning.spec.ts`

## Source Discipline

- Re-read `AGENTS.md`.
- Re-read `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.
- Checked branch/status/log/diff before implementation.
- Ran `pnpm guard:source` before and after the wave.
- Target branch: `full-workflow`.

## Engine Artifacts

- Discover: Wealth Actions is a client-context work surface. The drawer should show product-native state and action boundaries, not proof/process scaffolding.
- Define: replace generic blocker text with object-specific evidence and timeline boundaries while keeping the existing command-backed `Request Info` action and upload route.
- Develop:
  - Psycho-Logic: labels answer what the user can do now, which object area they apply to, and why the control is bounded.
  - TRIZ: remove the contradiction between "show state" and "explain implementation" by converting proof wording into product scope wording.
  - SIT/SCAMPER: substitute internal generic blockers with selected-action evidence/timeline constraints; combine visual state with explicit disabled reasons in existing affordance attributes.
  - Harvard/BATNA: preserve current workflow/API behavior and narrow the wave to UI semantics plus route navigation, avoiding schema or permission expansion.
- Deliver: product labels, test coverage, viewport proof, API command proof, and this report.

## Implementation

- Replaced the Wealth sidebar configure blocker reason with tenant/review-permission wording.
- Replaced action drawer labels:
  - `Permitted list` -> `Linked evidence only`
  - `Permitted timeline` -> `Recorded activity only`
- Replaced generic disabled reason:
  - `Evidence list is limited to linked items for this selected action.`
  - `Activity timeline shows recorded events for this selected action.`
- Converted `/client/profile` and `/documents/upload` internal app navigation from `<a>` to Next `Link`.
- Extended the drawer pruning test to assert the new product reasons and absence of the generic implementation blocker reason.

## E2E And Visual Evidence

- Screenshot folder: `artifacts/screenshots/wealth-actions-disabled-reason-wave6/`
- Contact sheet: `artifacts/screenshots/wealth-actions-disabled-reason-wave6/contact-sheet.png`
- Viewport audit: `artifacts/screenshots/wealth-actions-disabled-reason-wave6/viewport-audit.json`
- Screenshot checksum index: `artifacts/screenshots/wealth-actions-disabled-reason-wave6/screenshot-sha256.txt`

Final viewport audit:

| Viewport | Generic blocker count | Overflow | Primary visible | API command | Upload navigation |
| --- | ---: | ---: | --- | --- | --- |
| 1400x900 | 0 | 0 px | yes | `ACTION_REQUEST_INFO`, HTTP 200, audit `52596c5a-2b1b-47d4-bb36-8695b40c5a1e` | `/documents/upload` |
| 390x844 | 0 | 0 px | yes | `ACTION_REQUEST_INFO`, HTTP 200, audit `986d25b5-6c26-4c2e-a752-09fa2e9a1702` | `/documents/upload` |

## Validation

- `pnpm typecheck` - pass.
- `pnpm exec eslint components/wealth-actions-screen.tsx tests/row-timeline-affordance-pruning.spec.ts` - pass with existing warnings in `wealth-actions-screen.tsx`.
- `pnpm playwright test tests/row-timeline-affordance-pruning.spec.ts -g "timeline lists static" --workers=1` - pass.
- `pnpm playwright test tests/button-cta-lifecycle-pruning.spec.ts -g "action-board buttons" --workers=1` - pass.
- `pnpm playwright test tests/card-kpi-affordance-pruning.spec.ts -g "dashboard cards static" --workers=1` - pass after rerun; first parallel attempt was blocked by `EADDRINUSE` on the Playwright web server port.
- `pnpm playwright test tests/data-maintenance-actions-api.spec.ts tests/data-maintenance-command-client-source.spec.ts --workers=1` - pass.
- `pnpm build` - pass with existing Babel and document-storage tracing warnings.
- `pnpm guard:source` - pass.
- `pnpm lint` - fails on existing unrelated errors in `components/client-intake-screen.tsx` and `components/decisions-governance-screen.tsx`; no new Wealth Actions lint errors.

## Positive Acceptance

- Action drawer no longer exposes generic implementation blocker wording for evidence or timeline scope.
- Static affordances now communicate product-native scope.
- Drawer evidence link navigates through app routing to `/documents/upload`.
- `Request Info` remains connected to the typed J05 data-maintenance command and produces audit event IDs.
- Desktop and mobile captures show no horizontal overflow and no hidden primary action in the audited viewport.

## Negative Acceptance And Residuals

- Full-lint remains blocked by pre-existing errors outside this wave.
- Wealth Actions still has existing unused-code warnings; they are not new failures and should be handled in a later cleanup wave.
- Screenshot artifacts were intentionally left untracked.

