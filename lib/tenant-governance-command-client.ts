"use client";

import {
  tenantGovernanceCanonicalApiRoute,
  type TenantGovernanceWorkflowAction,
} from "@/lib/tenant-governance-action-contract";
import type { ActorTenantSlug } from "@/lib/actor-session";

export type TenantGovernanceActionId = TenantGovernanceWorkflowAction;

type TenantGovernanceCommandResponse = {
  command?: string;
  error?: string;
  result?: {
    auditEventId?: string;
    message?: string;
  };
};

function errorMessage(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;
}

type TenantGovernanceCommandOptions = {
  nextRoute?: string;
  tenantSlug: ActorTenantSlug;
};

export async function runTenantGovernanceCommand(actionId: TenantGovernanceActionId, options: TenantGovernanceCommandOptions) {
  const response = await fetch(tenantGovernanceCanonicalApiRoute, {
    body: JSON.stringify({ actionId, tenantSlug: options.tenantSlug }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const body = (await response.json().catch(() => undefined)) as TenantGovernanceCommandResponse | undefined;

  if (!response.ok) {
    throw new Error(errorMessage(body, `Tenant governance command failed with HTTP ${response.status}.`));
  }

  if (!body) {
    throw new Error("Tenant governance command returned an empty response.");
  }

  if (options.nextRoute) {
    window.location.assign(options.nextRoute);
  }

  return body;
}
