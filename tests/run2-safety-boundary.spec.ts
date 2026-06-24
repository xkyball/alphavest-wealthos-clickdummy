import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient, WorkflowStatus } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

async function jwtFor(request: APIRequestContext, email: string) {
  const startResponse = await request.post("/api/auth/provider-login", {
    data: {
      email,
      providerId: "db-user-jwt",
    },
  });
  expect(startResponse.ok(), await startResponse.text()).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: {
      code: "123456",
      email,
      providerId: "db-user-jwt",
    },
  });
  const body = await mfaResponse.json();
  expect(mfaResponse.ok(), JSON.stringify(body)).toBe(true);

  return body.jwt as string;
}

function bearer(jwt: string) {
  return {
    authorization: `Bearer ${jwt}`,
  };
}

async function command(
  request: APIRequestContext,
  journeyId: string,
  jwt: string,
  data: Record<string, unknown>,
) {
  return request.post(`/api/journeys/${journeyId}/commands`, {
    data,
    headers: bearer(jwt),
  });
}

async function seededJourneyContext(prisma: PrismaClient, journeyKey: string) {
  const instance = await prisma.journeyInstance.findFirstOrThrow({
    include: {
      definition: true,
      objectLinks: true,
    },
    where: {
      definition: { journeyKey },
    },
  });
  const requirement = await prisma.journeyEvidenceRequirement.findFirstOrThrow({
    where: { journeyDefinitionId: instance.definitionId },
  });
  const evidenceLink = instance.objectLinks.find((link) => link.objectType === "EVIDENCE_RECORD");

  if (!evidenceLink) {
    throw new Error(`Seeded ${journeyKey} journey is missing evidence link.`);
  }

  return {
    clientTenantId: instance.clientTenantId,
    evidenceRecordId: evidenceLink.objectId,
    journeyId: instance.id,
    requirementKey: requirement.requirementKey,
  };
}

async function createJourneyDataQualityBlocker(prisma: PrismaClient, input: { clientTenantId: string; journeyId: string }) {
  return prisma.dataQualityIssue.create({
    data: {
      clientTenantId: input.clientTenantId,
      description: "Critical journey evidence mismatch blocks Run2 client visibility.",
      issueType: "run2_journey_release_blocker",
      severity: "critical",
      status: WorkflowStatus.IN_REVIEW,
      targetId: input.journeyId,
      targetType: ObjectType.JOURNEY,
    },
  });
}

async function prepareJourneyForRelease(request: APIRequestContext, prisma: PrismaClient) {
  const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
  const advisorJwt = await jwtFor(request, "thabo.advisor@alphavest.demo");
  const context = await seededJourneyContext(prisma, "MJ-001");

  expect(
    (await command(request, context.journeyId, analystJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "intake.confirm_scope",
      reason: "Run2 release-prep scope confirmation.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, analystJwt, {
      command: "LINK_EVIDENCE",
      evidenceRecordId: context.evidenceRecordId,
      requirementKey: context.requirementKey,
      reason: "Run2 release-prep evidence link.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, analystJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      currentnessConfirmed: true,
      decision: "SUFFICIENT",
      evidenceRecordId: context.evidenceRecordId,
      relevanceConfirmed: true,
      requirementKey: context.requirementKey,
      reviewed: true,
      scopeMatches: true,
      reason: "Run2 release-prep sufficiency decision.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, analystJwt, {
      command: "AI_DRAFT_INTERNAL",
      reason: "Run2 internal-only draft proof.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, analystJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "evidence.collect",
      reason: "Run2 release-prep evidence step.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, advisorJwt, {
      command: "ADVISOR_APPROVE",
      reason: "Run2 advisor approval remains separate from release.",
    })).ok(),
  ).toBe(true);

  expect(
    (await command(request, context.journeyId, advisorJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "review.human_approval",
      reason: "Run2 release-prep review step.",
    })).ok(),
  ).toBe(true);

  return context;
}

test.describe.serial("Run2 Epic 1-2 safety boundary hardening", () => {
  let prisma: PrismaClient | undefined;

  test.beforeEach(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Run2 safety boundary tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterEach(async () => {
    await prisma?.$disconnect();
    prisma = undefined;
  });

  test("RUN2-I3 blocks compliance release for journey-scoped high-severity data-quality issues", async ({
    request,
  }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const context = await prepareJourneyForRelease(request, prisma);

    await createJourneyDataQualityBlocker(prisma, context);

    const release = await command(request, context.journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe summary cannot release while high-severity data quality is open.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Run2 data-quality release blocker proof.",
    });
    const body = await release.json();

    expect(release.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toEqual(
      expect.arrayContaining(["release_preconditions_failed", "data_quality_release_ready", "high_severity_data_quality_issues"]),
    );
  });

  test("RUN2-I1 blocks client projection when a released journey gains high-severity data-quality issues", async ({
    request,
  }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const context = await prepareJourneyForRelease(request, prisma);

    const release = await command(request, context.journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe summary released after clean gates.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Run2 clean release before projection blocker proof.",
    });
    expect(release.ok(), await release.text()).toBe(true);

    const cleanProjection = await request.get(`/api/journeys/${context.journeyId}/client-projection`, {
      headers: bearer(cfoJwt),
    });
    const cleanBody = await cleanProjection.json();
    expect(cleanProjection.ok(), JSON.stringify(cleanBody)).toBe(true);
    expect(cleanBody.projection.status).toBe("COMPLETE");
    expect(cleanBody.dataQuality.releaseReady).toBe(true);

    await createJourneyDataQualityBlocker(prisma, context);

    const blockedProjection = await request.get(`/api/journeys/${context.journeyId}/client-projection`, {
      headers: bearer(cfoJwt),
    });
    const blockedBody = await blockedProjection.json();

    expect(blockedProjection.ok(), JSON.stringify(blockedBody)).toBe(true);
    expect(blockedBody.projection.status).toBe("BLOCKED");
    expect(blockedBody.projection.nextAction.type).toBe("BLOCKED");
    expect(blockedBody.dataQuality.releaseReady).toBe(false);
    expect(blockedBody.dataQuality.missing).toContain("high_severity_data_quality_issues");
    expect(JSON.stringify(blockedBody)).not.toMatch(/internalRationale|complianceNotes|objectLinks|evidenceRequirements/);
  });
});
