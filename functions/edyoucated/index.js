const { ApolloServer } = require("apollo-server-cloud-functions")
const { buildServer } = require('./handler/server')
const server = buildServer({ ApolloServer })
exports.handler = server.createHandler()
