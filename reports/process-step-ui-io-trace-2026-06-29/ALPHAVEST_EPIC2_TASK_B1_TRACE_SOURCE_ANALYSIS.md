# AlphaVest EPIC-2 TASK-B1 Trace Source Analysis

Status: complete  
Date: 2026-06-29  
Scope: read-only analysis for process-step to UI-I/O traceability closure  
Product-code changes: none

## Executive Finding

The source set can deterministically join all retained P0 process steps by `process_id` and `step_id`, but it cannot yet prove UI-I/O completion per step.

The current Process Coverage Matrix has 438 rows for 438 retained P0 steps and no orphaned or missing step IDs. It does, however, represent routes and APIs mostly at grouped touchpoint level. It has no row-level `component_touchpoints` and no populated `proof_refs` arrays. Therefore route, screen or matrix presence must remain downgraded unless UI input, UI output, service behavior, persisted state, audit/evidence writes and positive/negative proof references are explicitly present.

## Source Field Map

| Source artifact | Trace-relevant available fields | Missing or weak fields for UI-I/O proof |
| --- | --- | --- |
| `docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json` | `detailed_process_catalogue[].process_id`, process name/domain, actors, `inputs`, `outputs`, `preconditions`, `safety_gates`, `evidence_requirements`, `audit_requirements`, `route_touchpoints`, `api_touchpoints`, `schema_model_touchpoints`, acceptance and negative acceptance criteria; `process_step_catalogue[].step_id`, `process_id`, sequence, actor, action, input, system behavior, output, gate/safety/audit/failure/state requirements | Step-level route/component/service/proof refs are not deterministic. Inputs and outputs are textual and need normalization into arrays. |
| `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json` | 438 `coverage_matrix[]` rows; `step_id`, `process_id`, process/domain/area, actor/action, acceptance state, completion credit, current touchpoints, missing layers, proof requirements, blockers, next target | `current_touchpoints.components` is absent/empty for all rows; `proof_refs.positive` and `proof_refs.negative` are empty for all sampled rows and counted as no row-level proof. |
| `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json` | Required matrix fields, allowed acceptance states, completion credit mapping, validation rules | Does not define UI-I/O trace row fields such as component evidence refs, service backing state, output state proof, safety downgrade reason or high-risk sample markers. |
| `docs/00-current/ALPHAVEST_P0_PROCESS_STEP_ACCEPTANCE_STATES_CONTRACT.json` | Acceptance state definitions; proof layers; state precedence; safety gate acceptance requirements; implemented-state minimum fields | Current matrix does not populate the proof refs needed to satisfy implemented-state minimums on a per-step basis. |
| `lib/route-registry.ts` | `screenRoutes[]` with `pageId`, route, title, purpose, visual mode, navigation group, pageflow, workflow, role family, object type, permission action and client visibility sensitivity | Route registry maps pages, not process steps. It cannot prove that a specific step input/output is represented or service-backed. |
| `app/[...segments]/page.tsx` | Route dispatch from route registry page IDs to component families | Dispatch proves component family selection only. It does not prove operational UI controls, service actions, state transitions or audit writes. |
| `lib/process-first-ux-contract.ts` | Critical page contracts with `pageId`, route, business process IDs, domain IDs, acceptance IDs, gate IDs and forbidden overclaims | Contract coverage is critical but partial: it covers high-risk page/process families, not all 438 process steps, and it is not a substitute for per-step UI-I/O evidence. |

## Count Checks

| Check | Result |
| --- | ---: |
| Retained P0 processes in process spec | 84 |
| Process steps in process spec | 438 |
| Coverage matrix rows | 438 |
| Matrix rows missing in process spec by `step_id` | 0 |
| Process spec steps missing in matrix by `step_id` | 0 |
| Matrix rows with route touchpoints | 438 |
| Matrix rows with API touchpoints | 434 |
| Matrix rows with component touchpoints | 0 |
| Matrix rows with populated proof refs | 0 |
| Safety rows | 214 |
| Decision rows | 214 |

Current matrix acceptance-state counts:

| State | Count |
| --- | ---: |
| `implemented` | 64 |
| `partially_implemented` | 322 |
| `specified_only` | 52 |

Current missing-layer counts:

| Missing layer | Count |
| --- | ---: |
| `negative_test` | 215 |
| `implementation_touchpoint_proof` | 52 |
| `step_level_gate_proof` | 141 |
| `audit_or_evidence_failure_proof` | 138 |

## Join Key Map

| Join target | Primary key | Source | State |
| --- | --- | --- | --- |
| Process to step | `process_id` | Process spec and coverage matrix | usable |
| Step identity | `step_id` | Process spec and coverage matrix | usable |
| Step ordering | `process_id` + `sequence` | Process spec and coverage matrix | usable |
| Step to domain | `process_id` or matrix `domain_id` | Detailed process catalogue and coverage matrix | usable |
| Step to intended area | matrix `intended_area_id` | Coverage matrix | usable |
| Step to route touchpoints | matrix `current_touchpoints.routes`, process `route_touchpoints` | Coverage matrix and process catalogue | usable but grouped |
| Route to component family | route `pageId` to `app/[...segments]/page.tsx` dispatch guards | Route registry and page dispatcher | usable at page-family level |
| Route to process-first contract | `pageId` | `process-first-ux-contract.ts` | usable for critical pages only |
| Step to component touchpoint | none reliable | Missing from matrix; inferred only by route/component family | missing |
| Step to service/API proof | matrix `current_touchpoints.apis`, process `api_touchpoints`, source grep/test refs | Available but not normalized to per-step behavior | ambiguous |
| Step to persisted output | process output + model touchpoints + service/test evidence | Requires trace normalization and proof refs | missing/ambiguous |
| Step to audit/evidence proof | `proof_refs.positive`, `proof_refs.negative` | Coverage matrix fields exist but are currently empty | missing |

## Missing UI-I/O Layer Taxonomy

These categories should become trace schema values:

| Missing layer | Meaning | Downgrade effect |
| --- | --- | --- |
| `missing_required_input_ui` | Required process or step input has no visible/selectable/enterable product control or selected object context. | Cannot be implemented. |
| `missing_ui_representation` | Step exists in spec/matrix but no product-native UI counterpart is evidenced. | `specified_only` or `absent`. |
| `missing_actionable_control` | UI exists but cannot trigger the relevant command/workflow/action. | `visible_only` or `actionable_ui_only`. |
| `missing_service_backing` | Action/control has no API/service/workflow behavior proof. | Not implemented. |
| `missing_persisted_output_state` | Expected output is not represented as durable product state/read model. | Not implemented. |
| `missing_audit_or_evidence_write` | Important or sensitive action lacks persisted audit/evidence event proof. | Not implemented; safety downgrade where relevant. |
| `missing_positive_proof` | No test/report/runtime proof for the allowed path. | Not implemented. |
| `missing_negative_proof` | No deny/fail-closed/no-leak/no-overclaim proof. | Safety-sensitive rows must downgrade. |
| `route_only_claim` | Route presence is being used as process proof. | Force downgrade. |
| `component_only_claim` | Component dispatch/presence is being used as process proof. | Force downgrade. |
| `visible_only_claim` | Text, card, badge, table or button exists without behavior/output/proof. | Force downgrade. |

## Recommended Readiness States

Use conservative states beyond the current matrix states:

- `absent`
- `specified_only`
- `route_only`
- `component_only`
- `visible_only`
- `actionable_ui_only`
- `actionable_with_blockers`
- `partially_service_backed`
- `implemented`
- `blocked_by_decision`
- `blocked_by_schema`
- `not_authorized`

Safety-sensitive steps must not be `implemented` unless positive proof and negative proof are both present and evidence references distinguish UI display, command behavior, persisted state and audit/evidence writes.

## Recommended Trace Schema Direction

TASK-B2 should specify a machine-readable row keyed by `process_id + step_id` with:

- Process and step identity: `process_id`, `process_name`, `domain_id`, `usecase_group`, `step_id`, `sequence`, `step_label`, `actor`
- Required I/O: `required_inputs[]`, `expected_outputs[]`
- Touchpoints: `route_touchpoints[]`, `component_touchpoints[]`, `api_touchpoints[]`, `model_or_service_touchpoints[]`
- States: `ui_representation_state`, `service_backing_state`, `acceptance_state`, `readiness_state`
- Proof: `positive_proof_refs[]`, `negative_proof_refs[]`, `audit_or_evidence_refs[]`
- Safety: `safety_sensitive`, `decision_step`, `safety_gate_ids[]`, `downgrade_reasons[]`
- Gaps: `missing_layers[]`, `gap_priority`, `gap_reason`, `next_target`
- Provenance: `source_refs[]`, `generated_at`, `schema_version`

## TASK-B1 Definition Of Done Check

| Requirement | Status |
| --- | --- |
| All source artifacts are mapped. | pass |
| Join strategy is documented. | pass |
| Readiness statuses are proposed. | pass |
| Specification can proceed. | pass |

## B2 Recommendation

Proceed to TASK-B2 without product-code changes. Store the schema and generated trace under `reports/process-step-ui-io-trace-2026-06-29/` for this audit run. Do not put trace proof into operational UI. Do not mark any route-only, component-only, visible-only or safety-sensitive row as implemented unless the trace has the required service, output, audit/evidence and positive/negative proof references.
