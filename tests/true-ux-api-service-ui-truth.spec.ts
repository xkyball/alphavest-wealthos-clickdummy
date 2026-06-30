import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

function readSource(path: string) {
  return readFileSync(path, "utf8");
}

test.describe("V0.96 WP-13 API/service integration for UI truth", () => {
  test("export workflow API and UI fail closed instead of treating demo fallback as proof", () => {
    const apiRoute = readSource("app/api/export-workflow/route.ts");
    const readModel = readSource("lib/export-workflow-readmodel-service.ts");
    const exportUi = readSource("components/communication-export-ops-screen.tsx");

    expect(apiRoute).toContain("failClosedJson");
    expect(apiRoute).toContain("noExportApproval");
    expect(apiRoute).toContain("noExportDownload");

    expect(readModel).toContain('apiRoute: "/api/export-workflow"');
    expect(readModel).toContain("fallbackDemoData: false");
    expect(readModel).toContain('source: "DB_READMODEL"');

    expect(exportUi).toContain("workflow13-export-api-truth-fail-closed");
    expect(exportUi).toContain("const scopeRows = apiUnavailable ? []");
    expect(exportUi).toContain('loadState === "error" ? []');
    expect(exportUi).toContain("no export approval, download, share, client acceptance or advice release is completed");
  });
});

test.describe("V0.96 WP-17 API/service integration catch-up", () => {
  test("core UI-facing API errors use the shared fail-closed envelope", () => {
    const documentRoute = readSource("app/api/documents/route.ts");
    const evidenceReviewRoute = readSource("app/api/documents/review/route.ts");
    const auditRoute = readSource("app/api/audit-events/route.ts");
    const exportRoute = readSource("app/api/export-workflow/route.ts");

    for (const source of [documentRoute, evidenceReviewRoute, auditRoute, exportRoute]) {
      expect(source).toContain("failClosedJson");
      expect(source).toContain("reasonCode");
    }

    expect(evidenceReviewRoute).toContain('reasonCode: "PERMISSION_DENIED"');
    expect(evidenceReviewRoute).toContain('reasonCode: "SCOPE_DENIED"');
    expect(auditRoute).toContain("valid_tenant_slug_required");
    expect(documentRoute).toContain("valid_role_key_required");
  });
});
