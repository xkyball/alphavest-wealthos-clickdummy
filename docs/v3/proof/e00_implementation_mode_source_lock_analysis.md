# E00 Implementation Mode Correction And Source Lock Analysis

Date: 2026-06-27

## Ticket

`E00-A1` - Identify contract-only leakage in previous architecture.

## Source And Boundary

- Upload: `/tmp/codex-remote-attachments/019f0884-6dd5-7652-a2e1-ffb8b2b20574/E5F26AEB-4053-43F1-B60E-D555B7A91323/1-ALPHAVEST_OVERARCHING_UX_BOC_IMPLEMENTATION_TASK_ARCHITECTURE_CTES_v2.md`
- Extracted epic: `E00 - Implementation Mode Correction and Source Lock`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Target branch: `full-workflow`
- Baseline commit: `98bdb70 test: validate e07 data surface patterns`
- Source guard: `pnpm guard:source` - PASS, 0 violations

This ticket is governance/setup analysis only. It does not authorize product code, UI, route, schema, API, screenshot asset or screen-specific backlog changes.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short` | Clean before E00 edits |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `98bdb70 test: validate e07 data surface patterns` |
| `git diff --stat` | No pre-existing diff before E00 edits |
| `package.json` | Scripts verified, including `guard:source`, `typecheck`, `lint`, `db:validate`, `build`, `test:route-smoke`, `test:workflow-gate`, `visual:capture-routes` and `phase:check` |
| Route registry | `lib/route-registry.ts` exists and was inspected |
| Test inventory | `tests/` exists and includes True-UX, route, workflow, visibility, capture and UX contract coverage |

## Extracted E00 Chain

| Order | Ticket | Type | Readiness | Current Handling |
| --- | --- | --- | --- | --- |
| 1 | `E00-A1` | Analysis / Research / Spike | Ready | Executed in this report |
| 2 | `E00-S1` | Specification / Design / Acceptance Criteria | Depends on `E00-A1` | Enabled by this report |
| 3 | `E00-D1` | Decision / Approval | Needs human confirmation | Must stop for user decision after `E00-S1` |
| 4 | `E00-Q1` | QA / Validation / Review | Depends on `E00-S1` | Blocked until the decision posture is captured |

## Contract-Only Leakage Finding

The upload explicitly states the prior architecture leaned too heavily into contracts. The leakage was not that contracts existed; the leakage was treating contracts, specifications or proof metadata as if they were delivery completion.

Corrected boundary:

- Contract/spec tasks define rules, acceptance anchors and implementation constraints.
- They do not count as product delivery by themselves.
- Every implementation-relevant epic must contain concrete implementation tasks with code target areas and CTES.
- QA must validate product/UI behavior, source contracts or runtime evidence as appropriate, not only the existence of documents.
- Governance-only epics must be explicitly marked as governance-only, with downstream implementation targets outside the epic.

## Leakage Register

| Leakage Pattern | Risk | Corrected Handling |
| --- | --- | --- |
| Contract/specification counted as delivery | Produces documents without changing product behavior | Mark specs as prerequisites and require downstream implementation tickets |
| Proof/debug/reviewer metadata treated as operational UI | Keeps internal scaffolding visible as product experience | Move proof/debug metadata behind an explicit Proof/Reviewer Mode decision |
| QA validates documents only | Allows unimplemented UX claims to pass | Require behavior, source contract, runtime or screenshot proof depending on ticket type |
| Monolithic app-wide UX task | Exceeds safe CTES and hides regressions | Split into epics with analysis, spec, implementation and QA chains |
| Route/screen backlog generated from findings | Breaks True-UX route discipline and creates visual drift | Keep current route universe locked unless approved by route-evolution policy |
| Legacy component/test expectations preserved for compatibility | Masks old debt as acceptance criteria | Retire or rewrite stale expectations when a canonical shared contract replaces them |

## Downstream Structure Verification

The corrected upload contains implementation and QA chains for all implementation-relevant downstream epics:

| Epic | Implementation Tickets Present | QA Ticket Present | Analysis / Spec Role |
| --- | --- | --- | --- |
| `E01` Design-system foundation | `E01-I1`, `E01-I2`, `E01-I3` | `E01-Q1` | Shared primitive and token rules before implementation |
| `E02` Page template and long-page architecture | `E02-I1`, `E02-I2`, `E02-I3` | `E02-Q1` | Template architecture and adoption rules |
| `E03` Operational UI vs Proof / Reviewer Mode | `E03-I1`, `E03-I2`, `E03-I3` | `E03-Q1` | Depends on `E00-D1` visibility policy |
| `E04` State, modal, drawer and overlay lifecycle | `E04-I1`, `E04-I2`, `E04-I3` | `E04-Q1` | Lifecycle and capture-variant rules |
| `E05` Action hierarchy and no-overclaim feedback | `E05-I1`, `E05-I2`, `E05-I3` | `E05-Q1` | Action semantics before route-family adoption |
| `E06` Data surface and master-detail patterns | `E06-I1`, `E06-I2`, `E06-I3` | `E06-Q1` | Shared data-surface pattern rules |
| `E07` Client-safe visibility and internal/external separation | `E07-I1`, `E07-I2`, `E07-I3` | `E07-Q1` | Client/internal suppression and projection rules |
| `E08` Visual density, dark-theme accessibility and status semantics | `E08-I1`, `E08-I2`, `E08-I3` | `E08-Q1` | Accessibility and status semantics before adoption |
| `E09` Screenshot capture QA and regression automation | `E09-I1`, `E09-I2`, `E09-I3` | `E09-Q1` | Capture proof and regression automation rules |

`E00` itself correctly has no implementation tasks because it is governance/setup only. Its downstream target is to make the E01-E09 implementation chain executable without allowing another contract-only closure.

## Corrected Task Model Decision

AlphaVest E00 should lock this model:

1. Governance-only epics can close through decision, rule and QA proof, but must name the downstream implementation chain they enable.
2. Implementation-relevant epics cannot close on analysis or specification alone.
3. Specs are allowed to block implementation until human approval when the decision affects proof visibility, client/internal separation, route evolution, safety or cleanup of legacy paths.
4. Implementation tickets must identify target code areas, CTES, forbidden changes and validation.
5. QA tickets must prove actual behavior, source-level contract adoption, runtime state or screenshot evidence depending on the change.

## E00-A1 Acceptance Review

| Requirement | Result |
| --- | --- |
| Review epic/task structure | PASS |
| Mark contract-only tasks | PASS |
| Identify where implementation work must be added | PASS |
| Every contract-only gap has downstream implementation target or is explicitly out of scope | PASS |

## Ticket Result

`E00-A1` is complete. `E00-S1` is enabled. `E00-D1` remains the first human decision gate after the E00 rule specification.
