"use client";

import Link from "next/link";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";
import {
  uxActionAttributesFor,
  uxActionClassForPriority,
  type UxActionAvailability,
  type UxActionMeaning,
  type UxActionPlacement,
  type UxActionPriority,
} from "@/lib/ux-action-hierarchy-contract";
import {
  uxPrimitiveInteractionAttributesFor,
  uxPrimitiveInteractionClassFor,
} from "@/lib/ux-design-system-foundation";

type ActionZoneLayout = "inline" | "stack" | "rail";

type ActionZoneProps = {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
  layout?: ActionZoneLayout;
  placement?: UxActionPlacement;
  testId?: string;
};

type ActionButtonProps = {
  availability?: UxActionAvailability;
  children: React.ReactNode;
  className?: string;
  describedBy?: string;
  disabled?: boolean;
  disabledReason?: string;
  href?: string;
  lifecycleResult?: string;
  lifecycleTrigger?: string;
  meaning?: UxActionMeaning;
  onClick?: () => void;
  placement?: UxActionPlacement;
  priority?: UxActionPriority;
  requiresAudit?: boolean;
  requiresConfirmation?: boolean;
  requiresPermission?: boolean;
  testId?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  visibleDisabledReason?: boolean;
};

const actionZoneLayoutClasses = {
  inline: "flex flex-wrap items-center gap-3",
  rail: "space-y-3",
  stack: "grid gap-3",
} as const satisfies Record<ActionZoneLayout, string>;

export function ActionZone({
  children,
  className,
  labelledBy,
  layout = "inline",
  placement = "inline_cluster",
  testId = "ux-action-zone",
}: ActionZoneProps) {
  return (
    <div
      aria-labelledby={labelledBy}
      className={cn(actionZoneLayoutClasses[layout], className)}
      data-testid={testId}
      data-ux-action-zone="true"
      data-ux-action-zone-layout={layout}
      data-ux-action-zone-placement={placement}
      data-ux-no-overclaim="true"
    >
      {children}
    </div>
  );
}

export function StickyActionZone(props: Omit<ActionZoneProps, "layout" | "placement">) {
  return (
    <ActionZone
      {...props}
      className={cn("lg:sticky lg:top-24", props.className)}
      layout="rail"
      placement="sticky_rail"
      testId={props.testId ?? "ux-sticky-action-zone"}
    />
  );
}

export function ActionButton({
  availability,
  children,
  className,
  describedBy,
  disabled = false,
  disabledReason,
  href,
  lifecycleResult,
  lifecycleTrigger,
  meaning = "navigate",
  onClick,
  placement = "inline_cluster",
  priority = "secondary",
  requiresAudit,
  requiresConfirmation,
  requiresPermission,
  testId,
  title,
  type = "button",
  visibleDisabledReason = false,
}: ActionButtonProps) {
  const hasExecutableTarget = Boolean(href || onClick);
  const effectiveAvailability: UxActionAvailability =
    availability ?? (disabled || !hasExecutableTarget ? "disabled" : "enabled");
  const isExecutable = effectiveAvailability === "enabled" && hasExecutableTarget && !disabled;
  const reason = disabledReason ?? (!hasExecutableTarget ? "This action is unavailable for the selected item." : undefined);
  const reasonId = reason ? disabledControlReasonId(testId ?? title ?? String(children)) : undefined;
  const actionAttributes = uxActionAttributesFor({
    availability: effectiveAvailability,
    disabledMessage: reason ? "accessible" : undefined,
    disabledReason: reason,
    meaning,
    placement,
    priority,
    requiresAudit,
    requiresConfirmation,
    requiresPermission,
  });
  const sharedProps = {
    "aria-describedby": [describedBy, reasonId].filter(Boolean).join(" ") || undefined,
    className: cn(
      uxActionClassForPriority(priority, { unavailable: !isExecutable }),
      uxPrimitiveInteractionClassFor(isExecutable ? "focus-visible" : "disabled"),
      className,
    ),
    "data-testid": testId,
    "data-ux-lifecycle-result": lifecycleResult,
    "data-ux-lifecycle-trigger": lifecycleTrigger,
    title: reason ?? title,
    ...actionAttributes,
    ...uxPrimitiveInteractionAttributesFor(isExecutable ? "focus-visible" : "disabled"),
  };
  const reasonElement = reason ? (
    <DisabledControlReason id={reasonId} reason={reason} testId="ux-action-disabled-reason" visible={visibleDisabledReason} />
  ) : null;

  if (href && isExecutable) {
    return (
      <span className={cn("inline-flex flex-col gap-1", className?.includes("w-full") ? "w-full" : "")}>
        <Link href={href} {...sharedProps}>
          {children}
        </Link>
        {reasonElement}
      </span>
    );
  }

  if (effectiveAvailability === "disabled") {
    return (
      <span className={cn("inline-flex flex-col gap-1", className?.includes("w-full") ? "w-full" : "")}>
        <button disabled onClick={undefined} type={type} {...sharedProps}>
          {children}
        </button>
        {reasonElement}
      </span>
    );
  }

  if (!isExecutable) {
    return (
      <span className={cn("inline-flex flex-col gap-1", className?.includes("w-full") ? "w-full" : "")}>
        <span aria-label={reason ? `${title ?? "Action"}: ${reason}` : title} role="status" {...sharedProps}>
          {children}
        </span>
        {reasonElement}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col gap-1", className?.includes("w-full") ? "w-full" : "")}>
      <button onClick={onClick} type={type} {...sharedProps}>
        {children}
      </button>
      {reasonElement}
    </span>
  );
}
