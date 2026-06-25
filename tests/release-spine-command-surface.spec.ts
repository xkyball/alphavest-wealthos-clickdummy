import { expect, test } from "@playwright/test";

import { evidenceService } from "../lib/evidence-service";
import { evaluateP44ComplianceReleasePreconditions } from "../lib/p44-phase7-compliance-rationale-closure";
import {
  buildCanonicalReleasePreconditions,
  runReleaseSpineCommand,
  type ReleaseSpineInput,
} from "../lib/release-spine-command-surface";
import { workflowGate } from "../lib/workflow-gate";

const sufficientEvidence = evidenceService.evaluateEvidenceSufficiency({
  accepted: true,
  current: true,
  relatedObjectId: "recommendation-release-spine",
  relatedObjectType: "RECOMMENDATION",
  requiredObjectId: "recommendation-release-spine",
  requiredObjectType: "RECOMMENDATION",
  reviewed: true,
  status: "RELEASED",
  visibilityStatus: "CLIENT_VISIBLE",
});

function readyInput(overrides: Partial<ReleaseSpineInput> = {}): ReleaseSpineInput {
  return {
    advisor: { approved: true },
    audit: { persistenceAvailable: true },
    compliance: { permissionAllowed: true },
    evidence: sufficientEvidence,
    payload: { ready: true },
    rationale: { captured: true },
    redaction: { ready: true },
    ...overrides,
  };
}

test.describe("ReleaseSpine typed command surface", () => {
  test("builds one canonical release-precondition object for advisor, evidence, rationale, compliance and export", () => {
    const result = runReleaseSpineCommand({
      command: "EVALUATE_RELEASE_PRECONDITIONS",
      input: readyInput({
        export: {
          approvalComplete: true,
          forbiddenPayloads: [],
          redactionProfile: "client-safe-redacted",
          targetSelected: true,
        },
      }),
    });

    expect(result.commandFamily).toBe("ReleaseSpine");
    expect(result.preconditions.canRelease).toBe(true);
    expect(result.preconditions.canExportAfterRelease).toBe(true);
    expect(result.preconditions.missing).toEqual([]);
  });

  test("matches existing compliance release gate and Phase 7 precondition semantics for missing blockers", () => {
    const evidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: false,
      current: false,
      relatedObjectId: "wrong-object",
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "recommendation-release-spine",
      requiredObjectType: "RECOMMENDATION",
      reviewed: false,
      status: "CREATED",
      visibilityStatus: "INTERNAL_ONLY",
    });
    const spine = buildCanonicalReleasePreconditions(
      readyInput({
        audit: { persistenceAvailable: false },
        evidence,
        payload: { ready: false },
        rationale: { captured: false },
        redaction: { ready: false },
      }),
    );
    const workflowGateResult = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: false,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision: evidence,
      payloadReady: false,
    });
    const phase7 = evaluateP44ComplianceReleasePreconditions({
      advisorApproved: true,
      auditPersistenceAvailable: false,
      evidenceSufficient: false,
      payloadReady: false,
      permissionAllowed: true,
      rationaleCaptured: false,
      redactionReady: false,
    });

    expect(spine.canRelease).toBe(false);
    expect(spine.missing).toEqual(expect.arrayContaining(workflowGateResult.missing));
    expect(spine.missing).toEqual(expect.arrayContaining(phase7.missing));
    expect(spine.missing).toEqual(
      expect.arrayContaining([
        "audit_persistence",
        "decision_rationale",
        "evidence_sufficiency",
        "payload_ready",
        "redaction_ready",
      ]),
    );
  });

  test("keeps advisor approval necessary but insufficient for release or export readiness", () => {
    const spine = buildCanonicalReleasePreconditions(
      readyInput({
        evidence: evidenceService.evaluateEvidenceSufficiency({
          accepted: false,
          current: false,
          relatedObjectId: "recommendation-release-spine",
          relatedObjectType: "RECOMMENDATION",
          requiredObjectId: "recommendation-release-spine",
          requiredObjectType: "RECOMMENDATION",
          reviewed: false,
          status: "CREATED",
          visibilityStatus: "INTERNAL_ONLY",
        }),
        rationale: { captured: false },
      }),
    );

    expect(spine.advisorApproved).toBe(true);
    expect(spine.canRelease).toBe(false);
    expect(spine.canExportAfterRelease).toBe(false);
    expect(spine.missing).not.toContain("advisor_approval");
    expect(spine.missing).toEqual(expect.arrayContaining(["evidence_sufficiency", "decision_rationale"]));
  });

  test("feeds data-quality and export forbidden-payload blockers into the same release spine", () => {
    const spine = buildCanonicalReleasePreconditions(
      readyInput({
        dataQualityGate: {
          gateName: "DATA_QUALITY_RELEASE_READY",
          missing: ["high_severity_data_quality_issues"],
          passed: false,
        },
        export: {
          approvalComplete: true,
          forbiddenPayloads: ["INTERNAL_RATIONALE"],
          redactionProfile: "client-safe-redacted",
          targetSelected: true,
        },
      }),
    );

    expect(spine.canRelease).toBe(false);
    expect(spine.canExportAfterRelease).toBe(false);
    expect(spine.dataQualityReady).toBe(false);
    expect(spine.exportPayloadClean).toBe(false);
    expect(spine.missing).toEqual(
      expect.arrayContaining([
        "data_quality_release_ready",
        "high_severity_data_quality_issues",
        "export_payload_clean",
      ]),
    );
  });
});
