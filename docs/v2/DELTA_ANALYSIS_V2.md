# Delta Analysis v2

Date: 2026-06-14

## Summary

Current repo phase: Phase 1-3 implemented.
New phase to run: Phase 4 - UX Model Refactor and Visual Alignment.

The old implementation is route-complete but board-centered. v2 requires a route/screen/state model where visuals are interpreted as application UI plus separate specification material. Phase 4 must refactor the foundation and internal P0 routes without building Phase 5 client rebuild features.

## Route and Component Delta

| Route / Component | Current implementation | v2 requirement | Action |
|---|---|---|---|
| App shell | Uses `boardRoutes`, board numbers, "Wireframe click-dummy" framing. | Route inventory must map to v2 screen specs and visuals. | Refactor nav to v2 route model. |
| `lib/routes.ts` | Legacy board metadata and old reference images. | v2 route inventory should reference V2 visual IDs and route purpose. | Keep for legacy screens, add v2 model as source for shell/gates. |
| `lib/status.ts` | Workflow badge/tone types only. | State chips and workflow badges must connect to blocked/released states. | Keep, consume from v2 model. |
| `lib/workflows.ts` | Copy and Phase 2 boundary language. | Central workflow logic, no-unapproved-advice gate, evidence/audit helpers. | Add `lib/v2-model.ts`; update language. |
| `/mobile` | Mobile action UI plus rendered board annotation areas. | V2-001/V2-002/V2-003/V2-009 app phone UI only. | Preserve for Phase 5; remove obvious Phase 3 framing where low-risk. |
| `/mobile/upload` | Three phone states, low-confidence toggle. | V2-004 to V2-008 state machine and evidence/audit events. | Preserve for Phase 5; gate model added now. |
| `/portal` | Dashboard metrics and click path. | V2-010 to V2-012 dashboard plus state handling. | Preserve for Phase 5; route mapping added now. |
| `/wealth-map` | Graph/drawer prototype. | V2-013 to V2-016 graph, drawer, restricted node, escalation. | Preserve; central permission helper added now. |
| `/actions` | Kanban and detail drawer. | V2-017 to V2-019 missing-evidence blocked states. | Preserve; central evidence helper added now. |
| `/decisions` | Client decision updates local state. | V2-020 to V2-022 must link decision, audit, evidence and permission gate. | Preserve; central release/evidence helpers added now. |
| `/evidence` | Evidence list/detail prototype. | V2-023 to V2-025 must model restricted/missing evidence. | Preserve; central permission/evidence helpers added now. |
| `/signals` | Old Phase 3 route-specific screen. | V2-026/V2-027 internal trigger review. | Leave deeper rebuild to Phase 6; include v2 mapping. |
| `/workbench` | Generic `BoardPage` with reference-image/dev QA chrome. | V2-028 to V2-030 internal queue and publish disabled gate. | Replace with real internal UI foundation. |
| `/advisor-approval` | Generic `BoardPage`. | V2-031 to V2-033 approval actions and compliance-pending gate. | Replace with real gate UI foundation. |
| `/compliance` | Generic `BoardPage`. | V2-034 to V2-037 release/block/request-evidence/audit. | Replace with real gate UI foundation. |
| `/governance` | Generic `BoardPage`. | V2-038 to V2-042 matrix, drawer, second confirmation, audit history. | Replace with real permission UI foundation. |
| `/communication` | Generic `BoardPage`. | V2-044 to V2-047 decision tree, client preview, gated send, evidence log. | Replace with scoped gated communication foundation. |
| `/journey` | Generic legacy board page. | V2 service blueprint visuals are reference-only. | Convert to concise internal service model summary, not board recreation. |
| `/roadmap` | Generic legacy board page. | V2 planning visuals are reference-only/scope control. | Convert to scope-control route, not product UI. |
| `BoardPage` / `BoardShell` | Renders board number, annotations, dev QA reference image, phase checklist. | Product-board pages are not acceptable as primary UI. | Stop using for Phase 4 routes; leave legacy component for historical reference until later cleanup. |
| `RightAnnotationPanel` | Renders user role/action/reaction/outcome. | Annotation content should become docs/logic/tests, not app chrome. | Avoid on newly refactored screens. |
| Tests | None configured. | Minimum tests for route mapping, permission, no-unapproved-advice, evidence/audit. | Add lightweight Node test for central model. |

## Visual Interpretation Decisions

- Implementable UI regions: mobile phone frames, dashboard app frames, internal queue tables, drawers, modals, permission matrices, message previews, state banners.
- Do not render: title blocks, file names, route labels, source board labels, callout numbers, annotation legends, key-zone panels, dev handoff notes, QA notes, visual metadata.
- Reference-only: V2-043 and V2-048 through V2-056 inform route model, gates, permissions, state machines, evidence/audit mapping and scope control.

## Permission Impact

The current repo lacks a central permission helper. Phase 4 must introduce a role/action/object model that can deny sensitive actions server-side in future and currently blocks UI release/send/publish states.

## State Impact

The current repo has badges but not transition logic. Phase 4 must introduce recommendation/communication/access/evidence states and blocked transition helpers.

## Evidence Impact

The current repo displays evidence, but actions do not create structured evidence/audit events. Phase 4 must add helpers and use them in internal screens/tests as the foundation for later real persistence.

## No-Unapproved-Advice Impact

Current copy says the rule; central logic must enforce it. Advisor approval alone must not make output client-visible. Required release conditions are advisor approval, compliance release, evidence record, permission check, and released client visibility state.

## Recommended Action

Proceed with a Phase 4 foundation refactor:

1. Add central v2 route, permission, state, release, evidence and audit model.
2. Update app shell to use v2 route metadata.
3. Replace generic internal board pages with gate-focused UI.
4. Add central-model tests.
5. Record remaining Phase 5/6/7 work in QA.
