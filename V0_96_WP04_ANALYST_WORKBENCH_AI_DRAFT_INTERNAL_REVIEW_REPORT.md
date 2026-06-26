# V0.96 WP-04 Analyst Workbench and AI Draft Internal Review Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP04_ANALYST_WORKBENCH_AI_DRAFT_INTERNAL_REVIEW_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_ALREADY_PRESENT_WITH_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-04 asked for the analyst workbench and AI/rules draft path to stay internal-only while supporting real review decisions: reject unsupported claim, request evidence, rebuild with accepted scoped evidence, and route a reviewed package onward without creating client-visible advice or exportable material.

This execution refreshed proof against the WP-04 deep prompt. No product code, schema, route, API or test-source changes were required in this run because the required workbench UI states, typed workflow mutations, gates, audit writes and no-leakage tests are already present. This slice did not create autonomous advice, client release, export generation, compliance release or advisor-approval-as-release.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ALREADY_PRESENT_WITH_CURRENT_PROOF`

Reason: the repo already has internal analyst workbench surfaces, typed recommendation-review actions, AI draft/internal-rationale visibility blockers, evidence-scoped rebuild enforcement, advisor handoff without release, wrong-role fail-closed behavior, audit persistence and route-smoke proof.

## Changed Files

| File | Change |
| --- | --- |
| `V0_96_WP04_ANALYST_WORKBENCH_AI_DRAFT_INTERNAL_REVIEW_REPORT.md` | Added the WP-04 execution report with repo-local prompt source, current classification and current proof. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updated WP-04 from baseline `PARTIAL` to current accepted proof status. |

No application code or test source was changed for WP-04 in this execution. The implementation files listed below were inspected and validated as already present.

## Inspected Files

- `components/internal-workflow-screen.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/demo-workflow-validation.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/export-service.ts`
- `lib/permission-engine.ts`
- `lib/audit-service.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/route-smoke.spec.ts`

## Acceptance Results

| Criterion | Result |
| --- | --- |
| AI/rules draft stays internal-only and cannot become client-visible advice | `PASS` |
| Unsupported claim rejection blocks advisor/release path and records audit | `PASS` |
| Rebuild requires accepted evidence scoped to the same recommendation | `PASS` |
| Request evidence persists reason and keeps release/client visibility blocked | `PASS` |
| Advisor approval remains separate from compliance release and client visibility | `PASS` |
| Wrong role, wrong action and wrong object fail closed without mutation/release | `PASS` |
| Client projection and export exclude AI draft/internal rationale payloads | `PASS` |
| Workbench/detail routes expose blocked/recovery CTA state without overclaim | `PASS` |

## Workflow Notes

The current typed recommendation-review actions are:

- `submit_review`
- `reject_unsupported_claim`
- `rebuild_with_evidence`
- `advisor_approve`
- `compliance_release`
- `compliance_block`
- `request_evidence`

For WP-04, the accepted analyst path is intentionally pre-release:

1. Analyst reviews the internal draft.
2. Unsupported claims can be rejected and mark the recommendation as revision requested.
3. Rebuild is allowed only with accepted, scoped evidence.
4. The reviewed draft can move toward advisor review.
5. Client visibility remains false until advisor, compliance, evidence, permission, payload and audit gates align.

## Proof

Focused proof for this slice:

- `pnpm test:workflow-gate` -> `PASS` 13/13
- `pnpm test:workflow-api` -> `PASS` 15/15
- `pnpm playwright test tests/true-ux-p0-safety.spec.ts` -> `PASS` 9/9
- `pnpm playwright test tests/true-ux-client-projection.spec.ts` -> `PASS` 9/9
- `pnpm playwright test tests/true-ux-cta-state.spec.ts` -> `PASS` 9/9
- `pnpm playwright test tests/true-ux-density.spec.ts` -> `PASS` 8/8
- `pnpm test:export-safety` -> `PASS` 3/3
- `pnpm test:permissions` -> `PASS` 8/8
- `pnpm test:route-smoke` -> `PASS` 315/315
- `pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts` -> `PASS` 3/3

Static safety proof:

- `pnpm typecheck` -> `PASS`
- `pnpm lint` -> `PASS` with 0 errors and 30 pre-existing warnings

## Screenshot

No new screenshot was required in this execution because no visible layout or product code changed. Route-smoke proof covers the visible internal draft route state.

## Deviations

- The visible advisor detail route currently exposes rebuild as a held/static control note while the typed API enforces the real evidence-scoped rebuild. This is acceptable for WP-04 because no app code changed and the safety boundary is explicitly visible.
- WP-04 does not complete WP-05 advisor queue acceptance, WP-06 compliance decision-room acceptance, WP-07 client projection acceptance, or WP-10 export UX acceptance. Those remain separate work packages.

## Next Recommended Work Package

Proceed to `WP-05 — Advisor Queue + Approval Detail`.
