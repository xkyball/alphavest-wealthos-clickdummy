# ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-22  
**Artefact type:** Final executable Codex implementation handoff.  
**Target project:** AlphaVest WealthOS  
**Target branch:** `full-workflow`  
**Primary source:** `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`  
**Important:** This artefact authorizes Codex implementation only under the constraints, phases, preflight gates, target files, validation commands, safety tests and reporting obligations below. It does not itself modify code, execute Codex or run tests.

## 1. Executive Decision

| Decision Area | Decision |
| --- | --- |
| Artefact status | `TRUE_UX_IMPLEMENTATION_HANDOFF_APPROVED_WITH_CONSTRAINTS` |
| Codex implementation | `AUTHORIZED_ONLY_WITHIN_THIS_HANDOFF` |
| Preflight | `MANDATORY_BEFORE_ANY_CODE_CHANGE` |
| Moving baseline | `MUST_RECHECK_CURRENT_FULL_WORKFLOW_BEFORE_EXECUTION` |
| Task source | `TRUE_UX_CODEX_TASK_PACK_APPLIED` |
| Task volume intake | `77 task-pack entries mapped to execution phases` |
| Route evolution | `AUTHORIZED_ONLY_WITH_ROUTE_EVOLUTION_RECORD_AND_TESTS` |
| Screen splitting | `AUTHORIZED_ONLY_WITH_SCREEN_SPLIT_DECISION_AND_TESTS` |
| Safety tests | `MANDATORY_FOR_CLIENT_ADVICE_EVIDENCE_EXPORT_RBAC_COMMITTEE_KYC_REBALANCE` |
| Screen/image generation | `NOT_AUTHORIZED` |
| Product/Safety decisions by Codex | `NOT_AUTHORIZED` |
| Execution start condition | `READY_FOR_CODEX_EXECUTION_AFTER_PREFLIGHT` |

Codex may implement the True-UX refactoring only inside this handoff. Codex may not reinterpret product scope, weaken safety policy, invent advice behaviour, use `main` as target truth, or skip the moving-baseline preflight.

## 2. Source-of-Truth Applied

| Rank | Source | Applied Use | Limit |
| --- | --- | --- | --- |
| 1 | `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Final execution authority created here. | May authorize only what task pack and predecessor artefacts support. |
| 2 | Current `full-workflow` repo / branch / working tree | Current implementation reality; must be checked in Phase 0. | Do not assume older artefacts match current code. |
| 3 | `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md` | Primary task source. | Task Pack is not execution authority without this handoff. |
| 4 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` | Flow source proof and target architecture. | No direct implementation without task mapping. |
| 5 | `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md` | Route evolution, P1/Hold elevation and split candidate policy. | No route creation outside records/policy. |
| 6 | `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md` | Product Owner approvals and decision authority. | Auto-approval does not override safety. |
| 7 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md` | True UX doctrine and research-backed method. | Not directly executable. |
| 8 | MVP / Safety / API / Schema / P0 artefacts | Hard safety and proof context. | Route scope may evolve; safety may not. |
| 9 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | Control spec only. | No blind schema/code replacement. |
| 10 | `main` branch / main ZIP | False-gap warning only. | Never target truth. |

## 3. Predecessor Availability and Intake

| Artefact | Required? | Availability | Role in Handoff | If Missing | Size bytes |
| --- | --- | --- | --- | --- | --- |
| ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md | YES | YES | Primary task source; required for execution matrix. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 99037 |
| ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md | YES | YES | Flow architecture and target-surface source proof. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 122519 |
| ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md | YES | YES | Route evolution and split policy. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 77328 |
| ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md | YES | YES | Decision authority and Product Owner approvals. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 45473 |
| ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md | YES | YES | True UX doctrine and route/screen-evolution method. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 58462 |
| repo-local artefact bundle context | OPTIONAL | YES | Convenience bundle of predecessor artefacts. | If missing: stop for required predecessors; optional bundle can be replaced by individual files. | 542206 |

Predecessor decision: the primary Task Pack is present and parsed into this handoff. If Codex cannot find the same artefacts in its working context, it must stop before implementation and request the bundle or the missing file references.

## 4. Moving Baseline Preflight Gate

Codex must run and report the following before any code modification:

```bash
git status --short
git branch --show-current
git log -1 --oneline
git diff --stat
cat package.json
```

| Preflight ID | Check | Required Action | Stop If |
| --- | --- | --- | --- |
| PF-001 | Current branch is `full-workflow` or explicitly intended target branch. | Report branch. | Wrong branch and no explicit override. |
| PF-002 | Working tree status. | Report uncommitted changes and classify them. | Unrelated or conflicting changes present. |
| PF-003 | Latest commit captured. | Report commit hash/message. | Cannot determine baseline. |
| PF-004 | Diff stat captured. | Identify files already changed by parallel refactoring. | Parallel changes conflict with target tasks. |
| PF-005 | `package.json` scripts verified. | Identify package manager and runnable scripts. | Validation commands cannot be mapped. |
| PF-006 | Route registry exists and is current. | Inspect `lib/route-registry.ts`. | Route registry missing or unexpectedly divergent. |
| PF-007 | Target components exist. | Inspect target files/components from the task matrix. | Major component mismatch. |
| PF-008 | App shell/sidebar/topbar/page-header current. | Inspect navigation foundation files. | Already refactored incompatibly. |
| PF-009 | Tests inventory current. | Inspect `tests/*`. | Required tests missing or incompatible without planned replacement. |
| PF-010 | Tasks already partially implemented. | Compare routes/components/tests with task intent. | Duplicate or conflicting implementation found. |

Codex may proceed from Phase 0 to Phase 1 only after this gate passes. Conditional tasks become executable only when their specific baseline or safety recheck passes.

## 5. Codex Authority Boundary

| Area | Codex May Do | Codex Must Not Do |
| --- | --- | --- |
| Routes | Create, split, merge or deprecate routes only where the task has a Route Evolution Record and is allowed in this handoff. | Invent routes without records or use route count preservation as a quality metric. |
| Screens / Components | Split, refactor and create UI components where the task permits. | Generate screen images, state-screen images or static visual assets. |
| Navigation | Implement IA/App Shell/Sidebar/Header from task pack and route evolution policy. | Invent product navigation scope or make reference/demo routes primary work surfaces without task support. |
| Client Projection | Implement fail-closed client-safe surfaces with no-leakage proof. | Expose internal drafts, analyst notes, compliance notes or unreleased evidence. |
| Decision Rooms | Build safety-critical decision surfaces with audit/safety tests. | Treat advisor approval as compliance release or compliance release as client acceptance. |
| Tests | Add/update required route-smoke, flow, RBAC, no-leakage, a11y and P0 negative tests. | Skip safety negative tests or weaken implementation to pass tests. |
| Schema | Align usage only if a task explicitly requires it and existing schema supports it. | Blind schema replacement, migrations or patch-schema creation without explicit authorization. |
| Safety | Enforce existing safety contracts and fail-closed behaviour. | Invent, weaken or bypass safety policy. |

## 6. Execution Status Vocabulary

| Status | Meaning | Handoff Treatment |
| --- | --- | --- |
| `EXECUTE_NOW` | Task can be executed after Phase 0 preflight passes. | Include in execution phases. |
| `EXECUTE_AFTER_BASELINE_RECHECK` | Task is clear but depends on current route/component/test verification. | Execute only if preflight confirms the baseline. |
| `EXECUTE_AFTER_SAFETY_RECHECK` | Task requires safety proof confirmation before implementation. | Execute only after safety mapping is verified and tests are identified. |
| `BLOCKED_DO_NOT_EXECUTE` | Task must not be implemented in this run. | Exclude and report blocker. |
| `DEFER_TO_LATER` | Task is valid but outside current execution batch. | Exclude from current Codex run. |
| `STOP_AND_REPORT` | Preflight, safety, route-record or split-decision conflict encountered. | Stop current phase and report. |

## 7. Execution Order Overview

| Phase | Name | Purpose | Depends On | May Execute |
| --- | --- | --- | --- | --- |
| 0 | Preflight / Baseline Verification | Verify moving baseline and scripts before implementation. | None | No code changes |
| 1 | Route Registry / Route Evolution | Create/split/merge/deprecate routes under records and route-smoke proof. | Phase 0 | UX-ROUTE-EVO-001-T, UX-ROUTE-EVO-002-T, UX-ROUTE-EVO-003-T, UX-ROUTE-EVO-004-T, UX-ROUTE-EVO-005-T, UX-ROUTE-EVO-006-T, UX-ROUTE-EVO-007-T, UX-ROUTE-EVO-008-T … +4 more |
| 2 | IA / App Shell / Sidebar / Topbar / Page Header | Establish journey-first IA, app shell, sidebar, topbar and page headers. | Phase 0 | UX-IA-001, UX-IA-002, UX-IA-003, UX-IA-004, UX-IA-005 |
| 3 | Hubs | Create orientation hubs that prioritize work without becoming monster screens. | Prior relevant phases through Phase 2 | UX-HUB-001, UX-HUB-002, UX-HUB-003, UX-HUB-004, UX-HUB-005, UX-HUB-006, UX-HUB-007 |
| 4 | Workbench / Queues | Build queues and workbenches for active task processing. | Prior relevant phases through Phase 3 | UX-WORKBENCH-001, UX-WORKBENCH-002, UX-WORKBENCH-003, UX-WORKBENCH-004, UX-WORKBENCH-005, UX-WORKBENCH-006 |
| 5 | Detail / Drawer / Object Review + Screen Splits | Refactor details, drawers, object review surfaces and selected page splits. | Prior relevant phases through Phase 4 | UX-DETAIL-001, UX-DETAIL-002, UX-DETAIL-003, UX-DETAIL-004, UX-DETAIL-005, UX-DETAIL-006, UX-PAGE-SPLIT-001, UX-PAGE-SPLIT-002 … +6 more |
| 6 | Decision Rooms | Build decision rooms for approval, release, export, committee and KYC/suitability decisions. | Prior relevant phases through Phase 5 | UX-DECISION-ROOM-001, UX-DECISION-ROOM-002, UX-DECISION-ROOM-003, UX-DECISION-ROOM-004, UX-DECISION-ROOM-005 |
| 7 | Client Projection | Implement client-safe projections and fail-closed released views. | Prior relevant phases through Phase 6 | UX-CLIENT-PROJECTION-001, UX-CLIENT-PROJECTION-002, UX-CLIENT-PROJECTION-003, UX-CLIENT-PROJECTION-004 |
| 8 | CTA / State / Recovery | Implement CTA, state, blocker, recovery and no-overclaim feedback. | Prior relevant phases through Phase 7 | UX-CTA-STATE-001, UX-CTA-STATE-002, UX-CTA-STATE-003, UX-CTA-STATE-004, UX-CTA-STATE-005, UX-CTA-STATE-006, UX-CTA-STATE-007, UX-CTA-STATE-008 |
| 9 | Density / Layout System | Apply density/layout tier system across page types. | Prior relevant phases through Phase 8 | UX-DENSITY-001, UX-DENSITY-002, UX-DENSITY-003, UX-DENSITY-004 |
| 10 | Accessibility / Focus / Keyboard / Status | Implement accessibility/focus/keyboard/status requirements. | Prior relevant phases through Phase 9 | UX-A11Y-001, UX-A11Y-002, UX-A11Y-003, UX-A11Y-004 |
| 11 | P0 Safety Tests | Add/update positive and negative P0 safety tests. | Prior relevant phases through Phase 10 | UX-P0-SAFETY-001, UX-P0-SAFETY-002, UX-P0-SAFETY-003, UX-P0-SAFETY-004, UX-P0-SAFETY-005, UX-P0-SAFETY-006, UX-P0-SAFETY-007, UX-P0-SAFETY-008 |
| 12 | Final Validation / Proof / Report | Run validation commands, collect proof and report. | All implementation phases | Validation/report |

## 8. Phase 0 — Preflight / Baseline Verification

| Field | Required Content |
| --- | --- |
| Phase Goal | Verify current moving baseline. No implementation. |
| Included Workstreams | Preflight only |
| Candidate Task IDs | None |
| Execution Status | `MANDATORY_PREFLIGHT_NO_CODE_CHANGES` |
| Target Files | Read-only inspection of repo, `package.json`, route registry, components and tests |
| Allowed Changes | None |
| Forbidden Changes | Any file edit, test mutation, route creation or component change |
| Required Tests | No tests before scripts are mapped |
| Acceptance Criteria | Branch, status, commit, diff, scripts, route registry, target files and test inventory are reported |
| Proof Required | Preflight summary in Codex final report |
| Stop Conditions | Wrong branch, conflicting changes, missing route registry, missing target components, script mismatch |

## 9. Phase 1 — Route Registry / Route Evolution

| Field | Required Content |
| --- | --- |
| Phase Goal | Route creation/split/merge/deprecation under record/test discipline |
| Included Workstreams | UX-ROUTE-EVO |
| Candidate Task IDs | UX-ROUTE-EVO-001-T; UX-ROUTE-EVO-002-T; UX-ROUTE-EVO-003-T; UX-ROUTE-EVO-004-T; UX-ROUTE-EVO-005-T; UX-ROUTE-EVO-006-T; UX-ROUTE-EVO-007-T; UX-ROUTE-EVO-008-T; UX-ROUTE-EVO-009-T; UX-ROUTE-EVO-010-T; UX-ROUTE-EVO-011-T; UX-ROUTE-EVO-012-T |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 12 |
| Target Files | components/admin-tenant-setup-screen.tsx; components/client-intake-screen.tsx; components/committee-review-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/kyc-aml-workflow-screen.tsx; components/review-monitoring-screen.tsx; components/suitability-ips-screen.tsx; lib/route-registry.ts; lib/visibility-engine.ts |
| Allowed Changes | Only changes explicitly described by UX-ROUTE-EVO tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/committee-review-routes.spec.ts; pnpm playwright test tests/document-upload-api.spec.ts; pnpm playwright test tests/document-upload-flow.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts; pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/review-monitoring-service.spec.ts; pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/workflow-gate.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 10. Phase 2 — IA / App Shell / Sidebar / Topbar / Page Header

| Field | Required Content |
| --- | --- |
| Phase Goal | App shell, sidebar, topbar, page header and in-flow navigation |
| Included Workstreams | UX-IA |
| Candidate Task IDs | UX-IA-001; UX-IA-002; UX-IA-003; UX-IA-004; UX-IA-005 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 2; EXECUTE_AFTER_SAFETY_RECHECK: 3 |
| Target Files | components/app-shell.tsx; components/communication-export-ops-screen.tsx; components/page-header.tsx; components/sidebar.tsx; components/top-bar.tsx; components/ui/*; lib/route-registry.ts |
| Allowed Changes | Only changes explicitly described by UX-IA tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm lint; pnpm playwright test tests/file-export-realism.spec.ts; pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/workflow-gate.spec.ts; pnpm typecheck |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 11. Phase 3 — Hubs

| Field | Required Content |
| --- | --- |
| Phase Goal | Orientation hubs with summary, prioritized queues and next-step links |
| Included Workstreams | UX-HUB |
| Candidate Task IDs | UX-HUB-001; UX-HUB-002; UX-HUB-003; UX-HUB-004; UX-HUB-005; UX-HUB-006; UX-HUB-007 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 7 |
| Target Files | components/app-shell.tsx; components/client-intake-screen.tsx; components/committee-review-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/kyc-aml-workflow-screen.tsx; components/page-header.tsx; components/review-monitoring-screen.tsx |
| Allowed Changes | Only changes explicitly described by UX-HUB tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/route-smoke.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 12. Phase 4 — Workbench / Queues

| Field | Required Content |
| --- | --- |
| Phase Goal | Active task workbenches and role-specific review queues |
| Included Workstreams | UX-WORKBENCH |
| Candidate Task IDs | UX-WORKBENCH-001; UX-WORKBENCH-002; UX-WORKBENCH-003; UX-WORKBENCH-004; UX-WORKBENCH-005; UX-WORKBENCH-006 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 6 |
| Target Files | components/client-intake-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/review-monitoring-screen.tsx |
| Allowed Changes | Only changes explicitly described by UX-WORKBENCH tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/workflow-gate.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 13. Phase 5 — Detail / Drawer / Object Review + Screen Splits

| Field | Required Content |
| --- | --- |
| Phase Goal | Object review, detail surfaces and page-job separation |
| Included Workstreams | UX-DETAIL / UX-PAGE-SPLIT |
| Candidate Task IDs | UX-DETAIL-001; UX-DETAIL-002; UX-DETAIL-003; UX-DETAIL-004; UX-DETAIL-005; UX-DETAIL-006; UX-PAGE-SPLIT-001; UX-PAGE-SPLIT-002; UX-PAGE-SPLIT-003; UX-PAGE-SPLIT-004; UX-PAGE-SPLIT-005; UX-PAGE-SPLIT-006; UX-PAGE-SPLIT-007; UX-PAGE-SPLIT-008 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 14 |
| Target Files | components/client-intake-screen.tsx; components/committee-review-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/kyc-aml-workflow-screen.tsx; components/review-monitoring-screen.tsx; components/suitability-ips-screen.tsx; components/ui/audit-timeline.tsx; components/ui/evidence-list.tsx |
| Allowed Changes | Only changes explicitly described by UX-DETAIL / UX-PAGE-SPLIT tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/route-smoke.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 14. Phase 6 — Decision Rooms

| Field | Required Content |
| --- | --- |
| Phase Goal | Safety-critical approval/release/export/committee/KYC decision surfaces |
| Included Workstreams | UX-DECISION-ROOM |
| Candidate Task IDs | UX-DECISION-ROOM-001; UX-DECISION-ROOM-002; UX-DECISION-ROOM-003; UX-DECISION-ROOM-004; UX-DECISION-ROOM-005 |
| Execution Status Summary | EXECUTE_AFTER_SAFETY_RECHECK: 5 |
| Target Files | components/committee-review-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/review-monitoring-screen.tsx; components/suitability-ips-screen.tsx |
| Allowed Changes | Only changes explicitly described by UX-DECISION-ROOM tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/file-export-realism.spec.ts; pnpm playwright test tests/workflow-gate.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 15. Phase 7 — Client Projection

| Field | Required Content |
| --- | --- |
| Phase Goal | Fail-closed client-safe released views |
| Included Workstreams | UX-CLIENT-PROJECTION |
| Candidate Task IDs | UX-CLIENT-PROJECTION-001; UX-CLIENT-PROJECTION-002; UX-CLIENT-PROJECTION-003; UX-CLIENT-PROJECTION-004 |
| Execution Status Summary | EXECUTE_AFTER_SAFETY_RECHECK: 4 |
| Target Files | components/client-intake-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; lib/visibility-engine.ts |
| Allowed Changes | Only changes explicitly described by UX-CLIENT-PROJECTION tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/true-ux-client-projection.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 16. Phase 8 — CTA / State / Recovery

| Field | Required Content |
| --- | --- |
| Phase Goal | One primary CTA, blockers, recovery and no-overclaim feedback |
| Included Workstreams | UX-CTA-STATE |
| Candidate Task IDs | UX-CTA-STATE-001; UX-CTA-STATE-002; UX-CTA-STATE-003; UX-CTA-STATE-004; UX-CTA-STATE-005; UX-CTA-STATE-006; UX-CTA-STATE-007; UX-CTA-STATE-008 |
| Execution Status Summary | EXECUTE_AFTER_SAFETY_RECHECK: 8 |
| Target Files | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components |
| Allowed Changes | Only changes explicitly described by UX-CTA-STATE tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/workflow-gate.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 17. Phase 9 — Density / Layout System

| Field | Required Content |
| --- | --- |
| Phase Goal | D1-D4 density hierarchy and layout primitives |
| Included Workstreams | UX-DENSITY |
| Candidate Task IDs | UX-DENSITY-001; UX-DENSITY-002; UX-DENSITY-003; UX-DENSITY-004 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 4 |
| Target Files | components/client-intake-screen.tsx; components/communication-export-ops-screen.tsx; components/decisions-governance-screen.tsx; components/internal-workflow-screen.tsx; components/ui/*; components/ui/data-table.tsx; decision room components |
| Allowed Changes | Only changes explicitly described by UX-DENSITY tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm lint; pnpm typecheck |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 18. Phase 10 — Accessibility / Focus / Keyboard / Status

| Field | Required Content |
| --- | --- |
| Phase Goal | Keyboard, focus, ARIA and status-announcement proof |
| Included Workstreams | UX-A11Y |
| Candidate Task IDs | UX-A11Y-001; UX-A11Y-002; UX-A11Y-003; UX-A11Y-004 |
| Execution Status Summary | EXECUTE_AFTER_BASELINE_RECHECK: 4 |
| Target Files | components/page-header.tsx; components/ui/*; components/ui/drawer.tsx; components/ui/modal.tsx |
| Allowed Changes | Only changes explicitly described by UX-A11Y tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test tests/true-ux-a11y.spec.ts |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 19. Phase 11 — P0 Safety Tests

| Field | Required Content |
| --- | --- |
| Phase Goal | Positive/negative safety proof for no leakage, no bypass and no overclaim |
| Included Workstreams | UX-P0-SAFETY |
| Candidate Task IDs | UX-P0-SAFETY-001; UX-P0-SAFETY-002; UX-P0-SAFETY-003; UX-P0-SAFETY-004; UX-P0-SAFETY-005; UX-P0-SAFETY-006; UX-P0-SAFETY-007; UX-P0-SAFETY-008 |
| Execution Status Summary | EXECUTE_AFTER_SAFETY_RECHECK: 8 |
| Target Files | lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/* |
| Allowed Changes | Only changes explicitly described by UX-P0-SAFETY tasks in section 21. |
| Forbidden Changes | Do not expand product scope, weaken safety, create route without record, split without decision, or generate screen/state/image assets. |
| Required Tests | pnpm playwright test; pnpm playwright test tests/committee-review-routes.spec.ts; pnpm playwright test tests/document-upload-flow.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts; pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/review-monitoring-service.spec.ts; pnpm playwright test tests/workflow-gate.spec.ts; pnpm test; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts; … +3 more |
| Acceptance Criteria | Each task acceptance criterion is met; no safety overclaim; route/navigation/flow proof captured. |
| Proof Required | Screenshots or route/flow/test proof as specified per task. |
| Stop Conditions | Baseline conflict, safety conflict, missing route record/split decision, failing P0 negative test or target file mismatch. |

## 20. Phase 12 — Final Validation / Proof / Report

| Field | Required Content |
| --- | --- |
| Phase Goal | Run validation and produce final implementation report. |
| Included Workstreams | Validation, proof and report |
| Candidate Task IDs | All executed tasks |
| Execution Status | `FINAL_VALIDATION_REQUIRED` |
| Target Files | No further changes except in-scope fixups for failed validation |
| Allowed Changes | Minimal fixups tied to executed task scope |
| Forbidden Changes | New scope, new routes, new safety policy, image/screen generation, unrelated cleanup |
| Required Tests | Full validation suite from section 25 |
| Acceptance Criteria | All validations run or grounded blocker reported |
| Proof Required | Test summary, route-smoke, flow, no-leakage, accessibility, no-generation and no-safety-regression confirmations |
| Stop Conditions | Any P0 safety, no-leakage, route-smoke, build/type/lint failure |

## 21. Task Execution Matrix

| Execution Order | Task ID | Phase | Workstream | Source Flow | Route Evolution Record | Screen Split Decision | Related Routes | Target Files | Execution Status | Allowed Changes | Forbidden Changes | Required Tests | Acceptance Criteria | Proof Required | Stop Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | UX-ROUTE-EVO-001-T | Phase 1 | UX-ROUTE-EVO-001 | FLOW-003 | UX-ROUTE-EVO-001 | UX-SPLIT-001 | /signals; /workbench → /advisory; /advisory/review-queue; /advisory/triggers/:id/review | components/internal-workflow-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create advisory hub/queue/review route metadata and screen branches. | No client release or advisor release shortcut. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/route-smoke.spec.ts | Advisory flow starts at hub, queue opens trigger review, draft remains internal. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 2 | UX-ROUTE-EVO-002-T | Phase 1 | UX-ROUTE-EVO-002 | FLOW-004 | UX-ROUTE-EVO-002 | UX-SPLIT-004 | /advisor-approval → /advisor/reviews; /advisor/reviews/:id | components/internal-workflow-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create advisor review queue/detail surfaces. | Do not set clientVisible or release state. | pnpm playwright test tests/workflow-gate.spec.ts | Advisor approval only advances to compliance pending. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 3 | UX-ROUTE-EVO-003-T | Phase 1 | UX-ROUTE-EVO-003 | FLOW-004 | UX-ROUTE-EVO-003 | UX-SPLIT-003 | /compliance/:id/* → /compliance/reviews/:id/decision-room | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create compliance decision room route/surface. | No release without preconditions, evidence, audit. | pnpm playwright test tests/workflow-gate.spec.ts | Release/block surface is distinct from review and audit. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 4 | UX-ROUTE-EVO-004-T | Phase 1 | UX-ROUTE-EVO-004 | FLOW-002 | UX-ROUTE-EVO-004 | UX-SPLIT-002 | /documents/extraction-review; /documents/verification-pending → /documents/review-queue; /documents/:id/review | components/client-intake-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create document review queue/detail routes. | No upload-to-release shortcut. | pnpm playwright test tests/document-upload-api.spec.ts; pnpm playwright test tests/document-upload-flow.spec.ts | Documents flow distinguishes upload, review, verification, sufficiency. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 5 | UX-ROUTE-EVO-005-T | Phase 1 | UX-ROUTE-EVO-005 | FLOW-002 | UX-ROUTE-EVO-005 | UX-SPLIT-002 | /evidence/:id → /evidence/:id/review; /evidence/:id/links | components/decisions-governance-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create evidence review and linkage routes/surfaces. | Do not expose evidence raw data to client projection without release. | pnpm playwright test tests/permission-engine.spec.ts | Evidence detail can prove/deny sufficiency and show next recovery. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 6 | UX-ROUTE-EVO-006-T | Phase 1 | UX-ROUTE-EVO-006 | FLOW-010 | UX-ROUTE-EVO-006 | UX-SPLIT-007 | /portal; /mobile → /client/home; /client/releases; /client/evidence-requests; /client/decisions/:id | components/client-intake-screen.tsx; lib/visibility-engine.ts; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create client projection route surfaces. | No internal draft, analyst notes, compliance notes, unreleased evidence. | pnpm playwright test tests/permission-engine.spec.ts | Client can only access released/redacted content and evidence requests. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 7 | UX-ROUTE-EVO-007-T | Phase 1 | UX-ROUTE-EVO-007 | FLOW-005 | UX-ROUTE-EVO-007 | UX-SPLIT-005 | /export/:id/preview → /export/:id/approval | components/communication-export-ops-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Add export approval step route and surface. | No package generation/download from preview. | pnpm playwright test tests/file-export-realism.spec.ts | Export approval is explicit and audited before download/share. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 8 | UX-ROUTE-EVO-008-T | Phase 1 | UX-ROUTE-EVO-008 | FLOW-006 | UX-ROUTE-EVO-008 | UX-SPLIT-006 | /governance/* + admin roles/security → /governance; /governance/access-requests/:id; /governance/roles/:id | components/decisions-governance-screen.tsx; components/admin-tenant-setup-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create governance hub/detail routes and merge duplicated access contexts. | No role change expands payload/release authority. | pnpm playwright test tests/permission-engine.spec.ts | Governance changes are reviewable, scoped, audited and non-bypass. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 9 | UX-ROUTE-EVO-009-T | Phase 1 | UX-ROUTE-EVO-009 | FLOW-007 | UX-ROUTE-EVO-011; 012 | UX-SPLIT-009 | /kyc/:id/*; /suitability/:tenantId/profile; /ips/:tenantId → /kyc/reviews; /kyc/:id/review; /ips/:tenantId/decision-room | components/kyc-aml-workflow-screen.tsx; components/suitability-ips-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create elevated KYC/Suitability review and decision room surfaces. | No client-visible risk notes unless released; no suitability advice bypass. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | KYC/Suitability flow has queue, review, decision room and blocked recovery. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 10 | UX-ROUTE-EVO-010-T | Phase 1 | UX-ROUTE-EVO-010 | FLOW-008 | UX-ROUTE-EVO-013 | UX-SPLIT-010 | /committee/reviews/:id → /committee/reviews/:id/decision-room; /committee/reviews/:id/vote | components/committee-review-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Split committee queue/detail/vote/decision room. | No committee vote releases to client or compliance bypass. | pnpm playwright test tests/committee-review-routes.spec.ts | Committee decision becomes internal governance evidence only. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 11 | UX-ROUTE-EVO-011-T | Phase 1 | UX-ROUTE-EVO-011 | FLOW-009 | UX-ROUTE-EVO-014; 015 | UX-SPLIT-011 | /reviews/calendar; /monitoring/rebalance → /reviews; /reviews/:id; /monitoring/rebalance/:id/review | components/review-monitoring-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create review hub and rebalance review detail. | No auto rebalance instruction or client release. | pnpm playwright test tests/review-monitoring-service.spec.ts | Monitoring creates internal review work only. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 12 | UX-ROUTE-EVO-012-T | Phase 1 | UX-ROUTE-EVO-012 | FLOW-011; FLOW-012 | UX-ROUTE-EVO-016; 017 | UX-SPLIT-012 | /communication; /ops/queues; /ops/sla → /communication/:id/context; /ops; /ops/sla/:id | components/communication-export-ops-screen.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create context/detail support routes for communication and ops. | No direct release, advice execution, or evidence sufficiency changes. | pnpm playwright test tests/permission-engine.spec.ts | Support flows clarify context/recovery without acting as decision gate. | route-smoke + flow screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 13 | UX-IA-001 | Phase 2 | UX-IA | FLOW-001; FLOW-003; FLOW-006 | UX-ROUTE-EVO-001; 008; 010; 014 | N/A | global; /family-office; /advisory; /governance; /client | components/app-shell.tsx; components/sidebar.tsx; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Create journey-first grouped navigation with role-aware visibility and hub-first labels. | No route reclassification without records; no reference/demo promotion. | pnpm lint; pnpm typecheck; pnpm playwright test tests/route-smoke.spec.ts | User sees flow-oriented nav, not 71-route list; reference pages are outside primary work nav. | navigation screenshot + route smoke | Stop on baseline/safety/test conflict or missing record/decision |
| 14 | UX-IA-002 | Phase 2 | UX-IA | FLOW-001; FLOW-010 | UX-ROUTE-EVO-006 | N/A | /client/home; /client/releases; internal flows | components/top-bar.tsx; components/page-header.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Show tenant, role, object context and visibility mode in topbar/page header. | No payload exposure via context labels; no manual visibility override. | pnpm lint; pnpm typecheck; pnpm playwright test tests/permission-engine.spec.ts | Every work surface shows who is acting, on which tenant/object, and whether output is internal or client-safe. | header/topbar screenshots + no-leakage assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 15 | UX-IA-003 | Phase 2 | UX-IA | FLOW-002; FLOW-004; FLOW-005 | UX-ROUTE-EVO-003; 004; 007 | N/A | /documents/:id/review; /compliance/reviews/:id/decision-room; /export/:id/approval | components/page-header.tsx; components/ui/*; lib/route-registry.ts | EXECUTE_AFTER_BASELINE_RECHECK | Add flow breadcrumb and next/previous navigation across queue → detail → decision room. | No skip links that bypass advisor/compliance/evidence/export gates. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Users can move back/cancel/recover without losing gate context; no gate bypass. | flow proof screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 16 | UX-IA-004 | Phase 2 | UX-IA | FLOW-007; FLOW-008; FLOW-009 | UX-ROUTE-EVO-011; 012; 013; 014; 015 | N/A | /kyc/reviews; /ips/:tenantId/decision-room; /committee/reviews; /reviews | components/sidebar.tsx; lib/route-registry.ts; components/page-header.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Integrate elevated KYC, suitability, committee and review monitoring surfaces into MVP navigation under controlled internal workspaces. | Do not make elevated routes client-facing by default; no auto-advice labels. | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/route-smoke.spec.ts | Former P1/Hold flows are accessible to correct internal roles and absent from client nav. | role-aware nav proof | Stop on baseline/safety/test conflict or missing record/decision |
| 17 | UX-IA-005 | Phase 2 | UX-IA | FLOW-011; FLOW-012 | UX-ROUTE-EVO-016; 017 | N/A | /communication; /ops | components/sidebar.tsx; components/communication-export-ops-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Add Communication and Ops as context/support workspaces, not release/advice shortcuts. | No client advice generation or compliance bypass. | pnpm playwright test tests/permission-engine.spec.ts | Communication and Ops support flows without being mistaken for advisory decision surfaces. | nav screenshots + role proof | Stop on baseline/safety/test conflict or missing record/decision |
| 18 | UX-HUB-001 | Phase 3 | UX-HUB | FLOW-001 | UX-ROUTE-EVO-010; 018; 019 | N/A | /family-office | components/app-shell.tsx; components/page-header.tsx; components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 19 | UX-HUB-002 | Phase 3 | UX-HUB | FLOW-003 | UX-ROUTE-EVO-001 | N/A | /advisory | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 20 | UX-HUB-003 | Phase 3 | UX-HUB | FLOW-002 | UX-ROUTE-EVO-004; 005 | N/A | /evidence | components/client-intake-screen.tsx; components/decisions-governance-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 21 | UX-HUB-004 | Phase 3 | UX-HUB | FLOW-004 | UX-ROUTE-EVO-002; 003 | N/A | /approval or /compliance | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 22 | UX-HUB-005 | Phase 3 | UX-HUB | FLOW-005 | UX-ROUTE-EVO-007 | N/A | /export | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 23 | UX-HUB-006 | Phase 3 | UX-HUB | FLOW-006 | UX-ROUTE-EVO-008; 009; 020 | N/A | /governance | components/decisions-governance-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 24 | UX-HUB-007 | Phase 3 | UX-HUB | FLOW-007; FLOW-008; FLOW-009 | UX-ROUTE-EVO-011; 013; 014 | N/A | /kyc; /committee; /reviews | components/kyc-aml-workflow-screen.tsx; components/committee-review-screen.tsx; components/review-monitoring-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor hub surface with summary, prioritized queues, next-step cards, and no full workflow execution. | Hub must not become all-in-one monster screen or hide safety blockers. | pnpm playwright test tests/route-smoke.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Hub orients user and routes them to workbench/detail in <=2 steps. | hub screenshots + navigation proof | Stop on baseline/safety/test conflict or missing record/decision |
| 25 | UX-WORKBENCH-001 | Phase 4 | UX-WORKBENCH | FLOW-003 | UX-ROUTE-EVO-001 | UX-SPLIT-001 | /advisory/triggers/:id/review | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 26 | UX-WORKBENCH-002 | Phase 4 | UX-WORKBENCH | FLOW-002 | UX-ROUTE-EVO-004 | UX-SPLIT-002 | /documents/:id/review | components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 27 | UX-WORKBENCH-003 | Phase 4 | UX-WORKBENCH | FLOW-004 | UX-ROUTE-EVO-002 | UX-SPLIT-004 | /advisor/reviews/:id | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 28 | UX-WORKBENCH-004 | Phase 4 | UX-WORKBENCH | FLOW-006 | UX-ROUTE-EVO-008 | UX-SPLIT-006 | /governance/access-requests/:id | components/decisions-governance-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 29 | UX-WORKBENCH-005 | Phase 4 | UX-WORKBENCH | FLOW-009 | UX-ROUTE-EVO-015 | UX-SPLIT-011 | /monitoring/rebalance/:id/review | components/review-monitoring-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 30 | UX-WORKBENCH-006 | Phase 4 | UX-WORKBENCH | FLOW-012 | UX-ROUTE-EVO-017 | UX-SPLIT-012 | /ops/sla/:id | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement queue + active context + action rail workbench pattern. | No hidden release/export/visibility state changes; no fake buttons. | pnpm playwright test tests/workflow-gate.spec.ts | Workbench has one active task, one primary CTA per state, and explicit blockers. | workbench screenshot + flow proof | Stop on baseline/safety/test conflict or missing record/decision |
| 31 | UX-DETAIL-001 | Phase 5 | UX-DETAIL | FLOW-002 | UX-ROUTE-EVO-005 | UX-SPLIT-002 | /evidence/:id/review | components/decisions-governance-screen.tsx; components/ui/evidence-list.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 32 | UX-DETAIL-002 | Phase 5 | UX-DETAIL | FLOW-001 | UX-ROUTE-EVO-018 | UX-SPLIT-007 | /client/context; /entities/:id | components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 33 | UX-DETAIL-003 | Phase 5 | UX-DETAIL | FLOW-003 | UX-ROUTE-EVO-001 | UX-SPLIT-001 | /advisory/triggers/:id/review | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 34 | UX-DETAIL-004 | Phase 5 | UX-DETAIL | FLOW-005 | UX-ROUTE-EVO-007 | UX-SPLIT-005 | /export/:id/redaction; /export/:id/preview | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 35 | UX-DETAIL-005 | Phase 5 | UX-DETAIL | FLOW-006 | UX-ROUTE-EVO-020 | UX-SPLIT-006 | /audit/:id | components/decisions-governance-screen.tsx; components/ui/audit-timeline.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 36 | UX-DETAIL-006 | Phase 5 | UX-DETAIL | FLOW-011 | UX-ROUTE-EVO-016 | UX-SPLIT-012 | /communication/:id/context | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Create/refactor detail surfaces for object understanding and decision support. | No destructive/safety decision hidden in drawer-only context. | pnpm playwright test tests/permission-engine.spec.ts | Detail surface explains object state and supports next action without overloading hub/workbench. | detail screenshots + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 37 | UX-PAGE-SPLIT-001 | Phase 5 | UX-PAGE-SPLIT | FLOW-003 | UX-ROUTE-EVO-001 | UX-SPLIT-001 | /signals + /workbench → /advisory; /advisory/review-queue; /advisory/triggers/:id/review | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 38 | UX-PAGE-SPLIT-002 | Phase 5 | UX-PAGE-SPLIT | FLOW-002 | UX-ROUTE-EVO-004; 005 | UX-SPLIT-002 | /documents + /evidence → /documents/review-queue; /documents/:id/review; /evidence/:id/review | components/client-intake-screen.tsx; components/decisions-governance-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 39 | UX-PAGE-SPLIT-003 | Phase 5 | UX-PAGE-SPLIT | FLOW-004 | UX-ROUTE-EVO-003 | UX-SPLIT-003 | /compliance cluster → /compliance; /compliance/reviews/:id; /compliance/reviews/:id/decision-room | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 40 | UX-PAGE-SPLIT-004 | Phase 5 | UX-PAGE-SPLIT | FLOW-004 | UX-ROUTE-EVO-002 | UX-SPLIT-004 | /advisor-approval → /advisor/reviews; /advisor/reviews/:id | components/internal-workflow-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 41 | UX-PAGE-SPLIT-005 | Phase 5 | UX-PAGE-SPLIT | FLOW-005 | UX-ROUTE-EVO-007 | UX-SPLIT-005 | /export flow → /export; /export/:id/scope; /redaction; /preview; /approval; /download | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 42 | UX-PAGE-SPLIT-006 | Phase 5 | UX-PAGE-SPLIT | FLOW-006 | UX-ROUTE-EVO-008; 020 | UX-SPLIT-006 | /governance + /audit → /governance; /governance/access-requests/:id; /audit/:id | components/decisions-governance-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 43 | UX-PAGE-SPLIT-007 | Phase 5 | UX-PAGE-SPLIT | FLOW-010 | UX-ROUTE-EVO-006 | UX-SPLIT-007 | /portal + /mobile → /client/home; /client/releases; /client/evidence-requests; /client/decisions/:id | components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 44 | UX-PAGE-SPLIT-008 | Phase 5 | UX-PAGE-SPLIT | FLOW-007; FLOW-008; FLOW-009 | UX-ROUTE-EVO-011; 012; 013; 014; 015 | UX-SPLIT-009; 010; 011 | KYC/Suitability/Committee/Review routes → Review hubs, queues, details and decision rooms | components/kyc-aml-workflow-screen.tsx; components/suitability-ips-screen.tsx; components/committee-review-screen.tsx; components/review-monitoring-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Implement selected split option after baseline check; move content by page job. | Do not split away required safety/evidence/audit context; no route deletion without proof. | pnpm playwright test tests/route-smoke.spec.ts | New surfaces have one page job each and no longer mix hub/queue/detail/decision room responsibilities. | before/after screenshot proof + flow path | Stop on baseline/safety/test conflict or missing record/decision |
| 45 | UX-DECISION-ROOM-001 | Phase 6 | UX-DECISION-ROOM | FLOW-004 | UX-ROUTE-EVO-003 | UX-SPLIT-003 | /compliance/reviews/:id/decision-room | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor safety-critical decision surface with preconditions, evidence, audit, blocker, confirm/cancel. | No release/export/advice effect without gate preconditions and audit. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Decision room makes gate status and consequences clear and prevents unsafe progression. | decision room screenshot + P0 negative proof | Stop on baseline/safety/test conflict or missing record/decision |
| 46 | UX-DECISION-ROOM-002 | Phase 6 | UX-DECISION-ROOM | FLOW-005 | UX-ROUTE-EVO-007 | UX-SPLIT-005 | /export/:id/approval | components/communication-export-ops-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor safety-critical decision surface with preconditions, evidence, audit, blocker, confirm/cancel. | No release/export/advice effect without gate preconditions and audit. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Decision room makes gate status and consequences clear and prevents unsafe progression. | decision room screenshot + P0 negative proof | Stop on baseline/safety/test conflict or missing record/decision |
| 47 | UX-DECISION-ROOM-003 | Phase 6 | UX-DECISION-ROOM | FLOW-007 | UX-ROUTE-EVO-012 | UX-SPLIT-009 | /ips/:tenantId/decision-room | components/suitability-ips-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor safety-critical decision surface with preconditions, evidence, audit, blocker, confirm/cancel. | No release/export/advice effect without gate preconditions and audit. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Decision room makes gate status and consequences clear and prevents unsafe progression. | decision room screenshot + P0 negative proof | Stop on baseline/safety/test conflict or missing record/decision |
| 48 | UX-DECISION-ROOM-004 | Phase 6 | UX-DECISION-ROOM | FLOW-008 | UX-ROUTE-EVO-013 | UX-SPLIT-010 | /committee/reviews/:id/decision-room | components/committee-review-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor safety-critical decision surface with preconditions, evidence, audit, blocker, confirm/cancel. | No release/export/advice effect without gate preconditions and audit. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Decision room makes gate status and consequences clear and prevents unsafe progression. | decision room screenshot + P0 negative proof | Stop on baseline/safety/test conflict or missing record/decision |
| 49 | UX-DECISION-ROOM-005 | Phase 6 | UX-DECISION-ROOM | FLOW-009 | UX-ROUTE-EVO-015 | UX-SPLIT-011 | /monitoring/rebalance/:id/review | components/review-monitoring-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor safety-critical decision surface with preconditions, evidence, audit, blocker, confirm/cancel. | No release/export/advice effect without gate preconditions and audit. | pnpm playwright test tests/workflow-gate.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Decision room makes gate status and consequences clear and prevents unsafe progression. | decision room screenshot + P0 negative proof | Stop on baseline/safety/test conflict or missing record/decision |
| 50 | UX-CLIENT-PROJECTION-001 | Phase 7 | UX-CLIENT-PROJECTION | FLOW-010 | UX-ROUTE-EVO-006 | UX-SPLIT-007 | /client/home | components/client-intake-screen.tsx; lib/visibility-engine.ts | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor client projection using visibility engine output and fail-closed states. | No internal payload, no manual override, no unreleased evidence or AI draft. | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/true-ux-client-projection.spec.ts | Client projection leaks no internal data and explains unavailable content safely. | client no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 51 | UX-CLIENT-PROJECTION-002 | Phase 7 | UX-CLIENT-PROJECTION | FLOW-010 | UX-ROUTE-EVO-006 | UX-SPLIT-007 | /client/releases; /client/decisions/:id | components/client-intake-screen.tsx; components/decisions-governance-screen.tsx; lib/visibility-engine.ts | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor client projection using visibility engine output and fail-closed states. | No internal payload, no manual override, no unreleased evidence or AI draft. | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/true-ux-client-projection.spec.ts | Client projection leaks no internal data and explains unavailable content safely. | client no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 52 | UX-CLIENT-PROJECTION-003 | Phase 7 | UX-CLIENT-PROJECTION | FLOW-002 | UX-ROUTE-EVO-006; 004 | UX-SPLIT-002; 007 | /client/evidence-requests | components/client-intake-screen.tsx | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor client projection using visibility engine output and fail-closed states. | No internal payload, no manual override, no unreleased evidence or AI draft. | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/true-ux-client-projection.spec.ts | Client projection leaks no internal data and explains unavailable content safely. | client no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 53 | UX-CLIENT-PROJECTION-004 | Phase 7 | UX-CLIENT-PROJECTION | FLOW-005 | UX-ROUTE-EVO-007 | UX-SPLIT-005 | /export/:id/download client-safe package | components/communication-export-ops-screen.tsx; lib/visibility-engine.ts | EXECUTE_AFTER_SAFETY_RECHECK | Create/refactor client projection using visibility engine output and fail-closed states. | No internal payload, no manual override, no unreleased evidence or AI draft. | pnpm playwright test tests/permission-engine.spec.ts; pnpm playwright test tests/true-ux-client-projection.spec.ts | Client projection leaks no internal data and explains unavailable content safely. | client no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 54 | UX-CTA-STATE-001 | Phase 8 | UX-CTA-STATE | FLOW-002 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /documents/upload; /documents/:id/review; /evidence/:id/review | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Upload success confirms transfer only; review/linked/sufficient is separate. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 55 | UX-CTA-STATE-002 | Phase 8 | UX-CTA-STATE | FLOW-003 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /advisory/triggers/:id/review | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; No CTA sends draft to client. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 56 | UX-CTA-STATE-003 | Phase 8 | UX-CTA-STATE | FLOW-004 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /advisor/reviews/:id; /compliance/reviews/:id/decision-room | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Approval and release language remains distinct. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 57 | UX-CTA-STATE-004 | Phase 8 | UX-CTA-STATE | FLOW-005 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /export/:id/preview; /export/:id/approval; /export/:id/download | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Preview never generates/downloads package. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 58 | UX-CTA-STATE-005 | Phase 8 | UX-CTA-STATE | FLOW-006 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /governance/access-requests/:id; /governance/roles/:id | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Role/access CTA does not expand payload/release gates. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 59 | UX-CTA-STATE-006 | Phase 8 | UX-CTA-STATE | FLOW-007; FLOW-008 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /kyc/:id/review; /ips/:tenantId/decision-room; /committee/reviews/:id/decision-room | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Committee/KYC acts as internal gate evidence, not release. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 60 | UX-CTA-STATE-007 | Phase 8 | UX-CTA-STATE | FLOW-010 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /client/home; /client/evidence-requests; /client/decisions/:id | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Client CTA cannot expose internal data or imply advice execution. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 61 | UX-CTA-STATE-008 | Phase 8 | UX-CTA-STATE | FLOW-009; FLOW-011; FLOW-012 | N/A_WITH_REASON: CTA/state task uses flow model | N/A_WITH_REASON: no structural split by itself | /reviews/:id; /communication/:id/context; /ops/sla/:id | components/page-header.tsx; components/ui/state-panel.tsx; relevant route components | EXECUTE_AFTER_SAFETY_RECHECK | Implement one-primary-CTA model with disabled/blocked/recovery text. | No success overclaim; no safety gate language collapse. | pnpm playwright test tests/workflow-gate.spec.ts | Exactly one primary CTA appears per state and blocked states explain cause/recovery; Operational CTA supports internal work only. | CTA screenshots + text assertions | Stop on baseline/safety/test conflict or missing record/decision |
| 62 | UX-DENSITY-001 | Phase 9 | UX-DENSITY | FLOW-001; FLOW-010 | N/A_WITH_REASON: density system task | N/A_WITH_REASON: layout pattern | /family-office; /client/home; /client/releases | components/ui/*; components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Apply density tier rules: summary strip, table/card/detail hierarchy, above-the-fold status/job/CTA. | Do not compress away safety, blocker, evidence, audit or recovery context. | pnpm lint; pnpm typecheck | Above the fold shows page job, status and next step; no empty premium space or chaotic card wall. | density screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 63 | UX-DENSITY-002 | Phase 9 | UX-DENSITY | FLOW-002; FLOW-003; FLOW-004 | N/A_WITH_REASON: density system task | N/A_WITH_REASON: layout pattern | /advisory/*; /documents/:id/review; /advisor/reviews/:id; /compliance/* | components/ui/*; components/internal-workflow-screen.tsx; components/client-intake-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Apply density tier rules: summary strip, table/card/detail hierarchy, above-the-fold status/job/CTA. | Do not compress away safety, blocker, evidence, audit or recovery context. | pnpm lint; pnpm typecheck | Above the fold shows page job, status and next step; no empty premium space or chaotic card wall. | density screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 64 | UX-DENSITY-003 | Phase 9 | UX-DENSITY | FLOW-006; FLOW-009; FLOW-012 | N/A_WITH_REASON: density system task | N/A_WITH_REASON: layout pattern | /governance; /reviews; /ops | components/ui/data-table.tsx; components/decisions-governance-screen.tsx; components/communication-export-ops-screen.tsx | EXECUTE_AFTER_BASELINE_RECHECK | Apply density tier rules: summary strip, table/card/detail hierarchy, above-the-fold status/job/CTA. | Do not compress away safety, blocker, evidence, audit or recovery context. | pnpm lint; pnpm typecheck | Above the fold shows page job, status and next step; no empty premium space or chaotic card wall. | density screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 65 | UX-DENSITY-004 | Phase 9 | UX-DENSITY | FLOW-005; FLOW-007; FLOW-008 | N/A_WITH_REASON: density system task | N/A_WITH_REASON: layout pattern | /export/:id/approval; /ips/:tenantId/decision-room; /committee/reviews/:id/decision-room | components/ui/*; decision room components | EXECUTE_AFTER_BASELINE_RECHECK | Apply density tier rules: summary strip, table/card/detail hierarchy, above-the-fold status/job/CTA. | Do not compress away safety, blocker, evidence, audit or recovery context. | pnpm lint; pnpm typecheck | Above the fold shows page job, status and next step; no empty premium space or chaotic card wall. | density screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 66 | UX-A11Y-001 | Phase 10 | UX-A11Y | FLOW-004; FLOW-005; FLOW-007; FLOW-008 | N/A_WITH_REASON: a11y cross-cutting | N/A_WITH_REASON: no route split | Decision rooms and confirmations | components/ui/drawer.tsx; components/ui/modal.tsx; components/page-header.tsx; components/ui/* | EXECUTE_AFTER_BASELINE_RECHECK | Add focus, keyboard, ARIA and status-announcement requirements to affected surfaces. | No inaccessible modal/drawer/decision state; no trap without escape/cancel. | pnpm playwright test tests/true-ux-a11y.spec.ts | Keyboard-only user can complete or recover from each critical state without losing context. | keyboard proof + screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 67 | UX-A11Y-002 | Phase 10 | UX-A11Y | FLOW-002; FLOW-003; FLOW-006 | N/A_WITH_REASON: a11y cross-cutting | N/A_WITH_REASON: no route split | Queues and workbenches | components/ui/drawer.tsx; components/ui/modal.tsx; components/page-header.tsx; components/ui/* | EXECUTE_AFTER_BASELINE_RECHECK | Add focus, keyboard, ARIA and status-announcement requirements to affected surfaces. | No inaccessible modal/drawer/decision state; no trap without escape/cancel. | pnpm playwright test tests/true-ux-a11y.spec.ts | Keyboard-only user can complete or recover from each critical state without losing context. | keyboard proof + screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 68 | UX-A11Y-003 | Phase 10 | UX-A11Y | FLOW-010 | N/A_WITH_REASON: a11y cross-cutting | N/A_WITH_REASON: no route split | Client projection and evidence upload | components/ui/drawer.tsx; components/ui/modal.tsx; components/page-header.tsx; components/ui/* | EXECUTE_AFTER_BASELINE_RECHECK | Add focus, keyboard, ARIA and status-announcement requirements to affected surfaces. | No inaccessible modal/drawer/decision state; no trap without escape/cancel. | pnpm playwright test tests/true-ux-a11y.spec.ts | Keyboard-only user can complete or recover from each critical state without losing context. | keyboard proof + screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 69 | UX-A11Y-004 | Phase 10 | UX-A11Y | all flows | N/A_WITH_REASON: a11y cross-cutting | N/A_WITH_REASON: no route split | Global navigation and breadcrumbs | components/ui/drawer.tsx; components/ui/modal.tsx; components/page-header.tsx; components/ui/* | EXECUTE_AFTER_BASELINE_RECHECK | Add focus, keyboard, ARIA and status-announcement requirements to affected surfaces. | No inaccessible modal/drawer/decision state; no trap without escape/cancel. | pnpm playwright test tests/true-ux-a11y.spec.ts | Keyboard-only user can complete or recover from each critical state without losing context. | keyboard proof + screenshots | Stop on baseline/safety/test conflict or missing record/decision |
| 70 | UX-P0-SAFETY-001 | Phase 11 | UX-P0-SAFETY | FLOW-003; FLOW-010 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /advisory/*; /client/*; /export/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/true-ux-client-projection.spec.ts; pnpm playwright test tests/file-export-realism.spec.ts | Negative tests prove: AI Draft not rendered to client or export package | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 71 | UX-P0-SAFETY-002 | Phase 11 | UX-P0-SAFETY | FLOW-010 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /client/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/true-ux-client-projection.spec.ts; pnpm playwright test tests/permission-engine.spec.ts | Negative tests prove: Unreleased/internal content hidden/redacted/empty | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 72 | UX-P0-SAFETY-003 | Phase 11 | UX-P0-SAFETY | FLOW-004 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /advisor/reviews/:id; /client/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/workflow-gate.spec.ts | Negative tests prove: Advisor-approved item not client-visible until compliance release | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 73 | UX-P0-SAFETY-004 | Phase 11 | UX-P0-SAFETY | FLOW-002 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /documents/upload; /evidence/:id/review; /compliance/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/document-upload-api.spec.ts; pnpm playwright test tests/document-upload-flow.spec.ts | Negative tests prove: Upload success does not unlock release/export/client visibility | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 74 | UX-P0-SAFETY-005 | Phase 11 | UX-P0-SAFETY | FLOW-005 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /export/:id/preview; /export/:id/approval; /export/:id/download | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/file-export-realism.spec.ts | Negative tests prove: Preview cannot generate/download/share package | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 75 | UX-P0-SAFETY-006 | Phase 11 | UX-P0-SAFETY | FLOW-006 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /governance/*; /platform/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/permission-engine.spec.ts | Negative tests prove: Admin cannot force release/evidence/export/payload visibility | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 76 | UX-P0-SAFETY-007 | Phase 11 | UX-P0-SAFETY | FLOW-007; FLOW-008; FLOW-009 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /kyc/*; /ips/*; /committee/*; /monitoring/rebalance/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/workflow-gate.spec.ts; pnpm playwright test tests/review-monitoring-service.spec.ts; pnpm playwright test tests/committee-review-routes.spec.ts | Negative tests prove: Elevated routes stay internal, audited and non-release by default | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |
| 77 | UX-P0-SAFETY-008 | Phase 11 | UX-P0-SAFETY | FLOW-004; FLOW-005; FLOW-006 | N/A_WITH_REASON: safety proof task | N/A_WITH_REASON: safety test task | /compliance/*; /export/*; /governance/* | tests/*; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | EXECUTE_AFTER_SAFETY_RECHECK | Add/update positive and negative P0 tests and supporting assertions. | Do not weaken implementation to pass tests; no policy invention outside contracts. | pnpm test; pnpm playwright test; tests/permission-engine.spec.ts; pnpm playwright test tests/workflow-gate.spec.ts | Negative tests prove: Gate action fails/blocks if audit cannot be written/confirmed | test report + no-leakage proof | Stop on baseline/safety/test conflict or missing record/decision |

## 22. Allowed Target Files / Components

| Target Area | Files / Components | Allowed Use | Validation |
| --- | --- | --- | --- |
| components/app-shell.tsx | components/app-shell.tsx | IA, app shell, role-aware navigation, topbar/page header context. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/sidebar.tsx | components/sidebar.tsx | IA, app shell, role-aware navigation, topbar/page header context. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/top-bar.tsx | components/top-bar.tsx | IA, app shell, role-aware navigation, topbar/page header context. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/page-header.tsx | components/page-header.tsx | IA, app shell, role-aware navigation, topbar/page header context. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/auth-onboarding-screen.tsx | components/auth-onboarding-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/admin-tenant-setup-screen.tsx | components/admin-tenant-setup-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/client-intake-screen.tsx | components/client-intake-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/internal-workflow-screen.tsx | components/internal-workflow-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/decisions-governance-screen.tsx | components/decisions-governance-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/communication-export-ops-screen.tsx | components/communication-export-ops-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/wealth-actions-screen.tsx | components/wealth-actions-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/kyc-aml-workflow-screen.tsx | components/kyc-aml-workflow-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/suitability-ips-screen.tsx | components/suitability-ips-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/review-monitoring-screen.tsx | components/review-monitoring-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/committee-review-screen.tsx | components/committee-review-screen.tsx | Route-specific screen/component refactoring under task scope. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| components/ui/* | components/ui/* | Shared layout, drawer, modal, state, table, card, focus and status primitives. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| lib/route-registry.ts | lib/route-registry.ts | Route registration for approved route evolution records only. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| lib/visual-contract.ts | lib/visual-contract.ts | Route visual/state metadata alignment; no image generation. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| lib/permission-engine.ts | lib/permission-engine.ts | Safety enforcement alignment only with required P0 tests. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| lib/visibility-engine.ts | lib/visibility-engine.ts | Safety enforcement alignment only with required P0 tests. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| lib/workflow-gate.ts | lib/workflow-gate.ts | Safety enforcement alignment only with required P0 tests. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |
| tests/* | tests/* | Add/update route-smoke, flow, a11y, RBAC, no-leakage and P0 negative tests. | `VERIFY_BEFORE_EDIT`; relevant phase acceptance and test proof required |

## 23. Restricted / Conditional Files

| File / Area | Restriction | Allowed Only If | Stop Rule |
| --- | --- | --- | --- |
| `prisma/schema.prisma` and migrations | No blind schema replacement or migration work. | Explicit task and schema reconciliation require it; otherwise no change. | Stop if task implies schema replacement without locked record. |
| API routes under `app/api/*` | Do not create or change APIs as UX side effect. | Explicit task requires API contract alignment and safety tests. | Stop if route/screen task needs new API decision. |
| `lib/permission-engine.ts` | Safety-critical. | P0/RBAC task requires it and negative tests are defined. | Stop if change weakens denial or admin non-bypass. |
| `lib/visibility-engine.ts` | Safety-critical. | Client projection or no-leakage task requires it and tests are defined. | Stop if change broadens client visibility. |
| `lib/workflow-gate.ts` | Safety-critical. | Decision room / approval / compliance task requires it and tests are defined. | Stop if advisor approval becomes release or upload becomes sufficiency. |
| Public/reference images/assets | No automatic generation or replacement. | Only metadata/path alignment if explicitly needed and no visual generation occurs. | Stop if image/screen/state-screen generation is requested. |
| `main` branch/files | Never target truth. | Never. | Stop if task references `main` as implementation source. |

## 24. Forbidden Changes Register

| Forbidden Change | Why Forbidden | Applies To | Codex Enforcement |
| --- | --- | --- | --- |
| No implementation before preflight | Preflight protects moving baseline | All phases | Codex must start with Phase 0 and report outputs. |
| No new route without Route Evolution Record | Prevents free route invention | UX-ROUTE-EVO | Stop if record missing. |
| No screen split without Screen Split Decision | Prevents uncontrolled page fragmentation | UX-PAGE-SPLIT / screen refactor | Stop if split decision missing. |
| No client projection without no-leakage tests | Client visibility must fail closed | UX-CLIENT-PROJECTION | Require negative tests. |
| No decision room without audit/safety tests | Safety-critical decisions need proof | UX-DECISION-ROOM | Require workflow/audit tests. |
| No screen/image/state-screen generation | This is code refactoring, not asset generation | All visual work | Report no-generation confirmation. |
| No avoidable UI shortcut instead of feasible refactor | True UX work must change the real product surface when the repo and active boundaries permit it | All UI/UX, navigation, shell, density, state, component and route work | Require inspected real-refactor path, blocker proof for any substitute, and follow-up task if a substitute is intentionally scoped. |
| No client-visible AI Draft | AI/rules draft is internal-only | Advisory/client/export | Require no-leakage proof. |
| No unapproved advice | Product/safety hard rule | Client projection/advisory/export | Stop on leakage or release shortcut. |
| No admin bypass | Governance cannot override gates | Governance/RBAC | Require admin negative tests. |
| No manual visibility override | Visibility is derived/fail-closed | Client projection | Stop if manual override introduced. |
| No upload-to-release shortcut | Upload success is not evidence sufficiency | Evidence/document flows | Require upload-not-sufficiency test. |
| No export preview as approval/download | Preview is not approval/share/download | Export flow | Require export negative tests. |
| No advisor approval as compliance release | Advisor and compliance gates are separate | Advisor/compliance flows | Require workflow-gate negative test. |
| No compliance release as client acceptance | Release is not client action/acceptance | Client projection | Use no-overclaim feedback. |
| No blind schema replacement | Schema baseline remains controlled | Schema/API changes | Stop if not explicitly authorized. |
| No `main` target truth | `full-workflow` is target | All work | Stop if `main` is used as source. |

## 25. Validation Commands

Codex must verify scripts against `package.json` first. If scripts differ, adapt commands and report the adapted command set.

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm playwright test
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/permission-engine.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
pnpm playwright test tests/true-ux-flow-navigation.spec.ts
pnpm playwright test tests/true-ux-client-projection.spec.ts
pnpm playwright test tests/true-ux-route-evolution.spec.ts
pnpm playwright test tests/true-ux-decision-room.spec.ts
pnpm playwright test tests/true-ux-a11y.spec.ts
```

## 26. Required Proofs

| Proof Type | Required For | Evidence |
| --- | --- | --- |
| Route-smoke proof | New/changed routes | Playwright route smoke output. |
| Navigation proof | IA/sidebar/topbar/header | Screenshot or scripted click path. |
| Flow proof | FLOW-001 through FLOW-012 where implemented | Playwright flow or scripted proof summary. |
| No-leakage proof | Client projections and exports | Negative test output proving forbidden payloads absent. |
| RBAC proof | Role-restricted surfaces and elevated former P1/Hold routes | Permission tests and role-based route assertions. |
| Decision-room proof | Advisor/compliance/export/committee/KYC decision rooms | Workflow/audit/safety tests. |
| Upload-not-sufficiency proof | Evidence upload/review flow | Negative test showing upload success does not unlock release/export/client visibility. |
| Export-preview-not-approval proof | Export flow | Negative test showing preview cannot download/share/approve. |
| Accessibility proof | Drawers/modals/forms/navigation | Keyboard/focus/ARIA/status proof. |
| Refactor-first proof | Any UI/UX task where a smaller substitute is tempting or used | Report the real component/layout/route/state/shared-system path inspected, why it was implemented or why it was blocked, and the follow-up task for any temporary substitute. |
| No-generation proof | Visual assets and state screens | File/report confirmation that no images/screens/state-screen assets were generated. |

## 27. Reporting Requirements

Codex final report must include:

- branch and commit used
- preflight command output summary
- changed files
- created routes
- updated routes
- route redirects/deprecations
- created/refactored components
- implemented task IDs
- skipped task IDs with reason
- blocked task IDs with blocker
- tests run
- tests passed/failed
- screenshots/proofs captured
- route-smoke proof
- flow proof
- no-leakage proof
- accessibility proof
- refactor-first proof and any shortcut/substitute blocker
- P0 negative tests added/updated
- route policy deviations
- no-screen-generation confirmation
- no-state-screen-generation confirmation
- no-image-generation confirmation
- no-safety-regression confirmation

## 28. Stop Rules

- Preflight cannot confirm current branch/baseline.
- Target branch is not intended branch.
- Unrelated working tree changes conflict with tasks.
- Task lacks Flow ID and source record.
- Route creation lacks Route Evolution Record.
- Screen split lacks Screen Split Decision.
- Client projection lacks no-leakage proof.
- Decision room lacks safety/audit test plan.
- Implementation would expose AI Draft/internal rationale/compliance notes to client.
- Implementation would treat advisor approval as release.
- Implementation would treat upload success as evidence sufficiency.
- Implementation would allow admin bypass.
- Implementation would require blind schema replacement.
- Codex needs a new product/safety decision not in the handoff.
- Any P0 safety negative test fails.

## 29. Final Codex Start Command

```text
You are implementing ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md.
Follow the handoff exactly.
Start with Phase 0 Preflight.
Do not modify code before preflight passes.
Use only full-workflow as target.
Execute only tasks marked EXECUTE_NOW or allowed after required recheck.
Stop and report on any safety, baseline, route-record, screen-split, or test-blocking conflict.
Do not generate images, state-screen assets, or screen assets.
Do not use main as target truth.
Report changed files, tasks implemented, tests run, proofs, blockers, and no-safety-regression confirmation.
```

## 30. Decision Summary for the User

This handoff is the first artefact in the True-UX chain that authorizes Codex implementation. It does so only with strict preflight, ordered phases, target-file boundaries, route/split records, safety tests, validation commands and reporting obligations. Codex may build the new UX route/surface architecture, but it may not make product or safety decisions, skip baseline checks, generate image/screen assets, use `main` as target truth, or weaken any advice/RBAC/client-visibility/evidence/export guardrail. Execution intake summary: 77 task-pack entries were mapped into phases 1–11. All tasks are conditional on Phase 0 preflight. Safety-sensitive tasks require explicit safety recheck and negative proof before or during execution.

## 31. ENGINE Proof / QA

### 31.1 ENGINE Selection Proof

| Need | Engine Used | Why |
| --- | --- | --- |
| Task Pack to executable handoff | ENGINE_v2-B + ENGINE_v3 | Codex needs order, file boundaries, execution statuses, validation and stop rules. |
| Moving baseline protection | ENGINE_v3 Evidence-first | Parallel refactoring may have changed routes/components/tests. |
| Safety in execution | ENGINE_v3 Adversarial / Proof | No task may weaken advice, RBAC, visibility, evidence, audit or export safety. |
| UX effect preservation | ENGINE_v2 UX / Psycho-Logic | The implementation must preserve orientation, status, trust, control and recovery. |
| Controlled Codex autonomy | ENGINE_v2-B | Codex can solve technical implementation details, not product/safety decisions. |
| Operational clarity | ENGINE_v2 Compression | The handoff is phase-based, table-driven and copy-paste ready. |

### 31.2 ENGINE_v3 Phase Proof

| Phase | Applied in Handoff | Proof |
| --- | --- | --- |
| Charter | Sections 1 and 29 define execution authority and final Codex start command. | The artefact is an executable handoff, not a plan. |
| Evidence | Sections 2–4 lock source hierarchy and mandatory preflight. | Current baseline must be checked before code changes. |
| Framing | Sections 5–7 frame Codex as constrained implementer. | Codex has implementation authority only inside task and safety boundaries. |
| Divergence | Execution statuses allow execute, conditional, blocked and deferred paths. | Not every task blindly executes. |
| Contradictions | Route creation and screen split are allowed only with records/tests. | True UX evolution is allowed without uncontrolled scope drift. |
| Branch Build | Phases 0–12 and Task Execution Matrix structure the work. | Codex receives an ordered implementation path. |
| Debate | Conditional/safety recheck statuses force selection before execution. | Safety and baseline conflicts stop work. |
| Adversarial | Stop Rules cover baseline, safety, route-record, split-decision and test failures. | Common dangerous failures are blocked. |
| Convergence | Required output and final start command are explicit. | The handoff is directly usable. |
| Proof | Validation commands, required proofs and reporting are mandatory. | Execution must produce evidence. |
| Learning | Reporting captures blockers, deviations and no-safety-regression status. | Future decisions remain auditable. |

### 31.3 ENGINE_v2 Method Proof

| Method | Applied Where | Result |
| --- | --- | --- |
| Psycho-Logic | Phase goals, CTA/state/recovery, client projection and decision-room proof. | UX remains about user orientation, control, trust and recovery. |
| Double Diamond | Strategy → Flow Plan → Task Pack → Handoff. | This is the final execution narrowing step. |
| Reframing Matrix | Codex Authority Boundary. | Codex gets implementation space, not decision space. |
| TRIZ | Route/screen evolution under hard safety constraints. | Structural UX change is allowed without safety bypass. |
| SIT / Closed World | Allowed target files and preflight. | The existing full-workflow codebase remains the target. |
| Morphological Analysis | Phases, task matrix, file maps and proof types. | Complex implementation is decomposed into controllable dimensions. |
| SCAMPER | Route creation/split/merge/deprecate and screen/component extraction. | True UX architecture changes remain possible. |
| Harvard / Principled Negotiation | UX freedom vs safety constraints. | Negotiable UX architecture is separated from non-negotiable safety. |
| MESOs | Execution statuses. | Different task states are handled without all-or-nothing execution. |
| Measurement Plan | Validation commands and proof model. | Implementation must be measurable and reportable. |
| Ethics & Fairness | No-leakage, RBAC, advice boundary and client projection tests. | Client/internal visibility remains safe and honest. |

### 31.4 Handoff QA

| QA Check | Result |
| --- | --- |
| Creates `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | PASS |
| Authorizes Codex execution with constraints | PASS |
| Places Moving Baseline Preflight before code changes | PASS |
| Defines execution phases 0–12 | PASS |
| Maps Task Pack entries into execution matrix | PASS |
| Defines execution statuses | PASS |
| Allows new routes only with Route Evolution Records | PASS |
| Allows screen splits only with Screen Split Decisions | PASS |
| Makes safety tests mandatory | PASS |
| Lists allowed and restricted files | PASS |
| Blocks screen/image/state-screen generation | PASS |
| Includes validation commands and reporting obligations | PASS |
| Includes final Codex Start Command | PASS |
