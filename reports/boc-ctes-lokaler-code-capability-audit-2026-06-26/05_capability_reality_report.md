# Local Capability Reality Report

Tickets: `IMPL-1.4.1`, `IMPL-1.4.2`, `IMPL-1.4.3`  
Status: `DONE`  
Scope: report-only local code capability audit.  
Evidence rule: local code/test/runtime evidence only; documentation and older reports are not product fact unless corroborated by local files.

## Executive Summary

AlphaVest is not only a static clickdummy. Static local inspection found a real Next.js app with 71 registered routes, API handlers, Prisma-backed services, a broad data model, workflow command surfaces, audit creation, permission checks, visibility guards, export guards and a focused test suite.

The strongest implementation evidence is in document upload, evidence review, client profile/family/entity maintenance, journey commands, export command services with direct export UI calls, and internal advisor/compliance workflow services. These areas show UI, API, service, DB, guard and test-intent layers in different strengths.

This audit ran `pnpm guard:source`, `pnpm db:validate`, and a focused Playwright proof pack for schema alignment, export command spine, export UI/API truth, demo-workflow action boundaries, data-maintenance typed actions, tenant-governance typed actions, platform-admin typed actions, capture model context and capability report drift gating. It did not run full product browser journeys or DB-backed vertical suites for every flow. Therefore this report intentionally avoids broad product `COMPLETE_VERTICAL_SLICE` claims. The honest top classification is `STRONG_VERTICAL_CANDIDATE` where the local layer chain is strong and focused proof exists or is directly runnable, but full vertical runtime proof is still pending.

The largest remaining legacy risk is the broad `/api/demo-workflow` action bus. It contains many real persisted mutations, but it also makes product truth hard to read because action IDs mix demo flow, screencast support, seeded transitions and domain-like workflow state. The bold cleanup path is to split or demote it: typed domain commands become authoritative APIs, and demo-only actions become visibly non-product demo helpers.

## Capability Matrix

| Capability | Area | UI evidence | Handler/API evidence | Service/workflow evidence | DB/persistence evidence | Guard/audit/test evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source hierarchy guard | Repo governance | N/A | `pnpm guard:source` script | `scripts/source-target-guard.ts`, `lib/source-reality-gate.ts` | N/A | Current-run `pnpm guard:source` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Document upload | Client workspace / documents | `ClientIntakeScreen` upload flow, `/documents/upload` route metadata | `app/api/documents/upload/route.ts` `POST` | `lib/document-upload-service.ts` | Creates `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | Upload safety response; local tests `document-upload-api`, `document-upload-flow` | `STRONG_VERTICAL_CANDIDATE` |
| Evidence/document review | Client workspace / evidence | `ClientIntakeScreen` review/sufficiency controls | `app/api/documents/review/route.ts` `POST` | `lib/evidence-review-service.ts` | Creates `DocumentReview`, `DocumentLink`, `EvidenceItem`; updates document/extraction/evidence state | Permission, sufficiency and audit failure branches; `evidence-review-api` tests | `STRONG_VERTICAL_CANDIDATE` |
| Profile edit | Client workspace / profile | `ClientIntakeScreen` profile form | `app/api/profile/route.ts` `GET`/`PATCH` | `lib/dbtf-form-service.ts` | Updates `UserProfile` | Tenant/role validation, scoped response; `av27-client-context-closure` test intent | `STRONG_VERTICAL_CANDIDATE` |
| Family member edit | Client workspace / family | `ClientIntakeScreen` family forms | `app/api/family-members/route.ts` `GET`/`PATCH` | `lib/dbtf-form-service.ts` | Updates `FamilyMember` | Tenant/object/permission checks and denied audit path; test intent exists | `STRONG_VERTICAL_CANDIDATE` |
| Entity create/read | Client workspace / entities | `ClientIntakeScreen` entity wizard | `app/api/entities/route.ts` `GET`/`POST` | `lib/dbtf-form-service.ts`, `lib/dbtf-table-service.ts` | Creates/updates `Entity`, `EntityParticipant` | Scoped validation and no-client-release safety; test intent exists | `STRONG_VERTICAL_CANDIDATE` |
| Admin tenant setup | Platform / tenant setup | `AdminTenantSetupScreen` | `app/api/admin-tenants/route.ts` `GET`/`POST`, `/api/platform-admin/actions` `POST`, `/api/tenant-governance/actions` `POST` | `p44-phase2-admin-foundation`, demo auth provider service, `platform-admin-workflow-actions`, `tenant-governance-workflow-actions` | Tenant, user, role, policy, platform/security-related mutations | Auth/permission/validation responses; current-run typed tenant/platform action tests passed; no production-auth claim | `API_BACKED_PARTIAL` |
| Auth demo/provider/MFA | Access | `AuthOnboardingScreen` | Auth provider, provider-login, dummy, MFA, logout API routes | Demo auth/current-user services | Demo user/session-related state | Explicit demo posture; not real-auth hardening | `API_BACKED_PARTIAL` |
| Journey list/create/commands | Journey spine | `app/journeys/**`, journey components | `app/api/journeys/**` | `lib/journeys/journey-api-service.ts` | `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyCommandRun` | Fail-closed route helpers; `journey-api` test intent | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow command spine | Export | Export approval and download UI call `/api/export-workflow`; older support/demo affordances remain separate | `app/api/export-workflow/route.ts` | `lib/export-workflow-command-service.ts`, readmodel service | `ExportRequest`, audit events, package metadata | Export safety guards; current-run export command-spine and UI/API truth tests passed | `STRONG_VERTICAL_CANDIDATE` |
| Advisor/compliance typed workflow | Advisory workflow | Internal workflow screens and demo workflow path | `/api/demo-workflow` typed branch | `lib/typed-workflow-command-bus.ts`, internal draft governance spine | `InternalDraft`, approvals, reviews, recommendation state | Audit persistence checks, release preconditions, client projection | `SERVICE_BACKED_INTERNAL` |
| Data maintenance typed commands | Client workspace / wealth actions | `runDataMaintenanceCommand` calls in Client Intake and Wealth Actions screens | `/api/data-maintenance/actions` | `lib/data-maintenance-workflow-actions.ts`, `lib/data-maintenance-command-client.ts` | Document, entity, profile/family and relationship maintenance writes plus audit events | Current-run API/source proof passed; `/api/demo-workflow` returns 410 for J04/J05/J09 with no advice or client release | `STRONG_VERTICAL_CANDIDATE` |
| Broad demo workflow actions | Remaining call sites only in `j01`, `j02` and `j03` screen families | `runScreencastDemoAction` and direct demo action calls | `app/api/demo-workflow/route.ts` | Remaining `runJ*` handlers | Persisted compatibility updates across recommendations/evidence/advice-history shaped states; export, monitoring, Phase B/C, data-maintenance, tenant/governance and platform-admin families are moved or retired | Current-run action-registry proof verifies executable actions are demo-only and moved product families fail closed | `DEMO_COMMAND_BACKED_PARTIAL` |
| Tenant governance typed commands | Tenant setup / governance / access audit | `runTenantGovernanceCommand` calls in Admin, Governance and Export-Ops screens | `/api/tenant-governance/actions` | `lib/tenant-governance-workflow-actions.ts`, `lib/tenant-governance-command-client.ts` | Tenant drafts, team assignments, invitations, scoped role confirmation, access approval, audit export control | Current-run API proof passed; typed action allow-list, audit mutation result, no-client-release safety envelope | `API_BACKED_PARTIAL` |
| Platform admin typed commands | Platform settings / role templates / security | `runPlatformAdminCommand` calls in Admin screens | `/api/platform-admin/actions` | `lib/platform-admin-workflow-actions.ts`, `lib/platform-admin-command-client.ts` | Platform setting audit, audit context view, permission review, security configuration audit | Current-run API/source proof passed; typed action allow-list, audit result, no-advice/no-client-release safety envelope | `API_BACKED_PARTIAL` |
| Client projection and visibility | Client-facing safety | Client/projected surfaces | Journey projection API and visibility services | `visibility-engine`, workflow gates | Derived/read projection | Strong no-leakage test intent | `SERVICE_BACKED_INTERNAL` |
| Review monitoring / ops SLA | Operations | Review monitoring and ops screens | `app/api/review-monitoring`, `app/api/ops-sla` | monitoring and ops readmodel services | `ReviewSchedule`, `QueueItem`, `DataQualityIssue` partial operations | Monitoring guard/test intent | `API_BACKED_PARTIAL` |
| Global search and dashboard metrics | Navigation / overview | dashboard/search UI candidates | `app/api/global-search`, `app/api/dashboard-metrics` | search/readmodel services | read queries / derived outputs | No write claim | `READMODEL_ONLY` |
| Committee/KYC/Suitability release buttons | Sensitive workflow UI | Buttons and controls visible but disabled/static in key states | Some demo workflow handlers exist | workflow gate and demo handlers | action-specific, not generic | Explicit safety-disabled UI | `BLOCKED_UI_SAFETY_STATE` |
| Reference pages | Operations/reference | service blueprint, roadmap, states | None required for product mutation | None | None | route metadata says reference-only | `UI_ONLY_STATIC` |
| Static/held UI affordances | Across screens | `data-ux-interactive="false"`, `static-control-note`, disabled controls | No paired handler for many controls | None found for those exact affordances | None | lifecycle/static tests exist as intent | `UI_ONLY_STATIC` |

## Vertical Slice Matrix

| Flow | UI | API/handler | Service/workflow | DB/write/read | Guard/audit | Test intent | Current-run proof | Vertical decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Source truth guard | N/A | Script | Source guard | N/A | Guard itself | `source-reality-gate` | Yes, `pnpm guard:source` PASS | `RUNTIME_PROVEN_THIS_RUN` |
| Document upload | Yes | Yes | Yes | Yes | Yes | Yes | No focused upload run | `STRONG_VERTICAL_CANDIDATE` |
| Evidence review | Yes | Yes | Yes | Yes | Yes | Yes | No focused review run | `STRONG_VERTICAL_CANDIDATE` |
| Profile update | Yes | Yes plus typed J09 command | Yes plus typed data-maintenance service | Yes | Yes | Yes | Current-run data-maintenance API proof passed; full browser DB form run still pending | `STRONG_VERTICAL_CANDIDATE` |
| Family member update | Yes | Yes plus typed J09 command | Yes plus typed data-maintenance service | Yes | Yes | Yes | Current-run data-maintenance API proof passed; full browser DB form run still pending | `STRONG_VERTICAL_CANDIDATE` |
| Entity create | Yes | Yes plus typed J05 command | Yes plus typed data-maintenance service | Yes | Yes | Yes | Current-run data-maintenance API proof passed; full browser DB form run still pending | `STRONG_VERTICAL_CANDIDATE` |
| Journey command execution | Yes | Yes | Yes | Yes | Yes | Yes | No focused journey run | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow command | Yes for approval/download; staged export routes exist | Yes | Yes | Yes | Yes | Yes | Current-run export browser/API lifecycle proof passed for approval and download separation | `STRONG_VERTICAL_CANDIDATE` |
| Tenant-governance typed commands | Yes in Admin/Governance/Export-Ops controls | Yes | Yes | Yes | Yes | Yes | Current-run tenant-governance API and browser lifecycle proof passed for invite, role confirmation and access review | `API_BACKED_PARTIAL` |
| Platform-admin typed commands | Yes in Admin controls | Yes | Yes | Audit write | Yes | Yes | Current-run platform-admin API/source/browser proof passed for platform and security command clicks | `API_BACKED_PARTIAL` |
| Admin tenant setup | Yes | Yes | Yes | Yes | Partial by action | Partial | No focused admin run | `API_BACKED_PARTIAL` |
| Advisor/compliance release governance | Mixed/internal | Yes through demo/typed bus | Yes | Yes | Yes | Yes | No focused release run | `SERVICE_BACKED_INTERNAL` |
| Data-maintenance command IDs | Yes in client workspace and wealth actions | Yes | Yes | Yes | Yes | Focused API/source/demo-retirement tests exist | Current-run data-maintenance proof passed; browser form pack still pending | `STRONG_VERTICAL_CANDIDATE` |
| Demo workflow action IDs | Yes for remaining advice/evidence-history shaped families | Yes | Yes for remaining J01/J02/J03 actions | Yes for many remaining actions | Varies by action | Broad tests exist | Current-run registry proves moved J04/J05/J09 cannot execute on demo workflow | `DEMO_COMMAND_BACKED_PARTIAL` |
| Client projection | Partial UI | Yes/read APIs | Yes | Derived/read | Yes | Yes | No focused projection run | `SERVICE_BACKED_INTERNAL` |
| Review monitoring | Yes | Yes | Yes | Partial | Yes | Partial | No focused run | `API_BACKED_PARTIAL` |
| Static/disabled controls | Yes | No exact handler proof | No | No | May be intentionally guarded | Static/lifecycle tests | No | `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE` |

## Workflow I/O Matrix

| Workflow | Inputs | Processing path | Outputs/state changes | Failure/safety path | Report classification |
| --- | --- | --- | --- | --- | --- |
| Document upload | Multipart file, tenant slug, role key, metadata | API form validation -> upload service -> Prisma writes | Document/version/extraction/evidence/audit rows; upload safety result | Invalid file/scope/permission/audit blocks; no client release | `STRONG_VERTICAL_CANDIDATE` |
| Evidence review | Document ID, action, checklist/notes, tenant/role | API body validation -> review service -> scoped document/evidence lookup | Review/link/evidence item and updated evidence/document state | Not found, permission denied, insufficient, audit unavailable branches | `STRONG_VERTICAL_CANDIDATE` |
| Profile/family/entity/data-maintenance | JSON form payload, tenant/role/actor context, typed J04/J05/J09 action IDs | API validation and typed data-maintenance command route -> DBTF/document/action services -> audit-backed writes | Updated profile/family; created entity and participants; document upload/finalize/detail and relationship maintenance events | Wrong tenant/object denial, invalid action, hidden row safety, no advice execution and no client release | `STRONG_VERTICAL_CANDIDATE` |
| Admin tenant setup | JSON `payload.action` | API switch -> P44/admin/demo auth services | Tenant/user/policy/team/security state depending on action | Unsupported action, permission/auth/validation errors | `API_BACKED_PARTIAL` |
| Journey commands | Current user, journey ID, command body | API current-user resolution -> journey service command parser/executor | Journey instance/step/object link/command run/audit updates | Fail-closed response before unsafe state advance | `STRONG_VERTICAL_CANDIDATE` |
| Export workflow | Command body, tenant/role, scope/redaction/download/share inputs | UI approval/download -> API parser -> export command service -> export readmodel | Export request status/package metadata/audit events | Unsafe status, role, redaction, data quality or approval blocks | `STRONG_VERTICAL_CANDIDATE` |
| Demo workflow | Remaining demo-only `j01/j02/j03` action families or blocked moved action IDs | Demo API validation -> action-registry boundary -> remaining `runJ*` handler or fail-closed `410` canonical-route response | Action-specific DB updates only for demo-only families; moved families do not execute through demo workflow | Current action-registry tests prove demo-only vs moved-product split; generic completion claim forbidden | `DEMO_COMMAND_BACKED_PARTIAL` |
| Client projection | Journey/user context | Projection/read service and visibility engine | Client-safe derived payload | Hidden internal payload and unreleased state fail closed | `SERVICE_BACKED_INTERNAL` |

## Data Editability Matrix

| Data family | Create | Update | Read/list | Derived/projection | Local classification |
| --- | --- | --- | --- | --- | --- |
| Documents | Yes via upload/demo | Yes via review/demo | Yes via documents API | Evidence/review state | `API_BACKED_CREATE_UPDATE_READ` |
| Evidence | Yes across upload/review/demo/journey | Yes across review/workflow | Yes through evidence/document/journey surfaces | Sufficiency/projection | `SERVICE_BACKED_PARTIAL_TO_STRONG` |
| Profile | Not main flow | Yes via profile PATCH | Yes via profile GET | Scoped/hidden rows | `API_BACKED_CREATE_UPDATE_READ` |
| Family members | Some demo/seed creation | Yes via PATCH/demo | Yes via GET | Relationship map partial | `API_BACKED_CREATE_UPDATE_READ` |
| Entities | Yes via entity POST/demo | Yes/draft submit paths | Yes via GET/list service | Entity wizard state | `API_BACKED_CREATE_UPDATE_READ` |
| Journey spine | Yes via journey create | Yes via command execution | Yes via journey APIs | Evidence/client projection | `API_BACKED_WORKFLOW_SPINE` |
| Export requests | Yes via command service/demo | Yes via scoped commands and direct approval/download UI | Yes via readmodel | Package/download readiness | `STRONG_API_BACKED_COMMAND_SPINE` |
| Client data-maintenance | Yes by existing domain APIs plus typed J04/J05/J09 commands | Yes by `/api/data-maintenance/actions`, document/profile/family/entity APIs | Yes by command service and readmodels | Documents, entities, profile/family, relationships and audit rows | `STRONG_VERTICAL_CANDIDATE` |
| Tenant/admin/governance | Yes by admin API plus typed tenant-governance and platform-admin commands | Yes by admin API, `/api/tenant-governance/actions` and `/api/platform-admin/actions` | Yes by admin snapshot | Policy/security/readmodel | `API_BACKED_PARTIAL` |
| Recommendation/advisory state | Yes mainly workflow/demo | Yes mainly workflow/demo | Yes through workflow/readmodel | Client release/projection | `DEMO_COMMAND_AND_SERVICE_BACKED_WORKFLOW` |
| Audit events | Yes broadly | Not normal edit surface | Yes via audit APIs/services | Timeline/proof | `BROAD_SERVICE_BACKED_AUDIT_LAYER` |
| Static UI controls | No | No | Visible only | N/A | `UI_ONLY_STATIC` |
| Unlinked schema fields/models | Unknown | Unknown | Unknown | Unknown | `SCHEMA_ONLY_IN_THIS_AUDIT` |

## Security, Audit And Test Proof Sections

| Assurance area | Evidence | Current audit use |
| --- | --- | --- |
| Permission/RBAC | `lib/permission-engine.ts`, permission/non-bypass tests | Supports guard-layer presence; unrun tests are not pass claims. |
| Visibility/client projection | `lib/visibility-engine.ts`, client projection tests | Supports no-leakage architecture; focused proof still needed for complete claims. |
| Workflow release gate | `lib/workflow-gate.ts`, P0/workflow tests | Supports release/advice safety classification. |
| Audit fail-closed | `lib/audit-service.ts`, fail-closed/audit tests | Supports critical mutation safety expectation. |
| API error envelope | `lib/control-layer/error-envelope.ts` | Supports no silent mutation/release on error. |
| Export safety | `lib/control-layer/export-safety.ts`, export tests | Supports export partial/strong service classification. |
| Source target guard | `scripts/source-target-guard.ts`, `pnpm guard:source` | Runtime-proven in this run. |
| UI lifecycle/static affordances | lifecycle/CTA/static tests | Supports intentional static/disabled distinction. |

## Overclaim Risk Register

| Risk | Why it is dangerous | Required correction |
| --- | --- | --- |
| Calling the whole app complete | Many surfaces are static, blocked, demo-command backed or unrun | Use per-capability labels only. |
| Treating `/api/demo-workflow` as product API proof | It still carries demo-only compatibility actions for `j01`, `j02` and `j03`; moved families now fail closed to canonical APIs | Cut J02/J03 only after the Advice/Release-History boundary is separately split; do not stabilize them as a shadow product API. |
| Treating schema breadth as editability | Prisma models do not prove UI/API mutation | Require UI/API/service operation proof per data family. |
| Treating test existence as passing proof | Most tests were not run in this audit | Mark test intent separately from runtime proof. |
| Treating disabled safety UI as missing functionality | Some disabled states are correct product safety behavior | Classify as `BLOCKED_UI_SAFETY_STATE` when guard intent is explicit. |
| Treating export, tenant governance or platform admin as fully complete vertical slices | Current-run browser/API lifecycle proof passed for the targeted command surfaces, but this does not certify every adjacent admin/export route or all future setting semantics | Keep claims scoped to the tested command families and add deeper setting persistence only when a product data model is authorized. |
| Ignoring schema/test drift | Previously reported 49-model drift is now corrected: current schema has 53 models and schema-alignment proof passed | Keep source-reality/schema gates as required proof before future schema claims. |

## Bold Legacy-Cleanup Recommendations

1. Promote typed domain command APIs and demote `/api/demo-workflow` to demo-only. Keep it only for screencast seed choreography; move product-like actions into explicit document, journey, governance, review and release command routes; export already has the canonical API spine and should be the model for the rest.
2. Add a `capability-proof` gate that fails if docs or reports claim `COMPLETE_VERTICAL_SLICE` without current-run UI/API/service/DB/guard positive and negative proof.
3. Remove or visibly quarantine static controls that look like product actions. Either wire them to typed handlers, mark them as intentionally blocked with data-driven reasons, or delete them from product routes.
4. Continue the hard split for the remaining demo-only families: cut `j02/j03` advice/evidence actions into typed command clients only after the Advice/Release-History boundary is explicit, then remove those `runScreencastDemoAction` calls from product-like screens.
5. Keep schema/test alignment on the current 53-model baseline; reject future reports that resurrect stale 49-model claims.
6. Require per-action classification for every `runScreencastDemoAction` call. No generic “workflow persists” label until the action ID is mapped to state, guard, audit and test proof.
7. Treat reference pages as reference pages. Do not let roadmap, state maps or service-blueprint surfaces count toward product capability acceptance.

## Candidate Follow-Up Register

| Follow-up | Goal | Recommended stance |
| --- | --- | --- |
| Focused runtime proof pack | Run document upload/review, DBTF profile/family/entity, export workflow and journey command suites | Authorize next if report baseline is accepted. |
| Demo workflow split plan | Inventory remaining `j01/j02/j03` action IDs and route product-like advice/evidence-history mutations to typed APIs after the Advice/Release-History cut | High priority; removes ambiguity without hiding advice/release coupling. |
| Export/tenant/platform lifecycle runtime proof | Run direct browser/API lifecycle proof for `/api/export-workflow`, `/api/tenant-governance/actions` and `/api/platform-admin/actions` | High priority before complete delivery claims. |
| Static affordance purge | Delete/wire/quarantine static action controls | Bold cleanup; do not keep faux controls. |
| Schema alignment refresh | Keep 53-model inventory aligned with `source-reality-gate` and `schema-alignment.spec.ts` | Already current-run proven; keep as regression gate. |
| Capability status generator | Generate a machine-readable capability matrix from route/API/service/test maps | Useful to prevent future report drift. |

## Limitations

- This is a static/local report run with current proof for source guard, Prisma schema validation, schema alignment, export command spine and export UI/API truth.
- Browser screenshots are produced in the implementation slice because product-like UI command clients changed; screenshots remain visual smoke proof, not vertical-slice acceptance by themselves.
- DB availability and seeded data state were not exercised.
- Full product browser/DB-backed vertical suites were identified but not run.
- Capability labels are conservative by design and should be raised only after focused current-run proof.

## IMPL Ticket Completion

| Ticket | Result |
| --- | --- |
| `IMPL-1.4.1` | Capability Matrix and Vertical Slice Matrix produced. |
| `IMPL-1.4.2` | Workflow I/O, data editability and guard/test proof sections produced. |
| `IMPL-1.4.3` | Executive summary, limitations, overclaim risks and follow-up register produced. |
