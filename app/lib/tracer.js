
const moduleId = require('./module-id.js')
const log = require('./log.js').child({module: moduleId(__filename)})
const config = require('../config.js')

const AGENT_HOST = config.get('datadog-agent-host')
const AGENT_PORT = config.get('datadog-agent-apm-port')
const AGENT_APM_URL = `http://${AGENT_HOST}:${AGENT_PORT}/v0.3/traces`

// Function to generate a mock trace with 3 spans
function generateTrace() {
  const trace_id = Math.floor(Math.random() * 1_000_000);
  const web_span_id = Math.floor(Math.random() * 1_000_000)
  const req_start_ns = Date.now() * 1000

  const trace = [
    // Web Request Span (External API)
    {
      trace_id,
      span_id: web_span_id,
      parent_id: null,
      name: 'web.request',
      resource: 'GET /api/v1/user/profile',
      service: 'web-service',
      type: 'web',
      start: req_start_ns,
      duration: req_start_ns + (15 * 1_000_000),
      error: 0,
      meta: {
        user_id: '2222'
      }
    },
    // Redis Span
    {
      trace_id,
      span_id: Math.floor(Math.random() * 1_000_000),
      parent_id: web_span_id,
      name: 'redis.command',
      resource: 'GET /user:12345',
      service: 'redis-service',
      type: 'cache',
      start: req_start_ns + (200 * 1_000_000),
      duration: req_start_ns + (1 * 1_000_000),
      error: 0,
    },
    // Database Span
    {
      trace_id,
      span_id: Math.floor(Math.random() * 1_000_000),
      parent_id: web_span_id,
      name: 'db.query',
      resource: 'SELECT * FROM users WHERE id = 12345',
      service: 'db-service',
      type: 'db',
      start: req_start_ns + (500 * 1_000_000),
      duration: req_start_ns + (10 * 1_000_000),
      error: 0,
    }
  ];

  return trace;
}

// Function to send traces to the Datadog Agent API
// https://docs.datadoghq.com/tracing/guide/send_traces_to_agent_by_api/?tab=shell
async function sendTraceToDatadog() {
  const trace = generateTrace();

  const {got} = await import('got')
  try {
    const response = await got.put(AGENT_APM_URL, [trace], {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    log.info('Traces successfully sent to Datadog Agent:', response.status);
  } catch (error) {
    log.error(`trace endpoint: ${AGENT_APM_URL}`)
    // Log the error details
    if (error.response) {
      // If we get a response with an error status
      log.error(`Trace error response code: ${error.response.statusCode}`);
      log.error('Response body: ', error.response.body);
    } else if (error.request) {
      // If the request was made but no response was received
      log.error('Trace error request made but no response received.');
      log.error('Request details:', error.request);
    } else {
      // If some other error occurred
      log.error('Trace unexpected error:', error.message);
    }
  }
}

module.exports = sendTraceToDatadog