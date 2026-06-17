# Demo Video Portfolio Decision V3

Generated: 2026-06-16

Engine mode: `Max` / `ENGINE_MIX_V2_V3`

## Decision

Use MESO B from `DEMO_VIDEO_IMPLEMENTATION_ROADMAP_V3.md`: produce the P0 customer bundle first and keep a focused P1 trust-proof appendix ready for compliance, investor and operations follow-up.

Do not create 100 videos now.

## Accepted Portfolio

| Layer | Count | Treatment |
| --- | ---: | --- |
| P0 Primary Demo | 12 | Customer-sendable video candidates. |
| P1 Trust Proof | 16 | Selected videos plus appendix/proof records. |
| P2 Edge / Negative Proof | 18 | QA-first; only selected candidates are promoted to video. |
| P3 Exhaustive Proof | 5 | Matrices, reports and test artifacts, not videos by default. |

## Implemented Fast Portfolio Scope

The quick implementation materializes the portfolio in split manifests without replacing the legacy `J01-J10` manifest:

| Manifest | Scope | Use |
| --- | ---: | --- |
| `docs/v3/journeys.screencast.p0.v3.json` | 12 journeys | Primary customer bundle. |
| `docs/v3/journeys.screencast.p1.v3.json` | 6 selected journeys | Internal trust-proof appendix. |
| `docs/v3/journeys.screencast.p2.v3.json` | 10 selected journeys | Internal negative-proof appendix. |
| `docs/v3/DEMO_P3_PROOF_FAMILIES_V3.json` | 5 proof families | Report/test layer, not video by default. |

The unmaterialized P1/P2 backlog remains intentionally outside fast capture until a buyer question or implementation gap makes it worth promoting.

## Customer-Sendable Policy

A clip is customer-sendable only when:

- it uses demo data only,
- it does not imply final financial, legal or tax advice,
- it does not imply real authentication or production-grade authorization,
- it does not imply real binary export generation unless that exists,
- it has a proof path,
- it has a current-reality label,
- it has an overclaim caveat,
- captions and presenter notes are safe to read outside the repo,
- no spec panels, route labels, filenames, annotation rails or dev notes appear as app UI.

## Language Policy

Default customer video captions stay concise and English-first because the app and current screencast captions are English. German explanation can live in presenter notes, internal handoff and customer email copy.

## Current-Reality Labels

| Label | Meaning |
| --- | --- |
| `route-static` | Route exists and can be rendered, but no workflow execution is claimed. |
| `fixture-backed` | Deterministic demo data/fixture exists. |
| `demo-action-executable` | A specific demo workflow action exists. |
| `test-proven` | Automated or direct proof exists. |
| `customer-recording-ready` | Ready for customer recording after QA-fast pass. |
| `policy-frame-only` | Used as narrative/policy frame, not mutation proof. |
| `metadata-only-export` | Export/file proof is metadata/package-manifest proof, not real binary generation. |

## Video-Worthy Gate

A candidate can enter recording only if it has:

- candidate ID,
- portfolio layer,
- route sequence,
- role and tenant,
- fixture or explicit route-static caveat,
- caption short/long,
- presenter notes,
- proof path,
- current-reality label,
- overclaim risk,
- caveat,
- QA command.

## Rejected Branches

| Branch | Decision |
| --- | --- |
| Keep only `J01-J10` | Rejected; incomplete for onboarding, mobile, evidence index, communication and ops proof. |
| Rename `J01-J10` directly | Rejected; preserves no fallback. |
| Create 100 videos now | Rejected; high maintenance, weak signal. |
| Clone/split into portfolio manifests | Accepted. |
