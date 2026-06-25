"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileCheck2,
  FileText,
  Filter,
  LockKeyhole,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  X
} from "lucide-react";
import {
  AuditTimeline,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Drawer,
  Modal,
  StatePanel,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { DemoActorHandoffBar } from "@/components/demo-actor-handoff-bar";
import { ProcessSidebar } from "@/components/process-navigation";
import { ProductGuidanceContent } from "@/components/product-guidance-panel";
import { RouteContextChip } from "@/components/route-context-chip";
import { ScfP04P06FlowPanel } from "@/components/scf-p04-p06-flow-panel";
import { ScfP07P09TrustPanel } from "@/components/scf-p07-p09-trust-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxDenseOperationsPanel } from "@/components/ux-dense-operations-panel";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { UxComplexityPriorityPanel } from "@/components/ux-complexity-priority-panel";
import { UxCtaCluster } from "@/components/ux-cta-cluster";
import { UxSecondaryContextTabs } from "@/components/ux-secondary-context-tabs";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import {
  recommendationReviewDemoTargets,
  runRecommendationReviewWorkflowAction,
  runScreencastDemoAction,
} from "@/lib/screencast-demo-client";
import {
  accessPolicyChecks,
  complianceAuditControls,
  accessRequests,
  complianceAuditMetrics,
  complianceAuditRows,
  complianceBlockReview,
  decisionApprovals,
  decisionOptions,
  decisionRoom,
  decisionRows,
  decisionSuccess,
  decisionsGovernancePageIds,
  decisionsMetrics,
  evidenceRecord,
  evidenceRows,
  evidenceTimeline,
  exceptionSummary,
  governanceMetrics,
  governanceUsers,
  missingEvidenceChecklist,
  requestedEvidenceItems,
  rolePermissions,
  roleRows
} from "@/lib/decisions-governance-demo-data";
import { createDemoSession, demoPlatformTenantId, demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";
import { visibilityEngine, type DecisionVisibilityPayload } from "@/lib/visibility-engine";

type DecisionsGovernanceScreenProps = {
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

const destructiveButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-red/60 bg-alphavest-red/10 px-4 text-sm font-semibold text-alphavest-red transition hover:bg-alphavest-red/16";

const wp07InternalDecisionSession = createDemoSession({ roleKey: "analyst", tenantSlug: "summit" });
const wp07ClientDecisionSession = createDemoSession({ roleKey: "principal", tenantSlug: "summit" });

const wp07InternalDecisionPayload: DecisionVisibilityPayload = {
  aiDraft: "Internal draft remains internal to AlphaVest review.",
  assumptionsJson: { source: "wp07-decision-record" },
  clientSummary: "Strategic rebalance summary approved for client view after release.",
  clientTenantId: wp07InternalDecisionSession.tenant.id,
  clientVisible: true,
  complianceNotes: "Compliance release notes retained internally.",
  decisionState: "RELEASED",
  evidenceRecordId: "evidence:summit:wp07-source",
  id: "decision:summit:wp07-record",
  internalRationale: "Internal rationale retained for traceability.",
  releasedAt: "2026-06-23T09:15:00.000Z",
  sensitivity: "RESTRICTED",
  submittedAt: "2026-06-23T08:45:00.000Z",
  title: "Strategic rebalance decision",
  visibilityStatus: "CLIENT_VISIBLE",
};

function handleStaticSortChange() {
  return undefined;
}

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("active") || normalized.includes("approved") || normalized.includes("complete") || normalized.includes("verified") || normalized.includes("resolved") || normalized.includes("compliant") || normalized.includes("success")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("denied") || normalized.includes("high") || normalized.includes("open") || normalized.includes("missing") || normalized.includes("restricted")) {
    return "red";
  }

  if (normalized.includes("pending") || normalized.includes("review") || normalized.includes("awaiting") || normalized.includes("required") || normalized.includes("partial") || normalized.includes("medium") || normalized.includes("custom")) {
    return "gold";
  }

  if (normalized.includes("internal") || normalized.includes("others") || normalized.includes("low") || normalized.includes("system")) {
    return "blue";
  }

  if (normalized.includes("escalated")) {
    return "purple";
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

  return <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border", toneClass[tone])}>{children}</span>;
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

function Phase12Sidebar() {
  return (
    <ProcessSidebar
      footer={
        <div className="rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Controlled visibility
          </div>
          <p className="mt-2 text-xs leading-5 text-alphavest-muted">No unapproved advice reaches the client. Sensitive actions are audit logged.</p>
        </div>
      }
    />
  );
}

function Phase12TopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative min-w-0 xl:w-[34rem]">
          <span className="sr-only">Search WealthOS</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-10 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
            placeholder="Search decisions, evidence, users, policies..."
            type="search"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-alphavest-border px-1.5 py-0.5 text-xs text-alphavest-subtle md:block">cmd K</span>
        </label>
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
          <span aria-label="Decision workspace notifications are informational in this release" className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted opacity-65" data-ux-affordance="static-notification-indicator" data-ux-interactive="false" role="status">
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

function Phase12Shell({ children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid">
        <Phase12Sidebar />
        <div className="min-w-0">
          <Phase12TopBar />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-2 text-sm last:border-0">
      <span className="min-w-0 text-alphavest-muted">{label}</span>
      <span className="min-w-0 break-words text-right font-semibold text-alphavest-ivory">{value}</span>
    </div>
  );
}

function EvidenceControlRail() {
  return (
    <>
      <WorksurfacePanel
        description="Vault and record views expose controlled evidence context only."
        title="Evidence controls"
      >
        <div className="space-y-3">
          <InfoRow label="Download" value="Blocked until release/export gates pass" />
          <InfoRow label="Share" value="Requires scoped visibility checks" />
          <InfoRow label="Client access" value="Never implied by record presence" />
          <InfoRow label="Audit" value="Sensitive actions remain logged" />
        </div>
      </WorksurfacePanel>
      <StatePanel
        detail="Evidence records can support decisions, but do not by themselves prove sufficiency or authorize client visibility."
        state="internal-only"
        title="Controlled evidence only"
      />
    </>
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
        <span className={primaryButtonClass} data-testid="ux-phase6-confirm" data-ux-affordance="static-control-note" data-ux-interactive="false">{confirmLabel}</span>
        <span className={secondaryButtonClass} data-testid="ux-phase6-cancel" data-ux-affordance="static-control-note" data-ux-interactive="false">{cancelLabel}</span>
      </div>
    </section>
  );
}



type Phase7ClientProjectionPanelProps = {
  allowedFields: string;
  failClosed: string;
  forbiddenFields: string;
  recovery: string;
  routeLabel: string;
  taskId: string;
  visibilityEngineOutput: string;
};

function Phase7ClientProjectionPanel({ allowedFields, failClosed, forbiddenFields, recovery, routeLabel, taskId, visibilityEngineOutput }: Phase7ClientProjectionPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4" data-testid="ux-phase7-client-projection" data-ux-phase7-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-green">Client-safe projection</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{routeLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">Client view stays fail-closed and never exposes internal payloads.</p>
        </div>
        <Badge tone="green">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase7-visibility-engine">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Visibility engine</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{visibilityEngineOutput}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase7-safe-fields">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Allowed client fields</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{allowedFields}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-phase7-forbidden-fields">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-red">Forbidden payloads</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{forbiddenFields}</p>
        </div>
        <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3" data-testid="ux-phase7-fail-closed">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-gold">Fail closed</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{failClosed}</p>
        </div>
      </div>
      <div className="mt-4" data-testid="ux-phase7-recovery"><StatePanel detail={recovery} state="restricted" title="Unavailable content" /></div>
    </section>
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

function ComplianceBlockPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [modalOpen, setModalOpen] = useState(visualState === "block");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const requiredPhrase = "REQUEST EVIDENCE";
  const requestEvidenceValid = acknowledged && confirmationText.trim() === requiredPhrase && reason.trim().length >= 12;
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = requestEvidenceValid
    ? "valid-confirmation"
    : !acknowledged
      ? "blocked-acknowledgement-required"
      : reason.trim().length < 12
        ? "blocked-reason-required"
        : "blocked-exact-phrase-required";
  const validationMessage = requestEvidenceValid
    ? "Confirmation is valid. Submit can request evidence through the existing audited workflow while release remains blocked."
    : !acknowledged
      ? "Evidence request is blocked until the compliance acknowledgement is checked, a controlled reason is entered and the exact phrase is typed."
      : reason.trim().length < 12
        ? "Evidence request is blocked until the reason explains the missing evidence decision with at least 12 characters."
        : `Evidence request is blocked until the confirmation text exactly matches ${requiredPhrase}.`;

  function resetAndClose() {
    setAcknowledged(false);
    setConfirmationText("");
    setReason("");
    setStatus("idle");
    setMessage(null);
    setModalOpen(false);
  }

  async function submitEvidenceRequest() {
    if (!requestEvidenceValid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Submitting the audited evidence request. Close and cancel are blocked until the request resolves.");

    try {
      const body = await runRecommendationReviewWorkflowAction({
        action: "request_evidence",
        actorRole: "compliance_officer",
        confirmationText: confirmationText.trim(),
        evidenceIds: [recommendationReviewDemoTargets.morgan.evidenceId],
        reason: reason.trim(),
        targetId: recommendationReviewDemoTargets.morgan.recommendationId,
      });

      setStatus("success");
      setMessage(
        body.result?.auditEventId
          ? `Audit recorded: ${body.result.auditEventId}. Evidence request persisted for this review only; evidence sufficiency, release, export/download/share and client acceptance remain separate controls.`
          : "Evidence request persisted for this review only; evidence sufficiency, release, export/download/share and client acceptance remain separate controls.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No release mutation, evidence sufficiency or client visibility change was completed.`
          : "Evidence request failed without release mutation, evidence sufficiency or client visibility change.",
      );
    }
  }

  return (
    <Phase12Shell activePageId="041">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[104rem] gap-5 xl:grid-cols-[19rem_1fr_19rem]">
        <aside className={cn("space-y-4", modalOpen ? "opacity-55" : "")}>
          <Card>
            <CardHeader><CardTitle>Review Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Review Type" value="Advice Review" />
              <InfoRow label="Initiated" value="Apr 17, 2025" />
              <InfoRow label="Due Date" value={complianceBlockReview.dueDate} />
              <InfoRow label="Priority" value="High" />
            </CardContent>
          </Card>
          <StatePanel detail="Advice content is not releasable." state="blocked" title="Blocked" />
          <Card>
            <CardHeader><CardTitle>Advice Visibility</CardTitle></CardHeader>
            <CardContent>
              <IconTile tone="gold"><LockKeyhole aria-hidden="true" className="size-5" /></IconTile>
              <p className="mt-3 text-sm leading-6 text-alphavest-muted">Client cannot view blocked advice. No unapproved advice reaches the client.</p>
            </CardContent>
          </Card>
        </aside>
        <section className={cn("min-w-0 space-y-5", modalOpen ? "opacity-45" : "")}>
          <PageHeading
            action={<button className={primaryButtonClass} onClick={() => setModalOpen(true)} type="button">Manage Block</button>}
            badge={<Badge tone="red">Blocked</Badge>}
            subtitle={`${complianceBlockReview.id} - ${complianceBlockReview.client} - advisor ${complianceBlockReview.advisor}`}
            title={complianceBlockReview.reviewTitle}
          />
          <ScfP04P06FlowPanel mode="compliance" />
          <UxDetailStandardPanel
            actionLabel="Request evidence or keep blocked"
            actionState="The advice object remains blocked until requested evidence is received, reviewed and released."
            evidenceItems={["Missing evidence checklist", "Requested evidence items", "Block reason"]}
            facts={[
              { label: "Review ID", value: complianceBlockReview.id },
              { label: "Client", value: complianceBlockReview.client },
              { label: "Advisor", value: complianceBlockReview.advisor },
              { label: "Owner", value: complianceBlockReview.owner },
            ]}
            objectTitle={complianceBlockReview.reviewTitle}
            objectType="Compliance block detail"
            routeId="041"
            safetyNote="Block and request-evidence states are controls; they do not complete release or client acceptance."
            status="Blocked"
            timelineItems={complianceBlockReview.timeline.slice(0, 3).map((item) => item.title)}
          />
          <div className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-4">
            <p className="text-sm text-alphavest-muted">Advice content is blocked and cannot be viewed by the client.</p>
          </div>
        </section>
        <aside className={cn("space-y-4", modalOpen ? "opacity-55" : "")}>
          <Card>
            <CardHeader><CardTitle>Review Timeline</CardTitle></CardHeader>
            <CardContent>
              <AuditTimeline items={[...complianceBlockReview.timeline]} />
            </CardContent>
          </Card>
        </aside>
      </div>
      <Modal
        className="max-w-[52rem]"
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Compliance block state</p>
            <p className="text-alphavest-muted">Advice remains blocked from client visibility until requested evidence is received, reviewed and released.</p>
          </div>
        }
        description="Advice remains blocked while evidence is incomplete."
        footer={
          <>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={resetAndClose} type="button">Cancel</button>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={resetAndClose} type="button">Keep Blocked</button>
            <button
              className={primaryButtonClass}
              data-testid="j02-confirm-request-evidence"
              data-ux-lifecycle-result={requestEvidenceValid ? "submits-audited-evidence-request" : "blocked-validation-required"}
              disabled={!requestEvidenceValid || status === "submitting" || status === "success"}
              onClick={() => {
                void submitEvidenceRequest();
              }}
              type="button"
            >
              {status === "submitting" ? "Submitting..." : "Request Evidence"}
            </button>
            <span className={secondaryButtonClass} data-ux-affordance="static-control-note" data-ux-interactive="false">Escalation held</span>
          </>
        }
        onClose={status === "submitting" ? undefined : resetAndClose}
        open={modalOpen}
        title={title}
      >
        <div
          className="space-y-4"
          data-testid="uxp3-block-request-evidence-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={validationState}
          data-ux-no-overclaim="true"
          data-ux-sensitive-action="request_evidence"
        >
          <div className="grid gap-4 rounded-md border border-alphavest-red/45 bg-alphavest-red/12 p-4 md:grid-cols-[auto_1fr_auto]">
            <IconTile tone="red"><LockKeyhole aria-hidden="true" className="size-5" /></IconTile>
            <div>
              <p className="font-semibold uppercase text-alphavest-ivory">Status: Blocked</p>
              <p className="text-sm text-alphavest-muted">{complianceBlockReview.summary}</p>
            </div>
            <p className="text-sm font-semibold text-alphavest-ivory">No unapproved advice reaches the client.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Block Reason</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm font-semibold text-alphavest-ivory">Missing required evidence</div>
                <p className="text-sm leading-6 text-alphavest-muted">Required documentation is missing to support this advice package.</p>
                {missingEvidenceChecklist.map((item) => (
                  <p className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-gold" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Requested Evidence</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {requestedEvidenceItems.map((item) => (
                  <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm" key={item.item}>
                    <span className="text-alphavest-ivory">{item.item}</span>
                    <Badge tone="gold">{item.required ? "Required" : "Optional"}</Badge>
                  </div>
                ))}
                <span className="text-sm font-semibold text-alphavest-gold opacity-60" data-ux-affordance="static-control-note" data-ux-interactive="false">Evidence items scoped</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Owner and Escalation</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Assigned owner" value={complianceBlockReview.owner} />
                <InfoRow label="Response due" value={complianceBlockReview.dueDate} />
                <InfoRow label="Escalation status" value="Not escalated" />
                <StatePanel detail="Request will be sent to the assigned owner. Release remains blocked until evidence is received and approved." state="restricted" title="What happens next?" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Confirm evidence request</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="sr-only" id="block-request-evidence-validation">{validationMessage}</p>
              <label className="flex items-start gap-3 text-sm text-alphavest-muted">
                <input
                  aria-describedby="block-request-evidence-validation"
                  checked={acknowledged}
                  className="mt-1"
                  disabled={status === "submitting" || status === "success"}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  type="checkbox"
                />
                <span>I understand this request persists workflow state and writes an audit event.</span>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Reason</span>
                <textarea
                  aria-describedby="block-request-evidence-validation"
                  className={textareaClass}
                  disabled={status === "submitting" || status === "success"}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Compliance confirmed the evidence request while client visibility remains blocked."
                  value={reason}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Type {requiredPhrase}</span>
                <input
                  aria-describedby="block-request-evidence-validation"
                  className={inputClass}
                  data-testid="j02-request-evidence-confirmation"
                  disabled={status === "submitting" || status === "success"}
                  onChange={(event) => setConfirmationText(event.target.value)}
                  value={confirmationText}
                />
              </label>
              {status === "idle" ? (
                <StatePanel
                  detail={validationMessage}
                  state={requestEvidenceValid ? "validation" : "blocked"}
                  testId="j02-block-request-validation-state"
                  title={requestEvidenceValid ? "Evidence request confirmation valid" : "Evidence request confirmation blocked"}
                />
              ) : null}
              {status === "submitting" ? (
                <StatePanel
                  detail={message ?? "Submitting the audited evidence request."}
                  state="loading"
                  testId="j02-block-request-loading-state"
                  title="Evidence request submitting"
                />
              ) : null}
              {status === "success" ? (
                <StatePanel
                  detail={message ?? "Evidence request persisted for this review only; evidence sufficiency, release, export/download/share and client acceptance remain separate controls."}
                  state="success"
                  testId="j02-block-request-success-state"
                  title="Evidence request persisted"
                />
              ) : null}
              {status === "error" ? (
                <StatePanel
                  detail={message ?? "No release mutation, evidence sufficiency or client visibility change was completed."}
                  state="blocked"
                  testId="j02-block-request-error-state"
                  title="Evidence request failed"
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </Modal>
    </Phase12Shell>
  );
}

const complianceAuditColumns: Array<DataTableColumn<(typeof complianceAuditRows)[number]>> = [
  { key: "timestamp", header: "Timestamp", render: (row) => row.timestamp, sortable: true },
  { key: "event", header: "Event Type", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.event}</span>, sortable: true },
  { key: "status", header: "Exception Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true },
  { key: "severity", header: "Severity", render: (row) => <Badge tone={toneFor(row.severity)}>{row.severity}</Badge>, sortable: true },
  { key: "actor", header: "Actor", render: (row) => row.actor, sortable: true },
  { key: "client", header: "Client", render: (row) => row.client, sortable: true },
  { key: "policy", header: "Policy / Rule", render: (row) => row.policy },
  { key: "source", header: "Source", render: (row) => row.source }
];

function ComplianceAuditPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="042">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase5DetailSplitPanel decisionSupport="Audit detail exposes actor, target, result and exception context before controlled export." objectLabel="Audit object review" objectState="Audit exceptions open" pageJob="Audit detail supports review of persisted events without acting as permission approval." safetyBoundary="Audit drawer context cannot approve access, release advice or export packages." splitTaskId="UX-PAGE-SPLIT-006" taskId="UX-DETAIL-005" />
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[1fr_20rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading subtitle="Compliance decision, exception and resolution activity for audit review." title={title} />
          <ScfP04P06FlowPanel mode="audit" />
          <StatePanel
            detail="Compliance audit rows on this demo screen are display-only context. Persisted record is the DB-backed AuditEvent returned by the audited action or audit-history API."
            state="restricted"
            testId="wp08-display-only-audit-state"
            title="Display-only audit context"
          />
          <UxComplexityPriorityPanel
            actionLabel="Review critical audit exceptions"
            actionState="Export and column controls remain secondary until critical audit fields and persistence are reviewed."
            priorityItems={[
              { detail: "Actor, role, tenant, target and reason required", label: "Audit persistence gate", value: "Critical" },
              { detail: "Highest severity exceptions first", label: "Open exceptions", value: "27" },
              { detail: "Controlled export requires audit confirmation", label: "Export controlled", value: "Locked" },
            ]}
            safetyNote="Audit visibility is not audit persistence; critical actions still require persisted audit rows."
            summaryItems={[
              { detail: "Rows in current audit view", label: "Results", value: "12,842" },
              { detail: "Exceptions still unresolved", label: "Open", value: "27" },
              { detail: "Export must remain controlled", label: "Download", value: "No" },
            ]}
            title="Audit status"
          />
          <div className="grid gap-3 md:grid-cols-4">
            {complianceAuditMetrics.map((metric) => (
              <Card key={metric.label}>
                <div className="flex items-center gap-4">
                  <IconTile tone={toneFor(metric.label)}>{metric.label === "Open Exceptions" ? <AlertTriangle aria-hidden="true" className="size-5" /> : <FileCheck2 aria-hidden="true" className="size-5" />}</IconTile>
                  <div>
                    <p className="text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
                    <p className="text-sm text-alphavest-muted">{metric.label}</p>
                    <p className="text-xs text-alphavest-subtle">{metric.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <UxDenseOperationsPanel
            actions={
              <>
              <button
                className={secondaryButtonClass}
                data-testid="j02-export-controlled"
                onClick={() => {
                  void runScreencastDemoAction("j02.exportControlled");
                }}
                type="button"
              >
                <LockKeyhole aria-hidden="true" className="size-4" />Export Controlled
              </button>
              <span className={secondaryButtonClass} data-ux-affordance="static-control-note" data-ux-interactive="false">Column settings held</span>
              </>
            }
            controls={["Date range", "Event type", "Exception status", "Actor", "Client", "Severity", "Source", "Policy / rule"]}
            description="Compliance audit rows stay scan-first with filter, sort and row inspection before any controlled export."
            pageId="042"
            resultLabel="12,842 audit rows; 27 unresolved exceptions"
            safetyNote="Audit visibility is not audit persistence; export and critical action controls remain blocked until persisted audit evidence exists."
            title="Audit operations table"
          >
            <DataTable
              columns={complianceAuditColumns}
              compact
              getRowId={(row) => `${row.timestamp}-${row.event}`}
              onSortChange={handleStaticSortChange}
              responsiveMode="table"
              rows={complianceAuditRows}
              sortDirection="desc"
              sortKey="timestamp"
            />
          </UxDenseOperationsPanel>
        </section>
        <aside className="space-y-5">
          <StatePanel
            detail="Critical actions cannot complete unless the audit row can persist with actor, role, tenant, target, state change, result and reason."
            state="restricted"
            title="Audit persistence gate"
          />
          <Card>
            <CardHeader><CardTitle>Minimum Audit Fields</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {complianceAuditControls.map((item) => (
                <InfoRow key={item.label} label={item.label} value={item.value} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Exception Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid size-28 place-items-center rounded-full border-8 border-alphavest-gold/70 text-center">
                <div><p className="text-3xl font-semibold text-alphavest-ivory">27</p><p className="text-xs text-alphavest-muted">Open</p></div>
              </div>
              {exceptionSummary.map((item) => (
                <InfoRow key={item.label} label={item.label} value={String(item.value)} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Resolution Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Resolved" value="184" />
              <InfoRow label="Auto-resolved" value="96" />
              <InfoRow label="Manual" value="88" />
              <InfoRow label="Avg. time" value="2.6 days" />
            </CardContent>
          </Card>
          <StatePanel detail="Exports require security controls and audit confirmation before they can proceed." state="restricted" title="Export controlled" />
        </aside>
      </div>
    </Phase12Shell>
  );
}

const decisionColumns: Array<DataTableColumn<(typeof decisionRows)[number]>> = [
  { key: "title", header: "Title", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.title}<span className="block text-xs text-alphavest-muted">{row.updated}</span></span> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "stage", header: "Approval Stage", render: (row) => row.stage },
  { key: "due", header: "Due Date", render: (row) => <span className={row.owner === "You" ? "text-alphavest-gold" : ""}>{row.due}</span> },
  { key: "category", header: "Category", render: (row) => <Badge tone="muted">{row.category}</Badge> },
  { key: "owner", header: "Needs Action From", render: (row) => row.owner }
];

function DecisionsListPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="043">
      <ScreenTitle>{title}</ScreenTitle>
      <UxHubPage pageId="043" />
    </Phase12Shell>
  );
}

const wp07DecisionTraceabilityItems = [
  { label: "Recommendation", value: "REC-NORTHBRIDGE-2026-001", detail: "Reviewed recommendation source retained internally." },
  { label: "Evidence", value: "EVD-SUMMIT-2026-014", detail: "Linked and reviewed evidence package; raw source stays internal." },
  { label: "Advisor approval", value: "ADV-APPROVED", detail: "Advisor approval is prerequisite only, not release." },
  { label: "Compliance release", value: "COMPLIANCE-RELEASED", detail: "Compliance release controls client-safe visibility." },
  { label: "Audit reference", value: "AUD-2026-WP07", detail: "Audit reference stored internally." },
  { label: "Visibility status", value: "CLIENT_SAFE", detail: "Projection allowlist controls the client view." },
];

function DecisionRecordTraceabilityCard() {
  const internalProjection = visibilityEngine.projectDecisionPayload(
    wp07InternalDecisionSession.actor,
    wp07InternalDecisionSession.role,
    wp07InternalDecisionPayload,
    demoPlatformTenantId,
    wp07InternalDecisionSession.tenant.id,
  );
  const clientProjection = visibilityEngine.projectDecisionPayload(
    wp07ClientDecisionSession.actor,
    wp07ClientDecisionSession.role,
    wp07InternalDecisionPayload,
    demoPlatformTenantId,
    wp07ClientDecisionSession.tenant.id,
  );
  const clientProjectionSafety = visibilityEngine.assertClientProjectionClean(clientProjection);

  return (
    <Card data-testid="wp07-decision-record-traceability" data-wp07-client-projection-clean={String(clientProjectionSafety.clean)} data-wp07-internal-projection={internalProjection.reasonCode}>
      <CardHeader>
        <CardTitle>Decision record traceability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatePanel
          detail="Internal traceability view - not client-visible. The client receives only the released projection allowlist."
          state="restricted"
          title="Internal decision record"
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {wp07DecisionTraceabilityItems.map((item) => (
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{item.value}</p>
              <p className="mt-2 text-xs leading-5 text-alphavest-muted">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-3" data-testid="wp07-decision-client-projection-preview">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-green">Client projection allowlist</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">
            Client payload contains decision id, title, released state, released timestamp and client-safe summary only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

type DecisionActionKey = "request_more_information" | "defer" | "reject" | "accept";

const decisionActionCopy: Record<DecisionActionKey, {
  actionId: "j03.requestMoreInformation" | "j03.deferDecision" | "j03.rejectDecision" | "j03.acceptOption";
  label: string;
  nextRoute?: string;
  tone: "primary" | "secondary" | "destructive";
}> = {
  accept: {
    actionId: "j03.acceptOption",
    label: "Accept Option 1",
    nextRoute: "/decisions/demo/success",
    tone: "primary",
  },
  defer: {
    actionId: "j03.deferDecision",
    label: "Defer decision",
    tone: "secondary",
  },
  reject: {
    actionId: "j03.rejectDecision",
    label: "Reject decision",
    tone: "destructive",
  },
  request_more_information: {
    actionId: "j03.requestMoreInformation",
    label: "Request more information",
    tone: "secondary",
  },
};

function DecisionRoomPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [pendingAction, setPendingAction] = useState<DecisionActionKey | null>(visualState === "approval" ? "accept" : null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const activeAction = pendingAction ? decisionActionCopy[pendingAction] : null;
  const requiredPhrase = "CONFIRM DECISION";
  const decisionValid = acknowledged && confirmationText.trim() === requiredPhrase;
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = decisionValid
    ? "valid-confirmation"
    : !acknowledged
      ? "blocked-acknowledgement-required"
      : "blocked-exact-phrase-required";
  const validationMessage = decisionValid
    ? "Confirmation is valid. Submit can record this client decision action through the existing audited workflow."
    : !acknowledged
      ? "Decision action is blocked until acknowledgement is checked and the exact confirmation phrase is typed."
      : `Decision action is blocked until the confirmation text exactly matches ${requiredPhrase}.`;

  function openDecisionConfirmation(action: DecisionActionKey) {
    setPendingAction(action);
    setAcknowledged(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  function resetAndCloseDecision() {
    setPendingAction(null);
    setAcknowledged(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  async function submitDecisionAction() {
    if (!activeAction || !decisionValid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Submitting the audited client decision action. Close and cancel are blocked until the request resolves.");

    try {
      const body = await runScreencastDemoAction(activeAction.actionId, activeAction.nextRoute);
      setStatus("success");
      setMessage(
        body.result?.auditEventId
          ? `Audit recorded: ${body.result.auditEventId}. ${activeAction.label} was recorded only through the released decision workflow; compliance release, evidence sufficiency, export/download/share and follow-up advice remain separate controls.`
          : `${activeAction.label} was recorded only through the released decision workflow; compliance release, evidence sufficiency, export/download/share and follow-up advice remain separate controls.`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No decision mutation, release change or client visibility change was completed.`
          : "Decision action failed without mutation, release change or client visibility change.",
      );
    }
  }

  return (
    <Phase12Shell activePageId="044">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[112rem] space-y-5">
        <PageHeading
          action={<span className={secondaryButtonClass} data-ux-affordance="static-control-note" data-ux-interactive="false">Release workflow scoped</span>}
          badge={<Badge tone="gold">Ready to Decide</Badge>}
          subtitle={`${decisionRoom.decisionId} - ${decisionRoom.client}`}
          title={title}
        />
        <ScfP07P09TrustPanel mode="decision" />
        <Phase7ClientProjectionPanel allowedFields="decision id, title, released state, client summary and releasedAt only" failClosed="Submitted or unreleased decisions render as unavailable and hide the decision body." forbiddenFields="No AI Draft, internal rationale, compliance notes, evidence record id, assumptions or manual override." recovery="The client sees safe decision status and can wait for compliance release or request advisor clarification." routeLabel="Client released decision projection" taskId="UX-CLIENT-PROJECTION-002" visibilityEngineOutput="DEMO_CLIENT_DECISION_SAFE_PROJECTION or DEMO_CLIENT_DECISION_FAIL_CLOSED" />
        <Phase6DecisionRoomPanel audit="Client decision audit must record actor, released package state, selected action and cancel or confirm outcome." blocker="Client decision remains separated from compliance release, evidence controls and client acceptance." cancelLabel="Cancel decision action" confirmLabel="Confirm client decision" decisionLabel="Client decision governance room" evidence="Linked documents, approvals and decision options are visible before action." preconditions="Released package, evidence controls, permission scope and decision audit readiness must all pass." safetyNote="No release, export or advice effect can occur until gate preconditions pass and an audit record exists." taskId="UX-DECISION-ROOM-001" />
        <UxDetailStandardPanel
          actionLabel="Accept, defer, reject or request more information"
          actionState="Decision actions are recorded only within the released decision workflow and do not bypass evidence or compliance controls."
          evidenceItems={["Linked documents", "Approvals", "Decision options"]}
          facts={[
            { label: "Decision ID", value: decisionRoom.decisionId },
            { label: "Client", value: decisionRoom.client },
            { label: "Owner", value: decisionRoom.owner },
            { label: "Due", value: decisionRoom.dueDate },
          ]}
          objectTitle={decisionRoom.title}
          objectType="Decision detail"
          routeId="044"
          safetyNote="Decision submission is not client acceptance; compliance and evidence controls remain authoritative."
          status="Ready to decide"
          timelineItems={["Released package available", "Decision review open", "Audit persistence required"]}
        />
        <DecisionRecordTraceabilityCard />
        <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
          <section className="min-w-0 space-y-5">
            <StatePanel detail="Until released, this decision and related materials are confidential and not visible to the client. No unapproved advice reaches the client." state="restricted" title="Content is client-visible only after Compliance Release" />
            <Card>
              <CardHeader><CardTitle>{decisionRoom.title}</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-5">
                <InfoRow label="Client" value={decisionRoom.client} />
                <InfoRow label="Portfolio" value={decisionRoom.portfolio} />
                <InfoRow label="Decision Owner" value={decisionRoom.owner} />
                <InfoRow label="Due Date" value={decisionRoom.dueDate} />
                <InfoRow label="Impact" value={decisionRoom.impact} />
              </CardContent>
            </Card>
            <div className="grid gap-5 xl:grid-cols-[1fr_0.65fr]">
              <Card>
                <CardHeader><CardTitle>Situation Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-alphavest-muted">{decisionRoom.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Current allocation: see analysis", "Target allocation: option 1", "Impact: +0.35% return", "Turnover: 18%", "Recommendation: option 1"].map((item) => (
                      <Badge className="h-auto min-h-[var(--status-chip-height)] max-w-full whitespace-normal py-1 leading-4" key={item} tone="gold">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Risks</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Market Risk", "Medium-High", 82],
                    ["Interest Rate Risk", "Medium", 58],
                    ["Liquidity Risk", "Medium", 52],
                    ["Concentration Risk", "Low-Medium", 36]
                  ].map(([label, value, progress]) => (
                    <div className="grid grid-cols-[1fr_7rem] items-center gap-3 text-sm" key={label}>
                      <span className="text-alphavest-muted">{label}</span>
                      <div><p className="text-alphavest-gold">{value}</p><ProgressBar value={Number(progress)} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle>Options</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {decisionOptions.map((option) => (
                  <div className={cn("grid gap-3 rounded-md border p-3 text-sm md:grid-cols-[1fr_1.4fr_repeat(3,6rem)]", option.recommended ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={option.label}>
                    <span className="font-semibold text-alphavest-ivory">{option.label}{option.recommended ? <span className="block text-xs text-alphavest-gold">Recommended</span> : null}</span>
                    <span className="text-alphavest-muted">{option.description}</span>
                    <span className="text-alphavest-green">{option.estimatedReturn}</span>
                    <span>{option.risk}</span>
                    <span>{option.turnover}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Decision Actions</CardTitle></CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-4">
                <button
                  className={secondaryButtonClass}
                  data-testid="j03-request-more-information"
                  onClick={() => {
                    openDecisionConfirmation("request_more_information");
                  }}
                  type="button"
                >
                  <MessageSquare aria-hidden="true" className="size-4" />Request More Information
                </button>
                <button
                  className={secondaryButtonClass}
                  data-testid="j03-defer-decision"
                  onClick={() => {
                    openDecisionConfirmation("defer");
                  }}
                  type="button"
                >
                  <Calendar aria-hidden="true" className="size-4" />Defer
                </button>
                <button
                  className={destructiveButtonClass}
                  data-testid="j03-reject-decision"
                  onClick={() => {
                    openDecisionConfirmation("reject");
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />Reject
                </button>
                <button
                  className={primaryButtonClass}
                  data-testid="j03-accept-option"
                  onClick={() => {
                    openDecisionConfirmation("accept");
                  }}
                  type="button"
                >
                  <Check aria-hidden="true" className="size-4" />Accept Option 1
                </button>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <StatePanel detail="Your permissions or approval role may restrict access or actions." state="restricted" title="Access may be blocked" />
            <Card>
              <CardHeader><CardTitle>Linked Documents</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Investment committee memo", "Portfolio analysis report", "Risk assessment report", "Cash flow forecast"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Approvals</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {decisionApprovals.map((approval) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={approval.actor}>
                    <span className="text-alphavest-muted">{approval.actor}<span className="block text-xs">{approval.role}</span></span>
                    <Badge tone="green">{approval.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
        <Modal
          className="max-w-[48rem]"
          context={
            <div className="grid gap-2 text-sm">
              <p className="font-semibold text-alphavest-ivory">Client decision action</p>
              <p className="text-alphavest-muted">Decision submission records the selected client decision action only after the released package, permission and audit gates are available.</p>
            </div>
          }
          description="Decision confirmation is required before this action can persist."
          footer={
            <>
              <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={resetAndCloseDecision} type="button">Cancel</button>
              <button
                className={activeAction?.tone === "destructive" ? destructiveButtonClass : activeAction?.tone === "primary" ? primaryButtonClass : secondaryButtonClass}
                data-testid="j03-confirm-decision"
                data-ux-lifecycle-result={decisionValid ? "submits-audited-client-decision" : "blocked-validation-required"}
                disabled={!decisionValid || status === "submitting" || status === "success"}
                onClick={() => {
                  void submitDecisionAction();
                }}
                type="button"
              >
                {status === "submitting" ? "Submitting..." : activeAction?.label ?? "Confirm decision"}
              </button>
            </>
          }
          onClose={status === "submitting" ? undefined : resetAndCloseDecision}
          open={pendingAction !== null}
          title="Confirm client decision"
        >
          <div
            className="space-y-4"
            data-testid="uxp3-decision-confirmation-lifecycle"
            data-ux-decision-action={pendingAction ?? "none"}
            data-ux-lifecycle-status={lifecycleStatus}
            data-ux-lifecycle-validation={validationState}
            data-ux-no-overclaim="true"
          >
            <StatePanel
              detail="Cancel closes this dialog without calling the workflow API. Invalid input keeps submit disabled."
              state="restricted"
              title="Decision confirmation required"
            />
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Selected action</p>
              <p className="mt-2 font-semibold text-alphavest-ivory">{activeAction?.label ?? "No action selected"}</p>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">This action records decision state only. It does not create advice, bypass compliance release, complete evidence review or approve export/download/share.</p>
            </div>
            <p className="sr-only" id="decision-confirmation-validation">{validationMessage}</p>
            <label className="flex items-start gap-3 text-sm text-alphavest-muted">
              <input
                aria-describedby="decision-confirmation-validation"
                checked={acknowledged}
                className="mt-1"
                disabled={status === "submitting" || status === "success"}
                onChange={(event) => setAcknowledged(event.target.checked)}
                type="checkbox"
              />
              <span>I understand this records a client decision action and writes an audit event; it does not bypass compliance, evidence or export controls.</span>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Type {requiredPhrase}</span>
              <input
                aria-describedby="decision-confirmation-validation"
                className={inputClass}
                data-testid="j03-decision-confirmation"
                disabled={status === "submitting" || status === "success"}
                onChange={(event) => setConfirmationText(event.target.value)}
                value={confirmationText}
              />
            </label>
            {status === "idle" ? (
              <StatePanel
                detail={validationMessage}
                state={decisionValid ? "validation" : "blocked"}
                testId="j03-decision-validation-state"
                title={decisionValid ? "Decision confirmation valid" : "Decision confirmation blocked"}
              />
            ) : null}
            {status === "submitting" ? (
              <StatePanel
                detail={message ?? "Submitting the audited client decision action."}
                state="loading"
                testId="j03-decision-loading-state"
                title="Decision action submitting"
              />
            ) : null}
            {status === "success" ? (
              <StatePanel
                detail={message ?? "Decision action recorded only through the released decision workflow; compliance release, evidence sufficiency, export/download/share and follow-up advice remain separate controls."}
                state="success"
                testId="j03-decision-success-state"
                title="Decision action recorded"
              />
            ) : null}
            {status === "error" ? (
              <StatePanel
                detail={message ?? "No decision mutation, release change or client visibility change was completed."}
                state="blocked"
                testId="j03-decision-error-state"
                title="Decision action failed"
              />
            ) : null}
          </div>
        </Modal>
      </div>
    </Phase12Shell>
  );
}

function DecisionSuccessPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="045">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[92rem] space-y-6">
        <section className="grid gap-6 lg:grid-cols-[14rem_1fr]">
          <div className="grid size-40 place-items-center rounded-full border border-alphavest-gold/45 bg-alphavest-green/10">
            <Check aria-hidden="true" className="size-20 text-alphavest-gold" />
          </div>
          <div>
            <h2 className="font-display text-5xl text-alphavest-ivory">{title}</h2>
            <p className="mt-2 text-lg text-alphavest-gold">The decision has been recorded for review. Audit persistence remains a controlled gate.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <InfoRow label="Decision ID" value={decisionSuccess.decisionId} />
              <InfoRow label="Client" value={decisionSuccess.client} />
              <InfoRow label="Submitted By" value={decisionSuccess.submittedBy} />
              <InfoRow label="Submitted On" value={decisionSuccess.submittedOn} />
            </div>
          </div>
        </section>
        <Card className="border-alphavest-gold/45 bg-alphavest-green/10">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-2xl text-alphavest-ivory">Recorded for Review</p>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">This decision record has a persisted audit reference. Compliance release and evidence controls remain the source of client visibility.</p>
            </div>
            <Badge tone="green">Audit persisted</Badge>
          </CardContent>
        </Card>
        <ScfP07P09TrustPanel mode="decision" />
        <UxDetailStandardPanel
          actionLabel="Review submitted decision and linked evidence"
          actionState="The submitted state records decision evidence; it does not expand client acceptance or release authority."
          evidenceItems={["Persisted audit record", "Evidence package queued", "Review schedule"]}
          facts={[
            { label: "Decision ID", value: decisionSuccess.decisionId },
            { label: "Client", value: decisionSuccess.client },
            { label: "Submitted by", value: decisionSuccess.submittedBy },
            { label: "Audit event", value: decisionSuccess.auditEventId },
          ]}
          objectTitle={decisionSuccess.type}
          objectType="Decision submitted detail"
          routeId="045"
          safetyNote="Evidence sufficiency still requires review and release gates after submission."
          status="Recorded for review"
          timelineItems={["Decision submitted", "Audit persisted", "Evidence package queued"]}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Persisted Audit Record</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Audit Event" value={decisionSuccess.auditEventId} />
              <InfoRow label="Previous State" value={decisionSuccess.auditPreviousState} />
              <InfoRow label="Next State" value={decisionSuccess.auditNextState} />
              <InfoRow label="Result" value={decisionSuccess.auditResult} />
              <p className="pt-2 text-sm leading-6 text-alphavest-muted">{decisionSuccess.auditReason}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Evidence Package Queued</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-alphavest-muted">An evidence package reference has been queued for this decision. Evidence sufficiency still requires review and release gates.</p>
              <p className="mt-6 text-xl font-semibold text-alphavest-ivory">{decisionSuccess.evidenceId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Review Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Next Review" value={decisionSuccess.nextReview} />
              <InfoRow label="Review Cadence" value="Annually" />
              <InfoRow label="Reviewer" value={decisionSuccess.reviewer} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Decision Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Decision Type" value={decisionSuccess.type} />
              <InfoRow label="Scope" value="Portfolio Level" />
              <InfoRow label="Impact" value="Moderate" />
              <InfoRow label="Status" value="Active" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-2xl text-alphavest-ivory">Next Steps</p>
              <p className="text-sm text-alphavest-muted">Continue working or return to the Decisions list.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <span className={secondaryButtonClass} data-ux-affordance="static-control-note" data-ux-interactive="false">Decision list scoped</span>
              <button
                className={primaryButtonClass}
                data-testid="j03-view-evidence-record"
                onClick={() => {
                  void runScreencastDemoAction("j03.viewEvidenceRecord", "/evidence/demo");
                }}
                type="button"
              >
                View Evidence Record
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Phase12Shell>
  );
}

const evidenceColumns: Array<DataTableColumn<(typeof evidenceRows)[number]>> = [
  { key: "title", header: "Evidence", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.title}<span className="block text-xs text-alphavest-muted">{row.type}</span></span> },
  { key: "client", header: "Client / Account", render: (row) => row.client },
  { key: "category", header: "Category", render: (row) => <Badge tone="gold">{row.category}</Badge> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "updated", header: "Updated", render: (row) => row.updated }
];

function EvidenceVaultPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer");
  const [drawerStatus, setDrawerStatus] = useState<"closed" | "loading" | "ready">(visualState === "drawer" ? "ready" : "closed");
  const drawerLifecycleStatus = drawerStatus === "ready" ? "success" : drawerStatus;
  const drawerValidation = drawerOpen ? "blocked-client-visibility-gates" : "closed";

  function openEvidenceDrawer() {
    setDrawerOpen(true);
    setDrawerStatus("loading");
    window.setTimeout(() => {
      setDrawerStatus((currentStatus) => currentStatus === "loading" ? "ready" : currentStatus);
    }, 120);
  }

  function closeEvidenceDrawer() {
    setDrawerOpen(false);
    setDrawerStatus("closed");
  }

  return (
    <Phase12Shell activePageId="046">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        className={drawerOpen ? "pr-0 xl:pr-[23rem]" : ""}
        description="Evidence repository context with download, share and client visibility still gated."
        eyebrow="WP02 Evidence"
        primary={
          <div className="space-y-5">
            <UxHubPage pageId="046" />
            <PageHeading
              action={
                <button
                  className={primaryButtonClass}
                  data-testid="j03-open-evidence-drawer"
                  data-ux-lifecycle-result="opens-evidence-drawer"
                  data-ux-lifecycle-trigger="evidence-drawer"
                  onClick={openEvidenceDrawer}
                  type="button"
                >
                  Open Selected Evidence
                </button>
              }
              badge={<ShieldCheck aria-hidden="true" className="size-5 text-alphavest-gold" />}
              subtitle="Secure, role-based repository for client evidence and attestations."
              title={title}
            />
            <ScfP04P06FlowPanel mode="evidence" />
            <div className="flex flex-wrap gap-2 border-b border-alphavest-border/70">
              {["All Evidence", "By Category", "Expiring Soon 12", "Needs Review 5"].map((tab, index) => (
                <span className={cn("px-3 pb-3 text-sm font-semibold", index === 0 ? "border-b-2 border-alphavest-gold text-alphavest-gold" : "text-alphavest-muted")} key={tab}>{tab}</span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(14rem,1fr)_repeat(4,minmax(9rem,10rem))_auto]">
              <label className="relative min-w-0 sm:col-span-2 lg:col-span-1">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input className="h-11 w-full cursor-not-allowed rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm opacity-65 outline-none focus:border-alphavest-gold" disabled placeholder="Evidence search unavailable" title="Evidence list filters are not wired in this release." />
              </label>
              {["Category", "Evidence Type", "Status", "Date Range"].map((filter) => (
                <button aria-label={`${filter} filter is static in this evidence list`} className="flex h-11 min-w-0 cursor-not-allowed items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted opacity-65" disabled key={filter} title="Evidence list filters are not wired in this release." type="button">
                  <span className="truncate">{filter}</span>
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                </button>
              ))}
              <button aria-label="Additional evidence filters are not wired in this release" className={secondaryButtonClass} disabled title="Evidence list filters are not wired in this release." type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
            </div>
            <DataTable columns={evidenceColumns} getRowId={(row) => row.title} rows={evidenceRows} />
          </div>
        }
        rail={drawerOpen ? undefined : <EvidenceControlRail />}
        routeId="046"
        safetyNote="Evidence vault context cannot authorize download, share, export or client visibility without release controls."
        statusItems={[
          { label: "Route", tone: "blue", value: "046" },
          { label: "Visibility", tone: "gold", value: "controlled" },
        ]}
        title={title}
        worksurfaceId="evidence-vault"
      />
      <Drawer
        description="Verified form assessment."
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={secondaryButtonClass} onClick={closeEvidenceDrawer} type="button">Cancel</button>
            <button
              className={primaryButtonClass}
              data-testid="j03-evidence-download-blocked"
              data-ux-lifecycle-result="blocked-client-visibility-gates"
              disabled
              title="Download remains blocked until evidence sufficiency, release and export/share gates pass."
              type="button"
            >
              <Download aria-hidden="true" className="size-4" />Download blocked
            </button>
          </div>
        }
        onClose={closeEvidenceDrawer}
        open={drawerOpen}
        title="Risk Tolerance Questionnaire"
      >
        <div
          className="space-y-5"
          data-testid="uxp3-evidence-drawer-lifecycle"
          data-ux-lifecycle-status={drawerLifecycleStatus}
          data-ux-lifecycle-submit="blocked-no-authorized-download-action"
          data-ux-lifecycle-validation={drawerValidation}
          data-ux-no-overclaim="true"
        >
          {drawerStatus === "loading" ? (
            <StatePanel
              detail="Loading the selected evidence context. Download, share and client visibility controls remain blocked while context is checked."
              state="loading"
              testId="j03-evidence-loading-state"
              title="Evidence context loading"
            />
          ) : null}
          {drawerStatus === "ready" ? (
            <StatePanel
              detail="Evidence context is loaded for review only. This does not complete evidence review, release content, export/download/share approval or client acceptance."
              state="success"
              testId="j03-evidence-success-state"
              title="Evidence context ready"
            />
          ) : null}
          <StatePanel
            detail="Internal and advisor visibility only. Download and share remain blocked until evidence sufficiency, compliance release, export approval and client visibility gates pass."
            state="blocked"
            testId="j03-evidence-blocked-state"
            title="Controlled visibility"
          />
          <UxSecondaryContextTabs
            safetyNote="Drawer tabs expose evidence context only; they do not complete evidence review or compliance acceptance."
            tabs={[
              {
                content: (
                  <div className="space-y-3">
                    <InfoRow label="Client / Account" value="Johnson Family" />
                    <InfoRow label="Category" value="Suitability" />
                    <InfoRow label="Evidence Type" value="Form assessment" />
                    <InfoRow label="Date Completed" value="May 13, 2025" />
                    <InfoRow label="Next Review" value="May 13, 2026" />
                  </div>
                ),
                id: "summary",
                label: "Summary",
              },
              {
                content: (
                  <div className="space-y-3">
                    {["Investment policy statement", "Client profile - Johnson Family"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}
                  </div>
                ),
                id: "linked-documents",
                label: "Linked documents",
              },
              {
                content: (
                  <div className="space-y-3">
                    <InfoRow label="Owners" value="AC, SL, +1" />
                    <InfoRow label="Internal roles" value="Advisors, Compliance" />
                    <InfoRow label="Client visibility" value="Advisors and internal only" />
                  </div>
                ),
                id: "access",
                label: "Access",
                tone: "warning",
              },
            ]}
            title="Secondary evidence context"
          />
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

function EvidenceRecordDetailPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="047">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        description="Evidence record detail for provenance, linkage and access context, kept separate from sufficiency and release."
        eyebrow="WP02 Evidence"
        primary={
          <>
            <Phase5DetailSplitPanel decisionSupport="Evidence detail explains provenance, linkage and visibility before any next action." objectLabel="Evidence object review" objectState="Verified record; sufficiency still contextual" pageJob="Evidence detail supports object understanding without overloading evidence hub or document queue." safetyBoundary="Evidence detail cannot imply upload sufficiency or client release." splitTaskId="UX-PAGE-SPLIT-002" taskId="UX-DETAIL-001" />
            <div className="space-y-5">
              <PageHeading
                action={
                  <UxCtaCluster
                    blockedReason="Share remains blocked until evidence sufficiency, compliance release and payload visibility checks pass."
                    primary={{ label: "Open" }}
                    recoveryAction={{ href: "/documents/upload", label: "Request review" }}
                    secondary={[
                      { label: "Download", onClick: () => { void runScreencastDemoAction("j03.downloadEvidence"); }, testId: "j03-download-evidence" },
                      {
                        disabled: true,
                        disabledReason: "Share needs evidence sufficiency, release and payload checks first.",
                        label: "Share",
                      },
                    ]}
                  />
                }
                badge={<Badge tone="green">Verified</Badge>}
                subtitle="Complete evidence record with provenance, access and audit information."
                title={title}
              />
              <ScfP04P06FlowPanel mode="evidence" />
              <UxDetailStandardPanel
                actionLabel="Inspect controlled evidence"
                actionState="Open, download or share actions remain role-scoped and must not imply evidence sufficiency."
                evidenceItems={["Evidence summary", "Access permissions", "Linked decisions"]}
                facts={[
                  { label: "Evidence ID", value: evidenceRecord.evidenceId },
                  { label: "Client", value: evidenceRecord.client },
                  { label: "Version", value: evidenceRecord.version },
                  { label: "Owner", value: evidenceRecord.owner },
                ]}
                objectTitle={evidenceRecord.title}
                objectType="Evidence record detail"
                routeId="047"
                safetyNote="Upload, storage or download visibility is not evidence sufficiency or compliance acceptance."
                status="Verified"
                timelineItems={evidenceTimeline.slice(0, 3).map((item) => item.title)}
              />
              <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
          <section className="space-y-5">
            <Card>
              <CardContent className="grid gap-5 md:grid-cols-[9rem_1fr_1fr_1fr]">
                <IconTile tone="red"><FileText aria-hidden="true" className="size-7" /></IconTile>
                <div>
                  <p className="font-display text-2xl text-alphavest-ivory">{evidenceRecord.title}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">Quarterly consolidated statement for AlphaVest managed accounts.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Client Statements", "Financial Statement", "Q1 2024", "Confidential"].map((tag) => <Badge key={tag} tone="muted">{tag}</Badge>)}
                  </div>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Evidence ID" value={evidenceRecord.evidenceId} />
                  <InfoRow label="Version" value={evidenceRecord.version} />
                  <InfoRow label="Status" value="Active" />
                  <InfoRow label="Owner" value={evidenceRecord.owner} />
                </div>
                <div className="space-y-3">
                  <InfoRow label="Client" value={evidenceRecord.client} />
                  <InfoRow label="Related Decision" value={evidenceRecord.relatedDecision} />
                  <InfoRow label="Created" value={evidenceRecord.created} />
                  <InfoRow label="Last Updated" value="May 02, 2024 11:23 AM" />
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-5 xl:grid-cols-[0.85fr_0.95fr_1.1fr]">
              <Card>
                <CardHeader><CardTitle>Evidence Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Evidence Type" value="Financial Statement" />
                  <InfoRow label="Source" value="AlphaVest PMS" />
                  <InfoRow label="Pages" value="12" />
                  <InfoRow label="Integrity" value={evidenceRecord.integrity} />
                  <InfoRow label="Retention Policy" value={evidenceRecord.retention} />
                </CardContent>
              </Card>
              <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
                  <AuditTimeline items={[...evidenceTimeline]} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-md border border-alphavest-border bg-alphavest-ivory p-6 text-alphavest-navy">
                    <p className="font-display text-2xl">AlphaVest</p>
                    <p className="mt-6 text-sm font-semibold">Client Statement Q1 2024</p>
                    <div className="mt-5 space-y-2 text-xs">
                      {["Portfolio overview", "Total market value", "Quarterly change", "Asset allocation"].map((line) => <div className="rounded bg-slate-200 px-3 py-2" key={line}>{line}</div>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          <aside className="space-y-5">
            <StatePanel detail="Only authorized users and roles can access this evidence." state="restricted" title="Access and Permissions" />
            <Card>
              <CardHeader><CardTitle>At a Glance</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Access Events" value="15" />
                <InfoRow label="Linked Decisions" value="2" />
                <InfoRow label="Audit Events" value="23" />
                <InfoRow label="Version" value={evidenceRecord.version} />
                <InfoRow label="Classification" value="Confidential" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <UxCtaCluster
                  blockedReason="Revoke access and create-version actions are secondary and cannot complete sufficiency review or access authority."
                  className="[&_button]:w-full [&_button]:justify-start"
                  primary={{ label: "Request Review" }}
                  recoveryAction={{ href: "/governance/access-requests/:id", label: "Open access policy" }}
                  secondary={[
                    { label: "Add to Collection" },
                    {
                      disabled: true,
                      disabledReason: "Revocation needs a scoped access decision and persisted audit event.",
                      label: "Revoke Access",
                    },
                    {
                      disabled: true,
                      disabledReason: "New versions need evidence review; versioning cannot complete sufficiency review.",
                      label: "Create New Version",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </aside>
              </div>
            </div>
          </>
        }
        rail={<EvidenceControlRail />}
        routeId="047"
        safetyNote="Evidence detail can show provenance and access context only; sufficiency, export and client release remain separate controls."
        statusItems={[
          { label: "Route", tone: "blue", value: "047" },
          { label: "Record", tone: "green", value: "verified context" },
        ]}
        title={title}
        worksurfaceId="evidence-record-detail"
      />
    </Phase12Shell>
  );
}

const userColumns: Array<DataTableColumn<(typeof governanceUsers)[number]>> = [
  { key: "name", header: "User", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}<span className="block text-xs text-alphavest-muted">{row.email}</span></span>, sortable: true },
  { key: "role", header: "Role(s)", render: (row) => row.role, sortable: true },
  { key: "access", header: "Entity Access", render: (row) => row.access },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true },
  { key: "lastActive", header: "Last Active", render: (row) => row.lastActive, sortable: true },
  { key: "mfa", header: "MFA", render: (row) => <Badge tone={toneFor(row.mfa)}>{row.mfa}</Badge> }
];

function GovernanceUsersPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "invite");
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = acknowledged ? "valid-scoped-invite" : "blocked-acknowledgement-required";

  function openGovernanceUserDrawer() {
    setDrawerOpen(true);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  function closeGovernanceUserDrawer() {
    setDrawerOpen(false);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  async function submitGovernanceUserInvite() {
    if (!acknowledged || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Submitting the scoped governance invitation. Close and cancel are blocked until the workflow returns.");

    try {
      const body = await runScreencastDemoAction("j07.sendInvitation");
      setStatus("success");
      setMessage(
        body.result?.auditEventId
          ? `Audit recorded: ${body.result.auditEventId}. The invitation was routed through the existing scoped governance workflow; role activation, consent acceptance, evidence sufficiency, release and export/share remain separate controls.`
          : "The invitation was routed through the existing scoped governance workflow; role activation, consent acceptance, evidence sufficiency, release and export/share remain separate controls.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No scoped role activation, access expansion, release or client visibility change was completed.`
          : "Invitation workflow failed without scoped role activation, access expansion, release or client visibility change.",
      );
    }
  }

  return (
    <Phase12Shell activePageId="048">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase5DetailSplitPanel decisionSupport="Governance hub stays separate from access-request and audit detail work." objectLabel="Governance hub split" objectState="Permission operations overview" pageJob="Governance hub routes to user, role, access request and audit surfaces." safetyBoundary="Governance hub cannot mutate scoped permissions without explicit review." splitTaskId="UX-PAGE-SPLIT-006" taskId="UX-PAGE-SPLIT-006" />
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <UxHubPage pageId="048" />
        <PageHeading
          action={
            <button
              className={primaryButtonClass}
              data-testid="j07-invite-user"
              data-ux-lifecycle-result="opens-governance-user-drawer"
              data-ux-lifecycle-trigger="governance-user-drawer"
              onClick={() => {
                openGovernanceUserDrawer();
              }}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />Invite scoped user
            </button>
          }
          subtitle="Manage platform access, roles and user permissions."
          title={title}
        />
        <ScfP07P09TrustPanel mode="governance" />
        <GovernanceCapabilityBoundary />
        <div className="grid gap-3 md:grid-cols-5">
          {governanceMetrics.map((metric) => (
            <Card key={metric.label}>
              <p className="text-sm text-alphavest-muted">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
              <p className="text-xs text-alphavest-subtle">{metric.detail}</p>
            </Card>
          ))}
        </div>
        <UxDenseOperationsPanel
          actions={<span className={secondaryButtonClass} data-ux-affordance="static-control-note" data-ux-interactive="false"><Download aria-hidden="true" className="size-4" />User-list export held</span>}
          controls={["Search user", "Role", "Status", "MFA", "Entity access", "Last active"]}
          description="User access stays in a compact operations table so role, MFA and entity scope can be compared without admin bypass."
          pageId="048"
          resultLabel={`${governanceUsers.length} governed users`}
          safetyNote="Admin visibility does not expand role, object, payload, evidence, export or release authority."
          title="User access operations"
        >
          <DataTable
            columns={userColumns}
            compact
            getRowId={(row) => row.email}
            onSortChange={handleStaticSortChange}
            responsiveMode="table"
            rows={governanceUsers}
            sortDirection="asc"
            sortKey="name"
          />
        </UxDenseOperationsPanel>
      </div>
      <Drawer
        description="Invite a user and assign scoped roles."
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeGovernanceUserDrawer} type="button">Cancel</button>
            <button
              className={primaryButtonClass}
              data-testid="j07-send-invitation"
              data-ux-lifecycle-result={acknowledged ? "submits-scoped-governance-invite" : "blocked-validation-required"}
              disabled={!acknowledged || status === "submitting" || status === "success"}
              onClick={() => {
                void submitGovernanceUserInvite();
              }}
              type="button"
            >
              <Send aria-hidden="true" className="size-4" />{status === "submitting" ? "Sending..." : "Send scoped invitation"}
            </button>
          </div>
        }
        onClose={status === "submitting" ? undefined : closeGovernanceUserDrawer}
        open={drawerOpen}
        title="Invite New User"
      >
        <div
          className="space-y-5"
          data-testid="uxp3-governance-user-drawer-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={validationState}
          data-ux-no-overclaim="true"
        >
          <StatePanel detail="Role assignment changes access only after scoped governance workflow submission. It cannot release advice, complete evidence review, approve exports or suppress audit." state="restricted" title="Sensitive access" />
          <label className="flex items-start gap-3 text-sm text-alphavest-muted">
            <input
              checked={acknowledged}
              className="mt-1"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setAcknowledged(event.target.checked)}
              type="checkbox"
            />
            <span>I understand this creates only a scoped invitation request; role activation, consent acceptance, audit review, release and export controls remain separate.</span>
          </label>
          {status === "idle" ? (
            <StatePanel
              detail={acknowledged ? "Scoped invitation can be submitted through the existing governance workflow." : "Invitation remains blocked until the scoped-access acknowledgement is checked."}
              state={acknowledged ? "validation" : "blocked"}
              testId="j07-governance-user-validation-state"
              title={acknowledged ? "Governance invite valid" : "Governance invite blocked"}
            />
          ) : null}
          {status === "submitting" ? (
            <StatePanel
              detail={message ?? "Submitting the scoped governance invitation."}
              state="loading"
              testId="j07-governance-user-loading-state"
              title="Governance invite submitting"
            />
          ) : null}
          {status === "success" ? (
            <StatePanel
              detail={message ?? "The invitation was routed through the existing scoped governance workflow; role activation, consent acceptance, evidence sufficiency, release and export/share remain separate controls."}
              state="success"
              testId="j07-governance-user-success-state"
              title="Governance invite routed"
            />
          ) : null}
          {status === "error" ? (
            <StatePanel
              detail={message ?? "Invitation workflow failed without scoped role activation, access expansion, release or client visibility change."}
              state="error"
              testId="j07-governance-user-error-state"
              title="Governance invite failed"
            />
          ) : null}
          <UxSecondaryContextTabs
            safetyNote="Role details are secondary drawer context; invitation and access authority remain constrained by RBAC and audit logging."
            tabs={[
              {
                content: (
                  <div className="space-y-4">
                    <Field label="Full Name" value="Alex Morgan" />
                    <Field label="Email Address" value="alex.morgan@example.test" />
                  </div>
                ),
                id: "identity",
                label: "Identity",
              },
              {
                content: (
                  <div className="space-y-3">
                    {["Investment Manager", "Analyst"].map((role, index) => (
                      <div className={cn("rounded-md border p-4", index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={role}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-alphavest-ivory">{role}</p>
                          <Badge tone={index === 0 ? "gold" : "muted"}>{index === 0 ? "Sensitive" : "Optional"}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-alphavest-muted">{index === 0 ? "Can manage investments, view performance and execute transactions." : "Can view data, run reports and perform analysis."}</p>
                      </div>
                    ))}
                  </div>
                ),
                id: "roles",
                label: "Roles",
                tone: "warning",
              },
            ]}
            title="Secondary user-invite context"
          />
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-alphavest-muted">{label}</span>
      <input className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" readOnly value={value} />
    </label>
  );
}

const governanceCapabilities = [
  "Invite or route scoped users",
  "Review role and access requests",
  "Confirm sensitive role changes",
  "View source-backed governance audit history",
] as const;

const governanceDoesNotGrant = [
  "Release advice to clients",
  "Mark evidence review complete",
  "Approve export or download packages",
  "Suppress audit or client-visibility gates",
] as const;

function GovernanceCapabilityBoundary({ compact = false }: { compact?: boolean }) {
  return (
    <Card data-testid="wp09-governance-capability-boundary">
      <CardHeader>
        <CardTitle>Governance capability boundary</CardTitle>
        <CardDescription>Admin power is configuration-scoped; route access is not advisory payload or release authority.</CardDescription>
      </CardHeader>
      <CardContent className={cn("grid gap-3", compact ? "md:grid-cols-1" : "md:grid-cols-2")}>
        <div className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-green">Allowed governance actions</p>
          <ul className="mt-3 space-y-2 text-sm text-alphavest-muted">
            {governanceCapabilities.map((item) => (
              <li className="flex gap-2" key={item}>
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-red">Does not grant</p>
          <ul className="mt-3 space-y-2 text-sm text-alphavest-muted">
            {governanceDoesNotGrant.map((item) => (
              <li className="flex gap-2" key={item}>
                <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function RoleManagementPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "confirm");
  const [modalOpen, setModalOpen] = useState(visualState === "confirm");
  const [drawerAcknowledged, setDrawerAcknowledged] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const requiredPhrase = "CONFIRM ROLE CHANGE";
  const roleChangeValid = drawerAcknowledged && confirmationText.trim() === requiredPhrase;
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const drawerValidation = drawerAcknowledged ? "valid-scoped-role-review" : "blocked-acknowledgement-required";
  const modalValidation = roleChangeValid
    ? "valid-second-confirmation"
    : !drawerAcknowledged
      ? "blocked-drawer-acknowledgement-required"
      : "blocked-exact-phrase-required";

  function openRoleDrawer() {
    setDrawerOpen(true);
    setModalOpen(false);
    setDrawerAcknowledged(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  function closeRoleDrawer() {
    setDrawerOpen(false);
    setModalOpen(false);
    setDrawerAcknowledged(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  function openRoleConfirmation() {
    if (!drawerAcknowledged) {
      setMessage("Review remains blocked until the scoped-role acknowledgement is checked.");
      return;
    }

    setModalOpen(true);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  function closeRoleConfirmation() {
    setModalOpen(false);
    setConfirmationText("");
    setStatus("idle");
    setMessage(null);
  }

  async function submitRoleConfirmation() {
    if (!roleChangeValid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Checking the existing role-change workflow. Close and cancel are blocked until the request resolves.");

    try {
      const body = await runScreencastDemoAction("j07.saveRoleChanges");
      setStatus("success");
      setMessage(
        body.result?.auditEventId
          ? `Audit recorded: ${body.result.auditEventId}. Scoped role-change review was routed through the existing workflow; role activation, access expansion, release, evidence sufficiency and export/share remain separate controls.`
          : "Scoped role-change review was routed through the existing workflow; role activation, access expansion, release, evidence sufficiency and export/share remain separate controls.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No scoped role activation, access expansion, release or client visibility change was completed.`
          : "Role-change workflow failed without scoped role activation, access expansion, release or client visibility change.",
      );
    }
  }

  return (
    <Phase12Shell activePageId="049">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={
            <button
              className={primaryButtonClass}
              data-testid="j07-open-role-drawer"
              data-ux-lifecycle-result="opens-role-drawer"
              data-ux-lifecycle-trigger="role-drawer"
              onClick={openRoleDrawer}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />Create scoped role
            </button>
          }
          subtitle="Define roles and manage permissions across WealthOS."
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Total Roles", "12", "Active roles"],
            ["Custom Roles", "7", "Configured by you"],
            ["Sensitive Permissions", "18", "Across 5 roles"],
            ["Last Updated", "May 12, 2025", "By Sofia Shah"]
          ].map(([label, value, detail]) => (
            <Card key={label}><p className="text-sm text-alphavest-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-alphavest-ivory">{value}</p><p className="text-xs text-alphavest-subtle">{detail}</p></Card>
          ))}
        </div>
        <UxDenseOperationsPanel
          controls={["Role", "Clients", "Accounts", "Investments", "Trading", "Reporting", "Billing", "Sensitive changes"]}
          description="Role permissions remain a dense comparison table; confirmation and audit gates stay outside the matrix."
          pageId="049"
          resultLabel={`${roleRows.length} roles; 3 sensitive changes pending confirmation`}
          safetyNote="Role edits cannot bypass scoped permissions, second confirmation or audit persistence."
          title="Role-permission operations"
        >
          <RoleMatrix />
        </UxDenseOperationsPanel>
        <GovernanceCapabilityBoundary />
      </div>
      <Drawer
        description="Custom role with sensitive permission changes."
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeRoleDrawer} type="button">Discard changes</button>
            <button
              className={primaryButtonClass}
              data-testid="j07-review-role-changes"
              data-ux-lifecycle-result={drawerAcknowledged ? "opens-second-confirmation" : "blocked-validation-required"}
              disabled={!drawerAcknowledged || status === "submitting"}
              onClick={openRoleConfirmation}
              type="button"
            >
              Review scoped changes
            </button>
          </div>
        }
        onClose={status === "submitting" ? undefined : closeRoleDrawer}
        open={drawerOpen}
        title="Portfolio Manager"
      >
        <div
          className="space-y-5"
          data-testid="uxp3-role-drawer-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={drawerValidation}
          data-ux-no-overclaim="true"
        >
          <StatePanel detail="Sensitive permission changes stay role-scoped and require confirmation plus audit logging. Second confirmation and audit workflow checks are still required; drawer context alone cannot activate roles or expand access." state="restricted" title="Sensitive permission change" />
          <GovernanceCapabilityBoundary compact />
          <label className="flex items-start gap-3 text-sm text-alphavest-muted">
            <input
              checked={drawerAcknowledged}
              className="mt-1"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setDrawerAcknowledged(event.target.checked)}
              type="checkbox"
            />
            <span>I understand these role changes remain pending until second confirmation and audit workflow checks pass.</span>
          </label>
          {status === "idle" && !modalOpen ? (
            <StatePanel
              detail={drawerAcknowledged ? "Scoped role changes can move to second confirmation." : "Role review remains blocked until the scoped-role acknowledgement is checked."}
              state={drawerAcknowledged ? "validation" : "blocked"}
              testId="j07-role-drawer-validation-state"
              title={drawerAcknowledged ? "Role drawer valid" : "Role drawer blocked"}
            />
          ) : null}
          {rolePermissions.map((group) => (
            <Card key={group.group}>
              <CardHeader><CardTitle>{group.group}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {group.permissions.map((permission, index) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={permission}>
                    <span className="text-alphavest-muted">{permission}</span>
                    <Badge tone={index < 2 ? "green" : index === 2 ? "muted" : "gold"}>{index < 2 ? "Full" : index === 2 ? "None" : "Partial"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          <p className="text-sm font-semibold text-alphavest-gold">3 sensitive changes</p>
        </div>
      </Drawer>
      <Modal
        className="max-w-[34rem]"
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Portfolio Manager role</p>
            <p className="text-alphavest-muted">Second confirmation protects sensitive permissions, transaction access and client privacy.</p>
          </div>
        }
        description="You are about to save changes that modify sensitive permissions."
        footer={
          <>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeRoleConfirmation} type="button">Cancel</button>
            <button
              className={primaryButtonClass}
              data-testid="j07-save-role-changes"
              data-ux-lifecycle-result={roleChangeValid ? "submits-scoped-role-review" : "blocked-validation-required"}
              disabled={!roleChangeValid || status === "submitting" || status === "success"}
              onClick={() => {
                void submitRoleConfirmation();
              }}
              type="button"
            >
              {status === "submitting" ? "Confirming..." : "Confirm scoped role change"}
            </button>
          </>
        }
        onClose={status === "submitting" ? undefined : closeRoleConfirmation}
        open={modalOpen}
        title="Confirm Sensitive Permission Changes"
      >
        <div
          className="space-y-4"
          data-testid="uxp3-role-confirmation-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={modalValidation}
          data-ux-no-overclaim="true"
        >
          <StatePanel detail="This role change cannot release advice, mark evidence review complete, approve export or bypass audit persistence." state="restricted" title="Second confirmation required" />
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-sm text-alphavest-muted">
            <p>3 sensitive permissions modified.</p>
            <p>Affects 7 users across 2 teams.</p>
            <p>This change requires audit logging before it can be accepted.</p>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Type {requiredPhrase}</span>
            <input
              className={inputClass}
              data-testid="j07-role-confirmation-phrase"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setConfirmationText(event.target.value)}
              value={confirmationText}
            />
          </label>
          {status === "idle" ? (
            <StatePanel
              detail={roleChangeValid ? "Second confirmation is valid. Submit can route the scoped role review through the existing workflow." : "Role change remains blocked until acknowledgement and exact confirmation phrase are present."}
              state={roleChangeValid ? "validation" : "blocked"}
              testId="j07-role-confirmation-validation-state"
              title={roleChangeValid ? "Role confirmation valid" : "Role confirmation blocked"}
            />
          ) : null}
          {status === "submitting" ? (
            <StatePanel
              detail={message ?? "Checking the existing role-change workflow."}
              state="loading"
              testId="j07-role-confirmation-loading-state"
              title="Role change confirming"
            />
          ) : null}
          {status === "success" ? (
            <StatePanel
              detail={message ?? "Scoped role-change review was routed through the existing workflow; role activation, access expansion, release, evidence sufficiency and export/share remain separate controls."}
              state="success"
              testId="j07-role-confirmation-success-state"
              title="Role change review routed"
            />
          ) : null}
          {status === "error" ? (
            <StatePanel
              detail={message ?? "Role-change workflow failed without scoped role activation, access expansion, release or client visibility change."}
              state="error"
              testId="j07-role-confirmation-error-state"
              title="Role change failed"
            />
          ) : null}
        </div>
      </Modal>
    </Phase12Shell>
  );
}

function RoleMatrix() {
  return (
    <div className="overflow-x-auto rounded-md border border-alphavest-border/70">
      <table className="w-full min-w-[66rem] table-fixed border-collapse text-left text-sm" data-testid="ux-data-table">
        <thead className="bg-alphavest-panel/75 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">
          <tr>
            {["Role", "Clients", "Accounts", "Investments", "Trading", "Reporting", "Billing"].map((header) => (
              <th className="h-10 border-b border-alphavest-border/70 px-4" key={header}>
                <button
                  aria-label={`Role matrix sorting by ${header} is held until governed role workflow is selected`}
                  className="text-left uppercase disabled:cursor-not-allowed disabled:opacity-55"
                  data-testid="ux-data-table-sort"
                  data-ux-affordance="sort-control"
                  data-ux-interactive="false"
                  disabled
                  title="Role matrix sorting is held until governed role workflow is selected."
                  type="button"
                >
                  {header}
                </button>
              </th>
            ))}
            <th className="h-10 w-20 border-b border-alphavest-border/70 px-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {roleRows.map((row, index) => (
            <tr className={cn("h-[var(--table-row-height)] border-b border-alphavest-border/55 last:border-0", index === 1 ? "bg-alphavest-gold/10" : "")} key={row.role}>
              <td className="px-4 py-3 font-semibold text-alphavest-ivory">{row.role}<Badge className="ml-2" tone={toneFor(row.type)}>{row.type}</Badge></td>
              {[row.clients, row.accounts, row.investments, row.trading, row.reporting, row.billing].map((value, valueIndex) => <td className="px-4 py-3" key={`${row.role}-${valueIndex}`}><Badge tone={toneFor(value)}>{value}</Badge></td>)}
              <td className="px-4 py-3 text-right">
                <button
                  aria-label={`Role matrix actions for ${row.role} are held until governed role workflow is selected`}
                  className="ml-auto grid size-8 place-items-center rounded-md border border-transparent text-alphavest-subtle transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-border enabled:hover:text-alphavest-ivory"
                  data-testid="ux-data-table-row-action"
                  data-ux-affordance="row-action"
                  data-ux-interactive="false"
                  data-ux-row-action-state="disabled"
                  disabled
                  title="Role matrix row actions are held until governed role workflow is selected."
                  type="button"
                >
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const accessColumns: Array<DataTableColumn<(typeof accessRequests)[number]>> = [
  { key: "access", header: "Request", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.access}<span className="block text-xs text-alphavest-muted">{row.type}</span></span>, sortable: true },
  { key: "requester", header: "Requester", render: (row) => row.requester, sortable: true },
  { key: "type", header: "Requested Access", render: (row) => row.type },
  { key: "scope", header: "Affected Scope", render: (row) => row.scope },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true },
  { key: "submitted", header: "Requested", render: (row) => row.submitted, sortable: true }
];

function AccessRequestsPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "approval");
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = acknowledged ? "valid-scoped-access-review" : "blocked-acknowledgement-required";

  function openAccessRequestDrawer() {
    setDrawerOpen(true);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  function closeAccessRequestDrawer() {
    setDrawerOpen(false);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  async function submitAccessRequestApproval() {
    if (!acknowledged || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Routing the scoped access approval review. Close and cancel are blocked until the workflow returns.");

    try {
      const body = await runScreencastDemoAction("j07.approveAccess");
      setStatus("success");
      setMessage(
        body.result?.auditEventId
          ? `Audit recorded: ${body.result.auditEventId}. Scoped access approval review was routed through the existing workflow; access expansion, role activation, release, evidence sufficiency, export/share and client visibility remain separate controls.`
          : "Scoped access approval review was routed through the existing workflow; access expansion, role activation, release, evidence sufficiency, export/share and client visibility remain separate controls.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No access expansion, role activation, release or client visibility change was completed.`
          : "Access approval workflow failed without access expansion, role activation, release or client visibility change.",
      );
    }
  }

  return (
    <Phase12Shell activePageId="050">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase4WorkbenchPanel activeTask="Access request AR-204 selected" blocker="Permission change requires scoped confirmation and audit; route visibility is not mutation authority." context="Reviewer compares requested role, tenant scope and policy checks before approval." primaryAction="Approve scoped access" queueLabel="Governance access queue" safetyNote="UX-WORKBENCH-004: admin workbench cannot bypass RBAC, audit, evidence, release or export controls." taskId="UX-WORKBENCH-004" />
      <Phase5DetailSplitPanel decisionSupport="Access request detail separates requester, scope, policy and audit consequences." objectLabel="Access request object review" objectState="Policy-checked request pending" pageJob="Access detail reviews one permission request without becoming global admin bypass." safetyBoundary="Access detail cannot expand payload, evidence, release or export authority." splitTaskId="UX-PAGE-SPLIT-006" taskId="UX-PAGE-SPLIT-006" />
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={
            <button
              className={primaryButtonClass}
              data-testid="j07-open-access-request-drawer"
              data-ux-lifecycle-result="opens-access-request-drawer"
              data-ux-lifecycle-trigger="access-request-drawer"
              onClick={openAccessRequestDrawer}
              type="button"
            >
              Review policy-checked request
            </button>
          }
          subtitle="Review and take action on access requests across the organization."
          title={title}
        />
        <ScfP07P09TrustPanel mode="governance" />
        <GovernanceCapabilityBoundary />
        <UxDenseOperationsPanel
          controls={["All 24", "Pending 8", "Approved 11", "Denied 3", "Escalated 2", "SOD conflict"]}
          description="Access requests stay in queue form with policy, scope and status visible before the selected request opens."
          pageId="050"
          resultLabel={`${accessRequests.length} visible access requests`}
          safetyNote="Approval remains constrained by policy checks, segregation-of-duties checks and audit logging; admin users cannot bypass these gates."
          title="Access-request operations"
        >
          <DataTable
            columns={accessColumns}
            compact
            getRowId={(row) => `${row.requester}-${row.access}`}
            onSortChange={handleStaticSortChange}
            onRowAction={openAccessRequestDrawer}
            responsiveMode="table"
            rowActionLabel={(row) => `Review access request from ${row.requester}`}
            rows={accessRequests}
            sortDirection="desc"
            sortKey="submitted"
          />
        </UxDenseOperationsPanel>
      </div>
      <Drawer
        description="Review access request, policy checks and decision."
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeAccessRequestDrawer} type="button">Cancel review</button>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeAccessRequestDrawer} type="button">Escalate request</button>
            <button className={destructiveButtonClass} disabled={status === "submitting"} onClick={closeAccessRequestDrawer} type="button">Deny request</button>
            <button
              className={primaryButtonClass}
              data-testid="j07-approve-access"
              data-ux-lifecycle-result={acknowledged ? "submits-scoped-access-review" : "blocked-validation-required"}
              disabled={!acknowledged || status === "submitting" || status === "success"}
              onClick={() => {
                void submitAccessRequestApproval();
              }}
              type="button"
            >
              {status === "submitting" ? "Approving..." : "Approve access request"}
            </button>
          </div>
        }
        onClose={status === "submitting" ? undefined : closeAccessRequestDrawer}
        open={drawerOpen}
        title="AR-2025-0612"
      >
        <div
          className="space-y-5"
          data-testid="uxp3-access-request-drawer-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={validationState}
          data-ux-no-overclaim="true"
        >
          <Badge tone="gold">Pending</Badge>
          <StatePanel detail="Access approval remains constrained by visible policy, SOD and audit checks. This drawer cannot release advice, complete evidence review, approve export/share or make content client-visible." state="restricted" title="Scoped access review" />
          <GovernanceCapabilityBoundary compact />
          <label className="flex items-start gap-3 text-sm text-alphavest-muted">
            <input
              checked={acknowledged}
              className="mt-1"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setAcknowledged(event.target.checked)}
              type="checkbox"
            />
            <span>I understand this routes only this scoped access decision; RBAC, SOD, audit, release, evidence and export/share controls remain separate.</span>
          </label>
          {status === "idle" ? (
            <StatePanel
              detail={acknowledged ? "Scoped access review can be submitted through the existing approval workflow." : "Access approval remains blocked until the scoped access acknowledgement is checked."}
              state={acknowledged ? "validation" : "blocked"}
              testId="j07-access-request-validation-state"
              title={acknowledged ? "Access request valid" : "Access request blocked"}
            />
          ) : null}
          {status === "submitting" ? (
            <StatePanel
              detail={message ?? "Routing the scoped access approval review."}
              state="loading"
              testId="j07-access-request-loading-state"
              title="Access request submitting"
            />
          ) : null}
          {status === "success" ? (
            <StatePanel
              detail={message ?? "Scoped access approval review was routed through the existing workflow; access expansion, role activation, release, evidence sufficiency, export/share and client visibility remain separate controls."}
              state="success"
              testId="j07-access-request-success-state"
              title="Access request routed"
            />
          ) : null}
          {status === "error" ? (
            <StatePanel
              detail={message ?? "Access approval workflow failed without access expansion, role activation, release or client visibility change."}
              state="error"
              testId="j07-access-request-error-state"
              title="Access request failed"
            />
          ) : null}
          <UxSecondaryContextTabs
            safetyNote="These tabs hold secondary request context; approval authority still depends on the visible policy and SOD checks below."
            tabs={[
              {
                content: <p className="text-sm leading-6 text-alphavest-muted">Need visibility into client performance to prepare quarterly review materials for the investment committee.</p>,
                id: "reason",
                label: "Reason",
              },
              {
                content: (
                  <div className="space-y-3">
                    <InfoRow label="Access Type" value="View" />
                    <InfoRow label="Resource" value="Client Performance" />
                    <InfoRow label="Permissions" value="View performance, returns and holdings summary" />
                    <InfoRow label="Justification" value="Prepare quarterly analysis" />
                  </div>
                ),
                id: "requested-access",
                label: "Requested access",
              },
            ]}
            title="Secondary access-request context"
          />
          <Card>
            <CardHeader><CardTitle>Policy and SOD Checks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {accessPolicyChecks.map((check) => (
                <div className="flex items-center justify-between gap-3 text-sm" key={check.label}>
                  <span className="text-alphavest-muted">{check.label}</span>
                  <Badge tone={toneFor(check.result)}>{check.result}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <label className="block">
            <span className="text-sm font-semibold text-alphavest-muted">Decision comment</span>
            <textarea className="mt-2 min-h-24 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" placeholder="Add a comment..." />
          </label>
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

export function DecisionsGovernanceScreen({ route, visualState }: DecisionsGovernanceScreenProps) {
  if (!decisionsGovernancePageIds.includes(route.pageId as (typeof decisionsGovernancePageIds)[number])) {
    return null;
  }

  switch (route.pageId) {
    case "041":
      return <ComplianceBlockPage title={route.title} visualState={visualState} />;
    case "042":
      return <ComplianceAuditPage title={route.title} />;
    case "043":
      return <DecisionsListPage title={route.title} />;
    case "044":
      return <DecisionRoomPage title={route.title} visualState={visualState} />;
    case "045":
      return <DecisionSuccessPage title={route.title} />;
    case "046":
      return <EvidenceVaultPage title={route.title} visualState={visualState} />;
    case "047":
      return <EvidenceRecordDetailPage title={route.title} />;
    case "048":
      return <GovernanceUsersPage title={route.title} visualState={visualState} />;
    case "049":
      return <RoleManagementPage title={route.title} visualState={visualState} />;
    case "050":
      return <AccessRequestsPage title={route.title} visualState={visualState} />;
    default:
      return null;
  }
}
