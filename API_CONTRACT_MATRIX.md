# API_CONTRACT_MATRIX.md

Status: `NO_NEW_API_BY_DEFAULT`

This Phase 0 matrix locks the current API route universe for First Build
preflight. It does not claim that API presence proves safety or MVP readiness.

## Current API Route Universe

| API Route File | Phase 0 Role |
| --- | --- |
| `app/api/demo-workflow/route.ts` | Existing workflow proof slice |
| `app/api/documents/review/route.ts` | Existing document review proof slice |
| `app/api/documents/route.ts` | Existing document list/projection proof slice |
| `app/api/documents/upload/route.ts` | Existing upload proof slice |
| `app/api/review-monitoring/route.ts` | Existing P1/deferred support proof slice |

## Stop Rule

New API routes are not authorized by default. If a later package appears to need
a new route, stop and report the required explicit-source unlock.

## No-Overclaim Rule

An API route returning 200 is not authorization proof, payload-visibility proof,
evidence sufficiency proof, compliance release proof or client acceptance proof.
