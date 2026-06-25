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

## DECISION-WP02-01 Approval

User approved Option A on 2026-06-25:

- Delivery model: one WP-02 Epic, multiple task-scoped commits.
- First implementation work: shared `WorksurfaceShell` plus the first visible Client Context + Evidence slice.
- Aggressive cleanup preference: remove layout sprawl where the approved slice already touches the affected screens, while staying inside WP-02 source, route and safety constraints.

## IMPL-WP02-01 Execution Result

Status: `DONE`.

Implemented:

- Added `components/worksurface-shell.tsx`.
- Added shared `WorksurfaceShell` with compact process header, status chips, primary content, optional secondary content, optional right rail and mandatory safety boundary.
- Added `WorksurfacePanel` for repeated rail/panel use inside the shell.
- Kept the shell layout-only: no route registry changes, no API calls, no Prisma/schema changes, no permission logic and no new data semantics.

Acceptance:

- `WorksurfaceShell` is used by approved route slices, not left as unused architecture.
- Shell exposes stable test hooks:
  - `data-testid="wp02-worksurface-shell"`
  - `data-wp02-route-id`
  - `data-wp02-worksurface`
  - `data-testid="wp02-worksurface-safety-boundary"`

## IMPL-WP02-03 Execution Result

Status: `DONE`.

Implemented Client Context routes:

- `019 /client/home`: normalized client home projection into `client-context-home`.
- `031 /wealth-map`: normalized wealth map into `client-context-wealth-map`.
- `032 /actions`: normalized action board into `client-context-actions`.

Implemented Evidence routes:

- `027 /documents`: normalized document hub into `evidence-document-hub`.
- `028 /documents/upload`: normalized upload intake into `evidence-upload-intake`.
- `029 /documents/review-queue`: normalized extraction review into `evidence-extraction-review`.
- `030 /documents/:id/review`: normalized verification pending into `evidence-verification-pending`.
- `046 /evidence`: normalized evidence vault into `evidence-vault`.
- `047 /evidence/:id/review`: normalized evidence record detail into `evidence-record-detail`.

Safety preservation:

- Upload remains intake-only.
- Extraction remains draft/human-review gated.
- Evidence record presence is not described as sufficiency.
- Download/share/client visibility remain gated by release/export/access controls.
- Client context does not expose internal payloads or imply advice release.

Regression coverage:

- Added `tests/wp02-worksurface-shell.spec.ts`.
- Test verifies central renderer adoption in source files and runtime shell presence for all nine implemented WP02 slice routes.

Validation run:

- `pnpm exec tsc --noEmit --pretty false` — PASS.
- `pnpm lint` — PASS with pre-existing warnings only.
- `pnpm playwright test tests/wp02-worksurface-shell.spec.ts` — PASS, 10 tests.
- `pnpm playwright test tests/route-smoke.spec.ts --grep "registered route smoke|UX-NAV"` — PASS, 79 tests.
- `pnpm guard:source` — PASS.
- `pnpm db:validate` — PASS.
- `pnpm build` — PASS with existing Turbopack storage-adapter tracing warnings.

Screenshot proof:

- `artifacts/wp02-screenshots/client-home.png`
- `artifacts/wp02-screenshots/documents-upload.png`
- `artifacts/wp02-screenshots/documents-review-queue.png`
- `artifacts/wp02-screenshots/wealth-map.png`
- `artifacts/wp02-screenshots/evidence-vault-base.png`
- `artifacts/wp02-screenshots/evidence-vault.png`

Files changed:

- `components/worksurface-shell.tsx`
- `components/client-intake-screen.tsx`
- `components/wealth-actions-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `tests/wp02-worksurface-shell.spec.ts`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`

Aggressive next recommendation:

- Continue with `IMPL-WP02-04 Internal / Advisor / Compliance Worksurface Slice` next, not Access/Tenant yet. Reason: it follows the live process spine from evidence into review gates and will remove the biggest remaining visual/layout split across analyst, advisor and compliance screens before governance/export cleanup.

## WP02 Rerun After WP03-WP06 Artefacts

Execution date: 2026-06-25.

Rerun trigger:

- User requested a WP02 rerun from the original upload with all generated specification artefacts used as input for later tasks.
- Current branch baseline before rerun: `full-workflow`, latest commit `cc650ca docs: rerun wp01 navigation shell audit`, working tree clean.

Generated artefacts used as rerun input:

- `docs/00-current/ALPHAVEST_WP00_SOURCE_HIERARCHY_TARGET_GUARD_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`

Task-by-task rerun status:

- EPIC WP-02 - Process-first Worksurface Layout Refactor: `PARTIAL_COMPLETE_WITH_DECISION_GATE`. The shell and first approved product slice are complete; remaining slices must stay split.
- `ANALYSIS-WP02-01` - Existing Screen / Component / Layout Inventory: `COMPLETE`. Current ownership map remains valid; later WP03-WP06 artefacts reinforce the same safety boundaries.
- `SPEC-WP02-01` - Target Worksurface Layout Architecture: `COMPLETE`. The thin `WorksurfaceShell` contract remains the active implementation pattern.
- `DECISION-WP02-01` - Approve Implementation Slice Order: `PARTIAL_COMPLETE`. Prior approval covered Option A first wave: shared shell plus Client Context + Evidence first. It did not authorize a broad all-remaining WP02 implementation.
- `IMPL-WP02-01` - Shared Worksurface Shell / Layout Primitives: `COMPLETE`. `components/worksurface-shell.tsx` is present and used by approved slices.
- `IMPL-WP02-02` - Access & Tenant Setup Worksurface Slice: `NOT_STARTED`. Still available, but lower cleanup leverage than the live internal/advisor/compliance spine.
- `IMPL-WP02-03` - Client Context + Evidence Worksurface Slice: `COMPLETE`. Routes `019`, `027`, `028`, `029`, `030`, `031`, `032`, `046` and `047` use the WP02 shell and preserve upload-not-sufficiency/client-safe boundaries.
- `IMPL-WP02-04` - Internal Workbench / Advisor / Compliance Worksurface Slice: `NEXT_RECOMMENDED_DECISION`. Later WP05 implementation made this the cleanest next UI-debt removal target, but it still needs explicit slice approval because the upload marks it CTES 13 and split-required.
- `IMPL-WP02-05` - Decision / Evidence Record / Governance / Export Layout Slice: `DEFER_AFTER_WP02-04`. Later WP06 gives strong governance/RBAC semantics, but the layout slice remains safety-sensitive and should follow the internal/advisor/compliance UI spine.
- `QA-WP02-01` - Worksurface Layout Regression and Stop-Rule Validation: `COMPLETE_FOR_IMPLEMENTED_SLICES`; `PENDING_FOR_REMAINING_SLICES`.

Cross-artefact safety findings:

- WP03 confirms the WP02 client context/evidence slice must remain a presentation layer around released/client-safe projection, not a payload visibility shortcut.
- WP04 confirms evidence upload and evidence record presence cannot be rendered as sufficiency by layout copy.
- WP05 confirms the next high-value Worksurface slice is the internal draft -> advisor -> compliance chain, because the service/workflow semantics now exist and the UI should stop being split across older page shapes.
- WP06 confirms governance/admin layout must not imply admin bypass, so governance/export should remain a later dedicated split, not a mixed broad refactor.

Current code adoption check:

- `components/worksurface-shell.tsx`: shared shell present.
- `components/client-intake-screen.tsx`: WP02 shell adoption present for client/evidence routes.
- `components/wealth-actions-screen.tsx`: WP02 shell adoption present for wealth/action routes.
- `components/decisions-governance-screen.tsx`: WP02 shell adoption present for evidence vault/detail routes.
- `components/internal-workflow-screen.tsx`: no WP02 shell adoption yet for internal/advisor/compliance routes.
- `components/admin-tenant-setup-screen.tsx`: no WP02 shell adoption yet for access/tenant setup.
- `components/communication-export-ops-screen.tsx`: no WP02 shell adoption yet for export/redaction.

Rerun validation completed:

```bash
pnpm guard:source
pnpm exec tsc --noEmit --pretty false
pnpm playwright test tests/wp02-worksurface-shell.spec.ts --workers=1
pnpm playwright test tests/route-smoke.spec.ts --grep "registered route smoke|UX-NAV" --workers=1
pnpm test:source-reality
pnpm db:validate
```

Rerun validation result:

- Source/target guard: PASS.
- TypeScript: PASS.
- WP02 Worksurface shell tests: PASS, 10 passed.
- Focused route smoke / UX-NAV tests: PASS, 79 passed after a sequential rerun. The first attempt failed only because parallel Playwright web servers contended for port `3020`.
- Source reality gate: PASS, 8 passed.
- Prisma schema validation: PASS.

UI/screenshot status:

- No UI code changed in this rerun.
- Existing screenshot proof remains current for the implemented WP02 shell and Client/Evidence slice:
  - `artifacts/wp02-screenshots/client-home.png`
  - `artifacts/wp02-screenshots/documents-upload.png`
  - `artifacts/wp02-screenshots/documents-review-queue.png`
  - `artifacts/wp02-screenshots/wealth-map.png`
  - `artifacts/wp02-screenshots/evidence-vault-base.png`
  - `artifacts/wp02-screenshots/evidence-vault.png`
- No new screenshot was produced because the rerun produced a documentation/audit artefact only.

Decision gate:

- Stop before product UI implementation. The next WP02 code slice changes visible UI and the upload requires split approval for CTES 13 work.

Aggressive recommendation:

- Approve `WP02 Rerun Option A`: continue next with `IMPL-WP02-04`, split into three task-scoped commits in this order: Internal Workbench (`033-035`), Advisor Review (`036-037`), Compliance Release (`038-042`).
- Then continue with `IMPL-WP02-05`, split into Decision/Evidence Record, Governance Safety Console and Export & Redaction Studio.
- Keep `IMPL-WP02-02 Access & Tenant Setup` last unless setup/auth becomes the immediate commercial demo priority.
- Keep P1/Hold/Reference routes registered/deferred and out of primary Worksurface implementation.

Rejected branches:

- Upload-order-first `Access & Tenant Setup` next: lower product cleanup leverage now that WP04/WP05/WP06 produced stronger evidence/compliance/governance semantics.
- Broad all-remaining WP02 implementation: rejected because it violates CTES split discipline and would mix safety-sensitive UI surfaces.
- Route deletion: rejected because WP01/WP02 preserve deep links and route smoke proof.

Recommended approval wording:

`I approve WP02 rerun Option A: continue with IMPL-WP02-04 next, split into Internal Workbench, Advisor Review and Compliance Release task-scoped commits, then proceed to IMPL-WP02-05 split by Decision/Evidence Record, Governance Safety Console and Export/Redaction, keep Access/Tenant last unless commercially urgent, keep P1/Hold/Reference deferred, and make no route/API/schema/safety changes inside WP02 layout work.`

## WP02 Option A Continued Implementation

Execution date: 2026-06-25.

Approved user option:

- Continue with `IMPL-WP02-04` split into Internal Workbench, Advisor Review and Compliance Release task-scoped commits.
- Then continue with `IMPL-WP02-05` split into Decision/Evidence Record, Governance Safety Console and Export/Redaction.
- Keep Access/Tenant last unless commercially urgent.
- Keep P1/Hold/Reference deferred.
- Make no route/API/schema/safety changes inside WP02 layout work.

Implementation commits:

- `3ef1327 feat: add wp02 internal workbench worksurfaces`
- `381dd62 feat: add wp02 advisor review worksurfaces`
- `9801f2e feat: add wp02 compliance release worksurfaces`
- `2c535bb feat: add wp02 decision record worksurfaces`
- `9de3ab4 feat: add wp02 governance safety worksurfaces`
- `0176c51 feat: add wp02 export redaction worksurfaces`

Task completion:

- `IMPL-WP02-04A` Internal Workbench: `COMPLETE`. Routes `033`, `034` and `035` now use `WorksurfaceShell`.
- `IMPL-WP02-04B` Advisor Review: `COMPLETE`. Routes `036` and `037` now use `WorksurfaceShell`.
- `IMPL-WP02-04C` Compliance Release: `COMPLETE`. Routes `038`, `039`, `040`, `041` and `042` now use `WorksurfaceShell`.
- `IMPL-WP02-05A` Decision/Evidence Record: `COMPLETE`. Routes `043`, `044` and `045` now use `WorksurfaceShell`; evidence routes `046` and `047` remained already adopted.
- `IMPL-WP02-05B` Governance Safety Console: `COMPLETE_WITH_ROUTE_CONSTRAINT`. Routes `048`, `049` and `050` are browser-verified Worksurface routes. Route `051` audit history is component-adopted as `governance-safety-audit-history`, but the current registry still shares `/governance` with route `048`; no route change was made because WP02 approval forbids route changes.
- `IMPL-WP02-05C` Export/Redaction: `COMPLETE`. Routes `054`, `055`, `056`, `057` and `058` now use `WorksurfaceShell`.

Changed files:

- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/wp02-worksurface-shell.spec.ts`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`

Screenshots produced:

- `artifacts/wp02-screenshots/internal-workbench-review-queue.png`
- `artifacts/wp02-screenshots/advisor-review-detail.png`
- `artifacts/wp02-screenshots/compliance-release-decision-room.png`
- `artifacts/wp02-screenshots/decision-record-room.png`
- `artifacts/wp02-screenshots/governance-safety-access-requests.png`
- `artifacts/wp02-screenshots/export-redaction-review.png`

Validation during implementation:

```bash
pnpm exec tsc --noEmit --pretty false
pnpm playwright test tests/wp02-worksurface-shell.spec.ts --workers=1
```

Result:

- TypeScript: PASS after each implementation slice.
- WP02 Worksurface shell contract: PASS after each implementation slice; final implementation-slice run passed 31 tests.

Boundaries preserved:

- No route registry edits.
- No API edits.
- No schema or migration edits.
- No safety, RBAC, evidence sufficiency, export approval, release or client-visibility behavior changes.
- Access/Tenant setup remains deferred by approved option.
- P1/Hold/Reference routes remain deferred by approved option.

Follow-up recommendation:

- Treat WP02 Option A as implementation-complete for the approved rerun scope after final validation passes.
- The next cleanest aggressive task is not more WP02 layout expansion; it is a focused route-record cleanup decision for the existing `048`/`051` shared `/governance` path, because route `051` is component-ready but not independently browser-addressable without a route decision.

## WP02 Strict Chain Rerun and Access/Tenant Completion

Execution date: 2026-06-25.

User execution rule applied:

- Blueprint task -> executed analysis result -> refined specification -> derived implementation task -> implementation -> QA/proof -> report.
- Generated specification artefacts from WP00-WP06 were used as input and safety override.
- No route, API, schema, RBAC, release, export approval, evidence sufficiency or client visibility behavior changes were allowed inside WP02 layout work.

Blueprint extraction:

- `ANALYSIS-WP02-01` Existing Screen / Component / Layout Inventory: map current route ownership, layout primitives, duplicated headers, side rails, route constraints and safety-sensitive surfaces.
- `SPEC-WP02-01` Target Worksurface Layout Architecture: define shared worksurface shell, route-level shell metadata, safe status rail, action/safety boundary placement and split-by-worksurface implementation contract.
- `DECISION-WP02-01` Implementation Slice Order and Layout Boundaries: CTES 13-16 must be split; no broad all-in-one implementation; P1/Hold/Reference remain deferred; route/API/schema changes out of scope.
- `IMPL-WP02-01` Shared Worksurface Shell and Layout Primitives: canonical shell renderer and panels.
- `IMPL-WP02-02` Access & Tenant Setup Worksurface Slice: routes `001-018`.
- `IMPL-WP02-03` Client Context + Evidence Worksurface Slice: routes `019`, `027-032`, `046-047`.
- `IMPL-WP02-04` Internal Workbench / Advisor / Compliance Worksurface Slice: routes `033-042`, split into internal workbench, advisor review and compliance release.
- `IMPL-WP02-05` Decision / Evidence Record / Governance / Export Layout Slice: routes `043-050`, `054-058`; route `051` remains a route-record constraint because it shares `/governance` with `048`.
- `QA-WP02-01` Worksurface Layout Regression and Stop-Rule Validation: runtime route proof, shell contract proof, source hierarchy guard, no forbidden scope expansion and screenshot proof for UI changes.

Executed analysis result:

- Current baseline before this strict rerun: branch `full-workflow`, latest commit `d9f82b5 docs: rerun wp04 evidence workflow proof`, working tree clean.
- `WorksurfaceShell` already existed and was used by Client/Evidence, Internal Workbench, Advisor Review, Compliance Release, Decision/Evidence Record, Governance Safety Console and Export/Redaction slices.
- `tests/wp02-worksurface-shell.spec.ts` covered 31 implemented routes before this rerun.
- Routes `001-006` still rendered the older `AuthCanvas` without the shared WP02 shell.
- Routes `007-018` still rendered `AppShell`/`PageHeader` or `UxHubPage` without the shared WP02 shell.
- Earlier approved option placed Access/Tenant last unless commercially urgent. Since all later approved slices were already complete, `IMPL-WP02-02` became the remaining real delta rather than a deferral.
- `IMPL-WP02-01`, `IMPL-WP02-03`, `IMPL-WP02-04` and `IMPL-WP02-05` derived to zero-delta in this rerun, with code/test proof from the existing shell adoption and expanded shell regression.

Refined specification:

- Access and tenant setup must use the same `WorksurfaceShell` contract as all later process surfaces.
- Auth/onboarding routes must keep their branded auth canvas but nest the actual work area in the shared shell with access-specific safety copy.
- Admin/tenant routes must keep the `AppShell`, demo session controls, modals and drawers, but replace local page-header chrome with the shared shell.
- The shell must expose `data-testid="wp02-worksurface-shell"`, `data-wp02-route-id` and `data-wp02-worksurface` for every WP02 productive/support route now in scope.
- The shell safety boundary must explicitly prevent overclaiming: access, tenant setup, role templates and admin configuration do not grant release, evidence sufficiency, export approval, audit bypass or cross-tenant payload access.

Derived implementation task:

- `IMPL-WP02-02A` Auth Onboarding: add route-specific access worksurface metadata and wrap pages `001-006` inside `WorksurfaceShell`.
- `IMPL-WP02-02B` Admin/Tenant Setup: add route-specific admin/tenant worksurface metadata and wrap pages `007-018` inside `WorksurfaceShell`.
- `IMPL-WP02-02C` Regression Contract: extend `tests/wp02-worksurface-shell.spec.ts` from 31 to 49 shell route checks and handle `/login` anonymously because authenticated sessions intentionally do not stay on login.

Implementation result:

- `components/auth-onboarding-screen.tsx`: added access worksurface metadata and shared shell adoption for routes `001-006`.
- `components/admin-tenant-setup-screen.tsx`: added platform/tenant worksurface metadata and shared shell adoption for routes `007-018`.
- `tests/wp02-worksurface-shell.spec.ts`: expanded route coverage to `001-019`, `027-050` and `054-058`.

QA/proof:

```bash
pnpm typecheck
pnpm exec playwright test tests/wp02-worksurface-shell.spec.ts --reporter=line
pnpm guard:source
```

Result:

- TypeScript: PASS.
- WP02 Worksurface shell contract: PASS, 49 passed.
- Source/target guard: PASS, violations `0`.
- Negative proof: the first expanded WP02 shell run failed for route `001` because the test authenticated before visiting `/login`; that is expected product behavior for an already authenticated session. The test was refined so only `/login` runs anonymous; the rerun passed all 49 checks.

Screenshots:

- `test-results/wp02-rerun-screenshots/wp02-access-login-shell.png`
- `test-results/wp02-rerun-screenshots/wp02-tenant-users-shell.png`

Boundaries preserved:

- No route registry edits.
- No API edits.
- No schema or migration edits.
- No safety, RBAC, evidence sufficiency, export approval, release or client-visibility behavior changes.
- P1/Hold/Reference routes remain deferred.

Residual risks:

- Route `051` is still component-adopted but not independently browser-addressable because the registry shares `/governance` with route `048`; fixing it requires a separate route-record decision outside WP02 layout work.
- Broader full-suite route smoke was not rerun in this strict delta; focused WP02 route-shell proof, TypeScript and source guard were run for this task-scoped commit.
