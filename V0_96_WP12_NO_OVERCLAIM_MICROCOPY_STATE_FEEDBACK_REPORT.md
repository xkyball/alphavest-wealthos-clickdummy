# V0.96 WP-12 No-Overclaim Microcopy + State Feedback Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**WP:** `WP-12 — No-Overclaim Microcopy + State Feedback`  
**Status:** `ACCEPTED_WITH_NO_OVERCLAIM_COPY_STATE_FEEDBACK_HARDENING_AND_CURRENT_PROOF`

## Scope

WP-12 hardens copy and feedback as a safety control layer. The slice does not perform a broad brand rewrite, legal disclaimer rewrite, route expansion, schema migration, API creation, visual asset generation or screen redesign.

The implementation focus is:

- Expand the canonical no-overclaim copy vocabulary.
- Mark status/workflow badges as visual summaries, not gate proof.
- Sharpen ambiguous labels that could imply downstream client visibility or evidence sufficiency.
- Add focused tests for safe vocabulary, state-source metadata and route-label copy.
- Add WP15/WP16 prompt artefacts to the repo-local V0.96 upload bundle.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short` | Dirty working tree with prior WP08-WP11 tracked changes, reports, tests and V0.96 upload files; preserved as in-progress work. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| `git diff --stat` | Existing WP08-WP11 tracked changes present before WP12; WP12 adds upload files, copy vocabulary, badge metadata, targeted label changes, report, register update and focused tests. |
| `package.json` | Scripts available for `typecheck`, `lint`, route smoke, UI-state/copy and focused Playwright specs. |

## Upload Intake

| File | Status |
| --- | --- |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP15_P0_TRUE_UX_ACCEPTANCE_SUITE_DEEP_TASK_DESCRIPTION.md` | Added from `/Users/chris/Downloads`; SHA-256 recorded in upload README. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP16_RELEASE_EVIDENCE_HANDOFF_UPDATE_DEEP_TASK_DESCRIPTION.md` | Added from `/Users/chris/Downloads`; SHA-256 recorded in upload README. |

## Reality Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| No-overclaim copy map | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `lib/no-overclaim-copy.ts` now covers upload, evidence, AI draft, advisor, compliance, client-safe, audit, admin, export and download/share boundaries. |
| Upload/evidence copy | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Existing document upload and state boundary tests already separate upload/intake from evidence sufficiency; WP12 adds central vocabulary. |
| Advisor/compliance copy | `ACCEPTED_WITH_TARGETED_LABEL_HARDENING` | Existing workflow tests guard advisor-not-release and compliance-not-client-acceptance; WP12 changes compliance wording from "Evidence complete/completeness" to "Evidence review complete/state" on the touched surface. |
| Client-safe copy | `ACCEPTED_WITH_TARGETED_LABEL_HARDENING` | Existing projection tests guard internal payload leakage; WP12 changes ambiguous "Client visible" shortcuts to "Client-safe available/blocked/visible" on touched route/support metrics. |
| Audit/export/admin copy | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | WP08-WP11 already introduced audit source-state, export lifecycle and governance non-bypass copy; WP12 centralizes matching safe copy categories. |
| Status/workflow badges | `PARTIAL_BEFORE_SLICE`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `StatusChip` and `WorkflowBadge` now expose `data-ux-gate-proof="false"` and state-source metadata; workflow defaults for advisor/evidence/compliance are safer. |
| Tests | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | `tests/true-ux-no-overclaim-copy.spec.ts` adds WP12 vocabulary, badge-proof and route-label assertions; existing `ui-state-boundaries` assertions were updated. |

## Changed Files

| File | Change |
| --- | --- |
| `lib/no-overclaim-copy.ts` | Expanded canonical copy vocabulary and boundary order for WP12 feedback categories. |
| `components/ui/badge.tsx` | Allows standard span attributes so badge wrappers can carry state-source/gate-proof metadata. |
| `components/ui/status-chip.tsx` | Adds `sourceDescription`, `data-ux-gate-proof="false"` and accessible state-source metadata. |
| `components/ui/workflow-badge.tsx` | Adds `sourceDescription`, `data-ux-gate-proof="false"` and safer default labels for advisor/evidence/compliance states. |
| `components/demo-session-panel.tsx` | Changes ambiguous client visibility label to client-safe available/blocked. |
| `components/internal-workflow-screen.tsx` | Changes compliance evidence wording to evidence review state/complete rather than generic evidence complete/completeness. |
| `components/wealth-actions-screen.tsx` | Changes support metric label to client-safe visible and release-controlled copy. |
| `components/committee-review-screen.tsx` | Changes support metric label to client-safe visible and release-gate copy. |
| `components/review-monitoring-screen.tsx` | Changes monitoring detail/metrics from raw client visibility and evidence sufficiency shortcuts to client-safe/evidence-review language. |
| `components/admin-tenant-setup-screen.tsx` | Changes admin permission copy from marking evidence sufficient to evidence review completion. |
| `components/client-intake-screen.tsx` | Changes document hub split copy from marking evidence sufficient to evidence review completion. |
| `components/decisions-governance-screen.tsx` | Changes decision/governance drawer and confirmation copy from evidence sufficiency claims to evidence review completion boundaries. |
| `lib/product-guidance.ts` | Changes evidence workspace blocked-reason copy from proof of sufficiency to evidence readiness. |
| `lib/evidence-service.ts` | Changes service-facing status label to evidence ready for scoped gate. |
| `lib/ui-demo-data.ts` | Changes demo visibility text from raw client visible to client-safe after release. |
| `tests/ui-state-boundaries.spec.ts` | Updates canonical copy assertions for expanded WP12 vocabulary. |
| `tests/true-ux-no-overclaim-copy.spec.ts` | Adds focused WP12 tests. |
| `tests/state-copy-cleanup.spec.ts` | Aligns document upload state assertions with current no-overclaim upload/review copy. |
| `tests/route-smoke.spec.ts` | Aligns governance drawer no-overclaim expectation with evidence review completion copy. |
| `tests/true-ux-governance-non-bypass.spec.ts` | Aligns governance non-bypass assertions with evidence review completion copy. |
| `tests/modal-lifecycle-hardening.spec.ts` | Aligns modal lifecycle assertion with evidence review completion copy. |
| `tests/evidence-drawer-lifecycle.spec.ts` | Aligns evidence drawer assertion with evidence review completion copy. |
| `docs/v0-96/uploads/README.md` | Adds WP15/WP16 upload entries and checksums. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updates WP12 reality/classification. |
| `V0_96_WP12_NO_OVERCLAIM_MICROCOPY_STATE_FEEDBACK_REPORT.md` | Adds this report. |

## Inspected Files

| File | Why inspected |
| --- | --- |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative authority, preflight and safety boundaries. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP12_NO_OVERCLAIM_MICROCOPY_STATE_FEEDBACK_DEEP_TASK_DESCRIPTION.md` | WP12 task contract. |
| `lib/no-overclaim-copy.ts` | Existing copy vocabulary and implementation target. |
| `components/ui/status-chip.tsx` | Status chip proof/metadata gap. |
| `components/ui/workflow-badge.tsx` | Workflow badge proof/metadata and unsafe default label review. |
| `components/demo-session-panel.tsx` | Client-safe state label review. |
| `components/internal-workflow-screen.tsx` | Compliance/evidence review wording. |
| `components/wealth-actions-screen.tsx` | Support metric client visibility wording. |
| `components/committee-review-screen.tsx` | Support metric client visibility wording. |
| `components/review-monitoring-screen.tsx` | Monitoring copy using raw client-visible/evidence-sufficiency shortcuts. |
| `components/admin-tenant-setup-screen.tsx` | Admin permission copy using evidence-sufficiency shortcut. |
| `components/client-intake-screen.tsx` | Document hub copy using evidence-sufficiency shortcut. |
| `components/decisions-governance-screen.tsx` | Governance/decision copy using evidence-sufficiency shortcut. |
| `lib/product-guidance.ts` | Route guidance blocked-reason copy. |
| `lib/evidence-service.ts` | Evidence status label copy. |
| `lib/ui-demo-data.ts` | Demo visibility label copy. |
| `tests/ui-state-boundaries.spec.ts` | Existing no-overclaim test coverage. |
| `tests/state-copy-cleanup.spec.ts` | Existing copy cleanup conventions. |
| `tests/demo-session-panel-copy.spec.ts` | Existing demo/context copy conventions. |
| `tests/mvp-support-copy-cleanup.spec.ts` | Existing support-copy conventions. |

## Refactor-First Proof

- This was a real implementation slice, not only a report.
- Existing copy tests and no-overclaim attributes were reused instead of duplicated.
- The canonical vocabulary was expanded centrally rather than hardcoding every phrase into route components.
- Badge primitives now explicitly state that chips are summaries, not gate proof.
- Route copy was changed only where wording could imply downstream client visibility or evidence sufficiency.

## Acceptance Results

| Acceptance | Result |
| --- | --- |
| Upload/evidence vocabulary distinguishes upload, review, insufficiency and sufficiency-after-review | `ACCEPTED` |
| AI/rules draft vocabulary remains internal-only | `ACCEPTED` |
| Advisor approval remains not release | `ACCEPTED` |
| Compliance release remains not client acceptance | `ACCEPTED` |
| Client-safe labels avoid raw "client visible" shortcuts | `ACCEPTED` |
| Audit display/unavailable copy separates display from persistence | `ACCEPTED` |
| Admin non-bypass copy is central | `ACCEPTED` |
| Export preview/approval/download/share copy remains separated | `ACCEPTED` |
| Status/workflow badges are marked as visual summaries, not gate proof | `ACCEPTED` |
| Broad copy/brand rewrite | `OUT_OF_SCOPE_NOT_IMPLEMENTED` |
| New API/schema work | `OUT_OF_SCOPE_NOT_IMPLEMENTED` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3065 pnpm playwright test tests/true-ux-no-overclaim-copy.spec.ts tests/ui-state-boundaries.spec.ts tests/state-copy-cleanup.spec.ts tests/demo-session-panel-copy.spec.ts tests/mvp-support-copy-cleanup.spec.ts --workers=1` | `PASS` — 22 passed |
| `PLAYWRIGHT_PORT=3064 pnpm playwright test tests/route-smoke.spec.ts --grep "UX-CTA disabled blocked recovery copy\|UX-CTA evidence upload and review chain\|UX-CTA export lifecycle separation\|UX-CTA governance admin non-bypass chain" --workers=1` | `PASS` — 26 passed |
| `PLAYWRIGHT_PORT=3066 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 29 pre-existing unused-symbol warnings. |

Validation note: an earlier parallel lint attempt failed with `ENOENT` because a simultaneous Playwright run cleaned `test-results`; rerunning lint alone passed. Earlier WP12/route-smoke retries also exposed live overclaim copy in governance and monitoring surfaces; the final implementation replaced those strings before the passing validation runs above.

## Deferred Boundaries

- API/service integration for UI truth remains WP13.
- Schema usage alignment remains WP14.
- P0/True-UX acceptance aggregation remains WP15.
- Release evidence/handoff update remains WP16.

## Next Recommended Work Package

Proceed to `WP-13 — API / Service Integration for UI Truth`.
