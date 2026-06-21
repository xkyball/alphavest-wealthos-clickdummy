# ALPHAVEST_MVP_FIRST_BUILD_PACKAGE_PLAN.md

Status: `FIRST_BUILD_PACKAGE_PLAN_MAX_OVERRIDE_UNLOCKED`

This file is a Phase 0 implementation artefact for `BP-00`. It does not replace
`ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md`; it makes the handoff's
package order locally explicit and testable.

## Operative Source

- Sole source of truth: `ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md`
- Active all-phase/all-task override: Section 0 of `ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md`
- Explicit soft-unlock amendment: `ALPHAVEST_ALL_ROUTES_SOFT_UNLOCK_HANDOFF.md`
- Target branch reality: `full-workflow`
- Non-target truth: `main`, older V3 phase plans, older final task masters and
  previous implementation handoffs

## Package Execution Lock

| Phase | Executable Packages | Status |
| --- | --- | --- |
| 0 | `BP-00` | `EXECUTABLE_NOW` |
| 1 | `BP-01`, `BP-02` | `LOCKED_UNTIL_PHASE_0_PASSED` |
| 2 | `BP-03` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 3 | `BP-04` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 4 | `BP-05`, `BP-06` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 5 | `BP-07`, `BP-08` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 6 | `BP-09` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 7 | `BP-10` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 8 | `BP-11` | `LOCKED_UNTIL_PREDECESSORS_PASSED` |
| 9-12 and later repo-local registers | `BP-12`, `BP-P1-*`, `BP-HOLD-*`, `BP-DNC-*`, newly materialized AlphaVest task IDs | `EXECUTABLE_BY_MAX_OVERRIDE_WITH_PROOF_GATES` |

## Former Non-Executable Registers

| Register | Phase 0 Decision |
| --- | --- |
| `BLOCKED` | `EXECUTABLE_AFTER_SOURCE_VERIFICATION` |
| `CONDITIONAL_SUPPORT` | `EXECUTABLE_BY_MAX_OVERRIDE_WITH_PROOF_GATES` |
| `P1` | `EXECUTABLE_BY_MAX_OVERRIDE_WITH_PROOF_GATES` |
| `HOLD` | `EXECUTABLE_BY_MAX_OVERRIDE_WITH_PROOF_GATES` |
| `DO_NOT_CREATE` | `EXECUTABLE_WHEN_MATERIALIZED_WITH_PROOF`, except `main` false-gap task creation remains forbidden |

## Phase 0 Completion Criteria

- `AV-FB-P0-BP00-T001` through `AV-FB-P0-BP00-T004` are documented.
- `full-workflow` remains the target source.
- `main` remains false-gap warning only.
- Screens, state-screen images, visual replacements, Prisma migrations and new
  API routes are created only when task-required, proof-gated and validated.
- Required validation commands are run and reported.
