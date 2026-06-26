import { test, expect } from "@playwright/test";

import { captureModelContextForRoute, captureScreenModelAuditBaseline } from "../lib/capture-screen-model-context";
import { screenRoutes } from "../lib/route-registry";

test.describe("normal screen capture model context", () => {
  test("keeps the capture baseline aligned with the latest capability audit", () => {
    expect(captureScreenModelAuditBaseline.registeredRoutes).toBe(71);
    expect(captureScreenModelAuditBaseline.schemaModels).toBe(53);
    expect(captureScreenModelAuditBaseline.schemaEnums).toBe(31);
    expect(screenRoutes).toHaveLength(captureScreenModelAuditBaseline.registeredRoutes);
  });

  test("annotates every normal screen route without stale complete-slice claims", () => {
    const contexts = screenRoutes.map((route) => captureModelContextForRoute(route));

    expect(contexts).toHaveLength(71);
    for (const context of contexts) {
      expect(context.models.length, `${context.route.pageId} ${context.route.path}`).toBeGreaterThan(0);
      expect(context.capability.status).not.toBe("COMPLETE_VERTICAL_SLICE");
      expect(JSON.stringify(context)).not.toContain('"schemaModels":49');
      expect(JSON.stringify(context)).not.toContain("49-model");
    }
  });

  test("marks export and document routes with their audited Prisma model spine", () => {
    const exportApprovalRoute = screenRoutes.find((route) => route.route === "/export/:id/approval");
    const documentUploadRoute = screenRoutes.find((route) => route.route === "/documents/upload");

    expect(exportApprovalRoute).toBeTruthy();
    expect(documentUploadRoute).toBeTruthy();

    const exportContext = captureModelContextForRoute(exportApprovalRoute!);
    expect(exportContext.capability.status).toBe("STRONG_VERTICAL_CANDIDATE");
    expect(exportContext.capability.apiEvidence).toContain("app/api/export-workflow/route.ts");
    expect(exportContext.models).toEqual(expect.arrayContaining(["ExportRequest", "AuditEvent", "EvidenceItem"]));

    const documentContext = captureModelContextForRoute(documentUploadRoute!);
    expect(documentContext.capability.status).toBe("STRONG_VERTICAL_CANDIDATE");
    expect(documentContext.models).toEqual(
      expect.arrayContaining(["Document", "DocumentVersion", "DocumentExtraction", "EvidenceRecord", "EvidenceItem", "AuditEvent"]),
    );
  });
});
