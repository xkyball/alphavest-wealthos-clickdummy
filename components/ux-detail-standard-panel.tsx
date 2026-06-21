"use client";

import { cn } from "@/lib/cn";
import { uxDensityForPageId } from "@/lib/ux-density";

type UxDetailFact = {
  label: string;
  value: string;
};

export type UxDetailStandardPanelProps = {
  actionLabel: string;
  actionState: string;
  className?: string;
  evidenceItems: string[];
  facts: UxDetailFact[];
  objectTitle: string;
  objectType: string;
  routeId: string;
  safetyNote: string;
  status: string;
  timelineItems: string[];
};

export function UxDetailStandardPanel({
  actionLabel,
  actionState,
  className,
  evidenceItems,
  facts,
  objectTitle,
  objectType,
  routeId,
  safetyNote,
  status,
  timelineItems,
}: UxDetailStandardPanelProps) {
  const density = uxDensityForPageId(routeId);

  return (
    <section
      className={cn("grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-4 xl:grid-cols-[1.1fr_1.2fr_0.9fr]", className)}
      data-testid="ux-page-detail-standard"
      data-ux-density-pattern={density.pattern}
      data-ux-density-tier={density.tier}
    >
      <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-4" data-testid="ux-page-detail-object-header" data-ux-content-tier="must-see">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{routeId} · {objectType}</p>
        <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-alphavest-gold-soft">{status}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2" data-testid="ux-page-detail-key-facts">
          {facts.map((fact) => (
            <div className="border-l border-alphavest-border/70 pl-3" key={fact.label}>
              <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{fact.label}</p>
              <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2" data-testid="ux-page-detail-evidence-timeline" data-ux-content-tier="secondary">
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Evidence basis</p>
          <div className="mt-3 space-y-2">
            {evidenceItems.map((item) => (
              <p className="rounded-md border border-alphavest-border/55 bg-alphavest-navy/35 px-3 py-2 text-sm leading-5 text-alphavest-muted" key={item}>{item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Audit / timeline</p>
          <div className="mt-3 space-y-2">
            {timelineItems.map((item) => (
              <p className="rounded-md border border-alphavest-border/55 bg-alphavest-navy/35 px-3 py-2 text-sm leading-5 text-alphavest-muted" key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="ux-page-detail-gated-action-rail" data-ux-content-tier="must-see">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">Gated action rail</p>
        <p className="mt-3 text-lg font-semibold text-alphavest-ivory">{actionLabel}</p>
        <p className="mt-2 text-sm leading-6 text-alphavest-muted">{actionState}</p>
        <p className="mt-3 rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-gold-soft">{safetyNote}</p>
      </div>
    </section>
  );
}
