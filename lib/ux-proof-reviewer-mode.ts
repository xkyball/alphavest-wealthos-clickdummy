import {
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxOperatingModelForRoute,
  type UxOperatingAudience,
  type UxOperatingMode,
  type UxProofPosture,
} from "@/lib/ux-operating-model";
import {
  uxPageTemplateForRoute,
  type UxPageTemplateFamily,
  type UxProofAuditPlacement,
} from "@/lib/ux-page-template-system";
import type { UxWorkspaceKey } from "@/lib/ux-route-policy";

export type UxProofReviewerVisibilityMode =
  | "operational_default"
  | "reviewer_secondary"
  | "capture_only"
  | "client_mode";

export type UxProofReviewerContentClass =
  | "task_context"
  | "safety_blocker"
  | "recovery_guidance"
  | "route_context"
  | "route_id"
  | "ux_proof_tag"
  | "capture_warning"
  | "debug_metadata"
  | "audit_history_summary"
  | "internal_rationale"
  | "compliance_note"
  | "client_safe_signal";

export type UxProofReviewerVisibilityDecision = {
  clientModeAllowed: boolean;
  contentClass: UxProofReviewerContentClass;
  defaultModeAllowed: boolean;
  noOverclaimRule: string;
  reviewerModeAllowed: boolean;
  target: UxProofReviewerVisibilityMode;
};

export type UxProofReviewerRouteRecord = {
  audience: UxOperatingAudience;
  defaultVisibleContent: UxProofReviewerContentClass[];
  mode: UxOperatingMode;
  noOverclaimRule: string;
  pageId: string;
  path: string;
  proofAuditPlacement: UxProofAuditPlacement;
  proofPosture: UxProofPosture;
  reviewerSecondaryContent: UxProofReviewerContentClass[];
  routeScope: RouteScopeLabel;
  suppressedInClientMode: UxProofReviewerContentClass[];
  templateFamily: UxPageTemplateFamily;
  title: string;
  workspace: UxWorkspaceKey;
};

export type UxProofReviewerClientSuppression = {
  allowedContent: UxProofReviewerContentClass[];
  applies: boolean;
  audience: UxOperatingAudience;
  missingRequiredSuppressions: UxProofReviewerContentClass[];
  mode: "client_mode";
  pageId: string;
  suppressedContent: UxProofReviewerContentClass[];
};

const allContentClasses = [
  "task_context",
  "safety_blocker",
  "recovery_guidance",
  "route_context",
  "route_id",
  "ux_proof_tag",
  "capture_warning",
  "debug_metadata",
  "audit_history_summary",
  "internal_rationale",
  "compliance_note",
  "client_safe_signal",
] as const satisfies readonly UxProofReviewerContentClass[];

const defaultAllowed = new Set<UxProofReviewerContentClass>([
  "task_context",
  "safety_blocker",
  "recovery_guidance",
  "route_context",
  "client_safe_signal",
]);

const reviewerAllowed = new Set<UxProofReviewerContentClass>([
  "route_context",
  "route_id",
  "ux_proof_tag",
  "capture_warning",
  "debug_metadata",
  "audit_history_summary",
  "internal_rationale",
  "compliance_note",
]);

const captureOnly = new Set<UxProofReviewerContentClass>(["capture_warning", "debug_metadata"]);

const clientAllowed = new Set<UxProofReviewerContentClass>([
  "task_context",
  "safety_blocker",
  "recovery_guidance",
  "client_safe_signal",
]);

export const uxProofReviewerContentClasses = allContentClasses;

export function uxProofReviewerVisibilityForContentClass(contentClass: UxProofReviewerContentClass): UxProofReviewerVisibilityDecision {
  const clientModeAllowed = clientAllowed.has(contentClass);
  const reviewerModeAllowed = reviewerAllowed.has(contentClass);
  const defaultModeAllowed = defaultAllowed.has(contentClass);
  const target: UxProofReviewerVisibilityMode = captureOnly.has(contentClass)
    ? "capture_only"
    : defaultModeAllowed
      ? "operational_default"
      : reviewerModeAllowed
        ? "reviewer_secondary"
        : clientModeAllowed
          ? "client_mode"
          : "reviewer_secondary";

  return {
    clientModeAllowed,
    contentClass,
    defaultModeAllowed,
    noOverclaimRule: "Reviewer proof is traceability only; product completion still requires current UI, service, data and guard evidence.",
    reviewerModeAllowed,
    target,
  };
}

export function uxProofReviewerRecordForRoute(route: ScreenRoute): UxProofReviewerRouteRecord {
  const operatingModel = uxOperatingModelForRoute(route);
  const template = uxPageTemplateForRoute(route);
  const defaultVisibleContent = allContentClasses.filter((contentClass) => uxProofReviewerVisibilityForContentClass(contentClass).defaultModeAllowed);
  const reviewerSecondaryContent = allContentClasses.filter((contentClass) => uxProofReviewerVisibilityForContentClass(contentClass).reviewerModeAllowed);
  const suppressedInClientMode = allContentClasses.filter((contentClass) => !uxProofReviewerVisibilityForContentClass(contentClass).clientModeAllowed);

  return {
    audience: operatingModel.audience,
    defaultVisibleContent,
    mode: operatingModel.mode,
    noOverclaimRule: operatingModel.noOverclaimRule,
    pageId: route.pageId,
    path: operatingModel.path,
    proofAuditPlacement: template.proofAuditPlacement,
    proofPosture: operatingModel.proofPosture,
    reviewerSecondaryContent,
    routeScope: operatingModel.routeScope,
    suppressedInClientMode,
    templateFamily: template.family,
    title: route.title,
    workspace: operatingModel.workspace,
  };
}

export function uxProofReviewerRecordForPageId(pageId: string): UxProofReviewerRouteRecord {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);

  if (!route) {
    throw new Error(`UX proof/reviewer route ${pageId} is missing from the route registry.`);
  }

  return uxProofReviewerRecordForRoute(route);
}

export const uxProofReviewerRouteRecords = screenRoutes.map(uxProofReviewerRecordForRoute);

const clientModeRequiredSuppressions = [
  "route_context",
  "route_id",
  "ux_proof_tag",
  "capture_warning",
  "debug_metadata",
  "audit_history_summary",
  "internal_rationale",
  "compliance_note",
] as const satisfies readonly UxProofReviewerContentClass[];

export const uxProofReviewerClientModeRequiredSuppressions = clientModeRequiredSuppressions;

const clientModeRequiredSuppressionSet = new Set<UxProofReviewerContentClass>(clientModeRequiredSuppressions);

export function uxProofReviewerClientSuppressionForRecord(record: UxProofReviewerRouteRecord): UxProofReviewerClientSuppression {
  const allowedContent = record.defaultVisibleContent.filter((contentClass) => uxProofReviewerVisibilityForContentClass(contentClass).clientModeAllowed);
  const suppressedContent = record.suppressedInClientMode.filter((contentClass) => clientModeRequiredSuppressionSet.has(contentClass));
  const missingRequiredSuppressions = clientModeRequiredSuppressions.filter((contentClass) => !suppressedContent.includes(contentClass));

  return {
    allowedContent,
    applies: record.audience === "client_safe",
    audience: record.audience,
    missingRequiredSuppressions,
    mode: "client_mode",
    pageId: record.pageId,
    suppressedContent,
  };
}

export function uxProofReviewerClientSuppressionForPageId(pageId: string): UxProofReviewerClientSuppression {
  return uxProofReviewerClientSuppressionForRecord(uxProofReviewerRecordForPageId(pageId));
}

export const uxProofReviewerIntegrity = {
  clientRecordsMissingRequiredSuppressions: uxProofReviewerRouteRecords
    .filter((record) => record.audience === "client_safe")
    .filter((record) => clientModeRequiredSuppressions.some((contentClass) => !record.suppressedInClientMode.includes(contentClass)))
    .map((record) => record.pageId),
  duplicatePageIds: uxProofReviewerRouteRecords
    .map((record) => record.pageId)
    .filter((pageId, index, pageIds) => pageIds.indexOf(pageId) !== index),
  missingPageIds: screenRoutes
    .map((route) => route.pageId)
    .filter((pageId) => !uxProofReviewerRouteRecords.some((record) => record.pageId === pageId)),
  totalCount: uxProofReviewerRouteRecords.length,
};
