# AlphaVest Workflow Completion Implementation Plan V3

Generated: 2026-06-17  
Scope: planning and ticket contract only. No product UI or workflow code was implemented in this pass.

## 1. Mission

Complete the missing AlphaVest business workflows in phase-scoped implementation slices while preserving the existing product rules:

- digital first,
- human reviewed,
- evidence backed,
- no unapproved advice reaches the client,
- advisor approval alone is not enough,
- compliance release controls client visibility,
- evidence is created by default for important actions,
- sensitive actions create audit events.

This plan extends `IMPLEMENTATION_GAP_BACKLOG_V3.md` with a phase model and a visual implementation contract for all future ImageGen-to-UI work.

## 2. Human Visual Implementation Standard For ImageGen-To-UI Work

Whenever a ticket turns a screen reference, ImageGen output or visual mock into HTML/CSS/React/Tailwind UI, the implementation is governed by the Human Visual Implementation Standard in:

`/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/`

Required read order for UI implementation tickets:

1. `README.md`
2. `visual-implementation-rules.md`
3. `design-feedback-patterns.md`
4. `human-visual-review-rubric.md`
5. `codex-start-prompt-human-visual-implementation.md`
6. `AGENTS.md`
7. The AlphaVest source-of-truth files listed in `AGENTS.md`

Non-negotiable gate: DOM success is not design acceptance.

Before UI edits, the implementing agent must create an `implementation-map`.

```text
route -> component(s) -> state(s) -> role/tenant/context -> existing AlphaVest reference screenshot -> ImageGen visual -> source data/seed -> interaction shape -> expected assertion/proof -> verification status
```

Repo-local Phase A templates:

- `docs/v3/IMPLEMENTATION_MAP_TEMPLATE_V3.md`
- `docs/v3/IMAGEGEN_ARTIFACT_STRUCTURE_V3.md` - ImageGen-Artefaktstruktur
- `docs/v3/HUMAN_VISUAL_REVIEW_RUBRIC_RESULT_TEMPLATE_V3.md` - Human Visual Review Rubric Ergebnis
- `docs/v3/SCREENSHOT_PROOF_STATUS_TEMPLATE_V3.md`
- `docs/v3/COMPLETION_STATUS_LABELS_V3.md`

For ImageGen tickets, a real screenshot from the running AlphaVest app must be captured first and passed as the visual reference into ImageGen. The ImageGen result is a design reference only; it is not screenshot proof and it is not acceptance proof.

After UI implementation, the ticket is complete only when it records:

- state coverage for default, loading, empty, error, disabled, hover and focus,
- modal, drawer, overlay, validation and success states where relevant,
- screenshot proof,
- Human Visual Review Rubric result,
- explicit gaps using one of: `implemented`, `partially implemented`, `visually reviewed`, `screenshot-proven`, `not verified`, `not scanned`, `blocked`.

## 3. Phase Model

| Phase | Priority | Goal | Primary tickets | UI/ImageGen impact | Exit gate |
| --- | --- | --- | --- | --- | --- |
| A | P0 | Planning, visual contract and QA baseline | A-01 to A-10 | Defines standard and artifacts | Ticket plan, implementation-map template, ImageGen artifact contract, rubric result template, screenshot-proof status template, Completion Status Labels and QA gates exist |
| B | P0 | KYC / AML / Source-of-Wealth foundation | B-01 to B-12 | Two new workflow screens | J12 is route-, state-, screenshot- and rubric-ready |
| C | P0 | Suitability and IPS foundation | C-01 to C-12 | Two new workflow screens | J13/J14 block unapproved advice paths |
| D | P0 | Review calendar and monitoring | D-01 to D-10 | Two new workflow screens | J16/J17 prove due reviews and triggers |
| E | P1 | Committee / peer review | E-01 to E-08 | Queue and detail screens | High-risk second review is visible and gated |
| F | P1 | Complaints, incidents and privacy requests | F-01 to F-08 | Complaint and privacy screens | Risk/privacy cases have state, proof and audit plan |
| G | P2 | Billing, scope changes and offboarding | G-01 to G-08 | Billing/scope and offboarding screens | Engagement lifecycle closes cleanly |
| H | P2 | Journey, screencast and final QA hardening | H-01 to H-08 | No new UI by default | J11-J22 proof pack is complete |

## 4. Ticket Register With Human Visual Gates

| ID | Phase | Ticket | Required visual-standard change | Acceptance criteria |
| --- | --- | --- | --- | --- |
| A-05 | A | Capture and ImageGen protocol | Add required Human Visual Standard read order before AGENTS for visual work | Protocol states real app screenshot before ImageGen and ImageGen output is reference only; `IMAGEGEN_ARTIFACT_STRUCTURE_V3.md` records the required files |
| A-05a | A | Human Visual Standard preflight | New ticket | Standard path and read order are written into the plan and confirmed in `CODEX_MASTER_TASK.md` |
| A-05b | A | `implementation-map` template | New ticket | `IMPLEMENTATION_MAP_TEMPLATE_V3.md` contains route, components, states, role/tenant, reference, ImageGen, data, interaction and proof |
| A-05c | A | Visual artifact folder contract | New ticket | `IMAGEGEN_ARTIFACT_STRUCTURE_V3.md` requires `reference-app.png`, `prompt.md`, `generated-mockup.png`, `implementation-map.md`, `human-visual-review.md`, `screenshot-proof-status.md` and `README.md` |
| A-06 | A | Reusable ImageGen prompt template | Require app screenshot reference and no product-UI proof claim | Prompt prevents spec-board/debug artifacts and records reference route |
| A-07 | A | Design review checklist | Add Human Visual Review Rubric | Checklist separates technical pass, Screenshot-Proof Status and human visual status |
| A-07a | A | Human Visual Review Rubric gate | New ticket | Every visual implementation must end with a result using `HUMAN_VISUAL_REVIEW_RUBRIC_RESULT_TEMPLATE_V3.md` |
| A-08 | A | Baseline QA commands | Add visual proof status to QA baseline | `pnpm build`, route smoke and Playwright success are not design acceptance; screenshot status uses `SCREENSHOT_PROOF_STATUS_TEMPLATE_V3.md` |
| A-08a | A | Reporting fields for visual proof | New ticket | Reports include implementation-maps, screenshot proof, rubric status and blocked/unverified states using `COMPLETION_STATUS_LABELS_V3.md` |
| B-04 | B | KYC reference screenshot capture | Require real app screenshot before ImageGen | `/documents/extraction-review` and `/workbench/triggers/:id` references captured and linked |
| B-05 | B | KYC ImageGen mockups | Add implementation-map prerequisite | Mockups trace to app screenshot, role/tenant context and states |
| B-06 | B | KYC Review UI | Add full visual implementation gate | UI cannot be accepted without screenshot proof and rubric status |
| B-07 | B | Source-of-Wealth Review UI | Add full visual implementation gate | UI preserves AlphaVest shell, state coverage and no invented persistence |
| C-04 | C | Suitability/IPS reference screenshot capture | Require real app screenshot before ImageGen | `/client/profile`, `/documents` and `/evidence/:id` references captured |
| C-05 | C | Suitability/IPS ImageGen mockups | Add implementation-map prerequisite | Mockups include target states and no spec metadata |
| C-06 | C | Suitability UI | Add full visual implementation gate | Acceptance requires screenshot proof, rubric and state gaps |
| C-07 | C | IPS UI | Add full visual implementation gate | Acceptance requires reference fidelity and no advice-release overclaim |
| D-04 | D | Review/monitoring reference screenshots | Require real app screenshot before ImageGen | `/ops/sla` and `/signals` references captured |
| D-05 | D | Review/monitoring ImageGen mockups | Add implementation-map prerequisite | Mockups map review and trigger states |
| D-06 | D | Review Calendar UI | Add full visual implementation gate | Default, empty, overdue, loading/error and focus states documented |
| D-07 | D | Rebalance Monitoring UI | Add full visual implementation gate | Trigger states and blocked/review actions are not overclaimed |
| E-02 | E | Committee reference screenshots | Require real app screenshot before ImageGen | `/advisor-approval` and `/advisor-approval/:id` references captured |
| E-03 | E | Committee Review Queue UI | Add full visual implementation gate | Queue cannot be accepted from route render alone |
| E-04 | E | Committee Review Detail UI | Add full visual implementation gate | Votes, dissent and evidence states have proof labels |
| F-02 | F | Complaint/privacy reference screenshots | Require real app screenshot before ImageGen | `/ops/queues` and `/export/:id/redaction` references captured |
| F-03 | F | Complaints UI | Add full visual implementation gate | SLA, owner and severity states covered or marked blocked |
| F-04 | F | Privacy Requests UI | Add full visual implementation gate | DSAR/redaction status has screenshot proof and no invented export behavior |
| G-04 | G | Offboarding reference screenshot | Require real app screenshot before ImageGen | `/tenants/:id/setup` reference captured |
| G-05 | G | Offboarding UI | Add full visual implementation gate | Checklist, archive and retention states are visually reviewed |
| H-04 | H | Visual contract expansion | Add Human Visual Standard proof fields | New routes track route proof, state proof, screenshot proof and rubric separately |
| H-05 | H | Phase execution report finalization | Add implementation-map inventory | Report lists implementation-maps created per UI ticket |
| H-06 | H | QA report finalization | Add visual review status | Report separates screenshot proof, rubric status and technical test status |
| H-07 | H | Final verification | Add no-overclaim check | Completion labels distinguish implemented, visually reviewed, screenshot-proven, not verified and blocked |

## 5. Screen / ImageGen Matrix

| Target screen | Reference route screenshot | ImageGen required | Implementation-map required | Human Visual Review Rubric required |
| --- | --- | --- | --- | --- |
| `/kyc/:id/review` | `/documents/extraction-review` | yes | yes | yes |
| `/kyc/:id/source-of-wealth` | `/workbench/triggers/:id` | yes | yes | yes |
| `/suitability/:tenantId/profile` | `/client/profile` | yes | yes | yes |
| `/ips/:tenantId` | `/documents` and `/evidence/:id` | yes | yes | yes |
| `/reviews/calendar` | `/ops/sla` | yes | yes | yes |
| `/monitoring/rebalance` | `/signals` | yes | yes | yes |
| `/committee/reviews` | `/advisor-approval` | yes | yes | yes |
| `/committee/reviews/:id` | `/advisor-approval/:id` | yes | yes | yes |
| `/complaints` | `/ops/queues` | yes | yes | yes |
| `/privacy/requests` | `/export/:id/redaction` | yes | yes | yes |
| `/offboarding/:tenantId` | `/tenants/:id/setup` | yes | yes | yes |

## 6. QA And Reporting Requirements

`PHASE_EXECUTION_REPORT.md` must list:

- changed files,
- UI tickets touched,
- implementation-maps created,
- ImageGen artifact folders,
- ImageGen reference screenshots captured,
- screenshot proof artifacts,
- Human Visual Review Rubric result artifacts,
- tests and checks run,
- blocked, not scanned or not verified states.

`IMPLEMENTATION_QA_REPORT.md` must separate:

- build/lint/typecheck status,
- route smoke or Playwright status,
- screenshot proof status,
- Human Visual Review Rubric status,
- Completion Status Labels inventory,
- accessibility/semantic review status,
- evidence/audit/persistence proof status.

Route render success, DOM locators, Playwright clicks and build success can support a claim, but they cannot replace human visual acceptance.

## 7. First Implementation Batch

Start with A-05a, A-05b, A-05c, A-07a and A-08a before any new ImageGen-to-UI work. Then proceed to B-04 and B-05 only after the artifact folder contract exists.

## 8. Honest Limitations

This plan does not implement UI, capture screenshots, generate ImageGen mockups, run browser checks or validate any new visual. It only updates the implementation contract and ticket acceptance criteria for future work.
