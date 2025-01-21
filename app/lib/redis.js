'use strict'

const createRedis = require('@answerbook/redis')
const log = require('./log.js').child({module: 'redis'})
const config = require('../config.js')

const redis = createRedis({
  host: config.get('redis-host')
, port: config.get('redis-port')
, reconnect_timeout: config.get('redis-retry-interval-ms')
, sentinel_name: 'ldrs'
, log
})

module.exports = redis