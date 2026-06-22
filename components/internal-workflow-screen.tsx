"use client";

import { useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  Filter,
  Flag,
  Home,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UsersRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlobalSearchBox } from "@/components/global-search-box";
import {
  AuditTimeline,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Modal,
  StatePanel,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { DemoActorHandoffBar } from "@/components/demo-actor-handoff-bar";
import { ProductGuidanceContent } from "@/components/product-guidance-panel";
import { RouteContextChip } from "@/components/route-context-chip";
import { ScfP04P06FlowPanel } from "@/components/scf-p04-p06-flow-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { UxComplexityPriorityPanel } from "@/components/ux-complexity-priority-panel";
import { cn } from "@/lib/cn";
import {
  recommendationReviewDemoTargets,
  runRecommendationReviewWorkflowAction,
} from "@/lib/screencast-demo-client";
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
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";

type InternalWorkflowScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  pageIds?: string[];
  count?: number;
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
    description: "Block client visibility for this recommendation and record a compliance audit event.",
    evidenceIds: [recommendationReviewDemoTargets.morgan.evidenceId],
    phrase: "BLOCK RELEASE",
    submitLabel: "Block Release",
    targetId: recommendationReviewDemoTargets.morgan.recommendationId,
    title: "Confirm Compliance Block",
  },
  request_evidence: {
    action: "request_evidence",
    defaultReason: "Compliance requested missing evidence before client release.",
    description: "Request missing evidence while keeping the recommendation blocked from client visibility.",
    evidenceIds: [recommendationReviewDemoTargets.morgan.evidenceId],
    phrase: "REQUEST EVIDENCE",
    submitLabel: "Request Evidence",
    targetId: recommendationReviewDemoTargets.morgan.recommendationId,
    title: "Confirm Evidence Request",
  },
};

type DemoWorkflowActionId =
  | "j01.requestData"
  | "j01.routeToAdvisor"
  | "j01.approveAdvisor"
  | "j01.escalateAdvisor";

async function postDemoWorkflowAction(actionId: DemoWorkflowActionId) {
  const response = await fetch("/api/demo-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionId }),
  });

  if (!response.ok) {
    const fallback = `Demo workflow action failed with HTTP ${response.status}.`;
    const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
    throw new Error(body?.error ?? fallback);
  }

  return response.json() as Promise<{ result: { message: string }; noClientRelease: boolean }>;
}

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
      const body = await runRecommendationReviewWorkflowAction({
        action: activeConfig.action,
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: activeConfig.evidenceIds,
        reason: reason.trim(),
        targetId: activeConfig.targetId,
      });

      setStatus("success");
      setMessage(body.result?.auditEventId ? `Audit recorded: ${body.result.auditEventId}` : "Action persisted.");
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
            data-testid={`typed-${config.action}-submit`}
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
      <div className="space-y-4">
        <StatePanel
          detail="Cancel closes this dialog without calling the workflow API. Invalid input keeps submit disabled."
          state="restricted"
          title="Sensitive confirmation required"
        />
        <label className="flex items-start gap-3 text-sm text-alphavest-muted">
          <input
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
            className={inputClass}
            data-testid={`typed-${config.action}-confirmation`}
            disabled={status === "submitting" || status === "success"}
            onChange={(event) => setConfirmationText(event.target.value)}
            value={confirmationText}
          />
        </label>
        {status === "success" ? (
          <StatePanel detail={message ?? "Action persisted."} state="success" title="Action persisted" />
        ) : null}
        {status === "error" ? (
          <StatePanel detail={message ?? "No mutation was completed."} state="blocked" title="Action failed" />
        ) : null}
      </div>
    </Modal>
  );
}

const internalNav: NavItem[] = [
  { href: "/portal", icon: Home, label: "Home" },
  { href: "/client/family-members", icon: UsersRound, label: "Clients" },
  { href: "/entities", icon: BriefcaseBusiness, label: "Entities" },
  { href: "/signals", icon: ShieldAlert, label: "Signals", pageIds: ["033"] },
  { href: "/workbench", icon: LayoutDashboard, label: "Consultant Workbench", pageIds: ["034"] },
  { href: "/workbench/triggers/demo", icon: Flag, label: "Triggers", pageIds: ["035"], count: 12 },
  { href: "/actions", icon: ClipboardCheck, label: "Actions" },
  { href: "/advisor-approval", icon: CheckCircle2, label: "Approvals", pageIds: ["036", "037"], count: 36 },
  { href: "/compliance", icon: ShieldCheck, label: "Compliance", pageIds: ["038", "039", "040"] },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/reports", icon: SlidersHorizontal, label: "Reports" }
];

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

function AlphaVestMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded text-2xl font-semibold text-alphavest-gold">A</div>
      <div>
        <p className="font-display text-2xl leading-none text-alphavest-ivory">AlphaVest</p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-alphavest-gold">WealthOS</p>
      </div>
    </div>
  );
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

function InternalSidebar({ activePageId }: { activePageId: string }) {
  return (
    <aside className="hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/88 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
      <AlphaVestMark />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {internalNav.map((item) => {
          const Icon = item.icon;
          const active = item.pageIds?.includes(activePageId);

          return (
            <a
              className={cn(
                "flex h-10 items-center gap-3 rounded-md border px-3 text-sm transition",
                active
                  ? "border-alphavest-gold/45 bg-alphavest-gold/12 text-alphavest-gold-soft"
                  : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel/65 hover:text-alphavest-ivory"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.count ? <span className="rounded-full bg-alphavest-gold px-2 text-xs font-semibold text-alphavest-navy">{item.count}</span> : null}
            </a>
          );
        })}
      </nav>
      <div className="rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
          <LockKeyhole aria-hidden="true" className="size-4" />
          Internal Only
        </div>
        <p className="mt-2 text-xs leading-5 text-alphavest-muted">Authorized AlphaVest users only. Nothing is client-released until compliance gates pass.</p>
      </div>
    </aside>
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
          <button className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" type="button">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">7</span>
          </button>
          <div className="flex h-10 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 pl-1 pr-3">
            <span className="grid size-8 place-items-center rounded-full border border-alphavest-gold/45 text-xs font-semibold text-alphavest-gold">{session.actor.initials}</span>
            <span className="hidden text-sm font-semibold text-alphavest-ivory md:block">{session.actor.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function InternalShell({ activePageId, children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid">
        <InternalSidebar activePageId={activePageId} />
        <div className="min-w-0">
          <InternalTopBar />
          <DemoActorHandoffBar />
          <main className="px-4 py-6 md:px-6">
            <ProductGuidanceContent>{children}</ProductGuidanceContent>
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

function SignalsPage({ title }: { title: string }) {
  const router = useRouter();
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  async function handleRoutingAction(optionTitle: string) {
    if (optionTitle === "Request Data / Information") {
      setActionStatus("Saving request-data state...");
      await postDemoWorkflowAction("j01.requestData");
      router.push("/workbench");
      return;
    }

    if (optionTitle === "Assign to Advisor") {
      setActionStatus("Routing package to advisor...");
      await postDemoWorkflowAction("j01.routeToAdvisor");
      router.push("/advisor-approval");
      return;
    }

    setActionStatus(`${optionTitle} is not part of this screencast path.`);
  }

  return (
    <InternalShell activePageId="033">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[20rem_1fr_24rem]">
        <aside className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Signal Queue</CardTitle>
              <button className="text-alphavest-muted" type="button"><Filter aria-hidden="true" className="size-4" /></button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 text-sm">
                {["All 28", "High 5", "Med 14", "Low 9"].map((tab, index) => (
                  <Badge key={tab} tone={index === 0 ? "gold" : "muted"}>{tab}</Badge>
                ))}
              </div>
              {signalQueue.map((item, index) => (
                <article className={cn("rounded-md border p-4", index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={toneFor(item.severity)}>{item.severity} confidence</Badge>
                    <span className={cn("size-2 rounded-full", item.severity === "High" ? "bg-alphavest-red" : item.severity === "Medium" ? "bg-alphavest-gold" : "bg-alphavest-blue")} />
                  </div>
                  <p className="mt-3 font-semibold text-alphavest-ivory">{item.title}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">{item.client}</p>
                  <p className="mt-2 text-xs text-alphavest-subtle">{item.age} - {item.source}</p>
                </article>
              ))}
              <button className={secondaryButtonClass + " w-full"} type="button">Load more</button>
            </CardContent>
          </Card>
        </aside>
        <section className="min-w-0 space-y-5">
          <PageHeading
            badge={<Star aria-hidden="true" className="size-5 text-alphavest-gold" />}
            subtitle="Triggers are review points, not advice. Analyst judgment and firm policies apply."
            title={title}
          />
          <ScfP04P06FlowPanel mode="advisory" />
          <StatePanel detail="Low confidence due to incomplete beneficial owner and purpose-of-wire data. Request additional information before routing." state="restricted" title="Low confidence due to incomplete data" />
          <UxComplexityPriorityPanel
            actionLabel="Request data before routing"
            actionState="The selected signal cannot become advice until missing elements are reviewed and routed through advisor/compliance gates."
            priorityItems={[
              { detail: selectedSignal.client, label: selectedSignal.id, value: selectedSignal.severity },
              { detail: selectedSignal.missingElements.join(", "), label: "Missing elements", value: selectedSignal.dataCompleteness },
              { detail: selectedSignal.source, label: "Source quality", value: selectedSignal.confidence },
            ]}
            safetyNote="Signal priority does not prove recommendation quality or client visibility."
            summaryItems={[
              { detail: "High-priority signal queue", label: "High", value: "5" },
              { detail: "Selected signal status", label: "Status", value: selectedSignal.status },
              { detail: "Advice boundary", label: "Client visible", value: "No" },
            ]}
            title="Signal triage hierarchy"
          />
          <div className="grid gap-3 md:grid-cols-5">
            {[
              ["Signal ID", selectedSignal.id],
              ["Source", selectedSignal.source],
              ["Severity", selectedSignal.severity],
              ["Confidence", selectedSignal.confidence],
              ["Status", selectedSignal.status]
            ].map(([label, value]) => (
              <Card key={label}>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="grid gap-5 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Data completeness</p>
                <p className="mt-2 text-3xl font-semibold text-alphavest-gold">{selectedSignal.dataCompleteness}</p>
                <ProgressBar value={62} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Missing elements</p>
                <div className="mt-2 space-y-1 text-sm text-alphavest-muted">
                  {selectedSignal.missingElements.map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Related client</p>
                <p className="mt-2 font-semibold text-alphavest-ivory">{selectedSignal.client}</p>
                <p className="text-sm text-alphavest-muted">Primary contact: James Beacon</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Account</p>
                <p className="mt-2 font-semibold text-alphavest-ivory">{selectedSignal.account}</p>
                <p className="text-sm text-alphavest-muted">A-778-001</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Trigger Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-alphavest-muted">{selectedSignal.summary}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Amount", selectedSignal.amount],
                  ["Transaction Type", selectedSignal.transactionType],
                  ["Counterparty", selectedSignal.counterparty],
                  ["Threshold", selectedSignal.threshold],
                  ["Lookback Window", selectedSignal.lookbackWindow],
                  ["Historical Frequency", selectedSignal.historicalFrequency]
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-2 text-sm" key={label}>
                    <span className="text-alphavest-muted">{label}</span>
                    <span className="text-right font-semibold text-alphavest-ivory">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>AI Draft</CardTitle><Badge tone="red">Low confidence</Badge></CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-alphavest-muted">{selectedSignal.aiDraft}</p>
              <p className="mt-4 text-xs italic text-alphavest-subtle">AI output may be inaccurate or incomplete. Validate before taking action.</p>
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Routing & Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {signalRoutingOptions.map((option) => (
                <button
                  aria-label={option.title}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-left transition hover:border-alphavest-gold/60"
                  data-testid={option.title === "Request Data / Information" ? "j01-request-data" : undefined}
                  key={option.title}
                  onClick={() => {
                    void handleRoutingAction(option.title).catch((error: unknown) => {
                      setActionStatus(error instanceof Error ? error.message : "Demo workflow action failed.");
                    });
                  }}
                  type="button"
                >
                  <span>
                    <span className="block font-semibold text-alphavest-ivory">{option.title}</span>
                    <span className="mt-1 block text-sm text-alphavest-muted">{option.detail}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 text-alphavest-gold" />
                </button>
              ))}
              {actionStatus ? (
                <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
                  {actionStatus}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <div className="min-h-40 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm text-alphavest-muted">Add notes visible to internal users only...</div>
              <button className={primaryButtonClass + " mt-4 w-full"} type="button">Take Action</button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </InternalShell>
  );
}

function WorkbenchPage({ title }: { title: string }) {
  return (
    <InternalShell activePageId="034">
      <ScreenTitle>{title}</ScreenTitle>
      <UxHubPage pageId="034" />
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
    await postDemoWorkflowAction("j01.routeToAdvisor");
    router.push("/advisor-approval");
  }

  return (
    <InternalShell activePageId="035">
      <ScreenTitle>{title}</ScreenTitle>
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
                <button className={secondaryButtonClass} type="button">Back to Triggers</button>
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
  { key: "client", header: "Client / Structure", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}<span className="block text-xs text-alphavest-muted">{row.structure}</span></span> },
  { key: "type", header: "Type", render: (row) => <span>{row.type}<span className="block text-xs">{row.topic}</span></span> },
  { key: "priority", header: "Priority", render: (row) => <Badge tone={toneFor(row.priority)}>{row.priority}</Badge> },
  { key: "submitted", header: "Submitted", render: (row) => row.submitted },
  { key: "due", header: "Due", render: (row) => <span className={row.status === "Overdue" ? "text-alphavest-red" : ""}>{row.due}</span> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
];

function AdvisorQueuePage({ title }: { title: string }) {
  return (
    <InternalShell activePageId="036">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[1fr_28rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading
            action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button"><Download aria-hidden="true" className="size-4" />Export</button><button className={primaryButtonClass} type="button">Bulk Actions</button></div>}
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
              <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search queue..." />
            </label>
            {["Type", "Priority", "Risk Level", "Assigned To"].map((filter) => <FilterButton key={filter} label={filter} />)}
            <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
          </div>
          <DataTable columns={advisorColumns} getRowId={(row) => row.client} rows={advisorQueue} />
        </section>
        <AdvisorSummaryPanel />
      </div>
    </InternalShell>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="flex h-11 items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" type="button">
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
          <button className={secondaryButtonClass} type="button">Request Info</button>
          <button className={secondaryButtonClass} type="button">Send Back</button>
          <button className={primaryButtonClass} type="button">Approve</button>
        </div>
      </div>
    </aside>
  );
}

function AdvisorDetailPage({ title }: { title: string }) {
  const router = useRouter();
  const [decisionStatus, setDecisionStatus] = useState<string | null>(null);

  async function approveRecommendation() {
    setDecisionStatus("Saving advisor approval...");
    await runRecommendationReviewWorkflowAction({
      action: "advisor_approve",
      actorRole: "senior_wealth_advisor",
      reason: "Advisor approved the package; compliance release remains required.",
      targetId: recommendationReviewDemoTargets.northbridge.recommendationId,
    });
    setDecisionStatus("Advisor approval saved. Compliance release is still required.");
  }

  async function escalateToCall() {
    setDecisionStatus("Saving advisor escalation...");
    await postDemoWorkflowAction("j01.escalateAdvisor");
    router.push("/decisions");
  }

  return (
    <InternalShell activePageId="037">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[112rem] gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading
            badge={<Badge tone="gold">{selectedApproval.status}</Badge>}
            subtitle="Internal only. Advisor approval sends the package to compliance; client visibility remains blocked."
            title={title}
          />
          <ScfP04P06FlowPanel mode="advisory" />
          <UxDetailStandardPanel
            actionLabel="Approve for compliance queue"
            actionState="Advisor approval records advisor review only; compliance release remains required before client visibility."
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
            safetyNote="No unapproved advice reaches the client; AI draft content remains internal until all release gates pass."
            status={selectedApproval.status}
            timelineItems={["Analyst submitted", "Advisor reviewing", "Compliance not released"]}
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
            <Card className="xl:col-span-2"><CardHeader><CardTitle>Internal Draft Recommendation</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-alphavest-muted">{selectedApproval.recommendation}</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{["6.4% Return", "10.2% Volatility", "82% Scenario Fit", "89/100 Tax Score"].map((item) => <Badge key={item} tone="green">{item}</Badge>)}</div><p className="mt-4 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">Internal draft only. Rejection or rebuild keeps client visibility blocked until advisor and compliance gates pass.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Risk View</CardTitle></CardHeader><CardContent><p className="text-center text-xl font-semibold text-alphavest-gold">Moderate (5/10)</p><ProgressBar value={50} /><p className="mt-3 text-sm text-alphavest-muted">Key considerations: equity allocation, interest rate sensitivity and sequence risk.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Alternatives</CardTitle></CardHeader><CardContent className="space-y-2">{selectedApproval.alternatives.map((item, index) => <div className="flex justify-between text-sm" key={item}><span className="text-alphavest-muted">{item}</span><Badge tone="gold">Score {84 - index * 5}</Badge></div>)}</CardContent></Card>
          </div>
          <InternalGuard />
        </section>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Advisor Decision</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <StatePanel detail="Please review all details before taking action. This does not release content to the client." state="restricted" title="No client visibility" />
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
              <button className={secondaryButtonClass + " w-full"} data-testid="ux-cta-ai-rebuild" type="button">Rebuild internal draft</button>
              <button className={secondaryButtonClass + " w-full"} type="button">Request evidence for rebuild</button>
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
                Reject unsupported draft claim
              </button>
              {decisionStatus ? (
                <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
                  {decisionStatus}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <StatePanel detail="Once approved by advisor, the recommendation is queued for compliance review. Until then, client visibility remains blocked." state="blocked" title="Compliance pending" />
          <ScfP04P06FlowPanel mode="compliance" />
        </aside>
      </div>
    </InternalShell>
  );
}

const complianceColumns: Array<DataTableColumn<(typeof complianceQueue)[number]>> = [
  { key: "id", header: "ID", render: (row) => <span className="font-semibold text-alphavest-gold">{row.id}</span> },
  { key: "item", header: "Item", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.item}<span className="block text-xs text-alphavest-muted">{row.sub}</span></span> },
  { key: "classification", header: "Classification", render: (row) => <Badge tone={toneFor(row.classification)}>{row.classification}</Badge> },
  { key: "risk", header: "Risk Status", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge> },
  { key: "advisor", header: "Responsible Advisor", render: (row) => row.advisor },
  { key: "evidence", header: "Evidence Status", render: (row) => <Badge tone={toneFor(row.evidence)}>{row.evidence}</Badge> },
  { key: "publish", header: "Publish Status", render: (row) => <Badge tone={toneFor(row.publish)}>{row.publish}</Badge> },
  { key: "due", header: "Due Date", render: (row) => <span className={row.age !== "0d" ? "text-alphavest-red" : ""}>{row.due}</span> }
];

function ComplianceQueuePage({ title }: { title: string }) {
  return (
    <InternalShell activePageId="038">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[104rem] space-y-5">
        <PageHeading
          action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button"><Download aria-hidden="true" className="size-4" />Export</button><button className={primaryButtonClass} type="button"><RefreshCw aria-hidden="true" className="size-4" />Refresh</button></div>}
          subtitle="Review and action pending compliance items."
          title={title}
        />
        <ScfP04P06FlowPanel mode="compliance" />
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
        <div className="grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 lg:grid-cols-[1fr_repeat(4,10rem)_auto_auto]">
          <label className="relative min-w-0">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search by client, advisor, ID, or keyword..." />
          </label>
          {["Classification", "Risk Status", "Evidence Status", "Publish Status"].map((filter) => <FilterButton key={filter} label={filter} />)}
          <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />More Filters</button>
          <button className="px-3 text-sm font-semibold text-alphavest-gold" type="button">Clear</button>
        </div>
        <DataTable columns={complianceColumns} getRowId={(row) => row.id} rows={complianceQueue} />
      </div>
    </InternalShell>
  );
}

function ComplianceReviewPage({ title }: { title: string }) {
  const [confirmationAction, setConfirmationAction] = useState<SensitiveWorkflowAction | null>(null);

  return (
    <InternalShell activePageId="039">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[1fr_23rem]">
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
            evidenceItems={["Evidence completeness", "Policy checks", "Audit references"]}
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
          <UxComplexityPriorityPanel
            actionLabel="Request evidence or block release"
            actionState="Release stays blocked while evidence completeness and policy checks are unresolved."
            priorityItems={[
              { detail: complianceReview.client, label: complianceReview.title, value: complianceReview.classification },
              { detail: complianceReview.evidenceComplete, label: "Evidence completeness", value: "Incomplete" },
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
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <StatePanel detail="This item cannot be released until all required evidence is complete and policy checks pass." state="blocked" title="Release gates not satisfied" />
              <button className={secondaryButtonClass + " w-full"} disabled type="button"><Send aria-hidden="true" className="size-4" />Release</button>
              <button
                className="inline-flex h-[var(--button-height)] w-full items-center justify-center gap-2 rounded-md border border-alphavest-red/55 bg-alphavest-red/10 px-4 text-sm font-semibold text-alphavest-red"
                data-testid="j02-block-release"
                onClick={() => {
                  setConfirmationAction("compliance_block");
                }}
                type="button"
              >
                Block
              </button>
              <button
                className={secondaryButtonClass + " w-full"}
                data-testid="j02-request-evidence"
                onClick={() => {
                  setConfirmationAction("request_evidence");
                }}
                type="button"
              >
                <MessageSquare aria-hidden="true" className="size-4" />Request Evidence
              </button>
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
      </div>
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
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[104rem] gap-5 xl:grid-cols-[18rem_1fr_22rem]">
        <aside className="space-y-4">
          <Card><CardHeader><CardTitle>Review progress</CardTitle></CardHeader><CardContent className="space-y-3">{["Advice validation", "Risk & suitability", "Product & fee review", "Disclosures", "Documents", "Overall review"].map((item) => <p className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}><CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />{item}</p>)}</CardContent></Card>
          <StatePanel detail="Demo checklist is marked ready for release review; client visibility still requires the explicit release action and audit proof." state="success" title="Review decision marked approved" />
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
          <StatePanel detail="Compliance checklist is marked complete for this demo review. Client visibility is still controlled by the release action." state="success" title="Review status marked approved" />
          <Card><CardHeader><CardTitle>Related items</CardTitle></CardHeader><CardContent className="space-y-3">{["SOA - Retirement Income Plan", "PDS - AlphaVest Balanced Fund", "Fee Disclosure Statement", "Risk Profile Assessment"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}</CardContent></Card>
        </aside>
      </div>
      <ReleaseModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </InternalShell>
  );
}

function ReleaseModal({ onClose, open }: { onClose: () => void; open: boolean }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const releasePhrase = "RELEASE TO CLIENT";
  const releaseValid = acknowledged && confirmationText.trim() === releasePhrase;
  const submitDisabled = !releaseValid || status === "submitting" || status === "success";

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
    setMessage(null);

    try {
      const body = await runRecommendationReviewWorkflowAction({
        action: "compliance_release",
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: [recommendationReviewDemoTargets.summit.evidenceId],
        reason:
          "Compliance released the recommendation after advisor approval, evidence and permission gates passed.",
        targetId: recommendationReviewDemoTargets.summit.recommendationId,
      });

      setStatus("success");
      setMessage(body.result?.auditEventId ? `Audit recorded: ${body.result.auditEventId}` : "Release persisted.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Release failed without mutation.");
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
            disabled={submitDisabled}
            onClick={() => {
              void submitRelease();
            }}
            type="button"
          >
            <LockKeyhole aria-hidden="true" className="size-4" />{status === "submitting" ? "Submitting..." : "Release to client"}
          </button>
        </>
      }
      onClose={status === "submitting" ? undefined : resetAndClose}
      open={open}
      title="Release to client"
    >
      <div className="grid gap-4 xl:grid-cols-2">
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
            <label className="flex items-start gap-3 text-sm text-alphavest-muted">
              <input
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
                className={inputClass}
                data-testid="j02-release-confirmation"
                disabled={status === "submitting" || status === "success"}
                onChange={(event) => setConfirmationText(event.target.value)}
                value={confirmationText}
              />
            </label>
            {status === "success" ? (
              <StatePanel detail={message ?? "Release persisted."} state="success" title="Released successfully" />
            ) : null}
            {status === "error" ? (
              <StatePanel detail={message ?? "No mutation was completed."} state="blocked" title="Release failed" />
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4 text-sm text-alphavest-green">
        Release has not been completed in this modal state. The demo action records only the requested release step after submit.
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
