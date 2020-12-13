const querystring = require('querystring')
const { GoogleAuth } = require('google-auth-library')

module.exports = ({fetch, log, config}) => {
  return {
    // returns the email addresses of the Google Groups the user is a member of
    // e.g. ['team_berlin@techlabs.org']
    getGroupMemberships: async ({userKey}) => {
      const client = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/admin.directory.group.readonly'],
        clientOptions: {
          subject: config.googleImpersonateSubject,
        },
      })
      const query = querystring.stringify({ userKey })
      const url = `https://www.googleapis.com/admin/directory/v1/groups?${query}`
      const headers = await client.getRequestHeaders(url)

      const resp = await fetch(
        `https://www.googleapis.com/admin/directory/v1/groups?${query}`,
        {
          headers: {
            'Accept': 'application/json',
            ...headers,
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
