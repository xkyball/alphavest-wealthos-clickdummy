import type { EvidenceStatus } from "@/lib/domain-types";
import {
  canReleaseAdviceWithSuitabilityIps,
  type SuitabilityIpsAdviceCandidate,
} from "@/lib/workflow-gate";

export const suitabilityIpsPageIds = ["066", "067"] as const;

export type SuitabilityIpsPageId = (typeof suitabilityIpsPageIds)[number];
export type SuitabilityBadgeTone = "blue" | "gold" | "green" | "muted" | "red";

export function isSuitabilityIpsPageId(pageId: string): pageId is SuitabilityIpsPageId {
  return suitabilityIpsPageIds.includes(pageId as SuitabilityIpsPageId);
}

export const suitabilityCase = {
  caseId: "SUT-2026-0017",
  client: "Morgan Family Office",
  principal: "Alex Morgan",
  tenantId: "morgan",
  owner: "Aisha Verma",
  advisor: "Priya Nair",
  complianceOwner: "Naledi Mokoena",
  lastUpdated: "Jun 17, 2026 10:18",
  nextReview: "Jun 24, 2026",
  suitabilityStatus: "In review",
  ipsStatus: "Draft mandate",
  evidenceCompleteness: 68,
  objectiveCoverage: 75,
  riskAlignment: 62,
};

export const suitabilityGateCandidate: SuitabilityIpsAdviceCandidate = {
  advisorApprovalStatus: "APPROVED",
  clientAcknowledgement: false,
  complianceStatus: "PENDING",
  currentVisibility: "INTERNAL_ONLY",
  evidenceStatus: "VALIDATED",
  investmentObjectiveStatus: "IN_REVIEW",
  ipsMandateStatus: "DRAFT",
  mandateEvidenceStatus: "LINKED",
  permission: { allowed: true, reasonCode: "DEMO_PERMISSIVE" },
  recommendationStatus: "ADVISOR_APPROVED",
  riskProfileStatus: "IN_REVIEW",
  suitabilityStatus: "IN_REVIEW",
};

export const releasableSuitabilityIpsCandidate: SuitabilityIpsAdviceCandidate = {
  advisorApprovalStatus: "APPROVED",
  clientAcknowledgement: true,
  complianceStatus: "RELEASED",
  currentVisibility: "CLIENT_VISIBLE",
  evidenceStatus: "VALIDATED",
  investmentObjectiveStatus: "COMPLETE",
  ipsMandateStatus: "ACKNOWLEDGED",
  mandateEvidenceStatus: "VALIDATED",
  permission: { allowed: true, reasonCode: "DEMO_PERMISSIVE" },
  recommendationStatus: "RELEASED_TO_CLIENT",
  riskProfileStatus: "COMPLETE",
  suitabilityStatus: "COMPLETE",
};

export const suitabilityGateResult = canReleaseAdviceWithSuitabilityIps(suitabilityGateCandidate);

export const suitabilityWorkflowSteps = [
  { label: "Profile intake", status: "complete" },
  { label: "Risk profile", status: "current" },
  { label: "Objectives", status: "current" },
  { label: "IPS mandate", status: "upcoming" },
  { label: "Compliance release", status: "upcoming" },
] as const;

export const suitabilityAssessments = [
  { dimension: "Risk tolerance", clientInput: "Balanced growth", reviewer: "Advisor", status: "Needs review", evidence: "Questionnaire v2" },
  { dimension: "Risk capacity", clientInput: "Moderate drawdown capacity", reviewer: "Analyst", status: "In review", evidence: "Liquidity schedule" },
  { dimension: "Time horizon", clientInput: "7-10 years", reviewer: "Advisor", status: "Verified", evidence: "Family objective record" },
  { dimension: "Liquidity needs", clientInput: "USD 1.2M reserve", reviewer: "Analyst", status: "Evidence gap", evidence: "Cash-flow plan missing" },
  { dimension: "Knowledge / experience", clientInput: "Listed securities and private markets", reviewer: "Advisor", status: "Verified", evidence: "Experience attestation" },
];

export const suitabilityObjectives = [
  { objective: "Capital preservation floor", priority: "High", owner: "Advisor", status: "Mapped", blocker: "None" },
  { objective: "Education funding", priority: "High", owner: "Family CFO", status: "Needs evidence", blocker: "Beneficiary timing" },
  { objective: "Impact allocation", priority: "Medium", owner: "Principal", status: "In review", blocker: "Mandate range not approved" },
  { objective: "Tax-aware liquidity", priority: "High", owner: "Analyst", status: "Blocked", blocker: "Tax residency certificate" },
];

export const suitabilityEvidenceItems = [
  { id: "EVD-SUT-01", status: "VALIDATED", title: "Risk questionnaire", type: "Suitability evidence", updatedAt: "10:03", visibility: "Internal only" },
  { id: "EVD-SUT-02", status: "CREATED", title: "Liquidity reserve worksheet", type: "Objective support", updatedAt: "10:09", visibility: "Advisor visible" },
  { id: "EVD-SUT-03", status: "RESTRICTED", title: "Tax residency certificate", type: "Missing evidence", updatedAt: "10:15", visibility: "Restricted" },
] as const;

export const ipsMandate = {
  mandateId: "IPS-2026-MORGAN-01",
  version: "Draft v0.8",
  scope: "Strategic family-office investment policy",
  status: "Draft - not client released",
  effectiveDate: "Not active",
  reviewCadence: "Quarterly",
  acknowledgement: "Client acknowledgement missing",
  evidenceStatus: "Linked, not validated",
};

export const ipsAllocationBands = [
  { assetClass: "Public equity", target: "38%", minimum: "30%", maximum: "45%", status: "Within proposed range" },
  { assetClass: "Investment grade fixed income", target: "24%", minimum: "18%", maximum: "32%", status: "Within proposed range" },
  { assetClass: "Private markets", target: "16%", minimum: "0%", maximum: "18%", status: "Advisor review" },
  { assetClass: "Liquidity reserve", target: "12%", minimum: "10%", maximum: "18%", status: "Evidence gap" },
  { assetClass: "Impact sleeve", target: "10%", minimum: "0%", maximum: "12%", status: "Mandate conflict" },
];

export const ipsConstraints = [
  { constraint: "Single issuer exposure", rule: "Max 5% except sovereign cash equivalents", status: "Draft" },
  { constraint: "Illiquidity cap", rule: "Max 25% across private markets and direct real estate", status: "Needs review" },
  { constraint: "Restricted instruments", rule: "No uncovered options, margin lending or crypto exposure", status: "Approved internally" },
  { constraint: "Rebalancing tolerance", rule: "Review at +/- 5% band breach", status: "Draft" },
];

export const ipsDocuments = [
  { document: "Draft IPS v0.8", type: "Mandate", status: "Draft", evidence: "EVD-IPS-01" },
  { document: "Risk profile summary", type: "Suitability", status: "Linked", evidence: "EVD-SUT-01" },
  { document: "Liquidity worksheet", type: "Constraint evidence", status: "Needs validation", evidence: "EVD-SUT-02" },
  { document: "Client acknowledgement", type: "Release prerequisite", status: "Missing", evidence: "None" },
];

export const suitabilityAuditItems = [
  { actor: "Aisha Verma", id: "AUD-SUT-01", result: "SUCCESS", timestamp: "10:03", title: "Risk questionnaire linked" },
  { actor: "Workflow gate", id: "AUD-SUT-02", result: "BLOCKED", timestamp: "10:16", title: "Advice visibility blocked by suitability and IPS gate" },
  { actor: "Naledi Mokoena", id: "AUD-SUT-03", result: "PENDING", timestamp: "10:18", title: "Compliance release pending" },
] as const;

export const gateLabelMap: Record<string, string> = {
  advisor_approval: "Advisor approval",
  client_acknowledgement: "Client acknowledgement",
  compliance_release: "Compliance release",
  evidence_record: "Evidence record",
  investment_objectives_complete: "Investment objectives complete",
  ips_mandate_acknowledged: "IPS mandate acknowledged",
  mandate_evidence_record: "Mandate evidence validated",
  permission_check: "Permission check",
  recommendation_released_to_client: "Recommendation release state",
  risk_profile_complete: "Risk profile complete",
  suitability_profile_complete: "Suitability profile complete",
};

export function toneForSuitability(value: string): SuitabilityBadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("verified") || normalized.includes("mapped") || normalized.includes("approved") || normalized.includes("within")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("missing") || normalized.includes("conflict") || normalized.includes("gap")) {
    return "red";
  }

  if (normalized.includes("review") || normalized.includes("draft") || normalized.includes("linked") || normalized.includes("pending")) {
    return "gold";
  }

  return "muted";
}

export function evidenceTone(status: EvidenceStatus | string): SuitabilityBadgeTone {
  return toneForSuitability(status.replaceAll("_", " "));
}
