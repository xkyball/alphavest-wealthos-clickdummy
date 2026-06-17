# Phase B Method Artifacts - KYC / AML / Source-of-Wealth

Date: 2026-06-17
Engine route: ENGINE_MIX_V2_V3 via `Max`

## V3 Mission Card

- Mission: add Phase B only, B-01 to B-12, as a real, testable KYC/AML/Source-of-Wealth workflow.
- Evidence sources: AGENTS, CODEX_MASTER_TASK, v3 workflow plan, pageflow/data model/quality gates, existing route registry, UI components and demo workflow API.
- Exit gate: J12 route, state, screenshot and rubric ready; no client advice/release overclaim.

## Facts

- Phase B adds two workflow screens: `/kyc/:id/review` and `/kyc/:id/source-of-wealth`.
- B-04/B-05 require real app screenshots before ImageGen.
- ImageGen output is a reference only, not implementation proof.
- Existing demo workflow API can persist audit events and some evidence records/items.
- Existing Evidence service helper is placeholder-only, so DB persistence must use verified Prisma models directly if claimed.

## Assumptions

- The concrete demo route can use `/kyc/demo/review` and `/kyc/demo/source-of-wealth` for the route registry smoke path.
- J12 is the Phase B screencast/workflow identifier.
- Morgan demo tenant can carry the Phase B KYC package because existing document workflow already has Morgan fixture IDs.

## Double Diamond

- Discover: KYC spans document intake, trigger review, evidence, audit and compliance visibility controls.
- Define: the real problem is not a pretty KYC page; it is a controlled state machine where incomplete evidence blocks downstream visibility.
- Develop: implement a compact KYC package, Source-of-Wealth detail, J12 API handlers and proof artifacts.
- Deliver: two routes, explicit workflow states, audit/evidence boundaries, screenshot proof inventory and reports.

## Psycho-Logic + Map/Model

- Rational logic: reviewers need identity, AML hit, source proof, evidence completeness and next action in one screen.
- Psycho-logic drivers: compliance users need control and traceability; advisors need confidence that a blocked state is legitimate; clients must not see internal review conclusions prematurely.
- Current maps audit: `/documents/extraction-review` maps document extraction; `/workbench/triggers/:id` maps analyst signal detail.
- Map traps: treating AI extraction as final evidence; treating Source-of-Wealth review as investment advice; treating advisor readiness as compliance release.
- Design moves: label internal-only state, show evidence/audit lineage, disable release-like action when gates are incomplete.

## Reframing Matrix

| Lens | Frame | Move |
| --- | --- | --- |
| Compliance control | KYC is a release gate | Show blocked/review states and audit boundary. |
| Analyst productivity | KYC is evidence triage | Put missing proof and confidence fields up front. |
| Advisor trust | KYC is downstream risk context | Show what is ready vs what remains restricted. |
| Client safety | KYC is not advice | Keep all Phase B routes internal and no-client-release. |

Best frame: KYC as internal evidence-gated review.
Wrong frame to avoid: KYC as a client-facing approval/advice screen.

## TRIZ

- Contradiction: move workflow forward without weakening evidence controls.
- Improve speed while not worsening compliance assurance.
- Principles used: segmentation, prior action, intermediary, feedback.
- Derived moves: separate KYC review and Source-of-Wealth review; record actions as audit events; create evidence package only for proof; keep clientVisible false.

## SIT Closed World

- Resources: route registry, existing shell, document reference page, trigger reference page, Prisma audit/evidence models, demo session roles.
- Subtraction: no production KYC provider.
- Multiplication: two separate but linked screens.
- Division: identity/AML/evidence/audit panels.
- Task unification: buttons both guide workflow and record demo audit action.
- Attribute dependency: CTA enabled state depends on evidence completeness/risk.

## Morphological Analysis / Zwicky Box + CCA

| Dimension | Values |
| --- | --- |
| Route type | internal page, client page, modal |
| Persistence | audit only, audit + evidence, visual only |
| Risk state | clear, needs info, blocked |
| Actor | analyst, compliance, advisor |

Kept variant: internal page + audit/evidence + blocked/review states + analyst/compliance actors.
Rejected variants: client page, visual-only workflow, advisor-only approval.

## SCAMPER

- Substitute: use internal compliance shell instead of client workspace.
- Combine: document extraction cues with trigger-detail risk cues.
- Adapt: existing audit/evidence primitives to KYC state.
- Modify: add KYC-specific readiness/risk panels.
- Put to another use: route-smoke coverage becomes J12 route proof.
- Eliminate: no visible spec metadata.
- Reverse: show blockers before approval controls.

## Harvard / BATNA

- People/problem: reviewers are not the problem; unclear evidence boundaries are.
- Interests: fast triage, defensible audit, no premature client visibility.
- Objective criteria: evidence completeness, AML risk, workflow state, audit result.
- Our BATNA: keep KYC workflow unaccepted until proof is complete.
- Their BATNA: manual spreadsheet/review queue outside WealthOS.
- BATNA improvement: show exactly which proof is missing and record why.

## MESOs

- A: Audit-first minimal workflow. Fastest, lower evidence depth.
- B: Audit plus evidence package. Selected; balanced proof and scope.
- C: Full provider-like KYC integration. Rejected for Phase B scope.

## Measurement Plan

- Experiment 1: Route smoke proves both KYC routes render with headings.
- Experiment 2: J12 API test proves explicit mutations return audit/evidence boundaries and no client release.
- Experiment 3: Screenshot/rubric artifacts prove visual status without overclaiming design acceptance.

## Ethics & Fairness

- No deception: generated mockups are labeled reference-only.
- No coercion/dark patterns: blocked states explain objective missing evidence.
- No fabricated compliance certification: production provider integrations are explicitly out of scope.
- Public-reveal test: demo-only limits and no-client-release boundary are visible.

## V3 Adversarial QA

- Weak branch killed: using generic `j12.*` fallback because it would not prove workflow semantics.
- Risk: screenshot proof may pass while human review remains pending; reports must separate these.
- Risk: Evidence persistence could be overclaimed; only claim records/items actually written by J12 handlers.

## Learning Log

- Phase B is safest as an internal workflow slice tied to existing document and trigger patterns.
- Visual proof must be an artifact inventory, not a completion shortcut.
