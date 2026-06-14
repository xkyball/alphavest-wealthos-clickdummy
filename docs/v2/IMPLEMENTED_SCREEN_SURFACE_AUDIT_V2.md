# Implemented Screen Surface Audit v2

Date: 2026-06-14

## Purpose

This audit checks implemented routes against the v2 visual interpretation rule: product UI regions become UI, reference boards become internal/reference/docs/model logic, and drawer/modal/popup visuals remain overlay-style workflow surfaces.

## Findings and Changes

| Route | Current classification | Action |
|---|---|---|
| `/mobile` | Mobile app content | OK. Implemented inside the mobile content region without decorative phone shell. |
| `/mobile/upload` | Mobile upload workflow | OK. Query/state-driven mobile content, no visual-board chrome. |
| `/portal` | Client dashboard | OK. Product dashboard surface. |
| `/wealth-map` | Graph plus detail drawer | OK. Detail remains drawer-like beside graph context. |
| `/actions` | Kanban plus detail drawer | OK. Detail remains drawer-like beside workflow context. |
| `/decisions` | Modal workflow surface | OK. Already implemented as centered decision-room modal. |
| Evidence preview | Contextual preview drawer | Refactored again. Evidence records now open as a drawer overlay from workflow context, including workbench and decision submission. The drawer now contains the V2-023 document preview, V2-024 restricted state and V2-025 missing-evidence escalation regions. `/evidence` redirects to `/portal` and is not a standalone navigation target. |
| `/signals` | Internal trigger workflow | Refactored. Removed legacy `Phase3Board` usage and replaced with dedicated internal workflow surface. |
| `/workbench` | Internal workbench | OK. Already uses runtime command surface, not visual-board shell. |
| `/advisor-approval` | Internal advisor gate | Refactored. Removed old `V2ScreenShell` usage and replaced with dedicated internal workflow surface. |
| `/compliance` | Internal compliance gate | Refactored. Removed old `V2ScreenShell` usage and replaced with dedicated internal workflow surface. |
| `/governance` | Governance/permission management | OK. Uses matrix, role drawer, second confirmation modal and blocked state. |
| `/communication` | Internal communication workflow plus preview overlay | OK after Phase 8 follow-up. Client message preview is overlay-style over internal context. |
| `/service-blueprint` and `/journey` | Internal/reference route | OK. Reference-only blueprint is not client-facing. |
| `/roadmap` | Planning/reference route | OK. Roadmap scope is not client-facing product UI. |

## Future Implementation Rule

Before implementing any new screen:

1. Classify the visual as product screen, internal workflow, focused overlay/drawer/modal, reference-only board or mixed.
2. Implement only the actual UI region.
3. Translate notes, legends, metadata, workflow explanations, permission hints and audit hints into model logic, tests and docs.
4. If the visual is a drawer/modal/popup/preview, preserve that surface shape even when a route exists for deep linking.
5. Add or update tests that assert the route does not use legacy board shells, annotation panels or visual metadata.
6. Do not add direct links to standalone routes for focused surfaces; open them in context.

## Guard Tests

- `tests/phase5-client-routes.test.mjs` checks the evidence preview drawer overlay.
- `tests/phase75-visual-rules.test.mjs` checks runtime/internal workflow routes do not import legacy board shells.
- `tests/phase8-communication-planning.test.mjs` checks reference screens and the communication preview overlay.

## Verification

Command results after this audit/refactor:

| Command | Result |
|---|---|
| `npm test` | Passed: 45 tests |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npm run test:e2e` | Passed: 8 route/source smoke tests |
| Browser smoke check | Passed for workbench evidence preview and `/evidence` redirect. Workbench has no standalone `/evidence` link, `Preview evidence` opens the V2-023-style drawer overlay in context, and `/evidence` redirects to `/portal` without standalone evidence records. |
