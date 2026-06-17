export type ValidationIssue = {
  code: string;
  field: string;
  message: string;
};

export type DemoWorkflowRequestInput = {
  actionId: string;
};

type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      issues: ValidationIssue[];
      ok: false;
    };

const demoWorkflowActionPattern = /^j\d{2}\.[a-zA-Z0-9]+$/;

export function isDemoWorkflowActionId(value: unknown): value is string {
  return typeof value === "string" && demoWorkflowActionPattern.test(value);
}

export function parseDemoWorkflowRequestBody(body: unknown): ValidationResult<DemoWorkflowRequestInput> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      issues: [
        {
          code: "invalid_body",
          field: "body",
          message: "Request body must be an object.",
        },
      ],
      ok: false,
    };
  }

  const actionId = (body as { actionId?: unknown }).actionId;
  if (!isDemoWorkflowActionId(actionId)) {
    return {
      issues: [
        {
          code: "invalid_action_id",
          field: "actionId",
          message: "Action ID must use the demo workflow format, for example j02.releaseClient.",
        },
      ],
      ok: false,
    };
  }

  return {
    ok: true,
    value: { actionId },
  };
}
