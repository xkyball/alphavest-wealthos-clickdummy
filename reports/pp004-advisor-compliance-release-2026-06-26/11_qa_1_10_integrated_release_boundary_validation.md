# QA-1.10 - PP-004 Integrated P0 Release Boundary Validation

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Validated this ticket only:

- `QA-1.10` PP-004 Integrated P0 Release Boundary Validation.

No `DECISION-1.11` PP-005 readiness decision was made in this ticket.

## Validation Categories

| Category | Result | Evidence |
| --- | --- | --- |
| Advisor approval positive path | PASS | `tests/journey-api.spec.ts`, `tests/demo-workflow-api.spec.ts` |
| Advisor-not-release negative path | PASS | `tests/journey-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/permission-engine.spec.ts` |
| Compliance release happy path | PASS | `tests/journey-api.spec.ts`, `tests/demo-workflow-api.spec.ts` |
| Missing-precondition release denial | PASS | `tests/journey-api.spec.ts`, `tests/workflow-gate.spec.ts` |
| Block/request evidence non-release | PASS | `tests/journey-api.spec.ts`, `tests/demo-workflow-api.spec.ts` |
| Client portal/mobile fail-closed behavior | PASS | `tests/journey-ui.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts` |
| Audit persistence for critical actions | PASS | `tests/journey-api.spec.ts`, `tests/demo-workflow-api.spec.ts`, `tests/permission-engine.spec.ts` |
| UX wording no-overclaim review | PASS | `tests/journey-ui.spec.ts`, `tests/scf-p04-p06-flow-ui.spec.ts` |
| Demo/API directness claim control | PASS | `tests/demo-workflow-validation.spec.ts`, `tests/demo-workflow-api.spec.ts` |
| PP-001 payload visibility regression | PASS | `tests/pp001-payload-visibility-contract.spec.ts`, `tests/pp001-payload-negative.spec.ts` |
| PP-002 evidence sufficiency regression | PASS | `tests/pp002-evidence-sufficiency-canonical.spec.ts`, `tests/workflow-gate.spec.ts` |
| PP-003 advice boundary regression | PASS | `tests/pp003-advice-boundary-contract.spec.ts` |

## Commands Run

- `pnpm guard:source` - PASS before QA.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts tests/journey-spine.spec.ts tests/journey-ui.spec.ts tests/scf-p04-p06-flow-ui.spec.ts tests/demo-workflow-validation.spec.ts tests/demo-workflow-api.spec.ts tests/pp001-payload-visibility-contract.spec.ts tests/pp001-payload-negative.spec.ts tests/pp002-evidence-sufficiency-canonical.spec.ts tests/pp003-advice-boundary-contract.spec.ts tests/workflow-gate.spec.ts tests/permission-engine.spec.ts tests/client-visibility-projection.spec.ts tests/client-visibility-proof.spec.ts --workers=1` - PASS, 92/92.
- `pnpm phase:check` - PASS.

## `phase:check` Notes

`pnpm phase:check` completed successfully through:

- typecheck,
- lint,
- Prisma schema validation,
- production build.

Non-blocking warnings observed:

- 22 existing ESLint unused-symbol warnings across unrelated UI/screens/scripts.
- Turbopack warned that `lib/document-storage-adapter.ts` dynamic storage path tracing is broad.
- Turbopack warned that `next.config.mjs` appeared in an unexpected NFT trace through the document upload route.

These warnings did not fail the command and were not introduced by PP-004 QA. They remain regression risk worth addressing in a cleanup lane because broad build tracing is avoidable technical debt.

## Deviations and Findings

No PP-004 blocker found.

Findings:

- The broad build/lint warning set remains non-blocking but noisy.
- `next-env.d.ts` changed during `pnpm phase:check` from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`; this generated churn was restored before the report commit.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not produced. This ticket validated API, contract, safety and route assertion evidence. No new UI change was made.

## PP-005 Readiness Input

QA result supports starting `DECISION-1.11` with this recommendation:

Proceed toward PP-005 only if PP-005 treats `/api/journeys/[id]/commands` as the canonical release proof source and refuses to inherit `/api/demo-workflow` as release authority.
