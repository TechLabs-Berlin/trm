const querystring = require('querystring')
const GoogleAuth = require('google-auth-library')
const config = require('./config')()
const log = require('./util/logger')({
  debugLoggingEnabled: config.debug
})
const fetch = require('./util/fetch')({
  log
});

(async () => {
  try {
    const client = GoogleAuth.auth.fromJSON(config.googleApplicationCredentials)
    client.scopes = ['https://www.googleapis.com/auth/admin.directory.group.readonly']
    client.subject = config.googleImpersonateSubject
    const tokens = await client.authorize()

    const userKey = 'felix.seidel@techlabs.org'
    const query = querystring.stringify( { userKey })
    const resp = await fetch(
      `https://admin.googleapis.com/admin/directory/v1/groups?${query}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokens.access_token}`
        }
      }
    )


    const { groups } = await resp.json()



  } catch(e) {
    console.error(e)
  }
})()

