export const communicationExportOpsPageIds = ["051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "061", "062", "063"] as const;

export type CommunicationExportOpsPageId = (typeof communicationExportOpsPageIds)[number];

export function isCommunicationExportOpsPageId(pageId: string): pageId is CommunicationExportOpsPageId {
  return communicationExportOpsPageIds.includes(pageId as CommunicationExportOpsPageId);
}

export const auditHistoryEvents = [
  {
    id: "AUD-2184",
    timestamp: "May 21, 2025 10:32",
    actor: "Alex Bennett",
    role: "Principal",
    object: "Bennett Family Trust",
    action: "Granted access",
    source: "WealthOS Web",
    result: "Success",
    before: "No access",
    after: "View access",
    lineage: ["Request initiated", "Policy check passed", "Approval recorded", "Access granted"]
  },
  {
    id: "AUD-2183",
    timestamp: "May 21, 2025 09:15",
    actor: "James Martinez",
    role: "Admin",
    object: "Client Comms Portfolio Summary",
    action: "Downloaded export",
    source: "WealthOS Web",
    result: "Success",
    before: "Approved export",
    after: "Download audited",
    lineage: ["Export approved", "Watermark applied", "Download initiated", "Audit entry sealed"]
  },
  {
    id: "AUD-2182",
    timestamp: "May 21, 2025 08:47",
    actor: "Laura Chen",
    role: "Security",
    object: "User Michael Lee",
    action: "Updated access",
    source: "WealthOS Web",
    result: "Success",
    before: "Scoped analyst",
    after: "Restricted analyst",
    lineage: ["Change requested", "Second confirmation completed", "Policy check passed", "Role updated"]
  },
  {
    id: "AUD-2181",
    timestamp: "May 21, 2025 07:12",
    actor: "System",
    role: "System",
    object: "Data Room Q2 Reports",
    action: "Access revoked",
    source: "WealthOS Service",
    result: "Failure",
    before: "Temporary access",
    after: "Manual review required",
    lineage: ["Expiry reached", "Revocation attempted", "Policy service timeout", "Security review opened"]
  },
  {
    id: "AUD-2180",
    timestamp: "May 20, 2025 15:33",
    actor: "Sarah Lee",
    role: "Principal",
    object: "Bennett Holdings Ltd",
    action: "Viewed entity",
    source: "WealthOS Web",
    result: "Success",
    before: "View access",
    after: "View event sealed",
    lineage: ["Session verified", "Tenant scope checked", "Entity viewed", "Audit event stored"]
  }
];

export const communicationPaths = [
  { id: "update", label: "Provide update", detail: "Share account or portfolio updates", state: "available" },
  { id: "proposal", label: "Discuss proposal", detail: "Advice-like communication requiring approval", state: "selected" },
  { id: "request", label: "Request information", detail: "Client action or data request", state: "available" },
  { id: "general", label: "General discussion", detail: "Education or market commentary", state: "available" }
];

export const communicationTemplates = [
  { id: "TPL-11", title: "Portfolio change proposal", status: "Approved", usage: "124 uses", channel: "Secure message" },
  { id: "TPL-12", title: "Document request follow-up", status: "Ready", usage: "88 uses", channel: "Secure message" },
  { id: "TPL-13", title: "Call outcome summary", status: "Draft", usage: "31 uses", channel: "Advisor call" }
];

export const communicationLogItems = [
  { id: "MSG-84", channel: "Secure message", purpose: "Proposal review", status: "Approval required", owner: "Client Success" },
  { id: "CALL-19", channel: "Advisor call", purpose: "Liquidity need", status: "Scheduled", owner: "Advisor" },
  { id: "EVD-44", channel: "Evidence log", purpose: "Client acknowledgement", status: "Linked", owner: "System" }
];

export const callTriggerMatrix = [
  { id: "CT-01", scenario: "Portfolio volatility spike", complexity: "Low", emotional: "Medium", regulatory: "Low", urgency: "Medium", path: "Digital message", state: "default" },
  { id: "CT-02", scenario: "Performance under expectation", complexity: "Medium", emotional: "Medium", regulatory: "Low", urgency: "Medium", path: "Advisor call", state: "default" },
  { id: "CT-03", scenario: "Withdrawals or liquidity need", complexity: "Medium", emotional: "High", regulatory: "Medium", urgency: "High", path: "Advisor call", state: "escalated" },
  { id: "CT-04", scenario: "Large contribution received", complexity: "Low", emotional: "Low", regulatory: "Medium", urgency: "Low", path: "Digital message", state: "default" },
  { id: "CT-05", scenario: "Complex product explanation", complexity: "High", emotional: "Medium", regulatory: "Medium", urgency: "Medium", path: "F2F workshop", state: "escalated" },
  { id: "CT-06", scenario: "Regulatory policy clarification", complexity: "Medium", emotional: "Low", regulatory: "High", urgency: "Medium", path: "Compliance hold", state: "compliance hold" }
];

export const exportTypes = [
  { id: "data", title: "Data Extract", detail: "Raw entity, relationship and account data.", selected: true },
  { id: "report", title: "Report Export", detail: "Curated report package with controlled sections.", selected: false },
  { id: "document", title: "Document Export", detail: "Documents and attachments with metadata.", selected: false },
  { id: "audit", title: "Audit Export", detail: "Audit log and activity records.", selected: false }
];

export const exportWizardSteps = [
  { label: "Export Setup", status: "current" as const },
  { label: "Data and Filters", status: "upcoming" as const },
  { label: "Review and Permissions", status: "upcoming" as const },
  { label: "Confirm and Schedule", status: "upcoming" as const }
];

export const exportScopeItems = [
  { id: "SC-01", name: "Northbridge Family Office", type: "Entity", access: "Allowed", selected: true },
  { id: "SC-02", name: "Bennett Family Trust", type: "Entity", access: "Allowed", selected: true },
  { id: "SC-03", name: "Bennett Holdings Ltd", type: "Holding Company", access: "Allowed", selected: true },
  { id: "SC-04", name: "Northbridge Core Pty Ltd", type: "Operating Company", access: "Allowed", selected: true },
  { id: "SC-05", name: "Global Growth Portfolio", type: "Portfolio", access: "Allowed", selected: true },
  { id: "SC-06", name: "Alternatives Sleeve", type: "Account", access: "Restricted", selected: false },
  { id: "SC-07", name: "Bennett Philanthropy Fund", type: "Fund", access: "Limited", selected: true },
  { id: "SC-08", name: "Offshore Trust", type: "Trust", access: "Not permitted", selected: false }
];

export const redactionSummary = [
  { id: "RS-01", label: "Financial values", severity: "High", count: 3 },
  { id: "RS-02", label: "Account identifiers", severity: "High", count: 4 },
  { id: "RS-03", label: "Advisor names", severity: "Medium", count: 2 },
  { id: "RS-04", label: "Client contact fields", severity: "Low", count: 3 }
];

export const previewPolicyChecks = [
  { id: "PC-01", policy: "Data retention policy", state: "Blocked", detail: "Records exceed policy retention limit." },
  { id: "PC-02", policy: "PII handling policy", state: "Pass", detail: "Direct personal identifiers removed." },
  { id: "PC-03", policy: "Jurisdiction transfer policy", state: "Pass", detail: "Approved for Singapore recipient scope." },
  { id: "PC-04", policy: "Secure export policy", state: "Warning", detail: "Encryption key rotation recommended." }
];

export const exportTimeline = [
  { id: "ET-01", actor: "Alex Bennett", result: "SUCCESS" as const, timestamp: "May 21, 09:14", title: "Export requested" },
  { id: "ET-02", actor: "System", result: "SUCCESS" as const, timestamp: "May 21, 09:28", title: "Data compiled" },
  { id: "ET-03", actor: "Compliance service", result: "SUCCESS" as const, timestamp: "May 21, 09:35", title: "Compliance scan completed" },
  { id: "ET-04", actor: "System", result: "SUCCESS" as const, timestamp: "May 21, 09:42", title: "Watermark applied" },
  { id: "ET-05", actor: "Alex Bennett", result: "SUCCESS" as const, timestamp: "May 21, 09:45", title: "Download recorded" },
  { id: "ET-06", actor: "System", result: "PENDING" as const, timestamp: "May 28, 09:42", title: "Share link expiry scheduled" }
];

export const opsMetrics = [
  { label: "Total Backlog", value: "1,284", delta: "+8%", tone: "gold" },
  { label: "Overdue", value: "146", delta: "+12%", tone: "red" },
  { label: "At Risk", value: "213", delta: "+5%", tone: "gold" },
  { label: "SLA Met", value: "92%", delta: "-2pp", tone: "green" },
  { label: "Avg. Age", value: "2.6 days", delta: "+0.4", tone: "blue" },
  { label: "Capacity", value: "84%", delta: "+9pp", tone: "green" }
];

export const queueRows = [
  { id: "Q-01", queue: "KYC Reviews", owner: "Alex Bennett", high: 23, medium: 45, low: 32, backlog: 312, overdue: 46, atRisk: 52, sla: 81, capacity: "108%", status: "Overload" },
  { id: "Q-02", queue: "Transaction Monitoring", owner: "Priya Natarajan", high: 18, medium: 52, low: 30, backlog: 276, overdue: 18, atRisk: 41, sla: 94, capacity: "92%", status: "On Track" },
  { id: "Q-03", queue: "Policy Exceptions", owner: "James Harrison", high: 40, medium: 40, low: 20, backlog: 198, overdue: 27, atRisk: 39, sla: 76, capacity: "115%", status: "Overload" },
  { id: "Q-04", queue: "Document Review", owner: "Mei Lin", high: 12, medium: 48, low: 40, backlog: 156, overdue: 5, atRisk: 22, sla: 96, capacity: "68%", status: "On Track" },
  { id: "Q-05", queue: "Data Quality Issues", owner: "Michael Lee", high: 35, medium: 45, low: 20, backlog: 68, overdue: 43, atRisk: 11, sla: 58, capacity: "130%", status: "Error" }
];

export const slaMetrics = [
  { label: "Overall SLA Compliance", value: "93%", state: "On Track", tone: "green" },
  { label: "On Track", value: "1,154", state: "+4.2%", tone: "green" },
  { label: "At Risk", value: "66", state: "-0.8%", tone: "gold" },
  { label: "Breached", value: "28", state: "+1.1%", tone: "red" },
  { label: "Avg. Resolve Time", value: "1.6 days", state: "-0.4 days", tone: "blue" }
];

export const breachRows = [
  { id: "BR-00567", service: "Portfolio Changes", obligation: "Implement change", client: "Bennett Family Trust", due: "May 20", status: "Breached", severity: "High", elapsed: "3d 1h", owner: "Alex Bennett", escalation: "L2" },
  { id: "BR-00558", service: "Money Movement", obligation: "Outgoing transfer", client: "Northbridge Family Office", due: "May 21", status: "Breached", severity: "High", elapsed: "6h 32m", owner: "James Martinez", escalation: "L1" },
  { id: "AR-00621", service: "Document Requests", obligation: "Account statement", client: "SG Growth Fund", due: "May 22", status: "At Risk", severity: "Medium", elapsed: "1d 2h", owner: "Priya Nair", escalation: "L1" },
  { id: "AR-00635", service: "Client Comms", obligation: "Quarterly update", client: "Bennett Holdings Ltd", due: "May 23", status: "At Risk", severity: "Medium", elapsed: "1d 10h", owner: "Sarah Chen", escalation: "L2" }
];

export const blueprintStages = ["Intake", "Data Collection", "Review", "Approval", "Release", "Decision", "Evidence", "Ongoing Review"];

export const blueprintRows = [
  { lane: "Customer", detail: "Client actions and touchpoints", cells: ["Requests engagement", "Provides documents", "Clarifies questions", "Acknowledges approval", "Receives readiness", "Receives outcome", "Views evidence", "Engages review"] },
  { lane: "Frontstage", detail: "Client-facing activities", cells: ["Capture request", "Guide intake", "Review quality", "Present for approval", "Communicate next steps", "Confirm outcome", "Share evidence", "Schedule review"] },
  { lane: "Backstage", detail: "Internal operations", cells: ["Triage request", "Standardize data", "Assess criteria", "Compliance review", "Prepare release", "Record decision", "Assemble evidence", "Monitor triggers"] },
  { lane: "Support", detail: "Systems and controls", cells: ["CRM and intake forms", "Connectors and documents", "Analytics engine", "Policy engine", "Client comms", "Decision log", "Evidence vault", "Scheduler"] },
  { lane: "Evidence", detail: "Immutable outputs", cells: ["Request ID", "Source receipt", "Review notes", "Approval record", "Release record", "Decision record", "Evidence package", "Change log"] }
];

export const roadmapColumns = [
  {
    id: "mvp",
    title: "MVP",
    period: "Q2-Q3 2025",
    items: [
      { id: "MVP-01", title: "Client profile foundation", status: "On Track", detail: "Profile, household, mandates and preferences." },
      { id: "MVP-02", title: "Portfolio aggregation read-only", status: "On Track", detail: "External account and position visibility." },
      { id: "MVP-03", title: "Holdings and performance", status: "On Track", detail: "Breakdown, attribution and review context." },
      { id: "MVP-04", title: "Compliance guardrails v1", status: "On Track", detail: "Suitability, risk and regulatory guardrails." },
      { id: "MVP-05", title: "No Advice Gate", status: "On Track", detail: "Prevent unapproved advice reaching clients." }
    ]
  },
  {
    id: "phase2",
    title: "Phase 2",
    period: "Q4 2025-Q1 2026",
    items: [
      { id: "P2-01", title: "Planning and goal center", status: "At Risk", detail: "Goals, cash flow and scenario planning." },
      { id: "P2-02", title: "Proposals and recommendations", status: "Blocked", detail: "Blocked until No Advice Gate is complete." },
      { id: "P2-03", title: "Billing and fees hub", status: "Not Started", detail: "Billing, invoicing and fee schedules." },
      { id: "P2-04", title: "Integrations framework", status: "Not Started", detail: "Open API and partner ecosystem." }
    ]
  },
  {
    id: "future",
    title: "Future",
    period: "Beyond Q1 2026",
    items: [
      { id: "FUT-01", title: "AI insights and research", status: "Not Started", detail: "Research summaries and portfolio intelligence." },
      { id: "FUT-02", title: "Advanced tax optimisation", status: "Not Started", detail: "Tax-aware strategy engine." },
      { id: "FUT-03", title: "Direct indexing", status: "Not Started", detail: "Custom index creation and management." }
    ]
  }
];

export const stateChips = ["Active", "Inactive", "Pending", "Processing", "Scheduled", "Completed", "Failed", "Cancelled", "On Hold", "Draft", "Archived", "Unknown"];

export const workflowBadges = ["Not Started", "In Progress", "Review", "Approved", "Rejected", "Escalated", "Blocked", "On Hold", "Resolved"];

export const stateCatalogueRows = [
  { id: "ST-01", code: "CLIENT_ACTIVE", name: "Active", category: "Client", type: "Terminal", usedIn: "Client, account, portfolio", status: "Active" },
  { id: "ST-02", code: "EXPORT_PENDING", name: "Pending", category: "Export", type: "Workflow", usedIn: "Export approval", status: "Pending" },
  { id: "ST-03", code: "COMMS_REVIEW", name: "Review", category: "Communication", type: "Workflow", usedIn: "Message approval", status: "Review" },
  { id: "ST-04", code: "ACCESS_BLOCKED", name: "Blocked", category: "Governance", type: "Gate", usedIn: "Permission checks", status: "Blocked" }
];
