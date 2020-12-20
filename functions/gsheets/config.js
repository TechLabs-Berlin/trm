module.exports = () => {
  const env = process.env.NODE_ENV || 'production'

  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    env,
    jwtKey,
    debug
  }
}
