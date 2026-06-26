# Local Capability Reality Report

Tickets: `IMPL-1.4.1`, `IMPL-1.4.2`, `IMPL-1.4.3`
Current completed slice: `IMPL-1.4.3`
Scope: report-only local code capability audit.
Evidence rule: local code/test/runtime evidence only; documentation and older reports are not product fact unless corroborated by local files in this run.

## Current-Run Proof Boundary

Executed so far:

```text
pnpm guard:source
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1
```

Result:

- Source guard: `PASS`, `violations: 0`.
- Drift/boundary proof pack: `12 passed`.

No UI was changed for `IMPL-1.4.1`; no screenshot is required for this report-only slice.

## Executive Summary

AlphaVest is not only a static clickdummy. Static local inspection found a real Next.js application with 71 registered routes, 33 API route files, 53 Prisma models, typed command endpoints, service-layer workflows, Prisma persistence, audit writes, permission/scope/visibility guards and a broad local test inventory.

The strongest local capability candidates are document upload/review, export workflow, journey commands, data maintenance, tenant governance, advice/release-history and DBTF profile/family/entity maintenance. None is promoted to `COMPLETE_VERTICAL_SLICE` in this matrix because this ticket did not execute every required positive and negative vertical proof layer for each flow.

The most important semantic cleanup finding is that `/api/demo-workflow` must not be treated as a product API. Current code and tests classify moved product-like Jxx families through typed APIs and leave no executable demo-only compatibility under the legacy route.

Decision summary: accept this report as a conservative baseline only if `PASS_WITH_LIMITATIONS` is acceptable. A stricter `PASS` requires focused DB/browser/API proof for the strongest vertical candidates.

## Capability Matrix

| Capability | Area | UI evidence | Handler/API evidence | Service/workflow evidence | DB/persistence evidence | Guard/audit/test evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source hierarchy guard | Repo governance | N/A | `pnpm guard:source` script | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts` | N/A | Current-run `pnpm guard:source` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Capture/report drift guard | Report/capture generation | N/A | `lib/capability-report-drift-gate.ts` | `lib/capture-screen-model-context.ts` | N/A | Current-run `tests/capture-screen-model-context.spec.ts` and `tests/capability-report-drift-gate.spec.ts` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Demo-workflow quarantine | Legacy screencast support | Product-like screens no longer import `runScreencastDemoAction`; legacy client file deleted in `FOLLOWUP-4` | `app/api/demo-workflow/route.ts` | `lib/demo-workflow-action-registry.ts` | No direct demo-only execution remains; former J01/request-data and moved families return typed-route guidance | Current-run `tests/demo-workflow-action-registry.spec.ts` and `tests/screencast-new-system-contract.spec.ts` PASS | `LEGACY_DEMO_410_BOUNDARY` |
| Document upload | Client workspace / documents | `ClientIntakeScreen`, `/documents/upload` | `app/api/documents/upload/route.ts` | `lib/document-upload-service.ts` | `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | Upload safety response and local upload tests exist | `STRONG_VERTICAL_CANDIDATE` |
| Evidence/document review | Client workspace / evidence | `ClientIntakeScreen` review/sufficiency controls | `app/api/documents/review/route.ts` | `lib/evidence-review-service.ts` | `DocumentReview`, `DocumentLink`, `EvidenceItem`; updates document/extraction/evidence | Permission, sufficiency and audit failure branches; local review tests exist | `STRONG_VERTICAL_CANDIDATE` |
| Profile edit | Client workspace / profile | `ClientIntakeScreen` profile form | `app/api/profile/route.ts` | `lib/dbtf-form-service.ts` | `UserProfile` update path | Tenant/role validation, scoped response; local tests exist | `API_BACKED_PARTIAL` |
| Family member edit | Client workspace / family | `ClientIntakeScreen` family forms | `app/api/family-members/route.ts` | `lib/dbtf-form-service.ts` | `FamilyMember` update path | Tenant/object/permission checks and denied audit path | `API_BACKED_PARTIAL` |
| Entity create/read | Client workspace / entities | `ClientIntakeScreen` entity wizard | `app/api/entities/route.ts` | `lib/dbtf-form-service.ts`, `lib/dbtf-table-service.ts` | `Entity`, `EntityParticipant` | Scoped validation and no-client-release safety | `API_BACKED_PARTIAL` |
| Data maintenance typed commands | Client workspace / wealth actions | `runDataMaintenanceCommand` in client/wealth screens | `app/api/data-maintenance/actions/route.ts` | `lib/data-maintenance-workflow-actions.ts` | Documents, entities, profile/family/relationships plus audit/evidence rows | Typed action allow-list; no advice/client release; local API/source tests exist | `TYPED_COMMAND_BACKED_PARTIAL` |
| Tenant governance typed commands | Tenant setup / governance / export-ops | `runTenantGovernanceCommand` in admin/governance/export-ops screens | `app/api/tenant-governance/actions/route.ts` | `lib/tenant-governance-workflow-actions.ts` | Tenant, user, role, access, policy, export-audit support rows | Typed allow-list, audit mutation result, no-client-release envelope; local tests exist | `TYPED_COMMAND_BACKED_PARTIAL` |
| Platform admin typed commands | Platform/security/admin | `runPlatformAdminCommand` in admin screens | `app/api/platform-admin/actions/route.ts` | `lib/platform-admin-workflow-actions.ts` | `AuditEvent` command records | Typed allow-list and no-advice/no-release response; local tests exist | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advisor review J01 typed commands | Advisory workflow | `runAdvisorReviewCommand` in internal workflow screen | `app/api/advisor-review/actions/route.ts` | `lib/advisor-review-workflow-actions.ts` | Trigger, recommendation, approval, audit rows | Typed allow-list, no advice/client release; local tests exist | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advice/release-history J02/J03 typed commands | Decisions / evidence / compliance | `runAdviceReleaseHistoryCommand` in decisions/governance screen | `app/api/advice-release-history/actions/route.ts` | `lib/advice-release-history-workflow-actions.ts` | Compliance, recommendation, evidence, action item, decision and participant state | Workflow/data-quality/audit gates; source tests exist | `TYPED_COMMAND_BACKED_PARTIAL` |
| Recommendation review workflow | Advisor/compliance release path | Client exists in `lib/recommendation-review-workflow-client.ts` | `app/api/recommendation-review-workflow/route.ts` | `lib/recommendation-review-workflow-api.ts`, `lib/typed-workflow-command-bus.ts` | Recommendation/approval/compliance/evidence/audit state by action | Permission, audit and workflow gate errors fail closed | `SERVICE_BACKED_INTERNAL` |
| Journey list/create/commands | Journey spine | Journey UI/client surfaces | `app/api/journeys/**` | `lib/journeys/journey-api-service.ts` | Journey instance/step/object/command/evidence support models | Current-user scope, command parser, fail-closed errors; local tests exist | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow command spine | Export | Export routes and export UI API calls | `app/api/export-workflow/route.ts` | `lib/export-workflow-command-service.ts`, readmodel service | `ExportRequest`, audit events, package metadata | Scope/redaction/approval/download guards; local tests exist | `STRONG_VERTICAL_CANDIDATE` |
| Admin tenant foundation | Platform / tenant setup | `AdminTenantSetupScreen` | `app/api/admin-tenants/route.ts` | `lib/p44-phase2-admin-foundation.ts`, demo auth provider service | Tenant, user, role, policy and consent support rows | Validation/permission/auth error handling, no production-auth claim | `API_BACKED_PARTIAL` |
| Auth demo/provider/MFA | Access | `AuthOnboardingScreen` | Auth provider/login/MFA/dummy/logout routes | Demo auth/current-user services | Demo user/session-related state | Explicit demo posture; not real auth hardening | `API_BACKED_PARTIAL` |
| Review monitoring / ops SLA | Operations | Review monitoring and ops screens | `app/api/review-monitoring/**`, `app/api/ops-sla/route.ts` | review monitoring and ops readmodel services | Review schedule, queue, trigger, recommendation and data quality rows | Fail-closed/action allow-list evidence; local tests exist | `API_BACKED_PARTIAL` |
| Global search and dashboard metrics | Navigation / overview | Search/dashboard candidates | `app/api/global-search`, `app/api/dashboard-metrics` | search/readmodel services | Read queries and counts | No write claim | `READMODEL_ONLY` |
| Client projection and visibility | Client-facing safety | Client/projected surfaces | Journey projection API and visibility services | `visibility-engine`, workflow gates | Derived/read projection | No-leakage tests exist | `SERVICE_BACKED_INTERNAL` |
| Committee/KYC/Suitability release controls | Sensitive workflow UI | Buttons and controls visible but disabled/static in key states | Some typed/journey support exists | Workflow gates and journey services | Action-specific, not generic | Explicit safety-disabled UI | `BLOCKED_UI_SAFETY_STATE` |
| Reference pages | Operations/reference | Service blueprint, roadmap, states | None required for product mutation | None | None | Route metadata says reference-only | `UI_ONLY_STATIC` |
| Static/held UI affordances | Across screens | `data-ux-interactive="false"`, static-control notes, disabled controls | No paired handler for many controls | None for exact affordance | None | Lifecycle/static tests exist as intent | `UI_ONLY_STATIC` |

## Vertical Slice Matrix

| Flow | UI | API/handler | Service/workflow | DB/write/read | Guard/audit | Test intent | Current-run proof | Vertical decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Source truth guard | N/A | Yes | Yes | N/A | Yes | Yes | Yes, `pnpm guard:source` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Capture/report drift guard | N/A | Yes | Yes | N/A | Yes | Yes | Yes, drift/capture pack `12 passed` | `RUNTIME_PROVEN_THIS_RUN` |
| Demo-workflow quarantine | N/A | Yes | Yes | No direct mutation path | Yes | Yes | Yes, registry/API proof pack | `LEGACY_DEMO_410_BOUNDARY` |
| Document upload | Yes | Yes | Yes | Yes | Yes | Yes | No focused upload run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Evidence review | Yes | Yes | Yes | Yes | Yes | Yes | No focused review run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Profile update | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Family member update | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Entity create/read | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Data-maintenance commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Tenant-governance commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Platform-admin commands | Yes | Yes | Yes | Audit write | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advisor review J01 commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advice/release-history J02/J03 commands | Yes | Yes | Yes | Yes | Yes | Yes | Focused typed-boundary proof pack passed after migrating stale lifecycle proof off `/api/demo-workflow`; full release journey still not certified | `TYPED_COMMAND_BACKED_PARTIAL` |
| Recommendation review workflow | Indirect | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `SERVICE_BACKED_INTERNAL` |
| Journey command execution | Yes | Yes | Yes | Yes | Yes | Yes | No focused journey command run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow command | Yes | Yes | Yes | Yes | Yes | Yes | No focused export lifecycle run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Admin tenant setup | Yes | Yes | Yes | Yes | Partial by action | Partial | No focused admin run in this ticket | `API_BACKED_PARTIAL` |
| Auth demo/provider/MFA | Yes | Yes | Yes | Demo auth state | Yes | Yes | Not real-auth proof | `API_BACKED_PARTIAL` |
| Review monitoring | Yes | Yes | Yes | Partial | Yes | Partial | No focused run in this ticket | `API_BACKED_PARTIAL` |
| Global search/dashboard | Yes | Yes | Yes | Read only | Scoped reads | Partial | No focused run in this ticket | `READMODEL_ONLY` |
| Client projection | Partial | Yes | Yes | Derived/read | Yes | Yes | No focused projection run in this ticket | `SERVICE_BACKED_INTERNAL` |
| Static/disabled controls | Yes | No exact handler proof | No | No | May be intentional | Static/lifecycle tests | No | `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE` |

## Workflow I/O Matrix

| Workflow | Inputs | Processing path | Outputs/state changes | Failure/safety path | Report classification |
| --- | --- | --- | --- | --- | --- |
| Document upload | Multipart file, tenant slug, role key, document metadata, audit simulation flag | `app/api/documents/upload/route.ts` validates multipart/file/scope -> `uploadDocument` | Safe document metadata plus document/version/extraction/evidence/audit IDs | Invalid multipart/file/scope/audit failures return fail-closed responses; no client release | `STRONG_VERTICAL_CANDIDATE` |
| Evidence review | Document ID, action, notes, sufficiency booleans, tenant, role, audit simulation flag | `app/api/documents/review/route.ts` validates JSON/action/scope -> `reviewDocumentEvidence` | Review/link/evidence item and updated document/extraction/evidence state | Validation, not-found, permission, insufficiency and audit-unavailable branches fail closed | `STRONG_VERTICAL_CANDIDATE` |
| DBTF profile save | Tenant slug, role key, actor tenant, profile payload, save/submit mode | `/api/profile` -> `saveDbtfClientProfile` | Updated `UserProfile` result with no client release | Invalid scope, permission, validation and not-found branches | `API_BACKED_PARTIAL` |
| Family member update | Tenant slug, role key, actor tenant, family payload | `/api/family-members` -> `updateDbtfFamilyMember` | Updated family-member result | Scope/actor-tenant denial, validation, permission and not-found branches | `API_BACKED_PARTIAL` |
| Entity wizard | Tenant slug, role key, actor tenant, entity payload, save/submit mode | `/api/entities` -> `saveDbtfEntityWizard` | Entity and participant state | Scope denial, validation and permission branches | `API_BACKED_PARTIAL` |
| Data-maintenance typed actions | J04/J05/J09 action ID | `/api/data-maintenance/actions` allow-list -> `runDataMaintenanceWorkflowAction` | Document/entity/profile/family/relationship maintenance rows plus audit/evidence rows | Invalid family action and audit-unavailable failures block execution; no advice/client release | `TYPED_COMMAND_BACKED_PARTIAL` |
| Tenant-governance typed actions | J06/J07 action ID | `/api/tenant-governance/actions` allow-list -> `runTenantGovernanceWorkflowAction` | Tenant/user/role/access/policy/export-audit support rows | Invalid action and audit-unavailable failures block execution; no advice/client release | `TYPED_COMMAND_BACKED_PARTIAL` |
| Platform-admin typed actions | J10 action ID | `/api/platform-admin/actions` allow-list -> `runPlatformAdminWorkflowAction` | Audit event command record | Invalid action or service failure returns safe error; no product CRUD overclaim | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advisor review J01 typed actions | J01 advisor-review action ID | `/api/advisor-review/actions` allow-list -> `runAdvisorReviewWorkflowAction` | Trigger, recommendation, approval and audit state | Invalid action and audit-unavailable failures block execution; no advice/client release | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advice/release-history typed actions | J02/J03 action ID, audit failure simulation flag | `/api/advice-release-history/actions` -> `runAdviceReleaseHistoryWorkflowAction` | Compliance, recommendation, evidence, action, decision and participant transitions | Invalid action, audit-unavailable, workflow gate and data-quality blockers fail closed | `TYPED_COMMAND_BACKED_PARTIAL` |
| Recommendation review workflow | Advisor approval workflow payload with action, actor role, target, reason, evidence IDs, confirmation | `/api/recommendation-review-workflow` -> `handleRecommendationReviewWorkflowRequest` -> `runAdvisorApprovalWorkflowMutation` | Advisor/release workflow state by command | Permission, audit and release-precondition failures return safe errors | `SERVICE_BACKED_INTERNAL` |
| Journey command | Journey ID, current user, typed command body | `/api/journeys/[id]/commands` -> `parseJourneyCommandRequest` -> `executeJourneyCommandForCurrentUser` | Journey command runs, step/instance state, evidence/decision/recommendation state by command family | Missing user, invalid command, scope denial and permission failures block state advance | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow | Command ID, tenant, role, export request, scope/redaction/payload/share flags | `/api/export-workflow` -> `parseExportWorkflowCommandRequest` -> `executeExportWorkflowCommand` | Export request status, audit event and package metadata | Role, scope, redaction, status, data-quality and unsafe-payload blockers fail closed | `STRONG_VERTICAL_CANDIDATE` |
| Legacy demo route | Legacy action ID | `/api/demo-workflow` -> `demoWorkflowActionBoundaryFor` -> fail-closed typed-route guidance | No direct legacy mutation result remains | Product-like and former demo-only actions return `410` with canonical typed API route | `LEGACY_DEMO_410_BOUNDARY` |

## Data Editability Matrix

| Data family | Create | Update | Read/list | Derived/projection | Local classification |
| --- | --- | --- | --- | --- | --- |
| Documents | Yes via upload/service and typed commands | Yes via review/data-maintenance commands | Yes via document APIs/services | Evidence lifecycle and safe document projection | `STRONG_API_BACKED_EDITABLE_WORKFLOW` |
| Evidence | Yes across upload/review/journey/typed commands | Yes across review/workflow commands | Yes through document/evidence/journey surfaces | Sufficiency and client/export readiness | `WORKFLOW_OWNED_EDITABLE` |
| Profile | Not general create in UI path | Yes via profile PATCH and typed J09 command | Yes via profile GET | Scoped/hidden rows | `API_BACKED_EDITABLE_PARTIAL_FIELD_SCOPE` |
| Family members | Seed/demo-backed create; typed upsert paths exist | Yes via PATCH and typed J09 commands | Yes via family API/table service | Relationship map support | `API_BACKED_EDITABLE_PARTIAL_FIELD_SCOPE` |
| Relationships | Typed command upsert | Typed command upsert | Indirect through profile/family context | Family map | `TYPED_COMMAND_EDITABLE_NOT_GENERAL_FORM_CRUD` |
| Entities | Yes via entity POST and typed J05 commands | Yes via typed command/update paths | Yes via entity list API | Entity wizard state | `API_AND_TYPED_COMMAND_EDITABLE` |
| Journey spine | Yes via journey create | Yes via commands | Yes via journey APIs | Client projection/evidence sufficiency | `STRONG_TYPED_COMMAND_EDITABLE` |
| Export requests | Yes via `SET_SCOPE` command | Yes via redaction/preview/approve/generate/download/share commands | Yes via readmodel | Package/download/share readiness | `STRONG_TYPED_COMMAND_EDITABLE` |
| Tenant governance | Yes for tenant/user/role/access support objects through typed/admin flows | Yes through typed governance commands | Yes through admin/readmodel surfaces | Governance/audit state | `TYPED_COMMAND_EDITABLE_GOVERNANCE_SCOPE` |
| Platform admin | No broad platform setting persistence proven in inspected command service | Audit-command records only | Read/context surfaces exist | Platform/security command audit trail | `AUDIT_RECORD_ONLY_FOR_PLATFORM_COMMANDS` |
| Advice/release workflow | Yes/upsert paths by typed/internal services | Yes by typed workflow commands | Yes by workflow/readmodel surfaces | Client visibility/release projection | `TYPED_COMMAND_EDITABLE_SAFETY_SENSITIVE` |
| Monitoring / ops | Some service-backed create/update | Yes for review schedule, queue, trigger, action, recommendation and data-quality state | Yes via monitoring/ops APIs | SLA/data-quality state | `SERVICE_BACKED_PARTIAL` |
| Search/dashboard | No write claim | No write claim | Yes | Counts/derived readmodel | `READMODEL_ONLY` |
| Messages/calls/assets/objectives/engagement | Seed/schema evidence only in this audit | No current non-seed app/lib write path found | Some display/read context may exist | N/A | `SCHEMA_SEED_ONLY_IN_THIS_AUDIT` |

## Security / Audit / Test Proof Matrix

| Assurance area | Local evidence | Current audit use | Claim boundary |
| --- | --- | --- | --- |
| Permission/RBAC | `lib/permission-engine.ts`, control-layer permission/scope helpers, `tests/permission-engine.spec.ts` | Supports route/action/payload scope separation and non-bypass logic | Unrun tests remain proof intent except targeted current-run pack. |
| Visibility/client projection | `lib/visibility-engine.ts`, `lib/ui-clickflow-guards.ts`, client projection tests | Supports no-leakage and client-safe projection claims | Does not prove every route payload unless flow-specific proof runs. |
| Workflow release gates | `lib/workflow-gate.ts`, journey release code, workflow gate tests | Supports no unapproved advice, evidence, suitability/IPS, data-quality and audit release blockers | Complete release claims require flow-specific runtime proof. |
| Audit persistence | `lib/audit-service.ts`, typed command services, audit fail-closed tests | Supports no critical mutation without audit availability/minimum fields | External audit durability beyond local DB/service is not certified. |
| Fail-closed API envelope | `lib/control-layer/error-envelope.ts`, routes using `failClosedJson` | Supports invalid/scope/permission/safe error handling | Per-route negative proof is needed for complete claims. |
| Export safety | `lib/export-service.ts`, `lib/control-layer/export-safety.ts`, export workflow tests | Supports scope/redaction/approval/download/share separation and forbidden payload exclusion | Full package/binary realism is not claimed. |
| Demo-workflow quarantine | `lib/demo-workflow-action-registry.ts`, `app/api/demo-workflow/route.ts`, current-run registry proof | Supports product-command split away from `/api/demo-workflow` | Legacy support file still exists; do not treat it as product API. |
| Capture/report drift | `lib/capture-screen-model-context.ts`, `lib/capability-report-drift-gate.ts`, current-run drift proof | Prevents stale route/model/API counts and complete-slice overclaims | Guards report/capture truth, not functional runtime behavior. |
| Source hierarchy | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts`, current-run `pnpm guard:source` | Confirms source hierarchy/current target constraints | Does not prove product workflow functionality. |
| UI static/blocked states | lifecycle/static/a11y tests | Supports intentional static/disabled UI classification | UI state tests do not prove service persistence. |

## Missing Proof Register For 1.4.2

| Missing proof | Impact |
| --- | --- |
| Full DB/browser suites not run in this ticket | No product capability is promoted to `COMPLETE_VERTICAL_SLICE`. |
| Field-level editability not exhaustively validated | Data matrix stays at process/model-family level. |
| Platform admin command persistence is audit-record-only | Do not call platform admin a full platform/security settings CRUD surface. |
| Legacy screencast client file remains present | Keep `/api/demo-workflow` classified as a legacy fail-closed boundary until deletion/quarantine is proved. |

## Limitations

| Limitation | Consequence |
| --- | --- |
| Full DB/browser/API vertical suites were not run for every flow | No product capability is marked `COMPLETE_VERTICAL_SLICE`. |
| Current-run proof pack targeted source/capture/report/demo-boundary drift | It proves the drift boundary, not the runtime behavior of every capability. |
| Field-level editability is not exhaustively validated | Editability claims stay at model/process-family level. |
| Platform-admin command persistence is audit-record-only in inspected code | Do not overclaim full platform/security settings CRUD. |
| Legacy screencast client still exists | `/api/demo-workflow` remains a legacy support boundary until deletion/quarantine is separately authorized and tested. |
| Four pre-existing generated/source JSON files are dirty outside this slice | They remain excluded from this report run unless separately reconciled. |

## Overclaim Risk Register

| Risk | Why it is dangerous | Required correction |
| --- | --- | --- |
| Calling the whole app complete | The repo has real workflows, but also static/blocked/partial/unrun surfaces | Use per-capability labels only. |
| Treating `/api/demo-workflow` as a product API | It is now a legacy fail-closed boundary; product-like Jxx families must use typed APIs | Keep moved actions on typed routes and delete/quarantine remaining demo support when possible. |
| Treating schema breadth as editability | 53 models do not imply field-level UI/API editing | Require handler/service/write-path proof per data family. |
| Treating test existence as current pass proof | Most tests were inventoried, not run | Mark unrun tests as `TEST_INTENT`; list current-run commands verbatim. |
| Treating visible UI as workflow proof | Buttons/drawers/routes may be static, held or safety-blocked | Require API/service/DB/guard mapping before capability claims. |
| Treating platform-admin as full settings CRUD | Current typed path writes audit command records, not broad platform setting persistence | Keep status as typed command/audit-backed until product setting model writes are authorized and proved. |
| Treating client projection as release | Projection code can hide internal data, but release requires separate gate proof | Keep projection, permission and release gates separate in all reports. |
| Letting generated report channels drift | JSON/PDF/Markdown source layers can reintroduce stale counts or demo wording | Keep `capability-report-drift-gate` and capture context as generator gates. |

## Bold Legacy-Cleanup Recommendations

1. Delete or hard-quarantine `lib/screencast-demo-client.ts` from product screens after confirming no remaining seed/screencast dependency needs it. Do not leave it as a semi-official product client.
2. Keep J01 on the typed advisor-review/recommendation-review command surfaces and reject any attempt to reintroduce direct `/api/demo-workflow` mutation support. This is the last meaningful cleanup to stop `/api/demo-workflow` from looking like a shadow product API.
3. Promote typed command clients as the only acceptable product-like action path: data maintenance, tenant governance, platform admin, advice/release history, advisor review, export and journeys.
4. Add a hard report-generation gate that fails on stale `32` API-route truth, stale model counts, `COMPLETE_VERTICAL_SLICE` overclaims and product-like demo-workflow language.
5. Remove static controls from product routes unless they are safety-blocked with explicit data-driven reasons. If a control is not intended to work, either make that state honest or delete it.
6. Run a focused proof pack before any higher maturity claim: document upload/review, DBTF form maintenance, export lifecycle, journey commands, tenant governance, platform admin and advice/release-history.
7. Keep reference pages as reference pages. Do not let roadmap/state/service-blueprint screens count toward product capability acceptance.

## Candidate Follow-Up Register

| Candidate | Goal | Recommendation |
| --- | --- | --- |
| Focused runtime proof pack | Run the strongest vertical candidates end to end with DB/API/browser proof | High priority before any complete-slice claim. |
| J01 final split | Completed in `FOLLOWUP-2`: `j01.requestData`, route and escalation now use typed advisor-review commands; `/api/demo-workflow` returns `410` | Keep regression tests and remove the screencast client path from product-like screens. |
| Screencast client deletion audit | Completed in `FOLLOWUP-4`: deleted `lib/screencast-demo-client.ts` and guarded it as retired source | Keep typed clients as the only product-like command surface. |
| Generated JSON/PDF/Markdown source reconciliation | Bring all generated/source channels to the same `LEGACY_DEMO_410_BOUNDARY` and typed-command terminology | Prevents later copy steps from reintroducing stale semantics. |
| Platform-admin persistence decision | Decide whether platform/security commands should remain audit-record-only or receive real settings persistence | Human decision required before implementation. |
| Static affordance purge | Delete/wire/quarantine static/held product-looking controls | Recommended after proof baseline acceptance. |
| Capability status generator | Generate capability matrices directly from route/API/service/test maps | Useful to prevent future manual report drift. |

## IMPL Ticket Completion

| Ticket | Current result |
| --- | --- |
| `IMPL-1.4.1` | Capability Matrix and Vertical Slice Matrix produced. |
| `IMPL-1.4.2` | Workflow I/O, data editability and guard/test proof sections produced. |
| `IMPL-1.4.3` | Executive summary, limitations, overclaim risks and follow-up register produced. |
