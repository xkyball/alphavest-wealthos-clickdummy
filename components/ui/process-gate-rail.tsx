import { LockKeyhole, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge, type BadgeTone } from "@/components/ui/badge";

export type ProcessGateRailItem = {
  detail: string;
  label: string;
  tone: BadgeTone;
  value: string;
};

type ProcessGateRailProps = {
  actionLabel: string;
  actionState: string;
  acceptanceIds?: readonly string[];
  blockedReason?: string;
  businessProcessIds?: readonly string[];
  className?: string;
  currentStep?: string;
  gateState: string;
  gateIds?: readonly string[];
  items: ProcessGateRailItem[];
  nextStep: string;
  testId?: string;
  title: string;
  tone?: "blocked" | "ready" | "restricted";
};

const processAttributeValue = (values?: readonly string[]) => values?.join(" ");

const toneClasses = {
  blocked: "border-alphavest-red/40 bg-alphavest-red/10",
  ready: "border-alphavest-green/35 bg-alphavest-green/10",
  restricted: "border-alphavest-gold/35 bg-alphavest-gold/10",
} as const;

const iconClasses = {
  blocked: "border-alphavest-red/40 bg-alphavest-red/10 text-alphavest-red",
  ready: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
  restricted: "border-alphavest-gold/35 bg-alphavest-gold/10 text-alphavest-gold",
} as const;

export function ProcessGateRail({
  actionLabel,
  actionState,
  acceptanceIds,
  blockedReason,
  businessProcessIds,
  className,
  currentStep,
  gateState,
  gateIds,
  items,
  nextStep,
  testId = "process-gate-rail",
  title,
  tone = "blocked",
}: ProcessGateRailProps) {
  const Icon = tone === "ready" ? ShieldCheck : LockKeyhole;

  return (
    <section
      className={cn("rounded-md border p-4", toneClasses[tone], className)}
      data-testid={testId}
      data-ux-process-acceptance-gates={processAttributeValue(acceptanceIds)}
      data-ux-process-blocked-reason={blockedReason}
      data-ux-process-business-processes={processAttributeValue(businessProcessIds)}
      data-ux-process-current-step={currentStep}
      data-ux-process-first="true"
      data-ux-process-gate-state={gateState}
      data-ux-process-gate-ids={processAttributeValue(gateIds)}
      data-ux-process-next-step={nextStep}
    >
      <div className="flex items-start gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-md border", iconClasses[tone])}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-alphavest-ivory">{title}</h2>
            <Badge tone={tone === "ready" ? "green" : tone === "restricted" ? "gold" : "red"}>{gateState}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{actionState}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" key={item.label}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">{item.label}</p>
              <Badge tone={item.tone}>{item.value}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">{item.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-alphavest-border/65 bg-alphavest-navy/35 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Next permitted action</p>
        <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{actionLabel}</p>
        <p className="mt-1 text-xs leading-5 text-alphavest-muted">{nextStep}</p>
      </div>
    </section>
  );
}
