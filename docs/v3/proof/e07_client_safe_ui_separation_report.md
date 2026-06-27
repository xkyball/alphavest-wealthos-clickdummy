# E07 Client-Safe UI Separation Report

Date: 2026-06-27

## Scope

Epic: `E07 - Client-Safe Visibility and Internal/External UI Separation`

Implemented tickets:

| Ticket | Result |
| --- | --- |
| `E07-A1` | Completed audit in `docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_AUDIT.md`. |
| `E07-S1` | Completed spec in `docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_SPEC.md`. |
| `E07-I1` | Added reusable E07 client-safe UI boundary contract and component. |
| `E07-I2a` | Suppressed route-context, phase/proof panels and task-id scaffolding in client portal/mobile family surfaces. |
| `E07-I2b` | Replaced export download client-package proof panel with E07 client-package projection boundary and removed internal Trust/Proof panel from delivery view. |
| `E07-I3` | Centralized client projection state copy for released, empty, hidden, redacted, permission-denied and source-upload states. |
| `E07-Q1` | Completed focused, route-smoke and screenshot validation. |

## Code Artefacts

- `lib/ux-client-safe-ui-boundary.ts`
- `components/ui/client-safe-ui-boundary.tsx`
- `lib/client-portal-projection-state.ts`
- `components/client-intake-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/worksurface-shell.tsx`
- `tests/ux-client-safe-ui-boundary.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/product-guidance-shell.spec.ts`
- `tests/route-smoke.spec.ts`

## UI Changes

- Client shell no longer renders route-context proof chip.
- Client home no longer renders visible Phase 5 / Phase 7 proof panels.
- Client documents route no longer renders visible Phase 5 / Phase 7 proof panels.
- Client entity/detail and document review routes suppress former proof/task panels in client-safe UI.
- Export download route now renders an E07 client-package projection boundary instead of the old UX client-projection proof panel.
- Export download route no longer renders the internal export trust/proof panel that named internal payload classes in the client-package delivery context.
- Client-safe state copy now comes from a shared adapter instead of local per-panel branching.

## Screenshot Evidence

- `artifacts/screenshots/e07-client-safe/client-home.png`
- `artifacts/screenshots/e07-client-safe/documents.png`
- `artifacts/screenshots/e07-client-safe/export-download.png`
- `artifacts/screenshots/e07-client-safe/mobile.png`

## Validation

| Command | Result |
| --- | --- |
| `./node_modules/.bin/tsx scripts/source-target-guard.ts` | PASS |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| `./node_modules/.bin/eslint .` | PASS with 23 existing warnings, no errors |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-client-safe-ui-boundary.spec.ts tests/true-ux-client-projection.spec.ts tests/product-guidance-shell.spec.ts tests/export-safety.spec.ts --workers=1` | PASS, 25 passed |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/route-smoke.spec.ts --workers=1` | PASS, 192 passed |

## Acceptance

| Criterion | Result |
| --- | --- |
| Client-facing UI does not display internal proof/debug/reviewer scaffolding | PASS for representative client portal/mobile and export-package routes. |
| Internal-only and released-client-safe states are visibly distinct | PASS through E07 boundary attributes and client projection state panel adapter. |
| UI states fail closed visually when client-safe content is not available | PASS via centralized client projection state copy and StatePanel primitives. |
| UI suppression is not represented as backend security | PASS; E07 boundary records `ui_projection_only_not_rbac`. |

## Residual Debt

- Backend payload filtering/RBAC enforcement remains out of E07 scope and must not be inferred from UI suppression.
- Several internal route families still contain historical Phase 4/5/6 proof panels by design; E07 only suppresses them where the route is client-safe or a client-package projection.
- Broader copy cleanup should continue to reduce internal wording in non-client routes, but that is not an E07 acceptance blocker.

`E07` is complete.
