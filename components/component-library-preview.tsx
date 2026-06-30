"use client";

import { useState } from "react";
import { ArrowRight, Layers, PanelRightOpen, ShieldCheck, SquareStack } from "lucide-react";
import {
  AuditTimeline,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Drawer,
  EvidenceList,
  FilterBar,
  Kanban,
  MetricCard,
  Modal,
  StatePanel,
  StatusChip,
  WizardStepper,
  WorkflowBadge,
  type DataTableColumn
} from "@/components/ui";
import {
  stage06AuditItems,
  stage06EvidenceItems,
  stage06KanbanColumns,
  stage06MetricCards,
  stage06TableRows
} from "@/lib/ui-demo-data";

type Stage06TableRow = (typeof stage06TableRows)[number];

const tableColumns: Array<DataTableColumn<Stage06TableRow>> = [
  {
    key: "item",
    header: "Item",
    render: (row) => <span className="font-semibold text-alphavest-ivory">{row.item}</span>
  },
  {
    key: "owner",
    header: "Owner",
    render: (row) => row.owner
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <WorkflowBadge status={row.status} />
  },
  {
    key: "updated",
    header: "Updated",
    render: (row) => row.updated
  }
];

const tabs = [
  { label: "All evidence", value: "all" },
  { label: "Needs review", value: "review" },
  { label: "Restricted", value: "restricted" }
];

const filters = [
  { label: "Category", value: "category" },
  { label: "Status", value: "status" },
  { label: "Date range", value: "date" }
];

export function ComponentLibraryPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stage06MetricCards.map((metric) => (
          <MetricCard
            delta={metric.delta}
            detail={metric.detail}
            key={metric.label}
            label={metric.label}
            status={metric.status}
            value={metric.value}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Data Surface</CardTitle>
              <CardDescription>Filter bar, status chips and dense enterprise table.</CardDescription>
            </div>
            <StatusChip status="PROCESSING" />
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterBar filters={filters} placeholder="Search evidence, actions, clients..." tabs={tabs} />
            <DataTable columns={tableColumns} getRowId={(row) => row.id} rows={stage06TableRows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>State Variants</CardTitle>
            <CardDescription>Reusable states for loading, empty, error, blocked and restricted UI.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <StatePanel detail="Records are being prepared for this workspace." state="loading" title="Loading state" />
            <StatePanel detail="No records match the selected filters." state="empty" title="Empty state" />
            <StatePanel detail="The request failed and should be retried." state="error" title="Error state" />
            <StatePanel detail="Compliance release is required before this content is visible." state="blocked" title="Unavailable state" />
            <StatePanel detail="Only permitted roles can view this sensitive object." state="restricted" title="Restricted state" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Wizard and Overlays</CardTitle>
            <CardDescription>Stepper geometry, modal confirmation and drawer detail surface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <WizardStepper
              steps={[
                { label: "Basic information", status: "complete" },
                { label: "Policies", status: "current" },
                { label: "Review", status: "upcoming" }
              ]}
            />
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-gold/50 bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
                onClick={() => setModalOpen(true)}
                type="button"
              >
                <ShieldCheck aria-hidden="true" className="size-4" />
                Confirm change
              </button>
              <button
                className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold hover:text-alphavest-gold-soft"
                onClick={() => setDrawerOpen(true)}
                type="button"
              >
                <PanelRightOpen aria-hidden="true" className="size-4" />
                Open detail
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">Active</Badge>
              <Badge tone="gold">Pending</Badge>
              <Badge tone="red">Blocked</Badge>
              <WorkflowBadge status="REVIEW" />
              <WorkflowBadge status="RESOLVED" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kanban</CardTitle>
            <CardDescription>Review flow board columns and compact action cards.</CardDescription>
          </CardHeader>
          <CardContent>
            <Kanban columns={stage06KanbanColumns} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evidence List</CardTitle>
            <CardDescription>Evidence records with visibility and validation status.</CardDescription>
          </CardHeader>
          <CardContent>
            <EvidenceList items={stage06EvidenceItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Timeline</CardTitle>
            <CardDescription>Append-only event display for sensitive actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuditTimeline items={stage06AuditItems} />
          </CardContent>
        </Card>
      </section>

      <Modal
        description="Changing release controls requires second confirmation."
        footer={
          <>
            <button
              className="inline-flex h-[var(--button-height)] items-center justify-center rounded-md border border-alphavest-border px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-gold/50 bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              <ShieldCheck aria-hidden="true" className="size-4" />
              Confirm change
            </button>
          </>
        }
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title="Confirm Critical Change"
      >
        <StatePanel
          detail="A second confirmation is required before this sensitive setting can proceed."
          state="restricted"
          title="Second confirmation required"
        />
      </Modal>

      <Drawer
        description="Evidence, audit and permission context for the selected action."
        footer={
          <button
            className="inline-flex h-[var(--button-height)] w-full items-center justify-center gap-2 rounded-md border border-alphavest-gold/50 bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
            onClick={() => setDrawerOpen(false)}
            type="button"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
            Continue review
          </button>
        }
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="Action Detail"
      >
        <div className="space-y-4">
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
              <Layers aria-hidden="true" className="size-4" />
              Evidence coverage
            </div>
            <EvidenceList items={stage06EvidenceItems.slice(0, 2)} />
          </div>
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
              <SquareStack aria-hidden="true" className="size-4" />
              Audit preview
            </div>
            <AuditTimeline items={stage06AuditItems.slice(0, 2)} />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
