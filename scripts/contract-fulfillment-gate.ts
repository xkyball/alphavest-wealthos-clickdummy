import {
  evaluateContractFulfillmentGate,
  writeContractFulfillmentGateReport,
} from "../lib/contract-fulfillment-gate";

const report = evaluateContractFulfillmentGate();
writeContractFulfillmentGateReport(report);

const output = {
  status: report.status,
  totalEntries: report.totalEntries,
  violations: report.violations,
};

if (report.status === "fail") {
  console.error(JSON.stringify(output, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(output, null, 2));
