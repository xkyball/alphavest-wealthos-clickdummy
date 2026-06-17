import "dotenv/config";

import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ObjectType, PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  createDemoSession,
  demoPlatformTenantId,
  demoTenants,
  type DemoTenantSlug,
} from "../lib/demo-session";
import { runDemoWorkflowMutation } from "../lib/demo-workflow-mutation";
import { permissionEngine } from "../lib/permission-engine";

function tenantId(slug: DemoTenantSlug) {
  const tenant = demoTenants.find((candidate) => candidate.slug === slug);
  if (!tenant) throw new Error(`Unknown demo tenant: ${slug}`);
  return tenant.id;
}

test.describe("Phase 16 demo role-aware permissions", () => {
  test("denies cross-tenant access and non-compliance release", () => {
    const bennettPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const morganTenantId = tenantId("morgan");
    const bennettTenantId = tenantId("bennett");

    const crossTenantDecision = permissionEngine.can(
      bennettPrincipal.actor,
      "VIEW",
      {
        clientTenantId: morganTenantId,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      bennettPrincipal.role,
    );

    expect(crossTenantDecision.allowed).toBe(false);
    expect(crossTenantDecision.reasonCode).toBe("DEMO_DENY_CROSS_TENANT");
    expect(crossTenantDecision.requiresAudit).toBe(true);

    const principalReleaseDecision = permissionEngine.can(
      bennettPrincipal.actor,
      "RELEASE",
      {
        clientTenantId: bennettTenantId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      bennettPrincipal.role,
    );

    expect(principalReleaseDecision.allowed).toBe(false);
    expect(principalReleaseDecision.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(principalReleaseDecision.requiresSecondConfirmation).toBe(true);

    const complianceSession = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const complianceReleaseDecision = permissionEngine.can(
      complianceSession.actor,
      "RELEASE",
      {
        clientTenantId: bennettTenantId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(complianceReleaseDecision.allowed).toBe(true);
    expect(complianceReleaseDecision.reasonCode).toBe("DEMO_ROLE_AWARE_ALLOW");
    expect(complianceReleaseDecision.requiresComplianceReview).toBe(true);
  });

  test("denies forbidden export and internal-only object access roles", () => {
    const northbridgeTenantId = tenantId("northbridge");
    const externalAdvisor = createDemoSession({
      roleKey: "external_advisor",
      tenantSlug: "northbridge",
    });
    const nextGen = createDemoSession({ roleKey: "next_gen", tenantSlug: "northbridge" });

    const exportDecision = permissionEngine.can(
      externalAdvisor.actor,
      "EXPORT",
      {
        clientTenantId: northbridgeTenantId,
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        clientTenantId: northbridgeTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      externalAdvisor.role,
    );

    expect(exportDecision.allowed).toBe(false);
    expect(exportDecision.reasonCode).toBe("DEMO_DENY_EXPORT_ROLE_FORBIDDEN");

    const internalDocumentDecision = permissionEngine.can(
      nextGen.actor,
      "VIEW",
      {
        clientTenantId: northbridgeTenantId,
        objectType: "DOCUMENT",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: northbridgeTenantId,
        clientVisibilityState: "INTERNAL_ONLY",
        platformTenantId: demoPlatformTenantId,
      },
      nextGen.role,
    );

    expect(internalDocumentDecision.allowed).toBe(false);
    expect(internalDocumentDecision.reasonCode).toBe("DEMO_DENY_INTERNAL_OBJECT_ACCESS");
  });
});

test.describe("Phase 16 demo workflow deny audit", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 16 permission tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("records a denied audit and skips mutation when a principal tries to release", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    let mutateCalled = false;
    const bennettTenantId = tenantId("bennett");

    const result = await runDemoWorkflowMutation(
      prisma,
      {
        actionId: "phase16.principalDeniedRelease",
        actorRoleKey: "principal",
        clientTenantId: bennettTenantId,
        eventType: "phase16.permission.denied_release",
        metadataJson: {
          phase: "16",
          proof: "principal_cannot_release_recommendation",
        },
        nextState: "CLIENT_VISIBLE",
        permissionAction: "RELEASE",
        previousState: "COMPLIANCE_PENDING",
        sensitivity: "RESTRICTED",
        targetId: demoPlatformTenantId,
        targetType: ObjectType.RECOMMENDATION,
        tenantSlug: "bennett",
        visibilityStatus: "COMPLIANCE_VISIBLE",
        workflowState: "COMPLIANCE_PENDING",
      },
      async () => {
        mutateCalled = true;
        return { mutated: true };
      },
    );

    expect(mutateCalled).toBe(false);
    expect(result.permission.allowed).toBe(false);
    expect(result.auditRows).toBe(1);

    const audit = await prisma.auditEvent.findUnique({
      where: { id: result.auditEventId },
    });

    expect(audit?.result).toBe(AuditResult.DENIED);
    expect(audit?.previousState).toBe("COMPLIANCE_PENDING");
    expect(audit?.nextState).toBe("COMPLIANCE_PENDING");
    expect(audit?.actorRoleKey).toBe("principal");
    expect(audit?.reason).toContain("Compliance Officer");
    expect((audit?.metadataJson as { permission?: { reasonCode?: string } } | null)?.permission?.reasonCode).toBe(
      "DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED",
    );
  });
});
