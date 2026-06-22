"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Download,
  File,
  FileCheck2,
  FileText,
  Folder,
  Landmark,
  LayoutDashboard,
  MessageSquare,
  Network,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { DemoActorHandoffBar } from "@/components/demo-actor-handoff-bar";
import { GlobalSearchBox } from "@/components/global-search-box";
import { ProductGuidanceContent } from "@/components/product-guidance-panel";
import { RouteContextChip } from "@/components/route-context-chip";
import { ScfP04P06FlowPanel } from "@/components/scf-p04-p06-flow-panel";
import { ScfP07P09TrustPanel } from "@/components/scf-p07-p09-trust-panel";
import { ScfP10P14ClosurePanel } from "@/components/scf-p10-p14-closure-panel";
import { UxHubPage } from "@/components/ux-hub-page";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  MetricCard,
  StatePanel,
  WizardStepper,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  clientWorkspace,
  entityDetail,
  entityDocuments,
  entityParticipants,
  extractionFields,
  governancePreferences,
  missingDocuments,
  mobilePriorityActions,
  portalActions,
  portalDecisions,
  relationshipNodes,
  relationshipRows,
  verificationEvidence
} from "@/lib/client-intake-demo-data";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import { runScreencastDemoAction } from "@/lib/screencast-demo-client";

type ClientIntakeScreenProps = {
  route: ScreenRoute;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  pageIds?: string[];
  count?: number;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

const clientNav: NavItem[] = [
  { href: "/client/home", icon: LayoutDashboard, label: "Dashboard", pageIds: ["019"] },
  { href: "/client/profile", icon: UserRound, label: "Overview", pageIds: ["021"] },
  { href: "/client/family-members", icon: UsersRound, label: "Family & Entities", pageIds: ["022", "023", "024", "025", "026"] },
  { href: "/relationships", icon: Network, label: "Relationships", pageIds: ["023"] },
  { href: "/entities", icon: Landmark, label: "Entities", pageIds: ["024", "025", "026"] },
  { href: "/documents", icon: Folder, label: "Documents", pageIds: ["027", "028", "029", "030"] },
  { href: "/documents/upload", icon: Upload, label: "Upload", pageIds: ["028"] },
  { href: "/documents/review-queue", icon: FileCheck2, label: "Extraction Review", pageIds: ["029"] },
  { href: "/documents/:id/review", icon: Clock3, label: "Verification", pageIds: ["030"], count: 3 },
  { href: "/actions", icon: ClipboardCheck, label: "Tasks", count: 7 },
  { href: "/evidence", icon: ShieldCheck, label: "Evidence" },
  { href: "/settings", icon: SlidersHorizontal, label: "Settings" }
];

const mobileQuickActions: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Upload, label: "Upload" },
  { icon: MessageSquare, label: "Message" },
  { icon: Calendar, label: "Schedule" },
  { icon: ShieldCheck, label: "Security" }
];

type PersistedUploadDocument = {
  checksum: string;
  documentType: string;
  evidenceRecordId: string | null;
  evidenceStatus: string | null;
  evidenceVisibilityStatus: string | null;
  extractionStatus?: string | null;
  fileName?: string;
  fileSizeBytes?: number;
  id: string;
  mimeType?: string;
  sensitivity: string;
  status: string;
  storageKey?: string;
  title: string;
  uploadedAt: string;
};

type DocumentTableRow = {
  entity: string;
  id: string;
  name: string;
  sensitivity: string;
  status: string;
  type: string;
  updated: string;
};

type FamilyMemberTableRow = {
  governance: string;
  id: string;
  name: string;
  relationship: string;
  role: string;
  sensitivity: string;
  status: string;
  taxResidency: string;
  year: string;
};

type EntityTableRow = {
  id: string;
  jurisdiction: string;
  missingDocs: string;
  name: string;
  ownership: string;
  risk: string;
  status: string;
  type: string;
};

type DbtfClientProfile = {
  countryOfResidence: string;
  dateOfBirth: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  relationshipLabel: string;
  sensitivity: string;
  source: string;
  updatedAt: string;
};

type DbtfDashboardMetrics = {
  cards: Array<{ label: string; tone: BadgeTone; value: string }>;
  evidenceCoverage: number;
  readiness: number;
};

type ProfileFormState = {
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  phone: string;
  relationshipLabel: string;
};

type FamilyMemberFormState = {
  displayName: string;
  relationshipType: string;
  taxResidency: string;
};

type EntityWizardFormState = {
  entityType: string;
  jurisdiction: string;
  name: string;
  ownerSummary: string;
  registrationNumber: string;
  riskRating: string;
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatUploadDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function labelFromEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isPersistedUploadDocument(value: unknown): value is PersistedUploadDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PersistedUploadDocument>;
  return (
    typeof candidate.documentType === "string" &&
    typeof candidate.id === "string" &&
    typeof candidate.sensitivity === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.uploadedAt === "string"
  );
}

function toDocumentRows(documents: PersistedUploadDocument[], entityLabel: string): DocumentTableRow[] {
  return documents.map((document) => ({
    entity: entityLabel,
    id: document.id,
    name: document.fileName ?? document.title,
    sensitivity: labelFromEnum(document.sensitivity),
    status: labelFromEnum(document.status),
    type: labelFromEnum(document.documentType),
    updated: formatUploadDate(document.uploadedAt),
  }));
}

function usePersistedUploadDocuments() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [documents, setDocuments] = useState<PersistedUploadDocument[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const refresh = useCallback(async () => {
    setLoadState("loading");
    setDocuments([]);

    try {
      const response = await fetch(
        `/api/documents?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}&source=all`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as { documents?: PersistedUploadDocument[] };

      if (!response.ok) {
        throw new Error("Document reload failed.");
      }

      setDocuments((body.documents ?? []).filter(isPersistedUploadDocument));
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [roleKey, tenantSlug]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  return { documents, loadState, refresh };
}

function sortByKey<T>(rows: T[], key: keyof T, direction: "asc" | "desc") {
  return [...rows].sort((left, right) => {
    const leftValue = String(left[key] ?? "");
    const rightValue = String(right[key] ?? "");
    const result = leftValue.localeCompare(rightValue, "en", { numeric: true, sensitivity: "base" });

    return direction === "desc" ? -result : result;
  });
}

function useDbtfDashboardMetrics() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [metrics, setMetrics] = useState<DbtfDashboardMetrics | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch(
        `/api/dashboard-metrics?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as { metrics?: DbtfDashboardMetrics };

      if (!cancelled) {
        setMetrics(response.ok ? body.metrics ?? null : null);
      }
    }

    void load().catch(() => {
      if (!cancelled) {
        setMetrics(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [roleKey, tenantSlug]);

  return metrics;
}

function useDbtfClientProfile() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [profile, setProfile] = useState<DbtfClientProfile | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await fetch(
        `/api/profile?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as { profile?: DbtfClientProfile };

      if (!response.ok || !body.profile) {
        throw new Error("Profile reload failed.");
      }

      setProfile(body.profile);
      setLoadState("ready");
    } catch {
      setProfile(null);
      setLoadState("error");
    }
  }, [roleKey, tenantSlug]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const save = useCallback(
    async (form: ProfileFormState, action: "save_draft" | "submit_review") => {
      const response = await fetch("/api/profile", {
        body: JSON.stringify({ ...form, action, roleKey, tenantSlug }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const body = (await response.json()) as { issues?: string[]; result?: { profile?: DbtfClientProfile } };

      if (!response.ok || !body.result?.profile) {
        throw new Error(body.issues?.join(", ") || "Profile save failed.");
      }

      setProfile(body.result.profile);
      return body.result.profile;
    },
    [roleKey, tenantSlug],
  );

  return { loadState, profile, refresh, save };
}

function useDbtfFamilyMembers() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<FamilyMemberTableRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await fetch(
        `/api/family-members?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as { familyMembers?: FamilyMemberTableRow[] };

      if (!response.ok) {
        throw new Error("Family member reload failed.");
      }

      setRows(body.familyMembers ?? []);
      setLoadState("ready");
    } catch {
      setRows([]);
      setLoadState("error");
    }
  }, [roleKey, tenantSlug]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const save = useCallback(
    async (id: string, form: FamilyMemberFormState) => {
      const response = await fetch("/api/family-members", {
        body: JSON.stringify({ ...form, id, roleKey, tenantSlug }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const body = (await response.json()) as { issues?: string[] };

      if (!response.ok) {
        throw new Error(body.issues?.join(", ") || "Family member save failed.");
      }

      await refresh();
    },
    [refresh, roleKey, tenantSlug],
  );

  return { loadState, refresh, rows, save };
}

function useDbtfEntities() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<EntityTableRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch(
          `/api/entities?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
          { cache: "no-store" },
        );
        const body = (await response.json()) as { entities?: EntityTableRow[] };

        if (!response.ok) {
          throw new Error("Entity reload failed.");
        }

        if (!cancelled) {
          setRows(body.entities ?? []);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [roleKey, tenantSlug]);

  return { loadState, rows };
}

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("active") || normalized.includes("approved") || normalized.includes("complete") || normalized.includes("verified") || normalized.includes("uploaded")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("conflict") || normalized.includes("restricted") || normalized.includes("breach") || normalized.includes("low") || normalized.includes("not allowed")) {
    return "red";
  }

  if (normalized.includes("review") || normalized.includes("pending") || normalized.includes("draft") || normalized.includes("missing") || normalized.includes("medium") || normalized.includes("required")) {
    return "gold";
  }

  if (normalized.includes("internal") || normalized.includes("high")) {
    return "blue";
  }

  return "muted";
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="sr-only">{children}</h1>;
}

function AlphaVestLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid place-items-center rounded text-alphavest-gold", compact ? "size-10 text-xl" : "size-12 text-2xl")}>
        A
      </div>
      <div>
        <p className={cn("font-display leading-none text-alphavest-ivory", compact ? "text-xl" : "text-2xl")}>AlphaVest</p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-alphavest-gold">WealthOS</p>
      </div>
    </div>
  );
}

function IconTile({ children, tone = "gold" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold",
    green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/35 bg-teal-300/10 text-teal-200"
  };

  return <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border", toneClass[tone])}>{children}</span>;
}

function ProgressRing({ label, size = "large", value }: { label: string; size?: "large" | "small"; value: number }) {
  return (
    <div
      className={cn("grid shrink-0 place-items-center rounded-full", size === "large" ? "size-36" : "size-24")}
      style={{
        background: `conic-gradient(#f0c982 ${value * 3.6}deg, rgba(174,184,196,0.2) 0deg)`
      }}
    >
      <div className={cn("grid place-items-center rounded-full bg-alphavest-navy", size === "large" ? "size-28" : "size-20")}>
        <p className={cn("font-display text-alphavest-ivory", size === "large" ? "text-5xl" : "text-3xl")}>{value}</p>
        <p className="text-xs text-alphavest-muted">{label}</p>
      </div>
    </div>
  );
}

function ClientSidebar({ activePageId }: { activePageId: string }) {
  const { session } = useDemoSession();

  return (
    <aside className="hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/82 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
      <AlphaVestLogo />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {clientNav.map((item) => {
          const Icon = item.icon;
          const active = item.pageIds?.includes(activePageId);

          return (
            <a
              className={cn(
                "flex h-10 items-center gap-3 rounded-md border px-3 text-sm transition",
                active
                  ? "border-alphavest-gold/45 bg-alphavest-gold/12 text-alphavest-gold-soft"
                  : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel/65 hover:text-alphavest-ivory"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.count ? <span className="rounded-full bg-alphavest-gold/20 px-2 text-xs text-alphavest-gold">{item.count}</span> : null}
            </a>
          );
        })}
      </nav>
      <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/60 p-4">
        <p className="text-sm font-semibold text-alphavest-ivory">{session.tenant.displayName}</p>
        <p className="mt-1 text-xs text-alphavest-muted">{session.role.label}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-alphavest-green">
          <span className="size-2 rounded-full bg-alphavest-green" />
          Active
        </div>
      </div>
      <button className="mt-4 flex items-center gap-2 text-xs text-alphavest-muted" type="button">
        <PanelLeftClose aria-hidden="true" className="size-4" />
        Collapse
      </button>
    </aside>
  );
}

function ClientTopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[28rem]" />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <RouteContextChip />
          <label className="grid gap-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">
            <span>Tenant context</span>
            <span className="relative block">
              <select
                aria-label="Tenant context"
                className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-64"
                onChange={(event) => setTenant(event.target.value as DemoTenantSlug)}
                value={session.tenant.slug}
              >
                {demoTenants.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            </span>
          </label>
          <label className="grid gap-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">
            <span>Role context</span>
            <span className="relative block">
              <select
                aria-label="Role context"
                className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-56"
                onChange={(event) => setRole(event.target.value as DemoRoleKey)}
                value={session.role.key}
              >
                {demoRoles.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            </span>
          </label>
          <button className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" type="button">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">5</span>
          </button>
          <div className="flex h-10 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 pl-1 pr-3">
            <span className="grid size-8 place-items-center rounded-full border border-alphavest-gold/45 text-xs font-semibold text-alphavest-gold">{session.actor.initials}</span>
            <span className="hidden text-sm font-semibold text-alphavest-ivory md:block">{session.actor.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ClientShell({ activePageId, children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-client av-shell-grid">
        <ClientSidebar activePageId={activePageId} />
        <div className="min-w-0">
          <ClientTopBar />
          <DemoActorHandoffBar />
          <main className="px-4 py-6 md:px-6">
            <ProductGuidanceContent>{children}</ProductGuidanceContent>
          </main>
        </div>
      </div>
    </DemoSessionProvider>
  );
}

function SectionTitle({ action, count, icon: Icon, subtitle, title }: { action?: React.ReactNode; count?: string; icon?: LucideIcon; subtitle?: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <IconTile>
            <Icon aria-hidden="true" className="size-5" />
          </IconTile>
        ) : null}
        <div>
          <h2 className="font-display text-2xl text-alphavest-ivory md:text-3xl">
            {title}
            {count ? <Badge className="ml-3 align-middle" tone="gold">{count}</Badge> : null}
          </h2>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-alphavest-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

function SafeClientBanner({ children = "No unapproved advice reaches the client." }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
      <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}



type Phase5DetailSplitPanelProps = {
  decisionSupport: string;
  objectLabel: string;
  objectState: string;
  pageJob: string;
  safetyBoundary: string;
  splitTaskId?: string;
  taskId: string;
};



type Phase7ClientProjectionPanelProps = {
  allowedFields: string;
  failClosed: string;
  forbiddenFields: string;
  recovery: string;
  routeLabel: string;
  taskId: string;
  visibilityEngineOutput: string;
};

function Phase7ClientProjectionPanel({ allowedFields, failClosed, forbiddenFields, recovery, routeLabel, taskId, visibilityEngineOutput }: Phase7ClientProjectionPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-green/35 bg-alphavest-green/10 p-4" data-testid="ux-phase7-client-projection" data-ux-phase7-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-green">Phase 7 client-safe projection</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{routeLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">Visibility engine output is rendered as a fail-closed client projection, never as an internal payload preview.</p>
        </div>
        <Badge tone="green">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase7-visibility-engine">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Visibility engine</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{visibilityEngineOutput}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase7-safe-fields">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Allowed client fields</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{allowedFields}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-phase7-forbidden-fields">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-red">Forbidden payloads</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{forbiddenFields}</p>
        </div>
        <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3" data-testid="ux-phase7-fail-closed">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-gold">Fail closed</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{failClosed}</p>
        </div>
      </div>
      <div className="mt-4" data-testid="ux-phase7-recovery"><StatePanel detail={recovery} state="restricted" title="Safe unavailable-content recovery" /></div>
    </section>
  );
}

function Phase5DetailSplitPanel({ decisionSupport, objectLabel, objectState, pageJob, safetyBoundary, splitTaskId, taskId }: Phase5DetailSplitPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4" data-testid="ux-phase5-detail-split" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Phase 5 detail / split proof</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectLabel}</h2>
        </div>
        <Badge tone="gold">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-object-state">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Object state</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{objectState}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-decision-support">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Decision support</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{decisionSupport}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-drawer-boundary">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Drawer boundary</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Drawer-only context cannot approve, release, delete, export or mutate payload visibility. {safetyBoundary}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-page-job">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Page job</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{pageJob}</p>
        </div>
      </div>
    </section>
  );
}

function Phase4WorkbenchPanel({
  activeTask,
  blocker,
  context,
  primaryAction,
  queueLabel,
  safetyNote,
  taskId,
}: {
  activeTask: string;
  blocker: string;
  context: string;
  primaryAction: string;
  queueLabel: string;
  safetyNote: string;
  taskId: string;
}) {
  return (
    <section className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="ux-workbench-phase4" data-ux-workbench-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge tone="gold">{taskId}</Badge>
          <h3 className="mt-3 font-display text-2xl text-alphavest-ivory">Active task workbench</h3>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">One selected item, one guarded action rail and one explicit blocker. Queue visibility does not change release, export or client visibility state.</p>
        </div>
        <button className={primaryButtonClass} data-testid="ux-workbench-primary-cta" disabled type="button">{primaryAction}</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3" data-testid="ux-workbench-triad">
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-queue">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Queue</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{queueLabel}</p>
        </div>
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-active-context">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Active context</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{activeTask}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{context}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-workbench-action-rail">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-red">Action rail</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{primaryAction}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-blocker">{blocker}</p>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-safety-note">{safetyNote}</p>
    </section>
  );
}

function PortalPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="019">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase5DetailSplitPanel decisionSupport="Client projection stays separated from internal review and release gates." objectLabel="Client home projection split" objectState="Released client-safe state only" pageJob="Client portal shows released context without becoming mobile, evidence or decision detail." safetyBoundary="Client projection cannot expose internal payloads." splitTaskId="UX-PAGE-SPLIT-007" taskId="UX-PAGE-SPLIT-007" />
      <Phase7ClientProjectionPanel allowedFields="clientSummary, releasedAt, redacted document title and status only" failClosed="Unavailable content explains release, evidence and permission blockers without showing the hidden object." forbiddenFields="No internal payload, manual override, unreleased evidence, AI Draft, compliance notes or storage keys." recovery="The client sees safe next steps only: wait for release, upload requested evidence or contact the advisor through controlled support." routeLabel="Client home released projection" taskId="UX-CLIENT-PROJECTION-001" visibilityEngineOutput="DEMO_CLIENT_SAFE_PROJECTION or DEMO_CLIENT_VISIBILITY_FAIL_CLOSED" />
      <UxHubPage pageId="019" />
    </ClientShell>
  );
}

function PortalPageContent({ title }: { title: string }) {
  const metrics = useDbtfDashboardMetrics();
  const readiness = metrics?.readiness ?? clientWorkspace.readiness;
  const evidenceCoverage = metrics?.evidenceCoverage ?? clientWorkspace.evidenceComplete;
  const metricCards = metrics?.cards ?? [
    { label: "DB readiness", tone: "green" as BadgeTone, value: `${clientWorkspace.readiness}%` },
    { label: "Documents linked", tone: "blue" as BadgeTone, value: "loading" },
    { label: "Open actions", tone: "gold" as BadgeTone, value: "loading" },
    { label: "Compliance pending", tone: "red" as BadgeTone, value: "loading" },
  ];

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <div>
            <p className="font-display text-3xl text-alphavest-ivory">Good morning, Alexandra.</p>
            <p className="mt-1 text-sm text-alphavest-muted">Here is your wealth governance dashboard.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>WealthOS Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 md:flex-row md:items-center">
                <ProgressRing label="DB" value={readiness} />
                <div className="min-w-0">
                  <p className="text-sm text-alphavest-muted">DB-derived readiness is</p>
                  <p className="mt-2 text-4xl font-semibold text-alphavest-gold">{readiness}<span className="text-xl text-alphavest-muted"> /100</span></p>
                  <p className="mt-3 text-sm leading-6 text-alphavest-muted">Computed from tenant-scoped documents, evidence, actions and compliance records.</p>
                </div>
              </CardContent>
            </Card>
            <ListCard count="5" icon={ClipboardCheck} items={portalActions} title="Open Actions" />
            <ListCard count="2" icon={CircleHelp} items={portalDecisions} title="Pending Decisions" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Missing Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-3">
              {missingDocuments.map((doc, index) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4" key={doc.title}>
                  <div className="flex items-center gap-3">
                    <IconTile tone={doc.tone}>
                      <FileText aria-hidden="true" className="size-5" />
                    </IconTile>
                    <div>
                      <p className="font-semibold text-alphavest-ivory">{doc.title}</p>
                      <p className="text-sm text-alphavest-muted">{doc.owner}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-alphavest-muted">{doc.requested}</span>
                    <button
                      className="font-semibold text-alphavest-gold"
                      data-testid={index === 0 ? "j04-portal-upload" : index === 1 ? "j09-portal-upload" : undefined}
                      onClick={() => {
                        if (index === 1) {
                          void runScreencastDemoAction("j09.portalUpload", "/client/profile");
                          return;
                        }
                        void runScreencastDemoAction("j04.portalUpload", "/documents");
                      }}
                      type="button"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Evidence Status</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-5">
                <ProgressRing label="DB" size="small" value={evidenceCoverage} />
                <div className="space-y-2 text-sm text-alphavest-muted">
                  {metricCards.map((card) => (
                    <p className="break-words" key={card.label}><span className={card.tone === "red" ? "text-alphavest-red" : card.tone === "gold" ? "text-alphavest-gold" : "text-alphavest-green"}>●</span> {card.label} {card.value}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Governance Status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Structure", "Policies", "Compliance", "Meetings"].map((item, index) => (
                  <div className="flex items-center justify-between text-sm" key={item}>
                    <span className="flex items-center gap-2 text-alphavest-ivory"><CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />{item}</span>
                    <span className={index === 3 ? "text-alphavest-gold" : "text-alphavest-muted"}>{index === 3 ? "Action needed" : "On track"}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Your Next Steps</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Review open actions", "Upload missing documents", "Review pending decisions"].map((item) => (
                  <button className="flex w-full items-center justify-between rounded-md border border-alphavest-border/60 p-3 text-left text-sm text-alphavest-muted" key={item} type="button">
                    <span>{item}</span>
                    <ChevronRight aria-hidden="true" className="size-4 text-alphavest-gold" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
          <SafeClientBanner>Your privacy and security are our priority. No unapproved advice reaches the client.</SafeClientBanner>
          <ScfP07P09TrustPanel mode="visibility" />
        </section>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Advisor Messages</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
                <p className="font-semibold text-alphavest-ivory">Jordan Mitchell, CFA</p>
                <p className="mt-3 text-sm leading-6 text-alphavest-muted">Your Q2 wealth report is ready for review. Please let me know if you would like to schedule time to discuss.</p>
                <button className={secondaryButtonClass + " mt-4"} type="button">View message</button>
              </div>
              {["Estate plan documents updated", "Tax planning opportunities", "Market update: Q2 2024"].map((item) => (
                <div className="flex items-center justify-between border-b border-alphavest-border/50 pb-3 text-sm text-alphavest-muted last:border-0" key={item}>
                  <span>{item}</span>
                  <span>May</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>At a Glance</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Household", clientWorkspace.household],
                ["Advisor", clientWorkspace.advisor],
                ["Custodian", clientWorkspace.custodian],
                ["Last login", "Today, 8:24 AM"]
              ].map(([label, value]) => (
                <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-3 last:border-0" key={label}>
                  <span className="text-alphavest-muted">{label}</span>
                  <span className="text-right font-semibold text-alphavest-ivory">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

function ListCard({ count, icon: Icon, items, title }: { count: string; icon: LucideIcon; items: Array<{ label: string; meta: string }>; title: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3"><Icon aria-hidden="true" className="size-5 text-alphavest-gold" />{title}</CardTitle>
        <Badge tone="gold">{count}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div className="border-b border-alphavest-border/45 pb-3 last:border-0" key={item.label}>
            <p className="text-sm font-semibold text-alphavest-ivory">{item.label}</p>
            <p className="mt-1 text-xs text-alphavest-muted">{item.meta}</p>
          </div>
        ))}
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-alphavest-gold" type="button">
          View all <ArrowRightIcon />
        </button>
      </CardContent>
    </Card>
  );
}

function ArrowRightIcon() {
  return <ChevronRight aria-hidden="true" className="size-4" />;
}

function MobileHomePage({ title }: { title: string }) {
  return (
    <DemoSessionProvider>
      <main className="av-surface av-surface-mobile px-4 py-5">
        <ScreenTitle>{title}</ScreenTitle>
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[41rem] flex-col border-x border-alphavest-border/60 bg-alphavest-midnight/84 px-5 py-6 shadow-2xl sm:px-6 sm:py-7">
          <UxHubPage pageId="020" />
        </div>
      </main>
    </DemoSessionProvider>
  );
}

function ClientProfilePage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="021">
      <ClientProfilePageContent title={title} />
    </ClientShell>
  );
}

function ClientProfilePageContent({ title }: { title: string }) {
  const { loadState, profile, save } = useDbtfClientProfile();
  const family = useDbtfFamilyMembers();
  const [form, setForm] = useState<ProfileFormState>({
    countryOfResidence: "",
    firstName: "",
    lastName: "",
    phone: "",
    relationshipLabel: "",
  });
  const [message, setMessage] = useState("Loaded from UserProfile DB row.");
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      queueMicrotask(() => {
        setForm({
          countryOfResidence: profile.countryOfResidence,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          relationshipLabel: profile.relationshipLabel,
        });
        setIssues([]);
        setMessage("Loaded from UserProfile DB row.");
      });
    }
  }, [profile]);

  async function submit(action: "save_draft" | "submit_review") {
    setSaving(true);
    setIssues([]);

    try {
      const savedProfile = await save(form, action);
      setMessage(action === "submit_review" ? `Submitted ${savedProfile.firstName} ${savedProfile.lastName} for review.` : `Saved ${savedProfile.firstName} ${savedProfile.lastName} to the DB.`);
    } catch (error) {
      setIssues(error instanceof Error ? error.message.split(", ").filter(Boolean) : ["profile_save_failed"]);
      setMessage("Profile save failed closed. No client release was changed.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const completedSections = [form.firstName, form.lastName, form.countryOfResidence, form.relationshipLabel].filter(Boolean).length;

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={
            <div className="flex flex-wrap gap-3">
              <button className={secondaryButtonClass} data-testid="dbtf-profile-save-draft" disabled={saving || loadState !== "ready"} onClick={() => { void submit("save_draft"); }} type="button">
                Save Draft
              </button>
              <button className={primaryButtonClass} data-testid="j09-submit-profile" disabled={saving || loadState !== "ready"} onClick={() => { void submit("submit_review"); }} type="button">
                <Send aria-hidden="true" className="size-4" />Submit for Review
              </button>
            </div>
          }
          subtitle="Maintain the family profile, goals and governance preferences that guide our partnership."
          title={title}
        />
        <StatePanel detail={message} state={issues.length > 0 || loadState === "error" ? "restricted" : "success"} title={loadState === "loading" ? "Loading DB profile" : issues.length > 0 ? "Profile validation failed" : "DB-backed profile"} />
        {issues.length > 0 ? <SafeClientBanner>{issues.join(", ")}</SafeClientBanner> : null}
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.75fr_0.72fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Family Profile</CardTitle>
              <Badge tone="blue">{profile?.source ?? "UserProfile"}</Badge>
            </CardHeader>
            <CardContent className="grid gap-3">
              <FormField label="First Name" onChange={(value) => updateField("firstName", value)} required value={form.firstName} />
              <FormField label="Last Name" onChange={(value) => updateField("lastName", value)} required value={form.lastName} />
              <FormField label="Relationship" onChange={(value) => updateField("relationshipLabel", value)} required value={form.relationshipLabel} />
              <FormField label="Country of Residence" onChange={(value) => updateField("countryOfResidence", value)} required value={form.countryOfResidence} />
              <FormField label="Phone" onChange={(value) => updateField("phone", value)} value={form.phone} />
              <div className="md:col-span-3">
                <FieldBox label="Persistence" value={`Reloaded ${profile?.updatedAt ? formatUploadDate(profile.updatedAt) : "from DB"}; save writes to UserProfile and audit log.`} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Governance Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {governancePreferences.map((item) => (
                <div className="flex items-center gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={item.title}>
                  <IconTile><Shield aria-hidden="true" className="size-4" /></IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-alphavest-ivory">{item.title}</p>
                    <p className="text-sm text-alphavest-muted">{item.detail}</p>
                  </div>
                  <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Review Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Profile Status", loadState === "ready" ? "DB-backed draft" : loadState],
                ["Sections Completed", `${completedSections} / 4`],
                ["Validation Issues", String(issues.length)],
                ["Family Rows", String(family.rows.length)],
                ["Last Reload", profile?.updatedAt ? formatUploadDate(profile.updatedAt) : "n/a"]
              ].map(([label, value]) => (
                <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-3 last:border-0" key={label}>
                  <span className="text-alphavest-muted">{label}</span>
                  <span className="font-semibold text-alphavest-ivory">{value}</span>
                </div>
              ))}
              <SafeClientBanner>Profile edits require audit logging before they can be accepted.</SafeClientBanner>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Key Family Members</CardTitle><button className={secondaryButtonClass} type="button">Manage</button></CardHeader>
          <CardContent><DataTable columns={familySummaryColumns} emptyMessage="No DB-backed family members loaded." getRowId={(row) => row.id} rows={family.rows.slice(0, 4)} /></CardContent>
        </Card>
      </div>
    </>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
      <p className="text-xs text-alphavest-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}

function FormField({ className, label, onChange, required = false, value }: { className?: string; label: string; onChange: (value: string) => void; required?: boolean; value: string }) {
  return (
    <label className={cn("grid min-w-0 gap-1 text-sm", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{label}{required ? " *" : ""}</span>
      <input
        className="h-11 w-full min-w-0 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

const familySummaryColumns: Array<DataTableColumn<FamilyMemberTableRow>> = [
  { key: "name", header: "Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
  { key: "role", header: "Role", render: (row) => row.role },
  { key: "relationship", header: "Relationship", render: (row) => row.relationship },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
];

function FamilyMembersPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="022">
      <FamilyMembersPageContent title={title} />
    </ClientShell>
  );
}

function FamilyMembersPageContent({ title }: { title: string }) {
  const { loadState, rows, save } = useDbtfFamilyMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof FamilyMemberTableRow>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [familyForm, setFamilyForm] = useState<FamilyMemberFormState>({
    displayName: "",
    relationshipType: "",
    taxResidency: "",
  });
  const [formMessage, setFormMessage] = useState("Select a DB-backed member to edit allowed fields.");
  const [formIssues, setFormIssues] = useState<string[]>([]);
  const [savingFamilyMember, setSavingFamilyMember] = useState(false);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredRows = sortByKey(
    rows.filter((row) =>
      normalizedSearchTerm.length === 0
        ? true
        : [row.name, row.relationship, row.role, row.governance, row.status, row.sensitivity].some((value) =>
            value.toLowerCase().includes(normalizedSearchTerm),
          ),
    ),
    sortKey,
    sortDirection,
  );
  const selected = filteredRows[0];

  useEffect(() => {
    if (selected) {
      queueMicrotask(() => {
        setFamilyForm({
          displayName: selected.name,
          relationshipType: selected.relationship,
          taxResidency: selected.taxResidency,
        });
        setFormIssues([]);
        setFormMessage("Loaded from FamilyMember DB row.");
      });
    }
  }, [selected]);

  function toggleSort(key: string) {
    const nextKey = key as keyof FamilyMemberTableRow;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
  }

  async function saveSelectedMember() {
    if (!selected) {
      return;
    }

    setSavingFamilyMember(true);
    setFormIssues([]);

    try {
      await save(selected.id, familyForm);
      setFormMessage(`Saved ${familyForm.displayName} and reloaded tenant-scoped family rows.`);
    } catch (error) {
      setFormIssues(error instanceof Error ? error.message.split(", ").filter(Boolean) : ["family_member_save_failed"]);
      setFormMessage("Family member save failed closed. No client release was changed.");
    } finally {
      setSavingFamilyMember(false);
    }
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runScreencastDemoAction("j09.openFamilyMap", "/relationships"); }} type="button"><Network aria-hidden="true" className="size-4" />Family Map</button><button className={primaryButtonClass} data-testid="j09-add-member" onClick={() => { void runScreencastDemoAction("j09.addMember"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Member</button></div>}
          count={String(rows.length)}
          subtitle="Maintain family member profiles, relationships and governance roles."
          title={title}
        />
        <SafeClientBanner>Family rows are loaded from tenant-scoped seeded DB records. Allowed edits persist to FamilyMember and create audit events.</SafeClientBanner>
        <div className="grid gap-5 2xl:grid-cols-[0.9fr_1.15fr]">
          <Card>
            <CardHeader className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search DB-backed members"
                  value={searchTerm}
                />
              </div>
              <div className="flex h-11 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Tenant scoped
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={familyMemberColumns}
                emptyMessage={loadState === "error" ? "Family members could not be loaded from the DB." : "No DB-backed family members match this search."}
                getRowId={(row) => row.id}
                onSortChange={toggleSort}
                rows={filteredRows}
                sortDirection={sortDirection}
                sortKey={String(sortKey)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-alphavest-border bg-alphavest-gold/15 text-xl font-semibold text-alphavest-gold">
                  {(selected?.name ?? "DB").split(" ").map((part) => part.charAt(0)).slice(0, 2).join("")}
                </span>
                <div>
                  <CardTitle>{selected?.name ?? "No DB-backed member selected"}</CardTitle>
                  <CardDescription>{selected ? `${selected.year} · ${selected.relationship} · ${selected.role}` : "Tenant-scoped family rows are empty."}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected ? <Badge tone={toneFor(selected.status)}>{selected.status}</Badge> : null}
                    {selected ? <Badge tone="blue">{selected.sensitivity}</Badge> : null}
                  </div>
                </div>
              </div>
              <button className="text-alphavest-muted" type="button"><X aria-hidden="true" className="size-5" /></button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <FormField label="Display Name" onChange={(value) => setFamilyForm((current) => ({ ...current, displayName: value }))} required value={familyForm.displayName} />
                <FormField label="Relationship" onChange={(value) => setFamilyForm((current) => ({ ...current, relationshipType: value }))} required value={familyForm.relationshipType} />
                <FormField label="Tax Residency" onChange={(value) => setFamilyForm((current) => ({ ...current, taxResidency: value }))} required value={familyForm.taxResidency} />
                <FieldBox label="Source" value="FamilyMember DB row" />
                <FieldBox label="Sensitivity" value={selected?.sensitivity ?? "n/a"} />
                <FieldBox label="Status" value={selected?.status ?? "n/a"} />
              </div>
              <StatePanel detail={formIssues.length > 0 ? formIssues.join(", ") : formMessage} state={formIssues.length > 0 ? "restricted" : "success"} title="DB-backed family edit" />
              <div className="flex justify-end gap-3">
                <button className={secondaryButtonClass} onClick={() => selected && setFamilyForm({ displayName: selected.name, relationshipType: selected.relationship, taxResidency: selected.taxResidency })} type="button">Reset</button>
                <button className={primaryButtonClass} data-testid="j09-save-family-changes" disabled={!selected || savingFamilyMember} onClick={() => { void saveSelectedMember(); }} type="button">Save Changes</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

const familyMemberColumns: Array<DataTableColumn<FamilyMemberTableRow>> = [
  { key: "name", header: "Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}<span className="ml-2 text-xs text-alphavest-muted">{row.year}</span></span>, sortable: true },
  { key: "role", header: "Family Role", render: (row) => <Badge tone="blue">{row.role}</Badge>, sortable: true },
  { key: "relationship", header: "Relationship", render: (row) => row.relationship, sortable: true },
  { key: "governance", header: "Governance", render: (row) => row.governance },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true }
];

function RelationshipsPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="023">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><button className={secondaryButtonClass} type="button">Auto Layout</button><button className={secondaryButtonClass} type="button">Fit View</button><button className={primaryButtonClass} data-testid="j09-add-relationship" onClick={() => { void runScreencastDemoAction("j09.addRelationship"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add</button></div>}
          subtitle="Validate relationship edges, evidence and conflicts across people, entities and advisors."
          title={title}
        />
        <div className="grid gap-5 2xl:grid-cols-[1fr_26rem]">
          <Card>
            <CardContent className="p-0">
              <div className="hidden h-[30rem] overflow-hidden rounded-t-md border-b border-alphavest-border bg-[radial-gradient(circle_at_center,rgba(90,167,216,0.08),transparent_30rem)] md:relative md:block">
                {relationshipNodes.map((node) => (
                  <div
                    className={cn(
                      "absolute w-44 rounded-md border p-3 shadow-lg",
                      node.state === "selected" && "border-alphavest-gold bg-alphavest-gold/12",
                      node.state === "purple" && "border-violet-400/55 bg-violet-400/12",
                      node.state === "green" && "border-alphavest-green/50 bg-alphavest-green/10",
                      node.state === "red" && "border-alphavest-red/50 bg-alphavest-red/10",
                      node.state === "blue" && "border-alphavest-blue/50 bg-alphavest-blue/10",
                      node.state === "muted" && "border-alphavest-border bg-alphavest-charcoal/80"
                    )}
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <p className="text-sm font-semibold text-alphavest-ivory">{node.label}</p>
                    <p className="text-xs text-alphavest-muted">{node.detail}</p>
                  </div>
                ))}
                <svg className="absolute inset-0 -z-0 size-full opacity-70" aria-hidden="true">
                  <line x1="28%" y1="18%" x2="38%" y2="16%" stroke="#aeb8c4" />
                  <line x1="50%" y1="16%" x2="62%" y2="16%" stroke="#d7a64b" />
                  <line x1="46%" y1="23%" x2="44%" y2="42%" stroke="#aeb8c4" />
                  <line x1="70%" y1="21%" x2="80%" y2="33%" stroke="#aeb8c4" strokeDasharray="4 4" />
                  <line x1="28%" y1="45%" x2="17%" y2="71%" stroke="#ef5b5b" strokeDasharray="5 5" />
                  <line x1="34%" y1="50%" x2="72%" y2="70%" stroke="#ef5b5b" strokeDasharray="5 5" />
                </svg>
              </div>
              <div className="grid gap-3 border-b border-alphavest-border p-4 md:hidden">
                {relationshipRows.slice(0, 5).map((row) => (
                  <article className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4" key={`${row.from}-${row.to}-mobile`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={toneFor(row.status)}>{row.status}</Badge>
                      <Badge tone="muted">{row.type}</Badge>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-alphavest-ivory">{row.from}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-alphavest-subtle">{row.relationship}</p>
                    <p className="mt-1 text-sm text-alphavest-muted">{row.to}</p>
                    <p className="mt-3 text-xs text-alphavest-subtle">Evidence: {row.evidence}</p>
                  </article>
                ))}
              </div>
              <div className="p-4">
                <DataTable columns={relationshipColumns} getRowId={(row) => `${row.from}-${row.to}`} rows={relationshipRows} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-alphavest-border bg-alphavest-gold/15 text-xl font-semibold text-alphavest-gold">DC</span>
                <div>
                  <CardTitle>David Chen</CardTitle>
                  <CardDescription>Principal · Active</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3">
                {[
                  ["Entity Type", "Individual"],
                  ["Date of Birth", "May 14, 1972"],
                  ["Ownership", "-"],
                  ["Role", "Principal"],
                  ["Status", "Active"]
                ].map(([label, value]) => <FieldBox key={label} label={label} value={value} />)}
              </div>
              <Card className="border-alphavest-border/60">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-alphavest-ivory">Evidence Summary</p>
                    <p className="text-sm text-alphavest-muted">4 of 6</p>
                  </div>
                  {["Government ID - Verified", "Marriage Certificate - Verified", "Trust Agreement - Conflict", "POA Document - Missing"].map((item) => (
                    <div className="flex justify-between border-b border-alphavest-border/45 py-2 text-sm last:border-0" key={item}>
                      <span className="text-alphavest-muted">{item.split(" - ")[0]}</span>
                      <Badge tone={toneFor(item)}>{item.split(" - ")[1]}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientShell>
  );
}

const relationshipColumns: Array<DataTableColumn<(typeof relationshipRows)[number]>> = [
  { key: "from", header: "From", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.from}</span> },
  { key: "relationship", header: "Relationship", render: (row) => row.relationship },
  { key: "to", header: "To", render: (row) => row.to },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "evidence", header: "Evidence", render: (row) => row.evidence },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
];

function EntitiesPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="024">
      <ScreenTitle>{title}</ScreenTitle>
      <UxHubPage pageId="024" />
    </ClientShell>
  );
}

function EntitiesPageContent({ title }: { title: string }) {
  const { loadState, rows } = useDbtfEntities();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof EntityTableRow>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const typeOptions = Array.from(new Set(rows.map((row) => row.type))).sort();
  const jurisdictionOptions = Array.from(new Set(rows.map((row) => row.jurisdiction))).sort();
  const riskOptions = Array.from(new Set(rows.map((row) => row.risk))).sort();
  const filteredRows = sortByKey(
    rows.filter((row) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [row.name, row.type, row.jurisdiction, row.ownership, row.missingDocs, row.risk, row.status].some((value) =>
          value.toLowerCase().includes(normalizedSearchTerm),
        );
      const matchesType = typeFilter === "all" || row.type === typeFilter;
      const matchesJurisdiction = jurisdictionFilter === "all" || row.jurisdiction === jurisdictionFilter;
      const matchesRisk = riskFilter === "all" || row.risk === riskFilter;

      return matchesSearch && matchesType && matchesJurisdiction && matchesRisk;
    }),
    sortKey,
    sortDirection,
  );

  function toggleSort(key: string) {
    const nextKey = key as keyof EntityTableRow;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={<button className={primaryButtonClass} data-testid="j05-create-entity" onClick={() => { void runScreencastDemoAction("j05.createEntity", "/entities/new"); }} type="button"><Plus aria-hidden="true" className="size-4" />Create Entity</button>}
          count={String(rows.length)}
          subtitle="View and manage entities across organizational and investment structures."
          title={title}
        />
        <Card>
          <CardHeader className="grid gap-3 xl:grid-cols-[1fr_auto]">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search DB-backed entities..."
                  value={searchTerm}
                />
              </div>
              <DbtfSelect label="All Types" onChange={setTypeFilter} options={typeOptions} value={typeFilter} />
              <DbtfSelect label="All Jurisdictions" onChange={setJurisdictionFilter} options={jurisdictionOptions} value={jurisdictionFilter} />
              <DbtfSelect label="All Risk" onChange={setRiskFilter} options={riskOptions} value={riskFilter} />
            </div>
            <div className="flex h-11 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Tenant scoped
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-5">
              <MetricCard detail="Tenant DB rows" label="Entities" value={String(rows.length)} />
              <MetricCard detail="DB-derived current filter" label="Visible" value={String(filteredRows.length)} />
              <MetricCard detail="Seeded high-risk rows" label="High Risk" status="FAILED" value={String(rows.filter((row) => row.risk.toLowerCase().includes("high")).length)} />
              <MetricCard detail="Rows needing evidence" label="Evidence" status="PENDING" value={String(rows.filter((row) => row.missingDocs !== "All good").length)} />
              <MetricCard detail="No static entity arrays" label="Source" status="ACTIVE" value="DB" />
            </div>
            <DataTable
              columns={entityColumns}
              emptyMessage={loadState === "error" ? "Entities could not be loaded from the DB." : "No DB-backed entities match this search and filter set."}
              getRowId={(row) => row.id}
              onSortChange={toggleSort}
              rows={filteredRows}
              sortDirection={sortDirection}
              sortKey={String(sortKey)}
            />
          </CardContent>
        </Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <StatePanel detail="Create your first entity to begin building your structure." state="empty" title="No entities found" />
          <StatePanel detail="Please wait while entity records are prepared." state="loading" title="Loading entities" />
          <StatePanel detail="You do not have permission to view restricted entities." state="restricted" title="Access restricted" />
        </div>
      </div>
    </>
  );
}

function DbtfSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-alphavest-muted">
      <span>{label}</span>
      <select
        className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm font-normal text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="all">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DocumentFilterSelect({
  label,
  onChange,
  options,
  testId,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  testId: string;
  value: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-alphavest-muted">
      <span>{label}</span>
      <select
        className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm font-normal text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
        data-testid={testId}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={value}
      >
        <option value="all">All {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const entityColumns: Array<DataTableColumn<EntityTableRow>> = [
  { key: "name", header: "Entity", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span>, sortable: true },
  { key: "type", header: "Type", render: (row) => <Badge>{row.type}</Badge>, sortable: true },
  { key: "jurisdiction", header: "Jurisdiction", render: (row) => row.jurisdiction, sortable: true },
  { key: "ownership", header: "Ownership", render: (row) => row.ownership },
  { key: "docs", header: "Missing Documents", render: (row) => <Badge tone={toneFor(row.missingDocs)}>{row.missingDocs}</Badge> },
  { key: "risk", header: "Risk", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge>, sortable: true }
];

function CreateEntityPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="025">
      <CreateEntityPageContent title={title} />
    </ClientShell>
  );
}

function CreateEntityPageContent({ title }: { title: string }) {
  const { session } = useDemoSession();
  const [form, setForm] = useState<EntityWizardFormState>({
    entityType: "COMPANY",
    jurisdiction: "",
    name: "",
    ownerSummary: "",
    registrationNumber: "",
    riskRating: "Medium",
  });
  const [wizardStep, setWizardStep] = useState(0);
  const [message, setMessage] = useState("Draft fields are not persisted until Save Draft or Submit is pressed.");
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const completedRequired = [form.entityType, form.name, form.jurisdiction].filter(Boolean).length;
  const progress = Math.max(18, Math.round((completedRequired / 4) * 100));
  const steps = ["Entity Type", "Core Details", "Review"].map((label, index) => ({
    label,
    status: index < wizardStep ? "complete" as const : index === wizardStep ? "current" as const : "upcoming" as const,
  }));

  function updateField(key: keyof EntityWizardFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveEntity(action: "save_draft" | "submit") {
    setSaving(true);
    setIssues([]);

    try {
      const response = await fetch("/api/entities", {
        body: JSON.stringify({
          ...form,
          action,
          roleKey: session.role.key,
          tenantSlug: session.tenant.slug,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body = (await response.json()) as { issues?: string[]; result?: { entity?: { id: string; name: string; status: string } } };

      if (!response.ok || !body.result?.entity) {
        throw new Error(body.issues?.join(", ") || "entity_wizard_save_failed");
      }

      setMessage(`${body.result.entity.name} saved as ${body.result.entity.status}. Entity rows will reload from the DB on /entities.`);
      setWizardStep(action === "submit" ? 2 : Math.max(wizardStep, 1));
    } catch (error) {
      setIssues(error instanceof Error ? error.message.split(", ").filter(Boolean) : ["entity_wizard_save_failed"]);
      setMessage("Entity wizard failed closed. No record was persisted.");
    } finally {
      setSaving(false);
    }
  }

  function goNext() {
    const nextIssues = [
      ...(form.entityType ? [] : ["valid_entity_type_required"]),
      ...(form.name ? [] : ["legal_name_required"]),
      ...(form.jurisdiction ? [] : ["jurisdiction_required"]),
    ];

    if (nextIssues.length > 0) {
      setIssues(nextIssues);
      setMessage("Wizard cannot continue until required DB fields are present.");
      return;
    }

    setIssues([]);
    setMessage("Required fields complete. Save draft or submit to persist.");
    setWizardStep((current) => Math.min(2, current + 1));
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle subtitle="Build a new entity record with ownership, jurisdiction and supporting evidence." title={title} />
        <WizardStepper steps={steps} />
        <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Entity Details</CardTitle>
                <CardDescription>Provide the core information about the entity.</CardDescription>
              </div>
              <Badge tone="blue">Draft</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Entity Type *</span>
                <select
                  className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
                  onChange={(event) => updateField("entityType", event.target.value)}
                  value={form.entityType}
                >
                  {["TRUST", "COMPANY", "FOUNDATION", "PARTNERSHIP", "INDIVIDUAL", "FAMILY_OFFICE", "OTHER"].map((value) => (
                    <option key={value} value={value}>{labelFromEnum(value)}</option>
                  ))}
                </select>
              </label>
              <FormField label="Legal Name" onChange={(value) => updateField("name", value)} required value={form.name} />
              <FormField label="Jurisdiction" onChange={(value) => updateField("jurisdiction", value)} required value={form.jurisdiction} />
              <FormField label="Registration Number" onChange={(value) => updateField("registrationNumber", value)} value={form.registrationNumber} />
              <FormField label="Risk Rating" onChange={(value) => updateField("riskRating", value)} value={form.riskRating} />
              <label className="grid gap-1 text-sm md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Business Purpose / Owner Summary</span>
                <textarea
                  className="min-h-24 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
                  onChange={(event) => updateField("ownerSummary", event.target.value)}
                  value={form.ownerSummary}
                />
              </label>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Creation Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="h-2 rounded-full bg-alphavest-border">
                  <div className="h-2 rounded-full bg-alphavest-gold" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-alphavest-muted">{completedRequired} of 4 required DB fields completed</p>
              </div>
              {[
                form.entityType ? "Entity type selected" : "Entity type required",
                form.name ? "Legal name provided" : "Legal name required",
                form.jurisdiction ? "Jurisdiction provided" : "Jurisdiction required",
                form.registrationNumber ? "Registration ready for submit" : "Registration needed before submit",
                "Participants handled in later DBTF scope",
                "Evidence upload remains separate"
              ].map((item) => (
                <div className="flex items-center gap-2 text-sm" key={item}>
                  {item.includes("required") || item.includes("needed") || item.includes("later") || item.includes("separate") ? <AlertTriangle aria-hidden="true" className="size-4 text-alphavest-gold" /> : <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />}
                  <span className="text-alphavest-muted">{item}</span>
                </div>
              ))}
              <StatePanel detail={issues.length > 0 ? issues.join(", ") : message} state={issues.length > 0 ? "restricted" : "success"} title="DB-backed wizard lifecycle" />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button className={secondaryButtonClass} disabled={wizardStep === 0} onClick={() => setWizardStep((current) => Math.max(0, current - 1))} type="button">Back</button>
          <button className={secondaryButtonClass} data-testid="dbtf-save-entity-draft" disabled={saving} onClick={() => { void saveEntity("save_draft"); }} type="button">Save Draft</button>
          <button className={secondaryButtonClass} disabled={saving} onClick={goNext} type="button">Continue</button>
          <button className={primaryButtonClass} data-testid="j05-continue-entity" disabled={saving} onClick={() => { void saveEntity("submit"); }} type="button">Submit Entity</button>
        </div>
      </div>
    </>
  );
}

function EntityDetailPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="026">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase5DetailSplitPanel decisionSupport="Entity facts support object understanding without hiding destructive changes in drawers." objectLabel="Entity detail review" objectState="Entity active; permissioned family office context" pageJob="Entity detail explains one object and routes edits to explicit actions." safetyBoundary="Entity drawers cannot change release, advice or visibility state." splitTaskId="UX-PAGE-SPLIT-007" taskId="UX-DETAIL-002" />
      <div className="space-y-5">
        <Card>
          <CardContent className="grid gap-5 p-5 xl:grid-cols-[1fr_24rem]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <IconTile><Building2 aria-hidden="true" className="size-8" /></IconTile>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Entity</p>
                <h1 className="font-display text-4xl text-alphavest-ivory">{entityDetail.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="green">Active</Badge>
                  <Badge>Private</Badge>
                  <Badge>ID: ENT-000482</Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <button className={secondaryButtonClass} type="button">More Actions</button>
                <button className={primaryButtonClass} data-testid="j05-edit-entity" onClick={() => { void runScreencastDemoAction("j05.editEntity", "/wealth-map?state=drawer"); }} type="button">Edit Entity</button>
              </div>
            </div>
            <StatePanel detail="This entity is in good standing and compliant. Last review: Apr 18, 2025." state="empty" title="Active" />
          </CardContent>
        </Card>
        <div className="grid gap-5 xl:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Participants</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {entityParticipants.map((item) => (
                <div className="flex items-center justify-between border-b border-alphavest-border/45 pb-3 last:border-0" key={item.name}>
                  <div>
                    <p className="font-semibold text-alphavest-ivory">{item.name}</p>
                    <p className="text-sm text-alphavest-muted">{item.access}</p>
                  </div>
                  <Badge tone="gold">{item.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Assets Summary</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-5">
              <ProgressRing label="" size="small" value={76} />
              <div className="space-y-2 text-sm">
                <p className="font-display text-3xl text-alphavest-ivory">{entityDetail.value}</p>
                <p className="text-alphavest-green">{entityDetail.dayChange}</p>
                {["Equities 49.0%", "Fixed Income 25.3%", "Alternatives 13.8%", "Cash 11.9%"].map((item) => <p className="text-alphavest-muted" key={item}>{item}</p>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Review and sign updated Trust Agreement", "Provide beneficiary tax information", "Annual compliance review"].map((item, index) => (
                <div className="flex items-center justify-between border-b border-alphavest-border/45 pb-3 last:border-0" key={item}>
                  <span className="text-sm text-alphavest-muted">{item}</span>
                  <Badge tone={index === 0 ? "red" : index === 1 ? "gold" : "green"}>{index === 0 ? "Overdue" : index === 1 ? "Request" : "Done"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {entityDocuments.map((item) => (
                <div className="flex justify-between border-b border-alphavest-border/45 pb-3 last:border-0" key={item.name}>
                  <span className="text-sm font-semibold text-alphavest-ivory">{item.name}</span>
                  <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Entity Details</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                ["Entity Type", entityDetail.type],
                ["Jurisdiction", entityDetail.jurisdiction],
                ["Inception Date", entityDetail.inception],
                ["Tax ID", entityDetail.taxId],
                ["Primary Advisor", entityDetail.advisor],
                ["Data Sensitivity", "Private"]
              ].map(([label, value]) => <FieldBox key={label} label={label} value={value} />)}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientShell>
  );
}

function DocumentsPageContent({ title }: { title: string }) {
  const { session } = useDemoSession();
  const { documents, loadState } = usePersistedUploadDocuments();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sensitivityFilter, setSensitivityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof DocumentTableRow>("updated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const persistedRows = toDocumentRows(documents, session.tenant.displayName);
  const rows: DocumentTableRow[] = persistedRows;
  const typeOptions = Array.from(new Set(rows.map((row) => row.type))).sort();
  const statusOptions = Array.from(new Set(rows.map((row) => row.status))).sort();
  const sensitivityOptions = Array.from(new Set(rows.map((row) => row.sensitivity))).sort();
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredRows = sortByKey(
    rows.filter((row) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [row.entity, row.name, row.sensitivity, row.status, row.type, row.updated].some((value) =>
          value.toLowerCase().includes(normalizedSearchTerm),
        );
      const matchesType = typeFilter === "all" || row.type === typeFilter;
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesSensitivity = sensitivityFilter === "all" || row.sensitivity === sensitivityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesSensitivity;
    }),
    sortKey,
    sortDirection,
  );
  const scopedRowSummary =
    filteredRows.length === rows.length
      ? `${rows.length} scoped documents visible`
      : `${filteredRows.length} of ${rows.length} scoped documents visible`;

  function toggleSort(key: string) {
    const nextKey = key as keyof DocumentTableRow;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button"><Plus aria-hidden="true" className="size-4" />New Folder</button><button className={primaryButtonClass} data-testid="j04-open-upload-document" onClick={() => { void runScreencastDemoAction("j04.openUploadDocument", "/documents/upload"); }} type="button"><Upload aria-hidden="true" className="size-4" />Upload Document</button></div>} icon={Folder} subtitle="Securely manage and access client documents and evidence." title={title} />
        <ScfP04P06FlowPanel mode="evidence" />
        <ScfP10P14ClosurePanel mode="documents" />
        <Card>
          <CardHeader className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
                  data-testid="p10-document-search"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  placeholder="Search documents by name or keyword..."
                  value={searchTerm}
                />
              </div>
              <div className="flex h-11 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
                <ShieldCheck aria-hidden="true" className="size-4" />
                DB-backed saved view
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              <DocumentFilterSelect label="Types" onChange={setTypeFilter} options={typeOptions} testId="p10-document-type-filter" value={typeFilter} />
              <DocumentFilterSelect label="Statuses" onChange={setStatusFilter} options={statusOptions} testId="p10-document-status-filter" value={statusFilter} />
              <DocumentFilterSelect label="Sensitivities" onChange={setSensitivityFilter} options={sensitivityOptions} testId="p10-document-sensitivity-filter" value={sensitivityFilter} />
              <button aria-disabled="true" className="flex h-11 items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-sm text-alphavest-muted" type="button">
                <span className="truncate">Scoped Entities</span>
                <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-subtle" />
              </button>
              <button aria-disabled="true" className="flex h-11 items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-sm text-alphavest-muted" type="button">
                <span className="truncate">Accessible to Me</span>
                <Shield aria-hidden="true" className="size-4 text-alphavest-subtle" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-muted" data-testid="p10-document-filter-summary">
              {scopedRowSummary}. Hidden or cross-tenant rows are not disclosed.
            </div>
            <DataTable
              columns={documentColumns}
              emptyMessage={
                loadState === "error"
                  ? "Documents could not be loaded from the DB."
                  : "No scoped documents match the current search and filters."
              }
              getRowId={(row) => row.id}
              onSortChange={toggleSort}
              rows={filteredRows}
              sortDirection={sortDirection}
              sortKey={String(sortKey)}
            />
          </CardContent>
        </Card>
        <div className="grid gap-4 lg:grid-cols-4">
          <StatePanel detail="No documents match your current filters." state="empty" title="No Documents Found" />
          <StatePanel detail="Please wait while we fetch your documents." state="loading" title="Loading Documents" />
          <StatePanel detail="You do not have permission to view documents with the selected filters." state="restricted" title="Restricted Access" />
          <StatePanel detail="Drag and drop files or choose a supported format." state="empty" title="Upload Documents" />
        </div>
      </div>
    </>
  );
}

function DocumentsPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="027">
      <DocumentsPageContent title={title} />
      <Phase7ClientProjectionPanel allowedFields="request title, document type, redacted status and uploaded date only" failClosed="Unreleased evidence requests show safe unavailable state and never expose extraction or evidence internals." forbiddenFields="No unreleased evidence, extraction state, checksum, storage key, AI Draft or compliance notes." recovery="Client can upload requested evidence or wait for human review; sufficiency and release remain internal gates." routeLabel="Client evidence request projection" taskId="UX-CLIENT-PROJECTION-003" visibilityEngineOutput="DEMO_CLIENT_DOCUMENT_SAFE_PROJECTION or DEMO_CLIENT_DOCUMENT_FAIL_CLOSED" />
      <Phase5DetailSplitPanel decisionSupport="Document hub stays separate from review queue and evidence detail." objectLabel="Document workspace split" objectState="Document intake overview" pageJob="Documents page lists intake status and routes to queue/detail without acting as sufficiency proof." safetyBoundary="Document list context cannot mark evidence sufficient." splitTaskId="UX-PAGE-SPLIT-002" taskId="UX-PAGE-SPLIT-002" />
    </ClientShell>
  );
}

const documentColumns: Array<DataTableColumn<DocumentTableRow>> = [
  { key: "name", header: "Document Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span>, sortable: true },
  { key: "type", header: "Type", render: (row) => row.type, sortable: true },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true },
  { key: "sensitivity", header: "Sensitivity", render: (row) => <Badge tone={toneFor(row.sensitivity)}>{row.sensitivity}</Badge>, sortable: true },
  { key: "entity", header: "Linked Entity", render: (row) => row.entity },
  { key: "updated", header: "Updated", render: (row) => row.updated, sortable: true }
];

function DocumentUploadForm() {
  const { session } = useDemoSession();
  const { documents, loadState, refresh } = usePersistedUploadDocuments();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documentType, setDocumentType] = useState("financial_statement");
  const [subType, setSubType] = useState("Quarterly Report");
  const [linkedObjectLabel, setLinkedObjectLabel] = useState("AlphaVest Holdings, LLC");
  const [periodLabel, setPeriodLabel] = useState("Mar 31, 2024 (Q1 2024)");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Select a file to start document intake.");

  function selectFile(fileList: FileList | null) {
    const file = fileList?.item(0) ?? null;

    setSelectedFile(file);
    setUploadState("idle");
    setMessage(file ? `${file.name} selected.` : "Select a file to start document intake.");
  }

  async function submitUpload() {
    const fileForUpload = selectedFile ?? fileInputRef.current?.files?.item(0) ?? null;

    if (!fileForUpload) {
      setUploadState("error");
      setMessage("Choose a supported document before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("file", fileForUpload);
    formData.append("linkedObjectLabel", linkedObjectLabel);
    formData.append("notes", notes);
    formData.append("periodLabel", periodLabel);
    formData.append("roleKey", session.role.key);
    formData.append("sensitivity", "CONFIDENTIAL");
    formData.append("subType", subType);
    formData.append("tenantSlug", session.tenant.slug);

    setUploadState("uploading");
    setMessage("Uploading the file. Review routing, evidence sufficiency, release and client visibility remain locked until later gates pass.");

    try {
      const response = await fetch("/api/documents/upload", {
        body: formData,
        method: "POST",
      });
      const body = (await response.json()) as { error?: string; issues?: string[]; result?: { document?: PersistedUploadDocument } };

      if (!response.ok || !body.result?.document) {
        throw new Error(body.issues?.join(", ") || body.error || "Upload failed.");
      }

      setSelectedFile(null);
      setUploadState("success");
      setMessage(`${body.result.document.fileName} upload completed. Extraction review is the next step; evidence sufficiency, release and client visibility remain locked.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refresh();
    } catch (error) {
      setUploadState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  const latestDocument = documents[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr_22rem]">
      <Card>
        <CardHeader><CardTitle>Upload Source</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {["My Device", "Email Import", "Cloud Storage", "Scanner"].map((item, index) => (
              <button className={cn("h-12 rounded-md border text-sm", index === 0 ? "border-alphavest-gold bg-alphavest-gold/12 text-alphavest-gold" : "border-alphavest-border text-alphavest-muted")} disabled={index !== 0} key={item} type="button">{item}</button>
            ))}
          </div>
          <label
            className={cn(
              "grid min-h-48 cursor-pointer place-items-center rounded-md border border-dashed bg-alphavest-navy/35 p-6 text-center transition focus-within:border-alphavest-gold",
              dragActive ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border"
            )}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              selectFile(event.dataTransfer.files);
            }}
          >
            <input
              className="sr-only"
              data-testid="document-upload-file-input"
              onChange={(event) => selectFile(event.target.files)}
              onInput={(event) => selectFile(event.currentTarget.files)}
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.tif,.tiff,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,image/png,image/jpeg,image/tiff"
            />
            <div>
              <Upload aria-hidden="true" className="mx-auto size-10 text-alphavest-gold" />
              <p className="mt-3 font-semibold text-alphavest-ivory">Drag and drop files here</p>
              <p className="mt-1 text-sm text-alphavest-muted">Accepted formats: PDF, DOCX, XLSX, CSV, PNG, JPG, TIFF</p>
              <span className={secondaryButtonClass + " mt-4"}>Choose Files</span>
            </div>
          </label>
          {selectedFile ? (
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-alphavest-ivory">{selectedFile.name}</p>
                  <p className="text-sm text-alphavest-muted">{formatBytes(selectedFile.size)}</p>
                </div>
                <Badge tone="gold">Ready</Badge>
              </div>
            </div>
          ) : null}
          {uploadState === "error" ? (
            <div className="rounded-md border border-alphavest-red/40 bg-alphavest-red/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-semibold text-alphavest-ivory">Upload blocked</p><p className="text-sm text-alphavest-muted">{message}</p></div>
                <Badge tone="red">Review</Badge>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Document Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="grid gap-2 text-sm">
            <span className="text-alphavest-muted">Document Type</span>
            <select className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-alphavest-ivory outline-none focus:border-alphavest-gold" value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
              <option value="financial_statement">Financial Statement</option>
              <option value="trust_deed">Trust Deed</option>
              <option value="tax_residency_certificate">Tax Residency Certificate</option>
              <option value="kyc_document">KYC Document</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-alphavest-muted">Sub Type</span>
            <input className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setSubType(event.target.value)} value={subType} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-alphavest-muted">Link to Entity / Asset</span>
            <input className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setLinkedObjectLabel(event.target.value)} value={linkedObjectLabel} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-alphavest-muted">Period</span>
            <input className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setPeriodLabel(event.target.value)} value={periodLabel} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-alphavest-muted">Notes</span>
            <textarea className="min-h-20 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-alphavest-ivory outline-none focus:border-alphavest-gold" maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Add any notes about this document..." value={notes} />
          </label>
          <StatePanel detail="Your document will be scanned, validated and queued for human extraction review." state="loading" title="Extraction Pipeline" />
          <button className={primaryButtonClass + " w-full"} data-testid="real-upload-document" disabled={uploadState === "uploading"} onClick={() => { void submitUpload(); }} type="button"><Upload aria-hidden="true" className="size-4" />Upload for review</button>
          <button className={secondaryButtonClass + " w-full"} data-testid="j04-upload-document" onClick={() => { void runScreencastDemoAction("j04.uploadDocument", "/documents/review-queue"); }} type="button">Open extraction review</button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Upload Status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <StatePanel
            detail={message}
            state={uploadState === "error" ? "error" : uploadState === "success" ? "success" : "loading"}
            title={uploadState === "success" ? "Upload complete" : uploadState === "error" ? "Upload failed" : uploadState === "uploading" ? "Uploading" : "Ready"}
          />
          {uploadState === "error" ? (
            <button
              className={secondaryButtonClass + " w-full"}
              data-testid="retry-upload-document"
              disabled={!selectedFile}
              onClick={() => { void submitUpload(); }}
              type="button"
            >
              Retry Upload
            </button>
          ) : null}
          {latestDocument ? (
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <p className="text-sm font-semibold text-alphavest-ivory">{latestDocument.fileName ?? latestDocument.title}</p>
              <p className="mt-1 text-xs text-alphavest-muted">{latestDocument.fileSizeBytes ? formatBytes(latestDocument.fileSizeBytes) : "Size hidden"} · {labelFromEnum(latestDocument.status)}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Extraction: {latestDocument.extractionStatus ?? "pending"}</p>
            </div>
          ) : (
            <StatePanel detail={loadState === "error" ? "Uploads could not be loaded." : "No persisted uploads yet."} state={loadState === "error" ? "error" : "empty"} title="Recent Uploads" />
          )}
          <Link className={secondaryButtonClass + " w-full"} href="/documents">View All Documents</Link>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentUploadPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="028">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle subtitle="Securely upload documents to your AlphaVest workspace." title={title} />
        <SafeClientBanner>Document uploads are scoped to permitted client roles, entities and assets.</SafeClientBanner>
        <ScfP04P06FlowPanel mode="evidence" />
        <DocumentUploadForm />
      </div>
    </ClientShell>
  );
}

function ExtractionReviewActionPanel() {
  const { session } = useDemoSession();
  const { documents, loadState, refresh } = usePersistedUploadDocuments();
  const latestDocument = documents[0];
  const [notes, setNotes] = useState("Extraction checked against source file. Relevance, currentness and scope accepted for this document only.");
  const [reviewState, setReviewState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Review the latest upload, then link or accept evidence through the controlled review API.");

  async function submitReview(action: "mark_reviewed" | "accept_sufficiency") {
    if (!latestDocument || reviewState === "submitting") {
      return;
    }

    setReviewState("submitting");
    setMessage(action === "accept_sufficiency" ? "Checking scoped evidence sufficiency." : "Saving extraction review and evidence link.");

    try {
      const response = await fetch("/api/documents/review", {
        body: JSON.stringify({
          action,
          clientSafeAccepted: action === "accept_sufficiency",
          currentAccepted: action === "accept_sufficiency",
          documentId: latestDocument.id,
          notes,
          relevanceAccepted: action === "accept_sufficiency",
          roleKey: session.role.key,
          scopeAccepted: action === "accept_sufficiency",
          tenantSlug: session.tenant.slug,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body = (await response.json()) as { error?: string; issues?: string[]; reason?: string; result?: { evidenceStatus?: string; safety?: { evidenceSufficiency: boolean } } };

      if (!response.ok || !body.result) {
        throw new Error(body.issues?.join(", ") || body.reason || body.error || "Evidence review failed.");
      }

      setReviewState("success");
      setMessage(
        body.result.safety?.evidenceSufficiency
          ? "Evidence accepted for this scoped gate. Release, export and client visibility remain locked."
          : "Document reviewed and linked. Evidence remains review-gated and not client-visible.",
      );
      await refresh();
    } catch (error) {
      setReviewState("error");
      setMessage(error instanceof Error ? error.message : "Evidence review failed.");
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Review & Sufficiency</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {latestDocument ? (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
            <p className="text-sm font-semibold text-alphavest-ivory">{latestDocument.fileName}</p>
            <p className="mt-1 text-xs text-alphavest-muted">
              Document: {labelFromEnum(latestDocument.status)} · Evidence: {latestDocument.evidenceStatus ? labelFromEnum(latestDocument.evidenceStatus) : "Created"}
            </p>
            <p className="mt-2 text-xs text-alphavest-muted">Visibility: {latestDocument.evidenceVisibilityStatus ? labelFromEnum(latestDocument.evidenceVisibilityStatus) : "Internal Only"}</p>
          </div>
        ) : (
          <StatePanel
            detail={loadState === "loading" ? "Fetching uploaded documents." : "Upload a document before running review or sufficiency acceptance."}
            state={loadState === "error" ? "error" : "empty"}
            title={loadState === "error" ? "Uploads unavailable" : "No upload selected"}
          />
        )}
        <label className="grid gap-2 text-sm">
          <span className="text-alphavest-muted">Reviewer Notes</span>
          <textarea
            className="min-h-24 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-alphavest-ivory outline-none focus:border-alphavest-gold"
            maxLength={1000}
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </label>
        <StatePanel
          detail={message}
          state={reviewState === "error" ? "error" : reviewState === "success" ? "success" : "restricted"}
          title={reviewState === "success" ? "Review saved" : reviewState === "error" ? "Review blocked" : "Human review gate"}
        />
        <button
          className={secondaryButtonClass + " w-full"}
          data-testid="phase3-mark-reviewed"
          disabled={!latestDocument || reviewState === "submitting"}
          onClick={() => { void submitReview("mark_reviewed"); }}
          type="button"
        >
          Mark Reviewed & Link Evidence
        </button>
        <button
          className={primaryButtonClass + " w-full"}
          data-testid="phase3-accept-sufficiency"
          disabled={!latestDocument || reviewState === "submitting"}
          onClick={() => { void submitReview("accept_sufficiency"); }}
          type="button"
        >
          Run scoped sufficiency check
        </button>
      </CardContent>
    </Card>
  );
}

function ExtractionReviewPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="029">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase5DetailSplitPanel decisionSupport="Extraction review remains human review of draft fields, not final evidence." objectLabel="Document review queue split" objectState="Extraction draft needs human review" pageJob="Review queue resolves extraction work separately from document hub and evidence detail." safetyBoundary="Queue context cannot finalize sufficiency or release." splitTaskId="UX-PAGE-SPLIT-002" taskId="UX-PAGE-SPLIT-002" />
      <div className="space-y-5">
        <SectionTitle action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button">Save Draft</button><button className={primaryButtonClass} data-testid="j04-confirm-finalize" onClick={() => { void runScreencastDemoAction("j04.confirmFinalize", "/documents/:id/review"); }} type="button"><Check aria-hidden="true" className="size-4" />Confirm & Finalize</button></div>} subtitle="Review AI-extracted data. This is a draft and not final evidence." title={title} />
        <SafeClientBanner>AI Draft Mode: extracted data requires human review. Not final. Not evidence.</SafeClientBanner>
        <ScfP04P06FlowPanel mode="evidence" />
        <div className="grid gap-5 xl:grid-cols-[0.9fr_0.84fr_20rem]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>2024_Q4_Brokerage_Statement.pdf</CardTitle><Badge>Page 1 of 4</Badge></CardHeader>
            <CardContent>
              <div className="rounded-md bg-alphavest-ivory p-6 text-alphavest-navy">
                <p className="font-display text-2xl">Summit Securities</p>
                <p className="mt-4 text-sm">Account Statement · AlphaVest Family Office LLC</p>
                <div className="mt-5 space-y-2 text-sm">
                  {["Beginning Market Value $8,742,183.41", "Net Contributions $250,000.00", "Net Withdrawals $(125,000.00)", "Ending Market Value $9,899,640.19"].map((line) => (
                    <div className="flex justify-between border-b border-slate-300 pb-2" key={line}><span>{line.split(" $")[0]}</span><span>${line.split(" $")[1]}</span></div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((page) => <div className={cn("grid h-16 place-items-center rounded border bg-alphavest-ivory text-alphavest-navy", page === 1 ? "border-alphavest-gold" : "border-alphavest-border")} key={page}>{page}</div>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Extracted Fields <Badge className="ml-2">12 fields</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {extractionFields.map((section) => (
                <div key={section.section}>
                  <p className="mb-2 font-semibold text-alphavest-ivory">{section.section}</p>
                  <div className="space-y-2">
                    {section.fields.map(([label, value, confidence]) => (
                      <div className={cn("grid gap-2 rounded-md border p-3 md:grid-cols-[9rem_1fr_auto]", confidence === "Low" ? "border-alphavest-red/60" : "border-alphavest-border") } key={`${section.section}-${label}`}>
                        <span className="text-sm text-alphavest-muted">{label}</span>
                        <span className="text-sm font-semibold text-alphavest-ivory">{value}</span>
                        <Badge tone={toneFor(confidence)}>{confidence}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <StatePanel detail="Low confidence or errors must be resolved before finalizing." state="error" title="1 field needs attention" />
            </CardContent>
          </Card>
          <aside className="space-y-5">
            <Card><CardHeader><CardTitle>Extraction Status</CardTitle></CardHeader><CardContent className="flex items-center gap-5"><ProgressRing label="Confidence" size="small" value={83} /><div className="space-y-2 text-sm text-alphavest-muted"><p>High (9)</p><p>Medium (2)</p><p>Low (1)</p><p>Error (1)</p></div></CardContent></Card>
            <Card><CardHeader><CardTitle>Issues</CardTitle></CardHeader><CardContent className="space-y-3"><StatePanel detail="AI extracted value is inconsistent." state="error" title="Net Investment Change" /><StatePanel detail="Table structure could not be parsed. Please review manually." state="error" title="Page 2 - Table Detected" /></CardContent></Card>
            <ExtractionReviewActionPanel />
          </aside>
        </div>
      </div>
    </ClientShell>
  );
}

function VerificationPendingPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="030">
      <ScreenTitle>{title}</ScreenTitle>
      <Phase4WorkbenchPanel activeTask="Document DOC-118 selected for extraction review" blocker="Upload-created evidence is review-pending and cannot satisfy release gates." context="Reviewer checks extracted fields, source quality and linkage before evidence sufficiency." primaryAction="Mark extraction reviewed" queueLabel="Document review queue" safetyNote="UX-WORKBENCH-002: upload-only success remains separate from reviewed, linked and current evidence sufficiency." taskId="UX-WORKBENCH-002" />
      <Phase5DetailSplitPanel decisionSupport="Selected document state explains source quality, linkage and unresolved blockers before any next action." objectLabel="Document object review" objectState="Review pending; evidence sufficiency not proven" pageJob="Document detail supports one active object review without overloading the queue." safetyBoundary="Detail context cannot unlock release, export or client visibility." splitTaskId="UX-PAGE-SPLIT-002" taskId="UX-PAGE-SPLIT-002" />
      <div className="space-y-5">
        <SectionTitle action={<button className={secondaryButtonClass} type="button"><Download aria-hidden="true" className="size-4" />Download Summary</button>} icon={FileText} subtitle="Your submitted information is under human review. No final validation has been completed." title={title} />
        <StatePanel detail="A member of our operations team is reviewing your documents and information." state="loading" title="Under Human Review" />
        <div className="grid gap-5 xl:grid-cols-[1fr_28rem]">
          <section className="space-y-5">
            <Card>
              <CardHeader><CardTitle>Verification Summary</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <MetricCard detail="No final validation yet" label="Overall Status" status="PENDING" value="Pending" />
                <MetricCard detail="By Tue, May 27, 2025" label="Expected Review Time" status="SCHEDULED" value="2-3 Days" />
                <MetricCard detail="10:14 AM ET" label="Submitted On" status="PROCESSING" value="May 21, 2025" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Review Breakdown</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <MetricCard detail="Areas Under Review" label="Review" value="1 of 3" />
                <MetricCard detail="Needs Clarification" label="Clarification" status="FAILED" value="1" />
                <MetricCard detail="SLA Breach" label="SLA" status="PENDING" value="1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Evidence Submitted</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-5">
                {verificationEvidence.map((item) => (
                  <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-center" key={item.title}>
                    <File aria-hidden="true" className="mx-auto size-8 text-alphavest-muted" />
                    <p className="mt-3 text-sm font-semibold text-alphavest-ivory">{item.title}</p>
                    <p className="text-xs text-alphavest-muted">{item.date}</p>
                    <Badge className="mt-3" tone={toneFor(item.state)}>{item.state}</Badge>
                  </div>
                ))}
                <div className="grid min-h-32 place-items-center rounded-md border border-dashed border-alphavest-border text-center text-sm text-alphavest-muted">
                  <div><Plus aria-hidden="true" className="mx-auto mb-2 size-7" />Additional Evidence Upload</div>
                </div>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <Card><CardHeader><CardTitle>Human Review Status</CardTitle></CardHeader><CardContent><StatePanel detail="A verification specialist is reviewing your information and documentation." state="restricted" title="In Progress" /></CardContent></Card>
            <Card><CardHeader><CardTitle>SLA Status</CardTitle></CardHeader><CardContent><StatePanel detail="This item has exceeded the expected review time by 1 business day." state="error" title="SLA Breach" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Needs Clarification</CardTitle></CardHeader><CardContent><StatePanel detail="We need additional information to continue the review." state="restricted" title="1 Item" /><button className={secondaryButtonClass + " mt-4 w-full"} data-testid="j04-view-details" onClick={() => { void runScreencastDemoAction("j04.viewDetails"); }} type="button">View Details</button></CardContent></Card>
          </aside>
        </div>
        <SafeClientBanner>What happens next? No action is needed unless requested through your secure message center.</SafeClientBanner>
      </div>
    </ClientShell>
  );
}

export function ClientIntakeScreen({ route }: ClientIntakeScreenProps) {
  if (route.pageId === "019") {
    return <PortalPage title={route.title} />;
  }

  if (route.pageId === "020") {
    return <MobileHomePage title={route.title} />;
  }

  if (route.pageId === "021") {
    return <ClientProfilePage title={route.title} />;
  }

  if (route.pageId === "022") {
    return <FamilyMembersPage title={route.title} />;
  }

  if (route.pageId === "023") {
    return <RelationshipsPage title={route.title} />;
  }

  if (route.pageId === "024") {
    return <EntitiesPage title={route.title} />;
  }

  if (route.pageId === "025") {
    return <CreateEntityPage title={route.title} />;
  }

  if (route.pageId === "026") {
    return <EntityDetailPage title={route.title} />;
  }

  if (route.pageId === "027") {
    return <DocumentsPage title={route.title} />;
  }

  if (route.pageId === "028") {
    return <DocumentUploadPage title={route.title} />;
  }

  if (route.pageId === "029") {
    return <ExtractionReviewPage title={route.title} />;
  }

  return <VerificationPendingPage title={route.title} />;
}
