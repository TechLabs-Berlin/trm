const { ApolloLogExtension } = require('apollo-log')

const config = require('../config')()
const log = require('../util/logger')({
  debugLoggingEnabled: config.debug
})
const jwt = require('../util/jwt')({
  jwtKey: config.jwtKey
})
const newGoogleStore = require('../store/google')
const { typeDefs } = require('./typeDefs')

let resolvers
if(['staging', 'production'].includes(config.env)) {
  resolvers = require('./resolvers').resolvers
} else {
  log.warning('Loading stub resolvers')
  resolvers = require('./stubResolvers').resolvers
}

const google = newGoogleStore({
  log
})

exports.buildServer = ({ ApolloServer }) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    extensions: [
      () => {
        if(!config.debug) {
          return {}
        }
        return new ApolloLogExtension()
      },
      () => ({
        didEncounterErrors: (errors) => {
          log.error('GraphQL server had errors', { errors })
        }
      })
    ],
    context: async ({ req, res }) => {
      return {
        headers: req.headers,
        req,
        res,
        google,
        jwt,
        log
      }
    },
  })
}
