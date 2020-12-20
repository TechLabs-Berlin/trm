const faker = require('faker')
const { mustBeAuthorized } = require('./auth')

exports.resolvers = {
  Query: {
    edyoucated_users: async (_, { usernames }, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return usernames.map(username => ({
        id: faker.random.uuid(),
        avatar_url: faker.image.avatar(),
        username,
      }))
    },
    edyoucated_activity: async (_, { userIDs }, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return userIDs.map(id => ({
        value: faker.random.number(50),
        id,
      }))
    }
  }
}
