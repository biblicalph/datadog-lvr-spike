'use strict'

const casual = require('casual')
const moduleId = require('./module-id.js')
const log = require('./log.js').child({module: moduleId(__filename)})
const createStatsDClient = require('./statsd.js')
const pkg = require('../package.json')

const error_messages = [
  "Critical system failure",
  "Unable to connect to database",
  "Out of memory",
  "Disk space running low",
  "Permission denied",
  "User authentication failed",
  "Request timed out",
  "Application crash detected",
  "Server unavailable",
  "Data corruption detected",
  "Connection refused",
  "Timeout on external service",
  "Unexpected server error",
  "Out of bounds error",
  "Failed to write log to disk"
];

const warn_messages = [
  "Deprecation warning",
  "Low disk space",
  "High memory usage",
  "Unstable network connection",
  "API response time high",
  "Authentication weak",
  "Insecure connection detected",
  "Deprecated API endpoint",
  "Multiple failed login attempts",
  "Server resource utilization high",
  "Possible database performance degradation",
  "Potential security vulnerability detected",
  "Invalid input received",
  "Service under heavy load",
  "Configuration mismatch detected"
];

const debug_messages = [
  "Started processing user request",
  "Database query executed successfully",
  "User authentication started",
  "Cache refreshed successfully",
  "Service started",
  "System initialized",
  "Message queued for processing",
  "Received user input",
  "Processing response from API",
  "Connection established to database",
  "User logged in",
  "Session created",
  "Task completed",
  "Request handled",
  "Test configuration loaded"
];

const info_messages = [
  "User registered successfully",
  "Data synchronized",
  "Request processed",
  "Server running smoothly",
  "API endpoint hit",
  "Configuration loaded successfully",
  "Job scheduled",
  "User profile updated",
  "Service uptime 99.9%",
  "Database optimized",
  "Metrics collection started",
  "New deployment successful",
  "System health check passed",
  "Service restarted",
  "Notifications sent"
];

const apps = createApps()
const hosts = createHosts() 

const log_levels = ['error', 'warn', 'debug', 'info']

module.exports = createLogEmitter

function createLogEmitter() {
  let running = true 
  let statsd_client = createStatsDClient()
  let count = 0

  return {
    stop: () => {
      running = false 
      statsd_client.close()
    },
    emit: () => {
      if (running) {
        emitLog({
          statsd_client,
          count: ++count
        }) 
      }
    }
  }
}

function emitLog({
  statsd_client
, count
}) {
  const level = casual.random_element(log_levels)
  const app = casual.random_element(apps)
  const host = casual.random_element(hosts)
  const message = getRandomMessage(level)

  // Log with structured data
  log[level]({
    ddtags: [
      `app:${app}`
    , `host:${host}`
    , `name:${pkg.name}`
    , `version:${pkg.version}`
    ].join(',')
  , hostname: host 
  }, message)
  statsd_client.increment('logs_count', casual.integer(1, 10), ['source:node-app', `count:${count}`, 'unit:count'])
  statsd_client.histogram('logs_graph', count, ['target:web-app', 'status:200'])
  statsd_client.gauge('logs_gauge', casual.double(1, 1000), ['source:node-app', 'unit:gauge'])
}

// Function to get a random log message based on the level
function getRandomMessage(level) {
  switch (level) {
    case 'error': return casual.random_element(error_messages)
    case 'warn': return casual.random_element(warn_messages)
    case 'debug': return casual.random_element(debug_messages)
    case 'info': return casual.random_element(info_messages)
    default: return "Unknown log level"
  }
}

function createApps() {
  return Array.from({length: 10}).map((_, i) => {
    return `app ${i}`
  })
}

function createHosts() {
  return Array.from({length: 10}).reduce((acc, _) => {
    do {
      const host = casual.domain.toLocaleLowerCase()
      if (!acc.includes(host)) {
        acc.push(host)
        break
      }
    } while (true)
    return acc 
  }, [])
}
