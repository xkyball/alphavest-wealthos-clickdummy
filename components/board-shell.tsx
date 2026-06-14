import Image from "next/image";
import Link from "next/link";
import type { BoardRoute } from "@/lib/routes";
import { demoFamily, phaseOneMockObjects } from "@/lib/demo-data";
import {
  fullReviewWorkflow,
  phaseOneBoundary,
  regulatoryDisclaimers
} from "@/lib/workflows";
import {
  GateChecklist,
  GlassPanel,
  PageHeader,
  StatusChip,
  WorkflowBadge
} from "./ui";

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
          kicker={`${phaseOneBoundary.label} / ${board.surface}`}
          title={`Board ${Number(board.number)} — ${board.title}`}
          subtitle={board.subtitle}
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5">
            <GlassPanel>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <StatusChip tone="success">Route skeleton active</StatusChip>
                  <p className="mt-3 max-w-3xl text-sm text-av-muted">
                    {phaseOneBoundary.description}
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
                        Detailed implementation scheduled after Phase 1.
                      </p>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel title="Reference board">
                <Image
                  alt={`${board.title} reference wireframe`}
                  className="rounded-lg border border-av-line"
                  height={236}
                  priority={board.number === "01"}
                  src={board.referenceImage}
                  width={420}
                />
                <p className="mt-3 text-xs text-av-muted">
                  Source PNG inspected and used for layout direction. This route
                  remains HTML/CSS/React, not a static background.
                </p>
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

              <GlassPanel title="Phase 1 foundation checklist">
                <GateChecklist
                  items={[
                    { label: "Next.js App Router route", complete: true },
                    { label: "AlphaVest design tokens", complete: true },
                    { label: "Global demo disclaimer", complete: true },
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
          </div>

          <aside className="grid content-start gap-5">
            <GlassPanel title="Action annotation">
              <dl className="grid gap-4 text-sm">
                <div>
                  <dt className="text-av-goldBright">User role</dt>
                  <dd className="mt-1 text-av-muted">
                    {board.annotations.userRole}
                  </dd>
                </div>
                <div>
                  <dt className="text-av-goldBright">Core action</dt>
                  <dd className="mt-1 text-av-muted">
                    {board.annotations.coreAction}
                  </dd>
                </div>
                <div>
                  <dt className="text-av-goldBright">System reaction</dt>
                  <dd className="mt-1 text-av-muted">
                    {board.annotations.systemReaction}
                  </dd>
                </div>
                <div>
                  <dt className="text-av-goldBright">Outcome</dt>
                  <dd className="mt-1 text-av-muted">
                    {board.annotations.outcome}
                  </dd>
                </div>
              </dl>
            </GlassPanel>

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
