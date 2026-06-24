# V0.96 Route UI Cleanup Report

**Date:** 2026-06-23  
**Branch:** `full-workflow`  
**Baseline commit:** `d87c044 feat(v0.96): harden compliance and client projection`  
**Prompt:** `prompts/V0_96_ROUTE_UI_CLEANUP_PROMPT_MAX.md`  
**Status:** `READY_WITH_PARTIAL_SCREENSHOT_EVIDENCE`

## Phase 0 - Preflight

| Check | Result |
|---|---|
| `git status --short` | Dirty worktree already contained broad V0.96 changes before this cleanup. No unrelated files were reverted. |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `d87c044 feat(v0.96): harden compliance and client projection` |
| `git diff --stat` | Existing broad V0.96 diff plus this cleanup. |
| `cat package.json` | Scripts available: `typecheck`, `lint`, `db:validate`, `build`, Playwright suites. Server-starting tests are excluded for this prompt. |
| Preview check | `127.0.0.1:4310` has a running `next-server`; it is not a hot-reload dev server. Updated screenshots would require restart. |

## Inspected Sources

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md`
- `components/app-shell.tsx`
- `components/product-guidance-panel.tsx`
- `components/page-header.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `lib/route-registry.ts`
- `lib/navigation.ts`
- `tests/route-smoke.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/true-ux-a11y.spec.ts`

## Phase 1 - Route Inventory

| Route family | Routes / page IDs | Classification | Decision |
|---|---:|---|---|
| Setup / Admin | `007-018` | `REMOVE_EMPTY_GUIDANCE`, `REMOVE_META_PROOF_PANEL`, `REMOVE_DUPLICATE_HEADER`, `PRESERVE_SAFETY_CONTROL` | Clean route chrome now. Keep page title, controls, tables, modals, real disabled reasons and admin non-bypass content. |
| Export | `054-058` | `REMOVE_EMPTY_GUIDANCE`, `REMOVE_META_PROOF_PANEL`, `PRESERVE_SAFETY_CONTROL` | Per user direction, suppress global guidance even though product CTA/gate data exists. Keep export stage boundaries and payload restrictions inside page content. |
| Client Workspace | `019-032` | `KEEP_PRODUCT_UI`, `DEFER_NEEDS_HUMAN_DECISION` | Product guidance still carries client-workspace next-step and role context. Not removed in this pass. |
| Evidence | `027-030`, `046-047` | `KEEP_PRODUCT_UI`, `PRESERVE_SAFETY_CONTROL`, `DEFER_NEEDS_HUMAN_DECISION` | Keep upload/review/sufficiency separation until reviewed route-by-route. |
| Advisory Workbench | `033-037`, `064-067` | `KEEP_PRODUCT_UI`, `PRESERVE_SAFETY_CONTROL` | Workbench guidance still carries safe blocker and selected-work context. |
| Compliance | `038-042`, `070` | `KEEP_PRODUCT_UI`, `PRESERVE_SAFETY_CONTROL` | Release/decision-room separation remains product-critical. |
| Decisions | `043-045` | `KEEP_PRODUCT_UI`, `PRESERVE_SAFETY_CONTROL` | Client decision state remains sensitive; no broad removal yet. |
| Governance | `048-051` | `REMOVE_EMPTY_GUIDANCE`, `REMOVE_META_PROOF_PANEL`, `PRESERVE_SAFETY_CONTROL` | Per user direction, suppress global guidance even though productive CTA/gate data exists. Keep local governance non-bypass and access-control content. |
| Communication / Ops / Support | `051-053`, `059-063`, `068-069`, `071` | `KEEP_PRODUCT_UI`, `DEFER_NEEDS_HUMAN_DECISION` | Dense ops and support screens need separate visual review. |
| P1 / HOLD / Reference | Workset-controlled | `PRESERVE_SAFETY_CONTROL`, `DEFER_NEEDS_HUMAN_DECISION` | No promotion, no route reclassification, no productive unlock. |

## Phase 2 - Shared Component Cleanup

Implemented a central cleanup policy:

- Added `lib/route-ui-cleanup.ts`.
- `ProductGuidanceContent` now suppresses the large global `ProductGuidancePanel` for Setup/Admin, Governance and Export route families.
- `PageHeader` now supports `chrome="compact"` for product title/subtitle only, without route proof chips, keyboard proof panel, support steps or CTA proof chrome.
- `AdminTenantSetupScreen` now uses compact route chrome for `007-018` and suppresses the lower `UxSupportDensityStrip` for those routes.
- `/admin/evidence-templates` keeps its explicit clean title/subtitle and remains free of the generic audit explainer.

## Phase 3 - Route Family Cleanup

### Setup / Admin

Changed:

- Removed global Product Guidance box for every Setup/Admin route.
- Removed lower `UxSupportDensityStrip` for every Setup/Admin route.
- Replaced full PageHeader proof chrome with compact title/subtitle for Setup/Admin routes except Evidence Templates, which already has a local clean title.
- Preserved admin tables, forms, search/filter shells, modals, real disabled states and sensitive-action warnings.

Acceptance:

- `POSITIVE`: Admin/Setup routes no longer stack `ProductGuidancePanel` + full `PageHeader` + page content + support/density strip.
- `NEGATIVE`: No route scope, permission, export, evidence, audit or client-visibility logic was changed.

### Export

Changed:

- Per user direction, removed global Product Guidance box for all Export routes.
- Kept route-local export lifecycle content: scope, redaction, preview, approval, download/share separation, payload boundary and disabled controls.
- Updated server-based smoke expectations so export routes are not required to render global `product-guidance` CTA chrome.

Acceptance:

- `POSITIVE`: Export routes are now covered by the central no-global-guidance policy.
- `NEGATIVE`: Export lifecycle data contracts remain in `productGuidanceForRoute`; only the visible global guidance panel is suppressed.

### Governance

Changed:

- Per user direction, removed global Product Guidance box for `/governance*` routes.
- Kept local governance authority boundaries, scoped invitation/change controls, drawer/confirmation flows and audit/non-bypass warnings.
- Updated server-based smoke expectations so Governance routes are not required to render global `product-guidance` CTA chrome.

Acceptance:

- `POSITIVE`: Governance routes are now covered by the central no-global-guidance policy.
- `NEGATIVE`: Governance non-bypass CTA/gate data contracts remain in `productGuidanceForRoute`; only the visible global guidance panel is suppressed.

## Test Contract Updates

Updated `tests/route-smoke.spec.ts` to stop requiring visible global guidance/supplemental density chrome for cleaned route families:

- Setup/Admin, Governance and Export page IDs are excluded from broad above-fold `product-guidance` assertions.
- Setup/Admin page IDs are excluded from broad `UxSupportDensityStrip` assertions.
- Governance and Export paths were removed from the global workbench-triad proof assertions.
- Governance and Export approval paths were removed from the visible global guidance priority-CTA assertions.
- Setup/Admin paths were removed from the MJ-001 visible global guidance proof assertions.

## Phase 4 - Screenshot Evidence

Screenshots were attempted against the already-running `127.0.0.1:4310` preview, without starting a new server.

- `artifacts/v0-96-route-ui-cleanup/setup-admin-cleaned.png`

`setup-admin-cleaned.png` is valid and confirms `product-guidance` count `0` for `/admin/evidence-templates`.

Governance and Export screenshots were not accepted as evidence because the running `next-server` showed the Next.js error page after the production build refreshed `.next` underneath it. Updated screenshots for `/governance` and `/export/new` require restarting the existing preview or starting a fresh preview, which this prompt disallows without explicit user approval.

## Phase 5 - Validation

Completed:

- `pnpm typecheck` - pass
- `pnpm lint` - pass with 29 existing warnings, 0 errors
- `pnpm db:validate` - pass
- `pnpm build` - pass with existing Turbopack/NFT warnings around `lib/document-storage-adapter.ts`

Server-starting Playwright tests were not run by constraint.

## Remaining Risks / Next Route Families

- Client Workspace and Evidence still use global guidance because it currently carries real next-step and safety separation content.
- Advisory, Compliance and Decisions should be reviewed route-by-route before suppressing product guidance, because their global guidance overlaps with real safe-action blockers.
- Governance and Export were intentionally removed from global guidance despite existing CTA/gate logic, per explicit user direction.
