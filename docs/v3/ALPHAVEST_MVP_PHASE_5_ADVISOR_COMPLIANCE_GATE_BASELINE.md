# AlphaVest MVP Phase 5 Advisor Compliance Gate Baseline

Date: 2026-06-20
Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
Phase: `5 - Advisor Approval -> Compliance Gate`
Execution status: `PHASE_5_DOCS_ONLY_BASELINE_SUPERSEDED_BY_IMPLEMENTATION`

Superseded by: `docs/v3/ALPHAVEST_MVP_PHASE_5_ADVISOR_COMPLIANCE_GATE_IMPLEMENTATION.md`

## 1. Scope

Phase 5 locks the advisor approval, compliance review, compliance block/request-evidence and compliance release contract for later MVP journey implementation. The controlling requirement is that advisor approval is human review only. It may move a recommendation toward compliance review, but must never release client visibility. Compliance release remains the client-visibility control point and requires advisor approval, evidence sufficiency, permission, audit and payload readiness.

This phase is a source-grounded documentation and acceptance-contract phase only. It does not implement product behavior, run tests, change routes, create APIs, alter Prisma schema, execute migrations, generate screenshots, generate images or target `main` as source truth.

## 2. Source Files Read

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `mega_journeys_1/ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`
- `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`
- `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_0_SOURCE_REALITY_BASELINE.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_1_PROVIDERLESS_SCOPE_BASELINE.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_2_GOVERNANCE_NON_BYPASS_BASELINE.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_3_EVIDENCE_INTAKE_REVIEW_SUFFICIENCY_BASELINE.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_4_INTERNAL_DRAFT_ANALYST_REVIEW_BASELINE.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`
- `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md`
- `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md`
- `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md`
- `lib/workflow-gate.ts`
- `lib/typed-workflow-command-bus.ts`
- `app/api/recommendation-review-workflow/route.ts`
- `lib/audit-service.ts`
- `lib/visibility-engine.ts`
- `tests/recommendation-review-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `prisma/schema.prisma`

## 3. Phase 5 Stop Rules

| Rule | Result |
| --- | --- |
| No code change | Passed. No product TypeScript, API route, component or service implementation changed. |
| No test execution | Passed. Existing tests were inspected only as proof candidates. |
| No schema migration | Passed. `prisma/schema.prisma` and migrations were not changed. |
| No screen/state/image generation | Passed. No screenshots, route states, visual assets or generated images were created. |
| No Codex execution of downstream implementation | Passed. Phase 5 stayed at the contract/report layer. |
| No `main` target truth | Passed. Current `full-workflow` checkout and mega-journey source files remain the target truth. |

## 4. Current Source Reality

| Surface | Current reality | Phase 5 interpretation |
| --- | --- | --- |
| Workflow gate | `lib/workflow-gate.ts` requires released recommendation state, advisor approval, compliance release, sufficient evidence and permission before client visibility can pass. | Strong service-level proof candidate for advisor-not-release and compliance-release preconditions. |
| Typed recommendation-review workflow | `lib/typed-workflow-command-bus.ts` maps analyst submit, advisor approve, compliance release, compliance block and request evidence to typed roles, state transitions, audit rows and reload state. | Strong bounded demo proof candidate. Phase 5 did not rerun or expand these tests. |
| Advisor approval mutation | `advisor_approve` updates `Approval` to `APPROVED`, `Recommendation` to `ADVISOR_APPROVED`, resets compliance review to `PENDING` and preserves `clientVisible=false`. | Advisor approval is represented as human review only, not release. |
| Compliance release mutation | `compliance_release` requires exact confirmation text, advisor approval, an evidence record, workflow-gate pass and compliance actor permission before setting `Recommendation.RELEASED_TO_CLIENT` and `clientVisible=true`. | Release path has a bounded positive proof candidate, but full route/API/client projection proof remains later work. |
| Compliance block/request evidence | `compliance_block` and `request_evidence` keep `clientVisible=false`, update `ComplianceReview` and `Recommendation`, and write audit results. | Block/request-evidence lifecycle exists as a typed demo proof candidate. |
| Typed J01 advisor-review boundary | `j01.requestData`, `j01.routeToAdvisor` and `j01.escalateAdvisor` run through `/api/advisor-review/actions` with `clientVisible=false`; advisor approval remains separate from compliance release. | Useful canonical typed boundary continuity and advisor-not-release proof candidate. |
| Visibility projection | `lib/visibility-engine.ts` still derives client-safe payload from release/redaction state and hides internal fields. | Phase 5 can define release preconditions; Phase 6 must lock full client projection. |
| Schema | Prisma includes `Approval`, `Recommendation`, `ComplianceReview`, `Decision`, `EvidenceRecord` and `AuditEvent`. | Schema supports the gate. Schema presence alone is not proof that every route/API state is operational. |
| Tests | Existing proof candidates cover advisor approval without release, compliance release failing before prerequisites, successful release after gates, block/request-evidence audit, and service-level advisor-not-release gates. | Tests were inventoried only and were not run in this phase. |

## 5. Capability Position

| Capability | Current level | Target later level | Non-claim boundary |
| --- | ---: | ---: | --- |
| Advisor approval as human review | E6 bounded workflow candidate | E6 with rerun tests; E7 only with payloaded advisor note/reload proof across route/API | Advisor approval is not compliance release, client visibility or client acceptance. |
| Compliance precondition matrix | E6 service/workflow candidate | E6/E7 with rerun tests and route/API coverage for missing advisor/evidence/audit/payload readiness | A release button, modal or status chip is not release proof. |
| Compliance block/request evidence | E6 typed workflow candidate | E7 only with payloaded evidence request, durable visible state and reload proof | Block/request-evidence does not create client visibility or export readiness. |
| Decision creation after release | E5-E6 partial candidate | Later E6/E7 after released decision projection, audit and no-client-acceptance overclaim proof | Compliance release is not client acceptance or family decision completion. |
| Advisor/compliance positive and negative suite | Proof candidate only | Later P0 pass after tests are rerun and missing negatives are expanded | This phase maps tests only and does not run them. |

## 6. Advisor To Compliance Gate Contract

Later implementation must preserve this lifecycle ordering:

```text
analyst_reviewed_internal_material
-> advisor_reviews_and_approves_or_escalates
-> compliance_pending
-> compliance_blocks_or_requests_evidence_or_releases
-> released_client_safe_projection
-> later_client_decision
```

Hard boundaries:

- Advisor approval is human review only. It may set `ADVISOR_APPROVED` or compliance-pending state, but must keep `clientVisible=false`.
- Compliance release requires compliance actor authority, exact confirmation where configured, advisor approval, evidence sufficiency, permission, audit and payload readiness.
- Missing advisor approval, missing evidence, insufficient evidence, invalid confirmation, wrong actor, admin bypass or audit failure must block release.
- Compliance block and request-evidence are explicit states. They do not release, export, create client visibility or imply acceptance.
- A released decision or released recommendation may create a client-safe projection only after release and redaction/visibility checks.
- Compliance release is not client acceptance, family approval, download/share, suitability approval or production advice execution.

## 7. Phase 5 Task Closure

| Task | Phase 5 result |
| --- | --- |
| `AV-MVP-P5-T001` Specify advisor approval action as human approval only. | Completed as contract. Advisor approval moves toward compliance and keeps client visibility blocked. |
| `AV-MVP-P5-T002` Specify compliance review precondition matrix. | Completed as contract. Compliance release requires advisor approval, evidence sufficiency, permission, audit and payload readiness. |
| `AV-MVP-P5-T003` Specify compliance block/request evidence lifecycle. | Completed as contract. Block/request-evidence states remain visible and fail closed for client release. |
| `AV-MVP-P5-T004` Specify decision creation after compliance release. | Completed as contract. Released decision projection is separate from client acceptance and belongs to later client-visibility/decision proof. |
| `AV-MVP-P5-T005` Map advisor/compliance positive and negative tests. | Completed as test map. Existing workflow/P0 tests are proof candidates; no tests were added or run. |

## 8. P0 Acceptance Test Map

Later P0 acceptance must include or preserve:

| Test obligation | Candidate current surface |
| --- | --- |
| Advisor approval persists and keeps `clientVisible=false`. | `runRecommendationReviewWorkflowMutation`; `tests/recommendation-review-workflow-api.spec.ts`. |
| Advisor-only state fails client visibility gate. | `workflowGate.canBecomeClientVisible`; `tests/workflow-gate.spec.ts`; `tests/p0-acceptance.spec.ts`. |
| Compliance release fails before advisor/evidence/preconditions. | Typed recommendation-review workflow tests. |
| Invalid release confirmation fails before mutation. | Typed recommendation-review workflow tests. |
| Compliance release after advisor approval, sufficient evidence and permission sets released recommendation/compliance state. | Typed recommendation-review workflow tests. |
| Compliance block keeps recommendation blocked and not client-visible. | Typed recommendation-review workflow tests. |
| Request-evidence moves compliance to needs-evidence/more-data and keeps client hidden. | Typed recommendation-review workflow tests. |
| Admin or broad role cannot force compliance release. | Permission engine/admin non-bypass tests; Phase 2 proof candidates. |
| Audit persistence failure blocks sensitive release/block/request-evidence action. | Existing mutation fail-closed seams where applicable; later route/API proof still required. |
| Compliance release does not imply client acceptance or export/download/share. | Later Phase 6/8 tests required. |

## 9. Impact Matrix

| Area | Phase 5 decision |
| --- | --- |
| Routes `036-042`, `043-045`, `019-020` | No route changed. These remain affected surfaces for later advisor approval, compliance review, release, decision and client projection proof. |
| API `/api/recommendation-review-workflow` | No API changed. Current typed recommendation-review workflow is a proof candidate; future release APIs remain unauthorized until explicit handoff. |
| Schema/models | No schema changed. `Approval`, `Recommendation`, `ComplianceReview`, `Decision`, `EvidenceRecord` and `AuditEvent` remain the relevant model set. |
| Services/components | No service/component changed. `workflow-gate`, `typed-workflow-command-bus`, `audit-service` and `visibility-engine` remain relevant proof surfaces. |
| Tests | No tests changed or run. `workflow-gate.spec.ts`, `recommendation-review-workflow-api.spec.ts`, `p0-acceptance.spec.ts` and permission/admin non-bypass tests remain proof candidates. |

## 10. Exit Gate Decision

`PHASE_5_EXIT_PASSED_WITH_DOCUMENTED_LIMITATIONS`

Phase 5 passes because the advisor approval to compliance gate contract is now explicit, mapped to current source surfaces and constrained by the plan stop rules. The exit gate does not claim fresh test proof, route-level release proof, production authorization, full client projection, client acceptance, export readiness, binary package delivery, audit fail-closed coverage across every path or full P0 closure.
