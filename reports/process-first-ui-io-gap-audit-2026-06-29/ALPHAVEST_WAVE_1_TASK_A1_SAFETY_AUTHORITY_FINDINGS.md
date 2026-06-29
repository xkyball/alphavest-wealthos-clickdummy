# AlphaVest Wave 1 / TASK-A1 Safety Authority Findings

Datum: 2026-06-29  
Status: `COMPLETED_WITH_UI_AND_WORKFLOW_GAPS`  
Wave: `Wave 1`  
Item: `TASK-A1`  
Arbeitsmodus: Analyse / Research / Spike, keine Produktcode-Aenderung

## Definition Re-Read

Quelle: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`

`TASK-A1` fordert die exakte Klassifikation safety-kritischer UI-Gaps nach Route, Component, Service, Audit und Negative Proof. Der Task ist als Analyse- und Spezifikationsarbeit definiert. Entsprechend wurden fehlende UI-/Service-/DB-Pendants nicht in Produktcode eingefuehrt, sondern als workflow-basierte Folgetasks abgegrenzt. Produktcode-Implementierung darf erst aus einem Implementation-Item mit passender True-UX-Autorisierung erfolgen.

## Workflow + UI Baseline

Korrektur nach Nutzerhinweis: "Workflow-basiert" meint in diesem Audit nicht nur das unterliegende System. Die UI muss den Workflow als bedienbare, objektgebundene Prozessflaeche abbilden. Backend-/Service-Proof allein reicht nicht.

Ein safety-kritischer Schritt gilt nur als belastbar, wenn diese Schichten zusammenpassen:

- UI zeigt den konkreten fachlichen Arbeitsgegenstand, erforderliche Eingaben, Blocker und naechste erlaubte Aktion.
- UI erzeugt oder zeigt den erwarteten Output nach der Aktion am richtigen Objekt, nicht nur modal-lokal oder als Copy.
- Workflow-Service nimmt eine typisierte Command- oder Gate-Entscheidung entgegen.
- State Change ist workflow- oder DB-gestuetzt.
- Audit/Evidence wird bei sensitiven Aktionen geschrieben oder fail-closed geblockt.
- Positive und negative Proofs belegen, dass Advisor Approval, Compliance Release, Client Visibility und Export Authority nicht kollabieren.

Route-, Component-, Button- oder Screenshot-Praesenz zaehlt deshalb nur als Hinweis. A1 bewertet explizit, ob die notwendigen Inputs und Outputs in der UI vorhanden, bedienbar, an den Workflow gebunden und am richtigen Prozessobjekt sichtbar sind.

## Tests und Guards

Erfolgreich:

- `pnpm guard:source`
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3127 pnpm playwright test tests/permission-engine.spec.ts tests/compliance-review-release-ui.spec.ts tests/file-export-realism.spec.ts tests/workflow-gate.spec.ts --workers=1`

Ergebnis: `40 passed`

Hinweis: Der erste Playwright-Lauf ohne `PLAYWRIGHT_SKIP_WEB_SERVER=1` scheiterte technisch, weil bereits ein Next-Dev-Server auf `localhost:3127` lief. Der zweite Lauf nutzte diesen Server explizit und war gruen.

## Affected Route / Component / Service / Test Map

| Safety Area | UI / Route Touchpoints | Workflow / Service Touchpoints | Proof Touchpoints | Status |
| --- | --- | --- | --- | --- |
| Admin Non-Bypass | `components/admin-tenant-setup-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/navigation.ts`, `lib/ux-route-policy.ts` | `lib/permission-engine.ts`, admin API/service paths behind admin tenant operations | `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts` | `ui_partially_actionable_with_semantic_blockers` |
| Compliance Release | `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx` | `lib/typed-workflow-command-bus.ts`, compliance review release command path, process runtime gates | `tests/compliance-review-release-ui.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/permission-engine.spec.ts` | `ui_actionable_with_object_continuity_gaps` |
| Client Visibility | Client projection consumers, compliance release UI, recommendation/decision surfaces | `lib/visibility-engine.ts`, `lib/typed-workflow-command-bus.ts`, permission gates | `tests/workflow-gate.spec.ts`, `tests/permission-engine.spec.ts`, client visibility specs outside TASK-A1 source list | `ui_trace_pending` |
| Export Authority | `components/communication-export-ops-screen.tsx` | `lib/export-workflow-command-service.ts`, `lib/export-workflow-readmodel-service.ts`, `app/api/export-workflow/route.ts`, `lib/export-service.ts`, `lib/export-package-service.ts` | `tests/file-export-realism.spec.ts`, export safety tests outside TASK-A1 source list | `ui_workflow_incomplete` |
| Proof / Capture Integrity | `lib/visual-contract.ts`, `tests/operational-visual-audit.spec.ts` | Visual proof state selection, operational screenshot audit | `tests/operational-visual-audit.spec.ts` | `proof_drift_risk` |

## UI Input / Output Pendant Matrix

| Safety Area | Required UI Inputs | Required UI Outputs | Current UI Evidence | UI Verdict |
| --- | --- | --- | --- | --- |
| Export Authority | selected export scope, redaction profile/validation, preview confirmation, approval acknowledgement, generation command, download acknowledgement, share decision | command state after each step, disabled reasons, audit id, no delivery/share/client acceptance overclaim | `components/communication-export-ops-screen.tsx` supports `APPROVE` and `DOWNLOAD` payloads only; other command steps are readmodel/static/disabled/navigation | `not_workflow_complete_in_ui` |
| Compliance Release | selected review, evidence/policy context, acknowledgement, exact phrase, optionally visible compliance/audit reason | release/block/evidence request state on the selected review, audit id, client visibility output or fail-closed reason | `components/internal-workflow-screen.tsx` has checkbox/phrase/modal states; selected queue review does not reliably flow into target IDs; output remains modal-local | `actionable_but_object_truth_gap` |
| Admin Non-Bypass | scoped admin setting/role/access request, acknowledgement or second confirmation where sensitive | denied or routed state showing no release, no evidence sufficiency, no export approval, no client visibility | Admin/governance screens show strong negative boundaries, but some active labels say `Save`, `Confirm`, `Approve`, or `Export Controlled` while actual output is review/blocked/routed | `usable_with_semantic_safety_gaps` |
| Client Visibility | selected released client-safe object and projection context | released projection or explicit fail-closed empty/blocked state, with no internal payload | Services prove projection, but TASK-A1 UI scope does not yet trace every client-facing surface | `pending_task_c1_trace` |

## Findings Register

### A1-F01 - Export Workflow UI exposes only part of the command spine

Priority: `P0`  
Safety Area: Export Authority  
Classification: `workflow_backed_ui_incomplete`

Evidence:

- `lib/export-workflow-command-service.ts` defines a canonical command spine with `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD`, `SHARE`.
- `app/api/export-workflow/route.ts` exposes the command workflow and fail-closed read model.
- `components/communication-export-ops-screen.tsx` restricts the UI command payload to `"APPROVE" | "DOWNLOAD"` near the local `ExportWorkflowCommandPayload` definition.
- `components/communication-export-ops-screen.tsx` currently provides actionable UI for `APPROVE` and `DOWNLOAD`; `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `GENERATE` and `SHARE` are represented as readmodel, static controls, route navigation, disabled states or indirect copy, not as command-actionable UI.
- `tests/file-export-realism.spec.ts` proves the service-level separation of preview, approval, generation, download and share.

Gap:

The workflow exists, but not every required export workflow input/output has a first-class UI pendant. A user can see export state and execute some actions, but cannot reliably complete the full command spine from UI with object scope, redaction validation, preview, generation and external share as separate operational steps.

Step-level UI verdict:

- `SET_SCOPE`: visible as scope summary/rows, but no typed scope command input.
- `VALIDATE_REDACTION`: visible as checklist/outcome, but no redaction validation command.
- `PREVIEW`: visible as preview/approval page, but no preview command.
- `APPROVE`: actionable with checkbox, submit, success/error output.
- `GENERATE`: no first-class UI action although download depends on generated state.
- `DOWNLOAD`: actionable with checkbox, submit, success/error output, but UI does not expose full `canDownload` gate reasoning.
- `SHARE`: visible as blocked/no-share state, no command.

Required next target:

Create an implementation task for `components/communication-export-ops-screen.tsx` to expose the full export command spine as workflow-native UI. Each action must show required inputs, disabled reasons, resulting state, audit consequence and no-client-release / no-real-binary boundary.

### A1-F02 - Admin Non-Bypass is service-proven, but the product-native UI denial output is not stable enough

Priority: `P0`  
Safety Area: Admin Non-Bypass  
Classification: `partially_service_backed`

Evidence:

- `lib/permission-engine.ts` denies admin/security bypass for internal advice payloads, evidence sufficiency, export approval and client visibility release.
- `tests/permission-engine.spec.ts` proves admin route access is not mutation authority and advisor approval/admin export bypass stay separated.
- `components/admin-tenant-setup-screen.tsx` shows explicit safety notes that platform settings, advice boundary policy, role templates, evidence templates and export templates do not release advice, mark evidence sufficient, expose client data or approve exports.
- `components/decisions-governance-screen.tsx` shows governed invite, role review and access review drawers with acknowledgement, loading/success/error output and no-overclaim copy.
- UI risk remains where primary buttons are labelled as direct mutation or approval while their actual output is review, route, confirmation or blocked state: examples include `Save changes`, `Confirm permission change`, `Export Controlled`, `Accept Option 1`, `Approve access request`.

Gap:

The negative proof exists in service tests and many UI surfaces show the correct boundary. The UI gap is semantic and operational: active affordance labels sometimes imply stronger authority than the workflow output actually grants. The visible product state must make non-bypass concrete through object-level disabled actions, denied reasons, routed review outputs and recovery paths, not through proof panels, badges or route copy.

Required next target:

Define and implement a product-native Admin Non-Bypass UI contract: admin may configure tenant/platform/workflow settings but must never see or execute client release, compliance release, export approval or internal advice payload commands. Denial output must be visible as workflow state, not as internal scaffold.

### A1-F03 - Compliance Release has real workflow backing, but UI must remain selected-object and process-runtime strict

Priority: `P0`  
Safety Area: Compliance Release  
Classification: `workflow_backed_with_ui_blockers`

Evidence:

- `lib/typed-workflow-command-bus.ts` evaluates advisor approval, evidence, payload, compliance permission, audit persistence, process runtime and selected evidence before release.
- Release mutation updates compliance review, recommendation client visibility, evidence state and decision state and writes audit metadata.
- `tests/compliance-review-release-ui.spec.ts`, `tests/workflow-gate.spec.ts` and `tests/permission-engine.spec.ts` pass.
- `components/internal-workflow-screen.tsx` has visible Compliance Release UI inputs: selected queue row, release decision room, request-evidence/block dialogs, release acknowledgement, exact confirmation phrase and disabled validation states.
- The same file wires request evidence, block and release to the recommendation review workflow API, but the visible selected review and the mutation target are not yet one continuous product truth: request/block use fixed Morgan demo targets and release uses a fixed Summit demo target while the UI shows other review/package context.
- Successful block/evidence/release output currently remains mainly modal-local as `StatePanel`/message. The returned `reloadedState` or client projection is not rendered back into the selected review surface after close.

Gap:

The workflow is strong and the UI has real inputs, disabled reasons and modal outputs. The missing UI pendant is object continuity and durable output: selected review/process object, command target, post-command review state, audit id, client visibility result and fail-closed reason must remain visible as one product surface after the command. No future UI cleanup may turn release into a route-level action, advisor approval surrogate, generic badge state or display-only proof strip.

Required next target:

Add a strict implementation/QA task that every compliance release UI affordance must include selected review identity, required inputs, blocked reasons, audit consequence and post-command output state. Advisor approval must remain visibly separate from compliance release and client acceptance.

### A1-F04 - Client Visibility is fail-closed in services, but target UI trace is incomplete in TASK-A1 scope

Priority: `P0`  
Safety Area: Client Visibility  
Classification: `service_backed_pending_target_ui_trace`

Evidence:

- `lib/visibility-engine.ts` projects recommendations, decisions and documents fail-closed for non-internal roles unless released/client-visible/client-safe conditions match.
- `lib/typed-workflow-command-bus.ts` sets client-visible release states only through compliance release path.
- Workflow tests prove advisor approval does not equal client visibility.

Gap:

TASK-A1 confirms service-level no-leakage and release separation and sees release UI copy that says client visibility changes only after release succeeds. It does not yet prove that every client-facing UI surface displays only the released projection and no internal process/evidence payloads. This must be closed in the client-context/evidence lifecycle item, not assumed from service presence.

Required next target:

In TASK-C1, trace every client-visible route/component against `lib/visibility-engine.ts` outputs and require UI proof for released recommendation, released decision, released/redacted document and fail-closed empty/blocked states.

### A1-F05 - Safety wording drift can weaken the negative boundary even when services are correct

Priority: `P1`  
Safety Area: Advisor Approval / Compliance Release / Client Visibility  
Classification: `proof_and_copy_regression_risk`

Evidence:

- Dirty workspace changes in `lib/navigation.ts` and `lib/ux-route-policy.ts` reduce explicit negative boundary language such as advisor approval not being release.
- Dirty workspace changes in `components/decisions-governance-screen.tsx` replace several evidence sufficiency labels with evidence review labels. This may be product-safer, but must not hide the explicit non-sufficiency gate.

Gap:

Service gates are still green, but product copy and workflow labels can erode user understanding of the separation between review, approval, release, visibility and acceptance.

Required next target:

Future UI edits must use product-native wording that preserves negative boundaries without exposing internal scaffolding. Example rule: "advisor review complete" may be shown, but the disabled release action must still explain compliance release requirements and client visibility status separately.

### A1-F06 - Visual proof state selection may flatten workflow states

Priority: `P2`  
Safety Area: Proof / Audit / Screenshot Acceptance  
Classification: `proof_drift_risk`

Evidence:

- Dirty workspace changes touch `lib/visual-contract.ts` and `tests/operational-visual-audit.spec.ts`.
- `lib/visual-contract.ts` now risks returning a generic base visual state for routes where modal/state-specific proof may be needed.

Gap:

Workflow runtime can be correct while screenshots miss release, approval, export or denial states. That would make UI proof less useful for Process-First claims.

Required next target:

Restore/replace route-specific visual state selection for safety-critical workflows so screenshots can prove selected review, approval denial, export approval, generated/download/share separation and client visibility blocked states.

## Safety Action Classification

| Action | Required Workflow Basis | Current State | A1 Classification |
| --- | --- | --- | --- |
| Admin config | Tenant/platform workflow settings plus non-bypass permission gate | Present, dirty UI proof risk | `allow_with_guardrails` |
| Admin evidence/release/export mutation | Permission engine hard deny, no hidden route bypass | Service denied | `deny_fail_closed` |
| Advisor approval | Advisor workflow state only | Present | `allow_but_not_release` |
| Compliance release | Selected object + advisor approval + evidence + payload + permission + audit + process runtime | Workflow-backed | `allow_when_all_gates_pass` |
| Client visibility | Released projection only, no internal payload leakage | Service-backed | `allow_projection_only` |
| Export approval | Selected export request + compliance permission + redaction + audit + data quality | Workflow-backed, UI partial | `allow_when_full_command_ui_exists` |
| Export download/share | Separate post-generation workflow stages | Service-backed, UI incomplete for full separation | `block_or_stage_until_ui_complete` |

## Negative Proof Gap List

- Export UI negative proof does not yet cover every command spine stage from visible UI: `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `GENERATE`, `SHARE`.
- Compliance release UI proof does not yet verify that selected review ID, visible review context and API `targetId`/`evidenceIds` are the same process object.
- Compliance release output proof does not yet require durable post-command state on the selected review after modal close.
- Admin UI non-bypass proof is service-strong and partially UI-strong, but active labels must not overstate review/route/blocked outputs as direct save/approval/export authority.
- Client visibility no-leakage is service-proven, but full client-route UI trace belongs to TASK-C1 and cannot be claimed complete from TASK-A1 alone.
- Safety copy drift around advisor approval versus compliance release must be treated as a regression risk even when workflow tests pass.
- Visual proof may under-capture workflow states if route visual state selection collapses to base screenshots.

## Recommended Specification Split

1. `A2-EXPORT-COMMAND-SPINE-UI`: Implement full export workflow UI for scope, redaction, preview, approval, generation, download and share with command-backed inputs/outputs.
2. `A2-COMPLIANCE-OBJECT-CONTINUITY`: Bind selected review, route param, visible detail, API `targetId`, evidence ids, audit id and post-command output to one workflow object.
3. `A2-ADMIN-NON-BYPASS-UI`: Replace misleading mutation labels with product-native review/routing/blocking language and object-level disabled reasons.
4. `A2-CLIENT-VISIBILITY-TRACE`: Trace all client-facing UI surfaces to `lib/visibility-engine.ts` projections and negative leakage states.
5. `A2-SAFETY-PROOF-DRIFT`: Restore route/state-specific screenshot proof for safety-critical workflow states.

## Item Report

Status: `completed_with_ui_and_workflow_gaps`  
Geaenderte Dateien: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_A1_SAFETY_AUTHORITY_FINDINGS.md`  
Produktcode geaendert: nein  
Tests: `pnpm guard:source`; targeted Playwright safety suite, `40 passed`  
Screenshot: nicht erzeugt, weil TASK-A1 keine UI-Aenderung autorisiert und keine Produkt-UI geaendert wurde  
Findings: 6 safety authority findings plus UI-pendant matrix; P0 fuer Export Authority command-spine UI, Compliance Release object continuity, Admin Non-Bypass semantic authority and Client Visibility trace  
Naechstes Item: `TASK-B1 - Analyse process-step to UI traceability sources`
