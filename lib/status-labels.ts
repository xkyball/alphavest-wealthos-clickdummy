import type { WorkflowState } from "./state-machines";

export const workflowStatusLabels: Record<WorkflowState, string> = {
  draft: "Draft",
  upload: "Upload",
  needs_review: "Needs Review",
  under_review: "Under Review",
  advisor_approved: "Advisor Approved",
  compliance_pending: "Compliance Pending",
  released: "Released",
  client_visible: "Client Visible",
  client_sent: "Client Sent",
  finalized: "Finalized",
  validated: "Validated",
  linked: "Linked",
  locked: "Locked",
  requested: "Requested",
  approved: "Approved",
  provisioning: "Provisioning",
  access_granted: "Access Granted",
  scheduled: "Scheduled",
  completed: "Completed",
  deferred: "Deferred",
  rejected: "Rejected",
  cancelled: "Cancelled",
  revoked: "Revoked",
  closed: "Closed",
  archived: "Archived"
};
