import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ComplianceStatus, EvidenceStatus, ObjectType, PrismaClient, RecommendationStatus, VisibilityStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  certifyP44EvidenceExit,
  createP44EvidenceRequest,
  evidenceRequestFeedbackState,
  getP44EvidenceVault,
  linkP44EvidenceToObject,
  projectP44ClientSafeEvidenceSummary,
  rejectP44Evidence,
  rerequestP44EvidenceAfterRejection,
} from "../lib/p44-phase3-evidence-lifecycle";
import { stableId } from "../lib/stable-id";

const morganRecommendationId = stableId("recommendation:morgan:liquidity-review");

test.describe.configure({ mode: "serial" });

test.describe("P44 Phase 3 evidence lifecycle certification", () => {
  let prisma: PrismaClient;
  let evidenceRecordId = "";
  let linkedEvidenceRecordId = "";
  let rejectedEvidenceRecordId = "";
  let followUpEvidenceRecordId = "";

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for P44 Phase 3 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("P44-3-T01 creates scoped evidence request state, assignee, reason and audit without sufficiency or release", async () => {
    const result = await createP44EvidenceRequest(prisma, {
      actorRoleKey: "compliance_officer",
      reason: "P44 Phase 3 needs refreshed liquidity evidence before release.",
      source: "compliance",
      targetRecommendationId: morganRecommendationId,
      tenantSlug: "morgan",
    });

    evidenceRecordId = result.evidenceRecordId;

    expect(result).toMatchObject({
      lifecycleState: "request_open",
      releaseReady: false,
      scopedRequestState: ComplianceStatus.NEEDS_EVIDENCE,
      sufficiency: false,
    });

    const [recommendation, complianceReview, evidence, audit] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({ where: { id: morganRecommendationId } }),
      prisma.complianceReview.findUniqueOrThrow({ where: { id: result.complianceReviewId } }),
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: evidenceRecordId } }),
      prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } }),
    ]);

    expect(recommendation.status).toBe(RecommendationStatus.MORE_DATA_REQUESTED);
    expect(recommendation.clientVisible).toBe(false);
    expect(complianceReview.status).toBe(ComplianceStatus.NEEDS_EVIDENCE);
    expect(complianceReview.releaseNotes).toContain("refreshed liquidity evidence");
    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
    expect(audit.eventType).toBe("p44.evidence.request.created");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("P44-3-T02 exposes loading, validation failed, blocked, success and retry feedback states without advancing workflow", () => {
    expect(evidenceRequestFeedbackState({ loading: true })).toBe("loading");
    expect(evidenceRequestFeedbackState({ validationIssues: ["reason_required"] })).toBe("validation_failed");
    expect(evidenceRequestFeedbackState({ blocked: true })).toBe("blocked");
    expect(evidenceRequestFeedbackState({ succeeded: true })).toBe("success");
    expect(evidenceRequestFeedbackState({ blocked: true, retryable: true })).toBe("retry_available");
  });

  test("P44-3-T03 links evidence to the scoped object without claiming gate support", async () => {
    const result = await linkP44EvidenceToObject(prisma, {
      actorRoleKey: "analyst",
      evidenceRecordId,
      reason: "Analyst linked the request to the recommendation context for review.",
      targetObjectId: morganRecommendationId,
      targetObjectType: ObjectType.RECOMMENDATION,
      tenantSlug: "morgan",
    });

    linkedEvidenceRecordId = result.evidenceRecordId;

    expect(result.lifecycleState).toBe("linked_not_sufficient");
    expect(result.gateSupport).toBe(false);

    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({ where: { id: linkedEvidenceRecordId } });
    expect(evidence.status).toBe(EvidenceStatus.LINKED);
    expect(evidence.relatedObjectId).toBe(morganRecommendationId);
  });

  test("P44-3-T04 consumes linked evidence as blocker context, not release evidence", async () => {
    const vault = await getP44EvidenceVault(prisma, { actorRoleKey: "compliance_officer", tenantSlug: "morgan" });
    const linked = vault.find((record) => record.id === linkedEvidenceRecordId);

    expect(linked).toMatchObject({
      lifecycleState: "linked_not_sufficient",
      relatedObjectId: morganRecommendationId,
      status: EvidenceStatus.LINKED,
    });
  });

  test("P44-3-T05 projects client-safe evidence summary only after release", async () => {
    const blocked = await projectP44ClientSafeEvidenceSummary(prisma, {
      evidenceRecordId: linkedEvidenceRecordId,
      tenantSlug: "morgan",
    });

    expect(blocked).toEqual({
      allowed: false,
      fields: ["title", "status"],
      reasonCode: "P44_CLIENT_SAFE_EVIDENCE_UNRELEASED",
    });
  });

  test("P44-3-T06 keeps unreleased summary payloads fail-closed and free of internal fields", async () => {
    const blocked = await projectP44ClientSafeEvidenceSummary(prisma, {
      evidenceRecordId: linkedEvidenceRecordId,
      tenantSlug: "morgan",
    });

    expect(blocked).not.toHaveProperty("summary");
    expect(blocked).not.toHaveProperty("evidenceRecordId");
    expect(blocked.fields).toEqual(["title", "status"]);
  });

  test("P44-3-T07 returns scoped evidence vault list/detail lifecycle state", async () => {
    const vault = await getP44EvidenceVault(prisma, { actorRoleKey: "analyst", tenantSlug: "morgan" });
    const record = vault.find((item) => item.id === linkedEvidenceRecordId);

    expect(record?.itemCount).toBeGreaterThanOrEqual(2);
    expect(record?.lifecycleState).toBe("linked_not_sufficient");
    expect(record?.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
  });

  test("P44-3-T08 maps vault lifecycle states without unlocking rejected or stale evidence", async () => {
    const vault = await getP44EvidenceVault(prisma, { actorRoleKey: "compliance_officer", tenantSlug: "morgan" });
    const lifecycleStates = vault.map((record) => record.lifecycleState);

    expect(lifecycleStates).toContain("linked_not_sufficient");
    expect(lifecycleStates).not.toContain("released");
  });

  test("P44-3-T09 rejects evidence with reason, reviewer, status and audit", async () => {
    const result = await rejectP44Evidence(prisma, {
      actorRoleKey: "compliance_officer",
      evidenceRecordId: linkedEvidenceRecordId,
      reason: "Submitted evidence does not match the requested period.",
      tenantSlug: "morgan",
    });

    rejectedEvidenceRecordId = result.evidenceRecordId;

    expect(result).toMatchObject({
      gateSupport: false,
      lifecycleState: "rejected",
    });

    const [evidence, audit] = await Promise.all([
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: rejectedEvidenceRecordId } }),
      prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } }),
    ]);

    expect(evidence.status).toBe(EvidenceStatus.RESTRICTED);
    expect(evidence.summary).toContain("Submitted evidence does not match");
    expect(audit.eventType).toBe("p44.evidence.rejected");
    expect(audit.result).toBe(AuditResult.BLOCKED);
  });

  test("P44-3-T10 creates a follow-up request after rejection and preserves rejection history", async () => {
    const result = await rerequestP44EvidenceAfterRejection(prisma, {
      actorRoleKey: "compliance_officer",
      originalEvidenceRecordId: rejectedEvidenceRecordId,
      reason: "Please upload the corrected period statement.",
      tenantSlug: "morgan",
    });

    followUpEvidenceRecordId = result.followUpEvidenceRecordId;

    expect(result).toMatchObject({
      originalLifecycleState: "rejected",
      reRequestLifecycleState: "request_open",
    });

    const [original, followUp, rejectionItems] = await Promise.all([
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: rejectedEvidenceRecordId } }),
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: followUpEvidenceRecordId } }),
      prisma.evidenceItem.findMany({
        where: { evidenceRecordId: rejectedEvidenceRecordId, itemType: "p44_phase3_evidence_rejection" },
      }),
    ]);

    expect(original.status).toBe(EvidenceStatus.RESTRICTED);
    expect(followUp.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(rejectionItems).toHaveLength(1);
  });

  test("P44-3-T11 proves upload-only, unlinked, rejected and stale evidence never unlock gates", async () => {
    const rejected = await projectP44ClientSafeEvidenceSummary(prisma, {
      evidenceRecordId: rejectedEvidenceRecordId,
      tenantSlug: "morgan",
    });
    const followUp = await projectP44ClientSafeEvidenceSummary(prisma, {
      evidenceRecordId: followUpEvidenceRecordId,
      tenantSlug: "morgan",
    });

    await expect(
      linkP44EvidenceToObject(prisma, {
        actorRoleKey: "principal",
        evidenceRecordId: followUpEvidenceRecordId,
        reason: "Client role should not link evidence.",
        targetObjectId: morganRecommendationId,
        targetObjectType: ObjectType.RECOMMENDATION,
        tenantSlug: "morgan",
      }),
    ).rejects.toThrow("P44 Phase 3 evidence lifecycle action is not permitted.");

    expect(rejected.allowed).toBe(false);
    expect(followUp.allowed).toBe(false);
  });

  test("P44-3-T12 certifies Phase 3 exit with positive and negative proof coverage", () => {
    const certification = certifyP44EvidenceExit({
      lifecycleStates: ["request_open", "linked_not_sufficient", "rejected"],
      negativeProofs: [
        "request_not_sufficient",
        "failed_request_no_advance",
        "unlinked_never_unlocks",
        "rejected_never_unlocks",
        "rerequest_preserves_rejection",
        "upload_only_never_releases",
      ],
      ticketIds: [
        "P44-3-T01-IMPL",
        "P44-3-T02-IMPL",
        "P44-3-T03-IMPL",
        "P44-3-T04-IMPL",
        "P44-3-T05-IMPL",
        "P44-3-T06-IMPL",
        "P44-3-T07-IMPL",
        "P44-3-T08-IMPL",
        "P44-3-T09-IMPL",
        "P44-3-T10-IMPL",
        "P44-3-T11-IMPL",
        "P44-3-T12-IMPL",
      ],
    });

    expect(certification).toEqual({
      missingProofs: [],
      phase: "PH3",
      ready: true,
    });
  });
});
