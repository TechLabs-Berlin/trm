const jwt = require('jsonwebtoken')

module.exports = ({ jwtKey }) => {
  return {
    generate: () => {
      return jwt.sign({
        name: 'Service Account',
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['admin'],
          'x-hasura-default-role': 'admin'
        }
      }, jwtKey)
    }
  }
}
