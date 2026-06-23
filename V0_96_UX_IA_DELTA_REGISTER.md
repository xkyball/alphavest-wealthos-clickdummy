# V0.96 Core Journey UX/IA Delta Register

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `/Users/chris/Downloads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`

WP-00 status: `ACCEPTED_BASELINE_RECORDED`

Date: 2026-06-23

## Scope Note

The V0.96 companion file contains `WP-00` through `WP-16`. It does not contain `WP-146`; the executable local sequence is therefore the complete observed V0.96 range `WP-00` to `WP-16`.

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` remains the only operative repository source of truth. V0.96 is used as a companion work package description only where it does not conflict with the True-UX handoff, route policy, product safety rules, or current repository evidence.

## Moving Baseline

| Item | Observed value |
| --- | --- |
| Branch | `full-workflow` |
| Upstream state | `origin/full-workflow`, local branch ahead by 51 commits |
| Baseline commit | `159bebd docs(pilot): add V1 buyer proof package` |
| Tracked diff before WP-00 edits | none observed by `git diff --stat` |
| Existing untracked files preserved | `EXECUTION_PROTOCOL.md`, `NEXT_ACTION.md`, `PROMPT_CHAIN_DEPENDENCY_MAP.md`, `UPLOAD_READINESS.md` |
| Package manager | `pnpm` |
| Runtime stack | Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL-oriented schema |

## Inspected Sources

| Source | WP-00 relevance |
| --- | --- |
| `AGENTS.md` | Repo authority, True-UX handoff requirement, product and reporting rules |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative source of truth, phase order, validation and reporting obligations |
| `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md` | Required support chain, task source under the handoff |
| `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` | Flow and target surface support chain |
| `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md` | Route evolution and split discipline |
| `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md` | Governance and route-evolution decision constraints |
| `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md` | True-UX doctrine and derivation support |
| V0.96 detailed task descriptions | Companion WP-00 to WP-16 scope |
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
| API route files | 15 |
| Component TSX files | 51 |
| Spec files | 80 |
| Library files | 76 |
| UX helper files | `lib/ux-content-hierarchy.ts`, `lib/ux-density.ts`, `lib/ux-hub.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts`, `lib/ux-support-density.ts`, `lib/product-guidance.ts` |
| Shared primitives | `components/ui/a11y-status.tsx`, `audit-timeline.tsx`, `badge.tsx`, `card.tsx`, `data-table.tsx`, `disabled-control-reason.tsx`, `drawer.tsx`, `evidence-list.tsx`, `filter-bar.tsx`, `guarded-action-button.tsx`, `kanban.tsx`, `metric-card.tsx`, `modal.tsx`, `state-panel.tsx`, `status-chip.tsx`, `wizard-stepper.tsx`, `workflow-badge.tsx` |
| Page shell | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/product-guidance-panel.tsx` |

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

True-UX specific/current proof files include `tests/source-reality-gate.spec.ts`, `tests/route-smoke.spec.ts`, `tests/navigation-shell.spec.ts`, `tests/product-guidance-shell.spec.ts`, `tests/true-ux-a11y.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-density.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, and `tests/ui-state-boundaries.spec.ts`.

## Work Package Delta Classification

| WP | Title | Baseline classification | Why |
| --- | --- | --- | --- |
| WP-00 | Moving Baseline + UX/IA Delta Register | `ALREADY_PRESENT` after this artefact | Baseline inventory, authority reconciliation and delta register recorded with a guard test |
| WP-01 | Journey-first IA / App Shell / Sidebar / Topbar / Page Header | `PARTIAL` | Journey-first navigation exists, but V0.96 must still verify each touched route against shell/header/role-state requirements |
| WP-02 | Page-Type + Density System | `PARTIAL` | UX density/page-type helpers and tests exist; V0.96 route-by-route density normalization still needs execution proof |
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

## V2/V3 Mixed Method Notes

Facts:

- The repo already contains a True-UX authority chain, 71 registered routes, 56 implementation-shell routes, 32 productive navigation entries, 15 API routes, 51 TSX components and 80 spec files.
- V0.96 is not a replacement source of truth; it is a companion execution sequence under the True-UX handoff.

Assumptions:

- The user's `WP-00 - WP-146` phrasing refers to all available V0.96 work packages because the supplied file stops at `WP-16`.
- Existing untracked files are user-owned or prior-run artefacts and must be preserved unless explicitly pulled into scope.

Discover:

- Current state is more advanced than a fresh baseline. Most V0.96 domains are partially present.
- The risky move would be reimplementing routes or schema blindly instead of proving what already exists.

Define:

- The real problem is not "build from zero"; it is controlled convergence between V0.96 desired UX/IA and the current True-UX implementation.
- Route promotion, schema changes, advice visibility and export/client payloads remain safety-sensitive and must fail closed.

Develop:

- Execute WPs in order, using focused route and safety proofs after each slice.
- Prefer reuse of existing UX helpers, services, route registry and specs over new one-off components.
- Add new artefacts/tests only where the current proof surface does not make the V0.96 claim durable.

Deliver:

- WP-00 delivers this register and its guard test.
- WP-01 is the next executable slice.

Proof architecture:

- Baseline proof: this register plus `tests/v0-96-ux-ia-delta-register.spec.ts`.
- Runtime proof: targeted Playwright specs for touched routes plus `pnpm test:route-smoke` checkpoints.
- Safety proof: source reality, permissions, workflow, visibility, governance, export and fail-closed specs per WP.
- Visual proof: authenticated screenshots only for UI-touching WPs; WP-00 has no product UI change and does not require screenshots.

Adversarial QA:

- Could a stale external V0.96 source override True-UX? No; this register records the authority boundary.
- Could protected routes be promoted silently? No; route workset counts and protected route status are baseline-recorded.
- Could schema be changed too early? No; WP-14 remains partial and migration is blocked unless WP-13/WP-14 prove necessity.
- Could existing untracked files be accidentally committed? They are explicitly listed as preserved out of scope.

Ethics and fairness:

- No client-visible advice, release, export, approval, or internal-payload exposure is authorized by WP-00.
- No dark pattern, coercion, fabricated proof, or hidden safety bypass is introduced.
- The register separates facts, assumptions, partial coverage and missing evidence.

## WP-00 Acceptance

| Criterion | Result |
| --- | --- |
| No feature implementation in WP-00 | `PASS` |
| Current branch/commit/status recorded | `PASS` |
| True-UX authority preserved | `PASS` |
| V0.96 WP range verified | `PASS` |
| Routes, worksets, navigation and UX helpers inventoried | `PASS` |
| APIs/services/tests/schema surfaces mapped | `PASS` |
| Each WP-00 through WP-16 classified | `PASS` |
| Validation commands identified | `PASS` |
| Next WP identified | `WP-01` |

## Next Step

Proceed to `WP-01 — Journey-first IA / App Shell / Sidebar / Topbar / Page Header` without promoting protected routes, weakening safety gates, or changing schema.
