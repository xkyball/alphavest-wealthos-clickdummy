# Process Runtime Release Preconditions

Date: 2026-06-28

## Slice

Process Runtime Release Preconditions: Recommendation, Advisor Approval and Compliance Release are no longer accepted as indirect typed-workflow compatibility proof. Compliance release now requires linked `ProcessInstance` and `ProcessStepInstance` state.

## Implementation

- Added `processRuntime` as a required `ReleaseSpineInput` precondition.
- `ReleaseSpine.canRelease` now fails closed unless:
  - a process instance is linked;
  - advisor approval process step is satisfied;
  - compliance release process step is active.
- Wired advisor approval to complete `BP-054-S03`.
- Wired compliance release to complete `BP-063-S03`.
- Wrote process audit rows and `ProcessCommandRun` entries for those step transitions.
- Changed proof directness for `advisor_approve` and `compliance_release` from `DOMAIN_BACKED_TYPED_COMPATIBILITY` to `CANONICAL_TYPED_PROCESS_COMMAND`.
- Seeded process runtime instances, steps, object links and command history per demo tenant instead of keeping the old Bennett-only process universe.

## Files Changed

- `lib/release-spine-command-surface.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/advisory-workflow-contract.ts`
- `prisma/seed.ts`
- `tests/release-spine-command-surface.spec.ts`
- `tests/process-runtime-db-api.spec.ts`
- `tests/recommendation-review-workflow-api.spec.ts`

## Validation

Passed:

- `pnpm guard:source`
- `pnpm exec tsc --noEmit --pretty false`
- `pnpm db:seed`
- `pnpm playwright test tests/release-spine-command-surface.spec.ts tests/process-runtime-db-api.spec.ts --workers=1`
- `pnpm playwright test tests/recommendation-review-workflow-api.spec.ts --workers=1`
- `pnpm db:validate`

DB proof after seed:

- `processDefinitions`: 84
- `processInstances`: 336
- Summit:
  - `BP-054-S03`: `COMPLETED`
  - `BP-063-S03`: `ACTIVE`
- Northbridge:
  - `BP-054-S03`: `ACTIVE`
  - `BP-063-S03`: `ACTIVE`

Checked but failed outside this slice:

- `pnpm test:route-smoke`
- Result: 166 passed, 34 failed.
- Failure pattern: missing UI contract selectors/copy for existing hub, governance, compliance decision-room, advisor queue and export redaction routes.
- These failures are not caused by the Process Runtime Release Preconditions implementation and should not be papered over by backend compatibility fields.

Checked but failed outside this slice:

- `pnpm lint`
- Failure pattern: pre-existing UI lint errors in `components/client-intake-screen.tsx` and `components/decisions-governance-screen.tsx`.

## Negative Acceptance

- Release no longer passes solely because advisor/compliance typed workflow fields are green.
- Missing `ProcessObjectLink` or wrong `ProcessStepInstance` state produces process runtime blockers in release preconditions.
- Advisor approval remains not a compliance release.
- Compliance release remains not client acceptance.

## Recommendation

Next hard slice should attack the route-smoke red cluster directly as a UI runtime contract cleanup:

1. Replace stale route-smoke expectations with process-first UI contracts where the policy has moved.
2. For still-valid expectations, implement the missing route surfaces instead of adding placeholder panels.
3. Start with `/compliance/reviews/demo/decision-room`, `/advisor/reviews/demo`, `/export/demo/redaction`, and governance hub/detail surfaces, because these dominate the failed selector/copy pattern.

No screenshot was produced because this slice changed DB/service/runtime/test contracts, not visible UI.
