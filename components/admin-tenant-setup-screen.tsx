"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Filter,
  LockKeyhole,
  Plus,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserPlus,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useDemoSession } from "@/components/demo-session-provider";
import { ScfP07P09TrustPanel } from "@/components/scf-p07-p09-trust-panel";
import { ScfP10P14ClosurePanel } from "@/components/scf-p10-p14-closure-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxSupportDensityStrip } from "@/components/ux-support-density-strip";
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
  MetricCard,
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
  evidenceTemplates,
  exportTemplates,
  permissionColumns,
  permissionRows,
  platformSettings,
  policyVersions,
  redactionProfiles,
  roleTemplates,
  securityControls,
  teamAssignments,
  tenantPolicyCards,
  tenantRows,
  tenantSetupChecklist,
  tenantUsers,
  tenantWizardSteps,
  type AdminTenantSetupPageId
} from "@/lib/admin-tenant-setup-demo-data";
import { cn } from "@/lib/cn";
import { demoPlatformTenantId, demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { AdminTenantSnapshot } from "@/lib/admin-tenant-readmodel-service";
import { permissionEngine } from "@/lib/permission-engine";
import type { ScreenRoute } from "@/lib/route-registry";
import { runScreencastDemoAction } from "@/lib/screencast-demo-client";
import { buildScopeControlSnapshot, type ScopeControlRow, type StaticWorkspaceControl } from "@/lib/scope-control";
import { runTenantGovernanceCommand } from "@/lib/tenant-governance-command-client";
import type { VisualState } from "@/lib/visual-contract";

type AdminTenantSetupScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type ConfirmationKind = "platform" | "security" | null;

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/60 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

const staticButtonClass =
  "inline-flex h-[var(--button-height)] cursor-not-allowed items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/40 px-4 text-sm font-semibold text-alphavest-subtle opacity-75";

const adminTenantWorksurfaceMeta: Record<AdminTenantSetupPageId, { safetyNote: string; status: string; tone?: BadgeTone; worksurfaceId: string }> = {
  "007": {
    safetyNote: "Platform settings are configuration only. Changes cannot release advice, mark evidence sufficient or expose client payloads.",
    status: "Guarded configuration",
    tone: "gold",
    worksurfaceId: "platform-settings",
  },
  "008": {
    safetyNote: "Advice boundary policy defines handling rules only. Client-visible advice still requires workflow review and compliance release.",
    status: "Policy controlled",
    tone: "red",
    worksurfaceId: "platform-advice-boundary",
  },
  "009": {
    safetyNote: "Role templates shape access requests only. Admin role edits do not bypass release, evidence, audit or export controls.",
    status: "Non-bypass",
    tone: "red",
    worksurfaceId: "platform-role-templates",
  },
  "010": {
    safetyNote: "Security settings are sensitive configuration. Demo changes remain blocked unless exact confirmation and backend authority are present.",
    status: "Second confirmation",
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
    safetyNote: "Tenant list visibility does not grant cross-tenant payload access or downstream action authority.",
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
    safetyNote: "Team assignment sets responsibility boundaries only. It does not grant approval authority outside role and tenant scope.",
    status: "Assignment scoped",
    tone: "blue",
    worksurfaceId: "tenant-team-assignment",
  },
  "017": {
    safetyNote: "Tenant policies remain scoped to the selected tenant. Policy changes cannot bypass compliance release or audit.",
    status: "Policy scoped",
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

function useAdminTenantSnapshot() {
  const [snapshot, setSnapshot] = useState<AdminTenantSnapshot | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch("/api/admin-tenants", { cache: "no-store" });
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
  }, []);

  return { loadState, snapshot };
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>;
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

function FieldGrid({ fields }: { fields: Array<{ label: string; value: string }> }) {
  return (
    <dl className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4" key={field.label}>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{field.label}</dt>
          <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">{field.value}</dd>
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

function scopeTone(status: ScopeControlRow["status"]): BadgeTone {
  if (status === "active") return "green";
  if (status === "reference") return "blue";
  if (status === "static") return "gold";
  return "red";
}

function ReleaseScopeControlPanel() {
  const snapshot = buildScopeControlSnapshot();
  const worksetColumns: Array<DataTableColumn<ScopeControlRow>> = [
    { key: "label", header: "Workset", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.label}</span> },
    { key: "count", header: "Routes", render: (row) => String(row.count) },
    { key: "status", header: "State", render: (row) => <Badge tone={scopeTone(row.status)}>{row.status}</Badge> },
    { key: "treatment", header: "Runtime treatment", render: (row) => row.treatment },
  ];
  const controlColumns: Array<DataTableColumn<StaticWorkspaceControl>> = [
    { key: "location", header: "Surface", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.location}</span> },
    { key: "name", header: "Control", render: (row) => row.name },
    { key: "treatment", header: "Treatment", render: (row) => row.treatment },
  ];

  return (
    <section className="space-y-5" data-testid="release-scope-control">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard detail={metric.detail} key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>
      <div className="grid gap-5 2xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Release Scope Control</CardTitle>
            <CardDescription>Workspace availability is controlled before route shells become action or payload authority.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable compact columns={worksetColumns} getRowId={(row) => row.label} rows={snapshot.worksetRows} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Static Control Treatment</CardTitle>
            <CardDescription>Visible controls that are not backed by behavior are disabled or clearly static.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTable compact columns={controlColumns} getRowId={(row) => row.id} rows={snapshot.staticControls} />
            <StatePanel
              detail={`${snapshot.guardedRouteCount} registered-only routes remain blocked from product actions. Static controls remain visible only where they cannot imply mutation, filtering or release authority.`}
              state="restricted"
              title="No false affordance"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PermissionBoundaryPanel({ route }: { route: ScreenRoute }) {
  const { session } = useDemoSession();
  const objectId = `${route.pageId}-${route.objectType.toLowerCase()}-selected`;
  const boundary = permissionEngine.evaluateRouteBoundary(
    session.actor,
    session.role,
    route,
    {
      clientTenantId: session.tenant.id,
      objectId,
      objectScopeIds: [],
      platformTenantId: demoPlatformTenantId,
    },
  );
  const rows = [
    {
      label: "Route shell",
      state: boundary.routeShellAccessible ? "Available" : "Registered only",
      allowed: boundary.routeShellAccessible,
      detail: `${boundary.routeScope} / ${boundary.routeAccessMode}`,
    },
    {
      label: "Action authority",
      state: boundary.actionDecision.allowed ? "Allowed" : "Denied",
      allowed: boundary.actionDecision.allowed,
      detail: boundary.actionDecision.reason,
    },
    {
      label: "Payload visibility",
      state: boundary.payloadDecision.allowed ? "Allowed" : "Denied",
      allowed: boundary.payloadDecision.allowed,
      detail: boundary.payloadDecision.reason,
    },
  ];

  return (
    <div data-testid="permission-boundary-panel">
      <Card>
        <CardHeader>
          <CardTitle>Permission Boundary</CardTitle>
          <CardDescription>Actions and payload visibility are evaluated separately for the current tenant and role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4" key={row.label}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-alphavest-ivory">{row.label}</p>
                <Badge tone={row.allowed ? "green" : "red"}>{row.state}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">{row.detail}</p>
            </div>
          ))}
          <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4" data-testid="wp09-admin-does-not-grant">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-red">Admin configuration does not grant</p>
            <div className="mt-3 grid gap-2 text-sm text-alphavest-muted sm:grid-cols-2">
              {[
                "Compliance release",
                "Evidence sufficiency",
                "Client visibility",
                "Export approval",
                "Audit suppression",
                "Cross-tenant payload access",
              ].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <XCircle aria-hidden="true" className="size-4 shrink-0 text-alphavest-red" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SessionScopePanel() {
  const { session } = useDemoSession();

  return (
    <div data-testid="mapped-session-scope">
      <Card>
        <CardHeader>
          <CardTitle>Mapped Session Scope</CardTitle>
          <CardDescription>Current user context is resolved to actor, tenant, role and membership before access is evaluated.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGrid
            fields={[
              { label: "Actor", value: session.actor.displayName },
              { label: "Role", value: session.role.label },
              { label: "Tenant", value: session.tenant.displayName },
              { label: "Membership", value: `${session.tenantMembership.tenantSlug} / ${session.tenantMembership.scope}` },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function PlatformSettingsPage({ onConfirm, route }: { onConfirm: () => void; route: ScreenRoute }) {
  return (
    <div className="space-y-5">
      <AuditBanner action={<span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Audit log scoped</span>}>
        {platformSettings.auditBanner}. Changes require approval and are logged for compliance.
      </AuditBanner>
      <ScfP07P09TrustPanel mode="governance" />
      <ScfP10P14ClosurePanel mode="handoff" />
      <ReleaseScopeControlPanel />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
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
            <CardDescription>Critical toggles stay guarded by second confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            {platformSettings.security.map((setting) => (
              <SettingRow detail={setting.detail} enabled={setting.enabled} key={setting.label} label={setting.label} />
            ))}
          </CardContent>
        </Card>
      </section>
      <ActionBar>
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Changes require confirmation</span>
        <button
          className={primaryButtonClass}
          data-testid="j10-save-platform"
          onClick={() => {
            void runScreencastDemoAction("j10.savePlatform");
            onConfirm();
          }}
          type="button"
        >
          <LockKeyhole aria-hidden="true" className="size-4" />
          Save changes
        </button>
      </ActionBar>
      <PermissionBoundaryPanel route={route} />
    </div>
  );
}

function AdviceBoundaryPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 2xl:grid-cols-[1.25fr_0.65fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Advice Boundary Matrix</CardTitle>
              <CardDescription>Defines what can reach a client and which outputs require review.</CardDescription>
            </div>
            <StatusBadge status="Draft" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-alphavest-border/70">
              <table className="w-full min-w-full table-fixed border-collapse text-left text-sm md:min-w-[48rem]">
                <thead className="bg-alphavest-panel/75 text-xs uppercase tracking-[0.12em] text-alphavest-subtle">
                  <tr>
                    {["Content type", "Classification", "Handling", "Approval", "Client reachable"].map((header) => (
                      <th className="break-words border-b border-alphavest-border/70 px-4 py-3" key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adviceMatrix.map((row) => (
                    <tr className="border-b border-alphavest-border/55 last:border-0" key={row.contentType}>
                      <td className="break-words px-4 py-3 font-semibold text-alphavest-ivory">{row.contentType}</td>
                      <td className="break-words px-4 py-3"><Badge tone={row.tone}>{row.classification}</Badge></td>
                      <td className="break-words px-4 py-3 text-alphavest-muted">{row.handling}</td>
                      <td className="break-words px-4 py-3 text-alphavest-muted">{row.requiresApproval}</td>
                      <td className="break-words px-4 py-3 text-alphavest-muted">{row.clientReachable}</td>
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
          <CardContent className="space-y-4">
            <FieldGrid
              fields={[
                { label: "Policy owner", value: "Chief Compliance Officer" },
                { label: "Policy ID", value: "POL-ADV-008" },
                { label: "Next review", value: "15 Aug 2024" },
                { label: "Applies to", value: "All users, all entities" }
              ]}
            />
          </CardContent>
        </Card>
      </div>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.65fr]">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Release Rules", "Content must be classified before release", "Advice requires approval review", "All releases are logged"],
            ["Required Evidence", "Classification rationale", "Reviewer notes", "Approval timestamp"],
            ["Gate Rules", "Dual review for advice", "Minimum compliance approval", "Conflict check"]
          ].map(([title, ...items]) => (
            <Card key={title}>
              <CardHeader><CardTitle className="text-xl">{title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle className="text-xl">Policy Versioning</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {policyVersions.map((version) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3" key={version.version}>
                <div>
                  <p className="font-semibold text-alphavest-ivory">{version.version}</p>
                  <p className="mt-1 text-xs text-alphavest-muted">{version.date} by {version.owner}</p>
                </div>
                <StatusBadge status={version.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <AuditBanner action={<button className={primaryButtonClass} data-testid="j10-view-audit" onClick={() => { void runScreencastDemoAction("j10.viewAudit", "/admin/roles"); }} type="button">View audit log <ArrowRight aria-hidden="true" className="size-4" /></button>}>
        No unapproved advice reaches the client. This policy is enforced across workflows and channels.
      </AuditBanner>
    </div>
  );
}

function RolesPage({ onPermissionModal, route }: { onPermissionModal: () => void; route: ScreenRoute }) {
  return (
    <div className="space-y-5">
      <ActionBar>
        <SearchShell placeholder="Search roles, permissions..." />
        <button aria-disabled="true" className={staticButtonClass} disabled title="Role template creation requires governed lifecycle wiring." type="button">
          <Plus aria-hidden="true" className="size-4" />
          New role template
        </button>
      </ActionBar>
      <section className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>Role templates (6)</CardTitle>
            <CardDescription>Default roles used across platform and tenant setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleTemplates.map((role) => (
              <article
                className="flex w-full items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-left opacity-70"
                data-ux-affordance="blocked-cta"
                data-ux-interactive="false"
                key={role.name}
              >
                <span>
                  <span className="block text-sm font-semibold text-alphavest-ivory">{role.name}</span>
                  <span className="mt-1 block text-sm text-alphavest-muted">{role.description}</span>
                </span>
                <StatusBadge status={role.status} />
              </article>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Full, limited and blocked access by role template.</CardDescription>
            </div>
            <button
              className={secondaryButtonClass}
              data-testid="j10-review-permission"
              onClick={() => {
                void runScreencastDemoAction("j10.reviewPermission", "/admin/security");
                onPermissionModal();
              }}
              type="button"
            >
              <ShieldAlert aria-hidden="true" className="size-4" />
              Review permission changes
            </button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-alphavest-border/70">
              <table className="w-full min-w-full table-fixed border-collapse text-center text-sm md:min-w-[42rem]">
                <thead className="bg-alphavest-panel/75 text-xs uppercase tracking-[0.12em] text-alphavest-subtle">
                  <tr>
                    <th className="border-b border-alphavest-border/70 px-4 py-3 text-left">Role</th>
                    {permissionColumns.map((column) => <th className="border-b border-alphavest-border/70 px-4 py-3" key={column}>{column}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {permissionRows.map((row) => (
                    <tr className="border-b border-alphavest-border/55 last:border-0" key={row.role}>
                      <td className="px-4 py-3 text-left font-semibold text-alphavest-ivory">{row.role}</td>
                      {row.access.map((access, index) => (
                        <td className="px-4 py-3" key={`${row.role}-${permissionColumns[index]}`}>
                          {access === "full" ? <CheckCircle2 aria-hidden="true" className="mx-auto size-4 text-alphavest-green" /> : access === "limited" ? <AlertTriangle aria-hidden="true" className="mx-auto size-4 text-alphavest-gold" /> : <LockKeyhole aria-hidden="true" className="mx-auto size-4 text-alphavest-subtle" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
      <ScfP07P09TrustPanel mode="governance" />
      <PermissionBoundaryPanel route={route} />
    </div>
  );
}

function SecurityPage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="space-y-5">
      <ActionBar>
        <StatusChip label="All systems secure" status="ACTIVE" />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Audit log scoped</span>
        <button
          className={primaryButtonClass}
          data-testid="j10-save-security"
          onClick={() => {
            void runScreencastDemoAction("j10.saveSecurity");
            onConfirm();
          }}
          type="button"
        >
          Save changes
        </button>
      </ActionBar>
      <section className="grid gap-5 xl:grid-cols-2">
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
            rows={activeSessions}
          />
        </CardContent>
      </Card>
      <AuditBanner>Security changes may impact user access. All critical changes are logged and require elevated confirmation.</AuditBanner>
    </div>
  );
}

function EvidenceTemplatesPage() {
  type EvidenceTemplate = (typeof evidenceTemplates)[number];
  const columns: Array<DataTableColumn<EvidenceTemplate>> = [
    { key: "name", header: "Template", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
    { key: "category", header: "Category", render: (row) => <Badge tone="blue">{row.category}</Badge> },
    { key: "type", header: "Evidence type", render: (row) => row.type },
    { key: "required", header: "Items", render: (row) => row.required },
    { key: "cycle", header: "Cycle", render: (row) => row.cycle },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-alphavest-ivory md:text-4xl">Evidence Templates</h1>
        <p className="mt-2 text-sm text-alphavest-muted">Manage reusable evidence requirements.</p>
      </div>
      <ActionBar>
        <SearchShell placeholder="Search templates, categories, tags..." />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><Upload aria-hidden="true" className="size-4" />Import held</span>
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><Plus aria-hidden="true" className="size-4" />Template creation held</span>
      </ActionBar>
      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader><CardTitle>All Templates</CardTitle></CardHeader>
          <CardContent><DataTable columns={columns} getRowId={(row) => row.id} rows={evidenceTemplates} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl">Investment Suitability Review</CardTitle>
              <StatusBadge status="Draft" />
            </div>
            <CardDescription>Template summary and required evidence items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGrid
              fields={[
                { label: "Category", value: "Suitability" },
                { label: "Review cycle", value: "12 months" },
                { label: "Retention", value: "7 years" },
                { label: "Required items", value: "7" }
              ]}
            />
            {["Suitability review report", "Client risk profile", "Product recommendation rationale", "Alternative options considered", "Client acknowledgement"].map((item) => (
              <div className="flex items-center justify-between border-b border-alphavest-border/45 pb-3 text-sm last:border-0" key={item}>
                <span className="text-alphavest-muted">{item}</span>
                <span className="text-alphavest-ivory">Required</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ExportTemplatesPage() {
  type ExportTemplate = (typeof exportTemplates)[number];
  const columns: Array<DataTableColumn<ExportTemplate>> = [
    { key: "name", header: "Template", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
    { key: "category", header: "Category", render: (row) => row.category },
    { key: "profile", header: "Redaction profile", render: (row) => row.profile },
    { key: "version", header: "Version", render: (row) => row.version },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updated", header: "Updated", render: (row) => row.updated }
  ];

  return (
    <div className="space-y-5">
      <ActionBar>
        <SearchShell placeholder="Search templates, profiles, fields..." />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Template creation held</span>
      </ActionBar>
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard detail="6 active, 9 draft, 3 blocked" label="Templates" value="18" />
        <MetricCard detail="5 active, 2 draft" label="Redaction profiles" value="7" />
        <MetricCard detail="Within 30 days" label="Expiring soon" status="PENDING" value="5" />
      </section>
      <section className="grid gap-5 2xl:grid-cols-[1.1fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Export Templates</CardTitle></CardHeader>
          <CardContent><DataTable columns={columns} getRowId={(row) => row.name} rows={exportTemplates} /></CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Redaction Profiles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {redactionProfiles.map((profile) => (
                <div className="text-sm font-semibold text-alphavest-ivory" key={profile}>{profile}</div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Compliance and Audit</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["All exports are watermark-enabled", "Templates enforce redaction and expiry", "Changes are versioned and audited"].map((item) => (
                <div className="flex items-center gap-2 text-sm text-alphavest-gold-soft" key={item}>
                  <Check aria-hidden="true" className="size-4" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <AuditBanner>Audit activity: template changes are controlled and logged.</AuditBanner>
    </div>
  );
}

function TenantsPage() {
  const { loadState, snapshot } = useAdminTenantSnapshot();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const rows = snapshot?.tenantRows.length ? snapshot.tenantRows : tenantRows;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const statusOptions = Array.from(new Set(rows.map((row) => row.status))).sort();
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      [row.name, row.jurisdiction, row.tier, row.owner, row.onboarding, row.status].some((value) =>
        String(value).toLowerCase().includes(normalizedSearchTerm),
      );
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  type TenantRow = (typeof rows)[number];
  const columns: Array<DataTableColumn<TenantRow>> = [
    { key: "name", header: "Tenant", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
    { key: "jurisdiction", header: "Jurisdiction", render: (row) => row.jurisdiction },
    { key: "tier", header: "Tier", render: (row) => <Badge tone="gold">{row.tier}</Badge> },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    { key: "onboarding", header: "Onboarding", render: (row) => <StatusBadge status={row.onboarding} /> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-5">
      <ActionBar>
        <StatusChip label={loadState === "error" ? "DB snapshot unavailable" : "DB tenant rows"} status={loadState === "error" ? "FAILED" : "ACTIVE"} />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><Download aria-hidden="true" className="size-4" />CSV export held</span>
        <button className={primaryButtonClass} data-testid="j06-new-tenant" onClick={() => { void runTenantGovernanceCommand("j06.newTenant", "/tenants/new"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Tenant</button>
      </ActionBar>
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_0.75fr_auto]">
          <label className="block">
            <span className="sr-only">Search tenants</span>
            <input
              className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search DB tenants..."
              type="search"
              value={searchTerm}
            />
          </label>
          <select
            className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button aria-label="Additional tenant filters are static in this directory" className={secondaryButtonClass} disabled title="Search and status already filter this directory." type="button">
            <Filter aria-hidden="true" className="size-4" />
            Filters
          </button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Directory</CardTitle>
          <CardDescription>Tenant data is isolated and inaccessible across tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            emptyMessage={loadState === "error" ? "Tenant rows could not be loaded from the DB." : "No DB tenants match this filter."}
            getRowId={(row) => String("id" in row ? row.id : row.name)}
            rows={filteredRows}
          />
        </CardContent>
      </Card>
      <SessionScopePanel />
    </div>
  );
}

function CreateTenantPage() {
  const { snapshot } = useAdminTenantSnapshot();
  const morgan = snapshot?.tenantRows.find((row) => row.name.includes("Morgan")) ?? snapshot?.tenantRows[0];
  const [tenantName, setTenantName] = useState(`P44 Family Office ${new Date().getFullYear()}`);
  const [jurisdiction, setJurisdiction] = useState("South Africa");
  const [relationshipTier, setRelationshipTier] = useState("Signature");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Tenant creation starts a draft setup record only. It does not activate users or release payloads.");
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
        actorRoleKey: "admin",
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
      result?: { setupState?: string; tenant?: { displayName: string; status: string } };
    };

    if (!response.ok || !body.ok || !body.result?.tenant) {
      setStatus("error");
      setMessage(body.error ?? "Tenant draft could not be created.");
      return;
    }

    setStatus("success");
    setMessage(`${body.result.tenant.displayName} created as ${body.result.setupState ?? body.result.tenant.status}. Team, policy and invitation gates remain locked.`);
    void runTenantGovernanceCommand("j06.newTenant");
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
                  { label: "Primary owner", value: morgan?.owner ?? "Unassigned" },
                  { label: "Entity type", value: "Single Family Office" },
                ]}
              />
            </div>
            <StatePanel detail={message} state={status === "success" ? "success" : status === "error" ? "blocked" : "restricted"} title="Tenant draft command" />
            <ActionBar>
              <button className={secondaryButtonClass} onClick={() => { void createTenant(); }} type="button">{status === "submitting" ? "Saving" : "Save draft"}</button>
              <button className={primaryButtonClass} data-testid="j06-continue-tenant" onClick={() => { void runTenantGovernanceCommand("j06.continueTenant", "/tenants/demo/setup"); }} type="button">Continue to team setup <ArrowRight aria-hidden="true" className="size-4" /></button>
            </ActionBar>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Setup Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              `Tenant details: ${morgan?.status ?? "Draft"}`,
              `Team setup: ${morgan?.activeUsers ?? 0} active assignments`,
              `Policy assignment: ${morgan?.activePolicies ?? 0} active policies`,
              `Review and confirm: ${morgan?.readiness ?? 0}% ready`,
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
  const { snapshot } = useAdminTenantSnapshot();
  const rows = snapshot?.setupChecklist.length ? snapshot.setupChecklist : tenantSetupChecklist;
  const metrics = snapshot?.metrics;
  type ChecklistRow = (typeof rows)[number];
  const columns: Array<DataTableColumn<ChecklistRow>> = [
    { key: "item", header: "Item", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.item}</span> },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "readiness", header: "Readiness", render: (row) => <StatusBadge status={row.readiness} /> }
  ];

  return (
    <div className="space-y-5">
      <WizardStepper steps={tenantWizardSteps.setup.map((step) => ({ ...step }))} />
      <section className="grid gap-5 2xl:grid-cols-[1fr_0.48fr]">
        <Card>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
            <CardDescription>Resolve missing and blocked items before activation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
              <MetricCard detail="DB tenant rows" label="Total tenants" value={String(metrics?.total ?? 4)} />
              <MetricCard detail="Completed onboarding" label="Completed" status="ACTIVE" value={String(metrics?.completed ?? 0)} />
              <MetricCard detail="Needs attention" label="In progress" status="PENDING" value={String(metrics?.inProgress ?? 0)} />
              <MetricCard detail="Readiness below threshold" label="Blocked" status="FAILED" value={String(metrics?.blocked ?? 0)} />
              <MetricCard detail="DB-derived readiness" label="Setup complete" status="PROCESSING" value={`${metrics?.readiness ?? 0}%`} />
            </div>
            <DataTable columns={columns} getRowId={(row) => row.item} rows={rows} />
            <AuditBanner>All required items must be completed and unblocked to activate this tenant.</AuditBanner>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Activation Gate</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                `Required items completed: ${rows.filter((row) => row.readiness === "Ready").length} / ${rows.length}`,
                `No blocked items: ${metrics?.blocked ?? 0} blocked`,
                `Policies configured: ${snapshot?.tenantRows[0]?.activePolicies ?? 0}`,
                `Team assignments: ${snapshot?.teamRows.length ?? 0}`,
                "Security enabled",
                "Integrations connected: deferred",
              ].map((item, index) => (
                <div className="flex items-center justify-between gap-3 text-sm" key={item}>
                  <span className="text-alphavest-muted">{item}</span>
                  {index >= 3 && index !== 5 ? <CheckCircle2 className="size-4 text-alphavest-green" /> : <XCircle className="size-4 text-alphavest-red" />}
                </div>
              ))}
              <p className={cn(staticButtonClass, "w-full")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Activation blocked</p>
            </CardContent>
          </Card>
          <StatePanel detail="Policy framework and CRM integration need attention before this tenant can activate." state="blocked" title="Missing and blocked items" />
        </div>
      </section>
    </div>
  );
}

function TenantTeamPage() {
  const { snapshot } = useAdminTenantSnapshot();
  const rows = snapshot?.teamRows.length ? snapshot.teamRows : teamAssignments;
  type Assignment = (typeof rows)[number];
  const columns: Array<DataTableColumn<Assignment>> = [
    { key: "role", header: "Role", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.role}</span> },
    { key: "assignee", header: "Assignee", render: (row) => row.assignee },
    { key: "workload", header: "Workload", render: (row) => row.workload },
    { key: "capacity", header: "Capacity", render: (row) => row.capacity },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-5">
      <ActionBar>
        <StatusBadge status="Draft" />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Assignment preview held</span>
        <button className={primaryButtonClass} data-testid="j06-assign-team" onClick={() => { void runTenantGovernanceCommand("j06.assignTeam", "/tenants/demo/policies"); }} type="button">Save changes</button>
      </ActionBar>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <Card>
          <CardHeader>
            <CardTitle>Role Assignments</CardTitle>
            <CardDescription>Required roles must be filled before activating a pilot.</CardDescription>
          </CardHeader>
          <CardContent><DataTable columns={columns} getRowId={(row) => String("id" in row ? row.id : row.role)} rows={rows} /></CardContent>
        </Card>
        <div className="space-y-5">
          <StatePanel detail="A Compliance Owner must be assigned before a pilot can be activated." state="blocked" title="Pilot cannot proceed" />
          <Card>
            <CardHeader><CardTitle>Team Summary</CardTitle></CardHeader>
            <CardContent><FieldGrid fields={[{ label: "Total team members", value: String(rows.length) }, { label: "Active assignments", value: String(rows.filter((row) => row.status === "Active").length) }, { label: "Unassigned roles", value: String(Math.max(0, 4 - rows.length)) }, { label: "Average workload", value: "DB scoped" }]} /></CardContent>
          </Card>
        </div>
      </section>
      <AuditBanner>All role assignments are audit-tracked.</AuditBanner>
    </div>
  );
}

function TenantPoliciesPage() {
  return (
    <div className="space-y-5">
      <ActionBar>
        <StatusChip label="12 Active" status="ACTIVE" />
        <StatusChip label="3 Draft" status="DRAFT" />
        <StatusChip label="1 Blocked" status="FAILED" />
        <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Policy creation held</span>
      </ActionBar>
      <Card>
        <CardHeader>
          <CardTitle>Policy Profile</CardTitle>
          <CardDescription>Balanced Growth inherited from AlphaVest global defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGrid fields={[{ label: "Profile", value: "Balanced Growth" }, { label: "Inherited from", value: "AlphaVest Global Default v2.4" }, { label: "Last updated", value: "15 May 2024, 10:24" }]} />
        </CardContent>
      </Card>
      <section className="grid gap-4 lg:grid-cols-3">
        {tenantPolicyCards.map((card) => (
          <Card key={card.title}>
            <CardHeader><CardTitle className="text-xl">{card.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {card.details.map((detail) => (
                <div className="border-b border-alphavest-border/45 pb-3 text-sm text-alphavest-muted last:border-0" key={detail}>{detail}</div>
              ))}
              <span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Configure held <ArrowRight aria-hidden="true" className="size-4" /></span>
            </CardContent>
          </Card>
        ))}
      </section>
      <AuditBanner action={<span className={staticButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Override review held</span>}>
        Policy overrides require Compliance approval and audit confirmation before activation.
      </AuditBanner>
    </div>
  );
}

function TenantUsersPage({ onInvite }: { onInvite: () => void }) {
  const { loadState, snapshot } = useAdminTenantSnapshot();
  const rows = snapshot?.userRows.length ? snapshot.userRows : tenantUsers;
  type TenantUser = (typeof rows)[number];
  const columns: Array<DataTableColumn<TenantUser>> = [
    { key: "name", header: "User", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
    { key: "invite", header: "Invite", render: (row) => row.invite },
    { key: "role", header: "Roles", render: (row) => row.role },
    { key: "scope", header: "Scope", render: (row) => row.scope },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-5">
      <ActionBar>
        <button
          className={primaryButtonClass}
          data-testid="j06-invite-user"
          data-ux-lifecycle-result="opens-invite-user-drawer"
          data-ux-lifecycle-trigger="invite-user-drawer"
          onClick={() => {
            void runTenantGovernanceCommand("j06.openInvitation");
            onInvite();
          }}
          type="button"
        >
          <UserPlus aria-hidden="true" className="size-4" />Invite user
        </button>
      </ActionBar>
      <section className="grid gap-4 md:grid-cols-5">
        <MetricCard detail="Tenant members" label="Total users" value={String(rows.length)} />
        <MetricCard detail="Can access workspace" label="Active" status="ACTIVE" value={String(rows.filter((row) => row.status === "Active").length)} />
        <MetricCard detail="Invitation sent" label="Invited" status="SCHEDULED" value={String(rows.filter((row) => row.invite === "Invited").length)} />
        <MetricCard detail="Awaiting confirmation" label="Pending" status="PENDING" value={String(rows.filter((row) => row.status !== "Active").length)} />
        <MetricCard detail="Access removed" label="Revoked" status="FAILED" value={String(rows.filter((row) => row.status === "Revoked").length)} />
      </section>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>User Access</CardTitle>
            <CardDescription>Manage users, assign roles and control access across the organization.</CardDescription>
          </div>
          <button aria-label="Tenant user filters are not wired in this release" className={secondaryButtonClass} disabled title="User access filters are not wired in this release." type="button">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Filters
          </button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            emptyMessage={loadState === "error" ? "Tenant users could not be loaded from the DB." : "No tenant user assignments found."}
            getRowId={(row) => String("id" in row ? row.id : row.name)}
            rows={rows}
          />
        </CardContent>
      </Card>
      <SessionScopePanel />
    </div>
  );
}

function CriticalChangeModal({ kind, onClose }: { kind: ConfirmationKind; onClose: () => void }) {
  const isSecurity = kind === "security";
  const phrase = isSecurity ? "DISABLE MFA" : "I understand the impact of this change";
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");
  const phraseMatches = confirmationPhrase === phrase;
  const lifecycleCopy = isSecurity
    ? "Security changes require exact-phrase validation, elevated authorization, audit persistence and backend execution before activation."
    : "Platform changes require exact-phrase validation, elevated authorization, audit persistence and backend execution before activation.";

  function handleClose() {
    setConfirmationPhrase("");
    setBlockedMessage("");
    onClose();
  }

  function handleConfirmAttempt() {
    if (!phraseMatches) {
      setBlockedMessage("Type the exact phrase before this confirmation can be evaluated.");
      return;
    }

    setBlockedMessage(
      "Blocked in demo: no platform or security setting changed, no audit event was created, and no client visibility or downstream release state changed."
    );
  }

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
            data-ux-lifecycle-result={phraseMatches ? "blocked-no-authorized-mutation" : "blocked-validation-required"}
            disabled={!phraseMatches}
            onClick={handleConfirmAttempt}
            type="button"
          >
            <LockKeyhole aria-hidden="true" className="size-4" />
            Confirm change
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
          title="Second confirmation required"
        />
        {blockedMessage ? (
          <StatePanel
            className="text-left"
            detail={blockedMessage}
            state="blocked"
            title={phraseMatches ? "Mutation blocked" : "Validation required"}
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
                setBlockedMessage("");
              }}
              placeholder="Type the exact phrase above"
              value={confirmationPhrase}
            />
          </label>
          <p className="mt-3 text-sm text-alphavest-muted" id="admin-confirmation-validation">
            {phraseMatches
              ? "Exact phrase matched. Backend authorization and audit execution are still required before any setting can change."
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
            Confirm scoped permission change
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
        <StatePanel detail="Permission change is scoped to this role template. It cannot release advice, mark evidence review complete, approve export, or bypass audit." state="restricted" title="Scoped permission change" />
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

function InviteUserDrawer({ onClose, open }: { onClose: () => void; open: boolean }) {
  const [email, setEmail] = useState("alex.morgan@claritycapital.com");
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [roleKey, setRoleKey] = useState<DemoRoleKey>("analyst");
  const [tenantSlug, setTenantSlug] = useState<DemoTenantSlug>("summit");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Invitation creates a user, pending role assignment and audit event.");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
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
        actorRoleKey: "admin",
        displayName,
        email,
        roleKey,
        tenantSlug,
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
      "alphavest.dummyAuth.v1",
      JSON.stringify({
        email: body.result.user.email,
        inviteToken: body.result.inviteToken,
        nextStep: "invite_acceptance_required",
      }),
    );
    setInviteToken(body.result.inviteToken);
    setStatus("success");
    setMessage(`${body.result.user.email} is now invited for ${body.result.user.roleName ?? roleKey} in ${body.result.user.tenantName ?? tenantSlug}.`);
    void runTenantGovernanceCommand("j06.sendInvitation");
  }

  return (
    <Drawer
      description="Send an invitation and assign access."
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
              onChange={(event) => setRoleKey(event.target.value as DemoRoleKey)}
              value={roleKey}
            >
              {demoRoles.map((role) => (
                <option key={role.key} value={role.key}>{role.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-alphavest-ivory">Tenant scope</span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
              onChange={(event) => setTenantSlug(event.target.value as DemoTenantSlug)}
              value={tenantSlug}
            >
              {demoTenants.map((tenant) => (
                <option key={tenant.slug} value={tenant.slug}>{tenant.displayName}</option>
              ))}
            </select>
          </label>
        </div>
        <StatePanel detail="Roles with elevated permissions require additional confirmation before activation." state="restricted" title="Sensitive roles" />
        <p className="text-sm text-alphavest-muted" id="invite-user-validation">
          {canSubmit
            ? "Ready to create a DB-backed invitation with pending role assignment and audit event."
            : "Invitation remains blocked until email and display name are valid, and no request is submitting."}
        </p>
        <StatePanel
          detail={message}
          state={status === "error" ? "blocked" : status === "success" ? "success" : "restricted"}
          title="Invitation state"
        />
        {inviteToken ? (
          <Link className={cn(secondaryButtonClass, "w-full justify-between")} data-testid="dummy-invite-link" href="/onboarding/invite">
            Continue invite acceptance
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4">
          <p className="text-sm font-semibold text-alphavest-ivory">Message</p>
          <p className="mt-2 text-sm text-alphavest-muted">Add a personal invitation note in the production workflow.</p>
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
  const [confirmationKind, setConfirmationKind] = useState<ConfirmationKind>(() => initialConfirmationKind(route, visualState));
  const [permissionModalOpen, setPermissionModalOpen] = useState(() => route.pageId === "009" && visualState === "permission");
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState(() => route.pageId === "018" && visualState === "invite");
  const worksurface = adminTenantWorksurfaceMeta[route.pageId as AdminTenantSetupPageId];

  function renderPage() {
    if (route.pageId === "007") {
      return <PlatformSettingsPage onConfirm={() => setConfirmationKind("platform")} route={route} />;
    }
    if (route.pageId === "008") {
      return <AdviceBoundaryPage />;
    }
    if (route.pageId === "009") {
      return <RolesPage onPermissionModal={() => setPermissionModalOpen(true)} route={route} />;
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
      return <UxHubPage pageId="013" />;
    }
    if (route.pageId === "014") {
      return <CreateTenantPage />;
    }
    if (route.pageId === "015") {
      return <UxHubPage pageId="015" />;
    }
    if (route.pageId === "016") {
      return <TenantTeamPage />;
    }
    if (route.pageId === "017") {
      return <TenantPoliciesPage />;
    }
    return <TenantUsersPage onInvite={() => setInviteDrawerOpen(true)} />;
  }

  return (
    <AppShell>
      <WorksurfaceShell
        description={route.purpose}
        eyebrow={route.navigationGroup === "tenant_setup" ? "Tenant setup worksurface" : "Platform setup worksurface"}
        primary={renderPage()}
        routeId={route.pageId}
        safetyNote={worksurface.safetyNote}
        statusItems={[
          { label: "Workflow", tone: "blue", value: route.workflowName },
          { label: "Control", tone: worksurface.tone, value: worksurface.status },
        ]}
        title={route.title}
        worksurfaceId={worksurface.worksurfaceId}
      >
        <UxSupportDensityStrip pageId={route.pageId} />
      </WorksurfaceShell>
      <CriticalChangeModal kind={confirmationKind} onClose={() => setConfirmationKind(null)} />
      <PermissionChangeModal onClose={() => setPermissionModalOpen(false)} open={permissionModalOpen} />
      <InviteUserDrawer onClose={() => setInviteDrawerOpen(false)} open={inviteDrawerOpen} />
    </AppShell>
  );
}
