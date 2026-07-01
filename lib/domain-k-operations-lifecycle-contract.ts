export const domainKOperationsLifecycleContractId = "DOMAIN-K-OPERATIONS-LIFECYCLE-01" as const;
export const domainKOperationsLifecycleTicketId = "DOMAIN-15" as const;

export const domainKOperationsProcessIds = ["BP-099", "BP-100"] as const;
export type DomainKOperationsProcessId = (typeof domainKOperationsProcessIds)[number];

export const domainKOperationsStepIds = domainKOperationsProcessIds.flatMap(
  (processId) => [`${processId}-S01`, `${processId}-S02`, `${processId}-S03`, `${processId}-S04`, `${processId}-S05`] as const,
);
export type DomainKOperationsStepId = (typeof domainKOperationsStepIds)[number];

export type DomainKOperationsSurfaceId = "S034" | "S038" | "S039" | "S040" | "S059" | "S060" | "S068" | "S069";

export type DomainKOperationsLifecycleStep = {
  apiProof: readonly string[];
  auditOrEvidenceFailureProof: readonly string[];
  clientSafeBoundary: readonly string[];
  gateProof: readonly string[];
  inputUi: readonly DomainKOperationsSurfaceId[];
  negativeProof: readonly string[];
  outputUi: readonly DomainKOperationsSurfaceId[];
  positiveProof: readonly string[];
  processId: DomainKOperationsProcessId;
  routePendants: readonly DomainKOperationsSurfaceId[];
  serviceProof: readonly string[];
  stepId: DomainKOperationsStepId;
  stepLabel: "Monitor" | "Prioritize" | "Block/escalate" | "Resolve" | "Audit when safety-relevant";
  testProof: readonly string[];
};

const sharedRoutePendants = ["S059", "S060", "S068", "S069", "S034", "S038", "S039", "S040"] as const;
const monitoringServices = ["lib/review-monitoring-service.ts", "lib/ops-sla-readmodel-service.ts"] as const;
const lifecycleServices = ["lib/data-quality-service.ts", "lib/data-quality-repository.ts"] as const;
const workflowServices = ["lib/review-monitoring-workflow-actions.ts"] as const;

const surfaceRoutes: Record<DomainKOperationsSurfaceId, { pageId: string; path: string; title: string }> = {
  S034: { pageId: "034", path: "/advisory/review-queue", title: "Analyst Workbench" },
  S038: { pageId: "038", path: "/compliance/reviews", title: "Compliance Queue" },
  S039: { pageId: "039", path: "/compliance/reviews/:id/decision-room", title: "Compliance Review Detail" },
  S040: { pageId: "040", path: "/compliance/reviews/:id/release", title: "Release to Client" },
  S059: { pageId: "059", path: "/ops", title: "Ops Queues" },
  S060: { pageId: "060", path: "/ops/sla/:id", title: "SLA and Escalation" },
  S068: { pageId: "068", path: "/reviews", title: "Review Calendar" },
  S069: { pageId: "069", path: "/reviews/:id", title: "Rebalance Monitoring" },
};

function step(
  processId: DomainKOperationsProcessId,
  sequence: 1 | 2 | 3 | 4 | 5,
  stepLabel: DomainKOperationsLifecycleStep["stepLabel"],
  extra: Omit<DomainKOperationsLifecycleStep, "processId" | "stepId" | "stepLabel">,
): DomainKOperationsLifecycleStep {
  return {
    ...extra,
    processId,
    stepId: `${processId}-S0${sequence}` as DomainKOperationsStepId,
    stepLabel,
  };
}

function stepsForProcess(processId: DomainKOperationsProcessId): readonly DomainKOperationsLifecycleStep[] {
  const processName = processId === "BP-099" ? "data-quality block" : "data-quality resolution";

  return [
    step(processId, 1, "Monitor", {
      apiProof: ["/api/review-monitoring", "/api/ops-sla"],
      auditOrEvidenceFailureProof: ["tests/review-monitoring-service.spec.ts::invalid asOf values deny mutation"],
      clientSafeBoundary: ["Monitoring remains internal, no advice execution and no client release."],
      gateProof: ["lib/control-layer/monitoring-guard.ts"],
      inputUi: ["S059", "S068"],
      negativeProof: ["tests/review-monitoring-service.spec.ts::GET /api/review-monitoring rejects invalid asOf values without advice execution"],
      outputUi: ["S059", "S060", "S068", "S069"],
      positiveProof: ["tests/review-monitoring-service.spec.ts::GET /api/review-monitoring returns due, overdue and trigger state proof"],
      routePendants: sharedRoutePendants,
      serviceProof: monitoringServices,
      testProof: ["tests/review-monitoring-service.spec.ts", "tests/dbtf-tables-api.spec.ts"],
    }),
    step(processId, 2, "Prioritize", {
      apiProof: ["/api/ops-sla"],
      auditOrEvidenceFailureProof: ["tests/review-monitoring-service.spec.ts::monitoring guard creates internal triggers without automatic advice or release"],
      clientSafeBoundary: [`Prioritized ${processName} state is operational only and cannot release advice.`],
      gateProof: ["lib/ops-sla-readmodel-service.ts::high severity data-quality issues join SLA breach rows"],
      inputUi: ["S059", "S060"],
      negativeProof: ["tests/review-monitoring-service.spec.ts::WS-08 monitoring guard creates internal triggers without automatic advice or release"],
      outputUi: ["S059", "S060"],
      positiveProof: ["tests/dbtf-tables-api.spec.ts::GET /api/ops-sla"],
      routePendants: ["S059", "S060"],
      serviceProof: monitoringServices,
      testProof: ["tests/review-monitoring-service.spec.ts", "tests/dbtf-tables-api.spec.ts"],
    }),
    step(processId, 3, "Block/escalate", {
      apiProof: ["/api/review-monitoring/actions"],
      auditOrEvidenceFailureProof: ["tests/review-monitoring-service.spec.ts::J17 rebalance monitoring actions persist trigger state without advice execution"],
      clientSafeBoundary: ["Block and escalation actions set clientVisible=false and noClientRelease=true."],
      gateProof: ["lib/review-monitoring-workflow-actions.ts"],
      inputUi: ["S060", "S069"],
      negativeProof: ["tests/review-monitoring-service.spec.ts::J17 rebalance monitoring actions persist trigger state without advice execution"],
      outputUi: ["S060", "S069", "S038"],
      positiveProof: ["tests/review-monitoring-service.spec.ts::J16 review calendar actions persist internal audit state without client release"],
      routePendants: ["S060", "S069", "S038"],
      serviceProof: workflowServices,
      testProof: ["tests/review-monitoring-service.spec.ts"],
    }),
    step(processId, 4, "Resolve", {
      apiProof: ["lib/data-quality-service.ts::resolveDataQualityIssue"],
      auditOrEvidenceFailureProof: ["tests/data-quality-service.spec.ts::does not silently unblock when required data-quality audit persistence is unavailable"],
      clientSafeBoundary: ["Resolution can unblock gates only after audited data-quality state changes; it does not publish client content."],
      gateProof: ["lib/data-quality-service.ts::evaluateDataQualityReleaseGate", "lib/workflow-gate.ts", "lib/export-service.ts"],
      inputUi: ["S034", "S038", "S039", "S060"],
      negativeProof: ["tests/data-quality-service.spec.ts::does not silently unblock when required data-quality audit persistence is unavailable"],
      outputUi: ["S034", "S038", "S039", "S040", "S060"],
      positiveProof: ["tests/data-quality-service.spec.ts::blocks release/export while high-severity data quality is active and unblocks after audited resolution"],
      routePendants: ["S034", "S038", "S039", "S040", "S060"],
      serviceProof: lifecycleServices,
      testProof: ["tests/data-quality-service.spec.ts", "tests/workflow-gate.spec.ts", "tests/export-workflow-api.spec.ts"],
    }),
    step(processId, 5, "Audit when safety-relevant", {
      apiProof: ["AuditEvent persistence through data-quality and review-monitoring services"],
      auditOrEvidenceFailureProof: ["tests/data-quality-service.spec.ts::does not silently unblock when required data-quality audit persistence is unavailable"],
      clientSafeBoundary: ["Audit proof stays in backend records and audit surfaces; operational UI must not expose internal proof scaffolding."],
      gateProof: ["lib/audit-service.ts::assertCriticalAuditWritable", "lib/data-quality-service.ts::criticalAuditMetadata"],
      inputUi: ["S039", "S040", "S060"],
      negativeProof: ["tests/data-quality-service.spec.ts::does not silently unblock when required data-quality audit persistence is unavailable"],
      outputUi: ["S040", "S060"],
      positiveProof: ["tests/data-quality-service.spec.ts::creates an object-linked evidence gap that blocks only the configured tenant and object"],
      routePendants: ["S039", "S040", "S060"],
      serviceProof: ["lib/data-quality-service.ts", "lib/audit-service.ts", "lib/review-monitoring-workflow-actions.ts"],
      testProof: ["tests/data-quality-service.spec.ts", "tests/review-monitoring-service.spec.ts"],
    }),
  ];
}

export const domainKOperationsLifecycleSteps = domainKOperationsProcessIds.flatMap(stepsForProcess);

export function domainKOperationsLifecycleStepForId(stepId: DomainKOperationsStepId) {
  return domainKOperationsLifecycleSteps.find((step) => step.stepId === stepId);
}

export function domainKOperationsSurfaceRoute(surfaceId: DomainKOperationsSurfaceId) {
  return surfaceRoutes[surfaceId];
}
