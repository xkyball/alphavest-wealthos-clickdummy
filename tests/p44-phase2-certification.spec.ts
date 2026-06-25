import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";
import { AuditResult } from "@prisma/client";

import {
  assignP44TeamMember,
  createP44ClientTenant,
  createP44PolicyVersion,
  getP44Phase2Certification,
  P44Phase2PermissionError,
  P44Phase2ValidationError,
  requireP44EffectivePolicy,
  updateP44PlatformSetting,
  updateP44SecurityConfiguration,
} from "../lib/p44-phase2-admin-foundation";
import { demoTenants } from "../lib/demo-session";
import { prismaClient } from "../lib/prisma";

const prisma = prismaClient();

test.describe("P44 Phase 2 client context admin foundation certification", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("P44-2-T01 creates a client tenant draft and rejects duplicate or invalid creation", async () => {
    const displayName = `P44 Phase 2 Tenant ${Date.now()}`;
    const created = await createP44ClientTenant(prisma, {
      actorRoleKey: "admin",
      displayName,
      jurisdiction: "South Africa",
      relationshipTier: "Signature",
    });

    expect(created.tenant.displayName).toBe(displayName);
    expect(created.setupState).toBe("DRAFT");
    expect(created.noClientRelease).toBe(true);

    const reloaded = await prisma.clientTenant.findUniqueOrThrow({ where: { id: created.tenant.id } });
    expect(reloaded.displayName).toBe(displayName);

    await expect(
      createP44ClientTenant(prisma, {
        actorRoleKey: "admin",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      }),
    ).rejects.toBeInstanceOf(P44Phase2PermissionError);

    await expect(
      createP44ClientTenant(prisma, {
        actorRoleKey: "analyst",
        displayName: `Denied ${displayName}`,
        jurisdiction: "South Africa",
      }),
    ).rejects.toBeInstanceOf(P44Phase2PermissionError);

    await expect(
      createP44ClientTenant(prisma, {
        actorRoleKey: "admin",
        displayName: "No",
        jurisdiction: "",
      }),
    ).rejects.toBeInstanceOf(P44Phase2ValidationError);
  });

  test("P44-2-T06 and P44-2-T07 persist governed settings and fail closed on unsafe security defaults", async () => {
    const platform = await updateP44PlatformSetting(prisma, {
      actorRoleKey: "admin",
      retentionYears: 9,
      settingKey: "evidence_retention_years",
    });

    expect(platform.noClientRelease).toBe(true);
    expect(platform.value).toBe(9);

    const platformAudit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: platform.auditEventId } });
    expect(platformAudit.result).toBe(AuditResult.SUCCESS);
    expect(platformAudit.eventType).toBe("p44.phase2.platform_setting.success");

    const security = await updateP44SecurityConfiguration(prisma, {
      actorRoleKey: "security_officer",
      mfaRequired: true,
      sessionMinutes: 30,
    });

    expect(security.noClientRelease).toBe(true);
    expect(security.mfaRequired).toBe(true);

    await expect(
      updateP44SecurityConfiguration(prisma, {
        actorRoleKey: "security_officer",
        mfaRequired: false,
        sessionMinutes: 480,
      }),
    ).rejects.toBeInstanceOf(P44Phase2PermissionError);
  });

  test("P44-2-T08 and P44-2-T09 require effective policy and deny draft-only policy paths", async () => {
    const version = `2026.${Date.now()}`;
    await createP44PolicyVersion(prisma, {
      actorRoleKey: "compliance_officer",
      clientTenantSlug: "morgan",
      policyKey: "p44.advice.boundary",
      status: "draft",
      version,
    });

    await expect(
      requireP44EffectivePolicy(prisma, {
        clientTenantSlug: "morgan",
        policyKey: "p44.advice.boundary",
      }),
    ).rejects.toBeInstanceOf(P44Phase2PermissionError);

    const active = await createP44PolicyVersion(prisma, {
      actorRoleKey: "compliance_officer",
      clientTenantSlug: "morgan",
      policyKey: "p44.advice.boundary",
      status: "active",
      version: `${version}.active`,
    });

    expect(active.noClientRelease).toBe(true);
    const effective = await requireP44EffectivePolicy(prisma, {
      clientTenantSlug: "morgan",
      policyKey: "p44.advice.boundary",
    });
    expect(effective.status).toBe("active");
  });

  test("P44-2-T10 and P44-2-T11 persist team assignment audit without granting release/export authority", async () => {
    const assignment = await assignP44TeamMember(prisma, {
      actorRoleKey: "client_success",
      email: `p44.phase2.${Date.now()}@alphavest.demo`,
      roleKey: "analyst",
      tenantSlug: "morgan",
    });

    expect(assignment.noClientRelease).toBe(true);

    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: assignment.auditEventId } });
    expect(audit.clientTenantId).toBe(demoTenants.find((tenant) => tenant.slug === "morgan")?.id);
    expect(audit.eventType).toBe("p44.phase2.team_assignment.success");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.metadataJson).toMatchObject({
      noClientRelease: true,
      p44Phase: "PH2",
      roleKey: "analyst",
    });
  });

  test("P44-2-T12 certifies all Phase 2 tickets with direct or boundary proof", () => {
    const certification = getP44Phase2Certification();

    expect(certification.complete).toBe(true);
    expect(certification.noClientRelease).toBe(true);
    expect(certification.tickets).toHaveLength(12);
    expect(certification.tickets.map((ticket) => ticket.id)).toEqual([
      "P44-2-T01-IMPL",
      "P44-2-T02-IMPL",
      "P44-2-T03-IMPL",
      "P44-2-T04-IMPL",
      "P44-2-T05-IMPL",
      "P44-2-T06-IMPL",
      "P44-2-T07-IMPL",
      "P44-2-T08-IMPL",
      "P44-2-T09-IMPL",
      "P44-2-T10-IMPL",
      "P44-2-T11-IMPL",
      "P44-2-T12-IMPL",
    ]);
  });
});
