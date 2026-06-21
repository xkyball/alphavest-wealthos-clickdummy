"use client";

import { cn } from "@/lib/cn";

type UxCtaAction = {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  testId?: string;
};

type UxCtaClusterProps = {
  blockedReason?: string;
  className?: string;
  primary: UxCtaAction;
  secondary?: UxCtaAction[];
};

const primaryClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

export function UxCtaCluster({ blockedReason, className, primary, secondary = [] }: UxCtaClusterProps) {
  return (
    <div className={cn("space-y-2", className)} data-testid="ux-complexity-cta-cluster">
      <div className="flex flex-wrap gap-3">
        <button
          className={primaryClass}
          data-ux-primary-cta="true"
          data-testid={primary.testId ?? "ux-complexity-primary-cta"}
          disabled={primary.disabled}
          onClick={primary.onClick}
          type="button"
        >
          {primary.label}
        </button>
        {secondary.map((action) => (
          <button
            className={secondaryClass}
            data-ux-secondary-cta="true"
            data-testid={action.testId}
            disabled={action.disabled}
            key={action.label}
            onClick={action.onClick}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>
      {blockedReason ? (
        <p className="rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-complexity-cta-blocked-reason">
          {blockedReason}
        </p>
      ) : null}
    </div>
  );
}
