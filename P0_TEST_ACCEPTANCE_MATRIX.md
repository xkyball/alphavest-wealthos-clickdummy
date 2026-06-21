# P0_TEST_ACCEPTANCE_MATRIX.md

Status: `P0_ACCEPTANCE_PRECHECK_LOCKED`

This Phase 0 artefact maps the First Build P0 acceptance obligation without
claiming that the full P0 suite has passed.

## Phase 0 Scope

Phase 0 proves only source discipline:

- full-workflow target lock
- main false-gap block
- no screen generation
- no schema migration
- no new API by default
- no overclaim from route/API/schema/test presence
- non-task registers remain blocked

## Required Phase 0 Negative Proof

| Gate | Required Proof |
| --- | --- |
| `P0-NEG-011` | Held routes remain held and are not promoted into MVP scope. |
| `P0-NEG-012` | main-derived absence claims do not become target gaps or tasks. |
| `P0_HOLD_ROUTE_BLOCK_GATE` | Routes `064`-`067` and `069`-`071` remain non-executable unless later unlocked. |

## Required Later Proof

Later phases must add or rerun package-specific positive and negative tests.
Existing test success is a proof slice only; it is not full MVP acceptance.
