import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";
import { AuditResult } from "@prisma/client";

import {
  assignOperationalTeamMember,
  createOperationalClientTenant,
  createOperationalPolicyVersion,
  getOperationalStage2Certification,
  OperationalStage2PermissionError,
  OperationalStage2ValidationError,
  requireOperationalEffectivePolicy,
  updateOperationalPlatformSetting,
  updateOperationalSecurityConfiguration,
} from "../lib/admin-tenant-governance-service";
import { acceptLocalInvite, inviteLocalAuthUser } from "../lib/auth/local-auth-provider-service";
import { getAdminTenantSnapshot } from "../lib/admin-tenant-readmodel-service";
import { actorTenantSlugFromDisplayName, actorTenants } from "../lib/actor-session";
import { prismaClient } from "../lib/prisma";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

const prisma = prismaClient();

test.describe("Operational Stage 2 client context admin foundation certification", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Operational-2-T01 creates a client tenant draft and rejects duplicate or invalid creation", async () => {
    const displayName = `Operational Stage 2 Tenant ${Date.now()}`;
    const created = await createOperationalClientTenant(prisma, {
      actorRoleKey: "admin",
      displayName,
      jurisdiction: "South Africa",
      relationshipTier: "Signature",
    });

    expect(created.tenant.displayName).toBe(displayName);
    expect(created.setupState).toBe("DRAFT");
    expect(created.noClientRelease).toBe(true);
    expect(created.actorSessionTenant.slug).toBe(actorTenantSlugFromDisplayName(displayName));
    expect(created.actorSessionContexts).toMatchObject({
      advisor: { roleKey: "senior_wealth_advisor", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug },
      cfo: { roleKey: "family_cfo", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug },
      principal: { roleKey: "principal", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug },
    });

    const reloaded = await prisma.clientTenant.findUniqueOrThrow({ where: { id: created.tenant.id } });
    expect(reloaded.displayName).toBe(displayName);
    expect(reloaded.slug).toBe(created.actorSessionTenant.slug);

    const invitedPrincipal = await inviteLocalAuthUser(prisma, {
      actorRoleKey: "admin",
      displayName: `${displayName} Principal`,
      email: `principal.${created.actorSessionTenant.slug}@alphavest.example`,
      roleKey: "principal",
      tenantSlug: created.actorSessionTenant.slug,
    });
    const invitedCfo = await inviteLocalAuthUser(prisma, {
      actorRoleKey: "admin",
      displayName: `${displayName} CFO`,
      email: `cfo.${created.actorSessionTenant.slug}@alphavest.example`,
      roleKey: "family_cfo",
      tenantSlug: created.actorSessionTenant.slug,
    });
    const invitedAdvisor = await inviteLocalAuthUser(prisma, {
      actorRoleKey: "admin",
      displayName: `${displayName} Advisor`,
      email: `advisor.${created.actorSessionTenant.slug}@alphavest.example`,
      roleKey: "senior_wealth_advisor",
      tenantSlug: created.actorSessionTenant.slug,
    });

    expect(invitedPrincipal.user).toMatchObject({ roleKey: "principal", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug });
    expect(invitedCfo.user).toMatchObject({ roleKey: "family_cfo", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug });
    expect(invitedAdvisor.user).toMatchObject({ roleKey: "senior_wealth_advisor", tenantId: created.tenant.id, tenantSlug: created.actorSessionTenant.slug });

    const acceptedPrincipal = await acceptLocalInvite(prisma, {
      consentAccepted: true,
      email: invitedPrincipal.user.email,
      token: invitedPrincipal.inviteToken,
    });
    expect(acceptedPrincipal.session).toMatchObject({
      roleKey: "principal",
      tenantId: created.tenant.id,
      tenantSlug: created.actorSessionTenant.slug,
    });

    await expect(
      createOperationalClientTenant(prisma, {
        actorRoleKey: "admin",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      }),
    ).rejects.toBeInstanceOf(OperationalStage2PermissionError);

    await expect(
      createOperationalClientTenant(prisma, {
        actorRoleKey: "analyst",
        displayName: `Denied ${displayName}`,
        jurisdiction: "South Africa",
      }),
    ).rejects.toBeInstanceOf(OperationalStage2PermissionError);

    await expect(
      createOperationalClientTenant(prisma, {
        actorRoleKey: "admin",
        displayName: "No",
        jurisdiction: "",
      }),
    ).rejects.toBeInstanceOf(OperationalStage2ValidationError);
  });

  test("admin governance mutations fail closed without an explicit actor role", async () => {
    await expect(
      createOperationalClientTenant(prisma, {
        displayName: `Missing Actor Tenant ${Date.now()}`,
        jurisdiction: "South Africa",
      }),
    ).rejects.toMatchObject({ issues: ["valid_actor_role_required"] });

    await expect(
      updateOperationalPlatformSetting(prisma, {
        retentionYears: 7,
        settingKey: "evidence_retention_years",
      }),
    ).rejects.toMatchObject({ issues: ["valid_actor_role_required"] });

    await expect(
      updateOperationalSecurityConfiguration(prisma, {
        mfaRequired: true,
        sessionMinutes: 30,
      }),
    ).rejects.toMatchObject({ issues: ["valid_actor_role_required"] });

    await expect(
      createOperationalPolicyVersion(prisma, {
        clientTenantSlug: "morgan",
        policyKey: "operational.advice.boundary",
        status: "draft",
        version: `missing.actor.${Date.now()}`,
      }),
    ).rejects.toMatchObject({ issues: ["valid_actor_role_required"] });

    await expect(
      assignOperationalTeamMember(prisma, {
        email: `missing.actor.${Date.now()}@alphavest.example`,
        roleKey: "analyst",
        tenantSlug: "morgan",
      }),
    ).rejects.toMatchObject({ issues: ["valid_actor_role_required"] });
  });

  test("admin tenant API requires DB-user JWT and ignores spoofed body actor role", async ({ request }) => {
    const displayName = `JWT Authority Tenant ${Date.now()}`;
    const beforeCount = await prisma.clientTenant.count({
      where: { displayName },
    });

    const missingJwtResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "create_tenant",
        actorRoleKey: "admin",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      },
    });
    const missingJwtBody = await missingJwtResponse.json();

    expect(missingJwtResponse.status(), JSON.stringify(missingJwtBody)).toBe(401);
    expect(missingJwtBody).toMatchObject({
      ok: false,
      reasonCode: "PERMISSION_DENIED",
      safety: {
        authority: "db-user-jwt",
        scoped: false,
      },
    });
    await expect(prisma.clientTenant.count({ where: { displayName } })).resolves.toBe(beforeCount);

    const adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "create_tenant",
        actorRoleKey: "analyst",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body).toMatchObject({
      ok: true,
      result: {
        noClientRelease: true,
        setupState: "DRAFT",
        tenant: {
          displayName,
          status: "DRAFT",
        },
      },
      safety: {
        authority: "db-user-jwt",
        noClientRelease: true,
        roleKey: "admin",
        scoped: true,
      },
    });

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "operational.stage2.tenant_create.success",
        targetId: body.result.tenant.id,
      },
    });
    const adminUser = await prisma.user.findUniqueOrThrow({ where: { email: "ava.admin@alphavest.demo" } });

    expect(audit.actorRoleKey).toBe("admin");
    expect(audit.actorUserId).toBe(adminUser.id);
  });

  test("client success can create onboarding drafts with tenant-specific actor-session slugs", async ({ request }) => {
    const displayName = `Van der Merwe Family Office ${Date.now()}`;
    const expectedSlug = actorTenantSlugFromDisplayName(displayName);
    const clientSuccessJwt = await issueTestAuthJwt(request, {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
    });
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "create_tenant",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      },
      headers: { Authorization: `Bearer ${clientSuccessJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body).toMatchObject({
      ok: true,
      result: {
        actorSessionContexts: {
          advisor: { roleKey: "senior_wealth_advisor", tenantSlug: expectedSlug },
          cfo: { roleKey: "family_cfo", tenantSlug: expectedSlug },
          principal: { roleKey: "principal", tenantSlug: expectedSlug },
        },
        actorSessionTenant: {
          slug: expectedSlug,
        },
        noClientRelease: true,
        setupState: "DRAFT",
        tenant: {
          displayName,
          slug: expectedSlug,
          status: "DRAFT",
        },
      },
      safety: {
        authority: "db-user-jwt",
        noClientRelease: true,
        roleKey: "client_success",
        scoped: true,
      },
    });
    expect(expectedSlug).not.toBe("morgan");
    expect(expectedSlug).not.toBe("northbridge");

    const created = await prisma.clientTenant.findUniqueOrThrow({ where: { id: body.result.tenant.id } });
    expect(created.slug).toBe(expectedSlug);

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "operational.stage2.tenant_create.success",
        targetId: body.result.tenant.id,
      },
    });
    expect(audit.actorRoleKey).toBe("client_success");
  });

  test("Operational-2-T06 and Operational-2-T07 persist governed settings and fail closed on unsafe security defaults", async () => {
    const platform = await updateOperationalPlatformSetting(prisma, {
      actorRoleKey: "admin",
      retentionYears: 9,
      settingKey: "evidence_retention_years",
    });

    expect(platform.noClientRelease).toBe(true);
    expect(platform.value).toBe(9);

    const platformAudit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: platform.auditEventId } });
    expect(platformAudit.result).toBe(AuditResult.SUCCESS);
    expect(platformAudit.eventType).toBe("operational.stage2.platform_setting.success");

    const security = await updateOperationalSecurityConfiguration(prisma, {
      actorRoleKey: "security_officer",
      mfaRequired: true,
      sessionMinutes: 30,
    });

    expect(security.noClientRelease).toBe(true);
    expect(security.mfaRequired).toBe(true);

    await expect(
      updateOperationalSecurityConfiguration(prisma, {
        actorRoleKey: "security_officer",
        mfaRequired: false,
        sessionMinutes: 480,
      }),
    ).rejects.toBeInstanceOf(OperationalStage2PermissionError);
  });

  test("Operational-2-T08 and Operational-2-T09 require effective policy and deny draft-only policy paths", async () => {
    const version = `2026.${Date.now()}`;
    await createOperationalPolicyVersion(prisma, {
      actorRoleKey: "compliance_officer",
      clientTenantSlug: "morgan",
      policyKey: "operational.advice.boundary",
      status: "draft",
      version,
    });

    await expect(
      requireOperationalEffectivePolicy(prisma, {
        clientTenantSlug: "morgan",
        policyKey: "operational.advice.boundary",
      }),
    ).rejects.toBeInstanceOf(OperationalStage2PermissionError);

    const active = await createOperationalPolicyVersion(prisma, {
      actorRoleKey: "compliance_officer",
      clientTenantSlug: "morgan",
      policyKey: "operational.advice.boundary",
      status: "active",
      version: `${version}.active`,
    });

    expect(active.noClientRelease).toBe(true);
    const effective = await requireOperationalEffectivePolicy(prisma, {
      clientTenantSlug: "morgan",
      policyKey: "operational.advice.boundary",
    });
    expect(effective.status).toBe("active");
  });

  test("Operational-2-T10 and Operational-2-T11 persist team assignment audit without granting release/export authority", async () => {
    const assignment = await assignOperationalTeamMember(prisma, {
      actorRoleKey: "client_success",
      email: `operational.stage2.${Date.now()}@alphavest.demo`,
      roleKey: "analyst",
      tenantSlug: "morgan",
    });

    expect(assignment.noClientRelease).toBe(true);

    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: assignment.auditEventId } });
    expect(audit.clientTenantId).toBe(actorTenants.find((tenant) => tenant.slug === "morgan")?.id);
    expect(audit.eventType).toBe("operational.stage2.team_assignment.success");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.metadataJson).toMatchObject({
      noClientRelease: true,
      operationalStage: "PH2",
      roleKey: "analyst",
    });
  });

  test("role catalogue and permission matrix are loaded from the DB role model", async () => {
    const snapshot = await getAdminTenantSnapshot(prisma);
    const adminRole = snapshot.roleRows.find((role) => role.name === "Admin");
    const complianceRole = snapshot.roleRows.find((role) => role.name === "Compliance Officer");

    expect(snapshot.meta.sourceTruth).toBe("admin_tenant_db_readmodel");
    expect(snapshot.roleRows.length).toBe(snapshot.meta.totalRoles);
    expect(snapshot.permissionMatrixColumns).toEqual([
      "Platform",
      "Tenant",
      "Users",
      "Evidence",
      "Advice",
      "Client release",
      "Export",
      "Audit",
    ]);
    expect(adminRole?.permissionCount).toBeGreaterThan(10);
    expect(adminRole?.secondConfirmationCount).toBeGreaterThan(0);
    expect(complianceRole?.matrix[snapshot.permissionMatrixColumns.indexOf("Client release")]).toBe("full");
    expect(snapshot.roleRows.every((role) => role.matrix.length === snapshot.permissionMatrixColumns.length)).toBe(true);
  });

  test("evidence and export templates are loaded from policy definitions", async () => {
    const snapshot = await getAdminTenantSnapshot(prisma);

    expect(snapshot.meta.sourceTruth).toBe("admin_tenant_db_readmodel");
    expect(snapshot.meta.totalEvidenceTemplates).toBe(4);
    expect(snapshot.meta.totalExportTemplates).toBe(4);
    expect(snapshot.meta.totalRedactionProfiles).toBeGreaterThanOrEqual(4);
    expect(snapshot.evidenceTemplateRows.map((row) => row.policyKey)).toEqual(expect.arrayContaining([
      "evidence.template.kyc",
      "evidence.template.suitability_review",
    ]));
    expect(snapshot.exportTemplateRows.map((row) => row.policyKey)).toEqual(expect.arrayContaining([
      "export.template.onboarding",
      "export.template.advisor_data_share",
    ]));
    expect(snapshot.exportTemplateRows.find((row) => row.policyKey === "export.template.advisor_data_share")?.status).toBe("Blocked");
    expect(snapshot.evidenceTemplateRows.find((row) => row.policyKey === "evidence.template.suitability_review")?.status).toBe("Draft");
  });

  test("tenant policy profile is loaded from tenant-scoped policy definitions", async () => {
    const snapshot = await getAdminTenantSnapshot(prisma);

    expect(snapshot.meta.sourceTruth).toBe("admin_tenant_db_readmodel");
    expect(snapshot.tenantPolicyProfile.profile).toBe("Morgan Family Office policy profile");
    expect(snapshot.tenantPolicyProfile.total).toBe(snapshot.tenantPolicyRows.length);
    expect(snapshot.tenantPolicyRows.map((row) => row.policyKey)).toEqual(expect.arrayContaining([
      "advice.boundary",
      "evidence.default",
      "privacy.popia",
      "retention.documents",
    ]));
    expect(snapshot.tenantPolicyRows.map((row) => row.policyKey)).not.toEqual(expect.arrayContaining([
      "evidence.template.kyc",
      "export.template.onboarding",
    ]));
    expect(snapshot.tenantPolicyRows.find((row) => row.policyKey === "privacy.popia")?.scope).toBe("Tenant policy");
    expect(snapshot.tenantPolicyRows.find((row) => row.policyKey === "advice.boundary")?.scope).toBe("Platform default");
  });

  test("Operational-2-T12 certifies all Stage 2 tickets with direct or boundary proof", () => {
    const certification = getOperationalStage2Certification();

    expect(certification.complete).toBe(true);
    expect(certification.noClientRelease).toBe(true);
    expect(certification.tickets).toHaveLength(12);
    expect(certification.tickets.map((ticket) => ticket.id)).toEqual([
      "Operational-2-T01-IMPL",
      "Operational-2-T02-IMPL",
      "Operational-2-T03-IMPL",
      "Operational-2-T04-IMPL",
      "Operational-2-T05-IMPL",
      "Operational-2-T06-IMPL",
      "Operational-2-T07-IMPL",
      "Operational-2-T08-IMPL",
      "Operational-2-T09-IMPL",
      "Operational-2-T10-IMPL",
      "Operational-2-T11-IMPL",
      "Operational-2-T12-IMPL",
    ]);
  });
});
