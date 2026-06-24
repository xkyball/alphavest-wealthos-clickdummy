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
| Spec files | 89 |
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
| Route catalogue navigation | `lib/navigation.ts` groups routes by workspace and role; protected workspaces can be locked for client roles. WP-01 proof and refactor-first catch-up are recorded in `V0_96_WP01_NAVIGATION_SHELL_REPORT.md` and `V0_96_REFACTOR_FIRST_COMPLIANCE_AUDIT_WP01_WP05.md`. | WP-01 is `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`; later touched routes still require their own shell/header proof. |
| Page job / gate / next step | `components/page-header.tsx`, `lib/ux-page-contract.ts`, and `lib/product-guidance.ts` expose page job, scope, gate hints and one primary CTA patterns. | WP-01/WP-12 should reuse and verify, not rebuild. |
| Long/complex pages | UX density/page-type helpers exist and route-smoke contains above-fold and density assertions. WP-02 proof was refreshed on 2026-06-23 in `V0_96_WP02_PAGE_TYPE_DENSITY_REPORT.md`. | WP-02 is `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`; later surface WPs still require their own touched-route proof. |
| Upload not sufficiency | Upload services/tests and copy distinguish upload/intake from review/sufficiency/release. WP-03 proof was refreshed on 2026-06-23 in `V0_96_WP03_EVIDENCE_WORKBENCH_REPORT.md`. | WP-03 is `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`; WP-12 still requires copy/state review across later touched surfaces. |
| Advisor approval not release | Workflow validation, internal workflow copy and tests keep advisor approval compliance-pending. WP-04 proof was refreshed on 2026-06-23 in `V0_96_WP04_ANALYST_WORKBENCH_AI_DRAFT_INTERNAL_REVIEW_REPORT.md`; WP-05 proof and microcopy hardening were refreshed on 2026-06-23 in `V0_96_WP05_ADVISOR_QUEUE_APPROVAL_DETAIL_REPORT.md`; WP-06 compliance decision-room proof was refreshed on 2026-06-23 in `V0_96_WP06_COMPLIANCE_DECISION_ROOM_REPORT.md`; refactor-first catch-up is recorded in `V0_96_REFACTOR_FIRST_COMPLIANCE_AUDIT_WP01_WP05.md`. | WP-05 is `ACCEPTED_WITH_TARGETED_MICROCOPY_HARDENING_AND_CURRENT_PROOF`; advisor-owned reject/request-change is `DEFERRED_NOT_ACCEPTED_AS_WP05`; WP-06 is `ACCEPTED_WITH_DECISION_ROOM_REFACTOR_AND_CURRENT_PROOF` for compliance release/request-evidence/block boundaries. |
| Compliance release decision room | `components/internal-workflow-screen.tsx` now exposes explicit release preconditions, blocked release status, request-evidence as the safe primary action and lifecycle validation for compliance block/request-evidence. Existing workflow API, permission, audit and visibility gates remain the mutation truth. | WP-06 is accepted for decision-room UI hardening and current positive/negative proof; WP-07 is now separately accepted for client-safe decision projection; WP-08 audit surface persistence UI, WP-10 export UX and WP-15 acceptance aggregation remain separate. |
| Client-safe fail closed | Visibility engine and true-UX projection tests exclude AI Draft/internal payloads from client/export views. WP-04 confirmed internal-only analyst draft boundaries and export/client no-leakage. WP-07 proof was refreshed on 2026-06-23 in `V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_REPORT.md`; the client portal now has a projection-backed safe summary card and decision detail has an internal traceability card. | WP-07 is `ACCEPTED_WITH_CLIENT_SAFE_PROJECTION_REFACTOR_AND_CURRENT_PROOF`; WP-15 remains separate final acceptance aggregation. |
| Audit display not persistence | `AuditEvent`, audit service/API, fail-closed tests and audit timeline exist. WP-08 now makes `AuditTimeline` source-state-aware, marks DB readmodel rows as source-backed, labels compliance demo audit rows as display-only context and verifies safe audit API error envelopes. | WP-08 is `ACCEPTED_WITH_AUDIT_SURFACE_PERSISTENCE_UI_HARDENING_AND_CURRENT_PROOF`; WP-10 export UX and WP-15 final acceptance aggregation remain separate. |
| Export stage separation | Export services/tests distinguish scope, redaction, preview, approval, generation, download/share. WP-10 now adds visible export lifecycle and forbidden-payload boundaries to the export route path and verifies the service/UI separation with focused proof. | WP-10 is `ACCEPTED_WITH_EXPORT_SCOPE_REDACTION_APPROVAL_UX_HARDENING_AND_CURRENT_PROOF`; external delivery automation and full binary export remain outside V0.96. |
| Shared interaction primitives | Modal, drawer, table, CTA, state-panel, status/a11y helpers and lifecycle tests already exist. WP-11 now hardens the guarded action primitive with explicit lifecycle states and safety metadata so denied/disabled/loading/success actions cannot silently execute or overclaim downstream completion. | WP-11 is `ACCEPTED_WITH_SHARED_PRIMITIVE_GUARD_LIFECYCLE_HARDENING_AND_CURRENT_PROOF`; broad design-system rewrite and route-specific business priority changes remain out of scope. |
| No-overclaim copy/state feedback | Canonical no-overclaim copy and route tests already existed. WP-12 now expands the central copy vocabulary across upload/evidence/AI/advisor/compliance/client/audit/admin/export/download boundaries, marks status/workflow badges as visual summaries rather than gate proof and sharpens ambiguous visible labels such as client-visible/evidence-complete shortcuts. | WP-12 is `ACCEPTED_WITH_NO_OVERCLAIM_COPY_STATE_FEEDBACK_HARDENING_AND_CURRENT_PROOF`; broad brand copy rewrite, legal disclaimer drafting and API/schema changes remain out of scope. |
| Admin non-bypass | Permission/governance tests and route policy forbid admin override semantics. Governance users, role management and access-request screens already use scoped drawers, second confirmation, audit-required copy and no-overclaim blocked states. WP-09 now adds explicit capability taxonomy and visible "does not grant" boundaries to the touched governance/admin surfaces. | WP-09 is `ACCEPTED_WITH_GOVERNANCE_NON_BYPASS_UX_HARDENING_AND_CURRENT_PROOF`; WP-10 export UX, WP-11 primitive consolidation, WP-12 full copy sweep, WP-13 API integration and WP-14 schema alignment remain separate. |

## WP-08 Audit Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `AUDIT_SERVICE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts`, `lib/demo-workflow-mutation.ts`, `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts` enforce minimum fields and fail-closed audit persistence. |
| `AUDIT_API_REALITY` | `ALREADY_PRESENT_WITH_SAFE_ERROR_ENVELOPE` | `app/api/audit-events/route.ts` returns scoped rows from `listDbtfAuditEvents` and safe empty/error envelopes without raw metadata disclosure. |
| `AUDIT_UI_REALITY` | `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/ui/audit-timeline.tsx` now distinguishes `source-backed`, `pending`, `unavailable` and `display-only`; `components/decisions-governance-screen.tsx` labels compliance demo audit rows as display-only; `components/communication-export-ops-screen.tsx` exposes source-backed DB audit state. |
| `AUDIT_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | `tests/true-ux-audit-surface.spec.ts` covers display-only timelines, compliance audit copy, safe API error envelopes and source-backed readmodel contracts. Existing P0 audit tests remain the service-level proof. |
| `AUDIT_FAILURE_HANDLING_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `runDemoWorkflowMutation`, workflow gate tests and audit-fail-closed specs prevent critical mutations when required audit persistence is unavailable. |
| `CLIENT_AUDIT_REDACTION_REALITY` | `ACCEPTED_WITH_PROJECTION_REDACTION_HARDENING` | `lib/visibility-engine.ts` treats audit actor/event/reason/metadata as internal decision fields; `tests/client-visibility-projection.spec.ts` proves released client-safe decision projection excludes them. |

## WP-09 Governance/Admin Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `ADMIN_SETUP_UI_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_BOUNDARY_HARDENING` | `components/admin-tenant-setup-screen.tsx` already separates platform/tenant/security/template configuration from release authority; WP-09 adds explicit governance capability boundaries and tests. |
| `GOVERNANCE_UI_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/decisions-governance-screen.tsx` already contains scoped invite, role drawer, second-confirmation modal, access-request drawer and audit-history surfaces; WP-09 adds visible allowed/denied capability taxonomy and "does not grant" summaries. |
| `ADMIN_NAV_HEADER_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current shell/page contracts and route-smoke tests group admin/governance as scoped configuration and access control, not superuser release authority. |
| `PERMISSION_SERVICE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `lib/permission-engine.ts`, `lib/control-layer/permission-decision.ts`, `tests/permission-engine.spec.ts` and `tests/governance-non-bypass.spec.ts` enforce route/action/object/payload separation. |
| `GOVERNANCE_API_REALITY` | `ALREADY_PRESENT_FOR_CURRENT_SCOPE` | `app/api/admin-tenants/route.ts` and `app/api/demo-workflow/route.ts` support safe demo governance workflows; no new governance API was required for WP-09. |
| `GOVERNANCE_AUDIT_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `runDemoWorkflowMutation`, `audit-service`, WP-08 source-backed audit UI and governance non-bypass tests record denied admin attempts and fail closed when audit is unavailable. |
| `GOVERNANCE_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | Existing P0 tests cover permission and audit non-bypass; WP-09 adds True-UX assertions for capability taxonomy, role/access boundaries and no superuser copy. |

## WP-10 Export Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `EXPORT_UI_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/communication-export-ops-screen.tsx` already had Create/Scope/Redaction/Preview/Download route splits, modal lifecycles and no-overclaim copy. WP-10 adds a visible lifecycle boundary on export pages and a forbidden-payload boundary where scope/redaction context is reviewed. |
| `EXPORT_API_REALITY` | `ALREADY_PRESENT_WITH_SAFE_READMODEL` | `app/api/export-workflow/route.ts` exposes tenant/role-scoped export readmodel snapshots and safe error envelopes; mutation remains in the existing demo workflow API and is not expanded by WP-10. |
| `EXPORT_SERVICE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `lib/export-service.ts` and `lib/export-package-service.ts` classify forbidden payloads, validate scope, keep preview/approval/generation/download/share separate and block generation without redaction, approval, audit and selected request controls. |
| `EXPORT_PROJECTION_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `visibility-engine` and export-service projection checks allow client-safe/released summaries and block AI Draft, internal rationale, compliance notes, unreleased evidence/recommendations and hidden fields. |
| `EXPORT_AUDIT_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `phase8-export-workflow-api.spec.ts`, audit fail-closed services and WP-08 source-backed audit UI prove export approval/download/share actions require audit-backed workflow states. |
| `EXPORT_SCHEMA_REALITY` | `SUFFICIENT_NO_MIGRATION_AUTHORIZED` | Existing `ExportRequest`, `Document`, `AuditEvent`, decision/evidence and visibility fields support the current metadata-only manifest and staged export proof. WP-10 does not authorize schema replacement or binary package infrastructure. |
| `EXPORT_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | Existing export safety/file/API specs cover service gates; `tests/true-ux-export-scope-redaction-approval.spec.ts` adds UI lifecycle boundary, forbidden-payload boundary and separation assertions for WP-10. |

## WP-11 Shared Primitive Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `MODAL_PRIMITIVE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `components/ui/modal.tsx` exposes labelled dialog semantics, `aria-modal`, Escape handling, focus entry/return, live status and owner-owned lifecycle attributes. Existing interaction/a11y/confirmation tests cover route usage. |
| `DRAWER_PRIMITIVE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `components/ui/drawer.tsx` exposes labelled complementary panel semantics, Escape/backdrop/close handling, focus entry/return and owner-owned lifecycle attributes. Governance/evidence/access drawer specs already exercise route usage. |
| `TABLE_LIST_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `components/ui/data-table.tsx`, `evidence-list`, `audit-timeline` and filter affordance tests support loading/empty/error/permission states and accessible disabled row actions without pretending row actions are wired. |
| `CTA_CLUSTER_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `components/ux-cta-cluster.tsx`, page-header/product-guidance CTA state and route-smoke/true-ux CTA tests enforce one-primary/recovery/blocked-reason patterns. |
| `GUARDED_ACTION_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/ui/guarded-action-button.tsx` now exposes denied/disabled/loading/success/error lifecycle attributes, confirmation/audit/permission requirements, polite status feedback and no-overclaim metadata while preventing execution when disabled/loading/success. |
| `STATE_FEEDBACK_A11Y_REALITY` | `ALREADY_PRESENT_WITH_TARGETED_EXTENSION` | `state-panel`, static status/workflow badges and `a11y-status` already carry route-state/no-overclaim support; WP-11 verifies these as shared primitives and extends guarded action status feedback. |
| `PRIMITIVE_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | Existing interaction, confirmation, CTA and a11y specs cover route behaviour; `tests/true-ux-shared-primitives.spec.ts` adds WP-11 primitive contract and guard lifecycle assertions. |

## WP-12 No-Overclaim Copy and State Feedback Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `COPY_VOCABULARY_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/no-overclaim-copy.ts` already existed with baseline boundaries; WP-12 expands it to cover upload, evidence pending/insufficient/sufficient-after-review, AI draft internal-only, advisor-not-release, compliance-not-acceptance, client hidden, audit unavailable, admin non-bypass, export approval-not-download and download-not-client-acceptance. |
| `UPLOAD_EVIDENCE_COPY_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Document upload flow and UI-state tests already distinguish upload/intake from evidence review and sufficiency. WP-12 adds canonical vocabulary and keeps review/sufficiency wording explicit. |
| `ADVISOR_COMPLIANCE_COPY_REALITY` | `ACCEPTED_WITH_TARGETED_LABEL_HARDENING` | Advisor/compliance tests already guard release semantics. WP-12 changes ambiguous compliance wording from "Evidence complete/completeness" toward "Evidence review complete/state" on the touched compliance surface. |
| `CLIENT_SAFE_COPY_REALITY` | `ACCEPTED_WITH_TARGETED_LABEL_HARDENING` | Client projection tests already exclude internal payloads. WP-12 changes visible "Client visible" shortcuts to "Client-safe available/blocked/visible" on touched client/support metrics. |
| `AUDIT_EXPORT_ADMIN_COPY_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | WP08-WP11 added source-backed audit, export lifecycle and governance non-bypass copy; WP-12 centralizes the matching no-overclaim language for audit unavailable, export approval-not-download and admin non-bypass denied states. |
| `STATUS_BADGE_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `StatusChip` and `WorkflowBadge` already marked static/non-interactive affordances. WP-12 adds `data-ux-gate-proof="false"`, state-source metadata and safer default labels for advisor-approved/evidence-ready/compliance-release badges. |
| `COPY_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | Existing UI-state/copy tests cover many boundaries; `tests/true-ux-no-overclaim-copy.spec.ts` adds WP-12 vocabulary, badge-proof and route-label assertions. |

Focused copy search found safety-sensitive strings such as `Release to client`, `Advisor approved`, `Evidence completeness`, `Export approved, download pending`, `AI Draft`, `clientVisible`, `redacted`, and `AuditEvent`. These are not automatically defects: current tests also assert that overclaim phrases such as client visibility unlocked, evidence sufficient, release complete, admin override, download ready, and preview approved do not appear in unsafe CTA regions. WP-12 should keep this as a targeted review list.

## WP-13 API/Service Integration for UI Truth Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `API_ROUTE_REALITY` | `ALREADY_PRESENT_WITH_TARGETED_HARDENING` | Current repo exposes the WP-13 expected 15 API routes. WP-13 reuses `/api/export-workflow` rather than creating a new route and changes invalid-scope/service-error responses to the shared fail-closed envelope. |
| `EXPORT_READMODEL_TRUTH_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/export-workflow-readmodel-service.ts` now marks export snapshots with `uiTruth` metadata: `/api/export-workflow`, `getExportWorkflowSnapshot`, `DB_READMODEL`, `fallbackDemoData: false`, `noClientRelease: true` and `noDownstreamCompletion: true`. |
| `UI_FALLBACK_TRUTH_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/communication-export-ops-screen.tsx` now renders `ExportWorkflowTruthPanel`; API failures produce a visible fail-closed state and scope/timeline fallback data are not treated as proof while `loadState === "error"`. |
| `SAFE_ENVELOPE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF_AND_TARGETED_EXTENSION` | `lib/control-layer/error-envelope.ts` already existed. WP-13 applies it to the export workflow read-model API and extends P0/API tests around invalid export workflow scope. |
| `CLIENT_EXPORT_PAYLOAD_REALITY` | `ALREADY_PRESENT_WITH_TARGETED_PROOF` | Existing export/client projection tests already guard forbidden internal payloads. WP-13 adds snapshot assertions that export read-model payload does not expose storage key, checksum or internal payload fields. |
| `BROAD_API_ARCHITECTURE_REALITY` | `OUT_OF_SCOPE_NOT_IMPLEMENTED` | No GraphQL/API gateway rewrite, new API route, schema migration, production auth provider change or P1/HOLD route promotion was introduced. |
| `WP13_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_AND_API_PROOF` | `tests/p0-api-contract.spec.ts`, `tests/phase8-export-workflow-api.spec.ts` and `tests/true-ux-api-service-ui-truth.spec.ts` now cover the export fail-closed envelope, read-model truth metadata and no-demo-fallback UI contract. |

WP-13 is intentionally a focused implementation slice, not a claim that every UI state across all V0.96 routes has been fully rebound. Remaining cross-domain API/UI truth aggregation belongs to WP15 acceptance, and any schema-field mismatch discovered during later service binding remains WP14-owned.

## WP-14 Schema Usage Alignment for UI/Journey Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `SCHEMA_BASELINE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `prisma/schema.prisma` currently contains 42 models and 22 enums. WP-14 keeps this baseline intact and does not add a migration. |
| `EXPORT_STATUS_TAXONOMY_REALITY` | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/domain-types.ts` now exposes canonical `ExportStatus` UI truth for every schema enum value, including lifecycle stage, allowed next actions, no-overclaim detail and fail-closed handling for unknown values. |
| `READMODEL_SCHEMA_USAGE_REALITY` | `ACCEPTED_WITH_TARGETED_EXPORT_READMODEL_ALIGNMENT` | `lib/export-workflow-readmodel-service.ts` now derives export status label, lifecycle fallback, controls, schema status and no-overclaim detail from the canonical schema taxonomy instead of generic label formatting. |
| `MIGRATION_DECISION_REALITY` | `NO_MIGRATION_AUTHORIZED_OR_REQUIRED` | WP-14 inspected schema support and reused the existing `ExportRequest`/`ExportStatus` model path. No Prisma schema replacement, new enum, patch-only model or blind migration was introduced. |
| `CONFLICTING_STATUS_REALITY` | `FAIL_CLOSED` | `exportStatusUiTruthFor` classifies unknown status values as `CONFLICTING` / `UNKNOWN` and disables approve, generate and download controls. |
| `WP14_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_SCHEMA_ALIGNMENT_PROOF` | `tests/schema-alignment.spec.ts` now asserts schema enum order against the canonical UI taxonomy, validates approval/generation/download boundaries and verifies fail-closed unknown status handling. |

WP-14 is intentionally a targeted schema-usage slice, not a broad schema redesign. The accepted implementation aligns the export workflow UI/read-model journey with the existing Prisma `ExportStatus` taxonomy and records that no migration was needed. Cross-domain schema/read-model aggregation remains WP15 acceptance work unless a later WP discovers a concrete mismatch.

## WP-15 P0 + True-UX Acceptance Suite Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `TEST_INVENTORY_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF_AND_TARGETED_AGGREGATION` | Existing tests already cover P0 acceptance, API safety, client projection, CTA/state, density, a11y, lifecycle, governance, audit, export and navigation proof slices. WP-15 adds a central aggregation matrix instead of duplicating the suites blindly. |
| `P0_SAFETY_ACCEPTANCE_REALITY` | `ACCEPTED_WITH_AGGREGATED_COVERAGE` | `lib/v0-96-p0-true-ux-acceptance.ts` maps mandatory P0 gates for mapped actor, tenant isolation, role/action/payload separation, client fail-closed projection, AI Draft internal-only, advisor-not-release, compliance, evidence, audit, export and admin non-bypass. |
| `TRUE_UX_ACCEPTANCE_REALITY` | `ACCEPTED_WITH_AGGREGATED_COVERAGE` | The matrix maps journey-first IA, page job/header, density, CTA, primitive lifecycle, a11y, no-overclaim copy and status-chip-not-gate-proof to current semantic tests without pixel assertions. |
| `COVERAGE_MATRIX_REALITY` | `ACCEPTED_WITH_NO_UNRESOLVED_RELEASE_BLOCKERS` | `tests/v0-96-p0-true-ux-acceptance.spec.ts` asserts 27 mandatory gates, 27 `COVERED`, 0 `PARTIAL`, 0 `MISSING`, 0 `CONFLICTING`, 0 `BLOCKED` and zero unresolved V0.96 release blockers. |
| `SCOPE_CONTROL_REALITY` | `ACCEPTED_AS_GUARDED_NON_PROMOTION` | Expected external-advisor, KYC/IPS/committee/selected monitoring blockers remain explicitly out of scope and do not promote P1/HOLD/reference routes. |
| `WP15_EVIDENCE_HANDOFF_REALITY` | `ACCEPTED_WITH_WP16_READY_EVIDENCE_INDEX` | `ALPHAVEST_V0_96_P0_TRUE_UX_ACCEPTANCE_EVIDENCE.md` records the WP15 matrix, non-claims, validation command set and proof files for WP16. |

WP-15 proves V0.96 demo-data P0 + True-UX acceptance coverage, not GA production readiness. Route smoke, visual rows, status chips and screenshots remain proof slices only and are not treated as release gates by themselves.

## WP-16 Release Evidence Handoff Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `RELEASE_PROOF_REALITY` | `ACCEPTED_WITH_RELEASE_PROOF` | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md` indexes WP00-WP15, names the accepted V0.96 demo-data P0/True-UX scope and closes the release proof without adding feature scope. |
| `HANDOFF_UPDATE_REALITY` | `ACCEPTED_WITH_CURRENT_DELTA_REGISTER_UPDATE` | This register now marks WP-16 accepted and links the release proof plus `V0_96_WP16_RELEASE_EVIDENCE_HANDOFF_UPDATE_REPORT.md`. |
| `NON_CLAIM_REALITY` | `ACCEPTED_WITH_EXPLICIT_BOUNDARIES` | The release proof records `NOT_GA_PRODUCTION_READY`, `NOT_PRODUCTION_AUTH`, `NOT_BINARY_EXPORT_DELIVERY`, `NOT_ROUTE_PROMOTION`, `NOT_SCHEMA_REDESIGN` and `NOT_GENERATED_SCREEN_ASSET`. |
| `SCOPE_PRESERVATION_REALITY` | `ACCEPTED_NO_NEW_PRODUCT_SCOPE` | WP-16 introduces no new route, schema migration, generated screen/image/state-screen asset, production auth switch, external integration or P1/HOLD/reference route promotion. |
| `VALIDATION_HANDOFF_REALITY` | `ACCEPTED_WITH_TARGETED_RELEASE_GUARD` | `tests/v0-96-release-proof.spec.ts` verifies the release proof, WP00-WP16 index, non-claim language and register closure. |

WP-16 is a release evidence and handoff update, not a new implementation slice. It accepts the V0.96 demo-data P0/True-UX release proof while preserving non-GA and non-production boundaries.

## Deep-Codex WP-17 API/Service Integration Catch-up Reality Classification

| Required classification key | Current classification | Evidence |
| --- | --- | --- |
| `WP17_PROMPT_SOURCE_REALITY` | `LEGACY_DEEP_CODEX_NUMBERING_PRESENT` | The single WP upload sequence ended at WP-16, but `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DEEP_CODEX_TASK_DESCRIPTIONS.md` contains a later-numbered `WP-17 - API / Service Integration for UI Truth`. |
| `WP17_DUPLICATE_TITLE_REALITY` | `OVERLAPS_WITH_SINGLE_FILE_WP13` | The already accepted `WP-13 API/Service Integration for UI Truth` covered the export API/read-model/UI truth chain and fail-closed export envelope. |
| `WP17_API_ENVELOPE_REALITY` | `PARTIAL_BEFORE_CATCHUP`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `app/api/documents/route.ts`, `app/api/documents/review/route.ts` and `app/api/audit-events/route.ts` now use `failClosedJson` for safe error responses. |
| `WP17_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_API_PROOF` | `tests/true-ux-api-service-ui-truth.spec.ts`, `tests/p0-api-contract.spec.ts`, `tests/document-upload-api.spec.ts`, `tests/evidence-review-api.spec.ts` and `tests/true-ux-audit-surface.spec.ts` assert fail-closed/no-advance API behavior. |
| `WP17_SCOPE_REALITY` | `NO_API_SPRAWL_NO_SCHEMA_ROUTE_EXPANSION` | No new API, route, schema migration, production-auth switch, generated asset or protected route promotion was introduced. |

Deep-Codex WP-17 is accepted as a compatibility catch-up over the already executed WP-13 API/service truth slice. It hardens remaining touched UI-facing API errors to the shared fail-closed envelope without changing product scope.

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
| `pnpm test:v0-96-release-proof` | V0.96 WP-16 release proof guard |
| `pnpm test:v0-96-wp17-api-truth` | Deep-Codex WP-17 API/service truth catch-up |

True-UX specific/current proof files include `tests/source-reality-gate.spec.ts`, `tests/route-smoke.spec.ts`, `tests/navigation-shell.spec.ts`, `tests/product-guidance-shell.spec.ts`, `tests/true-ux-a11y.spec.ts`, `tests/true-ux-api-service-ui-truth.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/v0-96-ux-ia-delta-register.spec.ts`, `tests/v0-96-p0-true-ux-acceptance.spec.ts`, and `tests/v0-96-release-proof.spec.ts`.

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
| WP-01 | Journey-first IA / App Shell / Sidebar / Topbar / Page Header | `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current WP-01 proof and refactor-first audit confirm shared shell/sidebar/topbar/page-header/navigation implementation paths without app-code changes; later touched routes still need their own route/header/state proof |
| WP-02 | Page-Type + Density System | `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current WP-02 proof confirms existing V0.96 density adapter, D1-D4 contracts, long-page targets, client calmness, reference/hold guards and route-smoke coverage without app-code changes |
| WP-03 | Evidence Workbench + Sufficiency UX | `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current WP-03 proof confirms upload-only semantics, review/link/sufficiency separation, insufficient recovery, wrong-role and wrong-scope denial, audit references, client/raw evidence boundaries and route-smoke coverage without app-code changes |
| WP-04 | Analyst Workbench + AI Draft Internal Review | `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF` | Current WP-04 proof confirms internal-only AI/rules draft review, unsupported-claim rejection, evidence-scoped rebuild, request-evidence state, advisor handoff without release, wrong-role fail-closed behavior, audit writes, no client/export leakage and route-smoke coverage without app-code changes |
| WP-05 | Advisor Queue + Approval Detail | `ACCEPTED_WITH_TARGETED_MICROCOPY_HARDENING_AND_CURRENT_PROOF` | Current WP-05 proof confirms advisor queue/detail route truth, advisor approval to compliance-pending only, audit-backed advisor approval, wrong-role/admin non-bypass, client/export no-leakage, one-primary CTA/density coverage and exact advisor-not-release microcopy; advisor-owned reject/request-change is explicitly not accepted and remains owned by WP06/WP11/WP12 boundaries |
| WP-06 | Compliance Decision Room | `ACCEPTED_WITH_DECISION_ROOM_REFACTOR_AND_CURRENT_PROOF` | Current WP-06 proof implements decision-room preconditions, blocked release status, request-evidence primary action, block/request-evidence modal lifecycle hardening and focused UI assertions; existing workflow API, permission, audit fail-closed and client-safe projection tests prove release/block/request-evidence boundaries without creating new routes, schema or shortcut release paths |
| WP-07 | Decision Record + Client-Safe Projection | `ACCEPTED_WITH_CLIENT_SAFE_PROJECTION_REFACTOR_AND_CURRENT_PROOF` | Current WP-07 proof adds a projection-backed client-safe summary card to `/client/home`, mobile-density parity coverage, internal decision-record traceability on `/decisions/demo`, and positive/negative projection tests over the existing allowlist visibility engine; no new route, schema, API or manual visibility override was introduced |
| WP-08 | Audit Surface + Persistence UI | `ACCEPTED_WITH_AUDIT_SURFACE_PERSISTENCE_UI_HARDENING_AND_CURRENT_PROOF` | Current WP-08 proof makes audit timelines source-state-aware, marks DB/readmodel rows as source-backed, labels display-only compliance/demo audit rows truthfully, keeps safe audit API envelopes and redacts internal audit detail from client projection |
| WP-09 | Governance / Admin Non-Bypass UX | `ACCEPTED_WITH_GOVERNANCE_NON_BYPASS_UX_HARDENING_AND_CURRENT_PROOF` | Current WP-09 proof keeps admin power governance-scoped, adds capability taxonomy and visible "does not grant" boundaries, verifies scoped user/role/access drawers, and reuses P0 permission/audit non-bypass tests without route/schema/API expansion |
| WP-10 | Export Scope / Redaction / Approval UX | `ACCEPTED_WITH_EXPORT_SCOPE_REDACTION_APPROVAL_UX_HARDENING_AND_CURRENT_PROOF` | Current WP-10 proof adds export lifecycle and forbidden-payload UI boundaries, confirms existing scope/redaction/projection/service/API gates, and verifies preview, approval, generation, download/share and client acceptance separation without route/schema/API expansion |
| WP-11 | Shared Interaction Primitives | `ACCEPTED_WITH_SHARED_PRIMITIVE_GUARD_LIFECYCLE_HARDENING_AND_CURRENT_PROOF` | Current WP-11 proof classifies modal/drawer/table/CTA/state/a11y primitives as already present, hardens guarded actions with explicit lifecycle and safety metadata, and verifies denied/disabled/loading/success/error contracts without broad design-system rewrite |
| WP-12 | No-Overclaim Microcopy + State Feedback | `ACCEPTED_WITH_NO_OVERCLAIM_COPY_STATE_FEEDBACK_HARDENING_AND_CURRENT_PROOF` | Current WP-12 proof expands canonical safety copy, marks status/workflow badges as visual summaries not gate proof, hardens client-safe/evidence-review visible labels and adds focused no-overclaim copy assertions without brand rewrite, route expansion or API/schema changes |
| WP-13 | API/Service Integration for UI Truth | `ACCEPTED_WITH_TARGETED_EXPORT_API_READMODEL_UI_TRUTH_HARDENING_AND_CURRENT_PROOF` | Current WP-13 proof reuses existing `/api/export-workflow`, standardizes its invalid/error states through the fail-closed envelope, marks export snapshots as DB-readmodel sourced, prevents export UI from treating fallback demo data as proof on API failure, and adds focused P0/API/True-UX assertions without broad API architecture, schema migration or route expansion |
| WP-14 | Schema Usage Alignment for UI/Journey | `ACCEPTED_WITH_TARGETED_EXPORT_STATUS_SCHEMA_TAXONOMY_AND_CURRENT_PROOF` | Current WP-14 proof keeps the 42-model/22-enum schema baseline intact, maps Prisma `ExportStatus` values to canonical no-overclaim UI lifecycle truth, feeds that taxonomy into the export read-model controls and verifies unknown/conflicting statuses fail closed without schema migration or broad schema redesign |
| WP-15 | P0 + True-UX Acceptance Suite | `ACCEPTED_WITH_COVERAGE_MATRIX_AND_TARGETED_AGGREGATION_PROOF` | Current WP-15 proof adds a central 27-gate P0/True-UX acceptance matrix, verifies every proof file exists, keeps P1/HOLD blockers explicit, adds a focused aggregation script and prepares the WP16 evidence index without route/schema/API/product expansion |
| WP-16 | Release Evidence / Handoff Update | `ACCEPTED_WITH_RELEASE_PROOF_AND_EXPLICIT_NON_GA_BOUNDARIES` | Current WP-16 proof indexes WP00-WP15, records release evidence and carry-forward boundaries, adds a targeted release-proof guard test and preserves non-GA/non-production, no-route-promotion, no-schema-migration and no-generated-asset boundaries |

## Facts, Assumptions and Decisions

Facts:

- The repo already contains a True-UX authority chain, 71 registered routes, 56 implementation-shell routes, 32 productive navigation entries, 15 API routes, 52 TS/TSX component files and 88 spec files after the current V0.96 WP08-WP15 proof additions.
- WP-16 adds a release proof guard test, bringing the current spec count to 89 after WP-16.
- V0.96 is not a replacement source of truth; it is a companion execution sequence under the True-UX handoff.
- The duplicate uploaded Deep Codex task description is byte-identical to the non-suffixed file and is preserved in the upload bundle.

Assumptions:

- The user's WP-00 request targets the first WP-00 prompt from the provided V0.96 bundle.
- Existing untracked root files are user-owned or prior-run artefacts and must be preserved unless explicitly pulled into scope.

Decisions:

- No feature implementation, schema migration, route creation, test mutation, screen generation or visual asset generation is authorized by WP-00.
- V0.96 WP-00 through WP-16 is closed as a demo-data P0/True-UX release proof package, not a GA release.
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
| WP-16 release proof linked | `PASS` |

## Next Step

Proceed only with a user-authorized successor phase. Do not promote protected routes, weaken safety gates, change schema, claim production readiness, or treat uploaded V0.96 material as a replacement source of truth.
