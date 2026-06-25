# AlphaVest WP09 Schema Usage Alignment / No Blind Schema Replacement Execution

Generated: 2026-06-25

Status: STOPPED_AT_DECISION_WP09_1

This report executes the uploaded WP09 blueprint as a strict process chain:

Blueprint task -> executed analysis result -> refined specification -> derived implementation task -> implementation or zero-delta implementation -> QA/proof -> report.

No product-code change was made in this WP09 run. Implementation tasks are blocked until the human approves the schema usage boundary required by `DECISION-WP09-1`.

## Source Scope Used

- Uploaded blueprint: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP09_SCHEMA_USAGE_ALIGNMENT_BOC_TICKET_STRUCTURE.md`
- Current repository source code, tests, route tree, Prisma schema, migrations, package config and git state.
- Current and earlier generated process artefacts:
  - `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP07_EXPORT_REDACTION_CLIENT_SAFE_PACKAGE_EXECUTION.md`
  - `docs/00-current/ALPHAVEST_WP08_API_HARDENING_FAIL_CLOSED_CONTRACTS_EXECUTION.md`
- Explicit human decisions from this refactor chain:
  - WP05 Option A: no new API, no schema migration, canonical Journey command path, `/api/demo-workflow` compatibility only.
  - WP06 Option A: route/action/object plus payload/API/service-level enforcement, admin non-bypass fail-closed, no new API, no schema migration.
  - WP07 Option A: existing `/api/export-workflow`, no new API, no schema migration, metadata-only redacted package proof, forbidden payload negative tests.
  - WP08 Option A: existing API routes only, no new API, no schema migration, shared fail-closed/redaction/audit helpers allowed with limits, `/api/demo-workflow` compatibility/demo only.

Excluded as specification authority: unrelated legacy planning docs, broad handoff docs, old KB/source artefacts, source refs and prior assumptions unless revalidated against current repo evidence.

## Moving Baseline Preflight

- Branch: `full-workflow`
- Remote state at start: `full-workflow...origin/full-workflow [ahead 48]`
- Latest commit at start: `0c736f2 docs: close wp08 option a zero delta`
- Working tree at start: clean
- Operative repo authority inspected before analysis: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Package scripts inspected: `guard:source`, `typecheck`, `db:validate`, `test:source-reality`, `test:v1-p0`, focused Playwright suites and `phase:check` are available.

## Extracted Blueprint Tasks

### Epic: WP-09 Schema Usage Alignment / No Blind Schema Replacement

Detailed description: align existing full-workflow Prisma schema usage with AlphaVest safety contracts. The task is not a schema redesign. It must prevent blind patch-schema replacement, unplanned migrations and silent model creation while ensuring field usage, relation traversal, tenant/object scope, client visibility, evidence linkage, audit persistence and export redaction match the safety contracts.

Primary scope:

- Existing schema inventory.
- Model/enum/field safety mapping.
- Query usage and selector/projection alignment.
- No-blind-schema-replacement guard.
- No-unplanned-migration guard.
- Patch-only concept quarantine.
- Evidence/audit/export/RBAC field usage alignment.
- P0 negative checks for forbidden payload and migration drift.

Out of scope:

- Prisma schema replacement.
- Default model creation.
- Unplanned migration.
- Physical deletion of existing models/fields.
- Using `main` as schema truth.
- Autonomous advice schema path.
- Client-visible internal draft, compliance note or unreleased evidence field exposure.
- New API design unless separately approved.

### ANALYSIS-WP09-1: Existing Schema Usage and Safety-Contract Mapping Audit

Detailed description: inventory `prisma/schema.prisma`, direct and indirect Prisma usage, client-visible payload queries, broad includes/selects, tenant/object scope filters, safety-relevant fields, patch-only concepts, schema-related tests and migration risks.

Subtasks extracted:

- Inventory Prisma models/enums and direct schema usage in code.
- Map field usage to safety contracts and process work packages.
- Identify patch-only concepts, unresolved gaps and migration risks.
- Inventory existing schema-related tests and missing negative checks.

Dependencies: WP00 guardrails and accessible `full-workflow` codebase. Enables `SPEC-WP09-1`, `DECISION-WP09-1`, implementation tasks and QA.

DoD:

- Relevant schema files and usage locations identified.
- Direct and indirect Prisma usage documented.
- Safety-relevant fields and relations mapped.
- Patch-only concepts classified as mapped/deferred/unresolved.
- Likely implementation tasks and CTES estimates ready.
- No-migration risks listed.
- Specification inputs ready.

### SPEC-WP09-1: Schema Usage Alignment Contract and No-Migration Boundaries

Detailed description: specify how existing schema fields, relations, queries and projections may be used across client, internal, evidence, audit, export and RBAC paths. Define no-migration and no-blind-replacement boundaries.

Subtasks extracted:

- Define model/field usage rules by process and actor boundary.
- Define payload projection/redaction selector contract.
- Define evidence/audit/export/RBAC status field contract.
- Define no-migration and patch-only handling rules.

Dependencies: `ANALYSIS-WP09-1`. Enables decision, implementation tasks and QA.

DoD:

- Target state unambiguous.
- Scope and out-of-scope clear.
- Allowed and forbidden changes explicit.
- Acceptance criteria objectively reviewable.
- Implementation tasks have CTES and dependencies.
- QA design covers payload leakage and migration drift.

### DECISION-WP09-1: Human Approval of Schema Usage Boundary

Detailed description: confirm that the current full-workflow schema remains baseline, patch-only concepts are not blindly implemented, migrations remain excluded by default, and selector/helper strategy is approved or rejected.

Required decision points:

- Confirm no Prisma migration by default.
- Confirm no blind patch-schema replacement.
- Confirm patch-only concept handling.
- Confirm whether shared selector/projection helpers may be introduced.
- Confirm `full-workflow` remains target truth and `main` remains invalid schema truth.

DoD:

- No-migration default confirmed.
- Schema baseline confirmed.
- Patch-only handling confirmed.
- Helper strategy confirmed.
- Implementation can proceed without Codex inventing schema policy.

### IMPL-WP09-1: Align Object/Tenant Scoped Prisma Query Usage

Detailed description: update specified Prisma query usage to enforce tenant/object scope and remove unsafe broad includes/selects.

Subtasks:

- Confirm affected query boundaries.
- Apply tenant/object scope filters.
- Narrow broad includes/selects.

Dependencies: analysis, spec and decision.

### IMPL-WP09-2: Align Payload Projection and Redaction Selectors

Detailed description: update or introduce approved selectors/projections so client, export and internal payload contexts receive different safe field sets.

Subtasks:

- Define projection targets from spec.
- Implement or update safe projections.
- Keep internal-only projections separate.

Dependencies: analysis, spec, decision and query-boundary alignment where relevant.

### IMPL-WP09-3: Quarantine Patch-Only Schema Assumptions Without Migrations

Detailed description: remove, reword or quarantine code/docs/fixture assumptions that imply patch-only models or fields exist in implementation, without creating migrations or new models.

Subtasks:

- Identify patch-only references to quarantine.
- Replace implementation-claiming language.
- Record unresolved concepts.

Dependencies: analysis, spec and decision.

### IMPL-WP09-4: Align Evidence/Audit/Export Schema Usage to Contracts

Detailed description: align evidence, audit and export field usage so upload, sufficiency, release, redaction and export package composition remain separate and safe.

Subtasks:

- Plan evidence/audit/export field usage edits.
- Align evidence status usage.
- Align audit/export field selection.

Dependencies: analysis, spec, decision, WP04, WP07 and WP08 boundaries.

### QA-WP09-1: Schema Usage Regression and No-Migration Validation

Detailed description: validate schema usage alignment against no-migration rule, forbidden payload checks, tenant/object scope, evidence/audit/export semantics and patch-only quarantine.

Dependencies: implementation tasks and spec.

## ANALYSIS-WP09-1 Executed Result

Status: COMPLETE

### Schema and Migration Baseline

Current repo reality:

- `prisma/schema.prisma` exists and validates.
- Live schema count is 49 models and 27 enums.
- The uploaded WP09 blueprint refers to an older 42-model / 22-enum baseline. That count is not current repo truth.
- `tests/schema-alignment.spec.ts` currently expects 48 models and 26 enums, so it is also stale against current repo reality.
- Current migration files are:
  - `20260614201128_init_phase_02`
  - `20260614202332_phase_03_data_model_seed`
  - `20260624190000_wave_0_2_journey_spine`
  - `20260624213000_wave_0_2_core_journey_gates`
  - `migration_lock.toml`
- `tests/schema-alignment.spec.ts` expects the previous migration list and fails because `20260624213000_wave_0_2_core_journey_gates` exists.

Important interpretation: this is not evidence that a new WP09 migration is needed. It is evidence that the WP09 proof/test baseline must be updated to current full-workflow reality before any product-code alignment is claimed.

### Models and Enums

Current enums include the safety-critical sets:

- `ObjectType`, `PermissionAction`, `Sensitivity`, `VisibilityStatus`, `WorkflowStatus`
- `DocumentStatus`, `ReviewStatus`, `ComplianceStatus`, `RecommendationStatus`, `DecisionStatus`
- `EvidenceStatus`, `ExportStatus`, `AuditResult`
- Journey enums including `JourneyDefinitionStatus`, `JourneyInstanceStatus`, `JourneyStepStatus`, `JourneyObjectLinkRole`, `EvidenceSufficiencyDecisionStatus`

Current safety-critical models include:

- RBAC/object scope: `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation`
- Client visibility/advice: `Recommendation`, `Approval`, `ComplianceReview`, `Decision`
- Journey spine and command proof: `JourneyDefinition`, `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyEvidenceRequirement`, `JourneyCommandRun`
- Evidence: `EvidenceSufficiencyDecision`, `EvidenceRecord`, `EvidenceItem`, `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`
- Audit/export: `AuditEvent`, `ExportRequest`
- Read-model/support: `ReviewSchedule`, `QueueItem`, `DataQualityIssue`

### Direct Prisma Usage Inventory

Direct Prisma usage exists in these product/service surfaces:

- API-local clients:
  - `app/api/demo-workflow/route.ts`
  - `app/api/review-monitoring/route.ts`
- Shared Prisma client:
  - `lib/prisma.ts`
- Core services/read models:
  - `lib/admin-tenant-readmodel-service.ts`
  - `lib/auth/current-user.ts`
  - `lib/data-quality-repository.ts`
  - `lib/dbtf-form-service.ts`
  - `lib/dbtf-table-service.ts`
  - `lib/demo-workflow-mutation.ts`
  - `lib/demo/demo-auth-provider-service.ts`
  - `lib/document-upload-service.ts`
  - `lib/evidence-review-service.ts`
  - `lib/export-workflow-command-service.ts`
  - `lib/export-workflow-readmodel-service.ts`
  - `lib/global-search-service.ts`
  - `lib/journeys/journey-api-service.ts`
  - `lib/ops-sla-readmodel-service.ts`
  - `lib/review-monitoring-service.ts`
- Seed and test surfaces:
  - `prisma/seed.ts`
  - Multiple focused API/service tests including document upload, evidence review, export workflow, demo workflow, governance, permission, journey and audit persistence specs.

### Query and Projection Findings

Positive findings:

- `lib/visibility-engine.ts` centralizes client-safe recommendation, decision and document projections. It defines forbidden client projection fields including internal draft/rationale/compliance, evidence internals and document storage/checksum fields.
- `lib/document-upload-service.ts` lists documents scoped by tenant and projects rows through `visibilityEngine.projectDocumentPayload`.
- `lib/journeys/journey-api-service.ts` enforces tenant scope in `loadScopedJourneyInstance` and `listJourneysForCurrentUser`.
- `lib/export-workflow-command-service.ts` and `lib/export-workflow-readmodel-service.ts` use existing `ExportRequest` and `Document` fields for export lifecycle and metadata-only generated file proof.
- `lib/review-monitoring-service.ts` uses read-model queries for internal monitoring; WP08 wraps it as internal-only.

Risk findings:

- Some read-model services intentionally use broad internal reads, such as admin, global search, DBTF table/read models and review monitoring. These are not automatically unsafe, but WP09 implementation must classify them as internal-only or constrain them before any client/export reuse.
- `lib/journeys/journey-api-service.ts` uses broad includes for journey graph loading (`definition`, `objectLinks`, `steps`). It enforces tenant scope after loading by ID in `loadScopedJourneyInstance`, and filters by tenant in list mode. WP09 should decide whether this is acceptable or whether the query should move tenant scope into the `where` clause for tenant users.
- `lib/export-workflow-readmodel-service.ts` includes generated file document metadata via explicit select. It intentionally avoids storage key/checksum in the read model, which aligns with WP07/WP08.
- `tests/schema-alignment.spec.ts` is a stale schema proof and should not be treated as current acceptance until updated.

### Patch-Only Concept Register

Patch-only concepts found as explicitly blocked/deferred references:

- `AiDraft`
- `ClientVisibilityEvaluation`
- `PolicyException`
- `VisibilityRule`

Current repo proof:

- None of these appear as Prisma models in `prisma/schema.prisma`.
- They appear in tests/docs as concepts to block or reconcile, not as implemented schema models.
- `lib/source-reality-gate.ts` includes a guard message forbidding blind schema replacement or patch-schema adoption without an explicit approved task.

### Existing Test Coverage

Relevant existing tests:

- `tests/schema-alignment.spec.ts`: schema alignment proof exists but is stale against current counts/migrations.
- `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/true-ux-client-projection.spec.ts`: client-safe projection/no-leakage proof.
- `tests/document-upload-api.spec.ts`, `tests/document-upload-lifecycle-hardening.spec.ts`, `tests/evidence-review-api.spec.ts`: upload/evidence lifecycle and schema field semantics.
- `tests/export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts`: export/redaction field proof.
- `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`: RBAC/admin non-bypass and object/action boundaries.
- `tests/demo-workflow-api.spec.ts`, `tests/journey-api.spec.ts`, `tests/phase6-audit-persistence.spec.ts`: advisory/compliance/audit field usage.

### Pre-Decision Validation

Command:

`pnpm guard:source && pnpm db:validate && pnpm exec playwright test tests/schema-alignment.spec.ts --workers=1 --reporter=line`

Result:

- Source guard: PASS, 0 violations.
- Prisma validate: PASS.
- `tests/schema-alignment.spec.ts`: FAIL, 6 passed / 2 failed.

Failure details:

- `preserves the full-workflow Prisma baseline without patch-schema takeover` expects 48 models but receives 49.
- `maps V1 P0 gates to existing schema/runtime support without adding migrations` expects no `20260624213000_wave_0_2_core_journey_gates` migration, but the migration exists.

Interpretation:

- Positive proof: schema validates and source guard passes.
- Negative proof: schema-alignment proof is stale and must be brought forward to current repo reality before WP09 can be closed.
- This does not authorize a migration. It supports the opposite: update proof/spec/test assumptions to current `full-workflow`, not schema files to older expectations.

## SPEC-WP09-1 Refined Specification

Status: COMPLETE

Inputs and overrides used:

- Uploaded WP09 blueprint.
- Executed `ANALYSIS-WP09-1` above.
- WP03 client-safe projection boundary and source-upload metadata exception.
- WP04 upload-not-sufficiency and evidence lifecycle boundaries.
- WP05 canonical Journey command path, advisor-not-release, compliance-release gate, no schema migration.
- WP06 admin non-bypass, payload/API/service enforcement, no schema migration.
- WP07 export/redaction existing API path, no schema migration.
- WP08 fail-closed API contracts, shared helper allowance with limits, no schema migration.

### Contract

- Current `full-workflow` schema is the only implementation schema authority.
- Current live counts are 49 models and 27 enums unless a later approved schema task changes them.
- No Prisma schema replacement is allowed in WP09.
- No Prisma migration is allowed in WP09 first wave.
- No patch-only model creation is allowed in WP09.
- Patch-only concepts must be mapped, explicitly deferred or quarantined in docs/tests; they must not be silently introduced into `schema.prisma`.
- Existing schema usage may be changed only in service/query/projection/test artefacts after human approval and only where the analysis identifies unsafe or stale usage.
- Shared selector/projection helpers may be introduced only after decision approval and only if they reduce leakage risk without creating new API/schema or hiding route-specific semantics.
- Client/export payloads must use explicit projections or safe read models; raw Prisma model objects must not be returned from client/export routes.
- Internal read-models may use broader fields only when classified as internal-only and not reused in client/export routes.
- Evidence status fields must not collapse upload, linkage, sufficiency and release into one state.
- Audit result fields must remain explicit and mutation-linked.
- Export status fields must preserve preview, approval, generation, download/share and client acceptance separation.

### Acceptance Criteria

- `prisma/schema.prisma` remains unchanged unless a later explicit migration task is approved.
- No new `prisma/migrations/*` files appear in WP09 first wave.
- `tests/schema-alignment.spec.ts` or its successor is updated to current repo truth and no longer asserts stale model/enum/migration counts.
- Patch-only concepts remain absent from Prisma models and documented as blocked/deferred.
- Client-facing and export-facing payload proof excludes internal draft, internal rationale, compliance notes, storage keys, checksums, unreleased evidence and audit internals.
- Tenant/object scope proof exists for Journey, document, evidence, export and admin-sensitive paths.
- Existing focused safety tests continue to pass after any implementation deltas.

### Derived Implementation Cut

If approved, the clean first-wave implementation should be:

- `IMPL-WP09-1`: zero-delta-first query-boundary proof; only move tenant scope into Prisma `where` clauses if a current path is proven unsafe.
- `IMPL-WP09-2`: zero-delta-first projection proof; introduce helper only if current projection duplication creates leakage risk.
- `IMPL-WP09-3`: update/quarantine stale patch-only and stale schema-baseline proof artefacts. This likely includes `tests/schema-alignment.spec.ts` and `V1_0_SCHEMA_USAGE_ALIGNMENT.md`.
- `IMPL-WP09-4`: zero-delta-first evidence/audit/export field proof; only modify service usage if tests reveal a contract gap.
- `QA-WP09-1`: source guard, typecheck, Prisma validate, updated schema-alignment proof, and focused projection/evidence/export/RBAC tests.

## DECISION-WP09-1

Status: HUMAN_DECISION_REQUIRED

No explicit WP09 approval exists yet in this thread or in generated WP09 decision artefacts. This is a true stop point because the next step decides whether Codex may update stale schema-proof tests/docs and whether shared selectors/helpers are allowed.

### Option A - Recommended: Current Schema Reality, No Migration, Proof Alignment First

Approve:

- Current `full-workflow` schema reality is authority.
- No Prisma schema replacement.
- No Prisma migrations in WP09 first wave.
- Patch-only concepts remain blocked/deferred/quarantined.
- Shared selector/projection helpers allowed with limits only when they reduce leakage risk.
- Update stale schema-alignment proof to current 49-model / 27-enum schema and current migration list.
- Execute implementation zero-delta-first; product-code changes only if a current unsafe query/projection path is proven by analysis/tests.

Aggressive clean-solution recommendation: approve Option A. It removes the actual debt found by the analysis: stale schema-proof assumptions. It also keeps the safety architecture clean by refusing migrations and patch-schema takeover while allowing a narrow selector/helper cleanup if proof shows it reduces leakage.

Approval text:

`I approve WP09 Option A: current full-workflow schema reality is authority, no Prisma schema replacement, no Prisma migrations in WP09 first wave, patch-only concepts remain blocked/deferred/quarantined, shared selector/projection helpers allowed with limits only when they reduce leakage risk, update stale schema-alignment proof to current 49-model / 27-enum schema and current migration list, and execute implementation zero-delta-first with product-code changes only for proven unsafe query/projection paths.`

### Option B - Docs/Test Proof Only, No Helper Introduction

Approve only stale schema-alignment test/docs correction and no product-code/helper changes.

Benefit: smallest diff and lowest blast radius.

Cost: may leave duplicated projection/query safety logic in place even if a small helper would reduce future leakage risk.

### Option C - Schema Reconciliation With Migration Permission

Allow a migration/schema reconciliation task now.

Benefit: could align model counts and names to a new target.

Cost: directly conflicts with WP05-WP08 no-schema-migration posture and the WP09 upload's no-blind-replacement default. Not recommended.

## QA/Proof Status

Full `QA-WP09-1` is blocked until decision and implementation/zero-delta tasks complete.

Pre-decision proof:

- Source guard: PASS.
- Prisma validate: PASS.
- Schema alignment proof: FAIL because it is stale against current repo reality.

No UI changes were made, so no screenshot is required.

## Product-Code Changes

None.

## Generated Artefact Updates

- Added this WP09 execution, analysis, refined specification and decision report.

## Residual Risks

- Existing `tests/schema-alignment.spec.ts` is stale and will keep failing until updated.
- `V1_0_SCHEMA_USAGE_ALIGNMENT.md` still claims older baseline migration limits and should be corrected if Option A is approved.
- Internal read-model services with broad includes/selects need explicit classification as internal-only or narrowing before any client/export reuse.
- Full WP09 QA is not claimable until after `DECISION-WP09-1` and implementation/zero-delta execution.

## Method Compliance Checklist

- V3 evidence before promise: current schema/migration/test state was inspected before recommendations.
- Double Diamond Discover: completed through upload extraction, handoff/preflight and schema/query/test inventory.
- Double Diamond Define: completed through the no-migration schema usage contract.
- Double Diamond Develop: Options A, B and C compared.
- Double Diamond Deliver: delivered decision-ready WP09 artefact and stopped before unauthorized implementation.
- Psycho-Logic / Map: separated the plan's model-count map from actual repo schema territory.
- TRIZ: resolved the contradiction between schema safety and no migration by updating proof assumptions, not the database schema.
- SIT Closed World: uses current schema, current tests and existing projections as the closed-world resources.
- Harvard / BATNA: decision keeps a clean exit option; if no approval, no schema-related code changes occur.
- MESO: options differ by helper permission and migration posture while preserving user value.
- Ethics & Fairness: no hidden schema drift, no fabricated acceptance claim, no client payload weakening.

## Honest Limitations

- This is not a final WP09 implementation report.
- No zero-delta implementation claim is made yet.
- The schema-alignment failure is current proof of stale acceptance artefacts, not proof of a broken Prisma schema.
