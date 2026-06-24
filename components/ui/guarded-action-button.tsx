import { LockKeyhole } from "lucide-react";
import { useId } from "react";
import { DisabledControlReason } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";
import type { UiActionGuard, UiActionGuardStatus } from "@/lib/ui-clickflow-guards";

type GuardedActionLifecycleState = Extract<UiActionGuardStatus, "enabled" | "error" | "loading" | "success"> | "idle";

type GuardedActionButtonProps = {
  children: React.ReactNode;
  className?: string;
  guard: UiActionGuard;
  lifecycleState?: GuardedActionLifecycleState;
  loadingLabel?: string;
  onClick?: () => void;
  requiresAudit?: boolean;
  requiresConfirmation?: boolean;
  requiresPermission?: boolean;
  successLabel?: string;
  errorLabel?: string;
  testId?: string;
};

export function GuardedActionButton({
  children,
  className,
  errorLabel = "Action failed closed. Review the blocker before retry.",
  guard,
  lifecycleState = "idle",
  loadingLabel = "Action pending. Duplicate execution is blocked.",
  onClick,
  requiresAudit = false,
  requiresConfirmation = false,
  requiresPermission = true,
  successLabel = "Action recorded. Downstream gates remain separate unless explicitly stated.",
  testId,
}: GuardedActionButtonProps) {
  const disabledReasonId = useId();
  const statusId = useId();
  const effectiveStatus: UiActionGuardStatus =
    guard.status === "denied" || guard.status === "hidden"
      ? guard.status
      : lifecycleState === "loading" || lifecycleState === "success" || lifecycleState === "error"
        ? lifecycleState
        : guard.status;
  const lifecycleBlocksExecution = effectiveStatus === "loading" || effectiveStatus === "success";
  const disabled = guard.disabled || lifecycleBlocksExecution;
  const disabledReason =
    guard.disabled
      ? guard.reason
      : effectiveStatus === "loading"
        ? loadingLabel
        : effectiveStatus === "success"
          ? successLabel
          : undefined;
  const statusMessage =
    effectiveStatus === "loading"
      ? loadingLabel
      : effectiveStatus === "success"
        ? successLabel
        : effectiveStatus === "error"
          ? errorLabel
          : guard.disabled
            ? guard.reason
            : "Action is available after permission, validation and route scope checks.";

  if (guard.hidden) {
    return null;
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        aria-describedby={disabledReason ? disabledReasonId : statusId}
        aria-disabled={disabled}
        className={cn(
          "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
          disabled
            ? "cursor-not-allowed border border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted"
            : "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft",
          className,
        )}
        data-testid={testId}
        data-ux-action-guard-state={effectiveStatus}
        data-ux-disabled-message={disabledReason ? "accessible" : undefined}
        data-ux-disabled-reason={disabledReason}
        data-ux-lifecycle-status={effectiveStatus}
        data-ux-no-overclaim="true"
        data-ux-requires-audit={requiresAudit ? "true" : "false"}
        data-ux-requires-confirmation={requiresConfirmation ? "true" : "false"}
        data-ux-requires-permission={requiresPermission ? "true" : "false"}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        title={disabledReason}
        type="button"
      >
        {disabled ? <LockKeyhole aria-hidden="true" className="size-4" /> : null}
        {children}
        {disabledReason ? <DisabledControlReason id={disabledReasonId} reason={disabledReason} /> : null}
      </button>
      <span aria-live="polite" className="sr-only" id={statusId} role="status">
        {statusMessage}
      </span>
    </span>
  );
}
