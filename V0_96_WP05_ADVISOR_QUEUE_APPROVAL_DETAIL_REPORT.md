# V0.96 WP-05 Advisor Queue and Approval Detail Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP05_ADVISOR_QUEUE_APPROVAL_DETAIL_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_WITH_TARGETED_MICROCOPY_HARDENING_AND_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-05 asked for the advisor queue and approval detail to behave as a precise human-review gate: a senior wealth advisor can review the package, inspect evidence/rationale context and approve as advisor, but this must never release to client, create client visibility, approve export or bypass compliance.

This execution refreshed proof against the WP-05 deep prompt and made targeted product/UI hardening changes: advisor approval copy now uses the explicit WP-05 language `Approve as advisor` and `Advisor approval saved. Waiting for compliance release.`, and the advisor detail no longer labels a non-release escalation path as an advisor-owned reject action. No route, schema, API or workflow-gate changes were required because the underlying advisor queue/detail surfaces, typed workflow mutation, audit writes, RBAC checks and no-leakage tests were already present.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ACCEPTED_WITH_TARGETED_MICROCOPY_HARDENING_AND_CURRENT_PROOF`

Reason: the repo already has routes `036 /advisor/reviews` and `037 /advisor/reviews/:id`, searchable advisor queue behavior, advisor detail evidence/rationale/review context, typed `advisor_approve` mutation, audit persistence, advisor-not-release gates, wrong-role/admin non-bypass checks, client projection safety and export safety. WP-05 needed microcopy alignment, advisor escalation wording hardening and current proof refresh.

## Changed Files

| File | Change |
| --- | --- |
| `components/internal-workflow-screen.tsx` | Changed advisor approval CTA/detail action copy to `Approve as advisor`, success copy to `Advisor approval saved. Waiting for compliance release.`, advisor escalation copy to `Escalate advisor review call`, and static ownership labels for analyst rebuild/compliance evidence request. |
| `tests/route-smoke.spec.ts` | Updated the advisor detail route assertion to the WP-05 approval CTA copy and real advisor escalation/ownership labels. |
| `tests/button-cta-lifecycle-pruning.spec.ts` | Updated static CTA pruning proof to the analyst-owned rebuild label. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP06_COMPLIANCE_DECISION_ROOM_DEEP_TASK_DESCRIPTION.md` | Added the WP-06 upload as repo-local companion material. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_DEEP_TASK_DESCRIPTION.md` | Added the WP-07 upload as repo-local companion material. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP08_AUDIT_SURFACE_PERSISTENCE_UI_DEEP_TASK_DESCRIPTION.md` | Added the WP-08 upload as repo-local companion material. |
| `docs/v0-96/uploads/ALPHAVEST_V0_96_WP09_GOVERNANCE_ADMIN_NON_BYPASS_UX_DEEP_TASK_DESCRIPTION.md` | Added the WP-09 upload as repo-local companion material. |
| `docs/v0-96/uploads/README.md` | Registered WP-06 through WP-09 uploads with SHA-256 hashes. |
| `V0_96_WP05_ADVISOR_QUEUE_APPROVAL_DETAIL_REPORT.md` | Added the WP-05 execution report with classification and proof. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updated WP-05 from baseline `PARTIAL` to current accepted proof status. |

## Reality Classification

| Requirement | Classification |
| --- | --- |
| Advisor queue renders current items and supports selection/open detail | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Advisor detail shows evidence summary, internal rationale, risk/alternatives and current gate | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Approve action exists and is guarded | `ACCEPTED_WITH_CURRENT_PROOF`; approve is typed, advisor-owned and non-release |
| Reject/request-change action ownership | `DEFERRED_NOT_ACCEPTED_AS_WP05`; reject unsupported claim is analyst-owned and request-evidence is compliance-owned in the current state machine, so WP05 does not count those as fulfilled advisor actions |
| Advisor approval moves to compliance-pending only | `ACCEPTED_WITH_CURRENT_PROOF` |
| Advisor action writes/preserves audit expectation | `ACCEPTED_WITH_CURRENT_PROOF` |
| Advisor comments/internal rationale remain internal-only | `ACCEPTED_WITH_CURRENT_PROOF` |
| Client portal/mobile/export remains hidden/redacted after advisor approval | `ACCEPTED_WITH_CURRENT_PROOF` |
| Advisor queue/detail obey one-primary-CTA and density/page-type rules | `ACCEPTED_WITH_CURRENT_PROOF` |
| Tests prove advisor-not-release and wrong-role denial | `ACCEPTED_WITH_CURRENT_PROOF` |

## Refactor-First Proof Addendum

Catch-up artefact: `V0_96_REFACTOR_FIRST_COMPLIANCE_AUDIT_WP01_WP05.md`

Real implementation paths inspected for WP05:

- `components/internal-workflow-screen.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/demo-workflow-validation.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/route-smoke.spec.ts`

Refactor-first decision:

- Implemented real UI/test hardening where feasible: the advisor detail action now names the actual advisor-owned escalation behavior instead of presenting it as a reject action.
- Did not add advisor-owned `reject_unsupported_claim` or `request_evidence` actions because current state-machine ownership makes `reject_unsupported_claim` analyst-owned and `request_evidence` compliance-owned. Wiring those through advisor UI would create a hidden shortcut and role-boundary mismatch.
- Broader reject/request-change lifecycle is therefore explicitly not accepted under WP05. WP06 owns compliance request-evidence/block/release UI; WP11 may own shared reason-modal primitives; WP12 owns final no-overclaim copy sweep.

## Inspected Files

- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP05_ADVISOR_QUEUE_APPROVAL_DETAIL_DEEP_TASK_DESCRIPTION.md`
- `lib/route-registry.ts`
- `lib/navigation.ts`
- `lib/ux-route-policy.ts`
- `components/internal-workflow-screen.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/demo-workflow-validation.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/export-service.ts`
- `lib/audit-service.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/route-smoke.spec.ts`

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Advisor queue route renders as advisor gate, not route catalogue | `PASS` |
| Advisor queue search/filter/row action opens advisor detail | `PASS` |
| Advisor detail shows package, evidence, rationale, gate and no-release context | `PASS` |
| Scoped advisor approval persists approval and moves only to compliance pending | `PASS` |
| Advisor approval does not set client visibility, compliance release, export approval, download or share | `PASS` |
| Advisor approval writes audit event through the workflow API | `PASS` |
| Wrong role/admin/client principal cannot bypass advisor/compliance/release gates | `PASS` |
| Internal rationale, AI draft and advisor-internal payload remain excluded from client/export paths | `PASS` |
| Advisor copy does not imply released, published, sent to client or client-ready state | `PASS` |

## Proof

Focused proof for this slice:

- `pnpm test:workflow-gate` -> `PASS` 13/13
- `pnpm test:workflow-api` -> `PASS` 15/15
- `pnpm test:permissions` -> `PASS` 8/8
- `pnpm playwright test tests/true-ux-p0-safety.spec.ts` -> `PASS` 9/9
- `pnpm playwright test tests/true-ux-client-projection.spec.ts` -> `PASS` 9/9
- `pnpm test:export-safety` -> `PASS` 3/3
- `pnpm test:file-export` -> `PASS` 14/14
- `pnpm test:governance-non-bypass` -> `PASS` 3/3
- `pnpm playwright test tests/true-ux-cta-state.spec.ts` -> `PASS` 9/9
- `pnpm playwright test tests/true-ux-density.spec.ts` -> `PASS` 8/8
- `pnpm playwright test tests/p0-acceptance.spec.ts` -> `PASS` 15/15
- `pnpm test:route-smoke` -> `PASS` 315/315
- `pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts` -> `PASS` 3/3

Static safety proof:

- `pnpm typecheck` -> `PASS`
- `pnpm lint` -> `PASS` with 0 errors and 30 pre-existing warnings

Refactor-first catch-up proof:

- `pnpm playwright test tests/route-smoke.spec.ts --grep "advisor detail exposes escalation"` -> `PASS` 1/1
- `pnpm playwright test tests/button-cta-lifecycle-pruning.spec.ts` -> `PASS` 4/4
- `pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts` -> `PASS` 3/3
- `pnpm typecheck` -> `PASS`
- `pnpm lint` -> `PASS` with 0 errors and 30 pre-existing warnings

## Upload Intake

WP-06 through WP-09 prompts were copied from `/Users/chris/Downloads` into `docs/v0-96/uploads/` and registered in `docs/v0-96/uploads/README.md` with these SHA-256 hashes:

- WP-06: `dd6fe3c5c0cdf9cfb94ce2c2d8a261151631e2e7263823ddfa37567105592a30`
- WP-07: `7d0486650b33b5249c7a96a63682dd3ce59d479c0a2820a9c933ddfe41e334d1`
- WP-08: `54bdbae5dd32eb66f9a82284eab491c3fb083dd71c717c3766b41f737f9306c2`
- WP-09: `e07601643785200b7d428af9185f2d36b8ba68a35ef086d55c6a5885673e70ac`

## Screenshot

No new screenshot was required beyond route-smoke UI proof because this slice changed only advisor safety microcopy and did not alter layout structure.

## Deviations

- WP-05 did not implement compliance release/block/request-evidence behavior because WP-06 owns compliance decision-room acceptance.
- WP-05 did not implement client projection beyond no-leakage proof because WP-07 owns final client-safe projection acceptance.
- WP-05 did not implement export approval/download/share behavior because WP-10 owns export UX acceptance.
- Advisor reject/request-change is not accepted as complete in WP-05. Existing analyst/compliance actions remain safe and non-release, but advisor-owned reject/request-change would require an authorized state-machine/product decision; compliance request-evidence/block belongs to WP-06, persisted audit UI to WP-08, shared reason-modal lifecycle to WP-11 and copy/no-overclaim sweep to WP-12.

## Next Recommended Work Package

Proceed to `WP-06 — Compliance Decision Room`.
