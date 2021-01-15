const faker = require('faker')
const { mustBeAuthorized } = require('./auth')

exports.resolvers = {
  Query: {
    edyoucated_teams: async (_, _2, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return [{
        id: faker.random.uuid(),
        name: `TechLabs ${faker.address.city()}`,
        members: [{
          id: faker.random.uuid(),
          avatar_url: faker.image.avatar(),
          name: `${faker.name.firstName()} ${faker.name.lastName()}`
        }]
      }]
    },
    edyoucated_teams_by_pk: async (_, { id }, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return {
        id,
        name: `TechLabs ${faker.address.city()}`,
        members: [{
          id: faker.random.uuid(),
          avatar_url: faker.image.avatar(),
          name: `${faker.name.firstName()} ${faker.name.lastName()}`
        }]
      }
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
