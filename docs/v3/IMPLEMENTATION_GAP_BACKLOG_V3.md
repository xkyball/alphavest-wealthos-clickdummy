# AlphaVest Implementation Gap Backlog V3

Generated: 2026-06-16T07:47:11+02:00  
Scope: backlog only. No implementation in this analysis run.

## Human Visual Implementation Addendum

For all future tickets that turn an ImageGen output, screen reference or visual mock into HTML/CSS/React/Tailwind UI, this backlog is governed by `WORKFLOW_COMPLETION_IMPLEMENTATION_PLAN_V3.md`.

Required visual implementation gates:

- Read the Human Visual Implementation Standard before `AGENTS.md` for visual implementation work:
  `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/`.
- Create an `implementation-map` before UI edits:
  `route -> component(s) -> state(s) -> role/tenant/context -> existing AlphaVest reference screenshot -> ImageGen visual -> source data/seed -> interaction shape -> expected assertion/proof -> verification status`.
- Capture a real AlphaVest app screenshot before ImageGen and pass it as the reference image.
- Treat ImageGen output as design reference only, not screenshot proof and not acceptance proof.
- DOM success is not design acceptance.
- End every visual implementation with screenshot proof and a Human Visual Review Rubric result.
- Label completion honestly as `implemented`, `partially implemented`, `visually reviewed`, `screenshot-proven`, `not verified`, `not scanned` or `blocked`.

Affected planning tickets are tracked in `WORKFLOW_COMPLETION_IMPLEMENTATION_PLAN_V3.md`, especially A-05, A-06, A-07, A-08, B-04 to B-07, C-04 to C-07, D-04 to D-07, E-02 to E-04, F-02 to F-04, G-04 to G-05 and H-04 to H-07.

## Prioritized Backlog

| Priority | Gap | Affected Workflow/Pageflow | Missing Input Mask? | Data Model Dependency | Permission/Evidence/Audit Dependency | Suggested Implementation Slice | Acceptance Criteria | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Compliance release/block is not a domain transaction. | W-09 / PF-F / J02 | IM-18 | `ComplianceReview`, `Recommendation`, `EvidenceRecord`, `AuditEvent` exist | must enforce advisor approval + evidence + permission + audit | Add `/api/demo-workflow` or server action for release/block/request-evidence with gate check. | release impossible unless gate passes; block/request evidence persists; audit row created; client visibility changes only on release | `workflow-gate.ts:28-60`, `PAGEFLOW...:88` |
| P0 | Client decision does not create persisted decision/evidence package. | W-10 / PF-F / J03 | IM-19, IM-20 | `Decision`, `DecisionParticipant`, `EvidenceRecord` exist | must only expose released content; audit submit | Add decision submit transaction after compliance release. | accept/defer/reject persists; success route reads DB; evidence package linked | `DATA_MODEL...:950-952` |
| P0 | Document upload/extraction review lacks real file/version/review writes. | W-06 / PF-D / J04 | IM-14, IM-15 | document pipeline models exist | upload/review audit; evidence link | Implement demo file upload metadata + version row + extraction correction review. | uploaded doc survives reload; extraction correction persists; verification status changes | `prisma/schema.prisma:691-772` |
| P0 | Tenant onboarding wizard does not create/update tenant/team/policy/invite. | W-02 / PF-B / J06 | IM-04 to IM-07 | tenant/user/role/policy models exist | tenant actions audited | Implement tenant create, team assignment, policy override and user invite mutations. | new tenant draft exists; owner/team/invite visible after reload; audit rows present | `USER_JOURNEY...:421-427` |
| P0 | Mutation wrapper for validation, tenant scope, audit and evidence is missing. | all stateful workflows | all | all existing models | central permission/evidence/audit wrapper | Create shared demo mutation service before expanding beyond J01. | every selected mutation validates tenant, state, permission, audit; tests cover failure paths | `permission-engine.ts:77-84`, `audit-service.ts:19-51` |
| P0 | Governance role/access/second-confirmation flow not persisted. | W-12 / PF-G / J07 | IM-21 | access/role/second confirmation models exist | SOD/second confirmation/audit | Implement invite, role change request and access approval transaction. | SOD conflict blocks; sensitive permission requires confirmation; audit history updates | `DATA_MODEL...:255`, `:309` |
| P0 | Export wizard is visual/gated but not generated/downloadable. | W-11 / PF-I / J08 | IM-23 | `ExportRequest` exists | redaction, approval, audit, expiry | Implement scoped export request lifecycle before real file packaging. | scope/redaction/approval/download states persist; blocked item cannot be included | `export-service.ts:14-68` |
| P0 | Role/tenant enforcement is permissive demo. | all client/internal boundaries | all | RBAC models exist | Phase 16 guard | Add demo role/tenant deny paths after core stateful slices. | forbidden role cannot release/export/access; audit logs denial | `permission-engine.ts:77-84` |
| P1 | Entity creation/action ready gate not persisted. | W-05 / PF-C / J05 | IM-13 | entity/action/evidence models exist | evidence completeness, audit | Add entity wizard and action readiness gate. | entity persists; ready blocked if docs/evidence missing | `USER_JOURNEY...:389-396` |
| P1 | Profile/family/relationship intake not persisted. | W-04 / PF-C / J09 | IM-10 to IM-12 | profile/family/relationship models exist | profile/family audit | Add profile submit, family member and relationship mutations. | profile submitted; family member/relationship visible after reload; conflicts tracked | `USER_JOURNEY...:514-520` |
| P1 | J01 lacks governed follow-through into evidence builder/compliance. | W-07/W-08 / PF-E | IM-16, IM-17, IM-20 | trigger/recommendation/approval/evidence exist | evidence builder, audit | Extend J01 to create evidence builder record and compliance handoff. | J01 end state has advisor-approved recommendation awaiting compliance with evidence ref | `app/api/demo-workflow/route.ts:259-407` |
| P1 | Communication escalation has no persisted message/call outcome. | W-13 / PF-H | IM-22 | message/call models exist | advice-sensitive content guard | Add message/call create demo actions. | message/call survives reload; advice-like content blocked from client | `prisma/schema.prisma:1053-1090` |
| P1 | Ops queues/SLA are read-only. | W-14 / PF-J | IM-24 | queue/data quality models exist | internal audit | Add queue assignment/status update. | queue item changes persist and audit if sensitive | `prisma/schema.prisma:1155` |
| P1 | Screencast J02-J10 use route hops rather than `continue` click-through. | J02-J10 | dependent on masks | existing fixtures | audit/evidence assertions | Convert one journey at a time after mutations exist. | each journey has required clicks, zero fallback, DB verification | JSON count: 69 goto, 4 continue |
| P2 | Page-level validation and error messages are inconsistent. | all forms | all | validation schemas missing | audit on invalid sensitive attempts optional | Add shared validation schema conventions. | required fields, messages, loading/error/blocked states consistent | `PAGE_SPECS_V3.md` |
| P2 | Demo data and UI display fields can drift. | all routes | no | seed + TS demo data | n/a | Move selected workflow data reads to Prisma-backed loaders. | stateful screens read DB fixture data where mutation is implemented | `lib/*-demo-data.ts`, `prisma/seed.ts` |
| P2 | Audit append-only semantics are modelled but not enforced. | all sensitive workflows | no | `AuditEvent` exists | append-only invariant | Add service and tests preventing update/delete in app code. | app mutation path only creates audit events | `DATA_MODEL...:757-773` |
| P2 | Evidence release/version semantics need hardening. | W-09/W-10/W-11 | IM-20 | evidence models exist | release visibility | Add evidence status transition service. | evidence cannot regress silently; release records actor/time | `DATA_MODEL...:720-753` |
| P3 | Reference/internal routes 061-063 need no workflow implementation. | PF-J | no | none | internal only | Keep as documentation/QA pages. | no product CTA claims from reference routes | `SCREEN_TO_TASK...:65-67` |
| P3 | Visual polish after statefulness may drift. | all screens | no | n/a | n/a | Re-run visual contract after each stateful UI slice and apply the Human Visual Implementation Standard for any ImageGen-to-UI or visual-reference implementation. | no forbidden chrome, route/asset coverage remains 63/63, implementation-map exists before UI edits, screenshot proof exists, Human Visual Review Rubric result is recorded, DOM success is not design acceptance | `DESIGN_IMPLEMENTATION...:29`, `WORKFLOW_COMPLETION_IMPLEMENTATION_PLAN_V3.md` |

## Dependency Order

1. Shared demo mutation wrapper.
2. J02 compliance release/block.
3. J03 client decision/evidence package.
4. J04 document upload/review.
5. J08 export lifecycle.
6. J07 governance access/second confirmation.
7. J06 tenant onboarding.
8. J05 entity/action gate.
9. J09 profile/family intake.
10. J13/J14 communication and ops support.

This order is safety-first: release, decision, evidence, export and governance gates carry the largest risk of misleading the demo or weakening the product rule.
