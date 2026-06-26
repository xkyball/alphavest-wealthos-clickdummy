# DECISION-1.11 - PP-005 Readiness Gate after PP-004

Generated: 2026-06-26

Status: `NEEDS_HUMAN_DECISION`

Source ticket: `DECISION-1.11`

## Decision Required

Choose one:

1. `APPROVE_PP005_CANONICAL_RELEASE_OUTPUTS_ONLY`
2. `APPROVE_PP005_TESTS_ONLY_PREP`
3. `BLOCK_PP005_PENDING_RELEASE_AUTHORITY_CLEANUP`

## Recommendation

Recommend: `APPROVE_PP005_CANONICAL_RELEASE_OUTPUTS_ONLY`

This is the strongest useful move because it turns PP-004 from a local proof pack into a real anti-legacy boundary for PP-005:

- PP-005 may consume canonical release facts only from `/api/journeys/[id]/commands`.
- PP-005 may consume client-visible content only from released client-safe projections.
- PP-005 must treat `/api/demo-workflow` as compatibility/demo history, never as export release authority.
- PP-005 must treat `/api/recommendation-review-workflow` as typed compatibility proof only, not as the canonical PP-005 source of release truth.
- PP-005 must use PP-001/PP-002/PP-003/PP-004 contracts instead of inventing new meanings for released, redacted, forbidden payload, evidence sufficiency or client acceptance.

## PP-004 Outputs PP-005 May Use If Approved

- `PP-001` payload visibility matrices from `tests/pp001-payload-visibility-contract.spec.ts` and `tests/pp001-payload-negative.spec.ts`.
- `PP-002` canonical evidence sufficiency behavior from `tests/pp002-evidence-sufficiency-canonical.spec.ts` and `tests/workflow-gate.spec.ts`.
- `PP-003` advice boundary classifications from `tests/pp003-advice-boundary-contract.spec.ts`.
- PP-004 canonical command behavior from `tests/journey-api.spec.ts`.
- PP-004 released client-safe projection behavior from `tests/journey-api.spec.ts`, `tests/client-visibility-projection.spec.ts` and `tests/client-visibility-proof.spec.ts`.
- PP-004 audit persistence expectations for approval, denied release, block, request evidence and release.
- PP-004 no-overclaim UI wording assertions from `tests/journey-ui.spec.ts` and `tests/scf-p04-p06-flow-ui.spec.ts`.
- PP-004 API directness classification from `lib/advisory-workflow-contract.ts`.

## PP-005 Must Not Use

- Legacy `/api/demo-workflow` release-shaped actions as proof of compliance release.
- Advisor approval as client visibility, release, export approval, download/share approval or client acceptance.
- Client decision/acceptance as proof that compliance release preconditions were met.
- Upload success as evidence sufficiency.
- Internal AI draft, internal rationale, compliance notes or unreleased evidence in export payloads.
- Any new PP-005-specific definition of `released`, `client-safe`, `forbidden internal payload`, `evidence sufficient` or `client accepted`.

## Carry-Forward Blockers

No PP-004 blocker remains after QA-1.10.

Carry-forward non-blocking risks:

- Existing unused-symbol lint warnings should be removed in a cleanup lane because they add noise to safety-critical QA.
- Existing Turbopack broad file tracing through `lib/document-storage-adapter.ts` should be tightened before export/document packaging becomes central in PP-005.
- PP-005 must not start implementation until this decision gate is explicitly approved.

## Option 2 Impact

`APPROVE_PP005_TESTS_ONLY_PREP` would allow only PP-005 test planning and proof scaffolding.

This is safer than implementation, but weaker than option 1 because it lets demo-route ambiguity survive longer and delays the cleanup payoff from PP-004.

## Option 3 Impact

`BLOCK_PP005_PENDING_RELEASE_AUTHORITY_CLEANUP` should be chosen only if you want the legacy demo workflow release-shaped actions removed or made hard-410 before PP-005 begins.

This is the most radical legacy-removal path, but it may disrupt screencast/demo compatibility unless a replacement journey-command demo driver is built first.

## Stop Condition

Execution stops here until the human decision is made.

No PP-005 task has been started.
