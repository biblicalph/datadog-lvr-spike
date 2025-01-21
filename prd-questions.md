# LVR spike and related questions

## Log reduction

The existing profiler can be run for logs collected by datadog agent.
While testing, I found that structured logs from containers are sent to the pipeline as strings; these can be profiled as is or parsed and then profiled.

See [log collection notes](https://docs.datadoghq.com/getting_started/tagging/#assign-tags).

### Log reduction questions

1. Do we have a non local example of an agent collecting structured logs we can use to verify this behavior?

## Metric reduction

1. Profile metrics, tags and values
    1. The metrics APIs don't include an endpoint to fetch custom metrics specifically.
    2. There are endpoints to get a [list of metrics](https://docs.datadoghq.com/api/latest/metrics/#get-a-list-of-metrics) and a list of [active metrics](https://docs.datadoghq.com/api/latest/metrics/#get-active-metrics-list). We can filter out system metrics collected by the agent to arrive at the custom metrics. Alternatively, we can use the [metric metadata endpoint](https://docs.datadoghq.com/api/latest/metrics/#get-metric-metadata) to fetch this information. This requires a separate API call for each metric.
    3. Tag values must also be listed per metric using the [metric tags endpoint](https://docs.datadoghq.com/api/latest/metrics/#list-tags-by-metric-name)
    4. For an organization with a large number of metrics, these API calls will add up but can be done.
    5. . We can't retrieve this information using the datadog API. We'll have to track this via pipeline.
2. Highlight metric usage
    1. [Usage metering APIs](https://docs.datadoghq.com/api/latest/usage-metering/) can be used here. Most of the endpoints are, however, restricted to the previous 15 days
    2. There are no endpoints to determine tag usage from a query perspective
3. Provide metrics optmizations
    1. The [APIs for metric usage](https://docs.datadoghq.com/api/latest/usage-metering/#get-hourly-usage-for-custom-metrics) have been deprecated and cannot be used


### Metric reduction questions

1. Do we have a production like account we can test some of the APIs on. [Metrics by hourly usage endpoint](https://docs.datadoghq.com/api/latest/usage-metering/#get-all-custom-metrics-by-hourly-average) is a candidate worth further exploration.