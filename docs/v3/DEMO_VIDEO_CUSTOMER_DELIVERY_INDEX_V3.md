# Demo Video Customer Delivery Index V3

Generated: 2026-06-16

Engine mode: `Max` / `ENGINE_MIX_V2_V3`

## Purpose

This index defines the first customer-sendable AlphaVest video bundle. It uses the P0 portfolio manifest and keeps P1/P2 material out of customer delivery unless a specific buyer question requires a proof appendix.

## Customer Bundle

| Order | Candidate | Video Purpose | Customer-Sendable Caveat |
| ---: | --- | --- | --- |
| 1 | P0-01 Platform Policy And No-Advice Baseline | Frame the product rule: no unapproved advice reaches the client. | Policy frame, not policy persistence proof. |
| 2 | P0-02 Tenant Setup And Principal Invitation | Show tenant preparation before client work begins. | Real auth and real invitation delivery are out of scope. |
| 3 | P0-03 User Onboarding Consent And Role Confirmation | Show consent and role acknowledgement in demo mode. | Demo-state only; no MFA or identity-provider claim. |
| 4 | P0-04 Client Profile Documents And Data Quality | Show trusted inputs and document review. | Metadata/document demo proof; no autonomous AI-finality claim. |
| 5 | P0-05 Entities Wealth Map And Action Readiness | Show structured wealth context and action readiness. | Action readiness remains evidence-gated. |
| 6 | P0-06 Signal Request Data And Analyst Routing | Show internal signal handling before advice. | Internal workflow only; no client visibility. |
| 7 | P0-07 Advisor Approval Without Client Release | Show human review without client release. | Advisor approval alone does not release the recommendation. |
| 8 | P0-08 Compliance Request Evidence Or Block Release | Show the negative compliance gate. | Request/block paths keep client visibility off. |
| 9 | P0-09 Compliance Release To Client | Show compliance as the release control. | Client visibility starts only after compliance release. |
| 10 | P0-10 Client Decision And Evidence | Show client agency and evidence access. | Demo transaction, not financial/legal/tax advice. |
| 11 | P0-11 Export Redaction Approval And Download | Show redaction, approval and controlled export. | Metadata/package-manifest proof; no real binary archive claim. |
| 12 | P0-12 Governance Access And Audit | Show scoped access and audit controls. | Demo authorization proof; real auth remains out of scope. |

## Recommended Customer Playlist

For a short customer send-out, render only:

1. P0-06 Signal Request Data And Analyst Routing
2. P0-07 Advisor Approval Without Client Release
3. P0-08 Compliance Request Evidence Or Block Release
4. P0-09 Compliance Release To Client
5. P0-10 Client Decision And Evidence
6. P0-11 Export Redaction Approval And Download

Use the full P0 bundle when the recipient needs setup, onboarding and governance context.

## Send Checklist

- Run `pnpm screencast:generate-portfolio`.
- Run `pnpm screencast:p0:dry-run`.
- Capture the P0 bundle against a local demo database only.
- Check each `metadata.json` for `customerSendable: true`.
- Check `captionMode` is `burned-in` or `embedded-track`.
- Read the caveat in each `metadata.json` before sending externally.
- Do not send P1/P2 clips as customer proof unless explicitly selected and caveated.

