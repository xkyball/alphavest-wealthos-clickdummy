export type AdminTenantSetupPageId =
  | "007"
  | "008"
  | "009"
  | "010"
  | "011"
  | "012"
  | "013"
  | "014"
  | "015"
  | "016"
  | "017"
  | "018";

export const adminTenantSetupPageIds = [
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018"
] as const;

export function isAdminTenantSetupPageId(pageId: string): pageId is AdminTenantSetupPageId {
  return adminTenantSetupPageIds.includes(pageId as AdminTenantSetupPageId);
}

export const platformSettings = {
  auditBanner: "All platform configuration changes are audited",
  fields: [
    { label: "Platform name", value: "AlphaVest WealthOS" },
    { label: "Supported regions", value: "United States, Canada, United Kingdom" },
    { label: "Default timezone", value: "(UTC-05:00) Eastern Time" },
    { label: "Audit logs retention", value: "7 years" },
    { label: "User session retention", value: "90 days" },
    { label: "System backup retention", value: "35 days" }
  ],
  security: [
    { detail: "Restrict admin access to allowlisted IPs", enabled: false, label: "IP allowlisting" },
    { detail: "Disable end-user access during controlled windows", enabled: false, label: "Maintenance mode" },
    { detail: "Auto logout after inactivity", enabled: true, label: "Session timeout: 30 minutes" },
    { detail: "Required for sensitive actions and settings", enabled: true, label: "Require re-authentication" }
  ]
};

export const adviceMatrix = [
  { classification: "Not advice", clientReachable: "Yes", contentType: "General education", handling: "Auto-release", requiresApproval: "No", tone: "blue" },
  { classification: "Not advice", clientReachable: "Yes", contentType: "Tools and calculators", handling: "Auto-release", requiresApproval: "No", tone: "blue" },
  { classification: "Potential advice", clientReachable: "After approval", contentType: "Market insights", handling: "Gated review", requiresApproval: "Yes", tone: "gold" },
  { classification: "Advice", clientReachable: "After approval", contentType: "Model portfolios", handling: "Approval required", requiresApproval: "Yes", tone: "red" },
  { classification: "Advice", clientReachable: "After approval", contentType: "Personalised recommendations", handling: "Approval required", requiresApproval: "Yes", tone: "red" }
] as const;

export const policyVersions = [
  { date: "15 May 2024", owner: "Compliance Officer", status: "Draft", version: "v1.3" },
  { date: "02 Apr 2024", owner: "Compliance Officer", status: "Active", version: "v1.2" },
  { date: "12 Feb 2024", owner: "Compliance Officer", status: "Archived", version: "v1.1" }
];

export const roleTemplates = [
  { description: "Full platform access", name: "Super administrator", status: "Active" },
  { description: "Platform administration", name: "Administrator", status: "Active" },
  { description: "Compliance monitoring", name: "Compliance officer", status: "Edited" },
  { description: "Portfolio management", name: "Investment manager", status: "Active" },
  { description: "Research and analysis", name: "Analyst", status: "Active" },
  { description: "Read-only access", name: "Read-only auditor", status: "Active" }
];

export const permissionColumns = ["Portfolios", "Reports", "Compliance", "Admin", "Users"];
export const permissionRows = [
  { access: ["full", "full", "full", "full", "full"], role: "Super administrator" },
  { access: ["limited", "full", "full", "full", "full"], role: "Administrator" },
  { access: ["limited", "full", "full", "none", "limited"], role: "Compliance officer" },
  { access: ["limited", "none", "none", "none", "none"], role: "Analyst" }
] as const;

export const securityControls = [
  { detail: "Require MFA for all users", enabled: true, group: "Authentication", label: "Multi-factor authentication" },
  { detail: "Set required MFA strength", enabled: true, group: "Authentication", label: "MFA enforcement level" },
  { detail: "Automatically sign out idle users", enabled: true, group: "Authentication", label: "Session timeout" },
  { detail: "Restrict access to trusted devices", enabled: true, group: "Device", label: "Trusted device enforcement" },
  { detail: "Require approval for new devices", enabled: true, group: "Device", label: "Device approval required" },
  { detail: "Limit active browser sessions", enabled: true, group: "Device", label: "Concurrent sessions: 3" }
];

export const activeSessions = [
  { device: "Mac OS · Chrome", lastActive: "Now", location: "New York, US", user: "sec.officer@alphavest.com" },
  { device: "iOS · Safari", lastActive: "12m ago", location: "New York, US", user: "sec.officer@alphavest.com" },
  { device: "Windows · Edge", lastActive: "45m ago", location: "New York, US", user: "sec.officer@alphavest.com" }
];

export const evidenceTemplates = [
  { category: "KYC / AML", cycle: "12 months", id: "KYC-001", name: "Client Onboarding - KYC", required: "8", status: "Active", type: "Client Due Diligence", version: "v2.1" },
  { category: "KYC / AML", cycle: "12 months", id: "SOF-002", name: "Source of Funds Verification", required: "5", status: "Active", type: "Financial Verification", version: "v1.3" },
  { category: "Suitability", cycle: "12 months", id: "RPA-003", name: "Risk Profile Assessment", required: "6", status: "Active", type: "Client Assessment", version: "v2.0" },
  { category: "Suitability", cycle: "12 months", id: "ISR-004", name: "Investment Suitability Review", required: "7", status: "Draft", type: "Suitability Review", version: "v1.2" },
  { category: "Monitoring", cycle: "12 months", id: "APR-005", name: "Annual Portfolio Review", required: "6", status: "Active", type: "Ongoing Monitoring", version: "v1.4" },
  { category: "Operations", cycle: "Per incident", id: "INC-008", name: "Incident Response Record", required: "5", status: "Review Due", type: "Operations", version: "v1.2" }
];

export const exportTemplates = [
  { category: "Onboarding", name: "Client onboarding pack", profile: "Client Sensitive v2", status: "Active", updated: "15 May", version: "v1.3" },
  { category: "Reporting", name: "Portfolio summary", profile: "Standard Public v1", status: "Active", updated: "12 May", version: "v2.1" },
  { category: "Advisory", name: "Advisor data share", profile: "Advisor Restricted v1", status: "Blocked", updated: "05 May", version: "v1.0" },
  { category: "Compliance", name: "KYC verification bundle", profile: "KYC Masked v1", status: "Draft", updated: "01 May", version: "v1.1" }
];

export const redactionProfiles = ["Client Sensitive v2 - Active", "Standard Public v1 - Active", "PII Strict v1 - Active", "Advisor Restricted v1 - Draft"];

export const tenantRows = [
  { jurisdiction: "US", name: "Northpoint Capital Partners", owner: "James Mitchell", status: "Active", tier: "Enterprise", onboarding: "Completed" },
  { jurisdiction: "CA", name: "Bluewater Advisors", owner: "Sophia Chen", status: "Active", tier: "Professional", onboarding: "In progress" },
  { jurisdiction: "GB", name: "Veridian Wealth Group", owner: "Oliver Bennett", status: "Pending", tier: "Enterprise", onboarding: "Awaiting review" },
  { jurisdiction: "US", name: "Summit Growth Partners", owner: "Ava Rodriguez", status: "Active", tier: "Professional", onboarding: "In progress" },
  { jurisdiction: "AU", name: "Redwood Legacy Advisors", owner: "Liam Patterson", status: "Invited", tier: "Essential", onboarding: "Not started" },
  { jurisdiction: "US", name: "Pinnacle Capital Management", owner: "Emma Collins", status: "Active", tier: "Enterprise", onboarding: "Completed" }
];

export const tenantWizardSteps = {
  create: [
    { label: "Tenant details", status: "current" },
    { label: "Team setup", status: "upcoming" },
    { label: "Policy assignment", status: "upcoming" },
    { label: "Review and confirm", status: "upcoming" }
  ],
  setup: [
    { label: "Basic information", status: "complete" },
    { label: "Team setup", status: "complete" },
    { label: "Policies and security", status: "current" },
    { label: "Review and activate", status: "upcoming" }
  ]
} as const;

export const tenantSetupChecklist = [
  { item: "Tenant details and branding", owner: "Olivia Chen", readiness: "Ready", status: "Completed" },
  { item: "Primary admin and roles", owner: "Daniel Park", readiness: "Ready", status: "Completed" },
  { item: "Team and user provisioning", owner: "Maya Patel", readiness: "Ready", status: "Completed" },
  { item: "Policy framework", owner: "Jordan Lee", readiness: "Not ready", status: "Missing" },
  { item: "Security and authentication", owner: "Aisha Khan", readiness: "Ready", status: "Completed" },
  { item: "Third-party integrations", owner: "Riley Morgan", readiness: "Blocked", status: "Blocked" },
  { item: "Review and sign-off", owner: "-", readiness: "Not ready", status: "Pending" }
];

export const teamAssignments = [
  { assignee: "Michelle Carter", capacity: "Medium", role: "Advisor", status: "Good", workload: "72%" },
  { assignee: "Daniel Lee", capacity: "Medium", role: "Analyst", status: "Good", workload: "58%" },
  { assignee: "Assign compliance owner", capacity: "-", role: "Compliance Owner", status: "Missing", workload: "-" },
  { assignee: "Sophia Patel", capacity: "High", role: "Client Success Owner", status: "Good", workload: "46%" }
];

export const tenantPolicyCards = [
  { details: ["Evidence required: Yes", "Minimum evidence: Dual review", "Retention period: 7 years"], title: "Evidence Settings" },
  { details: ["Export allowed: Yes", "Formats: PDF, CSV, XLSX", "Watermarking: Enabled"], title: "Export Settings" },
  { details: ["Data minimisation: Enabled", "PII masking: Enabled", "Cross-border transfer: Restricted"], title: "Privacy Settings" },
  { details: ["Current version: v2.3.1", "Next review: 15 Aug 2024", "Review cadence: Quarterly"], title: "Policy Version" },
  { details: ["Overrides allowed: Yes", "Approval required: Compliance", "Auto-expire: Yes"], title: "Override Controls" },
  { details: ["5 pending review", "2 active", "1 expired"], title: "Override Summary" }
];

export const tenantUsers = [
  { invite: "-", name: "James Dovetail", role: "Admin", scope: "Entire organization", status: "Active" },
  { invite: "-", name: "Sarah Patel", role: "Principal, Compliance Officer", scope: "North America", status: "Active" },
  { invite: "Invited", name: "Michael Chen", role: "Client Success", scope: "Asia Pacific", status: "Invited" },
  { invite: "Pending", name: "Laura Gomez", role: "Principal", scope: "Europe", status: "Pending" },
  { invite: "-", name: "Daniel Brooks", role: "Analyst", scope: "North America", status: "Active" },
  { invite: "Pending", name: "Robert Singh", role: "Analyst", scope: "Europe", status: "Pending" },
  { invite: "-", name: "Kevin Walker", role: "Admin", scope: "Entire organization", status: "Revoked" }
];
