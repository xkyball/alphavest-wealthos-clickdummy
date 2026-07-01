import { expect, test } from "@playwright/test";

import {
  buildOperationalStage1CertificationSummary,
  operationalStage1TicketCertifications,
  operationalStage1TicketOrder,
} from "../lib/platform-foundation-certification";

test.describe("Operational Stage 1 BOC/CTES safety foundation certification", () => {
  test("keeps every implementation ticket ordered, described and proof-backed", () => {
    const summary = buildOperationalStage1CertificationSummary();

    expect(summary.status).toBe("PASS");
    expect(summary.ordered).toBe(true);
    expect(summary.ticketIds).toEqual(operationalStage1TicketOrder);
    expect(summary.missingTicketIds).toEqual([]);
    expect(summary.duplicateTicketIds).toEqual([]);
    expect(summary.implementedTicketCount).toBe(12);

    for (const ticket of operationalStage1TicketCertifications) {
      expect(ticket.description.length, `${ticket.id} description`).toBeGreaterThan(20);
      expect(ticket.acceptance.positive.length, `${ticket.id} positive acceptance`).toBeGreaterThan(20);
      expect(ticket.acceptance.negative.length, `${ticket.id} negative acceptance`).toBeGreaterThan(20);
      expect(ticket.coveredProcesses.length, `${ticket.id} covered processes`).toBeGreaterThan(0);
      expect(ticket.proofFiles.length, `${ticket.id} proof files`).toBeGreaterThan(0);
    }
  });

  test("does not let boundary proof masquerade as direct implementation proof", () => {
    const summary = buildOperationalStage1CertificationSummary();

    expect(summary.boundaryProofTickets).toEqual([
      "Operational-1-T02",
      "Operational-1-T04",
      "Operational-1-T07",
      "Operational-1-T08",
      "Operational-1-T10",
    ]);
    expect(
      operationalStage1TicketCertifications.filter((ticket) => ticket.status === "IMPLEMENTED_WITH_DIRECT_PROOF").map((ticket) => ticket.id),
    ).toEqual([
      "Operational-1-T01",
      "Operational-1-T03",
      "Operational-1-T05",
      "Operational-1-T06",
      "Operational-1-T09",
      "Operational-1-T11",
      "Operational-1-T12",
    ]);
  });
});
