Max

# AlphaVest UX PAGE To POLICY Sequential Execution Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Execute the AlphaVest UX refactoring tasks after the four `UX-HUB-*` tasks, in
the exact order defined by `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`.

Scope starts at `UX-PAGE-001` and continues through `UX-POLICY-005`:

1. `UX-PAGE`
2. `UX-COMPLEXITY`
3. `UX-DENSITY`
4. `UX-CTA`
5. `UX-INTERACTION`
6. `UX-SAFETY`
7. `UX-POLICY`

Do not execute `UX-NAV-*` or `UX-HUB-*` as primary workstreams in this run.
Only touch navigation/app-shell/hub files when a `UX-PAGE` through `UX-POLICY`
task explicitly requires a narrow dependency fix, and document why.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof wrapper:

- Mission Card
- Evidence Intake
- Problem Architecture
- Branch preservation
- Debate
- Adversarial QA
- Proof Paths
- Learning Log

Use ENGINE_v2 as the Codex execution and legitimacy stack:

- V2-P0 Task Freeze
- V2-P1 Pre-flight Reading
- V2-P2 Existing State Audit
- V2-P3 Delta Plan
- V2-P4 Implementation
- V2-P5 Test / QA Pass
- V2-P6 Documentation Update
- V2-P7 Handoff Return
- V2-P8 Next Phase Gate

Keep method artifacts concise but visible. Do not name-drop methods without
producing the artifact.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

Target branch: `full-workflow`.

## Mandatory Source Reading

Read these before implementation decisions:

1. `AGENTS.md`
2. `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
3. Support artefacts explicitly named by the True-UX handoff for the selected
   phase/task.
4. `docs/v3/LEFT_NAV_OLD_TO_NEW_MAPPING.md` if the True-UX handoff-authorized
   scope touches navigation, sidebar,
   app-shell, active-parent, route-label or navigation test is touched.

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` is the only operative source of
truth. Previous prompt packs, handoffs, package plans, source snapshots, media
packages and `main` are not target truth.

## Non-Negotiable Constraints

- Follow `AGENTS.md`; repo-specific guidance wins.
- Demo-data-first only.
- Do not start or replace real authentication.
- Do not use real client data.
- Do not create routes.
- Do not reclassify routes.
- Do not elevate P1, Reference or Hold routes.
- Do not generate screens, state screens or images.
- Do not use image generation.
- Do not turn spec panels, route labels, filenames, annotation rails, dev
  notes, callout legends or explanatory documentation into app UI.
- Do not weaken RBAC, tenant isolation, permission checks, payload visibility,
  evidence, audit, advice-boundary or compliance-release behavior.
- No unapproved advice reaches the client.
- Advisor approval alone is not compliance release.
- Compliance release controls client visibility.
- Upload success is not evidence sufficiency.
- Export preview is not approval, download or share.
- Admin users cannot bypass safety gates.
- Visual references under `public/reference/page_ui_v3/clean_pages/` are design
  direction, not pixel-perfect contracts.
- Route presence, static UI, screenshots, disabled/no-op buttons, labels and
  green tests alone are not proof of behavior.

## Required Task Order

Run each task card in order. Complete, validate, document and checkpoint before
moving to the next task unless a blocker requires stopping.

### UX-PAGE

1. `UX-PAGE-001` - Apply page-type contract to all MVP and MVP_SUPPORT routes.
2. `UX-PAGE-002` - Split workbench pages into queue / selected context / action
   rail.
3. `UX-PAGE-003` - Standardize detail pages with object header,
   evidence/timeline and gated action rail.
4. `UX-PAGE-004` - Keep P1, Reference and Hold routes out of productive MVP
   page-type work.

### UX-COMPLEXITY

5. `UX-COMPLEXITY-001` - Reduce card-wall overload into summary + priority
   queue + action rail.
6. `UX-COMPLEXITY-002` - Move secondary/tertiary detail into drawers/tabs
   without hiding safety gates.
7. `UX-COMPLEXITY-003` - Create Must-see / Secondary / Tertiary content
   hierarchy per page type.
8. `UX-COMPLEXITY-004` - Remove dead-end and duplicate CTA clusters.
9. `UX-COMPLEXITY-005` - Densify sparse support/context pages without making
   them noisy.

### UX-DENSITY

10. `UX-DENSITY-001` - Introduce density tier mapping D1-D4 into layout
    patterns.
11. `UX-DENSITY-002` - Apply D1 Calm Executive to client-facing views.
12. `UX-DENSITY-003` - Apply D2 Productive Workbench to
    analyst/advisor/compliance work routes.
13. `UX-DENSITY-004` - Apply D3 Dense Operations to governance/export/audit
    tables.
14. `UX-DENSITY-005` - Apply D4 Focused Detail to object decision routes.
15. `UX-DENSITY-006` - Enforce above-the-fold status/page-job/next-step rule.

### UX-CTA

16. `UX-CTA-001` - Implement one-primary-CTA page-state pattern.
17. `UX-CTA-002` - Implement MJ-001 setup-to-release CTA chain.
18. `UX-CTA-003` - Implement evidence upload/review CTA chain without
    sufficiency overclaim.
19. `UX-CTA-004` - Implement AI draft rejection/rebuild CTA chain as
    internal-only.
20. `UX-CTA-005` - Implement governance/admin non-bypass CTA behaviour.
21. `UX-CTA-006` - Implement export lifecycle CTA separation.
22. `UX-CTA-007` - Standardize disabled/blocked/recovery CTA copy.

### UX-INTERACTION

23. `UX-INTERACTION-001` - Implement table/search/filter/sort/row-action
    semantics only where scoped.
24. `UX-INTERACTION-002` - Harden drawer and modal lifecycle.
25. `UX-INTERACTION-003` - Convert wizard/stepper visuals into explicit
    progression where route is in support scope.
26. `UX-INTERACTION-004` - Standardize route state panels and recovery paths.
27. `UX-INTERACTION-005` - Align upload interaction with upload-only safety
    messaging.
28. `UX-INTERACTION-006` - Use drawers for secondary context, not workflows.
29. `UX-INTERACTION-007` - Add accessibility/focus/keyboard expectations to
    overlays and workbenches.

### UX-SAFETY

30. `UX-SAFETY-001` - Client-facing fail-closed UX and tests.
31. `UX-SAFETY-002` - AI Draft internal-only UX and tests.
32. `UX-SAFETY-003` - Advisor approval is not compliance release UX and tests.
33. `UX-SAFETY-004` - Upload success is not evidence sufficiency UX and tests.
34. `UX-SAFETY-005` - Export preview/approval/download separation UX and
    tests.
35. `UX-SAFETY-006` - Admin non-bypass and route/action/payload separation
    tests.
36. `UX-SAFETY-007` - Audit visibility vs audit persistence warning and tests.

### UX-POLICY

37. `UX-POLICY-001` - Materialize route UX policy metadata without creating a
    new product scope engine.
38. `UX-POLICY-002` - Use route policy to exclude P1/reference/hold from
    productive MVP navigation.
39. `UX-POLICY-003` - Add route-policy regression proof.
40. `UX-POLICY-004` - Add no-generation/no-route-reclassification reporting
    checks.
41. `UX-POLICY-005` - Keep UX task execution traceable to source decisions.

## Execution Cadence

### Before editing

1. Run `pwd` and `git status --short --branch`.
2. Identify uncommitted changes. Treat them as user-owned unless you clearly
   made them in this run.
3. Do not revert unrelated changes.
4. If user-owned changes touch the same files needed for the next task, inspect
   them and work with them. Stop only if the conflict makes the task unsafe.
5. Read the current task card and every related route-policy row before
   editing.
6. Record the task's target routes, target files, allowed changes, forbidden
   changes, P0 obligations and validation commands.

### Per task

For each task:

1. Freeze scope to the current task ID.
2. Audit existing implementation before editing.
3. Make the narrowest implementation that satisfies the task card.
4. Preserve route scope, payload boundaries and safety gates.
5. Add or update tests when the task touches safety-critical behavior.
6. Capture screenshots for UI-touching changes when practical. Store proof
   under `artifacts/ux-page-to-policy/<task-id>/`.
7. Update reporting:
   - `docs/v3/PHASE_EXECUTION_REPORT.md`
   - `docs/v3/IMPLEMENTATION_QA_REPORT.md`
   - create or update `docs/v3/UX_PAGE_TO_POLICY_EXECUTION_REPORT.md`
8. Run the task-specific validation commands listed in the task card. At
   minimum run `pnpm typecheck` and `pnpm lint` after code changes unless an
   earlier command proves the same failure and you document it.
9. Summarize positive and negative acceptance evidence.
10. Commit a coherent checkpoint before moving on when the task is complete and
    validated.

### Commit cadence

Commit frequently, but only with coherent, validated slices.

- Prefer one commit per completed task.
- If a task is tiny and purely mechanical, it may be batched with the next
  adjacent task, but never batch more than two tasks.
- Keep `UX-SAFETY-*`, `UX-POLICY-*` and any task touching visibility, advice,
  export, audit, permissions or route policy in separate commits.
- Stage only files belonging to the completed task slice.
- Include screenshot artifacts with `git add -f` when they are part of proof
  and live under ignored `artifacts/` paths.
- Do not stage generated `next-env.d.ts` churn unless the task explicitly
  targets generated route types.

Suggested commit message format:

```bash
git add <scoped files>
git commit -m "feat(ux): complete UX-PAGE-001 page type contract"
```

Use the matching task ID in every commit message.

## Validation Strategy

Use the task-card validation commands first. Common commands include:

```bash
pnpm typecheck
pnpm lint
pnpm test:route-smoke
pnpm test:permissions
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm test:file-export
pnpm test:playwright
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/permission-engine.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts
```

If Playwright or dev-server-backed tests hit `EADDRINUSE`, use a fresh
`PLAYWRIGHT_PORT` and rerun sequentially. Do not treat a port collision as a
product failure.

## Stop Rules

Stop and report instead of improvising when:

- The next task requires new routes, route reclassification, generated screens,
  generated images, state-screen assets or P1/Hold/Reference elevation.
- A task requires new API routes, Prisma migrations, schema replacement or real
  auth not explicitly authorized by the active source.
- P0 positive/negative proof cannot be produced.
- Client-visible content might include AI Draft, unreleased advice, internal
  notes, unredacted export data or internal compliance rationale.
- Admin/governance changes could bypass gates.
- Existing user changes in target files conflict with the task and cannot be
  safely reconciled.
- Validation fails because of your changes and no narrow fix is available in
  the current task scope.

## Required Final Report

At the end of each committed slice, report:

- Task IDs completed.
- Commit hash and commit message.
- Changed files.
- Route-policy rows cited.
- Tests run and pass/fail status.
- Screenshots/proof paths.
- Positive acceptance result.
- Negative/P0 acceptance result.
- Deviations or blockers.
- No-generation confirmation.
- No-route-reclassification confirmation.
- No-P1/Hold/Reference-elevation confirmation.
- No-safety-regression confirmation for client visibility, advice boundary,
  upload/evidence, audit/export and RBAC.

At the end of the whole run, produce a compact roll-up by workstream and leave
the repo in a commit-ready or fully committed state.

## Method Artifacts To Keep Visible

Use concise artifacts, not long essays:

- Mission Card: current task, source, routes, target files, acceptance.
- Evidence Intake: files read, route-policy rows, current implementation
  findings.
- Double Diamond: discover, define, develop, deliver for the current task.
- Psycho-Logic + Map/Model: user decision pressure, current UI map trap, safe
  design move.
- Reframing Matrix: current page-as-list vs page-as-job vs page-as-gate vs
  page-as-handoff.
- TRIZ: improve orientation without weakening safety gates.
- SIT Closed World: reuse existing components and route registry before adding
  abstractions.
- Zwicky + CCA: layout/page-type variants considered and rejected/kept.
- SCAMPER: concrete simplifications applied.
- Harvard/BATNA: objective criteria from route policy; BATNA is stop/report, not
  unsafe implementation.
- MESOs: at least two implementation slice shapes if scope is ambiguous.
- Measurement Plan: cheap test/screenshot/proof for the task.
- Ethics/Fairness: no deception, coercion, dark patterns or hidden safety
  weakening.
- Adversarial QA: what could leak, bypass, overclaim or drift.
- Learning Log: what the task taught about the next task.
