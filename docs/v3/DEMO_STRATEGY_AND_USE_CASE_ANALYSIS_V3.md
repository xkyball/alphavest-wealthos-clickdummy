# AlphaVest WealthOS V3 Demo Strategy and Use-Case Analysis

Generated: 2026-06-16  
Engine mode: `ENGINE_MIX_V2_V3`  
Scope: analysis and demo planning only. No product UI, schema, seed, API or workflow code was changed by this artifact.

## Executive Verdict

The strongest AlphaVest demo is not "a wealth dashboard"; it is a governed visibility workflow: client and document context creates a signal, the signal moves through analyst and advisor review, compliance controls release, the client decides only on released content, and evidence/export/audit prove what happened.

## Facts / Assumptions / Interpretations

### Facts

- The repo mission is demo-data-first and explicitly defers real authentication in favor of demo session, role switcher and tenant switcher.
- The product rule is durable: no unapproved advice reaches the client; advisor approval alone is not enough; compliance release controls client visibility.
- The current catalogue has 63 planned routes and 63 visual references under `public/reference/page_ui_v3/clean_pages/`.
- `lib/route-registry.ts` maps routes to pageflows, user workflows, role families, object types and permission actions.
- `docs/v3/journeys.screencast.v3.json` contains 10 journeys and 73 steps with captions and required interactions.
- `scripts/screencast/lib/journey-fixtures.ts` provides deterministic fixture IDs, roles, tenant slugs, form inputs, click paths and expected mutations.
- The final handoff reports Phase 19 status: all 63 routes render; J02-J09 have stateful demo workflow API coverage; demo role-aware permission denials exist; file/export realism is metadata-only.
- `app/api/demo-workflow/route.ts` contains specific demo workflow actions for J01-J09 and a generic validated action fallback pattern for unhandled `jNN.action` IDs.
- `runDemoWorkflowMutation()` centralizes demo permission checks, audit writes and mutation callbacks for J02-J09 style actions.
- Some visible page groups still render static demo data rather than re-reading every updated Prisma workflow row.

### Assumptions

- The best live presentation will use the existing screencast runner or a manually driven local browser with seeded demo data.
- The final audience may include investors, internal product stakeholders, compliance/ops users and engineering reviewers.
- Existing journey captions are useful but need a higher-level metadata layer for speaker notes, risk caveats and audience-specific explanation.
- "Best demo" means persuasive and truthful, not maximal route coverage.

### Interpretations

- AlphaVest is strongest when shown as a trust machine: it narrows who can see what, when, and why.
- J02, J03, J04, J08 and J07 are the highest proof value after the initial J01 signal/advisor story because they demonstrate release, decision, evidence, files/export and governance.
- J10 is useful as a policy frame, but should not be the main proof of persisted workflow behavior.
- The safest demo language is "stateful demo transaction" or "demo-scoped mutation", not "production workflow" or "production compliance engine".

### Recommended Moves

- Lead with the no-unapproved-advice gate and show the client blocked before release.
- Use J02 as the central compliance proof and J03 as the client-value proof.
- Use J04 and J08 as evidence/file/export credibility enhancers.
- Use J07 governance as the security/audit proof.
- Keep J10 as a short opening or appendix: "these policies explain why the workflow behaves this way."
- Add a metadata layer for captions/notes rather than overloading product UI with explanatory text.

## Evidence Intake

| Evidence | Finding | Demo implication |
| --- | --- | --- |
| `AGENTS.md` | Demo-first, clean UI, no unapproved advice, evidence/audit by default. | Demo must be transparent and cannot overclaim client advice or compliance maturity. |
| `CODEX_MASTER_TASK.md` | No real auth first; role/tenant switchers are expected. | Role switching is a legitimate demo affordance. |
| `CODEX_TASKS_DETAILED_V3.md` | Phase 14+ owns workflow lifecycle; Phase 16-18 harden roles, validation and file/export realism. | Reifegrade must separate route/UI, demo transaction, role-aware demo and production. |
| `SCREEN_CATALOGUE_V3.md` | 63 screens across setup, client intake, workflow, evidence, governance, export and ops. | Use route coverage as navigation proof, not workflow proof. |
| `DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md` | Visuals are mandatory direction, not pixel contracts; no spec chrome in UI. | Captions/notes belong in metadata and screencasts, not app UI. |
| `PAGEFLOW_USERFLOW_MAPPING_V3.md` | PF-A through PF-J and UF-01 through UF-14 define the product flow graph. | Main story should connect PF-D/PF-E/PF-F/PF-I/PF-G. |
| `DATA_MODEL_V3.md` | Tenant, RBAC, workflow state, evidence, audit and export rules are explicit. | Demo data must carry `clientTenantId`, status, visibility, evidence and audit refs. |
| `QUALITY_GATES_AND_TEST_PLAN_V3.md` | Core Playwright flows include document upload, signal/advisor/compliance, decision/evidence, governance and export. | These become the demo-critical journeys. |
| `USER_JOURNEY_PLAYBOOK_V3.md` | Top-10 journeys already selected and source-bound. | Reuse, reorder and package them by audience. |
| `journeys.screencast.v3.json` | 10 journeys, 73 steps, burned-in captions in final proof reports. | Metadata can attach to existing step IDs. |
| `SCREENCAST_*` docs | Runner provisions fixture data, records cursor/captions and writes QA artifacts. | Demo can be live or video-backed with audit trails. |
| `journey-fixtures.ts` | Fixture IDs, tenants, roles, refs, form inputs and expected mutations exist. | This is the best data contract for demo preparation. |
| `demo-workflow` API/tests | J02-J09 stateful demo actions and permission tests exist. | Claim persisted demo actions for J02-J09, with caveats. |
| `FINAL_HANDOFF_REPORT.md` | Phase 19 status with intentional boundaries. | Final demo must repeat those boundaries plainly. |

## V3 Mission Card

| Field | Decision |
| --- | --- |
| Mission | Derive the best truthful AlphaVest demo path, data contract and caption/notes metadata. |
| Primary demo claim | AlphaVest controls client visibility through human review, compliance release, evidence and audit. |
| Source hierarchy | Repo instructions and v3 docs -> route registry -> journey JSON/fixtures -> API/tests/reports -> demo data modules. |
| Non-goals | No product code edits, no real auth, no production compliance claim, no real client data. |
| Quality bar | Every claim names a proof path or is marked as assumption/interpretation. |

## Problem Architecture

| Layer | Current strength | Demo risk | Demo handling |
| --- | --- | --- | --- |
| Product story | Strong differentiated rule: no unapproved advice reaches client. | Audience hears "wealth dashboard" and misses the point. | Start with gate/visibility thesis. |
| Routes/UI | 63 route catalogue, visual consistency and screencast proof. | Route coverage mistaken for workflow execution. | Use route coverage as navigation proof only. |
| Data model | Broad Prisma model covers tenant, RBAC, docs, recommendation, compliance, evidence, audit, export. | Seed data mistaken for mutation proof. | Separate seed fixture from action mutation. |
| Workflow API | J02-J09 stateful demo actions and tests exist; J01 has dedicated signal/advisor actions. | Demo-scoped transactions mistaken for production engine. | Say "demo transaction" and keep real-auth boundary explicit. |
| UI data binding | Some screens still render static demo data after mutations. | Live mutation result may not visually reload everywhere. | Use API/screencast proof plus visible state, not false dynamic-read claims. |
| Permissions | Demo role-aware denials exist for key cases. | Production security overclaimed. | Say deterministic demo policy, not production authorization. |
| Files/export | Metadata-only realism and manifest validation exist. | Audience assumes real binary export/download. | Say package metadata, no object storage/binary file yet. |

## Use-Case Map

| Use case | Primary role | Goal | Pageflows / userflows | Core routes | Data objects | Gate | Evidence / audit | Current maturity | Demo value |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Platform no-advice baseline | Platform Admin / Compliance | Define policies, roles, evidence and export controls. | PF-A / UF-01 / J10 | `/admin/platform`, `/admin/policies/advice-boundary`, `/admin/roles`, `/admin/security` | `PolicyDefinition`, `Role`, `Permission`, `AuditEvent` | Second confirmation, policy ownership | Audit expected / generic demo proof | E3-E4 | Sets context, not main proof. |
| Tenant onboarding | Admin / Client Success | Prepare a family office tenant and invite principal. | PF-B / UF-02 / J06 | `/admin/tenants`, `/tenants/new`, `/tenants/demo/*` | `ClientTenant`, `User`, `UserRole`, `PolicyDefinition`, `ConsentRecord`, `AuditEvent` | Tenant readiness checklist | J06 audit proof | E5 demo transaction | Shows enterprise setup realism. |
| Client profile and family intake | Principal | Capture client context without generating advice. | PF-C / UF-04 / J09 | `/portal`, `/client/profile`, `/client/family-members`, `/relationships` | `UserProfile`, `FamilyMember`, `Relationship`, `EvidenceItem`, `AuditEvent` | Review/data quality | J09 evidence/audit proof | E5 demo transaction, static UI caveat | Human, relatable entry point. |
| Entity, wealth map and action gate | Principal / Advisor | Map structure and block readiness if evidence is missing. | PF-C / UF-05 / J05 | `/entities`, `/entities/new`, `/wealth-map`, `/actions` | `Entity`, `EntityParticipant`, `ActionItem`, `EvidenceItem`, `AuditEvent` | Sensitive jurisdiction, evidence completeness | J05 evidence/audit proof | E5 demo transaction, static UI caveat | Shows high-value wealth complexity. |
| Document upload and verification | Family CFO / Analyst | Turn client document into reviewed evidence input. | PF-D / UF-06 / J04 | `/documents`, `/documents/upload`, `/documents/extraction-review` | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceItem` | Human verification, file metadata validation | J04 document/evidence/audit proof | E5 demo transaction, no binary file | Bridges client action to evidence. |
| Signal to advisor approval | Analyst / Advisor | Route internal signal to advisor review without client visibility. | PF-E / UF-07/08 / J01 | `/signals`, `/workbench`, `/advisor-approval` | `Trigger`, `ActionItem`, `Recommendation`, `Approval`, `AuditEvent` | Advisor approval does not release | J01 audit proof | Canonical typed boundary (legacy compatibility bridge) | Best opening proof of the product rule. |
| Compliance release/block | Compliance Officer | Release only when advisor, evidence, compliance and permission gates pass. | PF-F / UF-09 / J02 | `/compliance`, `/compliance/demo/review`, release/block/audit | `ComplianceReview`, `Recommendation`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `workflowGate.canBecomeClientVisible()` | J02 block/release evidence/audit proof | E5+ demo transaction | Highest trust and compliance value. |
| Client decision and evidence package | Principal / Family Council | Client accepts, defers or rejects only released content. | PF-F / UF-10 / J03 | `/decisions`, `/decisions/demo`, `/evidence/demo` | `Decision`, `DecisionParticipant`, `Recommendation`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | Released-content guard | J03 evidence/audit proof | E5 demo transaction | Converts governance into client value. |
| Governance access change | Principal / Compliance / Security | Invite, role-change, approve access and preserve audit. | PF-G / UF-12 / J07 | `/governance/users`, `/governance/roles`, `/governance/access-requests`, `/governance/audit-history` | `User`, `Role`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `EvidenceItem`, `AuditEvent` | Second confirmation, scoped grant | J07 audit/evidence proof | E5 demo transaction, demo auth caveat | Security proof for sophisticated buyers. |
| Export and redaction | Principal / Compliance / Privacy | Create scoped redacted evidence export with approval and expiry. | PF-I / UF-11 / J08 | `/export/new`, `/export/demo/scope`, `/export/demo/redaction`, `/export/demo/preview`, `/export/demo/download` | `ExportRequest`, `Document`, `DocumentVersion`, `EvidenceItem`, `AuditEvent` | Scope, redaction, approval, expiry | J08 export/evidence/audit proof | E5 demo transaction, metadata-only file | Excellent closing proof. |
| Communication escalation | Advisor / Client Success | Escalate from digital to call/F2F/external specialist. | PF-H / UF-13 | `/communication`, `/communication/call-trigger` | `MessageThread`, `Message`, `CallEvent`, `EvidenceRecord` | Advice-safe communication review | Seed/static proof | E2-E3 | Useful appendix, not core demo. |
| Ops and SLA monitoring | Ops / Product / QA | Inspect queues, SLA and implementation state. | PF-J / UF-14 | `/ops/queues`, `/ops/sla`, `/service-blueprint`, `/roadmap`, `/states` | `QueueItem`, `DataQualityIssue`, `AuditEvent` | Internal-only reference | Seed/static proof | E2-E3 | Best for internal/deep-dive. |

## Journey Portfolio

### 5-Minute Demo

| Segment | Route sequence | Roles | Demo data | Erzaehlpunkt | Risk note |
| --- | --- | --- | --- | --- | --- |
| 1 | `/signals` -> `/advisor-approval/demo` | Analyst -> Advisor | J01 Northbridge signal/recommendation | An internal signal can be reviewed without becoming client advice. | Do not claim compliance release yet. |
| 2 | `/compliance/demo/review` -> `/compliance/demo/release?state=release` | Compliance Officer | J02 Summit release fixture | Compliance release is the actual visibility gate. | It is demo-scoped, not production authorization. |
| 3 | `/decisions/demo` -> `/evidence/demo` | Principal | J03 Bennett released decision | Client acts only on released content and gets evidence. | UI may still show static copy after mutation. |
| 4 | `/export/demo/preview?state=approval` -> `/export/demo/download?state=confirm` | Principal / Compliance | J08 Summit export | Evidence can be packaged with redaction, approval and audit. | Export is metadata-only, no binary package yet. |

### 15-Minute Demo

| Segment | Route sequence | Roles | Demo data | Erzaehlpunkt | Risk note |
| --- | --- | --- | --- | --- | --- |
| Policy frame | `/admin/policies/advice-boundary` | Compliance | J10 policy baseline | Show the rule: advisor approval alone is not release. | Do not spend long here; policy mutation is not the main proof. |
| Client context | `/portal` -> `/relationships` | Principal | J09 Bennett profile/family | Client context is captured with review and evidence trails. | Some UI remains static. |
| Document evidence | `/documents/upload` -> `/documents/extraction-review` | Family CFO | J04 Morgan tax certificate | Documents become metadata, extraction and analyst review inputs. | No real binary upload. |
| Signal/review/release | J01 -> J02 | Analyst -> Advisor -> Compliance | Northbridge/Morgan/Summit fixtures | Human-reviewed workflow separates internal work from client visibility. | Keep tenant fixture changes explicit. |
| Decision/export | J03 -> J08 | Principal -> Compliance/Privacy | Bennett/Summit | Client decision and export are proof-backed. | Exports are metadata/manifests. |

### 30-Minute Demo

| Segment | Route sequence | Roles | Demo data | Erzaehlpunkt | Risk note |
| --- | --- | --- | --- | --- | --- |
| Setup | J10 -> J06 | Admin / Compliance / Client Success | Platform policies, Morgan tenant | Platform and tenant controls explain later gates. | Real auth/invite delivery is deferred. |
| Intake | J09 -> J04 -> J05 | Principal / CFO / Advisor | Bennett, Morgan, Summit | Client/family/entity/document context forms the evidence base. | Static UI data binding caveat. |
| Advice boundary | J01 -> J02 | Analyst / Advisor / Compliance | Northbridge, Morgan, Summit | Advisor can approve, but compliance decides visibility. | Demo transactions only. |
| Client action | J03 | Principal | Bennett released decision | Client gets options after release and evidence. | No final financial/legal/tax advice. |
| Trust package | J07 -> J08 | Compliance / Security / Principal | Northbridge/Summit | Access and export are scoped, redacted, audited. | Object-level grants still simplified. |
| Ops appendix | `/ops/queues`, `/ops/sla` | Ops / Product | seeded queues/issues | Operational oversight exists. | Read-only/static for now. |

### Deep-Dive Demo

| Audience | Route sequence | Roles | Demo data | Erzaehlpunkt | Risk note |
| --- | --- | --- | --- | --- | --- |
| Compliance | J10 -> J01 -> J02 -> J03 -> J08 | Compliance, Advisor, Principal | policy, recommendation, release, evidence, export | Show the full no-unapproved-advice chain. | Use proof paths and QA results. |
| Operations | J06 -> J04 -> J05 -> `/ops/queues` -> `/ops/sla` | Admin, CFO, Ops | onboarding, docs, actions, queues | Show work entering queues and blocked states. | Queue/SLA mutation is not the core proof. |
| Investor | J09 -> J01 -> J02 -> J03 -> J08 | Client, Analyst, Advisor, Compliance | client context to export | Show differentiated product value in 5 acts. | Avoid too much setup detail. |
| Engineering | Route registry -> fixtures -> API tests -> screencast run | QA/Engineering | `journeys.screencast`, fixtures, API tests | Show verifiability and generated evidence artifacts. | Requires local app/DB context. |

## Recommended Primary Demo

### The recommended path

J10 short frame -> J09 client context -> J04 document evidence -> J01 signal/advisor -> J02 compliance release/block -> J03 client decision/evidence -> J08 export -> J07 governance/audit appendix.

### Why this path wins

- It shows the product thesis, not just the screens.
- It starts with a relatable client/data input and ends with controlled evidence/export.
- It includes the strongest proof moment: compliance release, not advisor approval, controls visibility.
- It uses current stateful demo API coverage for the core proof journeys.
- It gives each stakeholder a reason to care: client clarity, advisor control, compliance defensibility, ops/audit traceability.

### Why alternatives are weaker

| Alternative | Weakness | Verdict |
| --- | --- | --- |
| Start with platform setup and tenant onboarding | Too much admin before the product value appears. | Use as frame or appendix. |
| Start with wealth map | Looks like a dashboard and weakens the compliance differentiation. | Use after profile/docs as context. |
| Show all 63 routes | Impressive but dilutes the story and risks route coverage = workflow coverage confusion. | Keep for QA appendix. |
| Only use screencast videos | Safe and polished, but less interactive for stakeholder questions. | Use as backup/proof artifact. |
| Only show J02/J03 | Strong proof but lacks source context and data lineage. | Use for 5-minute version only. |

## Data Requirement Matrix

| Journey | Tenant | Role / actor | Required records | Fixture refs / inputs | State before -> after | Evidence / audit | Visibility / permission | Blocked actions | Proof path |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| J01 Signal -> Advisor | `northbridge` / Northbridge Family Office | `analyst`, then advisor | `Trigger`, `ActionItem`, `Recommendation`, `Approval`, `AuditEvent` | `fixture-j01-signal-advisor-gate`; notes for request-data/advisor review | trigger new/internal -> advisor review/approval, client remains blocked | audit rows for request/route/approve/escalate | internal only; advisor approval not release | Publish/client decision | `app/api/demo-workflow/route.ts`, `SCREENCAST_QA_REPORT_V3.md` |
| J02 Compliance release/block | `morgan` for block, `summit` for release | `compliance_officer` | `ComplianceReview`, `Recommendation`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `fixture-j02-compliance-release-block`; `requestEvidenceNote`, `blockReason` | needs evidence/block or pending -> released | compliance request/block/release evidence items and audit | release requires gate; clientVisible true only on passed Summit release | Release without evidence/gate | `workflowGate`, Phase 14 Slice 1 QA |
| J03 Client decision/evidence | `bennett` | `principal` | `Decision`, `DecisionParticipant`, `Recommendation`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` | `fixture-j03-client-decision-evidence`; `decisionComment`, `reviewDate` | released decision -> accepted/deferred/rejected/request more info | decision evidence items, evidence access/download audit | released content guard before action | Decision on unreleased content | Phase 14 Slice 2 QA |
| J04 Document upload/verification | `morgan` | `family_cfo` | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceItem`, `AuditEvent` | `fixture-j04-document-upload-verification`; file metadata, extraction correction | empty/uploaded -> analyst_review_pending | document extraction review evidence, audit | clientVisible false for extraction; review required | Treat AI extraction as verified advice | Phase 14 Slice 3 QA, file metadata validation |
| J05 Entity/wealth/action | `summit` | `principal` | `Entity`, `EntityParticipant`, `ActionItem`, `EvidenceItem`, `AuditEvent` | `fixture-j05-entity-wealth-action`; entity name, registration number, action note | entity draft -> legal/wealth review; action ready attempt -> blocked/awaiting info | entity/action evidence items, audit | restricted/internal; no advice output | Mark ready with missing evidence | Phase 14 Slice 7 QA |
| J06 Tenant onboarding | `morgan` | `admin`, client success | `ClientTenant`, `User`, `UserRole`, `PolicyDefinition`, `ConsentRecord`, `AuditEvent` | `fixture-j06-tenant-onboarding`; tenant name, jurisdiction, principal email | draft -> onboarding with owners/team/invite | tenant/team/invite audit | no real auth; tenant readiness gate | Active tenant before checklist | Phase 14 Slice 4 QA |
| J07 Governance/access | `northbridge` | `principal`, compliance/security | `User`, `Role`, `RolePermission`, `AccessRequest`, `SecondConfirmation`, `UserRole`, `ExportRequest`, `EvidenceItem`, `AuditEvent` | `fixture-j07-governance-access-audit`; invite email, confirmation phrase | invite/request -> scoped grant / audit export approval-required | access/evidence/audit export proof | demo role-aware boundary; second confirmation | Broad external access without confirmation | Phase 14 Slice 6 QA; permission tests |
| J08 Export/redaction | `summit` | `principal`, compliance | `ExportRequest`, generated `Document`, `DocumentVersion`, `EvidenceItem`, `AuditEvent` | `fixture-j08-export-redaction`; export name, redaction reason | draft/scope -> approved/generated/downloaded/share | export package/download/share evidence and audit | redaction profile, approval, expiry | Include restricted object unredacted | Phase 14 Slice 5 QA; Phase 18 metadata tests |
| J09 Profile/family intake | `bennett` | `principal` | `UserProfile`, `FamilyMember`, `Relationship`, `EvidenceItem`, `AuditEvent` | `fixture-j09-client-profile-family-intake`; family member, relationship label, profile note | profile/family draft -> submitted/member/relationship evidence | profile/member/relationship evidence and audit | clientVisible false in API response; no advice release | Treat family map as recommendation | Phase 14 Slice 8 QA |
| J10 Platform baseline | platform / Northbridge visual context | `admin`, security/compliance | `PolicyDefinition`, `Role`, `Permission`, `AuditEvent` | `fixture-j10-platform-no-advice-baseline`; confirmation phrase, policy note | visible policy/confirm states; generic demo actions | generic/screencast proof, not specific policy transaction | internal/platform only | Claim persisted policy mutation | route registry, screencast QA, final handoff boundaries |

## Caption / Notes Metadata Model

```json
{
  "journeyId": "J02",
  "journeyTitle": "Compliance Release Or Block",
  "demoPriority": 1,
  "audienceFit": ["investor", "compliance", "engineering"],
  "speakerThesis": "Compliance, not advisor approval, controls client visibility.",
  "captionShort": "Compliance checks evidence before client release.",
  "captionLong": "This screen shows the release gate: advisor approval is necessary but not sufficient.",
  "presenterNotes": ["Point out missing evidence first.", "Then show the release path only after the gate passes."],
  "screenPurpose": "Review, block or release advice-like content.",
  "userIntent": "Protect the client and AlphaVest from premature release.",
  "trustProof": "Audit and evidence rows are written for request, block and release.",
  "complianceProof": "workflowGate checks advisor approval, compliance release, evidence and permission.",
  "dataProof": ["ComplianceReview", "Recommendation", "EvidenceRecord", "EvidenceItem", "AuditEvent"],
  "currentRealityLabel": "E5 demo transaction, not production compliance engine",
  "overclaimRisk": "Do not claim production authorization or real client advice.",
  "caveat": "No real identity-provider session; UI may not re-read every updated row.",
  "nextImplementationNeed": "Repository-backed screen loaders and production auth.",
  "relatedRoutes": ["/compliance", "/compliance/demo/review"],
  "relatedDataObjects": ["ComplianceReview", "Recommendation"],
  "evidenceRefs": ["docs/v3/IMPLEMENTATION_QA_REPORT.md#phase-14-slice-1---j02-compliance-releaseblock-qa-addendum"],
  "screenshotMoments": ["block state", "release confirmation", "audit log"],
  "screencastStepIds": ["J02-S03", "J02-S04", "J02-S05", "J02-S06", "J02-S07"]
}
```

## Example Metadata Records

The full machine-readable set lives in `docs/v3/DEMO_CAPTION_METADATA_V3.json`. Use these records for captions, speaker notes, storyboard cards, tooltips and presenter scripts.

| Journey | Caption short | Honest caveat |
| --- | --- | --- |
| J01 | Internal signal review stays client-hidden. | Advisor approval is not release. |
| J02 | Compliance decides release or block. | Demo transaction, not production compliance engine. |
| J03 | Client acts only on released content. | No final financial/legal/tax advice. |
| J04 | Documents become reviewed evidence inputs. | Metadata-only upload; no binary storage. |
| J05 | Wealth actions are blocked until evidence is complete. | Gate is fixture-scoped. |
| J06 | Tenant setup creates controlled onboarding context. | No real invitation delivery or auth. |
| J07 | Scoped access requires confirmation and audit. | Object grants are deterministic demo rules. |
| J08 | Export is scoped, redacted, approved and audited. | Metadata-only package, no binary download. |
| J09 | Client profile data creates reviewable context. | UI may be static after mutation. |
| J10 | Policy baseline explains the no-advice guardrail. | Do not claim policy transaction proof. |

## Demo Script Options

| Option | Equal value to us | Best audience | First step | Proof plan |
| --- | --- | --- | --- | --- |
| A: Trust-chain primary demo | Highest narrative clarity; proves differentiated product rule. | Investor, buyer, compliance | J09 or J01 | Use J01-J03-J08 proof, then appendix for J04/J07. |
| B: Evidence operations demo | Strong operational detail; proves data and audit depth. | Ops, engineering | J04 | Walk documents, action gates, evidence, export and queues. |
| C: Governance/security demo | Strong risk control; lower client delight. | Compliance/security | J10 | Policy -> governance -> access -> audit -> export. |

Recommended: Option A for first presentation, Option B for product/ops follow-up, Option C for security/compliance due diligence.

## Gap / Risk / Overclaim Register

| Risk | Why it matters | Safe wording |
| --- | --- | --- |
| Route coverage overclaimed as workflow execution | 63 routes render, but rendering is not the same as all business mutations. | "All catalogue routes render; selected demo workflows have stateful actions." |
| Demo transaction overclaimed as production compliance | Demo mode has deterministic role/tenant rules, not real identity-provider sessions. | "Demo-scoped transaction with audit/evidence proof." |
| Seed data overclaimed as user action proof | Seed rows exist before clicks. | "Seed data provisions the scenario; API actions prove selected transitions." |
| UI static data overclaimed as live read model | Some screens do not reload all Prisma changes. | "Action writes are proven by API/tests; screen content remains demo-rendered in places." |
| Export overclaimed as real file | Phase 18 validates metadata/manifests, no binary package. | "Metadata-only export package manifest." |
| Advice overclaimed | Product must not provide final financial/legal/tax advice. | "Decision workflow demo, not final advice." |
| J10 overclaimed | J10 is a policy frame and screencast route, not the strongest mutation proof. | "Policy baseline and visual guardrail." |

## Branch Debate and Weak-Branch Kill List

| Branch | Evidence for | Evidence against | Verdict |
| --- | --- | --- | --- |
| A: "Show every screen" | Route catalogue is complete and visually useful. | Too diffuse; invites route coverage = product proof confusion. | Killed for primary demo. |
| B: "Show only client portal/wealth map" | Most relatable and polished. | Undersells compliance/evidence differentiation. | Killed for primary demo, keep as context. |
| C: "Compliance trust chain" | Uses unique product rule, stateful demo actions, evidence/audit/export. | Needs careful caveats around demo/prod boundary. | Kept. |
| D: "Admin/platform setup first" | Explains policy roots. | Slower and less emotionally compelling. | Appendix/opening frame only. |

## Method Artifacts

### V2 Double Diamond

| Stage | Output |
| --- | --- |
| Discover | AlphaVest has strong route/data/test coverage, but the demo must foreground governed visibility rather than route volume. |
| Define | The decision problem is: how to demonstrate trust, human review and evidence without overclaiming production governance. |
| Develop | Candidate demo patterns: route tour, client-first story, compliance-first story, ops/evidence story, governance/security story. |
| Deliver | Choose compliance trust chain as primary, with client/doc/export/governance modules depending on audience. |

### Psycho-Logic + Map/Model

| Artifact | Output |
| --- | --- |
| Rational logic | Regulated wealth workflows need tenant scope, permissions, evidence, audit and release gates. |
| Psycho-logic drivers | Clients need clarity and confidence; advisors need control; compliance needs defensibility; investors need proof of differentiation. |
| Current maps audit | Route catalogue maps screens; data model maps objects; fixtures map scenarios; QA reports map proof; screencasts map communication. |
| Map traps | Dashboard trap, route-count trap, seed-data trap, production-compliance trap, advisor-approval trap. |
| Design moves | Use blocked states first, show release only after gates, attach notes/captions as metadata, and show evidence/audit at the end. |

### Reframing Matrix

| Lens | Weak frame | Strong frame |
| --- | --- | --- |
| Product | Wealth dashboard | Governed visibility and evidence workflow |
| Client | "See my portfolio" | "Know what I can safely decide today" |
| Advisor | "Approve recommendation" | "Review without releasing prematurely" |
| Compliance | "Final checkpoint" | "Release authority with audit/evidence proof" |

Best frame: AlphaVest is a client-visible trust layer over complex wealth operations.  
Wrong frame to avoid: a financial advice app where attractive recommendations are sent after advisor approval.

### TRIZ

| Contradiction | Derived move |
| --- | --- |
| Demo must feel complete but must not overclaim production maturity. | Use evidence-level labels: visual route, demo transaction, metadata-only file, production gap. |
| Client needs speed but advice release needs friction. | Show fast next-step UI plus explicit compliance/evidence gates. |
| Export should increase portability without privacy leakage. | Scope, redaction, approval, expiry and audit are mandatory demo beats. |
| Governance should be transparent without exposing internals to clients. | Use role/tenant context and audit history as controlled proof. |

### SIT Closed World

Closed-world resources: route registry, journey JSON, fixtures, Prisma seed, demo workflow API, permission engine, workflow gate, evidence/audit/export services, screencast runner, QA reports and 63 visual references.

| Operator | Move |
| --- | --- |
| Subtraction | Remove broad route tour; keep only scenes that prove trust. |
| Multiplication | Repeat the no-advice gate across advisor, compliance, decision and export. |
| Division | Split the demo into context, evidence, review, release, decision, export. |
| Task unification | Use screencast metadata as caption, QA and presenter-note source. |
| Attribute dependency | Visibility depends on role, tenant, workflow state, evidence and compliance release. |

### Morphological Analysis / Zwicky Box + CCA

| Dimension | Values |
| --- | --- |
| Audience | Investor, compliance, ops, engineering, client-facing buyer |
| Starting scene | Policy, portal, document, signal, compliance queue |
| Proof type | Visual route, required click, API mutation, audit/evidence row, screencast artifact |
| Gate | Advisor approval, compliance release, evidence completeness, redaction, second confirmation |
| Ending | Client decision, evidence record, export package, audit history |

CCA rejects:

- Advisor approval -> client visibility without compliance release.
- Export download before redaction/approval.
- Route smoke pass -> full workflow proof.
- Seed row -> user action proof.
- Policy baseline -> production authorization proof.

CCA keeps:

- Context -> evidence -> signal -> review -> release -> decision -> export.
- Compliance-first deep dive.
- Governance/access appendix.

### SCAMPER

| Operator | Demo move |
| --- | --- |
| Substitute | Substitute "dashboard tour" with "trust-chain story". |
| Combine | Combine J02, J03 and J08 into a release-decision-export arc. |
| Adapt | Adapt screencast step IDs into caption/speaker-note metadata. |
| Modify | Label every proof with maturity level. |
| Put to another use | Use QA reports as demo proof appendix. |
| Eliminate | Remove reference-only routes from primary demo. |
| Reverse | Start from blocked/unreleased state, then prove the gate that unlocks visibility. |

### Harvard / BATNA

| Artifact | Output |
| --- | --- |
| People/problem move | Separate "we need a compelling demo" from "we must not imply production compliance." |
| Interests map | Investor: differentiation; client: clarity; advisor: control; compliance: defensibility; engineering: proof. |
| Objective criteria | Product rules, route registry, data model, fixtures, API tests, QA reports, final handoff boundaries. |
| Mutual-gain option | A demo that is persuasive because it is explicit about proof and limits. |
| Our BATNA | Show the existing J01-J10 screencasts with caveats. |
| Their BATNA | Continue manual review, spreadsheets, ad hoc approvals and unstructured evidence packs. |
| BATNA improvement | Add repository-backed loaders so UI reflects mutations after reload. |

### MESOs

| Offer | Equal-value logic | Best fit |
| --- | --- | --- |
| A: Investor trust-chain demo | Fastest path to differentiation and product value. | First external pitch. |
| B: Compliance proof demo | More technical and risk-specific, still high trust value. | Compliance due diligence. |
| C: Engineering proof demo | Lower theatre, highest verifiability. | Internal delivery planning. |

### Measurement Plan

| Experiment | Hypothesis | Metric | Stop rule | Success signal |
| --- | --- | --- | --- | --- |
| 5-minute live dry run | Trust chain is understandable without route overload. | Stakeholder can restate no-advice gate. | Confusion between advisor approval and release. | Audience describes compliance release as key gate. |
| Caption metadata test | Notes improve explanation without app UI clutter. | Presenter can narrate every step from metadata. | Notes require extra repo lookup. | 10/10 journeys have usable captions and caveats. |
| Proof appendix test | QA artifacts satisfy engineering/compliance questions. | Proof path found within 30 seconds. | Cannot locate supporting file/test. | Each claim maps to a file/report. |
| Overclaim audit | Demo language avoids production claims. | Number of risky claims flagged. | Any claim says real auth, real advice or real binary file. | Zero unmitigated risky claims. |

### Ethics and Fairness

| Check | Result | Mitigation |
| --- | --- | --- |
| No deception | Pass with caveat | Every demo/prod boundary is labelled. |
| No fabricated facts | Pass | Claims are tied to repo docs/code/reports. |
| No coercion/dark patterns | Pass | Decisions include accept/defer/reject/request more info. |
| Real exit options | Pass | Client decision and evidence review keep alternatives visible. |
| Stakeholder harm scan | Pass | No real client data and no final advice. |

## Proof Paths

| Claim | Proof path |
| --- | --- |
| 63 routes render | `lib/route-registry.ts`, `tests/route-smoke.spec.ts`, `FINAL_HANDOFF_REPORT.md`. |
| J02-J09 stateful demo actions exist | `app/api/demo-workflow/route.ts`, `tests/demo-workflow-api.spec.ts`, `IMPLEMENTATION_QA_REPORT.md` Phase 14 addenda. |
| Compliance release controls visibility | `lib/workflow-gate.ts`, J02 Slice 1 QA, seed invariant in `prisma/seed.ts`. |
| Demo role-aware denials exist | `lib/permission-engine.ts`, `tests/permission-engine.spec.ts`, Phase 16 QA addendum. |
| File/export realism is metadata-only | `lib/file-metadata-service.ts`, `lib/export-package-service.ts`, `tests/file-export-realism.spec.ts`, Phase 18 QA addendum. |
| Captions/screencasts exist | `docs/v3/journeys.screencast.v3.json`, `SCREENCAST_QA_REPORT_V3.md`, screencast run artifacts. |
| Remaining production boundary | `FINAL_HANDOFF_REPORT.md` Intentional Boundaries. |

## Learning Log

| Learning | Impact |
| --- | --- |
| The project has advanced beyond the older "mostly navigable-only" gap statement. | Use current Phase 14-19 evidence before demo planning. |
| J02-J09 are strong enough for a stateful demo claim. | Use them as proof beats, with demo/prod caveats. |
| J10 is valuable but should not lead the demo. | Use it as policy framing or appendix. |
| Captions should not live in product UI. | Store notes in metadata and screencast artifacts. |
| The final product gap is not visuals; it is productionization: auth, loaders, binary files, object-level grants. | Demo honestly, then show next moves. |

## Method Compliance Checklist

| Requirement | Status |
| --- | --- |
| V3 Mission Card | Done |
| Evidence Intake | Done |
| Problem Architecture | Done |
| Branch Debate / weak-branch kill | Done |
| Adversarial QA / overclaim register | Done |
| Proof Paths | Done |
| Learning Log | Done |
| V2 Double Diamond | Done |
| Psycho-Logic + Map/Model | Done |
| Reframing Matrix | Done |
| TRIZ | Done |
| SIT Closed World | Done |
| Morphological Analysis / Zwicky Box + CCA | Done |
| SCAMPER | Done |
| Harvard / BATNA | Done |
| MESOs | Done |
| Measurement Plan | Done |
| Ethics & Fairness | Done |
| Facts / assumptions / interpretations separated | Done |
| No invented production capability | Done |
| No real client data or final advice claim | Done |
