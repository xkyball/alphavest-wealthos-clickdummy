"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle, StatePanel } from "@/components/ui";
import { p07P09TrustPanels } from "@/lib/screen-trust-flow";

type TrustPanelMode = keyof typeof p07P09TrustPanels;

export function ScfP07P09TrustPanel({ mode }: { mode: TrustPanelMode }) {
  const panel = p07P09TrustPanels[mode];

  return (
    <div data-testid={`p07-p09-${mode}-trust`}>
      <Card>
        <CardHeader>
          <CardTitle>{panel.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatePanel detail={panel.detail} state={panel.state} title={panel.gateLabel} />
          <div className="grid gap-3 md:grid-cols-3">
            {panel.steps.map((step) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={step.label}>
                <div className="flex items-start justify-between gap-3">
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
                <Badge className="h-auto min-h-[var(--status-chip-height)] max-w-full whitespace-normal py-1 leading-4" key={item} tone="red">
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
