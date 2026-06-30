export const wealthActionsPageIds = ["031", "032"] as const;

export type WealthActionsPageId = (typeof wealthActionsPageIds)[number];

export function isWealthActionsPageId(pageId: string): pageId is WealthActionsPageId {
  return wealthActionsPageIds.includes(pageId as WealthActionsPageId);
}

export const wealthWorkspace = {
  household: "Bennett Family Office",
  principal: "Alex Bennett",
  analyst: "Alex Brown",
  advisor: "Maria Santos",
  value: "$39.9M",
  lastUpdated: "Today, 9:15 AM"
};

export const wealthMapFilters = [
  { label: "View", value: "All entities" },
  { label: "Scope", value: "Bennett Family Office" },
  { label: "Jurisdiction", value: "All" },
  { label: "Entity type", value: "All" },
  { label: "Visibility", value: "All incl. restricted" }
];

export const wealthMapLegend = [
  { label: "Person", tone: "purple" },
  { label: "Trust", tone: "gold" },
  { label: "Company", tone: "blue" },
  { label: "Portfolio", tone: "green" },
  { label: "Real estate", tone: "red" },
  { label: "Insurance", tone: "teal" },
  { label: "Tax residency", tone: "muted" },
  { label: "Restricted", tone: "purple" },
  { label: "Conflict", tone: "red" },
  { label: "Gap", tone: "gold" }
] as const;

export const wealthMapConnections = [
  { from: [28, 20], to: [48, 20], kind: "normal" },
  { from: [38, 27], to: [38, 34], kind: "normal" },
  { from: [38, 34], to: [22, 34], kind: "normal" },
  { from: [38, 34], to: [50, 34], kind: "normal" },
  { from: [50, 34], to: [68, 34], kind: "normal" },
  { from: [22, 43], to: [10, 57], kind: "normal" },
  { from: [22, 43], to: [23, 57], kind: "normal" },
  { from: [22, 43], to: [36, 57], kind: "normal" },
  { from: [22, 43], to: [49, 57], kind: "normal" },
  { from: [50, 43], to: [60, 65], kind: "normal" },
  { from: [60, 73], to: [60, 86], kind: "normal" },
  { from: [68, 43], to: [72, 57], kind: "normal" },
  { from: [50, 43], to: [62, 50], kind: "conflict" },
  { from: [60, 72], to: [66, 63], kind: "conflict" },
  { from: [76, 22], to: [86, 32], kind: "restricted" },
  { from: [86, 40], to: [86, 51], kind: "restricted" },
  { from: [86, 59], to: [86, 71], kind: "restricted" }
] as const;

export const wealthMapNodes = [
  { id: "alex", label: "Alex Bennett", detail: "Principal", value: "", x: 28, y: 15, tone: "purple", flags: ["Principal"] },
  { id: "sophie", label: "Sophie Bennett", detail: "Spouse", value: "", x: 48, y: 15, tone: "purple", flags: [] },
  { id: "family-trust", label: "Bennett Family Trust", detail: "Discretionary Trust", value: "$39.9M", x: 22, y: 34, tone: "gold", flags: ["Selected", "Conflict"] },
  { id: "holdings", label: "Bennett Holdings Ltd", detail: "Holding Company", value: "Singapore", x: 50, y: 34, tone: "blue", flags: ["Conflict"] },
  { id: "education-trust", label: "Bennett Education Trust", detail: "Purpose Trust", value: "", x: 68, y: 34, tone: "gold", flags: [] },
  { id: "growth", label: "Global Growth", detail: "Portfolio", value: "$28.7M USD", x: 10, y: 56, tone: "green", flags: [] },
  { id: "income", label: "Income & Yield", detail: "Portfolio", value: "$11.2M USD", x: 23, y: 56, tone: "green", flags: [] },
  { id: "estate", label: "Oceanview Estate", detail: "Real Estate", value: "$18.5M USD", x: 36, y: 56, tone: "red", flags: [] },
  { id: "insurance", label: "Bennett Life Plan", detail: "Insurance", value: "$3.2M USD", x: 49, y: 56, tone: "teal", flags: [] },
  { id: "opco", label: "Bennett OpCo", detail: "Operating Co.", value: "Australia", x: 60, y: 66, tone: "blue", flags: [] },
  { id: "cash", label: "Operating Cash", detail: "Liquidity", value: "$4.1M USD", x: 60, y: 86, tone: "green", flags: [] },
  { id: "education-fund", label: "Education Fund", detail: "Portfolio", value: "$2.3M USD", x: 72, y: 56, tone: "green", flags: [] },
  { id: "offshore-trust", label: "Offshore Trust", detail: "Restricted", value: "", x: 86, y: 34, tone: "restricted", flags: ["Restricted"] },
  { id: "holdco", label: "Offshore HoldCo", detail: "Restricted", value: "", x: 86, y: 53, tone: "restricted", flags: ["Restricted"] },
  { id: "property", label: "Confidential Property", detail: "Restricted", value: "", x: 86, y: 72, tone: "restricted", flags: ["Gap"] },
  { id: "au-tax", label: "Australia", detail: "Tax Residency", value: "", x: 24, y: 91, tone: "muted", flags: [] },
  { id: "sg-tax", label: "Singapore", detail: "Tax Residency", value: "", x: 36, y: 91, tone: "muted", flags: [] },
  { id: "us-tax", label: "United States", detail: "Tax Residency", value: "", x: 48, y: 91, tone: "muted", flags: [] },
  { id: "nz-tax", label: "New Zealand", detail: "Tax Residency", value: "", x: 72, y: 91, tone: "muted", flags: [] }
] as const;

export const selectedWealthNode = {
  name: "Bennett Family Trust",
  type: "Discretionary Trust",
  status: "Active",
  value: "$39.9M USD",
  purpose: "Wealth accumulation and family benefit",
  settlor: "Alex Bennett",
  trustee: "Bennett Trustees Pty Ltd",
  jurisdiction: "Australia",
  documents: "3",
  relationships: "8"
};

export const wealthMapAlerts = [
  { title: "Conflict detected", detail: "Ownership overlap with Bennett Holdings Ltd", action: "View details", tone: "red" },
  { title: "Missing documents", detail: "2 documents pending", action: "Review", tone: "gold" },
  { title: "Upcoming review", detail: "Trust deed review due in 47 days", action: "17 Jul 2025", tone: "blue" }
] as const;

export const wealthMapDecisions = [
  { title: "Consider redomiciling trust to Singapore", status: "In Progress", owner: "AB", due: "Due 30 Jun 2025" },
  { title: "Update investment policy statement", status: "Open", owner: "SL", due: "Due 15 Jul 2025" }
];

export const actionMetrics = [
  { label: "Total Actions", value: "128", delta: "12 vs last 7 days", trend: "up" },
  { label: "Overdue", value: "14", delta: "3 vs last 7 days", trend: "down" },
  { label: "Due Today", value: "9", delta: "vs last 7 days", trend: "flat" },
  { label: "Due This Week", value: "27", delta: "5 vs last 7 days", trend: "up" },
  { label: "Blocked", value: "6", delta: "2 vs last 7 days", trend: "down" },
  { label: "Completed", value: "22", delta: "8 vs last 7 days", trend: "up" }
] as const;

export type ActionCard = {
  assignee: string;
  due: string;
  evidence: string;
  id: string;
  object: string;
  priority: "High" | "Low" | "Medium";
  title: string;
  warning?: string;
};

export const actionColumns: Array<{ id: string; title: string; count: number; cards: ActionCard[] }> = [
  {
    id: "to-review",
    title: "To Review",
    count: 11,
    cards: [
      { id: "ACT-2025-0411", title: "Update Risk Profile", priority: "High", object: "Patel Family Trust", assignee: "Alex Brown", due: "May 20, 2025", evidence: "Not Started" },
      { id: "ACT-2025-0412", title: "Review Q1 Performance", priority: "Medium", object: "Patel Family Trust", assignee: "Maria Santos", due: "May 22, 2025", evidence: "Not Started" },
      { id: "ACT-2025-0413", title: "KYC Refresh", priority: "Low", object: "Anderson Family Office", assignee: "James Lee", due: "May 26, 2025", evidence: "Not Started" }
    ]
  },
  {
    id: "awaiting-documents",
    title: "Awaiting Documents",
    count: 9,
    cards: [
      { id: "ACT-2025-0414", title: "Beneficial Ownership", priority: "High", object: "Harrington Family LP", assignee: "Sofia Martinez", due: "Overdue 3 days", evidence: "1 of 3", warning: "Missing evidence" },
      { id: "ACT-2025-0415", title: "Tax Residency Certificate", priority: "Medium", object: "Patel Family Trust", assignee: "Alex Brown", due: "May 23, 2025", evidence: "0 of 1" },
      { id: "ACT-2025-0416", title: "Quarterly Bank Statements", priority: "Medium", object: "Anderson Family Office", assignee: "Daniel Kim", due: "May 28, 2025", evidence: "0 of 4" }
    ]
  },
  {
    id: "analyst-reviewing",
    title: "Analyst Reviewing",
    count: 14,
    cards: [
      { id: "ACT-2025-0417", title: "Investment Policy Review", priority: "High", object: "Patel Family Trust", assignee: "Alex Brown", due: "May 21, 2025", evidence: "4 of 5", warning: "Client approval missing" },
      { id: "ACT-2025-0418", title: "Concentration Analysis", priority: "Medium", object: "Harrington Family LP", assignee: "Alex Brown", due: "May 22, 2025", evidence: "3 of 3" },
      { id: "ACT-2025-0419", title: "Liquidity Assessment", priority: "Low", object: "Anderson Family Office", assignee: "Priya Desai", due: "May 27, 2025", evidence: "2 of 2" }
    ]
  },
  {
    id: "advisor-reviewing",
    title: "Advisor Reviewing",
    count: 8,
    cards: [
      { id: "ACT-2025-0420", title: "Estate Plan Update", priority: "High", object: "Patel Family Trust", assignee: "Maria Santos", due: "May 22, 2025", evidence: "5 of 5" },
      { id: "ACT-2025-0421", title: "Insurance Review", priority: "Medium", object: "Anderson Family Office", assignee: "Maria Santos", due: "May 23, 2025", evidence: "2 of 2" },
      { id: "ACT-2025-0422", title: "Charitable Strategy Review", priority: "Low", object: "Harrington Family LP", assignee: "Robert Chen", due: "May 30, 2025", evidence: "1 of 1" }
    ]
  },
  {
    id: "compliance-pending",
    title: "Compliance Pending",
    count: 7,
    cards: [
      { id: "ACT-2025-0423", title: "ESG Screening Review", priority: "Medium", object: "Patel Family Trust", assignee: "Compliance Team", due: "May 21, 2025", evidence: "3 of 3" },
      { id: "ACT-2025-0424", title: "Sanctions Check", priority: "High", object: "Harrington Family LP", assignee: "Compliance Team", due: "May 21, 2025", evidence: "3 of 3" },
      { id: "ACT-2025-0425", title: "PEP Screening", priority: "Low", object: "Anderson Family Office", assignee: "Compliance Team", due: "May 26, 2025", evidence: "2 of 2" }
    ]
  },
  {
    id: "ready-client",
    title: "Ready for Client",
    count: 10,
    cards: [
      { id: "ACT-2025-0426", title: "Q1 Review Package", priority: "High", object: "Patel Family Trust", assignee: "Alex Brown", due: "May 23, 2025", evidence: "6 of 6" },
      { id: "ACT-2025-0427", title: "Tax Planning Summary", priority: "Medium", object: "Anderson Family Office", assignee: "Maria Santos", due: "May 24, 2025", evidence: "4 of 4" },
      { id: "ACT-2025-0428", title: "Investment Update Letter", priority: "Low", object: "Harrington Family LP", assignee: "Robert Chen", due: "May 27, 2025", evidence: "3 of 3" }
    ]
  },
  {
    id: "completed",
    title: "Completed",
    count: 32,
    cards: [
      { id: "ACT-2025-0429", title: "2024 Tax Organizer Review", priority: "Low", object: "Patel Family Trust", assignee: "Alex Brown", due: "May 12, 2025", evidence: "Done" },
      { id: "ACT-2025-0430", title: "Trust Account Summary", priority: "Low", object: "Harrington Family LP", assignee: "Sofia Martinez", due: "May 9, 2025", evidence: "Done" },
      { id: "ACT-2025-0431", title: "KYC Initial Setup", priority: "Low", object: "Anderson Family Office", assignee: "James Lee", due: "May 8, 2025", evidence: "Done" }
    ]
  },
  {
    id: "blocked",
    title: "Deferred / Blocked",
    count: 5,
    cards: [
      { id: "ACT-2025-0432", title: "Offshore Entity Verification", priority: "High", object: "Harrington Family LP", assignee: "Sofia Martinez", due: "Overdue 5 days", evidence: "Missing", warning: "Evidence missing" }
    ]
  }
];

export const selectedAction = {
  id: "ACT-2025-0417",
  title: "Investment Policy Review",
  object: "Patel Family Trust",
  owner: "Alex Brown (Analyst)",
  due: "May 21, 2025",
  priority: "High",
  stage: "Analyst Reviewing",
  relatedObject: "Investment Policy Statement",
  evidenceState: "4 of 5",
  summary: "Review and update the Investment Policy Statement to reflect current objectives, risk tolerance and governance guidelines.",
  note: "Reviewing latest allocation and ensuring alignment with updated risk parameters. Awaiting client approval document."
};

export const selectedActionEvidence = [
  { title: "Current IPS (2023).pdf", type: "Policy", status: "Complete", updated: "Uploaded May 15, 2025" },
  { title: "Risk Profile Summary.docx", type: "Document", status: "Complete", updated: "Uploaded May 15, 2025" },
  { title: "Asset Allocation Data.xlsx", type: "Spreadsheet", status: "Complete", updated: "Uploaded May 16, 2025" },
  { title: "Governance Guidelines.docx", type: "Document", status: "Complete", updated: "Uploaded May 16, 2025" },
  { title: "Client Approval", type: "Approval", status: "Missing", updated: "Required" }
] as const;

export const selectedActionTimeline = [
  { actor: "System", id: "created", result: "SUCCESS", timestamp: "May 15, 2025 9:12 AM", title: "Action created" },
  { actor: "Maria Santos", id: "assigned", result: "SUCCESS", timestamp: "May 15, 2025 9:15 AM", title: "Assigned to Alex Brown" },
  { actor: "Alex Brown", id: "evidence", result: "SUCCESS", timestamp: "May 16, 2025 2:44 PM", title: "Evidence uploaded (3 files)" },
  { actor: "System", id: "stage", result: "PENDING", timestamp: "May 16, 2025 2:45 PM", title: "Stage changed to Analyst Reviewing" },
  { actor: "Workflow gate", id: "blocked", result: "BLOCKED", timestamp: "Now", title: "Client approval evidence missing" }
] as const;
