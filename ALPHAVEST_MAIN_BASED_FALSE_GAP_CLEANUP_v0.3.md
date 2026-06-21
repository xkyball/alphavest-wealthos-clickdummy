# ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md

Status: `MAIN_FALSE_GAP_BLOCKED_FOR_FIRST_BUILD`

This Phase 0 register implements `P0-NEG-012`. It prevents old absence claims
from `main`, old snapshots, older V3 phase plans or previous handoffs from
becoming First Build implementation tasks.

## Rule

`full-workflow` is the target code reality. `main` is false-gap only and must
never become target truth for this First Build.

## Rejection Matrix

| Input Claim | Phase 0 Treatment | Required Result |
| --- | --- | --- |
| Missing in `main` | False-gap warning only | `DO_NOT_CREATE_TASK` |
| Present in old V3 phase plan | Historical reference only | Check handoff before acting |
| Present in old final task master | Historical reference only | No execution authority |
| Missing in old snapshot | Stale evidence only | Verify `full-workflow` |
| Missing in current `full-workflow` target area | Source drift | `STOP_AND_REPORT` |

## P0 Negative Proof

Phase 0 passes this gate only when later work cannot use `main` or stale docs to
create new API routes, Prisma migrations, screen-generation tasks, held-route
promotion or P1 expansion.
