const { ApolloServer } = require("apollo-server")
const { buildServer } = require('./handler/server')
const server = buildServer({ ApolloServer })

server.listen({
  host: '0.0.0.0',
  port: 4000,
}).then(({ url }) => {
    console.log(`schema ready at ${url}`);
})
