import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

const demoTargets = {
  morgan: {
    evidenceId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    recommendationId: "7788c210-4907-5d7e-a27b-ddd07898d893",
  },
  northbridge: {
    evidenceId: "de155b08-f7f4-5c92-ba52-93a646658d53",
    recommendationId: "3f164151-0bc4-54ff-a5a4-b7521c41826b",
  },
  summit: {
    evidenceId: "cd681455-89ef-5ebb-96c7-8464f0dcb721",
    recommendationId: "b0b09a4b-8067-530d-a45a-2ad04d9c4b1d",
  },
};

const workflowActions = [
  "j02.requestEvidence",
  "j02.confirmRequestEvidence",
  "j02.blockRelease",
  "j02.releaseClient",
  "j03.requestMoreInformation",
  "j03.deferDecision",
  "j03.rejectDecision",
  "j03.acceptOption",
  "j03.viewEvidenceRecord",
  "j03.downloadEvidence",
  "j04.portalUpload",
  "j04.openUploadDocument",
  "j04.uploadDocument",
  "j04.confirmFinalize",
  "j04.viewDetails",
  "j05.createEntity",
  "j05.continueEntity",
  "j05.editEntity",
  "j05.viewDetails",
  "j05.markReady",
  "j05.requestInfo",
  "j06.newTenant",
  "j06.continueTenant",
  "j06.assignTeam",
  "j06.openInvitation",
  "j06.sendInvitation",
  "j07.inviteUser",
  "j07.sendInvitation",
  "j07.saveRoleChanges",
  "j07.approveAccess",
  "j07.exportAudit",
  "j08.selectDataExtract",
  "j08.clearScope",
  "j08.confirmApproval",
  "j08.downloadExport",
  "j08.shareExport",
  "j09.portalUpload",
  "j09.submitProfile",
  "j09.addMember",
  "j09.saveFamilyChanges",
  "j09.openFamilyMap",
  "j09.addRelationship",
  "j12.requestKycEvidence",
  "j12.completeKycReview",
  "j12.escalateSourceOfWealth",
  "j12.linkSourceEvidence",
  "j13.requestSuitabilityEvidence",
  "j13.markSuitabilityReviewed",
  "j14.requestIpsMandateChanges",
  "j14.linkIpsEvidence",
];

test.describe("demo workflow API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for demo workflow API tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("implemented journey actions return successful mutation responses", async ({ request }) => {
    for (const actionId of workflowActions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.actionId).toBe(actionId);
      expect(body.result).toBeTruthy();
    }
  });

  test("rejects malformed action payloads with validation issues", async ({ request }) => {
    const invalidPayloads = [{}, { actionId: 42 }, { actionId: "releaseClient" }];

    for (const payload of invalidPayloads) {
      const response = await request.post("/api/demo-workflow", {
        data: payload,
      });
      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(400);
      expect(body.error).toBe("Invalid demo workflow request.");
      expect(body.issues?.[0]?.field).toBe("actionId");
      expect(body.issues?.[0]?.code).toBe("invalid_action_id");
      expect(body.mutated).toBe(false);
      expect(body.noClientRelease).toBe(true);
      expect(body.ok).toBe(false);
    }
  });

  test("malformed JSON body fails closed without mutation or client release", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: "[",
      headers: {
        "content-type": "application/json",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.error).toBe("Invalid demo workflow request.");
    expect(body.issues?.[0]?.code).toBe("invalid_body");
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.ok).toBe(false);
  });

  test("Phase B J12 KYC workflow actions return evidence and audit boundaries", async ({ request }) => {
    const actions = [
      "j12.requestKycEvidence",
      "j12.completeKycReview",
      "j12.escalateSourceOfWealth",
      "j12.linkSourceEvidence",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.evidenceRecordId).toBeTruthy();
      expect(body.result.evidenceItemId).toBeTruthy();
      expect(body.result.clientVisible).toBe(false);
    }
  });

  test("Phase C J13/J14 Suitability and IPS actions keep advice visibility blocked", async ({ request }) => {
    const actions = [
      "j13.requestSuitabilityEvidence",
      "j13.markSuitabilityReviewed",
      "j14.requestIpsMandateChanges",
      "j14.linkIpsEvidence",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.evidenceRecordId).toBeTruthy();
      expect(body.result.evidenceItemId).toBeTruthy();
      expect(body.result.clientVisible).toBe(false);
      expect(body.result.gateName).toBe("NO_UNAPPROVED_ADVICE");
      expect(body.result.gatePassed).toBe(false);
      expect(body.result.gateMissing).toContain("compliance_release");
      expect(body.result.gateMissing).toContain("ips_mandate_acknowledged");
    }
  });

  test.describe.serial("typed recommendation review workflow", () => {
    test.beforeEach(() => {
      execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    });

    test("submit review persists analyst review state and reload proof", async ({ request }) => {
      const response = await request.post("/api/demo-workflow", {
        data: {
          action: "submit_review",
          actorRole: "analyst",
          reason: "Analyst submitted the review package.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.result.mutated).toBe(true);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.ANALYST_REVIEWED);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

      const recommendation = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      });
      const approval = await prisma.approval.findFirstOrThrow({
        where: {
          targetId: demoTargets.northbridge.recommendationId,
          targetType: ObjectType.RECOMMENDATION,
        },
      });

      expect(recommendation.status).toBe(RecommendationStatus.ANALYST_REVIEWED);
      expect(recommendation.clientVisible).toBe(false);
      expect(approval.status).toBe(ReviewStatus.IN_REVIEW);
    });

    test("advisor approval persists without client release", async ({ request }) => {
      const response = await request.post("/api/demo-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "senior_wealth_advisor",
          reason: "Advisor approved; compliance release remains required.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.reloadedState.advisorApproval.status).toBe(ReviewStatus.APPROVED);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.ADVISOR_APPROVED);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

      const recommendation = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      });

      expect(recommendation.clientVisible).toBe(false);
    });

    test("compliance release fails before prerequisites and persists after gates pass", async ({ request }) => {
      const blockedResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: "RELEASE TO CLIENT",
          evidenceIds: [demoTargets.northbridge.evidenceId],
          reason: "Attempt release without prerequisites.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const blockedBody = await blockedResponse.json();

      expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);

      const blockedRecommendation = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      });

      expect(blockedRecommendation.clientVisible).toBe(false);
      expect(blockedRecommendation.status).not.toBe(RecommendationStatus.RELEASED_TO_CLIENT);

      const invalidConfirmationResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: "CONFIRM",
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Invalid confirmation should fail before mutation.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const invalidConfirmationBody = await invalidConfirmationResponse.json();

      expect(invalidConfirmationResponse.status(), JSON.stringify(invalidConfirmationBody)).toBe(400);
      expect(invalidConfirmationBody.mutated).toBe(false);
      expect(invalidConfirmationBody.noClientRelease).toBe(true);

      const summitBeforeRelease = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.summit.recommendationId },
      });

      expect(summitBeforeRelease.clientVisible).toBe(false);
      expect(summitBeforeRelease.status).toBe(RecommendationStatus.ADVISOR_APPROVED);

      const releaseResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: "RELEASE TO CLIENT",
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Compliance release after advisor approval, evidence and permission gates.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const releaseBody = await releaseResponse.json();

      expect(releaseResponse.ok(), JSON.stringify(releaseBody)).toBe(true);
      expect(releaseBody.noClientRelease).toBe(false);
      expect(releaseBody.result.gatePassed).toBe(true);
      expect(releaseBody.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.RELEASED_TO_CLIENT,
      );
      expect(releaseBody.result.reloadedState.complianceReview.status).toBe(ComplianceStatus.RELEASED);

      const audit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: releaseBody.result.auditEventId },
      });

      expect(audit.result).toBe(AuditResult.SUCCESS);
      expect(audit.targetType).toBe(ObjectType.RECOMMENDATION);
      expect(audit.eventType).toBe("recommendation_review.compliance_release");
    });

    test("compliance block prevents client visibility and records audit", async ({ request }) => {
      const response = await request.post("/api/demo-workflow", {
        data: {
          action: "compliance_block",
          actorRole: "compliance_officer",
          confirmationText: "BLOCK RELEASE",
          evidenceIds: [demoTargets.morgan.evidenceId],
          reason: "Compliance block proof.",
          targetId: demoTargets.morgan.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.BLOCKED);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);
      expect(body.result.reloadedState.complianceReview.status).toBe(ComplianceStatus.BLOCKED);

      const audit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: body.result.auditEventId },
      });

      expect(audit.result).toBe(AuditResult.BLOCKED);
      expect(audit.reason).toBe("Compliance block proof.");
    });

    test("request evidence persists reason and comment state", async ({ request }) => {
      const reason = "Need refreshed tax certificate and source proof before release.";
      const response = await request.post("/api/demo-workflow", {
        data: {
          action: "request_evidence",
          actorRole: "compliance_officer",
          confirmationText: "REQUEST EVIDENCE",
          evidenceIds: [demoTargets.morgan.evidenceId],
          reason,
          targetId: demoTargets.morgan.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.MORE_DATA_REQUESTED,
      );
      expect(body.result.reloadedState.complianceReview.status).toBe(ComplianceStatus.NEEDS_EVIDENCE);
      expect(body.result.reloadedState.complianceReview.releaseNotes).toBe(reason);

      const complianceReview = await prisma.complianceReview.findFirstOrThrow({
        where: {
          targetId: demoTargets.morgan.recommendationId,
          targetType: ObjectType.RECOMMENDATION,
        },
      });

      expect(complianceReview.releaseNotes).toBe(reason);
    });

    test("wrong role, action and object fail closed", async ({ request }) => {
      const wrongRoleResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "analyst",
          reason: "Analyst should not approve.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const wrongRoleBody = await wrongRoleResponse.json();

      expect(wrongRoleResponse.ok(), JSON.stringify(wrongRoleBody)).toBe(true);
      expect(wrongRoleBody.result.mutated).toBe(false);
      expect(wrongRoleBody.result.permission.allowed).toBe(false);

      const deniedAudit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: wrongRoleBody.result.auditEventId },
      });

      expect(deniedAudit.result).toBe(AuditResult.DENIED);

      const wrongActionResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "publish",
          actorRole: "compliance_officer",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "recommendation-review",
        },
      });
      const wrongActionBody = await wrongActionResponse.json();

      expect(wrongActionResponse.status(), JSON.stringify(wrongActionBody)).toBe(400);
      expect(wrongActionBody.issues?.[0]?.field).toBe("action");

      const wrongObjectResponse = await request.post("/api/demo-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: "RELEASE TO CLIENT",
          targetId: "96705b67-40b2-5fb8-aa69-a3f2c106025e",
          workflowType: "recommendation-review",
        },
      });
      const wrongObjectBody = await wrongObjectResponse.json();

      expect(wrongObjectResponse.status(), JSON.stringify(wrongObjectBody)).toBe(404);
      expect(wrongObjectBody.mutated).toBe(false);
      expect(wrongObjectBody.noClientRelease).toBe(true);
    });
  });
});
