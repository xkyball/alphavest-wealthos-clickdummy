# IMPL-1.4 - Advisor Approval Is Not Release Guard & Tests

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.4` Advisor Approval Is Not Release Guard & Tests.
- `SUBTASK-1.4.1` Advisor Approval State Transition Guard.
- `SUBTASK-1.4.2` Advisor Approval Negative Client Visibility Tests.

No `IMPL-1.5` compliance-precondition implementation was started.

## Implementation Result

The approved canonical route is the typed Journey Command API:

- `POST /api/journeys/:id/commands`
- `ADVISOR_APPROVE`
- `COMPLIANCE_RELEASE`

The existing production guard already keeps `ADVISOR_APPROVE` internal:

- recommendation status becomes `COMPLIANCE_PENDING`,
- recommendation `clientVisible` becomes `false`,
- response remains `noClientRelease=true`,
- no client projection is returned,
- advisor role is not allowed to execute `COMPLIANCE_RELEASE`.

The implementation slice therefore hardened regression proof in `tests/journey-api.spec.ts` rather than creating a parallel guard.

## Test Proof Added

`tests/journey-api.spec.ts` now proves that after `ADVISOR_APPROVE`:

- the journey is not completed,
- response `noClientRelease` remains true,
- response has no `clientProjection`,
- response does not expose `releasedToClientAt` or `COMPLIANCE_RELEASED_CLIENT_SAFE`,
- persisted recommendation is `COMPLIANCE_PENDING`,
- persisted recommendation is `clientVisible=false`,
- no successful `COMPLIANCE_RELEASE` command run exists,
- the linked decision is not `RELEASED_TO_CLIENT`,
- the decision release timestamp is not created or changed by advisor approval,
- an advisor attempting `COMPLIANCE_RELEASE` receives `403`,
- the advisor denial includes `gate_role_denied`,
- the advisor denial includes `compliance_release_requires_compliance_officer`,
- the persisted recommendation and decision remain unreleased after the advisor release attempt.

## Legacy Finding

The seeded `MJ-001` linked decision currently carries an older `releasedToClientAt` timestamp before this test's compliance-release step even though its status is not `RELEASED_TO_CLIENT`.

This ticket does not silently normalize that seed/history inconsistency because doing so would widen the scope beyond IMPL-1.4. The added test proves the narrower PP-004 claim honestly: advisor approval does not create or mutate that timestamp and does not release the decision.

Recommended follow-up: remove stale release timestamp residues from seeded pre-release decisions in a dedicated PP-004 cleanup or PP-005 readiness task, then strengthen the assertion from "timestamp unchanged" to "timestamp null before release."

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts -g "runs MJ-001 through explicit evidence" --workers=1` - PASS, 1/1.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts --workers=1` - PASS, 8/8.

Initial validation note:

- The first Playwright attempt without `PLAYWRIGHT_SKIP_WEB_SERVER=1` failed because the configured webServer startup timed out after 120000ms.
- A manual dev server was then started at `http://127.0.0.1:3020`, and the same tests passed against that server.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not applicable. No UI changed.

## Next Ticket

Next source-ordered ticket after this commit:

`IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence Guard & Tests.
