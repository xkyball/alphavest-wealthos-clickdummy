import type { PreparedFileMetadata } from "@/lib/file-metadata-service";
import { exportService, type ExportPayloadClassification } from "@/lib/export-service";

export type ExportPackageManifestInput = {
  approvalRequired: boolean;
  approved: boolean;
  expiresAt: Date;
  exportRequestId: string;
  externalShare: boolean;
  file: PreparedFileMetadata;
  payloadClassifications?: ExportPayloadClassification[];
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
    externalShare: boolean;
    selectedObjectCount: number;
    watermark: boolean;
  };
  contentAddress: string;
  expiresAt: string;
  fileName: string;
  fileSizeBytes: number;
  manifestVersion: "2026.06.phase18";
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

  if (!input.file.valid) issues.push("valid_file_metadata_required");
  if (input.file.mimeType !== "application/zip") issues.push("zip_package_required");
  if (input.approvalRequired && !input.approved) issues.push("approval_required_before_generation");
  if (!input.redactionProfile.trim()) issues.push("redaction_profile_required");
  if (input.selectedObjectCount <= 0) issues.push("selected_export_objects_required");
  if (!input.watermark) issues.push("watermark_required");
  for (const classification of exportService.forbiddenExportPayloads(input.payloadClassifications)) {
    issues.push(`forbidden_payload:${classification}`);
  }

  const manifest: ExportPackageManifest = {
    checksum: input.file.checksum,
    contentAddress: input.file.contentAddress,
    controls: {
      approvalRequired: input.approvalRequired,
      approved: input.approved,
      externalShare: input.externalShare,
      selectedObjectCount: input.selectedObjectCount,
      watermark: input.watermark,
    },
    expiresAt: input.expiresAt.toISOString(),
    fileName: input.file.fileName,
    fileSizeBytes: input.file.fileSizeBytes,
    manifestVersion: "2026.06.phase18",
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
