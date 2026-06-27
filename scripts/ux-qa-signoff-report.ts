import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

type SignoffItem = {
  acceptanceSignal: string;
  evidence: string[];
  epic: string;
  question: string;
};

type SignoffReport = {
  generatedAt: string;
  items: SignoffItem[];
  outputPath: string;
  status: "ready-for-human-signoff";
};

const root = process.cwd();
const outputPath = process.env.UX_QA_SIGNOFF_OUTPUT ?? path.join(root, "docs", "v3", "proof", "e09_capture_qa_signoff_checklist.md");

const signoffItems: SignoffItem[] = [
  {
    acceptanceSignal: "Shared UX contracts are present and tests cover operating mode/design-system projection.",
    epic: "E01",
    evidence: [
      "docs/ux/ALPHAVEST_E01_UX_OPERATING_MODEL_SPEC.md",
      "docs/ux/ALPHAVEST_E01_DESIGN_SYSTEM_FOUNDATION_SPEC.md",
      "tests/ux-operating-model.spec.ts",
      "tests/ux-design-system-foundation.spec.ts",
    ],
    question: "Does the screen use the canonical operating/design-system model instead of local one-off semantics?",
  },
  {
    acceptanceSignal: "Page template family, density band and section structure are declared through shared primitives.",
    epic: "E02",
    evidence: [
      "docs/ux/ALPHAVEST_E02_PAGE_TEMPLATE_SYSTEM_SPEC.md",
      "tests/ux-page-template-system.spec.ts",
      "tests/ux-page-template-adoption.spec.ts",
    ],
    question: "Does the page avoid monster-screen composition and use the approved template discipline?",
  },
  {
    acceptanceSignal: "Proof/debug/reviewer metadata is absent from default operational/client UI and present only in reviewer/capture artifacts.",
    epic: "E03",
    evidence: [
      "docs/ux/ALPHAVEST_E03_OPERATIONAL_PROOF_SEPARATION_SPEC.md",
      "tests/ux-proof-reviewer-mode.spec.ts",
      "tests/product-guidance-shell.spec.ts",
    ],
    question: "Can a user complete the task without route IDs, proof tags or capture/debug language leaking into the workflow?",
  },
  {
    acceptanceSignal: "Base, modal, drawer and confirmation states expose canonical lifecycle/capture metadata.",
    epic: "E04",
    evidence: [
      "docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md",
      "tests/ux-lifecycle-state-contract.spec.ts",
      "tests/capture-routes-and-modals-contract.spec.ts",
    ],
    question: "Are base and overlay states mechanically distinguishable in UI attributes and capture metadata?",
  },
  {
    acceptanceSignal: "Actions have clear hierarchy, guarded states and no-overclaim feedback.",
    epic: "E05",
    evidence: [
      "docs/ux/ALPHAVEST_E05_ACTION_HIERARCHY_SPEC.md",
      "docs/ux/ALPHAVEST_E05_ACTION_FEEDBACK_IMPLEMENTATION_SPEC.md",
      "tests/ux-action-hierarchy-contract.spec.ts",
      "tests/true-ux-cta-state.spec.ts",
    ],
    question: "Are primary/destructive/blocked/recovery actions explicit and truthfully reflected in feedback?",
  },
  {
    acceptanceSignal: "Data surfaces expose filters, sorting, sticky context and master-detail behavior through shared contracts.",
    epic: "E06",
    evidence: [
      "docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md",
      "docs/ux/ALPHAVEST_E06_FEEDBACK_MESSAGING_SPEC.md",
      "tests/ux-data-surface-contract.spec.ts",
      "tests/ux-filter-sticky-surface.spec.ts",
    ],
    question: "Can a reviewer distinguish real filter/sort/master-detail behavior from decorative controls?",
  },
  {
    acceptanceSignal: "Client-safe surfaces fail closed and do not leak internal rationale, drafts or unreleased evidence.",
    epic: "E07",
    evidence: [
      "docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_SPEC.md",
      "tests/ux-client-safe-ui-boundary.spec.ts",
      "tests/true-ux-client-projection.spec.ts",
    ],
    question: "Does client-visible output prove release/redaction boundaries instead of relying on copy promises?",
  },
  {
    acceptanceSignal: "Density, focus, selected/active states and semantic status hierarchy are visible and test-covered.",
    epic: "E08",
    evidence: [
      "docs/ux/ALPHAVEST_E08_VISUAL_DENSITY_ACCESSIBILITY_SPEC.md",
      "tests/true-ux-a11y.spec.ts",
      "tests/true-ux-density.spec.ts",
    ],
    question: "Can the screen be scanned, focused and status-reviewed without color-only meaning or cramped text?",
  },
];

function evidenceStatus(filePath: string) {
  return existsSync(path.join(root, filePath)) ? "present" : "missing";
}

function markdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function reportMarkdown(report: SignoffReport) {
  return [
    "# E09 Capture QA Sign-Off Checklist",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    "",
    "This checklist is a repeatable human sign-off companion for capture QA. It does not replace product/design approval and it does not authorize new scope.",
    "",
    "| Epic | Sign-off question | Acceptance signal | Evidence |",
    "| --- | --- | --- | --- |",
    ...report.items.map((item) => {
      const evidence = item.evidence.map((filePath) => `${filePath} (${evidenceStatus(filePath)})`).join("<br>");
      return `| ${item.epic} | ${markdownCell(item.question)} | ${markdownCell(item.acceptanceSignal)} | ${markdownCell(evidence)} |`;
    }),
    "",
    "## Capture QA Gate",
    "",
    "- Run `pnpm visual:capture-qa` or `tsx scripts/capture-qa-contract.ts` against the relevant artifact root before release-style visual review.",
    "- Run `pnpm visual:capture-qa:release` for new release-candidate capture folders; it sets `CAPTURE_QA_FAIL_ON_WARNINGS=1` and treats warnings as blockers.",
    "- Treat legacy capture bundles as historical evidence only. Do not metadata-patch them merely to hide E09 warnings.",
    "- Treat duplicate-state clusters and long-screen risks as review blockers until a human explicitly accepts them or opens cleanup tickets.",
    "- Keep proof/reviewer metadata in reports and reviewer surfaces, not default operational UI.",
  ].join("\n");
}

export function writeUxQaSignoffReport(targetPath = outputPath): SignoffReport {
  const report: SignoffReport = {
    generatedAt: new Date().toISOString(),
    items: signoffItems,
    outputPath: path.relative(root, targetPath),
    status: "ready-for-human-signoff",
  };

  mkdirSync(path.dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, `${reportMarkdown(report)}\n`);

  return report;
}

function main() {
  const report = writeUxQaSignoffReport(outputPath);
  console.log(JSON.stringify({
    items: report.items.length,
    outputPath: report.outputPath,
    status: report.status,
  }, null, 2));
}

if (require.main === module) {
  main();
}
