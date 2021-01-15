module.exports = () => {
  const env = process.env.NODE_ENV || 'production'

  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  if(!('EDYOUCATED_USERNAME' in process.env)) {
    throw new Error('EDYOUCATED_USERNAME is unset')
  }
  const edyoucatedUsername = process.env.EDYOUCATED_USERNAME

  if(!('EDYOUCATED_PASSWORD' in process.env)) {
    throw new Error('EDYOUCATED_PASSWORD is unset')
  }
  const edyoucatedPassword = process.env.EDYOUCATED_PASSWORD

  if(!('EDYOUCATED_USER_POOL_ID' in process.env)) {
    throw new Error('EDYOUCATED_USER_POOL_ID is unset')
  }
  const edyoucatedUserPoolID = process.env.EDYOUCATED_USER_POOL_ID

  if(!('EDYOUCATED_CLIENT_ID' in process.env)) {
    throw new Error('EDYOUCATED_CLIENT_ID is unset')
  }
  const edyoucatedClientID = process.env.EDYOUCATED_CLIENT_ID

  if(!('EDYOUCATED_AWS_REGION' in process.env)) {
    throw new Error('EDYOUCATED_AWS_REGION is unset')
  }
  const edyoucatedAWSRegion = process.env.EDYOUCATED_AWS_REGION

  if(!('EDYOUCATED_API_URL' in process.env)) {
    throw new Error('EDYOUCATED_API_URL is unset')
  }
  const edyoucatedAPIURL = process.env.EDYOUCATED_API_URL

  if(!('EDYOUCATED_ORGANIZATION_ID' in process.env)) {
    throw new Error('EDYOUCATED_ORGANIZATION_ID is unset')
  }
  const edyoucatedOrganizationID = process.env.EDYOUCATED_ORGANIZATION_ID

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    env,
    jwtKey,
    edyoucatedUsername,
    edyoucatedPassword,
    edyoucatedUserPoolID,
    edyoucatedClientID,
    edyoucatedAWSRegion,
    edyoucatedAPIURL,
    edyoucatedOrganizationID,
    debug
  }
}
