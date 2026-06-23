# AlphaVest V1.0 WP-11 Schema Alignment Report

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

WP-11 maps V1.0 gate concepts to the existing full-workflow Prisma schema and runtime services. No Prisma schema file was changed, no new migration was created beyond the existing baseline migration history, no patch-only model was introduced, and no TypeScript `any` workaround was added for a schema gap.

## Task Status

| Task | Status | Notes |
|---|---|---|
| `V10-WP11-T01` Field support map | `HARDENED` | Added `V1_0_SCHEMA_USAGE_ALIGNMENT.md` mapping actor, tenant, role, object scope, visibility, evidence, audit, export, non-bypass and data-quality gates to existing schema/runtime support. |
| `V10-WP11-T02` Service usage alignment | `ALREADY_PRESENT_VERIFIED` | Evidence, audit, export, workflow gate and visibility services use typed/domain runtime decisions against existing schema fields. |
| `V10-WP11-T03` Migration decision protocol | `HARDENED` | The alignment artefact records `NO_MIGRATION_REQUIRED_FOR_WP11`; existing baseline migrations are documented and no new migration directory/file was added. |
| `V10-WP11-T04` Schema tests | `HARDENED` | Extended schema alignment tests to prove every V1 P0 gate appears in the map, patch-only concepts stay blocked and `prisma/migrations` contains no migration files. |

## Changed Files

- `V1_0_SCHEMA_USAGE_ALIGNMENT.md`
- `tests/schema-alignment.spec.ts`
- `V1_0_WP11_SCHEMA_ALIGNMENT_REPORT.md`

## Inspected Files

- `prisma/schema.prisma`
- `prisma/migrations/migration_lock.toml`
- `package.json`
- `lib/evidence-service.ts`
- `lib/audit-service.ts`
- `lib/export-service.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `tests/schema-alignment.spec.ts`

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/schema-alignment.spec.ts tests/workflow-gate.spec.ts tests/audit-fail-closed.spec.ts tests/export-safety.spec.ts tests/client-visibility-projection.spec.ts tests/evidence-review-api.spec.ts` | PASS, 32 passed |
| `pnpm db:validate` | PASS |
| `pnpm phase:check` | PASS with existing warnings |

## Known Warnings

- Existing lint warnings remain for unused UI helpers and capture helpers.
- Existing build warnings remain for custom Babel config and broad `document-storage-adapter` tracing.

## Method Artifacts

- V2 Discover: Prisma schema, migration directory, service gate files and schema tests were inspected before editing.
- V2 Define: The boundary is field/runtime mapping and proof, not schema replacement.
- V2 Develop: The hardening adds a V1.0 schema usage map and a no-migration schema test.
- V2 Deliver: WP-11 remains phase-scoped and commit-ready after validation.
- V3 proof path: Supported branches map each P0 gate to current schema/runtime support; killed branches block patch-only model creation and blind migration.
- Ethics and fairness: The app does not pretend schema presence is readiness, and it does not silently replace the user-approved baseline.

## Verdict

`WP11_READY`.

V1.0 schema usage is mapped without new migration after targeted schema/service validation, `db:validate` and `phase:check`.
