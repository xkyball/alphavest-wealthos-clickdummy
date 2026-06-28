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
import type { UxPrimitiveStatusFamily } from "@/lib/ux-design-system-foundation";
import type { UxComponentState } from "@/lib/ux-lifecycle-state-contract";
import { uxStatusCommandAttributesFor } from "@/lib/ux-status-command-hierarchy";

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
  sourceDescription?: string;
  status: StatusChipStatus;
};

const statusMeta: Record<StatusChipStatus, { family: UxPrimitiveStatusFamily; icon: LucideIcon; label: string; tone: BadgeTone }> = {
  ACTIVE: { family: "success", icon: CheckCircle2, label: "Active", tone: "green" },
  ARCHIVED: { family: "neutral", icon: Archive, label: "Archived", tone: "muted" },
  CANCELLED: { family: "neutral", icon: XCircle, label: "Cancelled", tone: "muted" },
  COMPLETED: { family: "success", icon: CheckCircle2, label: "Completed", tone: "teal" },
  DRAFT: { family: "neutral", icon: Circle, label: "Draft", tone: "muted" },
  FAILED: { family: "critical", icon: XCircle, label: "Failed", tone: "red" },
  INACTIVE: { family: "neutral", icon: PauseCircle, label: "Inactive", tone: "muted" },
  ON_HOLD: { family: "warning", icon: PauseCircle, label: "On Hold", tone: "gold" },
  PENDING: { family: "warning", icon: Clock3, label: "Pending", tone: "gold" },
  PROCESSING: { family: "info", icon: LoaderCircle, label: "Processing", tone: "blue" },
  SCHEDULED: { family: "restricted", icon: Clock3, label: "Scheduled", tone: "purple" },
  UNKNOWN: { family: "neutral", icon: AlertTriangle, label: "Unknown", tone: "muted" }
};

const statusComponentState: Record<StatusChipStatus, UxComponentState> = {
  ACTIVE: "success",
  ARCHIVED: "reference-only",
  CANCELLED: "blocked",
  COMPLETED: "success",
  DRAFT: "reference-only",
  FAILED: "error",
  INACTIVE: "restricted",
  ON_HOLD: "hold-blocked",
  PENDING: "validation",
  PROCESSING: "loading",
  SCHEDULED: "p1-deferred",
  UNKNOWN: "validation",
};

export function StatusChip({ className, label, sourceDescription = "Status chip is a visual summary, not a completion gate.", status }: StatusChipProps) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  const visibleLabel = label ?? meta.label;
  const statusAttributes = uxStatusCommandAttributesFor({
    componentState: statusComponentState[status],
    primitiveFamily: "status",
    reason: sourceDescription,
    recoveryAction: status === "FAILED" || status === "ON_HOLD" || status === "PENDING" || status === "UNKNOWN" ? "retry" : undefined,
  });

  return (
    <Badge
      ariaLabel={`Status: ${visibleLabel}. ${sourceDescription}`}
      className={cn("gap-1.5", className)}
      data-ux-completion-gate="false"
      data-ux-state-source={sourceDescription}
      {...statusAttributes}
      statusCue="none"
      statusFamily={meta.family}
      tone={meta.tone}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span data-ux-affordance="static-status-chip" data-ux-interactive="false">
        {visibleLabel}
      </span>
    </Badge>
  );
}
