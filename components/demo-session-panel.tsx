"use client";

import { Archive, BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { useDemoSession } from "@/components/demo-session-provider";
import { auditService } from "@/lib/audit-service";
import { demoPlatformTenantId, type DemoTenantSlug } from "@/lib/demo-session";
import type {
  ComplianceStatus,
  EvidenceStatus,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
} from "@/lib/domain-types";
import { evidenceService } from "@/lib/evidence-service";
import { exportService } from "@/lib/export-service";
import { permissionEngine } from "@/lib/permission-engine";
import { visibilityEngine } from "@/lib/visibility-engine";

type TenantGateState = {
  recommendationStatus: RecommendationStatus;
  advisorApprovalStatus: ReviewStatus;
  complianceStatus: ComplianceStatus;
  evidenceStatus: EvidenceStatus;
  visibilityStatus: VisibilityStatus;
  label: keyof typeof statusTone;
};

const statusTone = {
  Released: "border-alphavest-green/30 bg-alphavest-green/10 text-alphavest-green",
  "Needs evidence": "border-alphavest-gold/35 bg-alphavest-gold/10 text-alphavest-gold-soft",
  Blocked: "border-alphavest-red/30 bg-alphavest-red/10 text-alphavest-red",
  "Advisor approved": "border-alphavest-blue/30 bg-alphavest-blue/10 text-alphavest-blue",
} as const;

const tenantGateStates: Record<DemoTenantSlug, TenantGateState> = {
  bennett: {
    recommendationStatus: "RELEASED_TO_CLIENT",
    advisorApprovalStatus: "APPROVED",
    complianceStatus: "RELEASED",
    evidenceStatus: "RELEASED",
    visibilityStatus: "CLIENT_VISIBLE",
    label: "Released",
  },
  morgan: {
    recommendationStatus: "COMPLIANCE_PENDING",
    advisorApprovalStatus: "APPROVED",
    complianceStatus: "NEEDS_EVIDENCE",
    evidenceStatus: "PLACEHOLDER",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    label: "Needs evidence",
  },
  northbridge: {
    recommendationStatus: "BLOCKED",
    advisorApprovalStatus: "REQUEST_MORE_DATA",
    complianceStatus: "BLOCKED",
    evidenceStatus: "RESTRICTED",
    visibilityStatus: "RESTRICTED",
    label: "Blocked",
  },
  summit: {
    recommendationStatus: "ADVISOR_APPROVED",
    advisorApprovalStatus: "APPROVED",
    complianceStatus: "PENDING",
    evidenceStatus: "VALIDATED",
    visibilityStatus: "ADVISOR_VISIBLE",
    label: "Advisor approved",
  },
};

export function DemoSessionPanel() {
  const { session } = useDemoSession();

  const derived = useMemo(() => {
    const gateState = tenantGateStates[session.tenant.slug];
    const permission = permissionEngine.can(
      session.actor,
      "VIEW",
      {
        objectType: "RECOMMENDATION",
        clientTenantId: session.tenant.id,
        sensitivity: "RESTRICTED",
        visibilityStatus: gateState.visibilityStatus,
      },
      {
        platformTenantId: demoPlatformTenantId,
        clientTenantId: session.tenant.id,
        sensitivity: "RESTRICTED",
        clientVisibilityState: gateState.visibilityStatus,
      },
      session.role
    );
    const releaseGate = visibilityEngine.canBecomeClientVisible({
      recommendationStatus: gateState.recommendationStatus,
      advisorApprovalStatus: gateState.advisorApprovalStatus,
      complianceStatus: gateState.complianceStatus,
      evidenceStatus: gateState.evidenceStatus,
      permission,
      currentVisibility: gateState.visibilityStatus,
    });
    const auditDraft = auditService.previewEvent({
      actor: session.actor,
      role: session.role,
      platformTenantId: demoPlatformTenantId,
      clientTenantId: session.tenant.id,
      targetType: "RECOMMENDATION",
      action: releaseGate.passed ? "RELEASE" : "REVIEW",
      permission,
      result: releaseGate.passed ? "SUCCESS" : "BLOCKED",
    });
    const evidenceDraft = evidenceService.createEvidenceRecordDraft({
      actor: session.actor,
      clientTenantId: session.tenant.id,
      relatedObjectType: "RECOMMENDATION",
      title: `${session.tenant.displayName} release evidence`,
      visibilityStatus: gateState.visibilityStatus,
    });
    const exportGate = exportService.canGenerateExport({
      actor: session.actor,
      role: session.role,
      platformTenantId: demoPlatformTenantId,
      clientTenantId: session.tenant.id,
      targetType: "EVIDENCE_RECORD",
      redactionProfile: gateState.visibilityStatus === "CLIENT_VISIBLE" ? "client-visible" : "compliance-internal",
      approvalComplete: releaseGate.passed,
      externalShare: !releaseGate.passed,
    });

    return {
      auditDraft,
      evidenceDraft,
      exportGate,
      gateState,
      permission,
      releaseGate,
    };
  }, [session.actor, session.role, session.tenant]);

  const gateLabel = derived.releaseGate.passed ? "Client-safe available" : "Client-safe blocked";

  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <article className="alpha-card p-5">
        <div className="flex items-start justify-between gap-4 border-b border-alphavest-border/60 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-alphavest-gold">
              Session context
            </p>
            <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">
              {session.actor.displayName}
            </h2>
          </div>
          <span className="rounded-full border border-alphavest-blue/30 bg-alphavest-blue/10 px-3 py-1 text-xs font-semibold text-alphavest-blue">
            Active context
          </span>
        </div>

        <dl className="mt-5 grid gap-3 text-sm">
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
            <dt className="text-alphavest-muted">Tenant</dt>
            <dd className="mt-1 font-semibold text-alphavest-ivory">{session.tenant.displayName}</dd>
          </div>
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
            <dt className="text-alphavest-muted">Role</dt>
            <dd className="mt-1 font-semibold text-alphavest-ivory">{session.role.label}</dd>
          </div>
          <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
            <dt className="text-alphavest-muted">Access state</dt>
            <dd className="mt-1 font-semibold text-alphavest-ivory">{derived.permission.reasonCode}</dd>
          </div>
        </dl>
      </article>

      <article className="alpha-card p-5">
        <div className="flex flex-col gap-3 border-b border-alphavest-border/60 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-alphavest-gold">
              Visibility check
            </p>
            <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">
              No unapproved advice reaches the client
            </h2>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${derived.releaseGate.passed ? statusTone.Released : statusTone[derived.gateState.label]}`}>
            {gateLabel}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <GateMetric
            icon={BadgeCheck}
            label="Review state"
            value={derived.gateState.label}
          />
          <GateMetric
            icon={ShieldCheck}
            label="Audit state"
            value={derived.auditDraft.result}
          />
          <GateMetric
            icon={Archive}
            label="Evidence state"
            value={derived.evidenceDraft.status}
          />
          <GateMetric
            icon={FileCheck2}
            label="Export status"
            value={derived.exportGate.status}
          />
        </div>

        <div className="mt-5 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
          <p className="text-sm font-semibold text-alphavest-ivory">
            {derived.releaseGate.passed ? "All release checks passed." : "Missing checks"}
          </p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">
            {derived.releaseGate.passed
              ? "Advisor approval, compliance release, evidence and permission checks are complete."
              : derived.releaseGate.missing.join(", ")}
          </p>
        </div>
      </article>
    </section>
  );
}

type GateMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function GateMetric({ icon: Icon, label, value }: GateMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 text-alphavest-gold">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-alphavest-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
      </div>
    </div>
  );
}
