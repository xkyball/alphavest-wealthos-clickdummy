import type { HighRiskCommitteeCandidate } from "@/lib/workflow-gate";

export const committeeReviewPageIds = ["070", "071"] as const;

export type CommitteeReviewPageId = (typeof committeeReviewPageIds)[number];

export function isCommitteeReviewPageId(pageId: string): pageId is CommitteeReviewPageId {
  return committeeReviewPageIds.includes(pageId as CommitteeReviewPageId);
}

export type CommitteeReviewRow = {
  id: string;
  client: string;
  structure: string;
  recommendation: string;
  advisor: string;
  risk: "High" | "Critical";
  advisorApproval: "Approved" | "Pending";
  committeeStatus: "Pending" | "In Review" | "Dissent" | "Approved" | "Blocked";
  votes: string;
  dissent: string;
  evidence: string;
  due: string;
  clientVisible: false;
};

export const committeeReviewRows: CommitteeReviewRow[] = [
  {
    id: "COM-2025-0147",
    client: "James Thornton",
    structure: "Thornton Family Office",
    recommendation: "IPS Review - Strategic Planning",
    advisor: "Sarah Reynolds",
    risk: "High",
    advisorApproval: "Approved",
    committeeStatus: "Pending",
    votes: "0/3",
    dissent: "Not reviewed",
    evidence: "4/5 linked",
    due: "May 17, 2025",
    clientVisible: false,
  },
  {
    id: "COM-2025-0148",
    client: "Michael Wong",
    structure: "Wong Investments Pty Ltd",
    recommendation: "Direct Investment - Concentrated exposure",
    advisor: "Daniel Carter",
    risk: "Critical",
    advisorApproval: "Approved",
    committeeStatus: "Dissent",
    votes: "2/3",
    dissent: "Open",
    evidence: "3/5 linked",
    due: "May 15, 2025",
    clientVisible: false,
  },
  {
    id: "COM-2025-0149",
    client: "Emma Clarke",
    structure: "Clarke Super Fund",
    recommendation: "Asset Allocation - Illiquid sleeve increase",
    advisor: "Priya Nair",
    risk: "High",
    advisorApproval: "Pending",
    committeeStatus: "Blocked",
    votes: "0/3",
    dissent: "Gate",
    evidence: "2/5 linked",
    due: "May 19, 2025",
    clientVisible: false,
  },
  {
    id: "COM-2025-0150",
    client: "Sophie Patel",
    structure: "Patel Family Trust",
    recommendation: "Rebalance - Tax-sensitive drawdown",
    advisor: "Sarah Reynolds",
    risk: "High",
    advisorApproval: "Approved",
    committeeStatus: "In Review",
    votes: "1/3",
    dissent: "None yet",
    evidence: "5/5 linked",
    due: "May 18, 2025",
    clientVisible: false,
  },
];

export const selectedCommitteeReview = {
  id: "COM-2025-0147",
  recommendationId: "REC-2025-05-0147",
  client: "James Thornton",
  structure: "Thornton Family Office",
  risk: "High",
  advisor: "Sarah Reynolds",
  analyst: "Aisha Khan",
  committeeChair: "Nadia Hoffmann",
  status: "Pending committee review",
  advisorApproval: "Approved May 16, 2025 09:31",
  due: "May 17, 2025 16:00",
  objective:
    "Confirm that the high-risk IPS recommendation has independent peer review before compliance release can consider client visibility.",
  recommendation:
    "Moderate-growth IPS update with tax-loss harvesting, donor-advised legacy structures and enhanced liquidity controls for multi-generational governance.",
  riskDrivers: ["Cross-border estate exposure", "Concentrated legacy holdings", "Incomplete estate-planning evidence", "Family-council approval sensitivity"],
  evidence: [
    { label: "Advisor approval record", status: "Linked" },
    { label: "IPS suitability memo", status: "Linked" },
    { label: "Tax projection evidence", status: "Linked" },
    { label: "Estate plan overview", status: "Partial" },
    { label: "Committee vote record", status: "Pending" },
  ],
  votes: [
    { reviewer: "Nadia Hoffmann", role: "Committee chair", vote: "Pending", note: "Reviewing estate-plan evidence gap." },
    { reviewer: "Lukas Meyer", role: "Portfolio peer", vote: "Pending", note: "Awaiting liquidity stress view." },
    { reviewer: "Amara Okafor", role: "Compliance liaison", vote: "Pending", note: "No compliance release before vote package is complete." },
  ],
  dissentItems: [
    { title: "Estate-plan evidence is partial", owner: "Aisha Khan", status: "Open" },
    { title: "Liquidity downside note requested", owner: "Lukas Meyer", status: "Open" },
  ],
  timeline: [
    { actor: "Sarah Reynolds", id: "advisor-approved", timestamp: "May 16, 2025 09:31", title: "Advisor approval completed", result: "SUCCESS" as const },
    { actor: "Workflow gate", id: "committee-routed", timestamp: "May 16, 2025 09:32", title: "High-risk package routed to committee", result: "PENDING" as const },
    { actor: "Committee chair", id: "committee-opened", timestamp: "May 16, 2025 10:04", title: "Peer review opened", result: "PENDING" as const },
  ],
};

export const advisorOnlyCommitteeCandidate: HighRiskCommitteeCandidate = {
  advisorApprovalStatus: "APPROVED",
  committeeRequired: true,
  committeeStatus: "PENDING",
  dissentResolved: false,
  evidenceStatus: "CREATED",
  permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  riskLevel: "HIGH",
};

export const committeeApprovedCandidate: HighRiskCommitteeCandidate = {
  advisorApprovalStatus: "APPROVED",
  committeeRequired: true,
  committeeStatus: "APPROVED",
  dissentResolved: true,
  evidenceStatus: "VALIDATED",
  permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  riskLevel: "HIGH",
};
