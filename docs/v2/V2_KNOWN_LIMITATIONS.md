# V2 Known Limitations

Date: 2026-06-14

## Prototype Boundary

This repository is a v2 click-dummy/prototype. It is suitable for demo, workflow validation and next implementation planning. It is not production-ready.

## Known Limitations

- No real authentication or identity provider is connected.
- No production authorization middleware enforces server-side object policies.
- Demo runtime state is mock/deterministic and optionally persisted only through the local Postgres demo setup.
- No real KYC, CRM, document API, portfolio system, calendar, notification, messaging or specialist integration is connected.
- Uploads are simulated; files are not stored in a production evidence vault.
- Evidence and audit events are deterministic demo records, not immutable WORM records.
- Digital seals/checksums are placeholders.
- No Playwright dependency is installed; e2e coverage is source/route/model smoke coverage using Node tests plus manual HTTP smoke.
- Loading/error states are represented on key routes but not backed by real production network failure handling.
- `docs/v2/PHASE_6_QA_REPORT.md` is missing from the repository.
- Optional reference routes `/states`, `/permissions/reference` and `/evidence/audit-map` are not implemented as pages because their visuals are logic-only inputs.

## Recommended Next Steps

1. Add production auth and server-side policy enforcement.
2. Replace mock runtime state with real persistent workflow, evidence and audit storage.
3. Add Playwright for browser interaction and screenshot smoke coverage.
4. Integrate document intake/storage and evidence immutability.
5. Connect CRM, portfolio, calendar and communication providers behind feature flags.
6. Preserve the no-unapproved-advice gate as a service-level control, not only UI state.

