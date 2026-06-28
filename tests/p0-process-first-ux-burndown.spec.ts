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

    expect(source).toContain("export function ProcessGateRail");
    expect(source).toContain("data-ux-process-first");
    expect(source).toContain("data-ux-process-acceptance-gates");
    expect(source).toContain("data-ux-process-business-processes");
    expect(source).toContain("data-ux-process-current-step");
    expect(source).toContain("data-ux-process-gate-state");
    expect(source).toContain("data-ux-process-gate-ids");
    expect(source).toContain("data-ux-process-next-step");
    expect(source).toContain("Next permitted action");
    expect(exports).toContain('export * from "@/components/ui/process-gate-rail"');
  });

  test("anchors action, advisor, compliance and export surfaces to explicit P0 process gates", () => {
    const actions = readSource("components", "wealth-actions-screen.tsx");
    const internal = readSource("components", "internal-workflow-screen.tsx");
    const exportOps = readSource("components", "communication-export-ops-screen.tsx");

    expect(actions).toContain('testId="bd05-action-board-process-gate"');
    expect(actions).toContain('processFirstUxContractForPageId("032")');
    expect(actions).toContain('currentStep="action_triage"');
    expect(actions).toContain('blockedReason="selected_action_missing_evidence"');
    expect(actions).toContain('data-testid="bd05-action-board-process-board"');
    expect(actions).toContain('data-ux-board-scroll="horizontal_process_columns"');
    expect(actions).toContain("Board context does not create evidence sufficiency, advisor approval, compliance release or client visibility.");

    expect(internal).toContain('testId="bd07-advisor-not-release-gate"');
    expect(internal).toContain('processFirstUxContractForPageId("037")');
    expect(internal).toContain('currentStep="advisor_review"');
    expect(internal).toContain('blockedReason="advisor_approval_not_release"');
    expect(internal).toContain("Advisor approval is not release");
    expect(internal).toContain('testId="bd08-compliance-release-gate"');
    expect(internal).toContain('processFirstUxContractForPageId("039")');
    expect(internal).toContain('currentStep="compliance_release_decision"');
    expect(internal).toContain('blockedReason="evidence_policy_audit_preconditions_not_satisfied"');
    expect(internal).toContain("Release remains unavailable until advisor approval, evidence sufficiency, client-safe payload, permission and audit persistence all pass.");

    expect(exportOps).toContain('testId="bd11-export-redaction-gate"');
    expect(exportOps).toContain('processFirstUxContractForPageId("056")');
    expect(exportOps).toContain('currentStep="redaction"');
    expect(exportOps).toContain('blockedReason="forbidden_payload_not_resolved"');
    expect(exportOps).toContain("Redaction can resolve forbidden payload exposure only; it cannot approve, generate, download or share the package.");
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
