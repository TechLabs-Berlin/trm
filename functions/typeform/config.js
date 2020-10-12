module.exports = () => {
  if(!('NODE_ENV' in process.env)) {
    throw new Error('NODE_ENV is unset')
  }
  const environment = process.env.NODE_ENV

  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  if(!('GRAPHQL_URL' in process.env)) {
    throw new Error('GRAPHQL_URL is unset')
  }
  const graphqlURL = process.env.GRAPHQL_URL

  if(!('FUNCTION_URL' in process.env)) {
    throw new Error('FUNCTION_URL is unset')
  }
  const functionURL = process.env.FUNCTION_URL

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    environment,
    jwtKey,
    graphqlURL,
    functionURL,
    debug
  }
}
