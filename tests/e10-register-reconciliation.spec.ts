import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const root = process.cwd();

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

const registeredActionFiles = [
  "components/admin-tenant-setup-screen.tsx",
  "components/auth-onboarding-screen.tsx",
  "components/client-intake-screen.tsx",
  "components/committee-review-screen.tsx",
  "components/communication-export-ops-screen.tsx",
  "components/decisions-governance-screen.tsx",
  "components/internal-workflow-screen.tsx",
  "components/kyc-aml-workflow-screen.tsx",
  "components/review-monitoring-screen.tsx",
  "components/suitability-ips-screen.tsx",
  "components/wealth-actions-screen.tsx",
];

const firstSliceActionFiles = [
  "components/admin-tenant-setup-screen.tsx",
  "components/client-intake-screen.tsx",
  "components/communication-export-ops-screen.tsx",
  "components/decisions-governance-screen.tsx",
  "components/internal-workflow-screen.tsx",
];

const registeredFilterExceptionIds = ["DSF-001", "DSF-002", "DSF-003", "DSF-004", "DSF-007", "DSF-008"];

test.describe("E10 register reconciliation gates", () => {
  test("keeps the approved E10 registers and hard spec in the repo", () => {
    for (const relativePath of [
      "docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md",
      "docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md",
      "docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md",
      "docs/ux/ALPHAVEST_E10_REGISTER_RECONCILIATION_SPEC.md",
    ]) {
      const source = read(relativePath);
      expect(source).toContain("APPROVE_E10_HARD_RETIRE_AND_MIGRATE_REGISTERS");
    }
  });

  test("blocks unregistered local action-class vocabularies and requires first-slice canonical projection", () => {
    const componentFiles = [
      "components/admin-tenant-setup-screen.tsx",
      "components/auth-onboarding-screen.tsx",
      "components/client-intake-screen.tsx",
      "components/committee-review-screen.tsx",
      "components/communication-export-ops-screen.tsx",
      "components/decisions-governance-screen.tsx",
      "components/internal-workflow-screen.tsx",
      "components/kyc-aml-workflow-screen.tsx",
      "components/review-monitoring-screen.tsx",
      "components/suitability-ips-screen.tsx",
      "components/wealth-actions-screen.tsx",
    ];

    for (const file of componentFiles) {
      const source = read(file);
      const hasLocalActionAlias = /const\s+(primaryButtonClass|secondaryButtonClass|staticButtonClass|destructiveButtonClass)\s*=/.test(source);
      if (hasLocalActionAlias) {
        expect(registeredActionFiles, `${file} must be registered before local action aliases may remain`).toContain(file);
      }
    }

    for (const file of firstSliceActionFiles) {
      const source = read(file);
      expect(source, `${file} first-slice action classes must project from E05 contract`).toContain("uxActionClassForPriority");
    }
  });

  test("keeps first-slice disabled filter exceptions explicit and registered", () => {
    const touchedFiles = [
      "components/admin-tenant-setup-screen.tsx",
      "components/client-intake-screen.tsx",
      "components/communication-export-ops-screen.tsx",
      "components/decisions-governance-screen.tsx",
      "components/wealth-actions-screen.tsx",
    ];

    const joinedSource = touchedFiles.map(read).join("\n");
    const ids = Array.from(joinedSource.matchAll(/data-ux-e10-filter-exception-id="([^"]+)"/g)).map((match) => match[1]);

    expect(new Set(ids)).toEqual(new Set(registeredFilterExceptionIds));
    for (const id of registeredFilterExceptionIds) {
      expect(joinedSource, `${id} must carry disabled-static metadata`).toContain(`data-ux-e10-filter-exception-id="${id}"`);
    }
    expect(joinedSource).toContain('data-ux-data-surface-filter-state="disabled_static"');
  });

  test("retires active ProductGuidance proof UI paths from implementation code", () => {
    expect(existsSync(path.join(root, "components/product-guidance-panel.tsx"))).toBe(false);
    expect(existsSync(path.join(root, "lib/product-guidance.ts"))).toBe(false);
    expect(read("components/route-context-chip.tsx")).toContain("@/lib/operational-route-guidance");
    expect(read("tests/route-smoke.spec.ts")).toContain("../lib/operational-route-guidance");
  });
});
