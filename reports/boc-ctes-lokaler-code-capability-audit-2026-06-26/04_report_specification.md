# Report Specification, Evidence Rules And Acceptance Criteria

Ticket: `SPEC-1`
Status: `DONE`
Purpose: define the local capability reality report so it can be produced without interpretation drift or overclaiming.

## Scope

This specification governs the report produced from:

- `01_source_inventory.md`
- `02_codebase_inventory.md`
- `03_capability_analysis.md`
- current-run command/test evidence recorded in `10_current_ordered_execution_report.md`

Out of scope:

- product feature implementation,
- schema or migration changes,
- release certification,
- external project facts,
- treating old reports, generated JSON or PDF/Markdown source layers as code truth unless locally revalidated.

## Evidence Hierarchy

| Level | Label | Meaning | Can support `COMPLETE_VERTICAL_SLICE`? |
| --- | --- | --- | --- |
| E0 | `EXCLUDED_OR_UNKNOWN` | Not local, stale, external, uninspected or excluded. | No |
| E1 | `DOC_CLAIM` | Documentation/planning/report statement only. | No |
| E2 | `CODE_STATIC` | Local source code shows route/component/service/schema/test intent. | No by itself |
| E3 | `CODE_LINKED` | UI/API/service/DB layers are statically linked by local code. | Candidate only |
| E4 | `TEST_INTENT` | Local tests assert the behavior but were not run in this audit. | Candidate only |
| E5 | `RUNTIME_PROVEN_THIS_RUN` | Command/test/browser/API proof was executed during this audit. | Yes, if all required layers are also present |
| E6 | `RUNTIME_AND_ARTIFACT_PROVEN` | Current-run proof plus screenshot/log/report bundle where relevant. | Yes |

Current-run E5 evidence for this execution:

```text
pnpm guard:source
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1
```

Current-run proof result:

- Source guard: `PASS`, `violations: 0`.
- Drift proof pack: `12 passed`.
- No UI was changed in the completed analysis/spec tickets, so no screenshot is required for these tickets.

## Capability Status Labels

| Status | Definition |
| --- | --- |
| `COMPLETE_VERTICAL_SLICE` | UI entry, API/handler, service/workflow, DB or justified non-persistence, guard/audit/visibility and current-run positive and negative proof are all present. |
| `STRONG_VERTICAL_CANDIDATE` | UI/API/service/DB/guard layers are statically present and local tests exist, but full current-run end-to-end execution is missing. |
| `API_BACKED_PARTIAL` | Real API/service/DB path exists, but a layer is missing, unrun, indirectly UI-bound or not fully guarded/test-proven. |
| `TYPED_COMMAND_BACKED_PARTIAL` | Typed command endpoint/client/service exists and is no longer routed through `/api/demo-workflow`, but full vertical runtime proof is incomplete. |
| `SERVICE_BACKED_INTERNAL` | Service or command bus mutates/guards data, but UI binding or user-facing workflow is indirect. |
| `READMODEL_ONLY` | Read API/service exists; no write/edit workflow is proven. |
| `UI_ONLY_STATIC` | UI visible, but no local mutation/handler proof; includes explicit static-control notes. |
| `BLOCKED_UI_SAFETY_STATE` | UI intentionally disables or blocks action due to safety/permission/workflow state. |
| `SCHEMA_ONLY` | Prisma model/field exists, but no local UI/API/service operation was found. |
| `LEGACY_DEMO_410_BOUNDARY` | `/api/demo-workflow` or screencast support exists only as a fail-closed legacy boundary; no direct product or demo-only mutation may execute there. |
| `UNPROVEN` | Insufficient evidence for a capability claim. |

Forbidden status usage:

- Do not classify product-like Jxx commands as `DEMO_COMMAND_BACKED_PARTIAL`.
- Do not use `/api/demo-workflow` as a product API layer.
- Do not use `COMPLETE_VERTICAL_SLICE` in generated capability tables unless E5/E6 current-run proof covers every required layer.

## Complete Vertical Slice Criteria

No capability may be marked `COMPLETE_VERTICAL_SLICE` unless every criterion below is satisfied:

1. UI route/screen/action is locally identified.
2. Handler/API or server-side callable path is locally identified.
3. Service/domain workflow path is locally identified.
4. Persistence path is locally identified, or the report explains why persistence is not expected.
5. Guard layer is locally identified: permission, visibility, validation, workflow gate, audit or fail-closed boundary as applicable.
6. Positive proof exists from current-run test/API/browser/command execution.
7. Negative proof exists for sensitive actions: no unauthorized release, no client leakage, no silent state advance, no mutation on invalid input.
8. Output state and user-visible claim do not overclaim beyond the proven layers.

## Evidence Rules

| Rule | Required handling |
| --- | --- |
| Local evidence only | Every project fact must cite local code/test/runtime/report evidence or be marked as assumption/gap. |
| UI is not proof | Visible buttons, drawers, modals and route metadata are never enough without handler/data-flow evidence. |
| Schema is not editability | Prisma model/field existence is not editability without a local write path. |
| API is not workflow completion | Route existence is not enough without validation, I/O, service and state/output mapping. |
| Route access is not permission | Route visibility, action permission and payload visibility are separate proof layers. |
| Audit UI is not audit persistence | Audit display surfaces must be separated from audit write/storage paths and tests. |
| Test honesty | Unrun tests are proof intent, not pass claims. Current-run commands must be listed verbatim. |
| Drift gate authority | Capture/report generator context must reject stale route/model/API counts and generated `COMPLETE_VERTICAL_SLICE` overclaims. |
| Demo boundary | `/api/demo-workflow` is a legacy fail-closed 410 boundary. Moved typed product commands must point to canonical typed APIs. |
| Internet boundary | Internet may support methodology/tooling only; it cannot be used as evidence for local project facts. |

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
| Local evidence only | Every capability claim has local evidence or is marked as assumption/gap. |
| No stale context contamination | Prior reports/docs/memory/generated source are not used as code facts without current-run verification. |
| Conservative complete claims | No `COMPLETE_VERTICAL_SLICE` without current-run positive and negative proof. |
| UI static separation | UI-only/static/disabled controls are explicitly separated from mutations. |
| Schema-only separation | Schema breadth is not treated as editability. |
| Typed command separation | Product-like migrated Jxx families are reported through typed command routes, not `/api/demo-workflow`. |
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

Expected decision for this run before QA: `PASS_WITH_LIMITATIONS`.

Reason: the analysis has strong local code evidence and a targeted current-run drift proof pack, but it has not executed every DB/browser/API vertical suite in this ticket chain.

## Follow-Up Ticket Boundaries

| Downstream ticket | Boundary |
| --- | --- |
| `IMPL-1.4.1` | Generate capability and vertical-slice matrices from this taxonomy. |
| `IMPL-1.4.2` | Generate workflow I/O, data-maintenance and safety reports without broad complete-slice claims. |
| `IMPL-1.4.3` | Consolidate findings, limits, overclaim warnings and bold cleanup recommendations. |
| `QA-1` | Validate the generated report against this spec and current-run proof boundaries. |
| `DECISION-1` | Human baseline acceptance; stop for user decision. |

Finished: `SPEC-1`.
