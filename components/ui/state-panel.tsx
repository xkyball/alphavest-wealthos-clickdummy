import { AlertTriangle, Ban, EyeOff, FileSearch, LoaderCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ComponentState = "blocked" | "empty" | "error" | "loading" | "restricted";

type StatePanelProps = {
  className?: string;
  detail: string;
  state: ComponentState;
  title: string;
};

const stateMeta: Record<ComponentState, { icon: LucideIcon; style: string }> = {
  blocked: { icon: Ban, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  empty: { icon: FileSearch, style: "border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted" },
  error: { icon: AlertTriangle, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  loading: { icon: LoaderCircle, style: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue" },
  restricted: { icon: EyeOff, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" }
};

export function StatePanel({ className, detail, state, title }: StatePanelProps) {
  const Icon = stateMeta[state].icon;

  return (
    <div className={cn("rounded-md border p-4", stateMeta[state].style, className)}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon aria-hidden="true" className={cn("size-4", state === "loading" && "animate-spin")} />
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-alphavest-muted">{detail}</p>
    </div>
  );
}
