import "dotenv/config";

import { createHash } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdviceClassification,
  AssetType,
  AuditResult,
  CommunicationChannel,
  ComplianceStatus,
  DecisionStatus,
  DocumentStatus,
  EntityType,
  EscalationType,
  EvidenceStatus,
  ExportStatus,
  ExportType,
  ObjectType,
  PermissionAction,
  Prisma,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  RoleScope,
  Sensitivity,
  TenantStatus,
  UserStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
const appEnv = process.env.APP_ENV ?? "local";
const dataMode = process.env.ALPHAVEST_DATA_MODE ?? "demo";
const realClientDataAllowed = process.env.ALPHAVEST_REAL_CLIENT_DATA_ALLOWED === "true";
const allowDemoSeedOutsideDemo = process.env.ALPHAVEST_ALLOW_DEMO_SEED_OUTSIDE_DEMO === "true";

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Phase 03 seed.");
}

if (realClientDataAllowed) {
  throw new Error("Phase 03 seed is demo-only and must not run with real client data enabled.");
}

if ((appEnv === "production" || dataMode !== "demo") && !allowDemoSeedOutsideDemo) {
  throw new Error("Phase 03 seed requires ALPHAVEST_DATA_MODE=demo outside explicitly approved demo-seed contexts.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seedDate = new Date("2026-06-14T12:00:00.000Z");

function stableId(label: string) {
  const hash = createHash("sha1").update(`alphavest-wealthos:${label}`).digest("hex");
  const variant = ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80)
    .toString(16)
    .padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

function date(daysFromSeed: number) {
  return new Date(Date.UTC(2026, 5, 14 + daysFromSeed, 12, 0, 0));
}

function dateOnly(daysFromSeed: number) {
  return new Date(Date.UTC(2026, 5, 14 + daysFromSeed));
}

const platformId = stableId("platform:alphavest");

const roleTemplates = [
  {
    key: "principal",
    name: "Principal",
    scope: RoleScope.TENANT,
    segregationGroup: "client",
  },
  {
    key: "family_cfo",
    name: "Family CFO",
    scope: RoleScope.TENANT,
    segregationGroup: "client",
  },
  {
    key: "trustee",
    name: "Trustee",
    scope: RoleScope.ENTITY,
    segregationGroup: "client-governance",
  },
  {
    key: "next_gen",
    name: "Next Gen",
    scope: RoleScope.TENANT,
    segregationGroup: "client",
  },
  {
    key: "external_advisor",
    name: "External Advisor",
    scope: RoleScope.DOCUMENT,
    segregationGroup: "external",
  },
  {
    key: "analyst",
    name: "Analyst",
    scope: RoleScope.TENANT,
    segregationGroup: "internal-review",
  },
  {
    key: "senior_wealth_advisor",
    name: "Senior Wealth Advisor",
    scope: RoleScope.TENANT,
    segregationGroup: "advisor-review",
  },
  {
    key: "compliance_officer",
    name: "Compliance Officer",
    scope: RoleScope.TENANT,
    segregationGroup: "compliance",
  },
  {
    key: "client_success",
    name: "Client Success",
    scope: RoleScope.TENANT,
    segregationGroup: "client-ops",
  },
  {
    key: "admin",
    name: "Admin",
    scope: RoleScope.PLATFORM,
    segregationGroup: "platform-admin",
    requiresSecondConfirmation: true,
  },
  {
    key: "security_officer",
    name: "Security Officer",
    scope: RoleScope.PLATFORM,
    segregationGroup: "security",
    requiresSecondConfirmation: true,
  },
] as const;

const permissions = [
  {
    key: "platform.manage",
    objectType: ObjectType.PLATFORM,
    action: PermissionAction.MANAGE,
    requiresAudit: true,
    requiresSecondConfirmation: true,
  },
  {
    key: "tenants.create",
    objectType: ObjectType.TENANT,
    action: PermissionAction.CREATE,
    requiresAudit: true,
  },
  {
    key: "tenants.manage",
    objectType: ObjectType.TENANT,
    action: PermissionAction.MANAGE,
    requiresAudit: true,
  },
  {
    key: "users.invite",
    objectType: ObjectType.USER,
    action: PermissionAction.INVITE,
    requiresAudit: true,
  },
  {
    key: "roles.manage",
    objectType: ObjectType.ROLE,
    action: PermissionAction.MANAGE,
    requiresAudit: true,
    requiresSecondConfirmation: true,
  },
  {
    key: "documents.upload",
    objectType: ObjectType.DOCUMENT,
    action: PermissionAction.UPLOAD,
    requiresAudit: true,
  },
  {
    key: "documents.review",
    objectType: ObjectType.DOCUMENT,
    action: PermissionAction.REVIEW,
    requiresAudit: true,
  },
  {
    key: "triggers.review",
    objectType: ObjectType.TRIGGER,
    action: PermissionAction.REVIEW,
    requiresAudit: true,
  },
  {
    key: "recommendations.approve",
    objectType: ObjectType.RECOMMENDATION,
    action: PermissionAction.APPROVE,
    requiresAudit: true,
  },
  {
    key: "recommendations.release",
    objectType: ObjectType.RECOMMENDATION,
    action: PermissionAction.RELEASE,
    defaultSensitivityLimit: Sensitivity.RESTRICTED,
    requiresAudit: true,
    requiresComplianceReview: true,
  },
  {
    key: "decisions.view",
    objectType: ObjectType.DECISION,
    action: PermissionAction.VIEW,
  },
  {
    key: "decisions.comment",
    objectType: ObjectType.DECISION,
    action: PermissionAction.COMMENT,
    requiresAudit: true,
  },
  {
    key: "evidence.view",
    objectType: ObjectType.EVIDENCE_RECORD,
    action: PermissionAction.VIEW,
  },
  {
    key: "exports.create",
    objectType: ObjectType.EXPORT_REQUEST,
    action: PermissionAction.EXPORT,
    requiresAudit: true,
  },
  {
    key: "exports.approve",
    objectType: ObjectType.EXPORT_REQUEST,
    action: PermissionAction.APPROVE,
    requiresAudit: true,
    requiresComplianceReview: true,
  },
  {
    key: "audit.view",
    objectType: ObjectType.AUDIT_EVENT,
    action: PermissionAction.VIEW,
  },
  {
    key: "access.assign",
    objectType: ObjectType.PERMISSION,
    action: PermissionAction.ASSIGN,
    requiresAudit: true,
    requiresSecondConfirmation: true,
  },
] as const;

const rolePermissionKeys: Record<string, string[]> = {
  principal: ["decisions.view", "decisions.comment", "documents.upload", "evidence.view", "exports.create"],
  family_cfo: ["documents.upload", "documents.review", "decisions.view", "evidence.view", "exports.create"],
  trustee: ["decisions.view", "decisions.comment", "evidence.view"],
  next_gen: ["decisions.view", "evidence.view"],
  external_advisor: ["documents.upload", "documents.review", "evidence.view"],
  analyst: ["documents.review", "triggers.review", "evidence.view", "audit.view"],
  senior_wealth_advisor: [
    "documents.review",
    "triggers.review",
    "recommendations.approve",
    "evidence.view",
    "exports.create",
  ],
  compliance_officer: [
    "recommendations.release",
    "exports.approve",
    "audit.view",
    "evidence.view",
    "access.assign",
  ],
  client_success: ["tenants.manage", "users.invite", "documents.review", "evidence.view"],
  admin: permissions.map((permission) => permission.key),
  security_officer: ["platform.manage", "roles.manage", "access.assign", "audit.view", "exports.approve"],
};

const internalUsers = [
  {
    key: "admin",
    email: "ava.admin@alphavest.demo",
    displayName: "Ava Naidoo",
    roleKey: "admin",
  },
  {
    key: "security",
    email: "sam.security@alphavest.demo",
    displayName: "Sam Jacobs",
    roleKey: "security_officer",
  },
  {
    key: "compliance",
    email: "naledi.compliance@alphavest.demo",
    displayName: "Naledi Mokoena",
    roleKey: "compliance_officer",
  },
  {
    key: "advisor",
    email: "thabo.advisor@alphavest.demo",
    displayName: "Thabo Khumalo",
    roleKey: "senior_wealth_advisor",
  },
  {
    key: "analyst",
    email: "mira.analyst@alphavest.demo",
    displayName: "Mira Patel",
    roleKey: "analyst",
  },
  {
    key: "success",
    email: "lina.success@alphavest.demo",
    displayName: "Lina Botha",
    roleKey: "client_success",
  },
  {
    key: "system",
    email: "system@alphavest.demo",
    displayName: "AlphaVest System",
    roleKey: "admin",
    isServiceAccount: true,
  },
] as const;

const demoTenants = [
  {
    slug: "bennett",
    displayName: "Bennett Family Office",
    legalName: "Bennett Family Office (Pty) Ltd",
    status: TenantStatus.ACTIVE,
    jurisdiction: "South Africa",
    relationshipTier: "Premier",
    dataRegion: "ZA",
    riskRating: "Moderate",
    principalLastName: "Bennett",
    trustName: "Bennett Legacy Trust",
    companyName: "Bennett Holdings",
    decisionStatus: DecisionStatus.ACCEPTED,
    recommendationStatus: RecommendationStatus.RELEASED_TO_CLIENT,
    complianceStatus: ComplianceStatus.RELEASED,
    evidenceStatus: EvidenceStatus.RELEASED,
    recommendationClientVisible: true,
    evidenceVisibility: VisibilityStatus.CLIENT_VISIBLE,
  },
  {
    slug: "morgan",
    displayName: "Morgan Family Office",
    legalName: "Morgan Family Office LLP",
    status: TenantStatus.ONBOARDING,
    jurisdiction: "United Kingdom",
    relationshipTier: "Signature",
    dataRegion: "EU",
    riskRating: "Medium",
    principalLastName: "Morgan",
    trustName: "Morgan Settlement Trust",
    companyName: "Morgan Ventures",
    decisionStatus: DecisionStatus.DEFERRED,
    recommendationStatus: RecommendationStatus.COMPLIANCE_PENDING,
    complianceStatus: ComplianceStatus.NEEDS_EVIDENCE,
    evidenceStatus: EvidenceStatus.PLACEHOLDER,
    recommendationClientVisible: false,
    evidenceVisibility: VisibilityStatus.COMPLIANCE_VISIBLE,
  },
  {
    slug: "northbridge",
    displayName: "Northbridge Family Office",
    legalName: "Northbridge Family Office AG",
    status: TenantStatus.ACTIVE,
    jurisdiction: "Switzerland",
    relationshipTier: "Institutional",
    dataRegion: "CH",
    riskRating: "High",
    principalLastName: "North",
    trustName: "Northbridge Foundation",
    companyName: "Northbridge Capital AG",
    decisionStatus: DecisionStatus.REJECTED,
    recommendationStatus: RecommendationStatus.BLOCKED,
    complianceStatus: ComplianceStatus.BLOCKED,
    evidenceStatus: EvidenceStatus.RESTRICTED,
    recommendationClientVisible: false,
    evidenceVisibility: VisibilityStatus.RESTRICTED,
  },
  {
    slug: "summit",
    displayName: "Summit Ridge Capital",
    legalName: "Summit Ridge Capital LLC",
    status: TenantStatus.ACTIVE,
    jurisdiction: "United States",
    relationshipTier: "Enterprise",
    dataRegion: "US",
    riskRating: "Medium",
    principalLastName: "Ridge",
    trustName: "Summit Ridge Trust",
    companyName: "Summit Ridge Capital LLC",
    decisionStatus: DecisionStatus.RELEASED_TO_CLIENT,
    recommendationStatus: RecommendationStatus.ADVISOR_APPROVED,
    complianceStatus: ComplianceStatus.PENDING,
    evidenceStatus: EvidenceStatus.VALIDATED,
    recommendationClientVisible: false,
    evidenceVisibility: VisibilityStatus.ADVISOR_VISIBLE,
  },
] as const;

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function roleId(key: string) {
  return stableId(`role:${key}`);
}

function permissionId(key: string) {
  return stableId(`permission:${key}`);
}

function entityId(slug: string, key: string) {
  return stableId(`entity:${slug}:${key}`);
}

function familyMemberId(slug: string, key: string) {
  return stableId(`family:${slug}:${key}`);
}

function engagementId(slug: string) {
  return stableId(`engagement:${slug}:annual-governance-review`);
}

function documentId(slug: string, key: string) {
  return stableId(`document:${slug}:${key}`);
}

function triggerId(slug: string, key: string) {
  return stableId(`trigger:${slug}:${key}`);
}

function recommendationId(slug: string) {
  return stableId(`recommendation:${slug}:liquidity-review`);
}

function approvalId(slug: string) {
  return stableId(`approval:${slug}:advisor`);
}

function complianceReviewId(slug: string) {
  return stableId(`compliance:${slug}:liquidity-review`);
}

function decisionId(slug: string) {
  return stableId(`decision:${slug}:liquidity-review`);
}

function evidenceRecordId(slug: string) {
  return stableId(`evidence:${slug}:decision-pack`);
}

async function clearDemoData() {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.messageThread.deleteMany(),
    prisma.callEvent.deleteMany(),
    prisma.exportRequest.deleteMany(),
    prisma.queueItem.deleteMany(),
    prisma.dataQualityIssue.deleteMany(),
    prisma.reviewSchedule.deleteMany(),
    prisma.evidenceItem.deleteMany(),
    prisma.evidenceRecord.deleteMany(),
    prisma.decisionParticipant.deleteMany(),
    prisma.decision.deleteMany(),
    prisma.complianceReview.deleteMany(),
    prisma.approval.deleteMany(),
    prisma.recommendationOption.deleteMany(),
    prisma.recommendation.deleteMany(),
    prisma.actionItem.deleteMany(),
    prisma.trigger.deleteMany(),
    prisma.documentLink.deleteMany(),
    prisma.documentReview.deleteMany(),
    prisma.documentExtraction.deleteMany(),
    prisma.documentVersion.deleteMany(),
    prisma.document.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.entityParticipant.deleteMany(),
    prisma.entity.deleteMany(),
    prisma.clientObjective.deleteMany(),
    prisma.relationship.deleteMany(),
    prisma.familyMember.deleteMany(),
    prisma.engagement.deleteMany(),
    prisma.consentRecord.deleteMany(),
    prisma.secondConfirmation.deleteMany(),
    prisma.accessRequest.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.policyDefinition.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.userProfile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.auditEvent.deleteMany(),
    prisma.clientTenant.deleteMany(),
    prisma.platformTenant.deleteMany(),
  ]);
}

async function seedPlatform() {
  await prisma.platformTenant.create({
    data: {
      id: platformId,
      name: "AlphaVest WealthOS",
      legalName: "AlphaVest WealthOS Demo Platform",
      status: TenantStatus.ACTIVE,
      defaultTimezone: "Africa/Johannesburg",
      defaultLocale: "en-ZA",
      createdAt: seedDate,
      updatedAt: seedDate,
    },
  });

  await prisma.user.createMany({
    data: internalUsers.map((user) => ({
      id: userId(user.key),
      platformTenantId: platformId,
      email: user.email,
      displayName: user.displayName,
      status: UserStatus.ACTIVE,
      mfaEnabled: user.key !== "system",
      preferredLocale: "en-ZA",
      timezone: "Africa/Johannesburg",
      isServiceAccount: Boolean("isServiceAccount" in user && user.isServiceAccount),
      lastLoginAt: user.key === "system" ? null : date(-1),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.role.createMany({
    data: roleTemplates.map((role) => ({
      id: roleId(role.key),
      platformTenantId: platformId,
      key: role.key,
      name: role.name,
      description: `${role.name} demo role for AlphaVest WealthOS.`,
      scope: role.scope,
      isSystemRole: true,
      requiresSecondConfirmation: Boolean("requiresSecondConfirmation" in role && role.requiresSecondConfirmation),
      segregationGroup: role.segregationGroup,
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.permission.createMany({
    data: permissions.map((permission) => ({
      id: permissionId(permission.key),
      key: permission.key,
      objectType: permission.objectType,
      action: permission.action,
      description: `Allows ${permission.action.toLowerCase()} on ${permission.objectType.toLowerCase()} objects.`,
      defaultSensitivityLimit: "defaultSensitivityLimit" in permission ? permission.defaultSensitivityLimit : null,
      requiresAudit: Boolean("requiresAudit" in permission && permission.requiresAudit),
      requiresSecondConfirmation: Boolean(
        "requiresSecondConfirmation" in permission && permission.requiresSecondConfirmation
      ),
      requiresComplianceReview: Boolean("requiresComplianceReview" in permission && permission.requiresComplianceReview),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.rolePermission.createMany({
    data: Object.entries(rolePermissionKeys).flatMap(([roleKey, permissionKeys]) =>
      permissionKeys.map((permissionKey) => ({
        id: stableId(`role-permission:${roleKey}:${permissionKey}`),
        roleId: roleId(roleKey),
        permissionId: permissionId(permissionKey),
        effect: "allow",
        conditionJson: {
          demo: true,
          tenantScoped: !["admin", "security_officer"].includes(roleKey),
        },
        createdAt: seedDate,
      }))
    ),
  });

  await prisma.userRole.createMany({
    data: internalUsers.map((user) => ({
      id: stableId(`user-role:${user.key}:${user.roleKey}:platform`),
      userId: userId(user.key),
      roleId: roleId(user.roleKey),
      status: "active",
      validFrom: seedDate,
      assignedByUserId: userId("admin"),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.policyDefinition.createMany({
    data: [
      {
        id: stableId("policy:platform:advice-boundary:v1"),
        platformTenantId: platformId,
        policyKey: "advice.boundary",
        name: "No Unapproved Advice Boundary",
        version: "2026.06",
        category: "advice_boundary",
        rulesJson: {
          clientVisibleRequires: ["advisorApproval", "complianceRelease", "evidenceRecord", "permissionCheck"],
          advisorApprovalAloneIsInsufficient: true,
        },
        status: "active",
        createdByUserId: userId("compliance"),
        effectiveFrom: dateOnly(-30),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId("policy:platform:evidence:v1"),
        platformTenantId: platformId,
        policyKey: "evidence.default",
        name: "Evidence by Default",
        version: "2026.06",
        category: "evidence",
        rulesJson: {
          majorActionsCreateEvidence: true,
          auditRetentionYears: 7,
        },
        status: "active",
        createdByUserId: userId("admin"),
        effectiveFrom: dateOnly(-30),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId("policy:platform:export:v1"),
        platformTenantId: platformId,
        policyKey: "export.redaction",
        name: "Export Redaction Defaults",
        version: "2026.06",
        category: "export",
        rulesJson: {
          defaultProfile: "client-visible",
          externalExportsExpireDays: 14,
          watermarkRequired: true,
        },
        status: "active",
        createdByUserId: userId("security"),
        effectiveFrom: dateOnly(-30),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ],
  });
}

async function seedTenants() {
  await prisma.clientTenant.createMany({
    data: demoTenants.map((tenant, index) => ({
      id: tenantId(tenant.slug),
      platformTenantId: platformId,
      displayName: tenant.displayName,
      legalName: tenant.legalName,
      status: tenant.status,
      jurisdiction: tenant.jurisdiction,
      relationshipTier: tenant.relationshipTier,
      primaryAdvisorUserId: userId("advisor"),
      primaryAnalystUserId: userId("analyst"),
      complianceOwnerUserId: userId("compliance"),
      clientSuccessOwnerUserId: userId("success"),
      policyProfileId: stableId(`policy-profile:${tenant.slug}`),
      dataRegion: tenant.dataRegion,
      riskRating: tenant.riskRating,
      onboardingCompletedAt: tenant.status === TenantStatus.ONBOARDING ? null : date(-20 + index),
      createdAt: date(-60 + index),
      updatedAt: seedDate,
    })),
  });

  await prisma.policyDefinition.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`policy:${tenant.slug}:privacy:v1`),
        platformTenantId: platformId,
        clientTenantId: tenantId(tenant.slug),
        policyKey: "privacy.popia",
        name: `${tenant.displayName} Privacy Notice`,
        version: "2026.06",
        category: "privacy",
        rulesJson: {
          region: tenant.dataRegion,
          consentRequired: true,
          sensitiveAccessReview: true,
        },
        status: "active",
        createdByUserId: userId("compliance"),
        effectiveFrom: dateOnly(-20),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`policy:${tenant.slug}:retention:v1`),
        platformTenantId: platformId,
        clientTenantId: tenantId(tenant.slug),
        policyKey: "retention.documents",
        name: `${tenant.displayName} Document Retention`,
        version: "2026.06",
        category: "retention",
        rulesJson: {
          defaultRetentionYears: 7,
          highSensitivityReviewMonths: 6,
        },
        status: "active",
        createdByUserId: userId("admin"),
        effectiveFrom: dateOnly(-20),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.user.createMany({
    data: demoTenants.flatMap((tenant) =>
      [
        ["principal", `${tenant.principalLastName} Principal`, "principal"],
        ["cfo", `${tenant.principalLastName} Family CFO`, "family_cfo"],
        ["trustee", `${tenant.principalLastName} Trustee`, "trustee"],
        ["nextgen", `${tenant.principalLastName} Next Gen`, "next_gen"],
        ["external", `${tenant.principalLastName} External Advisor`, "external_advisor"],
      ].map(([personKey, displayName]) => ({
        id: userId(`${tenant.slug}:${personKey}`),
        platformTenantId: platformId,
        email: `${personKey}.${tenant.slug}@example.demo`,
        displayName,
        status: personKey === "nextgen" && tenant.slug === "morgan" ? UserStatus.INVITED : UserStatus.ACTIVE,
        mfaEnabled: personKey !== "nextgen",
        preferredLocale: "en-ZA",
        timezone: tenant.slug === "summit" ? "America/New_York" : "Africa/Johannesburg",
        isServiceAccount: false,
        lastLoginAt: personKey === "nextgen" && tenant.slug === "morgan" ? null : date(-2),
        createdAt: seedDate,
        updatedAt: seedDate,
      }))
    ),
  });

  await prisma.userProfile.createMany({
    data: demoTenants.flatMap((tenant) =>
      [
        ["principal", "Principal"],
        ["cfo", "Family CFO"],
        ["trustee", "Trustee"],
        ["nextgen", "Next Gen"],
        ["external", "External Advisor"],
      ].map(([personKey, relationshipLabel]) => ({
        id: stableId(`profile:${tenant.slug}:${personKey}`),
        userId: userId(`${tenant.slug}:${personKey}`),
        clientTenantId: tenantId(tenant.slug),
        firstName: `${tenant.principalLastName}`,
        lastName: relationshipLabel,
        phone: "+27 10 555 0100",
        relationshipLabel,
        countryOfResidence: tenant.jurisdiction,
        dateOfBirth: personKey === "nextgen" ? dateOnly(-9500) : dateOnly(-16000),
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      }))
    ),
  });

  await prisma.userRole.createMany({
    data: demoTenants.flatMap((tenant) => {
      const clientRoleAssignments = [
        ["principal", "principal"],
        ["cfo", "family_cfo"],
        ["trustee", "trustee"],
        ["nextgen", "next_gen"],
        ["external", "external_advisor"],
      ];
      const internalRoleAssignments = [
        ["advisor", "senior_wealth_advisor"],
        ["analyst", "analyst"],
        ["compliance", "compliance_officer"],
        ["success", "client_success"],
      ];

      return [
        ...clientRoleAssignments.map(([personKey, roleKey]) => ({
          id: stableId(`user-role:${tenant.slug}:${personKey}:${roleKey}`),
          userId: userId(`${tenant.slug}:${personKey}`),
          roleId: roleId(roleKey),
          clientTenantId: tenantId(tenant.slug),
          status: personKey === "nextgen" && tenant.slug === "morgan" ? "pending" : "active",
          validFrom: seedDate,
          assignedByUserId: userId("admin"),
          createdAt: seedDate,
          updatedAt: seedDate,
        })),
        ...internalRoleAssignments.map(([internalKey, roleKey]) => ({
          id: stableId(`user-role:${tenant.slug}:${internalKey}:${roleKey}`),
          userId: userId(internalKey),
          roleId: roleId(roleKey),
          clientTenantId: tenantId(tenant.slug),
          status: "active",
          validFrom: seedDate,
          assignedByUserId: userId("admin"),
          createdAt: seedDate,
          updatedAt: seedDate,
        })),
      ];
    }),
  });
}

async function seedClientContext() {
  await prisma.consentRecord.createMany({
    data: demoTenants.flatMap((tenant) =>
      ["principal", "cfo", "trustee"].map((personKey) => ({
        id: stableId(`consent:${tenant.slug}:${personKey}:privacy`),
        clientTenantId: tenantId(tenant.slug),
        userId: userId(`${tenant.slug}:${personKey}`),
        consentType: "privacy_notice",
        version: "2026.06",
        status: "accepted",
        acceptedAt: date(-14),
        source: "web",
        ipAddress: "192.0.2.10",
        createdAt: date(-14),
      }))
    ),
  });

  await prisma.familyMember.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: familyMemberId(tenant.slug, "principal"),
        clientTenantId: tenantId(tenant.slug),
        userId: userId(`${tenant.slug}:principal`),
        displayName: `${tenant.principalLastName} Principal`,
        relationshipType: "Principal",
        dateOfBirth: dateOnly(-18500),
        taxResidency: tenant.jurisdiction,
        isPrincipal: true,
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: familyMemberId(tenant.slug, "spouse"),
        clientTenantId: tenantId(tenant.slug),
        displayName: `${tenant.principalLastName} Spouse`,
        relationshipType: "Spouse",
        dateOfBirth: dateOnly(-17800),
        taxResidency: tenant.jurisdiction,
        isPrincipal: false,
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: familyMemberId(tenant.slug, "cfo"),
        clientTenantId: tenantId(tenant.slug),
        userId: userId(`${tenant.slug}:cfo`),
        displayName: `${tenant.principalLastName} Family CFO`,
        relationshipType: "Family CFO",
        dateOfBirth: dateOnly(-15000),
        taxResidency: tenant.jurisdiction,
        isPrincipal: false,
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: familyMemberId(tenant.slug, "nextgen"),
        clientTenantId: tenantId(tenant.slug),
        userId: userId(`${tenant.slug}:nextgen`),
        displayName: `${tenant.principalLastName} Next Gen`,
        relationshipType: "Child",
        dateOfBirth: dateOnly(-9200),
        taxResidency: tenant.jurisdiction,
        isPrincipal: false,
        sensitivity: Sensitivity.RESTRICTED,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.clientObjective.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`objective:${tenant.slug}:succession`),
        clientTenantId: tenantId(tenant.slug),
        ownerFamilyMemberId: familyMemberId(tenant.slug, "principal"),
        category: "succession",
        title: "Refresh succession readiness",
        description: "Confirm trustee powers, beneficiaries and next-generation briefing cadence.",
        priority: "high",
        timeHorizon: "12 months",
        status: WorkflowStatus.IN_REVIEW,
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`objective:${tenant.slug}:liquidity`),
        clientTenantId: tenantId(tenant.slug),
        ownerFamilyMemberId: familyMemberId(tenant.slug, "cfo"),
        category: "liquidity",
        title: "Maintain liquidity buffer",
        description: "Keep governance-approved liquidity available for capital calls and obligations.",
        priority: "medium",
        timeHorizon: "6 months",
        status: WorkflowStatus.NEW,
        sensitivity: Sensitivity.CLIENT_VISIBLE,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.relationship.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`relationship:${tenant.slug}:principal-spouse`),
        clientTenantId: tenantId(tenant.slug),
        subjectType: ObjectType.FAMILY_MEMBER,
        subjectId: familyMemberId(tenant.slug, "principal"),
        relationshipType: "Spouse",
        objectType: ObjectType.FAMILY_MEMBER,
        objectId: familyMemberId(tenant.slug, "spouse"),
        confidence: new Prisma.Decimal("99.00"),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`relationship:${tenant.slug}:principal-nextgen`),
        clientTenantId: tenantId(tenant.slug),
        subjectType: ObjectType.FAMILY_MEMBER,
        subjectId: familyMemberId(tenant.slug, "principal"),
        relationshipType: "Parent",
        objectType: ObjectType.FAMILY_MEMBER,
        objectId: familyMemberId(tenant.slug, "nextgen"),
        confidence: new Prisma.Decimal("96.50"),
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });
}

async function seedStructureAndDocuments() {
  await prisma.engagement.createMany({
    data: demoTenants.map((tenant, index) => ({
      id: engagementId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      name: "Annual governance review 2026",
      type: "governance_review",
      status: index === 1 ? WorkflowStatus.AWAITING_INFO : WorkflowStatus.IN_REVIEW,
      ownerUserId: userId("advisor"),
      advisorUserId: userId("advisor"),
      analystUserId: userId("analyst"),
      complianceUserId: userId("compliance"),
      startDate: dateOnly(-30),
      targetEndDate: dateOnly(45 + index),
      sensitivity: Sensitivity.CONFIDENTIAL,
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.entity.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: entityId(tenant.slug, "trust"),
        clientTenantId: tenantId(tenant.slug),
        entityType: tenant.slug === "northbridge" ? EntityType.FOUNDATION : EntityType.TRUST,
        name: tenant.trustName,
        jurisdiction: tenant.jurisdiction,
        registrationNumber: `TR-${tenant.slug.toUpperCase()}-2026`,
        status: "active",
        ownerSummary: "Primary family governance vehicle.",
        riskRating: tenant.riskRating,
        dataQualityScore: tenant.slug === "morgan" ? 68 : 88,
        sensitivity: Sensitivity.RESTRICTED,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: entityId(tenant.slug, "company"),
        clientTenantId: tenantId(tenant.slug),
        entityType: EntityType.COMPANY,
        name: tenant.companyName,
        jurisdiction: tenant.jurisdiction,
        registrationNumber: `CO-${tenant.slug.toUpperCase()}-001`,
        status: "active",
        ownerSummary: "Operating and investment holding company.",
        riskRating: "Medium",
        dataQualityScore: tenant.slug === "northbridge" ? 61 : 82,
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.entityParticipant.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`entity-participant:${tenant.slug}:principal-trustee`),
        clientTenantId: tenantId(tenant.slug),
        entityId: entityId(tenant.slug, "trust"),
        participantType: ObjectType.FAMILY_MEMBER,
        participantId: familyMemberId(tenant.slug, "principal"),
        roleLabel: "Founder trustee",
        effectiveFrom: dateOnly(-3650),
        createdAt: seedDate,
      },
      {
        id: stableId(`entity-participant:${tenant.slug}:company-owner`),
        clientTenantId: tenantId(tenant.slug),
        entityId: entityId(tenant.slug, "company"),
        participantType: ObjectType.ENTITY,
        participantId: entityId(tenant.slug, "trust"),
        roleLabel: "Shareholder",
        ownershipPercent: new Prisma.Decimal("75.000"),
        effectiveFrom: dateOnly(-2500),
        createdAt: seedDate,
      },
    ]),
  });

  await prisma.asset.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`asset:${tenant.slug}:portfolio`),
        clientTenantId: tenantId(tenant.slug),
        entityId: entityId(tenant.slug, "trust"),
        assetType: AssetType.PORTFOLIO,
        name: `${tenant.displayName} multi-asset portfolio`,
        jurisdiction: tenant.jurisdiction,
        currency: tenant.slug === "summit" ? "USD" : "ZAR",
        valueBand: "50m-100m",
        estimatedValue: new Prisma.Decimal(tenant.slug === "northbridge" ? "95000000.00" : "62000000.00"),
        valuationDate: dateOnly(-10),
        riskRating: "Medium",
        status: "active",
        sensitivity: Sensitivity.RESTRICTED,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`asset:${tenant.slug}:liquidity`),
        clientTenantId: tenantId(tenant.slug),
        entityId: entityId(tenant.slug, "company"),
        assetType: AssetType.BANK_ACCOUNT,
        name: `${tenant.displayName} liquidity reserve`,
        jurisdiction: tenant.jurisdiction,
        currency: tenant.slug === "summit" ? "USD" : "ZAR",
        valueBand: "10m-25m",
        estimatedValue: new Prisma.Decimal("14500000.00"),
        valuationDate: dateOnly(-5),
        riskRating: "Low",
        status: "active",
        sensitivity: Sensitivity.CONFIDENTIAL,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.document.createMany({
    data: demoTenants.flatMap((tenant, index) => [
      {
        id: documentId(tenant.slug, "trust-deed"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId(`${tenant.slug}:cfo`),
        documentType: "trust_deed",
        title: `${tenant.trustName} deed`,
        status: DocumentStatus.LINKED_TO_EVIDENCE,
        fileName: `${tenant.slug}-trust-deed.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 842000 + index,
        storageKey: `demo/${tenant.slug}/trust-deed.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:trust-deed`).digest("hex"),
        source: "upload",
        sensitivity: Sensitivity.RESTRICTED,
        clientVisible: true,
        retentionPolicy: "trust_records_7y",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: documentId(tenant.slug, "statement"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId(`${tenant.slug}:external`),
        documentType: "portfolio_statement",
        title: `${tenant.displayName} Q2 portfolio statement`,
        status: tenant.slug === "morgan" ? DocumentStatus.NEEDS_CLARIFICATION : DocumentStatus.AI_EXTRACTED,
        fileName: `${tenant.slug}-q2-statement.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 512000 + index,
        storageKey: `demo/${tenant.slug}/q2-statement.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:statement`).digest("hex"),
        source: "external_advisor",
        sensitivity: Sensitivity.CONFIDENTIAL,
        clientVisible: false,
        retentionPolicy: "statements_7y",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: documentId(tenant.slug, "missing-tax"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId(`${tenant.slug}:principal`),
        documentType: "tax_residency_certificate",
        title: `${tenant.displayName} tax residency certificate`,
        status: tenant.slug === "summit" ? DocumentStatus.UPLOADING : DocumentStatus.EMPTY,
        source: "client",
        sensitivity: Sensitivity.CONFIDENTIAL,
        clientVisible: false,
        retentionPolicy: "tax_records_7y",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: documentId(tenant.slug, "p2-tax-residency-2026"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId(`${tenant.slug}:cfo`),
        documentType: "tax_residency_certificate",
        title: `${tenant.displayName} 2026 Tax Residency Certificate`,
        status: DocumentStatus.ANALYST_REVIEW_PENDING,
        fileName: `${tenant.slug}-tax-residency-2026.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 384000 + index,
        storageKey: `demo/${tenant.slug}/tax-residency-2026.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-tax-residency-2026`).digest("hex"),
        source: "client",
        sensitivity: Sensitivity.CONFIDENTIAL,
        clientVisible: false,
        retentionPolicy: "tax_records_7y",
        createdAt: date(-7),
        updatedAt: date(-7),
      },
      {
        id: documentId(tenant.slug, "p2-source-of-funds"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId(`${tenant.slug}:external`),
        documentType: "source_of_funds",
        title: `${tenant.displayName} Source of Funds Review`,
        status: tenant.slug === "northbridge" ? DocumentStatus.NEEDS_CLARIFICATION : DocumentStatus.AI_EXTRACTED,
        fileName: `${tenant.slug}-source-of-funds-review.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 618000 + index,
        storageKey: `demo/${tenant.slug}/source-of-funds-review.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-source-of-funds`).digest("hex"),
        source: "external_advisor",
        sensitivity: Sensitivity.RESTRICTED,
        clientVisible: false,
        retentionPolicy: "source_of_funds_7y",
        createdAt: date(-6),
        updatedAt: date(-6),
      },
      {
        id: documentId(tenant.slug, "p2-ips-risk-addendum"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        uploadedByUserId: userId("analyst"),
        documentType: "ips_risk_addendum",
        title: `${tenant.displayName} IPS Risk Addendum`,
        status: tenant.slug === "bennett" ? DocumentStatus.NEEDS_CLARIFICATION : DocumentStatus.VERIFIED,
        fileName: `${tenant.slug}-ips-risk-addendum.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 472000 + index,
        storageKey: `demo/${tenant.slug}/ips-risk-addendum.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-ips-risk-addendum`).digest("hex"),
        source: "analyst_review",
        sensitivity: Sensitivity.HIGHLY_RESTRICTED,
        clientVisible: false,
        retentionPolicy: "advice_evidence_7y",
        createdAt: date(-5),
        updatedAt: date(-5),
      },
    ]),
  });

  await prisma.documentVersion.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`document-version:${tenant.slug}:trust-deed:1`),
        documentId: documentId(tenant.slug, "trust-deed"),
        versionNumber: 1,
        storageKey: `demo/${tenant.slug}/trust-deed.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:trust-deed:v1`).digest("hex"),
        createdByUserId: userId(`${tenant.slug}:cfo`),
        changeReason: "Initial seed upload",
        createdAt: seedDate,
      },
      {
        id: stableId(`document-version:${tenant.slug}:statement:1`),
        documentId: documentId(tenant.slug, "statement"),
        versionNumber: 1,
        storageKey: `demo/${tenant.slug}/q2-statement.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:statement:v1`).digest("hex"),
        createdByUserId: userId(`${tenant.slug}:external`),
        changeReason: "External advisor upload",
        createdAt: seedDate,
      },
      {
        id: stableId(`document-version:${tenant.slug}:p2-tax-residency-2026:1`),
        documentId: documentId(tenant.slug, "p2-tax-residency-2026"),
        versionNumber: 1,
        storageKey: `demo/${tenant.slug}/tax-residency-2026.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-tax-residency-2026:v1`).digest("hex"),
        createdByUserId: userId(`${tenant.slug}:cfo`),
        changeReason: "Complex journey tax residency proof",
        createdAt: date(-7),
      },
      {
        id: stableId(`document-version:${tenant.slug}:p2-source-of-funds:1`),
        documentId: documentId(tenant.slug, "p2-source-of-funds"),
        versionNumber: 1,
        storageKey: `demo/${tenant.slug}/source-of-funds-review.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-source-of-funds:v1`).digest("hex"),
        createdByUserId: userId(`${tenant.slug}:external`),
        changeReason: "Complex journey source-of-funds review",
        createdAt: date(-6),
      },
      {
        id: stableId(`document-version:${tenant.slug}:p2-ips-risk-addendum:1`),
        documentId: documentId(tenant.slug, "p2-ips-risk-addendum"),
        versionNumber: 1,
        storageKey: `demo/${tenant.slug}/ips-risk-addendum.pdf`,
        checksum: createHash("sha256").update(`${tenant.slug}:p2-ips-risk-addendum:v1`).digest("hex"),
        createdByUserId: userId("analyst"),
        changeReason: "Complex journey IPS risk addendum",
        createdAt: date(-5),
      },
    ]),
  });

  await prisma.documentExtraction.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`document-extraction:${tenant.slug}:statement`),
        documentId: documentId(tenant.slug, "statement"),
        extractionStatus: tenant.slug === "northbridge" ? "low_confidence" : "completed",
        confidenceScore: new Prisma.Decimal(tenant.slug === "northbridge" ? "61.20" : "91.30"),
        extractedFieldsJson: {
          portfolioValueBand: "50m-100m",
          statementDate: "2026-06-01",
          currency: tenant.slug === "summit" ? "USD" : "ZAR",
        },
        lowConfidenceFieldsJson:
          tenant.slug === "northbridge"
            ? {
                ownershipSource: "requires analyst confirmation",
              }
            : {},
        modelVersion: "rules-demo-2026.06",
        isClientVisible: false,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`document-extraction:${tenant.slug}:p2-source-of-funds`),
        documentId: documentId(tenant.slug, "p2-source-of-funds"),
        extractionStatus: tenant.slug === "northbridge" ? "low_confidence" : "completed",
        confidenceScore: new Prisma.Decimal(tenant.slug === "northbridge" ? "58.40" : "88.60"),
        extractedFieldsJson: {
          fundingSource: "external advisor review",
          reviewPeriod: "2026-Q2",
          riskSignal: tenant.slug === "northbridge" ? "requires specialist check" : "standard review",
        },
        lowConfidenceFieldsJson:
          tenant.slug === "northbridge"
            ? {
                fundingSource: "source chain incomplete",
              }
            : {},
        modelVersion: "rules-demo-2026.06",
        isClientVisible: false,
        createdAt: date(-6),
        updatedAt: date(-6),
      },
      {
        id: stableId(`document-extraction:${tenant.slug}:p2-ips-risk-addendum`),
        documentId: documentId(tenant.slug, "p2-ips-risk-addendum"),
        extractionStatus: tenant.slug === "bennett" ? "low_confidence" : "completed",
        confidenceScore: new Prisma.Decimal(tenant.slug === "bennett" ? "63.10" : "90.20"),
        extractedFieldsJson: {
          policyArea: "IPS risk controls",
          reviewPeriod: "2026-Q2",
          requiresComplianceRelease: true,
        },
        lowConfidenceFieldsJson:
          tenant.slug === "bennett"
            ? {
                riskTolerance: "pending compliance clarification",
              }
            : {},
        modelVersion: "rules-demo-2026.06",
        isClientVisible: false,
        createdAt: date(-5),
        updatedAt: date(-5),
      },
    ]),
  });

  await prisma.documentReview.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`document-review:${tenant.slug}:trust-deed`),
        documentId: documentId(tenant.slug, "trust-deed"),
        reviewerUserId: userId("analyst"),
        reviewType: "Analyst validation",
        status: ReviewStatus.APPROVED,
        notes: "Trust deed verified and linked to evidence.",
        clientVisibleSummary: "Core trust record verified.",
        reviewedAt: date(-4),
        createdAt: seedDate,
      },
      {
        id: stableId(`document-review:${tenant.slug}:statement`),
        documentId: documentId(tenant.slug, "statement"),
        reviewerUserId: userId("analyst"),
        reviewType: "Extraction review",
        status: tenant.slug === "morgan" ? ReviewStatus.REQUEST_MORE_DATA : ReviewStatus.IN_REVIEW,
        notes: tenant.slug === "morgan" ? "Statement lacks account ownership confirmation." : "Extraction in progress.",
        createdAt: seedDate,
      },
      {
        id: stableId(`document-review:${tenant.slug}:p2-tax-residency-2026`),
        documentId: documentId(tenant.slug, "p2-tax-residency-2026"),
        reviewerUserId: userId("analyst"),
        reviewType: "Tax residency validation",
        status: ReviewStatus.IN_REVIEW,
        notes: "Complex journey seeded row for document search, filter and review.",
        createdAt: date(-7),
      },
      {
        id: stableId(`document-review:${tenant.slug}:p2-source-of-funds`),
        documentId: documentId(tenant.slug, "p2-source-of-funds"),
        reviewerUserId: userId("analyst"),
        reviewType: "Source-of-funds review",
        status: tenant.slug === "northbridge" ? ReviewStatus.REQUEST_MORE_DATA : ReviewStatus.IN_REVIEW,
        notes: tenant.slug === "northbridge" ? "Source chain requires external specialist confirmation." : "Source review available for advisor handoff.",
        createdAt: date(-6),
      },
      {
        id: stableId(`document-review:${tenant.slug}:p2-ips-risk-addendum`),
        documentId: documentId(tenant.slug, "p2-ips-risk-addendum"),
        reviewerUserId: userId("compliance"),
        reviewType: "IPS compliance review",
        status: tenant.slug === "bennett" ? ReviewStatus.REQUEST_MORE_DATA : ReviewStatus.IN_REVIEW,
        notes: tenant.slug === "bennett" ? "Risk addendum requires compliance clarification before release." : "Risk addendum ready for compliance review.",
        createdAt: date(-5),
      },
    ]),
  });
}

async function seedWorkflowObjects() {
  await prisma.trigger.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: triggerId(tenant.slug, "liquidity"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        source: "advisor_input",
        triggerType: "liquidity_review",
        title: `${tenant.displayName} liquidity threshold review`,
        description: "Review whether liquidity buffer remains within governance guardrails.",
        severity: tenant.slug === "northbridge" ? "high" : "medium",
        confidenceScore: new Prisma.Decimal("87.50"),
        status: WorkflowStatus.ANALYST_REVIEW,
        clientVisible: false,
        createdBy: "advisor",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: triggerId(tenant.slug, "missing-tax"),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        source: "document_expiry",
        triggerType: "missing_document",
        title: `${tenant.displayName} tax residency certificate missing`,
        description: "Client-facing data request may be required before export or decision release.",
        severity: "medium",
        confidenceScore: new Prisma.Decimal("94.00"),
        status: WorkflowStatus.AWAITING_INFO,
        clientVisible: true,
        createdBy: "system",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.actionItem.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`action:${tenant.slug}:tax-cert`),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        triggerId: triggerId(tenant.slug, "missing-tax"),
        title: "Upload current tax residency certificate",
        description: "Required before the next export pack can be finalised.",
        ownerUserId: userId(`${tenant.slug}:cfo`),
        priority: "medium",
        status: tenant.slug === "summit" ? WorkflowStatus.IN_REVIEW : WorkflowStatus.AWAITING_INFO,
        dueDate: dateOnly(7),
        clientVisible: true,
        evidenceStatus: EvidenceStatus.PLACEHOLDER,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`action:${tenant.slug}:blocked-release`),
        clientTenantId: tenantId(tenant.slug),
        engagementId: engagementId(tenant.slug),
        triggerId: triggerId(tenant.slug, "liquidity"),
        title: "Resolve release gate",
        description: "Internal review item for advice-boundary gate.",
        ownerUserId: userId("compliance"),
        assignedRoleKey: "compliance_officer",
        priority: tenant.slug === "northbridge" ? "critical" : "high",
        status: tenant.slug === "northbridge" ? WorkflowStatus.BLOCKED : WorkflowStatus.COMPLIANCE_PENDING,
        dueDate: dateOnly(tenant.slug === "northbridge" ? -2 : 3),
        clientVisible: false,
        evidenceStatus: tenant.slug === "morgan" ? EvidenceStatus.PLACEHOLDER : EvidenceStatus.CREATED,
        blockedReason: tenant.slug === "northbridge" ? "Conflicting ownership evidence requires specialist review." : null,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.recommendation.createMany({
    data: demoTenants.map((tenant) => ({
      id: recommendationId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      engagementId: engagementId(tenant.slug),
      triggerId: triggerId(tenant.slug, "liquidity"),
      createdByUserId: userId("analyst"),
      title: `${tenant.displayName} liquidity governance recommendation`,
      summaryInternal:
        "Internal draft for human review. Client release remains blocked until advisor, compliance and evidence gates pass.",
      clientSummaryDraft:
        "Review the liquidity buffer and confirm whether to retain the current governance-approved reserve.",
      adviceClassification: tenant.slug === "bennett" ? AdviceClassification.ADVICE : AdviceClassification.ADVICE_RELEVANT,
      status: tenant.recommendationStatus,
      advisorApprovalId: approvalId(tenant.slug),
      complianceReviewId: complianceReviewId(tenant.slug),
      clientVisible: tenant.recommendationClientVisible,
      riskSummary: "Liquidity, concentration and document completeness risks considered.",
      assumptionsJson: {
        noUnapprovedAdviceGate: true,
        advisorApprovalAloneIsNotEnough: true,
        tenant: tenant.displayName,
      },
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.recommendationOption.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`recommendation-option:${tenant.slug}:retain`),
        recommendationId: recommendationId(tenant.slug),
        label: "Retain current buffer",
        description: "Keep current liquidity level and revisit after document remediation.",
        prosJson: ["Lower operational change", "Fits current mandate"],
        consJson: ["May leave idle cash if market conditions improve"],
        riskLevel: "medium",
        isPreferred: true,
        sortOrder: 1,
      },
      {
        id: stableId(`recommendation-option:${tenant.slug}:rebalance`),
        recommendationId: recommendationId(tenant.slug),
        label: "Request advisor call",
        description: "Escalate to a call before any client-visible proposal is released.",
        prosJson: ["Human review before action", "Documents assumptions"],
        consJson: ["Slower turnaround"],
        riskLevel: "low",
        isPreferred: false,
        sortOrder: 2,
      },
    ]),
  });

  await prisma.approval.createMany({
    data: demoTenants.map((tenant) => ({
      id: approvalId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      targetType: ObjectType.RECOMMENDATION,
      targetId: recommendationId(tenant.slug),
      approverUserId: userId("advisor"),
      approverRoleKey: "senior_wealth_advisor",
      approvalType: "advisor",
      status: tenant.slug === "northbridge" ? ReviewStatus.REQUEST_MORE_DATA : ReviewStatus.APPROVED,
      notes:
        tenant.slug === "summit"
          ? "Advisor approved the draft, but compliance release is still pending."
          : "Advisor review completed for demo workflow.",
      approvedAt: tenant.slug === "northbridge" ? null : date(-2),
      createdAt: seedDate,
    })),
  });

  await prisma.complianceReview.createMany({
    data: demoTenants.map((tenant) => ({
      id: complianceReviewId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      targetType: ObjectType.RECOMMENDATION,
      targetId: recommendationId(tenant.slug),
      reviewerUserId: userId("compliance"),
      status: tenant.complianceStatus,
      adviceClassification:
        tenant.slug === "bennett" ? AdviceClassification.ADVICE : AdviceClassification.ADVICE_RELEVANT,
      recordOfAdviceRequired: tenant.slug === "bennett",
      recordOfAdviceDocumentId: tenant.slug === "bennett" ? documentId(tenant.slug, "trust-deed") : null,
      kycFicaStatus: tenant.slug === "morgan" ? "pending_refresh" : "complete",
      popiaConsentStatus: "accepted",
      evidenceComplete: tenant.evidenceStatus === EvidenceStatus.RELEASED || tenant.evidenceStatus === EvidenceStatus.VALIDATED,
      releaseNotes:
        tenant.complianceStatus === ComplianceStatus.RELEASED
          ? "Released after advisor approval, evidence review and permission check."
          : tenant.complianceStatus === ComplianceStatus.BLOCKED
            ? "Blocked because source evidence conflicts with ownership records."
            : "Pending compliance completion; not client visible.",
      releasedAt: tenant.complianceStatus === ComplianceStatus.RELEASED ? date(-1) : null,
      blockedAt: tenant.complianceStatus === ComplianceStatus.BLOCKED ? date(-1) : null,
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.decision.createMany({
    data: demoTenants.map((tenant) => ({
      id: decisionId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      recommendationId: recommendationId(tenant.slug),
      title: `${tenant.displayName} liquidity decision`,
      status: tenant.decisionStatus,
      releasedToClientAt:
        tenant.recommendationStatus === RecommendationStatus.RELEASED_TO_CLIENT ||
        tenant.decisionStatus === DecisionStatus.RELEASED_TO_CLIENT
          ? date(-1)
          : null,
      decisionByUserId:
        tenant.decisionStatus === DecisionStatus.ACCEPTED ||
        tenant.decisionStatus === DecisionStatus.DEFERRED ||
        tenant.decisionStatus === DecisionStatus.REJECTED
        ? userId(`${tenant.slug}:principal`)
        : null,
      decisionAction:
        tenant.decisionStatus === DecisionStatus.ACCEPTED
          ? "accept"
          : tenant.decisionStatus === DecisionStatus.DEFERRED
            ? "defer"
            : tenant.decisionStatus === DecisionStatus.REJECTED
              ? "reject"
              : null,
      decisionReason:
        tenant.decisionStatus === DecisionStatus.DEFERRED
          ? "Awaiting refreshed source documents."
          : tenant.decisionStatus === DecisionStatus.REJECTED
            ? "Family council requested alternate assumptions."
            : null,
      decisionAt:
        tenant.decisionStatus === DecisionStatus.ACCEPTED ||
        tenant.decisionStatus === DecisionStatus.DEFERRED ||
        tenant.decisionStatus === DecisionStatus.REJECTED
        ? date(0)
        : null,
      reviewDate: dateOnly(90),
      evidenceRecordId: evidenceRecordId(tenant.slug),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.decisionParticipant.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`decision-participant:${tenant.slug}:principal`),
        decisionId: decisionId(tenant.slug),
        userId: userId(`${tenant.slug}:principal`),
        required: true,
        status:
          tenant.decisionStatus === DecisionStatus.RELEASED_TO_CLIENT ? ReviewStatus.PENDING : ReviewStatus.COMPLETED,
        actedAt: tenant.decisionStatus === DecisionStatus.RELEASED_TO_CLIENT ? null : date(0),
        createdAt: seedDate,
      },
      {
        id: stableId(`decision-participant:${tenant.slug}:trustee`),
        decisionId: decisionId(tenant.slug),
        userId: userId(`${tenant.slug}:trustee`),
        roleKey: "trustee",
        required: tenant.slug === "northbridge",
        status: tenant.slug === "northbridge" ? ReviewStatus.REJECTED : ReviewStatus.PENDING,
        actedAt: tenant.slug === "northbridge" ? date(0) : null,
        createdAt: seedDate,
      },
    ]),
  });
}

async function seedEvidenceCommunicationAndOps() {
  await prisma.evidenceRecord.createMany({
    data: demoTenants.map((tenant) => ({
      id: evidenceRecordId(tenant.slug),
      clientTenantId: tenantId(tenant.slug),
      engagementId: engagementId(tenant.slug),
      title: `${tenant.displayName} liquidity decision evidence`,
      status: tenant.evidenceStatus,
      relatedObjectType: ObjectType.DECISION,
      relatedObjectId: decisionId(tenant.slug),
      summary:
        tenant.evidenceStatus === EvidenceStatus.RESTRICTED
          ? "Restricted evidence pack due to conflicting ownership record."
          : "Evidence pack for decision and compliance release trail.",
      visibilityStatus: tenant.evidenceVisibility,
      retentionPolicy: "decision_records_7y",
      reviewDate: dateOnly(180),
      createdByUserId: userId("analyst"),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.evidenceItem.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`evidence-item:${tenant.slug}:document`),
        evidenceRecordId: evidenceRecordId(tenant.slug),
        itemType: "document",
        sourceObjectType: ObjectType.DOCUMENT,
        sourceObjectId: documentId(tenant.slug, "trust-deed"),
        title: `${tenant.trustName} source document`,
        visibilityStatus: tenant.evidenceVisibility,
        hash: createHash("sha256").update(`${tenant.slug}:evidence:document`).digest("hex"),
        createdAt: seedDate,
      },
      {
        id: stableId(`evidence-item:${tenant.slug}:approval`),
        evidenceRecordId: evidenceRecordId(tenant.slug),
        itemType: "approval",
        sourceObjectType: ObjectType.RECOMMENDATION,
        sourceObjectId: recommendationId(tenant.slug),
        title: "Advisor approval and compliance review state",
        visibilityStatus:
          tenant.complianceStatus === ComplianceStatus.RELEASED
            ? VisibilityStatus.CLIENT_VISIBLE
            : VisibilityStatus.COMPLIANCE_VISIBLE,
        hash: createHash("sha256").update(`${tenant.slug}:evidence:approval`).digest("hex"),
        createdAt: seedDate,
      },
    ]),
  });

  await prisma.documentLink.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`document-link:${tenant.slug}:trust-evidence`),
        documentId: documentId(tenant.slug, "trust-deed"),
        targetType: ObjectType.EVIDENCE_RECORD,
        targetId: evidenceRecordId(tenant.slug),
        relationship: "evidence",
        createdByUserId: userId("analyst"),
        createdAt: seedDate,
      },
      {
        id: stableId(`document-link:${tenant.slug}:statement-entity`),
        documentId: documentId(tenant.slug, "statement"),
        targetType: ObjectType.ENTITY,
        targetId: entityId(tenant.slug, "trust"),
        relationship: "source",
        createdByUserId: userId("analyst"),
        createdAt: seedDate,
      },
    ]),
  });

  await prisma.reviewSchedule.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`review-schedule:${tenant.slug}:decision`),
      clientTenantId: tenantId(tenant.slug),
      targetType: ObjectType.DECISION,
      targetId: decisionId(tenant.slug),
      cadence: "Quarterly",
      nextReviewDate: dateOnly(90),
      ownerUserId: userId("advisor"),
      status: WorkflowStatus.NEW,
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.messageThread.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`message-thread:${tenant.slug}:data-request`),
      clientTenantId: tenantId(tenant.slug),
      engagementId: engagementId(tenant.slug),
      subject: `${tenant.displayName} document follow-up`,
      channel: CommunicationChannel.SECURE_MESSAGE,
      status: tenant.slug === "morgan" ? WorkflowStatus.AWAITING_INFO : WorkflowStatus.IN_REVIEW,
      clientVisible: true,
      relatedObjectType: ObjectType.ACTION_ITEM,
      relatedObjectId: stableId(`action:${tenant.slug}:tax-cert`),
      createdByUserId: userId("success"),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.message.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`message:${tenant.slug}:request`),
        threadId: stableId(`message-thread:${tenant.slug}:data-request`),
        senderUserId: userId("success"),
        body: "Please upload the current certificate when ready. This is a data request, not advice.",
        clientVisible: true,
        requiresApproval: false,
        sentAt: date(-1),
        createdAt: date(-1),
      },
      {
        id: stableId(`message:${tenant.slug}:internal`),
        threadId: stableId(`message-thread:${tenant.slug}:data-request`),
        senderUserId: userId("analyst"),
        body: "Internal note: keep recommendation hidden until compliance release is complete.",
        clientVisible: false,
        requiresApproval: false,
        createdAt: seedDate,
      },
    ]),
  });

  await prisma.callEvent.createMany({
    data: demoTenants.map((tenant, index) => ({
      id: stableId(`call-event:${tenant.slug}:review`),
      clientTenantId: tenantId(tenant.slug),
      engagementId: engagementId(tenant.slug),
      relatedObjectType: ObjectType.RECOMMENDATION,
      relatedObjectId: recommendationId(tenant.slug),
      escalationType:
        tenant.slug === "northbridge" ? EscalationType.EXTERNAL_SPECIALIST : EscalationType.ADVISOR_CALL,
      scheduledByUserId: userId("advisor"),
      scheduledFor: date(index + 2),
      durationMinutes: 45,
      status: tenant.slug === "northbridge" ? WorkflowStatus.BLOCKED : WorkflowStatus.NEW,
      outcomeSummary: tenant.slug === "northbridge" ? "External specialist required before release." : null,
      evidenceRecordId: evidenceRecordId(tenant.slug),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.exportRequest.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`export:${tenant.slug}:evidence-pack`),
      clientTenantId: tenantId(tenant.slug),
      requestedByUserId: userId(`${tenant.slug}:principal`),
      exportType: tenant.slug === "northbridge" ? ExportType.COMPLIANCE_AUDIT_PACK : ExportType.EVIDENCE_PACKAGE,
      status:
        tenant.slug === "bennett"
          ? ExportStatus.DOWNLOADED
          : tenant.slug === "morgan"
            ? ExportStatus.REDACTION_PENDING
            : tenant.slug === "northbridge"
              ? ExportStatus.FAILED
              : ExportStatus.APPROVAL_REQUIRED,
      scopeJson: {
        tenant: tenant.displayName,
        includes: ["decision", "evidence", "audit"],
      },
      redactionProfile: tenant.slug === "northbridge" ? "compliance-internal" : "client-visible",
      approvalRequired: tenant.slug !== "bennett",
      approvedByUserId: tenant.slug === "bennett" ? userId("compliance") : null,
      generatedFileDocumentId: tenant.slug === "bennett" ? documentId(tenant.slug, "trust-deed") : null,
      expiresAt: date(14),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.accessRequest.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`access-request:${tenant.slug}:external`),
      clientTenantId: tenantId(tenant.slug),
      requesterUserId: userId(`${tenant.slug}:external`),
      targetUserId: userId(`${tenant.slug}:external`),
      objectType: ObjectType.DOCUMENT,
      objectId: documentId(tenant.slug, "statement"),
      requestedAction: PermissionAction.REVIEW,
      reason: "External advisor needs scoped access for source statement validation.",
      status: tenant.slug === "northbridge" ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW,
      reviewerUserId: userId("compliance"),
      complianceRequired: true,
      decisionAt: tenant.slug === "northbridge" ? date(-1) : null,
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });

  await prisma.secondConfirmation.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`second-confirmation:${tenant.slug}:external-access`),
      clientTenantId: tenantId(tenant.slug),
      actorUserId: userId("compliance"),
      targetObjectType: ObjectType.PERMISSION,
      targetObjectId: stableId(`access-request:${tenant.slug}:external`),
      action: PermissionAction.ASSIGN,
      confirmationPhrase: "CONFIRM SCOPED ACCESS",
      confirmedByUserId: tenant.slug === "bennett" ? userId("security") : null,
      status: tenant.slug === "bennett" ? "confirmed" : "pending",
      expiresAt: date(3),
      createdAt: seedDate,
      confirmedAt: tenant.slug === "bennett" ? date(-1) : null,
    })),
  });

  await prisma.queueItem.createMany({
    data: demoTenants.flatMap((tenant) => [
      {
        id: stableId(`queue:${tenant.slug}:compliance`),
        clientTenantId: tenantId(tenant.slug),
        queueName: "Compliance review",
        targetType: ObjectType.RECOMMENDATION,
        targetId: recommendationId(tenant.slug),
        assignedToUserId: userId("compliance"),
        assignedRoleKey: "compliance_officer",
        priority: tenant.slug === "northbridge" ? "critical" : "high",
        status: tenant.slug === "bennett" ? WorkflowStatus.COMPLETED : WorkflowStatus.COMPLIANCE_PENDING,
        slaDueAt: tenant.slug === "northbridge" ? date(-1) : date(2),
        escalated: tenant.slug === "northbridge",
        createdAt: seedDate,
        updatedAt: seedDate,
      },
      {
        id: stableId(`queue:${tenant.slug}:documents`),
        clientTenantId: tenantId(tenant.slug),
        queueName: "Document verification",
        targetType: ObjectType.DOCUMENT,
        targetId: documentId(tenant.slug, "statement"),
        assignedToUserId: userId("analyst"),
        assignedRoleKey: "analyst",
        priority: "medium",
        status: tenant.slug === "morgan" ? WorkflowStatus.AWAITING_INFO : WorkflowStatus.IN_REVIEW,
        slaDueAt: date(4),
        escalated: false,
        createdAt: seedDate,
        updatedAt: seedDate,
      },
    ]),
  });

  await prisma.dataQualityIssue.createMany({
    data: demoTenants.map((tenant) => ({
      id: stableId(`data-quality:${tenant.slug}:entity`),
      clientTenantId: tenantId(tenant.slug),
      targetType: ObjectType.ENTITY,
      targetId: entityId(tenant.slug, "company"),
      severity: tenant.slug === "northbridge" ? "high" : "medium",
      issueType: tenant.slug === "morgan" ? "missing_data" : "ownership_conflict",
      description:
        tenant.slug === "morgan"
          ? "Onboarding tenant requires additional ownership confirmation."
          : "Entity participant records require analyst review before final release.",
      status: tenant.slug === "bennett" ? WorkflowStatus.COMPLETED : WorkflowStatus.IN_REVIEW,
      ownerUserId: userId("analyst"),
      createdAt: seedDate,
      updatedAt: seedDate,
    })),
  });
}

async function seedAudit() {
  const events = [
    ...demoTenants.flatMap((tenant) => [
      {
        id: stableId(`audit:${tenant.slug}:tenant-created`),
        clientTenantId: tenantId(tenant.slug),
        actorUserId: userId("admin"),
        actorRoleKey: "admin",
        eventType: "tenant.created",
        targetType: ObjectType.TENANT,
        targetId: tenantId(tenant.slug),
        nextState: tenant.status,
        result: AuditResult.SUCCESS,
        reason: "Demo tenant seeded for Phase 03.",
      },
      {
        id: stableId(`audit:${tenant.slug}:recommendation-gate`),
        clientTenantId: tenantId(tenant.slug),
        actorUserId: userId("compliance"),
        actorRoleKey: "compliance_officer",
        eventType:
          tenant.complianceStatus === ComplianceStatus.RELEASED
            ? "recommendation.released"
            : "recommendation.visibility_blocked",
        targetType: ObjectType.RECOMMENDATION,
        targetId: recommendationId(tenant.slug),
        previousState: RecommendationStatus.ADVISOR_APPROVED,
        nextState: tenant.recommendationStatus,
        result:
          tenant.complianceStatus === ComplianceStatus.RELEASED
            ? AuditResult.SUCCESS
            : tenant.complianceStatus === ComplianceStatus.BLOCKED
              ? AuditResult.BLOCKED
              : AuditResult.PENDING,
        reason:
          tenant.complianceStatus === ComplianceStatus.RELEASED
            ? "Advisor approval, compliance release, evidence and permission gates passed."
            : "No unapproved advice may reach the client.",
        evidenceRecordId: evidenceRecordId(tenant.slug),
        metadataJson: {
          advisorApprovalAloneIsInsufficient: true,
          clientVisible: tenant.recommendationClientVisible,
        },
      },
      {
        id: stableId(`audit:${tenant.slug}:export`),
        clientTenantId: tenantId(tenant.slug),
        actorUserId: userId(`${tenant.slug}:principal`),
        actorRoleKey: "principal",
        eventType: "export.requested",
        targetType: ObjectType.EXPORT_REQUEST,
        targetId: stableId(`export:${tenant.slug}:evidence-pack`),
        nextState: "created",
        result: tenant.slug === "northbridge" ? AuditResult.FAILED : AuditResult.SUCCESS,
        reason: "Demo export request with redaction profile.",
        evidenceRecordId: evidenceRecordId(tenant.slug),
        metadataJson: {
          redactionProfile: tenant.slug === "northbridge" ? "compliance-internal" : "client-visible",
        },
      },
    ]),
    {
      id: stableId("audit:platform:policy-updated"),
      clientTenantId: null,
      actorUserId: userId("security"),
      actorRoleKey: "security_officer",
      eventType: "policy.updated",
      targetType: ObjectType.POLICY,
      targetId: stableId("policy:platform:export:v1"),
      previousState: "draft",
      nextState: "active",
      result: AuditResult.SUCCESS,
      reason: "Export redaction policy activated for demo data.",
      metadataJson: {
        secondConfirmationRequired: true,
      },
    },
  ];

  await prisma.auditEvent.createMany({
    data: events.map((event) => ({
      platformTenantId: platformId,
      ipAddress: "192.0.2.20",
      deviceId: stableId(`device:${event.id}`),
      correlationId: stableId(`correlation:${event.id}`),
      createdAt: seedDate,
      ...event,
    })),
  });
}

async function assertNoUnapprovedAdviceLeak() {
  const unsafeVisibleRecommendations = await prisma.recommendation.count({
    where: {
      clientVisible: true,
      NOT: {
        status: RecommendationStatus.RELEASED_TO_CLIENT,
      },
    },
  });

  if (unsafeVisibleRecommendations > 0) {
    throw new Error("Seed invariant failed: a non-released recommendation is client visible.");
  }
}

async function printSeedSummary() {
  const [
    clientTenantCount,
    userCount,
    roleCount,
    documentCount,
    recommendationCount,
    evidenceCount,
    auditCount,
    blockedRecommendationCount,
    visibleRecommendationCount,
  ] = await Promise.all([
    prisma.clientTenant.count(),
    prisma.user.count(),
    prisma.role.count(),
    prisma.document.count(),
    prisma.recommendation.count(),
    prisma.evidenceRecord.count(),
    prisma.auditEvent.count(),
    prisma.recommendation.count({ where: { status: RecommendationStatus.BLOCKED } }),
    prisma.recommendation.count({ where: { clientVisible: true } }),
  ]);

  console.log("Phase 03 deterministic seed complete.");
  console.log(
    JSON.stringify(
      {
        clientTenants: clientTenantCount,
        users: userCount,
        roles: roleCount,
        documents: documentCount,
        recommendations: recommendationCount,
        visibleRecommendations: visibleRecommendationCount,
        blockedRecommendations: blockedRecommendationCount,
        evidenceRecords: evidenceCount,
        auditEvents: auditCount,
      },
      null,
      2
    )
  );
}

async function main() {
  await clearDemoData();
  await seedPlatform();
  await seedTenants();
  await seedClientContext();
  await seedStructureAndDocuments();
  await seedWorkflowObjects();
  await seedEvidenceCommunicationAndOps();
  await seedAudit();
  await assertNoUnapprovedAdviceLeak();
  await printSeedSummary();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
