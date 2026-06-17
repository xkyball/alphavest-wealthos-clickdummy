# AlphaVest Workflow, Pageflow, Code Reality And Gap Analysis V3

Generated: 2026-06-16T07:47:11+02:00  
Scope: analysis only. No product code, workflow mutations, UI forms or schema changes were implemented in this run.

## 1. Executive Verdict

AlphaVest WealthOS is no longer just a screenshot clickdummy: it has all 63 planned routes/assets, grouped screen components, a broad Prisma model, deterministic seed data, a demo session layer, visibility/permission/evidence/export service stubs, screencast fixtures and a real demo workflow bridge for J01. The strict verdict is still: most planned workflows are `navigable-only` or `demo-state executable`; only the J01 signal-to-advisor path reaches a narrow `E5 persisted executable` demo proof for selected actions.

The largest gap is not the data model. The largest gap is the missing governed input/mutation layer between UI controls and Prisma-backed domain transitions. Current routes, cards, modals, drawers and journey videos often show target behavior. Except for J01, most buttons either navigate to a route, alter visible modal/query state, or call the generic demo-workflow audit fallback. That is not enough to claim full workflow execution, compliance release, evidence creation, export generation or role/tenant enforcement.

## 2. Evidence Standard

| Level | Meaning | Used Here |
| --- | --- | --- |
| E0 planned only | Only docs/spec/reference exist. | Future workflows, form masks, role-hardening slices. |
| E1 visual reference | PNG/manifest shows intended screen. | All 63 references in `public/reference/page_ui_v3/clean_pages/`. |
| E2 static UI | Route renders representation without executable workflow. | Most current page components. |
| E3 navigable UI | Route/page/modal journey is reachable, but no meaningful persistence. | Most J02-J10 route flows. |
| E4 demo-state executable | Demo-local state/query/route changes are visible and repeatable. | Drawer/modal/query states and screencast action bridges. |
| E5 persisted executable | Writes/reads Prisma-backed data with verification path. | J01 selected actions only. |
| E6 governed executable | Persistence plus role/tenant/permission/evidence/audit/client-visibility enforcement. | Not reached yet; Phase 16+ is still planned. |

## 3. Facts, Assumptions, Interpretations

| Type | Statement | Proof |
| --- | --- | --- |
| Fact | The project rule says no unapproved advice reaches the client, advisor approval is not enough, compliance release controls visibility, important actions create evidence and sensitive actions create audit. | `AGENTS.md`, `CODEX_MASTER_TASK.md`, `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md:22-25` |
| Fact | Phase 14 is where workflow lifecycle integration connects data transitions and gates. | `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md:41`, `docs/v3/CODEX_TASKS_DETAILED_V3.md:602` |
| Fact | Phase 16, 17 and 18 are still the explicit homes for role-aware enforcement, validation/API hardening and file/export realism. | `docs/v3/CODEX_TASKS_DETAILED_V3.md:666`, `:698`, `:730` |
| Fact | 63 visual assets exist and the manifest reports 63 references. | `docs/v3/VISUAL_ASSET_MANIFEST_V3.md:3-69`, filesystem count 63 |
| Fact | The route registry stores pageflow, user workflow, role family, permission action and client-visibility flags. | `lib/route-registry.ts:63-78`, `:94`, `:1120-1164` |
| Fact | Current catch-all routing dispatches registered routes to grouped screen components and skeleton fallback. | `app/[...segments]/page.tsx:27-72` |
| Fact | J01 demo actions write Prisma domain changes and audit events; other demo action IDs fall to generic audit-only handling. | `app/api/demo-workflow/route.ts:259-424` |
| Interpretation | Current app is best described as a route-complete, data-model-rich, partially stateful demo prototype. | Branch debate below. |
| Assumption | The database is local demo data and not production data. | Repo mission and seed strategy; no real auth rule. |

## 4. V3 Mission Card

| Field | Answer |
| --- | --- |
| Mission | Reconcile planned definitions, flows, screens, tasks, data model and code reality into a truthful gap analysis. |
| Non-goal | Do not implement missing forms, APIs, state transitions, auth, schema changes or UI. |
| Safety invariant | No client-visible advice without advisor approval, compliance release, evidence and permission. |
| Main decision | Which workflows are executable today, which are visual/navigable, and which input masks are needed next. |
| Output | Five markdown analysis artifacts, one machine-readable JSON artifact, and report addenda. |

## 5. Evidence Intake

| Evidence Group | Files / Commands | Finding |
| --- | --- | --- |
| Governance and tasks | `AGENTS.md`, `CODEX_MASTER_TASK.md`, `docs/v3/CODEX_TASKS_DETAILED_V3.md`, phase prompts | Demo-first, no real auth, phase-scoped implementation, workflow lifecycle starts Phase 14. |
| Flow definitions | `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`, `USERFLOW_DEFINITIONS_V3.md`, `WORKFLOW_DEFINITIONS_V3.md` | Ten pageflows, 14 user flows and 14 workflow families are planned. |
| Screens and visual references | `SCREEN_CATALOGUE_V3.md`, `SCREEN_TO_TASK_MATRIX_V3.md`, `VISUAL_ASSET_MANIFEST_V3.md/json`, `public/reference/...` | 63 planned routes and 63 image assets exist; 061-063 are reference/internal pages. |
| Data model | `docs/v3/DATA_MODEL_V3.md`, `prisma/schema.prisma`, `prisma/seed.ts` | Most planned entities are represented in Prisma and seeded. |
| Code reality | `app/`, `components/`, `lib/`, `scripts/`, `package.json` | Route registry, grouped screens, demo data, service stubs and screencast automation exist. |
| Screencast proof | `docs/v3/journeys.screencast.v3.json`, `SCREENCAST_*`, runner scripts | 10 journeys / 73 steps; J01 has 4 continue steps and 4 required clicks, J02-J10 still use route hops. |

## 6. Problem Architecture

| Layer | Current Strength | Current Gap |
| --- | --- | --- |
| Definitions | Rich V3 source-of-truth for pages, workflows, data and QA gates. | Definitions are ahead of implementation. |
| Routes | Complete central registry and 63 smoke paths. | Route presence does not equal workflow execution. |
| UI | Homogeneous app shell and grouped screens show major states. | Many controls are static, route-hop based or generic-demo-action based. |
| Data | Prisma schema and seed cover most domain objects. | Most UI controls do not write the corresponding domain records. |
| Services | Permission, visibility, workflow gate, evidence, audit and export helpers exist. | Permission is permissive demo; evidence/audit/export services mostly preview, not persisted transactions. |
| Safety | Workflow gate expresses no-unapproved-advice requirements. | No broad transaction path enforces all gates before release. |

## 7. Double Diamond Summary

| Stage | Output |
| --- | --- |
| Discover | Read mandatory sources, optional journey/screencast docs, route registry, screen components, services, schema and seed. |
| Define | The real bottleneck is missing input masks plus mutation transactions, not missing route/assets/schema. |
| Develop | Compared three branches: visual clickdummy, partial demo prototype, governed workflow prototype. |
| Deliver | Produced workflow matrix, route/clickflow gap table, input-mask requirements, data-model reconciliation and backlog. |

## 8. Project Definition Inventory

| Definition ID | Source | Name | Actor/Role | Tenant Context | Planned Routes/Screens | Planned Data Entities | Planned Decisions/States | Evidence/Audit Expectation | Client Visibility Rule | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PF-A / UF-01 / W-01 / J10 | Pageflow + workflow + journey | Platform policy setup | Platform Admin, Compliance, Security | Platform-wide | `/admin/platform` -> policies -> roles -> security -> templates | `PolicyDefinition`, `Role`, `Permission`, `AuditEvent` | policy active/changed, security confirmed | audit every sensitive setting | no platform internals to client | `PAGEFLOW...:46`, `USERFLOW...:3-13`, `WORKFLOW...:5`, `USER_JOURNEY...:524-551` |
| PF-B / UF-02 / W-02 / J06 | Pageflow + workflow + journey | Tenant onboarding | Ops Admin, Client Success, Compliance | Client tenant onboarding | `/admin/tenants` -> `/tenants/new` -> setup/team/policies/users -> invite | `ClientTenant`, `User`, `UserRole`, `PolicyDefinition`, `AuditEvent` | draft/onboarding/active/blocked | tenant create, team assign, policy override, invite audited | no tenant data before scoped onboarding | `PAGEFLOW...:47`, `USER_JOURNEY...:400-427` |
| PF-B / UF-03 / W-03 | Userflow + workflow | User onboarding and consent | Invited user | Client tenant scoped after invite | `/onboarding/invite`, identity, MFA, consent, role confirmation | `User`, `UserProfile`, `ConsentRecord`, `UserRole` | pending invite, active, consented | consent and identity audit | no sensitive tenant data pre-onboarding | `PAGEFLOW...:63`, `WORKFLOW...:15` |
| PF-C / UF-04 / W-04 / J09 | Pageflow + workflow + journey | Client profile/family intake | Principal, Family CFO, Analyst | Client tenant | `/portal` -> profile -> family -> relationships | `UserProfile`, `FamilyMember`, `Relationship`, `ClientObjective` | draft, submitted, conflict, needs review | profile/family/relationship changes audited | safe next steps only, no advice | `PAGEFLOW...:48`, `USER_JOURNEY...:493-520` |
| PF-C / UF-05 / W-05 / J05 | Pageflow + workflow + journey | Entity, wealth map, action board | Principal, CFO, Analyst, Advisor | Client tenant | `/entities` -> `/entities/new` -> detail -> `/wealth-map` -> `/actions` | `Entity`, `EntityParticipant`, `Asset`, `ActionItem`, `DataQualityIssue` | draft, legal review, ready blocked | entity/action changes audited; evidence if linked | blocked if evidence incomplete | `PAGEFLOW...:65`, `USER_JOURNEY...:368-396` |
| PF-D / UF-06 / W-06 / J04 | Pageflow + workflow + journey | Document intake | Client/CFO/External Advisor, Analyst | Client tenant | `/documents/upload` -> extraction -> verification -> workbench review -> evidence | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceItem` | uploaded, extracted, confirmed, verified, needs clarification | upload/review audit; evidence link | document itself not advice | `PAGEFLOW...:49`, `USER_JOURNEY...:340-364` |
| PF-E / UF-07 / W-07 / J01 | Pageflow + workflow + journey | Signal and analyst review | System, Analyst | Client tenant/internal | `/signals` -> `/workbench/triggers/:id` -> evidence builder | `Trigger`, `ActionItem`, `Recommendation`, `EvidenceRecord`, `AuditEvent` | new, awaiting info, advisor review | audit route/request; evidence builder expected | internal only | `PAGEFLOW...:50`, `USER_JOURNEY...:597`, `app/api/demo-workflow/route.ts:259-339` |
| PF-E / UF-08 / W-08 / J01 | Pageflow + workflow + journey | Advisor approval | Senior Wealth Advisor | Client tenant/internal | `/advisor-approval` -> `/advisor-approval/:id` | `Approval`, `Recommendation`, `AuditEvent` | approved, escalated, blocked | approval/escalation audit | advisor approval never releases | `PAGEFLOW...:87`, `WORKFLOW...:40-41`, `app/api/demo-workflow/route.ts:340-407` |
| PF-F / UF-09 / W-09 / J02 | Pageflow + workflow + journey | Compliance release/block | Compliance Officer | Client tenant/internal then client candidate | `/compliance` -> review -> release/block/audit | `ComplianceReview`, `Recommendation`, `EvidenceRecord`, `AuditEvent` | released, blocked, needs evidence | release/block/request evidence audited | compliance release controls visibility | `PAGEFLOW...:88`, `USER_JOURNEY...:462-489` |
| PF-F / UF-10 / W-10 / J03 | Pageflow + workflow + journey | Client decision | Principal, Family Council, Trustee | Client tenant/client visible only after release | `/decisions` -> detail -> success -> evidence | `Decision`, `DecisionParticipant`, `EvidenceRecord`, `AuditEvent` | accepted/deferred/rejected/submitted | decision and evidence package created | only released content visible | `PAGEFLOW...:89`, `DATA_MODEL...:950-952` |
| PF-I / UF-11 / W-11 / J08 | Pageflow + workflow + journey | Evidence and export | Client, Advisor, Compliance, Privacy | Tenant/object scoped | `/evidence`, `/evidence/:id`, `/export/*` | `EvidenceRecord`, `EvidenceItem`, `ExportRequest`, `AuditEvent` | selected, redacted, approval required, generated, downloaded | export events audited; evidence access logged | redacted/permission scoped | `PAGEFLOW...:90`, `DATA_MODEL...:868`, `USER_JOURNEY...:462-489` |
| PF-G / UF-12 / W-12 / J07 | Pageflow + workflow + journey | Governance access change | Principal, Admin, Compliance, Security | Tenant and object scoped | users -> roles -> access requests -> audit history | `User`, `Role`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent` | requested, approved, denied, escalated | access and role changes audited | scope controls client/internal access | `PAGEFLOW...:91`, `USER_JOURNEY...:431-458` |
| PF-H / UF-13 / W-13 | Pageflow + workflow | Communication escalation | Advisor, Client Success, Client | Tenant/client scoped | `/communication`, `/communication/call-trigger` | `MessageThread`, `Message`, `CallEvent`, `EvidenceRecord` | digital, call, F2F, external specialist | message/call audit and evidence when material | no unreleased advice in comms | `PAGEFLOW...:53`, `WORKFLOW...:65` |
| PF-J / UF-14 / W-14 | Pageflow + workflow | Ops and reference | Ops, Product, QA | Internal/platform | `/ops/queues`, `/ops/sla`, service blueprint, roadmap, states | `QueueItem`, `DataQualityIssue`, `AuditEvent` | active/breached/resolved/reference | ops review audit if mutating | internal/reference only | `PAGEFLOW...:55`, `WORKFLOW...:70` |

## 9. Current Code Reality Inventory

| Code Surface | File(s) | What Exists | Data Source | Interaction Type | Persistence | Role/Tenant Handling | Evidence/Audit Handling | Known Static/No-op Areas | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Catch-all routing | `app/[...segments]/page.tsx` | Dispatches all registered routes to grouped screen components. | `route-registry` | route render | none by itself | demo context passed to screen groups | none by itself | fallback skeleton if unmatched | `app/[...segments]/page.tsx:27-72` |
| Route registry | `lib/route-registry.ts` | 63 routes with pageflow, userflow, role, permission and visual metadata. | static TS | smoke path mapping | none | metadata only | metadata only | no access guard | `lib/route-registry.ts:63-78`, `:1120-1164` |
| Demo session | `components/demo-session-provider.tsx`, `lib/demo-session.ts` | Role and tenant switcher for demo context. | local/browser/demo data | local context | no server auth | demo role/tenant only | none | no real auth | AGENTS early implementation rule |
| J01 demo workflow API | `app/api/demo-workflow/route.ts` | Writes selected J01 trigger/action/recommendation/approval changes and audit. | Prisma | POST action | E5 for selected J01 | demo scoped; not role enforced | persisted audit for J01 | all non-J01 fall back to generic audit | `app/api/demo-workflow/route.ts:259-424` |
| Generic screencast client | `lib/screencast-demo-client.ts` | Calls demo API and optionally routes. | browser fetch | button bridge | depends on API | no auth | generic audit fallback if accepted | hides difference unless analysis checks action | UI `runScreencastDemoAction` calls |
| Permission engine | `lib/permission-engine.ts` | Computes second confirmation/compliance flags. | static rules | service helper | none | `allowed: true` demo mode | returns audit/compliance flags | no denial yet | `lib/permission-engine.ts:77-84` |
| Visibility engine | `lib/visibility-engine.ts`, `lib/workflow-gate.ts` | Blocks internal visibility for non-internal roles and validates release candidates. | service inputs | helper | none | role object based | missing reasons only | not transactionally wired broadly | `lib/workflow-gate.ts:28-60`, `lib/visibility-engine.ts:48-61` |
| Evidence service | `lib/evidence-service.ts` | Creates placeholder evidence draft object. | service inputs | helper | no DB write | caller-provided | placeholder summary | not a real evidence record | `lib/evidence-service.ts:27-32` |
| Audit service | `lib/audit-service.ts` | Creates audit event preview draft. | service inputs | helper | no DB write | permission metadata only | preview only | not append-only persistence | `lib/audit-service.ts:19-51` |
| Export service | `lib/export-service.ts` | Gate decision for export generation/approval. | service inputs | helper | no file/request write | permission input | status only | no generated package | `lib/export-service.ts:14-68` |
| Prisma schema | `prisma/schema.prisma` | Broad model for tenant, users, roles, docs, recommendations, compliance, evidence, audit, exports and ops. | Prisma | database schema | available | tenant IDs and role tables modeled | audit/evidence tables modeled | enforcement not automatic | `prisma/schema.prisma:278-1155` |
| Seed data | `prisma/seed.ts` | Four tenants, roles/permissions, demo lifecycle states, evidence/export/access/audit. | deterministic UUIDs | seed script | E5 seeded data | tenant-scoped data | audit/evidence records seeded | seed is not UI mutation proof | `prisma/seed.ts:323-393`, `:1607-1800`, `:1817-1884` |
| Screencast runner | `scripts/screencast/*`, `docs/v3/journeys.screencast.v3.json` | 10 journeys, 73 steps, provisioning, typed interactions. | JSON + Playwright | browser automation | provisioning seed | fixture roles/tenants | expected audit/evidence metadata | J02-J10 route-hop heavy | runner `navigation`/`interaction`, JSON counts |

## 10. Workflow Capability Matrix

| Workflow/Journey | Planned Goal | Required Actor | Required Screens | Required Click Flow | Required Data Mutations | Current Route/UI | Current Interaction Evidence | Current Data Evidence | Current Status | Missing To Reach Next Level | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W-01 / J10 Platform setup | Configure platform, advice, roles, security, evidence/export defaults. | Admin, Compliance, Security | 007-012 | save, review audit, confirm sensitive changes | policy/security/role/template updates + audit | all routes visible | route and buttons; mostly static/generic | `PolicyDefinition`, roles seeded | navigable-only | persisted policy/role/security forms, second confirmation, audit transaction | High |
| W-02 / J06 Tenant setup | Create tenant, assign team, apply policies, invite principal. | Admin, Client Success, Compliance | 013-018 + invite | create, continue, assign, invite | `ClientTenant`, `User`, `UserRole`, `PolicyDefinition`, audit | all routes visible | route-hop journey, generic demo action where wired | tenants/users/roles seeded | navigable-only | tenant wizard mutations, invite record, policy override transaction | High |
| W-03 User onboarding | Accept invite, identity, MFA, consent, role confirmation. | Invited user | 001-006 | login/MFA/invite/identity/consent | `User`, `UserProfile`, `ConsentRecord`, session | auth/onboarding routes visible | static demo controls | users/consents seeded | static-only | no-auth demo onboarding state, consent write, session state | High |
| W-04 / J09 Profile/family | Submit profile, family, relationships. | Principal/CFO | 019-023 | submit profile, add/edit member, map relationship | `UserProfile`, `FamilyMember`, `Relationship`, data quality, audit | routes and some J09 action buttons | mostly route/generic action bridge | seeded profile/family/relationships | navigable-only | persisted profile/family/relationship forms and review state | High |
| W-05 / J05 Entity/wealth/action | Create entity, inspect map, manage action board. | Principal/CFO/Advisor | 024-026,031-032 | create entity, continue, edit, mark ready/request info | `Entity`, `Asset`, `ActionItem`, evidence gate, audit | routes visible, query drawer states | route/generic action bridge | seeded entities/assets/action items | navigable-only | entity wizard write, action gate mutation, evidence completeness check | High |
| W-06 / J04 Document intake | Upload, extract, confirm, verify, link evidence. | Client/CFO/Analyst | 027-030 + workbench/evidence | upload, review extraction, finalize, clarify | document/version/extraction/review/link/evidence/audit | routes visible and buttons route | route/generic action bridge; no file proof | seeded documents/extractions/reviews | navigable-only | upload handling, document version write, extraction review form, evidence link | High |
| W-07 / J01 Signal review | Request data or route trigger to advisor. | Analyst | 033-035 | request data, continue, route advisor | trigger/action/recommendation state + audit | routes visible | J01 required real clicks passed in prior QA | API writes Prisma rows | complete-demo-persisted | role checks, evidence builder transaction, broader J01 assertions after reload | High |
| W-08 / J01 Advisor approval | Approve or escalate without client visibility. | Senior Advisor | 036-037 | approve, escalate | approval/recommendation state + audit | routes visible | J01 required real clicks passed in prior QA | API writes Prisma rows, keeps `clientVisible=false` | complete-demo-persisted | compliance handoff/release path and governed permission enforcement | High |
| W-09 / J02 Compliance release/block | Release, block or request evidence. | Compliance Officer | 038-042 | review, release/block, request evidence, audit | compliance review, recommendation release/block, evidence and audit | routes/modal states visible | current JSON uses route hops; buttons may call generic audit | seeded compliance states | navigable-only | specific release/block transaction enforcing workflow gate | High |
| W-10 / J03 Client decision | Client accepts/defers/rejects and evidence package is created. | Principal/Council | 043-047 | open decision, decide, success, evidence | decision/participant/evidence/audit | routes/modal states visible | route/generic action bridge | seeded decision/evidence | navigable-only | decision submit form, evidence package creation, released-content guard | High |
| W-11 / J08 Evidence/export | Review evidence and create redacted export/download/share. | Client/Advisor/Compliance/Privacy | 046-047,054-058 | scope, redaction, preview, approve, download/share | export request, redaction, file/package, audit | routes visible | route/generic action bridge | seeded export requests/evidence | navigable-only | export wizard writes, redaction validation, file generation, expiry/share audit | High |
| W-12 / J07 Governance/access | Invite user, edit roles, approve access, view audit. | Principal/Admin/Security | 048-051 | invite, save roles, approve/deny, export audit | user/userRole/accessRequest/secondConfirmation/audit | routes/drawers visible | route/generic action bridge | seeded access/second confirmation/audit | navigable-only | access and role mutation forms, SOD/second-confirmation enforcement | High |
| W-13 Communication | Select digital/call/F2F/external path and record outcome. | Advisor/Client Success/Client | 052-053 | choose route, message/call, evidence link | `MessageThread`, `Message`, `CallEvent`, audit/evidence | routes visible | no dedicated top-10 journey | seeded threads/messages/calls | static-only | message/call forms, escalation state, compliance-safe content filter | Medium |
| W-14 Ops/reference | Monitor queues, SLA and product state. | Ops/Product/QA | 059-063 | inspect queues/SLA/reference | `QueueItem`, `DataQualityIssue`, audit if mutating | routes visible; 061-063 reference | static dashboards/reference | seeded queues/issues | static-only | queue assignment/status forms, SLA mutation and audit | Medium |

## 11. Pageflow And Clickflow Gaps

| Pageflow | Planned Entry Point | Planned Exit(s) | Current Route | Reachable By Click? | Primary CTA Behavior | Secondary CTA Behavior | State Coverage | Role/Tenant Coverage | Gap | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PF-A | `/admin/platform` | policies, roles, security, templates | registered | via nav/direct | mostly static/modal state | static/generic | normal/confirm/permission visual states | demo role switcher only | no persisted policy/security/role mutation | `SCREEN_TO_TASK...:11-16`, `USER_JOURNEY...:524-551` |
| PF-B | `/admin/tenants` | tenant wizard, team, policy, users, invite | registered | via nav/direct | route/generic actions | static/modals | onboarding/blocked/readiness visible | demo tenant switcher only | no tenant/user invite transaction | `SCREEN_TO_TASK...:17-22` |
| PF-C | `/portal` | profile, family, relationships, entities, wealth/actions | registered | via nav/direct and some CTAs | route/generic actions | many static | drawers/conflicts/blocked states visible | demo role/tenant only | no persisted profile/entity/action mutation | `SCREEN_TO_TASK...:23-38` |
| PF-D | `/documents/upload` | extraction, verification, workbench, evidence | registered | via nav/direct and upload CTA | route/generic actions | static | upload/extraction/clarification visible | demo role/tenant only | no file/version/extraction write path | `SCREEN_TO_TASK...:31-34` |
| PF-E | `/signals` | workbench, advisor approval, compliance later | registered | J01 true-click subset | J01 persisted for request/route/approve/escalate | mixed | internal/advisor states visible | demo only | not yet governed; only J01 subset persistent | `app/api/demo-workflow/route.ts:259-407` |
| PF-F | `/compliance` | release/block/decision/success/evidence | registered | route-hop/direct | generic action bridge/static | modal states visible | blocked/release/success visible | demo only | release/decision/evidence transactions missing | `SCREEN_TO_TASK...:42-51` |
| PF-G | `/governance/users` | roles, access requests, audit history | registered | route-hop/direct | generic action bridge/static | drawer/modal visible | approval/confirm/audit visible | demo only | access/role/second confirmation transaction missing | `SCREEN_TO_TASK...:52-57` |
| PF-H | `/communication` | call trigger, evidence | registered | nav/direct | mostly static | static | preview/call matrix visible | demo only | no message/call persistence | `SCREEN_TO_TASK...:58-59` |
| PF-I | `/export/new` | scope, redaction, preview, download/share | registered | route-hop/direct | generic action bridge/static | modal/download state visible | redaction/approval/download visible | demo only | no export request/file/download/share transaction | `SCREEN_TO_TASK...:60-64` |
| PF-J | `/ops/queues` | SLA/reference | registered | nav/direct | static dashboard | static | ops/reference visible | internal metadata only | no queue/SLA mutation | `SCREEN_TO_TASK...:65-69` |

Route-level inventory is summarized in `PROJECT_DEFINITION_SCAN_EVIDENCE_V3.md`; all 63 screens have a visual asset and route/smoke path evidence, but most primary CTAs remain static, route-hop or generic-demo-action behavior.

## 12. Role, Permission, Evidence, Audit And Compliance Gaps

| Workflow | Role Needed | Permission Rule | Current Enforcement | Advice Boundary | Compliance Release Gate | Evidence Event | Audit Event | Gap | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W-01 | Admin/Compliance/Security | platform/manage/roles/security | demo allowed | policy visible | n/a | template evidence only | should audit config | no persisted sensitive setting transaction | `permission-engine.ts:77-84` |
| W-02 | Admin/Client Success/Compliance | tenants/users/policies | demo allowed | no advice | tenant activation gate visual | readiness/evidence expected | generic/pending | tenant create/invite not persisted | `USER_JOURNEY...:421-427` |
| W-03 | Invited user | invitation scoped | no real auth by design | no advice | n/a | consent record expected | onboarding audit expected | no onboarding write path | AGENTS early implementation rule |
| W-04 | Principal/CFO | profile/family scoped | demo allowed | safe next steps only | n/a | evidence for missing docs | expected only | profile/family mutations missing | `USER_JOURNEY...:514-520` |
| W-05 | Principal/CFO/Advisor | entity/action scoped | demo allowed | action ready blocked if evidence missing | no release from advisor | evidence completeness needed | expected only | gate not persisted for actions | `USER_JOURNEY...:389-396` |
| W-06 | Client/CFO/Analyst | document upload/review | demo allowed | document is source evidence | review before evidence | evidence item/link expected | expected only | no upload/extraction/review transaction | `DATA_MODEL...:387`, `:445` |
| W-07/W-08 | Analyst/Advisor | trigger/recommendation approve | demo allowed | clientVisible false in J01 | not release | evidence builder expected | persisted in J01 | no role enforcement; limited J01 path only | `app/api/demo-workflow/route.ts:259-407` |
| W-09 | Compliance | release/block | demo allowed/generic | release controls visibility | helper exists but not transactionally wired | evidence complete required | generic/pending | specific compliance release transaction missing | `workflow-gate.ts:28-60` |
| W-10 | Principal/Council | released decision only | demo allowed | only released decision visible | prerequisite | evidence package required | expected only | decision submit/evidence package missing | `DATA_MODEL...:950-952` |
| W-11 | Client/Advisor/Privacy | export create/approve | demo allowed | redaction required | approval when external/sensitive | evidence package source | expected/generic | no generated export/file/share audit | `export-service.ts:14-68` |
| W-12 | Principal/Admin/Security | role/access scoped | demo allowed | access controls visibility | n/a | lineage expected | expected/generic | role/access/second confirmation missing | `DATA_MODEL...:255`, `:309` |
| W-13 | Advisor/Client Success | communication scoped | demo allowed | no unreleased advice | if advice-like | call/message evidence optional | expected only | no message/call write path | `DATA_MODEL...:811-852` |
| W-14 | Ops/Product/QA | internal ops | demo allowed | n/a | n/a | optional | expected if mutating | queues/SLA read-only | `DATA_MODEL...:910-929` |

## 13. Input-Mask Requirement Summary

The next implementation layer needs governed masks, not more decorative pages. Required input-mask groups are detailed in `INPUT_MASK_REQUIREMENTS_V3.md`. Top priority masks are: compliance release/block, client decision, document upload/review, tenant create/team/policy/user invite, export wizard, governance access/role change, entity create/action ready, profile/family intake, platform policy/security changes and J01 evidence-builder/advisor note enrichment.

## 14. Data Model Reconciliation Summary

The Prisma schema covers the planned model surprisingly well: core tenant, user, RBAC, consent, profile, relationship, entity, document, trigger, action, recommendation, approval, compliance, decision, evidence, audit, communication, export, policy, queue and data-quality objects exist. The gap is implementation binding: most UI data is still demo TS/static display data or seeded records; current services return previews/gates instead of repository-backed transactions; J01 is the only narrow persisted UI-action proof.

See `DATA_MODEL_IMPLEMENTATION_RECONCILIATION_V3.md` for table detail.

## 15. Task Definition Reconciliation

| Task/Phase | Source | Intended Outcome | Evidence Of Completion | Partial Evidence | Missing Work | Risk If Claimed Done | Recommended Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 00-03 | task docs/reports | repo, Next, DB, data model/seed | reports and schema/seed present | no prod auth by design | n/a for current scope | low | keep as foundation |
| 04 | service stubs/session | demo session, permissive stubs | role/tenant switcher and services exist | preview/gate helpers | no enforcement | overclaiming security | preserve until Phase 16 |
| 05-13 | route/screen phases | all 63 route UI groups | registry/assets/components/reports | visual/state coverage | many static controls | overclaiming workflows | use Phase 14 backlog |
| 14 | workflow lifecycle | data transitions and gates | J01 subset done | generic audit fallback | J02-J10, core transactions | demo videos imply persistence | implement P0 lifecycle slices |
| 15 | tests baseline | smoke/visual/screencast | visual contract and screencast tools exist | not full e2e assertions | Playwright persistence tests | false green from route smoke | add stateful tests per slice |
| 16 | role-aware permissions | role/tenant enforcement | permission metadata exists | demo allowed | real denials and tenant guards | compliance/security risk | implement after core transactions |
| 17 | API/data validation | validation/repositories | schema exists | no broad validators | server actions/API validation | bad data and audit gaps | add typed validation layer |
| 18 | file/export realism | file storage/export package | export service gate exists | seeded export requests | no file/package/share | false export proof | implement export realism |
| 19 | hardening | final handoff | not current | reports exist | final QA | premature sign-off | defer |

## 16. Prioritized Gap Backlog

The detailed backlog is in `IMPLEMENTATION_GAP_BACKLOG_V3.md`. P0 gaps are compliance release/block transaction, client decision/evidence package, document intake transaction, tenant onboarding writes, validation/repository wrapper, governance access/second confirmation, export generation, role/tenant enforcement, entity/action gate and profile/family persistence.

## 17. Branch Debate And Weak-Branch Kill List

| Branch | Evidence For | Evidence Against | Verdict | Why |
| --- | --- | --- | --- | --- |
| A: current app is mainly a visual clickdummy | Most controls are static/route-hop; services preview; J02-J10 not persisted. | Prisma schema/seed, route registry, screencast fixtures and J01 persisted actions exceed pure clickdummy. | Killed as too weak | It underestimates real data-model and J01 progress. |
| B: current app is a demo-state workflow prototype with partial executable logic | 63 routes/assets, rich seed, service gates, screencast provisioning, J01 persisted actions. | Most workflows still lack domain mutations and enforcement. | Kept | Best fit: route-complete, data-model-rich, partial statefulness. |
| C: current app is close to a governed workflow prototype with missing input masks | Workflow gate expresses release rules and schema supports audit/evidence. | Permission engine is permissive; evidence/audit/export services are not broadly persisted; release is not transactionally enforced. | Killed for now | E6 requires enforcement and audit/evidence transactions, not just helpers. |

## 18. Proof Paths

| Claim | Proof Path |
| --- | --- |
| 63 reference assets exist | `find public/reference/page_ui_v3/clean_pages -maxdepth 1 -type f -name 'PAGE-*.png' | wc -l` returned 63. |
| 63 routes are registered | `lib/route-registry.ts:94-1120` and `routeRegistryCount = screenRoutes.length`. |
| J01 is persisted-demo executable | Inspect `app/api/demo-workflow/route.ts:259-407`, then run J01 provisioning/live journey and query trigger/recommendation/approval/audit rows. |
| J02-J10 are not yet persisted workflows | `docs/v3/journeys.screencast.v3.json` has 69 `goto` steps and only 4 `continue` steps, all in J01; generic fallback in `app/api/demo-workflow/route.ts:407-424`. |
| No-unapproved-advice invariant exists | `lib/workflow-gate.ts:28-60`, seed invariant `prisma/seed.ts:1817-1884`. |
| E6 not reached | `lib/permission-engine.ts:77-84` allows all in demo mode; evidence/audit/export services are preview/gate helpers. |

## 19. Learning Log

| Learning | Impact |
| --- | --- |
| The model is ahead of UI forms. | Prioritize form/mutation slices over schema expansion. |
| Route coverage is not workflow coverage. | Future reports must separate route smoke, click-through, persistence and governance. |
| J01 is the strongest template. | Reuse its demo API + required-click + DB verification pattern for J02-J10. |
| Generic audit fallback is useful but risky. | It keeps demos moving but must not be counted as domain workflow execution. |
| Compliance release is the critical safety path. | Implement J02 before low-risk screens. |

## 20. Honest Limitations

- This pass inspected source and static manifests; it did not rerun live browser screencasts.
- It did not query the database directly after J01 actions in this turn; it relies on source evidence and prior QA report evidence.
- It did not manually click all 63 screens in a browser; route/asset coverage uses existing registry, screen matrix and visual contract evidence.
- Some UI controls may have local state that is not obvious from keyword search; classification remains conservative unless code showed explicit persistence.
- Existing untracked workspace status means all files appear untracked; this analysis did not attempt to stage or commit.

## 21. Method Compliance Checklist

| Method | Artifact Produced |
| --- | --- |
| ENGINE_v3 Mission Card | Section 4 |
| Evidence Intake | Section 5 |
| Problem Architecture | Section 6 |
| Branch preservation/debate | Section 17 |
| Adversarial QA | Section 17 and limitations |
| Proof Paths | Section 18 |
| Learning Log | Section 19 |
| Double Diamond | Section 7 |
| Psycho-Logic + Map/Model | Problem map: definitions -> routes -> UI -> data -> gates -> proof. |
| Reframing | From "screens exist" to "truthful executable workflows exist only when mutations/gates prove it." |
| TRIZ | Contradiction: rich demo must feel clickable but avoid false compliance claims; resolution is evidence-level labeling and transaction-backed slices. |
| SIT Closed World | Use existing schema, route registry, demo API, services and screencast runner before adding new concepts. |
| Morphological / CCA | Workflow x actor x route x entity x gate x evidence matrix used in Sections 8-12. |
| SCAMPER | Substitute route-hop claims with persisted demo actions; combine input masks with audit/evidence wrappers; eliminate static CTA overclaims. |
| Harvard / BATNA | Best fair outcome is truthful gap backlog; BATNA is keep route-only demo with explicit caveats. |
| MESOs | M1 implement compliance first, M2 implement document/decision first, M3 implement tenant/governance first; backlog recommends safety-first order. |
| Measurement Plan | Typecheck/lint/db validate/visual contract/build plus future DB-verifying Playwright per workflow. |
| Ethics & Fairness | No unapproved advice, no false persistence claims, no real client data, no hidden security weakening. |
