import type { DataQualityGate } from "@/lib/data-quality-service";

export type MonitoringGuardResult = {
  blockingIssues: string[];
  clientVisible: false;
  controlLayer: "WCL-10";
  internalTriggerOnly: true;
  missing: string[];
  noAdviceExecution: true;
  noAutomaticAdvice: true;
  noClientRelease: true;
  passed: boolean;
  proofLabels: string[];
  reasonCode: "WCL_MONITORING_INTERNAL_ONLY";
  status: "MONITORING_ONLY" | "BLOCKED_FOR_REVIEW";
};

export function evaluateMonitoringGuard(input: {
  dataQualityGate?: DataQualityGate;
  reviewDue?: boolean;
  triggerCreated?: boolean;
}): MonitoringGuardResult {
  const missing: string[] = [];
  const proofLabels = ["WCL-MONITORING-INTERNAL-ONLY"];

  if (input.dataQualityGate && !input.dataQualityGate.passed) {
    missing.push(input.dataQualityGate.gateName.toLowerCase());
    missing.push(...input.dataQualityGate.missing);
    proofLabels.push("WCL-DATA-QUALITY-BLOCK");
  }

  if (input.reviewDue) {
    missing.push("review_due_internal_only");
    proofLabels.push("WCL-REVIEW-DUE");
  }

  if (input.triggerCreated) {
    missing.push("trigger_created_internal_only");
    proofLabels.push("WCL-INTERNAL-TRIGGER-CREATED");
  }

  const uniqueMissing = [...new Set(missing)];
  const passed = !input.dataQualityGate || input.dataQualityGate.passed;

  return {
    blockingIssues: uniqueMissing,
    clientVisible: false,
    controlLayer: "WCL-10",
    internalTriggerOnly: true,
    missing: uniqueMissing,
    noAdviceExecution: true,
    noAutomaticAdvice: true,
    noClientRelease: true,
    passed,
    proofLabels: [...new Set(proofLabels)],
    reasonCode: "WCL_MONITORING_INTERNAL_ONLY",
    status: passed ? "MONITORING_ONLY" : "BLOCKED_FOR_REVIEW",
  };
}
