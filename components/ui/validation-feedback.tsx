import { cn } from "@/lib/cn";
import {
  uxFeedbackAttributesFor,
  uxFeedbackCopyForBoundary,
  uxFeedbackSubjectContractFor,
  uxFeedbackSuccessMessageForSubject,
  type UxFeedbackIntent,
  type UxFeedbackPlacement,
  type UxFeedbackSubject,
} from "@/lib/ux-feedback-message-contract";
import type { UxActionMeaning } from "@/lib/ux-action-hierarchy-contract";

type ValidationFeedbackBaseProps = {
  actionMeaning?: UxActionMeaning;
  className?: string;
  id?: string;
  intent?: UxFeedbackIntent;
  message: string;
  subject: UxFeedbackSubject;
  testId?: string;
};

type ValidationFeedbackProps = ValidationFeedbackBaseProps & {
  placement?: UxFeedbackPlacement;
};

type FieldFeedbackProps = ValidationFeedbackBaseProps & {
  visible?: boolean;
};

type NoOverclaimFeedbackProps = Omit<ValidationFeedbackBaseProps, "message"> & {
  message?: string;
  placement?: UxFeedbackPlacement;
};

export function ValidationFeedback({
  actionMeaning,
  className,
  id,
  intent = "validation",
  message,
  placement = "page_state",
  subject,
  testId = "ux-validation-summary",
}: ValidationFeedbackProps) {
  return (
    <div
      aria-live="polite"
      className={cn("rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-sm text-alphavest-muted", className)}
      data-testid={testId}
      data-ux-validation-summary="true"
      id={id}
      role="status"
      {...uxFeedbackAttributesFor({
        actionMeaning,
        intent,
        placement,
        subject,
      })}
    >
      {message}
    </div>
  );
}

export function FieldFeedback({
  actionMeaning,
  className,
  id,
  intent = "validation",
  message,
  subject,
  testId = "ux-field-feedback",
  visible = false,
}: FieldFeedbackProps) {
  return (
    <p
      aria-live="polite"
      className={cn(visible ? "text-xs leading-5 text-alphavest-muted" : "sr-only", className)}
      data-testid={testId}
      data-ux-field-feedback="true"
      id={id}
      role="status"
      {...uxFeedbackAttributesFor({
        actionMeaning,
        intent,
        placement: "field",
        subject,
      })}
    >
      {message}
    </p>
  );
}

export function NoOverclaimFeedback({
  actionMeaning,
  className,
  id,
  intent = "status",
  message,
  placement = "page_state",
  subject,
  testId = "ux-no-overclaim-feedback",
}: NoOverclaimFeedbackProps) {
  const subjectContract = uxFeedbackSubjectContractFor(subject);
  const derivedMessage =
    message ??
    (intent === "success"
      ? uxFeedbackSuccessMessageForSubject(subject)
      : uxFeedbackCopyForBoundary(subjectContract.boundary));

  return (
    <ValidationFeedback
      actionMeaning={actionMeaning ?? subjectContract.actionMeaning}
      className={className}
      id={id}
      intent={intent}
      message={derivedMessage}
      placement={placement}
      subject={subject}
      testId={testId}
    />
  );
}
