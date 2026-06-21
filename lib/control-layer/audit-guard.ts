import {
  auditService,
  AuditMinimumFieldsError,
  AuditPersistenceRequiredError,
  type AuditPersistencePolicyInput,
} from "@/lib/audit-service";

export type AuditGuardResult =
  | {
      allowed: true;
      correlationId: string;
      metadata: ReturnType<typeof auditService.criticalAuditMetadata>;
      reasonCode: "WCL_AUDIT_GUARD_ALLOWED";
    }
  | {
      allowed: false;
      correlationId: string;
      missingFields: string[];
      reason: string;
      reasonCode: "WCL_AUDIT_GUARD_BLOCKED";
    };

export function evaluateAuditGuard(
  input: AuditPersistencePolicyInput & { correlationId: string },
): AuditGuardResult {
  try {
    auditService.assertCriticalAuditWritable(input);

    return {
      allowed: true,
      correlationId: input.correlationId,
      metadata: auditService.criticalAuditMetadata(input),
      reasonCode: "WCL_AUDIT_GUARD_ALLOWED",
    };
  } catch (error) {
    if (error instanceof AuditMinimumFieldsError) {
      return {
        allowed: false,
        correlationId: input.correlationId,
        missingFields: error.missingFields,
        reason: error.message,
        reasonCode: "WCL_AUDIT_GUARD_BLOCKED",
      };
    }

    if (error instanceof AuditPersistenceRequiredError) {
      return {
        allowed: false,
        correlationId: input.correlationId,
        missingFields: ["auditPersistenceAvailable"],
        reason: error.message,
        reasonCode: "WCL_AUDIT_GUARD_BLOCKED",
      };
    }

    throw error;
  }
}
