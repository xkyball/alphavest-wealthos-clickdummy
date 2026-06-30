import "dotenv/config";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ObjectType, PrismaClient, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { dataQualityService } from "../lib/data-quality-service";
import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { evidenceService } from "../lib/evidence-service";
import { exportService } from "../lib/export-service";
import { evaluateOperationalComplianceReleasePreconditions } from "../lib/compliance-rationale-service";
import { inspectOperationalStage8ForbiddenPayload } from "../lib/export-command-lifecycle-service";
import {
  createOperationalStage9ReadinessChecklist,
  buildOperationalStage9ActionTraceMatrix,
  buildOperationalStage9CompletionRegister,
  buildOperationalStage9MergedRoadmap,
  buildOperationalStage9TaskMasterInput,
  certifyOperationalStage9ActionTraceMatrix,
  certifyOperationalStage9BlockerRegister,
  certifyOperationalStage9CompletionRegister,
  certifyOperationalStage9MergedRoadmap,
  certifyOperationalStage9TaskMasterInput,
  certifyOperationalStage9NegativeScopeSuite,
  certifyOperationalStage9PayloadVisibilitySweep,
  certifyOperationalStage9PositiveHappyPathSuite,
  certifyOperationalStage9FinalProof,
  inspectOperationalStage9DataQualityReleaseBlock,
  inspectOperationalStage9DataQualityResolution,
  inspectOperationalStage9AdvisorNotRelease,
  inspectOperationalStage9ComplianceAuditFailClosed,
  inspectOperationalStage9EvidenceLifecycleRegression,
  inspectOperationalStage9ExportForbiddenPayloadRegression,
  operationalStage9NegativeScopeCases,
  operationalStage9PayloadVisibilityRows,
  operationalStage9ProcessProofRows,
  operationalStage9RemainingBlockerRegister,
  operationalStage9TicketOrder,
  type OperationalStage9TicketId,
} from "../lib/cross-process-certification";
import { workflowGate } from "../lib/workflow-gate";

function auditInput(reason: string) {
  const session = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });

  return {
    actorRoleKey: session.role.key,
    actorUserId: session.actor.id,
    platformTenantId: demoPlatformTenantId,
    reason,
  };
}

test.describe.serial("Operational Stage 9 data-quality and cross-process certification", () => {
  test.setTimeout(150_000);

  let prisma: PrismaClient;
  const completedTickets = new Set<OperationalStage9TicketId>();

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Operational Stage 9 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH9-EXEC exposes ordered readiness only after Stage 8, analysis and spec exits", () => {
    const blocked = createOperationalStage9ReadinessChecklist({
      analysisComplete: true,
      predecessorStage8Exit: false,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createOperationalStage9ReadinessChecklist({
      analysisComplete: true,
      predecessorStage8Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["operational_stage8_exit"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(operationalStage9TicketOrder);
  });

  test("Operational-9-T01 resolves a data-quality issue through audited status transition without deleting it", async () => {
    const session = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const targetId = randomUUID();
    const created = await dataQualityService.createDataQualityIssue(prisma, {
      audit: auditInput("Compliance opened a blocker for Stage 9 resolution certification."),
      clientTenantId: session.tenant.id,
      description: "Conflicting source-of-funds data must be resolved before certification.",
      issueType: "source_of_funds_conflict",
      severity: "critical",
      status: WorkflowStatus.IN_REVIEW,
      targetId,
      targetType: ObjectType.RECOMMENDATION,
    });
    const before = await prisma.dataQualityIssue.findUniqueOrThrow({ where: { id: created.issueId } });

    const resolved = await dataQualityService.resolveDataQualityIssue(prisma, {
      audit: auditInput("Reviewed evidence trail and resolved source-of-funds conflict."),
      issueId: created.issueId,
    });
    const after = await prisma.dataQualityIssue.findUnique({ where: { id: created.issueId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: resolved.auditEventId } });
    const inspection = inspectOperationalStage9DataQualityResolution({
      audit,
      issueAfterResolution: after,
      issueBeforeResolution: before,
    });

    expect(after).not.toBeNull();
    expect(after?.status).toBe(WorkflowStatus.COMPLETED);
    expect(audit.eventType).toBe("data_quality.issue.resolved");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(inspection.passed).toBe(true);
    expect(inspection.issueStillPresent).toBe(true);
    expect(inspection.statusResolved).toBe(true);
    expect(inspection.audited).toBe(true);
    completedTickets.add("Operational-9-T01-EXEC");
  });

  test("Operational-9-T02 blocks release and export on unresolved high-severity data quality until audited resolution", async () => {
    const session = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const targetId = randomUUID();
    const created = await dataQualityService.createDataQualityIssue(prisma, {
      audit: auditInput("Compliance opened a release blocker for Stage 9 gate integration."),
      clientTenantId: session.tenant.id,
      description: "Unresolved beneficial-owner conflict blocks release/export certification.",
      issueType: "beneficial_owner_conflict",
      severity: "high",
      status: WorkflowStatus.IN_REVIEW,
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const activeSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: session.tenant.id,
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const activeGate = dataQualityService.evaluateDataQualityReleaseGate(activeSnapshot);
    const sufficientEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: targetId,
      relatedObjectType: "EXPORT_REQUEST",
      requiredObjectId: targetId,
      requiredObjectType: "EXPORT_REQUEST",
      reviewed: true,
      status: "RELEASED",
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const blockedRelease = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      dataQualityGate: activeGate,
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const blockedExport = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      dataQualityGate: activeGate,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "client-safe-redacted",
      role: session.role,
      targetId,
      targetType: "EXPORT_REQUEST",
    });

    const resolved = await dataQualityService.resolveDataQualityIssue(prisma, {
      audit: auditInput("Audited source correction before release/export unblock."),
      issueId: created.issueId,
    });
    const resolvedSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: session.tenant.id,
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const resolvedGate = dataQualityService.evaluateDataQualityReleaseGate(resolvedSnapshot);
    const allowedRelease = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      dataQualityGate: resolvedGate,
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const allowedExport = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      dataQualityGate: resolvedGate,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "client-safe-redacted",
      role: session.role,
      targetId,
      targetType: "EXPORT_REQUEST",
    });
    const resolvedAudit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: resolved.auditEventId },
    });
    const inspection = inspectOperationalStage9DataQualityReleaseBlock({
      activeGatePassed: activeGate.passed,
      allowedAfterResolution: allowedRelease.passed && allowedExport.allowedToGenerate,
      blockedExportMissing: blockedExport.missing,
      blockedReleaseMissing: blockedRelease.missing,
      resolvedAuditAvailable: resolvedAudit.eventType === "data_quality.issue.resolved",
    });

    expect(activeGate.passed).toBe(false);
    expect(blockedRelease.passed).toBe(false);
    expect(blockedRelease.missing).toContain("data_quality_release_ready");
    expect(blockedExport.allowedToGenerate).toBe(false);
    expect(blockedExport.missing).toContain("data_quality_release_ready");
    expect(resolvedGate.passed).toBe(true);
    expect(allowedRelease.passed).toBe(true);
    expect(allowedExport.allowedToGenerate).toBe(true);
    expect(inspection.passed).toBe(true);
    expect(inspection.releaseBlocked).toBe(true);
    expect(inspection.exportBlocked).toBe(true);
    completedTickets.add("Operational-9-T02-EXEC");
  });

  test("Operational-9-T03 covers all 44 source execution processes with positive proof and test references", () => {
    const certification = certifyOperationalStage9PositiveHappyPathSuite(operationalStage9ProcessProofRows);

    expect(certification.coveredProcessCount).toBe(44);
    expect(certification.certification).toBe("PH9_POSITIVE_P0_PACK_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.rowsWithoutCompletionProof).toEqual([]);
    expect(certification.rowsWithoutPositiveProof).toEqual([]);
    expect(certification.rowsWithoutTestReference).toEqual([]);
    completedTickets.add("Operational-9-T03-EXEC");
  });

  test("Operational-9-T04 certifies representative wrong actor, tenant and object denials without leaks", () => {
    const certification = certifyOperationalStage9NegativeScopeSuite(operationalStage9NegativeScopeCases);

    expect(certification.certification).toBe("PH9_NEGATIVE_SCOPE_PACK_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.unsafeCases).toEqual([]);
    completedTickets.add("Operational-9-T04-EXEC");
  });

  test("Operational-9-T05 sweeps payload visibility across client, internal, admin and export surfaces", () => {
    const certification = certifyOperationalStage9PayloadVisibilitySweep(operationalStage9PayloadVisibilityRows);

    expect(certification.certification).toBe("PH9_PAYLOAD_VISIBILITY_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.unsafeRows).toEqual([]);
    completedTickets.add("Operational-9-T05-EXEC");
  });

  test("Operational-9-T06 prevents upload-only evidence from unlocking release or export", () => {
    const targetId = randomUUID();
    const uploadedLifecycle = evidenceService.evaluateEvidenceLifecycle({
      accepted: false,
      current: false,
      relatedObjectId: targetId,
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: targetId,
      requiredObjectType: "RECOMMENDATION",
      reviewed: false,
      status: "CREATED",
      uploaded: true,
      visibilityStatus: "INTERNAL_ONLY",
    });
    const sufficientLifecycle = evidenceService.evaluateEvidenceLifecycle({
      accepted: true,
      current: true,
      relatedObjectId: targetId,
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: targetId,
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "RELEASED",
      uploaded: true,
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const uploadOnlyRelease = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: {
        exportImpact: "EXPORT_BLOCKED_NEEDS_EVIDENCE",
        label: "EVIDENCE_REVIEW_PENDING",
        missing: uploadedLifecycle.missing,
        releaseImpact: "RELEASE_BLOCKED_NEEDS_EVIDENCE",
        sufficient: uploadedLifecycle.canSupportComplianceRelease,
      },
      payloadReady: true,
    });
    const inspection = inspectOperationalStage9EvidenceLifecycleRegression({
      sufficientLifecycleCanRelease: sufficientLifecycle.canSupportComplianceRelease,
      uploadLifecycleCanRelease: uploadedLifecycle.canSupportComplianceRelease,
      uploadLifecycleCanReview: uploadedLifecycle.canEnterReviewQueue,
      uploadOnlyReleasePassed: uploadOnlyRelease.passed,
    });

    expect(uploadedLifecycle.stage).toBe("UPLOAD_RECEIVED");
    expect(uploadedLifecycle.canEnterReviewQueue).toBe(true);
    expect(uploadedLifecycle.canSupportComplianceRelease).toBe(false);
    expect(uploadOnlyRelease.passed).toBe(false);
    expect(uploadOnlyRelease.missing).toContain("evidence_sufficiency");
    expect(sufficientLifecycle.canSupportComplianceRelease).toBe(true);
    expect(inspection.passed).toBe(true);
    expect(inspection.uploadNotSufficient).toBe(true);
    completedTickets.add("Operational-9-T06-EXEC");
  });

  test("Operational-9-T07 keeps advisor approval separate from compliance release and client visibility", () => {
    const advisorOnlyGate = workflowGate.canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "PENDING",
      evidenceStatus: "RELEASED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "COMPLIANCE_PENDING",
    });
    const fullReleaseGate = workflowGate.canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      evidenceStatus: "RELEASED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });
    const inspection = inspectOperationalStage9AdvisorNotRelease({
      advisorOnlyGateMissing: advisorOnlyGate.missing,
      advisorOnlyPassed: advisorOnlyGate.passed,
      fullReleasePassed: fullReleaseGate.passed,
    });

    expect(advisorOnlyGate.passed).toBe(false);
    expect(advisorOnlyGate.missing).not.toContain("advisor_approval");
    expect(advisorOnlyGate.missing).toContain("compliance_release");
    expect(advisorOnlyGate.missing).toContain("recommendation_released_to_client");
    expect(fullReleaseGate.passed).toBe(true);
    expect(inspection.passed).toBe(true);
    expect(inspection.advisorApprovalNotTreatedAsRelease).toBe(true);
    completedTickets.add("Operational-9-T07-EXEC");
  });

  test("Operational-9-T08 holds compliance release closed when preconditions or audit persistence are missing", () => {
    const missingPreconditions = evaluateOperationalComplianceReleasePreconditions({
      advisorApproved: true,
      auditPersistenceAvailable: true,
      evidenceSufficient: false,
      payloadReady: true,
      permissionAllowed: true,
      rationaleCaptured: false,
      redactionReady: true,
    });
    const auditFailureGate = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: false,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: {
        exportImpact: "EXPORT_ALLOWED_FOR_SCOPED_GATE",
        label: "EVIDENCE_SUFFICIENT",
        missing: [],
        releaseImpact: "RELEASE_ALLOWED_FOR_SCOPED_GATE",
        sufficient: true,
      },
      payloadReady: true,
    });
    const inspection = inspectOperationalStage9ComplianceAuditFailClosed({
      auditFailureMissing: auditFailureGate.missing,
      auditFailurePassed: auditFailureGate.passed,
      missingPreconditionList: missingPreconditions.missing,
      preconditionsPassed: missingPreconditions.canRelease,
    });

    expect(missingPreconditions.canRelease).toBe(false);
    expect(missingPreconditions.missing).toEqual(expect.arrayContaining(["evidence_sufficiency", "decision_rationale"]));
    expect(auditFailureGate.passed).toBe(false);
    expect(auditFailureGate.missing).toContain("audit_persistence");
    expect(inspection.passed).toBe(true);
    expect(inspection.preconditionBlocked).toBe(true);
    expect(inspection.auditFailClosed).toBe(true);
    completedTickets.add("Operational-9-T08-EXEC");
  });

  test("Operational-9-T09 rejects forbidden export payload classes and accepts only clean export proof", () => {
    const session = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const cleanInspection = inspectOperationalStage8ForbiddenPayload({
      forbiddenFields: [],
      manifestForbiddenPayloads: [],
    });
    const dirtyExport = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "INTERNAL_RATIONALE", "UNRELEASED_EVIDENCE"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "client-safe-redacted",
      role: session.role,
      targetId: randomUUID(),
      targetType: "EXPORT_REQUEST",
    });
    const inspection = inspectOperationalStage9ExportForbiddenPayloadRegression({
      cleanInspectionPassed: cleanInspection.clean,
      dirtyExportMissing: dirtyExport.missing,
      dirtyExportPassed: dirtyExport.allowedToGenerate,
    });

    expect(cleanInspection.clean).toBe(true);
    expect(dirtyExport.allowedToGenerate).toBe(false);
    expect(dirtyExport.missing).toEqual(
      expect.arrayContaining(["forbidden_payload:INTERNAL_RATIONALE", "forbidden_payload:UNRELEASED_EVIDENCE"]),
    );
    expect(inspection.passed).toBe(true);
    expect(inspection.forbiddenPayloadRejected).toBe(true);
    completedTickets.add("Operational-9-T09-EXEC");
  });

  test("Operational-9-T10 traces every source execution action to route, API, service, DB and test status", () => {
    const traceMatrix = buildOperationalStage9ActionTraceMatrix(operationalStage9ProcessProofRows);
    const certification = certifyOperationalStage9ActionTraceMatrix(traceMatrix);

    expect(traceMatrix).toHaveLength(44);
    expect(certification.certification).toBe("PH9_ACTION_TRACE_READY");
    expect(certification.ambiguousRows).toEqual([]);
    expect(certification.tracedActionCount).toBe(44);
    completedTickets.add("Operational-9-T10-EXEC");
  });

  test("Operational-9-T11 assigns completion labels only when proof links exist", () => {
    const register = buildOperationalStage9CompletionRegister(operationalStage9ProcessProofRows);
    const certification = certifyOperationalStage9CompletionRegister(register);

    expect(register).toHaveLength(44);
    expect(register.every((row) => row.completionLabel !== "BLOCKER")).toBe(true);
    expect(certification.certification).toBe("PH9_COMPLETION_REGISTER_READY");
    expect(certification.optimisticRows).toEqual([]);
    expect(certification.hiddenBlockers).toEqual([]);
    completedTickets.add("Operational-9-T11-EXEC");
  });

  test("Operational-9-T12 groups remaining blockers without hiding them inside completed claims", () => {
    const certification = certifyOperationalStage9BlockerRegister(operationalStage9RemainingBlockerRegister);

    expect(certification.certification).toBe("PH9_BLOCKER_REGISTER_READY");
    expect(certification.missingCategories).toEqual([]);
    expect(certification.hiddenRows).toEqual([]);
    expect(certification.completionAffectingCount).toBe(0);
    completedTickets.add("Operational-9-T12-EXEC");
  });

  test("Operational-9-T13 merges 27 strong processes and 44 remaining processes into a non-duplicated roadmap", () => {
    const roadmap = buildOperationalStage9MergedRoadmap({
      priorStrongProcessCount: 27,
      remainingRows: operationalStage9ProcessProofRows,
    });
    const certification = certifyOperationalStage9MergedRoadmap(roadmap);

    expect(roadmap.priorStrongProcessCount).toBe(27);
    expect(roadmap.remainingProcessCount).toBe(44);
    expect(roadmap.mergedProcessCount).toBe(71);
    expect(roadmap.duplicateTicketIds).toEqual([]);
    expect(roadmap.conflictingAcceptance).toEqual([]);
    expect(certification.certification).toBe("PH9_71_PROCESS_ROADMAP_READY");
    expect(certification.missingProof).toEqual([]);
    completedTickets.add("Operational-9-T13-EXEC");
  });

  test("Operational-9-T14 prepares task master input without authorizing implementation", () => {
    const taskMasterInput = buildOperationalStage9TaskMasterInput(operationalStage9ProcessProofRows);
    const certification = certifyOperationalStage9TaskMasterInput(taskMasterInput);

    expect(taskMasterInput.noImplementationAuthority).toBe(true);
    expect(certification.certification).toBe("PH9_TASK_MASTER_INPUT_READY");
    expect(certification.candidateCount).toBe(44);
    expect(certification.incompleteCandidates).toEqual([]);
    expect(certification.noImplementationAuthority).toBe(true);
    completedTickets.add("Operational-9-T14-EXEC");
  });

  test("Operational-9-T15 certifies final QA without overclaim or safety weakening", () => {
    const certification = certifyOperationalStage9FinalProof({
      completedTicketIds: operationalStage9TicketOrder,
      noApiOverclaim: true,
      noP1HoldFutureElevation: true,
      noSafetyWeakening: true,
      noSchemaOverclaim: true,
      noTestOverclaim: true,
      noVisualOverclaim: true,
    });

    expect(certification.certification).toBe("PH9_FINAL_QA_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.missingTickets).toEqual([]);
    completedTickets.add("Operational-9-T15-EXEC");
  });
});
