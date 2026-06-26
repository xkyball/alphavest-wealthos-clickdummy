import {
  defaultCapabilityReportDriftGatePaths,
  validateCapabilityReportDrift,
} from "../lib/capability-report-drift-gate";

const reportPaths = process.argv.slice(2);
const result = validateCapabilityReportDrift(reportPaths.length ? reportPaths : defaultCapabilityReportDriftGatePaths);

if (result.status !== "PASS") {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedReports: result.checkedReports,
      requiredCapabilityStatuses: result.requiredCapabilityStatuses,
      schemaModels: result.schemaModels,
      status: result.status,
    },
    null,
    2,
  ),
);

