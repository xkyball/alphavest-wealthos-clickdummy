"use client";

import { UxActionRail } from "@/components/ux-action-rail";
import { cn } from "@/lib/cn";
import { uxDensityForPageId } from "@/lib/ux-density";

type ComplexityItem = {
  detail: string;
  label: string;
  value: string;
};

export type UxComplexityPriorityPanelProps = {
  actionLabel: string;
  actionState: string;
  className?: string;
  priorityItems: ComplexityItem[];
  routeId?: string;
  safetyNote: string;
  summaryItems: ComplexityItem[];
  title: string;
};

export function UxComplexityPriorityPanel({
  actionLabel,
  actionState,
  className,
  priorityItems,
  routeId,
  safetyNote,
  summaryItems,
  title,
}: UxComplexityPriorityPanelProps) {
  const density = routeId ? uxDensityForPageId(routeId) : null;

  return (
    <section
      className={cn("grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-4 xl:grid-cols-[1fr_1.25fr_0.9fr]", className)}
      data-testid="ux-complexity-priority-panel"
      data-ux-density-pattern={density?.pattern}
      data-ux-density-tier={density?.tier}
    >
      <div data-testid="ux-complexity-summary-strip" data-ux-content-tier="must-see">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{title}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
          {summaryItems.map((item) => (
            <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3" key={item.label}>
              <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-alphavest-ivory">{item.value}</p>
              <p className="mt-1 text-xs leading-5 text-alphavest-subtle">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-4" data-testid="ux-complexity-priority-queue" data-ux-content-tier="secondary">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Priority queue</p>
        <div className="mt-3 grid gap-2">
          {priorityItems.map((item) => (
            <div className="grid gap-2 rounded-md border border-alphavest-border/55 bg-alphavest-navy/35 p-3 text-sm md:grid-cols-[7rem_1fr_auto]" key={item.label}>
              <p className="font-semibold text-alphavest-gold-soft">{item.value}</p>
              <p className="font-semibold text-alphavest-ivory">{item.label}</p>
              <p className="text-alphavest-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <UxActionRail
        actionLabel={actionLabel}
        actionState={actionState}
        safetyNote={safetyNote}
        testId="ux-complexity-action-rail"
      />
    </section>
  );
}
