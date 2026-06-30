export const evidenceLifecycleContractId = "domain_08_evidence_document_sufficiency_lifecycle" as const;

export const evidenceLifecycleProcessIds = [
  "BP-023",
  "BP-024",
  "BP-025",
  "BP-026",
  "BP-027",
  "BP-028",
  "BP-029",
  "BP-030",
  "BP-031",
  "BP-032",
  "BP-033",
] as const;

export type EvidenceLifecycleProcessId = typeof evidenceLifecycleProcessIds[number];

export type EvidenceLifecycleStepSuffix =
  | "S01"
  | "S02"
  | "S03"
  | "S04"
  | "S05"
  | "S06"
  | "S07";

export type EvidenceLifecycleStepId = `${EvidenceLifecycleProcessId}-${EvidenceLifecycleStepSuffix}`;

export type EvidenceLifecycleState =
  | "NEEDS_EVIDENCE"
  | "UPLOAD_READY"
  | "UPLOAD_RECEIVED"
  | "EXTRACTION_PENDING"
  | "REVIEW_PENDING"
  | "LINKED_NOT_SUFFICIENT"
  | "INSUFFICIENT_REREQUESTED"
  | "SUFFICIENT_FOR_SCOPED_GATE"
  | "CLIENT_SAFE_SUMMARY_AVAILABLE"
  | "VAULT_ARCHIVED_OR_SUPERSEDED";

export type EvidenceLifecycleRouteScreenId = "S027" | "S028" | "S029" | "S030" | "S046" | "S047";

export type EvidenceLifecycleRuntimeAttributes = Record<`data-${string}`, string>;

export type EvidenceLifecycleProcessContract = {
  processId: EvidenceLifecycleProcessId;
  name: string;
  ownerSurface: EvidenceLifecycleRouteScreenId;
  primaryState: EvidenceLifecycleState;
  forbiddenOverclaim: string;
};

export type EvidenceLifecycleStepContract = {
  processId: EvidenceLifecycleProcessId;
  stepId: EvidenceLifecycleStepId;
  sequence: number;
  label: string;
  requiresAudit: boolean;
};

export type EvidenceLifecycleRouteContract = {
  screenId: EvidenceLifecycleRouteScreenId;
  route: string;
  primaryJob: string;
  nextPermittedAction: string;
  ownedProcesses: readonly EvidenceLifecycleProcessId[];
  forbiddenOverclaims: readonly string[];
};

export type EvidenceLifecycleProofBoundary = {
  auditFailureMode: "fail_closed_without_client_visibility";
  auditRequiredStepIds: readonly EvidenceLifecycleStepId[];
  clientSafePayload: "redacted_summary_only";
  forbiddenOverclaims: readonly string[];
  screenId: EvidenceLifecycleRouteScreenId;
};

export const evidenceLifecycleStates = [
  "NEEDS_EVIDENCE",
  "UPLOAD_READY",
  "UPLOAD_RECEIVED",
  "EXTRACTION_PENDING",
  "REVIEW_PENDING",
  "LINKED_NOT_SUFFICIENT",
  "INSUFFICIENT_REREQUESTED",
  "SUFFICIENT_FOR_SCOPED_GATE",
  "CLIENT_SAFE_SUMMARY_AVAILABLE",
  "VAULT_ARCHIVED_OR_SUPERSEDED",
] as const satisfies readonly EvidenceLifecycleState[];

export const evidenceLifecycleStateContracts = {
  CLIENT_SAFE_SUMMARY_AVAILABLE: {
    label: "Client-safe summary available",
    nextAction: "View released/redacted summary",
    overclaim: "Never expose raw internals, storage keys, checksums, analyst notes or compliance notes.",
  },
  EXTRACTION_PENDING: {
    label: "Extraction pending",
    nextAction: "Review fields or request clarification",
    overclaim: "Extracted fields are not reviewed evidence.",
  },
  INSUFFICIENT_REREQUESTED: {
    label: "Insufficient - re-request opened",
    nextAction: "Upload replacement or additional evidence",
    overclaim: "Re-request is not release, export approval or client rejection.",
  },
  LINKED_NOT_SUFFICIENT: {
    label: "Linked, not sufficient",
    nextAction: "Resolve missing sufficiency gates",
    overclaim: "Link is not sufficient evidence.",
  },
  NEEDS_EVIDENCE: {
    label: "Evidence needed",
    nextAction: "Request or upload scoped evidence",
    overclaim: "Request state does not imply upload, review, sufficiency, release or visibility.",
  },
  REVIEW_PENDING: {
    label: "Review pending",
    nextAction: "Run human review",
    overclaim: "Queue presence is not acceptance.",
  },
  SUFFICIENT_FOR_SCOPED_GATE: {
    label: "Sufficient for scoped gate",
    nextAction: "Continue downstream gate",
    overclaim: "Scoped sufficiency is not export approval, compliance release or client acceptance.",
  },
  UPLOAD_READY: {
    label: "Upload ready",
    nextAction: "Submit upload",
    overclaim: "Selected file does not prove evidence or audit rows exist.",
  },
  UPLOAD_RECEIVED: {
    label: "Upload received",
    nextAction: "Open review queue",
    overclaim: "Upload is not evidence sufficiency.",
  },
  VAULT_ARCHIVED_OR_SUPERSEDED: {
    label: "Archived or superseded",
    nextAction: "Inspect lineage",
    overclaim: "Archive/supersede is not deletion proof or client notification.",
  },
} as const satisfies Record<EvidenceLifecycleState, { label: string; nextAction: string; overclaim: string }>;

export const evidenceLifecycleProcessContracts = [
  {
    forbiddenOverclaim: "Evidence request cannot mark evidence sufficient, released, exported or client-visible.",
    name: "Evidence request",
    ownerSurface: "S027",
    primaryState: "NEEDS_EVIDENCE",
    processId: "BP-023",
  },
  {
    forbiddenOverclaim: "Upload cannot imply evidence sufficiency.",
    name: "Client document upload",
    ownerSurface: "S028",
    primaryState: "UPLOAD_RECEIVED",
    processId: "BP-024",
  },
  {
    forbiddenOverclaim: "Metadata validation cannot imply review or sufficiency.",
    name: "Document metadata validation",
    ownerSurface: "S028",
    primaryState: "EXTRACTION_PENDING",
    processId: "BP-025",
  },
  {
    forbiddenOverclaim: "Provenance cannot expose raw client-internal payload on client surfaces.",
    name: "Document versioning and provenance",
    ownerSurface: "S028",
    primaryState: "UPLOAD_RECEIVED",
    processId: "BP-026",
  },
  {
    forbiddenOverclaim: "Extraction review cannot imply compliance release.",
    name: "Extraction review",
    ownerSurface: "S029",
    primaryState: "REVIEW_PENDING",
    processId: "BP-027",
  },
  {
    forbiddenOverclaim: "Escalation cannot silently become acceptance.",
    name: "Verification pending escalation",
    ownerSurface: "S030",
    primaryState: "REVIEW_PENDING",
    processId: "BP-028",
  },
  {
    forbiddenOverclaim: "Linked evidence cannot imply sufficiency.",
    name: "Evidence linking to object",
    ownerSurface: "S029",
    primaryState: "LINKED_NOT_SUFFICIENT",
    processId: "BP-029",
  },
  {
    forbiddenOverclaim: "Scoped sufficiency cannot imply export approval, release or client acceptance.",
    name: "Evidence sufficiency decision",
    ownerSurface: "S046",
    primaryState: "SUFFICIENT_FOR_SCOPED_GATE",
    processId: "BP-030",
  },
  {
    forbiddenOverclaim: "Client-safe summary cannot expose raw internal evidence payload.",
    name: "Client-safe evidence summary",
    ownerSurface: "S046",
    primaryState: "CLIENT_SAFE_SUMMARY_AVAILABLE",
    processId: "BP-031",
  },
  {
    forbiddenOverclaim: "Vault browsing cannot become download, share, export or release approval.",
    name: "Evidence vault management",
    ownerSurface: "S046",
    primaryState: "LINKED_NOT_SUFFICIENT",
    processId: "BP-032",
  },
  {
    forbiddenOverclaim: "Re-request cannot imply client rejection, release or export approval.",
    name: "Evidence rejection and re-request",
    ownerSurface: "S027",
    primaryState: "INSUFFICIENT_REREQUESTED",
    processId: "BP-033",
  },
] as const satisfies readonly EvidenceLifecycleProcessContract[];

const stepDefinitions = [
  { label: "Request", requiresAudit: false, suffix: "S01" },
  { label: "Upload", requiresAudit: false, suffix: "S02" },
  { label: "Validate", requiresAudit: true, suffix: "S03" },
  { label: "Review", requiresAudit: true, suffix: "S04" },
  { label: "Link", requiresAudit: false, suffix: "S05" },
  { label: "Decide sufficiency", requiresAudit: true, suffix: "S06" },
  { label: "Project safely", requiresAudit: false, suffix: "S07" },
] as const satisfies readonly { label: string; requiresAudit: boolean; suffix: EvidenceLifecycleStepSuffix }[];

export const evidenceLifecycleStepContracts = evidenceLifecycleProcessContracts.flatMap((process) =>
  stepDefinitions.map((step, index) => ({
    label: step.label,
    processId: process.processId,
    requiresAudit: step.requiresAudit,
    sequence: index + 1,
    stepId: `${process.processId}-${step.suffix}` as EvidenceLifecycleStepId,
  })),
) satisfies EvidenceLifecycleStepContract[];

export const evidenceLifecycleRouteContracts = [
  {
    forbiddenOverclaims: ["upload_as_sufficiency", "review_as_release", "client_visibility_without_release"],
    nextPermittedAction: "Upload scoped evidence or open the extraction review queue.",
    ownedProcesses: ["BP-023", "BP-024", "BP-025", "BP-026", "BP-027", "BP-028", "BP-033"],
    primaryJob: "Evidence lifecycle area entry with current workload, blockers and next safe action.",
    route: "/documents",
    screenId: "S027",
  },
  {
    forbiddenOverclaims: ["selected_file_as_evidence", "upload_as_sufficiency"],
    nextPermittedAction: "Submit upload for internal review.",
    ownedProcesses: ["BP-024", "BP-025", "BP-026"],
    primaryJob: "Upload intake only.",
    route: "/documents/upload",
    screenId: "S028",
  },
  {
    forbiddenOverclaims: ["review_as_sufficiency", "link_as_sufficiency"],
    nextPermittedAction: "Review extraction or run authorized scoped sufficiency.",
    ownedProcesses: ["BP-027", "BP-028", "BP-029", "BP-030", "BP-033"],
    primaryJob: "Operational extraction review workbench.",
    route: "/documents/review-queue",
    screenId: "S029",
  },
  {
    forbiddenOverclaims: ["pending_as_accepted", "escalation_as_release"],
    nextPermittedAction: "Resolve verification blocker or request clarification.",
    ownedProcesses: ["BP-025", "BP-026", "BP-027", "BP-028", "BP-029", "BP-033"],
    primaryJob: "One document verification detail.",
    route: "/documents/:id/review",
    screenId: "S030",
  },
  {
    forbiddenOverclaims: ["vault_as_release", "sufficiency_as_export_approval"],
    nextPermittedAction: "Inspect lineage and sufficiency state.",
    ownedProcesses: ["BP-029", "BP-030", "BP-031", "BP-032"],
    primaryJob: "Evidence vault lineage and sufficiency management.",
    route: "/evidence",
    screenId: "S046",
  },
  {
    forbiddenOverclaims: ["detail_as_client_release", "raw_payload_as_client_safe"],
    nextPermittedAction: "Review one record's linkage, proof and client-safe boundary.",
    ownedProcesses: ["BP-029", "BP-030", "BP-031", "BP-032", "BP-033"],
    primaryJob: "One evidence record detail.",
    route: "/evidence/:id/review",
    screenId: "S047",
  },
] as const satisfies readonly EvidenceLifecycleRouteContract[];

export function evidenceLifecycleRouteContractForScreen(screenId: EvidenceLifecycleRouteScreenId) {
  return evidenceLifecycleRouteContracts.find((contract) => contract.screenId === screenId) ?? evidenceLifecycleRouteContracts[0];
}

export function evidenceLifecycleRouteAttributesForScreen(screenId: EvidenceLifecycleRouteScreenId): EvidenceLifecycleRuntimeAttributes {
  const contract = evidenceLifecycleRouteContractForScreen(screenId);

  return {
    "data-ux-domain08-contract": evidenceLifecycleContractId,
    "data-ux-domain08-forbidden-overclaims": contract.forbiddenOverclaims.join(" "),
    "data-ux-domain08-owned-processes": contract.ownedProcesses.join(" "),
    "data-ux-domain08-primary-job": contract.primaryJob,
    "data-ux-domain08-route": contract.route,
    "data-ux-domain08-screen": contract.screenId,
    "data-ux-no-overclaim": "true",
  };
}

export function evidenceLifecycleProofBoundaryForScreen(screenId: EvidenceLifecycleRouteScreenId): EvidenceLifecycleProofBoundary {
  const contract = evidenceLifecycleRouteContractForScreen(screenId);
  const ownedProcessIds: readonly string[] = contract.ownedProcesses;
  const auditRequiredStepIds = evidenceLifecycleStepContracts
    .filter((step) => ownedProcessIds.includes(step.processId) && step.requiresAudit)
    .map((step) => step.stepId);

  return {
    auditFailureMode: "fail_closed_without_client_visibility",
    auditRequiredStepIds,
    clientSafePayload: "redacted_summary_only",
    forbiddenOverclaims: contract.forbiddenOverclaims,
    screenId,
  };
}
