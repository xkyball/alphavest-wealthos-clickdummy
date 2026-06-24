# Max Prompt: V0.96 Route UI Cleanup Sweep

## Instruction

max

Use the strongest appropriate Engine route for a concrete Codex implementation sweep. Treat this as a repo-local execution prompt, not a planning exercise.

## Mission

Apply the same cleanup pattern used on `/admin/evidence-templates` to every other AlphaVest screen/route: remove visible internal proof chrome, explanatory meta panels, nearly empty guidance boxes and duplicate route-context blocks that make the product UI feel like a Codex proof harness instead of a real application.

The goal is not to remove safety. The goal is to remove visible implementation narration, proof scaffolding and redundant explanatory UI while preserving real product controls, real disabled reasons, real workflow state, role/tenant selectors, route access boundaries and meaningful user-facing status.

## Source Of Truth

1. `AGENTS.md`
2. `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
3. `docs/v0-96/uploads/ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md`
4. Current live `full-workflow` repo state
5. The cleanup already applied to `/admin/evidence-templates` in:
   - `components/product-guidance-panel.tsx`
   - `components/admin-tenant-setup-screen.tsx`
   - screenshots under `artifacts/wp01-sequential/evidence-templates-after-remove-boxes.png`
   - screenshots under `artifacts/wp01-sequential/evidence-templates-after-remove-header-context.png`

## Non-Negotiable Constraints

- Do not use `main` as truth.
- Do not reclassify routes.
- Do not promote P1, HOLD or reference routes.
- Do not remove real product actions, actual tables, forms, role/tenant context selectors or real disabled-control reasons.
- Do not remove safety logic, permission checks, API guards, audit persistence, export controls or RBAC semantics.
- Do not create screen images or visual assets.
- Do not create a parallel navigation or shell system.
- Do not run tests that start their own server.
- If a local preview server is already running, you may use it only for screenshots and manual visual proof. Do not start a new server unless the user explicitly allows it.
- Keep changes narrow and route/surface scoped.

## Cleanup Target

Audit all implementation-accessible routes and remove or suppress visible UI that is primarily:

- internal Codex proof language;
- route policy proof;
- density proof;
- keyboard/a11y proof panels;
- page-job/gate chips that duplicate surrounding content;
- "No unapproved advice..." proof banners when they read like test instrumentation;
- oversized Product Guidance panels that are empty, repetitive or not useful for the actual page task;
- `UxSupportDensityStrip`-style explanatory panels when they only restate implementation rules;
- audit/guidance/info banners that are generic and do not carry a concrete page action or business datum;
- duplicated page titles, duplicated page headers or stacked header/guidance/header patterns;
- route/screen catalogue language, proof labels, task IDs, WP labels, implementation jargon or "visual proof" copy.

## Preserve

Preserve or improve:

- actual page title;
- search/filter controls;
- data tables;
- product cards with real business content;
- forms, drawers, modals and confirmation flows;
- role/tenant switchers;
- real status chips when they describe a business object;
- real blocked reasons when an action is disabled;
- error/empty/loading states that a user needs;
- client-safe visibility boundaries when they are product-facing and not proof-harness copy;
- one clear next action where a page genuinely needs it.

## Evidence Templates Exemplar

The intended cleanup style is:

- remove the large global `ProductGuidancePanel` if it creates an empty/duplicative top box;
- remove generic audit/explainer banners if they do not add concrete user task value;
- remove lower support/density/proof panels;
- remove PageHeader proof chips and keyboard/status proof blocks where they are meta UI;
- keep a clean title, short practical subtitle, controls and main page content.

For `/admin/evidence-templates`, the cleaned target shape is:

```text
Evidence Templates
Manage reusable evidence requirements.

[Search templates...] [Import held] [Template creation held]

All Templates table
Investment Suitability Review card
```

Apply that taste to the rest of the app: lean product surface first, proof/reporting outside the product UI.

## Required Execution Sequence

### Phase 0 - Preflight

Run and record:

```bash
git status --short
git branch --show-current
git log -1 --oneline
git diff --stat
cat package.json
```

Read:

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `components/app-shell.tsx`
- `components/product-guidance-panel.tsx`
- `components/page-header.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `lib/route-registry.ts`
- `lib/navigation.ts`
- existing route/smoke specs that mention `product-guidance`, `page-header`, `UxSupportDensityStrip`, `data-ux-density`, `data-ux-primary-cta`, or proof panels.

Stop if the branch is wrong or the worktree contains conflicting changes that make the cleanup unsafe.

### Phase 1 - Route Inventory

Create a cleanup inventory grouped by route family:

- Setup / Admin
- Client Workspace
- Evidence
- Advisory Workbench
- Compliance
- Decisions
- Governance
- Export
- Communication / Ops / Support
- P1 / HOLD / Reference routes

For each route, classify visible cleanup targets:

```text
KEEP_PRODUCT_UI
REMOVE_EMPTY_GUIDANCE
REMOVE_META_PROOF_PANEL
REMOVE_DUPLICATE_HEADER
REMOVE_GENERIC_EXPLAINER
PRESERVE_SAFETY_CONTROL
DEFER_NEEDS_HUMAN_DECISION
```

Write the inventory to:

```text
V0_96_ROUTE_UI_CLEANUP_REPORT.md
```

### Phase 2 - Shared Component Cleanup

Prefer central switches over one-off route patches.

Inspect whether cleanup can be expressed through:

- `ProductGuidanceContent`
- `ProductGuidancePanel`
- `PageHeader`
- `UxSupportDensityStrip`
- route/page IDs
- route policy/page contract helpers

Implement suppressions centrally when a route or route family should not show meta/proof chrome.

Expected central behavior:

- product routes should not show proof-only guidance panels;
- route-specific business pages may keep a clean page title and controls;
- P1/HOLD/reference routes may keep clear locked/deferred state, but not proof jargon;
- client routes must not reveal internal details.

### Phase 3 - Route Family Cleanup

Work one route family at a time. After each family:

1. Make the smallest code change.
2. Run `pnpm typecheck`.
3. If no server-starting test is required, optionally run focused non-server tests.
4. If an existing preview server is already running, capture screenshots before/after or after-only.
5. Update `V0_96_ROUTE_UI_CLEANUP_REPORT.md`.

Do not continue to the next family if the current family introduces a visible regression.

### Phase 4 - Screenshot Evidence

If a preview server is already running, capture screenshots under:

```text
artifacts/v0-96-route-ui-cleanup/
```

Use names like:

```text
setup-admin-cleaned.png
client-workspace-cleaned.png
evidence-cleaned.png
advisory-workbench-cleaned.png
compliance-cleaned.png
decisions-cleaned.png
governance-cleaned.png
export-cleaned.png
support-routes-cleaned.png
```

If no preview server is running and the user has not allowed starting one, do not start one. Record `SCREENSHOT_BLOCKED_NO_RUNNING_PREVIEW`.

### Phase 5 - Validation

Allowed validation without starting a server:

```bash
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
```

Do not run Playwright tests that start or require a server unless the user explicitly allows it. If Playwright can attach to an already-running preview without starting a server, use it only for screenshot capture and simple DOM inspection.

### Phase 6 - Final Report

Update `V0_96_ROUTE_UI_CLEANUP_REPORT.md` with:

- changed files;
- inspected files;
- route families cleaned;
- route families deferred;
- screenshots produced;
- validation commands run;
- warnings or blockers;
- remaining screens that still look too much like proof harness UI;
- exact next recommended cleanup task.

## Acceptance Criteria

Positive:

- Each cleaned screen starts with real product content, not proof/guidance chrome.
- Repetitive top boxes are removed or compacted.
- Page title is still present.
- Search/filter/action controls remain usable.
- Tables/cards/forms remain visible.
- Real blocked reasons remain when needed.
- Client-safe routes still fail closed.
- P1/HOLD/reference routes remain locked/deferred where appropriate.

Negative:

- No route shows WP/task/proof jargon as product UI.
- No route shows duplicate PageHeader + ProductGuidance + support proof stacks.
- No user-facing route relies on a giant mostly empty panel before the actual work.
- No safety boundary is removed from code.
- No disabled action becomes enabled by cleanup.
- No navigation/action route scope changes are introduced.

## Suggested First Pass Route Set

Start with the screens most likely to contain the same clutter pattern:

```text
/admin/platform
/admin/roles
/admin/security
/admin/export-templates
/documents
/documents/upload
/advisory/review-queue
/advisor/reviews
/compliance/reviews
/decisions
/governance
/export/new
```

Then expand to the rest of `routeSmokeList`.

## Final Response Shape

Return a short German execution summary:

```text
Analyse
Umsetzung
Validierung
Screenshots
Offene Risiken
Naechster Schritt
```

Be honest about anything deferred or blocked.
