import type { AuditResult, ExportStatus } from "@prisma/client";

import { exportWorkflowCommandSpinePath } from "@/lib/export-workflow-command-service";

export const p44Phase8TicketOrder = [
  "P44-8-T01-EXEC",
  "P44-8-T02-EXEC",
  "P44-8-T03-EXEC",
  "P44-8-T04-EXEC",
  "P44-8-T05-EXEC",
  "P44-8-T06-EXEC",
  "P44-8-T07-EXEC",
  "P44-8-T08-EXEC",
  "P44-8-T09-EXEC",
  "P44-8-T10-EXEC",
  "P44-8-T11-EXEC",
  "P44-8-T12-EXEC",
  "P44-8-T13-EXEC",
  "P44-8-T14-EXEC",
  "P44-8-T15-EXEC",
  "P44-8-T16-EXEC",
] as const;

export type P44Phase8TicketId = (typeof p44Phase8TicketOrder)[number];

export type P44Phase8ReadinessInput = {
  analysisComplete: boolean;
  predecessorPhase7Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export type P44Phase8TicketEvidence = {
  commandSpine: typeof exportWorkflowCommandSpinePath;
  ticketId: P44Phase8TicketId;
  processId: "J-001" | "J-002" | "J-003" | "J-004" | "J-005" | "J-006" | "J-007" | "J-008" | "J-domain";
  positiveProof: string;
  negativeProof: string;
  targetFiles: string[];
};

const p44Phase8TicketEvidenceRows: readonly Omit<P44Phase8TicketEvidence, "commandSpine">[] = [
  {
    ticketId: "P44-8-T01-EXEC",
    processId: "J-001",
    positiveProof: "Export request can be initiated with actor, tenant, object and scope context.",
    negativeProof: "Default request path cannot include forbidden internal payload.",
    targetFiles: ["lib/export-workflow-command-service.ts", "app/api/export-workflow/route.ts"],
  },
  {
    ticketId: "P44-8-T02-EXEC",
    processId: "J-001",
    positiveProof: "Required scope, actor and object fields are validated.",
    negativeProof: "Invalid requests fail closed without package or state creation.",
    targetFiles: ["lib/export-workflow-command-service.ts", "app/api/export-workflow/route.ts"],
  },
  {
    ticketId: "P44-8-T03-EXEC",
    processId: "J-002",
    positiveProof: "Selected export scope persists and reloads through the read model.",
    negativeProof: "Actor cannot select outside permission, tenant or payload visibility scope.",
    targetFiles: ["lib/export-workflow-command-service.ts", "lib/export-workflow-readmodel-service.ts"],
  },
  {
    ticketId: "P44-8-T04-EXEC",
    processId: "J-002",
    positiveProof: "Wrong-object, wrong-tenant and overbroad scope are denied.",
    negativeProof: "Scope cannot exceed payload visibility.",
    targetFiles: ["lib/export-service.ts", "tests/p44-phase8-certification.spec.ts"],
  },
  {
    ticketId: "P44-8-T05-EXEC",
    processId: "J-003",
    positiveProof: "Redaction profile is selected, applied and recorded before preview or approval.",
    negativeProof: "Missing redaction profile blocks client-safe export.",
    targetFiles: ["lib/export-workflow-command-service.ts", "prisma/schema.prisma"],
  },
  {
    ticketId: "P44-8-T06-EXEC",
    processId: "J-003",
    positiveProof: "AI draft, internal rationale, compliance notes, unreleased evidence and hidden fields are excluded.",
    negativeProof: "Forbidden payload cannot appear in preview, package or download.",
    targetFiles: ["lib/export-service.ts", "lib/av27-phase6-payload-contract.ts"],
  },
  {
    ticketId: "P44-8-T07-EXEC",
    processId: "J-004",
    positiveProof: "Preview reflects scoped and redacted content and marks not-approved state.",
    negativeProof: "Preview does not approve, generate, download or share package.",
    targetFiles: ["lib/export-workflow-command-service.ts", "components/communication-export-ops-screen.tsx"],
  },
  {
    ticketId: "P44-8-T08-EXEC",
    processId: "J-004",
    positiveProof: "Preview can be generated without marking approval/download/share.",
    negativeProof: "Preview-only state cannot be downloaded or shared as approved.",
    targetFiles: ["lib/domain-types.ts", "tests/p44-phase8-certification.spec.ts"],
  },
  {
    ticketId: "P44-8-T09-EXEC",
    processId: "J-005",
    positiveProof: "Approval persists actor, time, scope/redaction profile and audit.",
    negativeProof: "Approval is denied if predecessor scope/redaction/preview gates are missing.",
    targetFiles: ["lib/export-workflow-command-service.ts", "prisma/schema.prisma"],
  },
  {
    ticketId: "P44-8-T10-EXEC",
    processId: "J-005",
    positiveProof: "Missing redaction, overbroad scope and unreleased content block approval.",
    negativeProof: "Admin cannot force approval by role alone.",
    targetFiles: ["lib/export-workflow-command-service.ts", "tests/p44-phase8-certification.spec.ts"],
  },
  {
    ticketId: "P44-8-T11-EXEC",
    processId: "J-006",
    positiveProof: "Package generation requires approved export, scope, redaction and audit correlation.",
    negativeProof: "Unapproved or failed audit state blocks generation.",
    targetFiles: ["lib/export-workflow-command-service.ts", "lib/export-package-service.ts"],
  },
  {
    ticketId: "P44-8-T12-EXEC",
    processId: "J-006",
    positiveProof: "Generated manifest excludes forbidden fields and marks redaction profile.",
    negativeProof: "Unsafe metadata or content is rejected.",
    targetFiles: ["lib/export-package-service.ts", "lib/export-service.ts"],
  },
  {
    ticketId: "P44-8-T13-EXEC",
    processId: "J-007",
    positiveProof: "Download/share is allowed only after approved/generated package and writes audit.",
    negativeProof: "Download/share success is not client acceptance.",
    targetFiles: ["lib/export-workflow-command-service.ts", "lib/export-workflow-readmodel-service.ts"],
  },
  {
    ticketId: "P44-8-T14-EXEC",
    processId: "J-008",
    positiveProof: "Request, scope, redaction, preview, approval, generation, download and share events are linked.",
    negativeProof: "Missing audit blocks or flags unsafe export action.",
    targetFiles: ["prisma/schema.prisma", "tests/p44-phase8-certification.spec.ts"],
  },
  {
    ticketId: "P44-8-T15-EXEC",
    processId: "J-domain",
    positiveProof: "UI/API/service/DB command stages are positively and negatively tested.",
    negativeProof: "No command stage can bypass predecessor export stage.",
    targetFiles: ["app/api/export-workflow/route.ts", "tests/p44-phase8-certification.spec.ts"],
  },
  {
    ticketId: "P44-8-T16-EXEC",
    processId: "J-domain",
    positiveProof: "J-001..J-008 move from backend-strong/UI-partial to selected L3/L4 closure.",
    negativeProof: "No export claim depends only on backend service tests.",
    targetFiles: ["lib/p44-phase8-export-command-closure.ts", "docs/00-current/p44-phase8/PHASE8_TICKET_EXTRACTION_AND_EXECUTION_REPORT.md"],
  },
];

export const p44Phase8TicketEvidence: readonly P44Phase8TicketEvidence[] = p44Phase8TicketEvidenceRows.map((evidence) => ({
  ...evidence,
  commandSpine: exportWorkflowCommandSpinePath,
}));

export const p44Phase8ExpectedAuditEvents = [
  "export.workflow.set_scope",
  "export.workflow.validate_redaction",
  "export.workflow.preview",
  "export.workflow.approve",
  "export.workflow.generate",
  "export.workflow.download",
  "export.workflow.share",
] as const;

export function createP44Phase8ReadinessChecklist(input: P44Phase8ReadinessInput) {
  const missing: string[] = [];

  if (!input.predecessorPhase7Exit) missing.push("p44_phase7_exit");
  if (!input.analysisComplete) missing.push("ph8_analysis");
  if (!input.specificationComplete) missing.push("ph8_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: p44Phase8TicketOrder,
  };
}

export function inspectP44Phase8ForbiddenPayload(input: {
  forbiddenFields: string[];
  manifestForbiddenPayloads: string[];
}) {
  const clean = input.forbiddenFields.length === 0 && input.manifestForbiddenPayloads.length === 0;

  return {
    clean,
    negativeProof: clean ? "no_forbidden_payload_in_preview_package_download" : "forbidden_payload_detected",
    ticketIds: ["P44-8-T06-EXEC", "P44-8-T12-EXEC"] as const,
  };
}

export function inspectP44Phase8StageBoundary(input: {
  approvedByUserId: string | null;
  generatedFileDocumentId: string | null;
  previewStatus: ExportStatus;
}) {
  const previewOnly =
    input.previewStatus === "APPROVAL_REQUIRED" && !input.approvedByUserId && !input.generatedFileDocumentId;

  return {
    previewOnly,
    ticketIds: ["P44-8-T07-EXEC", "P44-8-T08-EXEC"] as const,
  };
}

export function inspectP44Phase8AuditChain(events: Array<{ eventType: string; result: AuditResult }>) {
  const eventTypes = events.map((event) => event.eventType);
  const linked = p44Phase8ExpectedAuditEvents.every((eventType) => eventTypes.includes(eventType));
  const allSuccessful = events
    .filter((event) => p44Phase8ExpectedAuditEvents.includes(event.eventType as never))
    .every((event) => event.result === "SUCCESS");

  return {
    allSuccessful,
    linked,
    missingEvents: p44Phase8ExpectedAuditEvents.filter((eventType) => !eventTypes.includes(eventType)),
    ticketId: "P44-8-T14-EXEC" as const,
  };
}

export function certifyP44Phase8ExportExit(input: {
  auditChainLinked: boolean;
  completedTicketIds: P44Phase8TicketId[];
  commandBypassDenied: boolean;
  forbiddenPayloadClean: boolean;
  noBackendOnlyClaim: boolean;
  positiveAndNegativeApiProof: boolean;
}) {
  const completed = new Set(input.completedTicketIds);
  const missingTickets = p44Phase8TicketOrder.filter((ticketId) => !completed.has(ticketId));
  const missingProof: string[] = [];

  if (missingTickets.length > 0) missingProof.push("ticket_completion");
  if (!input.auditChainLinked) missingProof.push("audit_chain");
  if (!input.commandBypassDenied) missingProof.push("command_stage_bypass_denial");
  if (!input.forbiddenPayloadClean) missingProof.push("forbidden_payload_cleanliness");
  if (!input.noBackendOnlyClaim) missingProof.push("no_backend_only_claim");
  if (!input.positiveAndNegativeApiProof) missingProof.push("positive_negative_api_proof");

  return {
    certification: missingProof.length === 0 ? "PH8_EXPORT_EXIT_READY" : "PH8_EXPORT_EXIT_BLOCKED",
    missingProof,
    missingTickets,
    ticketId: "P44-8-T16-EXEC" as const,
  };
}
