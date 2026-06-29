"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Network,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Upload,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { GlobalSearchBox } from "@/components/global-search-box";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { UxHubPage } from "@/components/ux-hub-page";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ClientSafeUiBoundary,
  DataTable,
  MetricCard,
  MasterDetailSurface,
  ActionButton,
  ActionZone,
  NoOverclaimFeedback,
  StatePanel,
  WizardStepper,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  clientPortalProjectionState,
  clientPortalProjectionStatePanelCopy,
  type ClientPortalProjectionViewModel,
} from "@/lib/client-portal-projection-state";
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
  relationshipRows
} from "@/lib/client-intake-demo-data";
import { createDemoSession, demoPlatformTenantId } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import { runDataMaintenanceCommand } from "@/lib/data-maintenance-command-client";
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import {
  evidenceLifecycleProcessContracts,
  evidenceLifecycleProofBoundaryForScreen,
  evidenceLifecycleRouteAttributesForScreen,
  evidenceLifecycleRouteContractForScreen,
  evidenceLifecycleStateContracts,
  type EvidenceLifecycleRouteScreenId,
} from "@/lib/evidence-lifecycle-contract";
import { uxActionClassForPriority } from "@/lib/ux-action-hierarchy-contract";
import { uxFeedbackSuccessMessageForSubject } from "@/lib/ux-feedback-message-contract";
import { visibilityEngine, type DecisionVisibilityPayload } from "@/lib/visibility-engine";

type ClientIntakeScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass = uxActionClassForPriority("primary");
const secondaryButtonClass = uxActionClassForPriority("secondary");
const defaultPageSize = 10;

type DataSurfaceMeta = BackendDataSurfaceMeta<string>;
type DocumentFilterOption = {
  label: string;
  value: string;
};

const mobileQuickActions: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Upload, label: "Upload" },
  { icon: MessageSquare, label: "Message" },
  { icon: Calendar, label: "Schedule" },
  { icon: ShieldCheck, label: "Security" }
];

const wp07ClientProjectionSession = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

const wp07ReleasedDecisionPayload: DecisionVisibilityPayload = {
  aiDraft: "Internal draft text remains outside the client projection.",
  assumptionsJson: { source: "wp07-internal-model" },
  clientSummary: "Reviewed governance update available for client view.",
  clientTenantId: wp07ClientProjectionSession.tenant.id,
  clientVisible: true,
  complianceNotes: "Compliance-only release notes remain internal.",
  decisionState: "RELEASED",
  id: "decision:bennett:wp07-client-safe",
  internalRationale: "Internal rationale remains hidden.",
  evidenceRecordId: "evidence:bennett:wp07-client-safe",
  releasedAt: "2026-06-23T09:15:00.000Z",
  sensitivity: "RESTRICTED",
  submittedAt: "2026-06-23T08:30:00.000Z",
  title: "Governance update decision",
  visibilityStatus: "CLIENT_VISIBLE",
};

const wp07UnreleasedDecisionPayload: DecisionVisibilityPayload = {
  ...wp07ReleasedDecisionPayload,
  clientSummary: "Draft summary not available to the client.",
  clientVisible: false,
  decisionState: "SUBMITTED",
  releasedAt: null,
  visibilityStatus: "COMPLIANCE_VISIBLE",
};

type PersistedUploadDocument = {
  checksum?: string;
  documentType: string;
  evidenceLifecycleStatus?: string | null;
  evidenceRecordId: string | null;
  evidenceStatus: string | null;
  evidenceVisibilityStatus: string | null;
  extractionStatus?: string | null;
  fileName?: string;
  fileSizeBytes?: number;
  id: string;
  latestVersionNumber?: number | null;
  mimeType?: string;
  sensitivity?: string;
  status: string;
  storageKey?: string;
  title: string;
  uploadedAt: string;
  versionCount?: number | null;
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
  payloadMode: string;
  relationship: string;
  role: string;
  sensitivity: string;
  status: string;
  taxResidency: string;
  visibilityStatus: string;
  year: string;
};

type EntityTableRow = {
  id: string;
  jurisdiction: string;
  missingDocs: string;
  name: string;
  ownership: string;
  payloadMode: string;
  risk: string;
  sensitivity: string;
  status: string;
  type: string;
  visibilityStatus: string;
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

const documentTypeFilterOptions: DocumentFilterOption[] = [
  "trust_deed",
  "portfolio_statement",
  "tax_residency_certificate",
  "source_of_funds",
  "ips_risk_addendum",
  "financial_statement",
  "kyc_document",
].map((value) => ({ label: labelFromEnum(value), value }));

const documentStatusFilterOptions: DocumentFilterOption[] = [
  "LINKED_TO_EVIDENCE",
  "NEEDS_CLARIFICATION",
  "AI_EXTRACTED",
  "UPLOADING",
  "EMPTY",
  "ANALYST_REVIEW_PENDING",
  "VERIFIED",
].map((value) => ({ label: labelFromEnum(value), value }));

const documentSensitivityFilterOptions: DocumentFilterOption[] = [
  "CONFIDENTIAL",
  "RESTRICTED",
  "HIGHLY_RESTRICTED",
].map((value) => ({ label: labelFromEnum(value), value }));

function isPersistedUploadDocument(value: unknown): value is PersistedUploadDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PersistedUploadDocument>;
  return (
    typeof candidate.documentType === "string" &&
    typeof candidate.id === "string" &&
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
    sensitivity: document.sensitivity ? labelFromEnum(document.sensitivity) : "Client Safe",
    status: labelFromEnum(document.status),
    type: labelFromEnum(document.documentType),
    updated: formatUploadDate(document.uploadedAt),
  }));
}

function usePersistedUploadDocuments(queryState: {
  page: number;
  pageSize?: number;
  q: string;
  sensitivity: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  status: string;
  type: string;
} = {
  page: 1,
  pageSize: defaultPageSize,
  q: "",
  sensitivity: "all",
  sortDirection: "desc",
  sortKey: "uploadedAt",
  status: "all",
  type: "all",
}) {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [documents, setDocuments] = useState<PersistedUploadDocument[]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const refreshSequenceRef = useRef(0);

  const refresh = useCallback(async () => {
    const refreshSequence = refreshSequenceRef.current + 1;
    refreshSequenceRef.current = refreshSequence;
    setLoadState("loading");
    setDocuments([]);

    try {
      const params = dataSurfaceParams({
        filters: {
          sensitivity: queryState.sensitivity,
          source: "all",
          status: queryState.status,
          type: queryState.type,
        },
        page: queryState.page,
        pageSize: queryState.pageSize,
        q: queryState.q,
        roleKey,
        sortDirection: queryState.sortDirection,
        sortKey: queryState.sortKey,
        tenantSlug,
      });
      const response = await fetch(`/api/documents?${params.toString()}`, { cache: "no-store" });
      const body = (await response.json()) as { documents?: PersistedUploadDocument[]; meta?: DataSurfaceMeta };

      if (!response.ok) {
        throw new Error("Document reload failed.");
      }

      if (refreshSequence !== refreshSequenceRef.current) {
        return;
      }

      setDocuments((body.documents ?? []).filter(isPersistedUploadDocument));
      setMeta(body.meta ?? null);
      setLoadState("ready");
    } catch {
      if (refreshSequence !== refreshSequenceRef.current) {
        return;
      }

      setMeta(null);
      setLoadState("error");
    }
  }, [queryState.page, queryState.pageSize, queryState.q, queryState.sensitivity, queryState.sortDirection, queryState.sortKey, queryState.status, queryState.type, roleKey, tenantSlug]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const rememberUploadedDocument = useCallback((document: PersistedUploadDocument) => {
    setDocuments((current) => [document, ...current.filter((item) => item.id !== document.id)]);
    setLoadState("ready");
  }, []);

  return { documents, loadState, meta, refresh, rememberUploadedDocument };
}

function dataSurfaceParams(input: {
  filters?: Record<string, string>;
  page?: number;
  pageSize?: number;
  q?: string;
  roleKey: string;
  sortDirection?: DataSurfaceSortDirection;
  sortKey?: string;
  tenantSlug: string;
}) {
  const params = new URLSearchParams({
    page: String(input.page ?? 1),
    pageSize: String(input.pageSize ?? defaultPageSize),
    roleKey: input.roleKey,
    sortDirection: input.sortDirection ?? "asc",
    sortKey: input.sortKey ?? "name",
    tenantSlug: input.tenantSlug,
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

function documentApiSortKey(sortKey: keyof DocumentTableRow) {
  if (sortKey === "updated") return "uploadedAt";
  if (sortKey === "name") return "title";
  if (sortKey === "type") return "documentType";
  return String(sortKey);
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

function useDbtfFamilyMembers(queryState: {
  page: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
} = {
  page: 1,
  q: "",
  sortDirection: "asc",
  sortKey: "name",
}) {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<FamilyMemberTableRow[]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const params = dataSurfaceParams({
        page: queryState.page,
        q: queryState.q,
        roleKey,
        sortDirection: queryState.sortDirection,
        sortKey: queryState.sortKey,
        tenantSlug,
      });
      const response = await fetch(`/api/family-members?${params.toString()}`, { cache: "no-store" });
      const body = (await response.json()) as { familyMembers?: FamilyMemberTableRow[]; meta?: DataSurfaceMeta };

      if (!response.ok) {
        throw new Error("Family member reload failed.");
      }

      setRows(body.familyMembers ?? []);
      setMeta(body.meta ?? null);
      setLoadState("ready");
    } catch {
      setRows([]);
      setMeta(null);
      setLoadState("error");
    }
  }, [queryState.page, queryState.q, queryState.sortDirection, queryState.sortKey, roleKey, tenantSlug]);

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

  return { loadState, meta, refresh, rows, save };
}

function useDbtfEntities(queryState: {
  jurisdiction: string;
  page: number;
  q: string;
  risk: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  type: string;
}) {
  const { session } = useDemoSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<EntityTableRow[]>([]);
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
            risk: queryState.risk,
            type: queryState.type,
          },
          page: queryState.page,
          q: queryState.q,
          roleKey,
          sortDirection: queryState.sortDirection,
          sortKey: queryState.sortKey,
          tenantSlug,
        });
        const response = await fetch(`/api/entities?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { entities?: EntityTableRow[]; meta?: DataSurfaceMeta };

        if (!response.ok) {
          throw new Error("Entity reload failed.");
        }

        if (!cancelled) {
          setRows(body.entities ?? []);
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
  }, [queryState.jurisdiction, queryState.page, queryState.q, queryState.risk, queryState.sortDirection, queryState.sortKey, queryState.type, roleKey, tenantSlug]);

  return { loadState, meta, rows };
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

function WorksurfaceInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
      <p className="text-xs text-alphavest-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}

function ClientContextRail() {
  return (
    <>
      <WorksurfacePanel
        description="Household and relationship context shown here is limited to client-safe summary information."
        title="Client context access"
      >
        <div className="space-y-3">
          <WorksurfaceInfoRow label="Household" value={clientWorkspace.household} />
          <WorksurfaceInfoRow label="Readiness" value={`${clientWorkspace.readiness}%`} />
          <WorksurfaceInfoRow label="Evidence coverage" value={`${clientWorkspace.evidenceComplete}%`} />
          <WorksurfaceInfoRow label="Advisor" value={clientWorkspace.advisor} />
          <WorksurfaceInfoRow label="Role" value={clientWorkspace.role} />
        </div>
      </WorksurfacePanel>
      <StatePanel
        detail="Additional review detail stays unavailable until the AlphaVest team releases a client-safe summary."
        state="hidden"
        title="More detail is not available yet"
      />
    </>
  );
}

function EvidenceLifecycleRail() {
  return (
    <>
      <WorksurfacePanel
        description="Evidence steps are shown as client-safe availability milestones."
        title="Evidence lifecycle"
      >
        <div className="space-y-3">
          <WorksurfaceInfoRow label="Upload" value="Creates intake item only" />
          <WorksurfaceInfoRow label="Review" value="Team review in progress" />
          <WorksurfaceInfoRow label="Availability" value="Released summary only" />
          <WorksurfaceInfoRow label="Next step" value="We will request more if needed" />
        </div>
      </WorksurfacePanel>
      <StatePanel
        detail="Documents that are not ready for client-safe display stay hidden and show a simple availability status."
        state="hidden"
        title="Unavailable items stay hidden"
      />
    </>
  );
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

function ClientSidebar() {
  const { session } = useDemoSession();

  return (
    <ProcessSidebar
      className="bg-alphavest-navy/82"
      footer={
        <>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/60 p-4">
            <p className="text-sm font-semibold text-alphavest-ivory">{session.tenant.displayName}</p>
            <p className="mt-1 text-xs text-alphavest-muted">{session.role.label}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-alphavest-green">
              <span className="size-2 rounded-full bg-alphavest-green" />
              Active
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-alphavest-muted opacity-65" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
            <PanelLeftClose aria-hidden="true" className="size-4" />
            Collapse
          </p>
        </>
      }
    />
  );
}

function ClientTopBar() {
  const { session } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[28rem]" />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <span
            aria-label="Client notifications are informational in this release"
            className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted opacity-65"
            data-ux-affordance="blocked-cta"
            data-ux-interactive="false"
            role="status"
          >
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">5</span>
          </span>
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
        <ClientSidebar />
        <div className="min-w-0">
          <ClientTopBar />
          <main className="px-4 py-6 md:px-6">
            <OperationalDefaultSurface>
              <ClientSafeUiBoundary family={activePageId === "020" ? "mobile_client" : undefined} pageId={activePageId}>
                {children}
              </ClientSafeUiBoundary>
            </OperationalDefaultSurface>
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

function Epic07ProofAuditDisclosure({
  auditSource,
  processId,
  proofSource,
}: {
  auditSource: string;
  processId: string;
  proofSource: string;
}) {
  return (
    <details
      className="group relative"
      data-epic-07-client-release="not_mutated"
      data-epic-07-evidence-sufficiency="not_claimed"
      data-epic-07-no-overclaim="true"
      data-epic-07-process={processId}
      data-epic-07-proof-placement="disclosure_drawer"
      data-testid="epic-07-proof-audit-disclosure"
    >
      <summary className={cn(secondaryButtonClass, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}>
        <ShieldCheck aria-hidden="true" className="size-4" />
        Audit evidence
        <ChevronDown aria-hidden="true" className="size-4 transition group-open:rotate-180" />
      </summary>
      <div
        className="absolute right-0 z-30 mt-2 w-80 rounded-md border border-alphavest-border bg-alphavest-panel p-4 text-left shadow-2xl"
        data-testid="epic-07-proof-audit-drawer"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold">Audit evidence boundary</p>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-alphavest-muted">Evidence source</span>
            <Badge tone="blue">{proofSource}</Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-alphavest-muted">Audit source</span>
            <Badge tone="green">{auditSource}</Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-alphavest-muted">Client release</span>
            <Badge tone="gold">Not changed</Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-alphavest-muted">Evidence sufficiency</span>
            <Badge tone="red">Not claimed</Badge>
          </div>
        </div>
        <p className="mt-3 border-t border-alphavest-border pt-3 text-xs leading-5 text-alphavest-muted">
          This drawer proves route gating and mutation safety only. Internal rationale, compliance notes and audit metadata stay outside the client projection.
        </p>
      </div>
    </details>
  );
}

function ClientSafeProjectionCard({ density = "desktop" }: { density?: "desktop" | "mobile" }) {
  const releasedProjection = visibilityEngine.projectDecisionPayload(
    wp07ClientProjectionSession.actor,
    wp07ClientProjectionSession.role,
    wp07ReleasedDecisionPayload,
    demoPlatformTenantId,
    wp07ClientProjectionSession.tenant.id,
  );
  const blockedProjection = visibilityEngine.projectDecisionPayload(
    wp07ClientProjectionSession.actor,
    wp07ClientProjectionSession.role,
    wp07UnreleasedDecisionPayload,
    demoPlatformTenantId,
    wp07ClientProjectionSession.tenant.id,
  );
  const releasedState = clientPortalProjectionState("decision", releasedProjection);
  const blockedState = clientPortalProjectionState("decision", blockedProjection);
  const releasedPayload = releasedState.visible ? releasedState.payload : {};

  return (
    <Card
      data-testid="wp07-client-safe-projection-card"
      data-wp03-blocked-state={blockedState.state}
      data-wp03-released-state={releasedState.state}
      data-wp07-mobile-parity={density === "mobile" ? "true" : "false"}
      data-wp07-projection-source="visibility-engine"
      data-wp07-projection-state={releasedState.reasonCode}
      data-wp07-safe-clean={String(releasedState.safe)}
    >
      <CardHeader>
        <CardTitle>Client-safe summary</CardTitle>
        <CardDescription>Released content only, with fail-closed fallback.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClientPortalProjectionStatePanel model={releasedState} />
        <div className="grid gap-3 md:grid-cols-2">
          <ClientProjectionField label="Decision" value={String(releasedPayload.title ?? "Released decision")} />
          <ClientProjectionField label="State" value={String(releasedPayload.decisionState ?? "RELEASED")} />
          <ClientProjectionField label="Released" value={String(releasedPayload.releasedAt ?? "Release timestamp unavailable")} />
          <ClientProjectionField label="Projection" value={releasedState.reasonCode} />
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4" data-testid="wp07-client-safe-summary">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Summary</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-ivory">{String(releasedPayload.clientSummary ?? "No released summary available.")}</p>
        </div>
        <ClientPortalProjectionStatePanel model={blockedState} testId="wp07-client-fail-closed-state" />
        <p className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3 text-xs leading-5 text-alphavest-muted" data-testid="wp07-client-projection-boundary">
          This client view contains only the released summary and permitted metadata. Details that are not ready stay unavailable.
        </p>
      </CardContent>
    </Card>
  );
}

function ClientPortalProjectionStatePanel({
  model,
  testId,
}: {
  model: ClientPortalProjectionViewModel;
  testId?: string;
}) {
  const copy = clientPortalProjectionStatePanelCopy(model);

  return (
    <StatePanel
      detail={copy.detail}
      feedback={{
        audience: "client_safe",
        intent: model.visible ? "success" : "fail_closed",
        placement: "page_state",
        subject: "client_visibility",
      }}
      state={copy.componentState}
      testId={testId}
      title={copy.title}
    />
  );
}

function ClientProjectionField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}

function PortalPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="019">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        description="Review-first home context for the client-facing projection, with internal review and release checks kept separate."
        eyebrow="Client context"
        primary={<Epic07ClientFamilyEntry />}
        routeId="019"
        safetyNote="Client context cannot expose internal data, mark evidence sufficient or bypass compliance release."
        statusItems={[
          { label: "Context", tone: "blue", value: "Client home" },
          { label: "Visibility", tone: "gold", value: "released projection only" },
        ]}
        title={title}
        worksurfaceId="client-context-home"
      />
    </ClientShell>
  );
}

function Epic07ClientFamilyEntry() {
  const processCards = [
    {
      detail: "Profile, family rows and relationship context are ready for permitted review.",
      href: "/client/profile",
      icon: ClipboardCheck,
      label: "Profile context",
      status: "Draft review",
      tone: "blue" as BadgeTone,
    },
    {
      detail: "Family member updates require role, tenant, object and audit evidence.",
      href: "/client/family-members",
      icon: Network,
      label: "Family members",
      status: "DB-backed",
      tone: "green" as BadgeTone,
    },
    {
      detail: "Entity and wealth context can route work, but cannot mark readiness.",
      href: "/entities",
      icon: Building2,
      label: "Entity structure",
      status: "Context only",
      tone: "gold" as BadgeTone,
    },
  ];

  return (
    <section
      className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      data-epic-07-client-visible="projection-only"
      data-epic-07-contract="client_family_context_foundation"
      data-epic-07-no-overclaim="true"
      data-epic-07-primary-entry="S019"
      data-testid="epic-07-client-family-entry"
    >
      <div className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">Client and family context</p>
            <h2 className="mt-2 font-display text-2xl leading-tight text-alphavest-ivory">One context spine before any decision work</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-alphavest-muted">
              The client area resolves tenant, family, entity and sensitivity context first. It can collect and review context, but it cannot approve advice, evidence sufficiency, export or client release.
            </p>
          </div>
          <Link
            className={primaryButtonClass}
            data-epic-07-primary-cta="true"
            data-testid="epic-07-primary-next-action"
            href="/client/family-members"
          >
            Review family context
            <ChevronRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {processCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 transition hover:border-alphavest-gold/60"
                data-epic-07-process-card="true"
                href={card.href}
                key={card.label}
              >
                <div className="flex items-start gap-3">
                  <IconTile tone={card.tone}>
                    <Icon aria-hidden="true" className="size-4" />
                  </IconTile>
                  <div className="min-w-0">
                    <p className="font-semibold text-alphavest-ivory">{card.label}</p>
                    <p className="mt-1 text-sm leading-5 text-alphavest-muted">{card.detail}</p>
                    <Badge className="mt-3" tone={card.tone}>{card.status}</Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="epic-07-proof-boundary">
        <div className="flex gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-alphavest-gold" />
          <div>
            <p className="font-semibold text-alphavest-gold-soft">Client-safe boundary</p>
            <p className="mt-2 text-sm leading-6 text-alphavest-muted">
              Visible content is derived from role, tenant and sensitivity. Hidden rows stay hidden; context review does not change release, export or evidence readiness.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3 border-t border-alphavest-gold/25 pt-3">
            <span className="text-alphavest-muted">Mutation result</span>
            <Badge tone="gold">No client release</Badge>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-alphavest-gold/25 pt-3">
            <span className="text-alphavest-muted">Visibility source</span>
            <Badge tone="blue">Derived</Badge>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-alphavest-gold/25 pt-3">
            <span className="text-alphavest-muted">Readiness</span>
            <Badge tone="red">Still separate</Badge>
          </div>
        </div>
      </aside>
    </section>
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
                  <p className="mt-3 text-sm leading-6 text-alphavest-muted">Computed from tenant-limited documents, evidence, actions and compliance records.</p>
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
                          void runDataMaintenanceCommand("j09.portalUpload", "/client/profile");
                          return;
                        }
                        void runDataMaintenanceCommand("j04.portalUpload", "/documents");
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
                  <div className="flex w-full items-center justify-between rounded-md border border-alphavest-border/60 p-3 text-left text-sm text-alphavest-muted opacity-65" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" key={item}>
                    <span>{item}</span>
                    <ChevronRight aria-hidden="true" className="size-4 text-alphavest-gold" />
                  </div>
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
                <p className={secondaryButtonClass + " mt-4 opacity-65"} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Message view held</p>
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
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-alphavest-gold opacity-60" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
          View all <ArrowRightIcon />
        </span>
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
          <ClientSafeProjectionCard density="mobile" />
          <div className="mt-5 grid gap-3">
            {mobilePriorityActions.map((action) => (
              <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3" key={action.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">{action.label}</p>
                  <Badge tone="gold">{action.badge}</Badge>
                </div>
                <p className="mt-1 text-xs text-alphavest-muted">{action.detail}</p>
              </div>
            ))}
          </div>
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
        <StatePanel detail={message} state={issues.length > 0 || loadState === "error" ? "restricted" : "success"} title={loadState === "loading" ? "Loading profile" : issues.length > 0 ? "Profile validation failed" : "Profile saved"} />
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
                ["Sensitivity", profile?.sensitivity ?? "n/a"],
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
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Key Family Members</CardTitle><span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Manage held</span></CardHeader>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof FamilyMemberTableRow>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const { loadState, meta, rows, save } = useDbtfFamilyMembers({
    page,
    q: searchTerm,
    sortDirection,
    sortKey: String(sortKey),
  });
  const [familyForm, setFamilyForm] = useState<FamilyMemberFormState>({
    displayName: "",
    relationshipType: "",
    taxResidency: "",
  });
  const [formMessage, setFormMessage] = useState("Select a DB-backed member to edit allowed fields.");
  const [formIssues, setFormIssues] = useState<string[]>([]);
  const [savingFamilyMember, setSavingFamilyMember] = useState(false);
  const selected = rows[0];

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
      setPage(1);
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
    setPage(1);
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
      <div
        className="space-y-4"
        data-epic-07-gate="tenant-scoped-db-audit"
        data-epic-07-no-overclaim="true"
        data-epic-07-process="BP-004"
        data-epic-07-surface="queue-detail"
        data-testid="epic-07-family-core-surface"
      >
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><Epic07ProofAuditDisclosure auditSource="DB audit" processId="BP-004" proofSource="visibility rules" /><button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runDataMaintenanceCommand("j09.openFamilyMap", "/relationships"); }} type="button"><Network aria-hidden="true" className="size-4" />Family Map</button><button className={primaryButtonClass} data-testid="j09-add-member" onClick={() => { void runDataMaintenanceCommand("j09.addMember"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Member</button></div>}
          count={String(meta?.totalRows ?? rows.length)}
          subtitle="Maintain family member profiles, relationships and governance roles."
          title={title}
        />
        <SafeClientBanner>Family rows are loaded from tenant-limited seeded DB records. Allowed edits persist to FamilyMember and create audit events.</SafeClientBanner>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_30rem]">
          <Card data-testid="epic-07-family-queue-surface" density="compact">
            <CardHeader className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
	                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
	                  onChange={(event) => {
	                    setSearchTerm(event.target.value);
	                    setPage(1);
	                  }}
	                  placeholder="Search DB-backed members"
                  value={searchTerm}
                />
              </div>
              <div className="flex h-11 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Tenant permitted
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={familyMemberQueueColumns}
                compact
                emptyMessage={loadState === "error" ? "Family members could not be loaded from the DB." : "No DB-backed family members match this search."}
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
          <Card data-testid="epic-07-family-detail-surface" density="compact">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-alphavest-border bg-alphavest-gold/15 text-xl font-semibold text-alphavest-gold">
                  {(selected?.name ?? "DB").split(" ").map((part) => part.charAt(0)).slice(0, 2).join("")}
                </span>
                <div>
                  <CardTitle>{selected?.name ?? "No DB-backed member selected"}</CardTitle>
                  <CardDescription>{selected ? `${selected.year} · ${selected.relationship} · ${selected.role}` : "Tenant-limited family rows are empty."}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected ? <Badge tone={toneFor(selected.status)}>{selected.status}</Badge> : null}
                    {selected ? <Badge tone="blue">{selected.sensitivity}</Badge> : null}
                    {selected ? <Badge tone="green">{selected.visibilityStatus}</Badge> : null}
                  </div>
                </div>
              </div>
              <span className="text-alphavest-muted opacity-60" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false"><X aria-hidden="true" className="size-5" /></span>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <FormField label="Display Name" onChange={(value) => setFamilyForm((current) => ({ ...current, displayName: value }))} required value={familyForm.displayName} />
                <FormField label="Relationship" onChange={(value) => setFamilyForm((current) => ({ ...current, relationshipType: value }))} required value={familyForm.relationshipType} />
                <FormField label="Tax Residency" onChange={(value) => setFamilyForm((current) => ({ ...current, taxResidency: value }))} required value={familyForm.taxResidency} />
                <FieldBox label="Source" value="FamilyMember DB row" />
                <FieldBox label="Sensitivity" value={selected?.sensitivity ?? "n/a"} />
                <FieldBox label="Visibility" value={selected?.visibilityStatus ?? "n/a"} />
                <FieldBox label="Status" value={selected?.status ?? "n/a"} />
              </div>
              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  formIssues.length > 0
                    ? "border-alphavest-red/45 bg-alphavest-red/10 text-alphavest-red"
                    : "border-alphavest-green/45 bg-alphavest-green/10 text-alphavest-muted",
                )}
                data-testid="epic-07-family-detail-state"
              >
                <span className="font-semibold text-alphavest-ivory">Family edit state</span>
                <span className="ml-2">{formIssues.length > 0 ? formIssues.join(", ") : formMessage}</span>
              </div>
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
  { key: "visibilityStatus", header: "Visibility", render: (row) => <Badge tone={toneFor(row.visibilityStatus)}>{row.visibilityStatus}</Badge>, sortable: true },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, sortable: true }
];

const familyMemberQueueColumns: Array<DataTableColumn<FamilyMemberTableRow>> = [
  {
    key: "name",
    header: "Name",
    render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}<span className="ml-2 text-xs text-alphavest-muted">{row.year}</span></span>,
    sortable: true,
    className: "min-w-[12rem] whitespace-nowrap",
  },
  {
    key: "role",
    header: "Role",
    render: (row) => <Badge tone="blue">{row.role}</Badge>,
    sortable: true,
    className: "w-32 whitespace-nowrap",
  },
  {
    key: "visibilityStatus",
    header: "Visibility",
    render: (row) => <Badge tone={toneFor(row.visibilityStatus)}>{row.visibilityStatus}</Badge>,
    sortable: true,
    className: "w-40 whitespace-nowrap",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>,
    sortable: true,
    className: "w-28 whitespace-nowrap",
  },
];

function RelationshipsPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="023">
      <ScreenTitle>{title}</ScreenTitle>
      <div
        className="space-y-5"
        data-epic-07-gate="relationship-db-audit"
        data-epic-07-no-overclaim="true"
        data-epic-07-process="BP-005"
        data-epic-07-surface="relationship-depth"
        data-testid="epic-07-relationship-depth-surface"
      >
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><Epic07ProofAuditDisclosure auditSource="Relationship AuditEvent" processId="BP-005" proofSource="typed J09 command" /><button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runDataMaintenanceCommand("j09.openFamilyMap"); }} type="button"><Network aria-hidden="true" className="size-4" />Open Map</button><button className={primaryButtonClass} data-testid="j09-add-relationship" onClick={() => { void runDataMaintenanceCommand("j09.addRelationship"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Edge</button></div>}
          subtitle="Validate relationship edges, evidence and conflicts across people, entities and advisors."
          title={title}
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <Card data-testid="epic-07-relationship-graph" density="compact">
            <CardContent className="p-0">
              <div className="hidden h-[18rem] overflow-hidden rounded-t-md border-b border-alphavest-border bg-[radial-gradient(circle_at_center,rgba(90,167,216,0.08),transparent_24rem)] md:relative md:block">
                {relationshipNodes.map((node) => (
                  <div
                    className={cn(
                      "absolute w-40 rounded-md border p-2.5 shadow-lg",
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
              <div className="p-3">
                <DataTable columns={relationshipDepthColumns} compact getRowId={(row) => `${row.from}-${row.to}`} rows={relationshipRows} />
              </div>
            </CardContent>
          </Card>
          <Card data-testid="epic-07-relationship-step-proof" density="compact">
            <CardHeader>
              <CardTitle>Relationship step evidence</CardTitle>
              <CardDescription>Typed relationship commands must persist audit before any edge changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {relationshipDepthSteps.map((step) => (
                <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5" data-testid="epic-07-relationship-depth-step" key={step.label}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-alphavest-ivory">{step.label}</p>
                    <Badge tone={step.tone}>{step.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-alphavest-muted">{step.detail}</p>
                </div>
              ))}
              <div className="rounded-md border border-alphavest-red/45 bg-alphavest-red/10 p-2.5 text-sm text-alphavest-muted" data-testid="epic-07-relationship-audit-fail-closed">
                <span className="font-semibold text-alphavest-ivory">Audit failure rule</span>
                <span className="ml-2">If audit persistence is unavailable, the relationship edge is not created and client release remains unchanged.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientShell>
  );
}

const relationshipDepthColumns: Array<DataTableColumn<(typeof relationshipRows)[number]>> = [
  { key: "from", header: "From", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.from}</span>, className: "min-w-[10rem]" },
  { key: "relationship", header: "Edge", render: (row) => row.relationship, className: "w-36" },
  { key: "to", header: "To", render: (row) => row.to, className: "min-w-[11rem]" },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>, className: "w-32 whitespace-nowrap" }
];

const relationshipDepthSteps: Array<{ detail: string; label: string; status: string; tone: BadgeTone }> = [
  {
    detail: "Family map open is a typed J09 command and creates an audit trace without changing release state.",
    label: "1. Map open audited",
    status: "audit first",
    tone: "blue",
  },
  {
    detail: "Add Edge writes a Relationship row and an EvidenceItem only after the critical audit check is writable.",
    label: "2. Edge mutation gated",
    status: "DB backed",
    tone: "green",
  },
  {
    detail: "Missing audit persistence fails closed before mutation; no hidden relationship content is exposed.",
    label: "3. Audit failure blocked",
    status: "fail closed",
    tone: "red",
  },
];

function EntitiesPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="024">
      <EntitiesPageContent title={title} />
    </ClientShell>
  );
}

function EntitiesPageContent({ title }: { title: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof EntityTableRow>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const { loadState, meta, rows } = useDbtfEntities({
    jurisdiction: jurisdictionFilter,
    page,
    q: searchTerm,
    risk: riskFilter,
    sortDirection,
    sortKey: String(sortKey),
    type: typeFilter,
  });
  const typeOptions = Array.from(new Set(rows.map((row) => row.type))).sort();
  const jurisdictionOptions = Array.from(new Set(rows.map((row) => row.jurisdiction))).sort();
  const riskOptions = Array.from(new Set(rows.map((row) => row.risk))).sort();

  function toggleSort(key: string) {
    const nextKey = key as keyof EntityTableRow;

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
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div
        className="space-y-5"
        data-epic-07-gate="tenant-scoped-db-query"
        data-epic-07-no-overclaim="true"
        data-epic-07-process="BP-006"
        data-epic-07-surface="queue"
        data-testid="epic-07-entity-core-surface"
      >
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><Epic07ProofAuditDisclosure auditSource="DB readmodel" processId="BP-006" proofSource="tenant query" /><button className={primaryButtonClass} data-testid="j05-create-entity" onClick={() => { void runDataMaintenanceCommand("j05.createEntity", "/entities/new"); }} type="button"><Plus aria-hidden="true" className="size-4" />Create Entity</button></div>}
          count={String(meta?.totalRows ?? rows.length)}
          subtitle="View and manage entities across organizational and investment structures."
          title={title}
        />
        <Card data-testid="epic-07-entity-queue-surface">
          <CardHeader className="grid gap-3 xl:grid-cols-[1fr_auto]">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
	                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
	                  onChange={(event) => {
	                    setSearchTerm(event.target.value);
	                    setPage(1);
	                  }}
	                  placeholder="Search DB-backed entities..."
                  value={searchTerm}
                />
              </div>
	              <DbtfSelect label="All Types" onChange={(value) => { setTypeFilter(value); setPage(1); }} options={typeOptions} value={typeFilter} />
	              <DbtfSelect label="All Jurisdictions" onChange={(value) => { setJurisdictionFilter(value); setPage(1); }} options={jurisdictionOptions} value={jurisdictionFilter} />
	              <DbtfSelect label="All Risk" onChange={(value) => { setRiskFilter(value); setPage(1); }} options={riskOptions} value={riskFilter} />
            </div>
            <div className="flex h-11 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Tenant permitted
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-5">
	              <MetricCard detail="Tenant DB rows matching backend query" label="Entities" value={String(meta?.totalRows ?? rows.length)} />
	              <MetricCard detail="Backend page rows returned" label="Visible" value={String(meta?.returnedRows ?? rows.length)} />
              <MetricCard detail="Seeded high-risk rows" label="High Risk" status="FAILED" value={String(rows.filter((row) => row.risk.toLowerCase().includes("high")).length)} />
              <MetricCard detail="Rows needing evidence" label="Evidence" status="PENDING" value={String(rows.filter((row) => row.missingDocs !== "All good").length)} />
              <MetricCard detail="No static entity arrays" label="Source" status="ACTIVE" value="DB" />
            </div>
            <DataTable
              columns={entityColumns}
              emptyMessage={loadState === "error" ? "Entities could not be loaded from the DB." : "No DB-backed entities match this search and filter set."}
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
  options: DocumentFilterOption[];
  testId: string;
  value: string;
}) {
  return (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        className="h-9 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm font-normal text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
        data-testid={testId}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={value}
      >
        <option value="all">All {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
  { key: "visibilityStatus", header: "Visibility", render: (row) => <Badge tone={toneFor(row.visibilityStatus)}>{row.visibilityStatus}</Badge>, sortable: true },
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
      <div
        className="space-y-5"
        data-epic-07-gate="wizard-validation-before-db-write"
        data-epic-07-no-overclaim="true"
        data-epic-07-process="BP-006"
        data-epic-07-surface="step"
        data-testid="epic-07-entity-step-surface"
      >
        <SectionTitle
          action={<Epic07ProofAuditDisclosure auditSource="POST /api/entities" processId="BP-006" proofSource="wizard validation" />}
          subtitle="Build a new entity record with ownership, jurisdiction and supporting evidence."
          title={title}
        />
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
                "Participants handled in later DBTF release",
                "Evidence upload remains separate"
              ].map((item) => (
                <div className="flex items-center gap-2 text-sm" key={item}>
                  {item.includes("required") || item.includes("needed") || item.includes("later") || item.includes("separate") ? <AlertTriangle aria-hidden="true" className="size-4 text-alphavest-gold" /> : <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />}
                  <span className="text-alphavest-muted">{item}</span>
                </div>
              ))}
              <StatePanel detail={issues.length > 0 ? issues.join(", ") : message} state={issues.length > 0 ? "restricted" : "success"} title="Wizard state" />
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
      <StatePanel
        detail="Entity details are shown as client-safe profile information. Changes that affect visibility or advice remain unavailable until the team completes its review."
        state="restricted"
        title="Client-safe entity profile"
      />
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
                <span className={secondaryButtonClass} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">More actions held</span>
                <button className={primaryButtonClass} data-testid="j05-edit-entity" onClick={() => { void runDataMaintenanceCommand("j05.editEntity", "/wealth-map?state=drawer"); }} type="button">Edit Entity</button>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sensitivityFilter, setSensitivityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof DocumentTableRow>("updated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const { documents, loadState, meta } = usePersistedUploadDocuments({
    page,
    pageSize: 2,
    q: searchTerm,
    sensitivity: sensitivityFilter,
    sortDirection,
    sortKey: documentApiSortKey(sortKey),
    status: statusFilter,
    type: typeFilter,
  });
  const persistedRows = toDocumentRows(documents, session.tenant.displayName);
  const rows: DocumentTableRow[] = persistedRows;
  const typeOptions = documentTypeFilterOptions;
  const statusOptions = documentStatusFilterOptions;
  const sensitivityOptions = documentSensitivityFilterOptions;
  const scopedRowSummary =
    meta
      ? `${meta.returnedRows} of ${meta.totalRows} backend-scoped documents visible`
      : `${rows.length} scoped documents visible`;

  function toggleSort(key: string) {
    const nextKey = key as keyof DocumentTableRow;

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
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-2">
        <EvidenceLifecycleAreaEntry />
        <Card density="compact">
          <CardHeader className="space-y-2 pb-2">
            <div className="grid gap-2 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
                  className="h-9 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
                  data-testid="p10-document-search"
	                  onChange={(event) => {
	                    setSearchTerm(event.target.value);
	                    setPage(1);
	                  }}
                  placeholder="Search documents by name or keyword..."
                  value={searchTerm}
                />
              </div>
              <div className="flex h-9 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted">
                <ShieldCheck aria-hidden="true" className="size-4" />
                DB-backed saved view
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-5">
	              <DocumentFilterSelect label="Types" onChange={(value) => { setTypeFilter(value); setPage(1); }} options={typeOptions} testId="p10-document-type-filter" value={typeFilter} />
	              <DocumentFilterSelect label="Statuses" onChange={(value) => { setStatusFilter(value); setPage(1); }} options={statusOptions} testId="p10-document-status-filter" value={statusFilter} />
	              <DocumentFilterSelect label="Sensitivities" onChange={(value) => { setSensitivityFilter(value); setPage(1); }} options={sensitivityOptions} testId="p10-document-sensitivity-filter" value={sensitivityFilter} />
              <button
                aria-disabled="true"
                className="flex h-9 cursor-not-allowed items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-sm text-alphavest-muted opacity-65"
                data-ux-data-surface-filter-state="disabled_static"
                data-ux-disabled-message="explicit"
                data-ux-disabled-reason="Entity scope is fixed to the current tenant and role."
                data-ux-e10-filter-exception-id="DSF-008"
                data-ux-interactive="false"
                disabled
                title="Entity access is fixed to the current tenant and role."
                type="button"
              >
                <span className="truncate">Permitted Entities</span>
                <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-subtle" />
              </button>
              <button
                aria-disabled="true"
                className="flex h-9 cursor-not-allowed items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-sm text-alphavest-muted opacity-65"
                data-ux-data-surface-filter-state="disabled_static"
                data-ux-disabled-message="explicit"
                data-ux-disabled-reason="Access filtering is fixed to the current actor."
                data-ux-e10-filter-exception-id="DSF-008"
                data-ux-interactive="false"
                disabled
                title="Access filtering is fixed to the current actor."
                type="button"
              >
                <span className="truncate">Accessible to Me</span>
                <Shield aria-hidden="true" className="size-4 text-alphavest-subtle" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="mt-2 space-y-2">
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-1.5 text-xs text-alphavest-muted" data-testid="p10-document-filter-summary">
              {scopedRowSummary}. Hidden or cross-tenant rows are not disclosed.
            </div>
            <DataTable
              compact
              columns={documentColumns}
              emptyMessage={
                loadState === "error"
                  ? "Documents could not be loaded from the DB."
                  : "No permitted documents match the current search and filters."
              }
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
    </>
  );
}

function EvidenceLifecycleAreaEntry() {
  const routeContract = evidenceLifecycleRouteContractForScreen("S027");
  const routeAttributes = evidenceLifecycleRouteAttributesForScreen("S027");
  const ownedProcessIds: readonly string[] = routeContract.ownedProcesses;
  const ownedProcesses = evidenceLifecycleProcessContracts.filter((process) =>
    ownedProcessIds.includes(process.processId),
  );
  const visibleProcesses = ownedProcesses.slice(0, 4);

  return (
    <section
      {...routeAttributes}
      aria-label="Evidence lifecycle area entry"
      className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5"
      data-testid="epic08-evidence-lifecycle-area-entry"
    >
      <div className="grid gap-2 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">Evidence lifecycle</Badge>
            <Badge tone="blue">Client safe</Badge>
            <Badge tone="muted">Document intake</Badge>
            <Badge data-testid="p10-p14-documents-closure" tone="green">Closure-safe</Badge>
          </div>
          <h3 className="mt-1.5 text-sm font-semibold text-alphavest-ivory">Evidence lifecycle workload</h3>
          <p className="mt-0.5 max-w-3xl text-xs leading-5 text-alphavest-muted">{routeContract.primaryJob}</p>
        </div>
        <button
          className={primaryButtonClass + " h-9 self-start"}
          data-testid="j04-open-upload-document"
          data-ux-epic08-next-action="upload_scoped_evidence"
          onClick={() => { void runDataMaintenanceCommand("j04.openUploadDocument", "/documents/upload"); }}
          type="button"
        >
          <Upload aria-hidden="true" className="size-4" />
          Upload evidence
        </button>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {visibleProcesses.map((process) => {
          const state = evidenceLifecycleStateContracts[process.primaryState];

          return (
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" data-ux-epic08-process={process.processId} key={process.processId}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-alphavest-muted">{process.processId}</span>
                <Badge tone={process.primaryState === "INSUFFICIENT_REREQUESTED" ? "red" : process.primaryState === "UPLOAD_RECEIVED" ? "green" : "gold"}>
                  {state.label}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm font-semibold leading-5 text-alphavest-ivory">{process.name}</p>
              <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">{state.nextAction}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EvidenceLifecycleCoreSurface({
  screenId,
  surfaceKind,
}: {
  screenId: EvidenceLifecycleRouteScreenId;
  surfaceKind: "queue" | "detail" | "step";
}) {
  const routeContract = evidenceLifecycleRouteContractForScreen(screenId);
  const routeAttributes = evidenceLifecycleRouteAttributesForScreen(screenId);
  const proofBoundary = evidenceLifecycleProofBoundaryForScreen(screenId);
  const ownedProcessIds: readonly string[] = routeContract.ownedProcesses;
  const processCards = evidenceLifecycleProcessContracts
    .filter((process) => ownedProcessIds.includes(process.processId))
    .slice(0, 3);

  return (
    <section
      {...routeAttributes}
      className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5"
      data-testid={`epic08-core-surface-${screenId.toLowerCase()}`}
      data-ux-epic08-core-surface={surfaceKind}
    >
      <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gold">Evidence lifecycle</Badge>
            <Badge tone="blue">Review surface</Badge>
            <Badge tone="muted">{surfaceKind}</Badge>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-alphavest-ivory">{routeContract.primaryJob}</p>
          <p className="mt-0.5 text-xs leading-5 text-alphavest-muted">{routeContract.nextPermittedAction}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {processCards.map((process) => {
            const state = evidenceLifecycleStateContracts[process.primaryState];

            return (
              <div className="min-w-[10rem] rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" key={process.processId}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-alphavest-muted">{process.processId}</span>
                  <Badge tone={process.primaryState === "REVIEW_PENDING" ? "gold" : process.primaryState === "UPLOAD_RECEIVED" ? "green" : "muted"}>{state.label}</Badge>
                </div>
                <p className="mt-1 text-xs leading-4 text-alphavest-muted">{process.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <details
        className="mt-2 rounded-md border border-alphavest-border/70 bg-alphavest-midnight/45 px-2 py-1.5 text-xs text-alphavest-muted"
        data-testid={`epic08-proof-boundary-${screenId.toLowerCase()}`}
        data-ux-epic08-audit-failure-mode={proofBoundary.auditFailureMode}
        data-ux-epic08-audit-required-steps={proofBoundary.auditRequiredStepIds.join(" ")}
        data-ux-epic08-client-safe-payload={proofBoundary.clientSafePayload}
        data-ux-epic08-proof-boundary="collapsed_drawer"
        data-ux-no-overclaim="true"
      >
        <summary className="cursor-pointer font-semibold text-alphavest-ivory">Audit boundary</summary>
        <p className="mt-1 leading-5">
          audit checks fail closed; client-facing content stays redacted summary only. Blocked claims: {proofBoundary.forbiddenOverclaims.join(", ")}.
        </p>
      </details>
    </section>
  );
}

function DocumentsPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="027">
      <WorksurfaceShell
        density="compact"
        description="Document intake overview with upload, projection and review boundaries made explicit."
        eyebrow="Evidence"
        primary={<DocumentsPageContent title={title} />}
        routeId="027"
        safetyNote="The document hub lists permitted intake state only; it cannot mark review complete, prove sufficiency or release content."
        statusItems={[
          { label: "Surface", tone: "blue", value: "Document hub" },
          { label: "Lifecycle", tone: "gold", value: "intake overview" },
        ]}
        title={title}
        worksurfaceId="evidence-document-hub"
      />
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
  const { documents, loadState, refresh, rememberUploadedDocument } = usePersistedUploadDocuments();
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
    setMessage(
      file
        ? `${file.name} selected for upload intake only. Evidence sufficiency, release, export and client visibility remain locked.`
        : "Select a file to start document intake.",
    );
  }

  async function submitUpload() {
    const fileForUpload = selectedFile ?? fileInputRef.current?.files?.item(0) ?? null;

    if (!fileForUpload) {
      setUploadState("error");
      setMessage("Select a supported source file before upload can start. No evidence, audit, release, export or client visibility state changed.");
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
    setMessage("Uploading the file. Review routing, evidence sufficiency, release, export and client visibility remain locked until later gates pass.");

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refresh();
      rememberUploadedDocument(body.result.document);
      setUploadState("success");
      setMessage(`${body.result.document.fileName} upload completed. Upload complete - evidence review pending. Evidence sufficiency, release, export and client visibility remain locked. Lifecycle: ${labelFromEnum(body.result.document.evidenceLifecycleStatus ?? "extraction_pending")}. ${uxFeedbackSuccessMessageForSubject("upload")}`);
    } catch (error) {
      setUploadState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  const latestDocument = documents[0];
  const hasSelectedFile = Boolean(selectedFile);
  const uploadLifecycleStatus = uploadState === "uploading" ? "loading" : uploadState;
  const uploadValidationState = hasSelectedFile ? "valid-file-selected" : "blocked-file-required";
  const uploadValidationMessage = hasSelectedFile
    ? "Ready to upload this source document for extraction review. Upload creates pending internal evidence and audit only; upload complete means evidence review pending."
    : "Upload remains blocked until a source file is selected. No evidence, audit, release, export or client visibility changes occur.";
  const canUpload = hasSelectedFile && uploadState !== "uploading";

  return (
    <div
      className="grid gap-2 xl:grid-cols-[0.95fr_1.25fr_18rem]"
      data-testid="uxp3-document-upload-lifecycle"
      data-ux-lifecycle-status={uploadLifecycleStatus}
      data-ux-lifecycle-validation={uploadValidationState}
      data-ux-no-overclaim="true"
    >
      <Card density="compact">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Upload Source</CardTitle></CardHeader>
        <CardContent className="mt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {["My Device", "Email Import", "Cloud Storage", "Scanner"].map((item, index) => (
              <button className={cn("h-9 rounded-md border text-xs", index === 0 ? "border-alphavest-gold bg-alphavest-gold/12 text-alphavest-gold" : "border-alphavest-border text-alphavest-muted")} disabled={index !== 0} key={item} type="button">{item}</button>
            ))}
          </div>
          <label
            className={cn(
              "grid min-h-28 cursor-pointer place-items-center rounded-md border border-dashed bg-alphavest-navy/35 p-3 text-center transition focus-within:border-alphavest-gold",
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
              aria-describedby="document-upload-validation"
              className="sr-only"
              data-testid="document-upload-file-input"
              data-ux-lifecycle-result="selects-upload-file-only"
              data-ux-lifecycle-trigger="document-upload-file-input"
              onChange={(event) => selectFile(event.target.files)}
              onInput={(event) => selectFile(event.currentTarget.files)}
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.tif,.tiff,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,image/png,image/jpeg,image/tiff"
            />
            <div>
              <Upload aria-hidden="true" className="mx-auto size-7 text-alphavest-gold" />
              <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Drop source file</p>
              <p className="mt-0.5 text-xs text-alphavest-muted">PDF, DOCX, XLSX, CSV, PNG, JPG, TIFF</p>
              <span className={secondaryButtonClass + " mt-2 h-9"}>Choose Files</span>
            </div>
          </label>
          {selectedFile ? (
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2" data-testid="document-upload-latest-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-alphavest-ivory">{selectedFile.name}</p>
                  <p className="text-sm text-alphavest-muted">{formatBytes(selectedFile.size)}</p>
                </div>
                <Badge tone="gold">Ready</Badge>
              </div>
            </div>
          ) : null}
          <NoOverclaimFeedback
            id="document-upload-validation"
            intent={hasSelectedFile ? "pending" : "validation"}
            message={uploadValidationMessage}
            subject="upload"
            testId="document-upload-validation-state"
          />
          {uploadState === "error" ? (
            <div className="rounded-md border border-alphavest-red/40 bg-alphavest-red/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-semibold text-alphavest-ivory">Upload unavailable</p><p className="text-sm text-alphavest-muted">{message}</p></div>
                <Badge tone="red">Review</Badge>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card density="compact">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Document Details</CardTitle></CardHeader>
        <CardContent className="mt-2 grid gap-2 md:grid-cols-2">
          <label className="grid gap-1 text-xs">
            <span className="text-alphavest-muted">Document Type</span>
            <select className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
              <option value="financial_statement">Financial Statement</option>
              <option value="trust_deed">Trust Deed</option>
              <option value="tax_residency_certificate">Tax Residency Certificate</option>
              <option value="kyc_document">KYC Document</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-alphavest-muted">Sub Type</span>
            <input className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setSubType(event.target.value)} value={subType} />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-alphavest-muted">Link to Entity / Asset</span>
            <input className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setLinkedObjectLabel(event.target.value)} value={linkedObjectLabel} />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-alphavest-muted">Period</span>
            <input className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setPeriodLabel(event.target.value)} value={periodLabel} />
          </label>
          <label className="grid gap-1 text-xs md:col-span-2">
            <span className="text-alphavest-muted">Notes</span>
            <textarea className="min-h-14 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Add any notes about this document..." value={notes} />
          </label>
          <ActionZone className="md:col-span-2 md:grid-cols-3" layout="stack" placement="inline_cluster" testId="e05-document-upload-action-zone">
            <ActionButton
              availability={canUpload ? "enabled" : "disabled"}
              className="w-full"
              describedBy="document-upload-validation"
              disabled={!canUpload}
              disabledReason={!canUpload ? "Select a supported source file before upload can start." : undefined}
              lifecycleResult={canUpload ? "submits-upload-for-review" : "blocked-validation-required"}
              meaning="submit_review"
              onClick={() => { void submitUpload(); }}
              priority="primary"
              requiresAudit
              testId="real-upload-document"
              visibleDisabledReason
            >
              <Upload aria-hidden="true" className="size-4" />
              Upload for review
            </ActionButton>
            <ActionButton
              availability={uploadState === "uploading" ? "disabled" : "enabled"}
              className="w-full"
              disabled={uploadState === "uploading"}
              disabledReason={uploadState === "uploading" ? "Upload is in progress. Extraction review navigation stays blocked until this upload attempt finishes." : undefined}
              lifecycleResult="opens-review-queue-without-release"
              meaning="navigate"
              onClick={() => { void runDataMaintenanceCommand("j04.uploadDocument", "/documents/review-queue"); }}
              priority="secondary"
              testId="j04-upload-document"
            >
              Open extraction review
            </ActionButton>
          </ActionZone>
        </CardContent>
      </Card>
      <Card density="compact">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Upload Status</CardTitle></CardHeader>
        <CardContent className="mt-2 space-y-2">
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
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4" data-testid="document-upload-latest-card">
              <p className="text-sm font-semibold text-alphavest-ivory">{latestDocument.fileName ?? latestDocument.title}</p>
              <p className="mt-1 text-xs text-alphavest-muted">{latestDocument.fileSizeBytes ? formatBytes(latestDocument.fileSizeBytes) : "Size hidden"} · {labelFromEnum(latestDocument.status)}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Version: v{latestDocument.latestVersionNumber ?? 1} of {latestDocument.versionCount ?? 1} · checksum evidence stored internally</p>
              <p className="mt-2 text-xs text-alphavest-muted">Lifecycle: {labelFromEnum(latestDocument.evidenceLifecycleStatus ?? "review_pending")}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Extraction: {latestDocument.extractionStatus ?? "pending"}</p>
            </div>
          ) : (
            <StatePanel detail={loadState === "error" ? "Uploads could not be loaded." : "No uploads yet."} state={loadState === "error" ? "error" : "empty"} title="Recent Uploads" />
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
      <WorksurfaceShell
        density="compact"
        description="Upload intake keeps file submission separate from extraction review, evidence sufficiency and release."
        eyebrow="Evidence"
        primary={
          <div className="space-y-2">
            <EvidenceLifecycleCoreSurface screenId="S028" surfaceKind="step" />
            <DocumentUploadForm />
          </div>
        }
        routeId="028"
        safetyNote="Upload can create a pending review item only. It cannot complete evidence review, export approval or client visibility."
        statusItems={[
          { label: "Surface", tone: "blue", value: "Upload intake" },
          { label: "Lifecycle", tone: "gold", value: "upload intake" },
        ]}
        title={title}
        worksurfaceId="evidence-upload-intake"
      />
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

  async function submitReview(action: "mark_reviewed" | "request_clarification" | "accept_sufficiency") {
    if (!latestDocument || reviewState === "submitting") {
      return;
    }

    setReviewState("submitting");
    setMessage(
      action === "accept_sufficiency"
        ? "Checking scoped evidence sufficiency."
        : action === "request_clarification"
          ? "Requesting clarification and keeping evidence insufficient."
          : "Saving extraction review and evidence link.",
    );

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
      const body = (await response.json()) as { error?: string; issues?: string[]; reason?: string; result?: { evidenceLifecycleStatus?: string; evidenceStatus?: string; safety?: { evidenceSufficiency: boolean } } };

      if (!response.ok || !body.result) {
        throw new Error(body.issues?.join(", ") || body.reason || body.error || "Evidence review failed.");
      }

      setReviewState("success");
      setMessage(
        body.result.safety?.evidenceSufficiency
          ? "Evidence accepted for this review check. Release, export and client visibility remain locked."
          : body.result.evidenceLifecycleStatus === "insufficient"
            ? "Clarification requested. Evidence is insufficient and release, export and client visibility remain locked."
            : "Document reviewed and linked. Evidence remains review-gated and not client-visible.",
      );
      await refresh();
    } catch (error) {
      setReviewState("error");
      setMessage(error instanceof Error ? error.message : "Evidence review failed.");
    }
  }

  return (
    <Card density="compact">
      <CardHeader className="pb-2"><CardTitle className="text-lg">Review & Sufficiency</CardTitle></CardHeader>
      <CardContent className="mt-2 space-y-2">
        {latestDocument ? (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2" data-testid="document-review-latest-card">
            <p className="text-sm font-semibold text-alphavest-ivory">Selected upload</p>
            <p className="mt-0.5 text-xs text-alphavest-muted">
              Document: {labelFromEnum(latestDocument.status)} · Evidence: {latestDocument.evidenceStatus ? labelFromEnum(latestDocument.evidenceStatus) : "Created"}
            </p>
            <p className="mt-0.5 text-xs text-alphavest-muted">Version: v{latestDocument.latestVersionNumber ?? 1} of {latestDocument.versionCount ?? 1} · checksum evidence stored internally</p>
            <p className="mt-0.5 text-xs text-alphavest-muted">Lifecycle: {labelFromEnum(latestDocument.evidenceLifecycleStatus ?? "review_pending")} · Visibility: Redacted</p>
          </div>
        ) : (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-xs text-alphavest-muted">
            {loadState === "loading" ? "Fetching uploaded documents." : loadState === "error" ? "Uploads unavailable." : "Upload a document before review can continue."}
          </div>
        )}
        <label className="grid gap-2 text-sm">
          <span className="text-alphavest-muted">Reviewer Notes</span>
          <textarea
            className="min-h-14 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
            maxLength={1000}
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </label>
        <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-xs text-alphavest-muted" data-ux-epic08-review-state={reviewState}>
          {message}
        </div>
        <div className="grid gap-2">
          <button className={secondaryButtonClass + " w-full"} data-testid="phase3-request-clarification" disabled={!latestDocument || reviewState === "submitting"} onClick={() => { void submitReview("request_clarification"); }} type="button">Request clarification</button>
          <button className={secondaryButtonClass + " w-full"} data-testid="phase3-mark-reviewed" disabled={!latestDocument || reviewState === "submitting"} onClick={() => { void submitReview("mark_reviewed"); }} type="button">Mark Reviewed & Link Evidence</button>
          <button className={primaryButtonClass + " w-full"} data-testid="phase3-accept-sufficiency" disabled={!latestDocument || reviewState === "submitting"} onClick={() => { void submitReview("accept_sufficiency"); }} type="button">Run sufficiency check</button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExtractionReviewWorkbench() {
  const { documents, loadState } = usePersistedUploadDocuments();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const selectedDocument = documents.find((document) => document.id === selectedDocumentId) ?? documents[0];

  useEffect(() => {
    if (!documents.length) {
      setSelectedDocumentId(undefined);
      return;
    }

    if (!selectedDocumentId || !documents.some((document) => document.id === selectedDocumentId)) {
      setSelectedDocumentId(documents[0].id);
    }
  }, [documents, selectedDocumentId]);

  const master = (
    <div className="space-y-3" data-testid="s029-extraction-master-list">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-alphavest-ivory">Extraction queue</p>
        <Badge tone="blue">{documents.length || 0} items</Badge>
      </div>
      {documents.length ? (
        documents.slice(0, 5).map((document, index) => {
          const selected = selectedDocument?.id === document.id;

          return (
            <button
              className={cn(
                "w-full rounded-md border p-3 text-left transition",
                selected ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35 hover:border-alphavest-gold/60",
              )}
              data-ux-field-priority="identity primary_status evidence_gate risk_due"
              data-ux-queue-row={document.id}
              data-ux-queue-selected={selected ? "true" : "false"}
              key={document.id}
              onClick={() => setSelectedDocumentId(document.id)}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-alphavest-ivory">{document.fileName ?? document.title}</span>
                  <span className="mt-1 block text-xs text-alphavest-muted">
                    Lifecycle: {labelFromEnum(document.evidenceLifecycleStatus ?? "review_pending")} · Extraction: {document.extractionStatus ?? "pending"}
                  </span>
                </span>
                <Badge tone={index === 0 ? "gold" : "muted"}>{index === 0 ? "current" : "queued"}</Badge>
              </span>
              <span className="mt-2 block text-xs text-alphavest-muted">
                Blocker: human review and sufficiency check required before release/export/client visibility.
              </span>
            </button>
          );
        })
      ) : (
        <StatePanel
          detail={loadState === "loading" ? "Fetching uploaded documents." : "Upload a document before extraction review can continue."}
          state={loadState === "error" ? "error" : "empty"}
          title={loadState === "error" ? "Extraction queue unavailable" : "No extraction queue items"}
        />
      )}
    </div>
  );

  const detail = (
    <div data-testid="s029-extraction-selected-detail">
      <Card density="compact" data-ux-queue-proof-drawer="true">
        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-lg">{selectedDocument ? "Selected upload" : "No selected upload"}</CardTitle><Badge>Review</Badge></CardHeader>
        <CardContent className="mt-2 grid gap-2 md:grid-cols-3">
          {[
            ["Extraction", selectedDocument ? labelFromEnum(selectedDocument.extractionStatus ?? "pending") : "Empty", "Draft fields only"],
            ["Review", selectedDocument ? "Pending" : "Blocked", "Human review required"],
            ["Boundary", "Locked", "No release/export/client visibility"],
          ].map(([label, value, detail]) => (
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" key={label}>
              <p className="text-xs text-alphavest-muted">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-alphavest-ivory">{value}</p>
              <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">{detail}</p>
            </div>
          ))}
          {extractionFields.slice(0, 2).flatMap((section) => section.fields.slice(0, 2).map(([label, value, confidence]) => (
            <div className={cn("rounded-md border p-2", confidence === "Low" ? "border-alphavest-red/60" : "border-alphavest-border") } key={`${section.section}-${label}`}>
              <div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate whitespace-nowrap text-xs text-alphavest-muted">{label}</span><Badge tone={toneFor(confidence)}>{confidence}</Badge></div>
              <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
            </div>
          )))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MasterDetailSurface
      actionPolicy="command_handoff"
      actionRail="present"
      className="space-y-4"
      density="compact_operations"
      detail={detail}
      family="queue"
      filterState={documents.length ? "inactive" : "disabled_static"}
      master={master}
      masterDetailMode="inline_detail_rail"
      proofPlacement="proof_drawer"
      queueWorkbench
      selectedObjectId={selectedDocument?.id ?? "s029-empty-queue"}
      selectedObjectState={selectedDocument?.evidenceLifecycleStatus ?? "empty"}
      stickyRail
    />
  );
}

function ExtractionReviewPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="029">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        density="compact"
        description="Human review of extracted draft fields before any permitted evidence sufficiency check."
        eyebrow="Evidence"
        primary={
          <div className="space-y-2">
            <EvidenceLifecycleCoreSurface screenId="S029" surfaceKind="queue" />
            <div className="grid items-start gap-2 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <ExtractionReviewWorkbench />
              <ExtractionReviewActionPanel />
            </div>
          </div>
        }
        routeId="029"
        safetyNote="Extraction review resolves draft data quality only; final evidence, release, export and client visibility stay gated."
        statusItems={[
          { label: "Surface", tone: "blue", value: "Extraction review" },
          { label: "Lifecycle", tone: "gold", value: "human review" },
        ]}
        title={title}
        worksurfaceId="evidence-extraction-review"
      />
    </ClientShell>
  );
}

function VerificationPendingPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="030">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        density="compact"
        description="Pending verification state for submitted evidence, review SLA and clarification work."
        eyebrow="Evidence"
        primary={
          <div className="space-y-2">
            <EvidenceLifecycleCoreSurface screenId="S030" surfaceKind="detail" />
            <section
              className="grid gap-2 xl:grid-cols-[1fr_20rem]"
              data-testid="epic08-s030-verification-step"
              data-ux-epic08-client-release="locked"
              data-ux-epic08-evidence-sufficiency="not_claimed"
              data-ux-no-overclaim="true"
            >
              <Card density="compact">
                <CardHeader className="pb-2"><CardTitle className="text-lg">Verification step</CardTitle></CardHeader>
                <CardContent className="mt-2 grid gap-2 md:grid-cols-3">
                  <MetricCard detail="Human review in progress" label="Status" status="PENDING" value="Pending" />
                  <MetricCard detail="Clarification required before sufficiency" label="Blocker" status="FAILED" value="1 item" />
                  <MetricCard detail="No release/export/client visibility" label="Boundary" status="PROCESSING" value="Locked" />
                </CardContent>
              </Card>
              <Card density="compact">
                <CardHeader className="pb-2"><CardTitle className="text-lg">Next safe action</CardTitle></CardHeader>
                <CardContent className="mt-2 space-y-2">
                  <StatePanel detail="Resolve the verification blocker or request clarification. Pending review is not acceptance." state="restricted" title="clarification check" />
                  <button className={secondaryButtonClass + " w-full"} data-testid="j04-view-details" onClick={() => { void runDataMaintenanceCommand("j04.viewDetails"); }} type="button">View Details</button>
                </CardContent>
              </Card>
            </section>
          </div>
        }
        routeId="030"
        safetyNote="Verification pending means human review is in progress; it is not final validation, evidence sufficiency or client release."
        statusItems={[
          { label: "Surface", tone: "blue", value: "Verification" },
          { label: "Lifecycle", tone: "red", value: "review pending" },
        ]}
        title={title}
        worksurfaceId="evidence-verification-pending"
      />
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
