"use client";

import {
  advisorReviewCanonicalApiRoute,
  type AdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-action-contract";

export type AdvisorReviewActionId = AdvisorReviewWorkflowAction;

type AdvisorReviewCommandResponse = {
  action?: string;
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

export async function runAdvisorReviewCommand(actionId: AdvisorReviewActionId, nextRoute?: string) {
  const response = await fetch(advisorReviewCanonicalApiRoute, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionId }),
  });

  const body = (await response.json().catch(() => undefined)) as AdvisorReviewCommandResponse | undefined;

  if (!response.ok) {
    throw new Error(errorMessage(body, `Advisor-review command failed with HTTP ${response.status}.`));
  }

  if (!body) {
    throw new Error("Advisor-review command returned an empty response.");
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
