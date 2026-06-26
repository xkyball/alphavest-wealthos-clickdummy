# Local Capability Reality Report

Tickets: `IMPL-1.4.1`, `IMPL-1.4.2`, `IMPL-1.4.3`
Current completed slice: `IMPL-1.4.1`
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

The most important semantic cleanup finding is that `/api/demo-workflow` must not be treated as a product API. Current code and tests classify moved product-like Jxx families through typed APIs and leave only explicit demo-only compatibility under the legacy route.

## Capability Matrix

| Capability | Area | UI evidence | Handler/API evidence | Service/workflow evidence | DB/persistence evidence | Guard/audit/test evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source hierarchy guard | Repo governance | N/A | `pnpm guard:source` script | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts` | N/A | Current-run `pnpm guard:source` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Capture/report drift guard | Report/capture generation | N/A | `lib/capability-report-drift-gate.ts` | `lib/capture-screen-model-context.ts` | N/A | Current-run `tests/capture-screen-model-context.spec.ts` and `tests/capability-report-drift-gate.spec.ts` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Demo-workflow quarantine | Legacy screencast support | Product-like screens no longer import `runScreencastDemoAction` in current scan | `app/api/demo-workflow/route.ts` | `lib/demo-workflow-action-registry.ts` | Direct demo-only execution only for `j01.requestData`; moved families return typed-route guidance | Current-run `tests/demo-workflow-action-registry.spec.ts` PASS | `LEGACY_DEMO_ONLY_BOUNDARY` |
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
| Demo-workflow quarantine | N/A | Yes | Yes | Limited demo-only | Yes | Yes | Yes, registry proof `12 passed` pack | `LEGACY_DEMO_ONLY_BOUNDARY` |
| Document upload | Yes | Yes | Yes | Yes | Yes | Yes | No focused upload run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Evidence review | Yes | Yes | Yes | Yes | Yes | Yes | No focused review run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Profile update | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Family member update | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Entity create/read | Yes | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `API_BACKED_PARTIAL` |
| Data-maintenance commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Tenant-governance commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Platform-admin commands | Yes | Yes | Yes | Audit write | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advisor review J01 commands | Yes | Yes | Yes | Yes | Yes | Yes | No focused API/browser command run in this ticket | `TYPED_COMMAND_BACKED_PARTIAL` |
| Advice/release-history J02/J03 commands | Yes | Yes | Yes | Yes | Yes | Yes | Source/drift proof only; full release journey not run | `TYPED_COMMAND_BACKED_PARTIAL` |
| Recommendation review workflow | Indirect | Yes | Yes | Yes | Yes | Yes | Not run end-to-end in this ticket | `SERVICE_BACKED_INTERNAL` |
| Journey command execution | Yes | Yes | Yes | Yes | Yes | Yes | No focused journey command run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow command | Yes | Yes | Yes | Yes | Yes | Yes | No focused export lifecycle run in this ticket | `STRONG_VERTICAL_CANDIDATE` |
| Admin tenant setup | Yes | Yes | Yes | Yes | Partial by action | Partial | No focused admin run in this ticket | `API_BACKED_PARTIAL` |
| Auth demo/provider/MFA | Yes | Yes | Yes | Demo auth state | Yes | Yes | Not real-auth proof | `API_BACKED_PARTIAL` |
| Review monitoring | Yes | Yes | Yes | Partial | Yes | Partial | No focused run in this ticket | `API_BACKED_PARTIAL` |
| Global search/dashboard | Yes | Yes | Yes | Read only | Scoped reads | Partial | No focused run in this ticket | `READMODEL_ONLY` |
| Client projection | Partial | Yes | Yes | Derived/read | Yes | Yes | No focused projection run in this ticket | `SERVICE_BACKED_INTERNAL` |
| Static/disabled controls | Yes | No exact handler proof | No | No | May be intentional | Static/lifecycle tests | No | `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE` |

## IMPL Ticket Completion

| Ticket | Current result |
| --- | --- |
| `IMPL-1.4.1` | Capability Matrix and Vertical Slice Matrix produced. |
| `IMPL-1.4.2` | Pending: workflow I/O, data editability and guard/test proof sections. |
| `IMPL-1.4.3` | Pending: executive summary refinement, limitations, overclaim risks and follow-up register. |
