# SCHEMA_FIELD_LEVEL_RECONCILIATION.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Artefact status:** `SCHEMA_FIELD_LEVEL_RECONCILIATION_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

**Schema field-level gate status:** `SCHEMA_FIELD_LEVEL_GATE_CONTRACTED_NOT_IMPLEMENTED`

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact reconciles the current AlphaVest WealthOS full-workflow Prisma schema against the MVP Control Spec / patch schema / Domain Model / Data Dictionary and all predecessor safety/API contracts. The full-workflow schema remains the target baseline. The patch schema is a control-spec input only. No schema replacement, migration, code change, test, API change, Codex task or final handoff is authorized.

**Core decision:** the current full-workflow schema with **42 models** and **22 enums** is preserved as target code reality. Patch/control concepts such as `AiDraft`, `ClientVisibilityEvaluation`, `PolicyException`, `VisibilityRule`, `SourceReference`, `DocumentVerification`, `AdvisorApproval`, `DecisionRecord` and `ReviewRhythm` are mapped to existing full-workflow fields, relations, services or policy concepts where possible. Missing or partial concepts are documented as blockers or candidate-later decisions only. Codex remains blocked until the successor `P0_TEST_ACCEPTANCE_MATRIX.md` proves the required negative and positive safety cases.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
| --- | --- | --- |
| Artefact | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | PASS |
| Position | 11 of 15 | PASS |
| Direct predecessor | API_CONTRACT_MATRIX.md | PASS — exists and used |
| Direct successor | P0_TEST_ACCEPTANCE_MATRIX.md | PREPARED_ONLY |
| Required predecessors | MVP_SCOPE_LOCK.md through API_CONTRACT_MATRIX.md | PASS — all present and used |
| Codex status | CODEX_HANDOFF_NOT_READY | BLOCKED |
| Implementation status | No implementation | BLOCKED |
| Schema change status | No Prisma/schema/migration changes | BLOCKED |

## 3. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md | Roadmap control | Sequence, gates, dependencies, stop rules, Codex readiness | Bypassing sequence or starting Codex |
| 2 | API_CONTRACT_MATRIX.md | Binding direct predecessor | Existing API baseline, request/response/payload/schema dependencies, API gap routing | Treating API contract as implemented safety proof |
| 3 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Binding predecessor | Evidence sufficiency, audit persistence, export/redaction field needs | Weakening evidence/audit/export safety |
| 4 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | Binding predecessor | RBAC, route/action/object/payload visibility, AI Draft internal-only, no-unapproved-advice, admin non-bypass | Treating route access as payload visibility |
| 5 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | Binding predecessor | Validation, error, loading, success, permission and no-overclaim semantics | Treating feedback as implementation proof |
| 6 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Binding predecessor | Interaction lifecycle requirements and proof limits | Treating visible UI as field persistence proof |
| 7 | STATE_SCREEN_SPEC.md | Binding predecessor | State requirements that need field/status support | Reclassifying state scope |
| 8 | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md | Binding predecessor | State-screen workset, P1/reference/hold blockers | Authorizing generation |
| 9 | ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | Binding predecessor | Route/component/visual status and visual proof limits | Treating PNGs or visual states as schema proof |
| 10 | ROUTE_SCOPE_LOCK.md | Binding predecessor | Locked scope labels for all 71 routes | Reclassifying route scope |
| 11 | MVP_SCOPE_LOCK.md | Binding predecessor | MVP boundary, non-goals and P0 safety scope | Inventing conflicting MVP scope |
| 12 | ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md | Latest KB schema layer | Full-workflow 42-model / 22-enum baseline, patch/domain/data-dictionary mapping, known unresolved schema concepts | Treating schema gate as passed or replacing schema |
| 13 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Interaction reality layer | Implemented/partial/deterministic/static distinction | Treating UI presence as persistence proof |
| 14 | ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md | Route/visual/state layer | 71 routes, 63 public PNGs, unresolved 064–071 | Generating screens or assuming 63 PNGs cover 71 routes |
| 15 | ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md | Readiness layer | CODEX_HANDOFF_NOT_READY and open readiness gates | Overclaiming readiness |
| 16 | ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md | False-gap cleanup | Blocks main absence claims and patch-overwrite false assumptions | Target gaps/tasks from main |
| 17 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Validated inventory | 405 files, 71 routes, 4 APIs, 42 Prisma models, 10 specs, 63 PNGs | Treating inventory as MVP safety proof |
| 18 | ALPHAVEST_LIVING_KNOWLEDGE_BASE.md | Recovery/versioning protocol | Source hierarchy and version discipline | Letting v0.1 override newer layers |
| 19 | control-spec concepts represented in bundled markdown artefacts; no patch archive included | MVP Control Spec | Patch schema, Domain Model, Data Dictionary, Advice Boundary, RBAC, Client Visibility, Workflow, Acceptance Gates | Replacing full-workflow code/schema |
| 20 | local repository checkout / pull of target branch full-workflow | Primary target codebase | Target Prisma schema, migrations, seed, services, APIs, tests and code reality | Assuming all present code is ready |
| 21 | main branch as false-gap / historical only; never target truth | False-gap source only | Historical comparison only | Any target truth or Codex task |

## 4. Binding Predecessor Decisions

| Predecessor | Status | Binding Decision Used |
| --- | --- | --- |
| MVP_SCOPE_LOCK.md | PASS | MVP boundary and non-goals are binding. |
| ROUTE_SCOPE_LOCK.md | PASS | All 71 route scope labels are binding. |
| ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | PASS | Visual assets are reference only; no behaviour proof. |
| MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md | PASS | No screen/state-screen generation; state workset is defined. |
| STATE_SCREEN_SPEC.md | PASS | 31 MVP routes have required state specs; 25 support routes conditional. |
| DRAWER_MODAL_INTERACTION_CONTRACT.md | PASS | Interaction gate partial/not passed; visual overlays are not lifecycle proof. |
| FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | PASS | No-overclaim feedback rules bind schema semantics. |
| RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | PASS | Route/action/payload, AI Draft, client visibility and admin non-bypass rules bind schema mapping. |
| EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | PASS | Evidence, audit and export safety rules bind schema mapping. |
| API_CONTRACT_MATRIX.md | PASS | Four existing API routes and their schema dependencies bind this artefact. |

### 4.1 Locked Route Worksets

| Scope Label | Count | Route IDs | Schema Treatment |
| --- | --- | --- | --- |
| MVP | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 | Full field/safety/API/test mapping required. |
| MVP_SUPPORT | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 | Conditional field mapping where flow-relevant. |
| P1_AFTER_MVP | 5 | 052, 053, 059, 060, 068 | Deferred from MVP schema work unless later elevated. |
| REFERENCE_ONLY | 3 | 061, 062, 063 | No product schema implementation contract. |
| HOLD_PENDING_DECISION | 7 | 064, 065, 066, 067, 069, 070, 071 | No final field decisions until scope/safety unlock. |

## 5. Schema Baseline and Reconciliation Method

| Baseline Item | Observed / Required Treatment | Decision Label |
| --- | --- | --- |
| Full-workflow Prisma schema | Target baseline | KEEP_FULL_SCHEMA_AS_BASELINE |
| Full-workflow model count | 42 models | VALIDATED_SCHEMA_REALITY |
| Full-workflow enum count | 22 enums | VALIDATED_SCHEMA_REALITY |
| Patch schema | Control-spec input only | PATCH_CONTROL_SPEC_ONLY |
| Patch model count | 24 draft models | CONTROL_SPEC_INPUT |
| Patch enum candidates | 27 enum candidates | CONTROL_SPEC_INPUT |
| Migrations / seed | Support/history/demo evidence | NOT_READINESS_PROOF |
| Service / API / test usage | Proof slices | NOT_FULL_P0_PROOF |
| Schema readiness | Partial / not passed | CODEX_BLOCKED |

Method: validate sequence, lock source hierarchy, preserve full-workflow schema, intake patch/control concepts, map full fields/enums/relations to safety/API/test obligations, classify gaps, and route unresolved proof to `P0_TEST_ACCEPTANCE_MATRIX.md`. No Prisma change is authorized.

## 6. Field Mapping Vocabulary

| Label | Meaning |
| --- | --- |
| EXACT_FIELD_MATCH | Same field concept exists in full-workflow schema. |
| RENAMED_FIELD_MATCH | Concept exists under a different full-workflow field name. |
| SEMANTIC_FIELD_MATCH | Concept exists semantically through fields, enums, relations, services or policy logic. |
| PARTIAL_FIELD_MATCH | Field exists but does not cover all control-spec semantics. |
| MERGED_FIELD_CONCEPT | Patch/control concept is merged into broader full-workflow field/model. |
| SPLIT_FIELD_CONCEPT | Patch/control concept is split across multiple full-workflow fields/models. |
| ENUM_VALUE_MISMATCH | Equivalent state exists but enum values differ. |
| STRING_TAXONOMY_FIELD | Full-workflow uses String rather than enum/model. |
| JSON_POLICY_FIELD | Full-workflow stores policy/scope/rules in JSON requiring contract discipline. |
| SERVICE_DERIVED_FIELD | Value is derived by service/engine, not persisted directly. |
| MISSING_EXPLICIT_FIELD | No explicit field found in full-workflow schema. |
| MISSING_EXPLICIT_MODEL | No explicit model exists, but concept may be represented elsewhere. |
| INTENTIONALLY_NOT_PERSISTED | Concept should remain derived/runtime-only unless later task decides otherwise. |
| P1_OR_HOLD_FIELD_DEFERRED | Field relates to P1/hold scope and must not become MVP task now. |
| REQUIRES_SAFETY_PROOF | Field mapping depends on safety contract/test proof. |
| REQUIRES_API_CONTRACT_ALIGNMENT | Field mapping depends on API payload contract. |
| REQUIRES_P0_TEST_MAPPING | Field mapping must be proven later in P0 tests. |

## 7. Safety and Decision Vocabulary

### 7.1 Safety Labels

| Label | Meaning |
| --- | --- |
| RBAC_CRITICAL | Route/action/object/payload permission depends on field correctness. |
| CLIENT_VISIBILITY_CRITICAL | Client payload redaction/fail-closed visibility depends on field correctness. |
| ADVICE_BOUNDARY_CRITICAL | No-unapproved-advice depends on field correctness. |
| AI_DRAFT_INTERNAL_ONLY_CRITICAL | AI/rules draft must remain internal-only. |
| ADVISOR_APPROVAL_CRITICAL | Advisor approval must remain separate from compliance release. |
| COMPLIANCE_RELEASE_CRITICAL | Compliance release/block/precondition fields control release safety. |
| EVIDENCE_CRITICAL | Evidence sufficiency, review and linkage depend on field correctness. |
| AUDIT_CRITICAL | Audit persistence/traceability depends on field correctness. |
| EXPORT_CRITICAL | Export scope, redaction, approval and generated package depend on field correctness. |
| TENANT_ISOLATION_CRITICAL | Tenant/object scoping depends on field correctness. |
| ADMIN_NON_BYPASS_CRITICAL | Admin cannot bypass controlled gates. |
| UPLOAD_NOT_SUFFICIENCY_CRITICAL | Upload fields must not imply evidence sufficiency. |
| P1_DEFERRED | P1 field implication is deferred. |
| REFERENCE_ONLY | Reference page/schema implication is not MVP product behaviour. |

### 7.2 Decision Labels

| Label | Meaning |
| --- | --- |
| KEEP_FULL_FIELD_AS_BASELINE | Field remains accepted full-workflow baseline. |
| KEEP_ENUM_AS_BASELINE | Enum remains accepted full-workflow baseline. |
| NO_SCHEMA_CHANGE_NOW | No Prisma change authorized. |
| DOCUMENT_MAPPING_ONLY | Mapping is documented only. |
| CONTRACT_ALIGNMENT_REQUIRED | Later implementation must align usage with contracts. |
| P0_TEST_REQUIRED | Later test matrix must prove field behaviour. |
| BLOCKER_FOR_CODEX_TASK_MASTER | Cannot create task until resolved. |
| CANDIDATE_FOR_LATER_TASK_MASTER | May become task only after safety/API/P0 proof. |
| DEFER_TO_P1 | Not MVP field work. |
| HOLD_PENDING_SCOPE_UNLOCK | Held route/domain cannot be finalized. |
| DO_NOT_CREATE_PATCH_MODEL_NOW | Patch-only model must not be created here. |
| DO_NOT_REPLACE_FULL_SCHEMA | Full-workflow schema remains baseline. |
| DO_NOT_PASS_TO_CODEX_YET | Not ready for Codex. |

## 8. Full-Workflow Field Worksets

### 8.1 Domain Worksets

| Workset | Full-Workflow Models | Representative Fields | Safety Relevance | Scope Treatment |
| --- | --- | --- | --- | --- |
| Identity / Tenant | PlatformTenant, ClientTenant, User, UserProfile | ClientTenant.id/status/dataRegion/policyProfileId; User.status/mfaEnabled/isServiceAccount; UserProfile.sensitivity | TENANT_ISOLATION_CRITICAL; RBAC_CRITICAL | MVP_SUPPORT / MVP |
| RBAC / Permission | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation | Role.scope/requiresSecondConfirmation; Permission.objectType/action/requiresAudit/requiresComplianceReview; UserRole.objectType/objectId; RolePermission.conditionJson; AccessRequest.status; SecondConfirmation.status | RBAC_CRITICAL; ADMIN_NON_BYPASS_CRITICAL; AUDIT_CRITICAL | MVP_CORE |
| Policy / Guardrail | PolicyDefinition | policyKey/version/category/rulesJson/status/effectiveFrom | CLIENT_VISIBILITY_CRITICAL; ADVICE_BOUNDARY_CRITICAL; EXPORT_CRITICAL | MVP / MVP_SUPPORT |
| Client Context | FamilyMember, Relationship, ClientObjective, Entity, EntityParticipant, Asset | tenant links, sensitivity, status, object references | TENANT_ISOLATION_CRITICAL; NON_SAFETY_SUPPORT | MVP_SUPPORT / partial |
| Workflow Trigger / Actions | Trigger, ActionItem | status/clientVisible/evidenceStatus/blockedReason/triggerType | ADVICE_BOUNDARY_CRITICAL; CLIENT_VISIBILITY_CRITICAL; EVIDENCE_CRITICAL | MVP / MVP_SUPPORT / P1 |
| Recommendation / Advice | Recommendation, RecommendationOption | summaryInternal/clientSummaryDraft/adviceClassification/status/advisorApprovalId/complianceReviewId/clientVisible/assumptionsJson | AI_DRAFT_INTERNAL_ONLY_CRITICAL; ADVICE_BOUNDARY_CRITICAL; CLIENT_VISIBILITY_CRITICAL | MVP_CORE |
| Approval / Compliance / Decision | Approval, ComplianceReview, Decision, DecisionParticipant | Approval.status/approvedAt; ComplianceReview.status/evidenceComplete/releasedAt/blockedAt; Decision.status/releasedToClientAt/evidenceRecordId | ADVISOR_APPROVAL_CRITICAL; COMPLIANCE_RELEASE_CRITICAL; AUDIT_CRITICAL | MVP_CORE |
| Documents / Extraction / Review | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink | status/sensitivity/clientVisible/storageKey/checksum/extractionStatus/isClientVisible/review status/target links | UPLOAD_NOT_SUFFICIENCY_CRITICAL; EVIDENCE_CRITICAL; CLIENT_VISIBILITY_CRITICAL | MVP_CORE |
| Evidence | EvidenceRecord, EvidenceItem | status/relatedObjectType/relatedObjectId/visibilityStatus/reviewDate/hash | EVIDENCE_CRITICAL; CLIENT_VISIBILITY_CRITICAL; EXPORT_CRITICAL | MVP_CORE |
| Audit | AuditEvent | actorUserId/actorRoleKey/eventType/targetType/targetId/previousState/nextState/result/reason/correlationId/metadataJson | AUDIT_CRITICAL; ADMIN_NON_BYPASS_CRITICAL | MVP_CORE |
| Export | ExportRequest | exportType/status/scopeJson/redactionProfile/approvalRequired/approvedByUserId/generatedFileDocumentId/expiresAt | EXPORT_CRITICAL; REDACTION_CRITICAL; CLIENT_VISIBILITY_CRITICAL | MVP_CORE |
| Review Monitoring / Ops | ReviewSchedule, QueueItem, DataQualityIssue, CallEvent | targetType/targetId/cadence/nextReviewDate/status; queue/action SLA fields | REVIEW_MONITORING_CRITICAL; P1_DEFERRED | P1_AFTER_MVP / conditional |
| Communication | MessageThread, Message | clientVisible/requiresApproval/approvalId/status | CLIENT_VISIBILITY_CRITICAL; P1_DEFERRED | P1_AFTER_MVP |

### 8.2 Full Schema Model Inventory

| Model | Field Count | Representative Fields | Scope Label | Decision |
| --- | --- | --- | --- | --- |
| PlatformTenant | 13 | id:String, name:String, legalName:String?, status:TenantStatus, defaultTimezone:String, defaultLocale:String, createdAt:DateTime, updatedAt:DateTime, clientTenants:ClientTenant[], users:User[], roles:Role[], policies:PolicyDefinition[], … (+1) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ClientTenant | 47 | id:String, platformTenantId:String, platformTenant:PlatformTenant, displayName:String, legalName:String?, status:TenantStatus, jurisdiction:String?, relationshipTier:String?, primaryAdvisorUserId:String?, primaryAnalystUserId:String?, complianceOwnerUserId:String?, clientSuccessOwnerUserId:String?, … (+35) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| User | 17 | id:String, platformTenantId:String, platformTenant:PlatformTenant, email:String, displayName:String, status:UserStatus, mfaEnabled:Boolean, lastLoginAt:DateTime?, preferredLocale:String?, timezone:String?, isServiceAccount:Boolean, createdAt:DateTime, … (+5) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| UserProfile | 14 | id:String, userId:String, user:User, clientTenantId:String?, clientTenant:ClientTenant?, firstName:String?, lastName:String?, phone:String?, relationshipLabel:String?, countryOfResidence:String?, dateOfBirth:DateTime?, sensitivity:Sensitivity, … (+2) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Role | 16 | id:String, platformTenantId:String, platformTenant:PlatformTenant, clientTenantId:String?, clientTenant:ClientTenant?, key:String, name:String, description:String?, scope:RoleScope, isSystemRole:Boolean, requiresSecondConfirmation:Boolean, segregationGroup:String?, … (+4) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Permission | 12 | id:String, key:String, objectType:ObjectType, action:PermissionAction, description:String?, defaultSensitivityLimit:Sensitivity?, requiresAudit:Boolean, requiresSecondConfirmation:Boolean, requiresComplianceReview:Boolean, createdAt:DateTime, updatedAt:DateTime, rolePermissions:RolePermission[] | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| UserRole | 17 | id:String, userId:String, user:User, roleId:String, role:Role, clientTenantId:String?, clientTenant:ClientTenant?, entityId:String?, engagementId:String?, objectType:ObjectType?, objectId:String?, status:String, … (+5) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| RolePermission | 8 | id:String, roleId:String, role:Role, permissionId:String, permission:Permission, effect:String, conditionJson:Json?, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| AccessRequest | 15 | id:String, clientTenantId:String, clientTenant:ClientTenant, requesterUserId:String, targetUserId:String?, objectType:ObjectType, objectId:String, requestedAction:PermissionAction, reason:String, status:WorkflowStatus, reviewerUserId:String?, complianceRequired:Boolean, … (+3) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| SecondConfirmation | 13 | id:String, clientTenantId:String?, clientTenant:ClientTenant?, actorUserId:String, targetObjectType:ObjectType, targetObjectId:String, action:PermissionAction, confirmationPhrase:String?, confirmedByUserId:String?, status:String, expiresAt:DateTime?, createdAt:DateTime, … (+1) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ConsentRecord | 13 | id:String, clientTenantId:String?, clientTenant:ClientTenant?, userId:String, user:User, consentType:String, version:String, status:String, acceptedAt:DateTime?, withdrawnAt:DateTime?, source:String?, ipAddress:String?, … (+1) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Engagement | 23 | id:String, clientTenantId:String, clientTenant:ClientTenant, name:String, type:String, status:WorkflowStatus, ownerUserId:String, advisorUserId:String?, analystUserId:String?, complianceUserId:String?, startDate:DateTime?, targetEndDate:DateTime?, … (+11) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| FamilyMember | 14 | id:String, clientTenantId:String, clientTenant:ClientTenant, userId:String?, user:User?, displayName:String, relationshipType:String, dateOfBirth:DateTime?, taxResidency:String?, isPrincipal:Boolean, sensitivity:Sensitivity, createdAt:DateTime, … (+2) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Relationship | 14 | id:String, clientTenantId:String, clientTenant:ClientTenant, subjectType:ObjectType, subjectId:String, relationshipType:String, objectType:ObjectType, objectId:String, startDate:DateTime?, endDate:DateTime?, confidence:Decimal?, sourceDocumentId:String?, … (+2) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ClientObjective | 14 | id:String, clientTenantId:String, clientTenant:ClientTenant, ownerFamilyMemberId:String?, ownerFamilyMember:FamilyMember?, category:String, title:String, description:String?, priority:String?, timeHorizon:String?, status:WorkflowStatus, sensitivity:Sensitivity, … (+2) | REQUIRES_SCOPE_DECISION | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Entity | 16 | id:String, clientTenantId:String, clientTenant:ClientTenant, entityType:EntityType, name:String, jurisdiction:String?, registrationNumber:String?, status:String, ownerSummary:String?, riskRating:String?, dataQualityScore:Int?, sensitivity:Sensitivity, … (+4) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| EntityParticipant | 13 | id:String, clientTenantId:String, clientTenant:ClientTenant, entityId:String, entity:Entity, participantType:ObjectType, participantId:String, roleLabel:String, ownershipPercent:Decimal?, effectiveFrom:DateTime?, effectiveUntil:DateTime?, sourceDocumentId:String?, … (+1) | REQUIRES_SCOPE_DECISION | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Asset | 17 | id:String, clientTenantId:String, clientTenant:ClientTenant, entityId:String?, entity:Entity?, assetType:AssetType, name:String, jurisdiction:String?, currency:String?, valueBand:String?, estimatedValue:Decimal?, valuationDate:DateTime?, … (+5) | REQUIRES_SCOPE_DECISION | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Document | 26 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, uploadedByUserId:String, documentType:String, title:String, status:DocumentStatus, fileName:String?, mimeType:String?, fileSizeBytes:Int?, … (+14) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DocumentVersion | 9 | id:String, documentId:String, document:Document, versionNumber:Int, storageKey:String, checksum:String?, createdByUserId:String, changeReason:String?, createdAt:DateTime | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DocumentExtraction | 11 | id:String, documentId:String, document:Document, extractionStatus:String, confidenceScore:Decimal?, extractedFieldsJson:Json?, lowConfidenceFieldsJson:Json?, modelVersion:String?, isClientVisible:Boolean, createdAt:DateTime, updatedAt:DateTime | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DocumentReview | 10 | id:String, documentId:String, document:Document, reviewerUserId:String, reviewType:String, status:ReviewStatus, notes:String?, clientVisibleSummary:String?, reviewedAt:DateTime?, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DocumentLink | 8 | id:String, documentId:String, document:Document, targetType:ObjectType, targetId:String, relationship:String, createdByUserId:String, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Trigger | 18 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, source:String, triggerType:String, title:String, description:String?, severity:String, confidenceScore:Decimal?, status:WorkflowStatus, … (+6) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ActionItem | 19 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, triggerId:String?, trigger:Trigger?, title:String, description:String?, ownerUserId:String?, assignedRoleKey:String?, priority:String, … (+7) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Recommendation | 22 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, triggerId:String?, trigger:Trigger?, createdByUserId:String?, title:String, summaryInternal:String?, clientSummaryDraft:String?, adviceClassification:AdviceClassification, … (+10) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| RecommendationOption | 10 | id:String, recommendationId:String, recommendation:Recommendation, label:String, description:String?, prosJson:Json?, consJson:Json?, riskLevel:String?, isPreferred:Boolean, sortOrder:Int | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Approval | 12 | id:String, clientTenantId:String, clientTenant:ClientTenant, targetType:ObjectType, targetId:String, approverUserId:String, approverRoleKey:String, approvalType:String, status:ReviewStatus, notes:String?, approvedAt:DateTime?, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ComplianceReview | 18 | id:String, clientTenantId:String, clientTenant:ClientTenant, targetType:ObjectType, targetId:String, reviewerUserId:String, status:ComplianceStatus, adviceClassification:AdviceClassification, recordOfAdviceRequired:Boolean, recordOfAdviceDocumentId:String?, kycFicaStatus:String?, popiaConsentStatus:String?, … (+6) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Decision | 17 | id:String, clientTenantId:String, clientTenant:ClientTenant, recommendationId:String?, recommendation:Recommendation?, title:String, status:DecisionStatus, releasedToClientAt:DateTime?, decisionByUserId:String?, decisionAction:String?, decisionReason:String?, decisionAt:DateTime?, … (+5) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DecisionParticipant | 9 | id:String, decisionId:String, decision:Decision, userId:String?, roleKey:String?, required:Boolean, status:ReviewStatus, actedAt:DateTime?, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| EvidenceRecord | 17 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, title:String, status:EvidenceStatus, relatedObjectType:ObjectType, relatedObjectId:String, summary:String?, visibilityStatus:VisibilityStatus, retentionPolicy:String?, … (+5) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| EvidenceItem | 10 | id:String, evidenceRecordId:String, evidenceRecord:EvidenceRecord, itemType:String, sourceObjectType:ObjectType, sourceObjectId:String, title:String, visibilityStatus:VisibilityStatus, hash:String?, createdAt:DateTime | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| AuditEvent | 20 | id:String, platformTenantId:String, platformTenant:PlatformTenant, clientTenantId:String?, clientTenant:ClientTenant?, actorUserId:String?, actorRoleKey:String?, eventType:String, targetType:ObjectType, targetId:String, previousState:String?, nextState:String?, … (+8) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ReviewSchedule | 12 | id:String, clientTenantId:String, clientTenant:ClientTenant, targetType:ObjectType, targetId:String, cadence:String, nextReviewDate:DateTime, ownerUserId:String?, status:WorkflowStatus, lastCompletedAt:DateTime?, createdAt:DateTime, updatedAt:DateTime | MVP_SUPPORT / P1_DEPENDENT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| MessageThread | 15 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, subject:String, channel:CommunicationChannel, status:WorkflowStatus, clientVisible:Boolean, relatedObjectType:ObjectType?, relatedObjectId:String?, createdByUserId:String, … (+3) | P1_AFTER_MVP | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| Message | 10 | id:String, threadId:String, thread:MessageThread, senderUserId:String, body:String, clientVisible:Boolean, requiresApproval:Boolean, approvalId:String?, sentAt:DateTime?, createdAt:DateTime | P1_AFTER_MVP | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| CallEvent | 16 | id:String, clientTenantId:String, clientTenant:ClientTenant, engagementId:String?, engagement:Engagement?, relatedObjectType:ObjectType?, relatedObjectId:String?, escalationType:EscalationType, scheduledByUserId:String, scheduledFor:DateTime?, durationMinutes:Int?, status:WorkflowStatus, … (+4) | FUTURE/P1 | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| ExportRequest | 15 | id:String, clientTenantId:String, clientTenant:ClientTenant, requestedByUserId:String, exportType:ExportType, status:ExportStatus, scopeJson:Json, redactionProfile:String, approvalRequired:Boolean, approvedByUserId:String?, generatedFileDocumentId:String?, generatedFileDocument:Document?, … (+3) | MVP_CORE | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| PolicyDefinition | 15 | id:String, platformTenantId:String, platformTenant:PlatformTenant, clientTenantId:String?, clientTenant:ClientTenant?, policyKey:String, name:String, version:String, category:String, rulesJson:Json, status:String, createdByUserId:String, … (+3) | MVP_SUPPORT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| QueueItem | 14 | id:String, clientTenantId:String, clientTenant:ClientTenant, queueName:String, targetType:ObjectType, targetId:String, assignedToUserId:String?, assignedRoleKey:String?, priority:String, status:WorkflowStatus, slaDueAt:DateTime?, escalated:Boolean, … (+2) | P1_AFTER_MVP | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |
| DataQualityIssue | 12 | id:String, clientTenantId:String, clientTenant:ClientTenant, targetType:ObjectType, targetId:String, severity:String, issueType:String, description:String, status:WorkflowStatus, ownerUserId:String?, createdAt:DateTime, updatedAt:DateTime | MVP_SUPPORT / P1_DEPENDENT | FULL_WORKFLOW_SCHEMA_REALITY; KEEP_FULL_SCHEMA_AS_BASELINE |

## 9. Patch / Control-Spec Field Concept Intake

| Patch / Control Concept | Full-Workflow Representation | Mapping Label | Safety Label | Decision |
| --- | --- | --- | --- | --- |
| TenantFamily | ClientTenant + PlatformTenant | RENAMED_FIELD_MATCH / SPLIT_FIELD_CONCEPT | TENANT_ISOLATION_CRITICAL | KEEP_FULL_SCHEMA_AS_BASELINE; map family context to ClientTenant; no patch model creation |
| User | User + UserProfile | PARTIAL_FIELD_MATCH | RBAC_CRITICAL; CLIENT_VISIBILITY_CRITICAL | Keep full User baseline; profile/person fields stay in UserProfile |
| Role | Role | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL | RoleType maps to Role.key/scope; do not replace enum |
| Permission | Permission | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL; AUDIT_CRITICAL | PermissionGroup maps to objectType/action/flags |
| RolePermission | RolePermission | EXACT_FIELD_MATCH / PARTIAL_FIELD_MATCH | RBAC_CRITICAL | conditionJson remains policy field requiring tests |
| RoleAssignment | UserRole | RENAMED_FIELD_MATCH | RBAC_CRITICAL; TENANT_ISOLATION_CRITICAL | RoleAssignment semantics map to UserRole |
| Signal | Trigger | RENAMED_OR_MERGED_FIELD_CONCEPT | ADVICE_BOUNDARY_CRITICAL | Signal concept maps into Trigger source/triggerType/status |
| Trigger | Trigger | PARTIAL_FIELD_MATCH | ADVICE_BOUNDARY_CRITICAL | Patch Trigger is more signal-linked; full Trigger is broader |
| AiDraft | Recommendation | MERGED_FIELD_CONCEPT; MISSING_EXPLICIT_MODEL | AI_DRAFT_INTERNAL_ONLY_CRITICAL | Do not create AiDraft now; map to Recommendation.status/summaryInternal/clientSummaryDraft |
| Recommendation | Recommendation | PARTIAL_FIELD_MATCH | ADVICE_BOUNDARY_CRITICAL; CLIENT_VISIBILITY_CRITICAL | Keep target Recommendation; map status/client fields carefully |
| AnalystReview | Recommendation.status + Approval? + AuditEvent | SEMANTIC_FIELD_MATCH / PARTIAL_FIELD_MATCH | ADVICE_BOUNDARY_CRITICAL; AUDIT_CRITICAL | No explicit AnalystReview model; represent through workflow status/audit until proven insufficient |
| AdvisorApproval | Approval + Recommendation.advisorApprovalId | RENAMED_FIELD_MATCH | ADVISOR_APPROVAL_CRITICAL | Generic Approval model covers advisor approval; keep separation from ComplianceReview |
| ComplianceReview | ComplianceReview | EXACT_FIELD_MATCH / ENUM_VALUE_MISMATCH | COMPLIANCE_RELEASE_CRITICAL | Full model exists but enum/status semantics require contract alignment |
| EvidenceRecord | EvidenceRecord + EvidenceItem | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL | Patch source refs split into Document/DocumentLink/EvidenceItem |
| SourceReference | DocumentLink + EvidenceItem + Document source/checksum | SEMANTIC_FIELD_MATCH; MISSING_EXPLICIT_MODEL | EVIDENCE_CRITICAL | Do not add SourceReference now; map through existing links/items/source fields |
| Document | Document + DocumentVersion + DocumentExtraction + DocumentReview | SPLIT_FIELD_CONCEPT | UPLOAD_NOT_SUFFICIENCY_CRITICAL; EVIDENCE_CRITICAL | Full schema is richer; upload status maps to DocumentStatus/extraction/review states |
| DocumentVerification | DocumentReview + DocumentExtraction + Document.status | SEMANTIC_FIELD_MATCH; MISSING_EXPLICIT_MODEL | EVIDENCE_CRITICAL | Verification is process-derived; no new model now |
| DecisionRecord | Decision | RENAMED_FIELD_MATCH | CLIENT_VISIBILITY_CRITICAL; ADVICE_BOUNDARY_CRITICAL | DecisionRecord maps to Decision |
| ActionItem | ActionItem | EXACT_FIELD_MATCH / ENUM_VALUE_MISMATCH | CLIENT_VISIBILITY_CRITICAL | Full uses WorkflowStatus and EvidenceStatus |
| ReviewRhythm | ReviewSchedule | RENAMED_FIELD_MATCH | REVIEW_MONITORING_CRITICAL; P1_DEFERRED | Default P1 unless elevated by safety decision |
| VisibilityRule | PolicyDefinition + visibility-engine | SEMANTIC_FIELD_MATCH; MISSING_EXPLICIT_MODEL | CLIENT_VISIBILITY_CRITICAL | RulesJson/service-derived; no table creation now |
| ClientVisibilityEvaluation | VisibilityStatus fields + AuditEvent + visibility-engine | MISSING_EXPLICIT_MODEL | CLIENT_VISIBILITY_CRITICAL | Core open blocker: decide if persistence is required; no schema change now |
| PolicyException | AccessRequest + SecondConfirmation + ComplianceReview + PolicyDefinition | MISSING_EXPLICIT_MODEL / SEMANTIC_FIELD_MATCH | ADMIN_NON_BYPASS_CRITICAL; AUDIT_CRITICAL | Candidate later only if safety proof shows explicit exception persistence needed |
| AuditEvent | AuditEvent | EXACT_FIELD_MATCH / EVENT_TAXONOMY_MISMATCH | AUDIT_CRITICAL | Full eventType is String; patch event enum is input, not replacement |

## 10. Field-Level Reconciliation Matrix

| Full-Workflow Model | Full-Workflow Field(s) | Field Type | Enum / Relation | Patch / Control Concept | Mapping Label | Safety Label | API Dependency | State / Feedback Dependency | Test Dependency | Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ClientTenant | id, platformTenantId | String | relation to PlatformTenant | TenantFamily.tenantId / family scope | RENAMED_FIELD_MATCH | TENANT_ISOLATION_CRITICAL | all APIs | permission / hidden states | cross-tenant negative tests | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | Tenant isolation is baseline but must be proven in APIs. |
| ClientTenant | status | TenantStatus | enum | TenantStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | TENANT_ISOLATION_CRITICAL | deleted generic workflow route | disabled / blocked tenant states | inactive tenant negative tests | KEEP_ENUM_AS_BASELINE | Patch lower-case statuses map semantically only. |
| ClientTenant | policyProfileId, dataRegion, riskRating | String? | scalar | tenant policy / region / risk context | PARTIAL_FIELD_MATCH | CLIENT_VISIBILITY_CRITICAL; RBAC_CRITICAL | typed workflow | policy/region blocked states | policy scope tests | CONTRACT_ALIGNMENT_REQUIRED | Supports policy context but does not prove enforcement. |
| User | status, mfaEnabled, isServiceAccount | UserStatus / Boolean | enum/scalar | UserStatus; service actor | PARTIAL_FIELD_MATCH | RBAC_CRITICAL; ADMIN_NON_BYPASS_CRITICAL | auth/demo APIs | permission denied / locked states | auth/RBAC negative tests | KEEP_FULL_FIELD_AS_BASELINE | Production IAM not in MVP scope; demo auth states are support only. |
| UserProfile | clientTenantId, sensitivity | String? / Sensitivity | relation/enum | user profile scope / sensitivity level | SEMANTIC_FIELD_MATCH | CLIENT_VISIBILITY_CRITICAL; RBAC_CRITICAL | document/API payloads if profile exposed | redacted/internal states | profile leakage tests | P0_TEST_REQUIRED if exposed | Sensitivity is usable but must be payload enforced. |
| Role | key, scope, requiresSecondConfirmation, segregationGroup | String / RoleScope / Boolean | enum/scalar | RoleType; governance segregation | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL; ADMIN_NON_BYPASS_CRITICAL | typed workflow; governance APIs if connected | permission denied / second confirmation states | admin non-bypass tests | KEEP_FULL_FIELD_AS_BASELINE; CONTRACT_ALIGNMENT_REQUIRED | RoleType is not copied; Role.key/scope stay baseline. |
| Permission | key, objectType, action | String / ObjectType / PermissionAction | enum | Permission.permissionKey / PermissionGroup | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL | all API contracts | permission denied feedback | route/action negative tests | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | Route access must not imply action permission. |
| Permission | requiresAudit, requiresSecondConfirmation, requiresComplianceReview | Boolean | flags | auditRequired / compliance gates | EXACT_FIELD_MATCH / SEMANTIC_FIELD_MATCH | AUDIT_CRITICAL; COMPLIANCE_RELEASE_CRITICAL | typed workflow; governance | disabled/blocked states | audit/compliance required tests | CONTRACT_ALIGNMENT_REQUIRED | Flags support gate intent but behaviour proof remains open. |
| RolePermission | effect, conditionJson | String / Json | policy relation | RolePermission conditions | PARTIAL_FIELD_MATCH; JSON_POLICY_FIELD | RBAC_CRITICAL | typed workflow; permission engine | permission denied / fail closed | condition negative tests | P0_TEST_REQUIRED | JSON policy must fail closed; not proof by itself. |
| UserRole | clientTenantId, entityId, engagementId, objectType, objectId, status | String? / ObjectType? | object scope | RoleAssignment tenant/object scope | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL; OBJECT_SCOPE_CRITICAL | all APIs | permission denied / hidden state | object scope leakage tests | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | Core route/action/object scope field set. |
| AccessRequest | objectType, objectId, requestedAction, status, complianceRequired | ObjectType / PermissionAction / WorkflowStatus / Boolean | workflow/policy exception | PolicyException / access request | SEMANTIC_FIELD_MATCH | RBAC_CRITICAL; ADMIN_NON_BYPASS_CRITICAL; AUDIT_CRITICAL | typed workflow; governance | approval pending / blocked | admin bypass tests | CONTRACT_ALIGNMENT_REQUIRED | May cover policy exceptions unless later explicit model is justified. |
| SecondConfirmation | targetObjectType, targetObjectId, action, confirmationPhrase, status | ObjectType / PermissionAction / String | confirmation | second confirmation / policy exception | SEMANTIC_FIELD_MATCH | ADMIN_NON_BYPASS_CRITICAL; AUDIT_CRITICAL | typed workflow; governance | validation failed / confirmation state | confirmation phrase tests | P0_TEST_REQUIRED | Confirmation phrase/state must not be visual only. |
| PolicyDefinition | policyKey, version, category, rulesJson, status | String / Json | policy JSON | VisibilityRule / AdviceBoundaryPolicy | SEMANTIC_FIELD_MATCH; JSON_POLICY_FIELD | CLIENT_VISIBILITY_CRITICAL; ADVICE_BOUNDARY_CRITICAL; EXPORT_CRITICAL | typed workflow; later policy APIs | blocked / permission / redaction states | policy fail-closed tests | CONTRACT_ALIGNMENT_REQUIRED | JSON policy is baseline but requires engine/test proof. |
| Trigger | source, triggerType, status, clientVisible | String / WorkflowStatus / Boolean | workflow/client flag | Signal / Trigger / SignalStatus | RENAMED_OR_MERGED_FIELD_CONCEPT | ADVICE_BOUNDARY_CRITICAL; CLIENT_VISIBILITY_CRITICAL | deleted generic workflow route; /api/review-monitoring | internal-only / release pending | no client release tests | P0_TEST_REQUIRED | clientVisible alone cannot prove safe visibility. |
| ActionItem | status, evidenceStatus, clientVisible, blockedReason | WorkflowStatus / EvidenceStatus? / Boolean | workflow/evidence/client flag | ActionStatus / action evidence | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | CLIENT_VISIBILITY_CRITICAL; EVIDENCE_CRITICAL | deleted generic workflow route; /api/review-monitoring | blocked / needs evidence | no auto advice / no client release tests | CONTRACT_ALIGNMENT_REQUIRED | Action state cannot imply advice execution. |
| Recommendation | summaryInternal, clientSummaryDraft | String? | payload fields | AiDraft.draftText / Recommendation.clientSafeSummary | MERGED_FIELD_CONCEPT | AI_DRAFT_INTERNAL_ONLY_CRITICAL; CLIENT_VISIBILITY_CRITICAL | deleted generic workflow route; export flow | redacted/internal-only | AI draft leakage tests | BLOCKER_FOR_CODEX_TASK_MASTER if not payload-mapped | Internal vs client draft boundary must be explicit. |
| Recommendation | adviceClassification, status | AdviceClassification / RecommendationStatus | enum | RecommendationType/Status; AiDraftStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | ADVICE_BOUNDARY_CRITICAL | deleted generic workflow route | approval/release pending | no-unapproved-advice tests | P0_TEST_REQUIRED | Target status enum remains baseline but patch status taxonomy informs tests. |
| Recommendation | advisorApprovalId, complianceReviewId, clientVisible | String? / Boolean | links/client flag | AdvisorApproval + ComplianceReview + VisibilityEvaluation | PARTIAL_FIELD_MATCH | ADVISOR_APPROVAL_CRITICAL; COMPLIANCE_RELEASE_CRITICAL; CLIENT_VISIBILITY_CRITICAL | deleted generic workflow route | release pending / hidden | advisor approval not release tests | P0_TEST_REQUIRED | clientVisible flag must be derived/fail-closed, not manual proof. |
| Approval | targetType, targetId, approverUserId, approverRoleKey, approvalType, status, approvedAt | ObjectType / String / ReviewStatus | generic approval | AdvisorApproval | RENAMED_FIELD_MATCH | ADVISOR_APPROVAL_CRITICAL; AUDIT_CRITICAL | deleted generic workflow route | approval pending / success limited | approval-not-release tests | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | Generic approval covers advisor approval but not compliance release. |
| ComplianceReview | status, adviceClassification, evidenceComplete, releasedAt, blockedAt | ComplianceStatus / AdviceClassification / Boolean / DateTime? | compliance gate | ComplianceClearanceStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | COMPLIANCE_RELEASE_CRITICAL; EVIDENCE_CRITICAL | deleted generic workflow route | compliance blocked / release pending | release precondition tests | P0_TEST_REQUIRED | evidenceComplete must not be set by upload alone. |
| ComplianceReview | recordOfAdviceRequired, recordOfAdviceDocumentId, releaseNotes | Boolean / String? | ROA and release data | Compliance Review docs | PARTIAL_FIELD_MATCH | ADVICE_BOUNDARY_CRITICAL; EXPORT_CRITICAL | deleted generic workflow route; export | needs document / redaction pending | ROA/export tests | CONTRACT_ALIGNMENT_REQUIRED | Release notes may be internal; export redaction required. |
| Decision | status, releasedToClientAt, decisionByUserId, decisionReason, evidenceRecordId | DecisionStatus / DateTime? / String? | decision record | DecisionRecord | RENAMED_FIELD_MATCH | CLIENT_VISIBILITY_CRITICAL; ADVICE_BOUNDARY_CRITICAL; EVIDENCE_CRITICAL | deleted generic workflow route; export | decision submitted / client hidden | decision release tests | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | releasedToClientAt cannot bypass compliance/visibility. |
| Document | status, sensitivity, clientVisible | DocumentStatus / Sensitivity / Boolean | document status/internalOnly | DocumentUploadStatus / internalOnly | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | UPLOAD_NOT_SUFFICIENCY_CRITICAL; CLIENT_VISIBILITY_CRITICAL | /api/documents; /api/documents/upload | upload success / redacted | upload-not-release tests | P0_TEST_REQUIRED | clientVisible is not sufficiency or release proof. |
| Document | storageKey, checksum, fileName, mimeType, fileSizeBytes | String? / Int? | storage metadata | Document.storageReference/fileType | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; EXPORT_CRITICAL | /api/documents/upload | upload failed / retry | file validation tests | KEEP_FULL_FIELD_AS_BASELINE | Storage fields may be internal; client payload redaction required. |
| DocumentVersion | versionNumber, storageKey, checksum, changeReason | Int / String / String? | version trace | document verification/source reference | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; AUDIT_CRITICAL | /api/documents/upload | audit unavailable / retry | version/audit tests | CONTRACT_ALIGNMENT_REQUIRED | Version creation is traceability, not sufficiency. |
| DocumentExtraction | extractionStatus, confidenceScore, extractedFieldsJson, lowConfidenceFieldsJson, isClientVisible | String / Decimal? / Json? / Boolean | extraction review | DocumentVerification | SEMANTIC_FIELD_MATCH; JSON_POLICY_FIELD | EVIDENCE_CRITICAL; CLIENT_VISIBILITY_CRITICAL | /api/documents; upload | needs review / low confidence | extraction review tests | P0_TEST_REQUIRED | Low-confidence extraction cannot unlock evidence sufficiency. |
| DocumentReview | status, notes, clientVisibleSummary, reviewedAt | ReviewStatus / String? | human review | DocumentVerification / EvidenceStatus.reviewed | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; CLIENT_VISIBILITY_CRITICAL | /api/documents | review pending / reviewed | unreviewed document tests | P0_TEST_REQUIRED | Review summary may be client-safe only if released/redacted. |
| DocumentLink | targetType, targetId, relationship | ObjectType / String | source/object link | SourceReference / linkedObject | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; OBJECT_SCOPE_CRITICAL | /api/documents/upload; typed workflow | needs evidence / wrong object | cross-object leakage tests | P0_TEST_REQUIRED | Evidence link scope must be explicit. |
| EvidenceRecord | status, relatedObjectType, relatedObjectId, visibilityStatus, reviewDate | EvidenceStatus / ObjectType / VisibilityStatus | evidence container | EvidenceRecord.evidenceStatus/link | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; CLIENT_VISIBILITY_CRITICAL | /api/documents/upload; typed workflow | needs evidence / hidden | evidence sufficiency tests | P0_TEST_REQUIRED | Evidence status is contextual; upload does not set sufficiency. |
| EvidenceItem | sourceObjectType, sourceObjectId, visibilityStatus, hash | ObjectType / String / VisibilityStatus | source item | SourceReference / EvidenceType | SEMANTIC_FIELD_MATCH | EVIDENCE_CRITICAL; EXPORT_CRITICAL | /api/documents/upload | redacted / hidden | item visibility tests | CONTRACT_ALIGNMENT_REQUIRED | Hash/source fields support trace but not review sufficiency. |
| AuditEvent | actorUserId, actorRoleKey, eventType, targetType, targetId, previousState, nextState, result, reason, correlationId, metadataJson | String? / ObjectType / AuditResult / Json? | audit event | AuditEventType / beforeState / afterState | SEMANTIC_FIELD_MATCH / EVENT_TAXONOMY_MISMATCH | AUDIT_CRITICAL; ADMIN_NON_BYPASS_CRITICAL | all APIs | audit unavailable / fail closed | audit persistence tests | P0_TEST_REQUIRED | eventType is String; patch enum informs taxonomy only. |
| ExportRequest | exportType, status, scopeJson, redactionProfile, approvalRequired, approvedByUserId, generatedFileDocumentId | ExportType / ExportStatus / Json / String | export safety | export/redaction acceptance gates | SEMANTIC_FIELD_MATCH; JSON_POLICY_FIELD | EXPORT_CRITICAL; REDACTION_CRITICAL | deleted generic workflow route export actions | redaction pending / export failed | export leakage tests | P0_TEST_REQUIRED | scopeJson must not expand payload beyond permissions. |
| ReviewSchedule | targetType, targetId, cadence, nextReviewDate, status | ObjectType / String / WorkflowStatus | review rhythm | ReviewRhythm | RENAMED_FIELD_MATCH / ENUM_VALUE_MISMATCH | REVIEW_MONITORING_CRITICAL; P1_DEFERRED | /api/review-monitoring | due/overdue state | no-auto-advice tests | DEFER_TO_P1 unless elevated | Review monitoring is P1 default and must not imply advice execution. |
| QueueItem | targetType, targetId, queueType, status, priority, assignedRoleKey | ObjectType / String / WorkflowStatus | ops queue | ActionStatus / operations | SEMANTIC_FIELD_MATCH | P1_DEFERRED | /api/review-monitoring if connected | queue empty / SLA | P1 tests later | DEFER_TO_P1 | Ops queues are not MVP core. |
| DataQualityIssue | targetType, targetId, severity, issueType, status | ObjectType / String / WorkflowStatus | data quality | Data Dictionary quality terms | SEMANTIC_FIELD_MATCH | DATA_QUALITY_SUPPORT; P1_DEFERRED | data quality service | validation failed / blocked | future tests | DEFER_TO_P1 unless safety-linked | Supports data quality but not MVP release by itself. |

## 11. Enum-Level Reconciliation Matrix

| Full-Workflow Enum | Values | Patch / Control Enum or Status Concept | Mapping Label | Safety Relevance | Mismatch / Gap | Decision | Test Routing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TenantStatus | DRAFT, ONBOARDING, ACTIVE, SUSPENDED, ARCHIVED | TenantStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | tenant active/inactive/archive semantics | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; map lower-case patch values semantically | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| UserStatus | INVITED, ACTIVE, SUSPENDED, LOCKED, ARCHIVED | UserStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | user access state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| RoleScope | PLATFORM, TENANT, ENTITY, ENGAGEMENT, DOCUMENT, DECISION | RoleType / PermissionGroup | SEMANTIC_FIELD_MATCH | role breadth and object scope | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; Role.key carries role type | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| ObjectType | PLATFORM, TENANT, USER, ROLE, PERMISSION, FAMILY_MEMBER, RELATIONSHIP, ENGAGEMENT, ENTITY, ASSET, DOCUMENT, TRIGGER, ACTION_ITEM, RECOMMENDATION, DECISION, EVIDENCE_RECORD, AUDIT_EVENT, EXPORT_REQUEST, MESSAGE, REVIEW_SCHEDULE, POLICY, QUEUE_ITEM, DATA_QUALITY_ISSUE | PermissionGroup / linkedObjectType / objectType | SEMANTIC_FIELD_MATCH | object scope and audit target | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| PermissionAction | VIEW, CREATE, EDIT, DELETE, UPLOAD, REVIEW, APPROVE, RELEASE, BLOCK, EXPORT, INVITE, ASSIGN, REVOKE, COMMENT, SCHEDULE, ESCALATE, MANAGE | PermissionGroup / action semantics | SEMANTIC_FIELD_MATCH | action permission | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| Sensitivity | PUBLIC, CLIENT_VISIBLE, CONFIDENTIAL, RESTRICTED, HIGHLY_RESTRICTED, INTERNAL_ONLY | SensitivityLevel | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | payload visibility and redaction | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| VisibilityStatus | INTERNAL_ONLY, ADVISOR_VISIBLE, COMPLIANCE_VISIBLE, CLIENT_VISIBLE, RESTRICTED, REDACTED | VisibilityEvaluationStatus | PARTIAL_FIELD_MATCH | client visibility result | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; explicit evaluation status missing | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| WorkflowStatus | DRAFT, NEW, IN_REVIEW, AWAITING_INFO, ANALYST_REVIEW, ADVISOR_REVIEW, COMPLIANCE_PENDING, READY_FOR_CLIENT, CLIENT_VISIBLE, COMPLETED, DEFERRED, BLOCKED, REJECTED, ARCHIVED | SignalStatus / ActionStatus / ReviewStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | workflow state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| DocumentStatus | EMPTY, UPLOADING, UPLOADED, AI_EXTRACTED, CLIENT_CONFIRMED, ANALYST_REVIEW_PENDING, VERIFIED, NEEDS_CLARIFICATION, BLOCKED, LINKED_TO_EVIDENCE, ARCHIVED | DocumentUploadStatus / DocumentVerificationStatus | PARTIAL_FIELD_MATCH / ENUM_VALUE_MISMATCH | upload and verification states | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; map upload vs verification through review/extraction too | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| ReviewStatus | NOT_STARTED, PENDING, IN_REVIEW, APPROVED, REVISED, REJECTED, REQUEST_MORE_DATA, ESCALATED_TO_CALL, COMPLETED | AnalystReviewStatus / AdvisorApprovalStatus / ReviewStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | review/approval state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| ComplianceStatus | NOT_REQUIRED, PENDING, IN_REVIEW, RELEASED, BLOCKED, NEEDS_EVIDENCE, EXCEPTION, EXPIRED | ComplianceClearanceStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | compliance release/block | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| AdviceClassification | INFORMATION, WORKFLOW, GUIDANCE, ADVICE_RELEVANT, ADVICE, OUT_OF_SCOPE | RecommendationType / advice-boundary rules | SEMANTIC_FIELD_MATCH | advice boundary classification | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| RecommendationStatus | DRAFT, AI_DRAFT, ANALYST_REVIEWED, ADVISOR_PENDING, ADVISOR_APPROVED, REVISION_REQUESTED, MORE_DATA_REQUESTED, COMPLIANCE_PENDING, RELEASED_TO_CLIENT, BLOCKED, CLIENT_ACCEPTED, CLIENT_DEFERRED, CLIENT_REJECTED, ARCHIVED | RecommendationStatus / AiDraftStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | draft, review, approval, compliance, release state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; identify AI draft states | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| DecisionStatus | DRAFT, RELEASED_TO_CLIENT, AWAITING_FAMILY_APPROVAL, ACCEPTED, DEFERRED, REJECTED, EVIDENCE_CREATED, REVIEW_SCHEDULED, ARCHIVED | DecisionStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | decision state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| EvidenceStatus | PLACEHOLDER, CREATED, LINKED, VALIDATED, RELEASED, RESTRICTED, ARCHIVED, SUPERSEDED | EvidenceStatus | SEMANTIC_FIELD_MATCH / ENUM_VALUE_MISMATCH | evidence review/sufficiency state | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| ExportStatus | DRAFT, SCOPE_SELECTED, REDACTION_PENDING, APPROVAL_REQUIRED, APPROVED, GENERATED, DOWNLOADED, EXPIRED, REVOKED, FAILED | export acceptance gates | SEMANTIC_FIELD_MATCH | export scope/redaction/approval/download | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| CommunicationChannel | SECURE_MESSAGE, EMAIL, PHONE, VIDEO, IN_PERSON, SYSTEM_NOTIFICATION | not explicit patch enum | P1_OR_HOLD_FIELD_DEFERRED | communication centre P1 | Value names may differ; no replacement now | DEFER_TO_P1 | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| EscalationType | NONE, REQUEST_DATA, ADVISOR_CALL, F2F_WORKSHOP, EXTERNAL_SPECIALIST, COMPLIANCE_ESCALATION, SECURITY_PRIVACY_REVIEW | ops/review rhythm concepts | P1_OR_HOLD_FIELD_DEFERRED | operations/escalation P1 | Value names may differ; no replacement now | DEFER_TO_P1 | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| AuditResult | SUCCESS, DENIED, BLOCKED, FAILED, PENDING, WARNING | AuditEventType plus result semantics | SEMANTIC_FIELD_MATCH | audit success/failure | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; eventType remains String | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| EntityType | TRUST, COMPANY, FOUNDATION, PARTNERSHIP, INDIVIDUAL, FAMILY_OFFICE, OTHER | domain context | SEMANTIC_FIELD_MATCH | client/entity context | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; support scope | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| AssetType | PORTFOLIO, BANK_ACCOUNT, REAL_ESTATE, INSURANCE_POLICY, BUSINESS_INTEREST, LIQUIDITY, TAX_RESIDENCY, OTHER | domain context | SEMANTIC_FIELD_MATCH | asset context | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE; support scope | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |
| ExportType | CLIENT_DECISION_PACK, EVIDENCE_PACKAGE, COMPLIANCE_AUDIT_PACK, EXTERNAL_ADVISOR_DATA_ROOM, TENANT_DATA_INVENTORY, USER_ACCESS_REPORT, ACTIVITY_LOG_EXPORT, PILOT_METRICS_EXPORT | export/redaction gates | SEMANTIC_FIELD_MATCH | export packaging | Value names may differ; no replacement now | KEEP_ENUM_AS_BASELINE | P0_TEST_ACCEPTANCE_MATRIX if safety-critical |

## 12. Relation-Level Reconciliation Matrix

| Relation Area | Full-Workflow Relation(s) | Patch / Domain Concept | Required Safety Meaning | Mapping Label | Gap / Risk | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Tenant isolation | PlatformTenant -> ClientTenant; ClientTenant -> UserRole/Documents/Recommendations/Evidence/Exports/Audit | TenantFamily tenant scope | Every API and payload must stay tenant/object scoped | SEMANTIC_FIELD_MATCH | Tenant ID presence is not access proof | P0 cross-tenant negative tests required |
| User-role-permission | User -> UserRole -> Role -> RolePermission -> Permission | RoleAssignment / RolePermission | Route/action/object/payload permissions | RENAMED_FIELD_MATCH | Role.key/scope and JSON conditions require engine proof | Keep baseline; no schema change now |
| Access exception / second confirmation | AccessRequest + SecondConfirmation + PolicyDefinition | PolicyException / VisibilityRule | Sensitive permissions require review/confirmation/audit | SEMANTIC_FIELD_MATCH / MISSING_EXPLICIT_MODEL | No explicit PolicyException model | Candidate later only if safety proof requires |
| Recommendation approval chain | Trigger -> Recommendation -> Approval -> ComplianceReview -> Decision | Signal/AiDraft/AdvisorApproval/ComplianceReview/DecisionRecord | Draft internal-only, advisor approval separate, compliance release required | MERGED/SPLIT_FIELD_CONCEPT | No explicit AiDraft; generic Approval | Map and test before Codex |
| Document/evidence chain | Document -> DocumentVersion/Extraction/Review/Link -> EvidenceRecord -> EvidenceItem | Document/DocumentVerification/SourceReference/EvidenceRecord | Upload, review, link and sufficiency are separate | SPLIT_FIELD_CONCEPT | DocumentVerification/SourceReference not explicit | No schema change; test upload-not-sufficiency |
| Audit target relation | AuditEvent targetType/targetId + tenant/actor relations | AuditEvent before/after state | Gate actions require persisted audit | SEMANTIC_FIELD_MATCH | target polymorphism not hard relational; eventType String | P0 audit persistence tests required |
| Export package relation | ExportRequest -> generatedFileDocument: Document | Export package / redaction approval | Export scope/redaction/approval/download must be separated | SEMANTIC_FIELD_MATCH | scopeJson/redactionProfile need contract discipline | P0 export leakage tests required |
| Review monitoring | ReviewSchedule + Trigger + ActionItem + QueueItem | ReviewRhythm | Review due/overdue must not trigger auto advice | RENAMED_FIELD_MATCH | P1 default; safety if elevated | Defer unless route scope changes |
| Communication visibility | MessageThread -> Message; clientVisible / requiresApproval | communication/payload visibility | Client-safe communication only | PARTIAL_FIELD_MATCH | P1 default; client visibility risk if surfaced | Defer to P1 unless MVP route exposes it |

## 13. API-to-Field Dependency Matrix

| API Route | Request / Response Field | Full-Workflow Schema Field(s) | Safety Requirement | Mapping Decision | Gap | P0 Test Routing |
| --- | --- | --- | --- | --- | --- | --- |
| deleted generic workflow route | actionId; result; noClientRelease | Recommendation, Approval, ComplianceReview, Decision, EvidenceRecord, AuditEvent, ExportRequest, ReviewSchedule, Trigger, ActionItem, User, Role, Permission, ClientTenant | Typed workflow must not become production persistence or client release proof | SCHEMA_FIELD_RECONCILIATION_REQUIRED; map action families to fields | Action-specific field preconditions remain partial | Positive/negative workflow, no-client-release, RBAC, audit and export tests |
| /api/documents | documents[] list fields | Document, EvidenceRecord, DocumentExtraction, ClientTenant, UserRole, Permission | Document rows must be tenant/object scoped and redacted | Map list payload to allowed fields only | Row-level client visibility and internal storage redaction needs proof | Allowed tenant, denied cross-tenant, empty, redaction and client-safe payload tests |
| /api/documents/upload | multipart file + documentType/metadata/roleKey/sensitivity/tenantSlug | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, EvidenceItem, AuditEvent, ClientTenant, User, Permission | Upload validates file/role/tenant; success is upload-only | Fields support upload trace but not sufficiency | evidenceComplete/visibility/release must remain locked | Positive upload, invalid file, oversize, denied role, cross-tenant, upload-not-release tests |
| /api/review-monitoring | asOf query; monitoring snapshot | ReviewSchedule, Trigger, ActionItem, QueueItem, AuditEvent, ClientTenant, Recommendation | Review monitoring must not execute advice or client release | P1 default; fields mapped for future/conditional scope | If elevated, tenant/actor visibility and no-auto-advice proof needed | Snapshot shape, clientVisible=false, no-auto-advice tests |

## 14. State / Feedback / Interaction Field Dependency Matrix

| State / Feedback / Interaction | Full-Workflow Field(s) | Required Meaning | P0 / Downstream Routing |
| --- | --- | --- | --- |
| PERMISSION_DENIED_STATE / PERMISSION_DENIED_FEEDBACK | Role, Permission, UserRole, RolePermission, AccessRequest | RBAC route/action/object denied | P0 negative tests for denied route/action/payload |
| CLIENT_VISIBILITY_HIDDEN_STATE | Recommendation.clientVisible, Decision.releasedToClientAt, EvidenceRecord.visibilityStatus, EvidenceItem.visibilityStatus, ExportRequest.status | Fail-closed client payload | Client payload redaction/leakage tests |
| REDACTED_INTERNAL_ONLY_STATE | Recommendation.summaryInternal, clientSummaryDraft, Document.sensitivity, EvidenceRecord.visibilityStatus, ExportRequest.redactionProfile | Internal notes/drafts/evidence hidden | AI draft/internal rationale leakage tests |
| UPLOAD_IN_PROGRESS / UPLOAD_SUCCESS_UPLOAD_ONLY | Document.status, DocumentVersion.storageKey, DocumentExtraction.extractionStatus, EvidenceRecord.status, AuditEvent.id | Upload transfer, not sufficiency | Upload-not-release and evidence sufficiency tests |
| NEEDS_EVIDENCE / EVIDENCE_REVIEW_PENDING | EvidenceRecord.status, DocumentReview.status, ComplianceReview.evidenceComplete | Evidence gate blocked until review/sufficiency | Unreviewed evidence blocks release/export tests |
| APPROVAL_PENDING / RELEASE_PENDING | Approval.status, ComplianceReview.status, Decision.status | Advisor approval and compliance release are separate | Approval-not-release tests |
| COMPLIANCE_BLOCKED_STATE | ComplianceReview.status, blockedAt, releaseNotes, AuditEvent.result | Release blocked/request evidence | Release blocked/audit tests |
| EXPORT_REDACTION_PENDING / EXPORT_FAILED | ExportRequest.scopeJson, redactionProfile, status, approvalRequired, approvedByUserId | Export scope/redaction/approval/download separation | Export no-redaction/no-approval leakage tests |
| AUDIT_UNAVAILABLE_STATE | AuditEvent actor/target/result/reason/correlationId | Critical action must be audit-covered | Missing audit fails closed tests |

## 15. RBAC / Client Visibility / Advice Boundary Field Matrix

| Safety Area | Full-Workflow Field(s) | Patch / Data Dictionary Concept | Current Coverage | Decision |
| --- | --- | --- | --- | --- |
| Route access vs action permission | Role.scope; Permission.objectType/action; UserRole.objectType/objectId | RBAC Matrix / PermissionGroup | Partial: schema supports fields; engine/test proof needed | CONTRACT_ALIGNMENT_REQUIRED; P0_TEST_REQUIRED |
| Object scope | ClientTenant.id; UserRole.clientTenantId/entityId/engagementId/objectType/objectId | RoleAssignment tenant/object scope | Strong baseline; cross-tenant proof pending | P0 cross-tenant leakage tests |
| Payload visibility | Sensitivity; VisibilityStatus; clientVisible fields; ExportRequest.redactionProfile | ClientVisibilityEvaluation / VisibilityRule | Partial: field set exists; explicit evaluation model missing | BLOCKER_FOR_CODEX_TASK_MASTER until safety proof |
| AI Draft internal-only | Recommendation.status; summaryInternal; clientSummaryDraft; assumptionsJson | AiDraft / AiDraftStatus / internalOnly | Merged into Recommendation; no separate model | Do not create AiDraft now; require payload mapping |
| Advisor vs compliance separation | Approval.status; Recommendation.advisorApprovalId; ComplianceReview.status; Recommendation.complianceReviewId | AdvisorApproval / ComplianceReview | Field separation exists; behaviour proof pending | P0 advisor-not-release test required |
| Admin non-bypass | Role.requiresSecondConfirmation; Permission.requiresAudit; AccessRequest; SecondConfirmation; AuditEvent | PolicyException / RBAC guardrails | Partial; no explicit PolicyException | Candidate later if safety proof requires |

## 16. Evidence / Audit / Export Field Matrix

| Safety Area | Full-Workflow Field(s) | Patch / Control Concept | Current Coverage | P0 / Downstream Routing |
| --- | --- | --- | --- | --- |
| Evidence upload is not sufficiency | Document.status; DocumentVersion; DocumentExtraction; EvidenceRecord.status; AuditEvent | DocumentUploadStatus / EvidenceStatus | Upload creates trace records only; sufficiency requires review/link/context | P0 upload-not-release tests |
| Evidence review/sufficiency | DocumentReview.status; EvidenceRecord.status; relatedObjectType/id; reviewDate | DocumentVerification / EvidenceRecord.reviewedAt | Partial; no explicit DocumentVerification model | P0 unreviewed/wrong-scope evidence tests |
| Audit persistence | AuditEvent actor/target/result/previousState/nextState/reason/metadataJson | AuditEvent beforeState/afterState/eventType enum | Model supports persistence; event taxonomy String requires discipline | P0 missing-audit and audit-result tests |
| Export scope | ExportRequest.scopeJson; exportType; status | Export scope gates | JSON scope supports contract; no proof by itself | P0 overbroad export tests |
| Export redaction | ExportRequest.redactionProfile; generatedFileDocumentId; Document.sensitivity/clientVisible | redaction rules / client-safe summary | Fields support redaction/package; proof pending | P0 no-redaction leakage tests |
| Export approval/download separation | ExportRequest.approvalRequired; approvedByUserId; status; generatedFileDocumentId | Export approval/download gates | Partial; status taxonomy must separate preview/approval/download | P0 preview-not-approval and download-not-acceptance tests |

## 17. Patch-Only / Missing / Merged / Renamed Concept Register

| Patch / Control Concept | Full-Workflow Representation | Issue Type | Risk | Decision | Later Routing |
| --- | --- | --- | --- | --- | --- |
| AiDraft | Recommendation.status + summaryInternal/clientSummaryDraft/assumptionsJson | MISSING_EXPLICIT_MODEL / MERGED_FIELD_CONCEPT | High leakage risk if draft fields are not identified | DO_NOT_CREATE_PATCH_MODEL_NOW; require payload mapping | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; P0_TEST_ACCEPTANCE_MATRIX |
| ClientVisibilityEvaluation | VisibilityStatus fields + visibility-engine + AuditEvent | MISSING_EXPLICIT_MODEL | High: fail-closed visibility proof may need persisted evaluation | BLOCKER_FOR_CODEX_TASK_MASTER until safety/test proof decides | P0_TEST_ACCEPTANCE_MATRIX; later task master |
| PolicyException | AccessRequest + SecondConfirmation + PolicyDefinition + ComplianceReview | MISSING_EXPLICIT_MODEL / SEMANTIC_FIELD_MATCH | Medium/high: admin exception handling may need explicit audit object | CANDIDATE_FOR_LATER_TASK_MASTER only if safety proof requires | FINAL_CODEX_TASK_MASTER after P0 mapping |
| VisibilityRule | PolicyDefinition.rulesJson + visibility-engine | MISSING_EXPLICIT_MODEL / JSON_POLICY_FIELD | High: JSON policy not enforcement proof | CONTRACT_ALIGNMENT_REQUIRED; no schema change now | P0 fail-closed visibility tests |
| SourceReference | DocumentLink + EvidenceItem + Document.source/checksum | MISSING_EXPLICIT_MODEL / SEMANTIC_FIELD_MATCH | Medium: source provenance may be enough through links/items | NO_SCHEMA_CHANGE_NOW | Evidence P0 tests |
| DocumentVerification | DocumentReview + DocumentExtraction + Document.status | MISSING_EXPLICIT_MODEL / SEMANTIC_FIELD_MATCH | Medium/high: review vs verification semantics must be clear | CONTRACT_ALIGNMENT_REQUIRED | Document/evidence tests |
| AdvisorApproval | Approval + Recommendation.advisorApprovalId | RENAMED_FIELD_MATCH | High: advisor approval must not equal compliance release | KEEP_FULL_FIELD_AS_BASELINE; P0_TEST_REQUIRED | P0 approval-not-release tests |
| DecisionRecord | Decision | RENAMED_FIELD_MATCH | High: client release fields must be safe | KEEP_FULL_FIELD_AS_BASELINE | P0 client visibility/release tests |
| ReviewRhythm | ReviewSchedule | RENAMED_FIELD_MATCH | Medium; P1 default | DEFER_TO_P1 unless elevated | Review monitoring tests if elevated |
| Patch enum candidates | Full enum set remains baseline | ENUM_VALUE_MISMATCH / PATCH_ONLY | Medium/high for workflow semantics | DO_NOT_REPLACE_ENUMS_NOW | P0 status transition tests |

## 18. Field Gap Classification Register

| Gap ID | Gap / Question | Current Field Reality | Safety Relevance | Decision | Routing |
| --- | --- | --- | --- | --- | --- |
| SCH-FLD-001 | ClientVisibilityEvaluation persistence | VisibilityStatus + AuditEvent + visibility-engine may be sufficient but no explicit table exists | CLIENT_VISIBILITY_CRITICAL | BLOCKER_FOR_CODEX_TASK_MASTER | P0_TEST_ACCEPTANCE_MATRIX must decide proof expectation |
| SCH-FLD-002 | AI Draft explicit model | Recommendation merged fields may be sufficient but leakage risk remains | AI_DRAFT_INTERNAL_ONLY_CRITICAL | BLOCKER_FOR_CODEX_TASK_MASTER | Payload mapping and negative tests required before tasks |
| SCH-FLD-003 | PolicyException explicit model | AccessRequest/SecondConfirmation may cover but exception lifecycle not explicit | ADMIN_NON_BYPASS_CRITICAL | CANDIDATE_FOR_LATER_TASK_MASTER | Only after safety/P0 proof shows gap |
| SCH-FLD-004 | Event taxonomy | AuditEvent.eventType is String while patch has AuditEventType enum | AUDIT_CRITICAL | CONTRACT_ALIGNMENT_REQUIRED | Do not replace now; validate event types in tests/contracts |
| SCH-FLD-005 | JSON policy/scope fields | PolicyDefinition.rulesJson and ExportRequest.scopeJson are flexible but not enforcement proof | CLIENT_VISIBILITY_CRITICAL; EXPORT_CRITICAL | P0_TEST_REQUIRED | Fail-closed policy/export tests required |
| SCH-FLD-006 | Status enum drift | Patch workflow/status enums are more specific and lower-case | WORKFLOW / ADVICE / EVIDENCE | CONTRACT_ALIGNMENT_REQUIRED | Map transitions; do not replace target enums |
| SCH-FLD-007 | KYC/Suitability/Committee held fields | KYC/IPS/committee routes remain hold | HOLD_PENDING_DECISION | HOLD_PENDING_SCOPE_UNLOCK | No schema task until scope unlock |

## 19. No-Change / Candidate-Change / Blocker Decision Register

| Decision Area | Decision | Label | Rationale |
| --- | --- | --- | --- |
| Full schema replacement | Rejected | DO_NOT_REPLACE_FULL_SCHEMA | Full-workflow remains target baseline. |
| Patch schema migration | Rejected | DO_NOT_CREATE_PATCH_MODEL_NOW | Patch is Control Spec only. |
| AiDraft model creation | Blocked now | BLOCKER_FOR_CODEX_TASK_MASTER | Resolve via payload/safety/P0 proof first. |
| ClientVisibilityEvaluation model creation | Blocked now | BLOCKER_FOR_CODEX_TASK_MASTER | Decide if persisted evaluation is required after tests/safety mapping. |
| PolicyException model creation | Candidate later | CANDIDATE_FOR_LATER_TASK_MASTER | Only if admin exception proof cannot be met by AccessRequest/SecondConfirmation/PolicyDefinition. |
| Enum replacement with patch enums | Rejected now | KEEP_ENUM_AS_BASELINE | Patch enums inform mapping, not replacement. |
| AuditEventType enum creation | Candidate later | CANDIDATE_FOR_LATER_TASK_MASTER | Only if P0 audit taxonomy requires strict enum. |
| JSON policy hardening | Candidate later | CANDIDATE_FOR_LATER_TASK_MASTER | Could become validation/task later; not here. |
| P1/hold schema work | Deferred/blocked | DEFER_TO_P1 / HOLD_PENDING_SCOPE_UNLOCK | Review/KYC/Suitability/Committee field work must not leak into MVP. |

## 20. P0 Test Dependency Routing

| P0 Proof Area | Schema Field(s) | Required Test Meaning | Routed To |
| --- | --- | --- | --- |
| RBAC route/action/object separation | Role, Permission, UserRole, RolePermission, AccessRequest | Denied route/action/object/payload cases; admin non-bypass | P0_TEST_ACCEPTANCE_MATRIX |
| Client visibility fail-closed | VisibilityStatus, clientVisible fields, Decision.releasedToClientAt, ExportRequest.redactionProfile | No unreleased/internal payload on client routes/API/export | P0_TEST_ACCEPTANCE_MATRIX |
| AI Draft internal-only | Recommendation.status, summaryInternal, clientSummaryDraft, assumptionsJson | AI draft/internal rationale never returned to client/export | P0_TEST_ACCEPTANCE_MATRIX |
| Advisor approval is not release | Approval, Recommendation.advisorApprovalId, ComplianceReview, Decision | Advisor approval does not set client visibility/release | P0_TEST_ACCEPTANCE_MATRIX |
| Compliance release preconditions | ComplianceReview.status/evidenceComplete/releasedAt/blockedAt; Decision.releasedToClientAt | Release blocked if evidence/audit/visibility invalid | P0_TEST_ACCEPTANCE_MATRIX |
| Upload is not sufficiency | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, EvidenceItem | Upload success does not unlock release/export/visibility | P0_TEST_ACCEPTANCE_MATRIX |
| Audit persistence | AuditEvent fields | Critical actions write audit; failure blocks or remains pending | P0_TEST_ACCEPTANCE_MATRIX |
| Export safety | ExportRequest fields and generated Document | No export without scope/redaction/approval/audit; preview not approval | P0_TEST_ACCEPTANCE_MATRIX |
| Review monitoring no-auto-advice | ReviewSchedule, Trigger, ActionItem | Review/rebalance monitoring does not execute advice or release | P0_TEST_ACCEPTANCE_MATRIX if elevated |

## 21. Codex Readiness Impact

| Gate | Status After This Artefact | Reason | Next Artefact Dependency |
| --- | --- | --- | --- |
| Schema Field-Level Gate | CONTRACTED_NOT_IMPLEMENTED | Field-level mapping exists, but safety behaviour and negative tests are not proven. | P0_TEST_ACCEPTANCE_MATRIX.md |
| RBAC / Visibility / Advice Boundary Gate | CONTRACTED_NOT_IMPLEMENTED | Fields are mapped, but route/action/payload enforcement requires tests. | P0_TEST_ACCEPTANCE_MATRIX.md |
| Evidence / Audit / Export Gate | CONTRACTED_NOT_IMPLEMENTED | Fields are mapped, but upload-not-sufficiency, audit persistence and export redaction require tests. | P0_TEST_ACCEPTANCE_MATRIX.md |
| API Contract Gate | CONTRACTED_NOT_IMPLEMENTED | API-to-field dependencies are mapped, but implementation proof is not complete. | P0_TEST_ACCEPTANCE_MATRIX.md |
| Task Master Gate | BLOCKED | Open schema blockers must be resolved or routed before tasks. | FINAL_CODEX_TASK_MASTER.md only later |
| Final Codex Handoff Gate | BLOCKED | Codex would still need to infer tests/tasks if started now. | FINAL_CODEX_IMPLEMENTATION_HANDOFF.md only after all gates |

## 22. Stop Rules

- No implementation.
- No code changes.
- No Prisma schema changes.
- No migrations.
- No seed changes.
- No API changes.
- No test writing.
- No Codex tasks.
- No final Codex handoff.
- No screen generation.
- No state-screen generation.
- No image generation.
- No blind patch-schema replacement.
- No full-workflow schema replacement.
- No reference-schema replacement.
- No `main` as target codebase.
- No `main`-based target gaps.
- No assumption that field presence proves safety behaviour.
- No assumption that enum presence proves workflow gate enforcement.
- No assumption that JSON fields prove policy enforcement.
- No assumption that `clientVisible` or `VisibilityStatus` alone proves fail-closed visibility.
- No assumption that `RecommendationStatus.AI_DRAFT` alone proves AI Draft redaction.
- No assumption that `Approval` alone proves advisor approval gate.
- No assumption that `ComplianceReview` alone proves release safety.
- No assumption that `Document` / `EvidenceRecord` creation proves evidence sufficiency.
- No assumption that `AuditEvent` model presence proves audit persistence.
- No assumption that `ExportRequest` model presence proves redacted export safety.
- No assumption that API response fields are client-safe without payload mapping.
- No assumption that existing tests prove P0 safety.
- No assumption that Codex may start.

## 23. Acceptance Criteria

| # | Acceptance Criterion | Result |
| --- | --- | --- |
| 1 | Roadmap position is correct: 11 of 15. | PASS |
| 2 | `API_CONTRACT_MATRIX.md` is used as direct predecessor. | PASS |
| 3 | All predecessors 1–10 are listed and used. | PASS |
| 4 | Full-workflow schema remains baseline. | PASS |
| 5 | Patch schema is treated as Control Spec only. | PASS |
| 6 | No blind schema replacement is proposed. | PASS |
| 7 | 42-model / 22-enum baseline is preserved. | PASS |
| 8 | Patch/domain/data-dictionary concepts are mapped at field/concept level. | PASS |
| 9 | All safety-critical fields are mapped or explicitly marked missing/partial. | PASS |
| 10 | Client visibility semantics are fail-closed. | PASS |
| 11 | AI Draft internal-only mapping is explicit. | PASS |
| 12 | Advisor approval and compliance release fields are not collapsed. | PASS |
| 13 | Evidence upload and evidence sufficiency fields are separate. | PASS |
| 14 | Audit model presence is not treated as persistence proof. | PASS |
| 15 | Export fields are mapped to scope/redaction/approval/download safety. | PASS |
| 16 | API payload fields are mapped to schema fields and redaction requirements. | PASS |
| 17 | P1/reference/hold implications are deferred or blocked correctly. | PASS |
| 18 | All schema changes remain blocked from implementation. | PASS |
| 19 | P0 test dependencies are routed to `P0_TEST_ACCEPTANCE_MATRIX.md`. | PASS |
| 20 | Codex remains blocked. | PASS |

## 24. Final ENGINE Proof

| ENGINE Phase | Proof |
| --- | --- |
| Charter | Target artefact, roadmap position 11/15, scope and non-scope locked. |
| Evidence | Source hierarchy applied; full-workflow schema baseline and predecessor artefacts used. |
| Framing | Separated schema reality from safety readiness and control-spec intent. |
| Divergence | Considered field, enum, relation, API, state, feedback, RBAC, visibility, advice, evidence, audit, export and test dependencies. |
| Contradiction | Resolved full-schema-vs-patch-schema tension without blind replacement. |
| Branch Build | Built field, enum, relation, safety and API dependency branches. |
| Debate | Challenged field-presence, enum-presence, JSON-policy, visibility, audit/export and patch-overwrite overclaims. |
| Adversarial | Tested leakage, bypass, upload-to-release, advisor-as-release, audit-display-as-persistence, export-preview-as-approval and client payload failure modes. |
| Convergence | Produced field-level reconciliation without implementation. |
| Proof | Acceptance criteria checked and Codex remains blocked. |
| Learning | Open items routed to P0 test matrix and later task master only after gates pass. |

---

## Final Artefact Decision

`SCHEMA_FIELD_LEVEL_RECONCILIATION_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

The schema field-level reconciliation is complete as a non-implementation artefact. It preserves the full-workflow schema as target baseline, treats the MVP patch as Control Spec only, blocks blind schema replacement, maps safety-critical field dependencies, and routes proof to `P0_TEST_ACCEPTANCE_MATRIX.md`. Codex remains `CODEX_HANDOFF_NOT_READY`.