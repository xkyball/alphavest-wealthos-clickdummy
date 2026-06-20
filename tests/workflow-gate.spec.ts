import { expect, test } from "@playwright/test";

import {
  advisorOnlyCommitteeCandidate,
  committeeApprovedCandidate,
} from "../lib/committee-review-demo-data";
import { evidenceService } from "../lib/evidence-service";
import {
  releasableSuitabilityIpsCandidate,
  suitabilityGateCandidate,
} from "../lib/suitability-ips-demo-data";
import { canBecomeClientVisible, canPassHighRiskCommitteeGate, canReleaseAdviceWithSuitabilityIps } from "../lib/workflow-gate";

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
