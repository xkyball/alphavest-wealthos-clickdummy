import { expect, test } from "@playwright/test";

import { evaluateExportSafety } from "../lib/control-layer/export-safety";
import { controlLayerActors, safeExportFile } from "./fixtures/control-layer-fixtures";

test.describe("WCL WS-07 export safety", () => {
  test("allows generation only after scope, redaction, approval, audit and package controls align", () => {
    const result = evaluateExportSafety({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      packageInput: {
        approvalRequired: true,
        approved: true,
        auditPersistenceAvailable: true,
        expiresAt: new Date("2026-06-30T00:00:00.000Z"),
        exportRequestId: "export:summit:wcl-safe",
        externalShare: false,
        file: safeExportFile,
        payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
        redactionProfile: "client-safe-redacted",
        selectedObjectCount: 2,
        tenantSlug: "summit",
        watermark: true,
      },
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
      redactionProfile: "client-safe-redacted",
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:wcl-safe",
          name: "Released recommendation",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:wcl-safe",
    });

    expect(result.status).toBe("EXPORT_ALLOWED");
    expect(result.exportGate.allowedToGenerate).toBe(true);
    expect(result.packageResult?.valid).toBe(true);
    expect(result.lifecycle.canDownload).toBe(false);
  });

  test("blocks forbidden internal payload and preview-only export generation", () => {
    const result = evaluateExportSafety({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: false,
      auditPersistenceAvailable: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES"],
      redactionProfile: "client-safe-redacted",
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:wcl-unsafe",
          name: "Internal draft",
          payloadClassifications: ["AI_DRAFT", "INTERNAL_RATIONALE"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:wcl-unsafe",
    });

    expect(result.status).toBe("EXPORT_BLOCKED");
    expect(result.scopeDecision.missing).toContain("blocked_or_forbidden_scope_items");
    expect(result.exportGate.missing).toContain("approval");
    expect(result.exportGate.missing).toContain("forbidden_payload:AI_DRAFT");
    expect(result.exportGate.missing).toContain("forbidden_payload:INTERNAL_RATIONALE");
    expect(result.exportGate.missing).toContain("forbidden_payload:COMPLIANCE_NOTES");
  });

  test("blocks export generation when redaction profile is omitted", () => {
    const result = evaluateExportSafety({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:wcl-redaction-required",
          name: "Released recommendation",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:wcl-redaction-required",
    });

    expect(result.status).toBe("EXPORT_BLOCKED");
    expect(result.exportGate.allowedToGenerate).toBe(false);
    expect(result.exportGate.missing).toContain("redaction_profile");
  });
});
