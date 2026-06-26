# IMPL-1.7 - Audit Persistence for Approval, Block, Evidence Request and Release

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.7` Audit Persistence for Approval, Block, Evidence Request and Release.

No `IMPL-1.8` UX wording implementation was started.

## Implementation Result

The canonical Journey API now persists denied compliance-release audit proof before returning a fail-closed response.

Before this ticket, a denied release attempt created an audit ID inside the release transaction and then threw an error inside the same transaction. The throw rolled back the audit event even though the API response exposed the audit ID. That was a real audit-chain bug.

The release handler now:

- writes `journey.compliance.release_denied`,
- writes the corresponding `JourneyCommandRun`,
- returns the denied audit ID in the fail-closed error issues,
- then returns the fail-closed `400` response without mutating release state.

Successful release remains transactional and still returns `journey.compliance.released`.

## Test Proof Added

`tests/journey-api.spec.ts` now proves required audit fields for:

- denied compliance release before advisor approval,
- advisor approval,
- successful compliance release,
- compliance request evidence,
- compliance block.

Each covered audit assertion checks:

- `actorRoleKey`,
- `clientTenantId`,
- `eventType`,
- `platformTenantId`,
- `previousState`,
- `nextState`,
- `reason`,
- `result`,
- `targetId`,
- `targetType`,
- relevant metadata such as `recommendationId`, `clientVisible`, `gatePassed`, `noClientRelease`, `blockerCode` or missing preconditions.

Denied release proof now verifies the persisted audit row can be fetched from the audit ID returned in the error envelope.

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts --workers=1` - PASS, 8/8.

Validation context:

- Manual dev server was already running at `http://127.0.0.1:3020`.
- No UI changed.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not applicable. No UI changed.

## Next Ticket

Next source-ordered ticket after this commit:

`IMPL-1.8` UX Safety Wording and Action Hierarchy Overlay.
