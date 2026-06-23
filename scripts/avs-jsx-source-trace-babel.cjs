/* eslint-disable @typescript-eslint/no-require-imports */

const path = require("node:path");

function isEnabled() {
  return process.env.AVS_SOURCE_TRACE === "1" || process.env.AVS_CAPTURE_SOURCE_TRACE === "1";
}

function repoRelative(filename) {
  if (!filename) return null;
  const cwd = process.cwd();
  const relative = path.relative(cwd, filename);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return filename;
  return relative;
}

function jsxNameToString(node) {
  if (!node) return "unknown";
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXMemberExpression") return `${jsxNameToString(node.object)}.${jsxNameToString(node.property)}`;
  if (node.type === "JSXNamespacedName") return `${jsxNameToString(node.namespace)}:${jsxNameToString(node.name)}`;
  return "unknown";
}

function expressionName(node) {
  if (!node) return "anonymous";
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const property = node.property;
    if (property?.type === "Identifier") return property.name;
    if (property?.type === "StringLiteral") return property.value;
    return "memberExpression";
  }
  if (node.type === "CallExpression" || node.type === "OptionalCallExpression") return expressionName(node.callee);
  if (node.type === "ArrowFunctionExpression") return "inlineArrowFunction";
  if (node.type === "FunctionExpression") return node.id?.name ?? "inlineFunction";
  return node.type || "anonymous";
}

function nearestOwnerSymbol(pathRef) {
  const candidates = [
    pathRef.findParent((parent) => parent.isFunctionDeclaration()),
    pathRef.findParent((parent) => parent.isFunctionExpression() || parent.isArrowFunctionExpression()),
    pathRef.findParent((parent) => parent.isClassDeclaration() || parent.isClassExpression()),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const node = candidate.node;
    if (node.id?.name) return node.id.name;
    const parent = candidate.parentPath;
    if (parent?.isVariableDeclarator() && parent.node.id?.type === "Identifier") return parent.node.id.name;
    if (parent?.isObjectProperty() && parent.node.key?.type === "Identifier") return parent.node.key.name;
    if (parent?.isAssignmentExpression() && parent.node.left?.type === "Identifier") return parent.node.left.name;
  }

  return "unknown";
}

function hasAttribute(openingElement, attrName) {
  return openingElement.attributes.some((attribute) => attribute.type === "JSXAttribute" && attribute.name?.name === attrName);
}

module.exports = function avsJsxSourceTraceBabelPlugin({ types: t }) {
  if (!isEnabled()) {
    return { name: "avs-jsx-source-trace-disabled", visitor: {} };
  }

  return {
    name: "avs-jsx-source-trace",
    visitor: {
      JSXOpeningElement(pathRef, state) {
        const filename = repoRelative(state.file.opts.filename);
        if (!filename) return;
        if (filename.includes("node_modules") || filename.includes(".next")) return;

        const location = pathRef.node.loc?.start;
        if (!location) return;

        const line = location.line;
        const column = location.column;
        const ownerSymbol = nearestOwnerSymbol(pathRef);
        const jsxName = jsxNameToString(pathRef.node.name);
        if (/^[A-Z]/.test(jsxName)) return;
        const sourceId = `${filename}:${line}:${column}:${ownerSymbol}`;

        const addStringAttribute = (name, value) => {
          if (hasAttribute(pathRef.node, name)) return;
          pathRef.node.attributes.push(t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(String(value))));
        };

        addStringAttribute("data-avs-source-id", sourceId);
        addStringAttribute("data-avs-source-file", filename);
        addStringAttribute("data-avs-source-line", line);
        addStringAttribute("data-avs-source-column", column);
        addStringAttribute("data-avs-source-symbol", ownerSymbol);
        addStringAttribute("data-avs-source-kind", "jsx-compile-time");
        addStringAttribute("data-avs-jsx-name", jsxName);

        const handlerIds = pathRef.node.attributes
          .filter((attribute) => attribute.type === "JSXAttribute" && /^on[A-Z]/.test(String(attribute.name?.name ?? "")))
          .map((attribute) => {
            const eventProp = String(attribute.name.name);
            const expression =
              attribute.value?.type === "JSXExpressionContainer" ? attribute.value.expression : attribute.value;
            const handlerName = expressionName(expression);
            const handlerLocation = expression?.loc?.start ?? attribute.loc?.start ?? location;
            return `${filename}:${handlerLocation.line}:${handlerLocation.column}:${handlerName}:${eventProp}`;
          });

        if (handlerIds.length && !hasAttribute(pathRef.node, "data-avs-handler-ids")) {
          pathRef.node.attributes.push(t.jsxAttribute(t.jsxIdentifier("data-avs-handler-ids"), t.stringLiteral(handlerIds.join("|"))));
        }
      },
    },
  };
};
