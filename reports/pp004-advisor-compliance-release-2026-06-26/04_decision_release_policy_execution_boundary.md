# DECISION-1.3 - PP-004 Release Policy and Execution Boundary Approval

Generated: 2026-06-26

Status: `NEEDS_HUMAN_DECISION`

Source ticket: `DECISION-1.3`

## Decision Required

Choose one:

1. `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`
2. `APPROVE_WITH_LIMITS_TESTS_ONLY_FIRST`
3. `BLOCK_PP004_PENDING_RELEASE_POLICY_REWORK`

## Recommendation

Recommend: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

This is the boldest clean path. It removes the old ambiguity instead of wrapping more copy around it:

- PP-004 canonical proof path becomes typed journey commands, not the legacy demo-workflow bus.
- PP-004 consumes PP003 lifecycle and redaction contracts directly.
- Release-spine and workflow-gate remain the only release-precondition vocabulary.
- Legacy/P44 evidence stays quarantined unless adapted to PP002 canonical sufficiency.
- Export approval remains PP-005, not a side effect of compliance release.

## What This Approval Would Authorize

If approved, implementation tickets may proceed one by one in source order:

1. `IMPL-1.4` Advisor Approval Is Not Release Guard & Tests.
2. `IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence Guard & Tests.
3. `IMPL-1.6` Released Decision Record and Client Visibility Projection Guard & Tests.
4. `IMPL-1.7` Audit Persistence for Approval, Block, Evidence Request and Release.
5. `IMPL-1.8` UX Safety Wording and Action Hierarchy Overlay.
6. `IMPL-1.9` Demo Workflow / API Directness Boundary for Release Actions.

## Approved Boundary If Option 1 Is Chosen

Implementation may:

- add/harden PP004-focused tests around typed journey commands;
- harden existing typed journey command paths if a failing PP004 test exposes a real gap;
- add denied release audit assertions;
- add no-overclaim wording tests and screenshots if UI copy changes;
- classify demo-workflow compatibility actions as non-canonical PP004 proof.

Implementation may not:

- add new release APIs without a separate decision;
- alter Prisma schema without a separate schema decision;
- broaden client-visible fields;
- treat advisor approval as release;
- treat release as export approval/download/share;
- treat release as client acceptance;
- support legacy/P44 evidence as release proof by default.

## Why Option 2 Is Weaker

`APPROVE_WITH_LIMITS_TESTS_ONLY_FIRST` is safe but risks preserving old ambiguity. It would allow only tests/reporting first, delaying cleanup of demo/API directness if tests uncover that the legacy path is still confusing.

Use it only if you want the next slice to be zero-delta unless a test fails.

## Why Option 3 Would Block

`BLOCK_PP004_PENDING_RELEASE_POLICY_REWORK` is appropriate only if the canonical precondition list in `03_spec_advisor_compliance_release_contract.md` is wrong or too narrow.

## Stop Condition

Per the upload and your instruction, execution stops here until this decision is approved. No PP-004 implementation ticket has been started.
