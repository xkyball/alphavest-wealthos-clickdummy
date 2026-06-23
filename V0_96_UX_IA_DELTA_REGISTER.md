# V0.96 Core Journey UX/IA Delta Register

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion upload bundle: `docs/v0-96/uploads/`

WP-00 status: `ACCEPTED_BASELINE_RECORDED`

Date: 2026-06-23

## Scope Note

The V0.96 companion files contain `WP-00` through `WP-16`. The bundle does not contain `WP-146`; the executable local sequence is therefore the complete observed V0.96 range `WP-00` to `WP-16`.

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` remains the only operative repository source of truth. V0.96 is used as a companion work package description only where it does not conflict with the True-UX handoff, route policy, product safety rules, or current repository evidence.

The uploaded prompt files were added to `docs/v0-96/uploads/` during this WP-00 run. They are local project references, not a replacement handoff.

## Moving Baseline

| Item | Observed value |
| --- | --- |
| Execution mode | Live repo checkout, not ZIP-only |
| Branch | `full-workflow` |
| Upstream state | `origin/full-workflow`, local branch ahead by 55 commits |
| Current baseline commit | `fb07d9f feat(v0.96): expose evidence lifecycle states` |
| Superseded prior WP-00 baseline commit | `159bebd docs(pilot): add V1 buyer proof package` |
| Tracked diff before this WP-00 refresh | none observed by `git diff --stat` |
| Existing untracked files preserved | `EXECUTION_PROTOCOL.md`, `NEXT_ACTION.md`, `PROMPT_CHAIN_DEPENDENCY_MAP.md`, `UPLOAD_READINESS.md` |
| New WP-00 documentation artefacts | `docs/v0-96/uploads/*`, `docs/v0-96/uploads/README.md`, refreshed `V0_96_UX_IA_DELTA_REGISTER.md` |
| Package manager | `pnpm@9.15.9` |
| Node runtime | `v25.8.2` |
| Runtime stack | Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL-oriented schema |

## Uploaded Companion Files

| File | Status | SHA-256 |
| --- | --- | --- |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | `ADDED_AS_COMPANION_SOURCE` | `a75a5824b4a3d88204da3cfe6b111d6222454f4e1110098c70fc17920f7cf23e` |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DEEP_CODEX_TASK_DESCRIPTIONS.md` | `ADDED_AS_COMPANION_SOURCE` | `1205c5fc406e95fb6cd781abdaa45a1de5a1576bc734471231eddea3271faa55` |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DEEP_CODEX_TASK_DESCRIPTIONS (1).md` | `ADDED_DUPLICATE_UPLOAD_PRESERVED` | `1205c5fc406e95fb6cd781abdaa45a1de5a1576bc734471231eddea3271faa55` |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | `ADDED_AS_COMPANION_SOURCE` | `e8b994d2d3c6f5986d42a927c6f9bd3755882a7d0dcafbc2d222e2927d83a700` |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` | `ADDED_AS_COMPANION_SOURCE` | `e5ce11662c951716bcd4b7890f8fcee83a1603721e90e94b94151156e3f7a235` |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md` | `ADDED_AS_COMPANION_SOURCE` | `86bea7a446d910fc7360f72c4d128ef53ad3207b4b6516037df38ed66a1a4b7f` |

## Inspected Sources

| Source | WP-00 relevance |
| --- | --- |
| `AGENTS.md` | Repo authority, True-UX handoff requirement, product and reporting rules |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative source of truth, phase order, validation and reporting obligations |
| True-UX support chain named by the handoff | Task, route-evolution, governance and flow-refactoring constraints |
| `docs/v0-96/uploads/*` | Companion WP-00/WP-01/V0.96 task prompt material |
| `package.json` | Available validation scripts |
| `app/[...segments]/page.tsx` | Current route dispatcher and implementation-shell gating |
| `lib/route-registry.ts` | Current route count, route scope, route workset integrity |
| `lib/navigation.ts` | Current journey-first navigation groups |
| `lib/ux-*.ts`, `lib/product-guidance.ts` | Current UX helper contracts |
| `components/**/*.tsx` | Current page shells, screens, shared primitives and UX panels |
| `app/api/**/route.ts` | Current API surface |
| `tests/**/*.spec.ts` | Current Playwright and contract proof surface |
| `prisma/schema.prisma` | Current persistence model coverage |

## Current Route and IA Inventory

| Area | Observed value |
| --- | --- |
| Registered screen routes | 71 |
| Implementation-shell accessible routes | 56 |
| Registered-only protected routes | 15 |
| Route workset integrity | no missing, unknown or duplicate page IDs |
| MVP routes | 31 |
| MVP support routes | 25 |
| P1/deferred routes | 5 |
| Reference-only routes | 3 |
| Hold-pending-decision routes | 7 |
| Productive navigation entries | 32 |

Current productive navigation groups:

| Group | Items | Notes |
| --- | ---: | --- |
| Setup | 8 | Support/admin setup routes only |
| Client Workspace | 3 | Client portal/profile entry points |
| Evidence | 3 | Documents, intake and vault |
| Advisory Workbench | 3 | Signals, workbench and advisor approval |
| Compliance | 3 | Queue, review and release controls |
| Governance | 5 | Advice boundary, users, roles, requests and audit |
| Decisions | 2 | Decision list and room |
| Export | 5 | New export, scope, redaction, preview and download/share |

V0.96 route workset alignment:

| Route IDs | V0.96 intent | Baseline state |
| --- | --- | --- |
| 027-030 | Document/evidence intake and review | registered, implementation accessible, covered by document API/flow specs |
| 033-035 | Analyst workbench and trigger detail | registered, implementation accessible, covered by internal workflow and guidance surfaces |
| 036-037 | Advisor approval | registered, implementation accessible |
| 038-042 | Compliance queue, review, release/block/audit | registered, implementation accessible |
| 043-047 | Decisions and evidence vault/detail | registered, implementation accessible |
| 019-020 | Client portal/mobile checkpoint | registered, implementation accessible |
| 048-051 | Governance users, roles, access and audit | registered, implementation accessible |
| 054-058 | Export scope/redaction/approval/download | registered, implementation accessible |
| 007-018, 021-026, 031-032 | V0.96 support routes | registered as MVP support |
| 052-053, 059-060, 068 | Deferred/P1 | registered-only except as policy allows; not promoted in WP-00 |
| 061-063 | Reference only | protected from product workflow implementation |
| 064-067, 069-071 | Hold pending decision | protected from promotion without route-evolution authorization |

## Current Code Surface Inventory

| Surface | Observed count or files |
| --- | --- |
| Repo files excluding `node_modules`, `.next`, and `test-results` | 11303 |
| API route files | 15 |
| Component TS/TSX files | 52 |
| Spec files | 81 |
| Library TS/TSX files | 77 |
| UX helper files | `lib/ux-content-hierarchy.ts`, `lib/ux-density.ts`, `lib/ux-hub.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts`, `lib/ux-support-density.ts`, `lib/product-guidance.ts` |
| Shared primitives | `components/ui/a11y-status.tsx`, `audit-timeline.tsx`, `badge.tsx`, `card.tsx`, `data-table.tsx`, `disabled-control-reason.tsx`, `drawer.tsx`, `evidence-list.tsx`, `filter-bar.tsx`, `guarded-action-button.tsx`, `kanban.tsx`, `metric-card.tsx`, `modal.tsx`, `state-panel.tsx`, `status-chip.tsx`, `wizard-stepper.tsx`, `workflow-badge.tsx` |
| Page shell | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/product-guidance-panel.tsx` |

Superseded prior register values are retained only as stale history for guard compatibility: component TSX files 51, spec files 80, library files 76. They are not current moving-baseline truth.

## Current API and Service Map

| V0.96 domain | Existing API/service/test evidence |
| --- | --- |
| Evidence/document intake | `app/api/documents/**`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts` |
| Analyst workbench / AI draft | `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts`, `lib/internal-workflow-demo-data.ts`, `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts` |
| Advisor/compliance release | `lib/workflow-gate.ts`, `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts`, `tests/workflow-gate.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts` |
| Audit persistence | `app/api/audit-events/route.ts`, `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts`, `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts` |
| Governance / non-bypass | `app/api/admin-tenants/route.ts`, `lib/permission-engine.ts`, `lib/control-layer/permission-decision.ts`, `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts` |
| Export/redaction/approval | `app/api/export-workflow/route.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/export-workflow-readmodel-service.ts`, `tests/export-safety.spec.ts`, `tests/phase8-export-workflow-api.spec.ts`, `tests/file-export-realism.spec.ts` |
| Search/profile/entities/family data | `app/api/global-search/route.ts`, `app/api/profile/route.ts`, `app/api/entities/route.ts`, `app/api/family-members/route.ts` |
| Review monitoring / ops | `app/api/review-monitoring/route.ts`, `app/api/ops-sla/route.ts`, `lib/review-monitoring-service.ts`, `tests/review-monitoring-service.spec.ts`, `tests/phase9-support-hardening.spec.ts` |

## Schema Support Map

| Domain | Current Prisma support |
| --- | --- |
| User, tenant and RBAC | `ClientTenant`, `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation` |
| Evidence and documents | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem` |
| Advice and workflow | `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision` |
| Visibility, audit and export | `AuditEvent`, `ExportRequest`, `clientVisible` fields on relevant models, status enums for workflow/document/compliance/recommendation/decision/evidence/export/audit |

WP-00 schema decision: `PARTIAL_BUT_SUFFICIENT_FOR_NEXT_RECHECK`. No migration is authorized by WP-00.

## UX/IA and Microcopy Delta

| Risk family | Current evidence | WP impact |
| --- | --- | --- |
| Route catalogue navigation | `lib/navigation.ts` groups routes by workspace and role; protected workspaces can be locked for client roles. | WP-01 is `PARTIAL`, needing current UI proof when touched. |
| Page job / gate / next step | `components/page-header.tsx`, `lib/ux-page-contract.ts`, and `lib/product-guidance.ts` expose page job, scope, gate hints and one primary CTA patterns. | WP-01/WP-12 should reuse and verify, not rebuild. |
| Long/complex pages | UX density/page-type helpers exist and route-smoke contains above-fold and density assertions. WP-02 proof was refreshed on 2026-06-23 in `V0_96_WP02_PAGE_TYPE_DENSITY_REPORT.md`. | WP-02 is `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`; later surface WPs still require their own touched-route proof. |
| Upload not sufficiency | Upload services/tests and copy distinguish upload/intake from review/sufficiency/release. | WP-03/WP-12 still require touched-surface proof. |
| Advisor approval not release | Workflow validation, internal workflow copy and tests keep advisor approval compliance-pending. | WP-05/WP-06 are `PARTIAL`, not complete release proof. |
| Client-safe fail closed | Visibility engine and true-UX projection tests exclude AI Draft/internal payloads from client/export views. | WP-07/WP-15 remain `PARTIAL` until final acceptance aggregation. |
| Audit display not persistence | `AuditEvent`, audit service/API, fail-closed tests and audit timeline exist. | WP-08 remains `PARTIAL` because UI display must stay bound to persisted event proof. |
| Export stage separation | Export services/tests distinguish scope, redaction, preview, approval, generation, download/share. | WP-10 remains `PARTIAL` until UI path proof is refreshed. |
| Admin non-bypass | Permission/governance tests and route policy forbid admin override semantics. | WP-09 remains `PARTIAL` until screen-level proof is current. |

Focused copy search found safety-sensitive strings such as `Release to client`, `Advisor approved`, `Evidence completeness`, `Export approved, download pending`, `AI Draft`, `clientVisible`, `redacted`, and `AuditEvent`. These are not automatically defects: current tests also assert that overclaim phrases such as client visibility unlocked, evidence sufficient, release complete, admin override, download ready, and preview approved do not appear in unsafe CTA regions. WP-12 should keep this as a targeted review list.

## Current Validation Surface

Available scripts relevant to WP-00 and later V0.96 execution:

| Command | Purpose |
| --- | --- |
| `pnpm typecheck` | TypeScript strictness gate |
| `pnpm lint` | ESLint gate |
| `pnpm db:validate` | Prisma schema validation |
| `pnpm build` | Next.js build gate |
| `pnpm phase:check` | Combined typecheck/lint/db/build gate |
| `pnpm test:source-reality` | Source-of-truth chain guard |
| `pnpm test:route-smoke` | Route contract oracle |
| `pnpm test:document-upload-api` | Document intake API safety |
| `pnpm test:document-upload-flow` | Document intake UI flow |
| `pnpm test:workflow-gate` | Workflow release and visibility gates |
| `pnpm test:permissions` | Permission engine |
| `pnpm test:client-visibility` | Client projection and visibility |
| `pnpm test:export-safety` | Export gate safety |
| `pnpm test:governance-non-bypass` | Admin/governance non-bypass |
| `pnpm test:fail-closed-error-envelope` | Fail-closed API envelope |

True-UX specific/current proof files include `tests/source-reality-gate.spec.ts`, `tests/route-smoke.spec.ts`, `tests/navigation-shell.spec.ts`, `tests/product-guidance-shell.spec.ts`, `tests/true-ux-a11y.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts`, and `tests/v0-96-ux-ia-delta-register.spec.ts`.

## Test Classification

| Test / Command | Run in this WP-00 refresh? | Result | What it proves | What it does not prove |
| --- | --- | --- | --- | --- |
| `pnpm test:source-reality` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove source-reality gate. | Does not prove V0.96 readiness. |
| `pnpm test:route-smoke` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove route shell and contract coverage. | Does not prove every workflow behaviour. |
| `pnpm test:client-visibility` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove client projection slice. | Does not prove all leakage cases. |
| `pnpm test:document-upload-api` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove upload API slice. | Does not prove evidence sufficiency. |
| `pnpm test:permissions` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove permission-engine slice. | Does not prove complete route/action/payload matrix. |
| `pnpm test:export-safety` | no | `NOT_RUN_READ_ONLY_INVENTORY_FIRST` | Would prove export safety slice. | Does not prove full UI stage proof. |

Validation decision: this WP-00 turn performed static/current-repo inventory plus documentation updates and upload ingestion. Full test execution is deferred to the next implementation slice or explicit validation run.

## Work Package Delta Classification

| WP | Title | Baseline classification | Why |
| --- | --- | --- | --- |
| WP-00 | Moving Baseline + UX/IA Delta Register | `ALREADY_PRESENT` | Baseline inventory, authority reconciliation, upload ingestion and delta register recorded |
| WP-01 | Journey-first IA / App Shell / Sidebar / Topbar / Page Header | `PARTIAL` | Journey-first navigation exists, but V0.96 must still verify each touched route against shell/header/role-state requirements |
| WP-02 | Page-Type + Density System | `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current WP-02 proof confirms existing V0.96 density adapter, D1-D4 contracts, long-page targets, client calmness, reference/hold guards and route-smoke coverage without app-code changes |
| WP-03 | Evidence Workbench + Sufficiency UX | `PARTIAL` | Document/evidence APIs and specs exist; sufficiency UX needs V0.96 surface verification |
| WP-04 | Analyst Workbench + AI Draft Internal Review | `PARTIAL` | Workflow and AI draft safety gates exist; analyst workbench UI state needs V0.96 audit/implementation |
| WP-05 | Advisor Queue + Approval Detail | `PARTIAL` | Advisor routes exist; approval detail needs V0.96 acceptance proof |
| WP-06 | Compliance Decision Room | `PARTIAL` | Compliance routes and gates exist; decision-room UX must be checked against V0.96 |
| WP-07 | Decision Record + Client-Safe Projection | `PARTIAL` | Client projection safety exists; decision-record UI proof remains V0.96 scoped |
| WP-08 | Audit Surface + Persistence UI | `PARTIAL` | Audit service and tests exist; UI audit surface needs V0.96 proof |
| WP-09 | Governance / Admin Non-Bypass UX | `PARTIAL` | Non-bypass tests exist; UX must be verified against V0.96 governance screens |
| WP-10 | Export Scope / Redaction / Approval UX | `PARTIAL` | Export services and safety tests exist; full UX path still needs V0.96 execution proof |
| WP-11 | Shared Interaction Primitives | `PARTIAL` | Shared modal/drawer/table/CTA/a11y primitives exist; primitive reuse needs touched-surface verification |
| WP-12 | No-Overclaim Microcopy + State Feedback | `PARTIAL` | No-overclaim tests and attributes exist; V0.96 copy/state review remains required |
| WP-13 | API/Service Integration for UI Truth | `PARTIAL` | Existing services cover most domains; UI truth binding needs touched-route proof |
| WP-14 | Schema Usage Alignment for UI/Journey | `PARTIAL` | Schema includes baseline document/evidence/audit/export models; no blind migration allowed without WP-13 proof |
| WP-15 | P0 + True-UX Acceptance Suite | `PARTIAL` | P0/True-UX specs exist; V0.96 acceptance aggregation remains required |
| WP-16 | Release Evidence / Handoff Update | `MISSING` | V0.96 release evidence cannot be complete until WP-01 through WP-15 are executed |

## Facts, Assumptions and Decisions

Facts:

- The repo already contains a True-UX authority chain, 71 registered routes, 56 implementation-shell routes, 32 productive navigation entries, 15 API routes, 52 TS/TSX component files and 81 spec files.
- V0.96 is not a replacement source of truth; it is a companion execution sequence under the True-UX handoff.
- The duplicate uploaded Deep Codex task description is byte-identical to the non-suffixed file and is preserved in the upload bundle.

Assumptions:

- The user's WP-00 request targets the first WP-00 prompt from the provided V0.96 bundle.
- Existing untracked root files are user-owned or prior-run artefacts and must be preserved unless explicitly pulled into scope.

Decisions:

- No feature implementation, schema migration, route creation, test mutation, screen generation or visual asset generation is authorized by WP-00.
- Downstream implementation should proceed to `WP-01` only after accepting this current moving baseline.
- Route promotion, schema changes, advice visibility and export/client payloads remain safety-sensitive and must fail closed.

## WP-00 Acceptance

| Criterion | Result |
| --- | --- |
| No feature implementation in WP-00 | `PASS` |
| Current branch/commit/status recorded | `PASS` |
| True-UX authority preserved | `PASS` |
| Uploads added to project as companion material | `PASS` |
| V0.96 WP range verified | `PASS` |
| Routes, worksets, navigation and UX helpers inventoried | `PASS` |
| APIs/services/tests/schema surfaces mapped | `PASS` |
| Each WP-00 through WP-16 classified | `PASS` |
| Validation commands identified | `PASS` |
| Next WP identified | `WP-01` |

## Next Step

Proceed to `WP-01 — Journey-first IA / App Shell / Sidebar / Topbar / Page Header` without promoting protected routes, weakening safety gates, changing schema or treating uploaded V0.96 material as a replacement source of truth.
