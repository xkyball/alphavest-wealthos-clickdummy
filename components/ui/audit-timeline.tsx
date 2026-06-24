import { CheckCircle2, Clock3, DatabaseZap, EyeOff, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AuditResult } from "@/lib/domain-types";
import { StatePanel, type ComponentState } from "@/components/ui/state-panel";

type AuditTimelineItem = {
  actor: string;
  id: string;
  result: Extract<AuditResult, "BLOCKED" | "PENDING" | "SUCCESS">;
  sourceRef?: string;
  sourceState?: "display-only" | "pending" | "source-backed" | "unavailable";
  timestamp: string;
  title: string;
};

type AuditTimelineProps = {
  emptyDetail?: string;
  emptyTitle?: string;
  items: AuditTimelineItem[];
  state?: ComponentState | "ready";
};

const resultMeta: Record<AuditTimelineItem["result"], { icon: LucideIcon; style: string }> = {
  BLOCKED: { icon: ShieldAlert, style: "border-alphavest-red bg-alphavest-red/10 text-alphavest-red" },
  PENDING: { icon: Clock3, style: "border-alphavest-gold bg-alphavest-gold/10 text-alphavest-gold" },
  SUCCESS: { icon: CheckCircle2, style: "border-alphavest-green bg-alphavest-green/10 text-alphavest-green" }
};

const sourceStateMeta: Record<NonNullable<AuditTimelineItem["sourceState"]>, { icon: LucideIcon; label: string; style: string }> = {
  "display-only": {
    icon: EyeOff,
    label: "Display-only context",
    style: "border-alphavest-border bg-alphavest-charcoal/65 text-alphavest-muted",
  },
  pending: {
    icon: Clock3,
    label: "Audit pending",
    style: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold",
  },
  "source-backed": {
    icon: DatabaseZap,
    label: "Audit recorded",
    style: "border-alphavest-green/45 bg-alphavest-green/10 text-alphavest-green",
  },
  unavailable: {
    icon: ShieldAlert,
    label: "Audit unavailable",
    style: "border-alphavest-red/45 bg-alphavest-red/10 text-alphavest-red",
  },
};

function timelineSourceState(items: AuditTimelineItem[]) {
  const states = new Set(items.map((item) => item.sourceState ?? "display-only"));

  return states.size === 1 ? [...states][0] : "mixed";
}

export function AuditTimeline({
  emptyDetail = "No audit events recorded for this scope yet.",
  emptyTitle = "No audit events",
  items,
  state = "ready",
}: AuditTimelineProps) {
  if (state !== "ready") {
    return <StatePanel detail={emptyDetail} state={state} title={emptyTitle} />;
  }

  if (items.length === 0) {
    return <StatePanel detail={emptyDetail} state="empty" title={emptyTitle} />;
  }

  return (
    <ol
      aria-label="Audit timeline"
      className="relative space-y-4 border-l border-alphavest-border pl-5"
      data-testid="ux-phase5-audit-timeline"
      data-ux-affordance="static-audit-timeline"
      data-ux-audit-proof={timelineSourceState(items) === "source-backed" ? "persisted-source-backed" : "not-persistence-proof"}
      data-ux-audit-source-state={timelineSourceState(items)}
      data-ux-interactive="false"
      data-ux-phase5-task="UX-DETAIL-005"
      data-ux-phase5-detail-support="audit-object-state"
    >
      {items.map((item) => {
        const meta = resultMeta[item.result];
        const sourceState = item.sourceState ?? "display-only";
        const sourceMeta = sourceStateMeta[sourceState];
        const Icon = meta.icon;
        const SourceIcon = sourceMeta.icon;

        return (
          <li
            className="relative"
            data-ux-affordance="static-timeline-item"
            data-ux-audit-proof={sourceState === "source-backed" ? "persisted-source-backed" : "not-persistence-proof"}
            data-ux-audit-source-ref={item.sourceRef}
            data-ux-audit-source-state={sourceState}
            data-ux-interactive="false"
            key={item.id}
          >
            <span
              className={cn(
                "absolute -left-[2rem] grid size-7 place-items-center rounded-full border",
                meta.style
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-alphavest-ivory">{item.title}</h3>
                <span className="text-xs text-alphavest-subtle">{item.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-alphavest-muted">{item.actor}</p>
              <div className={cn("mt-3 inline-flex max-w-full items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold", sourceMeta.style)}>
                <SourceIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span>{sourceMeta.label}</span>
                {item.sourceRef ? <span className="truncate text-alphavest-subtle">#{item.sourceRef}</span> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
