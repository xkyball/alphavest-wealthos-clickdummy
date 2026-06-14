# Phase 5 QA Report

Date: 2026-06-14

## Scope

Run scope: Phase 5 - Client Experience Rebuild.

This pass rebuilt the client-facing routes from the v2 client screen specs and visuals while preserving the Phase 4 route model, permission helper, no-unapproved-advice gate, evidence helper and audit helper.

Follow-up correction: visuals are implemented as actual app surfaces only. `/mobile` and `/mobile/upload` no longer render a decorative phone frame, desktop shell, visual-board header, side panels or visible state-toggle controls. The global left demo sidebar and Phase/V2 page-spec headers were removed from the client experience. Evidence visuals V2-023 to V2-025 now render as contextual `EvidencePreviewDrawer` states; `/evidence` redirects to `/portal` and is not a standalone product page.

## Routes Implemented

| Route | Status |
|---|---|
| `/mobile` | Implemented default, recommendation blocked, empty and decision notification states through mobile content only. |
| `/mobile/upload` | Implemented select type, extraction review, low-confidence blocked, verification pending and retry states through mobile content only. |
| `/portal` | Implemented dashboard default plus loading, error and permission blocked states. |
| `/wealth-map` | Implemented graph-like map, filters, Trust X drawer, restricted node and escalation notice. |
| `/actions` | Implemented kanban board, action detail drawer and blocked missing-evidence state. |
| `/decisions` | Implemented ready, blocked and submitted/evidence-created states as a modal-style decision workflow surface. |
| Evidence preview overlay | Implemented V2-023 document preview drawer, V2-024 restricted record and V2-025 missing-evidence escalation as contextual workflow states. |

## Visuals Used

Client visuals used:

- V2-001 through V2-025 from `public/reference/visuals_v2/client/`
- Board context from `public/reference/wireframes_v2_boards/board-01` through `board-08`

All requested Phase 5 client visual files are present. No missing visual gaps were found.

## State Coverage

State coverage is documented in `docs/v2/CLIENT_EXPERIENCE_STATE_COVERAGE_V2.md`.

Highlights:

- `/mobile` includes default, blocked, empty and decision notification states.
- `/mobile/upload` includes select, extraction, low-confidence blocked, verification pending and retry states.
- `/portal` includes loading, error and permission blocked states.
- `/wealth-map` and the evidence preview overlay hide restricted details.
- `/actions` exposes blocked/missing evidence state.
- `/decisions` creates evidence/audit output after Accept/Defer/Reject.

## Permission Checks

Central helpers used:

- `evaluateClientVisibility()` from `lib/v2-model.ts`
- `evaluatePermission()` from `lib/v2-model.ts`
- wrappers in `lib/phase5-client-model.ts`

Covered checks:

- advisor approval alone does not release advice-like content;
- compliance release is required;
- evidence record is required;
- permission checks are required;
- restricted wealth-map node hides sensitive fields;
- restricted evidence preview state hides sensitive content;
- decision room blocks when permission is missing.

## Evidence / Audit Events

Central helpers used:

- `createEvidenceLink()`
- `createAuditEvent()`

Visible outputs:

- upload evidence placeholder;
- upload audit contract row;
- action evidence status;
- decision submitted audit event and evidence link;
- evidence preview drawer audit trail and workflow status;
- missing evidence escalation state.

## Tests Run

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm test` | Passed: 45 tests |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npm run test:e2e` | Passed: 8 route/source smoke tests |

Browser smoke:

- Used the existing local dev server on `http://localhost:3000`.
- Verified `/mobile`, `/mobile/upload`, `/portal`, `/wealth-map?focus=gaps`, `/actions`, `/decisions` and contextual evidence preview render their expected Phase 5 headings and primary UI regions.
- Verified `/mobile` recommendation blocked state shows the compliance-release block and does not reveal released recommendation details.
- Verified the evidence preview restricted record hides sensitive preview fields.

Additional boundary checks:

- Tests assert mobile routes do not import/use `WireframePhone`.
- Tests assert Phase visual IDs are not rendered in the Phase 5 client component.
- Tests assert the app shell has no global left demo sidebar or route inventory.
- Tests assert the decision route renders as a modal workflow surface, not a page with a decision-controls drawer.
- `AGENTS.md` now contains the permanent mandatory mobile interpretation rule.
- Browser checked `/mobile`, `/mobile?state=blocked`, `/mobile/upload`, and `/mobile/upload?state=low`; all had mobile content and no desktop app shell, phone-frame text, or visual ID text.
- Browser checked `/portal`, `/wealth-map?focus=gaps`, `/actions`, `/decisions`, contextual evidence preview and `/evidence` redirect behavior; all rendered app surfaces had no left demo sidebar, no global route inventory, and no Phase/V2/page-spec header text. Portal was additionally checked for the actual dashboard copy: `Overview` and `Visibility score is not advice`.

## Known Limitations

- The implementation remains mock/demo data only.
- No production API, persistence, auth or server-side policy enforcement is connected.
- `npm run test:e2e` is a lightweight route/source smoke suite because this repo does not include Playwright.
- Loading/error are fully modeled on `/portal`; other routes are static mock surfaces with state toggles rather than real fetch states.
- Internal workflow rebuild belongs to Phase 6 and was not expanded here.

## Readiness for Phase 6

Phase 6 can start. Phase 5 leaves the internal routes untouched except for links/stubs required by the client experience.
