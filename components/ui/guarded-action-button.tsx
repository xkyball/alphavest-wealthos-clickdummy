import { LockKeyhole } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UiActionGuard } from "@/lib/ui-clickflow-guards";

type GuardedActionButtonProps = {
  children: React.ReactNode;
  className?: string;
  guard: UiActionGuard;
  onClick?: () => void;
};

export function GuardedActionButton({ children, className, guard, onClick }: GuardedActionButtonProps) {
  if (guard.hidden) {
    return null;
  }

  return (
    <button
      aria-disabled={guard.disabled}
      className={cn(
        "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        guard.disabled
          ? "cursor-not-allowed border border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted"
          : "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft",
        className,
      )}
      disabled={guard.disabled}
      onClick={guard.disabled ? undefined : onClick}
      title={guard.disabled ? guard.reason : undefined}
      type="button"
    >
      {guard.disabled ? <LockKeyhole aria-hidden="true" className="size-4" /> : null}
      {children}
    </button>
  );
}
