import "dotenv/config";

import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { dataQualityService } from "../lib/data-quality-service";
import { demoTenants, type DemoTenantSlug } from "../lib/demo-session";

function tenantId(slug: DemoTenantSlug) {
  const tenant = demoTenants.find((candidate) => candidate.slug === slug);
  if (!tenant) throw new Error(`Unknown demo tenant: ${slug}`);
  return tenant.id;
}

test.describe("Phase 17 data quality service", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 17 data quality tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("blocks readiness when a tenant has open high-severity issues", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("northbridge"),
    });
    const gate = dataQualityService.evaluateDataQualityGate(snapshot);

    expect(snapshot.openIssueCount).toBeGreaterThan(0);
    expect(snapshot.highSeverityOpenCount).toBeGreaterThan(0);
    expect(snapshot.blocking).toBe(true);
    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("high_severity_data_quality_issues");
  });

  test("passes readiness when only completed issues remain open-filtered out", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("bennett"),
    });
    const gate = dataQualityService.evaluateDataQualityGate(snapshot);

    expect(snapshot.openIssueCount).toBe(0);
    expect(snapshot.highSeverityOpenCount).toBe(0);
    expect(snapshot.blocking).toBe(false);
    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
  });

  test("allows conditional release support when only non-high issues are open", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("summit"),
    });
    const gate = dataQualityService.evaluateDataQualityReleaseGate(snapshot);

    expect(snapshot.openIssueCount).toBeGreaterThan(0);
    expect(snapshot.highSeverityOpenCount).toBe(0);
    expect(gate.gateName).toBe("DATA_QUALITY_RELEASE_READY");
    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
  });
});
