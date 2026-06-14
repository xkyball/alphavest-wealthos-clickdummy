# Phase 7 Implementation Plan

Date: 2026-06-14

## Scope

Phase 7 centralizes governance, permissions, workflow state, evidence, audit and client-visibility gates.

## Inputs Read

- `AGENTS.md`
- `CODEX_TASK_MASTER_V2.md`
- `docs/v2/VISUAL_INTERPRETATION_RULES_V2.md`
- `docs/v2/PERMISSION_MATRIX_V2.md`
- `docs/v2/STATE_MACHINES_V2.md`
- `docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md`
- `docs/v2/SCREEN_STATE_INVENTORY_V2.md`
- `docs/v2/QUALITY_GATES_V2.md`
- `docs/v2/TEST_PLAN_V2.md`
- `docs/v2/PHASE_5_QA_REPORT.md`
- Phase 7 governance and state visual assets

## Pre-flight Gap

`docs/v2/PHASE_6_QA_REPORT.md` was requested but is not present in the repository. Phase 7 proceeds with this documented as a QA input gap.

## Implementation Steps

1. Add central role and permission helpers.
2. Add central state machine and status label helpers.
3. Add evidence and audit event helpers.
4. Add the no-unapproved-advice gate helper.
5. Replace `/governance` with a Phase 7 governance surface for matrix, role detail, second confirmation, blocked state and audit history.
6. Retrofit Phase 5 client helpers to use the central advice gate and event helpers.
7. Add tests for permissions, sensitive confirmation, client visibility, evidence/audit and invalid transitions.
8. Run build, lint and test commands and record results.

## Visual Interpretation

V2-038 through V2-042 are implemented as the actual governance admin screen, drawer, modal, blocked state and audit panel. V2-043, V2-054, V2-055 and V2-056 are reference-only inputs translated into helper logic, status labels, tests and documentation.
