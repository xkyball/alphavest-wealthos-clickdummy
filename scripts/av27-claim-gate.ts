import { validateAv27CanonicalClaimGate } from "../lib/av27-phase7-certification";

const result = validateAv27CanonicalClaimGate();

if (result.status !== "PASS") {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      canonicalOwner: result.canonicalOwner,
      decisionCreationServiceGate: {
        currentStatus: result.decisionCreationServiceGate.currentStatus,
        processId: result.decisionCreationServiceGate.processId,
        requiredEvidence: result.decisionCreationServiceGate.requiredEvidence,
        requiredServiceName: result.decisionCreationServiceGate.requiredServiceName,
      },
      partialRows: result.partialRows.map((row) => ({
        processId: row.processId,
        status: row.status,
        statusReason: row.statusReason,
      })),
      status: result.status,
      warnings: result.warnings,
    },
    null,
    2,
  ),
);
