import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { expect, test } from "@playwright/test";

const visiblePropNames = new Set([
  "actionLabel",
  "actionState",
  "activeTask",
  "blocker",
  "context",
  "decisionSupport",
  "description",
  "detail",
  "emptyMessage",
  "eyebrow",
  "gateLabel",
  "label",
  "missing",
  "objectLabel",
  "objectState",
  "pageJob",
  "placeholder",
  "primaryAction",
  "queueLabel",
  "safetyBoundary",
  "safetyNote",
  "selectedSummary",
  "sourceSummaries",
  "stateTitle",
  "statusStrip",
  "subtitle",
  "summary",
  "title",
  "value",
]);

const forbiddenVisibleUiText =
  /\bprocess\b|\bworkflow(s)?\b|\bproof\b|\bpayload(s)?\b|\bgate(s)?\b|\bscope(d)?\b|Process Runtime|Workflow Badges|Workflow state|Workflow stream|workflow proof|proof boundary|Proof boundary|Proof source|Decision gate|Advice Visibility Gate|Activation Gate|Review Gate|Export gate|Payload visibility|Forbidden payloads|Client payload|advisory payload|Cross-tenant payload|Release workflow scoped|policy-checked|scoped invitation|scoped access|Scoped access|Scoped Entities|Upload scoped evidence|Run scoped sufficiency|blocked state|Activation blocked|Client visibility blocked|Upload blocked|Keep Blocked|Status: Blocked/i;

type VisibleCandidate = {
  file: string;
  kind: string;
  line: number;
  text: string;
};

function compactText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function sourceLine(source: ts.SourceFile, position: number) {
  return source.getLineAndCharacterOfPosition(position).line + 1;
}

function hasJsxAttributeAncestor(node: ts.Node): boolean {
  let current: ts.Node | undefined = node.parent;

  while (current) {
    if (ts.isJsxAttribute(current)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function collectVisibleCandidates(file: string): VisibleCandidate[] {
  const sourceText = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const candidates: VisibleCandidate[] = [];

  function record(kind: string, node: ts.Node, text: string) {
    const compact = compactText(text);

    if (compact && forbiddenVisibleUiText.test(compact)) {
      candidates.push({ file, kind, line: sourceLine(source, node.pos), text: compact });
    }
  }

  function recordStringLiterals(kind: string, node: ts.Node): void {
    if (hasJsxAttributeAncestor(node)) {
      return;
    }

    if (ts.isStringLiteralLike(node)) {
      record(kind, node, node.text);
    }

    if (ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      record(kind, node, node.getText(source));
    }

    ts.forEachChild(node, (child) => recordStringLiterals(kind, child));
  }

  function visit(node: ts.Node): void {
    if (ts.isJsxText(node)) {
      record("jsx-text", node, node.getText(source));
    }

    if (ts.isJsxExpression(node) && node.expression && !hasJsxAttributeAncestor(node)) {
      recordStringLiterals("jsx-expression", node.expression);
    }

    if (ts.isJsxAttribute(node) && visiblePropNames.has(node.name.getText(source)) && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) {
        record(`prop:${node.name.getText(source)}`, node, node.initializer.text);
      }

      if (
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression
      ) {
        recordStringLiterals(`prop:${node.name.getText(source)}`, node.initializer.expression);
      }
    }

    if (ts.isPropertyAssignment(node)) {
      const propertyName =
        ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : undefined;

      if (propertyName && visiblePropNames.has(propertyName) && ts.isStringLiteralLike(node.initializer)) {
        record(`object:${propertyName}`, node.initializer, node.initializer.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);

  return candidates;
}

test("visible UI source does not contain internal process scaffolding language", () => {
  const files = [
    ...execSync("rg --files app components | rg '\\.(tsx)$'", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean),
    "lib/admin-tenant-readmodel-service.ts",
    "lib/communication-export-ops-demo-data.ts",
    "lib/domain-types.ts",
    "lib/operational-route-guidance.ts",
    "lib/screen-trust-flow.ts",
    "lib/ux-hub.ts",
    "lib/ux-route-policy.ts",
  ];
  const failures = files.flatMap(collectVisibleCandidates);

  expect(
    failures.map((failure) => `${failure.file}:${failure.line} ${failure.kind}: ${failure.text}`),
  ).toEqual([]);
});
