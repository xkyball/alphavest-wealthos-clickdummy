# SCHEMA_FIELD_LEVEL_RECONCILIATION.md

Status: `NO_SCHEMA_MIGRATION_ALIGN_USAGE_ONLY`

This Phase 0 reconciliation locks the First Build schema rule.

## Baseline

The current `full-workflow` Prisma baseline is:

- enum count: 22
- model count: 42
- migrations: read-only baseline for Phase 0

## Stop Rule

Do not create Prisma migrations, patch-only models, blind schema replacements or
schema-derived tasks from `main` or older planning artefacts.

If a later package cannot represent its required behavior with the existing
schema and service semantics, the correct result is `STOP_AND_REPORT`, not a
Phase 0 schema edit.

## Allowed Work

- Read `prisma/schema.prisma` for target-code reality.
- Align later code usage to existing fields only when a selected package task
  explicitly authorizes implementation.
- Keep schema proof separate from product acceptance proof.
