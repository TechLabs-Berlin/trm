const newEventHandler = require('./handler/event')
const newHasuraStore = require('./store/hasura')
const newTypeformStore = require('./store/typeform')
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
const buildHasura = newHasuraStore({
  graphqlURL: config.graphqlURL,
  token: jwt.generate(),
  fetch,
  log
})
const typeform = newTypeformStore({
  fetch,
  log
})
const eventHandler = newEventHandler({
  functionURL: config.functionURL,
  buildHasura,
  typeform,
  log
})

exports.handler = async (req, res) => {
  if(req.method !== 'POST') {
    res.status(405).send('method not allowed')
    return
  }
  const op = req.query.op
  if(!op || !['one', 'all'].includes(op)) {
    res.status(400).send('invalid request')
    return
  }

  try {
    if(op === 'one') {
      const formID = req.query.formID
      if(!formID) {
        res.status(400).send('invalid request')
        return
      }
      await eventHandler.handleOne({
        payload: req.body,
        formID
      })
    } else if(op === 'all') {
      await eventHandler.handleAll({
        payload: req.body
      })
    }
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
