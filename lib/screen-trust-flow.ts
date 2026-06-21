import type { BadgeTone } from "@/components/ui";
import { createDemoSession, demoPlatformTenantId } from "@/lib/demo-session";
import type { UUID } from "@/lib/domain-types";
import { exportService } from "@/lib/export-service";
import { permissionEngine } from "@/lib/permission-engine";
import { visibilityEngine } from "@/lib/visibility-engine";

export type ScreenTrustFlowStep = {
  detail: string;
  label: string;
  status: string;
  tone: BadgeTone;
};

export type ScreenTrustFlowPanel = {
  detail: string;
  gateLabel: string;
  missing: string[];
  state: "success" | "blocked" | "restricted" | "loading" | "empty" | "error";
  steps: ScreenTrustFlowStep[];
  title: string;
};

const recommendationId = "recommendation-demo-release" as UUID;
const decisionId = "decision-demo-release" as UUID;
const exportRequestId = "export-demo-package" as UUID;

const clientSession = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
const complianceSession = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
const adminSession = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
const summitSession = createDemoSession({ roleKey: "principal", tenantSlug: "summit" });

const releasedRecommendationProjection = visibilityEngine.projectRecommendationPayload(
  clientSession.actor,
  clientSession.role,
  {
    clientSummary: "Released liquidity plan summary for Alexandra Bennett.",
    clientSummaryDraft: "Draft language awaiting review.",
    clientTenantId: clientSession.tenant.id,
    complianceNotes: "Compliance-only reviewer note.",
    internalRationale: "Internal model rationale.",
    objectId: recommendationId,
    recommendationStatus: "RELEASED_TO_CLIENT",
    sensitivity: "CONFIDENTIAL",
    summaryInternal: "Advisor-only analysis.",
    visibilityStatus: "CLIENT_VISIBLE",
    clientVisible: true,
  },
  demoPlatformTenantId,
  clientSession.tenant.id,
);

const blockedRecommendationProjection = visibilityEngine.projectRecommendationPayload(
  clientSession.actor,
  clientSession.role,
  {
    clientSummary: "Unreleased draft summary.",
    clientSummaryDraft: "Draft language awaiting review.",
    clientTenantId: clientSession.tenant.id,
    complianceNotes: "Compliance-only reviewer note.",
    internalRationale: "Internal model rationale.",
    objectId: "recommendation-demo-draft" as UUID,
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Advisor-only analysis.",
    visibilityStatus: "ADVISOR_VISIBLE",
    clientVisible: false,
  },
  demoPlatformTenantId,
  clientSession.tenant.id,
);

const releasedRecommendationSafety = visibilityEngine.assertClientProjectionClean(releasedRecommendationProjection);
const blockedRecommendationSafety = visibilityEngine.assertClientProjectionClean(blockedRecommendationProjection);

const releasedDecisionProjection = visibilityEngine.projectDecisionPayload(
  clientSession.actor,
  clientSession.role,
  {
    clientSummary: "Released decision summary, scoped for the client portal.",
    clientTenantId: clientSession.tenant.id,
    complianceNotes: "Compliance release note.",
    decisionState: "RELEASED",
    evidenceRecordId: "evidence-demo-release" as UUID,
    id: decisionId,
    internalRationale: "Internal investment committee rationale.",
    releasedAt: "2026-06-21T10:30:00.000Z",
    submittedAt: "2026-06-21T09:15:00.000Z",
    title: "Bennett liquidity sleeve allocation",
    visibilityStatus: "CLIENT_VISIBLE",
    clientVisible: true,
  },
  demoPlatformTenantId,
  clientSession.tenant.id,
);

const submittedDecisionProjection = visibilityEngine.projectDecisionPayload(
  clientSession.actor,
  clientSession.role,
  {
    aiDraft: "Draft decision note.",
    clientSummary: "Submitted decision summary.",
    clientTenantId: clientSession.tenant.id,
    complianceNotes: "Pending compliance release.",
    decisionState: "SUBMITTED",
    evidenceRecordId: "evidence-demo-pending" as UUID,
    id: "decision-demo-submitted" as UUID,
    internalRationale: "Pending internal rationale.",
    submittedAt: "2026-06-21T09:15:00.000Z",
    title: "Submitted estate structure change",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    clientVisible: false,
  },
  demoPlatformTenantId,
  clientSession.tenant.id,
);

const releasedDecisionSafety = visibilityEngine.assertClientProjectionClean(releasedDecisionProjection);

const adminAdvicePayloadDecision = permissionEngine.can(
  adminSession.actor,
  "VIEW",
  {
    clientTenantId: adminSession.tenant.id,
    objectId: recommendationId,
    objectType: "RECOMMENDATION",
    sensitivity: "RESTRICTED",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    clientTenantId: adminSession.tenant.id,
    clientVisibilityState: "COMPLIANCE_VISIBLE",
    objectScope: {
      clientTenantId: adminSession.tenant.id,
      objectIds: [recommendationId],
      objectType: "RECOMMENDATION",
    },
    platformTenantId: demoPlatformTenantId,
    sensitivity: "RESTRICTED",
  },
  adminSession.role,
);

const adminExportDecision = permissionEngine.can(
  adminSession.actor,
  "EXPORT",
  {
    clientTenantId: adminSession.tenant.id,
    objectId: exportRequestId,
    objectType: "EXPORT_REQUEST",
  },
  {
    clientTenantId: adminSession.tenant.id,
    objectScope: {
      clientTenantId: adminSession.tenant.id,
      objectIds: [exportRequestId],
      objectType: "EXPORT_REQUEST",
    },
    platformTenantId: demoPlatformTenantId,
  },
  adminSession.role,
);

const crossTenantDecision = visibilityEngine.projectDecisionPayload(
  clientSession.actor,
  clientSession.role,
  {
    clientSummary: "Foreign tenant decision summary.",
    clientTenantId: summitSession.tenant.id,
    decisionState: "RELEASED",
    id: "decision-summit-release" as UUID,
    releasedAt: "2026-06-21T10:30:00.000Z",
    title: "Summit Ridge decision",
    visibilityStatus: "CLIENT_VISIBLE",
    clientVisible: true,
  },
  demoPlatformTenantId,
  clientSession.tenant.id,
);

const safeExportProjection = exportService.canUseClientProjectionForExport({
  hiddenFields: releasedDecisionProjection.hiddenFields,
  payload: releasedDecisionProjection.payload,
  reasonCode: releasedDecisionProjection.reasonCode,
  visible: releasedDecisionProjection.visible,
});

const forbiddenExportInspection = exportService.inspectClientExportPayload({
  clientSummary: "Client-safe summary.",
  complianceNotes: "Must not leave internal workflow.",
  internalRationale: "Must not leave internal workflow.",
});

const exportScopeDecision = exportService.evaluateExportScope([
  {
    access: "Allowed",
    id: decisionId,
    name: "Released decision summary",
    payloadClassifications: safeExportProjection.payloadClassifications,
    selected: true,
    type: "Decision",
  },
  {
    access: "Allowed",
    id: "recommendation-internal-draft" as UUID,
    name: "Internal recommendation draft",
    payloadClassifications: forbiddenExportInspection.payloadClassifications,
    selected: true,
    type: "Recommendation",
  },
  {
    access: "Not permitted",
    id: "foreign-tenant-evidence" as UUID,
    name: "Summit Ridge evidence packet",
    payloadClassifications: ["RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "Evidence",
  },
]);

const exportStepSeparation = exportService.evaluateExportStepSeparation({
  approved: false,
  downloaded: false,
  generated: false,
  previewed: true,
  shared: false,
});

const exportGenerationDecision = exportService.canGenerateExport({
  actor: complianceSession.actor,
  auditPersistenceAvailable: true,
  clientTenantId: complianceSession.tenant.id,
  externalShare: true,
  platformTenantId: demoPlatformTenantId,
  redactionProfile: "client-visible-redacted",
  role: complianceSession.role,
  targetId: exportRequestId,
  targetType: "EXPORT_REQUEST",
  approvalComplete: false,
  payloadClassifications: forbiddenExportInspection.payloadClassifications,
});

const uniqueMissing = (...groups: string[][]) => [...new Set(groups.flat())];

export const p07P09TrustPanels = {
  decision: {
    detail: "Decision rows distinguish submitted/internal work from released client records. The client payload only contains title, state, released timestamp and client summary.",
    gateLabel: releasedDecisionSafety.clean
      ? releasedDecisionProjection.reasonCode
      : "Decision projection contains blocked fields",
    missing: uniqueMissing(submittedDecisionProjection.hiddenFields, releasedDecisionSafety.missing),
    state: "restricted",
    steps: [
      {
        detail: `${submittedDecisionProjection.reasonCode}: submitted decisions remain hidden from the client until compliance release.`,
        label: "Submitted stays internal",
        status: submittedDecisionProjection.visible ? "Visible" : "Hidden",
        tone: submittedDecisionProjection.visible ? "red" : "green",
      },
      {
        detail: `${releasedDecisionProjection.reasonCode}: released decisions expose only client-safe fields.`,
        label: "Released projection",
        status: releasedDecisionProjection.visible ? "Client safe" : "Blocked",
        tone: releasedDecisionProjection.visible ? "green" : "red",
      },
      {
        detail: `Hidden from client: ${releasedDecisionProjection.hiddenFields.join(", ")}.`,
        label: "Internal fields",
        status: "Redacted",
        tone: "gold",
      },
    ],
    title: "Decision State Projection",
  } satisfies ScreenTrustFlowPanel,
  export: {
    detail: "Export packages must use client-safe projections, explicit scope, redaction and approval before generate, download or share actions.",
    gateLabel: exportGenerationDecision.reason,
    missing: uniqueMissing(
      safeExportProjection.missing,
      forbiddenExportInspection.missing,
      exportScopeDecision.missing,
      exportStepSeparation.missing,
      exportGenerationDecision.missing,
    ),
    state: "blocked",
    steps: [
      {
        detail: `${exportScopeDecision.allowedSelectedCount} safe item included; ${exportScopeDecision.blockedItems.length} selected items are blocked by access or payload class.`,
        label: "Scope selected",
        status: exportScopeDecision.valid ? "Valid" : "Blocked",
        tone: exportScopeDecision.valid ? "green" : "red",
      },
      {
        detail: `Forbidden fields detected: ${forbiddenExportInspection.forbiddenFields.join(", ")}.`,
        label: "Forbidden payloads",
        status: forbiddenExportInspection.clean ? "Clean" : "Blocked",
        tone: forbiddenExportInspection.clean ? "green" : "red",
      },
      {
        detail: `Current export stage is ${exportStepSeparation.stage}; next allowed actions: ${exportStepSeparation.allowedNextActions.join(", ")}.`,
        label: "Step separation",
        status: exportStepSeparation.canGenerate ? "Generate" : "Approval first",
        tone: exportStepSeparation.canGenerate ? "green" : "gold",
      },
    ],
    title: "Export Redaction Lifecycle",
  } satisfies ScreenTrustFlowPanel,
  governance: {
    detail: "Governance routes can manage access requests, but admin/security authority does not bypass advice payload, tenant or export controls.",
    gateLabel: adminAdvicePayloadDecision.reasonCode,
    missing: uniqueMissing(
      [adminAdvicePayloadDecision.reasonCode, adminExportDecision.reasonCode],
      crossTenantDecision.visible ? [] : [crossTenantDecision.reasonCode],
    ),
    state: "blocked",
    steps: [
      {
        detail: adminAdvicePayloadDecision.reason,
        label: "Admin cannot force advice",
        status: adminAdvicePayloadDecision.allowed ? "Allowed" : "Denied",
        tone: adminAdvicePayloadDecision.allowed ? "red" : "green",
      },
      {
        detail: crossTenantDecision.reason,
        label: "Cross-tenant rows",
        status: crossTenantDecision.visible ? "Visible" : "Hidden",
        tone: crossTenantDecision.visible ? "red" : "green",
      },
      {
        detail: adminExportDecision.reason,
        label: "Export non-bypass",
        status: adminExportDecision.allowed ? "Allowed" : "Denied",
        tone: adminExportDecision.allowed ? "red" : "green",
      },
    ],
    title: "Governance Non-Bypass",
  } satisfies ScreenTrustFlowPanel,
  visibility: {
    detail: "Client surfaces render only released client-safe projections. Drafts, internal rationale, assumptions, evidence IDs and compliance notes stay server-side.",
    gateLabel: releasedRecommendationSafety.clean
      ? releasedRecommendationProjection.reasonCode
      : "Client projection contains blocked fields",
    missing: uniqueMissing(
      releasedRecommendationSafety.missing,
      blockedRecommendationSafety.missing,
      releasedRecommendationProjection.hiddenFields,
      blockedRecommendationProjection.hiddenFields,
    ),
    state: "restricted",
    steps: [
      {
        detail: `${releasedRecommendationProjection.reasonCode}: released client summary is visible.`,
        label: "Released summary",
        status: releasedRecommendationProjection.visible ? "Visible" : "Blocked",
        tone: releasedRecommendationProjection.visible ? "green" : "red",
      },
      {
        detail: `Hidden from client: ${releasedRecommendationProjection.hiddenFields.join(", ")}.`,
        label: "Internal fields hidden",
        status: "Redacted",
        tone: "gold",
      },
      {
        detail: `${blockedRecommendationProjection.reasonCode}: draft or advisor-visible content fails closed.`,
        label: "Unreleased content",
        status: blockedRecommendationProjection.visible ? "Visible" : "Blocked",
        tone: blockedRecommendationProjection.visible ? "red" : "green",
      },
    ],
    title: "Client Visibility Projection",
  } satisfies ScreenTrustFlowPanel,
} as const;
