"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle, StatePanel } from "@/components/ui";
import { scfP10P14ProofPackage } from "@/lib/scf-p10-p14-proof";

type ClosurePanelMode = "api" | "documents" | "handoff";

const modeCopy: Record<ClosurePanelMode, { detail: string; title: string }> = {
  api: {
    detail: "Existing APIs return scoped safety metadata and fail closed without release, advice or export side effects.",
    title: "API and Persistence Closure",
  },
  documents: {
    detail: "Search, filters and table output now change the visible scoped document set without exposing hidden rows.",
    title: "Document Interaction Closure",
  },
  handoff: {
    detail: "P10-P14 status is tied to executable tasks, QA artefacts and explicitly blocked unsupported scope.",
    title: "Handoff Closure",
  },
};

export function ScfP10P14ClosurePanel({ mode }: { mode: ClosurePanelMode }) {
  const copy = modeCopy[mode];

  return (
    <div data-testid={`p10-p14-${mode}-closure`}>
      <Card>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatePanel detail={copy.detail} state="success" title="Closure state" />
          <div className="grid gap-3 md:grid-cols-3">
            <ClosureMetric label="Master tasks" value={String(scfP10P14ProofPackage.masterTaskCount)} />
            <ClosureMetric label="Subtasks" value={String(scfP10P14ProofPackage.subtaskCount)} />
            <ClosureMetric label="Unsupported request" value={scfP10P14ProofPackage.unsupportedRequestedPhases.join(", ")} />
          </div>
          <div className="flex flex-wrap gap-2">
            {scfP10P14ProofPackage.taskIds.map((taskId) => (
              <Badge key={taskId} tone={taskId.startsWith("SCF-P14") ? "gold" : "green"}>
                {taskId}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClosureMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3">
      <p className="text-xs font-semibold uppercase text-alphavest-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}
