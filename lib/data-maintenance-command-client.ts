"use client";

import {
  dataMaintenanceCanonicalApiRoute,
  type DataMaintenanceWorkflowAction,
} from "@/lib/data-maintenance-action-contract";

export type DataMaintenanceActionId = DataMaintenanceWorkflowAction;

type DataMaintenanceCommandResponse = {
  command?: string;
  error?: string;
  result?: {
    auditEventId?: string;
    blockedReason?: string | null;
    evidenceStatus?: string | null;
    message?: string;
    status?: string;
  };
};

type DataMaintenanceCommandOptions = {
  actionItemId?: string;
  roleKey?: string;
  tenantSlug?: string;
};

function errorMessage(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;
}

export async function runDataMaintenanceCommand(actionId: DataMaintenanceActionId, nextRoute?: string, options: DataMaintenanceCommandOptions = {}) {
  const response = await fetch(dataMaintenanceCanonicalApiRoute, {
    body: JSON.stringify({ actionId, ...options }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const body = (await response.json().catch(() => undefined)) as DataMaintenanceCommandResponse | undefined;

  if (!response.ok) {
    throw new Error(errorMessage(body, `Data maintenance command failed with HTTP ${response.status}.`));
  }

  if (!body) {
    throw new Error("Data maintenance command returned an empty response.");
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
