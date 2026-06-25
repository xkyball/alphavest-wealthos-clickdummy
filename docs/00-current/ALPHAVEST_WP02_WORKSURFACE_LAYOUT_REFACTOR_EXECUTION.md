# ALPHAVEST WP-02 — Worksurface Layout Refactor Execution

Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_BOC_TICKET_STRUCTURE.md`

Execution date: 2026-06-25.

Operative source of truth: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.

Baseline:

- Branch: `full-workflow`
- Baseline commit: `3268161 refactor: consolidate wp01 shell navigation`
- Working tree before WP-02 edits: clean
- `pnpm guard:source`: PASS
- WP-00 technical guard: present and passing
- WP-01 / WP01.8 process navigation: present through `components/process-navigation.tsx`, `ProcessSidebar`, and `tests/navigation-shell.spec.ts`

## Extracted Task Chain

The upload defines WP-02 as a delivery chain, not a single direct implementation task. Parent WP-02 is CTES 15/20, so direct whole-package implementation is explicitly not allowed.

### EPIC: WP-02 — Process-first Worksurface Layout Refactor

Detailed description: Convert the current 71-route/screen-sprawl model into compact process-owned Worksurfaces. Existing routes and screen components remain material and deep-link surfaces; the target UX should no longer expose or depend on a long technical route list.

Goal: Replace screen sprawl with compact Worksurfaces while preserving route scope, no-generation rules and safety boundaries.

Scope: Analysis, specification, shared Worksurface shell, split implementation by Worksurface slice, and QA.

Out of scope: Route deletion, visual generation, pixel-copy, API/schema changes, safety implementation, P1/Hold unlock.

Completion criteria: Analysis and spec complete; slice order approved; selected implementation slices complete or deferred; compact process surfaces replace long isolated screens; route/deep-link/safety boundaries remain intact.

### ANALYSIS-WP02-01 — Existing Screen / Component / Layout Inventory

Detailed description: Analyze current route/screen/component layout ownership and map existing material to target Worksurfaces.

Questions answered:

- Which components render which route groups?
- Which pages are long, fragmented or sparse?
- Which materials should become Worksurface panels?
- Which routes remain technical deep links?
- Which MVP/MVP_SUPPORT Worksurfaces should come first?
- Which layout primitives already exist?
- Which screens must stay out of WP-02?

Output expected by upload: Findings table, Worksurface slice sequence, affected files, risks/blockers, implementation split and CTES.

Execution result: Complete in this artefact.

### SPEC-WP02-01 — Target Worksurface Layout Architecture

Detailed description: Specify the Worksurface layout architecture, panel composition, route/deep-link preservation and implementation boundaries so Codex can implement without inventing product scope.

Output expected by upload: Target state, scope, acceptance criteria, implementation slices, no-generation/no-safety-change/no-route-deletion rules and QA design.

Execution result: Complete in this artefact.

### DECISION-WP02-01 — Approve Implementation Slice Order

Detailed description: Review and approve which Worksurface slices Codex implements first and confirm PR/slice boundaries.

Decision needed by upload:

- First slice: Access & Tenant Setup or Client Context + Evidence.
- Delivery model: one Epic with several implementation commits/PRs, or separate parent tasks per Worksurface slice.
- Deferred areas: keep P1/Hold/Reference only as registered/deferred surfaces.

Execution result: Reached. This is the active stop gate before code implementation.

Aggressive recommendation: approve a single WP-02 Epic with separate commits per slice; implement `IMPL-WP02-01` first, then `IMPL-WP02-03 Client Context + Evidence` as the first product slice, then `IMPL-WP02-04` split into Internal, Advisor, Compliance, then `IMPL-WP02-05` split into Decision/Governance/Export, and only then `IMPL-WP02-02 Access & Tenant Setup` unless auth/setup becomes commercially urgent.

Reason: Client Context + Evidence removes the highest visible screen-sprawl and creates the cleanest foundation for WP-04 Evidence Workflow. Access/Tenant is important but mostly setup/support and already has less product-surface leverage.

### IMPL-WP02-01 — Shared Worksurface Shell / Layout Primitives

Detailed description: Create/refine shared layout primitives that allow old screen content to be recomposed into compact process-owned panels.

Subtask WP02-01.1: Create or refine `WorksurfaceShell`.

- Define typed props for heading, process summary, primary content, secondary panels and action/status area.
- Provide compact header, process summary, primary panel, secondary panel grid and optional action/state rail.
- Avoid data/state/safety semantics.
- Preserve route mounting and deep-link compatibility.

Execution status: Blocked until `DECISION-WP02-01` is approved.

### IMPL-WP02-02 — Access & Tenant Setup Worksurface Slice

Detailed description: Refactor routes/material `001–018` into a compact Access & Tenant Setup Worksurface.

Subtasks:

- Recompose identity, MFA, consent, role confirmation, tenant, team, policy and user material into compact setup panels.
- Preserve demo/auth limitations.
- Keep production IAM, MFA backend, tenant CRUD and RBAC safety proof out of scope.

Execution status: Blocked until shell/spec/decision.

### IMPL-WP02-03 — Client Context + Evidence Worksurface Slice

Detailed description: Refactor client context and evidence material into compact Worksurface layouts.

Subtasks:

- Client Context: routes/material `019–026`, `031–032`; profile, family, relationship, entity, wealth map and actions become context panels.
- Evidence: routes/material `027–030`, `046–047`; document list, upload, extraction review, verification and evidence record become lifecycle panels.
- Preserve upload-only language; do not imply evidence sufficiency, client release or visibility proof.

Execution status: Blocked until shell/spec/decision.

### IMPL-WP02-04 — Internal Workbench / Advisor / Compliance Worksurface Slice

Detailed description: Refactor internal workbench, advisor review and compliance release areas into process-owned layouts without changing workflow gates.

Split required because CTES is 13/20.

Subtask A: Internal Workbench layout slice.

- Routes/material `033–035`.
- Structure signal, trigger, action and draft content into internal-only panels.
- Preserve no client-facing draft exposure.

Subtask B: Advisor Review layout slice.

- Routes/material `036–037`.
- Structure queue, detail, evidence and options into advisor desk panels.
- Preserve advisor approval is not release.

Subtask C: Compliance Release layout slice.

- Routes/material `038–042`.
- Structure preconditions, evidence state, release/block actions and audit context into compliance desk panels.
- Preserve compliance release as distinct and required.

Execution status: Blocked until shell/spec/decision.

### IMPL-WP02-05 — Decision / Evidence Record / Governance / Export Layout Slice

Detailed description: Refactor decision record, governance and export material into compact process Worksurfaces.

Split required because CTES is 13/20.

Subtask A: Decision & Evidence Record layout.

- Routes/material `043–047`.
- Recompose decision status, rationale, evidence links and audit timeline into compact record panels.
- Do not imply audit persistence beyond existing proof.

Subtask B: Governance Safety Console layout.

- Routes/material `007–012`, `017–018`, `048–051`.
- Recompose role, user, policy, access request and audit history material.
- Preserve admin non-bypass.

Subtask C: Export & Redaction Studio layout.

- Routes/material `054–058`.
- Recompose scope, redaction, preview, approval and download/share.
- Preserve preview != approval and download/share != client acceptance.

Execution status: Blocked until shell/spec/decision.

### QA-WP02-01 — Worksurface Layout Regression and Stop-Rule Validation

Detailed description: Validate implemented Worksurface slices against layout spec, route stability, no-generation rules and safety wording boundaries.

Checklist:

- `full-workflow` remains target.
- `main` is not used.
- Route scope labels are preserved.
- Deep links still work or are explicitly mapped.
- Visible navigation remains process-first from WP-01.
- Worksurfaces render compact panels.
- No screen/image generation in diff.
- No unauthorized route registry deletion.
- No Prisma/migration changes.
- No new API routes.
- Safety copy preserves upload-only, advisor-not-release, compliance-required, fail-closed client visibility, admin non-bypass and export lifecycle separation.

Execution status: Blocked until at least one implementation slice is complete.

## ANALYSIS-WP02-01 Result

### Current Component Ownership

| Current component | Current route/material range | Current layout pattern | Target Worksurface |
| --- | --- | --- | --- |
| `AuthOnboardingScreen` | `001–006` | Standalone auth/onboarding canvas | Access & Tenant Setup |
| `AdminTenantSetupScreen` | `007–018` | Mixed admin/setup pages, some hub usage | Access & Tenant Setup + Governance Safety Console |
| `ClientIntakeScreen` | `019–030` | Client shell, hub/detail/list pages | Client Context + Evidence |
| `WealthActionsScreen` | `031–032` | Wealth/action surfaces in process sidebar | Client Context + Evidence |
| `InternalWorkflowScreen` | `033–042` | Hub/detail/decision panels, internal shell | Internal Workbench / Advisor / Compliance |
| `DecisionsGovernanceScreen` | `043–051` | Decision, evidence, governance pages with dense/detail primitives | Decision Record + Governance Safety Console |
| `CommunicationExportOpsScreen` | `052–063` | Export, comms, ops, references; export has dense/detail primitives | Export & Redaction Studio; P1/Reference remain deferred |
| `KycAmlWorkflowScreen` | `064–065` | Hold/P1-style internal review shell | Out of current WP-02 implementation unless explicitly unlocked |
| `SuitabilityIpsScreen` | `066–067` | Hold/P1 suitability/IPS shell | Out of current WP-02 implementation unless explicitly unlocked |
| `ReviewMonitoringScreen` | `068–069` | P1/Hold review-monitoring shell | Out of current WP-02 implementation |
| `CommitteeReviewScreen` | `070–071` | Hold committee shell | Out of current WP-02 implementation |
| `RouteSkeletonPage` | Registered-only routes | Guarded placeholder for protected surfaces | Preserve, do not elevate |

### Current Worksurface-Relevant Primitives

| Primitive | Current role | WP-02 assessment |
| --- | --- | --- |
| `ProcessSidebar` / `ProcessNavigation` | Process-first navigation from WP01.8 | Keep as shell foundation |
| `ProductGuidanceContent` | Page-level guidance wrapper | Keep, but do not treat as Worksurface layout contract |
| `UxHubPage` | Hub summaries for key page IDs | Reuse inside Worksurface shell |
| `UxDenseOperationsPanel` | Dense operations/table pattern | Reuse as a panel convention |
| `UxDetailStandardPanel` | Detail/review/action-rail pattern | Reuse as a panel convention |
| `Card`, `StatePanel`, `DataTable`, `AuditTimeline`, `EvidenceList` | Shared UI primitives | Reuse; avoid new one-off surface styling |

### Current Route-to-Worksurface Map

| Target Worksurface | Page IDs | Primary visible entry after WP01.8 | Route treatment |
| --- | --- | --- | --- |
| Access & Tenant Setup | `001–018` | `015` | One process entry; others deep/support |
| Client Context | `019–026`, `031–032` | `019` | Client context entry; details remain deep/support |
| Evidence Workspace | `027–030`, `046–047` | `028` | Evidence entry; lifecycle details remain deep/support |
| Internal Workbench | `033–035` | `034` | Internal entry; trigger/detail deep links |
| Advisor Review | `036–037` | via Internal Workbench | Deep/support until separate approved surfacing |
| Compliance Release | `038–042` | `038` | Compliance entry; decision/release/block/audit deep links |
| Decision Record | `043–047` | `044` | Decision entry; list/success/evidence details deep links |
| Governance Safety Console | `007–012`, `017–018`, `048–051` | `048` | Governance entry; admin setup overlap must not imply bypass |
| Export & Redaction Studio | `054–058` | `054` | Export entry; lifecycle steps deep links |
| P1 / Reference / Hold | `052–053`, `059–071` | none | Keep registered/deferred; do not elevate in WP-02 |

### Findings

- WP01.8 already removed local sidebar link arrays, which lowers WP-02 risk.
- The app already contains useful density and detail primitives, so WP-02 should not invent a second design system.
- The missing architectural piece is a named `WorksurfaceShell` that binds process summary, panel grid, action rail and safety state as a reusable contract.
- Some pages are already partially compact through `UxHubPage`, `UxDenseOperationsPanel` and `UxDetailStandardPanel`; WP-02 should consolidate rather than rewrite from scratch.
- The cleanest implementation path is to introduce a thin Worksurface layer and migrate slices incrementally.
- P1/Hold/Reference pages must remain registered/deferred; KYC/IPS/Committee should not be pulled into visible Worksurface implementation without an explicit later unlock.

### Risks

- Recreating screen sprawl inside `WorksurfaceShell` if it accepts arbitrary long content without panel constraints.
- Duplicating existing `Ux*` primitives instead of composing them.
- Pulling safety semantics into layout names or CTA copy.
- Combining client and internal evidence context in one surface and leaking internal review posture.
- Treating Access/Tenant setup as the first slice may improve architecture but gives less visible product cleanup than Client/Evidence.

## SPEC-WP02-01 Result

### Target Architecture

WP-02 target architecture is a thin composition layer:

```text
ProcessSidebar
→ route component shell
→ ProductGuidanceContent
→ WorksurfaceShell
   → WorksurfaceHeader
   → Process summary/status strip
   → Primary panel
   → Secondary panel grid
   → Optional action/state rail
   → Optional route/deep-link affordances
```

`WorksurfaceShell` must compose existing content primitives; it must not become a new product engine.

### WorksurfaceShell Contract

Required props:

- `eyebrow`
- `title`
- `description`
- `status` / `statusItems`
- `primary`
- `secondary`
- `rail`
- `safetyNote`
- `pageId` or `worksurfaceId`

Rules:

- Header must fit above fold on desktop and mobile.
- Primary panel must explain the current process job.
- Secondary panels must be scannable and bounded.
- Rail must hold next action/state/blocker, not unrelated navigation.
- Safety note must preserve existing product boundaries.
- No API calls, schema assumptions, permissions or route mutations inside the shell.

### Panel Conventions

- Use `Card` for repeated panels.
- Use `UxHubPage` only where the page ID is a hub.
- Use `UxDenseOperationsPanel` for table-first or operations-heavy pages.
- Use `UxDetailStandardPanel` for detail/review/action-rail pages.
- Use `StatePanel` for blocked, restricted, loading or fail-closed status.
- Use `AuditTimeline` and `EvidenceList` only as display primitives.

### Acceptance Criteria

- Shared Worksurface primitives exist and are used by at least one approved slice.
- Route registry entries are not deleted or reclassified.
- Existing deep links remain renderable.
- No generated visual assets appear in the diff.
- No API route, Prisma schema or migration file changes occur.
- Client surfaces do not show internal-only content.
- Advisor approval is not described as client release.
- Compliance remains required for client visibility.
- Export preview, approval, download/share and client acceptance remain distinct.
- P1/Hold/Reference routes remain registered/deferred unless separately approved.

### Recommended Implementation Boundaries

Approved first code task should be only:

1. Add `components/worksurface-shell.tsx`.
2. Add static tests that forbid API/schema/route-registry mutation for WP-02 slices where practical.
3. Migrate one first slice only.

Do not implement all slices in one commit.

## DECISION-WP02-01 Recommendation

Recommendation A, aggressive and cleanest:

- Delivery model: one WP-02 Epic, multiple task-scoped commits.
- First implementation commit: `IMPL-WP02-01 Shared WorksurfaceShell`.
- First UI slice: `IMPL-WP02-03 Client Context + Evidence`, not Access/Tenant.
- Reason: It removes the most visible product sprawl, aligns directly with WP-04 evidence workflow, and forces the shell to prove client/internal safety boundaries early.

Recommendation B, conservative upload-order:

- First implementation commit: `IMPL-WP02-01`.
- First UI slice: `IMPL-WP02-02 Access & Tenant Setup`.
- Reason: It follows the upload order exactly and has lower safety blast radius, but it gives less visible product cleanup.

Recommendation C, not recommended:

- Implement all WP-02 slices in one broad pass.
- Kill reason: CTES 15 parent scope; high risk of safety copy drift, stale screenshots and large review burden.

## Stop Gate

Implementation must stop here until the user approves one of:

- A: aggressive clean route, shell first then Client Context + Evidence first;
- B: upload-order route, shell first then Access & Tenant Setup first;
- another explicit slice order.

No product code changes are made in this WP-02 turn before that decision.

## Engine Notes

Facts: the upload explicitly separates analysis, specification, decision, implementation and QA. It marks implementation tasks as blocked until analysis, specification and decision are complete. WP-00 guard and WP-01 process navigation are available in the current repo.

Assumptions: the user's "most aggressive decisions" preference means recommendations should optimize for clean long-term architecture, but not override an upload-defined human decision gate without approval.

V3 weak branch killed: whole-WP02 implementation is rejected because it violates the upload CTES split rule.

Ethics/fairness: the recommendation preserves visible decision rights, avoids hidden scope expansion and keeps safety/product boundaries explicit.
