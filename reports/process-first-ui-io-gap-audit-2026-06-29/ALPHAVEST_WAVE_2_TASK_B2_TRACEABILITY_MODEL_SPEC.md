# AlphaVest Wave 2 / TASK-B2 UI-I/O Traceability Model Specification

Date: 2026-06-29
Mode: Wave 2, specification / acceptance criteria
Status: COMPLETED_SCHEMA_READY_FOR_ACCEPTANCE

## Re-read Task Definition

TASK-B2 was re-read from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json` before execution.

Goal: define a machine-readable trace model for process-step UI readiness.

## Source Basis

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_B1_TRACEABILITY_SOURCE_MAP.md`
- `docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json`
- `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json`
- `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json`
- `docs/00-current/ALPHAVEST_P0_PROCESS_STEP_ACCEPTANCE_STATES_CONTRACT.json`
- `lib/route-registry.ts`
- `app/[...segments]/page.tsx`
- `lib/process-first-ux-contract.ts`

Verified counts:

- Detailed process step objects with `step_id`: 438
- Coverage matrix rows with `step_id`: 438

## Machine-Readable Schema

Schema artifact:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_B2_UI_IO_TRACEABILITY_SCHEMA.json`

Recommended implementation artifact:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_STEP_UI_IO_TRACEABILITY_MATRIX.json`

Recommended validator:

- `scripts/process-step-ui-io-traceability-validate.ts`

The validator location is a recommendation only. No script was created in TASK-B2 because this item is specification-only.

## Required Row Grain

One row per retained `step_id`.

The row must preserve process truth and UI proof truth separately:

- Process truth: `process_id`, `step_id`, actor, required inputs, expected outputs.
- UI truth: route, component, field/control, selected object, input status, output status.
- Service truth: API, service, workflow transition, model/readmodel, state change.
- Proof truth: audit/evidence status, positive proof, negative proof, screenshot/DOM/test refs.
- Readiness truth: conservative readiness state after downgrade rules.

## Readiness States

| Layer | States |
|---|---|
| `ui_representation_state` | `absent`, `specified_only`, `visible_only`, `actionable_ui_only`, `actionable_with_blockers`, `partially_service_backed`, `implemented` |
| `ui_input_status` | `not_required`, `absent`, `specified_only`, `visible_only`, `editable_not_bound`, `validated_ui_only`, `command_bound`, `persisted_or_projected` |
| `ui_output_status` | `not_required`, `absent`, `copy_only`, `modal_local`, `visible_static`, `stateful_ui`, `persisted_readmodel`, `client_safe_projection` |
| `service_backing_state` | `none`, `read_only`, `mock_or_seeded`, `api_backed`, `workflow_backed`, `persisted` |
| `audit_or_evidence_status` | `not_applicable`, `missing`, `display_only`, `write_attempted`, `written`, `fail_closed_on_write_failure` |
| `negative_proof_status` | `not_required`, `missing`, `planned`, `stale`, `passing_unit`, `passing_api`, `passing_ui`, `passing_end_to_end` |
| `trace_confidence` | `machine_joined`, `machine_joined_with_normalization`, `manual_verified`, `manual_required`, `ambiguous` |

## Mandatory Downgrade Rules

1. Route presence cannot mark a step implemented.
2. Component presence cannot mark a step implemented.
3. Screenshot presence cannot mark a step implemented.
4. Visible-only input/output cannot mark a step implemented.
5. UI action without service/workflow backing cannot mark a step implemented.
6. Modal-local success copy cannot mark an output implemented.
7. Sensitive action without audit/evidence write or fail-closed behavior cannot be implemented.
8. Safety-sensitive row without negative proof cannot be implemented.
9. Mutation row without selected-object continuity cannot be implemented.
10. Client-facing row without client-safe projection proof cannot be implemented.

## Missing-Layer Taxonomy

The schema defines these missing layers:

- `missing_input_ui`
- `missing_input_binding`
- `missing_input_validation`
- `missing_output_ui`
- `modal_local_only_output`
- `missing_selected_object_continuity`
- `missing_service_backing`
- `missing_workflow_transition`
- `missing_persistence_or_projection`
- `missing_permission_gate_proof`
- `missing_audit_or_evidence_proof`
- `missing_negative_proof`
- `route_only_overclaim`
- `component_only_overclaim`
- `screenshot_only_overclaim`
- `proof_scaffolding_in_default_ui`
- `blocked_by_human_decision`
- `not_authorized_in_current_wave`

## Acceptance Criteria For TASK-B3 / TASK-B4

1. The generated trace file contains 438 rows unless a retained-step exclusion register exists.
2. Every row has deterministic `ui_io_trace_id`, `process_id` and `step_id`.
3. Every row includes required inputs and expected outputs from the process universe.
4. Every row includes route and component touchpoints or explicit absence.
5. Every row includes UI input/output status even when absent.
6. Every row includes service backing status even when no service exists.
7. Every sensitive row includes audit/evidence and negative proof status.
8. Every implemented row must pass all downgrade rules.
9. Every P0 gap row must produce a `next_target` suitable for ticket generation.
10. Validation summary must include counts by readiness state, missing layer and priority.

## Human Confirmation Points

Before implementing TASK-B3, confirm:

1. Whether the trace matrix should live permanently under `reports/` or be promoted into `docs/00-current/`.
2. Whether a validator under `scripts/` is allowed in the implementation wave.
3. Whether reviewer-only proof tooling from TASK-E2 becomes the canonical home for screenshots/DOM proof refs.

## Item Outcome

Status: completed as a specification item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_B2_UI_IO_TRACEABILITY_SCHEMA.json`
- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_B2_TRACEABILITY_MODEL_SPEC.md`

Tests:

- `pnpm guard:source` was run during Wave 2 preflight and passed.
- No additional tests were required because TASK-B2 is specification-only.

Findings:

- The trace must carry UI input/output proof as first-class readiness layers.
- `implemented` is forbidden unless UI, service, state, audit/evidence and negative proof align.
- The next item can use this schema to specify client/evidence states without inventing trace semantics.

Next item:

- TASK-C2.
