# UX Page To Policy Execution Report

Date: 2026-06-21

Source of truth:
- `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`
- `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md`
- `AGENTS.md`

## Engine Mix Method Trace

Mission Card: execute UX refactoring after UX-HUB, starting at `UX-PAGE-001`, without route creation, route reclassification, screen generation, image generation, P1/Hold/Reference elevation or safety weakening.

Evidence Intake: task-master `UX-PAGE-001` plus Route Policy Matrix scope, page-type, density, CTA and protected-route registers.

Problem Architecture: route registry already preserved route scope; missing piece was a materialized UX page-type/job contract that can be cited by later tasks without becoming a product scope engine.

Double Diamond:
- Discover: existing UX policy provided page type/density labels but not an explicit page job and allowed/forbidden treatment contract.
- Define: `UX-PAGE-001` needs all MVP and MVP_SUPPORT routes to carry clear page type/job while protected routes remain non-productive.
- Develop: add a derived contract layer over route registry and UX route policy; prove counts and protected semantics in route-smoke.
- Deliver: `lib/ux-page-contract.ts` plus `tests/route-smoke.spec.ts` coverage.

Psycho-Logic + Map/Model: the route catalogue is a map, not product permission. The safe design move is to make page jobs explicit while repeating that route presence and page labels are not behavior proof.

Reframing Matrix:
- Page-as-list: rejected because it encourages route inventory thinking.
- Page-as-job: kept; each page has an explicit job.
- Page-as-gate: constrained; gates require tests and cannot be implied by status.
- Page-as-handoff: kept for hubs/workbenches/details via allowed treatment and CTA rule.

TRIZ: improve orientation without weakening safety gates by deriving page contract metadata from existing policy rather than changing route scope or permission behavior.

SIT Closed World: reused `screenRoutes`, `routeScopeForPageId`, `routeToSmokePath` and `uxRoutePolicyForRoute`; no new route, screen, engine or schema was added.

Zwicky + CCA:
- Variant A: add fields directly to route registry. Rejected, too close to route scope redefinition.
- Variant B: extend `ux-route-policy` only. Rejected as less traceable for PAGE-to-POLICY reporting.
- Variant C: derived `ux-page-contract` layer. Kept, explicit and non-authorizing.

SCAMPER:
- Substitute implicit page purpose with explicit page job.
- Combine route scope and UX policy in one contract.
- Adapt page-type rules into testable fields.
- Modify route-smoke to prove 71 contracts.
- Put existing route policy to reportable use.
- Eliminate any need for new product scope engine.
- Rearrange protected-route proof beside existing locked workset proof.

Harvard / BATNA: objective criteria are the task master and route matrix. BATNA for any unsafe ambiguity is stop/report, not implementation by inference.

MESOs:
- Option A: metadata-only contract and tests. Chosen for `UX-PAGE-001`.
- Option B: UI header changes across all routes. Rejected for this task because UX-NAV already added page-job guidance and broad UI work increases blast radius.
- Option C: route registry rewrite. Rejected because it risks reclassification.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3345 pnpm test:route-smoke`

Ethics/Fairness: no dark pattern, no hidden safety weakening, no false proof claim, no client-visible advice expansion.

Adversarial QA: protected routes could be accidentally treated as productive; route-smoke now proves 15 protected contracts remain non-productive.

Learning Log: later `UX-PAGE-*`, density, CTA and safety tasks should cite `ux-page-contract` for page type/job before touching UI.

## Completed Slice: UX-PAGE-001

Task: `UX-PAGE-001` - Apply page-type contract to all MVP and MVP_SUPPORT routes.

Route-policy rows cited:
- Scope register: `MVP` 31 routes, `MVP_SUPPORT` 25 routes, P1/Reference/Hold protected routes.
- Page-type rules: Hub, Workbench, Detail, Drawer, Modal, Reference, P1, Hold.
- Density rules: D1-D4 and protected-route density treatment.
- Protected route register: P1 deferred, Reference-only, Hold-blocked.

Changed files:
- `lib/ux-page-contract.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Implementation summary:
- Added a derived UX page contract for all 71 registered routes.
- Materialized page type, density tier, page job, allowed treatment, forbidden treatment, primary CTA rule, P0 obligation and productive eligibility.
- Preserved route registry, route scope, route count and existing permission/visibility/workflow engines.
- Added route-smoke assertions for all contracts, 56 productive MVP/MVP_SUPPORT contracts and 15 protected non-productive contracts.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with pre-existing warnings from the prior UX-HUB extraction.
- `PLAYWRIGHT_PORT=3345 pnpm test:route-smoke` - passed, 96 tests.

Screenshot/proof:
- No new screenshot was captured for `UX-PAGE-001` because this slice materializes metadata/test proof only and does not change rendered UI.

Positive acceptance:
- Every registered route now has a materialized UX page-type/job contract.
- Every MVP and MVP_SUPPORT route is marked productive-eligible without route reclassification.

Negative/P0 acceptance:
- P1, Reference and Hold routes remain non-productive.
- Route labels and page jobs do not grant action authority, payload visibility, evidence sufficiency, compliance release, export approval, download/share or client acceptance.

No-generation confirmation: no screen generation, state-screen generation or image generation.

No-route-reclassification confirmation: route count and route scope are unchanged.

No-P1/Hold/Reference-elevation confirmation: protected contracts remain non-productive and route-smoke verifies the protected count.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and tests.

## Completed Slice: UX-PAGE-002

Task: `UX-PAGE-002` - Split workbench pages into queue / selected context / action rail.

Mission Card: apply the workbench triad only to the scoped Route Policy Matrix workbench routes without changing route scope, action authority, evidence sufficiency, compliance release, export lifecycle or admin governance gates.

Evidence Intake:
- Task-master `UX-PAGE-002` target rows: `027-030`, `033`, `036`, `038`, `046`, `048-051`, `054-056`.
- Route Policy Matrix page types and P0 obligations for document upload/review, signal triage, advisor approval, compliance, evidence, governance and export lifecycle routes.
- Existing implementation finding: shared `ProductGuidancePanel` already renders above-the-fold route job, gate hint and flow context, making it the narrowest safe place for a non-authorizing workbench structure.

Problem Architecture: the routes need clearer workbench orientation, but the UI must not imply that queue visibility, selected context or action rail text completes gates or grants authority.

Double Diamond:
- Discover: workbench routes had page job/gate hints, but no consistent triad separating priority queue, selected context and action rail.
- Define: add a consistent workbench orientation layer for the exact target routes.
- Develop: derive route-specific triad copy from existing product guidance and route policy; keep it non-mutating and non-authorizing.
- Deliver: shared workbench triad with route-smoke coverage and screenshot proof.

Psycho-Logic + Map/Model: users need an immediate answer to "what should I look at, what is selected, what can I safely do next?" The map trap is making visual structure feel like permission; the safe move is to state the triad while repeating that visible status is orientation, not gate-completion proof.

Reframing Matrix:
- Page-as-card-wall: rejected.
- Page-as-workbench: kept for scoped MVP routes.
- Page-as-gate: constrained by explicit safety copy and existing tests.
- Page-as-handoff: kept for export/advisor/compliance transitions without changing authority.

TRIZ: improve clarity and reduce layout ambiguity while preserving hard safety gates by adding structure around existing guidance rather than adding new actions.

SIT Closed World: reused `productGuidanceForRoute`, `ProductGuidancePanel`, route IDs and route-smoke authentication; no new route, generated screen, image, schema, API or product scope engine was introduced.

Zwicky + CCA:
- Variant A: rewrite every target page body. Rejected as high blast radius.
- Variant B: add page-specific one-off triads. Rejected as inconsistent and hard to prove.
- Variant C: shared guidance triad scoped by route ID. Kept for narrow policy-aligned proof.

SCAMPER: combined page-job guidance with workbench structure, substituted card-wall ambiguity with queue/context/action rail, eliminated duplicate per-page layout work and rearranged safety copy into the action rail.

Harvard / BATNA: objective criteria are the Route Policy Matrix rows and task card. BATNA remains stop/report if a route needs behavior changes beyond UX orientation.

MESOs:
- Option A: shared triad in product guidance. Chosen.
- Option B: per-route content migration into new local page layouts. Deferred to later detail/complexity tasks where explicitly required.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3347 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-PAGE workbench structure"`
- `PLAYWRIGHT_PORT=3348 pnpm test:route-smoke`
- `PLAYWRIGHT_PORT=3349 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3350 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3351 pnpm test:file-export`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-PAGE-002/`

Ethics/Fairness: no coercive CTA, no hidden gate weakening, no client-visible AI draft, no admin bypass and no claim that upload, preview or visible queue status is sufficient proof.

Adversarial QA: the triad could be mistaken for workflow completion; route-smoke verifies the explicit "not gate-completion proof" copy on all target routes.

Learning Log: later `UX-PAGE-003` detail work should continue using shared non-authorizing patterns and only move into page bodies where object-detail structure is explicitly required.

Route-policy rows cited:
- `027` `/documents`, `028` `/documents/upload`, `029` `/documents/extraction-review`, `030` `/documents/verification-pending`.
- `033` `/signals`, `036` `/advisor-approval`, `038` `/compliance`, `046` `/evidence`.
- `048` `/governance/users`, `049` `/governance/roles`, `050` `/governance/access-requests`, `051` `/governance/audit-history`.
- `054` `/export/new`, `055` `/export/:id/scope`, `056` `/export/:id/redaction`.

Changed files:
- `lib/product-guidance.ts`
- `components/product-guidance-panel.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-documents-workbench-triad.png`
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-compliance-workbench-triad.png`
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-export-scope-workbench-triad.png`

Implementation summary:
- Added route-scoped workbench structure metadata for the `UX-PAGE-002` target routes.
- Rendered a consistent priority queue, selected context and action rail inside the shared product guidance panel.
- Kept the action rail descriptive and non-mutating; no new CTA authority or workflow behavior was introduced.
- Added route-smoke coverage across all 15 target routes.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings from the prior UX-HUB extraction.
- `PLAYWRIGHT_PORT=3347 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-PAGE workbench structure"` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3348 pnpm test:route-smoke` - passed, 111 tests.
- `PLAYWRIGHT_PORT=3349 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3350 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3351 pnpm test:file-export` - passed, 14 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-documents-workbench-triad.png`
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-compliance-workbench-triad.png`
- `artifacts/ux-page-to-policy/UX-PAGE-002/2026-06-21-UX-PAGE-002-export-scope-workbench-triad.png`

Positive acceptance:
- All scoped workbench routes render a queue / selected context / action rail triad above page content.
- The triad is derived from existing route guidance and route policy metadata.

Negative/P0 acceptance:
- The triad explicitly says visible status is orientation, not gate-completion proof.
- No route, route scope, permission, payload, compliance release, upload sufficiency, advisor approval, audit persistence or export lifecycle behavior changed.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated assets.

No-route-reclassification confirmation: route IDs, paths, scopes and page-type policy remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-PAGE-002` only targets scoped MVP workbench routes and does not elevate protected routes.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and tests.
