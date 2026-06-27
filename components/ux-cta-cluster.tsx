"use client";

import Link from "next/link";

import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";
import {
  uxActionAttributesFor,
  uxActionClassForPriority,
  uxDefaultUnwiredActionReason,
  type UxActionMeaning,
  type UxActionPriority,
} from "@/lib/ux-action-hierarchy-contract";

type UxCtaAction = {
  disabled?: boolean;
  disabledReason?: string;
  href?: string;
  label: string;
  meaning?: UxActionMeaning;
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

function CtaButton({
  action,
  priority,
}: {
  action: UxCtaAction;
  priority: Extract<UxActionPriority, "primary" | "recovery" | "secondary">;
}) {
  const hasLifecycle = Boolean(action.href || action.onClick);
  const disabled = Boolean(action.disabled || !hasLifecycle);
  const disabledReason = action.disabledReason ?? (!hasLifecycle ? uxDefaultUnwiredActionReason : undefined);
  const reasonId = disabledReason ? disabledControlReasonId(action.testId ?? action.label) : undefined;
  const className = uxActionClassForPriority(priority);
  const dataAttrs = {
    ...uxActionAttributesFor({
      availability: disabled ? "blocked_static" : "enabled",
      disabledMessage: "visible",
      disabledReason,
      meaning: action.meaning,
      placement: "inline_cluster",
      priority,
    }),
    "data-ux-interactive": disabled ? "false" : "true",
    "data-testid": action.testId ?? (priority === "primary" ? "ux-complexity-primary-cta" : undefined),
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
        <CtaButton action={primary} priority="primary" />
        {secondary.map((action) => <CtaButton action={action} key={action.label} priority="secondary" />)}
        {recoveryAction ? <CtaButton action={recoveryAction} priority="recovery" /> : null}
      </div>
      {blockedReason ? (
        <p className="rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-complexity-cta-blocked-reason">
          {blockedReason}
        </p>
      ) : null}
    </div>
  );
}
