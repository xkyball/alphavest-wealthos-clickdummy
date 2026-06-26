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
import { AuditPersistenceUnavailableError, runDemoWorkflowMutation } from "../lib/typed-workflow-command-bus";
import { permissionEngine } from "../lib/permission-engine";
import { visibilityEngine } from "../lib/visibility-engine";

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
    const recommendationId = "recommendation:bennett:phase2-release";
    const complianceReleaseDecision = permissionEngine.can(
      complianceSession.actor,
      "RELEASE",
      {
        clientTenantId: bennettTenantId,
        objectId: recommendationId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        objectScope: {
          clientTenantId: bennettTenantId,
          objectIds: [recommendationId],
          objectType: "RECOMMENDATION",
        },
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(complianceReleaseDecision.allowed).toBe(true);
    expect(complianceReleaseDecision.reasonCode).toBe("DEMO_ROLE_AWARE_ALLOW");
    expect(complianceReleaseDecision.requiresComplianceReview).toBe(true);
  });

  test("requires explicit object target and scope before route access becomes mutation authority", () => {
    const complianceSession = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const recommendationId = "recommendation:bennett:phase2-scoped-release";

    const routeShellDecision = permissionEngine.can(
      complianceSession.actor,
      "VIEW",
      {
        clientTenantId: complianceSession.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: complianceSession.tenant.id,
        clientVisibilityState: "COMPLIANCE_VISIBLE",
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(routeShellDecision.allowed).toBe(true);

    const missingTargetRelease = permissionEngine.can(
      complianceSession.actor,
      "RELEASE",
      {
        clientTenantId: complianceSession.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: complianceSession.tenant.id,
        clientVisibilityState: "COMPLIANCE_VISIBLE",
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(missingTargetRelease.allowed).toBe(false);
    expect(missingTargetRelease.reasonCode).toBe("DEMO_DENY_OBJECT_TARGET_REQUIRED");

    const scopedRelease = permissionEngine.can(
      complianceSession.actor,
      "RELEASE",
      {
        clientTenantId: complianceSession.tenant.id,
        objectId: recommendationId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: complianceSession.tenant.id,
        clientVisibilityState: "COMPLIANCE_VISIBLE",
        objectScope: {
          clientTenantId: complianceSession.tenant.id,
          objectIds: [recommendationId],
          objectType: "RECOMMENDATION",
        },
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(scopedRelease.allowed).toBe(true);
    expect(scopedRelease.reasonCode).toBe("DEMO_ROLE_AWARE_ALLOW");
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

  test("keeps advisor approval and admin export bypass separated from route access", () => {
    const bennettTenantId = tenantId("bennett");
    const adminSession = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const advisorSession = createDemoSession({ roleKey: "senior_wealth_advisor", tenantSlug: "bennett" });

    const adminApprovalDecision = permissionEngine.can(
      adminSession.actor,
      "APPROVE",
      {
        clientTenantId: bennettTenantId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      adminSession.role,
    );

    expect(adminApprovalDecision.allowed).toBe(false);
    expect(adminApprovalDecision.reasonCode).toBe("DEMO_DENY_ADVISOR_APPROVAL_REQUIRED");

    const advisorApprovalDecision = permissionEngine.can(
      advisorSession.actor,
      "APPROVE",
      {
        clientTenantId: bennettTenantId,
        objectId: "recommendation:bennett:advisor-approval",
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        objectScope: {
          clientTenantId: bennettTenantId,
          objectIds: ["recommendation:bennett:advisor-approval"],
          objectType: "RECOMMENDATION",
        },
        platformTenantId: demoPlatformTenantId,
      },
      advisorSession.role,
    );

    expect(advisorApprovalDecision.allowed).toBe(true);
    expect(advisorApprovalDecision.requiresAudit).toBe(true);

    const adminExportDecision = permissionEngine.can(
      adminSession.actor,
      "EXPORT",
      {
        clientTenantId: bennettTenantId,
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        clientTenantId: bennettTenantId,
        platformTenantId: demoPlatformTenantId,
      },
      adminSession.role,
    );

    expect(adminExportDecision.allowed).toBe(false);
    expect(adminExportDecision.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(adminExportDecision.requiresSecondConfirmation).toBe(true);
  });

  test("projects only released client-safe recommendation fields to client roles", () => {
    const bennettPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const adminSession = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const clientSuccess = createDemoSession({ roleKey: "client_success", tenantSlug: "bennett" });
    const internalPayload = {
      assumptionsJson: { source: "rules-draft" },
      clientSummary: "Released client-safe summary.",
      clientSummaryDraft: "AI generated draft summary.",
      clientTenantId: bennettPrincipal.tenant.id,
      clientVisible: true,
      complianceNotes: "Compliance-only reviewer notes.",
      internalRationale: "Internal recommendation rationale.",
      recommendationStatus: "RELEASED_TO_CLIENT" as const,
      sensitivity: "RESTRICTED" as const,
      summaryInternal: "Analyst-only working summary.",
      visibilityStatus: "CLIENT_VISIBLE" as const,
    };

    const clientProjection = visibilityEngine.projectRecommendationPayload(
      bennettPrincipal.actor,
      bennettPrincipal.role,
      internalPayload,
      demoPlatformTenantId,
      bennettPrincipal.tenant.id,
    );

    expect(clientProjection.visible).toBe(true);
    expect(clientProjection.reasonCode).toBe("DEMO_CLIENT_SAFE_PROJECTION");
    expect(clientProjection.payload).toEqual({ clientSummary: "Released client-safe summary." });
    expect(clientProjection.hiddenFields).toEqual([
      "clientSummaryDraft",
      "summaryInternal",
      "internalRationale",
      "complianceNotes",
      "assumptionsJson",
    ]);

    const aiDraftProjection = visibilityEngine.projectRecommendationPayload(
      bennettPrincipal.actor,
      bennettPrincipal.role,
      {
        ...internalPayload,
        clientVisible: false,
        recommendationStatus: "AI_DRAFT",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      demoPlatformTenantId,
      bennettPrincipal.tenant.id,
    );

    expect(aiDraftProjection.visible).toBe(false);
    expect(aiDraftProjection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(aiDraftProjection.payload).toEqual({});

    const internalProjection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      {
        ...internalPayload,
        clientVisible: false,
        recommendationStatus: "AI_DRAFT",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      demoPlatformTenantId,
      analyst.tenant.id,
    );

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.reasonCode).toBe("DEMO_INTERNAL_PROJECTION");
    expect(internalProjection.payload.clientSummaryDraft).toBe("AI generated draft summary.");
    expect(internalProjection.payload.internalRationale).toBe("Internal recommendation rationale.");

    const adminInternalProjection = visibilityEngine.projectRecommendationPayload(
      adminSession.actor,
      adminSession.role,
      {
        ...internalPayload,
        clientVisible: false,
        recommendationStatus: "AI_DRAFT",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      demoPlatformTenantId,
      adminSession.tenant.id,
    );

    expect(adminInternalProjection.visible).toBe(false);
    expect(adminInternalProjection.reasonCode).toBe("DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS");
    expect(adminInternalProjection.payload).toEqual({});
    expect(adminInternalProjection.hiddenFields).toEqual([
      "clientSummary",
      "clientSummaryDraft",
      "summaryInternal",
      "internalRationale",
      "complianceNotes",
      "assumptionsJson",
    ]);

    const clientSuccessProjection = visibilityEngine.projectRecommendationPayload(
      clientSuccess.actor,
      clientSuccess.role,
      {
        ...internalPayload,
        clientVisible: false,
        recommendationStatus: "COMPLIANCE_PENDING",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      demoPlatformTenantId,
      clientSuccess.tenant.id,
    );

    expect(clientSuccessProjection.visible).toBe(false);
    expect(clientSuccessProjection.reasonCode).toBe("DEMO_DENY_ADVICE_PAYLOAD_SCOPE_REQUIRED");
    expect(clientSuccessProjection.payload).toEqual({});
  });

  test("does not let admin or client-success route access become internal advice payload permission", () => {
    const bennettTenantId = tenantId("bennett");
    const adminSession = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const securitySession = createDemoSession({ roleKey: "security_officer", tenantSlug: "bennett" });
    const clientSuccess = createDemoSession({ roleKey: "client_success", tenantSlug: "bennett" });
    const complianceSession = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });

    for (const session of [adminSession, securitySession]) {
      const decision = permissionEngine.can(
        session.actor,
        "VIEW",
        {
          clientTenantId: bennettTenantId,
          objectType: "RECOMMENDATION",
          sensitivity: "RESTRICTED",
          visibilityStatus: "ADVISOR_VISIBLE",
        },
        {
          clientTenantId: bennettTenantId,
          clientVisibilityState: "ADVISOR_VISIBLE",
          platformTenantId: demoPlatformTenantId,
        },
        session.role,
      );

      expect(decision.allowed).toBe(false);
      expect(decision.reasonCode).toBe("DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS");
      expect(decision.requiresSecondConfirmation).toBe(true);
    }

    const clientSuccessDecision = permissionEngine.can(
      clientSuccess.actor,
      "VIEW",
      {
        clientTenantId: bennettTenantId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        clientVisibilityState: "COMPLIANCE_VISIBLE",
        platformTenantId: demoPlatformTenantId,
      },
      clientSuccess.role,
    );

    expect(clientSuccessDecision.allowed).toBe(false);
    expect(clientSuccessDecision.reasonCode).toBe("DEMO_DENY_ADVICE_PAYLOAD_SCOPE_REQUIRED");

    const complianceDecision = permissionEngine.can(
      complianceSession.actor,
      "VIEW",
      {
        clientTenantId: bennettTenantId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: bennettTenantId,
        clientVisibilityState: "COMPLIANCE_VISIBLE",
        platformTenantId: demoPlatformTenantId,
      },
      complianceSession.role,
    );

    expect(complianceDecision.allowed).toBe(true);
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

  test("fails closed before mutation when required audit persistence is unavailable", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    let mutateCalled = false;
    const bennettTenantId = tenantId("bennett");

    await expect(
      runDemoWorkflowMutation(
        prisma,
        {
          actionId: "phase06.auditUnavailableRelease",
          actorRoleKey: "compliance_officer",
          auditPersistenceAvailable: false,
          clientTenantId: bennettTenantId,
          eventType: "phase06.audit.unavailable_release",
          metadataJson: {
            phase: "06",
            proof: "audit_unavailable_fails_closed",
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
      ),
    ).rejects.toThrow(AuditPersistenceUnavailableError);

    expect(mutateCalled).toBe(false);
  });
});
