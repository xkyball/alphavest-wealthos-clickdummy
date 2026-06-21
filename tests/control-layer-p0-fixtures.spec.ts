import { expect, test } from "@playwright/test";

import { controlLayerActors } from "./fixtures/control-layer-fixtures";

test.describe("WCL WS-11 P0 fixture matrix", () => {
  test("provides reproducible positive and negative role/scope actors", () => {
    expect(controlLayerActors.bennettCompliance.roleKey).toBe("compliance_officer");
    expect(controlLayerActors.bennettPrincipal.roleKey).toBe("principal");
    expect(controlLayerActors.summitCompliance.roleKey).toBe("compliance_officer");
    expect(controlLayerActors.bennettCompliance.clientTenantId).not.toBe(
      controlLayerActors.summitCompliance.clientTenantId,
    );
  });
});
