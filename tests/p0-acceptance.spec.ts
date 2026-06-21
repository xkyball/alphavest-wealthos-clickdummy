import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { parseDemoWorkflowRequestBody } from "../lib/demo-workflow-validation";
import { evidenceService } from "../lib/evidence-service";
import { exportPackageService } from "../lib/export-package-service";
import { exportService } from "../lib/export-service";
import { fileMetadataService } from "../lib/file-metadata-service";
import {
  p0AcceptanceProofGaps,
  p0AcceptanceProofMap,
  p0ApiRouteUniverse,
  p0MappedJourneyIds,
  p0RouteUiStateObligations,
} from "../lib/p0-acceptance-proof";
import { permissionEngine } from "../lib/permission-engine";
import {
  routeImplementationAccessDecision,
  routeScopeForPageId,
  routeWorksetIntegrity,
} from "../lib/route-registry";
import {
  scfBaselineCounts,
  scfDecisionQueues,
  scfDoNotImplementRegister,
  scfFoundationTaskIds,
  scfMasterTasksForPhases,
  scfProofCommandBaseline,
  scfSubtasksForPhases,
} from "../lib/scf-foundation";
import { visibilityEngine } from "../lib/visibility-engine";
import { canBecomeClientVisible } from "../lib/workflow-gate";

const firstBuildBp11TaskIds = [
  "AV-FB-P8-BP11-T001",
  "AV-FB-P8-BP11-T002",
  "AV-FB-P8-BP11-T003",
  "AV-FB-P8-BP11-T004",
  "AV-FB-P8-BP11-T005",
  "AV-FB-P8-BP11-T006",
  "AV-FB-P8-BP11-T007",
  "AV-FB-P8-BP11-T008",
  "AV-FB-P8-BP11-T009",
  "AV-FB-P8-BP11-T010",
  "AV-FB-P8-BP11-T011",
  "AV-FB-P8-BP11-T012",
  "AV-FB-P8-BP11-T013",
  "AV-FB-P8-BP11-T014",
] as const;

const firstBuildFinalValidationScripts = [
  "typecheck",
  "lint",
  "db:validate",
  "build",
  "test:playwright",
  "test:permissions",
  "test:workflow-gate",
  "test:workflow-api",
  "test:route-smoke",
  "test:data-quality",
  "test:file-export",
  "test:phase-d",
] as const;

function readWorkspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function apiRouteFiles(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath);

  return readdirSync(absolutePath, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name === "route.ts")
    .map((entry) => path.join(entry.parentPath, entry.name))
    .map((absoluteFile) => path.relative(process.cwd(), absoluteFile).split(path.sep).join("/"))
    .sort();
}

function restrictedRecommendationPayload(clientTenantId: string) {
  return {
    assumptionsJson: { model: "rules-draft" },
    clientSummary: "Released client-safe next step.",
    clientSummaryDraft: "AI Draft: rebalance the offshore portfolio.",
    clientTenantId,
    clientVisible: true,
    complianceNotes: "Compliance-only notes.",
    internalRationale: "Internal rationale for advisor review.",
    recommendationStatus: "RELEASED_TO_CLIENT" as const,
    sensitivity: "RESTRICTED" as const,
    summaryInternal: "Analyst working summary.",
    visibilityStatus: "CLIENT_VISIBLE" as const,
  };
}

test.describe("PHASE-10 P0 acceptance assertions", () => {
  test("AV-SLICE-P0-01 keeps client/API/export payload projection redacted and fail-closed", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = restrictedRecommendationPayload(principal.tenant.id);

    const releasedProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(releasedProjection.visible).toBe(true);
    expect(releasedProjection.payload).toEqual({ clientSummary: payload.clientSummary });
    expect(releasedProjection.hiddenFields).toEqual([
      "clientSummaryDraft",
      "summaryInternal",
      "internalRationale",
      "complianceNotes",
      "assumptionsJson",
    ]);

    const unreleasedProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      {
        ...payload,
        clientVisible: false,
        recommendationStatus: "COMPLIANCE_PENDING",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(unreleasedProjection.visible).toBe(false);
    expect(unreleasedProjection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(unreleasedProjection.payload).toEqual({});
    expect(unreleasedProjection.hiddenFields).toContain("clientSummary");
    expect(unreleasedProjection.hiddenFields).toContain("internalRationale");
  });

  test("AV-SLICE-P0-02 keeps AI Draft internal-only and out of export payloads", () => {
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = restrictedRecommendationPayload(principal.tenant.id);

    const internalProjection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      {
        ...payload,
        clientVisible: false,
        recommendationStatus: "AI_DRAFT",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      demoPlatformTenantId,
      analyst.tenant.id,
    );

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.payload.clientSummaryDraft).toBe(payload.clientSummaryDraft);
    expect(internalProjection.payload.internalRationale).toBe(payload.internalRationale);

    const clientProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      {
        ...payload,
        clientVisible: false,
        recommendationStatus: "AI_DRAFT",
        visibilityStatus: "ADVISOR_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(clientProjection.visible).toBe(false);
    expect(clientProjection.payload).toEqual({});

    const forbiddenPayloads = exportService.forbiddenExportPayloads([
      "CLIENT_SAFE_SUMMARY",
      "AI_DRAFT",
      "INTERNAL_RATIONALE",
      "COMPLIANCE_NOTES",
    ]);

    expect(forbiddenPayloads).toEqual(["AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES"]);
  });

  test("AV-SLICE-P0-03 separates advisor approval from compliance release", () => {
    const advisorOnly = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "PENDING",
      currentVisibility: "ADVISOR_VISIBLE",
      evidenceStatus: "VALIDATED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "ADVISOR_APPROVED",
    });

    expect(advisorOnly.passed).toBe(false);
    expect(advisorOnly.missing).toContain("recommendation_released_to_client");
    expect(advisorOnly.missing).toContain("compliance_release");
    expect(advisorOnly.missing).not.toContain("advisor_approval");

    const released = canBecomeClientVisible({
      advisorApprovalStatus: "APPROVED",
      complianceStatus: "RELEASED",
      currentVisibility: "CLIENT_VISIBLE",
      evidenceStatus: "RELEASED",
      permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(released.passed).toBe(true);
    expect(released.missing).toEqual([]);
  });

  test("AV-SLICE-P0-04 allows governance administration without safety-gate bypass", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });

    const governanceManage = permissionEngine.can(
      admin.actor,
      "MANAGE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(governanceManage.allowed).toBe(true);
    expect(governanceManage.requiresAudit).toBe(true);
    expect(governanceManage.requiresSecondConfirmation).toBe(true);

    const adminRelease = permissionEngine.can(
      admin.actor,
      "RELEASE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminRelease.allowed).toBe(false);
    expect(adminRelease.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(adminRelease.requiresSecondConfirmation).toBe(true);

    const adminEvidenceApproval = permissionEngine.can(
      admin.actor,
      "APPROVE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EVIDENCE_RECORD",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminEvidenceApproval.allowed).toBe(false);
    expect(adminEvidenceApproval.reasonCode).toBe("DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS");

    const adminVisibilityRelease = permissionEngine.can(
      admin.actor,
      "RELEASE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "DECISION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminVisibilityRelease.allowed).toBe(false);
    expect(adminVisibilityRelease.reasonCode).toBe("DEMO_DENY_ADMIN_VISIBILITY_NON_BYPASS");

    const adminExport = permissionEngine.can(
      admin.actor,
      "EXPORT",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminExport.allowed).toBe(false);
    expect(adminExport.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");

    const complianceRecommendationId = "recommendation:summit:p0-compliance-release";
    const complianceRelease = permissionEngine.can(
      compliance.actor,
      "RELEASE",
      {
        clientTenantId: compliance.tenant.id,
        objectId: complianceRecommendationId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: compliance.tenant.id,
        objectScope: {
          clientTenantId: compliance.tenant.id,
          objectIds: [complianceRecommendationId],
          objectType: "RECOMMENDATION",
        },
        platformTenantId: demoPlatformTenantId,
      },
      compliance.role,
    );

    expect(complianceRelease.allowed).toBe(true);
    expect(complianceRelease.requiresComplianceReview).toBe(true);
  });

  test("AV-SLICE-P0-05 proves upload-created evidence is not sufficiency, release or export proof", () => {
    const uploadEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: false,
      current: true,
      relatedObjectId: "document-1",
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "recommendation-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: false,
      status: "CREATED",
      visibilityStatus: "INTERNAL_ONLY",
    });

    expect(uploadEvidence.sufficient).toBe(false);
    expect(uploadEvidence.label).toBe("EVIDENCE_REVIEW_PENDING");
    expect(uploadEvidence.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");
    expect(uploadEvidence.exportImpact).toBe("EXPORT_BLOCKED_NEEDS_EVIDENCE");
    expect(uploadEvidence.missing).toEqual(
      expect.arrayContaining([
        "evidence_review",
        "evidence_acceptance",
        "evidence_object_type_scope",
        "evidence_object_id_scope",
        "client_safe_visibility",
      ]),
    );

    const reviewedEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: "recommendation-1",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "recommendation-1",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "RELEASED",
      visibilityStatus: "REDACTED",
    });

    expect(reviewedEvidence.sufficient).toBe(true);
    expect(reviewedEvidence.releaseImpact).toBe("RELEASE_ALLOWED_FOR_SCOPED_GATE");
  });

  test("AV-SLICE-P0-06 requires audit persistence for critical gate advancement", () => {
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const auditRecommendationId = "recommendation:summit:p0-audit-release";
    const releaseDecision = permissionEngine.can(
      compliance.actor,
      "RELEASE",
      {
        clientTenantId: compliance.tenant.id,
        objectId: auditRecommendationId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: compliance.tenant.id,
        objectScope: {
          clientTenantId: compliance.tenant.id,
          objectIds: [auditRecommendationId],
          objectType: "RECOMMENDATION",
        },
        platformTenantId: demoPlatformTenantId,
      },
      compliance.role,
    );

    expect(releaseDecision.allowed).toBe(true);
    expect(releaseDecision.requiresAudit).toBe(true);

    const blockedExport = exportService.canGenerateExport({
      actor: compliance.actor,
      approvalComplete: true,
      auditPersistenceAvailable: false,
      clientTenantId: compliance.tenant.id,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "external-limited",
      role: compliance.role,
      targetId: "export-1",
      targetType: "EXPORT_REQUEST",
    });

    expect(blockedExport.allowedToGenerate).toBe(false);
    expect(blockedExport.missing).toContain("audit_persistence");
  });

  test("AV-SLICE-P0-07 keeps export redaction and preview/approval/download separated", () => {
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });

    const previewOnly = exportService.canGenerateExport({
      actor: compliance.actor,
      approvalComplete: false,
      auditPersistenceAvailable: true,
      clientTenantId: compliance.tenant.id,
      externalShare: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "external-limited",
      role: compliance.role,
      targetId: "export-1",
      targetType: "EXPORT_REQUEST",
    });

    expect(previewOnly.allowedToGenerate).toBe(false);
    expect(previewOnly.status).toBe("APPROVAL_REQUIRED");
    expect(previewOnly.missing).toContain("approval");
    expect(previewOnly.missing).toContain("external_share_approval");

    const approved = exportService.canGenerateExport({
      actor: compliance.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: compliance.tenant.id,
      externalShare: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "external-limited",
      role: compliance.role,
      targetId: "export-1",
      targetType: "EXPORT_REQUEST",
    });

    expect(approved.allowedToGenerate).toBe(true);
    expect(approved.status).toBe("GENERATED");

    const file = fileMetadataService.prepareDemoFileMetadata({
      category: "exports",
      checksumSeed: "summit:p0-export:unsafe",
      fileName: "EXP-P0-redacted.zip",
      fileSizeBytes: 1024,
      mimeType: "application/zip",
      tenantSlug: "summit",
    });
    const unsafeManifest = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: true,
      auditPersistenceAvailable: true,
      expiresAt: new Date("2026-06-23T12:00:00.000Z"),
      exportRequestId: "export-1",
      externalShare: false,
      file,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "UNRELEASED_EVIDENCE"],
      redactionProfile: "external-limited",
      selectedObjectCount: 1,
      tenantSlug: "summit",
      watermark: true,
    });

    expect(unsafeManifest.valid).toBe(false);
    expect(unsafeManifest.issues).toContain("forbidden_payload:UNRELEASED_EVIDENCE");
  });

  test("AV-SLICE-P0-08 validates existing API request shapes and preserves the P0 API universe", () => {
    expect(parseDemoWorkflowRequestBody({ actionId: "j02.releaseClient" })).toEqual({
      ok: true,
      value: { actionId: "j02.releaseClient" },
    });
    expect(parseDemoWorkflowRequestBody({ actionId: "releaseClient" })).toEqual({
      issues: [
        {
          code: "invalid_action_id",
          field: "actionId",
          message: "Action ID must use the demo workflow format, for example j02.releaseClient.",
        },
      ],
      ok: false,
    });
    expect(parseDemoWorkflowRequestBody(null)).toEqual({
      issues: [
        {
          code: "invalid_body",
          field: "body",
          message: "Request body must be an object.",
        },
      ],
      ok: false,
    });
    expect(apiRouteFiles("app/api")).toEqual([...p0ApiRouteUniverse]);
  });

  test("AV-MVP-P10-T001/T002 maps every MVP journey to positive and negative proof or explicit blocker", () => {
    expect(p0AcceptanceProofGaps()).toEqual([]);
    expect(p0MappedJourneyIds()).toEqual(["MJ-001", "MJ-002", "MJ-003", "MJ-005", "MJ-006", "MJ-010", "MJ-012"]);

    for (const entry of p0AcceptanceProofMap) {
      expect(entry.positiveProof.length, `${entry.journeyId} positive proof`).toBeGreaterThan(0);
      expect(entry.negativeProof.length, `${entry.journeyId} negative proof`).toBeGreaterThan(0);
      expect(entry.nonClaims.length, `${entry.journeyId} non-claims`).toBeGreaterThan(0);
    }
  });

  test("AV-MVP-P10-T004/T005 keeps UI state obligations and proof report guarded against overclaim", () => {
    expect(p0RouteUiStateObligations).toHaveLength(4);

    for (const obligation of p0RouteUiStateObligations) {
      expect(obligation.routes.length).toBeGreaterThan(0);
      expect(obligation.proof).toBe("tests/ui-state-boundaries.spec.ts");
    }

    for (const entry of p0AcceptanceProofMap) {
      expect(entry.nonClaims.join(" ")).not.toMatch(/full MVP accepted|production ready|human visual accepted/i);
    }
  });

  test("SCF-P00/P01/P02 preserves route worksets and Do-Not-Implement boundaries", () => {
    expect(routeWorksetIntegrity.counts).toEqual({
      HOLD_PENDING_DECISION: 7,
      MVP: 31,
      MVP_SUPPORT: 25,
      P1_AFTER_MVP: 5,
      REFERENCE_ONLY: 3,
    });
    expect(routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(routeWorksetIntegrity.duplicatePageIds).toEqual([]);

    for (const pageId of ["052", "053", "059", "060", "068"]) {
      expect(routeScopeForPageId(pageId)).toBe("P1_AFTER_MVP");
      expect(routeImplementationAccessDecision({ pageId })).toEqual({
        accessMode: "REGISTERED_ONLY",
        exclusionReason: "P1_DEFERRED",
        implementationShellAccessible: false,
        routeScope: "P1_AFTER_MVP",
        safetyBoundary: "SCF_DO_NOT_IMPLEMENT_REGISTER",
      });
    }

    for (const pageId of ["061", "062", "063"]) {
      expect(routeScopeForPageId(pageId)).toBe("REFERENCE_ONLY");
      expect(routeImplementationAccessDecision({ pageId })).toEqual({
        accessMode: "REGISTERED_ONLY",
        exclusionReason: "REFERENCE_ONLY_NO_PRODUCT_TASK",
        implementationShellAccessible: false,
        routeScope: "REFERENCE_ONLY",
        safetyBoundary: "SCF_DO_NOT_IMPLEMENT_REGISTER",
      });
    }

    for (const pageId of ["064", "065", "066", "067", "069", "070", "071"]) {
      expect(routeScopeForPageId(pageId)).toBe("HOLD_PENDING_DECISION");
      expect(routeImplementationAccessDecision({ pageId })).toEqual({
        accessMode: "REGISTERED_ONLY",
        exclusionReason: "HOLD_PENDING_SCOPE_UNLOCK",
        implementationShellAccessible: false,
        routeScope: "HOLD_PENDING_DECISION",
        safetyBoundary: "SCF_DO_NOT_IMPLEMENT_REGISTER",
      });
    }

    expect(scfBaselineCounts.registeredRoutes).toBe(71);
    expect(scfBaselineCounts.routeWorksets).toEqual(routeWorksetIntegrity.counts);
    expect(scfDecisionQueues).toEqual({
      defer: 26,
      hold: 42,
      implement: 363,
      referenceOnly: 11,
      staticExplicit: 80,
    });
    expect(scfDoNotImplementRegister.map((entry) => entry.id)).toEqual([
      "DNI-P1-001",
      "DNI-REF-001",
      "DNI-HOLD-001",
      "DNI-STATIC-001",
    ]);
    expect(scfFoundationTaskIds()).toEqual([
      "SCF-P00-T001",
      "SCF-P00-T002",
      "SCF-P01-T001",
      "SCF-P01-T002",
      "SCF-P02-T001",
      "SCF-P02-T002",
      "SCF-P03-T001",
      "SCF-P03-T002",
      "SCF-P04-T001",
      "SCF-P04-T002",
      "SCF-P04-T003",
      "SCF-P05-T001",
      "SCF-P05-T002",
      "SCF-P05-T003",
      "SCF-P06-T001",
      "SCF-P06-T002",
      "SCF-P07-T001",
      "SCF-P07-T002",
      "SCF-P08-T001",
      "SCF-P08-T002",
      "SCF-P09-T001",
      "SCF-P09-T002",
    ]);
    expect(scfProofCommandBaseline).toContain("pnpm test:permissions");
    expect(scfProofCommandBaseline.join(" ")).toContain("tests/demo-workflow-api.spec.ts");
    expect(scfProofCommandBaseline.join(" ")).toContain("tests/client-visibility-proof.spec.ts");
    expect(scfProofCommandBaseline.join(" ")).toContain("tests/file-export-realism.spec.ts");
  });

  test("SCF detail plan supersedes previous max override as task and phase authority", () => {
    const agents = readWorkspaceText("AGENTS.md");
    const detailPlan = readWorkspaceText("ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md");
    const handoff = readWorkspaceText("ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md");
    const packagePlan = readWorkspaceText("ALPHAVEST_MVP_FIRST_BUILD_PACKAGE_PLAN.md");

    expect(agents).toContain("ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md");
    expect(agents).toContain("operative source of truth for AlphaVest tasks and phases");
    expect(detailPlan).toContain("SOLE_TASK_AND_PHASE_SOURCE_OF_TRUTH");
    expect(detailPlan).toContain("Phasen: `P00` bis `P14`");
    expect(detailPlan).toContain("Tasks: alle `SCF-Pxx-Txxx`");
    expect(handoff).toContain("SUPERSEDED_FOR_TASKS_AND_PHASES_BY_SCF_DETAIL_PLAN");
    expect(handoff).toContain("Codex may execute from this file? | No");
    expect(packagePlan).toContain("SUPERSEDED_FOR_TASKS_AND_PHASES_BY_SCF_DETAIL_PLAN");
    expect(packagePlan).toContain("Sole task/phase source of truth");
    expect(packagePlan).toContain("This table is retained as historical context only");
    expect(packagePlan).toContain("Historical all-phase/all-task override");
    expect(handoff).not.toContain("All 62 task IDs below are explicitly authorized");
    expect(packagePlan).not.toContain("FIRST_BUILD_PACKAGE_PLAN_MAX_OVERRIDE_UNLOCKED");
  });

  test("SCF-P01/P02/P03/P04/P05/P06 master tasks and subtasks are represented as executable contracts", () => {
    const phases = ["P01", "P02", "P03", "P04", "P05", "P06"] as const;
    const masterTasks = scfMasterTasksForPhases([...phases]);
    const subtasks = scfSubtasksForPhases([...phases]);

    expect(masterTasks.map((task) => task.id)).toEqual([
      "SCF-P01-T001",
      "SCF-P01-T002",
      "SCF-P02-T001",
      "SCF-P02-T002",
      "SCF-P03-T001",
      "SCF-P03-T002",
      "SCF-P04-T001",
      "SCF-P04-T002",
      "SCF-P04-T003",
      "SCF-P05-T001",
      "SCF-P05-T002",
      "SCF-P05-T003",
      "SCF-P06-T001",
      "SCF-P06-T002",
    ]);
    expect(masterTasks).toHaveLength(14);
    expect(subtasks).toHaveLength(64);

    for (const task of masterTasks) {
      const taskSubtasks = subtasks.filter((subtask) => subtask.parentTaskId === task.id);

      expect(scfFoundationTaskIds()).toContain(task.id);
      expect(taskSubtasks.map((subtask) => subtask.id)).toEqual(
        Array.from({ length: task.subtaskCount }, (_, index) => `${task.id}-S${String(index + 1).padStart(2, "0")}`),
      );
      expect(task.targetAreas.length).toBeGreaterThan(0);
      expect(task.positiveAcceptance).toBeTruthy();
      expect(task.negativeAcceptance).toBeTruthy();
      expect(task.proofRequired).toBeTruthy();
      expect(task.testObligation).toBeTruthy();
      expect(taskSubtasks.at(-1)?.proof).toBe("Proof checklist");
      expect(taskSubtasks.at(-1)?.notes).toBe("No completion without proof.");
    }

    expect(masterTasks.find((task) => task.id === "SCF-P02-T002")?.status).toBe("blocked");
    expect(masterTasks.find((task) => task.id === "SCF-P04-T002")?.testObligation).toContain(
      "document-upload-api.spec.ts",
    );
    expect(masterTasks.find((task) => task.id === "SCF-P05-T002")?.testObligation).toContain(
      "client-visibility-proof.spec.ts",
    );
    expect(masterTasks.find((task) => task.id === "SCF-P06-T002")?.testObligation).toContain(
      "phase6-audit-persistence.spec.ts",
    );
  });

  test("AV-FB-P8-BP11-T001..T014 map final P0 proof, commands and report obligations", () => {
    const handoff = readWorkspaceText("ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md");
    const packageJson = JSON.parse(readWorkspaceText("package.json")) as {
      scripts: Record<string, string>;
    };

    for (const taskId of firstBuildBp11TaskIds) {
      expect(handoff, `${taskId} present in handoff`).toContain(taskId);
    }

    for (const scriptName of firstBuildFinalValidationScripts) {
      expect(packageJson.scripts, `${scriptName} script exists`).toHaveProperty(scriptName);
      expect(handoff, `${scriptName} mapped in handoff`).toContain(`pnpm ${scriptName}`);
    }

    expect(handoff).toContain("## Final MVP First Build Implementation Report");
    expect(handoff).toContain("P0 positive proof summary");
    expect(handoff).toContain("P0 negative proof summary");
    expect(handoff).toContain("Former non-task register execution proof");
    expect(handoff).toContain("Any failed command or missing P0 proof blocks completion.");
    expect(handoff).toContain("Routes 064–067 and 069–071 require task proof before release/advice scope.");
    expect(handoff).toContain("main-derived absence claims do not become target gaps/tasks.");
  });
});
