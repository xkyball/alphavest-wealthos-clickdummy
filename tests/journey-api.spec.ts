import "dotenv/config";

import { execFileSync } from "node:child_process";

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
  const recommendationLink = instance.objectLinks.find((link) => link.linkRole === "RECOMMENDATION");
  const decisionLink = instance.objectLinks.find((link) => link.linkRole === "DECISION");

  if (!evidenceLink) {
    throw new Error(`Seeded ${journeyKey} journey is missing evidence link.`);
  }

  if (!recommendationLink) {
    throw new Error(`Seeded ${journeyKey} journey is missing recommendation link.`);
  }

  if (!decisionLink) {
    throw new Error(`Seeded ${journeyKey} journey is missing decision link.`);
  }

  return {
    decisionId: decisionLink.objectId,
    evidenceRecordId: evidenceLink.objectId,
    journeyId: instance.id,
    recommendationId: recommendationLink.objectId,
    requirementKey: requirement.requirementKey,
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

test.describe("Wave 0-2 Journey APIs and command execution", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("fails closed without a current-user JWT", async ({ request }) => {
    const response = await request.get("/api/journeys");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.apiState).toBe("DENIED");
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety.silentStateAdvance).toBe(false);
  });

  test("lists only scoped tenant journeys and active startable definitions", async ({ request }) => {
    const bennettJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/journeys", {
      headers: bearer(bennettJwt),
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.journeys).toHaveLength(7);
    expect(body.journeys.every((journey: { projectionType?: string }) => journey.projectionType !== "internal")).toBe(true);
    expect(body.availableDefinitions.map((definition: { journeyKey: string }) => definition.journeyKey).sort()).toEqual([
      "MJ-001",
      "MJ-002",
      "MJ-003",
      "MJ-005",
      "MJ-006",
      "MJ-010",
      "MJ-012",
    ]);
    expect(JSON.stringify(body)).not.toContain("MJ-004");
    expect(JSON.stringify(body)).not.toContain("MJ-007");

    const morganJwt = await jwtFor(request, "cfo.morgan@example.demo");
    const morganResponse = await request.get("/api/journeys", {
      headers: bearer(morganJwt),
    });
    const morganBody = await morganResponse.json();

    expect(morganResponse.ok(), JSON.stringify(morganBody)).toBe(true);
    expect(morganBody.journeys).toEqual([]);
  });

  test("creates accepted journeys and denies hold journeys", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(jwt),
    });
    const createBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.mutated).toBe(true);
    expect(createBody.detail.journeyKey).toBe("MJ-002");
    expect(createBody.detail.status).toBe("CREATED");
    expect(createBody.detail.projectionType).toBe("client");

    const holdResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-004" },
      headers: bearer(jwt),
    });
    const holdBody = await holdResponse.json();

    expect(holdResponse.status(), JSON.stringify(holdBody)).toBe(403);
    expect(holdBody.ok).toBe(false);
    expect(holdBody.mutated).toBe(false);
    expect(holdBody.issues).toContain("journey_not_executable");
  });

  test("validates command payloads before mutation", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(jwt),
    });
    const createBody = await createResponse.json();
    const journeyId = createBody.detail.id as string;

    const response = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "RUN_ANYTHING" },
      headers: bearer(jwt),
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.apiState).toBe("VALIDATION_ERROR");
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("valid_command_required");
    expect(body.safety.commandExecuted).toBe(false);
  });

  test("executes allowed commands with audit and denies unauthorized/no-skip commands", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const adminJwt = await jwtFor(request, "ava.admin@alphavest.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(cfoJwt),
    });
    const journeyId = (await createResponse.json()).detail.id as string;

    const startResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "START" },
      headers: bearer(cfoJwt),
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.mutated).toBe(true);
    expect(startBody.auditEventId).toBeTruthy();
    expect(startBody.detail.status).toBe("ACTIVE");

    const deniedResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "COMPLETE_STEP" },
      headers: bearer(cfoJwt),
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
    expect(deniedBody.safety.commandExecuted).toBe(false);

    const skipResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        command: "COMPLETE_STEP",
        fromStepKey: "release.accept_sufficiency",
      },
      headers: bearer(adminJwt),
    });
    const skipBody = await skipResponse.json();

    expect(skipResponse.status(), JSON.stringify(skipBody)).toBe(400);
    expect(skipBody.ok).toBe(false);
    expect(skipBody.mutated).toBe(false);
    expect(skipBody.safety.commandExecuted).toBe(false);

    const auditResponse = await request.get(`/api/journeys/${journeyId}/audit`, {
      headers: bearer(adminJwt),
    });
    const auditBody = await auditResponse.json();

    expect(auditResponse.ok(), JSON.stringify(auditBody)).toBe(true);
    expect(auditBody.audit).toEqual([
      expect.objectContaining({
        commandKey: "START",
        result: "SUCCESS",
      }),
    ]);
  });

  test("returns client projection and evidence sufficiency without internal leakage", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const listResponse = await request.get("/api/journeys", {
      headers: bearer(jwt),
    });
    const listBody = await listResponse.json();
    const exportJourney = listBody.journeys.find((journey: { journeyKey: string }) => journey.journeyKey === "MJ-005");

    expect(exportJourney).toBeTruthy();

    const projectionResponse = await request.get(`/api/journeys/${exportJourney.id}/client-projection`, {
      headers: bearer(jwt),
    });
    const projectionBody = await projectionResponse.json();

    expect(projectionResponse.ok(), JSON.stringify(projectionBody)).toBe(true);
    expect(projectionBody.projection.journeyKey).toBe("MJ-005");
    expect(JSON.stringify(projectionBody)).not.toMatch(/blockerReason|objectLinks|evidenceRequirements/);
    expect(projectionBody.safety.internalPayloadReturned).toBe(false);

    const evidenceResponse = await request.get(`/api/journeys/${exportJourney.id}/evidence-sufficiency`, {
      headers: bearer(jwt),
    });
    const evidenceBody = await evidenceResponse.json();

    expect(evidenceResponse.ok(), JSON.stringify(evidenceBody)).toBe(true);
    expect(evidenceBody.evidenceSufficient).toBe(true);
    expect(evidenceBody.safety).toMatchObject({
      noClientRelease: true,
      uploadIsNotSufficiency: true,
    });
  });

  test("runs MJ-001 through explicit evidence, internal draft, advisor approval and compliance release gates", async ({
    request,
  }) => {
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const advisorJwt = await jwtFor(request, "thabo.advisor@alphavest.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const { decisionId, evidenceRecordId, journeyId, recommendationId, requirementKey } = await seededJourneyContext("MJ-001");

    const intake = await command(request, journeyId, analystJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "intake.confirm_scope",
      reason: "Scope confirmed for core E2E gate.",
    });
    expect(intake.ok(), await intake.text()).toBe(true);

    const link = await command(request, journeyId, analystJwt, {
      command: "LINK_EVIDENCE",
      evidenceRecordId,
      requirementKey,
      reason: "Link uploaded evidence to MJ-001 requirement.",
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
      reason: "Evidence reviewed, current, relevant and scoped to MJ-001.",
    });
    expect(sufficient.ok(), await sufficient.text()).toBe(true);

    const draft = await command(request, journeyId, analystJwt, {
      command: "AI_DRAFT_INTERNAL",
      reason: "Internal rules draft only; not released to client.",
    });
    const draftBody = await draft.json();
    expect(draft.ok(), JSON.stringify(draftBody)).toBe(true);
    expect(draftBody.noClientRelease).toBe(true);

    const evidenceStep = await command(request, journeyId, analystJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "evidence.collect",
      reason: "Evidence gate completed after explicit sufficiency.",
    });
    expect(evidenceStep.ok(), await evidenceStep.text()).toBe(true);

    const prisma = prismaClient();
    const [decisionBeforeApproval, releaseRunBeforeApproval] = await Promise.all([
      prisma.decision.findUniqueOrThrow({
        select: {
          releasedToClientAt: true,
          status: true,
        },
        where: { id: decisionId },
      }),
      prisma.journeyCommandRun.findFirst({
        where: {
          commandKey: "COMPLIANCE_RELEASE",
          journeyInstanceId: journeyId,
          result: "SUCCESS",
        },
      }),
    ]);
    expect(decisionBeforeApproval.status).not.toBe("RELEASED_TO_CLIENT");
    expect(releaseRunBeforeApproval).toBeNull();

    const releaseWithoutAdvisor = await command(request, journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe summary cannot release before advisor approval.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Attempt release before advisor approval.",
    });
    const releaseWithoutAdvisorBody = await releaseWithoutAdvisor.json();
    expect(releaseWithoutAdvisor.status(), JSON.stringify(releaseWithoutAdvisorBody)).toBe(400);
    expect(releaseWithoutAdvisorBody.mutated).toBe(false);
    expect(releaseWithoutAdvisorBody.issues).toContain("release_preconditions_failed");
    expect(releaseWithoutAdvisorBody.issues).toContain("advisor_approval");

    const approval = await command(request, journeyId, advisorJwt, {
      command: "ADVISOR_APPROVE",
      reason: "Advisor approval completed; compliance release remains separate.",
    });
    const approvalBody = await approval.json();
    expect(approval.ok(), JSON.stringify(approvalBody)).toBe(true);
    expect(approvalBody.noClientRelease).toBe(true);
    expect(approvalBody.detail.status).not.toBe("COMPLETED");
    expect(approvalBody.clientProjection).toBeUndefined();
    expect(JSON.stringify(approvalBody)).not.toMatch(/releasedToClientAt|COMPLIANCE_RELEASED_CLIENT_SAFE/);

    const [approvedRecommendation, unreleasedDecision, releaseRunBeforeCompliance] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        select: {
          clientVisible: true,
          status: true,
        },
        where: { id: recommendationId },
      }),
      prisma.decision.findUniqueOrThrow({
        select: {
          releasedToClientAt: true,
          status: true,
        },
        where: { id: decisionId },
      }),
      prisma.journeyCommandRun.findFirst({
        where: {
          commandKey: "COMPLIANCE_RELEASE",
          journeyInstanceId: journeyId,
          result: "SUCCESS",
        },
      }),
    ]);

    expect(approvedRecommendation).toMatchObject({
      clientVisible: false,
      status: "COMPLIANCE_PENDING",
    });
    expect(unreleasedDecision.status).not.toBe("RELEASED_TO_CLIENT");
    expect(unreleasedDecision.releasedToClientAt?.toISOString() ?? null).toBe(
      decisionBeforeApproval.releasedToClientAt?.toISOString() ?? null,
    );
    expect(releaseRunBeforeCompliance).toBeNull();

    const advisorRelease = await command(request, journeyId, advisorJwt, {
      clientSafeSummary: "Advisor role must not release client-safe content.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Advisor attempts compliance release after advisor approval.",
    });
    const advisorReleaseBody = await advisorRelease.json();
    expect(advisorRelease.status(), JSON.stringify(advisorReleaseBody)).toBe(403);
    expect(advisorReleaseBody.mutated).toBe(false);
    expect(advisorReleaseBody.issues).toContain("gate_role_denied");
    expect(advisorReleaseBody.issues).toContain("compliance_release_requires_compliance_officer");

    const [recommendationAfterAdvisorReleaseAttempt, decisionAfterAdvisorReleaseAttempt] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        select: {
          clientVisible: true,
          status: true,
        },
        where: { id: recommendationId },
      }),
      prisma.decision.findUniqueOrThrow({
        select: {
          releasedToClientAt: true,
          status: true,
        },
        where: { id: decisionId },
      }),
    ]);

    expect(recommendationAfterAdvisorReleaseAttempt).toMatchObject({
      clientVisible: false,
      status: "COMPLIANCE_PENDING",
    });
    expect(decisionAfterAdvisorReleaseAttempt.status).not.toBe("RELEASED_TO_CLIENT");
    expect(decisionAfterAdvisorReleaseAttempt.releasedToClientAt?.toISOString() ?? null).toBe(
      decisionBeforeApproval.releasedToClientAt?.toISOString() ?? null,
    );

    const reviewStep = await command(request, journeyId, advisorJwt, {
      command: "COMPLETE_STEP",
      fromStepKey: "review.human_approval",
      reason: "Human review step complete; hand to compliance.",
    });
    expect(reviewStep.ok(), await reviewStep.text()).toBe(true);

    const missingPayload = await command(request, journeyId, complianceJwt, {
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Attempt release without client-safe payload.",
    });
    const missingPayloadBody = await missingPayload.json();
    expect(missingPayload.status(), JSON.stringify(missingPayloadBody)).toBe(400);
    expect(missingPayloadBody.mutated).toBe(false);
    expect(missingPayloadBody.issues).toContain("release_preconditions_failed");
    expect(missingPayloadBody.issues).toContain("payload_ready");

    const missingPhrase = await command(request, journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe liquidity governance next step.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE",
      reason: "Attempt release with wrong confirmation phrase.",
    });
    const missingPhraseBody = await missingPhrase.json();
    expect(missingPhrase.status(), JSON.stringify(missingPhraseBody)).toBe(400);
    expect(missingPhraseBody.mutated).toBe(false);
    expect(missingPhraseBody.issues).toContain("release_preconditions_failed");
    expect(missingPhraseBody.issues).toContain("release_confirmation_phrase");

    const auditUnavailable = await command(request, journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe liquidity governance next step.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Attempt release while audit persistence is unavailable.",
      simulateAuditPersistenceFailure: true,
    });
    const auditUnavailableBody = await auditUnavailable.json();
    expect(auditUnavailable.status(), JSON.stringify(auditUnavailableBody)).toBe(409);
    expect(auditUnavailableBody.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(auditUnavailableBody.mutated).toBe(false);
    expect(auditUnavailableBody.noClientRelease).toBe(true);

    const [recommendationAfterAuditOutage, decisionAfterAuditOutage, releaseRunAfterAuditOutage] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        select: {
          clientVisible: true,
          status: true,
        },
        where: { id: recommendationId },
      }),
      prisma.decision.findUniqueOrThrow({
        select: {
          releasedToClientAt: true,
          status: true,
        },
        where: { id: decisionId },
      }),
      prisma.journeyCommandRun.findFirst({
        where: {
          commandKey: "COMPLIANCE_RELEASE",
          journeyInstanceId: journeyId,
          result: "SUCCESS",
        },
      }),
    ]);

    expect(recommendationAfterAuditOutage).toMatchObject({
      clientVisible: false,
      status: "COMPLIANCE_PENDING",
    });
    expect(decisionAfterAuditOutage.status).not.toBe("RELEASED_TO_CLIENT");
    expect(decisionAfterAuditOutage.releasedToClientAt?.toISOString() ?? null).toBe(
      decisionBeforeApproval.releasedToClientAt?.toISOString() ?? null,
    );
    expect(releaseRunAfterAuditOutage).toBeNull();

    const release = await command(request, journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe liquidity governance next step.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Compliance release after evidence, advisor and audit gates.",
    });
    const releaseBody = await release.json();
    expect(release.ok(), JSON.stringify(releaseBody)).toBe(true);
    expect(releaseBody.noClientRelease).toBe(false);
    expect(releaseBody.detail.status).toBe("COMPLETED");

    const clientProjection = await request.get(`/api/journeys/${journeyId}/client-projection`, {
      headers: bearer(cfoJwt),
    });
    const clientProjectionBody = await clientProjection.json();
    expect(clientProjection.ok(), JSON.stringify(clientProjectionBody)).toBe(true);
    expect(clientProjectionBody.projection.status).toBe("COMPLETE");
    expect(clientProjectionBody.safety.internalPayloadReturned).toBe(false);
    expect(JSON.stringify(clientProjectionBody)).not.toMatch(/internalRationale|objectLinks|complianceNotes/);
  });

  test("keeps upload-only, advisor-only, admin and cross-tenant paths fail-closed", async ({ request }) => {
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const advisorJwt = await jwtFor(request, "thabo.advisor@alphavest.demo");
    const adminJwt = await jwtFor(request, "ava.admin@alphavest.demo");
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const morganJwt = await jwtFor(request, "cfo.morgan@example.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const {
      evidenceRecordId,
      journeyId: seededJourneyId,
      recommendationId: seededRecommendationId,
      requirementKey,
    } = await seededJourneyContext("MJ-003");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-003" },
      headers: bearer(cfoJwt),
    });
    const createBody = await createResponse.json();
    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    const journeyId = createBody.detail.id as string;

    const crossTenant = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(morganJwt),
    });
    const crossTenantBody = await crossTenant.json();
    expect(crossTenant.status(), JSON.stringify(crossTenantBody)).toBe(403);
    expect(crossTenantBody.apiState).toBe("DENIED");
    expect(crossTenantBody.reasonCode).toBe("SCOPE_DENIED");
    expect(crossTenantBody.mutated).toBe(false);

    const unreviewed = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      decision: "SUFFICIENT",
      evidenceRecordId,
      requirementKey,
      reason: "Try sufficiency without reviewed scoped evidence.",
    });
    const unreviewedBody = await unreviewed.json();
    expect(unreviewed.status(), JSON.stringify(unreviewedBody)).toBe(400);
    expect(unreviewedBody.issues).toContain("evidence_review_preconditions_failed");
    expect(unreviewedBody.mutated).toBe(false);

    const analystSufficiency = await command(request, journeyId, analystJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      currentnessConfirmed: true,
      decision: "SUFFICIENT",
      evidenceRecordId,
      relevanceConfirmed: true,
      requirementKey,
      reviewed: true,
      scopeMatches: true,
      reason: "Analyst may prepare review but cannot make the final sufficiency decision.",
    });
    const analystSufficiencyBody = await analystSufficiency.json();
    expect(analystSufficiency.status(), JSON.stringify(analystSufficiencyBody)).toBe(403);
    expect(analystSufficiencyBody.mutated).toBe(false);
    expect(analystSufficiencyBody.issues).toContain("gate_role_denied");
    expect(analystSufficiencyBody.issues).toContain("decide_evidence_sufficiency_requires_compliance_officer");

    const prisma = prismaClient();
    const decisionCountBefore = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });
    const auditFailure = await command(request, journeyId, complianceJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      decision: "INSUFFICIENT",
      evidenceRecordId,
      requirementKey,
      reason: "Audit persistence failure must block evidence decision mutation.",
      simulateAuditPersistenceFailure: true,
    });
    const auditFailureBody = await auditFailure.json();
    const decisionCountAfter = await prisma.evidenceSufficiencyDecision.count({
      where: { journeyInstanceId: journeyId, requirementKey },
    });
    expect(auditFailure.status(), JSON.stringify(auditFailureBody)).toBe(409);
    expect(auditFailureBody.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(auditFailureBody.mutated).toBe(false);
    expect(auditFailureBody.safety.commandExecuted).toBe(false);
    expect(decisionCountAfter).toBe(decisionCountBefore);

    const adminSufficiency = await command(request, journeyId, adminJwt, {
      command: "DECIDE_EVIDENCE_SUFFICIENCY",
      currentnessConfirmed: true,
      decision: "SUFFICIENT",
      evidenceRecordId,
      relevanceConfirmed: true,
      requirementKey,
      reviewed: true,
      scopeMatches: true,
      reason: "Admin must not force sufficiency.",
    });
    const adminSufficiencyBody = await adminSufficiency.json();
    expect(adminSufficiency.status(), JSON.stringify(adminSufficiencyBody)).toBe(403);
    expect(adminSufficiencyBody.issues).toContain("admin_non_bypass");

    const approval = await command(request, journeyId, advisorJwt, {
      command: "ADVISOR_APPROVE",
      reason: "Advisor approval alone must not release.",
    });
    expect(approval.ok(), await approval.text()).toBe(true);

    const releaseWithoutEvidence = await command(request, journeyId, complianceJwt, {
      clientSafeSummary: "Client-safe summary cannot release without evidence sufficiency.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Attempt release before evidence gate.",
    });
    const releaseWithoutEvidenceBody = await releaseWithoutEvidence.json();
    expect(releaseWithoutEvidence.status(), JSON.stringify(releaseWithoutEvidenceBody)).toBe(400);
    expect(releaseWithoutEvidenceBody.issues).toContain("release_preconditions_failed");
    expect(releaseWithoutEvidenceBody.issues).toContain(`evidence_sufficiency:${requirementKey}`);

    const adminRelease = await command(request, journeyId, adminJwt, {
      clientSafeSummary: "Admin cannot release.",
      command: "COMPLIANCE_RELEASE",
      confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
      reason: "Admin must not force release.",
    });
    const adminReleaseBody = await adminRelease.json();
    expect(adminRelease.status(), JSON.stringify(adminReleaseBody)).toBe(403);
    expect(adminReleaseBody.issues).toContain("admin_non_bypass");

    const requestEvidence = await command(request, seededJourneyId, complianceJwt, {
      command: "COMPLIANCE_REQUEST_EVIDENCE",
      reason: "Compliance requests more evidence instead of release.",
    });
    const requestEvidenceBody = await requestEvidence.json();
    expect(requestEvidence.ok(), JSON.stringify(requestEvidenceBody)).toBe(true);
    expect(requestEvidenceBody.noClientRelease).toBe(true);
    expect(requestEvidenceBody.detail.status).toBe("BLOCKED");
    expect(JSON.stringify(requestEvidenceBody)).not.toMatch(/clientProjection|COMPLIANCE_RELEASED_CLIENT_SAFE/);

    const [evidenceRequestRecommendation, evidenceRequestReview, evidenceRequestAudit] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        select: {
          clientVisible: true,
          status: true,
        },
        where: { id: seededRecommendationId },
      }),
      prisma.complianceReview.findFirstOrThrow({
        select: {
          evidenceComplete: true,
          status: true,
        },
        where: {
          targetId: seededRecommendationId,
          targetType: "RECOMMENDATION",
        },
      }),
      prisma.auditEvent.findUniqueOrThrow({
        select: {
          eventType: true,
          metadataJson: true,
          result: true,
        },
        where: { id: requestEvidenceBody.auditEventId as string },
      }),
    ]);

    expect(evidenceRequestRecommendation).toMatchObject({
      clientVisible: false,
      status: "MORE_DATA_REQUESTED",
    });
    expect(evidenceRequestReview).toMatchObject({
      evidenceComplete: false,
      status: "NEEDS_EVIDENCE",
    });
    expect(evidenceRequestAudit).toMatchObject({
      eventType: "journey.compliance.evidence_requested",
      result: "BLOCKED",
    });
    expect(evidenceRequestAudit.metadataJson).toMatchObject({
      blockerCode: "COMPLIANCE_EVIDENCE_REQUESTED",
      clientVisible: false,
    });

    const block = await command(request, seededJourneyId, complianceJwt, {
      command: "COMPLIANCE_BLOCK",
      reason: "Compliance blocks unsafe release path.",
    });
    const blockBody = await block.json();
    expect(block.ok(), JSON.stringify(blockBody)).toBe(true);
    expect(blockBody.noClientRelease).toBe(true);
    expect(blockBody.detail.status).toBe("BLOCKED");
    expect(JSON.stringify(blockBody)).not.toMatch(/clientProjection|COMPLIANCE_RELEASED_CLIENT_SAFE/);

    const [blockedRecommendation, blockedReview, blockedAudit] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        select: {
          clientVisible: true,
          status: true,
        },
        where: { id: seededRecommendationId },
      }),
      prisma.complianceReview.findFirstOrThrow({
        select: {
          evidenceComplete: true,
          status: true,
        },
        where: {
          targetId: seededRecommendationId,
          targetType: "RECOMMENDATION",
        },
      }),
      prisma.auditEvent.findUniqueOrThrow({
        select: {
          eventType: true,
          metadataJson: true,
          result: true,
        },
        where: { id: blockBody.auditEventId as string },
      }),
    ]);

    expect(blockedRecommendation).toMatchObject({
      clientVisible: false,
      status: "BLOCKED",
    });
    expect(blockedReview).toMatchObject({
      evidenceComplete: false,
      status: "BLOCKED",
    });
    expect(blockedAudit).toMatchObject({
      eventType: "journey.compliance.blocked",
      result: "BLOCKED",
    });
    expect(blockedAudit.metadataJson).toMatchObject({
      blockerCode: "COMPLIANCE_BLOCKED",
      clientVisible: false,
    });
  });
});
