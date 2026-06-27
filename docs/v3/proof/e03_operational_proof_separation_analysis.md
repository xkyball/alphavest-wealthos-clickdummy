# E03 Operational UI Vs Proof / Debug / Reviewer Separation Analysis

Date: 2026-06-27

## Source And Boundary

- Requested source: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Extracted epic: `Epic E03: Operational UI vs Proof / Debug / Reviewer Separation`
- Active ticket: `ANALYSIS-E03-1`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Target branch: `full-workflow`
- Baseline commit: `ba9cfbb test: validate e02 page template system`
- Source guard: PASS via `./node_modules/.bin/tsx scripts/source-target-guard.ts`

The downloaded architecture is treated as the E03 task source, but implementation remains bounded by the repo-local True-UX handoff. This ticket is analysis-only. No route, UI, schema, API, screenshot asset or runtime behavior change is authorized here.

## Extracted E03 Chain

| Order | Ticket | Type | Status From Upload | Current Handling |
| --- | --- | --- | --- | --- |
| 1 | `ANALYSIS-E03-1` | Analysis / Research / Spike | Can start when input plan and artefacts are available | Executed in this report |
| 2 | `SPEC-E03-1` | Specification / Design / Acceptance Criteria | Depends on `ANALYSIS-E03-1` | May start after this analysis |
| 3 | `IMPL-E03-1` | Implementation | Blocked until `SPEC-E03-1` is complete and approved | Blocked |
| 4 | `IMPL-E03-2` | Implementation | Depends on `IMPL-E03-1`; blocked until spec approval | Blocked |
| 5 | `IMPL-E03-3` | Implementation | Blocked until `SPEC-E03-1` is complete and approved | Blocked |
| 6 | `QA-E03-1` | QA / Validation / Review | Depends on spec and implementation tasks | Blocked |

Human approval is required after `SPEC-E03-1` before implementation starts.

## E03 Epic Extraction

E03 exists to relieve default operational workflows from proof, debug, reviewer, route-context and safety scaffolding without losing auditability.

In scope:

- Proof mode access pattern
- Proof panel placement
- Route IDs and UX proof tags
- Internal safety boundary display
- Audit/history secondary-surface rules
- Client-safe suppression rules

Out of scope:

- Backend audit persistence
- RBAC implementation
- Screen-specific copy editing
- Route-scope decisions
- Screen/image/state-screen generation

## Moving Baseline Preflight

- `git status --short`: clean before edits
- `git branch --show-current`: `full-workflow`
- `git log -1 --oneline`: `ba9cfbb test: validate e02 page template system`
- `git diff --stat`: no pre-existing diff before edits
- `package.json`: scripts verified, including `guard:source`, `typecheck`, `lint`, `build`, `test:route-smoke`, `test:client-visibility`, `visual:capture-routes`, and `phase:check`
- Route registry inspected: `lib/route-registry.ts`
- Test inventory inspected: `tests/`
- Related proof/reviewer/client-suppression seams inspected: `lib/ux-operating-model.ts`, `lib/ux-page-template-system.ts`, `lib/capture-screen-model-context.ts`, `components/product-guidance-panel.tsx`, `components/route-context-chip.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/app-shell.tsx`, `lib/product-guidance.ts`, `tests/client-visibility-proof.spec.ts`, `tests/product-guidance-shell.spec.ts`, `tests/capture-screen-model-context.spec.ts`, and `tests/ux-operating-model.spec.ts`

## Current Pattern Reality

The app already contains several strong pieces of the intended separation:

- E01 created `lib/ux-operating-model.ts`, including `PROOF_REVIEWER`, proof posture, audience posture and no-overclaim rules.
- E02 created `lib/ux-page-template-system.ts`, including proof/audit placement rules for template families.
- `lib/capture-screen-model-context.ts` projects operating mode, proof posture, no-overclaim rules, capability status, model families and warnings into capture/reviewer metadata.
- `scripts/capture-routes-and-modals.ts` already emits reviewer-facing Markdown rows with operating mode, audience, proof posture, productive status, capability status, no-overclaim rule and warnings.
- `components/product-guidance-panel.tsx` currently renders `ProductGuidancePanel` as `null`, which means the older default proof/guidance shell is no longer a visible operational panel.
- `components/page-header.tsx` keeps route-context details in an `sr-only` block while visible header content stays task-oriented.
- `components/top-bar.tsx` still exposes operational context chips such as workspace, object scope, visibility mode and actor context.
- `tests/client-visibility-proof.spec.ts` and related visibility tests already prove internal draft/rationale/compliance notes are suppressed from client projections.

The gap is authority. Proof/debug/reviewer visibility is split across operating model, capture context, route-context chips, topbar labels, product-guidance leftovers and tests. E03 should not revive the old operational guidance panel. It should introduce one canonical proof/reviewer visibility contract and make default operational, reviewer and client modes project from it.

## Systemic Findings

1. Proof posture exists, but proof surface ownership does not. `UxProofPosture` says what claim a surface may make, but it does not say whether route IDs, proof tags, capture warnings or internal safety scaffolding belong in default operational UI, a secondary reviewer surface, capture-only metadata or client-safe suppression.

2. The old `ProductGuidancePanel` is already effectively retired from default UI. Several older tests still expect it, but the component renders `null`. E03 should not restore it as compatibility debt; it should make the replacement contract explicit.

3. Route-context chips are useful operational context but can drift into reviewer/debug scaffolding if they carry route IDs, proof tags or internal audit metadata by default. The current topbar uses human-readable context, which is mostly acceptable, but E03 needs a rule that separates operational context from proof metadata.

4. Capture and screenshot proof already have the best reviewer metadata structure. `capture-screen-model-context` is the right source for proof-mode claims, warnings and no-overclaim posture. The missing app-side pattern is a reusable secondary surface or mode that can display comparable traceability without cluttering task execution.

5. Client-safe suppression is already backed by visibility tests. E03 should reuse that posture and add UI-level suppression hooks rather than inventing new RBAC or visibility logic.

6. Safety boundary display is mixed. Some components show safety notes and audit context directly because they are operational blockers; other details are proof/reviewer-only. The spec must distinguish "needed to complete the task safely" from "needed to review the implementation or proof claim."

7. The strongest cleanup path is deletion/consolidation, not compatibility. E03 should centralize reviewer proof metadata and retire stale broad-smoke expectations around product-guidance/proof panels. Restoring visible proof scaffolding to satisfy old tests would reintroduce the debt E03 is meant to remove.

## Reusable Pattern Families Affected

| Pattern Family | Current Evidence | E03 Need |
| --- | --- | --- |
| Default operational UI | App shell, page header, topbar, worksurface shells | Hide proof/debug metadata unless required for task safety |
| Reviewer secondary surface | Capture metadata, proof reports, route/capability warnings | Canonical secondary-surface contract for route ID, proof tags, warnings and traceability |
| Capture/proof output | `capture-screen-model-context`, capture Markdown index | Keep as proof-mode output; do not treat screenshots as product completion |
| Route context | `RouteContextChip`, topbar workspace/object/visibility chips | Allow operational context but suppress internal proof tags and debug IDs by default |
| Safety boundary | State panels, no-overclaim copy, page-header blocked reasons | Keep blockers and safety obligations visible when they affect task completion |
| Client mode | visibility engine tests, client-safe operating posture, E02 client summary | Suppress internal proof/debug/reviewer content by construction |
| Legacy product guidance | `ProductGuidancePanel` returns `null`; old tests still expect it | Retire stale expectations instead of rebuilding a default proof panel |

## Screen-Specific Items To Exclude

E03 should not become a copy-editing or route-by-route cleanup list. These are explicitly excluded:

- Rewriting individual screen copy without tying it to an app-wide proof/reviewer rule.
- Restoring `ProductGuidancePanel` as visible default UI just to satisfy stale tests.
- Moving safety-critical operational blockers into hidden proof mode.
- Creating new routes, new screen states or generated screenshots.
- Implementing backend audit persistence, permission engines, RBAC, API behavior or schema changes.
- Changing client visibility policy; E03 may only add UI-level suppression rules and tests that project existing policy.

## Specification Needs

`SPEC-E03-1` should lock these decisions before implementation:

1. Canonical source: define a typed proof/reviewer visibility contract that projects from E01 operating model and E02 template proof/audit placement.

2. Visibility modes: define default operational mode, reviewer/proof secondary mode, capture-only proof mode and client mode.

3. Content classification: classify route IDs, UX proof tags, capture warnings, debug metadata, audit/history summaries, safety blockers and client-safe structural labels.

4. Default UI rule: only task-relevant operational context, blockers and safety obligations may appear in default workflows.

5. Reviewer secondary surface rule: proof tags, route IDs, capture warnings, internal implementation metadata and traceability belong in a secondary panel/drawer/mode or capture output.

6. Client suppression rule: client mode must suppress internal drafts, proof/debug/reviewer scaffolding, route proof tags, capture warnings, compliance notes and internal rationale.

7. Test plan: require source-level contract tests, component adoption tests and representative runtime tests for operational default, reviewer surface and client suppression.

8. Human approval scope: clarify whether implementation may add a new canonical contract file and retire stale product-guidance expectations. Recommendation: approve the new contract and retire the stale default panel path.

## Recommended Task Cut

| Proposed Ticket | CTES | Scope | Validation |
| --- | ---: | --- | --- |
| `SPEC-E03-1` | 6 | Write proof/reviewer visibility spec and approval gate. | Source review only |
| `IMPL-E03-1` | 12 | Add canonical proof/reviewer visibility contract and reusable secondary-surface pattern. | Typecheck plus focused contract/component tests |
| `IMPL-E03-2` | 12 | Move proof/debug metadata out of default operational surfaces by projecting through the contract. | Source tests plus representative runtime checks |
| `IMPL-E03-3` | 12 | Add client-mode suppression hooks for proof/reviewer/internal metadata. | Client-visibility and no-leakage tests |
| `QA-E03-1` | 6 | Validate operational, reviewer and client modes against the spec. | Focused tests and runtime review; screenshot only if visible UI changes |

## Bold Cleanup Recommendation

Take the hard cleanup path:

- Add a canonical typed `proof/reviewer visibility` contract instead of expanding product guidance, route context or template metadata ad hoc.
- Keep operational UI focused on task completion, blockers and safety obligations.
- Move route IDs, proof tags, capability warnings and implementation metadata into a reviewer secondary surface or capture output.
- Treat client mode as a hard suppression boundary for proof/debug/reviewer scaffolding.
- Delete or rewrite stale tests that require `product-guidance` in default UI. Do not resurrect the old panel.
- Make future proof/capture work cite the visibility contract field it satisfies.

## Risks

- A docs-only rule would leave route context, capture metadata and client suppression drifting independently.
- Hiding true operational blockers would make normal tasks less safe; E03 must keep safety blockers visible when they affect task completion.
- A compatibility restoration of `ProductGuidancePanel` would reintroduce proof scaffolding into default workflows.
- Client suppression can become unsafe if implemented as CSS-only hiding rather than a typed visibility decision.
- Reviewer/proof mode can overclaim if it treats screenshot/capture metadata as product completion.

## Open Decisions For SPEC-E03-1

1. May implementation introduce a new canonical typed contract, such as `lib/ux-proof-reviewer-mode.ts`, or must it extend `lib/ux-operating-model.ts` / `lib/ux-page-template-system.ts` only?
2. Should old `ProductGuidancePanel` expectations be retired in favor of E01/E02/E03 contract tests?
3. Should reviewer/proof content render as a panel, drawer, collapsible secondary surface or capture-only metadata in the first implementation?
4. Which content remains visible in default operational UI because it is a safety blocker rather than reviewer/debug metadata?
5. Should client-mode suppression be asserted at the component layer, visibility-engine layer, or both?
6. Which owner approves the post-spec implementation gate?

## Acceptance-Criteria Inputs For SPEC-E03-1

- Every proof/debug/reviewer content class resolves to a visibility decision.
- Default operational mode does not require proof/debug scaffolding to complete normal tasks.
- Safety blockers and recovery guidance remain visible when operationally necessary.
- Reviewer/proof metadata has a canonical secondary surface or capture-only target.
- Client mode suppresses route proof tags, debug metadata, capture warnings, internal rationale, compliance notes and reviewer-only content.
- Capture metadata remains conservative and cannot claim complete product capability from screenshots alone.
- Tests prove the contract and representative runtime behavior.
- No route reclassification, new route, screen generation, backend audit persistence, RBAC change, API change or schema change is introduced by E03 implementation.

## Ticket Result

`ANALYSIS-E03-1` is complete. It enables `SPEC-E03-1` and keeps `IMPL-E03-1`, `IMPL-E03-2`, `IMPL-E03-3` and `QA-E03-1` blocked until specification and human approval.
