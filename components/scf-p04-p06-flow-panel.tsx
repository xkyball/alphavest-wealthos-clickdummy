"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle, StatePanel } from "@/components/ui";
import { p04P06FlowPanels } from "@/lib/screen-capability-flow";

type FlowPanelMode = keyof typeof p04P06FlowPanels;

export function ScfP04P06FlowPanel({ compact = false, mode }: { compact?: boolean; mode: FlowPanelMode }) {
  const panel = p04P06FlowPanels[mode];

  if (compact) {
    const compactMissing = mode === "advisory"
      ? panel.missing.filter((item) => ["ai_draft_internal_only"].includes(item))
      : panel.missing.slice(0, 3);
    const compactSteps = mode === "advisory"
      ? panel.steps.filter((step) => step.label === "Draft boundary")
      : panel.steps;

    return (
      <div data-testid={`p04-p06-${mode}-gate`}>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-2 p-2.5">
            <div className="min-w-40 flex-1">
              <CardTitle className="text-base">{panel.title}</CardTitle>
              <p className="mt-1 line-clamp-1 text-xs leading-5 text-alphavest-muted">{panel.detail}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {compactSteps.map((step) => (
                <Badge className="whitespace-nowrap" key={step.label} tone={step.tone}>{step.label}: {step.status}</Badge>
              ))}
            </div>
            {compactMissing.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {compactMissing.map((item) => (
                  <Badge className="whitespace-nowrap" key={item} tone="red">
                    {item.replaceAll("_", " ")}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div data-testid={`p04-p06-${mode}-gate`}>
      <Card>
        <CardHeader>
          <CardTitle>{panel.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatePanel detail={panel.detail} state={panel.state} title={panel.gateLabel} />
          <div className="grid gap-3 2xl:grid-cols-3">
            {panel.steps.map((step) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={step.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">{step.label}</p>
                  <Badge className="shrink-0 whitespace-nowrap" tone={step.tone}>{step.status}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-alphavest-muted">{step.detail}</p>
              </div>
            ))}
          </div>
          {panel.missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {panel.missing.map((item) => (
                <Badge className="whitespace-nowrap" key={item} tone="red">
                  {item.replaceAll("_", " ")}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
