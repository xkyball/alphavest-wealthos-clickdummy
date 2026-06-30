"use client";

import { useEffect, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { GlobalSearchBox } from "@/components/global-search-box";
import {
  AuditTimeline,
  ActionButton,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  FilterBar,
  MasterDetailSurface,
  Modal,
  StatePanel,
  StickyActionZone,
  FieldFeedback,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { ActorSessionProvider, useActorSession } from "@/components/actor-session-provider";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import type {
  BackendDataSurfaceMeta,
  DataSurfaceSortDirection,
} from "@/lib/data-surface-query-contract";
import {
  analystDraftRouteOwnershipForPageId,
} from "@/lib/analyst-draft-governance-contract";
import {
  advisorReviewRouteOwnershipForPageId,
} from "@/lib/advisor-review-approval-contract";
import {
  complianceReviewReleaseAcceptanceCriteria,
  complianceReviewReleaseContractId,
  complianceReviewReleaseProofBoundaryForPageId,
  complianceReviewReleaseRouteOwnershipForPageId,
} from "@/lib/compliance-review-release-contract";
import { processFirstUxContractForPageId } from "@/lib/process-first-ux-contract";
import { uxActionAttributesFor, uxActionClassForPriority } from "@/lib/ux-action-hierarchy-contract";
import { uxFeedbackSuccessMessageForSubject } from "@/lib/ux-feedback-message-contract";
import { uxPageTemplateForPageId } from "@/lib/ux-page-template-system";
import { uxRouteShellPageJobContractForTemplate } from "@/lib/ux-route-shell-page-job-contract";
import { uxConfirmationAttributesFor, uxStatusCommandAttributesFor } from "@/lib/ux-status-command-hierarchy";
import { workflow05ComplianceReleaseConfirmationPhrase } from "@/lib/advisory-workflow-contract";
import {
  runAdvisorApprovalWorkflowAction,
} from "@/lib/recommendation-review-workflow-client";
import type {
  AnalystWorkbenchPriorityFilter,
  AnalystWorkbenchQueueRow,
  AnalystWorkbenchSortKey,
  AnalystWorkbenchStatusFilter,
  AdvisorReviewPriorityFilter,
  AdvisorReviewQueueRow,
  AdvisorReviewSortKey,
  AdvisorReviewStatusFilter,
  ComplianceReleaseQueueRow,
  ComplianceReviewPublishFilter,
  ComplianceReviewRiskFilter,
  ComplianceReviewSortKey,
  RecommendationReviewQueueReadModel,
} from "@/lib/recommendation-review-queue-types";
import {
  auditReferences,
  complianceMetrics,
  complianceReview,
  dataGaps,
  dataQualityDomains,
  evidenceChecklist,
  internalWorkflowPageIds,
  missingInfoTasks,
  policyChecks,
  readinessChecklist,
  releaseChecklist,
  selectedSignal,
  signalQueue,
  signalRoutingOptions,
  triggerDetail,
  workbenchHousehold
} from "@/lib/internal-workflow-seed-data";
import { runAdvisorReviewCommand } from "@/lib/advisor-review-command-client";
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";

type InternalWorkflowScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

const analystTriggerReviewTargetId = "fcf38ed6-2e1f-52e2-824d-b10b91363bee";

type RecommendationReviewQueueState =
  | { loadState: "loading"; snapshot: null }
  | { loadState: "ready"; snapshot: RecommendationReviewQueueReadModel }
  | { loadState: "error"; snapshot: null };

type RecommendationReviewQueueOptions = {
  focusId?: string;
  page?: number;
  pageSize?: number;
  priority?: AdvisorReviewPriorityFilter | AnalystWorkbenchPriorityFilter;
  publish?: ComplianceReviewPublishFilter;
  q?: string;
  risk?: ComplianceReviewRiskFilter;
  sortDirection?: DataSurfaceSortDirection;
  sortKey?: AdvisorReviewSortKey | ComplianceReviewSortKey | AnalystWorkbenchSortKey;
  status?: AdvisorReviewStatusFilter | AnalystWorkbenchStatusFilter;
  surface?: "advisor" | "analyst" | "compliance";
};

function recommendationReviewQueueParams(options: RecommendationReviewQueueOptions = {}) {
  const params = new URLSearchParams();

  if (options.surface) params.set("surface", options.surface);
  if (options.focusId) params.set("focusId", options.focusId);
  if (options.page) params.set("page", String(options.page));
  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.q) params.set("q", options.q);
  if (options.sortDirection) params.set("sortDirection", options.sortDirection);
  if (options.sortKey) params.set("sortKey", options.sortKey);
  if (options.priority) params.set("priority", options.priority);
  if (options.status) params.set("status", options.status);
  if (options.publish) params.set("publish", options.publish);
  if (options.risk) params.set("risk", options.risk);

  return params.toString();
}

type ReviewQueueMeta = BackendDataSurfaceMeta<string>;

function useRecommendationReviewQueueSnapshot(options: RecommendationReviewQueueOptions = {}): RecommendationReviewQueueState {
  const [queueState, setQueueState] = useState<RecommendationReviewQueueState>({ loadState: "loading", snapshot: null });
  const queryString = recommendationReviewQueueParams(options);

  useEffect(() => {
    let cancelled = false;

    async function loadQueueSnapshot() {
      try {
        const response = await fetch(`/api/recommendation-review-workflow${queryString ? `?${queryString}` : ""}`, {
          headers: { Accept: "application/json" },
        });
        const body = (await response.json()) as { ok?: boolean; snapshot?: RecommendationReviewQueueReadModel };

        if (!response.ok || body.ok !== true || !body.snapshot) {
          throw new Error("Recommendation review queue state is unavailable.");
        }

        if (!cancelled) {
          setQueueState({ loadState: "ready", snapshot: body.snapshot });
        }
      } catch {
        if (!cancelled) {
          setQueueState({ loadState: "error", snapshot: null });
        }
      }
    }

    void loadQueueSnapshot();

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  return queueState;
}

function routeObjectIdFromPathname(pathname: string, marker: string) {
  const segments = pathname.split("/").filter(Boolean);
  const markerIndex = segments.indexOf(marker);

  return markerIndex >= 0 ? decodeURIComponent(segments[markerIndex + 1] ?? "") : "";
}

function isCurrentAliasRoute(pathname: string) {
  return routeObjectIdFromPathname(pathname, "reviews") === "current";
}

function complianceRouteForRow(row: ComplianceReleaseQueueRow, pathname: string) {
  if (pathname.endsWith("/release")) return row.decisionRoomHref.replace(/\/decision-room$/, "/release");
  if (pathname.endsWith("/block")) return row.decisionRoomHref.replace(/\/decision-room$/, "/block");
  if (pathname.endsWith("/audit")) return row.decisionRoomHref.replace(/\/decision-room$/, "/audit");

  return row.decisionRoomHref;
}

function withCurrentQuery(path: string) {
  if (typeof window === "undefined") return path;

  return `${path}${window.location.search}`;
}

function advisorDetailFromSnapshot(snapshot: RecommendationReviewQueueReadModel | null, pathname: string) {
  const routeId = routeObjectIdFromPathname(pathname, "reviews");

  if (!snapshot) return null;
  if (routeId === "current") return snapshot.focusedAdvisorRow ?? snapshot.advisorQueue[0] ?? null;

  return snapshot.focusedAdvisorRow ?? snapshot.advisorQueue.find((row) => row.id === routeId || row.recommendationId === routeId) ?? null;
}

function complianceDetailFromSnapshot(snapshot: RecommendationReviewQueueReadModel | null, pathname: string) {
  const routeId = routeObjectIdFromPathname(pathname, "reviews");

  if (!snapshot) return null;
  if (routeId === "current") return snapshot.focusedComplianceRow ?? snapshot.complianceQueue[0] ?? null;

  return snapshot.focusedComplianceRow ?? snapshot.complianceQueue.find((row) => row.id === routeId || row.recommendationId === routeId) ?? null;
}

const primaryButtonClass = uxActionClassForPriority("primary");
const secondaryButtonClass = uxActionClassForPriority("secondary");
const queueSelectClass =
  "h-[var(--field-height)] rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  "mt-2 min-h-24 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold disabled:cursor-not-allowed disabled:opacity-60";

type SensitiveWorkflowAction = "compliance_block" | "request_evidence";
type ComplianceWorkflowSelection = {
  advisorLabel: string;
  clientLabel: string;
  evidenceIds: string[];
  evidenceLabel: string;
  packageLabel: string;
  releaseStatus: string;
  reviewId: string;
  reviewLabel: string;
  targetId: string;
};

const sensitiveWorkflowCopy: Record<
  SensitiveWorkflowAction,
  {
    action: SensitiveWorkflowAction;
    defaultReason: string;
    description: string;
    phrase: string;
    submitLabel: string;
    title: string;
  }
> = {
  compliance_block: {
    action: "compliance_block",
    defaultReason: "Compliance blocked release because required evidence is incomplete.",
    description: "Block client release for this recommendation and record a compliance audit event. This is not client acceptance.",
    phrase: "BLOCK RELEASE",
    submitLabel: "Block client release",
    title: "Confirm Compliance Block - No Client Release",
  },
  request_evidence: {
    action: "request_evidence",
    defaultReason: "Compliance requested missing evidence before client release.",
    description: "Request missing evidence while keeping the recommendation blocked from client release and client visibility.",
    phrase: "REQUEST EVIDENCE",
    submitLabel: "Request evidence, keep release blocked",
    title: "Confirm Evidence Request - No Client Release",
  },
};

function complianceWorkflowSelectionForRow(row: ComplianceReleaseQueueRow | null): ComplianceWorkflowSelection {
  return {
    advisorLabel: row?.advisor ?? "Advisor loading",
    clientLabel: row?.sub ?? "Client loading",
    evidenceIds: row?.evidenceIds ?? [],
    evidenceLabel: row?.evidence ?? "Evidence pending",
    packageLabel: row?.item ?? "Package loading",
    releaseStatus: row?.publish ?? "Release loading",
    reviewId: row?.id ?? "no-selected-review",
    reviewLabel: row ? `${row.sub} / ${row.item}` : "No selected review",
    targetId: row?.recommendationId ?? "no-selected-recommendation",
  };
}

function SensitiveWorkflowConfirmationModal({
  action,
  onClose,
  open,
  selection,
}: {
  action: SensitiveWorkflowAction | null;
  onClose: () => void;
  open: boolean;
  selection: ComplianceWorkflowSelection;
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
        evidenceIds: selection.evidenceIds,
        reason: reason.trim(),
        targetId: selection.targetId,
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
        data-ux-selected-evidence-ids={selection.evidenceIds.join(" ")}
        data-ux-selected-review-id={selection.reviewId}
        data-ux-selected-target-id={selection.targetId}
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
            data-testid={`typed-${config.action}-acknowledgement`}
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
            data-testid={`typed-${config.action}-reason`}
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
    <span className={cn("inline-flex min-w-0 max-w-full items-start gap-1.5 font-semibold leading-tight", toneClass[tone])}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="min-w-0 whitespace-normal break-words">{value}</span>
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
  return <ProcessSidebar />;
}

function InternalTopBar() {
  const { session } = useActorSession();

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
    <ActorSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid">
        <InternalSidebar />
        <div className="min-w-0">
          <InternalTopBar />
          <main className="px-4 py-6 md:px-6">
            <OperationalDefaultSurface>{children}</OperationalDefaultSurface>
          </main>
        </div>
      </div>
    </ActorSessionProvider>
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
    <Card data-testid="workflow06-compliance-precondition-checklist" data-workflow06-release-ready="false">
      <CardHeader><CardTitle>Release Preconditions</CardTitle></CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-5">
        {compliancePreconditions.map((item) => (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" data-workflow06-precondition={item.label.toLowerCase().replaceAll(" ", "-")} key={item.label}>
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

function SignalsPage({ title }: { title: string }) {
  return (
    <InternalShell activePageId="033">
      <WorksurfaceShell
        density="compact"
        description="Internal signal entry for reviewing signal context and moving one item into analyst work."
        eyebrow="Internal entry"
        primary={
          <div className="space-y-3">
            <PageHeading
              subtitle="Review signal context and move the item into the analyst workbench."
              title={title}
            />
            <AnalystSignalAreaEntry />
          </div>
        }
        routeId="033"
        safetyNote="This is an internal area entry. It can navigate to analyst work; it cannot approve advice, release content, export content or expose drafts to clients."
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

function AnalystSignalAreaEntry() {
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
      data-s033-analyst-area-entry="true"
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
              ["/advisory/triggers/liquidity-drift/review", "Trigger review"],
              ["/documents", "Evidence lifecycle"],
            ].map(([href, label]) => (
              <Link className={secondaryButtonClass} data-testid="ux-hub-next-link" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card density="compact">
        <CardHeader className="pb-2">
          <CardTitle>Signal context</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Signal" value={primarySignal.id} />
            <InfoRow label="Severity" value={primarySignal.severity} />
            <InfoRow label="Source" value={primarySignal.source} />
            <InfoRow label="Open gaps" value={String(selectedSignal.missingElements.length)} />
          </div>
          <StatePanel
            detail="Open the workbench to resolve missing evidence and prepare the advisor handoff."
            state="restricted"
            title="Workbench required"
          />
          <Link className={primaryButtonClass} href="/advisory/review-queue">
            Continue to workbench
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}

function S035CompactDetailStandardPanel() {
  return (
    <section
      className="grid gap-1.5 rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-2.5"
      data-testid="ux-page-detail-standard"
      data-ux-d4-focused-detail="true"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle" data-testid="ux-d4-focused-status-strip">Object / Status / Next action / Check</p>
      <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2" data-testid="ux-page-detail-object-header">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-alphavest-subtle">Trigger detail</p>
        <p className="mt-1 line-clamp-1 text-sm font-semibold text-alphavest-ivory">{triggerDetail.title}</p>
        <div className="mt-1 text-xs text-alphavest-muted" data-testid="ux-page-detail-key-facts">{triggerDetail.severity} / {triggerDetail.source} / {triggerDetail.analyst}</div>
      </div>
      <p className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-2 text-xs leading-5 text-alphavest-muted" data-testid="ux-page-detail-evidence-timeline">Evidence / timeline: beneficial ownership signal; escalation pending.</p>
      <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2 text-xs font-semibold text-alphavest-ivory" data-testid="ux-page-detail-gated-action-rail">Next step: open advisor review. Client package stays held.</p>
    </section>
  );
}

function WorkbenchPage({ title }: { title: string }) {
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState<AnalystWorkbenchPriorityFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [sortKey, setSortKey] = useState<AnalystWorkbenchSortKey>("client");
  const [statusFilter, setStatusFilter] = useState<AnalystWorkbenchStatusFilter>("all");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({
    page,
    pageSize: 6,
    priority: priorityFilter,
    q: searchTerm,
    sortDirection,
    sortKey,
    status: statusFilter,
    surface: "analyst",
  });
  const analystRows = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.analystQueue : [];
  const analystMeta = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.analystQueueMeta as ReviewQueueMeta : null;
  const activeAnalystFilters = [priorityFilter !== "all", statusFilter !== "all"].filter(Boolean).length;
  const selectedWorkItem = analystRows[0];
  function handleAnalystSort(nextKey: string) {
    setPage(1);
    if (sortKey === nextKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey as AnalystWorkbenchSortKey);
      setSortDirection("asc");
    }
  }
  const analystQueueColumns: Array<DataTableColumn<AnalystWorkbenchQueueRow>> = [
    { key: "client", header: "Client", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}</span>, sortable: true },
    { key: "topic", header: "Topic", render: (row) => <span className="line-clamp-2 max-w-[12rem] leading-5">{row.topic}</span>, sortable: true },
    { key: "priority", header: "Priority", render: (row) => <InlineStatus tone={toneFor(row.priority)} value={row.priority} />, sortable: true },
    { key: "status", header: "Status", render: (row) => <InlineStatus tone={toneFor(row.status)} value={row.status} />, sortable: true },
    { key: "next", header: "Next", render: (row) => <span className="line-clamp-2 max-w-[12rem] leading-5">{row.next}</span>, sortable: true },
  ];
  const queueStatusValue =
    queueSnapshot.loadState === "loading"
      ? "Loading"
      : queueSnapshot.loadState === "error"
        ? "Unavailable"
        : `${analystMeta?.totalRows ?? analystRows.length} work items`;

  return (
    <InternalShell activePageId="034">
      <WorksurfaceShell
        density="compact"
        description="The analyst workbench combines operational status, active client queues, trigger work and draft readiness in one review-owned surface."
        eyebrow="Internal workbench"
        primary={
          <div className="space-y-2">
            <PageHeading
              subtitle="Triage one selected signal, its blocker and the next analyst handoff."
              title={title}
            />
            <div className="grid gap-2">
              <MasterDetailSurface
                actionPolicy="route_handoff"
                actionRail="present"
                density="compact_operations"
                detail={
                  selectedWorkItem ? (
                    <Card data-testid="s034-client-selected-detail">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{selectedWorkItem.client}</CardTitle>
                            <p className="mt-0.5 text-xs text-alphavest-muted">{selectedWorkItem.type} - {selectedWorkItem.segment}</p>
                          </div>
                          <InlineStatus tone={toneFor(selectedWorkItem.priority)} value={selectedWorkItem.priority} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid gap-2 text-sm">
                          <InfoRow label="Next work" value={selectedWorkItem.next} />
                          <InfoRow label="Queue age" value={selectedWorkItem.age} />
                          <InfoRow label="Topic" value={selectedWorkItem.topic} />
                          <InfoRow label="Evidence" value={`${selectedWorkItem.evidenceCount} linked`} />
                          <InfoRow label="Activity" value={`${selectedWorkItem.workflow.commandHistoryCount} entries`} />
                          <InfoRow label="Compliance review" value="Required" />
                          <InfoRow label="Client package" value="Held" />
                        </div>
                        <div className="grid gap-2">
                          <Link className={primaryButtonClass} data-ux-affordance="route-handoff" data-ux-command-intent="open-controlled-review-work" data-ux-interactive="true" href={selectedWorkItem.detailHref}>
                            Open review work
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <StatePanel detail="No client work item is selected." state="empty" title="No selected work item" />
                  )
                }
                family="queue"
                filterState={searchTerm.length > 0 && activeAnalystFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeAnalystFilters > 0 ? "active_filter" : "inactive"}
                master={
                  <div className="space-y-3" data-testid="s034-client-master-list">
                    <FilterBar
                      activeFilterCount={activeAnalystFilters}
                      activeStateLabel={searchTerm.length > 0 || activeAnalystFilters > 0 ? "Analyst workbench filters applied." : "Analyst workbench is current."}
                      filterState={searchTerm.length > 0 && activeAnalystFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeAnalystFilters > 0 ? "active_filter" : "inactive"}
                      onQueryChange={(value) => { setSearchTerm(value); setPage(1); }}
                      onReset={() => { setSearchTerm(""); setPriorityFilter("all"); setStatusFilter("all"); setPage(1); }}
                      placeholder="Search workbench..."
                      queryValue={searchTerm}
                      searchTestId="ux-interaction-analyst-search"
                    />
                    <div className="grid gap-2 sm:grid-cols-2" data-testid="s034-analyst-real-filters">
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                        Priority
                        <select
                          className={queueSelectClass}
                          onChange={(event) => { setPriorityFilter(event.target.value as AnalystWorkbenchPriorityFilter); setPage(1); }}
                          value={priorityFilter}
                        >
                          <option value="all">All priorities</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                        Status
                        <select
                          className={queueSelectClass}
                          onChange={(event) => { setStatusFilter(event.target.value as AnalystWorkbenchStatusFilter); setPage(1); }}
                          value={statusFilter}
                        >
                          <option value="all">All statuses</option>
                          <option value="analyst_reviewed">Analyst reviewed</option>
                          <option value="blocked">Blocked</option>
                          <option value="compliance_pending">Compliance pending</option>
                          <option value="draft">Draft</option>
                          <option value="more_data_requested">More data requested</option>
                          <option value="ready_for_compliance">Ready for compliance</option>
                        </select>
                      </label>
                    </div>
                    <DataTable
                      actionPolicy="open_detail"
                      columns={analystQueueColumns}
                      compact
                      density="compact"
                      emptyMessage="No analyst work items match this search."
                      family="queue"
                      filterState={searchTerm.length > 0 && activeAnalystFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeAnalystFilters > 0 ? "active_filter" : "inactive"}
                      getRowId={(row) => row.id}
                      masterDetailMode="inline_detail_rail"
                      mobileCardTitle={(row) => row.client}
                      onRowAction={(row) => { window.location.href = row.detailHref; }}
                      onSortChange={handleAnalystSort}
                      pagination={analystMeta ? { ...analystMeta, onPageChange: setPage } : null}
                      responsiveMode="table"
                      rowActionLabel={(row) => `Open analyst work for ${row.client}`}
                      rows={analystRows}
                      serverSort
                      sortDirection={sortDirection}
                      sortKey={sortKey}
                    />
                  </div>
                }
                masterDetailMode="inline_detail_rail"
                queueWorkbench
                selectedObjectId={selectedWorkItem?.id ?? "no-client-row"}
                selectedObjectState={selectedWorkItem?.priority ?? "empty"}
                stickyRail
              />
            </div>
          </div>
        }
        routeId="034"
        safetyNote="The workbench organizes analyst work but does not publish, release, export or alter client visibility."
        statusItems={[
         { label: "Queue", tone: queueSnapshot.loadState === "error" ? "red" : "gold", value: queueStatusValue },
         { label: "Visibility", tone: "red", value: "Internal only" },
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
    await runAdvisorReviewCommand("j01.routeToAdvisor", {
      targetId: analystTriggerReviewTargetId,
      targetType: "TRIGGER",
    });
    router.push("/advisor/reviews");
  }

  return (
    <InternalShell activePageId="035">
      <WorksurfaceShell
        density="compact"
        description="The trigger detail page is now the focused analyst object review surface: signal context, missing evidence, draft guardrail and handoff action are kept together."
        eyebrow="Internal workbench"
        primary={
          <div className="space-y-3" data-domain09-review-surface="trigger-draft">
            <PageHeading
              action={<InlineStatus tone="red" value={triggerDetail.status} />}
              subtitle="Review the selected trigger, missing evidence and next analyst action."
              title={title}
            />
            <div className="grid gap-3">
              <Card density="compact">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{triggerDetail.title}</CardTitle>
                      <p className="mt-1 text-sm text-alphavest-muted">{triggerDetail.triggerId} · {triggerDetail.date}</p>
                    </div>
                    <InlineStatus tone={toneFor(triggerDetail.severity)} value={triggerDetail.severity} />
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <InfoRow label="Source" value={triggerDetail.source} />
                    <InfoRow label="Related object" value={triggerDetail.relatedTo} />
                    <InfoRow label="Confidence" value={triggerDetail.confidence} />
                    <InfoRow label="Jurisdiction" value={triggerDetail.jurisdiction} />
                    <InfoRow label="Analyst" value={triggerDetail.analyst} />
                    <InfoRow label="Status" value={triggerDetail.status} />
                  </div>
                  <p className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-muted">{triggerDetail.notes}</p>
                </CardContent>
              </Card>
              <Card density="compact">
                <CardHeader className="pb-2"><CardTitle>Next action</CardTitle></CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid gap-2">
                    {dataGaps.map((gap) => (
                      <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={gap.title}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-alphavest-ivory">{gap.title}</p>
                          <InlineStatus tone={toneFor(gap.priority)} value={gap.priority} />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-alphavest-muted">{gap.detail}</p>
                      </div>
                    ))}
                  </div>
                  {routingStatus ? <p className="rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 p-2 text-xs text-alphavest-gold-soft">{routingStatus}</p> : null}
                  <button className={primaryButtonClass} onClick={() => { void routeToAdvisor(); }} type="button">Route to advisor review</button>
                  <Link className={secondaryButtonClass} href="/documents/upload">Request missing evidence</Link>
                </CardContent>
              </Card>
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
    <div className="grid grid-cols-[minmax(5.5rem,0.85fr)_minmax(0,1.15fr)] items-start gap-3 border-b border-alphavest-border/45 pb-2 last:border-0">
      <span className="min-w-0 text-alphavest-muted">{label}</span>
      <span className="min-w-0 break-words text-right font-semibold text-alphavest-ivory [overflow-wrap:anywhere]">{value}</span>
    </div>
  );
}

function AdvisorQueuePage({ title }: { title: string }) {
  const router = useRouter();
  const routeOwnership = advisorReviewRouteOwnershipForPageId("036");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState<AdvisorReviewPriorityFilter>("all");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [sortKey, setSortKey] = useState<AdvisorReviewSortKey>("client");
  const [statusFilter, setStatusFilter] = useState<AdvisorReviewStatusFilter>("all");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({
    page,
    pageSize: 6,
    priority: priorityFilter,
    q: searchTerm,
    sortDirection,
    sortKey,
    status: statusFilter,
    surface: "advisor",
  });
  const advisorRows = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.advisorQueue : [];
  const advisorMeta = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.advisorQueueMeta as ReviewQueueMeta : null;
  const activeAdvisorFilters = [priorityFilter !== "all", statusFilter !== "all"].filter(Boolean).length;
  const selectedAdvisorRow = advisorRows[0];
  function handleAdvisorSort(nextKey: string) {
    setPage(1);
    if (sortKey === nextKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey as AdvisorReviewSortKey);
      setSortDirection("asc");
    }
  }
  const advisorQueueColumns: Array<DataTableColumn<AdvisorReviewQueueRow>> = [
    { key: "client", header: "Client", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}</span>, sortable: true },
    { key: "type", header: "Type", render: (row) => row.type, sortable: true },
    { key: "topic", header: "Topic", render: (row) => row.topic, sortable: true },
    { key: "priority", header: "Priority", render: (row) => <InlineStatus tone={toneFor(row.priority)} value={row.priority} />, sortable: true },
    { key: "status", header: "Status", render: (row) => <InlineStatus tone={toneFor(row.status)} value={row.status} />, sortable: true },
  ];
  const queueStatusValue =
    queueSnapshot.loadState === "loading"
      ? "Loading"
        : queueSnapshot.loadState === "error"
          ? "Unavailable"
        : `${advisorMeta?.totalRows ?? advisorRows.length} packages`;

  return (
    <InternalShell activePageId="036">
      <WorksurfaceShell
        density="compact"
        description="Advisor review is now a clear human-check worksurface: queue triage, selected package context and explicit non-release boundary stay visible together."
        eyebrow="Advisor review"
        primary={
          <div className="space-y-2">
            <PageHeading
              action={<button className={primaryButtonClass} data-testid="domain10-s036-primary-next-action" disabled={!selectedAdvisorRow} onClick={() => selectedAdvisorRow ? router.push(selectedAdvisorRow.detailHref) : undefined} type="button">Open selected review</button>}
              subtitle={routeOwnership?.primaryJob ?? "Review advisor packages and open the selected detail."}
              title={title}
            />
            <MasterDetailSurface
              actionPolicy="route_handoff"
              actionRail="present"
              className="min-h-[22rem]"
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
                        <InfoRow label="Review state" value={selectedAdvisorRow.workflow.status} />
                        <InfoRow label="Next step" value={selectedAdvisorRow.workflow.currentActionLabel} />
                        <InfoRow label="Activity" value={`${selectedAdvisorRow.workflow.commandHistoryCount} entries`} />
                        <InfoRow label="Compliance review" value="Required" />
                        <InfoRow label="Client package" value="Held" />
                      </div>
                      <button className={primaryButtonClass + " w-full"} data-testid="s036-open-selected-review" onClick={() => router.push(selectedAdvisorRow.detailHref)} type="button">
                        Open advisor package detail
                      </button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card data-testid="s036-advisor-queue-empty-context">
                    <CardHeader>
                      <CardTitle>{queueSnapshot.loadState === "loading" ? "Loading advisor packages" : "No selected advisor package"}</CardTitle>
                      <CardDescription>
                        {queueSnapshot.loadState === "loading"
                          ? "Queue rows are loading from the review read model."
                          : "Clear search before opening package detail."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                      <InfoRow label="Queue state" value={queueStatusValue} />
                      <InfoRow label="Next action" value="Open review package" />
                      <InfoRow label="Compliance review" value="Required" />
                    </CardContent>
                  </Card>
                )
              }
              family="queue"
              filterState={searchTerm.length > 0 ? "active_query" : "inactive"}
              master={
                <div
                  className="space-y-3"
                  data-domain10-page-family={routeOwnership?.pageFamily}
                  data-domain10-page-id="036"
                  data-domain10-primary-job="advisor_review_queue_entry"
                  data-domain10-processes={routeOwnership?.processIds.join(" ")}
                  data-testid="s036-advisor-master-list"
                >
                  <FilterBar
                    activeFilterCount={activeAdvisorFilters}
                    activeStateLabel={searchTerm.length > 0 || activeAdvisorFilters > 0 ? "Advisor queue filters applied." : "Advisor queue is current."}
                    filterState={searchTerm.length > 0 && activeAdvisorFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeAdvisorFilters > 0 ? "active_filter" : "inactive"}
                    onQueryChange={(value) => { setSearchTerm(value); setPage(1); }}
                    onReset={() => { setSearchTerm(""); setPriorityFilter("all"); setStatusFilter("all"); setPage(1); }}
                    placeholder="Search queue..."
                    queryValue={searchTerm}
                    searchTestId="ux-interaction-advisor-search"
                  />
                  <div className="grid gap-2 sm:grid-cols-2" data-testid="s036-advisor-real-filters">
                    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                      Priority
                      <select
                        className={queueSelectClass}
                        onChange={(event) => { setPriorityFilter(event.target.value as AdvisorReviewPriorityFilter); setPage(1); }}
                        value={priorityFilter}
                      >
                        <option value="all">All priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                      Status
                      <select
                        className={queueSelectClass}
                        onChange={(event) => { setStatusFilter(event.target.value as AdvisorReviewStatusFilter); setPage(1); }}
                        value={statusFilter}
                      >
                        <option value="all">All statuses</option>
                        <option value="approved">Approved</option>
                        <option value="blocked">Blocked</option>
                        <option value="more_data">More data</option>
                        <option value="pending">Pending review</option>
                        <option value="returned">Returned</option>
                      </select>
                    </label>
                  </div>
                  <DataTable
                    actionPolicy="open_detail"
                    columns={advisorQueueColumns}
                    compact
                    density="compact"
                    emptyMessage="No advisor packages match this search."
                    family="queue"
                    filterState={searchTerm.length > 0 && activeAdvisorFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeAdvisorFilters > 0 ? "active_filter" : "inactive"}
                    getRowId={(row) => row.id}
                    masterDetailMode="inline_detail_rail"
                    mobileCardTitle={(row) => row.client}
                    onRowAction={(row) => router.push(row.detailHref)}
                    onSortChange={handleAdvisorSort}
                    pagination={advisorMeta ? { ...advisorMeta, onPageChange: setPage } : null}
                    responsiveMode="table"
                    rowActionLabel={(row) => `Open advisor detail for ${row.client}`}
                    rows={advisorRows}
                    serverSort
                    sortDirection={sortDirection}
                    sortKey={sortKey}
                  />
                </div>
              }
              masterDetailMode="inline_detail_rail"
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
          { label: "Queue", tone: queueSnapshot.loadState === "error" ? "red" : "gold", value: queueStatusValue },
          { label: "Release", tone: "red", value: "Compliance required" },
        ]}
        title={title}
        worksurfaceId="advisor-review-queue"
      />
    </InternalShell>
  );
}

function AdvisorDecisionRoomPanel({ selectedReview }: { selectedReview: AdvisorReviewQueueRow | null }) {
  const routeOwnership = advisorReviewRouteOwnershipForPageId("037");
  const reviewedEvidence = selectedReview?.evidenceIds.length ? `${selectedReview.evidenceIds.length} evidence record${selectedReview.evidenceIds.length === 1 ? "" : "s"}` : "Evidence pending";
  const recommendationContext = selectedReview?.recommendationSummary
    ? selectedReview.recommendationSummary.split(". Client package")[0]
    : "Select an advisor queue row before saving a decision.";

  return (
    <section
      className="grid gap-2"
      data-domain10-page-family={routeOwnership?.pageFamily}
      data-domain10-page-id="037"
      data-domain10-processes={routeOwnership?.processIds.join(" ")}
      data-testid="bd07-advisor-decision-room-panel"
      data-ux-decision-room="advisor_not_release"
      data-ux-layout-compression="bounded_decision_room"
    >
      <Card className="min-w-0">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{selectedReview?.topic ?? "Selected package"}</CardTitle>
            <InlineStatus tone="gold" value={selectedReview?.status ?? "Ready for review"} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Client", selectedReview?.client ?? "No selected client"],
              ["Package", selectedReview?.type ?? "Not selected"],
              ["Status", selectedReview?.status ?? "Unavailable"],
              ["Due", selectedReview?.due ?? "Not scheduled"],
              ["Review state", selectedReview?.workflow.visibleState ?? "Loading"],
              ["Next step", selectedReview?.workflow.currentActionLabel ?? "Loading"],
            ].map(([label, value]) => (
              <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5">
              <h2 className="text-base font-semibold text-alphavest-ivory">Recommendation context</h2>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted">{recommendationContext}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {[
                  selectedReview?.priority ?? "Priority pending",
                  selectedReview?.topic ?? "Topic pending",
                  selectedReview?.structure ?? "Structure pending",
                  selectedReview?.workflow.visibleState ?? "Review state loading",
                  reviewedEvidence,
                ].map((item) => (
                  <InlineStatus key={item} tone="green" value={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Evidence</p>
              <InlineStatus tone={selectedReview?.evidenceIds.length ? "green" : "gold"} value={reviewedEvidence} />
              <span className="text-sm font-semibold text-alphavest-ivory">Client package</span>
              <InlineStatus tone="red" value="Held" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function AdvisorDetailPage({ title }: { title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const focusId = routeObjectIdFromPathname(pathname, "reviews");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({ focusId: focusId === "current" ? undefined : focusId });
  const selectedReview = advisorDetailFromSnapshot(queueSnapshot.snapshot, pathname);
  const [decisionStatus, setDecisionStatus] = useState<string | null>(null);
  const [advisorRationale, setAdvisorRationale] = useState("");
  const [decisionBusy, setDecisionBusy] = useState(false);
  const rationaleReady = advisorRationale.trim().length >= 12;
  const rationaleMessage = rationaleReady
    ? "Rationale captured for this review."
    : "Enter a short rationale before choosing the next step.";

  useEffect(() => {
    if (queueSnapshot.loadState === "ready" && selectedReview && isCurrentAliasRoute(pathname)) {
      router.replace(withCurrentQuery(selectedReview.detailHref));
    }
  }, [pathname, queueSnapshot.loadState, router, selectedReview]);

  async function runAdvisorDecision(action: "advisor_approve" | "advisor_request_evidence" | "advisor_return_to_analyst") {
    if (!selectedReview) {
      setDecisionStatus("Advisor review state is still loading. Try again once the package is visible.");
      return;
    }

    if (!rationaleReady || decisionBusy) {
      setDecisionStatus("Add a rationale before saving the advisor decision.");
      return;
    }

    setDecisionBusy(true);
    setDecisionStatus(
      action === "advisor_approve"
        ? "Submitting the checked package for compliance review..."
        : action === "advisor_request_evidence"
          ? "Saving evidence request..."
          : "Returning the package to analyst review...",
    );

    try {
      await runAdvisorApprovalWorkflowAction({
        action,
        actorRole: "senior_wealth_advisor",
        reason: advisorRationale.trim(),
        targetId: selectedReview.recommendationId,
      });
      setDecisionStatus(
        action === "advisor_approve"
          ? "Package submitted for compliance review. Client delivery and export were not created."
          : action === "advisor_request_evidence"
            ? "Evidence request saved. The package remains internal."
            : "Package returned to analyst review. No client or export state changed.",
      );
    } catch (error: unknown) {
      setDecisionStatus(error instanceof Error ? error.message : "Advisor decision failed.");
    } finally {
      setDecisionBusy(false);
    }
  }

  async function approveRecommendation() {
    await runAdvisorDecision("advisor_approve");
  }

  async function escalateToCall() {
    if (!selectedReview) {
      setDecisionStatus("Open a review package before escalating the advisor call.");
      return;
    }

    setDecisionStatus("Saving advisor escalation...");
    await runAdvisorReviewCommand("j01.escalateAdvisor", {
      targetId: selectedReview.recommendationId,
      targetType: "RECOMMENDATION",
    });
    router.push("/decisions");
  }

  return (
    <InternalShell activePageId="037">
      <WorksurfaceShell
        density="compact"
        description="Record advisor rationale and save the next step."
        eyebrow="Advisor review"
        primary={
          <div className="space-y-3">
            <PageHeading
              subtitle={selectedReview ? `${selectedReview.client} - ${selectedReview.due}` : "Loading package"}
              title={title}
            />
            <AdvisorDecisionRoomPanel selectedReview={selectedReview} />
          </div>
        }
        rail={
          <aside className="space-y-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle>Next action</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5">
                  <InfoRow label="Package" value={selectedReview?.topic ?? "Loading"} />
                  <InfoRow label="State" value={selectedReview?.workflow.visibleState ?? "Loading"} />
                </div>
                <label className="grid gap-1.5 text-sm font-semibold text-alphavest-ivory" htmlFor="advisor-rationale">
                  Advisor rationale
                  <textarea
                    aria-describedby="advisor-rationale-feedback"
                    className="min-h-20 resize-none rounded-md border border-alphavest-border bg-alphavest-navy/45 px-3 py-2 text-sm font-normal leading-5 text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                    data-testid="advisor-rationale-input"
                    id="advisor-rationale"
                    onChange={(event) => setAdvisorRationale(event.target.value)}
                    placeholder="Summarise the evidence reviewed and the reason for the next step."
                    value={advisorRationale}
                  />
                </label>
                <FieldFeedback
                  actionMeaning="approve"
                  id="advisor-rationale-feedback"
                  intent={rationaleReady ? "validation" : "blocked"}
                  message={rationaleMessage}
                  subject="advisor_approval"
                  visible
                />
                <button
                  className={primaryButtonClass + " w-full"}
                  disabled={!selectedReview || !rationaleReady || decisionBusy}
                  data-testid="j01-approve-advisor"
                  onClick={() => {
                    void approveRecommendation().catch((error: unknown) => {
                      setDecisionStatus(error instanceof Error ? error.message : "Approval action failed.");
                    });
                  }}
                  type="button"
                >
                  <Check aria-hidden="true" className="size-4" />Approve for compliance review
                </button>
                <div className="grid gap-2">
                  <button
                    className={secondaryButtonClass + " w-full"}
                    data-testid="j01-return-to-analyst"
                    disabled={!selectedReview || !rationaleReady || decisionBusy}
                    onClick={() => {
                      void runAdvisorDecision("advisor_return_to_analyst");
                    }}
                    type="button"
                  >
                    Return to analyst
                  </button>
                  <button
                    className={secondaryButtonClass + " w-full"}
                    data-testid="j01-request-evidence"
                    disabled={!selectedReview || !rationaleReady || decisionBusy}
                    onClick={() => {
                      void runAdvisorDecision("advisor_request_evidence");
                    }}
                    type="button"
                  >
                    Request evidence follow-up
                  </button>
                </div>
                <button
                  className="inline-flex h-[var(--button-height)] w-full items-center justify-center gap-2 rounded-md border border-alphavest-red/55 bg-alphavest-red/10 px-4 text-sm font-semibold text-alphavest-red"
                  data-testid="j01-escalate-advisor"
                  disabled={!selectedReview || decisionBusy}
                  onClick={() => {
                    void escalateToCall().catch((error: unknown) => {
                      setDecisionStatus(error instanceof Error ? error.message : "Escalation action failed.");
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
        safetyNote="Advisor approval routes to compliance only."
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
  const [page, setPage] = useState(1);
  const [publishFilter, setPublishFilter] = useState<ComplianceReviewPublishFilter>("all");
  const [riskFilter, setRiskFilter] = useState<ComplianceReviewRiskFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [sortKey, setSortKey] = useState<ComplianceReviewSortKey>("displayId");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({
    page,
    pageSize: 6,
    publish: publishFilter,
    q: searchTerm,
    risk: riskFilter,
    sortDirection,
    sortKey,
    surface: "compliance",
  });
  const complianceRows = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.complianceQueue : [];
  const routeOwnership = complianceReviewReleaseRouteOwnershipForPageId("038");
  const proofBoundary = complianceReviewReleaseProofBoundaryForPageId("038");
  const complianceMeta = queueSnapshot.loadState === "ready" ? queueSnapshot.snapshot.complianceQueueMeta as ReviewQueueMeta : null;
  const activeComplianceFilters = [publishFilter !== "all", riskFilter !== "all"].filter(Boolean).length;
  const selectedReview = complianceRows[0];
  function handleComplianceSort(nextKey: string) {
    setPage(1);
    if (sortKey === nextKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey as ComplianceReviewSortKey);
      setSortDirection("asc");
    }
  }
  const complianceQueueColumns: Array<DataTableColumn<ComplianceReleaseQueueRow>> = [
    { key: "displayId", header: "Review", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.displayId}</span>, sortable: true },
    { key: "item", header: "Item", render: (row) => <span className="line-clamp-2 max-w-[13.5rem] leading-5">{row.item}</span>, sortable: true },
    { key: "classification", header: "Classification", render: (row) => row.classification, sortable: true },
    { key: "risk", header: "Risk", render: (row) => <InlineStatus tone={toneFor(row.risk)} value={row.risk} />, sortable: true },
    { key: "publish", header: "Publish", render: (row) => <InlineStatus tone={toneFor(row.publish)} value={row.publish} />, sortable: true },
  ];
  const queueStatusValue =
    queueSnapshot.loadState === "loading"
        ? "Loading"
        : queueSnapshot.loadState === "error"
          ? "Unavailable"
        : `${complianceMeta?.totalRows ?? complianceRows.length} reviews`;

  return (
    <InternalShell activePageId="038">
      <WorksurfaceShell
        className="min-h-[21.5rem]"
        density="compact"
        description="Open compliance reviews with risk, evidence status and the next review step."
        eyebrow="Compliance release"
        primary={
          <div
            className="space-y-2"
            data-domain11-contract-id={complianceReviewReleaseContractId}
            data-domain11-client-safe-payload={proofBoundary?.clientSafePayload}
            data-domain11-owned-processes={routeOwnership?.processIds.join(",")}
            data-domain11-page-family={routeOwnership?.pageFamily}
            data-domain11-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(",")}
            data-domain11-target-screen="S038"
            data-testid="domain11-s038-area-entry"
          >
            <PageHeading
              subtitle="Review compliance work items and open the selected decision room."
              title={title}
            />
            <MasterDetailSurface
              actionPolicy="route_handoff"
              actionRail="present"
              density="compact_operations"
              detail={
                selectedReview ? (
                  <Card data-testid="s038-compliance-selected-detail" density="compact">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base leading-tight md:text-lg">{selectedReview.item}</CardTitle>
                          <p className="mt-1 text-sm text-alphavest-muted">{selectedReview.sub}</p>
                        </div>
                        <InlineStatus tone={toneFor(selectedReview.risk)} value={selectedReview.risk} />
                      </div>
                    </CardHeader>
                    <CardContent className="mt-3 space-y-3">
                      <div className="grid gap-2 text-sm">
                        <InfoRow label="Classification" value={selectedReview.classification} />
                        <InfoRow label="Responsible advisor" value={selectedReview.advisor} />
                        <InfoRow label="Evidence" value={selectedReview.evidence} />
                        <InfoRow label="Review state" value={selectedReview.workflow.status} />
                        <InfoRow label="Next step" value={selectedReview.workflow.currentActionLabel} />
                        <InfoRow label="Activity" value={`${selectedReview.workflow.commandHistoryCount} entries`} />
                      </div>
                      <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2 text-sm text-alphavest-muted">
                        <p className="font-semibold text-alphavest-ivory">Review selected</p>
                        <p className="mt-1 leading-5">{selectedReview.workflow.visibleState}. Open the selected review; release remains locked.</p>
                      </div>
                      <button className={primaryButtonClass + " w-full"} data-testid="s038-open-selected-review" onClick={() => router.push(selectedReview.decisionRoomHref)} type="button">
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
                <div className="space-y-3" data-testid="s038-compliance-master-list">
                  <FilterBar
                    activeFilterCount={activeComplianceFilters}
                    activeStateLabel={searchTerm.length > 0 || activeComplianceFilters > 0 ? "Compliance queue filters applied." : "Compliance queue is current."}
                    filterState={searchTerm.length > 0 && activeComplianceFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeComplianceFilters > 0 ? "active_filter" : "inactive"}
                    onQueryChange={(value) => { setSearchTerm(value); setPage(1); }}
                    onReset={() => { setSearchTerm(""); setPublishFilter("all"); setRiskFilter("all"); setPage(1); }}
                    placeholder="Search by client, advisor, ID, or keyword..."
                    queryValue={searchTerm}
                    resetLabel="Clear"
                    searchTestId="ux-interaction-compliance-search"
                  />
                  <div className="grid gap-2 sm:grid-cols-2" data-testid="s038-compliance-real-filters">
                    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                      Risk
                      <select
                        className={queueSelectClass}
                        onChange={(event) => { setRiskFilter(event.target.value as ComplianceReviewRiskFilter); setPage(1); }}
                        value={riskFilter}
                      >
                        <option value="all">All risks</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                      Release state
                      <select
                        className={queueSelectClass}
                        onChange={(event) => { setPublishFilter(event.target.value as ComplianceReviewPublishFilter); setPage(1); }}
                        value={publishFilter}
                      >
                        <option value="all">All release states</option>
                        <option value="blocked">Blocked</option>
                        <option value="evidence_needed">Evidence needed</option>
                        <option value="held">Held</option>
                        <option value="not_released">Not released</option>
                        <option value="released">Released</option>
                      </select>
                    </label>
                  </div>
                  <DataTable
                    actionPolicy="open_detail"
                    columns={complianceQueueColumns}
                    compact
                    density="compact"
                    emptyMessage="No compliance reviews match this search."
                    family="queue"
                    filterState={searchTerm.length > 0 && activeComplianceFilters > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeComplianceFilters > 0 ? "active_filter" : "inactive"}
                    getRowId={(row) => row.id}
                    masterDetailMode="inline_detail_rail"
                    mobileCardTitle={(row) => row.id}
                    onRowAction={(row) => router.push(row.decisionRoomHref)}
                    onSortChange={handleComplianceSort}
                    pagination={complianceMeta ? { ...complianceMeta, onPageChange: setPage } : null}
                    responsiveMode="table"
                    rowActionLabel={(row) => `Open decision room for ${row.displayId}`}
                    rows={complianceRows}
                    serverSort
                    sortDirection={sortDirection}
                    sortKey={sortKey}
                  />
                </div>
              }
              masterDetailMode="inline_detail_rail"
              queueWorkbench
              selectedObjectId={selectedReview?.id ?? "no-compliance-row"}
              selectedObjectState={selectedReview?.publish ?? "empty"}
              stickyRail
              targetScreenId="S038"
            />
          </div>
        }
        routeId="038"
        safetyNote="Release, export and client visibility stay locked from the queue."
        statusItems={[
          { label: "Queue", tone: queueSnapshot.loadState === "error" ? "red" : "gold", value: queueStatusValue },
          { label: "Release", tone: "red", value: "Gated" },
        ]}
        title={title}
        worksurfaceId="compliance-release-queue"
      />
    </InternalShell>
  );
}

function ComplianceDecisionRoomPanel({ selectedReview }: { selectedReview: ComplianceReleaseQueueRow | null }) {
  const processContract = processFirstUxContractForPageId("039");
  const routeShellPageJobContract = uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("039"));
  const routeOwnership = complianceReviewReleaseRouteOwnershipForPageId("039");
  const proofBoundary = complianceReviewReleaseProofBoundaryForPageId("039");
  const preconditionAcceptance = complianceReviewReleaseAcceptanceCriteria.find((criterion) => criterion.processId === "BP-059");
  const evidenceAcceptance = complianceReviewReleaseAcceptanceCriteria.find((criterion) => criterion.processId === "BP-060");
  const compactPreconditions = [
    { label: "Advisor review", tone: "green" as BadgeTone, value: selectedReview?.advisor ?? "Ready" },
    { label: "Evidence", tone: selectedReview?.evidence === "Complete" ? "green" as BadgeTone : "red" as BadgeTone, value: selectedReview?.evidence ?? "Needs work" },
    { label: "Permission", tone: "gold" as BadgeTone, value: "Permitted" },
    { label: "Audit record", tone: "gold" as BadgeTone, value: "Required" },
    { label: "Client package", tone: "red" as BadgeTone, value: selectedReview?.publish ?? "Unavailable" },
  ];
  const compactEvidence = [
    { label: "Selected evidence", status: selectedReview?.evidence ?? "Loading" },
    { label: "Release status", status: selectedReview?.publish ?? "Loading" },
    { label: "Risk", status: selectedReview?.risk ?? "Loading" },
    { label: "Client package", status: "Held" },
  ];
  const compactPolicy = [
    { label: "Classification", result: selectedReview?.classification ?? "Review" },
    { label: "Responsible", result: selectedReview?.advisor ?? "Review" },
    { label: "Release", result: selectedReview?.publish ?? "Needs work" },
    { label: "Selection", result: selectedReview ? "Selected" : "Loading" },
  ];
  const compactAudit = [
    selectedReview?.displayId ?? "Review loading",
    selectedReview?.sub ?? "Client loading",
    selectedReview?.due ?? "Due date loading",
  ];

  return (
    <section
      className="space-y-3"
      data-testid="bd08-compliance-decision-room-panel"
      data-domain11-client-safe-payload={proofBoundary?.clientSafePayload}
      data-domain11-contract={complianceReviewReleaseContractId}
      data-domain11-page-family={routeOwnership?.pageFamily}
      data-domain11-processes={routeOwnership?.processIds.join(" ")}
      data-domain11-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(" ")}
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
            <CardTitle>{selectedReview?.item ?? "Compliance package"}</CardTitle>
            <InlineStatus tone={toneFor(selectedReview?.publish ?? "Review")} value={selectedReview?.publish ?? "Loading"} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Package", selectedReview?.displayId ?? "Loading"],
              ["Client", selectedReview?.sub ?? "Loading"],
              ["Due", selectedReview?.due ?? "Not scheduled"],
              ["Status", selectedReview?.publish ?? "Review"],
              ["Review state", selectedReview?.workflow.status ?? "Loading"],
              ["Next step", selectedReview?.workflow.currentActionLabel ?? "Loading"],
            ].map(([label, value]) => (
              <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
          <div
            className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3"
            data-domain11-precondition-negative={preconditionAcceptance?.negative}
            data-domain11-evidence-negative={evidenceAcceptance?.negative}
            data-testid="workflow06-compliance-precondition-checklist"
            data-workflow06-release-ready="false"
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Release checks</p>
              {compactPreconditions.map((item) => (
                <InlineStatus key={item.label} tone={item.tone} value={`${item.label}: ${item.value}`} />
              ))}
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Evidence</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {compactEvidence.map((item) => (
                  <InlineStatus key={item.label} tone={toneFor(item.status)} value={`${item.label}: ${item.status}`} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-5 text-alphavest-muted">{selectedReview?.evidence === "Complete" ? "Evidence is complete, but release still requires explicit compliance action." : "Evidence is incomplete or missing; request evidence or keep release held."}</p>
            </div>
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Policy</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {compactPolicy.map((item) => (
                  <InlineStatus key={item.label} tone={toneFor(item.result)} value={`${item.label}: ${item.result}`} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-5 text-alphavest-muted">Request missing evidence or keep the review held until the checklist is ready.</p>
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
  const router = useRouter();
  const pathname = usePathname();
  const focusId = routeObjectIdFromPathname(pathname, "reviews");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({ focusId: focusId === "current" ? undefined : focusId });
  const selectedReview = complianceDetailFromSnapshot(queueSnapshot.snapshot, pathname);
  const [confirmationAction, setConfirmationAction] = useState<SensitiveWorkflowAction | null>(null);
  const releaseBlocker = selectedReview?.publish === "Released" ? "Release is already recorded." : selectedReview?.publish === "Held" ? "Compliance review is still held." : "Evidence and policy checks are incomplete.";
  const selectedWorkflow = complianceWorkflowSelectionForRow(selectedReview);

  useEffect(() => {
    if (queueSnapshot.loadState === "ready" && selectedReview && isCurrentAliasRoute(pathname)) {
      router.replace(withCurrentQuery(complianceRouteForRow(selectedReview, pathname)));
    }
  }, [pathname, queueSnapshot.loadState, router, selectedReview]);

  return (
    <InternalShell activePageId="039">
      <WorksurfaceShell
        density="compact"
        description="Evidence, policy status and audit readiness for the selected package."
        eyebrow="Compliance release"
        primary={
          <div
            className="space-y-4"
            data-testid="s039-domain05-primitive-consumer"
            data-ux-domain05-target-screen="S039"
            {...uxStatusCommandAttributesFor({
              actionMeaning: "release",
              componentState: "blocked",
              primitiveFamily: "blocker",
              reason: releaseBlocker,
              recoveryAction: "review_policy",
            })}
          >
            <PageHeading
              subtitle={selectedReview ? `${selectedReview.sub} - ${selectedReview.displayId}` : "Loading compliance package"}
              title={title}
            />
            <ComplianceDecisionRoomPanel selectedReview={selectedReview} />
          </div>
        }
        rail={
          <aside className="space-y-3">
            <Card>
              <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-navy/35 p-3">
                  <InlineStatus tone={selectedReview?.risk === "High" ? "red" : "gold"} value={selectedReview?.publish ?? "Review required"} />
                  <p className="mt-2 text-sm leading-5 text-alphavest-muted">
                    {selectedReview ? `${selectedReview.sub} package is held.` : "Loading package state."}
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
                    testId="workflow06-release-blocked-control"
                    title="Release unavailable"
                    visibleDisabledReason
                  >
                    <LockKeyhole aria-hidden="true" className="size-4" />Release unavailable
                  </ActionButton>
                  <ActionButton
                    availability={selectedReview ? undefined : "disabled"}
                    className="w-full"
                    disabled={!selectedReview}
                    disabledReason={selectedReview ? undefined : "Select a real compliance review before requesting evidence."}
                    meaning="request_evidence"
                    onClick={() => {
                      if (selectedReview) setConfirmationAction("request_evidence");
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
                    availability={selectedReview ? undefined : "disabled"}
                    className="w-full"
                    disabled={!selectedReview}
                    disabledReason={selectedReview ? undefined : "Select a real compliance review before holding release."}
                    meaning="block"
                    onClick={() => {
                      if (selectedReview) setConfirmationAction("compliance_block");
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
        safetyNote="Release remains unavailable until checks pass."
        statusItems={[
          { label: "Review", tone: selectedReview?.risk === "High" ? "red" : "gold", value: selectedReview?.publish ?? "Loading" },
          { label: "Evidence", tone: selectedReview?.evidence === "Complete" ? "green" : "gold", value: selectedReview?.evidence ?? "Loading" },
          { label: "Review state", tone: selectedReview ? "gold" : "red", value: selectedReview?.workflow.status ?? "Loading" },
        ]}
        title={title}
        worksurfaceId="compliance-release-decision-room"
      />
      <SensitiveWorkflowConfirmationModal
        action={confirmationAction}
        onClose={() => setConfirmationAction(null)}
        open={confirmationAction !== null}
        selection={selectedWorkflow}
      />
    </InternalShell>
  );
}

function ReleasePage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const router = useRouter();
  const pathname = usePathname();
  const focusId = routeObjectIdFromPathname(pathname, "reviews");
  const queueSnapshot = useRecommendationReviewQueueSnapshot({ focusId: focusId === "current" ? undefined : focusId });
  const selectedReview = complianceDetailFromSnapshot(queueSnapshot.snapshot, pathname);
  const [modalOpen, setModalOpen] = useState(visualState === "release");
  const routeOwnership = complianceReviewReleaseRouteOwnershipForPageId("040");
  const proofBoundary = complianceReviewReleaseProofBoundaryForPageId("040");
  const selectedWorkflow = complianceWorkflowSelectionForRow(selectedReview);
  const releaseTitle = selectedReview?.item ?? "Selected release review";
  const releaseEvidenceFacts = [
    { label: "Review", value: selectedReview?.displayId ?? "Loading review" },
    { label: "Evidence", value: selectedReview?.evidence ?? "Loading evidence" },
    { label: "Release", value: selectedReview?.publish ?? "Loading release state" },
  ];
  const releaseFacts = [
    { label: "Review", value: selectedReview?.displayId ?? "Loading review" },
    { label: "Client", value: selectedReview?.sub ?? "Loading client" },
    { label: "Package", value: selectedReview?.item ?? "Loading package" },
    { label: "Advisor", value: selectedReview?.advisor ?? "Loading advisor" },
  ];

  useEffect(() => {
    if (queueSnapshot.loadState === "ready" && selectedReview && isCurrentAliasRoute(pathname)) {
      router.replace(withCurrentQuery(complianceRouteForRow(selectedReview, pathname)));
    }
  }, [pathname, queueSnapshot.loadState, router, selectedReview]);

  return (
    <InternalShell activePageId="040">
      <WorksurfaceShell
        density="compact"
        description="Release review package, preview candidate and confirmation action."
        eyebrow="Compliance release"
        primary={
          <section
            className={cn("space-y-3", modalOpen ? "opacity-45" : "")}
            data-domain11-client-safe-payload={proofBoundary?.clientSafePayload}
            data-domain11-contract={complianceReviewReleaseContractId}
            data-domain11-page-family={routeOwnership?.pageFamily}
            data-domain11-processes={routeOwnership?.processIds.join(" ")}
            data-domain11-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(" ")}
            data-testid="domain11-s040-release-boundary"
          >
            <PageHeading
              subtitle="Review the approved package, client-safe preview and audit readiness before release."
              title={title}
            />
            <div className="grid gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{releaseTitle}</CardTitle>
                      <CardDescription>Release confirmation detail</CardDescription>
                    </div>
                    <InlineStatus tone={selectedReview?.publish === "Released" ? "green" : "gold"} value={selectedReview?.publish ?? "Loading"} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 md:grid-cols-4">
                    {releaseFacts.map((fact) => (
                      <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3" key={fact.label}>
                        <p className="text-sm font-semibold text-alphavest-ivory">{fact.label}</p>
                        <p className="mt-1 text-sm leading-5 text-alphavest-muted">{fact.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    {releaseEvidenceFacts.map((item) => (
                      <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3" key={item.label}>
                        <p className="text-sm font-semibold text-alphavest-ivory">{item.label}</p>
                        <p className="mt-1 text-sm text-alphavest-muted">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle>Review progress</CardTitle></CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {releaseChecklist.map((item) => (
                    <p className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}>
                      <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-alphavest-green" />
                      {item}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Review", selectedReview?.publish ?? "Loading"],
                ["Preview", selectedReview ? "Client-safe candidate pending release" : "Loading review"],
                ["Audit", "Release write pending"],
              ].map(([label, value]) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-panel/55 p-3" key={label}>
                  <p className="text-sm font-semibold text-alphavest-ivory">{label}</p>
                  <p className="mt-1 text-sm leading-5 text-alphavest-muted">{value}</p>
                </div>
              ))}
            </div>
          </section>
        }
        rail={
          <aside className={cn("space-y-3", modalOpen ? "opacity-45" : "")}>
            <Card>
              <CardHeader className="pb-3"><CardTitle>Release action</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <StatePanel
                  detail={selectedReview ? `${selectedReview.sub} still requires explicit confirmation before release.` : "Review state is loading before release can be confirmed."}
                  state="restricted"
                  title="Confirmation required"
                />
                <StickyActionZone testId="s040-release-action-zone">
                  <ActionButton
                    availability={selectedReview ? undefined : "disabled"}
                    className="w-full"
                    disabled={!selectedReview}
                    disabledReason={selectedReview ? undefined : "Select a real compliance review before release confirmation."}
                    meaning="release"
                    onClick={() => {
                      if (selectedReview) setModalOpen(true);
                    }}
                    placement="sticky_rail"
                    priority="primary"
                    requiresAudit
                    requiresConfirmation
                    testId="s040-open-release-review"
                  >
                    <LockKeyhole aria-hidden="true" className="size-4" />Review release
                  </ActionButton>
                </StickyActionZone>
              </CardContent>
            </Card>
          </aside>
        }
        routeId="040"
        safetyNote="Export, download, share and client response stay separate."
        statusItems={[
          { label: "Review", tone: "green", value: "Approved" },
          { label: "Release", tone: selectedReview?.publish === "Released" ? "green" : "gold", value: selectedReview?.publish ?? "Loading" },
        ]}
        title={title}
        worksurfaceId="compliance-release-confirmation"
      />
      <ReleaseModal onClose={() => setModalOpen(false)} open={modalOpen} selection={selectedWorkflow} />
    </InternalShell>
  );
}

function ReleaseModal({ onClose, open, selection }: { onClose: () => void; open: boolean; selection: ComplianceWorkflowSelection }) {
  const proofBoundary = complianceReviewReleaseProofBoundaryForPageId("040");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const releasePhrase = workflow05ComplianceReleaseConfirmationPhrase;
  const releaseValid = acknowledged && confirmationText.trim() === releasePhrase;
  const submitDisabled = !releaseValid || status === "submitting" || status === "success";
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = releaseValid
    ? "valid-confirmation"
    : !acknowledged
      ? "blocked-acknowledgement-required"
      : "blocked-exact-phrase-required";
  const validationMessage = releaseValid
    ? "Confirmation is valid. Submit can release this package."
    : !acknowledged
      ? "Release is blocked until the compliance acknowledgement is checked and the exact phrase is entered."
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
    setMessage("Submitting release. Close and cancel are disabled until it finishes.");

    try {
      const body = await runAdvisorApprovalWorkflowAction({
        action: "compliance_release",
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: selection.evidenceIds,
        reason:
          `Compliance reviewed ${selection.reviewLabel} after advisor approval, evidence and permission gates passed.`,
        targetId: selection.targetId,
      });

      setStatus("success");
      setMessage(uxFeedbackSuccessMessageForSubject("compliance_release", { auditEventId: body.result?.auditEventId }));
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} Release was not completed. No release mutation or client visibility change was completed.`
          : "Release was not completed. No release mutation or client visibility change was completed.",
      );
    }
  }

  return (
    <Modal
      className="max-w-[58rem]"
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
            <LockKeyhole aria-hidden="true" className="size-4" />{status === "submitting" ? "Submitting..." : "Release review"}
          </button>
        </>
      }
      onClose={status === "submitting" ? undefined : resetAndClose}
      open={open}
      title="Release client-safe review"
    >
      <div
        className="grid gap-4 xl:grid-cols-2"
        data-domain11-client-safe-payload={proofBoundary?.clientSafePayload}
        data-domain11-contract={complianceReviewReleaseContractId}
        data-domain11-proof-blocked-overclaims={proofBoundary?.blockedOverclaims.join(" ")}
        data-testid="uxp3-compliance-release-lifecycle"
        data-ux-selected-evidence-ids={selection.evidenceIds.join(" ")}
        data-ux-selected-review-id={selection.reviewId}
        data-ux-selected-target-id={selection.targetId}
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
            <StatePanel detail="Checklist is ready. Release remains pending." state="success" title="Release action pending" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Client-visible preview</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <div className="space-y-3">
                <div>
                  <p className="break-words font-display text-2xl leading-tight text-alphavest-ivory">{selection.packageLabel}</p>
                  <p className="mt-1 break-words text-sm text-alphavest-muted">{selection.clientLabel}</p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    ["Review", selection.reviewLabel],
                    ["Advisor", selection.advisorLabel],
                    ["Evidence", selection.evidenceLabel],
                    ["Release", selection.releaseStatus],
                    ["Evidence records", String(selection.evidenceIds.length)],
                  ].map(([label, value]) => (
                    <div className="rounded-md border border-alphavest-border/45 bg-alphavest-charcoal/35 p-2" key={label}>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold leading-5 text-alphavest-ivory">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <StatePanel className="mt-4" detail="Preview content is ready for final release confirmation." state="restricted" title="Client preview candidate" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Evidence & audit</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Review", selection.reviewLabel],
              ["Selected evidence", selection.evidenceLabel],
              ["Evidence records", selection.evidenceIds.length > 0 ? selection.evidenceIds.length.toString() : "None linked"],
              ["Release", selection.releaseStatus],
            ].map(([label, value]) => (
              <div className="rounded-md border border-alphavest-border/45 bg-alphavest-charcoal/35 p-2" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Confirm release</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-alphavest-muted">Confirm that all information is accurate and compliant.</p>
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
                detail={message ?? "Submitting release."}
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
                detail={message ?? "Release was not completed."}
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
          ? "Release completed for this package. Export, share and client response remain separate."
          : "Release has not been submitted."}
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
