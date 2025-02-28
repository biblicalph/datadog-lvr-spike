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
  -e DATADOG_AGENT_PORT=8125 \
  -e DD_CHECKS_TAG_CARDINALITY="${DD_CHECKS_TAG_CARDINALITY:-low}" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -v ~/mezmo_docker/datadog-agent/run:/opt/datadog-agent/run:rw \
  gcr.io/datadoghq/agent:7.61.0
