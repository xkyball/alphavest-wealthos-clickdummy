import { Plus } from "lucide-react";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { WorkflowBadge, type WorkflowBadgeStatus } from "@/components/ui/workflow-badge";

type KanbanItem = {
  id: string;
  meta: string;
  priority: string;
  status: WorkflowBadgeStatus;
  title: string;
};

type KanbanColumn = {
  id: string;
  items: KanbanItem[];
  title: string;
};

type KanbanProps = {
  columns: KanbanColumn[];
};

export function Kanban({ columns }: KanbanProps) {
  return (
    <div className="grid gap-3 xl:grid-cols-3">
      {columns.map((column) => {
        const disabledReason = "Kanban item creation is not wired in this release.";
        const disabledReasonId = disabledControlReasonId(`kanban-${column.id}-add`);

        return (
          <section className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/50 p-3" key={column.id}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-alphavest-ivory">{column.title}</h3>
              <span className="rounded-full border border-alphavest-border px-2 py-0.5 text-xs text-alphavest-muted">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.items.map((item) => (
                <article className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/70 p-3" key={item.id}>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-alphavest-ivory">{item.title}</h4>
                    <WorkflowBadge label={item.priority} status={item.status} />
                  </div>
                  <p className="mt-2 text-xs text-alphavest-muted">{item.meta}</p>
                </article>
              ))}
              <p
                aria-describedby={disabledReasonId}
                aria-label={`Add item to ${column.title} is not wired in this release`}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-alphavest-border text-xs text-alphavest-gold opacity-60"
                data-ux-affordance="blocked-cta"
                data-ux-disabled-message="accessible"
                data-ux-disabled-reason={disabledReason}
                data-ux-interactive="false"
                role="status"
                title={disabledReason}
              >
                <Plus aria-hidden="true" className="size-4" />
                Add item
                <DisabledControlReason id={disabledReasonId} reason={disabledReason} />
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
