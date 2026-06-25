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
  buildP44ComplianceEvidenceRequestNegativeMatrix,
  buildP44ComplianceRationaleIntegrationMatrix,
  captureP44DecisionRationale,
  certifyP44ComplianceRationaleExit,
  createP44ComplianceQueueTriage,
  createP44Phase7ReadinessChecklist,
  evaluateP44ComplianceReleasePreconditions,
  inspectP44DecisionRationalePayload,
  p44Phase7TicketOrder,
  requestP44ComplianceEvidence,
} from "../lib/p44-phase7-compliance-rationale-closure";
import { stableId } from "../lib/stable-id";

const draftKey = "compliance-rationale-liquidity";
const recommendationId = stableId(`p44:phase7:recommendation:morgan:${draftKey}`);

test.describe.configure({ mode: "serial" });

test.describe("P44 Phase 7 compliance queue and rationale closure certification", () => {
  let prisma: PrismaClient;
  let queueItemId: string;
  let evidenceRequestNegative: ReturnType<typeof buildP44ComplianceEvidenceRequestNegativeMatrix>;
  let rationaleInspection: ReturnType<typeof inspectP44DecisionRationalePayload>;
  let blockedPreconditions: ReturnType<typeof evaluateP44ComplianceReleasePreconditions>;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for P44 Phase 7 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH7-EXEC creates ordered readiness after analysis/spec and Phase 6 exit", () => {
    const blocked = createP44Phase7ReadinessChecklist({
      analysisComplete: true,
      predecessorPhase6Exit: false,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createP44Phase7ReadinessChecklist({
      analysisComplete: true,
      predecessorPhase6Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["p44_phase6_exit"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(p44Phase7TicketOrder);
  });

  test("P44-7-T01 persists compliance queue triage with preconditions and no release", async () => {
    const result = await createP44ComplianceQueueTriage(prisma, {
      actorRoleKey: "compliance_officer",
      draftKey,
      reason: "Advisor review exit is ready for compliance precondition triage.",
      tenantSlug: "morgan",
      title: "P44 Phase 7 compliance release candidate",
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
    expect(audit.eventType).toBe("p44.compliance_queue.triaged");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("P44-7-T02 disables release when advisor/evidence/audit/redaction/rationale preconditions are missing", () => {
    const disabled = evaluateP44ComplianceReleasePreconditions({
      advisorApproved: false,
      auditPersistenceAvailable: false,
      evidenceSufficient: false,
      payloadReady: false,
      permissionAllowed: false,
      rationaleCaptured: false,
      redactionReady: false,
    });
    const ready = evaluateP44ComplianceReleasePreconditions({
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

  test("P44-7-T03 records compliance evidence request with assignment, audit and release block", async () => {
    const result = await requestP44ComplianceEvidence(prisma, {
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
    expect(audit.eventType).toBe("p44.compliance.requested_evidence");
    expect(audit.result).toBe(AuditResult.BLOCKED);
  });

  test("P44-7-T04 proves compliance evidence request blocks release and cannot be overridden", async () => {
    const evidence = await prisma.evidenceRecord.findFirstOrThrow({
      where: { relatedObjectId: recommendationId, relatedObjectType: ObjectType.RECOMMENDATION },
      orderBy: { createdAt: "desc" },
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const complianceReview = await prisma.complianceReview.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    evidenceRequestNegative = buildP44ComplianceEvidenceRequestNegativeMatrix({
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

  test("P44-7-T05 captures versioned/scoped decision rationale linked to decision state", async () => {
    const result = await captureP44DecisionRationale(prisma, {
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
    expect(audit.eventType).toBe("p44.decision_rationale.captured");
  });

  test("P44-7-T06 tests rationale payload separation and audit proof", async () => {
    const audit = await prisma.auditEvent.findFirstOrThrow({
      where: {
        eventType: "p44.decision_rationale.captured",
        targetId: recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
      orderBy: { createdAt: "desc" },
    });
    rationaleInspection = inspectP44DecisionRationalePayload({
      auditWritten: Boolean(audit.id),
      clientPayload: {
        clientSafeRationale: "Compliance has requested more evidence before release can be evaluated.",
      },
      exportPayload: {
        clientSafeRationale: "Compliance has requested more evidence before release can be evaluated.",
      },
    });
    const leakingInspection = inspectP44DecisionRationalePayload({
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

  test("P44-7-T07 integrates compliance request and rationale with release/decision records", () => {
    const integration = buildP44ComplianceRationaleIntegrationMatrix({
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

  test("P44-7-T08 certifies Phase 7 exit only with release preconditions intact", () => {
    const integration = buildP44ComplianceRationaleIntegrationMatrix({
      evidenceRequestNegative,
      preconditions: blockedPreconditions,
      rationaleInspection,
    });
    const certification = certifyP44ComplianceRationaleExit({
      completedTickets: [...p44Phase7TicketOrder],
      integrationMatrix: integration,
    });

    expect(certification.certified).toBe(true);
    expect(certification.releasePreconditionsIntact).toBe(true);
    expect(certification.status).toBe("P44_PHASE7_COMPLIANCE_RATIONALE_READY");
    expect(certification.processCoverage).toEqual(["G-001", "G-004", "I-003"]);
  });
});
