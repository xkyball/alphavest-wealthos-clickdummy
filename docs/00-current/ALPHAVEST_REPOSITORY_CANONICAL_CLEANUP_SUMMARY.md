# AlphaVest Repository Canonical Cleanup Summary

Generated: 2026-06-30

## Authority Model

The repository keeps one operative product authority chain at the root:

- `AGENTS.md`
- `README.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md`
- `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md`
- `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md`

All older task packs, work-package reports, prompt chains, proof bundles, capture outputs, and intermediate execution reports are historical implementation scaffolding. They are not product authority and must not be used to override the True-UX handoff or current code.

## Preserved Canonical Knowledge

The durable product knowledge retained from the historical material is:

- AlphaVest is a demo-data-first WealthOS app with strict advice, evidence, export, client-visibility, audit, and RBAC boundaries.
- Operational UI must show product-native object state, blockers, next actions, and safety obligations only; route IDs, task IDs, proof scaffolding, source-trace wording, and implementation labels stay out of default UI.
- Client-visible content is fail-closed and allow-listed; advisor approval is not compliance release, and compliance release is not client acceptance.
- Evidence and audit records are product behavior, not screenshot or report-only proof.
- Route evolution, screen splitting, and safety-sensitive behavior remain governed by the True-UX authority chain and current tests.
- Generated screenshots, capture folders, previous report bundles, and prompt artifacts are disposable unless they are explicitly registered as current source-universe references.

## Cleanup Manifest

The machine-readable cleanup manifest is stored at:

- `docs/00-current/ALPHAVEST_REPOSITORY_CLEANUP_MANIFEST.json`

Its actions are:

- `keep`: retained source, tests, config, durable docs, design references, or authority files.
- `delete`: ignored/generated local build, proof, capture, report, temporary, or OS/editor artifact.
- `extract_then_delete`: tracked historical task/proof/report surface superseded by this canonical summary and the True-UX authority chain.
- `rename`: active code, test, or script that still carries task-era naming and should be canonicalized to product/domain naming.

## Operating Rule Going Forward

New task prompts, proof folders, generated screenshots, temporary reports, and local capture bundles must stay ignored or outside tracked source unless they are deliberately promoted into a canonical current document or an importable source-universe reference. Active code and public test contracts must use product/domain names rather than task, phase, work-package, epic, or prompt identifiers.
