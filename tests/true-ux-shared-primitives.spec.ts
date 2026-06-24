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

    for (const source of [modal, drawer]) {
      expect(source).toContain("aria-describedby");
      expect(source).toContain("aria-labelledby");
      expect(source).toContain("focusableSelector");
      expect(source).toContain("previouslyFocusedRef");
      expect(source).toContain('data-ux-lifecycle-cancel="no-submit-no-mutation"');
      expect(source).toContain('data-ux-lifecycle-open="controlled-by-owner-state"');
      expect(source).toContain('data-ux-no-overclaim="true"');
      expect(source).toContain('role="status"');
      expect(source).toContain("Escape");
    }

    expect(modal).toContain('aria-modal="true"');
    expect(modal).toContain('role="dialog"');
    expect(drawer).toContain('role="complementary"');
    expect(drawer).toContain('data-ux-a11y-focus-return="trigger"');
  });

  test("classifies tables, CTA cluster and state feedback as truth-state primitives", () => {
    const dataTable = readSource("components", "ui", "data-table.tsx");
    const ctaCluster = readSource("components", "ux-cta-cluster.tsx");
    const statePanel = readSource("components", "ui", "state-panel.tsx");
    const a11yStatus = readSource("components", "ui", "a11y-status.tsx");

    expect(dataTable).toContain('state?: ComponentState | "ready"');
    expect(dataTable).toContain('state !== "ready"');
    expect(dataTable).toContain("rowActionUnavailableLabel");
    expect(dataTable).toContain('data-ux-row-action-state={onRowAction ? "enabled" : "disabled"}');
    expect(dataTable).toContain("No scoped row action for this table state.");

    expect(ctaCluster).toContain('data-ux-primary-cta');
    expect(ctaCluster).toContain('data-ux-secondary-cta');
    expect(ctaCluster).toContain('data-ux-recovery-cta');
    expect(ctaCluster).toContain("This action is held until an authorized lifecycle is wired.");
    expect(ctaCluster).toContain('testId="ux-cta-disabled-reason" visible');

    expect(statePanel).toContain('data-ux-state={state}');
    expect(statePanel).toContain('"audit-unavailable"');
    expect(statePanel).toContain('"export-pending"');
    expect(statePanel).toContain('"redacted"');

    expect(a11yStatus).toContain('data-ux-a11y-keyboard="tab-escape-cancel-return"');
    expect(a11yStatus).toContain('data-ux-a11y-status="polite-live-region"');
    expect(a11yStatus).toContain('role="status"');
  });

  test("guarded action button exposes denied disabled loading success and error lifecycle states", () => {
    const guardedButton = readSource("components", "ui", "guarded-action-button.tsx");
    const guardTypes = readSource("lib", "ui-clickflow-guards.ts");

    expect(guardTypes).toContain('"enabled" | "disabled" | "denied" | "error" | "hidden" | "loading" | "success"');
    expect(guardedButton).toContain("type GuardedActionLifecycleState");
    expect(guardedButton).toContain('data-ux-action-guard-state={effectiveStatus}');
    expect(guardedButton).toContain('data-ux-lifecycle-status={effectiveStatus}');
    expect(guardedButton).toContain('data-ux-requires-audit={requiresAudit ? "true" : "false"}');
    expect(guardedButton).toContain('data-ux-requires-confirmation={requiresConfirmation ? "true" : "false"}');
    expect(guardedButton).toContain('data-ux-requires-permission={requiresPermission ? "true" : "false"}');
    expect(guardedButton).toContain('data-ux-no-overclaim="true"');
    expect(guardedButton).toContain("disabled={disabled}");
    expect(guardedButton).toContain("onClick={disabled ? undefined : onClick}");
    expect(guardedButton).toContain("Action pending. Duplicate execution is blocked.");
    expect(guardedButton).toContain("Downstream gates remain separate unless explicitly stated.");
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
