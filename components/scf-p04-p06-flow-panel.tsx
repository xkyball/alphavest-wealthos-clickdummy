"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle, StatePanel } from "@/components/ui";
import { p04P06FlowPanels } from "@/lib/screen-capability-flow";

type FlowPanelMode = keyof typeof p04P06FlowPanels;

export function ScfP04P06FlowPanel({ mode }: { mode: FlowPanelMode }) {
  const panel = p04P06FlowPanels[mode];

  return (
    <div data-testid={`p04-p06-${mode}-gate`}>
      <Card>
        <CardHeader>
          <CardTitle>{panel.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatePanel detail={panel.detail} state={panel.state} title={panel.gateLabel} />
          <div className="grid gap-3 md:grid-cols-3">
            {panel.steps.map((step) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={step.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">{step.label}</p>
                  <Badge tone={step.tone}>{step.status}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-alphavest-muted">{step.detail}</p>
              </div>
            ))}
          </div>
          {panel.missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {panel.missing.map((item) => (
                <Badge key={item} tone="red">
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
