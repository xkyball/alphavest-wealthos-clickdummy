import type { PrismaClient } from "@prisma/client";

import { type ActorTenantSlug, actorTenants } from "@/lib/actor-session";

export type OpsSlaSnapshot = Awaited<ReturnType<typeof getOpsSlaSnapshot>>;

function label(value: unknown) {
  return String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function pct(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

function hoursUntil(date: Date | null, now: Date) {
  return date ? Math.round((date.getTime() - now.getTime()) / 3_600_000) : null;
}

export async function getOpsSlaSnapshot(prisma: PrismaClient, tenantSlug: ActorTenantSlug, asOf = new Date()) {
  const tenant = actorTenants.find((item) => item.slug === tenantSlug);

  if (!tenant) {
    return null;
  }

  const [queueItems, dataQualityIssues, reviewSchedules] = await Promise.all([
    prisma.queueItem.findMany({
      orderBy: [{ queueName: "asc" }, { updatedAt: "desc" }],
      select: {
        assignedRoleKey: true,
        escalated: true,
        id: true,
        priority: true,
        queueName: true,
        slaDueAt: true,
        status: true,
      },
      where: { clientTenantId: tenant.id },
    }),
    prisma.dataQualityIssue.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        description: true,
        id: true,
        issueType: true,
        severity: true,
        status: true,
        updatedAt: true,
      },
      where: { clientTenantId: tenant.id },
    }),
    prisma.reviewSchedule.findMany({
      orderBy: { nextReviewDate: "asc" },
      select: {
        cadence: true,
        id: true,
        nextReviewDate: true,
        status: true,
        targetType: true,
      },
      where: { clientTenantId: tenant.id },
    }),
  ]);

  const openQueueItems = queueItems.filter((item) => String(item.status) !== "COMPLETED");
  const overdueQueueItems = openQueueItems.filter((item) => item.slaDueAt && item.slaDueAt < asOf);
  const atRiskQueueItems = openQueueItems.filter((item) => {
    const hours = hoursUntil(item.slaDueAt, asOf);
    return hours !== null && hours >= 0 && hours <= 24;
  });
  const openDqIssues = dataQualityIssues.filter((issue) => String(issue.status) !== "COMPLETED");
  const highOpenDqIssues = openDqIssues.filter((issue) => issue.severity.toLowerCase() === "high");
  const mediumOpenDqIssues = openDqIssues.filter((issue) => issue.severity.toLowerCase() === "medium");

  const grouped = new Map<string, typeof openQueueItems>();
  for (const item of openQueueItems) {
    const rows = grouped.get(item.queueName) ?? [];
    rows.push(item);
    grouped.set(item.queueName, rows);
  }

  const queueRows = Array.from(grouped.entries()).map(([queueName, rows], index) => {
    const high = rows.filter((row) => row.priority.toLowerCase() === "high").length;
    const medium = rows.filter((row) => row.priority.toLowerCase() === "medium").length;
    const overdue = rows.filter((row) => row.slaDueAt && row.slaDueAt < asOf).length;
    const escalated = rows.filter((row) => row.escalated).length;
    const sla = pct(rows.length - overdue, rows.length);

    return {
      atRisk: rows.filter((row) => {
        const hours = hoursUntil(row.slaDueAt, asOf);
        return hours !== null && hours >= 0 && hours <= 24;
      }).length,
      backlog: rows.length,
      capacity: `${Math.min(135, Math.max(35, rows.length * 18))}%`,
      high: pct(high, rows.length),
      id: `queue-${index}-${queueName}`,
      low: pct(rows.length - high - medium, rows.length),
      medium: pct(medium, rows.length),
      overdue,
      owner: rows[0]?.assignedRoleKey ? label(rows[0].assignedRoleKey) : "Unassigned",
      queue: queueName,
      sla,
      status: overdue > 0 ? "Overload" : escalated > 0 ? "Escalated" : "On Track",
    };
  });

  const breachRows = [
    ...overdueQueueItems.slice(0, 8).map((item) => ({
      client: tenant.displayName,
      due: item.slaDueAt?.toISOString().slice(0, 10) ?? "No due date",
      elapsed: item.slaDueAt ? `${Math.max(1, Math.ceil((asOf.getTime() - item.slaDueAt.getTime()) / 86_400_000))}d` : "n/a",
      escalation: item.escalated ? "L2" : "L1",
      id: item.id,
      obligation: label(item.status),
      owner: item.assignedRoleKey ? label(item.assignedRoleKey) : "Unassigned",
      service: item.queueName,
      severity: item.priority,
      status: "Breached",
    })),
    ...highOpenDqIssues.slice(0, 4).map((issue) => ({
      client: tenant.displayName,
      due: issue.updatedAt.toISOString().slice(0, 10),
      elapsed: `${Math.max(1, Math.ceil((asOf.getTime() - issue.updatedAt.getTime()) / 86_400_000))}d`,
      escalation: "Data quality",
      id: issue.id,
      obligation: issue.description,
      owner: "Data quality",
      service: issue.issueType,
      severity: issue.severity,
      status: "At Risk",
    })),
  ];

  const totalOpen = openQueueItems.length + openDqIssues.length + reviewSchedules.length;
  const breached = overdueQueueItems.length + highOpenDqIssues.length;
  const slaMet = pct(Math.max(0, totalOpen - breached), totalOpen);
  const escalated = openQueueItems.filter((item) => item.escalated).length;

  return {
    breachRows,
    escalationSummary: {
      auto: escalated,
      l1: breachRows.filter((row) => row.escalation === "L1").length,
      l2: breachRows.filter((row) => row.escalation === "L2").length,
      l3: highOpenDqIssues.length,
      total: breachRows.length,
    },
    metrics: [
      { delta: `${openQueueItems.length} queue rows`, label: "Total Backlog", tone: "gold", value: String(openQueueItems.length) },
      { delta: `${highOpenDqIssues.length} data blockers`, label: "Overdue", tone: breached > 0 ? "red" : "green", value: String(breached) },
      { delta: "Due within 24h", label: "At Risk", tone: atRiskQueueItems.length > 0 ? "gold" : "green", value: String(atRiskQueueItems.length) },
      { delta: "Current service level", label: "SLA Met", tone: slaMet < 85 ? "red" : "green", value: `${slaMet}%` },
      { delta: `${reviewSchedules.length} reviews tracked`, label: "Reviews", tone: "blue", value: String(reviewSchedules.length) },
      { delta: `${escalated} escalated`, label: "Escalations", tone: escalated > 0 ? "gold" : "green", value: String(escalated) },
    ],
    meta: {
      sourceTruth: "ops_sla_db_readmodel" as const,
      totalDataQualityIssues: dataQualityIssues.length,
      totalQueueItems: queueItems.length,
      totalReviewSchedules: reviewSchedules.length,
      updatedAt: asOf.toISOString(),
    },
    queueRows,
    releaseControls: [
      {
        detail: "Active high-severity data-quality issues stop client release, export generation, download and share.",
        label: "High-severity blockers",
        state: highOpenDqIssues.length > 0 ? "Blocked" : "Clear",
        value: highOpenDqIssues.length > 0 ? "Release blocked" : "No high blockers",
      },
      {
        detail: "Open non-high issues remain visible for operations without creating client visibility.",
        label: "Medium issues",
        state: mediumOpenDqIssues.length > 0 ? "Conditional" : "Clear",
        value: String(mediumOpenDqIssues.length),
      },
      {
        detail: "Review monitoring keeps release and advice actions separate until the right reviewer completes the work.",
        label: "Review monitoring",
        state: reviewSchedules.length > 0 ? "Internal" : "Clear",
        value: `${reviewSchedules.length} schedules`,
      },
    ],
    slaMetrics: [
      { label: "Overall SLA Compliance", state: "Current workload", tone: slaMet < 85 ? "red" : "green", value: `${slaMet}%` },
      { label: "On Track", state: "Open queue rows", tone: "green", value: String(Math.max(0, openQueueItems.length - overdueQueueItems.length)) },
      { label: "At Risk", state: "Due within 24h", tone: "gold", value: String(atRiskQueueItems.length) },
      { label: "Breached", state: "Queue plus data quality", tone: breached > 0 ? "red" : "green", value: String(breached) },
      { label: "Open Reviews", state: "Review schedules", tone: "blue", value: String(reviewSchedules.length) },
    ],
    sourceTruth: "ops_sla_db_readmodel" as const,
    unitHealth: queueRows.slice(0, 5).map((row) => ({ label: row.queue, value: row.sla })),
  };
}
