import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("P0 process-first UX burndown implementation", () => {
  test("keeps retired process gate rail out of default operational UI primitives", () => {
    const exports = readSource("components", "ui", "index.ts");

    expect(existsSync(join(repoRoot, "components", "ui", "process-gate-rail.tsx"))).toBe(false);
    expect(existsSync(join(repoRoot, "components", "scf-p04-p06-flow-panel.tsx"))).toBe(false);
    expect(existsSync(join(repoRoot, "components", "scf-p07-p09-trust-panel.tsx"))).toBe(false);
    expect(exports).not.toContain('export * from "@/components/ui/process-gate-rail"');
  });

  test("anchors action, advisor, compliance and export surfaces to product-native blockers and actions", () => {
    const actions = readSource("components", "wealth-actions-screen.tsx");
    const internal = readSource("components", "internal-workflow-screen.tsx");
    const exportOps = readSource("components", "communication-export-ops-screen.tsx");

    expect(actions).toContain('processFirstUxContractForPageId("032")');
    expect(actions).toContain('data-testid="bd05-action-board-process-board"');
    expect(actions).toContain('data-ux-process-current-step="action_triage"');
    expect(actions).toContain('data-ux-process-blocked-reason="selected_action_missing_evidence"');
    expect(actions).toContain("Request the missing approval evidence before marking this work ready.");

    expect(internal).toContain('data-testid="bd07-advisor-decision-room-panel"');
    expect(internal).toContain("advisorReviewRouteOwnershipForPageId");
    expect(internal).toContain('data-epic10-primary-job="advisor_review_queue_entry"');
    expect(internal).toContain("Advisor queue selection can open package detail only.");
    expect(internal).toContain("Review Recommendation Package");
    expect(internal).toContain("function AdvisorDecisionRoomPanel");
    expect(internal).toContain('data-testid="bd07-advisor-decision-room-panel"');
    expect(internal).toContain('data-ux-layout-compression="bounded_decision_room"');
    expect(internal).toContain("Ask the analyst to rebuild unsupported claims before submitting the package for compliance review.");
    expect(internal).toContain('data-testid="bd08-compliance-decision-room-panel"');
    expect(internal).toContain('processFirstUxContractForPageId("039")');
    expect(internal).toContain('data-ux-process-current-step="compliance_release_decision"');
    expect(internal).toContain('data-ux-process-blocked-reason="evidence_policy_audit_preconditions_not_satisfied"');
    expect(internal).toContain("Review Requirements");
    expect(internal).toContain("function ComplianceDecisionRoomPanel");
    expect(internal).toContain('data-testid="bd08-compliance-decision-room-panel"');
    expect(internal).toContain("Request missing evidence or keep the review closed until the checklist is ready.");

    expect(exportOps).toContain('data-testid="bd11-export-redaction-gate"');
    expect(exportOps).toContain("Protection Checklist");
    expect(exportOps).toContain("Review protected content areas before preview inspection.");
    expect(exportOps).not.toContain('data-ux-process-current-step="redaction"');
    expect(exportOps).not.toContain('data-ux-process-blocked-reason="forbidden_payload_not_resolved"');
    expect(exportOps).not.toContain("Forbidden payload blocked. Redaction is required before preview, approval, download or share.");
    expect(exportOps).toContain('data-testid="bd11-export-approval-gate"');
    expect(exportOps).toContain("Preview Package");
    expect(exportOps).toContain("Approval Review");
    expect(exportOps).toContain("Approval records reviewer intent only. Delivery remains a later action.");
    expect(exportOps).not.toContain('currentStep="approval"');
    expect(exportOps).not.toContain('activeStage="approval"');
    expect(exportOps).not.toContain("Approval can record only the approval step; generation, download, share, advice release and client acceptance remain separate gates.");
  });

  test("keeps evidence templates readable and separate from evidence sufficiency", () => {
    const source = readSource("components", "admin-tenant-setup-screen.tsx");

    expect(source).toContain("platform-evidence-templates");
    expect(source).toContain("Evidence templates define requirements only. Upload or template presence is never treated as evidence sufficiency.");
    expect(source).toContain('className: "min-w-64"');
    expect(source).toContain('className: "min-w-48"');
    expect(source).toContain('responsiveMode="table"');
    expect(source).toContain('stickyHeader');
  });
});
