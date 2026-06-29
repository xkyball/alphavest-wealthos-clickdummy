import { FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EvidenceItem = {
  id: string;
  status: "CREATED" | "RESTRICTED" | "VALIDATED";
  title: string;
  type: string;
  updatedAt: string;
  visibility: string;
};

type EvidenceListProps = {
  items: EvidenceItem[];
};

const evidenceTone = {
  CREATED: "blue",
  RESTRICTED: "gold",
  VALIDATED: "green"
} as const;

export function EvidenceList({ items }: EvidenceListProps) {
  return (
    <div
      aria-label="Evidence list"
      className="overflow-hidden rounded-md border border-alphavest-border/70"
      data-testid="ux-phase5-evidence-list"
      data-ux-affordance="static-evidence-list"
      data-ux-interactive="false"
    >
      {items.map((item) => (
        <article className="flex gap-3 border-b border-alphavest-border/55 p-4 last:border-0" data-ux-affordance="static-evidence-item" data-ux-interactive="false" key={item.id}>
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-alphavest-border bg-alphavest-midnight/70 text-alphavest-gold">
            <FileText aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-alphavest-ivory">{item.title}</h3>
              <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-gold" />
            </div>
            <p className="mt-1 text-sm text-alphavest-muted">
              {item.type} · {item.visibility}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <Badge tone={evidenceTone[item.status]}>{item.status.replace("_", " ").toLowerCase()}</Badge>
            <p className="mt-2 text-xs text-alphavest-subtle">{item.updatedAt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
