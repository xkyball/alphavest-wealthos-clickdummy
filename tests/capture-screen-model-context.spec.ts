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
    expect(documentContext.capability.apiEvidence).toContain("app/api/data-maintenance/actions/route.ts");
    expect(documentContext.capability.serviceEvidence).toContain("lib/data-maintenance-workflow-actions.ts");
    expect(documentContext.models).toEqual(
      expect.arrayContaining(["Document", "DocumentVersion", "DocumentExtraction", "EvidenceRecord", "EvidenceItem", "AuditEvent"]),
    );
  });

  test("keeps data-maintenance captures tied to typed commands instead of demo workflow", () => {
    const clientRoutes = screenRoutes.filter((route) => route.navigationGroup === "client_workspace");
    const wealthRoutes = screenRoutes.filter((route) => route.navigationGroup === "wealth_actions");

    expect(clientRoutes.length).toBeGreaterThan(0);
    expect(wealthRoutes.length).toBeGreaterThan(0);

    for (const route of [...clientRoutes, ...wealthRoutes]) {
      const context = captureModelContextForRoute(route);
      expect(context.capability.apiEvidence).toContain("app/api/data-maintenance/actions/route.ts");
      expect(context.capability.serviceEvidence).toContain("lib/data-maintenance-workflow-actions.ts");
      expect(context.warnings.join(" ")).toContain("data-maintenance");
    }
  });

  test("keeps tenant and governance captures tied to typed tenant-governance commands", () => {
    const tenantUsersRoute = screenRoutes.find((route) => route.pageId === "018");
    const governanceRoleRoute = screenRoutes.find((route) => route.pageId === "049");
    const accessApprovalRoute = screenRoutes.find((route) => route.pageId === "050");
    const auditExportRoute = screenRoutes.find((route) => route.pageId === "051");

    expect(tenantUsersRoute).toBeTruthy();
    expect(governanceRoleRoute).toBeTruthy();
    expect(accessApprovalRoute).toBeTruthy();
    expect(auditExportRoute).toBeTruthy();

    for (const route of [tenantUsersRoute!, governanceRoleRoute!, accessApprovalRoute!, auditExportRoute!]) {
      const context = captureModelContextForRoute(route);
      expect(context.capability.apiEvidence).toContain("app/api/tenant-governance/actions/route.ts");
      expect(context.capability.serviceEvidence).toContain("lib/tenant-governance-workflow-actions.ts");
      expect(context.warnings.join(" ")).toContain("tenant-governance");
    }
  });

  test("keeps platform admin captures tied to typed platform-admin commands", () => {
    const platformRoute = screenRoutes.find((route) => route.pageId === "007");
    const securityRoute = screenRoutes.find((route) => route.pageId === "010");

    expect(platformRoute).toBeTruthy();
    expect(securityRoute).toBeTruthy();

    for (const route of [platformRoute!, securityRoute!]) {
      const context = captureModelContextForRoute(route);
      expect(context.capability.apiEvidence).toContain("app/api/platform-admin/actions/route.ts");
      expect(context.capability.serviceEvidence).toContain("lib/platform-admin-workflow-actions.ts");
      expect(context.warnings.join(" ")).toContain("platform-admin");
    }
  });
});
