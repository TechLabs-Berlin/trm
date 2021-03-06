const GoogleAuth = require('google-auth-library')
const jwt = require('jsonwebtoken')
const newGoogleStore = require('../store/google')

exports.buildHandler = ({ config, fetch, log }) => {
  const google = newGoogleStore({
    fetch,
    log,
    config,
  })
  const authorization = require('../store/authorization')({ log })
  const jwtUtil = require('../util/jwt')({
    jwtKey: config.jwtKey
  })
  const buildTRMAPI = require('trm-api')({
    graphqlURL: config.graphqlURL,
    token: jwtUtil.generate(),
    fetch,
    log
  })

  return async (req, res) => {
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
      clientId: config.oAuthClientID,
      clientSecret: config.oAuthClientSecret,
      redirectUri: 'postmessage' // important if code received through client-side "Sign in with Google" button
    })
    const tokenRes = await oauth2.getToken(code)
    const accessToken = tokenRes.tokens.access_token
    const idToken = tokenRes.tokens.id_token
    const ticket = await oauth2.verifyIdToken({
      idToken,
      audience: config.oAuthClientID
    })
    const hd = ticket.payload.hd
    const firstName = ticket.payload.given_name
    const lastName = ticket.payload.family_name
    const email = ticket.payload.email
    log.info(`User with email ${email} wants to log in`)
    const avatar = ticket.payload.picture
    const userKey = ticket.payload.sub
    if(hd !== config.gSuiteDomain) {
      res.status(400).send('invalid gsuite domain')
      return
    }

    const groupEmails = await google.getGroupMemberships({ userKey })
    const location = authorization.resolveLocation({ email, groupEmails })

    if(!location) {
      res.status(401).send(JSON.stringify({error: 'Your account is not associated to a TechLabs location'}))
      return
    }

    const trmAPI = await buildTRMAPI
    const teamMember = await trmAPI.createTeamMember({
      email,
      firstName,
      lastName,
      location,
    })

    const token = jwt.sign(
      authorization.getPayload({
        teamMemberID: teamMember.id,
        functionalTeam: teamMember.functional_team,
        email,
        firstName,
        lastName,
        avatar,
        groupEmails,
      }),
      config.jwtKey,
      {
        algorithm: 'HS256',
        expiresIn: '3 days'
      }
    )

    res.status(200).send(JSON.stringify({token}))
    return
  }
}
