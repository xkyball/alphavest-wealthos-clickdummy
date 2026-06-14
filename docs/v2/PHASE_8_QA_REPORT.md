# Phase 8 QA Report

Date: 2026-06-14

## Scope

Phase 8 - Communication, Service Blueprint and Planning.

## Implemented Routes

| Route | Status |
|---|---|
| `/communication` | Implemented as an internal communication workflow with decision tree, trigger matrix, overlay-style message preview, role views, release controls and evidence log. |
| `/service-blueprint` | Added as an internal/reference service blueprint route. |
| `/journey` | Retained as an alias to the service blueprint route. |
| `/roadmap` | Implemented as a planning/reference route for MVP, Phase 2, Future, blocked features and dependency flow. |

## Reference vs Product Decisions

- V2-044 to V2-047: implemented as communication workflow UI and logic. V2-046 is treated as an overlay-style client preview/release surface over the internal workflow context.
- V2-048 to V2-050: implemented as internal/reference service blueprint, evidence chain and escalation loops.
- V2-051 to V2-053: implemented as planning/reference scope control, not as client wealth UI.
- V2-054 to V2-056: used as state/evidence/audit reference input, not rendered as ordinary product screens.

## Gate Status

Communication send remains blocked until advisor approval, compliance release, evidence record, permission check and released visibility state are complete. The route uses Phase 7 central permission, visibility, state, evidence and audit helpers.

## Tests Added

`tests/phase8-communication-planning.test.mjs` covers:

- `/communication` uses the Phase 8 communication screen.
- decision tree, call trigger matrix, overlay-style message preview and evidence log are present.
- selecting trigger paths maps to recommendation routes.
- message preview remains blocked until approvals and release are complete.
- communication evidence log returns event history.
- `/service-blueprint` and `/journey` use the service blueprint screen.
- blueprint includes swimlane, evidence chain and escalation/returns sections.
- `/roadmap` includes MVP, Phase 2, Future, blocked features and dependency flow.
- reference screens are marked internal/reference.

## Command Results

| Command | Result |
|---|---|
| `npm run build` | Passed |
| `npm run lint` | Passed |
| `npm run test:e2e` | Passed: 5 route/source smoke tests |
| `npm test` | Passed: 40 tests |
| `npm run typecheck` | Passed |
| Browser smoke check | Passed for `/communication`, `/service-blueprint` and `/roadmap` on existing local dev server at `localhost:3000` |

## Known Limitations

- Mock/demo data only.
- Communication approval controls are click-dummy state, not persisted to a real messaging service.
- `/service-blueprint` and `/roadmap` are internal/reference screens and intentionally do not represent client-facing wealth workflows.
- No real calendar, CRM, specialist, document API or notification integration is included.

## Phase 9 Readiness

Phase 9 can start.
