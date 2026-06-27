import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  uxComponentStates,
  uxLifecycleAttributesForKind,
  uxLifecycleCloseForOwner,
  uxLifecycleContractForKind,
  uxLifecycleKinds,
  uxStateAttributesForComponentState,
  uxStateContractForComponentState,
} from "../lib/ux-lifecycle-state-contract";

test.describe("E04 canonical lifecycle and overlay contract", () => {
  test("defines the approved lifecycle kinds", () => {
    expect(uxLifecycleKinds).toEqual([
      "base",
      "modal",
      "drawer",
      "confirmation",
      "capture_review",
    ]);
  });

  test("projects modal and drawer runtime attributes from the canonical contract", () => {
    expect(uxLifecycleAttributesForKind("modal", { closeAvailable: true })).toMatchObject({
      "data-ux-a11y-escape": "enabled",
      "data-ux-a11y-focus-return": "parent-context",
      "data-ux-interaction-lifecycle": "modal",
      "data-ux-lifecycle-cancel": "no-submit-no-mutation",
      "data-ux-lifecycle-capture-kind": "modal",
      "data-ux-lifecycle-close": "escape-backdrop-close-button-safe",
      "data-ux-lifecycle-kind": "modal",
      "data-ux-lifecycle-open": "controlled-by-owner-state",
      "data-ux-lifecycle-status": "owner-handles-validation-loading-success-error-blocked",
      "data-ux-lifecycle-submit": "owner-owned-confirmation-only",
      "data-ux-no-overclaim": "true",
      "data-ux-phase10-tasks": "UX-A11Y-001 UX-A11Y-003",
    });

    expect(uxLifecycleAttributesForKind("drawer", { closeAvailable: true })).toMatchObject({
      "data-ux-a11y-escape": "enabled",
      "data-ux-a11y-focus-return": "trigger",
      "data-ux-interaction-lifecycle": "drawer",
      "data-ux-lifecycle-cancel": "no-submit-no-mutation",
      "data-ux-lifecycle-capture-kind": "drawer",
      "data-ux-lifecycle-close": "escape-backdrop-close-button-safe",
      "data-ux-lifecycle-kind": "drawer",
      "data-ux-lifecycle-open": "controlled-by-owner-state",
      "data-ux-lifecycle-status": "owner-handles-validation-loading-success-error-blocked",
      "data-ux-lifecycle-submit": "owner-owned-where-present",
      "data-ux-no-overclaim": "true",
      "data-ux-phase10-tasks": "UX-A11Y-001 UX-A11Y-002",
    });
  });

  test("keeps blocked-close semantics owner-controlled", () => {
    expect(uxLifecycleCloseForOwner("modal", false)).toBe("blocked-while-submitting");
    expect(uxLifecycleCloseForOwner("drawer", false)).toBe("blocked-while-submitting");
    expect(uxLifecycleAttributesForKind("modal", { closeAvailable: false })["data-ux-a11y-escape"]).toBe("blocked-while-submitting");
    expect(uxLifecycleAttributesForKind("drawer", { closeAvailable: false })["data-ux-a11y-escape"]).toBe("blocked");
  });

  test("keeps confirmation separate from generic modal and drawer lifecycle", () => {
    expect(uxLifecycleContractForKind("confirmation")).toMatchObject({
      captureKind: "confirmation",
      kind: "confirmation",
      submit: "owner-owned-explicit-action",
    });
  });

  test("modal and drawer primitives import the canonical lifecycle contract", () => {
    const modalSource = readFileSync("components/ui/modal.tsx", "utf8");
    const drawerSource = readFileSync("components/ui/drawer.tsx", "utf8");

    expect(modalSource).toContain('uxLifecycleAttributesForKind("modal"');
    expect(drawerSource).toContain('uxLifecycleAttributesForKind("drawer"');
    expect(modalSource).not.toContain('data-ux-lifecycle-submit="owner-owned-confirmation-only"');
    expect(drawerSource).not.toContain('data-ux-lifecycle-submit="owner-owned-where-present"');
  });

  test("maps every StatePanel component state to a canonical state family", () => {
    expect(uxComponentStates).toEqual([
      "audit-unavailable",
      "blocked",
      "denied",
      "empty",
      "error",
      "export-failed",
      "export-pending",
      "export-redaction",
      "hidden",
      "hold-blocked",
      "internal-only",
      "loading",
      "p1-deferred",
      "redacted",
      "reference-only",
      "restricted",
      "success",
      "validation",
    ]);

    for (const componentState of uxComponentStates) {
      const contract = uxStateContractForComponentState(componentState);

      expect(contract.componentState).toBe(componentState);
      expect(contract.family).toMatch(/^(loading|empty|error|validation|permission_denied|blocked|restricted|success|hidden|reference|deferred|audit_unavailable|export_pending|export_redaction|export_failed)$/);
      expect(contract.severity).toMatch(/^(neutral|info|success|warning|critical)$/);
      expect(contract.noOverclaimRule.length).toBeGreaterThan(20);
    }
  });

  test("projects StatePanel runtime metadata from the canonical state contract", () => {
    expect(uxStateAttributesForComponentState("success")).toMatchObject({
      "data-ux-state": "success",
      "data-ux-state-capture-kind": "base",
      "data-ux-state-family": "success",
      "data-ux-state-lifecycle-kind": "base",
      "data-ux-state-severity": "success",
    });
    expect(uxStateAttributesForComponentState("denied")).toMatchObject({
      "data-ux-state": "denied",
      "data-ux-state-family": "permission_denied",
      "data-ux-state-severity": "critical",
    });
    expect(uxStateAttributesForComponentState("validation", { lifecycleKind: "confirmation" })).toMatchObject({
      "data-ux-state": "validation",
      "data-ux-state-family": "validation",
      "data-ux-state-lifecycle-kind": "confirmation",
      "data-ux-state-severity": "warning",
    });
  });

  test("StatePanel imports the canonical state contract", () => {
    const statePanelSource = readFileSync("components/ui/state-panel.tsx", "utf8");

    expect(statePanelSource).toContain("uxStateAttributesForComponentState");
    expect(statePanelSource).toContain("type UxComponentState");
    expect(statePanelSource).toContain("{...stateAttributes}");
  });
});
