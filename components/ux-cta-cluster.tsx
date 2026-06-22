"use client";

import Link from "next/link";

import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";

type UxCtaAction = {
  disabled?: boolean;
  disabledReason?: string;
  href?: string;
  label: string;
  onClick?: () => void;
  testId?: string;
};

type UxCtaClusterProps = {
  blockedReason?: string;
  className?: string;
  primary: UxCtaAction;
  recoveryAction?: UxCtaAction;
  secondary?: UxCtaAction[];
};

const primaryClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const recoveryClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-gold/55 bg-alphavest-gold/10 px-4 text-sm font-semibold text-alphavest-gold-soft transition hover:border-alphavest-gold hover:bg-alphavest-gold/15";

const defaultUnwiredReason = "This action is held until an authorized lifecycle is wired.";

function CtaButton({
  action,
  className,
  kind,
}: {
  action: UxCtaAction;
  className: string;
  kind: "primary" | "recovery" | "secondary";
}) {
  const hasLifecycle = Boolean(action.href || action.onClick);
  const disabled = Boolean(action.disabled || !hasLifecycle);
  const disabledReason = action.disabledReason ?? (!hasLifecycle ? defaultUnwiredReason : undefined);
  const reasonId = disabledReason ? disabledControlReasonId(action.testId ?? action.label) : undefined;
  const dataAttrs = {
    "data-ux-disabled-message": disabledReason ? "visible" : undefined,
    "data-ux-disabled-reason": disabledReason,
    "data-ux-primary-cta": kind === "primary" ? "true" : undefined,
    "data-ux-recovery-cta": kind === "recovery" ? "true" : undefined,
    "data-ux-secondary-cta": kind === "secondary" ? "true" : undefined,
    "data-ux-interactive": disabled ? "false" : "true",
    "data-testid": action.testId ?? (kind === "primary" ? "ux-complexity-primary-cta" : undefined),
  };

  return (
    <div className="min-w-[10rem] max-w-full space-y-1">
      {action.href && !disabled ? (
        <Link aria-describedby={reasonId} className={className} href={action.href} {...dataAttrs}>
          {action.label}
        </Link>
      ) : disabled ? (
        <span
          aria-describedby={reasonId}
          aria-label={disabledReason ? `${action.label}: ${disabledReason}` : action.label}
          className={cn(className, "cursor-default opacity-65")}
          role="status"
          title={disabledReason}
          {...dataAttrs}
        >
          {action.label}
        </span>
      ) : (
        <button
          aria-describedby={reasonId}
          className={className}
          onClick={action.onClick}
          type="button"
          {...dataAttrs}
        >
          {action.label}
        </button>
      )}
      {disabledReason ? (
        <p className="max-w-[18rem]">
          <DisabledControlReason id={reasonId} reason={disabledReason} testId="ux-cta-disabled-reason" visible />
        </p>
      ) : null}
    </div>
  );
}

export function UxCtaCluster({ blockedReason, className, primary, recoveryAction, secondary = [] }: UxCtaClusterProps) {
  return (
    <div className={cn("space-y-2", className)} data-testid="ux-complexity-cta-cluster">
      <div className="flex flex-wrap gap-3">
        <CtaButton action={primary} className={primaryClass} kind="primary" />
        {secondary.map((action) => <CtaButton action={action} className={secondaryClass} key={action.label} kind="secondary" />)}
        {recoveryAction ? <CtaButton action={recoveryAction} className={recoveryClass} kind="recovery" /> : null}
      </div>
      {blockedReason ? (
        <p className="rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-complexity-cta-blocked-reason">
          {blockedReason}
        </p>
      ) : null}
    </div>
  );
}
