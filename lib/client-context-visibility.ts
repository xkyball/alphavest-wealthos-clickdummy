import { demoRoles, type DemoRoleKey } from "@/lib/demo-session";
import type { Sensitivity, VisibilityStatus } from "@/lib/domain-types";

export type ClientContextVisibility = {
  canRenderPayload: boolean;
  payloadMode: "full" | "redacted" | "hidden";
  sensitivity: Sensitivity;
  visibilityStatus: VisibilityStatus;
};

const restrictedClientRoles = new Set<DemoRoleKey>(["external_advisor", "next_gen", "trustee"]);

export function normalizeSensitivity(value: string | null | undefined): Sensitivity {
  if (
    value === "PUBLIC" ||
    value === "CLIENT_VISIBLE" ||
    value === "CONFIDENTIAL" ||
    value === "RESTRICTED" ||
    value === "HIGHLY_RESTRICTED" ||
    value === "INTERNAL_ONLY"
  ) {
    return value;
  }

  return "CONFIDENTIAL";
}

export function deriveClientContextVisibility(
  roleKey: DemoRoleKey,
  sensitivityValue: string | null | undefined,
): ClientContextVisibility {
  const sensitivity = normalizeSensitivity(sensitivityValue);
  const role = demoRoles.find((candidate) => candidate.key === roleKey);
  const internalRole = Boolean(role?.internal);
  const restrictedClientRole = restrictedClientRoles.has(roleKey);

  if (sensitivity === "INTERNAL_ONLY") {
    return {
      canRenderPayload: internalRole,
      payloadMode: internalRole ? "full" : "hidden",
      sensitivity,
      visibilityStatus: "INTERNAL_ONLY",
    };
  }

  if (sensitivity === "HIGHLY_RESTRICTED" || sensitivity === "RESTRICTED") {
    if (restrictedClientRole) {
      return {
        canRenderPayload: false,
        payloadMode: "hidden",
        sensitivity,
        visibilityStatus: "RESTRICTED",
      };
    }

    return {
      canRenderPayload: true,
      payloadMode: internalRole ? "full" : "redacted",
      sensitivity,
      visibilityStatus: internalRole ? "COMPLIANCE_VISIBLE" : "REDACTED",
    };
  }

  if (internalRole) {
    return {
      canRenderPayload: true,
      payloadMode: "full",
      sensitivity,
      visibilityStatus: "ADVISOR_VISIBLE",
    };
  }

  return {
    canRenderPayload: true,
    payloadMode: "full",
    sensitivity,
    visibilityStatus: "CLIENT_VISIBLE",
  };
}
