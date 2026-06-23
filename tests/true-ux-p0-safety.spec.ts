import { expect, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { evidenceService } from "../lib/evidence-service";
import { exportService } from "../lib/export-service";
import { permissionEngine } from "../lib/permission-engine";
import {
  trueUxClientProjectionNoLeakageContract,
  visibilityEngine,
  type DecisionVisibilityPayload,
  type DocumentVisibilityPayload,
  type RecommendationVisibilityPayload,
} from "../lib/visibility-engine";
import {
  canBecomeClientVisible,
  canPassComplianceReleaseGate,
  canPassHighRiskCommitteeGate,
  canReleaseAdviceWithSuitabilityIps,
} from "../lib/workflow-gate";
import { evaluateMonitoringGuard } from "../lib/control-layer/monitoring-guard";

const phase11TaskIds = [
  "UX-P0-SAFETY-001",
  "UX-P0-SAFETY-002",
  "UX-P0-SAFETY-003",
  "UX-P0-SAFETY-004",
  "UX-P0-SAFETY-005",
  "UX-P0-SAFETY-006",
  "UX-P0-SAFETY-007",
  "UX-P0-SAFETY-008",
] as const;

function expectNoForbiddenClientFields(payload: Record<string, unknown>) {
  for (const field of trueUxClientProjectionNoLeakageContract.forbiddenPayloadFields) {
    expect(payload).not.toHaveProperty(field);
  }
}

function recommendationPayload(overrides: Partial<RecommendationVisibilityPayload> = {}): RecommendationVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    assumptionsJson: { internalModel: "draft" },
    clientSummary: "Released client-safe summary.",
    clientSummaryDraft: "AI Draft: hidden from clients.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only note.",
    internalRationale: "Internal advisor rationale.",
    objectId: "recommendation:bennett:p0-safety",
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Analyst-only summary.",
    visibilityStatus: "ADVISOR_VISIBLE",
    ...overrides,
  };
}

function decisionPayload(overrides: Partial<DecisionVisibilityPayload> = {}): DecisionVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    aiDraft: "AI Draft decision language.",
    assumptionsJson: { source: "internal" },
    clientSummary: "Released decision summary.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only decision note.",
    decisionState: "SUBMITTED",
    evidenceRecordId: "evidence:bennett:p0-safety",
    id: "decision:bennett:p0-safety",
    internalRationale: "Internal decision rationale.",
    releasedAt: null,
    sensitivity: "RESTRICTED",
    submittedAt: "2026-06-22T08:00:00.000Z",
    title: "P0 safety decision",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    ...overrides,
  };
}

function documentPayload(overrides: Partial<DocumentVisibilityPayload> = {}): DocumentVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    checksum: "internal-checksum",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    documentType: "financial_statement",
    evidenceRecordId: "evidence:bennett:p0-document",
    evidenceStatus: "CREATED",
    evidenceVisibilityStatus: "INTERNAL_ONLY",
    extractionStatus: "pending",
    fileName: "internal-upload.pdf",
    fileSizeBytes: 1000,
    id: "document:bennett:p0-safety",
    mimeType: "application/pdf",
    sensitivity: "CONFIDENTIAL",
    status: "UPLOADED",
    storageKey: "internal/storage-key",
    title: "P0 document upload",
    uploadedAt: "2026-06-22T08:10:00.000Z",
    ...overrides,
  };
}

test.describe("UX-P0-SAFETY phase 11 positive and negative safety proof", () => {
  test("covers every Phase 11 P0 safety task exactly", () => {
    expect(new Set(phase11TaskIds)).toEqual(new Set([
      "UX-P0-SAFETY-001",
      "UX-P0-SAFETY-002",
      "UX-P0-SAFETY-003",
      "UX-P0-SAFETY-004",
      "UX-P0-SAFETY-005",
      "UX-P0-SAFETY-006",
      "UX-P0-SAFETY-007",
      "UX-P0-SAFETY-008",
    ]));
  });

  test("UX-P0-SAFETY-001 blocks AI Draft from client projection and export package inputs", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      recommendationPayload({ clientTenantId: principal.tenant.id }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expect(projection.hiddenFields).toEqual(expect.arrayContaining(["clientSummaryDraft", "internalRationale", "complianceNotes"]));
    expectNoForbiddenClientFields(projection.payload);

    const exportDecision = exportService.canUseClientProjectionForExport({
      payload: {
        assumptionsJson: { model: "internal" },
        clientSummary: "Released summary",
        clientSummaryDraft: "AI Draft",
        complianceNotes: "Internal note",
        internalRationale: "Internal rationale",
      },
      visible: true,
    });

    expect(exportDecision.allowed).toBe(false);
    expect(exportDecision.payloadClassifications).toEqual(expect.arrayContaining(["AI_DRAFT", "COMPLIANCE_NOTES", "INTERNAL_RATIONALE"]));
    expect(exportDecision.missing).toEqual(expect.arrayContaining([
      "forbidden_projection_field:assumptionsJson",
      "forbidden_projection_field:clientSummaryDraft",
      "forbidden_projection_field:complianceNotes",
      "forbidden_projection_field:internalRationale",
    ]));
  });

  test("UX-P0-SAFETY-002 hides unreleased internal decisions and evidence from client roles", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const decisionProjection = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      decisionPayload({ clientTenantId: principal.tenant.id }),
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const documentProjection = visibilityEngine.projectDocumentPayload(
      principal.actor,
      principal.role,
      documentPayload({ clientTenantId: principal.tenant.id }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(decisionProjection.visible).toBe(false);
    expect(decisionProjection.reasonCode).toBe("DEMO_CLIENT_DECISION_FAIL_CLOSED");
    expect(decisionProjection.payload).toEqual({});
    expect(decisionProjection.hiddenFields).toEqual(expect.arrayContaining(["aiDraft", "internalRationale", "complianceNotes"]));

    expect(documentProjection.visible).toBe(false);
    expect(documentProjection.reasonCode).toBe("DEMO_CLIENT_DOCUMENT_FAIL_CLOSED");
    expect(documentProjection.payload).toEqual({});
    expect(documentProjection.hiddenFields).toEqual(expect.arrayContaining(["storageKey", "checksum", "evidenceStatus"]));
    expectNoForbiddenClientFields(decisionProjection.payload);
    expectNoForbiddenClientFields(documentProjection.payload);
  });

  test("UX-P0-SAFETY-003 keeps advisor-approved recommendations hidden until compliance release", () => {
    const gate = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "PENDING",
      currentVisibility: "ADVISOR_VISIBLE",
      evidenceStatus: "VALIDATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "ADVISOR_APPROVED",
    });

    expect(gate.passed).toBe(false);
    expect(gate.blockedReason).toBe("No unapproved advice reaches the client.");
    expect(gate.missing).toContain("recommendation_released_to_client");
    expect(gate.missing).toContain("compliance_release");
    expect(gate.missing).not.toContain("advisor_approval");
  });

  test("UX-P0-SAFETY-004 proves upload success does not unlock release, export or client visibility", () => {
    const lifecycle = evidenceService.evaluateEvidenceLifecycle({
      accepted: false,
      current: true,
      relatedObjectId: "document:bennett:p0-safety",
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "document:bennett:p0-safety",
      requiredObjectType: "DOCUMENT",
      reviewed: false,
      status: "CREATED",
      uploaded: true,
      visibilityStatus: "INTERNAL_ONLY",
    });
    const releaseGate = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      currentVisibility: "CLIENT_VISIBLE",
      evidenceStatus: "CREATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(lifecycle.stage).toBe("UPLOAD_RECEIVED");
    expect(lifecycle.canEnterReviewQueue).toBe(true);
    expect(lifecycle.canSupportComplianceRelease).toBe(false);
    expect(lifecycle.noUploadToReleaseShortcut).toBe(true);
    expect(lifecycle.missing).toContain("evidence_review");

    expect(releaseGate.passed).toBe(false);
    expect(releaseGate.missing).toContain("evidence_record");
  });

  test("UX-P0-SAFETY-005 keeps export preview separate from generation, download and share", () => {
    const previewOnly = exportService.evaluateExportStepSeparation({
      approved: false,
      downloaded: false,
      generated: false,
      previewed: true,
      shared: false,
    });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const generationGate = exportService.canGenerateExport({
      actor: compliance.actor,
      approvalComplete: false,
      auditPersistenceAvailable: true,
      clientTenantId: compliance.tenant.id,
      externalShare: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "external-limited",
      role: compliance.role,
      targetId: "export:summit:p0-safety",
      targetType: "EXPORT_REQUEST",
    });

    expect(previewOnly.stage).toBe("preview");
    expect(previewOnly.canApprove).toBe(true);
    expect(previewOnly.canGenerate).toBe(false);
    expect(previewOnly.canDownload).toBe(false);
    expect(previewOnly.canShare).toBe(false);
    expect(previewOnly.allowedNextActions).toEqual(["approve"]);
    expect(previewOnly.missing).toEqual(expect.arrayContaining([
      "approval_required_before_generation",
      "generation_required_before_download",
      "download_required_before_share",
    ]));

    expect(generationGate.allowedToGenerate).toBe(false);
    expect(generationGate.status).toBe("APPROVAL_REQUIRED");
    expect(generationGate.missing).toEqual(expect.arrayContaining(["approval", "external_share_approval"]));
  });

  test("UX-P0-SAFETY-006 denies admin force-release, evidence sufficiency, export and internal payload visibility", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const context = {
      clientTenantId: admin.tenant.id,
      platformTenantId: demoPlatformTenantId,
    };
    const releaseDecision = permissionEngine.can(
      admin.actor,
      "RELEASE",
      {
        clientTenantId: admin.tenant.id,
        objectId: "decision:bennett:p0-safety",
        objectType: "DECISION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        ...context,
        objectScope: {
          clientTenantId: admin.tenant.id,
          objectIds: ["decision:bennett:p0-safety"],
          objectType: "DECISION",
        },
      },
      admin.role,
    );
    const evidenceDecision = permissionEngine.can(
      admin.actor,
      "APPROVE",
      {
        clientTenantId: admin.tenant.id,
        objectId: "evidence:bennett:p0-safety",
        objectType: "EVIDENCE_RECORD",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        ...context,
        objectScope: {
          clientTenantId: admin.tenant.id,
          objectIds: ["evidence:bennett:p0-safety"],
          objectType: "EVIDENCE_RECORD",
        },
      },
      admin.role,
    );
    const exportDecision = permissionEngine.can(
      admin.actor,
      "EXPORT",
      {
        clientTenantId: admin.tenant.id,
        objectId: "export:bennett:p0-safety",
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        ...context,
        objectScope: {
          clientTenantId: admin.tenant.id,
          objectIds: ["export:bennett:p0-safety"],
          objectType: "EXPORT_REQUEST",
        },
      },
      admin.role,
    );
    const payloadDecision = permissionEngine.can(
      admin.actor,
      "VIEW",
      {
        clientTenantId: admin.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      {
        ...context,
        clientVisibilityState: "ADVISOR_VISIBLE",
      },
      admin.role,
    );

    expect(releaseDecision.allowed).toBe(false);
    expect(releaseDecision.reasonCode).toBe("DEMO_DENY_ADMIN_VISIBILITY_NON_BYPASS");
    expect(evidenceDecision.allowed).toBe(false);
    expect(evidenceDecision.reasonCode).toBe("DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS");
    expect(exportDecision.allowed).toBe(false);
    expect(exportDecision.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(payloadDecision.allowed).toBe(false);
    expect(payloadDecision.reasonCode).toBe("DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS");
  });

  test("UX-P0-SAFETY-007 keeps elevated KYC, IPS, committee and monitoring routes internal by default", () => {
    const committeeGate = canPassHighRiskCommitteeGate({
      advisorApprovalStatus: "APPROVED",
      committeeRequired: true,
      committeeStatus: "PENDING",
      dissentResolved: false,
      evidenceStatus: "VALIDATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      riskLevel: "CRITICAL",
    });
    const ipsGate = canReleaseAdviceWithSuitabilityIps({
      advisorApprovalStatus: "APPROVED",
      clientAcknowledgement: false,
      complianceStatus: "PENDING",
      currentVisibility: "ADVISOR_VISIBLE",
      evidenceStatus: "VALIDATED",
      investmentObjectiveStatus: "IN_REVIEW",
      ipsMandateStatus: "IN_REVIEW",
      mandateEvidenceStatus: "CREATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "ADVISOR_APPROVED",
      riskProfileStatus: "IN_REVIEW",
      suitabilityStatus: "IN_REVIEW",
    });
    const monitoringGuard = evaluateMonitoringGuard({
      dataQualityGate: {
        gateName: "DATA_QUALITY_READY",
        missing: ["missing_source_evidence"],
        passed: false,
      },
      reviewDue: true,
      triggerCreated: true,
    });

    expect(committeeGate.passed).toBe(false);
    expect(committeeGate.missing).toEqual(expect.arrayContaining(["committee_approval", "committee_dissent_resolved"]));
    expect(committeeGate.blockedReason).toBe("High-risk advice needs committee review before downstream release.");

    expect(ipsGate.passed).toBe(false);
    expect(ipsGate.missing).toEqual(expect.arrayContaining([
      "compliance_release",
      "suitability_profile_complete",
      "ips_mandate_acknowledged",
      "client_acknowledgement",
    ]));
    expect(ipsGate.blockedReason).toBe("No unapproved advice reaches the client.");

    expect(monitoringGuard.internalTriggerOnly).toBe(true);
    expect(monitoringGuard.noAdviceExecution).toBe(true);
    expect(monitoringGuard.noClientRelease).toBe(true);
    expect(monitoringGuard.clientVisible).toBe(false);
  });

  test("UX-P0-SAFETY-008 blocks gate action when audit cannot be written or confirmed", () => {
    const sufficientEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "recommendation:bennett:p0-safety",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "recommendation:bennett:p0-safety",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "RELEASED",
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const complianceGate = canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: false,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const exportGate = exportService.canGenerateExport({
      actor: compliance.actor,
      approvalComplete: true,
      auditPersistenceAvailable: false,
      clientTenantId: compliance.tenant.id,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "external-limited",
      role: compliance.role,
      targetId: "export:summit:p0-safety",
      targetType: "EXPORT_REQUEST",
    });

    expect(sufficientEvidence.sufficient).toBe(true);
    expect(complianceGate.passed).toBe(false);
    expect(complianceGate.missing).toEqual(["audit_persistence"]);
    expect(complianceGate.blockedReason).toContain("audit persistence");

    expect(exportGate.allowedToGenerate).toBe(false);
    expect(exportGate.missing).toContain("audit_persistence");
    expect(exportGate.reason).toBe("Demo export remains gated until missing controls are complete.");
  });
});
