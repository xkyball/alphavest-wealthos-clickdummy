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

Status: `PENDING`

Next required step: map the `ANALYSIS-2.1` UI/API/typed-command candidates to API handlers, services, workflow parsers, validation rules and response safety envelopes. No data-flow completion claim is made yet in this current ordered run.

## ANALYSIS-2.3 - DB Editability, Persistence And Process I/O

Status: `PENDING`

Blocked until `ANALYSIS-2.2` establishes the actual API, service and workflow data-flow paths that deserve DB/persistence inspection.

## ANALYSIS-2.4 - Security, Guard, Audit And Test Evidence

Status: `PENDING`

Blocked until `ANALYSIS-2.2` and `ANALYSIS-2.3` identify the concrete capability claims that require guard, audit and test evidence.
