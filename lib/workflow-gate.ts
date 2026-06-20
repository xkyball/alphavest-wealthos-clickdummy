import type { PermissionDecision } from "@/lib/permission-engine";
import { evidenceService } from "@/lib/evidence-service";
import type {
  ComplianceStatus,
  EvidenceStatus,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
} from "@/lib/domain-types";

export type ClientVisibilityCandidate = {
  recommendationStatus: RecommendationStatus;
  advisorApprovalStatus: ReviewStatus;
  complianceStatus: ComplianceStatus;
  evidenceStatus: EvidenceStatus;
  permission: Pick<PermissionDecision, "allowed" | "reasonCode">;
  currentVisibility?: VisibilityStatus;
};

export type WorkflowGateResult = {
  gateName: "NO_UNAPPROVED_ADVICE";
  passed: boolean;
  missing: string[];
  blockedReason?: string;
};

export type CommitteeReviewStatus = "NOT_REQUIRED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "DISSENT" | "BLOCKED";

export type HighRiskCommitteeCandidate = {
  advisorApprovalStatus: ReviewStatus;
  committeeRequired: boolean;
  committeeStatus: CommitteeReviewStatus;
  dissentResolved: boolean;
  evidenceStatus: EvidenceStatus;
  permission: Pick<PermissionDecision, "allowed" | "reasonCode">;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export type SuitabilityStatus = "NOT_STARTED" | "IN_REVIEW" | "COMPLETE" | "STALE" | "BLOCKED";

export type IpsMandateStatus = "DRAFT" | "IN_REVIEW" | "ACKNOWLEDGED" | "STALE" | "BLOCKED";

export type SuitabilityIpsAdviceCandidate = ClientVisibilityCandidate & {
  clientAcknowledgement: boolean;
  investmentObjectiveStatus: SuitabilityStatus;
  ipsMandateStatus: IpsMandateStatus;
  mandateEvidenceStatus: EvidenceStatus;
  riskProfileStatus: SuitabilityStatus;
  suitabilityStatus: SuitabilityStatus;
};

export function canBecomeClientVisible(candidate: ClientVisibilityCandidate): WorkflowGateResult {
  const missing: string[] = [];

  if (candidate.recommendationStatus !== "RELEASED_TO_CLIENT") {
    missing.push("recommendation_released_to_client");
  }

  if (candidate.advisorApprovalStatus !== "APPROVED") {
    missing.push("advisor_approval");
  }

  if (candidate.complianceStatus !== "RELEASED") {
    missing.push("compliance_release");
  }

  if (!evidenceService.hasSufficientEvidenceStatus(candidate.evidenceStatus)) {
    missing.push("evidence_record");
  }

  if (!candidate.permission.allowed) {
    missing.push("permission_check");
  }

  return {
    gateName: "NO_UNAPPROVED_ADVICE",
    passed: missing.length === 0,
    missing,
    blockedReason: missing.length > 0 ? "No unapproved advice reaches the client." : undefined,
  };
}

export function canReleaseAdviceWithSuitabilityIps(candidate: SuitabilityIpsAdviceCandidate): WorkflowGateResult {
  const baseGate = canBecomeClientVisible(candidate);
  const missing = [...baseGate.missing];

  if (candidate.suitabilityStatus !== "COMPLETE") {
    missing.push("suitability_profile_complete");
  }

  if (candidate.riskProfileStatus !== "COMPLETE") {
    missing.push("risk_profile_complete");
  }

  if (candidate.investmentObjectiveStatus !== "COMPLETE") {
    missing.push("investment_objectives_complete");
  }

  if (candidate.ipsMandateStatus !== "ACKNOWLEDGED") {
    missing.push("ips_mandate_acknowledged");
  }

  if (!evidenceService.hasSufficientEvidenceStatus(candidate.mandateEvidenceStatus)) {
    missing.push("mandate_evidence_record");
  }

  if (!candidate.clientAcknowledgement) {
    missing.push("client_acknowledgement");
  }

  const uniqueMissing = [...new Set(missing)];

  return {
    gateName: "NO_UNAPPROVED_ADVICE",
    passed: uniqueMissing.length === 0,
    missing: uniqueMissing,
    blockedReason: uniqueMissing.length > 0 ? "No unapproved advice reaches the client." : undefined,
  };
}

export function canPassHighRiskCommitteeGate(candidate: HighRiskCommitteeCandidate): WorkflowGateResult {
  const missing: string[] = [];

  if (candidate.advisorApprovalStatus !== "APPROVED") {
    missing.push("advisor_approval");
  }

  if ((candidate.riskLevel === "HIGH" || candidate.riskLevel === "CRITICAL") && !candidate.committeeRequired) {
    missing.push("committee_required_for_high_risk");
  }

  if (candidate.committeeRequired && candidate.committeeStatus !== "APPROVED") {
    missing.push("committee_approval");
  }

  if (candidate.committeeStatus === "DISSENT" || !candidate.dissentResolved) {
    missing.push("committee_dissent_resolved");
  }

  if (!evidenceService.hasSufficientEvidenceStatus(candidate.evidenceStatus)) {
    missing.push("committee_evidence_record");
  }

  if (!candidate.permission.allowed) {
    missing.push("permission_check");
  }

  const uniqueMissing = [...new Set(missing)];

  return {
    gateName: "NO_UNAPPROVED_ADVICE",
    passed: uniqueMissing.length === 0,
    missing: uniqueMissing,
    blockedReason: uniqueMissing.length > 0 ? "High-risk advice needs committee review before downstream release." : undefined,
  };
}

export const workflowGate = {
  canBecomeClientVisible,
  canReleaseAdviceWithSuitabilityIps,
  canPassHighRiskCommitteeGate,
};
