# AlphaVest MVP Phase 4 Internal Draft Analyst Review Baseline

Date: 2026-06-20
Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
Phase: `4 - Internal Draft / Analyst Review / AI Internal-Only`
Execution status: `PHASE_4_COMPLETED_DOCS_ONLY`

## 1. Scope

Phase 4 locks the internal draft, analyst review and AI/rules internal-only contract for later MVP journey implementation. The controlling requirement is that AI/rules output may support internal preparation, but must never become client-visible, API-visible to client roles or export-visible as a draft/internal rationale payload. Unsupported claims must be rejectable, rebuildable with evidence and remain blocked from advisor/client release until later gates pass.

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
- `lib/visibility-engine.ts`
- `lib/export-service.ts`
- `lib/typed-workflow-command-bus.ts`
- `app/api/demo-workflow/route.ts`
- `components/internal-workflow-screen.tsx`
- `lib/internal-workflow-demo-data.ts`
- `tests/workflow-gate.spec.ts`
- `tests/client-visibility-proof.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `lib/domain-types.ts`
- `prisma/schema.prisma`

## 3. Phase 4 Stop Rules

| Rule | Result |
| --- | --- |
| No code change | Passed. No product TypeScript, API route, component or service implementation changed. |
| No test execution | Passed. Existing tests were inspected only as proof candidates. |
| No schema migration | Passed. `prisma/schema.prisma` and migrations were not changed. |
| No screen/state/image generation | Passed. No screenshots, route states, visual assets or generated images were created. |
| No Codex execution of downstream implementation | Passed. Phase 4 stayed at the contract/report layer. |
| No `main` target truth | Passed. Current `full-workflow` checkout and mega-journey source files remain the target truth. |

## 4. Current Source Reality

| Surface | Current reality | Phase 4 interpretation |
| --- | --- | --- |
| Workflow gate | `lib/workflow-gate.ts` blocks client visibility when `recommendationStatus` is `AI_DRAFT`, `containsAiDraft` is true or `containsInternalRationale` is true. | Strong service-level proof candidate for the no-unapproved-advice and AI-internal-only boundary. |
| Visibility projection | `lib/visibility-engine.ts` hides `clientSummaryDraft`, `summaryInternal`, `internalRationale`, `complianceNotes` and `assumptionsJson` from client roles and returns only `clientSummary` for released client-safe projections. | This is the main current source for route/API/client payload redaction semantics. |
| Export gate | `lib/export-service.ts` classifies `AI_DRAFT`, `INTERNAL_RATIONALE`, `COMPLIANCE_NOTES`, `UNRELEASED_EVIDENCE`, `UNRELEASED_RECOMMENDATION` and `HIDDEN_FIELD` as forbidden client export payloads. | Export safety already has a service-level forbidden-payload vocabulary; binary export generation remains separate and lower readiness. |
| Domain types/schema | `RecommendationStatus` includes `AI_DRAFT`, `ANALYST_REVIEWED`, `ADVISOR_PENDING`, `ADVISOR_APPROVED`, `COMPLIANCE_PENDING`, `RELEASED_TO_CLIENT` and blocked/rejected states. Prisma includes `Trigger`, `Recommendation`, `RecommendationOption`, `DocumentExtraction`, `EvidenceRecord` and `AuditEvent`. | State and model support exists. Model presence alone does not prove lifecycle execution. |
| Demo workflow J01 | `j01.requestData` keeps `clientVisible=false` on the canonical typed boundary (legacy compatibility bridge); `j01.routeToAdvisor` and `j01.approveAdvisor` now route to typed command boundaries. | Useful canonical typed boundary proof candidate for internal review and advisor-not-release separation, but not a generalized unsupported-claim payload workflow. |
| Typed recommendation review workflow | `/api/demo-workflow` supports `workflowType: recommendation-review` paths for analyst submit, advisor approve and compliance release/block/request-evidence. | Stronger proof candidate for persisted review transitions; Phase 4 did not rerun or expand it. |
| Internal workflow UI/data | `components/internal-workflow-screen.tsx` and `lib/internal-workflow-demo-data.ts` show internal queues, AI draft copy, missing data and release gates. | UI/state surfaces exist, but this phase does not claim visual acceptance or payloaded analyst-review capability. |
| Tests | Existing proof candidates cover internal projection, client-hidden AI draft, forbidden export payloads, advisor-not-release and some recommendation-review persistence. | Tests were inventoried only and were not run in this phase. Unsupported-claim rejection/rebuild-with-evidence negatives remain incomplete. |

## 5. Capability Position

| Capability | Current level | Target later level | Non-claim boundary |
| --- | ---: | ---: | --- |
| Internal draft classification | E6 service proof candidate | E6 with rerun tests; E7 only after payloaded draft/source records persist and reload | No production AI integration, prompt execution or autonomous advice is claimed. |
| Analyst unsupported-claim rejection | E5-E6 partial demo/review workflow candidate | E6/E7 with typed unsupported-claim reason, evidence request/link and reload proof | Current surfaces do not prove generalized unsupported-claim rejection from arbitrary draft payloads. |
| Rebuild-with-evidence transition | E5-E6 candidate through evidence and review workflow foundations | E7 only when rebuilt draft references accepted evidence through a payloaded service and reload proof | Rebuild cannot rely on a status chip, route copy or fixture-only action. |
| Client/API draft redaction | E6 service/test candidate | E6 with rerun tests; E7 only with route/API payload proof across client surfaces | Client route 200 or shell rendering is not proof that internal fields are hidden. |
| Export forbidden draft payloads | E6 service/test candidate | E6 with rerun tests; E7 only after generated export package proof | Metadata-only export safety is not binary export readiness. |
| Advisor review after rebuild | E6 candidate for advisor-not-release | Phase 5 must lock advisor approval as human approval only | Phase 4 does not claim advisor approval, compliance release or client visibility completion. |

## 6. Internal Draft Lifecycle Contract

Later implementation must preserve this lifecycle ordering:

```text
internal_signal_or_rules_draft
-> analyst_reviews_source_and_claims
-> unsupported_claim_rejected_or_data_requested
-> evidence_requested_or_linked
-> draft_rebuilt_with_accepted_evidence
-> advisor_review_candidate
-> compliance_pending_or_blocked
```

Hard boundaries:

- AI/rules draft is internal preparation, not advice and not client-safe summary.
- Internal draft fields include draft text, working summary, internal rationale, assumptions, model/source metadata, compliance notes and unsupported-claim rationale.
- Analyst review may route, reject, request evidence or rebuild, but none of those actions creates client visibility.
- Rebuild-with-evidence requires accepted, scoped evidence from Phase 3 before later gates can treat the package as review-ready.
- Advisor approval remains a later Phase 5 gate and must not be treated as release.
- Client/API/export projections must exclude AI draft, internal rationale, compliance notes and unreleased evidence/recommendations.

## 7. Phase 4 Task Closure

| Task | Phase 4 result |
| --- | --- |
| `AV-MVP-P4-T001` Define internal draft classification and data projection boundaries. | Completed as contract. Draft/internal fields and projection boundaries are documented and mapped to current visibility/workflow surfaces. |
| `AV-MVP-P4-T002` Specify analyst unsupported-claim rejection lifecycle. | Completed as contract. Analyst rejection/request-evidence obligations are defined; generalized payload workflow remains later work. |
| `AV-MVP-P4-T003` Specify rebuild-with-evidence transition. | Completed as contract. Rebuilt draft must reference accepted/scoped evidence; rebuild without evidence remains blocked/internal. |
| `AV-MVP-P4-T004` Define draft redaction across client and export surfaces. | Completed as contract. Client/export payloads must exclude draft/internal rationale and use released summary only after later gates. |
| `AV-MVP-P4-T005` Map AI draft internal-only negative tests. | Completed as test map. Existing visibility/export/workflow tests are proof candidates; no tests were added or run. |

## 8. P0 Acceptance Test Map

Later P0 acceptance must include or preserve:

| Test obligation | Candidate current surface |
| --- | --- |
| Internal roles can view scoped internal draft payloads where authorized. | `visibilityEngine.projectRecommendationPayload`; `tests/client-visibility-proof.spec.ts`; `tests/p0-acceptance.spec.ts`. |
| Client roles cannot see `AI_DRAFT`, draft summary, internal rationale, compliance notes or assumptions before release. | `visibilityEngine.projectRecommendationPayload`; client visibility proof tests. |
| Client-safe release projection includes only released `clientSummary`. | `visibilityEngine.projectRecommendationPayload`; P0 acceptance tests. |
| Export payload classification rejects `AI_DRAFT` and `INTERNAL_RATIONALE`. | `exportService.forbiddenExportPayloads`; `tests/file-export-realism.spec.ts`; P0 tests. |
| Workflow gate blocks client visibility when AI draft/internal rationale is present. | `canBecomeClientVisible`; `tests/workflow-gate.spec.ts`. |
| Analyst submit/review transition persists without client visibility. | `tests/demo-workflow-api.spec.ts` typed recommendation review workflow. |
| Unsupported claim rejection requires evidence and remains blocked/internal until rebuilt. | Later test required; no complete generalized proof candidate found. |
| Rebuild-with-evidence cannot proceed without accepted, scoped evidence. | Later test required; reuse Phase 3 evidence sufficiency evaluator. |
| Advisor approval after rebuild remains compliance-pending and not client-visible. | Existing advisor-not-release tests; Phase 5 must lock the full gate. |

## 9. Impact Matrix

| Area | Phase 4 decision |
| --- | --- |
| Routes `033-037`, `019-020`, `054-058` | No route changed. These remain affected surfaces for later internal draft, client projection and export redaction proof. |
| APIs `/api/demo-workflow`, `/api/documents` | No API changed. Current demo workflow and visibility/export services are proof candidates; future internal draft API remains unauthorized until explicit handoff. |
| Schema/models | No schema changed. `Trigger`, `Recommendation`, `RecommendationOption`, `DocumentExtraction`, `EvidenceRecord`, `DocumentLink`, `AuditEvent`, `Decision` and `ExportRequest` remain the relevant model set. |
| Services/components | No service/component changed. `workflow-gate`, `visibility-engine`, `typed-workflow-command-bus`, `export-service` and internal workflow UI/data remain relevant proof surfaces. |
| Tests | No tests changed or run. `workflow-gate.spec.ts`, `client-visibility-proof.spec.ts`, `file-export-realism.spec.ts`, `demo-workflow-api.spec.ts`, `p0-acceptance.spec.ts`, `permission-engine.spec.ts` and `ui-state-boundaries.spec.ts` remain proof candidates. |

## 10. Exit Gate Decision

`PHASE_4_EXIT_PASSED_WITH_DOCUMENTED_LIMITATIONS`

Phase 4 passes because the internal draft, analyst review and AI-internal-only contract is now explicit, mapped to current source surfaces and constrained by the plan stop rules. The exit gate does not claim fresh test proof, generalized unsupported-claim workflow, production AI integration, payloaded draft rebuild, advisor approval completion, compliance release, client visibility, binary export readiness or full P0 closure.
