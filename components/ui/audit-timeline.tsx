import { CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AuditResult } from "@/lib/domain-types";

type AuditTimelineItem = {
  actor: string;
  id: string;
  result: Extract<AuditResult, "BLOCKED" | "PENDING" | "SUCCESS">;
  timestamp: string;
  title: string;
};

type AuditTimelineProps = {
  items: AuditTimelineItem[];
};

const resultMeta: Record<AuditTimelineItem["result"], { icon: LucideIcon; style: string }> = {
  BLOCKED: { icon: ShieldAlert, style: "border-alphavest-red bg-alphavest-red/10 text-alphavest-red" },
  PENDING: { icon: Clock3, style: "border-alphavest-gold bg-alphavest-gold/10 text-alphavest-gold" },
  SUCCESS: { icon: CheckCircle2, style: "border-alphavest-green bg-alphavest-green/10 text-alphavest-green" }
};

export function AuditTimeline({ items }: AuditTimelineProps) {
  return (
    <ol className="relative space-y-4 border-l border-alphavest-border pl-5" data-testid="ux-phase5-audit-timeline" data-ux-phase5-task="UX-DETAIL-005" data-ux-phase5-detail-support="audit-object-state">
      {items.map((item) => {
        const meta = resultMeta[item.result];
        const Icon = meta.icon;

        return (
          <li className="relative" key={item.id}>
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
            </div>
          </li>
        );
      })}
    </ol>
  );
}
