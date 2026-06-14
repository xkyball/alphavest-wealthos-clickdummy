import { auditEventForAction, type AuditEvent } from "./audit";
import { evidenceForEvent, type EvidenceRecord } from "./evidence";
import { evaluateAccessControl } from "./permissions";
import type { Role } from "./roles";
import { canTransition, type WorkflowName, type WorkflowState } from "./state-machines";
import { canShowClientAdviceLikeOutput } from "./visibility";

export type DemoWorkflowId =
  | "wf-trust-x-recommendation"
  | "wf-trust-deed-document"
  | "wf-beneficiary-decision"
  | "wf-external-advisor-access"
  | "wf-q2-communication";

export type DemoWorkflowInstance = {
  id: DemoWorkflowId;
  workflow: WorkflowName;
  state: WorkflowState;
  title: string;
  objectId: string;
  ownerRole: Role;
  evidenceRecordExists: boolean;
  advisorApproval: boolean;
  complianceRelease: boolean;
  permissionCheck: boolean;
  clientVisibilityState: "draft" | "blocked" | "released";
  lastEvent: string;
};

export type DemoSessionSnapshot = {
  version: "phase-7.5";
  sessionId: string;
  updatedAt: string;
  workflows: DemoWorkflowInstance[];
  evidenceRecords: EvidenceRecord[];
  auditEvents: AuditEvent[];
};

export type DemoTransitionAction =
  | "document.confirm_extraction"
  | "advisor.approve"
  | "advisor.request_call"
  | "compliance.release"
  | "compliance.block"
  | "client.submit_decision"
  | "access.confirm_sensitive_change"
  | "communication.send";

export type DemoTransitionInput = {
  action: DemoTransitionAction;
  actorRole: Role;
  choice?: "accepted" | "deferred" | "rejected";
};

export const demoSessionId = "alpha-demo-main";

function now() {
  return "2026-06-14T00:00:00.000Z";
}

export function createInitialDemoSession(): DemoSessionSnapshot {
  return {
    version: "phase-7.5",
    sessionId: demoSessionId,
    updatedAt: now(),
    workflows: [
      {
        id: "wf-trust-x-recommendation",
        workflow: "recommendation",
        state: "needs_review",
        title: "Trust X beneficiary update recommendation",
        objectId: "trust-x-beneficiary-update",
        ownerRole: "AlphaVest Analyst",
        evidenceRecordExists: true,
        advisorApproval: false,
        complianceRelease: false,
        permissionCheck: true,
        clientVisibilityState: "blocked",
        lastEvent: "recommendation.drafted"
      },
      {
        id: "wf-trust-deed-document",
        workflow: "document",
        state: "under_review",
        title: "Updated Trust X deed",
        objectId: "trust-deed-2026",
        ownerRole: "AlphaVest Analyst",
        evidenceRecordExists: true,
        advisorApproval: false,
        complianceRelease: false,
        permissionCheck: true,
        clientVisibilityState: "blocked",
        lastEvent: "document.uploaded"
      },
      {
        id: "wf-beneficiary-decision",
        workflow: "decision_record",
        state: "needs_review",
        title: "Family decision: Trust X beneficiary register",
        objectId: "decision-trust-x-beneficiary",
        ownerRole: "Principal",
        evidenceRecordExists: false,
        advisorApproval: false,
        complianceRelease: false,
        permissionCheck: true,
        clientVisibilityState: "blocked",
        lastEvent: "decision.draft"
      },
      {
        id: "wf-external-advisor-access",
        workflow: "access_request",
        state: "requested",
        title: "External advisor release-to-client access",
        objectId: "access-external-advisor-q2",
        ownerRole: "Principal",
        evidenceRecordExists: false,
        advisorApproval: false,
        complianceRelease: false,
        permissionCheck: false,
        clientVisibilityState: "blocked",
        lastEvent: "access.requested"
      },
      {
        id: "wf-q2-communication",
        workflow: "communication",
        state: "draft",
        title: "Q2 released message",
        objectId: "comm-q2-review",
        ownerRole: "Client Success",
        evidenceRecordExists: true,
        advisorApproval: false,
        complianceRelease: false,
        permissionCheck: true,
        clientVisibilityState: "blocked",
        lastEvent: "communication.drafted"
      }
    ],
    evidenceRecords: [
      evidenceForEvent("recommendation.drafted", {
        actorRole: "AlphaVest Analyst",
        objectId: "trust-x-beneficiary-update"
      }),
      evidenceForEvent("document.uploaded", {
        actorRole: "Principal",
        objectId: "trust-deed-2026"
      })
    ],
    auditEvents: [
      auditEventForAction({
        actorRole: "AlphaVest Analyst",
        action: "recommendation.drafted",
        objectType: "Recommendation Draft",
        objectId: "trust-x-beneficiary-update",
        result: "created"
      }),
      auditEventForAction({
        actorRole: "Principal",
        action: "document.uploaded",
        objectType: "Document File",
        objectId: "trust-deed-2026",
        result: "created"
      })
    ]
  };
}

function getWorkflow(snapshot: DemoSessionSnapshot, id: DemoWorkflowId) {
  const workflow = snapshot.workflows.find((item) => item.id === id);

  if (!workflow) {
    throw new Error(`Missing demo workflow: ${id}`);
  }

  return workflow;
}

function pushEvidenceAndAudit(
  snapshot: DemoSessionSnapshot,
  input: {
    event: Parameters<typeof evidenceForEvent>[0];
    actorRole: Role;
    objectId: string;
    result: AuditEvent["result"];
  }
) {
  const evidence = evidenceForEvent(input.event, {
    actorRole: input.actorRole,
    objectId: input.objectId
  });
  const audit = auditEventForAction({
    actorRole: input.actorRole,
    action: input.event,
    objectType: evidence.objectType,
    objectId: input.objectId,
    result: input.result
  });

  snapshot.evidenceRecords = [evidence, ...snapshot.evidenceRecords];
  snapshot.auditEvents = [audit, ...snapshot.auditEvents];
}

function applyState(workflow: DemoWorkflowInstance, to: WorkflowState) {
  workflow.state = to;
}

function assertTransition(workflow: DemoWorkflowInstance, to: WorkflowState) {
  const transition = canTransition(workflow.workflow, workflow.state, to, {
    advisorApproval: workflow.advisorApproval,
    complianceRelease: workflow.complianceRelease,
    evidenceRecordExists: workflow.evidenceRecordExists,
    permissionCheck: workflow.permissionCheck
  });

  if (!transition.allowed) {
    throw new Error(`${workflow.id} cannot transition ${workflow.state} -> ${to}: ${transition.reason}`);
  }
}

export function getAdviceVisibility(snapshot: DemoSessionSnapshot) {
  const recommendation = getWorkflow(snapshot, "wf-trust-x-recommendation");

  return canShowClientAdviceLikeOutput({
    advisorApproval: recommendation.advisorApproval,
    complianceRelease: recommendation.complianceRelease,
    evidenceRecord: recommendation.evidenceRecordExists,
    permissionCheck: recommendation.permissionCheck,
    outputClassification: "decision_pack",
    clientVisibilityState: recommendation.clientVisibilityState
  });
}

export function applyDemoTransition(snapshot: DemoSessionSnapshot, input: DemoTransitionInput): DemoSessionSnapshot {
  const next: DemoSessionSnapshot = structuredClone(snapshot);

  if (input.action === "document.confirm_extraction") {
    const documentWorkflow = getWorkflow(next, "wf-trust-deed-document");
    assertTransition(documentWorkflow, "validated");
    applyState(documentWorkflow, "validated");
    documentWorkflow.lastEvent = "extraction.confirmed";
    pushEvidenceAndAudit(next, {
      event: "extraction.confirmed",
      actorRole: input.actorRole,
      objectId: documentWorkflow.objectId,
      result: "created"
    });
  }

  if (input.action === "advisor.approve") {
    const recommendation = getWorkflow(next, "wf-trust-x-recommendation");
    assertTransition(recommendation, "advisor_approved");
    applyState(recommendation, "advisor_approved");
    recommendation.advisorApproval = true;
    recommendation.lastEvent = "advice.approved";
    const decision = getWorkflow(next, "wf-beneficiary-decision");
    decision.advisorApproval = true;
    applyState(decision, "advisor_approved");
    pushEvidenceAndAudit(next, {
      event: "advice.approved",
      actorRole: input.actorRole,
      objectId: recommendation.objectId,
      result: "created"
    });
  }

  if (input.action === "advisor.request_call") {
    const recommendation = getWorkflow(next, "wf-trust-x-recommendation");
    applyState(recommendation, "deferred");
    recommendation.lastEvent = "call.scheduled";
    pushEvidenceAndAudit(next, {
      event: "call.scheduled",
      actorRole: input.actorRole,
      objectId: "call-trust-x-beneficiary",
      result: "created"
    });
  }

  if (input.action === "compliance.release") {
    const recommendation = getWorkflow(next, "wf-trust-x-recommendation");
    if (recommendation.state === "advisor_approved") {
      assertTransition(recommendation, "compliance_pending");
      applyState(recommendation, "compliance_pending");
    }
    recommendation.complianceRelease = true;
    recommendation.evidenceRecordExists = true;
    assertTransition(recommendation, "released");
    applyState(recommendation, "released");
    recommendation.clientVisibilityState = "released";
    recommendation.lastEvent = "compliance.released";

    const decision = getWorkflow(next, "wf-beneficiary-decision");
    decision.complianceRelease = true;
    decision.evidenceRecordExists = true;
    decision.clientVisibilityState = "released";
    if (decision.state === "advisor_approved") {
      applyState(decision, "compliance_pending");
    }

    pushEvidenceAndAudit(next, {
      event: "compliance.released",
      actorRole: input.actorRole,
      objectId: recommendation.objectId,
      result: "released"
    });
  }

  if (input.action === "compliance.block") {
    const recommendation = getWorkflow(next, "wf-trust-x-recommendation");
    applyState(recommendation, "rejected");
    recommendation.complianceRelease = false;
    recommendation.clientVisibilityState = "blocked";
    recommendation.lastEvent = "compliance.blocked";
    pushEvidenceAndAudit(next, {
      event: "compliance.blocked",
      actorRole: input.actorRole,
      objectId: recommendation.objectId,
      result: "blocked"
    });
  }

  if (input.action === "client.submit_decision") {
    const recommendation = getWorkflow(next, "wf-trust-x-recommendation");
    const visibility = getAdviceVisibility(next);

    if (!visibility.clientVisible) {
      throw new Error(`Decision submission blocked: ${visibility.missing.join(", ")}`);
    }

    assertTransition(recommendation, "client_visible");
    applyState(recommendation, "client_visible");

    const decision = getWorkflow(next, "wf-beneficiary-decision");
    applyState(decision, "finalized");
    decision.evidenceRecordExists = true;
    decision.lastEvent = "decision.submitted";
    pushEvidenceAndAudit(next, {
      event: "decision.submitted",
      actorRole: input.actorRole,
      objectId: `${decision.objectId}-${input.choice ?? "accepted"}`,
      result: "created"
    });
  }

  if (input.action === "access.confirm_sensitive_change") {
    const access = getWorkflow(next, "wf-external-advisor-access");
    const permission = evaluateAccessControl({
      role: "Principal",
      objectType: "permission",
      objectScope: "selected_accounts",
      action: "grant_external_access",
      sensitivity: "high_risk",
      secondConfirmation: true,
      complianceReview: true,
      relationshipAllowed: true
    });

    if (!permission.allowed) {
      throw new Error(`Access change blocked: ${permission.blockedReason}`);
    }

    applyState(access, "under_review");
    applyState(access, "approved");
    applyState(access, "provisioning");
    applyState(access, "access_granted");
    access.permissionCheck = true;
    access.evidenceRecordExists = true;
    access.lastEvent = "access.changed";
    pushEvidenceAndAudit(next, {
      event: "access.changed",
      actorRole: input.actorRole,
      objectId: access.objectId,
      result: "updated"
    });
  }

  if (input.action === "communication.send") {
    const communication = getWorkflow(next, "wf-q2-communication");
    communication.advisorApproval = true;
    communication.complianceRelease = true;
    communication.evidenceRecordExists = true;
    communication.permissionCheck = true;
    communication.clientVisibilityState = "released";
    applyState(communication, "needs_review");
    applyState(communication, "advisor_approved");
    applyState(communication, "compliance_pending");
    applyState(communication, "released");
    assertTransition(communication, "client_sent");
    applyState(communication, "client_sent");
    communication.lastEvent = "communication.sent";
    pushEvidenceAndAudit(next, {
      event: "communication.sent",
      actorRole: input.actorRole,
      objectId: communication.objectId,
      result: "created"
    });
  }

  next.updatedAt = now();

  return next;
}
