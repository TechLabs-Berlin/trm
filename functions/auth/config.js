module.exports = () => {
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

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    oAuthClientID,
    oAuthClientSecret,
    gSuiteDomain,
    jwtKey,
    debug
  }
}
