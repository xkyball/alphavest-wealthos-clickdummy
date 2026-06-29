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

After the moving-baseline preflight, run `pnpm guard:source` before downstream
WP execution or any task derived from uploaded/source-hierarchy material. The
guard is a technical preflight for the active source hierarchy, target-codebase
contract, `main` exclusion, no-generation rule, no blind schema replacement and
route/scope preservation. A failing guard is a stop-and-report condition unless
the user explicitly approves a guard-spec update.

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

## Operational UI non-negotiable
Default product surfaces must never expose internal implementation logic as visible
UI. This includes route IDs, task IDs, UX phase IDs, work-package IDs, business
process IDs, acceptance IDs, `data-testid`/`data-ux-*` names, proof/reviewer
scaffolding, capture warnings, source-trace wording, contract names, debug
metadata or other internal state-machine labels.

Operational UI must not add process, gate, proof, contract, source, audit,
scope, meta or implementation explainer boards/tables/panels to make acceptance
visible. This is binding and non-negotiable: safety, process correctness and
proof obligations must be represented through real product state, blocked or
enabled controls, workflow-backed service behavior, persistence, audit/evidence
records and tests. They must not be explained to the user as UI scaffolding.

Operational task screens must also not render oversized hero, route-summary or
status-banner blocks that repeat the current route, stage or payload counters
instead of helping the user complete the work. On constrained operating
viewports, these banners are treated as internal/navigation scaffolding and must
be removed or collapsed into product-native controls.

Operational task screens must not use badge clusters, chip clouds or proof-strip
controls to lead the user through state. Product state belongs in concise
icon-plus-text affordances, tables, object fields, disabled-action reasons and
real workflow controls. Dense operations/scope strips that exist to prove
implementation state are internal scaffolding and are forbidden in default UI.

Operational task screens must also not render gate/scope/process explainer
panels such as "selected/scoped/gated", "command spine", "access request gate",
or similar internal choreography. If this information is needed for audit, it
belongs in process metadata, workflow state, service-backed read models or
reports; the visible UI must show the selected object, decision context, blocker
and next action.

Every screenshot used as UI proof must include an explicit visual audit for the
target viewport. For the current operational baseline that means 1400x900 with
no page scroll for the primary task, no horizontal overflow, no clipped/vertical
table text, no oversized summary banner, no badge cluster/proof strip, no
gate/scope/process explainer panel and no primary action hidden below the fold.
The screen must also not be artificially short or empty when the task needs a
real operating surface: it must show enough service-backed object, decision,
table, evidence or action content to justify the route. Meaningful empty space
should be filled when the underlying workflow can truthfully provide useful
work content; use real object context, decision context, evidence, history,
checks or next actions, never decorative filler or internal methodology text.
An unaudited screenshot is not acceptance evidence.

The UI may show only product-native task state, object state, blockers, recovery
actions and safety obligations that a user needs to complete the current job.
Process/runtime truth must be service-, database- and test-backed, but its
internal proof markers stay in code metadata, APIs, reports or explicit
reviewer/proof tooling, not in the operational surface. If a test or contract
requires visible internal scaffolding, treat that contract as stale and refactor
the contract instead of adding compatibility UI.

## Refactor-first anti-shortcut rule
When a requested UI/UX improvement can be implemented through a real component,
layout, route, state, navigation, density, accessibility, or shared-design-system
refactor inside the True-UX handoff boundaries, Codex must implement the real
refactor.

Do not choose workaround UI, overlay-only fixes, cosmetic copy changes,
test-only expectation changes, placeholder panels, fake success states, hidden
shortcuts, or documentation/report-only substitutions when the repository
contains a feasible implementation path.

Before using a smaller substitute, Codex must report why the real UI refactor is
blocked by the active source of truth, safety, route-evolution, screen-split,
schema, data, or test boundary; which real implementation path was inspected;
what proof shows the substitute is temporary or intentionally scoped; and the
follow-up file or task needed to complete the real refactor.

Passing tests is not acceptance if UI work was avoidably substituted by a
shortcut. Acceptance requires the implemented surface to match the intended
True-UX behavior, with route, flow, screenshot, or proof evidence where
applicable.

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
