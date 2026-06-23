# AlphaVest V1.0 WP-04 AI Draft Guard Report

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

WP-04 proves that AI/rules drafts, assumptions, internal rationale and compliance notes remain internal until downstream gates pass. No model call was introduced, no route scope changed, no Prisma model was added, and no client-visible advice path was created.

## Task Status

| Task | Status | Notes |
|---|---|---|
| `V10-WP04-T01` AI Draft internal-only field handling | `HARDENED` | `assumptionsJson` is now explicitly classified as `INTERNAL_RATIONALE` for export inspection instead of falling through as a generic hidden field. Client projection tests assert it stays hidden. |
| `V10-WP04-T02` Analyst review states | `ALREADY_PRESENT_VERIFIED` | Existing recommendation review workflow supports `reject_unsupported_claim`, keeps client visibility false, sets revision/evidence-needed state and audits the blocked review action. |
| `V10-WP04-T03` Draft reject/rebuild with evidence | `ALREADY_PRESENT_VERIFIED` | Existing `rebuild_with_evidence` requires accepted evidence scoped to the recommendation and leaves the rebuilt draft internal-only until advisor and compliance gates pass. |
| `V10-WP04-T04` AI leakage negative tests | `HARDENED` | Client projection, export safety and P0 safety tests now explicitly cover AI draft, assumptions, internal rationale and compliance notes. |

## Changed Files

- `lib/export-service.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `V1_0_WP04_AI_DRAFT_GUARD_REPORT.md`

## Inspected Files

- `components/internal-workflow-screen.tsx`
- `lib/control-layer/client-visibility.ts`
- `lib/control-layer/export-safety.ts`
- `lib/control-layer/visibility-projection.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/demo-workflow-validation.ts`
- `lib/domain-types.ts`
- `lib/export-service.ts`
- `lib/internal-workflow-demo-data.ts`
- `lib/visibility-engine.ts`
- `lib/workflow-gate.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/client-visibility-projection.spec.ts tests/export-safety.spec.ts tests/true-ux-client-projection.spec.ts tests/true-ux-p0-safety.spec.ts tests/demo-workflow-api.spec.ts` | PASS, 37 passed |
| `pnpm phase:check` | PASS with existing warnings |

## Known Warnings

- Existing lint warnings remain for unused UI helpers and capture helpers.
- Existing build warnings remain for custom Babel config and broad `document-storage-adapter` tracing.

## Method Artifacts

- V2 Discover: Internal workflow, projection, export, gate and demo mutation paths were inspected before edits.
- V2 Define: The boundary is internal-only AI/rules draft handling and negative leakage proof, not real AI invocation or new persistence models.
- V2 Develop: The hardening classifies assumptions as internal rationale in export safety and expands client/export negative tests.
- V2 Deliver: WP-04 remains phase-scoped and commit-ready after validation.
- V3 proof path: Safe branches show internal roles and review/rebuild workflow can handle drafts; killed branches prove client projection/export cannot carry AI draft, assumptions, rationale or compliance notes.
- Ethics and fairness: The implementation does not let AI-generated or unsupported advice reach clients without human review, evidence and compliance controls.

## Verdict

`WP04_READY`.

AI draft and internal reasoning fields are explicitly guarded across projection and export proof. Next package after green validation: `WP-05`.
