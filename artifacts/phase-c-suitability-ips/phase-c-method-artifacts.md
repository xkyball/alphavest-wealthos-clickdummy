# Phase C Mixed-Engine Method Artifacts

Date: 2026-06-17
Scope: Phase C only, tickets C-01 to C-12 from `docs/v3/WORKFLOW_COMPLETION_IMPLEMENTATION_PLAN_V3.md`.

## V3 Mission Card

Complete Suitability and IPS/Mandate foundations so advice-like flows remain blocked unless local workflow gates prove readiness. Do not claim advice release, client visibility, production persistence or external provider behavior without local proof.

## Evidence Pack

- Source contracts read: `AGENTS.md`, `CODEX_MASTER_TASK.md`, v3 task/design/screen/technical/pageflow/data/QA docs, Phase C workflow plan and Human Visual Implementation Standard.
- Existing executable contracts used: `workflowGate.canBecomeClientVisible`, `screenRoutes`, route smoke, visual contract, demo workflow API, Prisma demo audit/evidence patterns from Phase B.
- Visual evidence captured: C-04 reference screenshots and C-06/C-07 production implementation screenshots.
- Proof commands passed: typecheck, lint, build, visual contract, route smoke, workflow gate tests, workflow API tests.

## Double Diamond

| Stage | Result |
| --- | --- |
| Discover | Existing app already separates advisor approval, compliance release, evidence and permission checks. No suitability/IPS-specific local gate existed. |
| Define | The real problem was not a prettier screen; it was preventing any unreviewed advice flow from becoming client-visible without suitability, IPS acknowledgement and mandate evidence. |
| Develop | Options considered: UI-only blockers, generic workflow-gate reuse, or extended local gate with explicit suitability/IPS prerequisites. |
| Deliver | Implemented the extended local gate, two internal routes, J13/J14 demo actions, proof artifacts and reports. |

## Psycho-Logic + Map/Model

| Artifact | Phase C finding |
| --- | --- |
| Rational logic | Client-visible advice requires conjunctive gates: release state, advisor approval, compliance release, evidence, permission, suitability, risk/objective completion, IPS acknowledgement and client acknowledgement. |
| Psycho-logic drivers | Users need to see why the workflow is blocked without feeling the app is broken. The UI exposes blockers as normal workflow work, not error mystery. |
| Current maps audit | Existing route map had compliance and KYC maps, but no suitability/IPS map. |
| Map traps | Treating "advisor reviewed" or "IPS draft exists" as release readiness would be a false map. |
| Design moves | Display local missing gates prominently and disable release controls. |

## Reframing Matrix

| Lens | Frame |
| --- | --- |
| Compliance x workflow | Suitability/IPS is a prerequisite gate, not a document archive. |
| Advisor x client | Advisor review prepares advice; it does not release advice. |
| Evidence x UI | Evidence links are readiness signals, not client proof until release gates pass. |
| Demo x production | Demo audit/evidence proves local behavior only; production behavior remains unclaimed. |

Best frame: "Suitability/IPS blocks advice visibility until the local gate says all prerequisites are complete."

Wrong frame to avoid: "IPS exists, therefore mandate/advice is ready for the client."

## TRIZ

| Contradiction | Resolution |
| --- | --- |
| Move workflow forward without weakening advice controls | Add J13/J14 actions that write demo audit/evidence but return `clientVisible: false`. |
| Add routes without disrupting original 63-screen catalogue | Append page IDs 066/067 and keep the original matrix intact. |
| Use ImageGen workflow without overclaiming missing files | Invoke ImageGen, keep prompts, and mark bitmap persistence blocked rather than inventing a file. |

## SIT Closed World

| Technique | Move |
| --- | --- |
| Subtraction | No production auth, no final advice release, no document-signature provider. |
| Multiplication | Reuse Phase B route/action/proof pattern for two new Phase C screens. |
| Division | Separate reference screenshots, ImageGen prompts, implementation screenshots and rubric status. |
| Task unification | Local gate drives both UI blocker copy and API test assertions. |
| Attribute dependency | Client visibility depends on suitability/IPS state as well as compliance/evidence/permission state. |

## Morphological Analysis / CCA

| Dimension | Selected value |
| --- | --- |
| Route model | Registry-backed route IDs 066/067 |
| Gate model | Extended `workflowGate.canReleaseAdviceWithSuitabilityIps` |
| Persistence proof | Demo API audit/evidence upsert only |
| Visual proof | Production screenshots plus rubric |
| Client visibility | Explicitly blocked |

Rejected combinations: UI-only gate without test, ImageGen mockup claim without file, client-visible IPS route without compliance release, schema migration for demo-only fields.

## SCAMPER

| Method | Phase C move |
| --- | --- |
| Substitute | Replaced generic placeholder with real Suitability/IPS surfaces. |
| Combine | Combined suitability, IPS, evidence and compliance readiness into one gate result. |
| Adapt | Adapted Phase B J12 proof pattern to J13/J14. |
| Modify | Extended workflow gate missing reasons with suitability/IPS prerequisites. |
| Put to another use | Used route smoke and visual contract for new non-catalogue workflow routes. |
| Eliminate | Removed any client-release claim from UI and API. |
| Reverse | Gate starts blocked by default; passing is exceptional and fully conjunctive. |

## Harvard / BATNA

| Artifact | Result |
| --- | --- |
| People/problem move | Treat compliance/advisor/user confidence as a shared need for explicit blockers, not as friction. |
| Interests map | Advisors need progress; compliance needs proof; clients need no unapproved advice; product needs demoable flow. |
| Objective criteria | Local gate result, route smoke, API assertion, screenshot proof, visual rubric. |
| Our BATNA | Keep Phase C internal-only and document production gaps. |
| Their BATNA | Stakeholders reject the phase if it claims release without proof. |

## MESOs

| Option | Equal-value logic | Result |
| --- | --- | --- |
| A: UI-only | Fastest visual progress, weak proof | Rejected. |
| B: Gate plus UI plus API proof | Balanced user value and local proof | Selected. |
| C: Full Prisma schema expansion | Stronger persistence, high scope creep | Deferred. |

## Measurement Plan

| Test | Success signal |
| --- | --- |
| `pnpm test:workflow-gate` | Blocked candidate fails; fully complete candidate passes. |
| `pnpm test:workflow-api` | J13/J14 return audit/evidence IDs, `noClientRelease: true`, `gatePassed: false`. |
| `pnpm test:route-smoke` | 67 registered routes render, including 066/067. |
| Production screenshots | Suitability and IPS screens render without dev overlay or spec chrome. |

## Ethics & Fairness

- No final financial, legal or tax advice was added.
- No client-visible advice was released.
- Advisor approval alone remains insufficient.
- Blockers are explicit and non-manipulative.
- Limitations are documented in reports and artifacts.

## V3 Adversarial QA

| Risk | Result |
| --- | --- |
| Hidden overclaim: UI says client release is possible | Mitigated by disabled release buttons and blocked gate copy. |
| Hidden overclaim: API action mutates visibility | Mitigated by tests asserting `clientVisible: false` and `noClientRelease: true`. |
| Visual proof overclaim | Mitigated by production screenshots plus rubric; ImageGen file persistence marked blocked. |
| Weak branch killed | UI-only implementation rejected because it would not prove gate behavior. |

## Learning Log

- Next.js dev server can show hydration-warning overlays in screenshots; production server captures are cleaner proof.
- Built-in ImageGen generated inline output but did not expose a workspace file path in this session, so C-05 must remain partially blocked unless rerun with accessible output.
