import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

import { exportPackageService } from "../lib/export-package-service";
import { exportService } from "../lib/export-service";
import { fileMetadataService } from "../lib/file-metadata-service";

const repoRoot = process.cwd();
const exportScreenPath = join(repoRoot, "components", "communication-export-ops-screen.tsx");

function readExportScreen() {
  return readFileSync(exportScreenPath, "utf8");
}

test.describe("V0.96 WP-10 export scope, redaction and approval UX", () => {
  test("keeps export stage boundaries off the create-export start surface", () => {
    const source = readExportScreen();

    expect(source).toContain("function ExportStageBoundary");
    expect(source).toContain('data-testid="wp10-export-stage-boundary"');
    expect(source).toContain("Export is a client-safe projection, not a raw data dump.");
    expect(source).toContain("Scope is not redaction. Redaction is not preview. Preview is not approval. Approval is not download/share. Download/share is not client acceptance.");
    expect(source).toContain("Preview generated; approval required.");
    expect(source).toContain("Approval recorded; download/share remain separate.");
    expect(source).toContain("Package downloaded; client acceptance not recorded.");
    expect(source).toContain("function ExportPreviewPage");
    expect(source).toContain("Preview Package");
    expect(source).toContain("Approval Review");
    expect(source).not.toContain('<ExportStageBoundary activeStage="approval"');
    expect(source).toContain('<ExportStageBoundary activeStage="package"');
    expect(source).toContain("function ExportNewPage");
    expect(source).toContain("Bennett Q2 report");
    expect(source).toContain("Select contents");
    expect(source).toContain("function ExportScopePage");
    expect(source).toContain("Choose permitted content, review recipients and continue to protection review.");
  });

  test("renders forbidden payload boundaries without widening export permission", () => {
    const source = readExportScreen();

    expect(source).toContain("function ExportPayloadBoundary");
    expect(source).toContain('data-testid="wp10-export-forbidden-payload-boundary"');
    expect(source).toContain("Only scoped, redacted and client-safe content can enter the export package.");
    expect(source).toContain("Admin access and advisor approval do not expand export payload permission");
    expect(source).toContain("Released client-safe summaries");
    expect(source).toContain("Approved/redacted manifest metadata");
    expect(source).toContain("AI Draft");
    expect(source).toContain("internal rationale");
    expect(source).toContain("compliance notes");
    expect(source).toContain("unreleased evidence");
    expect(source).toContain("unreleased recommendations");
    expect(source).toContain("hidden fields");
  });

  test("keeps preview, approval, generation, download and share as separate service states", () => {
    const previewOnly = exportService.evaluateExportStepSeparation({
      approved: false,
      downloaded: false,
      generated: false,
      previewed: true,
      shared: false,
    });

    expect(previewOnly.stage).toBe("preview");
    expect(previewOnly.canApprove).toBe(true);
    expect(previewOnly.canGenerate).toBe(false);
    expect(previewOnly.canDownload).toBe(false);
    expect(previewOnly.canShare).toBe(false);
    expect(previewOnly.allowedNextActions).toEqual(["approve"]);

    const approvedOnly = exportService.evaluateExportStepSeparation({
      approved: true,
      downloaded: false,
      generated: false,
      previewed: true,
      shared: false,
    });

    expect(approvedOnly.stage).toBe("approved");
    expect(approvedOnly.canGenerate).toBe(true);
    expect(approvedOnly.canDownload).toBe(false);
    expect(approvedOnly.allowedNextActions).toEqual(["generate"]);

    const downloadedOnly = exportService.evaluateExportStepSeparation({
      approved: true,
      downloaded: true,
      generated: true,
      previewed: true,
      shared: false,
    });

    expect(downloadedOnly.stage).toBe("downloaded");
    expect(downloadedOnly.canShare).toBe(true);
    expect(downloadedOnly.allowedNextActions).toEqual(["share"]);
  });

  test("blocks forbidden projection fields and package classifications", () => {
    const projection = exportService.canUseClientProjectionForExport({
      payload: {
        clientSummary: "Released summary.",
        complianceNotes: "Internal note.",
        internalRationale: "Internal model rationale.",
        storageKey: "hidden/raw/path",
      },
      visible: true,
    });

    expect(projection.allowed).toBe(false);
    expect(projection.missing).toEqual([
      "forbidden_projection_field:complianceNotes",
      "forbidden_projection_field:internalRationale",
      "forbidden_projection_field:storageKey",
    ]);
    expect(projection.payloadClassifications).toEqual([
      "CLIENT_SAFE_SUMMARY",
      "COMPLIANCE_NOTES",
      "INTERNAL_RATIONALE",
      "HIDDEN_FIELD",
    ]);

    const file = fileMetadataService.prepareDemoFileMetadata({
      category: "exports",
      checksumSeed: "summit:wp10:forbidden-payload",
      fileName: "EXP-2026-06-23-wp10-redacted.zip",
      fileSizeBytes: 1024,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const manifest = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      auditPersistenceAvailable: true,
      expiresAt: new Date("2026-06-30T00:00:00.000Z"),
      exportRequestId: "export:summit:wp10",
      externalShare: false,
      file,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "AI_DRAFT", "UNRELEASED_RECOMMENDATION"],
      redactionProfile: "external-limited",
      selectedObjectCount: 2,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(manifest.valid).toBe(false);
    expect(manifest.issues).toContain("forbidden_payload:AI_DRAFT");
    expect(manifest.issues).toContain("forbidden_payload:UNRELEASED_RECOMMENDATION");
  });
});
