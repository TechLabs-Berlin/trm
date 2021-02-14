module.exports = () => {
  const env = process.env.NODE_ENV || 'production'

  if(!('PORT' in process.env)) {
    throw new Error('PORT is unset')
  }
  const port = process.env.PORT

  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  if(!('GRAPHQL_URL' in process.env)) {
    throw new Error('GRAPHQL_URL is unset')
  }
  const graphqlURL = process.env.GRAPHQL_URL

  if(!('GOTENBERG_URL' in process.env)) {
    throw new Error('GOTENBERG_URL is unset')
  }
  const gotenbergURL = process.env.GOTENBERG_URL

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    port,
    env,
    jwtKey,
    graphqlURL,
    gotenbergURL,
    debug
  }
}
