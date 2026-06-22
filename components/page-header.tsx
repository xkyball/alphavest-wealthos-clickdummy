import Link from "next/link";
import { ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { WizardStepper, type WizardStep } from "@/components/ui/wizard-stepper";
import { cn } from "@/lib/cn";

export type PageHeaderAction = {
  disabledReason?: string;
  href?: string;
  label: string;
  onClick?: () => void;
};

type PageHeaderProps = {
  blockedReason?: string;
  eyebrow?: string;
  primaryAction?: PageHeaderAction;
  recoveryAction?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
  status?: StatusChipStatus;
  statusLabel?: string;
  steps?: WizardStep[];
  title: string;
  description: string;
};

function HeaderAction({ action, primary = false, recovery = false }: { action: PageHeaderAction; primary?: boolean; recovery?: boolean }) {
  const className = cn(
    "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
    primary
      ? "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft"
      : "border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-ivory hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft",
    action.disabledReason && "cursor-not-allowed opacity-60 hover:border-alphavest-border hover:text-alphavest-ivory"
  );

  if (action.disabledReason || !action.href) {
    return (
      <button
        className={className}
        data-ux-cta-kind={primary ? "primary" : recovery ? "recovery" : "secondary"}
        data-ux-primary-cta={primary ? "true" : undefined}
        data-ux-secondary-cta={!primary ? "true" : undefined}
        disabled={Boolean(action.disabledReason)}
        onClick={action.onClick}
        type="button"
      >
        {action.disabledReason ? <LockKeyhole aria-hidden="true" className="size-4" /> : null}
        {action.label}
        {primary && !action.disabledReason ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
        {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
      </button>
    );
  }

  return (
    <Link
      className={className}
      data-ux-cta-kind={primary ? "primary" : recovery ? "recovery" : "secondary"}
      data-ux-primary-cta={primary ? "true" : undefined}
      data-ux-secondary-cta={!primary ? "true" : undefined}
      href={action.href}
    >
      {action.label}
      {primary ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}

export function PageHeader({
  blockedReason,
  eyebrow,
  primaryAction,
  recoveryAction,
  secondaryActions = [],
  status = "PENDING",
  statusLabel,
  steps = [],
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4" data-testid="page-header">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-alphavest-ivory md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-alphavest-muted md:text-base">
            {description}
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2 lg:items-end">
          <StatusChip label={statusLabel ?? "No unapproved advice reaches the client"} status={status} />
          {primaryAction ? (
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              <HeaderAction action={primaryAction} primary />
              {secondaryActions.slice(0, 2).map((action) => (
                <HeaderAction action={action} key={`${action.href ?? action.label}:${action.label}`} />
              ))}
            </div>
          ) : null}
          {blockedReason ? (
            <div className="max-w-sm text-left text-xs leading-5 text-alphavest-subtle lg:text-right" data-testid="page-header-cta-blocked-reason">
              <p>{blockedReason}</p>
              {recoveryAction ? (
                <div className="mt-2 flex justify-start lg:justify-end">
                  <HeaderAction action={recoveryAction} recovery />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {steps.length > 0 ? (
        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
          <WizardStepper steps={steps} />
        </div>
      ) : null}
    </header>
  );
}
