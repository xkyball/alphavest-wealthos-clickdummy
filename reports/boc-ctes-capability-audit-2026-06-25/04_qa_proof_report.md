# QA Proof Report

Generated: 2026-06-25

Task status:
- QA-1: FINISHED
- DECISION-2: PENDING HUMAN ACCEPTANCE

## Positive Proof Executed

The refined specification requires focused validation:

- `pnpm guard:source`
- `pnpm db:validate`
- `pnpm test:source-reality`
- `pnpm test:document-upload-api`
- `pnpm exec playwright test tests/dbtf-tables-api.spec.ts --workers=1`
- `pnpm exec playwright test tests/journey-api.spec.ts --workers=1`
- `pnpm exec playwright test tests/export-workflow-api.spec.ts --workers=1`
- `pnpm test:permissions`

## Negative Proof Covered

The selected tests include negative cases for:

- invalid tenant/role scope
- unsupported/missing upload input
- audit persistence unavailable
- role-denied mutations
- forbidden export payload fields
- high-severity data-quality export blocks
- admin/non-operational bypass attempts
- unreleased/internal client projection leakage

## Current Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm guard:source` | PASS | Source guard checked AGENTS/source-truth entrypoints and scripts with zero violations. |
| `pnpm db:validate` | PASS | Prisma schema at `prisma/schema.prisma` is valid. |
| `pnpm test:source-reality` | PASS | 8/8 tests passed. |
| `pnpm test:document-upload-api` | PASS | 9/9 tests passed. Covered upload persistence, tenant scoping and negative validation/audit/role paths. |
| `pnpm exec playwright test tests/dbtf-tables-api.spec.ts --workers=1` | PASS | 15/15 tests passed. Covered DB-backed profile, family, entity, dashboard/search, tenant scoping and denials. |
| `pnpm exec playwright test tests/journey-api.spec.ts --workers=1` | PASS | 8/8 tests passed. Covered journey commands, audit, projection, release gates and fail-closed paths. |
| `pnpm exec playwright test tests/export-workflow-api.spec.ts --workers=1` | PASS | 4/4 tests passed. Covered scope/redaction/preview/approval/generate/download/share separation, forbidden payload, data-quality block and role denial. |
| `pnpm test:permissions` | PASS | 8/8 tests passed. Covered cross-tenant denial, object scope, no client/admin bypass, client-safe projection, deny audit and audit-unavailable fail-closed behavior. |

## QA Limitations

- Full `pnpm phase:check` and the complete Playwright suite were not run because the blueprint requires a report/audit package, not release certification.
- Browser screenshots were not produced because this run made no UI changes; code/API/DB/test evidence is stronger for the requested vertical-slice audit.
- During the run, `HEAD` advanced from `c24972d` to `1e6616e` with an external WP06 proof commit. This audit did not revert or modify that commit; final proof was run against the newer `1e6616e` worktree state.
- `reports/` is ignored by `.gitignore`; the audit package must be force-added if it is committed.

## QA Conclusion

Focused validation supports the report's selected COMPLETE_VERTICAL_SLICE and BACKEND_VERTICAL_SLICE claims. The report still correctly rejects full app-wide completeness because not every registered route or UI control was proven as a vertical slice.
