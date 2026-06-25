import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { canonicalExportStatuses, exportStatusUiTruth, exportStatusUiTruthFor } from "../lib/domain-types";

const schema = readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");

function fileText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function schemaBlock(kind: "enum" | "model", name: string) {
  const match = schema.match(new RegExp(`${kind} ${name} \\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`Missing ${kind} ${name}`);
  return match[1];
}

function expectModelFields(modelName: string, fields: string[]) {
  const block = schemaBlock("model", modelName);
  for (const field of fields) {
    expect(block, `${modelName}.${field}`).toMatch(new RegExp(`\\b${field}\\b`));
  }
}

test.describe("Phase 09 schema alignment", () => {
  test("preserves the full-workflow Prisma baseline without patch-schema takeover", () => {
    const sourceRealityGate = fileText("lib/source-reality-gate.ts");
    const wp09Execution = fileText("docs/00-current/ALPHAVEST_WP09_SCHEMA_USAGE_ALIGNMENT_EXECUTION.md");

    const models = [...schema.matchAll(/^model\s+(\w+)\s+\{/gm)].map((match) => match[1]);
    const enums = [...schema.matchAll(/^enum\s+(\w+)\s+\{/gm)].map((match) => match[1]);

    expect(models).toHaveLength(49);
    expect(enums).toHaveLength(27);
    expect(sourceRealityGate).toContain("modelCount: 49");
    expect(sourceRealityGate).toContain("enumCount: 27");
    expect(wp09Execution).toContain("Current `full-workflow` schema is the only implementation schema authority.");
    expect(wp09Execution).toContain("No Prisma migration is allowed in WP09 first wave.");

    for (const patchOnlyModel of ["AiDraft", "ClientVisibilityEvaluation", "PolicyException", "VisibilityRule"]) {
      expect(models).not.toContain(patchOnlyModel);
    }
  });

  test("keeps RBAC and object-scope field usage on existing full-workflow models", () => {
    expectModelFields("Role", ["key", "scope", "requiresSecondConfirmation", "segregationGroup"]);
    expectModelFields("Permission", [
      "key",
      "objectType",
      "action",
      "requiresAudit",
      "requiresSecondConfirmation",
      "requiresComplianceReview",
    ]);
    expectModelFields("RolePermission", ["effect", "conditionJson"]);
    expectModelFields("UserRole", ["clientTenantId", "entityId", "engagementId", "objectType", "objectId", "status"]);
    expectModelFields("AccessRequest", ["objectType", "objectId", "requestedAction", "status", "complianceRequired"]);
    expectModelFields("SecondConfirmation", [
      "targetObjectType",
      "targetObjectId",
      "action",
      "confirmationPhrase",
      "status",
    ]);
  });

  test("keeps visibility and advice-boundary fields separated without AiDraft model creation", () => {
    expectModelFields("Recommendation", [
      "summaryInternal",
      "clientSummaryDraft",
      "adviceClassification",
      "status",
      "advisorApprovalId",
      "complianceReviewId",
      "clientVisible",
      "assumptionsJson",
    ]);
    expectModelFields("Approval", ["targetType", "targetId", "approverUserId", "approvalType", "status", "approvedAt"]);
    expectModelFields("ComplianceReview", [
      "status",
      "adviceClassification",
      "evidenceComplete",
      "releasedAt",
      "blockedAt",
      "recordOfAdviceRequired",
      "recordOfAdviceDocumentId",
      "releaseNotes",
    ]);
    expectModelFields("Decision", ["status", "releasedToClientAt", "decisionByUserId", "decisionReason", "evidenceRecordId"]);

    expect(schema).not.toMatch(/^model\s+AiDraft\s+\{/m);
  });

  test("keeps Wave 0-2 Journey spine additive and hold-aware", () => {
    expectModelFields("JourneyDefinition", [
      "journeyKey",
      "title",
      "description",
      "wave",
      "status",
      "holdReason",
      "routePageIds",
      "actorRoleKeys",
    ]);
    expectModelFields("JourneyInstance", [
      "definitionId",
      "clientTenantId",
      "status",
      "currentStepKey",
      "currentStageKey",
      "blockerCode",
      "blockerReason",
    ]);
    expectModelFields("JourneyStepInstance", ["journeyInstanceId", "stepKey", "stageKey", "status", "sortOrder"]);
    expectModelFields("JourneyObjectLink", ["journeyInstanceId", "objectType", "objectId", "linkRole"]);
    expectModelFields("JourneyEvidenceRequirement", [
      "journeyDefinitionId",
      "requirementKey",
      "requiredObjectType",
      "requiredForStepKey",
      "minEvidenceStatus",
    ]);
    expectModelFields("JourneyCommandRun", ["journeyInstanceId", "commandKey", "actorRoleKey", "result"]);

    expect(schemaBlock("enum", "ObjectType")).toContain("JOURNEY");
    expect(schemaBlock("enum", "ObjectType")).toContain("JOURNEY_STEP");
    expect(schemaBlock("enum", "JourneyDefinitionStatus")).toContain("HOLD_LOCKED");
  });

  test("keeps document, evidence, audit and export safety fields available on baseline models", () => {
    expectModelFields("Document", ["status", "sensitivity", "clientVisible", "storageKey", "checksum", "mimeType"]);
    expectModelFields("DocumentVersion", ["versionNumber", "storageKey", "checksum", "changeReason"]);
    expectModelFields("DocumentExtraction", [
      "extractionStatus",
      "confidenceScore",
      "extractedFieldsJson",
      "lowConfidenceFieldsJson",
      "isClientVisible",
    ]);
    expectModelFields("DocumentReview", ["status", "notes", "clientVisibleSummary", "reviewedAt"]);
    expectModelFields("DocumentLink", ["targetType", "targetId", "relationship"]);
    expectModelFields("EvidenceRecord", ["status", "relatedObjectType", "relatedObjectId", "visibilityStatus", "reviewDate"]);
    expectModelFields("EvidenceItem", ["sourceObjectType", "sourceObjectId", "visibilityStatus", "hash"]);
    expectModelFields("AuditEvent", [
      "actorUserId",
      "actorRoleKey",
      "eventType",
      "targetType",
      "targetId",
      "previousState",
      "nextState",
      "result",
      "reason",
      "correlationId",
      "metadataJson",
    ]);
    expectModelFields("ExportRequest", [
      "exportType",
      "status",
      "scopeJson",
      "redactionProfile",
      "approvalRequired",
      "approvedByUserId",
      "generatedFileDocumentId",
    ]);
  });

  test("keeps patch-only schema concepts mapped or blocked rather than assumed", () => {
    const v1SchemaAlignment = fileText("V1_0_SCHEMA_USAGE_ALIGNMENT.md");
    const sourceRealityGate = fileText("lib/source-reality-gate.ts");

    expect(v1SchemaAlignment).toContain("DO_NOT_CREATE_PATCH_MODEL_NOW");
    expect(v1SchemaAlignment).toContain("ClientVisibilityEvaluation");
    expect(v1SchemaAlignment).toContain("PolicyException");
    expect(v1SchemaAlignment).toContain("VisibilityRule");
    expect(sourceRealityGate).toContain("NO_BLIND_SCHEMA_OR_PATCH_REPLACEMENT");
  });

  test("maps ExportStatus schema enum to canonical no-overclaim UI lifecycle states", () => {
    const exportStatusBlock = schemaBlock("enum", "ExportStatus");
    const schemaStatuses = [...exportStatusBlock.matchAll(/\b([A-Z_]+)\b/g)].map((match) => match[1]);

    expect(schemaStatuses).toEqual([...canonicalExportStatuses]);
    expect(Object.keys(exportStatusUiTruth)).toEqual([...canonicalExportStatuses]);
    expect(exportStatusUiTruth.APPROVAL_REQUIRED).toMatchObject({
      canApprove: true,
      canDownload: false,
      canGenerate: false,
      lifecycleStage: "approval",
      schemaUsage: "CANONICAL",
    });
    expect(exportStatusUiTruth.GENERATED).toMatchObject({
      canApprove: false,
      canDownload: true,
      lifecycleStage: "generated",
    });
    expect(exportStatusUiTruth.DOWNLOADED.noOverclaimDetail).toContain("client acceptance");
    expect(exportStatusUiTruthFor("PATCH_READY")).toMatchObject({
      canApprove: false,
      canDownload: false,
      canGenerate: false,
      schemaStatus: "UNKNOWN",
      schemaUsage: "CONFLICTING",
    });
  });

  test("maps V1 P0 gates to existing schema/runtime support without adding migrations", () => {
    const v1SchemaAlignment = fileText("V1_0_SCHEMA_USAGE_ALIGNMENT.md");
    const packageJson = fileText("package.json");
    const migrationFiles = readdirSync(path.join(process.cwd(), "prisma/migrations")).sort();

    for (const concept of [
      "Actor",
      "Tenant",
      "Role",
      "Object scope",
      "Client visibility",
      "AI draft internal-only",
      "Advisor approval",
      "Compliance release",
      "Evidence status/sufficiency",
      "Upload-only state",
      "Audit persistence",
      "Export status/redaction",
      "Admin non-bypass",
      "Data-quality release guard",
    ]) {
      expect(v1SchemaAlignment, concept).toContain(`| ${concept} |`);
    }

    expect(v1SchemaAlignment).toContain("NO_MIGRATION_REQUIRED_FOR_WP09_FIRST_WAVE");
    expect(v1SchemaAlignment).toContain("AiDraft");
    expect(v1SchemaAlignment).toContain("ClientVisibilityEvaluation");
    expect(v1SchemaAlignment).toContain("VisibilityRule");
    expect(migrationFiles).toEqual([
      "20260614201128_init_phase_02",
      "20260614202332_phase_03_data_model_seed",
      "20260624190000_wave_0_2_journey_spine",
      "20260624213000_wave_0_2_core_journey_gates",
      "migration_lock.toml",
    ]);
    expect(packageJson).toContain('"db:validate": "prisma validate"');
  });
});
