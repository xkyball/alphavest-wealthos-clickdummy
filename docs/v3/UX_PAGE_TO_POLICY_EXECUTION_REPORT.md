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

## Completed Slice: UX-CTA-001

Task: `UX-CTA-001` - Implement one-primary-CTA page-state pattern.

Mission Card: formalize one guarded primary page CTA for every eligible MVP/MVP_SUPPORT route state while preserving upload, advice, compliance, export, audit, RBAC and admin non-bypass gates.

Evidence Intake:
- Task-master rows `UX-CTA-001`, source Decision Brief section 13, Global CTA policy and Feedback/Validation/Error Contract.
- Route Policy Matrix `NAV-POL-004`, CTA vocabulary and all MVP/MVP_SUPPORT eligible route rows.
- Current implementation finding: shared `ProductGuidancePanel` already owns above-fold page job/status/next step, while `UxCtaCluster` handles local action clusters on touched priority pages.

Problem Architecture: users need one obvious page-level next action, but the UI must not turn a visible button into proof of evidence sufficiency, release, export approval, audit persistence or permission.

Double Diamond:
- Discover: page guidance had one primary link but no explicit CTA state, blocked reason or recovery contract.
- Define: keep one page-state primary CTA in shared guidance and treat local page clusters as contextual action groups.
- Develop: added `ProductGuidanceCtaState`, blocked reason/recovery derivation and testable primary/secondary CTA markers.
- Deliver: route-smoke assertions and six screenshot proofs across priority CTA flows.

Psycho-Logic + Map/Model: the user pressure is deciding what to do next without over-reading safety state. The map trap is mistaking CTA visibility for authority; the safe design move is one primary action plus concise guard and recovery copy.

Reframing Matrix:
- Page-as-button-wall: rejected.
- Page-as-job: kept through page job, status and one primary next step.
- Page-as-gate: constrained by blocked reason and recovery.
- Page-as-handoff: kept for evidence, advisor, compliance, governance and export transitions without changing behavior.

TRIZ: improve decisiveness while preserving hard gates by separating page-level primary navigation from local contextual actions.

SIT Closed World: reused route registry, route policy, `ProductGuidancePanel`, `PageHeader` and existing route-smoke harness; no new routes, product scope engine, API, schema, screen or image asset.

Zwicky + CCA:
- Variant A: refactor every page-local button. Rejected for blast radius.
- Variant B: add CTA state only to Product Guidance. Kept as the global page-state layer.
- Variant C: replace `UxCtaCluster`. Rejected because previous complexity proof already uses it for local clusters.

SCAMPER: substituted generic next-step copy with guarded state, combined primary CTA and recovery into one area, eliminated visible demo-explanation copy in guidance and rearranged CTA markers for testability.

Harvard / BATNA: objective criteria are the task card, `NAV-POL-004` and P0 safety obligations. BATNA remains stop/report if a task requires behavior changes or route elevation.

MESOs:
- Option A: global CTA state in product guidance plus PageHeader compatibility. Chosen.
- Option B: broad local button rewrite. Deferred to route-specific later CTA tasks.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3461 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA one-primary"`
- `PLAYWRIGHT_PORT=3462 pnpm test:workflow-gate` rerun sequentially as `PLAYWRIGHT_PORT=3466`
- `PLAYWRIGHT_PORT=3463 pnpm test:workflow-api`
- `PLAYWRIGHT_PORT=3464 pnpm test:file-export` rerun sequentially as `PLAYWRIGHT_PORT=3467`
- `PLAYWRIGHT_PORT=3465 pnpm test:permissions` rerun sequentially as `PLAYWRIGHT_PORT=3468`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-CTA-001/`

Ethics/Fairness: no coercive action hierarchy, no hidden bypass, no success overclaim and no client-visible unapproved advice.

Adversarial QA: a primary CTA could imply downstream success. Tests reject export/download/sufficiency/release/admin-overclaim labels and verify blocked reason plus recovery in six priority flows.

Learning Log: later `UX-CTA-002` through `UX-CTA-007` can refine specific journey chains while keeping this global page-state marker contract.

Route-policy rows cited:
- `NAV-POL-004` page job/status/one primary next step.
- Evidence: `027-030`, `046`, `047`.
- Advisory/approval/compliance: `033-041`.
- Governance/admin: `048-051`.
- Export: `054-058`.
- Protected register: P1 `052`, `053`, `059`, `060`, `068`; Reference `061-063`; Hold `064-067`, `069-071`.

Changed files:
- `lib/product-guidance.ts`
- `components/product-guidance-panel.tsx`
- `components/page-header.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-evidence-upload.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-advisory-workbench.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-advisor-approval.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-compliance-queue.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-governance-users.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-export-preview.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors after sequential rerun.
- `PLAYWRIGHT_PORT=3461 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA one-primary"` - passed, 7 tests.
- `PLAYWRIGHT_PORT=3463 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3466 pnpm test:workflow-gate` - passed, 13 tests after sequential rerun.
- `PLAYWRIGHT_PORT=3467 pnpm test:file-export` - passed, 14 tests after sequential rerun.
- `PLAYWRIGHT_PORT=3468 pnpm test:permissions` - passed, 8 tests after sequential rerun.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-evidence-upload.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-advisory-workbench.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-advisor-approval.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-compliance-queue.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-governance-users.png`
- `artifacts/ux-page-to-policy/UX-CTA-001/2026-06-22-UX-CTA-001-export-preview.png`

Positive acceptance:
- Eligible productive routes map to exactly one guarded page-state primary CTA.
- Six priority flows show a primary CTA, secondary context, blocked reason and recovery link.

Negative/P0 acceptance:
- Protected P1/Reference/Hold routes remain locked with no productive primary CTA.
- CTA labels and tests do not claim evidence sufficiency, client release, export approval/download readiness or admin override.
- Existing P0 workflow, export and permission tests passed.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, worksets and route scopes remain unchanged.

No-P1/Hold/Reference-elevation confirmation: protected routes remain non-productive and locked.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-CTA-002

Task: `UX-CTA-002` - Implement MJ-001 setup-to-release CTA chain.

Mission Card: connect the MJ-001 setup-to-release route sequence with guarded primary CTAs, blocked reasons and recovery paths without implying gate completion, client acceptance, evidence sufficiency, export approval or admin bypass.

Evidence Intake:
- Task-master `UX-CTA-002` related routes: `001/013/014 -> 015/018/027-030/033-045 -> 019/020/045`.
- Route Policy Matrix `CTA-POL-001` through `CTA-POL-006`, `CTA-POL-008`, `NAV-POL-004` and `NAV-POL-006`.
- Existing implementation finding: `ProductGuidance` is the narrowest global place to model page-state next links; local workflow APIs and gates already enforce P0 behavior.

Problem Architecture: MJ-001 needs a clear setup-to-release handoff chain, but route-to-route navigation must not suggest completed setup, sufficient evidence, approved advice, compliance release or client acceptance.

Double Diamond:
- Discover: setup, evidence, advisory, compliance and decision routes had useful local CTAs but not one coherent MJ-001 chain.
- Define: implement route-to-route primary CTA links in guidance only.
- Develop: mapped tenant setup, evidence intake, advisory review, compliance review and decision/client endpoint transitions.
- Deliver: route-smoke contract coverage, P0 safety validation and six screenshots.

Psycho-Logic + Map/Model: the decision pressure is knowing the next handoff. The map trap is treating "next" as "done"; the safe move is a guarded chain with blocked reason and recovery at every step.

Reframing Matrix:
- Page-as-checklist: rejected when it implies completion.
- Page-as-chain: kept as navigation/handoff.
- Page-as-gate: kept only through non-authorizing blocked copy.
- Page-as-client endpoint: constrained to client-safe/released projection language.

TRIZ: increase progression clarity while preserving hard gate separation by making the next link explicit and leaving all mutation semantics in existing workflow services/tests.

SIT Closed World: reused route registry, existing smoke paths, `ProductGuidance`, route policy and tests. No route, screen, API, schema, image or state-screen was added.

Zwicky + CCA:
- Variant A: add a new journey engine. Rejected as out of scope.
- Variant B: add route-specific ProductGuidance overrides. Chosen for narrowness.
- Variant C: rewrite each page body. Rejected for blast radius.

SCAMPER: combined scattered next-step intent into one chain, substituted over-broad labels with guarded labels, rearranged evidence/advisory/compliance handoffs and eliminated explanatory demo text from the chain surface.

Harvard / BATNA: objective criteria are route policy CTA rules and P0 tests. BATNA remains stop/report if actual gate mutation changes are required.

MESOs:
- Option A: metadata-only CTA chain. Chosen.
- Option B: workflow behavior change. Rejected; not authorized by this UX task.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3470 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA MJ-001"`
- `PLAYWRIGHT_PORT=3471 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3472 pnpm test:workflow-api`
- `PLAYWRIGHT_PORT=3473 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3474 pnpm test:permissions`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-CTA-002/`

Ethics/Fairness: no deceptive progress claims, no client-visible draft, no pressure CTA and no hidden bypass.

Adversarial QA: MJ-001 could overclaim release or acceptance. Tests reject labels for evidence sufficiency, client acceptance, release complete, download readiness and admin override.

Learning Log: later CTA tasks should refine specialized subchains while preserving the MJ-001 handoff spine.

Route-policy rows cited:
- Setup: `013`, `014`, `015`, `018`.
- Evidence: `027`, `028`, `029`, `030`, `046`.
- Advisory/approval/compliance/decision: `033` through `045`.
- Client-safe endpoints: `019`, `020`, `045`.

Changed files:
- `lib/product-guidance.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-tenant-directory.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-create-tenant.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-document-upload.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-trigger-detail.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-release-controls.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-decision-submitted.png`

Validation:
- `pnpm typecheck` - passed after narrowing the route test map key type.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3470 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA MJ-001"` - passed, 7 tests.
- `PLAYWRIGHT_PORT=3471 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3472 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3473 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3474 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-tenant-directory.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-create-tenant.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-document-upload.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-trigger-detail.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-release-controls.png`
- `artifacts/ux-page-to-policy/UX-CTA-002/2026-06-22-UX-CTA-002-decision-submitted.png`

Positive acceptance:
- MJ-001 route IDs `013`, `014`, `015`, `018`, `027-030`, `033-045` map to guarded primary next-step links.
- Six representative MJ-001 pages render one guarded primary CTA and blocked reason.

Negative/P0 acceptance:
- No CTA label claims evidence sufficiency, release completion, client acceptance, download readiness or admin override.
- Workflow, export and permission tests still prove P0 gates remain behavioral and fail-closed.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, worksets and route scopes remain unchanged.

No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was touched or elevated.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-005

Task: `UX-DENSITY-005` - Apply D4 Focused Detail to object decision routes.

Mission Card: sharpen D4 object decision routes into focused detail surfaces with object, status, next action, gate, key facts, evidence/audit and action rail, while keeping task/method/proof explanation out of visible app UI.

Evidence Intake:
- Task-master related routes: `035`, `037`, `039`, `044`, `047`, `057`, `058`.
- Route-policy D4 rows cited: `/workbench/triggers/:id`, `/advisor-approval/:id`, `/compliance/:id/review`, `/decisions/:id`, `/evidence/:id`, `/export/:id/preview`, `/export/:id/download`.
- Existing implementation finding: PAGE-003 detail structure existed, but D4 needed a testable focused-detail status strip and stronger negative proof that visible UI does not expose handbook/task/proof language.

Problem Architecture: detail pages need higher information density without becoming explanatory spec panels or implying that visible status/action copy completes evidence, advice, compliance, export, audit or RBAC gates.

Double Diamond:
- Discover: D4 routes had object header, facts, evidence/timeline and action rail, but no D4-specific above-fold focused status strip.
- Define: D4 needs functional detail identity: object, status, next action and gate.
- Develop: extend the existing shared detail panel with D4-only focused status strip and metadata.
- Deliver: D4 route-smoke coverage, D1-D4 screenshot proof, reports and safety test reruns.

Method Artifacts:
- Psycho-Logic + Map/Model: user pressure is "tell me the state and what I can safely do." The map trap is turning proof/method labels into product UI. Design move: functional labels only.
- Reframing Matrix: page-as-list rejected; page-as-job kept; page-as-gate kept; page-as-handoff kept for export delivery without collapsing approval/download/share.
- TRIZ: increase density and orientation without weakening gates by adding a compact status strip above existing sections.
- SIT Closed World: reused `UxDetailStandardPanel`, density policy, existing route data and route-smoke harness.
- Zwicky + CCA: shared D4 detail strip kept; per-page bespoke layouts rejected; visible "D4 Focused Detail" label rejected as handbook copy.
- SCAMPER: added status strip, combined gate and next-action signal, eliminated visible method/proof phrasing, rearranged detail density without new routes.
- Harvard/BATNA: objective criteria are Route Policy Matrix D4 policy and user copy rule. BATNA remains stop/report if behavior authority is required.
- MESOs: A shared D4 panel extension chosen; B per-route rewrite rejected; C tests-only proof rejected because user asked to adapt surfaces.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm visual:contract`
- `PLAYWRIGHT_PORT=3447 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY focused detail"`
- `PLAYWRIGHT_PORT=3448 pnpm test:route-smoke`
- `PLAYWRIGHT_PORT=3451 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3452 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3453 pnpm test:file-export`

Ethics/Fairness: no deception, no dark patterns, no fake proof, no client-visible AI draft, no hidden safety weakening and no export/advice/evidence overclaim.

Adversarial QA: D4 action rail could be misread as authority; tests require gate language and also prove no D2/D3 coercion and no visible D4/task/proof wording.

Learning Log: `UX-DENSITY-006` can now enforce above-the-fold job/status/next-step using the same functional-copy rule across all eligible routes.

Changed files:
- `components/ux-detail-standard-panel.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings and 0 errors.
- `pnpm visual:contract` - passed, 71 assets/routes checked, 0 failures.
- `PLAYWRIGHT_PORT=3447 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY focused detail"` - passed, 7 tests.
- `PLAYWRIGHT_PORT=3448 pnpm test:route-smoke` - passed, 200 tests.
- `PLAYWRIGHT_PORT=3451 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3452 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3453 pnpm test:file-export` - passed, 14 tests.
- A first parallel permissions/workflow run hit Next dev-server lock contention while route-smoke owned the server; sequential reruns passed.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-d1-portal-control.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-d2-workbench-control.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-d3-audit-control.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-trigger-detail-d4.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-compliance-review-d4.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-evidence-record-d4.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-005/2026-06-22-UX-DENSITY-005-export-preview-d4.png`

Positive acceptance:
- Scoped D4 routes expose focused detail density with object, status, next action, gate, key facts, evidence/audit and action rail.
- The visible app UI uses product work/status labels, not task/method/proof explanation.

Negative/P0 acceptance:
- D4 detail UI does not imply unapproved advice, evidence sufficiency, compliance release, export approval/download/share, audit persistence or RBAC expansion.
- D4 routes are not coerced into D2 workbench or D3 operations treatment.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, worksets, route scopes and route-policy classifications remain unchanged.

No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was elevated.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-006

Task: `UX-DENSITY-006` - Enforce above-the-fold status/page-job/next-step rule.

Mission Card: ensure every eligible MVP/MVP_SUPPORT app-shell route shows product job, route status, current gate and exactly one primary next step in the first desktop viewport, without surfacing task/proof/policy explanation in the visible product UI.

Evidence Intake:
- Task-master target: all MVP and flow-relevant support routes.
- Route Policy Matrix rule cited: `NAV-POL-004` requires page header/page guidance to show page job, status/gate and one primary next step.
- Existing implementation finding: `ProductGuidancePanel` already carried the right structure for many routes, but routes without overrides could lack a primary next step and there was no all-route above-fold regression proof.

Problem Architecture: users need immediate orientation and next action, but visible UI must not imply gate completion, route-policy proof or permission expansion.

Double Diamond:
- Discover: some routes depended on explicit guidance overrides for primary next-step presence.
- Define: all productive app-shell routes need a default primary action when no route-specific action is defined.
- Develop: add a safe same-route/next-flow fallback and test above-fold placement across 50 MVP/MVP_SUPPORT app routes.
- Deliver: route-smoke proof, D1-D4 screenshot proof and report updates.

Method Artifacts:
- Psycho-Logic + Map/Model: users need "where am I, what is the status, what can I do next?" The map trap is presenting route/task/proof metadata as product truth.
- Reframing Matrix: page-as-card-wall rejected; page-as-job kept; page-as-gate kept; page-as-manual rejected for visible UI.
- TRIZ: improve orientation without weakening gates through non-authorizing guidance and fallback next-step links.
- SIT Closed World: reused route registry, product guidance, flow steps and existing AppShell.
- Zwicky + CCA: global fallback chosen; per-page CTA edits rejected; visible policy labels rejected.
- SCAMPER: added fallback, marked existing UI for proof, eliminated hidden missing-primary cases and rearranged nothing that would hide gates.
- Harvard/BATNA: objective criteria are `NAV-POL-004` and the UX task card; BATNA is stop/report if a route needs new behavior.
- MESOs: A shared fallback plus broad regression chosen; B bespoke page edits rejected; C tests-only without implementation rejected.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm visual:contract`
- `PLAYWRIGHT_PORT=3455 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY above-the-fold"`
- `PLAYWRIGHT_PORT=3456 pnpm test:route-smoke`
- `PLAYWRIGHT_PORT=3457 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3458 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3459 pnpm test:file-export`

Ethics/Fairness: no dark patterns, no false success, no hidden gate weakening, no client-visible AI draft and no claim that a visible next step completes downstream controls.

Adversarial QA: fallback primary actions could be mistaken for authorization; the copy remains "Open/Continue" and existing P0 tests prove permissions, workflow gates and export lifecycle stay separate.

Learning Log: `UX-CTA-001` can now build on a reliable one-primary-next-step surface and should harden blocked/recovery CTA semantics without adding new authority.

Changed files:
- `components/product-guidance-panel.tsx`
- `lib/product-guidance.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings and 0 errors after rerunning outside Playwright's `test-results` race.
- `pnpm visual:contract` - passed, 71 assets/routes checked, 0 failures.
- `PLAYWRIGHT_PORT=3455 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY above-the-fold"` - passed, 50 tests.
- `PLAYWRIGHT_PORT=3456 pnpm test:route-smoke` - passed, 250 tests.
- `PLAYWRIGHT_PORT=3457 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3458 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3459 pnpm test:file-export` - passed, 14 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-006/2026-06-22-UX-DENSITY-006-d1-portal-above-fold.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-006/2026-06-22-UX-DENSITY-006-d2-workbench-above-fold.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-006/2026-06-22-UX-DENSITY-006-d3-audit-above-fold.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-006/2026-06-22-UX-DENSITY-006-d4-export-preview-above-fold.png`

Positive acceptance:
- 50 productive MVP/MVP_SUPPORT app-shell routes show job, status, gate and one primary next step above the fold.
- Routes without explicit guidance overrides now receive a safe default primary action.

Negative/P0 acceptance:
- Above-fold guidance does not imply release, evidence sufficiency, export approval/download/share, audit persistence, advice visibility or RBAC expansion.
- P1, Reference and Hold routes remain excluded from productive next-step proof.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, worksets, route scopes and route-policy classifications remain unchanged.

No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was elevated.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-004

Task: `UX-DENSITY-004` - Apply D3 Dense Operations to governance/export/audit tables.

Mission Card: apply D3 Dense Operations to the existing governance, audit and export operation routes that the Route Policy Matrix classifies as dense operations, while preserving route scope, compliance release, export lifecycle separation, audit visibility/persistence separation, RBAC and no-generation rules.

Evidence Intake:
- Task-master `UX-DENSITY-004` target behavior: D3 dense operation treatment for governance/export/audit tables.
- Route-policy rows cited: `042` `/compliance/:id/audit`, `048` `/governance/users`, `049` `/governance/roles`, `050` `/governance/access-requests`, `051` `/governance/audit-history`, `055` `/export/:id/scope`, `056` `/export/:id/redaction`.
- Guard row cited: `054` `/export/new` remains D2 Productive Wizard/Hub, not a D3 operations table.
- Existing implementation finding: dense data tables existed, but D3 metadata, sort/action semantics and safety-state framing were not consistent.
- User surface-copy instruction applied: explanatory route/task/proof/method copy belongs in docs/handbook, not visible app UI.

Problem Architecture: operations users need compact table-first control surfaces, but dense layout must not imply admin bypass, evidence sufficiency, export approval/download/share, audit persistence or compliance release.

Double Diamond:
- Discover: governance/export/audit routes had useful data, but density behavior and visible copy were mixed with explanatory proof language.
- Define: create a D3 operations wrapper and keep surface copy functional: status, controls, rows and blocked gates.
- Develop: reuse existing `DataTable`, route density metadata, static sort callbacks and existing safety state panels.
- Deliver: D3 operations panels, table semantics, route-smoke proof, visual proof and a handbook rule for non-product explanatory copy.

Psycho-Logic + Map/Model: the operations user pressure is "show me what needs action without making me hunt." The map trap is mistaking a dense table or visible row action for permission. The safe design move is table-first density with explicit blocked gate status and no explanatory task labels in visible UI.

Reframing Matrix:
- Page-as-list: rejected when it only piles cards or notes.
- Page-as-job: kept through result counts, filters and row actions.
- Page-as-gate: kept through non-bypass state panels.
- Page-as-handoff: kept for export scope/redaction without implying preview, approval or download completion.

TRIZ: improve scan density and operational speed without weakening safety gates by adding D3 structure around existing tables instead of adding new actions or authority.

SIT Closed World: reused `DataTable`, route policy/density helpers, existing demo rows, existing export/governance/audit screens and route-smoke harness; no route, schema, API, screen generation or product scope engine was introduced.

Zwicky + CCA:
- Variant A: one shared D3 operations panel plus existing tables. Kept.
- Variant B: rewrite each route into a bespoke operations dashboard. Rejected as broad and less provable.
- Variant C: classify all export routes as D3. Rejected because row `054` is D2 Productive Wizard/Hub.

SCAMPER: substituted visible proof/task language with product-language status, combined filter/sort/action controls in table-first operations panels, eliminated dead explanatory copy from visible UI, rearranged support status after product content on admin/support pages.

Harvard / BATNA: objective criteria are the Route Policy Matrix rows and task card. BATNA remains stop/report if a route needs behavior or authority changes beyond D3 UX structure.

MESOs:
- Option A: table-first D3 panel applied only to matrix D3 routes. Chosen.
- Option B: broader governance shell rewrite with new layout primitives. Rejected for scope.
- Option C: docs-only copy policy without code cleanup. Rejected because user explicitly asked to adapt already-refactored pages.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm visual:contract`
- `PLAYWRIGHT_PORT=3446 pnpm test:route-smoke`
- Targeted D3, mobile, permissions, workflow-gate and file-export Playwright runs.
- Screenshot proof under `artifacts/ux-page-to-policy/UX-DENSITY-004/`.

Ethics/Fairness: no deception, no dark patterns, no fake proof, no hidden client-visible advice, no admin bypass and no overclaim that dense operations UI completes compliance, evidence, export or audit obligations.

Adversarial QA: dense row actions could be misread as authority; tests require safety/gate copy, row action semantics and no forbidden handbook/proof copy. Export-new could be accidentally coerced into D3; tests prove it remains D2 hub/wizard.

Learning Log: `UX-DENSITY-005` should use the same pattern: focus detail density on real object decisions while keeping explanatory source/task language in docs.

Changed files:
- `components/ux-dense-operations-panel.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/ui/data-table.tsx`
- `components/page-header.tsx`
- `components/product-guidance-panel.tsx`
- `components/route-context-chip.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-hub-page.tsx`
- `components/ux-support-density-strip.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/wealth-actions-screen.tsx`
- `lib/ux-route-policy.ts`
- `lib/product-guidance.ts`
- `lib/ux-hub.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/ALPHAVEST_SURFACE_COPY_HANDBOOK_RULE.md`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Implementation summary:
- Added `UxDenseOperationsPanel` for D3 Dense Operations surfaces.
- Applied D3 table-first density to compliance audit, governance users, governance roles, access requests, audit history, export scope and export redaction.
- Corrected density policy so `042` is D3 and `054` remains D2 as required by the matrix.
- Added table test hooks for sort and row-action semantics.
- Removed visible task/proof/route-ID style explanatory copy from shared UX surfaces already touched in prior slices and documented the rule in `ALPHAVEST_SURFACE_COPY_HANDBOOK_RULE.md`.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings and 0 errors.
- `pnpm visual:contract` - passed, 71 assets/routes checked, 0 failures.
- `PLAYWRIGHT_PORT=3446 pnpm test:route-smoke` - passed, 193 tests.
- `PLAYWRIGHT_PORT=3445 pnpm exec playwright test tests/route-smoke.spec.ts -g "mobile route identity"` - passed, 8 tests after targeting the real `PageHeader`.
- `PLAYWRIGHT_PORT=3437 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY dense operations"` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3438 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-NAV route policy navigation|UX-PAGE workbench structure|UX-COMPLEXITY support density|UX-DENSITY tier contract|UX-DENSITY productive workbench"` - passed, 63 tests.
- `PLAYWRIGHT_PORT=3439 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3442 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3443 pnpm test:file-export` - passed, 14 tests.
- A first parallel workflow/file-export rerun hit Next dev-server lock contention and was rerun sequentially on fresh ports.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-compliance-audit-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-governance-users-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-governance-roles-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-governance-audit-history-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-export-scope-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-export-redaction-d3.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-004/2026-06-22-UX-DENSITY-004-export-new-d2-hub.png`

Positive acceptance:
- Scoped D3 routes now expose table-first dense operations panels with filter/sort/action semantics and dense-route metadata.
- Existing refactored surfaces now use product copy instead of visible route/task/proof explanations.

Negative/P0 acceptance:
- D3 panels do not claim compliance release, export approval/download/share, evidence sufficiency, audit persistence or admin bypass.
- `054` remains D2 and is not coerced into dense operations.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, worksets and route scopes remain unchanged; only density derivation was corrected to match the matrix.

No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was elevated or added to productive navigation.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-001

Task: `UX-DENSITY-001` - Introduce density tier mapping D1-D4 into layout patterns.

Mission Card: materialize D1-D4 density tiers from the Route Policy Matrix into existing page/layout patterns without changing routes, route scope, action authority, payload visibility or safety gates.

Evidence Intake:
- Task-master `UX-DENSITY-001` target scope: all eligible routes.
- Route Policy Matrix labels: `CONTROLLED_PREMIUM_WORKBENCH_HYBRID`, `NO_SCREEN_GENERATION`.
- Representative proof routes: `019` `/portal` as D1, `032` `/actions` as D2, `056` `/export/demo/redaction` as D3 and `047` `/evidence/demo` as D4.
- Existing implementation finding: density data already exists in UX route policy; the narrowest safe move is to expose it through shared non-authorizing UI metadata and tests.

Problem Architecture: density needs to become a consistent route contract, but visual density must not hide gate caveats or imply release, approval, sufficiency, download/share or RBAC authority.

Double Diamond:
- Discover: support and complexity slices created consistent page-job surfaces, but no central D1-D4 layout contract existed.
- Define: derive a reusable density contract from existing route policy, then attach it to shared support, workbench, priority and detail surfaces.
- Develop: added `uxDensityTierContracts` and route lookup helpers, then surfaced tier/pattern markers on existing UI components.
- Deliver: route-smoke proof, safety tests and D1-D4 screenshots.

Psycho-Logic + Map/Model: users need the page to feel appropriately calm, productive, dense or focused without mistaking density for permission. The safe move is to make density visible as orientation while keeping all gate copy and disabled/recovery states intact.

Reframing Matrix:
- Page-as-style-only: rejected because it lacks policy proof.
- Page-as-job: kept by using page-job and density metadata together.
- Page-as-gate: constrained by visible caveats and existing safety tests.
- Page-as-route-contract: kept through route-policy-derived density mapping.

TRIZ: improved density consistency without weakening safety by separating visual/layout metadata from authorization logic.

SIT Closed World: reused `uxRoutePolicyForRoute`, route registry, product guidance, support density, priority and detail components; no new routes, assets, APIs, schemas or product scope engine were introduced.

Zwicky + CCA:
- Variant A: hard-code classes page by page. Rejected as drift-prone.
- Variant B: create a new product scope engine. Rejected by task card.
- Variant C: central density contract plus existing component markers. Kept.

SCAMPER: substituted ad hoc density with tier contracts, combined density with existing support/workbench/detail surfaces and eliminated one-off route styling.

Harvard / BATNA: objective criteria are the Route Policy Matrix density rows and the task card. BATNA remains stop/report if a route would require reclassification or new scope.

MESOs:
- Option A: metadata-only contract and representative UI markers. Chosen for `UX-DENSITY-001`.
- Option B: broad visual restyling of every page. Deferred to the specific D1-D4 tasks.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3413 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY tier contract"`
- `PLAYWRIGHT_PORT=3414 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3416 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3417 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3418 pnpm test:route-smoke`
- D1-D4 screenshot proof under `artifacts/ux-page-to-policy/UX-DENSITY-001/`

Ethics/Fairness: no density treatment hides safety gates, creates dark patterns, overclaims upload/evidence sufficiency or makes disabled export/advice paths appear available.

Adversarial QA: density could make a dense operations page look operationally complete; export, workflow, permission and route-smoke tests remain green and export redaction still states approval/download/share are separate blocked stages.

Learning Log: `UX-DENSITY-002` through `UX-DENSITY-005` can now apply route-specific D1-D4 visual refinements from a single policy-derived contract instead of inventing local classifications.

Route-policy rows cited:
- `019` `/portal` - D1 calm executive representative.
- `032` `/actions` - D2 productive workbench representative.
- `056` `/export/:id/redaction` - D3 dense operations representative.
- `047` `/evidence/:id` - D4 focused detail representative.

Changed files:
- `lib/ux-density.ts`
- `lib/product-guidance.ts`
- `lib/ux-support-density.ts`
- `components/product-guidance-panel.tsx`
- `components/ux-support-density-strip.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-complexity-priority-panel.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d1-portal.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d2-actions.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d3-export-redaction.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d4-evidence-detail.png`

Implementation summary:
- Added a central D1-D4 density contract and route lookup helpers.
- Exposed density tier and pattern metadata on existing support, workbench, priority and detail surfaces.
- Added route-smoke regression proof for D1-D4 representatives.
- Chose `/export/demo/redaction` as the D3 proof route without reclassifying `/admin/roles` or any other route.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3413 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY tier contract"` - passed, 5 tests.
- `PLAYWRIGHT_PORT=3414 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3416 pnpm test:workflow-gate` - passed, 13 tests after rerun from a prior parallel port collision.
- `PLAYWRIGHT_PORT=3417 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3418 pnpm test:route-smoke` - passed, 173 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d1-portal.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d2-actions.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d3-export-redaction.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-001/2026-06-21-UX-DENSITY-001-d4-evidence-detail.png`

Positive acceptance:
- D1-D4 density patterns are centrally defined and rendered on representative existing route surfaces.
- First-viewport page job, status context and constrained next step remain visible.

Negative/P0 acceptance:
- Density metadata does not alter client visibility, advice boundary, evidence sufficiency, audit/export lifecycle, RBAC, payload visibility, compliance release or admin governance.
- No P1, Reference or Hold route was promoted.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and route-policy rows remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-DENSITY-001` only materializes density metadata on eligible existing surfaces.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-003

Task: `UX-DENSITY-003` - Apply D2 Productive Workbench to analyst/advisor/compliance work routes.

Mission Card: apply D2 queue / selected context / action rail density to the current productive workbench routes without pulling D4 detail routes into workbench density or changing route classifications.

Evidence Intake:
- Task-master `UX-DENSITY-003` related routes: `027-030`, `033-040`, `046-047`.
- Current route-policy implementation marks `027-030`, `033`, `034`, `036`, `038` and `046` as D2 workbench surfaces; `039` and `047` remain D4 detail surfaces.
- Existing implementation finding: `ProductGuidancePanel` already owns queue/context/action rail for most work routes; `UxHubPage` needed a D2 triad for `034 /workbench`.

Problem Architecture: D2 workbench routes need dense, productive orientation, but the density layer must not imply advice release, evidence sufficiency, compliance release or broader payload authority.

Double Diamond:
- Discover: D2 guidance existed, but it lacked a route-wide testable D2 productive marker and `034 /workbench` had hub cards without an explicit triad.
- Define: expose D2 metadata on the existing workbench triads and add a focused triad for the consultant workbench hub.
- Develop: added D2 proof markers and an explicit gate/authority note in action rails.
- Deliver: targeted D2 route-smoke, permissions, workflow-gate, full route-smoke and screenshots.

Psycho-Logic + Map/Model: operators need to see the queue, selected item context and permitted next action without believing that visible status is authorization. The safe move is to make action authority text explicit in every D2 action rail.

Reframing Matrix:
- Page-as-card-wall: rejected.
- Page-as-productive-workbench: kept for current D2 routes.
- Page-as-detail decision: preserved for D4 detail routes.
- Page-as-gate: constrained through explicit gate/authority text.

TRIZ: increased productive density and reduced ambiguity while preserving safety by adding proof semantics and gate copy, not by enabling actions.

SIT Closed World: reused `ProductGuidancePanel`, `UxHubPage`, route policy helpers and existing routes; no route, schema, image, API or scope engine was added.

Zwicky + CCA:
- Variant A: restyle all related routes as D2. Rejected because D4 detail routes would be coerced.
- Variant B: test current D2 route-policy surfaces and preserve D4. Chosen.
- Variant C: delay `034 /workbench` to a later hub task. Rejected because it is in this task's related route set.

SCAMPER: combined D2 density markers with existing workbench triads, adapted the workbench hub into queue/context/action rail and clarified action authority copy.

Harvard / BATNA: objective criteria are the task card and current no-reclassification constraint. BATNA is stop/report if D2 would require changing route class.

MESOs:
- Option A: add a new D2 wrapper component. Rejected as unnecessary.
- Option B: annotate and tighten existing shared surfaces. Chosen.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3433 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY productive workbench"`
- `PLAYWRIGHT_PORT=3434 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3435 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3436 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-DENSITY-003/`

Ethics/Fairness: D2 density does not pressure users into release, approval or sufficiency; the action rail states gates and authority still decide what can proceed.

Adversarial QA: the task range includes D4 detail routes; tests prove `/compliance/demo/review` and `/evidence/demo` do not receive D2 productive workbench markers.

Learning Log: later D3/D4 work should explicitly separate current route-policy code from matrix prose where they differ, and avoid hidden route reclassification inside UX density work.

Route-policy rows cited:
- D2 applied/proved: `027`, `028`, `029`, `030`, `033`, `034`, `036`, `038`, `046`.
- D4 preserved from D2 coercion: `039`, `047`.

Changed files:
- `components/product-guidance-panel.tsx`
- `components/ux-hub-page.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-documents-d2-workbench.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-signals-d2-workbench.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-consultant-workbench-d2.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-compliance-d2-workbench.png`

Implementation summary:
- Added D2 productive workbench markers to existing workbench guidance.
- Added explicit D2 gate/authority copy to action rails.
- Added a D2 workbench triad for `034 /workbench`.
- Added route-smoke proof across D2 routes and D4 non-coercion proof.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3433 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY productive workbench"` - passed, 10 tests.
- `PLAYWRIGHT_PORT=3434 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3435 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3436 pnpm test:route-smoke` - passed, 185 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-documents-d2-workbench.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-signals-d2-workbench.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-consultant-workbench-d2.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-003/2026-06-21-UX-DENSITY-003-compliance-d2-workbench.png`

Positive acceptance:
- D2 workbench routes expose queue, selected context and action rail density.
- First viewport keeps page job, status context and constrained next action visible.

Negative/P0 acceptance:
- D2 density does not weaken advice boundary, AI Draft internal-only, upload/evidence sufficiency, compliance release or RBAC gates.
- D4 detail routes in the related range are not coerced into D2 productive workbench treatment.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: no route ID, path, scope, page type or density classification was changed.

No-P1/Hold/Reference-elevation confirmation: `UX-DENSITY-003` touches only current productive MVP/MVP-support surfaces in the related range.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-DENSITY-002

Task: `UX-DENSITY-002` - Apply D1 Calm Executive to client-facing views.

Mission Card: apply a calm, premium, client-safe D1 treatment to `019 /portal` and `020 /mobile` while preserving fail-closed visibility, hidden internal payloads and one safe next step.

Evidence Intake:
- Task-master `UX-DENSITY-002` target routes: `019`, `020`.
- Route Policy Matrix rows `019` and `020`: D1 Calm Executive, `CLIENT_SAFE_ONLY`, no AI Draft, internal rationale, compliance notes, unreleased evidence or unredacted export payload.
- Existing implementation finding: `UxHubPage` owns both portal and mobile hub content; a D1 branch there is narrower than rebuilding route pages.

Problem Architecture: the D1 views need calm orientation and a premium density level, but must not turn client-facing views into internal workbenches or create multiple competing next actions.

Double Diamond:
- Discover: the D1 hub already had safe content, but the queue/card structure was closer to a productive hub than a calm executive page.
- Define: use three state cards, a released source summary and one next-step panel for D1 only.
- Develop: added a D1 rendering branch in `UxHubPage`, kept mobile explicitly single-column and enabled `Card` to pass through `data-*`/accessibility props for proof.
- Deliver: targeted D1 route-smoke, full route-smoke, P0 safety tests and screenshots for `/portal` and `/mobile`.

Psycho-Logic + Map/Model: client users need a clear answer to "what is safe to see and what should I do next?" The unsafe trap is making the page feel like an operations queue; the safe move is calm state explanation plus one next-step panel.

Reframing Matrix:
- Page-as-card-wall: rejected by removing multi-link queue treatment from D1.
- Page-as-client-safe state: kept with Released/Hidden/Next Action cards.
- Page-as-workbench: rejected for `019`/`020`.
- Page-as-gate: constrained by visible fail-closed and no-internal-leakage copy.

TRIZ: improved calmness and reduced action clutter while preserving safety by moving supporting paths into explanatory text, not extra CTA panels.

SIT Closed World: reused `UxHubPage`, `uxHubDefinitions`, route policy density and existing links; no new routes, images, APIs or product scope engine.

Zwicky + CCA:
- Variant A: per-route bespoke portal and mobile layouts. Rejected for duplication.
- Variant B: D1 branch in shared hub component. Chosen.
- Variant C: CSS-only density tweak. Rejected because it would not reduce action ambiguity.

SCAMPER: substituted a queue wall with one next-step panel, combined visibility caveats into the panel, adapted mobile to a single-column executive layout and removed redundant D1 workbench density.

Harvard / BATNA: objective criteria are the two D1 route rows and P0 client visibility obligations. BATNA remains stop/report if client-safe copy or route policy cannot be preserved.

MESOs:
- Option A: D1-only shared branch in `UxHubPage`. Chosen.
- Option B: defer mobile because it is a separate route. Rejected because `020` is explicitly in scope.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3427 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY calm executive"`
- `PLAYWRIGHT_PORT=3422 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3423 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3428 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-DENSITY-002/`

Ethics/Fairness: client users receive clear released/hidden state messaging without false reassurance, hidden advice, dark-pattern CTA pressure or implied evidence sufficiency.

Adversarial QA: mobile initially compressed D1 cards under desktop breakpoints during visual review; the final implementation keeps `020` single-column so safety copy remains readable.

Learning Log: later D2-D4 tasks should not rely on viewport breakpoints alone when the route shell has constrained width.

Route-policy rows cited:
- `019` `/portal` - D1 Calm Executive, client-safe only.
- `020` `/mobile` - D1 Calm Executive, client-safe only.

Changed files:
- `components/ui/card.tsx`
- `components/ux-hub-page.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-DENSITY-002/2026-06-21-UX-DENSITY-002-portal-calm-executive.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-002/2026-06-21-UX-DENSITY-002-mobile-calm-executive.png`

Implementation summary:
- Added a D1 Calm Executive branch to `UxHubPage`.
- D1 views render three state cards and exactly one next-step panel.
- Mobile D1 uses a single-column layout to preserve readability inside the mobile shell.
- Extended `Card` to pass through standard HTML/data attributes so shared UI surfaces can be tested and remain accessible.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3427 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-DENSITY calm executive"` - passed, 2 tests.
- `PLAYWRIGHT_PORT=3422 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3423 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3428 pnpm test:route-smoke` - passed, 175 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-DENSITY-002/2026-06-21-UX-DENSITY-002-portal-calm-executive.png`
- `artifacts/ux-page-to-policy/UX-DENSITY-002/2026-06-21-UX-DENSITY-002-mobile-calm-executive.png`

Positive acceptance:
- `/portal` and `/mobile` render D1 calm executive density with 3 state cards, one released summary and one next-step panel.
- Client-facing views keep page job, status context and primary next step above supporting content.

Negative/P0 acceptance:
- D1 views do not expose AI Draft, internal rationale, compliance notes, unreleased evidence or unredacted export payload.
- No route, route scope, payload authority, evidence sufficiency, advice release, audit/export lifecycle or RBAC behavior changed.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy rows remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-DENSITY-002` only touches MVP D1 routes `019` and `020`.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-COMPLEXITY-004

Task: `UX-COMPLEXITY-004` - Remove dead-end and duplicate CTA clusters.

Mission Card: consolidate competing CTA groups on priority-flow surfaces into one primary next step, contextual secondary actions and visible blocked reasons while preserving all Route Policy Matrix P0 obligations.

Evidence Intake:
- Task-master `UX-COMPLEXITY-004` row: priority flow routes `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010`; route policy `VISUAL_NOT_BEHAVIOUR_PROOF`, `STATUS_CHIP_NOT_GATE_PROOF`, no safety weakening.
- Route Policy Matrix rows cited: `032` `/actions`, `046` `/evidence`, `047` `/evidence/demo`, `050` `/governance/access-requests`, `056` `/export/:id/redaction`.
- Existing implementation finding: several screens exposed parallel button clusters where blocked gates require a single obvious next step plus contextual alternatives.

Problem Architecture: users could read adjacent buttons as equivalent workflow paths, especially where evidence sufficiency, access approval or export release require sequencing.

Double Diamond:
- Discover: action, evidence, governance and export surfaces had duplicate or competing CTA clusters.
- Define: one primary CTA per page state, secondary contextual actions and disabled/recovery copy must remain visible.
- Develop: add a shared `UxCtaCluster` and apply it only to touched priority route states.
- Deliver: route-smoke assertions, P0 regression tests and screenshot proof.

Psycho-Logic + Map/Model: the pressure is to click the most powerful-looking button. The safe design move is to make the next legal step primary and make blocked steps explicit instead of visually equal.

Reframing Matrix:
- Page-as-button-row: rejected.
- Page-as-job: kept with one primary CTA.
- Page-as-gate: kept by blocked reasons and existing workflow tests.
- Page-as-handoff: kept for access/export states without collapsing lifecycle steps.

TRIZ: improve speed and orientation without weakening gates by reducing CTA ambiguity while adding blocked-reason proof.

SIT Closed World: reused existing screen components, route states, test harness and safety copy patterns; no route, generated screen, image, schema or API was introduced.

Zwicky + CCA:
- Variant A: remove all secondary buttons. Rejected because recovery/context actions would disappear.
- Variant B: keep current clusters and add labels. Rejected as too weak for sequencing.
- Variant C: shared cluster with primary, secondary and blocked reason. Kept.

SCAMPER: combined duplicate clusters, substituted disabled reasons for dead-end buttons, modified button hierarchy and eliminated the strongest unsafe parallel affordances.

Harvard / BATNA: objective criteria are Route Policy Matrix P0 obligations and task-card validation commands. BATNA remains stop/report if a CTA requires behavior not authorized in UX scope.

MESOs:
- Option A: consolidate only `/actions`. Rejected as too narrow for priority-flow proof.
- Option B: consolidate representative action, evidence, governance and export route states. Chosen.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3394 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY CTA clusters"`
- `PLAYWRIGHT_PORT=3395 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3396 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3397 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3398 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/`

Ethics/Fairness: no dark pattern, no hidden approval path, no deceptive release or sufficiency claim and no admin bypass.

Adversarial QA: blocked steps could be mistaken for completed gates; route-smoke now verifies the CTA cluster and blocked reason, and P0 tests keep evidence, workflow, export and RBAC boundaries intact.

Learning Log: later `UX-CTA-*` tasks can deepen route-specific CTA chains, but this complexity slice should remain a hierarchy consolidation, not a workflow-authority change.

Route-policy rows cited:
- `032` `/actions` - MVP support route; one primary CTA, no support route authority expansion.
- `046` `/evidence` and `047` `/evidence/demo` - evidence routes; upload/download/share UI is not sufficiency or compliance release.
- `050` `/governance/access-requests` - admin non-bypass and RBAC payload negative proof required.
- `056` `/export/:id/redaction` - export preview/redaction does not approve, download or share.

Changed files:
- `components/ux-cta-cluster.tsx`
- `components/wealth-actions-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-actions-page-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-actions-drawer-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-evidence-detail-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-access-request-drawer-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-export-redaction-cta.png`

Implementation summary:
- Added a shared CTA cluster with testable primary/secondary markers and visible blocked-reason copy.
- Replaced duplicate/parallel CTA groups on Action Board, Action Drawer, Evidence Record Detail, Evidence Quick Actions, Access Requests drawer and Export Redaction.
- Kept blocked actions visible as disabled/contextual rather than hiding safety-relevant next-step constraints.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3394 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY CTA clusters"` - passed, 5 tests.
- `PLAYWRIGHT_PORT=3395 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3396 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3397 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3398 pnpm test:route-smoke` - passed, 142 tests.
- Initial parallel Playwright attempts hit a Next dev-server port collision; rerun sequentially on fresh ports and passed.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-actions-page-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-actions-drawer-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-evidence-detail-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-access-request-drawer-cta.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-004/2026-06-21-UX-COMPLEXITY-004-export-redaction-cta.png`

Positive acceptance:
- Touched route states expose one clear primary CTA, contextual secondary actions and blocked/recovery reason copy.
- Primary job and next step stay visible above supporting content on representative screenshots.

Negative/P0 acceptance:
- CTA hierarchy does not imply evidence sufficiency, compliance release, export approval/download/share, audit persistence, advice readiness or admin bypass.
- No P1, Reference or Hold route was promoted.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-COMPLEXITY-004` only touched scoped MVP/MVP_SUPPORT route states.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-COMPLEXITY-005

Task: `UX-COMPLEXITY-005` - Densify sparse support/context pages without making them noisy.

Mission Card: add page job, status and meaningful next-step content to support/context routes `001-018`, `021-026`, `031-032` without new routes, route reclassification, behavior claims or safety weakening.

Evidence Intake:
- Task-master `UX-COMPLEXITY-005` row: related routes `001-018`, `021-026`, `031-032`; route policy `VISUAL_NOT_BEHAVIOUR_PROOF`, `STATUS_CHIP_NOT_GATE_PROOF`, no safety weakening.
- Route Policy Matrix rows cited: `001-018`, `021-026`, `031`, `032`.
- Existing implementation finding: Admin, Auth, Client Context and Wealth support pages had useful content but not one consistent compact "current job / status / next step / safety" strip.

Problem Architecture: sparse support pages can feel premium-but-empty and leave users unsure what the page is for; adding density must not imply that support visibility completes a gate or expands authority.

Double Diamond:
- Discover: target pages use separate shells, so a page-specific rewrite would fragment proof.
- Define: add one reusable support-density strip driven by the route registry and UX route policy.
- Develop: render it in Auth, Admin/Tenant, Product Guidance and Wealth support shells.
- Deliver: 26-route smoke proof, P0 regression tests and representative screenshots.

Psycho-Logic + Map/Model: users need to answer "what am I doing here and where do I go next?" without reading support UI as permission. The safe move is compact orientation plus explicit "not gate-completion proof" safety copy.

Reframing Matrix:
- Sparse support page: improved with compact route-policy density.
- Noisy support dashboard: rejected.
- Page-as-gate: rejected; support status remains orientation.
- Page-as-handoff: kept through next-step links to existing routes only.

TRIZ: improve page information density without adding workflow authority by turning existing route metadata into a compact, non-authorizing strip.

SIT Closed World: reused route registry, route policy metadata, existing shells and route-smoke harness; no screen generation, new route, image, API, schema or product scope engine was introduced.

Zwicky + CCA:
- Variant A: rewrite each support page. Rejected for high blast radius.
- Variant B: add a shared static card. Rejected because it would drift from policy.
- Variant C: route-policy-derived `UxSupportDensityStrip`. Kept.

SCAMPER: combined route title, page type status, next route and safety reminder; substituted empty space with compact orientation; eliminated one-off support-page explanations.

Harvard / BATNA: objective criteria are task route list, Route Policy Matrix P0 obligations and green regression tests. BATNA remains stop/report if a page needs behavior not authorized in UX scope.

MESOs:
- Option A: cover representative pages only. Rejected because the task lists 26 support/context routes.
- Option B: cover every listed route via shared integration points. Chosen.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3404 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY support density"`
- `PLAYWRIGHT_PORT=3405 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3408 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3409 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3410 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/`

Ethics/Fairness: no misleading status, no hidden gate weakening, no coercive CTA, no admin bypass and no claim that support context equals approval or release.

Adversarial QA: support density could look like gate proof; each strip includes explicit "Visible support status is orientation, not gate-completion proof" copy and is backed by route-smoke assertions.

Learning Log: `UX-DENSITY-*` can now build on a shared route-policy density primitive instead of rediscovering support-page job/status/next-step structure.

Route-policy rows cited:
- `001-018` setup/auth/admin/tenant support routes.
- `021-026` client context/profile/family/entity support routes.
- `031` `/wealth-map` and `032` `/actions` support/context routes.

Changed files:
- `lib/ux-support-density.ts`
- `components/ux-support-density-strip.tsx`
- `components/auth-onboarding-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/product-guidance-panel.tsx`
- `components/wealth-actions-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-login-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-admin-platform-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-client-profile-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-wealth-map-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-actions-density.png`

Implementation summary:
- Added route-policy-backed support density metadata for all `UX-COMPLEXITY-005` route IDs.
- Added `UxSupportDensityStrip` with current job, status, meaningful next step and visible safety proof.
- Integrated the strip into Auth/Onboarding, Admin/Tenant, Product Guidance and Wealth support shells.
- Added route-smoke coverage for all 26 scoped routes.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3404 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY support density"` - passed, 26 tests after adjusting `/login` to run unauthenticated.
- `PLAYWRIGHT_PORT=3405 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3408 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3409 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3410 pnpm test:route-smoke` - passed, 168 tests.
- Initial parallel P0 rerun hit a Next dev-server port collision; workflow/export checks were rerun sequentially on fresh ports and passed.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-login-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-admin-platform-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-client-profile-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-wealth-map-density.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-005/2026-06-21-UX-COMPLEXITY-005-actions-density.png`

Positive acceptance:
- All 26 scoped support/context routes expose page job, status, next step and visible safety copy.
- Sparse support surfaces gain meaningful density without becoming card walls.

Negative/P0 acceptance:
- Support status is explicitly not gate-completion proof.
- No route scope, payload authority, evidence sufficiency, advice boundary, compliance release, audit persistence, export lifecycle or admin bypass behavior changed.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-COMPLEXITY-005` only touched scoped MVP/MVP_SUPPORT context routes listed in the task card.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

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

## Completed Slice: UX-COMPLEXITY-002

Task: `UX-COMPLEXITY-002` - Move secondary/tertiary detail into drawers/tabs without hiding safety gates.

Mission Card: move secondary context on routes `031`, `046`, `048`, `050` and `051` into tabs/drawer context while preserving visible safety gates for wealth-map context, evidence visibility, RBAC, governance access review and audit persistence.

Evidence Intake:
- Task-master `UX-COMPLEXITY-002` target rows: `031`, `046`, `048`, `050`, `051`.
- Route Policy Matrix drawer rule: drawers can show secondary context but must not become complete workflow, release or export approval surfaces.
- Existing implementation finding: `046`, `048`, `050` and `051` already used real drawers; `031` is now a standalone hub, so the narrow dependency fix was in `components/ux-hub-page.tsx`.
- Existing lifecycle-spec finding: `tests/interaction-lifecycle.spec.ts` still expects the old Wealth Map fake drawer on `/wealth-map?state=drawer`; the new UX-HUB implementation intentionally replaced that surface. The current proof is the new route-smoke drawer/tab test.

Problem Architecture: secondary details were either stacked in drawers or mixed into dense hub context. The safe design move is to tab contextual detail while leaving safety gates outside the tabbed content.

Double Diamond:
- Discover: target routes had secondary facts, linked documents, access detail, lineage and handoff context competing with primary work.
- Define: keep gate prerequisites and safety warnings visible, move non-primary detail into tabs.
- Develop: add shared `UxSecondaryContextTabs` and apply it to existing drawers plus the `031` hub.
- Deliver: route-smoke proof, P0 safety tests, screenshots and reports.

Psycho-Logic + Map/Model: when detail overload rises, users can mistake surrounding facts for permission to act. The safe model is "context in tabs, gate outside tabs."

Reframing Matrix:
- Detail-as-workflow: rejected.
- Detail-as-context: kept in tabs/drawers.
- Gate-as-hidden-tab: rejected.
- Gate-as-visible-page constraint: kept.

TRIZ: reduce detail overload without weakening safety gates by separating secondary context from visible prerequisites.

SIT Closed World: reused existing drawers, hub definitions, route state and smoke tests; no new routes, generated screens/images, APIs, schema changes or product-scope engine.

Zwicky + CCA:
- Variant A: rewrite each route layout deeply. Rejected as too broad.
- Variant B: add shared tabs inside current drawers/context zones. Chosen.
- Variant C: convert workflows into drawer workflows. Rejected by Route Policy Matrix.

SCAMPER: rearranged facts/linked docs/access/lineage into tabs, combined repeated drawer section chrome, and kept gate panels outside the tab body.

Harvard / BATNA: objective criteria are the Route Policy Matrix drawer rule and P0 safety obligations. BATNA is documenting stale lifecycle-spec expectations rather than reintroducing old fake drawers.

MESOs:
- Option A: target only `046`, `048`, `050`, `051`. Rejected because task explicitly includes `031`.
- Option B: include narrow `031` hub dependency fix plus existing drawers. Chosen.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3370 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY secondary context drawers and tabs"`
- `PLAYWRIGHT_PORT=3378 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3379 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3380 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3381 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/`

Ethics/Fairness: no hidden safety prerequisite, no workflow-in-drawer deception, no claim that drawer/tab visibility proves lifecycle behavior, evidence sufficiency, audit persistence or export approval.

Adversarial QA: a drawer tab could hide a gate; the new component carries a visible safety note and the page-level P0 panels remain outside tab content.

Learning Log: `UX-COMPLEXITY-003` can formalize Must-see / Secondary / Tertiary hierarchy using this tab pattern while keeping safety content in the Must-see layer.

Route-policy rows cited:
- `031` `/wealth-map`
- `046` `/evidence`
- `048` `/governance/users`
- `050` `/governance/access-requests`
- `051` `/governance/audit-history`

Changed files:
- `components/ux-secondary-context-tabs.tsx`
- `components/ux-hub-page.tsx`
- `components/wealth-actions-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-wealth-map-secondary-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-evidence-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-governance-users-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-access-requests-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-audit-history-drawer-tabs.png`

Implementation summary:
- Added shared accessible secondary-context tab component.
- Added real `031` hub secondary context tabs as a narrow dependency fix because Wealth Map is now a standalone hub page.
- Converted Evidence, Governance Users, Access Requests and Audit History drawer secondary details into tabbed context.
- Kept visibility, sensitive-access, policy/SOD and audit-persistence safety panels visible outside hidden tab content.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3370 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY secondary context drawers and tabs"` - passed, 5 tests.
- `PLAYWRIGHT_PORT=3378 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3379 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3380 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3381 pnpm test:route-smoke` - passed, 132 tests.
- `PLAYWRIGHT_PORT=3371 pnpm exec playwright test tests/interaction-lifecycle.spec.ts` - stopped after stale/blocked failures; the spec still expects old Wealth Map fake drawer behavior and left a dev server running, which was killed before rerunning P0 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-wealth-map-secondary-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-evidence-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-governance-users-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-access-requests-drawer-tabs.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-002/2026-06-21-UX-COMPLEXITY-002-audit-history-drawer-tabs.png`

Positive acceptance:
- Secondary context on the scoped routes is presented through tabs/drawers.
- Primary job, next-step surfaces and required safety notes remain visible.

Negative/P0 acceptance:
- Tabs do not hide required gates, evidence needs, audit state, RBAC warnings or export/compliance boundaries.
- No drawer became a complete workflow, release surface, export approval surface or behavior proof.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: `UX-COMPLEXITY-002` touched only scoped MVP/MVP_SUPPORT target rows.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed P0 tests.

## Completed Slice: UX-COMPLEXITY-003

Task: `UX-COMPLEXITY-003` - Create Must-see / Secondary / Tertiary content hierarchy per page type.

Mission Card: define and prove a content-priority hierarchy across MVP/MVP_SUPPORT page types without adding visible spec UI, route scope, product actions or safety weakening.

Evidence Intake:
- Task-master `UX-COMPLEXITY-003`.
- Route Policy Matrix page-type rules for Hub, Workbench, Detail, Drawer, Modal, Reference, P1 and Hold.
- Existing implementation finding: PAGE and COMPLEXITY work already produced shared surfaces for product guidance, hubs, workbench priority, detail standard and secondary context tabs.

Problem Architecture: pages need a stable hierarchy, but visible labels such as "Must-see / Secondary / Tertiary" would turn implementation policy into app UI. The safe approach is semantic DOM tiering plus route-smoke proof.

Double Diamond:
- Discover: shared surfaces exist but did not expose a durable hierarchy contract.
- Define: map each page type to Must-see, Secondary and Tertiary content responsibilities.
- Develop: add `lib/ux-content-hierarchy.ts` and mark shared surfaces with `data-ux-content-tier`.
- Deliver: representative Hub/Workbench/Detail/Drawer route proof, screenshots and reports.

Psycho-Logic + Map/Model: users scan under pressure. The first visible layer must carry job, status, next step and safety; supporting detail can follow without competing.

Reframing Matrix:
- Page-as-equal-card-wall: rejected.
- Page-as-priority-stack: kept.
- Page-as-hidden-gate: rejected.
- Page-as-policy-overlay: rejected.

TRIZ: increase scan clarity while avoiding new visible meta UI by using semantic tier attributes and existing shared components.

SIT Closed World: reused `ProductGuidancePanel`, `UxHubPage`, `UxDetailStandardPanel`, `UxComplexityPriorityPanel` and `UxSecondaryContextTabs`; no new route, image, generated screen, API, Prisma or scope engine.

Zwicky + CCA:
- Variant A: visible tier labels on every page. Rejected as spec UI.
- Variant B: semantic tier contract and shared-component attributes. Chosen.
- Variant C: per-page bespoke refactor. Deferred to later density/CTA/interaction tasks.

SCAMPER: standardized tier semantics, combined page-type hierarchy with route-smoke proof, and eliminated the need for repeated visible policy labels.

Harvard / BATNA: objective criteria are Route Policy Matrix page-type rules and the clean UI rule. BATNA is metadata/test proof, not visible app annotations.

MESOs:
- Option A: metadata-only hierarchy. Rejected as too abstract.
- Option B: metadata plus DOM tiering on shared surfaces. Chosen.

Measurement Plan:
- `pnpm typecheck`
- `pnpm lint`
- `PLAYWRIGHT_PORT=3383 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY content priority hierarchy"`
- `PLAYWRIGHT_PORT=3384 pnpm test:permissions`
- `PLAYWRIGHT_PORT=3385 pnpm test:workflow-gate`
- `PLAYWRIGHT_PORT=3386 pnpm test:file-export`
- `PLAYWRIGHT_PORT=3387 pnpm test:route-smoke`
- Screenshot proof under `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/`

Ethics/Fairness: no dark-pattern priority, no hidden safety prerequisites, no false proof from visible status/button/tier, and no client-visible leakage.

Adversarial QA: tiering could hide safety under secondary/tertiary content; safety notes and gate guidance are explicitly marked Must-see and tested on representative routes.

Learning Log: later density tasks can reuse `data-ux-content-tier` rather than inventing separate page-by-page rules.

Route-policy rows cited:
- Page-type rules for Hub, Workbench, Detail, Drawer, Modal, Reference, P1 and Hold.
- Representative route proof: `031`, `032`, `039`, `046`.

Changed files:
- `lib/ux-content-hierarchy.ts`
- `components/product-guidance-panel.tsx`
- `components/ux-hub-page.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-complexity-priority-panel.tsx`
- `components/ux-secondary-context-tabs.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-hub-wealth-map-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-workbench-actions-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-detail-compliance-review-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-drawer-evidence-hierarchy.png`

Implementation summary:
- Added page-type content hierarchy contract.
- Applied `data-ux-content-tier` to shared must-see, secondary and tertiary UI surfaces.
- Added route-smoke proof that every page type has all three tiers and representative routes render the tiers without hiding safety.

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with existing warnings.
- `PLAYWRIGHT_PORT=3383 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-COMPLEXITY content priority hierarchy"` - passed, 5 tests.
- `PLAYWRIGHT_PORT=3384 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3385 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3386 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3387 pnpm test:route-smoke` - passed, 137 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-hub-wealth-map-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-workbench-actions-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-detail-compliance-review-hierarchy.png`
- `artifacts/ux-page-to-policy/UX-COMPLEXITY-003/2026-06-21-UX-COMPLEXITY-003-drawer-evidence-hierarchy.png`

Positive acceptance:
- Must-see, Secondary and Tertiary hierarchy is defined for every page type.
- Representative Hub, Workbench, Detail and Drawer routes render all tiers.

Negative/P0 acceptance:
- Safety/gate guidance remains in Must-see tier.
- No visible spec panels or route-label annotations were added to app UI.

No-generation confirmation: no screen generation, state-screen generation, image generation or generated product assets.

No-route-reclassification confirmation: route IDs, paths, scopes, page types and policy labels remain unchanged.

No-P1/Hold/Reference-elevation confirmation: tier metadata does not unlock protected routes.

No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed P0 tests.

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

## Completed Slice: UX-CTA-003

Task: `UX-CTA-003` - Implement evidence upload/review CTA chain without sufficiency overclaim.

Mission Card: align evidence upload/review CTAs on routes `027-030`, `038-041` and `047` so upload, review, scoped sufficiency check, compliance recovery and evidence detail actions stay separate and never imply release, export or client visibility.

Evidence Intake:
- Task-master `UX-CTA-003`; Route Policy Matrix `CTA-POL-003`, `CTA-POL-004`, `CTA-POL-005`, `CTA-POL-006`.
- Existing upload and evidence tests already prove upload is not sufficiency and review is scoped.

Method artifacts: Discover found upload/review labels still too generic. Define kept behavior unchanged and changed only CTA labels/guidance. Develop replaced evidence-source wording with source-for-review wording and added negative route-smoke proof. Deliver includes screenshots and P0 validation.

Changed files:
- `lib/product-guidance.ts`
- `components/client-intake-screen.tsx`
- `tests/product-guidance-shell.spec.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-003/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3477 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA evidence"` - passed, 7 tests.
- `PLAYWRIGHT_PORT=3478 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3479 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3480 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3481 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-documents-queue.png`
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-upload-review.png`
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-extraction-review.png`
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-verification.png`
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-compliance-evidence-request.png`
- `artifacts/ux-page-to-policy/UX-CTA-003/2026-06-22-UX-CTA-003-evidence-detail.png`

Positive acceptance: evidence pages show one primary guarded next step with upload/review language.

Negative/P0 acceptance: tests reject evidence-sufficient, release-ready, client-visible and export-ready claims; workflow/upload/export/permission tests remain green.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no protected route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-CTA-007

Task: `UX-CTA-007` - Standardize disabled/blocked/recovery CTA copy.

Mission Card: standardize disabled action reasons and recovery CTAs across visible safety-critical MVP/MVP_SUPPORT states without creating routes, reclassifying scope, changing workflow behavior or exposing internal/policy proof text as product UI.

Evidence Intake:
- Task-master `UX-CTA-007`; Route Policy Matrix rows `032`, `047`, `050`, `054-058`.
- Route Policy Matrix `CTA-POL-001`, `CTA-POL-005`, `CTA-POL-007`, `SAFE-POL-005`, `SAFE-POL-008`.
- Existing `PageHeader` already supported blocked reason and recovery; local `UxCtaCluster` did not expose per-disabled-action reasons or recovery affordances.

Method artifacts: Discover found disabled local CTAs with labels but no adjacent reason on action, evidence and export surfaces. Define kept one primary per state and added blocked/recovery copy to the local cluster. Develop reused `UxCtaCluster`, existing route links, drawers and state panels. Deliver includes six visible safety-flow screenshots and route-smoke negative proof.

Changed files:
- `components/ux-cta-cluster.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/wealth-actions-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-007/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3532 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA disabled blocked recovery copy"` - passed, 6 tests.
- `PLAYWRIGHT_PORT=3533 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3534 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3535 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3536 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-actions-board-blocked-new-action.png`
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-actions-drawer-mark-ready-blocked.png`
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-evidence-record-disabled-actions.png`
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-export-redaction-disabled-approval-download.png`
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-export-download-share-blocked.png`
- `artifacts/ux-page-to-policy/UX-CTA-007/2026-06-22-UX-CTA-007-governance-access-request-controlled-approval.png`

Positive acceptance: local CTA clusters now expose one primary CTA, disabled action reasons and recovery actions on action-board, evidence, export and governance states.

Negative/P0 acceptance: route-smoke rejects admin override, evidence sufficient, release complete, preview approved, download ready, share ready, client accepted and client visibility unlocked claims; workflow, export and permission tests remain green.

Deviation note: an initial proof attempt targeted a non-rendered legacy Workbench readiness card. The final proof set uses visible MVP/MVP_SUPPORT routes only.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-INTERACTION-001

Task: `UX-INTERACTION-001` - Implement table/search/filter/sort/row-action semantics only where scoped.

Mission Card: ensure interactive-looking queue/table controls either perform a scoped UI lifecycle or are visibly static/disabled, without fake persistence, route changes, workflow mutation or safety gate weakening.

Evidence Intake:
- Task-master `UX-INTERACTION-001`; Route Policy Matrix rows `036`, `038`, `050`, `055-056`.
- Route Policy Matrix `VISUAL_NOT_BEHAVIOUR_PROOF`, `STATUS_CHIP_NOT_GATE_PROOF`, `RBAC_PAYLOAD_CRITICAL`, `SAFE-POL-005`, `SAFE-POL-008`.
- Existing `DataTable` always rendered row-action buttons even when no row action existed; D3 operation controls were rendered as buttons even when they were static scope chips.

Method artifacts: Discover found fake row actions and static controls styled as active buttons. Define kept interaction lifecycle to scoped UI navigation/drawer opening only. Develop added internal table sort, optional row actions, disabled static row actions, disabled static filter chips and visible queue search on advisor/compliance queues. Deliver includes focused route-smoke proof plus P0 and upload validations.

Changed files:
- `components/ui/data-table.tsx`
- `components/ux-dense-operations-panel.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `tests/route-smoke.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-INTERACTION-001/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3538 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-INTERACTION table search sort row-action semantics"` - passed, 3 tests.
- `PLAYWRIGHT_PORT=3539 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3540 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3541 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3542 pnpm test:permissions` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3543 pnpm test:document-upload-api` - passed, 8 tests.
- `PLAYWRIGHT_PORT=3545 pnpm test:document-upload-flow` - passed, 4 tests after adding the same demo-auth cookie used by route-smoke.
- `PLAYWRIGHT_PORT=3546 pnpm test:playwright` - blocked in legacy suites before task coverage: `tests/committee-review-routes.spec.ts` missing legacy held-route headings; `tests/confirmation-lifecycle.spec.ts` missing legacy release dialog locators. Run interrupted after 14 passed, 4 failed, 1 interrupted, 522 not run.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-INTERACTION-001/2026-06-22-UX-INTERACTION-001-advisor-search-row-action.png`
- `artifacts/ux-page-to-policy/UX-INTERACTION-001/2026-06-22-UX-INTERACTION-001-compliance-search-clear-row-action.png`
- `artifacts/ux-page-to-policy/UX-INTERACTION-001/2026-06-22-UX-INTERACTION-001-export-static-controls-disabled-row-action.png`

Positive acceptance: advisor and compliance queues now support visible search filtering, sortable table headers and scoped row actions to detail routes; access requests open the existing drawer from row action.

Negative/P0 acceptance: export D3 controls no longer expose fake control buttons; non-scoped table row actions are disabled and labeled. P0 workflow, export, permission and upload tests remain green.

Deviation note: `pnpm test:playwright` remains blocked by pre-existing legacy expectations outside this task; no route, generated screen or safety behavior was changed to satisfy those stale expectations.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no P1, Reference or Hold route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-CTA-006

Task: `UX-CTA-006` - Implement export lifecycle CTA separation.

Mission Card: keep export scope, redaction, preview, approval, generation, download and share as separate visible lifecycle steps on routes `054-058`.

Evidence Intake:
- Task-master `UX-CTA-006`; Route Policy Matrix rows `054-058`.
- Route Policy Matrix `CTA-POL-007`, `CTA-POL-008`, `SAFE-POL-008`.
- Existing export service tests already prove lifecycle separation; UI still allowed delivery copy to collapse approved/downloaded/share-ready states.

Method artifacts: Discover found combined delivery labels and a real contradiction where the download page said both `not downloaded` and `Downloaded`. Define kept export service/API behavior unchanged and changed UI copy, disabled share state and regression tests. Develop reused existing export pages, product guidance and state panels. Deliver includes six screenshots and P0 export validation.

Changed files:
- `components/communication-export-ops-screen.tsx`
- `lib/product-guidance.ts`
- `tests/route-smoke.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-006/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3524 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA export"` - passed, 7 tests.
- `PLAYWRIGHT_PORT=3518 pnpm exec playwright test tests/ui-state-boundaries.spec.ts -g "export"` - passed, 4 tests.
- `PLAYWRIGHT_PORT=3520 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3521 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3522 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3523 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-export-new-scope-first.png`
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-export-scope-not-approval.png`
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-redaction-blocks-approval-download.png`
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-preview-not-approval.png`
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-approval-modal-not-delivery.png`
- `artifacts/ux-page-to-policy/UX-CTA-006/2026-06-22-UX-CTA-006-download-share-blocked.png`

Positive acceptance: export routes now expose one next lifecycle step per state, and the delivery page keeps download primary while secure share remains disabled until download is recorded.

Negative/P0 acceptance: tests reject download-ready, share-ready, client-accepted, client-visibility-unlocked and preview-approved claims; export service, workflow and permission tests remain green.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no protected route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-CTA-005

Task: `UX-CTA-005` - Implement governance/admin non-bypass CTA behaviour.

Mission Card: constrain admin and governance CTAs on routes `009`, `048-051` and adjacent compliance gates `038-040` so access administration never implies advice release, evidence sufficiency, export approval, audit suppression or payload authority.

Evidence Intake:
- Task-master `UX-CTA-005`; Route Policy Matrix rows `009`, `038-040`, `048-051`.
- Route Policy Matrix `SAFE-POL-001`, `SAFE-POL-002`, `SAFE-POL-005`, `CTA-POL-003`, `CTA-POL-005`, `CTA-POL-007`.
- Existing permission tests already prove admin export/advice non-bypass; UI needed clearer scoped labels and less proof-code/explanatory surface copy.

Method artifacts: Discover found generic `Approve`, `Export`, `Save Changes` and visible reason-code proof text on governance pages. Define kept permission/workflow behavior unchanged and tightened labels, blocked reasons and recovery wording. Develop reused product guidance, existing drawers/modals and trust panels. Deliver includes six screenshots plus focused governance and P0 validation.

Changed files:
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `lib/product-guidance.ts`
- `lib/screen-trust-flow.ts`
- `tests/route-smoke.spec.ts`
- `tests/scf-p07-p09-trust-ui.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-005/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3506 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA governance"` - passed, 6 tests.
- `PLAYWRIGHT_PORT=3505 pnpm exec playwright test tests/scf-p07-p09-trust-ui.spec.ts -g "P08 governance"` - passed, 1 test.
- `PLAYWRIGHT_PORT=3496 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3497 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3498 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3499 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-admin-roles-scoped-permission.png`
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-governance-users-scoped-invite.png`
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-governance-roles-scoped-change.png`
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-access-request-policy-checked.png`
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-audit-history-controlled-export.png`
- `artifacts/ux-page-to-policy/UX-CTA-005/2026-06-22-UX-CTA-005-compliance-release-boundary.png`

Positive acceptance: admin/governance pages now expose scoped access, role, permission and audit CTAs with one guarded primary action per state.

Negative/P0 acceptance: focused route-smoke rejects admin override, release-ready, client-visibility-unlocked, download-ready and audit-suppressed claims; P0 workflow, export and permission tests remain green.

Deviation note: an attempted full `tests/scf-p07-p09-trust-ui.spec.ts` run still contains stale non-governance expectations for legacy visibility/decision panel placements. The task-scoped P08 governance test was updated and passed.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no protected route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.

## Completed Slice: UX-CTA-004

Task: `UX-CTA-004` - Implement AI draft rejection/rebuild CTA chain as internal-only.

Mission Card: keep AI/rules draft actions internal on advisor approval and adjacent advisory routes, while making reject, rebuild, evidence request and advisor-to-compliance handoff distinct.

Evidence Intake:
- Task-master `UX-CTA-004`; Route Policy Matrix rows `033-037` and `027-030`.
- Route Policy Matrix `SAFE-POL-004`, `CTA-POL-005`, `CTA-POL-006` and `ADVICE_BOUNDARY_CRITICAL`.
- Existing advisor detail implementation already routed approval to compliance review; CTA copy and success-like metric wording needed tightening.

Method artifacts: Discover found a client-visible success implication risk in `AI Draft Recommendation` plus `82% Success`. Define kept workflow behavior unchanged and changed only labels, blocked copy and test proof. Develop used the existing advisor detail rail and route-smoke suite. Deliver includes six CTA screenshots and P0 negative tests.

Changed files:
- `components/internal-workflow-screen.tsx`
- `tests/route-smoke.spec.ts`
- `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- `artifacts/ux-page-to-policy/UX-CTA-004/*.png`

Validation:
- `pnpm typecheck` - passed.
- `pnpm lint` - passed with 27 existing warnings, 0 errors.
- `PLAYWRIGHT_PORT=3483 pnpm exec playwright test tests/route-smoke.spec.ts -g "UX-CTA AI draft"` - passed, 1 test.
- `PLAYWRIGHT_PORT=3484 pnpm test:workflow-gate` - passed, 13 tests.
- `PLAYWRIGHT_PORT=3485 pnpm test:workflow-api` - passed, 15 tests.
- `PLAYWRIGHT_PORT=3486 pnpm test:file-export` - passed, 14 tests.
- `PLAYWRIGHT_PORT=3487 pnpm test:permissions` - passed, 8 tests.

Screenshot/proof:
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-signal-queue.png`
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-workbench.png`
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-trigger-detail.png`
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-advisor-queue.png`
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-advisor-detail-internal-draft.png`
- `artifacts/ux-page-to-policy/UX-CTA-004/2026-06-22-UX-CTA-004-evidence-review.png`

Positive acceptance: advisor detail exposes one advisor-to-compliance primary action plus internal rebuild, evidence request and unsupported-claim rejection actions.

Negative/P0 acceptance: route-smoke rejects client-release wording and the old `82% Success` overclaim; workflow, export and permission tests remain green.

No-generation confirmation: no screen, state-screen, image or generated product asset was created.
No-route-reclassification confirmation: route IDs, paths, worksets and scopes remain unchanged.
No-P1/Hold/Reference-elevation confirmation: no protected route was touched or elevated.
No-safety-regression confirmation: client visibility, advice boundary, upload/evidence, audit/export and RBAC remain governed by existing engines and passed tests.
