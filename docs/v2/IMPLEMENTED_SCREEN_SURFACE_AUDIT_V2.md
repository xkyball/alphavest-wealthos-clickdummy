# Implemented Screen Surface Audit v2

Date: 2026-06-14

## Purpose

This audit checks implemented routes against the v2 visual interpretation rule: product UI regions become UI, reference boards become internal/reference/docs/model logic, and drawer/modal/popup visuals remain overlay-style workflow surfaces.

The enforceable source for this classification is `lib/surface-registry.ts`, mirrored for humans in `docs/v2/SURFACE_REGISTRY_V2.md`.

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

## Workspace-Wide Overlay Validation Pass

| Visual | Surface class | Previous risk | Action taken |
|---|---|---|---|
| V2-023 (Evidence preview surface) | Focused overlay | `EvidenceScreenV2` could render with `previewOpen = true`, which would auto-open the drawer outside an explicit trigger. | Confirmed and fixed: default is now `previewOpen = false`; drawer opens only from click or compatible context actions. |
| V2-046 (Communication preview surface) | Focused overlay | No open-by-default risk detected; already query-driven via `surface=client-preview`. | Kept as-is; regression guard remains in place. |

### Current automated checks added for this risk

- `tests/phase5-client-routes.test.mjs`: explicit assertion that `EvidenceScreenV2` starts with `useState(false)`.
- `tests/v2-surface-contracts.test.mjs`: new contract test asserts focused surfaces with `open={...}` state bindings do not initialize with `useState(true)`.

## Workspace-Wide Visual Classification

| Surface group | Visuals | Classification | Enforcement |
|---|---|---|---|
| Client mobile and portal | V2-001 to V2-013, V2-017, V2-019 | Product routes / route states | Route metadata and source tests. |
| Client focused surfaces | V2-014 to V2-016, V2-018, V2-020 to V2-025 | Drawers, modal-style decision room and contextual evidence overlays | `tests/v2-surface-contracts.test.mjs` checks surface keys, no standalone links and region tokens. |
| Internal workflows | V2-026 to V2-037 | Internal routes with panels/actions where shown | Legacy-shell tests plus route/component contracts. |
| Governance | V2-038 to V2-042 | Internal governance route plus role drawer and confirmation modal | Surface registry tokens and governance source tests. |
| Permission/state/evidence references | V2-043, V2-054 to V2-056 | Logic-only reference inputs | Registry marks them `logic_only`; no app route should render these boards. |
| Communication | V2-044 to V2-047 | Internal communication workflow plus client preview overlay | Phase 8 tests and surface token guards. |
| Service blueprint / journey | V2-048 to V2-050 | Internal/reference route | `referenceOnly` route metadata and reference-label tests. |
| Roadmap / planning | V2-051 to V2-053 | Planning/reference route | `referenceOnly` route metadata and planning tests. |

## Future Implementation Rule

Before implementing any new screen:

1. Classify the visual as product screen, internal workflow, focused overlay/drawer/modal, reference-only board or mixed.
2. Implement only the actual UI region.
3. Translate notes, legends, metadata, workflow explanations, permission hints and audit hints into model logic, tests and docs.
4. If the visual is a drawer/modal/popup/preview, preserve that surface shape even when a route exists for deep linking.
5. Add or update tests that assert the route does not use legacy board shells, annotation panels or visual metadata.
6. Do not add direct links to standalone routes for focused surfaces; open them in context.
7. Add the visual to `lib/surface-registry.ts` and `docs/v2/SURFACE_REGISTRY_V2.md` before implementing route/component changes.
8. Add region-token guards for focused surfaces so the correct part of the visual is implemented.

## Guard Tests

- `tests/phase5-client-routes.test.mjs` checks the evidence preview drawer overlay.
- `tests/phase75-visual-rules.test.mjs` checks runtime/internal workflow routes do not import legacy board shells.
- `tests/phase8-communication-planning.test.mjs` checks reference screens and the communication preview overlay.
- `tests/v2-surface-contracts.test.mjs` checks manifest coverage, focused-surface metadata, compatibility redirects, region tokens and legacy-shell bans.

## Verification

Command results after this audit/refactor:

| Command | Result |
|---|---|
| `npm test` | Passed: 52 tests |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npm run test:e2e` | Passed: 8 route/source smoke tests |
| Browser smoke check | Passed for workbench trigger detail, evidence preview overlay, communication preview overlay, governance second-confirmation modal, roadmap reference labelling and `/evidence` redirect. |
