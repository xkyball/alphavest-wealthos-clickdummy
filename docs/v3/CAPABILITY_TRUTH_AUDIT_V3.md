# AlphaVest Capability Truth Audit V3

Date: 2026-06-17
Mode: Max / mixed ENGINE_v2 + ENGINE_v3 audit
Scope: Planned product workflows, data model, input masks, demo-workflow API, permission gates, document upload/export realism, and screen behavior.

## Executive Verdict

AlphaVest is a broad, well-structured demo-data application with a rich Prisma data model, centralized route registry, demo permission engine, workflow gate logic, and many fixture-backed workflow mutations. It does not yet support real document upload by drag and drop or file picker. The visible document upload screen is a simulation; the API accepts only JSON `actionId`, no binary payload, no multipart form body, no object-store write, no real virus scan, no OCR/extraction job, and no binary export package generation.

The same pattern appears beyond document upload: many screens show plausible operational UI, but important fields are static/read-only, buttons trigger fixed demo fixture actions, and workflows often mutate pre-seeded records rather than user-entered data. The application is valuable as a journey clickdummy and evidence-backed workflow simulator, but it is not yet a general-purpose operational system for maintaining client, family, entity, document, communication, export, governance, and policy data.

## Evidence Standard

Classification used in this audit:

- `E0 Not present`: planned capability has no meaningful UI/API/model surface.
- `E1 Visual only`: screen exists, no real interaction.
- `E2 Static interaction`: local UI state or route hop only.
- `E3 Generic audit`: action writes audit/proof without domain mutation.
- `E4 Fixture mutation`: fixed seeded data is mutated, no user payload.
- `E5 Partial domain mutation`: domain tables are updated, but only for bounded demo journeys.
- `E6 Gated workflow simulation`: fixture mutation plus permission/gate/evidence behavior.
- `E7 Operational`: user input or file payload is validated, persisted, reloaded, permissioned, audited, and covered by tests.

No audited capability reached `E7`.

## Facts

- The app uses a catch-all Next route that resolves route metadata to component groups (`app/[...segments]/page.tsx:1`).
- Demo actions are posted through `triggerDemoWorkflow(actionId)` as JSON only (`lib/screencast-demo-client.ts:1`).
- The workflow API parses `request.json()` and validates an `actionId` string; it does not parse `FormData` or file streams (`app/api/demo-workflow/route.ts:3777`).
- The document upload fixture creates deterministic file metadata and explicitly marks no binary file storage and deferred file realism (`app/api/demo-workflow/route.ts:974`, `app/api/demo-workflow/route.ts:996`).
- File metadata validation accepts a deterministic metadata object, not bytes or a real uploaded file (`lib/file-metadata-service.ts:1`).
- Export realism is metadata-only; export manifests declare `realBinaryGenerated: false` (`lib/export-package-service.ts:16`).
- Regression coverage intentionally asserts metadata-only file/export behavior (`tests/file-export-realism.spec.ts:1`).
- Permission handling is centralized in a deterministic demo permission engine (`lib/permission-engine.ts:40`).
- Sensitive demo mutations are wrapped in `executeDemoWorkflowMutation`, which records permission checks, audit events, and proof metadata (`lib/demo-workflow-mutation.ts:61`).
- Workflow gates enforce important product rules such as no client release before advisor approval, compliance release, evidence, and permission (`lib/workflow-gate.ts:1`).
- The Prisma model is broad and includes tenants, users, roles, permissions, access requests, second confirmations, clients, family, relationships, entities, assets, documents, document versions, extraction fields, reviews, links, triggers, actions, recommendations, approvals, compliance releases, client decisions, evidence, audit events, review schedules, communications, exports, data quality, and policy tables (`docs/v3/DATA_MODEL_V3.md`, `prisma/schema.prisma`).

## Assumptions

- Demo-data-first remains the intended near-term architecture; this audit does not recommend introducing real external identity providers or real client data immediately.
- The app should evolve from fixed journey simulation toward operational demo CRUD, not directly toward production finance/legal/tax advice.
- Real upload means at minimum: browser file selection or drop, multipart API handling, binary storage, document/version rows tied to stored object metadata, virus-scan/OCR/extraction job state, audit/evidence creation, and UI reload from persisted state.

## Interpretation

The implementation has strong foundations for workflow semantics and proof logging, but the interaction layer is mostly not yet wired to user-provided payloads. The highest risk is not only "upload missing"; it is that screens can communicate operational readiness while still executing deterministic demo scripts. The next build slice should therefore convert the most important visible inputs into real persisted payloads, starting with document upload because it is a natural proof point for the entire evidence-backed system.

## Capability Matrix

| Capability | Current Level | What Works | Missing For Operational Readiness |
|---|---:|---|---|
| Real document upload | E1-E5 | Document screen, upload route action, document/version/extraction fixture rows, audit/evidence metadata | File input, drag/drop handler, multipart API, binary storage, virus/OCR job, user-provided metadata, persisted reload, download |
| Extraction review | E5 | Fixed extraction fields can be finalized through `j04.confirmFinalize` | Editable field values, validation, reviewer comments, diff history, field-level confidence updates |
| Client profile maintenance | E4-E5 | Static profile screen and fixture submit/add-family actions | Real forms, field validation, dirty state, save draft payload, persisted profile reload |
| Family and relationships | E4-E5 | Fixture member and relationship actions | Add/edit/remove arbitrary people, relationship graph validation, household scoping |
| Entity and asset intake | E4-E5 | Fixture journey actions for readiness and request-info flows | Generalized entity/asset forms, ownership data, valuation source handling, data quality queue integration |
| Tenant setup | E4-E5 | Tenant/team/invitation demo actions | Persisted form fields, activation preconditions, real invitation lifecycle, policy setup |
| Platform policy setup | E3 | Generic audit-style save behavior | Versioned policy persistence, validation, effect on permission/workflow gates |
| Governance role management | E4-E6 | Role/access fixture actions and permission denials | Editable role forms, second confirmation phrase validation, reusable approval workflow |
| Advisor/compliance/client decisions | E6 | Central gates and fixture journeys demonstrate no-unapproved-advice controls | Payloaded notes, real decision attachments, family decision variants, reusable state machine |
| Communication escalation | E1-E3 | Communication screens and message/call model exists | Real message draft/send, call record creation, delivery status, audit/evidence linkage |
| Evidence vault | E4-E5 | Evidence objects and fixture download/share actions | Real file/link evidence upload, object ACLs, signed download, sharing workflow |
| Export package | E5 | Export manifest metadata, scope/redaction fixture state | Real package generation, binary artifact, async status, download, audit route, object storage |
| Ops monitoring | E1-E2 | Visual queue/status screens | Live queues from workflow states, assignment, SLA transitions, bulk actions |
| Security/auth | E4-E6 demo | Role/tenant switcher and deterministic deny codes | Real session actor binding, per-route authorization, non-demo enforcement tests |

## Upload Finding

The app does not yet support real document upload. The user can see a dropzone-like upload screen, but cannot actually drop a file or pick a file. The "Choose Files" control is only a button, and the upload action posts `j04.uploadDocument`. The server then creates deterministic metadata for "UBS statement April 2026.pdf" and related extraction state. This proves the journey and downstream workflow shape, but not file ingestion.

Required next slice:

1. Add a real `DocumentUploadForm` with hidden file input, drag/drop handlers, status states, and client-side checks for file type/size.
2. Add `POST /api/documents/upload` using `request.formData()`.
3. Store bytes in a demo object-store adapter, preferably local filesystem for demo and MinIO-compatible interface later.
4. Persist `Document`, `DocumentVersion`, `FileMetadata`, extraction job status, audit event, and evidence record from the uploaded file, not a fixture.
5. Show the persisted document row immediately after upload and reload it from the database.
6. Add tests proving multipart upload, rejection paths, audit creation, and persisted reload.

## Broader Risk Pattern

The dominant implementation pattern is "route plus polished UI plus fixed demo action". That is appropriate for journey validation but risky as soon as the app is presented as operational software. The next implementation strategy should replace static `FieldBox` / `FieldPill` / read-only values with real form state in prioritized areas, then route submissions to domain services that accept typed payloads.

## ENGINE V2 Method Artifacts

### Psycho-Logic And Map

User expectation: "If I can see a dropzone, I expect I can drop a file and the system processes it."

Current system reality: "If I click upload, the demo workflow mutates seeded rows and logs proof metadata."

Trust gap: The UI suggests direct manipulation; the implementation mostly provides scripted proof of intended future behavior. Closing this gap requires making every high-prominence interaction either real, clearly disabled, or explicitly marked as demo-only in internal QA artifacts.

### Reframing Matrix

| Frame | Question | Result |
|---|---|---|
| User value | Can a user complete work with their own data? | Mostly no; many flows use fixture data. |
| Product proof | Does the system prove the intended workflow semantics? | Often yes; gates/audit/evidence are strong for demo journeys. |
| Engineering readiness | Can features scale beyond seeded records? | Not yet; payloaded services are sparse. |
| Compliance risk | Can unapproved advice reach client visibility? | Core demo gates reduce this risk, but only in simulated journeys. |

### TRIZ

Contradiction: The app needs fast demo polish and true operational behavior. The current solution chose polished deterministic journeys. The next inventive move is to keep deterministic seed journeys while adding payloaded services behind the same UI components, so demos stay stable and real data paths become testable.

### SIT Closed World

Use existing components and services first:

- Convert `FieldBox` patterns into controlled form fields where the model already exists.
- Reuse `executeDemoWorkflowMutation` for audited payload actions, but stop using only action IDs.
- Extend the existing file metadata and export services rather than adding unrelated upload/export stacks.
- Use existing Prisma document/version/extraction/evidence/audit tables as the upload spine.

### Morphological Analysis

| Dimension | Option A | Option B | Recommended |
|---|---|---|---|
| Upload storage | Local demo filesystem | MinIO/S3 adapter | Adapter interface with local demo implementation first |
| API payload | JSON action only | Multipart form | Multipart for upload, typed JSON for non-file forms |
| Extraction | Fixture fields | Async job state | Async job state with deterministic demo extractor |
| UI mode | Static journey | Real form with seeded defaults | Real form initialized from seeds |
| Export | Manifest only | Generated archive | Generated demo archive plus manifest |

### SCAMPER

- Substitute fixture-only upload with multipart upload service.
- Combine audit/evidence creation with payloaded form submissions.
- Adapt static review screens into reusable review editors.
- Modify demo actions to accept optional payloads.
- Put seeded journey data to use as editable initial state.
- Eliminate read-only confirmation phrase fields for sensitive actions.
- Reverse flow validation by testing reload from DB before visual polish.

### Harvard / Principled Negotiation

Interests:

- Product needs a convincing WealthOS demo.
- Engineering needs honest implementation boundaries.
- Compliance needs no accidental advice/client-release bypass.
- Users need visible UI to match actual capability.

BATNA if no implementation change: keep calling this a clickdummy and avoid operational claims.

Fair offer: Ship a "truthful demo operationalization" phase that upgrades the top workflows to persisted payloads while preserving the demo journey harness.

### MESOs

| Option | Scope | Tradeoff |
|---|---|---|
| Upload-first | Real document upload, extraction fixture, persisted reload | Fastest high-trust fix |
| Data-maintenance-first | Profile/family/entity/tenant forms and payload APIs | Broadly improves workflow credibility |
| Governance-first | Policy, role, access, second confirmation payloads | Strongest compliance story |

Recommended sequence: Upload-first, then data-maintenance, then governance/export.

### Measurement Plan

- Count visible buttons with no handler or only generic demo action.
- Count planned workflow nodes at `E7`.
- Add regression tests for upload multipart, form payload persistence, denied actions, and DB reload.
- Track route coverage for planned pageflow routes.
- Treat metadata-only binary/export tests as expected failures once real implementation starts, then update them.

### Ethics And Fairness

The app should not imply that client data, documents, exports, approvals, or financial recommendations are operationally processed when they are fixture simulations. Until payloaded workflows exist, demos and QA docs should state the boundary clearly. No real client data should be used during this transition.

## ENGINE V3 Branch Portfolio

| Branch | Hypothesis | Kill / Keep | Reason |
|---|---|---|---|
| A: Only fix upload | Upload is the only missing core feature | Kill | Same static/payload gap appears in profile, tenant, governance, communication, export. |
| B: Rewrite whole app backend | Static UI means backend must be replaced | Kill | Existing data model, permission engine, gates, and audit wrapper are useful foundations. |
| C: Payload operationalization phase | Keep demo journeys, add real services for top workflows | Keep | Best risk/value balance. |
| D: Mark everything as demo-only | Avoid overbuilding | Keep as fallback | Honest, but does not satisfy operational demo ambitions. |

## Proof Paths

1. Upload proof: a dropped file creates a stored object, `DocumentVersion`, extraction job state, audit event, evidence row, visible document row, and downloadable binary.
2. Form proof: editing profile/family/entity fields changes DB rows and survives reload.
3. Gate proof: blocked client release returns deterministic denial with no state mutation.
4. Export proof: export request creates a binary artifact and manifest with `realBinaryGenerated: true`.
5. Governance proof: role/access changes require editable second confirmation and create reviewed audit events.

## Learning Log

- The system is more advanced in workflow semantics than in input/data maintenance.
- Upload is intentionally documented as metadata-only in previous QA artifacts.
- Role/permission denials are centralized and therefore reusable for real payload APIs.
- The data model already anticipates many missing capabilities; the gap is mostly service and UI wiring.
- The next work should avoid new broad abstractions and instead operationalize one vertical workflow end to end.

## Method Compliance Checklist

- Discover: docs, schema, routes, components, API, tests inspected.
- Define: capability levels and root risk pattern defined.
- Develop: solution branches and MESOs produced.
- Deliver: audit, backlog, workflow matrix, input-mask requirements, and JSON artifact created.
- V2 methods applied: Psycho-Logic, Reframing, TRIZ, SIT, Morphological Analysis, SCAMPER, Harvard/BATNA, MESOs, Measurement Plan, Ethics.
- V3 methods applied: evidence-first, branch portfolio, kill/keep decisions, proof paths, learning log.

