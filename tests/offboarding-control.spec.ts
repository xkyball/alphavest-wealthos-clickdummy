import { expect, test } from "@playwright/test";

import { evaluateOffboardingControl } from "../lib/control-layer/offboarding-service";
import { controlLayerActors, safeExportFile } from "./fixtures/control-layer-fixtures";

test.describe("WCL WS-09 offboarding control contracts", () => {
  test("prepares spec-level offboarding control with residual access denial and safe final export", () => {
    const result = evaluateOffboardingControl({
      actorContext: controlLayerActors.summitCompliance,
      affectedUserIds: ["user:summit:external-advisor"],
      auditCorrelationId: "offboarding:summit:2026-06-21",
      finalExportPackage: {
        approvalRequired: true,
        approved: true,
        auditPersistenceAvailable: true,
        expiresAt: new Date("2026-06-30T00:00:00.000Z"),
        exportRequestId: "export:summit:offboarding",
        externalShare: false,
        file: safeExportFile,
        payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
        redactionProfile: "offboarding-redacted",
        selectedObjectCount: 1,
        tenantSlug: "summit",
        watermark: true,
      },
      finalExportScopeItems: [
        {
          access: "Allowed",
          id: "decision:summit:released",
          name: "Released decision",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "decision",
        },
      ],
      legalHoldFlag: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      retentionPolicy: "wealthos_retention_7y",
    });

    expect(result.status).toBe("OFFBOARDING_CONTROL_READY");
    expect(result.residualAccessDenied).toBe(true);
    expect(result.retentionApplied).toBe(true);
    expect(result.legalHoldApplied).toBe(true);
    expect(result.finalExport).toBe("READY");
  });

  test("blocks offboarding final export when retention, audit or export controls are missing", () => {
    const result = evaluateOffboardingControl({
      actorContext: controlLayerActors.summitCompliance,
      affectedUserIds: [],
      finalExportScopeItems: [
        {
          access: "Allowed",
          id: "decision:summit:internal",
          name: "Internal closure note",
          payloadClassifications: ["INTERNAL_RATIONALE"],
          selected: true,
          type: "decision",
        },
      ],
      payloadClassifications: ["INTERNAL_RATIONALE"],
    });

    expect(result.status).toBe("OFFBOARDING_CONTROL_BLOCKED");
    expect(result.missing).toContain("affected_users");
    expect(result.missing).toContain("retention_policy");
    expect(result.missing).toContain("audit_correlation_id");
    expect(result.missing).toContain("final_export_safety");
    expect(result.finalExport).toBe("BLOCKED");
  });
});
