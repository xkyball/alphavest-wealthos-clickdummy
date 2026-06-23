# V1.0 Release Runbook

Status: CLOSED_PILOT_DEMO_READY_WITH_SCOPE_LOCKS
Date: 2026-06-23
Authority: ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md

## Environment Boundaries

| Environment | Data mode | Real client data | Purpose | Release claim |
|---|---|---|---|---|
| local | demo | forbidden | Developer verification | local proof only |
| docker_demo | demo | forbidden | Reproducible container smoke | demo proof only |
| closed_pilot_demo | demo | forbidden unless separately approved in writing | Controlled pilot walkthrough | paid pilot candidate, not GA |
| production-like | non-demo | blocked for this runbook | Future hardening only | no V1.0 release claim |

Required env controls:

```bash
APP_ENV=local
ALPHAVEST_DATA_MODE=demo
ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=false
ALPHAVEST_PILOT_RELEASE_STAGE=local_demo
```

## Build And Deploy Checklist

1. Confirm branch is the approved target branch for the release candidate.
2. Confirm `ALPHAVEST_DATA_MODE=demo` and `ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=false`.
3. Run `pnpm db:validate`.
4. Run `pnpm test:v1-p0`.
5. Run `pnpm phase:check`.
6. Build container with `docker compose build web`.
7. Start demo stack with `docker compose up -d postgres web`.
8. Confirm `/` healthcheck returns HTTP 200.
9. Run `pnpm test:route-smoke` against the active local target when browser routing proof is required.
10. Record commit, command output, known warnings and explicit non-claims.

## Go / No-Go

Go requires all of the following:

- P0 safety suite passes.
- Typecheck, Prisma validation and build pass.
- Real client data remains disabled.
- Demo seed has not run against a production/non-demo environment.
- Rollback owner and command are known.
- No P1, Reference-only or Hold route is reclassified as MVP.

No-go triggers:

- Any P0 leakage, tenant-scope, export, audit or fail-closed test failure.
- `ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=true`.
- Missing rollback route.
- Missing incident owner for P1 compliance/audit/export failures.

## Rollback

Container rollback:

```bash
docker compose down
git rev-parse HEAD
git checkout <last-known-good-commit>
docker compose build web
docker compose up -d postgres web
```

Database rollback for this V1.0 demo candidate is conservative: stop the pilot, preserve evidence, and restore the last known-good demo database snapshot. Do not run destructive reset commands against any non-demo environment.

## Known Non-Claims

- This is not GA.
- This is not production-auth proof.
- This is not approval for real client data.
- Screenshots support visual review only; they do not replace P0 safety tests.

