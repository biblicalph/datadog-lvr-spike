# List of requests made by the agent

## Log requests

When configured to send logs to pipeline, the agent makes requests to the provided endpoint in the form  `POST <DD_LOGS_CONFIG_LOGS_DD_URL>/api/v2/logs`. The request is similar to sending logs via the [Datadog API](https://docs.datadoghq.com/api/latest/logs/#send-logs).

### Request structure

Request: `POST <DD_LOGS_CONFIG_LOGS_DD_URL>/api/v2/logs`.

Logs agent payload is available [here](https://github.com/DataDog/agent-payload/blob/master/proto/logs/agent_logs_payload.proto)

Example payload, after decompressing the body

```json
{
  "body": [
    {
      "message": "{\"level\":\"debug\",\"time\":1740465374291,\"name\":\"ingestion-service\",\"module\":\"kafka-producer\",\"loginfo\":{\"fac\":\"METADATA\"},\"logsource\":\"librdkafka\",\"severity\":7,\"message\":\"[thrd:main]: Error in metadata reply for topic pipeline.v1.s_82918fe1-b80d-4fdd-8cc9-9e08d5cfd74e (PartCnt 0): Broker: Unknown topic or partition\"}",
      "status": "error",
      "timestamp": 1740584576187,
      "hostname": "docker-desktop",
      "service": "ingestion-service",
      "ddsource": "ingestion-service",
      "ddtags": "filename:fd55464d3d21fa69399e1e5f4a48d14d34921fe036c404877aa6fe89f47da31c-json.log,dirname:/var/lib/docker/containers/fd55464d3d21fa69399e1e5f4a48d14d34921fe036c404877aa6fe89f47da31c,git.repository_url:https://github.com/ClickHouse/ClickHouse,image_name:us.gcr.io/k8s/ingestion-service,short_image:ingestion-service,image_tag:4-latest,image_id:sha256:7bf10362063f7220a85bf71d5f03dabccb01345790304d67efac7f8f64cbd7fd,docker_image:us.gcr.io/k8s/ingestion-service:4-latest,container_name:pongo--ingestion-service-1,container_id:fd55464d3d21fa69399e1e5f4a48d14d34921fe036c404877aa6fe89f47da31c"
    }
  ],
  "headers": {
    "accept-encoding": "gzip",
    "dd-protocol": "agent-json",
    "dd-message-timestamp": 1740586943792,
    "dd-evp-origin-version": "7.63.1",
    "dd-evp-origin": "agent",
    "dd-current-timestamp": 1740586943792,
    "dd-api-key": "api-key",
    "content-type": "application/json",
    "content-encoding": "gzip",
    "content-length": 1458,
    "user-agent": "datadog-agent/7.63.1",
    "host": "147b37ad-6f82-4595-a2b5-2223881839.webhook.site:443"
  }
}
```

## Validate requests

The agent makes a request to validate the API key: `GET <DD_URL>/api/v1/validate?api_key=<api-key>`. See [Datadog documentation](https://docs.datadoghq.com/api/latest/authentication/#validate-api-key) for validate call.

Today, this call is also routed through Kong, returning 200 even if a wrong API key is used. Options to consider:

1. Update the agent to avoid hijacking the validate call
2. Proxy the request to Datadog
3. Ignore and continue as-is: the user can specify a key that was not created in Datadog as long as the key was added in the access key management screens

Note: Requests by the agent, such as process checks `POST https://process.datadoghq.com/api/v1/container` fails if the API key is invalid

## Service check requests

> Service checks monitor the up or down status of specific services. You are alerted whenever the monitoring Agent fails to connect to that service in a specified number of consecutive checks. For example, you can get an alert any time the monitoring Agent on a Redis host reports three consecutive failed attempts to connect to Redis and collect metrics

Source: [Datadog service check](https://docs.datadoghq.com/developers/service_checks/#overview) documentation.

The agent makes `POST <DD_URL>/api/v1/check_run` requests for check runs. See [Datadog service check API](https://docs.datadoghq.com/api/latest/service-checks/#submit-a-service-check). The status of the check, an int between 0 and 3

### Service check request structure

Request: `POST <DD_URL>/api/v1/check_run`

Below is an example of the request headers and decompressed body for service checks

```json
{
  "body": [
    {
      "check": "app.ok",
      "status": 0,
      "tags": [
        "environment:test"
      ],
      "host_name": "app.host1",
      "message": "app is running",
      "timestamp": -54803726
    },
    {
      "check": "app.ok",
      "status": 0,
      "tags": [
        "environment:test"
      ],
      "host_name": "app.host1",
      "message": "app is running",
      "timestamp": 16507355
    }
  ],
  "headers": {
    "accept-encoding": "gzip",
    "dd-api-key": "api-key",
    "dd-agent-version": "7.63.1",
    "content-encoding": "zstd",
    "content-type": "application/json",
    "content-length": 1458,
    "user-agent": "datadog-agent/7.63.1",
    "host": "webhook.site"
  }
}
```

### Service checks via pipeline

We currently have no way, via Pipeline, to send these check runs to Datadog; the received events will be forwarded to Datadog as logs. Alerting, built on these agent checks may be impacted. See [monitoring and alerting](https://docs.datadoghq.com/monitors/) documentation.

## Metrics requests

The agent sends metrics via a `POST` request to `<DD_URL>/api/v2/series`.

### Request payload

Request: `POST <DD_URL>/api/v2/series`

The agent metric payload proto is available [here](https://github.com/DataDog/agent-payload/blob/master/proto/metrics/agent_payload.proto)
Example of the headers and decompressed body

```json
{
  "body": {
    "series": [
      {
        "metric": "system.load.1",
        "interval": 10,
        "points": [
          {
            "timestamp": 1636629071,
            "value": 0.7
          }
        ],
        "resources": [
          {
            "name": "docker-desktop",
            "type": "host"
          }
        ],
        "source_type_name": "",
        "tags": [
          "env:production",
          "service:my_node_app",
          "source:node-app",
          "count:32913"
        ],
        "type": "RATE",
        "unit": ""
      }
    ]
  },
  "headers": {
    "accept-encoding": "gzip",
    "dd-api-key": "api-key",
    "dd-agent-version": "7.63.1",
    "dd-agent-payload": "v5.0.141",
    "content-encoding": "zstd",
    "content-type": "application/x-protobuf",
    "content-length": 1458,
    "user-agent": "datadog-agent/7.63.1",
    "host": "webhook.site"
  }
}
```

## Intake requests

The agent intermittently sends requests to identify the device it is running on. The endpoint the data is posted is not part of the publicly available API.

### Intake request details

Request: `POST DD_URL/intake`

A sample of the intake request, with the payload decompressed is avialable [here](./requests/intake.json).

### Intake requests via pipeline

Intake requests, routed through pipeline, end up as logs. So far, it appears the agent continues to work even when these requests don't make it to Datadog.

## Process requests

Process monitoring, included in all [Enterprise plans](https://docs.datadoghq.com/infrastructure/process/?tab=linuxwindows), provides visibility into processes running in a client's infrastructure.

The process request calls are of the form `https://api.<DD_SITE>/api/v1`; example is the [discovery](https://api.us5.datadoghq.com/api/v1/discovery) request.
