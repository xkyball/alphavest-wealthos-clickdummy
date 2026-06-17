import { expect, test } from "@playwright/test";

import { exportPackageService } from "../lib/export-package-service";
import { fileMetadataService } from "../lib/file-metadata-service";

test.describe("Phase 18 file metadata realism", () => {
  test("prepares deterministic document upload metadata", () => {
    const metadata = fileMetadataService.prepareDemoFileMetadata({
      category: "documents",
      checksumSeed: "morgan:tax-residency-2026:v1",
      fileName: "morgan-tax-residency-2026.pdf",
      fileSizeBytes: 386240,
      mimeType: "application/pdf",
      tenantSlug: "morgan",
    });

    expect(metadata.valid).toBe(true);
    expect(metadata.issues).toEqual([]);
    expect(metadata.checksum).toHaveLength(64);
    expect(metadata.contentAddress).toBe(`sha256:${metadata.checksum}`);
    expect(metadata.storageKey).toContain("demo/morgan/documents/");
    expect(metadata.storageKey).toContain("morgan-tax-residency-2026.pdf");
  });

  test("rejects unsafe or unsupported file metadata", () => {
    const metadata = fileMetadataService.prepareDemoFileMetadata({
      category: "documents",
      checksumSeed: "",
      fileName: "../statement.exe",
      fileSizeBytes: 0,
      mimeType: "application/x-msdownload",
      tenantSlug: "morgan",
    });

    expect(metadata.valid).toBe(false);
    expect(metadata.issues).toContain("safe_file_name_required");
    expect(metadata.issues).toContain("supported_mime_type_required");
    expect(metadata.issues).toContain("positive_file_size_required");
    expect(metadata.issues).toContain("checksum_seed_required");
  });
});

test.describe("Phase 18 export package manifest", () => {
  test("builds a validated metadata-only export package manifest", () => {
    const file = fileMetadataService.prepareDemoFileMetadata({
      category: "exports",
      checksumSeed: "summit:export-package:2026-06-16",
      fileName: "EXP-2026-06-16-0087-redacted.zip",
      fileSizeBytes: 9123840,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const result = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      externalShare: false,
      file,
      redactionProfile: "external-limited",
      selectedObjectCount: 3,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.manifest.manifestVersion).toBe("2026.06.phase18");
    expect(result.manifest.realBinaryGenerated).toBe(false);
    expect(result.manifest.controls.approved).toBe(true);
    expect(result.manifest.controls.watermark).toBe(true);
    expect(result.manifest.storageKey).toBe(file.storageKey);
  });

  test("blocks export package generation without approval, zip format and watermark", () => {
    const file = fileMetadataService.prepareDemoFileMetadata({
      category: "exports",
      checksumSeed: "summit:export-package:bad",
      fileName: "summit-export.pdf",
      fileSizeBytes: 128000,
      mimeType: "application/pdf",
      tenantSlug: "summit",
    });
    const result = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: false,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      externalShare: true,
      file,
      redactionProfile: "",
      selectedObjectCount: 0,
      tenantSlug: "summit",
      watermark: false,
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("zip_package_required");
    expect(result.issues).toContain("approval_required_before_generation");
    expect(result.issues).toContain("redaction_profile_required");
    expect(result.issues).toContain("selected_export_objects_required");
    expect(result.issues).toContain("watermark_required");
  });
});
