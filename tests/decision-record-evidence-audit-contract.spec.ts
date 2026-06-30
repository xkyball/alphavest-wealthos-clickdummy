import { expect, test } from "@playwright/test";

import {
  decisionRecordEvidenceAuditAcceptanceCriteria,
  decisionRecordEvidenceAuditContractId,
  decisionRecordEvidenceAuditForbiddenOverclaims,
  decisionRecordEvidenceAuditPageIds,
  decisionRecordEvidenceAuditPayloadVisibility,
  decisionRecordEvidenceAuditProcessIds,
  decisionRecordEvidenceAuditProofBoundaries,
  decisionRecordEvidenceAuditRequirements,
  decisionRecordEvidenceAuditRoleGuards,
  decisionRecordEvidenceAuditRouteOwnership,
  decisionRecordEvidenceAuditRouteOwnershipForPageId,
  decisionRecordEvidenceAuditStateMachine,
} from "../lib/decision-record-evidence-audit-contract";

test.describe("DOMAIN-12 decision record evidence audit contract", () => {
  test("owns DOMAIN-I processes and all target screens including the audit-history route", () => {
    expect(decisionRecordEvidenceAuditContractId).toBe("DOMAIN-12_DECISION_RECORD_EVIDENCE_AUDIT_CONTRACT");
    expect(decisionRecordEvidenceAuditProcessIds).toEqual([
      "BP-075",
      "BP-076",
      "BP-077",
      "BP-078",
      "BP-081",
      "BP-082",
      "BP-083",
    ]);
    expect(decisionRecordEvidenceAuditRouteOwnership.map((owner) => owner.pageId)).toEqual([...decisionRecordEvidenceAuditPageIds]);

    const auditHistory = decisionRecordEvidenceAuditRouteOwnershipForPageId("051");
    expect(auditHistory).toMatchObject({
      pageFamily: "audit_history",
      route: "/governance/audit",
    });
    expect(auditHistory?.processIds).toEqual(["BP-082", "BP-083"]);
  });

  test("requires a UI pendant for every process-step input, gate, output and blocker state", () => {
    const coveredProcesses = new Set<string>();

    for (const route of decisionRecordEvidenceAuditRouteOwnership) {
      for (const processId of route.processIds) coveredProcesses.add(processId);
      expect(route.primaryJob.trim(), route.pageId).not.toBe("");
      expect(route.viewportRule.trim(), route.pageId).not.toBe("");
      expect(route.stepPendants.length, route.pageId).toBeGreaterThan(0);

      for (const pendant of route.stepPendants) {
        expect(pendant.inputUi.trim(), `${route.pageId}-${pendant.stepLabel}-input`).not.toBe("");
        expect(pendant.gateOrDecisionUi.trim(), `${route.pageId}-${pendant.stepLabel}-gate`).not.toBe("");
        expect(pendant.outputUi.trim(), `${route.pageId}-${pendant.stepLabel}-output`).not.toBe("");
        expect(pendant.blockerOrFailureUi.trim(), `${route.pageId}-${pendant.stepLabel}-blocker`).not.toBe("");
      }
    }

    expect([...coveredProcesses].sort()).toEqual([...decisionRecordEvidenceAuditProcessIds].sort());
  });

  test("defines positive and negative acceptance criteria for every DOMAIN-I process", () => {
    expect(decisionRecordEvidenceAuditAcceptanceCriteria.map((criterion) => criterion.processId)).toEqual([
      ...decisionRecordEvidenceAuditProcessIds,
    ]);

    for (const criterion of decisionRecordEvidenceAuditAcceptanceCriteria) {
      expect(criterion.positive.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative, criterion.processId).toMatch(/cannot|blocks|without|missing|wrong|display-only/i);
    }
  });

  test("keeps payload visibility, role guards and proof boundaries fail-closed", () => {
    expect(decisionRecordEvidenceAuditPayloadVisibility.internalOnlyFields).toEqual(
      expect.arrayContaining(["aiDraft", "internalRationale", "advisorNotes", "complianceNotes", "rawEvidencePayload"]),
    );
    expect(decisionRecordEvidenceAuditPayloadVisibility.clientSafeAllowedFields).not.toEqual(
      expect.arrayContaining(["aiDraft", "internalRationale", "advisorNotes", "complianceNotes", "rawEvidencePayload"]),
    );
    expect(decisionRecordEvidenceAuditForbiddenOverclaims).toEqual(
      expect.arrayContaining([
        "decision_submit_as_client_acceptance",
        "evidence_link_as_sufficiency",
        "audit_display_as_persisted_audit",
        "download_or_share_from_evidence_review",
      ]),
    );
    expect(decisionRecordEvidenceAuditRequirements).toEqual(
      expect.arrayContaining([
        "decision_record.confirm_action_with_audit",
        "evidence_vault.block_share_without_release",
        "audit_history.fail_closed_when_persistence_unavailable",
      ]),
    );

    const submit = decisionRecordEvidenceAuditRoleGuards.find((guard) => guard.action === "record_decision_action");
    expect(submit?.allowedRoles).toEqual(["principal", "family_cfo", "trustee"]);
    expect(submit?.hardNegative).toMatch(/audit persistence/i);

    const auditBoundary = decisionRecordEvidenceAuditProofBoundaries.find((boundary) => boundary.pageId === "051");
    expect(auditBoundary?.auditPosture).toBe("read_only_audit_review");
    expect(auditBoundary?.blockedOverclaims).toEqual(
      expect.arrayContaining(["audit_display_as_persisted_audit", "history_view_as_mutation_authority"]),
    );
  });

  test("models audit failure before persisted decision and client-safe projection", () => {
    expect(decisionRecordEvidenceAuditStateMachine).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: "ACTION_CONFIRMATION_REQUIRED",
          guard: "audit_persistence_unavailable",
          to: "AUDIT_FAILED_CLOSED",
        }),
        expect.objectContaining({
          from: "ACTION_CONFIRMATION_REQUIRED",
          guard: "audited_decision_action_persists",
          to: "AUDIT_PERSISTED",
        }),
        expect.objectContaining({
          from: "AUDIT_PERSISTED",
          guard: "client_projection_allowlist_only",
          to: "CLIENT_SAFE_PROJECTION_ONLY",
        }),
      ]),
    );
  });
});
