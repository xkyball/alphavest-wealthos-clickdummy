import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test.describe("V0.96 WP-08 audit surface and persistence UI", () => {
  test("AuditTimeline separates persisted proof from display-only context by default", () => {
    const timelineSource = readFileSync("components/ui/audit-timeline.tsx", "utf8");

    expect(timelineSource).toContain('sourceState?: "display-only" | "pending" | "source-backed" | "unavailable"');
    expect(timelineSource).toContain('const sourceState = item.sourceState ?? "display-only"');
    expect(timelineSource).toContain('data-ux-audit-source={sourceState === "source-backed" ? "source-backed" : "display-only"}');
    expect(timelineSource).toContain('"Display-only context"');
    expect(timelineSource).toContain('"Audit recorded"');
  });

  test("compliance audit screen labels demo audit rows as display-only context", () => {
    const complianceScreenSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");

    expect(complianceScreenSource).toContain('testId="wp08-display-only-audit-state"');
    expect(complianceScreenSource).toContain("Compliance audit rows on this demo screen are display-only context");
    expect(complianceScreenSource).toContain("Persisted record is the DB-backed AuditEvent returned by the audited action or audit-history API");
    expect(complianceScreenSource).toContain("Audit visibility is not audit persistence");
  });

  test("audit API missing scope fails safely without disclosing hidden rows", async ({ request }) => {
    const response = await request.get("/api/audit-events");
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.auditEvents).toEqual([]);
    expect(body.safety).toMatchObject({
      failClosed: true,
      hiddenRowsDisclosed: false,
      scoped: false,
      silentStateAdvance: false,
    });
    expect(JSON.stringify(body)).not.toMatch(/metadataJson|complianceNotes|internalRationale|auditReason/);
  });

  test("source-backed audit rows are marked only by DB readmodels", () => {
    const dbtfSource = readFileSync("lib/dbtf-table-service.ts", "utf8");
    const exportReadmodelSource = readFileSync("lib/export-workflow-readmodel-service.ts", "utf8");

    expect(dbtfSource).toContain('sourceState: "source-backed"');
    expect(dbtfSource).toContain('source: "AlphaVest DB audit log"');
    expect(exportReadmodelSource).toContain('sourceState: "source-backed" as const');
  });
});
