import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const handoffRoot = "_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED";
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
    const finalHandoff = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`);
    const taskMaster = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_CODEX_TASK_MASTER.md`);
    const schemaReconciliation = fileText(
      `${handoffRoot}/03_SAFETY_CONTRACTS/SCHEMA_FIELD_LEVEL_RECONCILIATION.md`,
    );

    const models = [...schema.matchAll(/^model\s+(\w+)\s+\{/gm)].map((match) => match[1]);
    const enums = [...schema.matchAll(/^enum\s+(\w+)\s+\{/gm)].map((match) => match[1]);

    expect(models).toHaveLength(42);
    expect(enums).toHaveLength(22);
    expect(finalHandoff).toContain("Full-workflow schema baseline locked");
    expect(taskMaster).toContain("Preserve full-workflow schema baseline");
    expect(schemaReconciliation).toContain("Full-workflow model count | 42 models");
    expect(schemaReconciliation).toContain("Full-workflow enum count | 22 enums");

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
    const schemaReconciliation = fileText(
      `${handoffRoot}/03_SAFETY_CONTRACTS/SCHEMA_FIELD_LEVEL_RECONCILIATION.md`,
    );
    const stopRules = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/STOP_RULES_MASTER.md`);

    expect(schemaReconciliation).toContain("DO_NOT_CREATE_PATCH_MODEL_NOW");
    expect(schemaReconciliation).toContain("ClientVisibilityEvaluation");
    expect(schemaReconciliation).toContain("BLOCKER_FOR_CODEX_TASK_MASTER");
    expect(stopRules).toContain("patch-schema takeover");
    expect(stopRules).toContain("Prisma/schema replacement");
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

    expect(v1SchemaAlignment).toContain("NO_MIGRATION_REQUIRED_FOR_WP11");
    expect(v1SchemaAlignment).toContain("AiDraft");
    expect(v1SchemaAlignment).toContain("ClientVisibilityEvaluation");
    expect(v1SchemaAlignment).toContain("VisibilityRule");
    expect(migrationFiles).toEqual([
      "20260614201128_init_phase_02",
      "20260614202332_phase_03_data_model_seed",
      "migration_lock.toml",
    ]);
    expect(packageJson).toContain('"db:validate": "prisma validate"');
  });
});
