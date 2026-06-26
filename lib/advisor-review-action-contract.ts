export type AdvisorReviewWorkflowAction =
  | "j01.routeToAdvisor"
  | "j01.escalateAdvisor";

export type AdvisorReviewCommand = "ROUTE_TO_ADVISOR_REVIEW" | "ESCALATE_ADVISOR_REVIEW_TO_CALL";

export const advisorReviewCanonicalApiRoute = "/api/advisor-review/actions" as const;

export const advisorReviewWorkflowActionIds = [
  "j01.routeToAdvisor",
  "j01.escalateAdvisor",
] as const satisfies readonly AdvisorReviewWorkflowAction[];

export const advisorReviewCommandByAction = {
  "j01.routeToAdvisor": "ROUTE_TO_ADVISOR_REVIEW",
  "j01.escalateAdvisor": "ESCALATE_ADVISOR_REVIEW_TO_CALL",
} satisfies Record<AdvisorReviewWorkflowAction, AdvisorReviewCommand>;

const advisorReviewWorkflowActions = new Set<string>(advisorReviewWorkflowActionIds);

export function isAdvisorReviewWorkflowAction(value: unknown): value is AdvisorReviewWorkflowAction {
  return typeof value === "string" && advisorReviewWorkflowActions.has(value);
}

export function advisorReviewCommandForAction(actionId: AdvisorReviewWorkflowAction) {
  return advisorReviewCommandByAction[actionId];
}
