export type P44Phase1TicketId =
  | "P44-1-T01"
  | "P44-1-T02"
  | "P44-1-T03"
  | "P44-1-T04"
  | "P44-1-T05"
  | "P44-1-T06"
  | "P44-1-T07"
  | "P44-1-T08"
  | "P44-1-T09"
  | "P44-1-T10"
  | "P44-1-T11"
  | "P44-1-T12";

export type P44Phase1TicketCertification = {
  acceptance: {
    negative: string;
    positive: string;
  };
  coveredProcesses: readonly string[];
  description: string;
  id: P44Phase1TicketId;
  proofFiles: readonly string[];
  status: "IMPLEMENTED_WITH_DIRECT_PROOF" | "IMPLEMENTED_WITH_BOUNDARY_PROOF";
};

export const p44Phase1TicketOrder: readonly P44Phase1TicketId[] = [
  "P44-1-T01",
  "P44-1-T02",
  "P44-1-T03",
  "P44-1-T04",
  "P44-1-T05",
  "P44-1-T06",
  "P44-1-T07",
  "P44-1-T08",
  "P44-1-T09",
  "P44-1-T10",
  "P44-1-T11",
  "P44-1-T12",
] as const;

export const p44Phase1TicketCertifications: readonly P44Phase1TicketCertification[] = [
  {
    acceptance: {
      negative: "Unknown or unmapped actors receive the current-user 401 contract and no regulated payload.",
      positive: "DB-user JWT current-user resolution exposes actor, active memberships, primary tenant/role and object-scope shape.",
    },
    coveredProcesses: ["B-001"],
    description: "Current-user resolver contract and implementation gap closure.",
    id: "P44-1-T01",
    proofFiles: ["lib/auth/current-user.ts", "app/api/current-user/route.ts", "tests/auth-spine.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "Route shell access cannot unlock action authority or payload visibility.",
      positive: "MVP route boundaries evaluate shell, action and payload decisions independently.",
    },
    coveredProcesses: ["B-001"],
    description: "Current-user route guard coverage across MVP and support routes.",
    id: "P44-1-T02",
    proofFiles: ["lib/permission-engine.ts", "tests/providerless-scope.spec.ts", "tests/permission-engine.spec.ts"],
    status: "IMPLEMENTED_WITH_BOUNDARY_PROOF",
  },
  {
    acceptance: {
      negative: "Missing consent and replayed invitation tokens are blocked and audited.",
      positive: "Accepted invitations persist ACTIVE user state, active role assignment, consent and auth audit.",
    },
    coveredProcesses: ["B-002"],
    description: "Invitation acceptance lifecycle completion.",
    id: "P44-1-T03",
    proofFiles: ["lib/demo/demo-auth-provider-service.ts", "app/api/auth/dummy/route.ts", "tests/dummy-auth-provider.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "Incomplete activation does not create privileged access or state advancement.",
      positive: "Identity activation persists user status, MFA readiness and consent/profile-relevant activation state.",
    },
    coveredProcesses: ["B-003"],
    description: "Identity and profile activation lifecycle completion.",
    id: "P44-1-T04",
    proofFiles: ["lib/demo/demo-auth-provider-service.ts", "app/api/profile/route.ts", "tests/dummy-auth-provider.spec.ts"],
    status: "IMPLEMENTED_WITH_BOUNDARY_PROOF",
  },
  {
    acceptance: {
      negative: "Cross-tenant users cannot read, mutate, export or infer object payload.",
      positive: "Tenant membership gates object access and downstream workflow actions.",
    },
    coveredProcesses: ["B-004"],
    description: "Tenant membership assignment and object-scope enforcement.",
    id: "P44-1-T05",
    proofFiles: ["lib/control-layer/scope-resolver.ts", "lib/permission-engine.ts", "tests/providerless-scope.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "Wrong tenant or wrong object returns denied or hidden and requires audit where critical.",
      positive: "Positive tenant access and negative cross-tenant denial are covered.",
    },
    coveredProcesses: ["B-004"],
    description: "Tenant and object-scope negative test matrix.",
    id: "P44-1-T06",
    proofFiles: ["tests/providerless-scope.spec.ts", "tests/control-layer-actor-scope.spec.ts", "tests/permission-engine.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "Role assignment cannot grant release, export or client-payload authority by itself.",
      positive: "Role assignment persists actor, tenant, role, status, validity and audit.",
    },
    coveredProcesses: ["B-005"],
    description: "Role assignment lifecycle completion.",
    id: "P44-1-T07",
    proofFiles: ["lib/demo/demo-auth-provider-service.ts", "components/admin-tenant-setup-screen.tsx", "tests/dummy-auth-provider.spec.ts", "tests/role-drawer-confirmation-lifecycle.spec.ts"],
    status: "IMPLEMENTED_WITH_BOUNDARY_PROOF",
  },
  {
    acceptance: {
      negative: "Route access without matching action or payload condition is denied or hidden.",
      positive: "Role permission effects and conditions are evaluated for actions and payload decisions.",
    },
    coveredProcesses: ["B-005"],
    description: "Role-permission effect and condition enforcement.",
    id: "P44-1-T08",
    proofFiles: ["lib/permission-engine.ts", "lib/control-layer/permission-decision.ts", "tests/permission-engine.spec.ts", "tests/control-layer-actor-scope.spec.ts"],
    status: "IMPLEMENTED_WITH_BOUNDARY_PROOF",
  },
  {
    acceptance: {
      negative: "Missing or invalid confirmation blocks mutation.",
      positive: "Sensitive mutation requires confirmation phrase, pending state, success or failure feedback and audit.",
    },
    coveredProcesses: ["B-009"],
    description: "Second confirmation interaction lifecycle.",
    id: "P44-1-T09",
    proofFiles: ["lib/typed-workflow-command-bus.ts", "tests/confirmation-lifecycle.spec.ts", "tests/role-drawer-confirmation-lifecycle.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "Invalid confirmation cannot be replayed into silent acceptance.",
      positive: "Confirmation audit and invalid-attempt proof are covered by lifecycle and API tests.",
    },
    coveredProcesses: ["B-009"],
    description: "Second confirmation audit and expiry proof.",
    id: "P44-1-T10",
    proofFiles: ["tests/recommendation-review-workflow-api.spec.ts", "tests/confirmation-lifecycle.spec.ts", "tests/role-drawer-confirmation-lifecycle.spec.ts"],
    status: "IMPLEMENTED_WITH_BOUNDARY_PROOF",
  },
  {
    acceptance: {
      negative: "An actor may access a page shell while hidden payload remains unavailable.",
      positive: "Route access, action permission, object scope and payload visibility are separately asserted.",
    },
    coveredProcesses: ["B-001", "B-004", "B-005"],
    description: "Payload visibility separation smoke tests.",
    id: "P44-1-T11",
    proofFiles: ["tests/providerless-scope.spec.ts", "tests/client-visibility-projection.spec.ts", "tests/av27-phase6-payload-sweep.spec.ts"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
  {
    acceptance: {
      negative: "No downstream task may bypass actor, tenant, object-scope or second-confirmation foundations.",
      positive: "B-domain safety prerequisites have named proof files or explicit boundary proof.",
    },
    coveredProcesses: ["B-001", "B-002", "B-003", "B-004", "B-005", "B-009"],
    description: "Safety foundation exit certification.",
    id: "P44-1-T12",
    proofFiles: ["lib/p44-phase1-certification.ts", "tests/p44-phase1-certification.spec.ts", "docs/00-current/p44-phase1/PHASE1_TICKET_EXTRACTION_AND_EXECUTION_REPORT.md"],
    status: "IMPLEMENTED_WITH_DIRECT_PROOF",
  },
] as const;

export function buildP44Phase1CertificationSummary() {
  const ticketIds = p44Phase1TicketCertifications.map((ticket) => ticket.id);
  const duplicateTicketIds = ticketIds.filter((ticketId, index) => ticketIds.indexOf(ticketId) !== index);
  const missingTicketIds = p44Phase1TicketOrder.filter((ticketId) => !ticketIds.includes(ticketId));
  const boundaryProofTickets = p44Phase1TicketCertifications
    .filter((ticket) => ticket.status === "IMPLEMENTED_WITH_BOUNDARY_PROOF")
    .map((ticket) => ticket.id);

  return {
    boundaryProofTickets,
    duplicateTicketIds,
    implementedTicketCount: p44Phase1TicketCertifications.length,
    missingTicketIds,
    ordered: JSON.stringify(ticketIds) === JSON.stringify(p44Phase1TicketOrder),
    status:
      missingTicketIds.length === 0 && duplicateTicketIds.length === 0
        ? "PASS"
        : "FAIL",
    ticketIds,
  } as const;
}
