export const decisionsGovernancePageIds = ["041", "042", "043", "044", "045", "046", "047", "048", "049", "050"] as const;

export type DecisionsGovernancePageId = (typeof decisionsGovernancePageIds)[number];

export function isDecisionsGovernancePageId(pageId: string): pageId is DecisionsGovernancePageId {
  return decisionsGovernancePageIds.includes(pageId as DecisionsGovernancePageId);
}

export const complianceBlockReview = {
  advisor: "Michael Chen",
  client: "James and Linda Carter",
  dueDate: "Apr 24, 2025",
  entity: "AlphaVest Advisors",
  id: "CR-2025-0417",
  owner: "Sarah Patel",
  reviewTitle: "Retirement Income Plan Update",
  status: "Blocked",
  summary: "Advice content is not releasable to the client because required evidence is incomplete.",
  timeline: [
    { actor: "Michael Chen", id: "block-review", result: "BLOCKED", timestamp: "Apr 17, 2025 10:32 AM", title: "Review blocked" },
    { actor: "System", id: "awaiting-compliance", result: "PENDING", timestamp: "Apr 17, 2025 10:18 AM", title: "Awaiting compliance" },
    { actor: "Michael Chen", id: "review-submitted", result: "SUCCESS", timestamp: "Apr 17, 2025 09:45 AM", title: "Review submitted" }
  ] as const
};

export const missingEvidenceChecklist = [
  "Risk profile and suitability assessment",
  "Income needs analysis",
  "Social security analysis",
  "Investment policy acknowledgement",
  "Fee disclosure acknowledgement",
  "Tax impact analysis"
];

export const requestedEvidenceItems = [
  { item: "Completed risk profile", required: true },
  { item: "Income needs analysis", required: true },
  { item: "Signed policy acknowledgement", required: true },
  { item: "Tax impact analysis", required: true }
];

export const complianceAuditMetrics = [
  { label: "Total Events", value: "12,842", detail: "All time" },
  { label: "Open Exceptions", value: "27", detail: "Requiring attention" },
  { label: "Resolved", value: "184", detail: "Last 30 days" },
  { label: "Avg. Resolution", value: "2.6d", detail: "Median time" }
];

export const complianceAuditRows = [
  { actor: "Jason Smith", client: "Westlake Family Trust", event: "Exception Created", policy: "Concentration Limit", severity: "High", source: "Monitoring", status: "Open", timestamp: "May 20, 2025 10:24 AM" },
  { actor: "WealthOS Engine", client: "Anderson Family Office", event: "Pre-Trade Check", policy: "Restricted Security", severity: "Medium", source: "Pre-Trade", status: "Open", timestamp: "May 20, 2025 09:58 AM" },
  { actor: "Ava Chen", client: "Horizon Partners", event: "Policy Override", policy: "Leverage Limit", severity: "High", source: "Compliance", status: "Open", timestamp: "May 20, 2025 09:41 AM" },
  { actor: "Thomas Brooks", client: "Westlake Family Trust", event: "Exception Resolved", policy: "Concentration Limit", severity: "Medium", source: "Compliance", status: "Resolved", timestamp: "May 20, 2025 09:15 AM" },
  { actor: "WealthOS Engine", client: "Chen Family Holdings", event: "Monitoring Alert", policy: "Cash Balance", severity: "Low", source: "Monitoring", status: "Open", timestamp: "May 20, 2025 08:47 AM" },
  { actor: "Michael Moore", client: "Summit Retirement Plan", event: "Manual Review", policy: "Suitability Rule", severity: "Low", source: "Review", status: "Resolved", timestamp: "May 20, 2025 07:52 AM" }
];

export const exceptionSummary = [
  { label: "High", value: 7 },
  { label: "Medium", value: 13 },
  { label: "Low", value: 7 }
];

export const decisionsMetrics = [
  { label: "Total Decisions", value: "7" },
  { label: "Awaiting Your Action", value: "3" },
  { label: "Awaiting Others", value: "2" },
  { label: "Recently Completed", value: "2" }
];

export const decisionRows = [
  { category: "Investments", due: "May 26, 2025", owner: "You", stage: "Your Approval", status: "Awaiting Your Action", title: "Approve Q2 Investment Rebalance", updated: "Updated May 12, 2025" },
  { category: "Philanthropy", due: "May 30, 2025", owner: "James Miller", stage: "Principal Review", status: "Awaiting Others", title: "Authorize Charitable Grant", updated: "Updated May 8, 2025" },
  { category: "Governance", due: "May 19, 2025", owner: "You", stage: "Your Approval", status: "Awaiting Your Action", title: "Family Council Agenda Approval", updated: "Updated May 5, 2025" },
  { category: "Trusts", due: "May 2, 2025", owner: "All", stage: "Completed", status: "Completed", title: "Trust Distribution Proposal", updated: "Completed May 2, 2025" },
  { category: "Investments", due: "Jun 6, 2025", owner: "Investment Committee", stage: "Investment Committee", status: "In Review", title: "Approve New Investment Manager", updated: "Updated Apr 28, 2025" },
  { category: "Planning", due: "Jun 10, 2025", owner: "You", stage: "Your Approval", status: "Awaiting Your Action", title: "Update Beneficiary Designations", updated: "Updated Apr 24, 2025" }
];

export const decisionRoom = {
  client: "Summit Family Office",
  decisionId: "DEC-2025-000147",
  dueDate: "May 16, 2025",
  impact: "High",
  owner: "Priya Nair",
  portfolio: "Summit Multi-Asset Fund",
  title: "Strategic Rebalance - Q2 2025",
  summary: "Market volatility and shifting macro conditions warrant a tactical rebalance to maintain risk targets and improve portfolio resilience."
};

export const decisionOptions = [
  { description: "Increase quality equity, reduce duration and add alternatives.", estimatedReturn: "+0.35%", label: "Strategic Rebalance", recommended: true, risk: "12.4%", turnover: "18%" },
  { description: "Lower equity exposure, increase cash and investment-grade bonds.", estimatedReturn: "+0.10%", label: "Conservative Tilt", recommended: false, risk: "9.1%", turnover: "10%" },
  { description: "No changes to current allocation.", estimatedReturn: "-0.05%", label: "Status Quo", recommended: false, risk: "13.0%", turnover: "0%" }
];

export const decisionApprovals = [
  { actor: "Priya Nair", role: "Decision Owner", status: "Approved" },
  { actor: "Daniel Park", role: "CIO", status: "Approved" },
  { actor: "Meera Shah", role: "Risk Officer", status: "Approved" }
];

export const decisionSuccess = {
  client: "Morgan Family Trust",
  decisionId: "DEC-2025-000124",
  evidenceId: "EVD-2025-000124",
  nextReview: "May 19, 2026",
  reviewer: "Chief Investment Officer",
  submittedBy: "Alex Baker, CFA",
  submittedOn: "May 19, 2025 10:24 AM ET",
  type: "Asset Allocation Change"
};

export const evidenceRows = [
  { category: "Suitability", client: "Johnson Family", status: "Verified", title: "Risk Tolerance Questionnaire", type: "Form assessment", updated: "May 14, 2025" },
  { category: "Policy", client: "Johnson Family", status: "Verified", title: "Investment Policy Statement", type: "Document", updated: "May 12, 2025" },
  { category: "Financial", client: "Johnson Family", status: "Verified", title: "Tax Return 2023", type: "Document", updated: "May 10, 2025" },
  { category: "Financial", client: "Johnson Family", status: "Pending Review", title: "W-2 Forms 2023", type: "Document", updated: "May 9, 2025" },
  { category: "Meeting Notes", client: "Johnson Family", status: "Internal", title: "Advisor Meeting Notes - Q2", type: "Internal note", updated: "May 8, 2025" },
  { category: "Insurance", client: "Johnson Family", status: "Verified", title: "Insurance Coverage Summary", type: "Document", updated: "May 7, 2025" }
];

export const evidenceRecord = {
  client: "James and Linda Carter",
  created: "Mar 15, 2024 09:41 AM",
  evidenceId: "EVD-2024-000785",
  integrity: "Verified",
  owner: "Alex Brooks",
  relatedDecision: "Investment review 0152",
  retention: "Standard evidence retention",
  title: "2024 Q1 Client Statement",
  version: "2.1",
  visibility: "Restricted"
};

export const evidenceTimeline = [
  { actor: "Alex Brooks", id: "version-updated", result: "SUCCESS", timestamp: "May 02, 2024 11:23 AM", title: "Version 2.1 updated" },
  { actor: "Sarah Johnson", id: "accessed-review", result: "SUCCESS", timestamp: "May 02, 2024 09:14 AM", title: "Accessed for review" },
  { actor: "System", id: "linked-decision", result: "SUCCESS", timestamp: "Mar 28, 2024 02:31 PM", title: "Linked to decision" },
  { actor: "Alex Brooks", id: "initial-record", result: "PENDING", timestamp: "Mar 15, 2024 09:41 AM", title: "Initial record created" }
] as const;

export const governanceMetrics = [
  { label: "Total Users", value: "28", detail: "Across all entities" },
  { label: "Active Users", value: "18", detail: "64% of total" },
  { label: "Pending Invites", value: "4", detail: "Invitations sent" },
  { label: "Revoked Access", value: "3", detail: "No longer active" },
  { label: "Blocked Users", value: "2", detail: "Access blocked" }
];

export const governanceUsers = [
  { access: "All Entities", email: "daniel.carter@example.test", lastActive: "2m ago", mfa: "Enabled", name: "Daniel Carter", role: "Super Admin", status: "Active" },
  { access: "AlphaVest Capital", email: "sarah.williams@example.test", lastActive: "1h ago", mfa: "Enabled", name: "Sarah Williams", role: "Admin", status: "Active" },
  { access: "AlphaVest Capital", email: "michael.johnson@example.test", lastActive: "3h ago", mfa: "Enabled", name: "Michael Johnson", role: "Investment Manager", status: "Active" },
  { access: "AlphaVest Capital", email: "emily.roberts@example.test", lastActive: "-", mfa: "Pending", name: "Emily Roberts", role: "Analyst", status: "Pending" },
  { access: "AlphaVest Capital", email: "james.thompson@example.test", lastActive: "5d ago", mfa: "-", name: "James Thompson", role: "Compliance Officer", status: "Revoked" },
  { access: "AlphaVest Capital", email: "lisa.martinez@example.test", lastActive: "2d ago", mfa: "-", name: "Lisa Martinez", role: "Analyst", status: "Blocked" }
];

export const roleRows = [
  { accounts: "Full", billing: "None", clients: "Full", investments: "Full", reporting: "Full", role: "Super Administrator", trading: "Full", type: "System" },
  { accounts: "Full", billing: "Partial", clients: "Partial", investments: "Full", reporting: "Partial", role: "Portfolio Manager", trading: "Partial", type: "Custom" },
  { accounts: "Partial", billing: "None", clients: "None", investments: "Partial", reporting: "Full", role: "Investment Analyst", trading: "None", type: "Custom" },
  { accounts: "Full", billing: "Partial", clients: "Full", investments: "Partial", reporting: "Full", role: "Operations Manager", trading: "Partial", type: "Custom" },
  { accounts: "None", billing: "None", clients: "Partial", investments: "Partial", reporting: "None", role: "Client Advisor", trading: "None", type: "Custom" },
  { accounts: "Partial", billing: "None", clients: "Full", investments: "None", reporting: "Partial", role: "Compliance Officer", trading: "None", type: "System" }
];

export const rolePermissions = [
  { group: "Clients", permissions: ["View clients", "Create or edit clients", "Delete clients", "Export clients"] },
  { group: "Accounts", permissions: ["View accounts", "Create or edit accounts", "Delete accounts", "Export accounts", "Approve account changes"] },
  { group: "Investments", permissions: ["View investments", "Create or edit investments", "Delete investments", "Trade authorization"] }
];

export const accessRequests = [
  { access: "View client performance", requester: "Emily Tran", scope: "Sterling Family Trust", status: "Pending", submitted: "Jun 12, 2025 10:24 AM", type: "View" },
  { access: "Export account holdings", requester: "James Patel", scope: "Horizon Partners", status: "Pending", submitted: "Jun 11, 2025 4:15 PM", type: "Export" },
  { access: "Edit investment model", requester: "Sarah Mitchell", scope: "Growth Model v2", status: "Approved", submitted: "Jun 10, 2025 9:02 AM", type: "Edit" },
  { access: "View sensitive documents", requester: "Daniel Kim", scope: "Blake Family Office", status: "Denied", submitted: "Jun 9, 2025 2:11 PM", type: "View" },
  { access: "Modify user role", requester: "Priya Shah", scope: "Kevin Liu", status: "Escalated", submitted: "Jun 8, 2025 11:37 AM", type: "Modify" },
  { access: "Run custom report", requester: "Oliver Bennett", scope: "All reports", status: "Approved", submitted: "Jun 7, 2025 10:01 AM", type: "Run" }
];

export const accessPolicyChecks = [
  { label: "RBAC Policy", result: "Compliant" },
  { label: "SOD Conflict", result: "Review Required" },
  { label: "Data Access Policy", result: "Compliant" },
  { label: "Least Privilege", result: "Compliant" }
];
