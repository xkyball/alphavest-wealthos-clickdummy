import { LockKeyhole } from "lucide-react";
import { useId } from "react";
import { DisabledControlReason } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";
import type { UiActionGuard } from "@/lib/ui-clickflow-guards";

type GuardedActionButtonProps = {
  children: React.ReactNode;
  className?: string;
  guard: UiActionGuard;
  onClick?: () => void;
};

export function GuardedActionButton({ children, className, guard, onClick }: GuardedActionButtonProps) {
  const disabledReasonId = useId();

  if (guard.hidden) {
    return null;
  }

  return (
    <button
      aria-describedby={guard.disabled ? disabledReasonId : undefined}
      aria-disabled={guard.disabled}
      className={cn(
        "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        guard.disabled
          ? "cursor-not-allowed border border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted"
          : "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft",
        className,
      )}
      data-ux-disabled-message={guard.disabled ? "accessible" : undefined}
      data-ux-disabled-reason={guard.disabled ? guard.reason : undefined}
      disabled={guard.disabled}
      onClick={guard.disabled ? undefined : onClick}
      title={guard.disabled ? guard.reason : undefined}
      type="button"
    >
      {guard.disabled ? <LockKeyhole aria-hidden="true" className="size-4" /> : null}
      {children}
      {guard.disabled ? <DisabledControlReason id={disabledReasonId} reason={guard.reason} /> : null}
    </button>
  );
}
