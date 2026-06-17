import { createHash } from "node:crypto";

export type JourneyFixtureRefType =
  | "tenant"
  | "user"
  | "trigger"
  | "actionItem"
  | "recommendation"
  | "approval"
  | "complianceReview"
  | "decision"
  | "evidenceRecord"
  | "document"
  | "exportRequest"
  | "accessRequest"
  | "policyDefinition"
  | "entity";

export type JourneyFixtureRef = {
  key: string;
  type: JourneyFixtureRefType;
  id: string;
  label: string;
};

export type JourneyFixture = {
  fixtureId: string;
  journeyId: string;
  tenantSlug: "bennett" | "morgan" | "northbridge" | "summit";
  tenantName: string;
  primaryRoleKey: string;
  seedScenario: string;
  resetStrategy: "base-seed";
  refs: JourneyFixtureRef[];
  formInputs: Record<string, string>;
  clickPath: string[];
  expectedMutations: string[];
};

function stableId(label: string) {
  const hash = createHash("sha1").update(`alphavest-wealthos:${label}`).digest("hex");
  const variant = ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

const tenantNames: Record<JourneyFixture["tenantSlug"], string> = {
  bennett: "Bennett Family Office",
  morgan: "Morgan Family Office",
  northbridge: "Northbridge Family Office",
  summit: "Summit Ridge Capital",
};

function tenantRef(slug: JourneyFixture["tenantSlug"]): JourneyFixtureRef {
  return {
    key: "tenant",
    type: "tenant",
    id: stableId(`tenant:${slug}`),
    label: tenantNames[slug],
  };
}

function userRef(key: string, label: string): JourneyFixtureRef {
  return {
    key: `user.${key}`,
    type: "user",
    id: stableId(`user:${key}`),
    label,
  };
}

function ref(type: JourneyFixtureRefType, key: string, label: string): JourneyFixtureRef {
  return {
    key,
    type,
    id: stableId(key),
    label,
  };
}

function workflowRefs(slug: JourneyFixture["tenantSlug"]) {
  return [
    ref("trigger", `trigger:${slug}:liquidity`, `${tenantNames[slug]} liquidity trigger`),
    ref("trigger", `trigger:${slug}:missing-tax`, `${tenantNames[slug]} missing tax certificate trigger`),
    ref("actionItem", `action:${slug}:tax-cert`, "Upload current tax residency certificate"),
    ref("actionItem", `action:${slug}:blocked-release`, "Resolve release gate"),
    ref("recommendation", `recommendation:${slug}:liquidity-review`, `${tenantNames[slug]} liquidity recommendation`),
    ref("approval", `approval:${slug}:advisor`, "Advisor approval"),
    ref("complianceReview", `compliance:${slug}:liquidity-review`, "Compliance review"),
    ref("decision", `decision:${slug}:liquidity-review`, `${tenantNames[slug]} liquidity decision`),
    ref("evidenceRecord", `evidence:${slug}:decision-pack`, `${tenantNames[slug]} decision evidence`),
    ref("document", `document:${slug}:trust-deed`, "Trust deed"),
    ref("document", `document:${slug}:statement`, "Portfolio statement"),
    ref("document", `document:${slug}:missing-tax`, "Tax residency certificate request"),
    ref("exportRequest", `export:${slug}:evidence-pack`, "Evidence export request"),
    ref("accessRequest", `access-request:${slug}:external`, "External advisor access request"),
    ref("entity", `entity:${slug}:trust`, `${tenantNames[slug]} trust entity`),
  ] satisfies JourneyFixtureRef[];
}

function platformPolicyRefs() {
  return [
    ref("policyDefinition", "policy:platform:advice-boundary:v1", "No Unapproved Advice Boundary"),
    ref("policyDefinition", "policy:platform:evidence:v1", "Evidence by Default"),
    ref("policyDefinition", "policy:platform:export:v1", "Export Redaction Defaults"),
  ] satisfies JourneyFixtureRef[];
}

function baseFixture(input: Omit<JourneyFixture, "tenantName" | "resetStrategy" | "refs"> & { refs?: JourneyFixtureRef[] }) {
  return {
    ...input,
    tenantName: tenantNames[input.tenantSlug],
    resetStrategy: "base-seed" as const,
    refs: [tenantRef(input.tenantSlug), ...(input.refs ?? [])],
  } satisfies JourneyFixture;
}

export const journeyFixtures: JourneyFixture[] = [
  baseFixture({
    fixtureId: "fixture-j01-signal-advisor-gate",
    journeyId: "J01",
    tenantSlug: "northbridge",
    primaryRoleKey: "analyst",
    seedScenario: "Blocked high-risk liquidity trigger with advisor review but no client release.",
    refs: [
      userRef("analyst", "Mira Patel"),
      userRef("advisor", "Thabo Khumalo"),
      userRef("compliance", "Naledi Mokoena"),
      ...workflowRefs("northbridge"),
    ],
    formInputs: {
      requestDataNote: "Please confirm beneficial owner, purpose of wire and source of funds before routing.",
      advisorReviewNote: "Advisor can review, but compliance release remains required.",
    },
    clickPath: ["Request Data / Information", "Reassign / Route", "Approve", "Escalate"],
    expectedMutations: ["trigger.request_data", "trigger.route", "approval.reviewed", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j02-compliance-release-block",
    journeyId: "J02",
    tenantSlug: "morgan",
    primaryRoleKey: "compliance_officer",
    seedScenario: "Compliance review with missing evidence and block/request-evidence paths.",
    refs: [userRef("compliance", "Naledi Mokoena"), ...workflowRefs("morgan")],
    formInputs: {
      requestEvidenceNote: "Record of advice and refreshed tax certificate required before release.",
      blockReason: "Evidence incomplete; client release remains blocked.",
    },
    clickPath: ["Request Evidence", "Block", "Release"],
    expectedMutations: ["compliance.needs_evidence", "compliance.blocked", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j03-client-decision-evidence",
    journeyId: "J03",
    tenantSlug: "bennett",
    primaryRoleKey: "principal",
    seedScenario: "Client-visible released decision and evidence package.",
    refs: [userRef("bennett:principal", "Bennett Principal"), ...workflowRefs("bennett")],
    formInputs: {
      decisionComment: "Accepted after reviewing released evidence package.",
      reviewDate: "2026-09-14",
    },
    clickPath: ["Accept Option 1", "Request More Information", "View Evidence Record", "Download"],
    expectedMutations: ["decision.accepted", "evidence.created", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j04-document-upload-verification",
    journeyId: "J04",
    tenantSlug: "morgan",
    primaryRoleKey: "family_cfo",
    seedScenario: "Client document upload, extraction review and verification pending state.",
    refs: [userRef("morgan:cfo", "Morgan Family CFO"), ...workflowRefs("morgan")],
    formInputs: {
      documentTitle: "Morgan 2026 Tax Residency Certificate",
      fileName: "morgan-tax-residency-2026.pdf",
      extractionCorrection: "Tax residency: United Kingdom",
    },
    clickPath: ["Upload", "Upload Document", "Choose Files", "Confirm & Finalize", "View Details"],
    expectedMutations: ["document.uploaded", "document.ai_extracted", "document.client_confirmed", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j05-entity-wealth-action",
    journeyId: "J05",
    tenantSlug: "summit",
    primaryRoleKey: "principal",
    seedScenario: "Entity creation, wealth map inspection and action-board readiness.",
    refs: [userRef("summit:principal", "Ridge Principal"), ...workflowRefs("summit")],
    formInputs: {
      entityName: "Summit Ridge Philanthropy LLC",
      registrationNumber: "SRP-2026-001",
      actionNote: "Ready for advisor review after entity confirmation.",
    },
    clickPath: ["Create Entity", "Continue", "Edit Entity", "View details", "Mark Ready", "Request Info"],
    expectedMutations: ["entity.created", "wealth_map.updated", "action.ready", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j06-tenant-onboarding",
    journeyId: "J06",
    tenantSlug: "morgan",
    primaryRoleKey: "admin",
    seedScenario: "Tenant onboarding from draft details to principal invitation.",
    refs: [userRef("admin", "Ava Naidoo"), userRef("success", "Lina Botha"), ...workflowRefs("morgan")],
    formInputs: {
      tenantName: "Morgan Family Office",
      jurisdiction: "United Kingdom",
      principalEmail: "principal.morgan@example.demo",
    },
    clickPath: ["New Tenant", "Continue", "Assign", "Send Invitation"],
    expectedMutations: ["tenant.created_or_updated", "team.assigned", "invitation.sent", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j07-governance-access-audit",
    journeyId: "J07",
    tenantSlug: "northbridge",
    primaryRoleKey: "principal",
    seedScenario: "Governance user invite, role change, access approval and audit export.",
    refs: [userRef("northbridge:principal", "North Principal"), userRef("compliance", "Naledi Mokoena"), ...workflowRefs("northbridge")],
    formInputs: {
      inviteEmail: "external.northbridge@example.demo",
      confirmationPhrase: "CONFIRM SCOPED ACCESS",
    },
    clickPath: ["Invite User", "Send Invitation", "Save Changes", "Approve", "Export"],
    expectedMutations: ["user.invited", "role.updated", "access.approved", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j08-export-redaction",
    journeyId: "J08",
    tenantSlug: "summit",
    primaryRoleKey: "principal",
    seedScenario: "Export scope, redaction, approval and download/share controls.",
    refs: [userRef("summit:principal", "Ridge Principal"), userRef("compliance", "Naledi Mokoena"), ...workflowRefs("summit")],
    formInputs: {
      exportName: "Summit Ridge Evidence Pack",
      redactionReason: "Remove internal-only notes before external sharing.",
    },
    clickPath: ["Data Extract", "Clear", "Confirm", "Download", "Share"],
    expectedMutations: ["export.scope_selected", "export.redacted", "export.approved", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j09-client-profile-family-intake",
    journeyId: "J09",
    tenantSlug: "bennett",
    primaryRoleKey: "principal",
    seedScenario: "Client profile, family member and relationship intake.",
    refs: [userRef("bennett:principal", "Bennett Principal"), ...workflowRefs("bennett")],
    formInputs: {
      familyMemberName: "Olivia Bennett",
      relationshipLabel: "Next Gen",
      profileUpdateNote: "Updated governance contact details.",
    },
    clickPath: ["Upload", "Submit", "Add Member", "Edit", "Family Map", "Add"],
    expectedMutations: ["profile.updated", "family_member.created", "relationship.created", "audit.created"],
  }),
  baseFixture({
    fixtureId: "fixture-j10-platform-no-advice-baseline",
    journeyId: "J10",
    tenantSlug: "northbridge",
    primaryRoleKey: "admin",
    seedScenario: "Platform policy and no-advice baseline configuration.",
    refs: [userRef("admin", "Ava Naidoo"), userRef("security", "Sam Jacobs"), ...platformPolicyRefs(), ...workflowRefs("northbridge")],
    formInputs: {
      confirmationPhrase: "CONFIRM",
      policyNote: "Advisor approval alone does not release advice to the client.",
    },
    clickPath: ["Save", "View audit", "Review", "Save"],
    expectedMutations: ["policy.updated", "security.updated", "audit.created"],
  }),
];

export function getJourneyFixture(journeyId: string) {
  return journeyFixtures.find((fixture) => fixture.journeyId.toUpperCase() === journeyId.toUpperCase());
}

export function getJourneyFixtureById(fixtureId: string) {
  return journeyFixtures.find((fixture) => fixture.fixtureId === fixtureId);
}
