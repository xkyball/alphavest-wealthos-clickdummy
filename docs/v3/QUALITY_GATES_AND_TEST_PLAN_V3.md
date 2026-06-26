# Quality Gates and Test Plan V3

## Global build gates

- `pnpm install` succeeds.
- `pnpm build` succeeds.
- `pnpm lint` succeeds or documented lint config gaps exist.
- Prisma migration and seed run locally.
- App starts with demo data.

## Operationalization gates

Every phase or ticket that claims workflow execution, data maintenance, upload, export, evidence creation, audit behavior, governance change, communication send, compliance release or client visibility must follow `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`.

- Declare current and target capability level using E0-E7.
- State the exact operational claim and the explicit non-claim boundary.
- Static UI, local state, read-only fields, metadata-only file/export behavior, fixture mutation and `actionId`-only typed workflows are not operational capability.
- E5 or higher requires a typed payload or file payload path and a named service/API boundary.
- E6 requires permission/workflow-gate proof, including denied or no-client-release behavior where relevant.
- E7 requires validated user payload or file payload, persistence, reload proof, permission denial proof, audit/evidence proof where relevant, and success plus rejection tests.
- Any report using words such as "real", "operational", "persisted", "uploaded", "exported", "released", "audited" or "evidence-backed" must cite the matching proof level.

## Visual/design gates

- Screens use AlphaVest design tokens.
- No generated-image spec panels or annotation rails are implemented as UI.
- Layout is normalized across pages.
- Modals and drawers behave consistently.
- UI is not pixel-perfect copied when references differ.
- No page visually jumps in sidebar/topbar/header/card/table geometry.
- For any ImageGen-to-UI or visual-reference implementation, the Human Visual Implementation Standard must be read before `AGENTS.md` and project sources.
- An `implementation-map` is required before UI edits:
  `route -> component(s) -> state(s) -> role/tenant/context -> existing AlphaVest reference screenshot -> ImageGen visual -> source data/seed -> interaction shape -> expected assertion/proof -> verification status`.
  Use `docs/v3/IMPLEMENTATION_MAP_TEMPLATE_V3.md`.
- ImageGen work must start from a real screenshot of the running AlphaVest app used as reference input.
- Future ImageGen artifact folders must follow `docs/v3/IMAGEGEN_ARTIFACT_STRUCTURE_V3.md`.
- ImageGen output is a design reference only; it is not screenshot proof and not acceptance proof.
- DOM success is not design acceptance.
- Visual completion requires screenshot proof and a Human Visual Review Rubric result using `docs/v3/HUMAN_VISUAL_REVIEW_RUBRIC_RESULT_TEMPLATE_V3.md`.
- Screenshot-Proof Status must be recorded with `docs/v3/SCREENSHOT_PROOF_STATUS_TEMPLATE_V3.md`.
- Completion claims must distinguish `implemented`, `partially implemented`, `visually reviewed`, `screenshot-proven`, `not verified`, `not scanned` and `blocked`; use `docs/v3/COMPLETION_STATUS_LABELS_V3.md`.
- Required state coverage includes default, loading, empty, error, disabled, hover and focus; modal, drawer, overlay, validation and success states are required where relevant.

## Product gates

- No unapproved advice reaches the client.
- Advisor approval alone does not create client visibility.
- Compliance release is required for advice-like client-visible content.
- Evidence records are linked to major decisions and releases.
- Sensitive actions create audit events.

## Testing strategy

### Unit tests

- `permissionEngine`
- `visibilityEngine`
- `workflowGate`
- workflow state transition helpers
- seed factories
- formatters

### Route smoke tests

Every route from `SCREEN_CATALOGUE_V3.md` renders without crashing and shows the expected main heading.

### Playwright core flows

- Demo login and role switch. Report whether this is demo-session only or operational auth.
- Tenant switch. Report tenant isolation level and denial proof when claimed.
- Document upload mock → extraction review → verification pending. Report metadata-only vs E7 multipart upload explicitly.
- Signal → analyst review → advisor approval → compliance review. Report fixture-backed vs payloaded workflow level explicitly.
- Compliance release → client decision → evidence created. Prove advisor, compliance, evidence, permission and visibility gates together.
- Governance role change with second confirmation. Prove editable confirmation phrase validation before operational claims.
- Export wizard → redaction → preview → download/share. Report metadata-only vs generated binary artifact explicitly.

## Deferred tests

Do not add heavy visual regression or full production security tests before pages and workflows are stable.
