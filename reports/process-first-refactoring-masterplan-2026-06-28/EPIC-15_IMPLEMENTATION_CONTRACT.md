# EPIC-15 Implementation Contract

## Domain contract

DOMAIN-K covers operations, data quality and review rhythm for BP-099 and BP-100. It must be closed as workflow-backed application behavior, not as explanatory UI.

## Target surfaces

- S034 `/analyst/workbench`: analyst queue context where data-quality blockers can affect work readiness.
- S038 `/compliance/reviews`: compliance queue context where release remains blocked by safety controls.
- S039 `/compliance/reviews/:id/decision-room`: decision context where data-quality release gates can block release/export.
- S040 `/compliance/reviews/:id/audit`: audit context for safety-relevant review events.
- S059 `/ops`: operations queue hub for queue, SLA and data-quality work.
- S060 `/ops/sla/:id`: SLA/escalation detail for breached queues and data-quality blockers.
- 068 `/reviews`: review calendar monitoring.
- 069 `/reviews/:id`: rebalance trigger monitoring.

## State and service boundaries

- Monitoring and prioritization are read-model responsibilities:
  - `lib/review-monitoring-service.ts`
  - `lib/ops-sla-readmodel-service.ts`
- Block/escalate and route actions are workflow responsibilities:
  - `lib/review-monitoring-workflow-actions.ts`
  - `app/api/review-monitoring/actions/route.ts`
- Data-quality creation, blocking, release gate evaluation and audited resolution are lifecycle responsibilities:
  - `lib/data-quality-service.ts`
  - `lib/data-quality-repository.ts`
- UI screens consume process-backed object state; they must not render internal contract/proof/explainer panels.

## Required proof contract

Every BP-099/BP-100 step must name:

- route pendant proof,
- service or API proof,
- UI surface proof where authorized,
- positive behavior proof,
- negative/fail-closed behavior proof,
- step-level gate proof,
- audit or evidence failure proof,
- no-advice/no-client-release/no-client-visibility boundary where relevant.

## Acceptance criteria

- BP-099-S01 through BP-099-S05 and BP-100-S01 through BP-100-S05 are represented in one canonical Domain-K lifecycle contract.
- Contract tests fail if any step lacks route pendant, service proof, positive proof, negative proof, gate proof or audit/evidence failure proof.
- P0 coverage matrix rows for the 10 Domain-K steps are updated to implemented only after the contract and tests exist.
- Data-quality DB tests use the repo-local seed helper instead of spawning `pnpm db:seed` from Playwright test workers.
- Review-monitoring API tests use the repo-local seed helper instead of spawning `pnpm db:seed` from Playwright test workers.
- UI proof is screenshot-based only when a visible UI change occurs. Lifecycle/matrix closure alone does not require a new screenshot.

## Non-goals

- No new explanatory panels.
- No acceptance-path copy in operational UI.
- No client-visible internal process IDs, proof labels, work-package labels or route metadata.
- No relaxation of release, export, audit or data-quality gates.
