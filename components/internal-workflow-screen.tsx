"use client";

import { useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  Filter,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";
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
  Modal,
  StatePanel,
  StickyActionZone,
  FieldFeedback,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { DemoActorHandoffBar } from "@/components/demo-actor-handoff-bar";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { RouteContextChip } from "@/components/route-context-chip";
import { ScfP04P06FlowPanel } from "@/components/scf-p04-p06-flow-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { UxComplexityPriorityPanel } from "@/components/ux-complexity-priority-panel";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import { uxActionAttributesFor } from "@/lib/ux-action-hierarchy-contract";
import { uxFeedbackSuccessMessageForSubject } from "@/lib/ux-feedback-message-contract";
import { wp05ComplianceReleaseConfirmationPhrase } from "@/lib/advisory-workflow-contract";
import {
  advisorApprovalDemoTargets,
  runAdvisorApprovalWorkflowAction,
} from "@/lib/recommendation-review-workflow-client";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
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
  workbenchHousehold,
  workbenchMetrics
} from "@/lib/internal-workflow-demo-data";
import { runAdvisorReviewCommand } from "@/lib/advisor-review-command-client";
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";

type InternalWorkflowScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

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
      >
        <StatePanel
          detail="Cancel closes this dialog without calling the workflow API. Invalid input keeps submit disabled."
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
          <span>I understand this action persists workflow state and writes an audit event.</span>
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
          <p className="mt-2 text-xs leading-5 text-alphavest-muted">Authorized AlphaVest users only. Nothing is client-released until compliance gates pass.</p>
        </div>
      }
    />
  );
}

function InternalTopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[34rem]" placeholder="Search internal workspace..." />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <RouteContextChip />
          <label className="relative">
            <span className="sr-only">Tenant context</span>
            <select
              className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-64"
              onChange={(event) => setTenant(event.target.value as DemoTenantSlug)}
              value={session.tenant.slug}
            >
              {demoTenants.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.displayName}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          </label>
          <label className="relative">
            <span className="sr-only">Role context</span>
            <select
              className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-56"
              onChange={(event) => setRole(event.target.value as DemoRoleKey)}
              value={session.role.key}
            >
              {demoRoles.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          </label>
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
          <DemoActorHandoffBar />
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
      <span>No unapproved advice reaches the client. Internal review, advisor approval and compliance release are separate gates.</span>
    </div>
  );
}



type Phase5DetailSplitPanelProps = {
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
  confirmLabel: string;
  decisionLabel: string;
  evidence: string;
  preconditions: string;
  safetyNote: string;
  taskId: string;
};

function Phase6DecisionRoomPanel({ audit, blocker, cancelLabel, confirmLabel, decisionLabel, evidence, preconditions, safetyNote, taskId }: Phase6DecisionRoomPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4" data-testid="ux-phase6-decision-room" data-ux-phase6-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-red">Decision gate</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{decisionLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted" data-testid="ux-phase6-safety-note">{safetyNote}</p>
        </div>
        <Badge tone="red">{taskId}</Badge>
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
        <button className={primaryButtonClass} data-testid="ux-phase6-confirm" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed workflow command is implemented." type="button">{confirmLabel} blocked</button>
        <button className={secondaryButtonClass} data-testid="ux-phase6-cancel" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed workflow command is implemented." type="button">{cancelLabel} blocked</button>
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
    detail: "Compliance officer role may request evidence or block, but release stays disabled until all gates pass.",
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

function Phase5DetailSplitPanel({ decisionSupport, objectLabel, objectState, pageJob, safetyBoundary, splitTaskId, taskId }: Phase5DetailSplitPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4" data-testid="ux-phase5-detail-split" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Detail state</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectLabel}</h2>
        </div>
        <Badge tone="gold">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-object-state">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Object state</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{objectState}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-decision-support">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Decision support</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{decisionSupport}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-drawer-boundary">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Drawer boundary</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Drawer-only context cannot approve, release, delete, export or mutate payload visibility. {safetyBoundary}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-page-job">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Focus</p>
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
}: {
  activeTask: string;
  blocker: string;
  context: string;
  primaryAction: string;
  queueLabel: string;
  safetyNote: string;
  taskId: string;
}) {
  return (
    <section className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="ux-workbench-phase4" data-ux-workbench-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge tone="gold">{taskId}</Badge>
          <h3 className="mt-3 font-display text-2xl text-alphavest-ivory">Active task workbench</h3>
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
  return (
    <InternalShell activePageId="033">
      <WorksurfaceShell
        description="Signal intake is now presented as one internal-only process surface: queue signal, explain the active review job and keep advisor/compliance release gates visibly separate."
        eyebrow="WP02 internal workbench"
        primary={
          <div className="space-y-4">
            <Phase5DetailSplitPanel decisionSupport="Advisory hub orients signal work without becoming trigger detail." objectLabel="Advisory hub split" objectState="Signal intake overview" pageJob="Hub routes to queue/detail while preserving one job per page." safetyBoundary="Hub context cannot approve advice or release content." splitTaskId="UX-PAGE-SPLIT-001" taskId="UX-PAGE-SPLIT-001" />
            <UxHubPage pageId="033" />
          </div>
        }
        rail={
          <WorksurfacePanel description="Signal intake can route work, but cannot approve advice, release content or expose drafts to clients." title="Gate boundary">
            <div className="space-y-3 text-sm">
              {["Internal analyst only", "Advisor review required", "Compliance release required"].map((item) => (
                <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-2 last:border-0" key={item}>
                  <span className="text-alphavest-muted">{item}</span>
                  <Badge tone="gold">Held</Badge>
                </div>
              ))}
            </div>
          </WorksurfacePanel>
        }
        routeId="033"
        safetyNote="WP02 layout only: signal intake does not create client-visible advice, does not approve a recommendation and does not bypass advisor or compliance review."
        secondary={
          <div className="grid gap-3 lg:grid-cols-3">
            {signalQueue.slice(0, 3).map((row) => (
              <Card key={row.id}>
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-alphavest-ivory">{row.title}</p>
                    <Badge tone={toneFor(row.severity)}>{row.severity}</Badge>
                  </div>
                  <p className="text-sm text-alphavest-muted">{row.client}</p>
                  <p className="text-xs text-alphavest-subtle">{row.source} - {row.age}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        }
        statusItems={[
          { label: "Queue", tone: "gold", value: `${signalQueue.length} signals` },
          { label: "Visibility", tone: "red", value: "Internal only" },
        ]}
        title={title}
        worksurfaceId="internal-workbench-signals"
      />
    </InternalShell>
  );
}

function WorkbenchPage({ title }: { title: string }) {
  return (
    <InternalShell activePageId="034">
      <WorksurfaceShell
        description="The analyst workbench combines operational status, active client queues, trigger work and draft readiness in one process-owned surface."
        eyebrow="WP02 internal workbench"
        primary={<UxHubPage pageId="034" />}
        rail={<ReadinessCard />}
        routeId="034"
        safetyNote="WP02 layout only: the workbench organizes analyst work but does not publish, release, export or alter client visibility."
        secondary={
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {workbenchMetrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-alphavest-muted">{metric.label}</p>
                    <Badge tone={toneFor(metric.status)}>{metric.status}</Badge>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-alphavest-ivory">{metric.value}</p>
                  <p className="mt-1 text-xs text-alphavest-subtle">{metric.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        }
        statusItems={[
          { label: "Drafts", tone: "gold", value: `${draftRecommendations.length} active` },
          { label: "Attention", tone: "red", value: "18 items" },
        ]}
        title={title}
        worksurfaceId="internal-workbench-queue"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <QueueCard rows={clientQueue} title="Client Work Queue" />
          <TriggerQueueCard />
          <DraftsCard />
        </div>
      </WorksurfaceShell>
    </InternalShell>
  );
}

function QueueCard({ rows, title }: { rows: typeof clientQueue; title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title} <Badge className="ml-2" tone="gold">{rows.length}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, index) => (
          <div className={cn("grid gap-3 rounded-md border p-3 text-sm md:grid-cols-[1fr_auto]", index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={row.client}>
            <div>
              <p className="font-semibold text-alphavest-ivory">{row.client}</p>
              <p className="text-xs text-alphavest-muted">{row.value} - {row.segment}</p>
            </div>
            <div className="text-right">
              <Badge tone={toneFor(row.priority)}>{row.priority}</Badge>
              <p className="mt-2 text-xs text-alphavest-muted">{row.next} - {row.age}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TriggerQueueCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Trigger Queue <Badge className="ml-2" tone="gold">{triggerQueue.length}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {triggerQueue.map((row) => (
          <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={row.title}>
            <div>
              <p className="font-semibold text-alphavest-ivory">{row.title}</p>
              <p className="text-sm text-alphavest-muted">{row.client}</p>
              <p className="text-xs text-alphavest-subtle">{row.detail}</p>
            </div>
            <Badge tone={toneFor(row.severity)}>{row.age}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DraftsCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Draft Recommendations <Badge className="ml-2" tone="gold">{draftRecommendations.length}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {draftRecommendations.map((row) => (
          <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={row.title}>
            <div>
              <p className="font-semibold text-alphavest-ivory">{row.client}</p>
              <p className="text-sm text-alphavest-muted">{row.title}</p>
              <p className="text-xs text-alphavest-subtle">{row.updated}</p>
            </div>
            <Badge tone={toneFor(row.status)}>{row.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
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
        <p className="text-xs text-alphavest-muted">Nothing will be client-released until all gates are complete.</p>
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
        description="The trigger detail page is now the focused analyst object review surface: signal context, missing evidence, draft guardrail and handoff action are kept together."
        eyebrow="WP02 internal workbench"
        primary={
          <div className="space-y-4">
            <Phase4WorkbenchPanel activeTask="Trigger TRG-443 selected for analyst review" blocker="Missing beneficial-owner and purpose-of-wire evidence keeps advisor handoff blocked." context="AI draft remains internal; analyst must resolve unsupported claims before routing." primaryAction="Request missing evidence" queueLabel="Advisory trigger queue" safetyNote="UX-WORKBENCH-001: no client release, export or visibility mutation can happen from the analyst trigger workbench." taskId="UX-WORKBENCH-001" />
            <Phase5DetailSplitPanel decisionSupport="Trigger detail separates object evidence from queue triage before advisor routing." objectLabel="Trigger object review" objectState="Blocked by missing evidence" pageJob="Trigger detail explains one selected trigger and safe next action." safetyBoundary="Trigger detail cannot create client-visible advice." splitTaskId="UX-PAGE-SPLIT-001" taskId="UX-DETAIL-003" />
          </div>
        }
        rail={
          <WorksurfacePanel description="Analyst routing is allowed only after evidence gaps and unsupported claims are visible." title="Handoff guard">
            <div className="space-y-3 text-sm">
              <InfoRow label="Trigger" value={triggerDetail.triggerId} />
              <InfoRow label="Evidence gaps" value={`${dataGaps.length} open`} />
              <InfoRow label="Advisor release" value="Not permitted" />
            </div>
          </WorksurfacePanel>
        }
        routeId="035"
        safetyNote="WP02 layout only: analyst trigger review may request evidence or route work, but it cannot create client-visible advice, advisor approval or compliance release."
        statusItems={[
          { label: "Status", tone: "red", value: triggerDetail.status },
          { label: "Severity", tone: "red", value: triggerDetail.severity },
        ]}
        title={title}
        worksurfaceId="internal-workbench-trigger-review"
      >
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[1fr_24rem]">
        <section className="min-w-0 space-y-5">
          <ScfP04P06FlowPanel mode="advisory" />
          <UxDetailStandardPanel
            actionLabel="Route to advisor review"
            actionState="Routing is allowed only after analyst review; it does not create client-visible advice."
            evidenceItems={["Beneficial ownership signal", "Related documents", "Open data gaps"]}
            facts={[
              { label: "Severity", value: triggerDetail.severity },
              { label: "Source", value: triggerDetail.source },
              { label: "Analyst", value: triggerDetail.analyst },
              { label: "Related object", value: triggerDetail.relatedTo },
            ]}
            objectTitle={triggerDetail.title}
            objectType="Trigger detail"
            routeId="035"
            safetyNote="Advisor and compliance gates must pass before this work can advance."
            status={triggerDetail.status}
            timelineItems={["Signal detected", "Analyst review open", "Escalation pending"]}
          />
          <Card>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Badge tone="red">{triggerDetail.status}</Badge>
                  <h2 className="mt-3 font-display text-3xl text-alphavest-ivory md:text-4xl">{triggerDetail.title}</h2>
                </div>
                <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Trigger list scoped</span>
              </div>
              <div className="grid gap-4 md:grid-cols-6">
                {[
                  ["Severity", triggerDetail.severity],
                  ["Status", triggerDetail.status],
                  ["Trigger Date", triggerDetail.date],
                  ["Source", triggerDetail.source],
                  ["Related To", triggerDetail.relatedTo],
                  ["Analyst", triggerDetail.analyst]
                ].map(([label, value]) => (
                  <div className="border-l border-alphavest-border pl-3" key={label}>
                    <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2 border-b border-alphavest-border/70">
            {["Signal Details", "Related Documents (5)", "Evidence (8)", "Activity & History"].map((tab, index) => (
              <span className={cn("px-3 pb-3 text-sm font-semibold", index === 0 ? "border-b-2 border-alphavest-gold text-alphavest-gold" : "text-alphavest-muted")} key={tab}>{tab}</span>
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Signal Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Signal Type", "Beneficial Ownership Change"],
                  ["Detection Method", "Rule: BO-CHANGE-01"],
                  ["Confidence Score", triggerDetail.confidence],
                  ["Source Reference", "WC1-2025-15678901"],
                  ["Jurisdiction", triggerDetail.jurisdiction],
                  ["Entity Type", "Private Limited Company"],
                  ["Last Signal", "Apr 12, 2025"],
                  ["Triggered Rules", "BO-CHANGE-01, BO-RISK-02"]
                ].map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
                <div className="flex flex-wrap gap-2 pt-2">
                  {triggerDetail.tags.map((tag) => <Badge key={tag} tone={toneFor(tag)}>{tag}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Related Entity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <IconTile tone="muted"><BriefcaseBusiness aria-hidden="true" className="size-5" /></IconTile>
                  <div>
                    <p className="font-semibold text-alphavest-ivory">{triggerDetail.relatedTo}</p>
                    <p className="text-sm text-alphavest-muted">ENT-00078512 - Active</p>
                  </div>
                </div>
                <StatePanel detail="You do not have permission to view full entity details. Request access or contact compliance." state="restricted" title="No Access" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Assignment & Routing</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Current Analyst", triggerDetail.analyst],
                  ["Team", "Research - Ownership"],
                  ["Queue", "Escalated Ownership Reviews"],
                  ["SLA Due", "May 12, 2025 17:00 UTC"],
                  ["Priority", triggerDetail.severity],
                  ["Next Review", "May 12, 2025"]
                ].map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
                <button
                  className={secondaryButtonClass + " w-full"}
                  data-testid="j01-route-to-advisor"
                  onClick={() => {
                    void routeToAdvisor().catch((error: unknown) => {
                      setRoutingStatus(error instanceof Error ? error.message : "Demo routing action failed.");
                    });
                  }}
                  type="button"
                >
                  <UsersRound aria-hidden="true" className="size-4" />Reassign / Route
                </button>
                {routingStatus ? <p className="text-xs text-alphavest-gold-soft">{routingStatus}</p> : null}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Analyst Notes</CardTitle><Badge tone="gold">Audit logging required</Badge></CardHeader>
            <CardContent>
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35">
                <div className="flex flex-wrap gap-3 border-b border-alphavest-border p-3 text-sm text-alphavest-muted">
                  {["Paragraph", "B", "I", "U", "List", "Link", "Undo"].map((tool) => <span key={tool}>{tool}</span>)}
                </div>
                <p className="p-4 text-sm leading-6 text-alphavest-muted">{triggerDetail.notes}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-alphavest-subtle">
                <span>Chars: 352 - Words: 62</span>
                <span>Auto-saved 10:22:31</span>
              </div>
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Data Gaps & Escalation <Badge className="ml-2" tone="red">3 gaps</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {dataGaps.map((gap) => (
                <div className="flex items-start justify-between gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={gap.title}>
                  <div>
                    <p className="font-semibold text-alphavest-ivory">{gap.title}</p>
                    <p className="text-sm text-alphavest-muted">{gap.detail}</p>
                  </div>
                  <Badge tone={toneFor(gap.priority)}>{gap.priority}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <StatePanel detail="Escalated to Compliance Review Team because of high-risk ownership structure and incomplete UBO disclosure." state="blocked" title="Escalation Status" />
          <Card>
            <CardHeader><CardTitle>Audit & Completeness</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Notes Last Updated" value="May 9, 2025 10:22 UTC" />
              <InfoRow label="Updated By" value={triggerDetail.analyst} />
              <InfoRow label="Audit status" value="Audit logging required before accepted save" />
            </CardContent>
          </Card>
        </aside>
      </div>
      </WorksurfaceShell>
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

const advisorColumns: Array<DataTableColumn<(typeof advisorQueue)[number]>> = [
  { key: "client", header: "Client / Structure", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}<span className="block text-xs text-alphavest-muted">{row.structure}</span></span>, sortable: true },
  { key: "type", header: "Type", render: (row) => <span>{row.type}<span className="block text-xs">{row.topic}</span></span>, sortable: true },
  { key: "priority", header: "Priority", render: (row) => <Badge tone={toneFor(row.priority)}>{row.priority}</Badge>, sortable: true },
  { key: "submitted", header: "Submitted", render: (row) => row.submitted, sortable: true },
  { key: "due", header: "Due", render: (row) => <span className={row.status === "Overdue" ? "text-alphavest-red" : ""}>{row.due}</span>, sortable: true },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true }
];

function AdvisorQueuePage({ title }: { title: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleRows = advisorQueue.filter((row) => (
    normalizedSearchTerm.length === 0 ||
    [row.client, row.structure, row.type, row.topic, row.priority, row.status].some((value) => value.toLowerCase().includes(normalizedSearchTerm))
  ));

  return (
    <InternalShell activePageId="036">
      <WorksurfaceShell
        description="Advisor review is now a clear human-gate worksurface: queue triage, selected package context and explicit non-release boundary stay visible together."
        eyebrow="WP02 advisor review"
        primary={<Phase5DetailSplitPanel decisionSupport="Advisor queue remains separate from advisor package detail." objectLabel="Advisor queue split" objectState="Advisor work awaiting selection" pageJob="Advisor queue selects packages; detail records review context separately." safetyBoundary="Queue rows cannot approve or release recommendations." splitTaskId="UX-PAGE-SPLIT-004" taskId="UX-PAGE-SPLIT-004" />}
        rail={<AdvisorSummaryPanel />}
        routeId="036"
        safetyNote="WP02 layout only: advisor queue selection does not approve, release, export or create client visibility."
        statusItems={[
          { label: "Queue", tone: "gold", value: `${advisorQueue.length} packages` },
          { label: "Release", tone: "red", value: "Compliance required" },
        ]}
        title={title}
        worksurfaceId="advisor-review-queue"
      >
      <div className="mx-auto max-w-[112rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading
            action={<div className="flex gap-3"><span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><Download aria-hidden="true" className="size-4" />Export held</span><span className={primaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Bulk actions held</span></div>}
            badge={<Badge tone="gold">36</Badge>}
            subtitle="Review and approve client recommendations and updates."
            title={title}
          />
          <div className="grid gap-3 md:grid-cols-5">
            {[
              ["All Pending", "36"],
              ["Overdue", "7"],
              ["Due Today", "8"],
              ["Due This Week", "21"],
              ["Info Requested", "4"]
            ].map(([label, value]) => (
              <Card key={label}><p className="text-sm text-alphavest-muted">{label}</p><p className={cn("mt-2 text-3xl font-semibold", label === "Overdue" ? "text-alphavest-red" : "text-alphavest-gold")}>{value}</p></Card>
            ))}
          </div>
          <div className="grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 lg:grid-cols-[1fr_repeat(4,10rem)_auto]">
            <label className="relative min-w-0">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
              <input
                className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
                data-testid="ux-interaction-advisor-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search queue..."
                type="search"
                value={searchTerm}
              />
            </label>
            {["Type", "Priority", "Risk Level", "Assigned To"].map((filter) => <FilterButton key={filter} label={filter} />)}
            <button aria-label="Additional advisor filters are static in this demo queue" className={secondaryButtonClass} disabled type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
          </div>
          <DataTable
            actionPolicy="route_handoff"
            columns={advisorColumns}
            density="standard_review"
            emptyMessage="No advisor queue rows match this search."
            family="queue"
            filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
            getRowId={(row) => row.client}
            masterDetailMode="route_detail"
            onRowAction={() => router.push("/advisor/reviews/demo")}
            rowActionLabel={(row) => `Open advisor review for ${row.client}`}
            rows={visibleRows}
          />
        </section>
      </div>
      </WorksurfaceShell>
    </InternalShell>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button aria-label={`${label} filter is static in this demo queue`} className="flex h-11 items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted disabled:cursor-not-allowed disabled:opacity-65" disabled type="button">
      <span>{label}: All</span>
      <ChevronDown aria-hidden="true" className="size-4" />
    </button>
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

function AdvisorDetailPage({ title }: { title: string }) {
  const router = useRouter();
  const [decisionStatus, setDecisionStatus] = useState<string | null>(null);

  async function approveRecommendation() {
    setDecisionStatus("Saving advisor candidate. No release, export or client visibility will be created.");
    await runAdvisorApprovalWorkflowAction({
      action: "advisor_approve",
      actorRole: "senior_wealth_advisor",
      reason: "Advisor approved the package; compliance release remains required.",
      targetId: advisorApprovalDemoTargets.northbridge.recommendationId,
    });
    setDecisionStatus("Advisor candidate saved. Compliance pending; no client visibility, export, release or client acceptance was created.");
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
        eyebrow="WP02 advisor review"
        primary={
          <div className="space-y-4">
            <Phase4WorkbenchPanel activeTask="Advisor review ADV-219 selected" blocker="Advisor approval is blocked from release until compliance, evidence and audit gates pass." context="Advisor can assess suitability wording, but cannot publish client-visible advice." primaryAction="Record advisor review" queueLabel="Advisor approval queue" safetyNote="UX-WORKBENCH-003: advisor approval does not set clientVisible and does not bypass compliance release." taskId="UX-WORKBENCH-003" />
            <Phase5DetailSplitPanel decisionSupport="Advisor detail shows suitability, rationale and release preconditions without acting as compliance." objectLabel="Advisor package detail" objectState="Advisor review internal; compliance release missing" pageJob="Advisor detail supports one package review without becoming release room." safetyBoundary="Advisor detail cannot set clientVisible or bypass compliance." splitTaskId="UX-PAGE-SPLIT-004" taskId="UX-PAGE-SPLIT-004" />
          </div>
        }
        rail={
          <aside className="space-y-5">
            <Card>
              <CardHeader><CardTitle>Advisor Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <StatePanel detail="Please review all details before taking action. This can create an advisor candidate only; it does not release content, export content or create client acceptance." state="restricted" title="Advisor candidate only" />
                <p className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-muted">
                  Unsupported claims stay internal and require evidence-backed analyst rebuild before advisor-ready wording can move toward compliance.
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
                <p className={secondaryButtonClass + " w-full"} data-testid="ux-cta-ai-rebuild" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Draft rebuild remains analyst-owned</p>
                <p className={secondaryButtonClass + " w-full"} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Evidence request remains compliance-owned</p>
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
            <StatePanel detail="Advisor candidate is a review state only. Compliance release, client visibility, export and client acceptance remain blocked until their own audited gates pass." state="blocked" title="Not released" />
            <ScfP04P06FlowPanel mode="compliance" />
          </aside>
        }
        routeId="037"
        safetyNote="WP02 layout only: advisor approval can create a compliance-pending state, but cannot release content, mark client acceptance or bypass compliance."
        statusItems={[
          { label: "Status", tone: "gold", value: selectedApproval.status },
          { label: "Visibility", tone: "red", value: "Client blocked" },
        ]}
        title={title}
        worksurfaceId="advisor-review-detail"
      >
      <div className="mx-auto max-w-[112rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading
            badge={<Badge tone="gold">{selectedApproval.status}</Badge>}
            subtitle="Internal only. Advisor approval creates an advisor candidate for compliance; client visibility, export and client acceptance remain blocked."
            title={title}
          />
          <ScfP04P06FlowPanel mode="advisory" />
          <UxDetailStandardPanel
            actionLabel="Approve for compliance review"
            actionState="Advisor approval records an advisor candidate only; compliance release remains required before client visibility."
            evidenceItems={["Reviewed documents", "Client objective", "Recommendation rationale"]}
            facts={[
              { label: "Client", value: selectedApproval.client },
              { label: "Package", value: selectedApproval.packageType },
              { label: "Analyst", value: selectedApproval.analyst },
              { label: "Created", value: selectedApproval.created },
            ]}
            objectTitle={selectedApproval.recommendationId}
            objectType="Advisor approval detail"
            routeId="037"
            safetyNote="No unapproved advice reaches the client; AI draft and unsupported-claim content remain internal until evidence-backed rebuild and all release gates pass."
            status={selectedApproval.status}
            timelineItems={["Analyst submitted", "Advisor candidate", "Compliance not released"]}
          />
          <Card>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {[
                ["Client", selectedApproval.client],
                ["Recommendation ID", selectedApproval.recommendationId],
                ["Package Type", selectedApproval.packageType],
                ["Analyst", selectedApproval.analyst],
                ["Created", selectedApproval.created],
                ["Status", selectedApproval.status]
              ].map(([label, value]) => (
                <div className="border-l border-alphavest-border pl-3" key={label}>
                  <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-5 2xl:grid-cols-[1fr_1.15fr_0.9fr]">
            <Card>
              <CardHeader><CardTitle>Client Objective</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-6 text-alphavest-muted">{selectedApproval.objective}</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone="gold">Retirement Security</Badge><Badge tone="gold">Tax Efficiency</Badge><Badge tone="gold">Legacy Planning</Badge></div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Related Structure</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-center">
                  <p className="font-semibold text-alphavest-ivory">Walker Family Holdings</p>
                  <p className="text-sm text-alphavest-muted">Revocable Living Trust</p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-alphavest-muted">
                  {["James Walker", "Emily Walker", "Walker Family LLC", "Walker Dynasty Trust"].map((item) => <div className="rounded border border-alphavest-border p-2" key={item}>{item}</div>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Reviewed Documents <Badge className="ml-2" tone="gold">6</Badge></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {selectedApproval.documents.map((doc, index) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={doc}>
                    <span className="text-alphavest-muted">{doc}</span>
                    <Badge tone={index < 3 ? "green" : "gold"}>{index < 3 ? "Reviewed" : "In Review"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-5 2xl:grid-cols-4">
            <Card className="xl:col-span-2"><CardHeader><CardTitle>Internal Draft Recommendation</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-alphavest-muted">{selectedApproval.recommendation}</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{["6.4% Return", "10.2% Volatility", "82% Scenario Fit", "89/100 Tax Score"].map((item) => <Badge key={item} tone="green">{item}</Badge>)}</div><p className="mt-4 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">Internal draft only, not client advice. Unsupported claims require evidence-backed rebuild; advisor candidate and compliance review keep client visibility blocked until audited release gates pass.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Risk View</CardTitle></CardHeader><CardContent><p className="text-center text-xl font-semibold text-alphavest-gold">Moderate (5/10)</p><ProgressBar value={50} /><p className="mt-3 text-sm text-alphavest-muted">Key considerations: equity allocation, interest rate sensitivity and sequence risk.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Alternatives</CardTitle></CardHeader><CardContent className="space-y-2">{selectedApproval.alternatives.map((item, index) => <div className="flex justify-between text-sm" key={item}><span className="text-alphavest-muted">{item}</span><Badge tone="gold">Score {84 - index * 5}</Badge></div>)}</CardContent></Card>
          </div>
          <InternalGuard />
        </section>
      </div>
      </WorksurfaceShell>
    </InternalShell>
  );
}

const complianceColumns: Array<DataTableColumn<(typeof complianceQueue)[number]>> = [
  { key: "id", header: "ID", render: (row) => <span className="font-semibold text-alphavest-gold">{row.id}</span>, sortable: true },
  { key: "item", header: "Item", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.item}<span className="block text-xs text-alphavest-muted">{row.sub}</span></span>, sortable: true },
  { key: "classification", header: "Classification", render: (row) => <Badge tone={toneFor(row.classification)}>{row.classification}</Badge>, sortable: true },
  { key: "risk", header: "Risk Status", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge>, sortable: true },
  { key: "advisor", header: "Responsible Advisor", render: (row) => row.advisor, sortable: true },
  { key: "evidence", header: "Evidence Status", render: (row) => <Badge tone={toneFor(row.evidence)}>{row.evidence}</Badge>, sortable: true },
  { key: "publish", header: "Publish Status", render: (row) => <Badge tone={toneFor(row.publish)}>{row.publish}</Badge>, sortable: true },
  { key: "due", header: "Due Date", render: (row) => <span className={row.age !== "0d" ? "text-alphavest-red" : ""}>{row.due}</span>, sortable: true }
];

function ComplianceQueuePage({ title }: { title: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleRows = complianceQueue.filter((row) => (
    normalizedSearchTerm.length === 0 ||
    [row.id, row.item, row.sub, row.classification, row.risk, row.advisor, row.evidence, row.publish].some((value) => value.toLowerCase().includes(normalizedSearchTerm))
  ));

  return (
    <InternalShell activePageId="038">
      <WorksurfaceShell
        description="Compliance review is organized as a release-control worksurface: intake queue, evidence status, policy posture and explicit non-release queue boundary stay visible."
        eyebrow="WP02 compliance release"
        primary={
          <div className="space-y-4">
            <Phase5DetailSplitPanel decisionSupport="Compliance queue separates work intake from decision-room review." objectLabel="Compliance queue split" objectState="Compliance items pending selection" pageJob="Compliance queue prioritizes review work without hiding decision consequences." safetyBoundary="Queue context cannot release, block or request evidence by itself." splitTaskId="UX-PAGE-SPLIT-003" taskId="UX-PAGE-SPLIT-003" />
            <UxHubPage pageId="038" />
          </div>
        }
        rail={
          <WorksurfacePanel description="Queue-level visibility only prioritizes work. Release remains inside the gated review room." title="Release boundary">
            <div className="space-y-3 text-sm">
              <InfoRow label="Queue actions" value="Open review only" />
              <InfoRow label="Advisor approval" value="Prerequisite only" />
              <InfoRow label="Client visibility" value="Blocked" />
            </div>
          </WorksurfacePanel>
        }
        routeId="038"
        safetyNote="WP02 layout only: compliance queue rows cannot release, block, export or expose client-visible content."
        secondary={
          <div className="grid gap-3 md:grid-cols-5">
            {complianceMetrics.map((metric) => (
              <Card key={metric.label}>
                <div className="flex items-center gap-4">
                  <IconTile tone={metric.label === "Overdue" ? "red" : "muted"}>{metric.label === "Overdue" ? <Calendar aria-hidden="true" className="size-5" /> : <ClipboardCheck aria-hidden="true" className="size-5" />}</IconTile>
                  <div>
                    <p className={cn("text-3xl font-semibold", metric.label === "Overdue" ? "text-alphavest-red" : "text-alphavest-ivory")}>{metric.value}</p>
                    <p className="text-sm text-alphavest-muted">{metric.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        }
        statusItems={[
          { label: "Queue", tone: "gold", value: `${complianceQueue.length} reviews` },
          { label: "Release", tone: "red", value: "Gated" },
        ]}
        title={title}
        worksurfaceId="compliance-release-queue"
      >
      <div className="mx-auto max-w-[104rem] space-y-5">
        <PageHeading
          action={<div className="flex gap-3"><span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><Download aria-hidden="true" className="size-4" />Export held</span><span className={primaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><RefreshCw aria-hidden="true" className="size-4" />Refresh held</span></div>}
          subtitle="Review and action pending compliance items."
          title={title}
        />
        <ScfP04P06FlowPanel mode="compliance" />
        <div className="grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 lg:grid-cols-[1fr_repeat(4,10rem)_auto_auto]">
          <label className="relative min-w-0">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input
              className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
              data-testid="ux-interaction-compliance-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by client, advisor, ID, or keyword..."
              type="search"
              value={searchTerm}
            />
          </label>
          {["Classification", "Risk Status", "Evidence Status", "Publish Status"].map((filter) => <FilterButton key={filter} label={filter} />)}
          <button aria-label="Additional compliance filters are static in this demo queue" className={secondaryButtonClass} disabled type="button"><Filter aria-hidden="true" className="size-4" />More Filters</button>
          <button className="px-3 text-sm font-semibold text-alphavest-gold disabled:cursor-not-allowed disabled:opacity-55" disabled={searchTerm.length === 0} onClick={() => setSearchTerm("")} type="button">Clear</button>
        </div>
        <DataTable
          actionPolicy="route_handoff"
          columns={complianceColumns}
          density="standard_review"
          emptyMessage="No compliance queue rows match this search."
          family="queue"
          filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
          getRowId={(row) => row.id}
          masterDetailMode="route_detail"
          onRowAction={(row) => router.push(`/compliance/reviews/${row.id}/decision-room`)}
          rowActionLabel={(row) => `Open compliance review ${row.id}`}
          rows={visibleRows}
        />
      </div>
      </WorksurfaceShell>
    </InternalShell>
  );
}

function ComplianceReviewPage({ title }: { title: string }) {
  const [confirmationAction, setConfirmationAction] = useState<SensitiveWorkflowAction | null>(null);

  return (
    <InternalShell activePageId="039">
      <WorksurfaceShell
        description="The compliance decision room keeps evidence, policy, preconditions, request/block controls and audit context in one release-gated worksurface."
        eyebrow="WP02 compliance release"
        primary={
          <div className="space-y-4">
            <Phase5DetailSplitPanel decisionSupport="Compliance detail carries evidence, policy and audit state before later decision-room actions." objectLabel="Compliance object review" objectState="Release gates not satisfied" pageJob="Compliance detail reviews one object without becoming a hidden drawer decision." safetyBoundary="Detail context cannot release without explicit gated decision controls." splitTaskId="UX-PAGE-SPLIT-003" taskId="UX-PAGE-SPLIT-003" />
            <Phase6DecisionRoomPanel audit="Audit event must record actor, target, gate state and confirm or cancel outcome before any release mutation." blocker="Release remains blocked because evidence, policy, reviewer and approver gates are not all satisfied." cancelLabel="Cancel without mutation" confirmLabel="Confirm compliance release" decisionLabel="Compliance release decision room" evidence="Evidence checklist, policy exception state and audit references are visible before decision." preconditions="Evidence review complete, policy pass, human reviewer and compliance approver must all pass." safetyNote="No release, export or advice effect can occur until gate preconditions pass and an audit record exists." taskId="UX-DECISION-ROOM-001" />
          </div>
        }
        rail={
          <aside className="space-y-5">
            <Card>
              <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <StatePanel
                  detail="This item cannot be released until all required evidence is complete and policy checks pass."
                  feedback={{
                    actionMeaning: "release",
                    intent: "blocked",
                    placement: "action_rail",
                    subject: "compliance_release",
                  }}
                  state="blocked"
                  title="Release gates not satisfied"
                />
                <StickyActionZone testId="e05-compliance-release-action-zone">
                  <ActionButton
                    availability="blocked_static"
                    className="w-full"
                    disabledReason="Release remains blocked until evidence, policy, reviewer and approver gates pass."
                    meaning="release"
                    placement="sticky_rail"
                    priority="blocked"
                    requiresPermission={false}
                    testId="wp06-release-blocked-control"
                    title="Release blocked"
                    visibleDisabledReason
                  >
                    <LockKeyhole aria-hidden="true" className="size-4" />Release blocked until preconditions pass
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
                    Keep Blocked
                  </ActionButton>
                </StickyActionZone>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Review History</CardTitle></CardHeader>
              <CardContent>
                <AuditTimeline
                  items={[
                    { actor: "System", id: "classification", result: "SUCCESS", timestamp: "May 21, 2025 09:15 AM", title: "Auto-classification completed" },
                    { actor: "Sarah Chen", id: "assigned", result: "PENDING", timestamp: "May 21, 2025 09:16 AM", title: "Assigned to reviewer" },
                    { actor: "Policy engine", id: "policy", result: "BLOCKED", timestamp: "May 21, 2025 09:18 AM", title: "Policy check exception" }
                  ]}
                />
              </CardContent>
            </Card>
          </aside>
        }
        routeId="039"
        safetyNote="WP02 layout only: compliance can request evidence or keep release blocked here; release, export and client acceptance remain separate gated actions."
        statusItems={[
          { label: "Gate", tone: "red", value: "Blocked" },
          { label: "Evidence", tone: "red", value: "Incomplete" },
        ]}
        title={title}
        worksurfaceId="compliance-release-decision-room"
      >
      <div className="mx-auto max-w-[112rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading
            badge={<Badge tone="gold">In Review</Badge>}
            subtitle={`${complianceReview.id} - ${complianceReview.client}`}
            title={title}
          />
          <ScfP04P06FlowPanel mode="compliance" />
          <UxDetailStandardPanel
            actionLabel="Release, block or request evidence"
            actionState="Release is disabled until evidence, policy, reviewer and approver prerequisites pass."
            evidenceItems={["Evidence review state", "Policy checks", "Audit references"]}
            facts={[
              { label: "Review ID", value: complianceReview.id },
              { label: "Classification", value: complianceReview.classification },
              { label: "Due", value: complianceReview.due },
              { label: "Policy", value: complianceReview.policy },
            ]}
            objectTitle={complianceReview.title}
            objectType="Compliance review detail"
            routeId="039"
            safetyNote="Advisor approval is not compliance release; compliance release is not client acceptance."
            status="Release gates not satisfied"
            timelineItems={["Auto-classification completed", "Reviewer assigned", "Policy exception open"]}
          />
          <CompliancePreconditionChecklist />
          <UxComplexityPriorityPanel
            actionLabel="Request evidence or block release"
            actionState="Release stays blocked while evidence review and policy checks are unresolved."
            priorityItems={[
              { detail: complianceReview.client, label: complianceReview.title, value: complianceReview.classification },
              { detail: complianceReview.evidenceComplete, label: "Evidence review state", value: "Incomplete" },
              { detail: complianceReview.policy, label: "Policy exception", value: "Open" },
            ]}
            safetyNote="Compliance card hierarchy does not complete release; the release action remains separately gated."
            summaryItems={[
              { detail: "Current review state", label: "Gate", value: "Blocked" },
              { detail: complianceReview.due, label: "Due", value: "P0" },
              { detail: "Advisor approval is not release", label: "Boundary", value: "Held" },
            ]}
            title="Compliance review hierarchy"
          />
          <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-[0.85fr_0.9fr_0.9fr]">
            <Card>
              <CardHeader><CardTitle>Output Classification</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <IconTile tone="red"><ShieldAlert aria-hidden="true" className="size-5" /></IconTile>
                <p className="font-display text-2xl text-alphavest-ivory">{complianceReview.classification}</p>
                <Badge tone="red">Exception</Badge>
                <InfoRow label="Regulation" value={complianceReview.regulation} />
                <InfoRow label="Policy" value={complianceReview.policy} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Evidence Completeness</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-4"><ProgressRing label="Complete" value={67} /><p className="text-sm text-alphavest-muted">6 of 9 evidence requirements complete.</p></div>
                {evidenceChecklist.map((item) => (
                  <div className="flex items-center justify-between text-sm" key={item.label}>
                    <span className="text-alphavest-muted">{item.label}</span>
                    <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="xl:col-span-2 2xl:col-span-1">
              <CardHeader><CardTitle>Policy Checks</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {policyChecks.map((item) => (
                  <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-2 text-sm last:border-0" key={item.policy}>
                    <span className="text-alphavest-muted">{item.policy}</span>
                    <Badge tone={toneFor(item.result)}>{item.result}</Badge>
                  </div>
                ))}
                <StatePanel detail="Risk disclosure is missing or not prominently displayed." state="blocked" title="MC-03 Risk Disclosure" />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Performance numbers reference Q1 factsheet. Need supporting calculation sheet and clearer risk disclosure placement.", "Producer indicated risk disclosure will be updated in next version."].map((note, index) => (
                  <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={note}>
                    <div className="mb-2 flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full border border-alphavest-border text-xs">{index === 0 ? "SC" : "JM"}</span><Badge tone="gold">Internal note</Badge></div>
                    <p className="text-sm leading-6 text-alphavest-muted">{note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Audit References</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {auditReferences.map((item) => (
                  <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-2 text-sm last:border-0" key={item.name}>
                    <span className="text-alphavest-muted">{item.name}</span>
                    <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <StatePanel detail={`${complianceReview.releaseGates}. Release is disabled until evidence, policy, reviewer and approver gates pass.`} state="blocked" title="Release Gates Summary" />
        </section>
      </div>
      </WorksurfaceShell>
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
        eyebrow="WP02 compliance release"
        primary={<StatePanel detail="Compliance release is still pending until the exact confirmation phrase is entered and the audited action succeeds." state="restricted" title="Release action required" />}
        routeId="040"
        safetyNote="WP02 layout only: this surface organizes the release confirmation UI; export, download, share and client acceptance remain separate controls."
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
            <LockKeyhole aria-hidden="true" className="size-4" />{status === "submitting" ? "Submitting..." : "Release client-safe journey"}
          </button>
        </>
      }
      onClose={status === "submitting" ? undefined : resetAndClose}
      open={open}
      title="Release client-safe journey"
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
          ? "Release completed only through the existing audited workflow. Export, download, share and client acceptance remain separate controls."
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
