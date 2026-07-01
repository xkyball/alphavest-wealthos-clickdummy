"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
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
import { ActorSessionProvider, useActorSession } from "@/components/actor-session-provider";
import { GlobalSearchBox } from "@/components/global-search-box";
import { ProcessSidebar } from "@/components/process-navigation";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { WorksurfaceShell } from "@/components/worksurface-shell";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ClientSafeUiBoundary,
  DataTable,
  FilterBar,
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
  governancePreferences
} from "@/lib/client-intake-seed-data";
import type { DbtfEntityDetail } from "@/lib/dbtf-table-service";
import type { ScreenRoute } from "@/lib/route-registry";
import { runDataMaintenanceCommand } from "@/lib/data-maintenance-command-client";
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import {
  evidenceLifecycleProcessContracts,
  evidenceLifecycleRouteAttributesForScreen,
  evidenceLifecycleRouteContractForScreen,
  evidenceLifecycleStateContracts,
  type EvidenceLifecycleRouteScreenId,
} from "@/lib/evidence-lifecycle-contract";
import { uxActionClassForPriority } from "@/lib/ux-action-hierarchy-contract";
import {
  buildDomainHReleasedDecisionReadModel,
  domainHUnreleasedDecisionPayload,
} from "@/lib/domain-h-released-projection-contract";

type ClientIntakeScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass = uxActionClassForPriority("primary");
const secondaryButtonClass = uxActionClassForPriority("secondary");
const defaultPageSize = 10;

type DataSurfaceMeta = BackendDataSurfaceMeta<string>;
type DocumentReviewSortKey = "documentType" | "evidenceLifecycleStatus" | "fileName" | "sensitivity" | "status" | "title" | "uploadedAt";
type DocumentFilterOption = {
  label: string;
  value: string;
};

type PersistedUploadDocument = {
  checksum?: string;
  documentType: string;
  evidenceLifecycleStatus?: string | null;
  evidenceRecordId: string | null;
  evidenceRequestState?: string | null;
  evidenceStatus: string | null;
  evidenceVisibilityStatus: string | null;
  extractionStatus?: string | null;
  fileName?: string;
  fileSizeBytes?: number;
  id: string;
  latestVersionNumber?: number | null;
  mimeType?: string;
  previewStatus?: string | null;
  previewUrl?: string | null;
  securityScanLabel?: string | null;
  securityScanStatus?: string | null;
  sensitivity?: string;
  status: string;
  targetObjectId?: string | null;
  targetObjectType?: string | null;
  thumbnailStatus?: string | null;
  thumbnailUrl?: string | null;
  title: string;
  uploadedAt: string;
  versionCount?: number | null;
};

type DocumentTableRow = {
  entity: string;
  id: string;
  name: string;
  previewStatus: string;
  previewUrl: string | null;
  securityScan: string;
  sensitivity: string;
  status: string;
  thumbnailUrl: string | null;
  type: string;
  updated: string;
};

type FamilyMemberTableRow = {
  contextReadinessReasons: string[];
  contextReadinessState: "blocked" | "incomplete" | "ready";
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
  contextReadinessReasons: string[];
  contextReadinessState: "blocked" | "incomplete" | "ready";
  href: string;
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

type RelationshipTableRow = {
  confidence: string;
  contextReadinessReasons: string[];
  contextReadinessState: "blocked" | "incomplete" | "ready";
  evidence: string;
  from: string;
  id: string;
  payloadMode: string;
  readiness: string;
  relationship: string;
  since: string;
  status: string;
  to: string;
  type: string;
  updatedAt: string;
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

type ClientHomeWorkItem = {
  href: string;
  id: string;
  label: string;
  meta: string;
  status: string;
};

type ClientHomeWorkReadModel = {
  activities: ClientHomeWorkItem[];
  openWork: ClientHomeWorkItem[];
  sourceTruth: "workflow_db_readmodel";
};

type ClientSafeEvidenceSummary = {
  allowed: boolean;
  fields: string[];
  reasonCode?: string;
  summary?: string | null;
  title?: string;
};

type EntityFacets = {
  jurisdictions: string[];
  risks: string[];
  types: string[];
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

function documentDerivativeUrl(pathname: string | null | undefined, session: { role: { key: string }; tenant: { slug: string } }) {
  if (!pathname) return null;

  const params = new URLSearchParams({
    roleKey: session.role.key,
    tenantSlug: session.tenant.slug,
  });

  return `${pathname}?${params.toString()}`;
}

function toDocumentRows(documents: PersistedUploadDocument[], entityLabel: string, session: { role: { key: string }; tenant: { slug: string } }): DocumentTableRow[] {
  return documents.map((document) => ({
    entity: entityLabel,
    id: document.id,
    name: document.fileName ?? document.title,
    previewStatus: document.thumbnailStatus ?? document.previewStatus ?? "MISSING",
    previewUrl: documentDerivativeUrl(document.previewUrl, session),
    securityScan: document.securityScanStatus === "PASSED" ? "Scan complete" : "Scan pending",
    sensitivity: document.sensitivity ? labelFromEnum(document.sensitivity) : "Client Safe",
    status: labelFromEnum(document.status),
    thumbnailUrl: documentDerivativeUrl(document.thumbnailUrl, session),
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
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [documents, setDocuments] = useState<PersistedUploadDocument[]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const refreshSequenceRef = useRef(0);
  const scopeKeyRef = useRef(`${tenantSlug}:${roleKey}`);

  const refresh = useCallback(async () => {
    const refreshSequence = refreshSequenceRef.current + 1;
    refreshSequenceRef.current = refreshSequence;
    const scopeKey = `${tenantSlug}:${roleKey}`;
    const scopeChanged = scopeKeyRef.current !== scopeKey;
    scopeKeyRef.current = scopeKey;
    setLoadState("loading");
    if (scopeChanged) {
      setDocuments([]);
    }

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
    if (value && (value !== "all" || key === "source")) {
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
  const { session } = useActorSession();
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

function useClientHomeWorkItems() {
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [readModel, setReadModel] = useState<ClientHomeWorkReadModel | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch(
          `/api/client-work-items?tenantSlug=${encodeURIComponent(tenantSlug)}&roleKey=${encodeURIComponent(roleKey)}`,
          { cache: "no-store" },
        );
        const body = (await response.json()) as Partial<ClientHomeWorkReadModel>;

        if (!response.ok) {
          throw new Error("Client work items could not be loaded.");
        }

        if (!cancelled) {
          setReadModel({
            activities: body.activities ?? [],
            openWork: body.openWork ?? [],
            sourceTruth: "workflow_db_readmodel",
          });
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setReadModel(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [roleKey, tenantSlug]);

  return { activities: readModel?.activities ?? [], loadState, openWork: readModel?.openWork ?? [] };
}

function useClientSafeEvidenceSummary() {
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const [summary, setSummary] = useState<ClientSafeEvidenceSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch(
        `/api/client-safe-evidence-summary?tenantSlug=${encodeURIComponent(tenantSlug)}`,
        { cache: "no-store" },
      );
      const body = (await response.json()) as { summary?: ClientSafeEvidenceSummary };

      if (!cancelled) {
        setSummary(response.ok ? body.summary ?? null : null);
      }
    }

    void load().catch(() => {
      if (!cancelled) {
        setSummary(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  return summary;
}

function useDbtfClientProfile() {
  const { session } = useActorSession();
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
  const { session } = useActorSession();
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
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<EntityTableRow[]>([]);
  const [facets, setFacets] = useState<EntityFacets>({ jurisdictions: [], risks: [], types: [] });
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
        const body = (await response.json()) as { entities?: EntityTableRow[]; facets?: EntityFacets; meta?: DataSurfaceMeta };

        if (!response.ok) {
          throw new Error("Entity reload failed.");
        }

        if (!cancelled) {
          setRows(body.entities ?? []);
          setFacets(body.facets ?? { jurisdictions: [], risks: [], types: [] });
          setMeta(body.meta ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setFacets({ jurisdictions: [], risks: [], types: [] });
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

  return { facets, loadState, meta, rows };
}

function useDbtfEntityDetail(targetId: string) {
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [entity, setEntity] = useState<DbtfEntityDetail | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!targetId) {
        setEntity(null);
        setLoadState("error");
        return;
      }

      setLoadState("loading");

      try {
        const params = dataSurfaceParams({
          page: 1,
          q: "",
          roleKey,
          sortDirection: "asc",
          sortKey: "name",
          tenantSlug,
        });
        params.set("targetId", targetId);

        const response = await fetch(`/api/entities?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { entity?: DbtfEntityDetail | null };

        if (!response.ok || !body.entity) {
          throw new Error("Entity detail failed to load.");
        }

        if (!cancelled) {
          setEntity(body.entity);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setEntity(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [roleKey, targetId, tenantSlug]);

  return { entity, loadState };
}

function useDbtfRelationships(queryState: {
  page: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
}) {
  const { session } = useActorSession();
  const tenantSlug = session.tenant.slug;
  const roleKey = session.role.key;
  const [rows, setRows] = useState<RelationshipTableRow[]>([]);
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
      const response = await fetch(`/api/relationships?${params.toString()}`, { cache: "no-store" });
      const body = (await response.json()) as { relationships?: RelationshipTableRow[]; meta?: DataSurfaceMeta };

      if (!response.ok) {
        throw new Error("Relationship reload failed.");
      }

      setRows(body.relationships ?? []);
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

  return { loadState, meta, refresh, rows };
}

function readinessLabel(value: "blocked" | "incomplete" | "ready") {
  if (value === "ready") return "Ready";
  if (value === "blocked") return "Blocked";
  return "Incomplete";
}

function readinessDetail(reasons: string[]) {
  if (reasons.length === 0) {
    return "Available for the next internal workflow step.";
  }

  return reasons.map(labelFromEnum).join(", ");
}

function dataSurfaceObjectCount(loadState: "idle" | "loading" | "ready" | "error", meta: DataSurfaceMeta | null, visibleRows: number) {
  if (loadState === "loading" || loadState === "idle") return "Loading";
  if (loadState === "error") return "Unavailable";

  return String(meta?.totalRows ?? visibleRows);
}

function dataSurfaceObjectStatus(loadState: "idle" | "loading" | "ready" | "error", readyStatus: string, visibleRows: number) {
  if (loadState === "loading" || loadState === "idle") return "Loading";
  if (loadState === "error") return "Unavailable";

  return visibleRows > 0 ? readyStatus : "Empty";
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

function IconTile({ children, className, tone = "gold" }: { children: React.ReactNode; className?: string; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold",
    green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/35 bg-teal-300/10 text-teal-200"
  };

  return <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border", toneClass[tone], className)}>{children}</span>;
}

function WorksurfaceInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
      <p className="text-xs text-alphavest-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}

function ClientStatePill({ children, tone = "muted" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/45 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
    green: "border-alphavest-green/40 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-panel/50 text-alphavest-muted",
    purple: "border-alphavest-blue/45 bg-alphavest-blue/10 text-alphavest-blue",
    red: "border-alphavest-red/40 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-alphavest-green/40 bg-alphavest-green/10 text-alphavest-green",
  };

  return (
    <span className={cn("inline-flex min-h-8 min-w-[5.5rem] items-center justify-center rounded-full border px-3 text-xs font-semibold whitespace-nowrap", toneClass[tone])}>
      {children}
    </span>
  );
}

function ClientSidebar() {
  const { session } = useActorSession();

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
  const { session } = useActorSession();

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
    <ActorSessionProvider>
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
    </ActorSessionProvider>
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
            {count ? <span className="ml-3 align-middle"><ClientStatePill tone="gold">{count}</ClientStatePill></span> : null}
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

function ClientSafeProjectionCard({ density = "desktop" }: { density?: "desktop" | "mobile" }) {
  const releasedReadModel = buildDomainHReleasedDecisionReadModel();
  const blockedReadModel = buildDomainHReleasedDecisionReadModel(domainHUnreleasedDecisionPayload);
  const compact = density === "desktop";

  return (
    <Card
      density="compact"
      data-testid="workflow07-client-safe-projection-card"
      data-workflow03-blocked-state={blockedReadModel.ui.state}
      data-workflow03-released-state={releasedReadModel.ui.state}
      data-workflow07-mobile-parity={density === "mobile" ? "true" : "false"}
      data-workflow07-projection-source={releasedReadModel.contractId}
      data-workflow07-projection-state={releasedReadModel.ui.state}
      data-workflow07-safe-clean={String(releasedReadModel.ui.safe)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className={compact ? "text-xl" : undefined}>Governance update</CardTitle>
            <CardDescription className={compact ? "text-xs" : undefined}>{releasedReadModel.ui.title}</CardDescription>
          </div>
          <ClientStatePill tone={releasedReadModel.ui.nextActionEnabled ? "green" : "gold"}>{releasedReadModel.ui.statusLabel}</ClientStatePill>
        </div>
      </CardHeader>
      <CardContent className="mt-2 space-y-2">
        <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2" data-testid="workflow07-client-safe-summary">
          <p className="text-sm font-semibold leading-5 text-alphavest-ivory">{releasedReadModel.ui.summary}</p>
          <p className="mt-1 text-xs text-alphavest-muted">{releasedReadModel.ui.releasedAt}</p>
        </div>
        <span className="sr-only" data-testid="workflow07-client-fail-closed-state" data-workflow03-blocked-state={blockedReadModel.ui.state}>
          {blockedReadModel.ui.statusLabel}
        </span>
      </CardContent>
    </Card>
  );
}

function PortalPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="019">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        density="compact"
        description="Household overview, active requests and released updates."
        eyebrow="Client context"
        primary={<Domain07ClientFamilyEntry />}
        routeId="019"
        safetyNote="Some items are unavailable for this client view."
        statusItems={[
          { label: "Context", tone: "blue", value: "Client home" },
          { label: "Updates", tone: "green", value: "Ready" },
        ]}
        title={title}
        worksurfaceId="client-context-home"
      />
    </ClientShell>
  );
}

function Domain07ClientFamilyEntry() {
  const { session } = useActorSession();
  const clientSafeEvidence = useClientSafeEvidenceSummary();
  const clientWork = useClientHomeWorkItems();
  const metrics = useDbtfDashboardMetrics();
  const family = useDbtfFamilyMembers();
  const relationships = useDbtfRelationships({
    page: 1,
    q: "",
    sortDirection: "asc",
    sortKey: "from",
  });
  const entities = useDbtfEntities({
    jurisdiction: "all",
    page: 1,
    q: "",
    risk: "all",
    sortDirection: "asc",
    sortKey: "name",
    type: "all",
  });
  const documents = usePersistedUploadDocuments({
    page: 1,
    pageSize: 5,
    q: "",
    sensitivity: "all",
    sortDirection: "desc",
    sortKey: "uploadedAt",
    status: "all",
    type: "all",
  });
  const objectRows = [
    {
      count: dataSurfaceObjectCount(family.loadState, family.meta, family.rows.length),
      href: "/client/family-members",
      icon: ClipboardCheck,
      label: "Family contacts",
      meta: "Family directory",
      status: dataSurfaceObjectStatus(family.loadState, "Ready", family.rows.length),
      tone: family.loadState === "error" ? "red" as BadgeTone : family.loadState === "ready" ? "green" as BadgeTone : "blue" as BadgeTone,
    },
    {
      count: dataSurfaceObjectCount(relationships.loadState, relationships.meta, relationships.rows.length),
      href: "/relationships",
      icon: Network,
      label: "Relationship map",
      meta: "Connected family context",
      status: dataSurfaceObjectStatus(relationships.loadState, "Mapped", relationships.rows.length),
      tone: relationships.loadState === "error" ? "red" as BadgeTone : relationships.loadState === "ready" ? "green" as BadgeTone : "blue" as BadgeTone,
    },
    {
      count: dataSurfaceObjectCount(entities.loadState, entities.meta, entities.rows.length),
      href: "/entities",
      icon: Building2,
      label: "Entity links",
      meta: "Trusts and holdings",
      status: dataSurfaceObjectStatus(entities.loadState, "Open", entities.rows.length),
      tone: entities.loadState === "error" ? "red" as BadgeTone : entities.loadState === "ready" ? "green" as BadgeTone : "blue" as BadgeTone,
    },
    {
      count: dataSurfaceObjectCount(documents.loadState, documents.meta, documents.documents.length),
      href: "/documents/upload",
      icon: FileText,
      label: "Evidence documents",
      meta: "Upload and review state",
      status: dataSurfaceObjectStatus(documents.loadState, "Review", documents.documents.length),
      tone: documents.loadState === "error" ? "red" as BadgeTone : documents.loadState === "ready" ? "gold" as BadgeTone : "blue" as BadgeTone,
    },
  ];
  const householdName = session.tenant.displayName;
  const actorContext = `${session.actor.displayName} · ${session.role.label}`;
  const readinessValue = metrics ? `${metrics.readiness}%` : "Loading";
  const evidenceCoverageValue = metrics ? `${metrics.evidenceCoverage}%` : "Loading";
  const intakeSteps = [
    { href: "/client/family-members", label: "Confirm family", state: "Ready" },
    { href: "/relationships", label: "Map relationships", state: "Open" },
    { href: "/entities", label: "Register entities", state: "Needed" },
    { href: "/documents/upload", label: "Request evidence", state: "Next" },
  ];

  return (
    <section
      className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_21rem]"
      data-domain-07-client-visible="projection-only"
      data-domain-07-contract="client_family_context_foundation"
      data-domain-07-no-overclaim="true"
      data-domain-07-primary-entry="S019"
      data-testid="domain-07-client-family-entry"
    >
      <div className="space-y-3">
        <Card density="compact">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">{householdName}</p>
                <CardTitle className="mt-1 text-xl md:text-2xl">{householdName}</CardTitle>
                <CardDescription>{actorContext}</CardDescription>
              </div>
              <Link
                className={primaryButtonClass}
                data-domain-07-primary-cta="true"
                data-testid="domain-07-primary-next-action"
                href="/client/family-members"
              >
                Open family
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="mt-3 grid gap-2 md:grid-cols-4">
            {[
              ["Current user", session.actor.displayName],
              ["Readiness", readinessValue],
              ["Evidence", evidenceCoverageValue],
              ["Jurisdiction", session.tenant.jurisdiction],
            ].map(([label, value]) => (
              <WorksurfaceInfoRow key={label} label={label} value={value} />
            ))}
          </CardContent>
        </Card>

        <Card data-testid="client-intake-continuation-card" density="compact">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <CardTitle className="text-xl">Client intake path</CardTitle>
                <CardDescription className="text-xs">Complete the client context before evidence review starts.</CardDescription>
              </div>
              <ClientStatePill tone="gold">Intake active</ClientStatePill>
            </div>
          </CardHeader>
          <CardContent className="mt-3 grid gap-2 md:grid-cols-4">
            {intakeSteps.map((step, index) => (
              <Link
                className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 transition hover:border-alphavest-gold/60"
                href={step.href}
                key={step.label}
              >
                <p className="text-xs font-semibold text-alphavest-muted">Step {index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{step.label}</p>
                <ClientStatePill tone={toneFor(step.state)}>{step.state}</ClientStatePill>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <Card density="compact">
            <CardHeader className="pb-2">
              <CardTitle>Open work</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 space-y-2" data-testid="client-home-open-work">
              {clientWork.loadState === "loading" ? (
                <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">Loading open work</p>
                  <p className="mt-1 text-xs text-alphavest-muted">Client tasks are being loaded.</p>
                </div>
              ) : null}
              {clientWork.loadState === "error" ? (
                <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">Open work unavailable</p>
                  <p className="mt-1 text-xs text-alphavest-muted">Refresh the page or retry after the workspace reloads.</p>
                </div>
              ) : null}
              {clientWork.loadState === "ready" && clientWork.openWork.length === 0 ? (
                <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
                  <p className="text-sm font-semibold text-alphavest-ivory">No open work</p>
                  <p className="mt-1 text-xs text-alphavest-muted">There is no client-visible work for this household.</p>
                </div>
              ) : null}
              {clientWork.openWork.map((item) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 transition hover:border-alphavest-gold/60"
                  href={item.href}
                  key={item.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-alphavest-ivory">{item.label}</p>
                    <p className="mt-1 text-xs text-alphavest-muted">{item.meta}</p>
                  </div>
                  <ClientStatePill tone={toneFor(item.status)}>{item.status}</ClientStatePill>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card density="compact">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Household objects</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 space-y-1">
              {objectRows.map((row) => {
                const Icon = row.icon;

                return (
                  <Link
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-1.5 transition hover:border-alphavest-gold/60"
                    data-domain-07-process-card="true"
                    href={row.href}
                    key={row.label}
                  >
                    <IconTile className="size-9" tone={row.tone}>
                      <Icon aria-hidden="true" className="size-4" />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold leading-4 text-alphavest-ivory">{row.label}</p>
                        <ClientStatePill tone={row.tone}>{row.status}</ClientStatePill>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-alphavest-muted">{row.count} · {row.meta}</p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <aside className="space-y-2">
        <ClientSafeProjectionCard />
        <Card data-testid="client-safe-evidence-summary-card" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evidence summary</CardTitle>
            <CardDescription className="text-xs">Only released evidence status is shown here.</CardDescription>
          </CardHeader>
          <CardContent className="mt-2 space-y-2">
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" data-testid="client-safe-evidence-readmodel">
              <p className="text-sm font-semibold text-alphavest-ivory">
                {clientSafeEvidence?.allowed ? clientSafeEvidence.title ?? "Released evidence summary" : "Released evidence summary unavailable"}
              </p>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">
                {clientSafeEvidence?.allowed
                  ? clientSafeEvidence.summary ?? "Released summary available."
                  : "Evidence details remain hidden until a released client-safe summary is available."}
              </p>
            </div>
            <Link className={secondaryButtonClass + " w-full"} href="/documents/upload">
              Request missing evidence
            </Link>
          </CardContent>
        </Card>
        <Card density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="mt-2 space-y-2" data-testid="client-home-recent-activity">
            {clientWork.loadState === "loading" ? (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2">
                <p className="text-sm font-semibold text-alphavest-ivory">Loading activity</p>
              </div>
            ) : null}
            {clientWork.loadState === "error" ? (
              <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-2">
                <p className="text-sm font-semibold text-alphavest-ivory">Activity unavailable</p>
              </div>
            ) : null}
            {clientWork.loadState === "ready" && clientWork.activities.length === 0 ? (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2">
                <p className="text-sm font-semibold text-alphavest-ivory">No recent activity</p>
              </div>
            ) : null}
            {clientWork.activities.map((item) => (
              <Link
                className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2 transition hover:border-alphavest-gold/60"
                href={item.href}
                key={item.id}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-alphavest-ivory">{item.label}</span>
                  <span className="mt-1 block truncate text-xs text-alphavest-muted">{item.meta}</span>
                </span>
                <ClientStatePill tone={toneFor(item.status)}>{item.status}</ClientStatePill>
              </Link>
            ))}
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function MobileHomePage({ title }: { title: string }) {
  return (
    <ActorSessionProvider>
      <MobileHomePageContent title={title} />
    </ActorSessionProvider>
  );
}

function MobileHomePageContent({ title }: { title: string }) {
  const clientWork = useClientHomeWorkItems();
  const metrics = useDbtfDashboardMetrics();
  const firstWorkItem = clientWork.openWork[0];
  const firstActivity = clientWork.activities[0];
  const openWorkDetail =
    clientWork.loadState === "loading"
      ? "Loading client tasks"
      : clientWork.loadState === "error"
        ? "Tasks unavailable"
        : clientWork.openWork.length > 0
          ? `${clientWork.openWork.length} item${clientWork.openWork.length === 1 ? "" : "s"} ready`
          : "No open client tasks";
  const openWorkStatus =
    clientWork.loadState === "error"
      ? "Unavailable"
      : clientWork.loadState === "loading"
        ? "Loading"
        : clientWork.openWork.length > 0
          ? firstWorkItem?.status ?? "Review"
          : "Clear";
  const activityDetail =
    clientWork.loadState === "loading"
      ? "Loading recent updates"
      : clientWork.loadState === "error"
        ? "Activity unavailable"
        : firstActivity?.label ?? "No recent updates";
  const activityStatus =
    clientWork.loadState === "error"
      ? "Unavailable"
      : clientWork.loadState === "loading"
        ? "Loading"
        : firstActivity?.status ?? "Clear";
  const mobileSummaryRows = [
    {
      detail: openWorkDetail,
      href: firstWorkItem?.href ?? "/client/home",
      label: "Open work",
      status: openWorkStatus,
    },
    {
      detail: metrics ? `${metrics.evidenceCoverage}% evidence coverage` : "Loading evidence state",
      href: "/documents/upload",
      label: "Evidence",
      status: metrics && metrics.evidenceCoverage >= 80 ? "Ready" : metrics ? "Review" : "Loading",
    },
    {
      detail: activityDetail,
      href: firstActivity?.href ?? "/client/home",
      label: "Recent activity",
      status: activityStatus,
    },
  ];

  return (
      <main className="av-surface av-surface-mobile px-4 py-5">
        <ScreenTitle>{title}</ScreenTitle>
        <div className="mx-auto min-h-[23rem] w-full max-w-[58rem] border-x border-alphavest-border/60 bg-alphavest-midnight/84 px-5 py-5 shadow-2xl sm:px-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <ClientSafeProjectionCard density="mobile" />
            <aside className="grid content-start gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Next permitted action</CardTitle>
                  <CardDescription>Continue with the same released client-safe update in the full portal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3" data-testid="mobile-client-work-summary">
                  <Link className={cn(primaryButtonClass, "w-full justify-center")} href="/client/home">
                    {buildDomainHReleasedDecisionReadModel().ui.nextActionLabel}
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Link>
                  <Link className={cn(secondaryButtonClass, "w-full justify-center")} href="/documents">
                    Open documents
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Link>
                  {mobileSummaryRows.map((row) => (
                    <Link className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3 transition hover:border-alphavest-gold/60" href={row.href} key={row.label}>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-alphavest-ivory">{row.label}</p>
                        <p className="mt-1 text-xs leading-5 text-alphavest-muted">{row.detail}</p>
                      </div>
                      <ClientStatePill tone={toneFor(row.status)}>{row.status}</ClientStatePill>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
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
  const [message, setMessage] = useState("Profile loaded.");
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
        setMessage("Profile loaded.");
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
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.75fr_0.72fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Family Profile</CardTitle>
              <ClientStatePill tone="blue">{profile?.source ?? "UserProfile"}</ClientStatePill>
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
              {governancePreferences.slice(0, 3).map((item) => (
                <div className="flex items-center gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={item.title}>
                  <IconTile><Shield aria-hidden="true" className="size-4" /></IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-alphavest-ivory">{item.title}</p>
                    <p className="text-sm text-alphavest-muted">{item.detail}</p>
                  </div>
                  <ClientStatePill tone={toneFor(item.status)}>{item.status}</ClientStatePill>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Review Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Profile Status", loadState === "ready" ? "Draft" : loadState],
                ["Relationship", form.relationshipLabel || "Missing"],
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
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState("Select a family member to edit allowed fields.");
  const [formIssues, setFormIssues] = useState<string[]>([]);
  const [savingFamilyMember, setSavingFamilyMember] = useState(false);
  const selected = selectedMemberId ? rows.find((row) => row.id === selectedMemberId) : undefined;
  const selectedContextState = selected ? `context_${selected.contextReadinessState}` : "selection_required";

  useEffect(() => {
    if (selected) {
      queueMicrotask(() => {
        setFamilyForm({
          displayName: selected.name,
          relationshipType: selected.relationship,
          taxResidency: selected.taxResidency,
        });
        setFormIssues([]);
        setFormMessage("Family member loaded.");
      });
      return;
    }

    if (selectedMemberId) {
      queueMicrotask(() => {
        setFamilyForm({
          displayName: "",
          relationshipType: "",
          taxResidency: "",
        });
        setFormIssues([]);
        setFormMessage("Selected member is not in the current filtered page. Select a visible row before editing.");
      });
    }
  }, [selected, selectedMemberId]);

  function selectFamilyMember(row: FamilyMemberTableRow) {
    setSelectedMemberId(row.id);
    setFormIssues([]);
    setFormMessage(`Selected ${row.name} from the current family list.`);
  }

  const familyMemberSelectableColumns: Array<DataTableColumn<FamilyMemberTableRow>> = [
    {
      key: "select",
      header: "Select",
      render: (row) => (
        <button
          aria-label={`Select ${row.name}`}
          className={cn(
            "grid size-9 place-items-center rounded-md border transition",
            selectedMemberId === row.id
              ? "border-alphavest-gold bg-alphavest-gold text-alphavest-ink"
              : "border-alphavest-border bg-alphavest-navy/35 text-alphavest-muted hover:border-alphavest-gold/70 hover:text-alphavest-ivory",
          )}
          data-c3-family-member-id={row.id}
          data-testid="c3-select-family-member"
          onClick={() => selectFamilyMember(row)}
          title={`Select ${row.name}`}
          type="button"
        >
          <CheckCircle2 aria-hidden="true" className="size-4" />
        </button>
      ),
      className: "w-16 whitespace-nowrap",
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="block min-w-0 truncate whitespace-nowrap font-semibold text-alphavest-ivory">
          {row.name}
          <span className="ml-2 text-xs text-alphavest-muted">{row.year}</span>
        </span>
      ),
      sortable: true,
      className: "min-w-[14rem]",
    },
    {
      key: "contextReadinessState",
      header: "Downstream",
      render: (row) => <ClientStatePill tone={toneFor(row.contextReadinessState)}>{readinessLabel(row.contextReadinessState)}</ClientStatePill>,
      className: "w-32 whitespace-nowrap",
    },
  ];

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
      setFormMessage(`Saved ${familyForm.displayName} and refreshed the family list.`);
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
        data-domain-07-gate="tenant-scoped-db-audit"
        data-domain-07-no-overclaim="true"
        data-domain-07-process="BP-004"
        data-domain-07-surface="queue-detail"
        data-testid="domain-07-family-core-surface"
      >
        <SectionTitle
          action={<div className="flex flex-wrap gap-3"><button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runDataMaintenanceCommand("j09.openFamilyMap", "/relationships"); }} type="button"><Network aria-hidden="true" className="size-4" />Family Map</button><button className={primaryButtonClass} data-testid="j09-add-member" onClick={() => { void runDataMaintenanceCommand("j09.addMember"); }} type="button"><Plus aria-hidden="true" className="size-4" />Add Member</button></div>}
          count={String(meta?.totalRows ?? rows.length)}
          subtitle="Maintain family member profiles, relationships and governance roles."
          title={title}
        />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_30rem]">
          <Card data-testid="domain-07-family-queue-surface" density="compact">
            <CardHeader className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                <input
	                  className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold"
	                  onChange={(event) => {
	                    setSearchTerm(event.target.value);
	                    setPage(1);
	                  }}
                  placeholder="Search family members"
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
                columns={familyMemberSelectableColumns}
                compact
                emptyMessage={loadState === "error" ? "Family members could not be loaded." : "No family members match this search."}
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
          <Card
            data-testid="domain-07-family-detail-surface"
            data-ux-family-context-output-state={selectedContextState}
            data-ux-selected-family-member-id={selected?.id ?? "none"}
            density="compact"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-alphavest-border bg-alphavest-gold/15 text-xl font-semibold text-alphavest-gold">
                  {(selected?.name ?? "DB").split(" ").map((part) => part.charAt(0)).slice(0, 2).join("")}
                </span>
                <div>
                  <CardTitle>{selected?.name ?? "No family member selected"}</CardTitle>
                  <CardDescription>{selected ? `${selected.year} · ${selected.relationship} · ${selected.role}` : "Tenant-limited family rows are empty."}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected ? <ClientStatePill tone={toneFor(selected.status)}>{selected.status}</ClientStatePill> : null}
                    {selected ? <ClientStatePill tone="blue">{selected.sensitivity}</ClientStatePill> : null}
                    {selected ? <ClientStatePill tone="green">{selected.visibilityStatus}</ClientStatePill> : null}
                    {selected ? <ClientStatePill tone={toneFor(selected.contextReadinessState)}>{readinessLabel(selected.contextReadinessState)}</ClientStatePill> : null}
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
                <FieldBox label="Record" value={selected ? selected.id.slice(0, 8) : "n/a"} />
                <FieldBox label="Sensitivity" value={selected?.sensitivity ?? "n/a"} />
                <FieldBox label="Visibility" value={selected?.visibilityStatus ?? "n/a"} />
                <FieldBox label="Status" value={selected?.status ?? "n/a"} />
                <FieldBox label="Downstream use" value={selected ? readinessDetail(selected.contextReadinessReasons) : "Select a family member"} />
              </div>
              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  formIssues.length > 0
                    ? "border-alphavest-red/45 bg-alphavest-red/10 text-alphavest-red"
                    : "border-alphavest-green/45 bg-alphavest-green/10 text-alphavest-muted",
                )}
                data-testid="domain-07-family-detail-state"
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

const relationshipColumns: Array<DataTableColumn<RelationshipTableRow>> = [
  {
    key: "from",
    header: "Parties",
    render: (row) => (
      <span className="block min-w-[11rem] font-semibold text-alphavest-ivory">
        {row.from}
        <span className="block text-xs font-normal leading-5 text-alphavest-muted">{row.to}</span>
      </span>
    ),
    sortable: true,
  },
  { key: "relationship", header: "Relationship", render: (row) => row.relationship, sortable: true },
  {
    key: "status",
    header: "Review state",
    render: (row) => (
      <div className="flex min-w-[11rem] flex-wrap gap-1.5">
        <ClientStatePill tone={toneFor(row.status)}>{row.status}</ClientStatePill>
        <ClientStatePill tone={toneFor(row.readiness)}>{row.readiness}</ClientStatePill>
      </div>
    ),
    sortable: true,
  },
  {
    key: "confidence",
    header: "Confidence",
    render: (row) => (
      <span className="text-sm font-semibold text-alphavest-ivory">
        {row.confidence}
        <span className="block text-xs font-normal leading-5 text-alphavest-muted">{row.visibilityStatus}</span>
      </span>
    ),
    sortable: true,
  },
];

function RelationshipsPageContent({ title }: { title: string }) {
  const [commandMessage, setCommandMessage] = useState("Select an edge to inspect source evidence and readiness.");
  const [queryState, setQueryState] = useState({
    page: 1,
    q: "",
    sortDirection: "asc" as DataSurfaceSortDirection,
    sortKey: "from",
  });
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const { loadState, meta, refresh, rows } = useDbtfRelationships(queryState);
  const blockedCount = rows.filter((row) => row.contextReadinessState === "blocked").length;
  const incompleteCount = rows.filter((row) => row.contextReadinessState === "incomplete").length;
  const readyCount = rows.filter((row) => row.contextReadinessState === "ready").length;
  const selectedRelationship = rows.find((row) => row.id === selectedRelationshipId) ?? rows[0] ?? null;
  const tableState = loadState === "loading" ? "loading" : loadState === "error" ? "error" : rows.length === 0 ? "empty" : "ready";
  const handleSort = (nextKey: string) => {
    setQueryState((current) => ({
      ...current,
      page: 1,
      sortDirection: current.sortKey === nextKey && current.sortDirection === "asc" ? "desc" : "asc",
      sortKey: nextKey,
    }));
  };
  const relationshipMetrics = [
    ["Mapped", String(meta?.totalRows ?? rows.length), rows.length ? "ready" : "empty"],
    ["Review", String(incompleteCount), incompleteCount ? "review" : "clear"],
    ["Blocked", String(blockedCount), blockedCount ? "blocked" : "clear"],
  ];

  async function addRelationship() {
    setCommandMessage("Writing relationship edge...");
    try {
      const response = await runDataMaintenanceCommand("j09.addRelationship");
      setCommandMessage(response.result?.message ?? "Relationship edge saved and rows reloaded.");
      await refresh();
    } catch (error) {
      setCommandMessage(error instanceof Error ? error.message : "Relationship edge failed closed.");
    }
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <div
        className="space-y-3"
        data-domain-07-no-overclaim="true"
        data-domain-07-process="BP-005"
        data-domain-07-surface="relationship-depth"
        data-testid="domain-07-relationship-depth-surface"
      >
        <SectionTitle
          action={
            <div className="flex flex-wrap gap-2">
              <button className={secondaryButtonClass} data-testid="j09-family-map" onClick={() => { void runDataMaintenanceCommand("j09.openFamilyMap"); }} type="button"><Network aria-hidden="true" className="size-4" />Family map</button>
              <button className={primaryButtonClass} data-testid="j09-add-relationship" onClick={() => { void addRelationship(); }} type="button"><Plus aria-hidden="true" className="size-4" />Add edge</button>
            </div>
          }
          title={title}
        />
        <div className="flex flex-col gap-2 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-10 flex-1 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm text-alphavest-muted">
            <Search aria-hidden="true" className="size-4" />
            <span className="sr-only">Search relationships</span>
            <input
              className="w-full bg-transparent text-alphavest-ivory outline-none placeholder:text-alphavest-muted"
              onChange={(event) => setQueryState((current) => ({ ...current, page: 1, q: event.target.value }))}
              placeholder="Search relationship context"
              type="search"
              value={queryState.q}
            />
          </label>
          <ClientStatePill tone={dataSurfaceObjectStatus(loadState, "Backend rows", rows.length) === "Unavailable" ? "red" : "blue"}>
            {dataSurfaceObjectCount(loadState, meta, rows.length)} rows
          </ClientStatePill>
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card data-testid="domain-07-relationship-graph" density="compact">
            <CardHeader className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <CardTitle>Relationship edges</CardTitle>
                <CardDescription>Family, legal and advisor links for this household.</CardDescription>
              </div>
              <ClientStatePill tone={blockedCount || incompleteCount ? "gold" : "green"}>{readyCount} ready</ClientStatePill>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={relationshipColumns}
                density="compact"
                emptyMessage="No relationships match this tenant, role and query."
                getRowId={(row) => row.id}
                pagination={meta ? { ...meta, onPageChange: (page) => setQueryState((current) => ({ ...current, page })) } : null}
                rows={rows}
                serverSort
                selectedRowId={selectedRelationship?.id ?? null}
                sortDirection={queryState.sortDirection}
                sortKey={queryState.sortKey}
                state={tableState}
                rowSelectionLabel={(row) => `Inspect relationship between ${row.from} and ${row.to}`}
                onSortChange={handleSort}
                onRowSelect={(row) => {
                  setSelectedRelationshipId(row.id);
                  setCommandMessage(`${row.relationship} selected for review.`);
                }}
              />
            </CardContent>
          </Card>

          <Card data-testid="domain-07-relationship-detail" density="compact">
            <CardHeader className="pb-2">
              <CardTitle>{selectedRelationship ? "Relationship detail" : "Relationship review"}</CardTitle>
              <CardDescription>{selectedRelationship ? `${selectedRelationship.from} to ${selectedRelationship.to}` : "Select an edge to review context."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {relationshipMetrics.map(([label, value, state]) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2.5"
                  data-testid="domain-07-relationship-depth-step"
                  key={label}
                >
                  <div>
                    <p className="text-sm font-semibold text-alphavest-ivory">{label}</p>
                    <p className="text-xs text-alphavest-muted">{label === "Mapped" ? "Tenant rows" : label === "Review" ? "Evidence needed" : "Restricted state"}</p>
                  </div>
                  <ClientStatePill tone={toneFor(state)}>{value}</ClientStatePill>
                </div>
              ))}
              {selectedRelationship ? (
                <div className="space-y-2 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-2.5" data-testid="domain-07-relationship-db-detail">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-alphavest-ivory">{selectedRelationship.relationship}</p>
                      <p className="mt-1 text-xs text-alphavest-muted">{selectedRelationship.type}</p>
                    </div>
                    <ClientStatePill tone={toneFor(selectedRelationship.contextReadinessState)}>{selectedRelationship.readiness}</ClientStatePill>
                  </div>
                  <dl className="grid gap-2 text-xs">
                    {[
                      ["Evidence", selectedRelationship.evidence],
                      ["Confidence", selectedRelationship.confidence],
                      ["Visibility", selectedRelationship.visibilityStatus],
                      ["Since", selectedRelationship.since],
                      ["Updated", selectedRelationship.updatedAt],
                    ].map(([label, value]) => (
                      <div className="flex justify-between gap-3 border-t border-alphavest-border/45 pt-2 first:border-t-0 first:pt-0" key={label}>
                        <dt className="text-alphavest-muted">{label}</dt>
                        <dd className="text-right font-semibold text-alphavest-ivory">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="rounded-md border border-alphavest-border/60 bg-alphavest-navy/35 px-2.5 py-2 text-xs text-alphavest-muted" data-testid="domain-07-relationship-action-state">{commandMessage}</p>
                </div>
              ) : (
                <StatePanel detail="No relationships match the current filter." state="empty" title="No relationship selected" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function RelationshipsPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="023">
      <RelationshipsPageContent title={title} />
    </ClientShell>
  );
}

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
  const { facets, loadState, meta, rows } = useDbtfEntities({
    jurisdiction: jurisdictionFilter,
    page,
    q: searchTerm,
    risk: riskFilter,
    sortDirection,
    sortKey: String(sortKey),
    type: typeFilter,
  });
  const typeOptions = facets.types;
  const jurisdictionOptions = facets.jurisdictions;
  const riskOptions = facets.risks;

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
        data-domain-07-gate="tenant-scoped-db-query"
        data-domain-07-no-overclaim="true"
        data-domain-07-process="BP-006"
        data-domain-07-surface="queue"
        data-testid="domain-07-entity-core-surface"
      >
        <SectionTitle
          action={<button className={primaryButtonClass} data-testid="j05-create-entity" onClick={() => { void runDataMaintenanceCommand("j05.createEntity", "/entities/new"); }} type="button"><Plus aria-hidden="true" className="size-4" />Create Entity</button>}
          count={String(meta?.totalRows ?? rows.length)}
          subtitle="View and manage entities across organizational and investment structures."
          title={title}
        />
        <Card data-testid="domain-07-entity-queue-surface">
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
	                  placeholder="Search entities..."
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
              <MetricCard detail="Matching permitted records" label="Entities" value={String(meta?.totalRows ?? rows.length)} />
              <MetricCard detail="Visible in this view" label="Visible" value={String(meta?.returnedRows ?? rows.length)} />
              <MetricCard detail="Seeded high-risk rows" label="High Risk" status="FAILED" value={String(rows.filter((row) => row.risk.toLowerCase().includes("high")).length)} />
              <MetricCard detail="Rows needing evidence" label="Evidence" status="PENDING" value={String(rows.filter((row) => row.missingDocs !== "All good").length)} />
              <MetricCard detail="Ready for next private review" label="Usable" status="ACTIVE" value={String(rows.filter((row) => row.contextReadinessState === "ready").length)} />
            </div>
            <DataTable
              actionPolicy="open_detail"
              columns={entityColumns}
              emptyMessage={loadState === "error" ? "Entities could not be loaded." : "No entities match this search and filter set."}
              getRowId={(row) => row.id}
              onRowAction={(row) => { window.location.href = row.href; }}
              onSortChange={toggleSort}
              pagination={meta ? { ...meta, onPageChange: setPage } : null}
              rowActionLabel={(row) => `Open entity detail for ${row.name}`}
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
  { key: "name", header: "Entity", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}</span>, sortable: true, className: "min-w-[10rem]" },
  { key: "type", header: "Type", render: (row) => <ClientStatePill>{row.type}</ClientStatePill>, sortable: true, className: "w-28 whitespace-nowrap" },
  { key: "jurisdiction", header: "Jurisdiction", render: (row) => row.jurisdiction, sortable: true, className: "min-w-[8rem] whitespace-nowrap" },
  { key: "ownership", header: "Own. %", render: (row) => row.ownership, className: "w-24 whitespace-nowrap" },
  { key: "visibilityStatus", header: "Visibility", render: (row) => <ClientStatePill tone={toneFor(row.visibilityStatus)}>{row.visibilityStatus}</ClientStatePill>, sortable: true, className: "min-w-[9rem] whitespace-nowrap" },
  { key: "contextReadinessState", header: "Downstream", render: (row) => <ClientStatePill tone={toneFor(row.contextReadinessState)}>{readinessLabel(row.contextReadinessState)}</ClientStatePill>, className: "w-32 whitespace-nowrap" },
  { key: "docs", header: "Docs", render: (row) => <ClientStatePill tone={toneFor(row.missingDocs)}>{row.missingDocs}</ClientStatePill>, className: "min-w-[9rem] whitespace-nowrap" },
  { key: "risk", header: "Risk", render: (row) => <ClientStatePill tone={toneFor(row.risk)}>{row.risk}</ClientStatePill>, sortable: true, className: "w-28 whitespace-nowrap" }
];

function CreateEntityPage({ title }: { title: string }) {
  return (
    <ClientShell activePageId="025">
      <CreateEntityPageContent title={title} />
    </ClientShell>
  );
}

function CreateEntityPageContent({ title }: { title: string }) {
  const { session } = useActorSession();
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

      setMessage(`${body.result.entity.name} saved as ${body.result.entity.status}. Entity rows will refresh on /entities.`);
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
        data-domain-07-gate="wizard-validation-before-db-write"
        data-domain-07-no-overclaim="true"
        data-domain-07-process="BP-006"
        data-domain-07-surface="step"
        data-testid="domain-07-entity-step-surface"
      >
        <SectionTitle
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
      <EntityDetailPageContent title={title} />
    </ClientShell>
  );
}

function EntityDetailPageContent({ title }: { title: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const targetId = decodeURIComponent(pathSegments[pathSegments.length - 1] ?? "");
  const { entity, loadState } = useDbtfEntityDetail(targetId);

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        density="compact"
        description="Entity context, ownership, evidence and asset posture for the selected client record."
        eyebrow="Client context"
        primary={
          <div
            className="space-y-3"
            data-domain-07-gate="tenant-scoped-db-detail"
            data-domain-07-no-overclaim="true"
            data-domain-07-process="BP-010"
            data-domain-07-surface="detail"
            data-testid="domain-07-entity-detail-surface"
          >
            {loadState === "loading" ? (
              <StatePanel detail="Loading the selected entity and its linked context." state="loading" title="Loading entity" />
            ) : !entity ? (
              <StatePanel detail="This entity is unavailable for the current tenant, role or visibility settings." state="restricted" title="Entity unavailable" />
            ) : (
              <>
                <Card density="compact">
                  <CardContent className="grid gap-4 p-4 xl:grid-cols-[1fr_22rem]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <IconTile><Building2 aria-hidden="true" className="size-6" /></IconTile>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Entity</p>
                        <h1 className="break-words font-display text-3xl text-alphavest-ivory">{entity.name}</h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <ClientStatePill tone={toneFor(entity.status)}>{entity.status}</ClientStatePill>
                          <ClientStatePill tone={toneFor(entity.visibilityStatus)}>{entity.visibilityStatus}</ClientStatePill>
                          <ClientStatePill tone={toneFor(entity.contextReadinessState)}>{readinessLabel(entity.contextReadinessState)}</ClientStatePill>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link className={secondaryButtonClass} href="/entities">Back to entities</Link>
                        <button className={primaryButtonClass} data-testid="j05-edit-entity" onClick={() => { void runDataMaintenanceCommand("j05.editEntity", entity.href); }} type="button">Edit Entity</button>
                      </div>
                    </div>
                    <StatePanel
                      detail={entity.contextReadinessReasons.length > 0 ? readinessDetail(entity.contextReadinessReasons) : entity.ownerSummary}
                      state={entity.contextReadinessState === "ready" ? "success" : entity.contextReadinessState === "blocked" ? "blocked" : "restricted"}
                      title={readinessLabel(entity.contextReadinessState)}
                    />
                  </CardContent>
                </Card>
                <div className="grid gap-3 xl:grid-cols-3">
                  <Card density="compact">
                    <CardHeader><CardTitle>Participants</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {entity.participants.length > 0 ? entity.participants.map((participant) => (
                        <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-2 last:border-0" key={`${participant.name}-${participant.role}`}>
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-alphavest-ivory">{participant.name}</p>
                            <p className="text-sm text-alphavest-muted">{participant.type} / {participant.ownership}</p>
                          </div>
                          <ClientStatePill tone="gold">{participant.role}</ClientStatePill>
                        </div>
                      )) : <StatePanel detail="No participant rows are linked to this entity yet." state="restricted" title="Participants pending" />}
                    </CardContent>
                  </Card>
                  <Card density="compact">
                    <CardHeader><CardTitle>Assets</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {entity.assets.length > 0 ? entity.assets.slice(0, 4).map((asset) => (
                        <div className="grid gap-1 border-b border-alphavest-border/45 pb-2 last:border-0" key={asset.name}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="break-words text-sm font-semibold text-alphavest-ivory">{asset.name}</p>
                            <ClientStatePill tone={toneFor(asset.risk)}>{asset.risk}</ClientStatePill>
                          </div>
                          <p className="text-xs text-alphavest-muted">{asset.type} / {asset.valueBand} / {asset.status}</p>
                        </div>
                      )) : <StatePanel detail="No asset rows are currently linked to this entity." state="empty" title="No linked assets" />}
                    </CardContent>
                  </Card>
                  <Card density="compact">
                    <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {entity.documents.length > 0 ? entity.documents.slice(0, 4).map((document) => (
                        <div className="flex justify-between gap-3 border-b border-alphavest-border/45 pb-2 last:border-0" key={`${document.title}-${document.relationship}`}>
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-alphavest-ivory">{document.title}</p>
                            <p className="text-xs text-alphavest-muted">{document.type} / {document.relationship}</p>
                          </div>
                          <ClientStatePill tone={toneFor(document.status)}>{document.status}</ClientStatePill>
                        </div>
                      )) : <StatePanel detail="Supporting evidence is still required before downstream review can continue." state="restricted" title="Evidence needed" />}
                    </CardContent>
                  </Card>
                </div>
                <Card density="compact">
                  <CardHeader><CardTitle>Entity details</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-4">
                    {[
                      ["Entity type", entity.type],
                      ["Jurisdiction", entity.jurisdiction],
                      ["Registration", entity.registrationNumber],
                      ["Risk", entity.risk],
                      ["Ownership", entity.ownership],
                      ["Data quality", entity.dataQualityScore],
                      ["Sensitivity", entity.sensitivity],
                      ["Updated", entity.updatedAt],
                    ].map(([label, value]) => <FieldBox key={label} label={label} value={value} />)}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        }
        routeId="026"
        safetyNote="Entity context is access-controlled; evidence, visibility and downstream actions remain separately gated."
        statusItems={[
          { label: "Source", tone: "blue", value: entity?.sourceTruth ?? "Loading" },
          { label: "Readiness", tone: toneFor(entity?.contextReadinessState ?? "blocked"), value: entity ? readinessLabel(entity.contextReadinessState) : "Scoped" },
        ]}
        title={title}
        worksurfaceId="entity-detail-readmodel"
      />
    </>
  );
}

function DocumentsPageContent({ title }: { title: string }) {
  const { session } = useActorSession();
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
  const persistedRows = toDocumentRows(documents, session.tenant.displayName, session);
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
      data-testid="domain08-evidence-lifecycle-area-entry"
    >
      <div className="grid gap-2 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">Document intake</p>
          <h3 className="mt-1 text-sm font-semibold text-alphavest-ivory">Evidence workload</h3>
          <p className="mt-0.5 max-w-3xl text-xs leading-5 text-alphavest-muted">{routeContract.primaryJob}</p>
        </div>
        <button
          className={primaryButtonClass + " h-9 self-start"}
          data-testid="j04-open-upload-document"
          data-ux-domain08-next-action="upload_scoped_evidence"
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
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" data-ux-domain08-process={process.processId} key={process.processId}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-alphavest-muted">Current state</span>
                <ClientStatePill tone={process.primaryState === "INSUFFICIENT_REREQUESTED" ? "red" : process.primaryState === "UPLOAD_RECEIVED" ? "green" : "gold"}>
                  {state.label}
                </ClientStatePill>
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
  const ownedProcessIds: readonly string[] = routeContract.ownedProcesses;
  const processCards = evidenceLifecycleProcessContracts
    .filter((process) => ownedProcessIds.includes(process.processId))
    .slice(0, 3);

  return (
    <section
      {...routeAttributes}
      className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2.5"
      data-testid={`domain08-core-surface-${screenId.toLowerCase()}`}
      data-ux-domain08-core-surface={surfaceKind}
    >
      <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">Evidence review</p>
          <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{routeContract.primaryJob}</p>
          <p className="mt-0.5 text-xs leading-5 text-alphavest-muted">{routeContract.nextPermittedAction}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {processCards.map((process) => {
            const state = evidenceLifecycleStateContracts[process.primaryState];

            return (
              <div className="min-w-[10rem] rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" key={process.processId}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-alphavest-muted">State</span>
                  <ClientStatePill tone={process.primaryState === "REVIEW_PENDING" ? "gold" : process.primaryState === "UPLOAD_RECEIVED" ? "green" : "muted"}>{state.label}</ClientStatePill>
                </div>
                <p className="mt-1 text-xs leading-4 text-alphavest-muted">{process.name}</p>
              </div>
            );
          })}
        </div>
      </div>
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

function DocumentPreviewTile({
  alt,
  className,
  previewStatus,
  thumbnailUrl,
}: {
  alt: string;
  className?: string;
  previewStatus?: string | null;
  thumbnailUrl?: string | null;
}) {
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-alphavest-border bg-alphavest-midnight/70", className)}>
      {thumbnailUrl ? (
        <Image alt={alt} className="size-full object-cover" height={88} src={thumbnailUrl} unoptimized width={88} />
      ) : (
        <FileText aria-hidden="true" className={cn("size-5", previewStatus === "FAILED" ? "text-alphavest-red" : "text-alphavest-muted")} />
      )}
    </div>
  );
}

const documentColumns: Array<DataTableColumn<DocumentTableRow>> = [
  {
    key: "name",
    header: "Document Name",
    render: (row) => (
      <div className="flex min-w-0 items-center gap-3">
        <DocumentPreviewTile alt="" previewStatus={row.previewStatus} thumbnailUrl={row.thumbnailUrl} />
        <div className="min-w-0">
          <span className="block truncate font-semibold text-alphavest-ivory">{row.name}</span>
          <span className="mt-0.5 block text-xs text-alphavest-muted">
            {row.thumbnailUrl ? "Preview ready" : row.previewStatus === "FAILED" ? "Preview pending review" : "Preview queued"}
          </span>
          {row.previewUrl ? (
            <a
              className="mt-1 inline-flex text-xs font-semibold text-alphavest-gold underline-offset-4 hover:underline"
              href={row.previewUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open preview
            </a>
          ) : null}
        </div>
      </div>
    ),
    sortable: true,
  },
  { key: "type", header: "Type", render: (row) => row.type, sortable: true },
  { key: "status", header: "Status", render: (row) => <ClientStatePill tone={toneFor(row.status)}>{row.status}</ClientStatePill>, sortable: true },
  { key: "securityScan", header: "Intake Check", render: (row) => <ClientStatePill tone={row.securityScan === "Scan complete" ? "green" : "gold"}>{row.securityScan}</ClientStatePill> },
  { key: "sensitivity", header: "Sensitivity", render: (row) => <ClientStatePill tone={toneFor(row.sensitivity)}>{row.sensitivity}</ClientStatePill>, sortable: true },
  { key: "entity", header: "Linked Entity", render: (row) => row.entity },
  { key: "updated", header: "Updated", render: (row) => row.updated, sortable: true }
];

function DocumentUploadForm() {
  const { session } = useActorSession();
  const { documents, loadState, refresh, rememberUploadedDocument } = usePersistedUploadDocuments();
  const { rows: targetRows } = useDbtfEntities({
    jurisdiction: "all",
    page: 1,
    q: "",
    risk: "all",
    sortDirection: "asc",
    sortKey: "name",
    type: "all",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documentType, setDocumentType] = useState("financial_statement");
  const [subType, setSubType] = useState("Quarterly Report");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [periodLabel, setPeriodLabel] = useState("Mar 31, 2024 (Q1 2024)");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Select a file to start document intake.");
  const selectedTarget = targetRows.find((row) => row.id === selectedTargetId) ?? targetRows[0];

  useEffect(() => {
    if (!selectedTargetId && targetRows[0]) {
      queueMicrotask(() => {
        setSelectedTargetId(targetRows[0].id);
      });
    }
  }, [selectedTargetId, targetRows]);

  function selectFile(fileList: FileList | null) {
    const file = fileList?.item(0) ?? null;

    setSelectedFile(file);
    setUploadState("idle");
    setMessage(
      file
        ? `${file.name} selected for extraction review.`
        : "Select a file to start document intake.",
    );
  }

  async function submitUpload() {
    const fileForUpload = selectedFile ?? fileInputRef.current?.files?.item(0) ?? null;

    if (!fileForUpload) {
      setUploadState("error");
      setMessage("Select a supported source file before upload can start.");
      return;
    }

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("file", fileForUpload);
    formData.append("linkedObjectLabel", selectedTarget?.name ?? "");
    formData.append("notes", notes);
    formData.append("periodLabel", periodLabel);
    formData.append("roleKey", session.role.key);
    formData.append("sensitivity", "CONFIDENTIAL");
    formData.append("subType", subType);
    if (selectedTarget) {
      formData.append("targetObjectId", selectedTarget.id);
      formData.append("targetObjectType", "ENTITY");
    }
    formData.append("tenantSlug", session.tenant.slug);

    setUploadState("uploading");
    setMessage("Uploading the file for extraction review.");

    try {
      const response = await fetch("/api/documents/upload", {
        body: formData,
        method: "POST",
      });
      const body = (await response.json()) as {
        error?: string;
        issues?: string[];
        reasonCode?: string;
        result?: { document?: PersistedUploadDocument };
      };

      if (!response.ok || !body.result?.document) {
        const readableError =
          body.reasonCode === "UPLOAD_SECURITY_SCAN_BLOCKED"
            ? "Security scan blocked this file. Choose a different source document."
            : body.issues?.join(", ") || body.error || "Upload failed.";

        throw new Error(readableError);
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refresh();
      rememberUploadedDocument(body.result.document);
      setUploadState("success");
      setMessage(`${body.result.document.fileName} uploaded for extraction review. Evidence request recorded; review pending.`);
    } catch (error) {
      setUploadState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  const latestDocument = documents[0];
  const latestThumbnailUrl = documentDerivativeUrl(latestDocument?.thumbnailUrl, session);
  const latestPreviewUrl = documentDerivativeUrl(latestDocument?.previewUrl, session);
  const latestTargetLabel = latestDocument
    ? (targetRows.find((row) => row.id === latestDocument.targetObjectId)?.name ?? labelFromEnum(latestDocument.targetObjectType ?? "document"))
    : "Document";
  const hasSelectedFile = Boolean(selectedFile);
  const uploadLifecycleStatus = uploadState === "uploading" ? "loading" : uploadState;
  const uploadValidationState = hasSelectedFile ? "valid-file-selected" : "blocked-file-required";
  const uploadValidationMessage = hasSelectedFile && selectedTarget
    ? "Ready to upload this source document for extraction review."
    : hasSelectedFile
      ? "Select an evidence target before upload can start."
    : "Source file required before upload can start.";
  const canUpload = hasSelectedFile && Boolean(selectedTarget) && uploadState !== "uploading";

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
          <div className="grid grid-cols-2 gap-2">
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
                <div><p className="font-semibold text-alphavest-ivory">Upload paused</p><p className="text-sm text-alphavest-muted">{message}</p></div>
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
            <span className="text-alphavest-muted">Evidence Target</span>
            <select
              className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
              data-testid="document-upload-target-object"
              onChange={(event) => setSelectedTargetId(event.target.value)}
              value={selectedTarget?.id ?? ""}
            >
              {targetRows.map((row) => (
                <option key={row.id} value={row.id}>{row.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-alphavest-muted">Period</span>
            <input className="h-9 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" onChange={(event) => setPeriodLabel(event.target.value)} value={periodLabel} />
          </label>
          <label className="grid gap-1 text-xs md:col-span-2">
            <span className="text-alphavest-muted">Notes</span>
            <textarea className="min-h-14 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Add any notes about this document..." value={notes} />
          </label>
          <ActionZone className="md:col-span-2 md:grid-cols-2" layout="stack" placement="inline_cluster" testId="e05-document-upload-action-zone">
            <ActionButton
              availability={canUpload ? "enabled" : "disabled"}
              className="w-full"
              describedBy="document-upload-validation"
              disabled={!canUpload}
              disabledReason={!canUpload ? (selectedTarget ? "Source file required before upload can start." : "Select an evidence target before upload can start.") : undefined}
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
              <div className="flex items-start gap-3">
                <DocumentPreviewTile alt="" className="size-14" previewStatus={latestDocument.thumbnailStatus} thumbnailUrl={latestThumbnailUrl} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-alphavest-ivory">{latestDocument.fileName ?? latestDocument.title}</p>
                  <p className="mt-1 text-xs text-alphavest-muted">{latestDocument.fileSizeBytes ? formatBytes(latestDocument.fileSizeBytes) : "Size hidden"} · {labelFromEnum(latestDocument.status)}</p>
                  <p className="mt-1 text-xs text-alphavest-muted">{latestThumbnailUrl ? "Preview generated" : "Preview pending"}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-alphavest-muted">Target: {latestTargetLabel}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Version: v{latestDocument.latestVersionNumber ?? 1} of {latestDocument.versionCount ?? 1} · source integrity retained</p>
              <p className="mt-2 text-xs text-alphavest-muted">Intake check: {latestDocument.securityScanLabel ?? (latestDocument.securityScanStatus === "PASSED" ? "Security scan complete" : "Security scan pending")}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Lifecycle: {labelFromEnum(latestDocument.evidenceLifecycleStatus ?? "review_pending")}</p>
              <p className="mt-2 text-xs text-alphavest-muted">Extraction: {latestDocument.extractionStatus ?? "pending"}</p>
              {latestPreviewUrl ? (
                <a className={secondaryButtonClass + " mt-3 w-full"} href={latestPreviewUrl} rel="noreferrer" target="_blank">
                  Open preview
                </a>
              ) : null}
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
          <DocumentUploadForm />
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

function ExtractionReviewActionPanel({
  document,
  loadState,
  onReviewed,
}: {
  document: PersistedUploadDocument | null | undefined;
  loadState: "idle" | "loading" | "ready" | "error";
  onReviewed: () => Promise<void>;
}) {
  const { session } = useActorSession();
  const selectedDocument = document ?? null;
  const hasPersistedSelectedDocument = Boolean(selectedDocument);
  const [notes, setNotes] = useState("Checked against source file for this document.");
  const [reviewState, setReviewState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    selectedDocument
      ? "Review the selected upload; persisted review commands apply to this document."
      : "Select an upload; persisted review commands unlock after a real upload is present.",
  );

  async function submitReview(action: "mark_reviewed" | "request_clarification" | "accept_sufficiency") {
    if (!selectedDocument || reviewState === "submitting") {
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
          documentId: selectedDocument.id,
          notes,
          relevanceAccepted: action === "accept_sufficiency",
          requiredObjectId: selectedDocument.targetObjectId ?? selectedDocument.id,
          requiredObjectType: selectedDocument.targetObjectType ?? "DOCUMENT",
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
      await onReviewed();
    } catch (error) {
      setReviewState("error");
      setMessage(error instanceof Error ? error.message : "Evidence review failed.");
    }
  }

  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/45 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-alphavest-ivory">Review & Sufficiency</p>
        <ClientStatePill tone={reviewState === "error" ? "red" : reviewState === "success" ? "green" : "blue"}>
          {reviewState === "submitting" ? "Saving" : reviewState}
        </ClientStatePill>
      </div>
      <div className="mt-2 space-y-2">
        {!selectedDocument ? (
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-xs text-alphavest-muted">
            {loadState === "loading" ? "Fetching uploaded documents." : loadState === "error" ? "Uploads unavailable." : "Select or upload a document before review can continue."}
          </div>
        ) : null}
        <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-xs text-alphavest-muted" data-ux-domain08-review-state={reviewState}>
          {message}
        </div>
        <label className="grid gap-2 text-sm">
          <span className="text-alphavest-muted">Reviewer Notes</span>
          <textarea
            className="min-h-12 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
            maxLength={1000}
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </label>
        <div className="grid gap-2">
          <div data-testid="s029-request-clarification">
            <button className={secondaryButtonClass + " w-full"} data-testid="stage3-request-clarification" disabled={!hasPersistedSelectedDocument || reviewState === "submitting"} onClick={() => { void submitReview("request_clarification"); }} type="button">Request clarification</button>
          </div>
          <button className={secondaryButtonClass + " w-full"} data-testid="stage3-mark-reviewed" disabled={!hasPersistedSelectedDocument || reviewState === "submitting"} onClick={() => { void submitReview("mark_reviewed"); }} type="button">Mark Reviewed & Link Evidence</button>
          <button className={primaryButtonClass + " w-full"} data-testid="stage3-accept-sufficiency" disabled={!hasPersistedSelectedDocument || reviewState === "submitting"} onClick={() => { void submitReview("accept_sufficiency"); }} type="button">Run sufficiency check</button>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-panel/55 p-2.5" data-testid="evidence-to-advisory-handoff">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-alphavest-ivory">Next review step</p>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">Reviewed evidence can continue into the advisory queue; client visibility stays held.</p>
            </div>
            <Link className={secondaryButtonClass} href="/advisory/review-queue">
              Open advisory queue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExtractionReviewWorkbench() {
  const { session } = useActorSession();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("desc");
  const [sortKey, setSortKey] = useState<DocumentReviewSortKey>("uploadedAt");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { documents, loadState, meta, refresh } = usePersistedUploadDocuments({
    page,
    pageSize: 3,
    q: searchTerm,
    sensitivity: "all",
    sortDirection,
    sortKey,
    status: statusFilter,
    type: typeFilter,
  });
  const reviewDocuments = documents;
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const selectedDocument = reviewDocuments.find((document) => document.id === selectedDocumentId) ?? reviewDocuments[0];
  const selectedPreviewUrl = documentDerivativeUrl(selectedDocument?.previewUrl, session);
  const activeFilterCount = [statusFilter !== "all", typeFilter !== "all"].filter(Boolean).length;
  const tableRows = reviewDocuments;

  useEffect(() => {
    if (!reviewDocuments.length) {
      queueMicrotask(() => {
        setSelectedDocumentId(undefined);
      });
      return;
    }

    if (!selectedDocumentId || !reviewDocuments.some((document) => document.id === selectedDocumentId)) {
      queueMicrotask(() => {
        setSelectedDocumentId(reviewDocuments[0].id);
      });
    }
  }, [reviewDocuments, selectedDocumentId]);

  const master = (
    <div className="space-y-3" data-testid="s029-extraction-master-list">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-alphavest-ivory">Extraction queue</p>
          <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">Pending uploads stay in reviewer ownership until required fields and evidence sufficiency are confirmed.</p>
        </div>
        <div className="flex items-center gap-2">
          <ClientStatePill tone="blue">{meta?.totalRows ?? reviewDocuments.length} items</ClientStatePill>
          <button
            className={secondaryButtonClass}
            data-testid="s029-refresh-review-queue"
            onClick={() => { void runDataMaintenanceCommand("j04.refreshReviewQueue"); }}
            type="button"
          >
            <Search aria-hidden="true" className="size-4" />Refresh
          </button>
        </div>
      </div>
      <FilterBar
        activeFilterCount={activeFilterCount}
        activeStateLabel={searchTerm.length > 0 || activeFilterCount > 0 ? "Extraction queue filters applied." : "Extraction queue is current."}
        filterState={searchTerm.length > 0 && activeFilterCount > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeFilterCount > 0 ? "active_filter" : "inactive"}
        onQueryChange={(value) => { setSearchTerm(value); setPage(1); }}
        onReset={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); setPage(1); }}
        placeholder="Search extraction queue..."
        queryValue={searchTerm}
        searchTestId="ux-interaction-extraction-search"
      />
      <div className="grid gap-2 sm:grid-cols-2" data-testid="s029-extraction-real-filters">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
          Review state
          <select
            className="h-[var(--field-height)] rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
            value={statusFilter}
          >
            <option value="all">All states</option>
            {documentStatusFilterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
          Type
          <select
            className="h-[var(--field-height)] rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }}
            value={typeFilter}
          >
            <option value="all">All types</option>
            {documentTypeFilterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
          Sort
          <select
            className="h-[var(--field-height)] rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
            onChange={(event) => { setSortKey(event.target.value as DocumentReviewSortKey); setPage(1); }}
            value={sortKey}
          >
            <option value="uploadedAt">Uploaded</option>
            <option value="fileName">Document</option>
            <option value="documentType">Type</option>
            <option value="evidenceLifecycleStatus">Lifecycle</option>
            <option value="status">Review state</option>
          </select>
        </label>
        <button
          className={secondaryButtonClass + " self-end"}
          onClick={() => { setSortDirection((current) => current === "asc" ? "desc" : "asc"); setPage(1); }}
          type="button"
        >
          {sortDirection === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      {meta ? (
        <div
          className="flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 px-3 py-2 text-sm text-alphavest-muted sm:flex-row sm:items-center sm:justify-between"
          data-testid="ux-data-table-pagination"
          data-ux-data-surface-source-truth={meta.sourceTruth}
        >
          <p>
            Showing {meta.returnedRows} of {meta.totalRows} records · Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="inline-flex h-9 items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60"
              data-testid="ux-data-table-page-previous"
              disabled={!meta.hasPreviousPage}
              onClick={() => setPage(Math.max(1, meta.page - 1))}
              type="button"
            >
              Previous
            </button>
            <button
              className="inline-flex h-9 items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60"
              data-testid="ux-data-table-page-next"
              disabled={!meta.hasNextPage}
              onClick={() => setPage(Math.min(meta.totalPages, meta.page + 1))}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
      {tableRows.length ? (
        <div className="grid gap-2">
          {tableRows.map((document) => {
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
                <div className="flex items-start gap-3">
                  <DocumentPreviewTile alt="" previewStatus={document.thumbnailStatus} thumbnailUrl={documentDerivativeUrl(document.thumbnailUrl, session)} />
                  <div className="min-w-0 flex-1">
                    <div className="grid gap-2">
                      <span className="min-w-0 truncate text-sm font-semibold text-alphavest-ivory">{document.fileName ?? document.title}</span>
                      <ClientStatePill tone={document.status === "NEEDS_CLARIFICATION" ? "gold" : "blue"}>{labelFromEnum(document.status)}</ClientStatePill>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-alphavest-muted sm:grid-cols-2">
                      <span>{labelFromEnum(document.documentType)}</span>
                      <span className="sm:text-right">{formatUploadDate(document.uploadedAt)}</span>
                      <span>{labelFromEnum(document.evidenceLifecycleStatus ?? "review_pending")}</span>
                      <span className="sm:text-right">{document.extractionStatus ?? "pending"}</span>
                      <span>{document.securityScanStatus === "PASSED" ? "Security scan complete" : "Security scan pending"}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <StatePanel
          detail={loadState === "loading" ? "Fetching uploaded documents." : "Upload a document before extraction review can continue."}
          state={loadState === "error" ? "error" : "empty"}
          title={loadState === "error" ? "Extraction queue unavailable" : "No extraction queue items"}
        />
      )}
    </div>
  );

  const detail = selectedDocument ? (
    <div data-testid="s029-extraction-selected-detail">
      <Card density="compact">
        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-lg">Selected upload</CardTitle><ClientStatePill>Review</ClientStatePill></CardHeader>
        <CardContent className="mt-2 grid gap-2">
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" data-testid="document-review-latest-card">
            <div className="flex items-start gap-3">
              <DocumentPreviewTile alt="" className="size-16" previewStatus={selectedDocument.thumbnailStatus} thumbnailUrl={documentDerivativeUrl(selectedDocument.thumbnailUrl, session)} />
              <div className="min-w-0">
                <p className="text-xs text-alphavest-muted">Document</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-alphavest-ivory">{selectedDocument.fileName ?? selectedDocument.title}</p>
                <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">Assigned reviewer checks extracted fields against source evidence before any downstream handoff.</p>
                <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">Version: v{selectedDocument.latestVersionNumber ?? 1} of {selectedDocument.versionCount ?? 1} · source integrity retained</p>
                <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">
                  Lifecycle: {labelFromEnum(selectedDocument.evidenceLifecycleStatus ?? "review_pending")} · Evidence: {selectedDocument.evidenceStatus ? labelFromEnum(selectedDocument.evidenceStatus) : "Created"} · Visibility: {labelFromEnum(selectedDocument.evidenceVisibilityStatus ?? "redacted")}
                </p>
                <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">
                  Intake check: {selectedDocument.securityScanLabel ?? (selectedDocument.securityScanStatus === "PASSED" ? "Security scan complete" : "Security scan pending")}
                </p>
                {selectedPreviewUrl ? (
                  <a className="mt-2 inline-flex text-xs font-semibold text-alphavest-gold underline-offset-4 hover:underline" href={selectedPreviewUrl} rel="noreferrer" target="_blank">
                    Open preview
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <ExtractionReviewActionPanel key={selectedDocument.id} document={selectedDocument} loadState={loadState} onReviewed={async () => { await refresh(); }} />
          {[
            [
              "Extraction",
              labelFromEnum(selectedDocument.extractionStatus ?? "pending"),
              `${labelFromEnum(selectedDocument.documentType)} · ${formatUploadDate(selectedDocument.uploadedAt)}`,
            ],
            [
              "Review state",
              labelFromEnum(selectedDocument.status),
              selectedDocument.evidenceRequestState ? labelFromEnum(selectedDocument.evidenceRequestState) : "Human review required",
            ],
            [
              "Evidence",
              labelFromEnum(selectedDocument.evidenceLifecycleStatus ?? "review_pending"),
              selectedDocument.evidenceStatus ? labelFromEnum(selectedDocument.evidenceStatus) : "Evidence record pending",
            ],
            [
              "Client visibility",
              labelFromEnum(selectedDocument.evidenceVisibilityStatus ?? "redacted"),
              "Release, export and client visibility stay unavailable until downstream checks pass.",
            ],
          ].map(([label, value, detail]) => (
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2" key={label}>
              <p className="text-xs text-alphavest-muted">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-alphavest-ivory">{value}</p>
              <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">{detail}</p>
            </div>
          ))}
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-2">
            <p className="text-xs text-alphavest-muted">Field check</p>
            <p className="mt-0.5 text-sm font-semibold text-alphavest-ivory">
              Version v{selectedDocument.latestVersionNumber ?? 1} of {selectedDocument.versionCount ?? 1} · source integrity retained
            </p>
            <p className="mt-0.5 text-xs leading-4 text-alphavest-muted">
              {selectedDocument.previewStatus ? labelFromEnum(selectedDocument.previewStatus) : "Preview"} · Target {selectedDocument.targetObjectType ? labelFromEnum(selectedDocument.targetObjectType) : "Document"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <MasterDetailSurface
      actionPolicy="command_handoff"
      actionRail="present"
      className="space-y-4"
      density="compact_operations"
      detail={detail}
      family="queue"
      filterState={searchTerm.length > 0 && activeFilterCount > 0 ? "active_query_and_filter" : searchTerm.length > 0 ? "active_query" : activeFilterCount > 0 ? "active_filter" : documents.length ? "inactive" : "disabled_static"}
      master={master}
      masterDetailMode="inline_detail_rail"
      mobileDetailFirst
      queueWorkbench
      selectedObjectId={selectedDocument?.id ?? "s029-empty-queue"}
      selectedObjectState={selectedDocument?.evidenceLifecycleStatus ?? "empty"}
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
          <ExtractionReviewWorkbench />
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
              data-testid="domain08-s030-verification-step"
              data-ux-domain08-client-release="locked"
              data-ux-domain08-evidence-sufficiency="not_claimed"
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
