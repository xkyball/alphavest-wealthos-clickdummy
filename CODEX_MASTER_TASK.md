# CODEX_MASTER_TASK — AlphaVest WealthOS V3

Read `AGENTS.md` first.

You are working in a linked repository. This handoff pack has been copied into the repo root.

## Mission
Implement AlphaVest WealthOS as a demo-data-first web application with the mandatory stack:

```text
Next.js / React / TypeScript
Tailwind CSS
PostgreSQL
Prisma ORM
Docker Compose
Playwright
Vitest or equivalent
```

## Phase execution
Use `PHASE_TO_RUN` from the start prompt. Do only that phase unless explicitly told to continue.

## Operationalization guardrail

Before any phase or ticket claims productive behavior, workflow execution, data maintenance, upload, export, evidence creation, audit behavior, governance change, communication send, compliance release or client visibility, read:

```text
docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md
docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md
docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md
docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md
```

Every such task must declare current and target capability level using E0-E7. Static UI, read-only fields, metadata-only file/export behavior, fixture mutations and `actionId`-only demo journeys must not be reported as operational capability. They may be shipped only with honest labels such as visual-only, static interaction, fixture-backed, metadata-only or gated demo simulation.

## Visual implementation preflight override

For any phase or ticket that turns an ImageGen output, screen reference or visual mock into HTML/CSS/React/Tailwind UI, first read the Human Visual Implementation Standard before `AGENTS.md`:

1. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/README.md`
2. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/visual-implementation-rules.md`
3. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/design-feedback-patterns.md`
4. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/human-visual-review-rubric.md`
5. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/codex-start-prompt-human-visual-implementation.md`

Before UI edits, create an `implementation-map`. DOM success is not design acceptance; visual completion also requires screenshot proof and a Human Visual Review Rubric result.

Before each phase:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`.
4. Read `docs/v3/CODEX_TASKS_DETAILED_V3.md`.
5. Read `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`.
6. Read `docs/v3/SCREEN_CATALOGUE_V3.md`.
7. If the phase implements screens, inspect every referenced image.
8. Create or update a short phase plan, including current/target E-level when the task touches operational behavior.
9. Implement the phase.
10. Run available checks.
11. Update phase report.

## Design interpretation
The visual references are mandatory but not pixel-perfect. They show the desired AlphaVest style, page composition, states and UI components. Normalize all screens into one consistent design system.

## Security implementation approach
Do not implement real auth first. Use demo session, role switcher and tenant switcher. Permission functions must exist early but may be permissive until the later security phase.

## Product hard rule
No unapproved advice reaches the client.

## Output after a phase
Update:

```text
docs/v3/PHASE_EXECUTION_REPORT.md
docs/v3/IMPLEMENTATION_QA_REPORT.md
```

Include changed files, commands run, tests run, known gaps and next steps.
