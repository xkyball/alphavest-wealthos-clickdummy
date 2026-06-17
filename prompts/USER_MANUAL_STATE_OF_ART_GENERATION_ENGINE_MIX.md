Max

# AlphaVest State-of-the-Art User Manual Generation Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Create a state-of-the-art English user manual for AlphaVest WealthOS from the repository's existing manual-source knowledge package.

This is a manual generation and editorial production task, not a product implementation task. The final manual must be user-facing, UI-led, screenshot-supported, task-based, role-aware, and honest about the current demo/prototype implementation boundaries.

The manual must help real users understand:

- what they can accomplish,
- where they start in the UI,
- what they see,
- what they select, enter, review, approve, release, block, export or audit,
- which data is required, optional, allowed or rejected,
- why each action matters,
- what happens next,
- what evidence, audit, visibility, permission or compliance state is affected,
- what result proves that the task is complete.

Do not structure the manual around route paths, files, code modules or implementation internals. Routes and file paths may appear only in source notes, screenshot metadata, QA appendices or internal traceability tables.

## Output Language

Write the user manual in English.

Use concise, professional product documentation language. The tone should be calm, precise, helpful and trustworthy. Avoid marketing copy, legal overclaiming, developer jargon and vague "platform" filler.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Primary Source Package

Read this package first:

- `docs/v3/user-manual-source/README.md`
- `docs/v3/user-manual-source/MANUAL_INFORMATION_ARCHITECTURE_V3.md`
- `docs/v3/user-manual-source/ROLE_TASK_INVENTORY_V3.md`
- `docs/v3/user-manual-source/WORKFLOW_PAGEFLOW_CLICKFLOW_CROSSWALK_V3.md`
- `docs/v3/user-manual-source/PROCEDURE_SOURCE_CARDS_V3.md`
- `docs/v3/user-manual-source/SCREENSHOT_SHOTLIST_V3.md`
- `docs/v3/user-manual-source/SCREENSHOT_REGISTER_V3.md`
- `docs/v3/user-manual-source/FIELD_INPUT_REFERENCE_V3.md`
- `docs/v3/user-manual-source/DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`
- `docs/v3/user-manual-source/BRANCHES_AND_TROUBLESHOOTING_V3.md`
- `docs/v3/user-manual-source/UI_REALITY_CHECK_V3.md`
- `docs/v3/user-manual-source/user-manual-source.v3.json`

Known source-package shape at prompt creation time:

- 14 manual tasks
- 14 workflow crosswalk records
- 14 procedure source cards
- 66 step records
- 91 screenshot register entries
- 19 field/input references
- 22 roles
- 28 branch/troubleshooting records
- 10 proof paths
- 3 limitation records

Use the JSON as the machine-readable backbone and the Markdown files as editorial source material. If the numbers differ when this prompt is executed, trust the current repository state and report the difference in the QA notes.

## Screenshot Sources

Use screenshot references in this order:

1. Successful live captures:
   - `artifacts/user-manual-source/20260616-232649Z/screenshots/`
   - `artifacts/user-manual-source/20260616-232649Z/capture-log.json`
2. Registered visual references:
   - `public/reference/page_ui_v3/clean_pages/`
3. Failed or blocked capture records:
   - Keep them in QA and traceability notes.
   - Do not present failed capture paths as successful manual screenshots.

Every screenshot used in the manual must have:

- a stable screenshot ID,
- a short caption that names the user-facing task or state,
- nearby step reference,
- role and tenant context when relevant,
- state context when relevant,
- alt text,
- source path in a traceability table or image registry.

Do not use screenshots as decoration. Use them to orient the reader, disambiguate a screen state, show the expected result, or explain a difficult UI decision point.

## Mandatory Repository Context

Follow `AGENTS.md`. Repository-specific instructions are authoritative.

Read these source-of-truth files before manual generation:

1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
6. `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
7. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
8. `docs/v3/DATA_MODEL_V3.md`
9. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`

Read these if present:

- `docs/v3/USERFLOW_DEFINITIONS_V3.md`
- `docs/v3/WORKFLOW_DEFINITIONS_V3.md`
- `docs/v3/PAGE_SPECS_V3.md`
- `docs/v3/SCREEN_TO_TASK_MATRIX_V3.md`
- `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`
- `docs/v3/journeys.screencast.v3.json`
- `docs/v3/WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md`
- `docs/v3/INPUT_MASK_REQUIREMENTS_V3.md`
- `docs/v3/DATA_MODEL_IMPLEMENTATION_RECONCILIATION_V3.md`
- `docs/v3/IMPLEMENTATION_GAP_BACKLOG_V3.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Inspect implementation reality where needed:

- `app/`
- `components/`
- `lib/route-registry.ts`
- `lib/demo-session.ts`
- `lib/permission-engine.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `app/api/demo-workflow/route.ts`
- `prisma/schema.prisma`
- `tests/`
- `package.json`

## Online Documentation Baseline

Use the following online documentation research as editorial constraints. Do not over-quote these sources. Use them as operating rules.

Sources checked:

- Microsoft Style Guide, Procedures and instructions: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/
- Microsoft Style Guide, Writing step-by-step instructions: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
- Microsoft Style Guide, Describing interactions with UI: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/describing-interactions-with-ui
- Microsoft Style Guide, Formatting text in instructions: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/formatting-text-in-instructions
- Google Developer Documentation Style Guide, UI elements and interaction: https://developers.google.com/style/ui-elements
- Google Developer Documentation Style Guide, Highlights: https://developers.google.com/style/highlights
- Nielsen Norman Group, Help and Documentation: https://www.nngroup.com/articles/help-and-documentation/
- Nielsen Norman Group, Task Analysis: https://www.nngroup.com/articles/task-analysis/
- Nielsen Norman Group, User Journeys vs. User Flows: https://www.nngroup.com/articles/user-journeys-vs-user-flows/
- Nielsen Norman Group, 10 Usability Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- ScreenSteps, 10 Examples of Great End-User Documentation: https://blog.screensteps.com/10-examples-of-great-end-user-documentation
- ScreenSteps, Use pictures: https://help.screensteps.com/a/55086-use-pictures
- ScreenSteps, Example of a Style Guide: https://help.screensteps.com/a/1075837-example-of-a-style-guide
- TechSmith, The Ultimate Guide to Writing User Manuals: https://www.techsmith.com/blog/user-documentation/

Derived editorial rules:

1. Organize around user goals and tasks, not around the product's technical structure.
2. Use proactive help for first-time orientation and reactive help for troubleshooting.
3. Make help searchable, concise, concrete and focused on what the user needs to do.
4. Write clear step-by-step procedures with one meaningful user action per step whenever possible.
5. Prefer input-neutral verbs such as "go to", "select", "choose", "enter", "clear", "open", "close", "review", "confirm" and "submit".
6. Refer to UI labels only when they help users locate or complete the action.
7. Avoid slang terms for UI elements.
8. Separate procedures from reference material.
9. Use screenshots to clarify state, location, version and sequence; do not use screenshots as a substitute for writing the step.
10. Include the expected end result for every task.
11. Include branches, blocked states and recovery guidance for complex workflows.
12. Include alt text, descriptive link text and clear captions for accessibility and maintainability.
13. Keep lists scannable. Split long procedures into sections when the cognitive load becomes too high.
14. Preserve task context: role, tenant, object, status, evidence, audit, release gate and visibility state.
15. Give each major article or section a stable anchor or ID.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof and QA wrapper:

- P0 Mission Card
- P1 Evidence Intake
- P2 Content Architecture
- P3 Manual Design Architecture
- P4 Requirements and Gate Architecture
- P5 Execution Plan
- P6 Draft Manual
- P7 Structural/Integration Pass
- P8 Verification
- P9 QA/Inspection
- P10 Revision/Hardening
- P11 Final Assembly
- P12 Final QA/Proof

Use ENGINE_v2 as the editorial design and production stack:

- Double Diamond
- Psycho-Logic + Map/Model
- Reframing Matrix
- TRIZ
- SIT Closed World
- Morphological Analysis / Zwicky Box + CCA
- SCAMPER
- Harvard / Principled Negotiation + BATNA
- MESOs
- Measurement Plan
- Ethics & Fairness

The finished user manual must not expose internal Engine method artifacts as user-facing content. Put method/proof artifacts in a separate editorial QA report.

## Product Non-Negotiables

Preserve these AlphaVest rules:

- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions where the app claims completion.
- Sensitive actions create audit events where the app claims completion.
- Demo-data-first only.
- Do not introduce real authentication semantics.
- Do not use real client data.
- Do not imply final financial, legal or tax advice.
- Do not weaken role, tenant, permission, evidence, audit, advice-boundary or compliance-release semantics.
- Do not describe static, route-state, demo-only or non-persistent behavior as production-complete.

## Manual Information Architecture

Create a final manual that is useful both as a guided onboarding artifact and as a task reference.

Recommended structure:

1. Cover / title
2. About AlphaVest WealthOS
3. What this manual covers
4. Current demo/prototype boundaries
5. Safety, advice-boundary and compliance-release principles
6. Roles and responsibilities
7. Core concepts and glossary
8. Getting started
9. Role-based task chapters
10. Workflow chapters
11. Data entry and field reference
12. Evidence, audit, visibility and release reference
13. Troubleshooting and blocked states
14. Screenshot and screen reference index
15. Appendix: implementation status and evidence notes
16. Appendix: source traceability

Do not let the structure become a route catalogue. Use route paths only in traceability appendices.

## Required Role-Based Task Chapters

Derive the exact labels from the source package, but cover these task families:

- Platform setup and policy controls
- Tenant setup and team assignment
- Invitation, identity and consent onboarding
- Client dashboard and profile maintenance
- Entity, relationship and wealth-map review
- Document upload, extraction review and verification pending states
- Signal review and consultant workbench analysis
- Advisor approval
- Compliance review, block, audit and release
- Decision room review and submission
- Evidence vault and export workflow
- Governance users, roles, access requests and audit history
- Communication centre and call-trigger workflow
- Operations queues, SLA, service blueprint, roadmap and state reference

For each task chapter, include:

- Purpose
- Who can do it
- Before you start
- Required data
- Optional data
- Screens used
- Step-by-step procedure
- What happens next
- Evidence/audit/visibility result
- Blocked states and recovery
- Related tasks
- Screenshot references
- Implementation status note when needed

## Required Workflow Depth

For each workflow, include:

- workflow name and user-facing goal,
- actor/role,
- entry condition,
- starting screen,
- main path,
- alternate paths,
- blocked paths,
- required fields or decisions,
- approvals or releases,
- evidence or audit side effects,
- completion signal,
- downstream workflow.

When the app currently only demonstrates a route or visual state, say "In the current demo, this screen demonstrates the state; persistence or full governance behavior is not yet proven by the source package." Adapt the wording to the exact source evidence.

## Procedure Style

Use this procedure pattern:

```markdown
### [Task title]

Use this task to [user outcome].

**Who can do this:** [roles]

**Before you start:** [preconditions]

**Required information:** [fields/data]

![Screenshot caption](relative-or-absolute-screenshot-path)

1. Go to [screen name].
2. Review [visible object/state].
3. Enter [field] using [allowed format/example].
4. Select [UI label] to [effect].
5. Confirm [review item].

**Result:** [visible result, state change, evidence/audit/release outcome]

**If you cannot continue:** [blocked state and recovery]
```

Keep procedures compact, but do not remove necessary context. A reader should not have to infer hidden data, roles, approvals or gates.

## Field and Data Reference Style

For each meaningful field, include:

- field label,
- screen/task,
- purpose,
- required/optional,
- allowed values or format,
- demo example,
- validation or rejection behavior,
- downstream effect,
- evidence/audit sensitivity if relevant.

Do not invent validation rules. If validation is not proven, state that it is not proven in the current source package.

## Screenshot and Media Rules

Use Markdown image references for screenshot placement.

If the output target is Markdown in the repository, use repository-relative paths where feasible. If an image path is outside the manual folder, preserve the correct relative path.

For every included image:

- include alt text,
- include a caption or preceding sentence that explains why the screenshot is there,
- keep the screenshot near the step it supports,
- do not include spec panels, route labels, filenames, annotation rails or dev notes as user-facing screenshots unless the screenshot is explicitly a reference appendix item,
- if the source screenshot is a design reference rather than live capture, label it as a reference image, not live proof.

## State, Evidence, Audit and Compliance Rules

The manual must explain these concepts in plain English:

- client visibility,
- advisor approval,
- compliance release,
- evidence record,
- audit event,
- blocked recommendation,
- export scope,
- redaction,
- demo tenant,
- role-based access,
- no unapproved advice.

Use the application language from the source package where possible. Do not replace regulated or safety-critical distinctions with softer wording.

## What Not To Do

Do not:

- write a route-by-route guide,
- expose code paths as user instructions,
- claim production behavior without source evidence,
- describe disabled buttons as working actions,
- turn visual references into proof of persistence,
- omit blocked states because they are inconvenient,
- collapse advisor approval and compliance release into one step,
- imply that the app provides final financial/legal/tax advice,
- use real client data examples,
- invent screenshots,
- invent field validation,
- invent API behavior,
- invent audit/evidence side effects,
- remove implementation warnings from the final artifact.

## Deliverables

Create or update:

1. `docs/v3/user-manual/README.md`
   - Overview of the manual package.
2. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
   - The finished English user manual in Markdown.
3. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_SCREENSHOT_INDEX_V3.md`
   - Screenshot ID, caption, path, role/state, related task, live/reference status.
4. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_TRACEABILITY_V3.md`
   - Manual section to source-package evidence mapping.
5. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_QA_REPORT_V3.md`
   - Research baseline, checks run, limitations, unresolved gaps, method compliance.
6. Optional if useful:
   - `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
   - Structured manual metadata for later publishing.

Do not delete or overwrite `docs/v3/user-manual-source/`.

## Verification Requirements

Before final response, run checks that are available and appropriate:

- Parse `docs/v3/user-manual-source/user-manual-source.v3.json`.
- Verify every screenshot path referenced in the finished manual exists.
- Verify every manual task from the source package appears in the finished manual or is explicitly listed as excluded with a reason.
- Verify no user-facing procedure step uses a route path as its main instruction.
- Verify no screenshot reference points to a failed capture as if it succeeded.
- Verify source-package limitations are reflected in the manual.
- Run `pnpm typecheck`, `pnpm lint` and relevant manual/screenshot validation scripts if available.
- If Playwright or route smoke checks are already configured and cheap to run, run them or explain why they were skipped.

Create a small validation summary in the QA report:

- source package counts,
- manual section count,
- screenshot count,
- missing screenshot paths,
- uncovered tasks,
- implementation caveats,
- checks run,
- unresolved risks.

## Acceptance Criteria

The result is acceptable only if:

- The manual is in English.
- The manual is task-led and UI-led, not path-led.
- Every major workflow and role/task from the source package is covered.
- The manual includes screenshots or screenshot references where they clarify the workflow.
- Field/input requirements are explained.
- Allowed, blocked and conditional actions are explained.
- Evidence, audit, permission, role, tenant and compliance-release semantics are preserved.
- Demo/prototype limitations are visible and honest.
- The manual can be maintained from the source package and screenshot index.
- The QA report proves which sources were used and which checks passed.

## Final Response Format

Return a concise implementation summary with:

- files created or updated,
- manual coverage counts,
- screenshots used and missing screenshot count,
- checks run,
- unresolved limitations,
- recommended next step.

End with a Method Compliance Checklist and honest limitations because this is an Engine run.
