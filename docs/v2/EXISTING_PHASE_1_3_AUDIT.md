# Existing Phase 1-3 Audit

Date: 2026-06-14

## Summary

The repository contains a working Next.js click-dummy with all legacy routes present. Phase 1-3 infrastructure is useful: App Router, Tailwind tokens, shared shell, reusable cards/tables/chips, static demo data, client-facing route interactions, and build/lint/typecheck scripts.

The main mismatch is conceptual. The implementation still treats many screens as presentation boards and renders board labels, annotation panels, reference-image viewers, and Phase 2/Phase 3 language inside product routes. v2 requires actual app UI regions only; annotations must become logic, docs, state models, tests, permissions, evidence, and audit behavior.

## Current Structure

| Area | Status | Notes |
|---|---|---|
| App framework | Keep | Next.js App Router is already suitable. |
| Styling | Keep with updates | AlphaVest dark navy/champagne/ivory tokens exist and match v2 direction. |
| Shared shell | Refactor | Navigation is driven by legacy `boardRoutes` and says "Wireframe click-dummy". |
| Client routes | Refactor later in Phase 5 | `/mobile`, `/mobile/upload`, `/portal`, `/wealth-map`, `/actions`, `/decisions`, `/evidence` have useful mock UI and interactions, but still contain board metadata and annotation-style chrome. |
| Internal routes | Refactor now | `/workbench`, `/advisor-approval`, `/compliance`, `/governance`, `/communication`, `/journey`, `/roadmap` are generic `BoardPage` placeholders or old board-reference pages. |
| Permissions | Missing central model | `PermissionMatrix` is visual only. No central role/action/object helper exists. |
| No-unapproved-advice gate | Partial | Copy appears in UI, but release logic is not centralised. |
| State machines | Partial | `lib/status.ts` has badge/tone types, but no workflow transition helpers. |
| Evidence/audit | Partial | Evidence text appears on screens; there is no helper to create/link audit events. |
| Tests | Missing | No test script or helper tests are configured. |
| v2 docs/assets | Present | `docs/v2/*`, `public/reference/visuals_v2/*`, and `public/reference/wireframes_v2_boards/*` are available. `public/reference/wireframes_v1/*` is absent; legacy `public/reference/wireframes/*` exists and is historical only. |

## Route Audit

| Route | Current implementation | v2 audit result |
|---|---|---|
| `/presentation` | Phase 3 product overview board. | Keep as demo entry, but not a v2 product screen source. |
| `/mobile` | Interactive mobile home with priority actions. | Useful base. Needs v2 state coverage and removal of board annotations in Phase 5. |
| `/mobile/upload` | Three-step upload with blocked low-confidence toggle. | Useful base. Needs explicit error state and central evidence/audit helper in Phase 5. |
| `/portal` | Dashboard metrics and wealth-map link. | Useful base. Needs loading/error/permission states in Phase 5. |
| `/wealth-map` | Graph-like map with drawer/highlight. | Useful base. Needs central permission checks for restricted nodes. |
| `/actions` | Kanban/action drawer. | Useful base. Needs missing-evidence gate tied to central model. |
| `/signals` | Trigger review UI exists in client-screen component. | Needs internal-only treatment and v2 trigger review state in Phase 6. |
| `/decisions` | Decision action state updates. | Useful base. Must derive visibility from advisor/compliance/evidence/permission gate. |
| `/evidence` | Evidence list/detail interactions. | Useful base. Needs permission-restricted evidence and audit helper. |
| `/workbench` | Generic `BoardPage`. | Replace in Phase 4 with v2 queue/readiness model. |
| `/advisor-approval` | Generic `BoardPage`. | Replace in Phase 4 with approval gate and compliance-pending state. |
| `/compliance` | Generic `BoardPage`. | Replace in Phase 4 with release/block controls and evidence requirements. |
| `/governance` | Generic `BoardPage`. | Replace in Phase 4 with central permission matrix, second confirmation, audit history. |
| `/communication` | Generic `BoardPage`. | Replace in Phase 4 with gated message preview and communication log foundation. |
| `/journey` | Generic `BoardPage`. | Convert to non-product service-blueprint summary; no reference board recreation. |
| `/roadmap` | Generic `BoardPage`. | Convert to scope/control route; no reference board recreation. |

## Visual Inventory Audit

All v2 PNGs listed in `docs/v2/VISUAL_ASSET_ACTUAL_FILES_V2.md` are present under `public/reference/visuals_v2`. Board-level v2 context exists under `public/reference/wireframes_v2_boards`. Historical v1 folder is not present; older `public/reference/wireframes` should be treated as historical only.

Key interpretation confirmed from representative visuals:

- V2 mobile visuals contain a phone frame as actual UI and surrounding title blocks, legends, handoff notes, route metadata, and callouts as non-UI specification material.
- V2 dashboard/internal visuals contain an app frame/table/drawer area as actual UI and right/bottom annotation/spec regions that must become logic, tests, and docs.
- V2 reference-only boards must inform helpers and tests, not become ordinary client/advisor UI.

## Phase 4 Refactor Targets

1. Centralise route-to-v2 visual mapping.
2. Centralise permission and sensitive-action checks.
3. Centralise no-unapproved-advice release logic.
4. Centralise state-machine and blocked-state helpers.
5. Centralise evidence/audit event creation.
6. Replace generic Phase 2/3 board placeholders on Phase 4 internal routes.
7. Add minimal helper tests and QA report.

## Preserve

- Existing route structure.
- Static mock data approach.
- Tailwind and CSS token foundation.
- Reusable UI primitives where they render actual UI controls or data surfaces.
- Client route interactions as Phase 5 starting points.

## Risks

- Phase 4 can easily drift into Phase 5/6 feature rebuilding. This pass should stop at foundational alignment and internal P0 placeholders becoming real gate-oriented screens.
- Some client routes still need deeper v2 visual cleanup; documenting that boundary is preferable to rebuilding all client screens in this phase.
