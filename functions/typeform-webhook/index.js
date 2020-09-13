const newTypeformStore = require('./store/typeform')
const newEventHandler = require('./handler/event')
const newHasuraStore = require('./store/hasura')
const callbackUtil = require('./util/callback')
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
const typeform = newTypeformStore({
  log,
  fetch
})
const hasura = newHasuraStore({
  graphqlURL: config.graphqlURL,
  token: jwt.generate(),
  fetch,
  log
})
const eventHandler = newEventHandler({
  callbackURL: config.typeformCallbackURL,
  typeform,
  hasura,
  log
})

exports.handler = async (req, res) => {
  if(req.method !== 'POST') {
    res.status(405).send('method not allowed')
    return
  }
  try {
    await eventHandler.handleEvent(req.body)
    res.status(204).send()
  } catch(error) {
    log.error(`Event handler errored`, { error })
    res.status(500).send('internal server error')
  }
}
