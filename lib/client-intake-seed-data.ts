export const clientIntakePageIds = [
  "019",
  "020",
  "021",
  "022",
  "023",
  "024",
  "025",
  "026",
  "027",
  "028",
  "029",
  "030"
] as const;

export type ClientIntakePageId = (typeof clientIntakePageIds)[number];

export function isClientIntakePageId(pageId: string): pageId is ClientIntakePageId {
  return clientIntakePageIds.includes(pageId as ClientIntakePageId);
}

export const clientWorkspace = {
  household: "Morgan Family Office",
  principal: "Alex Morgan",
  advisor: "Jordan Mitchell, CFA",
  custodian: "Apex Trust Company",
  role: "Principal / Family CFO",
  readiness: 72,
  evidenceComplete: 68
};

export const portalActions = [
  { label: "Review quarterly wealth report", meta: "Due in 5 days", status: "Open" },
  { label: "Approve trust distribution", meta: "Due in 8 days", status: "Review" },
  { label: "Update beneficiaries", meta: "Due in 12 days", status: "Pending" }
];

export const portalDecisions = [
  { label: "Consider annual gifting plan", meta: "Decision requested" },
  { label: "Approve private market allocation", meta: "Decision requested" }
];

export const missingDocuments = [
  { title: "W-9", owner: "Entity Tax Form", requested: "Requested Apr 28, 2024", tone: "red" },
  { title: "Trust Agreement", owner: "Revocable Living Trust", requested: "Requested May 2, 2024", tone: "blue" },
  { title: "Source of Funds", owner: "Bank Statement", requested: "Requested May 6, 2024", tone: "gold" }
] as const;

export const mobilePriorityActions = [
  { label: "Missing documents", detail: "3 documents needed", badge: "Required" },
  { label: "Pending decisions", detail: "2 decisions waiting", badge: "Due soon" },
  { label: "Insurance review due", detail: "Review recommended", badge: "Review" },
  { label: "Family member update", detail: "1 update requested", badge: "Update" }
];

export const profileFields = [
  { label: "Family Name", value: "Morgan" },
  { label: "Primary Contact", value: "Alex Morgan" },
  { label: "Relationship", value: "Principal" },
  { label: "Established", value: "2010" },
  { label: "Family Location", value: "Greenwich, CT, USA" },
  { label: "Citizenship / Domicile", value: "United States" },
  { label: "Advisory Relationship Since", value: "2012" },
  { label: "Engagement Model", value: "Family Office Advisory" }
];

export const governancePreferences = [
  { title: "Decision-Making", detail: "Approval thresholds and escalation", status: "Needs review" },
  { title: "Investment Governance", detail: "Beliefs, constraints and oversight", status: "Submitted" },
  { title: "Risk Governance", detail: "Risk appetite and limits", status: "Draft" },
  { title: "Communication Preferences", detail: "Reporting cadence and recipients", status: "Submitted" },
  { title: "Philanthropy and Impact", detail: "Priorities and grant governance", status: "Blocked" }
];

export const keyFamilyMembers = [
  { name: "Alex Morgan", role: "Principal", generation: "Gen 2", involvement: "Active" },
  { name: "Sarah Morgan", role: "Family Member", generation: "Gen 2", involvement: "Active" },
  { name: "James Morgan", role: "Family Member", generation: "Gen 3", involvement: "Observer" },
  { name: "Emily Morgan", role: "Family Member", generation: "Gen 3", involvement: "Observer" }
];

export const familyMembers = [
  { name: "Richard Harbor", year: "1952", role: "Patriarch", relationship: "Self", status: "Active", governance: "Trustee" },
  { name: "Eleanor Harbor", year: "1955", role: "Matriarch", relationship: "Spouse", status: "Active", governance: "Trustee, Director" },
  { name: "Jonathan Harbor", year: "1980", role: "Child", relationship: "Son", status: "Conflict", governance: "Beneficiary" },
  { name: "Lauren Harbor", year: "1982", role: "Child", relationship: "Daughter", status: "Active", governance: "Director" },
  { name: "Michael Harbor", year: "1985", role: "Child", relationship: "Son", status: "Active", governance: "Observer" },
  { name: "Harbor Family Trust", year: "2012", role: "Entity", relationship: "Trust", status: "Active", governance: "Trust" }
];

export const relationshipRows = [
  { from: "David Chen", relationship: "Spouse of", to: "Linda Chen", type: "Family", evidence: "2", status: "Verified" },
  { from: "David Chen", relationship: "Settlor of", to: "Chen Family Trust", type: "Legal", evidence: "1", status: "Conflict" },
  { from: "Chen Family Trust", relationship: "Trustee", to: "First State Bank", type: "Legal", evidence: "1", status: "Conflict" },
  { from: "David Chen", relationship: "Advisor to", to: "AlphaVest Advisors", type: "Professional", evidence: "1", status: "Verified" },
  { from: "Sophia Chen", relationship: "Beneficiary of", to: "Chen Family Trust", type: "Legal", evidence: "-", status: "Missing Evidence" }
];

export const relationshipNodes = [
  { id: "margaret", label: "Margaret Chen", detail: "Mother", x: 16, y: 10, state: "muted" },
  { id: "david", label: "David Chen", detail: "Principal", x: 38, y: 9, state: "selected" },
  { id: "linda", label: "Linda Chen", detail: "Spouse", x: 62, y: 9, state: "selected" },
  { id: "trust", label: "Chen Family Trust", detail: "Irrevocable Trust", x: 18, y: 38, state: "purple" },
  { id: "ethan", label: "Ethan Chen", detail: "Son", x: 37, y: 42, state: "muted" },
  { id: "sophia", label: "Sophia Chen", detail: "Daughter", x: 58, y: 42, state: "muted" },
  { id: "holdings", label: "Chen Holdings LLC", detail: "Holding Company", x: 8, y: 68, state: "green" },
  { id: "bank", label: "First State Bank", detail: "Trustee", x: 72, y: 66, state: "red" },
  { id: "advisor", label: "AlphaVest Advisors", detail: "Investment Advisor", x: 80, y: 28, state: "blue" }
] as const;

export const entityRows = [
  { name: "AlphaVest Holdings Ltd.", type: "Holding Company", jurisdiction: "Cayman Islands", ownership: "100%", missingDocs: "3 missing", risk: "High" },
  { name: "AlphaVest Partners LP", type: "Limited Partnership", jurisdiction: "United States", ownership: "99.2%", missingDocs: "1 missing", risk: "Medium" },
  { name: "AlphaVest Master Fund Ltd.", type: "Fund", jurisdiction: "Cayman Islands", ownership: "100%", missingDocs: "2 missing", risk: "High" },
  { name: "AV Real Estate Holdings LLC", type: "LLC", jurisdiction: "Delaware, USA", ownership: "75%", missingDocs: "All good", risk: "Medium" },
  { name: "AlphaVest SPV Series A Ltd.", type: "SPV", jurisdiction: "BVI", ownership: "100%", missingDocs: "4 missing", risk: "High" }
];

export const entityWizardSteps = [
  { label: "Entity Type", status: "complete" },
  { label: "Details", status: "current" },
  { label: "Participants", status: "upcoming" },
  { label: "Ownership", status: "upcoming" },
  { label: "Evidence", status: "upcoming" },
  { label: "Review", status: "upcoming" }
] as const;

export const entityDetail = {
  name: "Carter Family Trust",
  type: "Revocable Living Trust",
  jurisdiction: "Delaware, USA",
  inception: "May 12, 2016",
  taxId: "46-1237890",
  advisor: "Sophia Carter",
  value: "$24,682,310",
  dayChange: "+$112,430 (0.46%)"
};

export const entityParticipants = [
  { name: "Sophia Carter", role: "Trustee", access: "Full Access" },
  { name: "Michael Carter", role: "Co-Trustee", access: "Full Access" },
  { name: "Emma Carter", role: "Beneficiary", access: "View Only" },
  { name: "Liam Carter", role: "Beneficiary", access: "View Only" }
];

export const entityDocuments = [
  { name: "Trust Agreement (Executed)", status: "Missing Signature", date: "Apr 10, 2025" },
  { name: "Certificate of Trust", status: "Uploaded", date: "May 12, 2016" },
  { name: "Trust Amendment (2022)", status: "Uploaded", date: "Jun 14, 2022" }
];

export const documentRows = [
  { name: "Q1 2024 Financial Statement.pdf", type: "Financial Statement", status: "Approved", sensitivity: "Confidential", entity: "Wayne Enterprises", updated: "May 12, 2024" },
  { name: "Portfolio Holdings - Apr 2024.xlsx", type: "Portfolio Report", status: "Approved", sensitivity: "Internal", entity: "Wayne Enterprises", updated: "May 10, 2024" },
  { name: "Estate Plan Overview.docx", type: "Estate Planning", status: "In Review", sensitivity: "Confidential", entity: "Wayne Family Trust", updated: "May 8, 2024" },
  { name: "Insurance Policy Summary.pdf", type: "Insurance", status: "Approved", sensitivity: "Restricted", entity: "Bruce Wayne", updated: "May 6, 2024" },
  { name: "Tax Return 2023.pdf", type: "Tax Document", status: "Approved", sensitivity: "Highly Restricted", entity: "Bruce Wayne", updated: "May 4, 2024" },
  { name: "Investment Policy Statement.pdf", type: "Policy", status: "Approved", sensitivity: "Internal", entity: "Wayne Enterprises", updated: "May 1, 2024" }
];

export const uploadFiles = [
  { name: "Q1 2024 Financial Statements.pdf", detail: "3.4 MB", status: "Uploading", progress: "62%" },
  { name: "PortfolioReport.exe", detail: "1.2 MB", status: "File type not allowed", progress: "Blocked" }
];

export const extractionFields = [
  { section: "Document Information", fields: [["Document Type", "Account Statement", "High"], ["Statement Date", "01/03/2025", "High"], ["Reporting Period", "10/01/2024 - 12/31/2024", "Medium"], ["Source Institution", "Summit Securities", "High"]] },
  { section: "Account Information", fields: [["Account Name", "AlphaVest Family Office LLC", "High"], ["Account Number", "7X19-884221", "Medium"]] },
  { section: "Financial Summary", fields: [["Beginning Market Value", "$8,742,183.41", "High"], ["Net Contributions", "$250,000.00", "High"], ["Net Withdrawals", "$(125,000.00)", "High"], ["Net Investment Change", "$1,032,456.78", "Low"], ["Ending Market Value", "$9,899,640.19", "High"]] }
];

export const verificationEvidence = [
  { title: "Bank Statement", date: "May 21, 2025", state: "Complete" },
  { title: "W-2 Form", date: "May 21, 2025", state: "Complete" },
  { title: "ID Document", date: "May 21, 2025", state: "Complete" },
  { title: "Proof of Address", date: "May 21, 2025", state: "In review" }
];
