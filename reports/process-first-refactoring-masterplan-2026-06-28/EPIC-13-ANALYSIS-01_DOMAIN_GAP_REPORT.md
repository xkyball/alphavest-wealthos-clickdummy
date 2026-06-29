# EPIC-13-ANALYSIS-01 Domain Gap Report

Ticket: `EPIC-13-ANALYSIS-01`
Epic: `EPIC-13 Client Visibility and Released Projection`
Status: `completed_analysis`
Date: 2026-06-29

## Source Re-Read

Masterplan source:
`reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

Task definition:
Audit all mapped processes and steps for Client Visibility and Released Projection against current routes, components, services and tests.

Goal:
Separate implemented behavior from visual-only or specified-only claims.

Scope:
`BP-067`, `BP-068`, `BP-069`

Expected output:
`EPIC-13 domain gap report`

Definition of done:
Each mapped process has implementation status and missing step list.

## Current DOMAIN-H Source Truth

AREA-08 is defined as `Client Visibility`.

Target role:
Explicit released-only area/view mode.

Current basis:
Partly embedded in client workspace and decisions; not explicit enough.

Owning process domain:
`DOMAIN-H Client Visibility and Communication Processes`.

Target screens:
`S019`, `S020`, `S043`, `S044`, `S045`, `S058`.

## Current Route Ownership

| Screen | Route | Current navigation group | Current role in DOMAIN-H |
| --- | --- | --- | --- |
| `S019` | `/client/home` | `client_workspace` | Client-safe portal projection surface exists, but AREA-08 ownership is implicit. |
| `S020` | `/mobile` | `client_workspace` | Mobile safe view exists, but AREA-08 ownership is implicit. |
| `S043` | `/decisions` | `decisions_evidence` | Decision list exists, but released projection is not the owning page job. |
| `S044` | `/decisions/:id` | `decisions_evidence` | Decision room is client-visibility-sensitive, but mixes decision/action/proof concerns. |
| `S045` | `/decisions/:id/success` | `decisions_evidence` | Submitted/success surface exists, but not a full AREA-08 projection contract. |
| `S058` | `/export/:id/download` | `export` | Delivery surface is client-visibility-sensitive, but belongs primarily to export/download. |

Finding:
DOMAIN-H is present as cross-cutting behavior, but not yet a first-class process-first application area. The UI can show released-safe fragments, but route ownership still lives in Client Workspace, Decision Record and Export.

## Current Service/Test Truth

Implemented service seams:
- `lib/visibility-engine.ts`
- `lib/control-layer/visibility-projection.ts`
- `lib/export-service.ts`

Existing proof tests:
- `tests/client-visibility-proof.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/pp001-payload-negative.spec.ts`
- `tests/pp001-payload-visibility-contract.spec.ts`
- `tests/ux-client-safe-ui-boundary.spec.ts`
- `tests/operational-visual-audit.spec.ts`

Service-backed behavior already present:
- Recommendation projections fail closed until `clientVisible`, `CLIENT_VISIBLE`, and released recommendation status align.
- Decision projections fail closed until `clientVisible`, `CLIENT_VISIBLE`, and `decisionState=RELEASED` align.
- Document projections fail closed unless evidence/document visibility is client-safe or a client source-document role is viewing allowed metadata.
- Internal fields such as `clientSummaryDraft`, `summaryInternal`, `internalRationale`, `complianceNotes`, `assumptionsJson`, audit metadata and storage/checksum fields are hidden from client projections.
- Export input can be accepted only from visible, client-safe projection payloads.

What is not proven at DOMAIN-H step level:
- The coverage matrix and UI trace still show route-only touchpoints for all nine DOMAIN-H steps.
- Positive and negative proof refs are absent at the individual `BP-067..069` step rows.
- No AREA-08 readmodel contract currently binds `S019/S020/S043/S044/S045/S058` to a single released-projection state model.
- No report artifact records which UI component or state owns each step input/output.

## Step Coverage Matrix

| Step | Process | Current source state | Current implementation truth | Missing layers |
| --- | --- | --- | --- | --- |
| `BP-067-S01` | Released client portal projection | `partially_implemented` | Service can project only released recommendation/decision/document payloads, but UI trace is route-only. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-067-S02` | Released client portal projection | `partially_implemented` | Service hides/redacts internal fields; route-level UI exists. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-067-S03` | Released client portal projection | `partially_implemented` | Communication/update surface exists only indirectly through client portal and messages. | `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state` |
| `BP-068-S01` | Mobile safe view | `partially_implemented` | Mobile route can show client-safe projection card; proof remains route-level. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-068-S02` | Mobile safe view | `partially_implemented` | Mobile safe view hides internal content through projection service, but no step-level row proof exists. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-068-S03` | Mobile safe view | `partially_implemented` | Mobile communication/update behavior is present as safe next-step UI, not as a process-step contract. | `negative_test`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state` |
| `BP-069-S01` | Client-safe summary projection | `specified_only` | Service can produce safe summaries, but BP-069 has no explicit implementation touchpoint proof. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `implementation_touchpoint_proof`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-069-S02` | Client-safe summary projection | `specified_only` | Redaction/hide behavior exists generically, not as a BP-069 summary projection contract. | `step_level_gate_proof`, `audit_or_evidence_failure_proof`, `negative_test`, `implementation_touchpoint_proof`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state`, `missing_negative_proof` |
| `BP-069-S03` | Client-safe summary projection | `specified_only` | Approved communication of safe summary is not separately proven. | `negative_test`, `implementation_touchpoint_proof`, `missing_ui_representation`, `missing_required_input_ui`, `missing_positive_proof`, `missing_persisted_output_state` |

## Main Gaps

1. AREA-08 is conceptually defined but not product-owned in route/navigation state.
2. DOMAIN-H has strong service-level safety, but weak process-step traceability.
3. BP-069 is the weakest process cluster: specified-only with no explicit implementation touchpoint proof.
4. Screens `S019`, `S020`, `S043`, `S044`, `S045`, `S058` all participate in client visibility, but none currently owns the full AREA-08 contract.
5. Existing tests prove fail-closed payload behavior, but not the nine BP step rows as first-class acceptance rows.

## Recommendation

Do not solve EPIC-13 by adding another explanatory panel, badge strip or process-proof block to the UI.

Bold implementation direction:
Create a canonical `DOMAIN-H Released Projection Contract` with a typed readmodel that binds:
- released portal projection,
- mobile safe view,
- client-safe summary projection,
- hidden/internal field audit,
- step-level positive and negative proof refs,
- and route/screen ownership for `S019/S020/S043/S044/S045/S058`.

Then implement the smallest visible slice as AREA-08 entry/workbench behavior only where it replaces existing route-only ambiguity with a real object state and next action.

## Ticket Result

`EPIC-13-ANALYSIS-01` is complete.

Next enabled ticket:
`EPIC-13-SPEC-01`

