import { expect, test } from "@playwright/test";

import { createActorSession, actorPlatformTenantId } from "../lib/actor-session";
import { exportPackageService } from "../lib/export-package-service";
import { exportService } from "../lib/export-service";
import { fileMetadataService } from "../lib/file-metadata-service";

test.describe("Stage 18 file metadata realism", () => {
  test("prepares deterministic document upload metadata", () => {
    const metadata = fileMetadataService.prepareFileMetadata({
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
    expect(metadata.storageKey).toContain("tenants/morgan/documents/");
    expect(metadata.storageKey).toContain("morgan-tax-residency-2026.pdf");
  });

  test("rejects unsafe or unsupported file metadata", () => {
    const metadata = fileMetadataService.prepareFileMetadata({
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

test.describe("Stage 18 export package manifest", () => {
  test("builds a validated metadata-only export package manifest", () => {
    const file = fileMetadataService.prepareFileMetadata({
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
      auditPersistenceAvailable: true,
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
    expect(result.manifest.manifestVersion).toBe("2026.06.first-build-stage7");
    expect(result.manifest.realBinaryGenerated).toBe(false);
    expect(result.manifest.controls.approved).toBe(true);
    expect(result.manifest.controls.auditPersistenceConfirmed).toBe(true);
    expect(result.manifest.controls.lifecycle.stage).toBe("generated");
    expect(result.manifest.controls.lifecycle.approved).toBe(true);
    expect(result.manifest.controls.lifecycle.downloaded).toBe(false);
    expect(result.manifest.controls.lifecycle.allowedNextActions).toEqual(["download"]);
    expect(result.manifest.controls.payloadClassifications).toEqual([]);
    expect(result.manifest.controls.forbiddenPayloads).toEqual([]);
    expect(result.manifest.controls.watermark).toBe(true);
    expect(result.manifest.storageKey).toBe(file.storageKey);
  });

  test("blocks export package generation without approval, zip format and watermark", () => {
    const file = fileMetadataService.prepareFileMetadata({
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
      auditPersistenceAvailable: false,
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
    expect(result.issues).toContain("audit_persistence_required_before_generation");
    expect(result.issues).toContain("redaction_profile_required");
    expect(result.issues).toContain("selected_export_objects_required");
    expect(result.issues).toContain("watermark_required");
  });

  test("blocks forbidden internal payload classifications in client-safe exports", () => {
    const file = fileMetadataService.prepareFileMetadata({
      category: "exports",
      checksumSeed: "summit:export-package:forbidden-payload",
      fileName: "EXP-2026-06-16-0087-redacted.zip",
      fileSizeBytes: 9123840,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const result = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      auditPersistenceAvailable: true,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      externalShare: false,
      file,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "AI_DRAFT", "COMPLIANCE_NOTES", "UNRELEASED_EVIDENCE"],
      redactionProfile: "external-limited",
      selectedObjectCount: 3,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("forbidden_payload:AI_DRAFT");
    expect(result.issues).toContain("forbidden_payload:COMPLIANCE_NOTES");
    expect(result.issues).toContain("forbidden_payload:UNRELEASED_EVIDENCE");
    expect(result.manifest.controls.payloadClassifications).toEqual([
      "CLIENT_SAFE_SUMMARY",
      "AI_DRAFT",
      "COMPLIANCE_NOTES",
      "UNRELEASED_EVIDENCE",
    ]);
    expect(result.manifest.controls.forbiddenPayloads).toEqual([
      "AI_DRAFT",
      "COMPLIANCE_NOTES",
      "UNRELEASED_EVIDENCE",
    ]);
  });

  test("classifies forbidden client/export payload fields before package generation", () => {
    const inspection = exportService.inspectClientExportPayload({
      clientSummary: "Released client-safe summary.",
      complianceNotes: "Internal compliance-only review note.",
      evidenceRecordId: "evidence:summit:unreleased",
      internalRationale: "Internal model rationale.",
    });

    expect(inspection.clean).toBe(false);
    expect(inspection.forbiddenFields).toEqual(["complianceNotes", "evidenceRecordId", "internalRationale"]);
    expect(inspection.missing).toEqual([
      "forbidden_projection_field:complianceNotes",
      "forbidden_projection_field:evidenceRecordId",
      "forbidden_projection_field:internalRationale",
    ]);
    expect(inspection.payloadClassifications).toEqual([
      "CLIENT_SAFE_SUMMARY",
      "COMPLIANCE_NOTES",
      "UNRELEASED_EVIDENCE",
      "INTERNAL_RATIONALE",
    ]);

    const blockedProjection = exportService.canUseClientProjectionForExport({
      payload: {
        clientSummary: "Released client-safe summary.",
        complianceNotes: "Internal compliance-only review note.",
      },
      visible: true,
    });

    expect(blockedProjection.allowed).toBe(false);
    expect(blockedProjection.missing).toContain("forbidden_projection_field:complianceNotes");
    expect(blockedProjection.payloadClassifications).toEqual(["CLIENT_SAFE_SUMMARY", "COMPLIANCE_NOTES"]);
  });

  test("keeps export preview separate from approval and download/share", () => {
    const session = createActorSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const gate = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: false,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      externalShare: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: actorPlatformTenantId,
      redactionProfile: "external-limited",
      role: session.role,
      targetId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      targetType: "EXPORT_REQUEST",
    });

    expect(gate.allowedToGenerate).toBe(false);
    expect(gate.status).toBe("APPROVAL_REQUIRED");
    expect(gate.missing).toContain("approval");
    expect(gate.missing).toContain("external_share_approval");
  });

  test("blocks export generation when no object-scoped export request is selected", () => {
    const session = createActorSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const gate = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: actorPlatformTenantId,
      redactionProfile: "external-limited",
      role: session.role,
      targetType: "EXPORT_REQUEST",
    });

    expect(gate.allowedToGenerate).toBe(false);
    expect(gate.missing).toContain("permission");
    expect(gate.missing).toContain("selected_export_request");
    expect(gate.reason).toBe("Export remains gated until missing controls are complete.");
  });

  test("blocks export generation when audit persistence is unavailable", () => {
    const session = createActorSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const gate = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: false,
      clientTenantId: session.tenant.id,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: actorPlatformTenantId,
      redactionProfile: "external-limited",
      role: session.role,
      targetId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      targetType: "EXPORT_REQUEST",
    });

    expect(gate.allowedToGenerate).toBe(false);
    expect(gate.missing).toContain("audit_persistence");
  });

  test("blocks export generation when data quality release gate fails", () => {
    const session = createActorSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const gate = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      dataQualityGate: {
        gateName: "DATA_QUALITY_RELEASE_READY",
        missing: ["high_severity_data_quality_issues"],
        passed: false,
      },
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: actorPlatformTenantId,
      redactionProfile: "external-limited",
      role: session.role,
      targetId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      targetType: "EXPORT_REQUEST",
    });

    expect(gate.allowedToGenerate).toBe(false);
    expect(gate.status).toBe("APPROVAL_REQUIRED");
    expect(gate.missing).toContain("data_quality_release_ready");
    expect(gate.missing).toContain("high_severity_data_quality_issues");
  });

  test("filters selected export scope by object access and forbidden payloads", () => {
    const decision = exportService.evaluateExportScope([
      {
        access: "Allowed",
        id: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
        name: "Client-safe recommendation summary",
        payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
        selected: true,
        type: "recommendation",
      },
      {
        access: "Limited",
        id: "1c62e3e3-6a6f-5a44-81d8-fbe3f6f7c101",
        name: "Released evidence summary",
        payloadClassifications: ["RELEASED_EVIDENCE_SUMMARY"],
        selected: true,
        type: "evidence_record",
      },
      {
        access: "Restricted",
        id: "2c62e3e3-6a6f-5a44-81d8-fbe3f6f7c102",
        name: "Internal advisor rationale",
        payloadClassifications: ["INTERNAL_RATIONALE"],
        selected: true,
        type: "advice_note",
      },
      {
        access: "Allowed",
        id: "3c62e3e3-6a6f-5a44-81d8-fbe3f6f7c103",
        name: "Unreleased compliance evidence",
        payloadClassifications: ["UNRELEASED_EVIDENCE"],
        selected: true,
        type: "evidence_item",
      },
    ]);

    expect(decision.valid).toBe(false);
    expect(decision.allowedSelectedCount).toBe(2);
    expect(decision.includedItems.map((item) => item.name)).toEqual([
      "Client-safe recommendation summary",
      "Released evidence summary",
    ]);
    expect(decision.blockedItems).toEqual([
      {
        id: "2c62e3e3-6a6f-5a44-81d8-fbe3f6f7c102",
        name: "Internal advisor rationale",
        reason: "restricted_object",
      },
      {
        id: "3c62e3e3-6a6f-5a44-81d8-fbe3f6f7c103",
        name: "Unreleased compliance evidence",
        reason: "forbidden_payload:UNRELEASED_EVIDENCE",
      },
    ]);
    expect(decision.missing).toContain("blocked_or_forbidden_scope_items");
  });

  test("keeps approval, generation, download and share as separate export steps", () => {
    const previewOnly = exportService.evaluateExportStepSeparation({
      approved: false,
      downloaded: false,
      generated: false,
      previewed: true,
      shared: false,
    });

    expect(previewOnly.canApprove).toBe(true);
    expect(previewOnly.canGenerate).toBe(false);
    expect(previewOnly.canDownload).toBe(false);
    expect(previewOnly.canShare).toBe(false);
    expect(previewOnly.stage).toBe("preview");
    expect(previewOnly.allowedNextActions).toEqual(["approve"]);
    expect(previewOnly.missing).toEqual([
      "approval_required_before_generation",
      "generation_required_before_download",
      "download_required_before_share",
    ]);

    const generatedButNotDownloaded = exportService.evaluateExportStepSeparation({
      approved: true,
      downloaded: false,
      generated: true,
      previewed: true,
      shared: false,
    });

    expect(generatedButNotDownloaded.canDownload).toBe(true);
    expect(generatedButNotDownloaded.canShare).toBe(false);
    expect(generatedButNotDownloaded.stage).toBe("generated");
    expect(generatedButNotDownloaded.allowedNextActions).toEqual(["download"]);
    expect(generatedButNotDownloaded.missing).toEqual(["download_required_before_share"]);

    const downloaded = exportService.evaluateExportStepSeparation({
      approved: true,
      downloaded: true,
      generated: true,
      previewed: true,
      shared: false,
    });

    expect(downloaded.canShare).toBe(true);
    expect(downloaded.stage).toBe("downloaded");
    expect(downloaded.allowedNextActions).toEqual(["share"]);
    expect(downloaded.missing).toEqual([]);
  });

  test("records approval without collapsing approved, generated, downloaded and shared stages", () => {
    const file = fileMetadataService.prepareFileMetadata({
      category: "exports",
      checksumSeed: "summit:export-package:approval-stage",
      fileName: "EXP-2026-06-16-0087-redacted.zip",
      fileSizeBytes: 9123840,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const result = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      auditPersistenceAvailable: true,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      externalShare: false,
      file,
      packageStage: "approved",
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
      redactionProfile: "external-limited",
      selectedObjectCount: 3,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(result.valid).toBe(true);
    expect(result.manifest.controls.packageStage).toBe("approved");
    expect(result.manifest.controls.lifecycle).toMatchObject({
      approved: true,
      downloaded: false,
      generated: false,
      previewed: true,
      shared: false,
      stage: "approved",
    });
    expect(result.manifest.controls.lifecycle.allowedNextActions).toEqual(["generate"]);
  });

  test("requires explicit external share stage controls in package manifests", () => {
    const file = fileMetadataService.prepareFileMetadata({
      category: "exports",
      checksumSeed: "summit:export-package:share-stage",
      fileName: "EXP-2026-06-16-0087-redacted.zip",
      fileSizeBytes: 9123840,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const result = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      auditPersistenceAvailable: true,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
      externalShare: false,
      file,
      packageStage: "shared",
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      redactionProfile: "external-limited",
      selectedObjectCount: 3,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("external_share_required_for_share_stage");
    expect(result.manifest.controls.packageStage).toBe("shared");
    expect(result.manifest.realBinaryGenerated).toBe(false);
  });
});
