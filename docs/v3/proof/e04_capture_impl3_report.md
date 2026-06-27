# E04 IMPL-E04-3 Capture Variant Normalization Report

## Ticket

`IMPL-E04-3: Normalize base-vs-overlay capture variants in UI states`

## Implementation

- Added canonical capture variant types and `uxCaptureVariantForFileKind(...)` to `lib/ux-lifecycle-state-contract.ts`.
- Rewired `scripts/capture-routes-and-modals.ts` so screenshot filenames, runtime overlay metadata and the generated capture index project capture variants from the canonical lifecycle contract.
- Kept confirmation captures distinct from generic modal captures when the state label carries confirmation semantics.
- Extended E04 contract coverage in `tests/ux-lifecycle-state-contract.spec.ts` and `tests/capture-routes-and-modals-contract.spec.ts`.

## Acceptance

Positive:

- Base route screenshots now project `base`.
- Modal screenshots now project `modal`.
- Drawer screenshots now project `drawer`.
- Confirmation modal screenshots now project `confirmation`.
- Capture index output exposes the normalized capture variant beside each state.

Negative:

- No new routes, screens, schemas, APIs, RBAC rules or backend persistence were introduced.
- No generated screen/image/state-screen artifacts were created.
- No visible application UI changed; screenshot evidence is therefore not warranted for this implementation ticket.

## Validation

- `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-lifecycle-state-contract.spec.ts tests/capture-routes-and-modals-contract.spec.ts` — PASS, 14 passed.
- `./node_modules/.bin/tsc --noEmit` — PASS.
- `./node_modules/.bin/tsx scripts/source-target-guard.ts` — PASS.

## Completion

`IMPL-E04-3` is complete.
