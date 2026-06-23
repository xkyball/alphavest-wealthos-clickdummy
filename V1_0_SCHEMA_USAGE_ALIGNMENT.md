# AlphaVest V1.0 Schema Usage Alignment

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

The current full-workflow Prisma schema remains the V1.0 baseline: 42 models and 22 enums. WP-11 does not replace `prisma/schema.prisma`, does not create patch-only models, and does not add a new migration beyond the existing baseline migration history. V1.0 gate concepts are implemented through existing schema fields, service-level typed decisions, or documented runtime derivation.

## P0 Gate Support Map

| Gate Concept | Schema / Runtime Support | Status |
|---|---|---|
| Actor | `User.id`, `AuditEvent.actorUserId`, `UserRole.userId`, demo `ActorContext.userId` | `SUPPORTED` |
| Tenant | `PlatformTenant`, `ClientTenant`, `UserRole.clientTenantId`, service `platformTenantId/clientTenantId` inputs | `SUPPORTED` |
| Role | `Role.key`, `UserRole.roleKey`, `AuditEvent.actorRoleKey`, permission engine role keys | `SUPPORTED` |
| Object scope | `targetType/targetId`, `objectType/objectId`, `relatedObjectType/relatedObjectId`, `DocumentLink.targetType/targetId` | `SUPPORTED` |
| Client visibility | `Recommendation.clientVisible`, `Document.clientVisible`, `VisibilityStatus`, `Decision.releasedToClientAt`, `visibility-engine` projections | `SUPPORTED` |
| AI draft internal-only | `Recommendation.clientSummaryDraft`, `summaryInternal`, `assumptionsJson`, projection hidden-fields contract | `SUPPORTED_WITH_RUNTIME_REDACTION` |
| Advisor approval | `Approval`, `Recommendation.advisorApprovalId`, typed recommendation workflow transition contract | `SUPPORTED` |
| Compliance release | `ComplianceReview.status`, `releasedAt`, `blockedAt`, `Recommendation.complianceReviewId`, workflow gate | `SUPPORTED` |
| Evidence status/sufficiency | `EvidenceRecord.status`, `EvidenceItem.visibilityStatus`, `DocumentReview.status`, `evidenceService.evaluateEvidenceSufficiency` | `SUPPORTED_WITH_RUNTIME_DERIVATION` |
| Upload-only state | `Document.status`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord` creation plus upload service no-sufficiency safety | `SUPPORTED_WITH_RUNTIME_GUARD` |
| Audit persistence | `AuditEvent` minimum fields, `correlationId`, audit service critical metadata and persistence-required errors | `SUPPORTED` |
| Export status/redaction | `ExportRequest.status`, `scopeJson`, `redactionProfile`, `approvalRequired`, `approvedByUserId`, export service/package manifest | `SUPPORTED_WITH_METADATA_PACKAGE_PROOF` |
| Admin non-bypass | `Permission`, `RolePermission`, `AccessRequest`, `SecondConfirmation`, permission engine and audit guard | `SUPPORTED_WITH_RUNTIME_GUARD` |
| Data-quality release guard | `DataQualityIssue` plus data quality service gate | `SUPPORTED` |

## Migration Decision

`NO_MIGRATION_REQUIRED_FOR_WP11`.

The existing schema and runtime services support the V1.0 gates above. Patch-only concepts such as `AiDraft`, `ClientVisibilityEvaluation`, `PolicyException` and `VisibilityRule` remain blocked from blind creation. Any future schema change requires a specific accepted task, migration rationale, backwards-safe plan and tests. Existing baseline migrations remain limited to `20260614201128_init_phase_02` and `20260614202332_phase_03_data_model_seed`.

## Service Usage Alignment

- `lib/evidence-service.ts` uses typed evidence statuses and runtime sufficiency decisions instead of adding a new sufficiency model.
- `lib/audit-service.ts` uses existing `AuditEvent` fields and critical metadata rather than a parallel audit schema.
- `lib/export-service.ts` and `lib/export-package-service.ts` use existing export/redaction fields plus metadata-package proof instead of binary export schema expansion.
- `lib/workflow-gate.ts` centralizes advice/release/visibility gate taxonomies.
- `lib/visibility-engine.ts` projects existing recommendation, decision and document fields into client-safe payloads and hides internal fields.

## Blockers

No schema blocker was found for WP-00 through WP-11. Remaining broad MVP-readiness limits are workflow coverage and acceptance proof limits, not a required Prisma replacement.
