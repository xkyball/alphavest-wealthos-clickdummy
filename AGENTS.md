# AlphaVest WealthOS — AGENTS.md

## Current mission
Build AlphaVest WealthOS as a demo-data-first web application using Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma and Docker Compose.

## Mandatory source of truth
Read this before implementation:

- `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`

`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md` is the only
operative source of truth for AlphaVest tasks and phases. It owns phase IDs
`P00` through `P14`, `SCF-Pxx-Txxx` task IDs, task/subtask scope, dependencies,
execution order, acceptance criteria, proof obligations, QA-before-Codex gates
and stop rules.

Older First-Build, MVP, V3, minimum-path, journey, package-plan, final-task,
task-master, prompt-pack and previous handoff artefacts are historical or
supporting references only for task/phase work. They must not define task
scope, reorder phases, revive BP/AV-FB task IDs, add new task IDs, bypass the
SCF detail plan's hold/defer/static decisions, or override its proof gates.
When a product or safety rule from an older artefact is stricter and does not
conflict with the SCF detail plan, keep the stricter safety rule.

## Visual source of truth
Use `public/reference/page_ui_v3/clean_pages/` as page-level UI design reference.

Important: the images are not pixel-perfect contracts. They show design direction, components, screen composition and states. Normalize all pages into one homogeneous AlphaVest design system.

## Clean UI rule
Do not implement spec panels, route labels, filenames, annotation rails, dev notes, callout legends or explanatory documentation as app UI. Only implement actual application UI.

## Navigation mapping rule
For tasks, prompts or tests that still refer to old left-navigation groups,
route-catalogue menu labels, or legacy sidebar wording, read and apply
`docs/v3/LEFT_NAV_OLD_TO_NEW_MAPPING.md` before editing navigation, changing
shell layout, or writing navigation tests. Treat that file as the translation
contract from old task language to the current task-oriented navigation; do not
reintroduce old sidebar labels simply because a historical task uses them. The
route registry remains authoritative for route IDs, paths and worksets; the
mapping only translates older navigation language to the current presentation
and active-parent behavior.

## Product rules
- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions.
- Sensitive actions create audit events.

## Early implementation rule
Do not start with real authentication. Use a demo session, role switcher and tenant switcher first. Permission and security functions must exist early but may return permissive/demo results until `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md` or a derived QA-passed prompt pack/handoff authorizes a stricter implementation task.

## Engineering rules
- Use TypeScript strictly.
- Use Tailwind and shared components.
- Do not create one-off screen-specific styling unless unavoidable.
- Centralize routes, statuses, permissions, workflows and evidence logic.
- Use Prisma and generated seed data from the start.
- No real client data.
- No final financial/legal/tax advice.
- Run build/lint/tests when available.
- Keep changes phase-scoped and commit-ready.

## Required reporting after each SCF phase
Produce or update:

- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`
- list of changed files
- tests run
- unresolved risks / TODOs
