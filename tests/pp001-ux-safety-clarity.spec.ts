import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

import { noOverclaimCopy, noOverclaimForbiddenSuccessPattern } from "../lib/no-overclaim-copy";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("PP-001 UX safety clarity", () => {
  test("shell and session context expose tenant, role and client-visibility scope without overclaim", () => {
    const topBar = readSource("components", "top-bar.tsx");
    const demoSessionPanel = readSource("components", "demo-session-panel.tsx");

    expect(topBar).toContain("Tenant context");
    expect(topBar).toContain("Role context");
    expect(topBar).toContain("Search scoped by tenant + role");
    expect(topBar).toContain("Internal until released");
    expect(topBar).toContain("Client-safe actor");
    expect(topBar).toContain("Internal actor");

    expect(demoSessionPanel).toContain("Session context");
    expect(demoSessionPanel).toContain("Access state");
    expect(demoSessionPanel).toContain("Visibility gate");
    expect(demoSessionPanel).toContain("No unapproved advice reaches the client");
    expect(demoSessionPanel).toContain("Client-safe available");
    expect(demoSessionPanel).toContain("Client-safe blocked");
  });

  test("shared feedback states distinguish denied, hidden, internal-only and redacted payloads", () => {
    const dataTable = readSource("components", "ui", "data-table.tsx");
    const statePanel = readSource("components", "ui", "state-panel.tsx");

    expect(dataTable).toContain('denied: { title: "Permission denied"');
    expect(dataTable).toContain("The current actor cannot view this table or perform this action.");
    expect(dataTable).toContain('hidden: { title: "Hidden"');
    expect(dataTable).toContain("Payload is hidden until route, role and visibility gates allow it.");
    expect(dataTable).toContain('"internal-only": { title: "Internal only"');
    expect(dataTable).toContain("does not create client visibility");
    expect(dataTable).toContain('redacted: { title: "Redacted"');
    expect(dataTable).toContain("Sensitive fields are redacted for this actor and workflow state.");

    for (const state of ["denied", "hidden", "internal-only", "redacted"] as const) {
      const stateMetaKey = state.includes("-") ? `"${state}": {` : `${state}: {`;
      expect(statePanel).toContain(`| "${state}"`);
      expect(statePanel).toContain(stateMetaKey);
    }
  });

  test("canonical no-overclaim copy keeps release, approval, export and client acceptance separate", () => {
    expect(noOverclaimCopy.advisorApprovalNotRelease).toContain("Advisor approval alone is not enough");
    expect(noOverclaimCopy.complianceReleaseNotClientAcceptance).toContain("client acceptance remain separate");
    expect(noOverclaimCopy.clientVisibilityHidden).toContain("No released client-safe content");
    expect(noOverclaimCopy.adminNonBypassDenied).toContain("cannot bypass release");
    expect(noOverclaimCopy.noDownstreamCompletion).toContain("gates remain unresolved");

    for (const copy of Object.values(noOverclaimCopy)) {
      expect(copy).not.toMatch(noOverclaimForbiddenSuccessPattern);
    }
  });
});
