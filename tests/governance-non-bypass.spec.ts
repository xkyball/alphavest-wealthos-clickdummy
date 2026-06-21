import "dotenv/config";

import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ObjectType, PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { runDemoWorkflowMutation } from "../lib/demo-workflow-mutation";
import { permissionEngine } from "../lib/permission-engine";
import { visibilityEngine } from "../lib/visibility-engine";

test.describe("MVP Phase 2 governance non-bypass permissions", () => {
  test("allows sensitive governance management while denying safety gate bypasses", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const security = createDemoSession({ roleKey: "security_officer", tenantSlug: "bennett" });
    const clientSuccess = createDemoSession({ roleKey: "client_success", tenantSlug: "bennett" });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });

    const governanceManage = permissionEngine.can(
      admin.actor,
      "MANAGE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(governanceManage.allowed).toBe(true);
    expect(governanceManage.requiresAudit).toBe(true);
    expect(governanceManage.requiresSecondConfirmation).toBe(true);

    const nonGovernanceManage = permissionEngine.can(
      clientSuccess.actor,
      "MANAGE",
      {
        clientTenantId: clientSuccess.tenant.id,
        objectType: "POLICY",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: clientSuccess.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      clientSuccess.role,
    );

    expect(nonGovernanceManage.allowed).toBe(false);
    expect(nonGovernanceManage.reasonCode).toBe("DEMO_DENY_GOVERNANCE_ROLE_REQUIRED");
    expect(nonGovernanceManage.requiresSecondConfirmation).toBe(true);

    const adminRelease = permissionEngine.can(
      admin.actor,
      "RELEASE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminRelease.allowed).toBe(false);
    expect(adminRelease.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(adminRelease.requiresAudit).toBe(true);
    expect(adminRelease.requiresSecondConfirmation).toBe(true);

    const adminEvidenceApproval = permissionEngine.can(
      admin.actor,
      "APPROVE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EVIDENCE_RECORD",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminEvidenceApproval.allowed).toBe(false);
    expect(adminEvidenceApproval.reasonCode).toBe("DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS");
    expect(adminEvidenceApproval.requiresAudit).toBe(true);
    expect(adminEvidenceApproval.requiresSecondConfirmation).toBe(true);

    const evidenceRecordId = "evidence:bennett:phase2-sufficiency";
    const complianceEvidenceApproval = permissionEngine.can(
      compliance.actor,
      "APPROVE",
      {
        clientTenantId: compliance.tenant.id,
        objectId: evidenceRecordId,
        objectType: "EVIDENCE_RECORD",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: compliance.tenant.id,
        objectScope: {
          clientTenantId: compliance.tenant.id,
          objectIds: [evidenceRecordId],
          objectType: "EVIDENCE_RECORD",
        },
        platformTenantId: demoPlatformTenantId,
      },
      compliance.role,
    );

    expect(complianceEvidenceApproval.allowed).toBe(true);
    expect(complianceEvidenceApproval.requiresComplianceReview).toBe(true);

    const securityVisibilityRelease = permissionEngine.can(
      security.actor,
      "RELEASE",
      {
        clientTenantId: security.tenant.id,
        objectType: "DECISION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: security.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      security.role,
    );

    expect(securityVisibilityRelease.allowed).toBe(false);
    expect(securityVisibilityRelease.reasonCode).toBe("DEMO_DENY_ADMIN_VISIBILITY_NON_BYPASS");
    expect(securityVisibilityRelease.requiresSecondConfirmation).toBe(true);

    const adminExport = permissionEngine.can(
      admin.actor,
      "EXPORT",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminExport.allowed).toBe(false);
    expect(adminExport.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(adminExport.requiresSecondConfirmation).toBe(true);

    const governedAccessAssignment = permissionEngine.can(
      security.actor,
      "ASSIGN",
      {
        clientTenantId: security.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: security.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      security.role,
    );

    expect(governedAccessAssignment.allowed).toBe(true);
    expect(governedAccessAssignment.requiresAudit).toBe(true);
    expect(governedAccessAssignment.requiresSecondConfirmation).toBe(true);
  });

  test("keeps admin and security roles out of internal advice payload visibility", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const security = createDemoSession({ roleKey: "security_officer", tenantSlug: "bennett" });

    for (const session of [admin, security]) {
      const projection = visibilityEngine.projectRecommendationPayload(
        session.actor,
        session.role,
        {
          assumptionsJson: { source: "phase-2" },
          clientSummary: "Released client-safe summary.",
          clientSummaryDraft: "Internal AI draft.",
          clientTenantId: session.tenant.id,
          clientVisible: false,
          complianceNotes: "Compliance-only note.",
          internalRationale: "Internal rationale.",
          recommendationStatus: "AI_DRAFT",
          sensitivity: "RESTRICTED",
          summaryInternal: "Internal analyst summary.",
          visibilityStatus: "ADVISOR_VISIBLE",
        },
        demoPlatformTenantId,
        session.tenant.id,
      );

      expect(projection.visible).toBe(false);
      expect(projection.reasonCode).toBe("DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS");
      expect(projection.payload).toEqual({});
      expect(projection.hiddenFields).toEqual(
        expect.arrayContaining([
          "clientSummary",
          "clientSummaryDraft",
          "summaryInternal",
          "internalRationale",
          "complianceNotes",
          "assumptionsJson",
        ]),
      );
    }
  });
});

test.describe("MVP Phase 2 governance non-bypass audit persistence", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 2 governance non-bypass tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("records denied audit and skips mutation when admin tries to force evidence sufficiency", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    let mutateCalled = false;

    const result = await runDemoWorkflowMutation(
      prisma,
      {
        actionId: "phase02.adminDeniedEvidenceSufficiency",
        actorRoleKey: "admin",
        clientTenantId: admin.tenant.id,
        eventType: "phase02.governance.denied_evidence_sufficiency",
        metadataJson: {
          phase: "02",
          proof: "admin_cannot_force_evidence_sufficiency",
        },
        nextState: "VALIDATED",
        permissionAction: "APPROVE",
        previousState: "LINKED",
        sensitivity: "RESTRICTED",
        targetId: demoPlatformTenantId,
        targetType: ObjectType.EVIDENCE_RECORD,
        tenantSlug: "bennett",
        visibilityStatus: "COMPLIANCE_VISIBLE",
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

    expect(audit?.actorRoleKey).toBe("admin");
    expect(audit?.result).toBe(AuditResult.DENIED);
    expect(audit?.previousState).toBe("LINKED");
    expect(audit?.nextState).toBe("LINKED");
    expect((audit?.metadataJson as { permission?: { reasonCode?: string } } | null)?.permission?.reasonCode).toBe(
      "DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS",
    );
  });
});
