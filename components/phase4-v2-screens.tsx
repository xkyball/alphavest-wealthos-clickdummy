"use client";

import { useMemo, useState } from "react";
import {
  createAuditEvent,
  createEvidenceLink,
  evaluateClientVisibility,
  evaluatePermission,
  getV2Route,
  workflowBadges,
  type ReleaseState,
  type Role
} from "@/lib/v2-model";
import {
  BottomWorkflowStrip,
  cn,
  DashboardTable,
  GlassPanel,
  PageHeader,
  PermissionMatrix,
  StatusChip,
  WorkflowBadge
} from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

function V2ScreenShell({
  route,
  children,
  aside
}: {
  route: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const spec = getV2Route(route);

  if (!spec) {
    return null;
  }

  return (
    <article className="relative overflow-hidden px-4 py-6 md:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-52 w-2/3 opacity-25">
        <div className="world-motif h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-[104rem]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-av-line pb-4">
          <div className="flex items-center gap-3 text-av-goldBright">
            <div className="grid size-10 place-items-center rounded-lg border border-av-gold text-xs font-semibold">
              AV
            </div>
            <div>
              <p className="text-sm md:text-base">AlphaVest WealthOS</p>
              <p className="text-xs uppercase text-av-muted">
                {spec.domain} / {spec.priority}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {spec.visualIds.slice(0, 5).map((id) => (
              <StatusChip key={id} tone="info">
                {id}
              </StatusChip>
            ))}
          </div>
        </div>

        <PageHeader
          kicker={`${spec.type} / ${spec.primaryUser}`}
          title={spec.title}
          subtitle={spec.userGoal}
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="grid gap-5">{children}</div>
          <aside className="grid content-start gap-5">
            {aside}
            <GateSummary />
          </aside>
        </div>
      </div>
    </article>
  );
}

function GateSummary() {
  const release = evaluateClientVisibility({
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecordExists: true,
    permissionCheck: true,
    clientVisibilityState: "blocked"
  });

  return (
    <GlassPanel title="Gate Summary">
      <div className="grid gap-3 text-sm text-av-muted">
        <p>No unapproved advice reaches the client.</p>
        <p>Advisor approval alone is not enough.</p>
        <p>Compliance release controls client visibility.</p>
        <p>Evidence and audit are created by default.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <WorkflowBadge label={release.badge} />
        <WorkflowBadge label="COMPLIANCE" />
        <WorkflowBadge label="EVIDENCE" />
      </div>
    </GlassPanel>
  );
}

function ReleaseChecklist({ state }: { state: ReleaseState }) {
  const result = evaluateClientVisibility(state);
  const rows = [
    ["Advisor approval", state.advisorApproval],
    ["Compliance release", state.complianceRelease],
    ["Evidence record", state.evidenceRecordExists],
    ["Permission check", state.permissionCheck],
    ["Visibility released", state.clientVisibilityState === "released"]
  ] as const;

  return (
    <GlassPanel title="No-Unapproved-Advice Gate">
      <div className="grid gap-2">
        {rows.map(([label, complete]) => (
          <div
            className="flex items-center justify-between gap-3 rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm"
            key={label}
          >
            <span>{label}</span>
            <StatusChip tone={complete ? "success" : "warning"}>
              {complete ? "Ready" : "Blocked"}
            </StatusChip>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm">
        <span>Client visibility</span>
        <WorkflowBadge label={result.badge} />
      </div>
    </GlassPanel>
  );
}

export function WorkbenchV2Screen() {
  const { snapshot, reset } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const documentWorkflow = findDemoWorkflow(snapshot, "wf-trust-deed-document");
  const readiness = {
    advisorApproval: recommendation?.advisorApproval ?? false,
    complianceRelease: recommendation?.complianceRelease ?? false,
    evidenceRecordExists: recommendation?.evidenceRecordExists ?? true,
    permissionCheck: recommendation?.permissionCheck ?? true,
    clientVisibilityState: recommendation?.clientVisibilityState ?? "blocked"
  } satisfies ReleaseState;

  return (
    <V2ScreenShell
      aside={<ReleaseChecklist state={readiness} />}
      route="/workbench"
    >
      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Total items", "326", "info"],
          ["Overdue", "18", "danger"],
          ["Due today", "41", "warning"],
          ["At risk", "52", "danger"],
          ["On track", "215", "success"]
        ].map(([label, value, tone]) => (
          <GlassPanel key={label}>
            <p className="text-xs uppercase text-av-muted">{label}</p>
            <p className="mt-2 font-display text-4xl text-av-goldBright">
              {value}
            </p>
            <StatusChip tone={tone as "info"}>Queue health</StatusChip>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel title="Priority Work Queue">
        <DashboardTable
          columns={[
            "Client",
            "Primary item",
            "Data score",
            "Drafts",
            "Advisor",
            "Compliance",
            "SLA"
          ]}
          rows={[
            ["Steward Family", recommendation?.title ?? "Trust X beneficiary update", documentWorkflow?.state ?? "under_review", recommendation?.state ?? "needs_review", recommendation?.advisorApproval ? "Approved" : "Pending", recommendation?.complianceRelease ? "Released" : "Blocked", "At Risk"],
            ["Delaney Trust", "Tax-loss harvesting", "63", "2/5", "2", "2/5", "At Risk"],
            ["Summit Ventures", "Performance review", "88", "4/5", "1", "4/5", "On Track"],
            ["Bennett Foundation", "Grant strategy", "55", "1/5", "2", "1/5", "At Risk"]
          ]}
        />
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Selected Trigger Detail">
          <div className="grid gap-3 text-sm text-av-muted">
            <p className="text-av-ivory">Concentration review: single-asset exposure above policy threshold.</p>
            <p>Runtime workflow: {recommendation?.workflow ?? "recommendation"} / {recommendation?.state ?? "loading"}.</p>
            <p>Publish remains disabled until advisor approval, compliance release, evidence and permission checks pass.</p>
            <button className="w-fit rounded-lg border border-av-line px-4 py-2 text-xs text-av-muted" onClick={() => void reset()} type="button">
              Reset demo session
            </button>
          </div>
        </GlassPanel>
        <GlassPanel title="Publish Readiness">
          <div className="grid gap-2">
            {["Draft recommendations complete", "Evidence record linked", "Advisor approval obtained", "Compliance checklist complete", "Client permission confirmed"].map((item, index) => (
              <div className="flex items-center justify-between rounded border border-av-line/50 px-3 py-2 text-sm" key={item}>
                <span>{item}</span>
                <StatusChip tone={index < 2 ? "success" : "warning"}>
                  {index < 2 ? "Ready" : "Pending"}
                </StatusChip>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted" disabled type="button">
            Publish disabled
          </button>
        </GlassPanel>
      </div>
    </V2ScreenShell>
  );
}

export function AdvisorApprovalV2Screen() {
  const [decision, setDecision] = useState<"review" | "approved" | "call">("review");
  const { snapshot, transition, error } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const release = {
    advisorApproval: recommendation?.advisorApproval ?? decision === "approved",
    complianceRelease: recommendation?.complianceRelease ?? false,
    evidenceRecordExists: recommendation?.evidenceRecordExists ?? true,
    permissionCheck: recommendation?.permissionCheck ?? true,
    clientVisibilityState: recommendation?.clientVisibilityState ?? "blocked"
  } satisfies ReleaseState;

  return (
    <V2ScreenShell
      aside={<ReleaseChecklist state={release} />}
      route="/advisor-approval"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Advisor Review">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Trigger summary", "Liquidity requirement exceeds current policy buffer."],
              ["Client objective", "Preserve flexibility while avoiding unnecessary product movement."],
              ["Documents reviewed", "Policy schedule, cash-flow forecast, trust deed, mandate."],
              ["Risk view", "Moderate exposure; advice wording must remain conditional until compliance release."]
            ].map(([title, detail]) => (
              <div className="rounded border border-av-line/50 bg-av-midnight/45 p-3 text-sm" key={title}>
                <p className="font-semibold text-av-ivory">{title}</p>
                <p className="mt-1 text-av-muted">{detail}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel title="Advisor Decision">
          <div className="grid gap-2">
            <button
              className="rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight"
              onClick={async () => {
                setDecision("approved");
                await transition({ action: "advisor.approve", actorRole: "Senior Advisor" });
              }}
              type="button"
            >
              Approve for compliance
            </button>
            <button className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted" onClick={() => setDecision("review")} type="button">
              Request more data
            </button>
            <button
              className="rounded-lg border border-av-warning px-4 py-2 text-sm text-av-warning"
              onClick={async () => {
                setDecision("call");
                await transition({ action: "advisor.request_call", actorRole: "Senior Advisor" });
              }}
              type="button"
            >
              Escalate to call
            </button>
          </div>
          <p className="mt-4 text-sm text-av-muted">
            Current state: {recommendation?.state ?? (decision === "approved" ? "advisor approved; compliance pending" : decision === "call" ? "advisor call required" : "under review")}
          </p>
          {error ? <p className="mt-2 text-sm text-av-danger">{error}</p> : null}
        </GlassPanel>
      </div>

      <GlassPanel title="Suggested Client Wording">
        <p className="text-sm text-av-muted">
          This wording remains internal until compliance releases it and an evidence record is linked.
        </p>
      </GlassPanel>
    </V2ScreenShell>
  );
}

export function ComplianceV2Screen() {
  const [status, setStatus] = useState<"review" | "released" | "blocked">("review");
  const { snapshot, transition, error } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const release = {
    advisorApproval: recommendation?.advisorApproval ?? true,
    complianceRelease: recommendation?.complianceRelease ?? status === "released",
    evidenceRecordExists: recommendation?.evidenceRecordExists ?? status !== "blocked",
    permissionCheck: recommendation?.permissionCheck ?? true,
    clientVisibilityState: recommendation?.clientVisibilityState ?? (status === "released" ? "released" : "blocked")
  } satisfies ReleaseState;
  const audit = createAuditEvent({
    actorRole: "Compliance Officer",
    action: status === "released" ? "compliance.released" : status === "blocked" ? "compliance.blocked" : "compliance.reviewed",
    objectType: "Compliance Release Record",
    objectId: "release-1842",
    result: status === "released" ? "released" : status === "blocked" ? "blocked" : "updated",
    evidenceLink: createEvidenceLink("Compliance Release Record", "release-1842")
  });

  return (
    <V2ScreenShell aside={<ReleaseChecklist state={release} />} route="/compliance">
      <GlassPanel title="Compliance Queue">
        <DashboardTable
          columns={["ID", "Output", "Classification", "Advisor", "Evidence", "Permission", "Status", "Age"]}
          rows={[
            ["OUT-1842", recommendation?.title ?? "Liquidity recommendation", "Advice-relevant", "R. Lee", recommendation?.evidenceRecordExists ? "Complete" : "Missing", recommendation?.permissionCheck ? "Allowed" : "Blocked", recommendation?.state ?? status],
            ["OUT-1843", "Document request", "Information", "M. Chen", "Partial", "Allowed", "review"],
            ["OUT-1844", "Entity restructure note", "Advice", "A. Patel", "Missing ROA", "Blocked", "blocked"]
          ]}
        />
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Selected Output">
          <p className="text-sm text-av-muted">
            Release is allowed only when disclaimer, evidence record, advisor approval and publish permission are complete.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-av-success px-4 py-2 text-sm text-av-success"
              onClick={async () => {
                setStatus("released");
                await transition({ action: "compliance.release", actorRole: "Compliance Officer" });
              }}
              type="button"
            >
              Release to client
            </button>
            <button
              className="rounded-lg border border-av-danger px-4 py-2 text-sm text-av-danger"
              onClick={async () => {
                setStatus("blocked");
                await transition({ action: "compliance.block", actorRole: "Compliance Officer" });
              }}
              type="button"
            >
              Block / request evidence
            </button>
          </div>
          {error ? <p className="mt-3 text-sm text-av-danger">{error}</p> : null}
        </GlassPanel>
        <GlassPanel title="Audit Event">
          <div className="grid gap-2 text-xs text-av-muted">
            <p>Action: {audit.action}</p>
            <p>Actor: {audit.actorRole}</p>
            <p>Object: {audit.objectType}</p>
            <p>Evidence: {audit.evidenceLink}</p>
          </div>
        </GlassPanel>
      </div>
    </V2ScreenShell>
  );
}

const permissionRows = [
  {
    role: "Principal",
    assets: "Full",
    documents: "Manage",
    decisions: "Approve",
    sensitive: "2nd confirmation"
  },
  {
    role: "Next Gen",
    assets: "View",
    documents: "Limited",
    decisions: "View",
    sensitive: "Restricted"
  },
  {
    role: "External Advisor",
    assets: "Limited",
    documents: "Scoped",
    decisions: "None",
    sensitive: "Blocked"
  },
  {
    role: "Compliance Officer",
    assets: "Review",
    documents: "Audit",
    decisions: "Release",
    sensitive: "Policy"
  }
];

export function GovernanceV2Screen() {
  const [role, setRole] = useState<Role>("External Advisor");
  const [confirmed, setConfirmed] = useState(false);
  const permission = evaluatePermission({
    role,
    action: "grant_external_access",
    objectSensitive: true,
    secondConfirmation: confirmed
  });
  const audit = useMemo(
    () =>
      createAuditEvent({
        actorRole: "Principal",
        action: permission.allowed ? "access.changed" : "access.blocked",
        objectType: "Access Change Record",
        objectId: "access-772",
        result: permission.allowed ? "updated" : "blocked",
        evidenceLink: createEvidenceLink("Access Change Record", "access-772")
      }),
    [permission.allowed]
  );

  return (
    <V2ScreenShell
      aside={
        <GlassPanel title="Permission Decision">
          <div className="grid gap-2 text-sm text-av-muted">
            <p>Role: {role}</p>
            <p>Result: {permission.reason}</p>
            <p>Audit: {audit.action}</p>
          </div>
          <button className="mt-4 w-full rounded-lg border border-av-gold px-4 py-2 text-sm text-av-goldBright" onClick={() => setConfirmed(true)} type="button">
            Confirm sensitive change
          </button>
        </GlassPanel>
      }
      route="/governance"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Role Permission Matrix">
          <PermissionMatrix rows={permissionRows} />
        </GlassPanel>
        <GlassPanel title="Role Detail">
          <div className="grid gap-2">
            {(["Principal", "External Advisor", "Compliance Officer"] as Role[]).map((item) => (
              <button
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm",
                  role === item ? "border-av-gold bg-av-gold/10 text-av-ivory" : "border-av-line text-av-muted"
                )}
                key={item}
                onClick={() => {
                  setRole(item);
                  setConfirmed(false);
                }}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>
      {!permission.allowed ? (
        <GlassPanel title={permission.needsSecondConfirmation ? "Second Confirmation Required" : "Permission Blocked"}>
          <p className="text-sm text-av-muted">
            Sensitive permission changes require role authority, relationship scope and second confirmation before access can be granted.
          </p>
        </GlassPanel>
      ) : null}
    </V2ScreenShell>
  );
}

export function CommunicationV2Screen() {
  const [lane, setLane] = useState<"digital" | "call" | "workshop">("digital");
  const { snapshot, transition, error } = useDemoSession();
  const communication = findDemoWorkflow(snapshot, "wf-q2-communication");
  const release = {
    advisorApproval: communication?.advisorApproval ?? true,
    complianceRelease: communication?.complianceRelease ?? lane === "digital",
    evidenceRecordExists: communication?.evidenceRecordExists ?? true,
    permissionCheck: communication?.permissionCheck ?? true,
    clientVisibilityState: communication?.clientVisibilityState ?? (lane === "digital" ? "released" : "blocked")
  } satisfies ReleaseState;
  const visible = evaluateClientVisibility(release);

  return (
    <V2ScreenShell aside={<ReleaseChecklist state={release} />} route="/communication">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Communication Decision Tree">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["digital", "Digital-only", "Routine, low complexity, released wording."],
              ["call", "Advisor call", "Judgment, sensitivity or client concern requires a call."],
              ["workshop", "F2F workshop", "Conflict, governance change or high-impact decision."]
            ].map(([value, title, detail]) => (
              <button
                className={cn(
                  "rounded-lg border p-4 text-left",
                  lane === value ? "border-av-gold bg-av-gold/10 text-av-ivory" : "border-av-line text-av-muted"
                )}
                key={value}
                onClick={() => setLane(value as typeof lane)}
                type="button"
              >
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm">{detail}</p>
              </button>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel title="Client Message Preview">
          <p className="text-sm text-av-muted">
            Your Q2 review materials are ready. Please review the open action and confirm whether you would like your advisor to discuss it.
          </p>
          <button
            className="mt-4 w-full rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted"
            disabled={lane !== "digital"}
            onClick={() => void transition({ action: "communication.send", actorRole: "Client Success" })}
            type="button"
          >
            {visible.clientVisible || lane === "digital" ? "Send released message" : "Send disabled"}
          </button>
          {error ? <p className="mt-2 text-sm text-av-danger">{error}</p> : null}
        </GlassPanel>
      </div>
      <GlassPanel title="Evidence and Communication Log">
        <DashboardTable
          columns={["Event", "Actor", "Visibility", "Evidence"]}
          rows={[
            ["Message drafted", "Analyst", "Internal", "Communication Record"],
            ["Advisor reviewed", "Senior Advisor", "Internal", "Approval Record"],
            ["Release checked", "Compliance", lane === "digital" ? "Client-ready" : "Blocked", "Audit Event"]
          ]}
        />
      </GlassPanel>
    </V2ScreenShell>
  );
}

export function JourneyV2Screen() {
  return (
    <V2ScreenShell route="/journey">
      <GlassPanel title="Service Blueprint Logic">
        <div className="grid gap-3 md:grid-cols-5">
          {["Access", "Intake", "Visibility", "Trigger", "Draft", "Advisor", "Compliance", "Decision", "Evidence", "Review"].map((stage) => (
            <div className="rounded border border-av-line/50 bg-av-midnight/45 p-3 text-sm" key={stage}>
              <p className="font-semibold text-av-ivory">{stage}</p>
              <p className="mt-1 text-av-muted">Mapped to workflow, evidence and audit rules.</p>
            </div>
          ))}
        </div>
      </GlassPanel>
      <BottomWorkflowStrip badges={workflowBadges} message="Reference-only blueprint translated into route, state, evidence and escalation logic." />
    </V2ScreenShell>
  );
}

export function RoadmapV2Screen() {
  return (
    <V2ScreenShell route="/roadmap">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["MVP / Now", "Route inventory, gates, evidence/audit helpers, internal queue foundations."],
          ["Phase 5-6", "Client experience rebuild and internal workflow rebuild from v2 visual inventory."],
          ["Future", "Integrations, advanced AI assistance, external advisor portal and multi-family workflows."]
        ].map(([title, detail]) => (
          <GlassPanel key={title} title={title}>
            <p className="text-sm text-av-muted">{detail}</p>
          </GlassPanel>
        ))}
      </div>
      <GlassPanel title="Blocked / Not MVP Ready">
        <DashboardTable
          columns={["Feature", "Reason", "Dependency"]}
          rows={[
            ["Autonomous advice", "Conflicts with core rule", "Human review and compliance"],
            ["External integrations", "Needs security design", "API and consent model"],
            ["Advanced AI document assistant", "Needs validation controls", "Evidence and audit model"]
          ]}
        />
      </GlassPanel>
    </V2ScreenShell>
  );
}
