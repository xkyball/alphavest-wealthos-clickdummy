import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

import { buildUiActionGuard } from "../lib/ui-clickflow-guards";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("V0.96 WP-11 shared interaction primitives", () => {
  test("classifies modal and drawer lifecycle hooks as shared primitive proof", () => {
    const modal = readSource("components", "ui", "modal.tsx");
    const drawer = readSource("components", "ui", "drawer.tsx");
    const lifecycleContract = readSource("lib", "ux-lifecycle-state-contract.ts");

    for (const source of [modal, drawer]) {
      expect(source).toContain("aria-describedby");
      expect(source).toContain("aria-labelledby");
      expect(source).toContain("focusableSelector");
      expect(source).toContain("previouslyFocusedRef");
      expect(source).toContain("uxLifecycleAttributesForKind");
      expect(source).toContain("{...lifecycleAttributes}");
      expect(source).toContain('role="status"');
      expect(source).toContain("Escape");
    }

    expect(lifecycleContract).toContain('"data-ux-lifecycle-cancel": contract.cancel');
    expect(lifecycleContract).toContain('"data-ux-lifecycle-open": contract.open');
    expect(lifecycleContract).toContain('"data-ux-no-overclaim": contract.noOverclaim');
    expect(modal).toContain('aria-modal="true"');
    expect(modal).toContain('role="dialog"');
    expect(drawer).toContain('role="complementary"');
    expect(lifecycleContract).toContain('"data-ux-a11y-focus-return": contract.focusReturn');
  });

  test("classifies tables, CTA cluster and state feedback as truth-state primitives", () => {
    const dataTable = readSource("components", "ui", "data-table.tsx");
    const ctaCluster = readSource("components", "ux-cta-cluster.tsx");
    const actionContract = readSource("lib", "ux-action-hierarchy-contract.ts");
    const statePanel = readSource("components", "ui", "state-panel.tsx");
    const stateBoundary = readSource("components", "ui", "state-boundary.tsx");
    const lifecycleContract = readSource("lib", "ux-lifecycle-state-contract.ts");
    const a11yStatus = readSource("components", "ui", "a11y-status.tsx");
    const statusChip = readSource("components", "ui", "status-chip.tsx");
    const statusCommand = readSource("lib", "ux-status-command-hierarchy.ts");

    expect(dataTable).toContain('state?: ComponentState | "ready"');
    expect(dataTable).toContain('state !== "ready"');
    expect(dataTable).toContain("rowActionUnavailableLabel");
    expect(dataTable).toContain('data-ux-row-action-state={actionEnabled ? "enabled" : "disabled"}');
    expect(dataTable).toContain("uxDataSurfaceAttributesFor");
    expect(dataTable).toContain("uxDataFieldAttributesFor");
    expect(dataTable).toContain("uxDataSurfaceActionAttributesFor");
    expect(dataTable).toContain("No row action is available for this table state.");

    expect(ctaCluster).toContain("uxActionAttributesFor");
    expect(actionContract).toContain('"data-ux-primary-cta": input.priority === "primary" ? "true" : undefined');
    expect(actionContract).toContain('"data-ux-secondary-cta": input.priority === "secondary" || input.priority === "tertiary" ? "true" : undefined');
    expect(actionContract).toContain('"data-ux-recovery-cta": input.priority === "recovery" ? "true" : undefined');
    expect(actionContract).toContain("This action is held until an authorized lifecycle is wired.");
    expect(ctaCluster).toContain('testId="ux-cta-disabled-reason" visible');

    expect(statePanel).toContain("uxStateAttributesForComponentState");
    expect(statePanel).toContain("{...stateAttributes}");
    expect(lifecycleContract).toContain('"data-ux-state": contract.componentState');
    expect(statePanel).toContain('"audit-unavailable"');
    expect(statePanel).toContain('"export-pending"');
    expect(statePanel).toContain("redacted:");
    expect(stateBoundary).toContain("stateBoundaryToComponentState");
    expect(stateBoundary).toContain('"permission-denied": "denied"');
    expect(stateBoundary).toContain('data-ux-state-boundary="standard"');

    expect(a11yStatus).toContain('data-ux-a11y-keyboard="tab-escape-cancel-return"');
    expect(a11yStatus).toContain('data-ux-a11y-status="polite-live-region"');
    expect(a11yStatus).toContain('role="status"');

    expect(statusChip).toContain("uxStatusCommandAttributesFor");
    expect(statusChip).toContain("statusComponentState");
    expect(statusCommand).toContain("uxStatusPrimitiveContractId");
    expect(statusCommand).toContain("uxConfirmationAttributesFor");
    expect(statusCommand).toContain('"data-ux-confirmation-no-overclaim": "true"');
  });

  test("guarded action button exposes denied disabled loading success and error lifecycle states", () => {
    const guardedButton = readSource("components", "ui", "guarded-action-button.tsx");
    const actionContract = readSource("lib", "ux-action-hierarchy-contract.ts");
    const feedbackContract = readSource("lib", "ux-feedback-message-contract.ts");
    const guardTypes = readSource("lib", "ui-clickflow-guards.ts");

    expect(guardTypes).toContain('"enabled" | "disabled" | "denied" | "error" | "hidden" | "loading" | "success"');
    expect(guardedButton).toContain("type GuardedActionLifecycleState");
    expect(guardedButton).toContain("uxActionAttributesFor");
    expect(guardedButton).toContain("{...actionAttributes}");
    expect(guardedButton).toContain('data-ux-action-guard-state={effectiveStatus}');
    expect(guardedButton).toContain('data-ux-lifecycle-status={effectiveStatus}');
    expect(actionContract).toContain('"data-ux-requires-audit": (input.requiresAudit ?? meaningContract.requiresAudit) ? "true" : "false"');
    expect(actionContract).toContain('"data-ux-requires-confirmation": (input.requiresConfirmation ?? meaningContract.requiresConfirmation) ? "true" : "false"');
    expect(actionContract).toContain('"data-ux-requires-permission": input.requiresPermission === false ? "false" : "true"');
    expect(actionContract).toContain('"data-ux-no-overclaim": "true"');
    expect(guardedButton).toContain("disabled={disabled}");
    expect(guardedButton).toContain("onClick={disabled ? undefined : onClick}");
    expect(guardedButton).toContain("Action pending. Duplicate execution is blocked.");
    expect(feedbackContract).toContain("Action recorded for this control only; evidence, release, export, share, visibility and permission gates remain separate unless explicitly completed.");
    expect(guardedButton).toContain("Action failed closed. Review the blocker before retry.");
  });

  test("ui guard builder still denies hidden permission validation audit and gate blockers", () => {
    const denied = buildUiActionGuard({
      permission: { allowed: false, reason: "No permission for export approval.", reasonCode: "PERMISSION_DENIED" },
    });
    expect(denied).toMatchObject({
      allowed: false,
      disabled: true,
      hidden: false,
      reasonCode: "PERMISSION_DENIED",
      status: "denied",
      uiState: "PERMISSION_DENIED_STATE",
    });

    const validation = buildUiActionGuard({
      permission: { allowed: true, reason: "Allowed.", reasonCode: "ALLOWED" },
      validationPassed: false,
    });
    expect(validation).toMatchObject({
      disabled: true,
      reasonCode: "UI_VALIDATION_REQUIRED",
      status: "disabled",
      uiState: "VALIDATION_FAILED_STATE",
    });

    const audit = buildUiActionGuard({
      auditPersistenceAvailable: false,
      permission: { allowed: true, reason: "Allowed.", reasonCode: "ALLOWED" },
    });
    expect(audit).toMatchObject({
      disabled: true,
      reasonCode: "UI_AUDIT_UNAVAILABLE",
      status: "disabled",
      uiState: "AUDIT_UNAVAILABLE_STATE",
    });

    const gate = buildUiActionGuard({
      gate: { blockedReason: "Compliance release is still required.", missing: ["compliance_release"], passed: false },
      permission: { allowed: true, reason: "Allowed.", reasonCode: "ALLOWED" },
    });
    expect(gate).toMatchObject({
      disabled: true,
      reasonCode: "UI_WORKFLOW_GATE_BLOCKED",
      status: "disabled",
      uiState: "DISABLED_GATED_ACTION_STATE",
    });
  });
});
