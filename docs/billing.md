# Billing

## Infrastructure

See [infrastructure billing](https://www.datadoghq.com/pricing/?product=infrastructure#products) for more.
[Allotments estimator](https://www.datadoghq.com/pricing/allotments/) provides a detailed breakdown of billable usage.

1. Pricing starts per **host**, between $15 and $34 depending on the plan
2. Container monitoring
    1. Pro plan: 5 containers per host
    2. Enterprise plan: 10 containers per host
    3. Additional containers billed at $0.002 per hour (on demand) or $1 per container (prepaid containers)
3. Custom metrics tracking
    1. Pro plan: 100 per host
    2. Enterprise plan: 200 per host
    3. The agent has [several checks that collect metrics](https://docs.datadoghq.com/getting_started/agent/#checks) in the running environment
    4. Additional custom metrics billed at $1 per 100 metrics per month. See [metrics billing](https://www.datadoghq.com/pricing/?product=infrastructure#infrastructure-how-do-i-get-charged-for-additional-custom-metrics)
4. Custom events tracking
    1. Pro plan: 500 per host
    2. Enterprise plan: 1000 per host

Calculating the datadog bill is rather complicated with no explicit APIs defined for this. The [API reference](https://docs.datadoghq.com/api/latest/) includes a section for [usage metering](https://docs.datadoghq.com/api/latest/usage-metering/) that has endpoints to get usage across an account.
These require an application key in addition to the API key. The application key must also have the [usage_read scope](https://docs.datadoghq.com/api/latest/usage-metering/#get-usage-across-your-account).

## References

1. Article on [datadog pricing](https://signoz.io/blog/datadog-pricing/)