# Datadog Metrics

This document contains all research notes on Datadog metrics. Setting up the agent to collect metrics is captured in the main [readme file](./README.md).

## What are metrics

Metrics are numerical values that track changes over time. Example latency.
See [metrics definition](https://docs.datadoghq.com/metrics/#what-are-metrics).

## Types of metrics

Datadog supports 5 [types of metrics](https://docs.datadoghq.com/metrics/#metric-types).
The Datadog agent collects metrics over an interval, applies the necessary computation and egresses them to the destination server. The processing depends on the type of metric.

1. `count`: all submitted values over the interval are added up to produce a single value
2. `rate`: the count of values divided by the time interval
3. `gauge`: the last value reported during the interval
4. `histogram`: produces 5 different values - avg, count, median, p95 and max. Additional values can be produced by configuring the agent.
5. `distribution`: same as histogram except that it summarizes values across all hosts.

## Custom metrics

According to DD, the following are all considered custom metrics:

1. Metrics submitted through Dogstatsd or a custom agent check
2. Metrics submitted by marketplace integrations

See [custom metrics overview](https://docs.datadoghq.com/metrics/custom_metrics/#overview) for additional sources.
