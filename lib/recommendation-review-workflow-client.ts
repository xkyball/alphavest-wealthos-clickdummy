"use client";

import type {
  AdvisorApprovalWorkflowAction,
  AdvisorApprovalWorkflowRequestInput,
} from "@/lib/recommendation-review-workflow-validation";

export const advisorApprovalDemoTargets = {
  morgan: {
    evidenceId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    recommendationId: "7788c210-4907-5d7e-a27b-ddd07898d893",
  },
  northbridge: {
    evidenceId: "de155b08-f7f4-5c92-ba52-93a646658d53",
    recommendationId: "3f164151-0bc4-54ff-a5a4-b7521c41826b",
  },
  summit: {
    evidenceId: "cd681455-89ef-5ebb-96c7-8464f0dcb721",
    recommendationId: "b0b09a4b-8067-530d-a45a-2ad04d9c4b1d",
  },
} as const;

type AdvisorApprovalClientPayload = Omit<
  AdvisorApprovalWorkflowRequestInput,
  "workflowType"
> & {
  action: AdvisorApprovalWorkflowAction;
};

export async function runAdvisorApprovalWorkflowAction(
  payload: AdvisorApprovalClientPayload,
  nextRoute?: string,
) {
  const response = await fetch("/api/recommendation-review-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workflowType: "advisor-approval",
      ...payload,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
    throw new Error(body?.error ?? `Advisor approval workflow failed with HTTP ${response.status}.`);
  }

  const body = (await response.json()) as {
    result?: {
      auditEventId?: string;
      message?: string;
      reloadedState?: {
        complianceReview?: { status?: string | null };
        recommendation?: { clientVisible?: boolean; status?: string };
      };
    };
  };

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
