# Phase E Method And Gate Artifacts

Mode: Max / ENGINE_MIX_V2_CODEX_V3_PROOF
Date: 2026-06-17
Scope: Phase E only, tickets E-01 to E-08.

## V3 Mission Card

Implement Committee / Peer Review so high-risk recommendations do not stop at Advisor Approval. The defensible proof target is E6 gated demo simulation: visible second-review route, committee gate tests, no-client-release proof, screenshots, implementation maps and Human Visual Review Rubric results.

## Evidence Intake

Facts:
- `WORKFLOW_COMPLETION_IMPLEMENTATION_PLAN_V3.md` defines Phase E as Committee / peer review and requires high-risk second review to be visible and gated.
- E-02 requires real app screenshots from `/advisor-approval` and `/advisor-approval/:id`.
- E-03 and E-04 require full visual implementation gates.
- Existing `workflowGate.canBecomeClientVisible()` blocks client visibility unless advisor, compliance, evidence and permission gates pass.
- Existing advisor approval UI states that advisor approval sends the package downstream but client visibility remains blocked.

Assumptions:
- Phase E should extend the demo workflow rather than introduce production auth, migrations or payloaded committee vote persistence.
- Committee review sits between Advisor Approval and Compliance for high-risk cases.

Non-claims:
- No real committee vote API.
- No persisted dissent update.
- No production audit/evidence mutation.
- No client release from committee review.

## V2 Double Diamond

Discover:
- Existing advisor approval and compliance screens already represent a gated internal workflow.
- The missing risk is that a high-risk recommendation appears adequately handled once advisor-approved.

Define:
- The real problem is a missing visible second-review gate and missing proof that advisor approval alone is insufficient for high-risk advice.

Develop:
- Candidate A: add only copy to advisor approval. Rejected because it does not create a queue/detail path.
- Candidate B: add committee route screens only. Rejected because it lacks gate proof.
- Candidate C: add committee routes, E6 gate helper, route tests, screenshots and reports. Selected.

Deliver:
- Added `/committee/reviews` and `/committee/reviews/:id`.
- Added `canPassHighRiskCommitteeGate()`.
- Added focused tests proving advisor-only fails and complete committee proof passes.
- Captured reference and implementation screenshots and rubric results.

## Method Artifacts

### Psycho-Logic + Map/Model

Rational logic: High-risk advice needs independent review before downstream release. Advisor approval is one control, not enough control.

Psycho-logic: Stakeholders can over-trust a polished advisor-approved screen. Committee UI restores legitimacy by showing independent votes, dissent and evidence completeness.

Map trap: A green advisor approval badge can be mistaken for client-release readiness.

Design move: Display `clientVisible=false`, vote counts, dissent state and evidence state directly on Committee screens.

### Reframing Matrix

| Lens | Weak frame | Better frame |
| --- | --- | --- |
| Product | "Advisor approved means ready." | "Advisor approval is one internal gate." |
| Risk | "High risk is just a badge." | "High risk changes the workflow path." |
| Compliance | "Committee approves release." | "Committee gates before compliance considers release." |
| Demo proof | "Route renders." | "Route renders plus gate test plus screenshot/rubric proof." |

Best frame: Committee review is a second-control gate, not a client-release authority.

Wrong frame to avoid: committee approval replaces compliance release.

### TRIZ

Contradiction: The UI must feel operational but must not overclaim productive persistence or release.

Derived moves:
- Use fixture-backed rows and explicit E6 gate tests.
- Disable approval action while committee proof is incomplete.
- Keep downstream compliance note visible.

### SIT Closed World

Closed-world resources used:
- Existing Advisor Approval queue/detail composition.
- Existing AppShell and UI primitives.
- Existing workflow gate module.
- Existing Playwright route proof pattern.
- Existing visual artifact template structure.

SIT moves:
- Subtraction: no new database or auth layer.
- Multiplication: add a second review gate beside advisor and compliance gates.
- Division: separate queue proof from detail proof.
- Task unification: route UI doubles as gate education for reviewers.
- Attribute dependency: high risk makes committee approval mandatory.

### Morphological Analysis / Zwicky Box + CCA

| Dimension | Option A | Option B | Selected |
| --- | --- | --- | --- |
| Data backing | Static fixture | DB mutation | Static fixture |
| Gate proof | UI copy only | Unit gate test | Unit gate test |
| Route shape | Reuse advisor path | New committee path | New committee path |
| Visual proof | Route smoke | Screenshot + rubric | Screenshot + rubric |
| Release semantics | Committee releases | Compliance remains downstream | Compliance remains downstream |

Rejected by CCA:
- Committee releases client content: violates product rule.
- DB mutation in Phase E: too broad for requested scope.

### SCAMPER

- Substitute: replace single advisor endpoint with advisor plus committee path for high risk.
- Combine: combine vote state, dissent state and evidence state on one detail surface.
- Adapt: adapt Advisor Approval layout to Committee Review.
- Modify: elevate `clientVisible=false` as a metric.
- Put to another use: use gate helper for proof tests.
- Eliminate: remove any productive release claim from committee UI.
- Reverse: instead of "approved then release", show "approved then peer review before compliance".

### Harvard / BATNA

People/problem move: Separate advisor effort from control sufficiency.

Interests:
- Advisor wants flow momentum.
- Compliance wants release control.
- Committee wants peer-review visibility.
- Client needs protection from unapproved advice.

Objective criteria:
- Advisor approval status.
- Committee approval status.
- Dissent resolved.
- Evidence state.
- Permission check.

BATNA:
- Without committee proof, keep high-risk recommendation internal and blocked.

### MESOs

Equal-value statement: Each option preserves no-client-release and adds visible committee control.

| Offer | Shape | Fit | Proof |
| --- | --- | --- | --- |
| A | Queue + detail + gate test | Strongest Phase E fit | Implemented |
| B | Gate test only | Too invisible for user workflow | Rejected |
| C | Full payloaded committee API | Too broad for Phase E | Deferred |

### Measurement Plan

| Experiment | Hypothesis | Metric | Stop rule | Success signal |
| --- | --- | --- | --- | --- |
| Gate unit test | Advisor-only high risk is blocked | `missing` contains committee gates | Fails if passed | Test passes |
| Route proof | Queue/detail render with gate labels | Playwright route test | Fails if labels missing | Test passes |
| Visual proof | Screens look product-native | Screenshot + rubric | Fails on visible chrome/clipping | Rubric accepted |

### Ethics & Fairness

| Check | Status | Notes |
| --- | --- | --- |
| No deception | pass | E6 fixture boundary documented. |
| No coercion/dark pattern | pass | UI blocks risky release rather than nudging release. |
| No fabricated production claim | pass | No E7 claim. |
| Real exit/hold option | pass | Blocked and request-evidence states remain visible. |
| Public-reveal test | pass | Committee gate is transparent and defensible. |

## V3 Adversarial QA

Weak branch killed: "Committee UI only" was rejected because visual proof without gate proof would not satisfy the user goal.

Residual risks:
- Build emits existing Turbopack warnings around dynamic demo document-storage filesystem tracing; production build still completes successfully.
- Empty/error/mobile screenshots remain unverified.
- Committee actions are fixture/static, not operational payloaded persistence.

## Ticket Completion

| Ticket | Result |
| --- | --- |
| E-01 | Phase E contract mapped; current/target level recorded as E6 gated demo simulation. |
| E-02 | Running app reference screenshots captured from `/advisor-approval` and `/advisor-approval/demo`. |
| E-03 | Committee Review Queue implemented with implementation map, screenshot proof and rubric. |
| E-04 | Committee Review Detail implemented with implementation map, screenshot proof and rubric. |
| E-05 | High-risk committee gate helper implemented in `lib/workflow-gate.ts`. |
| E-06 | Gate and route tests added. |
| E-07 | Phase and QA reports updated. |
| E-08 | Next Phase F recommendation recorded. |

## Method Compliance Checklist

| Requirement | Status |
| --- | --- |
| Facts, assumptions, interpretations and moves separated | pass |
| Double Diamond visible | pass |
| Psycho-Logic + Map/Model artifact | pass |
| Reframing Matrix artifact | pass |
| TRIZ artifact | pass |
| SIT Closed World artifact | pass |
| Morphological Analysis / CCA artifact | pass |
| SCAMPER artifact | pass |
| Harvard / BATNA artifact | pass |
| MESOs artifact | pass |
| Measurement Plan artifact | pass |
| Ethics & Fairness artifact | pass |
| V3 proof/adversarial wrapper | pass |
