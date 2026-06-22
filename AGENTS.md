# AlphaVest WealthOS — AGENTS.md

## Current mission
Build AlphaVest WealthOS as a demo-data-first web application using Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma and Docker Compose.

## Mandatory source of truth
Read `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` before any implementation,
planning handoff, QA claim, prompt derivation, route change, UI refactor, test
change or reporting change.

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` is the only operative source of
truth for this repository. It owns execution authority, phase order, preflight
rules, task eligibility, route evolution discipline, safety boundaries,
validation obligations, proof language and reporting requirements.

The handoff's required support chain is:

- `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md`
- `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md`
- `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md`

Other imported policy, safety, matrix and lock artefacts may be read only as
supporting context when the True-UX handoff names or requires them. No other
file may elevate itself into implementation authority, phase authority,
task-source authority, route-scope authority, release authority or acceptance
authority.

Codex must run the Moving Baseline Preflight from the True-UX handoff before
code changes. The target branch is `full-workflow` unless the user explicitly
sets a different branch for the turn. `main`, uploaded source snapshots, visual
media packages and previous bundles are never target truth.

The True-UX handoff authorizes implementation only inside its constraints. It
does not authorize screen/image/state-screen generation, blind schema
migrations, blind API creation, safety weakening, client-visible internal
payloads, unapproved advice, admin bypasses, advisor-approval-as-release,
export without approval/redaction, or route/screen evolution without the
required record and tests.

## Visual reference
Use `public/reference/page_ui_v3/clean_pages/` as page-level UI design reference.

Important: the images are not pixel-perfect contracts. They show design direction, components, screen composition and states. Normalize all pages into one homogeneous AlphaVest design system.

## Clean UI rule
Do not implement spec panels, route labels, filenames, annotation rails, dev notes, callout legends or explanatory documentation as app UI. Only implement actual application UI.

## Navigation mapping rule
For navigation work, follow the True-UX handoff first. Use imported route,
task, route-evolution and navigation artefacts only through the hierarchy named
by that handoff.

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
Do not start with real authentication. Use a demo session, role switcher and tenant switcher first. Permission and security functions must exist early but may return permissive/demo results until the True-UX handoff or a later user-approved successor explicitly authorizes a stricter implementation task.

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

## Required reporting
After each True-UX execution phase, update the reports and proof artefacts
required by `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, including changed
files, inspected files, tests run, positive and negative acceptance result,
proof produced, deviations, blockers and next recommended phase.
