export const stage06MetricCards = [
  {
    label: "Component primitives",
    value: "13",
    detail: "Shared UI building blocks ready for page stages.",
    status: "COMPLETED" as const,
    delta: "+13 this stage"
  },
  {
    label: "Seeded states",
    value: "5",
    detail: "Loading, empty, error, blocked and restricted states.",
    status: "ACTIVE" as const,
    delta: "Reusable variants"
  },
  {
    label: "Route coverage",
    value: "63",
    detail: "All registered routes can consume the same library.",
    status: "PROCESSING" as const,
    delta: "Skeleton-ready"
  }
];

export const stage06TableRows = [
  {
    id: "release-check",
    item: "Release package status",
    owner: "Compliance",
    status: "APPROVED" as const,
    updated: "Today"
  },
  {
    id: "evidence-pack",
    item: "Evidence package",
    owner: "Analyst",
    status: "REVIEW" as const,
    updated: "1 hour ago"
  },
  {
    id: "client-export",
    item: "Client export",
    owner: "Advisor",
    status: "BLOCKED" as const,
    updated: "Pending release"
  }
];

export const stage06KanbanColumns = [
  {
    id: "review",
    title: "To Review",
    items: [
      {
        id: "risk-review",
        title: "Investment policy review",
        meta: "Bennett Family Office",
        priority: "High",
        status: "REVIEW" as const
      },
      {
        id: "trust-gap",
        title: "Trust document gap",
        meta: "Morgan Family Office",
        priority: "Medium",
        status: "ON_HOLD" as const
      }
    ]
  },
  {
    id: "compliance",
    title: "Compliance Pending",
    items: [
      {
        id: "release-pack",
        title: "Client decision pack",
        meta: "Northbridge Family Office",
        priority: "High",
        status: "BLOCKED" as const
      }
    ]
  },
  {
    id: "ready",
    title: "Ready for Client",
    items: [
      {
        id: "soa-pack",
        title: "Released advice package",
        meta: "Bennett Family Office",
        priority: "Low",
        status: "RESOLVED" as const
      }
    ]
  }
];

export const stage06EvidenceItems = [
  {
    id: "ev-001",
    title: "Compliance release checklist",
    type: "Checklist",
    status: "VALIDATED" as const,
    visibility: "Internal only",
    updatedAt: "Today"
  },
  {
    id: "ev-002",
    title: "Client decision record",
    type: "Decision",
    status: "CREATED" as const,
    visibility: "Client-safe after release",
    updatedAt: "Yesterday"
  },
  {
    id: "ev-003",
    title: "Restricted tax note",
    type: "Document",
    status: "RESTRICTED" as const,
    visibility: "Compliance only",
    updatedAt: "2 days ago"
  }
];

export const stage06AuditItems = [
  {
    id: "audit-001",
    title: "Permission check previewed",
    actor: "Naledi Mokoena",
    timestamp: "09:40",
    result: "SUCCESS" as const
  },
  {
    id: "audit-002",
    title: "Evidence draft created",
    actor: "Mira Naidoo",
    timestamp: "09:42",
    result: "PENDING" as const
  },
  {
    id: "audit-003",
    title: "Client visibility blocked",
    actor: "Workflow gate",
    timestamp: "09:43",
    result: "BLOCKED" as const
  }
];
