'use strict'

const dynamicImporter = require('./dynamic-importer.js')
const config = require('../config.js')
const createStatsDClient = require('./statsd.js')

const WEB_APP_BASE_URL = config.get('web-app-url')
const REQUEST_TIMEOUT_MS = 15_000

module.exports = createPinger

async function createPinger() {
  let statsd_client = createStatsDClient()
  let running = true 
  let request_count = 0

  return {
    ping: async () => {
      if (running) {
        await pingWebApp({
          statsd_client
        , request_count: ++request_count
        })
      }
    }
  , stop: () => {
      running = false 
      statsd_client.close()
    }
  }
}

async function pingWebApp({
  statsd_client
, request_count
}) {
  const {default: got} = await dynamicImporter('got')

  try {
    log.debug({ request_count }, 'Making request to web app from node app...')
    statsd_client.increment('ping_count', ['source:node-app', `count:${request_count}`])

    const data = await got.get(`${WEB_APP_BASE_URL}/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    , timeout: {
        request: REQUEST_TIMEOUT_MS
      }
    }).json()
    log.info({data}, 'Received ok response from the web app')
    statsd_client.histogram('success_pings', request_count, ['target:web-app', 'status:200'])
  } catch (err) {
    log.error({err}, 'Received error response from web app')
    statsd_client.histogram('error_pings', request_count, ['target:web-app', 'status:500'])
  }
}