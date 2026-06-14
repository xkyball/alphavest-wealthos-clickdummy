# Page Visual Inventory v2

## Route-level pages

| Route | Domain | Primary source visuals | Implementation priority | Notes |
|---|---|---|---|---|
| `/mobile` | Client mobile home | V2-001, V2-002, V2-003, V2-009 | P0 | Mobile default, blocked and decision notification states. |
| `/mobile/upload` | Mobile document upload | V2-004, V2-005, V2-006, V2-007, V2-008 | P0 | 3-step upload plus blocked/error/pending states. |
| `/portal` | Client web dashboard | V2-010, V2-011, V2-012 | P0 | Dashboard, state handling, click path to Wealth Map. |
| `/wealth-map` | Live Wealth Map | V2-013, V2-014, V2-015, V2-016 | P0 | Graph, drawer, restricted node, escalation. |
| `/actions` | Action Board | V2-017, V2-018, V2-019 | P0 | Kanban, drawer, blocked missing evidence. |
| `/decisions` | Digital Decision Room | V2-020, V2-021, V2-022 | P0 | Ready, permission blocked, evidence created. |
| Evidence preview overlay | Evidence Vault | V2-023, V2-024, V2-025 | P0 | Contextual preview drawer with document preview, restricted record and missing evidence escalation states. |
| `/signals` | Signal / Trigger Review | V2-026, V2-027 | P1 | Internal trigger review and escalation. |
| `/workbench` | Consultant Workbench | V2-028, V2-029, V2-030 | P0 | Queue overview, publish disabled, trigger detail. |
| `/advisor-approval` | Advisor Approval | V2-031, V2-032, V2-033 | P0 | Review, escalate to call, compliance pending. |
| `/compliance` | Compliance Console | V2-034, V2-035, V2-036, V2-037 | P0 | Queue, release, block/request evidence, audit/exception. |
| `/governance` | Role / Permission Management | V2-038, V2-039, V2-040, V2-041, V2-042 | P0 | Matrix, drawer, modal, blocked state, audit history. |
| `/communication` | Communication / Call Trigger | V2-044, V2-045, V2-046, V2-047 | P1 | Decision tree, trigger matrix, message preview, log. |
| `/service-blueprint` | Internal reference / service blueprint | V2-048, V2-049, V2-050 | P1 | Reference only unless internal docs route exists. |
| `/roadmap` | Planning / roadmap reference | V2-051, V2-052, V2-053 | P2 | Reference only unless internal planning route exists. |
| `/states` | Reference: chips, state machines, audit mapping | V2-054, V2-055, V2-056 | P1 | Reference logic and components; not normal UI. |

## Implementation rule

Pages must not simply embed visual PNGs as backgrounds. Recreate the relevant UI region in React/HTML/CSS components and translate annotations into logic, tests and docs.
