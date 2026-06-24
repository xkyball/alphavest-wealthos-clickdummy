import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock3,
  PauseCircle,
  ShieldAlert
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type WorkflowBadgeStatus =
  | "ADVISOR_APPROVED"
  | "ADVISOR_REJECTED"
  | "ADVISOR_REVIEW"
  | "COMPLIANCE_BLOCKED"
  | "COMPLIANCE_RELEASE"
  | "EVIDENCE_PENDING"
  | "EVIDENCE_READY"
  | "APPROVED"
  | "BLOCKED"
  | "ESCALATED"
  | "IN_PROGRESS"
  | "NOT_STARTED"
  | "ON_HOLD"
  | "REJECTED"
  | "RESOLVED"
  | "REVIEW";

type WorkflowBadgeProps = {
  className?: string;
  label?: string;
  sourceDescription?: string;
  status: WorkflowBadgeStatus;
};

const workflowMeta: Record<WorkflowBadgeStatus, { icon: LucideIcon; label: string; tone: BadgeTone }> = {
  ADVISOR_APPROVED: { icon: CheckCircle2, label: "Advisor approved, release pending", tone: "blue" },
  ADVISOR_REJECTED: { icon: AlertCircle, label: "Advisor rejected", tone: "red" },
  ADVISOR_REVIEW: { icon: Clock3, label: "Advisor review", tone: "gold" },
  COMPLIANCE_BLOCKED: { icon: ShieldAlert, label: "Compliance blocked", tone: "red" },
  COMPLIANCE_RELEASE: { icon: CheckCircle2, label: "Compliance release recorded", tone: "teal" },
  EVIDENCE_PENDING: { icon: Clock3, label: "Evidence pending", tone: "gold" },
  EVIDENCE_READY: { icon: CheckCircle2, label: "Evidence review ready", tone: "green" },
  APPROVED: { icon: CheckCircle2, label: "Approved", tone: "green" },
  BLOCKED: { icon: ShieldAlert, label: "Blocked", tone: "purple" },
  ESCALATED: { icon: AlertCircle, label: "Escalated", tone: "red" },
  IN_PROGRESS: { icon: Clock3, label: "In Progress", tone: "blue" },
  NOT_STARTED: { icon: Circle, label: "Not Started", tone: "muted" },
  ON_HOLD: { icon: PauseCircle, label: "On Hold", tone: "gold" },
  REJECTED: { icon: AlertCircle, label: "Rejected", tone: "red" },
  RESOLVED: { icon: CheckCircle2, label: "Resolved", tone: "teal" },
  REVIEW: { icon: Clock3, label: "Review", tone: "gold" }
};

export function WorkflowBadge({ className, label, sourceDescription = "Workflow badge is a visual summary, not a completion gate.", status }: WorkflowBadgeProps) {
  const meta = workflowMeta[status];
  const Icon = meta.icon;
  const visibleLabel = label ?? meta.label;

  return (
    <Badge
      ariaLabel={`Workflow status: ${visibleLabel}. ${sourceDescription}`}
      className={cn("gap-1.5", className)}
      data-ux-completion-gate="false"
      data-ux-state-source={sourceDescription}
      tone={meta.tone}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span data-ux-affordance="static-workflow-badge" data-ux-interactive="false">
        {visibleLabel}
      </span>
    </Badge>
  );
}
