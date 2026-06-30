import { expect, test } from "@playwright/test";

import {
  advisorOnlyCommitteeCandidate,
  committeeApprovedCandidate,
} from "../lib/committee-review-seed-data";
import { evidenceService } from "../lib/evidence-service";
import {
  releasableSuitabilityIpsCandidate,
  suitabilityGateCandidate,
} from "../lib/suitability-ips-seed-data";
import {
  canBecomeClientVisible,
  canPassComplianceReleaseGate,
  canPassHighRiskCommitteeGate,
  canReleaseAdviceWithSuitabilityIps,
} from "../lib/workflow-gate";

test.describe("Evidence sufficiency lifecycle", () => {
  test("treats upload-created evidence as review-pending, not release-ready", () => {
    const decision = evidenceService.evaluateEvidenceSufficiency({
      accepted: false,
      current: true,
      relatedObjectId: "rec-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: false,
      status: "CREATED",
      visibilityStatus: "INTERNAL_ONLY",
    });

    expect(decision.sufficient).toBe(false);
    expect(decision.label).toBe("EVIDENCE_REVIEW_PENDING");
    expect(decision.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");
    expect(decision.exportImpact).toBe("EXPORT_BLOCKED_NEEDS_EVIDENCE");
    expect(decision.missing).toContain("evidence_review");
    expect(decision.missing).toContain("evidence_acceptance");
    expect(decision.missing).toContain("client_safe_visibility");
  });

  test("accepts only reviewed, scoped, current and client-safe evidence for a specific gate", () => {
    const sufficient = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "rec-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      visibilityStatus: "REDACTED",
    });
    const wrongObject = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "rec-2",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      visibilityStatus: "REDACTED",
    });

    expect(sufficient.sufficient).toBe(true);
    expect(sufficient.label).toBe("EVIDENCE_SUFFICIENT");
    expect(wrongObject.sufficient).toBe(false);
    expect(wrongObject.missing).toContain("evidence_object_id_scope");
  });

  test("blocks stale, unlinked and internal-only evidence from sufficiency", () => {
    const staleEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: false,
      relatedObjectId: "rec-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      visibilityStatus: "REDACTED",
    });
    const unlinkedEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      visibilityStatus: "REDACTED",
    });
    const internalOnlyEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "rec-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      visibilityStatus: "INTERNAL_ONLY",
    });

    expect(staleEvidence.sufficient).toBe(false);
    expect(staleEvidence.missing).toContain("evidence_current");
    expect(staleEvidence.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");

    expect(unlinkedEvidence.sufficient).toBe(false);
    expect(unlinkedEvidence.missing).toContain("evidence_object_type_scope");
    expect(unlinkedEvidence.exportImpact).toBe("EXPORT_BLOCKED_NEEDS_EVIDENCE");

    expect(internalOnlyEvidence.sufficient).toBe(false);
    expect(internalOnlyEvidence.missing).toContain("client_safe_visibility");
    expect(internalOnlyEvidence.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");
  });

  test("models the SCF-P04 evidence request to upload to review queue without upload-to-release", () => {
    const requested = evidenceService.evaluateEvidenceLifecycle({
      relatedObjectType: "DOCUMENT",
      requiredObjectType: "DOCUMENT",
      status: "PLACEHOLDER",
      visibilityStatus: "INTERNAL_ONLY",
    });
    const uploaded = evidenceService.evaluateEvidenceLifecycle({
      accepted: false,
      current: true,
      relatedObjectId: "doc-1",
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "doc-1",
      requiredObjectType: "DOCUMENT",
      reviewed: false,
      status: "CREATED",
      uploaded: true,
      visibilityStatus: "INTERNAL_ONLY",
    });

    expect(requested.stage).toBe("NEEDS_EVIDENCE");
    expect(requested.canEnterReviewQueue).toBe(false);
    expect(requested.canSupportComplianceRelease).toBe(false);
    expect(requested.noUploadToReleaseShortcut).toBe(true);

    expect(uploaded.stage).toBe("UPLOAD_RECEIVED");
    expect(uploaded.canEnterReviewQueue).toBe(true);
    expect(uploaded.canSupportComplianceRelease).toBe(false);
    expect(uploaded.missing).toContain("evidence_review");
    expect(uploaded.noUploadToReleaseShortcut).toBe(true);
  });
});

test.describe("SCF-P06 compliance release gate", () => {
  test("passes only with advisor approval, sufficient evidence, payload, permission and audit", () => {
    const sufficientEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "rec-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "rec-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "RELEASED",
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const passed = canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const auditBlocked = canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: false,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });

    expect(passed.passed).toBe(true);
    expect(passed.missing).toEqual([]);

    expect(auditBlocked.passed).toBe(false);
    expect(auditBlocked.missing).toEqual(["audit_persistence"]);
    expect(auditBlocked.blockedReason).toContain("Compliance release requires");
  });
});

test.describe("Suitability and IPS advice visibility gate", () => {
  test("does not release client visibility from a merely created evidence record", () => {
    const gate = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      currentVisibility: "CLIENT_VISIBLE",
      evidenceStatus: "CREATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("evidence_record");
  });

  test("keeps advisor approval separate from compliance release and client visibility", () => {
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

  test("blocks client visibility when AI Draft or internal rationale payload is present", () => {
    const gate = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      containsAiDraft: true,
      containsInternalRationale: true,
      currentVisibility: "CLIENT_VISIBLE",
      evidenceStatus: "RELEASED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("ai_draft_internal_only");
    expect(gate.missing).toContain("internal_rationale_hidden");
  });

  test("blocks client visibility when active high-severity data quality is present", () => {
    const gate = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      dataQualityGate: {
        gateName: "DATA_QUALITY_RELEASE_READY",
        missing: ["high_severity_data_quality_issues"],
        passed: false,
      },
      evidenceStatus: "RELEASED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("data_quality_release_ready");
    expect(gate.missing).toContain("high_severity_data_quality_issues");
  });

  test("blocks advice-like client visibility when suitability and IPS prerequisites are incomplete", () => {
    const gate = canReleaseAdviceWithSuitabilityIps(suitabilityGateCandidate);

    expect(gate.gateName).toBe("NO_UNAPPROVED_ADVICE");
    expect(gate.passed).toBe(false);
    expect(gate.blockedReason).toBe("No unapproved advice reaches the client.");
    expect(gate.missing).toContain("recommendation_released_to_client");
    expect(gate.missing).toContain("compliance_release");
    expect(gate.missing).toContain("suitability_profile_complete");
    expect(gate.missing).toContain("risk_profile_complete");
    expect(gate.missing).toContain("investment_objectives_complete");
    expect(gate.missing).toContain("ips_mandate_acknowledged");
    expect(gate.missing).toContain("mandate_evidence_record");
    expect(gate.missing).toContain("client_acknowledgement");
  });

  test("passes only when release, evidence, suitability, IPS acknowledgement and permission gates align", () => {
    const gate = canReleaseAdviceWithSuitabilityIps(releasableSuitabilityIpsCandidate);

    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
    expect(gate.blockedReason).toBeUndefined();
  });
});

test.describe("Committee peer review gate", () => {
  test("blocks high-risk advice when only advisor approval is complete", () => {
    const gate = canPassHighRiskCommitteeGate(advisorOnlyCommitteeCandidate);

    expect(gate.gateName).toBe("NO_UNAPPROVED_ADVICE");
    expect(gate.passed).toBe(false);
    expect(gate.blockedReason).toBe("High-risk advice needs committee review before downstream release.");
    expect(gate.missing).not.toContain("advisor_approval");
    expect(gate.missing).toContain("committee_approval");
    expect(gate.missing).toContain("committee_dissent_resolved");
  });

  test("passes after high-risk committee approval, resolved dissent, evidence and permission align", () => {
    const gate = canPassHighRiskCommitteeGate(committeeApprovedCandidate);

    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
    expect(gate.blockedReason).toBeUndefined();
  });
});
