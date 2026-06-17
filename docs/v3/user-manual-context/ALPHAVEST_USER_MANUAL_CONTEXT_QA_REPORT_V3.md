# AlphaVest User Manual Context QA Report V3

Generated: 2026-06-17T00:00:00Z

## Verdict

The context package adds the missing product-reasoning layer to the existing AlphaVest WealthOS manual pipeline. It covers all 14 manual tasks, all 19 field references, all 28 branch records, key evidence/audit/visibility/redaction/second-confirmation concepts, and 66 step-context records.

## V3 Mission Card

| Field | Decision |
| --- | --- |
| Mission | Create a context-enrichment package for the user manual before the next PDF generation pass. |
| Non-goal | Do not overwrite the existing manual or PDF. Do not change app behavior. |
| Source hierarchy | AGENTS and V3 docs, user-manual-source package, generated manual package, PDF QA package, selected implementation files. |
| Proof standard | Every context claim must be traceable to current source material or framed as dependency-based future readiness. |

## Evidence Pack

### Source files read

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/user-manual-source/README.md`
- `docs/v3/user-manual-source/MANUAL_INFORMATION_ARCHITECTURE_V3.md`
- `docs/v3/user-manual-source/ROLE_TASK_INVENTORY_V3.md`
- `docs/v3/user-manual-source/WORKFLOW_PAGEFLOW_CLICKFLOW_CROSSWALK_V3.md`
- `docs/v3/user-manual-source/FIELD_INPUT_REFERENCE_V3.md`
- `docs/v3/user-manual-source/DATA_STATE_EVIDENCE_AUDIT_REFERENCE_V3.md`
- `docs/v3/user-manual-source/BRANCHES_AND_TROUBLESHOOTING_V3.md`
- `docs/v3/user-manual-source/UI_REALITY_CHECK_V3.md`
- `docs/v3/user-manual-source/user-manual-source.v3.json`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_QA_REPORT_V3.md`
- `docs/v3/user-manual-pdf/ALPHAVEST_USER_MANUAL_PDF_QA_REPORT_V3.md`

### Implementation files inspected

- `lib/demo-session.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`

### Fact classes used

- AlphaVest is demo-data-first and should not use real client data.
- Demo session is not production authentication.
- Advisor approval alone is not client release.
- Compliance release controls client visibility for advice-like content.
- Evidence and audit are core product controls where completion is claimed.
- UI Reality Check limits claims for persistence, file extraction, export realism, and governed access transactions.

### Dependency-framed future statements

Future-readiness notes use cautious language such as "prepares", "supports", and "can support when production persistence is implemented". They do not claim future roadmap delivery as current behavior.

## Coverage Matrix

| Item | Count |
| --- | ---: |
| Tasks covered | 14 |
| Field references covered | 19 |
| Step-context records | 66 |
| Branch records covered | 28 |
| Reference terms covered | 10 |
| Future-readiness notes | 14 |
| Demo-boundary notes | 14 |

## V2 Method Artifacts

### Double Diamond

| Phase | Artifact |
| --- | --- |
| Discover | The current manual is structurally strong but lacks continuous context explaining why each workflow exists. |
| Define | The missing layer is not more screenshots or more route detail; it is operational reasoning tied to tasks, fields, gates, and blocked states. |
| Develop | Context modules were defined: context note, why this matters, what this unlocks, control rationale, demo boundary, reader takeaway. |
| Deliver | Five context artifacts were generated under `docs/v3/user-manual-context/`. |

### Psycho-Logic + Map/Model

| Dimension | Finding |
| --- | --- |
| Rational logic | Users need to know required data, allowed actions, expected results, and blocked states. |
| Psycho-logic | Users also need to trust why the app slows them down, blocks them, or withholds client visibility. |
| Current maps | Existing maps include route map, workflow map, data model, screenshots, field reference, and UI reality check. |
| Map trap | A route can be navigable while the workflow is not fully persisted or governed. The context layer prevents that map trap. |
| Legitimacy risk | If the manual says only what to click, gates feel arbitrary. If it explains what gates protect, constraints feel legitimate. |

### Reframing Matrix

| Frame | Better manual behavior |
| --- | --- |
| Click guide | Keep concise procedures but add rationale at confusing or risky points. |
| Operational reasoning guide | Explain why the role is acting and what downstream workflow depends on the action. |
| Workflow control manual | Show how release, evidence, audit, permission, redaction, and second confirmation protect the workflow. |
| Future production pattern | Explain what the demo prepares without claiming production-complete behavior. |

Best frame: operational reasoning guide. Wrong frame to avoid: screenshot-heavy route catalogue.

### TRIZ

Contradiction: Add rich context without bloating the PDF or overclaiming implementation.

Resolution moves:

- Put compact context notes before procedures, not long essays after every step.
- Use control rationales only around gates and blocked states.
- Put deeper method/proof material in QA appendices.
- Keep future value dependency-framed.

### SIT Closed World

Resources used: existing manual source JSON, current manual, PDF QA report, pageflow/userflow mapping, data model, field reference, evidence/audit reference, branches, UI reality check, and selected implementation files.

SIT moves:

- Subtraction: remove route-led explanation from user-facing context.
- Multiplication: add the same six context module types across all tasks.
- Division: split user-facing narrative from QA/method artifacts.
- Task unification: field rationales also explain downstream gates.
- Attribute dependency: context intensity depends on task criticality and implementation status.

### Morphological Analysis / CCA

| Dimension | Values considered |
| --- | --- |
| Placement | intro only, per task, per step, appendix only, layered callouts |
| Density | short, medium, exhaustive |
| Tone | training, product rationale, compliance rationale, sales narrative |
| Proof level | source-traced, assumption-based, future-claiming |

CCA rejects:

- Intro-only context: too far from the action.
- Exhaustive per-step prose: too dense for a PDF.
- Sales narrative: risks overclaiming and weakens trust.
- Future-claiming proof: not supported by current source package.

CCA keep: per-task context notes plus selective gate and field rationales, backed by JSON for future layout choices.

### SCAMPER

- Substitute route-first explanations with user-goal and workflow-control explanations.
- Combine task chapters with data-to-decision field rationales.
- Adapt QA traceability into user-facing demo-boundary notes.
- Modify result sections by adding "what this unlocks".
- Put context to another use by making the JSON feed the next PDF pipeline.
- Eliminate generic SaaS rationale.
- Rearrange deep proof into QA while keeping concise rationale in manual pages.

### Harvard / BATNA

| Element | Artifact |
| --- | --- |
| People/problem move | Users are not resisting controls; they need to understand why controls exist. |
| Interests map | Users want clarity and speed; compliance wants defensibility; product wants future readiness; engineering wants no overclaim. |
| Objective criteria | Task coverage, field coverage, route-instruction avoidance, demo-boundary accuracy, JSON parseability. |
| BATNA | Keep the existing PDF as-is; acceptable visually but weaker as a user education artifact. |
| BATNA improvement | Add this context package before regenerating the manual and PDF. |

### MESOs

| Option | Shape | Equal value logic |
| --- | --- | --- |
| A | Dense task chapters | Best for training, but risks PDF length. |
| B | Layered callouts | Best balance for the next PDF: concise procedures plus rationale modules. |
| C | Appendix-backed concise task pages | Best for a lightweight manual, but users may miss context at the point of action. |

Recommended: B, with appendix-backed source traceability.

### Measurement Plan

| Check | Hypothesis | Success signal |
| --- | --- | --- |
| Task comprehension review | Users can explain why each task exists after reading the context note. | Reviewer can answer why, what it protects, and what it unlocks for all 14 tasks. |
| Gate legitimacy review | Controls feel purposeful instead of arbitrary. | Reviewer can explain release, evidence, audit, redaction, second confirmation, and blocked states. |
| PDF density review | Context improves comprehension without bloating pages. | No task needs more than one context callout and one control/boundary callout on a page. |

### Ethics And Fairness

- No deception: all implementation caveats remain visible.
- No coercion: controls are explained as safety boundaries, not pressure tactics.
- No fabricated facts: context is source-derived or dependency-framed.
- Real exit options: blocked states explain next legitimate actions.
- Public-reveal test: wording can be shown to compliance, engineering, and client-facing teams without hiding limitations.

## V3 Adversarial QA

| Risk | Mitigation |
| --- | --- |
| Context becomes marketing fluff | Use task-specific operational language tied to evidence, audit, release, tenant, or role semantics. |
| Context overstates implementation | Add demo-boundary notes for every task and preserve UI Reality Check wording. |
| Demo behavior confused with production behavior | State that demo session is not production auth and visible UI is not always full persistence. |
| PDF becomes too long | Use integration brief density rules and keep deep detail in appendices. |

## Rejected Weak Branches

- Rejected: add one generic product-context chapter only. Reason: users need rationale near the workflow action.
- Rejected: expand every procedure step into paragraph prose. Reason: PDF readability and scannability would suffer.
- Rejected: claim future automation, production persistence, or compliance certification as current functionality. Reason: source proof does not support it.

## Proof Path

- Parsed `docs/v3/user-manual-source/user-manual-source.v3.json`.
- Generated 5 files under `docs/v3/user-manual-context/`.
- Generated JSON includes 14 task records, 19 field-context records, 28 branch-context records, and 66 step-context records.
- JSON validation passed: 14/14 tasks, 19/19 fields, 28/28 branch records, 66 step-context records, no missing future-readiness notes, and no missing demo-boundary notes.
- ASCII scan passed for `docs/v3/user-manual-context/`.
- Placeholder scan passed for unresolved editorial markers and fake-citation markers.
- Route-led instruction scan passed for imperative route-path instructions.
- `pnpm typecheck` passed.
- `pnpm lint` passed.

## Learning Log

The next manual-generation pass should not simply paste all context verbatim. It should use the JSON to select compact modules per page and keep the final PDF readable. The most important change is to add a "why this matters" layer around each task and a "control rationale" layer around gates, blocked states, release, redaction, evidence, audit, and role changes.

## Method Compliance Checklist

- [x] Mixed Engine route applied.
- [x] V3 proof wrapper represented.
- [x] V2 method artifacts visible.
- [x] Facts, assumptions, and future-readiness statements separated.
- [x] All tasks covered.
- [x] All field references covered.
- [x] All blocked-state records covered.
- [x] Demo boundaries preserved.
- [x] No product behavior changed.
