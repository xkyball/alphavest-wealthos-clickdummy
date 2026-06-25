# ALPHAVEST WP-01 Process-First Route/Nav Shell Execution

Generated: 2026-06-25
Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_BOC_TICKET_STRUCTURE.md`
Status: `IMPLEMENTED_WITH_EXTERNAL_FULL_SUITE_BLOCKER`

## Source Contract

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` remains the only operative source of truth. WP-00 technical guard passed before this WP-01 work began.

Executed preflight:

```bash
git status --short
git branch --show-current
git log -1 --oneline
git diff --stat
cat package.json
pnpm guard:source
```

Preflight result: branch `full-workflow`, baseline commit `fb3467e guard: add wp00 source target validation`, clean working tree before WP-01 edits, and `pnpm guard:source` PASS.

## Extracted Task Chain

### WP-01 Epic: Process-First Route/Nav Shell

Type: Epic.

Purpose: Move AlphaVest from screen-first or route-first navigation toward a short, process- and role-based route/navigation shell without blindly deleting routes or weakening safety/scope rules.

Goal: Specify and later implement a process-owned primary navigation. Old technical routes remain visible only where they are MVP/MVP_SUPPORT and role/flow relevant. P1, reference-only and hold routes are not elevated into MVP navigation. Deep links stay controlled unless explicitly blocked.

Scope: current route/nav shell analysis; process-first navigation structure; visible nav groups; hidden/deep-link routes; blocked/deferred routes; role/scope UI-shell visibility; Sidebar/App Shell integration after approval; route reachability and deep-link preservation; QA against scope, stop rules, route smoke and visible navigation.

Out of scope: route deletion without separate approval; screen/image/state-screen generation; visual asset creation; Prisma/schema changes; API creation; P1/Hold elevation; safety-policy redefinition; treating PNGs as behaviour proof.

Completion criteria: current nav surfaces analysed; process-first navigation with scope/role/deep-link policy specified; human approval for nav collapse and route visibility exists; 71-route primary navigation is not exposed; MVP/MVP_SUPPORT/P1/Reference/Hold rules are respected; deep links are controlled; P0/safety rules are not weakened; route/nav checks pass or findings are documented.

### ANALYSIS-01.1: Current Route/Nav Shell Audit

Type: Analysis / Research / Spike.

Detailed description: Inspect the current code slice for Sidebar, App Shell, Route Registry, catch-all renderer, Demo Session context and relevant tests before implementation. The task determines which files control visible navigation, whether navigation is derived from route registry, hardcoded sidebar items or a separate config, which routes appear visibly, how deep-link resolution works, how role/tenant context is available, which tests would break, and where process-first navigation should be technically anchored.

Expected output: findings register, file/module/test list, current navigation source, deep-link dependencies, P1/Reference/Hold risk map, implementation split, CTES estimate and specification inputs.

Execution result: Complete.

Current findings:

- Visible navigation is already model-driven through `lib/navigation.ts`.
- `components/sidebar.tsx` consumes `navigationGroupsForRole(session.role)`.
- `components/app-shell.tsx` wraps the app in `DemoSessionProvider` and renders `Sidebar` plus `TopBar`.
- `components/top-bar.tsx` preserves tenant/role context and displays route scope/context; it does not enforce payload visibility.
- `app/[...segments]/page.tsx` resolves registered routes through `matchRouteBySegments()` and `routeSmokeList`, then renders route-specific components or `RouteSkeletonPage`.
- `lib/route-registry.ts` still owns the 71-route registry, scope classes and route smoke paths.
- `lib/ux-route-policy.ts` maps page IDs into process/workspace labels, route policy labels and page types.
- `tests/navigation-shell.spec.ts` already checks process-first navigation labels, active parent mapping, mobile nav behavior and reference-only exclusion.
- `tests/route-smoke.spec.ts` already checks route reachability, productive navigation page IDs and P1/Reference/Hold exclusion.

Current nav model facts:

- Internal/admin-like roles currently receive 8 visible groups: `Setup`, `Client Workspace`, `Evidence`, `Advisory Workbench`, `Compliance`, `Decisions`, `Governance`, `Export`.
- Internal/admin-like roles currently receive 32 productive nav links, not 71.
- Client/principal role receives visible links in `Client Workspace`, `Evidence`, `Decisions` and locked placeholders for internal groups.
- Productive navigation excludes P1 page IDs `052`, `053`, `059`, `060`, `068`; reference page IDs `061`, `062`, `063`; and hold page IDs `064`, `065`, `066`, `067`, `069`, `070`, `071`.

Candidate file classification:

- Update required after decision: `lib/navigation.ts`, `components/sidebar.tsx`, `tests/navigation-shell.spec.ts`, possibly `tests/route-smoke.spec.ts`.
- Confirm only: `components/app-shell.tsx`, `components/top-bar.tsx`, `app/[...segments]/page.tsx`, `lib/route-registry.ts`, `lib/ux-route-policy.ts`.
- Do not touch in WP-01 without separate approval: Prisma schema, API routes, visual assets, route registry scope classifications.

Initial CTES:

- `IMPL-01.4`: CTES 8. Existing `lib/navigation.ts` means this may be a refinement task, not a greenfield task.
- `IMPL-01.5`: CTES 12. Visible shell integration remains plan-first because it changes Sidebar/App Shell behavior and requires screenshots.
- `IMPL-01.6`: CTES 10. Existing route preservation exists, but policy choice for P1/Reference/Hold remains decision-sensitive.

### SPEC-01.2: Process-First Navigation And Deep-Link Policy

Type: Specification / Design / Acceptance Criteria.

Detailed description: Define implementation-ready rules for process-first route/navigation shell work so Codex does not infer product navigation scope. The spec covers target primary navigation, role/scope visibility, deep-link retention, treatment for MVP/MVP_SUPPORT/P1/REFERENCE_ONLY/HOLD_PENDING_DECISION, mapping from older route groups to process/worksurface groups, implementation boundaries and acceptance criteria.

Execution result: Complete and ready for human decision.

Recommended target policy:

1. Keep route registry intact. WP-01 changes navigation visibility, not route truth.
2. Keep the existing central nav-model pattern in `lib/navigation.ts`; do not introduce a second competing nav source.
3. Use 8 primary internal groups for this pass: `Setup`, `Client Workspace`, `Evidence`, `Advisory Workbench`, `Compliance`, `Decisions`, `Governance`, `Export`.
4. Do not show `Communication`, `Operations`, `Elevated Reviews` or `Reference Lab` as primary navigation in this WP-01 pass.
5. Keep P1 routes hidden from primary nav by default.
6. Keep reference-only routes hidden from product navigation; no visible `Reference Lab` unless you explicitly approve an internal-only reference mode.
7. Keep hold routes hidden/blocked; no active MVP navigation.
8. Preserve deep links and route-smoke resolution for registered routes unless a later policy explicitly blocks a route.
9. Client-facing roles may see client-safe groups and locked internal workspace placeholders, but locked placeholders must keep saying route access is not payload/action authority.
10. Navigation filtering must remain UI-shell guidance only; it is not RBAC, payload visibility or action permission.

Acceptance criteria:

- Internal role sidebar shows process-owned groups, not a flat 71-route list.
- Client-facing role does not receive actionable internal workbench/advisor/compliance/governance/export nav links.
- P1 routes `052`, `053`, `059`, `060`, `068` are not promoted to MVP navigation.
- Reference routes `061`, `062`, `063` are not productized.
- Hold routes `064`, `065`, `066`, `067`, `069`, `070`, `071` are not active MVP nav items.
- Existing deep links to registered MVP/MVP_SUPPORT routes still resolve.
- Route-smoke remains green or changes are explained as intentional route policy changes.
- Safety-sensitive labels do not imply compliance release, client acceptance, evidence sufficiency or export approval.

Implementation boundaries:

- May update `lib/navigation.ts`, `components/sidebar.tsx`, and navigation tests after approval.
- May add or refine nav tests for group count, productive page IDs, client/internal role differences and active-parent highlighting.
- Must not delete routes.
- Must not reclassify route scopes.
- Must not change Prisma/API/product safety logic.
- Must not generate screens/images/state-screen assets.

### DECISION-01.3: Approve Navigation Collapse And Route Visibility Policy

Type: Decision / Approval.

Detailed description: Human approval of process-first navigation groups, collapse aggressiveness, deep-link retention and visibility treatment for MVP/MVP_SUPPORT/P1/Reference/Hold. This prevents Codex from making product/navigation decisions independently.

Status: Approved by user on 2026-06-25.

Decision result:

- Aggressive nav collapse approved.
- Cleanest-solution bias approved for downstream implementation.
- P1, Reference and Hold routes remain hidden by default.
- Deep links remain technically resolvable.
- No route deletion authorized in WP-01.

Decision needed:

- Approve aggressive nav collapse: `yes/no`.
- Approve visible internal groups: `Setup`, `Client Workspace`, `Evidence`, `Advisory Workbench`, `Compliance`, `Decisions`, `Governance`, `Export`.
- Decide whether `Communication` and `Operations` stay hidden by default or appear as disabled/support groups.
- Decide whether `Elevated Reviews` stays hidden/held or appears as a disabled internal group.
- Decide whether a `Reference Lab` exists at all.
- Confirm P1 hidden by default.
- Confirm Reference hidden by default.
- Confirm Hold hidden/blocked by default.
- Confirm no route deletion in WP-01.

Recommendation:

- Approve aggressive collapse.
- Keep the 8 current visible internal groups.
- Hide P1, Reference and Hold by default.
- Keep deep links.
- Do not create Reference Lab yet.
- Do not delete routes.
- Proceed to implementation only as refinement/hardening of the existing nav model, not as a full rebuild.

### IMPL-01.4: Introduce Process-First Navigation Model/Config

Type: Implementation / Execution.

Detailed description: Create or adapt a central process-first navigation model/config so visible navigation is derived from process-owned groups, route scope and role/audience rules instead of old route-first or hardcoded 71-route patterns.

Status: Complete.

Current implementation state: Partially/mostly present. `lib/navigation.ts` already defines typed navigation groups, items, scope-aware route inclusion and role-based group locking.

Expected future work after approval:

- Refine `lib/navigation.ts` to approved group policy.
- Encode any new hidden/deferred/reference/hold semantics explicitly if not already covered.
- Add static tests if the approved policy differs from the current state.

#### SUBTASK-01.4.1: Define Process-Owned Nav Groups From Locked Work Surfaces

Detailed description: Define top-level navigation groups as process-owned groups in the nav model so screen-first menu logic is replaced by process logic.

Status: Complete.

Current implementation state: Present with 8 internal visible groups. Upload's longer candidate list includes Communication, Operations, Elevated Reviews and Reference Lab as conditional groups; those need explicit decision before exposure.

#### SUBTASK-01.4.2: Map Route IDs To Nav Visibility Classes

Detailed description: Map routes to visibility classes: primary nav, secondary nav, deep-link-only, P1-deferred, reference-only and hold-blocked.

Status: Complete.

Current implementation state: Present in combined form through `lib/navigation.ts`, `lib/ux-route-policy.ts`, `routeScopeForPageId()`, `productiveNavigationPageIds` and tests. Productive nav IDs exclude P1/Reference/Hold.

### IMPL-01.5: Integrate Role-Aware Nav Into Sidebar/App Shell

Type: Implementation / Execution.

Detailed description: Adapt Sidebar/App Shell so they render the process-first nav model and filter visible navigation by role/audience/scope where UI-shell context exists, without replacing payload visibility or action permissions.

Status: Complete.

Current implementation state: Present. `components/sidebar.tsx` renders `navigationGroupsForRole(session.role)` from `lib/navigation.ts`. `components/top-bar.tsx` preserves tenant/role context and route-scope messaging.

Expected future work after approval:

- Adjust Sidebar only if approved policy differs from current state.
- Screenshot desktop and mobile Sidebar after any UI change.
- Preserve locked internal group wording for client roles.

#### SUBTASK-01.5.1: Refactor Sidebar To Consume Nav Model

Detailed description: Refactor Sidebar from hardcoded or route-first rendering to the process-first nav model.

Status: Complete.

#### SUBTASK-01.5.2: Preserve Role/Tenant Context Display Without Payload Overclaim

Detailed description: Preserve role/tenant context in App Shell/TopBar/Sidebar and use it only for UI-shell visibility, not as payload permission.

Status: Complete.

Current evidence: `TopBar` displays active context, route scope and internal/client actor mode. Existing tests assert locked client-role groups and no payload-authority implication.

#### SUBTASK-01.5.3: Remove 71-Route Exposure From Primary Nav

Detailed description: Reduce visible primary navigation so all 71 registered routes are not displayed as a menu structure.

Status: Complete.

Current evidence: internal roles see 32 nav links, not 71; protected P1/Reference/Hold page IDs are excluded from `productiveNavigationPageIds`.

### IMPL-01.6: Preserve Deep Links And Blocked/Deferred Route Handling

Type: Implementation / Execution.

Detailed description: Ensure registered routes remain controlled and technically resolvable while visible navigation follows scope policy. Deep-link/detail/success/support/reference/held routes must not break because primary navigation is collapsed.

Status: Complete.

Current implementation state: Present. `app/[...segments]/page.tsx` resolves registered routes independently from Sidebar visibility. `routeSmokeList` keeps registered route coverage. Protected route scopes have explicit page types and exclusion reasons.

#### SUBTASK-01.6.1: Keep Registered Route Resolution Intact

Detailed description: Ensure nav collapse does not remove or break route registry/catch-all route resolution.

Status: Already present; no route deletion needed or recommended.

#### SUBTASK-01.6.2: Add P1/Reference/Hold Visibility Semantics In Navigation Layer

Detailed description: Implement P1, reference-only and hold visibility semantics so these routes cannot look like active MVP product navigation.

Status: Complete.

Current evidence: P1 `052`, `053`, `059`, `060`, `068`; Reference `061`, `062`, `063`; Hold `064`, `065`, `066`, `067`, `069`, `070`, `071` stay outside productive navigation.

### QA-01.7: Navigation Shell Validation And Regression Review

Type: QA / Validation / Review.

Detailed description: Validate the process-first route/nav shell against specification, route scope, no-generation rules and regression expectations.

Status: Complete for WP-01 scope.

Prepared QA plan:

```bash
pnpm guard:source
pnpm test:source-reality
pnpm playwright test tests/navigation-shell.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
```

Screenshot plan if UI changes are approved:

- Desktop internal/admin role Sidebar.
- Desktop principal/client-safe role Sidebar.
- Mobile Sidebar open state.

Final QA checklist after implementation:

- Primary nav is process-owned, not 71-route list.
- MVP/MVP_SUPPORT entry points are reachable.
- Deep-link-only routes remain resolvable where expected.
- P1/Reference/Hold routes are hidden/deferred/blocked according to decision.
- Client-facing role does not get actionable internal links.
- Admin/internal role does not get release/evidence/export bypass through nav.
- Route access is not described as payload visibility.
- No Prisma/API/schema/screen/image changes.

## Post-Decision Execution Result

Execution date: 2026-06-25.

Implemented changes:

- Collapsed `lib/navigation.ts` from multi-entry route/workspace navigation to exactly eight process-owned internal primary entries: `Access & tenant setup`, `Client context`, `Evidence workspace`, `Internal workbench`, `Compliance release`, `Decision & evidence record`, `Governance / RBAC / audit`, `Export & redaction`.
- Kept client/principal role navigation client-safe: `Client context`, `Evidence workspace`, `Decision & evidence record`; locked internal groups remain non-actionable.
- Removed visible `Communication`, `Ops`, `Elevated Reviews` and Reference Lab exposure from primary navigation.
- Preserved active-parent coverage for folded setup, client, evidence, advisory, compliance, decision, governance and export routes.
- Normalized route-specific legacy sidebars in `components/client-intake-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx` and `components/communication-export-ops-screen.tsx` so real visible screens no longer expose old route-list menus.
- Added/updated tests in `tests/navigation-shell.spec.ts` and `tests/route-smoke.spec.ts` for eight-link policy, P1/Reference/Hold exclusion, route reachability and active parent behavior.

Files changed:

- `lib/navigation.ts`
- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/navigation-shell.spec.ts`
- `tests/route-smoke.spec.ts`
- `docs/00-current/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_EXECUTION.md`

Proof artefacts:

- `artifacts/wp01-route-nav-shell/desktop-internal-process-nav.png`
- `artifacts/wp01-route-nav-shell/desktop-principal-client-safe-nav.png`
- `artifacts/wp01-route-nav-shell/mobile-internal-nav-open.png`

Validation completed:

```bash
pnpm guard:source
pnpm test:source-reality
pnpm exec tsc --noEmit --pretty false
pnpm db:validate
pnpm lint
pnpm build
pnpm playwright test tests/navigation-shell.spec.ts
pnpm playwright test tests/route-smoke.spec.ts --grep "registered route smoke|UX-NAV"
```

Validation result:

- `pnpm guard:source`: PASS.
- `pnpm test:source-reality`: PASS, 8 passed.
- `pnpm exec tsc --noEmit --pretty false`: PASS.
- `pnpm db:validate`: PASS.
- `pnpm lint`: PASS with 29 pre-existing warnings.
- `pnpm build`: PASS with pre-existing Turbopack document-storage tracing warnings.
- `tests/navigation-shell.spec.ts`: PASS, 9 passed.
- `tests/route-smoke.spec.ts --grep "registered route smoke|UX-NAV"`: PASS, 79 passed.

Known external blocker:

- Full `pnpm playwright test tests/route-smoke.spec.ts` was started and then intentionally interrupted after repeated failures in the existing `UX-PAGE workbench structure` block. The failures wait for `data-testid="product-guidance"` / `ux-page-workbench-triad` artefacts that are not rendered by the current app shell and are outside WP-01 route/navigation collapse. This is recorded as an external stale-test/product-guidance blocker, not as a WP-01 nav regression.

Recommended next decision:

- Create a separate WP/task for the stale `UX-PAGE workbench structure` Product Guidance assertions: either restore a real product-guidance/workbench-triad surface or update those tests to the current accepted shell contract.

## Engine Notes

Facts: the upload mandates analysis, specification, human decision, implementation and QA; WP-00 guard passed; the user approved aggressive collapse; implementation is now complete for WP-01 scope.

Assumptions: route deletion, Reference Lab creation and P1/Hold elevation remain out of scope because the user approved the aggressive clean hidden-by-default policy, not registry deletion.

V3 weak branch killed: route deletion and Reference Lab exposure were rejected because they create higher drift/risk than the approved hidden-by-default policy.

Ethics/fairness: no hidden product promise is introduced; route visibility remains separate from payload/action authority; client role receives only client-safe actionable links.
