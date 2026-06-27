import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { screenRoutes } from "../lib/route-registry";
import { uxOperatingModelForRoute } from "../lib/ux-operating-model";
import { uxPageTemplateForRoute } from "../lib/ux-page-template-system";
import {
  uxProofReviewerContentClasses,
  uxProofReviewerIntegrity,
  uxProofReviewerRecordForRoute,
  uxProofReviewerRouteRecords,
  uxProofReviewerVisibilityForContentClass,
} from "../lib/ux-proof-reviewer-mode";

test.describe("E03 canonical proof/reviewer mode", () => {
  test("classifies every approved proof/reviewer content class", () => {
    expect([...uxProofReviewerContentClasses]).toEqual([
      "task_context",
      "safety_blocker",
      "recovery_guidance",
      "route_context",
      "route_id",
      "ux_proof_tag",
      "capture_warning",
      "debug_metadata",
      "audit_history_summary",
      "internal_rationale",
      "compliance_note",
      "client_safe_signal",
    ]);

    for (const contentClass of uxProofReviewerContentClasses) {
      const decision = uxProofReviewerVisibilityForContentClass(contentClass);

      expect(decision.target, `${contentClass} target`).toMatch(/^(operational_default|reviewer_secondary|capture_only|client_mode)$/);
      expect(decision.noOverclaimRule, `${contentClass} no-overclaim`).toContain("traceability");
    }
  });

  test("materializes one proof/reviewer record for every registered route", () => {
    expect(uxProofReviewerIntegrity.totalCount).toBe(71);
    expect(uxProofReviewerIntegrity.missingPageIds).toEqual([]);
    expect(uxProofReviewerIntegrity.duplicatePageIds).toEqual([]);

    for (const route of screenRoutes) {
      const record = uxProofReviewerRecordForRoute(route);

      expect(record.pageId).toBe(route.pageId);
      expect(record.defaultVisibleContent).toContain("task_context");
      expect(record.defaultVisibleContent).toContain("safety_blocker");
      expect(record.reviewerSecondaryContent).toContain("route_id");
      expect(record.reviewerSecondaryContent).toContain("ux_proof_tag");
      expect(record.suppressedInClientMode).toContain("debug_metadata");
      expect(record.suppressedInClientMode).toContain("compliance_note");
    }
  });

  test("projects from E01 operating model and E02 page template contract", () => {
    for (const route of screenRoutes) {
      const model = uxOperatingModelForRoute(route);
      const template = uxPageTemplateForRoute(route);
      const record = uxProofReviewerRecordForRoute(route);

      expect(record.mode, `${route.pageId} mode`).toBe(model.mode);
      expect(record.audience, `${route.pageId} audience`).toBe(model.audience);
      expect(record.proofPosture, `${route.pageId} proof posture`).toBe(model.proofPosture);
      expect(record.noOverclaimRule, `${route.pageId} no-overclaim`).toBe(model.noOverclaimRule);
      expect(record.templateFamily, `${route.pageId} template family`).toBe(template.family);
      expect(record.proofAuditPlacement, `${route.pageId} proof/audit placement`).toBe(template.proofAuditPlacement);
    }
  });

  test("keeps reviewer-only classes forbidden in client-safe route records", () => {
    expect(uxProofReviewerIntegrity.clientRecordsMissingRequiredSuppressions).toEqual([]);

    for (const record of uxProofReviewerRouteRecords.filter((candidate) => candidate.audience === "client_safe")) {
      expect(record.suppressedInClientMode).toEqual(expect.arrayContaining([
        "route_context",
        "route_id",
        "ux_proof_tag",
        "capture_warning",
        "debug_metadata",
        "audit_history_summary",
        "internal_rationale",
        "compliance_note",
      ]));
    }
  });

  test("renders reviewer metadata in a secondary surface without product controls", () => {
    const source = readFileSync(join(process.cwd(), "components/ux-proof-reviewer-secondary-surface.tsx"), "utf8");
    const reviewHubRecord = uxProofReviewerRouteRecords.find((record) => record.pageId === "039");

    expect(reviewHubRecord?.pageId).toBe("039");
    expect(reviewHubRecord?.reviewerSecondaryContent).toContain("route_id");
    expect(source).toContain('data-testid="ux-proof-reviewer-secondary-surface"');
    expect(source).toContain('data-ux-proof-mode="reviewer_secondary"');
    expect(source).toContain('data-ux-proof-default-visible="false"');
    expect(source).toContain("data-ux-proof-route-id");
    expect(source).toContain("Reviewer traceability");
    expect(source).toContain("traceability only");
    expect(source).not.toContain("<button");
    expect(source).not.toContain("href=");
  });
});
