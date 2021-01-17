module.exports = () => {
  const env = process.env.NODE_ENV || 'production'

  if(!('OAUTH_CLIENT_ID' in process.env)) {
    throw new Error('OAUTH_CLIENT_ID is unset')
  }
  const oAuthClientID = process.env.OAUTH_CLIENT_ID

  if(!('OAUTH_CLIENT_SECRET' in process.env)) {
    throw new Error('OAUTH_CLIENT_SECRET is unset')
  }
  const oAuthClientSecret = process.env.OAUTH_CLIENT_SECRET

  if(!('GSUITE_DOMAIN' in process.env)) {
    throw new Error('GSUITE_DOMAIN is unset')
  }
  const gSuiteDomain = process.env.GSUITE_DOMAIN

  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  if(!('GRAPHQL_URL' in process.env)) {
    throw new Error('GRAPHQL_URL is unset')
  }
  const graphqlURL = process.env.GRAPHQL_URL

  if(!('GOOGLE_SERVICE_ACCOUNT_JSON' in process.env)) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is unset')
  }
  const googleServiceAccountJSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)

  if(!('GOOGLE_IMPERSONATE_SUBJECT' in process.env)) {
    throw new Error('GOOGLE_IMPERSONATE_SUBJECT is unset')
  }
  const googleImpersonateSubject = process.env.GOOGLE_IMPERSONATE_SUBJECT

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    env,
    oAuthClientID,
    oAuthClientSecret,
    gSuiteDomain,
    jwtKey,
    graphqlURL,
    googleImpersonateSubject,
    googleServiceAccountJSON,
    debug
  }
}
