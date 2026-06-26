# ANALYSIS-1.1 - PP-005 Export/Redaction Readiness & Dependency Preflight

Generated: 2026-06-26

Status: `COMPLETE`

Source ticket: `ANALYSIS-1.1`

## Baseline

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Latest commit | `c5dbc48 docs: approve pp005 canonical release outputs` |
| Working tree before PP-005 report edits | clean |
| Source guard | `pnpm guard:source` PASS, 0 violations |
| Target authority | `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` |

## Route Inventory

| Route ID | Path | Current Purpose | Analysis |
| --- | --- | --- | --- |
| 054 | `/export/new` | Create Export | Export creation/start surface exists. |
| 055 | `/export/:id/scope` | Export scope selection | Scope is a separate route/state before redaction or preview. |
| 056 | `/export/:id/redaction` | Export redaction | Redaction is a separate client-visibility-sensitive route. |
| 057 | `/export/:id/approval` | Export preview | Route path is approval while title/purpose still says preview. This drift is known from WP07 and does not by itself collapse state semantics, but PP-005 wording/spec must keep preview and approval explicit. |
| 058 | `/export/:id/download` | Export download/share | Delivery controls are separate from preview and approval. |

## Service/API Inventory

| Area | Current Repo Reality | PP-005 Meaning |
| --- | --- | --- |
| Canonical export API | `app/api/export-workflow/route.ts` | Current canonical export command API. |
| Canonical export command service | `lib/export-workflow-command-service.ts` | Owns command IDs `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD`, `SHARE`. |
| Export package helper | `lib/export-package-service.ts` | Produces metadata-only package/manifest stage proof; no real binary generation claim. |
| Export safety helper | `lib/export-service.ts`; `lib/control-layer/export-safety.ts` | Classifies forbidden payloads and validates allowed export payload shape. |
| File metadata helper | `lib/file-metadata-service.ts` | Attached package/file realism proof after command-spine gates. |
| Demo workflow | `app/api/demo-workflow/route.ts` | Compatibility/demo only, not canonical PP-005 authority. |

## Command Spine Findings

`lib/export-workflow-command-service.ts` declares exactly one command-spine authority:

- canonical command service: `lib/export-workflow-command-service.ts`
- canonical API route: `/api/export-workflow`
- expected audit events: `export.workflow.set_scope`, `export.workflow.validate_redaction`, `export.workflow.preview`, `export.workflow.approve`, `export.workflow.generate`, `export.workflow.download`, `export.workflow.share`
- retired/attached proof families: P44 phase 8, WP10 export UX, AV27 phase 6 payload contract, AV27 phase 7 payload sweep, WCL export safety, file export realism and demo workflow compatibility.

## Test/Proof Inventory

| Proof File | Current Coverage |
| --- | --- |
| `tests/export-command-spine-contract.spec.ts` | Certifies one canonical export command authority and retires legacy proof families behind `/api/export-workflow`. |
| `tests/export-workflow-api.spec.ts` | Proves scope, redaction, preview, approval, generation, download and share separation; forbidden payload blocking; data-quality approval blocker; audit event sequence. |
| `tests/phase8-export-workflow-api.spec.ts` | API workflow proof for phase 8/export closure. |
| `tests/p44-phase8-certification.spec.ts` | Deep export workflow certification including scope, redaction, approval, generation, download/share and forbidden field proof. |
| `tests/export-safety.spec.ts` | WCL/export safety proof, forbidden internal payload blocking and missing redaction profile blocking. |
| `tests/file-export-realism.spec.ts` | Metadata-only package manifest realism and stage/precondition proof. |
| `tests/true-ux-export-scope-redaction-approval.spec.ts` | UI boundary copy and service-level separation. |
| `tests/demo-workflow-api.spec.ts` | Compatibility path proof, including canonical route pointer for export path. |

## Dependency Mapping

| Upstream Contract | Current PP-005 Mapping |
| --- | --- |
| PP-001 scope/payload | Export command spine uses role, tenant, object and payload classification gates; permission denial fails closed. |
| PP-002 sufficiency | Export input must derive from released/client-safe/evidence-safe content; upload-only or insufficient evidence remains blocked by upstream release/sufficiency contracts. |
| PP-003 forbidden payload | Forbidden classifications include AI draft, internal rationale, compliance notes, unreleased evidence, unreleased recommendation and hidden field classes. |
| PP-004 release/client-safe state | PP-005 may consume only canonical released client-safe projections and release facts from the journey command path. |

## Risk Map

| Risk | Current Status | PP-005 Treatment |
| --- | --- | --- |
| Demo workflow ambiguity | Bounded, but still present as compatibility code. | Keep compatibility demoted; do not use as PP-005 authority. |
| Route 057 title/path drift | Present: path says approval, title/purpose says preview. | Spec must name preview and approval as distinct lifecycle actions; potential cleanup after decision. |
| Real binary export overclaim | Current proof is metadata-only manifest; report says no binary export added. | Preserve no-real-binary-storage/no-overclaim boundary unless new decision authorizes storage/download semantics. |
| Turbopack/document storage tracing warning | Non-blocking existing warning in prior reports. | Track as cleanup risk before export/document packaging becomes central. |
| Unused-symbol lint noise | Non-blocking existing warning in prior reports. | Cleanup lane recommended because it adds QA noise. |

## Recommended Implementation Split

Current analysis supports the uploaded split, but with a strong zero-delta first posture:

1. Treat IMPL-1.4 through IMPL-1.9 as already partially/mostly implemented by the command spine.
2. Revalidate each implementation ticket against current tests before changing code.
3. Only patch narrow deltas:
   - route 057 preview/approval naming if DECISION-1.3 approves wording cleanup,
   - any missing PP-005 report/certification artifact,
   - any failed targeted test.
4. Do not add new API, schema migration, route family, or binary export.
5. Prefer removing/demoting legacy ambiguity over adding compatibility wrappers.

## Definition Of Done Check

| Criterion | Result |
| --- | --- |
| Relevant export files/routes/services/tests identified | PASS |
| Export lifecycle and current gaps documented | PASS |
| Redaction/forbidden payload risk map documented | PASS |
| Specification need clear | PASS |
| Implementation task cut proposed | PASS |
| Open risks and decisions named | PASS |

## Result

`ANALYSIS-1.1_COMPLETE`

Next ticket in uploaded order: `SPEC-1.2`.
