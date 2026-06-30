import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  EvidenceStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  WorkflowStatus,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  buildOperationalComplianceEvidenceRequestNegativeMatrix,
  buildOperationalComplianceRationaleIntegrationMatrix,
  captureOperationalDecisionRationale,
  certifyOperationalComplianceRationaleExit,
  createOperationalComplianceQueueTriage,
  createOperationalStage7ReadinessChecklist,
  evaluateOperationalComplianceReleasePreconditions,
  inspectOperationalDecisionRationalePayload,
  operationalStage7TicketOrder,
  requestOperationalComplianceEvidence,
} from "../lib/compliance-rationale-service";
import { stableId } from "../lib/stable-id";

const draftKey = "compliance-rationale-liquidity";
const recommendationId = stableId(`operational:stage7:recommendation:morgan:${draftKey}`);

test.describe.configure({ mode: "serial" });

test.describe("Operational Stage 7 compliance queue and rationale closure certification", () => {
  let prisma: PrismaClient;
  let queueItemId: string;
  let evidenceRequestNegative: ReturnType<typeof buildOperationalComplianceEvidenceRequestNegativeMatrix>;
  let rationaleInspection: ReturnType<typeof inspectOperationalDecisionRationalePayload>;
  let blockedPreconditions: ReturnType<typeof evaluateOperationalComplianceReleasePreconditions>;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Operational Stage 7 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH7-EXEC creates ordered readiness after analysis/spec and Stage 6 exit", () => {
    const blocked = createOperationalStage7ReadinessChecklist({
      analysisComplete: true,
      predecessorStage6Exit: false,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createOperationalStage7ReadinessChecklist({
      analysisComplete: true,
      predecessorStage6Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["operational_stage6_exit"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(operationalStage7TicketOrder);
  });

  test("Operational-7-T01 persists compliance queue triage with preconditions and no release", async () => {
    const result = await createOperationalComplianceQueueTriage(prisma, {
      actorRoleKey: "compliance_officer",
      draftKey,
      reason: "Advisor review exit is ready for compliance precondition triage.",
      tenantSlug: "morgan",
      title: "Operational Stage 7 compliance release candidate",
    });
    queueItemId = result.queueItemId;
    blockedPreconditions = result.preconditions;

    const queueItem = await prisma.queueItem.findUniqueOrThrow({ where: { id: queueItemId } });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: result.recommendationId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });

    expect(queueItem.queueName).toBe("compliance_release");
    expect(queueItem.status).toBe(WorkflowStatus.COMPLIANCE_PENDING);
    expect(queueItem.assignedRoleKey).toBe("compliance_officer");
    expect(recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    expect(recommendation.clientVisible).toBe(false);
    expect(result.releasePermissionVisible).toBe(true);
    expect(result.preconditions.disabled).toBe(true);
    expect(result.preconditions.missing).toEqual(["evidence_sufficiency", "redaction_ready", "decision_rationale", "payload_ready"]);
    expect(audit.eventType).toBe("operational.compliance_queue.triaged");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("Operational-7-T02 disables release when advisor/evidence/audit/redaction/rationale preconditions are missing", () => {
    const disabled = evaluateOperationalComplianceReleasePreconditions({
      advisorApproved: false,
      auditPersistenceAvailable: false,
      evidenceSufficient: false,
      payloadReady: false,
      permissionAllowed: false,
      rationaleCaptured: false,
      redactionReady: false,
    });
    const ready = evaluateOperationalComplianceReleasePreconditions({
      advisorApproved: true,
      auditPersistenceAvailable: true,
      evidenceSufficient: true,
      payloadReady: true,
      permissionAllowed: true,
      rationaleCaptured: true,
      redactionReady: true,
    });

    expect(disabled.disabled).toBe(true);
    expect(disabled.canRelease).toBe(false);
    expect(disabled.missing).toEqual([
      "advisor_approval",
      "evidence_sufficiency",
      "audit_persistence",
      "redaction_ready",
      "decision_rationale",
      "payload_ready",
      "permission_check",
    ]);
    expect(ready.canRelease).toBe(true);
    expect(ready.missing).toEqual([]);
  });

  test("Operational-7-T03 records compliance evidence request with assignment, audit and release block", async () => {
    const result = await requestOperationalComplianceEvidence(prisma, {
      actorRoleKey: "compliance_officer",
      evidenceKey: "compliance-release-proof",
      reason: "Compliance requires reviewed sufficiency evidence before release can continue.",
      recommendationId,
      targetRoleKey: "analyst",
      tenantSlug: "morgan",
    });
    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({ where: { id: result.evidenceId } });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const complianceReview = await prisma.complianceReview.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    const queueItem = await prisma.queueItem.findUniqueOrThrow({ where: { id: queueItemId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });

    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(recommendation.status).toBe(RecommendationStatus.MORE_DATA_REQUESTED);
    expect(recommendation.clientVisible).toBe(false);
    expect(complianceReview.status).toBe(ComplianceStatus.NEEDS_EVIDENCE);
    expect(complianceReview.releasedAt).toBeNull();
    expect(queueItem.status).toBe(WorkflowStatus.AWAITING_INFO);
    expect(queueItem.assignedRoleKey).toBe("analyst");
    expect(audit.eventType).toBe("operational.compliance.requested_evidence");
    expect(audit.result).toBe(AuditResult.BLOCKED);
  });

  test("Operational-7-T04 proves compliance evidence request blocks release and cannot be overridden", async () => {
    const evidence = await prisma.evidenceRecord.findFirstOrThrow({
      where: { relatedObjectId: recommendationId, relatedObjectType: ObjectType.RECOMMENDATION },
      orderBy: { createdAt: "desc" },
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const complianceReview = await prisma.complianceReview.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    evidenceRequestNegative = buildOperationalComplianceEvidenceRequestNegativeMatrix({
      adminOverrideAttempted: false,
      advisorOverrideAttempted: false,
      complianceStatus: complianceReview.status,
      evidenceStatus: evidence.status,
      recommendationClientVisible: recommendation.clientVisible,
      releasedAt: complianceReview.releasedAt,
    });

    expect(evidenceRequestNegative.allNegativeCasesCovered).toBe(true);
    expect(evidenceRequestNegative.rows.map((row) => row.caseId)).toEqual([
      "request_blocks_release_until_sufficiency",
      "request_hidden_from_client_projection",
      "admin_advisor_override_denied",
    ]);
  });

  test("Operational-7-T05 captures versioned/scoped decision rationale linked to decision state", async () => {
    const result = await captureOperationalDecisionRationale(prisma, {
      actorRoleKey: "compliance_officer",
      clientSafeRationale: "Compliance has requested more evidence before release can be evaluated.",
      decisionKey: "release-readiness",
      internalRationale: "Internal release rationale references evidence gaps and audit state; not client safe.",
      reason: "Compliance captures rationale before any release decision can proceed.",
      recommendationId,
      tenantSlug: "morgan",
    });
    const decision = await prisma.decision.findUniqueOrThrow({ where: { id: result.decisionId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });

    expect(decision.status).toBe(DecisionStatus.DRAFT);
    expect(decision.recommendationId).toBe(recommendationId);
    expect(decision.decisionReason).toBe(result.clientSafeRationale);
    expect(result.internalRationaleClientVisible).toBe(false);
    expect(result.rationaleVersion).toBeGreaterThanOrEqual(1);
    expect(audit.eventType).toBe("operational.decision_rationale.captured");
  });

  test("Operational-7-T06 tests rationale payload separation and audit proof", async () => {
    const audit = await prisma.auditEvent.findFirstOrThrow({
      where: {
        eventType: "operational.decision_rationale.captured",
        targetId: recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
      orderBy: { createdAt: "desc" },
    });
    rationaleInspection = inspectOperationalDecisionRationalePayload({
      auditWritten: Boolean(audit.id),
      clientPayload: {
        clientSafeRationale: "Compliance has requested more evidence before release can be evaluated.",
      },
      exportPayload: {
        clientSafeRationale: "Compliance has requested more evidence before release can be evaluated.",
      },
    });
    const leakingInspection = inspectOperationalDecisionRationalePayload({
      auditWritten: true,
      clientPayload: {
        internalRationale: "Internal-only rationale",
      },
      exportPayload: {
        complianceNotes: "Internal compliance notes",
      },
    });

    expect(rationaleInspection.auditWritten).toBe(true);
    expect(rationaleInspection.cleanForClient).toBe(true);
    expect(rationaleInspection.cleanForExport).toBe(true);
    expect(leakingInspection.cleanForClient).toBe(false);
    expect(leakingInspection.cleanForExport).toBe(false);
  });

  test("Operational-7-T07 integrates compliance request and rationale with release/decision records", () => {
    const integration = buildOperationalComplianceRationaleIntegrationMatrix({
      evidenceRequestNegative,
      preconditions: blockedPreconditions,
      rationaleInspection,
    });

    expect(integration.integrated).toBe(true);
    expect(integration.rows.map((row) => row.caseId)).toEqual([
      "compliance_request_integrates_with_release_guard",
      "rationale_payload_integrates_with_decision_record",
      "missing_rationale_or_evidence_cannot_release_silently",
    ]);
  });

  test("Operational-7-T08 certifies Stage 7 exit only with release preconditions intact", () => {
    const integration = buildOperationalComplianceRationaleIntegrationMatrix({
      evidenceRequestNegative,
      preconditions: blockedPreconditions,
      rationaleInspection,
    });
    const certification = certifyOperationalComplianceRationaleExit({
      completedTickets: [...operationalStage7TicketOrder],
      integrationMatrix: integration,
    });

    expect(certification.certified).toBe(true);
    expect(certification.releasePreconditionsIntact).toBe(true);
    expect(certification.status).toBe("Operational_PHASE7_COMPLIANCE_RATIONALE_READY");
    expect(certification.processCoverage).toEqual(["G-001", "G-004", "I-003"]);
  });
});
