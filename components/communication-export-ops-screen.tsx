"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  Eye,
  Filter,
  Folder,
  Gauge,
  GitBranch,
  LineChart,
  LockKeyhole,
  MessageSquare,
  Network,
  PackageCheck,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Table2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AuditTimeline,
  ActionButton,
  ActionZone,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ClientSafeUiBoundary,
  DataTable,
  Drawer,
  Modal,
  StatePanel,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { GlobalSearchBox } from "@/components/global-search-box";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { RouteContextChip } from "@/components/route-context-chip";
import { ScfP07P09TrustPanel } from "@/components/scf-p07-p09-trust-panel";
import { ScfP10P14ClosurePanel } from "@/components/scf-p10-p14-closure-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxDenseOperationsPanel } from "@/components/ux-dense-operations-panel";
import { UxDetailStandardPanel } from "@/components/ux-detail-standard-panel";
import { UxComplexityPriorityPanel } from "@/components/ux-complexity-priority-panel";
import { UxCtaCluster } from "@/components/ux-cta-cluster";
import { UxSecondaryContextTabs } from "@/components/ux-secondary-context-tabs";
import { WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import { uxFeedbackSuccessMessageForSubject } from "@/lib/ux-feedback-message-contract";
import {
  blueprintRows,
  blueprintStages,
  breachRows,
  callTriggerMatrix,
  communicationLogItems,
  communicationPaths,
  communicationTemplates,
  dataQualityReleaseControls,
  exportScopeItems,
  exportScopeSummary,
  exportForbiddenPayloadChecks,
  exportPackageControls,
  exportTimeline,
  opsMetrics,
  previewPolicyChecks,
  queueRows,
  redactionSummary,
  roadmapColumns,
  slaMetrics,
  stateCatalogueRows,
  stateChips,
  workflowBadges
} from "@/lib/communication-export-ops-demo-data";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ExportWorkflowSnapshot } from "@/lib/export-workflow-readmodel-service";
import type { OpsSlaSnapshot } from "@/lib/ops-sla-readmodel-service";
import type { ScreenRoute } from "@/lib/route-registry";
import { runTenantGovernanceCommand } from "@/lib/tenant-governance-command-client";
import type { VisualState } from "@/lib/visual-contract";

type CommunicationExportOpsScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type AuditEventTableRow = {
  action: string;
  actor: string;
  after: string;
  before: string;
  id: string;
  lineage: string[];
  object: string;
  result: string;
  role: string;
  source: string;
  sourceRef: string;
  sourceState: "source-backed";
  timestamp: string;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";



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



function ExportClientPackageProjectionPanel() {
  return (
    <ClientSafeUiBoundary family="export_client_package" pageId="058" testId="e07-export-client-package-boundary">
      <section className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4" data-testid="e07-export-client-package-projection">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-green">Client package projection</p>
            <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">Package availability is based on released, redacted content.</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">
              The package view shows availability, release status, redaction status and safe next steps only.
            </p>
          </div>
          <Badge tone="green">Client safe</Badge>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="e07-export-package-safe-fields">
            <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Shown in package view</p>
            <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Manifest id, redacted title, released status and watermark state.</p>
          </div>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="e07-export-package-availability">
            <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Availability</p>
            <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Download remains gated until package checks pass.</p>
          </div>
          <StatePanel
            detail="If the package is not ready, the view shows an unavailable state and routes the user back to approval or redaction."
            state="restricted"
            testId="e07-export-package-fail-closed"
            title="Package not ready until checks pass"
          />
        </div>
      </section>
    </ClientSafeUiBoundary>
  );
}

type ExportLifecycleStageId = "scope" | "redaction" | "preview" | "approval" | "package" | "share";

const exportLifecycleStages: Array<{
  id: ExportLifecycleStageId;
  label: string;
  detail: string;
}> = [
  { id: "scope", label: "Scope selected", detail: "Permitted, released objects only." },
  { id: "redaction", label: "Redaction checked", detail: "Forbidden internal payloads blocked." },
  { id: "preview", label: "Preview inspected", detail: "Preview generated; approval required." },
  { id: "approval", label: "Approval recorded", detail: "Approval recorded; download/share remain separate." },
  { id: "package", label: "Manifest/download controlled", detail: "Package downloaded; client acceptance not recorded." },
  { id: "share", label: "Share/client response separate", detail: "External share and client response are later events." },
];

function ExportStageBoundary({ activeStage, className }: { activeStage: ExportLifecycleStageId; className?: string }) {
  const activeIndex = exportLifecycleStages.findIndex((stage) => stage.id === activeStage);

  return (
    <section
      className={cn("rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4", className)}
      data-testid="wp10-export-stage-boundary"
      data-ux-no-overclaim="true"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Export lifecycle boundary</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">Export is a client-safe projection, not a raw data dump.</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">
            Scope is not redaction. Redaction is not preview. Preview is not approval. Approval is not download/share. Download/share is not client acceptance.
          </p>
        </div>
        <Badge tone="gold">WP-10</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {exportLifecycleStages.map((stage, index) => {
          const state = index < activeIndex ? "complete" : index === activeIndex ? "current" : "later";
          const tone: BadgeTone = state === "complete" ? "green" : state === "current" ? "gold" : "muted";

          return (
            <div
              className={cn(
                "min-h-32 rounded-md border p-3",
                state === "current"
                  ? "border-alphavest-gold bg-alphavest-gold/10"
                  : state === "complete"
                    ? "border-alphavest-green/35 bg-alphavest-green/10"
                    : "border-alphavest-border bg-alphavest-charcoal/45",
              )}
              data-export-stage={stage.id}
              key={stage.id}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-alphavest-ivory">{stage.label}</p>
                <Badge tone={tone}>{state}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-alphavest-muted">{stage.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExportPayloadBoundary({ className }: { className?: string }) {
  const allowed = ["Released client-safe summaries", "Released evidence summaries", "Approved/redacted manifest metadata"];
  const blocked = ["AI Draft", "internal rationale", "analyst notes", "compliance notes", "unreleased evidence", "unreleased recommendations", "hidden fields"];

  return (
    <section
      className={cn("rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4", className)}
      data-testid="wp10-export-forbidden-payload-boundary"
      data-ux-no-overclaim="true"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-red">Forbidden payload boundary</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">Only scoped, redacted and client-safe content can enter the export package.</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">
            Admin access and advisor approval do not expand export payload permission; service checks and audit references remain required.
          </p>
        </div>
        <LockKeyhole aria-hidden="true" className="size-6 text-alphavest-red" />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-green">Allowed source</p>
          <ul className="mt-3 space-y-2 text-sm text-alphavest-muted">
            {allowed.map((item) => (
              <li className="flex items-start gap-2" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-red">Blocked source</p>
          <p className="mt-3 text-sm leading-6 text-alphavest-muted">{blocked.join(", ")}.</p>
        </div>
      </div>
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

function handleStaticSortChange() {
  return undefined;
}

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("success") || normalized.includes("pass") || normalized.includes("active") || normalized.includes("completed") || normalized.includes("downloaded") || normalized.includes("approved") || normalized.includes("allowed") || normalized.includes("on track") || normalized.includes("resolved")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("failure") || normalized.includes("error") || normalized.includes("breached") || normalized.includes("high") || normalized.includes("not permitted") || normalized.includes("overload") || normalized.includes("failed")) {
    return "red";
  }

  if (normalized.includes("pending") || normalized.includes("warning") || normalized.includes("draft") || normalized.includes("review") || normalized.includes("limited") || normalized.includes("at risk") || normalized.includes("medium") || normalized.includes("approval")) {
    return "gold";
  }

  if (normalized.includes("escalated") || normalized.includes("future") || normalized.includes("processing")) {
    return "purple";
  }

  if (normalized.includes("low") || normalized.includes("default") || normalized.includes("internal")) {
    return "blue";
  }

  return "muted";
}

function useDbtfAuditEvents() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<AuditEventTableRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch(
          `/api/audit-events?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
          { cache: "no-store" },
        );
        const body = (await response.json()) as { auditEvents?: AuditEventTableRow[] };

        if (!response.ok) {
          throw new Error("Audit event reload failed.");
        }

        if (!cancelled) {
          setRows(body.auditEvents ?? []);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [roleKey, tenantSlug]);

  return { loadState, rows };
}

type ExportWorkflowApiState = {
  auditEventId?: string;
  error?: string;
  exportRequestId?: string;
  manifest?: { manifestVersion?: string };
  mutated?: false;
  noClientRelease?: true;
  ok?: boolean;
  reasonCode?: string;
  retryAllowed?: boolean;
  safety?: {
    failClosed?: boolean;
    hiddenRowsDisclosed?: boolean;
    noExportApproval?: boolean;
    noExportDownload?: boolean;
    scoped?: boolean;
    silentStateAdvance?: boolean;
  };
  snapshot?: ExportWorkflowSnapshot | null;
  status?: string;
};

type ExportWorkflowCommandPayload = {
  command: "APPROVE" | "DOWNLOAD";
  exportRequestId?: string;
  payload?: Record<string, unknown>;
  reason: string;
  redactionProfile?: string | null;
  roleKey: DemoRoleKey;
  tenantSlug: DemoTenantSlug;
};

const exportWorkflowSafePayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

async function runExportWorkflowCommand(payload: ExportWorkflowCommandPayload) {
  const response = await fetch("/api/export-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      payload: payload.payload ?? exportWorkflowSafePayload,
      ...(payload.redactionProfile ? { redactionProfile: payload.redactionProfile } : {}),
    }),
  });
  const body = (await response.json().catch(() => undefined)) as ExportWorkflowApiState | undefined;

  if (!response.ok) {
    const issues = Array.isArray((body as { issues?: unknown })?.issues)
      ? ` (${(body as { issues: unknown[] }).issues.join(", ")})`
      : "";

    throw new Error(`${body?.error ?? `Export workflow command failed with HTTP ${response.status}`}${issues}`);
  }

  return body ?? {};
}

function useExportWorkflowSnapshot() {
  const { session } = useDemoSession();
  const [apiState, setApiState] = useState<ExportWorkflowApiState | null>(null);
  const [snapshot, setSnapshot] = useState<ExportWorkflowSnapshot | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch(
          `/api/export-workflow?tenantSlug=${encodeURIComponent(session.tenant.slug)}&roleKey=${encodeURIComponent(session.role.key)}`,
          { cache: "no-store" },
        );
        const body = (await response.json()) as ExportWorkflowApiState;

        if (!response.ok) {
          if (!cancelled) {
            setApiState(body);
            setSnapshot(null);
            setLoadState("error");
          }

          return;
        }

        if (!cancelled) {
          setApiState(body);
          setSnapshot(body.snapshot ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setApiState({
            error: "Export workflow snapshot could not be loaded.",
            mutated: false,
            noClientRelease: true,
            ok: false,
            reasonCode: "SAFE_ERROR",
            retryAllowed: true,
            safety: {
              failClosed: true,
              hiddenRowsDisclosed: false,
              noExportApproval: true,
              noExportDownload: true,
              scoped: false,
              silentStateAdvance: false,
            },
            snapshot: null,
          });
          setSnapshot(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [session.role.key, session.tenant.slug]);

  return { apiState, loadState, snapshot };
}

function ExportWorkflowTruthPanel({
  apiState,
  className,
  loadState,
}: {
  apiState: ExportWorkflowApiState | null;
  className?: string;
  loadState: "loading" | "ready" | "error";
}) {
  if (loadState === "loading") {
    return (
      <StatePanel
        className={className}
        detail="Export scope, redaction, approval and delivery state are loading from the export workflow API before controls can rely on them."
        state="loading"
        testId="wp13-export-api-truth-loading"
        title="Export API truth loading"
      />
    );
  }

  if (loadState === "error") {
    return (
      <StatePanel
        className={className}
        detail={`${apiState?.error ?? "Export workflow API truth is unavailable."} The UI remains fail-closed: no export approval, download, share, client acceptance or advice release is completed.`}
        state="export-failed"
        testId="wp13-export-api-truth-fail-closed"
        title="Export workflow API fail-closed"
      />
    );
  }

  return (
    <StatePanel
      className={className}
      detail="Export scope, redaction, preview, approval and delivery state are sourced from the tenant-scoped export workflow read model; fallback demo data is not treated as a completion gate."
      state="restricted"
      testId="wp13-export-api-truth-ready"
      title="Export API truth source"
    />
  );
}

function useOpsSlaSnapshot() {
  const { session } = useDemoSession();
  const [snapshot, setSnapshot] = useState<OpsSlaSnapshot | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch(
          `/api/ops-sla?tenantSlug=${encodeURIComponent(session.tenant.slug)}&roleKey=${encodeURIComponent(session.role.key)}`,
          { cache: "no-store" },
        );
        const body = (await response.json()) as { snapshot?: OpsSlaSnapshot | null };

        if (!response.ok) {
          throw new Error("Ops/SLA snapshot failed.");
        }

        if (!cancelled) {
          setSnapshot(body.snapshot ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setSnapshot(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [session.role.key, session.tenant.slug]);

  return { loadState, snapshot };
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
      <div className={cn("h-2 rounded-full", toneClass[tone])} style={{ width: `${Math.max(6, Math.min(100, value))}%` }} />
    </div>
  );
}

function MiniTrend({ tone = "green" }: { tone?: BadgeTone }) {
  const colors: Record<BadgeTone, string> = {
    blue: "bg-alphavest-blue",
    gold: "bg-alphavest-gold",
    green: "bg-alphavest-green",
    muted: "bg-alphavest-muted",
    purple: "bg-violet-300",
    red: "bg-alphavest-red",
    teal: "bg-teal-300"
  };

  return (
    <div className="flex h-8 items-end gap-1">
      {[36, 48, 42, 58, 54, 70, 62, 78].map((height, index) => (
        <span className={cn("w-1.5 rounded-t", colors[tone])} key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function Phase13Sidebar() {
  return (
    <ProcessSidebar
      footer={
        <div className="border-t border-alphavest-border/60 pt-4">
          <p className="flex h-9 w-full items-center justify-between rounded-md px-2 text-sm text-alphavest-muted opacity-65" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
            <span>Collapse</span>
            <span aria-hidden="true">{"<<"}</span>
          </p>
        </div>
      }
    />
  );
}

function Phase13TopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[34rem]" />
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
          <div className="flex items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 py-2 sm:justify-start">
            <Bell aria-hidden="true" className="size-4 text-alphavest-gold" />
            <span className="text-sm text-alphavest-muted">{session.actor.initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Phase13Shell({ children, route }: { children: React.ReactNode; route: ScreenRoute }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal overflow-x-hidden">
        <ScreenTitle>{route.title}</ScreenTitle>
        <div className="av-shell-grid">
          <Phase13Sidebar />
          <div className="min-w-0 flex-1">
            <Phase13TopBar />
            <main className="px-4 py-6 md:px-6 lg:px-8">
              <OperationalDefaultSurface>{children}</OperationalDefaultSurface>
            </main>
          </div>
        </div>
      </div>
    </DemoSessionProvider>
  );
}

function PageLead({ badge, description, icon: Icon, title }: { badge?: string; description: string; icon: LucideIcon; title: string }) {
  return (
    <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <IconTile>
          <Icon aria-hidden="true" className="size-5" />
        </IconTile>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl text-alphavest-ivory">{title}</h2>
            {badge ? <Badge tone={toneFor(badge)}>{badge}</Badge> : null}
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-alphavest-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FieldPill({ label, value }: { label: string; value: string }) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{label}</span>
      <div className="mt-2 flex h-11 items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm text-alphavest-ivory">
        <span className="truncate">{value}</span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-alphavest-subtle" />
      </div>
    </label>
  );
}

function KeyValueList({ items }: { items: Array<{ label: string; value: React.ReactNode }> }) {
  return (
    <dl className="divide-y divide-alphavest-border/55">
      {items.map((item) => (
        <div className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm" key={item.label}>
          <dt className="text-alphavest-muted">{item.label}</dt>
          <dd className="min-w-0 text-alphavest-ivory">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AuditHistoryPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer");
  const { loadState, rows } = useDbtfAuditEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const resultOptions = Array.from(new Set(rows.map((row) => row.result))).sort();
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      [row.timestamp, row.actor, row.role, row.object, row.action, row.source, row.result].some((value) =>
        value.toLowerCase().includes(normalizedSearchTerm),
      );
    const matchesResult = resultFilter === "all" || row.result === resultFilter;

    return matchesSearch && matchesResult;
  });
  const selected = filteredRows[0] ?? rows[0];
  const columns: Array<DataTableColumn<AuditEventTableRow>> = [
    { key: "timestamp", header: "Timestamp", render: (row) => row.timestamp, sortable: true },
    {
      key: "actor",
      header: "Actor",
      render: (row) => (
        <div>
          <p className="font-semibold text-alphavest-ivory">{row.actor}</p>
          <p className="text-xs text-alphavest-subtle">{row.role}</p>
        </div>
      ),
      sortable: true
    },
    { key: "object", header: "Object", render: (row) => row.object, sortable: true },
    { key: "action", header: "Action", render: (row) => row.action, sortable: true },
    { key: "source", header: "Source", render: (row) => row.source },
    { key: "result", header: "Result", render: (row) => <Badge tone={toneFor(row.result)}>{row.result}</Badge>, sortable: true }
  ];

  return (
    <WorksurfaceShell
      description="Tenant-scoped audit event review with selected-event lineage and controlled audit export still held behind explicit gates."
      eyebrow="WP02 Governance Safety"
      primary={
        <div className="space-y-4">
          <PageLead description="Access-event review with filters, export controls and event lineage." icon={LockKeyhole} title={title} />
          <StatePanel detail="Audit review is read-only here; persistence, retention and controlled export remain separate gates." state="restricted" title="Audit persistence gate" />
          <StatePanel
            detail={
              loadState === "ready"
                ? "Rows in this view come from tenant-scoped AuditEvent records. Static screen context is display-only."
                : loadState === "loading"
                  ? "Loading audit history..."
                  : "Audit unavailable — required action remains blocked/pending."
            }
            state={loadState === "ready" ? "success" : loadState === "loading" ? "loading" : "audit-unavailable"}
            testId="wp08-source-backed-audit-state"
            title={loadState === "ready" ? "Audit recorded" : loadState === "loading" ? "Loading audit history" : "Audit unavailable"}
          />
        </div>
      }
      routeId="051"
      safetyNote="Audit visibility is read-only here; it does not prove persistence, approve access changes or authorize controlled export."
      statusItems={[
        { label: "Route", tone: "blue", value: "051" },
        { label: "Mode", tone: "gold", value: "audit review" },
      ]}
      title={title}
      worksurfaceId="governance-safety-audit-history"
    >
      <UxDenseOperationsPanel
        actions={
          <>
            <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
              <RefreshCw aria-hidden="true" className="size-4" />
              Refresh held
            </span>
            <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
              <Download aria-hidden="true" className="size-4" />
              Audit export held
            </span>
          </>
        }
        className="mt-5"
        controls={["Search DB audit events", "Result", "Actor", "Object", "Action", "Source"]}
        description="Access-event rows remain filterable and sortable while selected-event lineage stays in the drawer."
        pageId="051"
        resultLabel={`Showing ${filteredRows.length} of ${rows.length} tenant-scoped DB audit-event rows`}
        safetyNote="Audit visibility does not prove audit persistence; controlled export and access-change gates remain separate."
        title="Access-event operations"
      >
        <div className="grid gap-4 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 md:grid-cols-4">
          <label className="grid gap-1 text-xs font-semibold text-alphavest-muted md:col-span-2">
            <span>Search DB audit events</span>
            <input
              className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm font-normal text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search actor, object or action"
              value={searchTerm}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-alphavest-muted">
            <span>Result</span>
            <select
              className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm font-normal text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
              onChange={(event) => setResultFilter(event.target.value)}
              value={resultFilter}
            >
              <option value="all">All results</option>
              {resultOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <FieldPill label="Scope" value="Tenant DB audit rows" />
        </div>
          <DataTable
            columns={columns}
            compact
            emptyMessage={loadState === "error" ? "Audit events could not be loaded from the DB." : "No DB audit events match this filter."}
            getRowId={(row) => row.id}
            onSortChange={handleStaticSortChange}
            responsiveMode="table"
            rows={filteredRows}
            sortDirection="desc"
            sortKey="timestamp"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <StatePanel detail="No matching access changes for the saved filter." state="empty" title="Empty filter state" />
            <StatePanel detail="Audit event rows are loading; retention review remains separate." state="loading" title="Loading state" />
            <StatePanel detail="Audit unavailable — required action remains blocked/pending while the retention service is unreachable." state="audit-unavailable" title="Audit unavailable" />
          </div>
      </UxDenseOperationsPanel>
      <Drawer description="Selected event lineage and before/after access state." onClose={() => setDrawerOpen(false)} open={drawerOpen && Boolean(selected)} title="Event Details">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <Badge tone={toneFor(selected?.result ?? "pending")}>{selected?.result ?? "No event"}</Badge>
            <button
              className={secondaryButtonClass}
              data-testid="j07-export-audit"
              onClick={() => {
                void runTenantGovernanceCommand("j07.exportAudit");
              }}
              type="button"
            >
              <Download aria-hidden="true" className="size-4" />
              Export audit events
            </button>
          </div>
          <UxSecondaryContextTabs
            safetyNote="Event tabs are selected-row context only; audit persistence and retention gates remain visible on the main page."
            tabs={[
              {
                content: (
                  <KeyValueList
                    items={[
                      { label: "Event", value: selected?.id ?? "n/a" },
                      { label: "Action", value: selected?.action ?? "n/a" },
                      { label: "Object", value: selected?.object ?? "n/a" },
                      { label: "Source", value: selected?.source ?? "n/a" },
                      { label: "Source state", value: selected?.sourceState === "source-backed" ? "Audit recorded" : "Audit unavailable" },
                      { label: "Source ref", value: selected?.sourceRef ?? "n/a" },
                      { label: "Actor", value: selected?.actor ?? "n/a" }
                    ]}
                  />
                ),
                id: "event",
                label: "Event",
              },
              {
                content: (
                  <ol className="space-y-3">
                    {(selected?.lineage ?? []).map((item) => (
                      <li className="flex items-center gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/55 p-3 text-sm text-alphavest-muted" key={item}>
                        <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />
                        {item}
                      </li>
                    ))}
                  </ol>
                ),
                id: "lineage",
                label: "Lineage",
              },
              {
                content: (
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/60 p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-alphavest-subtle">Before</p>
                      <p className="mt-2 font-semibold text-alphavest-ivory">{selected?.before ?? "n/a"}</p>
                    </div>
                    <ArrowRight aria-hidden="true" className="mx-auto size-5 text-alphavest-gold" />
                    <div className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-alphavest-green">After</p>
                      <p className="mt-2 font-semibold text-alphavest-ivory">{selected?.after ?? "n/a"}</p>
                    </div>
                  </div>
                ),
                id: "before-after",
                label: "Before / after",
                tone: "warning",
              },
            ]}
            title="Secondary audit-event context"
          />
        </div>
      </Drawer>
    </WorksurfaceShell>
  );
}

function CommunicationCentrePage({ title }: { title: string }) {
  const templateColumns: Array<DataTableColumn<(typeof communicationTemplates)[number]>> = [
    { key: "title", header: "Template", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.title}</span> },
    { key: "channel", header: "Channel", render: (row) => row.channel },
    { key: "usage", header: "Usage", render: (row) => row.usage },
    { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
  ];

  return (
    <div>
      <PageLead description="Design, approve and deliver compliant communications with preview, release and evidence logging." icon={MessageSquare} title={title} />
      <Phase5DetailSplitPanel decisionSupport="Communication context surfaces source, consent and recovery information before any follow-up." objectLabel="Communication context detail" objectState="Context reviewed; outbound action still gated" pageJob="Communication detail explains one client context without becoming export or advice release." safetyBoundary="Communication context cannot release advice, evidence or export payloads." splitTaskId="UX-PAGE-SPLIT-008" taskId="UX-DETAIL-006" />
      <UxHubPage pageId="052" />
      <div className="rounded-md border border-alphavest-gold/45 bg-alphavest-gold/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold text-alphavest-gold-soft">
            <ShieldCheck aria-hidden="true" className="size-5" />
            No unapproved advice reaches the client.
          </div>
          <span className="text-sm text-alphavest-muted">Advice-like communications require approval and release before sending.</span>
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.85fr)]">
        <Card className="xl:col-span-2 2xl:col-span-1">
          <CardHeader>
            <CardTitle>Choose Communication Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {communicationPaths.map((path) => (
                <div
                  className={cn(
                    "rounded-md border p-4",
                    path.state === "selected" ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-charcoal/45"
                  )}
                  key={path.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-alphavest-ivory">{path.label}</h3>
                    {path.state === "selected" ? <CheckCircle2 aria-hidden="true" className="size-5 text-alphavest-gold" /> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-alphavest-muted">{path.detail}</p>
                </div>
              ))}
            </div>
            <StatePanel className="mt-4" detail="Selected path requires compliance release before client delivery." state="restricted" title="Provide advice requires approval" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Build Message or Call</CardTitle>
              <p className="mt-1 text-sm text-alphavest-muted">Secure-message draft with approved template and evidence purpose.</p>
            </div>
            <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
              <Plus aria-hidden="true" className="size-4" />
              New item held
            </span>
          </CardHeader>
          <CardContent>
            <DataTable compact columns={templateColumns} getRowId={(row) => row.id} rows={communicationTemplates} />
            <div className="mt-4 rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {["Secure message", "Email", "Letter", "SMS", "In-app"].map((channel, index) => (
                  <Badge key={channel} tone={index === 0 ? "gold" : "muted"}>
                    {channel}
                  </Badge>
                ))}
              </div>
              <label className="block text-sm font-semibold text-alphavest-ivory">
                Subject
                <input className="mt-2 h-10 w-full rounded-md border border-alphavest-border bg-alphavest-panel px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" defaultValue="Proposed portfolio changes for your review" />
              </label>
              <div className="mt-4 rounded-md border border-alphavest-border bg-alphavest-panel p-4 text-sm leading-6 text-alphavest-muted">
                Dear Alex,<br />
                Following our recent review, I am proposing portfolio changes that align with your long-term goals and current market opportunities. The detailed rationale is attached inside the approved workspace.
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review, Release and Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-alphavest-ivory">Preview</p>
                <Badge tone="gold">Draft</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-alphavest-muted">Client preview uses simplified wording and hides internal routing rules until release.</p>
            </div>
            <StatePanel className="mt-4" detail="Approval required for advice-like communication. Submit for Compliance release before any client delivery." state="blocked" title="Release gate required" />
            <DataTable compact columns={[
              { key: "channel", header: "Channel", render: (row) => row.channel },
              { key: "purpose", header: "Purpose", render: (row) => row.purpose },
              { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
            ]} getRowId={(row) => row.id} rows={communicationLogItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CallTriggerMatrixPage({ title }: { title: string }) {
  const selected = callTriggerMatrix[0];
  const columns: Array<DataTableColumn<(typeof callTriggerMatrix)[number]>> = [
    { key: "scenario", header: "Scenario Type", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.scenario}</span> },
    { key: "complexity", header: "Complexity", render: (row) => <Badge tone={toneFor(row.complexity)}>{row.complexity}</Badge> },
    { key: "emotional", header: "Emotional", render: (row) => <Badge tone={toneFor(row.emotional)}>{row.emotional}</Badge> },
    { key: "regulatory", header: "Regulatory", render: (row) => <Badge tone={toneFor(row.regulatory)}>{row.regulatory}</Badge> },
    { key: "urgency", header: "Urgency", render: (row) => <Badge tone={toneFor(row.urgency)}>{row.urgency}</Badge> },
    { key: "path", header: "Recommended Path", render: (row) => row.path },
    { key: "state", header: "Escalation", render: (row) => <Badge tone={toneFor(row.state)}>{row.state}</Badge> }
  ];

  return (
    <div>
      <PageLead description="Route conversations to digital, call, workshop, external specialist or compliance hold based on scenario risk." icon={ClipboardCheck} title={title} />
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-5">
            <FieldPill label="Scenario type" value="All" />
            <FieldPill label="Complexity" value="All" />
            <FieldPill label="Emotional sensitivity" value="All" />
            <FieldPill label="Regulatory sensitivity" value="All" />
            <FieldPill label="Status" value="All" />
          </div>
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Routing Matrix</CardTitle>
              <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
                <Settings aria-hidden="true" className="size-4" />
                Matrix management held
              </span>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} getRowId={(row) => row.id} rows={callTriggerMatrix} />
            </CardContent>
          </Card>
        </div>
        <Card className="border-alphavest-gold/45">
          <CardHeader>
            <CardTitle>Scenario Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4">
              <p className="text-sm font-semibold text-alphavest-ivory">{selected.scenario}</p>
              <p className="mt-1 text-sm text-alphavest-muted">S&P 500 intraday move</p>
            </div>
            <KeyValueList
              items={[
                { label: "Complexity", value: selected.complexity },
                { label: "Emotional", value: selected.emotional },
                { label: "Regulatory", value: selected.regulatory },
                { label: "Urgency", value: selected.urgency }
              ]}
            />
            <div className="rounded-md border border-alphavest-gold/45 bg-alphavest-gold/10 p-4">
              <p className="font-semibold text-alphavest-gold-soft">{selected.path}</p>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">Proactive digital communication keeps clients informed while minimizing friction.</p>
            </div>
            <p className={cn(primaryButtonClass, "mt-4 w-full")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
              Digital send held
              <ArrowRight aria-hidden="true" className="size-4" />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExportNewPage({ title }: { title: string }) {
  return (
    <WorksurfaceShell
      description="Export request start screen that captures scope intent before redaction, preview, approval or controlled delivery can occur."
      eyebrow="WP02 Export/Redaction"
      primary={
        <div className="space-y-4">
          <PageLead badge="Scope first" description="Start export scope before redaction, preview, approval or delivery." icon={Download} title={title} />
          <Phase5DetailSplitPanel decisionSupport="Export start captures purpose and scope without preview, approval or download behavior." objectLabel="Export flow split" objectState="Export request not yet scoped" pageJob="Export start is separate from scope, redaction, preview, approval and delivery." safetyBoundary="Start page cannot generate, approve or download export packages." splitTaskId="UX-PAGE-SPLIT-005" taskId="UX-PAGE-SPLIT-005" />
          <ExportStageBoundary activeStage="scope" />
          <UxHubPage pageId="054" />
        </div>
      }
      routeId="054"
      safetyNote="Export start cannot generate, approve, download, share or make advice client-visible."
      statusItems={[
        { label: "Route", tone: "blue", value: "054" },
        { label: "Stage", tone: "gold", value: "scope first" },
      ]}
      title={title}
      worksurfaceId="export-redaction-start"
    />
  );
}

function ExportScopePage({ title }: { title: string }) {
  const { apiState, loadState, snapshot } = useExportWorkflowSnapshot();
  const apiUnavailable = loadState === "error";
  const scopeRows = apiUnavailable ? [] : snapshot?.scopeItems.length ? snapshot.scopeItems : exportScopeItems;
  const summary = apiUnavailable
    ? {
        activeRequestCount: 0,
        blocked: 0,
        included: 0,
        invalidSelected: 0,
        limitedIncluded: 0,
        totalAvailable: 0,
      }
    : snapshot?.summary ?? exportScopeSummary;
  const availableColumns: Array<DataTableColumn<(typeof scopeRows)[number]>> = [
    { key: "name", header: "Name", render: (row) => <span className={cn("font-semibold", row.selected ? "text-alphavest-ivory" : "text-alphavest-muted")}>{row.name}</span>, sortable: true },
    { key: "type", header: "Type", render: (row) => row.type, sortable: true },
    { key: "access", header: "Access", render: (row) => <Badge tone={toneFor(row.access)}>{row.access}</Badge>, sortable: true }
  ];

  return (
    <WorksurfaceShell
      description="Object-level export scope selection for permitted objects only before redaction and preview can proceed."
      eyebrow="WP02 Export/Redaction"
      primary={
        <div className="space-y-4">
          <PageLead description="Select permitted objects only. Preview, approval, download and share remain unavailable." icon={Folder} title={title} />
          <ExportStageBoundary activeStage="scope" />
          <ExportWorkflowTruthPanel apiState={apiState} loadState={loadState} />
        </div>
      }
      routeId="055"
      safetyNote="Scope selection is not preview, approval, download or share; restricted objects stay excluded until permission and redaction controls pass."
      statusItems={[
        { label: "Route", tone: "blue", value: "055" },
        { label: "Included", tone: "green", value: String(summary.included) },
        { label: "Blocked", tone: "red", value: String(summary.blocked) },
      ]}
      title={title}
      worksurfaceId="export-redaction-scope"
    >
      <UxDenseOperationsPanel
        className="mt-5"
        controls={["Date range", "Recipients", "Object type", "Access", "Selected only", "Blocked excluded"]}
        description="Object-level scope for the next redaction step."
        pageId="055"
        resultLabel={`${summary.included} included; ${summary.blocked} blocked; ${summary.invalidSelected} invalid selected`}
        safetyNote="Scope selection is not preview, approval, download or share; restricted objects stay excluded until permission and redaction controls pass."
        title="Export-scope operations"
      >
        <div className="grid gap-4 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 md:grid-cols-3">
          <FieldPill label="Date range" value="May 1 - May 21, 2025" />
          <FieldPill label="Recipients" value="2 selected" />
          <FieldPill label="Object type" value="All types" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Available Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable compact columns={availableColumns} getRowId={(row) => row.id} onSortChange={handleStaticSortChange} responsiveMode="table" rows={scopeRows} sortDirection="asc" sortKey="name" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Selected Scope</CardTitle>
              <p className="mt-1 text-sm text-alphavest-muted">{summary.included} included, {summary.invalidSelected} invalid selected.</p>
            </div>
            <button
              aria-describedby="j08-clear-scope-reason"
              className={secondaryButtonClass}
              data-testid="j08-clear-scope"
              data-ux-action-state="blocked-until-typed-reset-command"
              disabled
              type="button"
            >
              Clear all blocked
            </button>
          </CardHeader>
          <CardContent>
            <DataTable compact columns={availableColumns} getRowId={(row) => `${row.id}-selected`} onSortChange={handleStaticSortChange} responsiveMode="table" rows={scopeRows.filter((item) => item.selected)} sortDirection="asc" sortKey="name" />
            <StatePanel className="mt-4" detail={`${summary.blocked} restricted or not-permitted objects are excluded. Limited items remain in scope only after redaction review.`} state="restricted" title="Object-level permission checks" />
            <p className="mt-2 text-xs leading-5 text-alphavest-muted" id="j08-clear-scope-reason">
              Scope reset is blocked until it is implemented as a typed export workflow command; the retired generic action is no longer a product path.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <FieldPill label="Included" value={`${summary.included} objects`} />
              <FieldPill label="Limited" value={`${summary.limitedIncluded} reviewed`} />
              <FieldPill label="Blocked" value={`${summary.blocked} excluded`} />
            </div>
          </CardContent>
        </Card>
      </div>
      </UxDenseOperationsPanel>
      <ExportPayloadBoundary className="mt-5" />
      <div className="mt-5 space-y-5">
        <ScfP07P09TrustPanel mode="export" />
        <ScfP10P14ClosurePanel mode="api" />
      </div>
    </WorksurfaceShell>
  );
}

function RedactedDocumentPreview() {
  return (
    <div className="rounded-md border border-slate-300 bg-[#f7f1e6] p-5 text-slate-900 shadow-inner">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-300 pb-3">
        <p className="font-display text-xl">AlphaVest WealthOS</p>
        <div className="text-right text-sm">
          <p>Portfolio Change Summary</p>
          <p className="text-xs text-slate-500">Redacted client export view</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        {["Client household", "Beginning market value", "Net contributions", "Net investment change", "Ending market value", "Market value", "Unrealized gain/loss", "Account number", "Advisor name", "Distribution notes"].map((item, index) => (
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(6rem,12rem)] gap-5" key={item}>
          <span className="min-w-0 text-slate-700">{item}</span>
          <span className={cn("h-5 rounded border border-red-400 bg-red-100", index % 3 === 0 && "bg-red-200", index % 4 === 0 && "bg-slate-100")} />
        </div>
        ))}
      </div>
      <div className="mt-5 rounded border border-red-300 bg-red-50 p-3 text-xs leading-5 text-red-800">
        Redaction markers are mandatory for external exports. Internal-only fields remain visible in the reviewer package and are omitted from the client package.
      </div>
    </div>
  );
}

function ExportRedactionPage({ title }: { title: string }) {
  const redactionRows = [
    ...redactionSummary.map((item) => ({
      id: item.id,
      label: item.label,
      state: String(item.count),
      visibility: item.severity,
    })),
    ...exportForbiddenPayloadChecks.map((item) => ({
      id: item.label,
      label: item.label,
      state: item.state,
      visibility: "Forbidden payload",
    })),
  ];
  const redactionColumns: Array<DataTableColumn<(typeof redactionRows)[number]>> = [
    { key: "label", header: "Payload field", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.label}</span>, sortable: true },
    { key: "state", header: "State", render: (row) => <Badge tone={toneFor(row.state)}>{row.state}</Badge>, sortable: true },
    { key: "visibility", header: "Visibility", render: (row) => row.visibility, sortable: true },
  ];

  return (
    <WorksurfaceShell
      description="Payload redaction review for forbidden internal fields before preview inspection or approval can continue."
      eyebrow="WP02 Export/Redaction"
      primary={
        <div className="space-y-4">
          <PageLead badge="Redaction step" description="Resolve forbidden payloads before preview inspection." icon={Eye} title={title} />
          <Phase5DetailSplitPanel decisionSupport="Redaction detail shows field state, payload visibility and preview blockers." objectLabel="Export redaction object review" objectState="Forbidden payload checks active" pageJob="Redaction page resolves payload review separately from preview and approval." safetyBoundary="Redaction detail cannot approve, download or share the export." splitTaskId="UX-PAGE-SPLIT-005" taskId="UX-DETAIL-004" />
          <ExportStageBoundary activeStage="redaction" />
          <ExportPayloadBoundary />
          <StatePanel detail="All sensitive fields must be redacted before preview can move toward approval." state="blocked" title="Redaction blocks preview approval" />
          <ScfP07P09TrustPanel mode="export" />
        </div>
      }
      routeId="056"
      safetyNote="Redaction summary is not export approval; forbidden internal payload, preview, approval, download and share remain separate gates."
      statusItems={[
        { label: "Route", tone: "blue", value: "056" },
        { label: "Redactions", tone: "gold", value: "12" },
        { label: "Payload", tone: "red", value: "blocked" },
      ]}
      title={title}
      worksurfaceId="export-redaction-redaction"
    >
      <div className="mt-5">
        <UxCtaCluster
          blockedReason="Preview, approval, download and share remain separate export lifecycle steps; redaction review does not release the package."
          primary={{ label: "Review mandatory redactions" }}
          recoveryAction={{ href: "/export/demo/redaction", label: "Resolve redaction blockers" }}
          secondary={[
            { label: "Inspect payload checks" },
            {
              disabled: true,
              disabledReason: "Preview inspection must pass before approval can be recorded.",
              label: "Approval blocked until preview",
            },
            {
              disabled: true,
              disabledReason: "Approval and generation must be recorded before download.",
              label: "Download blocked until approval",
            },
          ]}
        />
      </div>
      <UxComplexityPriorityPanel
        className="mt-5"
        actionLabel="Review mandatory redactions"
        actionState="Preview and approval remain blocked until forbidden internal payload checks pass."
        priorityItems={[
          { detail: "Must be blocked from external package", label: "Internal advisor memo", value: "Blocked" },
          { detail: "Needs reviewer confirmation", label: "Tax residency notes", value: "Pending" },
          { detail: "External client redacted view selected", label: "Redaction profile", value: "Active" },
        ]}
        safetyNote="Redaction summary is not approval; preview, approval, download and share remain separate export steps."
        routeId="056"
        summaryItems={[
          { detail: "Marked redactions in preview", label: "Redactions", value: "12" },
          { detail: "Items visible after external redaction", label: "External visible", value: "16" },
          { detail: "Forbidden payload checks", label: "Internal payload", value: "Blocked" },
        ]}
        title="Redaction status"
      />
      <UxDenseOperationsPanel
        className="mt-5"
        controls={["Payload field", "State", "Visibility", "Forbidden payload", "External visible", "Internal visible"]}
        description="Redaction review is a dense payload-control table before document preview, approval or delivery can proceed."
        pageId="056"
        resultLabel={`${redactionRows.length} payload controls; 12 marked redactions`}
        safetyNote="Redaction summary is not export approval; forbidden internal payload, preview, approval, download and share remain separate gates."
        title="Payload redaction operations"
      >
        <DataTable
          columns={redactionColumns}
          compact
          getRowId={(row) => row.id}
          onSortChange={handleStaticSortChange}
          responsiveMode="table"
          rows={redactionRows}
          sortDirection="asc"
          sortKey="label"
        />
      </UxDenseOperationsPanel>
      <div className="mt-5 grid gap-5 2xl:grid-cols-[20rem_minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader>
            <CardTitle>Redaction Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldPill label="Redaction profile" value="Client standard external" />
            <div className="mt-5 space-y-3">
              {["Internal full visibility", "External client redacted view"].map((item, index) => (
                <div className={cn("rounded-md border p-4", index === 1 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-charcoal/55")} key={item}>
                  <p className="font-semibold text-alphavest-ivory">{item}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">{index === 1 ? "Selected view after redaction." : "Internal reviewer visibility only."}</p>
                </div>
              ))}
            </div>
            <StatePanel className="mt-4" detail="Review and confirm all redactions before preview or approval." state="restricted" title="External exports require redaction" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Document Preview</CardTitle>
            <Badge tone="gold">12 redactions</Badge>
          </CardHeader>
          <CardContent>
            <RedactedDocumentPreview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Redaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[5rem_1fr] items-center gap-5">
              <div className="grid size-20 place-items-center rounded-full border-8 border-alphavest-gold/70 text-center text-sm font-semibold text-alphavest-ivory">
                12
              </div>
              <div className="space-y-3">
                {redactionSummary.map((item) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={item.id}>
                    <span className="text-alphavest-muted">{item.label}</span>
                    <Badge tone={toneFor(item.severity)}>{item.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-alphavest-green/30 bg-alphavest-green/10 p-4">
                <p className="text-2xl font-semibold text-alphavest-green">28</p>
                <p className="text-sm text-alphavest-muted">Internal visible</p>
              </div>
              <div className="rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 p-4">
                <p className="text-2xl font-semibold text-alphavest-gold">16</p>
                <p className="text-sm text-alphavest-muted">External visible</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {exportForbiddenPayloadChecks.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-green/30 bg-alphavest-green/10 p-3 text-sm" key={item.label}>
                  <span className="text-alphavest-muted">{item.label}</span>
                  <Badge tone="green">{item.state}</Badge>
                </div>
              ))}
              {[
                ["Account identifiers", "Reviewed"],
                ["Tax residency notes", "Pending"],
                ["Internal advisor memo", "Blocked"],
                ["Beneficial owner details", "Reviewed"]
              ].map(([label, status]) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3 text-sm" key={label}>
                  <span className="text-alphavest-muted">{label}</span>
                  <Badge tone={toneFor(status)}>{status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </WorksurfaceShell>
  );
}

function ExportPreviewPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const { session } = useDemoSession();
  const [modalOpen, setModalOpen] = useState(visualState === "approval");
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const { apiState, loadState, snapshot } = useExportWorkflowSnapshot();
  const currentExport = snapshot?.current;
  const timeline = loadState === "error" ? [] : snapshot?.timeline.length ? snapshot.timeline : exportTimeline;
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = acknowledged ? "valid-export-approval-review" : "blocked-acknowledgement-required";
  const approvalSubmitDisabled = !acknowledged || status === "submitting" || status === "success";
  const approvalActionAvailability =
    status === "submitting"
      ? "loading"
      : status === "success"
        ? "success"
        : status === "error"
          ? "error"
          : approvalSubmitDisabled
            ? "disabled"
            : "enabled";
  const approvalDisabledReason =
    approvalSubmitDisabled
      ? acknowledged
        ? "Export approval action is unavailable while the workflow is submitting or already recorded."
        : "Export approval remains blocked until the scoped approval acknowledgement is checked."
      : undefined;

  function openExportApprovalModal() {
    setModalOpen(true);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  function closeExportApprovalModal() {
    setModalOpen(false);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  async function submitExportApproval() {
    if (!acknowledged || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Routing export approval through the existing audit-gated workflow. Close and cancel are blocked until the workflow returns.");

    try {
      const body = await runExportWorkflowCommand({
        command: "APPROVE",
        exportRequestId: currentExport?.id,
        reason: "Compliance approved the redacted export preview through the canonical export workflow API.",
        redactionProfile: currentExport?.redactionProfile ?? "client-safe-redacted",
        roleKey: session.role.key,
        tenantSlug: session.tenant.slug,
      });
      setStatus("success");
      setMessage(uxFeedbackSuccessMessageForSubject("export_approval", { auditEventId: body.auditEventId }));
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No download, share, client acceptance or advice release change was completed.`
          : "Export approval workflow failed without generation, download, share, client acceptance or advice release change.",
      );
    }
  }

  return (
    <WorksurfaceShell
      description="Preview inspection and audit-gated export approval surface kept separate from generation, download, share and client acceptance."
      eyebrow="WP02 Export/Redaction"
      primary={
        <div className="space-y-4">
          <PageLead badge="Approval step" description="Inspect preview and record approval before generation or delivery." icon={PackageCheck} title={title} />
          <Phase5DetailSplitPanel decisionSupport="Preview detail distinguishes inspection, approval, generation and delivery." objectLabel="Export preview split" objectState="Preview inspection pending approval" pageJob="Preview page inspects one package without becoming download or share." safetyBoundary="Preview context cannot generate, download or share packages." splitTaskId="UX-PAGE-SPLIT-005" taskId="UX-PAGE-SPLIT-005" />
          <ExportStageBoundary activeStage="preview" />
          <ExportWorkflowTruthPanel apiState={apiState} loadState={loadState} />
          <Phase6DecisionRoomPanel audit="Approval audit must record scoped package, redaction state, actor and cancel or confirm outcome." blocker="Export approval remains blocked until redaction, policy and audit readiness are complete." cancelLabel="Cancel export approval" confirmLabel="Confirm export approval" decisionLabel="Export approval decision room" evidence="Package summary, forbidden payload checks, redaction review and policy checks are visible before decision." preconditions="Scoped package, forbidden payload pass, redaction review and audit readiness must all pass." safetyNote="No release, export or advice effect can occur until gate preconditions pass and an audit record exists." taskId="UX-DECISION-ROOM-002" />
          <ScfP07P09TrustPanel mode="export" />
          <UxDetailStandardPanel
        actionLabel="Approve export package only"
        actionState="Approval records the approval step only; generation, download, share and client acceptance remain separate."
        evidenceItems={["Export package summary", "Included scoped objects", "Policy checks"]}
        facts={[
          { label: "Export", value: currentExport?.id.slice(0, 8) ?? "EXP-2025" },
          { label: "Type", value: currentExport?.exportType ?? "Regulatory submission" },
          { label: "Included", value: `${snapshot?.summary.included ?? 0} objects` },
          { label: "Binary", value: currentExport?.binaryStatus ?? "Metadata-only" },
        ]}
        objectTitle={currentExport?.fileName ?? "Controlled export package"}
        objectType="Export preview detail"
        routeId="057"
        safetyNote="Preview is inspection only; it is not approval, download, share or downstream advice execution."
        status="Approval required"
        timelineItems={timeline.slice(0, 3).map((item) => item.title)}
      />
        </div>
      }
      routeId="057"
      safetyNote="Preview is inspection only; approval can record only the approval step and cannot download, share, release advice or imply client acceptance."
      statusItems={[
        { label: "Route", tone: "blue", value: "057" },
        { label: "Stage", tone: "gold", value: "approval" },
      ]}
      title={title}
      worksurfaceId="export-redaction-approval"
    >
      <div
        className="mb-5 rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4"
        data-testid="uxp3-export-preview-step-separation"
        data-ux-no-overclaim="true"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <StatePanel
            detail="Preview inspection is not approval. Approval can record only the approval and metadata-generation step; download, share, client acceptance and advice release remain separate controls."
            state="restricted"
            title="Preview separated from delivery"
          />
          <ActionZone placement="inline_cluster" testId="e05-export-approval-open-zone">
            <ActionButton
              lifecycleResult="opens-export-approval-modal"
              lifecycleTrigger="export-approval-modal"
              meaning="export_approval"
              onClick={openExportApprovalModal}
              priority="primary"
              requiresAudit
              requiresConfirmation
              testId="j08-open-export-approval"
            >
              Review export approval
            </ActionButton>
          </ActionZone>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Export Package Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <KeyValueList
              items={[
                { label: "Purpose", value: currentExport?.exportType ?? "Regulatory submission" },
                { label: "Format", value: "Encrypted archive" },
                { label: "Estimated size", value: currentExport?.generatedFileDocumentId ? "Manifest metadata stored" : "Pending generation" },
                { label: "Record count", value: `${snapshot?.summary.included ?? 0} scoped objects` },
                { label: "Binary status", value: <Badge tone="gold">{currentExport?.binaryStatus ?? "Metadata-only"}</Badge> },
                { label: "Classification", value: <Badge tone="red">Confidential</Badge> }
              ]}
            />
            <StatePanel className="mt-5" detail="Preview is not approval. Generation, download and share remain separate." state="restricted" title="Approval still required" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Included Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                ["Selected objects", snapshot?.summary.included ?? 0],
                ["Excluded objects", snapshot?.summary.blocked ?? 0],
                ["Limited/redaction items", snapshot?.summary.limitedIncluded ?? 0],
                ["Audit events", timeline.length],
                ["Active request", snapshot?.summary.activeRequestCount ?? 0],
              ].map(([item, count]) => (
                <div className="flex items-center justify-between rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" key={item}>
                  <span className="text-sm font-semibold text-alphavest-ivory">{item}</span>
                  <span className="text-sm text-alphavest-muted">{count} records</span>
                </div>
              ))}
            </div>
            <AuditTimeline items={timeline.slice(0, 4)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Policy and Compliance Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {previewPolicyChecks.map((check) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" key={check.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-alphavest-ivory">{check.policy}</p>
                    <Badge tone={toneFor(check.state)}>{check.state}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-alphavest-muted">{check.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Data Quality Release Gate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {dataQualityReleaseControls.map((control) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4" key={control.label}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">{control.label}</p>
                  <Badge tone={toneFor(control.state)}>{control.state}</Badge>
                </div>
                <p className="mt-3 text-xl font-semibold text-alphavest-ivory">{control.value}</p>
                <p className="mt-2 text-xs leading-5 text-alphavest-muted">{control.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardHeader><CardTitle>Package Controls</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {exportPackageControls.map((control) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4" key={control.label}>
                <p className="text-sm font-semibold text-alphavest-ivory">{control.label}</p>
                <Badge className="mt-3" tone={toneFor(control.state)}>{control.state}</Badge>
                <p className="mt-3 text-xs leading-5 text-alphavest-muted">{control.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Modal
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Controlled export package</p>
            <p className="text-alphavest-muted">Approval requires policy checks, redaction review and audit trail readiness before download/share actions are allowed.</p>
          </div>
        }
        description="You are about to approve this export package. Generation, download and share remain separate controlled steps."
        footer={
          <>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeExportApprovalModal} type="button">Cancel</button>
            <ActionButton
              availability={approvalActionAvailability}
              disabled={approvalSubmitDisabled}
              disabledReason={approvalDisabledReason}
              lifecycleResult={acknowledged ? "submits-export-approval-only" : "blocked-validation-required"}
              meaning="export_approval"
              onClick={() => {
                void submitExportApproval();
              }}
              placement="modal_footer"
              priority="primary"
              requiresAudit
              requiresConfirmation
              testId="j08-confirm-approval"
            >
              {status === "submitting" ? "Confirming..." : "Confirm Export Approval"}
            </ActionButton>
          </>
        }
        onClose={status === "submitting" ? undefined : closeExportApprovalModal}
        open={modalOpen}
        title="Approve Export Package"
      >
        <div
          className="space-y-4"
          data-testid="uxp3-export-approval-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={validationState}
          data-ux-no-overclaim="true"
        >
          <StatePanel
            detail="Approval can record only the export approval step through /api/export-workflow. Generation, download, share, client acceptance and advice release remain separate controlled events."
            feedback={{
              actionMeaning: "export_approval",
              intent: "validation",
              placement: "modal_body",
              subject: "export_approval",
            }}
            state="restricted"
            title="Approval confirmation"
          />
          <label className="flex items-start gap-3 text-sm leading-6 text-alphavest-muted">
            <input
              checked={acknowledged}
              className="mt-1"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setAcknowledged(event.target.checked)}
              type="checkbox"
            />
            <span>I confirm that I reviewed the scoped export package, redaction state, policy checks and audit readiness; this does not approve download, share, client acceptance or advice release.</span>
          </label>
          {status === "idle" ? (
            <StatePanel
              detail={acknowledged ? "Export approval can be submitted through the canonical export workflow API." : "Export approval remains blocked until the scoped approval acknowledgement is checked."}
              feedback={{
                actionMeaning: "export_approval",
                intent: "validation",
                placement: "modal_status",
                subject: "export_approval",
              }}
              state={acknowledged ? "validation" : "blocked"}
              testId="j08-export-approval-validation-state"
              title={acknowledged ? "Export approval valid" : "Export approval blocked"}
            />
          ) : null}
          {status === "submitting" ? (
            <StatePanel
              detail={message ?? "Routing export approval through /api/export-workflow."}
              feedback={{
                actionMeaning: "export_approval",
                intent: "pending",
                placement: "modal_status",
                subject: "export_approval",
              }}
              state="loading"
              testId="j08-export-approval-loading-state"
              title="Export approval submitting"
            />
          ) : null}
          {status === "success" ? (
            <StatePanel
              detail={message ?? uxFeedbackSuccessMessageForSubject("export_approval")}
              feedback={{
                actionMeaning: "export_approval",
                intent: "success",
                placement: "modal_status",
                subject: "export_approval",
              }}
              state="success"
              testId="j08-export-approval-success-state"
              title="Export approval recorded"
            />
          ) : null}
          {status === "error" ? (
            <StatePanel
              detail={message ?? "Export approval workflow failed without generation, download, share, client acceptance or advice release change."}
              feedback={{
                actionMeaning: "export_approval",
                intent: "fail_closed",
                placement: "modal_status",
                subject: "export_approval",
              }}
              state="error"
              testId="j08-export-approval-error-state"
              title="Export approval failed"
            />
          ) : null}
        </div>
      </Modal>
    </WorksurfaceShell>
  );
}

function ExportDownloadPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const { session } = useDemoSession();
  const [modalOpen, setModalOpen] = useState(visualState === "confirm");
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const { apiState, loadState, snapshot } = useExportWorkflowSnapshot();
  const currentExport = snapshot?.current;
  const timeline = loadState === "error" ? [] : snapshot?.timeline.length ? snapshot.timeline : exportTimeline;
  const lifecycleStatus = status === "submitting" ? "loading" : status;
  const validationState = acknowledged ? "valid-export-download-review" : "blocked-acknowledgement-required";
  const downloadSubmitDisabled = !acknowledged || status === "submitting" || status === "success";
  const downloadActionAvailability =
    status === "submitting"
      ? "loading"
      : status === "success"
        ? "success"
        : status === "error"
          ? "error"
          : downloadSubmitDisabled
            ? "disabled"
            : "enabled";
  const downloadDisabledReason =
    downloadSubmitDisabled
      ? acknowledged
        ? "Download action is unavailable while the workflow is submitting or already recorded."
        : "Download remains blocked until the controlled-download acknowledgement is checked."
      : undefined;

  function openDownloadConfirmation() {
    setModalOpen(true);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  function closeDownloadConfirmation() {
    setModalOpen(false);
    setAcknowledged(false);
    setStatus("idle");
    setMessage(null);
  }

  async function submitExportDownload() {
    if (!acknowledged || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("Recording the controlled export download. Close and cancel are blocked until the workflow returns.");

    try {
      const body = await runExportWorkflowCommand({
        command: "DOWNLOAD",
        exportRequestId: currentExport?.id,
        reason: "Record the controlled export download through the canonical export workflow API.",
        roleKey: session.role.key,
        tenantSlug: session.tenant.slug,
      });
      setStatus("success");
      setMessage(uxFeedbackSuccessMessageForSubject("download", { auditEventId: body.auditEventId }));
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} No download, share, client acceptance or advice release change was completed.`
          : "Export download workflow failed without download, share, client acceptance or advice release change.",
      );
    }
  }

  return (
    <WorksurfaceShell
      description="Controlled download confirmation surface for approved export packages; secure share and client acceptance stay separate."
      eyebrow="WP02 Export/Redaction"
      primary={
        <div className="space-y-4">
          <PageLead badge="Delivery step" description="Download is the next controlled delivery event; share remains separate." icon={Download} title={title} />
          <Phase5DetailSplitPanel decisionSupport="Delivery detail separates approved package, download event and share gate." objectLabel="Export delivery split" objectState="Approved package; share still blocked" pageJob="Download page handles controlled delivery without client acceptance overclaim." safetyBoundary="Delivery detail cannot mark share complete or client acceptance achieved." splitTaskId="UX-PAGE-SPLIT-005" taskId="UX-PAGE-SPLIT-005" />
          <ExportStageBoundary activeStage="package" />
          <ExportWorkflowTruthPanel apiState={apiState} loadState={loadState} />
          <ExportClientPackageProjectionPanel />
          <UxDetailStandardPanel
        actionLabel="Download package"
        actionState="Download is available after approval; secure share remains blocked until download is recorded."
        evidenceItems={["Security and compliance", "Download package", "Share blocked until download"]}
        facts={[
          { label: "Export", value: currentExport?.id.slice(0, 8) ?? "EXP-2025" },
          { label: "Tenant", value: currentExport?.tenant ?? "Client Comms Portfolio Summary" },
          { label: "Format", value: "ZIP manifest package" },
          { label: "Binary", value: currentExport?.binaryStatus ?? "Metadata-only" },
        ]}
        objectTitle={currentExport?.fileName ?? "Watermarked export package"}
        objectType="Export delivery detail"
        routeId="058"
        safetyNote="Download does not imply share or client acceptance and remains separated from preview and approval."
        status="Approved, not downloaded"
        timelineItems={timeline.slice(0, 3).map((item) => item.title)}
      />
        </div>
      }
      routeId="058"
      safetyNote="Download confirmation records only the controlled download event; secure share, recipient access, client acceptance and advice release remain separate controls."
      statusItems={[
        { label: "Route", tone: "blue", value: "058" },
        { label: "Stage", tone: "green", value: "download" },
        { label: "Share", tone: "red", value: "blocked" },
      ]}
      title={title}
      worksurfaceId="export-redaction-download"
    >
      <StatePanel
        className="mb-5"
        detail="The metadata-only export package is approved. Download is the next controlled event; share and client acceptance remain separate."
        state="restricted"
        title="Export approved, download pending"
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  { label: "Export", value: currentExport?.id.slice(0, 8) ?? "EXP-2025-05-21-0087" },
                  { label: "Source", value: currentExport?.tenant ?? "Client Comms Portfolio Summary" },
                  { label: "Requested by", value: "Export workflow actor" },
                  { label: "Prepared", value: currentExport?.requestedAt.slice(0, 16).replace("T", " ") ?? "May 21, 2025 09:42" },
                  { label: "Format", value: "ZIP manifest package" },
                  { label: "Binary status", value: <Badge tone="gold">{currentExport?.binaryStatus ?? "Metadata-only"}</Badge> },
                  { label: "Watermark", value: <Badge tone="green">Enabled</Badge> },
                  { label: "Classification", value: <Badge tone="red">Confidential</Badge> }
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security and Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              {["Data classified and watermarked", "Access check recorded for approved requester", "Forbidden internal payloads excluded", "Download action audited separately", "External sharing blocked until download"].map((item) => (
                <div className="mb-2 flex items-center gap-3 text-sm text-alphavest-muted" key={item}>
                  <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Download Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4">
                <div>
                  <p className="font-semibold text-alphavest-ivory">{currentExport?.fileName ?? "Watermarked export package"}</p>
                  <p className="text-sm text-alphavest-muted">Download pending, delivery action controlled</p>
                </div>
                <ActionButton
                  lifecycleResult="opens-export-download-confirmation"
                  lifecycleTrigger="export-download-confirmation-modal"
                  meaning="download"
                  onClick={openDownloadConfirmation}
                  priority="primary"
                  requiresAudit
                  requiresConfirmation
                  testId="j08-open-download-confirmation"
                >
                  <Download aria-hidden="true" className="size-4" />
                  Download package
                </ActionButton>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Secure Share</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  { label: "Share status", value: "Blocked until download" },
                  { label: "Required event", value: "Download action recorded" },
                  { label: "Access", value: "No external link issued" },
                  { label: "Watermark", value: <Badge tone="green">Prepared</Badge> }
                ]}
              />
              <ActionButton
                availability="disabled"
                className="mt-4 w-full"
                disabled
                disabledReason="Secure share is blocked until the download event is recorded and audited."
                meaning="share"
                priority="secondary"
                requiresAudit
                requiresConfirmation
                testId="j08-share-export"
                visibleDisabledReason
              >
                Share after download
              </ActionButton>
              <StatePanel
                className="mt-4"
                detail="Record the package download before creating an external share."
                feedback={{
                  actionMeaning: "share",
                  intent: "blocked",
                  placement: "inline_cluster",
                  subject: "share",
                }}
                state="blocked"
                title="Share blocked"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Export Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTimeline items={timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Watermarked export package</p>
            <p className="text-alphavest-muted">Download requires explicit confirmation and audit recording before any share action can be considered.</p>
          </div>
        }
        description="You are about to record a controlled export download. Share and client acceptance remain separate."
        footer={
          <>
            <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={closeDownloadConfirmation} type="button">Cancel</button>
            <ActionButton
              availability={downloadActionAvailability}
              disabled={downloadSubmitDisabled}
              disabledReason={downloadDisabledReason}
              lifecycleResult={acknowledged ? "submits-controlled-download-only" : "blocked-validation-required"}
              meaning="download"
              onClick={() => {
                void submitExportDownload();
              }}
              placement="modal_footer"
              priority="primary"
              requiresAudit
              requiresConfirmation
              testId="j08-download-export"
            >
              {status === "submitting" ? "Recording..." : "Confirm controlled download"}
            </ActionButton>
          </>
        }
        onClose={status === "submitting" ? undefined : closeDownloadConfirmation}
        open={modalOpen}
        title="Confirm Export Download"
      >
        <div
          className="space-y-4"
          data-testid="uxp3-export-download-lifecycle"
          data-ux-lifecycle-status={lifecycleStatus}
          data-ux-lifecycle-validation={validationState}
          data-ux-no-overclaim="true"
        >
          <StatePanel
            detail="Download confirmation records only the controlled download event. It cannot create a share link, imply client acceptance or release advice."
            feedback={{
              actionMeaning: "download",
              intent: "validation",
              placement: "modal_body",
              subject: "download",
            }}
            state="restricted"
            title="Download confirmation"
          />
          <label className="flex items-start gap-3 text-sm leading-6 text-alphavest-muted">
            <input
              checked={acknowledged}
              className="mt-1"
              disabled={status === "submitting" || status === "success"}
              onChange={(event) => setAcknowledged(event.target.checked)}
              type="checkbox"
            />
            <span>I understand this records only the watermarked export download; secure share, recipient access, client acceptance and advice release remain separate controls.</span>
          </label>
          {status === "idle" ? (
            <StatePanel
              detail={acknowledged ? "Controlled download can be recorded through the canonical export workflow API." : "Download remains blocked until the controlled-download acknowledgement is checked."}
              feedback={{
                actionMeaning: "download",
                intent: "validation",
                placement: "modal_status",
                subject: "download",
              }}
              state={acknowledged ? "validation" : "blocked"}
              testId="j08-export-download-validation-state"
              title={acknowledged ? "Download confirmation valid" : "Download confirmation blocked"}
            />
          ) : null}
          {status === "submitting" ? (
            <StatePanel
              detail={message ?? "Recording the controlled export download."}
              feedback={{
                actionMeaning: "download",
                intent: "pending",
                placement: "modal_status",
                subject: "download",
              }}
              state="loading"
              testId="j08-export-download-loading-state"
              title="Download recording"
            />
          ) : null}
          {status === "success" ? (
            <StatePanel
              detail={message ?? uxFeedbackSuccessMessageForSubject("download")}
              feedback={{
                actionMeaning: "download",
                intent: "success",
                placement: "modal_status",
                subject: "download",
              }}
              state="success"
              testId="j08-export-download-success-state"
              title="Download recorded"
            />
          ) : null}
          {status === "error" ? (
            <StatePanel
              detail={message ?? "Export download workflow failed without download, share, client acceptance or advice release change."}
              feedback={{
                actionMeaning: "download",
                intent: "fail_closed",
                placement: "modal_status",
                subject: "download",
              }}
              state="error"
              testId="j08-export-download-error-state"
              title="Download failed closed"
            />
          ) : null}
        </div>
      </Modal>
    </WorksurfaceShell>
  );
}

function OpsQueuesPage({ title }: { title: string }) {
  const { loadState, snapshot } = useOpsSlaSnapshot();
  const rows = snapshot?.queueRows.length ? snapshot.queueRows : queueRows;
  const metrics = snapshot?.metrics.length ? snapshot.metrics : opsMetrics;
  const columns: Array<DataTableColumn<(typeof rows)[number]>> = [
    { key: "queue", header: "Queue", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.queue}</span> },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    {
      key: "mix",
      header: "Priority Mix",
      render: (row) => (
        <div className="space-y-1">
          <ProgressBar tone="red" value={row.high} />
          <p className="text-xs text-alphavest-subtle">H {row.high}% / M {row.medium}% / L {row.low}%</p>
        </div>
      )
    },
    { key: "backlog", header: "Backlog", render: (row) => row.backlog },
    { key: "overdue", header: "Overdue", render: (row) => <span className={row.overdue > 25 ? "text-alphavest-red" : "text-alphavest-green"}>{row.overdue}</span> },
    { key: "sla", header: "SLA", render: (row) => <Badge tone={row.sla < 85 ? "red" : "green"}>{row.sla}%</Badge> },
    { key: "capacity", header: "Capacity", render: (row) => row.capacity },
    { key: "trend", header: "Trend", render: (row) => <MiniTrend tone={row.status === "Overload" || row.status === "Error" ? "red" : "green"} /> },
    { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
  ];

  return (
    <div>
      <PageLead description="Monitor workloads, manage backlogs and meet SLA commitments." icon={Gauge} title={title} />
      <UxHubPage pageId="059" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-alphavest-muted">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
              <p className={cn("mt-2 text-sm", toneFor(metric.tone) === "red" ? "text-alphavest-red" : "text-alphavest-muted")}>{metric.delta}</p>
              </div>
              <IconTile tone={metric.tone as BadgeTone}>
                <Calendar aria-hidden="true" className="size-5" />
              </IconTile>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Queue Overview</CardTitle>
          <div className="flex flex-wrap gap-2">
            <button aria-label="Queue filters are not wired in this release" className={secondaryButtonClass} disabled title="Queue filters are not wired in this release." type="button">
              <Filter aria-hidden="true" className="size-4" />
              Filters
            </button>
            <span className={primaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
              <Plus aria-hidden="true" className="size-4" />
              Queue creation held
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            emptyMessage={loadState === "error" ? "Ops queues could not be loaded from the DB." : "No tenant-scoped queue rows are open."}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Release Support Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {dataQualityReleaseControls.map((control) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4" key={control.label}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">{control.label}</p>
                  <Badge tone={toneFor(control.state)}>{control.state}</Badge>
                </div>
                <p className="mt-3 text-xl font-semibold text-alphavest-ivory">{control.value}</p>
                <p className="mt-2 text-xs leading-5 text-alphavest-muted">{control.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SlaEscalationPage({ title }: { title: string }) {
  const { loadState, snapshot } = useOpsSlaSnapshot();
  const rows = snapshot?.breachRows.length ? snapshot.breachRows : breachRows;
  const metrics = snapshot?.slaMetrics.length ? snapshot.slaMetrics : slaMetrics;
  const escalationSummary = snapshot?.escalationSummary;
  const unitHealth = snapshot?.unitHealth.length ? snapshot.unitHealth : [
    { label: "Private Wealth", value: 95 },
    { label: "Institutional", value: 92 },
    { label: "Operations", value: 90 },
    { label: "Advisory", value: 89 },
    { label: "Platform Services", value: 96 },
  ];
  const columns: Array<DataTableColumn<(typeof rows)[number]>> = [
    { key: "id", header: "ID", render: (row) => row.id },
    { key: "service", header: "Service", render: (row) => row.service },
    { key: "obligation", header: "Obligation", render: (row) => row.obligation },
    { key: "client", header: "Client", render: (row) => row.client },
    { key: "due", header: "Due", render: (row) => row.due },
    { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
    { key: "severity", header: "Severity", render: (row) => <Badge tone={toneFor(row.severity)}>{row.severity}</Badge> },
    { key: "elapsed", header: "Elapsed", render: (row) => row.elapsed },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    { key: "escalation", header: "Escalation", render: (row) => <Badge tone="purple">{row.escalation}</Badge> }
  ];

  return (
    <div>
      <PageLead description="Monitor service levels, manage breaches and drive timely resolution." icon={LineChart} title={title} />
      <Phase4WorkbenchPanel activeTask="SLA breach OPS-14 selected" blocker="Operational escalation cannot approve advice, release content, export packages or client visibility." context="Support owner reviews breach cause, recovery plan and compliance blockers before escalation." primaryAction="Escalate recovery owner" queueLabel="Ops SLA queue" safetyNote="UX-WORKBENCH-006: ops recovery work routes blockers but never bypasses advice, compliance, evidence or export gates." taskId="UX-WORKBENCH-006" />
      <Phase5DetailSplitPanel decisionSupport="SLA detail explains breach cause, owner and recovery plan without acting as decision gate." objectLabel="SLA breach object review" objectState="Breach active; recovery owner required" pageJob="Ops SLA detail handles one breach separately from ops queue and communication context." safetyBoundary="Ops detail cannot approve advice, release content or export packages." splitTaskId="UX-PAGE-SPLIT-008" taskId="UX-PAGE-SPLIT-008" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-alphavest-muted">{metric.label}</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
                <p className="mt-1 text-sm text-alphavest-muted">{metric.state}</p>
              </div>
              <MiniTrend tone={metric.tone as BadgeTone} />
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Active Breaches and Risks</CardTitle>
            <span className={primaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Escalation creation held</span>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              emptyMessage={loadState === "error" ? "SLA rows could not be loaded from the DB." : "No active SLA breaches for this tenant."}
              getRowId={(row) => row.id}
              rows={rows}
            />
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  { label: "Total", value: <Badge tone="red">{escalationSummary?.total ?? 12}</Badge> },
                  { label: "L1", value: String(escalationSummary?.l1 ?? 7) },
                  { label: "L2", value: String(escalationSummary?.l2 ?? 4) },
                  { label: "L3", value: String(escalationSummary?.l3 ?? 1) },
                  { label: "Auto", value: String(escalationSummary?.auto ?? 5) }
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>SLA Health by Unit</CardTitle>
            </CardHeader>
            <CardContent>
              {unitHealth.map((unit) => (
                <div className="mb-4" key={unit.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-alphavest-muted">{unit.label}</span>
                    <span className="text-alphavest-ivory">{unit.value}%</span>
                  </div>
                  <ProgressBar tone={unit.value < 90 ? "gold" : "green"} value={unit.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ServiceBlueprintPage({ title }: { title: string }) {
  return (
    <div>
      <PageLead description="Read-only internal reference for service stages, operational handoffs and record touchpoints." icon={Network} title={title} />
      <StatePanel className="mb-5" detail="Reference only. No workflow action, approval, export or client-visible change is available here." state="reference-only" title="Read-only reference" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {blueprintStages.map((stage, stageIndex) => (
          <section className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-4" key={stage}>
            <h3 className="font-semibold text-alphavest-ivory">{stage}</h3>
            <div className="mt-4 grid gap-3">
              {blueprintRows.map((row, rowIndex) => (
                <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/55 p-3" key={`${stage}-${row.lane}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{row.lane}</p>
                  <p className="mt-1 text-sm leading-5 text-alphavest-muted">{row.cells[stageIndex]}</p>
                  {rowIndex > 0 ? <Badge className="mt-3" tone="gold">Handoff</Badge> : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RoadmapPage({ title }: { title: string }) {
  return (
    <div>
      <PageLead description="Read-only internal reference for MVP boundaries and later-scope items." icon={GitBranch} title={title} />
      <StatePanel className="mb-5" detail="Reference only. Listed items do not create product workflow, release, advice or client visibility." state="reference-only" title="Read-only scope reference" />
      <div className="grid gap-5 xl:grid-cols-3">
        {roadmapColumns.map((column) => (
          <Card key={column.id}>
            <CardHeader className="text-center">
              <CardTitle>{column.title}</CardTitle>
              <p className="mt-1 text-sm text-alphavest-gold">{column.period}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {column.items.map((item) => (
                  <div className={cn("rounded-md border p-4", item.status === "Blocked" ? "border-alphavest-red/45 bg-alphavest-red/10" : "border-alphavest-border bg-alphavest-charcoal/50")} key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-alphavest-gold">{item.id}</p>
                        <h3 className="mt-1 font-semibold text-alphavest-ivory">{item.title}</h3>
                      </div>
                      <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-alphavest-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reference Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                ["16", "Total items"],
                ["24", "Dependencies"],
                ["2", "Blocked"],
                ["1", "At risk"]
              ].map(([value, label]) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4" key={label}>
                  <p className="text-2xl font-semibold text-alphavest-gold">{value}</p>
                  <p className="text-sm leading-5 text-alphavest-muted">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scope Decision Register</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable compact columns={[
              { key: "id", header: "ID", render: (row) => row.id },
              { key: "title", header: "Decision", render: (row) => row.title },
              { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
            ]} getRowId={(row) => row.id} rows={[
              { id: "DEC-042", title: "Defer AI insights to future", status: "Approved" },
              { id: "DEC-041", title: "Block proposals until No Advice Gate complete", status: "Approved" },
              { id: "DEC-040", title: "MVP scope locked", status: "Approved" }
            ]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatesReferencePage({ title }: { title: string }) {
  return (
    <div>
      <PageLead description="Read-only internal reference for status chips, workflow badges and component states." icon={Table2} title={title} />
      <StatePanel className="mb-5" detail="Reference only. Examples do not change workflow status." state="reference-only" title="Read-only state reference" />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status Chips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {stateChips.map((chip) => <Badge key={chip} tone={toneFor(chip)}>{chip}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workflow Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {workflowBadges.map((badge) => <Badge key={badge} tone={toneFor(badge)}>{badge}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Component States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <StatePanel detail="Default reference styling for neutral content." state="empty" title="Default" />
              <StatePanel detail="Content is loading." state="loading" title="Loading" />
              <StatePanel detail="Restricted examples show blocked state only." state="restricted" title="Restricted" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {["Client Onboarding Lifecycle", "Export Lifecycle"].map((machine, machineIndex) => (
          <Card key={machine}>
            <CardHeader>
              <CardTitle>{machine}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                {(machineIndex === 0 ? ["Not Started", "In Progress", "Review", "Approved", "Active"] : ["Draft", "Submitted", "Accepted", "Generated", "Downloaded"]).map((state, index, states) => (
                  <div className="flex items-center gap-3" key={state}>
                    <Badge tone={toneFor(state)}>{state}</Badge>
                    {index < states.length - 1 ? <ArrowRight aria-hidden="true" className="size-4 text-alphavest-muted" /> : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>State Catalogue Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable compact columns={[
            { key: "code", header: "State Code", render: (row) => row.code },
            { key: "name", header: "State Name", render: (row) => row.name },
            { key: "category", header: "Category", render: (row) => row.category },
            { key: "type", header: "Type", render: (row) => row.type },
            { key: "usedIn", header: "Used In", render: (row) => row.usedIn },
            { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
          ]} getRowId={(row) => row.id} rows={stateCatalogueRows} />
        </CardContent>
      </Card>
    </div>
  );
}

function CommunicationExportOpsPageBody({ route, visualState }: { route: ScreenRoute; visualState?: VisualState }) {
  switch (route.pageId) {
    case "051":
      return <AuditHistoryPage title={route.title} visualState={visualState} />;
    case "052":
      return <CommunicationCentrePage title={route.title} />;
    case "053":
      return <CallTriggerMatrixPage title={route.title} />;
    case "054":
      return <ExportNewPage title={route.title} />;
    case "055":
      return <ExportScopePage title={route.title} />;
    case "056":
      return <ExportRedactionPage title={route.title} />;
    case "057":
      return <ExportPreviewPage title={route.title} visualState={visualState} />;
    case "058":
      return <ExportDownloadPage title={route.title} visualState={visualState} />;
    case "059":
      return <OpsQueuesPage title={route.title} />;
    case "060":
      return <SlaEscalationPage title={route.title} />;
    case "061":
      return <ServiceBlueprintPage title={route.title} />;
    case "062":
      return <RoadmapPage title={route.title} />;
    case "063":
      return <StatesReferencePage title={route.title} />;
    default:
      return <StatePanel detail="This registered route is not available in this component." state="error" title="Unknown route" />;
  }
}

export function CommunicationExportOpsScreen({ route, visualState }: CommunicationExportOpsScreenProps) {
  return (
    <Phase13Shell route={route}>
      <CommunicationExportOpsPageBody route={route} visualState={visualState} />
    </Phase13Shell>
  );
}
