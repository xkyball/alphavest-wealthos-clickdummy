import { expect, test } from "@playwright/test";

import {
  buildP44Phase1CertificationSummary,
  p44Phase1TicketCertifications,
  p44Phase1TicketOrder,
} from "../lib/p44-phase1-certification";

test.describe("P44 Phase 1 BOC/CTES safety foundation certification", () => {
  test("keeps every implementation ticket ordered, described and proof-backed", () => {
    const summary = buildP44Phase1CertificationSummary();

    expect(summary.status).toBe("PASS");
    expect(summary.ordered).toBe(true);
    expect(summary.ticketIds).toEqual(p44Phase1TicketOrder);
    expect(summary.missingTicketIds).toEqual([]);
    expect(summary.duplicateTicketIds).toEqual([]);
    expect(summary.implementedTicketCount).toBe(12);

    for (const ticket of p44Phase1TicketCertifications) {
      expect(ticket.description.length, `${ticket.id} description`).toBeGreaterThan(20);
      expect(ticket.acceptance.positive.length, `${ticket.id} positive acceptance`).toBeGreaterThan(20);
      expect(ticket.acceptance.negative.length, `${ticket.id} negative acceptance`).toBeGreaterThan(20);
      expect(ticket.coveredProcesses.length, `${ticket.id} covered processes`).toBeGreaterThan(0);
      expect(ticket.proofFiles.length, `${ticket.id} proof files`).toBeGreaterThan(0);
    }
  });

  test("does not let boundary proof masquerade as direct implementation proof", () => {
    const summary = buildP44Phase1CertificationSummary();

    expect(summary.boundaryProofTickets).toEqual([
      "P44-1-T02",
      "P44-1-T04",
      "P44-1-T07",
      "P44-1-T08",
      "P44-1-T10",
    ]);
    expect(
      p44Phase1TicketCertifications.filter((ticket) => ticket.status === "IMPLEMENTED_WITH_DIRECT_PROOF").map((ticket) => ticket.id),
    ).toEqual([
      "P44-1-T01",
      "P44-1-T03",
      "P44-1-T05",
      "P44-1-T06",
      "P44-1-T09",
      "P44-1-T11",
      "P44-1-T12",
    ]);
  });
});
