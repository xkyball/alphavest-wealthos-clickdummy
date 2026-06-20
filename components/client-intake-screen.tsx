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
  Filter,
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
  documentRows,
  entityDetail,
  entityDocuments,
  entityParticipants,
  entityRows,
  entityWizardSteps,
  extractionFields,
  familyMembers,
  governancePreferences,
  keyFamilyMembers,
  missingDocuments,
  mobilePriorityActions,
  portalActions,
  portalDecisions,
  profileFields,
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
  { href: "/portal", icon: LayoutDashboard, label: "Dashboard", pageIds: ["019"] },
  { href: "/client/profile", icon: UserRound, label: "Overview", pageIds: ["021"] },
  { href: "/client/family-members", icon: UsersRound, label: "Family & Entities", pageIds: ["022", "023", "024", "025", "026"] },
  { href: "/relationships", icon: Network, label: "Relationships", pageIds: ["023"] },
  { href: "/entities", icon: Landmark, label: "Entities", pageIds: ["024", "025", "026"] },
  { href: "/documents", icon: Folder, label: "Documents", pageIds: ["027", "028", "029", "030"] },
  { href: "/documents/upload", icon: Upload, label: "Upload", pageIds: ["028"] },
  { href: "/documents/extraction-review", icon: FileCheck2, label: "Extraction Review", pageIds: ["029"] },
  { href: "/documents/verification-pending", icon: Clock3, label: "Verification", pageIds: ["030"], count: 3 },
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
  extractionStatus: string | null;
  fileName: string;
  fileSizeBytes: number;
  id: string;
  mimeType: string;
  sensitivity: string;
  status: string;
  storageKey: string;
  title: string;
  uploadedAt: string;
};

type DocumentTableRow = {
  entity: string;
  name: string;
  sensitivity: string;
  status: string;
  type: string;
  updated: string;
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

function toDocumentRows(documents: PersistedUploadDocument[], entityLabel: string): DocumentTableRow[] {
  return documents.map((document) => ({
    entity: entityLabel,
    name: document.fileName,
    sensitivity: labelFromEnum(document.sensitivity),
    status: labelFromEnum(document.status),
    type: labelFromEnum(document.documentType),
    updated: formatUploadDate(document.uploadedAt),
  }));
}

function usePersistedUploadDocuments() {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const [documents, setDocuments] = useState<PersistedUploadDocument[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const refresh = useCallback(async () => {
    setLoadState("loading");
    setDocuments([]);

    try {
      const response = await fetch(`/api/documents?tenantSlug=${encodeURIComponent(tenantSlug)}`, { cache: "no-store" });
      const body = (await response.json()) as { documents?: PersistedUploadDocument[] };

      if (!response.ok) {
        throw new Error("Document reload failed.");
      }

      setDocuments(body.documents ?? []);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [tenantSlug]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  return { documents, loadState, refresh };
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
        <p className="text-sm font-semibold text-alphavest-ivory">{clientWorkspace.household}</p>
        <p className="mt-1 text-xs text-alphavest-muted">{clientWorkspace.role}</p>
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
        <label className="relative min-w-0 xl:w-[28rem]">
          <span className="sr-only">Search</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-10 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
            placeholder="Search clients, entities, documents..."
            type="search"
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label className="relative">
            <span className="sr-only">Tenant context</span>
            <select
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
          </label>
          <label className="relative">
            <span className="sr-only">Role context</span>
            <select
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
          <main className="px-4 py-6 md:px-6">
            <div className="av-page">{children}</div>
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

function PortalPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="019">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <div>
            <p className="font-display text-3xl text-alphavest-ivory">Good morning, Alexandra.</p>
            <p className="mt-1 text-sm text-alphavest-muted">Here is your wealth governance dashboard.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>WealthOS Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <ProgressRing label="Good" value={clientWorkspace.readiness} />
                <div>
                  <p className="text-sm text-alphavest-muted">Your overall readiness is</p>
                  <p className="mt-2 text-4xl font-semibold text-alphavest-gold">{clientWorkspace.readiness}<span className="text-xl text-alphavest-muted"> /100</span></p>
                  <p className="mt-3 text-sm leading-6 text-alphavest-muted">Complete a few items to strengthen resilience and governance.</p>
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
                <ProgressRing label="Complete" size="small" value={clientWorkspace.evidenceComplete} />
                <div className="space-y-2 text-sm text-alphavest-muted">
                  <p><span className="text-alphavest-green">●</span> Complete 68%</p>
                  <p><span className="text-alphavest-gold">●</span> In progress 20%</p>
                  <p><span className="text-alphavest-red">●</span> Missing 12%</p>
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
    </ClientShell>
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
          <div className="flex items-center justify-between">
            <AlphaVestLogo compact />
            <div className="flex items-center gap-3">
              <button className="relative text-alphavest-muted" type="button">
                <Bell aria-hidden="true" className="size-5" />
                <span className="absolute -right-2 -top-2 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">2</span>
              </button>
              <span className="grid size-10 place-items-center rounded-full border border-alphavest-border text-sm font-semibold">CO</span>
            </div>
          </div>
          <section className="mt-6">
            <p className="font-display text-2xl text-alphavest-ivory">Good morning, Christopher</p>
            <p className="text-sm text-alphavest-muted">Principal · Main Household</p>
          </section>
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <IconTile><Shield aria-hidden="true" className="size-5" /></IconTile>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Next Step Today</p>
                  <p className="mt-2 text-base font-semibold text-alphavest-ivory">Complete compliance to unlock recommendations</p>
                  <p className="mt-1 text-sm text-alphavest-muted">Recommendations are blocked while compliance items are pending.</p>
                </div>
              </div>
              <button className={primaryButtonClass + " mt-4 w-full"} type="button">Continue compliance <ChevronRight aria-hidden="true" className="size-4" /></button>
            </CardContent>
          </Card>
          <section className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-muted">Priority Actions</p>
              <button className="text-sm text-alphavest-gold" type="button">View all</button>
            </div>
            <div className="overflow-hidden rounded-md border border-alphavest-border">
              {mobilePriorityActions.map((action) => (
                <div className="flex items-center gap-3 border-b border-alphavest-border bg-alphavest-panel/40 p-3 last:border-0" key={action.label}>
                  <IconTile><FileText aria-hidden="true" className="size-5" /></IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-alphavest-ivory">{action.label}</p>
                    <p className="text-sm text-alphavest-muted">{action.detail}</p>
                  </div>
                  <Badge tone={toneFor(action.badge)}>{action.badge}</Badge>
                  <ChevronRight aria-hidden="true" className="size-4 text-alphavest-muted" />
                </div>
              ))}
            </div>
          </section>
          <Card className="mt-5">
            <CardContent className="flex items-center gap-4 p-4">
              <ProgressRing label="" size="small" value={0} />
              <div className="flex-1">
                <p className="font-semibold text-alphavest-ivory">Recommendations blocked</p>
                <p className="text-sm text-alphavest-muted">Complete compliance to enable personalized recommendations for your household.</p>
              </div>
              <ChevronRight aria-hidden="true" className="size-4 text-alphavest-muted" />
            </CardContent>
          </Card>
          <section className="mt-5 grid grid-cols-4 gap-2">
            {mobileQuickActions.map(({ icon: TileIcon, label }) => {
              return (
                <button className="rounded-md border border-alphavest-border bg-alphavest-panel/40 p-3 text-xs text-alphavest-ivory" key={label} type="button">
                  <TileIcon aria-hidden="true" className="mx-auto mb-2 size-5 text-alphavest-gold" />
                  {label}
                </button>
              );
            })}
          </section>
          <nav className="mt-auto grid grid-cols-5 border-t border-alphavest-border pt-3 text-center text-xs text-alphavest-muted">
            {["Home", "Portfolio", "Tasks", "Documents", "More"].map((item, index) => (
              <span className={index === 0 ? "text-alphavest-gold" : ""} key={item}>{item}</span>
            ))}
          </nav>
        </div>
      </main>
    </DemoSessionProvider>
  );
}

function ClientProfilePage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="021">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button">Save Draft</button><button className={primaryButtonClass} data-testid="j09-submit-profile" onClick={() => { void runScreencastDemoAction("j09.submitProfile", "/client/family-members"); }} type="button"><Send aria-hidden="true" className="size-4" />Submit for Review</button></div>}
          subtitle="Maintain the family profile, goals and governance preferences that guide our partnership."
          title={title}
        />
        <StatePanel detail="This profile is in draft. Please review all sections and submit for review." state="restricted" title="Draft profile" />
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.75fr_0.72fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Family Profile</CardTitle>
              <button className={secondaryButtonClass} type="button">Edit</button>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {profileFields.map((field) => <FieldBox key={field.label} label={field.label} value={field.value} />)}
              <div className="md:col-span-3">
                <FieldBox label="Family Overview" value="Multi-generational family focused on preserving capital, supporting education and creating long-term impact through strategic philanthropy." />
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
                ["Profile Status", "Draft"],
                ["Sections Completed", "4 / 6"],
                ["Needs Review", "2"],
                ["Blocked", "1"],
                ["Last Submitted", "May 12, 2025"]
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
          <CardContent><DataTable columns={familySummaryColumns} getRowId={(row) => row.name} rows={keyFamilyMembers} /></CardContent>
        </Card>
      </div>
    </ClientShell>
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

const familySummaryColumns: Array<DataTableColumn<(typeof keyFamilyMembers)[number]>> = [
  { key: "name", header: "Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
  { key: "role", header: "Role", render: (row) => row.role },
  { key: "generation", header: "Generation", render: (row) => row.generation },
  { key: "involvement", header: "Involvement", render: (row) => <Badge tone={toneFor(row.involvement)}>{row.involvement}</Badge> }
];

function FamilyMembersPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="022">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runScreencastDemoAction("j09.openFamilyMap", "/relationships"); }} type="button"><Network aria-hidden="true" className="size-4" />Family Map</button><button className={primaryButtonClass} data-testid="j09-add-member" onClick={() => { void runScreencastDemoAction("j09.addMember"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Member</button></div>}
          count="22"
          subtitle="Maintain family member profiles, relationships and governance roles."
          title={title}
        />
        <SafeClientBanner>Data shown based on your access: Family CFO.</SafeClientBanner>
        <div className="grid gap-5 2xl:grid-cols-[0.9fr_1.15fr]">
          <Card>
            <CardHeader className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search members" />
              </div>
              <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
            </CardHeader>
            <CardContent><DataTable columns={familyMemberColumns} getRowId={(row) => row.name} rows={familyMembers} /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-alphavest-border bg-alphavest-gold/15 text-xl font-semibold text-alphavest-gold">EH</span>
                <div>
                  <CardTitle>Eleanor Harbor</CardTitle>
                  <CardDescription>1955 (Age 69) · Female · Matriarch</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="red">Trustee / Beneficiary conflict exists</Badge>
                    <Badge tone="blue">Sensitive information</Badge>
                  </div>
                </div>
              </div>
              <button className="text-alphavest-muted" type="button"><X aria-hidden="true" className="size-5" /></button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["First Name", "Eleanor"],
                  ["Middle Name", "Marianne"],
                  ["Last Name", "Harbor"],
                  ["Preferred Name", "Ellie"],
                  ["Date of Birth", "06/14/1955"],
                  ["Nationality", "American"],
                  ["Email", "eleanor.harbor@gmail.com"],
                  ["Phone", "(415) ***-**72"]
                ].map(([label, value]) => <FieldBox key={label} label={label} value={value} />)}
              </div>
              <StatePanel detail="Eleanor is a Trustee and also named as a Beneficiary in Harbor Family Trust." state="blocked" title="Trustee / Beneficiary conflict detected" />
              <div className="flex justify-end gap-3">
                <button className={secondaryButtonClass} type="button">Cancel</button>
                <button className={primaryButtonClass} data-testid="j09-save-family-changes" onClick={() => { void runScreencastDemoAction("j09.saveFamilyChanges", "/relationships"); }} type="button">Save Changes</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientShell>
  );
}

const familyMemberColumns: Array<DataTableColumn<(typeof familyMembers)[number]>> = [
  { key: "name", header: "Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}<span className="ml-2 text-xs text-alphavest-muted">{row.year}</span></span> },
  { key: "role", header: "Family Role", render: (row) => <Badge tone="blue">{row.role}</Badge> },
  { key: "relationship", header: "Relationship", render: (row) => row.relationship },
  { key: "governance", header: "Governance", render: (row) => row.governance },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> }
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
      <div className="space-y-5">
        <SectionTitle
          action={<button className={primaryButtonClass} data-testid="j05-create-entity" onClick={() => { void runScreencastDemoAction("j05.createEntity", "/entities/new"); }} type="button"><Plus aria-hidden="true" className="size-4" />Create Entity</button>}
          count="24"
          subtitle="View and manage entities across organizational and investment structures."
          title={title}
        />
        <Card>
          <CardHeader className="grid gap-3 xl:grid-cols-[1fr_auto]">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search entities..." />
              </div>
              {["All Types", "All Jurisdictions", "All Ownership"].map((item) => <FilterSelect key={item} label={item} />)}
            </div>
            <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />More Filters</button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-5">
              <MetricCard detail="Total Entities" label="Entities" value="24" />
              <MetricCard detail="High Risk" label="High Risk" status="FAILED" value="7" />
              <MetricCard detail="Missing Documents" label="Missing Docs" status="PENDING" value="11" />
              <MetricCard detail="Awaiting Review" label="Review" status="PROCESSING" value="3" />
              <MetricCard detail="Complete" label="Completion" status="ACTIVE" value="87%" />
            </div>
            <DataTable columns={entityColumns} getRowId={(row) => row.name} rows={entityRows} />
          </CardContent>
        </Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <StatePanel detail="Create your first entity to begin building your structure." state="empty" title="No entities found" />
          <StatePanel detail="Please wait while entity records are prepared." state="loading" title="Loading entities" />
          <StatePanel detail="You do not have permission to view restricted entities." state="restricted" title="Access restricted" />
        </div>
      </div>
    </ClientShell>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button className="flex h-11 items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-sm text-alphavest-ivory" type="button">
      <span className="truncate">{label}</span>
      <ChevronDown aria-hidden="true" className="size-4 text-alphavest-subtle" />
    </button>
  );
}

const entityColumns: Array<DataTableColumn<(typeof entityRows)[number]>> = [
  { key: "name", header: "Entity", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
  { key: "type", header: "Type", render: (row) => <Badge>{row.type}</Badge> },
  { key: "jurisdiction", header: "Jurisdiction", render: (row) => row.jurisdiction },
  { key: "ownership", header: "Ownership", render: (row) => row.ownership },
  { key: "docs", header: "Missing Documents", render: (row) => <Badge tone={toneFor(row.missingDocs)}>{row.missingDocs}</Badge> },
  { key: "risk", header: "Risk", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge> }
];

function CreateEntityPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="025">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle subtitle="Build a new entity record with ownership, jurisdiction and supporting evidence." title={title} />
        <WizardStepper steps={entityWizardSteps.map((step) => ({ ...step }))} />
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
              {[
                ["Entity Type", "Private Limited Company"],
                ["Legal Name", "Apex Growth Holdings Ltd."],
                ["Trading / Short Name", "Apex Growth Holdings"],
                ["Jurisdiction", "Cayman Islands"],
                ["Registration Number", "C-123456"],
                ["Incorporation Date", "14 May 2024"],
                ["Registered Address", "89 Nexus Way, Camana Bay, Grand Cayman"],
                ["Business Purpose", "To acquire, hold and manage long-term strategic investments."]
              ].map(([label, value]) => (
                <FieldBox key={label} label={label} value={value} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Creation Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="h-2 rounded-full bg-alphavest-border">
                  <div className="h-2 w-1/3 rounded-full bg-alphavest-gold" />
                </div>
                <p className="mt-2 text-sm text-alphavest-muted">2 of 6 completed</p>
              </div>
              {["Entity type selected", "Legal name provided", "Jurisdiction requires review", "Participants not added", "Ownership not defined", "Evidence not uploaded"].map((item) => (
                <div className="flex items-center gap-2 text-sm" key={item}>
                  {item.includes("requires") || item.includes("not") ? <AlertTriangle aria-hidden="true" className="size-4 text-alphavest-gold" /> : <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />}
                  <span className="text-alphavest-muted">{item}</span>
                </div>
              ))}
              <StatePanel detail="Cayman Islands is classified as a sensitive jurisdiction and requires legal review." state="restricted" title="Review requirement" />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-3"><button className={secondaryButtonClass} type="button">Save Draft</button><button className={primaryButtonClass} data-testid="j05-continue-entity" onClick={() => { void runScreencastDemoAction("j05.continueEntity", "/entities/demo"); }} type="button">Continue</button></div>
      </div>
    </ClientShell>
  );
}

function EntityDetailPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="026">
      <ScreenTitle>{title}</ScreenTitle>
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
  const persistedRows = toDocumentRows(documents, session.tenant.displayName);
  const rows: DocumentTableRow[] = [...persistedRows, ...documentRows];

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button"><Plus aria-hidden="true" className="size-4" />New Folder</button><button className={primaryButtonClass} data-testid="j04-open-upload-document" onClick={() => { void runScreencastDemoAction("j04.openUploadDocument", "/documents/upload"); }} type="button"><Upload aria-hidden="true" className="size-4" />Upload Document</button></div>} icon={Folder} subtitle="Securely manage and access client documents and evidence." title={title} />
        {persistedRows.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Workspace Uploads</CardTitle>
              <CardDescription>Recently uploaded documents for this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={documentColumns} getRowId={(row) => row.name} rows={persistedRows} />
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardHeader className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search documents by name or keyword..." />
              </div>
              <button className={secondaryButtonClass} type="button">Saved Views</button>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {["All Types", "All Statuses", "All Sensitivities", "All Entities", "Accessible to Me"].map((item) => <FilterSelect key={item} label={item} />)}
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={documentColumns}
              emptyMessage={loadState === "error" ? "Persisted uploads could not be loaded; static demo rows remain visible." : undefined}
              getRowId={(row) => row.name}
              rows={rows}
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
    </ClientShell>
  );
}

const documentColumns: Array<DataTableColumn<DocumentTableRow>> = [
  { key: "name", header: "Document Name", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span> },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "sensitivity", header: "Sensitivity", render: (row) => <Badge tone={toneFor(row.sensitivity)}>{row.sensitivity}</Badge> },
  { key: "entity", header: "Linked Entity", render: (row) => row.entity },
  { key: "updated", header: "Updated", render: (row) => row.updated }
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
          <button className={primaryButtonClass + " w-full"} data-testid="real-upload-document" disabled={uploadState === "uploading"} onClick={() => { void submitUpload(); }} type="button"><Upload aria-hidden="true" className="size-4" />Upload Document</button>
          <button className={secondaryButtonClass + " w-full"} data-testid="j04-upload-document" onClick={() => { void runScreencastDemoAction("j04.uploadDocument", "/documents/extraction-review"); }} type="button">Run Demo Journey</button>
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
          {latestDocument ? (
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <p className="text-sm font-semibold text-alphavest-ivory">{latestDocument.fileName}</p>
              <p className="mt-1 text-xs text-alphavest-muted">{formatBytes(latestDocument.fileSizeBytes)} · {labelFromEnum(latestDocument.status)}</p>
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
        <DocumentUploadForm />
      </div>
    </ClientShell>
  );
}

function ExtractionReviewPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="029">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <SectionTitle action={<div className="flex gap-3"><button className={secondaryButtonClass} type="button">Save Draft</button><button className={primaryButtonClass} data-testid="j04-confirm-finalize" onClick={() => { void runScreencastDemoAction("j04.confirmFinalize", "/documents/verification-pending"); }} type="button"><Check aria-hidden="true" className="size-4" />Confirm & Finalize</button></div>} subtitle="Review AI-extracted data. This is a draft and not final evidence." title={title} />
        <SafeClientBanner>AI Draft Mode: extracted data requires human review. Not final. Not evidence.</SafeClientBanner>
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
