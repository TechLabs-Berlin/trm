const querystring = require('querystring')
const { auth } = require('google-auth-library')

module.exports = ({fetch, log, config}) => {
  return {
    // returns the email addresses of the Google Groups the user is a member of
    // e.g. ['team_berlin@techlabs.org']
    getGroupMemberships: async ({userKey}) => {
      const client = auth.fromJSON(config.googleServiceAccountJSON)
      client.scopes = ['https://www.googleapis.com/auth/admin.directory.group.readonly']
      client.subject = config.googleImpersonateSubject
      const tokens = await client.authorize()

      const query = querystring.stringify({ userKey })
      const resp = await fetch(
        `https://www.googleapis.com/admin/directory/v1/groups?${query}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokens.access_token}`
          }
        }
      )

      const result = await resp.json()

      if(!resp.ok) {
        log.debug(`Google API returned an error`, { error: result })
        return Promise.reject({
          reason: `Google API responded with ${resp.status}`,
          error: result
        })
      }

      if(!('groups' in result)) {
        return Promise.reject({
          reason: `Google API returned invalid response, expected to find groups`,
          error: result
        })
      }

      // groups is
      // [
      //   {
      //     kind: 'admin#directory#group',
      //     id: 'abc',
      //     etag: 'def',
      //     email: 'team_berlin@techlabs.org',
      //     name: 'mgmt_team_berlin',
      //     directMembersCount: '20',
      //     description: '',
      //     adminCreated: true
      //   }
      // ]
      return result.groups.map(group => group.email)
    }
  }
}
