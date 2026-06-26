# Capability And Vertical-Slice Analysis

Scope: `ANALYSIS-2` findings.  
Rule: local code/test/runtime evidence only. Documentation and prior reports are hypothesis/context unless corroborated.

## ANALYSIS-2.1 - UI, Route, Screen And Interaction Surfaces

Status: `DONE`

### Route And Rendering Model

Evidence:

- `lib/route-registry.ts` exports 71 registered `screenRoutes`.
- `app/[...segments]/page.tsx` is the catch-all renderer.
- The catch-all route uses `matchRouteBySegments`, rejects unknown routes with `notFound()`, renders inaccessible registered routes through `RouteSkeletonPage`, and maps accessible page IDs to primary screen components.

Primary screen renderer mapping:

| Route/page family | Renderer evidence | Classification |
| --- | --- | --- |
| Auth/onboarding pages | `AuthOnboardingScreen` gated by `isAuthOnboardingPageId` | UI surface with real auth demo API candidates and modal/step states. |
| Admin/tenant setup | `AdminTenantSetupScreen` gated by `isAdminTenantSetupPageId` | UI surface with API-backed admin tenant read/create candidates plus many demo actions. |
| Client workspace/documents/entities/profile | `ClientIntakeScreen` gated by `isClientIntakePageId` | Strongest UI mutation candidate surface: profile/family/entity/document upload/review fetch and POST/PATCH paths observed. |
| Wealth/actions | `WealthActionsScreen` gated by `isWealthActionsPageId` | Mixed UI: drawer/local interactions and screencast demo actions; some controls explicitly static/disabled. |
| Internal advisory/compliance workflow | `InternalWorkflowScreen` gated by `isInternalWorkflowPageId` | Workflow-action candidate surface with `/api/demo-workflow` calls and explicit safety text. |
| KYC/AML | `KycAmlWorkflowScreen` gated by `isKycAmlPageId` | Mostly internal workflow/demo-action surface with local form controls and client release disabled states. |
| Suitability/IPS | `SuitabilityIpsScreen` gated by `isSuitabilityIpsPageId` | Mostly internal workflow/demo-action surface with local actions and disabled release controls. |
| Review monitoring | `ReviewMonitoringScreen` gated by `isReviewMonitoringPageId` | Monitoring surface with `/api/demo-workflow` and fail-closed API read candidates. |
| Committee review | `CommitteeReviewScreen` gated by `isCommitteeReviewPageId` | Mostly safety-decision UI with static/disabled controls for incomplete gates. |
| Decisions/governance/evidence | `DecisionsGovernanceScreen` gated by `isDecisionsGovernancePageId` | Mixed UI: governance access request lifecycle, evidence/decision surfaces, many demo actions. |
| Communication/export/ops | `CommunicationExportOpsScreen` gated by `isCommunicationExportOpsPageId` | Export workflow and ops/communication surface; current export approval/download UI calls `/api/export-workflow` directly, while some older support actions still use demo action IDs. |

### Route Surface Matrix

| Area | Route count / examples | UI maturity from route metadata | Current audit interpretation |
| --- | --- | --- | --- |
| Access | 6 routes, `/login`, `/mfa`, onboarding steps | Normal/modal/wizard pages, mostly USER/ROLE actions | UI exists; real auth demo APIs must be checked before vertical-slice claims. |
| Platform/admin | 6 routes, `/admin/platform`, `/admin/roles`, `/admin/security` | Policy/modal/permission surfaces | UI exists; some save actions are demo-only, tenant list/create has API candidates. |
| Tenant setup | 6 routes, `/admin/tenants`, `/tenants/new`, setup/team/policies/users | Wizard/normal/invite modal | UI exists; tenant create API candidate; team/policy/user actions need service/API proof before editability claims. |
| Client workspace | 12 routes, `/client/profile`, `/client/family-members`, `/entities`, `/documents/upload` | View/create/upload/review route metadata | Strong real interaction candidates: profile PATCH, family PATCH, entity POST, document upload/review POST. |
| Wealth/actions | 2 routes, `/wealth-map`, `/actions` | Drawer pages | Mixed: visible controls, several explicit static/disabled notes. |
| Advisory/internal workflow | 17 routes including advisory, advisor, KYC/IPS, review, committee, compliance | Review/approve/release/block metadata, many sensitive routes | UI exists with safety/gate language; real workflow proof depends on `/api/demo-workflow`, command bus and tests. |
| Decisions/evidence/governance | 9 routes, decisions/evidence/governance | Drawer/modals/approval detail routes | Mixed: evidence and governance UI exists, some access-request lifecycle appears interactive, evidence download/review can be demo/static. |
| Communication | 2 routes | Preview/schedule | Mostly support/context UI; no advice/release claim without handler proof. |
| Export | 5 routes | Create/scope/redaction/approval/download sequence | Staged UI exists; export API/command service proof needed for real workflow status. |
| Operations | 6 routes including ops, service blueprint, roadmap, states | Mix of normal and reference-only | Ops UI exists; reference-only routes are not product workflows. |

### Interaction Classification

| Interaction class | Evidence examples | Status |
| --- | --- | --- |
| Real API fetch/read | `ClientIntakeScreen` fetches `/api/documents`, `/api/dashboard-metrics`, `/api/profile`, `/api/family-members`, `/api/entities`; `AdminTenantSetupScreen` fetches `/api/admin-tenants`; auth screens fetch auth APIs. | Candidate real read interaction. Needs API/service/DB check in `ANALYSIS-2.2/2.3`. |
| Real API mutation candidate | `ClientIntakeScreen` calls `/api/profile` PATCH, `/api/family-members` PATCH, `/api/entities` POST, `/api/documents/upload` POST, `/api/documents/review` POST; `AdminTenantSetupScreen` calls `/api/admin-tenants` POST; `InternalWorkflowScreen` and `ReviewMonitoringScreen` call `/api/demo-workflow`. | Candidate vertical slices. Cannot be `COMPLETE` until handler/service/DB/audit/test proof is mapped. |
| Demo command action | `runScreencastDemoAction(...)` occurs across client intake, wealth actions, admin, KYC, suitability, decisions/governance, communication/export/ops and review surfaces. | Interactive demo/action surface. It may mutate via `/api/demo-workflow` depending on action ID, but each action must be verified. |
| Explicit static/non-interactive control | `data-ux-interactive="false"`, `data-ux-affordance="static-control-note"`, disabled buttons and held labels occur in committee, suitability, wealth actions, client intake and other screens. | Must be classified as `UI_ONLY_STATIC` or `BLOCKED_UI` unless paired with a real handler. |
| Disabled safety controls | Examples: committee approval disabled until votes/evidence gates, KYC/client release disabled, suitability release disabled, document upload disabled until file selected. | Positive UX/safety signal, not workflow completion proof. |
| Local state interaction | Drawers, modals, tabs, filters, wizard steps, selects and local form state in screen components. | UI interaction exists; local state alone does not prove persistence. |

### Mutating Candidate Register

| Candidate | UI evidence | Current status before downstream analysis |
| --- | --- | --- |
| Tenant create/list | `AdminTenantSetupScreen` -> `/api/admin-tenants` GET/POST | `MUTATION_CANDIDATE_API_BACKED` |
| Auth provider / MFA / dummy session | `AuthOnboardingScreen` -> `/api/auth/providers`, `/api/auth/provider-login`, `/api/auth/mfa/verify`, `/api/auth/dummy` | `MUTATION_CANDIDATE_DEMO_AUTH` |
| Profile edit | `ClientIntakeScreen` -> `/api/profile` GET/PATCH | `MUTATION_CANDIDATE_API_BACKED` |
| Family member edit | `ClientIntakeScreen` -> `/api/family-members` GET/PATCH | `MUTATION_CANDIDATE_API_BACKED` |
| Entity create/read | `ClientIntakeScreen` -> `/api/entities` GET/POST | `MUTATION_CANDIDATE_API_BACKED` |
| Document upload | `ClientIntakeScreen` -> `/api/documents/upload` POST with `FormData` | `MUTATION_CANDIDATE_API_BACKED` |
| Document review/sufficiency | `ClientIntakeScreen` -> `/api/documents/review` POST | `MUTATION_CANDIDATE_API_BACKED` |
| Demo workflow actions | Multiple screens -> `/api/demo-workflow` via `runScreencastDemoAction` or direct fetch | `MUTATION_CANDIDATE_ACTION_ID_DEPENDENT` |
| Export workflow | Export routes, `/api/export-workflow`, export truth panel, approval modal and download confirmation call the canonical API directly | `STRONG_UI_API_SERVICE_CANDIDATE` |
| Journey commands | Journey UI/client and `/api/journeys/[id]/commands` exist | `MUTATION_CANDIDATE_JOURNEY_SPINE` |

### UI-Only / Static / Blocked Register

| Surface | Evidence | Classification |
| --- | --- | --- |
| Reference pages `/service-blueprint`, `/roadmap`, `/states` | `REFERENCE_ONLY_INTERNAL_PAGE` visual mode | `REFERENCE_ONLY_NOT_PRODUCT_WORKFLOW` |
| Committee decision room confirm/cancel | `data-ux-interactive="false"` on confirm/cancel spans; disabled approval controls | `UI_ONLY_STATIC_OR_BLOCKED` |
| KYC/Suitability release controls | Disabled release buttons and explicit client release disabled text | `BLOCKED_UI_SAFETY_STATE` |
| Wealth action filters/grouping/new work controls | Disabled/static-control-note and disabled reason text | `UI_ONLY_STATIC_OR_HELD` |
| Document folder creation, draft save, download held | Static-control-note labels in document surfaces | `UI_ONLY_STATIC_OR_HELD` |
| Many visual stage panels and phase panels | `data-testid` proof surfaces, no handler evidence by themselves | `DISPLAY_PROOF_SURFACE` |

### ANALYSIS-2.1 Conclusion

The UI is not merely static: several routes contain real API fetch/mutation candidates and many demo workflow action candidates. However, the UI also intentionally marks many controls as static, held, disabled or safety-blocked. Therefore no broad "complete app" claim is allowed. The next tickets must separate:

- API-backed persisted vertical slices,
- demo-command backed workflow slices,
- static/blocked UI states,
- route registry surfaces without mutation proof,
- and client/safety-sensitive surfaces that need fail-closed proof.

## ANALYSIS-2.2 - API, Service And Workflow Data Flow

Status: `DONE`

### API Flow Matrix

| Flow family | API evidence | Service evidence | Input handling | Output/safety pattern | Current classification |
| --- | --- | --- | --- | --- | --- |
| Admin/tenant actions | `app/api/admin-tenants/route.ts` `GET`/`POST` | `getAdminTenantSnapshot`, `inviteDemoAuthUser`, `createP44ClientTenant`, `updateP44PlatformSetting`, `updateP44SecurityConfiguration`, `createP44PolicyVersion`, `requireP44EffectivePolicy`, `assignP44TeamMember` | JSON body with `payload.action`; unsupported action throws validation error | Responses include `noClientRelease`, `productionAuthClaim: false`, scoped safety; catches validation/permission/auth errors | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Profile edit | `app/api/profile/route.ts` `GET`/`PATCH` | `getDbtfClientProfile`, `saveDbtfClientProfile` | Query context for GET; JSON payload for PATCH; tenant/role validation | scoped/hiddenRows safety; permission/not-found/validation handling; no client release on save | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Family member edit | `app/api/family-members/route.ts` `GET`/`PATCH` | `listDbtfFamilyMembers`, `updateDbtfFamilyMember` | Query context for GET; JSON payload for PATCH; tenant/role/actor scope checks | hidden row/scoped safety; denied updates include audit event ID if permission failure writes one | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Entity create/read | `app/api/entities/route.ts` `GET`/`POST` | `listDbtfEntities`, `saveDbtfEntityWizard` | Query filters for list; JSON payload for create/save draft/submit | scoped safety and noClientRelease; validation and permission failure branches | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Document upload | `app/api/documents/upload/route.ts` `POST` | `uploadDocument` | Multipart `FormData`; validates file, role, tenant, metadata; `runtime = nodejs` | Returns safe document result only; safety explicitly says upload-only, review pending, no release, no client visibility | `STRONG_API_SERVICE_WORKFLOW_CANDIDATE` |
| Document list | `app/api/documents/route.ts` `GET` | `listUploadedDocuments` | Query filters for tenant/role/search/sensitivity/source/status/type | fail-closed invalid scope; no advice/no release safety | `READ_API_SERVICE_CANDIDATE` |
| Evidence/document review | `app/api/documents/review/route.ts` `POST` | `reviewDocumentEvidence` | JSON body validates role, tenant, document ID and action (`mark_reviewed`, `request_clarification`, `accept_sufficiency`) | fail-closed invalid/permission/not-found/insufficient/audit-unavailable paths; returns service safety | `STRONG_API_SERVICE_WORKFLOW_CANDIDATE` |
| Export workflow | `app/api/export-workflow/route.ts` `GET`/`POST` | `getExportWorkflowSnapshot`, `executeExportWorkflowCommand`, `parseExportWorkflowCommandRequest` | Tenant/role query for GET; parsed JSON command request for POST; current export UI calls the API for approval/download | fail-closed errors prevent approval/download; command response reports commandExecuted and noClientRelease | `STRONG_API_SERVICE_WORKFLOW_CANDIDATE` |
| Journey list/create | `app/api/journeys/route.ts` `GET`/`POST` | `resolveCurrentUserFromRequest`, `listJourneysForCurrentUser`, `createJourneyForCurrentUser` | Current user resolved from request; JSON body for create | fail-closed route errors; no advice/no client release | `API_SERVICE_WORKFLOW_CANDIDATE` |
| Journey commands | `app/api/journeys/[id]/commands/route.ts` `POST` | `parseJourneyCommandRequest`, `executeJourneyCommandForCurrentUser` | Parsed JSON command; current user and route journey ID | fail-closed before state advance; commandExecuted safety | `STRONG_API_SERVICE_WORKFLOW_CANDIDATE` |
| Journey evidence/client/audit reads | `app/api/journeys/[id]/evidence-sufficiency/route.ts`, `client-projection/route.ts`, `audit/route.ts` | `getJourneyEvidenceSufficiencyForCurrentUser`, `getJourneyClientProjectionForCurrentUser`, audit query services | Current user plus journey ID | fail-closed reads; client projection says no internal payload and no client release | `READ_API_SERVICE_CANDIDATE` |
| Demo workflow action bus | `app/api/demo-workflow/route.ts` `POST` | `parseDemoWorkflowRequestBody`, many `runJ*` handlers, `runDemoWorkflowMutation`, advisor workflow command bus | Either `actionId` pattern or typed advisor-approval workflow input | Returns action result and safety; many handlers use transactions and audit records; some may set `clientVisible` only under explicit release gates | `BROAD_DEMO_WORKFLOW_COMMAND_BUS` |

### Workflow Command Evidence

`app/api/demo-workflow/route.ts` is not a thin mock endpoint. Static inspection shows a broad switch over action IDs and many handler functions that update Prisma models inside transactions:

| Action group | Handler examples | Model/action evidence from static search | Audit/safety signal |
| --- | --- | --- | --- |
| Compliance evidence/release | `runJ02RequestEvidence`, `runJ02BlockRelease`, `runJ02ReleaseClient` | Updates `ComplianceReview`, `Recommendation`, `EvidenceRecord`, creates `EvidenceItem`; release path checks approvals/evidence/gate and can set `clientVisible: true` only in explicit release path | Audit event creation and no-client-visible defaults around block/request paths |
| Decision actions | `runJ03DecisionAction`, `runJ03EvidenceAudit` | Updates `Decision`, `DecisionParticipant`, `Recommendation`, `EvidenceRecord`, creates `EvidenceItem` | Action-specific evidence/audit behavior |
| Documents | `runJ04UploadDocument`, `runJ04ConfirmFinalize` | Upserts/updates `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceItem` | Client visibility false for upload/review paths |
| Entities/actions | `runJ05ContinueEntity`, `runJ05EditEntity`, `runJ05MarkReady`, `runJ05RequestInfo` | Creates/updates `Entity`, `EntityParticipant`, `ActionItem`, `EvidenceItem` | Client visibility guarded/false except action readiness semantics |
| Tenant/governance | `runJ06*`, `runJ07*` | Updates tenants, roles, users, permissions, access requests, second confirmation and audit/evidence items | Governance changes record audit/evidence context and keep client release false |
| Export | `runJ08*` plus export workflow API | Updates `ExportRequest`, creates documents/versions/evidence items | Staged scope/redaction/approval/download/share handling; needs export service proof for full status |
| Client profile/family | `runJ09*` plus DBTF APIs | Updates `UserProfile`, `FamilyMember`, `Relationship`, creates evidence items | Client-visible release not implied |
| KYC/Suitability/IPS | `runJ12*`, `runJ13J14*` | Upserts `ComplianceReview`, `EvidenceRecord`, `EvidenceItem` | Client visibility false |
| Monitoring/rebalance | `runJ16*`, `runJ17*` | Updates `ReviewSchedule`, `QueueItem`, `Trigger`, `ActionItem`, `Recommendation` | Internal review, no automatic advice/release |

### Typed Service Evidence

| Service | Data-flow finding |
| --- | --- |
| `lib/document-upload-service.ts` | Validates upload input, stores file bytes/checksum, creates `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, and `AuditEvent`; also lists uploaded documents. |
| `lib/evidence-review-service.ts` | Validates review input; loads scoped document/evidence record; writes denied audits; creates reviews, updates document/extraction/evidence state, creates links/evidence items/audit events. |
| `lib/dbtf-form-service.ts` | Reads/saves profile, family member, entity wizard; performs tenant/role checks and writes audit events in mutation paths. |
| `lib/export-workflow-command-service.ts` | Defines export commands, parses requests, validates role/scope/status/redaction/data-quality, creates/updates `ExportRequest`, writes audit events, blocks unsafe download/share/generate states. |
| `lib/journeys/journey-api-service.ts` | Lists/creates journey instances, executes typed journey commands, creates audit/command-run records, updates journey steps/state, links evidence, computes client projection and evidence sufficiency. |
| `lib/typed-workflow-command-bus.ts` | Implements advisor/compliance command bus, audit persistence checks, internal draft governance, release preconditions and client projection after release. |

### API/Service Conclusions

1. The codebase contains real local API and service workflow surfaces; it is not only a visual clickdummy.
2. The strongest service-backed candidates are document upload, evidence review, profile/family/entity DBTF forms, export workflow commands, journey commands and typed advisor/compliance workflow commands.
3. The broad `/api/demo-workflow` action bus provides many persisted demo workflow transitions, but each action remains action-ID-specific. A generic "all demo buttons persist" claim would be false.
4. Fail-closed and no-overclaim response patterns are visible in multiple handlers, especially document, export and journey routes.
5. `ANALYSIS-2.3` must now classify exactly which DB entities are create/update/read/write targets and where UI/API/service paths actually persist.

Current typed-command update:

- J06/J07 tenant, user, role and governance actions are now routed through `/api/tenant-governance/actions`, `lib/tenant-governance-workflow-actions.ts` and `lib/tenant-governance-command-client.ts`.
- J10 platform/security/admin actions are now routed through `/api/platform-admin/actions`, `lib/platform-admin-workflow-actions.ts` and `lib/platform-admin-command-client.ts`.
- `/api/demo-workflow` returns fail-closed `410` responses for moved tenant-governance, platform-admin, export, Phase B/C journey and review-monitoring families with canonical route guidance.
- Static UI scan found remaining `runScreencastDemoAction` calls only in `j01`, `j02` and `j03` families after J04/J05/J09 data-maintenance, J06/J07 tenant-governance and J10 platform-admin were moved to typed clients.

## ANALYSIS-2.3 - DB Editability, Persistence And Process I/O

Status: `DONE`

### Persistence Operation Summary

Evidence: static Prisma operation scan over `app/api/**/route.ts` and `lib/**/*.ts`; schema model list from `prisma/schema.prisma`.

| Persistence status | Meaning | Current examples |
| --- | --- | --- |
| `API_BACKED_CREATE_UPDATE_READ` | UI/API/service path exists for create/update/read and is likely user-operable through app surfaces. | Profile, family members, entities, documents, document review, export workflow, journey instances/commands, admin tenant actions. |
| `DEMO_COMMAND_BACKED_MUTATION` | Mutation exists through `/api/demo-workflow` action IDs or screencast command client, often seeded/demo object specific. | Compliance request/block/release, decision actions, J04/J05/J06/J07/J08/J09/J12/J13/J14/J16/J17 actions. |
| `SERVICE_BACKED_INTERNAL_WORKFLOW` | Service writes/read state, but direct UI affordance may be indirect or command-specific. | Internal draft governance, typed advisor/compliance workflow, data quality, review monitoring, journey evidence sufficiency. |
| `READMODEL_ONLY_OR_LIST` | Read path exists, but no local write path found in inspected API/service surface. | Some dashboard/search/ops read models. |
| `SCHEMA_ONLY_IN_THIS_AUDIT` | Model exists in Prisma schema, but no operation found in inspected app/lib code. | Any unlisted Prisma models or fields. |

### Data Editability Matrix

| Data family | Models with local operation evidence | Operation evidence | UI/API linkage | Classification |
| --- | --- | --- | --- | --- |
| Tenant/admin setup | `ClientTenant`, `PolicyDefinition`, `User`, `UserRole`, `Role`, `ConsentRecord` | create/find/update/upsert in `p44-phase2-admin-foundation`, `demo-auth-provider-service`, `/api/admin-tenants`, `/api/demo-workflow` | Admin tenant UI calls `/api/admin-tenants`; additional demo actions route through `/api/demo-workflow` | `API_AND_DEMO_COMMAND_BACKED_PARTIAL` |
| Profile/client intake | `UserProfile`, `FamilyMember`, `Relationship`, `Entity`, `EntityParticipant` | profile/family/entity services update/create/upsert; demo actions also upsert/update | `ClientIntakeScreen` calls `/api/profile`, `/api/family-members`, `/api/entities`; demo actions for family map/relationships | `API_BACKED_CREATE_UPDATE_READ` for profile/family/entity; relationship mostly `DEMO_COMMAND_BACKED` |
| Documents | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink` | upload creates document/version/extraction; review creates review/link and updates document/extraction; demo workflow also upserts/updates | `ClientIntakeScreen` calls `/api/documents`, `/api/documents/upload`, `/api/documents/review` | `STRONG_API_BACKED_VERTICAL_CANDIDATE` |
| Evidence | `EvidenceRecord`, `EvidenceItem`, `EvidenceSufficiencyDecision` | create/update/find/upsert across upload, review, demo workflow, journey API, typed workflow | Evidence is created by upload/review/demo/journey commands; UI evidence surfaces exist | `SERVICE_BACKED_PARTIAL_TO_STRONG` depending on flow |
| Advisory/recommendation | `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant` | create/update/upsert/find in demo workflow, journey API, phase services and typed command bus | Internal workflow screens and `/api/demo-workflow`; journey commands | `DEMO_COMMAND_AND_SERVICE_BACKED_WORKFLOW` |
| Internal draft governance | `InternalDraft`, `DraftClassification`, `UnsupportedClaim`, `DraftTrace` | upsert/update/create in `internal-draft-governance-spine` and `typed-workflow-command-bus` | Advisor/compliance command bus rather than broad route UI | `SERVICE_BACKED_INTERNAL_WORKFLOW` |
| Journey spine | `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyCommandRun`, `JourneyEvidenceRequirement`, `JourneyDefinition` | create/update/find/createMany; command runs/audit written in `journey-api-service` | `/app/journeys` UI and `/api/journeys/**` endpoints | `API_BACKED_WORKFLOW_SPINE` |
| Export | `ExportRequest`, generated `Document`/`DocumentVersion`, `AuditEvent`, `EvidenceItem` | create/update/find in `export-workflow-command-service` and demo workflow; read snapshot in readmodel service | Current approval/download UI calls `/api/export-workflow`; older J08 demo action compatibility remains separately classifiable | `STRONG_API_BACKED_COMMAND_SPINE` |
| Audit | `AuditEvent` | create/findMany across many services | `/api/audit-events`, audit timelines, workflow responses | `BROAD_SERVICE_BACKED_AUDIT_LAYER` |
| Ops/monitoring/data quality | `ReviewSchedule`, `QueueItem`, `DataQualityIssue` | find/update/create in review/data-quality/ops services and demo workflow | Review monitoring UI/API; ops readmodel API | `SERVICE_BACKED_PARTIAL` |
| RBAC/access | `AccessRequest`, `SecondConfirmation`, `RolePermission`, `Permission` | access request update, second confirmation upsert/update, role permission upsert/findMany | Governance UI/demo workflow; permission engine uses role/permission data | `DEMO_COMMAND_AND_SERVICE_BACKED_PARTIAL` |

### Process I/O Matrix

| Process | Inputs | Local processing | Outputs / state changes | Evidence |
| --- | --- | --- | --- | --- |
| Document upload | Multipart file, tenant slug, role key, document metadata | API validates form data, permission/audit availability, service stores bytes/checksum and DB rows | `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`; safety says upload-only/review pending | `app/api/documents/upload/route.ts`, `lib/document-upload-service.ts` |
| Evidence review | Document ID, action, accepted checklist booleans, tenant/role, notes | API validates; service checks scoped document/evidence, permission and sufficiency | `DocumentReview`, updated `Document`, updated `DocumentExtraction`, `DocumentLink`, updated `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `app/api/documents/review/route.ts`, `lib/evidence-review-service.ts` |
| Profile/family/entity DBTF | JSON form payload, action/mode, tenant/role/actor scope | API validates tenant/role and delegates to DBTF services | Updated `UserProfile`, `FamilyMember`; created `Entity`; audit events in service | `app/api/profile/route.ts`, `app/api/family-members/route.ts`, `app/api/entities/route.ts`, `lib/dbtf-form-service.ts` |
| Admin tenant setup | JSON action payload | Switch dispatch to tenant/policy/security/invite/team services | Tenant/policy/user/team/security mutations and safety response; no client release | `app/api/admin-tenants/route.ts`, `lib/p44-phase2-admin-foundation.ts` |
| Demo workflow actions | `actionId` or advisor workflow typed payload | API validates action shape and dispatches to `runJ*` handlers or typed command bus | Action-specific DB updates, audit/evidence records, client visibility mostly false except controlled release paths | `app/api/demo-workflow/route.ts`, `lib/demo-workflow-validation.ts`, `lib/typed-workflow-command-bus.ts` |
| Export workflow | Command payload, tenant/role, scope/redaction/download/share details | API parses and service validates role, scope, status, forbidden payload, data-quality and approval/generation/download sequence | `ExportRequest` created/updated, audit events, package metadata; fail-closed blocked states | `app/api/export-workflow/route.ts`, `lib/export-workflow-command-service.ts` |
| Journey workflow | Current user, journey key/ID, command request | API resolves current user, checks scope/permissions, executes journey service commands | `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyCommandRun`, audit events and linked domain object updates | `app/api/journeys/**`, `lib/journeys/journey-api-service.ts` |

### Model Operation Coverage

Static scan found local Prisma operations for the following model families:

| Operation-backed models | Notes |
| --- | --- |
| `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink` | Strong document lifecycle coverage through upload/review APIs plus demo workflow. |
| `EvidenceRecord`, `EvidenceItem`, `EvidenceSufficiencyDecision` | Evidence is not just schema; multiple write/read paths exist. Completeness depends on flow-specific gates. |
| `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant`, `Trigger`, `ActionItem` | Advisory/compliance workflow has multiple persisted transitions in demo workflow, journey service and typed command bus. |
| `InternalDraft`, `DraftClassification`, `UnsupportedClaim`, `DraftTrace` | Internal draft governance is service-backed. |
| `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyCommandRun` | Journey spine is API/service-backed. |
| `ExportRequest` | Export workflow is command-service-backed with audit events and status gating. |
| `UserProfile`, `FamilyMember`, `Relationship`, `Entity`, `EntityParticipant` | Client profile/family/entity data has read/write paths; relationship write is currently demo-command-backed. |
| `ClientTenant`, `PolicyDefinition`, `User`, `UserRole`, `Role`, `RolePermission`, `AccessRequest`, `SecondConfirmation`, `ConsentRecord` | Admin/governance setup has write paths, many through demo/action-specific command flows. |
| `AuditEvent` | Central audit creation/read model is widely used. |
| `ReviewSchedule`, `QueueItem`, `DataQualityIssue` | Ops/monitoring/data-quality have partial service backing. |

### DB Editability Conclusions

1. The schema is actively used by app/API/service code. This is not a schema-only project.
2. Document upload and evidence review are the clearest UI -> API -> service -> DB process chain candidates.
3. Profile, family member and entity maintenance have real API-backed persistence, but still need test/runtime proof before `COMPLETE_VERTICAL_SLICE`.
4. Advisory/compliance/release workflows are heavily persisted but split between demo action IDs, journey commands and typed command bus. They should be reported as workflow-backed, not as generic free-form UI editability.
5. Export now has direct visible UI calls into `/api/export-workflow` for approval and controlled download, plus command-service persistence and safety tests. It remains below `COMPLETE_VERTICAL_SLICE` until focused runtime proof runs the lifecycle in this audit context.
6. Any field-level editability not shown in UI/API/service evidence remains `SCHEMA_ONLY_IN_THIS_AUDIT`.

## ANALYSIS-2.4 - Security, Guard, Audit And Test Evidence

Status: `DONE`

### Guard / Assurance Matrix

| Guard family | Local evidence | What it protects | Current classification |
| --- | --- | --- | --- |
| Permission/RBAC | `lib/permission-engine.ts`, `tests/permission-engine.spec.ts` | Cross-tenant access, object scope, compliance release, advisor approval, admin non-bypass, forbidden export roles, internal advice payload access | `CODE_AND_TEST_INTENT_STRONG` |
| Client visibility/projection | `lib/visibility-engine.ts`, `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Internal draft/rationale/compliance notes, unreleased decisions/documents, client-safe redaction, fail-closed payload projection | `CODE_AND_TEST_INTENT_STRONG` |
| Workflow release gate | `lib/workflow-gate.ts`, `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | No unapproved advice, advisor approval != release, evidence sufficiency, data-quality gate, suitability/IPS, committee review | `CODE_AND_TEST_INTENT_STRONG` |
| Audit persistence | `lib/audit-service.ts`, `tests/audit-fail-closed.spec.ts`, `tests/permission-engine.spec.ts` | Critical action minimum fields, fail-closed when audit persistence unavailable, denied audit records | `CODE_AND_TEST_INTENT_STRONG` |
| Fail-closed API envelope | `lib/control-layer/error-envelope.ts`, `tests/fail-closed-error-envelope.spec.ts` | Invalid/scope/permission/safe errors cannot silently mutate, advise or release | `CODE_AND_TEST_INTENT_STRONG` |
| Export safety | `lib/control-layer/export-safety.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `tests/export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` | Scope, redaction, approval, generation/download/share sequencing and forbidden internal payloads | `CODE_AND_TEST_INTENT_STRONG` |
| Source hierarchy guard | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts`, `tests/source-reality-gate.spec.ts` | True-UX source hierarchy, target-codebase guard, no main/patch-schema contamination | `RUNTIME_PROVEN_THIS_RUN_FOR_GUARD_SOURCE` |
| No-overclaim UI/copy | `lib/no-overclaim-copy.ts`, `tests/true-ux-no-overclaim-copy.spec.ts`, many lifecycle specs | Prevents success language like release/download/evidence sufficient when gates are not met | `CODE_AND_TEST_INTENT_STRONG` |

### Test Proof Matrix

Only `pnpm guard:source` was executed in this audit run. The other tests listed below are local test-fact evidence and runnable proof candidates, not current-run pass claims.

| Capability / risk area | Local test evidence | What the tests appear to cover |
| --- | --- | --- |
| Source truth | `tests/source-reality-gate.spec.ts`; `pnpm guard:source` runtime PASS | Source hierarchy/current target restrictions and no false target truth. |
| Document upload/review | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts` | Upload persistence, reload, checksum/version proof, invalid upload no mutation, denied role audit, review/sufficiency without client release. |
| Profile/family/entity persistence | `tests/av27-client-context-closure.spec.ts` | Saves/reloads profile, family member edits, entity creation, wrong tenant/object denial, hidden rows not disclosed. |
| Export workflow | `tests/export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` | Scope/redaction/preview/approval/generation/download/share separation and forbidden payload protection. |
| RBAC/non-bypass | `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/true-ux-governance-non-bypass.spec.ts` | Cross-tenant denial, route access not payload permission, admin cannot bypass release/export/advice gates. |
| Client projection/no leakage | `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Released client-safe payloads only; hidden internal fields; fail-closed unreleased states. |
| Workflow gates/P0 safety | `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | No unapproved advice, compliance release gates, evidence/advisor/permission conditions. |
| API fail-closed | `tests/fail-closed-error-envelope.spec.ts`, `tests/auth-spine.spec.ts` | Safe error envelope, no silent advancement, no client release, auth denies safely. |
| UI lifecycle/static affordance | `tests/*lifecycle*.spec.ts`, `tests/card-kpi-affordance-pruning.spec.ts`, `tests/button-cta-lifecycle-pruning.spec.ts`, `tests/true-ux-cta-state.spec.ts` | Modal/drawer/confirmation lifecycle, disabled/static controls, no misleading success states. |
| Schema alignment | `tests/schema-alignment.spec.ts` | Schema field availability and no patch-schema takeover. Current-run proof passed with 53 models. |

### Assurance Findings

| Finding | Evidence | Impact |
| --- | --- | --- |
| Permission model is not only decorative. | `permissionEngine.can` encodes role, tenant, object-scope, high-sensitivity, compliance/advisor/export/admin-bypass logic. | Many workflows have a code-level guard layer that can be tested independently. |
| Client projection is explicitly fail-closed. | `visibilityEngine` defines forbidden internal fields and fail-closed reason codes; tests assert hidden draft/rationale/audit fields. | Client-facing claims can be separated from internal workbench state. |
| Workflow gates are formalized. | `workflow-gate.ts` requires release status, advisor approval, compliance release, sufficient evidence, permission and optional data-quality gates. | A release/client-visible claim must pass multiple local code predicates. |
| Audit persistence is safety-critical. | `auditService.assertCriticalAuditWritable` throws if critical action audit fields are missing or audit persistence is unavailable. | Critical mutations should not be considered complete if audit fails. |
| Fail-closed API envelope prevents unsafe defaults. | `failClosedJson` forces `mutated: false`, `noAdviceExecution: true`, `noClientRelease: true`, `silentStateAdvance: false`. | Error paths are intentionally safety-preserving. |
| Test suite contains negative tests, not just happy paths. | Denial/no mutation/no leakage/no release assertions appear across permission, document, export and fail-closed tests. | Test architecture supports conservative capability classification. |

### Assurance Gaps / Limits

| Gap / limit | Why it matters |
| --- | --- |
| Most tests were not executed during this audit run. | Static test presence cannot be reported as current green runtime proof. |
| Export lifecycle still needs full vertical proof. | Export command service and approval/download UI directness are strong, but full stateful API/browser lifecycle proof was not run in this audit. |
| `/api/demo-workflow` is broad and action-ID-specific. | Some actions persist strongly; others may be navigation/audit placeholders. Each action needs individual proof before complete vertical-slice claims. |
| Schema/test count drift warning. | Resolved in current verification: static schema inventory found 53 models and `tests/schema-alignment.spec.ts` expects 53. |
| DB runtime availability was not tested. | DB-backed claims are code-path claims unless verified by running API/tests against a local DB. |

### ANALYSIS-2.4 Conclusion

Security and proof architecture is substantial: RBAC, visibility, workflow gates, audit fail-closed behavior and negative tests are present locally. The report can safely say AlphaVest has a strong local guard/test architecture. It must not say all safety tests currently pass unless those suites are executed in the current run.

Current-run update: `pnpm db:validate` passed, and `pnpm exec playwright test tests/schema-alignment.spec.ts tests/export-command-spine-contract.spec.ts tests/true-ux-api-service-ui-truth.spec.ts tests/demo-workflow-action-registry.spec.ts tests/tenant-governance-actions-api.spec.ts tests/platform-admin-actions-api.spec.ts tests/platform-admin-command-client-source.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1` passed `28/28`, proving schema alignment, capture-model context alignment, capability report drift gating, export command spine/UI truth, tenant-governance typed actions and platform-admin typed actions for this audit run.
