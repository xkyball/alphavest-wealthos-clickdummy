# AlphaVest Wave 1 / TASK-B1 Traceability Source Map

Datum: 2026-06-29  
Status: `COMPLETED_WITH_TRACE_SCHEMA_GAPS`  
Wave: `Wave 1`  
Item: `TASK-B1`  
Arbeitsmodus: Analyse / Research / Spike, keine Produktcode-Aenderung

## Definition Re-Read

Quelle: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`

`TASK-B1` fordert die Analyse der Process-Step-to-UI-Traceability-Quellen. Scope sind `process_id`, `step_id`, required input, expected output, route touchpoints, component touchpoints, service evidence, audit/evidence proof und readiness state. Out of scope sind UI-Fixes, Route-Registry-Aenderungen und Source-Spec-Aenderungen.

## Executive Finding

Die Prozessquellen sind fuer Prozess- und Step-Truth stark: `process_id` und `step_id` sind stabil und vollstaendig. Die aktuelle Coverage Matrix ist aber kein UI-I/O-Proof-Contract. Sie kann sagen, welcher Step welche Route/API/Model/Test-Touchpoints und welche Acceptance State hat, aber sie kann nicht maschinenlesbar beweisen, dass der erforderliche Step-Input und der erwartete Step-Output in der UI sichtbar, bedienbar, validiert, gespeichert, projiziert und negativ getestet sind.

Der naechste Trace-Artefakt muss deshalb eine eigene UI-I/O-Proof-Koernung einfuehren: `step_id + pageId + component + surface/control/field + command/service + before/after state + proof_ref`.

## Counts

| Metric | Count |
| --- | ---: |
| P0 processes in detailed spec | 84 |
| P0 process steps in detailed spec | 438 |
| Step rows in coverage matrix | 438 |
| Unique `process_id` | 84 |
| Unique `step_id` | 438 |
| `implemented` matrix rows | 64 |
| `partially_implemented` matrix rows | 322 |
| `specified_only` matrix rows | 52 |
| `negative_test` missing-layer rows | 215 |
| `step_level_gate_proof` missing-layer rows | 141 |
| `audit_or_evidence_failure_proof` missing-layer rows | 138 |
| `implementation_touchpoint_proof` missing-layer rows | 52 |

## Trace Source Map

| Source Artifact | Available Fields | Useful For | Missing For UI-I/O Proof |
| --- | --- | --- | --- |
| `docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json` | `detailed_process_catalogue[].process_id`, `inputs[]`, `outputs[]`, `preconditions[]`, `acceptance_criteria[]`, `negative_acceptance_criteria[]`, `route_touchpoints[]`, `api_touchpoints[]`, `schema_model_touchpoints[]`, `test_touchpoints[]`; `process_step_catalogue[].step_id`, `process_id`, `sequence`, `actor`, `action`, `input`, `output`, `system_behavior`, `user_feedback_requirement`, `state_requirement` | Primary process/step truth; required inputs and expected outputs | No canonical `pageId`, component file, selector, UI field/control id, command id, before/after UI state or UI proof ref |
| `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json` | `coverage_matrix[].step_id`, `process_id`, `domain_id`, `intended_area_id`, `actor`, `action`, `current_touchpoints.routes/apis/models_or_services/tests`, `missing_layers`, `required_positive_proof`, `required_negative_proof`, `proof_refs`, `acceptance_state`, `next_implementation_target` | Current step-level coverage and gap index | No direct step `input`/`output` fields; route touchpoints are mixed ranges/paths/screen codes; no component/file/control/selector proof |
| `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json` | Required matrix fields, allowed `acceptance_state`, completion-credit rules | Validates current coverage matrix shape | No granular `ui_input_status`, `ui_output_status`, `service_or_api_status`, `audit_or_evidence_status`, `negative_proof_status` |
| `docs/00-current/ALPHAVEST_P0_PROCESS_STEP_ACCEPTANCE_STATES_CONTRACT.json` | 8 proof layers: route/entrypoint, UI state/action, service/API, persistence/model, permission/gate, audit/evidence, positive test, negative test; acceptance state definitions | Defines what counts as implemented and disqualifiers | Proof layers are conceptual, not stored per Step as structured readiness fields |
| `lib/route-registry.ts` | `screenRoutes[].pageId`, `route`, `title`, `purpose`, `visualMode`, `navigationGroup`, `pageflowId`, `userWorkflowId`, `objectType`, `permissionAction`; workset scope | Canonical route/page registry and workset membership | No `process_id`, `step_id`, UI field/control ids, component file path in each route row |
| `app/[...segments]/page.tsx` | Runtime dispatch from matched route to screen component via pageId predicate modules | Determines top-level screen component family | Direct `pageId -> component` requires predicate modules; no step-level component/surface proof |
| `lib/process-first-ux-contract.ts` | 16 process-first route contracts with `pageId`, `businessProcessIds[]`, `domainIds[]`, `acceptanceIds[]`, `gateIds[]`, `forbiddenOverclaims[]`, `primaryProcessJob`, `nextPermittedAction` | Critical route-to-process/gate contract for select P0 flows | Covers only 16 pageIds and process-level sets, not all 438 step inputs/outputs |

## Join Key Map

| Join | Strength | Use | Caveat |
| --- | --- | --- | --- |
| `step_id` | Strong | Join `process_step_catalogue` to `coverage_matrix` | Primary row grain for trace model |
| `process_id` | Strong | Join detailed process catalogue to steps and coverage | Process-level inputs/outputs must not substitute step-level UI proof |
| `process_id + sequence` | Strong fallback | Recover step ordering if `step_id` is unavailable | Not needed while `step_id` remains complete |
| `domain_id` / `l1_domain_id` | Good rollup | Domain summaries and prioritization | Not enough for UI proof |
| `intended_area_id` | Good rollup | Map steps into broad product area | Not enough for route/component proof |
| `pageId` | Strong for UI route | Canonical route identity in registry and process-first contracts | Coverage matrix uses mixed route touchpoint formats, so normalization is needed |
| `route` path | Medium | Runtime path and smoke testing | Dynamic segments and duplicate `/kyc/reviews` make it weaker than `pageId` |
| `component name/file` | Currently indirect | Screen dispatch and component ownership | Must be derived from `app/[...segments]/page.tsx` plus predicate modules |
| `data-testid` / `data-ux-*` | Missing in source matrix | UI proof selector | Must be captured in a new UI-I/O proof matrix |

## Route / UI Mapping Findings

- `pageId` is the practical route ID. There is no separate `route_id` field in the inspected routing sources.
- `lib/route-registry.ts` contains 71 `screenRoutes` across 5 worksets.
- `app/[...segments]/page.tsx` dispatches to 11 screen component families plus `RouteSkeletonPage`.
- `lib/process-first-ux-contract.ts` contains 16 contracts, not a complete 438-step trace.
- `current_touchpoints.routes` in the coverage matrix are not canonical route keys. They mix numeric ranges such as `019-026`, concrete paths and screen IDs.
- `/kyc/reviews` is registered for `064`, `065` and `066`; route-path joins are ambiguous there, so `pageId` must be used after normalization.

## Missing Field List

Required for a durable UI-I/O trace:

- `ui_io_trace_id`
- `step_id`
- `process_id`
- `page_id`
- `route_path`
- `component_file`
- `component_name`
- `surface_type`
- `section_id`
- `panel_id`
- `modal_id`
- `drawer_id`
- `required_input_source`
- `input_field_id`
- `input_label`
- `input_payload_key`
- `input_model_field`
- `input_validation_state`
- `input_scope`
- `output_field_id`
- `output_label`
- `output_source`
- `output_render_state`
- `output_persistence_state`
- `command_id`
- `api_route`
- `service_function`
- `workflow_transition`
- `audit_event_type`
- `evidence_ref_type`
- `positive_proof_ref`
- `negative_proof_ref`
- `screenshot_ref`
- `dom_capture_ref`
- `test_ref`
- `role_scope`
- `tenant_scope`
- `object_scope`
- `ui_input_status`
- `ui_output_status`
- `service_or_api_status`
- `audit_or_evidence_status`
- `negative_proof_status`

## Recommended Readiness States

Keep the existing top-level `acceptance_state`, but add layer readiness fields:

| Field | Allowed Values |
| --- | --- |
| `ui_input_status` | `not_required`, `absent`, `specified_only`, `visible_only`, `editable_not_bound`, `validated_ui_only`, `command_bound`, `persisted_or_projected` |
| `ui_output_status` | `not_required`, `absent`, `copy_only`, `modal_local`, `visible_static`, `stateful_ui`, `persisted_readmodel`, `client_safe_projection` |
| `service_or_api_status` | `none`, `read_only`, `mock_or_seeded`, `api_backed`, `workflow_backed`, `persisted` |
| `audit_or_evidence_status` | `not_applicable`, `missing`, `display_only`, `write_attempted`, `written`, `fail_closed_on_write_failure` |
| `negative_proof_status` | `not_required`, `missing`, `planned`, `stale`, `passing_unit`, `passing_api`, `passing_ui`, `passing_end_to_end` |
| `trace_confidence` | `machine_joined`, `machine_joined_with_normalization`, `manual_verified`, `manual_required`, `ambiguous` |

## Missing-Layer Taxonomy

| Category | Meaning | Example Closure Target |
| --- | --- | --- |
| `missing_input_ui` | Required process/step input has no UI field, chooser, confirmation or upload equivalent | Add object-scoped field/control or mark as delegated with proof |
| `missing_input_binding` | UI input exists but does not bind to command/API/model | Wire to command payload and validation state |
| `missing_output_ui` | Expected output is not rendered after action | Render durable selected-object output state |
| `modal_local_only_output` | Output exists only inside a transient modal message | Reflect result in parent work surface/read model |
| `missing_service_backing` | UI exists but no API/service/workflow transition proves behavior | Add or bind service/command path |
| `missing_persistence_or_projection` | State changes are not durable or not read back | Persist, project or explicitly fail-closed |
| `missing_gate_proof` | Required RBAC/workflow/visibility gate is not traceable | Add gate ref and tests |
| `missing_audit_or_evidence_proof` | Sensitive action lacks audit/evidence write or failure behavior | Add audit/evidence proof and failure test |
| `missing_negative_proof` | No deny/no-leak/no-overclaim test for safety-sensitive step | Add negative proof |
| `route_only_overclaim` | Route or screen presence is being counted as step completion | Downgrade readiness until UI+behavior proof exists |

## Recommended Trace Schema Shape

```json
{
  "ui_io_trace_id": "UIIO-BP-001-S01-001",
  "process_id": "BP-001",
  "process_name": "Client relationship intake",
  "step_id": "BP-001-S01",
  "step_label": "Erfassen",
  "actor": "Client",
  "required_inputs": ["Client data", "entity data", "relationship data"],
  "expected_outputs": ["Zwischenstatus fuer Client relationship intake"],
  "page_id": "019",
  "route_path": "/client/home",
  "component_touchpoints": [
    {
      "component_file": "components/client-intake-screen.tsx",
      "component_name": "ClientIntakeScreen",
      "surface_type": "page",
      "section_id": null,
      "panel_id": null,
      "modal_id": null,
      "drawer_id": null
    }
  ],
  "ui_inputs": [
    {
      "input_label": "Client data",
      "input_field_id": null,
      "input_payload_key": null,
      "input_validation_state": "missing"
    }
  ],
  "ui_outputs": [
    {
      "output_label": "Intermediate relationship context",
      "output_field_id": null,
      "output_render_state": "missing",
      "output_source": null
    }
  ],
  "service_evidence": {
    "api_route": null,
    "service_function": null,
    "workflow_transition": null,
    "service_or_api_status": "none"
  },
  "proof": {
    "audit_or_evidence_status": "missing",
    "positive_proof_ref": [],
    "negative_proof_ref": [],
    "test_ref": [],
    "screenshot_ref": [],
    "dom_capture_ref": []
  },
  "readiness": {
    "acceptance_state": "specified_only",
    "ui_input_status": "absent",
    "ui_output_status": "absent",
    "negative_proof_status": "missing",
    "trace_confidence": "manual_required"
  },
  "missing_layers": ["missing_input_ui", "missing_output_ui", "missing_service_backing", "missing_negative_proof"],
  "next_target": "Define object-scoped intake UI and command-backed context output."
}
```

## Which Steps Can Be Classified Automatically

Automatically classifiable with current sources:

- `process_id`, `step_id`, `actor`, `action`, `required input`, `expected output`
- `domain_id`, `intended_area_id`
- route/API/model/test touchpoint presence
- current `acceptance_state`, `missing_layers`, `required_positive_proof`, `required_negative_proof`
- route workset after route touchpoints are normalized to `pageId`

Require manual or generated UI proof:

- exact component file per page id, unless predicate modules are parsed
- exact UI input field/control for each step input
- exact UI output field/state for each step output
- command/API payload mapping
- before/after state, blocked state, fail-closed state
- screenshot/DOM selector/test assertion per UI-I/O row

## Item Report

Status: `completed_with_trace_schema_gaps`  
Geaenderte Dateien: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_B1_TRACEABILITY_SOURCE_MAP.md`  
Produktcode geaendert: nein  
Tests: keine neuen Tests erforderlich; B1 ist Analyse-only. Re-used A1 validation context: `pnpm guard:source` und targeted Safety-Suite waren gruen.  
Screenshot: nicht erzeugt, weil keine UI-Aenderung vorgenommen wurde.  
Findings: `step_id` ist der primaere Join; `pageId` ist der UI-Route-Key; aktuelle Matrix ist step-stark, aber UI-I/O-proof-schwach.  
Naechstes Item: `TASK-C1 - Analyse client context and evidence lifecycle gaps`
