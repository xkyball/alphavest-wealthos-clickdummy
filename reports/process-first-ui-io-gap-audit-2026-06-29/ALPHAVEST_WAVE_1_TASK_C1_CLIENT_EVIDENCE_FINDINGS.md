# AlphaVest Wave 1 / TASK-C1 Client Context and Evidence Lifecycle Findings

Datum: 2026-06-29  
Status: `COMPLETED_WITH_UI_PROOF_GAPS`  
Wave: `Wave 1`  
Item: `TASK-C1`  
Arbeitsmodus: Analyse / Research / Spike, keine Produktcode-Aenderung

## Definition Re-Read

Quelle: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`

`TASK-C1` fordert die Analyse der Client-Context- und Evidence-Lifecycle-Gaps. Scope sind Client Profile, Family Members, Entity/Relationship Outputs, Wealth Map, Sensitivity, Evidence Request, Upload/Review/Sufficiency, Vault/Readmodel und Client-safe Summary. Out of scope ist direkte Implementation.

## Executive Finding

Client Context und Evidence Lifecycle sind nicht pauschal "nur UI". Mehrere Kerne sind bereits API/DB/workflow-backed:

- Client Profile: `/api/profile`, DB-backed, tenant-/role-scoped, audit/no-client-release proof.
- Family Members: `/api/family-members`, DB-backed, tenant/object scoped, audit/no-client-release proof.
- Entities: `/api/entities`, DB-backed create/list, validation/no-partial-row proof.
- Documents Upload: `/api/documents/upload`, Document/Version/Extraction/EvidenceRecord/Audit backed.
- Evidence Review/Sufficiency: `/api/documents/review` + `lib/evidence-review-service.ts`, role/gate/audit backed.

Die Hauptluecken liegen in der UI- und Readmodel-Kohärenz:

- Der im Task genannte Pfad `app/api/client-profile/route.ts` ist stale; die aktive Route ist `app/api/profile/route.ts`.
- Family member target selection ist schwach, weil die Detailform aktuell an `rows[0]` haengt statt an expliziter Row-Auswahl.
- Relationship Map, Entity Detail und Wealth Map sind in den geprueften Flächen teilweise display-/demo-backed oder nur command-linked.
- Evidence Vault S046/S047 in `components/decisions-governance-screen.tsx` ist nicht an das backend-backed `/api/documents`/Evidence-Readmodel angeschlossen.
- Client-safe Summary wird service-seitig erzeugt, aber nicht als verknuepfte Evidence-Vault/Client-Projection UI durchgaengig gezeigt.
- Browser-Flow-Proof fuer Upload ist aktuell gebrochen: alle 5 `tests/document-upload-flow.spec.ts` Tests timeouten auf `Tenant context`.

## Tests

Ausgeführt:

`PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3127 pnpm playwright test tests/av27-client-context-closure.spec.ts tests/document-upload-api.spec.ts tests/document-upload-flow.spec.ts --workers=1`

Ergebnis: `15 passed`, `5 failed`

Grün:

- `tests/av27-client-context-closure.spec.ts`: 5/5 passed
- `tests/document-upload-api.spec.ts`: 10/10 passed

Fehlgeschlagen:

- `tests/document-upload-flow.spec.ts`: 5/5 failed

Alle UI-Flow-Failures haben denselben Root: `locator.selectOption` wartet auf `getByLabel("Tenant context").last()` auf `/documents/upload` und laeuft in Timeout. Damit ist der API-/DB-Proof stark, aber der aktuelle Browser-/UI-Proof fuer Upload/Review nicht belastbar.

## Source Artifact Map

| Artifact | Finding |
| --- | --- |
| `components/client-intake-screen.tsx` | Client Profile, Family Members, Entity List/Create und Document Upload/Review enthalten echte UI Inputs und API-backed Actions. Relationship Map, Entity Detail und Wealth Map Uebergaenge sind teilweise display-/demo-backed oder command-linked. |
| `components/decisions-governance-screen.tsx` | S041 Evidence Request ist workflow-backed; S046/S047 Evidence Vault/Detail sind primär Demo-Explorer mit blocked Share und Drawer-State, nicht backend-query-backed. |
| `lib/evidence-review-service.ts` | Review/Sufficiency ist stark workflow-backed: role checks, permission gate, audit-before-state-change, EvidenceRecord/DocumentReview/DocumentLink/EvidenceItem/Audit writes. |
| `lib/evidence-lifecycle-contract.ts` | Definiert Evidence Lifecycle States/Routes/Steps und Forbidden Overclaims, aber ist kein readmodel-backed UI-Beweis. |
| `app/api/client-profile/route.ts` | Stale source reference: Datei existiert nicht. |
| `app/api/profile/route.ts` | Aktive Profile API, GET/PATCH mit scope validation, permission errors, no-client-release safety. |
| `app/api/family-members/route.ts` | GET/PATCH mit tenant/actor scope, pagination/sort, no-client-release mutation safety. |
| `app/api/documents/upload/route.ts` | Multipart upload, safe response, no storage/checksum leak, safety says upload-only/review-pending/no release. |
| `tests/av27-client-context-closure.spec.ts` | API/DB proof for profile, family, entity, relationship audit, sensitivity/no-leak. No UI proof. |
| `tests/document-upload-api.spec.ts` | Strong API/DB proof for upload, version, extraction, evidence, audit, no export, no leakage and fail-closed paths. |
| `tests/document-upload-flow.spec.ts` | Intended UI proof exists, but currently fails before upload because Tenant context selector is unavailable. |

## Gap Register

### C1-F01 - Stale client profile source path

Priority: `P2`  
Gap Type: `source_artifact_drift`  
Evidence: TASK-C1 names `app/api/client-profile/route.ts`; current code uses `/api/profile` in `components/client-intake-screen.tsx` and `app/api/profile/route.ts`.

Impact:

Future specs or generators could search the wrong API artifact and classify a real backed flow as missing.

Next target:

Normalize future trace artifacts to `app/api/profile/route.ts` and record `/api/profile` as canonical Client Profile API.

### C1-F02 - Family Member detail lacks explicit selected object state

Priority: `P1`  
Gap Type: `weak_target_object_binding`

Evidence:

`components/client-intake-screen.tsx` loads DB-backed family rows and edits via `/api/family-members`, but the detail form binds to `const selected = rows[0]`. The table supports search/sort/pagination, but the selected edit target is not explicitly selected by the user.

Impact:

The UI input/output exists and is DB-backed, but target-object intent is weak. A Process-First claim needs "this selected member" to be visible and stable before mutation.

Next target:

Add explicit row selection state and show selected member id/name/scope in the detail form and mutation payload.

### C1-F03 - Relationship Map and Entity Detail are not fully readmodel-backed

Priority: `P1`  
Gap Type: `display_only_or_command_linked_ui`

Evidence:

Relationship graph rows/nodes come from imported demo data while typed maintenance commands can add/open edges. Entity list/create is API-backed, but `/entities/:id` detail renders imported entity detail/participants/documents instead of loading by route id.

Impact:

Entity creation/list proof is strong, but entity/relationship output proof is incomplete for selected-object detail and relationship readmodel.

Next target:

Introduce a relationship/entity detail readmodel slice: selected entity/relationship route id, DB read, output fields, audit state and no-client-release/no-visibility proof.

### C1-F04 - Wealth Map and Sensitivity are not closed as workflows

Priority: `P1`  
Gap Type: `display_or_route_handoff_only`

Evidence:

Client context surfaces show sensitivity/visibility fields and tests prove sensitivity hiding in APIs. Wealth Map is reached via `/wealth-map` / `components/wealth-actions-screen.tsx`; in the C1 source set it is mostly a route/command handoff.

Impact:

Sensitivity protection is service/test-backed, but wealth-map state and sensitivity classification are not yet proven as end-to-end UI workflows with inputs, outputs and durable state.

Next target:

Define a Wealth Map/Sensitivity slice with classification input, visibility output, route-level selected object, service/readmodel evidence and client-safe projection proof.

### C1-F05 - Evidence Request is workflow-backed but still fixed-target/demo-data heavy

Priority: `P1`  
Gap Type: `weak_target_object_binding`

Evidence:

S041 evidence request has UI inputs: acknowledgement, reason, exact phrase, and submits `request_evidence` through the recommendation review workflow. However Missing-/Requested-Evidence lists are demo data and the action uses fixed demo target ids.

Impact:

The workflow exists, but the UI does not yet prove that the visible review, requested evidence items, target recommendation and evidence ids are the same selected process object.

Next target:

Bind S041 selected review/evidence request to a readmodel-backed review object and render durable post-command requested evidence state.

### C1-F06 - Evidence Vault S046/S047 is not service-backed

Priority: `P1`  
Gap Type: `readmodel_missing`

Evidence:

S046 Evidence Vault uses `evidenceRows` demo data and `useState` selection; drawer loading is local UI state; filters are explicitly marked `disabled_static` until the evidence workbench is backend-query-backed. S047 uses `evidenceRecord`/`evidenceTimeline` demo data.

Impact:

Vault browsing and record detail cannot be claimed as Evidence Lifecycle closure. They are review UI placeholders with good no-overclaim boundaries, but not process-complete readmodels.

Next target:

Connect Evidence Vault and Evidence Record Detail to `/api/documents` or a dedicated Evidence readmodel. Include filters, selected evidence id, lineage, sufficiency, client-safe summary and blocked share/download state.

### C1-F07 - Client-safe Summary is produced but not traceably projected in UI

Priority: `P1`  
Gap Type: `missing_output_ui`

Evidence:

`lib/evidence-review-service.ts` writes `clientVisibleSummary`, Evidence summary and redacted visibility for sufficiency actions. S046/S047 do not read and display that as a live linked projection; API tests sometimes force release states directly via Prisma for projection checks.

Impact:

Client-safe summary cannot yet be claimed as a fully closed UI output of the evidence lifecycle.

Next target:

Render a backend-sourced client-safe summary card in Vault/Detail and connect it to release-safe visibility status, with no raw payload/storage/checksum leakage.

### C1-F08 - Upload and review API proof is strong, but UI proof is currently broken

Priority: `P0`  
Gap Type: `ui_proof_broken`

Evidence:

`tests/document-upload-flow.spec.ts` fails 5/5. Every failure times out on `getByLabel("Tenant context").last()` after navigating to `/documents/upload`.

Impact:

Upload/Review API can be trusted, but the current visible upload flow proof cannot be used as Process-First UI acceptance evidence until the selector/context UI is repaired or the test is updated to the actual product-native session control.

Next target:

Repair the Document Upload Browser proof path: ensure tenant/role context is accessible at `/documents/upload` or update the test to the canonical context control. Then re-run UI flow and capture screenshot evidence.

## Current Strengths

- Profile save/reload/wrong-tenant denial is DB/API-backed.
- Family member edit/wrong-object/wrong-actor denial is DB/API-backed.
- Entity invalid submit no-partial-row and valid tenant-linked creation are DB/API-backed.
- Relationship audit-fail-closed path is tested through data maintenance command.
- Document upload creates Document, Version, Extraction, EvidenceRecord, EvidenceItems and AuditEvent.
- Upload does not unlock export/release/client visibility.
- Evidence Review/Sufficiency enforces role, permission, scope, audit-before-state-change and no-client-release.
- API projections hide storage keys, checksums, evidence internals and sensitivity fields from client roles.

## Recommended Implementation Slices

1. `C2-FAMILY-TARGET-SELECTION`: explicit family row selection and selected-object mutation state.
2. `C2-ENTITY-RELATIONSHIP-READMODEL`: DB-backed entity detail and relationship graph/readmodel.
3. `C2-WEALTH-SENSITIVITY-WORKFLOW`: wealth map state plus sensitivity classification and visibility output.
4. `C2-EVIDENCE-REQUEST-OBJECT-BINDING`: selected review/evidence request target continuity.
5. `C2-EVIDENCE-VAULT-READMODEL`: backend-query-backed Evidence Vault and Evidence Record Detail.
6. `C2-CLIENT-SAFE-SUMMARY-PROJECTION`: render service-produced client-safe summary as live UI output.
7. `C2-UPLOAD-UI-PROOF-REPAIR`: restore browser flow proof and screenshot capture for upload/review.

## Item Report

Status: `completed_with_ui_proof_gaps`  
Geaenderte Dateien: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_C1_CLIENT_EVIDENCE_FINDINGS.md`  
Produktcode geaendert: nein  
Tests: C1 targeted suite `15 passed`, `5 failed` due `/documents/upload` UI selector `Tenant context` timeout  
Screenshot: nicht erzeugt, weil keine UI-Aenderung vorgenommen wurde und die UI-proof Tests vor der target flow state scheiterten  
Findings: Client/Evidence API/DB layer is strong; UI proof and selected-object/readmodel closure remain incomplete.  
Naechstes Item: `TASK-D1 - Analyse analyst and advisor lifecycle gaps`
