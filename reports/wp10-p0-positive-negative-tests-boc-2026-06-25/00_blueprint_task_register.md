# WP10 P0 Positive/Negative Tests - Blueprint Task Register

Generated: 2026-06-25

## Source Scope Applied

Authoritative task contract:
- `/Users/chris/Downloads/alphavest/ALPHAVEST_WP10_P0_POSITIVE_NEGATIVE_TESTS_BOC_TICKET_STRUCTURE.md`

Allowed evidence sources used for this register:
- Current repository source, tests, route tree, config and git state.
- Earlier generated process artefacts were discovered under `reports/boc-ctes-capability-audit-2026-06-25/` but were not used as WP10 specification authority because they belong to a broader BOC/CTES capability audit chain, not this WP10 positive/negative test chain.
- No unrelated legacy planning documents, source_refs, source_artefacts or broad handoff documents were imported as WP10 specification authority.

Repository guardrail context:
- Project `AGENTS.md` requires True-UX handoff discipline and `pnpm guard:source` before downstream work. This was treated as a repository guardrail, not as WP10 specification authority.

## Blueprint Chain

| Order | Blueprint ID | Type | Description | Dependency / Stop Rule |
| --- | --- | --- | --- | --- |
| 1 | ANALYSIS-WP10-1 | Analysis | Audit existing P0 positive/negative test coverage and gaps. | Must inspect current repo tests/source first. |
| 2 | SPEC-WP10-1 | Specification | Refine P0 positive/negative test specification and gate matrix from blueprint plus executed analysis. | Requires ANALYSIS-WP10-1. Must state generated artefact inputs/overrides. |
| 3 | DECISION-WP10-1 | Decision | Decide implementation wave cutline and failing-test policy. | Stop only if genuinely required. |
| 4 | IMPL-WP10-1 | Implementation | Payload visibility and client leakage tests. | Requires analysis/spec/decision. |
| 5 | IMPL-WP10-2 | Implementation | AI Draft internal-only tests. | Requires payload visibility contract. |
| 5.1 | SUBTASK-WP10-2.1 | Subtask | Negative AI Draft leakage proof. | Part of IMPL-WP10-2. |
| 5.2 | SUBTASK-WP10-2.2 | Subtask | Positive internal-only AI Draft proof. | Part of IMPL-WP10-2. |
| 6 | IMPL-WP10-3 | Implementation | Advisor/compliance/release separation tests. | Requires visibility and workflow gate proof. |
| 7 | IMPL-WP10-4 | Implementation | Admin non-bypass negative suite. | Requires permission/governance proof. |
| 8 | IMPL-WP10-5 | Implementation | Upload-not-sufficiency and evidence sufficiency tests. | Requires evidence lifecycle proof. |
| 8.1 | SUBTASK-WP10-5.1 | Subtask | Upload-only negative proof. | Part of IMPL-WP10-5. |
| 8.2 | SUBTASK-WP10-5.2 | Subtask | Positive sufficiency lifecycle proof. | Part of IMPL-WP10-5. |
| 9 | IMPL-WP10-6 | Implementation | Audit persistence and audit fail-closed tests. | Requires critical-action audit proof. |
| 9.1 | SUBTASK-WP10-6.1 | Subtask | Audit persistence positive proof. | Part of IMPL-WP10-6. |
| 9.2 | SUBTASK-WP10-6.2 | Subtask | Audit failure fail-closed negative proof. | Part of IMPL-WP10-6. |
| 10 | IMPL-WP10-7 | Implementation | Export redaction/approval separation tests. | Requires export lifecycle proof. |
| 11 | IMPL-WP10-8 | Implementation | API validation and fail-closed tests. | Requires route/API validation proof. |
| 12 | IMPL-WP10-9 | Implementation | Route guard and hold-route non-elevation assertions. | Requires route registry/smoke proof. |
| 13 | QA-WP10-1 | QA | Validate P0 regression suite and no-overclaim acceptance proof. | Requires implementation or zero-delta implementation report. |

## Extracted DoD By Cluster

| Cluster | Done Means |
| --- | --- |
| Payload visibility / leakage | Client/API/export projections expose only client-safe fields after release and fail closed before release; internal fields remain hidden. |
| AI Draft internal-only | AI draft can be used internally where authorized, but cannot leak to client projection or export payloads. |
| Advisor/compliance/release | Advisor approval cannot equal compliance release or client visibility; positive release needs all preconditions. |
| Admin non-bypass | Admin/governance authority can manage governance scope but cannot force release, evidence sufficiency, export, or internal-advice visibility. |
| Upload/evidence sufficiency | Upload creates/queues evidence but does not satisfy release/export/client-visibility gates; reviewed scoped evidence can become sufficient. |
| Audit persistence/fail-closed | Critical gate actions write audit evidence on success and fail before mutation when audit persistence is unavailable. |
| Export separation | Scope, redaction, preview, approval, generation, download and share remain distinct; forbidden/internal payloads block export. |
| API fail-closed | Invalid requests return explicit failure, do not mutate, do not execute advice, and do not release client visibility. |
| Route/hold scope | Hold/deferred/reference routes remain registered-only/non-elevated and cannot expose productive action claims. |
| QA/no-overclaim | Validation must include positive and negative proof and must not claim broader production, visual, or full-MVP acceptance than tested. |

## Decisions Extracted

DECISION-WP10-1 asks:
- Full WP10 in one wave versus first proof slice.
- Whether consciously failing acceptance tests are allowed.
- Which P0 gates are MVP-blocking.
- Whether audit fail-closed simulation is in wave 1 or blocker-marked.
- Whether UI tests are required for all clusters or API/service tests are enough.

Applied handling in this run:
- See `02_refined_specification_and_decision.md`.

## Blockers / Stop Rules Extracted

Stop only if a human decision is truly required. Specific WP10 stop cases:
- Existing repo evidence cannot determine whether a test gap is intentional or blocking.
- Required product behavior is absent and the blueprint would require knowingly failing tests without an accepted failing-test policy.
- Audit fail-closed cannot be simulated or proven and no accepted blocker language exists.
- Route or scope elevation would require changing held/deferred/product boundaries.
- QA cannot run enough validation to support the reported acceptance status.

No such stop condition was reached during the executed analysis for this run.
