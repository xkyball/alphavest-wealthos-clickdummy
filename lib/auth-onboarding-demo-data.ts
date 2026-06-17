export type AuthOnboardingPageId = "001" | "002" | "003" | "004" | "005" | "006";

export type AuthIconName =
  | "audit"
  | "building"
  | "check"
  | "database"
  | "document"
  | "fingerprint"
  | "key"
  | "lock"
  | "mail"
  | "monitor"
  | "phone"
  | "scale"
  | "shield"
  | "user"
  | "users";

export type AuthFeature = {
  detail: string;
  icon: AuthIconName;
  title: string;
};

export type AuthPolicy = {
  detail: string;
  icon: AuthIconName;
  keyPoints: string[];
  title: string;
  version: string;
};

export type RoleBoundary = {
  allowed: boolean;
  label: string;
};

export const authOnboardingPageIds = ["001", "002", "003", "004", "005", "006"] as const;

export function isAuthOnboardingPageId(pageId: string): pageId is AuthOnboardingPageId {
  return authOnboardingPageIds.includes(pageId as AuthOnboardingPageId);
}

export const invitedUser = {
  email: "alex.morgan@claritycapital.com",
  fullName: "Alex Morgan",
  invitationExpires: "30 May 2025, 23:59 UTC",
  invitedBy: "Jordan Blake",
  invitedByRole: "Managing Partner",
  mfaDevice: "MacBook Pro 16",
  organization: "Clarity Capital Family Office",
  phone: "+1 (201) 555-0123",
  role: "Investment Analyst",
  roleLevel: "Member",
  team: "Investment Research",
  tenant: "Summit Ridge Capital",
  timezone: "America/New_York"
};

export const authSecurityFeatures: AuthFeature[] = [
  {
    detail: "Data in transit and at rest is protected with enterprise controls.",
    icon: "lock",
    title: "Enterprise-grade protection"
  },
  {
    detail: "Multi-factor checks help protect client workspaces and staff access.",
    icon: "fingerprint",
    title: "Strong account security"
  },
  {
    detail: "We collect only what is needed to secure access and deliver the service.",
    icon: "shield",
    title: "Privacy by design"
  },
  {
    detail: "Important access actions are monitored and available for audit review.",
    icon: "scale",
    title: "Compliance first"
  }
];

export const mfaSecurityEvents = [
  { detail: "New York, USA", time: "09:14", title: "New sign-in" },
  { detail: "No threats detected", time: "09:13", title: "Risk check passed" },
  { detail: "Authenticator app", time: "21 Aug 2024", title: "MFA enabled" }
];

export const inviteSummary = [
  { icon: "mail" as const, label: "Invited email", value: invitedUser.email },
  { icon: "building" as const, label: "Organization", value: invitedUser.organization },
  { badge: "Scoped", icon: "user" as const, label: "Role", value: invitedUser.role },
  { detail: invitedUser.invitedByRole, icon: "user" as const, label: "Invited by", value: invitedUser.invitedBy },
  { badge: "6 days left", icon: "audit" as const, label: "Invitation expires", value: invitedUser.invitationExpires }
];

export const policyDocuments: AuthPolicy[] = [
  {
    detail: "How we collect, use, store and protect personal information under POPIA.",
    icon: "shield",
    keyPoints: [
      "We collect personal information provided by you and trusted parties.",
      "We use information to provide, secure and improve WealthOS services.",
      "We do not sell personal information.",
      "You can access, correct and object to eligible processing."
    ],
    title: "Privacy Notice",
    version: "v2.1 · 15 May 2024"
  },
  {
    detail: "The terms that govern access to and use of AlphaVest WealthOS.",
    icon: "document",
    keyPoints: [
      "Access is granted only for approved roles and tenant scopes.",
      "Sensitive actions may require audit capture or second confirmation.",
      "Users must keep credentials and devices secure."
    ],
    title: "Terms of Use",
    version: "v3.0 · 10 Apr 2024"
  },
  {
    detail: "Consent to use information to deliver and improve the WealthOS service.",
    icon: "database",
    keyPoints: [
      "Service data is used to operate secure workflows.",
      "Client-visible outputs remain controlled by workflow gates.",
      "Required acknowledgements are stored separately from profile data."
    ],
    title: "Data Use Consent",
    version: "v1.4 · 01 May 2024"
  }
];

export const roleBoundaries: RoleBoundary[] = [
  { allowed: true, label: "View assigned portfolios and entities" },
  { allowed: true, label: "Run and export client reports" },
  { allowed: true, label: "Perform investment research" },
  { allowed: true, label: "Add notes and internal comments" },
  { allowed: true, label: "Collaborate with team members" },
  { allowed: false, label: "Execute trades or transactions" },
  { allowed: false, label: "Manage client access or permissions" },
  { allowed: false, label: "View billing or financial information" },
  { allowed: false, label: "Delete data or system configurations" },
  { allowed: false, label: "Invite new users or change roles" }
];

export const onboardingStepsByPage: Record<AuthOnboardingPageId, Array<{ label: string; status: "complete" | "current" | "upcoming" }>> = {
  "001": [
    { label: "Sign in", status: "current" },
    { label: "Verify", status: "upcoming" },
    { label: "Invite", status: "upcoming" },
    { label: "Complete", status: "upcoming" }
  ],
  "002": [
    { label: "Sign in", status: "complete" },
    { label: "Verify", status: "current" },
    { label: "Invite", status: "upcoming" },
    { label: "Complete", status: "upcoming" }
  ],
  "003": [
    { label: "Invitation", status: "complete" },
    { label: "Accept Invite", status: "current" },
    { label: "Verify Identity", status: "upcoming" },
    { label: "Secure Account", status: "upcoming" }
  ],
  "004": [
    { label: "Invitation", status: "complete" },
    { label: "Verify email", status: "complete" },
    { label: "Identity setup", status: "current" },
    { label: "Complete", status: "upcoming" }
  ],
  "005": [
    { label: "Welcome", status: "complete" },
    { label: "Verify identity", status: "complete" },
    { label: "Profile setup", status: "complete" },
    { label: "Agreements", status: "current" },
    { label: "Role", status: "upcoming" }
  ],
  "006": [
    { label: "Welcome", status: "complete" },
    { label: "Verify identity", status: "complete" },
    { label: "Profile setup", status: "complete" },
    { label: "Organization", status: "complete" },
    { label: "Agreements", status: "complete" },
    { label: "Role confirmation", status: "current" }
  ]
};
