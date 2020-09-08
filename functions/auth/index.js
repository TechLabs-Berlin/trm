const GoogleAuth = require('google-auth-library')
const jwt = require('jsonwebtoken')

exports.handler = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
    return
  }
  if (req.method !== 'POST') {
    res.status(405).send('method not allowed')
    return
  }

  let code
  if('code' in req.body) {
    code = req.body.code
  } else {
    res.status(400).send('no code')
    return
  }

  // Fetch Access Token from Google
  const oauth2 = new GoogleAuth.OAuth2Client({
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    redirectUri: 'postmessage' // important if code received through client-side "Sign in with Google" button
  })
  const tokenRes = await oauth2.getToken(code)
  // const accessToken = tokenRes.tokens.access_token
  const idToken = tokenRes.tokens.id_token
  const ticket = await oauth2.verifyIdToken({
    idToken,
    audience: process.env.OAUTH_CLIENT_ID
  })
  const hd = ticket.payload.hd
  const name = ticket.payload.name
  const email = ticket.payload.email
  if(hd !== process.env.GSUITE_DOMAIN) {
    res.status(400).send('invalid gsuite domain')
    return
  }

  const token = jwt.sign({
    name,
    email,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['admin'],
      'x-hasura-default-role': 'admin'
    }
  }, process.env.JWT_KEY)

  res.status(200).send(JSON.stringify({token}))
  return
}
