import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  DraftClassificationKind,
  DraftRiskLevel,
  EvidenceStatus,
  InternalDraftStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
} from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import { stableId } from "../lib/stable-id";
import { scfCriticalGateAuditContract } from "../lib/audit-service";
import {
  wp05CanonicalJourneyCommandApiRoute,
  wp05ComplianceReleaseConfirmationPhrase,
  wp05LegacyDemoReleaseActionDirectness,
} from "../lib/advisory-workflow-contract";

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

const bennettDecisionId = stableId("decision:bennett:liquidity-review");
const bennettRecommendationId = stableId("recommendation:bennett:liquidity-review");
const summitDecisionId = stableId("decision:summit:liquidity-review");
const safeExportPayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`demo-workflow-export-boundary:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

async function createGeneratedExport(request: APIRequestContext, label: string) {
  const scope = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for demo workflow boundary proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem(label)],
    tenantSlug: "summit",
  });
  const scopeBody = await scope.json();

  expect(scope.ok(), JSON.stringify(scopeBody)).toBe(true);

  const exportRequestId = scopeBody.exportRequestId as string;
  for (const command of ["VALIDATE_REDACTION", "PREVIEW", "APPROVE", "GENERATE"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Run ${command.toLowerCase()} through canonical export workflow API.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
    if (command === "GENERATE") return body as { auditEventId: string; status: string };
  }

  throw new Error("Export generation proof did not return.");
}

const workflowActions = [
  "j01.requestData",
] as const;

const advisorReviewActions = ["j01.routeToAdvisor", "j01.escalateAdvisor"] as const;

const adviceReleaseHistoryActions = [
  "j02.requestEvidence",
  "j02.confirmRequestEvidence",
  "j02.blockRelease",
  "j02.releaseClient",
  "j02.exportControlled",
  "j03.requestMoreInformation",
  "j03.deferDecision",
  "j03.rejectDecision",
  "j03.acceptOption",
  "j03.viewEvidenceRecord",
  "j03.downloadEvidence",
] as const;

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

  test("implemented J01 compatibility actions return successful demo-only mutation responses", async ({ request }) => {
    for (const actionId of workflowActions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.actionId).toBe(actionId);
      expect(body.demoOnly).toBe(true);
      expect(body.productCommandAllowed).toBe(false);
      expect(body.demoWorkflowBoundary).toMatchObject({
        allowedOnDemoWorkflow: true,
        classification: "DEMO_ONLY_COMPATIBILITY",
        productCommandAllowed: false,
        reasonCode: "SCREENCAST_DEMO_ACTION_ONLY",
      });
      expect(body.result).toBeTruthy();

      if (Object.prototype.hasOwnProperty.call(wp05LegacyDemoReleaseActionDirectness, actionId)) {
        expect(body.proofDirectness).toMatchObject({
          canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
          classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
          pp004CanonicalProofEligible: false,
          proofBackedByStatePayloadAssertions: false,
        });
      } else {
        expect(body.proofDirectness).toBeUndefined();
      }
    }
  });

  test("legacy J01 route/escalate advisor-review actions are retired to advisor-review commands", async ({ request }) => {
    for (const actionId of advisorReviewActions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.reasonCode).toBe("SAFE_ERROR");
      expect(body.legacyReasonCode).toBe("ADVISOR_REVIEW_WORKFLOW_ACTIONS_MOVED");
      expect(body.canonicalApiRoute).toBe("/api/advisor-review/actions");
      expect(body.demoWorkflowBoundary).toMatchObject({
        allowedOnDemoWorkflow: false,
        canonicalApiRoute: "/api/advisor-review/actions",
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        productCommandAllowed: true,
        reasonCode: "ADVISOR_REVIEW_WORKFLOW_ACTIONS_MOVED",
      });
      expect(body.safety).toMatchObject({
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: false,
      });
      expect(body.result).toBeUndefined();
      expect(body.mutated).toBeFalsy();
    }
  });

  test("legacy J01 approve advisor action is retired to advisor approval workflow API", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "j01.approveAdvisor" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(410);
    expect(body.reasonCode).toBe("SAFE_ERROR");
    expect(body.legacyReasonCode).toBe("ADVISOR_APPROVAL_WORKFLOW_MOVED");
    expect(body.canonicalApiRoute).toBe("/api/recommendation-review-workflow");
    expect(body.demoWorkflowBoundary).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/recommendation-review-workflow",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "ADVISOR_APPROVAL_WORKFLOW_MOVED",
    });
    expect(body.mutated).toBe(false);
  });

  test("legacy advice and release-history demo actions are retired to the typed API", async ({ request }) => {
    for (const actionId of adviceReleaseHistoryActions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.reasonCode).toBe("SAFE_ERROR");
      expect(body.legacyReasonCode).toBe("ADVICE_RELEASE_HISTORY_ACTIONS_MOVED");
      expect(body.canonicalApiRoute).toBe("/api/advice-release-history/actions");
      expect(body.demoWorkflowBoundary).toMatchObject({
        allowedOnDemoWorkflow: false,
        canonicalApiRoute: "/api/advice-release-history/actions",
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        productCommandAllowed: true,
        reasonCode: "ADVICE_RELEASE_HISTORY_ACTIONS_MOVED",
      });
      expect(body.mutated).toBe(false);
      expect(body.noClientRelease).toBe(true);
      expect(body.safety).toMatchObject({
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: false,
      });
    }
  });

  test("typed advice and release-history API executes controlled J02/J03 commands", async ({ request }) => {
    const requestEvidence = await request.post("/api/advice-release-history/actions", {
      data: { actionId: "j02.requestEvidence" },
    });
    const requestEvidenceBody = await requestEvidence.json();

    expect(requestEvidence.ok(), JSON.stringify(requestEvidenceBody)).toBe(true);
    expect(requestEvidenceBody.canonicalApiRoute).toBe("/api/advice-release-history/actions");
    expect(requestEvidenceBody.command).toBe("COMPLIANCE_REQUEST_EVIDENCE");
    expect(requestEvidenceBody.noAdviceExecution).toBe(true);
    expect(requestEvidenceBody.noClientRelease).toBe(true);
    expect(requestEvidenceBody.safety).toMatchObject({
      commandExecuted: true,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: true,
    });

    const controlledExport = await request.post("/api/advice-release-history/actions", {
      data: { actionId: "j02.exportControlled" },
    });
    const controlledExportBody = await controlledExport.json();

    expect(controlledExport.ok(), JSON.stringify(controlledExportBody)).toBe(true);
    expect(controlledExportBody.command).toBe("RELEASE_HISTORY_EXPORT_CONTROLLED");
    expect(controlledExportBody.noClientRelease).toBe(true);
    expect(controlledExportBody.result).toMatchObject({
      exportApproved: false,
      exportDownloadCreated: false,
    });

    const controlledAudit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: controlledExportBody.result.auditEventId },
    });
    expect(controlledAudit.eventType).toBe("advice_release_history.release_history.export_controlled");
    expect(controlledAudit.targetType).toBe(ObjectType.EXPORT_REQUEST);
  });

  test("legacy J08 export demo actions are retired in favor of the typed export workflow API", async ({ request }) => {
    for (const actionId of ["j08.selectDataExtract", "j08.clearScope", "j08.confirmApproval", "j08.downloadExport", "j08.shareExport"]) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.reasonCode).toBe("SAFE_ERROR");
      expect(body.legacyReasonCode).toBe("LEGACY_EXPORT_DEMO_ACTION_RETIRED");
      expect(body.canonicalApiRoute).toBe("/api/export-workflow");
      expect(body.demoWorkflowBoundary).toMatchObject({
        allowedOnDemoWorkflow: false,
        canonicalApiRoute: "/api/export-workflow",
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        productCommandAllowed: true,
        reasonCode: "LEGACY_EXPORT_DEMO_ACTION_RETIRED",
      });
      expect(body.mutated).toBe(false);
      expect(body.noClientRelease).toBe(true);
      expect(body.safety.commandExecuted).toBe(false);
      expect(body.safety.noExportApproval).toBe(true);
      expect(body.safety.noExportDownload).toBe(true);
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

  test("Phase 6 decision record actions require audit persistence and write minimum audit fields", async ({ request }) => {
    await prisma.decision.update({
      data: {
        decisionAction: null,
        decisionAt: null,
        decisionByUserId: null,
        decisionReason: null,
        releasedToClientAt: new Date("2026-06-20T10:00:00.000Z"),
        status: DecisionStatus.RELEASED_TO_CLIENT,
      },
      where: { id: bennettDecisionId },
    });
    await prisma.recommendation.update({
      data: {
        clientVisible: true,
        status: RecommendationStatus.RELEASED_TO_CLIENT,
      },
      where: { id: bennettRecommendationId },
    });

    const auditCountBeforeFailure = await prisma.auditEvent.count({
      where: { eventType: "advice_release_history.decision.accepted" },
    });
    const failureResponse = await request.post("/api/advice-release-history/actions", {
      data: {
        actionId: "j03.acceptOption",
        simulateAuditPersistenceFailure: true,
      },
    });
    const failureBody = await failureResponse.json();
    const auditCountAfterFailure = await prisma.auditEvent.count({
      where: { eventType: "advice_release_history.decision.accepted" },
    });
    const unchangedDecision = await prisma.decision.findUniqueOrThrow({
      where: { id: bennettDecisionId },
    });

    expect(failureResponse.status(), JSON.stringify(failureBody)).toBe(409);
    expect(failureBody.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(failureBody.mutated).toBe(false);
    expect(failureBody.noClientRelease).toBe(true);
    expect(auditCountAfterFailure).toBe(auditCountBeforeFailure);
    expect(unchangedDecision.status).toBe(DecisionStatus.RELEASED_TO_CLIENT);
    expect(unchangedDecision.decisionAction).toBeNull();
    expect(unchangedDecision.decisionAt).toBeNull();

    const successResponse = await request.post("/api/advice-release-history/actions", {
      data: { actionId: "j03.acceptOption" },
    });
    const successBody = await successResponse.json();

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(successBody.canonicalApiRoute).toBe("/api/advice-release-history/actions");
    expect(successBody.command).toBe("CLIENT_DECISION_ACCEPT");
    expect(successBody.result.decisionRows).toBe(1);
    expect(successBody.result.auditRows).toBe(1);
    expect(successBody.result.gatePassed).toBe(true);

    const decision = await prisma.decision.findUniqueOrThrow({
      where: { id: bennettDecisionId },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: successBody.result.auditEventId },
    });
    const metadata = audit.metadataJson as {
      auditContract?: string;
      auditMinimumFields?: string[];
      criticalActionFamily?: string;
      decisionRecord?: {
        action?: string;
        decisionId?: string;
        nextStatus?: string;
        previousStatus?: string;
        recommendationId?: string;
      };
      failClosedOnAuditPersistence?: boolean;
      phasePackage?: string;
    } | null;

    expect(decision.status).toBe(DecisionStatus.ACCEPTED);
    expect(decision.decisionAction).toBe("accept");
    expect(decision.decisionAt).toBeTruthy();
    expect(decision.decisionByUserId).toBeTruthy();
    expect(audit.targetType).toBe(ObjectType.DECISION);
    expect(audit.targetId).toBe(bennettDecisionId);
    expect(audit.previousState).toBe(DecisionStatus.RELEASED_TO_CLIENT);
    expect(audit.nextState).toBe(DecisionStatus.ACCEPTED);
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.actorRoleKey).toBe("principal");
    expect(metadata?.auditContract).toBe(scfCriticalGateAuditContract);
    expect(metadata?.criticalActionFamily).toBe("review");
    expect(metadata?.failClosedOnAuditPersistence).toBe(true);
    expect(metadata?.phasePackage).toBe("BP-09");
    expect(metadata?.decisionRecord).toMatchObject({
      action: "accept",
      decisionId: bennettDecisionId,
      nextStatus: DecisionStatus.ACCEPTED,
      previousStatus: DecisionStatus.RELEASED_TO_CLIENT,
      recommendationId: bennettRecommendationId,
    });
    expect(metadata?.auditMinimumFields).toEqual(
      expect.arrayContaining(["actorUserId", "actorRoleKey", "targetId", "previousState", "nextState", "result", "reason"]),
    );
  });

  test("legacy demo workflow retires Phase B/C actions to typed journey commands", async ({ request }) => {
    const actions = [
      "j12.requestKycEvidence",
      "j12.completeKycReview",
      "j12.escalateSourceOfWealth",
      "j12.linkSourceEvidence",
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

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.canonicalApiRoute).toBe("/api/journeys/[id]/commands");
      expect(body.demoWorkflowBoundary).toMatchObject({
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        reasonCode: "PHASE_B_C_JOURNEY_COMMANDS_MOVED",
      });
      expect(body.noClientRelease).toBe(true);
      expect(body.error).toContain("typed journey command API");
    }
  });

  test("legacy demo workflow retires tenant governance actions to typed tenant governance commands", async ({ request }) => {
    const actions = [
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
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.canonicalApiRoute).toBe("/api/tenant-governance/actions");
      expect(body.legacyReasonCode).toBe("TENANT_GOVERNANCE_ACTIONS_MOVED");
      expect(body.demoWorkflowBoundary).toMatchObject({
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        reasonCode: "TENANT_GOVERNANCE_ACTIONS_MOVED",
      });
      expect(body.noClientRelease).toBe(true);
      expect(body.safety).toMatchObject({
        commandExecuted: false,
        noAdviceExecution: true,
        noClientRelease: true,
      });
      expect(body.error).toContain("/api/tenant-governance/actions");
    }
  });

  test("legacy demo workflow retires data maintenance actions to typed data maintenance commands", async ({ request }) => {
    const actions = [
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
      "j09.portalUpload",
      "j09.submitProfile",
      "j09.addMember",
      "j09.saveFamilyChanges",
      "j09.openFamilyMap",
      "j09.addRelationship",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.canonicalApiRoute).toBe("/api/data-maintenance/actions");
      expect(body.legacyReasonCode).toBe("DATA_MAINTENANCE_ACTIONS_MOVED");
      expect(body.demoWorkflowBoundary).toMatchObject({
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        reasonCode: "DATA_MAINTENANCE_ACTIONS_MOVED",
      });
      expect(body.noClientRelease).toBe(true);
      expect(body.safety).toMatchObject({
        commandExecuted: false,
        noAdviceExecution: true,
        noClientRelease: true,
      });
      expect(body.error).toContain("/api/data-maintenance/actions");
    }
  });

  test("legacy demo workflow retires platform admin actions to typed platform admin commands", async ({ request }) => {
    const actions = [
      "j10.savePlatform",
      "j10.viewAudit",
      "j10.reviewPermission",
      "j10.saveSecurity",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.status(), `${actionId}: ${JSON.stringify(body)}`).toBe(410);
      expect(body.canonicalApiRoute).toBe("/api/platform-admin/actions");
      expect(body.legacyReasonCode).toBe("PLATFORM_ADMIN_ACTIONS_MOVED");
      expect(body.demoWorkflowBoundary).toMatchObject({
        classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
        reasonCode: "PLATFORM_ADMIN_ACTIONS_MOVED",
      });
      expect(body.noClientRelease).toBe(true);
      expect(body.safety).toMatchObject({
        commandExecuted: false,
        noAdviceExecution: true,
        noClientRelease: true,
      });
      expect(body.error).toContain("/api/platform-admin/actions");
    }
  });

  test("legacy demo workflow path blocks typed advisor approval and points to the canonical API", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: {
        action: "submit_review",
        actorRole: "analyst",
        reason: "Legacy path should not execute typed advisor approval.",
        targetId: demoTargets.northbridge.recommendationId,
        workflowType: "advisor-approval",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(410);
    expect(body.noClientRelease).toBe(true);
    expect(body.canonicalApiRoute).toBe("/api/recommendation-review-workflow");
    expect(body.demoWorkflowBoundary).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/recommendation-review-workflow",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "ADVISOR_APPROVAL_WORKFLOW_MOVED",
    });
    expect(body.legacyReasonCode).toBe("ADVISOR_APPROVAL_WORKFLOW_MOVED");
    expect(body.proofDirectness).toBeUndefined();
    expect(body.workflowType).toBe("advisor-approval");
  });

  test("unsupported legacy demo workflow action is blocked instead of recorded as fake audit", async ({ request }) => {
    const beforeCount = await prisma.auditEvent.count();
    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "j99.fakeAction" },
    });
    const body = await response.json();
    const afterCount = await prisma.auditEvent.count();

    expect(response.status(), JSON.stringify(body)).toBe(410);
    expect(body.noClientRelease).toBe(true);
    expect(body.canonicalApiRoute).toBe("/api/journeys/[id]/commands");
    expect(body.demoWorkflowBoundary).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/journeys/[id]/commands",
      classification: "UNSUPPORTED_REQUIRES_TYPED_COMMAND",
      productCommandAllowed: true,
      reasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED",
    });
    expect(body.legacyReasonCode).toBe("UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED");
    expect(afterCount).toBe(beforeCount);
  });

  test.describe.serial("typed advisor approval workflow", () => {
    test.beforeEach(() => {
      execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    });

    test("First Build P0 positive spine reaches client-safe release, decision audit and export boundary", async ({ request }) => {
      const submitReviewResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "submit_review",
          actorRole: "analyst",
          reason: "First Build P0 analyst review started.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const submitReviewBody = await submitReviewResponse.json();

      expect(submitReviewResponse.ok(), JSON.stringify(submitReviewBody)).toBe(true);
      expect(submitReviewBody.noClientRelease).toBe(true);
      expect(submitReviewBody.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.ANALYST_REVIEWED,
      );
      expect(submitReviewBody.result.reloadedState.recommendation.clientVisible).toBe(false);

      const rebuildResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "rebuild_with_evidence",
          actorRole: "analyst",
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "First Build P0 rebuild with accepted scoped evidence.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const rebuildBody = await rebuildResponse.json();

      expect(rebuildResponse.ok(), JSON.stringify(rebuildBody)).toBe(true);
      expect(rebuildBody.noClientRelease).toBe(true);
      expect(rebuildBody.result.gateMissing).toEqual(["advisor_approval", "compliance_release"]);
      expect(rebuildBody.result.reloadedState.complianceReview.evidenceComplete).toBe(true);
      expect(rebuildBody.result.reloadedState.recommendation.clientVisible).toBe(false);

      const advisorResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "senior_wealth_advisor",
          reason: "First Build P0 advisor approval after evidence-backed rebuild.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const advisorBody = await advisorResponse.json();

      expect(advisorResponse.ok(), JSON.stringify(advisorBody)).toBe(true);
      expect(advisorBody.noClientRelease).toBe(true);
      expect(advisorBody.result.reloadedState.advisorApproval.status).toBe(ReviewStatus.APPROVED);
      expect(advisorBody.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.COMPLIANCE_PENDING,
      );
      expect(advisorBody.result.reloadedState.recommendation.clientVisible).toBe(false);

      const releaseResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "First Build P0 compliance release after advisor, evidence, payload and audit gates.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const releaseBody = await releaseResponse.json();

      expect(releaseResponse.ok(), JSON.stringify(releaseBody)).toBe(true);
      expect(releaseBody.noClientRelease).toBe(false);
      expect(releaseBody.result.gatePassed).toBe(true);
      expect(releaseBody.result.gateMissing).toEqual([]);
      expect(releaseBody.result.canonicalCommand).toBe("COMPLIANCE_RELEASE");
      expect(releaseBody.result.canonicalState).toBe("COMPLIANCE_RELEASED_CLIENT_SAFE");
      expect(releaseBody.proofDirectness).toMatchObject({
        canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
        classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
        pp004CanonicalProofEligible: false,
        proofBackedByStatePayloadAssertions: true,
      });
      expect(releaseBody.result.decisionLinkage).toMatchObject({
        decisionRows: 1,
        mode: "released_to_client",
      });
      expect(releaseBody.result.clientProjection.visible).toBe(true);
      expect(releaseBody.result.clientProjection.payload).toEqual({
        clientSummary: "Compliance-ready client summary for a released liquidity governance next step.",
      });
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("clientSummaryDraft");
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("internalRationale");
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("complianceNotes");
      expect(releaseBody.result.releasePreconditions).toMatchObject({
        advisorApproval: true,
        auditReady: true,
        releaseSpineCanRelease: true,
        compliancePermission: true,
        evidenceAccepted: true,
        evidenceProvided: true,
        evidenceScoped: true,
        internalDraftId: expect.any(String),
        payloadReady: true,
        selectedEvidenceRecordId: demoTargets.summit.evidenceId,
      });
      expect(releaseBody.result.releasePreconditions.canonicalMissing).toEqual([]);

      const decisionResponse = await request.post("/api/advice-release-history/actions", {
        data: { actionId: "j03.acceptOption" },
      });
      const decisionBody = await decisionResponse.json();

      expect(decisionResponse.ok(), JSON.stringify(decisionBody)).toBe(true);
      expect(decisionBody.canonicalApiRoute).toBe("/api/advice-release-history/actions");
      expect(decisionBody.command).toBe("CLIENT_DECISION_ACCEPT");
      expect(decisionBody.noClientRelease).toBe(false);
      expect(decisionBody.result.gatePassed).toBe(true);
      expect(decisionBody.result.decisionRows).toBe(1);

      const generatedExportBody = await createGeneratedExport(request, "positive-spine-export-boundary");

      expect(generatedExportBody.status).toBe("GENERATED");

      const [releaseAudit, decisionAudit, exportAudit] = await Promise.all([
        prisma.auditEvent.findUniqueOrThrow({ where: { id: releaseBody.result.auditEventId } }),
        prisma.auditEvent.findUniqueOrThrow({ where: { id: decisionBody.result.auditEventId } }),
        prisma.auditEvent.findUniqueOrThrow({ where: { id: generatedExportBody.auditEventId } }),
      ]);

      expect(releaseAudit.result).toBe(AuditResult.SUCCESS);
      expect(releaseAudit.eventType).toBe("advisor_approval.compliance_release");
      expect(decisionAudit.result).toBe(AuditResult.SUCCESS);
      expect(decisionAudit.eventType).toBe("advice_release_history.decision.accepted");
      expect(exportAudit.result).toBe(AuditResult.SUCCESS);
      expect(exportAudit.eventType).toBe("export.workflow.generate");
    });

    test("submit review persists analyst review state and reload proof", async ({ request }) => {
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "submit_review",
          actorRole: "analyst",
          reason: "Analyst submitted the review package.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
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

    test("analyst rejects unsupported claim and keeps draft internal-only", async ({ request }) => {
      const reason = "Projected tax impact references an unsupported stale document.";
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "reject_unsupported_claim",
          actorRole: "analyst",
          evidenceIds: [demoTargets.northbridge.evidenceId],
          reason,
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.mutated).toBe(true);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.REVISION_REQUESTED);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);
      expect(body.result.reloadedState.advisorApproval.status).toBe(ReviewStatus.REQUEST_MORE_DATA);
      expect(body.result.reloadedState.complianceReview.status).toBe(ComplianceStatus.NEEDS_EVIDENCE);
      expect(body.result.gateMissing).toEqual(["evidence_record", "advisor_approval", "compliance_release"]);

      const [recommendation, evidence, audit] = await Promise.all([
        prisma.recommendation.findUniqueOrThrow({
          where: { id: demoTargets.northbridge.recommendationId },
        }),
        prisma.evidenceRecord.findUniqueOrThrow({
          where: { id: demoTargets.northbridge.evidenceId },
        }),
        prisma.auditEvent.findUniqueOrThrow({
          where: { id: body.result.auditEventId },
        }),
      ]);

      expect(recommendation.clientVisible).toBe(false);
      expect(recommendation.summaryInternal).toContain(reason);
      expect(recommendation.assumptionsJson).toBeNull();
      expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
      expect(evidence.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
      expect(audit.eventType).toBe("advisor_approval.reject_unsupported_claim");
      expect(audit.result).toBe(AuditResult.BLOCKED);
    });

    test("analyst rebuild requires accepted evidence and remains unreleased", async ({ request }) => {
      const blockedResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "rebuild_with_evidence",
          actorRole: "analyst",
          evidenceIds: [demoTargets.morgan.evidenceId],
          reason: "Attempt rebuild with placeholder evidence.",
          targetId: demoTargets.morgan.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const blockedBody = await blockedResponse.json();

      expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);
      expect(blockedBody.mutated).toBe(false);
      expect(blockedBody.noClientRelease).toBe(true);

      await prisma.evidenceItem.deleteMany({
        where: { evidenceRecordId: demoTargets.northbridge.evidenceId },
      });
      await prisma.evidenceRecord.update({
        data: {
          relatedObjectId: demoTargets.morgan.recommendationId,
          status: EvidenceStatus.VALIDATED,
          visibilityStatus: VisibilityStatus.REDACTED,
        },
        where: { id: demoTargets.northbridge.evidenceId },
      });

      const wrongScopeResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "rebuild_with_evidence",
          actorRole: "analyst",
          evidenceIds: [demoTargets.northbridge.evidenceId],
          reason: "Attempt rebuild with accepted evidence scoped to another recommendation.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const wrongScopeBody = await wrongScopeResponse.json();

      expect(wrongScopeResponse.status(), JSON.stringify(wrongScopeBody)).toBe(409);
      expect(wrongScopeBody.error).toContain("Accepted evidence scoped to this recommendation is required");
      expect(wrongScopeBody.mutated).toBe(false);
      expect(wrongScopeBody.noClientRelease).toBe(true);

      const reason = "Rebuilt after accepted liquidity evidence review.";
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "rebuild_with_evidence",
          actorRole: "analyst",
          evidenceIds: [demoTargets.summit.evidenceId],
          reason,
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.mutated).toBe(true);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.ANALYST_REVIEWED);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);
      expect(body.result.reloadedState.complianceReview.evidenceComplete).toBe(true);
      expect(body.result.gatePassed).toBe(false);
      expect(body.result.gateMissing).toEqual(["advisor_approval", "compliance_release"]);

      const [recommendation, internalDraft, evidenceItem, audit] = await Promise.all([
        prisma.recommendation.findUniqueOrThrow({
          where: { id: demoTargets.summit.recommendationId },
        }),
        prisma.internalDraft.findFirstOrThrow({
          where: {
            draftKey: "typed-advisor-approval-release-spine",
            recommendationId: demoTargets.summit.recommendationId,
          },
        }),
        prisma.evidenceItem.findFirstOrThrow({
          where: {
            evidenceRecordId: demoTargets.summit.evidenceId,
            itemType: "internal_draft_rebuild",
            sourceObjectId: demoTargets.summit.recommendationId,
            sourceObjectType: ObjectType.RECOMMENDATION,
          },
        }),
        prisma.auditEvent.findUniqueOrThrow({
          where: { id: body.result.auditEventId },
        }),
      ]);

      expect(recommendation.clientVisible).toBe(false);
      expect(recommendation.clientSummaryDraft).toBeNull();
      expect(recommendation.summaryInternal).toContain(reason);
      expect(recommendation.assumptionsJson).toBeNull();
      expect(internalDraft.status).toBe(InternalDraftStatus.REBUILT_WITH_EVIDENCE);
      expect(internalDraft.draftClientSummary).toBe(
        "Compliance-ready client summary for a released liquidity governance next step.",
      );
      expect(evidenceItem.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
      expect(audit.eventType).toBe("advisor_approval.rebuild_with_evidence");
      expect(audit.result).toBe(AuditResult.SUCCESS);
    });

    test("advisor approval persists without client release", async ({ request }) => {
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "senior_wealth_advisor",
          reason: "Advisor approved; compliance release remains required.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.reloadedState.advisorApproval.status).toBe(ReviewStatus.APPROVED);
      expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
      expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

      const [recommendation, complianceReview, audit] = await Promise.all([
        prisma.recommendation.findUniqueOrThrow({
          where: { id: demoTargets.northbridge.recommendationId },
        }),
        prisma.complianceReview.findFirstOrThrow({
          where: {
            targetId: demoTargets.northbridge.recommendationId,
            targetType: ObjectType.RECOMMENDATION,
          },
        }),
        prisma.auditEvent.findUniqueOrThrow({
          where: { id: body.result.auditEventId },
        }),
      ]);

      expect(recommendation.clientVisible).toBe(false);
      expect(complianceReview.status).toBe(ComplianceStatus.PENDING);
      expect(complianceReview.releasedAt).toBeNull();
      expect(audit.eventType).toBe("advisor_approval.advisor_approve");
      expect(audit.result).toBe(AuditResult.SUCCESS);
      expect(audit.nextState).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    });

    test("compliance release fails before prerequisites and persists after gates pass", async ({ request }) => {
      const blockedResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.northbridge.evidenceId],
          reason: "Attempt release without prerequisites.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const blockedBody = await blockedResponse.json();

      expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);
      expect(blockedBody.noClientRelease).toBe(true);
      expect(blockedBody.gateMissing).toContain("advisor_approval");
      expect(blockedBody.gateMissing).toContain("accepted_evidence");
      expect(blockedBody.releasePreconditions.advisorApproval).toBe(false);
      expect(blockedBody.releasePreconditions.evidenceAccepted).toBe(false);
      expect(blockedBody.releasePreconditions.payloadReady).toBe(false);

      const blockedRecommendation = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      });

      expect(blockedRecommendation.clientVisible).toBe(false);
      expect(blockedRecommendation.status).not.toBe(RecommendationStatus.RELEASED_TO_CLIENT);

      const advisorHandoffResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "senior_wealth_advisor",
          reason: "Prepare Summit item for compliance-pending release checks.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const advisorHandoffBody = await advisorHandoffResponse.json();

      expect(advisorHandoffResponse.ok(), JSON.stringify(advisorHandoffBody)).toBe(true);
      expect(advisorHandoffBody.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.COMPLIANCE_PENDING,
      );

      const invalidConfirmationResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: "CONFIRM",
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Invalid confirmation should fail before mutation.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
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
      expect(summitBeforeRelease.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);

      const missingEvidenceResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          reason: "Attempt release without scoped evidence payload.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const missingEvidenceBody = await missingEvidenceResponse.json();

      expect(missingEvidenceResponse.status(), JSON.stringify(missingEvidenceBody)).toBe(409);
      expect(missingEvidenceBody.noClientRelease).toBe(true);
      expect(missingEvidenceBody.gateMissing).toContain("evidence_record");
      expect(missingEvidenceBody.releasePreconditions.advisorApproval).toBe(true);
      expect(missingEvidenceBody.releasePreconditions.evidenceProvided).toBe(false);

      const summitInternalDraftId = stableId(`internal-draft:advisor-approval:${demoTargets.summit.recommendationId}`);
      await prisma.internalDraft.upsert({
        create: {
          clientTenantId: stableId("tenant:summit"),
          draftClientSummary: "Internal draft rebuilt with accepted evidence. Compliance release remains required.",
          draftKey: "typed-advisor-approval-release-spine",
          id: summitInternalDraftId,
          internalRationale: "Compliance release still requires advisor-ready client-safe payload promotion.",
          processId: "typed-advisor-approval",
          recommendationId: demoTargets.summit.recommendationId,
          sourceObjectId: demoTargets.summit.recommendationId,
          sourceObjectType: ObjectType.RECOMMENDATION,
          sourceRefsJson: ["test:release-precondition"],
          status: InternalDraftStatus.REBUILT_WITH_EVIDENCE,
          title: "Summit release-precondition internal draft spine",
        },
        update: {
          draftClientSummary: "Internal draft rebuilt with accepted evidence. Compliance release remains required.",
          internalRationale: "Compliance release still requires advisor-ready client-safe payload promotion.",
          status: InternalDraftStatus.REBUILT_WITH_EVIDENCE,
        },
        where: {
          recommendationId_draftKey: {
            draftKey: "typed-advisor-approval-release-spine",
            recommendationId: demoTargets.summit.recommendationId,
          },
        },
      });

      const internalDraftBlockedResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Attempt release while internal draft marker remains active.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const internalDraftBlockedBody = await internalDraftBlockedResponse.json();

      expect(internalDraftBlockedResponse.status(), JSON.stringify(internalDraftBlockedBody)).toBe(409);
      expect(internalDraftBlockedBody.noClientRelease).toBe(true);
      expect(internalDraftBlockedBody.gateMissing).toContain("payload_ready");
      expect(internalDraftBlockedBody.releasePreconditions.payloadReady).toBe(false);

      await prisma.internalDraft.update({
        data: {
          draftClientSummary: " ",
          status: InternalDraftStatus.ADVISOR_READY,
        },
        where: { id: summitInternalDraftId },
      });
      await prisma.draftClassification.create({
        data: {
          classifiedByRoleKey: "analyst",
          classification: DraftClassificationKind.ADVICE_RELEVANT,
          internalDraftId: summitInternalDraftId,
          reason: "Test creates a clear classification while payload text remains empty.",
          riskLevel: DraftRiskLevel.MEDIUM,
          unsupportedClaimsClear: true,
        },
      });

      const payloadBlockedResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Attempt release without a client-safe summary payload.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const payloadBlockedBody = await payloadBlockedResponse.json();

      expect(payloadBlockedResponse.status(), JSON.stringify(payloadBlockedBody)).toBe(409);
      expect(payloadBlockedBody.noClientRelease).toBe(true);
      expect(payloadBlockedBody.gateMissing).toContain("payload_ready");
      expect(payloadBlockedBody.releasePreconditions.evidenceAccepted).toBe(true);
      expect(payloadBlockedBody.releasePreconditions.evidenceScoped).toBe(true);
      expect(payloadBlockedBody.releasePreconditions.payloadReady).toBe(false);

      await prisma.internalDraft.update({
        data: {
          draftClientSummary: "Compliance-ready client summary for a released liquidity governance next step.",
          status: InternalDraftStatus.ADVISOR_READY,
        },
        where: { id: summitInternalDraftId },
      });

      const auditFailureResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Simulate audit persistence failure before release.",
          simulateAuditPersistenceFailure: true,
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const auditFailureBody = await auditFailureResponse.json();

      expect(auditFailureResponse.status(), JSON.stringify(auditFailureBody)).toBe(409);
      expect(auditFailureBody.noClientRelease).toBe(true);
      expect(auditFailureBody.mutated).toBe(false);
      expect(auditFailureBody.gateMissing).toContain("audit_persistence");
      expect(auditFailureBody.releasePreconditions.auditReady).toBe(false);

      const auditBlockedRecommendation = await prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.summit.recommendationId },
      });
      const auditBlockedComplianceReview = await prisma.complianceReview.findFirstOrThrow({
        where: {
          targetId: demoTargets.summit.recommendationId,
          targetType: ObjectType.RECOMMENDATION,
        },
      });

      expect(auditBlockedRecommendation.clientVisible).toBe(false);
      expect(auditBlockedRecommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
      expect(auditBlockedComplianceReview.status).not.toBe(ComplianceStatus.RELEASED);
      expect(auditBlockedComplianceReview.releasedAt).toBeNull();

      const releaseResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          evidenceIds: [demoTargets.summit.evidenceId],
          reason: "Compliance release after advisor approval, evidence and permission gates.",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const releaseBody = await releaseResponse.json();

      expect(releaseResponse.ok(), JSON.stringify(releaseBody)).toBe(true);
      expect(releaseBody.noClientRelease).toBe(false);
      expect(releaseBody.result.gatePassed).toBe(true);
      expect(releaseBody.result.gateMissing).toEqual([]);
      expect(releaseBody.result.clientProjection.visible).toBe(true);
      expect(releaseBody.result.clientProjection.reasonCode).toBe("DEMO_CLIENT_SAFE_PROJECTION");
      expect(releaseBody.result.clientProjection.payload).toEqual({
        clientSummary: "Compliance-ready client summary for a released liquidity governance next step.",
      });
      expect(releaseBody.result.clientProjection.hiddenFields).not.toContain("clientSummaryDraft");
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("clientSummaryDraft");
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("internalRationale");
      expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("complianceNotes");
      expect(releaseBody.result.releasePreconditions).toMatchObject({
        advisorApproval: true,
        auditReady: true,
        releaseSpineCanRelease: true,
        compliancePermission: true,
        evidenceAccepted: true,
        evidenceProvided: true,
        evidenceScoped: true,
        internalDraftId: expect.any(String),
        payloadReady: true,
        selectedEvidenceRecordId: demoTargets.summit.evidenceId,
      });
      expect(releaseBody.result.releasePreconditions.canonicalMissing).toEqual([]);
      expect(releaseBody.result.releasePreconditions.missing).toEqual([]);
      expect(releaseBody.result.reloadedState.recommendation.status).toBe(
        RecommendationStatus.RELEASED_TO_CLIENT,
      );
      expect(releaseBody.result.reloadedState.complianceReview.status).toBe(ComplianceStatus.RELEASED);
      expect(releaseBody.result.reloadedState.evidence).toContainEqual({
        id: demoTargets.summit.evidenceId,
        status: EvidenceStatus.RELEASED,
        visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
      });

      const [audit, decision] = await Promise.all([
        prisma.auditEvent.findUniqueOrThrow({
          where: { id: releaseBody.result.auditEventId },
        }),
        prisma.decision.findUniqueOrThrow({
          where: { id: summitDecisionId },
        }),
      ]);
      const auditMetadata = audit.metadataJson as {
        canonicalCommand?: string;
        canonicalState?: string;
        decisionLinkage?: {
          decisionRows?: number;
          mode?: string;
        };
        demoWorkflowCompatibilityMode?: string;
      } | null;

      expect(audit.result).toBe(AuditResult.SUCCESS);
      expect(audit.targetType).toBe(ObjectType.RECOMMENDATION);
      expect(audit.eventType).toBe("advisor_approval.compliance_release");
      expect(auditMetadata).toMatchObject({
        canonicalCommand: "COMPLIANCE_RELEASE",
        canonicalState: "COMPLIANCE_RELEASED_CLIENT_SAFE",
        decisionLinkage: {
          decisionRows: 1,
          mode: "released_to_client",
        },
        demoWorkflowCompatibilityMode: "DEMO_WORKFLOW_COMPATIBILITY_ONLY",
      });
      expect(decision.status).toBe(DecisionStatus.RELEASED_TO_CLIENT);
      expect(decision.releasedToClientAt).toBeTruthy();
      expect(decision.evidenceRecordId).toBe(demoTargets.summit.evidenceId);
      expect(decision.decisionAction).toBeNull();
      expect(decision.decisionAt).toBeNull();
    });

    test("compliance block prevents client visibility and records audit", async ({ request }) => {
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_block",
          actorRole: "compliance_officer",
          confirmationText: "BLOCK RELEASE",
          evidenceIds: [demoTargets.morgan.evidenceId],
          reason: "Compliance block proof.",
          targetId: demoTargets.morgan.recommendationId,
          workflowType: "advisor-approval",
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
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "request_evidence",
          actorRole: "compliance_officer",
          confirmationText: "REQUEST EVIDENCE",
          evidenceIds: [demoTargets.morgan.evidenceId],
          reason,
          targetId: demoTargets.morgan.recommendationId,
          workflowType: "advisor-approval",
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
      const wrongRoleResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "advisor_approve",
          actorRole: "analyst",
          reason: "Analyst should not approve.",
          targetId: demoTargets.northbridge.recommendationId,
          workflowType: "advisor-approval",
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

      const wrongActionResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "publish",
          actorRole: "compliance_officer",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const wrongActionBody = await wrongActionResponse.json();

      expect(wrongActionResponse.status(), JSON.stringify(wrongActionBody)).toBe(400);
      expect(wrongActionBody.issues?.[0]?.field).toBe("action");

      const invalidAuditSimulationResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          simulateAuditPersistenceFailure: "yes",
          targetId: demoTargets.summit.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const invalidAuditSimulationBody = await invalidAuditSimulationResponse.json();

      expect(invalidAuditSimulationResponse.status(), JSON.stringify(invalidAuditSimulationBody)).toBe(400);
      expect(invalidAuditSimulationBody.issues?.[0]).toMatchObject({
        code: "invalid_audit_persistence_simulation",
        field: "simulateAuditPersistenceFailure",
      });

      const wrongObjectResponse = await request.post("/api/recommendation-review-workflow", {
        data: {
          action: "compliance_release",
          actorRole: "compliance_officer",
          confirmationText: wp05ComplianceReleaseConfirmationPhrase,
          targetId: "96705b67-40b2-5fb8-aa69-a3f2c106025e",
          workflowType: "advisor-approval",
        },
      });
      const wrongObjectBody = await wrongObjectResponse.json();

      expect(wrongObjectResponse.status(), JSON.stringify(wrongObjectBody)).toBe(404);
      expect(wrongObjectBody.mutated).toBe(false);
      expect(wrongObjectBody.noClientRelease).toBe(true);
    });
  });
});
