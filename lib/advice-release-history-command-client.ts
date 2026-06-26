"use client";

import {
  adviceReleaseHistoryCanonicalApiRoute,
  type AdviceReleaseHistoryWorkflowAction,
} from "@/lib/advice-release-history-action-contract";

export type AdviceReleaseHistoryActionId = AdviceReleaseHistoryWorkflowAction;

type AdviceReleaseHistoryCommandResponse = {
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

export async function runAdviceReleaseHistoryCommand(
  actionId: AdviceReleaseHistoryActionId,
  nextRoute?: string,
) {
  const response = await fetch(adviceReleaseHistoryCanonicalApiRoute, {
    body: JSON.stringify({ actionId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const body = (await response.json().catch(() => undefined)) as
    | AdviceReleaseHistoryCommandResponse
    | undefined;

  if (!response.ok) {
    throw new Error(
      errorMessage(body, `Advice and release-history command failed with HTTP ${response.status}.`),
    );
  }

  if (!body) {
    throw new Error("Advice and release-history command returned an empty response.");
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
