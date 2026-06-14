import type { ReactNode } from "react";
import type { StatusTone, WorkflowBadge as WorkflowBadgeName } from "@/lib/status";
import { badgeTone } from "@/lib/status";

type WithChildren = {
  children: ReactNode;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-av-line text-av-muted",
  success: "border-av-success/60 bg-av-success/10 text-av-success",
  warning: "border-av-warning/60 bg-av-warning/10 text-av-warning",
  danger: "border-av-danger/70 bg-av-danger/10 text-av-danger",
  info: "border-av-info/60 bg-av-info/10 text-av-info",
  review: "border-av-review/60 bg-av-review/10 text-av-review"
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageHeader({
  kicker,
  title,
  subtitle
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="space-y-3">
      <p className="font-mono text-xs uppercase text-av-gold">{kicker}</p>
      <div>
        <h1 className="font-display text-4xl text-av-ivory md:text-6xl">
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
  children,
  className
}: WithChildren & { title?: string }) {
  return (
    <section
      className={cn(
        "rounded-lg border border-av-line bg-av-panel/72 p-4 shadow-panel backdrop-blur",
        className
      )}
    >
      {title ? (
        <h2 className="mb-3 font-display text-xl text-av-goldBright">
          {title}
        </h2>
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

export function MetricCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <GlassPanel className="min-h-32">
      <p className="text-xs uppercase text-av-muted">{label}</p>
      <p className="mt-3 font-display text-4xl text-av-goldBright">{value}</p>
      <p className="mt-2 text-sm text-av-muted">{detail}</p>
    </GlassPanel>
  );
}

export function WireframePhone({ children }: WithChildren) {
  return (
    <div className="mx-auto max-w-72 rounded-[2rem] border border-av-gold/70 bg-av-midnight p-3 shadow-glow">
      <div className="mb-3 h-5 rounded-full border border-av-line" />
      <div className="rounded-2xl border border-av-line bg-av-navy p-4">
        {children}
      </div>
    </div>
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
