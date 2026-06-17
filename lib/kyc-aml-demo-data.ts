export const kycAmlPageIds = ["064", "065"] as const;

export type KycAmlPageId = (typeof kycAmlPageIds)[number];

export function isKycAmlPageId(pageId: string): pageId is KycAmlPageId {
  return kycAmlPageIds.includes(pageId as KycAmlPageId);
}

export const kycCase = {
  caseId: "KYC-2026-0048",
  client: "Morgan Family Office",
  principal: "Alex Morgan",
  structure: "Morgan Family Trust and AlphaVest Family Office LLC",
  riskTier: "High",
  reviewStatus: "Enhanced due diligence",
  kycFicaStatus: "Evidence review required",
  sourceOfWealthStatus: "Partially verified",
  owner: "Naledi Mokoena",
  analyst: "Aisha Verma",
  due: "Jun 19, 2026 17:00",
  lastUpdated: "Jun 17, 2026 09:42",
  evidenceCompleteness: 74,
  amlConfidence: 82,
};

export const kycWorkflowSteps = [
  { label: "Intake", status: "complete" },
  { label: "Identity", status: "complete" },
  { label: "AML", status: "current" },
  { label: "Source review", status: "current" },
  { label: "Compliance release", status: "upcoming" },
] as const;

export const identityChecks = [
  { check: "Primary identity", evidence: "Passport and proof of address", result: "Verified", owner: "Operations" },
  { check: "Beneficial owners", evidence: "Trust deed and UBO schedule", result: "Needs review", owner: "Analyst" },
  { check: "Tax residency", evidence: "Tax residency certificate", result: "Needs evidence", owner: "Client team" },
  { check: "Consent / POPIA", evidence: "Onboarding consent record", result: "Verified", owner: "Compliance" },
];

export const amlChecks = [
  { signal: "PEP exposure", source: "World-Check One", severity: "Medium", status: "Review" },
  { signal: "Sanctions match", source: "World-Check One", severity: "Low", status: "Cleared" },
  { signal: "Adverse media", source: "News monitor", severity: "High", status: "Open" },
  { signal: "Jurisdiction risk", source: "Policy KYC-001", severity: "High", status: "Escalated" },
];

export const kycEvidenceItems = [
  { id: "EVD-KYC-01", status: "VALIDATED", title: "Passport and proof of address", type: "Identity evidence", updatedAt: "09:12", visibility: "Internal only" },
  { id: "EVD-KYC-02", status: "CREATED", title: "Trust deed UBO extraction", type: "Beneficial ownership", updatedAt: "09:24", visibility: "Compliance visible" },
  { id: "EVD-KYC-03", status: "RESTRICTED", title: "Tax residency certificate", type: "Missing evidence", updatedAt: "09:31", visibility: "Restricted" },
] as const;

export const kycAuditItems = [
  { actor: "Aisha Verma", id: "AUD-KYC-01", result: "SUCCESS", timestamp: "09:12", title: "Identity evidence linked" },
  { actor: "Naledi Mokoena", id: "AUD-KYC-02", result: "PENDING", timestamp: "09:31", title: "Enhanced due diligence requested" },
  { actor: "Workflow gate", id: "AUD-KYC-03", result: "BLOCKED", timestamp: "09:34", title: "Client release blocked" },
] as const;

export const sourceOfWealthTrail = [
  { step: "Liquidity event", party: "Morgan Holdings LLC", value: "USD 4.2M", evidence: "Sale agreement", status: "Verified" },
  { step: "Bank receipt", party: "Summit Securities", value: "USD 4.2M", evidence: "Broker statement", status: "Verified" },
  { step: "Trust distribution", party: "Morgan Family Trust", value: "USD 2.9M", evidence: "Trust resolution", status: "Needs review" },
  { step: "Incoming transfer", party: "Morgan Family Office", value: "USD 2.45M", evidence: "Wire purpose", status: "Needs evidence" },
];

export const sourceDocuments = [
  { document: "Share sale agreement", type: "Liquidity event", confidence: "High", status: "Linked" },
  { document: "Brokerage statement", type: "Funds receipt", confidence: "High", status: "Linked" },
  { document: "Trust distribution resolution", type: "Distribution", confidence: "Medium", status: "Review" },
  { document: "Wire purpose letter", type: "Transfer purpose", confidence: "Low", status: "Missing" },
];

export const sourceRiskFindings = [
  { title: "Jurisdiction handoff", detail: "Funds crossed a higher-risk banking jurisdiction before receipt.", priority: "High" },
  { title: "Purpose of transfer", detail: "Wire purpose is not yet matched to signed client instruction.", priority: "High" },
  { title: "Beneficiary control", detail: "Trustee resolution needs second reviewer confirmation.", priority: "Medium" },
];
