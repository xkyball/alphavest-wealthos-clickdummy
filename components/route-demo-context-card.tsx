"use client";

import { UserRound } from "lucide-react";
import { useDemoSession } from "@/components/demo-session-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusChip } from "@/components/ui";

type RouteDemoContextCardProps = {
  roleFamily: string;
};

export function RouteDemoContextCard({ roleFamily }: RouteDemoContextCardProps) {
  const { session } = useDemoSession();

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
          <UserRound aria-hidden="true" className="size-5" />
        </div>
        <div>
          <CardTitle>Demo Context</CardTitle>
          <CardDescription>Role and tenant are switchable in the top bar.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
            Active tenant
          </dt>
          <dd className="mt-1 text-alphavest-ivory">{session.tenant.displayName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
            Active actor
          </dt>
          <dd className="mt-1 text-alphavest-ivory">
            {session.actor.displayName} · {session.role.label}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
            Primary role family
          </dt>
          <dd className="mt-1 text-alphavest-ivory">{roleFamily}</dd>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
          <span className="text-sm text-alphavest-muted">Permission mode</span>
          <StatusChip label="Demo active" status="ACTIVE" />
        </div>
      </CardContent>
    </Card>
  );
}
