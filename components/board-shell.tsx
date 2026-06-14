import Link from "next/link";
import type { BoardRoute } from "@/lib/routes";
import { demoFamily, phaseOneMockObjects } from "@/lib/demo-data";
import {
  currentPhaseBoundary,
  fullReviewWorkflow,
  regulatoryDisclaimers
} from "@/lib/workflows";
import {
  ActionCard,
  BottomWorkflowStrip,
  ComplianceGate,
  DashboardCard,
  EvidenceTimeline,
  GateChecklist,
  GlassPanel,
  HumanReviewFlow,
  MetricCard,
  MiniWorldMap,
  PageHeader,
  PermissionMatrix,
  ReferenceImageViewer,
  RightAnnotationPanel,
  RoleBadge,
  StatusChip,
  WireframePhone,
  WorkflowBadge
} from "./ui";

const phaseTwoReviewSteps = [
  { badge: "AI-DRAFT", title: "Draft created", complete: true },
  { badge: "ANALYST", title: "Context reviewed", complete: true },
  { badge: "ADVISOR", title: "Advisor approves", complete: true },
  { badge: "COMPLIANCE", title: "Boundary checked" },
  { badge: "CLIENT", title: "Client visibility" },
  { badge: "EVIDENCE", title: "Record linked" },
  { badge: "REVIEW", title: "Review rhythm" }
] as const;

const evidenceSteps = [
  {
    title: "Document uploaded",
    detail: "Client or advisor adds source evidence to the vault.",
    badge: "CLIENT"
  },
  {
    title: "Advisor reviewed",
    detail: "Human context and suitability are checked before release.",
    badge: "ADVISOR"
  },
  {
    title: "Compliance checked",
    detail: "Advice boundary, disclaimer and record status are validated.",
    badge: "COMPLIANCE"
  },
  {
    title: "Linked to decision",
    detail: "Evidence record connects recommendation, approval and audit.",
    badge: "EVIDENCE"
  },
  {
    title: "Next review",
    detail: "Review rhythm keeps assumptions from becoming stale.",
    badge: "REVIEW"
  }
] as const;

const matrixRows = [
  {
    role: "Principal",
    assets: "Full",
    documents: "Manage",
    decisions: "Approve",
    sensitive: "2nd conf."
  },
  {
    role: "Next Generation",
    assets: "View",
    documents: "Limited",
    decisions: "View",
    sensitive: "Restricted"
  },
  {
    role: "Senior Advisor",
    assets: "Manage",
    documents: "Review",
    decisions: "Recommend",
    sensitive: "View only"
  },
  {
    role: "Compliance Officer",
    assets: "Review",
    documents: "Audit",
    decisions: "Release",
    sensitive: "Policy"
  }
];

export function BoardShell({
  board,
  primaryAction
}: {
  board: BoardRoute;
  primaryAction?: {
    href: string;
    label: string;
  };
}) {
  return (
    <article className="relative overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-2/3 opacity-35">
        <div className="world-motif h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-av-line pb-4">
          <div className="flex items-center gap-3 text-av-goldBright">
            <div className="grid size-10 place-items-center rounded-lg border border-av-gold">
              AV
            </div>
            <p className="text-sm md:text-base">
              AlphaVest WealthOS — Wireframe System
            </p>
          </div>
          <p className="font-display text-5xl text-av-goldBright">
            {board.number}
          </p>
        </div>

        <PageHeader
          kicker={`${currentPhaseBoundary.label} / ${board.surface}`}
          title={`Board ${Number(board.number)} — ${board.title}`}
          subtitle={board.subtitle}
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5">
            <GlassPanel>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <StatusChip tone="success">Phase 2 component system active</StatusChip>
                  <p className="mt-3 max-w-3xl text-sm text-av-muted">
                    Reusable AlphaVest board components now provide the
                    premium wireframe language for the later route builds:
                    dense panels, phone frames, workflow gates, evidence
                    timelines, permission matrices, map motifs and QA
                    reference thumbnails.
                  </p>
                </div>
                {primaryAction ? (
                  <Link
                    className="rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight transition hover:bg-av-goldBright"
                    href={primaryAction.href}
                  >
                    {primaryAction.label}
                  </Link>
                ) : null}
              </div>
            </GlassPanel>

            <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
              <WireframePhone>
                <p className="font-display text-2xl text-av-goldBright">
                  Good morning,
                  <br />
                  Family Steward
                </p>
                <div className="mt-4 grid gap-2">
                  <ActionCard
                    badge="CLIENT"
                    description="Provide documents to stay on track."
                    priority="warning"
                    title="3 documents missing"
                  />
                  <ActionCard
                    badge="ADVISOR"
                    description="Advisor-approved recommendation ready."
                    priority="success"
                    title="Decision ready"
                  />
                  <ActionCard
                    badge="EVIDENCE"
                    description="Securely add a document."
                    title="Upload document"
                  />
                </div>
              </WireframePhone>

              <div className="grid gap-5">
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard
                    detail="Moderate gaps identified"
                    label="Structure completeness"
                    value="72%"
                  />
                  <MetricCard
                    detail="2 high priority"
                    label="Open actions"
                    tone="danger"
                    value="5"
                  />
                  <MetricCard
                    detail="Evidence record ready"
                    label="Compliance gate"
                    tone="success"
                    value="3/4"
                  />
                </div>

                <DashboardCard
                  footer="Triggers are review points, not final advice."
                  title="Human review flow"
                >
                  <HumanReviewFlow steps={[...phaseTwoReviewSteps]} />
                </DashboardCard>
              </div>

              <ComplianceGate
                advisorApproved
                clientVisible={false}
                complianceReviewed={false}
                evidenceRecorded
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <DashboardCard
                footer="Evidence replaces assumption."
                title="Evidence lifecycle timeline"
              >
                <EvidenceTimeline items={[...evidenceSteps]} />
              </DashboardCard>

              <DashboardCard title="Global signal motif">
                <MiniWorldMap />
                <div className="mt-3 grid gap-2">
                  <RoleBadge
                    role="Senior Wealth Advisor"
                    sublabel="Human decision owner"
                  />
                  <RoleBadge
                    role="Compliance Officer"
                    sublabel="Release gate"
                    tone="success"
                  />
                </div>
              </DashboardCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <GlassPanel title="Permission Matrix">
                <PermissionMatrix rows={matrixRows} />
                <p className="mt-3 text-xs text-av-muted">
                  Sensitive access requires a second confirmation and creates an
                  audit event.
                </p>
              </GlassPanel>

              <ReferenceImageViewer
                alt={`${board.title} reference wireframe`}
                caption="Dev/QA component used to compare the HTML board language with the supplied PNG reference."
                src={board.referenceImage}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <GlassPanel title="Planned board modules">
                <div className="grid gap-3 md:grid-cols-2">
                  {board.plannedModules.map((module) => (
                    <div
                      key={module}
                      className="rounded-lg border border-av-line bg-av-midnight/45 p-3 text-sm"
                    >
                      <p className="text-av-ivory">{module}</p>
                      <p className="mt-2 text-xs text-av-muted">
                        Detailed implementation scheduled after Phase 2.
                      </p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <GlassPanel title="Human workflow gate">
                <div className="flex flex-wrap gap-2">
                  {fullReviewWorkflow.map((badge) => (
                    <WorkflowBadge key={badge} label={badge} />
                  ))}
                </div>
                <p className="mt-4 text-sm text-av-muted">
                  Client visibility remains blocked until advisor approval and
                  compliance review are both complete.
                </p>
              </GlassPanel>

              <GlassPanel title="Phase 2 foundation checklist">
                <GateChecklist
                  items={[
                    { label: "Next.js App Router route", complete: true },
                    { label: "AlphaVest design tokens", complete: true },
                    { label: "Global demo disclaimer", complete: true },
                    { label: "Reusable component system", complete: true },
                    { label: "Detailed screen interaction", complete: false }
                  ]}
                />
              </GlassPanel>
            </div>

            <GlassPanel title="Seed context">
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <p className="text-av-goldBright">Fictional family</p>
                  <p className="text-av-muted">{demoFamily.familyName}</p>
                </div>
                <div>
                  <p className="text-av-goldBright">Primary trust</p>
                  <p className="text-av-muted">{demoFamily.trust}</p>
                </div>
                <div>
                  <p className="text-av-goldBright">Mock object model</p>
                  <p className="text-av-muted">
                    {phaseOneMockObjects.length} seeded object types planned
                  </p>
                </div>
              </div>
            </GlassPanel>

            <BottomWorkflowStrip badges={board.workflow} />
          </div>

          <aside className="grid content-start gap-5">
            <RightAnnotationPanel
              coreAction={board.annotations.coreAction}
              outcome={board.annotations.outcome}
              systemReaction={board.annotations.systemReaction}
              userRole={board.annotations.userRole}
            />

            <GlassPanel title="Route workflow badges">
              <div className="flex flex-wrap gap-2">
                {board.workflow.map((badge) => (
                  <WorkflowBadge key={badge} label={badge} />
                ))}
              </div>
            </GlassPanel>

            <GlassPanel title="Safety copy">
              <div className="grid gap-3 text-sm text-av-muted">
                {regulatoryDisclaimers.slice(1).map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            </GlassPanel>
          </aside>
        </div>
      </div>
    </article>
  );
}
