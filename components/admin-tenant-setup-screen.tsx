"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Filter,
  RefreshCcw,
  LockKeyhole,
  Plus,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SquarePen,
  Trash2,
  Upload,
  UserPlus,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { WorksurfaceShell } from "@/components/worksurface-shell";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Drawer,
  Modal,
  StatePanel,
  StatusChip,
  WizardStepper,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import {
  activeSessions,
  adviceMatrix,
  platformSettings,
  policyVersions,
  securityControls,
  tenantWizardSteps,
  type AdminTenantSetupPageId
} from "@/lib/admin-tenant-setup-seed-data";
import { cn } from "@/lib/cn";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import { uxActionClassForPriority } from "@/lib/ux-action-hierarchy-contract";
import type { AdminTenantSnapshot } from "@/lib/admin-tenant-readmodel-service";
import { runPlatformAdminCommand } from "@/lib/platform-admin-command-client";
import type { ScreenRoute } from "@/lib/route-registry";
import { runTenantGovernanceCommand } from "@/lib/tenant-governance-command-client";
import type { VisualState } from "@/lib/visual-contract";

type AdminTenantSetupScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type AdminTenantSnapshotData = NonNullable<AdminTenantSnapshot>;
type TenantSetupChecklistRow = AdminTenantSnapshotData["setupChecklist"][number];
type TenantTeamRow = AdminTenantSnapshotData["teamRows"][number];

type ConfirmationKind = "platform" | "security" | null;
type DataSurfaceMeta = BackendDataSurfaceMeta<string>;

const primaryButtonClass = uxActionClassForPriority("primary");
const secondaryButtonClass = uxActionClassForPriority("secondary");
const staticButtonClass = uxActionClassForPriority("blocked", { unavailable: true });
const tenantCsvExportDisabledReason = "Tenant CSV export requires an approved audit export request and selected tenant scope.";
const defaultPageSize = 10;

function dataSurfaceParams(input: {
  filters?: Record<string, string>;
  page?: number;
  pageSize?: number;
  q?: string;
  sortDirection?: DataSurfaceSortDirection;
  sortKey?: string;
  surface: "tenants" | "users";
}) {
  const params = new URLSearchParams({
    page: String(input.page ?? 1),
    pageSize: String(input.pageSize ?? defaultPageSize),
    sortDirection: input.sortDirection ?? "asc",
    sortKey: input.sortKey ?? "name",
    surface: input.surface,
  });

  if (input.q?.trim()) {
    params.set("q", input.q.trim());
  }

  for (const [key, value] of Object.entries(input.filters ?? {})) {
    if (value && value !== "all") {
      params.set(key, value);
    }
  }

  return params;
}

const adminTenantWorksurfaceMeta: Record<AdminTenantSetupPageId, { safetyNote: string; status: string; tone?: BadgeTone; worksurfaceId: string }> = {
  "007": {
    safetyNote: "Platform settings are configuration only. Changes cannot release advice, mark evidence sufficient or expose client data.",
    status: "Guarded configuration",
    tone: "gold",
    worksurfaceId: "platform-settings",
  },
  "008": {
    safetyNote: "Advice boundary policy defines handling rules only. Client-visible advice still requires review and compliance release.",
    status: "Policy controlled",
    tone: "red",
    worksurfaceId: "platform-advice-boundary",
  },
  "009": {
    safetyNote: "Role configuration shapes access requests only. Admin role edits do not bypass release, evidence, audit or export controls.",
    status: "Non-bypass",
    tone: "red",
    worksurfaceId: "platform-role-templates",
  },
  "010": {
    safetyNote: "Security settings are sensitive configuration. Changes remain blocked unless exact confirmation and backend authority are present.",
    status: "Typed confirmation",
    tone: "gold",
    worksurfaceId: "platform-security",
  },
  "011": {
    safetyNote: "Evidence templates define requirements only. Upload or template presence is never treated as evidence sufficiency.",
    status: "Template only",
    tone: "blue",
    worksurfaceId: "platform-evidence-templates",
  },
  "012": {
    safetyNote: "Export templates define packaging and redaction defaults only. Export approval and download remain separate governed steps.",
    status: "Redaction controlled",
    tone: "blue",
    worksurfaceId: "platform-export-templates",
  },
  "013": {
    safetyNote: "Tenant list visibility does not grant cross-tenant data access or downstream action authority.",
    status: "Tenant inventory",
    tone: "blue",
    worksurfaceId: "tenant-list",
  },
  "014": {
    safetyNote: "Tenant creation starts onboarding only. It does not activate users, approve policies or expose client data.",
    status: "Onboarding draft",
    tone: "gold",
    worksurfaceId: "tenant-create",
  },
  "015": {
    safetyNote: "Tenant setup tracks readiness only. Remaining tasks must complete before production-like access can be assumed.",
    status: "Setup controlled",
    tone: "gold",
    worksurfaceId: "tenant-setup-dashboard",
  },
  "016": {
    safetyNote: "Team assignment sets responsibility boundaries only. It does not grant approval authority outside role and tenant access.",
    status: "Assignment limited",
    tone: "blue",
    worksurfaceId: "tenant-team-assignment",
  },
  "017": {
    safetyNote: "Tenant policies remain permitted to the selected tenant. Policy changes cannot bypass compliance release or audit.",
    status: "Policy limited",
    tone: "red",
    worksurfaceId: "tenant-policies",
  },
  "018": {
    safetyNote: "User invitations create pending access only. Sensitive roles and actions remain subject to permission and audit checks.",
    status: "Invitation controlled",
    tone: "gold",
    worksurfaceId: "tenant-users",
  },
};

function statusTone(status: string): BadgeTone {
  const normalized = status.toLowerCase();

  if (normalized.includes("active") || normalized.includes("completed") || normalized.includes("good")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("revoked") || normalized.includes("missing")) {
    return "red";
  }

  if (normalized.includes("draft") || normalized.includes("pending") || normalized.includes("progress") || normalized.includes("review")) {
    return "gold";
  }

  if (normalized.includes("invited")) {
    return "blue";
  }

  return "muted";
}

function StatusBadge({ status }: { status: string }) {
  return <Badge ariaLabel={`Status: ${status}`} tone={statusTone(status)}>{status}</Badge>;
}

function permissionMatrixColumnLabel(column: string) {
  if (column === "Client release") return "Release";
  return column;
}

function PolicyPill({ children, tone }: { children: React.ReactNode; tone: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 min-w-24 items-center justify-center rounded-full border px-3 text-xs font-semibold",
        tone === "green" && "border-alphavest-green/40 bg-alphavest-green/10 text-alphavest-green",
        tone === "red" && "border-alphavest-red/40 bg-alphavest-red/10 text-alphavest-red",
        tone === "gold" && "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
        tone === "blue" && "border-alphavest-blue/45 bg-alphavest-blue/10 text-alphavest-blue",
        tone === "muted" && "border-alphavest-border bg-alphavest-panel/50 text-alphavest-muted",
      )}
    >
      {children}
    </span>
  );
}

function useRouteTenantSlug() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments[0] === "tenants" && segments[1] && segments[1] !== "new"
    ? decodeURIComponent(segments[1])
    : undefined;
}

function useAdminTenantSnapshot(tenantSlug?: ActorTenantSlug) {
  const [snapshot, setSnapshot] = useState<AdminTenantSnapshot | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = new URLSearchParams();
        if (tenantSlug) {
          params.set("tenantSlug", tenantSlug);
        }
        const response = await fetch(`/api/admin-tenants${params.size ? `?${params.toString()}` : ""}`, { cache: "no-store" });
        const body = (await response.json()) as { snapshot?: AdminTenantSnapshot | null };

        if (!response.ok) {
          throw new Error("Admin tenant snapshot failed.");
        }

        if (!cancelled) {
          setSnapshot(body.snapshot ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setSnapshot(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  return { loadState, snapshot };
}

function useAdminTenantRows(queryState: {
  jurisdiction: string;
  page: number;
  q: string;
  serviceType: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  status: string;
}) {
  const [rows, setRows] = useState<AdminTenantSnapshot["tenantRows"]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = dataSurfaceParams({
          filters: {
            jurisdiction: queryState.jurisdiction,
            serviceType: queryState.serviceType,
            status: queryState.status,
          },
          page: queryState.page,
          q: queryState.q,
          sortDirection: queryState.sortDirection,
          sortKey: queryState.sortKey,
          surface: "tenants",
        });
        const response = await fetch(`/api/admin-tenants?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { meta?: DataSurfaceMeta; tenantRows?: AdminTenantSnapshot["tenantRows"] };

        if (!response.ok) {
          throw new Error("Admin tenant rows failed.");
        }

        if (!cancelled) {
          setRows(body.tenantRows ?? []);
          setMeta(body.meta ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setMeta(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryState.jurisdiction, queryState.page, queryState.q, queryState.serviceType, queryState.sortDirection, queryState.sortKey, queryState.status]);

  return { loadState, meta, rows };
}

function useAdminTenantUserRows(queryState: {
  page: number;
  pageSize?: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  status: string;
  tenantSlug?: string;
  refreshKey?: number;
}) {
  const [rows, setRows] = useState<AdminTenantSnapshot["userRows"]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = dataSurfaceParams({
          filters: { status: queryState.status },
          page: queryState.page,
          pageSize: queryState.pageSize,
          q: queryState.q,
          sortDirection: queryState.sortDirection,
          sortKey: queryState.sortKey,
          surface: "users",
        });
        if (queryState.tenantSlug) {
          params.set("tenantSlug", queryState.tenantSlug);
        }
        const response = await fetch(`/api/admin-tenants?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { meta?: DataSurfaceMeta; userRows?: AdminTenantSnapshot["userRows"] };

        if (!response.ok) {
          throw new Error("Admin tenant user rows failed.");
        }

        if (!cancelled) {
          setRows(body.userRows ?? []);
          setMeta(body.meta ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setMeta(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryState.page, queryState.pageSize, queryState.q, queryState.refreshKey, queryState.sortDirection, queryState.sortKey, queryState.status, queryState.tenantSlug]);

  return { loadState, meta, rows };
}

function ActionBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center justify-end gap-3", className)}>{children}</div>;
}

function SearchShell({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-[var(--field-height)] min-w-0 items-center gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-4 text-sm text-alphavest-muted">
      <Search aria-hidden="true" className="size-4 shrink-0 text-alphavest-gold-soft" />
      <span className="truncate">{placeholder}</span>
    </div>
  );
}

function SettingRow({ detail, enabled, label }: { detail: string; enabled?: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-alphavest-border/45 py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-alphavest-ivory">{label}</p>
        <p className="mt-1 text-sm text-alphavest-muted">{detail}</p>
      </div>
      {typeof enabled === "boolean" ? (
        <span
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full border",
            enabled ? "border-alphavest-gold/70 bg-alphavest-gold/35" : "border-alphavest-border bg-alphavest-charcoal"
          )}
        >
          <span
            className={cn(
              "absolute top-1 size-4 rounded-full bg-alphavest-muted transition",
              enabled ? "left-6 bg-alphavest-gold" : "left-1"
            )}
          />
        </span>
      ) : null}
    </div>
  );
}

function FieldGrid({ compact = false, fields }: { compact?: boolean; fields: Array<{ label: string; value: string }> }) {
  return (
    <dl className={cn("grid md:grid-cols-2", compact ? "gap-2" : "gap-3")}>
      {fields.map((field) => (
        <div className={cn("rounded-md border border-alphavest-border/70 bg-alphavest-navy/35", compact ? "p-2.5" : "p-4")} key={field.label}>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{field.label}</dt>
          <dd className={cn("text-sm font-semibold text-alphavest-ivory", compact ? "mt-1" : "mt-2")}>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AuditBanner({ action, children }: { action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-alphavest-gold/45 bg-alphavest-gold/10 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-alphavest-gold-soft" />
        <div className="text-sm leading-6 text-alphavest-gold-soft">{children}</div>
      </div>
      {action}
    </div>
  );
}

function PlatformSettingsPage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="space-y-2">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Global platform defaults used across client tenants.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGrid fields={platformSettings.fields} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Other settings</CardTitle>
            <CardDescription>Critical toggles stay guarded by typed confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            {platformSettings.security.map((setting) => (
              <SettingRow detail={setting.detail} enabled={setting.enabled} key={setting.label} label={setting.label} />
            ))}
          </CardContent>
        </Card>
      </section>
      <aside className="space-y-4">
        <StatePanel
          detail={`${platformSettings.auditBanner}. Changes require approval and are logged for compliance.`}
          state="restricted"
          title="Change control"
        />
        <ActionBar className="flex-col items-stretch">
          <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Typed confirmation is required before these settings can be saved." data-ux-interactive="false">Confirmation required</span>
        <button
          className={primaryButtonClass}
          data-testid="j10-save-platform"
          onClick={() => {
            onConfirm();
          }}
          type="button"
        >
          <LockKeyhole aria-hidden="true" className="size-4" />
          Save changes
        </button>
        </ActionBar>
        <StatePanel
          detail="Your current role can prepare this platform setting change, but cannot bypass typed confirmation or audit logging."
          state="restricted"
          title="Permission boundary"
        />
      </aside>
      </div>
    </div>
  );
}

function AdviceBoundaryPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Advice Boundary Matrix</CardTitle>
              <CardDescription>Defines what can reach a client and which outputs require review.</CardDescription>
            </div>
            <PolicyPill tone="gold">Draft</PolicyPill>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-alphavest-border/70">
              <table className="w-full min-w-full table-fixed border-collapse text-left text-sm md:min-w-[40rem]">
                <thead className="bg-alphavest-panel/75 text-xs uppercase tracking-[0.12em] text-alphavest-subtle">
                  <tr>
                    {["Content type", "Classification", "Handling", "Approval", "Client reachable"].map((header) => (
                      <th className="break-words border-b border-alphavest-border/70 px-3 py-2" key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adviceMatrix.map((row) => (
                    <tr className="border-b border-alphavest-border/55 last:border-0" key={row.contentType}>
                      <td className="break-words px-3 py-2 font-semibold text-alphavest-ivory">{row.contentType}</td>
                      <td className="break-words px-3 py-2"><PolicyPill tone={row.tone}>{row.classification}</PolicyPill></td>
                      <td className="break-words px-3 py-2 text-alphavest-muted">{row.handling}</td>
                      <td className="break-words px-3 py-2 text-alphavest-muted">{row.requiresApproval}</td>
                      <td className="break-words px-3 py-2 text-alphavest-muted">{row.clientReachable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
            <CardDescription>Owner, review date and version lineage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldGrid
              fields={[
                { label: "Policy owner", value: "Chief Compliance Officer" },
                { label: "Policy ID", value: "POL-ADV-008" },
                { label: "Next review", value: "15 Aug 2024" },
                { label: "Applies to", value: "All users, all entities" }
              ]}
            />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-subtle">Versions</p>
            {policyVersions.slice(0, 2).map((version) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={version.version}>
                <div>
                  <p className="font-semibold text-alphavest-ivory">{version.version}</p>
                  <p className="mt-1 text-xs text-alphavest-muted">{version.date} by {version.owner}</p>
                </div>
                <PolicyPill tone={statusTone(version.status)}>{version.status}</PolicyPill>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

function RolesPage({ onPermissionModal }: { onPermissionModal: () => void }) {
  const { loadState, snapshot } = useAdminTenantSnapshot();
  const roleRows = snapshot?.roleRows ?? [];
  const permissionColumns = snapshot?.permissionMatrixColumns ?? [];
  const totalPermissions = roleRows.reduce((sum, role) => sum + role.permissionCount, 0);
  const guardedPermissions = roleRows.reduce((sum, role) => sum + role.secondConfirmationCount, 0);
  const auditPermissions = roleRows.reduce((sum, role) => sum + role.auditPermissionCount, 0);

  return (
    <div className="space-y-5">
      <ActionBar>
        <SearchShell placeholder="Search roles, permissions..." />
        <button aria-disabled="true" className={staticButtonClass} disabled title="Role template creation requires governed lifecycle wiring." type="button">
          <Plus aria-hidden="true" className="size-4" />
          New role
        </button>
      </ActionBar>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          { detail: "DB-backed role definitions", label: "Roles", tone: loadState === "error" ? "red" as const : "blue" as const, value: String(roleRows.length) },
          { detail: "Granted role permissions", label: "Permissions", tone: "green" as const, value: String(totalPermissions) },
          { detail: "Require audit history", label: "Audited", tone: "gold" as const, value: String(auditPermissions) },
          { detail: "Require confirmation", label: "Guarded", tone: "red" as const, value: String(guardedPermissions) },
        ].map((metric) => (
          <div className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-3" key={metric.label}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-alphavest-muted">{metric.label}</p>
              <PolicyPill tone={metric.tone}>{metric.value}</PolicyPill>
            </div>
            <p className="mt-2 text-2xl font-semibold text-alphavest-ivory">{metric.value}</p>
            <p className="mt-1 text-xs leading-5 text-alphavest-muted">{metric.detail}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <Card data-testid="admin-role-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
          <CardHeader>
            <CardTitle>Role Catalogue</CardTitle>
            <CardDescription>Current platform and tenant roles from the access model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadState === "error" ? (
              <StatePanel detail="Role rows could not be loaded right now." state="error" title="Roles unavailable" />
            ) : roleRows.length === 0 ? (
              <StatePanel detail="No roles are available for this workspace." state="empty" title="No roles" />
            ) : (
              <div className="grid gap-2">
                {roleRows.map((role) => (
                  <article className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3" key={role.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-alphavest-ivory">{role.name}</p>
                        <p className="mt-1 text-sm leading-5 text-alphavest-muted">{role.description}</p>
                      </div>
                      <PolicyPill tone={statusTone(role.status)}>{role.status}</PolicyPill>
                    </div>
                    <dl className="mt-3 grid gap-2 text-xs text-alphavest-muted sm:grid-cols-3">
                      <div>
                        <dt className="font-semibold uppercase tracking-[0.1em] text-alphavest-subtle">Reach</dt>
                        <dd className="mt-1 text-alphavest-ivory">{role.scope}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold uppercase tracking-[0.1em] text-alphavest-subtle">Users</dt>
                        <dd className="mt-1 text-alphavest-ivory">{role.assignedUsers}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold uppercase tracking-[0.1em] text-alphavest-subtle">Permissions</dt>
                        <dd className="mt-1 text-alphavest-ivory">{role.permissionCount}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Full, limited and blocked access by current role.</CardDescription>
            </div>
            <button
              className={secondaryButtonClass}
              data-testid="j10-review-permission"
              onClick={() => {
                void runPlatformAdminCommand("j10.reviewPermission", "/admin/security");
                onPermissionModal();
              }}
              type="button"
            >
              <ShieldAlert aria-hidden="true" className="size-4" />
              Review permission changes
            </button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-alphavest-border/70">
              <table className="w-full table-fixed border-collapse text-center text-sm">
                <colgroup>
                  <col className="w-[24%]" />
                  {permissionColumns.map((column) => <col className="w-[9.5%]" key={column} />)}
                </colgroup>
                <thead className="bg-alphavest-panel/75 text-xs uppercase tracking-[0.12em] text-alphavest-subtle">
                  <tr>
                    <th className="border-b border-alphavest-border/70 px-3 py-2 text-left">Role</th>
                    {permissionColumns.map((column) => (
                      <th className="border-b border-alphavest-border/70 px-1.5 py-2 text-[0.66rem] leading-4 tracking-[0.06em]" key={column}>
                        {permissionMatrixColumnLabel(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roleRows.map((row) => (
                    <tr className="border-b border-alphavest-border/55 last:border-0" key={row.id}>
                      <td className="break-words px-3 py-2 text-left font-semibold text-alphavest-ivory">{row.name}</td>
                      {row.matrix.map((access, index) => (
                        <td className="px-2 py-2" key={`${row.id}-${permissionColumns[index]}`}>
                          {access === "full" ? <CheckCircle2 aria-hidden="true" className="mx-auto size-4 text-alphavest-green" /> : access === "limited" ? <AlertTriangle aria-hidden="true" className="mx-auto size-4 text-alphavest-gold" /> : <LockKeyhole aria-hidden="true" className="mx-auto size-4 text-alphavest-subtle" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadState === "error" ? (
                <div className="border-t border-alphavest-border/70 p-3 text-sm text-alphavest-red">Permission matrix could not be loaded.</div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function SecurityPage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="space-y-3">
      <ActionBar>
        <StatusChip label="Security controls guarded" status="PENDING" />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Security audit history opens from the audit workspace." data-ux-interactive="false">Audit history</span>
        <button
          className={primaryButtonClass}
          data-testid="j10-save-security"
          onClick={() => {
            onConfirm();
          }}
          type="button"
        >
          Save changes
        </button>
      </ActionBar>
      <section className="grid gap-4 xl:grid-cols-2">
        {["Authentication", "Device"].map((group) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{group === "Authentication" ? "Authentication and access" : "Device and session controls"}</CardTitle>
              <CardDescription>{group === "Authentication" ? "MFA, password and session policy." : "Trusted device and session restrictions."}</CardDescription>
            </CardHeader>
            <CardContent>
              {securityControls.filter((control) => control.group === group).map((control) => (
                <SettingRow detail={control.detail} enabled={control.enabled} key={control.label} label={control.label} />
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: "user", header: "User", render: (row: (typeof activeSessions)[number]) => <span className="text-alphavest-ivory">{row.user}</span> },
              { key: "device", header: "Device", render: (row) => row.device },
              { key: "location", header: "Location", render: (row) => row.location },
              { key: "lastActive", header: "Last active", render: (row) => row.lastActive }
            ]}
            getRowId={(row) => `${row.user}-${row.device}`}
            rows={activeSessions.slice(0, 2)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function EvidenceTemplatesPage() {
  const { loadState, snapshot } = useAdminTenantSnapshot();
  const rows = snapshot?.evidenceTemplateRows ?? [];
  const selectedTemplate = rows.find((row) => row.status === "Draft") ?? rows[0];
  type EvidenceTemplate = (typeof rows)[number];
  const columns: Array<DataTableColumn<EvidenceTemplate>> = [
    {
      key: "name",
      header: "Template",
      priority: "identity",
      className: "min-w-64",
      render: (row) => (
        <span>
          <span className="block font-semibold text-alphavest-ivory">{row.name}</span>
          <span className="mt-1 block text-xs font-semibold text-alphavest-blue">{row.category}</span>
        </span>
      ),
      sortable: true
    },
    { key: "type", header: "Evidence type", priority: "evidence_gate", className: "min-w-48", render: (row) => row.type, sortable: true },
    { key: "status", header: "Status", priority: "primary_status", className: "min-w-32", render: (row) => <PolicyPill tone={statusTone(row.status)}>{row.status}</PolicyPill>, sortable: true }
  ];

  return (
    <div className="space-y-3">
      <ActionBar className="gap-2">
        <SearchShell placeholder="Search templates, categories, tags..." />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Template import requires policy version review." data-ux-interactive="false"><Upload aria-hidden="true" className="size-4" />Import held</span>
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Template creation requires a policy version command." data-ux-interactive="false"><Plus aria-hidden="true" className="size-4" />Template held</span>
      </ActionBar>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card data-testid="admin-evidence-template-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
          <CardHeader><CardTitle>All Templates</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              compact
              density="compact"
              emptyMessage={loadState === "error" ? "Evidence templates could not be loaded right now." : "No evidence templates are configured for this workspace."}
              family="table"
              getRowId={(row) => row.id}
              mobileCardTitle={(row) => row.name}
              responsiveMode="table"
              rows={rows}
              stickyHeader
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl">{selectedTemplate?.name ?? "Evidence template"}</CardTitle>
              <PolicyPill tone={statusTone(selectedTemplate?.status ?? "Missing")}>{selectedTemplate?.status ?? "Missing"}</PolicyPill>
            </div>
            <CardDescription>Template summary and required evidence items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGrid
              fields={[
                { label: "Category", value: selectedTemplate?.category ?? "Unassigned" },
                { label: "Review cycle", value: selectedTemplate?.cycle ?? "Unassigned" },
                { label: "Version", value: selectedTemplate?.version ?? "Unassigned" },
                { label: "Required items", value: selectedTemplate?.required ?? "0" }
              ]}
            />
            {[
              `${selectedTemplate?.type ?? "Evidence"} record`,
              "Client ownership link",
              "Reviewer decision and audit trail",
            ].map((item) => (
              <div className="flex items-center justify-between border-b border-alphavest-border/45 pb-3 text-sm last:border-0" key={item}>
                <span className="text-alphavest-muted">{item}</span>
                <span className="shrink-0 whitespace-nowrap text-alphavest-ivory">Required</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ExportTemplatesPage() {
  const { loadState, snapshot } = useAdminTenantSnapshot();
  const rows = snapshot?.exportTemplateRows ?? [];
  const redactionRows = snapshot?.redactionProfileRows ?? [];
  type ExportTemplate = (typeof rows)[number];
  const columns: Array<DataTableColumn<ExportTemplate>> = [
    {
      key: "name",
      header: "Template",
      render: (row) => (
        <span>
          <span className="block font-semibold text-alphavest-ivory">{row.name}</span>
          <span className="mt-1 block text-xs font-semibold text-alphavest-blue">{row.category}</span>
        </span>
      )
    },
    { key: "profile", header: "Redaction profile", render: (row) => row.profile },
    { key: "status", header: "Status", render: (row) => <PolicyPill tone={statusTone(row.status)}>{row.status}</PolicyPill> },
  ];

  return (
    <div className="space-y-4">
      <ActionBar>
        <SearchShell placeholder="Search templates, profiles, fields..." />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Export template creation requires redaction and policy review." data-ux-interactive="false">Template held</span>
      </ActionBar>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card data-testid="admin-export-template-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
          <CardHeader><CardTitle>Export Templates</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              compact
              density="compact"
              emptyMessage={loadState === "error" ? "Export templates could not be loaded right now." : "No export templates are configured for this workspace."}
              getRowId={(row) => row.id}
              rows={rows}
            />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Redaction Profiles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {redactionRows.map((profile) => (
                <div className="flex items-center justify-between gap-3 text-sm" key={profile.id}>
                  <span className="font-semibold text-alphavest-ivory">{profile.name}</span>
                  <PolicyPill tone={statusTone(profile.status)}>{profile.status}</PolicyPill>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Compliance and Audit</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                "Watermark defaults",
                `${rows.filter((row) => row.redactionRequired).length} templates require redaction`,
                "Export activity record",
              ].map((item) => (
                <div className="flex items-center gap-2 text-sm text-alphavest-gold-soft" key={item}>
                  <Check aria-hidden="true" className="size-4" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [sortKey, setSortKey] = useState<keyof AdminTenantSnapshot["tenantRows"][number]>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const { loadState, meta, rows } = useAdminTenantRows({
    jurisdiction: jurisdictionFilter,
    page,
    q: searchTerm,
    serviceType: serviceTypeFilter,
    sortDirection,
    sortKey: String(sortKey),
    status: statusFilter,
  });
  const statusOptions = Array.from(new Set(rows.map((row) => row.status))).sort();
  const jurisdictionOptions = Array.from(new Set(rows.map((row) => row.jurisdiction))).sort();
  const serviceTypeOptions = Array.from(new Set(rows.map((row) => row.tier))).sort();
  type TenantRow = (typeof rows)[number];
  const columns: Array<DataTableColumn<TenantRow>> = [
    {
      key: "name",
      header: "Tenant",
      className: "min-w-48",
      render: (row) => (
        <span className="grid gap-1">
          <span className="font-semibold text-alphavest-ivory">{row.name}</span>
          <span className="text-xs text-alphavest-muted">Owner: {row.owner}</span>
        </span>
      ),
      sortable: true,
    },
    { key: "jurisdiction", header: "Jurisdiction", className: "min-w-28", render: (row) => row.jurisdiction, sortable: true },
    { key: "tier", header: "Tier", className: "min-w-28", render: (row) => <PolicyPill tone="gold">{row.tier}</PolicyPill>, sortable: true },
    { key: "onboarding", header: "Onboarding", className: "min-w-32", render: (row) => <PolicyPill tone={statusTone(row.onboarding)}>{row.onboarding}</PolicyPill>, sortable: true },
    { key: "status", header: "Status", className: "min-w-28", render: (row) => <PolicyPill tone={statusTone(row.status)}>{row.status}</PolicyPill>, sortable: true }
  ];

  function toggleSort(key: string) {
    const nextKey = key as keyof TenantRow;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      setPage(1);
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <ActionBar>
        <PolicyPill tone={loadState === "error" ? "red" : "green"}>{loadState === "error" ? "Directory unavailable" : "Current tenants"}</PolicyPill>
        <span className="inline-flex min-h-10 items-center rounded-md border border-alphavest-border bg-alphavest-panel/50 px-3 text-sm font-semibold text-alphavest-muted">
          Tenant isolation enforced
        </span>
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason={tenantCsvExportDisabledReason} data-ux-interactive="false"><Download aria-hidden="true" className="size-4" />CSV export unavailable</span>
        <Link className={primaryButtonClass} data-testid="j06-new-tenant" href="/tenants/new"><Plus aria-hidden="true" className="size-4" />Add Tenant</Link>
      </ActionBar>
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_0.75fr_auto]">
          <label className="block">
            <span className="sr-only">Search tenants</span>
	            <input
	              className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
	              onChange={(event) => {
	                setSearchTerm(event.target.value);
	                setPage(1);
	              }}
	              placeholder="Search tenants..."
              type="search"
              value={searchTerm}
            />
          </label>
          <select
	            className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
	            onChange={(event) => {
	              setStatusFilter(event.target.value);
	              setPage(1);
	            }}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            aria-expanded={advancedFiltersOpen}
            aria-label="Open advanced tenant filters"
            className={secondaryButtonClass}
            onClick={() => setAdvancedFiltersOpen((current) => !current)}
            type="button"
          >
            <Filter aria-hidden="true" className="size-4" />
            Filters
          </button>
        </CardContent>
        {advancedFiltersOpen ? (
          <CardContent className="grid gap-3 border-t border-alphavest-border/70 pt-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Jurisdiction</span>
              <select
                className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                onChange={(event) => {
                  setJurisdictionFilter(event.target.value);
                  setPage(1);
                }}
                value={jurisdictionFilter}
              >
                <option value="all">All jurisdictions</option>
                {jurisdictionFilter !== "all" && !jurisdictionOptions.includes(jurisdictionFilter) ? <option value={jurisdictionFilter}>{jurisdictionFilter}</option> : null}
                {jurisdictionOptions.map((jurisdiction) => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Service Type</span>
              <select
                className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                onChange={(event) => {
                  setServiceTypeFilter(event.target.value);
                  setPage(1);
                }}
                value={serviceTypeFilter}
              >
                <option value="all">All service types</option>
                {serviceTypeFilter !== "all" && !serviceTypeOptions.includes(serviceTypeFilter) ? <option value={serviceTypeFilter}>{serviceTypeFilter}</option> : null}
                {serviceTypeOptions.map((serviceType) => (
                  <option key={serviceType} value={serviceType}>{serviceType}</option>
                ))}
              </select>
            </label>
          </CardContent>
        ) : null}
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Tenant Directory</CardTitle>
          <CardDescription>Tenant data is isolated and inaccessible across tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
	            columns={columns}
	            emptyMessage={loadState === "error" ? "Tenant rows could not be loaded right now." : "No tenants match this filter."}
		            getRowId={(row) => row.id}
              onRowAction={(row) => {
                window.location.assign(`/tenants/${row.slug}/setup`);
              }}
	            onSortChange={toggleSort}
	            pagination={meta ? { ...meta, onPageChange: setPage } : null}
              rowActionLabel={(row) => `Open setup for ${row.name}`}
	            rows={rows}
	            serverSort
	            sortDirection={sortDirection}
	            sortKey={String(sortKey)}
	          />
        </CardContent>
      </Card>
    </div>
  );
}

function CreateTenantPage() {
  const { snapshot } = useAdminTenantSnapshot();
  const selectedTenant = snapshot?.tenantRows[0];
  const [tenantName, setTenantName] = useState(`Operational Family Office ${new Date().getFullYear()}`);
  const [jurisdiction, setJurisdiction] = useState("South Africa");
  const [relationshipTier, setRelationshipTier] = useState("Signature");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Tenant creation starts a draft setup record only. It does not activate users or release payloads.");
  const [createdTenantSlug, setCreatedTenantSlug] = useState<ActorTenantSlug | null>(null);
  const canSubmit = status !== "submitting" && tenantName.trim().length >= 3 && jurisdiction.trim().length >= 2;

  async function createTenant() {
    if (!canSubmit) {
      setStatus("error");
      setMessage("Enter a family office name and jurisdiction before a tenant draft can be created.");
      return;
    }

    setStatus("submitting");
    setMessage("Creating tenant draft...");

    const response = await fetch("/api/admin-tenants", {
      body: JSON.stringify({
        action: "create_tenant",
        displayName: tenantName,
        jurisdiction,
        relationshipTier,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const body = (await response.json()) as {
      error?: string;
      ok: boolean;
      result?: {
        actorSessionTenant?: { slug?: string };
        setupState?: string;
        tenant?: { displayName: string; slug?: string; status: string };
      };
    };

    if (!response.ok || !body.ok || !body.result?.tenant) {
      setStatus("error");
      setMessage(body.error ?? "Tenant draft could not be created.");
      return;
    }

    setStatus("success");
    setCreatedTenantSlug(body.result.tenant.slug ?? body.result.actorSessionTenant?.slug ?? null);
    setMessage(`${body.result.tenant.displayName} created as ${body.result.setupState ?? body.result.tenant.status}. Team, policy and invitation gates remain locked.`);
  }

  return (
    <div className="space-y-5">
      <WizardStepper steps={tenantWizardSteps.create.map((step) => ({ ...step }))} />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
            <CardDescription>Define the core details of the family office.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Family office name</span>
                <input
                  className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
                  onChange={(event) => setTenantName(event.target.value)}
                  value={tenantName}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Jurisdiction</span>
                <input
                  className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
                  onChange={(event) => setJurisdiction(event.target.value)}
                  value={jurisdiction}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Operating tier</span>
                <select
                  className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                  onChange={(event) => setRelationshipTier(event.target.value)}
                  value={relationshipTier}
                >
                  <option>Signature</option>
                  <option>Premier</option>
                  <option>Standard</option>
                </select>
              </label>
              <FieldGrid
                fields={[
                  { label: "Primary owner", value: selectedTenant?.owner ?? "Unassigned" },
                  { label: "Entity type", value: "Single Family Office" },
                ]}
              />
            </div>
            <StatePanel detail={message} state={status === "success" ? "success" : status === "error" ? "blocked" : "restricted"} title="Tenant draft command" />
            <ActionBar>
              <button className={secondaryButtonClass} onClick={() => { void createTenant(); }} type="button">{status === "submitting" ? "Saving" : "Save draft"}</button>
              <button
                className={cn(primaryButtonClass, "disabled:cursor-not-allowed disabled:opacity-60")}
                data-testid="j06-continue-tenant"
                disabled={!createdTenantSlug}
                onClick={() => {
                  if (createdTenantSlug) {
                    window.location.assign(`/tenants/${createdTenantSlug}/setup`);
                  }
                }}
                type="button"
              >
                Continue to team setup <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </ActionBar>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Setup Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              `Tenant details: ${selectedTenant?.status ?? "Draft"}`,
              `Team setup: ${selectedTenant?.activeUsers ?? 0} active assignments`,
              `Policy assignment: ${selectedTenant?.activePolicies ?? 0} active policies`,
              `Review and confirm: ${selectedTenant?.readiness ?? 0}% ready`,
            ].map((item) => (
              <div className="flex items-center gap-3 text-sm text-alphavest-muted" key={item}>
                <LockKeyhole aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                {item}
              </div>
            ))}
            <StatePanel detail="Client invitations remain disabled until team and policy setup are complete." state="restricted" title="Invitation locked" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function TenantSetupPage() {
  const routeTenantSlug = useRouteTenantSlug();
  const { loadState, snapshot } = useAdminTenantSnapshot(routeTenantSlug);
  const rows: TenantSetupChecklistRow[] = snapshot?.setupChecklist ?? [];
  const metrics = snapshot?.metrics;
  const selectedTenant = snapshot?.tenantRows[0];
  const activePolicyCount = selectedTenant?.activePolicies ?? 0;
  const activeAssignmentCount = snapshot?.teamRows.filter((row) => row.status === "Active").length ?? 0;
  const readyChecklistCount = rows.filter((row) => row.readiness === "Ready").length;
  const readinessItems = [
    { label: `Required items completed: ${readyChecklistCount} / ${rows.length}`, ok: rows.length > 0 && readyChecklistCount === rows.length },
    { label: `No blocked items: ${metrics?.blocked ?? 0} blocked`, ok: (metrics?.blocked ?? 0) === 0 },
    { label: `Policies configured: ${activePolicyCount}`, ok: activePolicyCount > 0 },
    { label: `Team assignments: ${activeAssignmentCount}`, ok: activeAssignmentCount > 0 },
    { label: "Security enabled", ok: true },
    { label: "Integrations connected", ok: false },
  ];
  const metricItems = [
    { detail: "Current workspace", label: "Total tenants", value: String(metrics?.total ?? 0) },
    { detail: "Completed onboarding", label: "Completed", tone: "green" as const, value: String(metrics?.completed ?? 0) },
    { detail: "Needs attention", label: "In progress", tone: "gold" as const, value: String(metrics?.inProgress ?? 0) },
    { detail: "Readiness below threshold", label: "Blocked", tone: "red" as const, value: String(metrics?.blocked ?? 0) },
    { detail: "Current readiness", label: "Setup complete", tone: "blue" as const, value: `${metrics?.readiness ?? 0}%` },
  ];
  const columns: Array<DataTableColumn<TenantSetupChecklistRow>> = [
    { key: "item", header: "Item", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.item}</span> },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "readiness", header: "Readiness", render: (row) => <StatusBadge status={row.readiness} /> }
  ];

  return (
    <div className="space-y-5">
      <WizardStepper steps={tenantWizardSteps.setup.map((step) => ({ ...step }))} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card data-testid="admin-tenant-setup-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
            <CardDescription>Resolve missing and blocked items before activation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {metricItems.map((metric) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-3" key={metric.label}>
                  <p className="text-xs font-semibold text-alphavest-muted">{metric.label}</p>
                  <p className={cn("mt-2 text-2xl font-semibold", metric.tone === "red" ? "text-alphavest-red" : metric.tone === "gold" ? "text-alphavest-gold-soft" : metric.tone === "blue" ? "text-alphavest-blue" : "text-alphavest-ivory")}>{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-alphavest-muted">{metric.detail}</p>
                </div>
              ))}
            </div>
            <DataTable
              columns={columns}
              emptyMessage={loadState === "error" ? "Setup checklist could not be loaded right now." : "No setup checklist items are active for this workspace."}
              getRowId={(row) => row.item}
              rows={rows}
            />
            <AuditBanner>All required items must be completed and unblocked to activate this tenant.</AuditBanner>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Activation Readiness</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {readinessItems.map((item) => (
                <div className="flex items-center justify-between gap-3 text-sm" key={item.label}>
                  <span className="text-alphavest-muted">{item.label}</span>
                  {item.ok ? <CheckCircle2 className="size-4 text-alphavest-green" /> : <XCircle className="size-4 text-alphavest-red" />}
                </div>
              ))}
              <p className={cn(staticButtonClass, "w-full")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Unavailable until tenant setup is complete." data-ux-interactive="false">Activation unavailable</p>
            </CardContent>
          </Card>
          <StatePanel detail="Policy framework and CRM integration need attention before this tenant can activate." state="blocked" title="Missing and blocked items" />
        </div>
      </section>
    </div>
  );
}

function TenantTeamPage() {
  const routeTenantSlug = useRouteTenantSlug();
  const { loadState, snapshot } = useAdminTenantSnapshot(routeTenantSlug);
  const rows: TenantTeamRow[] = snapshot?.teamRows ?? [];
  const selectedTenantSlug = snapshot?.tenantRows[0]?.slug ?? actorTenants.find((tenant) => tenant.status === "ONBOARDING")?.slug ?? "summit";
  const activeAssignments = rows.filter((row) => row.status === "Active").length;
  const missingComplianceOwner = !rows.some((row) => row.role.toLowerCase().includes("compliance") && row.status === "Active");
  const columns: Array<DataTableColumn<TenantTeamRow>> = [
    { key: "role", header: "Role", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.role}</span> },
    { key: "assignee", header: "Assignee", render: (row) => row.assignee },
    { key: "workload", header: "Load", render: (row) => row.workload },
    { key: "status", header: "Status", render: (row) => <PolicyPill tone={statusTone(row.status)}>{row.status}</PolicyPill> }
  ];

  return (
    <div className="space-y-4">
      <ActionBar>
        <PolicyPill tone="gold">Draft</PolicyPill>
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Assignment preview is not configured for this workspace." data-ux-interactive="false">Assignment preview held</span>
        <button
          className={primaryButtonClass}
          data-testid="j06-assign-team"
          onClick={() => {
            void runTenantGovernanceCommand("j06.assignTeam", {
              nextRoute: `/tenants/${selectedTenantSlug}/policies`,
              tenantSlug: selectedTenantSlug,
            });
          }}
          type="button"
        >
          Save changes
        </button>
      </ActionBar>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card data-testid="admin-tenant-team-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
          <CardHeader>
            <CardTitle>Role Assignments</CardTitle>
            <CardDescription>Required roles must be filled before activating a pilot.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              compact
              density="compact"
              emptyMessage={loadState === "error" ? "Role assignments could not be loaded right now." : "No role assignments are active for the selected workspace."}
              getRowId={(row) => row.id}
              rows={rows}
            />
          </CardContent>
        </Card>
        <div className="space-y-5">
          <StatePanel
            detail={missingComplianceOwner ? "A Compliance Owner must be assigned before a pilot can be activated." : "Required tenant responsibilities are assigned for this workspace."}
            state={missingComplianceOwner ? "blocked" : "success"}
            title={missingComplianceOwner ? "Pilot cannot proceed" : "Team assignment ready"}
          />
          <Card>
            <CardHeader><CardTitle>Team Summary</CardTitle></CardHeader>
            <CardContent><FieldGrid fields={[{ label: "Total team members", value: String(rows.length) }, { label: "Active assignments", value: String(activeAssignments) }, { label: "Unassigned roles", value: String(Math.max(0, 4 - rows.length)) }, { label: "Assignment basis", value: "Current workspace" }]} /></CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function TenantPoliciesPage() {
  const routeTenantSlug = useRouteTenantSlug();
  const { loadState, snapshot } = useAdminTenantSnapshot(routeTenantSlug);
  const policyRows = snapshot?.tenantPolicyRows ?? [];
  const profile = snapshot?.tenantPolicyProfile;

  return (
    <div className="space-y-4">
      <ActionBar>
        <StatusChip label={`${profile?.active ?? 0} Active`} status="ACTIVE" />
        <StatusChip label={`${profile?.draft ?? 0} Draft`} status="DRAFT" />
        <StatusChip label={`${profile?.blocked ?? 0} Blocked`} status="FAILED" />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Policy creation is not configured for this workspace." data-ux-interactive="false">Policy creation held</span>
        <button className={secondaryButtonClass} data-testid="j10-version-policy" onClick={() => { void runPlatformAdminCommand("j10.versionPolicy"); }} type="button">
          Version policy
        </button>
      </ActionBar>
      <Card data-testid="admin-tenant-policy-db-surface" data-ux-data-surface-source-truth={snapshot?.meta.sourceTruth ?? "unavailable"}>
        <CardHeader className="pb-2">
          <CardTitle>Policy Profile</CardTitle>
          <CardDescription>{profile ? `${profile.tenant} uses governed policy versions from the live tenant readmodel.` : "Policy profile is loading from the tenant readmodel."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <FieldGrid compact fields={[{ label: "Profile", value: profile?.profile ?? "Unassigned" }, { label: "Inherited defaults", value: String(profile?.inherited ?? 0) }, { label: "Last updated", value: profile?.lastUpdated ?? "Unassigned" }]} />
          <div className="grid gap-2 lg:grid-cols-3">
            {policyRows.slice(0, 3).map((policy) => (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={policy.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-sm font-semibold text-alphavest-ivory">{policy.name}</p>
                  <PolicyPill tone={statusTone(policy.status)}>{policy.status}</PolicyPill>
                </div>
                <p className="mt-1 text-xs leading-5 text-alphavest-muted">{policy.summary}</p>
              </div>
            ))}
            {policyRows.length === 0 ? (
              <StatePanel
                detail={loadState === "error" ? "Tenant policy rows could not be loaded right now." : "No governed policy versions are assigned to this workspace yet."}
                state={loadState === "error" ? "blocked" : "validation"}
                title={loadState === "error" ? "Policy readmodel unavailable" : "Policy profile pending"}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Policy Version History</CardTitle>
          <CardDescription className="text-xs">Tenant changes stay traceable before a new version becomes active.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="grid gap-2">
              {policyRows.slice(0, 3).map((version) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-1.5" key={version.id}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-alphavest-ivory">{version.name}</p>
                    <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">{version.summary}</p>
                    <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">{version.version} · {version.date} · {version.owner} · {version.scope}</p>
                  </div>
                  <PolicyPill tone={statusTone(version.status)}>{version.status}</PolicyPill>
                </div>
              ))}
              {policyRows.length === 0 ? (
                <StatePanel
                  detail="Policy version history is empty for the selected workspace."
                  state="validation"
                  title="No policy versions"
                />
              ) : null}
            </div>
            <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2.5" data-testid="tenant-policy-version-state">
              <p className="text-sm font-semibold text-alphavest-ivory">Change held for review</p>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted">A tenant policy edit creates a draft version and keeps the active profile unchanged until review is complete.</p>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted">Tenant policies remain permitted to the selected tenant. Policy changes cannot bypass compliance release or audit.</p>
              <span className={staticButtonClass + " mt-2"} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Version activation requires review completion." data-ux-interactive="false">Activate held</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function tenantLabelFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ") || "Selected tenant";
}

function tenantOptionsForSlug(slug: ActorTenantSlug) {
  if (actorTenants.some((tenant) => tenant.slug === slug)) return actorTenants;

  return [
    {
      displayName: tenantLabelFromSlug(slug),
      slug,
    },
    ...actorTenants,
  ];
}

function TenantUsersPage({ onInvite }: { onInvite: (tenantSlug: ActorTenantSlug) => void }) {
  const routeTenantSlug = useRouteTenantSlug();
  const defaultTenantSlug = routeTenantSlug ?? actorTenants.find((tenant) => tenant.status === "ONBOARDING")?.slug ?? actorTenants[0]?.slug ?? "summit";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteValidityDays, setInviteValidityDays] = useState("7");
  const [tenantSlug, setTenantSlug] = useState<ActorTenantSlug>(defaultTenantSlug);
  const [sortKey, setSortKey] = useState<keyof AdminTenantSnapshot["userRows"][number]>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rowActionBusy, setRowActionBusy] = useState<Record<string, string>>({});
  const [pendingRoleByRow, setPendingRoleByRow] = useState<Record<string, ActorRoleKey>>({});
  const [actionMessage, setActionMessage] = useState("No user actions are pending.");
  const [actionError, setActionError] = useState<string | null>(null);
  const { loadState, meta, rows } = useAdminTenantUserRows({
    page,
    pageSize: 1,
    q: searchTerm,
    sortDirection,
    sortKey: String(sortKey),
    status: statusFilter,
    tenantSlug,
    refreshKey,
  });
  type TenantUser = (typeof rows)[number];

  useEffect(() => {
    queueMicrotask(() => {
      setPendingRoleByRow((current) => {
        const next = { ...current };

        rows.forEach((row) => {
          if (!next[row.id] && actorRoles.some((role) => role.key === row.roleKey)) {
            next[row.id] = row.roleKey as ActorRoleKey;
          }
        });

        return next;
      });
    });
  }, [rows]);

  const statusOptions = Array.from(new Set(rows.map((row) => row.status))).sort();
  const selectedTenantName = actorTenants.find((tenant) => tenant.slug === tenantSlug)?.displayName ?? tenantSlug;
  const tenantOptions = tenantOptionsForSlug(tenantSlug);
  const tenantForAction = (row: TenantUser) =>
    actorTenants.some((tenant) => tenant.slug === row.tenantSlug)
      ? (row.tenantSlug as ActorTenantSlug)
      : tenantSlug;

  function clearMessage() {
    setActionError(null);
  }

  function tenantUserActionLabel(action: "set_user_status" | "update_user_assignment" | "refresh_user_invite" | "revoke_user_invite") {
    if (action === "set_user_status") return "updating user status";
    if (action === "update_user_assignment") return "updating access";
    if (action === "refresh_user_invite") return "renewing invitation";
    return "withdrawing invitation";
  }

  async function runTenantUserAction(
    row: TenantUser,
    action: "set_user_status" | "update_user_assignment" | "refresh_user_invite" | "revoke_user_invite",
    payload: Record<string, unknown>,
  ) {
    const targetTenantSlug = tenantForAction(row);

    if (rowActionBusy[row.id]) {
      return;
    }

    setRowActionBusy((current) => ({ ...current, [row.id]: action }));
    setActionError(null);
    setActionMessage(`Now ${tenantUserActionLabel(action)} for ${row.name}.`);

    try {
      const response = await fetch("/api/admin-tenants", {
        body: JSON.stringify({ action, tenantSlug: targetTenantSlug, userId: row.userId, ...payload }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const body = (await response.json()) as { error?: string; issues?: string[]; ok?: boolean };

      if (!response.ok || body.ok === false) {
        throw new Error(body.error ?? body.issues?.join(", ") ?? `Tenant user action ${action} was blocked.`);
      }

      setRefreshKey((value) => value + 1);
      setActionMessage(
        action === "update_user_assignment"
          ? `${row.name} is now assigned as ${
              pendingRoleByRow[row.id] ? actorRoles.find((role) => role.key === pendingRoleByRow[row.id])?.label ?? row.role : row.role
            }.`
          : `Finished ${tenantUserActionLabel(action)} for ${row.name} in ${selectedTenantName}.`,
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : `Tenant user action ${action} was blocked.`);
    } finally {
      setRowActionBusy((current) => {
        const next = { ...current };
        delete next[row.id];
        return next;
      });
    }
  }

  async function setUserStatus(row: TenantUser, targetStatus: "ACTIVE" | "ARCHIVED" | "LOCKED" | "SUSPENDED") {
    await runTenantUserAction(row, "set_user_status", { status: targetStatus });
  }

  async function refreshUserInvite(row: TenantUser) {
    await runTenantUserAction(row, "refresh_user_invite", { validForDays: inviteValidityDays });
  }

  async function revokeUserInvite(row: TenantUser) {
    await runTenantUserAction(row, "revoke_user_invite", {});
  }

  async function updateUserRole(row: TenantUser) {
    const nextRole = pendingRoleByRow[row.id];
    if (!nextRole || nextRole === row.roleKey) {
      setActionError("Choose a different role before saving the assignment.");
      return;
    }

    await runTenantUserAction(row, "update_user_assignment", {
      roleKey: nextRole,
      userRoleId: row.id,
    });
  }

  function isOpenInvitation(row: TenantUser) {
    const inviteState = row.invite.toLowerCase();
    const accountState = row.status.toLowerCase();

    return inviteState.includes("invited") || accountState.includes("invited") || accountState.includes("pending");
  }

  function isRemovedAccess(row: TenantUser) {
    return row.status === "Archived" || row.status === "Revoked";
  }

  function accessDecisionFor(row: TenantUser) {
    if (isOpenInvitation(row)) {
      return {
        detail: "Refresh the invitation if the person should still join, or withdraw it if access is no longer intended.",
        label: "Finish onboarding",
        tone: "blue" as const,
      };
    }

    if (row.status === "Active") {
      return {
        detail: "This person can work now. Change the role only when the responsibility changes; pause or lock access when risk changes.",
        label: "Working access",
        tone: "green" as const,
      };
    }

    if (row.status === "Suspended") {
      return {
        detail: "Paused access is not useful for daily work. Restore it after the reason is resolved or remove it if the person has left.",
        label: "Resolve paused access",
        tone: "gold" as const,
      };
    }

    if (row.status === "Locked") {
      return {
        detail: "Locked access protects the workspace. Restore only after the lock reason is cleared.",
        label: "Resolve locked access",
        tone: "red" as const,
      };
    }

    if (isRemovedAccess(row)) {
      return {
        detail: "This row no longer grants access. Invite the person again only if a new responsibility exists.",
        label: "No workspace access",
        tone: "red" as const,
      };
    }

    return {
      detail: "Review this account state before changing access.",
      label: "Review access",
      tone: "gold" as const,
    };
  }

  const columns: Array<DataTableColumn<TenantUser>> = [
    {
      className: "w-36 whitespace-nowrap",
      key: "name",
      header: "User",
      render: (row) => (
        <div className="grid gap-1">
          <span className="whitespace-nowrap font-semibold text-alphavest-ivory">{row.name}</span>
          <PolicyPill tone={statusTone(row.status)}>{row.status}</PolicyPill>
        </div>
      ),
      sortable: true,
    },
    {
      className: "min-w-56",
      key: "invite",
      header: "Next step",
      render: (row) => {
        const decision = accessDecisionFor(row);

        return (
          <div className="max-w-64">
            <div className="flex flex-wrap items-center gap-2">
              <PolicyPill tone={decision.tone}>{decision.label}</PolicyPill>
              {isOpenInvitation(row) ? <span className="text-xs text-alphavest-muted">{row.invite}</span> : null}
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-alphavest-muted">{decision.detail}</p>
          </div>
        );
      },
      sortable: true,
    },
    {
      className: "min-w-48",
      key: "role",
      header: "Role assignment",
      render: (row) => {
        const isBusy = !!rowActionBusy[row.id];
        const removedAccess = isRemovedAccess(row);
        const nextRole = pendingRoleByRow[row.id] ?? row.roleKey;
        const roleChanged = nextRole !== row.roleKey;

        return (
          <div className="grid gap-2">
            <span className="font-semibold text-alphavest-ivory">{row.role}</span>
            <select
              aria-label={`${row.name} role draft`}
              className="h-9 max-w-48 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-xs text-alphavest-ivory outline-none disabled:cursor-not-allowed disabled:opacity-60"
              disabled={removedAccess}
              onChange={(event) => {
                setPendingRoleByRow((current) => ({ ...current, [row.id]: event.target.value as ActorRoleKey }));
              }}
              value={nextRole}
            >
              {actorRoles.map((role) => (
                <option key={role.key} value={role.key}>{role.label}</option>
              ))}
            </select>
            {removedAccess ? (
              <span className="text-xs leading-5 text-alphavest-muted">Invite again before assigning new access.</span>
            ) : (
              <button
                className={cn(secondaryButtonClass, "h-8 max-w-48 px-2 py-0 disabled:cursor-not-allowed disabled:opacity-60")}
                disabled={isBusy || !roleChanged}
                onClick={() => {
                  clearMessage();
                  void updateUserRole(row);
                }}
                type="button"
              >
                <SquarePen aria-hidden="true" className="size-3" />
                {isOpenInvitation(row) ? "Set starting role" : "Reassign role"}
              </button>
            )}
          </div>
        );
      },
      sortable: false,
    },
    {
      className: "w-[15rem] min-w-[15rem] whitespace-nowrap break-normal",
      key: "actions",
      header: "Actions",
      render: (row) => {
        const isBusy = !!rowActionBusy[row.id];
        const isActive = row.status === "Active";
        const isLocked = row.status === "Locked";
        const isSuspended = row.status === "Suspended";
        const hasOpenInvitation = isOpenInvitation(row);
        const removedAccess = isRemovedAccess(row);
        const canRestore = isLocked || isSuspended || row.status === "Archived";
        const canSuspend = isActive;
        const canLock = isActive || isSuspended;
        const canRemoveAccess = isActive || isSuspended || isLocked;

        return (
          <div className="flex max-w-[15rem] flex-wrap items-start gap-2">
            {hasOpenInvitation ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[7.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void refreshUserInvite(row);
                }}
                type="button"
              >
                <RefreshCcw aria-hidden="true" className="size-3" />Refresh invite
              </button>
            ) : null}
            {hasOpenInvitation ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[7.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void revokeUserInvite(row);
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-3" />Withdraw invite
              </button>
            ) : null}
            {canRestore ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[5.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void setUserStatus(row, "ACTIVE");
                }}
                type="button"
              >
                <Check aria-hidden="true" className="size-3" />Restore
              </button>
            ) : null}
            {canSuspend ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[5.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void setUserStatus(row, "SUSPENDED");
                }}
                type="button"
              >
                <XCircle aria-hidden="true" className="size-3" />Pause
              </button>
            ) : null}
            {canLock ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[5.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void setUserStatus(row, "LOCKED");
                }}
                type="button"
              >
                <LockKeyhole aria-hidden="true" className="size-3" />Lock
              </button>
            ) : null}
            {canRemoveAccess ? (
              <button
                className={cn(secondaryButtonClass, "h-8 min-w-[7.5rem] whitespace-nowrap px-2 py-0")}
                disabled={isBusy}
                onClick={() => {
                  clearMessage();
                  void setUserStatus(row, "ARCHIVED");
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-3" />Remove access
              </button>
            ) : null}
            {removedAccess && !hasOpenInvitation ? <span className="text-xs leading-5 text-alphavest-muted">No active access action</span> : null}
            {isBusy ? <span className="text-xs text-alphavest-gold">Working on this user</span> : null}
          </div>
        );
      },
    },
  ];

  function toggleSort(key: string) {
    const nextKey = key as keyof TenantUser;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      setPage(1);
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
    setPage(1);
  }

  const totalUsers = meta?.totalRows ?? rows.length;
  const activeUsers = rows.filter((row) => row.status === "Active").length;
  const invitedUsers = rows.filter(isOpenInvitation).length;
  const waitingUsers = rows.filter((row) => row.status !== "Active" && !isRemovedAccess(row)).length;
  const removedUsers = rows.filter(isRemovedAccess).length;
  const firstOpenInvite = rows.find(isOpenInvitation);
  const firstAccessRisk = rows.find((row) => row.status === "Suspended" || row.status === "Locked");
  const nextAccessAction = actionMessage
    || (waitingUsers > 0
      ? "Review onboarding and paused access before those users can work in this workspace."
      : invitedUsers > 0
        ? "Follow up on open invitations so the right people can enter the workspace."
        : "Invite the next accountable person or keep the access list unchanged.");
  const accessWorkQueue = [
    {
      action: "Start invitation",
      detail: "Add the next accountable person with a starting role and a time-limited invitation.",
      onClick: () => onInvite(tenantSlug),
      primary: true,
      title: "Bring someone in",
    },
    {
      action: firstOpenInvite ? `Review ${firstOpenInvite.name}` : "No follow-up needed",
      detail: firstOpenInvite
        ? `${firstOpenInvite.name} still needs onboarding. Refresh or withdraw the invitation in the row.`
        : "There is no open invitation in this view.",
      title: "Finish onboarding",
    },
    {
      action: firstAccessRisk ? `Resolve ${firstAccessRisk.name}` : "Risk clear in view",
      detail: firstAccessRisk
        ? `${firstAccessRisk.name} cannot work until paused or locked access is resolved.`
        : "No paused or locked access is visible for this workspace.",
      title: "Reduce access risk",
    },
  ];

  return (
    <div className="space-y-3">
      {actionError ? (
        <StatePanel detail={actionError} state="restricted" title="Access change blocked" />
      ) : (
        <section className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 px-4 py-2">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-alphavest-ivory">Workspace access ready</p>
              <p className="mt-1 text-sm text-alphavest-muted">{nextAccessAction}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { detail: "People in this access view", label: "Known users", value: String(totalUsers) },
                { detail: "Can work in this workspace", label: "Can work now", tone: "green" as const, value: String(activeUsers) },
                { detail: "Invitation sent, onboarding open", label: "Onboarding", tone: "blue" as const, value: String(invitedUsers) },
                { detail: "Needs review before access is useful", label: "Needs decision", tone: "gold" as const, value: String(waitingUsers) },
                { detail: "No longer has workspace access", label: "Removed", tone: "red" as const, value: String(removedUsers) },
              ].map((metric) => (
                <div
                  className="flex min-w-36 items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-panel/70 px-2.5 py-1"
                  data-ux-affordance="static-metric-card"
                  data-ux-interactive="false"
                  key={metric.label}
                >
                  <div>
                    <p className="text-[0.7rem] font-semibold text-alphavest-muted">{metric.label}</p>
                    <p className="sr-only">{metric.detail}</p>
                  </div>
                  {metric.tone ? <PolicyPill tone={metric.tone}>{metric.value}</PolicyPill> : <p className="text-sm font-semibold text-alphavest-ivory">{metric.value}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="grid gap-2 lg:grid-cols-3">
        {accessWorkQueue.map((item) => (
          <div className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-2" key={item.title}>
            <p className="text-sm font-semibold text-alphavest-ivory">{item.title}</p>
            <p className="mt-0.5 text-xs leading-5 text-alphavest-muted">{item.detail}</p>
            {item.primary ? (
              <button
                className={cn(primaryButtonClass, "mt-1.5 h-8 px-3 py-0")}
                onClick={() => {
                  item.onClick?.();
                }}
                type="button"
              >
                <UserPlus aria-hidden="true" className="size-4" />{item.action}
              </button>
            ) : (
              <span className="mt-2 inline-flex text-xs font-semibold text-alphavest-gold">{item.action}</span>
            )}
          </div>
        ))}
      </section>
      <Card>
        <CardHeader className="flex flex-col gap-2 pb-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Workspace access</CardTitle>
              <CardDescription>Manage entry, onboarding and safe access changes for {selectedTenantName}.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PolicyPill tone={loadState === "error" ? "red" : "green"}>{loadState === "error" ? "Access unavailable" : "Access view ready"}</PolicyPill>
              <button
                className={primaryButtonClass}
                data-testid="j06-invite-user"
                data-ux-lifecycle-result="opens-invite-user-drawer"
                data-ux-lifecycle-trigger="invite-user-drawer"
                onClick={() => {
                  onInvite(tenantSlug);
                }}
                type="button"
              >
                <UserPlus aria-hidden="true" className="size-4" />Invite user
              </button>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-[14rem_1fr_10rem_10rem]">
            <label className="block">
              <span className="sr-only">Filter tenant users by tenant</span>
              <select
                className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                onChange={(event) => {
                  setTenantSlug(event.target.value as ActorTenantSlug);
                  setPage(1);
                }}
                value={tenantSlug}
              >
                {tenantOptions.map((tenant) => (
                  <option key={tenant.slug} value={tenant.slug}>{tenant.displayName}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Search tenant users</span>
              <input
                className="h-9 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Search tenant users..."
                type="search"
                value={searchTerm}
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter by user status</span>
              <select
                className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                value={statusFilter}
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Invite validity for renewed invitations</span>
              <select
                className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                onChange={(event) => {
                  setInviteValidityDays(event.target.value);
                }}
                value={inviteValidityDays}
              >
                <option value="1">Invite: 1 day</option>
                <option value="3">Invite: 3 days</option>
                <option value="7">Invite: 7 days</option>
                <option value="14">Invite: 14 days</option>
                <option value="30">Invite: 30 days</option>
              </select>
            </label>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            columns={columns}
            emptyMessage={loadState === "error" ? "Tenant users could not be loaded right now." : "No tenant user assignments found."}
            getRowId={(row) => row.id}
            onSortChange={toggleSort}
            pagination={meta ? { ...meta, onPageChange: setPage } : null}
            rows={rows}
            serverSort
            sortDirection={sortDirection}
            sortKey={String(sortKey)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CriticalChangeModal({ kind, onClose }: { kind: ConfirmationKind; onClose: () => void }) {
  const isSecurity = kind === "security";
  const phrase = isSecurity ? "CONFIRM SECURITY POLICY" : "I understand the impact of this change";
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [submitState, setSubmitState] = useState<"error" | "idle" | "submitting" | "success" | "validation">("idle");
  const phraseMatches = confirmationPhrase === phrase;
  const lifecycleCopy = isSecurity
    ? "Security changes require exact-phrase validation, permitted administrator authority and audit logging before activation."
    : "Platform changes require exact-phrase validation, permitted administrator authority and audit logging before activation.";
  const actionId = isSecurity ? "j10.saveSecurity" : "j10.savePlatform";

  function handleClose() {
    setConfirmationPhrase("");
    setResultMessage("");
    setSubmitState("idle");
    onClose();
  }

  async function handleConfirmAttempt() {
    if (!phraseMatches) {
      setSubmitState("validation");
      setResultMessage("Type the exact phrase before this confirmation can be evaluated.");
      return;
    }

    setSubmitState("submitting");
    setResultMessage(isSecurity ? "Saving security policy..." : "Saving platform setting...");

    try {
      const response = await runPlatformAdminCommand(actionId);
      const targetLabel = response.result?.targetLabel ?? (isSecurity ? "Security configuration" : "Platform setting");

      setSubmitState("success");
      setResultMessage(`${targetLabel} saved. Audit trail updated; client delivery and release state remain unchanged.`);
    } catch (error) {
      setSubmitState("error");
      setResultMessage(error instanceof Error ? error.message : "Admin change failed closed.");
    }
  }
  const lifecycleResult = !phraseMatches
    ? "blocked-validation-required"
    : submitState === "success"
      ? "authorized-command-recorded"
      : submitState === "error"
        ? "blocked-command-failed"
        : "ready-for-authorized-command";

  return (
    <Modal
      className="max-w-[44rem]"
      context={
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-alphavest-ivory">{isSecurity ? "Security configuration" : "Platform setting"} change</p>
          <p className="text-alphavest-muted">{lifecycleCopy}</p>
        </div>
      }
      description={isSecurity ? "This change would apply to all users and reduce account security." : "You are about to update a critical platform setting."}
      footer={
        <>
          <button className={secondaryButtonClass} onClick={handleClose} type="button">Cancel</button>
          <button
            aria-describedby="admin-confirmation-validation"
            className={cn(primaryButtonClass, "disabled:cursor-not-allowed disabled:opacity-60")}
            data-ux-lifecycle-result={lifecycleResult}
            disabled={!phraseMatches || submitState === "submitting"}
            onClick={() => { void handleConfirmAttempt(); }}
            type="button"
          >
            <LockKeyhole aria-hidden="true" className="size-4" />
            {submitState === "submitting" ? "Saving..." : "Confirm change"}
          </button>
        </>
      }
      onClose={handleClose}
      open={kind !== null}
      title={isSecurity ? "Confirm critical security change" : "Confirm critical change"}
    >
      <div
        className="space-y-5 text-center"
        data-testid="uxp3-admin-confirmation-lifecycle"
        data-ux-lifecycle-validation={phraseMatches ? "exact-phrase-matched" : "exact-phrase-required"}
        data-ux-no-overclaim="true"
      >
        <div className="mx-auto grid size-20 place-items-center rounded-full border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
          <AlertTriangle aria-hidden="true" className="size-9" />
        </div>
        <div>
          <p className="font-display text-3xl text-alphavest-ivory">Confirm critical change</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-alphavest-muted">
            This change may impact system behavior, access and audit posture.
          </p>
        </div>
        <StatePanel
          className="text-left"
          detail={lifecycleCopy}
          state="restricted"
          title="Typed confirmation required"
        />
        {resultMessage ? (
          <StatePanel
            className="text-left"
            detail={resultMessage}
            state={submitState === "success" ? "success" : submitState === "error" ? "error" : "blocked"}
            title={submitState === "success" ? "Change recorded" : submitState === "error" ? "Change blocked" : "Validation required"}
          />
        ) : null}
        <div className="mx-auto max-w-lg text-left">
          <label className="block">
            <span className="block text-center text-sm text-alphavest-muted">Type the phrase below to confirm:</span>
            <span className="mt-2 block text-center font-display text-xl text-alphavest-gold-soft">{`"${phrase}"`}</span>
            <input
              aria-describedby="admin-confirmation-validation"
              className="mt-4 h-12 w-full rounded-md border border-alphavest-border bg-alphavest-navy/45 px-4 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
              onChange={(event) => {
                setConfirmationPhrase(event.target.value);
                setResultMessage("");
                setSubmitState("idle");
              }}
              placeholder="Type the exact phrase above"
              value={confirmationPhrase}
            />
          </label>
          <p className="mt-3 text-sm text-alphavest-muted" id="admin-confirmation-validation">
            {phraseMatches
              ? "Exact phrase matched. Confirming records the guarded change and audit trail."
              : "Confirm remains blocked until the exact phrase is entered."}
          </p>
        </div>
      </div>
    </Modal>
  );
}

function PermissionChangeModal({ onClose, open }: { onClose: () => void; open: boolean }) {
  return (
    <Modal
      context={
        <div className="grid gap-2 text-sm">
          <p className="font-semibold text-alphavest-ivory">Compliance officer role template</p>
          <p className="text-alphavest-muted">Permission changes affect separation of duties and remain subject to administrator approval.</p>
        </div>
      }
      description="You are about to update permissions for the Compliance officer role template."
      footer={
        <>
          <button className={secondaryButtonClass} onClick={onClose} type="button">Cancel</button>
          <button className={primaryButtonClass} onClick={onClose} type="button">
            <LockKeyhole aria-hidden="true" className="size-4" />
            Confirm permission change
          </button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Confirm Permission Changes"
    >
      <div className="space-y-4">
        {["Compliance -> Manage policies: No access to full access", "Reports -> Export reports: Limited access to full access", "Users -> Manage users: No access to limited access"].map((change) => (
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-sm text-alphavest-muted" key={change}>
            {change}
          </div>
        ))}
        <StatePanel detail="Permission change applies to this role template only. It cannot release advice, mark evidence review complete, approve export, or skip audit persistence." state="restricted" title="Permission change" />
      </div>
    </Modal>
  );
}

type InviteApiResponse = {
  error?: string;
  ok: boolean;
  reasonCode?: string;
  result?: {
    inviteToken: string;
    user: {
      email: string;
      roleName?: string;
      tenantName?: string;
    };
  };
};

function InviteUserDrawer({ initialTenantSlug, onClose, open }: { initialTenantSlug: ActorTenantSlug; onClose: () => void; open: boolean }) {
  const [email, setEmail] = useState("alex.morgan@claritycapital.com");
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [roleKey, setRoleKey] = useState<ActorRoleKey>("analyst");
  const [tenantSlug, setTenantSlug] = useState<ActorTenantSlug>(initialTenantSlug);
  const [validForDays, setValidForDays] = useState("7");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Create a pending user invitation for the selected organisation and access level.");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const tenantOptions = tenantOptionsForSlug(tenantSlug);
  const emailValid = email.trim().includes("@") && email.trim().includes(".");
  const displayNameValid = displayName.trim().length >= 2;
  const canSubmit = status !== "submitting" && emailValid && displayNameValid;

  function handleClose() {
    if (status === "submitting") {
      return;
    }

    onClose();
  }

  async function sendInvitation() {
    if (!emailValid || !displayNameValid) {
      setStatus("error");
      setInviteToken(null);
      setMessage("Enter a valid email address and display name before an invitation can be created.");
      return;
    }

    setStatus("submitting");
    setInviteToken(null);
    setMessage("Creating invitation...");

    const response = await fetch("/api/admin-tenants", {
      body: JSON.stringify({
        action: "invite_user",
        displayName,
        email,
        roleKey,
        tenantSlug,
        validForDays,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const body = (await response.json()) as InviteApiResponse;

    if (!response.ok || !body.ok || !body.result) {
      setStatus("error");
      setMessage(body.error ?? "Invitation could not be created.");
      return;
    }

    window.localStorage.setItem(
      "alphavest.localAuth.v1",
      JSON.stringify({
        email: body.result.user.email,
        inviteToken: body.result.inviteToken,
        nextStep: "invite_acceptance_required",
      }),
    );
    setInviteToken(body.result.inviteToken);
    setStatus("success");
    setMessage(`${body.result.user.email} is invited for ${body.result.user.roleName ?? roleKey} in ${body.result.user.tenantName ?? tenantSlug}.`);
  }

  return (
    <Drawer
      description="Invite a user and assign their starting access."
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button className={secondaryButtonClass} disabled={status === "submitting"} onClick={handleClose} type="button">Cancel</button>
          <button
            aria-describedby="invite-user-validation"
            className={cn(primaryButtonClass, "disabled:cursor-not-allowed disabled:opacity-60")}
            data-testid="j06-send-invitation"
            data-ux-lifecycle-result={canSubmit ? "submits-db-backed-invitation" : "blocked-validation-required"}
            disabled={!canSubmit}
            onClick={() => {
              void sendInvitation();
            }}
            type="button"
          >
            <Send aria-hidden="true" className="size-4" />{status === "submitting" ? "Sending" : "Send invitation"}
          </button>
        </div>
      }
      onClose={status === "submitting" ? undefined : handleClose}
      open={open}
      title="Invite User"
    >
      <div
        className="space-y-4"
        data-testid="uxp3-invite-user-drawer-lifecycle"
        data-ux-lifecycle-status={status}
        data-ux-lifecycle-validation={canSubmit ? "valid" : "blocked"}
        data-ux-no-overclaim="true"
      >
        <label className="block">
          <span className="text-sm font-semibold text-alphavest-ivory">Email address</span>
          <input
            aria-describedby="invite-user-validation"
            className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            value={email}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-alphavest-ivory">Display name</span>
          <input
            aria-describedby="invite-user-validation"
            className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => {
              setDisplayName(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            value={displayName}
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-alphavest-ivory">Role</span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
              onChange={(event) => setRoleKey(event.target.value as ActorRoleKey)}
              value={roleKey}
            >
              {actorRoles.map((role) => (
                <option key={role.key} value={role.key}>{role.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-alphavest-ivory">Tenant access</span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
              onChange={(event) => setTenantSlug(event.target.value as ActorTenantSlug)}
              value={tenantSlug}
            >
              {tenantOptions.map((tenant) => (
                <option key={tenant.slug} value={tenant.slug}>{tenant.displayName}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-alphavest-ivory">Invite valid for</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => setValidForDays(event.target.value)}
            value={validForDays}
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
        </label>
        <StatePanel detail="Elevated access can be prepared here, but remains inactive until the user completes onboarding." state="restricted" title="Sensitive access" />
        <p className="text-sm text-alphavest-muted" id="invite-user-validation">
          {canSubmit
            ? "Ready to create a pending invitation for this user."
            : "Invitation remains blocked until email and display name are valid, and no request is submitting."}
        </p>
        <StatePanel
          detail={message}
          state={status === "error" ? "blocked" : status === "success" ? "success" : "restricted"}
          title="Invitation state"
        />
        {inviteToken ? (
          <Link className={cn(secondaryButtonClass, "w-full justify-between")} data-testid="local-invite-link" href="/onboarding/invite">
            Continue invite acceptance
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4">
          <p className="text-sm font-semibold text-alphavest-ivory">Message</p>
          <p className="mt-2 text-sm text-alphavest-muted">Add a personal invitation note in the production review flow.</p>
        </div>
      </div>
    </Drawer>
  );
}

function initialConfirmationKind(route: ScreenRoute, visualState?: VisualState): ConfirmationKind {
  if (visualState !== "confirm") {
    return null;
  }

  if (route.pageId === "007") {
    return "platform";
  }

  if (route.pageId === "010") {
    return "security";
  }

  return null;
}

export function AdminTenantSetupScreen({ route, visualState }: AdminTenantSetupScreenProps) {
  const routeTenantSlug = useRouteTenantSlug();
  const [confirmationKind, setConfirmationKind] = useState<ConfirmationKind>(() => initialConfirmationKind(route, visualState));
  const [permissionModalOpen, setPermissionModalOpen] = useState(() => route.pageId === "009" && visualState === "permission");
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState(() => route.pageId === "018" && visualState === "invite");
  const [inviteTenantSlug, setInviteTenantSlug] = useState<ActorTenantSlug>(
    () => routeTenantSlug ?? actorTenants.find((tenant) => tenant.status === "ONBOARDING")?.slug ?? actorTenants[0]?.slug ?? "summit",
  );
  const worksurface = adminTenantWorksurfaceMeta[route.pageId as AdminTenantSetupPageId];

  function openInviteDrawer(tenantSlug: ActorTenantSlug) {
    setInviteTenantSlug(tenantSlug);
    setInviteDrawerOpen(true);
  }

  function renderPage() {
    if (route.pageId === "007") {
      return <PlatformSettingsPage onConfirm={() => setConfirmationKind("platform")} />;
    }
    if (route.pageId === "008") {
      return <AdviceBoundaryPage />;
    }
    if (route.pageId === "009") {
      return <RolesPage onPermissionModal={() => setPermissionModalOpen(true)} />;
    }
    if (route.pageId === "010") {
      return <SecurityPage onConfirm={() => setConfirmationKind("security")} />;
    }
    if (route.pageId === "011") {
      return <EvidenceTemplatesPage />;
    }
    if (route.pageId === "012") {
      return <ExportTemplatesPage />;
    }
    if (route.pageId === "013") {
      return <TenantsPage />;
    }
    if (route.pageId === "014") {
      return <CreateTenantPage />;
    }
    if (route.pageId === "015") {
      return <TenantSetupPage />;
    }
    if (route.pageId === "016") {
      return <TenantTeamPage />;
    }
    if (route.pageId === "017") {
      return <TenantPoliciesPage />;
    }
    return <TenantUsersPage onInvite={openInviteDrawer} />;
  }

  return (
    <AppShell>
      <WorksurfaceShell
        description={route.purpose}
        density="compact"
        eyebrow={route.navigationGroup === "tenant_setup" ? "Tenant setup worksurface" : "Platform setup worksurface"}
        primary={
          <div className="space-y-2">
            <div>
              <h1 className="font-display text-2xl leading-tight text-alphavest-ivory">{route.title}</h1>
              <p className="text-sm text-alphavest-muted">{route.purpose}</p>
            </div>
            {renderPage()}
          </div>
        }
        routeId={route.pageId}
        safetyNote={worksurface.safetyNote}
        statusItems={[
          { label: "Workspace", tone: "blue", value: route.title },
          { label: "Control", tone: worksurface.tone, value: worksurface.status },
        ]}
        title={route.title}
        worksurfaceId={worksurface.worksurfaceId}
      />
      <CriticalChangeModal kind={confirmationKind} onClose={() => setConfirmationKind(null)} />
      <PermissionChangeModal onClose={() => setPermissionModalOpen(false)} open={permissionModalOpen} />
      <InviteUserDrawer key={inviteTenantSlug} initialTenantSlug={inviteTenantSlug} onClose={() => setInviteDrawerOpen(false)} open={inviteDrawerOpen} />
    </AppShell>
  );
}
