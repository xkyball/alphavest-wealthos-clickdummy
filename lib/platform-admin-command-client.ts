"use client";

import {
  platformAdminCanonicalApiRoute,
  type PlatformAdminWorkflowAction,
} from "@/lib/platform-admin-action-contract";
import { readActorCommandScope } from "@/lib/actor-command-scope-client";

export type PlatformAdminActionId = PlatformAdminWorkflowAction;

type PlatformAdminCommandResponse = {
  command?: string;
  error?: string;
  result?: {
    auditEventId?: string;
    auditRows?: number;
    message?: string;
    targetLabel?: string;
  };
};

function errorMessage(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;
}

export async function runPlatformAdminCommand(actionId: PlatformAdminActionId, nextRoute?: string) {
  const scope = readActorCommandScope();
  const response = await fetch(platformAdminCanonicalApiRoute, {
    body: JSON.stringify({ actionId, ...scope }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const body = (await response.json().catch(() => undefined)) as PlatformAdminCommandResponse | undefined;

  if (!response.ok) {
    throw new Error(errorMessage(body, `Platform admin command failed with HTTP ${response.status}.`));
  }

  if (!body) {
    throw new Error("Platform admin command returned an empty response.");
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
