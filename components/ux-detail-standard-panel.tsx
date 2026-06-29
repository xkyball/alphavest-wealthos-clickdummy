"use client";

import { cn } from "@/lib/cn";
import { uxDensityForPageId } from "@/lib/ux-density";
import { uxPageTemplateForPageId } from "@/lib/ux-page-template-system";
import { uxRouteShellPageJobDataAttributesForTemplate } from "@/lib/ux-route-shell-page-job-contract";

type UxDetailFact = {
  label: string;
  value: string;
};

export type UxDetailStandardPanelProps = {
  actionLabel: string;
  actionState: string;
  className?: string;
  compact?: boolean;
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
  compact = false,
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
  const template = uxPageTemplateForPageId(routeId);
  const routeShellPageJobAttributes = uxRouteShellPageJobDataAttributesForTemplate(template);
  const isFocusedDetail = density.tier === "D4";

  if (compact) {
    return (
      <section
        className={cn("grid gap-2 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-3 xl:grid-cols-[1fr_1fr_0.85fr]", className)}
        data-ux-d4-focused-detail={isFocusedDetail ? "true" : undefined}
        {...routeShellPageJobAttributes}
        data-testid="ux-page-detail-standard"
        data-ux-density-pattern={density.pattern}
        data-ux-density-tier={density.tier}
        data-ux-page-template-action-zone={template.actionZoneBehavior}
        data-ux-page-template-family={template.family}
        data-ux-page-template-long-page={template.longPageBehavior}
        data-ux-page-template-proof-audit={template.proofAuditPlacement}
        data-ux-page-template-required-zones={template.requiredZones.join(" ")}
      >
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2.5" data-testid="ux-page-detail-object-header">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{objectType}</p>
          <h2 className="mt-1 line-clamp-1 font-display text-lg text-alphavest-ivory">{objectTitle}</h2>
          <p className="mt-1 text-xs font-semibold text-alphavest-gold-soft">{status}</p>
          <div className="mt-2 grid gap-1.5 text-xs" data-testid="ux-page-detail-key-facts">
            {facts.slice(0, 3).map((fact) => (
              <div className="flex justify-between gap-3 border-b border-alphavest-border/45 pb-1 last:border-0" key={fact.label}>
                <span className="text-alphavest-muted">{fact.label}</span>
                <span className="text-right font-semibold text-alphavest-ivory">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-2 rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2.5 md:grid-cols-2" data-testid="ux-page-detail-evidence-timeline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Evidence</p>
            <p className="mt-1 text-xs leading-5 text-alphavest-muted">{evidenceItems.slice(0, 2).join(" / ")}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Timeline</p>
            <p className="mt-1 text-xs leading-5 text-alphavest-muted">{timelineItems.slice(0, 2).join(" / ")}</p>
          </div>
        </div>
        <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2.5" data-testid="ux-page-detail-gated-action-rail">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">Actions</p>
          <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{actionLabel}</p>
          <p className="mt-1 text-xs leading-5 text-alphavest-muted">{actionState}</p>
          <p className="mt-1 text-xs leading-5 text-alphavest-gold-soft">{safetyNote}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-4",
        isFocusedDetail
          ? "xl:grid-cols-[minmax(18rem,0.95fr)_minmax(22rem,1.2fr)_minmax(18rem,0.85fr)]"
          : "xl:grid-cols-[1.1fr_1.2fr_0.9fr]",
        className
      )}
      data-ux-d4-focused-detail={isFocusedDetail ? "true" : undefined}
      {...routeShellPageJobAttributes}
      data-testid="ux-page-detail-standard"
      data-ux-density-pattern={density.pattern}
      data-ux-density-tier={density.tier}
      data-ux-page-template-action-zone={template.actionZoneBehavior}
      data-ux-page-template-family={template.family}
      data-ux-page-template-long-page={template.longPageBehavior}
      data-ux-page-template-proof-audit={template.proofAuditPlacement}
      data-ux-page-template-required-zones={template.requiredZones.join(" ")}
    >
      {isFocusedDetail ? (
        <div
          className="grid gap-2 rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/55 p-3 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-[1.1fr_0.8fr_1fr_1.2fr]"
          data-testid="ux-d4-focused-status-strip"
          data-ux-content-tier="must-see"
          data-ux-long-page-anchor="summary"
          data-ux-template-zone="summary"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Object</p>
            <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{objectTitle}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Status</p>
            <p className="mt-1 text-sm font-semibold text-alphavest-gold-soft">{status}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Next action</p>
            <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{actionLabel}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Check</p>
            <p className="mt-1 text-sm leading-5 text-alphavest-muted">{safetyNote}</p>
          </div>
        </div>
      ) : null}

      <div
        className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-4"
        data-testid="ux-page-detail-object-header"
        data-ux-content-tier="must-see"
        data-ux-long-page-anchor="primary"
        data-ux-template-zone="primary_content"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{objectType}</p>
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
      <div
        className="grid gap-3 md:grid-cols-2"
        data-testid="ux-page-detail-evidence-timeline"
        data-ux-content-tier="secondary"
        data-ux-long-page-anchor="proof-audit"
        data-ux-template-zone="proof_audit_zone"
      >
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
      <div
        className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4"
        data-testid="ux-page-detail-gated-action-rail"
        data-ux-content-tier="must-see"
        data-ux-long-page-region="sticky_action"
        data-ux-sticky-action-zone="true"
        data-ux-template-zone="action_zone"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">Actions</p>
        <p className="mt-3 text-lg font-semibold text-alphavest-ivory">{actionLabel}</p>
        <p className="mt-2 text-sm leading-6 text-alphavest-muted">{actionState}</p>
        <p className="mt-3 rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-gold-soft">{safetyNote}</p>
      </div>
    </section>
  );
}
