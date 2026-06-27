"use client";

import { cn } from "@/lib/cn";
import {
  uxActionAttributesFor,
  type UxActionMeaning,
  type UxActionPlacement,
  type UxActionPriority,
} from "@/lib/ux-action-hierarchy-contract";

type UxActionRailProps = {
  actionLabel: string;
  actionState: string;
  className?: string;
  meaning?: UxActionMeaning;
  placement?: Extract<UxActionPlacement, "adjacent_rail" | "sticky_rail">;
  priority?: Extract<UxActionPriority, "blocked" | "primary" | "recovery" | "secondary">;
  safetyNote: string;
  testId?: string;
  title?: string;
};

export function UxActionRail({
  actionLabel,
  actionState,
  className,
  meaning = "navigate",
  placement = "adjacent_rail",
  priority = "blocked",
  safetyNote,
  testId = "ux-action-rail",
  title = "Action rail",
}: UxActionRailProps) {
  const actionAttributes = uxActionAttributesFor({
    availability: "blocked_static",
    disabledReason: actionState,
    meaning,
    placement,
    priority,
    requiresPermission: false,
  });

  return (
    <div
      className={cn("rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4", className)}
      data-testid={testId}
      data-ux-content-tier="must-see"
      data-ux-rail-kind={placement}
      {...actionAttributes}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">{title}</p>
      <p className="mt-3 text-lg font-semibold text-alphavest-ivory">{actionLabel}</p>
      <p className="mt-2 text-sm leading-6 text-alphavest-muted">{actionState}</p>
      <p className="mt-3 rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-gold-soft">{safetyNote}</p>
    </div>
  );
}
