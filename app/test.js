'use strict'

const createLogEmitter = require('./lib/log-generator.js')

const emitter = createLogEmitter()

setInterval(() => {
  emitter.emit()
}, 50)