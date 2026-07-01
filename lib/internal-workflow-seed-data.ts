export const internalWorkflowPageIds = ["033", "034", "035", "036", "037", "038", "039", "040"] as const;

export type InternalWorkflowPageId = (typeof internalWorkflowPageIds)[number];

export function isInternalWorkflowPageId(pageId: string): pageId is InternalWorkflowPageId {
  return internalWorkflowPageIds.includes(pageId as InternalWorkflowPageId);
}

export const internalWorkspace = {
  platform: "AlphaVest WealthOS",
  tenant: "Northbridge Family Office",
  analyst: "Alex Morgan",
  advisor: "Sarah Reynolds",
  complianceOfficer: "Sarah Chen",
  status: "Internal only"
};

export const signalQueue = [
  { id: "SIG-2025-001228", title: "Large Outflow Detected", client: "Beacon Family Office", source: "Orion", age: "10 min ago", severity: "Low", confidence: "Low", status: "Escalated" },
  { id: "SIG-2025-001229", title: "PEP / Sanctions Match", client: "Blue Horizon Ltd.", source: "World-Check", age: "28 min ago", severity: "High", confidence: "Medium", status: "New" },
  { id: "SIG-2025-001230", title: "Concentration Increase", client: "Northbridge Capital", source: "AlphaVest Analytics", age: "1 hr ago", severity: "Medium", confidence: "Medium", status: "New" },
  { id: "SIG-2025-001231", title: "Negative News Detected", client: "Brightstone Mining PLC", source: "NewsAPI", age: "2 hr ago", severity: "Low", confidence: "Low", status: "New" },
  { id: "SIG-2025-001232", title: "Covenant Risk Change", client: "Summit Growth Fund", source: "AlphaVest Credit", age: "3 hr ago", severity: "Medium", confidence: "Medium", status: "New" }
];

export const selectedSignal = {
  id: "SIG-2025-001228",
  source: "Orion Transaction Monitor",
  severity: "Low",
  confidence: "Low (38%)",
  status: "Escalated",
  timing: "10 min ago",
  dataCompleteness: "62%",
  missingElements: ["Beneficial Owner (25%)", "Purpose of Wire (13%)", "Source of funds"],
  client: "Beacon Family Office",
  account: "Beacon Family Office Investment Account",
  amount: "USD 2,450,000",
  transactionType: "Wire Transfer (Outgoing)",
  counterparty: "Global Trust Bank (Bahamas)",
  threshold: ">$1,000,000",
  lookbackWindow: "30 days",
  historicalFrequency: "0 events (prior 90 days)",
  summary:
    "Unusual large outflow detected from Beacon Family Office Investment Account to an external account at Global Trust Bank (Bahamas). Data is incomplete and must be reviewed by an analyst before any recommendation is drafted.",
  aiDraft:
    "This trigger was generated due to a large outgoing wire to a new counterparty. Request additional details to assess intent, source of funds and alignment with client activity."
};

export const signalRoutingOptions = [
  { title: "Request Data / Information", detail: "Request missing details from relationship team or client." },
  { title: "Assign to Analyst", detail: "Assign for deeper review." },
  { title: "Assign to Advisor", detail: "Route to relationship advisor." },
  { title: "Create Action", detail: "Create a follow-up action or task." },
  { title: "Dismiss", detail: "Dismiss this trigger with audit reason." }
];

export const workbenchMetrics = [
  { label: "Operational Status", value: "All Systems Normal", detail: "As of 10:24 AM ET", status: "Active" },
  { label: "Data Quality", value: "82%", detail: "+4 pts vs yesterday", status: "Good" },
  { label: "Publish Readiness", value: "68%", detail: "5 of 7 gates complete", status: "Not Ready" },
  { label: "Items Requiring Attention", value: "18", detail: "8 missing info, 6 trigger reviews", status: "Attention" },
  { label: "Drafts in Progress", value: "24", detail: "12 recommendations, 12 plans", status: "Drafts" }
];

export const clientQueue = [
  { client: "Thompson Household", value: "$12.4M", segment: "Multi-Gen", priority: "High", next: "Trigger Review", age: "15m" },
  { client: "Johnson Household", value: "$8.7M", segment: "Accumulation", priority: "High", next: "Missing Info", age: "45m" },
  { client: "White-Patterson", value: "$5.1M", segment: "Pre-Retirement", priority: "Medium", next: "Draft Review", age: "1h" },
  { client: "Robinson Household", value: "$3.9M", segment: "Retirement", priority: "Medium", next: "Trigger Review", age: "2h" },
  { client: "Martinez Household", value: "$2.2M", segment: "Accumulation", priority: "Low", next: "Data Refresh", age: "3h" }
];

export const triggerQueue = [
  { title: "Market Downturn", client: "Thompson Household", detail: "Equity drawdown > -10%", age: "15m", severity: "High" },
  { title: "Contribution Change", client: "Johnson Household", detail: "401(k) deferral decreased", age: "45m", severity: "Medium" },
  { title: "Cash Position Change", client: "White-Patterson", detail: "Cash > 20% of portfolio", age: "1h", severity: "Medium" },
  { title: "Goal Funding Gap", client: "Robinson Household", detail: "Retirement gap > 10%", age: "2h", severity: "Low" },
  { title: "RMD Upcoming", client: "Martinez Household", detail: "RMD due in 90 days", age: "3h", severity: "Low" }
];

export const draftRecommendations = [
  { client: "Thompson Household", title: "Tax-Loss Harvesting Opportunity", updated: "Updated 15m ago", status: "In Progress" },
  { client: "White-Patterson", title: "Roth Conversion Analysis", updated: "Updated 1h ago", status: "In Progress" },
  { client: "Johnson Household", title: "Retirement Savings Adjustment", updated: "Updated 2h ago", status: "In Review" },
  { client: "Robinson Household", title: "Asset Location Optimization", updated: "Updated 3h ago", status: "In Progress" }
];

export const missingInfoTasks = [
  { client: "Johnson Household", item: "Beneficiary: 2 accounts", due: "Today" },
  { client: "Thompson Household", item: "Trust Documents", due: "Today" },
  { client: "White-Patterson", item: "Risk Tolerance Update", due: "Tomorrow" },
  { client: "Martinez Household", item: "Income Verification", due: "In 2 days" }
];

export const dataQualityDomains = [
  { domain: "Client Profile", quality: "88%", trend: "+6%" },
  { domain: "Account & Holdings", quality: "84%", trend: "+3%" },
  { domain: "Transactions", quality: "77%", trend: "-2%" },
  { domain: "Plan Data", quality: "80%", trend: "+5%" },
  { domain: "Documents", quality: "81%", trend: "+4%" }
];

export const readinessChecklist = [
  { label: "Data Quality Gate", status: "Pass" },
  { label: "Missing Information Gate", status: "Pass" },
  { label: "Model Validation Gate", status: "Pass" },
  { label: "Recommendation Review Gate", status: "In Progress" },
  { label: "Compliance Review Gate", status: "Pending" },
  { label: "Approvals Gate", status: "Pending" },
  { label: "Publish Lock Gate", status: "Pending" }
];

export const workbenchHousehold = {
  name: "Thompson Household",
  value: "$12.4M",
  segment: "Multi-Generational",
  priority: "High Priority",
  nextBestAction: "Review Market Downturn Trigger",
  advisor: "Emily Carter",
  dataQuality: "74%",
  drafts: ["Tax-Loss Harvesting Opportunity"],
  missingInfo: ["Trust Documents", "Beneficiary: 2 accounts"],
  activity: ["Market downturn trigger detected", "Portfolio data refreshed", "Contribution change detected"]
};

export const triggerDetail = {
  title: "Beneficial Ownership Change Detected",
  triggerId: "TRG-2025-000348",
  status: "Escalated",
  severity: "High",
  date: "May 8, 2025 09:41 UTC",
  source: "World-Check One",
  relatedTo: "Apex Global Holdings Ltd.",
  analyst: "Aisha Verma",
  confidence: "87%",
  jurisdiction: "British Virgin Islands",
  tags: ["Ownership", "Corporate Structure", "High Risk"],
  notes:
    "Initial review indicates a change in beneficial ownership from 68% to 92% held by Sunward Investments Limited. Source documentation is incomplete and enhanced due diligence is recommended."
};

export const dataGaps = [
  { title: "Ultimate Beneficial Owner (UBO)", detail: "UBO information is incomplete.", priority: "High" },
  { title: "Source Document", detail: "Certified Incorporation Certificate not provided.", priority: "Medium" },
  { title: "Nature of Ownership", detail: "Control mechanism details not available.", priority: "Medium" }
];

export const advisorQueue = [
  { client: "James Thornton", structure: "Thornton Family Office", type: "New Recommendation", topic: "IPS Review", priority: "High", submitted: "May 14, 2025 10:24 AM", due: "May 16, 2025", status: "Pending Review" },
  { client: "Sophie Patel", structure: "Patel Family Trust", type: "Portfolio Change", topic: "Rebalance", priority: "Medium", submitted: "May 14, 2025 9:15 AM", due: "May 17, 2025", status: "Pending Review" },
  { client: "Michael Wong", structure: "Wong Investments Pty Ltd", type: "New Recommendation", topic: "Direct Investment", priority: "High", submitted: "May 13, 2025 4:42 PM", due: "May 15, 2025", status: "Overdue" },
  { client: "Emma Clarke", structure: "Clarke Super Fund", type: "Strategy Update", topic: "Asset Allocation", priority: "Medium", submitted: "May 13, 2025 11:03 AM", due: "May 19, 2025", status: "Pending Review" },
  { client: "David Chen", structure: "Chen Family Trust", type: "Cash Movement", topic: "Distribution", priority: "Low", submitted: "May 12, 2025 3:28 PM", due: "May 20, 2025", status: "Pending Review" },
  { client: "Laura Reid", structure: "Reid Family Office", type: "New Recommendation", topic: "IPS Review", priority: "Medium", submitted: "May 12, 2025 10:11 AM", due: "May 21, 2025", status: "Info Requested" }
];

export const selectedApproval = {
  client: "James Thornton",
  structure: "Thornton Family Office",
  recommendationId: "REC-2025-05-0147",
  packageType: "Strategic Planning",
  analyst: "Aisha Khan",
  created: "May 14, 2025",
  status: "Compliance Pending",
  objective: "Preserve and grow wealth across generations while generating sustainable income to support family lifestyle and philanthropic goals.",
  recommendation:
    "Implement a tax-efficient diversified portfolio aligned to a moderate risk profile, prioritize tax-loss harvesting and establish a legacy strategy using donor-advised structures.",
  dataCompleteness: "92%",
  documents: [
    "Financial plan summary",
    "Tax projection 2025-2035",
    "Estate plan overview",
    "Investment policy statement",
    "Insurance review",
    "Cash flow analysis"
  ],
  alternatives: ["Tax-Managed Direct Indexing", "Balanced Mutual Fund Approach", "Higher Equity Growth Tilt"]
};

export const complianceMetrics = [
  { label: "Total Pending", value: "137" },
  { label: "High Risk", value: "32" },
  { label: "Due <= 3 Days", value: "68" },
  { label: "Overdue", value: "12" },
  { label: "Evidence Complete", value: "85%" }
];

export const complianceQueue = [
  { id: "CMP-2025-0137", item: "Marketing Material Review", sub: "Q2 Fact Sheet", classification: "Marketing", risk: "High", advisor: "Sarah Chen", evidence: "2/3 In Progress", publish: "Not Published", due: "May 21, 2025", age: "2d" },
  { id: "CMP-2025-0136", item: "Client Communication", sub: "Market Update Email", classification: "Communications", risk: "Medium", advisor: "Michael Torres", evidence: "Complete", publish: "Draft", due: "May 24, 2025", age: "1d" },
  { id: "CMP-2025-0135", item: "New Account Review", sub: "High Net Worth Account", classification: "Onboarding", risk: "High", advisor: "David Lee", evidence: "1/4 In Progress", publish: "Not Published", due: "May 20, 2025", age: "3d" },
  { id: "CMP-2025-0134", item: "Advisory Note Review", sub: "Portfolio Change Summary", classification: "Advisory", risk: "Low", advisor: "Priya Nair", evidence: "Complete", publish: "Ready to Publish", due: "May 27, 2025", age: "0d" },
  { id: "CMP-2025-0133", item: "Referral Arrangement Review", sub: "Referral from ABC Partners", classification: "Third Party", risk: "Medium", advisor: "James Wilson", evidence: "2/5 In Progress", publish: "Not Published", due: "May 26, 2025", age: "0d" },
  { id: "CMP-2025-0132", item: "Social Media Post Review", sub: "LinkedIn Post - Market Outlook", classification: "Marketing", risk: "Low", advisor: "Sarah Chen", evidence: "Complete", publish: "Draft", due: "May 30, 2025", age: "0d" },
  { id: "CMP-2025-0131", item: "Quarterly Performance Review", sub: "Q1 2025 Performance", classification: "Performance", risk: "Medium", advisor: "Michael Torres", evidence: "3/3 Complete", publish: "Ready to Publish", due: "May 31, 2025", age: "0d" }
];

export const complianceReview = {
  title: "Client Comms - Portfolio Change Summary",
  id: "CR-2025-05-21-0087",
  client: "Northbridge Family Office",
  account: "NBFO-123456",
  producer: "Alex Morgan",
  created: "May 21, 2025 09:14 AM",
  due: "May 27, 2025 05:00 PM",
  classification: "Marketing Communication",
  regulation: "SEC Marketing Rule",
  policy: "MC-01 Marketing Communications",
  evidenceComplete: "67%",
  releaseGates: "0 of 4 gates satisfied"
};

export const evidenceChecklist = [
  { label: "Required Disclosures", status: "Complete" },
  { label: "Performance Calculation Basis", status: "Complete" },
  { label: "Risk Disclosure", status: "Missing" },
  { label: "Fair Balance / No Misleading Statements", status: "Complete" },
  { label: "Third-Party Data Evidence", status: "Partial" },
  { label: "Approval / Sign-off Evidence", status: "Missing" },
  { label: "Client Suitability Context", status: "Complete" },
  { label: "Version History / Change Log", status: "Partial" },
  { label: "Distribution / Audience", status: "Complete" }
];

export const policyChecks = [
  { policy: "MC-01 Marketing Communications", result: "Exception" },
  { policy: "MC-02 Performance Reporting", result: "Pass" },
  { policy: "MC-03 Risk Disclosure", result: "Fail" },
  { policy: "ADV-01 Advertising & Fair Dealing", result: "Pass" },
  { policy: "REC-01 Records & Retention", result: "Partial" }
];

export const auditReferences = [
  { name: "Northbridge portfolio change Q1 factsheet", status: "Included" },
  { name: "Performance calculations Q1 worksheet", status: "Partial" },
  { name: "Client communications approval email", status: "Missing" },
  { name: "Risk disclosure screenshot", status: "Missing" }
];

export const releaseChecklist = [
  "All compliance checks passed",
  "Required disclosures included",
  "Risk & suitability confirmed",
  "Documents finalised",
  "No open actions or exceptions"
];

export const releaseEvidence = [
  { label: "Review ID", value: "CR-2025-0407-0012" },
  { label: "Approved by", value: "Sophia Reynolds" },
  { label: "Approval time", value: "7 May 2025, 10:48 AM" },
  { label: "Evidence recorded", value: "Yes" },
  { label: "Audit trail", value: "Complete" }
];
