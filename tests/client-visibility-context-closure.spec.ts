import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type Page } from "@playwright/test";

import { actorTenants } from "../lib/actor-session";
import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { prismaClient } from "../lib/prisma";
import { stableId } from "../lib/stable-id";

const prisma = prismaClient();

const tenantId = (slug: string) => {
  const tenant = actorTenants.find((candidate) => candidate.slug === slug);

  if (!tenant) {
    throw new Error(`Missing demo tenant: ${slug}`);
  }

  return tenant.id;
};

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("CLIENT_VISIBILITY Stage 2 client context closure", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("P2-T01 saves, reloads and denies wrong-tenant profile actors", async ({ request }) => {
    const firstName = `CLIENT_VISIBILITY ${Date.now()}`;
    const saveResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "South Africa",
        firstName,
        lastName: "Principal",
        phone: "+27 10 555 0111",
        relationshipLabel: "Principal",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.result.mutated).toBe(true);
    expect(saveBody.result.noClientRelease).toBe(true);

    const reloadResponse = await request.get("/api/profile?tenantSlug=bennett&roleKey=family_cfo");
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.profile.firstName).toBe(firstName);

    const wrongTenantView = await request.get(
      "/api/profile?tenantSlug=bennett&roleKey=family_cfo&actorTenantSlug=morgan",
    );
    const wrongTenantViewBody = await wrongTenantView.json();

    expect(wrongTenantView.status(), JSON.stringify(wrongTenantViewBody)).toBe(403);
    expect(wrongTenantViewBody.profile).toBeNull();
    expect(wrongTenantViewBody.safety.hiddenRowsDisclosed).toBe(false);

    const deniedMutation = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        actorTenantSlug: "morgan",
        countryOfResidence: "South Africa",
        firstName: "Wrong",
        lastName: "Tenant",
        relationshipLabel: "Principal",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
    });
    const deniedMutationBody = await deniedMutation.json();

    expect(deniedMutation.status(), JSON.stringify(deniedMutationBody)).toBe(403);
    expect(deniedMutationBody.mutated).toBe(false);
    expect(deniedMutationBody.auditEventId).toBeTruthy();
  });

  test("P2-T02 persists family member edits and denies outside-object scope without payload", async ({ request }) => {
    const morganList = await request.get("/api/family-members?tenantSlug=morgan&roleKey=family_cfo");
    const morganBody = await morganList.json();
    const target = morganBody.familyMembers[0] as {
      contextReadinessReasons: string[];
      contextReadinessState: string;
      id: string;
      name: string;
      relationship: string;
      taxResidency: string;
    };
    const nextName = `${target.name} CLIENT_VISIBILITY`;

    expect(["ready", "incomplete", "blocked"]).toContain(target.contextReadinessState);
    expect(Array.isArray(target.contextReadinessReasons)).toBe(true);

    const saveResponse = await request.patch("/api/family-members", {
      data: {
        displayName: nextName,
        id: target.id,
        relationshipType: target.relationship,
        roleKey: "family_cfo",
        taxResidency: target.taxResidency,
        tenantSlug: "morgan",
      },
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.result.mutated).toBe(true);
    expect(saveBody.result.noClientRelease).toBe(true);

    const reloadResponse = await request.get(`/api/family-members?tenantSlug=morgan&roleKey=family_cfo&q=${encodeURIComponent(nextName)}`);
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.familyMembers.some((row: { name: string }) => row.name === nextName)).toBe(true);
    expect(reloadBody.familyMembers[0].contextReadinessState).toBeTruthy();

    const wrongObjectResponse = await request.patch("/api/family-members", {
      data: {
        displayName: "Wrong Object",
        id: target.id,
        relationshipType: target.relationship,
        roleKey: "family_cfo",
        taxResidency: target.taxResidency,
        tenantSlug: "bennett",
      },
    });
    const wrongObjectBody = await wrongObjectResponse.json();

    expect(wrongObjectResponse.status(), JSON.stringify(wrongObjectBody)).toBe(404);
    expect(wrongObjectBody.mutated).toBe(false);

    const wrongActorResponse = await request.patch("/api/family-members", {
      data: {
        actorTenantSlug: "bennett",
        displayName: "Wrong Actor",
        id: target.id,
        relationshipType: target.relationship,
        roleKey: "family_cfo",
        taxResidency: target.taxResidency,
        tenantSlug: "morgan",
      },
    });
    const wrongActorBody = await wrongActorResponse.json();

    expect(wrongActorResponse.status(), JSON.stringify(wrongActorBody)).toBe(403);
    expect(wrongActorBody.mutated).toBe(false);
    expect(wrongActorBody.auditEventId).toBeTruthy();
  });

  test("C3-1 selects a family member before exposing downstream context outputs", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await authenticate(page);
    await page.goto("/client/family-members");

    const detail = page.getByTestId("domain-07-family-detail-surface");
    await expect(detail).toHaveAttribute("data-ux-selected-family-member-id", "none");
    await expect(detail).toHaveAttribute("data-ux-family-context-output-state", "selection_required");
    await expect(page.getByTestId("j09-save-family-changes")).toBeDisabled();

    await page.getByTestId("ux-data-table").locator('[data-testid="c3-select-family-member"]').first().click();

    await expect(detail).not.toHaveAttribute("data-ux-selected-family-member-id", "none");
    await expect(detail).not.toHaveAttribute("data-ux-family-context-output-state", "selection_required");
    await expect(page.getByLabel("Display Name")).not.toHaveValue("");
    await expect(page.getByLabel("Relationship")).not.toHaveValue("");
    await expect(page.getByTestId("j09-save-family-changes")).toBeEnabled();
  });

  test("P2-T03 creates tenant-linked entities and invalid submissions do not create partial rows", async ({ request }) => {
    const summitTenantId = tenantId("summit");
    const invalidName = `CLIENT_VISIBILITY Invalid ${Date.now()}`;
    const countBefore = await prisma.entity.count({
      where: { clientTenantId: summitTenantId, name: invalidName },
    });

    const invalidResponse = await request.post("/api/entities", {
      data: {
        action: "submit",
        entityType: "COMPANY",
        jurisdiction: "",
        name: invalidName,
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
    });
    const invalidBody = await invalidResponse.json();
    const countAfter = await prisma.entity.count({
      where: { clientTenantId: summitTenantId, name: invalidName },
    });

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.mutated).toBe(false);
    expect(countAfter).toBe(countBefore);

    const entityName = `CLIENT_VISIBILITY Summit Holdings ${Date.now()}`;
    const createResponse = await request.post("/api/entities", {
      data: {
        action: "submit",
        entityType: "COMPANY",
        jurisdiction: "United States",
        name: entityName,
        ownerSummary: "CLIENT_VISIBILITY tenant-linked entity proof.",
        registrationNumber: "CLIENT_VISIBILITY-2026",
        riskRating: "Medium",
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
    });
    const createBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.result.entity.clientTenantId).toBe(summitTenantId);
    expect(createBody.result.entity.name).toBe(entityName);

    const listResponse = await request.get(`/api/entities?tenantSlug=summit&roleKey=family_cfo&q=${encodeURIComponent(entityName)}`);
    const listBody = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(listBody)).toBe(true);
    expect(listBody.entities).toHaveLength(1);
    expect(listBody.entities[0].name).toBe(entityName);
    expect(listBody.entities[0].visibilityStatus).toBeTruthy();
    expect(listBody.entities[0].sensitivity).toBeTruthy();
    expect(["ready", "incomplete", "blocked"]).toContain(listBody.entities[0].contextReadinessState);
    expect(Array.isArray(listBody.entities[0].contextReadinessReasons)).toBe(true);
    expect(Array.isArray(listBody.facets.types)).toBe(true);
  });

  test("P2-T03B relationship edge command persists audit and fails closed before mutation when audit is unavailable", async ({ request }) => {
    const relationshipId = stableId("relationship:bennett:principal-olivia-nextgen");

    await prisma.evidenceItem.deleteMany({ where: { sourceObjectId: relationshipId } });
    await prisma.auditEvent.deleteMany({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    });
    await prisma.relationship.deleteMany({ where: { id: relationshipId } });

    const blockedResponse = await request.post("/api/data-maintenance/actions", {
      data: {
        actionId: "j09.addRelationship",
        roleKey: "principal",
        simulateAuditPersistenceFailure: true,
        tenantSlug: "bennett",
      },
    });
    const blockedBody = await blockedResponse.json();

    expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);
    expect(blockedBody.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(blockedBody.safety.commandExecuted).toBe(false);
    expect(blockedBody.safety.noClientRelease).toBe(true);
    expect(await prisma.relationship.count({ where: { id: relationshipId } })).toBe(0);
    expect(await prisma.evidenceItem.count({ where: { sourceObjectId: relationshipId } })).toBe(0);
    expect(await prisma.auditEvent.count({ where: { targetId: relationshipId } })).toBe(0);

    const createResponse = await request.post("/api/data-maintenance/actions", {
      data: {
        actionId: "j09.addRelationship",
        roleKey: "principal",
        tenantSlug: "bennett",
      },
    });
    const createBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.ok).toBe(true);
    expect(createBody.noClientRelease).toBe(true);
    expect(createBody.result.relationshipId).toBe(relationshipId);

    const relationship = await prisma.relationship.findUniqueOrThrow({ where: { id: relationshipId } });
    expect(relationship.relationshipType).toBe("parent_child_governance");

    const audit = await prisma.auditEvent.findFirstOrThrow({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
      orderBy: { createdAt: "desc" },
    });
    expect(audit.result).toBe("SUCCESS");

    expect(await prisma.evidenceItem.count({ where: { sourceObjectId: relationshipId } })).toBeGreaterThan(0);
  });

  test("P2-T04 derives sensitivity visibility and hides internal context without inference", async ({ request }) => {
    const bennettTenantId = tenantId("bennett");
    const hiddenName = `CLIENT_VISIBILITY Hidden ${Date.now()}`;
    const hiddenEntity = `CLIENT_VISIBILITY Hidden Entity ${Date.now()}`;

    await prisma.familyMember.create({
      data: {
        clientTenantId: bennettTenantId,
        displayName: hiddenName,
        isPrincipal: false,
        relationshipType: "next_generation",
        sensitivity: "INTERNAL_ONLY",
        taxResidency: "South Africa",
      },
    });
    await prisma.entity.create({
      data: {
        clientTenantId: bennettTenantId,
        entityType: "COMPANY",
        jurisdiction: "South Africa",
        name: hiddenEntity,
        riskRating: "High",
        sensitivity: "INTERNAL_ONLY",
        status: "active",
      },
    });

    const clientFamilyResponse = await request.get("/api/family-members?tenantSlug=bennett&roleKey=next_gen");
    const clientFamilyBody = await clientFamilyResponse.json();
    const clientEntityResponse = await request.get("/api/entities?tenantSlug=bennett&roleKey=next_gen");
    const clientEntityBody = await clientEntityResponse.json();

    expect(clientFamilyResponse.ok(), JSON.stringify(clientFamilyBody)).toBe(true);
    expect(JSON.stringify(clientFamilyBody)).not.toContain(hiddenName);
    expect(clientFamilyBody.safety.hiddenRowsDisclosed).toBe(false);
    expect(clientFamilyBody.safety.hiddenRowCount).toBeUndefined();

    expect(clientEntityResponse.ok(), JSON.stringify(clientEntityBody)).toBe(true);
    expect(JSON.stringify(clientEntityBody)).not.toContain(hiddenEntity);
    expect(clientEntityBody.safety.hiddenRowsDisclosed).toBe(false);
    expect(clientEntityBody.safety.hiddenRowCount).toBeUndefined();

    const internalFamilyResponse = await request.get(`/api/family-members?tenantSlug=bennett&roleKey=compliance_officer&q=${encodeURIComponent(hiddenName)}`);
    const internalFamilyBody = await internalFamilyResponse.json();

    expect(internalFamilyResponse.ok(), JSON.stringify(internalFamilyBody)).toBe(true);
    expect(internalFamilyBody.familyMembers).toHaveLength(1);
    expect(internalFamilyBody.familyMembers[0].visibilityStatus).toBe("Internal Only");
    expect(internalFamilyBody.familyMembers[0].payloadMode).toBe("full");
    expect(internalFamilyBody.familyMembers[0].contextReadinessState).toBe("blocked");
  });
});
