'use strict'

const StatsD = require('hot-shots')
const moduleId = require('./module-id.js')
const config = require('../config.js')
const log = require('./log.js').child({module: moduleId(__filename)})

const AGENT_HOST = config.get('datadog-agent-host')
const AGENT_PORT = config.get('datadog-agent-port')

function createStatsDClient() {
  return new StatsD({
    host: AGENT_HOST
  , port: AGENT_PORT
  , prefix: 'my_node_app.'  // prefix for all metrics
  , globalTags: ['env:production', 'service:my_node_app']
  , errorHandler: (err) => {
      log.error({err}, 'Error emitted from StatsD client')
    }
  , close: () => {
      log.info('Closing StatsD client...')
    }
  })
}

module.exports = createStatsDClient

