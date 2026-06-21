# AlphaVest WealthOS — AGENTS.md

## Current mission
Build AlphaVest WealthOS as a demo-data-first web application using Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma and Docker Compose.

## Mandatory source of truth
Read this before implementation:

- `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md` when the task is about DB-backed tables, lists, cards, search, filters, sorting, pagination, row actions, forms, input masks, wizards, seed data, metrics, charts, gauges or the DBTF phase sequence.
- `ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md` when the task is about the 25 canonical journeys, CJ-001 through CJ-025, E2E journey proofs, journey proof fixtures/harnesses, canonical path coverage, or the E2E proof workstream sequence.
- `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md`
- `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`
- `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`

`ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md` is the operative Codex
source of truth for the E2E Journey Proof 25 workstream. For journey-proof
tasks it supersedes broader SCF and older journey/handoff artefacts as the
active task-card, workstream, stop-rule and reporting contract. It does not by
itself authorize immediate implementation: each execution turn must follow the
relevant E2E workstream or `E2E-CJ-*` task card, verify the target files and
Control-Layer dependencies first, and preserve its bans on new screens,
state-screen/image generation, Prisma migrations, new API routes without
`API_DECISION_REQUIRED`, `main`-derived work, P1/HOLD elevation, autonomous
advice, admin bypass or client-visible AI drafts.

`ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md` is the operative Codex
execution source of truth for focused DBTF work. For DBTF tasks it supersedes
the broader SCF prompt pack as the active phase sequence and scope boundary.
Its highest planning source is
`ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`; if that file is
missing, report it as a blocker before doing DBTF feature edits. DBTF work must
stay limited to DB-backed tables/lists/boards/card-lists, search/filter/sort/
pagination, row actions and RBAC row filtering, forms/input masks/wizards, seed
data, data-derived metrics/charts/gauges and focused tests. It does not
authorize broad AlphaVest implementation, full advice/compliance/export
architecture, new screens, screen/image/state-screen generation, production auth
rebuilds, blind APIs, blind Prisma migrations or P1/Hold/Reference promotion.

`ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` is the operative Codex
execution source of truth for broad SCF work outside the DBTF focus. It owns the phased Codex
prompt sequence, phase entry/exit instructions, validation-discovery rules,
reporting templates, Do-Not-Implement register and stop-after-phase workflow
for implementation turns.

`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md` is the
highest authorization source inside the prompt-pack hierarchy. It owns release
authorization, `AUTHORIZED_*` labels, non-goals, forbidden work, prompt-pack /
handoff dependency and stop rules. The Codex Prompt Pack must not be used to
override the release plan's authorization boundaries.

`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md` remains the
direct predecessor and detailed task/subtask source for phase IDs `P00` through
`P14`, `SCF-Pxx-Txxx` task IDs, dependencies, acceptance criteria, proof
obligations and QA-before-Codex gates. It must be read through the Codex Prompt
Pack and release-plan authorization layer and must not be treated as broader
implementation approval where either says work is deferred, held,
reference-only or not authorized.

Older First-Build, MVP, V3, minimum-path, journey, package-plan, final-task,
task-master, prompt-pack and previous handoff artefacts are historical or
supporting references only for task/phase work. They must not define task
scope, reorder phases, revive BP/AV-FB task IDs, add new task IDs, bypass the
prompt pack or release plan's hold/defer/static decisions, or override their
proof gates.
When a product or safety rule from an older artefact is stricter and does not
conflict with the prompt pack or release plan, keep the stricter safety rule.

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
Do not start with real authentication. Use a demo session, role switcher and tenant switcher first. Permission and security functions must exist early but may return permissive/demo results until `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` or a later QA-passed handoff authorizes a stricter implementation task.

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

## Required reporting after each DBTF phase
Produce or update the DBTF phase report required by
`ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`, including:

- Phase ID `DBTF-Pxx`
- completed workstream/task/subtask IDs
- changed and inspected files
- DB/seed/API/service changes
- tests run and proof produced
- positive and negative acceptance result
- stop rules, deviations, blockers and next recommended phase
