import { stableId } from "../../lib/stable-id";

export function e2eAuditCorrelationId(taskId: string, action: string) {
  return stableId(`e2e-audit:${taskId}:${action}`);
}

export function expectedAuditProof(input: {
  action: string;
  critical: boolean;
  result: "SUCCESS" | "DENIED" | "BLOCKED" | "PENDING";
}) {
  return {
    action: input.action,
    auditRequired: input.critical,
    failClosedWhenUnavailable: input.critical,
    result: input.result,
  };
}

