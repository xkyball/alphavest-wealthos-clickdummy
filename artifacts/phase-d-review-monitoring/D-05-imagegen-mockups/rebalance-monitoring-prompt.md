# ImageGen Prompt Contract - D-05 - Rebalance Monitoring

Status: prompt-ready; generated mockup not used as acceptance proof.
Reference screenshot: `../D-04-reference-screenshots/signals-reference-catalogue.png`
Target route: `/monitoring/rebalance`

Use the AlphaVest `/signals` screen as the product-native reference for a Rebalance Monitoring page. Preserve the signal-review composition: queue column, central trigger detail, right action rail, internal-only guard, risk/confidence badges, data completeness and notes. Translate signal concepts into rebalance-monitoring concepts:

- drift thresholds,
- liquidity and concentration trigger states,
- blocked and review-required actions,
- due/overdue SLA state,
- analyst/advisor routing,
- no-client-release gate.

Do not include route labels, filenames, annotations, prompt metadata, spec panels or generated-image board chrome. Rebalance triggers are review points, not advice. Do not claim productive persistence, audit events or trigger state mutation unless the tested demo workflow API path proves it.

