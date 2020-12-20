const { AuthenticationError } = require('apollo-server')

exports.mustBeAuthorized = ({ jwt, req }) => {
  if(!req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization required')
  }
  const token = req.headers.authorization.slice(7) // remove 'Bearer '
  try {
    jwt.verify(token)
  } catch(err) {
    throw new AuthenticationError('Token invalid')
  }
}
