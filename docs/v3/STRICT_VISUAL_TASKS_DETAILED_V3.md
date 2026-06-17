# Strict Visual Tasks Detailed V3

Max.

Date: 2026-06-16  
Source plan: `docs/v3/STRICT_VISUAL_IMPLEMENTATION_PLAN_V3.md`  
Source review: `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`  
Purpose: detailed implementation task package for strict AlphaVest visual remediation.

## Operating Rules

- Use `AGENTS.md` and all V3 source-of-truth docs as authoritative.
- Preserve actual application UI only. Do not introduce spec panels, route labels, filenames, annotation rails, callout legends, or dev notes.
- Fix shared primitives before route-specific layout patches.
- Preserve demo session, role, tenant, permission, evidence, audit, redaction, second-confirmation, and compliance-release gates.
- Do not treat advisor approval as client release.
- Do not reduce font size as the default solution.
- Do not remove product content to make layouts easier.
- Keep changes phase-scoped and commit-ready.

## Task Format

Each task below includes:

- Objective: what the task must accomplish.
- Source finding: strict review finding or plan phase it traces to.
- Likely files: probable starting points, not an exclusive file list.
- Implementation notes: concrete work to perform.
- Acceptance criteria: visible or testable result.
- QA evidence: proof expected before closing the task.
- Out of scope: changes that should not be included in that task.

## Phase 00 - Planning and QA Baseline

### AV-SV-00-01 - Freeze strict visual remediation scope

- Objective: Freeze the remediation scope from the strict review so implementation does not drift into unrelated redesign work.
- Source finding: all P1/P2 findings in `STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`.
- Likely files: `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`, `docs/v3/STRICT_VISUAL_IMPLEMENTATION_PLAN_V3.md`, `docs/v3/STRICT_VISUAL_TASKS_DETAILED_V3.md`.
- Implementation notes:
  - Confirm the active scope is P1-01 through P1-10 and P2-01 through P2-07.
  - Mark P0 as none confirmed, not as product/security certified.
  - Keep all 63 catalogue pages in the QA scope even if only affected pages receive implementation changes.
  - Note that visual contract green is necessary but not sufficient.
- Acceptance criteria:
  - Scope section names all P1 and P2 findings.
  - No unrelated feature, auth, backend, or data-model work is added.
  - The final task package still maps to the eight remediation phases.
- QA evidence:
  - Document diff only.
  - Optional `rg "P1-|P2-|AV-SV-" docs/v3/STRICT_VISUAL_TASKS_DETAILED_V3.md`.
- Out of scope:
  - Implementing visual fixes.
  - Reclassifying findings without new screenshot evidence.

### AV-SV-00-02 - Lock route/reference/evidence inputs

- Objective: Lock the exact route, reference, and screenshot inputs used for before/after comparisons.
- Source finding: strict review evidence pack.
- Likely files: `docs/v3/SCREEN_CATALOGUE_V3.md`, `lib/route-registry.ts`, `artifacts/strict-visual-review/2026-06-16-alpha-v3/index.md`, `artifacts/visual-qa/visual-contract-result.json`.
- Implementation notes:
  - Record the 63 route catalogue as the authoritative review list.
  - Record the clean reference folder `public/reference/page_ui_v3/clean_pages/`.
  - Record the current before bundle `artifacts/strict-visual-review/2026-06-16-alpha-v3/`.
  - Do not overwrite the before bundle during later verification.
- Acceptance criteria:
  - Future phases can name a before and after bundle.
  - Route IDs, route paths, and reference assets remain traceable.
  - The plan does not depend on memory of screenshots only.
- QA evidence:
  - `artifacts/strict-visual-review/2026-06-16-alpha-v3/index.md` remains present.
  - `artifacts/visual-qa/visual-contract-result.json` remains present.
- Out of scope:
  - Regenerating screenshots.
  - Updating visual contract behavior.

### AV-SV-00-03 - Create visual remediation checklist

- Objective: Create a trackable checklist for closing P1/P2 findings across phases.
- Source finding: all P1/P2 findings and phase plan.
- Likely files: `docs/v3/STRICT_VISUAL_TASKS_DETAILED_V3.md`, optionally `docs/v3/PHASE_EXECUTION_REPORT.md`.
- Implementation notes:
  - Represent every task ID from AV-SV-00-01 through AV-SV-08-08.
  - Include finding coverage for each phase.
  - Include status values such as planned, in progress, blocked, verified, deferred.
  - Keep checklist implementation lightweight and documentation-first.
- Acceptance criteria:
  - Every task in the implementation plan exists in this detailed task package.
  - Each task can be independently assigned and verified.
  - No task requires hidden context outside the review, plan, or source files.
- QA evidence:
  - Count task IDs and compare to the phase plan.
- Out of scope:
  - Building a task tracker app.
  - Adding runtime UI for task tracking.

### AV-SV-00-04 - Confirm shared component ownership map

- Objective: Map every finding to the shared primitive or screen module that should own the fix.
- Source finding: strict review "likely file/component area" column.
- Likely files: `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/ui/data-table.tsx`, `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/filter-bar.tsx`, `components/ui/kanban.tsx`, `components/auth-onboarding-screen.tsx`, `components/client-intake-screen.tsx`, `components/wealth-actions-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/visual-contract.ts`.
- Implementation notes:
  - Identify whether each finding is shared primitive, shell, route-state, or screen-specific.
  - Prefer shared owner for repeated symptoms such as cramped table headers, mobile search clipping, modal context, or drawer compression.
  - Mark route-specific owners only when a shared primitive cannot reasonably solve the issue.
  - Keep `app/globals.css` as the shared surface/spacing seam where token-level changes are needed.
- Acceptance criteria:
  - Each P1/P2 finding has a primary owner and fallback owner.
  - No finding defaults to isolated CSS without justification.
  - Ownership map does not change product workflow semantics.
- QA evidence:
  - Ownership map included or referenced in phase execution notes.
- Out of scope:
  - Refactoring all screen modules.
  - Replacing the current design system.

### AV-SV-00-05 - Establish before/after screenshot protocol

- Objective: Define repeatable screenshot evidence rules for all later phases.
- Source finding: strict review relied on 126 screenshots and contact sheets.
- Likely files: `artifacts/strict-visual-review/`, `scripts/visual-qa-contract.ts`, possible future screenshot helper scripts.
- Implementation notes:
  - Use non-overwriting output directories named with date and purpose.
  - Capture 63 desktop and 63 mobile screenshots for final proof.
  - For phase-local proof, capture only affected pages plus any shared primitive regression pages.
  - Generate contact sheets for scan review when more than a few pages change.
- Acceptance criteria:
  - Before evidence remains intact.
  - After evidence is easy to compare.
  - Capture failures, loading states, and limitations are documented.
- QA evidence:
  - Screenshot bundle index.
  - DOM metrics JSON.
  - Contact sheets for affected pages or all pages.
- Out of scope:
  - Pixel-perfect diff engine.
  - Destructive cleanup of earlier artifacts.

## Phase 01 - Mobile Shell and Content-First Layout

### AV-SV-01-01 - Make mobile `AppShell` content-first

- Objective: Ensure mobile AppShell routes show route-specific content before global navigation.
- Source finding: P1-01.
- Likely files: `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `app/globals.css`.
- Implementation notes:
  - Change the mobile shell structure so navigation no longer consumes the first viewport.
  - Keep desktop sidebar behavior unchanged unless a shared layout variable requires a small adjustment.
  - Preserve `DemoSessionProvider` ownership and demo context controls.
  - Ensure main content still uses `av-page`/`av-page-wide` width contracts.
- Acceptance criteria:
  - Pages 008 and 011-017 show page header or primary content above the fold on mobile.
  - Desktop shell remains visually consistent.
  - No route loses role/tenant context.
- QA evidence:
  - Mobile screenshots for pages 008, 011, 012, 013, 014, 015, 016, 017.
  - Desktop smoke screenshot for at least one AppShell page.
  - `pnpm visual:contract` after implementation.
- Out of scope:
  - Rewriting phase-specific custom shells.
  - Production authentication or permission behavior.

### AV-SV-01-02 - Convert mobile sidebar into menu/drawer navigation

- Objective: Replace the stacked mobile sidebar with a compact navigation entry point.
- Source finding: P1-01.
- Likely files: `components/sidebar.tsx`, `components/top-bar.tsx`, `components/ui/drawer.tsx`, `app/globals.css`.
- Implementation notes:
  - Add a mobile menu button or compact navigation trigger using lucide icons.
  - Render navigation in an overlay/drawer on mobile.
  - Keep grouped navigation labels and active route styling.
  - Ensure the drawer can close and does not obscure route content by default.
- Acceptance criteria:
  - Mobile navigation is accessible without appearing as full-page content.
  - Active nav item remains visually clear.
  - Keyboard and screen-reader labels exist for the trigger and close action.
- QA evidence:
  - Browser/mobile screenshot with drawer closed.
  - Browser/mobile screenshot with drawer open if interaction tooling is used.
  - DOM check for no first-viewport navigation stack.
- Out of scope:
  - Changing navigation taxonomy.
  - Adding new routes.

### AV-SV-01-03 - Preserve role and tenant switcher access on mobile

- Objective: Keep demo role and tenant switching reachable after the mobile shell change.
- Source finding: P1-01 plus AGENTS early implementation rule.
- Likely files: `components/top-bar.tsx`, `components/demo-session-provider.tsx`, `lib/demo-session.ts`, `components/app-shell.tsx`.
- Implementation notes:
  - Decide whether role/tenant controls remain inline, collapse into a compact context menu, or move into the mobile nav drawer.
  - Keep labels and selected values available; do not hide context completely.
  - Preserve `setRole`, `setTenant`, and `resetSession` behavior.
  - Avoid mobile controls that push page content below the first viewport.
- Acceptance criteria:
  - Mobile users can identify current tenant and role.
  - Mobile users can change tenant and role without route breakage.
  - First viewport still shows route content.
- QA evidence:
  - Mobile screenshots showing closed shell with current context.
  - Optional interaction test for selecting role/tenant.
- Out of scope:
  - Real authentication.
  - Tenant isolation enforcement changes.

### AV-SV-01-04 - Add mobile route-identity smoke checks

- Objective: Add a targeted check that affected mobile pages expose route identity above navigation.
- Source finding: P1-01.
- Likely files: `tests/route-smoke.spec.ts`, `lib/route-smoke-list.ts`, `lib/route-registry.ts`, optional new visual QA helper.
- Implementation notes:
  - Select routes for pages 008 and 011-017.
  - Check for route title or primary page heading in the first viewport.
  - Keep test stable: avoid fragile pixel coordinates if DOM viewport checks are enough.
  - Do not replace the existing all-route smoke coverage.
- Acceptance criteria:
  - Test fails if only navigation is visible in the first mobile viewport.
  - Test remains independent of exact text placement when possible.
  - Existing route smoke tests still pass.
- QA evidence:
  - Targeted test output.
  - `pnpm visual:contract` remains green.
- Out of scope:
  - Full visual regression suite.
  - Pixel-diff assertions.

### AV-SV-01-05 - Regenerate mobile screenshots for shell pages

- Objective: Produce before/after evidence for the shell fix.
- Source finding: P1-01.
- Likely files: `artifacts/strict-visual-review/`, screenshot helper scripts or ad hoc Playwright harness.
- Implementation notes:
  - Capture mobile screenshots for pages 008 and 011-017 after shell changes.
  - Save to a new non-overwriting artifact folder.
  - Include route URL, viewport, and screenshot path in the artifact index.
  - Note any capture limitation honestly.
- Acceptance criteria:
  - New screenshots show route content first.
  - Before and after evidence can be compared.
  - No loading-state screenshots are accepted as final evidence.
- QA evidence:
  - New mobile screenshot bundle.
  - Optional contact sheet for the affected routes.
- Out of scope:
  - Full 126-screenshot final run; that belongs to Phase 08.

## Phase 02 - Responsive Data Display Primitives

### AV-SV-02-01 - Add responsive row-card mode for dense tables

- Objective: Provide a shared mobile representation for dense data tables that avoids fragmented headers and one-word columns.
- Source finding: P1-03, P1-10, P2-07.
- Likely files: `components/ui/data-table.tsx`, `components/ui/card.tsx`, `app/globals.css`.
- Implementation notes:
  - Add an optional mobile row-card rendering mode to `DataTable`.
  - Use column headers as labels and rendered cell content as values.
  - Preserve action affordance without forcing a narrow action column.
  - Keep desktop table rendering unchanged unless explicitly using the new mode.
- Acceptance criteria:
  - Mobile row cards display labels and values without one-word fragmentation.
  - Desktop table still supports current layouts.
  - Empty/loading/error/restricted states still render correctly.
- QA evidence:
  - Mobile screenshots for at least pages 022 and 061.
  - Typecheck for generic `DataTable` typing.
- Out of scope:
  - Replacing every table in the app at once.
  - Reducing content semantics.

### AV-SV-02-02 - Add contained horizontal-table mode where cards are inappropriate

- Objective: Support cases where data must remain tabular while still avoiding document-level overflow.
- Source finding: P1-03, P1-10, P2-04, P2-07.
- Likely files: `components/ui/data-table.tsx`, `app/globals.css`.
- Implementation notes:
  - Add a mode for stable min-width table containment with visible scroll affordance.
  - Avoid `table-fixed` behavior when it causes unreadable header wrapping.
  - Provide predictable row height and padding.
  - Keep containment local to the table wrapper, not the document.
- Acceptance criteria:
  - No document-level horizontal overflow is introduced.
  - Headers remain readable.
  - Users can understand that the table region scrolls when needed.
- QA evidence:
  - DOM metrics for document scroll width.
  - Mobile screenshot of a contained table example.
- Out of scope:
  - Pixel-perfect table widths for every route.
  - Hidden overflow that clips content without scroll access.

### AV-SV-02-03 - Fix consent policy card wrapping

- Objective: Make the mobile consent policy card readable.
- Source finding: P1-02.
- Likely files: `components/auth-onboarding-screen.tsx`, `lib/auth-onboarding-demo-data.ts`, shared card primitives if used.
- Implementation notes:
  - Locate the policy/terms card on page 005.
  - Stack label, description, status, and action areas on mobile.
  - Avoid multi-column mobile regions for long policy labels.
  - Preserve legal/privacy meaning and consent state.
- Acceptance criteria:
  - No policy label or privacy copy wraps into one-word fragments on mobile.
  - Consent actions remain visible and understandable.
  - Desktop layout remains clean.
- QA evidence:
  - Mobile screenshot for page 005.
  - Desktop screenshot or quick browser check for page 005.
- Out of scope:
  - Changing consent copy semantics.
  - Adding real legal terms or production consent tracking.

### AV-SV-02-04 - Fix family members mobile table

- Objective: Make family member data readable on mobile.
- Source finding: P1-03.
- Likely files: `components/client-intake-screen.tsx`, `components/ui/data-table.tsx`, `lib/client-intake-demo-data.ts`.
- Implementation notes:
  - Apply row-card or contained-table mode to the family members table.
  - Preserve name, family role, relationship, governance status, and action affordances.
  - Keep governance status visually clear.
  - Avoid one-word or all-caps header fragmentation.
- Acceptance criteria:
  - Page 022 mobile screenshot has readable family records.
  - Governance status is not visually minimized.
  - Desktop table remains readable.
- QA evidence:
  - Mobile screenshot for page 022.
  - DOM check for no document-level horizontal overflow.
- Out of scope:
  - Changing the family data model.
  - Removing columns to pass layout.

### AV-SV-02-05 - Fix service blueprint mobile matrix

- Objective: Make the service blueprint readable on mobile without clipped matrix columns.
- Source finding: P1-10.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, `components/ui/data-table.tsx`.
- Implementation notes:
  - Convert blueprint stages to stacked mobile sections or contained bands.
  - Preserve stage labels and operational meaning.
  - Keep desktop blueprint dense but readable.
  - Avoid exposing only partial column text in the mobile first viewport.
- Acceptance criteria:
  - Page 061 mobile screenshot shows complete stage labels and content.
  - Desktop page still communicates blueprint structure.
  - No spec/reference-only chrome is introduced.
- QA evidence:
  - Mobile and desktop screenshots for page 061.
  - DOM metrics for cramped text after fix.
- Out of scope:
  - Reclassifying blueprint as non-route unless separately approved.
  - Removing operational content.

### AV-SV-02-06 - Apply primitive to governance/audit/export table candidates

- Objective: Extend the new table behavior to other candidates that exhibit compression.
- Source finding: P2-04, P2-07 and phase plan.
- Likely files: `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/ui/data-table.tsx`.
- Implementation notes:
  - Review pages 046, 051, 055, and 061 for table/matrix compression.
  - Apply row-card or contained-table mode where the shared primitive improves readability.
  - Keep drawer-state pages from double-compressing tables.
  - Preserve audit immutability and export evidence visibility.
- Acceptance criteria:
  - Candidate pages no longer show obvious table-header fragmentation.
  - Drawer/table combinations remain inspectable.
  - No data is hidden without another visible path.
- QA evidence:
  - Screenshots for pages 046, 051, 055, 061 where changed.
  - DOM metrics for changed routes.
- Out of scope:
  - Rebuilding governance/evidence data flows.
  - Removing audit/export columns as the primary fix.

### AV-SV-02-07 - Re-run cramped-text DOM metric check

- Objective: Verify whether table/matrix fixes reduce the DOM cramped-text candidate list.
- Source finding: P2-07.
- Likely files: `artifacts/strict-visual-review/`, screenshot/DOM metric harness.
- Implementation notes:
  - Run the same or equivalent DOM metric extraction after Phase 02 changes.
  - Compare affected route candidates with the baseline list.
  - Classify remaining cramped regions as fixed, still failing, or acceptable dense UI.
  - Feed remaining issues into Phase 07.
- Acceptance criteria:
  - Metric output is saved in a new non-overwriting artifact folder.
  - Remaining candidates are documented.
  - No broad claim of visual quality is made solely from metrics.
- QA evidence:
  - DOM metrics JSON.
  - Summary in phase report.
- Out of scope:
  - Full final strict review.
  - Treating metrics as a pixel-quality oracle.

## Phase 03 - Graph, Board, and Fixed-Format Containers

### AV-SV-03-01 - Stabilize wealth-map graph footer and controls

- Objective: Keep wealth-map controls, tabs, and graph content inside a stable visible container.
- Source finding: P1-05.
- Likely files: `components/wealth-actions-screen.tsx`, `app/globals.css`, `lib/wealth-actions-demo-data.ts`.
- Implementation notes:
  - Add reserved bottom space or internal layout for graph controls.
  - Prevent controls from sitting against the viewport edge.
  - Preserve legend, node, connection, alert, and selected-node content.
  - Ensure graph height responds sensibly across desktop and mobile.
- Acceptance criteria:
  - Page 031 desktop graph controls are not clipped or edge-glued.
  - Mobile graph/search area remains readable.
  - No document-level horizontal overflow is introduced.
- QA evidence:
  - Desktop and mobile screenshots for page 031.
  - DOM geometry check for overflow and clipped controls.
- Out of scope:
  - Replacing the graph engine.
  - Removing graph controls or legend data.

### AV-SV-03-02 - Restore/verify wealth-map drawer-state rendering

- Objective: Ensure page 031 visually expresses drawer state when routed with `?state=drawer`.
- Source finding: P1-05 and route state registry.
- Likely files: `components/wealth-actions-screen.tsx`, `lib/visual-contract.ts`, `lib/route-registry.ts`.
- Implementation notes:
  - Confirm `visualStateForRoute` returns `drawer` for PAGE-031.
  - Confirm `WealthMapPage` receives and uses `visualState`.
  - Render the side drawer or selected-node panel when drawer state is active.
  - Avoid making drawer state default for normal interactive browsing if not intended.
- Acceptance criteria:
  - `/wealth-map?state=drawer` screenshot shows drawer/side detail state.
  - `/wealth-map` base state remains sane.
  - Visual contract route-state behavior remains green.
- QA evidence:
  - Screenshots for base and drawer state.
  - `pnpm visual:contract`.
- Out of scope:
  - Changing visual modes for unrelated routes.
  - Adding real graph selection persistence.

### AV-SV-03-03 - Add mobile relationship-map alternative

- Objective: Provide a readable mobile representation for the relationship map.
- Source finding: P1-04.
- Likely files: `components/client-intake-screen.tsx`, `lib/client-intake-demo-data.ts`, possibly shared graph/card helpers.
- Implementation notes:
  - Add a mobile stacked relationship list, family graph summary, or pan/zoom-contained graph.
  - Preserve relationship direction, governance role, and family/entity context.
  - Keep desktop graph behavior intact.
  - Ensure nodes no longer overlap or clip on mobile.
- Acceptance criteria:
  - Page 023 mobile screenshot is readable.
  - Relationship semantics remain visible.
  - Desktop relationship graph remains acceptable.
- QA evidence:
  - Mobile and desktop screenshots for page 023.
  - DOM check for overlap/overflow candidate regions.
- Out of scope:
  - New graph library unless necessary.
  - Reworking family data semantics.

### AV-SV-03-04 - Normalize action-board column/card rhythm

- Objective: Improve action-board readability without route-specific visual drift.
- Source finding: P2-03.
- Likely files: `components/ui/kanban.tsx`, `components/wealth-actions-screen.tsx`, `lib/wealth-actions-demo-data.ts`.
- Implementation notes:
  - Normalize Kanban card padding, chip spacing, and row rhythm.
  - Consider horizontal containment for dense desktop boards.
  - Preserve priority/status badges and action metadata.
  - Ensure mobile cards stack without clipped search/filter text.
- Acceptance criteria:
  - Page 032 desktop board is easier to scan.
  - Page 032 mobile does not clip key controls or text.
  - Shared Kanban changes do not break other users of the primitive.
- QA evidence:
  - Desktop and mobile screenshots for page 032.
  - Typecheck if `Kanban` props change.
- Out of scope:
  - Workflow logic changes for actions.
  - Removing columns to simplify layout.

### AV-SV-03-05 - Add fixed-format hover/state stability checks

- Objective: Verify graph/board controls do not resize or shift when dynamic states appear.
- Source finding: strict review fixed-format UI criterion.
- Likely files: `tests/`, `scripts/`, or screenshot/DOM QA helper.
- Implementation notes:
  - Target pages 023, 031, and 032.
  - Check stable dimensions for graph container, controls, board columns, badges, and hover states where practical.
  - Prefer DOM geometry and screenshot comparison over fragile style snapshots.
  - Document any manual-only check.
- Acceptance criteria:
  - No visible layout jump occurs in targeted interactions.
  - Hover/state labels do not resize fixed-format containers.
  - Evidence is recorded for changed pages.
- QA evidence:
  - Browser screenshot or DOM geometry notes.
  - Optional Playwright hover checks.
- Out of scope:
  - Full animation/performance test suite.
  - Pixel-perfect motion comparison.

### AV-SV-03-06 - Regenerate anchor screenshots

- Objective: Produce phase evidence for graph/board anchor pages.
- Source finding: P1-04, P1-05, P2-03.
- Likely files: `artifacts/strict-visual-review/`.
- Implementation notes:
  - Capture pages 023, 031, and 032 in desktop and mobile.
  - Include base and route-state variants for page 031 if relevant.
  - Save to a new artifact folder.
  - Compare against strict review anchor evidence.
- Acceptance criteria:
  - Screenshots show fixed graph/control/board behavior.
  - Evidence folder is non-overwriting.
  - Any residual issue is documented.
- QA evidence:
  - New screenshots and optional anchor contact sheet.
- Out of scope:
  - Full final capture of all 63 pages.

## Phase 04 - Dense Workflow Gate Layouts

### AV-SV-04-01 - Rebalance signal review layout

- Objective: Make signal review dense data scanable without hiding review/evidence state.
- Source finding: P1-06.
- Likely files: `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`.
- Implementation notes:
  - Review the current `SignalsPage` column structure.
  - Reduce competing column pressure at desktop widths.
  - Move secondary notes/history/detail content to a lower section or drawer if needed.
  - Keep signal status, confidence, routing, evidence, and internal-only guard visible.
- Acceptance criteria:
  - Page 033 desktop reads as a professional review workflow.
  - Important gate/status data is not visually minimized.
  - Mobile remains usable.
- QA evidence:
  - Desktop and mobile screenshots for page 033.
  - DOM cramped-text comparison for page 033.
- Out of scope:
  - Changing signal workflow behavior.
  - Reclassifying signals as advice.

### AV-SV-04-02 - Rebalance advisor approval detail layout

- Objective: Make advisor approval detail readable while preserving that approval is not client release.
- Source finding: P1-07.
- Likely files: `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`, `lib/workflow-gate.ts`.
- Implementation notes:
  - Locate the approval detail page for PAGE-037.
  - Promote gate status, evidence requirements, and compliance-not-release wording.
  - Reflow dense metadata/evidence rails into a wider section or drawer.
  - Keep advisor approval action distinct from release action.
- Acceptance criteria:
  - Page 037 desktop no longer shows cramped metadata/evidence regions.
  - Compliance release remains visually separate.
  - No product rule text is weakened or removed.
- QA evidence:
  - Desktop screenshot for page 037.
  - Product-rule visual pass for approval vs release distinction.
- Out of scope:
  - Making advisor approval release content to the client.
  - Backend workflow state changes unless required by existing UI hooks.

### AV-SV-04-03 - Rebalance compliance review layout

- Objective: Make compliance review scanable for evidence, policy checks, and release decision.
- Source finding: P1-08.
- Likely files: `components/internal-workflow-screen.tsx`, `lib/internal-workflow-demo-data.ts`.
- Implementation notes:
  - Rework PAGE-039 from competing dense columns into a clearer hierarchy.
  - Prefer two primary columns plus a decision rail/drawer over multiple equal-weight columns.
  - Keep output classification, evidence completeness, policy checks, decision controls, and history accessible.
  - Do not hide evidence/audit data without an alternative path.
- Acceptance criteria:
  - Page 039 desktop is readable at first viewport.
  - Compliance release state is visually dominant.
  - Review history and evidence remain discoverable.
- QA evidence:
  - Desktop screenshot for page 039.
  - Anchor comparison with strict review evidence.
- Out of scope:
  - Removing policy checks.
  - Changing compliance approval semantics.

### AV-SV-04-04 - Promote compliance release and evidence gate hierarchy

- Objective: Strengthen visual hierarchy for release gates across advisor/compliance pages.
- Source finding: P1-07, P1-08 and product gates.
- Likely files: `components/internal-workflow-screen.tsx`, `components/ui/workflow-badge.tsx`, `components/ui/status-chip.tsx`, `lib/workflow-gate.ts`, `lib/visibility-engine.ts`.
- Implementation notes:
  - Make release readiness, evidence completeness, and compliance status more prominent than ordinary metadata.
  - Preserve visual difference between draft, advisor approved, compliance review, blocked, and released.
  - Reuse existing status chip/workflow badge primitives where possible.
  - Avoid adding new status concepts not present in demo data.
- Acceptance criteria:
  - Pages 037, 039, and 040 visibly communicate the release gate.
  - Advisor approval alone never appears as client-visible release.
  - Status visuals remain consistent.
- QA evidence:
  - Screenshots for pages 037, 039, 040.
  - Product-rule checklist in phase notes.
- Out of scope:
  - New backend permission enforcement.
  - Rewriting demo data states.

### AV-SV-04-05 - Preserve audit/evidence/decision visibility

- Objective: Ensure layout changes do not suppress critical audit/evidence/decision information.
- Source finding: product workflow visibility criteria.
- Likely files: `components/internal-workflow-screen.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx`, `lib/evidence-service.ts`, `lib/audit-service.ts`.
- Implementation notes:
  - Review changed workflow pages for evidence list and audit timeline visibility.
  - Ensure sensitive actions still show confirmation/review state.
  - Keep internal-only and no-unapproved-advice guardrails visible.
  - Add or reuse accessible paths if detail moves into a drawer.
- Acceptance criteria:
  - Evidence and audit data remain visible or clearly accessible.
  - Sensitive action states remain clear.
  - No content is silently removed.
- QA evidence:
  - Visual review notes for pages 033, 037, 039, 040.
  - Screenshot crops or region notes.
- Out of scope:
  - Real audit persistence.
  - New compliance policies.

### AV-SV-04-06 - Run product-rule visual pass

- Objective: Verify advisor/compliance workflow visuals still obey AlphaVest product rules.
- Source finding: AGENTS product rules and strict review criteria.
- Likely files: `docs/v3/IMPLEMENTATION_QA_REPORT.md`, `docs/v3/PHASE_EXECUTION_REPORT.md`, screenshots.
- Implementation notes:
  - Review pages 033 through 040.
  - Check no unapproved advice appears client-visible.
  - Check advisor approval is not presented as release.
  - Check compliance release controls visibility language.
- Acceptance criteria:
  - Product-rule pass/fail notes are documented.
  - Any ambiguity becomes a follow-up task before closure.
  - No P0 issue is introduced.
- QA evidence:
  - Product-rule checklist in QA report.
  - Screenshots for affected pages.
- Out of scope:
  - Legal/compliance certification.
  - Backend authorization audit.

## Phase 05 - Export and Redaction Workspace

### AV-SV-05-01 - Recompose export redaction desktop workspace

- Objective: Make export redaction feel like a serious regulated workflow.
- Source finding: P1-09.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`.
- Implementation notes:
  - Rework PAGE-056 desktop composition to use available space better.
  - Balance document preview, redaction queue, policy state, and approval readiness.
  - Preserve export safety and release gates.
  - Keep mobile layout readable after desktop changes.
- Acceptance criteria:
  - Page 056 desktop no longer looks sparse or placeholder-like.
  - Redaction workflow state is visible and clear.
  - No evidence/release data is hidden.
- QA evidence:
  - Desktop and mobile screenshots for page 056.
  - Comparison against reference asset and strict review screenshot.
- Out of scope:
  - Real document redaction engine.
  - Removing export workflow steps.

### AV-SV-05-02 - Add richer document-preview surface

- Objective: Improve the document preview fidelity on the redaction page.
- Source finding: P1-09.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, possible shared document preview helper.
- Implementation notes:
  - Add realistic document structure such as headings, paragraphs, tables, redaction marks, or page metadata.
  - Make redacted regions visually distinct and meaningful.
  - Keep preview as demo-safe synthetic content only.
  - Avoid dark, empty, or overly decorative preview treatment.
- Acceptance criteria:
  - Document preview communicates redaction state at a glance.
  - Redactions are visible without exposing real data.
  - Preview remains readable on desktop and usable on mobile.
- QA evidence:
  - Screenshot crop of document preview.
  - No real client data present.
- Out of scope:
  - File upload or PDF rendering pipeline.
  - Real redaction export generation.

### AV-SV-05-03 - Add redaction queue/status rhythm

- Objective: Make redaction items, status, and review actions scanable.
- Source finding: P1-09.
- Likely files: `components/communication-export-ops-screen.tsx`, `components/ui/status-chip.tsx`, `components/ui/badge.tsx`.
- Implementation notes:
  - Show redaction items in a structured queue or checklist.
  - Distinguish pending, reviewed, blocked, approved, and release-ready states using existing badge/status primitives.
  - Keep row/card padding above the 12px visual threshold.
  - Preserve evidence/release readiness.
- Acceptance criteria:
  - Redaction queue can be scanned without crowding.
  - Status chips do not wrap into unreadable fragments.
  - Sensitive export actions have visible review state.
- QA evidence:
  - Screenshot for PAGE-056 queue/status region.
  - DOM cramped-text check if applicable.
- Out of scope:
  - New workflow transitions.
  - Hidden status-only icons without text.

### AV-SV-05-04 - Align export scope, preview, and download states

- Objective: Keep export workflow pages visually consistent after redaction changes.
- Source finding: P1-09, P2-01, P2-02.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, `components/ui/wizard-stepper.tsx`.
- Implementation notes:
  - Review pages 055, 056, 057, and 058 as one workflow.
  - Ensure wizard/stepper status remains consistent.
  - Keep scope, preview, approval, download, and share states visually connected.
  - Avoid making redaction page visually richer than the surrounding flow in an inconsistent way.
- Acceptance criteria:
  - Export pages 055-058 feel like one workflow.
  - Approval/confirmation states remain clear.
  - Mobile search/filter text does not clip on page 056.
- QA evidence:
  - Screenshots for pages 055-058.
  - Visual review notes for workflow continuity.
- Out of scope:
  - New export package semantics.
  - Production file generation.

### AV-SV-05-05 - Verify export evidence/release visibility

- Objective: Confirm export pages still surface evidence and release requirements.
- Source finding: product workflow visibility criteria.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/evidence-service.ts`.
- Implementation notes:
  - Inspect export pages for evidence, redaction, approval, release, and download/share states.
  - Check sensitive actions have confirmation or review state.
  - Ensure no workflow data was removed for layout reasons.
  - Note any remaining ambiguity as a follow-up.
- Acceptance criteria:
  - Evidence/release visibility is present across the export workflow.
  - Download/share is not visually treated as available before approval state.
  - Redaction and approval states remain distinct.
- QA evidence:
  - Product-rule checklist for pages 054-058.
  - Screenshots for key export states.
- Out of scope:
  - Real compliance legal review.
  - Backend access-control enforcement.

### AV-SV-05-06 - Regenerate export workflow screenshots

- Objective: Produce phase evidence for export and redaction changes.
- Source finding: P1-09 plus export workflow plan.
- Likely files: `artifacts/strict-visual-review/`.
- Implementation notes:
  - Capture pages 054, 055, 056, 057, and 058 in desktop and mobile.
  - Include modal/approval state for page 057 if applicable.
  - Save screenshots to a non-overwriting artifact folder.
  - Include a small index of route, state, viewport, and file path.
- Acceptance criteria:
  - Export workflow screenshots are complete.
  - Page 056 shows improved redaction composition.
  - No loading states are accepted.
- QA evidence:
  - New export workflow screenshot bundle.
  - Optional contact sheet.
- Out of scope:
  - Full all-route final screenshot run.

## Phase 06 - Modal, Drawer, and Confirmation Context

### AV-SV-06-01 - Define shared sensitive-modal context pattern

- Objective: Create a shared pattern for sensitive modals that preserves enough action context.
- Source finding: P2-01.
- Likely files: `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/state-panel.tsx`, `app/globals.css`.
- Implementation notes:
  - Define how context summary, risk state, entity/action name, and gate reason appear in modal states.
  - Reduce excessive context erasure where the backdrop hides necessary route information.
  - Keep modal accessibility intact.
  - Make the pattern reusable rather than page-specific.
- Acceptance criteria:
  - Sensitive modal pattern is documented in code or task notes.
  - Existing modal consumers can adopt it without visual drift.
  - Backdrop does not fully erase necessary context in reviewed states.
- QA evidence:
  - Screenshot of one adopted modal before broader rollout.
  - Accessibility labels remain present.
- Out of scope:
  - Replacing all modals with drawers.
  - Adding destructive behavior.

### AV-SV-06-02 - Apply context pattern to admin/security/governance/export modals

- Objective: Apply the modal context pattern to listed P2 modal routes.
- Source finding: P2-01.
- Likely files: `components/admin-tenant-setup-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/ui/modal.tsx`.
- Implementation notes:
  - Update pages 007, 009, 010, 049, and 057 where modal context is too hidden.
  - Include compact context summary inside modal or visible surrounding panel.
  - Preserve second-confirmation and permission semantics.
  - Keep route-state screenshot behavior intentional.
- Acceptance criteria:
  - Each listed page shows what is being confirmed or approved.
  - Heavy backdrop no longer removes all useful context.
  - Modal content remains readable on mobile.
- QA evidence:
  - Screenshots for pages 007, 009, 010, 049, 057.
  - Product safety notes for sensitive actions.
- Out of scope:
  - Changing role/permission logic.
  - Removing confirmation steps.

### AV-SV-06-03 - Apply release/block modal context rules

- Objective: Ensure compliance release/block modals preserve workflow context.
- Source finding: P2-01 and product rules.
- Likely files: `components/internal-workflow-screen.tsx`, `components/ui/modal.tsx`, `lib/internal-workflow-demo-data.ts`.
- Implementation notes:
  - Review pages 040 and 041.
  - Include compliance item, evidence state, release/block reason, and client-visibility effect.
  - Keep release and block flows visually distinct.
  - Preserve no-unapproved-advice logic in visible language.
- Acceptance criteria:
  - Release modal clearly shows compliance gate and client visibility implication.
  - Block/request-evidence modal clearly shows why release is not happening.
  - Context remains visible on mobile.
- QA evidence:
  - Screenshots for pages 040 and 041.
  - Product-rule visual checklist.
- Out of scope:
  - Changing release workflow semantics.
  - Sending real client notifications.

### AV-SV-06-04 - Reduce drawer compression of underlying tables

- Objective: Keep drawer-state pages inspectable when drawers are open.
- Source finding: P2-04.
- Likely files: `components/ui/drawer.tsx`, `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/ui/data-table.tsx`.
- Implementation notes:
  - Review pages 046 and 051 with drawer state active.
  - Decide whether drawers should overlay, become full-width at smaller breakpoints, or use a wider breakpoint before compressing tables.
  - Preserve selected record context.
  - Avoid leaving the table unreadable behind the drawer.
- Acceptance criteria:
  - Underlying page remains understandable when drawer is open.
  - Drawer content remains readable.
  - No document-level horizontal overflow is introduced.
- QA evidence:
  - Screenshots for pages 046 and 051 with drawer state.
  - DOM metrics for overflow.
- Out of scope:
  - Removing drawer functionality.
  - Hiding audit/evidence rows.

### AV-SV-06-05 - Verify route-state screenshots remain intentional

- Objective: Confirm `lib/visual-contract.ts` route states still match intended UI states after modal/drawer changes.
- Source finding: P1-05, P2-01, P2-04.
- Likely files: `lib/visual-contract.ts`, `lib/route-registry.ts`, `scripts/visual-qa-contract.ts`.
- Implementation notes:
  - Review visual modes that map to `drawer`, `confirm`, `permission`, `release`, `block`, `approval`, and `invite`.
  - Verify each affected page uses the routed `visualState` prop correctly.
  - Keep default states aligned with reference intent.
  - Avoid global route-state changes that mask page-specific failures.
- Acceptance criteria:
  - Affected route-state screenshots show the intended modal/drawer state.
  - `pnpm visual:contract` stays green.
  - No route-state regression is introduced.
- QA evidence:
  - Visual contract output.
  - Small route-state screenshot set.
- Out of scope:
  - New visual modes unless necessary.
  - Changing route catalogue IDs.

### AV-SV-06-06 - Regenerate modal/drawer screenshot set

- Objective: Produce phase evidence for modal and drawer context changes.
- Source finding: P2-01, P2-04.
- Likely files: `artifacts/strict-visual-review/`.
- Implementation notes:
  - Capture pages 007, 009, 010, 040, 041, 046, 049, 051, and 057 in relevant states.
  - Capture desktop and mobile where the issue was visible.
  - Save screenshots to a new artifact folder.
  - Document any intentionally deferred modal state.
- Acceptance criteria:
  - Screenshots show improved context preservation.
  - Drawer pages remain inspectable.
  - Evidence is non-overwriting.
- QA evidence:
  - Modal/drawer screenshot bundle.
  - Optional contact sheet.
- Out of scope:
  - Full final all-route capture.

## Phase 07 - Polish and Residual Cramped-Text Sweep

### AV-SV-07-01 - Normalize mobile search/filter placeholders

- Objective: Stop mobile search placeholders from clipping awkwardly.
- Source finding: P2-02.
- Likely files: `components/ui/filter-bar.tsx`, `components/top-bar.tsx`, `components/wealth-actions-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/communication-export-ops-screen.tsx`.
- Implementation notes:
  - Identify long placeholders on pages 031, 032, 052, and 056.
  - Add mobile-short placeholder support or shorter shared copy.
  - Preserve accessible labels via `sr-only` or explicit labels.
  - Keep desktop placeholders useful.
- Acceptance criteria:
  - Mobile placeholders do not clip on affected pages.
  - Search inputs retain padding and icon spacing.
  - Accessibility labels remain descriptive.
- QA evidence:
  - Mobile screenshots for pages 031, 032, 052, 056.
  - DOM text/visual check for clipping.
- Out of scope:
  - Removing search inputs.
  - Changing search functionality.

### AV-SV-07-02 - Tighten call-trigger matrix rhythm

- Objective: Improve page 053 matrix scanability.
- Source finding: P2-05.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, shared matrix/table primitives.
- Implementation notes:
  - Review call trigger labels, statuses, and detail density.
  - Increase row/card rhythm using shared spacing where possible.
  - Consider collapsible detail rows or clearer grouped sections.
  - Preserve trigger matrix content and workflow meaning.
- Acceptance criteria:
  - Page 053 desktop matrix is easier to scan.
  - Mobile remains readable.
  - No trigger metadata is removed without another path.
- QA evidence:
  - Desktop/mobile screenshots for page 053.
  - Visual review note in phase report.
- Out of scope:
  - Changing communication trigger logic.
  - Creating a new matrix framework.

### AV-SV-07-03 - Fix roadmap lower-card truncation

- Objective: Prevent roadmap card labels/readouts from truncating awkwardly.
- Source finding: P2-06.
- Likely files: `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`.
- Implementation notes:
  - Review page 062 lower card regions on desktop and mobile.
  - Allow labels to wrap at phrase boundaries or stack metadata below titles.
  - Keep roadmap hierarchy and future-scope distinction visible.
  - Avoid shrinking text as the primary fix.
- Acceptance criteria:
  - Page 062 mobile no longer truncates long readout labels awkwardly.
  - Desktop bottom region has improved rhythm.
  - Roadmap content remains intact.
- QA evidence:
  - Desktop/mobile screenshots for page 062.
  - DOM cramped-text comparison if relevant.
- Out of scope:
  - Changing roadmap scope decisions.
  - Removing roadmap items.

### AV-SV-07-04 - Sweep remaining DOM cramped-text candidates

- Objective: Review and resolve or intentionally defer remaining cramped-text candidates after P1 fixes.
- Source finding: P2-07.
- Likely files: all affected components listed in `strict-review-dom-metrics.json`.
- Implementation notes:
  - Re-run DOM metric extraction after P1 work.
  - Inspect remaining candidate pages visually, not metrics-only.
  - Classify each as fixed, acceptable dense UI, or still failing.
  - Create follow-up notes only for real issues.
- Acceptance criteria:
  - Remaining candidate list is documented.
  - No P1-level cramped issue remains open.
  - Acceptable dense UI decisions include rationale.
- QA evidence:
  - DOM metrics JSON.
  - Manual visual review notes.
- Out of scope:
  - Blindly fixing every metric candidate.
  - Claiming all visual quality from metric pass alone.

### AV-SV-07-05 - Normalize shared padding and chip spacing

- Objective: Improve shared card, badge, chip, table, and control spacing without route drift.
- Source finding: P2-07 and strict review edge-contact criteria.
- Likely files: `app/globals.css`, `components/ui/badge.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx`, `components/ui/card.tsx`, `components/ui/data-table.tsx`.
- Implementation notes:
  - Inspect shared primitives for padding below the strict threshold.
  - Normalize spacing through tokens/classes rather than per-route patches.
  - Preserve compact density where it remains readable.
  - Watch for desktop/mobile breakpoint side effects.
- Acceptance criteria:
  - Shared components have consistent padding and chip rhythm.
  - No visible route-by-route spacing drift is introduced.
  - Dense enterprise layouts remain compact but readable.
- QA evidence:
  - Before/after screenshots for representative routes.
  - Visual review note for shared primitives.
- Out of scope:
  - Rebranding or palette redesign.
  - Large typography scale changes.

### AV-SV-07-06 - Verify no route-by-route padding drift was introduced

- Objective: Confirm polish changes did not create inconsistent AlphaVest surfaces.
- Source finding: design system and strict review surface fidelity criteria.
- Likely files: `app/globals.css`, `components/*`, screenshot contact sheets.
- Implementation notes:
  - Compare affected pages against shared surface classes.
  - Check `av-surface-*`, `av-shell-grid`, `av-topbar`, `av-page`, and `av-page-wide` behavior.
  - Inspect at least one route from each affected phase group.
  - Log deviations and either fix or explicitly justify them.
- Acceptance criteria:
  - Surfaces remain visually homogeneous.
  - Route-specific spacing is justified only where unavoidable.
  - Contact sheets do not reveal obvious drift.
- QA evidence:
  - Contact sheet for affected pages.
  - Notes in implementation QA report.
- Out of scope:
  - Pixel-perfect reference matching.
  - Broad design-system replacement.

## Phase 08 - Verification, Reports, and Handoff

### AV-SV-08-01 - Run type/lint/build gates where available

- Objective: Verify implementation does not break core repo gates.
- Source finding: AGENTS engineering rules and quality gates.
- Likely files: `package.json`, test output, build output.
- Implementation notes:
  - Run available commands such as `pnpm typecheck`, `pnpm lint`, and `pnpm build` if configured.
  - Document exact command outputs or failures.
  - If a command is unavailable or fails for unrelated existing reasons, document the blocker.
  - Do not silently skip build gates.
- Acceptance criteria:
  - All available gates pass or failures are documented with cause.
  - No new type/build failure is introduced by the remediation.
  - Output is recorded in reports.
- QA evidence:
  - Terminal command summaries.
  - Updated QA report.
- Out of scope:
  - Fixing unrelated pre-existing build issues unless required to validate the work.

### AV-SV-08-02 - Run `pnpm visual:contract`

- Objective: Confirm route/reference/forbidden-chrome contract still passes.
- Source finding: visual contract is necessary but not sufficient.
- Likely files: `scripts/visual-qa-contract.ts`, `lib/visual-contract.ts`, `artifacts/visual-qa/visual-contract-result.json`.
- Implementation notes:
  - Run contract with live base URL when a dev server is active.
  - Confirm 63 routes and 63 assets are checked.
  - Confirm no forbidden chrome terms leak into rendered UI.
  - Preserve the result JSON.
- Acceptance criteria:
  - Contract returns zero failures.
  - Result JSON records 63 checked assets and 63 checked routes.
  - Any failure is fixed or documented before final handoff.
- QA evidence:
  - `artifacts/visual-qa/visual-contract-result.json`.
  - Command output summary.
- Out of scope:
  - Treating this as final visual QA.
  - Relaxing forbidden chrome checks to pass.

### AV-SV-08-03 - Regenerate strict screenshot bundle

- Objective: Produce final all-route visual proof after fixes.
- Source finding: strict review acceptance gate.
- Likely files: `artifacts/strict-visual-review/`.
- Implementation notes:
  - Capture all 63 desktop screenshots.
  - Capture all 63 mobile screenshots.
  - Wait for route content rather than accepting loading states.
  - Save to a new non-overwriting artifact folder.
- Acceptance criteria:
  - 126 screenshots captured.
  - 0 loading-state final screenshots.
  - 0 capture errors or documented limitations.
- QA evidence:
  - New screenshot folder and index.
  - Capture summary.
- Out of scope:
  - Replacing reference assets.
  - Deleting old evidence.

### AV-SV-08-04 - Regenerate DOM geometry/cramped-text metrics

- Objective: Provide final DOM-level evidence for overflow and cramped text candidates.
- Source finding: strict review DOM metric baseline.
- Likely files: `artifacts/strict-visual-review/`, DOM metric harness.
- Implementation notes:
  - Run final DOM metric extraction across all 63 pages and mobile/desktop viewports.
  - Count document-level horizontal overflow.
  - Count remaining cramped-text candidates.
  - Compare final metrics to baseline.
- Acceptance criteria:
  - No document-level horizontal overflow unless explicitly documented and accepted.
  - P1-related cramped candidates are closed.
  - Remaining P2 candidates are documented.
- QA evidence:
  - Final metrics JSON.
  - Metrics summary in QA report.
- Out of scope:
  - Declaring all visuals perfect based only on metrics.

### AV-SV-08-05 - Rebuild desktop/mobile contact sheets

- Objective: Make final screenshot review efficient and auditable.
- Source finding: strict review used contact sheets for all pages.
- Likely files: `artifacts/strict-visual-review/`.
- Implementation notes:
  - Generate desktop contact sheets covering all 63 pages.
  - Generate mobile contact sheets covering all 63 pages.
  - Generate anchor pairs for high-risk pages if possible.
  - Store generated sheets in the final artifact folder.
- Acceptance criteria:
  - Contact sheets include all pages.
  - High-risk pages are easy to locate.
  - Sheets do not overwrite the baseline review evidence.
- QA evidence:
  - Final contact sheet PNG/HTML files.
- Out of scope:
  - Manual image editing.
  - Replacing screenshot source files.

### AV-SV-08-06 - Update strict visual review status

- Objective: Update the strict review with the outcome of remediation.
- Source finding: `STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`.
- Likely files: `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`, final screenshot artifacts.
- Implementation notes:
  - Add an implementation status section or separate follow-up status table.
  - Mark P1 findings as fixed, still open, or deferred with reason.
  - Mark P2 findings as fixed, still open, or deferred with reason.
  - Link to final artifact folder.
- Acceptance criteria:
  - Review document no longer implies baseline findings are current if fixed.
  - Residual risks are explicit.
  - Evidence paths are listed.
- QA evidence:
  - Documentation diff.
  - Final artifact path references.
- Out of scope:
  - Rewriting the original review history.
  - Removing baseline findings.

### AV-SV-08-07 - Update phase QA reports

- Objective: Keep required project reports current after remediation.
- Source finding: AGENTS required reporting after each phase.
- Likely files: `docs/v3/PHASE_EXECUTION_REPORT.md`, `docs/v3/IMPLEMENTATION_QA_REPORT.md`.
- Implementation notes:
  - Add changed files.
  - Add tests run and results.
  - Add screenshot/DOM evidence paths.
  - Add unresolved risks or TODOs.
- Acceptance criteria:
  - Reports list the strict visual remediation phases completed.
  - Tests and evidence are reproducible.
  - Residual issues are not hidden.
- QA evidence:
  - Documentation diff.
  - Test command summaries.
- Out of scope:
  - Creating a marketing handoff.
  - Claiming production compliance.

### AV-SV-08-08 - Prepare handoff summary

- Objective: Produce a concise final handoff for the strict visual remediation.
- Source finding: project reporting and handoff discipline.
- Likely files: `docs/v3/FINAL_HANDOFF_REPORT.md` or phase-specific handoff section, `docs/v3/IMPLEMENTATION_QA_REPORT.md`.
- Implementation notes:
  - Summarize phases completed.
  - List changed files and major shared primitives touched.
  - List commands run and artifact paths.
  - Call out residual P2/deferred items and recommended next phase.
- Acceptance criteria:
  - Another engineer can continue without rediscovering the context.
  - Handoff separates fixed, deferred, and out-of-scope items.
  - Evidence paths and commands are concrete.
- QA evidence:
  - Handoff section or document.
  - Git status summary before final response.
- Out of scope:
  - Commit creation unless explicitly requested.
  - New implementation after final verification.

## Cross-Phase Dependency Map

| Blocker | Depends on | Why |
| --- | --- | --- |
| Phase 02 table candidates | Phase 00 ownership map | Prevents route-specific table patches. |
| Phase 03 graph/board verification | Phase 00 screenshot protocol | Needs before/after anchor evidence. |
| Phase 04 workflow layout | Phase 02 display decisions | Dense workflow pages may use table/card primitives. |
| Phase 05 export workflow | Phase 02 and Phase 06 patterns | Export pages use tables, previews, modals, and approvals. |
| Phase 06 modal/drawer rollout | Phase 04/05 layout decisions | Modal context should match final workflow composition. |
| Phase 07 polish | All P1 phases | Avoid polishing layouts that will be reworked. |
| Phase 08 final proof | Phases 01-07 | Requires completed remediation. |

## Suggested Phase-Level Commands

- After shell/shared component work: `pnpm typecheck`
- After visual state or route changes: `pnpm visual:contract`
- After broad UI changes: `pnpm lint`
- Before final handoff: `pnpm build`
- For final proof: run strict screenshot capture, DOM metrics, and contact-sheet generation into a non-overwriting artifact folder.

## V3 Proof Notes

- Evidence base: strict screenshot review, route catalogue, visual contract result, DOM metrics, contact sheets, and AGENTS rules.
- Preserved branch: shared-first remediation with route-specific finishing only where necessary.
- Rejected branch: isolated per-screen CSS patches and font-size reduction as the default escape hatch.
- Remaining uncertainty: exact implementation effort depends on current component coupling, especially phase-specific shells and screen modules.

## V2 Method Notes

- Psycho-Logic / Map: the plan optimizes operator trust and scanability, not just route coverage.
- Reframing: the problem is professional readability under constraints, not missing routes.
- TRIZ: dense data and mobile width are solved through representation changes rather than hidden content.
- SIT: existing `AppShell`, UI primitives, route-state registry, demo data, and screenshot tooling are the closed-world resources.
- Morphology: shell, table, graph, workflow, export, modal/drawer, and QA tracks are separated but sequenced.
- SCAMPER: substitute mobile tables with row cards, adapt shell into drawer navigation, rearrange compliance/export layouts, eliminate spacing drift.
- Harvard/BATNA: the fair alternative to full remediation is documented P2 deferral, not pretending contract green equals visual quality.
- MESO: shared-first plan is preferred; P1-only triage is acceptable only if timeboxed; route-specific patching is rejected.
- Measurement: screenshot bundles, DOM metrics, visual contract, type/lint/build, and phase reports.
- Ethics/Fairness: product safety gates remain visible; no hiding evidence/audit/redaction data.

## Method Compliance Checklist

- All 55 plan tasks are detailed.
- Facts are grounded in the strict review, plan, AGENTS, and inspected source files.
- Proposed work stays within visual remediation and verification.
- Product rules are preserved.
- Weak implementation branches are rejected.
- Acceptance criteria and QA evidence are specified per task.
- Detailed tasks remain implementation-ready without silently performing the implementation.
