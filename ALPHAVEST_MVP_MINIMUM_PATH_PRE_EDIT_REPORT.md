# ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md

## 1. Source Artefacts Read

- `prompts/ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PROMPT_PACK.md`
- `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md`
- `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`
- `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`
- `prompts/ALPHAVEST_MVP_READINESS_VERDICT_PROMPT_ENGINE_PROOF.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/README_START_HERE.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/CODEX_OPERATING_RULES.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/V2_1_PATCH_CHANGELOG.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/01_OPERATIVE_AUTHORITY/FINAL_CODEX_TASK_MASTER.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/04_CODEX_PHASE_PROMPTS/00A_NO_DECISION_EXECUTION_PATCH_PROMPT.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/02_EXECUTION_COMPLETION_ARTEFACTS/TASK_DONE_DEFINITION_AND_QA_CHECKLIST.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/02_EXECUTION_COMPLETION_ARTEFACTS/P0_TEST_ASSERTION_AND_FIXTURE_PLAN.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06_UI_INTERACTION_REALITY_PATCH/ALPHAVEST_UI_INTERACTION_REALITY_CLARIFICATION.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06_UI_INTERACTION_REALITY_PATCH/CODEX_UI_INTERACTION_REMEDIATION_PROMPT_PATCH.md`
- `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06A_NO_DECISION_EXECUTION_PATCH/AMBIGUITY_CLASSIFICATION_RULES.md`
- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `.env.example`
- `docker-compose.yml`
- `playwright.config.ts`

Note: `/Users/chris/Downloads/ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md` is byte-identical to `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md`. `/Users/chris/Downloads/ALPHAVEST_MVP_READINESS_VERDICT_PROMPT_ENGINE_PROOF.md` is byte-identical to `prompts/ALPHAVEST_MVP_READINESS_VERDICT_PROMPT_ENGINE_PROOF.md`.

## 2. Current Git Status

Current status:

```text
## full-workflow...origin/full-workflow [ahead 17]
?? ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md
?? ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md
?? ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md
?? prompts/ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PROMPT_PACK.md
?? prompts/ALPHAVEST_MVP_READINESS_VERDICT_PROMPT_ENGINE_PROOF.md
```

This report file is newly created by Prompt 01 and will appear as an additional untracked file after this baseline.

## 3. Current Branch

```text
full-workflow
```

The branch tracks `origin/full-workflow` and is currently ahead by 17 commits. No `main` target truth was used.

## 4. Files Inspected

- `package.json`
- `prisma/schema.prisma`
- `lib/prisma.ts`
- `deleted generic workflow route`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/review-monitoring/route.ts`
- `lib/document-upload-service.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/recommendation-review-workflow-validation.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`
- `lib/audit-service.ts`
- `components/client-intake-screen.tsx`
- `components/demo-session-provider.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `lib/demo-session.ts`
- `tests/committee-review-routes.spec.ts`
- `tests/data-quality-service.spec.ts`
- `tests/recommendation-review-workflow-api.spec.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/foundation-guardrails.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/review-monitoring-service.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/schema-alignment.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/workflow-gate.spec.ts`

## 5. Files Likely To Edit

Likely for Prompt 02:

- `components/client-intake-screen.tsx`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- possibly `tests/p0-acceptance.spec.ts` or `tests/ui-state-boundaries.spec.ts` if the upload-not-sufficiency assertion needs focused reinforcement

Likely for later prompts, if reached in order:

- `deleted generic workflow route`
- `lib/recommendation-review-workflow-validation.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`
- `lib/audit-service.ts`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- targeted workflow, visibility, confirmation and P0 test files under `tests/**`

Not likely by default:

- `prisma/schema.prisma`
- new API route files
- route workset files
- visual assets or generated state screens

## 6. Phase Sequence

The Prompt Pack requires strict order:

```text
00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07
```

Optional:

```text
08
```

Prompt 01 is the current phase. Prompt 02 may begin only after this report returns `ENTRY_READY` or `ENTRY_READY_WITH_TECHNICAL_CHOICES`.

Minimum Path sequence confirmed:

1. Tenant-scoped upload reload.
2. Typed persistent Review -> Advisor Approval -> Compliance workflow vertical.
3. Confirmation lifecycle hardening.
4. Client visibility proof.
5. P0 tests and validation.
6. Final patch report.
7. Optional post-patch readiness re-audit.

## 7. Existing Tests / Scripts Found

Package scripts found:

- `dev`
- `build`
- `start`
- `lint`
- `typecheck`
- `db:generate`
- `db:migrate`
- `db:reset`
- `db:seed`
- `db:studio`
- `db:validate`
- `smoke:phase07`
- `smoke:phase08`
- `smoke:phase09`
- `smoke:phase10`
- `smoke:phase11`
- `smoke:phase12`
- `smoke:phase13`
- `visual:contract`
- `visual:strict`
- `screencast:journey`
- `screencast:all`
- `screencast:dry-run`
- `screencast:p0`
- `screencast:p0:dry-run`
- `screencast:p1`
- `screencast:p1:dry-run`
- `screencast:p2`
- `screencast:p2:dry-run`
- `screencast:generate-portfolio`
- `screencast:seed-journey`
- `screencast:mp4`
- `test:data-quality`
- `test:file-export`
- `test:foundation`
- `test:playwright`
- `test:permissions`
- `test:phase-d`
- `test:route-smoke`
- `test:workflow-gate`
- `test:workflow-api`
- `phase:check`

Test files found:

- `tests/committee-review-routes.spec.ts`
- `tests/data-quality-service.spec.ts`
- `tests/recommendation-review-workflow-api.spec.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/foundation-guardrails.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/review-monitoring-service.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/schema-alignment.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/workflow-gate.spec.ts`

Prompt 01 did not execute tests or validation commands. Several Playwright specs call `pnpm db:seed`; those are DB-mutating and therefore intentionally not run in this read-only baseline.

## 8. Database / Environment Readiness

Observed:

- `.env.example` documents `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` and `PRISMA_STUDIO_PORT`.
- A local `.env` file exists, but was not read in this Prompt 01 baseline to avoid exposing local secrets.
- `docker-compose.yml` defines a PostgreSQL 17 service with healthcheck and a web service that receives `DATABASE_URL`.
- `lib/prisma.ts` requires `process.env.DATABASE_URL` and throws if missing.
- `prisma/schema.prisma` uses a PostgreSQL datasource and Prisma client generator.
- `prisma/seed.ts` imports `dotenv/config`, requires `DATABASE_URL`, and resets deterministic demo data.
- Playwright defaults to a local web server on port `3020`, single worker, and `fullyParallel: false`.
- Existing DB-dependent tests generally require `DATABASE_URL` and several reset data with `pnpm db:seed`.

Readiness classification:

- DB configuration is present and documented.
- Test scripts are present.
- Runtime DB availability is not proven in Prompt 01 because no DB, migration, seed, test or validation command was run.
- Prompt 02 can proceed with code inspection and implementation, but actual proof must run later in a safe local demo DB context.

## 9. Ambiguities Found

1. Prompt 01 says "Do not edit files" while also requiring creation of `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`.
2. Prompt 02 likely needs to decide how `usePersistedUploadDocuments` receives the active tenant.
3. Existing upload reload currently hardcodes `tenantSlug=morgan` while upload submission already sends `session.tenant.slug`.
4. `/api/documents` accepts `tenantSlug`, but it has no actor/role header or session auth. It is demo-session scoped by query and existing tenant slug validation.
5. Some existing tests mutate the DB through `pnpm db:seed`; Prompt 01 forbids mutating DB commands.
6. Existing P0 tests and safety tests are proof slices only; they cannot be treated as P0 passed.
7. Typed persistent Review -> Advisor Approval -> Compliance workflow will probably require extending existing `deleted generic workflow route` validation beyond `actionId`; whether to create a new API is explicitly forbidden by default.
8. Schema appears broad enough for later workflow work, but this baseline did not prove that every later typed workflow field can be implemented without schema changes.
9. Confirmation lifecycle surfaces are partially reactive but action submission remains actionId/demo-oriented in current inspected UI.
10. Review monitoring API is DB-backed, but route scope and Prompt Pack order keep it outside Prompt 01 and outside the first implementation phase.

## 10. Classification of Each Ambiguity

| # | Ambiguity | Classification | Treatment |
|---:|---|---|---|
| 1 | Prompt 01 forbids edits but requires this report file. | `TECHNICAL_CHOICE_ALLOWED` | Treat report creation as the required Prompt 01 artifact, not an implementation edit. |
| 2 | Passing active tenant into `usePersistedUploadDocuments`. | `TECHNICAL_CHOICE_ALLOWED` | Use existing demo session/tenant context; document the technical choice in Prompt 02. |
| 3 | Hardcoded Morgan document reload. | `TECHNICAL_CHOICE_ALLOWED` | This is the known Prompt 02 target gap. |
| 4 | `/api/documents` is query-scoped rather than auth-scoped. | `PROOF_NOT_SUFFICIENT` | Do not claim production tenant auth. Preserve existing API and prove demo tenant isolation. |
| 5 | DB-mutating tests exist. | `TECHNICAL_CHOICE_ALLOWED` | Do not run in Prompt 01; select safe targeted execution later after implementation. |
| 6 | Existing P0 proof slices are incomplete. | `PROOF_NOT_SUFFICIENT` | Do not claim P0. Add/run required proof only in later prompts. |
| 7 | Workflow typed payload likely needs existing API hardening. | `TECHNICAL_CHOICE_ALLOWED` for extending existing route, `API_DECISION_REQUIRED` if a new API seems necessary | Prompt 03 must use `deleted generic workflow route` unless a blocker is classified. |
| 8 | Possible later schema need. | `SCHEMA_DECISION_REQUIRED` if encountered later | No schema change authorized by Prompt 01 or Prompt 02 by default. |
| 9 | Partial confirmation lifecycle. | `TECHNICAL_CHOICE_ALLOWED` within Prompt 04; `PROOF_NOT_SUFFICIENT` now | Do not claim lifecycle done. Harden only when Prompt 04 is reached. |
| 10 | Review monitoring API/UI mismatch. | `OUT_OF_SCOPE` for Prompt 01 and Prompt 02 | Do not patch until a later authorized prompt/scope. |

## 11. Entry Decision

`ENTRY_READY_WITH_TECHNICAL_CHOICES`

Rationale:

- Required Prompt Pack, patch, audit, verdict and handoff authority files are present.
- The two user-mentioned Download artefacts are already mirrored in the repo and byte-identical to their repo counterparts.
- Current target branch is `full-workflow`; no `main` target truth was used.
- Package scripts, Prisma/DB configuration, four existing API routes, requested services, requested components and tests were inspected.
- The known Prompt 02 gap is local and bounded: UI reload uses hardcoded `tenantSlug=morgan` even though active session tenant context exists and upload submission already uses it.
- No product, route, schema or new API decision is required to begin Prompt 02 based on current evidence.
- No P0/MVP readiness claim is made.
