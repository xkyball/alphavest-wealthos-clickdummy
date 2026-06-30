import type { ObjectType, PermissionAction } from "@/lib/domain-types";

export type VisualMode =
  | "BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE"
  | "DOWNLOAD_CONFIRMATION_STATE"
  | "MODAL_CAPABLE_AUTH_PAGE"
  | "NORMAL_PAGE"
  | "PAGE_WITH_APPROVAL_DRAWER"
  | "PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL"
  | "PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION"
  | "PAGE_WITH_INVITE_ROLE_MODAL"
  | "PAGE_WITH_PERMISSION_MODAL"
  | "PAGE_WITH_POLICY_MODAL_AVAILABLE"
  | "PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL"
  | "PAGE_WITH_SECOND_CONFIRMATION_MODAL"
  | "PAGE_WITH_SIDE_DRAWER"
  | "PAGE_WITH_USER_DRAWER_OR_MODAL"
  | "PREVIEW_PAGE_OR_PANEL"
  | "REFERENCE_ONLY_INTERNAL_PAGE"
  | "RELEASE_CONFIRMATION_MODAL_STATE"
  | "WIZARD_OR_STEP_PAGE";

export type PageflowId =
  | "PF-A"
  | "PF-B"
  | "PF-C"
  | "PF-D"
  | "PF-E"
  | "PF-F"
  | "PF-G"
  | "PF-H"
  | "PF-I"
  | "PF-J";

export type UserWorkflowId =
  | "UF-01"
  | "UF-02"
  | "UF-03"
  | "UF-04"
  | "UF-05"
  | "UF-06"
  | "UF-07"
  | "UF-08"
  | "UF-09"
  | "UF-10"
  | "UF-11"
  | "UF-12"
  | "UF-13"
  | "UF-14";

export type NavigationGroupKey =
  | "access"
  | "platform"
  | "tenant_setup"
  | "client_workspace"
  | "wealth_actions"
  | "advisory_workflow"
  | "decisions_evidence"
  | "communication"
  | "export"
  | "operations"
  | "reference";

export type RouteScopeLabel =
  | "MVP"
  | "MVP_SUPPORT"
  | "P1_AFTER_MVP"
  | "REFERENCE_ONLY"
  | "HOLD_PENDING_DECISION";

export type ScreenRoute = {
  pageId: string;
  route: string;
  title: string;
  purpose: string;
  visualMode: VisualMode;
  visualAsset: string;
  navigationGroup: NavigationGroupKey;
  pageflowId: PageflowId;
  pageflowName: string;
  userWorkflowId: UserWorkflowId;
  workflowName: string;
  roleFamily: string;
  objectType: ObjectType;
  permissionAction: PermissionAction;
  clientVisibilitySensitive?: boolean;
};

export type RouteImplementationAccessDecision = {
  routeScope: RouteScopeLabel;
  implementationShellAccessible: boolean;
  accessMode: "FIRST_BUILD" | "REGISTERED_ONLY";
  exclusionReason?: "P1_DEFERRED" | "REFERENCE_ONLY_NO_PRODUCT_TASK" | "HOLD_PENDING_SCOPE_UNLOCK";
  safetyBoundary: "FULL_FIRST_BUILD_SCOPE" | "SCF_DO_NOT_IMPLEMENT_REGISTER";
};

export const navigationGroupLabels: Record<NavigationGroupKey, string> = {
  access: "Access",
  platform: "Platform",
  tenant_setup: "Tenant Setup",
  client_workspace: "Client Workspace",
  wealth_actions: "Wealth and Actions",
  advisory_workflow: "Advisory Work",
  decisions_evidence: "Decisions and Evidence",
  communication: "Communication",
  export: "Export",
  operations: "Operations",
  reference: "Reference"
};

export const screenRoutes = [
  {
    pageId: "001",
    route: "/login",
    title: "Authentication Login",
    purpose: "Authentication login",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-001-login.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "USER",
    permissionAction: "VIEW"
  },
  {
    pageId: "002",
    route: "/mfa",
    title: "Multi-Factor Authentication",
    purpose: "Multi-factor authentication",
    visualMode: "MODAL_CAPABLE_AUTH_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-002-mfa.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "USER",
    permissionAction: "VIEW"
  },
  {
    pageId: "003",
    route: "/onboarding/invite",
    title: "Invitation Acceptance",
    purpose: "Invitation acceptance",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-003-onboarding-invite.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "USER",
    permissionAction: "VIEW"
  },
  {
    pageId: "004",
    route: "/onboarding/identity",
    title: "Identity Setup",
    purpose: "Identity setup",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-004-onboarding-identity.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "USER",
    permissionAction: "EDIT"
  },
  {
    pageId: "005",
    route: "/onboarding/consent",
    title: "Consent and Privacy",
    purpose: "Consent and privacy acknowledgement",
    visualMode: "PAGE_WITH_POLICY_MODAL_AVAILABLE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-005-onboarding-consent.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "USER",
    permissionAction: "APPROVE"
  },
  {
    pageId: "006",
    route: "/onboarding/role-confirmation",
    title: "Role Confirmation",
    purpose: "Role confirmation",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-006-onboarding-role-confirmation.png",
    navigationGroup: "access",
    pageflowId: "PF-B",
    pageflowName: "Tenant Onboarding",
    userWorkflowId: "UF-03",
    workflowName: "User Onboarding and Consent",
    roleFamily: "Invited users",
    objectType: "ROLE",
    permissionAction: "APPROVE"
  },
  {
    pageId: "007",
    route: "/admin/platform",
    title: "Platform Settings",
    purpose: "Platform settings",
    visualMode: "PAGE_WITH_SECOND_CONFIRMATION_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Platform admin",
    objectType: "PLATFORM",
    permissionAction: "MANAGE"
  },
  {
    pageId: "008",
    route: "/admin/policies/advice-boundary",
    title: "Advice Boundary Policy",
    purpose: "Advice boundary policy",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Compliance and platform admin",
    objectType: "PERMISSION",
    permissionAction: "MANAGE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "009",
    route: "/admin/roles",
    title: "Global Role Templates",
    purpose: "Global role templates",
    visualMode: "PAGE_WITH_PERMISSION_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Platform admin",
    objectType: "ROLE",
    permissionAction: "MANAGE"
  },
  {
    pageId: "010",
    route: "/admin/security",
    title: "Security Configuration",
    purpose: "Security configuration",
    visualMode: "PAGE_WITH_SECOND_CONFIRMATION_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Security officer",
    objectType: "PERMISSION",
    permissionAction: "MANAGE"
  },
  {
    pageId: "011",
    route: "/admin/evidence-templates",
    title: "Evidence Templates",
    purpose: "Evidence templates",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Compliance and platform admin",
    objectType: "EVIDENCE_RECORD",
    permissionAction: "MANAGE"
  },
  {
    pageId: "012",
    route: "/admin/export-templates",
    title: "Export Templates and Redaction",
    purpose: "Export templates and redaction",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png",
    navigationGroup: "platform",
    pageflowId: "PF-A",
    pageflowName: "Platform Setup",
    userWorkflowId: "UF-01",
    workflowName: "Platform Policy Setup",
    roleFamily: "Privacy and platform admin",
    objectType: "EXPORT_REQUEST",
    permissionAction: "MANAGE"
  },
  {
    pageId: "013",
    route: "/admin/tenants",
    title: "Tenant List",
    purpose: "Tenant list",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Ops admin and client success",
    objectType: "TENANT",
    permissionAction: "VIEW"
  },
  {
    pageId: "014",
    route: "/tenants/new",
    title: "Create Client Tenant",
    purpose: "Create client tenant",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Ops admin and client success",
    objectType: "TENANT",
    permissionAction: "CREATE"
  },
  {
    pageId: "015",
    route: "/tenants/:id/setup",
    title: "Tenant Setup Dashboard",
    purpose: "Tenant setup dashboard",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Client success and compliance",
    objectType: "TENANT",
    permissionAction: "EDIT"
  },
  {
    pageId: "016",
    route: "/tenants/:id/team",
    title: "Assign AlphaVest Team",
    purpose: "Assign AlphaVest team",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Client success and operations",
    objectType: "TENANT",
    permissionAction: "ASSIGN"
  },
  {
    pageId: "017",
    route: "/tenants/:id/policies",
    title: "Tenant Policies",
    purpose: "Tenant policies",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Compliance and client success",
    objectType: "PERMISSION",
    permissionAction: "MANAGE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "018",
    route: "/tenants/:id/users",
    title: "Tenant Users",
    purpose: "Tenant users",
    visualMode: "PAGE_WITH_INVITE_ROLE_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png",
    navigationGroup: "tenant_setup",
    pageflowId: "PF-B",
    pageflowName: "Client Tenant Setup",
    userWorkflowId: "UF-02",
    workflowName: "Tenant Onboarding",
    roleFamily: "Client success and tenant admin",
    objectType: "USER",
    permissionAction: "INVITE"
  },
  {
    pageId: "019",
    route: "/client/home",
    title: "Client Web Dashboard",
    purpose: "Client web dashboard",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-04",
    workflowName: "Family Profile Intake",
    roleFamily: "Principal and family office users",
    objectType: "TENANT",
    permissionAction: "VIEW"
  },
  {
    pageId: "020",
    route: "/mobile",
    title: "Client Visibility",
    purpose: "Released client visibility entry",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-04",
    workflowName: "Family Profile Intake",
    roleFamily: "Principal and family office users",
    objectType: "TENANT",
    permissionAction: "VIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "021",
    route: "/client/profile",
    title: "Client Profile",
    purpose: "Client profile",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-04",
    workflowName: "Family Profile Intake",
    roleFamily: "Principal, family CFO and analyst",
    objectType: "TENANT",
    permissionAction: "VIEW"
  },
  {
    pageId: "022",
    route: "/client/family-members",
    title: "Family Members",
    purpose: "Family members",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-04",
    workflowName: "Family Profile Intake",
    roleFamily: "Principal, family CFO and analyst",
    objectType: "FAMILY_MEMBER",
    permissionAction: "VIEW"
  },
  {
    pageId: "023",
    route: "/relationships",
    title: "Relationship Map",
    purpose: "Relationship map",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-04",
    workflowName: "Family Profile Intake",
    roleFamily: "Principal, family CFO and analyst",
    objectType: "RELATIONSHIP",
    permissionAction: "VIEW"
  },
  {
    pageId: "024",
    route: "/entities",
    title: "Entity List",
    purpose: "Entity list",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-05",
    workflowName: "Entity and Asset Intake",
    roleFamily: "Principal, family CFO and advisor",
    objectType: "ENTITY",
    permissionAction: "VIEW"
  },
  {
    pageId: "025",
    route: "/entities/new",
    title: "Create Entity",
    purpose: "Create entity",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-05",
    workflowName: "Entity and Asset Intake",
    roleFamily: "Principal, family CFO and advisor",
    objectType: "ENTITY",
    permissionAction: "CREATE"
  },
  {
    pageId: "026",
    route: "/entities/:id",
    title: "Entity Detail",
    purpose: "Entity detail",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-05",
    workflowName: "Entity and Asset Intake",
    roleFamily: "Principal, family CFO and advisor",
    objectType: "ENTITY",
    permissionAction: "VIEW"
  },
  {
    pageId: "027",
    route: "/documents",
    title: "Documents List",
    purpose: "Documents list",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-D",
    pageflowName: "Document Intake",
    userWorkflowId: "UF-06",
    workflowName: "Document Upload and Verification",
    roleFamily: "Client, family CFO, analyst and compliance",
    objectType: "DOCUMENT",
    permissionAction: "VIEW"
  },
  {
    pageId: "028",
    route: "/documents/upload",
    title: "Document Upload",
    purpose: "Document upload",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-D",
    pageflowName: "Document Intake",
    userWorkflowId: "UF-06",
    workflowName: "Document Upload and Verification",
    roleFamily: "Client, family CFO and external advisor",
    objectType: "DOCUMENT",
    permissionAction: "UPLOAD"
  },
  {
    pageId: "029",
    route: "/documents/review-queue",
    title: "Extraction Review",
    purpose: "Extraction review",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-D",
    pageflowName: "Document Intake",
    userWorkflowId: "UF-06",
    workflowName: "Document Upload and Verification",
    roleFamily: "Client, family CFO and analyst",
    objectType: "DOCUMENT",
    permissionAction: "REVIEW"
  },
  {
    pageId: "030",
    route: "/documents/:id/review",
    title: "Verification Pending",
    purpose: "Verification pending",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png",
    navigationGroup: "client_workspace",
    pageflowId: "PF-D",
    pageflowName: "Document Intake",
    userWorkflowId: "UF-06",
    workflowName: "Document Upload and Verification",
    roleFamily: "Analyst and compliance",
    objectType: "DOCUMENT",
    permissionAction: "REVIEW"
  },
  {
    pageId: "031",
    route: "/wealth-map",
    title: "Live Wealth Map",
    purpose: "Live wealth map",
    visualMode: "PAGE_WITH_SIDE_DRAWER",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-031-wealth-map.png",
    navigationGroup: "wealth_actions",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-05",
    workflowName: "Entity and Asset Intake",
    roleFamily: "Principal, family CFO, analyst and advisor",
    objectType: "ENTITY",
    permissionAction: "VIEW"
  },
  {
    pageId: "032",
    route: "/actions",
    title: "Action Board",
    purpose: "Action board",
    visualMode: "PAGE_WITH_SIDE_DRAWER",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-032-actions.png",
    navigationGroup: "wealth_actions",
    pageflowId: "PF-C",
    pageflowName: "Client Profile and Structure Intake",
    userWorkflowId: "UF-05",
    workflowName: "Entity and Asset Intake",
    roleFamily: "Principal, analyst, advisor and client success",
    objectType: "ACTION_ITEM",
    permissionAction: "VIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "033",
    route: "/advisory",
    title: "Signal Review",
    purpose: "Signal / trigger review",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "Signal Review and Routing",
    roleFamily: "System and analyst",
    objectType: "TRIGGER",
    permissionAction: "REVIEW"
  },
  {
    pageId: "034",
    route: "/advisory/review-queue",
    title: "Consultant Workbench",
    purpose: "Consultant workbench",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "Signal Review and Routing",
    roleFamily: "Analyst and advisor",
    objectType: "TRIGGER",
    permissionAction: "REVIEW"
  },
  {
    pageId: "035",
    route: "/advisory/triggers/:id/review",
    title: "Trigger Detail",
    purpose: "Trigger detail / analyst notes",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "Signal Review and Routing",
    roleFamily: "Analyst and advisor",
    objectType: "TRIGGER",
    permissionAction: "REVIEW"
  },
  {
    pageId: "064",
    route: "/kyc/reviews",
    title: "KYC / AML Review",
    purpose: "KYC / AML evidence and human review",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/imagegen/B-05/kyc-review/reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-D",
    pageflowName: "Document Intake",
    userWorkflowId: "UF-06",
    workflowName: "KYC / AML Review",
    roleFamily: "Analyst and compliance",
    objectType: "DOCUMENT",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "065",
    route: "/kyc/source-of-wealth",
    title: "Source-of-Wealth Review",
    purpose: "Source-of-wealth evidence trail review",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/imagegen/B-05/source-of-wealth-review/reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "KYC / AML Review",
    roleFamily: "Analyst, advisor and compliance",
    objectType: "TRIGGER",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "066",
    route: "/suitability/profile",
    title: "Suitability Profile",
    purpose: "Suitability profile and advice-readiness gate",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-c-suitability-ips/C-04-reference-screenshots/client-profile-reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "Suitability and IPS Review",
    roleFamily: "Analyst, advisor and compliance",
    objectType: "ENGAGEMENT",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "067",
    route: "/ips/:tenantId/decision-room",
    title: "IPS / Mandate",
    purpose: "Investment policy mandate and client-visibility gate",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-c-suitability-ips/C-04-reference-screenshots/documents-reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-08",
    workflowName: "Suitability and IPS Review",
    roleFamily: "Advisor and compliance",
    objectType: "POLICY",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "068",
    route: "/reviews",
    title: "Review Calendar",
    purpose: "Review calendar and due review monitoring",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-d-review-monitoring/D-04-reference-screenshots/ops-sla-reference-catalogue.png",
    navigationGroup: "operations",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, analyst, advisor and QA",
    objectType: "REVIEW_SCHEDULE",
    permissionAction: "SCHEDULE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "069",
    route: "/reviews/:id",
    title: "Rebalance Monitoring",
    purpose: "Rebalance trigger monitoring and blocked review actions",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-d-review-monitoring/D-04-reference-screenshots/signals-reference-catalogue.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-07",
    workflowName: "Signal Review and Routing",
    roleFamily: "Analyst, advisor, operations and compliance",
    objectType: "TRIGGER",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "036",
    route: "/advisor/reviews",
    title: "Advisor Approval Queue",
    purpose: "Advisor approval queue",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-08",
    workflowName: "Advisor Approval",
    roleFamily: "Senior wealth advisor",
    objectType: "RECOMMENDATION",
    permissionAction: "APPROVE"
  },
  {
    pageId: "037",
    route: "/advisor/reviews/:id",
    title: "Advisor Approval Detail",
    purpose: "Advisor approval detail",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-08",
    workflowName: "Advisor Approval",
    roleFamily: "Senior wealth advisor",
    objectType: "RECOMMENDATION",
    permissionAction: "APPROVE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "070",
    route: "/committee/reviews",
    title: "Committee Review Queue",
    purpose: "Committee and peer review queue for high-risk advisor-approved recommendations",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-08",
    workflowName: "Committee / Peer Review",
    roleFamily: "Committee chair, peer reviewer and senior wealth advisor",
    objectType: "RECOMMENDATION",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "071",
    route: "/committee/reviews/:id/decision-room",
    title: "Committee Review Detail",
    purpose: "Committee peer review detail with votes, dissent and evidence states",
    visualMode: "NORMAL_PAGE",
    visualAsset: "artifacts/stage-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-detail-reference-app.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-E",
    pageflowName: "Trigger to Recommendation",
    userWorkflowId: "UF-08",
    workflowName: "Committee / Peer Review",
    roleFamily: "Committee chair, peer reviewer and senior wealth advisor",
    objectType: "RECOMMENDATION",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "038",
    route: "/compliance/reviews",
    title: "Compliance Queue",
    purpose: "Compliance queue",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-09",
    workflowName: "Compliance Release or Block",
    roleFamily: "Compliance officer",
    objectType: "RECOMMENDATION",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "039",
    route: "/compliance/reviews/:id/decision-room",
    title: "Compliance Review Detail",
    purpose: "Compliance review detail",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-09",
    workflowName: "Compliance Release or Block",
    roleFamily: "Compliance officer",
    objectType: "RECOMMENDATION",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "040",
    route: "/compliance/reviews/:id/release",
    title: "Release to Client",
    purpose: "Release to client",
    visualMode: "RELEASE_CONFIRMATION_MODAL_STATE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-09",
    workflowName: "Compliance Release or Block",
    roleFamily: "Compliance officer",
    objectType: "RECOMMENDATION",
    permissionAction: "RELEASE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "041",
    route: "/compliance/reviews/:id/block",
    title: "Block or Request Evidence",
    purpose: "Block / request evidence",
    visualMode: "BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-09",
    workflowName: "Compliance Release or Block",
    roleFamily: "Compliance officer",
    objectType: "RECOMMENDATION",
    permissionAction: "BLOCK",
    clientVisibilitySensitive: true
  },
  {
    pageId: "042",
    route: "/compliance/reviews/:id/audit",
    title: "Audit and Exception Log",
    purpose: "Audit / exception log",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png",
    navigationGroup: "advisory_workflow",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-09",
    workflowName: "Compliance Release or Block",
    roleFamily: "Compliance officer",
    objectType: "AUDIT_EVENT",
    permissionAction: "VIEW"
  },
  {
    pageId: "043",
    route: "/decisions",
    title: "Decision List",
    purpose: "Decision list",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-10",
    workflowName: "Client Decision",
    roleFamily: "Principal, family council and trustee",
    objectType: "DECISION",
    permissionAction: "VIEW"
  },
  {
    pageId: "044",
    route: "/decisions/:id",
    title: "Digital Decision Room",
    purpose: "Digital decision room",
    visualMode: "PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-10",
    workflowName: "Client Decision",
    roleFamily: "Principal, family council and trustee",
    objectType: "DECISION",
    permissionAction: "APPROVE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "045",
    route: "/decisions/:id/success",
    title: "Decision Submitted",
    purpose: "Decision submitted",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-F",
    pageflowName: "Compliance Release to Client Decision",
    userWorkflowId: "UF-10",
    workflowName: "Client Decision",
    roleFamily: "Principal, family council and trustee",
    objectType: "DECISION",
    permissionAction: "APPROVE"
  },
  {
    pageId: "046",
    route: "/evidence",
    title: "Evidence Vault",
    purpose: "Evidence vault",
    visualMode: "PAGE_WITH_SIDE_DRAWER",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Client, advisor, compliance and privacy",
    objectType: "EVIDENCE_RECORD",
    permissionAction: "VIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "047",
    route: "/evidence/:id/review",
    title: "Evidence Record Detail",
    purpose: "Evidence record detail",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Client, advisor, compliance and privacy",
    objectType: "EVIDENCE_RECORD",
    permissionAction: "VIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "048",
    route: "/governance",
    title: "Governance Users",
    purpose: "Governance users",
    visualMode: "PAGE_WITH_USER_DRAWER_OR_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-G",
    pageflowName: "Governance and Access",
    userWorkflowId: "UF-12",
    workflowName: "Governance Access Change",
    roleFamily: "Principal, admin, compliance and security",
    objectType: "USER",
    permissionAction: "VIEW"
  },
  {
    pageId: "049",
    route: "/governance/roles/:id",
    title: "Role Management",
    purpose: "Role management",
    visualMode: "PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-G",
    pageflowName: "Governance and Access",
    userWorkflowId: "UF-12",
    workflowName: "Governance Access Change",
    roleFamily: "Principal, admin, compliance and security",
    objectType: "ROLE",
    permissionAction: "MANAGE"
  },
  {
    pageId: "050",
    route: "/governance/access-requests/:id",
    title: "Access Requests",
    purpose: "Access requests",
    visualMode: "PAGE_WITH_APPROVAL_DRAWER",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-G",
    pageflowName: "Governance and Access",
    userWorkflowId: "UF-12",
    workflowName: "Governance Access Change",
    roleFamily: "Principal, admin, compliance and security",
    objectType: "PERMISSION",
    permissionAction: "APPROVE"
  },
  {
    pageId: "051",
    route: "/governance/audit",
    title: "Access Audit History",
    purpose: "Access audit history",
    visualMode: "PAGE_WITH_SIDE_DRAWER",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png",
    navigationGroup: "decisions_evidence",
    pageflowId: "PF-G",
    pageflowName: "Governance and Access",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, admin, compliance and security",
    objectType: "AUDIT_EVENT",
    permissionAction: "VIEW"
  },
  {
    pageId: "052",
    route: "/communication/:id/context",
    title: "Communication Centre",
    purpose: "Communication centre",
    visualMode: "PREVIEW_PAGE_OR_PANEL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png",
    navigationGroup: "communication",
    pageflowId: "PF-H",
    pageflowName: "Communication and Escalation",
    userWorkflowId: "UF-13",
    workflowName: "Communication Escalation",
    roleFamily: "Advisor, client success and client",
    objectType: "MESSAGE",
    permissionAction: "VIEW"
  },
  {
    pageId: "053",
    route: "/communication/call-trigger",
    title: "Call Trigger Matrix",
    purpose: "Call trigger matrix",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png",
    navigationGroup: "communication",
    pageflowId: "PF-H",
    pageflowName: "Communication and Escalation",
    userWorkflowId: "UF-13",
    workflowName: "Communication Escalation",
    roleFamily: "Advisor and client success",
    objectType: "MESSAGE",
    permissionAction: "SCHEDULE"
  },
  {
    pageId: "054",
    route: "/export/new",
    title: "Create Export",
    purpose: "Create export",
    visualMode: "WIZARD_OR_STEP_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png",
    navigationGroup: "export",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, advisor, compliance and privacy",
    objectType: "EXPORT_REQUEST",
    permissionAction: "CREATE"
  },
  {
    pageId: "055",
    route: "/export/:id/scope",
    title: "Export Content Selection",
    purpose: "Export content selection",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png",
    navigationGroup: "export",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, advisor, compliance and privacy",
    objectType: "EXPORT_REQUEST",
    permissionAction: "EDIT"
  },
  {
    pageId: "056",
    route: "/export/:id/redaction",
    title: "Export Protection Review",
    purpose: "Export protection review",
    visualMode: "PREVIEW_PAGE_OR_PANEL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png",
    navigationGroup: "export",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, advisor, compliance and privacy",
    objectType: "EXPORT_REQUEST",
    permissionAction: "REVIEW",
    clientVisibilitySensitive: true
  },
  {
    pageId: "057",
    route: "/export/:id/approval",
    title: "Export Preview",
    purpose: "Export preview",
    visualMode: "PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png",
    navigationGroup: "export",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, advisor, compliance and privacy",
    objectType: "EXPORT_REQUEST",
    permissionAction: "APPROVE",
    clientVisibilitySensitive: true
  },
  {
    pageId: "058",
    route: "/export/:id/download",
    title: "Export Download and Share",
    purpose: "Export download/share",
    visualMode: "DOWNLOAD_CONFIRMATION_STATE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png",
    navigationGroup: "export",
    pageflowId: "PF-I",
    pageflowName: "Export and Reporting",
    userWorkflowId: "UF-11",
    workflowName: "Evidence Review and Export",
    roleFamily: "Principal, advisor, compliance and privacy",
    objectType: "EXPORT_REQUEST",
    permissionAction: "EXPORT",
    clientVisibilitySensitive: true
  },
  {
    pageId: "059",
    route: "/ops",
    title: "Ops Queues",
    purpose: "Ops queues",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png",
    navigationGroup: "operations",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, product and QA",
    objectType: "ACTION_ITEM",
    permissionAction: "VIEW"
  },
  {
    pageId: "060",
    route: "/ops/sla/:id",
    title: "SLA and Escalation",
    purpose: "SLA and escalation",
    visualMode: "NORMAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png",
    navigationGroup: "operations",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, product and QA",
    objectType: "ACTION_ITEM",
    permissionAction: "ESCALATE"
  },
  {
    pageId: "061",
    route: "/service-blueprint",
    title: "Service Blueprint",
    purpose: "Service blueprint",
    visualMode: "REFERENCE_ONLY_INTERNAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png",
    navigationGroup: "reference",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, product and QA",
    objectType: "PLATFORM",
    permissionAction: "VIEW"
  },
  {
    pageId: "062",
    route: "/roadmap",
    title: "MVP vs Future Scope",
    purpose: "MVP vs future scope",
    visualMode: "REFERENCE_ONLY_INTERNAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png",
    navigationGroup: "reference",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, product and QA",
    objectType: "PLATFORM",
    permissionAction: "VIEW"
  },
  {
    pageId: "063",
    route: "/states",
    title: "State and Badge Reference",
    purpose: "State and badge reference",
    visualMode: "REFERENCE_ONLY_INTERNAL_PAGE",
    visualAsset: "public/reference/page_ui_v3/clean_pages/PAGE-063-states.png",
    navigationGroup: "reference",
    pageflowId: "PF-J",
    pageflowName: "Operations and Monitoring",
    userWorkflowId: "UF-14",
    workflowName: "Ops Monitoring and QA",
    roleFamily: "Operations, product and QA",
    objectType: "PLATFORM",
    permissionAction: "VIEW"
  }
] as const satisfies readonly ScreenRoute[];

export const routeRegistryCount = screenRoutes.length;

export const routeWorksetPageIds = {
  MVP: [
    "008",
    "019",
    "020",
    "027",
    "028",
    "029",
    "030",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039",
    "040",
    "041",
    "042",
    "043",
    "044",
    "045",
    "046",
    "047",
    "048",
    "049",
    "050",
    "051",
    "054",
    "055",
    "056",
    "057",
    "058",
    "059",
    "060",
    "068"
  ],
  MVP_SUPPORT: [
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "007",
    "009",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "017",
    "018",
    "021",
    "022",
    "023",
    "024",
    "025",
    "026",
    "031",
    "032",
    "069",
    "070"
  ],
  P1_AFTER_MVP: ["052", "053"],
  REFERENCE_ONLY: ["061", "062", "063"],
  HOLD_PENDING_DECISION: ["064", "065", "066", "067", "071"]
} as const satisfies Record<RouteScopeLabel, readonly string[]>;

export const routeScopeLabels: Record<RouteScopeLabel, string> = {
  MVP: "MVP",
  MVP_SUPPORT: "MVP support",
  P1_AFTER_MVP: "Deferred",
  REFERENCE_ONLY: "Reference",
  HOLD_PENDING_DECISION: "Held"
};

export const routeWorksetEntries = Object.entries(routeWorksetPageIds).flatMap(([scope, pageIds]) =>
  pageIds.map((pageId) => ({
    pageId,
    scope: scope as RouteScopeLabel
  }))
);

const routeWorksetLookup: ReadonlyMap<string, RouteScopeLabel> = new Map(
  routeWorksetEntries.map((entry) => [entry.pageId, entry.scope])
);

export function routeScopeForPageId(pageId: string): RouteScopeLabel {
  const scope = routeWorksetLookup.get(pageId);

  if (!scope) {
    throw new Error(`Route ${pageId} is missing from the locked AlphaVest route workset registry.`);
  }

  return scope;
}

export function routeImplementationAccessDecision(
  route: Pick<ScreenRoute, "pageId">
): RouteImplementationAccessDecision {
  const routeScope = routeScopeForPageId(route.pageId);

  if (routeScope === "MVP" || routeScope === "MVP_SUPPORT") {
    return {
      accessMode: "FIRST_BUILD",
      routeScope,
      implementationShellAccessible: true,
      safetyBoundary: "FULL_FIRST_BUILD_SCOPE"
    };
  }

  return {
    accessMode: "REGISTERED_ONLY",
    routeScope,
    implementationShellAccessible: false,
    exclusionReason:
      routeScope === "P1_AFTER_MVP"
        ? "P1_DEFERRED"
        : routeScope === "REFERENCE_ONLY"
          ? "REFERENCE_ONLY_NO_PRODUCT_TASK"
          : "HOLD_PENDING_SCOPE_UNLOCK",
    safetyBoundary: "SCF_DO_NOT_IMPLEMENT_REGISTER"
  };
}

export function isRouteImplementationShellAccessible(route: Pick<ScreenRoute, "pageId">) {
  return routeImplementationAccessDecision(route).implementationShellAccessible;
}

export const routeWorksetIntegrity = (() => {
  const registryPageIds = new Set(screenRoutes.map((route) => route.pageId));
  const seenPageIds = new Set<string>();
  const duplicatePageIds = new Set<string>();

  for (const entry of routeWorksetEntries) {
    if (seenPageIds.has(entry.pageId)) {
      duplicatePageIds.add(entry.pageId);
    }

    seenPageIds.add(entry.pageId);
  }

  return {
    counts: Object.fromEntries(
      Object.entries(routeWorksetPageIds).map(([scope, pageIds]) => [scope, pageIds.length])
    ) as Record<RouteScopeLabel, number>,
    missingPageIds: screenRoutes
      .map((route) => route.pageId)
      .filter((pageId) => !seenPageIds.has(pageId)),
    unknownPageIds: routeWorksetEntries
      .map((entry) => entry.pageId)
      .filter((pageId) => !registryPageIds.has(pageId)),
    duplicatePageIds: [...duplicatePageIds]
  };
})();

export const implementationScreenRoutes = screenRoutes.filter(isRouteImplementationShellAccessible);

export function routePatternToSegments(route: string) {
  return route.split("/").filter(Boolean);
}

function productFixtureSegmentFor(routeSegments: string[], segmentIndex: number) {
  const previousSegment = routeSegments[segmentIndex - 1];
  const nextSegment = routeSegments[segmentIndex + 1];
  const routePrefix = `/${routeSegments.slice(0, segmentIndex).join("/")}`;

  if (previousSegment === "tenants") return "morgan";
  if (previousSegment === "documents") return "morgan-tax-residency";
  if (previousSegment === "triggers") return "liquidity-drift";
  if (previousSegment === "reviews" && routePrefix === "/advisor/reviews") return "current";
  if (previousSegment === "reviews" && routePrefix === "/compliance/reviews") return "current";
  if (previousSegment === "reviews" && routePrefix === "/committee/reviews") return "investment-committee";
  if (previousSegment === "reviews") return "rebalance-review";
  if (previousSegment === "ips") return "mandate-review";
  if (previousSegment === "decisions") return "liquidity-governance";
  if (previousSegment === "evidence") return "decision-pack";
  if (previousSegment === "export") return "client-package";
  if (previousSegment === "sla") return "release-readiness";
  if (previousSegment === "roles") return "portfolio-manager";
  if (previousSegment === "access-requests") return "external-advisor";
  if (previousSegment === "communication") return "client-follow-up";
  if (previousSegment === "entities") return "philanthropy-trust";
  if (nextSegment === "decision-room") return "decision-room";

  return "current";
}

export function routeToSmokePath(route: string) {
  const routeSegments = routePatternToSegments(route);
  const segments = routeSegments.map((segment, index) =>
    segment.startsWith(":") ? productFixtureSegmentFor(routeSegments, index) : segment
  );

  return `/${segments.join("/")}`;
}

function staticSegmentCount(route: ScreenRoute) {
  return routePatternToSegments(route.route).filter((segment) => !segment.startsWith(":")).length;
}

const routeMatchPriority = [...screenRoutes].sort((left, right) => {
  const staticDelta = staticSegmentCount(right) - staticSegmentCount(left);

  if (staticDelta !== 0) {
    return staticDelta;
  }

  return routePatternToSegments(right.route).length - routePatternToSegments(left.route).length;
});

export function matchRouteBySegments(segments: string[]) {
  const cleanSegments = segments.filter(Boolean);

  return routeMatchPriority.find((route) => {
    const patternSegments = routePatternToSegments(route.route);

    return (
      patternSegments.length === cleanSegments.length &&
      patternSegments.every((segment, index) => {
        return segment.startsWith(":") || segment === cleanSegments[index];
      })
    );
  });
}

export const routeSmokeList = screenRoutes.map((route) => {
  const path = routeToSmokePath(route.route);

  return {
    pageId: route.pageId,
    path,
    segments: routePatternToSegments(path),
    expectedHeading: route.title,
    navigationGroup: route.navigationGroup,
    routeScope: routeScopeForPageId(route.pageId)
  };
});

export const groupedScreenRoutes = Object.entries(navigationGroupLabels).map(([key, label]) => {
  const navigationGroup = key as NavigationGroupKey;

  return {
    key: navigationGroup,
    label,
    routes: screenRoutes.filter((route) => route.navigationGroup === navigationGroup)
  };
});

export const groupedImplementationScreenRoutes = Object.entries(navigationGroupLabels).map(([key, label]) => {
  const navigationGroup = key as NavigationGroupKey;

  return {
    key: navigationGroup,
    label,
    routes: implementationScreenRoutes.filter((route) => route.navigationGroup === navigationGroup)
  };
});
