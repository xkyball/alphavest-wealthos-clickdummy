# DECISION-1.3 - PP-005 Export Policy and Execution Boundary Approval

Generated: 2026-06-26

Status: `APPROVED`

Source ticket: `DECISION-1.3`

## Gate

The uploaded PP-005 architecture requires human approval before IMPL-1.4 through IMPL-1.9.

DECISION-1.0, ANALYSIS-1.1 and SPEC-1.2 are complete in this report slice. The human has approved Option A, so IMPL-1.4 through IMPL-1.9 may proceed as zero-delta-first revalidation with narrow patches only for proven gaps.

## Approved Decision

Approved by human:

`I approve PP005 Option A: use /api/export-workflow and lib/export-workflow-command-service.ts as the only PP005 export command authority; keep /api/demo-workflow export paths compatibility/demo-only; keep MVP export routes 054-058 only; add no new API, no schema migration and no real binary export in this wave; execute IMPL-1.4 through IMPL-1.9 as zero-delta-first revalidation, patching only proven gaps in scope/redaction/lifecycle/audit/wording/directness proof.`

Approval date: 2026-06-26

## Recommended Decision

Recommend: `APPROVE_PP005_OPTION_A_CANONICAL_COMMAND_SPINE_ZERO_DELTA_FIRST`

This is the boldest sensible cleanup path that removes legacy ambiguity without pretending a broader export product exists.

## Options

### Option A - Approve canonical command spine, zero-delta first

Decision text:

`I approve PP005 Option A: use /api/export-workflow and lib/export-workflow-command-service.ts as the only PP005 export command authority; keep /api/demo-workflow export paths compatibility/demo-only; keep MVP export routes 054-058 only; add no new API, no schema migration and no real binary export in this wave; execute IMPL-1.4 through IMPL-1.9 as zero-delta-first revalidation, patching only proven gaps in scope/redaction/lifecycle/audit/wording/directness proof.`

Impact:

- Clears implementation.
- Keeps the current command spine as authority.
- Lets Codex remove/mark legacy ambiguity instead of adding wrappers.
- Preserves safety and avoids broad schema/API churn.

### Option B - Approve tests/spec only

Decision text:

`I approve PP005 Option B: execute only additional PP005 tests, reports and proof scaffolding; no product-code changes unless a targeted test fails and I approve the fix.`

Impact:

- Safest operationally.
- Slower debt removal.
- Demo-workflow ambiguity remains longer.

### Option C - Block PP-005 until legacy demo export branches are removed or hard-retired

Decision text:

`I choose PP005 Option C: block PP005 implementation until legacy /api/demo-workflow export-shaped actions are removed, hard-retired, or redirected behind /api/export-workflow with replacement screencast/demo compatibility.`

Impact:

- Most aggressive debt removal.
- Highest chance of breaking existing demo/screencast compatibility.
- Best long-term architecture if you are willing to pay the migration cost now.

## Strong Recommendation

Choose Option A now.

It is the best risk/reward move because it uses the already-approved PP-005 canonical release boundary and the already-existing export command spine. It avoids new schema/API/binary-export scope, but still forces every implementation ticket to prove the canonical path and demote legacy/demo proof families. Option C is architecturally attractive, but it is a separate migration and should not be smuggled into PP-005 unless breaking demo compatibility is acceptable today.

## Stop Condition

Decision gate is complete.

Next ticket in uploaded order: `IMPL-1.4`.
