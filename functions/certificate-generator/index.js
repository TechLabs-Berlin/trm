const newEventHandler = require('./handler')
const config = require('./config')()
const log = require('./util/logger')({
  debugLoggingEnabled: config.debug
})
const fetch = require('./util/fetch')({
  log
})
const jwt = require('./util/jwt')({
  jwtKey: config.jwtKey
})
const buildTRMAPI = require('trm-api')({
  graphqlURL: config.graphqlURL,
  token: jwt.generate(),
  fetch,
  log
})
const tokenProvider = require('./pdf/token')({
  gotenbergURL: config.gotenbergURL,
  fetch,
})[['staging', 'production'].includes(config.env) ? 'production' : 'test']
const pdfGenerator = require('./pdf/generator')({
  gotenbergURL: config.gotenbergURL,
  fetch,
  tokenProvider,
})
const eventHandler = newEventHandler({
  buildTRMAPI,
  jwt,
  log,
  pdfGenerator,
})

exports.handler = async (req, res) => {
  if(!['POST', 'OPTIONS'].includes(req.method)) {
    res.status(405).send('method not allowed')
    return
  }

  try {
    await eventHandler({ req, res })
  } catch(error) {
    if(error instanceof Error) {
      console.error(error)
    } else {
      console.error(new Error(`Rejected Promise: ${JSON.stringify(error)}`))
    }
    res.status(500).send('internal server error')
  }
}
