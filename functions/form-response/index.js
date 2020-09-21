const newEventHandler = require('./handler/event')
const newHasuraStore = require('./store/hasura')
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
const hasura = newHasuraStore({
  graphqlURL: config.graphqlURL,
  token: jwt.generate(),
  fetch,
  log
})
const eventHandler = newEventHandler({
  hasura,
  log
})

exports.handler = async (req, res) => {
  if(req.method !== 'POST') {
    res.status(405).send('method not allowed')
    return
  }

  try {
    await eventHandler.handle({
      payload: req.body
    })
    res.status(204).send()
  } catch(error) {
    if(error instanceof Error) {
      console.error(error)
    } else {
      console.error(new Error(`Rejected Promise: ${JSON.stringify(error)}`))
    }
    res.status(500).send('internal server error')
  }
}
