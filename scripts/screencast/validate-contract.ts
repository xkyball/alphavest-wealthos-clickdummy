import { validateProcessUniverseCaptureModel } from "@/lib/process-universe-capture-model";

import { loadScreencastContract, validateScreencastContract } from "./lib/contract";

const contract = loadScreencastContract();
const contractValidation = validateScreencastContract(contract);
const modelValidation = validateProcessUniverseCaptureModel(contract.model);

const result = {
  contract: contractValidation,
  manifest: {
    id: contract.manifest.manifestId,
    journeyCount: contract.manifest.journeys.length,
    statuses: contract.manifest.journeys.reduce<Record<string, number>>((counts, journey) => {
      counts[journey.status] = (counts[journey.status] ?? 0) + 1;
      return counts;
    }, {}),
  },
  processUniverse: {
    errors: modelValidation.errors,
    ok: modelValidation.ok,
    retainedP0ProcessCount: contract.model.processUniverseSummary.retainedP0ProcessCount,
    retainedP0StepCount: contract.model.processUniverseSummary.retainedP0StepCount,
    warnings: modelValidation.warnings,
  },
};

console.log(JSON.stringify(result, null, 2));

if (!contractValidation.ok || !modelValidation.ok) {
  process.exitCode = 1;
}
