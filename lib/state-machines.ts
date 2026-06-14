export type WorkflowName =
  | "recommendation"
  | "document"
  | "action"
  | "access_request"
  | "communication"
  | "evidence_record"
  | "decision_record"
  | "call_escalation";

export type WorkflowState =
  | "draft"
  | "upload"
  | "needs_review"
  | "under_review"
  | "advisor_approved"
  | "compliance_pending"
  | "released"
  | "client_visible"
  | "client_sent"
  | "finalized"
  | "validated"
  | "linked"
  | "locked"
  | "requested"
  | "approved"
  | "provisioning"
  | "access_granted"
  | "scheduled"
  | "completed"
  | "deferred"
  | "rejected"
  | "cancelled"
  | "revoked"
  | "closed"
  | "archived";

export type TransitionGuard = {
  advisorApproval?: boolean;
  complianceRelease?: boolean;
  evidenceRecordExists?: boolean;
  permissionCheck?: boolean;
};

export const stateMachines: Record<WorkflowName, Record<WorkflowState, WorkflowState[]>> = {
  recommendation: {
    draft: ["needs_review"],
    upload: [],
    needs_review: ["advisor_approved", "deferred", "rejected"],
    under_review: [],
    advisor_approved: ["compliance_pending", "deferred"],
    compliance_pending: ["released", "rejected"],
    released: ["client_visible"],
    client_visible: ["completed", "deferred"],
    client_sent: [],
    finalized: [],
    validated: [],
    linked: [],
    locked: [],
    requested: [],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: ["archived"],
    deferred: ["needs_review", "archived"],
    rejected: ["archived"],
    cancelled: [],
    revoked: [],
    closed: [],
    archived: []
  },
  document: {
    draft: ["upload"],
    upload: ["under_review"],
    needs_review: [],
    under_review: ["validated", "rejected"],
    advisor_approved: [],
    compliance_pending: [],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: [],
    validated: ["linked", "archived"],
    linked: ["locked", "archived"],
    locked: ["archived"],
    requested: [],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: [],
    deferred: [],
    rejected: ["archived"],
    cancelled: [],
    revoked: [],
    closed: [],
    archived: []
  },
  action: {
    draft: ["needs_review"],
    upload: [],
    needs_review: ["under_review", "deferred"],
    under_review: ["approved", "rejected"],
    advisor_approved: [],
    compliance_pending: [],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: [],
    validated: [],
    linked: [],
    locked: [],
    requested: [],
    approved: ["completed"],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: ["archived"],
    deferred: ["needs_review", "archived"],
    rejected: ["archived"],
    cancelled: [],
    revoked: [],
    closed: [],
    archived: []
  },
  access_request: {
    draft: [],
    upload: [],
    needs_review: [],
    under_review: ["approved", "rejected"],
    advisor_approved: [],
    compliance_pending: [],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: [],
    validated: [],
    linked: [],
    locked: [],
    requested: ["under_review", "cancelled"],
    approved: ["provisioning"],
    provisioning: ["access_granted", "revoked"],
    access_granted: ["revoked", "closed"],
    scheduled: [],
    completed: [],
    deferred: [],
    rejected: ["closed"],
    cancelled: ["closed"],
    revoked: ["closed"],
    closed: [],
    archived: []
  },
  communication: {
    draft: ["needs_review"],
    upload: [],
    needs_review: ["advisor_approved", "cancelled"],
    under_review: [],
    advisor_approved: ["compliance_pending"],
    compliance_pending: ["released", "cancelled"],
    released: ["client_sent"],
    client_visible: [],
    client_sent: ["completed"],
    finalized: [],
    validated: [],
    linked: [],
    locked: [],
    requested: [],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: ["archived"],
    deferred: [],
    rejected: [],
    cancelled: ["archived"],
    revoked: [],
    closed: [],
    archived: []
  },
  evidence_record: {
    draft: ["upload"],
    upload: ["under_review"],
    needs_review: [],
    under_review: ["validated", "archived"],
    advisor_approved: [],
    compliance_pending: [],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: [],
    validated: ["linked"],
    linked: ["locked"],
    locked: ["archived"],
    requested: [],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: [],
    deferred: [],
    rejected: [],
    cancelled: [],
    revoked: [],
    closed: [],
    archived: []
  },
  decision_record: {
    draft: ["needs_review"],
    upload: [],
    needs_review: ["advisor_approved", "deferred"],
    under_review: [],
    advisor_approved: ["compliance_pending"],
    compliance_pending: ["finalized", "rejected"],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: ["archived"],
    validated: [],
    linked: [],
    locked: [],
    requested: [],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: [],
    completed: [],
    deferred: ["needs_review", "archived"],
    rejected: ["archived"],
    cancelled: [],
    revoked: [],
    closed: [],
    archived: []
  },
  call_escalation: {
    draft: ["requested"],
    upload: [],
    needs_review: [],
    under_review: [],
    advisor_approved: [],
    compliance_pending: [],
    released: [],
    client_visible: [],
    client_sent: [],
    finalized: [],
    validated: [],
    linked: [],
    locked: [],
    requested: ["scheduled", "cancelled"],
    approved: [],
    provisioning: [],
    access_granted: [],
    scheduled: ["completed", "cancelled"],
    completed: ["closed"],
    deferred: [],
    rejected: [],
    cancelled: ["closed"],
    revoked: [],
    closed: ["archived"],
    archived: []
  }
};

export function canTransition(workflow: WorkflowName, from: WorkflowState, to: WorkflowState, guard: TransitionGuard = {}) {
  const structurallyAllowed = stateMachines[workflow][from]?.includes(to) ?? false;

  if (!structurallyAllowed) {
    return { allowed: false, reason: "invalid_transition" } as const;
  }

  if ((to === "client_visible" || to === "client_sent") && (!guard.advisorApproval || !guard.complianceRelease || !guard.evidenceRecordExists || !guard.permissionCheck)) {
    return { allowed: false, reason: "client_visibility_gate_failed" } as const;
  }

  if (to === "released" && (!guard.complianceRelease || !guard.evidenceRecordExists)) {
    return { allowed: false, reason: "release_gate_failed" } as const;
  }

  return { allowed: true, reason: "allowed" } as const;
}

export function canTransitionRecommendation(from: WorkflowState, to: WorkflowState, guard: TransitionGuard = {}) {
  return canTransition("recommendation", from, to, guard).allowed;
}
