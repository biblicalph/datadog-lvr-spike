'use strict'

const path = require('path')
const pino = require('pino')
const { createLogger: createWinstonLogger, format, transports } = require('winston')
const {createPinoConfig} = require('@answerbook/create-pino-config')
const pkg = require('../package.json')
const config = require('../config.js')
const { stderr } = require('process')

const LOG_DESTINATION = config.get('log-destination')
const LOG_LEVEL = config.get('loglevel')
const LOG_LIBRARY = config.get('log-library')

module.exports = createLogger()

function createLogger() {
  switch (LOG_LIBRARY) {
    case 'winston':
      return winstonLogger()
    default: 
      return pinoLogger()
  }
}

function pinoLogger() {
  return pino({
    ...createPinoConfig({
      level: LOG_LEVEL
    , pretty: config.get('logpretty')
    , name: pkg.name
    , formatters: {
        bindings() {
          return {
            name: pkg.name
          , version: pkg.version
          , ddsource: 'nodejs'
          , service: 'node-api'
          }
        }
      }
    })
  , timestamp: pino.stdTimeFunctions.isoTime
  }, pinoLogDestination())
}

function pinoLogDestination() {
  switch (LOG_DESTINATION) {
    case 'file':
      return pino.destination(path.join(__dirname, '..', 'app.log'))
    default:
      return pino.destination(stderr)
  }
}

function winstonLogger() {
  return createWinstonLogger({
    level: LOG_LEVEL,
    exitOnError: false,
    format: format.json(),
    transports: [
      winstonLogDestination()
    ],
  })
}

function winstonLogDestination() {
  switch (LOG_DESTINATION) {
    case 'file':
      return new transports.File({ filename: path.join(__dirname, '..', 'app.log') })
    default:
      return new transports.Console()
  }
}