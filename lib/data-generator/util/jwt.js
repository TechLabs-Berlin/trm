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
  user: ({ location, teamMemberID, functionalTeam, roles }) => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    return jwt.sign({
      location,
      teamMemberID,
      functionalTeam,
      roles,
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName),
      avatar: faker.internet.avatar(),
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': 'user',
        'x-hasura-location': location,
        'x-hasura-team-member-id': teamMemberID,
      },
    },
    jwtKey,
    {
      algorithm: 'HS256',
      expiresIn: '3 days',
    })
  }
})
