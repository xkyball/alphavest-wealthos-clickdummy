"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  auditForRecord,
  blockedDecisionRelease,
  blockedRecommendation,
  canShowAdviceLikeContent,
  clientActions,
  decisionPermission,
  decisionRelease,
  decisionSubmissionAudit,
  evidenceAccess,
  evidenceLinkFor,
  evidenceRecords,
  releasedRecommendation,
  sensitiveNodeAccess,
  type ClientAction,
  type EvidenceRecord
} from "@/lib/phase5-client-model";
import { evaluateClientVisibility } from "@/lib/v2-model";
import {
  cn,
  DashboardTable,
  Drawer,
  GlassPanel,
  MetricCard,
  PageHeader,
  RoleBadge,
  StatusChip,
  WireframePhone,
  WorkflowBadge
} from "./ui";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "review";

const stateButton =
  "rounded-lg border border-av-line px-3 py-2 text-xs text-av-muted transition hover:border-av-gold hover:text-av-ivory";
const activeStateButton =
  "border-av-gold bg-av-gold text-av-midnight hover:text-av-midnight";

function ClientRouteShell({
  kicker,
  title,
  subtitle,
  children
}: {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <article className="px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[104rem] gap-6">
        <PageHeader kicker={kicker} title={title} subtitle={subtitle} />
        {children}
      </div>
    </article>
  );
}

function GateCard({ release = blockedRecommendation }: { release?: typeof blockedRecommendation }) {
  const visibility = evaluateClientVisibility(release);

  return (
    <GlassPanel title="Client Visibility Gate">
      <p className="font-display text-2xl text-av-goldBright">
        No unapproved advice reaches the client.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <WorkflowBadge label="ADVISOR" />
        <WorkflowBadge label="COMPLIANCE" />
        <WorkflowBadge label="EVIDENCE" />
        <WorkflowBadge label={visibility.clientVisible ? "CLIENT" : "BLOCKED"} />
      </div>
      <p className="mt-3 text-sm text-av-muted">
        {visibility.clientVisible
          ? "Advisor approval, compliance release, evidence and permission checks are complete."
          : `Visibility remains blocked: ${visibility.missing.join(", ")}.`}
      </p>
    </GlassPanel>
  );
}

function MobileNav() {
  return (
    <nav className="mt-5 grid grid-cols-4 gap-2 border-t border-av-line/60 pt-3 text-center text-[0.68rem] text-av-muted">
      {[
        ["Home", "/mobile"],
        ["Upload", "/mobile/upload"],
        ["Decide", "/decisions"],
        ["Vault", "/evidence"]
      ].map(([label, href]) => (
        <Link className="rounded border border-av-line/45 px-1 py-2 hover:border-av-gold" href={href} key={label}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileScreenV2() {
  const [state, setState] = useState<"default" | "blocked" | "empty" | "decision">("default");
  const released = canShowAdviceLikeContent(releasedRecommendation);

  return (
    <ClientRouteShell
      kicker="Phase 5 / V2-001 to V2-003 and V2-009"
      title="Mobile Home"
      subtitle="Next Step Today shows only approved, released and evidenced client-facing content."
    >
      <div className="flex flex-wrap gap-2">
        {["default", "blocked", "empty", "decision"].map((item) => (
          <button
            className={cn(stateButton, state === item && activeStateButton)}
            key={item}
            onClick={() => setState(item as typeof state)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)_22rem]">
        <WireframePhone className="max-w-[24rem]" title="AlphaVest">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl text-av-goldBright">Good morning, Alex</p>
              <p className="mt-1 text-xs text-av-muted">Next step today</p>
            </div>
            <RoleBadge role="Principal" sublabel="Permission: full client view" tone="success" />
          </div>

          {state === "default" ? (
            <div className="mt-5 grid gap-3">
              <Link className="rounded-lg border border-av-gold bg-av-gold/12 p-4" href="/mobile/upload">
                <span className="block text-sm font-semibold text-av-ivory">Upload updated trust deed</span>
                <span className="mt-1 block text-xs text-av-muted">Evidence required before Trust X review can close.</span>
              </Link>
              <Link className="rounded-lg border border-av-line bg-av-midnight/60 p-4" href="/decisions">
                <span className="block text-sm font-semibold text-av-ivory">
                  {released ? "Decision pack ready" : "Decision pack awaiting release"}
                </span>
                <span className="mt-1 block text-xs text-av-muted">
                  Backstage status: Advisor approved, compliance released, evidence linked.
                </span>
              </Link>
            </div>
          ) : null}

          {state === "blocked" ? (
            <div className="mt-5 rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <StatusChip tone="danger">Recommendation blocked</StatusChip>
              <p className="mt-3 text-sm text-av-ivory">A recommendation is in review but cannot be shown yet.</p>
              <p className="mt-2 text-xs text-av-muted">
                Client visibility is blocked until compliance release is complete. Advisor approval alone is not enough.
              </p>
            </div>
          ) : null}

          {state === "empty" ? (
            <div className="mt-5 rounded-lg border border-av-success/60 bg-av-success/10 p-5 text-center">
              <p className="font-display text-xl text-av-goldBright">All caught up</p>
              <p className="mt-2 text-xs text-av-muted">No open client actions. Evidence and reviews remain monitored.</p>
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
              Governance access review
            </Link>
            <Link className="rounded border border-av-line/50 px-3 py-2 text-av-muted" href="/evidence">
              Evidence vault
            </Link>
          </div>
          <MobileNav />
        </WireframePhone>

        <GlassPanel title="Backstage Status">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Advisor approval", "Complete", "success"],
              ["Compliance release", state === "blocked" ? "Pending" : "Complete", state === "blocked" ? "danger" : "success"],
              ["Evidence record", "Linked", "success"],
              ["Permission check", "Principal allowed", "success"]
            ].map(([label, value, tone]) => (
              <div className="rounded-lg border border-av-line bg-av-midnight/45 p-3" key={label}>
                <p className="text-xs text-av-muted">{label}</p>
                <StatusChip tone={tone as Tone}>{value}</StatusChip>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GateCard release={state === "blocked" ? blockedRecommendation : releasedRecommendation} />
      </div>
    </ClientRouteShell>
  );
}

export function MobileUploadScreenV2() {
  const [step, setStep] = useState<"select" | "extract" | "low" | "pending" | "error">("select");
  const [docType, setDocType] = useState("Trust deed");
  const audit = useMemo(() => auditForRecord(evidenceRecords[0]), []);

  return (
    <ClientRouteShell
      kicker="Phase 5 / V2-004 to V2-008"
      title="Mobile Document Upload"
      subtitle="Document intake creates evidence by default and blocks low-confidence submission."
    >
      <div className="flex flex-wrap gap-2">
        {["select", "extract", "low", "pending", "error"].map((item) => (
          <button className={cn(stateButton, step === item && activeStateButton)} key={item} onClick={() => setStep(item as typeof step)} type="button">
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)_22rem]">
        <WireframePhone className="max-w-[24rem]" title="Secure upload">
          {step === "select" ? (
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
                  <button className="rounded-lg border border-av-line p-3 text-av-muted" key={source} onClick={() => setStep("extract")} type="button">
                    {source}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === "extract" ? (
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
              <button className="mt-4 w-full rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight" onClick={() => setStep("pending")} type="button">
                Confirm extraction
              </button>
            </>
          ) : null}

          {step === "low" ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-sm text-av-ivory">Low confidence extraction blocked submission.</p>
              <p className="mt-2 text-xs text-av-muted">Confidence is 61%. Analyst review is required before this can support advice or a decision.</p>
              <Link className="mt-4 inline-flex rounded-lg border border-av-danger px-3 py-2 text-xs text-av-danger" href="/workbench">
                Route to analyst review
              </Link>
            </div>
          ) : null}

          {step === "pending" ? (
            <div className="rounded-lg border border-av-warning/60 bg-av-warning/10 p-4">
              <StatusChip tone="warning">Verification pending</StatusChip>
              <p className="mt-3 text-sm text-av-ivory">The document is uploaded and queued for analyst validation.</p>
              <p className="mt-2 text-xs text-av-muted">Evidence placeholder created: {evidenceLinkFor(evidenceRecords[0])}</p>
            </div>
          ) : null}

          {step === "error" ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <StatusChip tone="danger">Upload error</StatusChip>
              <p className="mt-3 text-sm text-av-ivory">The file could not be processed.</p>
              <button className="mt-4 w-full rounded-lg border border-av-gold px-3 py-2 text-xs text-av-goldBright" onClick={() => setStep("select")} type="button">
                Retry upload
              </button>
            </div>
          ) : null}
          <MobileNav />
        </WireframePhone>

        <GlassPanel title="Evidence and Audit Contract">
          <DashboardTable
            columns={["Object", "Value"]}
            rows={[
              ["Evidence", evidenceLinkFor(evidenceRecords[0])],
              ["Audit event", audit.action],
              ["Audit result", audit.result],
              ["Review route", "/workbench"]
            ]}
          />
        </GlassPanel>

        <GlassPanel title="Submission Rule">
          <p className="text-sm text-av-muted">
            Extraction output stays `[AI-DRAFT]` until analyst review confirms it. Low confidence does not create client-visible advice.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <WorkflowBadge label="AI-DRAFT" />
            <WorkflowBadge label="ANALYST" />
            <WorkflowBadge label="EVIDENCE" />
            <WorkflowBadge label={step === "low" ? "BLOCKED" : "REVIEW"} />
          </div>
        </GlassPanel>
      </div>
    </ClientRouteShell>
  );
}

export function PortalScreenV2() {
  const [state, setState] = useState<"default" | "loading" | "error" | "blocked">("default");

  return (
    <ClientRouteShell
      kicker="Phase 5 / V2-010 to V2-012"
      title="Client Dashboard"
      subtitle="Readiness, actions, triggers and evidence status without turning visibility into advice."
    >
      <div className="flex flex-wrap gap-2">
        {["default", "loading", "error", "blocked"].map((item) => (
          <button className={cn(stateButton, state === item && activeStateButton)} key={item} onClick={() => setState(item as typeof state)} type="button">
            {item}
          </button>
        ))}
      </div>

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
    <ClientRouteShell
      kicker="Phase 5 / V2-013 to V2-016"
      title="Live Wealth Map"
      subtitle="Graph-like structure with restricted nodes, evidence links and sensitive-view audit events."
    >
      <GlassPanel title="Filters">
        <div className="flex flex-wrap gap-2">
          {["All", "Entities", "Assets", "Documents", "Decisions", "Restricted"].map((item) => (
            <button className={cn(stateButton, filter === item && activeStateButton)} key={item} onClick={() => setFilter(item)} type="button">
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
  const selected = clientActions.find((action) => action.id === selectedId) ?? clientActions[0];
  const columns = ["Needs Review", "Blocked", "Ready", "Pending", "Completed"] as const;

  return (
    <ClientRouteShell kicker="Phase 5 / V2-017 to V2-019" title="Action Board" subtitle="Client-facing action workflow with owners, due dates, evidence status and blocked states.">
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
  const [state, setState] = useState<"ready" | "blocked" | "submitted">("ready");
  const [choice, setChoice] = useState<"accepted" | "deferred" | "rejected">("accepted");
  const permission = decisionPermission(state === "blocked" ? "External Advisor" : "Principal");
  const audit = decisionSubmissionAudit(choice);
  const showRecommendation = state !== "blocked" && decisionRelease.clientVisible;

  return (
    <ClientRouteShell kicker="Phase 5 / V2-020 to V2-022" title="Digital Decision Room" subtitle="Accept, defer or reject only after permission, approval, compliance and evidence gates pass.">
      <div className="flex flex-wrap gap-2">
        {["ready", "blocked", "submitted"].map((item) => (
          <button className={cn(stateButton, state === item && activeStateButton)} key={item} onClick={() => setState(item as typeof state)} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Trust X Beneficiary Update">
          {state === "blocked" || !permission.allowed || !blockedDecisionRelease.clientVisible ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-4">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-av-ivory">Decision room is blocked for the current permission context.</p>
              <p className="mt-2 text-sm text-av-muted">Advice-like recommendation detail is hidden until the central gate passes.</p>
            </div>
          ) : null}
          {showRecommendation && state !== "submitted" ? (
            <div className="grid gap-4">
              <p className="text-av-muted">Released decision pack: update Trust X beneficiary register after family approval.</p>
              <div className="grid gap-3 md:grid-cols-3">
                {(["accepted", "deferred", "rejected"] as const).map((item) => (
                  <button
                    className={cn("rounded-lg border px-4 py-3 text-sm", choice === item ? "border-av-gold bg-av-gold text-av-midnight" : "border-av-line text-av-muted")}
                    key={item}
                    onClick={() => {
                      setChoice(item);
                      setState("submitted");
                    }}
                    type="button"
                  >
                    {item === "accepted" ? "Accept" : item === "deferred" ? "Defer" : "Reject"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {state === "submitted" ? (
            <div className="rounded-lg border border-av-success/60 bg-av-success/10 p-4">
              <StatusChip tone="success">Evidence created</StatusChip>
              <p className="mt-3 text-av-ivory">Decision submitted: {choice}.</p>
              <p className="mt-2 text-sm text-av-muted">Audit event: {audit.action}. Evidence: {audit.evidenceLink}.</p>
            </div>
          ) : null}
        </GlassPanel>

        <Drawer title="Decision Controls">
          <DashboardTable
            columns={["Gate", "State"]}
            rows={[
              ["Advisor approval", "Complete"],
              ["Compliance release", state === "blocked" ? "Missing" : "Complete"],
              ["Evidence record", "Linked"],
              ["Permission", permission.allowed ? "Allowed" : permission.reason],
              ["Family approvals", "Principal + spouse pending"],
              ["Review date", "24 Jun 2026"]
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <WorkflowBadge label="ADVISOR" />
            <WorkflowBadge label="COMPLIANCE" />
            <WorkflowBadge label="EVIDENCE" />
            <WorkflowBadge label={state === "blocked" ? "BLOCKED" : "CLIENT"} />
          </div>
        </Drawer>
      </div>
    </ClientRouteShell>
  );
}

export function EvidenceScreenV2() {
  const [selectedId, setSelectedId] = useState(evidenceRecords[0].id);
  const [filter, setFilter] = useState("All");
  const selected = evidenceRecords.find((record) => record.id === selectedId) ?? evidenceRecords[0];
  const access = evidenceAccess(selected, selected.restricted ? "Next Gen" : "Principal");
  const audit = auditForRecord(selected);
  const visibleRecords = evidenceRecords.filter((record) => filter === "All" || record.status === filter || record.visibility === filter);

  return (
    <ClientRouteShell kicker="Phase 5 / V2-023 to V2-025" title="Evidence Vault" subtitle="Evidence list, preview drawer, restricted records and missing-evidence escalation.">
      <GlassPanel title="Filters">
        <div className="flex flex-wrap gap-2">
          {["All", "Validated", "Under Review", "Missing", "Restricted", "Client Visible", "Internal Only"].map((item) => (
            <button className={cn(stateButton, filter === item && activeStateButton)} key={item} onClick={() => setFilter(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </GlassPanel>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Evidence Records">
          <div className="grid gap-2">
            {visibleRecords.map((record) => (
              <button className={cn("grid gap-2 rounded-lg border p-3 text-left text-sm", selected.id === record.id ? "border-av-gold bg-av-gold/15" : "border-av-line bg-av-midnight/45")} key={record.id} onClick={() => setSelectedId(record.id)} type="button">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-av-ivory">{record.title}</span>
                  <StatusChip tone={record.status === "Missing" || record.status === "Restricted" ? "danger" : "success"}>{record.status}</StatusChip>
                </span>
                <span className="text-xs text-av-muted">{record.linkedTo} / {record.visibility}</span>
              </button>
            ))}
          </div>
        </GlassPanel>

        <Drawer title={selected.title}>
          {!access.allowed ? (
            <div className="rounded-lg border border-av-danger/70 bg-av-danger/10 p-3">
              <WorkflowBadge label="BLOCKED" />
              <p className="mt-3 text-sm text-av-ivory">Restricted evidence content is hidden.</p>
              <p className="mt-2 text-xs text-av-muted">Reason: {access.reason}.</p>
            </div>
          ) : selected.status === "Missing" ? (
            <div className="rounded-lg border border-av-warning/60 bg-av-warning/10 p-3">
              <WorkflowBadge label="REVIEW" />
              <p className="mt-3 text-sm text-av-ivory">Missing evidence escalation is open.</p>
              <p className="mt-2 text-xs text-av-muted">Compliance can block release or request evidence before client visibility.</p>
            </div>
          ) : (
            <DashboardTable
              columns={["Field", "Value"]}
              rows={[
                ["Type", selected.type],
                ["Visibility", selected.visibility],
                ["Evidence URI", evidenceLinkFor(selected)],
                ["Audit action", audit.action],
                ["Audit result", audit.result]
              ]}
            />
          )}
          <div className="mt-4 rounded-lg border border-av-line bg-av-midnight/45 p-3 text-xs text-av-muted">
            Audit trail preview: {audit.timestamp} / {audit.actorRole} / {audit.evidenceLink}
          </div>
        </Drawer>
      </div>
    </ClientRouteShell>
  );
}
