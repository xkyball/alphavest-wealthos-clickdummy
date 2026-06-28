# AlphaVest E00 Implementation-First Ticket Rules

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `E00-S1` |
| Parent epic | `E00 Implementation Mode Correction and Source Lock` |
| Source analysis | `docs/v3/proof/e00_implementation_mode_source_lock_analysis.md` |
| Spec status | `DECISION_APPLIED_CURRENT_REPO_TRUTH` |
| Implementation status | `NOT_APPLICABLE_GOVERNANCE_ONLY` |
| Decision gate | `E00-D1 Proof Mode vs Operational Mode visibility policy - COMPLETE` |
| Decision proof | `docs/v3/proof/e00_proof_mode_visibility_decision.md` |

This specification defines the implementation-first rules for the corrected BoC/CTES architecture. It does not authorize code changes by itself. It prevents downstream epics from closing as document-only work.

## Core Rule

A contract or specification may define the rules, but it does not count as delivery completion.

Every implementation-relevant AlphaVest UX epic must include:

1. Analysis or readiness proof.
2. A specification or acceptance boundary.
3. At least one concrete implementation ticket with target code areas and CTES.
4. QA that validates behavior, source contracts, runtime state or screenshot evidence as appropriate.

The only exception is an explicitly governance-only, reference-only, P1-deferred or blocked epic. That exception must be visible in the ticket status and must name the downstream implementation chain or unblock condition.

## What Counts As Contract / Spec Work

Contract/spec work includes:

- Implementation rules and acceptance criteria.
- Typed contract proposals.
- Route, page-template, mode, density, feedback, data-surface or capture rules.
- Cleanup policy for stale tests, compatibility paths or legacy UI vocabulary.
- Decision gates for visibility, client/internal separation, route evolution, safety or proof posture.

Contract/spec work can enable implementation. It cannot close an implementation-relevant epic.

## What Counts As Implementation Work

Implementation work must change at least one concrete implementation surface, such as:

- Shared UI component or primitive.
- Route-family component adoption.
- Shared TypeScript contract used by components, tests, capture scripts or runtime metadata.
- Shell, page-header, topbar, sidebar or worksurface behavior.
- Capture, proof, validation or QA automation script.
- Focused test that validates a real product, UI, source-contract or runtime behavior change.

Documentation alone is not implementation unless the ticket is explicitly governance-only and no product/code implementation is in scope.

## Required Implementation Ticket Fields

Each implementation ticket must state:

- Target code areas.
- CTES and whether any scope above 12 is split.
- Dependencies and unblock conditions.
- Allowed changes.
- Forbidden changes.
- Acceptance criteria.
- Required tests.
- Screenshot requirement if visible UI changes occur.
- Negative acceptance boundaries, especially no route expansion, no screen generation, no safety weakening, no client leakage and no advice overclaim.

## QA Rule

QA must validate the implemented thing, not only the paperwork.

Allowed QA forms:

- Source-level contract test for typed rules or metadata.
- Component/runtime test for visible or interactive behavior.
- Route-smoke, workflow, client-visibility, permission, safety or no-leakage test where the touched area requires it.
- Capture or screenshot proof when visible UI changes occur.
- Zero-delta proof only when repo evidence proves the capability is already present and no code change is justified.

Not acceptable:

- "Document exists" as the only QA for an implementation-relevant epic.
- Screenshot proof that overclaims backend, permission, release, export or client-safe behavior.
- Updating tests to preserve legacy UI scaffolding when the approved implementation retires it.

## Legacy Cleanup Rule

When a canonical shared contract replaces an old UI, test or proof path, the old path must be retired, migrated or exception-marked. It must not remain as an equal source of truth.

Preferred cleanup order:

1. Replace route-local or component-local vocabulary with a canonical shared contract.
2. Migrate representative consumers.
3. Delete or rewrite stale compatibility tests.
4. Exception-mark any remaining old path with an explicit follow-up, not silent acceptance.

Rejected cleanup posture:

- Keeping legacy proof panels, route labels, fake controls, local table/filter copies or compatibility wrappers merely to avoid touching stale tests.
- Hiding old behavior behind another overlay when a real refactor path exists.

## Proof Mode Decision Boundary

`E00-D1` must decide the default visibility policy before E03 and E07 proceed.

Decision options from the upload:

| Option | Meaning | Consequence |
| --- | --- | --- |
| Option A | Hide proof/debug content from default operational UI; expose only through explicit Proof Mode / Reviewer Mode | Strongest cleanup of operational UI and best alignment with the Clean UI rule |
| Option B | Keep some proof labels visible in internal demo mode, never in client-facing mode | Preserves internal demo traceability but risks keeping old scaffolding visible by default |

Bold cleanup recommendation for this repo: approve Option A as the default, with one narrow exception: operational safety blockers and recovery guidance stay visible when they affect task completion. Proof tags, route IDs, debug metadata, capture warnings and implementation traceability move to Proof/Reviewer Mode or capture reports.

Recommended approval token:

`APPROVE_E00_OPTION_A_PROOF_REVIEWER_MODE_DEFAULT`

Acceptable fallback token:

`APPROVE_E00_OPTION_B_INTERNAL_DEMO_PROOF_LABELS`

## Downstream Enforcement

E01-E09 must use this rule set as follows:

| Epic | Required Enforcement |
| --- | --- |
| `E01` | Shared UI primitive work cannot close on token inventory/spec only |
| `E02` | Page-template rules must be adopted by shared template/runtime surfaces |
| `E03` | Proof/debug separation must be implemented through a canonical mode contract, not default proof scaffolding |
| `E04` | State/modal/drawer lifecycle must be backed by shared primitives and tests |
| `E05` | Action and feedback semantics must be implemented in real controls/messages, not copy-only assertions |
| `E06` | Data-surface patterns must migrate or exception-mark local table/filter/list copies |
| `E07` | Client/internal separation must be fail-closed and tested, not CSS-only hiding |
| `E08` | Accessibility and density changes must reach shared primitives and runtime behavior |
| `E09` | Operational screenshot audit must validate 1400x900 viewport fit, overflow, clipping, forbidden scaffolding, badge clusters and screen substance before screenshots can be proof |

## Acceptance Criteria

| Criterion | Result |
| --- | --- |
| Contract tasks are not treated as delivery completion | PASS |
| Implementation tasks include target code areas and CTES | PASS for the corrected E01-E09 upload structure |
| QA tasks validate implemented behavior, source contracts, runtime state or screenshot evidence | PASS by rule; ticket-specific proof remains required during each epic |
| Governance-only status of E00 is explicit | PASS |
| Human visibility decision is identified before E03/E07 continuation | PASS, `APPROVE_E00_OPTION_A_PROOF_REVIEWER_MODE_DEFAULT` captured |

## Ticket Result

`E00-S1`, `E00-D1` and `E00-Q1` are complete. Option A is the current repo truth: proof/debug/reviewer metadata is hidden from default operational UI and exposed only through explicit Proof/Reviewer Mode or capture/report artefacts, with visible operational safety blockers preserved where they affect the user's next safe action.
