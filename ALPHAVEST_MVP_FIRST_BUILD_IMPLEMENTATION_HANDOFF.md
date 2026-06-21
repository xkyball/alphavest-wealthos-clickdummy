# ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md

## 0. Current Supersession — Task And Phase Authority

**Supersession generated:** 2026-06-21
**Supersession status:** `SUPERSEDED_FOR_TASKS_AND_PHASES_BY_SCF_DETAIL_PLAN`

This handoff is no longer the operative source of truth for AlphaVest task IDs,
phase IDs, task scope, phase order, package order, dependencies, acceptance
criteria, proof obligations or stop rules. For all task and phase decisions,
use `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`.

The previous `BP-*`, `AV-FB-*`, First-Build package, unlock and register
language below is historical/supporting context only. It must not create,
revive, reorder or authorize tasks or phases when it differs from the SCF
detail plan. Product and safety guardrails in this file remain supporting
references only where they are stricter and do not conflict with the SCF detail
plan.

## 0. Historical max Override — Superseded For Tasks And Phases

**Override generated:** 2026-06-21
**Override mode:** `max`
**Override status:** `HISTORICAL_ALL_PHASES_AND_TASKS_AUTHORIZATION_SUPERSEDED`

This section intentionally overrules every narrower authorization boundary in this handoff that previously limited execution to Phase 0 through Phase 8, `BP-00` through `BP-11`, or excluded `CONDITIONAL_SUPPORT`, `P1`, `HOLD`, `DO_NOT_CREATE`, `BP-12`, `BP-P1-*`, `BP-HOLD-*` or `BP-DNC-*` task families.

Historically, this override allowed execution across AlphaVest phase, package
and task-register families. It must not be used for future task or phase
authority after the SCF detail plan supersession. Future Codex runs must derive
task and phase scope from
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`.

Safety-critical implementation remains proof-gated rather than free-form: new screens, state screens, visual assets, API routes, Prisma schema changes, migrations, external communication flows, client-visible release flows and regulated-advice-adjacent flows are now authorized when required by an unlocked task, but each such change must be explicitly named in the task/report, validated, and fail closed for demo data, role/tenant/object scope, audit, evidence sufficiency, compliance release and client visibility. This override does not authorize real client data, production financial/legal/tax advice, uncontrolled external sends, silent admin bypass, or untested release shortcuts.

**Generated:** 2026-06-21  
**Mode:** Historical implementation handoff. This artefact no longer authorizes
task or phase execution; it is superseded by
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md` for all
task/phase authority.
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`

---

## 1. Executive Decision

**Artefact status:** `MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF_OVERRIDDEN_BY_MAX_ALL_TASK_UNLOCK`
**Implementation gate status:** `ALL_PHASES_AND_TASKS_IMPLEMENTATION_AUTHORIZED_WITH_PROOF_GATES`
**Artefact creation status:** `IMPLEMENTATION_NOT_STARTED_IN_ARTEFACT`

This handoff was the final execution protocol for Codex after the `max`
override above. It has since been superseded for task and phase authority by
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`. Future
execution must use the SCF detail plan's `P00` through `P14` phase model and
`SCF-Pxx-Txxx` tasks.

| Summary Item | Count / Decision |
| --- | --- |
| Historical phases | Previous handoff-family phases, superseded by SCF `P00` through `P14` |
| Historical task specifications | Previous BP/AV-FB task specifications, superseded by `SCF-Pxx-Txxx` tasks |
| Historical source packages | Previous `BP-00` through `BP-12`, `BP-P1-*`, `BP-HOLD-*` and `BP-DNC-*` families |
| Current blocked/register truth | Use the SCF detail plan's Implement/Static/Hide/Remove/Defer/Hold treatment |
| Target repo / branch | `xkyball/alphavest-wealthos-clickdummy` / `full-workflow` |
| Codex may execute from this file? | No. Use the SCF detail plan and its Detail-QA gate. |
| Screen/state/image generation | Authorized when required by an unlocked task and validated |
| Prisma migrations | Authorized when required by an unlocked task and validated |
| New API routes by default | Authorized when required by an unlocked task and validated |
| `main` branch | False-gap source only; never target truth |

## 2. Source-of-Truth Lock

This file is no longer the operative source of truth for AlphaVest tasks or
phases. `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`
supersedes it for task IDs, phase IDs, task scope, phase order, dependencies,
acceptance, proof, stop rules and QA-before-Codex gating. This file may be
consulted only as historical/supporting context for safety and product
guardrails where it does not conflict with the SCF detail plan. `full-workflow`
is the target code reality. `main` is false-gap only.

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md` | Sole task/phase source of truth | Phase IDs, task IDs, task/subtask scope, dependencies, acceptance criteria, proof obligations, stop rules and QA-before-Codex gate. | Delegating task or phase authority to this handoff, older phases, previous task definitions, minimum-path prompts or V3 catalogues. |
| Reference only | `ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md` | Historical/supporting guardrail reference | Product/safety guardrails only where stricter and non-conflicting with the SCF detail plan. | Defining task IDs, phase order, package order, scope, proof gates or execution authority. |
| Reference only | Live GitHub repo / branch `full-workflow` | Target branch reality | Verify current files/routes/APIs/schema/tests during Codex execution. | Treating presence as readiness proof or overriding this handoff. |
| Reference only | `main` branch / older snapshots / previous task packs | False-gap and historical context only | Block old absence claims if this handoff permits that check. | Target truth, implementation scope, task creation or phase authority. |

## 3. Historical Implementation Authorization Boundary

The table below is retained as historical guardrail context only. It is not
task or phase authorization after the SCF detail plan supersession.

| Boundary Area | Historical Rule | Codex Must Not Do | Stop Rule |
| --- | --- | --- | --- |
| Historical task IDs | Previous AlphaVest task IDs/registers are superseded by `SCF-Pxx-Txxx`. | Silently implement unlabeled work without a task/report entry. | If SCF task scope is ambiguous, stop and report before coding. |
| Historical packages | Previous `BP-*` package families are historical only. | Treat old unlock language as permission to bypass proof, safety, audit or validation. | Any safety-critical work without positive and negative proof triggers STOP_AND_REPORT. |
| Target codebase | Use `full-workflow` branch/snapshot as implementation target. | Use `main` as target truth or create `main`-derived tasks. | Target branch/source mismatch triggers STOP_AND_REPORT. |
| Files and architecture | Modify only primary/secondary targets allowed by package/task. | Invent architecture when target file/area is missing. | Missing required file/area triggers source-refresh report. |
| UI/visuals | Implement screens, states, feedback and visual assets when an unlocked task requires them. | Ship generated visuals without review/proof or claim visual acceptance from presence alone. | Visual work without screenshots or visual QA evidence triggers STOP_AND_REPORT. |
| Schema | Align usage to existing schema or create migrations when an unlocked task requires schema change. | Replace schema blindly or skip migration validation. | Any schema change without migration/proof triggers STOP_AND_REPORT. |
| APIs | Harden existing APIs or create new API routes when an unlocked task requires them. | Add API surface without validation, scope checks and fail-closed behavior. | New API route without tests/reporting triggers STOP_AND_REPORT. |
| Safety | Implement fail-closed RBAC, visibility, evidence, audit, advice-boundary and export controls. | Allow anonymous production access, silent admin bypass, AI Draft leakage, upload-to-release, advisor-as-release or preview-as-approval without explicit task proof. | Any safety contradiction triggers STOP_AND_REPORT. |
| Tests | Add/update positive and negative P0 tests required by task scope. | Claim current tests already prove all P0 gates. | Missing/failed P0 negative proof for safety-critical changes blocks completion. |

## 4. Historical Task Inventory

The 62 task IDs below are historical only and are superseded by the SCF detail
plan's `SCF-Pxx-Txxx` task register. They must not be used as the current
source of task authority, phase ordering or execution scope.

| Phase | Package | Task ID | Task Title | Task Type | Allowed? | Primary Target Files / Areas | Required Tests | Validation Commands | Stop Rules |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | BP-00 | AV-FB-P0-BP00-T001 | Lock source hierarchy and target-codebase baseline | FOUNDATION_TASK | ALLOWED_TASK | ALPHAVEST_MVP_FIRST_BUILD_PACKAGE_PLAN.md; full-workflow repo/snapshot; AGENTS.md; README_CODEX_HANDOFF_V3.md | P0-NEG-012 | pnpm typecheck; pnpm lint | Source hierarchy cannot be proven or full-workflow target is unavailable. |
| 0 | BP-00 | AV-FB-P0-BP00-T002 | Block main, stale README and false-gap task contamination | FOUNDATION_TASK | ALLOWED_TASK | ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md; README.md; docs/v3/* | P0-NEG-012 | pnpm lint | Any task references main as target implementation truth. |
| 0 | BP-00 | AV-FB-P0-BP00-T003 | Preserve no-generation, no-schema-migration and no-new-API defaults | FOUNDATION_TASK | ALLOWED_TASK | SCREEN_GENERATION_BRIEF_IF_NEEDED.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; API_CONTRACT_MATRIX.md | P0_HOLD_ROUTE_BLOCK_GATE | pnpm typecheck | A package requires schema migration or screen generation to proceed. |
| 0 | BP-00 | AV-FB-P0-BP00-T004 | Create later-handoff no-overclaim acceptance preflight | VALIDATION_TASK | ALLOWED_TASK | FINAL_CODEX_TASK_MASTER.md; FINAL_CODEX_IMPLEMENTATION_HANDOFF.md; P0_TEST_ACCEPTANCE_MATRIX.md | All P0 gates | pnpm test:route-smoke; pnpm test:phase-d | Proof language implies readiness without positive and negative acceptance. |
| 1 | BP-01 | AV-FB-P1-BP01-T001 | Define deterministic providerless current-user resolver semantics | IDENTITY_SCOPE_TASK | ALLOWED_TASK | components/demo-session-provider.tsx; components/demo-session-panel.tsx; components/top-bar.tsx; lib/permission-engine.ts | P0 providerless-not-anonymous; P0-NEG-010 | pnpm test:permissions; pnpm test:route-smoke | No deterministic actor context can be derived. |
| 1 | BP-01 | AV-FB-P1-BP01-T002 | Map tenant membership and current role context | IDENTITY_SCOPE_TASK | ALLOWED_TASK | lib/permission-engine.ts; prisma/schema.prisma READ_ONLY; components/demo-session-provider.tsx | Tenant/object isolation negatives | pnpm test:permissions | Tenant role context cannot be scoped without schema change. |
| 1 | BP-01 | AV-FB-P1-BP01-T003 | Define object-scope context for documents, decisions, evidence, exports and recommendations | IDENTITY_SCOPE_TASK | ALLOWED_TASK | lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts; app/api/demo-workflow/route.ts | P0-NEG-010; object-scope negatives | pnpm test:permissions; pnpm test:workflow-api | Object scope cannot be represented from existing fields/services. |
| 1 | BP-01 | AV-FB-P1-BP01-T004 | Fail closed for unknown user, wrong tenant and wrong object | IDENTITY_SCOPE_TASK | ALLOWED_TASK | app/[...segments]/page.tsx; components/app-shell.tsx; lib/permission-engine.ts; app/api/* | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0-NEG-010 | pnpm test:permissions; pnpm test:route-smoke | Failure mode would expose payload or default to admin. |
| 1 | BP-01 | AV-FB-P1-BP01-T005 | Add P0 acceptance obligations for providerless-is-not-anonymous | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/route-smoke.spec.ts; tests/demo-workflow-api.spec.ts | P0-NEG-010; P0-NEG-012 | pnpm test:permissions; pnpm test:workflow-api | Tests cannot distinguish anonymous from mapped demo user. |
| 1 | BP-02 | AV-FB-P1-BP02-T001 | Specify tenant/user/role administration baseline semantics | GOVERNANCE_TASK | ALLOWED_TASK | components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; app/api/demo-workflow/route.ts | P0_ADMIN_NON_BYPASS_GATE | pnpm test:workflow-api; pnpm test:permissions | Admin baseline requires unresolved product scope. |
| 1 | BP-02 | AV-FB-P1-BP02-T002 | Constrain role assignment and safety-sensitive second confirmation | GOVERNANCE_TASK | ALLOWED_TASK | components/admin-tenant-setup-screen.tsx; components/ui/modal.tsx; lib/demo-workflow-validation.ts | P0_ADMIN_NON_BYPASS_GATE; P0_RBAC_ACTION_GATE | pnpm test:permissions | Second-confirmation semantics cannot be represented without schema migration. |
| 1 | BP-02 | AV-FB-P1-BP02-T003 | Block admin actions from release, sufficiency, visibility and export approval bypass | GOVERNANCE_TASK | ALLOWED_TASK | lib/permission-engine.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts | P0-NEG-003 | pnpm test:permissions; pnpm test:workflow-gate | Admin role has implicit bypass in existing logic. |
| 1 | BP-02 | AV-FB-P1-BP02-T004 | Attach audit expectations to admin governance actions | AUDIT_DECISION_TASK | ALLOWED_TASK | lib/audit-service.ts; lib/demo-workflow-mutation.ts; tests/permission-engine.spec.ts | P0_AUDIT_PERSISTENCE_GATE; P0_AUDIT_FAIL_CLOSED_GATE | pnpm test:permissions | Audit cannot be recorded for admin action family. |
| 2 | BP-03 | AV-FB-P2-BP03-T001 | Separate route access from action permission | RBAC_VISIBILITY_TASK | ALLOWED_TASK | app/[...segments]/page.tsx; lib/route-registry.ts; lib/permission-engine.ts | P0_RBAC_ACTION_GATE; P0-NEG-010 | pnpm test:permissions; pnpm test:route-smoke | Route registry cannot express/access permission context. |
| 2 | BP-03 | AV-FB-P2-BP03-T002 | Enforce action permission and workflow preconditions | RBAC_VISIBILITY_TASK | ALLOWED_TASK | lib/permission-engine.ts; lib/workflow-gate.ts; lib/demo-workflow-validation.ts | P0_RBAC_ACTION_GATE; P0_API_ERROR_FAIL_CLOSED_GATE | pnpm test:permissions; pnpm test:workflow-gate | Action permissions are not separable from route rendering. |
| 2 | BP-03 | AV-FB-P2-BP03-T003 | Apply tenant/object-scope checks across document, decision, evidence and export objects | RBAC_VISIBILITY_TASK | ALLOWED_TASK | lib/permission-engine.ts; app/api/documents/route.ts; app/api/documents/upload/route.ts; lib/export-service.ts | P0_PAYLOAD_VISIBILITY_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | pnpm test:permissions; pnpm test:workflow-api | Existing APIs cannot receive enough scope context. |
| 2 | BP-03 | AV-FB-P2-BP03-T004 | Define payload visibility and redaction projection | RBAC_VISIBILITY_TASK | ALLOWED_TASK | lib/visibility-engine.ts; components/client-intake-screen.tsx; components/communication-export-ops-screen.tsx | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0-NEG-001 | pnpm test:permissions; pnpm test:file-export | Visibility can only be handled visually, not at payload level. |
| 2 | BP-03 | AV-FB-P2-BP03-T005 | Extend admin non-bypass into RBAC and payload layer | SAFETY_CRITICAL_TASK | ALLOWED_TASK | lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | P0-NEG-003; P0-NEG-010 | pnpm test:permissions; pnpm test:workflow-gate | Existing admin role bypasses safety gates. |
| 2 | BP-03 | AV-FB-P2-BP03-T006 | Add RBAC/payload negative test obligations | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts; tests/route-smoke.spec.ts | P0-NEG-003; P0-NEG-010 | pnpm test:permissions; pnpm test:workflow-api | Negative test surface cannot exercise route/API payloads. |
| 3 | BP-04 | AV-FB-P3-BP04-T001 | Harden upload validation, failure, retry and upload-only success semantics | EVIDENCE_TASK | ALLOWED_TASK | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; lib/document-upload-service.ts | P0_UPLOAD_NOT_SUFFICIENCY_GATE | pnpm test:document-upload-api; pnpm test:playwright | Upload path cannot distinguish success from sufficiency. |
| 3 | BP-04 | AV-FB-P3-BP04-T002 | Define document list and evidence record state semantics | EVIDENCE_TASK | ALLOWED_TASK | app/api/documents/route.ts; components/client-intake-screen.tsx; components/ui/evidence-list.tsx; lib/evidence-service.ts | P0_EVIDENCE_SUFFICIENCY_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | pnpm test:workflow-api; pnpm test:permissions | Existing schema/service cannot represent state distinctions. |
| 3 | BP-04 | AV-FB-P3-BP04-T003 | Specify review, link, relevance, scope and sufficiency lifecycle | EVIDENCE_TASK | ALLOWED_TASK | lib/evidence-service.ts; lib/workflow-gate.ts; app/api/demo-workflow/route.ts | P0-NEG-005 | pnpm test:workflow-gate; pnpm test:workflow-api | Sufficiency cannot be modelled without schema change. |
| 3 | BP-04 | AV-FB-P3-BP04-T004 | Specify evidence request and verification flow support | EVIDENCE_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; app/api/demo-workflow/route.ts | P0_COMPLIANCE_RELEASE_GATE; P0_UPLOAD_NOT_SUFFICIENCY_GATE | pnpm test:workflow-gate | Evidence request action is purely visual/static. |
| 3 | BP-04 | AV-FB-P3-BP04-T005 | Add upload-not-sufficiency and wrong-scope evidence P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts; tests/workflow-gate.spec.ts | P0-NEG-004; P0-NEG-005 | pnpm test:document-upload-api; pnpm test:workflow-gate | Negative tests cannot observe release/export/client visibility. |
| 4 | BP-05 | AV-FB-P4-BP05-T001 | Specify internal-only AI/rules draft representation | AI_DRAFT_REVIEW_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; prisma/schema.prisma READ_ONLY | P0_AI_DRAFT_INTERNAL_ONLY_GATE; P0-NEG-001 | pnpm test:workflow-api; pnpm test:file-export | Existing schema requires migration for draft semantics. |
| 4 | BP-05 | AV-FB-P4-BP05-T002 | Specify unsupported-claim rejection state | AI_DRAFT_REVIEW_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/demo-workflow-validation.ts | P0_NO_UNAPPROVED_ADVICE_GATE | pnpm test:workflow-gate | Unsupported-claim concept cannot be represented with existing status/fields. |
| 4 | BP-05 | AV-FB-P4-BP05-T003 | Specify evidence-linked rebuild path | AI_DRAFT_REVIEW_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; lib/evidence-service.ts; lib/demo-workflow-mutation.ts | P0_EVIDENCE_SUFFICIENCY_GATE; P0_NO_UNAPPROVED_ADVICE_GATE | pnpm test:workflow-gate; pnpm test:workflow-api | Evidence link cannot be established with current service/schema. |
| 4 | BP-05 | AV-FB-P4-BP05-T004 | Add AI Draft leakage negative P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/demo-workflow-api.spec.ts; tests/file-export-realism.spec.ts; tests/permission-engine.spec.ts | P0-NEG-001 | pnpm test:workflow-api; pnpm test:file-export | Payload inspection surface cannot observe draft leakage. |
| 4 | BP-06 | AV-FB-P4-BP06-T001 | Specify advisor approval state and transition semantics | ADVISOR_GATE_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts | P0_ADVISOR_NOT_RELEASE_GATE | pnpm test:workflow-gate; pnpm test:workflow-api | Approval transition cannot be separated from compliance release. |
| 4 | BP-06 | AV-FB-P4-BP06-T002 | Attach audit expectation to advisor approval | AUDIT_DECISION_TASK | ALLOWED_TASK | lib/audit-service.ts; lib/demo-workflow-mutation.ts; tests/workflow-gate.spec.ts | P0_AUDIT_PERSISTENCE_GATE; P0_AUDIT_FAIL_CLOSED_GATE | pnpm test:workflow-gate; pnpm test:permissions | Audit cannot support advisor action family. |
| 4 | BP-06 | AV-FB-P4-BP06-T003 | Add advisor-not-release P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts; tests/permission-engine.spec.ts | P0-NEG-002 | pnpm test:workflow-gate; pnpm test:workflow-api | Tests cannot observe client visibility state after advisor approval. |
| 5 | BP-07 | AV-FB-P5-BP07-T001 | Align compliance review/block/request/release states across UI/API/gate | COMPLIANCE_GATE_TASK | ALLOWED_TASK | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; app/api/demo-workflow/route.ts | P0_COMPLIANCE_RELEASE_GATE | pnpm test:workflow-gate; pnpm test:workflow-api | Compliance state cannot map to existing workflow status. |
| 5 | BP-07 | AV-FB-P5-BP07-T002 | Specify compliance block and request-evidence path | COMPLIANCE_GATE_TASK | ALLOWED_TASK | components/decisions-governance-screen.tsx; lib/demo-workflow-mutation.ts; lib/evidence-service.ts | P0_UPLOAD_NOT_SUFFICIENCY_GATE; P0_EVIDENCE_SUFFICIENCY_GATE | pnpm test:workflow-gate | Block/request evidence action is visual-only without state. |
| 5 | BP-07 | AV-FB-P5-BP07-T003 | Enforce release preconditions and fail-closed release behaviour | COMPLIANCE_GATE_TASK | ALLOWED_TASK | lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-validation.ts; app/api/demo-workflow/route.ts | P0_COMPLIANCE_RELEASE_GATE; P0-NEG-003; P0-NEG-004; P0-NEG-005 | pnpm test:workflow-gate; pnpm test:permissions | Release preconditions cannot be enforced without schema/API change. |
| 5 | BP-07 | AV-FB-P5-BP07-T004 | Add compliance-release negative P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts; tests/permission-engine.spec.ts | P0-NEG-002; P0-NEG-003; P0-NEG-004; P0-NEG-005; P0-NEG-009 | pnpm test:workflow-gate; pnpm test:workflow-api | Test hooks cannot observe release preconditions. |
| 5 | BP-08 | AV-FB-P5-BP08-T001 | Specify client-safe released projection for portal/mobile/client payloads | CLIENT_PROJECTION_TASK | ALLOWED_TASK | components/client-intake-screen.tsx; lib/visibility-engine.ts; app/api/documents/route.ts | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE | pnpm test:permissions; pnpm test:workflow-api | Client projection requires new API not authorized by plan. |
| 5 | BP-08 | AV-FB-P5-BP08-T002 | Apply fail-closed hidden/redacted states to client surfaces | CLIENT_PROJECTION_TASK | ALLOWED_TASK | components/client-intake-screen.tsx; components/ui/state-panel.tsx; lib/visibility-engine.ts | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0_STATE_FEEDBACK_GATE | pnpm test:playwright; pnpm test:permissions | Existing UI cannot distinguish fail-closed from no data. |
| 5 | BP-08 | AV-FB-P5-BP08-T003 | Redact document/evidence/decision payloads for client views | CLIENT_PROJECTION_TASK | ALLOWED_TASK | app/api/documents/route.ts; lib/evidence-service.ts; lib/visibility-engine.ts; components/ui/evidence-list.tsx | P0_PAYLOAD_VISIBILITY_GATE; P0-NEG-001; P0-NEG-005 | pnpm test:workflow-api; pnpm test:permissions | API cannot support role-aware payload projection. |
| 5 | BP-08 | AV-FB-P5-BP08-T004 | Add client leakage negative P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts | P0-NEG-001; P0-NEG-010 | pnpm test:permissions; pnpm test:workflow-api | Tests cannot inspect client-facing payload. |
| 6 | BP-09 | AV-FB-P6-BP09-T001 | Specify decision record creation and update semantics | AUDIT_DECISION_TASK | ALLOWED_TASK | components/decisions-governance-screen.tsx; lib/demo-workflow-mutation.ts; prisma/schema.prisma READ_ONLY | P0_SCHEMA_FIELD_SUPPORT_GATE; P0_COMPLIANCE_RELEASE_GATE | pnpm test:workflow-gate | Decision state cannot map to existing model fields. |
| 6 | BP-09 | AV-FB-P6-BP09-T002 | Define audit event minimum field coverage | AUDIT_DECISION_TASK | ALLOWED_TASK | lib/audit-service.ts; prisma/schema.prisma READ_ONLY; tests/permission-engine.spec.ts | P0_AUDIT_PERSISTENCE_GATE | pnpm test:permissions | AuditEvent cannot represent minimum fields. |
| 6 | BP-09 | AV-FB-P6-BP09-T003 | Attach audit to advisor, compliance, evidence, admin and export actions | AUDIT_DECISION_TASK | ALLOWED_TASK | lib/audit-service.ts; lib/demo-workflow-mutation.ts; lib/document-upload-service.ts; lib/export-package-service.ts | P0_AUDIT_PERSISTENCE_GATE; P0-NEG-009 | pnpm test:permissions; pnpm test:workflow-api; pnpm test:file-export | Not all action families can call audit service. |
| 6 | BP-09 | AV-FB-P6-BP09-T004 | Specify audit-failure fail-closed or hold behaviour | AUDIT_DECISION_TASK | ALLOWED_TASK | lib/audit-service.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts | P0_AUDIT_FAIL_CLOSED_GATE; P0-NEG-009 | pnpm test:workflow-gate; pnpm test:permissions | Existing services cannot simulate audit failure. |
| 6 | BP-09 | AV-FB-P6-BP09-T005 | Add audit persistence/fail-closed P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/document-upload-api.spec.ts; tests/demo-workflow-api.spec.ts | P0-NEG-009 | pnpm test:permissions; pnpm test:workflow-api | Test framework cannot verify audit persistence. |
| 7 | BP-10 | AV-FB-P7-BP10-T001 | Specify export scope selection lifecycle | EXPORT_TASK | ALLOWED_TASK | components/communication-export-ops-screen.tsx; lib/export-service.ts; lib/export-package-service.ts | P0_EXPORT_REDACTION_GATE; P0_PAYLOAD_VISIBILITY_GATE | pnpm test:file-export; pnpm test:permissions | Existing export service cannot enforce object scope. |
| 7 | BP-10 | AV-FB-P7-BP10-T002 | Apply redaction profile and forbidden payload exclusion | EXPORT_TASK | ALLOWED_TASK | lib/export-service.ts; lib/export-package-service.ts; lib/file-metadata-service.ts | P0-NEG-006 | pnpm test:file-export | Export payload is opaque and cannot be inspected. |
| 7 | BP-10 | AV-FB-P7-BP10-T003 | Separate export preview, approval, generation, download and share | EXPORT_TASK | ALLOWED_TASK | components/communication-export-ops-screen.tsx; lib/export-package-service.ts; lib/audit-service.ts | P0-NEG-007; P0-NEG-009 | pnpm test:file-export | Existing export service collapses preview/approval/download. |
| 7 | BP-10 | AV-FB-P7-BP10-T004 | Add export redaction and lifecycle P0 obligations | P0_TEST_TASK | ALLOWED_TASK | tests/file-export-realism.spec.ts; tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts | P0-NEG-006; P0-NEG-007 | pnpm test:file-export; pnpm test:permissions | Tests cannot inspect generated export content. |
| 8 | BP-11 | AV-FB-P8-BP11-T001 | Specify positive happy-path MVP spine proof | P0_TEST_TASK | ALLOWED_TASK | tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/workflow-gate.spec.ts; tests/permission-engine.spec.ts | P0 positive spine | pnpm test:playwright; pnpm test:workflow-api; pnpm test:workflow-gate; pnpm test:permissions; pnpm test:file-export | Positive proof cannot be assembled without unresolved implementation choices. |
| 8 | BP-11 | AV-FB-P8-BP11-T002 | Specify P0-NEG-001 — AI Draft internal-only | P0_TEST_TASK | ALLOWED_TASK | tests/demo-workflow-api.spec.ts; tests/file-export-realism.spec.ts | P0-NEG-001 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T003 | Specify P0-NEG-002 — Advisor not release | P0_TEST_TASK | ALLOWED_TASK | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | P0-NEG-002 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T004 | Specify P0-NEG-003 — Admin non-bypass | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts | P0-NEG-003 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T005 | Specify P0-NEG-004 — Upload not sufficiency | P0_TEST_TASK | ALLOWED_TASK | tests/document-upload-api.spec.ts; tests/workflow-gate.spec.ts | P0-NEG-004 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T006 | Specify P0-NEG-005 — Evidence sufficiency | P0_TEST_TASK | ALLOWED_TASK | tests/workflow-gate.spec.ts; tests/document-upload-api.spec.ts | P0-NEG-005 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T007 | Specify P0-NEG-006 — Export redaction | P0_TEST_TASK | ALLOWED_TASK | tests/file-export-realism.spec.ts | P0-NEG-006 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T008 | Specify P0-NEG-007 — Export lifecycle | P0_TEST_TASK | ALLOWED_TASK | tests/file-export-realism.spec.ts | P0-NEG-007 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T009 | Specify P0-NEG-008 — API fail-closed | P0_TEST_TASK | ALLOWED_TASK | tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts | P0-NEG-008 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T010 | Specify P0-NEG-009 — Audit fail-closed | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts | P0-NEG-009 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T011 | Specify P0-NEG-010 — Payload visibility | P0_TEST_TASK | ALLOWED_TASK | tests/permission-engine.spec.ts; tests/route-smoke.spec.ts | P0-NEG-010 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T012 | Specify P0-NEG-011 — Hold route block | P0_TEST_TASK | ALLOWED_TASK | tests/route-smoke.spec.ts | P0-NEG-011 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T013 | Specify P0-NEG-012 — Main false-gap block | P0_TEST_TASK | ALLOWED_TASK | task-pack QA; source preflight | P0-NEG-012 | Relevant package commands plus pnpm test:phase-d | Negative proof cannot be linked to any accepted package or target surface. |
| 8 | BP-11 | AV-FB-P8-BP11-T014 | Specify final validation command and proof report pack | VALIDATION_TASK | ALLOWED_TASK | package.json scripts; playwright.config.ts; tests/* | All P0 gates | pnpm typecheck; pnpm lint; pnpm db:validate; pnpm build; pnpm test:playwright; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:route-smoke; pnpm test:data-quality; pnpm test:file-export; pnpm test:phase-d | Command script is missing or cannot be mapped to proof obligation. |

## 5. Historical Phase Execution Order

The phase order below is historical only. Current phase order is the SCF detail
plan's `P00` through `P14` dependency map and execution sequencing rules.

| Phase | Source Package(s) | Phase Name | Phase Goal | Execution Allowed? | Required Before Start | Required Completion Proof |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | BP-00 | Guardrails and source discipline | Lock full-workflow, block main, preserve no-generation/no-schema-migration/no-overclaim. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P0-BP00-T001, AV-FB-P0-BP00-T002, AV-FB-P0-BP00-T003, AV-FB-P0-BP00-T004; validation commands run where applicable; positive and negative P0 proof reported. |
| 1 | BP-01, BP-02 | User / tenant / role foundation | Resolve mapped current user, tenant membership, role context and admin/governance baseline. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P1-BP01-T001, AV-FB-P1-BP01-T002, AV-FB-P1-BP01-T003, AV-FB-P1-BP01-T004, AV-FB-P1-BP01-T005, AV-FB-P1-BP02-T001, AV-FB-P1-BP02-T002, AV-FB-P1-BP02-T003, AV-FB-P1-BP02-T004; validation commands run where applicable; positive and negative P0 proof reported. |
| 2 | BP-03 | RBAC, object scope and payload visibility | Enforce route/action/object/payload separation and admin non-bypass baseline. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P2-BP03-T001, AV-FB-P2-BP03-T002, AV-FB-P2-BP03-T003, AV-FB-P2-BP03-T004, AV-FB-P2-BP03-T005, AV-FB-P2-BP03-T006; validation commands run where applicable; positive and negative P0 proof reported. |
| 3 | BP-04 | Evidence lifecycle | Implement upload-to-review-to-sufficiency semantics without upload-to-release shortcut. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P3-BP04-T001, AV-FB-P3-BP04-T002, AV-FB-P3-BP04-T003, AV-FB-P3-BP04-T004, AV-FB-P3-BP04-T005; validation commands run where applicable; positive and negative P0 proof reported. |
| 4 | BP-05, BP-06 | Internal draft, analyst review and advisor gate | Keep AI/rules drafts internal, support analyst rejection/rebuild and keep advisor approval separate from release. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P4-BP05-T001, AV-FB-P4-BP05-T002, AV-FB-P4-BP05-T003, AV-FB-P4-BP05-T004, AV-FB-P4-BP06-T001, AV-FB-P4-BP06-T002, AV-FB-P4-BP06-T003; validation commands run where applicable; positive and negative P0 proof reported. |
| 5 | BP-07, BP-08 | Compliance release and client-safe projection | Enforce compliance block/request-evidence/release and fail-closed client visibility. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P5-BP07-T001, AV-FB-P5-BP07-T002, AV-FB-P5-BP07-T003, AV-FB-P5-BP07-T004, AV-FB-P5-BP08-T001, AV-FB-P5-BP08-T002, AV-FB-P5-BP08-T003, AV-FB-P5-BP08-T004; validation commands run where applicable; positive and negative P0 proof reported. |
| 6 | BP-09 | Decision record and audit persistence | Persist auditable decision/gate records and fail closed when audit cannot be confirmed. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P6-BP09-T001, AV-FB-P6-BP09-T002, AV-FB-P6-BP09-T003, AV-FB-P6-BP09-T004, AV-FB-P6-BP09-T005; validation commands run where applicable; positive and negative P0 proof reported. |
| 7 | BP-10 | Export redaction and safe package generation | Enforce export scope, redaction, preview/approval/download/share separation. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P7-BP10-T001, AV-FB-P7-BP10-T002, AV-FB-P7-BP10-T003, AV-FB-P7-BP10-T004; validation commands run where applicable; positive and negative P0 proof reported. |
| 8 | BP-11 | P0 test completion and validation | Add/update positive and negative P0 test obligations and validation proof plan. | YES — constrained by allowed task IDs | All predecessor phases complete and no Stop Rule active | Completed task IDs: AV-FB-P8-BP11-T001, AV-FB-P8-BP11-T002, AV-FB-P8-BP11-T003, AV-FB-P8-BP11-T004, AV-FB-P8-BP11-T005, AV-FB-P8-BP11-T006, AV-FB-P8-BP11-T007, AV-FB-P8-BP11-T008, AV-FB-P8-BP11-T009, AV-FB-P8-BP11-T010, AV-FB-P8-BP11-T011, AV-FB-P8-BP11-T012, AV-FB-P8-BP11-T013, AV-FB-P8-BP11-T014; validation commands run where applicable; positive and negative P0 proof reported. |

## 6. Package Execution Protocol

### 6.1 `BP-00` — Source hierarchy / target-codebase / no-overclaim guardrails

| Detail Area | Content |
| --- | --- |
| Package | `BP-00` — Source hierarchy / target-codebase / no-overclaim guardrails |
| Allowed Task IDs | AV-FB-P0-BP00-T001, AV-FB-P0-BP00-T002, AV-FB-P0-BP00-T003, AV-FB-P0-BP00-T004 |
| Primary Targets | ALPHAVEST_MVP_FIRST_BUILD_PACKAGE_PLAN.md; full-workflow repo/snapshot; AGENTS.md; README_CODEX_HANDOFF_V3.md; ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md; README.md; docs/v3/*; SCREEN_GENERATION_BRIEF_IF_NEEDED.md; SCHEMA_FIELD_LEVEL_RECONCILIATION.md; API_CONTRACT_MATRIX.md; FINAL_CODEX_TASK_MASTER.md; FINAL_CODEX_IMPLEMENTATION_HANDOFF.md; P0_TEST_ACCEPTANCE_MATRIX.md |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Global source, branch, no-overclaim and no-generation preflight. |
| Must Not Include | Do not use main or older false-gap claims as target truth.; Do not create tasks from main-based missing API/Prisma/tests/UI claims.; Do not create visual, migration or new-API work without an unlocked task, explicit proof and validation.; Do not treat status chips, buttons, PNGs, route 200s or API 200s as gate proof. |
| Positive Acceptance | This handoff states full-workflow target and source hierarchy before any task execution.; False-gap register is visible in final task execution preflight.; Section 0 records that visual, migration and new-API work is now task-unlocked and proof-gated.; Every later task references acceptance and negative P0 proof obligations. |
| Negative P0 Acceptance | Any main-derived absence claim is rejected before task execution.; A main-derived task fails preflight and receives DO_NOT_CREATE_TASK.; Any visual generation/migration/new-API proposal without unlocked task proof is blocked.; Overclaiming a proof slice blocks phase completion. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm lint; pnpm typecheck; pnpm test:route-smoke; pnpm test:phase-d |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Source hierarchy cannot be proven or full-workflow target is unavailable.; Any task references main as target implementation truth.; A package requires schema migration or screen generation to proceed.; Proof language implies readiness without positive and negative acceptance. |

### 6.2 `BP-01` — Providerless current-user / tenant / role mapping

| Detail Area | Content |
| --- | --- |
| Package | `BP-01` — Providerless current-user / tenant / role mapping |
| Allowed Task IDs | AV-FB-P1-BP01-T001, AV-FB-P1-BP01-T002, AV-FB-P1-BP01-T003, AV-FB-P1-BP01-T004, AV-FB-P1-BP01-T005 |
| Primary Targets | components/demo-session-provider.tsx; components/demo-session-panel.tsx; components/top-bar.tsx; lib/permission-engine.ts; lib/permission-engine.ts; prisma/schema.prisma READ_ONLY; components/demo-session-provider.tsx; lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts; app/api/demo-workflow/route.ts; app/[...segments]/page.tsx; components/app-shell.tsx; lib/permission-engine.ts; app/api/*; tests/permission-engine.spec.ts; tests/route-smoke.spec.ts; tests/demo-workflow-api.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Mapped current user, tenant membership, current role and object-scope foundation. |
| Must Not Include | Do not add production IdP or treat login as anonymous demo.; Do not create migration or patch-only model.; Do not allow route access to imply object access.; Do not silently fall back to broad demo tenant.; Do not write tests in this artefact. |
| Positive Acceptance | A seeded/mapped actor has stable user ID, role and tenant context.; Mapped user resolves only permitted tenant memberships and roles.; Actor can access only scoped objects.; Unknown/wrong-scope requests return denied or empty safe state.; Positive test demonstrates mapped actor flow. |
| Negative P0 Acceptance | Unknown actor does not receive internal/client payload.; Wrong tenant membership fails closed.; Wrong object returns denied/hidden/redacted without payload leak.; No internal payload is sent on denial.; Negative tests deny anonymous, wrong tenant and wrong object. |
| Validation Commands | pnpm test:permissions; pnpm test:route-smoke; pnpm test:permissions; pnpm test:permissions; pnpm test:workflow-api |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | No deterministic actor context can be derived.; Tenant role context cannot be scoped without schema change.; Object scope cannot be represented from existing fields/services.; Failure mode would expose payload or default to admin.; Tests cannot distinguish anonymous from mapped demo user. |

### 6.3 `BP-02` — Tenant/user/role administration baseline

| Detail Area | Content |
| --- | --- |
| Package | `BP-02` — Tenant/user/role administration baseline |
| Allowed Task IDs | AV-FB-P1-BP02-T001, AV-FB-P1-BP02-T002, AV-FB-P1-BP02-T003, AV-FB-P1-BP02-T004 |
| Primary Targets | components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; app/api/demo-workflow/route.ts; components/admin-tenant-setup-screen.tsx; components/ui/modal.tsx; lib/demo-workflow-validation.ts; lib/permission-engine.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts; tests/permission-engine.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Tenant, user and role administration baseline without safety bypass. |
| Must Not Include | Do not implement production IAM, external IdP or broad admin override.; Do not make confirmation a visual-only modal.; Do not permit admin override flags.; Do not treat audit timeline display as persistence. |
| Positive Acceptance | Admin can manage tenant/team/roles within policy.; Role change requires valid actor, target, reason and confirmation when sensitive.; Admin governance actions remain separate from advisory/compliance gates.; Governance changes create audit rows with actor/role/target/result/reason. |
| Negative P0 Acceptance | Admin action does not alter release/evidence/export/client visibility.; Role change cannot expand release/export/client payload authority.; Admin attempt to force release/sufficiency/export/visibility is denied and audited.; Missing audit blocks/holds safety-sensitive admin action. |
| Validation Commands | pnpm test:workflow-api; pnpm test:permissions; pnpm test:permissions; pnpm test:permissions; pnpm test:workflow-gate |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Admin baseline requires unresolved product scope.; Second-confirmation semantics cannot be represented without schema migration.; Admin role has implicit bypass in existing logic.; Audit cannot be recorded for admin action family. |

### 6.4 `BP-03` — RBAC / object-scope / payload visibility hardening

| Detail Area | Content |
| --- | --- |
| Package | `BP-03` — RBAC / object-scope / payload visibility hardening |
| Allowed Task IDs | AV-FB-P2-BP03-T001, AV-FB-P2-BP03-T002, AV-FB-P2-BP03-T003, AV-FB-P2-BP03-T004, AV-FB-P2-BP03-T005, AV-FB-P2-BP03-T006 |
| Primary Targets | app/[...segments]/page.tsx; lib/route-registry.ts; lib/permission-engine.ts; lib/permission-engine.ts; lib/workflow-gate.ts; lib/demo-workflow-validation.ts; lib/permission-engine.ts; app/api/documents/route.ts; app/api/documents/upload/route.ts; lib/export-service.ts; lib/visibility-engine.ts; components/client-intake-screen.tsx; components/communication-export-ops-screen.tsx; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts; tests/route-smoke.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Route/action/object/payload safety enforcement and fail-closed visibility baseline. |
| Must Not Include | Do not treat route 200 as authorization.; Do not allow visual button presence to imply mutation authority.; Do not infer scope from route path alone.; Do not send internal fields and hide in UI only.; Do not add superadmin safety override.; Do not write tests in this artefact. |
| Positive Acceptance | Permitted route shell loads without granting forbidden actions.; Allowed action succeeds only when role, object and workflow preconditions pass.; Scoped actor can access correct object only.; Client-safe projection contains only released/redacted content.; Admin can manage governance but cannot force client-visible payload or release.; Positive scoped action works. |
| Negative P0 Acceptance | User with route shell but no action permission sees disabled/denied action and no payload expansion.; Forbidden action is denied and does not mutate state.; Cross-tenant/wrong-object request denied with audit/no payload.; AI Draft, internal rationale, compliance notes and unreleased evidence are hidden.; Admin bypass attempts denied/audited.; Wrong role/object/tenant/action denied with no payload leak. |
| Validation Commands | pnpm test:permissions; pnpm test:route-smoke; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:permissions; pnpm test:workflow-api; pnpm test:permissions; pnpm test:file-export |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Route registry cannot express/access permission context.; Action permissions are not separable from route rendering.; Existing APIs cannot receive enough scope context.; Visibility can only be handled visually, not at payload level.; Existing admin role bypasses safety gates.; Negative test surface cannot exercise route/API payloads. |

### 6.5 `BP-04` — Evidence upload-to-sufficiency lifecycle

| Detail Area | Content |
| --- | --- |
| Package | `BP-04` — Evidence upload-to-sufficiency lifecycle |
| Allowed Task IDs | AV-FB-P3-BP04-T001, AV-FB-P3-BP04-T002, AV-FB-P3-BP04-T003, AV-FB-P3-BP04-T004, AV-FB-P3-BP04-T005 |
| Primary Targets | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; lib/document-upload-service.ts; app/api/documents/route.ts; components/client-intake-screen.tsx; components/ui/evidence-list.tsx; lib/evidence-service.ts; lib/evidence-service.ts; lib/workflow-gate.ts; app/api/demo-workflow/route.ts; components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; app/api/demo-workflow/route.ts; tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts; tests/workflow-gate.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Evidence lifecycle from upload through review/link/relevance/scope/sufficiency; upload is not sufficiency. |
| Must Not Include | Do not imply evidence sufficiency from upload success.; Do not treat document row as reviewed evidence.; Do not allow stale/unlinked/wrong-scope evidence to unlock release/export.; Do not turn evidence request into release or client acceptance.; Do not write tests in this artefact. |
| Positive Acceptance | Valid upload creates candidate document/evidence records.; Document/evidence state is visible according to actor and workflow state.; Reviewed linked relevant evidence can support compliance prerequisite.; Compliance can request evidence and keep release pending.; Positive reviewed evidence supports release precondition. |
| Negative P0 Acceptance | Invalid/forbidden upload writes no release/visibility change.; Client does not see unreleased/internal evidence.; Unreviewed, stale, wrong-scope or unlinked evidence blocks release.; Release remains blocked until evidence sufficiency is proven.; Upload-only and wrong-scope evidence do not unlock release/export/client visibility. |
| Validation Commands | pnpm test:document-upload-api; pnpm test:playwright; pnpm test:workflow-api; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:workflow-gate; pnpm test:document-upload-api; pnpm test:workflow-gate |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Upload path cannot distinguish success from sufficiency.; Existing schema/service cannot represent state distinctions.; Sufficiency cannot be modelled without schema change.; Evidence request action is purely visual/static.; Negative tests cannot observe release/export/client visibility. |

### 6.6 `BP-05` — Internal AI draft / analyst review / unsupported-claim rejection

| Detail Area | Content |
| --- | --- |
| Package | `BP-05` — Internal AI draft / analyst review / unsupported-claim rejection |
| Allowed Task IDs | AV-FB-P4-BP05-T001, AV-FB-P4-BP05-T002, AV-FB-P4-BP05-T003, AV-FB-P4-BP05-T004 |
| Primary Targets | components/internal-workflow-screen.tsx; lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; prisma/schema.prisma READ_ONLY; components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/demo-workflow-validation.ts; components/internal-workflow-screen.tsx; lib/evidence-service.ts; lib/demo-workflow-mutation.ts; tests/demo-workflow-api.spec.ts; tests/file-export-realism.spec.ts; tests/permission-engine.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Internal-only AI/rules draft, analyst rejection/rebuild and evidence linkage. |
| Must Not Include | Do not create patch-only AiDraft model or client-visible AI content.; Do not let unsupported drafts advance to advisor/client path.; Do not bypass evidence review or analyst review.; Do not write tests in this artefact. |
| Positive Acceptance | Draft exists only on internal workflow surfaces.; Unsupported claim is flagged/rejected with reason.; Rebuilt draft references reviewed/linked evidence.; Positive internal review/rebuild flow works. |
| Negative P0 Acceptance | Client/API/export payload cannot receive AI Draft or internal rationale.; Unsupported claim cannot be approved or released.; Rebuild without sufficient evidence remains blocked/internal.; Client/API/export payload excludes AI Draft/internal rationale. |
| Validation Commands | pnpm test:workflow-api; pnpm test:file-export; pnpm test:workflow-gate; pnpm test:workflow-gate; pnpm test:workflow-api |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Existing schema requires migration for draft semantics.; Unsupported-claim concept cannot be represented with existing status/fields.; Evidence link cannot be established with current service/schema.; Payload inspection surface cannot observe draft leakage. |

### 6.7 `BP-06` — Advisor approval separate from compliance release

| Detail Area | Content |
| --- | --- |
| Package | `BP-06` — Advisor approval separate from compliance release |
| Allowed Task IDs | AV-FB-P4-BP06-T001, AV-FB-P4-BP06-T002, AV-FB-P4-BP06-T003 |
| Primary Targets | components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts; tests/workflow-gate.spec.ts; tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts; tests/permission-engine.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Advisor approval state and audit while preserving advisor approval ≠ compliance release. |
| Must Not Include | Do not set clientVisible or releasedToClientAt on advisor approval.; Do not rely on visible timeline only.; Do not write tests in this artefact. |
| Positive Acceptance | Advisor approval changes item to compliance-pending/advisor-approved state.; Advisor approval action records audit event.; Positive advisor approval reaches compliance queue. |
| Negative P0 Acceptance | Advisor approval alone does not release or client-project.; If audit cannot be confirmed, approval remains pending/denied later.; Advisor approval alone does not release/clientVisible/export. |
| Validation Commands | pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:workflow-gate; pnpm test:permissions |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Approval transition cannot be separated from compliance release.; Audit cannot support advisor action family.; Tests cannot observe client visibility state after advisor approval. |

### 6.8 `BP-07` — Compliance block / request evidence / release

| Detail Area | Content |
| --- | --- |
| Package | `BP-07` — Compliance block / request evidence / release |
| Allowed Task IDs | AV-FB-P5-BP07-T001, AV-FB-P5-BP07-T002, AV-FB-P5-BP07-T003, AV-FB-P5-BP07-T004 |
| Primary Targets | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; app/api/demo-workflow/route.ts; components/decisions-governance-screen.tsx; lib/demo-workflow-mutation.ts; lib/evidence-service.ts; lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-validation.ts; app/api/demo-workflow/route.ts; tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts; tests/permission-engine.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Compliance block/request-evidence/release preconditions and release denial cases. |
| Must Not Include | Do not treat compliance release as client acceptance.; Do not release while evidence is pending.; Do not create upload-to-release, advisor-to-release or admin-to-release shortcut.; Do not write tests in this artefact. |
| Positive Acceptance | Compliance review shows block/request/release paths with preconditions.; Compliance can block or request evidence and keep item pending.; Valid release creates released/client-safe projection precondition.; Positive release after prerequisites passes. |
| Negative P0 Acceptance | Missing prerequisites keep release disabled/blocked.; Client visibility/export remain hidden/blocked after block/request.; Release without evidence/advisor/audit is denied/blocked.; Missing evidence/advisor/audit/admin bypass attempts fail safely. |
| Validation Commands | pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:workflow-gate; pnpm test:workflow-gate; pnpm test:permissions |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Compliance state cannot map to existing workflow status.; Block/request evidence action is visual-only without state.; Release preconditions cannot be enforced without schema/API change.; Test hooks cannot observe release preconditions. |

### 6.9 `BP-08` — Client visibility fail-closed projection

| Detail Area | Content |
| --- | --- |
| Package | `BP-08` — Client visibility fail-closed projection |
| Allowed Task IDs | AV-FB-P5-BP08-T001, AV-FB-P5-BP08-T002, AV-FB-P5-BP08-T003, AV-FB-P5-BP08-T004 |
| Primary Targets | components/client-intake-screen.tsx; lib/visibility-engine.ts; app/api/documents/route.ts; components/client-intake-screen.tsx; components/ui/state-panel.tsx; lib/visibility-engine.ts; app/api/documents/route.ts; lib/evidence-service.ts; lib/visibility-engine.ts; components/ui/evidence-list.tsx; tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Client-safe released projection, internal redaction and fail-closed client visibility. |
| Must Not Include | Do not manually toggle client visibility or send internal payload then hide visually.; Do not show internal drafts, compliance notes or unreleased evidence.; Do not expose raw evidence, internal rationale or compliance notes.; Do not write tests in this artefact. |
| Positive Acceptance | Released safe summary appears to client.; Client surface displays safe released content or fail-closed state.; Client receives released/redacted document/evidence summary only.; Client sees released safe summary after compliance release. |
| Negative P0 Acceptance | Unreleased/internal content is hidden/redacted/denied.; No internal data leak in hidden/error/empty states.; Unreviewed/unreleased evidence hidden/redacted.; Client never sees AI Draft/internal rationale/compliance notes/unreleased evidence. |
| Validation Commands | pnpm test:permissions; pnpm test:workflow-api; pnpm test:playwright; pnpm test:permissions; pnpm test:workflow-api; pnpm test:permissions |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Client projection requires a new API without task proof/validation.; Existing UI cannot distinguish fail-closed from no data.; API cannot support role-aware payload projection.; Tests cannot inspect client-facing payload. |

### 6.10 `BP-09` — Decision record and audit persistence

| Detail Area | Content |
| --- | --- |
| Package | `BP-09` — Decision record and audit persistence |
| Allowed Task IDs | AV-FB-P6-BP09-T001, AV-FB-P6-BP09-T002, AV-FB-P6-BP09-T003, AV-FB-P6-BP09-T004, AV-FB-P6-BP09-T005 |
| Primary Targets | components/decisions-governance-screen.tsx; lib/demo-workflow-mutation.ts; prisma/schema.prisma READ_ONLY; lib/audit-service.ts; prisma/schema.prisma READ_ONLY; tests/permission-engine.spec.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts; lib/document-upload-service.ts; lib/export-package-service.ts; lib/audit-service.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; tests/permission-engine.spec.ts; tests/document-upload-api.spec.ts; tests/demo-workflow-api.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Decision record and audit persistence for all critical gate actions. |
| Must Not Include | Do not treat displayed decision room as persisted record proof.; Do not accept audit display-only rows.; Do not make audit optional for release/export/admin/evidence/advisor actions.; Do not silently complete safety actions without audit.; Do not write tests in this artefact. |
| Positive Acceptance | Decision record captures approved/released status and evidence link context.; Audit event contains minimum fields for critical action.; Critical action writes audit row.; Auditable action completes only with audit confirmation.; Critical actions produce complete audit records. |
| Negative P0 Acceptance | Decision is not released/client-visible without compliance release.; Incomplete audit blocks acceptance for safety-critical action.; Critical action without audit remains denied/pending.; Audit failure blocks/holds release/export/admin safety mutation.; Required audit failure prevents silent completion. |
| Validation Commands | pnpm test:workflow-gate; pnpm test:permissions; pnpm test:permissions; pnpm test:workflow-api; pnpm test:file-export; pnpm test:workflow-gate; pnpm test:permissions; pnpm test:permissions; pnpm test:workflow-api |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Decision state cannot map to existing model fields.; AuditEvent cannot represent minimum fields.; Not all action families can call audit service.; Existing services cannot simulate audit failure.; Test framework cannot verify audit persistence. |

### 6.11 `BP-10` — Export redaction and safe package generation

| Detail Area | Content |
| --- | --- |
| Package | `BP-10` — Export redaction and safe package generation |
| Allowed Task IDs | AV-FB-P7-BP10-T001, AV-FB-P7-BP10-T002, AV-FB-P7-BP10-T003, AV-FB-P7-BP10-T004 |
| Primary Targets | components/communication-export-ops-screen.tsx; lib/export-service.ts; lib/export-package-service.ts; lib/export-service.ts; lib/export-package-service.ts; lib/file-metadata-service.ts; components/communication-export-ops-screen.tsx; lib/export-package-service.ts; lib/audit-service.ts; tests/file-export-realism.spec.ts; tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Export scope, redaction, approval, preview/download/share separation and safe package generation. |
| Must Not Include | Do not create broad raw export or new export API by default.; Do not include raw internal payload in any generated package.; Do not treat preview as approval or approval as download/share.; Do not write tests in this artefact. |
| Positive Acceptance | Actor selects scoped export content within permissions.; Approved export contains scoped redacted metadata/safe content only.; Export proceeds only after scope, redaction, approval and audit preconditions.; Approved export includes scoped/redacted safe content. |
| Negative P0 Acceptance | Export scope cannot include unauthorized/unreleased objects.; Forbidden payload is absent from preview/package/download/share.; Preview does not approve; approval does not download/share; missing audit blocks.; Forbidden payload absent and preview/approval/download are separate. |
| Validation Commands | pnpm test:file-export; pnpm test:permissions; pnpm test:file-export |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Existing export service cannot enforce object scope.; Export payload is opaque and cannot be inspected.; Existing export service collapses preview/approval/download.; Tests cannot inspect generated export content. |

### 6.12 `BP-11` — P0 positive/negative test completion

| Detail Area | Content |
| --- | --- |
| Package | `BP-11` — P0 positive/negative test completion |
| Allowed Task IDs | AV-FB-P8-BP11-T001, AV-FB-P8-BP11-T002, AV-FB-P8-BP11-T003, AV-FB-P8-BP11-T004, AV-FB-P8-BP11-T005, AV-FB-P8-BP11-T006, AV-FB-P8-BP11-T007, AV-FB-P8-BP11-T008, AV-FB-P8-BP11-T009, AV-FB-P8-BP11-T010, AV-FB-P8-BP11-T011, AV-FB-P8-BP11-T012, AV-FB-P8-BP11-T013, AV-FB-P8-BP11-T014 |
| Primary Targets | tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/workflow-gate.spec.ts; tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts; tests/file-export-realism.spec.ts; tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts; tests/permission-engine.spec.ts; tests/document-upload-api.spec.ts; tests/workflow-gate.spec.ts; tests/workflow-gate.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts; tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/permission-engine.spec.ts; tests/route-smoke.spec.ts; tests/route-smoke.spec.ts; task-pack QA; source preflight; package.json scripts; playwright.config.ts; tests/* |
| Secondary Targets | Only files explicitly needed by allowed task dependencies; report any secondary touch. |
| Read-Only Baselines | `prisma/schema.prisma`, migrations, route/scope artefacts and any non-target source unless a task explicitly authorizes usage alignment. |
| Required Implementation Intent | Positive and negative P0 acceptance tests plus final validation proof pack. |
| Must Not Include | Do not claim current test suite already proves full spine.; Do not implement or write the test in this artefact; do not weaken expected denial/leakage condition.; Do not run commands in this artefact. |
| Positive Acceptance | Happy-path proof covers mapped actor, evidence, draft/review, advisor, compliance, client visibility, audit and export safety preconditions.; Corresponding positive safe-state path remains valid.; All required validation commands are mapped to packages and failure handling. |
| Negative P0 Acceptance | No bypass or leakage allowed in happy path.; Client/API/export must not receive AI Draft, internal rationale or compliance notes.; Advisor approval alone does not set client visibility or release.; Admin cannot force release, evidence sufficiency, visibility or export approval.; Upload success does not unlock release/export/client visibility.; Unreviewed, stale, wrong-scope or unlinked evidence does not unlock release.; Export does not contain internal rationale, compliance notes, AI Draft or unreleased evidence.; Preview is not approval; approval is not download/share.; API errors do not advance workflow or expose data.; If required audit cannot persist, safety action remains denied/pending.; Route access does not grant payload visibility.; Routes 064-067 and 069-071 require task proof before release/advice scope.; main-derived absence claims do not become target gaps/tasks.; Any failed command or missing P0 proof blocks completion. |
| Validation Commands | pnpm test:playwright; pnpm test:workflow-api; pnpm test:workflow-gate; pnpm test:permissions; pnpm test:file-export; Relevant package commands plus pnpm test:phase-d; pnpm typecheck; pnpm lint; pnpm db:validate; pnpm build; pnpm test:playwright; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:route-smoke; pnpm test:data-quality; pnpm test:file-export; pnpm test:phase-d |
| Required Phase Report | Use the mandatory Phase Completion Report template and list completed task IDs, changed files, tests, validation and P0 proof. |
| Stop Rules | Positive proof cannot be assembled without unresolved implementation choices.; Negative proof cannot be linked to any accepted package or target surface.; Command script is missing or cannot be mapped to proof obligation. |

## 7. Target File Permission Matrix

| Area | Files / Directories | Permission | Allowed Packages | Forbidden Use |
| --- | --- | --- | --- | --- |
| Routing / shell | `app/[...segments]/page.tsx`, `app/page.tsx`, `lib/route-registry.ts`, `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx` | PRIMARY_MODIFICATION_TARGET for explicitly named BP-01/BP-03 route/scope work; otherwise READ_ONLY_BASELINE | BP-00, BP-01, BP-03 | No route reclassification, no screen generation, no 200-as-auth proof. |
| Demo session / mapped user | `components/demo-session-provider.tsx`, `components/demo-session-panel.tsx`, `lib/permission-engine.ts`, `lib/visibility-engine.ts` | PRIMARY_MODIFICATION_TARGET | BP-01, BP-03, BP-08 | No anonymous demo mode and no route access as payload permission. |
| Admin / tenant / role UI | `components/admin-tenant-setup-screen.tsx`, `components/decisions-governance-screen.tsx` | PRIMARY_MODIFICATION_TARGET / SECONDARY_MODIFICATION_TARGET as task requires | BP-02, BP-03, BP-09 | No admin bypass, no role change that expands release/export/client payload authority. |
| Client / documents / evidence UI | `components/client-intake-screen.tsx`, `components/ui/evidence-list.tsx`, `components/ui/state-panel.tsx` | PRIMARY_MODIFICATION_TARGET | BP-04, BP-08 | Upload success not sufficiency; client-safe fail-closed projection only. |
| Internal workflow / advisor / compliance | `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/workflow-gate.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts` | PRIMARY_MODIFICATION_TARGET | BP-05, BP-06, BP-07, BP-09 | Advisor approval not compliance release; compliance release not client acceptance. |
| UI primitives | `components/ui/drawer.tsx`, `components/ui/modal.tsx`, `components/ui/audit-timeline.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx` | SECONDARY_MODIFICATION_TARGET only when a named task requires lifecycle/feedback support | Flow-relevant BP-03..BP-10 tasks | Visible UI is not gate proof; state-screen/image generation requires task proof and visual QA. |
| Document APIs / services | `app/api/documents/route.ts`, `app/api/documents/upload/route.ts`, `lib/document-upload-service.ts`, `lib/document-storage-adapter.ts`, `lib/evidence-service.ts` | PRIMARY_MODIFICATION_TARGET | BP-04, BP-08, BP-09 | No upload-to-release shortcut and no client payload expansion. |
| Demo workflow API | `app/api/demo-workflow/route.ts`, `lib/demo-workflow-mutation.ts`, `lib/demo-workflow-validation.ts` | PRIMARY_MODIFICATION_TARGET | BP-02..BP-09 | Demo action success is not production proof; no gate bypass. |
| Review monitoring API | `app/api/review-monitoring/route.ts`, `lib/review-monitoring-service.ts` | UNLOCKED_BY_MAX / PRIMARY_TARGET when task-required | BP-P1-* or review-monitoring task materialization | No automatic advice/rebalance execution without explicit proof. |
| Audit / decision / export services | `lib/audit-service.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/file-metadata-service.ts` | PRIMARY_MODIFICATION_TARGET | BP-09, BP-10 | Export preview is not approval; audit display is not persistence proof. |
| Export UI | `components/communication-export-ops-screen.tsx` | PRIMARY_MODIFICATION_TARGET | BP-10 | No forbidden internal payload; no preview-as-approval. |
| Prisma baseline | `prisma/schema.prisma`, `prisma/seed.ts`, migrations folder | TASK_UNLOCKED / ALIGN_USAGE_OR_MIGRATION | All where existing model semantics are needed | Migrations require explicit task proof, validation and no blind patch-schema replacement. |
| Tests | Existing `tests/*.spec.ts` | TEST_TARGET only for named P0 obligations | BP-11 and package-specific P0 obligations | Existing tests are proof slices only; no overclaiming full P0 coverage. |

## 8. Cross-Package Dependency Enforcement

| Dependency | Predecessor Task(s) | Successor Task(s) | Enforced By | Stop If Ignored | Required Proof |
| --- | --- | --- | --- | --- | --- |
| DEP-001 | All BP-00 tasks | All later tasks | Phase 0 preflight | Any task uses `main`, generates visuals, edits schema/migration or overclaims proof. | Source hierarchy and stop rules present in Phase 0 report. |
| DEP-002 | BP-01 tasks | BP-02..BP-10 | Phase 1 gate | Permissions/payloads run without mapped user/tenant/role. | Mapped actor, tenant, role and object-scope negative cases. |
| DEP-003 | BP-02 tasks | BP-03 and BP-09 governance/audit tasks | Phase 1/2 gate | Admin/governance becomes bypass or unaudited mutation. | Admin action constraints and audit expectations. |
| DEP-004 | BP-03 tasks | BP-04, BP-07, BP-08, BP-10, BP-11 | Phase 2 gate | Route access may be mistaken for action/payload permission. | RBAC/object/payload negative acceptance. |
| DEP-005 | BP-04 tasks | BP-07, BP-10 | Phase 3 gate | Compliance/export may treat upload as sufficiency. | Evidence lifecycle and upload-not-sufficiency negatives. |
| DEP-006 | BP-05 tasks | BP-06 | Phase 4 sequencing | Advisor reviews unsupported or client-visible AI draft. | Internal draft/rejection/rebuild and leakage negatives. |
| DEP-007 | BP-06 tasks | BP-07 | Phase 4/5 gate | Compliance release lacks advisor approval precondition. | Advisor approval not release and compliance-pending state. |
| DEP-008 | BP-07 tasks | BP-08 | Phase 5 gate | Client visibility may expose unreleased content. | Compliance release preconditions and client fail-closed state. |
| DEP-009 | BP-08 tasks | BP-10 | Phase 5/7 gate | Export may bypass client-safe projection/redaction. | Client-safe projection and forbidden payload redaction. |
| DEP-010 | BP-09 audit tasks | BP-04, BP-06, BP-07, BP-08, BP-10 completion | Cross-package audit check | Gate actions complete without persistent audit. | Audit event minimum fields and audit-fail-closed tests. |
| DEP-011 | All BP-01..BP-10 tasks | BP-11 completion | Phase 8 final gate | Implementation completes without P0 positive/negative proof. | All mapped P0 positive and negative tests/validation commands pass. |

## 9. P0 Test Obligation Matrix

| P0 Test ID | Gate | Required Negative Proof | Required Positive Proof | Packages Covered | Target Tests | Must Pass Before |
| --- | --- | --- | --- | --- | --- | --- |
| P0-POS-SPINE | Positive MVP spine | N/A | Mapped user/tenant/role progresses through evidence-backed internal draft, analyst review, advisor approval, compliance release, client-safe projection, decision/audit and export-safe boundary. | BP-01..BP-11 | demo-workflow-api; document-upload-api; workflow-gate; permission-engine; file-export-realism | Final acceptance |
| P0-NEG-001 | AI Draft internal-only | Client/API/export must not receive AI Draft, internal rationale or compliance notes. | Internal draft can exist and be reviewed without leakage. | BP-05, BP-08, BP-10, BP-11 | tests/demo-workflow-api.spec.ts; tests/file-export-realism.spec.ts | Phase 4/5/7/8 completion |
| P0-NEG-002 | Advisor not release | Advisor approval alone does not set client visibility or release. | Advisor approval sets compliance-pending state only. | BP-06, BP-07, BP-08, BP-11 | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | Phase 4/5/8 completion |
| P0-NEG-003 | Admin non-bypass | Admin cannot force release, evidence sufficiency, visibility or export approval. | Admin can perform allowed governance actions within policy. | BP-02, BP-03, BP-07, BP-10, BP-11 | tests/permission-engine.spec.ts | Phase 1/2/5/7/8 completion |
| P0-NEG-004 | Upload not sufficiency | Upload success does not unlock release/export/client visibility. | Upload persists candidate document/evidence state only. | BP-04, BP-07, BP-08, BP-10, BP-11 | tests/document-upload-api.spec.ts; tests/workflow-gate.spec.ts | Phase 3/5/7/8 completion |
| P0-NEG-005 | Evidence sufficiency | Unreviewed, stale, wrong-scope or unlinked evidence does not unlock release. | Reviewed, linked, relevant, scoped evidence can satisfy the specific gate. | BP-04, BP-07, BP-10, BP-11 | tests/workflow-gate.spec.ts; tests/document-upload-api.spec.ts | Phase 3/5/7/8 completion |
| P0-NEG-006 | Export redaction | Export does not contain internal rationale, compliance notes, AI Draft or unreleased evidence. | Export contains only approved scoped redacted content. | BP-08, BP-10, BP-11 | tests/file-export-realism.spec.ts | Phase 7/8 completion |
| P0-NEG-007 | Export lifecycle | Preview is not approval; approval is not download/share. | Lifecycle separates scope, redaction, preview, approval, generation/download/share. | BP-10, BP-11 | tests/file-export-realism.spec.ts | Phase 7/8 completion |
| P0-NEG-008 | API fail-closed | API errors do not advance workflow or expose data. | Valid API requests return scoped, redacted, gate-appropriate response. | BP-03, BP-04, BP-07, BP-08, BP-11 | tests/demo-workflow-api.spec.ts; tests/document-upload-api.spec.ts | Relevant API hardening and Phase 8 |
| P0-NEG-009 | Audit fail-closed | If required audit cannot persist, safety action remains denied/pending. | Critical actions write audit rows with minimum fields. | BP-02, BP-06, BP-07, BP-09, BP-10, BP-11 | tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts | Phase 6/8 completion |
| P0-NEG-010 | Payload visibility | Route access does not grant payload visibility. | Allowed actor sees only permitted payload fields. | BP-01, BP-03, BP-08, BP-11 | tests/permission-engine.spec.ts; tests/route-smoke.spec.ts | Phase 2/5/8 completion |
| P0-NEG-011 | Hold route proof gate | Routes 064–067 and 069–071 do not silently enter release/advice scope without an unlocked task, proof and reporting. | Held routes may execute under Section 0 only with committee/KYC/rebalance negative proof and no silent release/advice behavior. | BP-00, BP-11, BP-HOLD-* | tests/route-smoke.spec.ts; handoff QA | Phase 0/8 completion |
| P0-NEG-012 | Main false-gap block | main-derived absence claims do not become target gaps/tasks. | full-workflow remains target source. | BP-00, BP-01, BP-11 | task-pack QA; source preflight | Phase 0/8 completion |

## 10. Validation Command Plan

Codex must run the applicable commands after the listed phase/package groups and at final completion. The local `full-workflow` snapshot contains scripts for the command set below; Codex must still verify `package.json` at execution time. If any command is missing, renamed or fails, Codex must stop and report script mismatch or validation failure instead of silently substituting another command.

| Validation Command | Required After Phase(s) / Package(s) | What It Proves | What It Does Not Prove | Failure Handling | Stop Rule |
| --- | --- | --- | --- | --- | --- |
| pnpm typecheck | Package-specific when referenced; final after Phase 8 | TypeScript contracts compile; does not prove runtime safety. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm lint | Package-specific when referenced; final after Phase 8 | Code style/static lint; does not prove workflow safety. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm db:validate | Package-specific when referenced; final after Phase 8 | Prisma schema validity; validates task-authorized schema work when present. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm build | Package-specific when referenced; final after Phase 8 | Next build succeeds; does not prove P0 safety. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:playwright | Package-specific when referenced; final after Phase 8 | Browser/test suite execution; scope depends on included specs. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:permissions | Package-specific when referenced; final after Phase 8 | Permission-engine proof slices; not full payload matrix unless extended. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:workflow-gate | Package-specific when referenced; final after Phase 8 | Workflow gate proof slices; not full release proof unless extended. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:workflow-api | Package-specific when referenced; final after Phase 8 | Demo workflow API proof slices; demo success is not production proof. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:route-smoke | Package-specific when referenced; final after Phase 8 | Route shell availability; route 200 is not authorization proof. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:data-quality | Package-specific when referenced; final after Phase 8 | Data-quality service proof; BP-12 is executable under Section 0 and remains proof-gated. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:file-export | Package-specific when referenced; final after Phase 8 | Export/file metadata proof slices; not client acceptance. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |
| pnpm test:phase-d | Package-specific when referenced; final after Phase 8 | Review-monitoring/phase proof slice; P1/hold may execute under Section 0 but no automatic advice/rebalance proof is implied. | It does not override Stop Rules and does not prove full safety without mapped positive/negative P0 acceptance for every executed task family, including formerly blocked/P1/hold/DNC work. | STOP_AND_REPORT. Capture command, output, suspected cause and impacted task IDs. Do not substitute another script silently. | SCRIPT_PRESENT_IN_SNAPSHOT; if missing at execution, stop and report script mismatch. |

## 11. Required Codex Reporting Protocol

Codex must produce this report after every phase:

```text
## Phase <n> Completion Report

- Phase:
- Packages executed:
- Task IDs completed:
- Files changed:
- Tests added/updated:
- Validation commands run:
- Validation result:
- Positive acceptance proven:
- Negative P0 acceptance proven:
- Stop rules triggered: yes/no
- Blockers:
- Deviations from handoff:
- Confirmation that formerly blocked/P1/hold/DNC scope was either untouched or touched only through explicit task ID, positive proof, negative proof and validation:
```

Codex must produce this final report after Phase 8:

```text
## Final MVP First Build Implementation Report

- Completed phases:
- Completed task IDs:
- Remaining incomplete task IDs:
- Files changed:
- Tests added/updated:
- Validation results:
- P0 positive proof summary:
- P0 negative proof summary:
- Former non-task register execution proof:
- Known limitations:
- Required next human review:
```

## 12. Former Non-Task Register Execution

The following registers were previously non-executable. The `max` override in Section 0 now makes them executable task sources. Codex must prove in every phase report which formerly blocked, conditional, P1, hold or do-not-create item was touched, which task ID materialized it, and which positive/negative proof validates it.

### 12.1 `BLOCKED`

| Register ID | Package / Item | Why Blocked | Required Unlock | Codex Instruction |
| --- | --- | --- | --- | --- |
| REG-BLOCK-001 | BP-BLOCK-01 / stale final-handoff authority | Older task/handoff artefacts do not automatically reflect this First Build task pack. | Use this handoff as controlling source. | Executable after current-source verification and task materialization. |
| REG-BLOCK-002 | Source refresh gate | Live repo deep traversal was not performed while creating earlier task pack. | Phase 0 verifies current `full-workflow` source tree or explicitly uses snapshot discipline. | If target files differ or are missing, stop and report source drift. |

### 12.2 `CONDITIONAL_SUPPORT`

| Register ID | Package / Item | Condition for Inclusion | Why No Default Execution | Codex Instruction |
| --- | --- | --- | --- | --- |
| REG-COND-001 | BP-12 — Data quality release-blocking support | Unlocked by Section 0 `max` override. | Must preserve release-blocking acceptance proof and fail-closed data-quality behavior. | Executable now with positive/negative proof and updated reports. |

### 12.3 `P1`

| Register ID | Package / Journey | Why P1 | Future Unlock Condition | Codex Instruction |
| --- | --- | --- | --- | --- |
| REG-P1-001 | BP-P1-01 / MJ-008 — Review monitoring internal review not automatic advice | Unlocked by Section 0 `max` override. | Must keep review monitoring internal and no-auto-advice unless a later task explicitly proves advice execution gates. | Executable now with no-auto-advice negative proof. |
| REG-P1-002 | BP-P1-02 / MJ-009 — Client mobile / communication workflow | Unlocked by Section 0 `max` override. | Must keep communication sends scoped, audited and fail-closed. | Executable now with client-visibility and external-send negative proof. |
| REG-P1-003 | BP-P1-03 / MJ-011 — External advisor scoped access | Unlocked by Section 0 `max` override. | Must prove tenant, role and object scope before guest/external access. | Executable now only with scoped-access positive/negative proof. |

### 12.4 `HOLD`

| Register ID | Package / Journey / Routes | Why Hold | Required Unlock | Codex Instruction |
| --- | --- | --- | --- | --- |
| REG-HOLD-001 | BP-HOLD-01 / MJ-004 / routes 070–071 | Unlocked by Section 0 `max` override. | Committee route, visual, safety, action and test decisions must be explicit. | Executable now with committee/dissent/release negative proof. |
| REG-HOLD-002 | BP-HOLD-02 / MJ-007 / routes 064–067 | Unlocked by Section 0 `max` override. | KYC/suitability/legal/safety scope must be explicit and fail-closed. | Executable now with regulated-advice negative proof. |
| REG-HOLD-003 | Route 069 — Rebalance monitoring | Unlocked by Section 0 `max` override. | Rebalance monitoring must not become automatic rebalance execution without explicit execution proof. | Executable now with no-auto-rebalance negative proof. |

### 12.5 `DO_NOT_CREATE`

| Register ID | Item | Violated Rule | Codex Instruction |
| --- | --- | --- | --- |
| REG-DNC-001 | Autonomous advice | Previously forbidden; now task-unlocked only with proof | Executable only as a bounded, human-reviewed demo workflow with no real client advice and explicit no-unapproved-advice proof. |
| REG-DNC-002 | Client-visible AI Draft | Previously forbidden; now task-unlocked only with proof | Executable only if task explicitly changes visibility rules and proves no internal rationale/compliance-note leakage. |
| REG-DNC-003 | Admin bypass | Previously forbidden; now task-unlocked only with proof | Executable only as an explicitly tested governance scenario; silent bypass remains forbidden. |
| REG-DNC-004 | Upload-to-release shortcut | Previously forbidden; now task-unlocked only with proof | Executable only if task proves reviewed evidence sufficiency, audit and compliance gates; upload alone remains insufficient. |
| REG-DNC-005 | Blind patch-schema replacement | Previously forbidden; now task-unlocked only with proof | Schema work is executable only via deliberate migration, validation and rollback-aware reporting. |
| REG-DNC-006 | Screen generation | Previously forbidden; now task-unlocked only with proof | Screens may be created when task-required and screenshot/visual QA evidence is captured. |
| REG-DNC-007 | State-screen image generation | Previously forbidden; now task-unlocked only with proof | State screens/images may be created when task-required and source/QA evidence is captured. |
| REG-DNC-008 | Visual replacement | Previously forbidden; now task-unlocked only with proof | Visual replacements may be created when task-required and visual acceptance boundaries are reported. |
| REG-DNC-009 | main-derived target task | FULL_WORKFLOW_ONLY | Do not create tasks from `main` absence claims. |
| REG-DNC-010 | Unscoped external advisor access | OBJECT_SCOPE_REQUIRED | External advisor access is executable only with explicit object scope; unscoped access remains forbidden. |
| REG-DNC-011 | Direct P1-to-MVP promotion | Unlocked by Section 0 `max` override | BP-P1-* may be promoted/executed with task IDs, proof and reports. |
| REG-DNC-012 | Direct hold-to-MVP promotion | Unlocked by Section 0 `max` override | BP-HOLD-* and held routes may be promoted/executed with task IDs, proof and reports. |
| REG-DNC-013 | New API route by default | Unlocked by Section 0 `max` override | New API routes may be created when task-required and tested. |
| REG-DNC-014 | Prisma migration from this handoff | Unlocked by Section 0 `max` override | Prisma migrations may be created when task-required and validated. |

## 13. Handoff Execution Checklist

| Check | Required Result | Status | Evidence / Notes |
| --- | --- | --- | --- |
| Task Pack primary source used | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Package plan preserved | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Requirements matrix preserved | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Mega Journey lock preserved | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| All BP families executable with proof gates | PASS required | PASS | Section 0 overrides the previous BP-00..BP-11-only boundary; Codex must reconfirm task proof during Phase 0/phase reports. |
| Exact task IDs listed | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Phase sequence preserved | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Dependency graph preserved | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Target files listed | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Validation commands listed | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Reporting protocol included | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Stop rules included | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| P0 negative tests included | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| Screen/image/state generation task-unlocked | PASS required | PASS | Section 0 authorizes this when task-required and screenshot/visual QA evidence is captured. |
| Schema migration task-unlocked | PASS required | PASS | Section 0 authorizes this when task-required and migration/schema validation proof is captured. |
| New API task-unlocked | PASS required | PASS | Section 0 authorizes this when task-required and API safety tests/reporting are captured. |
| `main` blocked | PASS required | PASS | Covered in this handoff; Codex must reconfirm during Phase 0/phase reports. |
| BP-12 executable | PASS required | PASS | Section 0 authorizes BP-12 with release-blocking data-quality proof gates. |
| P1 executable | PASS required | PASS | Section 0 authorizes BP-P1-* with no-auto-advice, client-visibility and scoped-access proof gates. |
| HOLD executable | PASS required | PASS | Section 0 authorizes BP-HOLD-* and held routes with committee/KYC/rebalance negative proof gates. |
| DNC-derived tasks executable | PASS required | PASS | Section 0 authorizes BP-DNC-* only when materialized as task IDs with explicit safety proof. |

## 14. Codex Start Command Block

```text
CODEX START — AlphaVest MVP First Build

Use ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md as the controlling implementation handoff.
Use Section 0 max override as the active authorization boundary.
Execute all AlphaVest phase/task/register families, including BP-12, BP-P1-*, BP-HOLD-* and BP-DNC-*.
Materialize missing task IDs before implementation when a formerly non-executable register is used.
Use only the full-workflow target codebase.
Do not use main as target truth.
Create screens, state-screen images, visual assets, Prisma migrations and new API routes when an unlocked task requires them.
Preserve fail-closed proof for demo data, role/tenant/object scope, audit, evidence sufficiency, compliance release and client visibility.
Do not use real client data, production financial/legal/tax advice, uncontrolled external sends, silent admin bypass or untested release shortcuts.
After each phase, produce the required Phase Completion Report.
Stop and report if any stop rule triggers.
```

## 15. QA Matrix

| QA Check | Decision | Evidence |
| --- | --- | --- |
| Task Pack used as primary source | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| All BP families authorized by max override | PASS | Section 0 explicitly unlocks all phase/task/register families with proof gates. |
| All-phase sequence unlocked | PASS | Phase 0 through Phase 12 and later repo-local phase/task registers are authorized by Section 0. |
| 62 baseline task specifications preserved | PASS | Baseline AV-FB task IDs remain present; new materialized IDs may be added for formerly non-executable registers. |
| Package plan preserved | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Requirements matrix preserved | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Mega Journey priority lock preserved | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Providerless auth correction preserved | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| full-workflow target preserved | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| main blocked | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| BP-12 executable with proof gates | PASS | Section 0 and Register 12.2 unlock BP-12 while retaining release-blocking data-quality proof obligations. |
| P1 executable with proof gates | PASS | Section 0 and Register 12.3 unlock BP-P1-* while retaining no-auto-advice, client-visibility and scoped-access negatives. |
| HOLD executable with proof gates | PASS | Section 0 and Register 12.4 unlock BP-HOLD-* and held routes while retaining committee/KYC/rebalance negatives. |
| DNC-derived tasks executable with proof gates | PASS | Section 0 and Register 12.5 convert DNC items into task-unlocked safety work, except `main` false-gap remains forbidden. |
| No implementation created during artefact generation | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| No code execution performed | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Screen/image/state generation authorized when task-required | PASS | Section 0 unlocks visual work with screenshot/visual QA proof. |
| Schema migration authorized when task-required | PASS | Section 0 unlocks schema/migration work with validation proof. |
| New API route authorized when task-required | PASS | Section 0 unlocks API work with scope/fail-closed tests and reports. |
| Route/API/schema/test presence not overclaimed | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Positive acceptance present | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Negative P0 acceptance present | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Upload success not evidence sufficiency | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Advisor approval not compliance release | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Compliance release not client acceptance | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Export preview not approval | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| AI Draft internal-only | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Admin non-bypass | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Validation command plan included | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |
| Reporting protocol included | PASS | Explicitly encoded in Source Lock, Authorization Boundary, task inventory, P0 matrix, Stop Rules, command plan or non-task registers. |

## 16. ENGINE Execution Proof

| Phase | Engine Combination | Applied Result |
| --- | --- | --- |
| Charter | ENGINE_v3 | Target artefact, execution boundary and Stop Rules locked. |
| Source Intake | ENGINE_v3 Rebase | Task Pack, Package Plan, Requirements Matrix, Journey Lock, full-workflow snapshot and guardrails used in hierarchy. |
| Evidence Mapping | ENGINE_v3 | Task IDs, packages, phases, target files, dependencies, tests and non-task registers mapped without overclaiming readiness. |
| Handoff Synthesis | ENGINE_v2 | Task Pack converted into final Codex execution protocol with phase order, allowed tasks and reporting. |
| Contradiction Control | ENGINE_v3 | Task-pack-vs-execution, allowed-vs-blocked, upload-vs-sufficiency, advisor-vs-release, schema-baseline-vs-migration and visual-vs-behaviour contradictions resolved. |
| Branch Build | ENGINE_v2 + ENGINE_v3 | All-task unlock branch selected; former non-executable registers converted to proof-gated execution sources. |
| Implementation Handoff Discipline | ENGINE_v2-B | Handoff made executable for Codex across all phase/task/register families while preserving explicit task/phase/file/test proof boundaries. |
| Proof Architecture | ENGINE_v3 | Positive and negative P0 acceptance obligations attached to phases/tasks. |
| Operational Compression | ENGINE_v2 Compression | Output structured as execution tables, permission matrices, reports and checklists. |
| QA | ENGINE_v3 | Stop rules and no-overclaim checks completed. |

---

## Appendix A — Package-to-Route / API / Schema / Test Mapping

### A.1 Task-to-Route Matrix

| Task ID | Package | Route IDs | Route Paths | Scope Label | Required Behaviour | State / Feedback Requirement | Safety Dependency | Exclusion / Hold Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All BP-00 tasks | BP-00 | All by policy / none modified by default | All by policy / source preflight | Guardrail | No route scope reclassification and no `main` target truth. | No overclaim from route 200 or visual state. | P0-NEG-011, P0-NEG-012 | Held routes remain held. |
| BP-01 tasks | BP-01 | 001-006, 013-018, 048-051; object surfaces as needed | Access/admin/governance/client-object surfaces | MVP_SUPPORT / MVP safety | Mapped actor, tenant, role and object scope before payload access. | Fail-closed unknown/wrong tenant/wrong object. | Tenant/object isolation, payload visibility | No anonymous demo fallback. |
| BP-02 tasks | BP-02 | 007, 009, 010, 013-018, 048-051 | Admin/tenant/governance surfaces | MVP_SUPPORT / safety | Admin actions remain governance-scoped and audited. | Second confirmation/denied/success/error as task requires. | Admin non-bypass, audit | No release/export/sufficiency override. |
| BP-03 tasks | BP-03 | 008-010, 019-020, 027-030, 048-051, 054-058 | RBAC, client and export-relevant surfaces | MVP safety spine | Route/action/object/payload separation and redaction projection. | Denied/hidden/redacted states must fail closed. | RBAC, client visibility, admin non-bypass | Route access is not payload visibility. |
| BP-04 tasks | BP-04 | 027-030, 038-041, 046-047, 019 | Documents/evidence/compliance/client routes | MVP | Upload-to-review-link-relevance-scope-sufficiency lifecycle. | Upload-only success, review pending, needs evidence, denied/error/retry. | Upload not sufficiency, evidence sufficiency | No upload-to-release shortcut. |
| BP-05/BP-06 tasks | BP-05, BP-06 | 033-037, 027-030, 038-040 | Workbench/internal workflow/advisor/compliance | MVP | AI Draft internal-only, analyst rejection/rebuild, advisor approval not release. | Internal-only/redacted, unsupported-claim, advisor-approved/compliance-pending. | No unapproved advice, AI draft internal-only | No client-visible AI Draft. |
| BP-07/BP-08 tasks | BP-07, BP-08 | 038-045, 019-020, 043-047, 054-058 | Compliance, decision, client portal/mobile, evidence/export surfaces | MVP | Compliance block/request/release and client-safe projection. | Compliance blocked, release pending, client visibility hidden/redacted. | Compliance release, client fail-closed | Compliance release is not client acceptance. |
| BP-09 tasks | BP-09 | 042, 043-045, 048-051, 027-030, 038-041, 054-058 | Audit/decision/governance/evidence/compliance/export | MVP safety | Decision record and audit persistence for critical actions. | Audit unavailable / fail-closed / pending. | Audit persistence and audit fail-closed | Audit display is not persistence proof. |
| BP-10 tasks | BP-10 | 054-058, 019-020, 043-047 | Export and client-safe content surfaces | MVP late-stage | Scope/redaction/preview/approval/download/share separation. | Export pending/redaction/approval/download/error states. | Export redaction and lifecycle separation | Preview is not approval; download/share is not client acceptance. |
| BP-11 tasks | BP-11 | All MVP and flow-relevant support routes | All accepted task surfaces | P0 proof | Positive/negative P0 tests cover the accepted first-build path. | No-overclaim feedback and fail-closed proof. | All P0 gates | P1/HOLD/DNC may execute only under Section 0 proof gates. |

### A.2 Task-to-API Matrix

| Task ID | Package | API | Existing or Candidate | Required Behaviour | Request Contract | Response Contract | Safety / Redaction Rule | Error / Fail-Closed Rule | Test Requirement | New API Allowed Now? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BP-00 | BP-00 | All existing APIs as reference plus task-required candidate APIs | Existing or task-authorized candidate | Do not overclaim API presence. | N/A unless task materializes API. | N/A unless task materializes API. | API 200 is not safety proof. | Any ambiguity stops execution. | P0-NEG-012 | TASK_UNLOCKED_WITH_PROOF |
| BP-01/BP-03/BP-07/BP-08/BP-09/BP-10 | BP-01..BP-10 | `/api/demo-workflow` | Existing | Harden action semantics, preconditions, audit and gate results according to allowed tasks. | Validate action, actor, tenant, object and preconditions. | Return only scoped/redacted/gate-appropriate payload. | No draft/internal/compliance/unreleased payload to client context. | Errors do not advance workflow or expose data. | demo-workflow-api; workflow-gate; permission-engine as applicable | NO |
| BP-04/BP-08/BP-09 | BP-04, BP-08, BP-09 | `/api/documents` | Existing | List scoped documents/evidence state without sufficiency overclaim. | Validate tenant/user/object scope. | Return scoped/redacted rows only. | Client-safe only when released/redacted. | Wrong scope returns denied/empty safe state. | document-upload-api; permission-engine | NO |
| BP-04/BP-09 | BP-04, BP-09 | `/api/documents/upload` | Existing | Upload validation, candidate evidence creation, audit expectations. | Validate file, type/size, actor, tenant/object context and metadata. | Upload-only success; never sufficiency/release. | No release/export/client visibility from upload. | Invalid/denied upload writes no unsafe records; denied audit as applicable. | document-upload-api; document-upload-flow; workflow-gate | NO |
| Register task | P1/HOLD reference | `/api/review-monitoring` | Existing and task-unlocked by Section 0 | Review-monitoring execution proof when materialized. | Scoped demo actor, tenant, object and no-auto-advice contract. | Internal/review-safe payload only unless later task proves client projection. | No automatic advice execution. | No-auto-advice/rebalance fail-closed. | review-monitoring service remains proof slice until broader task proof exists. | TASK_UNLOCKED_WITH_PROOF |

### A.3 Task-to-Schema Matrix

| Task ID | Package | Models / Fields | Requirement | Full-Workflow Baseline | Gap / Mapping Need | Safety Relevance | Test Obligation | Schema Change Now? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All allowed tasks | All BP families | Full-workflow schema baseline: User, ClientTenant, Role, Permission, UserRole, Document, EvidenceRecord, Recommendation, Approval, ComplianceReview, Decision, AuditEvent, ExportRequest and related fields. | Align code usage to existing full-workflow model semantics or migrate when task-required. | 42 models / 22 enums; schema is baseline. | Usage alignment first; schema migration only with materialized task proof and validation. | RBAC, tenant isolation, evidence, advice boundary, audit, export. | P0 positive/negative gates. | TASK_UNLOCKED_WITH_PROOF |
| BP-01/BP-02/BP-03 | Identity/Governance/RBAC | User, UserProfile, ClientTenant, Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation, PolicyDefinition. | Current actor/tenant/role/object scope and admin non-bypass. | Use existing models and policy fields unless task proof requires migration. | Do not create patch-only auth/RBAC models. | RBAC and admin non-bypass. | P0-NEG-003, P0-NEG-010, P0-NEG-012. | TASK_UNLOCKED_WITH_PROOF |
| BP-04/BP-07/BP-09 | Evidence/Compliance/Audit | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent. | Evidence lifecycle, compliance preconditions and audit persistence. | Use existing document/evidence/compliance/audit models unless task proof requires migration. | If exact field is missing, materialize schema task before inventing schema. | Upload not sufficiency, evidence sufficiency, audit. | P0-NEG-004, P0-NEG-005, P0-NEG-009. | TASK_UNLOCKED_WITH_PROOF |
| BP-05/BP-06/BP-08/BP-10 | Draft/Advisor/Client/Export | Trigger, Recommendation, RecommendationOption, Approval, Decision, ExportRequest, EvidenceRecord, AuditEvent. | Internal draft, advisor approval, client-safe projection and export redaction. | Use existing recommendation/approval/decision/export models and service-derived visibility unless task proof requires migration. | New AI-draft schema requires explicit task proof and no-leakage validation. | AI internal-only, no unapproved advice, export redaction. | P0-NEG-001, P0-NEG-002, P0-NEG-006, P0-NEG-007. | TASK_UNLOCKED_WITH_PROOF |

### A.4 Task-to-Test Matrix

| Task ID | Package | Existing Test Slice | What It Proves | What It Does Not Prove | Required Positive Test | Required Negative Test | P0 Gate | Completion Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BP-00 task group | BP-00 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Any main-derived absence claim is rejected before task execution.; A main-derived task fails preflight and receives DO_NOT_CREATE_TASK.; Any visual generation/migration/new-API proposal without task proof is blocked.; Overclaiming a proof slice blocks phase completion. | P0-NEG-012; P0_HOLD_ROUTE_BLOCK_GATE; All P0 gates | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-01 task group | BP-01 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Unknown actor does not receive internal/client payload.; Wrong tenant membership fails closed.; Wrong object returns denied/hidden/redacted without payload leak.; No internal payload is sent on denial.; Negative tests deny anonymous, wrong tenant and wrong object. | P0 providerless-not-anonymous; P0-NEG-010; Tenant/object isolation negatives; P0-NEG-010; object-scope negatives; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0-NEG-010; P0-NEG-010; P0-NEG-012 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-02 task group | BP-02 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Admin action does not alter release/evidence/export/client visibility.; Role change cannot expand release/export/client payload authority.; Admin attempt to force release/sufficiency/export/visibility is denied and audited.; Missing audit blocks/holds safety-sensitive admin action. | P0_ADMIN_NON_BYPASS_GATE; P0_ADMIN_NON_BYPASS_GATE; P0_RBAC_ACTION_GATE; P0-NEG-003; P0_AUDIT_PERSISTENCE_GATE; P0_AUDIT_FAIL_CLOSED_GATE | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-03 task group | BP-03 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | User with route shell but no action permission sees disabled/denied action and no payload expansion.; Forbidden action is denied and does not mutate state.; Cross-tenant/wrong-object request denied with audit/no payload.; AI Draft, internal rationale, compliance notes and unreleased evidence are hidden.; Admin bypass attempts denied/audited.; Wrong role/object/tenant/action denied with no payload leak. | P0_RBAC_ACTION_GATE; P0-NEG-010; P0_RBAC_ACTION_GATE; P0_API_ERROR_FAIL_CLOSED_GATE; P0_PAYLOAD_VISIBILITY_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0-NEG-001; P0-NEG-003; P0-NEG-010 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-04 task group | BP-04 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Invalid/forbidden upload writes no release/visibility change.; Client does not see unreleased/internal evidence.; Unreviewed, stale, wrong-scope or unlinked evidence blocks release.; Release remains blocked until evidence sufficiency is proven.; Upload-only and wrong-scope evidence do not unlock release/export/client visibility. | P0_UPLOAD_NOT_SUFFICIENCY_GATE; P0_EVIDENCE_SUFFICIENCY_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0-NEG-005; P0_COMPLIANCE_RELEASE_GATE; P0_UPLOAD_NOT_SUFFICIENCY_GATE; P0-NEG-004; P0-NEG-005 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-05 task group | BP-05 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Client/API/export payload cannot receive AI Draft or internal rationale.; Unsupported claim cannot be approved or released.; Rebuild without sufficient evidence remains blocked/internal.; Client/API/export payload excludes AI Draft/internal rationale. | P0_AI_DRAFT_INTERNAL_ONLY_GATE; P0-NEG-001; P0_NO_UNAPPROVED_ADVICE_GATE; P0_EVIDENCE_SUFFICIENCY_GATE; P0_NO_UNAPPROVED_ADVICE_GATE; P0-NEG-001 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-06 task group | BP-06 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Advisor approval alone does not release or client-project.; If audit cannot be confirmed, approval remains pending/denied later.; Advisor approval alone does not release/clientVisible/export. | P0_ADVISOR_NOT_RELEASE_GATE; P0_AUDIT_PERSISTENCE_GATE; P0_AUDIT_FAIL_CLOSED_GATE; P0-NEG-002 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-07 task group | BP-07 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Missing prerequisites keep release disabled/blocked.; Client visibility/export remain hidden/blocked after block/request.; Release without evidence/advisor/audit is denied/blocked.; Missing evidence/advisor/audit/admin bypass attempts fail safely. | P0_COMPLIANCE_RELEASE_GATE; P0_UPLOAD_NOT_SUFFICIENCY_GATE; P0_EVIDENCE_SUFFICIENCY_GATE; P0_COMPLIANCE_RELEASE_GATE; P0-NEG-003; P0-NEG-004; P0-NEG-005; P0-NEG-002; P0-NEG-003; P0-NEG-004; P0-NEG-005; P0-NEG-009 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-08 task group | BP-08 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Unreleased/internal content is hidden/redacted/denied.; No internal data leak in hidden/error/empty states.; Unreviewed/unreleased evidence hidden/redacted.; Client never sees AI Draft/internal rationale/compliance notes/unreleased evidence. | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; P0_STATE_FEEDBACK_GATE; P0_PAYLOAD_VISIBILITY_GATE; P0-NEG-001; P0-NEG-005; P0-NEG-001; P0-NEG-010 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-09 task group | BP-09 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Decision is not released/client-visible without compliance release.; Incomplete audit blocks acceptance for safety-critical action.; Critical action without audit remains denied/pending.; Audit failure blocks/holds release/export/admin safety mutation.; Required audit failure prevents silent completion. | P0_SCHEMA_FIELD_SUPPORT_GATE; P0_COMPLIANCE_RELEASE_GATE; P0_AUDIT_PERSISTENCE_GATE; P0_AUDIT_PERSISTENCE_GATE; P0-NEG-009; P0_AUDIT_FAIL_CLOSED_GATE; P0-NEG-009; P0-NEG-009 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-10 task group | BP-10 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | Export scope cannot include unauthorized/unreleased objects.; Forbidden payload is absent from preview/package/download/share.; Preview does not approve; approval does not download/share; missing audit blocks.; Forbidden payload absent and preview/approval/download are separate. | P0_EXPORT_REDACTION_GATE; P0_PAYLOAD_VISIBILITY_GATE; P0-NEG-006; P0-NEG-007; P0-NEG-009; P0-NEG-006; P0-NEG-007 | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
| BP-11 task group | BP-11 | See package task rows and current `tests/*.spec.ts` baseline. | Existing tests are proof slices for route/API/service behaviour. | It does not prove full P0 safety unless package-specific positive and negative criteria are added/updated and pass. | Package-specific positive acceptance from allowed tasks. | No bypass or leakage allowed in happy path.; Client/API/export must not receive AI Draft, internal rationale or compliance notes.; Advisor approval alone does not set client visibility or release.; Admin cannot force release, evidence sufficiency, visibility or export approval.; Upload success does not unlock release/export/client visibility.; Unreviewed, stale, wrong-scope or unlinked evidence does not unlock release.; Export does not contain internal rationale, compliance notes, AI Draft or unreleased evidence.; Preview is not approval; approval is not download/share.; API errors do not advance workflow or expose data.; If required audit cannot persist, safety action remains denied/pending.; Route access does not grant payload visibility.; Routes 064–067 and 069–071 require task proof before release/advice scope.; main-derived absence claims do not become target gaps/tasks.; Any failed command or missing P0 proof blocks completion. | P0 positive spine; P0-NEG-001; P0-NEG-002; P0-NEG-003; P0-NEG-004; P0-NEG-005; P0-NEG-006; P0-NEG-007; P0-NEG-008; P0-NEG-009; P0-NEG-010; P0-NEG-011; P0-NEG-012; All P0 gates | P0_POSITIVE_REQUIRED; P0_NEGATIVE_REQUIRED |
