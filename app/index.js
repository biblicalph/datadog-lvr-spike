'use strict'

const config = require('./config.js')
const moduleId = require('./lib/module-id.js')
const log = require('./lib/log.js').child({module: moduleId(__filename)})
const redis = require('./lib/redis.js')
const createLogEmitter = require('./lib/log-generator.js')
const sendTraceToDatadog = require('./lib/tracer.js')

config.validateEnvVars()

module.exports = {
  start
, stop
}

let log_emitter
let interval_id

async function start() {
  log_emitter = createLogEmitter()

  await redis.connect()
  log.info(`Node app started`)

  interval_id = setInterval(() => {
    log_emitter.emit()
    sendTraceToDatadog().catch(err => {
      log.error(`trace error: ${err.message}`)
    })
  }, 100)
}

async function stop() {
  redis.disconnect()
  if (log_emitter) {
    log_emitter.stop()
  }
  if (interval_id) {
    clearInterval(interval_id)
  }
}

function onSignal(signal) {
  log.warn('received %s, shutting down', signal)
  stop()
}

process.once('SIGTERM', onSignal)
process.once('SIGINT', onSignal)

if (require.main === module) {
  start()
    .catch((err) => {
      log.error({err}, 'failed to start')
      process.nextTick(() => {
        throw err
      })
    })
}
