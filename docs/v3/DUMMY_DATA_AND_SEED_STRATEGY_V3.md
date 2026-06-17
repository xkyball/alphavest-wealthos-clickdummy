# Dummy Data and Seed Strategy V3

The application must be useful from the first run. All pages must work with generated demo data.

## Required seed domains

```text
platform tenants
client tenants
users
roles and permissions
family members
relationships
entities
assets
documents
document extractions
triggers
actions
recommendations
approvals
compliance reviews
decisions
evidence records
audit events
message threads
call events
export requests
queue items
policies
```

## Required demo tenants

- Bennett Family Office
- Morgan Family Office
- Northbridge Family Office
- Summit Ridge Capital

## Required demo roles

- Principal
- Family CFO
- Trustee
- Next Gen
- External Advisor
- Analyst
- Senior Wealth Advisor
- Compliance Officer
- Client Success
- Admin
- Security Officer

## Required state coverage

Seeds must include objects in these states:

```text
default
empty
loading simulation
error simulation
blocked
pending
approved
released
restricted
needs_evidence
SLA breach
```

## Seed command target

Codex should add commands equivalent to:

```bash
pnpm db:reset
pnpm db:seed
pnpm dev
```
