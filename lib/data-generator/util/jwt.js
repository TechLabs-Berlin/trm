const jwt = require('jsonwebtoken')
const faker = require('faker')

module.exports = ({ jwtKey }) => ({
  admin: () => {
    return jwt.sign({
      name: 'Service Account',
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['admin'],
        'x-hasura-default-role': 'admin'
      }
    }, jwtKey)
  },
  user: ({ location }) => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    return jwt.sign({
      email: faker.internet.email(firstName, lastName),
      avatar: faker.internet.avatar(),
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-location': location
      },
      firstName,
      lastName,
    },
    jwtKey,
    {
      algorithm: 'HS256',
      expiresIn: '3 days',
    })
  }
})
