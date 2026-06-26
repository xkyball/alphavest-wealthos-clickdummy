# Phase B/C Typed Journey Command Migration Execution Report

Date: 2026-06-26
Branch: full-workflow

## Ticket

Migrate the remaining product-like Phase B/C demo-only actions family-by-family into typed journey commands, then remove `runScreencastDemoAction` from product-like screens.

Executed slice:

- `j12.*` KYC / source-of-wealth
- `j13.*` suitability profile
- `j14.*` IPS mandate

## Implementation

Changed files:

- `lib/journeys/journey-command-registry.ts`
- `lib/journeys/journey-api-service.ts`
- `lib/demo-workflow-action-registry.ts`
- `lib/phase-b-c-journey-command-client.ts`
- `app/api/demo-workflow/route.ts`
- `components/kyc-aml-workflow-screen.tsx`
- `components/suitability-ips-screen.tsx`
- `lib/capture-screen-model-context.ts`
- `tests/demo-workflow-action-registry.spec.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/phase-b-c-journey-command-api.spec.ts`

## Result

Positive acceptance:

- Phase B/C actions now have typed Journey Command IDs:
  - `KYC_REQUEST_EVIDENCE`
  - `KYC_COMPLETE_REVIEW`
  - `SOURCE_OF_WEALTH_ESCALATE`
  - `SOURCE_OF_WEALTH_LINK_EVIDENCE`
  - `SUITABILITY_REQUEST_EVIDENCE`
  - `SUITABILITY_MARK_REVIEWED`
  - `IPS_REQUEST_MANDATE_CHANGES`
  - `IPS_LINK_EVIDENCE`
- `/api/journeys/[id]/commands` executes the Phase B/C commands with audit events, `JourneyCommandRun` rows, evidence records/items and no client release.
- `components/kyc-aml-workflow-screen.tsx` and `components/suitability-ips-screen.tsx` no longer call `runScreencastDemoAction`.
- `lib/phase-b-c-journey-command-client.ts` creates or reuses a Morgan `MJ-003` Journey instance through authenticated demo API calls and then posts typed commands.
- The capture/model context now points reports at the typed Journey Command surface instead of treating J12/J13/J14 as demo-workflow proof.

Negative acceptance:

- `/api/demo-workflow` now returns `410` for `j12.*`, `j13.*` and `j14.*` with canonical route `/api/journeys/[id]/commands`.
- Client-scoped Morgan users are blocked from executing the internal Phase B/C commands through the typed Journey API.

## Validation

Passed:

- `pnpm guard:source`
- `pnpm typecheck`
- focused ESLint on changed implementation and test files
- `pnpm playwright test tests/demo-workflow-api.spec.ts --grep "legacy demo workflow retires Phase B/C|moves typed product command families"`
- `pnpm playwright test tests/demo-workflow-action-registry.spec.ts tests/phase-b-c-journey-command-api.spec.ts`

One first Playwright run hit `EADDRINUSE` on port `3020`; the same suite passed on rerun.

## Screenshot

No screenshot was produced. This slice changed command wiring and behavior but did not intentionally change visible layout or styling.

## Next Recommendation

Continue the same deletion-first migration with the admin/governance family next:

- `j06.*` tenant setup
- `j07.*` user/role/access governance

Recommendation: do not create another broad compatibility adapter. Create typed tenant-governance command IDs, move the screen clients to that API, then retire the matching `/api/demo-workflow` actions with the same 410 boundary pattern.
