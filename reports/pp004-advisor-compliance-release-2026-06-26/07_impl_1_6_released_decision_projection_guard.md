# IMPL-1.6 - Released Decision Record and Client Visibility Projection Guard & Tests

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.6` Released Decision Record and Client Visibility Projection Guard & Tests.
- `SUBTASK-1.6.1` Released Decision Projection Contract.
- `SUBTASK-1.6.2` Client Portal/Mobile Fail-Closed Tests.

No `IMPL-1.7` audit-persistence expansion was started.

## Implementation Result

The Journey client projection now has one explicit client-safe release field:

- `projection.releasedSummary`

This field is populated only when:

- the journey runtime is `COMPLETED`, and
- the persisted core gate metadata has `complianceReleased=true`, and
- the persisted core gate metadata contains a string `clientSafeSummary`.

Before valid compliance release, the field is absent.

The released projection also uses that same client-safe summary as the `nextAction.detail`, so client-facing surfaces do not need to infer release text from internal workflow metadata.

## Code Changes

Changed files:

- `lib/journeys/journey-state-machine.ts`
- `lib/journeys/journey-orchestrator.ts`
- `lib/journeys/journey-api-service.ts`
- `tests/journey-api.spec.ts`
- `tests/journey-spine.spec.ts`

The implementation keeps internal payloads out of the client projection and does not add object links, blocker reasons, evidence requirements, internal rationale or compliance notes to client responses.

## Test Proof Added

`tests/journey-api.spec.ts` now proves:

- advisor-approved-only / compliance-pending projection is not complete,
- advisor-approved-only projection has no `releasedSummary`,
- advisor-approved-only projection has `internalPayloadReturned=false`,
- advisor-approved-only projection contains no internal rationale, object links, compliance notes, release timestamp or release-state token,
- released projection returns `projection.status=COMPLETE`,
- released projection returns only the compliance-approved client-safe summary as `releasedSummary`,
- released projection uses the same summary as `nextAction.detail`,
- released projection contains no internal rationale, object links, compliance notes, client summary draft or AI draft,
- evidence-needed projection stays `BLOCKED`,
- evidence-needed projection has no `releasedSummary`,
- blocked projection stays `BLOCKED`,
- blocked projection has no `releasedSummary`,
- blocked/evidence-needed projections report `internalPayloadReturned=false` and contain no internal payload fields.

`tests/journey-spine.spec.ts` now proves the projection helper itself:

- keeps blocked internal state details off client projection,
- exposes `releasedSummary` only on a completed runtime with explicit `clientSafeSummary`,
- keeps object links and blocker reasons out of released client projection.

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts tests/journey-spine.spec.ts --workers=1` - PASS, 12/12.

Validation context:

- Manual dev server was already running at `http://127.0.0.1:3020`.
- No UI changed.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not applicable. No UI changed.

## Next Ticket

Next source-ordered ticket after this commit:

`IMPL-1.7` Audit Persistence for Approval, Block, Evidence Request and Release.
