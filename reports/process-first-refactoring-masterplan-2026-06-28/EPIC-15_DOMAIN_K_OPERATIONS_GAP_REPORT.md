# EPIC-15 Domain-K Operations Gap Report

## Scope

- Epic: EPIC-15 Operations, Data Quality and Review Rhythm
- Domain: DOMAIN-K
- Processes: BP-099 Data quality block, BP-100 Data quality resolution
- Target surfaces: S034, S038, S039, S040, S059, S060, plus review-monitoring routes 068 and 069 as process touchpoints

## Current implementation truth

Domain-K is not only a visual shell. The current repository already contains service-backed behavior:

- `lib/data-quality-service.ts` creates and resolves data-quality issues, evaluates readiness and release gates, and fails closed when required audit persistence is unavailable.
- `lib/review-monitoring-service.ts` builds a review/rebalance monitoring snapshot from `ReviewSchedule`, `Trigger`, `ActionItem`, `QueueItem` and recent audit events.
- `lib/review-monitoring-workflow-actions.ts` persists schedule, escalation, rebalance block and route actions with audit rows and no client release.
- `lib/ops-sla-readmodel-service.ts` derives S059/S060-style queue/SLA/data-quality read models from `QueueItem`, `DataQualityIssue` and `ReviewSchedule`.
- `tests/data-quality-service.spec.ts` covers data-quality blocking, object scoping, release/export blocking, audited resolution and audit persistence failure.
- `tests/review-monitoring-service.spec.ts` covers monitoring snapshots, invalid query rejection and review/rebalance workflow actions.

## Step coverage gaps before EPIC-15

The P0 coverage matrix marks all BP-099/BP-100 steps as `partially_implemented`.

- BP-099-S01 Monitor: route/service exists, negative proof missing.
- BP-099-S02 Prioritize: route/service exists, negative proof missing.
- BP-099-S03 Block/escalate: route/service exists, negative proof missing.
- BP-099-S04 Resolve: data-quality resolution exists, but step-level gate proof and audit/evidence failure proof are not attached to the process step.
- BP-099-S05 Audit when safety-relevant: audit persistence behavior exists, but step-level gate proof and audit/evidence failure proof are not attached to the process step.
- BP-100-S01 Monitor: route/service exists, negative proof missing.
- BP-100-S02 Prioritize: route/service exists, negative proof missing.
- BP-100-S03 Block/escalate: route/service exists, negative proof missing.
- BP-100-S04 Resolve: data-quality resolution exists, but step-level gate proof and audit/evidence failure proof are not attached to the process step.
- BP-100-S05 Audit when safety-relevant: audit persistence behavior exists, but step-level gate proof and audit/evidence failure proof are not attached to the process step.

## Target posture

Do not stretch UI proof to close backend lifecycle gaps. The right cleanup is a Domain-K backend lifecycle contract that explicitly binds each BP-099/BP-100 step to:

- process route pendants and operational surfaces,
- canonical service/API files,
- positive test proof,
- negative test proof,
- step-level gate proof,
- audit/evidence failure proof,
- no advice, no release and no client visibility guarantees where applicable.

After that contract is test-backed, update the P0 coverage matrix from partial to implemented for the 10 Domain-K rows.

## Decision

No user decision is required for analysis. The conservative-but-bold path is to close Domain-K through a lifecycle contract and matrix proof, not by adding explanatory UI panels.
