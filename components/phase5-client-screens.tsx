"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  auditForRecord,
  canShowAdviceLikeContent,
  clientActions,
  decisionPermission,
  decisionRelease,
  evidenceAccess,
  evidenceLinkFor,
  evidenceRecords,
  releasedRecommendation,
  sensitiveNodeAccess,
  type ClientAction
} from "@/lib/phase5-client-model";
import {
  cn,
  DashboardTable,
  Drawer,
  GlassPanel,
  MetricCard,
  RoleBadge,
  StatusChip,
  WorkflowBadge
} from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "review";

const filterButton =
  "rounded-lg border border-av-line px-3 py-2 text-xs text-av-muted transition hover:border-av-gold hover:text-av-ivory";
const activeFilterButton =
  "border-av-gold bg-av-gold text-av-midnight hover:text-av-midnight";

function ClientRouteShell({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[104rem] gap-6">
        {children}
      </div>
    </article>
  );
}

function queryState<T extends string>(value: string | null, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function MobileAppSurface({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-[28rem] bg-av-navy px-4 py-5 text-av-ivory md:min-h-[calc(100vh-2rem)] md:rounded-lg md:border md:border-av-line">
      {children}
    </main>
  );
}

function MobileNav() {
  return (
    <nav className="mt-5 grid grid-cols-3 gap-2 border-t border-av-line/60 pt-3 text-center text-[0.68rem] text-av-muted">
      {[
        ["Home", "/mobile"],
        ["Upload", "/mobile/upload"],
        ["Decide", "/decisions"]
      ].map(([label, href]) => (
        <Link className="rounded border border-av-line/45 px-1 py-2 hover:border-av-gold" href={href} key={label}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileScreenV2() {
  const searchParams = useSearchParams();
  const state = queryState(searchParams.get("state"), ["default", "blocked", "empty", "decision"] as const, "default");
  const { snapshot } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const released = recommendation
    ? recommendation.clientVisibilityState === "released" && recommendation.advisorApproval && recommendation.complianceRelease
    : canShowAdviceLikeContent(releasedRecommendation);

  return (
    <MobileAppSurface>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl text-av-goldBright">Good morning, Alex</p>
          <p className="mt-1 text-xs text-av-muted">Next step today</p>
        </div>
        <RoleBadge role="Principal" sublabel="Full client view" tone="success" />
      </div>

      {state === "default" ? (
        <div className="mt-5 grid gap-3">
          <Link className="rounded-lg border border-av-gold bg-av-gold/12 p-4" href="/mobile/upload">
            <span className="block text-sm font-semibold text-av-ivory">Upload updated trust deed</span>
            <span className="mt-1 block text-xs text-av-muted">Needed before the Trust X review can close.</span>
          </Link>
          <Link className="rounded-lg border border-av-line bg-av-midnight/60 p-4" href="/decisions">
            <span className="block text-sm font-semibold text-av-ivory">
              {released ? "Decision pack ready" : "Decision pack awaiting release"}
            </span>
            <span className="mt-1 block text-xs text-av-muted">
              Runtime state: {recommendation?.state ?? "seed loading"}.
            </span>
          </Link>
        </div>
      ) : null}

      {state === "blocked" ? (
        <div className="mt-5 rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
          <StatusChip tone="danger">Recommendation blocked</StatusChip>
          <p className="mt-3 text-sm text-av-ivory">A recommendation is in review but cannot be shown yet.</p>
          <p className="mt-2 text-xs text-av-muted">
            Client visibility is blocked until compliance release is complete.
          </p>
        </div>
      ) : null}

      {state === "empty" ? (
        <div className="mt-5 rounded-lg border border-av-success/60 bg-av-success/10 p-5 text-center">
          <p className="font-display text-xl text-av-goldBright">All caught up</p>
          <p className="mt-2 text-xs text-av-muted">No open client actions right now.</p>
        </div>
      ) : null}

      {state === "decision" ? (
        <div className="mt-5 rounded-lg border border-av-gold bg-av-gold/12 p-4">
          <StatusChip tone="warning">Decision notification</StatusChip>
          <p className="mt-3 text-sm text-av-ivory">Trust X beneficiary update is ready for review.</p>
          <Link className="mt-4 inline-flex rounded-lg border border-av-gold px-3 py-2 text-xs text-av-goldBright" href="/decisions">
            Open Decision Room
          </Link>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs">
        <Link className="rounded border border-av-line/50 px-3 py-2 text-av-muted" href="/governance">
          Governance access
        </Link>
      </div>
      <MobileNav />
    </MobileAppSurface>
  );
}

export function MobileUploadScreenV2() {
  const searchParams = useSearchParams();
  const step = queryState(searchParams.get("state"), ["select", "extract", "low", "pending", "error"] as const, "select");
  const [docType, setDocType] = useState("Trust deed");
  const [runtimeStep, setRuntimeStep] = useState(step);
  const { snapshot, transition, error } = useDemoSession();
  const documentWorkflow = findDemoWorkflow(snapshot, "wf-trust-deed-document");

  return (
    <MobileAppSurface>
      {runtimeStep === "select" ? (
        <>
          <p className="font-display text-xl text-av-goldBright">Select document type</p>
          <div className="mt-4 grid gap-2">
            {["Trust deed", "Passport", "Portfolio statement", "Insurance policy", "Tax residency certificate"].map((type) => (
              <button
                className={cn("rounded-lg border px-3 py-2 text-left text-sm", docType === type ? "border-av-gold bg-av-gold/15 text-av-ivory" : "border-av-line text-av-muted")}
                key={type}
                onClick={() => setDocType(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {["Camera", "Files", "Import"].map((source) => (
              <Link className="rounded-lg border border-av-line p-3 text-av-muted" href="/mobile/upload?state=extract" key={source}>
                {source}
              </Link>
            ))}
          </div>
        </>
      ) : null}

          {runtimeStep === "extract" ? (
            <>
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-av-goldBright">Extraction review</p>
                <WorkflowBadge label="AI-DRAFT" />
              </div>
              <div className="mt-4 grid gap-2 text-xs">
                {[
                  ["Document type", docType],
                  ["Entity", "Trust X"],
                  ["Jurisdiction", "BVI"],
                  ["Expiry / review date", "18 Jun 2027"],
                  ["Confidence", "92%"]
                ].map(([label, value]) => (
                  <div className="flex justify-between rounded border border-av-line bg-av-midnight/50 px-3 py-2" key={label}>
                    <span className="text-av-muted">{label}</span>
                    <span className="text-av-ivory">{value}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 block w-full rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-center text-sm font-semibold text-av-midnight"
                onClick={async () => {
                  const result = await transition({
                    action: "document.confirm_extraction",
                    actorRole: "AlphaVest Analyst"
                  });
                  if (result) {
                    setRuntimeStep("pending");
                  }
                }}
                type="button"
              >
                Confirm extraction
              </button>
              {error ? <p className="mt-2 text-xs text-av-danger">{error}</p> : null}
            </>
          ) : null}

          {runtimeStep === "low" ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-sm text-av-ivory">Low confidence extraction blocked submission.</p>
              <p className="mt-2 text-xs text-av-muted">Confidence is 61%. Analyst review is required before this can support advice or a decision.</p>
              <p className="mt-4 rounded-lg border border-av-danger px-3 py-2 text-xs text-av-danger">
                AlphaVest review required.
              </p>
            </div>
          ) : null}

          {runtimeStep === "pending" ? (
            <div className="rounded-lg border border-av-warning/60 bg-av-warning/10 p-4">
              <StatusChip tone="warning">Verification pending</StatusChip>
              <p className="mt-3 text-sm text-av-ivory">The document is uploaded and queued for analyst validation.</p>
              <p className="mt-2 text-xs text-av-muted">
                Runtime state: {documentWorkflow?.state ?? "under review"}. We will notify you when verification is complete.
              </p>
            </div>
          ) : null}

          {runtimeStep === "error" ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <StatusChip tone="danger">Upload error</StatusChip>
              <p className="mt-3 text-sm text-av-ivory">The file could not be processed.</p>
              <Link className="mt-4 block w-full rounded-lg border border-av-gold px-3 py-2 text-center text-xs text-av-goldBright" href="/mobile/upload">
                Retry upload
              </Link>
            </div>
          ) : null}
          <MobileNav />
    </MobileAppSurface>
  );
}

export function PortalScreenV2() {
  const searchParams = useSearchParams();
  const state = queryState(searchParams.get("state"), ["default", "loading", "error", "blocked"] as const, "default");

  return (
    <ClientRouteShell>
      {state === "loading" ? <GlassPanel title="Loading"><p className="text-av-muted">Loading client dashboard...</p></GlassPanel> : null}
      {state === "error" ? <GlassPanel title="Error"><p className="text-av-danger">Dashboard data could not be loaded. Retry or contact the advisory team.</p></GlassPanel> : null}
      {state === "blocked" ? <GlassPanel title="Permission blocked"><p className="text-av-muted">Your current role cannot view this client dashboard.</p></GlassPanel> : null}

      {state === "default" ? (
        <>
          <GlassPanel title="Overview">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-av-line/60 bg-av-midnight/45 px-4 py-3">
              <p className="text-av-muted">Good morning, Alex. Visibility score is not advice.</p>
              <StatusChip tone="info">Last updated today</StatusChip>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Link href="/wealth-map?focus=gaps">
                <MetricCard detail="Focused gaps available" label="Readiness score" value="72%" />
              </Link>
              <MetricCard detail="1 blocked by evidence" label="Open actions" tone="danger" value="3" />
              <MetricCard detail="1 ready / 1 blocked" label="Pending decisions" tone="warning" value="2" />
              <MetricCard detail="Trust deed and tax cert" label="Missing documents" tone="danger" value="2" />
              <MetricCard detail="Next: Trust X review" label="Upcoming reviews" tone="info" value="3" />
            </div>
          </GlassPanel>
          <div className="grid gap-5 xl:grid-cols-2">
            <GlassPanel title="Advisor Messages">
              <DashboardTable columns={["Message", "Owner", "When"]} rows={[["Trust X review pack is released", "Sarah Chen", "Today"], ["Upload request: tax certificate", "Client Success", "Yesterday"]]} />
            </GlassPanel>
            <GlassPanel title="Trigger Feed">
              <DashboardTable columns={["Trigger", "State", "Route"]} rows={[["Trust deed missing", "Review point", "/actions"], ["Beneficiary conflict", "Call trigger", "/wealth-map"], ["Coverage review due", "Evidence pending", "/mobile/upload"]]} />
            </GlassPanel>
            <GlassPanel title="Evidence Status">
              <DashboardTable columns={["Bucket", "Count"]} rows={[["Validated", "18"], ["Under review", "4"], ["Missing", "2"], ["Restricted", "1"]]} />
            </GlassPanel>
            <GlassPanel title="Governance Status">
              <DashboardTable columns={["Area", "Status"]} rows={[["Family council", "Active"], ["Decision rights", "Complete"], ["External access", "Second confirmation required"]]} />
            </GlassPanel>
          </div>
        </>
      ) : null}
    </ClientRouteShell>
  );
}

type WealthNode = {
  id: string;
  label: string;
  detail: string;
  kind: "Entity" | "Asset" | "Document" | "Decision" | "Person";
  position: string;
  restricted?: boolean;
};

const wealthNodes: WealthNode[] = [
  { id: "trust-x", label: "Trust X", detail: "BVI entity", kind: "Entity", position: "left-[44%] top-[40%]" },
  { id: "portfolio", label: "Portfolio", detail: "$245.3M", kind: "Asset", position: "left-[16%] top-[18%]" },
  { id: "real-estate", label: "Real Estate", detail: "$68.2M", kind: "Asset", position: "left-[10%] top-[56%]" },
  { id: "trust-deed", label: "Trust deed", detail: "Validated", kind: "Document", position: "left-[55%] top-[74%]" },
  { id: "decision", label: "Beneficiary update", detail: "Ready", kind: "Decision", position: "left-[70%] top-[24%]" },
  { id: "beneficiary", label: "Beneficiary note", detail: "Restricted", kind: "Person", position: "left-[73%] top-[60%]", restricted: true }
];

export function WealthMapScreenV2({ initialFocus }: { initialFocus?: string }) {
  const [selected, setSelected] = useState<WealthNode>(wealthNodes[0]);
  const [filter, setFilter] = useState("All");
  const access = sensitiveNodeAccess("Next Gen");
  const focused = initialFocus === "gaps";

  return (
    <ClientRouteShell>
      <GlassPanel title="Filters">
        <div className="flex flex-wrap gap-2">
          {["All", "Entities", "Assets", "Documents", "Decisions", "Restricted"].map((item) => (
            <button className={cn(filterButton, filter === item && activeFilterButton)} key={item} onClick={() => setFilter(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel className="min-h-[38rem]" title="Structure Graph">
          <div className="relative h-[34rem] overflow-hidden rounded-lg border border-av-line bg-av-midnight/60">
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <line x1="49%" y1="46%" x2="22%" y2="24%" stroke="rgba(240,201,133,.45)" />
              <line x1="49%" y1="46%" x2="16%" y2="62%" stroke="rgba(240,201,133,.45)" />
              <line x1="49%" y1="46%" x2="61%" y2="78%" stroke="rgba(100,181,246,.5)" strokeDasharray="6 6" />
              <line x1="49%" y1="46%" x2="76%" y2="30%" stroke="rgba(240,201,133,.45)" />
              <line x1="49%" y1="46%" x2="78%" y2="66%" stroke="rgba(239,83,80,.55)" />
            </svg>
            {wealthNodes
              .filter((node) => filter === "All" || filter === `${node.kind}s` || (filter === "Restricted" && node.restricted))
              .map((node) => (
                <button
                  className={cn(
                    "absolute grid min-h-24 w-32 place-items-center rounded-full border bg-av-panel/95 p-3 text-center text-xs transition hover:border-av-gold",
                    node.position,
                    selected.id === node.id ? "border-av-gold text-av-goldBright shadow-glow" : "border-av-line text-av-muted",
                    focused && ["trust-deed", "beneficiary"].includes(node.id) && "ring-2 ring-av-danger/70"
                  )}
                  key={node.id}
                  onClick={() => setSelected(node)}
                  type="button"
                >
                  <span className="block font-semibold text-av-ivory">{node.label}</span>
                  <span>{node.restricted ? "Restricted" : node.detail}</span>
                </button>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-av-muted">
            <StatusChip tone="warning">ownership</StatusChip>
            <StatusChip tone="info">evidence link</StatusChip>
            <StatusChip tone="danger">restricted relationship</StatusChip>
            <StatusChip tone="review">decision dependency</StatusChip>
          </div>
        </GlassPanel>

        <Drawer title={selected.label}>
          {selected.restricted && !access.allowed ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-3">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-sm text-av-ivory">Sensitive fields are hidden for this role.</p>
              <p className="mt-2 text-xs text-av-muted">Reason: {access.reason}. Request access or use a permitted role.</p>
            </div>
          ) : (
            <DashboardTable
              columns={["Field", "Detail"]}
              rows={[
                ["Type", selected.kind],
                ["Status", selected.detail],
                ["Evidence", "evidence://document-file/evidence-trust-deed"],
                ["Audit", "client.viewed sensitive node"],
                ["Review", selected.id === "trust-x" ? "Trustee / beneficiary conflict escalated" : "Standard review"]
              ]}
            />
          )}
          <div className="mt-4 rounded-lg border border-av-warning/60 bg-av-warning/10 p-3 text-sm text-av-muted">
            Trustee / beneficiary escalation is open. Call trigger is recommended before any family-visible update.
          </div>
        </Drawer>
      </div>
    </ClientRouteShell>
  );
}

function ActionCard({ action, selected, onSelect }: { action: ClientAction; selected: boolean; onSelect: () => void }) {
  const tone: Tone = action.status === "Blocked" ? "danger" : action.status === "Ready" ? "success" : "warning";

  return (
    <button className={cn("rounded-lg border p-3 text-left text-xs transition", selected ? "border-av-gold bg-av-gold/15" : "border-av-line/60 bg-av-panel/55 hover:border-av-gold")} onClick={onSelect} type="button">
      <span className="block text-sm font-semibold text-av-ivory">{action.title}</span>
      <span className="mt-1 block text-av-muted">{action.summary}</span>
      <span className="mt-2 flex flex-wrap gap-1">
        <StatusChip tone={tone}>{action.status}</StatusChip>
        <StatusChip tone={action.evidenceStatus === "Missing" ? "danger" : "info"}>{action.evidenceStatus}</StatusChip>
      </span>
    </button>
  );
}

export function ActionsScreenV2() {
  const [selectedId, setSelectedId] = useState(clientActions[0].id);
  const { snapshot } = useDemoSession();
  const selected = clientActions.find((action) => action.id === selectedId) ?? clientActions[0];
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const columns = ["Needs Review", "Blocked", "Ready", "Pending", "Completed"] as const;

  return (
    <ClientRouteShell>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Kanban">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {columns.map((column) => (
              <div className="rounded-lg border border-av-line bg-av-midnight/40 p-2" key={column}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-lg text-av-goldBright">{column}</p>
                  <StatusChip tone="info">{clientActions.filter((action) => action.status === column).length}</StatusChip>
                </div>
                <div className="grid gap-2">
                  {clientActions.filter((action) => action.status === column).map((action) => (
                    <ActionCard action={action} key={action.id} onSelect={() => setSelectedId(action.id)} selected={selected.id === action.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <Drawer title={selected.title}>
          <DashboardTable
            columns={["Field", "Value"]}
            rows={[
              ["Owner", selected.owner],
              ["Due", selected.due],
              ["Related object", selected.relatedObject],
              ["Evidence", selected.evidenceStatus],
              ["Runtime workflow", recommendation ? `${recommendation.workflow} / ${recommendation.state}` : "Loading demo session"],
              ["Mini workflow", selected.status === "Blocked" ? "Evidence missing -> analyst review -> advisor review" : "Open -> review -> complete"]
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.triggers.map((trigger) => <WorkflowBadge key={trigger} label={trigger} />)}
            {selected.status === "Blocked" ? <WorkflowBadge label="BLOCKED" /> : null}
          </div>
          {selected.status === "Blocked" ? (
            <p className="mt-4 rounded-lg border border-av-danger/70 bg-av-danger/10 p-3 text-sm text-av-danger">
              Blocked: missing evidence must be supplied before this action can advance.
            </p>
          ) : null}
          {selected.href ? <Link className="mt-4 inline-flex rounded-lg border border-av-gold px-4 py-2 text-sm text-av-goldBright" href={selected.href}>Open linked route</Link> : null}
        </Drawer>
      </div>
    </ClientRouteShell>
  );
}

export function DecisionsScreenV2() {
  const searchParams = useSearchParams();
  const [state, setState] = useState(queryState(searchParams.get("state"), ["ready", "blocked", "submitted"] as const, "ready"));
  const [choice, setChoice] = useState<"accepted" | "deferred" | "rejected">("accepted");
  const [evidencePreviewOpen, setEvidencePreviewOpen] = useState(false);
  const { snapshot, transition, error } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const permission = decisionPermission(state === "blocked" ? "External Advisor" : "Principal");
  const runtimeVisible =
    recommendation?.advisorApproval &&
    recommendation.complianceRelease &&
    recommendation.evidenceRecordExists &&
    recommendation.permissionCheck &&
    recommendation.clientVisibilityState === "released";
  const showRecommendation = state !== "blocked" && (runtimeVisible ?? decisionRelease.clientVisible);

  return (
    <main className="grid min-h-screen place-items-center bg-av-midnight/80 px-4 py-8 text-av-ivory">
      <section className="w-full max-w-3xl rounded-lg border border-av-line bg-av-panel p-5 shadow-panel">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-av-line/50 pb-3">
          <div>
            <p className="font-display text-2xl text-av-goldBright">Trust X Beneficiary Update</p>
            <p className="mt-1 text-sm text-av-muted">Family decision request</p>
          </div>
          <StatusChip tone={state === "blocked" ? "danger" : state === "submitted" ? "success" : "warning"}>
            {state === "blocked" ? "Blocked" : state === "submitted" ? "Submitted" : "Ready"}
          </StatusChip>
        </div>

        <div className="grid gap-5">
          {state === "blocked" || !permission.allowed ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-av-ivory">Decision room is blocked for the current permission context.</p>
              <p className="mt-2 text-sm text-av-muted">Advice-like recommendation detail is hidden until the central gate passes.</p>
            </div>
          ) : null}
          {showRecommendation && state !== "submitted" ? (
            <div className="grid gap-4">
              <p className="text-av-muted">Released decision pack: update Trust X beneficiary register after family approval.</p>
              <DashboardTable
                columns={["Field", "Value"]}
                rows={[
                  ["Review date", "24 Jun 2026"],
                  ["Family approvals", "Principal + spouse pending"],
                  ["Evidence", "Linked"]
                ]}
              />
              <div className="grid gap-3 md:grid-cols-3">
                {(["accepted", "deferred", "rejected"] as const).map((item) => (
                  <button
                    className={cn("rounded-lg border px-4 py-3 text-sm", choice === item ? "border-av-gold bg-av-gold text-av-midnight" : "border-av-line text-av-muted")}
                    key={item}
                    onClick={async () => {
                      setChoice(item);
                      const result = await transition({
                        action: "client.submit_decision",
                        actorRole: "Principal",
                        choice: item
                      });
                      if (result) {
                        setState("submitted");
                      }
                    }}
                    type="button"
                  >
                    {item === "accepted" ? "Accept" : item === "deferred" ? "Defer" : "Reject"}
                  </button>
                ))}
              </div>
              {error ? <p className="text-sm text-av-danger">{error}</p> : null}
            </div>
          ) : null}
          {state === "submitted" ? (
            <div className="rounded-lg border border-av-success/60 bg-av-success/10 p-4">
              <StatusChip tone="success">Evidence created</StatusChip>
              <p className="mt-3 text-av-ivory">Decision submitted: {choice}.</p>
              <p className="mt-2 text-sm text-av-muted">A decision record has been created and linked to your evidence vault.</p>
              <button
                className="mt-4 inline-flex rounded-lg border border-av-success px-4 py-2 text-sm text-av-success"
                onClick={() => setEvidencePreviewOpen(true)}
                type="button"
              >
                Open evidence preview
              </button>
            </div>
          ) : null}
        </div>
      </section>
      <EvidencePreviewDrawer
        accessAllowed
        accessReason="allowed"
        auditAction="decision.submitted"
        auditActorRole="Principal"
        auditEvidenceLink="evidence://decision-record/decision-trust-x-beneficiary-accepted"
        auditResult="created"
        auditTimestamp="2026-06-14T00:00:00.000Z"
        evidenceUri="evidence://decision-record/decision-trust-x-beneficiary-accepted"
        onClose={() => setEvidencePreviewOpen(false)}
        open={evidencePreviewOpen}
        recordStatus="Validated"
        recordTitle="Decision evidence record"
        recordType="Decision Record"
        recordVisibility="Client/Internal"
      />
    </main>
  );
}

export function EvidenceScreenV2() {
  const [selectedId, setSelectedId] = useState(evidenceRecords[0].id);
  const [filter, setFilter] = useState("All");
  const [previewOpen, setPreviewOpen] = useState(true);
  const { snapshot } = useDemoSession();
  const selected = evidenceRecords.find((record) => record.id === selectedId) ?? evidenceRecords[0];
  const access = evidenceAccess(selected, selected.restricted ? "Next Gen" : "Principal");
  const audit = auditForRecord(selected);
  const visibleRecords = evidenceRecords.filter((record) => filter === "All" || record.status === filter || record.visibility === filter);

  return (
    <ClientRouteShell>
      <GlassPanel title="Filters">
        <div className="flex flex-wrap gap-2">
          {["All", "Validated", "Under Review", "Missing", "Restricted", "Client Visible", "Internal Only"].map((item) => (
            <button className={cn(filterButton, filter === item && activeFilterButton)} key={item} onClick={() => setFilter(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </GlassPanel>
      <div className="grid gap-5">
        <GlassPanel title="Evidence Records">
          <div className="grid gap-2">
            {snapshot?.evidenceRecords.slice(0, 6).map((record) => (
              <button className="grid gap-2 rounded-lg border border-av-gold/50 bg-av-gold/10 p-3 text-left text-sm" key={record.id} type="button">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-av-ivory">{record.event}</span>
                  <StatusChip tone="success">Runtime</StatusChip>
                </span>
                <span className="text-xs text-av-muted">{record.objectType} / {record.link}</span>
              </button>
            ))}
            {visibleRecords.map((record) => (
              <button
                className={cn("grid gap-2 rounded-lg border p-3 text-left text-sm", selected.id === record.id ? "border-av-gold bg-av-gold/15" : "border-av-line bg-av-midnight/45")}
                key={record.id}
                onClick={() => {
                  setSelectedId(record.id);
                  setPreviewOpen(true);
                }}
                type="button"
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-av-ivory">{record.title}</span>
                  <StatusChip tone={record.status === "Missing" || record.status === "Restricted" ? "danger" : "success"}>{record.status}</StatusChip>
                </span>
                <span className="text-xs text-av-muted">{record.linkedTo} / {record.visibility}</span>
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>

      <EvidencePreviewDrawer
        accessAllowed={access.allowed}
        accessReason={access.reason}
        auditActorRole={audit.actorRole}
        auditEvidenceLink={audit.evidenceLink}
        auditResult={audit.result}
        auditTimestamp={audit.timestamp}
        auditAction={audit.action}
        evidenceUri={evidenceLinkFor(selected)}
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        recordStatus={selected.status}
        recordTitle={selected.title}
        recordType={selected.type}
        recordVisibility={selected.visibility}
      />
    </ClientRouteShell>
  );
}

export function EvidencePreviewDrawer({
  accessAllowed,
  accessReason,
  auditAction,
  auditActorRole,
  auditEvidenceLink,
  auditResult,
  auditTimestamp,
  evidenceUri,
  onClose,
  open,
  recordStatus,
  recordTitle,
  recordType,
  recordVisibility
}: {
  accessAllowed: boolean;
  accessReason: string;
  auditAction: string;
  auditActorRole: string;
  auditEvidenceLink: string;
  auditResult: string;
  auditTimestamp: string;
  evidenceUri: string;
  onClose: () => void;
  open: boolean;
  recordStatus: string;
  recordTitle: string;
  recordType: string;
  recordVisibility: string;
}) {
  if (!open) {
    return null;
  }

  const isMissing = recordStatus === "Missing";
  const visibilityLabel = recordVisibility.toLowerCase().includes("client") ? "Client-visible" : "Internal-only";
  const statusTone: Tone = isMissing || !accessAllowed ? "danger" : recordStatus === "Under Review" ? "warning" : "success";
  const workflowSteps = [
    ["Evidence Created", "05/19/2025 09:14 AM", "Jamie Lee"],
    ["Human Review", "05/19/2025 11:43 AM", "Jamie Lee"],
    ["Compliance Review", "05/21/2025 10:18 AM", "Taylor Grant"],
    ["Compliance Release", "05/21/2025 10:22 AM", "Taylor Grant"],
    ["Client Approved", "05/20/2025 08:55 AM", "Alex Morgan"]
  ];
  const missingChecklist = [
    ["Client Risk Profile Acknowledgment", "Confirms client risk tolerance aligns with proposed changes", "May 15, 2025", "Missing"],
    ["Tax Impact Disclosure", "Required for tax-sensitive rebalancing action", "May 15, 2025", "Missing"],
    ["Suitability Assessment Update", "Confirms suitability after material market change", "May 16, 2025", "Missing"],
    ["Portfolio Policy Exception Approval", "Required for deviation from target allocation", "May 14, 2025", "Received"],
    ["Client Communication Log", "Confirms discussion and client communication", "May 14, 2025", "Received"]
  ];

  return (
    <div className="fixed inset-0 z-40 bg-av-midnight/72 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-5xl flex-col border-l border-av-line bg-av-panel shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-av-line/60 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-av-muted">Evidence Vault</p>
            <p className="font-display text-2xl text-av-goldBright">
              {recordTitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <StatusChip tone={statusTone}>{recordStatus}</StatusChip>
              <StatusChip tone={visibilityLabel === "Client-visible" ? "success" : "warning"}>{visibilityLabel}</StatusChip>
              <span className="text-av-muted">{evidenceUri}</span>
            </div>
          </div>
          <button
            className="rounded-lg border border-av-line px-3 py-2 text-sm text-av-muted"
            onClick={onClose}
            type="button"
          >
            Close preview
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          {isMissing ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-av-danger/70 bg-av-danger/15 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <WorkflowBadge label="BLOCKED" />
                    <p className="mt-3 text-lg font-semibold uppercase text-av-ivory">Release blocked - critical evidence missing</p>
                    <p className="mt-2 text-sm text-av-muted">This decision or action cannot proceed until required evidence is received and reviewed.</p>
                  </div>
                  <StatusChip tone="danger">Blocked</StatusChip>
                </div>
                <p className="mt-3 rounded-lg border border-av-line/60 bg-av-midnight/50 px-3 py-2 text-sm text-av-goldBright">
                  Core rule: no unapproved advice reaches the client.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ["Affected decision / action", "Q2 2025 Portfolio Rebalance"],
                  ["Current owner", "Jamie Lee (Advisor)"],
                  ["SLA risk", "-2d 4h overdue"],
                  ["Escalation path", "Advisor -> Compliance"]
                ].map(([label, value]) => (
                  <div className="rounded-lg border border-av-line bg-av-midnight/45 p-3" key={label}>
                    <p className="text-xs uppercase tracking-[0.16em] text-av-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-av-ivory">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]">
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-av-ivory">Missing Evidence Checklist</p>
                    <StatusChip tone="warning">3 of 5 required</StatusChip>
                  </div>
                  <DashboardTable
                    columns={["Evidence required", "Why it's needed", "Due date", "Status"]}
                    rows={missingChecklist.map(([required, reason, due, status]) => [
                      required,
                      reason,
                      due,
                      status
                    ])}
                  />
                  <div className="mt-4 rounded-lg border border-av-warning/60 bg-av-warning/10 p-3 text-sm text-av-goldBright">
                    Upload or request the missing items to unblock this decision.
                  </div>
                </div>

                <div className="grid content-start gap-3">
                  <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                    <p className="font-semibold text-av-ivory">Process Status</p>
                    <div className="mt-4 grid grid-cols-5 items-start gap-2 text-center text-xs">
                      {["Intake", "Evidence", "Review", "Compliance", "Approved"].map((step) => (
                        <div className={cn("rounded-lg border px-2 py-3", step === "Evidence" ? "border-av-danger bg-av-danger/10 text-av-danger" : "border-av-line text-av-muted")} key={step}>
                          {step}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs uppercase text-av-danger">Blocked here</p>
                  </div>
                  <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                    <p className="font-semibold text-av-ivory">Status Summary</p>
                    <p className="mt-2 text-sm text-av-muted">Critical evidence is missing. This item is blocked from moving forward until all required evidence is received and reviewed.</p>
                  </div>
                  <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                    <p className="font-semibold text-av-ivory">Client Message</p>
                    <p className="mt-2 text-sm text-av-muted">We are waiting on a few required items to move forward with your request. We will notify you as soon as everything is ready.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg border border-av-gold px-4 py-2 text-sm text-av-goldBright" type="button">Request evidence</button>
                <button className="rounded-lg bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight" type="button">Upload evidence</button>
              </div>
            </div>
          ) : !accessAllowed ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
              <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-av-ivory">Private Credit Investment Memo</p>
                    <p className="mt-1 text-sm text-av-muted">Limited metadata is visible based on role and approval status.</p>
                  </div>
                  <StatusChip tone="danger">Restricted</StatusChip>
                </div>
                <DashboardTable
                  columns={["Field", "Value"]}
                  rows={[
                    ["Created by", "********"],
                    ["Owner", "********"],
                    ["Related to", "********"],
                    ["Tags", "********"]
                  ]}
                />
                <div className="mt-4 grid min-h-72 place-items-center rounded-lg border border-dashed border-av-warning/70 bg-av-midnight/70 p-6 text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-av-warning text-3xl text-av-warning">!</div>
                    <p className="mt-4 text-lg font-semibold text-av-ivory">Preview unavailable</p>
                    <p className="mt-2 text-sm text-av-muted">This evidence record is restricted. You do not have permission to view this content.</p>
                  </div>
                </div>
              </div>
              <div className="grid content-start gap-3">
                <div className="rounded-lg border border-av-warning/70 bg-av-warning/10 p-4">
                  <p className="font-semibold text-av-ivory">Why is this restricted?</p>
                  <p className="mt-2 text-sm text-av-muted">This record contains confidential information that can only be viewed by users with specific permissions and after approval.</p>
                  <p className="mt-2 text-xs text-av-muted">Reason: {accessReason}.</p>
                  <button className="mt-4 rounded-lg bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight" type="button">Request access</button>
                </div>
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-av-muted">Recent access event</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-av-line p-3">
                    <div>
                      <p className="text-sm text-av-ivory">Access attempted by you</p>
                      <p className="text-xs text-av-muted">{auditTimestamp} / {auditActorRole}</p>
                    </div>
                    <StatusChip tone="danger">Denied - Restricted</StatusChip>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.75fr)]">
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2 border-b border-av-line/70">
                  {["Preview", "Details", "Audit Trail", "Version History", "Related"].map((tab, index) => (
                    <button className={cn("border-b-2 px-3 py-2 text-sm", index === 0 ? "border-av-gold text-av-goldBright" : "border-transparent text-av-muted")} key={tab} type="button">
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-av-line/60 pb-3">
                    <p className="text-sm font-semibold text-av-ivory">Risk_Profile_Investor_Questionnaire.pdf</p>
                    <StatusChip tone="neutral">1 / 6</StatusChip>
                  </div>
                  <div className="mt-4 rounded-lg bg-av-ivory p-6 text-av-midnight">
                    <p className="text-center text-xs uppercase tracking-[0.18em] text-av-midnight/70">AlphaVest</p>
                    <p className="mt-2 text-center text-lg font-semibold">Risk Profile</p>
                    <p className="text-center text-sm">Investor Questionnaire</p>
                    <div className="mt-5 grid gap-2 text-xs">
                      {[
                        ["Name", "Alex Morgan"],
                        ["Date", "05/19/2025"],
                        ["Household", "Morgan Family Household"],
                        ["Overall risk tolerance", "Moderate"],
                        ["Capacity for loss", "Moderate"],
                        ["Investment horizon", "7 - 15 Years"],
                        ["Liquidity needs", "Medium"]
                      ].map(([label, value]) => (
                        <div className="grid grid-cols-[11rem_1fr] border border-av-midnight/20" key={label}>
                          <span className="bg-av-midnight/5 p-2 font-semibold">{label}</span>
                          <span className="p-2">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-right text-xs text-av-midnight/60">Page 1 of 6</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    {[1, 2, 3, 4, 6].map((page) => (
                      <div className={cn("grid h-14 w-10 place-items-end rounded border bg-av-ivory p-1 text-[10px] text-av-midnight", page === 1 ? "border-av-gold" : "border-av-line")} key={page}>
                        {page}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid content-start gap-3">
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <p className="font-semibold text-av-ivory">Summary</p>
                  <DashboardTable
                    columns={["Field", "Value"]}
                    rows={[
                      ["Record type", recordType],
                      ["Status", recordStatus],
                      ["Related to", "Morgan Family Household"],
                      ["Created", "05/19/2025 09:14 AM"],
                      ["Created by", auditActorRole],
                      ["Current version", "v1.0"]
                    ]}
                  />
                </div>
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <p className="font-semibold text-av-ivory">Workflow status</p>
                  <div className="mt-3 grid gap-3">
                    {workflowSteps.map(([step, time, actor]) => (
                      <div className="grid grid-cols-[1rem_1fr] gap-3 text-sm" key={step}>
                        <span className="mt-1 h-3 w-3 rounded-full bg-av-success" />
                        <span>
                          <span className="block text-av-ivory">{step}</span>
                          <span className="block text-xs text-av-muted">{time} / {actor}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
                  <p className="font-semibold text-av-ivory">Quick actions</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["Download", "Share", "More"].map((action) => (
                      <button className="rounded-lg border border-av-line px-3 py-2 text-xs text-av-muted" key={action} type="button">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 rounded-lg border border-av-line bg-av-midnight/45 p-3 text-xs text-av-muted">
            Audit event: {auditAction} / {auditResult} / {auditTimestamp} / {auditEvidenceLink}
          </div>
        </div>
      </aside>
    </div>
  );
}
