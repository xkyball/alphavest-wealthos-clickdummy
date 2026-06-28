import { screenRoutes } from "@/lib/route-registry";

export type ProcessFirstUxPageFamily =
  | "action_board"
  | "advisor_review"
  | "compliance_decision_room"
  | "evidence_vault"
  | "governance_access"
  | "export_step";

export type ProcessFirstUxRouteContract = {
  acceptanceIds: readonly string[];
  businessProcessIds: readonly string[];
  domainIds: readonly string[];
  forbiddenOverclaims: readonly string[];
  gateIds: readonly string[];
  nextPermittedAction: string;
  pageFamily: ProcessFirstUxPageFamily;
  pageId: string;
  primaryProcessJob: string;
  route: string;
};

const routeForPageId = (pageId: string) => {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);

  if (!route) {
    throw new Error(`Process-first UX contract references unknown route pageId ${pageId}`);
  }

  return route.route;
};

export const processFirstUxRouteContracts = [
  {
    acceptanceIds: ["ACC-002"],
    businessProcessIds: ["BP-020", "BP-021", "BP-022"],
    domainIds: ["DOMAIN-D", "DOMAIN-I"],
    forbiddenOverclaims: ["evidence_sufficiency", "advisor_approval", "compliance_release", "client_visibility"],
    gateIds: ["P0_ACTION_BOARD_GATE"],
    nextPermittedAction: "Select or triage an action item; keep evidence sufficiency, approval, release and visibility on later gates.",
    pageFamily: "action_board",
    pageId: "032",
    primaryProcessJob: "Operational action board triage without implying downstream sufficiency or release.",
    route: routeForPageId("032"),
  },
  {
    acceptanceIds: ["ACC-004"],
    businessProcessIds: ["BP-041", "BP-042", "BP-043"],
    domainIds: ["DOMAIN-F", "DOMAIN-I"],
    forbiddenOverclaims: ["compliance_release", "client_visibility", "advice_release"],
    gateIds: ["P0_ADVISOR_APPROVAL_NOT_RELEASE_GATE"],
    nextPermittedAction: "Record advisor review outcome; route released candidates to compliance instead of client visibility.",
    pageFamily: "advisor_review",
    pageId: "037",
    primaryProcessJob: "Advisor decision detail that records human review without releasing advice.",
    route: routeForPageId("037"),
  },
  {
    acceptanceIds: ["ACC-005", "ACC-006", "ACC-007"],
    businessProcessIds: ["BP-051", "BP-052", "BP-053", "BP-061", "BP-062"],
    domainIds: ["DOMAIN-G", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["advisor_approval_as_release", "client_visibility_without_compliance_release", "missing_audit_event"],
    gateIds: ["P0_COMPLIANCE_RELEASE_GATE", "P0_CLIENT_VISIBILITY_GATE", "P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Resolve release preconditions and persist audit evidence before any client-visible state changes.",
    pageFamily: "compliance_decision_room",
    pageId: "039",
    primaryProcessJob: "Compliance decision room for block/release decisions with fail-closed client visibility.",
    route: routeForPageId("039"),
  },
  {
    acceptanceIds: ["ACC-002", "ACC-007"],
    businessProcessIds: ["BP-030", "BP-031", "BP-032"],
    domainIds: ["DOMAIN-C", "DOMAIN-I"],
    forbiddenOverclaims: ["upload_as_sufficiency", "unscoped_evidence", "missing_lineage"],
    gateIds: ["P0_EVIDENCE_SUFFICIENCY_GATE", "P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Review evidence linkage and sufficiency state before downstream advisor or compliance gates.",
    pageFamily: "evidence_vault",
    pageId: "046",
    primaryProcessJob: "Evidence vault review with lineage and sufficiency separated from upload existence.",
    route: routeForPageId("046"),
  },
  {
    acceptanceIds: ["ACC-002", "ACC-007"],
    businessProcessIds: ["BP-030", "BP-031", "BP-032"],
    domainIds: ["DOMAIN-C", "DOMAIN-I"],
    forbiddenOverclaims: ["upload_as_sufficiency", "unreviewed_evidence_as_approved", "missing_lineage"],
    gateIds: ["P0_EVIDENCE_SUFFICIENCY_GATE", "P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Review one evidence record and preserve its scope, lineage and sufficiency state.",
    pageFamily: "evidence_vault",
    pageId: "047",
    primaryProcessJob: "Evidence record detail that separates document presence from accepted evidence.",
    route: routeForPageId("047"),
  },
  {
    acceptanceIds: ["ACC-007"],
    businessProcessIds: ["BP-071", "BP-072", "BP-073"],
    domainIds: ["DOMAIN-L", "DOMAIN-I"],
    forbiddenOverclaims: ["role_change_without_approval", "permission_change_without_audit", "tenant_boundary_bypass"],
    gateIds: ["P0_GOVERNANCE_CHANGE_GATE", "P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Inspect governance users and route permission changes through approval plus audit.",
    pageFamily: "governance_access",
    pageId: "048",
    primaryProcessJob: "Governance user administration without silent access changes.",
    route: routeForPageId("048"),
  },
  {
    acceptanceIds: ["ACC-007"],
    businessProcessIds: ["BP-071", "BP-072", "BP-073"],
    domainIds: ["DOMAIN-L", "DOMAIN-I"],
    forbiddenOverclaims: ["access_request_as_granted", "permission_change_without_audit", "tenant_boundary_bypass"],
    gateIds: ["P0_GOVERNANCE_CHANGE_GATE", "P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Review the access request, then approve or reject through the governed command path.",
    pageFamily: "governance_access",
    pageId: "050",
    primaryProcessJob: "Access request decision surface with approval and audit as separate process gates.",
    route: routeForPageId("050"),
  },
  {
    acceptanceIds: ["ACC-007"],
    businessProcessIds: ["BP-073"],
    domainIds: ["DOMAIN-I", "DOMAIN-L"],
    forbiddenOverclaims: ["audit_history_as_approval", "missing_actor_context", "missing_before_after_state"],
    gateIds: ["P0_AUDIT_PERSISTENCE_GATE"],
    nextPermittedAction: "Inspect immutable audit history and use governed routes for any state-changing access action.",
    pageFamily: "governance_access",
    pageId: "051",
    primaryProcessJob: "Access audit history as proof, not as a state-changing approval surface.",
    route: routeForPageId("051"),
  },
  {
    acceptanceIds: ["ACC-008"],
    businessProcessIds: ["BP-082", "BP-087"],
    domainIds: ["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["export_created_as_redacted", "export_created_as_approved", "download_without_approval"],
    gateIds: ["P0_EXPORT_REDACTION_GATE"],
    nextPermittedAction: "Create an export request and move to explicit scope selection before redaction or approval.",
    pageFamily: "export_step",
    pageId: "054",
    primaryProcessJob: "Create export request without implying redaction, approval, generation or delivery.",
    route: routeForPageId("054"),
  },
  {
    acceptanceIds: ["ACC-008"],
    businessProcessIds: ["BP-082", "BP-087"],
    domainIds: ["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["scope_as_redaction", "scope_as_approval", "download_without_approval"],
    gateIds: ["P0_EXPORT_REDACTION_GATE"],
    nextPermittedAction: "Confirm permitted export scope, then move to mandatory redaction review.",
    pageFamily: "export_step",
    pageId: "055",
    primaryProcessJob: "Select export scope separately from redaction, approval, generation and delivery.",
    route: routeForPageId("055"),
  },
  {
    acceptanceIds: ["ACC-008"],
    businessProcessIds: ["BP-082", "BP-087"],
    domainIds: ["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["redaction_as_approval", "preview_as_delivery", "download_without_approval", "internal_payload_in_client_export"],
    gateIds: ["P0_EXPORT_REDACTION_GATE"],
    nextPermittedAction: "Resolve mandatory redactions, then inspect preview before any approval or delivery action.",
    pageFamily: "export_step",
    pageId: "056",
    primaryProcessJob: "Remove forbidden internal payloads before preview, approval, generation or delivery can continue.",
    route: routeForPageId("056"),
  },
  {
    acceptanceIds: ["ACC-008"],
    businessProcessIds: ["BP-082", "BP-087"],
    domainIds: ["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["approval_as_download", "approval_as_share", "approval_as_client_acceptance", "advice_release_from_export_approval"],
    gateIds: ["P0_EXPORT_REDACTION_GATE"],
    nextPermittedAction: "Record scoped approval through the modal, then keep package generation, download and share on later gates.",
    pageFamily: "export_step",
    pageId: "057",
    primaryProcessJob: "Preview and approval decision surface that cannot generate, download, share or imply client acceptance.",
    route: routeForPageId("057"),
  },
  {
    acceptanceIds: ["ACC-008"],
    businessProcessIds: ["BP-082", "BP-087"],
    domainIds: ["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"],
    forbiddenOverclaims: ["download_as_share", "download_as_client_acceptance", "internal_payload_in_client_export"],
    gateIds: ["P0_EXPORT_REDACTION_GATE"],
    nextPermittedAction: "Generate and download only the approved, scoped, redacted package; keep external share and client response separate.",
    pageFamily: "export_step",
    pageId: "058",
    primaryProcessJob: "Controlled package generation/download after scope, redaction and approval gates pass.",
    route: routeForPageId("058"),
  },
] as const satisfies readonly ProcessFirstUxRouteContract[];

export const processFirstUxCriticalPageIds = processFirstUxRouteContracts.map((contract) => contract.pageId);

export const processFirstUxRouteContractByPageId: ReadonlyMap<string, ProcessFirstUxRouteContract> = new Map(
  processFirstUxRouteContracts.map((contract) => [contract.pageId, contract]),
);

export function processFirstUxContractForPageId(pageId: string): ProcessFirstUxRouteContract {
  const contract = processFirstUxRouteContractByPageId.get(pageId);

  if (!contract) {
    throw new Error(`Missing process-first UX contract for pageId ${pageId}`);
  }

  return contract;
}

export function processFirstUxDataAttributeValue(values: readonly string[]) {
  return values.join(" ");
}
