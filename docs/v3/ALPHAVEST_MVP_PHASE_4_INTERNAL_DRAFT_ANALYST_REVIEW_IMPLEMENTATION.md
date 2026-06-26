# AlphaVest MVP Phase 4 - Internal Draft / Analyst Review / AI Internal-Only Implementation

Date: 2026-06-20

## Source

Implementation executed from `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`, Phase 4:

- Purpose: represent AI/rules draft as internal preparation only and enforce analyst unsupported-claim rejection/rebuild with evidence.
- Exit gate: no AI draft/internal rationale appears in client/API/export payloads.
- Tasks covered: `AV-MVP-P4-T001` through `AV-MVP-P4-T005`.

## Implemented Behavior

- Added first-class typed `/api/demo-workflow` recommendation-review actions:
  - `reject_unsupported_claim`
  - `rebuild_with_evidence`
- Analyst unsupported-claim rejection now persists:
  - `RecommendationStatus.REVISION_REQUESTED`
  - `ReviewStatus.REQUEST_MORE_DATA`
  - `ComplianceStatus.NEEDS_EVIDENCE`
  - `EvidenceStatus.PLACEHOLDER`
  - `VisibilityStatus.COMPLIANCE_VISIBLE`
  - `AuditResult.BLOCKED`
- Evidence-backed rebuild now requires at least one accepted evidence record with `EvidenceStatus.VALIDATED` or `EvidenceStatus.RELEASED`.
- Rebuild with placeholder/missing evidence fails closed with no mutation and no client release.
- Successful rebuild persists an internal evidence link via `EvidenceItem.itemType = internal_draft_rebuild`.
- Successful rebuild returns the recommendation to `ANALYST_REVIEWED`, keeps `clientVisible = false`, and leaves `advisor_approval` and `compliance_release` as missing gates.
- Client/export redaction tests now include a Phase 4 evidence-backed internal rebuild payload.

## Changed Files

- `lib/demo-workflow-validation.ts`
- `lib/typed-workflow-command-bus.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/client-visibility-proof.spec.ts`
- `docs/v3/ALPHAVEST_MVP_PHASE_4_INTERNAL_DRAFT_ANALYST_REVIEW_IMPLEMENTATION.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

## Tests Run

- `pnpm typecheck` - passed.
- `pnpm exec playwright test tests/client-visibility-proof.spec.ts` - passed, 6 tests.
- `pnpm exec playwright test tests/demo-workflow-api.spec.ts --grep "typed recommendation review workflow"` - first attempt failed from a Playwright dev-server port collision caused by parallel execution; rerun by itself passed, 8 tests.

## Not Implemented

- No schema migration.
- No production AI integration.
- No generalized draft-generation API beyond the bounded typed demo workflow.
- No product UI changes.
- No advisor approval, compliance release, export generation or client visibility unlock beyond pre-existing Phase 5/6 paths.

## Capability Level

Phase 4 reaches bounded E7 demo proof for the typed recommendation-review internal draft lifecycle: typed payload validation, role/permission gate, persisted recommendation/review/evidence/audit mutation, reload proof, positive path, negative path and client/export redaction proof.

It does not claim production AI drafting, binary export readiness, generalized arbitrary-payload draft review or full advisor/compliance release completion.

## Residual Risks

- The implementation is intentionally scoped to the demo recommendation-review workflow and seeded evidence records.
- Evidence acceptance uses existing `VALIDATED`/`RELEASED` evidence statuses; it does not create a new evidence sufficiency model.
- Visual routes listed in the phase plan were not changed, so no new screenshot proof was produced for this phase.
