import type { ActorContext } from "@/lib/control-layer/actor-context";
import type { ExportPackageManifestInput, ExportPackageManifestResult } from "@/lib/export-package-service";
import { exportPackageService } from "@/lib/export-package-service";
import {
  exportService,
  type ExportGateDecision,
  type ExportPayloadClassification,
  type ExportScopeCandidate,
  type ExportScopeDecision,
  type ExportStepSeparationDecision,
} from "@/lib/export-service";
import type { ObjectType, UUID } from "@/lib/domain-types";

export type ExportSafetyResult = {
  controlLayer: "WCL-09";
  exportGate: ExportGateDecision;
  lifecycle: ExportStepSeparationDecision;
  packageResult?: ExportPackageManifestResult;
  scopeDecision: ExportScopeDecision;
  status: "EXPORT_ALLOWED" | "EXPORT_BLOCKED";
};

export function evaluateExportSafety(input: {
  actorContext: ActorContext;
  approvalComplete: boolean;
  auditPersistenceAvailable?: boolean;
  externalShare?: boolean;
  packageInput?: ExportPackageManifestInput;
  payloadClassifications?: ExportPayloadClassification[];
  redactionProfile?: string;
  scopeItems: ExportScopeCandidate[];
  targetId?: UUID;
  targetType?: ObjectType;
}): ExportSafetyResult {
  const lifecycle = exportService.evaluateExportStepSeparation({
    approved: input.approvalComplete,
    downloaded: input.packageInput?.packageStage === "downloaded" || input.packageInput?.packageStage === "shared",
    generated:
      input.packageInput?.packageStage === "generated" ||
      input.packageInput?.packageStage === "downloaded" ||
      input.packageInput?.packageStage === "shared",
    previewed: true,
    shared: input.packageInput?.packageStage === "shared",
  });
  const scopeDecision = exportService.evaluateExportScope(input.scopeItems);
  const packageResult = input.packageInput
    ? exportPackageService.buildExportPackageManifest(input.packageInput)
    : undefined;
  const exportGate = exportService.canGenerateExport({
    actor: input.actorContext.session.actor,
    approvalComplete: input.approvalComplete,
    auditPersistenceAvailable: input.auditPersistenceAvailable,
    clientTenantId: input.actorContext.clientTenantId,
    externalShare: input.externalShare,
    payloadClassifications: input.payloadClassifications,
    platformTenantId: input.actorContext.platformTenantId,
    redactionProfile: input.redactionProfile,
    role: input.actorContext.session.role,
    targetId: input.targetId,
    targetType: input.targetType ?? "EXPORT_REQUEST",
  });
  const blocked =
    !scopeDecision.valid ||
    !exportGate.allowedToGenerate ||
    Boolean(packageResult && !packageResult.valid);

  return {
    controlLayer: "WCL-09",
    exportGate,
    lifecycle,
    packageResult,
    scopeDecision,
    status: blocked ? "EXPORT_BLOCKED" : "EXPORT_ALLOWED",
  };
}
