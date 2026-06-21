import type { PreparedFileMetadata } from "@/lib/file-metadata-service";
import { exportService, type ExportPayloadClassification } from "@/lib/export-service";

export type ExportPackageStage = "approved" | "downloaded" | "generated" | "preview" | "shared";

export type ExportPackageManifestInput = {
  approvalRequired: boolean;
  approved: boolean;
  auditPersistenceAvailable?: boolean;
  expiresAt: Date;
  exportRequestId: string;
  externalShare: boolean;
  file: PreparedFileMetadata;
  payloadClassifications?: ExportPayloadClassification[];
  packageStage?: ExportPackageStage;
  redactionProfile: string;
  selectedObjectCount: number;
  tenantSlug: string;
  watermark: boolean;
};

export type ExportPackageManifest = {
  checksum: string;
  controls: {
    approvalRequired: boolean;
    approved: boolean;
    auditPersistenceConfirmed: boolean;
    externalShare: boolean;
    forbiddenPayloads: ExportPayloadClassification[];
    lifecycle: {
      allowedNextActions: string[];
      approved: boolean;
      downloaded: boolean;
      generated: boolean;
      previewed: boolean;
      shared: boolean;
      stage: "draft" | "preview" | "approved" | "generated" | "downloaded" | "shared";
    };
    packageStage: "approved" | "downloaded" | "generated" | "preview" | "shared";
    payloadClassifications: ExportPayloadClassification[];
    selectedObjectCount: number;
    watermark: boolean;
  };
  contentAddress: string;
  expiresAt: string;
  fileName: string;
  fileSizeBytes: number;
  manifestVersion: "2026.06.first-build-phase7";
  mimeType: string;
  packageId: string;
  realBinaryGenerated: false;
  redactionProfile: string;
  storageKey: string;
  tenantSlug: string;
};

export type ExportPackageManifestResult = {
  issues: string[];
  manifest: ExportPackageManifest;
  valid: boolean;
};

export function buildExportPackageManifest(input: ExportPackageManifestInput): ExportPackageManifestResult {
  const issues = [...input.file.issues];
  const packageStage = input.packageStage ?? "generated";
  const payloadClassifications = [...new Set(input.payloadClassifications ?? [])];
  const forbiddenPayloads = exportService.forbiddenExportPayloads(payloadClassifications);
  const lifecycleFlags = {
    approved: input.approved,
    downloaded: packageStage === "downloaded" || packageStage === "shared",
    generated: packageStage === "generated" || packageStage === "downloaded" || packageStage === "shared",
    previewed: true,
    shared: packageStage === "shared",
  };
  const lifecycle = exportService.evaluateExportStepSeparation({
    ...lifecycleFlags,
  });

  if (!input.file.valid) issues.push("valid_file_metadata_required");
  if (input.file.mimeType !== "application/zip") issues.push("zip_package_required");
  if (input.approvalRequired && !input.approved) issues.push("approval_required_before_generation");
  if ((packageStage === "downloaded" || packageStage === "shared") && !input.approved) {
    issues.push("approval_required_before_delivery");
  }
  if (packageStage === "shared" && !input.externalShare) issues.push("external_share_required_for_share_stage");
  if (input.auditPersistenceAvailable === false) issues.push("audit_persistence_required_before_generation");
  if (!input.redactionProfile.trim()) issues.push("redaction_profile_required");
  if (input.selectedObjectCount <= 0) issues.push("selected_export_objects_required");
  if (!input.watermark) issues.push("watermark_required");
  for (const classification of forbiddenPayloads) {
    issues.push(`forbidden_payload:${classification}`);
  }

  const manifest: ExportPackageManifest = {
    checksum: input.file.checksum,
    contentAddress: input.file.contentAddress,
    controls: {
      approvalRequired: input.approvalRequired,
      approved: input.approved,
      auditPersistenceConfirmed: input.auditPersistenceAvailable !== false,
      externalShare: input.externalShare,
      forbiddenPayloads,
      lifecycle: {
        ...lifecycleFlags,
        allowedNextActions: lifecycle.allowedNextActions,
        stage: lifecycle.stage,
      },
      packageStage,
      payloadClassifications,
      selectedObjectCount: input.selectedObjectCount,
      watermark: input.watermark,
    },
    expiresAt: input.expiresAt.toISOString(),
    fileName: input.file.fileName,
    fileSizeBytes: input.file.fileSizeBytes,
    manifestVersion: "2026.06.first-build-phase7",
    mimeType: input.file.mimeType,
    packageId: input.exportRequestId,
    realBinaryGenerated: false,
    redactionProfile: input.redactionProfile,
    storageKey: input.file.storageKey,
    tenantSlug: input.tenantSlug,
  };

  return {
    issues,
    manifest,
    valid: issues.length === 0,
  };
}

export const exportPackageService = {
  buildExportPackageManifest,
};
