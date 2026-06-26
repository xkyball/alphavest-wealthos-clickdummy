import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, EvidenceStatus, ObjectType, PrismaClient, RecommendationStatus, VisibilityStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  buildP44DraftNegativeGateMatrix,
  buildP44DraftTraceMap,
  canP44DraftAdvanceToAdvisor,
  canP44EvidenceBackedDraftMoveToAdvisor,
  certifyP44AiDraftGovernanceExit,
  classifyP44InternalDraft,
  createP44DraftWorkflowClosureNotes,
  createP44InternalAiDraft,
  createP44Phase5ReadinessChecklist,
  getP44InternalDraftGovernanceState,
  getP44DraftTraceAudit,
  inspectP44InternalDraftProjection,
  p44Phase5TicketOrder,
  p44UnsupportedClaimFeedbackState,
  persistP44UnsupportedClaim,
  rebuildP44DraftWithEvidence,
  rejectP44InternalDraft,
  sweepP44AiDraftLeakageSurfaces,
  tagP44InternalDraftPayload,
} from "../lib/internal-draft-governance-spine";
import { stableId } from "../lib/stable-id";

const draftKey = "ai-governance-liquidity";
const recommendationId = stableId(`p44:phase5:recommendation:morgan:${draftKey}`);
const evidenceRecordId = stableId(`p44:phase5:evidence:morgan:${draftKey}:accepted`);

test.describe.configure({ mode: "serial" });

test.describe("P44 Phase 5 AI draft governance certification", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for P44 Phase 5 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH5-EXEC creates the ordered readiness checklist without broad parent implementation", () => {
    const blocked = createP44Phase5ReadinessChecklist({
      analysisComplete: true,
      humanGoNoGo: false,
      predecessorPhase4Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createP44Phase5ReadinessChecklist({
      analysisComplete: true,
      humanGoNoGo: true,
      predecessorPhase4Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["human_go_no_go"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(p44Phase5TicketOrder);
  });

  test("P44-5-T01 creates internal-only draft state, shells and audit proof", async () => {
    const result = await createP44InternalAiDraft(prisma, {
      actorRoleKey: "analyst",
      clientSummaryDraft: "Internal AI draft for liquidity governance. Not client-safe.",
      draftKey,
      internalRationale: "Model/rules rationale must remain internal until evidence and compliance gates pass.",
      reason: "Analyst creates internal AI/rules draft after Phase 4 signal exit.",
      sourceContext: {
        processId: "E-001",
        sourceObjectId: stableId("trigger:morgan:liquidity"),
        sourceObjectType: ObjectType.TRIGGER,
        sourceRefs: ["phase4-signal-exit", "liquidity-workbench"],
      },
      tenantSlug: "morgan",
      title: "P44 internal liquidity draft",
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: result.recommendationId } });
    const internalDraft = await prisma.internalDraft.findUniqueOrThrow({ where: { id: result.internalDraftId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });

    expect(result.clientVisible).toBe(false);
    expect(result.noAutonomousAdvice).toBe(true);
    expect(recommendation.status).toBe(RecommendationStatus.AI_DRAFT);
    expect(recommendation.clientVisible).toBe(false);
    expect(recommendation.assumptionsJson).toBeNull();
    expect(recommendation.clientSummaryDraft).toBeNull();
    expect(internalDraft.draftClientSummary).toBe("Internal AI draft for liquidity governance. Not client-safe.");
    expect(internalDraft.internalRationale).toContain("Model/rules rationale");
    expect(audit.eventType).toBe("p44.ai_draft.created_internal");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("P44-5-T02 tags internal payload fields and blocks client/export projection", () => {
    const tags = tagP44InternalDraftPayload({
      clientSummary: "Safe summary",
      clientSummaryDraft: "Internal draft",
      internalRationale: "Internal rationale",
      sourceRefs: ["source-a"],
    });
    const inspection = inspectP44InternalDraftProjection({
      clientSummary: "Safe summary",
      clientSummaryDraft: "Internal draft",
      internalRationale: "Internal rationale",
    });

    expect(tags.map((tag) => tag.field)).toEqual(["clientSummaryDraft", "internalRationale", "sourceRefs"]);
    expect(inspection.cleanForClient).toBe(false);
    expect(inspection.cleanForExport).toBe(false);
    expect(inspection.clientForbiddenFields).toContain("clientSummaryDraft");
    expect(inspection.exportForbiddenFields).toContain("clientSummaryDraft");
  });

  test("P44-5-T03 persists classification and blocks unclassified handoff", async () => {
    const unclassified = await getP44InternalDraftGovernanceState(prisma, recommendationId);
    expect(canP44DraftAdvanceToAdvisor(unclassified)).toMatchObject({
      allowed: false,
      missing: ["draft_classification", "unsupported_claim_clearance"],
    });

    const result = await classifyP44InternalDraft(prisma, {
      actorRoleKey: "analyst",
      classification: {
        classification: "advice_relevant",
        riskLevel: "high",
        unsupportedClaimStatus: "clear",
      },
      reason: "Draft has been classified for internal advisor review after source context check.",
      recommendationId,
      tenantSlug: "morgan",
    });
    const classified = await getP44InternalDraftGovernanceState(prisma, recommendationId);
    const classificationRows = await prisma.draftClassification.findMany({ where: { internalDraftId: classified.draftId ?? "" } });

    expect(result.status).toBe(RecommendationStatus.ANALYST_REVIEWED);
    expect(classificationRows).toHaveLength(1);
    expect(canP44DraftAdvanceToAdvisor(classified)).toEqual({
      allowed: true,
      missing: [],
      ticketId: "P44-5-T03-EXEC",
    });
  });

  test("P44-5-T04 persists unsupported claims with evidence requirement and internal blocker state", async () => {
    const result = await persistP44UnsupportedClaim(prisma, {
      actorRoleKey: "analyst",
      claimKey: "unverified-liquidity-threshold",
      evidenceRequirement: "Reviewed custodian statement is required before rebuilding this draft.",
      reason: "The draft references an unverified liquidity threshold.",
      recommendationId,
      sourceRef: "liquidity-workbench:threshold",
      tenantSlug: "morgan",
    });
    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({ where: { id: result.evidenceRecordId } });
    const unsupportedClaim = await prisma.unsupportedClaim.findUniqueOrThrow({ where: { id: result.unsupportedClaimId } });

    expect(result.clientVisible).toBe(false);
    expect(result.status).toBe(RecommendationStatus.REVISION_REQUESTED);
    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
    expect(unsupportedClaim.claimKey).toBe("unverified-liquidity-threshold");
    expect(unsupportedClaim.evidenceRecordId).toBe(evidence.id);
  });

  test("P44-5-T05 exposes unsupported claim feedback internally and hides it from client", () => {
    const feedback = p44UnsupportedClaimFeedbackState({
      actorRoleKey: "analyst",
      evidenceRequirement: "Reviewed custodian statement is required.",
      reason: "Unverified threshold claim.",
      sourceRef: "liquidity-workbench:threshold",
      unsupportedClaimStatus: "unsupported_claims_detected",
    });
    const clientFeedback = p44UnsupportedClaimFeedbackState({
      actorRoleKey: "principal",
      evidenceRequirement: "Reviewed custodian statement is required.",
      reason: "Unverified threshold claim.",
      sourceRef: "liquidity-workbench:threshold",
      unsupportedClaimStatus: "unsupported_claims_detected",
    });

    expect(feedback.analystVisible).toBe(true);
    expect(feedback.clientVisible).toBe(false);
    expect(feedback.internalDetails?.sourceRef).toBe("liquidity-workbench:threshold");
    expect(clientFeedback.analystVisible).toBe(false);
    expect(clientFeedback.internalDetails).toBeNull();
  });

  test("P44-5-T06 rejects draft with audit and prevents advisor/release progress", async () => {
    const result = await rejectP44InternalDraft(prisma, {
      actorRoleKey: "analyst",
      reason: "Rejecting unsupported draft until evidence-backed rebuild is completed.",
      recommendationId,
      tenantSlug: "morgan",
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const rejectedGate = await getP44InternalDraftGovernanceState(prisma, recommendationId);

    expect(result.status).toBe(RecommendationStatus.REVISION_REQUESTED);
    expect(recommendation.clientVisible).toBe(false);
    expect(audit.eventType).toBe("p44.ai_draft.rejected");
    expect(audit.result).toBe(AuditResult.BLOCKED);
    expect(
      canP44EvidenceBackedDraftMoveToAdvisor({
        ...rejectedGate,
        status: recommendation.status,
      }).allowed,
    ).toBe(false);
  });

  test("P44-5-T07 rebuilds only with accepted scoped evidence", async () => {
    await expect(
      rebuildP44DraftWithEvidence(prisma, {
        actorRoleKey: "analyst",
        evidenceIds: [],
        reason: "Attempted rebuild without evidence should fail.",
        recommendationId,
        tenantSlug: "morgan",
      }),
    ).rejects.toThrow("Accepted scoped evidence is required");

    const tenantId = (await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } })).clientTenantId;
    await prisma.evidenceRecord.upsert({
      create: {
        clientTenantId: tenantId,
        id: evidenceRecordId,
        relatedObjectId: recommendationId,
        relatedObjectType: ObjectType.RECOMMENDATION,
        status: EvidenceStatus.VALIDATED,
        summary: "Reviewed custodian statement validates the liquidity threshold.",
        title: "P44 accepted draft evidence",
        visibilityStatus: VisibilityStatus.REDACTED,
      },
      update: {
        relatedObjectId: recommendationId,
        relatedObjectType: ObjectType.RECOMMENDATION,
        status: EvidenceStatus.VALIDATED,
        visibilityStatus: VisibilityStatus.REDACTED,
      },
      where: { id: evidenceRecordId },
    });

    const result = await rebuildP44DraftWithEvidence(prisma, {
      actorRoleKey: "analyst",
      evidenceIds: [evidenceRecordId],
      reason: "Rebuilding internal draft with accepted scoped evidence.",
      recommendationId,
      tenantSlug: "morgan",
    });

    expect(result.status).toBe(RecommendationStatus.ANALYST_REVIEWED);
    expect(result.clientVisible).toBe(false);
    expect(result.evidenceIds).toEqual([evidenceRecordId]);
    await expect(prisma.unsupportedClaim.findFirstOrThrow({ where: { status: "RESOLVED" } })).resolves.toBeTruthy();
  });

  test("P44-5-T08 maps internal evidence trace while client projection exposes no rationale", async () => {
    const trace = await buildP44DraftTraceMap(prisma, {
      actorRoleKey: "analyst",
      recommendationId,
      tenantSlug: "morgan",
    });

    expect(trace.internalTrace.recommendationId).toBe(recommendationId);
    expect(trace.internalTrace.evidenceRecordIds).toContain(evidenceRecordId);
    expect(trace.internalTrace.canonicalSpineUsed).toBe(true);
    expect(trace.clientSafeProjection).toEqual({
      recommendationId,
      traceAvailable: false,
    });
  });

  test("P44-5-T09 marks missing audit as a completion blocker and passes complete trace audit", async () => {
    const missingAudit = await getP44DraftTraceAudit(prisma, {
      recommendationId,
      requiredEvents: ["p44.ai_draft.nonexistent"],
    });
    const traceAudit = await getP44DraftTraceAudit(prisma, { recommendationId });

    expect(missingAudit.blocksCompletionClaim).toBe(true);
    expect(missingAudit.missing).toEqual(["p44.ai_draft.nonexistent"]);
    expect(traceAudit.blocksCompletionClaim).toBe(false);
    expect(traceAudit.auditRows).toBeGreaterThanOrEqual(3);
  });

  test("P44-5-T10 sweeps API, client-route and export payloads for internal leakage", () => {
    const sweep = sweepP44AiDraftLeakageSurfaces([
      {
        name: "api draft payload",
        payload: { clientSummaryDraft: "Internal draft", internalRationale: "Internal rationale" },
        surface: "api",
      },
      {
        name: "client route safe payload",
        payload: { clientSummary: "Released client-safe summary" },
        surface: "client_route",
      },
      {
        name: "export unsafe payload",
        payload: { clientSummary: "Safe", modelPrompt: "Internal prompt" },
        surface: "export",
      },
    ]);

    expect(sweep[0].blocked).toBe(true);
    expect(sweep[1].blocked).toBe(false);
    expect(sweep[2].forbiddenFields).toContain("modelPrompt");
  });

  test("P44-5-T11 allows advisor handoff only after clear classification and evidence-backed rebuild", async () => {
    await classifyP44InternalDraft(prisma, {
      actorRoleKey: "analyst",
      classification: {
        classification: "advice_relevant",
        riskLevel: "high",
        unsupportedClaimStatus: "clear",
      },
      reason: "Evidence-backed rebuild has been reclassified as clear for advisor review.",
      recommendationId,
      tenantSlug: "morgan",
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const gateState = await getP44InternalDraftGovernanceState(prisma, recommendationId);
    const gate = canP44EvidenceBackedDraftMoveToAdvisor({
      ...gateState,
      status: recommendation.status,
    });

    expect(gate).toEqual({
      allowed: true,
      missing: [],
      ticketId: "P44-5-T11-EXEC",
    });
  });

  test("P44-5-T12 creates negative gate matrix for unsupported, unclassified, rejected and leakage cases", () => {
    const matrix = buildP44DraftNegativeGateMatrix({
      leakageSweep: sweepP44AiDraftLeakageSurfaces([
        {
          name: "unsafe client payload",
          payload: { aiDraft: "Internal AI draft" },
          surface: "api",
        },
      ]),
      rejectedDraftGate: {
        allowed: false,
        missing: ["draft_not_rejected"],
        ticketId: "P44-5-T11-EXEC",
      },
      unclassifiedDraftGate: {
        allowed: false,
        missing: ["draft_classification"],
        ticketId: "P44-5-T03-EXEC",
      },
      unsupportedClaimFeedback: p44UnsupportedClaimFeedbackState({
        actorRoleKey: "analyst",
        evidenceRequirement: "Reviewed evidence required.",
        reason: "Unsupported claim.",
        sourceRef: "source",
        unsupportedClaimStatus: "unsupported_claims_detected",
      }),
    });

    expect(matrix.allNegativeCasesCovered).toBe(true);
    expect(matrix.rows.map((row) => row.caseId)).toEqual([
      "unsupported_claim",
      "unclassified_draft",
      "rejected_draft",
      "client_or_export_leakage",
    ]);
  });

  test("P44-5-T13 creates closure notes without demo-only completion claim", () => {
    const notes = createP44DraftWorkflowClosureNotes({
      proofNotes: ["Internal draft creation, classification, reject/rebuild, trace, leakage and negative gates are covered."],
      routeFiles: ["app/api/demo-workflow/route.ts"],
      serviceFiles: ["lib/internal-draft-governance-spine.ts"],
      testFiles: ["tests/p44-phase5-certification.spec.ts"],
    });

    expect(notes.readyForCompletionClaim).toBe(true);
    expect(notes.claimUsesDemoOnlyBehavior).toBe(false);
    expect(notes.files.services).toEqual(["lib/internal-draft-governance-spine.ts"]);
  });

  test("P44-5-T14 certifies Phase 5 exit only with all tickets and no hidden blockers", () => {
    const negativeGateMatrix = buildP44DraftNegativeGateMatrix({
      leakageSweep: sweepP44AiDraftLeakageSurfaces([
        {
          name: "unsafe client payload",
          payload: { aiDraft: "Internal AI draft" },
          surface: "api",
        },
      ]),
      rejectedDraftGate: { allowed: false, missing: ["draft_not_rejected"], ticketId: "P44-5-T11-EXEC" },
      unclassifiedDraftGate: { allowed: false, missing: ["draft_classification"], ticketId: "P44-5-T03-EXEC" },
      unsupportedClaimFeedback: p44UnsupportedClaimFeedbackState({
        actorRoleKey: "analyst",
        evidenceRequirement: "Reviewed evidence required.",
        reason: "Unsupported claim.",
        sourceRef: "source",
        unsupportedClaimStatus: "unsupported_claims_detected",
      }),
    });
    const closureNotes = createP44DraftWorkflowClosureNotes({
      proofNotes: ["All P44 Phase 5 E-domain proof layers are mapped."],
      routeFiles: ["app/api/demo-workflow/route.ts"],
      serviceFiles: ["lib/internal-draft-governance-spine.ts"],
      testFiles: ["tests/p44-phase5-certification.spec.ts"],
    });
    const certification = certifyP44AiDraftGovernanceExit({
      closureNotes,
      completedTickets: [...p44Phase5TicketOrder],
      negativeGateMatrix,
      payloadBlockers: [],
    });

    expect(certification.certified).toBe(true);
    expect(certification.status).toBe("P44_PHASE5_AI_GOVERNANCE_READY");
    expect(certification.missingTickets).toEqual([]);
  });
});
