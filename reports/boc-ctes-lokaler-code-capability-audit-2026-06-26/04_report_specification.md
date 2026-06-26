# Report Specification, Evidence Rules And Acceptance Criteria

Ticket: `SPEC-1`  
Status: `DONE`  
Purpose: conservative local capability taxonomy for the final report.

## Evidence Hierarchy

| Level | Label | Meaning | Can support `COMPLETE_VERTICAL_SLICE`? |
| --- | --- | --- | --- |
| E0 | `EXCLUDED_OR_UNKNOWN` | Not local, stale, external, uninspected or excluded. | No |
| E1 | `DOC_CLAIM` | Documentation/planning/report statement only. | No |
| E2 | `CODE_STATIC` | Local source code shows route/component/service/schema/test intent. | No by itself |
| E3 | `CODE_LINKED` | UI/API/service/DB layers are statically linked by local code. | Candidate only |
| E4 | `TEST_INTENT` | Local tests assert the behavior but were not run in this audit. | Candidate only |
| E5 | `RUNTIME_PROVEN_THIS_RUN` | Command/test/browser/API proof was executed during this audit. | Yes, if all required layers are also present |
| E6 | `RUNTIME_AND_ARTIFACT_PROVEN` | Current-run proof plus artifact/screenshot/log/report bundle. | Yes |

Current-run E5 evidence so far: `pnpm guard:source` PASS; `pnpm db:validate` PASS; `pnpm exec playwright test tests/schema-alignment.spec.ts tests/export-command-spine-contract.spec.ts tests/true-ux-api-service-ui-truth.spec.ts tests/demo-workflow-action-registry.spec.ts tests/tenant-governance-actions-api.spec.ts tests/platform-admin-actions-api.spec.ts tests/platform-admin-command-client-source.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1` PASS (`28/28`).

## Capability Status Labels

| Status | Definition |
| --- | --- |
| `COMPLETE_VERTICAL_SLICE` | UI entry, API/handler, service/workflow, DB or justified non-persistence, guard/audit/visibility and current-run test/runtime proof are all present. |
| `STRONG_VERTICAL_CANDIDATE` | UI/API/service/DB/guard layers are statically present and local tests exist, but current-run execution is missing. |
| `API_BACKED_PARTIAL` | Real API/service/DB path exists, but a layer is missing, unrun, not directly UI-bound or not fully guarded/test-proven. |
| `DEMO_COMMAND_BACKED_PARTIAL` | Mutation exists through `/api/demo-workflow` or screencast action IDs; real for demo state, but not general product editability. |
| `SERVICE_BACKED_INTERNAL` | Service or command bus mutates/guards data, but UI binding or user-facing workflow is indirect. |
| `READMODEL_ONLY` | Read API/service exists; no write/edit workflow proven. |
| `UI_ONLY_STATIC` | UI visible, but no local mutation/handler proof; includes explicit static-control notes. |
| `BLOCKED_UI_SAFETY_STATE` | UI intentionally disables or blocks action due to safety/permission/workflow state. |
| `SCHEMA_ONLY` | Prisma model/field exists, but no local UI/API/service operation found. |
| `UNPROVEN` | Insufficient evidence for a capability claim. |

## Complete Vertical Slice Criteria

No capability may be marked `COMPLETE_VERTICAL_SLICE` unless every criterion below is satisfied:

1. UI route/screen/action is locally identified.
2. Handler/API or server-side callable path is locally identified.
3. Service/domain workflow path is locally identified.
4. Persistence path is locally identified, or the report explains why persistence is not expected.
5. Guard layer is locally identified: permission, visibility, validation, workflow gate, audit or fail-closed boundary as applicable.
6. Positive proof exists: current-run test/API/browser/command execution.
7. Negative proof exists for sensitive actions: no unauthorized release, no client leakage, no silent state advance, no mutation on invalid input.
8. Output state and user-visible claim do not overclaim beyond the proven layers.

Because this audit executed source/schema/export static-contract proof but not full DB/browser vertical suites for every product flow, this report should avoid broad `COMPLETE_VERTICAL_SLICE` claims for product capabilities unless a focused end-to-end test is executed in the same run.

## Required Report Sections

1. Executive Summary.
2. Source and Exclusion Rules.
3. Capability Matrix.
4. Vertical Slice Matrix.
5. UI/Input/Editability Matrix.
6. API/Service/Workflow Matrix.
7. DB/Editability/Persistence Matrix.
8. Security/Guard/Audit/Test Matrix.
9. Overclaim Risk Register.
10. Bold Legacy-Cleanup Recommendations.
11. QA / Claim Validation.
12. Human Decision Gate.

## Acceptance Criteria

| Criterion | Required result |
| --- | --- |
| Local evidence only | Every project fact has local code/test/runtime evidence or is marked as assumption/gap. |
| No stale context contamination | Prior reports/docs/memory are not used as code fact. |
| Conservative complete claims | No `COMPLETE_VERTICAL_SLICE` without current-run proof. |
| UI static separation | UI-only/static/disabled controls are explicitly separated from mutations. |
| Schema-only separation | Schema breadth is not treated as editability. |
| Test honesty | Unrun tests are listed as local proof intent, not pass claims. |
| Safety honesty | Client visibility, advice, release, export and admin bypass claims require guard and negative proof. |
| Decision readiness | Report ends with baseline acceptance options and follow-up authorization state. |

## QA Logic

QA decision labels:

| QA decision | Meaning |
| --- | --- |
| `PASS` | Report meets spec with no material limitation. |
| `PASS_WITH_LIMITATIONS` | Report meets spec, but some claims remain static/unrun or runtime proof is limited. |
| `NEEDS_REWORK` | Report structure is useful but overclaims or missing evidence must be corrected. |
| `FAIL` | Report cannot be used as baseline. |

Expected decision for this run: `PASS_WITH_LIMITATIONS`, with stronger current-run proof for source hierarchy, schema alignment and export UI/API command-spine truth.
