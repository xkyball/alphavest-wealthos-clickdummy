# AlphaVest WealthOS V3 User Journey Playbook

Date: 2026-06-15

Engine mode: `ENGINE_MIX_V2_CODEX_V3_PROOF`

Purpose: document the 10 most relevant AlphaVest WealthOS user journeys as executable demo, QA and implementation artifacts. This document is intentionally source-bound: it uses the v3 source-of-truth files, current route registry, current demo data, current UI components and current smoke/visual contract scripts. It does not invent production behavior beyond what is labelled as an expected implementation or QA target.

## Source Discipline

### Facts

- The app is demo-data-first and must not start with real authentication.
- Current routes are registered centrally in `lib/route-registry.ts`; dynamic route smoke paths use `demo` for `:id` segments.
- Current UI groups are implemented through a catch-all route in `app/[...segments]/page.tsx`.
- Current demo session role and tenant switching is available in the relevant top bars through `DemoSessionProvider`.
- `workflowGate.canBecomeClientVisible()` blocks client visibility unless recommendation release, advisor approval, compliance release, evidence and permission gates all pass.
- `permissionEngine.can()` is permissive in demo mode but exposes audit, second confirmation and compliance-review flags.
- `evidenceService`, `auditService` and `exportService` currently create deterministic previews/gate decisions, not full production persistence.
- Page references under `public/reference/page_ui_v3/clean_pages/` are design direction and screen composition references, not pixel-perfect contracts.
- The clean UI rule forbids spec panels, route labels, filenames, annotation rails, dev notes and callout legends as product UI.

### Assumptions

- Dynamic routes use smoke paths such as `/tenants/demo/setup`, `/entities/demo`, `/workbench/triggers/demo`, `/advisor-approval/demo`, `/compliance/demo/review`, `/decisions/demo`, `/evidence/demo` and `/export/demo/scope`.
- Input values listed below should be used as QA data even when the current demo renders them as static or read-only.
- Clicks listed below are executable UI anchors when current components expose them; when a current button is static, the expected workflow effect is a target for later implementation phases.
- Topbar role/tenant selections are test steps because real authentication is intentionally deferred.

### Interpretations

- A journey is relevant when it proves a product rule, crosses roles, exercises client visibility, produces or uses evidence/audit, and can be inspected through current routes.
- The strongest demo narrative is: setup -> tenant/user onboarding -> client intake -> internal review -> advisor approval -> compliance release/block -> client decision -> evidence/export/audit.
- Ops/reference routes are useful for QA and program management but are less important as end-user journeys than client, advisor, compliance, governance and export flows.

### Open Questions

- Whether current static buttons should be wired to persisted demo state in Phase 14 or kept as visual proof only.
- Whether `communication` and `export` should remain separate flows or be linked after a released decision package.
- Whether visual QA should add Playwright click-path scripts for this playbook or keep the current fetch-based smoke scripts.

## V3 Mission Card

| Field | Decision |
| --- | --- |
| Mission | Select and document exactly 10 high-value user journeys for AlphaVest WealthOS V3. |
| Primary artifact | `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`. |
| Source hierarchy | Repo instructions and v3 docs first; current route registry, demo data, components and scripts second; visual references as UI direction. |
| Quality bar | Every journey has actor, tenant context, inputs, clicks, state expectation, evidence/audit expectation, client-visibility rule, risk and QA assertion. |
| Non-goals | No app-code changes, no real auth, no invented persisted workflow behavior, no spec chrome as UI. |

## V3 Evidence Intake

| Evidence | Used for |
| --- | --- |
| `AGENTS.md` | Product rules, clean UI rule, required stack and reporting expectation. |
| `CODEX_MASTER_TASK.md` | Demo-data-first mission, phase discipline and no-unapproved-advice rule. |
| `docs/v3/CODEX_TASKS_DETAILED_V3.md` | Phase scope, screen groups and quality gates. |
| `docs/v3/SCREEN_CATALOGUE_V3.md` | 63 route catalogue, visual modes and assets. |
| `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md` | Design interpretation and what not to implement from images. |
| `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md` | Correct build sequence and security deferral. |
| `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md` | PF-A through PF-J and UF-01 through UF-14. |
| `docs/v3/DATA_MODEL_V3.md` | Domain objects, states, no-unapproved-advice gate, export gate. |
| `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md` | Product gates and core Playwright flow targets. |
| `docs/v3/USERFLOW_DEFINITIONS_V3.md` | Userflow names and outcomes. |
| `docs/v3/WORKFLOW_DEFINITIONS_V3.md` | Product workflows and blocked-state requirements. |
| `docs/v3/PAGE_SPECS_V3.md` | Per-route input, output, states and controls. |
| `lib/route-registry.ts` | Current route IDs, smoke paths, pageflow/userflow IDs and visual modes. |
| `lib/*-demo-data.ts` | Current demo names, fields, records, statuses and proof-like objects. |
| `components/*-screen.tsx` | Current visible buttons, tabs, topbar selectors and state surfaces. |
| `scripts/smoke-phase-*.ts`, `scripts/visual-qa-contract.ts` | Current route and visual-contract verification paths. |

## V2 Double Diamond

### Discover

- The product promise is not generic wealth management; it is digital-first, human-reviewed and evidence-backed.
- The highest-risk product rule is client visibility: advisor approval alone must never release advice-like content.
- The app has route coverage for access, platform, tenant setup, client workspace, wealth/actions, advisory workflow, decisions/evidence, governance, communication, export and ops.
- Current implementation is demo/stub heavy. The playbook must be executable as UI navigation and QA intent, while marking persistence expectations clearly.

### Define

The 10 journeys must prove:

- Role and tenant context can be switched without real auth.
- Client-facing surfaces never show internal or unreleased advice.
- Advice-like work moves through analyst/advisor/compliance before client decision.
- Evidence, audit and export controls are visible and testable.
- Sensitive access and release actions require confirmation, audit or compliance gates.

### Develop

Candidate journeys were generated from UF-01 through UF-14, then merged where a demo story naturally spans multiple userflows. Routes were scored for product rule coverage, role crossover, evidence/audit depth, visual maturity and QA risk.

### Deliver

The selected Top 10 are listed below. Non-selected candidates remain documented with reasons so later phases can still pick them up.

## V2 Method Artifacts

### Psycho-Logic + Map/Model

| Artifact | Output |
| --- | --- |
| Rational-Logic Summary | The system must prevent premature client visibility, show operational state, preserve auditability and provide testable role/tenant context. |
| Psycho-Logic Drivers | Clients need confidence, advisors need control, compliance needs defensibility, ops needs workload clarity, and admins need low-risk setup. |
| Current Maps Audit | Route catalogue maps pages; data model maps objects/states; workflow docs map roles/transitions; demo data maps proof scenarios; visual refs map screen composition. |
| Map Traps | Treating visual boards as literal UI, treating static buttons as persisted workflow, treating advisor approval as client release, treating reference pages as product journeys. |
| Blind Spots | No browser click execution was run during this docs-only pass; current buttons may need Phase 14 state wiring. |
| Fairness / Legitimacy Risks | Do not use friction to hide decisions; use release gates, evidence and audit as transparent controls. |
| Design Moves | Make each journey stateful, show missing gates, label internal-only surfaces, require evidence/audit on sensitive actions. |

### Reframing Matrix

| Lens | Low control | High control |
| --- | --- | --- |
| Client-facing | "What do I need to do today?" -> mobile/portal, decisions, evidence. | "What am I allowed to see and decide?" -> released decisions, evidence, export. |
| Internal-facing | "What work is blocked?" -> queues, actions, missing evidence. | "What can be released safely?" -> advisor approval, compliance release, audit. |

Best frame: "AlphaVest is a proof and visibility workflow, not just a wealth dashboard."

Wrong frame to avoid: "A financial advice app where attractive recommendations can be sent after advisor approval."

### TRIZ Contradictions

| Contradiction | Improving parameter | Worsening risk | Derived move |
| --- | --- | --- | --- |
| Make client journey fast without releasing unsafe advice | Speed | Compliance risk | Use next-step UI plus blocked gates and evidence requirements. |
| Show rich wealth structure without leaking restricted data | Transparency | Privacy leakage | Use restricted nodes, role-scoped evidence and audit access. |
| Let advisors approve efficiently without implying client release | Advisor throughput | Misleading state | Split advisor approval and compliance release into separate journeys. |
| Enable exports without over-sharing | Portability | Data minimisation risk | Require scope, redaction, preview, approval and audit. |
| Make demo easy without real auth | Testability | Security theatre | Use explicit demo role/tenant switchers and label production gaps. |

### SIT Closed World

Closed-world inventory: route registry, visual modes, demo session provider, seeded tenants/roles, demo data modules, gate services, smoke scripts, visual contract script, 63 clean page images.

| SIT operator | Move |
| --- | --- |
| Subtraction | Remove real auth from journeys; replace with role/tenant selector steps. |
| Multiplication | Use the same no-advice gate across mobile, actions, advisor, compliance, decisions and export. |
| Division | Split one big advice flow into analyst, advisor, compliance, client decision and evidence segments. |
| Task Unification | Let route smoke paths double as QA anchors for each journey step. |
| Attribute Dependency | Visibility depends on role, tenant, workflow state, evidence status and compliance release. |

### Morphological Analysis / Zwicky Box + CCA

| Dimension | Values |
| --- | --- |
| Actor | Admin, Client Success, Invited User, Principal, Family CFO, Analyst, Senior Wealth Advisor, Compliance Officer, Security/Admin, Privacy/Requester |
| Object | Tenant, User, Profile, Entity, Document, Trigger, Recommendation, ComplianceReview, Decision, EvidenceRecord, AccessRequest, ExportRequest |
| Gate | Demo session, Consent, Missing evidence, Advisor approval, Compliance release, Second confirmation, Redaction, Export approval |
| UI mode | Normal page, Wizard, Drawer, Modal, Release state, Block state, Preview panel, Reference/internal |
| Proof | Audit preview, Evidence placeholder, Evidence record, Access audit, Export timeline, Smoke route, Visual asset |

CCA rejects:

- "Advisor approves -> client sees decision" rejected because compliance release is required.
- "Reference-only roadmap becomes client journey" rejected because it is internal planning.
- "Export download before redaction/approval" rejected because export gate requires redaction and approval when required.
- "Client sees internal analyst trigger notes" rejected because triggers are internal until released as safe prompts.

Kept variant families:

- Setup and onboarding readiness.
- Client intake and document evidence.
- Internal signal-to-release workflow.
- Client decision and proof package.
- Governance/access and export controls.

### SCAMPER

| Operator | Idea |
| --- | --- |
| Substitute | Substitute real auth with role/tenant switcher until security activation. |
| Combine | Combine compliance release, decision and evidence into one defensible demo narrative. |
| Adapt | Adapt route smoke tests into journey QA anchors. |
| Modify | Expand step tables with exact fields, clicks, role context and query states. |
| Put to another use | Use visual modes as test states (`?state=release`, `?state=block`, `?state=drawer`). |
| Eliminate | Eliminate spec chrome and reference-only UI from end-user journeys. |
| Reverse | Start some tests from blocked states first, then prove what would unblock them. |

### Harvard / BATNA

| Artifact | Output |
| --- | --- |
| People/problem move | Separate user convenience from release safety; blockers are product controls, not distrust of users. |
| Interests map | Client: clarity and safe action. Advisor: efficient review. Compliance: defensible release. Admin/Ops: controlled setup and audit. |
| Mutual-gain options | Role switcher for speed, blocked-state visibility for safety, evidence/export for trust, smoke scripts for QA. |
| Objective criteria | v3 docs, data model gates, route registry, current component labels, smoke/visual scripts. |
| Our BATNA | Keep journeys as docs-only until Phase 14 wires state transitions. |
| Their BATNA | Users fall back to manual review, email, spreadsheet tracking and ad hoc evidence packs. |
| BATNA improvement | Turn this playbook into Playwright scripts once stateful workflow behavior is added. |

### MESOs

| Offer | Equal-value logic | Best fit | Proof plan |
| --- | --- | --- | --- |
| A - Demo Script First | High narrative clarity, lower implementation pressure. | Investor/demo walkthrough. | Manual browser run using this playbook. |
| B - QA Matrix First | High regression value, lower storytelling polish. | Engineering hardening. | Convert journey steps into Playwright tests. |
| C - Implementation Backlog First | High delivery planning value, lower immediate demo usability. | Phase 14 workflow lifecycle. | Create tickets per missing persisted transition. |

Recommended path: A now, then B/C after Phase 14 starts.

## Longlist And Selection

| Candidate | Source workflow | Score | Selected | Reason |
| --- | --- | ---: | --- | --- |
| Platform policy and no-advice baseline | UF-01, PF-A | 8 | Yes | Establishes release/evidence/export policy and second confirmation. |
| Tenant onboarding and principal invitation | UF-02, PF-B | 9 | Yes | Proves tenant readiness, team/policy/user setup and invite gate. |
| Invited user onboarding and consent | UF-03, PF-B | 8 | Yes | Proves demo auth flow, MFA, consent and role acknowledgement. |
| Client profile and family intake | UF-04, PF-C | 8 | Yes | Proves client-visible data capture and governance context. |
| Entity, wealth map and action board | UF-05, PF-C | 9 | Yes | Proves structure map, restricted nodes, blocked action/evidence state. |
| Document upload and verification | UF-06, PF-D | 9 | Yes | Proves upload, extraction draft, low-confidence/block and human review. |
| Signal review and advisor approval | UF-07/UF-08, PF-E | 10 | Yes | Proves internal-only trigger, advisor review and blocked publish. |
| Compliance release/block | UF-09, PF-F | 10 | Yes | Proves primary no-unapproved-advice gate. |
| Client decision and evidence package | UF-10/UF-11, PF-F/PF-I | 10 | Yes | Proves client action only after release and evidence creation. |
| Governance access change and audit | UF-12, PF-G | 9 | Yes | Proves sensitive access, second confirmation and immutable audit. |
| Communication escalation | UF-13, PF-H | 7 | No | Important, but currently lower than export/governance for core proof. Included in follow-up candidates. |
| Export and redaction package | UF-11, PF-I | 9 | Yes | Proves redaction, approval, download/share and audit. |
| Ops queues and SLA | UF-14, PF-J | 6 | No | Strong internal management route, but not central enough for Top 10. |
| Reference-only service blueprint/roadmap/states | UF-14, PF-J | 4 | No | Useful proof/reference surfaces, not end-user journeys. |

## Prioritized Top-10 Journey Table

| Rank | Journey | Primary actor | Core routes | Main proof |
| ---: | --- | --- | --- | --- |
| 1 | Signal to advisor approval without client visibility | Analyst / Senior Wealth Advisor | `/signals`, `/workbench`, `/workbench/triggers/demo`, `/advisor-approval`, `/advisor-approval/demo` | Internal-only workflow and publish gate remains blocked. |
| 2 | Compliance release or block | Compliance Officer | `/compliance`, `/compliance/demo/review`, `/compliance/demo/release`, `/compliance/demo/block`, `/compliance/demo/audit` | Compliance controls client visibility. |
| 3 | Client decision and evidence package | Principal / Family Council | `/decisions`, `/decisions/demo`, `/decisions/demo/success`, `/evidence/demo` | Released decision creates evidence and review schedule. |
| 4 | Document upload and verification | Family CFO / Analyst | `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending` | AI extraction is draft; human review and evidence are required. |
| 5 | Entity, wealth map and action board | Principal / Family CFO / Analyst | `/entities`, `/entities/new`, `/entities/demo`, `/wealth-map`, `/actions` | Restricted nodes and missing evidence block readiness. |
| 6 | Tenant onboarding and principal invitation | Admin / Client Success / Compliance | `/admin/tenants`, `/tenants/new`, `/tenants/demo/setup`, `/tenants/demo/team`, `/tenants/demo/policies`, `/tenants/demo/users` | Tenant cannot activate without team, policy, principal invite and audit. |
| 7 | Governance access change and audit | Principal / Admin / Compliance | `/governance/users`, `/governance/roles`, `/governance/access-requests`, `/governance/audit-history` | Sensitive access requires confirmation and audit. |
| 8 | Export with scope, redaction, approval and download | Principal / Compliance / Privacy | `/export/new`, `/export/demo/scope`, `/export/demo/redaction`, `/export/demo/preview`, `/export/demo/download` | Export gate, redaction profile, approval and download audit. |
| 9 | Client profile and family intake | Principal / Family CFO | `/portal`, `/client/profile`, `/client/family-members`, `/relationships` | Client data capture without internal notes or advice. |
| 10 | Platform policy and no-advice baseline | Platform Admin / Compliance / Security | `/admin/platform`, `/admin/policies/advice-boundary`, `/admin/roles`, `/admin/security`, `/admin/evidence-templates`, `/admin/export-templates` | Policies, evidence templates and second confirmation support every later gate. |

---

## Journey 1: Signal To Advisor Approval Without Client Visibility

- Ziel/Nutzen: Turn an internal signal into a documented advisor review while proving it is not client-visible advice.
- Primaerer Actor: Analyst.
- Weitere beteiligte Rollen: Senior Wealth Advisor, System, Compliance Officer later.
- Tenant/Demo-Kontext: Active tenant `Northbridge Family Office`; role starts as `Analyst`, then `Senior Wealth Advisor`.
- Preconditions: Demo session active; trigger and draft recommendation demo data available.
- Benoetigte Demo-Daten: `SIG-2025-001228`, `TRG-2025-000348`, `REC-2025-05-0147`, selected approval package.
- Start-Route: `/signals`.
- Endzustand: Advisor decision is recorded as expected target state, but client visibility remains blocked until compliance release.
- Relevante Screens/Routen: `/signals`, `/workbench`, `/workbench/triggers/demo`, `/advisor-approval`, `/advisor-approval/demo`.
- Relevante Komponenten/Modelle/Seeds: `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`, `lib/workflow-gate.ts`, `lib/route-registry.ts`.
- Evidence-/Audit-Erwartung: Analyst routing note and advisor approval should create audit/evidence items; current UI exposes the proof surfaces, later phases must persist them.
- Compliance-/Approval-Regel: Advisor approval alone does not release to client.
- Client-Visibility-Regel: Client visibility stays blocked; `Publish to Client` is disabled and missing compliance/evidence gates remain visible.
- Risiken/Grenzfaelle: Low-confidence data must not become recommendation copy; client cannot see internal notes.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/signals` | Role `Analyst`, tenant `Northbridge Family Office` | Use topbar role selector -> `Analyst`; inspect `SIG-2025-001228` | Signal queue shows `Large Outflow Detected`, low confidence and escalated state | Trigger remains internal-only | Audit expected for signal open/review | Page heading `Signal Review` is present; no client-facing advice copy. |
| 2 | `/signals` | Missing elements: Beneficial Owner, Purpose of Wire, Source of funds | Click routing option `Request Data / Information` | Low-confidence warning remains visible | Request-data path selected; no recommendation release | Audit event expected: trigger.request_data | `Low confidence due to incomplete data` is visible. |
| 3 | `/workbench` | Workbench readiness: 68%, publish readiness not ready | Inspect readiness checklist | `Publish Readiness` shows not ready and pending gates | Analyst work stays internal | Evidence links can be previewed | `Publish to Client` must be disabled. |
| 4 | `/workbench/triggers/demo` | Trigger `TRG-2025-000348`, analyst note, related object `Apex Global Holdings Ltd.` | Click `Reassign / Route` | Assignment/routing panel is visible | Trigger routed to advisor review | Audit expected: trigger.route | No client-visible state is created. |
| 5 | `/advisor-approval` | Role `Senior Wealth Advisor` | Use role selector -> `Senior Wealth Advisor`; click/select item `James Thornton` | Advisor queue shows pending review package | Advisor takes ownership of review | Audit expected: approval.opened | Queue contains `Pending Review`. |
| 6 | `/advisor-approval/demo` | Recommendation `REC-2025-05-0147` | Click `Approve` | Approval actions remain visible with alternatives and risk context | Target state: advisor approval complete | Evidence item expected: advisor approval | UI still labels status `Compliance Pending`. |
| 7 | `/advisor-approval/demo` | Negative path | Click/inspect `Escalate to Call` alternative | Escalation option is visible | Alternative outcome exists without client release | Audit expected if selected | Advisor approval path has non-release alternatives. |
| 8 | `/advisor-approval/demo` | No query param required | Inspect blocked release condition | Client release is not offered as final action | Compliance remains required | Gate evidence: `workflowGate.canBecomeClientVisible` | QA must assert advisor approval alone does not show decision in `/decisions`. |

---

## Journey 2: Compliance Release Or Block

- Ziel/Nutzen: Prove compliance is the release authority and can either release or block/request evidence.
- Primaerer Actor: Compliance Officer.
- Weitere beteiligte Rollen: Advisor, Analyst, Client later.
- Tenant/Demo-Kontext: Active tenant `Northbridge Family Office`; role `Compliance Officer`.
- Preconditions: Advisor review package exists and compliance queue has pending items.
- Benoetigte Demo-Daten: `CMP-2025-0137`, `CR-2025-05-21-0087`, `CR-2025-0417`, release checklist and missing evidence checklist.
- Start-Route: `/compliance`.
- Endzustand: Either release confirmation is shown or item remains blocked with requested evidence.
- Relevante Screens/Routen: `/compliance`, `/compliance/demo/review`, `/compliance/demo/release?state=release`, `/compliance/demo/block?state=block`, `/compliance/demo/audit`.
- Relevante Komponenten/Modelle/Seeds: `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/internal-workflow-demo-data.ts`, `lib/decisions-governance-demo-data.ts`, `lib/workflow-gate.ts`.
- Evidence-/Audit-Erwartung: Release, block and evidence-request actions create audit events; release should link evidence record.
- Compliance-/Approval-Regel: Release requires advisor approval, compliance checks, complete evidence and valid permission.
- Client-Visibility-Regel: `clientVisible` becomes true only on release path; block path must stay invisible to client.
- Risiken/Grenzfaelle: Missing risk disclosure, missing sign-off evidence, policy failures or incomplete evidence must keep release disabled.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/compliance` | Role `Compliance Officer`, tenant `Northbridge Family Office` | Select role/tenant in topbar; filter queue if needed | Compliance queue shows pending and high-risk items | Compliance review starts | Audit expected: compliance.queue.view | Page heading `Compliance Queue` and metrics visible. |
| 2 | `/compliance/demo/review` | Review `CR-2025-05-21-0087`, evidence 67%, release gates 0 of 4 | Click `More Filters` or inspect evidence checklist | Missing risk disclosure and sign-off evidence visible | Release remains blocked | Audit expected for review access | `Release gates not satisfied` is visible. |
| 3 | `/compliance/demo/review` | Missing evidence | Click `Request Evidence` | Request evidence action remains available | Target state: `NEEDS_EVIDENCE` | Audit expected: compliance.request_evidence | Release button is disabled before evidence completeness. |
| 4 | `/compliance/demo/review` | Failed policy check | Click `Block` | Block path is available | Target state: blocked recommendation | Audit expected: compliance.block | Advice content not client-visible. |
| 5 | `/compliance/demo/block?state=block` | Block reason: required evidence incomplete | Click `Request Evidence` | Block page shows requested evidence checklist and owner | Request sent to assigned owner; release remains blocked | Evidence request audit expected | `Status: Blocked` and requested evidence list visible. |
| 6 | `/compliance/demo/release?state=release` | Approved release data, review `CR-2025-0407-0012` | Click `Release to client` in modal after checklist review | Release confirmation modal/state visible | Target state: client-visible release | Audit expected: compliance.release; evidence linked | Release page shows `Release ready` and confirmation controls. |
| 7 | `/compliance/demo/audit` | Audit filters | Click `Export Controlled` or inspect audit table | Audit/exception log visible | Compliance lineage reconstructable | Audit export controlled | Audit route remains internal-only. |
| 8 | `/decisions` | Role `Principal` as negative/positive follow-up | Switch to client role after block and after release scenario | Only released decisions should be shown | Blocked review never appears as client decision | Visibility gate proof | QA must compare block vs release path. |

---

## Journey 3: Client Decision And Evidence Package

- Ziel/Nutzen: Let the client accept/defer/reject only released decision material and receive evidence proof.
- Primaerer Actor: Principal.
- Weitere beteiligte Rollen: Family Council, Trustee, Compliance Officer, Advisor.
- Tenant/Demo-Kontext: Tenant `Summit Ridge Capital` or `Morgan Family Office`; role `Principal`.
- Preconditions: Compliance release is complete for the decision package.
- Benoetigte Demo-Daten: `DEC-2025-000147`, decision options, approvals by Priya Nair/Daniel Park/Meera Shah, success `DEC-2025-000124`, evidence `EVD-2025-000124`.
- Start-Route: `/decisions`.
- Endzustand: Decision submitted and evidence package available.
- Relevante Screens/Routen: `/decisions`, `/decisions/demo?state=approval`, `/decisions/demo/success`, `/evidence/demo`.
- Relevante Komponenten/Modelle/Seeds: `components/decisions-governance-screen.tsx`, `lib/decisions-governance-demo-data.ts`, `lib/workflow-gate.ts`, `lib/evidence-service.ts`.
- Evidence-/Audit-Erwartung: Decision action creates immutable decision audit and evidence record.
- Compliance-/Approval-Regel: Decision page is client-visible only after compliance release.
- Client-Visibility-Regel: Client sees only released decisions; internal notes stay hidden.
- Risiken/Grenzfaelle: Missing permission, unreleased decision, trustee scope mismatch, or missing evidence should block action.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/decisions` | Role `Principal`, tenant `Summit Ridge Capital` | Set role/tenant; inspect list | `Approve Q2 Investment Rebalance` appears as awaiting action | Released decision list loaded | Audit expected: decision.list.view | Only released decisions appear. |
| 2 | `/decisions/demo?state=approval` | Decision `DEC-2025-000147`; option `Strategic Rebalance` | Click/select decision row, inspect option cards | Decision room shows situation, options, risks and approvals | Client can evaluate released decision | Evidence references visible | `Content is client-visible only after Compliance Release` banner present. |
| 3 | `/decisions/demo?state=approval` | Comment/note: `Approved for Q2 rebalance after review.` | Click `Accept Option 1` | Confirmation/decision action state visible | Target state: accepted | Audit expected: decision.accepted | Accept is available only in released decision room. |
| 4 | `/decisions/demo?state=approval` | Negative alternatives | Click/inspect `Request More Information`, `Defer`, `Reject` | Alternatives are visible | Target states: more info, deferred, rejected | Audit expected for each path | Decision provides non-coercive exit options. |
| 5 | `/decisions/demo/success` | Success record `DEC-2025-000124` | Open success route | Confirmation page shows submitted by, submitted on, next review | Decision immutable and review scheduled | Evidence package created | `Evidence Package Created` visible. |
| 6 | `/decisions/demo/success` | Evidence `EVD-2025-000124` | Click `View Evidence Record` | User moves to evidence proof surface | Evidence review journey begins | Evidence access audit expected | Link target `/evidence/demo` renders evidence detail. |
| 7 | `/evidence/demo` | Evidence record detail | Click `Download` only if allowed | Evidence detail and audit timeline visible | Access is audited | Audit expected: evidence.view/download | Restricted evidence remains role-scoped. |

---

## Journey 4: Document Upload And Verification

- Ziel/Nutzen: Capture client documents, show AI extraction as draft, and route to human review/evidence.
- Primaerer Actor: Family CFO.
- Weitere beteiligte Rollen: Principal, External Advisor, Analyst, Compliance if sensitive.
- Tenant/Demo-Kontext: Tenant `Morgan Family Office`; role `Family CFO`.
- Preconditions: Demo session active and documents routes implemented.
- Benoetigte Demo-Daten: Missing docs `W-9`, `Trust Agreement`, `Source of Funds`; upload files `Q1 2024 Financial Statements.pdf`, blocked file `PortfolioReport.exe`; extraction fields and verification evidence.
- Start-Route: `/documents`.
- Endzustand: Document is under human review with evidence placeholders.
- Relevante Screens/Routen: `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending`.
- Relevante Komponenten/Modelle/Seeds: `components/client-intake-screen.tsx`, `lib/client-intake-demo-data.ts`, `docs/v3/DATA_MODEL_V3.md`.
- Evidence-/Audit-Erwartung: Upload, extraction confirmation and verification submission should create document/evidence/audit records.
- Compliance-/Approval-Regel: AI extraction is not final evidence and sensitive documents may require compliance/specialist review.
- Client-Visibility-Regel: Client sees simplified upload/verification states, not internal analyst notes.
- Risiken/Grenzfaelle: Unsupported file types, low-confidence extraction, sensitive document scope and missing evidence.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/portal` | Role `Family CFO`, tenant `Morgan Family Office` | Click `Upload missing documents` or missing doc `Upload` | Missing docs visible on dashboard | User starts document intake | Audit expected: document.intent | Missing documents are client-visible but not advice. |
| 2 | `/documents` | Search/filter optional | Click `Upload Document` | Documents list shows sensitivity/status rows | Upload route selected | Audit expected for route open if sensitive | Restricted documents remain scoped. |
| 3 | `/documents/upload` | Document type `Financial Statement`; file `Q1 2024 Financial Statements.pdf`; note `Q1 upload for review` | Click `Choose Files`, then `Upload Document` | Upload status shows `Uploading`, 62 percent | Target state: uploaded/extraction pending | Audit expected: document.upload | Allowed file state is visible. |
| 4 | `/documents/upload` | File `PortfolioReport.exe` | Inspect blocked upload row | `File type not allowed` error shown | Upload is blocked | Audit expected: document.upload_blocked | Unsupported file cannot continue. |
| 5 | `/documents/extraction-review` | Extracted fields: Statement Date, Account Number, Net Investment Change | Edit/verify low-confidence field if interactive; click `Confirm & Finalize` | Extraction review labels AI draft and low-confidence data | Target state: client_confirmed -> analyst_review_pending | Evidence placeholder expected | Page states extraction is draft and not final evidence. |
| 6 | `/documents/verification-pending` | Submitted May 21, 2025; expected review 2-3 days | Open route; click `Download Summary` if needed | Under Human Review state visible | Analyst review task created | Audit/evidence expected: review.pending | No final validation is implied. |
| 7 | `/documents/verification-pending` | Clarification state | Click `View Details` under Needs Clarification | Clarification state visible | More info path remains available | Audit expected if request opened | Human review can request additional evidence. |

---

## Journey 5: Entity, Wealth Map And Action Board

- Ziel/Nutzen: Build structure context and prove restricted/blocked wealth/action states.
- Primaerer Actor: Principal or Family CFO.
- Weitere beteiligte Rollen: Analyst, Advisor, Compliance if sensitive jurisdiction.
- Tenant/Demo-Kontext: Tenant `Bennett Family Office`; role `Principal` or `Family CFO`.
- Preconditions: Client profile exists; route group is available.
- Benoetigte Demo-Daten: Entity rows, `Carter Family Trust`, `Bennett Family Trust`, selected action `ACT-2025-0417`, missing evidence `Client Approval`.
- Start-Route: `/entities`.
- Endzustand: Wealth map has selected node/drawer and action remains blocked until missing evidence is supplied.
- Relevante Screens/Routen: `/entities`, `/entities/new`, `/entities/demo`, `/wealth-map?state=drawer`, `/actions?state=drawer`.
- Relevante Komponenten/Modelle/Seeds: `components/client-intake-screen.tsx`, `components/wealth-actions-screen.tsx`, `lib/client-intake-demo-data.ts`, `lib/wealth-actions-demo-data.ts`.
- Evidence-/Audit-Erwartung: Entity creation/edit, restricted node access and action readiness should create audit/evidence entries.
- Compliance-/Approval-Regel: Sensitive jurisdictions or restricted nodes may require legal/compliance review.
- Client-Visibility-Regel: Restricted nodes are masked/scoped; blocked actions cannot become client-ready.
- Risiken/Grenzfaelle: Restricted nodes, conflicts, gaps and missing evidence.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/entities` | Role `Principal`, tenant `Bennett Family Office` | Click `Create Entity` | Entity list and metrics visible | Entity creation begins | Audit expected: entity.create_intent | High-risk/missing-doc rows visible. |
| 2 | `/entities/new` | Entity type `Holding Company`; name `AlphaVest Holdings Ltd.`; jurisdiction `Cayman Islands`; address `89 Nexus Way, Camana Bay, Grand Cayman` | Click `Continue` | Wizard shows sensitive jurisdiction review requirement | Target state: entity draft created, legal review required | Evidence placeholder expected | `Review requirement` state visible. |
| 3 | `/entities/demo` | Entity `Carter Family Trust` | Click `Edit Entity` or inspect participants/docs | Entity detail shows participants and missing signature | Object-level detail visible | Audit expected: entity.view/edit | Sensitive data stays scoped. |
| 4 | `/wealth-map?state=drawer` | Selected node `Bennett Family Trust` | Click node or inspect drawer | Drawer shows trust details, relationships, documents | Structure graph selected node | Audit expected: wealth_map.node_view | Restricted nodes display lock/dashed styling. |
| 5 | `/wealth-map?state=drawer` | Alert `Conflict detected`; action `View details` | Click `View details` | Conflict alert stays visible | Conflict path escalates internally | Audit expected: conflict.view | Client sees status/gap, not advice. |
| 6 | `/actions?state=drawer` | Action `ACT-2025-0417`, missing `Client Approval` evidence | Click action card; inspect drawer | Drawer shows selected action, evidence list and timeline | Action cannot be ready | Evidence/audit timeline visible | `Blocked by missing evidence` visible. |
| 7 | `/actions?state=drawer` | Negative action | Click `Mark Ready` | Expected later: blocked unless evidence complete | Gate should prevent ready state | Audit expected: action.ready_blocked | QA should assert missing evidence prevents ready-for-client. |
| 8 | `/actions?state=drawer` | Follow-up | Click `Request Info` | Request-info option available | More data requested | Audit expected: action.request_info | Non-release remediation path exists. |

---

## Journey 6: Tenant Onboarding And Principal Invitation

- Ziel/Nutzen: Create/prepare a client tenant, assign team and policies, and invite users with scoped roles.
- Primaerer Actor: Admin / Client Success.
- Weitere beteiligte Rollen: Compliance Officer, Security Officer, Principal.
- Tenant/Demo-Kontext: Platform context; target tenant `Morgan Family Office`.
- Preconditions: Platform policy baseline exists; demo session active.
- Benoetigte Demo-Daten: Required tenants, `tenantSetupChecklist`, `teamAssignments`, `tenantPolicyCards`, `tenantUsers`.
- Start-Route: `/admin/tenants`.
- Endzustand: Tenant remains onboarding until checklist gates pass and invite/role setup is complete.
- Relevante Screens/Routen: `/admin/tenants`, `/tenants/new`, `/tenants/demo/setup`, `/tenants/demo/team`, `/tenants/demo/policies`, `/tenants/demo/users?state=invite`.
- Relevante Komponenten/Modelle/Seeds: `components/admin-tenant-setup-screen.tsx`, `lib/admin-tenant-setup-demo-data.ts`, `lib/demo-session.ts`, `lib/permission-engine.ts`.
- Evidence-/Audit-Erwartung: Tenant create, team assign, policy override and user invite actions require audit; sensitive roles need second confirmation.
- Compliance-/Approval-Regel: Compliance owner and policy profile are required before tenant active state.
- Client-Visibility-Regel: No client workspace exposure before invitation, consent and role confirmation.
- Risiken/Grenzfaelle: Missing compliance owner, blocked integrations, policy overrides, sensitive role invite.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/admin/tenants` | Role `Admin`; search `Morgan` | Use topbar role `Admin`; inspect tenant list | Tenant list shows statuses and onboarding progress | Tenant selected for onboarding | Audit expected: tenant.view | Tenant isolation is visible. |
| 2 | `/tenants/new` | Family office name `Morgan Family Office`; jurisdiction `United Kingdom`; tier `Enterprise`; primary owner `Alex Morgan` | Fill/select fields where interactive; click `Continue` or wizard primary action | Tenant creation wizard advances | Target state: tenant draft/onboarding | Audit expected: tenant.create | Tenant is not active from create alone. |
| 3 | `/tenants/demo/setup` | Setup checklist | Inspect incomplete/blocked items | Missing policy and blocked integration visible | Activation remains blocked | Audit expected for readiness review | Ready gate requires all checklist items. |
| 4 | `/tenants/demo/team` | Assign advisor, analyst, compliance owner, client success | Click/select `Assign compliance owner` row if interactive | Missing compliance owner visible | Team assignment incomplete until compliance owner exists | Audit expected: tenant.team_assign | Pilot cannot lack compliance owner. |
| 5 | `/tenants/demo/policies` | Evidence settings, export settings, privacy settings | Inspect active policy cards; click policy override if present | Tenant policy profile visible | Compliance approval required for overrides | Audit expected: policy.override | Policy version and evidence settings visible. |
| 6 | `/tenants/demo/users?state=invite` | Invite `alex.morgan@example.test`; role `Principal`; scope `Morgan Family Office` | Click `Invite User` or modal state; click `Send Invitation` | Invite modal/state visible; user invited/pending | Target state: user invited | Audit expected: user.invite | Sensitive role changes require scoped role and audit. |
| 7 | `/onboarding/invite` | Invitation follow-up | Open invite route | Invite acceptance UI visible | User onboarding can begin | Consent/audit later | No sensitive tenant data before onboarding. |

---

## Journey 7: Governance Access Change And Audit

- Ziel/Nutzen: Manage users/roles/access requests safely with confirmation and audit trail.
- Primaerer Actor: Principal or Admin.
- Weitere beteiligte Rollen: Compliance Officer, Security Officer, Requester.
- Tenant/Demo-Kontext: Tenant `Bennett Family Office`; role `Principal` or `Admin`.
- Preconditions: User/role/access demo data available.
- Benoetigte Demo-Daten: Governance users, `PORTFOLIO MANAGER` confirmation phrase, access request `Export account holdings`, audit event `AUD-2184`.
- Start-Route: `/governance/users`.
- Endzustand: Access change is approved/denied/escalated and audit history is inspectable.
- Relevante Screens/Routen: `/governance/users?state=drawer`, `/governance/roles?state=confirm`, `/governance/access-requests?state=approval`, `/governance/audit-history?state=drawer`.
- Relevante Komponenten/Modelle/Seeds: `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `lib/decisions-governance-demo-data.ts`, `lib/communication-export-ops-demo-data.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts`.
- Evidence-/Audit-Erwartung: Invite, role edit, access approve/deny/escalate and audit view should be audited.
- Compliance-/Approval-Regel: Sensitive permissions require second confirmation and separation-of-duties review.
- Client-Visibility-Regel: Access only changes what permitted users can see; internal audit remains scoped.
- Risiken/Grenzfaelle: SOD conflict, external advisor broad access, restricted documents, cross-tenant admin action.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/governance/users?state=drawer` | Role `Admin`, tenant `Bennett Family Office` | Click `Invite User` | Invite drawer/modal visible | User invite workflow starts | Audit expected: governance.invite | Pending/blocked/revoked users visible. |
| 2 | `/governance/users?state=drawer` | User email `emily.roberts@example.test`; role `Analyst`; MFA pending | Click `Send Invitation` | Invitation action is available | Target state: user invited | Audit expected: user.invite | Invitation is scoped, not broad access. |
| 3 | `/governance/roles?state=confirm` | Role `Portfolio Manager`; confirmation phrase `PORTFOLIO MANAGER` | Click `Create Role` or `Save Changes`; type phrase in confirmation field | Sensitive permission confirmation modal visible | Target state: role change pending confirmation | Audit expected: role.change_requested | `Confirm Sensitive Permission Changes` visible. |
| 4 | `/governance/access-requests?state=approval` | Request `Export account holdings`; requester `James Patel`; scope `Horizon Partners` | Click request row; inspect policy checks | Approval drawer shows RBAC/SOD checks | Access request review starts | Audit expected: access.review | SOD conflict shows review required. |
| 5 | `/governance/access-requests?state=approval` | Decision path | Click `Approve`, `Deny` or `Escalate` | Decision controls visible | Target state: approved/denied/escalated | Audit expected per decision | Policy checks are shown before decision. |
| 6 | `/governance/audit-history?state=drawer` | Audit `AUD-2184`, `AUD-2183` | Open audit history; click event drawer | Audit lineage visible | Immutable audit proof available | Audit view event expected | Lineage includes request, policy, approval, grant. |
| 7 | `/governance/audit-history?state=drawer` | Export controlled | Click `Export events` if present | Export/audit error state may show if unavailable | Export remains controlled | Audit expected if exported | Audit export cannot bypass export controls. |

---

## Journey 8: Export With Scope, Redaction, Approval And Download

- Ziel/Nutzen: Create a controlled export package with tenant scope, object selection, redaction, approval and audited download/share.
- Primaerer Actor: Principal or Privacy/Compliance scoped requester.
- Weitere beteiligte Rollen: Compliance Officer, Advisor, Security/Privacy Officer.
- Tenant/Demo-Kontext: Tenant `Bennett Family Office`; role `Principal` or `Compliance Officer`.
- Preconditions: Evidence/decision data exists and export permission is available or blocked state is visible.
- Benoetigte Demo-Daten: Export type `Data Extract`, scope items `Northbridge Family Office`, `Bennett Family Trust`, restricted `Offshore Trust`, preview policy checks, export `EXP-2025-05-21-0087`.
- Start-Route: `/export/new`.
- Endzustand: Export package downloaded or external share created with audit/expiry.
- Relevante Screens/Routen: `/export/new`, `/export/demo/scope`, `/export/demo/redaction`, `/export/demo/preview?state=approval`, `/export/demo/download?state=confirm`.
- Relevante Komponenten/Modelle/Seeds: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, `lib/export-service.ts`, `docs/v3/DATA_MODEL_V3.md`.
- Evidence-/Audit-Erwartung: Export request, scope selection, redaction approval, download/share and expiry all audited.
- Compliance-/Approval-Regel: Export requires actor permission, tenant scope, object scope, redaction profile, approval if required, audit event and expiry for external sharing.
- Client-Visibility-Regel: Export may include only role-safe, redacted, approved data.
- Risiken/Grenzfaelle: Restricted object selection, missing redaction, blocked policy check, external share without approval.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/export/new` | Role `Principal`, tenant `Bennett Family Office`; export type `Data Extract` | Select `Data Extract` | Export setup and permission block/summary visible | Export draft starts only if permitted | Audit expected: export.create | `Export permission required` state is testable. |
| 2 | `/export/demo/scope` | Select allowed items `SC-01` to `SC-05`, keep `Offshore Trust` not permitted | Click/inspect scope items; click `Clear all` as negative if needed | Allowed/restricted/not permitted scope states visible | Target state: scope_selected | Audit expected: export.scope | Not permitted item cannot be included. |
| 3 | `/export/demo/redaction` | Redaction profile `client-visible`; redaction summary financial/account/advisor/contact fields | Inspect redaction preview | Sensitive fields are shown as redacted categories | Target state: redaction_pending/approved | Audit expected: export.redaction_review | Redaction is mandatory. |
| 4 | `/export/demo/preview?state=approval` | Policy checks: blocked retention, PII pass, jurisdiction pass, warning encryption | Click approval modal trigger if available | Approval/export confirmation modal visible | Export cannot proceed if blocked policy remains | Audit expected: export.preview | `Data retention policy` blocked state visible. |
| 5 | `/export/demo/preview?state=approval` | Approval path | Click `Confirm Approval and Export` | Package approval flow visible | Target state: generated if gates pass | Audit expected: export.approved/generated | Approval is explicit, not implicit. |
| 6 | `/export/demo/download?state=confirm` | Export `EXP-2025-05-21-0087`; requester `Alex Bennett` | Click `Download` | Download package and timeline visible | Target state: downloaded | Audit expected: export.download | Timeline includes watermark and download recorded. |
| 7 | `/export/demo/download?state=confirm` | External share | Click share/create link if exposed; close modal with `Done` | Secure share link confirmation visible | Expiry scheduled | Audit expected: export.share_created | External sharing has expiry and approved link holders. |

---

## Journey 9: Client Profile And Family Intake

- Ziel/Nutzen: Capture client profile, family members and relationship context without exposing internal notes or advice.
- Primaerer Actor: Principal / Family CFO.
- Weitere beteiligte Rollen: Analyst, Advisor.
- Tenant/Demo-Kontext: Tenant `Morgan Family Office`; role `Principal` or `Family CFO`.
- Preconditions: User has completed onboarding/consent and has tenant-scoped access.
- Benoetigte Demo-Daten: `clientWorkspace`, profile fields, governance preferences, family members, relationship rows/nodes.
- Start-Route: `/portal`.
- Endzustand: Profile submitted for review and relationship conflicts/missing evidence are visible.
- Relevante Screens/Routen: `/portal`, `/client/profile`, `/client/family-members`, `/relationships`.
- Relevante Komponenten/Modelle/Seeds: `components/client-intake-screen.tsx`, `lib/client-intake-demo-data.ts`, `lib/demo-session.ts`.
- Evidence-/Audit-Erwartung: Profile submission and relationship edits should create audit events and review tasks.
- Compliance-/Approval-Regel: Sensitive fields are scoped; conflicts trigger advisor/legal review.
- Client-Visibility-Regel: Client sees own data and safe next steps; internal review notes are not visible.
- Risiken/Grenzfaelle: Family conflicts, missing evidence, blocked governance preference.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/portal` | Role `Principal`, tenant `Morgan Family Office` | Use topbar tenant/role selectors | Dashboard shows readiness, open actions, pending decisions and missing docs | Client workspace loaded | Audit expected: portal.view | No internal notes or unreleased advice. |
| 2 | `/portal` | Missing docs `W-9`, `Trust Agreement`, `Source of Funds` | Click `Review open actions` or missing doc `Upload` | Navigation/action affordances visible | Client starts action intake | Audit expected: next_step.open | Safe next steps, not recommendations. |
| 3 | `/client/profile` | Fields: Family Name `Morgan`, Principal `Alex Morgan`, engagement model `Family Office Advisory` | Click `Save Draft`, then `Submit for Review` | Profile form and review summary visible | Target state: profile submitted/needs_review | Audit expected: profile.submit | Sensitive edits are scoped. |
| 4 | `/client/family-members` | Add member details if interactive | Click `Add Member`; inspect member drawer/table | Family members and conflict status visible | Target state: family member captured | Audit expected: family_member.create | Conflict rows are visible. |
| 5 | `/client/family-members` | Edit existing member | Click `Manage`, `Edit`, then `Save Changes` if exposed | Edit controls visible | Target state: relationship/profile update | Audit expected: family_member.edit | Changes do not bypass review. |
| 6 | `/relationships` | Relationship `Sophia Chen` beneficiary with missing evidence | Click `Family Map`, `Fit View` or relationship row | Relationship graph/table visible | Missing evidence path identified | Evidence request expected | `Missing Evidence` row visible. |
| 7 | `/relationships` | Conflict state | Click `Add` or inspect conflict edge | Conflict stays visible | Advisor/legal review expected | Audit expected: relationship.conflict | Client can see data quality issue without advice. |

---

## Journey 10: Platform Policy And No-Advice Baseline

- Ziel/Nutzen: Establish platform policies, evidence templates, export templates and confirmation controls that support all later journeys.
- Primaerer Actor: Platform Admin.
- Weitere beteiligte Rollen: Compliance Officer, Security Officer, Privacy/Ops.
- Tenant/Demo-Kontext: Platform context; no client tenant data required.
- Preconditions: Admin demo role active.
- Benoetigte Demo-Daten: Platform settings, advice matrix, role templates, security controls, evidence templates, export templates/redaction profiles.
- Start-Route: `/admin/platform`.
- Endzustand: Policies/evidence/export templates visible and sensitive changes require confirmation/audit.
- Relevante Screens/Routen: `/admin/platform?state=confirm`, `/admin/policies/advice-boundary`, `/admin/roles?state=permission`, `/admin/security?state=confirm`, `/admin/evidence-templates`, `/admin/export-templates`.
- Relevante Komponenten/Modelle/Seeds: `components/admin-tenant-setup-screen.tsx`, `lib/admin-tenant-setup-demo-data.ts`, `lib/permission-engine.ts`, `lib/audit-service.ts`.
- Evidence-/Audit-Erwartung: Platform settings, policy changes, role permission changes and security changes require audit; manage/release actions require second confirmation.
- Compliance-/Approval-Regel: Advice boundary and evidence requirements are versioned and compliance-owned.
- Client-Visibility-Regel: Policies define what can ever become client-visible; no client advice is released from setup pages.
- Risiken/Grenzfaelle: Policy drift, overly broad roles, export templates without redaction, security changes without confirmation.

### Schrittprotokoll

| Step | Route/Screen | Eingabedaten | Klick/Aktion | Erwartetes UI-Ergebnis | System-/Workflow-Effekt | Evidence/Audit | QA-Assertion |
|---:|---|---|---|---|---|---|---|
| 1 | `/admin/platform?state=confirm` | Role `Admin`; settings `AlphaVest WealthOS`, retention `7 years`, session timeout `30 minutes` | Click `Save changes` | Second confirmation state available | Target state: platform settings pending/confirmed | Audit expected: platform.manage | Critical settings require confirmation. |
| 2 | `/admin/policies/advice-boundary` | Policy `POL-ADV-008`; classification matrix | Inspect advice matrix; click `View audit log` | Advice classifications and release rules visible | Policy establishes no-advice gate | Audit expected: policy.view/change | Advice categories require approval where marked. |
| 3 | `/admin/roles?state=permission` | Role `Compliance officer`; permission matrix | Click `Review permission changes` | Permission modal/state visible | Target state: role permission change pending | Audit + second confirmation expected | Broad permissions cannot silently change. |
| 4 | `/admin/security?state=confirm` | MFA enforcement, trusted device controls, session policy | Click `Save changes` | Security controls and active sessions visible | Security config update guarded | Audit expected: security.manage | MFA/session controls visible. |
| 5 | `/admin/evidence-templates` | Template `Client Onboarding - KYC`, review cycle 12 months | Inspect template table | Evidence templates visible | Evidence requirements reusable | Audit expected if edited | Evidence-by-default policy has visible templates. |
| 6 | `/admin/export-templates` | Redaction profile `Client Sensitive v2 - Active`; blocked `Advisor data share` | Inspect export templates and profiles | Export/redaction controls visible | Export defaults defined | Audit expected if edited | Blocked export template remains blocked. |
| 7 | `/portal` | Negative check as Principal | Switch to client role; open portal | Client sees no platform policy internals | Separation of platform and client views | Access audit expected | Admin setup cannot leak internal policies. |

---

## Non-Selected But Plausible Journey Candidates

| Candidate | Why not in Top 10 | Follow-up |
| --- | --- | --- |
| Communication escalation as standalone | Important but less central than compliance, decision, evidence/export and governance for the first 10. | Convert to dedicated Playwright flow after message persistence exists. |
| Ops queues and SLA | Strong internal management story, but it does not prove client visibility or evidence gates directly. | Keep as QA/program management dashboard. |
| Service blueprint | Reference/internal page, not product user journey. | Use as explanation artifact, not client route. |
| Roadmap | Reference/internal planning route. | Keep as internal scope control. |
| States catalogue | Reference/internal route. | Use for design-system QA. |
| Standalone login after onboarding | Covered inside onboarding enough for current demo. | Add production-auth journey only after real auth starts. |

## Coverage Matrix

| Journey | Roles | Screens/routes | Demo data | Compliance gates | Evidence/audit | Client visibility | Advisor/Compliance/Client interaction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Signal -> Advisor | Analyst, Advisor, Compliance later | 033-037 | Signals, triggers, approval package | Advisor is not release | Review and approval audit expected | Internal only | Analyst routes; advisor approves; compliance still needed |
| 2 Compliance Release/Block | Compliance, Advisor | 038-042 | Compliance queue, checklists, block review | Release/block authority | Release/block/evidence request audit | Controls client visibility | Compliance decides release or block |
| 3 Client Decision/Evidence | Principal, Family Council, Trustee | 043-047 | Decisions, options, evidence record | Must be released first | Decision/evidence audit | Client sees released decisions only | Client acts on approved package |
| 4 Document Intake | CFO, Client, Analyst | 027-030 | Upload files, extraction fields | Sensitive docs may need review | Upload/extraction/review audit | Client sees safe state only | Client submits; analyst reviews |
| 5 Entity/Wealth/Actions | Principal, CFO, Analyst, Advisor | 024-026, 031-032 | Entity rows, wealth nodes, action cards | Sensitive jurisdictions/gaps | Entity/action audit/evidence | Restricted nodes masked | Client/advisor share structure context |
| 6 Tenant Onboarding | Admin, Client Success, Compliance, Principal | 013-018, 003 | Tenants, team, policies, users | Compliance owner/policies required | Tenant/team/user invite audit | Client workspace locked until onboarding | Admin invites principal |
| 7 Governance Access | Principal, Admin, Compliance, Security | 048-051 | Users, roles, access requests, audit | SOD/second confirmation | Access audit history | Access scoped by role | Principal/admin/compliance approve access |
| 8 Export | Principal, Compliance, Privacy, Advisor | 054-058 | Scope, redaction, preview, timeline | Approval/redaction required | Export/download/share audit | Redacted role-safe output | Client/compliance validates package |
| 9 Client Profile | Principal, CFO, Analyst | 019, 021-023 | Profile, family, relationships | Conflicts may trigger review | Profile/relationship audit | Own data only | Client provides context; analyst reviews |
| 10 Platform Policy | Admin, Compliance, Security | 007-012 | Policies, roles, evidence/export templates | Policy baseline | Config/policy/security audit | No direct client visibility | Internal policy authorities configure gates |

## Adversarial QA

| Risk question | Finding | Mitigation |
| --- | --- | --- |
| Which journey could feel invented? | Any step that says a button persists a state could be overstated because current demo actions are often static. | Tables label those as target workflow effects; current UI expectations focus on visible state. |
| Where are data gaps? | There is no live persisted click-path evidence for Phase 14 lifecycle transitions yet. | Use this playbook as QA spec for later Playwright/stateful tests. |
| Where is UI only reference? | `/service-blueprint`, `/roadmap`, `/states` are reference/internal routes. | They are not selected as Top 10 journeys. |
| Where is spec chrome risk? | Visual references and route metadata can tempt implementation of labels/boards. | Clean UI rule and `visual:contract` forbid chrome terms. |
| Which route is most likely to violate product rule? | Advisor approval and decision room if compliance release is skipped. | Journey 1 and 2 explicitly test blocked state before release. |
| Which actor risk is highest? | Client-side role viewing internal notes or restricted evidence. | Verify role/tenant switches and visibility banners on decisions/evidence/export. |
| Which data risk is highest? | Export package including not-permitted objects or unredacted fields. | Journey 8 includes restricted `Offshore Trust`, redaction and approval checks. |

## Proof Paths

| Journey | File proof | Route/screenshot proof | Test/browser proof needed |
| --- | --- | --- | --- |
| 1 Signal -> Advisor | `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`, `docs/v3/WORKFLOW_DEFINITIONS_V3.md`, `lib/internal-workflow-demo-data.ts`, `components/internal-workflow-screen.tsx` | `PAGE-033` to `PAGE-037`, `/signals`, `/advisor-approval/demo` | Start dev server; run `pnpm smoke:phase11`; manually assert disabled `Publish to Client`. |
| 2 Compliance | `docs/v3/DATA_MODEL_V3.md`, `lib/workflow-gate.ts`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx` | `PAGE-038` to `PAGE-042`, `/compliance/demo/release?state=release`, `/compliance/demo/block?state=block` | Run `pnpm smoke:phase11` and `pnpm smoke:phase12`; browser-check release/block states. |
| 3 Decision/Evidence | `lib/decisions-governance-demo-data.ts`, `components/decisions-governance-screen.tsx`, `lib/evidence-service.ts` | `PAGE-043` to `PAGE-047`, `/decisions/demo`, `/evidence/demo` | Run `pnpm smoke:phase12`; verify client decision alternatives and evidence success. |
| 4 Documents | `lib/client-intake-demo-data.ts`, `components/client-intake-screen.tsx`, `docs/v3/DATA_MODEL_V3.md` | `PAGE-027` to `PAGE-030`, `/documents/upload`, `/documents/extraction-review` | Run `pnpm smoke:phase09`; verify upload and blocked file states. |
| 5 Entity/Wealth/Actions | `lib/client-intake-demo-data.ts`, `lib/wealth-actions-demo-data.ts`, `components/wealth-actions-screen.tsx` | `PAGE-024` to `PAGE-032`, `/wealth-map?state=drawer`, `/actions?state=drawer` | Run `pnpm smoke:phase09` and `pnpm smoke:phase10`; verify restricted nodes and blocked action. |
| 6 Tenant | `lib/admin-tenant-setup-demo-data.ts`, `components/admin-tenant-setup-screen.tsx`, `docs/v3/PAGE_SPECS_V3.md` | `PAGE-013` to `PAGE-018`, `/tenants/demo/users?state=invite` | Run `pnpm smoke:phase08`; verify missing compliance owner and invite modal. |
| 7 Governance | `lib/decisions-governance-demo-data.ts`, `lib/communication-export-ops-demo-data.ts`, `components/decisions-governance-screen.tsx` | `PAGE-048` to `PAGE-051`, `/governance/roles?state=confirm` | Run `pnpm smoke:phase12` and `pnpm smoke:phase13`; verify confirmation phrase and audit lineage. |
| 8 Export | `lib/communication-export-ops-demo-data.ts`, `lib/export-service.ts`, `components/communication-export-ops-screen.tsx` | `PAGE-054` to `PAGE-058`, `/export/demo/preview?state=approval` | Run `pnpm smoke:phase13`; verify restricted scope and download audit timeline. |
| 9 Client Profile | `lib/client-intake-demo-data.ts`, `components/client-intake-screen.tsx`, `lib/demo-session.ts` | `PAGE-019`, `PAGE-021` to `PAGE-023`, `/portal`, `/relationships` | Run `pnpm smoke:phase09`; verify role/tenant switcher and conflict/missing evidence. |
| 10 Platform Policy | `lib/admin-tenant-setup-demo-data.ts`, `components/admin-tenant-setup-screen.tsx`, `lib/permission-engine.ts`, `lib/audit-service.ts` | `PAGE-007` to `PAGE-012`, `/admin/roles?state=permission` | Run `pnpm smoke:phase08`; verify second confirmation and advice matrix. |

Recommended broad checks:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm visual:contract`
- With local server: `VISUAL_QA_BASE_URL=http://127.0.0.1:3000 pnpm visual:contract`
- Phase smokes as applicable: `pnpm smoke:phase08` through `pnpm smoke:phase13`

## Measurement Plan

| Experiment | Hypothesis | Metric | Baseline | Timebox | Stop rule | Success signal |
| --- | --- | --- | --- | --- | --- | --- |
| Manual demo dry run | The Top 10 can be narrated without missing a route. | Percent journeys completed with no route 404. | Existing smoke reports say routes pass. | 1 hour | Any route fails or title missing. | 10/10 journeys navigable. |
| Gate-first QA | Testing blocked states first catches release regressions. | Number of missing-gate failures caught. | Current `workflowGate` has explicit missing gates. | 0.5 day | If blocked states are not visible. | Advisor-only path stays client-blocked. |
| Export safety check | Scope/redaction/approval steps prevent unsafe export. | Restricted objects excluded; redaction visible; audit timeline visible. | Current export demo data includes all three. | 0.5 day | If not-permitted object can appear selected as allowed. | Export path is defensible. |
| Playwright conversion | This playbook can become E2E flows. | Journey steps converted to selectors/tests. | No dedicated Playwright suite yet. | 1-2 days after Phase 14 state wiring | If current static buttons cannot assert effects. | At least 5 core flows automated. |

## Ethics And Fairness Check

| Check | Result | Note |
| --- | --- | --- |
| No deception | Pass | Static/current demo effects are labelled as target behavior where needed. |
| No fabricated facts | Pass | Routes, data names and controls come from repo files. |
| No coercion | Pass | Decision journey includes accept, defer, reject and request-more-info paths. |
| No dark patterns | Pass | Gates are transparent and explain missing requirements. |
| Real exit options | Pass | Client decision and advisor review provide alternatives. |
| Public reveal test | Pass with caveat | The playbook can be shared if it is clear that persistence is not fully implemented yet. |
| Stakeholder harm scan | Pass | Restricted data, exports and client visibility are guarded. |

## Learning Log

### Sicher belegt

- 63 routes and 63 visual assets are registered.
- The app has topbar role/tenant selectors in client, wealth/actions and other grouped screens.
- No-unapproved-advice is implemented as central gate logic in `lib/workflow-gate.ts`.
- Current route registry marks client-visibility-sensitive pages.
- Current demo data contains blocked, pending, approved, released, restricted, needs-evidence and export states.
- Current scripts support route smoke checks and visual chrome contract checks.

### Bleibt Annahme

- Current UI button clicks persist workflow state changes; many are currently visual/static.
- Exact database writes for evidence/audit per click; current services preview drafts/gates.
- Full Playwright selector stability; current test scripts are fetch/title-based rather than browser-click based.

### Naechster Browser-/Codex-Lauf sollte live pruefen

- Start app and run all Top-10 routes in browser.
- Confirm role/tenant switcher behavior across selected journeys.
- Confirm `?state=` variants show intended modals/drawers/release/block states.
- Confirm no spec chrome appears in visible DOM.
- Convert 3 most critical journeys to Playwright: Signal->Advisor blocked, Compliance release/block, Client decision->evidence.

## Abschluss

### Changed files

- `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`

### Source-of-truth files read

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/USERFLOW_DEFINITIONS_V3.md`
- `docs/v3/WORKFLOW_DEFINITIONS_V3.md`
- `docs/v3/PAGE_SPECS_V3.md`
- `docs/v3/DUMMY_DATA_AND_SEED_STRATEGY_V3.md`
- Current route, service, demo data, component and smoke/visual-contract files listed in the Evidence Intake.

### Tests/checks run for this docs-only update

- `pnpm typecheck` - passed.
- `pnpm lint` - passed.
- `pnpm visual:contract` - passed offline with 63 assets, 63 route mappings, zero failures and zero fetched routes.

### Recommended follow-up checks

- Live checks: `pnpm smoke:phase08` through `pnpm smoke:phase13` with the dev server running.
- Live visual checks: `VISUAL_QA_BASE_URL=http://127.0.0.1:3000 pnpm visual:contract`.

### Open risks/TODOs

- Convert expected workflow effects into persisted Phase 14 state transitions.
- Add browser-click Playwright coverage for the three highest-risk flows.
- Decide whether standalone communication escalation becomes Top-10 in a later demo package.
- Add selector strategy for exact button tests instead of title-only smoke checks.

## Method Compliance Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| ENGINE_MIX_V2_CODEX_V3_PROOF used | Done | This document follows mixed V2/V3 sequence. |
| V3 Mission Card | Done | Section `V3 Mission Card`. |
| V3 Evidence Intake | Done | Section `V3 Evidence Intake`. |
| V3 Problem Architecture | Done | Source discipline, facts/assumptions and longlist scoring. |
| V2 Double Diamond | Done | Discover/Define/Develop/Deliver section. |
| Psycho-Logic + Map/Model | Done | Method artifact table. |
| Reframing Matrix | Done | 2x2 matrix and best/wrong frames. |
| TRIZ | Done | Contradiction table. |
| SIT Closed World | Done | Closed-world inventory and five moves. |
| Morphological Analysis / Zwicky Box + CCA | Done | Dimensions, rejects and kept variants. |
| SCAMPER | Done | Seven labelled ideas. |
| Harvard / BATNA | Done | People/problem, interests, objective criteria and BATNA. |
| MESOs | Done | A/B/C equivalent offer table. |
| Measurement Plan | Done | Four experiment cards. |
| Ethics & Fairness | Done | Explicit check table. |
| V3 Debate / Adversarial QA | Done | Adversarial QA section with mitigations. |
| Proof Paths | Done | Per-journey proof-path table. |
| Learning Log | Done | Sicher belegt / assumption / next browser checks. |
| Exactly 10 selected journeys | Done | Prioritized Top-10 and 10 journey sections. |
| No invented client-visible advice | Done | All advice-like flows remain gated until release. |
| Clean UI rule respected | Done | Reference/internal routes not selected as end-user journeys. |
