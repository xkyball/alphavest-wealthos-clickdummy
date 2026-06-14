import { Pool } from "pg";
import {
  applyDemoTransition,
  createInitialDemoSession,
  demoSessionId,
  type DemoSessionSnapshot,
  type DemoTransitionInput
} from "./demo-runtime";

declare global {
  var __alphaVestDemoSession: DemoSessionSnapshot | undefined;
  var __alphaVestPgPool: Pool | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  globalThis.__alphaVestPgPool ??= new Pool({
    connectionString: process.env.DATABASE_URL
  });

  return globalThis.__alphaVestPgPool;
}

async function ensureSchema() {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  await pool.query(`
    create table if not exists demo_sessions (
      id text primary key,
      snapshot jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);

  return pool;
}

export async function readDemoSession() {
  const pool = await ensureSchema();

  if (!pool) {
    globalThis.__alphaVestDemoSession ??= createInitialDemoSession();
    return globalThis.__alphaVestDemoSession;
  }

  const result = await pool.query<{ snapshot: DemoSessionSnapshot }>(
    "select snapshot from demo_sessions where id = $1",
    [demoSessionId]
  );

  if (result.rows[0]?.snapshot) {
    return result.rows[0].snapshot;
  }

  const initial = createInitialDemoSession();
  await writeDemoSession(initial);
  return initial;
}

export async function writeDemoSession(snapshot: DemoSessionSnapshot) {
  const pool = await ensureSchema();

  if (!pool) {
    globalThis.__alphaVestDemoSession = snapshot;
    return snapshot;
  }

  await pool.query(
    `
      insert into demo_sessions (id, snapshot, updated_at)
      values ($1, $2::jsonb, now())
      on conflict (id)
      do update set snapshot = excluded.snapshot, updated_at = now()
    `,
    [snapshot.sessionId, JSON.stringify(snapshot)]
  );

  return snapshot;
}

export async function resetDemoSession() {
  return writeDemoSession(createInitialDemoSession());
}

export async function transitionDemoSession(input: DemoTransitionInput) {
  const snapshot = await readDemoSession();
  const next = applyDemoTransition(snapshot, input);

  return writeDemoSession(next);
}
