import { screenRoutes } from "@/lib/route-registry";
import { uxOperatingModelForRoute, type UxOperatingAudience } from "@/lib/ux-operating-model";
import { uxPageTemplateForRoute } from "@/lib/ux-page-template-system";

export type UxClientSafeUiFamily =
  | "client_portal"
  | "mobile_client"
  | "export_client_package";

export type UxClientSafeVisibleClass =
  | "client_safe_summary"
  | "released_status"
  | "redacted_metadata"
  | "safe_next_step"
  | "fail_closed_state"
  | "source_upload_metadata";

export type UxClientSafeSuppressedClass =
  | "route_context"
  | "route_id"
  | "ux_task_id"
  | "proof_scaffolding"
  | "reviewer_scaffolding"
  | "debug_metadata"
  | "ai_draft"
  | "internal_rationale"
  | "compliance_note"
  | "audit_history_summary"
  | "storage_or_checksum";

export type UxClientSafeStatePrimitive =
  | "empty"
  | "hidden"
  | "redacted"
  | "permission_denied"
  | "source_upload"
  | "released";

export type UxClientSafeUiBoundaryRecord = {
  audience: UxOperatingAudience;
  allowedVisibleClasses: readonly UxClientSafeVisibleClass[];
  backendSecurityScope: "ui_projection_only_not_rbac";
  family: UxClientSafeUiFamily;
  mode: "client_safe_ui";
  pageId: string;
  path: string;
  statePrimitives: readonly UxClientSafeStatePrimitive[];
  suppressedClasses: readonly UxClientSafeSuppressedClass[];
  templateFamily: string;
  title: string;
};

export type UxClientSafeUiAttributes = Record<`data-${string}`, string>;

export const uxClientSafeAllowedVisibleClasses = [
  "client_safe_summary",
  "released_status",
  "redacted_metadata",
  "safe_next_step",
  "fail_closed_state",
  "source_upload_metadata",
] as const satisfies readonly UxClientSafeVisibleClass[];

export const uxClientSafeSuppressedClasses = [
  "route_context",
  "route_id",
  "ux_task_id",
  "proof_scaffolding",
  "reviewer_scaffolding",
  "debug_metadata",
  "ai_draft",
  "internal_rationale",
  "compliance_note",
  "audit_history_summary",
  "storage_or_checksum",
] as const satisfies readonly UxClientSafeSuppressedClass[];

export const uxClientSafeStatePrimitives = [
  "empty",
  "hidden",
  "redacted",
  "permission_denied",
  "source_upload",
  "released",
] as const satisfies readonly UxClientSafeStatePrimitive[];

const clientSafeFamiliesByPageId = new Map<string, UxClientSafeUiFamily>([
  ["019", "client_portal"],
  ["020", "mobile_client"],
  ["021", "client_portal"],
  ["022", "client_portal"],
  ["023", "client_portal"],
  ["024", "client_portal"],
  ["025", "client_portal"],
  ["026", "client_portal"],
  ["027", "client_portal"],
  ["028", "client_portal"],
  ["029", "client_portal"],
  ["030", "client_portal"],
  ["031", "client_portal"],
  ["032", "client_portal"],
  ["058", "export_client_package"],
]);

function routeForPageId(pageId: string) {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);

  if (!route) {
    throw new Error(`UX client-safe UI boundary route ${pageId} is missing from the route registry.`);
  }

  return route;
}

export function uxClientSafeFamilyForPageId(pageId: string): UxClientSafeUiFamily | undefined {
  return clientSafeFamiliesByPageId.get(pageId);
}

export function uxClientSafeUiBoundaryForPageId(pageId: string, family = uxClientSafeFamilyForPageId(pageId)): UxClientSafeUiBoundaryRecord {
  const route = routeForPageId(pageId);
  const operatingModel = uxOperatingModelForRoute(route);
  const template = uxPageTemplateForRoute(route);

  if (!family) {
    throw new Error(`UX client-safe UI boundary family is missing for page ${pageId}.`);
  }

  return {
    allowedVisibleClasses: uxClientSafeAllowedVisibleClasses,
    audience: operatingModel.audience,
    backendSecurityScope: "ui_projection_only_not_rbac",
    family,
    mode: "client_safe_ui",
    pageId,
    path: operatingModel.path,
    statePrimitives: uxClientSafeStatePrimitives,
    suppressedClasses: uxClientSafeSuppressedClasses,
    templateFamily: template.family,
    title: route.title,
  };
}

export function uxClientSafeUiAttributesFor(record: UxClientSafeUiBoundaryRecord): UxClientSafeUiAttributes {
  return {
    "data-e07-allowed-visible-classes": record.allowedVisibleClasses.join(" "),
    "data-e07-backend-security-scope": record.backendSecurityScope,
    "data-e07-client-safe-family": record.family,
    "data-e07-client-safe-mode": record.mode,
    "data-e07-client-safe-page-id": record.pageId,
    "data-e07-client-safe-ui-boundary": "true",
    "data-e07-state-primitives": record.statePrimitives.join(" "),
    "data-e07-suppressed-classes": record.suppressedClasses.join(" "),
  };
}

export const uxClientSafeUiBoundaryRecords = Array.from(clientSafeFamiliesByPageId.keys()).map((pageId) =>
  uxClientSafeUiBoundaryForPageId(pageId)
);

export const uxClientSafeUiBoundaryIntegrity = {
  missingFamilyPageIds: ["019", "020", "027", "058"].filter((pageId) => !clientSafeFamiliesByPageId.has(pageId)),
  missingSuppressionClasses: uxClientSafeUiBoundaryRecords
    .filter((record) => record.suppressedClasses.length !== uxClientSafeSuppressedClasses.length)
    .map((record) => record.pageId),
  totalCount: uxClientSafeUiBoundaryRecords.length,
};
