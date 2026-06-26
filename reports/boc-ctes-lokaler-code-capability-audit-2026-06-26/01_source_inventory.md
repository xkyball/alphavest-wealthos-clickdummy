# Source Inventory And Exclusion Rules

Ticket: `ANALYSIS-1.1.1`  
Status: `DONE`  
Scope: local evidence boundary for the capability reality audit.

## Preflight Evidence

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Latest commit | `2f746c6 chore(docs): align J01 markdown boundary terminology` |
| Working tree | four pre-existing unstaged JSON/doc-source deltas before this ticket: `docs/v3/gap-analysis.v3.json`, `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`, `docs/v3/user-manual-pdf/source/collaborative-workflow-manual-pdf-data.json`, `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json` |
| Diff stat before this audit edit | 4 files changed, 4 insertions(+), 4 deletions(-), unrelated to the current ANALYSIS-1 report refresh |
| Package manager | `pnpm@9.15.9` from `package.json` |
| Source guard | `pnpm guard:source` PASS, `violations: 0` |
| Operative AlphaVest authority | `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` |

## Source Classification Table

| Source class | Examples in this repo | Evidence value | Allowed use in this audit | Forbidden use |
| --- | --- | --- | --- | --- |
| Code Fact | `app/**`, `components/**`, `lib/**`, `prisma/schema.prisma`, `scripts/**` | Highest static local evidence | Establish implemented routes, components, APIs, services, guards, schema models, command scripts and local wiring candidates. | Claim runtime success without execution proof. |
| Test Fact | `tests/**`, Playwright specs, spec fixtures/helpers | High proof-intent evidence | Identify asserted behavior, negative cases, smoke coverage, API contracts, guard checks. | Treat as complete product proof unless the specific test was run or its assertions directly cover the claim. |
| Runtime Fact | command outputs from this run, e.g. `pnpm guard:source` | Highest current-run evidence for command outcome | Support claims about current branch, scripts, guard status and any tests executed in this run. | Infer unrun tests passed. |
| Schema Fact | `prisma/schema.prisma`, `prisma/migrations/**`, `prisma/seed.ts` | High structural evidence | Establish data model breadth, migration history and seed intent. | Claim UI editability or workflow persistence from schema alone. |
| Route Registry Fact | `lib/route-registry.ts`, `lib/route-smoke-list.ts` | High app-surface map evidence | Establish registered route catalogue, route metadata, visual modes, route scopes and route smoke targets. | Treat a registered route as proof of complete workflow behavior. |
| Demo Data Fact | `lib/*demo-data.ts`, `lib/demo/**`, `prisma/seed.ts` | Medium evidence | Identify seeded/static/demo states and likely UI data sources. | Treat static/demo data as user-editable persistence unless a write path exists. |
| Documentation Claim | `docs/**`, root reports, prior handoffs, prior audit reports | Medium/low, depending on freshness | Use as hypothesis, context, expected proof shape or safety rule when allowed by the True-UX handoff. | Use as local code fact without code/test/runtime corroboration. |
| Generated/Build Artifact | `.next/**`, `test-results/**`, ZIPs, screenshots, generated PDFs | Low to medium, artifact-specific | Use only when the artifact was intentionally produced or referenced as proof for this run. | Treat stale generated output as current source truth. |
| External Method Source | Internet or external best-practice material | Method-only evidence | Methodology support if needed. | Project-internal code facts. |
| Chat/Memory/Prior Context | conversation history, memory summaries | Excluded for code facts | Only operational preference guidance; any project fact must be rechecked locally. | Any local implementation/capability claim. |

## Exclusion Register

| Excluded source | Exclusion rule | Reason |
| --- | --- | --- |
| `main` branch or older source snapshots | Never target truth. | AlphaVest AGENTS/True-UX handoff binds this run to current `full-workflow`. |
| Uploaded audit ticket file as code evidence | It is a task architecture source, not proof of AlphaVest implementation. | It defines what to audit, not what exists in this repo. |
| Prior audit reports | Format/pattern reference only unless corroborated in current local code or runtime. | Upload explicitly forbids stale context becoming code truth. |
| Chat context and memory | Not code evidence. | Useful for preferences, not implementation facts. |
| Pre-existing dirty files | Treat as parallel workspace state unless directly inspected and intentionally included. | Prevents this audit from silently absorbing unrelated JSON/source-sync changes. |
| Documentation-only feature claims | Must be downgraded to `DOC_CLAIM` unless code/test/runtime supports them. | Prevents report overclaims. |
| Schema-only existence | Cannot prove editability or workflow processing. | A table/model is not a vertical slice. |
| UI-only presence | Cannot prove mutation, persistence or guarded workflow. | A button/route/card is not a workflow. |
| Test file existence | Cannot prove current passing behavior unless executed. | Static tests are proof intent, not current run result. |

## Map-Vs-Reality Rules

1. Route registry is a map of intended app surfaces; it is not proof that every route has a full vertical workflow.
2. Prisma schema is a map of possible persistence; it is not proof that the UI can create, update or delete records.
3. Demo data is a map of possible states; it is not proof that those states arise from user actions.
4. Tests are a map of expected behavior; only executed tests become runtime proof.
5. Docs are a map of desired or prior behavior; code/test/runtime evidence decides current local reality.
6. A `COMPLETE_VERTICAL_SLICE` claim requires all layers: UI entry, handler/API/service, persistence or justified non-persistence, workflow/state transition, guard/audit/visibility, and test or runtime proof.

## ANALYSIS-1.1.1 Validation

| Validation item | Result |
| --- | --- |
| Three source samples classified | `lib/route-registry.ts` = Route Registry Fact; `tests/workflow-gate.spec.ts` = Test Fact; `docs/v3/WORKFLOW_DEFINITIONS_V3.md` = Documentation Claim. |
| Internet use boundary | No internet used for project facts. Allowed only for method research if later needed. |
| Local-only code fact boundary | Established. |
| Ready for next ticket | Yes: `ANALYSIS-1.1.2`. |
