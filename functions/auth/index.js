const config = require('./config')()
const log = require('./util/logger')({
  debugLoggingEnabled: config.debug
})
const fetch = require('./util/fetch')({
  log
})

let buildHandler
if(['staging', 'production'].includes(config.env)) {
  buildHandler = require('./handler/handler').buildHandler
} else {
  log.warning('Loading stub handler')
  buildHandler = require('./handler/stubHandler').buildHandler
}

exports.handler = buildHandler({ config, fetch, log })
