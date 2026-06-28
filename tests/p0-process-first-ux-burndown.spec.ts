import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("P0 process-first UX burndown implementation", () => {
  test("ships a reusable process gate rail for dominant gate state and next permitted action", () => {
    const source = readSource("components", "ui", "process-gate-rail.tsx");
    const exports = readSource("components", "ui", "index.ts");
    const scfFlow = readSource("components", "scf-p04-p06-flow-panel.tsx");

    expect(source).toContain("export function ProcessGateRail");
    expect(source).toContain("data-ux-process-first");
    expect(source).toContain("data-ux-process-acceptance-gates");
    expect(source).toContain("data-ux-process-business-processes");
    expect(source).toContain("data-ux-process-current-step");
    expect(source).toContain("data-ux-process-gate-state");
    expect(source).toContain("data-ux-process-gate-ids");
    expect(source).toContain("data-ux-process-next-step");
    expect(source).toContain("lg:grid-cols-2");
    expect(source).toContain("shrink-0 whitespace-nowrap");
    expect(source).toContain("Next permitted action");
    expect(scfFlow).toContain("2xl:grid-cols-3");
    expect(scfFlow).toContain("shrink-0 whitespace-nowrap");
    expect(exports).toContain('export * from "@/components/ui/process-gate-rail"');
  });

  test("anchors action, advisor, compliance and export surfaces to explicit P0 process gates", () => {
    const actions = readSource("components", "wealth-actions-screen.tsx");
    const internal = readSource("components", "internal-workflow-screen.tsx");
    const exportOps = readSource("components", "communication-export-ops-screen.tsx");

    expect(actions).toContain('processFirstUxContractForPageId("032")');
    expect(actions).toContain('data-testid="bd05-action-board-process-board"');
    expect(actions).toContain('data-ux-process-current-step="action_triage"');
    expect(actions).toContain('data-ux-process-blocked-reason="selected_action_missing_evidence"');
    expect(actions).toContain("Request the missing approval evidence before marking this work ready.");

    expect(internal).toContain('data-testid="bd07-advisor-decision-room-panel"');
    expect(internal).toContain('processFirstUxContractForPageId("037")');
    expect(internal).toContain('data-ux-process-current-step="advisor_review"');
    expect(internal).toContain('data-ux-process-blocked-reason="advisor_approval_not_release"');
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
    expect(internal).toContain("Check evidence, policy and audit readiness, then request evidence or keep the item closed.");

    expect(exportOps).toContain('data-testid="bd11-export-redaction-gate"');
    expect(exportOps).toContain("Protection Checklist");
    expect(exportOps).toContain("Review protected content areas before preview inspection.");
    expect(exportOps).not.toContain('data-ux-process-current-step="redaction"');
    expect(exportOps).not.toContain('data-ux-process-blocked-reason="forbidden_payload_not_resolved"');
    expect(exportOps).not.toContain("Forbidden payload blocked. Redaction is required before preview, approval, download or share.");
    expect(exportOps).toContain('testId="bd11-export-approval-gate"');
    expect(exportOps).toContain('processFirstUxContractForPageId("057")');
    expect(exportOps).toContain('currentStep="approval"');
    expect(exportOps).toContain('activeStage="approval"');
    expect(exportOps).toContain("Approval can record only the approval step; generation, download, share, advice release and client acceptance remain separate gates.");
  });

  test("keeps evidence templates readable and separate from evidence sufficiency", () => {
    const source = readSource("components", "admin-tenant-setup-screen.tsx");

    expect(source).toContain('testId="bd04-evidence-template-process-gate"');
    expect(source).toContain("Evidence templates define requested evidence only; upload, review, link, scope and sufficiency remain separate lifecycle states.");
    expect(source).toContain('className: "min-w-64"');
    expect(source).toContain('className: "min-w-48"');
    expect(source).toContain('responsiveMode="table"');
    expect(source).toContain('stickyHeader');
  });
});
