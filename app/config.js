'use strict'

const {LEVELS} = require('@answerbook/create-pino-config')
const Config = require('@logdna/env-config')

module.exports = new Config([
  Config
    .enum('loglevel')
    .values(LEVELS)
    .default('info')
    .desc('The minimum level of logging to output')
, Config
    .boolean('logpretty')
    .default(false)
    .desc('Pretty-print json log output')
, Config
    .string('redis-host')
    .default('cache')
    .desc('The host or hosts string for redis')
, Config
    .number('redis-port')
    .default(6379)
    .desc('The port for redis')
, Config
    .number('redis-retry-interval-ms')
    .default(5000)
    .desc('How long to wait before each attempt to re-establish a Redis connection')
, Config
    .string('web-app-url')
    .default('http://localhost:9000')
    .desc('The web app base URL')
, Config
    .string('datadog-agent-host')
    .default('datadog-agent')
    .desc('The datadog-agent host')
, Config
    .number('datadog-agent-metrics-port')
    .default(8125)
    .desc('Port the agent listens on for metrics')
, Config
    .number('datadog-agent-apm-port')
    .default(8126)
    .desc('Port the agent listens on for APM')
, Config
    .enum('log-destination')
    .values(['stderr', 'file'])
    .default('file')
    .desc('The destination to write log files to')
, Config
    .enum('log-library')
    .values(['pino', 'winston'])
    .default('pino')
    .desc('The log library to use')
])