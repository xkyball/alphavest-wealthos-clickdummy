# IMPL-1.9 - Demo Workflow / API Directness Boundary for Release Actions

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.9` Demo Workflow / API Directness Boundary for Release Actions.

No `QA-1.10` integrated validation or `DECISION-1.11` readiness decision was started.

## Implementation Result

Added an explicit PP004 release-proof directness contract so release-shaped API actions cannot be treated as equivalent proof.

The contract now separates:

- canonical PP004 proof route: `/api/journeys/[id]/commands`,
- typed advisor workflow compatibility route: `/api/recommendation-review-workflow`,
- legacy demo compatibility route: `/api/demo-workflow`.

## Release-Related Actions Classified

Legacy demo actions classified as `LEGACY_DEMO_COMPATIBILITY_ONLY` and not PP004 canonical proof:

- `j01.approveAdvisor`
- `j02.requestEvidence`
- `j02.confirmRequestEvidence`
- `j02.blockRelease`
- `j02.releaseClient`
- `j03.acceptOption`

Typed advisor workflow actions classified as `DOMAIN_BACKED_TYPED_COMPATIBILITY` and not PP004 canonical proof:

- `advisor_approve`
- `compliance_block`
- `compliance_release`
- `request_evidence`

## Code Changes

`lib/advisory-workflow-contract.ts`

- Added `wp05CanonicalJourneyCommandApiRoute`.
- Added directness classifications and helper functions for legacy demo release actions and typed advisor workflow actions.
- Added explicit fields for canonical proof eligibility and state/payload assertion requirements.

`app/api/demo-workflow/route.ts`

- Adds `proofDirectness` metadata to classified legacy demo responses.
- Keeps typed advisor workflow actions blocked from `/api/demo-workflow` and points callers to the moved typed workflow API.

`lib/recommendation-review-workflow-api.ts`

- Adds `proofDirectness` metadata to typed advisor workflow responses.
- Points malformed/non-typed recommendation-review payloads toward the canonical journey command route instead of the legacy demo route.

## Test Proof Added

`tests/demo-workflow-validation.spec.ts`

- Proves every release-related legacy demo action is classified.
- Proves typed advisor workflow release actions are compatibility proof only and require state/payload-backed assertions.

`tests/demo-workflow-api.spec.ts`

- Proves legacy demo responses for classified release-shaped actions expose non-canonical proof metadata.
- Proves typed compatibility release responses expose state/payload-backed compatibility metadata.
- Proves legacy client acceptance after release is not PP004 compliance-release proof.

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-validation.spec.ts tests/demo-workflow-api.spec.ts --workers=1` - PASS, 21/21.
- `pnpm guard:source` - PASS after implementation.
- `pnpm exec tsc --noEmit` - PASS after implementation.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-validation.spec.ts tests/demo-workflow-api.spec.ts --workers=1` - PASS, 21/21 after terminology correction.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not produced. This ticket changed API/proof metadata and tests, not UI.

## Next Ticket

Next source-ordered ticket after this commit:

`QA-1.10` Integrated Validation and Evidence Package.
