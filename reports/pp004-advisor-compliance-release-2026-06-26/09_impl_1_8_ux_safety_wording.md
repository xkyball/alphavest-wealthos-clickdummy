# IMPL-1.8 - UX Safety Wording and Action Hierarchy Overlay

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.8` UX Safety Wording and Action Hierarchy Overlay.

No `IMPL-1.9` demo-workflow/API-directness implementation was started.

## Implementation Result

Updated UI wording and action hierarchy so users cannot reasonably confuse:

- advisor approval with compliance release,
- compliance release with client acceptance,
- block/request-evidence with release,
- client projection preview with release execution.

## UI Changes

Journey detail:

- Client projection preview now says released summary appears only after compliance release.
- Client projection preview now renders either:
  - `Released client-safe summary: ...` after valid compliance release, or
  - `Released summary held until compliance release succeeds.` before release.
- Available action copy now says command acceptance never equals compliance release, client acceptance or advice execution.

Advisor detail:

- Advisor action label changed from `Approve as advisor` to `Approve for compliance review`.
- Existing advisor status copy continues to state that no client visibility, export, release or client acceptance is created.

Compliance sensitive actions:

- Compliance block label changed to `Block client release`.
- Compliance block title changed to `Confirm Compliance Block - No Client Release`.
- Compliance block description now states it is not client acceptance.
- Request evidence label changed to `Request evidence, keep release blocked`.
- Request evidence title changed to `Confirm Evidence Request - No Client Release`.
- Request evidence description now states client release and client visibility remain blocked.

## Test Proof Added

`tests/journey-ui.spec.ts` now asserts the updated no-overclaim command wording and release-summary held copy.

`tests/scf-p04-p06-flow-ui.spec.ts` now asserts the advisor action label `Approve for compliance review`.

## Screenshot Proof

Screenshot produced by UI validation:

- `artifacts/screenshots/wave02-journey-detail.png`

The screenshot shows the Journey Detail client projection panel with the new released-summary gating copy.

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-ui.spec.ts tests/scf-p04-p06-flow-ui.spec.ts --workers=1` - PASS, 6/6.

Validation context:

- Manual dev server was already running at `http://127.0.0.1:3020`.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Produced.

## Next Ticket

Next source-ordered ticket after this commit:

`IMPL-1.9` Demo Workflow / API Directness Boundary for Release Actions.
