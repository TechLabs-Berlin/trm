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

  if(!('GOOGLE_IMPERSONATE_SUBJECT' in process.env)) {
    throw new Error('GOOGLE_IMPERSONATE_SUBJECT is unset')
  }
  const googleImpersonateSubject = process.env.GOOGLE_IMPERSONATE_SUBJECT

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    oAuthClientID,
    oAuthClientSecret,
    gSuiteDomain,
    jwtKey,
    googleImpersonateSubject,
    debug
  }
}
