import pg from "pg";

const { Pool } = pg;

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://alphavest:alphavest@localhost:5432/alphavest_wealthos";

const initialSnapshot = {
  version: "phase-7.5",
  sessionId: "alpha-demo-main",
  updatedAt: "2026-06-14T00:00:00.000Z",
  workflows: [
    {
      id: "wf-trust-x-recommendation",
      workflow: "recommendation",
      state: "needs_review",
      title: "Trust X beneficiary update recommendation",
      objectId: "trust-x-beneficiary-update",
      ownerRole: "AlphaVest Analyst",
      evidenceRecordExists: true,
      advisorApproval: false,
      complianceRelease: false,
      permissionCheck: true,
      clientVisibilityState: "blocked",
      lastEvent: "recommendation.drafted"
    },
    {
      id: "wf-trust-deed-document",
      workflow: "document",
      state: "under_review",
      title: "Updated Trust X deed",
      objectId: "trust-deed-2026",
      ownerRole: "AlphaVest Analyst",
      evidenceRecordExists: true,
      advisorApproval: false,
      complianceRelease: false,
      permissionCheck: true,
      clientVisibilityState: "blocked",
      lastEvent: "document.uploaded"
    },
    {
      id: "wf-beneficiary-decision",
      workflow: "decision_record",
      state: "needs_review",
      title: "Family decision: Trust X beneficiary register",
      objectId: "decision-trust-x-beneficiary",
      ownerRole: "Principal",
      evidenceRecordExists: false,
      advisorApproval: false,
      complianceRelease: false,
      permissionCheck: true,
      clientVisibilityState: "blocked",
      lastEvent: "decision.draft"
    },
    {
      id: "wf-external-advisor-access",
      workflow: "access_request",
      state: "requested",
      title: "External advisor release-to-client access",
      objectId: "access-external-advisor-q2",
      ownerRole: "Principal",
      evidenceRecordExists: false,
      advisorApproval: false,
      complianceRelease: false,
      permissionCheck: false,
      clientVisibilityState: "blocked",
      lastEvent: "access.requested"
    },
    {
      id: "wf-q2-communication",
      workflow: "communication",
      state: "draft",
      title: "Q2 released message",
      objectId: "comm-q2-review",
      ownerRole: "Client Success",
      evidenceRecordExists: true,
      advisorApproval: false,
      complianceRelease: false,
      permissionCheck: true,
      clientVisibilityState: "blocked",
      lastEvent: "communication.drafted"
    }
  ],
  evidenceRecords: [
    {
      id: "recommendation.drafted-trust-x-beneficiary-update",
      event: "recommendation.drafted",
      objectType: "Recommendation Draft",
      actorRole: "AlphaVest Analyst",
      objectId: "trust-x-beneficiary-update",
      visibility: "Internal-only",
      reviewNeeded: "Advisor review",
      link: "evidence://recommendation-draft/trust-x-beneficiary-update"
    },
    {
      id: "document.uploaded-trust-deed-2026",
      event: "document.uploaded",
      objectType: "Document File",
      actorRole: "Principal",
      objectId: "trust-deed-2026",
      visibility: "Client/Internal by policy",
      reviewNeeded: "No",
      link: "evidence://document-file/trust-deed-2026"
    }
  ],
  auditEvents: [
    {
      timestamp: "2026-06-14T00:00:00.000Z",
      actorId: "demo-user",
      actorRole: "AlphaVest Analyst",
      sourceIp: "127.0.0.1",
      device: "click-dummy",
      action: "recommendation.drafted",
      objectType: "Recommendation Draft",
      objectId: "trust-x-beneficiary-update",
      correlationId: "corr-trust-x-beneficiary-update",
      result: "created",
      evidenceLink: "evidence://recommendation-draft/trust-x-beneficiary-update",
      digitalSeal: "seal-trust-x-beneficiary-update"
    },
    {
      timestamp: "2026-06-14T00:00:00.000Z",
      actorId: "demo-user",
      actorRole: "Principal",
      sourceIp: "127.0.0.1",
      device: "click-dummy",
      action: "document.uploaded",
      objectType: "Document File",
      objectId: "trust-deed-2026",
      correlationId: "corr-trust-deed-2026",
      result: "created",
      evidenceLink: "evidence://document-file/trust-deed-2026",
      digitalSeal: "seal-trust-deed-2026"
    }
  ]
};

const pool = new Pool({ connectionString: databaseUrl });

async function queryWithRetry(sql, params) {
  let lastError;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      return await pool.query(sql, params);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError;
}

await queryWithRetry(`
  create table if not exists demo_sessions (
    id text primary key,
    snapshot jsonb not null,
    updated_at timestamptz not null default now()
  )
`);

await queryWithRetry(
  `
    insert into demo_sessions (id, snapshot, updated_at)
    values ($1, $2::jsonb, now())
    on conflict (id)
    do update set snapshot = excluded.snapshot, updated_at = now()
  `,
  [initialSnapshot.sessionId, JSON.stringify(initialSnapshot)]
);

await pool.end();

console.log(`Seeded demo runtime session ${initialSnapshot.sessionId}`);
