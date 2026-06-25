import { evaluateTrueUxTechnicalGuard } from "../lib/source-reality-gate";

const result = evaluateTrueUxTechnicalGuard();

if (result.violations.length > 0) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedFiles: result.checkedFiles,
      checkedScripts: result.checkedScripts,
      status: "PASS",
      violations: 0,
    },
    null,
    2,
  ),
);
