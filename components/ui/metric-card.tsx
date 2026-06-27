import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { cn } from "@/lib/cn";
import { uxPrimitiveTextClassFor } from "@/lib/ux-design-system-foundation";

type MetricCardProps = {
  className?: string;
  delta?: string;
  detail: string;
  label: string;
  status?: StatusChipStatus;
  trend?: "down" | "flat" | "up";
  value: string;
};

export function MetricCard({
  className,
  delta,
  detail,
  label,
  status,
  trend = "flat",
  value
}: MetricCardProps) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card
      className={cn("min-h-36", className)}
      data-ux-affordance="static-metric-card"
      data-ux-interactive="false"
      density="default"
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={cn("min-w-0 text-sm", uxPrimitiveTextClassFor("metadata"))}>{label}</p>
          {status ? <StatusChip status={status} /> : null}
        </div>
        <p className="mt-3 text-3xl font-semibold text-alphavest-ivory">{value}</p>
      </div>
      <p className={cn("av-readable-secondary mt-3 text-sm", uxPrimitiveTextClassFor("body"))}>{detail}</p>
      {delta ? (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-alphavest-green">
          <TrendIcon aria-hidden="true" className="size-4" />
          {delta}
        </div>
      ) : null}
    </Card>
  );
}
