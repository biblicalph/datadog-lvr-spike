#!/bin/bash

# Run the Datadog agent in Docker
docker run --rm --name datadog-agent \
  --pid host \
  --cgroupns host \
  -e DD_API_KEY="${DD_API_KEY}" \
  -e DD_LOGS_ENABLED=true \
  -e DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL="${DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL:-true}" \
  -e DD_LOGS_CONFIG_DOCKER_CONTAINER_USE_FILE=true \
  -e DD_CONTAINER_EXCLUDE="name:datadog-agent" \
  -e DD_URL="${DD_URL}" \
  -e DD_LOGS_CONFIG_LOGS_DD_URL="${DD_LOGS_CONFIG_LOGS_DD_URL}" \
  -e DD_LOGS_CONFIG_LOGS_NO_SSL="${DD_LOGS_CONFIG_LOGS_NO_SSL:-false}" \
  -e DATADOG_AGENT_HOST="datadog-agent" \
  -e DD_DOGSTATSD_PORT=8125 \
  -e DD_APM_RECEIVER_PORT=8126 \
  -e DD_APM_ENABLED="${DD_APM_ENABLED:-false}" \
  -e DD_APM_DD_URL="${DD_APM_DD_URL}" \
  -e DD_APM_NON_LOCAL_TRAFFIC="${DD_APM_NON_LOCAL_TRAFFIC:-true}" \
  -e DD_CHECKS_TAG_CARDINALITY="${DD_CHECKS_TAG_CARDINALITY:-low}" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -v ~/mezmo_docker/datadog-agent/run:/opt/datadog-agent/run:rw \
  -p 8125:8125 -p 8126:8126 \
  gcr.io/datadoghq/agent
