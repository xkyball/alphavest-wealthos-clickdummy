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

## Completed Slice: UX-PAGE-003

Task: `UX-PAGE-003` - Standardize detail pages with object header, evidence/timeline and gated action rail.

Mission Card: standardize eligible detail routes with an object header, key facts, evidence/timeline section and gated action rail while preserving D4 focused-detail policy, RBAC payload boundaries, advice boundary, evidence sufficiency, compliance release and export lifecycle separation.

Evidence Intake:
- Task-master `UX-PAGE-003` detail-page contract and proof requirement.
- Route Policy Matrix detail rows: `035`, `037`, `039`, `040`, `041`, `044`, `045`, `047`, `057`, `058`.
- Existing implementation finding: detail pages already had local facts, timelines and actions, but the structure was inconsistent across workflow, decision/evidence and export surfaces.

Problem Architecture: detail pages need a repeatable decision surface, but adding a visual action rail must not imply permission, release, sufficiency, acceptance, download/share or workflow completion.

Double Diamond:
- Discover: facts, evidence and actions existed in different locations per detail page.
- Define: add a shared detail standard directly to representative detail pages.
- Develop: implement a reusable detail panel and populate it with route-specific object facts and P0 safety copy.
- Deliver: detail panel, route-smoke tests and six screenshot proofs.

Psycho-Logic + Map/Model: a detail page should reduce decision anxiety by answering "what object is this, what facts matter, what proof exists, what action is gated?" The map trap is treating the action rail as authority; the copy keeps authority in control layers.

Reframing Matrix:
- Detail-as-document dump: rejected.
- Detail-as-object decision surface: kept.
- Detail-as-gate-completion claim: rejected.
- Detail-as-audit handoff: kept with explicit evidence/timeline structure.

TRIZ: improve decision clarity without weakening gates by putting evidence and action state in one visible structure while repeating non-overclaim safety boundaries.

SIT Closed World: reused existing page data, panels, route IDs, tests and route paths; no new route, screen generation, schema, API or policy engine was added.

Zwicky + CCA:
- Variant A: full bespoke redesign of each detail route. Rejected as too broad for one task.
- Variant B: shared detail standard inserted into target detail pages. Chosen.
- Variant C: metadata-only detail contract. Rejected because `UX-PAGE-003` explicitly requires rendered detail screenshots.

SCAMPER: combined object facts, evidence/timeline and action state; substituted scattered detail cards with a standard detail section; eliminated hidden safety ambiguity by adding route-specific safety notes.

Harvard / BATNA: objective criteria are D4 focused detail, RBAC payload criticality and P0 obligations. BATNA remains stop/report if any action would require unauthorized behavior changes.

MESOs:
- Option A: representative detail pages with shared component and tests. Chosen.
- Option B: every support detail page including profile/entity support. Deferred because PAGE-003 proof targets trigger/advisor/compliance/decision/evidence/export detail and support expansion would risk scope creep.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3353 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-PAGE detail standard"`
- `PLAYWRIGHT_PORT=3354 pnpm test:route-smoke`
- `PLAYWRIGHT_PORT=3355 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3356 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3357 pnpm test:file-export`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-PAGE-003/`

Ethics/Fairness: no deceptive action state, no dark pattern, no client-visible AI draft, no upload-to-sufficiency shortcut, no admin bypass and no export preview-to-download collapse.

Adversarial QA: action rails could overclaim authority; every rail includes state/safety copy and the safety test suites remain green.

Learning Log: `UX-PAGE-004` should now protect P1/Reference/Hold routes from this productive detail treatment unless explicitly allowed as guard-only proof.

Route-policy rows cited:
- `035` `/workbench/triggers/:id`, `037` `/advisor-approval/:id`.
- `039` `/compliance/:id/review`, `040` `/compliance/:id/release`, `041` `/compliance/:id/block`.
- `044` `/decisions/:id`, `045` `/decisions/:id/success`.
- `047` `/evidence/:id`.
- `057` `/export/:id/preview`, `058` `/export/:id/download`.

Changed files:
- `components/ux-detail-standard-panel.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-trigger-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-advisor-approval-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-compliance-review-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-decision-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-evidence-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-export-preview-detail.png`

Implementation summary:
- Added `UxDetailStandardPanel` with object header, key facts, evidence basis, audit/timeline and gated action rail.
- Inserted the panel into trigger, advisor approval, compliance review/release/block, decision, submitted decision, evidence record and export preview/download details.
- Added route-smoke coverage for 10 detail paths.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings from prior UX-HUB extraction.
- `PLAYWRIGHT_PORT=3353 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-PAGE detail standard"` - passed, 10 tests.
- `PLAYWRIGHT_PORT=3354 pnpm test:route-smoke` - passed, 121 tests.
- `PLAYWRIGHT_PORT=3355 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3356 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3357 pnpm test:file-export` - passed, 14 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-trigger-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-advisor-approval-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-compliance-review-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-decision-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-evidence-detail.png`
- `artifacts/ux-page-to-policy/UX-PAGE-003/2026-06-21-UX-PAGE-003-export-preview-detail.png`

Positive acceptance:
- Representative detail pages now show object header, key facts, evidence/timeline and gated action rail above their detail content.
- The route-smoke suite proves the structure on trigger, advisor, compliance, decision, evidence and export detail routes.

Negative/P0 acceptance:
- Advisor approval remains separate from compliance release.
- Compliance release remains separate from client acceptance.
- Evidence upload/download/visibility remains separate from evidence sufficiency.
- Export preview remains separate from approval, download and share.
- Route/action/payload permissions remain governed by existing controls.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: no route IDs, paths, scopes or policy classifications changed.

No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route received productive detail treatment.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-PAGE-004

Task: `UX-PAGE-004` - Keep P1, Reference and Hold routes out of productive MVP page-type work.

Mission Card: prove and document that routes `052`, `053`, `059`, `060`, `061`, `062`, `063`, `064`, `065`, `066`, `067`, `068`, `069`, `070`, `071` remain non-productive registered-only/deferred/reference/hold surfaces after UX-PAGE work.

Evidence Intake:
- Task-master `UX-PAGE-004` and Route Policy Matrix §11 protection register.
- Existing implementation finding: route registry, navigation policy, skeleton guards and page contract already model protected route non-productivity.
- Gap: after PAGE-002/PAGE-003, tests did not explicitly prove protected routes did not receive new workbench/detail productive surfaces.

Problem Architecture: protected routes can look like product UI because they are registered and smoke-tested. The critical distinction is guard visibility without MVP CTA, workbench triad or focused detail action rail.

Double Diamond:
- Discover: 15 protected routes remain route-smoke reachable.
- Define: prove no protected route receives productive PAGE surfaces.
- Develop: add a no-elevation route-smoke assertion across all 15 protected routes.
- Deliver: test proof, screenshots and reports.

Psycho-Logic + Map/Model: users should understand that a visible registered route is not a promise of active MVP capability. The safe map model is "registered for continuity, locked for product work."

Reframing Matrix:
- Protected-as-product: rejected.
- Protected-as-guard: kept.
- Protected-as-reference: kept only for reference rows.
- Protected-as-future promise: rejected unless explicitly marked deferred.

TRIZ: preserve route visibility for catalogue/smoke continuity while preventing route visibility from increasing task eligibility.

SIT Closed World: reused existing route workset registry, guard skeleton and route-smoke tests; no new routes, screen generation or route reclassification.

Zwicky + CCA:
- Variant A: remove protected routes. Rejected because route smoke requires registered continuity.
- Variant B: add guard/no-surface regression. Chosen.
- Variant C: implement richer deferred screens. Rejected as forbidden P1/Hold/Reference elevation.

SCAMPER: added no-surface proof, combined it with existing route workset preservation, and eliminated ambiguity caused by newly added UX-PAGE productive surfaces.

Harvard / BATNA: objective criteria are the protection register and task card. BATNA is stop/report, never implementing held/P1/reference features.

MESOs:
- Option A: tests and screenshots only. Chosen because existing guard UI already satisfies allowed treatment.
- Option B: edit each protected component. Rejected as unnecessary and risky.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3359 pnpm exec playwright test tests/route-smoke.spec.ts -g "deferred, reference and held routes do not receive productive UX-PAGE surfaces"`
- `PLAYWRIGHT_PORT=3360 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-PAGE-004/`

Ethics/Fairness: no fake MVP readiness, no future-work bait, no hidden product CTA, no client-visible behavior or safety finalization.

Adversarial QA: a protected route could accidentally receive PAGE-002/PAGE-003 UI; the new test asserts those test IDs are absent and that `Product action locked` is disabled.

Learning Log: the next workstream starts `UX-COMPLEXITY-001`; complexity work must only target productive MVP/MVP_SUPPORT pages unless a protected guard clarity fix is explicitly required.

Route-policy rows cited:
- P1 deferred: `052`, `053`, `059`, `060`, `068`.
- Reference-only: `061`, `062`, `063`.
- Hold-blocked: `064`, `065`, `066`, `067`, `069`, `070`, `071`.

Changed files:
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-p1-deferred-communication.png`
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-reference-service-blueprint.png`
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-hold-kyc-review.png`

Implementation summary:
- Added route-smoke regression that all 15 protected routes have no `ux-page-workbench-triad`, no `ux-page-detail-standard` and a disabled `Product action locked` button.
- Preserved existing registered-only guard screens.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings from prior UX-HUB extraction.
- `PLAYWRIGHT_PORT=3359 pnpm exec playwright test tests/route-smoke.spec.ts -g "deferred, reference and held routes do not receive productive UX-PAGE surfaces"` - passed, 1 test covering 15 routes.
- `PLAYWRIGHT_PORT=3360 pnpm test:route-smoke` - passed, 122 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-p1-deferred-communication.png`
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-reference-service-blueprint.png`
- `artifacts/ux-page-to-policy/UX-PAGE-004/2026-06-21-UX-PAGE-004-hold-kyc-review.png`

Positive acceptance:
- Protected routes remain accessible as registered-only guard/reference/deferred surfaces.
- Navigation/productive UX surfaces stay excluded from protected routes.

Negative/P0 acceptance:
- No protected route received an MVP CTA, PAGE-002 workbench triad or PAGE-003 detail standard.
- No protected route was elevated into MVP/MVP_SUPPORT scope or productive navigation.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: all 15 protected routes are covered by no-elevation regression.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain unchanged.

## Completed Slice: UX-COMPLEXITY-001

Task: `UX-COMPLEXITY-001` - Reduce card-wall overload into summary + priority queue + action rail.

Mission Card: reduce overload on MVP workbench/support routes `032`, `033`, `039`, `042` and `056` by adding a visible summary strip, priority queue and non-authorizing action rail without changing route scope, route classification, evidence sufficiency, compliance release, export approval, audit persistence or admin authority.

Evidence Intake:
- Task-master `UX-COMPLEXITY-001` and Route Policy Matrix rows `032`, `033`, `039`, `042`, `056`.
- Current implementation finding: these routes already had functional cards, workflow panels or detail surfaces, but priority and next-step hierarchy competed with dense supporting cards.
- P0 policy findings: visual hierarchy cannot prove behavior; status chips, upload state, export preview, audit visibility and compliance review copy must not be treated as gate proof.

Problem Architecture: these routes need faster operator orientation, but a clearer action rail must not imply approval, release, sufficiency, download/share or audit persistence.

Double Diamond:
- Discover: dense routes mixed status, metrics, cards and actions without one stable priority layer.
- Define: introduce one route-scoped priority layer above supporting detail.
- Develop: add shared summary + priority queue + action rail component and apply it to the five scoped rows.
- Deliver: route-smoke proof, safety test proof, screenshots and reports.

Psycho-Logic + Map/Model: users under decision pressure need the page to answer "what matters now?" before asking them to inspect cards. The safe map model is priority orientation first, gate proof still held by the underlying workflow/control layers.

Reframing Matrix:
- Page-as-card-wall: rejected.
- Page-as-priority-console: kept.
- Page-as-gate-proof: rejected.
- Page-as-handoff: kept where compliance/export/audit copy clarifies the next constrained step.

TRIZ: improve scan speed and reduce visual overload while preserving strict safety by adding a hierarchy layer that repeats, rather than replaces, gate limits.

SIT Closed World: reused existing route pages, route data, workflow state, trust panels, detail panels and test harnesses; no route, image, screen, API, Prisma migration or product scope engine was introduced.

Zwicky + CCA:
- Variant A: rewrite each page body deeply. Rejected as broad and risky.
- Variant B: add a shared priority panel to scoped dense pages. Chosen.
- Variant C: hide secondary content in workflows/drawers. Deferred to later `UX-COMPLEXITY-002` / `UX-INTERACTION-*` tasks.

SCAMPER: combined metrics into a summary strip, rearranged urgent items into a priority queue, substituted duplicate CTA clusters with one constrained action rail and preserved existing safety panels.

Harvard / BATNA: objective criteria are Route Policy Matrix rows and P0 obligations. BATNA is stop/report if clarity would require behavior or policy change.

MESOs:
- Option A: shared component applied to five high-overload routes. Chosen as smallest coherent slice.
- Option B: page-specific redesigns. Rejected for this task because it would increase blast radius before density/interaction tasks.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3362 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY priority hierarchy"`
- `PLAYWRIGHT_PORT=3365 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3366 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3367 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/`

Ethics/Fairness: no dark-pattern urgency, no false proof, no hidden client-visible advice, no admin bypass and no overclaim that visual order completes compliance/evidence/export/audit obligations.

Adversarial QA: priority panels could be misread as workflow completion; each action rail includes route-specific safety copy and tests prove the panel structure without granting behavior authority.

Learning Log: later `UX-COMPLEXITY-002` can move secondary details into drawers/tabs, but workflows themselves must stay outside drawers and safety gates must remain visible.

Route-policy rows cited:
- `032` `/actions`
- `033` `/signals`
- `039` `/compliance/demo/review`
- `042` `/compliance/demo/audit`
- `056` `/export/demo/redaction`

Changed files:
- `components/ux-complexity-priority-panel.tsx`
- `components/wealth-actions-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-actions-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-signals-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-compliance-review-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-compliance-audit-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-export-redaction-after.png`

Implementation summary:
- Added `UxComplexityPriorityPanel` as a shared non-authorizing hierarchy layer.
- Applied it to actions, signals, compliance review, compliance audit and export redaction.
- Added route-smoke proof that each scoped route renders one summary strip, one priority queue and one action rail.
- Kept existing compliance, export, audit, workflow and permission engines unchanged.

Validation:
- `pnpm typecheck` - passed after replacing an invalid signal title reference with the existing signal ID.
- `pnpm lint` - passed with existing warnings from prior UX-HUB extraction.
- `PLAYWRIGHT_PORT=3362 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY priority hierarchy"` - passed, 5 tests.
- `PLAYWRIGHT_PORT=3365 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3366 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3367 pnpm test:route-smoke` - passed, 127 tests.
- A first parallel safety rerun hit a Next dev-server port collision with the targeted Playwright server; it was rerun sequentially on fresh ports and passed.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-actions-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-signals-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-compliance-review-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-compliance-audit-after.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-001/2026-06-21-UX-COMPLEXITY-001-export-redaction-after.png`

Positive acceptance:
- The scoped routes now expose summary, priority queue and next constrained action above supporting content.
- The primary page job and safety note are visible before the card-heavy supporting sections.

Negative/P0 acceptance:
- Priority hierarchy does not claim evidence sufficiency, compliance release, export approval/download/share, audit persistence, advice readiness or admin bypass.
- No P1, Reference or Hold route was promoted.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-COMPLEXITY-001` only touched scoped MVP/MVP_SUPPORT productive routes.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

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
