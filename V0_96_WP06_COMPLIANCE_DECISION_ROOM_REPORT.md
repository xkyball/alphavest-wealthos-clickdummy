# V0.96 WP-06 Compliance Decision Room Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP06_COMPLIANCE_DECISION_ROOM_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_WITH_DECISION_ROOM_REFACTOR_AND_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-06 asks compliance to be the real release-control room: advisor approval, evidence sufficiency, permission, audit persistence and client-safe projection consequences must be visible before any release path. Advisor approval, upload success, evidence existence, admin access and visible buttons must not act as release proof.

This execution implemented a targeted decision-room hardening in the current app surface and refreshed current proof. No new routes, schema, API endpoints or blind migrations were created because the current route registry, typed workflow API, permission engine, audit service, workflow gate and visibility engine already provide the mutation truth needed for WP-06.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ACCEPTED_WITH_DECISION_ROOM_REFACTOR_AND_CURRENT_PROOF`

Reason: the repo already had the compliance route family, typed `compliance_release`, `compliance_block` and `request_evidence` actions, audit persistence, wrong-role denial, admin non-bypass and client-safe projection tests. WP-06 still needed the decision-room UX to show explicit release preconditions, avoid an enabled release-looking control while gates fail, expose the safe next action, and prove request-evidence/block lifecycle behavior from the compliance room.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Baseline commit | `e8f1f76 docs(v0.96): record WP00-WP02 execution proofs` |
| Dirty worktree before WP-06 | Present; prior WP03-WP05/catch-up artefacts preserved and not reverted |
| Source hierarchy read | `AGENTS.md`, `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, WP-06 companion prompt |
| WP-06 treatment | Companion prompt under True-UX authority, not a replacement source of truth |

## Changed Files

| File | Change |
| --- | --- |
| `components/internal-workflow-screen.tsx` | Added compliance release precondition checklist; changed the failed-gate release affordance into a blocked status; made Request Evidence the one safe primary action; kept Keep Blocked available; added lifecycle/validation attributes and visible state panels to the compliance block/request-evidence confirmation modal; included compliance block/audit routes in the Compliance sidebar active-parent group. |
| `tests/route-smoke.spec.ts` | Added WP-06 route-smoke assertions for decision-room preconditions, one primary CTA, blocked release status and request-evidence modal validation lifecycle. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updated the WP-06 row and UX/IA risk family from baseline `PARTIAL` to current accepted proof status. |
| `V0_96_WP06_COMPLIANCE_DECISION_ROOM_REPORT.md` | Added this WP-06 execution report. |

## Inspected Files

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP06_COMPLIANCE_DECISION_ROOM_DEEP_TASK_DESCRIPTION.md`
- `V0_96_REFACTOR_FIRST_COMPLIANCE_AUDIT_WP01_WP05.md`
- `V0_96_UX_IA_DELTA_REGISTER.md`
- `lib/route-registry.ts`
- `lib/navigation.ts`
- `app/[...segments]/page.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/demo-workflow-validation.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/evidence-service.ts`
- `lib/audit-service.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/v0-96-ux-ia-delta-register.spec.ts`

## Reality Classification

| Requirement | Classification |
| --- | --- |
| Compliance queue route and row action open decision-room detail | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Decision room shows package, advisor approval state, evidence, permission, audit and client-safe consequence | `ACCEPTED_WITH_TARGETED_UI_REFACTOR_AND_CURRENT_PROOF` |
| Release remains blocked until all preconditions pass | `ACCEPTED_WITH_CURRENT_PROOF` |
| Advisor approval alone cannot release or make client content visible | `ACCEPTED_WITH_CURRENT_PROOF` |
| Upload/evidence existence alone cannot release | `ACCEPTED_WITH_CURRENT_PROOF` |
| Request evidence and block have reason/confirmation lifecycle | `ACCEPTED_WITH_TARGETED_UI_REFACTOR_AND_CURRENT_PROOF` |
| Compliance release modal lifecycle | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Audit persistence or fail-closed behavior | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Wrong role/admin non-bypass | `ALREADY_PRESENT_WITH_CURRENT_PROOF` |
| Client-safe projection/no internal payload leakage | `ALREADY_PRESENT_WITH_CURRENT_PROOF`; final decision-record projection remains WP-07 |
| Export/download/share separation | `BOUNDARY_PROVEN_FOR_WP06`; full export UX remains WP-10 |

## Refactor-First Proof

Real implementation was performed in the compliance UI and route-smoke proof. This was not accepted as a report-only slice.

No new API, service, schema or route was added because the inspected implementation already has:

- Typed `compliance_release`, `compliance_block` and `request_evidence` workflow actions.
- Workflow gate checks for advisor approval, scoped sufficient evidence, client-safe payload, permission and audit persistence.
- Permission-engine negatives for non-compliance roles, admin non-bypass and object scope.
- Audit service fail-closed behavior for required audit persistence.
- Visibility engine and client projection tests that exclude AI Drafts, internal rationale, compliance notes, raw/unreleased evidence and internal audit payloads from client/export paths.

The accepted WP-06 implementation is therefore a targeted refactor-first hardening of the decision-room UX and its lifecycle proof. It deliberately does not claim completion of WP-07, WP-08, WP-10, WP-11, WP-12, WP-14, WP-15 or WP-16.

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Compliance decision room exposes release preconditions | `PASS` |
| Failed-gate release control is non-interactive and explicitly blocked | `PASS` |
| Decision room exposes one safe primary action for insufficient evidence | `PASS` |
| Request Evidence opens a labelled confirmation lifecycle | `PASS` |
| Invalid request-evidence input remains blocked and does not call workflow API | `PASS` |
| Valid request-evidence input can submit through audited workflow lifecycle | `PASS` |
| Compliance block records reason and keeps client visibility false | `PASS` |
| Compliance release fails before prerequisites and persists only after gates pass | `PASS` |
| Wrong role, wrong action and wrong object fail closed | `PASS` |
| Admin/security roles cannot force evidence sufficiency, release, export or internal payload visibility | `PASS` |
| Client portal/export projections remain safe before and after release | `PASS` |
| UI copy does not imply client acceptance or export approval from compliance release | `PASS` |

## Proof

Focused proof for this slice:

- `pnpm playwright test tests/confirmation-lifecycle.spec.ts` -> `PASS` 4/4
- `pnpm typecheck` -> `PASS`
- `pnpm playwright test tests/route-smoke.spec.ts --grep "V0.96 WP-06"` -> `PASS` 2/2 after serial rerun
- `pnpm test:workflow-gate` -> `PASS` 13/13
- `pnpm test:workflow-api` -> `PASS` 15/15
- `pnpm test:permissions` -> `PASS` 8/8
- `pnpm playwright test tests/true-ux-p0-safety.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-client-projection.spec.ts tests/governance-non-bypass.spec.ts tests/v0-96-ux-ia-delta-register.spec.ts` -> `PASS` 33/33

Transient validation note:

- The first focused WP-06 route-smoke run attempted to start Playwright in parallel and hit `EADDRINUSE 127.0.0.1:3020`; a serial rerun passed. No application failure was observed.

## Deferred Boundaries

- WP-07 still owns final decision-record and client-safe projection acceptance beyond the WP-06 release boundary.
- WP-08 still owns persisted audit surface UI acceptance.
- WP-10 still owns export scope/redaction/approval/download/share UX acceptance.
- WP-11 still owns shared interaction primitive consolidation beyond the touched modal lifecycle.
- WP-12 still owns the full no-overclaim copy/state sweep across all later touched surfaces.
- WP-14 still owns schema usage alignment if later evidence shows schema drift; WP-06 did not authorize blind schema changes.
- WP-15 still owns aggregate P0/True-UX acceptance.
- WP-16 still owns final release evidence and handoff update.

## Next Recommended Work Package

Proceed to `WP-07 - Decision Record + Client-Safe Projection`.
