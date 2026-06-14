import Image from "next/image";
import type { ReactNode } from "react";
import type { StatusTone, WorkflowBadge as WorkflowBadgeName } from "@/lib/status";
import { badgeTone } from "@/lib/status";

type WithChildren = {
  children: ReactNode;
  className?: string;
};

type KeyValue = {
  label: string;
  value: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-av-line text-av-muted",
  success: "border-av-success/60 bg-av-success/10 text-av-success",
  warning: "border-av-warning/60 bg-av-warning/10 text-av-warning",
  danger: "border-av-danger/70 bg-av-danger/10 text-av-danger",
  info: "border-av-info/60 bg-av-info/10 text-av-info",
  review: "border-av-review/60 bg-av-review/10 text-av-review"
};

const markerClasses: Record<StatusTone, string> = {
  neutral: "border-av-line bg-av-muted/20 text-av-muted",
  success: "border-av-success/70 bg-av-success/15 text-av-success",
  warning: "border-av-warning/70 bg-av-warning/15 text-av-warning",
  danger: "border-av-danger/80 bg-av-danger/15 text-av-danger",
  info: "border-av-info/70 bg-av-info/15 text-av-info",
  review: "border-av-review/70 bg-av-review/15 text-av-review"
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  className
}: {
  kicker: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <header className={cn("space-y-3", className)}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-av-gold">
        {kicker}
      </p>
      <div>
        <h1 className="font-display text-4xl leading-none text-av-ivory md:text-6xl">
          {title}
        </h1>
        <p className="mt-2 max-w-4xl text-base italic text-av-goldBright md:text-lg">
          {subtitle}
        </p>
      </div>
    </header>
  );
}

export function GlassPanel({
  title,
  eyebrow,
  children,
  className,
  actions
}: WithChildren & {
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-av-line bg-av-panel/72 p-4 shadow-panel backdrop-blur",
        className
      )}
    >
      {title || eyebrow || actions ? (
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-av-line/45 pb-2">
          <div>
            {eyebrow ? (
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-av-muted">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-display text-xl leading-tight text-av-goldBright">
                {title}
              </h2>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function WorkflowBadge({ label }: { label: WorkflowBadgeName }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2.5 py-1 font-mono text-[0.68rem] font-semibold",
        toneClasses[badgeTone[label]]
      )}
    >
      [{label}]
    </span>
  );
}

export function StatusChip({
  children,
  tone = "neutral"
}: WithChildren & { tone?: StatusTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

export function RoleBadge({
  role,
  sublabel,
  tone = "warning"
}: {
  role: string;
  sublabel?: string;
  tone?: StatusTone;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-av-midnight/45 px-3 py-2",
        toneClasses[tone]
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-current">
        ◎
      </span>
      <span>
        <span className="block text-sm text-av-ivory">{role}</span>
        {sublabel ? (
          <span className="block text-xs text-av-muted">{sublabel}</span>
        ) : null}
      </span>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "warning"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: StatusTone;
}) {
  return (
    <GlassPanel className="min-h-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-av-muted">{label}</p>
          <p className="mt-3 font-display text-4xl text-av-goldBright">
            {value}
          </p>
          <p className="mt-2 text-sm text-av-muted">{detail}</p>
        </div>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-full border text-sm",
            markerClasses[tone]
          )}
        >
          ◌
        </span>
      </div>
    </GlassPanel>
  );
}

export function WireframePhone({
  children,
  title = "AlphaVest WealthOS",
  className
}: WithChildren & { title?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-72 rounded-[2rem] border border-av-gold/70 bg-av-midnight p-3 shadow-glow",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between px-2 text-[0.68rem] text-av-ivory">
        <span>9:41</span>
        <span className="h-2 w-16 rounded-full bg-black/35" />
        <span>▰</span>
      </div>
      <div className="rounded-2xl border border-av-line bg-av-navy p-4">
        <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-av-goldBright">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}

export function DashboardCard({
  title,
  children,
  footer,
  className
}: WithChildren & {
  title: string;
  footer?: ReactNode;
}) {
  return (
    <GlassPanel className={cn("h-full", className)} title={title}>
      <div className="text-sm text-av-muted">{children}</div>
      {footer ? (
        <div className="mt-4 border-t border-av-line/40 pt-3 text-xs text-av-goldBright">
          {footer}
        </div>
      ) : null}
    </GlassPanel>
  );
}

export function ActionCard({
  title,
  description,
  badge,
  priority = "neutral"
}: {
  title: string;
  description: string;
  badge: WorkflowBadgeName;
  priority?: StatusTone;
}) {
  return (
    <div className="rounded-lg border border-av-line bg-av-midnight/50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-av-ivory">{title}</p>
          <p className="mt-1 text-xs text-av-muted">{description}</p>
        </div>
        <StatusChip tone={priority}>●</StatusChip>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <WorkflowBadge label={badge} />
        <span className="text-av-goldBright">→</span>
      </div>
    </div>
  );
}

export function EvidenceTimeline({
  items
}: {
  items: Array<{
    title: string;
    detail: string;
    badge: WorkflowBadgeName;
  }>;
}) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="relative rounded-lg border border-av-line bg-av-midnight/45 p-3 text-sm"
        >
          <span className="mb-2 inline-grid size-7 place-items-center rounded-full border border-av-gold text-av-gold">
            {index + 1}
          </span>
          <p className="font-semibold text-av-ivory">{item.title}</p>
          <p className="mt-1 min-h-12 text-xs text-av-muted">{item.detail}</p>
          <div className="mt-3">
            <WorkflowBadge label={item.badge} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HumanReviewFlow({
  steps
}: {
  steps: Array<{
    badge: WorkflowBadgeName;
    title: string;
    complete?: boolean;
  }>;
}) {
  return (
    <ol className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">
      {steps.map((step, index) => (
        <li
          key={`${step.badge}-${step.title}`}
          className="rounded-lg border border-av-line bg-av-midnight/45 p-3 text-center text-xs"
        >
          <span className="mx-auto mb-2 grid size-7 place-items-center rounded-full border border-av-gold text-av-gold">
            {index + 1}
          </span>
          <WorkflowBadge label={step.badge} />
          <p className="mt-2 text-av-ivory">{step.title}</p>
          <p
            className={cn(
              "mt-1",
              step.complete ? "text-av-success" : "text-av-muted"
            )}
          >
            {step.complete ? "Complete" : "Gate active"}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function ComplianceGate({
  advisorApproved,
  complianceReviewed,
  evidenceRecorded,
  clientVisible
}: {
  advisorApproved: boolean;
  complianceReviewed: boolean;
  evidenceRecorded: boolean;
  clientVisible: boolean;
}) {
  const gates = [
    ["Advisor approval", advisorApproved],
    ["Compliance review", complianceReviewed],
    ["Evidence record", evidenceRecorded],
    ["Client visibility", clientVisible]
  ] as const;

  return (
    <GlassPanel
      title="Compliance Gate"
      actions={<WorkflowBadge label={clientVisible ? "CLIENT" : "BLOCKED"} />}
    >
      <div className="grid gap-2">
        {gates.map(([label, complete]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm"
          >
            <span>{label}</span>
            <StatusChip tone={complete ? "success" : "warning"}>
              {complete ? "Ready" : "Pending"}
            </StatusChip>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-av-muted">
        No unapproved advice reaches the client.
      </p>
    </GlassPanel>
  );
}

export function PermissionMatrix({
  rows
}: {
  rows: Array<{
    role: string;
    assets: string;
    documents: string;
    decisions: string;
    sensitive: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-av-line">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-av-panelSoft text-av-goldBright">
          <tr>
            {["Role", "Assets", "Documents", "Decisions", "Sensitive"].map(
              (column) => (
                <th key={column} className="border-b border-av-line px-3 py-2">
                  {column}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.role} className="odd:bg-white/[0.02]">
              <td className="border-b border-av-line/40 px-3 py-2 text-av-ivory">
                {row.role}
              </td>
              <td className="border-b border-av-line/40 px-3 py-2">
                {row.assets}
              </td>
              <td className="border-b border-av-line/40 px-3 py-2">
                {row.documents}
              </td>
              <td className="border-b border-av-line/40 px-3 py-2">
                {row.decisions}
              </td>
              <td className="border-b border-av-line/40 px-3 py-2 text-av-warning">
                {row.sensitive}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MiniWorldMap({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative min-h-32 overflow-hidden rounded-lg border border-av-line bg-av-midnight/50",
        className
      )}
    >
      <div className="absolute inset-0 world-motif opacity-70" />
      {[
        ["left-[18%] top-[46%]", "Cape Town"],
        ["left-[47%] top-[32%]", "London"],
        ["left-[63%] top-[44%]", "Dubai"],
        ["left-[78%] top-[58%]", "Singapore"]
      ].map(([position, label]) => (
        <div key={label} className={cn("absolute", position)}>
          <span className="block size-2 rounded-full bg-av-goldBright shadow-glow" />
          <span className="mt-1 block whitespace-nowrap text-[0.6rem] text-av-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RightAnnotationPanel({
  title = "Action Annotation",
  userRole,
  coreAction,
  systemReaction,
  outcome
}: {
  title?: string;
  userRole: string;
  coreAction: string;
  systemReaction: string;
  outcome: string;
}) {
  const rows: KeyValue[] = [
    { label: "User role", value: userRole, tone: "info" },
    { label: "Core action", value: coreAction, tone: "warning" },
    { label: "System reaction", value: systemReaction, tone: "review" },
    { label: "Outcome", value: outcome, tone: "success" }
  ];

  return (
    <GlassPanel title={title}>
      <dl className="grid gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded border border-av-line/40 bg-av-midnight/35 p-3 text-sm"
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-full border",
                markerClasses[row.tone ?? "neutral"]
              )}
            >
              i
            </span>
            <div>
              <dt className="text-av-goldBright">{row.label}</dt>
              <dd className="mt-1 text-av-muted">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </GlassPanel>
  );
}

export function BottomWorkflowStrip({
  badges,
  message = "Secure by design. End-to-end encryption. Region-aware. Privacy by choice. Always auditable."
}: {
  badges: WorkflowBadgeName[];
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-av-line bg-av-panel/72 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-av-muted">{message}</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <WorkflowBadge key={badge} label={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReferenceImageViewer({
  src,
  alt,
  caption
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <GlassPanel title="Reference Image Viewer" eyebrow="Dev / QA">
      <Image
        alt={alt}
        className="rounded-lg border border-av-line"
        height={236}
        src={src}
        width={420}
      />
      <p className="mt-3 text-xs text-av-muted">
        {caption ??
          "Use as a visual source while keeping the actual screen implemented in HTML/CSS/React."}
      </p>
    </GlassPanel>
  );
}

export function DashboardTable({
  columns,
  rows
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-av-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-av-panelSoft text-av-goldBright">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-av-line px-3 py-2">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="odd:bg-white/[0.02]">
              {row.map((cell) => (
                <td key={cell} className="border-b border-av-line/50 px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Timeline({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((item, index) => (
        <li
          key={item}
          className="rounded-lg border border-av-line bg-av-panel/60 p-3 text-sm"
        >
          <span className="mb-2 inline-grid size-7 place-items-center rounded-full border border-av-gold text-av-gold">
            {index + 1}
          </span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

export function Drawer({ title, children }: WithChildren & { title: string }) {
  return (
    <aside className="rounded-lg border border-av-line bg-av-panelSoft/70 p-4">
      <h2 className="font-display text-xl text-av-goldBright">{title}</h2>
      <div className="mt-3 text-sm text-av-muted">{children}</div>
    </aside>
  );
}

export function Modal({ title, children }: WithChildren & { title: string }) {
  return (
    <div className="rounded-lg border border-av-line bg-av-midnight/95 p-5 shadow-panel">
      <h2 className="font-display text-2xl text-av-goldBright">{title}</h2>
      <div className="mt-3 text-sm text-av-muted">{children}</div>
    </div>
  );
}

export function GateChecklist({
  items
}: {
  items: Array<{ label: string; complete: boolean }>;
}) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center justify-between gap-4 rounded-lg border border-av-line/70 bg-av-midnight/45 px-3 py-2 text-sm"
        >
          <span>{item.label}</span>
          <StatusChip tone={item.complete ? "success" : "warning"}>
            {item.complete ? "Ready" : "Pending"}
          </StatusChip>
        </li>
      ))}
    </ul>
  );
}
