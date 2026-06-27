import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  uxLifecycleAttributesForKind,
  uxLifecycleCloseForOwner,
  uxLifecycleContractForKind,
  uxLifecycleKinds,
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
});
