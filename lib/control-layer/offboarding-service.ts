import type { ActorContext } from "@/lib/control-layer/actor-context";
import { evaluateExportSafety, type ExportSafetyResult } from "@/lib/control-layer/export-safety";
import type { ExportPackageManifestInput } from "@/lib/export-package-service";
import type { ExportPayloadClassification, ExportScopeCandidate } from "@/lib/export-service";
import type { UUID } from "@/lib/domain-types";

export type OffboardingControlResult = {
  accessRevoked: boolean;
  clientSafeConfirmation: boolean;
  controlLayer: "WCL-11";
  finalExport: "BLOCKED" | "READY";
  legalHoldApplied: boolean;
  missing: string[];
  residualAccessDenied: boolean;
  retentionApplied: boolean;
  status: "OFFBOARDING_CONTROL_READY" | "OFFBOARDING_CONTROL_BLOCKED";
};

export function evaluateOffboardingControl(input: {
  actorContext: ActorContext;
  affectedUserIds: UUID[];
  auditCorrelationId?: string;
  finalExportPackage?: ExportPackageManifestInput;
  finalExportScopeItems?: ExportScopeCandidate[];
  legalHoldFlag?: boolean;
  payloadClassifications?: ExportPayloadClassification[];
  retentionPolicy?: string;
}): OffboardingControlResult & { exportSafety?: ExportSafetyResult } {
  const missing: string[] = [];

  if (input.affectedUserIds.length === 0) missing.push("affected_users");
  if (!input.retentionPolicy) missing.push("retention_policy");
  if (!input.auditCorrelationId) missing.push("audit_correlation_id");

  const exportSafety = input.finalExportScopeItems
    ? evaluateExportSafety({
        actorContext: input.actorContext,
        approvalComplete: Boolean(input.finalExportPackage?.approved),
        auditPersistenceAvailable: true,
        externalShare: input.finalExportPackage?.externalShare,
        packageInput: input.finalExportPackage,
        payloadClassifications: input.payloadClassifications,
        redactionProfile: input.finalExportPackage?.redactionProfile,
        scopeItems: input.finalExportScopeItems,
        targetId: input.finalExportPackage?.exportRequestId,
        targetType: "EXPORT_REQUEST",
      })
    : undefined;

  if (exportSafety && exportSafety.status !== "EXPORT_ALLOWED") {
    missing.push("final_export_safety");
  }

  const uniqueMissing = [...new Set(missing)];

  return {
    accessRevoked: input.affectedUserIds.length > 0,
    clientSafeConfirmation: uniqueMissing.length === 0,
    controlLayer: "WCL-11",
    exportSafety,
    finalExport: exportSafety && exportSafety.status !== "EXPORT_ALLOWED" ? "BLOCKED" : "READY",
    legalHoldApplied: Boolean(input.legalHoldFlag),
    missing: uniqueMissing,
    residualAccessDenied: input.affectedUserIds.length > 0,
    retentionApplied: Boolean(input.retentionPolicy),
    status: uniqueMissing.length === 0 ? "OFFBOARDING_CONTROL_READY" : "OFFBOARDING_CONTROL_BLOCKED",
  };
}
