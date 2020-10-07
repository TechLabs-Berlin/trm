const { ApolloLogExtension } = require('apollo-log')

const config = require('../config')()
const log = require('../util/logger')({
  debugLoggingEnabled: config.debug
})
const jwt = require('../util/jwt')({
  jwtKey: config.jwtKey
})
const newEdyoucatedStore = require('../store/edyoucated')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')

const edyoucated = newEdyoucatedStore({
  username: config.edyoucatedUsername,
  password: config.edyoucatedPassword,
  userPoolID: config.edyoucatedUserPoolID,
  identityPoolID: config.edyoucatedIdentityPoolID,
  clientID: config.edyoucatedClientID,
  awsRegion: config.edyoucatedAWSRegion,
  apiURL: config.edyoucatedAPIURL,
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
        edyoucated,
        jwt,
        log
      }
    },
  })
}
