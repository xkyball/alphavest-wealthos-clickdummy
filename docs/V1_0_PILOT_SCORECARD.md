# V1.0 Pilot Scorecard

Status: PILOT_MEASUREMENT_BASELINE
Date: 2026-06-23
Authority: ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md

## Success Metrics

| Metric | Target | Evidence source | Failure signal |
|---|---|---|---|
| Buyer confidence | Design partner can restate the trust spine and name the non-bypass gates. | Pilot interview notes and demo recap. | Buyer thinks route coverage or screenshots are the proof. |
| No leakage | Zero client-visible AI draft, internal rationale, compliance notes or unreleased evidence leakage. | `pnpm test:v1-p0`; incident log. | Any client/export payload includes forbidden internal content. |
| Evidence completeness | Every release candidate names linked, reviewed and scoped evidence. | evidence review API, workflow gate tests, audit notes. | Upload-only state is treated as release-ready. |
| Review time | Pilot team can measure time from evidence request to compliance release decision. | action timestamps, audit rows, pilot notes. | No owner can explain where a case is stuck. |
| Gate clarity | Advisor approval, compliance release, client visibility and export approval are distinguishable. | typed-workflow tests and buyer feedback. | Buyer believes advisor approval releases to client. |
| Support incidents | P1/P2/P3 incidents are classified with owner, correlation id and safe status. | `docs/V1_0_PILOT_RUNBOOK.md`; incident notes. | Incident notes include sensitive payload or lack owner/severity. |
| Feedback issues | Pilot feedback is sorted into product fit, workflow clarity, missing integration and safety blocker buckets. | weekly pilot review. | Feedback is only applause/screenshots and not decision-grade. |

## Go / Learn / Stop Criteria

| Decision | Criteria |
|---|---|
| Go | P0 tests pass, no leakage, buyer can name the trust spine, and support incidents are classifiable. |
| Learn | Buyer sees value but needs workflow clarity, integration prioritization or better demo-data explanation. |
| Stop | Any forbidden payload leak, real-data confusion, autonomous-advice expectation, or missing rollback/support path. |

## Feedback Loop

1. Run the P0 proof commands before a pilot session.
2. Present the trust-chain demo narrative.
3. Capture buyer questions by journey and gate.
4. Record incidents and feedback with owner, severity and next action.
5. Convert feedback into product-fit, workflow-clarity, integration, safety-blocker or pricing-risk buckets.
6. Do not convert P1/Hold requests into live promises without a later True-UX-approved unlock.

