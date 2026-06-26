# Capability And Vertical-Slice Analysis

Scope: `ANALYSIS-2` findings.
Rule: local code/test/runtime evidence only. Documentation and prior reports are hypothesis/context unless corroborated in this run.

## ANALYSIS-2.1 - UI, Route, Screen And Interaction Surfaces

Status: `DONE`

### Ticket Requirement

`ANALYSIS-2.1` requires a local inventory of UI, route, screen and interaction surfaces. Every surface must be classified as static, reading, interactive, form-based, mutating or unproven. The output must separate UI-only/static affordances from mutation candidates before API, service, DB, audit or test claims are made.

### Route And Rendering Model

Evidence:

- `lib/route-registry.ts` exports 71 registered `screenRoutes`.
- `app/[...segments]/page.tsx` is the catch-all renderer.
- The catch-all route uses `matchRouteBySegments`, rejects unknown routes with `notFound()`, renders inaccessible registered routes through `RouteSkeletonPage`, and maps accessible page IDs to primary screen components.

Visual-mode distribution from the current route registry:

| Visual mode | Count |
| --- | ---: |
| `NORMAL_PAGE` | 41 |
| `WIZARD_OR_STEP_PAGE` | 7 |
| `PAGE_WITH_SIDE_DRAWER` | 4 |
| `REFERENCE_ONLY_INTERNAL_PAGE` | 3 |
| `PAGE_WITH_SECOND_CONFIRMATION_MODAL` | 2 |
| `PREVIEW_PAGE_OR_PANEL` | 2 |
| `BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE` | 1 |
| `DOWNLOAD_CONFIRMATION_STATE` | 1 |
| `MODAL_CAPABLE_AUTH_PAGE` | 1 |
| `PAGE_WITH_APPROVAL_DRAWER` | 1 |
| `PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL` | 1 |
| `PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION` | 1 |
| `PAGE_WITH_INVITE_ROLE_MODAL` | 1 |
| `PAGE_WITH_PERMISSION_MODAL` | 1 |
| `PAGE_WITH_POLICY_MODAL_AVAILABLE` | 1 |
| `PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL` | 1 |
| `PAGE_WITH_USER_DRAWER_OR_MODAL` | 1 |
| `RELEASE_CONFIRMATION_MODAL_STATE` | 1 |

Primary screen renderer mapping:

| Route/page family | Renderer evidence | Current UI classification |
| --- | --- | --- |
| Auth/onboarding pages | `AuthOnboardingScreen` gated by `isAuthOnboardingPageId` | UI surface with demo auth API candidates, modal states and onboarding step state. |
| Admin/tenant setup | `AdminTenantSetupScreen` gated by `isAdminTenantSetupPageId` | Mixed UI with admin tenant API reads/writes plus typed tenant-governance and platform-admin command clients. |
| Client workspace/documents/entities/profile | `ClientIntakeScreen` gated by `isClientIntakePageId` | Strong form/data-maintenance surface with profile, family, entity, document upload and document review API candidates plus typed data-maintenance commands. |
| Wealth/actions | `WealthActionsScreen` gated by `isWealthActionsPageId` | Mixed UI: local drawers, action views and typed data-maintenance commands; several controls are explicitly static or held. |
| Internal advisory/compliance workflow | `InternalWorkflowScreen` gated by `isInternalWorkflowPageId` | Advisor-review command surface. Current J01 product-like calls use `runAdvisorReviewCommand`; static/held compliance affordances still exist. |
| KYC/AML | `KycAmlWorkflowScreen` gated by `isKycAmlPageId` | Mostly workflow/status UI with local form controls and client-release disabled states. |
| Suitability/IPS | `SuitabilityIpsScreen` gated by `isSuitabilityIpsPageId` | Mostly internal review and suitability UI with local controls and disabled release controls. |
| Review monitoring | `ReviewMonitoringScreen` gated by `isReviewMonitoringPageId` | Monitoring surface with typed/local action candidates and held controls; needs API/service mapping before vertical-slice claims. |
| Committee review | `CommitteeReviewScreen` gated by `isCommitteeReviewPageId` | Safety-decision UI with static/disabled controls for incomplete gates. |
| Decisions/governance/evidence | `DecisionsGovernanceScreen` gated by `isDecisionsGovernancePageId` | Mixed UI with tenant-governance and advice-release-history typed clients plus static evidence/decision affordances. |
| Communication/export/ops | `CommunicationExportOpsScreen` gated by `isCommunicationExportOpsPageId` | Export workflow and ops/communication surface. Export UI has direct API candidates; governance/export ops actions use typed command clients where migrated. |

### Route Surface Matrix

| Area | Route count / examples | UI maturity from route metadata | Current audit interpretation |
| --- | --- | --- | --- |
| Access | 6 routes: `/login`, `/mfa`, onboarding steps | Normal/modal/wizard pages, mostly user/role actions | UI exists; demo auth API candidates require flow proof in downstream analysis. |
| Platform/admin | 6 routes: `/admin/platform`, `/admin/roles`, `/admin/security` | Policy/modal/permission surfaces | UI exists; platform/security actions have typed platform-admin command client evidence. |
| Tenant setup | 6 routes: `/admin/tenants`, `/tenants/new`, setup/team/policies/users | Wizard/normal/invite modal | UI exists; tenant/governance actions have typed tenant-governance command client evidence. |
| Client workspace | 12 routes: `/client/profile`, `/client/family-members`, `/entities`, `/documents/upload` | View/create/upload/review route metadata | Strong real interaction candidates: profile PATCH, family PATCH, entity POST, document upload and review POST. |
| Wealth/actions | 2 routes: `/wealth-map`, `/actions` | Drawer pages | Mixed: visible controls, typed data-maintenance commands and explicit static/disabled notes. |
| Advisory/internal workflow | 17 routes including advisory, advisor, KYC/IPS, review, committee, compliance | Review/approve/release/block metadata, many sensitive routes | UI exists with safety/gate language. J01 advisor review has typed command surface; J02/J03 remain advice/release-history command candidates. |
| Decisions/evidence/governance | 9 routes: decisions/evidence/governance | Drawer/modals/approval detail routes | Mixed: governance actions use typed client; evidence/review affordances need downstream proof. |
| Communication | 2 routes | Preview/schedule | Mostly support/context UI; no advice/release claim without handler proof. |
| Export | 5 routes | Create/scope/redaction/approval/download sequence | Staged UI exists. Export workflow has direct API candidates and migrated typed command support from earlier cleanup. |
| Operations | 6 routes including ops, service blueprint, roadmap, states | Mix of normal and reference-only | Ops UI exists; reference-only routes are not product workflows. |

Client-sensitive route examples in the current registry include `/admin/policies/advice-boundary`, `/tenants/:id/policies`, `/mobile`, `/actions`, `/kyc/reviews`, `/ips/:tenantId/decision-room`, `/reviews`, `/reviews/:id`, `/advisor/reviews/:id`, committee and compliance decision rooms, evidence review and export approval/download routes. These require stronger fail-closed and projection evidence before product claims can be made.

### Interaction Classification Matrix

| Interaction class | Evidence examples | Current classification |
| --- | --- | --- |
| Real API fetch/read | `ClientIntakeScreen` fetches profile, family, entities and documents APIs; `AdminTenantSetupScreen` fetches `/api/admin-tenants`; auth screens fetch auth APIs; export screens call export workflow APIs. | `READ_INTERACTION_CANDIDATE`; downstream API/service mapping required. |
| Real API mutation candidate | Client intake calls `/api/profile` PATCH, `/api/family-members` PATCH, `/api/entities` POST, `/api/documents/upload` POST and `/api/documents/review` POST; admin tenant UI calls `/api/admin-tenants` POST; export UI submits workflow commands. | `MUTATION_CANDIDATE`; not yet a complete vertical slice until service, DB, audit and test proof are mapped. |
| Typed product-like command client | Current screen code imports `runAdvisorReviewCommand`, `runDataMaintenanceCommand`, `runTenantGovernanceCommand`, `runPlatformAdminCommand`, `runAdviceReleaseHistoryCommand` and `runRecommendationReviewWorkflowAction`. | `TYPED_COMMAND_CANDIDATE`; command-specific proof must be gathered in `ANALYSIS-2.2` and `ANALYSIS-2.3`. |
| Legacy screencast/demo client path | `lib/screencast-demo-client.ts` still posts to `/api/demo-workflow`, but current grep found no product screen imports of `runScreencastDemoAction`. | `QUARANTINED_LEGACY_CLIENT_PATH`; not acceptable as product API evidence. |
| Explicit static/non-interactive control | `data-ux-interactive="false"`, `data-ux-affordance="static-control-note"`, disabled buttons and held labels occur across committee, suitability, wealth actions, client intake, governance and export surfaces. | `UI_ONLY_STATIC_OR_HELD` unless paired with a real handler. |
| Disabled safety controls | Committee approval disabled until vote/evidence gates, KYC/client release disabled, suitability release disabled, document upload disabled until a file is selected. | `BLOCKED_UI_SAFETY_STATE`; positive safety signal, not completion proof. |
| Local state interaction | Drawers, modals, tabs, filters, wizard steps, selects and local form state in screen components. | `LOCAL_UI_INTERACTION`; local state alone does not prove persistence. |

### Mutating Candidate Register

| Candidate | UI evidence | Status before downstream analysis |
| --- | --- | --- |
| Auth provider / MFA / dummy session | `AuthOnboardingScreen` calls `/api/auth/providers`, `/api/auth/provider-login`, `/api/auth/mfa/verify`, `/api/auth/dummy` | `MUTATION_CANDIDATE_DEMO_AUTH` |
| Tenant create/list | `AdminTenantSetupScreen` calls `/api/admin-tenants` GET/POST | `MUTATION_CANDIDATE_API_BACKED` |
| Tenant/user/role/governance commands | `AdminTenantSetupScreen`, `DecisionsGovernanceScreen` and `CommunicationExportOpsScreen` use `runTenantGovernanceCommand` | `TYPED_COMMAND_CANDIDATE` |
| Platform/security/admin commands | `AdminTenantSetupScreen` uses `runPlatformAdminCommand` | `TYPED_COMMAND_CANDIDATE` |
| Profile edit | `ClientIntakeScreen` calls `/api/profile` GET/PATCH | `MUTATION_CANDIDATE_API_BACKED` |
| Family member edit | `ClientIntakeScreen` calls `/api/family-members` GET/PATCH | `MUTATION_CANDIDATE_API_BACKED` |
| Entity create/read | `ClientIntakeScreen` calls `/api/entities` GET/POST | `MUTATION_CANDIDATE_API_BACKED` |
| Document upload | `ClientIntakeScreen` calls `/api/documents/upload` POST with `FormData` | `MUTATION_CANDIDATE_API_BACKED` |
| Document review/sufficiency | `ClientIntakeScreen` calls `/api/documents/review` POST | `MUTATION_CANDIDATE_API_BACKED` |
| Data-maintenance J04/J05/J09 commands | Client intake and wealth/actions screens use `runDataMaintenanceCommand` | `TYPED_COMMAND_CANDIDATE` |
| Advisor review J01 commands | `InternalWorkflowScreen` uses `runAdvisorReviewCommand` with `j01.routeToAdvisor` and `j01.escalateAdvisor` | `TYPED_COMMAND_CANDIDATE` |
| Advice/release-history J02/J03 commands | `DecisionsGovernanceScreen` uses `runAdviceReleaseHistoryCommand` | `TYPED_COMMAND_CANDIDATE` |
| Recommendation review workflow | `lib/recommendation-review-workflow-client.ts` calls `/api/recommendation-review-workflow` | `TYPED_COMMAND_CANDIDATE` |
| Export workflow | Export routes and `CommunicationExportOpsScreen` use `/api/export-workflow` for approval/download states | `STRONG_UI_API_CANDIDATE` |
| Journey commands | Journey UI/client and `/api/journeys/[id]/commands` exist | `MUTATION_CANDIDATE_JOURNEY_SPINE` |

### UI-Only / Static / Blocked Register

| Surface | Evidence | Classification |
| --- | --- | --- |
| Reference pages `/service-blueprint`, `/roadmap`, `/states` | `REFERENCE_ONLY_INTERNAL_PAGE` visual mode | `REFERENCE_ONLY_NOT_PRODUCT_WORKFLOW` |
| Committee decision room confirm/cancel | `data-ux-interactive="false"` on confirm/cancel spans; disabled approval controls | `UI_ONLY_STATIC_OR_BLOCKED` |
| KYC/Suitability release controls | Disabled release buttons and explicit client release disabled text | `BLOCKED_UI_SAFETY_STATE` |
| Wealth action filters/grouping/new work controls | Disabled/static-control-note and disabled reason text | `UI_ONLY_STATIC_OR_HELD` |
| Document folder creation, draft save, download held | Static-control-note labels in document surfaces | `UI_ONLY_STATIC_OR_HELD` |
| Admin import/template/export/preview controls | Held/static controls in admin setup screens | `UI_ONLY_STATIC_OR_HELD` |
| Evidence and stage panels | `data-testid` proof surfaces without handler evidence by themselves | `DISPLAY_PROOF_SURFACE` |
| `runScreencastDemoAction` product-screen path | No current product screen import found; client still exists in `lib/screencast-demo-client.ts` | `LEGACY_SUPPORT_ONLY_UNTIL_DELETED_OR_SEEDED` |

### ANALYSIS-2.1 Result

The UI is not merely static: the app has real API candidates and multiple typed command client candidates. The same UI also intentionally contains held, static, disabled and safety-blocked affordances. Therefore a broad "complete product" or "all visible actions persist" claim is false.

Downstream tickets must now prove, per candidate:

- whether an API route or typed command endpoint exists,
- whether a service performs the command,
- whether Prisma-backed persistence or durable output occurs,
- whether audit, permission, projection and no-release guards hold,
- and whether local tests or runtime proof support the claim.

Finished: `ANALYSIS-2.1`.

## ANALYSIS-2.2 - API, Service And Workflow Data Flow

Status: `DONE`

### Ticket Requirement

`ANALYSIS-2.2` requires local API routes, handlers, services, server actions, workflow functions and state transitions to be connected back to the UI candidates from `ANALYSIS-2.1`. The goal is to prove which visible/system actions actually enter logic, validation or workflow-state processing. This ticket is analysis-only; it does not make DB editability or full vertical-slice completion claims.

### API / Service Inventory

| Flow family | API/handler evidence | Service/workflow evidence | Input handling | Safety/error pattern | Current classification |
| --- | --- | --- | --- | --- | --- |
| Admin tenant foundation | `app/api/admin-tenants/route.ts` `GET`/`POST` | `getAdminTenantSnapshot`, `inviteDemoAuthUser`, `createP44ClientTenant`, `updateP44PlatformSetting`, `updateP44SecurityConfiguration`, `createP44PolicyVersion`, `requireP44EffectivePolicy`, `assignP44TeamMember` | JSON body with `payload.action`; action switch in handler | Validation, auth-provider and permission errors return non-release safety envelopes | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Auth/demo session | `app/api/auth/providers`, `provider-login`, `mfa/verify`, `dummy`, `logout` | Demo auth provider/current-user services | JSON request or GET, role/provider/MFA values | Auth failure safety, `noClientRelease: true` | `DEMO_AUTH_API_CANDIDATE` |
| Profile DBTF form | `app/api/profile/route.ts` `GET`/`PATCH` | `getDbtfClientProfile`, `saveDbtfClientProfile` | Query context for GET; JSON payload with tenant/role/action for PATCH | Invalid scope, permission, validation and not-found branches; PATCH returns `noClientRelease: true` | `FORM_API_SERVICE_CANDIDATE` |
| Family members | `app/api/family-members/route.ts` `GET`/`PATCH` | `listDbtfFamilyMembers`, `updateDbtfFamilyMember` | Query filters for list; JSON payload for update | Scope/actor-tenant checks; permission denial can carry audit event ID | `FORM_API_SERVICE_CANDIDATE` |
| Entities | `app/api/entities/route.ts` `GET`/`POST` | `listDbtfEntities`, `saveDbtfEntityWizard` | Query filters for list; JSON payload with save/submit mode for POST | Scope/actor-tenant checks, validation and permission branches | `FORM_API_SERVICE_CANDIDATE` |
| Documents list/upload | `app/api/documents/route.ts` `GET`; `app/api/documents/upload/route.ts` `POST` | `listUploadedDocuments`, `uploadDocument` | Query filters for list; multipart `FormData` for upload with file, tenant, role and metadata | Upload route validates multipart/file/scope and returns a safe document result only | `STRONG_API_SERVICE_CANDIDATE` |
| Evidence/document review | `app/api/documents/review/route.ts` `POST` | `reviewDocumentEvidence` | JSON payload: document ID, tenant, role, action and sufficiency booleans | Validation, not-found, permission, insufficiency and audit-unavailable fail-closed branches | `STRONG_API_SERVICE_CANDIDATE` |
| Export workflow | `app/api/export-workflow/route.ts` `GET`/`POST` | `getExportWorkflowSnapshot`, `parseExportWorkflowCommandRequest`, `executeExportWorkflowCommand` | Tenant/role query for snapshot; typed command request for scope/redaction/preview/approve/generate/download/share | `ExportWorkflowCommandError` converted to fail-closed response with no approval/download on errors | `STRONG_TYPED_COMMAND_API_CANDIDATE` |
| Journey workflow | `app/api/journeys/**` | `listJourneysForCurrentUser`, `createJourneyForCurrentUser`, `executeJourneyCommandForCurrentUser`, projection/evidence/audit services | Current user resolved from request; journey command parsed by `parseJourneyCommandRequest` | Normalized route errors fail closed before state advance; client projection suppresses internals | `STRONG_TYPED_JOURNEY_COMMAND_CANDIDATE` |
| Advisor review J01 | `app/api/advisor-review/actions/route.ts` `POST` | `isAdvisorReviewWorkflowAction`, `runAdvisorReviewWorkflowAction`, `runDemoWorkflowMutation` | JSON action ID allow-list for `j01.routeToAdvisor` / `j01.escalateAdvisor` | Requires DB URL; invalid action and audit-unavailable paths fail closed; no advice/client release | `TYPED_ADVISOR_REVIEW_COMMAND_CANDIDATE` |
| Advice/release-history J02/J03 | `app/api/advice-release-history/actions/route.ts` `POST` | `runAdviceReleaseHistoryWorkflowAction`, `workflowGate`, `dataQualityService`, `runDemoWorkflowMutation` | JSON action ID allow-list plus audit failure simulation flag | Client-visible result only if service result explicitly reports `clientVisible: true`; fail-closed on audit-unavailable | `TYPED_ADVICE_RELEASE_HISTORY_COMMAND_CANDIDATE` |
| Data maintenance J04/J05/J09 | `app/api/data-maintenance/actions/route.ts` `POST` | `runDataMaintenanceWorkflowAction`, `fileMetadataService`, `runDemoWorkflowMutation` | JSON action ID allow-list | Invalid action and audit-unavailable fail closed; no advice/release | `TYPED_DATA_MAINTENANCE_COMMAND_CANDIDATE` |
| Tenant governance J06/J07 | `app/api/tenant-governance/actions/route.ts` `POST` | `runTenantGovernanceWorkflowAction`, `runDemoWorkflowMutation` | JSON action ID allow-list | Invalid action and audit-unavailable fail closed; no advice/release | `TYPED_TENANT_GOVERNANCE_COMMAND_CANDIDATE` |
| Platform admin J10 | `app/api/platform-admin/actions/route.ts` `POST` | `runPlatformAdminWorkflowAction` | JSON action ID allow-list | Writes audit-shaped result and returns no advice/release; safe error response on failure | `TYPED_PLATFORM_ADMIN_COMMAND_CANDIDATE` |
| Recommendation review workflow | `app/api/recommendation-review-workflow/route.ts` `POST` | `handleRecommendationReviewWorkflowRequest`, `parseDemoWorkflowRequestBody`, `runAdvisorApprovalWorkflowMutation` | Typed `workflowType: advisor-approval` request | Fail-closed on missing DB, invalid request and workflow gate errors | `TYPED_ADVISOR_APPROVAL_WORKFLOW_CANDIDATE` |
| Review monitoring J16/J17 | `app/api/review-monitoring/actions/route.ts` `POST`; read snapshot route exists separately | `runReviewMonitoringWorkflowAction` | JSON action ID allow-list | DB URL required; invalid action fail closed; response says no client release | `TYPED_REVIEW_MONITORING_COMMAND_CANDIDATE` |
| Legacy demo workflow | `app/api/demo-workflow/route.ts` `POST` | `parseDemoWorkflowRequestBody`, `demoWorkflowActionBoundaryFor`, local `runDemoWorkflowAction` | Legacy `actionId` or retired advisor workflow payload | Moved product commands return `410` with canonical typed route; unsupported demo actions blocked; only demo-only path remains direct | `LEGACY_DEMO_ONLY_BOUNDARY` |

### Workflow / State Transition Candidate Matrix

| Candidate | Handler-to-service trace | Processing observed in code | Current status |
| --- | --- | --- | --- |
| Profile edit | `ClientIntakeScreen` -> `/api/profile` PATCH -> `saveDbtfClientProfile` | Parses tenant/role/action, validates DBTF payload and returns no-release result | `TRACEABLE_TO_SERVICE` |
| Family edit | `ClientIntakeScreen` -> `/api/family-members` PATCH -> `updateDbtfFamilyMember` | Parses actor/tenant/role scope, validates update and handles permission/not-found | `TRACEABLE_TO_SERVICE` |
| Entity wizard | `ClientIntakeScreen` -> `/api/entities` POST -> `saveDbtfEntityWizard` | Saves draft or submit mode, with validation and permission branches | `TRACEABLE_TO_SERVICE` |
| Document upload | `ClientIntakeScreen` -> `/api/documents/upload` POST -> `uploadDocument` | Multipart validation, metadata parsing, safe result projection | `TRACEABLE_TO_SERVICE_STRONG` |
| Evidence review | `ClientIntakeScreen` -> `/api/documents/review` POST -> `reviewDocumentEvidence` | Action allow-list, sufficiency booleans, scoped document lookup and fail-closed errors | `TRACEABLE_TO_SERVICE_STRONG` |
| Export lifecycle | Export UI/API candidate -> `/api/export-workflow` POST -> `parseExportWorkflowCommandRequest` -> `executeExportWorkflowCommand` | Command parser covers scope/redaction/preview/approve/generate/download/share requirements; service gates role, scope, redaction, status and data quality | `TRACEABLE_TO_TYPED_COMMAND_SERVICE_STRONG` |
| Journey command spine | Journey UI/client -> `/api/journeys/[id]/commands` POST -> `parseJourneyCommandRequest` -> `executeJourneyCommandForCurrentUser` | Current user, scoped journey, role permission and command-family dispatch before state advance | `TRACEABLE_TO_TYPED_COMMAND_SERVICE_STRONG` |
| J01 advisor review | Product screen -> `runAdvisorReviewCommand` -> `/api/advisor-review/actions` -> `runAdvisorReviewWorkflowAction` | Action allow-list updates recommendation/trigger/approval state via shared audit mutation wrapper | `TRACEABLE_TYPED_COMMAND` |
| J02/J03 advice/release-history | Product screen -> `runAdviceReleaseHistoryCommand` -> `/api/advice-release-history/actions` -> `runAdviceReleaseHistoryWorkflowAction` | Command allow-list includes compliance evidence/release and released decision/evidence history actions; gate/data-quality service references observed | `TRACEABLE_TYPED_COMMAND_SAFETY_SENSITIVE` |
| J04/J05/J09 data maintenance | Product screens -> `runDataMaintenanceCommand` -> `/api/data-maintenance/actions` -> `runDataMaintenanceWorkflowAction` | Command-family dispatch for documents, entities/actions, profile/family/relationships; no release default | `TRACEABLE_TYPED_COMMAND` |
| J06/J07 tenant governance | Product screens -> `runTenantGovernanceCommand` -> `/api/tenant-governance/actions` -> `runTenantGovernanceWorkflowAction` | Tenant/user/role/access/export-audit commands dispatch through typed endpoint, not `/api/demo-workflow` | `TRACEABLE_TYPED_COMMAND` |
| J10 platform admin | Product screen -> `runPlatformAdminCommand` -> `/api/platform-admin/actions` -> `runPlatformAdminWorkflowAction` | Audit-event command record for platform/security/admin changes | `TRACEABLE_TYPED_COMMAND` |
| Review monitoring | Product screen candidate -> `/api/review-monitoring/actions` -> `runReviewMonitoringWorkflowAction` | J16/J17 action allow-list dispatches review calendar and rebalance monitoring workflows | `TRACEABLE_TYPED_COMMAND` |
| Legacy `/api/demo-workflow` | Legacy client path -> `/api/demo-workflow` | Product-like moved actions return `410` with canonical API route; direct execution remains only for demo-only `j01.requestData` | `NOT_PRODUCT_API_BOUNDARY` |

### Process I/O Draft Matrix

| Process | Inputs | Validation / processing | Outputs | Open proof boundary |
| --- | --- | --- | --- | --- |
| DBTF profile save | Tenant slug, role key, actor tenant, form payload, save/submit mode | Scope parsed in API route, DBTF validation in service | Safe result, no client release | DB writes and audit rows are `ANALYSIS-2.3` proof. |
| Family member update | Tenant slug, role key, actor tenant, member payload | API scope checks, service validation/permission handling | Updated result or fail-closed denial with optional audit ID | Model/field editability belongs to `ANALYSIS-2.3`. |
| Entity wizard save/submit | Tenant slug, role key, actor tenant, entity payload, mode | API scope checks, service validation/permission handling | Entity result, no client release | Persistence scope and field coverage belongs to `ANALYSIS-2.3`. |
| Document upload | Multipart file, document metadata, tenant slug, role key, audit simulation flag | Multipart/file/scope validation, service upload pipeline, safe projection | Safe document metadata, evidence/extraction/version IDs, no release | File and DB row effects belong to `ANALYSIS-2.3`. |
| Evidence review | Document ID, action, notes, sufficiency booleans, tenant, role, audit simulation flag | Action allow-list, tenant/role validation, service permission/sufficiency/audit checks | Review result with service safety or fail-closed reason | DB review/evidence mutations belong to `ANALYSIS-2.3`. |
| Export command | Command ID, tenant, role, export request, redaction profile, scope items, payload/share flags | Parser enforces command-specific required fields; service gates role, scope, redaction, status, data quality and export safety | Export workflow result, audit ID/request ID/status depending on command; no approval/download on errors | Exact persistence and package artifacts belong to `ANALYSIS-2.3`. |
| Journey command | Journey ID, current user, typed journey command payload | Current user resolution, route scoped journey load, command registry parse, role permission checks | Journey command result, updated projection, safety envelope | Command-specific persistence belongs to `ANALYSIS-2.3`. |
| Typed action clients | Action ID for a typed family | Endpoint allow-list rejects actions outside family; service dispatches only known actions | Command result, audit/safety fields, no client release unless explicit release-history service result says otherwise | Each command's exact model writes belong to `ANALYSIS-2.3`. |
| Recommendation review workflow | Advisor approval workflow payload: action, actor role, target, reason, evidence IDs, confirmation | Parsed through shared workflow validation, then typed command bus release/gate logic | Advisor approval workflow result or gate failure | Gate/persistence/test proof belongs to `ANALYSIS-2.3/2.4`. |
| Legacy demo-only action | `actionId` routed to `/api/demo-workflow` | Boundary registry classifies moved/unsupported/demo-only actions; product-like commands are rejected with canonical route | `410` for moved/unsupported product-like calls; direct result only for demo-only action | This path must not be used as product capability evidence. |

### Dynamic / Unclear Code Paths

| Area | Status | Why it remains open |
| --- | --- | --- |
| Field-level editability | `OPEN_FOR_ANALYSIS-2.3` | `ANALYSIS-2.2` proves handler/service reachability, not exact model/field coverage. |
| Runtime success of every command | `OPEN_FOR_QA` | This ticket used static local code inspection. Runtime/browser/API proof belongs to later validation tickets. |
| Remaining `lib/screencast-demo-client.ts` | `QUARANTINED_LEGACY_SUPPORT` | The client still exists, but product-like moved actions are fail-closed at `/api/demo-workflow`; deletion/quarantine decisions belong to implementation cleanup tickets, not this analysis ticket. |
| Reference-only route affordances | `NOT_WORKFLOW_PROOF` | Route/UI existence without handler linkage remains static/display-only. |

### ANALYSIS-2.2 Result

Relevant handlers and services are locally traceable. The strongest workflow data-flow candidates are document upload/review, export workflow commands, journey commands, DBTF profile/family/entity forms, typed advisor/release-history/data-maintenance/tenant-governance/platform-admin action endpoints and recommendation review workflow commands.

The important cleanup finding is structural: `/api/demo-workflow` is now a legacy demo-only boundary, not a shadow product API. Product-like moved actions fail closed with `410` and point to canonical typed routes.

Finished: `ANALYSIS-2.2`.

## ANALYSIS-2.3 - DB Editability, Persistence And Process I/O

Status: `DONE`

### Ticket Requirement

`ANALYSIS-2.3` requires local data models, tables, entities and documents to be inventoried and classified by editability. Schema existence alone is not enough. A data structure is only editable in this audit when a local UI/API/service/DB write path is visible.

### DB / Schema Inventory

Evidence:

- `prisma/schema.prisma` contains 31 enums and 53 models.
- Five migration directories exist under `prisma/migrations`.
- `prisma/seed.ts` seeds the local demo-data model and explicitly guards against real-client-data mode.
- Static Prisma operation scan over `app/api/**/*.ts` and `lib/**/*.ts` found local operation evidence for 45 of 53 schema models.

Migration inventory:

| Migration | Interpretation |
| --- | --- |
| `20260614201128_init_phase_02` | Initial phase-02 schema foundation. |
| `20260614202332_phase_03_data_model_seed` | Phase-03 data model/seed expansion. |
| `20260624190000_wave_0_2_journey_spine` | Journey spine persistence. |
| `20260624213000_wave_0_2_core_journey_gates` | Core journey gate persistence. |
| `20260625143000_internal_draft_governance_spine` | Internal draft governance spine persistence. |

### Model Operation Coverage

Static operation scan result, grouped by persistence meaning:

| Persistence class | Models | Operation evidence |
| --- | --- | --- |
| Strong create/update/read workflow models | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | Upload/review/evidence services create, update, list and audit these models. |
| DBTF/client maintenance models | `UserProfile`, `FamilyMember`, `Relationship`, `Entity`, `EntityParticipant` | Profile/family/entity services and typed data-maintenance actions update/upsert/create these models. |
| Advisory/release/governance workflow models | `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant`, `InternalDraft`, `DraftClassification`, `UnsupportedClaim`, `DraftTrace` | Typed workflow command bus, advisor/release-history actions and internal draft governance services read/write these models. |
| Tenant/governance/platform models | `ClientTenant`, `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation`, `ConsentRecord`, `PolicyDefinition` | Admin tenant foundation, tenant-governance actions, auth provider services and read models read/write these models. `Permission` itself is seeded/readmodel-backed in inspected app/lib paths, while `RolePermission` is writable. |
| Journey spine models | `JourneyDefinition`, `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyEvidenceRequirement`, `JourneyCommandRun`, `EvidenceSufficiencyDecision` | Journey API service creates instances/steps/links/command runs and writes evidence sufficiency decisions; definitions/requirements are mostly seeded/read. |
| Export / ops / monitoring models | `ExportRequest`, `ReviewSchedule`, `QueueItem`, `DataQualityIssue` | Export workflow, review monitoring and data-quality services create/update/read these models. |
| Readmodel/search-only in inspected app/lib paths | `MessageThread`, `Message`, `CallEvent`, `Asset`, `Engagement`, `ClientObjective`, `PlatformTenant` | Present in schema/seed and relationships; no direct non-seed app/lib write path found in the current operation scan. |

### Data Editability Matrix

| Data family | UI/API/service linkage from `ANALYSIS-2.2` | Write-path models | Editability classification |
| --- | --- | --- | --- |
| Profile/client intake | `/api/profile` PATCH -> `saveDbtfClientProfile`; typed J09 profile command | `UserProfile`, plus audit/evidence in typed command path | `API_BACKED_EDITABLE_PARTIAL_FIELD_SCOPE` |
| Family members | `/api/family-members` PATCH -> `updateDbtfFamilyMember`; typed J09 family command | `FamilyMember`, `EvidenceItem` in typed command path | `API_BACKED_EDITABLE_PARTIAL_FIELD_SCOPE` |
| Relationships | Typed J09 relationship command | `Relationship`, `EvidenceItem` | `TYPED_COMMAND_EDITABLE_NOT_GENERAL_FORM_CRUD` |
| Entities | `/api/entities` POST -> `saveDbtfEntityWizard`; typed J05 entity commands | `Entity`, `EntityParticipant`, `EvidenceItem` | `API_AND_TYPED_COMMAND_EDITABLE` |
| Documents | `/api/documents/upload`; `/api/documents/review`; typed J04 commands | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `STRONG_API_BACKED_EDITABLE_WORKFLOW` |
| Evidence records/items | Upload/review APIs, advice-release-history commands, journey commands, internal draft services | `EvidenceRecord`, `EvidenceItem`, `EvidenceSufficiencyDecision` | `WORKFLOW_OWNED_EDITABLE` |
| Export lifecycle | `/api/export-workflow` -> `executeExportWorkflowCommand`; typed migration boundary blocks old demo path | `ExportRequest`, `AuditEvent`; generated document relation exists | `STRONG_TYPED_COMMAND_EDITABLE` |
| Journey workflow | `/api/journeys` create, `/api/journeys/[id]/commands` execute | `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyCommandRun`, `EvidenceSufficiencyDecision`, related evidence/recommendation/approval/compliance/decision models by command | `STRONG_TYPED_COMMAND_EDITABLE` |
| Advisor review J01 | `/api/advisor-review/actions` -> `runAdvisorReviewWorkflowAction` | `Trigger`, `Recommendation`, `Approval`, `AuditEvent` | `TYPED_COMMAND_EDITABLE_SEEDED_FIXTURE_SCOPE` |
| Advice/release-history J02/J03 | `/api/advice-release-history/actions` -> `runAdviceReleaseHistoryWorkflowAction` | `ComplianceReview`, `Recommendation`, `EvidenceRecord`, `EvidenceItem`, `ActionItem`, `Approval`, `Decision`, `DecisionParticipant`, `AuditEvent` | `TYPED_COMMAND_EDITABLE_SAFETY_SENSITIVE` |
| Data maintenance J04/J05/J09 | `/api/data-maintenance/actions` -> `runDataMaintenanceWorkflowAction` | Documents, entities, action items, profile/family/relationship models, evidence/audit support models | `TYPED_COMMAND_EDITABLE_FAMILY_SCOPE` |
| Tenant governance J06/J07 | `/api/tenant-governance/actions` -> `runTenantGovernanceWorkflowAction` | `ClientTenant`, `User`, `UserProfile`, `UserRole`, `Role`, `RolePermission`, `SecondConfirmation`, `AccessRequest`, `ConsentRecord`, `PolicyDefinition`, `ExportRequest`, `EvidenceItem`, `AuditEvent` | `TYPED_COMMAND_EDITABLE_GOVERNANCE_SCOPE` |
| Platform admin J10 | `/api/platform-admin/actions` -> `runPlatformAdminWorkflowAction` | `AuditEvent` only in inspected service | `AUDIT_BACKED_COMMAND_RECORD_NOT_FULL_PLATFORM_CRUD` |
| Review monitoring J16/J17 | `/api/review-monitoring/actions` -> `runReviewMonitoringWorkflowAction` | `ReviewSchedule`, `QueueItem`, `Trigger`, `ActionItem`, `Recommendation`, `AuditEvent` | `TYPED_COMMAND_EDITABLE_MONITORING_SCOPE` |
| Admin tenant foundation | `/api/admin-tenants` `POST` action switch | `ClientTenant`, `PolicyDefinition`, `User`, `UserRole`, `ConsentRecord`, `AuditEvent` | `API_BACKED_ADMIN_EDITABLE` |
| Search/read dashboards | `/api/global-search`, `/api/dashboard-metrics`, readmodel services | Multiple find/count operations | `READ_ONLY_FROM_CURRENT_UI_PATH` |
| Communication/message/call surfaces | Schema and seed rows exist; communication UI/context exists | `MessageThread`, `Message`, `CallEvent` only seed evidence in current app/lib operation scan | `SEEDED_OR_DISPLAY_ONLY_IN_THIS_AUDIT` |
| Assets/objectives/engagement | Schema and seed rows exist | `Asset`, `ClientObjective`, `Engagement` only seed/schema evidence in current app/lib operation scan | `SCHEMA_SEED_ONLY_IN_THIS_AUDIT` |

### Persistence Mapping

| Vertical candidate | Persistence path | Current persistence strength |
| --- | --- | --- |
| Document upload | UI `FormData` -> upload API -> `uploadDocument` -> `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `STRONG` |
| Evidence review | UI JSON -> review API -> `reviewDocumentEvidence` -> `DocumentReview`, updated `Document`/`DocumentExtraction`/`EvidenceRecord`, `DocumentLink`, `EvidenceItem`, `AuditEvent` | `STRONG` |
| DBTF form maintenance | UI JSON -> profile/family/entities APIs -> DBTF services -> profile/family/entity writes and audit handling | `MEDIUM_TO_STRONG` |
| Export workflow | UI command -> export API -> parser/service -> `ExportRequest` create/update plus `AuditEvent`; status-gated command sequence | `STRONG_TYPED_COMMAND` |
| Journey workflow | UI command -> journey API -> journey service -> journey instance/step/object/evidence/command-run writes plus domain-object writes for command families | `STRONG_TYPED_COMMAND` |
| Tenant governance | UI command -> tenant-governance API -> command service -> tenant/user/role/access/policy/export-audit writes | `STRONG_TYPED_COMMAND_SEEDED_SCOPE` |
| Platform admin | UI command -> platform-admin API -> service -> audit event write | `AUDIT_RECORD_ONLY_FOR_PLATFORM_COMMANDS` |
| Legacy demo-only `/api/demo-workflow` | Legacy action ID -> demo boundary -> only demo-only `j01.requestData` direct execution; moved product commands 410 | `DEMO_ONLY_NOT_PRODUCT_PERSISTENCE` |

### Process I/O Matrix Update

| Process | DB input objects | DB outputs/state changes | Editability boundary |
| --- | --- | --- | --- |
| Profile save | Seeded tenant/user/profile/family context | Profile fields updated; evidence/audit may be recorded through typed command path | Partial fields, not general user/profile admin CRUD. |
| Family update | Seeded family member and tenant context | Family member updates or upsert through typed path | Partial fields, tenant-scoped. |
| Entity creation/maintenance | Tenant context, entity payload or typed action | Entity create/upsert/update, participant upsert, evidence item | Editable by wizard/typed commands; field-level completeness not proven. |
| Document upload/review | Uploaded file or review decision plus seeded tenant/evidence context | Document lifecycle rows, extraction/review/link/evidence/audit rows | Strong workflow-owned editability; not arbitrary file/document CRUD. |
| Advice/release-history | Seeded recommendation/compliance/evidence/decision context | Recommendation, compliance, evidence, action item, decision and participant transitions | Safety-sensitive command editability; release visibility must be proven by guards/tests. |
| Export command | Export scope/request/status plus command payload | Export request create/update and audit row | Strong command editability; generated binary/package realism is a separate proof dimension. |
| Journey command | Journey instance, current user, command payload | Journey run/step/status/object/evidence writes and domain writes by command family | Strong command editability; command-specific completeness varies. |
| Governance commands | Seeded tenant/user/role/access/policy context | Tenant, user, role, permission mapping, access request, confirmation, consent, policy and export audit writes | Strong governance command editability; not unrestricted admin CRUD. |

### Unbound / Lower-Confidence Register

| Model/data area | Current finding |
| --- | --- |
| `MessageThread`, `Message`, `CallEvent` | Seed/schema and display/context evidence exist, but no current app/lib write operation was found outside seed. |
| `Asset`, `Engagement`, `ClientObjective` | Seed/schema evidence exists; no current app/lib write operation was found outside seed. |
| `PlatformTenant` | Seed/schema/root relation evidence exists; inspected platform-admin command records audit events rather than directly mutating `PlatformTenant`. |
| Field-level editability | Not fully proven by this ticket. The report classifies model/process-level editability and keeps field-level claims bounded. |

### ANALYSIS-2.3 Result

Local persistence is real and broad, but it is not generic CRUD. The strongest editable vertical candidates are document upload/review, export workflow, journey commands, tenant governance, advice/release-history, data maintenance and DBTF form maintenance. The report must keep schema-only or seed-only data out of product editability claims.

Finished: `ANALYSIS-2.3`.

## ANALYSIS-2.4 - Security, Guard, Audit And Test Evidence

Status: `DONE`

### Ticket Requirement

`ANALYSIS-2.4` requires local security, role, guard, validation, audit and test evidence to be mapped to the capability candidates. Existing tests count as evidence only within their asserted scope. They do not automatically make a capability complete.

### Security / Guard / Audit Matrix

| Guard family | Local evidence | Protects | Current classification |
| --- | --- | --- | --- |
| RBAC / action permission | `lib/permission-engine.ts`, `lib/control-layer/permission-decision.ts`, `lib/control-layer/scope-resolver.ts` | Cross-tenant access, route shell vs action permission, payload scope, non-bypass admin/security roles, export/advice/evidence action authorization | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Client projection / visibility | `lib/visibility-engine.ts`, `lib/ui-clickflow-guards.ts` | Internal drafts, rationale, compliance notes, unreleased decisions/documents/evidence, client-safe projection | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Workflow release gates | `lib/workflow-gate.ts`, `lib/release-spine-command-surface.ts`, journey release code in `lib/journeys/journey-api-service.ts` | No unapproved advice, advisor approval separated from compliance release, evidence sufficiency, audit persistence, data quality, suitability/IPS and committee prerequisites | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Audit persistence guard | `lib/audit-service.ts`, `runDemoWorkflowMutation` and typed command services | Critical actions require minimum audit fields and fail closed when audit persistence is unavailable | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Fail-closed API envelope | `lib/control-layer/error-envelope.ts`; routes using `failClosedJson` | Invalid request, permission denial, scope denial, audit failure and safe errors do not silently mutate/release | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Export safety | `lib/export-service.ts`, `lib/control-layer/export-safety.ts`, `lib/export-workflow-command-service.ts` | Scope/redaction/approval/generation/download/share separation and forbidden internal payload exclusion | `CODE_AND_TEST_EVIDENCE_STRONG` |
| Demo-workflow quarantine | `lib/demo-workflow-action-registry.ts`, `app/api/demo-workflow/route.ts` | Prevents moved product-like Jxx actions from being treated as `/api/demo-workflow` product API | `RUNTIME_PROVEN_THIS_RUN` |
| Capture/report drift gate | `lib/capture-screen-model-context.ts`, `lib/capability-report-drift-gate.ts` | Prevents stale route/model/API counts and `COMPLETE_VERTICAL_SLICE` report drift from becoming generator truth | `RUNTIME_PROVEN_THIS_RUN` |
| Source hierarchy guard | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts` | True-UX source hierarchy, target-codebase contract and current target restrictions | `RUNTIME_PROVEN_THIS_RUN` via `pnpm guard:source` |

### Test Proof Matrix

| Capability / risk area | Local test evidence | What is proven | Claim boundary |
| --- | --- | --- | --- |
| Source truth | `tests/source-reality-gate.spec.ts`; current run `pnpm guard:source` | Source hierarchy/current target restrictions | Does not prove product runtime behavior. |
| Demo-workflow quarantine | `tests/demo-workflow-action-registry.spec.ts` | Only `j01.requestData` remains demo-only executable; moved families point to typed APIs; unregistered demo-shaped actions blocked | Does not delete the legacy client file by itself. |
| Capture/report drift | `tests/capture-screen-model-context.spec.ts`, `tests/capability-report-drift-gate.spec.ts` | 71 routes, 53 models, 31 enums, 33 API-route truth, no complete-slice overclaim, typed command context for migrated families | Does not run every product workflow. |
| Permission and non-bypass | `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/true-ux-governance-non-bypass.spec.ts` | Cross-tenant denial, route-access vs action permission, admin/security non-bypass | Test scope is role/action/object cases, not every field. |
| Audit fail closed | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`, command API specs | Critical actions block when audit persistence/minimum fields are missing | Does not prove external audit backend durability beyond local DB/service behavior. |
| Document upload/review | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/document-upload-lifecycle-hardening.spec.ts` | Upload writes document/version/extraction/evidence/audit; review/sufficiency paths deny unsafe roles/scope and keep no-release | Does not claim arbitrary document CRUD. |
| DBTF/data maintenance | `tests/dbtf-tables-api.spec.ts`, `tests/av27-client-context-closure.spec.ts`, `tests/data-maintenance-actions-api.spec.ts`, `tests/data-maintenance-command-client-source.spec.ts` | Profile/family/entity/data-maintenance paths and typed command client separation | Field-level coverage remains bounded. |
| Export workflow/safety | `tests/export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts`, `tests/phase8-export-workflow-api.spec.ts`, `tests/export-command-spine-contract.spec.ts` | Scope/redaction/preview/approval/generate/download/share separation, forbidden payload blocking, no real binary overclaim | Runtime package realism is bounded by metadata/no-real-binary assertions. |
| Journey spine | `tests/journey-api.spec.ts`, `tests/phase-b-c-journey-command-api.spec.ts`, `tests/journey-spine.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts` | Current-user scope, command parsing, audit/run records, Phase B/C typed commands and no client release | Does not prove every future journey family. |
| Tenant governance / platform admin | `tests/tenant-governance-actions-api.spec.ts`, `tests/platform-admin-actions-api.spec.ts`, source-client specs, `tests/platform-admin-browser-runtime.spec.ts` | J06/J07/J10 typed actions execute outside demo workflow and reject unsupported actions | Platform-admin DB effect is audit-record command evidence, not full platform CRUD. |
| Advice/release history/advisor review | `tests/advisor-review-command-api.spec.ts`, `tests/advice-release-history-command-client-source.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Typed J01/J02/J03 boundary, no unapproved advice, advisor approval separated from release, projection hides internal payloads | Complete release claims require flow-specific runtime proof. |
| UI blocked/static affordances | lifecycle/a11y/affordance tests such as `tests/true-ux-cta-state.spec.ts`, `tests/button-cta-lifecycle-pruning.spec.ts`, `tests/disabled-control-a11y-messaging.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Static/disabled/held UI states are explicit and not misleading action proof | UI state tests do not prove service persistence. |

### Current-Run Proof Pack

Executed:

```text
pnpm guard:source
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1
```

Results:

- `pnpm guard:source`: `PASS`, `violations: 0`.
- First drift proof run: failed on two stale proof expectations:
  - `lib/capability-report-drift-gate.ts` still required `API route files found: \`32\`` although current inventory is `33`.
  - `tests/demo-workflow-action-registry.spec.ts` still expected four executable demo-only actions although the current hard boundary leaves only `j01.requestData`.
- Fix applied:
  - `lib/capability-report-drift-gate.ts` now requires `API route files found: \`33\``.
  - `tests/demo-workflow-action-registry.spec.ts` now expects `demoOnlyWorkflowActionIds` to equal `["j01.requestData"]`.
- Rerun result: `12 passed`.

### Negative Proof / Missing Proof Register

| Missing or bounded proof | Consequence |
| --- | --- |
| Full Playwright suite not run in this ticket | QA-1 must not claim global green status from this targeted proof pack. |
| Field-level DB editability not exhaustively tested | Capability report must stay at process/model-family level unless a specific test proves field behavior. |
| Screenshot/browser visual proof not generated here | No UI changed in this ticket; visual proof is not required for report/test-source updates. |
| `/api/demo-workflow` client file still exists | It is a legacy support path, not product capability evidence; later cleanup can delete/quarantine it further if no seed/screencast dependency remains. |
| Platform-admin typed command writes audit record rather than mutating broad platform settings directly | Must not be reported as full platform CRUD. |

### ANALYSIS-2.4 Result

Security, guard, audit and test evidence is broad and locally grounded. The strongest guarded candidates remain document upload/review, export workflow, journey commands, tenant governance, data maintenance and advice/release workflow. The current-run proof pack specifically verifies the drift boundary that prevents stale `32` API-route and broad demo-workflow assumptions from returning.

Finished: `ANALYSIS-2.4`.

Blocked until `ANALYSIS-2.2` and `ANALYSIS-2.3` identify the concrete capability claims that require guard, audit and test evidence.
