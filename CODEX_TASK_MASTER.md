# CODEX_TASK_MASTER.md — AlphaVest WealthOS Browser Click-Dummy

## Mission
Build the AlphaVest WealthOS browser click-dummy from the repository knowledgebase and wireframe assets.

## Critical First Instruction
Before writing code, inspect and summarize these files:

- `AGENTS.md`
- `docs/ALPHAVEST_WEALTHOS_KB.md`
- `docs/WIREFRAME_MANIFEST.md`
- `docs/SCREEN_SPECS.md`
- `docs/FUNCTIONAL_SCOPE.md`
- `docs/QUALITY_GATES.md`
- `public/reference/wireframes/board-01-product-ecosystem-overview.png`
- `public/reference/wireframes/board-02-mobile-app-home-next-step-today.png`
- `public/reference/wireframes/board-03-mobile-document-upload-flow.png`
- `public/reference/wireframes/board-04-client-web-portal-dashboard.png`
- `public/reference/wireframes/board-05-live-global-wealth-map.png`
- `public/reference/wireframes/board-06-action-board-next-best-action.png`
- `public/reference/wireframes/board-07-signal-trigger-engine.png`
- `public/reference/wireframes/board-08-digital-decision-room.png`
- `public/reference/wireframes/board-09-evidence-vault-decision-record.png`
- `public/reference/wireframes/board-10-consultant-workbench.png`
- `public/reference/wireframes/board-11-advisor-approval-screen.png`
- `public/reference/wireframes/board-12-compliance-advice-boundary-console.png`
- `public/reference/wireframes/board-13-role-based-access-family-governance.png`
- `public/reference/wireframes/board-14-client-communication-call-trigger-flow.png`
- `public/reference/wireframes/board-15-end-to-end-client-journey.png`
- `public/reference/wireframes/board-16-mvp-scope-vs-future-vision.png`

Then implement.

## Stack
Use Next.js App Router, React, TypeScript, Tailwind CSS, Docker Compose. Use Prisma/Postgres if feasible; static demo-data fallback is allowed if it keeps the prototype robust and explain the tradeoff.

## Output Routes
Implement:
`/presentation`, `/mobile`, `/mobile/upload`, `/portal`, `/wealth-map`, `/actions`, `/signals`, `/decisions`, `/evidence`, `/workbench`, `/advisor-approval`, `/compliance`, `/governance`, `/communication`, `/journey`, `/roadmap`.

## Implementation Phases

### Phase A — Project Foundation
1. Initialize Next.js TypeScript App Router project.
2. Add Tailwind, global CSS variables and AlphaVest design tokens.
3. Add Dockerfile and docker-compose with web and postgres.
4. Add `.env.example`.
5. Add reusable layout components: AppShell, PageHeader, GlassPanel, MetricCard, WorkflowBadge, StatusChip, WireframePhone, DashboardTable, Timeline, Drawer, Modal, GateChecklist.
6. Add `lib/demo-data.ts`, `lib/workflows.ts`, `lib/routes.ts`, `lib/status.ts`.
7. Add a global disclaimer banner.

### Phase B — Visual System
8. Build a premium wireframe design system based on the reference PNGs: dark navy, gold borders, ivory text, dense dashboard panels, subtle world-map motif.
9. Create reusable board shell matching the references: top brand line, board number, title, subtitle, content grid, right annotation panel, bottom workflow/legend strip.
10. Build a reference viewer component that can show a small source PNG thumbnail on each route in dev/demo mode, but do not use PNG as the sole screen implementation.

### Phase C — Client Experience Screens
11. Build `/presentation` with product story and start button.
12. Build `/mobile` per Board 02.
13. Build `/mobile/upload` per Board 03.
14. Build `/portal` per Board 04.
15. Build `/wealth-map` per Board 05.
16. Build `/actions` per Board 06.
17. Build `/signals` per Board 07.
18. Build `/decisions` per Board 08.
19. Build `/evidence` per Board 09.

### Phase D — Human Workflow Screens
20. Build `/workbench` per Board 10.
21. Build `/advisor-approval` per Board 11.
22. Build `/compliance` per Board 12.
23. Build `/governance` per Board 13.
24. Build `/communication` per Board 14.
25. Build `/journey` per Board 15.
26. Build `/roadmap` per Board 16.

### Phase E — State and Click Dummy Logic
27. Implement local/demo state interactions listed in `docs/FUNCTIONAL_SCOPE.md`.
28. Ensure advisor approval alone does not publish to client.
29. Ensure compliance can approve/block.
30. Ensure evidence/audit messages appear after client decisions and permission changes.
31. Ensure call/F2F escalation appears based on selected communication scenario.

### Phase F — Quality Assurance
32. Add Playwright smoke tests for all core routes and interactions.
33. Run build, lint and tests.
34. Compare every route against its corresponding wireframe PNG and fix major mismatches.
35. Verify all Quality Gates in `docs/QUALITY_GATES.md` and create `docs/IMPLEMENTATION_QA_REPORT.md`.
36. Update README with setup, route list, demo path, interaction list, limitations and next steps.

## Acceptance
The task is complete only if:

- all 16 screens exist and are navigable;
- design clearly follows the wireframe PNGs;
- the click flows work;
- no-unapproved-advice gating is visible and functional;
- README explains how to present;
- `docs/IMPLEMENTATION_QA_REPORT.md` documents quality gate results.

## Final Codex Response
When done, report:

1. What was built.
2. How the KB and wireframes were used.
3. How to run.
4. Demo route list.
5. Implemented interactions.
6. Quality gates passed/failed.
7. Known limitations.
8. Suggested next iteration.
