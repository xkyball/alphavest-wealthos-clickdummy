import { expect, test } from "@playwright/test";

import {
  clientVisibilityStage6AllowedClientPayloadFields,
  clientVisibilityStage6ForbiddenPayloadFields,
} from "../lib/client-visibility-payload-contract";
import {
  classifyPp001PayloadField,
  inspectPp001ClientPayload,
  pp001ForbiddenClientPayloadFields,
  pp001PayloadVisibilityMatrix,
} from "../lib/pp001-payload-visibility-contract";

test.describe("PP-001 payload visibility contract", () => {
  test("binds existing allowed and forbidden payload fields into one PP-001 matrix", () => {
    expect(pp001PayloadVisibilityMatrix.clientSafeReleasedOnlyFields).toEqual(
      [...clientVisibilityStage6AllowedClientPayloadFields].sort(),
    );

    for (const field of clientVisibilityStage6AllowedClientPayloadFields) {
      expect(classifyPp001PayloadField(field)).toBe("client_safe_released_only");
    }

    for (const field of clientVisibilityStage6ForbiddenPayloadFields) {
      expect(pp001ForbiddenClientPayloadFields()).toContain(field);
      expect(classifyPp001PayloadField(field)).not.toBe("client_safe_released_only");
    }

    expect(pp001PayloadVisibilityMatrix.internalOnlyFields).toEqual(
      expect.arrayContaining(["aiDraft", "clientSummaryDraft", "complianceNotes", "internalRationale"]),
    );
    expect(pp001PayloadVisibilityMatrix.hiddenFields).toEqual(
      expect.arrayContaining(["checksum", "manualOverride", "mimeType", "storageKey", "visibilityOverride"]),
    );
    expect(pp001PayloadVisibilityMatrix.redactedFields).toEqual(
      expect.arrayContaining(["auditActor", "auditEventId", "auditMetadata", "auditReason"]),
    );
  });

  test("flags forbidden client payload fields through the PP-001 matrix", () => {
    const inspection = inspectPp001ClientPayload({
      clientSummary: "Released summary.",
      complianceNotes: "Internal compliance note.",
      storageKey: "demo/bennett/source.pdf",
    });

    expect(inspection.clean).toBe(false);
    expect(inspection.forbiddenFields).toEqual(["complianceNotes", "storageKey"]);
    expect(inspection.fieldClasses).toMatchObject({
      clientSummary: "client_safe_released_only",
      complianceNotes: "internal_only",
      storageKey: "hidden",
    });
  });
});
