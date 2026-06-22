import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  PauseCircle,
  XCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { BadgeTone } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";

export type StatusChipStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "CANCELLED"
  | "COMPLETED"
  | "DRAFT"
  | "FAILED"
  | "INACTIVE"
  | "ON_HOLD"
  | "PENDING"
  | "PROCESSING"
  | "SCHEDULED"
  | "UNKNOWN";

type StatusChipProps = {
  className?: string;
  label?: string;
  status: StatusChipStatus;
};

const statusMeta: Record<StatusChipStatus, { icon: LucideIcon; label: string; tone: BadgeTone }> = {
  ACTIVE: { icon: CheckCircle2, label: "Active", tone: "green" },
  ARCHIVED: { icon: Archive, label: "Archived", tone: "muted" },
  CANCELLED: { icon: XCircle, label: "Cancelled", tone: "muted" },
  COMPLETED: { icon: CheckCircle2, label: "Completed", tone: "teal" },
  DRAFT: { icon: Circle, label: "Draft", tone: "muted" },
  FAILED: { icon: XCircle, label: "Failed", tone: "red" },
  INACTIVE: { icon: PauseCircle, label: "Inactive", tone: "muted" },
  ON_HOLD: { icon: PauseCircle, label: "On Hold", tone: "gold" },
  PENDING: { icon: Clock3, label: "Pending", tone: "gold" },
  PROCESSING: { icon: LoaderCircle, label: "Processing", tone: "blue" },
  SCHEDULED: { icon: Clock3, label: "Scheduled", tone: "purple" },
  UNKNOWN: { icon: AlertTriangle, label: "Unknown", tone: "muted" }
};

export function StatusChip({ className, label, status }: StatusChipProps) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  const visibleLabel = label ?? meta.label;

  return (
    <Badge
      ariaLabel={`Status: ${visibleLabel}`}
      className={cn("gap-1.5", className)}
      tone={meta.tone}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span data-ux-affordance="static-status-chip" data-ux-interactive="false">
        {visibleLabel}
      </span>
    </Badge>
  );
}
