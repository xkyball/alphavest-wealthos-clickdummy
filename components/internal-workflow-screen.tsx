"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Circle,
  Download,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobalSearchBox } from "@/components/global-search-box";
import {
  AuditTimeline,
  ActionButton,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  FilterBar,
  MasterDetailSurface,
  Modal,
  ProcessGateRail,
  StatePanel,
  StickyActionZone,
  FieldFeedback,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { ScfP04P06FlowPanel } from "@/components/scf-p04-p06-flow-panel";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import {
  analystDraftAcceptanceCriteria,
  analystDraftGovernanceContractId,
  analystDraftPayloadVisibility,
  analystDraftProofBoundaryForPageId,
  analystDraftRouteOwnershipForPageId,
} from "@/lib/analyst-draft-governance-contract";
import {
  advisorReviewAcceptanceCriteria,
  advisorReviewApprovalContractId,
  advisorReviewPayloadVisibility,
  advisorReviewProofBoundaryForPageId,
  advisorReviewRouteOwnershipForPageId,
} from "@/lib/advisor-review-approval-contract";
import { processFirstUxContractForPageId } from "@/lib/process-first-ux-contract";
import { uxActionAttributesFor, uxActionClassForPriority } from "@/lib/ux-action-hierarchy-contract";
import { uxFeedbackSuccessMessageForSubject } from "@/lib/ux-feedback-message-contract";
import { uxPageTemplateForPageId } from "@/lib/ux-page-template-system";
import { uxRouteShellPageJobContractForTemplate } from "@/lib/ux-route-shell-page-job-contract";
import { uxConfirmationAttributesFor, uxStatusCommandAttributesFor } from "@/lib/ux-status-command-hierarchy";
import { wp05ComplianceReleaseConfirmationPhrase } from "@/lib/advisory-workflow-contract";
import {
  advisorApprovalDemoTargets,
  runAdvisorApprovalWorkflowAction,
} from "@/lib/recommendation-review-workflow-client";
import {
  advisorQueue,
  auditReferences,
  clientQueue,
  complianceMetrics,
  complianceQueue,
  complianceReview,
  dataGaps,
  dataQualityDomains,
  draftRecommendations,
  evidenceChecklist,
  internalWorkflowPageIds,
  missingInfoTasks,
  policyChecks,
  readinessChecklist,
  releaseChecklist,
  releaseEvidence,
  selectedApproval,
  selectedSignal,
  signalQueue,
  signalRoutingOptions,
  triggerDetail,
  triggerQueue,
  workbenchHousehold
} from "@/lib/internal-workflow-demo-data";
import { runAdvisorReviewCommand } from "@/lib/advisor-review-command-client";
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";

type InternalWorkflowScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

const primaryButtonClass = uxActionClassForPriority("primary");
const secondaryButtonClass = uxActionClassForPriority("secondary");

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  "mt-2 min-h-24 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold disabled:cursor-not-allowed disabled:opacity-60";

type SensitiveWorkflowAction = "compliance_block" | "request_evidence";

const sensitiveWorkflowCopy: Record<
  SensitiveWorkflowAction,
  {
    action: SensitiveWorkflowAction;
    defaultReason: string;
    description: string;
    evidenceIds: string[];
    phrase: string;
    submitLabel: string;
    targetId: string;
    title: string;
  }
> = {
  compliance_block: {
    action: "compliance_block",
    defaultReason: "Compliance blocked release because required evidence is incomplete.",
    description: "Block client release for this recommendation and record a compliance audit event. This is not client acceptance.",
    evidenceIds: [advisorApprovalDemoTargets.morgan.evidenceId],
    phrase: "BLOCK RELEASE",
    submitLabel: "Block client release",
    targetId: advisorApprovalDemoTargets.morgan.recommendationId,
    title: "Confirm Compliance Block - No Client Release",
  },
  request_evidence: {
    action: "request_evidence",
    defaultReason: "Compliance requested missing evidence before client release.",
    description: "Request missing evidence while keeping the recommendation blocked from client release and client visibility.",
    evidenceIds: [advisorApprovalDemoTargets.morgan.evidenceId],
    phrase: "REQUEST EVIDENCE",
    submitLabel: "Request evidence, keep release blocked",
    targetId: advisorApprovalDemoTargets.morgan.recommendationId,
    title: "Confirm Evidence Request - No Client Release",
  },
};

function SensitiveWorkflowConfirmationModal({
  action,
  onClose,
  open,
}: {
  action: SensitiveWorkflowAction | null;
  onClose: () => void;
  open: boolean;
}) {
  const config = action ? sensitiveWorkflowCopy[action] : null;
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!config) {
    return null;
  }

  const activeConfig = config;
  const valid = acknowledged && confirmationText.trim() === config.phrase && reason.trim().length >= 12;
  const disabled = !valid || status === "submitting" || status === "success";
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = valid
    ? "valid-confirmation"
    : !acknowledged
      ? "blocked-acknowledgement-required"
      : reason.trim().length < 12
        ? "blocked-reason-required"
        : "blocked-exact-phrase-required";
  const validationMessage = valid
    ? "Confirmation is valid. Submit can persist the audited compliance action while release remains separately gated."
    : !acknowledged
      ? "Compliance action is blocked until the acknowledgement is checked, a controlled reason is entered and the exact phrase is typed."
      : reason.trim().length < 12
        ? "Compliance action is blocked until the reason explains the decision with at least 12 characters."
        : `Compliance action is blocked until the confirmation text exactly matches ${config.phrase}.`;
  const confirmationActionMeaning = activeConfig.action === "request_evidence" ? "request_evidence" : "block";
  const confirmationState =
    status === "success"
      ? "confirmed"
      : status === "submitting"
        ? "submitting"
        : !valid
          ? "validation_failed"
          : "ready";
  const confirmationActionAvailability =
    status === "submitting"
      ? "loading"
      : status === "success"
        ? "success"
        : status === "error"
          ? "error"
          : disabled
            ? "disabled"
            : "enabled";

  function resetAndClose() {
    setAcknowledged(false);
    setConfirmationText("");
    setReason("");
    setStatus("idle");
    setMessage(null);
    onClose();
  }

  async function submit() {
    if (!valid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const body = await runAdvisorApprovalWorkflowAction({
        action: activeConfig.action,
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: activeConfig.evidenceIds,
        reason: reason.trim(),
        targetId: activeConfig.targetId,
      });

      setStatus("success");
      setMessage(
        activeConfig.action === "request_evidence"
          ? uxFeedbackSuccessMessageForSubject("evidence_review", { auditEventId: body.result?.auditEventId })
          : uxFeedbackSuccessMessageForSubject("generic_action", {
              auditEventId: body.result?.auditEventId,
              prefix: "Compliance block was recorded for this release review only.",
            }),
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sensitive workflow action failed.");
    }
  }

  return (
    <Modal
      className="max-w-[46rem]"
      context={
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-alphavest-ivory">{config.title}</p>
          <p className="text-alphavest-muted">{config.description}</p>
        </div>
      }
      description="Typed confirmation is required before this action can persist."
      footer={
        <>
          <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={resetAndClose} type="button">
            Cancel
          </button>
          <button
            className={primaryButtonClass}
            data-testid={config.action === "request_evidence" ? "j02-confirm-request-evidence" : `typed-${config.action}-submit`}
            data-ux-lifecycle-result={valid ? `submits-audited-${config.action.replace("_", "-")}` : "blocked-validation-required"}
            {...uxActionAttributesFor({
              availability: confirmationActionAvailability,
              disabledReason: disabled ? validationMessage : undefined,
              meaning: confirmationActionMeaning,
              placement: "modal_footer",
              priority: confirmationActionMeaning === "block" ? "destructive" : "recovery",
              requiresAudit: true,
              requiresConfirmation: true,
            })}
            disabled={disabled}
            onClick={() => {
              void submit();
            }}
            type="button"
          >
            {status === "submitting" ? "Submitting..." : config.submitLabel}
          </button>
        </>
      }
      onClose={status === "submitting" ? undefined : resetAndClose}
      open={open}
      title={config.title}
    >
      <div
        className="space-y-4"
        data-testid="uxp3-compliance-sensitive-action-lifecycle"
        data-ux-lifecycle-status={lifecycleStatus}
        data-ux-lifecycle-validation={validationState}
        data-ux-no-overclaim="true"
        data-ux-sensitive-action={config.action}
        {...uxConfirmationAttributesFor({
          actionMeaning: confirmationActionMeaning,
          scope: "compliance_release",
          state: confirmationState,
        })}
      >
        <StatePanel
          detail="Cancel closes this dialog without calling the service API. Invalid input keeps submit disabled."
          state="restricted"
          title="Sensitive confirmation required"
        />
        <p className="sr-only" id={`${config.action}-validation`}>{validationMessage}</p>
        <label className="flex items-start gap-3 text-sm text-alphavest-muted">
          <input
            aria-describedby={`${config.action}-validation`}
            checked={acknowledged}
            className="mt-1"
            disabled={status === "submitting" || status === "success"}
            onChange={(event) => setAcknowledged(event.target.checked)}
            type="checkbox"
          />
          <span>I understand this action records review state and writes an audit event.</span>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Reason</span>
          <textarea
            aria-describedby={`${config.action}-validation`}
            className={textareaClass}
            disabled={status === "submitting" || status === "success"}
            onChange={(event) => setReason(event.target.value)}
            placeholder={config.defaultReason}
            value={reason}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">
            Type {config.phrase}
          </span>
          <input
            aria-describedby={`${config.action}-validation`}
            className={inputClass}
            data-testid={config.action === "request_evidence" ? "j02-request-evidence-confirmation" : `typed-${config.action}-confirmation`}
            disabled={status === "submitting" || status === "success"}
            onChange={(event) => setConfirmationText(event.target.value)}
            value={confirmationText}
          />
        </label>
        {status === "idle" ? (
          <StatePanel
            detail={validationMessage}
            state={valid ? "validation" : "blocked"}
            testId="j02-sensitive-action-validation-state"
            title={valid ? "Compliance action confirmation valid" : "Compliance action confirmation blocked"}
          />
        ) : null}
        {status === "submitting" ? (
          <StatePanel
            detail={message ?? "Submitting the audited compliance action."}
            state="loading"
            testId="j02-sensitive-action-loading-state"
            title="Compliance action submitting"
          />
        ) : null}
        {status === "success" ? (
          <StatePanel detail={message ?? uxFeedbackSuccessMessageForSubject("generic_action")} state="success" testId="j02-sensitive-action-success-state" title="Action recorded" />
        ) : null}
        {status === "error" ? (
          <StatePanel detail={message ?? "No mutation was completed."} state="blocked" testId="j02-sensitive-action-error-state" title="Action failed" />
        ) : null}
      </div>
    </Modal>
  );
}

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("complete") || normalized.includes("pass") || normalized.includes("approved") || normalized.includes("active") || normalized.includes("included")) {
    return "green";
  }

  if (normalized.includes("high") || normalized.includes("overdue") || normalized.includes("missing") || normalized.includes("fail") || normalized.includes("exception") || normalized.includes("blocked")) {
    return "red";
  }

  if (normalized.includes("medium") || normalized.includes("pending") || normalized.includes("progress") || normalized.includes("partial") || normalized.includes("review")) {
    return "gold";
  }

  if (normalized.includes("low") || normalized.includes("draft") || normalized.includes("info")) {
    return "blue";
  }

  return "muted";
}

function InlineStatus({ tone, value }: { tone: BadgeTone; value: string }) {
  const Icon = tone === "red"
    ? ShieldAlert
    : tone === "green"
      ? CheckCircle2
      : tone === "gold"
        ? Clock3
        : tone === "blue"
          ? Bell
          : tone === "purple" || tone === "teal"
            ? ShieldCheck
            : Circle;
  const toneClass: Record<BadgeTone, string> = {
    blue: "text-alphavest-blue",
    gold: "text-alphavest-gold",
    green: "text-alphavest-green",
    muted: "text-alphavest-muted",
    purple: "text-violet-200",
    red: "text-alphavest-red",
    teal: "text-teal-200"
  };

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 font-semibold", toneClass[tone])}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  );
}

function handleStaticSortChange() {
  return undefined;
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="sr-only">{children}</h1>;
}

function IconTile({ children, tone = "gold" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold",
    green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/35 bg-teal-300/10 text-teal-200"
  };

  return <span className={cn("grid size-10 shrink-0 place-items-center rounded-md border", toneClass[tone])}>{children}</span>;
}

function InternalSidebar() {
  return (
    <ProcessSidebar
      footer={
        <div className="rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
            <LockKeyhole aria-hidden="true" className="size-4" />
            Internal Only
          </div>
          <p className="mt-2 text-xs leading-5 text-alphavest-muted">Authorized AlphaVest users only. Nothing is client-released until compliance required checks pass.</p>
        </div>
      }
    />
  );
}

function InternalTopBar() {
  const { session } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[34rem]" placeholder="Search internal workspace..." />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Badge tone="gold">Internal only</Badge>
          <span
            aria-label="Internal notifications are informational in this release"
            className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted opacity-65"
            data-ux-affordance="blocked-cta"
            data-ux-interactive="false"
            role="status"
          >
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">7</span>
          </span>
          <div className="flex h-10 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 pl-1 pr-3">
            <span className="grid size-8 place-items-center rounded-full border border-alphavest-gold/45 text-xs font-semibold text-alphavest-gold">{session.actor.initials}</span>
            <span className="hidden text-sm font-semibold text-alphavest-ivory md:block">{session.actor.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function InternalShell({ children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid">
        <InternalSidebar />
        <div className="min-w-0">
          <InternalTopBar />
          <main className="px-4 py-6 md:px-6">
            <OperationalDefaultSurface>{children}</OperationalDefaultSurface>
          </main>
        </div>
      </div>
    </DemoSessionProvider>
  );
}

function PageHeading({ action, badge, subtitle, title }: { action?: React.ReactNode; badge?: React.ReactNode; subtitle: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-3xl text-alphavest-ivory md:text-4xl">{title}</h2>
          {badge}
        </div>
        <p className="mt-1 text-sm leading-6 text-alphavest-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressBar({ tone = "gold", value }: { tone?: BadgeTone; value: number }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "bg-alphavest-blue",
    gold: "bg-alphavest-gold",
    green: "bg-alphavest-green",
    muted: "bg-alphavest-muted",
    purple: "bg-violet-300",
    red: "bg-alphavest-red",
    teal: "bg-teal-300"
  };

  return (
    <div className="h-2 rounded-full bg-alphavest-border">
      <div className={cn("h-2 rounded-full", toneClass[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

function ProgressRing({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="grid size-24 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(#f0c982 ${value * 3.6}deg, rgba(174,184,196,0.2) 0deg)` }}
    >
      <div className="grid size-20 place-items-center rounded-full bg-alphavest-navy">
        <p className="text-xl font-semibold text-alphavest-ivory">{value}%</p>
        <p className="text-[0.68rem] text-alphavest-muted">{label}</p>
      </div>
    </div>
  );
}

function InternalGuard() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
      <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
      <span>No unapproved advice reaches the client. Internal review, advisor approval and compliance release are separate checks.</span>
    </div>
  );
}



type Phase5DetailSplitPanelProps = {
  compact?: boolean;
  decisionSupport: string;
  objectLabel: string;
  objectState: string;
  pageJob: string;
  safetyBoundary: string;
  splitTaskId?: string;
  taskId: string;
};

type Phase6DecisionRoomPanelProps = {
  audit: string;
  blocker: string;
  cancelLabel: string;
  compact?: boolean;
  confirmLabel: string;
  decisionLabel: string;
  evidence: string;
  preconditions: string;
  safetyNote: string;
  taskId: string;
};

function Phase6DecisionRoomPanel({ audit, blocker, cancelLabel, compact = false, confirmLabel, decisionLabel, evidence, preconditions, safetyNote, taskId }: Phase6DecisionRoomPanelProps) {
  if (compact) {
    return (
      <section className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4" data-testid="ux-phase6-decision-room" data-ux-decision-room-task={taskId} data-ux-layout-compression="compact_decision_gate">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-red">Decision checkpoint</p>
            <h2 className="mt-2 font-display text-xl text-alphavest-ivory">{decisionLabel}</h2>
          </div>
          <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason={blocker} data-ux-interactive="false">{confirmLabel} blocked</span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ["Preconditions", preconditions],
            ["Evidence", evidence],
            ["Audit", audit],
            ["Safety", safetyNote],
          ].map(([label, value]) => (
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" key={label}>
              <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
              <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-alphavest-muted">{cancelLabel} remains available without release mutation.</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4" data-testid="ux-phase6-decision-room" data-ux-phase6-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-red">Decision checkpoint</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{decisionLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted" data-testid="ux-phase6-safety-note">{safetyNote}</p>
        </div>
        <Badge tone="red">Controlled action</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-preconditions">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Preconditions</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{preconditions}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-evidence">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Evidence</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{evidence}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-audit">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Audit</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{audit}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-phase6-blocker">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-red">Blocker</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{blocker}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className={primaryButtonClass} data-testid="ux-phase6-confirm" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed service command is implemented." type="button">{confirmLabel} blocked</button>
        <button className={secondaryButtonClass} data-testid="ux-phase6-cancel" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed service command is implemented." type="button">{cancelLabel} blocked</button>
      </div>
    </section>
  );
}

const compliancePreconditions = [
  {
    detail: "Senior wealth advisor review is present, but it is only a prerequisite.",
    label: "Advisor approval",
    status: "Satisfied",
    tone: "green",
  },
  {
    detail: "Required source evidence is incomplete, so upload or existence alone cannot release.",
    label: "Evidence sufficiency",
    status: "Blocked",
    tone: "red",
  },
  {
    detail: "Compliance officer role may request evidence or block, but release stays disabled until all required checks pass.",
    label: "Compliance permission",
    status: "Scoped",
    tone: "gold",
  },
  {
    detail: "Audit event is required before any critical state mutation can be trusted.",
    label: "Audit persistence",
    status: "Required",
    tone: "gold",
  },
  {
    detail: "Client-safe projection remains unavailable until compliance release succeeds.",
    label: "Client-safe projection",
    status: "Hidden",
    tone: "red",
  },
] satisfies Array<{ detail: string; label: string; status: string; tone: BadgeTone }>;

function CompliancePreconditionChecklist() {
  return (
    <Card data-testid="wp06-compliance-precondition-checklist" data-wp06-release-ready="false">
      <CardHeader><CardTitle>Release Preconditions</CardTitle></CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-5">
        {compliancePreconditions.map((item) => (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" data-wp06-precondition={item.label.toLowerCase().replaceAll(" ", "-")} key={item.label}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">{item.label}</p>
              <Badge tone={item.tone}>{item.status}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">{item.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ComplianceReleaseGate() {
  const processContract = processFirstUxContractForPageId("039");
  const routeShellPageJobContract = uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("039"));

  return (
    <ProcessGateRail
      actionLabel="Request evidence or keep release blocked"
      actionState="Release remains unavailable until advisor approval, evidence sufficiency, client-safe content, permission and audit persistence all pass."
      acceptanceIds={processContract.acceptanceIds}
      blockedReason="evidence_policy_audit_preconditions_not_satisfied"
      businessProcessIds={processContract.businessProcessIds}
      currentStep="compliance_release_decision"
      gateState="Release blocked"
      gateIds={processContract.gateIds}
      items={[
        { detail: "Advisor approval exists as prerequisite only.", label: "advisor review", tone: "green", value: "Satisfied" },
        { detail: "Required evidence is incomplete; upload alone is not sufficiency.", label: "Evidence sufficiency", tone: "red", value: "Blocked" },
        { detail: "Forbidden internal data cannot become client visible.", label: "client-safe content", tone: "red", value: "Hidden" },
        { detail: "Audit event must persist before a critical mutation.", label: "Audit persistence", tone: "gold", value: "Required" },
      ]}
      nextStep={processContract.nextPermittedAction}
      routeShellPageJobContract={routeShellPageJobContract}
      testId="bd08-compliance-release-gate"
      title="Compliance release check"
    />
  );
}

function Phase5DetailSplitPanel({ compact = false, decisionSupport, objectLabel, objectState, pageJob, safetyBoundary, splitTaskId, taskId }: Phase5DetailSplitPanelProps) {
  if (compact) {
    return (
      <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-2.5" data-testid="ux-phase5-detail-split" data-ux-layout-compression="compact_boundary_strip" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold">Review state</p>
            <h2 className="mt-0.5 font-display text-base text-alphavest-ivory">{objectLabel}</h2>
          </div>
          <Badge tone="gold">Internal review</Badge>
        </div>
        <div className="mt-2 grid gap-1.5 lg:grid-cols-4">
          {[
            ["Status", objectState, "ux-phase5-object-state"],
            ["Evidence", decisionSupport, "ux-phase5-decision-support"],
            ["Controls", safetyBoundary, "ux-phase5-drawer-boundary"],
            ["Next step", pageJob, "ux-phase5-page-job"],
          ].map(([label, value, testId]) => (
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-2" data-testid={testId} key={label}>
              <p className="text-[11px] uppercase tracking-[0.08em] text-alphavest-muted">{label}</p>
              <p className="mt-1 line-clamp-3 text-xs font-semibold leading-5 text-alphavest-ivory">{value}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4" data-testid="ux-phase5-detail-split" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Review state</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectLabel}</h2>
        </div>
        <Badge tone="gold">Internal review</Badge>
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-object-state">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Status</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{objectState}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-decision-support">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Evidence</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{decisionSupport}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-drawer-boundary">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Controls</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{safetyBoundary}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-page-job">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Next step</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{pageJob}</p>
        </div>
      </div>
    </section>
  );
}

function Phase4WorkbenchPanel({
  activeTask,
  blocker,
  context,
  primaryAction,
  queueLabel,
  safetyNote,
  taskId,
  compact = false,
}: {
  activeTask: string;
  blocker: string;
  compact?: boolean;
  context: string;
  primaryAction: string;
  queueLabel: string;
  safetyNote: string;
  taskId: string;
}) {
  if (compact) {
    return (
      <section className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2.5" data-testid="ux-workbench-phase4" data-ux-layout-compression="compact_workbench_boundary" data-ux-workbench-task={taskId}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <InlineStatus tone="gold" value="Active work" />
            <h3 className="mt-1 font-display text-base text-alphavest-ivory">Active workbench</h3>
          </div>
          <button className={primaryButtonClass} data-testid="ux-workbench-primary-cta" disabled type="button">{primaryAction}</button>
        </div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-3" data-testid="ux-workbench-triad">
          <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2" data-testid="ux-workbench-queue">
            <InfoRow label="Queue" value={queueLabel} />
          </div>
          <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2" data-testid="ux-workbench-active-context">
            <InfoRow label="Active context" value={activeTask} />
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-alphavest-muted">{context}</p>
          </div>
          <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-2" data-testid="ux-workbench-action-rail">
            <InfoRow label="Action rail" value={primaryAction} />
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-alphavest-muted" data-testid="ux-workbench-blocker">{blocker}</p>
          </div>
        </div>
        <p className="mt-1.5 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 px-2 py-1 text-xs leading-5 text-alphavest-muted" data-testid="ux-workbench-safety-note">{safetyNote}</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="ux-workbench-phase4" data-ux-workbench-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <InlineStatus tone="gold" value="Active work" />
          <h3 className="mt-3 font-display text-2xl text-alphavest-ivory">Active workbench</h3>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">One selected item, one guarded action rail and one explicit blocker. Queue visibility does not change release, export or client visibility state.</p>
        </div>
        <button className={primaryButtonClass} data-testid="ux-workbench-primary-cta" disabled type="button">{primaryAction}</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3" data-testid="ux-workbench-triad">
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-queue">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Queue</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{queueLabel}</p>
        </div>
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-active-context">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Active context</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{activeTask}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{context}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-workbench-action-rail">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-red">Action rail</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{primaryAction}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-blocker">{blocker}</p>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-safety-note">{safetyNote}</p>
    </section>
  );
}

function SignalsPage({ title }: { title: string }) {
  const processContract = processFirstUxContractForPageId("033");

  return (
    <InternalShell activePageId="033">
      <WorksurfaceShell
        density="compact"
        description="Internal signal entry backed by the signal workbench and draft-governance contracts. It orients work only; mutation happens in governed downstream services."
        eyebrow="Internal entry"
        primary={<AnalystSignalAreaEntry />}
        routeId="033"
        safetyNote="This is an internal area entry. It can navigate to analyst work; it cannot approve advice, release content, export content or expose drafts to clients."
        statusItems={[
          { label: "Queue", tone: "gold", value: `${signalQueue.length} signals` },
          { label: "Visibility", tone: "red", value: "Internal only" },
          { label: "Processes", tone: "gold", value: `${processContract.businessProcessIds.length} mapped` },
        ]}
        title={title}
        worksurfaceId="internal-workbench-signals"
      />
    </InternalShell>
  );
}

function AnalystSignalAreaEntry() {
  const processContract = processFirstUxContractForPageId("033");
  const routeShellPageJobContract = uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("033"));
  const routeOwnership = analystDraftRouteOwnershipForPageId("033");
  const primarySignal = signalQueue[0] ?? {
    id: selectedSignal.id,
    severity: selectedSignal.severity,
    source: selectedSignal.source,
  };

  return (
    <section
      className="grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      data-testid="ux-hub-page"
      data-epic09-contract={analystDraftGovernanceContractId}
      data-epic09-service-backing="lib/p44-phase4-signal-workbench.ts lib/internal-draft-governance-spine.ts"
      data-epic09-route-owner={routeOwnership?.pageFamily}
      data-epic09-ui-truth="readmodel_contract_backed"
      data-s033-analyst-area-entry="true"
      data-ux-hub-task="phase-3"
    >
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>Signal entry</CardTitle>
            <p className="mt-1 text-sm leading-5 text-alphavest-muted" data-testid="ux-hub-summary">{routeOwnership?.primaryJob}</p>
          </div>
          <Badge tone="gold">Read-only entry</Badge>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Backed signal queue", `${signalQueue.length} internal rows`],
              ["Current signal", primarySignal.id],
              ["Severity", primarySignal.severity],
            ].map(([label, value]) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3" data-ux-hub-priority-card="true" key={label}>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
              </div>
            ))}
            <InfoRow label="Source" value={primarySignal.source} />
          </div>
          <StatePanel
            detail={`${selectedSignal.missingElements.length} evidence/data gaps keep advisor and compliance checks blocked. This entry only opens the analyst workbench.`}
            state="restricted"
            testId="s033-backed-state"
            title="Internal work only"
            {...uxStatusCommandAttributesFor({
              componentState: "restricted",
              reason: "Signal entry is not a mutation route; downstream service commands own triage, evidence request and advisor handoff.",
              recoveryAction: "complete_review",
            })}
          />
          <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-hub-safety-note">
            Internal entry only: no approval, release, export or client visibility mutation here.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              className={primaryButtonClass}
              data-testid="ux-hub-primary-next-work"
              data-s033-open-analyst-workbench="true"
              href="/advisory/review-queue"
              {...uxActionAttributesFor({
                availability: "enabled",
                meaning: "navigate",
                placement: "inline_cluster",
                priority: "primary",
                requiresPermission: false,
              })}
            >
              Open analyst workbench
            </Link>
            {[
              ["/advisory/review-queue", "Review queue"],
              ["/advisory/triggers/demo/review", "Trigger review"],
              ["/documents", "Evidence lifecycle"],
            ].map(([href, label]) => (
              <Link className={secondaryButtonClass} data-testid="ux-hub-next-link" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        <Phase5DetailSplitPanel compact decisionSupport="Routes to analyst queue/detail." objectLabel="Advisory hub split" objectState="Signal overview state" pageJob="One entry job without later review checks." safetyBoundary="Hub context cannot approve advice or release content." splitTaskId="UX-PAGE-SPLIT-001" taskId="UX-PAGE-SPLIT-001" />
        <section
          className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3"
          data-testid="s033-process-gate-rail"
          data-ux-process-acceptance-gates={processContract.acceptanceIds.join(" ")}
          data-ux-process-blocked-reason="entry_surface_no_mutation_authority"
          data-ux-process-business-processes={processContract.businessProcessIds.join(" ")}
          data-ux-process-current-step="signal_area_entry"
          data-ux-process-first="true"
          data-ux-process-gate-ids={processContract.gateIds.join(" ")}
          data-ux-process-gate-state="Internal only"
          data-ux-process-next-step={processContract.nextPermittedAction}
          data-ux-route-shell-page-job-command-zone={routeShellPageJobContract.commandZone}
          data-ux-route-shell-page-job-consumer="true"
          data-ux-route-shell-page-job-contract={routeShellPageJobContract.contractId}
          data-ux-route-shell-page-job-id={routeShellPageJobContract.pageId}
          data-ux-route-shell-page-job-no-overclaim={routeShellPageJobContract.noOverclaimRule}
          data-ux-route-shell-page-job-proof-audit={routeShellPageJobContract.proofAuditPlacement}
          data-ux-route-shell-page-job-value={routeShellPageJobContract.pageJob}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-alphavest-ivory">AREA-04 entry check</h2>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">
                Readmodel-backed entry. Navigation only; no service mutation.
              </p>
            </div>
            <Badge tone="gold">Internal only</Badge>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2">
              <p className="text-xs font-semibold text-alphavest-ivory">Signal backing</p>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">Internal review context; client visibility stays blocked.</p>
            </div>
            <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-2">
              <p className="text-xs font-semibold text-alphavest-ivory">Mutation authority</p>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">None here. Open workbench for controlled actions.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

const analystDraftServiceBacking = "lib/p44-phase4-signal-workbench.ts lib/internal-draft-governance-spine.ts lib/analyst-draft-governance-contract.ts";

function AnalystDraftStepSurface({
  pageId,
  selectedLabel,
}: {
  pageId: "034" | "035";
  selectedLabel: string;
}) {
  const routeOwnership = analystDraftRouteOwnershipForPageId(pageId);
  const proofBoundary = analystDraftProofBoundaryForPageId(pageId);
  const processIds = routeOwnership?.processIds ?? [];
  const criteria = analystDraftAcceptanceCriteria.filter((criterion) => processIds.some((processId) => processId === criterion.processId));

  if (pageId === "035") {
    return (
      <Card
        data-epic09-contract={analystDraftGovernanceContractId}
        data-epic09-page-id={pageId}
        data-epic09-processes={processIds.join(" ")}
        data-epic09-proof-audit-posture={proofBoundary?.auditPosture}
        data-epic09-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(" ")}
        data-epic09-proof-client-safe-payload={proofBoundary?.clientSafePayload}
        data-epic09-proof-placement={proofBoundary?.proofPlacement}
        data-epic09-proof-summary={proofBoundary?.summary}
        data-epic09-service-backing={analystDraftServiceBacking}
        data-epic09-step-surface="true"
        data-testid="epic09-s035-draft-step-surface"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-1.5">
          <div className="min-w-0">
            <CardTitle className="text-base">Routing readiness</CardTitle>
          </div>
          <InlineStatus tone="gold" value="Internal only" />
        </CardHeader>
        <CardContent className="grid gap-1.5">
          <p className="line-clamp-1 text-xs font-semibold leading-5 text-alphavest-red">
            Evidence and release checks remain open
          </p>
          <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 px-2 py-1 text-xs leading-5 text-alphavest-muted">
            <strong className="text-alphavest-ivory">Trigger:</strong> {selectedLabel}; <strong className="text-alphavest-ivory">internal fields:</strong> {analystDraftPayloadVisibility.internalOnlyFields.length} blocked; <strong className="text-alphavest-ivory">release:</strong> not available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-epic09-contract={analystDraftGovernanceContractId}
      data-epic09-page-id={pageId}
      data-epic09-processes={processIds.join(" ")}
      data-epic09-proof-audit-posture={proofBoundary?.auditPosture}
      data-epic09-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(" ")}
      data-epic09-proof-client-safe-payload={proofBoundary?.clientSafePayload}
      data-epic09-proof-placement={proofBoundary?.proofPlacement}
      data-epic09-proof-summary={proofBoundary?.summary}
      data-epic09-service-backing={analystDraftServiceBacking}
      data-epic09-step-surface="true"
      data-testid={`epic09-s${pageId}-draft-step-surface`}
    >
      <CardHeader className="flex flex-col gap-2 pb-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-base">{pageId === "034" ? "Queue step governance" : "Trigger draft governance"}</CardTitle>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-alphavest-muted">{routeOwnership?.primaryJob}</p>
        </div>
        <InlineStatus tone="gold" value="Internal only" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 px-2 py-1.5 text-xs leading-5 text-alphavest-muted">
          <InlineStatus tone="red" value={`${criteria.length} gates remain controlled`} />
        </div>
        <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2.5 text-sm">
          <div className="flex flex-wrap gap-2 text-xs text-alphavest-muted">
            <span><strong className="text-alphavest-ivory">Selected:</strong> {selectedLabel}</span>
            <span><strong className="text-alphavest-ivory">Internal fields:</strong> {analystDraftPayloadVisibility.internalOnlyFields.length} blocked</span>
            <span><strong className="text-alphavest-ivory">Truth:</strong> readmodel + contract</span>
            <span><strong className="text-alphavest-ivory">No-overclaim:</strong> no advice/release/export/client visibility</span>
          </div>
          <p className="mt-2 rounded-md border border-alphavest-border/60 bg-alphavest-navy/35 px-2 py-1.5 text-xs leading-5 text-alphavest-muted">
            Internal-only step surface. Advisor approval, compliance release, export and client visibility stay outside this route.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function S035CompactDetailStandardPanel() {
  return (
    <section
      className="grid gap-1.5 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-2.5"
      data-testid="ux-page-detail-standard"
      data-ux-d4-focused-detail="true"
      data-ux-density-pattern="focused-detail"
      data-ux-density-tier="D4"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle" data-testid="ux-d4-focused-status-strip">Object / Status / Next action / Check</p>
      <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2" data-testid="ux-page-detail-object-header">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-alphavest-subtle">Trigger detail</p>
        <p className="mt-1 line-clamp-1 text-sm font-semibold text-alphavest-ivory">{triggerDetail.title}</p>
        <div className="mt-1 text-xs text-alphavest-muted" data-testid="ux-page-detail-key-facts">{triggerDetail.severity} / {triggerDetail.source} / {triggerDetail.analyst}</div>
      </div>
      <p className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2 text-xs leading-5 text-alphavest-muted" data-testid="ux-page-detail-evidence-timeline">Evidence / timeline: beneficial ownership signal; escalation pending.</p>
      <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2 text-xs font-semibold text-alphavest-ivory" data-testid="ux-page-detail-gated-action-rail">Actions: route to advisor review only; no client-visible advice.</p>
    </section>
  );
}

function WorkbenchPage({ title }: { title: string }) {
  const [selectedClient, setSelectedClient] = useState(clientQueue[0]?.client);
  const selectedClientRow = clientQueue.find((row) => row.client === selectedClient) ?? clientQueue[0];
  const selectedTrigger = triggerQueue.find((row) => row.client === selectedClientRow?.client);
  const selectedDraft = draftRecommendations.find((row) => row.client === selectedClientRow?.client);

  return (
    <InternalShell activePageId="034">
      <WorksurfaceShell
        density="compact"
        description="The analyst workbench combines operational status, active client queues, trigger work and draft readiness in one review-owned surface."
        eyebrow="Internal workbench"
        primary={
          <div className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-alphavest-border/70 bg-alphavest-panel/58 p-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-alphavest-gold">Queue/detail/step surface</p>
                <p className="mt-1 text-sm font-semibold text-alphavest-ivory">One selected work item, one blocker, one controlled next action.</p>
              </div>
              <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Workbench queue can open work context only; publish and release remain separate controlled routes." data-ux-interactive="false"><LockKeyhole aria-hidden="true" className="size-4" />Release blocked</span>
            </div>
            <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]" data-ux-queue-proof-drawer="true">
              <MasterDetailSurface
                actionPolicy="route_handoff"
                actionRail="present"
                density="compact_operations"
                detail={
                  selectedClientRow ? (
                    <Card data-testid="s034-client-selected-detail">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{selectedClientRow.client}</CardTitle>
                            <p className="mt-0.5 text-xs text-alphavest-muted">{selectedClientRow.value} - {selectedClientRow.segment}</p>
                          </div>
                          <InlineStatus tone={toneFor(selectedClientRow.priority)} value={selectedClientRow.priority} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid gap-2 text-sm">
                          <InfoRow label="Next work" value={selectedClientRow.next} />
                          <InfoRow label="Queue age" value={selectedClientRow.age} />
                          <InfoRow label="Trigger" value={selectedTrigger?.title ?? "No active trigger"} />
                          <InfoRow label="Draft" value={selectedDraft?.title ?? "No draft attached"} />
                        </div>
                        <div
                          className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 py-2 text-xs leading-5 text-alphavest-muted"
                          {...uxStatusCommandAttributesFor({
                            componentState: selectedClientRow.priority === "High" ? "validation" : "restricted",
                            reason: selectedClientRow.priority === "High" ? "High-priority client queue item needs review before downstream service action." : "Workbench queue rows cannot publish, release or export client-visible advice.",
                            recoveryAction: selectedClientRow.next === "Missing Info" ? "provide_evidence" : "open_decision_room",
                          })}
                        >
                          <span className="font-semibold text-alphavest-ivory">Operational handoff only:</span> no advice, export, release or client visibility from this queue.
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <span className={primaryButtonClass} data-ux-affordance="route-handoff" data-ux-command-intent="open-controlled-review-work" data-ux-disabled-message="explicit" data-ux-interactive="false">
                            Open review work
                          </span>
                          <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Client-visible output requires advisor approval and compliance release outside this workbench." data-ux-interactive="false">
                            Client visibility held
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <StatePanel detail="No client work item is selected." state="empty" title="No selected work item" />
                  )
                }
                family="queue"
                filterState="inactive"
                master={
                  <div className="space-y-1.5" data-testid="s034-client-master-list">
                    {clientQueue.slice(0, 3).map((row) => {
                      const selected = selectedClientRow?.client === row.client;

                      return (
                        <button
                          className={cn(
                            "w-full rounded-md border p-2.5 text-left transition",
                            selected ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35 hover:border-alphavest-gold/60",
                          )}
                          data-ux-field-priority="identity value segment primary_status next_work age"
                          data-ux-queue-row={row.client}
                          data-ux-queue-selected={selected ? "true" : "false"}
                          key={row.client}
                          onClick={() => setSelectedClient(row.client)}
                          type="button"
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-alphavest-ivory">{row.client}</span>
                              <span className="mt-0.5 block truncate text-xs text-alphavest-muted">{row.value} - {row.segment}</span>
                            </span>
                            <InlineStatus tone={toneFor(row.priority)} value={row.priority} />
                          </span>
                          <span className="mt-1.5 grid gap-2 text-xs text-alphavest-muted sm:grid-cols-2">
                            <span>{row.next}</span>
                            <span className="sm:text-right">{row.age}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                }
                masterDetailMode="inline_detail_rail"
                proofPlacement="proof_drawer"
                queueWorkbench
                selectedObjectId={selectedClientRow?.client ?? "no-client-row"}
                selectedObjectState={selectedClientRow?.priority ?? "empty"}
                selectedSummary={<span>Internal workbench now keeps queue selection, operational detail and evidence handoff in one governed surface; no queue row publishes, releases, exports or changes client visibility.</span>}
                stickyRail
              />
              <AnalystDraftStepSurface pageId="034" selectedLabel={selectedClientRow?.client ?? "No selected work item"} />
            </div>
          </div>
        }
        routeId="034"
        safetyNote="The workbench organizes analyst work but does not publish, release, export or alter client visibility."
        statusItems={[
          { label: "Drafts", tone: "gold", value: `${draftRecommendations.length} active` },
          { label: "Attention", tone: "red", value: "18 items" },
        ]}
        title={title}
        worksurfaceId="internal-workbench-queue"
      />
    </InternalShell>
  );
}

function SimpleListCard({ rows, title }: { rows: string[][]; title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([left, middle, right]) => (
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 border-b border-alphavest-border/45 pb-3 text-sm last:border-0" key={`${left}-${middle}`}>
            <span className="font-semibold text-alphavest-ivory">{left}</span>
            <span className="text-alphavest-muted">{middle}</span>
            <Badge tone={toneFor(right)}>{right}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DataQualityCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Data Quality by Domain</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {dataQualityDomains.map((row) => (
          <div className="grid grid-cols-[1fr_5rem_3rem] items-center gap-3 text-sm" key={row.domain}>
            <span className="text-alphavest-ivory">{row.domain}</span>
            <ProgressBar value={Number(row.quality.replace("%", ""))} />
            <span className={row.trend.startsWith("-") ? "text-alphavest-red" : "text-alphavest-green"}>{row.trend}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReadinessCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Publish Readiness Checklist</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {readinessChecklist.map((item) => (
          <div className="flex items-center justify-between gap-3 text-sm" key={item.label}>
            <span className="flex items-center gap-2 text-alphavest-muted">
              {item.status === "Pass" ? <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" /> : <Clock3 aria-hidden="true" className="size-4 text-alphavest-gold" />}
              {item.label}
            </span>
            <Badge tone={toneFor(item.status)}>{item.status}</Badge>
          </div>
        ))}
        <button className={secondaryButtonClass + " w-full"} disabled type="button"><LockKeyhole aria-hidden="true" className="size-4" />Publish to Client</button>
        <p className="text-xs text-alphavest-muted">Nothing will be client-released until all required checks are complete.</p>
      </CardContent>
    </Card>
  );
}

function WorkbenchDrawer() {
  return (
    <aside className="rounded-md border border-alphavest-border bg-alphavest-panel/88 p-4 shadow-2xl 2xl:sticky 2xl:top-24 2xl:max-h-[calc(100vh-7rem)] 2xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full border border-alphavest-border text-lg font-semibold text-alphavest-ivory">TH</span>
          <div>
            <h2 className="font-display text-2xl text-alphavest-ivory">{workbenchHousehold.name}</h2>
            <p className="text-sm text-alphavest-muted">{workbenchHousehold.value} - {workbenchHousehold.segment}</p>
          </div>
        </div>
        <X aria-hidden="true" className="size-5 text-alphavest-muted" />
      </div>
      <div className="mt-5 space-y-5">
        <StatePanel detail="Equity drawdown exceeds trigger threshold. Review before any recommendation is routed." state="blocked" title={workbenchHousehold.nextBestAction} />
        <div className="grid gap-3">
          {[
            ["Primary Advisor", workbenchHousehold.advisor],
            ["Overall Data Quality", workbenchHousehold.dataQuality],
            ["Priority", workbenchHousehold.priority]
          ].map(([label, value]) => (
            <div className="flex justify-between border-b border-alphavest-border/45 pb-2 text-sm" key={label}>
              <span className="text-alphavest-muted">{label}</span>
              <span className="font-semibold text-alphavest-ivory">{value}</span>
            </div>
          ))}
        </div>
        <SimpleDrawerList items={workbenchHousehold.drafts} title="Drafts" />
        <SimpleDrawerList items={workbenchHousehold.missingInfo} title="Missing Information" />
        <SimpleDrawerList items={workbenchHousehold.activity} title="Recent Activity" />
      </div>
    </aside>
  );
}

function SimpleDrawerList({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm text-alphavest-muted" key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function TriggerDetailPage({ title }: { title: string }) {
  const router = useRouter();
  const [routingStatus, setRoutingStatus] = useState<string | null>(null);

  async function routeToAdvisor() {
    setRoutingStatus("Routing package to advisor review...");
    await runAdvisorReviewCommand("j01.routeToAdvisor");
    router.push("/advisor/reviews");
  }

  return (
    <InternalShell activePageId="035">
      <WorksurfaceShell
        density="compact"
        description="The trigger detail page is now the focused analyst object review surface: signal context, missing evidence, draft guardrail and handoff action are kept together."
        eyebrow="Internal workbench"
        primary={
          <div className="grid gap-2 xl:grid-cols-2" data-epic09-review-surface="trigger-draft">
            <Phase4WorkbenchPanel compact activeTask="Trigger TRG-443 selected for analyst review" blocker="Missing beneficial-owner and purpose-of-wire evidence keeps advisor handoff blocked." context="AI draft remains internal; analyst must resolve unsupported claims before routing." primaryAction="Request missing evidence" queueLabel="Advisory trigger queue" safetyNote="No client release, export or visibility mutation can happen from the analyst trigger workbench." taskId="UX-WORKBENCH-001" />
            <Phase5DetailSplitPanel compact decisionSupport="Missing evidence is reviewed before advisor routing." objectLabel="Trigger review" objectState="Blocked by missing evidence" pageJob="Review the selected trigger and choose the next safe action." safetyBoundary="No client-visible advice can be created here." splitTaskId="UX-PAGE-SPLIT-001" taskId="UX-DETAIL-003" />
            <div className="grid items-start gap-2 lg:grid-cols-2">
              <ScfP04P06FlowPanel compact mode="advisory" />
              <S035CompactDetailStandardPanel />
            </div>
            <div className="grid items-start gap-2 lg:grid-cols-2">
              <AnalystDraftStepSurface pageId="035" selectedLabel={triggerDetail.triggerId} />
              <div className="grid gap-1.5 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-2.5 text-xs" data-epic09-audit-strip="true">
                <p className="line-clamp-1 leading-5 text-alphavest-muted">{triggerDetail.notes}</p>
                <div className="grid gap-1">
                  <InlineStatus tone="gold" value="Audit logging required" />
                  <span className="font-semibold text-alphavest-ivory">Audit logging required before accepted save</span>
                  <span className="text-alphavest-muted">Hidden from client / ai draft internal only</span>
                  {routingStatus ? <p className="text-xs text-alphavest-gold-soft">{routingStatus}</p> : null}
                </div>
              </div>
            </div>
          </div>
        }
        routeId="035"
        safetyNote="Analyst trigger review may request evidence or route work, but it cannot create client-visible advice, advisor approval or compliance release."
        statusItems={[
          { label: "Status", tone: "red", value: triggerDetail.status },
          { label: "Severity", tone: "red", value: triggerDetail.severity },
        ]}
        title={title}
        worksurfaceId="internal-workbench-trigger-review"
      />
    </InternalShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-2 last:border-0">
      <span className="min-w-0 text-alphavest-muted">{label}</span>
      <span className="min-w-0 break-words text-right font-semibold text-alphavest-ivory">{value}</span>
    </div>
  );
}

function AdvisorQueuePage({ title }: { title: string }) {
  const router = useRouter();
  const routeOwnership = advisorReviewRouteOwnershipForPageId("036");
  const proofBoundary = advisorReviewProofBoundaryForPageId("036");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdvisorClient, setSelectedAdvisorClient] = useState(advisorQueue[0]?.client);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleRows = advisorQueue.filter((row) => (
    normalizedSearchTerm.length === 0 ||
    [row.client, row.structure, row.type, row.topic, row.priority, row.status].some((value) => value.toLowerCase().includes(normalizedSearchTerm))
  ));
  const selectedAdvisorRow = visibleRows.find((row) => row.client === selectedAdvisorClient) ?? visibleRows[0];
  const advisorQueueColumns: Array<DataTableColumn<(typeof advisorQueue)[number]>> = [
    { key: "client", header: "Client", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}</span>, sortable: true },
    { key: "type", header: "Type", render: (row) => row.type, sortable: true },
    { key: "topic", header: "Topic", render: (row) => row.topic, sortable: true },
    { key: "priority", header: "Priority", render: (row) => <InlineStatus tone={toneFor(row.priority)} value={row.priority} />, sortable: true },
    { key: "status", header: "Status", render: (row) => <InlineStatus tone={toneFor(row.status)} value={row.status} />, sortable: true },
  ];

  return (
    <InternalShell activePageId="036">
      <WorksurfaceShell
        density="compact"
        description="Advisor review is now a clear human-check worksurface: queue triage, selected package context and explicit non-release boundary stay visible together."
        eyebrow="Advisor review"
        primary={
          <div className="space-y-2">
            <div
              className="rounded-md border border-alphavest-gold/35 bg-alphavest-navy/45 p-3"
              data-epic10-contract={advisorReviewApprovalContractId}
              data-epic10-page-family={routeOwnership?.pageFamily}
              data-epic10-page-id="036"
              data-epic10-primary-job="advisor_review_queue_entry"
              data-epic10-processes={routeOwnership?.processIds.join(" ")}
              data-epic10-proof-placement={proofBoundary?.proofPlacement}
              data-epic10-client-safe-payload={proofBoundary?.clientSafePayload}
              data-testid="epic10-s036-area-entry"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-alphavest-ivory">Advisor review queue</p>
                  <p className="mt-1 max-w-4xl text-sm leading-5 text-alphavest-muted">
                    {routeOwnership?.primaryJob}
                  </p>
                </div>
                <button className={primaryButtonClass} data-testid="epic10-s036-primary-next-action" onClick={() => router.push("/advisor/reviews/demo")} type="button">
                  Open selected review
                </button>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-alphavest-muted md:grid-cols-3">
                <span>Queue, detail, options and advisor actions stay in one review path.</span>
                <span>Client visibility remains locked until compliance release.</span>
                <span>Advisor review prepares the handoff; it does not approve release or export.</span>
              </div>
            </div>
            <MasterDetailSurface
              actionPolicy="route_handoff"
              actionRail="present"
              density="compact_operations"
              detail={
                selectedAdvisorRow ? (
                  <Card data-testid="s036-advisor-selected-detail">
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle>{selectedAdvisorRow.client}</CardTitle>
                          <p className="mt-1 text-sm text-alphavest-muted">{selectedAdvisorRow.structure}</p>
                        </div>
                        <InlineStatus tone={toneFor(selectedAdvisorRow.priority)} value={selectedAdvisorRow.priority} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <InfoRow label="Package type" value={selectedAdvisorRow.type} />
                        <InfoRow label="Topic" value={selectedAdvisorRow.topic} />
                        <InfoRow label="Due" value={selectedAdvisorRow.due} />
                      </div>
                      <StatePanel
                        detail="Advisor queue selection can open package detail only. Approval, compliance release, export and client visibility remain separate checks."
                        state={selectedAdvisorRow.status === "Overdue" ? "validation" : "restricted"}
                        title="Package-detail handoff only"
                        {...uxStatusCommandAttributesFor({
                          componentState: selectedAdvisorRow.status === "Overdue" ? "validation" : "restricted",
                          reason: selectedAdvisorRow.status === "Overdue" ? "Advisor package is overdue and needs review." : "Queue rows cannot approve or release recommendations.",
                          recoveryAction: "open_decision_room",
                        })}
                      />
                      <button className={primaryButtonClass + " w-full"} data-testid="s036-open-selected-review" onClick={() => router.push("/advisor/reviews/demo")} type="button">
                        Open advisor package detail
                      </button>
                    </CardContent>
                  </Card>
                ) : (
                  <StatePanel detail="No advisor package is selected. Clear search before opening package detail." state="empty" title="No selected advisor package" />
                )
              }
              family="queue"
              filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
              master={
                <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1" data-testid="s036-advisor-master-list">
                  <FilterBar
                    activeFilterCount={4}
                    activeStateLabel={searchTerm.length > 0 ? `Advisor queue query active: ${searchTerm}. Static filters remain visible only.` : "Advisor queue filters are visible as disabled demo controls only."}
                    filters={[
                      { label: "Type", value: "type" },
                      { label: "Priority", value: "priority" },
                      { label: "Risk Level", value: "risk" },
                      { label: "Assigned To", value: "assigned" },
                    ]}
                    filterState={searchTerm.length > 0 ? "active_query" : "disabled_static"}
                    onQueryChange={setSearchTerm}
                    onReset={() => setSearchTerm("")}
                    placeholder="Search queue..."
                    queryValue={searchTerm}
                    searchTestId="ux-interaction-advisor-search"
                  />
                  <DataTable
                    actionPolicy="open_detail"
                    columns={advisorQueueColumns}
                    compact
                    density="compact"
                    emptyMessage="No advisor packages match this search."
                    family="queue"
                    filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
                    getRowId={(row) => row.client}
                    masterDetailMode="inline_detail_rail"
                    mobileCardTitle={(row) => row.client}
                    onRowAction={(row) => router.push("/advisor/reviews/demo")}
                    onSortChange={handleStaticSortChange}
                    responsiveMode="table"
                    rowActionLabel={(row) => `Open advisor detail for ${row.client}`}
                    rows={visibleRows}
                    sortDirection="asc"
                    sortKey="client"
                  />
                </div>
              }
              masterDetailMode="inline_detail_rail"
              proofPlacement="inline_summary"
              queueWorkbench
              selectedObjectId={selectedAdvisorRow?.client ?? "no-advisor-row"}
              selectedObjectState={selectedAdvisorRow?.status ?? "empty"}
              stickyRail
            />
          </div>
        }
        routeId="036"
        safetyNote="Advisor queue selection does not approve, release, export or create client visibility."
        statusItems={[
          { label: "Queue", tone: "gold", value: `${advisorQueue.length} packages` },
          { label: "Release", tone: "red", value: "Compliance required" },
        ]}
        title={title}
        worksurfaceId="advisor-review-queue"
      />
    </InternalShell>
  );
}

function AdvisorSummaryPanel() {
  return (
    <aside className="rounded-md border border-alphavest-border bg-alphavest-panel/88 p-4 shadow-2xl 2xl:sticky 2xl:top-24 2xl:max-h-[calc(100vh-7rem)] 2xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid size-14 place-items-center rounded-full border border-alphavest-border text-lg font-semibold text-alphavest-ivory">JT</span>
          <div>
            <h2 className="font-display text-2xl text-alphavest-ivory">{selectedApproval.client}</h2>
            <p className="text-sm text-alphavest-muted">{selectedApproval.structure}</p>
          </div>
        </div>
        <Badge tone="gold">Pending Review</Badge>
      </div>
      <div className="mt-5 space-y-5">
        <InfoRow label="Priority" value="High" />
        <InfoRow label="Due" value="May 16, 2025 - 2 days" />
        <InfoRow label="Assigned To" value="Alex Richardson" />
        <StatePanel detail={selectedApproval.objective} state="empty" title="Client Objective" />
        <Card>
          <CardHeader><CardTitle>Data Completeness</CardTitle></CardHeader>
          <CardContent>
            <ProgressBar tone="green" value={92} />
            <p className="mt-2 text-sm text-alphavest-muted">92% complete. Estate planning is partial.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommendation Summary</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Proposed Strategy", "Balanced Growth"],
              ["Risk Level", "Moderate"],
              ["Target Return", "5.5% - 7.5%"],
              ["Time Horizon", "10+ years"],
              ["Proposed Allocation", "Multi-Asset"],
              ["Liquidity Need", "Medium"]
            ].map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
          </CardContent>
        </Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Request info in detail</span>
          <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Send back in detail</span>
          <span className={primaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Approve in detail</span>
        </div>
      </div>
    </aside>
  );
}

function AdvisorDecisionRoomPanel() {
  const processContract = processFirstUxContractForPageId("037");
  const routeOwnership = advisorReviewRouteOwnershipForPageId("037");
  const proofBoundary = advisorReviewProofBoundaryForPageId("037");

  return (
    <section
      className="grid gap-3"
      data-epic10-client-safe-payload={proofBoundary?.clientSafePayload}
      data-epic10-contract={advisorReviewApprovalContractId}
      data-epic10-page-family={routeOwnership?.pageFamily}
      data-epic10-page-id="037"
      data-epic10-processes={routeOwnership?.processIds.join(" ")}
      data-epic10-proof-placement={proofBoundary?.proofPlacement}
      data-testid="bd07-advisor-decision-room-panel"
      data-ux-decision-room="advisor_not_release"
      data-ux-layout-compression="bounded_decision_room"
      data-ux-process-acceptance-gates={processContract.acceptanceIds.join(" ")}
      data-ux-process-blocked-reason="advisor_approval_not_release"
      data-ux-process-business-processes={processContract.businessProcessIds.join(" ")}
      data-ux-process-current-step="advisor_review"
      data-ux-process-first="true"
      data-ux-process-gate-ids={processContract.gateIds.join(" ")}
      data-ux-process-gate-state="Compliance pending"
      data-ux-process-next-step={processContract.nextPermittedAction}
    >
      <Card className="min-w-0">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Review Recommendation Package</CardTitle>
            <InlineStatus tone="gold" value="Ready for review" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-navy/45 p-3" data-testid="epic10-s037-step-surface">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-alphavest-ivory">Advisor decision path</p>
                <p className="mt-1 text-sm leading-5 text-alphavest-muted">
                  {routeOwnership?.primaryJob}
                </p>
              </div>
              <InlineStatus tone="red" value="No client release" />
            </div>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">
              Advisor action requires a saved reason and keeps the package internal until compliance release.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {[
              ["Client", selectedApproval.client],
              ["Package", selectedApproval.packageType],
              ["Analyst", selectedApproval.analyst],
              ["Created", selectedApproval.created],
            ].map(([label, value]) => (
              <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3">
              <h2 className="text-base font-semibold text-alphavest-ivory">Recommendation Summary</h2>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted">{selectedApproval.recommendation}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {["6.4% return", "10.2% volatility", "82% scenario fit", "89/100 tax score"].map((item) => (
                  <InlineStatus key={item} tone="green" value={item} />
                ))}
              </div>
              <p className="mt-2 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2 text-sm leading-5 text-alphavest-gold-soft">
                Ask the analyst to rebuild unsupported claims before submitting the package for compliance review.
              </p>
            </div>
          </div>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Reviewed Evidence</p>
              {selectedApproval.documents.slice(0, 3).map((doc) => (
                <InlineStatus key={doc} tone="green" value={doc} />
              ))}
              <InlineStatus tone="gold" value={`${Math.max(0, selectedApproval.documents.length - 3)} more in review`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function AdvisorDetailPage({ title }: { title: string }) {
  const router = useRouter();
  const [decisionStatus, setDecisionStatus] = useState<string | null>(null);

  async function approveRecommendation() {
    setDecisionStatus("Submitting the checked package for compliance review...");
    await runAdvisorApprovalWorkflowAction({
      action: "advisor_approve",
      actorRole: "senior_wealth_advisor",
      reason: "Advisor approved the package; compliance release remains required.",
      targetId: advisorApprovalDemoTargets.northbridge.recommendationId,
    });
    setDecisionStatus("Package submitted for compliance review. Client delivery and export were not created.");
  }

  async function escalateToCall() {
    setDecisionStatus("Saving advisor escalation...");
    await runAdvisorReviewCommand("j01.escalateAdvisor");
    router.push("/decisions");
  }

  return (
    <InternalShell activePageId="037">
      <WorksurfaceShell
        description="The advisor detail page now keeps recommendation evidence, rationale, advisor action and compliance handoff boundary inside one review desk."
        eyebrow="Advisor review"
        primary={
          <div className="space-y-3">
            <AdvisorDecisionRoomPanel />
          </div>
        }
        rail={
          <aside className="space-y-3">
            <Card>
              <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-navy/35 p-3">
                  <InlineStatus tone="gold" value="Review required" />
                  <p className="mt-2 text-sm leading-5 text-alphavest-muted">
                    Check the recommendation summary, evidence list and notes, then choose the next step for this package.
                  </p>
                </div>
                <p className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm leading-5 text-alphavest-muted">
                  Ask the analyst to rebuild unsupported claims before submitting the package for compliance review.
                </p>
                <button
                  className={primaryButtonClass + " w-full"}
                  data-testid="j01-approve-advisor"
                  onClick={() => {
                    void approveRecommendation().catch((error: unknown) => {
                      setDecisionStatus(error instanceof Error ? error.message : "Demo approval action failed.");
                    });
                  }}
                  type="button"
                >
                  <Check aria-hidden="true" className="size-4" />Approve for compliance review
                </button>
                <div className="grid gap-2">
                  <p className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2 text-sm font-semibold text-alphavest-ivory" data-testid="ux-cta-ai-rebuild" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
                    Request analyst rebuild
                  </p>
                  <p className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2 text-sm font-semibold text-alphavest-ivory" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
                    Request evidence follow-up
                  </p>
                </div>
                <button
                  className="inline-flex h-[var(--button-height)] w-full items-center justify-center gap-2 rounded-md border border-alphavest-red/55 bg-alphavest-red/10 px-4 text-sm font-semibold text-alphavest-red"
                  data-testid="j01-escalate-advisor"
                  onClick={() => {
                    void escalateToCall().catch((error: unknown) => {
                      setDecisionStatus(error instanceof Error ? error.message : "Demo escalation action failed.");
                    });
                  }}
                  type="button"
                >
                  Escalate advisor review call
                </button>
                {decisionStatus ? (
                  <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
                    {decisionStatus}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </aside>
        }
        routeId="037"
        safetyNote="Review the recommendation package and submit only the checked package for compliance review."
        statusItems={[
          { label: "Package", tone: "gold", value: "Ready for review" },
          { label: "Evidence", tone: "green", value: "Linked" },
        ]}
        title={title}
        worksurfaceId="advisor-review-detail"
      />
    </InternalShell>
  );
}

function ComplianceQueuePage({ title }: { title: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(complianceQueue[0]?.id);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleRows = complianceQueue.filter((row) => (
    normalizedSearchTerm.length === 0 ||
    [row.id, row.item, row.sub, row.classification, row.risk, row.advisor, row.evidence, row.publish].some((value) => value.toLowerCase().includes(normalizedSearchTerm))
  ));
  const selectedReview = visibleRows.find((row) => row.id === selectedReviewId) ?? visibleRows[0];
  const complianceQueueColumns: Array<DataTableColumn<(typeof complianceQueue)[number]>> = [
    { key: "id", header: "Review", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.id}</span>, sortable: true },
    { key: "item", header: "Item", render: (row) => row.item, sortable: true },
    { key: "classification", header: "Classification", render: (row) => row.classification, sortable: true },
    { key: "risk", header: "Risk", render: (row) => <InlineStatus tone={toneFor(row.risk)} value={row.risk} />, sortable: true },
    { key: "publish", header: "Publish", render: (row) => <InlineStatus tone={toneFor(row.publish)} value={row.publish} />, sortable: true },
  ];

  return (
    <InternalShell activePageId="038">
      <WorksurfaceShell
        density="compact"
        description="Compliance review is organized as a release-control worksurface: intake queue, evidence status, policy posture and explicit non-release queue boundary stay visible."
        eyebrow="Compliance release"
        primary={
          <div className="space-y-2">
            <MasterDetailSurface
              actionPolicy="route_handoff"
              actionRail="present"
              density="compact_operations"
              detail={
                selectedReview ? (
                  <Card data-testid="s038-compliance-selected-detail">
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle>{selectedReview.item}</CardTitle>
                          <p className="mt-1 text-sm text-alphavest-muted">{selectedReview.sub}</p>
                        </div>
                        <InlineStatus tone={toneFor(selectedReview.risk)} value={selectedReview.risk} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <InfoRow label="Classification" value={selectedReview.classification} />
                        <InfoRow label="Responsible advisor" value={selectedReview.advisor} />
                        <InfoRow label="Evidence" value={selectedReview.evidence} />
                      </div>
                      <StatePanel detail="Queue selection can open the release decision room only. It cannot release, block, export or create client visibility." state="restricted" title="Decision-room handoff only" />
                      <button className={primaryButtonClass + " w-full"} data-testid="s038-open-selected-review" onClick={() => router.push(`/compliance/reviews/${selectedReview.id}/decision-room`)} type="button">
                        Open decision room
                      </button>
                    </CardContent>
                  </Card>
                ) : (
                  <StatePanel detail="No visible compliance row is selected. Clear search before opening a decision room." state="empty" title="No selected review" />
                )
              }
              family="queue"
              filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
              governancePattern="queue_workbench"
              longScreenGovernance="resolved_by_shared_surface"
              master={
                <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1" data-testid="s038-compliance-master-list">
                  <FilterBar
                    activeFilterCount={4}
                    activeStateLabel={searchTerm.length > 0 ? `Compliance queue query active: ${searchTerm}. Static filters remain visible only.` : "Compliance queue filters are visible as disabled demo controls only."}
                    filters={[
                      { label: "Classification", value: "classification" },
                      { label: "Risk Status", value: "risk" },
                      { label: "Evidence Status", value: "evidence" },
                      { label: "Publish Status", value: "publish" },
                      { disabledAriaLabel: "Additional compliance filters are static in this demo queue", label: "More Filters", value: "more" },
                    ]}
                    filterState={searchTerm.length > 0 ? "active_query" : "disabled_static"}
                    onQueryChange={setSearchTerm}
                    onReset={() => setSearchTerm("")}
                    placeholder="Search by client, advisor, ID, or keyword..."
                    queryValue={searchTerm}
                    resetLabel="Clear"
                    searchTestId="ux-interaction-compliance-search"
                  />
                  <DataTable
                    actionPolicy="open_detail"
                    columns={complianceQueueColumns}
                    compact
                    density="compact"
                    emptyMessage="No compliance reviews match this search."
                    family="queue"
                    filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
                    getRowId={(row) => row.id}
                    masterDetailMode="inline_detail_rail"
                    mobileCardTitle={(row) => row.id}
                    onRowAction={(row) => router.push(`/compliance/reviews/${row.id}/decision-room`)}
                    onSortChange={handleStaticSortChange}
                    responsiveMode="table"
                    rowActionLabel={(row) => `Open decision room for ${row.id}`}
                    rows={visibleRows}
                    sortDirection="asc"
                    sortKey="id"
                  />
                </div>
              }
              masterDetailMode="inline_detail_rail"
              proofPlacement="inline_summary"
              queueWorkbench
              selectedObjectId={selectedReview?.id ?? "no-compliance-row"}
              selectedObjectState={selectedReview?.publish ?? "empty"}
              stickyRail
              targetScreenId="S038"
            />
          </div>
        }
        routeId="038"
        safetyNote="Compliance queue rows cannot release, block, export or expose client-visible content."
        statusItems={[
          { label: "Queue", tone: "gold", value: `${complianceQueue.length} reviews` },
          { label: "Release", tone: "red", value: "Gated" },
        ]}
        title={title}
        worksurfaceId="compliance-release-queue"
      />
    </InternalShell>
  );
}

function ComplianceDecisionRoomPanel() {
  const processContract = processFirstUxContractForPageId("039");
  const routeShellPageJobContract = uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("039"));
  const compactPreconditions = [
    { label: "Advisor review", tone: "green" as BadgeTone, value: "Ready" },
    { label: "Evidence", tone: "red" as BadgeTone, value: "Needs work" },
    { label: "Permission", tone: "gold" as BadgeTone, value: "Permitted" },
    { label: "Audit record", tone: "gold" as BadgeTone, value: "Required" },
    { label: "Client package", tone: "red" as BadgeTone, value: "Unavailable" },
  ];
  const compactEvidence = [
    { label: "Disclosure", status: "Accepted" },
    { label: "Performance", status: "Accepted" },
    { label: "Risk", status: "Missing" },
    { label: "Fair balance", status: "Accepted" },
  ];
  const compactPolicy = [
    { label: "Marketing", result: "Review" },
    { label: "Performance", result: "Pass" },
    { label: "Risk disclosure", result: "Needs work" },
    { label: "Portal reference", result: "Pass" },
  ];
  const compactAudit = ["Factsheet", "Q1 worksheet", "Approval email"];

  return (
    <section
      className="space-y-3"
      data-testid="bd08-compliance-decision-room-panel"
      data-ux-decision-room="compliance_release_gate"
      data-ux-layout-compression="bounded_decision_room"
      data-ux-process-acceptance-gates={processContract.acceptanceIds.join(" ")}
      data-ux-process-blocked-reason="evidence_policy_audit_preconditions_not_satisfied"
      data-ux-process-business-processes={processContract.businessProcessIds.join(" ")}
      data-ux-process-current-step="compliance_release_decision"
      data-ux-process-first="true"
      data-ux-process-gate-ids={processContract.gateIds.join(" ")}
      data-ux-process-gate-state="Review required"
      data-ux-process-next-step={processContract.nextPermittedAction}
      data-ux-route-shell-page-job-command-zone={routeShellPageJobContract.commandZone}
      data-ux-route-shell-page-job-consumer="true"
      data-ux-route-shell-page-job-contract={routeShellPageJobContract.contractId}
      data-ux-route-shell-page-job-id={routeShellPageJobContract.pageId}
      data-ux-route-shell-page-job-no-overclaim={routeShellPageJobContract.noOverclaimRule}
      data-ux-route-shell-page-job-proof-audit={routeShellPageJobContract.proofAuditPlacement}
      data-ux-route-shell-page-job-value={routeShellPageJobContract.pageJob}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Compliance Review</CardTitle>
            <InlineStatus tone="gold" value="Needs evidence review" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2 md:grid-cols-4">
            {[
              ["Review", "CR-2025-05-21"],
              ["Client", "Northbridge"],
              ["Due", "May 27, 2025"],
              ["Policy", "MC-01"],
            ].map(([label, value]) => (
              <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
          <div
            className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3"
            data-testid="wp06-compliance-precondition-checklist"
            data-wp06-release-ready="false"
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Review Requirements</p>
              {compactPreconditions.map((item) => (
                <InlineStatus key={item.label} tone={item.tone} value={`${item.label}: ${item.value}`} />
              ))}
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Evidence And Policy</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {compactEvidence.map((item) => (
                  <InlineStatus key={item.label} tone={toneFor(item.status)} value={`${item.label}: ${item.status}`} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-5 text-alphavest-muted">6 of 9 evidence requirements are ready; risk disclosure still needs attention.</p>
            </div>
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Policy And Audit</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {compactPolicy.map((item) => (
                  <InlineStatus key={item.label} tone={toneFor(item.result)} value={`${item.label}: ${item.result}`} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-5 text-alphavest-muted">Request missing evidence or keep the review closed until the checklist is ready.</p>
            </div>
          </div>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2.5">
            <div className="flex flex-wrap items-center gap-3">
              {compactAudit.map((item, index) => (
                <InlineStatus key={item} tone={index === 2 ? "red" : index === 1 ? "gold" : "green"} value={item} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ComplianceReviewPage({ title }: { title: string }) {
  const [confirmationAction, setConfirmationAction] = useState<SensitiveWorkflowAction | null>(null);
  const releaseBlocker = "Review requires evidence, policy, reviewer and approver checks before release.";

  return (
    <InternalShell activePageId="039">
      <WorksurfaceShell
        description="The compliance decision room keeps evidence, policy, preconditions, request/block controls and audit context in one release-gated worksurface."
        eyebrow="Compliance release"
        primary={
          <div
            className="space-y-4"
            data-testid="s039-epic05-primitive-consumer"
            data-ux-epic05-target-screen="S039"
            {...uxStatusCommandAttributesFor({
              actionMeaning: "release",
              componentState: "blocked",
              primitiveFamily: "blocker",
              reason: releaseBlocker,
              recoveryAction: "review_policy",
            })}
          >
            <ComplianceDecisionRoomPanel />
          </div>
        }
        rail={
          <aside className="space-y-3">
            <Card>
              <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-navy/35 p-3">
                  <InlineStatus tone="gold" value="Review required" />
                  <p className="mt-2 text-sm leading-5 text-alphavest-muted">
                    Check evidence, policy and audit readiness, then request evidence or keep the item closed.
                  </p>
                </div>
                <StickyActionZone testId="e05-compliance-release-action-zone">
                  <ActionButton
                    availability="blocked_static"
                    className="w-full"
                    disabledReason={releaseBlocker}
                    meaning="release"
                    placement="sticky_rail"
                    priority="blocked"
                    requiresPermission={false}
                    testId="wp06-release-blocked-control"
                    title="Release unavailable"
                    visibleDisabledReason
                  >
                    <LockKeyhole aria-hidden="true" className="size-4" />Release unavailable
                  </ActionButton>
                  <ActionButton
                    className="w-full"
                    meaning="request_evidence"
                    onClick={() => {
                      setConfirmationAction("request_evidence");
                    }}
                    placement="sticky_rail"
                    priority="primary"
                    requiresAudit
                    requiresConfirmation
                    testId="j02-request-evidence"
                  >
                    <MessageSquare aria-hidden="true" className="size-4" />Request Evidence
                  </ActionButton>
                  <ActionButton
                    className="w-full"
                    meaning="block"
                    onClick={() => {
                      setConfirmationAction("compliance_block");
                    }}
                    placement="sticky_rail"
                    priority="destructive"
                    requiresAudit
                    requiresConfirmation
                    testId="j02-block-release"
                  >
                    Hold Release
                  </ActionButton>
                </StickyActionZone>
              </CardContent>
            </Card>
          </aside>
        }
        routeId="039"
        safetyNote="Compliance reviews evidence and policy before requesting evidence or keeping the review closed."
        statusItems={[
          { label: "Review", tone: "gold", value: "Needs evidence" },
          { label: "Policy", tone: "gold", value: "Check required" },
        ]}
        title={title}
        worksurfaceId="compliance-release-decision-room"
      />
      <SensitiveWorkflowConfirmationModal
        action={confirmationAction}
        onClose={() => setConfirmationAction(null)}
        open={confirmationAction !== null}
      />
    </InternalShell>
  );
}

function ReleasePage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [modalOpen, setModalOpen] = useState(visualState === "release");

  return (
    <InternalShell activePageId="040">
      <WorksurfaceShell
        description="Compliance release confirmation is now the explicit release worksurface: checklist, client-safe preview candidate and audited confirmation remain visibly separated from export or acceptance."
        eyebrow="Compliance release"
        primary={<StatePanel detail="Compliance release is still pending until the exact confirmation phrase is entered and the audited action succeeds." state="restricted" title="Release action required" />}
        routeId="040"
        safetyNote="This surface organizes the release confirmation UI; export, download, share and client acceptance remain separate controls."
        statusItems={[
          { label: "Review", tone: "green", value: "Approved" },
          { label: "Release", tone: "gold", value: "Action pending" },
        ]}
        title={title}
        worksurfaceId="compliance-release-confirmation"
      >
      <div className="mx-auto grid max-w-[104rem] gap-5 xl:grid-cols-[18rem_1fr_22rem]">
        <aside className="space-y-4">
          <Card><CardHeader><CardTitle>Review progress</CardTitle></CardHeader><CardContent className="space-y-3">{["Advice validation", "Risk & suitability", "Product & fee review", "Disclosures", "Documents", "Overall review"].map((item) => <p className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}><CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />{item}</p>)}</CardContent></Card>
          <StatePanel detail="Checklist is ready for release review; client visibility still requires the explicit release action and audit record." state="success" title="Review decision marked approved" />
          <ScfP04P06FlowPanel mode="audit" />
        </aside>
        <section className={cn("min-w-0 space-y-5", modalOpen ? "opacity-45" : "")}>
          <PageHeading badge={<Badge tone="green">Approved</Badge>} subtitle="Review ID: CR-2025-0407-0012" title="Compliance review" />
          <UxDetailStandardPanel
            actionLabel="Confirm release to client"
            actionState="Release requires explicit confirmation and audit persistence before any client visibility changes."
            evidenceItems={["Release checklist", "Client-safe preview candidate", "Evidence and audit references"]}
            facts={[
              { label: "Review ID", value: "CR-2025-0407-0012" },
              { label: "Client", value: "James & Olivia Bennett" },
              { label: "Prepared by", value: "Daniel Carter" },
              { label: "Status", value: "Approved for release review" },
            ]}
            objectTitle="Retirement Income Plan"
            objectType="Release confirmation detail"
            routeId="040"
            safetyNote="Advisor approval alone is not enough; explicit compliance release controls client visibility."
            status="Release action pending"
            timelineItems={["Compliance checklist reviewed", "Confirmation required", "Audit write pending"]}
          />
          <Card><CardHeader><CardTitle>Advice package</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">{[["Advice package", "Retirement Income Plan"], ["Client", "James & Olivia Bennett"], ["Prepared by", "Daniel Carter"], ["Last updated", "7 May 2025, 10:42 AM"]].map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}</CardContent></Card>
          <InternalGuard />
        </section>
        <aside className={cn("space-y-5", modalOpen ? "opacity-45" : "")}>
          <StatePanel detail="Compliance checklist is marked complete. Client visibility is still controlled by the release action." state="success" title="Review status marked approved" />
          <Card><CardHeader><CardTitle>Related items</CardTitle></CardHeader><CardContent className="space-y-3">{["SOA - Retirement Income Plan", "PDS - AlphaVest Balanced Fund", "Fee Disclosure Statement", "Risk Profile Assessment"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}</CardContent></Card>
        </aside>
      </div>
      </WorksurfaceShell>
      <ReleaseModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </InternalShell>
  );
}

function ReleaseModal({ onClose, open }: { onClose: () => void; open: boolean }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const releasePhrase = wp05ComplianceReleaseConfirmationPhrase;
  const releaseValid = acknowledged && confirmationText.trim() === releasePhrase;
  const submitDisabled = !releaseValid || status === "submitting" || status === "success";
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = releaseValid
    ? "valid-confirmation"
    : !acknowledged
      ? "blocked-acknowledgement-required"
      : "blocked-exact-phrase-required";
  const validationMessage = releaseValid
    ? "Confirmation is valid. Submit can request the existing audited compliance release workflow."
    : !acknowledged
      ? "Release is blocked until the compliance acknowledgement is checked and the exact release phrase is entered."
      : `Release is blocked until the confirmation text exactly matches ${releasePhrase}.`;
  const releaseActionAvailability =
    status === "submitting"
      ? "loading"
      : status === "success"
        ? "success"
        : status === "error"
          ? "error"
          : submitDisabled
            ? "disabled"
            : "enabled";

  function resetAndClose() {
    setAcknowledged(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
    onClose();
  }

  async function submitRelease() {
    if (!releaseValid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Submitting the audited compliance release request. Close and cancel are blocked until the request resolves.");

    try {
      const body = await runAdvisorApprovalWorkflowAction({
        action: "compliance_release",
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: [advisorApprovalDemoTargets.summit.evidenceId],
        reason:
          "Compliance released the recommendation after advisor approval, evidence and permission gates passed.",
        targetId: advisorApprovalDemoTargets.summit.recommendationId,
      });

      setStatus("success");
      setMessage(uxFeedbackSuccessMessageForSubject("compliance_release", { auditEventId: body.result?.auditEventId }));
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No release mutation or client visibility change was completed.`
          : "Release failed without mutation or client visibility change.",
      );
    }
  }

  return (
    <Modal
      className="max-w-[58rem]"
      context={
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-alphavest-ivory">Compliance release controls client visibility</p>
          <p className="text-alphavest-muted">Advisor approval alone is not enough. Evidence, policy checks, reviewer approval and release permission must all pass.</p>
        </div>
      }
      description="No unapproved advice reaches the client."
      footer={
        <>
          <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={resetAndClose} type="button">Cancel</button>
          <button
            className={primaryButtonClass}
            data-testid="j02-release-client"
            data-ux-lifecycle-result={releaseValid ? "submits-audited-release" : "blocked-validation-required"}
            disabled={submitDisabled}
            onClick={() => {
              void submitRelease();
            }}
            type="button"
            {...uxActionAttributesFor({
              availability: releaseActionAvailability,
              disabledReason: submitDisabled ? validationMessage : undefined,
              meaning: "release",
              placement: "modal_footer",
              priority: "primary",
              requiresAudit: true,
              requiresConfirmation: true,
            })}
          >
            <LockKeyhole aria-hidden="true" className="size-4" />{status === "submitting" ? "Submitting..." : "Release client-safe review"}
          </button>
        </>
      }
      onClose={status === "submitting" ? undefined : resetAndClose}
      open={open}
      title="Release client-safe review"
    >
      <div
        className="grid gap-4 xl:grid-cols-2"
        data-testid="uxp3-compliance-release-lifecycle"
        data-ux-lifecycle-status={lifecycleStatus}
        data-ux-lifecycle-validation={validationState}
        data-ux-no-overclaim="true"
      >
        <Card>
          <CardHeader><CardTitle>Release checklist</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {releaseChecklist.map((item) => (
              <div className="flex items-start gap-3" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 text-alphavest-green" />
                <div>
                  <p className="text-sm font-semibold text-alphavest-ivory">{item}</p>
                  <p className="text-xs text-alphavest-muted">Completed</p>
                </div>
              </div>
            ))}
            <StatePanel detail="Demo prerequisites are shown as satisfied for this confirmation state; release remains pending until the action completes." state="success" title="Release action pending" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Client-visible preview</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <div className="grid gap-4 md:grid-cols-[8rem_1fr]">
                <div className="grid min-h-36 place-items-center rounded-md bg-alphavest-gold/10 text-alphavest-gold">
                  <span className="font-display text-3xl">SOA</span>
                </div>
                <div>
                  <p className="font-display text-2xl text-alphavest-ivory">Statement of Advice</p>
                  <p className="mt-1 text-sm text-alphavest-muted">Retirement Income Plan for James & Olivia Bennett</p>
                  <div className="mt-4 space-y-2 text-sm">
                    {[
                      ["Advice date", "7 May 2025"],
                      ["Prepared by", "Daniel Carter"],
                      ["Licensee", "AlphaVest Financial Services"],
                      ["Document pages", "32"],
                      ["Attachments", "5"]
                    ].map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
                  </div>
                </div>
              </div>
            </div>
            <StatePanel className="mt-4" detail="Only content that passes release, redaction and permission checks can become client-visible." state="restricted" title="Client-safe preview candidate" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Evidence & audit</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {releaseEvidence.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Confirm release</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-alphavest-muted">You must have release permission to continue. Confirm that all information is accurate and compliant.</p>
            <FieldFeedback
              actionMeaning="release"
              id="release-confirmation-validation"
              message={validationMessage}
              subject="compliance_release"
            />
            <label className="flex items-start gap-3 text-sm text-alphavest-muted">
              <input
                aria-describedby="release-confirmation-validation"
                checked={acknowledged}
                className="mt-1"
                disabled={status === "submitting" || status === "success"}
                onChange={(event) => setAcknowledged(event.target.checked)}
                type="checkbox"
              />
              <span>I confirm that all information is accurate and compliant, and I authorise release of this advice to the client.</span>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Type {releasePhrase} to release</span>
              <input
                aria-describedby="release-confirmation-validation"
                className={inputClass}
                data-testid="j02-release-confirmation"
                disabled={status === "submitting" || status === "success"}
                onChange={(event) => setConfirmationText(event.target.value)}
                value={confirmationText}
              />
            </label>
            {status === "idle" ? (
              <StatePanel
                detail={validationMessage}
                feedback={{
                  actionMeaning: "release",
                  intent: "validation",
                  placement: "modal_status",
                  subject: "compliance_release",
                }}
                state={releaseValid ? "validation" : "blocked"}
                testId="j02-release-validation-state"
                title={releaseValid ? "Release confirmation valid" : "Release confirmation blocked"}
              />
            ) : null}
            {status === "submitting" ? (
              <StatePanel
                detail={message ?? "Submitting the audited compliance release request."}
                feedback={{
                  actionMeaning: "release",
                  intent: "pending",
                  placement: "modal_status",
                  subject: "compliance_release",
                }}
                state="loading"
                testId="j02-release-loading-state"
                title="Release request submitting"
              />
            ) : null}
            {status === "success" ? (
              <StatePanel
                detail={message ?? uxFeedbackSuccessMessageForSubject("compliance_release")}
                feedback={{
                  actionMeaning: "release",
                  intent: "success",
                  placement: "modal_status",
                  subject: "compliance_release",
                }}
                state="success"
                testId="j02-release-success-state"
                title="Released successfully"
              />
            ) : null}
            {status === "error" ? (
              <StatePanel
                detail={message ?? "No release mutation or client visibility change was completed."}
                feedback={{
                  actionMeaning: "release",
                  intent: "fail_closed",
                  placement: "modal_status",
                  subject: "compliance_release",
                }}
                state="blocked"
                testId="j02-release-error-state"
                title="Release failed"
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4 text-sm text-alphavest-green">
        {status === "success"
          ? "Release completed only through the existing audited review flow. Export, download, share and client acceptance remain separate controls."
          : "Release has not been completed in this modal state. The demo action records only the requested release step after submit."}
      </div>
    </Modal>
  );
}

export function InternalWorkflowScreen({ route, visualState }: InternalWorkflowScreenProps) {
  if (!internalWorkflowPageIds.includes(route.pageId as (typeof internalWorkflowPageIds)[number])) {
    return null;
  }

  if (route.pageId === "033") {
    return <SignalsPage title={route.title} />;
  }

  if (route.pageId === "034") {
    return <WorkbenchPage title={route.title} />;
  }

  if (route.pageId === "035") {
    return <TriggerDetailPage title={route.title} />;
  }

  if (route.pageId === "036") {
    return <AdvisorQueuePage title={route.title} />;
  }

  if (route.pageId === "037") {
    return <AdvisorDetailPage title={route.title} />;
  }

  if (route.pageId === "038") {
    return <ComplianceQueuePage title={route.title} />;
  }

  if (route.pageId === "039") {
    return <ComplianceReviewPage title={route.title} />;
  }

  return <ReleasePage title={route.title} visualState={visualState} />;
}
