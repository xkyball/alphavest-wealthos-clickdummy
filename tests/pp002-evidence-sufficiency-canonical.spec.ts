import "dotenv/config";

import { execFileSync } from "node:child_process";

import { EvidenceStatus, VisibilityStatus } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import { prismaClient } from "../lib/prisma";

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

async function seededJourneyContext(journeyKey: string) {
  const prisma = prismaClient();
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
    evidenceRecordId: evidenceLink.objectId,
    requirementKey: requirement.requirementKey,
  };
}

async function createJourney(request: APIRequestContext, jwt: string, journeyKey = "MJ-003") {
  const response = await request.post("/api/journeys", {
    data: { journeyKey },
    headers: bearer(jwt),
  });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBe(true);

  return body.detail.id as string;
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

test.describe.serial("PP-002 canonical evidence sufficiency contract", () => {
  test.beforeEach(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("requires explicit link, compliance decision and all first-wave sufficiency attestations", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const { evidenceRecordId, requirementKey } = await seededJourneyContext("MJ-003");

    const link = await command(request, journeyId, analystJwt, {
      command: "LINK_EVIDENCE",
      evidenceRecordId,
      requirementKey,
      reason: "PP-002 canonical proof links evidence before sufficiency.",
    });
    const linkBody = await link.json();
    expect(link.ok(), JSON.stringify(linkBody)).toBe(true);
    expect(linkBody.noClientRelease).toBe(true);

    const sufficient = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      currentnessConfirmed: true,
      decision: "SUFFICIENT",
      evidenceRecordId,
      relevanceConfirmed: true,
      requirementKey,
      reviewed: true,
      scopeMatches: true,
      reason: "PP-002 canonical proof accepts reviewed linked relevant scoped current evidence.",
    });
    const sufficientBody = await sufficient.json();
    expect(sufficient.ok(), JSON.stringify(sufficientBody)).toBe(true);
    expect(sufficientBody.noClientRelease).toBe(true);

    const evidenceResponse = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(cfoJwt),
    });
    const evidenceBody = await evidenceResponse.json();
    expect(evidenceResponse.ok(), JSON.stringify(evidenceBody)).toBe(true);
    expect(evidenceBody.evidenceSufficient).toBe(true);
    expect(evidenceBody.requirements[0]).toMatchObject({
      key: requirementKey,
      met: true,
    });
    expect(evidenceBody.requirements[0].decision).toMatchObject({
      decision: "SUFFICIENT",
    });
    expect(evidenceBody.requirements[0].decision).not.toHaveProperty("evidenceRecordId");
    expect(evidenceBody.requirements[0].decision).not.toHaveProperty("reason");
    expect(evidenceBody.safety).toMatchObject({
      noClientRelease: true,
      uploadIsNotSufficiency: true,
    });

    const internalEvidenceResponse = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(complianceJwt),
    });
    const internalEvidenceBody = await internalEvidenceResponse.json();
    expect(internalEvidenceResponse.ok(), JSON.stringify(internalEvidenceBody)).toBe(true);
    expect(internalEvidenceBody.requirements[0].decision).toMatchObject({
      decision: "SUFFICIENT",
      evidenceRecordId,
      reason: "PP-002 canonical proof accepts reviewed linked relevant scoped current evidence.",
    });
  });

  test("blocks sufficiency when review, link, relevance, scope or currentness is missing", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const { evidenceRecordId, requirementKey } = await seededJourneyContext("MJ-003");
    const prisma = prismaClient();
    const decisionCountBefore = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });

    const response = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      decision: "SUFFICIENT",
      evidenceRecordId,
      requirementKey,
      reason: "PP-002 must reject sufficiency before link and attestations.",
    });
    const body = await response.json();
    const decisionCountAfter = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toEqual(
      expect.arrayContaining([
        "evidence_review_preconditions_failed",
        "evidence_requirement_link",
        "evidence_review",
        "evidence_scope",
        "evidence_relevance",
        "evidence_current",
      ]),
    );
    expect(decisionCountAfter).toBe(decisionCountBefore);
  });

  test("blocks restricted evidence even when a user tries to attest review, relevance, scope and currentness", async ({
    request,
  }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const { evidenceRecordId, requirementKey } = await seededJourneyContext("MJ-003");
    const prisma = prismaClient();

    await prisma.evidenceRecord.update({
      data: {
        status: EvidenceStatus.RESTRICTED,
        visibilityStatus: VisibilityStatus.RESTRICTED,
      },
      where: { id: evidenceRecordId },
    });

    const link = await command(request, journeyId, analystJwt, {
      command: "LINK_EVIDENCE",
      evidenceRecordId,
      requirementKey,
      reason: "PP-002 restricted evidence link stays non-sufficient.",
    });
    expect(link.ok(), await link.text()).toBe(true);

    const response = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      currentnessConfirmed: true,
      decision: "SUFFICIENT",
      evidenceRecordId,
      relevanceConfirmed: true,
      requirementKey,
      reviewed: true,
      scopeMatches: true,
      reason: "PP-002 must reject restricted evidence even with attestations.",
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toEqual(
      expect.arrayContaining(["evidence_review_preconditions_failed", "evidence_status", "client_safe_visibility"]),
    );
  });

  test("fails closed without a persisted audit event for the canonical sufficiency decision", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const { evidenceRecordId, requirementKey } = await seededJourneyContext("MJ-003");
    const prisma = prismaClient();
    const decisionCountBefore = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });

    const response = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      decision: "INSUFFICIENT",
      evidenceRecordId,
      requirementKey,
      reason: "PP-002 canonical decision must fail closed when audit cannot persist.",
      simulateAuditPersistenceFailure: true,
    });
    const body = await response.json();
    const decisionCountAfter = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(body.mutated).toBe(false);
    expect(body.safety.commandExecuted).toBe(false);
    expect(decisionCountAfter).toBe(decisionCountBefore);
  });

  test("records an insufficient evidence decision with reason without releasing client visibility", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const { evidenceRecordId, requirementKey } = await seededJourneyContext("MJ-003");
    const reason = "PP-002 evidence is rejected because currentness and scope proof are missing.";

    const response = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      decision: "INSUFFICIENT",
      evidenceRecordId,
      requirementKey,
      reason,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.noClientRelease).toBe(true);

    const evidenceResponse = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(cfoJwt),
    });
    const evidenceBody = await evidenceResponse.json();
    expect(evidenceResponse.ok(), JSON.stringify(evidenceBody)).toBe(true);
    expect(evidenceBody.evidenceSufficient).toBe(false);
    expect(evidenceBody.requirements[0]).toMatchObject({
      key: requirementKey,
      met: false,
    });
    expect(evidenceBody.requirements[0].decision).toMatchObject({
      decision: "INSUFFICIENT",
    });
    expect(evidenceBody.requirements[0].decision).not.toHaveProperty("evidenceRecordId");
    expect(evidenceBody.requirements[0].decision).not.toHaveProperty("reason");

    const internalEvidenceResponse = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(complianceJwt),
    });
    const internalEvidenceBody = await internalEvidenceResponse.json();
    expect(internalEvidenceResponse.ok(), JSON.stringify(internalEvidenceBody)).toBe(true);
    expect(internalEvidenceBody.requirements[0].decision).toMatchObject({
      decision: "INSUFFICIENT",
      evidenceRecordId,
      reason,
    });
  });

  test("turns insufficient evidence into an audited internal re-request without client release", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const journeyId = await createJourney(request, cfoJwt);
    const prisma = prismaClient();
    const reason = "PP-002 re-request asks for scoped current evidence before any release.";

    const response = await command(request, journeyId, complianceJwt, {
      command: "COMPLIANCE_REQUEST_EVIDENCE",
      reason,
    });
    const body = await response.json();
    const journey = await prisma.journeyInstance.findUniqueOrThrow({
      where: { id: journeyId },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: body.auditEventId },
    });

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.mutated).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(journey.status).toBe("BLOCKED");
    expect(journey.blockerCode).toBe("COMPLIANCE_EVIDENCE_REQUESTED");
    expect(journey.blockerReason).toBe(reason);
    expect(audit.eventType).toBe("journey.compliance.evidence_requested");
    expect(audit.result).toBe("BLOCKED");
  });
});
