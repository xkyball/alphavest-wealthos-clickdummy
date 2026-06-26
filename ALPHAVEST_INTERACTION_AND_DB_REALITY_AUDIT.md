# ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md

## 1. Executive Decision

Decision: `APP_REALITY_PARTIALLY_WORKABLE_PATCH_REQUIRED`

| Question | Decision |
| --- | --- |
| Is the interaction design really implemented? | Partially. Shared drawer/modal primitives are real lifecycle components, and several screens use route/user-triggered state. Many screen actions are still actionId/demo-only, close-only, read-only, or visually present without full loading/submitting/success/error lifecycle. |
| Are drawers/modals/detail panels reactive or mostly static? | Mixed. `components/ui/drawer.tsx` and `components/ui/modal.tsx` are real reactive primitives. Some page drawers/modals are reactive, but several drawer-like/detail surfaces are permanent page regions or static overclaims. |
| Is the app actually database-backed? | Partially. Prisma exists and some APIs use it. Multipart document upload is the strongest DB-backed vertical. `deleted generic workflow route` mutates seeded DB records by fixed actionId. `/api/review-monitoring` reads DB snapshots. Many UI areas still render static demo data or use demo-only mutations. |
| Can the app be used as a working app today? | Partially, as an advanced demo with a real document-upload vertical and seeded workflow simulation. It is not yet a generally workable database-backed operating app across intake, review, approval, compliance, visibility, export, and governance. |
| Biggest blocker | Most workflows do not have typed UI payload -> API -> service -> Prisma -> reload proof. They still rely on static demo data, deterministic actionId mutations, metadata-only artifacts, or local component state. |
| Minimum patch path | Preserve existing scope, then patch one workflow at a time from UI input masks through API/service/Prisma persistence, reload proof, role proof, audit/evidence proof, and lifecycle tests. Start by fixing tenant-scoped document reload, then promote review/approval/release/export paths from actionId demo behaviour to payloaded persistent workflows. |

### Engine Method Trace

| Mandatory Phase | Audit Application |
| --- | --- |
| 1. Charter | Audit only. No implementation, no tests written, no migrations, no schema/API changes. |
| 2. Evidence | Read handoff package, mandatory repo docs, package scripts, Prisma schema, APIs, services, components, and tests. |
| 3. Framing | Split reality into interaction lifecycle, DB persistence, API contracts, and end-to-end workability. |
| 4. Divergence | Considered three branches: real app, advanced DB-backed demo, clickdummy/static prototype. |
| 5. Contradictions | Prisma/schema/tests exist, but broad DB-backed claims are contradicted by static demo modules, actionId-only APIs, metadata-only export, and local demo session. |
| 6. Branch Build | Built separate classifications for surfaces, APIs, DB areas, tests, and workflows rather than one broad verdict. |
| 7. Debate | Best case: real upload and seeded workflow persistence exist. Worst case: most workflows remain non-payloaded demo actions. Verdict lands in the middle. |
| 8. Adversarial Review | Rejected claims such as drawer visible = lifecycle, status chip = state machine, API exists = contract, Prisma exists = DB-backed app, test exists = proof. |
| 9. Convergence | The correct no-overclaim result is partial workability with targeted patch required. |
| 10. Proof | Proof is file evidence plus static inspection only. No validation/test command was executed in this audit. |
| 11. Learning Log | Current implementation has moved beyond pure clickdummy in document upload and some workflow mutation paths, but not enough to claim a real end-to-end operating app. |

## 2. Sources and Commands Checked

| Source / Command | Checked? | Result | Limit |
| --- | --- | --- | --- |
| `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/README_START_HERE.md` | Yes | Handoff package present. UI interaction reality patch is mandatory before later phases. | Handoff intent, not runtime proof. |
| `_codex_handoff/.../00_START_HERE/CODEX_OPERATING_RULES.md` | Yes | Explicitly forbids claiming visible UI/API/schema/test presence as working behaviour. | Rules only. |
| `_codex_handoff/.../00_START_HERE/V2_1_PATCH_CHANGELOG.md` | Yes | No new product scope, routes, APIs, schema, or P0 overclaim. | Rules only. |
| `_codex_handoff/.../01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Yes | Establishes baseline APIs and phased task authority. | Handoff may be stale where code has advanced. |
| `_codex_handoff/.../01_OPERATIVE_AUTHORITY/FINAL_CODEX_TASK_MASTER.md` | Yes | Requires UI state, interaction, feedback, RBAC, evidence/audit/export, API, schema, and P0 tests. | Task target, not current proof. |
| `_codex_handoff/.../02_EXECUTION_COMPLETION_ARTEFACTS/*.md` | Yes | Done definition requires file evidence, tests/validation, and no visible-UI overclaim. | Checklist only. |
| `_codex_handoff/.../06_UI_INTERACTION_REALITY_PATCH/*.md` | Yes | Prior classification found partial interaction coverage and static/reactive ambiguity. | Prior audit context; current repo inspected separately. |
| `_codex_handoff/.../06A_NO_DECISION_EXECUTION_PATCH/AMBIGUITY_CLASSIFICATION_RULES.md` | Yes | Product/schema/API/safety/P0 ambiguities must stop or be classified. | Rules only. |
| `AGENTS.md` | Yes | Requires source-of-truth docs, clean UI, shared components, Prisma, demo session first, and phase reporting. | Repo guidance only. |
| `CODEX_MASTER_TASK.md` | Yes | Says static UI, read-only fields, metadata-only file/export behaviour, fixture mutations, and actionId demos must not be reported as operational capability. | Contract, not implementation. |
| `docs/v3/CODEX_TASKS_DETAILED_V3.md` | Yes | Task catalogue requires real workflows and evidence-aware behaviour. | Spec only. |
| `docs/v3/SCREEN_CATALOGUE_V3.md` | Yes | Defines screen catalogue and states. | Spec only. |
| `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md` | Yes | Defines visual rules. | Visual contract, not behaviour proof. |
| `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md` | Yes | Orders implementation toward DB/API/workflow reality. | Sequence only. |
| `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md` | Yes | Maps intended workflow flow. | Intent only. |
| `docs/v3/DATA_MODEL_V3.md` | Yes | Defines intended data model. | Intent only. |
| `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md` | Yes | Defines quality gates. | Test plan only. |
| `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md` | Yes | Defines E0-E7 capability levels; E7 requires payload, persistence, reload, permission, audit/evidence, tests. | Contract only. |
| `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md` | Yes | Prior audit said no E7 and metadata-only uploads. | Partially stale because current upload API now persists file bytes and DB rows. |
| `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md` | Yes | Prior matrix classifies many workflows as partial/static. | Prior state; current code inspected. |
| `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md` | Yes | Requires real controls, payloads, Prisma persistence, and reload from DB for P0 masks. | Requirements only. |
| `package.json` | Yes | Scripts and dependencies inspected. | No script executed. |
| `prisma/schema.prisma` | Yes | 22 enums and 42 models observed, including document, evidence, audit, review, export, queue models. | Schema presence is not wiring proof. |
| `app/[...segments]/page.tsx` | Yes | Catch-all route maps registry entries to screen components and skeletons inaccessible scopes. | Route shell is not workflow proof. |
| `lib/route-registry.ts` | Yes | MVP/MVP_SUPPORT accessible; P1/reference/hold route scopes are skeleton-gated. | Registry only. |
| `deleted generic workflow route` | Yes | DB-backed actionId dispatcher with fixed seeded workflow mutations. | Not a general payloaded workflow API. |
| `app/api/documents/route.ts` | Yes | DB-backed document listing by tenant slug. | UI hardcodes `tenantSlug=morgan` for persisted list fetch. |
| `app/api/documents/upload/route.ts` | Yes | Real multipart upload API to service/Prisma/storage/audit/evidence. | Demo/local storage scope; not broad workflow proof. |
| `app/api/review-monitoring/route.ts` | Yes | DB-backed read API for monitoring snapshot. | UI screen still imports static demo rows. |
| `lib/**` services | Yes | Persistence, permission, workflow, visibility, evidence, audit, export, storage services inspected. | Several services are preview/demo/pure logic only. |
| `components/**` | Yes | Drawers, modals, upload UI, panels, buttons, state panels inspected. | Static inspection only. |
| `tests/**` | Yes | Test intent inspected. Some specs seed DB and prove upload/workflow if run. | No tests executed in this audit. |
| `git status --short --branch` | Yes | Worktree was already dirty before this report; unrelated docs/tests modified and one report untracked. | Existing changes were not touched. |
| `rg`, `find`, `sed`, `nl`, `wc` | Yes | Read-only inspection commands used. | Static evidence only. |
| `pnpm typecheck` | No | `NOT_RUN` | Audit-only turn; no command proof claimed. |
| `pnpm lint` | No | `NOT_RUN` | Audit-only turn; no command proof claimed. |
| `pnpm db:validate` | No | `NOT_RUN` | Audit-only turn; no command proof claimed. |
| `pnpm build` | No | `NOT_RUN` | Build writes artifacts; no command proof claimed. |
| `pnpm test:*` / targeted tests | No | `NOT_RUN_MUTATION_RISK` where specs run `pnpm db:seed`; otherwise simply not run. | No executed test proof in this audit. |

## 3. Interaction Reality Audit

| Surface / Component | File(s) | Current Pattern | Classification | Evidence | Gap | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| Shared drawer primitive | `components/ui/drawer.tsx` | Open-gated component with escape handling, focus trap, focus restore, backdrop close, close button. | `REAL_REACTIVE_INTERACTION` | Returns `null` when closed; uses `open`, `onClose`, `useEffect`, Escape listener, focusable elements. | Primitive only; does not prove every page drawer uses it or persists actions. | Use this primitive consistently for all drawer claims. |
| Shared modal primitive | `components/ui/modal.tsx` | Open-gated component with escape handling, focus trap, focus restore, backdrop close, close button. | `REAL_REACTIVE_INTERACTION` | Returns `null` when closed; uses `open`, `onClose`, Escape listener, focus management. | Primitive only; does not prove submit lifecycle. | Use this primitive consistently for modal claims. |
| Release modal | `components/internal-workflow-screen.tsx` | `modalOpen` is initialized from visual state and user action; modal can close/cancel. Confirm posts `j02.releaseClient`. | `PARTIAL_LIFECYCLE` | `ReleasePage` uses `useState(visualState === "release")`, `ReleaseModal`, Cancel, and `runScreencastDemoAction("j02.releaseClient", ...)`. | Confirmation inputs are default/read-only-like demo controls; submit path is actionId demo, not typed payload validation. | Add real confirmation validation, loading/error/success, and payloaded release API path. |
| Compliance block/request evidence modal | `components/decisions-governance-screen.tsx` | Modal state opens from `visualState === "block"` or button. Request evidence posts actionId. | `PARTIAL_LIFECYCLE` | `ComplianceBlockPage` has `modalOpen`, `setModalOpen`, `Manage Block`, Cancel/Keep Blocked, and `runScreencastDemoAction("j02.confirmRequestEvidence", ...)`. | Request details are not persisted as user-entered payload; lifecycle lacks robust loading/error/success proof. | Promote to payloaded evidence request workflow. |
| Evidence vault drawer | `components/decisions-governance-screen.tsx` | Drawer is state-gated and closeable. Content and buttons are static/demo. | `PARTIAL_LIFECYCLE` | `EvidenceVaultPage` uses `drawerOpen`, `setDrawerOpen`, and a closeable drawer. | Evidence preview/download actions are not proven against DB/file storage. | Wire selected evidence IDs to persisted records and file/preview permissions. |
| Governance invite drawer | `components/decisions-governance-screen.tsx` | Drawer opens from button and can close. Send Invitation posts `j07.inviteUser`. | `PARTIAL_LIFECYCLE` | `GovernanceUsersPage` has `drawerOpen`, `Invite User`, `Field` rows, and actionId submission. | Fields are read-only/demo values; invite payload is not typed from form state. | Add controlled fields, validation, service persistence, and audit proof. |
| Role management drawer and confirmation modal | `components/decisions-governance-screen.tsx` | Drawer and modal are reactive, but confirmation phrase is prefilled/read-only-style. | `PARTIAL_LIFECYCLE` | `RoleManagementPage` has `drawerOpen`, `modalOpen`, phrase `value="PORTFOLIO MANAGER"`, and actionId `j07.saveRoleChanges`. | Second confirmation is visually present but not proven as a user-entered guard. | Require typed phrase, disabled state, server-side confirmation validation, audit proof. |
| Access request drawer | `components/decisions-governance-screen.tsx` | Drawer state exists; textarea is present. Approve posts actionId only. | `PARTIAL_LIFECYCLE` | `AccessRequestsPage` uses `drawerOpen`, comment textarea, `runScreencastDemoAction("j07.approveAccessRequest")`. | Comment is not submitted as payload; deny/escalate are close-only or non-persistent. | Add typed approve/deny/escalate API path and audit. |
| Workbench drawer-like panel | `components/internal-workflow-screen.tsx` | Permanent `<aside>` panel with close icon but no close lifecycle. | `STATIC_UI_OVERCLAIM` | `WorkbenchDrawer` renders as an aside in the page; close `X` is visual only. | Drawer-like UI is not actually a drawer if claimed as transient interaction. | Either classify as permanent page region and remove fake close affordance, or convert to real drawer state. |
| Wealth map/action drawers | `components/wealth-actions-screen.tsx` | Page-level state controls open/close for detail drawers. Actions remain mostly demo/static. | `PARTIAL_LIFECYCLE` | `drawerOpen` state, `setDrawerOpen`, `WealthMapDrawer`, `ActionDrawer`, close handlers; action buttons call demo action IDs or have no handler. | Detail lifecycle is real, but mutation lifecycle and persistence are not broadly proven. | Wire selected object/action to typed DB-backed update path. |
| Document upload UI | `components/client-intake-screen.tsx` | Real file picker/drag state, upload state, FormData POST, success/error message, refresh. | `REAL_REACTIVE_INTERACTION` | `DocumentUploadForm` uses `selectedFile`, `dragActive`, `uploadState`, `message`, FormData, `fetch("/api/documents/upload")`, and refresh callback. | Persisted list hook hardcodes `tenantSlug=morgan`; broader tenant/role reload not fully wired in UI. | Fix tenant-scoped reload and add full role/reload UI proof. |
| Client profile, family, entity fields | `components/client-intake-screen.tsx` | Mostly static fields and actionId submissions. | `DEMO_ONLY` | Profile page uses static `FieldBox` data; `Submit for Review` posts `j09.submitProfile`; edit/save buttons lack real payload lifecycle. | No typed form payload, validation, persistence, reload, or cross-role proof. | Build input masks and DB-backed profile/family/entity services. |
| Export approval/share modals | `components/communication-export-ops-screen.tsx` | Modal state exists for approval/share. Actions are actionId-driven and export is metadata-only. | `PARTIAL_LIFECYCLE` | `ExportPreviewPage` uses approval modal and `j08.confirmApproval`; `ExportDownloadPage` has Download/Share actions. | No real binary export; share token is static/demo. | Generate/export real artifact or label metadata-only; persist approval/share lifecycle. |
| Review monitoring screen actions | `components/review-monitoring-screen.tsx` | Action status state and typed-workflow posts exist; rows are static imported data. | `DEMO_ONLY` | UI imports `reviewCalendarRows` and `rebalanceTriggerRows`; posts J16/J17 actionIds. | Does not consume `/api/review-monitoring` live snapshot. | Wire UI to monitoring API and prove reload. |
| Feedback and state panels | Multiple `components/**` | Mixed: upload has event-driven success/error; many panels are permanent visual examples. | `PARTIAL_LIFECYCLE` | Upload message state is real; many status chips/state panels are static imported page data. | Static status chips do not prove lifecycle, blocked state, or persisted state. | Mark permanent regions honestly or wire to state machines and persisted data. |
| Action buttons | Multiple `components/**` | Mixed: some call APIs/actionIds, many are no-op, close-only, or navigation-only. | `PARTIAL_LIFECYCLE` | Examples include demo action buttons in workflow screens and unhandled buttons such as filters, load more, view/download-style actions. | Button presence is not workability proof. | Classify each button by no-op/demo/persistent action before claiming workflow readiness. |

## 4. Static vs Reactive UI Summary

| UI Pattern | Count / Examples | Status | Decision |
| --- | --- | --- | --- |
| Reactive drawer | Examples: shared `Drawer`, evidence vault, governance drawers, wealth/action drawers. | Present but unevenly applied. | Real where open/close state exists; not enough to prove submitted workflow. |
| Static drawer-like panel | Example: `WorkbenchDrawer` permanent aside with visual close icon. | Present. | `STATIC_UI_OVERCLAIM` if called a drawer; acceptable only if documented as permanent region. |
| Reactive modal | Examples: shared `Modal`, release modal, block modal, export approval/share, role confirmation. | Present. | Open/close lifecycle exists; submit/guard lifecycle is partial. |
| Static modal-like block | Confirmation areas with default/read-only values. | Present as partial confirmation illusion. | Treat as `PARTIAL_LIFECYCLE`, not completed guard. |
| Permanent page region | Examples: review panels, side panels, tables, state sections. | Common. | Acceptable only when not represented as transient drawer/modal/overlay. |
| Upload lifecycle | Document upload form. | Strongest interaction lifecycle. | Real reactive upload path, with tenant reload gap. |
| Confirmation lifecycle | Release, compliance, role management. | Partial. | Needs user-entered validation, disabled states, server-side confirmation, audit proof. |
| Action button without real lifecycle | Filters, load more, edit/save, some download/view/share/governance actions. | Common. | Must not be counted as working actions unless wired and proven. |
| Status chip without state proof | Many static demo-data status chips. | Common. | Must not be counted as workflow state unless loaded from persisted state or derived service state. |

## 5. Database Reality Audit

| Area | File(s) | DB Read? | DB Write? | Persists? | Uses Mock/Static/In-Memory? | Classification | Evidence | Gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Prisma schema | `prisma/schema.prisma` | N/A | N/A | Schema only | No | `SCHEMA_EXISTS_BUT_NOT_WIRED` | 22 enums and 42 models observed, including `Document`, `EvidenceRecord`, `AuditEvent`, `ReviewSchedule`, `ExportRequest`, `QueueItem`. | Schema breadth does not prove app wiring. |
| Prisma client/config | `lib/prisma.ts` | Yes when used | Yes when used | Yes when services use it | No | `DB_BACKED_PARTIAL` | `prismaClient()` requires `DATABASE_URL`, uses `PrismaPg`, and caches `PrismaClient`. | Areas with static data bypass client entirely. |
| Document upload | `app/api/documents/upload/route.ts`, `lib/document-upload-service.ts`, `lib/document-storage-adapter.ts` | Yes | Yes | Yes | Local demo storage | `DB_BACKED_AND_WORKABLE` | Upload API parses multipart FormData, validates file/role/tenant, stores bytes, creates `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`. | Workable within demo/local storage; does not prove broader workflow. |
| Document list | `app/api/documents/route.ts`, `lib/document-upload-service.ts`, `components/client-intake-screen.tsx` | Yes | No | Reads persisted rows | Static rows merged with DB rows | `DB_BACKED_PARTIAL` | API reads uploaded documents by tenant; UI hook fetches `/api/documents?tenantSlug=morgan`. | UI hardcodes Morgan tenant and still merges static document data. |
| Typed workflow actions | `deleted generic workflow route`, `lib/typed-workflow-command-bus.ts`, `lib/screencast-demo-client.ts` | Yes | Yes | Yes for seeded fixture rows | Fixed action IDs | `DB_BACKED_PARTIAL` | POST requires `DATABASE_URL`; validates `actionId`; dispatcher updates seeded records and writes audit events. | Not a general payloaded API; many actions mutate deterministic fixture targets only. |
| Old demo upload action | `deleted generic workflow route`, `lib/file-metadata-service.ts` | Yes | Yes, metadata only | Metadata persists | Deterministic file metadata | `DEMO_ONLY` | `j04.uploadDocument` uses demo metadata and records `noBinaryFileStorage:true`. | Distinct from real multipart upload; must not be claimed as real upload. |
| Review monitoring API | `app/api/review-monitoring/route.ts`, `lib/review-monitoring-service.ts` | Yes | No | Snapshot from DB | No in service | `DB_BACKED_PARTIAL` | Reads review schedules, triggers, action items, queue items, and audit events. | UI screen does not use this API for its rows. |
| Review monitoring UI | `components/review-monitoring-screen.tsx`, `lib/review-monitoring-demo-data.ts` | No for displayed rows | Demo actionIds only | Partial through demo actions | Static imported rows | `DEMO_ONLY` | UI imports `reviewCalendarRows` and `rebalanceTriggerRows`; action buttons call J16/J17 action IDs. | Needs API-driven rows and reload proof. |
| Evidence handling | `lib/evidence-service.ts`, `lib/document-upload-service.ts`, `deleted generic workflow route` | Partial | Partial | Upload-created evidence persists | Pure draft/evaluation helpers | `DB_BACKED_PARTIAL` | Upload creates evidence records/items; evidence service draft says DB writes start later and evaluator is pure. | Evidence review/sufficiency lifecycle is not fully wired end-to-end. |
| Audit trail | `lib/audit-service.ts`, `lib/typed-workflow-command-bus.ts`, `lib/document-upload-service.ts` | Partial | Partial | Yes in upload/typed workflow | Preview service only | `DB_BACKED_PARTIAL` | Upload and typed workflow write audit rows; `audit-service` itself only previews events. | Audit is not uniformly integrated across all UI actions. |
| Export flow | `lib/export-package-service.ts`, `lib/export-service.ts`, `components/communication-export-ops-screen.tsx` | Partial/demo | Partial/demo | Metadata/status only | In-memory/metadata-only service behaviour | `MOCK_OR_IN_MEMORY` | `export-package-service` returns `realBinaryGenerated:false`; export service evaluates in memory and has audit-persistence-unavailable paths. | Not a real export artifact flow yet. |
| Permission/RBAC | `lib/permission-engine.ts`, `components/demo-session-provider.tsx` | No DB role read in engine | No | Demo session in localStorage | Demo-local session | `DEMO_ONLY` | Permission engine is centralized and fail-closed for many actions; provider says real auth deferred and stores demo context locally. | Good demo guardrail, not production auth/RBAC. |
| Workflow gates/visibility | `lib/workflow-gate.ts`, `lib/visibility-engine.ts` | No direct DB | No | Logic only | Input-object based | `DB_BACKED_PARTIAL` | Gate and visibility logic fail closed based on provided recommendation/evidence/permission objects. | Needs consistent persisted object loading and UI/API enforcement. |
| Client profile/family/entity/tenant setup | `components/client-intake-screen.tsx`, `components/admin-tenant-setup-screen.tsx`, `deleted generic workflow route` | Static UI, seeded mutation path only | Fixed actionId mutation path only | Partial in demo fixtures | Static/read-only page data | `DEMO_ONLY` | UI mostly renders static fields and posts action IDs such as profile/tenant/governance demos. | Needs typed payload APIs/services and reload proof. |
| Communication/ops | `components/communication-export-ops-screen.tsx` | Mostly static | Demo actionIds only | Not proven broadly | Static demo screen data | `UI_ONLY_STATIC` | Ops queues, SLA panels, comm panels are visual tables/panels with limited demo actions. | Needs DB-backed queues/messages/actions. |

## 6. API Persistence and Contract Audit

| API | Handler File | Uses DB? | Validates Input? | Mutates? | Audits? | Fail-Closed? | Classification | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deleted generic workflow route` | `deleted generic workflow route` | Yes, requires `DATABASE_URL`. | Minimal: parses JSON and validates `actionId` shape. | Yes, fixed seeded mutations by dispatcher. | Yes for many actions through mutation helper/audit writes. | Partial: missing DB returns 503; unknown/default actions can still write deterministic audit. | `DB_BACKED_PARTIAL` | `parseTypedWorkflowRequestBody` accepts action ID only; dispatcher maps J01-J17 action IDs to seeded DB updates. |
| `/api/documents` | `app/api/documents/route.ts` | Yes. | Validates `tenantSlug` presence and format. | No. | No direct audit needed for read. | Partial: invalid tenant 400, server errors 500. | `DB_BACKED_PARTIAL` | Calls `listUploadedDocuments(prismaClient(), tenantSlug)` and returns persisted uploaded documents. |
| `/api/documents/upload` | `app/api/documents/upload/route.ts` | Yes. | Yes: multipart, file, tenant/role, type, size, filename through service. | Yes. | Yes. | Strong: validation 400, permission 403, generic 500. | `DB_BACKED_AND_WORKABLE` | Calls `uploadDocument(prismaClient(), ...)`; service stores bytes and creates document/version/extraction/evidence/audit in transaction. |
| `/api/review-monitoring` | `app/api/review-monitoring/route.ts` | Yes. | Validates `asOf` query date. | No. | No mutation audit. | Yes for invalid date and missing DB. | `DB_BACKED_PARTIAL` | Calls `getReviewMonitoringSnapshot` and returns client-invisible/no-advice/no-release snapshot. |

## 7. End-to-End Workability Matrix

| Workflow | Can Start? | Can Complete Action? | Persists? | Role/Permission Proof? | Feedback/Error Proof? | Classification | Biggest Gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upload document | Yes | Yes, via multipart upload form/API. | Yes, DB rows and local file bytes. | Service enforces role/tenant; tests exist but were not run in this audit. | UI has upload state/message; API returns validation/permission errors. | `WORKABLE` within demo scope | UI reload hardcodes Morgan tenant; broader document review lifecycle still incomplete. |
| Review evidence | Partial | Partial, mostly through static panels/demo actions. | Upload evidence persists, review lifecycle not fully proven. | Logic exists, full role path not executed. | Partial static/visual states. | `PARTIALLY_WORKABLE` | Evidence review/sufficiency is not end-to-end payloaded and tested here. |
| Approve recommendation | Yes in demo pages | Yes via seeded actionId. | Partial, seeded DB mutation path. | Permission/gate logic exists, production auth absent. | Partial demo feedback/navigation. | `PARTIALLY_WORKABLE` | Approval action is not a typed user payload workflow. |
| Compliance release/block/request evidence | Yes | Yes in demo action paths. | Partial, seeded mutation/audit path. | Permission/gate logic exists; confirmation guard partial. | Modal open/close exists; lifecycle incomplete. | `PARTIALLY_WORKABLE` | Confirmation and evidence request payloads are not fully real. |
| Client visibility | Partial | Visibility projection logic exists. | Depends on persisted recommendation/release state. | Visibility engine fails closed for client roles. | UI proof incomplete. | `PARTIALLY_WORKABLE` | Not proven as full UI/API/client role round trip. |
| Export package | Yes visually | Partial approval/download/share demos. | Metadata/status only. | Export service checks permission/redaction/approval in logic. | Static/demo feedback. | `NOT_WORKABLE_YET` | `realBinaryGenerated:false`; no real export artifact. |
| Audit trail | Yes for upload/demo actions | Yes for some actions. | Yes in upload and typed workflow. | Partial. | API errors exist for upload/demo paths. | `PARTIALLY_WORKABLE` | Audit service itself is preview-only and not universal across actions. |
| Review monitoring | Yes | API can return snapshot; UI actions are demo. | Reads DB snapshot; actionIds may mutate seeded state. | Internal only by response flags, but not production auth. | API validation exists; UI static rows. | `PARTIALLY_WORKABLE` | UI is not wired to `/api/review-monitoring` live data. |
| Client profile/family/entity/tenant/governance | Yes visually | Demo actionIds only. | Partial seeded mutations if actionId path used. | Demo permission engine only. | Mostly static/read-only feedback. | `DEMO_ONLY` | Missing typed form payload, API/service persistence, reload proof. |

## 8. Test / Proof Audit

| Test / Script | Exists? | Run? | Result | What It Proves | What It Does Not Prove |
| --- | --- | --- | --- | --- | --- |
| `pnpm typecheck` | Yes | No | `NOT_RUN` | Nothing in this audit. | Current TypeScript health. |
| `pnpm lint` | Yes | No | `NOT_RUN` | Nothing in this audit. | Current lint health. |
| `pnpm db:validate` | Yes | No | `NOT_RUN` | Nothing in this audit. | Current Prisma validation. |
| `pnpm build` | Yes | No | `NOT_RUN` | Nothing in this audit. | Current production build health. |
| `tests/document-upload-api.spec.ts` | Yes | No | `NOT_RUN_MUTATION_RISK` because it seeds DB. | If run successfully, it would prove multipart upload DB persistence, evidence/audit rows, safety flags, reload list, invalid tenant/type/role denial. | It would not prove all workflows are DB-backed. |
| `tests/document-upload-flow.spec.ts` | Yes | No | `NOT_RUN_MUTATION_RISK` because it seeds DB. | If run successfully, it would prove browser upload and reload display for one document path. | It would not prove review/approval/export/governance workflows. |
| `tests/interaction-lifecycle.spec.ts` | Yes | No | `NOT_RUN` | If run successfully, it would prove some modal/drawer open/close/cancel/Escape flows. | It would not prove submit persistence or full lifecycle states. |
| `tests/recommendation-review-workflow-api.spec.ts` | Yes | No | `NOT_RUN_MUTATION_RISK` likely DB mutation/seed dependent. | If run successfully, it would prove selected actionId workflow mutations. | It would not prove typed payload workflow APIs. |
| `tests/review-monitoring-service.spec.ts` | Yes | No | `NOT_RUN_MUTATION_RISK` because it seeds DB. | If run successfully, it would prove monitoring snapshot reads and selected J16/J17 state effects. | It would not prove UI uses live API rows. |
| `tests/file-export-realism.spec.ts` | Yes | No | `NOT_RUN` | If run successfully, it would prove export realism boundaries and metadata-only restrictions. | It would not prove real binary export generation. |
| Permission/workflow/visibility tests | Yes | No | `NOT_RUN` | If run successfully, they would prove logic-level guardrails. | They would not prove production auth or all UI/API enforcement. |

## 9. Reality Gap Register

| Gap ID | Category | Finding | Evidence | Severity | Required Treatment |
| --- | --- | --- | --- | --- | --- |
| GAP-001 | `DB_PARTIAL` | Most workflows are still fixed actionId seeded mutations rather than typed payloaded user workflows. | `deleted generic workflow route`, `lib/screencast-demo-client.ts`, multiple screen action handlers. | `P0_BLOCKER` for real-app/release claims | `PATCH_REQUIRED` |
| GAP-002 | `INTERACTION_PARTIAL` | Confirmation flows are visually present but not fully guarded by user-entered confirmation, disabled state, server-side confirmation validation, and complete lifecycle. | `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`. | `P1_MAJOR` | `PATCH_REQUIRED` |
| GAP-003 | `INTERACTION_STATIC` | Workbench drawer-like panel is permanent and has visual close affordance without close lifecycle. | `components/internal-workflow-screen.tsx`. | `P1_MAJOR` | `PATCH_REQUIRED` or `DESIGN_DECISION_REQUIRED` |
| GAP-004 | `DB_NOT_WIRED` | Several UI screens render imported demo data instead of live API/DB data. | `components/review-monitoring-screen.tsx`, `components/client-intake-screen.tsx`, `components/communication-export-ops-screen.tsx`. | `P1_MAJOR` | `PATCH_REQUIRED` |
| GAP-005 | `MOCK_OR_DEMO_ONLY` | Export is not a real binary artifact flow. | `lib/export-package-service.ts` returns `realBinaryGenerated:false`; `lib/file-metadata-service.ts` creates deterministic metadata. | `P1_MAJOR` | `PATCH_REQUIRED` |
| GAP-006 | `SAFETY_GAP` | Real authentication is deferred; session/tenant/role switcher is demo-local. | `components/demo-session-provider.tsx`. | `P1_MAJOR` for production claims, `INFO` for current demo phase | `DESIGN_DECISION_REQUIRED` |
| GAP-007 | `NO_TEST_PROOF` | Tests exist but were not executed in this audit; several seed/mutate DB. | `package.json`, `tests/**`. | `P1_MAJOR` for proof claims | `TEST_REQUIRED` |
| GAP-008 | `DB_PARTIAL` | Persisted upload document list is tenant-hardcoded in UI. | `components/client-intake-screen.tsx` fetches `/api/documents?tenantSlug=morgan`. | `P1_MAJOR` | `PATCH_REQUIRED` |
| GAP-009 | `WORKABILITY_GAP` | Many buttons are no-op, close-only, navigation-only, or demo-only. | Multiple `components/**` screens. | `P1_MAJOR` | `PATCH_REQUIRED` |
| GAP-010 | `INSUFFICIENT_EVIDENCE` | No current command proof for build/typecheck/lint/tests. | No validation command executed in this audit. | `P1_MAJOR` for release claims | `TEST_REQUIRED` |

## 10. Minimum Patch Path

| Patch Area | Why Needed | Allowed Scope | Must Not Do | Tests Needed |
| --- | --- | --- | --- | --- |
| Tenant-scoped upload reload | Current upload vertical is strongest but UI list hardcodes Morgan. | Read tenant from demo session or route context; keep existing upload API. | Do not broaden product scope or change schema unless required. | Upload API plus browser reload test for at least two tenants/roles. |
| One real workflow vertical | App needs one complete workflow beyond upload. | Pick review -> advisor approval -> compliance release; add typed payload API/service methods using existing schema. | Do not add unrelated routes or promote held/P1 routes. | API persistence, reload, role visibility, audit/evidence tests. |
| Confirmation lifecycle hardening | Sensitive flows must not rely on prefilled visual confirmations. | Controlled phrase input, disabled submit, server validation, loading/error/success. | Do not create fake confirmation states. | Modal lifecycle and denial/acceptance tests. |
| Review monitoring UI wiring | API is DB-backed but UI renders static rows. | Fetch `/api/review-monitoring`, render snapshot, refresh after internal actions. | Do not invent new monitoring schema without decision. | API snapshot, UI render, post-action refresh tests. |
| Evidence review lifecycle | Upload creates evidence but review/sufficiency remains partial. | Connect evidence records to review status, sufficiency, audit events. | Do not claim evidence is approved from upload alone. | Evidence status transition and client visibility tests. |
| Export artifact realism | Export is metadata-only. | Either generate a real downloadable artifact or explicitly label export as metadata-only demo. | Do not claim real export if `realBinaryGenerated:false`. | Export generation/download/share tests or truth-label tests. |
| Action inventory cleanup | Many buttons overpromise. | Classify no-op/demo/persistent actions and disable or wire MVP actions. | Do not leave active-looking no-op sensitive actions. | Route/action smoke tests and no-op guard tests. |

## 11. No-Overclaim Statement

Proven by code inspection:
- The repo has a substantial Prisma schema with 42 models and 22 enums.
- The app has real shared drawer and modal primitives with open/close/focus lifecycle.
- Multipart document upload has a real API/service/storage/Prisma/audit/evidence path.
- `deleted generic workflow route` performs DB-backed seeded demo mutations by action ID.
- `/api/review-monitoring` reads a DB-backed monitoring snapshot.

Partially proven:
- Some page-level drawers/modals are reactive for open/close.
- Some workflow, evidence, audit, permission, visibility, and review-monitoring logic exists.
- Some seeded demo actions persist changes and audit rows.

Not proven:
- End-to-end working app status across intake, evidence review, advisor approval, compliance release, client visibility, export, audit, governance, and monitoring.
- Current build/typecheck/lint/test pass status.
- Production authentication or production RBAC.
- Real export file generation.
- Full UI/API/Prisma reload proof for most screens.

Demo-only or static/clickdummy-like:
- Many screen rows, chips, panels, and fields come from static demo data.
- Many actions post fixed action IDs rather than typed user payloads.
- Several buttons are no-op, close-only, or visual-only.
- Demo session/role/tenant state is local and explicitly not real auth.

DB-backed:
- Multipart upload path, uploaded document listing, seeded typed workflow mutations, audit rows for selected paths, and review monitoring API reads.

Not DB-backed enough to claim a real operating app:
- General client profile/family/entity/tenant/governance workflows.
- Export artifact generation.
- Live review-monitoring UI rows.
- Broad evidence review/sufficiency lifecycle.
- Broad communication/ops action flows.

Must not be claimed yet:
- `APP_REALITY_WORKABLE_DB_BACKED_WITH_REAL_INTERACTIONS`
- P0 passed
- Fully DB-backed app
- Production-ready workflow app
- Real export/download package
- Complete permission/auth enforcement
- Complete interaction lifecycle across drawers, modals, panels, confirmations, and buttons

## 12. Final Recommendation

Recommendation: `PROCEED_TO_TARGETED_PATCH_IMPLEMENTATION`

This recommendation is paired with a strict release-claim block: do not claim the app is fully DB-backed, fully interactive, or operationally workable until the patch path is executed and tests are run.

Next steps:

1. Fix tenant-scoped document list reload so the strongest real upload vertical is not Morgan-hardcoded.
2. Select one MVP workflow and replace actionId-only behaviour with typed UI payload -> API -> service -> Prisma -> reload proof.
3. Harden sensitive confirmations with real typed confirmation, disabled states, loading/error/success, server validation, and audit.
4. Wire review monitoring UI to `/api/review-monitoring` and refresh it after demo/internal actions.
5. Decide whether export must generate a real artifact now or be truth-labeled metadata-only.
6. Run the validation matrix in a non-production database: typecheck, lint, Prisma validate, targeted API/component tests, and then build.
7. Update phase/QA reports only after proof commands pass.
