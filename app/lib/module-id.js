'use strict'

const path = require('path')
const ROOT = path.join(__dirname, '..')

module.exports = function moduleID(location) {
  const relative = path.relative(ROOT, location)
  return relative.replace(/\.js$/, '').replace(/[/\s]/g, ':')
}
